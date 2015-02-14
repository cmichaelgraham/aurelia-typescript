define(["require", "exports"], function (require, exports) {
    var Welcome = (function () {
        function Welcome(element) {
            var _this = this;
            this.element = element;
            this.myMarkdownText = '#hey \n ##you';
            this.myCallback = function () {
                return { value: _this.myMarkdownText };
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