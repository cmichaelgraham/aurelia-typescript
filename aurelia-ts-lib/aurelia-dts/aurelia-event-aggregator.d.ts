declare module 'aurelia-event-aggregator' {
	class EventAggregator {
	  eventLookup: any;
	  messageHandlers: any;
	  constructor();
	  publish(event: any, data: any): void;
	  subscribe(event: any, callback: any): () => void;
	}
	function includeEventsIn(obj: any): EventAggregator;
	function install(aurelia: any): void;
}