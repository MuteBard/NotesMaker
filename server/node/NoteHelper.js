const { makeDirectory, makeFile, removeFile, removeFolder, getFilesFromDirectory } = require('./FileActions');
const settings = require('../settings/projectPaths');
const { IMAGE_COUNT } = require('../settings/getEnv');

async function createNoteSpace(directory, inputs) {
    const { checkboxes, markdown, project } = inputs;

    if (checkboxes.EXPORTS) {
        await makeDirectory(`${directory}/Exports`);
    }
    if (checkboxes.MARKDOWNS) {
        await makeDirectory(`${directory}/Notes/dev`);
        await makeDirectory(`${directory}/Notes/images`);
        await writeAdditionalMarkdowns(directory, markdown.count || 1);
    }
    if (checkboxes.PROJECTS) {
        await makeDirectory(`${directory}/Projects`);
        await writeAdditionalProjects(directory, project.count || 1);
    }
}

async function manageMarkDowns(directory, inputs) {
    const { markdown } = inputs;

    if (markdown.action === 'ADD') {
        await writeAdditionalMarkdowns(directory, markdown.count);
    }
}

async function manageProjects(directory, inputs) {
    const { project } = inputs;

    if (project.action === 'ADD') {
        await writeAdditionalProjects(directory, project.count);
    }
}

function getDirectory(folder, subfolder) {
    const { BLENDER, GODOT, UNITY, MATH, SUBSTANCE_PAINTER } = settings;
    let path;
    switch (folder) {
        case BLENDER.key:
            path = BLENDER.path;
            break;
        case GODOT.key:
            path = GODOT.path;
            break;
        case UNITY.key:
            path = UNITY.path;
            break;
        case MATH.key:
            path = MATH.path;
            break;
        case SUBSTANCE_PAINTER.key:
            path = SUBSTANCE_PAINTER.path;
            break;
        default:
            throw new Error('Input directory choice is empty');
    }

    return [`${path}/${subfolder}`];
}

async function writeAdditionalMarkdowns(directory, amount) {
    const devDirectory = `${directory}/Notes/dev`;
    const imageDirectory = `${directory}/Notes/images`;
    const imagesPerTopic = IMAGE_COUNT;

    const fileList = await getFilesFromDirectory(devDirectory);
    if (fileList) {
        const offset = fileList.length;
        [...Array(amount).keys()].map(async (key) => {
            //create mds
            const updatedKey = offset + key;
            const paddedNumber = (updatedKey + 1).toString().padStart(2, '0');
            const devText = `# DEV-${paddedNumber},\n### Link:[<>]\n#### Tags: []\n${createImageLinksString(imagesPerTopic, paddedNumber)}`;
            await makeFile(`${devDirectory}/DEV-${paddedNumber}.md`, devText);

            //create image folders
            await makeDirectory(`${imageDirectory}/DEV-${paddedNumber}`);
        });
    }
}

async function writeAdditionalProjects(directory, amount) {
    const projectsDirectory = `${directory}/Projects`;
    const fileList = await getFilesFromDirectory(projectsDirectory);
    const offset = !fileList ? 0 : fileList.length;

    [...Array(amount).keys()].map(async (key) => {
        const updatedKey = offset + key;
        const paddedNumber = (updatedKey).toString().padStart(2, '0');
        const name = offset == 0 && key == 0 ? 'PROJ-PLAYGROUND' : `PROJ-${paddedNumber}`

        //create project folders
        await makeDirectory(`${projectsDirectory}/${name}`);
    });

}

function createImageLinksString(amount, paddedNumber) {
    let str = '';
    letterList = ['A', 'B', 'C', 'D', 'E'];
    for (let letterIdx = 0; letterIdx < letterList.length; letterIdx++) {
        str += `\n## Topic ${letterList[letterIdx]}\n`
        for (let idx = 1; idx <= amount; idx++) {
            str += `<img src="../images/DEV-${paddedNumber}/DEV-${paddedNumber}-${letterList[letterIdx]}${idx}.png" width="500"/>\n`
        }
    }
    return str;
}
//FIX LATER
// async function deleteUnusedMarkdowns(directory) {
//     const updatedBaseDirectory = directory.concat(['Notes', 'dev'])
//     const fileList = await getFilesFromDirectory(updatedBaseDirectory);
//     fileList.map(async (fileName) => {
//         const removedFileName = await removeFile(updatedBaseDirectory, fileName);
//         if(removedFileName != null){
//             const folderToBeRemoved = removedFileName.split('.')[0];
//             await removeFolder(directory.concat(['Notes', 'images']), folderToBeRemoved);
//         }
//     });
// }

exports.createNoteSpace = createNoteSpace;
exports.manageMarkDowns = manageMarkDowns;
exports.manageProjects = manageProjects;
exports.getDirectory = getDirectory;