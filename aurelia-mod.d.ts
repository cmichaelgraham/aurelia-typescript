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

declare module "aurelia-router" {
    import aureliadependencyinjection = require("aurelia-dependency-injection");
    import aureliahistory = require("aurelia-history");

    interface IRoute {
        route: string | Array<string>;
        moduleId: string;
        nav?: boolean | number;
        title?: string;
        settings?: any;
    }
	
	interface INavigationInstruction {
		filter: (func: (route: IRouterStep) => boolean) => Array<IRouterStep>;
		fragment: string;
		queryString: string;
		params: any;  // TODO: routeParams
		queryParams: string[];
		config: IRouterConfig;
	}

	interface INavigationContext {
		nextInstruction: INavigationInstruction;
		currentInstruction: INavigationInstruction;
		prevInstruction: INavigationInstruction;

		nextInstructions: INavigationInstruction[];
		currentInstructions: INavigationInstruction[];
		prevInstructions: INavigationInstruction[];
	}

	interface IRouterStep {
		run: (routerContext: INavigationContext, next: any) => boolean | INavigationCommand; 
		cancel?: (message: string) => void;
		config?: any;
	}

    interface IRouterConfig {
        title: string;
		moduleId: string;
        map: (routeArray: Array<IRoute>) => void;
		mapUnknownRoutes: (any) => void;
		addPipelineStep: (name: string, step: any) => void;
		auth?: boolean | string[];
    }

    interface IRouterNavigationRouteConfig extends IRouterConfig {
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
		auth: boolean | string[];
		title: string;
    }

	interface INavigateOptions {
		trigger: boolean;
		replace?: string;
	}

    class Router {
		isNavigating: boolean;
		configure(callback: (config: IRouterConfig | Router) => void);
        navigation: Array<IRouterNavigationRoute>;
		navigate(fragment: string, optionsOrTrigger: INavigateOptions | boolean);
        navigateBack();
        refreshNavigation();
		title: string;
        addRoute(config: IRoute);
        reset();
		routes: IRoute[];
    }

    interface INavigationCommand {
        navigate(appRouter);
    }

    class Redirect implements INavigationCommand {
        constructor(url: string);
        navigate(appRouter);
    }

    class AppRouter {
        baseUrl: string;
        childRecognizer: any;
        container: aureliadependencyinjection.Container;
        currentInstruction: INavigationInstruction;
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

	interface INavigationResult {
		status: string;
		context: INavigationContext;
		output: Error;
		completed: boolean;
	}

	interface INavigationError {
		instruction: INavigationInstruction;
		result: INavigationResult;
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
		// string channels
        publish(event: string, data: any): void;
        subscribe(event: string, callback: Function): void;

		// typed channels
		publish<T>(event: T): void;
		subscribe<T>(eventType: any, callback: (event: T) => void): void;
    }
}

interface IPromise<T> {
    then(callback: (response: T) => void): IPromise<T> | T;
	catch(callback: (error: any) => void): IPromise<T> | T;
}

declare module "aurelia-http-client" {
    interface IJsonpContent {
        items: Array<Object>;
    }

    interface IJsonpResponse {
        content: IJsonpContent;
    }

	interface IHttpResponseMessage<T> {
		headers: HttpHeaders;
		isSuccess: boolean;
		response: T;
		responseType: string;
		statusCode: number;
		statusText: string;
		content: T;
	}

	class HttpHeaders {
		add: (key: string, value: string) => void;
		get: (key: string) => string;
		clear: () => void;
	}

    class HttpClient {
		defaultRequestHeaders: HttpHeaders;
		constructor(baseUrl?: string, defaultRequestHeaders?: HttpHeaders)
        jsonp(url: string): IPromise<IJsonpResponse>;
		get(uri: string): IPromise<any>;
		put(uri: string, content: any, replacer: any): IPromise<any>;
		patch(uri: string, content: any, replacer?: any): IPromise<any>;
		post(uri: string, content: any, replacer?: any): IPromise<any>;
		delete(uri: string): IPromise<any>;
    }
}

interface AuAppender { }

declare module "aurelia-framework" {
	interface LogAppender extends AuAppender {
		debug(logger: Logger, message: string, ...rest);
		info(logger: Logger, message: string, ...rest);
		warn(logger: Logger, message: string, ...rest);
		error(logger: Logger, message: string, ...rest);
	}

	class AttributeConfig {
		withProperty(property: string): void;
	}

	class Behavior {
        static withProperty(propertyName: string, changeHandler?: string, defaultVale?: string): Behavior;
        static withOptions(attribute?: string): Behavior;
        static attachedBehavior(attribute: string): Behavior;
        static syncChildren(property: string, changeHandler: string, selector: string): Behavior;
        static customElement(tagName: string): Behavior;
        static useShadowDOM(): Behavior;
        static elementConfig(): Behavior;
        static templateController(attribute: string): Behavior;
        static useView(path: string): Behavior;
        static noView(): Behavior;
        static transient(): Behavior;

        withProperty(propertyName: string, changeHandler?: string, defaultVale?: string): Behavior;
        withOptions(attribute?: string): Behavior;
        attachedBehavior(attribute: string): Behavior;
        syncChildren(property: string, changeHandler: string, selector: string): Behavior;
        customElement(tagName: string): Behavior;
        useShadowDOM(): Behavior;
        elementConfig(): Behavior;
        templateController(attribute: string): Behavior;
        useView(path: string): Behavior;
        noView(): Behavior;
        transient(): Behavior;
		and(configurer: (config: AttributeConfig) => void): Behavior;
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
		container: Container;

		use: Aurelia;
		defaultBindingLanguage: () => Aurelia;
		defaultResources: () => Aurelia;
		router: () => Aurelia;
		eventAggregator: () => Aurelia;
		plugin:(path: string) => Aurelia;
		withResources(...args): void;
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
		id: string;
        debug(message: string): void;
        info(message: string): void;
        warn(message: string): void;
        error(message: string): void;
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
        static of(key: any): Lazy;
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