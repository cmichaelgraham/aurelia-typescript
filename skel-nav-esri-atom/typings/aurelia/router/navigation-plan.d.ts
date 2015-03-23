export declare var NO_CHANGE: string;
export declare var INVOKE_LIFECYCLE: string;
export declare var REPLACE: string;
export declare function buildNavigationPlan(navigationContext: any, forceLifecycleMinimum?: any): Promise<{}>;
export declare class BuildNavigationPlanStep {
    run(navigationContext: any, next: any): any;
}
