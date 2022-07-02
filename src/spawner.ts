import { Colors, Point } from '@lecoqjacob/wglt';
import { Entity } from 'ape-ecs';

import { Position } from './components';
import { ECS } from './ecs';
import { GameMap } from './map';

export class Spawner {
  static spawnPlayer(ecs: ECS, pt: Point, map: GameMap): Entity {
    const player = ecs.createEntity({
      id: 'Player',
      tags: ['Player'],
      c: {
        Position: {
          id: Position.name,
          x: pt.x,
          y: pt.y,
        },
        Renderable: {
          glyph: '@',
          color: Colors.YELLOW,
        },
        FieldOfView: {
          radius: 8,
          map,
        },
      },
    });

    return player;
  }
}
