const { makeDirectory, makeFile, removeFile, getFilesFromDirectory } = require('./FileActions');
const { tasks, actions } = require('./Enums');
const args = require('./ManageArgs');

const DEFAULT_README_COUNT = 70;
const DEFAULT_PROJECT_COUNT = 2;

async function manageDirectories() {
    const params = await args.getParams();
    switch (params.action.id) {
        case actions.TRIM:
            await deleteUnusedMarkdowns(params.baseDirectory);
            break;
        case actions.ADD:
            await writeManager(params);
            break;
        case actions.CREATE:
            await createPlatform(params);
            break;
        default:
            throw `[manageDirectories]: Invalid action provided: ${params.action.id}`;
    }
}

async function writeManager(params) {
    const { baseDirectory, platform, task, data } = params;
    switch (task.id) {
        case tasks.MARKDOWN:
            await writeAdditionalMarkdowns(baseDirectory, data[0])
            break;
        case tasks.PROJECTS:
            await writeAdditionalBasicProjects(baseDirectory, data[0]);
            break;
        default:
            throw `[writeManager]: Invalid task provided: ${task.id}`;
    }
}

async function createPlatform(params) {
    const { baseDirectory, platform, epic } = params;
    createGeneralPlatform(baseDirectory, platform.id, epic)
}

async function createGeneralPlatform(baseDirectory, platform, epic) {
    await makeDirectory(baseDirectory, 'Exports');
    await makeDirectory(baseDirectory, 'Notes', ['dev']);
    await makeDirectory(baseDirectory, 'Notes', ['images']);
    await writeAdditionalMarkdowns(baseDirectory, DEFAULT_README_COUNT);
    await makeDirectory(baseDirectory, 'Projects');
    await writeAdditionalBasicProjects(baseDirectory, DEFAULT_PROJECT_COUNT);
}

async function deleteUnusedMarkdowns(baseDirectory) {
    const updatedBaseDirectory = baseDirectory.concat(['Notes', 'dev'])
    const fileList = await getFilesFromDirectory(updatedBaseDirectory);
    fileList.map(async (fileName) => {
        await removeFile(updatedBaseDirectory, fileName);
    });
}

async function writeAdditionalMarkdowns(baseDirectory, amount) {
    const devDirectory = baseDirectory.concat(['Notes', 'dev']);
    const imageDirectory = baseDirectory.concat(['Notes', 'images']);
    const fileList = await getFilesFromDirectory(devDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            //create mds
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey + 1).toString().padStart(2, '0');
            const devText = `# DEV-${paddedNumber},\n### Link:[<>]\n#### Tags: []\n\n${createImageLinksString(12, paddedNumber)}`;
            await makeFile(devDirectory, `DEV-${paddedNumber}.md`, devText);

            //create image folders
            const newImageDirectory = `DEV-${paddedNumber}`;
            await makeDirectory(imageDirectory, newImageDirectory);
        });
    }
}

function createImageLinksString(amount, paddedNumber) {
    let idx = 1;
    let str = '';
    letterList = ['A', 'B', 'C', 'D', 'E'];
    for (let letterIdx = 0; letterIdx < letterList.length; letterIdx++){
      str += `## Topic ${letterList[letterIdx]}\n`
      for(let idx = 1; idx <= amount; idx++){
        str += `![](../images/DEV-${paddedNumber}/DEV-${paddedNumber}-${letterList[letterIdx]}${idx}.png)\n\n`
      }
    }
    return str;
}

async function writeAdditionalBasicProjects(baseDirectory, amount) {
    const exportsDirectory = baseDirectory.concat(['Exports']);
    const projectsDirectory = baseDirectory.concat(['Projects']);
    const fileList = await getFilesFromDirectory(projectsDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey).toString().padStart(2, '0');
            const name = offset == 0 && key == 0 ? 'PROJ-PLAYGROUND' : `PROJ-${paddedNumber}`
            await makeDirectory(projectsDirectory, name);
            await makeDirectory(exportsDirectory, name);
        });
    }
}

exports.manageDirectories = manageDirectories;
