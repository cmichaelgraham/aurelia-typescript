define(["require", "exports", '../settings', 'aurelia-fetch-client', './odata-helper'], function (require, exports, settings_1, aurelia_fetch_client_1, odata_helper_1) {
    var missingPhoto = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAMFBMVEXFxcX19fX+/v7x8fHu7u7p6enl5eXh4eHc3NzZ2dnV1dXR0dHNzc3Jycn5+fnGxsbcfiHzAAACQ0lEQVR4Xu2Yz0obURTGxz+Nf2IyIcvSlswNmaixQxG6LIpLRRB9geAThO4KpUieQNy4kxBfQNoXCF103dJ9SWfTUiiOeQARXHhwvHf8zhfIxvnt8+Ny5nzn3BvvyZCTk5OTUzo9ePX77YfvrOBbbG6JPlIC/5O5409C/L5rBPNXbzgz9/inFfw0KXZ1gqU4LQh03+KzeUBLI1gwFnrEAdgjlIyNCK/ClbGyAQu27IIGWULhAhRcuwQVUNB1CVbAGBkXERapOePkCBJMuwVDLgfCGiQ4dAuakCB2CwIyCAISh/kswTEgKGQJOoBgNkuwCQimRMCloZwlGHKNKNQAwYgQECegazCJrzAzbh88yxK0J5GFJSSN/DxA2HcLQmImEgt6NO5ULgDzhB2KiQfx3iVY9gSqCJegYJ7rQ8FftwvqHsovu+C/CLg4DDyYvk2w6uHMkV0knHAXJKFIVkD4kRa89HT4qX4OE6Xg3KTYJn8vPCdeXLThi7Gy400ojcWqSxD0iCBA3Yjvxj0gyutZgvoA62E379iZLm8/7gDCi2yBX31MEAy4C5LwhlvtQgOchdyG/SoC6uFUihFBlABXRLKMXUywTHahkDhzCNLWXc/wLRmjggAehbrhWMYFFWAj64vgx7ggIksgHHOjQKhwSRRec7NECOEg4HFY0Al63CwQNtErOv6I7usELe4jCCGXZSEAvyL+hl3UCi7sbz2cDhYlfDlMawU1LIt4HvtaQQvbaviV8VAraGL/huMXlapOIM/YGwKj/drs5x+/AAAAAElFTkSuQmCC';
    var EmployeeService = (function () {
        function EmployeeService() {
        }
        EmployeeService.prototype.getPage = function (pageIndex) {
            var odataHelper = new odata_helper_1.OdataHelper(new aurelia_fetch_client_1.HttpClient());
            odataHelper
                .url(settings_1.default.serviceName2)
                .fromm('Employees')
                .select('EmployeeID, FirstName, LastName, Title, HireDate, HomePhone, Extension, Photo')
                .orderBy('LastName')
                .skip(pageIndex * settings_1.default.pageSize)
                .take(settings_1.default.pageSize)
                .inlineCount();
            var a = odataHelper.execQuery();
            return a
                .then(function (items) {
                for (var ii in items) {
                    if (items[ii].Photo && items[ii].Photo.$value) {
                        items[ii].photoData = 'data:image/png;base64,' + items[ii].Photo.$value;
                    }
                    else {
                        items[ii].photoData = 'data:image/png;base64,' + missingPhoto;
                    }
                }
                return Promise.resolve({
                    entities: items,
                    pageCount: 1,
                });
            });
        };
        return EmployeeService;
    })();
    exports.EmployeeService = EmployeeService;
});
//# sourceMappingURL=employee-service.js.map