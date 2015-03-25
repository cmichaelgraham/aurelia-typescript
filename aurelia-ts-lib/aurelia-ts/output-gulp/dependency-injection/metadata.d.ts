/**
* An abstract annotation used to allow functions/classes to indicate how they should be registered with the container.
*
* @class Registration
* @constructor
*/
export declare class Registration {
    /**
    * Called by the container to allow custom registration logic for the annotated function/class.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: any, key: any, fn: any): void;
}
/**
* An annotation used to allow functions/classes to indicate that they should be registered as transients with the container.
*
* @class Transient
* @constructor
* @extends Registration
* @param {Object} [key] The key to register as.
*/
export declare class Transient extends Registration {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to register the annotated function/class as transient.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: any, key: any, fn: any): void;
}
/**
* An annotation used to allow functions/classes to indicate that they should be registered as singletons with the container.
*
* @class Singleton
* @constructor
* @extends Registration
* @param {Object} [key] The key to register as.
*/
export declare class Singleton extends Registration {
    key: any;
    registerInChild: any;
    constructor(keyOrRegisterInChild: any, registerInChild?: boolean);
    /**
    * Called by the container to register the annotated function/class as a singleton.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: any, key: any, fn: any): void;
}
/**
* An abstract annotation used to allow functions/classes to specify custom dependency resolution logic.
*
* @class Resolver
* @constructor
*/
export declare class Resolver {
    /**
    * Called by the container to allow custom resolution of dependencies for a function/class.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the resolved object.
    */
    get(container: any): void;
}
/**
* An annotation used to allow functions/classes to specify lazy resolution logic.
*
* @class Lazy
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve.
*/
export declare class Lazy extends Resolver {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to lazily resolve the dependency into a lazy locator function.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
    */
    get(container: any): () => any;
    /**
    * Creates a Lazy Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to lazily resolve.
    * @return {Lazy} Returns an insance of Lazy for the key.
    */
    static of(key: any): Lazy;
}
/**
* An annotation used to allow functions/classes to specify resolution of all matches to a key.
*
* @class All
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve all matches for.
*/
export declare class All extends Resolver {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to resolve all matching dependencies as an array of instances.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object[]} Returns an array of all matching instances.
    */
    get(container: any): any;
    /**
    * Creates an All Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve all instances for.
    * @return {All} Returns an insance of All for the key.
    */
    static of(key: any): All;
}
/**
* An annotation used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
*
* @class Optional
* @constructor
* @extends Resolver
* @param {Object} key The key to optionally resolve for.
* @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
*/
export declare class Optional extends Resolver {
    key: any;
    checkParent: any;
    constructor(key: any, checkParent?: boolean);
    /**
    * Called by the container to provide optional resolution of the key.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the instance if found; otherwise null.
    */
    get(container: any): any;
    /**
    * Creates an Optional Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to optionally resolve for.
    * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
    * @return {Optional} Returns an insance of Optional for the key.
    */
    static of(key: any, checkParent?: boolean): Optional;
}
/**
* An annotation used to inject the dependency from the parent container instead of the current one.
*
* @class Parent
* @constructor
* @extends Resolver
* @param {Object} key The key to resolve from the parent container.
*/
export declare class Parent extends Resolver {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to load the dependency from the parent container
    *
    * @method get
    * @param {Container} container The container to resolve the parent from.
    * @return {Function} Returns the matching instance from the parent container
    */
    get(container: any): any;
    /**
    * Creates a Parent Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve.
    * @return {Parent} Returns an insance of Parent for the key.
    */
    static of(key: any): Parent;
}
