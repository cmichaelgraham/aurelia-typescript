var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function (require, exports) {
    var Registration = (function () {
        function Registration() {
        }
        Registration.prototype.register = function (container, key, fn) {
            throw new Error('A custom Registration must implement register(container, key, fn).');
        };
        return Registration;
    })();
    exports.Registration = Registration;
    var Transient = (function (_super) {
        __extends(Transient, _super);
        function Transient(key) {
            _super.call(this);
            this.key = key;
        }
        Transient.prototype.register = function (container, key, fn) {
            container.registerTransient(this.key || key, fn);
        };
        return Transient;
    })(Registration);
    exports.Transient = Transient;
    var Singleton = (function (_super) {
        __extends(Singleton, _super);
        function Singleton(keyOrRegisterInChild, registerInChild) {
            if (registerInChild === void 0) { registerInChild = false; }
            _super.call(this);
            if (typeof keyOrRegisterInChild === 'boolean') {
                this.registerInChild = keyOrRegisterInChild;
            }
            else {
                this.key = keyOrRegisterInChild;
                this.registerInChild = registerInChild;
            }
        }
        Singleton.prototype.register = function (container, key, fn) {
            var destination = this.registerInChild ? container : container.root;
            destination.registerSingleton(this.key || key, fn);
        };
        return Singleton;
    })(Registration);
    exports.Singleton = Singleton;
    var Resolver = (function () {
        function Resolver() {
        }
        Resolver.prototype.get = function (container) {
            throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
        };
        return Resolver;
    })();
    exports.Resolver = Resolver;
    var Lazy = (function (_super) {
        __extends(Lazy, _super);
        function Lazy(key) {
            _super.call(this);
            this.key = key;
        }
        Lazy.prototype.get = function (container) {
            var _this = this;
            return function () {
                return container.get(_this.key);
            };
        };
        Lazy.of = function (key) {
            return new Lazy(key);
        };
        return Lazy;
    })(Resolver);
    exports.Lazy = Lazy;
    var All = (function (_super) {
        __extends(All, _super);
        function All(key) {
            _super.call(this);
            this.key = key;
        }
        All.prototype.get = function (container) {
            return container.getAll(this.key);
        };
        All.of = function (key) {
            return new All(key);
        };
        return All;
    })(Resolver);
    exports.All = All;
    var Optional = (function (_super) {
        __extends(Optional, _super);
        function Optional(key, checkParent) {
            if (checkParent === void 0) { checkParent = false; }
            _super.call(this);
            this.key = key;
            this.checkParent = checkParent;
        }
        Optional.prototype.get = function (container) {
            if (container.hasHandler(this.key, this.checkParent)) {
                return container.get(this.key);
            }
            return null;
        };
        Optional.of = function (key, checkParent) {
            if (checkParent === void 0) { checkParent = false; }
            return new Optional(key, checkParent);
        };
        return Optional;
    })(Resolver);
    exports.Optional = Optional;
    var Parent = (function (_super) {
        __extends(Parent, _super);
        function Parent(key) {
            _super.call(this);
            this.key = key;
        }
        Parent.prototype.get = function (container) {
            return container.parent ? container.parent.get(this.key) : null;
        };
        Parent.of = function (key) {
            return new Parent(key);
        };
        return Parent;
    })(Resolver);
    exports.Parent = Parent;
});
