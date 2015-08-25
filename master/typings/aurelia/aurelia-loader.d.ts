declare module 'aurelia-loader/template-registry-entry' {
	export class TemplateDependency {
	    src: any;
	    name: any;
	    constructor(src: string, name?: string);
	}
	export class TemplateRegistryEntry {
	    id: any;
	    template: any;
	    dependencies: any;
	    resources: any;
	    factory: any;
	    constructor(id: any);
	    templateIsLoaded: boolean;
	    isReady: boolean;
	    setTemplate(template: any): void;
	    setResources(resources: any): void;
	    setFactory(factory: any): void;
	}

}
declare module 'aurelia-loader/loader' {
	export class Loader {
	    templateRegistry: any;
	    constructor();
	    loadModule(id: any): Promise<any>;
	    loadAllModules(ids: any): Promise<any[]>;
	    loadTemplate(url: any): Promise<any>;
	    loadText(url: string): Promise<string>;
	    applyPluginToUrl(url: string, pluginName: string): string;
	    addPlugin(pluginName: string, implementation: any): void;
	    getOrCreateTemplateRegistryEntry(id: any): any;
	}

}
declare module 'aurelia-loader/index' {
	export { TemplateRegistryEntry, TemplateDependency } from 'aurelia-loader/template-registry-entry';
	export { Loader } from 'aurelia-loader/loader';

}
declare module 'aurelia-loader' {
	export * from 'aurelia-loader/index';
}
