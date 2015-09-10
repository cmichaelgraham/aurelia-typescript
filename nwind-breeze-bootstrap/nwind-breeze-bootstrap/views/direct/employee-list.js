var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
define(["require", "exports", '../list-view-model', 'aurelia-dependency-injection', 'aurelia-router', './employee-service'], function (require, exports, list_view_model_1, aurelia_dependency_injection_1, aurelia_router_1, employee_service_1) {
    var EmployeeList = (function (_super) {
        __extends(EmployeeList, _super);
        function EmployeeList(router, service) {
            _super.call(this, 'employees', router, service);
        }
        EmployeeList = __decorate([
            aurelia_dependency_injection_1.inject(aurelia_router_1.AppRouter, employee_service_1.EmployeeService),
            aurelia_dependency_injection_1.singleton(), 
            __metadata('design:paramtypes', [Object, Object])
        ], EmployeeList);
        return EmployeeList;
    })(list_view_model_1.ListViewModel);
    exports.EmployeeList = EmployeeList;
});
//# sourceMappingURL=employee-list.js.map