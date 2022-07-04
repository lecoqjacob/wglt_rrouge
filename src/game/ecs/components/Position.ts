import { types } from 'wolf-ecs';

import ECS from '@/ecs';

export const Position = ECS.defineComponent({
  x: types.f32,
  y: types.f32,
});

export default Position;
