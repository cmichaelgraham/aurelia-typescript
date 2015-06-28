declare module 'aurelia-fetch-client/http-client' {
	export class HttpClient{
	  activeRequestCount: any;
 	  isRequesting: boolean;
 	  interceptors: any;
 	  isConfigured: boolean;
 	  baseUrl: any;
 	  defaults: any;
	  configure(config: any): void;
	  addInterceptor(interceptor: any): void;
	  fetch(input: any, init: any): any;
	}
}
declare module 'aurelia-fetch-client/http-client-configuration' {
	export class HttpClientConfiguration{
		baseUrl: any;
		defaults: {};
		interceptors: any;
		withBaseUrl(baseUrl: any): any;
		withDefaults(defaults: any): any;
		withInterceptor(interceptor: any): any;
		useStandardConfiguration(): any;
		rejectErrorResponses(): any;		
	}
}
declare module 'aurelia-fetch-client/util' {
	/**
 	* Create a Blob containing JSON-serialized data.
 	* Useful for easily creating JSON fetch request bodies.
 	* 
 	* @param {*} body - [description]
 	* @return {Blob} - A blob containing the JSON-serialized body.
 	*/
	export function json(body: any): any;
	/**
 	* Merges two Headers collections to create a third Headers object.
 	* 
 	* @param {Headers|Object} first - The first Headers object, or an
 	* object whose key/value pairs correspond to header names and values.
 	* @param {Headers|Object} second - The second Headers object, or an
 	* object whose key/value pairs correspond to header names and values.
 	* Headers in the second collection will take priority.
 	* @return {Headers} - A Headers instance containing the headers from
 	* both objects.
 	*/
	export function mergeHeaders(first: any, second: any): any;
}
declare module 'aurelia-fetch-client/index' {
	/**
 	* A simple HTTP client based on the Fetch API.
 	* 
 	* @module fetch-client
 	*/
	export {HttpClient} from 'aurelia-fetch-client/http-client';
	export {HttpClientConfiguration} from 'aurelia-fetch-client/http-client-configuration';
	export {mergeHeaders, json} from 'aurelia-fetch-client/util';
}
declare module 'aurelia-fetch-client' {
	export * from 'aurelia-fetch-client/index';
}