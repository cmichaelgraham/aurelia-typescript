declare module 'aurelia-loader' {
  import core from 'core-js';
  import { relativeToFile }  from 'aurelia-path';
  export class TemplateDependency {
    constructor(src: any, name: any);
  }
  export class TemplateRegistryEntry {
    constructor(id: any);
    templateIsLoaded(): any;
    isReady(): any;
    setTemplate(template: any): any;
    setResources(resources: any): any;
    setFactory(factory: any): any;
  }
  export class Loader {
    constructor();
    loadModule(id: any): any;
    loadAllModules(ids: any): any;
    loadTemplate(url: any): any;
    loadText(url: any): any;
    getOrCreateTemplateRegistryEntry(id: any): any;
    importDocument(url: any): any;
    importBundle(link: any): any;
    importTemplate(url: any): any;
    findTemplate(doc: any, url: any): any;
    findBundledTemplate(name: any, entry: any): any;
  }
}