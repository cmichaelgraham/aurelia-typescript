define(["require", "exports", "aurelia-framework"], function (require, exports, auf) {
    exports.run = function () {
        describe("dependency injection", function () {
            describe("container", function () {
                describe("injection", function () {
                    it("01: instantiates class without injected services", function () {
                        var container = new auf.Container();
                        var app = container.get(App01);
                        expect(app).toEqual(jasmine.any(App01));
                    });
                    it('02: uses static inject property (TypeScript)', function () {
                        var container = new auf.Container();
                        var app = container.get(App02);
                        expect(app.logger).toEqual(jasmine.any(Logger02));
                    });
                    it('03: uses static inject property (TypeScript,CoffeeScript,ES5)', function () {
                        App03.inject = [Logger03];
                        var container = new auf.Container();
                        var app = container.get(App03);
                        expect(app.logger).toEqual(jasmine.any(Logger03));
                    });
                    it('04: uses static parameters property (AtScript)', function () {
                        App04.parameters = [{ is: Logger04 }]; //Note: Normally provided by the AtScript compiler.
                        var container = new auf.Container();
                        container.supportAtScript();
                        var app = container.get(App04);
                        expect(app.logger).toEqual(jasmine.any(Logger04));
                    });
                    it('05: uses static parameters property as array (AtScript)', function () {
                        App05.parameters = [[Logger05]]; //Note: Normally provided by the AtScript compiler.
                        var container = new auf.Container();
                        container.supportAtScript();
                        var app = container.get(App05);
                        expect(app.logger).toEqual(jasmine.any(Logger05));
                    });
                });
                describe('registration', function () {
                    it('06: automatically configures as singleton', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App06_1);
                        var app2 = container.get(App06_2);
                        expect(app1.logger).toBe(app2.logger);
                    });
                    it('07: configures singleton via api', function () {
                        var container = new auf.Container();
                        container.registerSingleton(Logger07, Logger07);
                        var app1 = container.get(App07_1);
                        var app2 = container.get(App07_2);
                        expect(app1.logger).toBe(app2.logger);
                    });
                    it('08: configures singleton via metadata method (ES6)', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App08_1);
                        var app2 = container.get(App08_2);
                        expect(app1.logger).toBe(app2.logger);
                    });
                    it('09: configures singleton via metadata property (ES5, AtScript, TypeScript, CoffeeScript)', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App09_1);
                        var app2 = container.get(App09_2);
                        expect(app1.logger).toBe(app2.logger);
                    });
                    it('10: configures transient (non singleton) via api', function () {
                        var container = new auf.Container();
                        container.registerTransient(Logger10, Logger10);
                        var app1 = container.get(App10_1);
                        var app2 = container.get(App10_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                    it('11: configures transient (non singleton) via metadata method (ES6)', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App11_1);
                        var app2 = container.get(App11_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                });
            });
        });
    };
    // classes for test 01
    var App01 = (function () {
        function App01() {
        }
        return App01;
    })();
    // classes for test 02
    var Logger02 = (function () {
        function Logger02() {
        }
        return Logger02;
    })();
    var App02 = (function () {
        function App02(logger) {
            this.logger = logger;
        }
        App02.inject = [Logger02];
        return App02;
    })();
    // classes for test 03
    var Logger03 = (function () {
        function Logger03() {
        }
        return Logger03;
    })();
    var App03 = (function () {
        function App03(logger) {
            this.logger = logger;
        }
        return App03;
    })();
    // classes for test 04
    var Logger04 = (function () {
        function Logger04() {
        }
        return Logger04;
    })();
    var App04 = (function () {
        function App04(logger) {
            this.logger = logger;
        }
        return App04;
    })();
    // classes for test 05
    var Logger05 = (function () {
        function Logger05() {
        }
        return Logger05;
    })();
    var App05 = (function () {
        function App05(logger) {
            this.logger = logger;
        }
        return App05;
    })();
    // classes for test 06
    var Logger06 = (function () {
        function Logger06() {
        }
        return Logger06;
    })();
    var App06_1 = (function () {
        function App06_1(logger) {
            this.logger = logger;
        }
        App06_1.inject = [Logger06];
        return App06_1;
    })();
    var App06_2 = (function () {
        function App06_2(logger) {
            this.logger = logger;
        }
        App06_2.inject = [Logger06];
        return App06_2;
    })();
    // classes for test 07
    var Logger07 = (function () {
        function Logger07() {
        }
        return Logger07;
    })();
    var App07_1 = (function () {
        function App07_1(logger) {
            this.logger = logger;
        }
        App07_1.inject = [Logger07];
        return App07_1;
    })();
    var App07_2 = (function () {
        function App07_2(logger) {
            this.logger = logger;
        }
        App07_2.inject = [Logger07];
        return App07_2;
    })();
    // classes for test 08
    var Logger08 = (function () {
        function Logger08() {
        }
        Logger08.metadata = [new auf.Singleton()];
        return Logger08;
    })();
    var App08_1 = (function () {
        function App08_1(logger) {
            this.logger = logger;
        }
        App08_1.inject = [Logger08];
        return App08_1;
    })();
    var App08_2 = (function () {
        function App08_2(logger) {
            this.logger = logger;
        }
        App08_2.inject = [Logger08];
        return App08_2;
    })();
    // classes for test 09
    var Logger09 = (function () {
        function Logger09() {
        }
        return Logger09;
    })();
    Logger09.metadata = [new auf.Singleton()];
    var App09_1 = (function () {
        function App09_1(logger) {
            this.logger = logger;
        }
        App09_1.inject = [Logger09];
        return App09_1;
    })();
    var App09_2 = (function () {
        function App09_2(logger) {
            this.logger = logger;
        }
        App09_2.inject = [Logger09];
        return App09_2;
    })();
    // classes for test 10
    var Logger10 = (function () {
        function Logger10() {
        }
        return Logger10;
    })();
    var App10_1 = (function () {
        function App10_1(logger) {
            this.logger = logger;
        }
        App10_1.inject = [Logger10];
        return App10_1;
    })();
    var App10_2 = (function () {
        function App10_2(logger) {
            this.logger = logger;
        }
        App10_2.inject = [Logger10];
        return App10_2;
    })();
    // classes for test 11
    var Logger11 = (function () {
        function Logger11() {
        }
        Logger11.metadata = [new auf.Transient()];
        return Logger11;
    })();
    var App11_1 = (function () {
        function App11_1(logger) {
            this.logger = logger;
        }
        App11_1.inject = [Logger11];
        return App11_1;
    })();
    var App11_2 = (function () {
        function App11_2(logger) {
            this.logger = logger;
        }
        App11_2.inject = [Logger11];
        return App11_2;
    })();
});
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
//it('configures transient (non singleton) via metadata property (ES5, AtScript, TypeScript, CoffeeScript)',() => {
//      class Logger { }
//Logger.metadata = [new Transient()];
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).not.toBe(app2.logger);
//    });
//it('configures instance via api',() => {
//      class Logger { }
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var instance = new Logger();
//container.registerInstance(Logger, instance);
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).toBe(instance);
//expect(app2.logger).toBe(instance);
//    });
//it('configures custom via api',() => {
//      class Logger { }
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//container.registerHandler(Logger, c => "something strange");
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).toEqual("something strange");
//expect(app2.logger).toEqual("something strange");
//    });
//it('uses base metadata method (ES6) when derived does not specify',() => {
//      class LoggerBase {
//    static metadata() { return [new Transient()] };
//}
//class Logger extends LoggerBase {
//}
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).not.toBe(app2.logger);
//    });
//it('uses base metadata property (ES5, AtScript, TypeScript, CoffeeScript) when derived does not specify',() => {
//      class LoggerBase { }
//LoggerBase.metadata = [new Transient()];
//class Logger extends LoggerBase {
//}
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).not.toBe(app2.logger);
//    });
//it('overrides base metadata method (ES6) with derived configuration',() => {
//      class LoggerBase {
//    static metadata() { return [new Singleton()] };
//}
//class Logger extends LoggerBase {
//    static metadata() { return [new Transient()] };
//}
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).not.toBe(app2.logger);
//    });
//it('overrides base metadata property (ES5, AtScript, TypeScript, CoffeeScript) with derived configuration',() => {
//      class LoggerBase {
//    static metadata() { return [new Singleton()] };
//}
//class Logger extends LoggerBase { }
//Logger.metadata = [new Transient()];
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).not.toBe(app2.logger);
//    });
//it('configures key as service when transient api only provided with key',() => {
//      class Logger { }
//var container = new Container();
//container.registerTransient(Logger);
//var logger1 = container.get(Logger),
//    logger2 = container.get(Logger);
//expect(logger1).toEqual(jasmine.any(Logger));
//expect(logger2).toEqual(jasmine.any(Logger));
//expect(logger2).not.toBe(logger1);
//    });
//it('configures key as service when singleton api only provided with key',() => {
//      class Logger { }
//var container = new Container();
//container.registerSingleton(Logger);
//var logger1 = container.get(Logger),
//    logger2 = container.get(Logger);
//expect(logger1).toEqual(jasmine.any(Logger));
//expect(logger2).toEqual(jasmine.any(Logger));
//expect(logger2).toBe(logger1);
//    });
//it('configures concrete singelton via api for abstract dependency',() => {
//      class LoggerBase { }
//class Logger extends LoggerBase { }
//class App {
//    static inject() { return [LoggerBase]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//container.registerSingleton(LoggerBase, Logger);
//var app = container.get(App);
//expect(app.logger).toEqual(jasmine.any(Logger));
//    });
//it('configures concrete transient via api for abstract dependency',() => {
//      class LoggerBase { }
//class Logger extends LoggerBase { }
//class App {
//    static inject() { return [LoggerBase]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//container.registerTransient(LoggerBase, Logger);
//var app = container.get(App);
//expect(app.logger).toEqual(jasmine.any(Logger));
//    });
//it('doesn\'t get hidden when a super class adds metadata which don\'t include the base registration type',() => {
//      class LoggerBase {
//    static metadata() { return [new Transient()]; };
//}
//class Logger extends LoggerBase {
//    static metadata() { return ['goofy', 'mickey']; };
//}
//class App1 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//class App2 {
//    static inject() { return [Logger]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var app2 = container.get(App2);
//expect(app1.logger).not.toBe(app2.logger);
//    });
//describe('Custom resolvers',() => {
//    describe('Lazy',() => {
//        it('provides a function which, when called, will return the instance',() => {
//          class Logger { }
//class App1 {
//    static inject() { return [Lazy.of(Logger)]; };
//    constructor(getLogger) {
//        this.getLogger = getLogger;
//    }
//}
//var container = new Container();
//var app1 = container.get(App1);
//var logger = app1.getLogger;
//expect(logger()).toEqual(jasmine.any(Logger));
//        });
//      });
//describe('All',() => {
//    it('resolves all matching dependencies as an array of instances',() => {
//          class LoggerBase { }
//class VerboseLogger extends LoggerBase { }
//class Logger extends LoggerBase { }
//class App {
//    static inject() { return [All.of(LoggerBase)]; };
//    constructor(loggers) {
//        this.loggers = loggers;
//    }
//}
//var container = new Container();
//container.registerSingleton(LoggerBase, VerboseLogger);
//container.registerTransient(LoggerBase, Logger);
//var app = container.get(App);
//expect(app.loggers).toEqual(jasmine.any(Array));
//expect(app.loggers.length).toBe(2);
//expect(app.loggers[0]).toEqual(jasmine.any(VerboseLogger));
//expect(app.loggers[1]).toEqual(jasmine.any(Logger));
//        });
//      });
//describe('Optional',() => {
//    it('injects the instance if its registered in the container',() => {
//          class Logger { }
//class App {
//    static inject() { return [Optional.of(Logger)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//container.registerSingleton(Logger, Logger);
//var app = container.get(App);
//expect(app.logger).toEqual(jasmine.any(Logger));
//        });
//it('injects null if key is not registered in the container',() => {
//          class VerboseLogger { }
//class Logger { }
//class App {
//    static inject() { return [Optional.of(Logger)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//container.registerSingleton(VerboseLogger, Logger);
//var app = container.get(App);
//expect(app.logger).toBe(null);
//        });
//it('injects null if key nor function is registered in the container',() => {
//          class VerboseLogger { }
//class Logger { }
//class App {
//    static inject() { return [Optional.of(Logger)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var app = container.get(App);
//expect(app.logger).toBe(null);
//        });
//it('doesn\'t check the parent container hierarchy when checkParent is false or default',() => {          
//          class Logger { }
//class App {
//    static inject() { return [Optional.of(Logger)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var parentContainer = new Container();
//parentContainer.registerSingleton(Logger, Logger);
//var childContainer = parentContainer.createChild();
//childContainer.registerSingleton(App, App);
//var app = childContainer.get(App);
//expect(app.logger).toBe(null);
//        });
//it('checks the parent container hierarchy when checkParent is true',() => {          
//          class Logger { }
//class App {
//    static inject() { return [Optional.of(Logger, true)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var parentContainer = new Container();
//parentContainer.registerSingleton(Logger, Logger);
//var childContainer = parentContainer.createChild();
//childContainer.registerSingleton(App, App);
//var app = childContainer.get(App);
//expect(app.logger).toEqual(jasmine.any(Logger));
//        });
//      });
//describe('Parent',() => {
//    it('bypasses the current container and injects instance from parent container',() => {
//          class Logger { }
//class App {
//    static inject() { return [Parent.of(Logger)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var parentContainer = new Container();
//var parentInstance = new Logger();
//parentContainer.registerInstance(Logger, parentInstance);
//var childContainer = parentContainer.createChild();
//var childInstance = new Logger();
//childContainer.registerInstance(Logger, childInstance);
//childContainer.registerSingleton(App, App);
//var app = childContainer.get(App);
//expect(app.logger).toBe(parentInstance);
//        });
//it('returns null when no parent container exists',() => {
//          class Logger { }
//class App {
//    static inject() { return [Parent.of(Logger)]; };
//    constructor(logger) {
//        this.logger = logger;
//    }
//}
//var container = new Container();
//var instance = new Logger();
//container.registerInstance(Logger, instance);
//var app = container.get(App);
//expect(app.logger).toBe(null);
//        });
//      });
//    });
//  });
//}); 
//# sourceMappingURL=dependency-injection-tests.js.map