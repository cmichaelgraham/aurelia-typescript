declare module 'aurelia-metadata/metadata' {
	/**
	* Provides helpers for working with metadata.
	*
	* @class Metadata
	* @static
	*/
	export var Metadata: {
	    global: any;
	    resource: string;
	    paramTypes: string;
	    properties: string;
	    get(metadataKey: string, target: any, targetKey?: string): any;
	    getOwn(metadataKey: string, target: any, targetKey?: string): any;
	    define(metadataKey: string, metadataValue: any, target: any, targetKey : string): void;
	    getOrCreateOwn(metadataKey: string, Type: any, target: any, targetKey?: string): any;
	};

}
declare module 'aurelia-metadata/decorator-applicator' {
	export class DecoratorApplicator {
	    private _first;
	    private _second;
	    private _third;
	    private _rest;
	    constructor();
	    decorator(decorator: any): DecoratorApplicator;
	    _decorate(target: any): void;
	}

}
declare module 'aurelia-metadata/decorators' {
	export var Decorators: {
	    configure: {
	        parameterizedDecorator(name: any, decorator: any): void;
	        simpleDecorator(name: any, decorator: any): void;
	    };
	};

}
declare module 'aurelia-metadata/origin' {
	/**
	* A metadata annotation that describes the origin module of the function to which it's attached.
	*
	* @class Origin
	* @constructor
	* @param {string} moduleId The origin module id.
	* @param {string} moduleMember The name of the export in the origin module.
	*/
	export class Origin {
	    moduleId: any;
	    moduleMember: any;
	    constructor(moduleId: string, moduleMember?: string);
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

}
declare module 'aurelia-metadata/index' {
	/**
	 * Utilities for reading and writing the metadata of JavaScript functions.
	 *
	 * @module metadata
	 */
	export { Origin } from 'aurelia-metadata/origin';
	export { Metadata } from 'aurelia-metadata/metadata';
	export { Decorators } from 'aurelia-metadata/decorators';

}
declare module 'aurelia-metadata' {
	export * from 'aurelia-metadata/index';
}
