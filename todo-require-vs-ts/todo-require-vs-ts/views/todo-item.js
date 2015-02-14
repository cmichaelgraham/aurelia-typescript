define(["require", "exports"], function (require, exports) {
    var ESC_KEY = 27;
    var TodoItem = (function () {
        function TodoItem(title, isCompleted, isEditing, lastLabelClick, editTitle) {
            if (isCompleted === void 0) { isCompleted = false; }
            if (isEditing === void 0) { isEditing = false; }
            if (lastLabelClick === void 0) { lastLabelClick = 0; }
            if (editTitle === void 0) { editTitle = null; }
            this.title = title;
            this.isCompleted = isCompleted;
            this.isEditing = isEditing;
            this.lastLabelClick = lastLabelClick;
            this.editTitle = editTitle;
            this.title = this.title.trim();
        }
        TodoItem.prototype.labelClicked = function () {
            var now = Date.now();
            var duration = now - this.lastLabelClick;
            if (duration < 350) {
                this.editTitle = this.title;
                this.isEditing = true;
            }
            this.lastLabelClick = Date.now();
        };
        TodoItem.prototype.finishEditing = function () {
            this.title = this.editTitle.trim();
            this.isEditing = false;
        };
        TodoItem.prototype.onKeyUp = function (ev) {
            if (ev.keyCode == ESC_KEY) {
                this.editTitle = this.title;
                this.isEditing = false;
            }
        };
        return TodoItem;
    })();
    exports.TodoItem = TodoItem;
});
//# sourceMappingURL=todo-item.js.map