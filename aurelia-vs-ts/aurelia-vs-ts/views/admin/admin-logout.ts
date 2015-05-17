import {inject} from "aurelia-framework";
import {Redirect} from "aurelia-router";
import {AppState} from "views/app-state";

@inject(AppState)
export class AdminLogout {
    heading: string;
    appState: AppState;

    constructor(appState: AppState) {
        this.appState = appState;
        this.heading = "Logout";
    }

    canActivate() {
        this.appState.logout();
        return new Redirect("#/");
    }
} 

 