define(["require", "exports", './settings'], function (require, exports, settings_1) {
    var ListViewModel = (function () {
        function ListViewModel(route, router, service) {
            this.entities = [];
            this.pageSize = settings_1.default.pageSize;
            this.pageCount = 0;
            this.pageIndex = 0;
            this.isLoading = false;
            this.route = route;
            this.router = router;
            this.service = service;
        }
        ListViewModel.prototype.activate = function () {
            this.load();
        };
        ListViewModel.prototype.load = function () {
            var _this = this;
            this.isLoading = true;
            this.service.getPage(this.pageIndex)
                .then(function (result) {
                _this.entities = result.entities;
                _this.pageCount = result.pageCount;
                _this.isLoading = false;
            });
        };
        ListViewModel.prototype.setPage = function (index) {
            this.pageIndex = index;
            this.load();
        };
        ListViewModel.prototype.open = function (id) {
            this.router.navigate(this.route + '/' + id);
        };
        return ListViewModel;
    })();
    exports.ListViewModel = ListViewModel;
});
//# sourceMappingURL=list-view-model.js.map