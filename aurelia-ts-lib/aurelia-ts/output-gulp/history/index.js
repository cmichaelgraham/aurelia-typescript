define(["require", "exports"], function (require, exports) {
    var History = (function () {
        function History() {
        }
        History.prototype.activate = function () {
            throw new Error('History must implement activate().');
        };
        History.prototype.deactivate = function () {
            throw new Error('History must implement deactivate().');
        };
        History.prototype.navigate = function () {
            throw new Error('History must implement navigate().');
        };
        History.prototype.navigateBack = function () {
            throw new Error('History must implement navigateBack().');
        };
        return History;
    })();
    exports.History = History;
});
