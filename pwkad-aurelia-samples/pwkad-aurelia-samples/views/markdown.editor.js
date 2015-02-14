define(["require", "exports"], function (require, exports) {
    var Welcome = (function () {
        function Welcome(element) {
            this.element = element;
            this.myMarkdownText = '#hey \n ##you';
            this.myCallback = function () {
                console.log('hey pat');
            };
        }
        Welcome.prototype.attached = function (element) {
            console.log(element);
        };
        Welcome.inject = [Element];
        return Welcome;
    })();
    exports.Welcome = Welcome;
});
//# sourceMappingURL=markdown.editor.js.map