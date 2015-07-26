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
    var Index = (function () {
        function Index(wizard) {
            this.showing = false;
            this.wizardShowing = false;
            this.wizard = wizard;
            this.steps = [
                new Step(1, 'Step one', 'views/modal/wizard-step-one'),
                new Step(2, 'Step two', 'views/modal/wizard-step-two'),
                new Step(3, 'Step three', 'views/modal/wizard-step-three')
            ];
            this.activeStep = this.steps[0];
        }
        Index.prototype.showModal = function () {
            this.showing = true;
        };
        Index.prototype.closeModal = function () {
            this.showing = false;
        };
        Index.prototype.showWizard = function () {
            this.wizardShowing = true;
        };
        Index.prototype.nextStep = function () {
            var self = this;
            if (this.activeStep.id === this.steps.length) {
                self.wizardShowing = false;
            }
            else {
                this.activeStep = this.steps[this.activeStep.id];
            }
        };
        Index.prototype.closeWizard = function () {
            this.wizardShowing = false;
        };
        Index = __decorate([
            aurelia_framework_1.inject(wizard_1.Wizard), 
            __metadata('design:paramtypes', [Object])
        ], Index);
        return Index;
    })();
    exports.Index = Index;
    var Step = (function () {
        function Step(id, title, path) {
            this.id = 0;
            this.title = '';
            this.path = '';
            this.id = id;
            this.title = title;
            this.path = path;
        }
        return Step;
    })();
});
//# sourceMappingURL=index.js.map