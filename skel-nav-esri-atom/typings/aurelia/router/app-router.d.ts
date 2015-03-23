import { Container } from '../dependency-injection/index';
import { History } from '../history/index';
import { Router } from './router';
import { PipelineProvider } from './pipeline-provider';
import { EventAggregator } from '../event-aggregator/index';
export declare class AppRouter extends Router {
    pipelineProvider: any;
    events: any;
    history: any;
    queue: any;
    isNavigating: any;
    isActive: any;
    container: any;
    options: any;
    static inject(): (typeof Container | typeof EventAggregator | typeof History | typeof PipelineProvider)[];
    constructor(container: any, history: any, pipelineProvider: any, events: any);
    isRoot: boolean;
    loadUrl(url: any): any;
    queueInstruction(instruction: any): Promise<{}>;
    dequeueInstruction(): void;
    registerViewPort(viewPort: any, name: any): any;
    activate(options?: any): void;
    deactivate(): void;
    reset(): void;
}
