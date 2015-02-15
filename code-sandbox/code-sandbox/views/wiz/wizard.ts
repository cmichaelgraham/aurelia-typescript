import auf = require("aurelia-framework");
import aur = require("aurelia-router");

export class Wizard {
    static inject = [aur.Router];

    constructor(public router: aur.Router) {
        router.configure(config => {
            config.title = "wiz router";
            config.map([
                { route: ["", "step-one"], moduleId: "./step-one", nav: true }
            ]);
        });
    }
} 