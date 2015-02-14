import aur = require("aurelia-router");

export class Welcome{
    static inject = [aur.Router];
    heading: string;
    constructor(private router: aur.Router){
        this.heading = "Child Router";
        router.configure(config => {
            config.map([
              { route: ["","welcome"],  moduleId: "views/welcome",      nav: true, title:"Welcome" },
              { route: "flickr",        moduleId: "views/flickr",       nav: true },
              { route: "child-router",  moduleId: "views/child-router", nav: true, title:"Child Router" }
            ]);
    });
}
}