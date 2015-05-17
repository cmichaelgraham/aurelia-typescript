//import {AppState} from "views/app-state";

export function configure(aurelia) {
    aurelia
        //.withSingleton(AppState, new AppState())
        .use
        .standardConfiguration()
        .developmentLogging();

    aurelia.start().then(a => a.setRoot('views/app'));
}
