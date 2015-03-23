export class Welcome {
    public heading: string;
    public firstName: string;
    public lastName: string;

    constructor() {
        this.heading = "Welcome to the Aurelia Navigation App (VS/TS)!";
        this.firstName = "John";
        this.lastName = "Doe";
    }

    get fullName() {
        return this.firstName + " " + this.lastName;
    }

    welcome() {
        alert("Welcome, " + this.fullName + "!");
    }
}