define(["require", "exports", "./wizard-model"], function (require, exports, wm) {
    var StepOne = (function () {
        function StepOne(wizardModel) {
            var i = "hello";
            this.wizardModel = wizardModel;
        }
        StepOne.prototype.showValue = function () {
            alert("first name: " + this.firstName + "\r\nlast name: " + this.wizardModel.lastName);
        };
        StepOne.inject = [wm.WizardModel];
        return StepOne;
    })();
    exports.StepOne = StepOne;
});
//# sourceMappingURL=step-one.js.map