import { RequestBuilder } from './request-builder';
/**
* The main HTTP client object.
*
* @class HttpClient
* @constructor
*/
export declare class HttpClient {
    requestTransformers: any;
    requestProcessorFactories: any;
    pendingRequests: any;
    isRequesting: any;
    constructor();
    /**
     * Returns a new RequestBuilder for this HttpClient instance which can be used to build and send HTTP requests.
     *
     * @property request
     * @type RequestBuilder
     */
    request: RequestBuilder;
    /**
     * Configure this HttpClient with default settings to be used by all requests.
     *
     * @method configure
     * @param {Function} fn A function that takes a RequestBuilder as an argument.
     * @chainable
     */
    configure(fn: any): HttpClient;
    /**
     * Sends a message using the underlying networking stack.
     *
     * @method send
     * @param message A configured HttpRequestMessage or JSONPRequestMessage.
     * @param {Array} transformers A collection of transformers to apply to the HTTP request.
     * @return {Promise} A cancellable promise object.
     */
    send(message: any, transformers: any): any;
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
