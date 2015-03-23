/**
* Stores metadata and provides helpers for searching and adding to it.
*
* @class MetadataStorage
*/
export declare class MetadataStorage {
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
export declare var Metadata: {
    on(owner: any): any;
    add(instance: any): MetadataStorage;
    configure: {
        location(staticPropertyName: any): void;
        locator(loc: any): void;
        classHelper(name: any, fn: any): void;
        functionHelper(name: any, fn: any): void;
    };
};
