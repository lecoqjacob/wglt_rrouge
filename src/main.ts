import { GUI, Terminal } from '@lecoqjacob/wglt';

import { Engine } from './game/Engine';
import { MainMenu } from './game/menu';
import './style.css';
import './globals';

const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

export interface AppState {
  update(delta: number): void;
}

export class App {
  readonly term: Terminal;
  readonly gui: GUI;

  state: AppState;
  mainMenu: MainMenu;
  game?: Engine;

  constructor() {
    this.term = new Terminal(this.getCanvas(), SCREEN_WIDTH, SCREEN_HEIGHT);

    this.gui = new GUI(this.term);
    this.mainMenu = new MainMenu(this);
    this.state = this.mainMenu;

    this.term.update = (delta) => this.state.update(delta);
  }

  private getCanvas(): HTMLCanvasElement {
    let canvas = document.querySelector('canvas');
    if (!canvas) {
      console.warn('Canvas element not found. Generating canvas...');
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    }

    return canvas;
  }

  newGame(): void {
    this.game = new Engine(this);
    this.state = this.game;
  }

  continueGame(): void {
    if (this.game) {
      this.state = this.game;
    }
  }
}

new App();
