import {Aurelia} from 'aurelia-framework'

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .plugin('aurelia-breeze')
        .developmentLogging();

    (<any>aurelia).loader.textPluginName = 'dojo/text';
    aurelia.start().then(a => a.setRoot('views/app'));
}