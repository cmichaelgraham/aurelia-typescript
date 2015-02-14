import auf = require("aurelia-framework");

import showdown = require("showdown");
import prism = require("prism");

//import 'prism/themes/prism-okaidia.css!';

export class MarkdownComponentAttachedBehavior {
    static metadata() {
        return auf.Behavior
            .attachedBehavior('markdown-component')
            .withProperty('value', 'valueChanged', 'markdown-component');
    }

    static inject() { return [Element]; }

    public conv: showdown.converter;
    public value: any;

    constructor(public element: Element) {
        // An instance of the converter
        this.conv = new showdown.converter();
    }

    attached() {
        console.log(this.value);
        // this.value.somethingElse();
    }


    valueChanged(newValue) {
        this.element["innerHTML"] = this.conv.makeHtml(
            newValue.split('\n').map((line) => line.trim()).join('\n')
            );
        prism.highlightAll(this.element.querySelectorAll('code'));
    }
}