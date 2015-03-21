export function timeoutTransformer(client, processor, message, xhr){
  if(message.timeout !== undefined){
    xhr.timeout = message.timeout;
  }
}

export function callbackParameterNameTransformer(client, processor, message, xhr){
  if(message.callbackParameterName !== undefined){
    xhr.callbackParameterName = message.callbackParameterName;
  }
}

export function credentialsTransformer(client, processor, message, xhr){
  if(message.withCredentials !== undefined){
    xhr.withCredentials = message.withCredentials;
  }
}

export function progressTransformer(client, processor, message, xhr){
  if(message.progressCallback){
    xhr.upload.onprogress = message.progressCallback;
  }
}

export function responseTypeTransformer(client, processor, message, xhr){
  var responseType = message.responseType;

  if(responseType === 'json'){
    responseType = 'text'; //IE does not support json
  }

  xhr.responseType = responseType;
}

export function headerTransformer(client, processor, message, xhr){
  message.headers.configureXHR(xhr);
}

export function contentTransformer(client, processor, message, xhr){
  if(window.FormData && message.content instanceof FormData){
    return;
  }

  if(window.Blob && message.content instanceof Blob){
    return;
  }

  if(window.ArrayBufferView && message.content instanceof ArrayBufferView){
    return;
  }

  if(message.content instanceof Document){
    return;
  }

  if(typeof message.content === 'string'){
    return;
  }

  if(message.content === null || message.content === undefined){
    return;
  }

  message.content = JSON.stringify(message.content, message.replacer);
}
