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
define(["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    var AuButton = (function () {
        function AuButton() {
            this.text = '';
            this.click = defaultClick;
        }
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], AuButton.prototype, "text");
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], AuButton.prototype, "click");
        return AuButton;
    })();
    exports.AuButton = AuButton;
    function defaultClick() {
        console.log('Forgot to override your button click');
    }
});
//# sourceMappingURL=au-button.js.map