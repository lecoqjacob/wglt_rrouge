import { Terminal } from '@lecoqjacob/wglt';

import ECS, { all } from '@/ecs';

import { Position, Renderable } from '../components';

export function createRenderSystem(term: Terminal) {
  const renderQuery = ECS.createQuery(all(Position), all(Renderable));

  return () => {
    for (let i = 0; i < renderQuery.a.length; i++) {
      const arch = renderQuery.a[i].e;
      for (let j = arch.length - 1; j >= 0; j--) {
        // Backward iteration helps prevent double counting entities
        const entity = arch[j];

        const x = Position.x[entity];
        const y = Position.y[entity];
        const glyph = Renderable.glyph[entity];
        const color = Renderable.color[entity];

        term.drawChar(x, y, glyph, color);
      }
    }
  };
}
