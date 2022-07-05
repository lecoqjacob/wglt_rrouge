import { GUI, Point, RNG, Terminal } from '@lecoqjacob/wglt';
import { AppState, App } from 'main';

import {
  createFovSystem,
  createPlayerSystem,
  createRenderSystem,
  FieldOfView,
  IMap,
  Position,
  Renderable,
} from '@/ecs';

import { GameMap, Camera } from './gamemap';
import { Maybe, System } from './models';
import { Spawner } from './spawner';

// Actual size of the window
// const SCREEN_WIDTH = 80;
// const SCREEN_HEIGHT = 45;

// Sizes and coordinates relevant for the GUI
// const BAR_WIDTH = 20;
// const PANEL_HEIGHT = 7;
// const PANEL_Y = SCREEN_HEIGHT - PANEL_HEIGHT;
// const MSG_X = BAR_WIDTH + 2;
// const MSG_HEIGHT = PANEL_HEIGHT - 1;

// Parameters for dungeon generator
// const TORCH_RADIUS = 10;

export class Engine implements AppState {
  readonly app: App;
  readonly rng: RNG;
  readonly term: Terminal;
  readonly gui: GUI;
  readonly camera: Camera;

  readonly player: number;

  map: GameMap;

  fovSystem: System<[]>;
  renderSystem: System<[]>;
  playerSystem: System<[delta: Maybe<Point>]>;

  constructor(app: App) {
    this.app = app;
    this.term = app.term;
    this.gui = app.gui;

    this.rng = new RNG(Date.now());
    this.map = GameMap.new_map(80, 50);
    IMap.get = this.map;

    this.camera = new Camera(this, this.map.width, this.map.height);

    // Entities
    this.player = Spawner.spawnPlayer(this.map.rooms[0].getCenter());

    Spawner.spawnAI(this.map.rooms[1].getCenter());

    // create the systems
    this.playerSystem = createPlayerSystem();
    this.renderSystem = createRenderSystem(this.term);
    this.fovSystem = createFovSystem();

    this.term.grid.forEach((cells) => {
      cells.forEach((cell) => {
        cell.setBackground(0);
      });
    });
  }

  renderAll(): void {
    const term = this.term;
    term.clear();

    // Draw Map
    this.camera.render();
    this.gui.handleInput();

    // Draw GUI
    this.gui.draw();
  }

  update(): void {
    this.playerSystem(this.term.getMovementKey());
    this.fovSystem();
    this.renderAll();
  }

  getPosition(entity: number): Point {
    return new Point(Position.x[entity], Position.y[entity]);
  }

  getRenderable(entity: number) {
    return {
      glyph: Renderable.glyph[entity],
      color: Renderable.color[entity],
    };
  }

  getFOV(entity: number) {
    return {
      radius: FieldOfView.radius[entity],
      isDirty: FieldOfView.isDirty[entity],
      visibleTiles: FieldOfView.visibleTiles[entity],
    };
  }
}
