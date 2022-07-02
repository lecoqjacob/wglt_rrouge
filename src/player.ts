import { Point } from '@lecoqjacob/wglt';

import { Maybe } from '@/models';

import { FieldOfView, Position } from './components';
import { ECS } from './ecs';
import { GameMap } from './map';

export const try_move_player = (ecs: ECS, delta_pt: Point) => {
  const map = ecs.getResource<GameMap>(GameMap);
  const player = ecs.getEntity('Player')!;

  const player_pos = player.getOne<Position>(Position)!;
  const player_fov = player.getOne<FieldOfView>(FieldOfView)!;
  const destination = player_pos.add(delta_pt.x, delta_pt.y);

  if (!map.isBlocked(destination.x, destination.y)) {
    player_pos.update({
      x: player_pos.x + delta_pt.x,
      y: player_pos.y + delta_pt.y,
    });

    player_fov.update({
      isDirty: true,
    });
  }
};

export const player_input = (ecs: ECS, movementKey: Maybe<Point>) => {
  if (movementKey) {
    try_move_player(ecs, movementKey);
  }
};
