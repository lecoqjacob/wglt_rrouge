import { loadImage2x, SelectDialog, Console, Colors } from '@lecoqjacob/wglt';
import { Engine, AppState } from 'main';

let menuBg: Console | null = null;

loadImage2x('menu.png', (result) => {
  menuBg = result;
});

export class MainMenu implements AppState {
  private readonly engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  update(): void {
    const term = this.engine.term;
    const gui = this.engine.gui;

    if (gui.dialogs.length === 0) {
      const options = ['Play a new game', 'Continue last game'];

      gui.add(
        new SelectDialog('MAIN MENU', options, (choice) => {
          switch (choice) {
            case 0:
              this.engine.newGame();
              return;
            case 1:
              this.engine.continueGame();
              return;
          }
        }),
      );
    }

    gui.handleInput();
    term.clear();

    if (menuBg && this.engine.state === this) {
      term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'Blood Ruins', Colors.YELLOW);
    term.drawCenteredString(40, 12, 'By JL', Colors.YELLOW);
    gui.draw();
  }
}
