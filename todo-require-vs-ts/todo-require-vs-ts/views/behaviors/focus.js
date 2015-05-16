if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    var Focus = (function () {
        function Focus(element) {
            this.element = element;
        }
        Focus.prototype.valueChanged = function (value) {
            if (value) {
                this.element.focus();
            }
        };
        __decorate([
            aurelia_framework_1.bindable
        ], Focus.prototype, "value");
        Focus = __decorate([
            aurelia_framework_1.customAttribute('focus'),
            aurelia_framework_1.inject(Element)
        ], Focus);
        return Focus;
    })();
    exports.Focus = Focus;
});
//# sourceMappingURL=focus.js.map