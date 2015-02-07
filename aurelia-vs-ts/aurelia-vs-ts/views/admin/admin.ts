import aur = require("aurelia-router");
import app = require("scripts/app-state")

export class Admin {
  static inject = [aur.Router, aur.AppRouter];

  heading: string;

  constructor(private router: aur.Router, private appRouter: any) {
    this.heading = "Admin";

    router.configure(config => {
      config.map([
        { route: ["", "home"],  moduleId: "views/admin/admin-home",           nav: true,  title: "home" },
        { route: "profile",     moduleId: "views/admin/admin-profile",        nav: true,  title: "profile" },
        { route: "logout",      moduleId: "views/admin/admin-logout",         nav: true,  title: "logout" }
      ]);
    });
  }

  canActivate(): any {
    if (app.state.isAuthenticated)
      return true;

    return new app.Redirect("#/login?origin=#/" + this.appRouter.history.fragment);
  }


}
