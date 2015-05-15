import {customElement, bindable, skipContentProcessing, noView, autoinject, Container} from "aurelia-framework";
import {ViewCompiler, ViewResources, ViewSlot, View, ViewFactory} from 'aurelia-templating';
import {ResourcePool} from '../services/resource-pool';

var hasTemplateElement = ('content' in document.createElement('template'));

@customElement('resource-pooled')
@skipContentProcessing
@noView
@autoinject
export class ResourcePooled {

    public template: HTMLElement;
    @bindable public pool: string;
    public view: View;
    public viewFactory: ViewFactory;

    constructor(
        public element: Element,
        public resourcePool: ResourcePool,
        public viewCompiler: ViewCompiler,
        public viewResources: ViewResources,
        public viewSlot: ViewSlot,
        public container: Container
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