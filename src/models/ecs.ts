import { System as ApeSystem } from 'ape-ecs';

import { ECS } from '@/ecs';

export class System extends ApeSystem {
  declare world: ECS;
}
