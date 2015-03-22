declare module 'aurelia-dependency-injection' {
    /**
    * An abstract annotation used to allow functions/classes to indicate how they should be registered with the container.
    *
    * @class Registration
    * @constructor
    */
    class Registration {
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
    class Transient extends Registration {
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
    class Singleton extends Registration {
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
    class Resolver {
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
    class Lazy extends Resolver {
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
    class All extends Resolver {
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
    class Optional extends Resolver {
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
    class Parent extends Resolver {
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

    /**
    * A lightweight, extensible dependency injection container.
    *
    * @class Container
    * @constructor
    */
    class Container {
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
}