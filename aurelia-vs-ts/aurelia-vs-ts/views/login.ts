import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";
import {AppState} from "views/app-state";

@inject(Router, AppState)
export class Login {

    heading: string;
    username: string;
    password: string;
    destination: string;
    router: Router;
    appState: AppState;

    constructor(router: Router, appState: AppState) {
        this.router = router;
        this.appState = appState;

        this.heading = "aurelia login page";
        this.username = "Admin";
        this.password = "xxx";
        this.destination = "#/";
    }

    activate(a, b, c, d) {
        if (c && c.queryParams && c.queryParams.origin)
            this.destination = c.queryParams.origin;
    }

    trylogin() {
        if (this.appState.login(this.username, this.password))
            this.router.navigate(this.destination, true);
        else
            alert("Access denied");
    }

} 

