import aur = require("aurelia-router");

export class Redirect implements aur.INavigationCommand {
    public url: string;
    public shouldContinueProcessing: boolean;

    /**
      * Application redirect (works with approuter instead of current child router)
      *
      * @url the url to navigate to (ex: "#/home")
      */
    constructor(url) {
        this.url = url;
        this.shouldContinueProcessing = false;
    }

    navigate(appRouter) {
        appRouter.navigate(this.url, { trigger: true, replace: true });
    }
}

class AppState {
    public isAuthenticated: boolean;

    /**
      * Simple application state
      *
      */
    constructor() {
        this.isAuthenticated = false;
    }

    login(username: string, password: string): boolean {
        if (username == "Admin" && password == "xxx") {
            this.isAuthenticated = true;
            return true;
        }
        this.logout();
        return false;
    }

    logout() {
        this.isAuthenticated = false;
    }
}

var appState = new AppState();
export var state = appState;
