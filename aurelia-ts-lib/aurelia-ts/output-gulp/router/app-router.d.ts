import { Container } from 'aurelia-dependency-injection';
import { History } from 'aurelia-history';
import { Router } from './router';
import { PipelineProvider } from './pipeline-provider';
import { EventAggregator } from 'aurelia-event-aggregator';
export declare class AppRouter extends Router {
    pipelineProvider: any;
    events: any;
    history: any;
    queue: any;
    isNavigating: any;
    isActive: any;
    container: any;
    options: any;
    static inject(): (typeof EventAggregator | typeof History | typeof Container | typeof PipelineProvider)[];
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
