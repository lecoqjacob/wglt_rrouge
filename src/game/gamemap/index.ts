import { Colors, Console, Rect, RNG, Terminal } from '@lecoqjacob/wglt';
import { Mixin } from 'ts-mixer';

import {
  COLOR_LIGHT_GROUND,
  COLOR_LIGHT_WALL,
  COLOR_DARK_GROUND,
  COLOR_DARK_WALL,
  MAX_ROOMS,
  MAP_WIDTH,
  MAP_HEIGHT,
  ROOM_MIN_SIZE,
  ROOM_MAX_SIZE,
} from '@/constants';

export enum TileType {
  Wall = 0,
  Floor = 1,
}

export class GameMap extends Mixin(Console) {
  rooms: Rect[] = [];

  constructor(width: number, height: number) {
    super(width, height);
  }

  isBlocked(x: number, y: number) {
    return this.getCell(x, y)?.charCode !== TileType.Floor;
  }

  xy_idx(x: number, y: number): number {
    return y * this.width + x;
  }

  apply_room_to_map(room: Rect): void {
    for (let y = room.y + 1; y < room.y2; y++) {
      for (let x = room.x + 1; x < room.x2; x++) {
        this.grid[y][x].setCharCode(TileType.Floor);
        this.grid[y][x].blocked = false;
        this.grid[y][x].blockedSight = false;
      }
    }
  }

  apply_horizontal_tunnel(x1: number, x2: number, y: number): void {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      this.grid[y][x].setCharCode(TileType.Floor);
      this.grid[y][x].blocked = false;
      this.grid[y][x].blockedSight = false;
    }
  }

  apply_vertical_tunnel(y1: number, y2: number, x: number): void {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      this.grid[y][x].setCharCode(TileType.Floor);
      this.grid[y][x].blocked = false;
      this.grid[y][x].blockedSight = false;
    }
  }

  static new_map(): GameMap {
    const map = new GameMap(MAP_WIDTH, MAP_HEIGHT);
    const rng = new RNG(Date.now());

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        map.grid[y][x].setCharCode(TileType.Wall);
        map.grid[y][x].blocked = true;
        map.grid[y][x].blockedSight = true;
      }
    }

    for (let r = 0; r < MAX_ROOMS; r++) {
      // Random width and height
      const w = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
      const h = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);

      // Random position without going out of the boundaries of the map
      const x = rng.nextRange(0, map.width - w - 1);
      const y = rng.nextRange(0, map.height - h - 1);

      // "Rect" class makes rectangles easier to work with
      const new_room = new Rect(x, y, w, h);

      // Run through the other rooms and see if they intersect with this one
      let failed = false;
      for (let j = 0; j < map.rooms.length; j++) {
        if (new_room.intersects(map.rooms[j])) {
          failed = true;
          break;
        }
      }

      if (!failed) {
        // This means there are no intersections, so this room is valid
        // "paint" it to the map's tiles
        map.apply_room_to_map(new_room);

        if (!map.rooms.isEmpty()) {
          const center = new_room.getCenter();
          const prev = map.rooms[map.rooms.length - 1].getCenter();

          if (rng.nextRange(0, 1) === 1) {
            // First move horizontally, then vertically
            map.apply_horizontal_tunnel(prev.x, center.x, prev.y);
            map.apply_vertical_tunnel(prev.y, center.y, center.x);
          } else {
            // First move vertically, then horizontally
            map.apply_vertical_tunnel(prev.y, center.y, prev.x);
            map.apply_horizontal_tunnel(prev.x, center.x, center.y);
          }
        }

        map.rooms.push(new_room);
      }
    }

    return map;
  }

  draw(term: Terminal): void {
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const visible = this.isVisible(x, y);
        const wall = this.grid[y][x].blockedSight;

        let color = Colors.BLACK;

        if (visible) {
          // It's visible
          color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
        } else if (this.grid[y][x].explored) {
          // It's remembered
          color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
        }

        term.drawChar(x, y, 0, 0, color);
      }
    }
  }
}

export const computeFOV = (originX: number, originY: number, radius: number, map: GameMap) => {
  const newConsole = new Console(map.width, map.height);
  newConsole.computeFov(originX, originY, radius);

  return newConsole.grid.map((cells) => {
    return cells.filter((cell) => {
      return cell.visible;
    });
  });
};
