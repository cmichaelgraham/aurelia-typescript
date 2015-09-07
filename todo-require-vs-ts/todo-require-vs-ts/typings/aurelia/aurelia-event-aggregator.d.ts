declare module 'aurelia-event-aggregator' {
  import * as LogManager from 'aurelia-logging';
  class Handler {
    constructor(messageType: any, callback: any);
    handle(message: any): any;
  }
  export class EventAggregator {
    constructor();
    publish(event: string | any, data?: any): void;
    subscribe(event: string | Function, callback: Function): Function;
    subscribeOnce(event: string | Function, callback: Function): Function;
  }
  export function includeEventsIn(obj: Object): EventAggregator;
  export function configure(config: Object): void;
}