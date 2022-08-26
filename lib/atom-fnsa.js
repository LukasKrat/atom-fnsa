'use babel';

import AtomFnsaView from './atom-fnsa-view';
import { CompositeDisposable } from 'atom';
import { insertDate, createNewFile } from './replacer'
const path = require('path');

export default {

  atomFnsaView: null,
  modalPanel: null,
  subscriptions: null,

  //Your config schema
  config:
  {
    filenamesyntax: {
      type: 'string',
      default: "YYYYMMDD_"
    },
    excludepaths: {
      type: 'array',
      default: ['.git', 'node_modules'],
      items: {
        type: 'string'
      }
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

    this.subscriptions.add(atom.project.onDidChangeFiles(events =>
    {

      for (const event of events)
      {

        if (event.action === 'created')
        {

          let filePath = event.path;
          let currentFileName = path.basename(filePath);

          let prefix = atom.config.get('atom-fnsa.filenamesyntax').toString();

          let newFileName = insertDate(prefix, currentFileName);

          createNewFile(filePath, newFileName);
        }

        break;
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },


};
