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
define(["require", "exports", "aurelia-framework", "aurelia-router", "./MultiLevelMenuUtil"], function (require, exports, aurelia_framework_1, aurelia_router_1, MultiLevelMenuUtil_1) {
    var MultiLevelMenuHelper = (function () {
        function MultiLevelMenuHelper() {
        }
        MultiLevelMenuHelper.prototype.navigateUp = function () {
            MultiLevelMenuUtil_1.MultiLevelMenuUtil.goUp(this.router);
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', aurelia_router_1.Router)
        ], MultiLevelMenuHelper.prototype, "router");
        return MultiLevelMenuHelper;
    })();
    exports.MultiLevelMenuHelper = MultiLevelMenuHelper;
});
//# sourceMappingURL=multi-level-menu-helper.js.map