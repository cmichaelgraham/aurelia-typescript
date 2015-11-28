export class Welcome {
    heading: string = 'Welcome to Aurelia!';
    firstName: string = 'John';
    lastName: string = 'Doe';

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    submit(): void {
        alert(`Welcome, ${this.fullName}!`);
    }
}