import * as dependencyInjectionTests from "tests/dependency-injection-tests";
import * as metadataSpec from "tests/metadata.spec";


export var run = () => {
    dependencyInjectionTests.run();
    metadataSpec.run();
}
 