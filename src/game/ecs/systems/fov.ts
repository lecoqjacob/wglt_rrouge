import ECS, { FieldOfView, IMap, Player, Position, all } from '@/ecs';
import { computeFOV } from '@/gamemap';

export function createFovSystem() {
  const fovQuery = ECS.createQuery(all(Position), all(FieldOfView));

  return () => {
    const map = IMap.get;

    for (let i = 0; i < fovQuery.a.length; i++) {
      const arch = fovQuery.a[i].e;
      for (let j = arch.length - 1; j >= 0; j--) {
        // Backward iteration helps prevent double counting entities
        const entity = arch[j];

        if (FieldOfView.isDirty[entity]) {
          FieldOfView.isDirty[entity] = false;

          const [x, y] = [Position.x[entity], Position.y[entity]];
          FieldOfView.visibleTiles[entity] = computeFOV(x, y, FieldOfView.radius[entity], map);

          if (entity === Player.get) {
            map.computeFov(Position.x[entity], Position.y[entity], FieldOfView.radius[entity]);
            map.updateExplored();
          }
        }
      }
    }
  };
}
