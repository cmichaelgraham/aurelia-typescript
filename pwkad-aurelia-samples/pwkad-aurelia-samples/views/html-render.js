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
    var HtmlRender = (function () {
        function HtmlRender(element) {
            this.element = element;
            this.myhtml = '<div class="container-fluid"><h2>HTML Render</h2><div class="row"><div class="col-sm-6" style="background: yellow; height: 100px;">Check out rendered HTML</div></div><div class="row"><div class="col-sm-6 col-sm-offset-6" style="background: whitesmoke; height: 100px;">Some more html content!</div></div></div>';
        }
        HtmlRender = __decorate([
            aurelia_framework_1.customElement('html-render'),
            aurelia_framework_1.inject(Element), 
            __metadata('design:paramtypes', [Object])
        ], HtmlRender);
        return HtmlRender;
    })();
    exports.HtmlRender = HtmlRender;
});
//# sourceMappingURL=html-render.js.map