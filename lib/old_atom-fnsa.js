'use babel';

import AtomFnsaView from './atom-fnsa-view';
import { CompositeDisposable } from 'atom';

export default {

  atomFnsaView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomFnsaView = new AtomFnsaView(state.atomFnsaViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomFnsaView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-fnsa:toggle': () => this.toggle()
    }));
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
  }

};
