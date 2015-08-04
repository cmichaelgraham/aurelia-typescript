define(["require", "exports", "tests/dependency-injection-tests", "tests/metadata.spec"], function (require, exports, dependencyInjectionTests, metadataSpec) {
    exports.run = function () {
        dependencyInjectionTests.run();
        metadataSpec.run();
    };
});
//# sourceMappingURL=test-runner.js.map