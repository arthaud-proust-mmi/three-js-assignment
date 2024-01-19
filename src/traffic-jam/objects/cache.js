export class ObjectCache {
  #cachedObjects = new Map();
  #load;

  constructor({ loadFn }) {
    this.#load = loadFn;
  }

  #isNotCached(objectId) {
    return !this.#cachedObjects.has(objectId);
  }

  async #loadInCache(objectId) {
    const object = await this.#load(objectId);
    this.#cachedObjects.set(objectId, object);
  }

  #getCopyFromCache(objectId) {
    return this.#cachedObjects.get(objectId).clone();
  }

  async load(objectId) {
    if (this.#isNotCached(objectId)) {
      await this.#loadInCache(objectId);
    }

    return this.#getCopyFromCache(objectId);
  }
}
