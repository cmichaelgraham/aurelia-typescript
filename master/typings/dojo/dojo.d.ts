declare var define: {
    (deps: string[], callback?: Function): void;
    (value: any): void;
};
declare var require: {
    (config: any, deps?: string[], callback?: Function): void;
    (deps: string[], callback?: Function): void;
    <T>(moduleId: string): T;
};

declare module dojo {
    export interface IDeclared {
        declaredClass: string;
        inherited<T>(args: IArguments, params?: any[]): T;
        inherited(args: IArguments, params?: any[]): void;
        isInstanceOf(constructor: any): boolean;
    }
    export interface IEvented {
        emit(type: string, ...args: any[]): boolean;
        on(type: string, listener: Function): IHandle;
        on(type: IExtensionEvent, listener: Function): IHandle;
    }
    export interface IExtensionEvent {
        (target: any, listener: Function): IHandle;
    }
    export interface IHandle {
        remove(): void;
    }
    export interface IMap {
        [option: string]: any;
    }
    export interface IPromise<T> {
        then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => U): IPromise<U>;
        then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => IPromise<U>): IPromise<U>;
        then<U>(onFulfilled?: (value: T) => IPromise<U>, onRejected?: (reason: any) => U): IPromise<U>;
        then<U>(onFulfilled?: (value: T) => IPromise<U>, onRejected?: (reason: any) => IPromise<U>): IPromise<U>;
    }
    export interface IRouterEvent extends IMap {
        oldPath: string;
        newPath: string;

        preventDefault(): void;
        stopImmediatePropagation(): void;
    }
    export interface IRouterPropertyEvent extends IRouterEvent {
        params: dojo.IMap;
    }
    export interface IRouterArrayEvent extends IRouterEvent {
        params: string[];
    }
    export interface IStateful {
        get(name: string): any;
        set(name: string, value: any, raiseChangeEvent?: boolean): void;
        set(name: IMap): void;
        watch(name: string, callback: (property: string, oldValue: any, newValue: any) => void): IHandle;
    }
}

declare module 'dojo/_base/fx' {
    export interface _Line {
        getValue(value: number): number;
    }
    export var _Line: {
        new (start: number, end: number): _Line;
    };
    export interface Animation extends dojo.IEvented {
        duration: number;
        curve: any;
        easing?: Function;
        repeat: number;
        rate: number;
        delay: number;

        beforeBegin: (node: HTMLElement) => void;
        onBegin: (value: any) => void;
        onAnimate: (value: any) => void;
        onEnd: (node: HTMLElement) => void;
        onPlay: (value: any) => void;
        onPause: (value: any) => void;
        onStop: (value: any) => void;

        play(delay?: number, gotoStart?: boolean): Animation;
        pause(): Animation;
        gotoPercent(percent: number, andPlay?: boolean): Animation;
        stop(gotoEnd?: boolean): Animation;
        status(): string;
    }
    export var Animation: {
        new (args: dojo.IMap): Animation;
    };
    export function fadeIn(args: dojo.IMap): Animation;
    export function fadeOut(args: dojo.IMap): Animation;
    export function animateProperty(args: dojo.IMap): Animation;
    export function anim(node: HTMLElement, properties: dojo.IMap, duration?: number,
        easing?: Function, onEnd?: Function, delay?: number): Animation;
}

declare module 'dojo/_base/lang' {
    var lang: {
        clone<T>(object: T): T;
        delegate<T extends Object>(object: T, properties?: any): T;
        extend<T extends Function>(ctor: T, ...props: any[]): T;
        getObject(property: string, create?: boolean, context?: any): any;
        hitch<T extends Function>(context: any, method: T): T;
        hitch<T extends Function>(context: any, method: Function, ...args: any[]): T;
        hitch<T extends Function>(context: any, method: string, ...args: any[]): T;
        mixin<T extends Object>(dest: T, ...mixins: any[]): T;
        mixin<T extends Object>(dest: any, ...mixins: any[]): T;
        partial<T extends Function>(func: Function, ...args: any[]): T;
        replace(template: string, map: Object, pattern?: string): string;
        replace(template: string, map: string[], pattern?: string): string;
        replace(template: string, map: (matched: string, key: string, offset: number, template: string) => string, pattern?: string): string;
        setObject(property: string, value: any, context?: any): any;
        trim(string: string): string;
    };
    export = lang;
}

declare module 'dojo/_base/array' {
    var array: {
        indexOf<T>(array: T[], item: T, fromIndex?: number): number;
        every<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean, context?: any): boolean;
        forEach<T>(array: T[], callback: (item: T, index: number, array: T[]) => void, context?: any): void;
        filter<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean, context?: any): T[];
        lastIndexOf<T>(array: T[], item: T, fromIndex?: number): number;
        map<T, U>(array: T[], callback: (item: T, index: number, array: T[]) => U, context?: any): U[];
        some<T>(array: T[], callback: (item: T, index: number, array: T[]) => boolean, context?: any): boolean;
    };
    export = array;
}

declare module 'dojo/_base/declare' {
    var decl: {
        <T extends dojo.IDeclared>(superclass: dojo.IDeclared, props?: dojo.IMap): new (...args: any[]) => T;
        <T extends dojo.IDeclared>(superclasses: dojo.IDeclared[], props?: dojo.IMap): new (...args: any[]) => T;

        safeMixin<T>(destination: T, ...sources: dojo.IMap[]): T;
    };
    export = decl;
}

declare module 'dojo/aspect' {
    var aspect: {
        after(target: any, methodName: string, advice: Function, receiveArguments?: boolean): dojo.IHandle;
        around(target: any, methodName: string, adviceFactory: (original: Function) => Function): dojo.IHandle;
        before(target: any, methodName: string, advice: Function): dojo.IHandle;
    };
    export = aspect;
}

declare module 'dojo/cookie' {
    var cookie: {
        (name: string): string;
        (name: string, value: string, props?: { expires?: any; path?: string; domain?: string; secure?: boolean; }): void;
        isSupported(): boolean;
    }
    export = cookie;
}

declare module 'dojo/date' {
    var date: {
        add(date: Date, interval: string, amount: number): Date;
        compare(date1: Date, date2?: Date, portion?: string): number;
        difference(date1: Date, date2?: Date, interval?: string): number;
        getDaysInMonth(date: Date): number;
        getTimezoneName(date: Date): string;
        isLeapYear(date: Date): boolean;
    };
    export = date;
}

declare module 'dojo/date/locale' {
    export interface IFormatOptions {
        am?: string;
        datePattern?: string;
        formatLength?: string;
        fullYear?: boolean;
        locale?: string;
        pm?: string;
        selector?: string;
        strict?: boolean;
        timePattern?: string;
    }
    export function addCustomFormats(packageName: string, bundleName: string): void;
    export function format(dateObject: Date, options?: IFormatOptions): string;
    export function getNames(item: string, type: string, context?: string, locale?: string): string[];
    export function isWeekend(dateObject?: Date, locale?: string): boolean;
    export function parse(value: string, options?: IFormatOptions): Date;
    export function regexp(options?: IFormatOptions): RegExp;
}

declare module 'dojo/date/stamp' {
    var stamp: {
        fromISOString(string: string, defaultTime?: number): Date;
        toISOString(date: Date, options: { selector?: string; zulu?: boolean; milliseconds?: number; }): string;
    };
    export = stamp;
}

declare module 'dojo/Deferred' {
    import Promise = require('dojo/promise/Promise');

    interface Deferred<T> extends dojo.IPromise<T> {
        promise: Promise<T>;

        cancel(reason: any, strict?: boolean): any;
        isCanceled(): boolean;
        isFulfilled(): boolean;
        isRejected(): boolean;
        isResolved(): boolean;
        progress(update: any, strict?: boolean): void;
        reject(reason: any, strict?: boolean): void;
        resolve(value: T, strict?: boolean): void;
        then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => U): Promise<U>;
        then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => dojo.IPromise<U>): Promise<U>;
        then<U>(onFulfilled?: (value: T) => dojo.IPromise<U>, onRejected?: (reason: any) => U): Promise<U>;
        then<U>(onFulfilled?: (value: T) => dojo.IPromise<U>, onRejected?: (reason: any) => dojo.IPromise<U>): Promise<U>;
    }
    var Deferred: {
        new <T>(canceler?: (reason: any) => void): Deferred<T>;
    };
    export = Deferred;
}

declare module 'dojo/dom' {
    var dom: {
        byId(id: string): HTMLElement;
        byId(node: HTMLElement): HTMLElement;

        isDescendant(id: string, ancestor: string): boolean;
        isDescendant(id: HTMLElement, ancestor: string): boolean;
        isDescendant(id: string, ancestor: HTMLElement): boolean;
        isDescendant(id: HTMLElement, ancestor: HTMLElement): boolean;

        setSelectable(id: string, selectable?: boolean): boolean;
        setSelectable(id: HTMLElement, selectable?: boolean): boolean;
    };
    export = dom;
}

declare module 'dojo/dom-class' {
    var domClass: {
        add(node: string, classNames: string): void;
        add(node: string, classNames: string[]): void;
        add(node: HTMLElement, classNames: string): void;
        add(node: HTMLElement, classNames: string[]): void;

        contains(node: string, className: string): boolean;
        contains(node: HTMLElement, className: string): boolean;

        remove(node: string): void;
        remove(node: string, classNames: string): void;
        remove(node: string, classNames: string[]): void;
        remove(node: HTMLElement): void;
        remove(node: HTMLElement, classNames: string): void;
        remove(node: HTMLElement, classNames: string[]): void;

        replace(node: string, addClassNames: string, removeClassNames: string): void;
        replace(node: string, addClassNames: string[], removeClassNames: string): void;
        replace(node: HTMLElement, addClassNames: string, removeClassNames: string): void;
        replace(node: HTMLElement, addClassNames: string[], removeClassNames: string): void;
        replace(node: string, addClassNames: string, removeClassNames: string[]): void;
        replace(node: string, addClassNames: string[], removeClassNames: string[]): void;
        replace(node: HTMLElement, addClassNames: string, removeClassNames: string[]): void;
        replace(node: HTMLElement, addClassNames: string[], removeClassNames: string[]): void;

        toggle(node: string, className: string, condition?: boolean): void;
        toggle(node: HTMLElement, className: string, condition?: boolean): void;
    };
    export = domClass;
}

declare module 'dojo/dom-construct' {
    export interface IAttributes {
        [attribute: string]: any;
    }
    export function create(id: string, attrs?: IAttributes, refNodeId?: string, pos?: string): HTMLElement;
    export function create(tag: HTMLElement, attrs?: IAttributes, refNodeId?: string, pos?: string): HTMLElement;
    export function create(id: string, attrs?: IAttributes, refNode?: HTMLElement, pos?: string): HTMLElement;
    export function create(tag: HTMLElement, attrs?: IAttributes, refNode?: HTMLElement, pos?: string): HTMLElement;
    export function create(id: string, attrs?: IAttributes, refNode?: DocumentFragment, pos?: string): HTMLElement;
    export function create(tag: HTMLElement, attrs?: IAttributes, refNode?: DocumentFragment, pos?: string): HTMLElement;
    export function create(id: string, attrs?: IAttributes, refNodeId?: string, pos?: number): HTMLElement;
    export function create(tag: HTMLElement, attrs?: IAttributes, refNodeId?: string, pos?: number): HTMLElement;
    export function create(id: string, attrs?: IAttributes, refNode?: HTMLElement, pos?: number): HTMLElement;
    export function create(tag: HTMLElement, attrs?: IAttributes, refNode?: HTMLElement, pos?: number): HTMLElement;
    export function create(id: string, attrs?: IAttributes, refNode?: DocumentFragment, pos?: number): HTMLElement;
    export function create(tag: HTMLElement, attrs?: IAttributes, refNode?: DocumentFragment, pos?: number): HTMLElement;

    export function destroy(id: string): void;
    export function destroy(node: HTMLElement): void;

    export function empty(id: string): void;
    export function empty(node: HTMLElement): void;

    export function place(id: string, refNodeId: string, pos?: string): HTMLElement;
    export function place(node: HTMLElement, refNodeId: string, pos?: string): HTMLElement;
    export function place(id: string, refNode: HTMLElement, pos?: string): HTMLElement;
    export function place(node: HTMLElement, refNode: HTMLElement, pos?: string): HTMLElement;
    export function place(id: string, refNode: DocumentFragment, pos?: string): HTMLElement;
    export function place(node: HTMLElement, refNode: DocumentFragment, pos?: string): HTMLElement;
    export function place(id: string, refNodeId: string, pos?: number): HTMLElement;
    export function place(node: HTMLElement, refNodeId: string, pos?: number): HTMLElement;
    export function place(id: string, refNode: HTMLElement, pos?: number): HTMLElement;
    export function place(node: HTMLElement, refNode: HTMLElement, pos?: number): HTMLElement;
    export function place(id: string, refNode: DocumentFragment, pos?: number): HTMLElement;
    export function place(node: HTMLElement, refNode: DocumentFragment, pos?: number): HTMLElement;

    export function toDom(frag: string, doc?: HTMLDocument): HTMLElement;
}

declare module 'dojo/dom-form' {
    var domForm: {
        fieldToObject(inputNode: HTMLFormElement): any;
        fieldToObject(inputNode: string): any;

        toJson(formNode: HTMLFormElement, prettyPrint?: boolean): string;
        toJson(formNode: string, prettyPrint?: boolean): string;

        toObject(formNode: HTMLFormElement): Object;
        toObject(formNode: string): Object;

        toQuery(formNode: HTMLFormElement): string;
        toQuery(formNode: string): string;
    };
    export = domForm;
}

declare module 'dojo/dom-geometry' {
    export interface IPoint {
        x: number;
        y: number;
    }
    export interface ISize {
        w: number;
        h: number;
    }
    export interface IOffset {
        l: number;
        t: number;
    }
    export interface IPosition extends ISize, IOffset { }
    export interface IBox extends IPosition {
        r: number;
        b: number;
    }
    export var boxModel: string;

    export function docScroll(doc?: HTMLDocument): { node: HTMLElement; x: number; y: number; };
    export function fixIeBiDiScrollLeft(scrollLeft: number, doc?: HTMLDocument): number;
    export function getBorderExtents(node: HTMLElement, computedStyle?: dojo.IMap): IBox;
    export function getContentBox(node: HTMLElement, computedStyle?: dojo.IMap): IPosition;
    export function getIeDocumentElementOffset(doc?: HTMLDocument): IPoint;
    export function getMarginBox(node: HTMLElement, computedStyle?: dojo.IMap): IPosition;
    export function getMarginExtents(node: HTMLElement, computedStyle?: dojo.IMap): IPosition;
    export function getMarginSize(node: HTMLElement, computedStyle?: dojo.IMap): ISize;
    export function getPadBorderExtents(node: HTMLElement, computedStyle?: dojo.IMap): IBox;
    export function getPadExtents(node: HTMLElement, computedStyle?: dojo.IMap): IBox;
    export function isBodyLtr(doc?: HTMLDocument): boolean;
    export function normalizeEvent(event: { pageX?: number; pageY?: number; offsetX?: number; offsetY?: number; layerX?: number; layerY?: number; }): void;
    export function position(node: HTMLElement, includeScroll?: boolean): IPosition;
    export function position(node: string, includeScroll?: boolean): IPosition;
    export function setContentSize(node: HTMLElement, box: ISize, computedStyle?: dojo.IMap): void;
    export function setMarginBox(node: HTMLElement, box: ISize, computedStyle?: dojo.IMap): void;
}

declare module 'dojo/dom-style' {
    export interface IStylesMap extends dojo.IMap {
        [style: string]: any;
    }
    export function getComputedStyle(node: HTMLElement): IStylesMap;

    export function get(id: string, style?: string): IStylesMap;
    export function get(node: HTMLElement, style?: string): IStylesMap;

    export function set(id: string, style: string, value: string): void;
    export function set(node: HTMLElement, style: string, value: string): void;
    export function set(id: string, values: IStylesMap): void;
    export function set(node: HTMLElement, values: IStylesMap): void;
}

declare module 'dojo/Evented' {
    interface Evented extends dojo.IDeclared, dojo.IEvented {
        emit(type: string, ...args: any[]): boolean;
        on(type: string, listener: Function): dojo.IHandle;
        on(type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
    }
    var Evented: {
        new (...args: any[]): Evented;
    };
    export = Evented;
}

declare module 'dojo/fx' {
    import baseFx = require('dojo/_base/fx');

    var fx: {
        chain(animations: baseFx.Animation[]): baseFx.Animation;
        combine(animations: baseFx.Animation[]): baseFx.Animation;
        slideTo(args: dojo.IMap): baseFx.Animation;
        wipeIn(args: dojo.IMap): baseFx.Animation;
        wipeOut(args: dojo.IMap): baseFx.Animation;
    };
    export = fx;
}

declare module 'dojo/has' {
    var has: {
        (feature: string): boolean;

        add(feature: string, test: (global: any, document?: Document, element?: HTMLElement) => boolean, now?: boolean, force?: boolean): void;
        load(id: string, parentRequire: typeof require, loaded: Function, config?: any): void;
        normalize(id: string, normalize: (mid: string) => string): string;
    };
    export = has;
}

declare module 'dojo/hash' {
    var hash: {
        (hash?: string, replace?: boolean): string;
    };
    export = hash;
}

declare module 'dojo/i18n' {
    var i18n: {
        dynamic: boolean;
        load(id: string, parentRequire: typeof require, loaded: (bundle: dojo.IMap) => void, config?: any): void;
        normalize(id: string, normalize: (mid: string) => string): string;
    };
    export = i18n;
}

declare module 'dojo/io-query' {
    var ioQuery: {
        objectToQuery(map: dojo.IMap): string;
        queryToObject(query: string): dojo.IMap;
    };
    export = ioQuery;
}

declare module 'dojo/node' {
    var node: {
        load(id: string, parentRequire: typeof require, loaded: (bundle: dojo.IMap) => void, config?: any): void;
        normalize(id: string, normalize: (mid: string) => string): string;
    };
    export = node;
}

declare module 'dojo/NodeList' {
    interface DojoNodeList<T> {
        length: number;
        [index: number]: T;

        at(...indexes: number[]): DojoNodeList<T>;
        concat(...items: T[]): DojoNodeList<T>;
        end(): T;
        every(callback: (value: T, index: number, array: T[]) => boolean, context?: any): boolean;
        filter(callback: (value: T, index: number, array: T[]) => boolean, context?: any): T[];
        forEach(callback: (value: T, index: number, array: T[]) => void, context?: any): void;
        indexOf(searchElement: T, fromIndex?: number): number;
        lastIndexOf(searchElement: T, fromIndex?: number): number;
        map<U>(callback: (value: T, index: number, array: T[]) => U, context?: any): DojoNodeList<U>;
        on(type: string, listener: Function): dojo.IHandle[];
        slice(start?: number, end?: number): DojoNodeList<T>;
        some(callback: (value: T, index: number, array: T[]) => boolean, context?: any): boolean;
        splice(start: number, deleteCount?: number, ...items: T[]): DojoNodeList<T>
    }
    var DojoNodeList: {
        new <T>(length: number): DojoNodeList<T>;
        new <T>(array: T[]): DojoNodeList<T>;
        new <T>(): DojoNodeList<T>;
    };
    export = DojoNodeList;
}

declare module 'dojo/on' {
    var on: {
        (target: HTMLElement, type: string, listener: Function): dojo.IHandle;
        (target: HTMLElement, type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
        (target: dojo.IEvented, type: string, listener: Function): dojo.IHandle;
        (target: dojo.IEvented, type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
        emit(target: HTMLElement, type: string, event: any, ...args: any[]): boolean;
        emit(target: dojo.IEvented, type: string, event: any, ...args: any[]): boolean;
        once(target: HTMLElement, type: string, listener: Function): dojo.IHandle;
        once(target: HTMLElement, type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
        once(target: dojo.IEvented, type: string, listener: Function): dojo.IHandle;
        once(target: dojo.IEvented, type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
        parse(target: HTMLElement, type: string, listener: Function, addListener: Function): dojo.IHandle;
        parse(target: HTMLElement, type: dojo.IExtensionEvent, listener: Function, addListener: Function): dojo.IHandle;
        parse(target: dojo.IEvented, type: string, listener: Function, addListener: Function): dojo.IHandle;
        parse(target: dojo.IEvented, type: dojo.IExtensionEvent, listener: Function, addListener: Function): dojo.IHandle;
        pausable(target: HTMLElement, type: string, listener: Function): dojo.IHandle;
        pausable(target: HTMLElement, type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
        pausable(target: dojo.IEvented, type: string, listener: Function): dojo.IHandle;
        pausable(target: dojo.IEvented, type: dojo.IExtensionEvent, listener: Function): dojo.IHandle;
        selector(selector: string, eventType: string, children?: boolean): dojo.IExtensionEvent;
        selector(selector: string, eventType: dojo.IExtensionEvent, children?: boolean): dojo.IExtensionEvent;
    };
    export = on;
}

declare module 'dojo/parser' {
    var parser: {
        parse(rootNode?: HTMLElement): any[];
    };
    export = parser;
}

declare module 'dojo/promise/all' {
    import Promise = require('dojo/promise/Promise');

    var all: {
        <T>(values: T[]): Promise<T[]>;
        (values: any[]): Promise<any[]>;
        <T>(values: { [key: string]: T }): Promise<{ [key: string]: T }>;
        (values: { [key: string]: any }): Promise<{ [key: string]: any }>;
    };
    export = all;
}

declare module 'dojo/promise/Promise' {
    interface Promise<T> extends dojo.IPromise<T> {
        always<U>(callback?: (value: any) => U): Promise<U>;
        always<U>(callback?: (value: any) => dojo.IPromise<U>): Promise<U>;
        cancel(reason: any, strict?: boolean): void;

        isCanceled(): boolean;
        isFulfilled(): boolean;
        isRejected(): boolean;
        isResolved(): boolean;

        otherwise<U>(errback: (reason: any) => U): Promise<U>;
        otherwise<U>(errback: (reason: any) => dojo.IPromise<U>): Promise<U>;

        then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => U): Promise<U>;
        then<U>(onFulfilled?: (value: T) => U, onRejected?: (reason: any) => dojo.IPromise<U>): Promise<U>;
        then<U>(onFulfilled?: (value: T) => dojo.IPromise<U>, onRejected?: (reason: any) => U): Promise<U>;
        then<U>(onFulfilled?: (value: T) => dojo.IPromise<U>, onRejected?: (reason: any) => dojo.IPromise<U>): Promise<U>;

        trace(): Promise<T>;
        traceRejected(): Promise<T>;
    }
    var Promise: {
        new <T>(): Promise<T>;
    };

    export = Promise;
}

declare module 'dojo/query' {
    import DojoNodeList = require('dojo/NodeList');

    var query: {
        (query: string, root?: Node): DojoNodeList<HTMLElement>;
        matches(node: Node, selector: string, root?: Node): boolean;
        filter(nodes: HTMLElement[], selector: string, root?: Node): DojoNodeList<HTMLElement>;
    };
    export = query;
}

declare module 'dojo/request' {
    import Promise = require('dojo/promise/Promise');

    var request: {
        <T>(url: string, options?: dojo.IMap): Promise<T>;
        get<T>(url: string, options?: dojo.IMap): Promise<T>;
        post<T>(url: string, options?: dojo.IMap): Promise<T>;
        put<T>(url: string, options?: dojo.IMap): Promise<T>;
        del<T>(url: string, options?: dojo.IMap): Promise<T>;
    };
    export = request;
}

declare module 'dojo/request/handlers' {
    var handlers: {
        (response: dojo.IMap): dojo.IMap;
        register(name: string, handler: (response: dojo.IMap) => any): void;
    };
    export = handlers;
}

declare module 'dojo/request/iframe' {
    import Promise = require('dojo/promise/Promise');

    var iframe: {
        <T>(url: string, options?: dojo.IMap): Promise<T>;
        get<T>(url: string, options?: dojo.IMap): Promise<T>;
        post<T>(url: string, options?: dojo.IMap): Promise<T>;
    };
    export = iframe;
}

declare module 'dojo/request/notify' {
    var notify: {
        (type: 'start', listener: () => void): dojo.IHandle
		(type: 'send', listener: (response: dojo.IMap, cancel?: (reason: any) => void) => void): dojo.IHandle;
        (type: 'load', listener: (response: dojo.IMap) => void): dojo.IHandle
		(type: 'error', listener: (response: dojo.IMap) => void): dojo.IHandle
		(type: 'done', listener: (response: dojo.IMap) => void): dojo.IHandle
		(type: 'stop', listener: () => void): dojo.IHandle
		(type: string, listener: (response?: dojo.IMap, cancel?: (reason: any) => void) => void): dojo.IHandle;
    };
    export = notify;
}

declare module 'dojo/request/registry' {
    import Promise = require('dojo/promise/Promise');

    var registry: {
        <T>(url: string, options?: dojo.IMap): Promise<T>;
        get<T>(url: string, options?: dojo.IMap): Promise<T>;
        post<T>(url: string, options?: dojo.IMap): Promise<T>;
        put<T>(url: string, options?: dojo.IMap): Promise<T>;
        del<T>(url: string, options?: dojo.IMap): Promise<T>;
        register(url: string, provider: (url: any, options?: dojo.IMap) => Promise<any>, first?: boolean): dojo.IHandle;
        register(url: RegExp, provider: (url: any, options?: dojo.IMap) => Promise<any>, first?: boolean): dojo.IHandle;
        register(url: (url: string, options: dojo.IMap) => boolean, provider: (url: any, options?: dojo.IMap) => Promise<any>, first?: boolean): dojo.IHandle;
        register(url: any, provider: (url: any, options?: dojo.IMap) => Promise<any>, first?: boolean): dojo.IHandle;
    };
    export = registry;
}

declare module 'dojo/request/script' {
    import Promise = require('dojo/promise/Promise');

    var script: {
        <T>(url: string, options?: dojo.IMap): Promise<T>;
        get<T>(url: string, options?: dojo.IMap): Promise<T>;
    };
    export = script;
}

declare module 'dojo/request/util' {
    import Deferred = require('dojo/Deferred');

    var util: {
        deepCopy<T>(target: any, source: any): T;
        deepCreate<T>(source: any, properties: dojo.IMap): T;
        deferred<T>(response: dojo.IMap, cancel: Function, isValid: Function,
            isReady: Function, handleResponse: Function, last?: Function): Deferred<T>;
        addCommonMethod(provider: any, methods?: string[]): void;
        parseArgs(url: string, options: dojo.IMap, skipData?: boolean): { url: string; options: dojo.IMap; getHeader: (headerName: string) => any; };
        checkStatus(status: number): boolean;
    };
    export = util;
}

declare module 'dojo/request/xhr' {
    import Promise = require('dojo/promise/Promise');

    var xhr: {
        <T>(url: string, options?: dojo.IMap): Promise<T>;
        get<T>(url: string, options?: dojo.IMap): Promise<T>;
        post<T>(url: string, options?: dojo.IMap): Promise<T>;
        put<T>(url: string, options?: dojo.IMap): Promise<T>;
        del<T>(url: string, options?: dojo.IMap): Promise<T>;
    };
    export = xhr;
}

declare module 'dojo/router' {
    import RouterBase = require('dojo/router/RouterBase');
    var router: typeof RouterBase;
    export = router;
}

declare module 'dojo/router/RouterBase' {
    interface RouterBase extends dojo.IDeclared {
        globMatch: RegExp;
        globReplacement: string;
        idMatch: RegExp;
        idReplacement: string;

        _convertRouteToRegExp(route: string): RegExp;
        destroy(): void;
        _getParameterNames(route: string): string[];
        go(path: string, replace?: boolean): boolean;
        _handlePathChange(newPath: string): boolean;
        _indexRoutes(): void;
        register(route: string, callback: (event: dojo.IRouterPropertyEvent) => void): dojo.IHandle;
        register(route: RegExp, callback: (event: dojo.IRouterArrayEvent) => void): dojo.IHandle;
        register(route: any, callback: Function): dojo.IHandle;
        registerBefore(route: string, callback: (event: dojo.IRouterPropertyEvent) => void): dojo.IHandle;
        registerBefore(route: RegExp, callback: (event: dojo.IRouterArrayEvent) => void): dojo.IHandle;
        registerBefore(route: any, callback: Function): dojo.IHandle;
        startup(defaultPath?: string): void;
    }
    var RouterBase: {
        new (kwArgs: dojo.IMap): RouterBase;
    };
    export = RouterBase;
}

declare module 'dojo/sniff' {
    import has = require('dojo/has');
    export = has;
}

declare module 'dojo/Stateful' {
    interface Stateful extends dojo.IDeclared {
        get(name: string): any;
        set(name: string, value: any, raiseChangeEvent?: boolean): void;
        set(name: dojo.IMap): void;
        watch<T>(name: string, callback: (key: string, oldValue: T, newValue: T) => void): dojo.IHandle;
        watch(callback: (key: string, oldValue: any, newValue: any) => void): dojo.IHandle;
    }
    var Stateful: {
        new (kwArgs: dojo.IMap): Stateful;
    };
    export = Stateful;
}

declare module 'dojo/store/api/Store' {
    import QueryResults = require('dojo/store/util/QueryResults');

    interface Store<T> {
        get? (id: any): any;
        getIdentity? (object: T): any;
        put? (object: T, options?: dojo.IMap): any;
        add? (object: T, options?: dojo.IMap): any;
        remove? (id: any): any;
        query? (query?: any, options?: dojo.IMap): QueryResults<T>;
    }
    export = Store;
}

declare module 'dojo/store/JsonRest' {
    import Deferred = require('dojo/Deferred');
    import QueryResults = require('dojo/store/util/QueryResults');

    interface JsonRest<T> extends dojo.IDeclared {
        accepts: string;
        ascendingPrefix: string;
        descendingPrefix: string;
        headers: dojo.IMap;
        idProperty: string;
        rangeParam: string;
        sortParam: string;
        target: string;

        get(id: any): Deferred<T>;
        getIdentity(object: T): any;
        put(object: T, options?: dojo.IMap): Deferred<any>;
        add(object: T, options?: dojo.IMap): Deferred<any>;
        remove(id: any): Deferred<boolean>;
        query(query?: dojo.IMap, options?: dojo.IMap): QueryResults<T>;
        query(query?: string, options?: dojo.IMap): QueryResults<T>;
    }
    var JsonRest: {
        new <T>(options?: dojo.IMap): JsonRest<T>;
    };
    export = JsonRest;
}

declare module 'dojo/store/Memory' {
    import QueryResults = require('dojo/store/util/QueryResults');
    import SimpleQueryEngine = require('dojo/store/util/SimpleQueryEngine');

    interface Memory<T> extends dojo.IDeclared {
        idProperty: string;
        queryEngine: SimpleQueryEngine<T>;

        get(id: any): T;
        getIdentity(object: T): any;
        put(object: T, options?: dojo.IMap): any;
        add(object: T, options?: dojo.IMap): any;
        remove(id: any): boolean;
        query(query?: dojo.IMap, options?: dojo.IMap): QueryResults<T>;
        query(query?: string, options?: dojo.IMap): QueryResults<T>;
        query(query?: (item: T) => boolean, options?: dojo.IMap): QueryResults<T>;
        setData(data: T[]): void;
    }
    var Memory: {
        new <T>(options?: dojo.IMap): Memory<T>;
    };
    export = Memory;
}

declare module 'dojo/store/Observable' {
    import Store = require('dojo/store/api/Store');

    interface Observable<T> extends Store<T> {
        notify(object?: T, existingId?: any): void;
    }
    var Observable: {
        new <T>(store: Store<T>): Observable<T>;
    };

    export = Observable;
}

declare module 'dojo/store/util/QueryResults' {
    interface QueryResults<T> {
        total: any;

        forEach(callback: (item: T, index: number, array: T[]) => void, context?: any): void;
        filter(callback: (item: T, index: number, array: T[]) => boolean, context?: any): QueryResults<T>;
        map<U>(callback: (item: T, index: number, array: T[]) => U, context?: any): QueryResults<U>;

        observe? (listener: (item: T, removedFrom: number, insertedInto: number) => void, includeObjectUpdates?: boolean): dojo.IHandle;

        then<U>(onFulfilled?: (value: QueryResults<T>) => U, onRejected?: (reason: any) => U): dojo.IPromise<U>;
        then<U>(onFulfilled?: (value: QueryResults<T>) => U, onRejected?: (reason: any) => dojo.IPromise<U>): dojo.IPromise<U>;
        then<U>(onFulfilled?: (value: QueryResults<T>) => dojo.IPromise<U>, onRejected?: (reason: any) => U): dojo.IPromise<U>;
        then<U>(onFulfilled?: (value: QueryResults<T>) => dojo.IPromise<U>, onRejected?: (reason: any) => dojo.IPromise<U>): dojo.IPromise<U>;
    }
    var QueryResults: {
        new <T>(results: dojo.IPromise<T[]>): QueryResults<T>;
        new <T>(results: T[]): QueryResults<T>;
    };
    export = QueryResults;
}

declare module 'dojo/store/util/SimpleQueryEngine' {
    interface SimpleQueryEngine<T> {
        (data: T[]): T[];
        matches(item: T): boolean;
    }
    var SimpleQueryEngine: {
        new <T>(query: dojo.IMap, options?: dojo.IMap): SimpleQueryEngine<T>;
        new <T>(query: string, options?: dojo.IMap): SimpleQueryEngine<T>;
        new <T>(query: (item: T) => boolean, options?: dojo.IMap): SimpleQueryEngine<T>;
        new <T>(query?: any, options?: dojo.IMap): SimpleQueryEngine<T>;
    };
    export = SimpleQueryEngine;
}

declare module 'dojo/string' {
    var string: {
        pad(text: string, size: number, character?: string, end?: boolean): string;
        rep(string: string, num: number): string;
        substitute(template: string, map: dojo.IMap, transform?: (value: any, key: string) => string, context?: Object): string;
        substitute(template: string, map: string[], transform?: (value: any, key: string) => string, context?: Object): string;
        trim(string: string): string;
    };
    export = string;
}

declare module 'dojo/text' {
    var text: {
        dynamic: boolean;
        load(id: string, parentRequire: typeof require, loaded: (text: string) => void, config?: any): void;
        normalize(id: string, normalize: (mid: string) => string): string;
    };
    export = text;
}

declare module 'dojo/topic' {
    var topic: {
        publish(topic: string, ...args: any[]): void;
        subscribe(topic: string, listener: Function): dojo.IHandle;
    };
    export = topic;
}

declare module 'dojo/touch' {
    var touch: {
        cancel(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        enter(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        leave(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        move(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        out(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        over(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        press(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
        release(node: HTMLElement, listener: (ev: MouseEvent) => boolean): dojo.IHandle;
    };
    export = touch;
}

declare module 'dojo/when' {
    import Promise = require('dojo/promise/Promise');

    var when: {
        <T>(value: T): Promise<T>;
        <T>(promise: dojo.IPromise<T>): Promise<T>;
    };
    export = when;
}