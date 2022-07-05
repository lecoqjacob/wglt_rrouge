import { Cell } from '@lecoqjacob/wglt';

import ECS, { types } from '@/ecs';

export interface IFieldOfView {
  isDirty: boolean;
  radius: number;
  visibleTiles: Cell[][];
}

export const FieldOfView = ECS.defineComponent({
  radius: types.int8,
  isDirty: types.custom<boolean>(),
  visibleTiles: types.custom<Cell[][]>(),
});

export default FieldOfView;
