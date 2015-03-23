declare module 'aurelia-router' {
    class Router {
        container: any;
        history: any;
        viewPorts: any;
        baseUrl: any;
        isConfigured: any;
        parent: any;
        navigation: any;
        recognizer: any;
        childRecognizer: any;
        catchAllHandler: any;
        routes: any;
        fallbackOrder: any;
        isNavigating: any;
        constructor(container: any, history: any);
        isRoot: boolean;
        registerViewPort(viewPort: any, name: any): void;
        refreshBaseUrl(): void;
        refreshNavigation(): void;
        configure(callbackOrConfig: any): Router;
        navigate(fragment: any, options: any): any;
        navigateBack(): void;
        createChild(container: any): Router;
        createNavigationInstruction(url?: string, parentInstruction?: any): any;
        createNavigationContext(instruction: any): NavigationContext;
        generate(name: any, params: any): any;
        addRoute(config: any, navModel?: {
            title: any;
            settings: any;
            order: any;
            href: any;
            isActive: boolean;
            config: any;
            relativeHref: any;
        }): void;
        handleUnknownRoutes(config: any): void;
        reset(): void;
    }

    class AppRouter extends Router {
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

    class PipelineProvider {
        container: any;
        steps: any;
        static inject(): typeof Container[];
        constructor(container: any);
        createPipeline(navigationContext: any): Pipeline;
    }

    /**
    * Used during the activation lifecycle to cause a redirect.
    *
    * @class Redirect
    * @constructor
    * @param {String} url The url to redirect to.
    */
    class Redirect {
        url: any;
        shouldContinueProcessing: any;
        router: any;
        constructor(url: any);
        /**
        * Called by the activation system to set the child router.
        *
        * @method setRouter
        * @param {Router} router
        */
        setRouter(router: any): void;
        /**
        * Called by the navigation pipeline to navigate.
        *
        * @method navigate
        * @param {Router} appRouter - a router which should redirect
        */
        navigate(appRouter: any): void;
    }

    class RouteLoader {
        loadRoute(router: any, config: any): void;
    }

    class RouterConfiguration {
        instructions: any;
        options: any;
        pipelineSteps: any;
        unknownRouteConfig: any;
        title: any;
        constructor();
        addPipelineStep(name: any, step: any): void;
        map(route: any, config?: any): RouterConfiguration;
        mapRoute(config: any): RouterConfiguration;
        mapUnknownRoutes(config: any): RouterConfiguration;
        exportToRouter(router: any): void;
        configureRoute(router: any, config: any, navModel?: any): void;
        ensureDefaultsForRouteConfig(config: any): void;
        deriveName(config: any): any;
        deriveRoute(config: any): any;
        deriveTitle(config: any): any;
        deriveModuleId(config: any): any;
    }

    var NO_CHANGE: string;
    var INVOKE_LIFECYCLE: string;
    var REPLACE: string;

    class RouteFilterContainer {
        container: any;
        filters: any;
        filterCache: any;
        static inject(): typeof Container[];
        constructor(container: any);
        addStep(name: any, step: any, index?: number): void;
        getFilterSteps(name: any): any;
    }

    class RouteFilterStep {
        name: any;
        routeFilterContainer: any;
        isMultiStep: any;
        constructor(name: any, routeFilterContainer: any);
        getSteps(): any;
    }
}
