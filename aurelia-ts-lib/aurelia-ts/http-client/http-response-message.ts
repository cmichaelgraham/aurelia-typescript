import {Headers} from './headers';

export class HttpResponseMessage {
  requestMessage;
  statusCode;
  response;
  isSuccess;
  statusText;
  responseType;
  reviver;
  headers;
  _content;
  constructor(requestMessage, xhr, responseType, reviver?){
    this.requestMessage = requestMessage;
    this.statusCode = xhr.status;
    this.response = xhr.response;
    this.isSuccess = xhr.status >= 200 && xhr.status < 400;
    this.statusText = xhr.statusText;
    this.responseType = responseType;
    this.reviver = reviver;

    if(xhr.getAllResponseHeaders){
      this.headers = Headers.parse(xhr.getAllResponseHeaders());
    }else {
      this.headers = new Headers();
    }
  }

  get content(){
    try{
      if(this._content !== undefined){
        return this._content;
      }

      if(this.response === undefined || this.response === null){
        return this._content = this.response;
      }

      if(this.responseType === 'json'){
        return this._content = JSON.parse(this.response, this.reviver);
      }

      if(this.reviver){
        return this._content = this.reviver(this.response);
      }

      return this._content = this.response;
    }catch(e){
      if(this.isSuccess){
        throw e;
      }

      return this._content = null;
    }
  }
}
