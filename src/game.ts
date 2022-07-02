import { RNG } from '@lecoqjacob/wglt';
import { Entity } from 'ape-ecs';

import { App, AppState } from './app';
import { Position, Renderable } from './components';
import { ECS } from './ecs';
import { GameMap } from './map';
import { player_input } from './player';
import { Spawner } from './spawner';
import { SYSTEM_EXECUTION_NAMES } from './systems';

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
  readonly app: App;
  readonly rng: RNG;
  readonly player: Entity;

  ecs: ECS;
  map: GameMap;

  constructor(app: App) {
    this.app = app;
    this.rng = new RNG(Date.now());

    this.map = GameMap.new_map();
    this.ecs = new ECS();

    // Entities
    this.player = Spawner.spawnPlayer(this.ecs, this.map.rooms[0].getCenter(), this.map);

    // Resources
    this.ecs.registerResource(this.map);

    console.log(this.ecs.getStats());
  }

  getPlayer(): Entity {
    return this.ecs.getEntity('Player')!;
  }

  renderAll(): void {
    const term = this.app.term;

    player_input(this.ecs, term.getMovementKey());
    this.ecs.runSystems(SYSTEM_EXECUTION_NAMES.everyframe);

    // Draw Map
    this.map.draw(term);

    // Draw Entities
    for (const entity of this.ecs.getQuery('renderableEntities').execute()) {
      const pos = entity.getOne(Position)!;
      const renderable = entity.getOne(Renderable)!;
      term.drawChar(pos.x, pos.y, renderable.glyph, renderable.color);
    }

    // Draw GUI
    this.app.gui.draw();
  }

  update(): void {
    this.renderAll();
  }
}
