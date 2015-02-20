import aur = require("aurelia-router");
import mlmps = require("./MultiLevelMenuPipelineStep");

export class App {
    static inject = [aur.Router];

    constructor(public router: aur.Router) {
        this.router.configure((config) => {
            config.title = "Aurelia VS/TS";
            config.addPipelineStep("modelbind", mlmps.MultiLevelMenuPipelineStep);
            config.map([
                { route: ["", "home"], moduleId: "views/home", nav: true, title: "home", settings: { level: 0, show: true } },
                { route: ["item-1"], moduleId: "views/item-1", nav: true, title: "item 1", settings: { level: 0, show: true } },
                { route: ["item-1-1"], moduleId: "views/item-1-1", nav: true, title: "item 1.1", settings: { level: 1, show: false } },
                { route: ["item-1-2"], moduleId: "views/item-1-2", nav: true, title: "item 1.2", settings: { level: 1, show: false } },
                { route: ["item-2"], moduleId: "views/item-2", nav: true, title: "item 2", settings: { level: 0, show: true } },
                { route: ["item-2-1"], moduleId: "views/item-2-1", nav: true, title: "item 2.1", settings: { level: 1, show: false } },
                { route: ["item-2-2"], moduleId: "views/item-2-2", nav: true, title: "item 2.2", settings: { level: 1, show: false } },
                { route: ["item-2-2-1"], moduleId: "views/item-2-2-1", nav: true, title: "item 2.2.1", settings: { level: 2, show: false } },
                { route: ["item-2-2-2"], moduleId: "views/item-2-2-2", nav: true, title: "item 2.2.2", settings: { level: 2, show: false } },
                { route: ["item-2-3"], moduleId: "views/item-2-3", nav: true, title: "item 2.3", settings: { level: 1, show: false } }
            ]);
        });
    }
}