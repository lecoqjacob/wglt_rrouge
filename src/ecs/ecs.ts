import { Component, IWorldStats, Query, World } from 'ape-ecs';

import { ExplicitAny } from '@/models/common';

import * as components from '../components';
import { Position, Renderable } from '../components';
import systems from '../systems';
import { Resource } from './resource';

type Queries = Record<'renderableEntities', Query>;
type ComponentType = Record<'Position' | 'Renderable' | 'GameMapResource', Component>;

interface WorldStats extends IWorldStats {
  resources: {
    [key: string]: Resource;
  };
}

export class ECS extends World {
  readonly _queries: Queries;
  readonly componentTypes = {} as ComponentType;

  resources: Map<string, Resource>;

  constructor() {
    super();
    this._queries = {} as Queries;
    this.resources = new Map();

    this._registerTags();
    this._registerComponents();
    this._registerSystems();
    this._registerQueries();
  }

  private _registerTags(): void {
    console.groupCollapsed('Registering Tags...');
    this.registerTags(...['Player']);
    console.groupEnd();
  }

  private _registerComponents(): void {
    console.groupCollapsed('Registering Components...');

    for (const [name, component] of Object.entries(components)) {
      console.log('Registering Component: ', name);
      this.registerComponent(component, (component as { spinup?: number }).spinup ?? 1);
    }

    console.groupEnd();
  }

  private _registerSystems(): void {
    console.groupCollapsed('Registering Systems...');

    for (const [executionName, executableSystems] of Object.entries(systems)) {
      executableSystems.forEach((sys) => {
        console.log('Registering System: ', sys.name);
        this.registerSystem(executionName, sys, []);
      });
    }

    console.groupEnd();
  }

  private _registerQueries(): void {
    console.groupCollapsed('Registering Queries...');

    console.log('Creating `RenderableEntities` query with `Position` and `Renderable` components');
    this._queries['renderableEntities'] = this.createQuery().fromAll(Position, Renderable);

    console.groupEnd();
  }

  registerResource(resource: Resource, resourceName?: string): void {
    const name = resourceName ?? resource.constructor.name;
    if (this.resources.has(name)) {
      throw new Error(`Resource with name [${name}] already exists`);
    }

    this.resources.set(resource.constructor.name, resource);
  }

  getQuery(queryKey: keyof Queries): Query {
    return this._queries[queryKey];
  }

  getComponent<T extends Component>(component: keyof ComponentType): T {
    return super.getComponent(component) as T;
  }

  getResource<T extends Resource>(type: T | { new (...args: ExplicitAny[]): T }): T {
    let name = '';
    if (type instanceof Resource) {
      name = type.constructor.name;
    } else {
      name = type.name;
    }
    return this.resources.get(name) as T;
  }

  getStats(): WorldStats {
    const stats = super.getStats() as WorldStats;
    stats.resources = {};

    for (const [key, resource] of this.resources) {
      stats.resources[key] = resource;
    }

    return stats;
  }
}
