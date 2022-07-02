import { Cell, Console } from '@lecoqjacob/wglt';
import { Component } from 'ape-ecs';

import { GameMap } from '@/map';

export class FieldOfView extends Component {
  static spinup = 5;
  static typeName = 'FieldOfView';

  static properties = {
    radius: 0,
    isDirty: true,
    visible_tiles: [],
    console: undefined,
  };

  init({ map }: { map: GameMap }) {
    this.console = new Console(map.width, map.height);
  }

  console!: Console;
  visible_tiles!: Cell[][];
  radius!: number;
  isDirty!: boolean;
}
