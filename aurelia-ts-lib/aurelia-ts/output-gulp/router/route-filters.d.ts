import { Container } from 'aurelia-dependency-injection';
export declare class RouteFilterContainer {
    container: any;
    filters: any;
    filterCache: any;
    static inject(): typeof Container[];
    constructor(container: any);
    addStep(name: any, step: any, index?: number): void;
    getFilterSteps(name: any): any;
}
export declare function createRouteFilterStep(name: any): (routeFilterContainer: any) => RouteFilterStep;
export declare class RouteFilterStep {
    name: any;
    routeFilterContainer: any;
    isMultiStep: any;
    constructor(name: any, routeFilterContainer: any);
    getSteps(): any;
}
