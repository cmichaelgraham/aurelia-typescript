interface Creator<T> {
    new (...args): T;
}

declare module "aurelia-logging-console" {
    class ConsoleAppender implements AuAppender { }
}

declare module "aurelia-dependency-injection" {
    interface HandlerCallback {
        (container: Container): void;
    }

    class Container {
        get: <T>(key: any) => T;
        registerSingleton: <T>(key: any, fn?: Creator<T>) => void;
        registerTransient: <T>(key: any, fn?: Creator<T>) => void;
        registerInstance: (key: any, instance: any) => void;
        registerHandler: (key: any, callback: HandlerCallback) => void;
        supportAtScript: () => void;
        createChild: () => Container;
    }

    class Transient { }

    class Singleton { }

    class Resolver {
        get: (container: Container) => () => any;
    }

    class Lazy extends Resolver {
        constructor(key: any);
        static of: (key: any) => Lazy;
    }

    class All extends Resolver {
        constructor(key: any);
        static of: (key: any) => All;
    }

    class Optional extends Resolver {
        constructor(key: any);
        static of: (key: any, checkParent?: boolean) => Optional;
    }

    class Parent extends Resolver {
        constructor(key: any);
        get: (container: Container) => () => any;
        static of: (key: any) => Parent;
    }
}

declare module "aurelia-templating" {
    class ResourcePool { }
    class ViewCompiler {
        compile(templateOrFragment: HTMLElement | DocumentFragment, viewResources: ViewResources, options?: Object): ViewFactory;
    }
    class ViewFactory {
        create(container, executionContext, options?): View; 
    }
    class ViewResources {
        public viewUrl: string;
    }
    class ViewSlot {
        add(view: View);
        remove(view: View);
    }
    class View {
        bind(context);
        unbind();
    }
}

declare module "aurelia-router" {
    import aureliadependencyinjection = require("aurelia-dependency-injection");
    import aureliahistory = require("aurelia-history");

    interface IRoute {
        // todo: update "route" to union type (string | Array<string>) when union types are mainstream
        route: string | Array<string>;
        moduleId: string;
        nav?: boolean;
        title?: string;
        settings?: any;
    }

    interface IRouterConfig {
        title: string;
        addPipelineStep(stepName: string, pipelineStep:any);
        map: (routeArray: Array<IRoute>) => void;
    }

    interface IRouterNavigationRouteConfig extends IRoute {
        route: string;
        name: string;
        navModel: IRouterNavigationRoute;
        href: string;
        isActive: boolean;
        order: number;
        relativeHref: string;
        settings: Object;
    }

    interface IRouterNavigationRoute {
        config: IRouterNavigationRouteConfig;
        isActive: boolean;
        order: number;
        relativeHref: string;
        settings: Object;
    }

    class Router {
        isNavigating: boolean;
        navigation: Array<IRouterNavigationRoute>;
        configure: (callback: (config: IRouterConfig) => void) => void;
        navigate(fragment: string, options: boolean);
        navigateBack();
        refreshNavigation();
        addRoute(config: IRoute);
        reset();
    }

    interface INavigationCommand {
        navigate(appRouter)
    }

    class Redirect implements INavigationCommand {
        constructor(url: string);
        navigate(appRouter)
    }

    class AppRouter {
        baseUrl: string;
        childRecognizer: any;
        container: aureliadependencyinjection.Container;
        currentInstruction: any; // todo: NavigationInstruction
        fallbackOrder: number;
        history: aureliahistory.History;
        isActive: boolean;
        isNavigating: boolean;
        options: any;
        pipelineProvider: any;
        queue: any[];
        recognizer: any;// todo: RouteRecognizer
        routes: any[];
        title: string;
        viewPorts: any;
    }

    interface INavigationInstruction {}
    class NavigationContext {
        plan: {
            default: {
                config: { moduleId: string }
            }
        }
        router: Router;
        nextInstructions():Array<INavigationInstruction>;
    }
}

declare module "aurelia-history" {
    class History {
        active: boolean;
        fragment: string;
        history: History;
        interval: number;
        location: any; // todo: Location
        options: any;
        previousFragment: string;
        root: string;
    }
}

declare module "aurelia-event-aggregator" {
    class EventAggregator {
        publish(event: string, data: any);
        subscribe(event: string, callback: Function);
    }
}

interface IPromise<T> {
    then<U>(callback: (response: T) => U): IPromise<U>;
}

declare module "aurelia-http-client" {
    interface IJsonpContent {
        items: Array<Object>;
    }

    interface IJsonpResponse {
        content: IJsonpContent;
    }

    class HttpClient {
        jsonp: (url: string) => IPromise<IJsonpResponse>;
    }
}

interface AuAppender { }

declare module "aurelia-framework" {
    class Behavior {
        static withProperty(propertyName: string, changeHandler?: string, defaultVale?: string): Behavior;
        static withOptions(attribute): Behavior;
        static attachedBehavior(attribute): Behavior;
        static syncChildren(property, changeHandler, selector): Behavior;
        static customElement(tagName: string): Behavior;
        static useShadowDOM(): Behavior;
        static elementConfig(): Behavior;
        static templateController(attribute): Behavior;
        static useView(path: string): Behavior;
        static noView(): Behavior;
        static skipContentProcessing(): Behavior;

        withProperty(propertyName: string, changeHandler?: string, defaultVale?: string): Behavior;
        withOptions(attribute): Behavior;
        attachedBehavior(attribute): Behavior;
        syncChildren(property, changeHandler, selector): Behavior;
        customElement(tagName: string): Behavior;
        useShadowDOM(): Behavior;
        elementConfig(): Behavior;
        templateController(attribute): Behavior;
        useView(path: string): Behavior;
        noView(): Behavior;
        skipContentProcessing(): Behavior;
    }

    class ResourcePool { }
    class ViewCompiler {
        compile(templateOrFragment: HTMLElement | DocumentFragment, viewResources: ViewResources, options?: Object): ViewFactory;
    }
    class ViewFactory {
        create(container, executionContext, options?): View;
    }
    class ViewResources {
        public viewUrl: string;
    }
    class ViewSlot {
        add(view: View);
        remove(view: View);
    }
    class View {
        bind(context);
        unbind();
    }

    interface Loader { }
    interface AureliaPlugins {
        installBindingLanguage: () => AureliaPlugins;
        installResources: () => AureliaPlugins;
        installRouter: () => AureliaPlugins;
        installEventAggregator: () => AureliaPlugins;
    }
    class Aurelia {
        constructor(loader?: Loader);
        plugins: AureliaPlugins;
        start(): Promise<Aurelia>;
        setRoot(appModuleId: string, appHost: any): any;
        started: boolean;
    }

    module LogManager {
        function getLogger(id: string): Logger;
        enum levels {
            none = 0,
            error = 1,
            warn = 2,
            info = 3,
            debug = 4
        }
        function setLevel(level: levels): void;
        function addAppender(appender: AuAppender): void;
    }

    class Logger {
        debug(message: string): void;
    }

    interface HandlerCallback {
        (container: Container): void;
    }

    class Container {
        get: <T>(key: any) => T;
        registerSingleton: <T>(key: any, fn?: Creator<T>) => void;
        registerTransient: <T>(key: any, fn?: Creator<T>) => void;
        registerInstance: (key: any, instance: any) => void;
        registerHandler: (key: any, callback: HandlerCallback) => void;
        supportAtScript: () => void;
        createChild: () => Container;
    }

    class Transient { }

    class Singleton { }

    class Resolver {
        get: (container: Container) => () => any;
    }

    class Lazy extends Resolver {
        constructor(key: any);
        static of: (key: any) => Lazy;
    }

    class All extends Resolver {
        constructor(key: any);
        static of: (key: any) => All;
    }

    class Optional extends Resolver {
        constructor(key: any);
        static of: (key: any, checkParent?: boolean) => Optional;
    }

    class Parent extends Resolver {
        constructor(key: any);
        get: (container: Container) => () => any;
        static of: (key: any) => Parent;
    }
}

declare module "aurelia-logging" {
    module LogManager {
        function getLogger(id: string): Logger;
        enum levels {
            none = 0,
            error = 1,
            warn = 2,
            info = 3,
            debug = 4
        }
        function setLevel(level: levels): void;
        function addAppender(appender: Appender): void;
    }

    interface Appender { }

    class ConsoleAppender implements Appender { }

    class Logger { }
}

declare module "aurelia-metadata" {
    class Origin {
        constructor(moduleId: string, moduleMember: string);
        static get(fn: Function): Origin;
        static set(fn: Function, origin: Origin): Origin;
    }
}

declare module "aurelia-loader" {
    class Loader {
        static createDefaultLoader(): Loader;
        loadModule(moduleId: string): IPromise<any>;
        loadAllModules(moduleIds: Array<string>): IPromise<any>;
        loadTemplate(url: string): IPromise<any>;
        importTemplate(url: string): IPromise<any>;
    }
}
