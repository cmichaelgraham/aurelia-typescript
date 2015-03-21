export declare class NavigationInstruction {
    fragment: any;
    queryString: any;
    params: any;
    queryParams: any;
    config: any;
    lifecycleArgs: any;
    viewPortInstructions: any;
    constructor(fragment: any, queryString: any, params: any, queryParams: any, config: any, parentInstruction: any);
    addViewPortInstruction(viewPortName: any, strategy: any, moduleId: any, component: any): {
        name: any;
        strategy: any;
        moduleId: any;
        component: any;
        childRouter: any;
        lifecycleArgs: any;
    };
    getWildCardName(): any;
    getWildcardPath(): any;
    getBaseUrl(): any;
}
