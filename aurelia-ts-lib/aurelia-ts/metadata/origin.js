define(["require", "exports"], function (require, exports) {
    var originStorage = new Map();
    function ensureType(value) {
        if (value instanceof Origin) {
            return value;
        }
        return new Origin(value);
    }
    var Origin = (function () {
        function Origin(moduleId, moduleMember) {
            this.moduleId = moduleId;
            this.moduleMember = moduleMember;
        }
        Origin.get = function (fn) {
            var origin = originStorage.get(fn);
            if (origin !== undefined) {
                return origin;
            }
            if (typeof fn.origin === 'function') {
                originStorage.set(fn, origin = ensureType(fn.origin()));
            }
            else if (fn.origin !== undefined) {
                originStorage.set(fn, origin = ensureType(fn.origin));
            }
            return origin;
        };
        Origin.set = function (fn, origin) {
            if (Origin.get(fn) === undefined) {
                originStorage.set(fn, origin);
            }
        };
        return Origin;
    })();
    exports.Origin = Origin;
});
