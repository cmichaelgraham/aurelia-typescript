var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', 'showdown'], function (require, exports, aurelia_framework_1, showdown_1) {
    var MarkdownComponent = (function () {
        function MarkdownComponent(element) {
            console.log('hey!!!');
            this.element = element;
            console.log(element);
            // An instance of the converter
            this.converter = new showdown_1.default.converter();
        }
        MarkdownComponent.prototype.valueChanged = function (newValue) {
            this.element.innerHTML = this.converter.makeHtml(newValue.split('\n').map(function (line) { return line.trim(); }).join('\n'));
            prism.highlightAll(this.element.querySelectorAll('code'));
        };
        MarkdownComponent = __decorate([
            aurelia_framework_1.customAttribute('markdown-component', null),
            aurelia_framework_1.inject(Element), 
            __metadata('design:paramtypes', [Object])
        ], MarkdownComponent);
        return MarkdownComponent;
    })();
    exports.MarkdownComponent = MarkdownComponent;
});
//# sourceMappingURL=markdown-component.js.map