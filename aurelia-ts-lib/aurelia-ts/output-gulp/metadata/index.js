/**
 * Utilities for reading and writing the metadata of JavaScript functions.
 *
 * @module metadata
 */
define(["require", "exports", './origin', './resource-type', './metadata'], function (require, exports, _origin, _resource_type, _metadata) {
    exports.Origin = _origin.Origin;
    exports.ResourceType = _resource_type.ResourceType;
    exports.Metadata = _metadata.Metadata;
});
