declare module 'aurelia-templating-router' {
  import * as LogManager from 'aurelia-logging';
  import { customAttribute, bindable, ViewSlot, ViewLocator, customElement, noView, BehaviorInstruction, CompositionEngine }  from 'aurelia-templating';
  import { inject, Container }  from 'aurelia-dependency-injection';
  import { Router, RouteLoader, AppRouter }  from 'aurelia-router';
  import { DOM }  from 'aurelia-pal';
  import { Origin }  from 'aurelia-metadata';
  import { relativeToFile }  from 'aurelia-path';
  export class RouteHref {
    constructor(router: any, element: any);
    bind(): any;
    unbind(): any;
    attributeChanged(value: any, previous: any): any;
    processChange(): any;
  }
  export class RouterView {
    swapOrder: any;
    constructor(element: any, container: any, viewSlot: any, router: any, viewLocator: any);
    bind(bindingContext: any): any;
    process(viewPortInstruction: any, waitToSwap: any): any;
    swap(viewPortInstruction: any): any;
  }
  export class TemplatingRouteLoader extends RouteLoader {
    constructor(compositionEngine: any);
    loadRoute(router: any, config: any): any;
  }
}