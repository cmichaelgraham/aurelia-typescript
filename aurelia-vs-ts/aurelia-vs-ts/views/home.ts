export class Home {
    public heading: string;
    public firstName: string;
    public lastName: string;

    constructor() {
        this.heading = "Welcome to Aurelia!";
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

export class UpperValueConverter {
    toView(value) {
        return value && value.toUpperCase();
    }
}
