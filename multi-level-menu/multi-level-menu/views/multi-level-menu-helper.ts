import {customElement, bindable} from "aurelia-framework";
import {Router} from "aurelia-router";
import {MultiLevelMenuUtil} from "./MultiLevelMenuUtil";

@customElement('multi-level-menu-helper')
export class MultiLevelMenuHelper {
    constructor() {
        var a = "";
    }

    @bindable router: Router;

    //getViewStrategy() {
    //    return 'multi-level-menu-helper.html';
    //}

    navigateUp() {
        MultiLevelMenuUtil.goUp(this.router);
    }
} 