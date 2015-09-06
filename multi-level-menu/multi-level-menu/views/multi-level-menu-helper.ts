import {customElement, bindable} from "aurelia-framework";
import {Router} from "aurelia-router";
import {MultiLevelMenuUtil} from "views/MultiLevelMenuUtil";

export class MultiLevelMenuHelper {
    constructor() {
        var a = "";
    }

    @bindable router: Router;

    navigateUp() {
        MultiLevelMenuUtil.goUp(this.router);
    }
} 