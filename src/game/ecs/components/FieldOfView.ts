import { Cell } from '@lecoqjacob/wglt';

import ECS, { types } from '@/ecs';

export const FieldOfView = ECS.defineComponent({
  radius: types.int8,
  isDirty: types.int8,
  visibleTiles: types.custom<Cell[][]>(),
});

export default FieldOfView;
