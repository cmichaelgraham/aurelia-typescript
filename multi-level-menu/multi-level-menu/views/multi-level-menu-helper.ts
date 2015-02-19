import auf = require("aurelia-framework");

export class MultiLevelMenuHelper {

    static metadata = auf.Behavior
        //.customElement("multi-level-menu-helper")
        .withProperty("router")
        .withProperty("isNavigating", "isNavigatingChanged");

    navigateUp() {
        alert("MultiLevelMenuHelper: navigateUp");
    }

    isNavigatingChanged(val) {
        alert("isNavigatingChanged: " + val);
    }
} 