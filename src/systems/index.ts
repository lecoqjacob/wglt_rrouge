import { FovSystem } from './fov_system';

export const SYSTEM_EXECUTION_NAMES = {
  render: 'render',
  aisystems: 'aisystems',
  everyframe: 'everyframe',
};

export default {
  // [SYSTEM_EXECUTION_NAMES.aisystems]: [AISystem],
  [SYSTEM_EXECUTION_NAMES.everyframe]: [FovSystem],
  // [SYSTEM_EXECUTION_NAMES.render]: [RenderSystem],
};
