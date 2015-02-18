import wm = require("./wizard-model");

export class StepOne {
    static inject = [wm.WizardModel];

    public firstName: string;
    public wizardModel: wm.WizardModel;

    constructor(wizardModel: wm.WizardModel) {
        var i = "hello";
        this.wizardModel = wizardModel;
    }

    public showValue() {
        alert("first name: " + this.firstName + "\r\nlast name: " + this.wizardModel.lastName);
    }
} 