import { ComponentArray } from 'wolf-ecs';

import ECS from '@/ecs';
import { GameMap } from '@/gamemap';

export const IMap = ECS.defineComponent() as ComponentArray & { get: GameMap };
export const Player = ECS.defineComponent() as ComponentArray & { get: number };
export const AI = ECS.defineComponent();
export const BlocksTile = ECS.defineComponent();
