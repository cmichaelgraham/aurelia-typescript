require.config({
    baseUrl: ''
});
require(['scripts/aurelia-bundle'], function (bundle) {
    require(["tests/test-runner"], function (testRunner) {
        testRunner.run();
        // Hai Jasmine - ready to go!
        jasmine.getEnv().execute();
    });
});
//# sourceMappingURL=testapp.js.map