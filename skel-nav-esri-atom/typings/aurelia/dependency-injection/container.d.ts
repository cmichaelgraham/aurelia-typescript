/**
* A lightweight, extensible dependency injection container.
*
* @class Container
* @constructor
*/
export declare class Container {
    constructionInfo: Map<any, any>;
    entries: Map<any, any>;
    root: Container;
    parent: Container;
    constructor(constructionInfo: Map<any, any>);
    /**
    * Add support for AtScript RTTI according to spec at http://www.atscript.org
    *
    * @method useAtScript
    */
    supportAtScript(): void;
    /**
    * Adds an additional location to search for constructor parameter type info.
    *
    * @method addParameterInfoLocator
    * @param {Function} locator Configures a locator function to use when searching for parameter info. It should return undefined if no parameter info is found.
    */
    addParameterInfoLocator(locator: (any) => any): void;
    /**
    * Registers an existing object instance with the container.
    *
    * @method registerInstance
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Object} instance The instance that will be resolved when the key is matched.
    */
    registerInstance(key: any, instance: any): void;
    /**
    * Registers a type (constructor function) such that the container returns a new instance for each request.
    *
    * @method registerTransient
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Function} [fn] The constructor function to use when the dependency needs to be instantiated.
    */
    registerTransient(key: any, fn: any): void;
    /**
    * Registers a type (constructor function) such that the container always returns the same instance for each request.
    *
    * @method registerSingleton
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Function} [fn] The constructor function to use when the dependency needs to be instantiated.
    */
    registerSingleton(key: any, fn: any): void;
    /**
    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default singleton registration is used.
    *
    * @method autoRegister
    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
    */
    autoRegister(fn: any, key?: any): void;
    /**
    * Registers an array of types (constructor functions) by inspecting their registration annotations. If none are found, then the default singleton registration is used.
    *
    * @method autoRegisterAll
    * @param {Function[]} fns The constructor function to use when the dependency needs to be instantiated.
    */
    autoRegisterAll(fns: any): void;
    /**
    * Registers a custom resolution function such that the container calls this function for each request to obtain the instance.
    *
    * @method registerHandler
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Function} handler The resolution function to use when the dependency is needed. It will be passed one arguement, the container instance that is invoking it.
    */
    registerHandler(key: any, handler: any): void;
    /**
    * Unregisters based on key.
    *
    * @method unregister
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    */
    unregister(key: any): void;
    /**
    * Resolves a single instance based on the provided key.
    *
    * @method get
    * @param {Object} key The key that identifies the object to resolve.
    * @return {Object} Returns the resolved instance.
    */
    get(key: any): any;
    /**
    * Resolves all instance registered under the provided key.
    *
    * @method getAll
    * @param {Object} key The key that identifies the objects to resolve.
    * @return {Object[]} Returns an array of the resolved instances.
    */
    getAll(key: any): any;
    /**
    * Inspects the container to determine if a particular key has been registred.
    *
    * @method hasHandler
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
    * @return {Boolean} Returns true if the key has been registred; false otherwise.
    */
    hasHandler(key: any, checkParent?: boolean): any;
    /**
    * Creates a new dependency injection container whose parent is the current container.
    *
    * @method createChild
    * @return {Container} Returns a new container instance parented to this.
    */
    createChild(): Container;
    /**
    * Invokes a function, recursively resolving its dependencies.
    *
    * @method invoke
    * @param {Function} fn The function to invoke with the auto-resolved dependencies.
    * @return {Object} Returns the instance resulting from calling the function.
    */
    invoke(fn: any): any;
    getOrCreateEntry(key: any): any;
    getOrCreateConstructionInfo(fn: any): any;
    createConstructionInfo(fn: any): {
        isClass: boolean;
        keys: any;
    };
}
