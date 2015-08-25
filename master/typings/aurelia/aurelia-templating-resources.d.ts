declare module 'aurelia-templating-resources/compose' {
	export class Compose {
	    element: any;
	    container: any;
	    compositionEngine: any;
	    viewSlot: any;
	    viewResources: any;
	    taskQueue: any;
	    executionContext: any;
	    view: any;
	    viewModel: any;
	    model: any;
	    currentInstruction: any;
	    currentViewModel: any;
	    constructor(element: any, container: any, compositionEngine: any, viewSlot: any, viewResources: any, taskQueue: any);
	    bind(executionContext: any): void;
	    modelChanged(newValue: any, oldValue: any): void;
	    viewChanged(newValue: any, oldValue: any): void;
	    viewModelChanged(newValue: any, oldValue: any): void;
	}

}
declare module 'aurelia-templating-resources/global-behavior' {
	export class GlobalBehavior {
	    element: any;
	    handler: any;
	    aureliaCommand: any;
	    aureliaAttrName: any;
	    static handlers: any;
	    static createSettingsFromBehavior: any;
	    static jQueryPlugins: any;
	    constructor(element: any);
	    bind(): void;
	    attached(): void;
	    detached(): void;
	    unbind(): void;
	}

}
declare module 'aurelia-templating-resources/if' {
	export class If {
	    viewFactory: any;
	    viewSlot: any;
	    showing: any;
	    view: any;
	    taskQueue: any;
	    constructor(viewFactory: any, viewSlot: any, taskQueue: any);
	    valueChanged(newValue: any): void;
	    bind(executionContext: any): void;
	}

}
declare module 'aurelia-templating-resources/with' {
	export class With {
	    viewFactory: any;
	    viewSlot: any;
	    view: any;
	    constructor(viewFactory: any, viewSlot: any);
	    valueChanged(newValue: any): void;
	}

}
declare module 'aurelia-templating-resources/repeat' {
	export class Repeat {
	    viewFactory: any;
	    viewSlot: any;
	    observerLocator: any;
	    local: any;
	    key: any;
	    value: any;
	    items: any;
	    executionContext: any;
	    oldItems: any;
	    disposeSubscription: any;
	    lastBoundItems: any;
	    constructor(viewFactory: any, viewSlot: any, observerLocator: any);
	    bind(executionContext: any): void;
	    unbind(): void;
	    itemsChanged(): void;
	    processItems(): void;
	    processArrayItems(items: any): void;
	    processMapEntries(items: any): void;
	    processNumber(value: any): void;
	    createBaseExecutionContext(data: any): any;
	    createBaseExecutionKvpContext(key: any, value: any): any;
	    createFullExecutionContext(data: any, index: any, length: any): any;
	    createFullExecutionKvpContext(key: any, value: any, index: any, length: any): any;
	    updateExecutionContext(context: any, index: any, length: any): any;
	    handleSplices(array: any, splices: any): void;
	    handleMapChangeRecords(map: any, records: any): void;
	    getViewIndexByKey(key: any): any;
	    removeAll(): void;
	}

}
declare module 'aurelia-templating-resources/show' {
	export class Show {
	    element: any;
	    value: any;
	    constructor(element: any);
	    valueChanged(newValue: any): void;
	    bind(executionContext: any): void;
	}

}
declare module 'aurelia-templating-resources/sanitize-html' {
	export class SanitizeHtmlValueConverter {
	    static defaultSanitizer(untrustedMarkup: any): any;
	    sanitizer: any;
	    constructor();
	    toView(untrustedMarkup: any): any;
	}

}
declare module 'aurelia-templating-resources/replaceable' {
	export class Replaceable {
	    constructor(viewFactory: any, viewSlot: any);
	}

}
declare module 'aurelia-templating-resources/compile-spy' {
	export class CompileSpy{
		constructor(element: any, instruction: any);
	}
	
}
declare module 'aurelia-templating-resources/view-spy' {
	export class ViewSpy{
		logger: any;
		view: any;
		constructor();
		log(lifecycleName: any, context?: any): void
		created(view: any): void;
		bind(bindingContext: any): void;
		attached(): void;
		detached(): void;
		unbind(): void;
	}
	
}
declare module 'aurelia-templating-resources/focus' {
	export class Focus{
		element: any;
		taskQueue: any;
		constructor(element: any, taskQueue: any);
		valueChanged(newValue: any): void;
		giveFocus(): void;
		attached(): void;
		detached(): void;
	}
	
}
declare module 'aurelia-templating-resources/css-resource'{
	export function _createCSSResource(address: string): any;
	
}
declare module 'aurelia-templating-resources/dynamic-element'{
	export function _createDynamicElement(name: string, viewUrl: string, bindableNames: string[]): any;
	
}
declare module 'aurelia-templating-resources/index' {
	export function configure(aurelia: any): void;
	export { Compose } from 'aurelia-templating-resources/compose';
	export { If } from 'aurelia-templating-resources/if';
	export { With } from 'aurelia-templating-resources/with';
	export { Repeat } from 'aurelia-templating-resources/repeat';
	export { Show } from 'aurelia-templating-resources/show';
	export { GlobalBehavior } from 'aurelia-templating-resources/global-behavior';
	export { SanitizeHtmlValueConverter } from 'aurelia-templating-resources/sanitize-html';
	export { Replaceable } from 'aurelia-templating-resources/replaceable';
	export { CompileSpy } from 'aurelia-templating-resources/compile-spy';
	export { ViewSpy } from 'aurelia-templating-resources/view-spy';
	export { Focus } from 'aurelia-templating-resources/focus';
	export { _createCSSResource } from 'aurelia-templating-resources/css-resource';
	export { _createDynamicElement } from 'aurelia-templating-resources/dynamic-element';

}
declare module 'aurelia-templating-resources' {
	export * from 'aurelia-templating-resources/index';
}
