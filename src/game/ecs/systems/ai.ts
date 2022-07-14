import ECS, { AI, Position, all } from '@/ecs';

export function createAISystem() {
  const fovQuery = ECS.createQuery(all(Position, AI));

  return () => {
    for (let i = 0; i < fovQuery.a.length; i++) {
      const arch = fovQuery.a[i].e;
      for (let j = arch.length - 1; j >= 0; j--) {
        // Backward iteration helps prevent double counting entities
        const entity = arch[j];
        console.log(
          `AI# ${entity} Screams that they are located @ ${Position.x[i]}, ${Position.y[i]}`,
        );
      }
    }
  };
}
