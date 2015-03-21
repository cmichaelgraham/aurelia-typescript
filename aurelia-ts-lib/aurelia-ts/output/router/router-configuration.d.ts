export declare class RouterConfiguration {
    instructions: any;
    options: any;
    pipelineSteps: any;
    unknownRouteConfig: any;
    title: any;
    constructor();
    addPipelineStep(name: any, step: any): void;
    map(route: any, config?: any): RouterConfiguration;
    mapRoute(config: any): RouterConfiguration;
    mapUnknownRoutes(config: any): RouterConfiguration;
    exportToRouter(router: any): void;
    configureRoute(router: any, config: any, navModel?: any): void;
    ensureDefaultsForRouteConfig(config: any): void;
    deriveName(config: any): any;
    deriveRoute(config: any): any;
    deriveTitle(config: any): any;
    deriveModuleId(config: any): any;
}
