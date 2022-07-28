const settings = require('../settings/projectPaths')
const { getFoldersFromDirectory } = require('./FileActions');
const { getDirectory, createNoteSpace, manageMarkDowns, manageProjects } = require('./NoteHelper');


function getVisibleFolders() {
    return Object.values(settings).filter((value) => value.visible);
}

async function getSubFolders(key) {
    const path = settings[key].path;
    const folderNames = await getFoldersFromDirectory(path);
    const addNew = 'Add New Directory';
    folderNames.push(addNew);
    return folderNames;
}

async function createFolders(inputs) {
    const directory = getDirectory(inputs.folder, inputs.subFolder);
    await createNoteSpace(directory, inputs)
    return {};
}

async function updateMarkDown(inputs) {
    const directory = getDirectory(inputs.folder, inputs.subFolder);
    await manageMarkDowns(directory, inputs)
    return {};
}

async function updateProjects(inputs) {
    const directory = getDirectory(inputs.folder, inputs.subFolder);
    await manageProjects(directory, inputs)
    return {};
}

exports.getVisibleFolders = getVisibleFolders;
exports.getSubFolders = getSubFolders;
exports.createFolders = createFolders;
exports.updateMarkDown = updateMarkDown;
exports.updateProjects = updateProjects;