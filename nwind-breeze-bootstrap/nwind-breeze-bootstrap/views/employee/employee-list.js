define(["require", "exports", 'breeze'], function (require, exports, b) {
    var EmployeeList = (function () {
        function EmployeeList() {
        }
        EmployeeList.prototype.activate = function () {
            var query = new b.EntityQuery();
        };
        return EmployeeList;
    })();
    exports.EmployeeList = EmployeeList;
});
//# sourceMappingURL=employee-list.js.map