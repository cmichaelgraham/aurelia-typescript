declare module 'aurelia-loader-default' {
  import { TemplateRegistryEntry, Loader }  from 'aurelia-loader';
  import { Origin }  from 'aurelia-metadata';
  export interface TemplateLoader {
    loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<any>;
  }
  export class TextTemplateLoader {
    constructor();
    loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<any>;
  }
  export class DefaultLoader extends Loader {
    textPluginName: string;
    constructor();
    useTemplateLoader(templateLoader: TemplateLoader): void;
    loadModule(id: string): Promise<any>;
    loadAllModules(ids: string[]): Promise<any[]>;
    loadTemplate(url: string): Promise<TemplateRegistryEntry>;
    loadText(url: string): Promise<string>;
    applyPluginToUrl(url: string, pluginName: string): string;
    addPlugin(pluginName: any, implementation: any): any;
  }
}