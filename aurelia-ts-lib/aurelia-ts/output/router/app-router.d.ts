import { Container } from '../dependency-injection/aurelia-dependency-injection';
import { History } from '../history/aurelia-history';
import { Router } from './router';
import { PipelineProvider } from './pipeline-provider';
import { EventAggregator } from '../event-aggregator/aurelia-event-aggregator';
export declare class AppRouter extends Router {
    pipelineProvider: any;
    events: any;
    history: any;
    queue: any;
    isNavigating: any;
    isActive: any;
    container: any;
    options: any;
    static inject(): (typeof Container | typeof History | typeof PipelineProvider | typeof EventAggregator)[];
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
