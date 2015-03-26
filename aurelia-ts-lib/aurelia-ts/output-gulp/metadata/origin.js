var originStorage = new Map();
function ensureType(value) {
    if (value instanceof Origin) {
        return value;
    }
    return new Origin(value);
}
/**
* A metadata annotation that describes the origin module of the function to which it's attached.
*
* @class Origin
* @constructor
* @param {string} moduleId The origin module id.
* @param {string} moduleMember The name of the export in the origin module.
*/
export class Origin {
    constructor(moduleId, moduleMember) {
        this.moduleId = moduleId;
        this.moduleMember = moduleMember;
    }
    /**
    * Get the Origin annotation for the specified function.
    *
    * @method get
    * @static
    * @param {Function} fn The function to inspect for Origin metadata.
    * @return {Origin} Returns the Origin metadata.
    */
    static get(fn) {
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
    }
    /**
    * Set the Origin annotation for the specified function.
    *
    * @method set
    * @static
    * @param {Function} fn The function to set the Origin metadata on.
    * @param {origin} fn The Origin metadata to store on the function.
    * @return {Origin} Returns the Origin metadata.
    */
    static set(fn, origin) {
        if (Origin.get(fn) === undefined) {
            originStorage.set(fn, origin);
        }
    }
}
