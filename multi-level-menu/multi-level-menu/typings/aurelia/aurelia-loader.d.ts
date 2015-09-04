declare module 'aurelia-loader' {
  import * as core from 'core-js';
  import { relativeToFile }  from 'aurelia-path';
  import { Origin }  from 'aurelia-metadata';
  
  /*eslint no-unused-vars:0*/
  export interface LoaderPlugin {
    fetch(address: string): Promise<any>;
  }
  export class TemplateDependency {
    constructor(src: string, name?: string);
  }
  export class TemplateRegistryEntry {
    constructor(address: string);
    templateIsLoaded(): boolean;
    isReady(): boolean;
    setTemplate(template: Element): void;
    addDependency(src: string | Function, name?: string): void;
    setResources(resources: any): void;
    setFactory(factory: any): void;
  }
  export class Loader {
    constructor();
    loadModule(id: string): Promise<any>;
    loadAllModules(ids: string[]): Promise<any[]>;
    loadTemplate(url: string): Promise<TemplateRegistryEntry>;
    loadText(url: string): Promise<string>;
    applyPluginToUrl(url: string, pluginName: string): string;
    addPlugin(pluginName: string, implementation: LoaderPlugin): void;
    getOrCreateTemplateRegistryEntry(id: string): TemplateRegistryEntry;
  }
}