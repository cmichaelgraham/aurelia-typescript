require.config({
    baseUrl: ''
});

require(['scripts/aurelia-bundle'],(bundle) => {
    require(["tests/test-runner"],(testRunner) => {
        testRunner.run();

        // Hai Jasmine - ready to go!
        jasmine.getEnv().execute();
    });

});