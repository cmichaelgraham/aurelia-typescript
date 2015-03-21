import { Container } from 'aurelia-dependency-injection';
import { Pipeline } from './pipeline';
import { BuildNavigationPlanStep } from './navigation-plan';
import { LoadRouteStep } from './route-loading';
import { CommitChangesStep } from './navigation-context';
import { CanDeactivatePreviousStep, CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep } from './activation';
import { createRouteFilterStep } from './route-filters';
export class PipelineProvider {
    constructor(container) {
        this.container = container;
        this.steps = [
            BuildNavigationPlanStep,
            CanDeactivatePreviousStep,
            LoadRouteStep,
            createRouteFilterStep('authorize'),
            createRouteFilterStep('modelbind'),
            CanActivateNextStep,
            //NOTE: app state changes start below - point of no return
            DeactivatePreviousStep,
            ActivateNextStep,
            createRouteFilterStep('precommit'),
            CommitChangesStep
        ];
    }
    static inject() {
        return [
            Container
        ];
    }
    createPipeline(navigationContext) {
        var pipeline = new Pipeline();
        this.steps.forEach(step => pipeline.withStep(this.container.get(step)));
        return pipeline;
    }
}
