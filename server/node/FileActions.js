const { mkdir, writeFile, listFiles } = require('./PromisifedFunctions');

async function makeDirectory(path) {
    await mkdir(path);
}

async function getFilesFromDirectory(path) {
    return listFiles(path);
}

async function makeFile(path, content) {
    await writeFile(path, content);
}

async function getFoldersFromDirectory(base) {
    const fileList = await getFilesFromDirectory(base);
    return fileList.filter((file) => !file.includes("."));
}

//FIX LATER
// async function removeFile(base, file) {
//     const destination = path.join(...base, file);
//     const data = await readFile(destination);
//     if (data.includes('#### Tags: []')) {
//         await deleteFile(destination);
//         return file;
//     }
//     return null;
// }

// async function removeFolder(base, folder) {
//     const destination = path.join(...base, folder);
//     await rmdir(destination);
// }

exports.makeDirectory = makeDirectory;
exports.makeFile = makeFile;
exports.getFilesFromDirectory = getFilesFromDirectory;
exports.getFoldersFromDirectory = getFoldersFromDirectory;

