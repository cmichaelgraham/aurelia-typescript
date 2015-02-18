define(["require", "exports", "aurelia-framework", "../services/resource-pool"], function (require, exports, auf, rp) {
    var hasTemplateElement = ('content' in document.createElement('template'));
    var ResourcePooled = (function () {
        function ResourcePooled(element, resourcePool, viewCompiler, viewResources, viewSlot, container) {
            this.element = element;
            this.resourcePool = resourcePool;
            this.viewCompiler = viewCompiler;
            this.viewResources = viewResources;
            this.viewSlot = viewSlot;
            this.container = container;
            var template = document.createElement('template');
            if (hasTemplateElement) {
                template["content"] = document.createDocumentFragment();
            }
            while (element.firstChild) {
                template["content"].appendChild(element.firstChild);
            }
            this.template = template;
        }
        ResourcePooled.metadata = function () {
            return auf.Behavior.customElement('resource-pooled').withProperty('pool').skipContentProcessing().noView();
        };
        ResourcePooled.prototype.bind = function (context) {
            var _this = this;
            if (!this.pool) {
                this.pool = this.viewResources.viewUrl;
            }
            this.viewFactory = this.resourcePool.get(this.pool, 'viewFactory', function () { return _this.viewCompiler.compile(_this.template, _this.viewResources); });
            this.resourcePool.free(this.pool, 'viewFactory');
            this.view = this.resourcePool.get(this.pool, 'view', function () {
                console.log("Creating pooled view: " + _this.pool);
                return _this.viewFactory.create(_this.container, null, { suppressBind: true });
            });
            this.view.bind(context);
            this.viewSlot.add(this.view);
        };
        ResourcePooled.prototype.unbind = function () {
            this.viewSlot.remove(this.view);
            this.view.unbind();
            this.resourcePool.free(this.pool, 'view', this.view);
            this.view = null;
        };
        ResourcePooled.inject = [Element, rp.ResourcePool, auf.ViewCompiler, auf.ViewResources, auf.ViewSlot, auf.Container];
        return ResourcePooled;
    })();
    exports.ResourcePooled = ResourcePooled;
});
//# sourceMappingURL=resource-pooled.js.map