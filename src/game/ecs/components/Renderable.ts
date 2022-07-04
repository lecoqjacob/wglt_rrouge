import ECS, { types } from '@/ecs';

export const Renderable = ECS.defineComponent({
  glyph: types.int8,
  color: types.uint32,
});

export default Renderable;
