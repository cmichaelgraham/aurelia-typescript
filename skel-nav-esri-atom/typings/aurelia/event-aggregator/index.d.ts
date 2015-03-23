export declare class EventAggregator {
    eventLookup: any;
    messageHandlers: any;
    constructor();
    publish(event: any, data: any): void;
    subscribe(event: any, callback: any): () => void;
}
export declare function includeEventsIn(obj: any): EventAggregator;
export declare function install(aurelia: any): void;
