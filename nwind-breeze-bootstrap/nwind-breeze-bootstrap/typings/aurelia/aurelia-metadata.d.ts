declare module 'aurelia-metadata' {
  import 'core-js';
  export interface MetadataType {
    global: Object;
    noop: Function;
    resource: string;
    paramTypes: string;
    properties: string;
    get(metadataKey: string, target: Function, targetKey: string): Object;
    getOwn(metadataKey: string, target: Function, targetKey: string): Object;
    define(metadataKey: string, metadataValue: Object, target: Function, targetKey: string): void;
    getOrCreateOwn(metadataKey: string, Type: Function, target: Function, targetKey: string): Object;
  }
  export interface DecoratorsConfigType {
    parameterizedDecorator(name: string, decorator: Function): void;
    simpleDecorator(name: string, decorator: Function): void;
  }
  export interface DecoratorsType {
    configure: DecoratorsConfigType;
  }
  
  /**
  * Provides helpers for working with metadata.
  */
  export const Metadata: MetadataType;
  
  /**
  * A metadata annotation that describes the origin module of the function to which it's attached.
  */
  export class Origin {
    
    /**
      * Creates an instance of Origin metadata.
      * @param moduleId The origin module id.
      * @param moduleMember The name of the export in the origin module.
      */
    constructor(moduleId: string, moduleMember: string);
    
    /**
      * Get the Origin annotation for the specified function.
      * @param fn The function to inspect for Origin metadata.
      * @return Returns the Origin metadata.
      */
    static get(fn: Function): Origin;
    
    /**
      * Set the Origin annotation for the specified function.
      * @param fn The function to set the Origin metadata on.
      * @param fn The Origin metadata to store on the function.
      * @return Returns the Origin metadata.
      */
    static set(fn: Function, origin: Origin): void;
  }
  
  /**
  * Stores and applies a collection of decorators to a target.
  */
  export class DecoratorApplicator {
    constructor();
    
    /**
      * Adds a decorator to the collection.
      * @param decorator The decorator to add.
      * @return The current decorator applicator for chaining.
      */
    decorator(decorator: Function): DecoratorApplicator;
  }
  export const Decorators: DecoratorsType;
}