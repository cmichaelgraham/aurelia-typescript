declare module 'aurelia-metadata' {
	/**
	* A metadata annotation that describes the origin module of the function to which it's attached.
	*
	* @class Origin
	* @constructor
	* @param {string} moduleId The origin module id.
	* @param {string} moduleMember The name of the export in the origin module.
	*/
	class Origin {
	    moduleId: any;
	    moduleMember: any;
	    constructor(moduleId: any, moduleMember?: any);
	    /**
	    * Get the Origin annotation for the specified function.
	    *
	    * @method get
	    * @static
	    * @param {Function} fn The function to inspect for Origin metadata.
	    * @return {Origin} Returns the Origin metadata.
	    */
	    static get(fn: any): {};
	    /**
	    * Set the Origin annotation for the specified function.
	    *
	    * @method set
	    * @static
	    * @param {Function} fn The function to set the Origin metadata on.
	    * @param {origin} fn The Origin metadata to store on the function.
	    * @return {Origin} Returns the Origin metadata.
	    */
	    static set(fn: any, origin: any): void;
	}

	/**
	* An abstract base class used to designate resources which can be loaded and registered in a framework.
	*
	* @class ResourceType
	* @constructor
	*/
	class ResourceType {
	    /**
	    * Implemented by resource metadata to allow it to self-configure and load dependencies.
	    *
	    * @method load
	    * @param {Container} container The dependency injection container to use for service resolution.
	    * @param {Object} target The target that is decorated by this ResourceType metadata.
	    * @return {Promise} Returns a promise for itself, resolving when all dependent resources are loaded.
	    */
	    load(container: any, target: any): ResourceType;
	    /**
	    * Implemented by resources to allow them to register themselved in a resource registry.
	    *
	    * @method register
	    * @param {ResourceRegistry} registry The resource registry that this resource needs to be registered in.
	    * @param {String} [name] A possible name override for the resource.
	    */
	    register(registry: any, name: any): void;
	}

	/**
	* Stores metadata and provides helpers for searching and adding to it.
	*
	* @class MetadataStorage
	*/
	class MetadataStorage {
	    metadata: any;
	    owner: any;
	    last: any;
	    static empty: any;
	    constructor(metadata?: any, owner?: any);
	    /**
	    * Searches metadata and returns the first instance of a particular type.
	    *
	    * @method first
	    * @param {Function} type The metadata type to look for.
	    * @param {Boolean} searchPrototype Indicates whether or not to search the inheritance hierarchy for metadata.
	    * @return {Object} Returns an instance of the specified metadata type if found; otherwise null.
	    */
	    first(type: any, searchPrototype: any): any;
	    has(type: any, searchPrototype: any): boolean;
	    /**
	    * Searches metadata for all instances of a particular type.
	    *
	    * @method all
	    * @param {Function} type The metadata type to look for.
	    * @param {Boolean} searchPrototype Indicates whether or not to search the inheritance hierarchy for metadata.
	    * @return {Array} Returns an array of the specified metadata type.
	    */
	    all(type: any, searchPrototype: any): any;
	    /**
	    * Adds metadata.
	    *
	    * @method add
	    * @param {Object} instance The metadata instance to add.
	    */
	    add(instance: any): MetadataStorage;
	    and(func: any): MetadataStorage;
	}
	/**
	* Provides access to metadata.
	*
	* @class Metadata
	* @static
	*/
	var Metadata: {
	    on(owner: any): any;
	    add(instance: any): MetadataStorage;
	    configure: {
	        location(staticPropertyName: any): void;
	        locator(loc: any): void;
	        classHelper(name: any, fn: any): void;
	        functionHelper(name: any, fn: any): void;
	    };
	};

}