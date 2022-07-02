/* eslint-disable @typescript-eslint/no-unused-vars */

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

export {};
