import { loadImage2x, SelectDialog, Console, Colors } from '@lecoqjacob/wglt';

import { App, AppState } from './app';

let menuBg: Console | null = null;

loadImage2x('menu.png', (result) => {
  menuBg = result;
});

export class MainMenu implements AppState {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }

  update(): void {
    const term = this.app.term;
    const gui = this.app.gui;

    if (gui.dialogs.length === 0) {
      const options = ['Play a new game', 'Continue last game'];

      gui.add(
        new SelectDialog('MAIN MENU', options, (choice) => {
          switch (choice) {
            case 0:
              this.app.newGame();
              break;
            case 1:
              this.app.continueGame();
              break;
          }
        }),
      );
    }

    gui.handleInput();
    term.clear();

    if (menuBg) {
      term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'Blood Ruins', Colors.YELLOW);
    term.drawCenteredString(40, 12, 'By JL', Colors.YELLOW);
    gui.draw();
  }
}
