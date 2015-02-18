define(["require", "exports"], function (require, exports) {
    var ResourcePool = (function () {
        function ResourcePool() {
            this.pools = {};
        }
        ResourcePool.prototype.get = function (poolName, name, create) {
            var resources = this._getResources(poolName, name);
            if (resources.length === 0) {
                return create ? create() : null;
            }
            else {
                return resources.shift();
            }
        };
        ResourcePool.prototype.free = function (poolName, name, resource) {
            var resources = this._getResources(poolName, name);
            if (resource) {
                resources.push(resource);
            }
        };
        ResourcePool.prototype._getResources = function (poolName, name) {
            var pool = this.pools[poolName];
            if (!pool) {
                pool = this.pools[poolName] = {};
            }
            var resources = pool[name];
            if (!resources) {
                resources = pool[name] = [];
            }
            return resources;
        };
        return ResourcePool;
    })();
    exports.ResourcePool = ResourcePool;
});
//# sourceMappingURL=resource-pool.js.map