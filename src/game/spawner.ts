import { Colors, Point } from '@lecoqjacob/wglt';

import ECS, { FieldOfView, Player, Position, Renderable } from '@/ecs';

export const Spawner = {
  spawnPlayer(point: Point) {
    const player = ECS.createEntity();

    ECS.withTag(player, Player, { get: player })
      .withComponent(player, Position, { x: point.x, y: point.y })
      .withComponent(player, Renderable, { glyph: '@'.to_cp437(), color: Colors.YELLOW })
      .withComponent(player, FieldOfView, { isDirty: true, radius: 4 });

    return player;
  },
};
