import {inject} from "aurelia-framework";
import {Router, Redirect} from "aurelia-router";
import {AppState} from "views/app-state";

@inject(Router, AppState)
export class Admin {
    heading: string;
    appRouter: Router;
    router: Router;
    appState: AppState;

    constructor(appRouter: Router, appState: AppState) {
        this.heading = "Admin";
        this.appRouter = appRouter;
        this.appState = appState;
    }

    configureRouter(config, router: Router) {
        this.router = router;
        config.map([
            { route: ["", "home"], moduleId: "views/admin/admin-home", nav: true, title: "home" },
            { route: "profile", moduleId: "views/admin/admin-profile", nav: true, title: "profile" },
            { route: "logout", moduleId: "views/admin/admin-logout", nav: true, title: "logout" }
        ]);
    };

    canActivate(): any {
        if (this.appState.isAuthenticated)
            return true;

        return new Redirect("#/login?origin=#/" + this.appRouter.history.fragment);
    }
}
