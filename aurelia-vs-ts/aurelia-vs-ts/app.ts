import aur = require("aurelia-router");

export class App {
  static inject = [aur.Router];

  constructor(private router: aur.Router) {
    this.router.configure((config) => {
      config.title = "Aurelia demo";
      config.map([
        { route: ["", "home"],    moduleId: "views/home",               nav: true,  title: "home" },
        { route: "login",         moduleId: "views/login",              nav: false, title: "login" },
        { route: "test",          moduleId: "views/nav-test/nav-test",  nav: true,  title: "navigation test" },
        { route: "flickr",        moduleId: "views/flickr/flickr",      nav: true,  title: "flickr" },
        { route: "admin",         moduleId: "views/admin/admin",        nav: true,  title: "admin" }
      ]);
    });
  }
}