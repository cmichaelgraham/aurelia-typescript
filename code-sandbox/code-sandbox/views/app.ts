import aur = require("aurelia-router");

export class App {
    static inject = [aur.Router];

    constructor(private router: aur.Router) {
        this.router.configure((config) => {
            config.title = "Aurelia VS/TS";
            config.map([
                { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome to Code Sandbox" },
                { route: "child-vm", moduleId: "views/child-vm", nav: true },
                { route: "wizard", moduleId: "views/wiz/wizard", nav: true },
                { route: "aurelia-cube", moduleId: "views/aurelia-cube", nav: true }
            ]);
        });
    }
}