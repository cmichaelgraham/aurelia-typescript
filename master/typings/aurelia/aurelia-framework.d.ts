declare module 'aurelia-framework/plugins' {
	/**
	 * Manages loading and configuring plugins.
	 *
	 * @class Plugins
	 * @constructor
	 * @param {Aurelia} aurelia An instance of Aurelia.
	 */
	export class Plugins {
	    aurelia: any;
	    info: any;
	    processed: any;
	    constructor(aurelia: any);
	    /**
	     * Configures a plugin before Aurelia starts.
	     *
	     * @method plugin
	     * @param {moduleId} moduleId The ID of the module to configure.
	     * @param {config} config The configuration for the specified module.
	     * @return {Plugins} Returns the current Plugins instance.
	   */
	    plugin(moduleId: any, config: any): Plugins;
	    _process(): any;
	}

}
declare module 'aurelia-framework/aurelia' {
	/**
	 * The framework core that provides the main Aurelia object.
	 *
	 * @class Aurelia
	 * @constructor
	 * @param {Loader} loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
	 * @param {Container} container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
	 * @param {ResourceRegistry} resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
	 */
	export class Aurelia {
	    loader: any;
	    container: any;
	    resources: any;
	    use: any;
	    hostConfigured: any;
	    started: any;
	    host: any;
	    root: any;
	    constructor(loader?: any, container?: any, resources?: any);
	    /**
   	     * Loads plugins, then resources, and then starts the Aurelia instance.
	     *
   	     * @method start
	     * @return {Promise<Aurelia>} Returns the started Aurelia instance.
	    */
	    start(): Promise<any>;
	    /**
   	     * Enhances the host's existing elements with behaviors and bindings.
   	     *
   	     * @method enhance
   	     * @param {Object} bindingContext A binding context for the enhanced elements.
    	     * @param {string|Object} applicationHost The DOM object that Aurelia will enhance.
   	     * @return {Promise<Aurelia>} Returns the current Aurelia instance.
   	    */
   	    enhance(bindingContext: {}, applicationHost?: any):Promise<any>
	    /**
	     * Instantiates the root view-model and view and add them to the DOM.
	     *
	     * @method setRoot
	     * @param {Object} root The root view-model to load upon bootstrap.
	     * @param {string|Object} applicationHost The DOM object that Aurelia will attach to.
	     * @return {Aurelia} Returns the current Aurelia instance.
	     */
	    setRoot(root?: string, applicationHost?: any): any;
	}

}
declare module 'aurelia-framework/framework-configuration'{
	export class FrameworkConfiguration{
		aurelia: any;
		container: any;
		info: any[];
		processed: boolean;
		preTasks: any[];
		postTasks: any[];
		resourcesToLoad: {};
		constructor(aurelia:any);
		instance(type: any, instance: any): any;
		singleton(type: any, implementation?: any): any;
		transient(type: any, implementation?: any): any;
		preTask(task: any):any;
		postTask(task: any):any;
		feature(plugin: string, config: any): any;
		globalResources(resources: any): any;
		globalName(resourcePath: string, newName: string): any;
		plugin(plugin: string, config: any): any;
		defaultBindingLanguage(): any;
		router(): any;
		history(): any;
		defaultResources(): any;
		eventAggregator(): any;
		standardConfiguration(): any;
		developmentLogging(): any;
		apply(): Promise<void>;
	}
}
declare module 'aurelia-framework/index' {
	/**
	 * The aurelia framework brings together all the required core aurelia libraries into a ready-to-go application-building platform.
	 *
	 * @module framework
	 */
	export { Aurelia } from 'aurelia-framework/framework-configuration';
	export { FrameworkConfiguration } from 'aurelia-framework/aurelia';
	export * from 'aurelia-dependency-injection';
	export * from 'aurelia-binding';
	export * from 'aurelia-metadata';
	export * from 'aurelia-templating';
	export * from 'aurelia-loader';
	export * from 'aurelia-task-queue';
	export * from 'aurelia-path';
	export var LogManager: any;

}
declare module 'aurelia-framework' {
	export * from 'aurelia-framework/index';
}
