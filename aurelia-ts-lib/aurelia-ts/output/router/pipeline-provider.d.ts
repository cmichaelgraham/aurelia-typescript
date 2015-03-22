import { Container } from '../dependency-injection/index';
import { Pipeline } from './pipeline';
export declare class PipelineProvider {
    container: any;
    steps: any;
    static inject(): typeof Container[];
    constructor(container: any);
    createPipeline(navigationContext: any): Pipeline;
}
