import ECS, { types } from '@/ecs';

export interface IRenderable {
  glyph: number;
  color: number;
}

export const Renderable = ECS.defineComponent({
  glyph: types.int8,
  color: types.uint32,
});

export default Renderable;
