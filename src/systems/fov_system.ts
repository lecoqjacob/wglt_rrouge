import { Query } from 'ape-ecs';

import { GameMap } from '@/map';
import { System } from '@/models/ecs';

import { FieldOfView, Position } from '../components';

export class FovSystem extends System {
  visibilityQuery: Query = this.createQuery().fromAll(Position, FieldOfView);

  update(_tick: number) {
    const player = this.world.getEntity('Player');

    for (const entity of this.visibilityQuery.execute()) {
      const [pos, fov] = [entity.getOne(Position)!, entity.getOne(FieldOfView)!];

      if (fov.isDirty) {
        fov.console.computeFov(pos.x, pos.y, fov.radius);

        const tiles = fov.console.grid.map((cells) => {
          return cells.filter((cell) => {
            return cell.visible;
          });
        });

        fov.update({
          visible_tiles: tiles,
          isDirty: false,
        });

        if (entity === player) {
          console.log('is player');
          this.world.getResource(GameMap).computeFov(pos.x, pos.y, fov.radius);
        }
      }
    }
  }
}
