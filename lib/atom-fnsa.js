'use babel';

import AtomFnsaView from './atom-fnsa-view';
import { CompositeDisposable } from 'atom';
const path = require('path');
const fs = require('fs');

export default {

  atomFnsaView: null,
  modalPanel: null,
  subscriptions: null,

  //Your config schema
  config:
  {
    filenamesyntax: {
      type: 'string',
      default: ""
    }
  },

  activate(state) {
    this.atomFnsaView = new AtomFnsaView(state.atomFnsaViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomFnsaView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
/*
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-fnsa:insertText': () => this.insertTxt()
    }));
*/

    this.subscriptions.add(atom.project.onDidChangeFiles(events => {

      for (const event of events)
      {
        // "created", "modified", "deleted", or "renamed"
        //console.log(event.action)

        // absolute path to the filesystem entry that was touched
        //console.log(`Event path: ${event.path}`)

        if (event.action === 'created') {
          //console.log(`.. renamed from: ${event.oldPath}`)

          var filePath = event.path;
          var currentFileName = path.basename(filePath);
          var fileBasePath = path.dirname(filePath);

          var projectPaths = atom.project.getPaths();
          console.log(filePath+"\n"+projectPaths);
          var isProjFile = true;

          /*
          for(const i of projectPaths) {
              if (fileBasePath.includes(i) == true)
              {
                isProjFile = true;
                break;
              }
              else {
                isProjFile = false;
              }
          }
          */

          //if (isProjFile == true)
          //{
            atom.confirm({message: "Apply default filename-syntax?\n" + currentFileName, buttons: ["Cancel", "Confirm"]}, res =>
            {
              if (res == 1)
              {
                var filePath = event.path;
                var fileBasePath = path.dirname(filePath);
                var currentFileName = path.basename(event.path);
                var prefix = atom.config.get('atom-fnsa.filenamesyntax');
                var newFileName = prefix + "_" + currentFileName;
                var filePathNew = path.join(fileBasePath, newFileName);


                if (filePath.includes("\.git") == false)
                {
                  console.log(filePath+ "\n"+ filePathNew);

                  fs.rename(filePath ,filePathNew , (err) => {
                    if (err) throw err;
                    console.log('File Renamed!');
                  });

                  var activeTextEditor = atom.workspace.getActiveTextEditor();
                  if (activeTextEditor != undefined)
                  {
                    activeTextEditor.destroy();
                  }
                }
              }
            })
          //}
        }
      }
    }))
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomFnsaView.destroy();
  },

  serialize() {
    return {
      atomFnsaViewState: this.atomFnsaView.serialize()
    };
  },

  toggle() {
    console.log('AtomFnsa was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  insertTxt() {
    console.log("Test");
    var editor = atom.workspace.getActivePaneItem();
    console.log(editor);
    if (editor) {
      editor.insertText("Hello World");
    }
  },

  renameFile() {

  }

};
