define(["require", "exports", "views/my-child-vm"], function (require, exports, m) {
    var ChildVM = (function () {
        function ChildVM() {
            this.myChild = new m.MyChildVM("jhonny");
        }
        return ChildVM;
    })();
    exports.ChildVM = ChildVM;
});
//# sourceMappingURL=child-vm.js.map