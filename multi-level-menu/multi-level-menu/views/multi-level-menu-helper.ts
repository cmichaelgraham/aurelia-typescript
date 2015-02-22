import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import mlmu = require("./MultiLevelMenuUtil");

export class MultiLevelMenuHelper {

    public router: aur.Router;

    static metadata = auf.Behavior.withProperty("router");

    navigateUp() {
        mlmu.MultiLevelMenuUtil.goUp(this.router);
    }
} 