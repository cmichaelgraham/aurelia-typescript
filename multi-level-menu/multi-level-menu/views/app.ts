import aur = require("aurelia-router");

export class App {
    static inject = [aur.Router];

    constructor(private router: aur.Router) {
        this.router.configure((config) => {
            config.title = "Aurelia VS/TS";
            config.map([
                { route: ["", "item-1"], moduleId: "views/item-1", nav: true, title: "item 1" },
                { route: ["item-1-1"], moduleId: "views/item-1-1", nav: true, title: "item 1.1" },
                { route: ["item-1-2"], moduleId: "views/item-1-2", nav: true, title: "item 1.2" },
                { route: ["item-2"], moduleId: "views/item-2", nav: true, title: "item 2" },
                { route: ["item-2-1"], moduleId: "views/item-2-1", nav: true, title: "item 2.1" },
                { route: ["item-2-2"], moduleId: "views/item-2-2", nav: true, title: "item 2.2" },
                { route: ["item-2-2-1"], moduleId: "views/item-2-2-1", nav: true, title: "item 2.2.1" },
                { route: ["item-2-2-2"], moduleId: "views/item-2-2-2", nav: true, title: "item 2.2.2" },
                { route: ["item-2-3"], moduleId: "views/item-2-3", nav: true, title: "item 2.3" }
            ]);
        });
    }
}