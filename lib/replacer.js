'use babel';

const moment = require("moment");
const path = require("path");
const fs = require("fs");

function insertDate(prefixTemplate, currentFileName) {
  let today = moment();
  let prefix = today.format(prefixTemplate);
  let finalFileName = prefix + currentFileName;

  return finalFileName;
}

function createNewFile(filePath, newFileName) {

  let fileBasePath = path.dirname(filePath);


  let filePathNew = path.join(fileBasePath, newFileName);

  if (isExcluded(fileBasePath)) return;

  fs.exists(filePathNew, fExists =>
  {
    if (fExists) return;
    askConfirm(filePath, fileBasePath, filePathNew);

  })
}

function isExcluded(filePath) {
  let excludepaths = atom.config.get('atom-fnsa.excludepaths');
  for (const excluded of excludepaths) {
    if (filePath.includes(excluded)) return true;
  }
  return false;
}

function askConfirm(filePath, fileBasePath, filePathNew) {
  atom.confirm({message: "Apply default filename-syntax?\n", buttons: ["Cancel", "Confirm"]}, res =>
  {
    if (res)
    {
      let fileBasePath = path.dirname(filePath);
      let currentFileName = path.basename(filePath);

        fs.rename(filePath, filePathNew, err =>
        {
          if (err) throw err;
        });

        updateEditor(filePathNew);
      }
  })

}

function updateEditor(filePath) {
  let activeTextEditor = atom.workspace.getActiveTextEditor();
  if (activeTextEditor != undefined)
  {
    activeTextEditor.destroy();
  }
  atom.workspace.open(filePath)
}

export {insertDate, createNewFile}
