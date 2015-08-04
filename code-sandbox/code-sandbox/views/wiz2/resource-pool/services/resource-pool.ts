export class ResourcePool {
    public pools: Object;

    constructor() {
        this.pools = {};
    }

    get(poolName, name, create) {
        var resources = this._getResources(poolName, name);
        if (resources.length === 0) {
            return create ? create() : null;
        } else {
            return resources.shift();
        }
    }

    free(poolName, name, resource?) {
        var resources = this._getResources(poolName, name);
        if (resource) {
            resources.push(resource);
        }
    }

    _getResources(poolName, name) {
        var pool = this.pools[poolName];
        if (!pool) {
            pool = this.pools[poolName] = {};
        }

        var resources = pool[name];
        if (!resources) {
            resources = pool[name] = [];
        }

        return resources;
    }
}