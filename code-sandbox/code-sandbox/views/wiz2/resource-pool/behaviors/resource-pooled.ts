import auf = require("aurelia-framework");
//import {ViewCompiler, ViewResources, ViewSlot} from 'aurelia-templating';
//import {ResourcePool} from '../services/resource-pool';
import rp = require("../services/resource-pool");

var hasTemplateElement = ('content' in document.createElement('template'));

export class ResourcePooled {
    static metadata() {
        return auf.Behavior
            .customElement('resource-pooled')
            .withProperty('pool')
            .skipContentProcessing()
            .noView();
    }

    public template: HTMLElement;
    public pool: string;
    public view: auf.View;
    public viewFactory: auf.ViewFactory;

    static inject = [Element, rp.ResourcePool, auf.ViewCompiler, auf.ViewResources, auf.ViewSlot, auf.Container];

    constructor(
        public element: Element,
        public resourcePool: rp.ResourcePool,
        public viewCompiler: auf.ViewCompiler,
        public viewResources: auf.ViewResources,
        public viewSlot: auf.ViewSlot,
        public container: auf.Container
        ) {

        var template = document.createElement('template');
        if (hasTemplateElement) {
            template["content"] = document.createDocumentFragment();
        }

        while (element.firstChild) {
            template["content"].appendChild(element.firstChild);
        }

        this.template = template;
    }

    bind(context) {
        if (!this.pool) {
            this.pool = this.viewResources.viewUrl;
        }

        this.viewFactory = this.resourcePool.get(this.pool, 'viewFactory',() => this.viewCompiler.compile(this.template, this.viewResources));
        this.resourcePool.free(this.pool, 'viewFactory');

        this.view = this.resourcePool.get(this.pool, 'view', () => {
            console.log("Creating pooled view: " + this.pool);
            return this.viewFactory.create(this.container, null, { suppressBind: true });
        });
        this.view.bind(context);
        this.viewSlot.add(this.view);
    }

    unbind() {
        this.viewSlot.remove(this.view);
        this.view.unbind();
        this.resourcePool.free(this.pool, 'view', this.view);
        this.view = null;
    }
}