declare module 'aurelia-http-client/headers' {
	export class Headers {
	    headers: any;
	    constructor(headers?: {});
	    add(key: string, value: string): void;
	    get(key: string): string;
	    clear(): void;
	    configureXHR(xhr: XHR): void;
	    /**
	     * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
	     * headers according to the format described here:
	     * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
	     * This method parses that string into a user-friendly key/value pair object.
	     */
	    static parse(headerStr: string): Headers;
	}

}
declare module 'aurelia-http-client/http-response-message' {
	export class HttpResponseMessage {
	    requestMessage: RequestMessage;
	    statusCode: any;
	    response: any;
	    isSuccess: any;
	    statusText: any;
	    reviver: any;
	    mimeType: any;
	    responseType: string;
	    headers: any;
	    private _content;
	    constructor(requestMessage: RequestMessage, xhr: XHR, responseType: string, reviver?: Function);
	    content: any;
	}
	/**
	 * MimeTypes mapped to responseTypes
	 *
	 * @type {Object}
	 */
	export var mimeTypes: {
	    "text/html": string;
	    "text/javascript": string;
	    "application/javascript": string;
	    "text/json": string;
	    "application/json": string;
	    "application/rss+xml": string;
	    "application/atom+xml": string;
	    "application/xhtml+xml": string;
	    "text/markdown": string;
	    "text/xml": string;
	    "text/mathml": string;
	    "application/xml": string;
	    "text/yml": string;
	    "text/csv": string;
	    "text/css": string;
	    "text/less": string;
	    "text/stylus": string;
	    "text/scss": string;
	    "text/sass": string;
	    "text/plain": string;
	};

}
declare module 'aurelia-http-client/request-message-processor' {
	export class RequestMessageProcessor {
	    XHRType: any;
	    transformers: any;
	    xhr: any;
	    constructor(xhrType: any, transformers: any);
	    abort(): void;
	    process(client: any, message: RequestMessage): Promise<any>;
	}

}
declare module 'aurelia-http-client/transformers' {
	export function timeoutTransformer(client: any, processor: any, message: any, xhr: any): void;
	export function callbackParameterNameTransformer(client: any, processor: any, message: any, xhr: any): void;
	export function credentialsTransformer(client: any, processor: any, message: any, xhr: any): void;
	export function progressTransformer(client: any, processor: any, message: any, xhr: any): void;
	export function responseTypeTransformer(client: any, processor: any, message: any, xhr: any): void;
	export function headerTransformer(client: any, processor: any, message: any, xhr: any): void;
	export function contentTransformer(client: any, processor: any, message: any, xhr: any): void;

}
declare module 'aurelia-http-client/http-request-message' {
	import { RequestMessageProcessor } from 'aurelia-http-client/request-message-processor';
	export class HttpRequestMessage {
	    method: string;
	    url: string;
	    content: any;
	    headers: Headers;
	    responseType: any;
	    constructor(method?: string, url?: string, content?: any, headers?: Headers);
	}
	export function createHttpRequestMessageProcessor(): RequestMessageProcessor;

}
declare module 'aurelia-http-client/jsonp-request-message' {
	import { RequestMessageProcessor } from 'aurelia-http-client/request-message-processor';
	export class JSONPRequestMessage {
	    method: any;
	    url: string;
	    content: any;
	    headers: any;
	    responseType: any;
	    callbackParameterName: string;
	    constructor(url?: string, callbackParameterName?: string);
	}
	export function createJSONPRequestMessageProcessor(): RequestMessageProcessor;

}
declare module 'aurelia-http-client/request-message' {
	export class RequestMessage {
	    method: any;
	    url: string;
	    content: any;
	    headers: any;
	    constructor(method : string, url : string, content : any, headers?: Headers);
	    buildFullUrl(): string;
	}
}
declare module 'aurelia-http-client/request-builder' {
	/**
	* A builder class allowing fluent composition of HTTP requests.
	*
	* @class RequestBuilder
	* @constructor
	*/
	export class RequestBuilder {
	    client: HttpClient;
	    transformers: any;
	    useJsonp: any;
	    constructor(client: HttpClient);
	    /**
	    * Adds a user-defined request transformer to the RequestBuilder.
	    *
	    * @method addHelper
	    * @param {String} name The name of the helper to add.
	    * @param {Function} fn The helper function.
	    * @chainable
	    */
	    static addHelper(name: string, fn: any): void;
	    /**
	    * Sends the request.
	    *
	    * @method send
	    * @return {Promise} A cancellable promise object.
	    */
	    send(): Promise<any>;
	}
}
declare module 'aurelia-http-client/http-client' {
	import { RequestBuilder } from 'aurelia-http-client/request-builder';
	/**
	* The main HTTP client object.
	*
	* @class HttpClient
	* @constructor
	*/
	export class HttpClient {
	    requestTransformers: any;
	    requestProcessorFactories: any;
	    pendingRequests: any;
	    isRequesting: any;
	    constructor();
	    /**
	     * Configure this HttpClient with default settings to be used by all requests.
	     *
	     * @method configure
	     * @param {Function} fn A function that takes a RequestBuilder as an argument.
	     * @chainable
	     */
	    configure(fn: Function): HttpClient;
	    /**
	     * Returns a new RequestBuilder for this HttpClient instance that can be used to build and send HTTP requests.
	     *
	     * @method createRequest
	     * @param uri The target URI.
	     * @type RequestBuilder
	     */
	    createRequest(url: string): RequestBuilder;
	    /**
	     * Sends a message using the underlying networking stack.
	     *
	     * @method send
	     * @param message A configured HttpRequestMessage or JSONPRequestMessage.
	     * @param {Array} transformers A collection of transformers to apply to the HTTP request.
	     * @return {Promise} A cancellable promise object.
	     */
	    send(message: RequestMessage, transformers: Array<any>): Promise<any>;
	    /**
	     * Sends an HTTP DELETE request.
	     *
	     * @method delete
	     * @param {String} uri The target URI.
	     * @return {Promise} A cancellable promise object.
	     */
	    delete(url: string): Promise<any>;
	    /**
	     * Sends an HTTP GET request.
	     *
	     * @method get
	     * @param {String} uri The target URI.
	     * @return {Promise} A cancellable promise object.
	     */
	    get(url: string): Promise<any>;;
	    /**
	     * Sends an HTTP HEAD request.
	     *
	     * @method head
	     * @param {String} uri The target URI.
	     * @return {Promise} A cancellable promise object.
	     */
	    head(url: string): Promise<any>;;
	    /**
	     * Sends a JSONP request.
	     *
	     * @method jsonp
	     * @param {String} uri The target URI.
	     * @return {Promise} A cancellable promise object.
	     */
	    jsonp(url: string, callbackParameterName?: string): Promise<any>;
	    /**
	     * Sends an HTTP OPTIONS request.
	     *
	     * @method options
	     * @param {String} uri The target URI.
	     * @return {Promise} A cancellable promise object.
	     */
	    options(url: string): Promise<any>;
	    /**
	     * Sends an HTTP PUT request.
	     *
	     * @method put
	     * @param {String} uri The target URI.
	     * @param {Object} uri The request payload.
	     * @return {Promise} A cancellable promise object.
	     */
	    put(url: string, content: any): Promise<any>;
	    /**
	     * Sends an HTTP PATCH request.
	     *
	     * @method patch
	     * @param {String} uri The target URI.
	     * @param {Object} uri The request payload.
	     * @return {Promise} A cancellable promise object.
	     */
	    patch(url: string, content: any): Promise<any>;
	    /**
	     * Sends an HTTP POST request.
	     *
	     * @method post
	     * @param {String} uri The target URI.
	     * @param {Object} uri The request payload.
	     * @return {Promise} A cancellable promise object.
	     */
	    post(url: string, content: any): Promise<any>;
	}

}
declare module 'aurelia-http-client/index' {
	/**
	 * An extensible HTTP client provided by Aurelia.
	 *
	 * @module HttpClient
	 */
	export { HttpClient } from 'aurelia-http-client/http-client';
	export { HttpRequestMessage } from 'aurelia-http-client/http-request-message';
	export { HttpResponseMessage, mimeTypes } from 'aurelia-http-client/http-response-message';
	export { JSONPRequestMessage } from 'aurelia-http-client/jsonp-request-message';
	export { Headers } from 'aurelia-http-client/headers';
	export { RequestBuilder } from 'aurelia-http-client/request-builder';
	export { RequestMessage } from 'aurelia-http-client/request-message';
}
declare module 'aurelia-http-client' {
	export * from 'aurelia-http-client/index';
}
