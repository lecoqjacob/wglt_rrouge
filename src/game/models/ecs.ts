import { ExplicitAny } from './common';

export type System<R extends ExplicitAny[] = ExplicitAny[]> = (...args: R) => void;
