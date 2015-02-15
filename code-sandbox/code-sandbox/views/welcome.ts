import aur = require("aurelia-router");
import auf = require("aurelia-framework")

export class Welcome {
    static inject() { return [auf.Parent.of(aur.Router)]; }

    public heading: string;
    public firstName: string;
    public lastName: string;
    public addedDynoViewRoute: boolean = false;

    constructor(public theRouter: aur.Router) {
        this.heading = "Welcome to the Aurelia Navigation App (VS/TS)!";
        this.firstName = "John";
        this.lastName = "Doe";
    }

    get fullName() {
        return this.firstName + " " + this.lastName;
    }

    addDynamicRoute() {
        this.theRouter.addRoute({ route: "dyno-view", moduleId: "views/dyno-view", nav: true, title: "dyno-view" });
        this.theRouter.refreshNavigation();
    }

    welcome() {
        alert("Welcome, " + this.fullName + "!");
    }
}