var ESC_KEY = 27;

export class TodoItem {
    constructor(public title: string,
        public isCompleted = false,
        public isEditing = false,
        public lastLabelClick = 0,
        public editTitle = null) {

        this.title = this.title.trim();
    }

    labelClicked() {
        var now = Date.now();
        var duration = now - this.lastLabelClick;

        if (duration < 350) {
            this.editTitle = this.title;
            this.isEditing = true;
        }

        this.lastLabelClick = Date.now();
    }

    finishEditing() {
        this.title = this.editTitle.trim();
        this.isEditing = false;
    }

    onKeyUp(ev) {
        if (ev.keyCode == ESC_KEY) {
            this.editTitle = this.title;
            this.isEditing = false;
        }
    }
}
 