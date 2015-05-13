if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'aurelia-framework', './parent-element'], function (require, exports, aurelia_framework_1, parent_element_1) {
    var ChildElement = (function () {
        function ChildElement(parentelement) {
            this.parentelement = parentelement;
        }
        ChildElement = __decorate([
            aurelia_framework_1.inject(parent_element_1.ParentElement)
        ], ChildElement);
        return ChildElement;
    })();
    exports.ChildElement = ChildElement;
});
//# sourceMappingURL=child-element.js.map