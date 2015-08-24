declare module 'aurelia-fetch-client/http-client' {
	export class HttpClient{
	  activeRequestCount: any;
 	  isRequesting: boolean;
 	  interceptors: any;
 	  isConfigured: boolean;
 	  baseUrl: string;
 	  defaults: any;
	  configure(config: any): HttpClient;
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
}
declare module 'aurelia-fetch-client/index' {
	/**
 	* A simple HTTP client based on the Fetch API.
 	* 
 	* @module fetch-client
 	*/
	export {HttpClient} from 'aurelia-fetch-client/http-client';
	export {HttpClientConfiguration} from 'aurelia-fetch-client/http-client-configuration';
	export {json} from 'aurelia-fetch-client/util';
}
declare module 'aurelia-fetch-client' {
	export * from 'aurelia-fetch-client/index';
}
