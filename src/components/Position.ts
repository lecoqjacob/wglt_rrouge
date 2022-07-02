import { Component, EntityRef } from 'ape-ecs';

export class Position extends Component {
  x!: number;
  y!: number;

  static typeName = 'Position';
  static spinup = 10;
  static properties = {
    x: 0,
    y: 0,
    parent: EntityRef,
  };

  preDestroy() {
    console.log(`Boom position: [${this.x}, ${this.y}`);
  }

  add(otherX: number, otherY: number) {
    return { x: this.x + otherX, y: this.y + otherY };
  }
}
