/**
* A builder class allowing fluent composition of HTTP requests.
*
* @class RequestBuilder
* @constructor
*/
export declare class RequestBuilder {
    client: any;
    transformers: any;
    constructor(client: any);
    /**
    * Adds a user-defined request transformer to the RequestBuilder.
    *
    * @method addHelper
    * @param {String} name The name of the helper to add.
    * @param {Function} fn The helper function.
    * @chainable
    */
    static addHelper(name: any, fn: any): void;
    /**
    * Sends an HTTP DELETE request.
    *
    * @method delete
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */
    delete(uri: any): any;
    /**
    * Sends an HTTP GET request.
    *
    * @method get
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */
    get(uri: any): any;
    /**
    * Sends an HTTP HEAD request.
    *
    * @method head
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */
    head(uri: any): any;
    /**
    * Sends a JSONP request.
    *
    * @method jsonp
    * @param {String} uri The target URI.
    * @param {String} [callbackParameterName=jsoncallback] The target Javascript expression to invoke.
    * @return {Promise} A cancellable promise object.
    */
    jsonp(uri: any, callbackParameterName?: string): any;
    /**
    * Sends an HTTP OPTIONS request.
    *
    * @method options
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */
    options(uri: any): any;
    /**
    * Sends an HTTP PUT request.
    *
    * @method put
    * @param {String} uri The target URI.
    * @param {Object} uri The request payload.
    * @return {Promise} A cancellable promise object.
    */
    put(uri: any, content: any): any;
    /**
    * Sends an HTTP PATCH request.
    *
    * @method patch
    * @param {String} uri The target URI.
    * @param {Object} uri The request payload.
    * @return {Promise} A cancellable promise object.
    */
    patch(uri: any, content: any): any;
    /**
    * Sends an HTTP POST request.
    *
    * @method post
    * @param {String} uri The target URI.
    * @param {Object} uri The request payload.
    * @return {Promise} A cancellable promise object.
    */
    post(uri: any, content: any): any;
}
