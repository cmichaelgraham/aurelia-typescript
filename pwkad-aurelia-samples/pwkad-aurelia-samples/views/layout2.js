define(["require", "exports"], function (require, exports) {
    var Layout = (function () {
        function Layout() {
            this.showing = false;
        }
        Layout.prototype.showModal = function () {
            this.showing = !this.showing;
        };
        return Layout;
    })();
    exports.Layout = Layout;
    var Option = (function () {
        function Option(id, name, columns) {
            this.id = id;
            this.name = name;
            this.columns = columns;
        }
        return Option;
    })();
});
//# sourceMappingURL=layout2.js.map