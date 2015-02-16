import aur = require("aurelia-router");

export class App {
    static inject = [aur.Router];

    constructor(private router: aur.Router) {
        Array.prototype["move"] = function (old_index, new_index) {
            var element = this[old_index];
            this.splice(old_index, 1);
            this.splice(new_index, 0, element);
        };

        this.router.configure((config) => {
            config.title = "PWKad Aurelia Samples";
            config.map([
                { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome to VS/TS" },
                { route: "flickr", moduleId: "views/flickr", nav: true },
                { route: "child-router", moduleId: "views/child-router", nav: true, title: "Child Router" },
                { route: ["layout"], moduleId: "views/layout", nav: true, title: "Compose" },
                { route: ["layout2"], moduleId: "views/layout2", nav: true, title: "Layout2" },
                { route: ["markdown", "markdown.editor"], moduleId: "views/markdown.editor", nav: true, title: "Markdown" },
                { route: ["html", "html.render"], moduleId: "views/html.render", nav: true, title: "HTML Render" },
                { route: ["knockout"], moduleId: "views/knockout", nav: true, title: "Knockout" }
            ]);
        });
    }
}