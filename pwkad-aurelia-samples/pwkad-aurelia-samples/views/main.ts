export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
      .developmentLogging()
      .plugin('aurelia-bs-modal');

  aurelia.start().then(a => a.setRoot('views/app'));
}
