define(["require", "exports", '../metadata/aurelia-metadata', './metadata', './util'], function (require, exports, _aurelia_metadata, _metadata, _util) {
    var emptyParameters = Object.freeze([]);
    var Container = (function () {
        function Container(constructionInfo) {
            this.constructionInfo = constructionInfo || new Map();
            this.entries = new Map();
            this.root = this;
        }
        Container.prototype.supportAtScript = function () {
            this.addParameterInfoLocator(function (fn) {
                var parameters = fn.parameters, keys, i, ii;
                if (parameters) {
                    keys = new Array(parameters.length);
                    for (i = 0, ii = parameters.length; i < ii; ++i) {
                        keys[i] = parameters[i].is || parameters[i][0];
                    }
                }
                return keys;
            });
        };
        Container.prototype.addParameterInfoLocator = function (locator) {
            if (this["locateParameterInfoElsewhere"] === undefined) {
                this["locateParameterInfoElsewhere"] = locator;
                return;
            }
            var original = this["locateParameterInfoElsewhere"];
            this["locateParameterInfoElsewhere"] = function (fn) {
                return original(fn) || locator(fn);
            };
        };
        Container.prototype.registerInstance = function (key, instance) {
            this.registerHandler(key, function (x) {
                return instance;
            });
        };
        Container.prototype.registerTransient = function (key, fn) {
            fn = fn || key;
            this.registerHandler(key, function (x) {
                return x.invoke(fn);
            });
        };
        Container.prototype.registerSingleton = function (key, fn) {
            var singleton = null;
            fn = fn || key;
            this.registerHandler(key, function (x) {
                return singleton || (singleton = x.invoke(fn));
            });
        };
        Container.prototype.autoRegister = function (fn, key) {
            var registration;
            if (fn === null || fn === undefined) {
                throw new Error('fn cannot be null or undefined.');
            }
            registration = _aurelia_metadata.Metadata.on(fn).first(_metadata.Registration, true);
            if (registration) {
                registration.register(this, key || fn, fn);
            }
            else {
                this.registerSingleton(key || fn, fn);
            }
        };
        Container.prototype.autoRegisterAll = function (fns) {
            var i = fns.length;
            while (i--) {
                this.autoRegister(fns[i]);
            }
        };
        Container.prototype.registerHandler = function (key, handler) {
            this.getOrCreateEntry(key).push(handler);
        };
        Container.prototype.unregister = function (key) {
            this.entries.delete(key);
        };
        Container.prototype.get = function (key) {
            var entry;
            if (key === null || key === undefined) {
                throw new Error('key cannot be null or undefined.');
            }
            if (key instanceof _metadata.Resolver) {
                return key.get(this);
            }
            if (key === Container) {
                return this;
            }
            entry = this.entries.get(key);
            if (entry !== undefined) {
                return entry[0](this);
            }
            if (this.parent) {
                return this.parent.get(key);
            }
            this.autoRegister(key);
            entry = this.entries.get(key);
            return entry[0](this);
        };
        Container.prototype.getAll = function (key) {
            var _this = this;
            var entry;
            if (key === null || key === undefined) {
                throw new Error('key cannot be null or undefined.');
            }
            entry = this.entries.get(key);
            if (entry !== undefined) {
                return entry.map(function (x) {
                    return x(_this);
                });
            }
            if (this.parent) {
                return this.parent.getAll(key);
            }
            return [];
        };
        Container.prototype.hasHandler = function (key, checkParent) {
            if (checkParent === void 0) { checkParent = false; }
            if (key === null || key === undefined) {
                throw new Error('key cannot be null or undefined.');
            }
            return this.entries.has(key) || (checkParent && this.parent && this.parent.hasHandler(key, checkParent));
        };
        Container.prototype.createChild = function () {
            var childContainer = new Container(this.constructionInfo);
            childContainer.parent = this;
            childContainer.root = this.root;
            childContainer["locateParameterInfoElsewhere"] = this["locateParameterInfoElsewhere"];
            return childContainer;
        };
        Container.prototype.invoke = function (fn) {
            var info = this.getOrCreateConstructionInfo(fn), keys = info.keys, args = new Array(keys.length), context, key, keyName, error, i, ii;
            try {
                for (i = 0, ii = keys.length; i < ii; ++i) {
                    key = keys[i];
                    args[i] = this.get(key);
                }
            }
            catch (e) {
                keyName = typeof key === 'function' ? key.name : key;
                error = new Error("Error resolving dependency [" + keyName + "] required by [" + fn.name + "].");
                error.innerError = e;
                throw error;
            }
            if (info.isClass) {
                context = Object.create(fn.prototype);
                if ('initialize' in fn) {
                    fn.initialize(context);
                }
                return fn.apply(context, args) || context;
            }
            else {
                return fn.apply(undefined, args);
            }
        };
        Container.prototype.getOrCreateEntry = function (key) {
            var entry;
            if (key === null || key === undefined) {
                throw new Error('key cannot be null or undefined.');
            }
            entry = this.entries.get(key);
            if (entry === undefined) {
                entry = [];
                this.entries.set(key, entry);
            }
            return entry;
        };
        Container.prototype.getOrCreateConstructionInfo = function (fn) {
            var info = this.constructionInfo.get(fn);
            if (info === undefined) {
                info = this.createConstructionInfo(fn);
                this.constructionInfo.set(fn, info);
            }
            return info;
        };
        Container.prototype.createConstructionInfo = function (fn) {
            var info = {
                isClass: _util.isClass(fn),
                keys: null
            };
            if (fn.inject !== undefined) {
                if (typeof fn.inject === 'function') {
                    info.keys = fn.inject();
                }
                else {
                    info.keys = fn.inject;
                }
                return info;
            }
            if (this["locateParameterInfoElsewhere"] !== undefined) {
                info.keys = this["locateParameterInfoElsewhere"](fn) || emptyParameters;
            }
            else {
                info.keys = emptyParameters;
            }
            return info;
        };
        return Container;
    })();
    exports.Container = Container;
});
