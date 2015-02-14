import m = require("./models");
import auf = require("aurelia-framework");

export class Welcome {
    static inject = [Element];

    public element: Element;
    public myMarkdownText: string;
    public myCallback: () => void;

    constructor(element) {
        this.element = element;
        this.myMarkdownText = '#hey \n ##you';
        this.myCallback = () => {
            return { value: this.myMarkdownText }
        };
    }

    attached(element) {
        console.log(element);
    }
} 