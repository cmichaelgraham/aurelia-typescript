export declare class RouteLoader {
    loadRoute(router: any, config: any): void;
}
export declare class LoadRouteStep {
    routeLoader: any;
    static inject(): typeof RouteLoader[];
    constructor(routeLoader: any);
    run(navigationContext: any, next: any): Promise<{}>;
}
export declare function loadNewRoute(routers: any, routeLoader: any, navigationContext: any): Promise<{}[]>;
