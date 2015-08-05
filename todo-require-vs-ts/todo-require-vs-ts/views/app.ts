import aur = require("aurelia-router");
// import t = require("./todos");

export class App {
    static inject = [aur.Router];

    constructor(private router: aur.Router) {
        this.router.configure((config) => {
            config.title = "TodoMVC";
            config.map([
                { route: ["", ":filter"], moduleId: "views/todos", nav: true }
            ]);
            return config;
        });
    }
}