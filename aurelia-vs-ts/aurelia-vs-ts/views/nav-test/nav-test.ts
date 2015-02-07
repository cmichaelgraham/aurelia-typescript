import aur = require("aurelia-router");

export class NavTest {
    static inject = [aur.Router];

    public heading: string;
    public examples: Array<string>;
    public destination: string;

    constructor(private theRouter: aur.Router) {
        this.heading = "Test";
        this.examples = new Array<string>("#/", "#/admin/profile", "#/flickr", "http://aurelia.io/");
        this.destination = "#/admin/profile";
    }

    selectExample(destination: string) {
        this.destination = destination;
        //alert(destination);
    }

    navigateToDestination() {
        this.theRouter.navigate(this.destination, true);
    }
} 
