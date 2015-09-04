declare module 'aurelia-http-client' {
  import * as core from 'core-js';
  import { join, buildQueryString }  from 'aurelia-path';
  export interface XHRConstructor {
  }
  
  // new():XHR;
  export interface XHR {
    status: number;
    statusText: string;
    response: any;
    responseText: string;
    onload: Function;
    ontimeout: Function;
    onerror: Function;
    onabort: Function;
    abort(): void;
    open(method: string, url: string, isAsync: boolean): void;
    send(content?: any): void;
  }
  export interface XHRTransformer {
  }
  export interface RequestTransformer {
  }
  export class Headers {
    constructor(headers?: Object);
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
  export class RequestMessage {
    constructor(method: string, url: string, content: any, headers?: Headers);
    buildFullUrl(): string;
  }
  export class HttpResponseMessage {
    constructor(requestMessage: RequestMessage, xhr: XHR, responseType: string, reviver: Function);
    content(): any;
  }
  
  /**
   * MimeTypes mapped to responseTypes
   *
   * @type {Object}
   */
  export let mimeTypes: any;
  export class RequestMessageProcessor {
    constructor(xhrType: XHRConstructor, xhrTransformers: XHRTransformer[]);
    abort(): void;
    process(client: any, requestMessage: RequestMessage): Promise<any>;
  }
  export function timeoutTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function callbackParameterNameTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function credentialsTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function progressTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function responseTypeTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function headerTransformer(client: any, processor: any, message: any, xhr: any): any;
  export function contentTransformer(client: any, processor: any, message: any, xhr: any): any;
  export class JSONPRequestMessage extends RequestMessage {
    constructor(url: string, callbackParameterName: string);
  }
  class JSONPXHR {
    open(method: string, url: string): void;
    send(): void;
    abort(): void;
    setRequestHeader(): any;
  }
  export function createJSONPRequestMessageProcessor(): any;
  export class HttpRequestMessage extends RequestMessage {
    constructor(method: string, url: string, content: any, headers?: Headers);
  }
  
  // text, arraybuffer, blob, document
  export function createHttpRequestMessageProcessor(): RequestMessageProcessor;
  
  /**
   * A builder class allowing fluent composition of HTTP requests.
   */
  export class RequestBuilder {
    constructor(client: HttpClient);
    
    /**
       * Adds a user-defined request transformer to the RequestBuilder.
       * @param name The name of the helper to add.
       * @param fn The helper function.
       */
    static addHelper(name: string, fn: (() => RequestTransformer)): void;
    
    /**
       * Sends the request.
       * @return {Promise} A cancellable promise object.
       */
    send(): Promise<any>;
  }
  
  /**
  * The main HTTP client object.
  */
  export class HttpClient {
    constructor();
    
    /**
       * Configure this HttpClient with default settings to be used by all requests.
       * @param fn A function that takes a RequestBuilder as an argument.
       */
    configure(fn: Function): HttpClient;
    
    /**
       * Returns a new RequestBuilder for this HttpClient instance that can be used to build and send HTTP requests.
       * @param url The target URL.
       */
    createRequest(url: string): RequestBuilder;
    
    /**
       * Sends a message using the underlying networking stack.
       * @param message A configured HttpRequestMessage or JSONPRequestMessage.
       * @param transformers A collection of transformers to apply to the HTTP request.
       * @return A cancellable promise object.
       */
    send(requestMessage: RequestMessage, transformers: Array<RequestTransformer>): Promise<any>;
    
    /**
       * Sends an HTTP DELETE request.
       * @param url The target URL.
       * @return A cancellable promise object.
       */
    delete(url: string): Promise<any>;
    
    /**
       * Sends an HTTP GET request.
       * @param url The target URL.
       * @return {Promise} A cancellable promise object.
       */
    get(url: string): Promise<any>;
    
    /**
       * Sends an HTTP HEAD request.
       * @param url The target URL.
       * @return A cancellable promise object.
       */
    head(url: string): Promise<any>;
    
    /**
       * Sends a JSONP request.
       * @param url The target URL.
       * @return A cancellable promise object.
       */
    jsonp(url: string, callbackParameterName?: string): Promise<any>;
    
    /**
       * Sends an HTTP OPTIONS request.
       * @param url The target URL.
       * @return A cancellable promise object.
       */
    options(url: string): Promise<any>;
    
    /**
       * Sends an HTTP PUT request.
       * @param url The target URL.
       * @param url The request payload.
       * @return A cancellable promise object.
       */
    put(url: string, content: any): Promise<any>;
    
    /**
       * Sends an HTTP PATCH request.
       * @param url The target URL.
       * @param url The request payload.
       * @return A cancellable promise object.
       */
    patch(url: string, content: any): Promise<any>;
    
    /**
       * Sends an HTTP POST request.
       * @param url The target URL.
       * @param url The request payload.
       * @return A cancellable promise object.
       */
    post(url: string, content: any): Promise<any>;
  }
}