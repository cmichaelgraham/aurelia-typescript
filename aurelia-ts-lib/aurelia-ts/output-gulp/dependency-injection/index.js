define(["require", "exports", 'aurelia-metadata', './metadata', './metadata', './container'], function (require, exports, _aurelia_metadata, _metadata, _metadata_1, _container) {
    exports.Registration = _metadata_1.Registration;
    exports.Transient = _metadata_1.Transient;
    exports.Singleton = _metadata_1.Singleton;
    exports.Resolver = _metadata_1.Resolver;
    exports.Lazy = _metadata_1.Lazy;
    exports.All = _metadata_1.All;
    exports.Optional = _metadata_1.Optional;
    exports.Parent = _metadata_1.Parent;
    exports.Container = _container.Container;
    _aurelia_metadata.Metadata.configure.classHelper('transient', _metadata.Transient);
    _aurelia_metadata.Metadata.configure.classHelper('singleton', _metadata.Singleton);
});
