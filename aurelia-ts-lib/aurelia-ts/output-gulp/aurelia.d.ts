declare module 'aurelia-metadata' {
    // export * from './metadata/index';

    // metadata class ------------------------------
    /**
    * Stores metadata and provides helpers for searching and adding to it.
    *
    * @class MetadataStorage
    */
    export class MetadataStorage {
        metadata: any;
        owner: any;
        last: any;
        static empty: any;
        constructor(metadata?: any, owner?: any);
        /**
        * Searches metadata and returns the first instance of a particular type.
        *
        * @method first
        * @param {Function} type The metadata type to look for.
        * @param {Boolean} searchPrototype Indicates whether or not to search the inheritance hierarchy for metadata.
        * @return {Object} Returns an instance of the specified metadata type if found; otherwise null.
        */
        first(type: any, searchPrototype: any): any;
        has(type: any, searchPrototype: any): boolean;
        /**
        * Searches metadata for all instances of a particular type.
        *
        * @method all
        * @param {Function} type The metadata type to look for.
        * @param {Boolean} searchPrototype Indicates whether or not to search the inheritance hierarchy for metadata.
        * @return {Array} Returns an array of the specified metadata type.
        */
        all(type: any, searchPrototype: any): any;
        /**
        * Adds metadata.
        *
        * @method add
        * @param {Object} instance The metadata instance to add.
        */
        add(instance: any): MetadataStorage;
        and(func: any): MetadataStorage;
    }
    /**
    * Provides access to metadata.
    *
    * @class Metadata
    * @static
    */
    export var Metadata: {
        on(owner: any): any;
        add(instance: any): MetadataStorage;
        configure: {
            location(staticPropertyName: any): void;
            locator(loc: any): void;
            classHelper(name: any, fn: any): void;
            functionHelper(name: any, fn: any): void;
        };
    };
        // =============================================


    // origin class ------------------------------
    /**
    * A metadata annotation that describes the origin module of the function to which it's attached.
    *
    * @class Origin
    * @constructor
    * @param {string} moduleId The origin module id.
    * @param {string} moduleMember The name of the export in the origin module.
    */
    export class Origin {
        moduleId: any;
        moduleMember: any;
        constructor(moduleId: any, moduleMember?: any);
        /**
        * Get the Origin annotation for the specified function.
        *
        * @method get
        * @static
        * @param {Function} fn The function to inspect for Origin metadata.
        * @return {Origin} Returns the Origin metadata.
        */
        static get(fn: any): {};
        /**
        * Set the Origin annotation for the specified function.
        *
        * @method set
        * @static
        * @param {Function} fn The function to set the Origin metadata on.
        * @param {origin} fn The Origin metadata to store on the function.
        * @return {Origin} Returns the Origin metadata.
        */
        static set(fn: any, origin: any): void;
    }
    // =============================================


    // resource-type class ------------------------------
    /**
    * An abstract base class used to designate resources which can be loaded and registered in a framework.
    *
    * @class ResourceType
    * @constructor
    */
    export class ResourceType {
        /**
        * Implemented by resource metadata to allow it to self-configure and load dependencies.
        *
        * @method load
        * @param {Container} container The dependency injection container to use for service resolution.
        * @param {Object} target The target that is decorated by this ResourceType metadata.
        * @return {Promise} Returns a promise for itself, resolving when all dependent resources are loaded.
        */
        load(container: any, target: any): ResourceType;
        /**
        * Implemented by resources to allow them to register themselved in a resource registry.
        *
        * @method register
        * @param {ResourceRegistry} registry The resource registry that this resource needs to be registered in.
        * @param {String} [name] A possible name override for the resource.
        */
        register(registry: any, name: any): void;
    }
    // =============================================


}

//declare module 'aurelia-path' {
//    export * from './path/index';
//}

//declare module 'aurelia-route-recognizer' {
//    export * from './routeroute-recognizer/index';
//}

//declare module 'aurelia-event-aggregator' {
//    export * from './event-aggregator/index';
//}

//declare module 'aurelia-history' {
//    export * from './history/index';
//}

// declare module 'aurelia-dependency-injection' {
//     export * from './dependency-injection/index';
// }
//
// declare module 'aurelia-router' {
//     export * from 'router/index';
// }
//
// declare module 'aurelia-http-client' {
//     export * from 'http-client/index';
// }
//
// declare module 'aurelia-framework' {
//   export * from 'aurelia-dependency-injection';
//   export * from 'aurelia-metadata';
//   export * from 'aurelia-loader';
//
//   import * as TheLogManager from 'aurelia-logging';
//   export var LogManager: typeof TheLogManager;
//
//   class Behavior {
//     static withProperty(propertyName: string, changeHandler?: string, defaultVale?: string): Behavior;
//     static withOptions(attribute): Behavior;
//     static attachedBehavior(attribute): Behavior;
//     static syncChildren(property, changeHandler, selector): Behavior;
//     static customElement(tagName: string): Behavior;
//     static useShadowDOM(): Behavior;
//     static elementConfig(): Behavior;
//     static templateController(attribute): Behavior;
//     static useView(path: string): Behavior;
//     static noView(): Behavior;
//     static skipContentProcessing(): Behavior;
//
//     withProperty(propertyName: string, changeHandler?: string, defaultVale?: string): Behavior;
//     withOptions(attribute): Behavior;
//     attachedBehavior(attribute): Behavior;
//     syncChildren(property, changeHandler, selector): Behavior;
//     customElement(tagName: string): Behavior;
//     useShadowDOM(): Behavior;
//     elementConfig(): Behavior;
//     templateController(attribute): Behavior;
//     useView(path: string): Behavior;
//     noView(): Behavior;
//     skipContentProcessing(): Behavior;
//   }
//
//   class ResourcePool { }
//   class ViewCompiler {
//       compile(templateOrFragment: HTMLElement | DocumentFragment, viewResources: ViewResources, options?: Object): ViewFactory;
//   }
//   class ViewFactory {
//       create(container, executionContext, options?): View;
//   }
//   class ViewResources {
//       public viewUrl: string;
//   }
//   class ViewSlot {
//       add(view: View);
//       remove(view: View);
//   }
//   class View {
//       bind(context);
//       unbind();
//   }
//
//   interface Loader { }
//   interface AureliaPlugins {
//       installBindingLanguage: () => AureliaPlugins;
//       installResources: () => AureliaPlugins;
//       installRouter: () => AureliaPlugins;
//       installEventAggregator: () => AureliaPlugins;
//   }
//
//   class Aurelia {
//       constructor(loader?: Loader);
//       plugins: AureliaPlugins;
//       start(): Promise<Aurelia>;
//       setRoot(appModuleId: string, appHost: any): any;
//       started: boolean;
//   }
// }
//
// interface Creator<T> {
//     new (...args): T;
// }
//
// declare module "aurelia-logging-console" {
//     class ConsoleAppender implements AuAppender { }
// }
//
// declare module "aurelia-templating" {
//     class ResourcePool { }
//     class ViewCompiler {
//         compile(templateOrFragment: HTMLElement | DocumentFragment, viewResources: ViewResources, options?: Object): ViewFactory;
//     }
//     class ViewFactory {
//         create(container, executionContext, options?): View;
//     }
//     class ViewResources {
//         public viewUrl: string;
//     }
//     class ViewSlot {
//         add(view: View);
//         remove(view: View);
//     }
//     class View {
//         bind(context);
//         unbind();
//     }
// }
//
// interface IPromise<T> {
//     then<U>(callback: (response: T) => U): IPromise<U>;
// }
//
// interface AuAppender { }
//
// declare module "aurelia-logging" {
//     module LogManager {
//         function getLogger(id: string): Logger;
//         enum levels {
//             none = 0,
//             error = 1,
//             warn = 2,
//             info = 3,
//             debug = 4
//         }
//         function setLevel(level: levels): void;
//         function addAppender(appender: Appender): void;
//     }
//
//     interface Appender { }
//
//     class ConsoleAppender implements Appender { }
//
//     class Logger { }
// }
//
// declare module "aurelia-loader" {
//     class Loader {
//         static createDefaultLoader(): Loader;
//         loadModule(moduleId: string): IPromise<any>;
//         loadAllModules(moduleIds: Array<string>): IPromise<any>;
//         loadTemplate(url: string): IPromise<any>;
//         importTemplate(url: string): IPromise<any>;
//     }
// }
