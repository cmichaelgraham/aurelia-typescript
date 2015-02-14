define(["require", "exports", "aurelia-framework", "showdown", "prism"], function (require, exports, auf, showdown, prism) {
    //import 'prism/themes/prism-okaidia.css!';
    var MarkdownComponentAttachedBehavior = (function () {
        function MarkdownComponentAttachedBehavior(element) {
            this.element = element;
            // An instance of the converter
            this.conv = new showdown.converter();
        }
        MarkdownComponentAttachedBehavior.metadata = function () {
            return auf.Behavior.attachedBehavior('markdown-component').withProperty('value', 'valueChanged', 'markdown-component');
        };
        MarkdownComponentAttachedBehavior.inject = function () {
            return [Element];
        };
        MarkdownComponentAttachedBehavior.prototype.attached = function () {
            console.log(this.value);
            // this.value.somethingElse();
        };
        MarkdownComponentAttachedBehavior.prototype.valueChanged = function (newValue) {
            this.element["innerHTML"] = this.conv.makeHtml(newValue.split('\n').map(function (line) { return line.trim(); }).join('\n'));
            prism.highlightAll(this.element.querySelectorAll('code'));
        };
        return MarkdownComponentAttachedBehavior;
    })();
    exports.MarkdownComponentAttachedBehavior = MarkdownComponentAttachedBehavior;
});
//# sourceMappingURL=markdown-component.js.map