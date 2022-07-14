import { AppState, App } from 'main';
import { match } from 'ts-pattern';
import { GUI, Point, RNG, Terminal } from 'wglt';

import {
  createFovSystem,
  createMapIndexSystem,
  createPlayerSystem,
  createRenderSystem,
  FieldOfView,
  IMap,
  Position,
  Renderable,
} from '@/ecs';

import { createAISystem } from './ecs/systems/ai';
import { GameMap, Camera } from './gamemap';
import { Maybe, System } from './models';
import { Spawner } from './spawner';
import { TurnState } from './turn_state';

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

  state: TurnState;

  map: GameMap;

  fovSystem: System<[]>;
  renderSystem: System<[]>;
  playerSystem: System<[delta: Maybe<Point>]>;
  indexing_system: System<[]>;
  ai_system: System<[]>;

  constructor(app: App) {
    this.app = app;
    this.term = app.term;
    this.gui = app.gui;
    this.state = TurnState.PreRun;

    this.rng = new RNG(Date.now());
    this.map = GameMap.new_map(80, 50);
    IMap.get = this.map;

    this.camera = new Camera(this, this.map.width, this.map.height);

    // Entities
    this.player = Spawner.spawnPlayer(this.map.rooms[0].getCenter());

    this.map.rooms.slice(1).forEach((room) => Spawner.spawnAI(room.getCenter()));

    // create the systems
    this.playerSystem = createPlayerSystem(this);
    this.renderSystem = createRenderSystem(this.term);
    this.fovSystem = createFovSystem();
    this.indexing_system = createMapIndexSystem();
    this.ai_system = createAISystem();

    this.term.grid.forEach((cells) => {
      cells.forEach((cell) => {
        cell.setBackground(0);
      });
    });
  }

  transitionState(new_state: TurnState) {
    this.state = new_state;
  }

  runSystems() {
    this.indexing_system();
    this.fovSystem();
    this.ai_system();
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
    match(this.state)
      .with(TurnState.PreRun, () => {
        this.runSystems();
        this.state = TurnState.WaitingForInput;
      })
      .with(TurnState.WaitingForInput, () => this.playerSystem(this.term.getMovementKey()))
      .with(TurnState.PlayerTurn, () => {
        this.runSystems();
        this.transitionState(TurnState.AiTurn);
      })
      .with(TurnState.AiTurn, () => {
        this.runSystems();
        this.transitionState(TurnState.WaitingForInput);
      })
      .run();

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
