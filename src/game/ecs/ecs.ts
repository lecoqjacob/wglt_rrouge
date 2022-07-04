import { isNil } from 'rambdax';
import {
  ECS as WolfECS,
  types,
  all,
  any,
  not,
  TypedArray,
  ComponentArray,
  Tree,
  TypedArrayConstructor,
} from 'wolf-ecs';

import { ExplicitAny } from '@/models';

export type ECSPrimative = number | bigint;
export type ComponentDefinition = number | Obj;
export type Obj<T = ExplicitAny> = Record<string, T>;

type InitFunc = () => unknown;
type Type = TypedArrayConstructor | ArrayConstructor | [InitFunc] | unknown[];

export class ECS extends WolfECS {
  withComponent<T extends Tree<Type>>(
    id: number,
    component: ComponentArray<T>,
    value?: ComponentDefinition,
  ) {
    this.addComponent(id, component);

    if (!isNil(value)) {
      Object.entries(value).forEach(([k, v]) => {
        (component as TypedArray[])[k as unknown as number][id] = v;
      });
      // if (isPrimitive(value)) {
      //   component[id] = value;
      // } else {
      //   Object.entries(value).forEach(([k, v]) => {
      //     (component as TypedArray[])[k as unknown as number][id] = v;
      //   });
      // }
    }

    return this;
  }

  withTag<T extends Tree<Type>>(
    id: number,
    component: ComponentArray<T>,
    def?: ComponentDefinition,
  ) {
    this.addComponent(id, component);
    if (def) {
      Object.entries(def).forEach(([k, v]) => {
        (component as TypedArray[])[k as unknown as number] = v;
      });
    }
    return this;
  }
}

class ECSInstance extends ECS {
  private static _instance: ECSInstance;

  private constructor() {
    super();
    ECSInstance._instance = new ECS();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export { types, all, any, not };
export default ECSInstance.Instance;
