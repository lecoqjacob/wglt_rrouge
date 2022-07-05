import { fromRgb } from '@lecoqjacob/wglt';

// Walls
export const COLOR_LIGHT_WALL = fromRgb(130, 110, 50);
export const COLOR_DARK_WALL = fromRgb(0, 0, 100);
// Floors
export const COLOR_LIGHT_GROUND = fromRgb(200, 180, 50);
export const COLOR_DARK_GROUND = fromRgb(50, 50, 150);

export const fromf32 = (r: number, g: number, b: number, a = 255) => {
  return fromRgb(r * 255, g * 255, b * 255, a);
};

export const toGreyscale = (r: number, g: number, b: number, a = 255) => {
  const linear = r * 0.2126 + g * 0.7152 + b * 0.0722;
  return fromRgb(linear, linear, linear, a);
};
