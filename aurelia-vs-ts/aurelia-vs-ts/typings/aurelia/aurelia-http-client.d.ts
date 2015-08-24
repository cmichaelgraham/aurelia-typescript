declare module 'aurelia-http-client' {
  import core from 'core-js';
  import { join, buildQueryString }  from 'aurelia-path';
  export class Headers {
    constructor(headers?: any);
    add(key: any, value: any): any;
    get(key: any): any;
    clear(): any;
    configureXHR(xhr: any): void;
    
    /**
       * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
       * headers according to the format described here:
       * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
       * This method parses that string into a user-friendly key/value pair object.
       */
    static parse(headerStr: any): any;
  }
  export class RequestMessage {
    constructor(method: any, url: string, content: any, headers?: Headers);
    buildFullUrl(): any;
  }
  
  /*jshint -W093 */
  export class HttpResponseMessage {
    constructor(requestMessage: RequestMessage, xhr: XHR, responseType: string, reviver: Function);
    content(): any;
  }
  
  /**
   * MimeTypes mapped to responseTypes
   *
   * @type {Object}
   */
  export var mimeTypes: any;
  export class RequestMessageProcessor {
    constructor(xhrType: any, xhrTransformers: any);
    abort(): void;
    process(client: any, message: any): any;
  }
  export function timeoutTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function callbackParameterNameTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function credentialsTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function progressTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function responseTypeTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function headerTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function contentTransformer(client: any, processor: any, message: any, xhr: any): any;
  export class JSONPRequestMessage extends RequestMessage {
    constructor(url: any, callbackParameterName: any);
  }
  class JSONPXHR {
    open(method: string, url: string): void;
    send(): void;
    abort(): void;
    setRequestHeader(): any;
  }
  export function createJSONPRequestMessageProcessor(): any;
  export class HttpRequestMessage extends RequestMessage {
    constructor(method: any, url: string, content: any, headers?: Headers);
  }
  export function createHttpRequestMessageProcessor(): RequestMessageProcessor;
  
  /**
   * A builder class allowing fluent composition of HTTP requests.
   *
   * @class RequestBuilder
   * @constructor
   */
  export class RequestBuilder {
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
  
  /**
  * The main HTTP client object.
  *
  * @class HttpClient
  * @constructor
  */
  export class HttpClient {
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
       * @param url The target URL.
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
    send(message: RequestMessage, transformers: Array<any>): Prpmise<any>;
    
    /**
       * Sends an HTTP DELETE request.
       *
       * @method delete
       * @param {String} url The target URL.
       * @return {Promise} A cancellable promise object.
       */
    delete(url: string): Prpmise<any>;
    
    /**
       * Sends an HTTP GET request.
       *
       * @method get
       * @param {String} url The target URL.
       * @return {Promise} A cancellable promise object.
       */
    get(url: string): Prpmise<any>;
    
    /**
       * Sends an HTTP HEAD request.
       *
       * @method head
       * @param {String} url The target URL.
       * @return {Promise} A cancellable promise object.
       */
    head(url: string): Prpmise<any>;
    
    /**
       * Sends a JSONP request.
       *
       * @method jsonp
       * @param {String} url The target URL.
       * @return {Promise} A cancellable promise object.
       */
    jsonp(url: string, callbackParameterName : string = 'jsoncallback'): Prpmise<any>;
    
    /**
       * Sends an HTTP OPTIONS request.
       *
       * @method options
       * @param {String} url The target URL.
       * @return {Promise} A cancellable promise object.
       */
    options(url: string): Prpmise<any>;
    
    /**
       * Sends an HTTP PUT request.
       *
       * @method put
       * @param {String} url The target URL.
       * @param {Object} url The request payload.
       * @return {Promise} A cancellable promise object.
       */
    put(url: string, content: any): Prpmise<any>;
    
    /**
       * Sends an HTTP PATCH request.
       *
       * @method patch
       * @param {String} url The target URL.
       * @param {Object} url The request payload.
       * @return {Promise} A cancellable promise object.
       */
    patch(url: string, content: any): Prpmise<any>;
    
    /**
       * Sends an HTTP POST request.
       *
       * @method post
       * @param {String} url The target URL.
       * @param {Object} url The request payload.
       * @return {Promise} A cancellable promise object.
       */
    post(url: string, content: any): Prpmise<any>;
  }
}
