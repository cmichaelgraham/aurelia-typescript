//export * from './metadata/index';
//export * from './dependency-injection/index';
//export * from './path/index';
//export * from './route-recognizer/index';
//export * from './event-aggregator/index';
//export * from './history/index';
//export * from './router/index';
//export * from './http-client/index';

declare module 'aurelia-metadata' {
    export * from 'metadata/index';
}

declare module 'aurelia-dependency-injection' {
    export * from 'dependency-injection/index';
}

declare module 'aurelia-path' {
    export * from 'path/index';
}

declare module 'aurelia-route-recognizer' {
    export * from 'routeroute-recognizer/index';
}

declare module 'aurelia-event-aggregator' {
    export * from 'event-aggregator/index';
}

declare module 'aurelia-history' {
    export * from 'history/index';
}

declare module 'aurelia-router' {
    export * from 'router/index';
}

declare module 'aurelia-http-client' {
    export * from 'http-client/index';
}

declare module 'aurelia-framework' {
  export * from 'aurelia-dependency-injection';
  export * from 'aurelia-metadata';
  export * from 'aurelia-loader';

  import * as TheLogManager from 'aurelia-logging';
  export var LogManager: typeof TheLogManager;

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
}

interface Creator<T> {
    new (...args): T;
}

declare module "aurelia-logging-console" {
    class ConsoleAppender implements AuAppender { }
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

interface IPromise<T> {
    then<U>(callback: (response: T) => U): IPromise<U>;
}

interface AuAppender { }

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

declare module "aurelia-loader" {
    class Loader {
        static createDefaultLoader(): Loader;
        loadModule(moduleId: string): IPromise<any>;
        loadAllModules(moduleIds: Array<string>): IPromise<any>;
        loadTemplate(url: string): IPromise<any>;
        importTemplate(url: string): IPromise<any>;
    }
}
