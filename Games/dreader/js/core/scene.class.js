/**
 * @file scene.class.js
 * @version 1.1.0
 * @license MIT License
 * Copyright 2020 Donitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
 * NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import Entity from './entity.class.js';

export default class Scene {
    constructor(context) {
        this._entities = [];
        this._entitiesOfType = new Map();

        this._updateIteratorIndex = 0;
        this._updateIteratorRemaining = 0;

        this._sortEntities = false;
    }

    addEntity(entity) {
        if (this._entities.includes(entity)) {
            throw new Error('Attempted to add entity more than once');
        }

        this._entities.push(entity);

        this._entitiesOfType.forEach((entities, type) => {
            if (entity instanceof type) {
                entities.add(entity);
            }
        });

        this._sortEntities = true;
        this._sortEntitiesToDraw = true;
    }

    removeEntity(entity) {
        const updateIndex = this._entities.indexOf(entity);
        if (updateIndex === -1) {
            throw new Error('Attempted to remove non-existent entity');
        }
        this._entities.splice(updateIndex, 1);

        if (updateIndex <= this._updateIteratorIndex) {
            this._updateIteratorIndex--;
        }
        this._updateIteratorRemaining--;

        this._entitiesOfType.forEach((entities, type) => {
            if (entity instanceof type) {
                entities.delete(entity);
            }
        });
    }

    _getCachedEntitiesOfType(type) {
        if (!this._entitiesOfType.has(type)) {
            if (!(type.prototype instanceof Entity)) {
                throw new Error(`Type "${type.name}" is not a subclass of Entity`);
            }

            const entities = this._entities.filter(entity => entity instanceof type);
            this._entitiesOfType.set(type, new Set(entities));
        }

        return this._entitiesOfType.get(type);
    }

    findEntityOfType(type) {
        const entities = this._getCachedEntitiesOfType(type);
        return entities.size === 0 ? null : entities.values().next().value;
    }

    findEntitiesOfType(type, target) {
        if (target === undefined) {
            throw new Error('No target array supplied');
        }

        const entities = this._getCachedEntitiesOfType(type);
        target.length = entities.size;
        let i = 0;
        entities.forEach(entity => target[i++] = entity);
        return target;
    }

    destroy(context) {
        while (this._entities.length > 0) {
            this._entities[0].destroy(context);
        }
    }

    handleResize(context) {
        this._entities.forEach(entity => entity.handleResize(context));
    }

    update(context) {
        if (this._sortEntities) {
            this._sortEntities = false;
            this._entities.sort(Entity.updatePrioritySortFunc);
        }

        this._updateIteratorIndex = 0;
        this._updateIteratorRemaining = this._entities.length;
        while (this._updateIteratorRemaining-- > 0) {
            const entity = this._entities[this._updateIteratorIndex++];
            entity.update(context);
        }
    }
}
