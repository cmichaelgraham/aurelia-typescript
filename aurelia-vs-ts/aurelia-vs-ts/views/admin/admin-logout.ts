import app = require("scripts/app-state")

export class AdminLogout {
    public heading: string;

    constructor() {
        this.heading = "Logout";
    }

    canActivate() {
        app.state.logout();
        return new app.Redirect("#/");
    }
} 

 