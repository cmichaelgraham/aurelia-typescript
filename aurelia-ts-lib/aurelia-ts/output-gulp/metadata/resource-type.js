define(["require", "exports"], function (require, exports) {
    /**
    * An abstract base class used to designate resources which can be loaded and registered in a framework.
    *
    * @class ResourceType
    * @constructor
    */
    var ResourceType = (function () {
        function ResourceType() {
        }
        /**
        * Implemented by resource metadata to allow it to self-configure and load dependencies.
        *
        * @method load
        * @param {Container} container The dependency injection container to use for service resolution.
        * @param {Object} target The target that is decorated by this ResourceType metadata.
        * @return {Promise} Returns a promise for itself, resolving when all dependent resources are loaded.
        */
        ResourceType.prototype.load = function (container, target) {
            return this;
        };
        /**
        * Implemented by resources to allow them to register themselved in a resource registry.
        *
        * @method register
        * @param {ResourceRegistry} registry The resource registry that this resource needs to be registered in.
        * @param {String} [name] A possible name override for the resource.
        */
        ResourceType.prototype.register = function (registry, name) {
            throw new Error('All descendents of "ResourceType" must implement the "register" method.');
        };
        return ResourceType;
    })();
    exports.ResourceType = ResourceType;
});
