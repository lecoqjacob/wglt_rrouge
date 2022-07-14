import { Point } from 'wglt';

import ECS, { all } from '@/ecs';
import { Engine } from '@/Engine';
import { Maybe, System } from '@/models';
import { TurnState } from '@/turn_state';

import { FieldOfView, IMap, Player, Position } from '../components';

export function createPlayerSystem(engine: Engine): System {
  const playerQuery = ECS.createQuery(all(Player), all(Position));

  return (delta: Maybe<Point>) => {
    playerQuery.forEach((e) => {
      if (delta) {
        try_move_player(e, delta);
        engine.transitionState(TurnState.PlayerTurn);
      }
    });
  };
}

export const try_move_player = (player: number, delta: Point) => {
  const map = IMap.get;
  const destination = { x: Position.x[player] + delta.x, y: Position.y[player] + delta.y };

  if (!map.isBlocked(destination.x, destination.y)) {
    Position.x[player] += delta.x;
    Position.y[player] += delta.y;
    FieldOfView.isDirty[player] = true;
  }
};
