import { Color, Colors } from '@lecoqjacob/wglt';
import { Component } from 'ape-ecs';

export class Renderable extends Component {
  glyph!: string;
  color!: Color;

  static spinup = 10;
  static typeName = 'Renderable';
  static properties = {
    glyph: '',
    color: Colors.WHITE,
  };
}
