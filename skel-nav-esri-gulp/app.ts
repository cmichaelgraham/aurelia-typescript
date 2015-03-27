import aur = require("aurelia-router");

export class App {
    static inject = [aur.Router];

    constructor(private router: aur.Router) {
        this.router.configure((config) => {
            config.title = "Aurelia VS/TS";
            config.map([
                { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome to VS/TS" },
                { route: "flickr", moduleId: "views/flickr", nav: true },
                { route: "esri-map", moduleId: "views/esri-map", nav: true, title:"ESRI Map V1" },
                { route: "child-router", moduleId: "views/child-router", nav: true, title: "Child Router" }
            ]);
        });
    }
}