export declare var COMPLETED: string;
export declare var CANCELLED: string;
export declare var REJECTED: string;
export declare var RUNNING: string;
export declare class Pipeline {
    steps: any;
    constructor();
    withStep(step: any): Pipeline;
    run(ctx: any): any;
}
