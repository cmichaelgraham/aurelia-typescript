export declare class NavigationContext {
    router: any;
    nextInstruction: any;
    currentInstruction: any;
    prevInstruction: any;
    plan: any;
    constructor(router: any, nextInstruction: any);
    getAllContexts(acc?: any[]): any[];
    nextInstructions: any[];
    currentInstructions: any[];
    prevInstructions: any[];
    commitChanges(waitToSwap: any): Promise<void>;
    buildTitle(separator?: string): any;
}
export declare class CommitChangesStep {
    run(navigationContext: any, next: any): any;
}
