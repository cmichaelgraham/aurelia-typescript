import { Pipeline } from './pipeline';
export declare class PipelineProvider {
    static inject(): any[];
    constructor(container: any);
    createPipeline(navigationContext: any): Pipeline;
}
