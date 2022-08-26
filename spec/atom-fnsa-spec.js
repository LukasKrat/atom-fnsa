'use babel';

import AtomFnsa from '../lib/atom-fnsa';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomFnsa', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-fnsa');
  });

  describe('when the atom-fnsa:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.atom-fnsa')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-fnsa:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        expect(workspaceElement.querySelector('.atom-fnsa')).toExist();

        let atomFnsaElement = workspaceElement.querySelector('.atom-fnsa');
        expect(atomFnsaElement).toExist();

        let atomFnsaPanel = atom.workspace.panelForItem(atomFnsaElement);
        expect(atomFnsaPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'atom-fnsa:toggle');
        expect(atomFnsaPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.atom-fnsa')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-fnsa:toggle');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        // Now we can test for view visibility
        let atomFnsaElement = workspaceElement.querySelector('.atom-fnsa');
        expect(atomFnsaElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'atom-fnsa:toggle');
        expect(atomFnsaElement).not.toBeVisible();
      });
    });
  });
});
