define(["require", "exports", "aurelia-framework"], function (require, exports, auf) {
    var Focus = (function () {
        function Focus(element) {
            this.element = element;
            this.element = element;
        }
        Focus.metadata = function () {
            return auf.Behavior.attachedBehavior('focus').withProperty('value', 'valueChanged', 'focus');
        };
        Focus.inject = function () {
            return [Element];
        };
        Focus.prototype.valueChanged = function (value) {
            if (value) {
                this.element.focus();
            }
        };
        return Focus;
    })();
    exports.Focus = Focus;
});
//# sourceMappingURL=focus.js.map