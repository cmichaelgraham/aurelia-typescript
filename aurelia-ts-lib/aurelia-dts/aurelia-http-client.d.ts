declare module 'aurelia-http-client' {
	/**
	* The main HTTP client object.
	*
	* @class HttpClient
	* @constructor
	*/
	class HttpClient {
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

	class HttpRequestMessage {
    method: any;
    uri: any;
    content: any;
    headers: any;
    responseType: any;
    constructor(method: any, uri: any, content?: any, headers?: any);
	}

	class HttpResponseMessage {
    requestMessage: any;
    statusCode: any;
    response: any;
    isSuccess: any;
    statusText: any;
    responseType: any;
    reviver: any;
    headers: any;
    _content: any;
    constructor(requestMessage: any, xhr: any, responseType: any, reviver?: any);
    content: any;
	}

	class JSONPRequestMessage {
    method: any;
    uri: any;
    content: any;
    headers: any;
    responseType: any;
    callbackParameterName: any;
    constructor(uri: any, callbackParameterName: any);
	}

	class Headers {
    headers: any;
    constructor(headers?: {});
    add(key: any, value: any): void;
    get(key: any): any;
    clear(): void;
    configureXHR(xhr: any): void;
    /**
     * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
     * headers according to the format described here:
     * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
     * This method parses that string into a user-friendly key/value pair object.
     */
    static parse(headerStr: any): Headers;
  }

  /**
	* A builder class allowing fluent composition of HTTP requests.
	*
	* @class RequestBuilder
	* @constructor
	*/
	class RequestBuilder {
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
}