import {join} from 'aurelia-path';
import {HttpRequestMessage} from './http-request-message';
import {JSONPRequestMessage} from './jsonp-request-message';

/**
* A builder class allowing fluent composition of HTTP requests.
*
* @class RequestBuilder
* @constructor
*/
export class RequestBuilder {
	constructor (client) {
		this.client = client;
		this.transformers = client.requestTransformers.slice(0);
	}

	/**
	* Adds a user-defined request transformer to the RequestBuilder.
	*
	* @method addHelper
	* @param {String} name The name of the helper to add.
	* @param {Function} fn The helper function.
	* @chainable
	*/
	static addHelper(name, fn){
		RequestBuilder.prototype[name] = function(){
			this.transformers.push(fn.apply(this, arguments));
			return this;
		};
	}

	/**
	* Sends an HTTP DELETE request.
	*
	* @method delete
	* @param {String} uri The target URI.
	* @return {Promise} A cancellable promise object.
	*/
	delete(uri){
		var message = new HttpRequestMessage('DELETE', uri);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends an HTTP GET request.
	*
	* @method get
	* @param {String} uri The target URI.
	* @return {Promise} A cancellable promise object.
	*/
	get(uri){
		var message = new HttpRequestMessage('GET', uri);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends an HTTP HEAD request.
	*
	* @method head
	* @param {String} uri The target URI.
	* @return {Promise} A cancellable promise object.
	*/
	head(uri){
		var message = new HttpRequestMessage('HEAD', uri);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends a JSONP request.
	*
	* @method jsonp
	* @param {String} uri The target URI.
	* @param {String} [callbackParameterName=jsoncallback] The target Javascript expression to invoke.
	* @return {Promise} A cancellable promise object.
	*/
	jsonp(uri, callbackParameterName='jsoncallback'){
		var message = new JSONPRequestMessage(uri, callbackParameterName);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends an HTTP OPTIONS request.
	*
	* @method options
	* @param {String} uri The target URI.
	* @return {Promise} A cancellable promise object.
	*/
	options(uri){
		var message = new HttpRequestMessage('OPTIONS', uri);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends an HTTP PUT request.
	*
	* @method put
	* @param {String} uri The target URI.
	* @param {Object} uri The request payload.
	* @return {Promise} A cancellable promise object.
	*/
	put(uri, content){
		var message = new HttpRequestMessage('PUT', uri, content);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends an HTTP PATCH request.
	*
	* @method patch
	* @param {String} uri The target URI.
	* @param {Object} uri The request payload.
	* @return {Promise} A cancellable promise object.
	*/
	patch(uri, content){
		var message = new HttpRequestMessage('PATCH', uri, content);
		return this.client.send(message, this.transformers);
	}

	/**
	* Sends an HTTP POST request.
	*
	* @method post
	* @param {String} uri The target URI.
	* @param {Object} uri The request payload.
	* @return {Promise} A cancellable promise object.
	*/
	post(uri, content){
		var message = new HttpRequestMessage('POST', uri, content);
		return this.client.send(message, this.transformers);
	}
}

RequestBuilder.addHelper('withBaseUrl', function(baseUrl){
	return function(client, processor, message){
		message.baseUrl = baseUrl;
	}
});

RequestBuilder.addHelper('withParams', function(params){
	return function(client, processor, message){
		message.params = params;
	}
});

RequestBuilder.addHelper('withResponseType', function(responseType){
	return function(client, processor, message){
		message.responseType = responseType;
	}
});

RequestBuilder.addHelper('withTimeout', function(timeout){
	return function(client, processor, message){
		message.timeout = timeout;
	}
});

RequestBuilder.addHelper('withHeader', function(key, value){
	return function(client, processor, message){
		message.headers.add(key, value);
	}
});

RequestBuilder.addHelper('withCredentials', function(value){
	return function(client, processor, message){
		message.withCredentials = value;
	}
});

RequestBuilder.addHelper('withReviver', function(reviver){
	return function(client, processor, message){
		message.reviver = reviver;
	}
});

RequestBuilder.addHelper('withReplacer', function(replacer){
	return function(client, processor, message){
		message.replacer = replacer;
	}
});

RequestBuilder.addHelper('withProgressCallback', function(progressCallback){
	return function(client, processor, message){
		message.progressCallback = progressCallback;
	}
});

RequestBuilder.addHelper('withCallbackParameterName', function(callbackParameterName){
	return function(client, processor, message){
		message.callbackParameterName = callbackParameterName;
	}
});
