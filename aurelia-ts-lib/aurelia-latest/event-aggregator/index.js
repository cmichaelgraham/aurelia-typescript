class Handler {
  constructor(messageType, callback){
    this.messageType = messageType;
    this.callback = callback;
  }

  handle(message){
    if(message instanceof this.messageType){
      this.callback.call(null, message);
    }
  }
}

export class EventAggregator {
  constructor(){
    this.eventLookup = {};
    this.messageHandlers = [];
  }

  publish(event, data){
    var subscribers, i, handler;

    if(typeof event === 'string'){
      subscribers = this.eventLookup[event];
      if(subscribers){
        subscribers = subscribers.slice();
        i = subscribers.length;

        while(i--) {
          subscribers[i](data, event);
        }
      }
    }else{
      subscribers = this.messageHandlers.slice();
      i = subscribers.length;

      while(i--) {
        subscribers[i].handle(event);
      }
    }
  }

  subscribe(event, callback){
    var subscribers, handler;

    if(typeof event === 'string'){
      subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);

      subscribers.push(callback);

      return function(){
        subscribers.splice(subscribers.indexOf(callback), 1);
      };
    }else{
      handler = new Handler(event, callback);
      subscribers = this.messageHandlers;

      subscribers.push(handler);

      return function(){
        subscribers.splice(subscribers.indexOf(handler), 1);
      };
    }
  }
}

export function includeEventsIn(obj){
  var ea = new EventAggregator();

  obj.subscribe = function(event, callback){ 
    return ea.subscribe(event, callback);
  };

  obj.publish = function(event, data){
    ea.publish(event, data);
  };

  return ea;
}

export function install(aurelia){
  aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
}