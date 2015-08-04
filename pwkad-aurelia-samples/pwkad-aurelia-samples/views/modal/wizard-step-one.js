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
define(["require", "exports", 'aurelia-framework', './wizard'], function (require, exports, aurelia_framework_1, wizard_1) {
    var WizardStepOne = (function () {
        function WizardStepOne(wizard) {
            this.wizard = wizard;
        }
        WizardStepOne = __decorate([
            aurelia_framework_1.inject(wizard_1.Wizard), 
            __metadata('design:paramtypes', [Object])
        ], WizardStepOne);
        return WizardStepOne;
    })();
    exports.WizardStepOne = WizardStepOne;
});
//# sourceMappingURL=wizard-step-one.js.map