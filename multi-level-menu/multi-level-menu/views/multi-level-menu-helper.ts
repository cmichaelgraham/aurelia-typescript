import {bindable} from "aurelia-framework";
import {Router} from "aurelia-router";
import {MultiLevelMenuUtil} from "./MultiLevelMenuUtil";

export class MultiLevelMenuHelper {

    @bindable router: Router;

    navigateUp() {
        MultiLevelMenuUtil.goUp(this.router);
    }
} 