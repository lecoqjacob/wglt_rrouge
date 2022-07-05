import { Colors, Point } from '@lecoqjacob/wglt';

import ECS, { AI, FieldOfView, Player, Position, Renderable } from '@/ecs';

export const Spawner = {
  spawnPlayer(point: Point) {
    const player = ECS.createEntity();

    ECS.withTag(player, Player, { get: player })
      .withComponent(player, Position, { x: point.x, y: point.y })
      .withComponent(player, Renderable, { glyph: '@'.to_cp437(), color: Colors.YELLOW })
      .withComponent(player, FieldOfView, { isDirty: true, radius: 8 });

    return player;
  },
  spawnAI(point: Point) {
    const ai = ECS.createEntity();

    ECS.withTag(ai, AI)
      .withComponent(ai, Position, { x: point.x, y: point.y })
      .withComponent(ai, Renderable, { glyph: 'g'.to_cp437(), color: Colors.DARK_RED })
      .withComponent(ai, FieldOfView, { isDirty: true, radius: 6 });

    return ai;
  },
};
