import ECS, { all } from '@/ecs';

import { Position, BlocksTile, IMap } from '../components';

export function createMapIndexSystem() {
  const renderQuery = ECS.createQuery(all(Position), all(BlocksTile));

  return () => {
    const map = IMap.get;

    for (let i = 0; i < renderQuery.a.length; i++) {
      const arch = renderQuery.a[i].e;
      for (let j = arch.length - 1; j >= 0; j--) {
        // Backward iteration helps prevent double counting entities
        const entity = arch[j];

        const x = Position.x[entity];
        const y = Position.y[entity];

        map.grid[y][x].blocked = true;
      }
    }
  };
}
