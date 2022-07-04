import { GUI, Point, RNG, Terminal } from '@lecoqjacob/wglt';
import { Engine, AppState } from 'main';

import { createFovSystem, createPlayerSystem, createRenderSystem, IMap } from '@/ecs';

import { GameMap } from './gamemap';
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

export class Game implements AppState {
  readonly engine: Engine;
  readonly rng: RNG;
  readonly term: Terminal;
  readonly gui: GUI;

  readonly player: number;

  map: GameMap;

  fovSystem: System<[]>;
  renderSystem: System<[]>;
  playerSystem: System<[delta: Maybe<Point>]>;

  constructor(engine: Engine) {
    this.engine = engine;
    this.term = engine.term;
    this.gui = engine.gui;

    this.rng = new RNG(Date.now());
    this.map = GameMap.new_map();
    IMap.get = this.map;

    // Entities
    this.player = Spawner.spawnPlayer(this.map.rooms[0].getCenter());

    // Spawner.spawnAI(this.world, this.map.rooms[1].getCenter());

    // create the systems
    this.playerSystem = createPlayerSystem();
    this.renderSystem = createRenderSystem(this.term);
    this.fovSystem = createFovSystem();
  }

  renderAll(): void {
    const term = this.term;
    term.clear();

    // Draw Map
    this.map.draw(term);
    // // Draw Entities
    this.renderSystem();

    this.gui.handleInput();

    // Draw GUI
    this.gui.draw();
  }

  update(): void {
    this.playerSystem(this.term.getMovementKey());
    this.fovSystem();
    this.renderAll();
  }
}
