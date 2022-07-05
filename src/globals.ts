/* eslint-disable @typescript-eslint/no-unused-vars */

////////////////////////////////////////////////////////////////////////////////
/// Array Extensions
////////////////////////////////////////////////////////////////////////////////
declare global {
  interface Array<T> {
    isEmpty(): boolean;
  }
}

if (!Array.prototype.isEmpty) {
  Array.prototype.isEmpty = function (): boolean {
    return this.length === 0;
  };
}

////////////////////////////////////////////////////////////////////////////////
/// String Extensions
////////////////////////////////////////////////////////////////////////////////
declare global {
  interface String {
    to_cp437(): number;
    to_char(): string;
  }
}

String.prototype.to_cp437 = function (): number {
  return this.charCodeAt(0);
};

////////////////////////////////////////////////////////////////////////////////
/// Number Extensions
////////////////////////////////////////////////////////////////////////////////

declare global {
  interface Number {
    to_char(): string;
    to_grayscale(): number;
  }
}

Number.prototype.to_char = function (): string {
  return String.fromCharCode(this.valueOf());
};

Number.prototype.to_grayscale = function () {
  const r = this.valueOf() / (256 ^ 2);
  const g = (this.valueOf() / 256) % 256;
  const b = this.valueOf() % 256;
  const a = 255;
  return (r << 24) + (g << 16) + (b << 8) + a;
};

export {};
