import { Cell, Colors, Point } from '@lecoqjacob/wglt';
import { match } from 'ts-pattern';

import {
  COLOR_LIGHT_WALL,
  COLOR_LIGHT_GROUND,
  COLOR_DARK_GROUND,
  COLOR_DARK_WALL,
} from '@/constants';
import ECS, { IMap, Player, all, Position, Renderable } from '@/ecs';

import { Engine } from '../Engine';

import { GameMap, TileType } from './index';

// const SHOW_BOUNDARIES = false;

interface Rect {
  min: Point;
  max: Point;
}

function range(start: number, end: number) {
  return [...Array(1 + end - start).keys()].map((v) => start + v);
}

export class Camera {
  private readonly engine: Engine;
  private readonly SHOW_BOUNDARIES = false;

  width: number;
  height: number;

  constructor(engine: Engine, width: number, height: number) {
    this.engine = engine;
    (this.width = width), (this.height = height);
  }

  getCharSize() {
    return { xChars: this.width, yChars: this.height };
  }

  getScreenBounds(): Rect {
    const player_pos = this.engine.getPosition(Player.get);
    const { xChars, yChars } = this.getCharSize();

    const center_x = xChars / 2;
    const center_y = yChars / 2;

    const min_x = player_pos.x - center_x;
    const max_x = min_x + xChars;
    const min_y = player_pos.y - center_y;
    const max_y = min_y + yChars;

    return { min: { x: min_x, y: min_y }, max: { x: max_x, y: max_y } };
  }

  getCellGlyph(cell: Cell, map: GameMap) {
    let glyph = 0;
    let fg = Colors.BLACK;
    const bg = Colors.BLACK;

    match(cell.charCode)
      .with(TileType.Floor, () => {
        glyph = '.'.to_cp437();
        fg = cell.visible ? COLOR_LIGHT_GROUND : COLOR_DARK_GROUND;
      })
      .otherwise(() => {
        glyph = this.wallGlyph(cell, map);
        fg = cell.visible ? COLOR_LIGHT_WALL : COLOR_DARK_WALL;
      });

    return { glyph, fg, bg };
  }

  wallGlyph(cell: Cell, map: GameMap) {
    if (cell.x < 1 || cell.x > map.width - 2 || cell.y < 1 || cell.y > map.height - 2) {
      return 35;
    }

    const x = cell.x,
      y = cell.y;

    let mask = 0;
    if (this.isRevealedAndWall(map, x, y - 1)) {
      mask += 1;
    }
    if (this.isRevealedAndWall(map, x, y + 1)) {
      mask += 2;
    }
    if (this.isRevealedAndWall(map, x - 1, y)) {
      mask += 4;
    }
    if (this.isRevealedAndWall(map, x + 1, y)) {
      mask += 8;
    }

    return match(mask)
      .with(0, () => 9)
      .with(1, () => 186)
      .with(2, () => 186)
      .with(3, () => 186)
      .with(4, () => 205)
      .with(5, () => 188)
      .with(6, () => 187)
      .with(7, () => 185)
      .with(8, () => 205)
      .with(9, () => 200)
      .with(10, () => 201)
      .with(11, () => 204)
      .with(12, () => 205)
      .with(13, () => 202)
      .with(14, () => 203)
      .with(15, () => 206)
      .otherwise(() => 35);
  }

  isRevealedAndWall(map: GameMap, x: number, y: number): boolean {
    const cell = map.getCell(x, y)!;
    return cell.charCode === TileType.Wall && cell.explored;
  }

  render() {
    const { min, max } = this.getScreenBounds();

    const map = IMap.get;
    const map_width = map.width - 1;
    const map_height = map.height - 1;

    let y = 0;
    for (const ty of range(min.y, max.y)) {
      let x = 0;
      for (const tx of range(min.x, max.x)) {
        if (tx > 0 && tx < map_width && ty > 0 && ty < map_height) {
          const wall = map.grid[ty][tx].blockedSight;
          const visible = map.isVisible(tx, ty);

          let color = Colors.BLACK;

          if (visible) {
            // It's visible
            color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
          } else if (map.grid[ty][tx].explored) {
            // It's remembered
            color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
          }

          const glyph = wall ? '#' : '.';
          this.engine.term.drawChar(x, y, glyph, 0, color);

          // if (cell.explored) {
          //   const { glyph, fg, bg } = this.getCellGlyph(cell, map);
          //   this.engine.term.drawChar(x, y, glyph, fg, bg);
          // } else if (SHOW_BOUNDARIES) {
          //   this.engine.term.drawChar(x, y, '.', Colors.DARK_GRAY, Colors.BLACK);
          // }
        }
        x += 1;
      }
      y += 1;
    }

    const renderQuery = ECS.createQuery(all(Position), all(Renderable));
    for (let i = 0; i < renderQuery.a.length; i++) {
      const arch = renderQuery.a[i].e;
      for (let j = arch.length - 1; j >= 0; j--) {
        // Backward iteration helps prevent double counting entities
        const entity = arch[j];

        const entity_screen_x = Position.x[entity] - min.x;
        const entity_screen_y = Position.y[entity] - min.y;
        const glyph = Renderable.glyph[entity];
        const color = Renderable.color[entity];

        if (map.isVisible(Position.x[entity], Position.y[entity])) {
          this.engine.term.drawChar(entity_screen_x, entity_screen_y, glyph, color);
        }
      }
    }
  }
}
