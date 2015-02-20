import auf = require("aurelia-framework");

export class MultiLevelMenuHelper {
    
    static metadata = [auf.Behavior
        .customElement("multi-level-menu-helper")
        .withProperty("isNaving", "isNavingChanged", "multi-level-menu-helper")
    ];

    public isNaving: boolean = false;

    navigateUp() {
        alert("MultiLevelMenuHelper: navigateUp");
    }

    isNavingChanged(val) {
        alert("isNaving: " + val);
    }
} 