/**
* A metadata annotation that describes the origin module of the function to which it's attached.
*
* @class Origin
* @constructor
* @param {string} moduleId The origin module id.
* @param {string} moduleMember The name of the export in the origin module.
*/
export declare class Origin {
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
