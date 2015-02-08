import auf = require("aurelia-framework");

export var run = () => {
    describe("dependency injection",() => {
        describe("container",() => {
            describe("injection",() => {
                it("01: instantiates class without injected services",() => {
                    var container = new auf.Container();
                    var app = container.get(App01);

                    expect(app).toEqual(jasmine.any(App01));
                });

                it('02: uses static inject property (TypeScript)', function () {
                    var container = new auf.Container();
                    var app = <App02>container.get(App02);

                    expect(app.logger).toEqual(jasmine.any(Logger02));
                });

                it('03: uses static inject property (TypeScript,CoffeeScript,ES5)', function () {
                    App03.inject = [Logger03];

                    var container = new auf.Container();
                    var app = <App03>container.get(App03);

                    expect(app.logger).toEqual(jasmine.any(Logger03));
                });

                it('04: uses static parameters property (AtScript)', function () {
                    App04.parameters = [{ is: Logger04 }]; //Note: Normally provided by the AtScript compiler.

                    var container = new auf.Container();
                    container.supportAtScript();

                    var app = <App04>container.get(App04);

                    expect(app.logger).toEqual(jasmine.any(Logger04));
                });
                it('05: uses static parameters property as array (AtScript)', function () {
                    App05.parameters = [[Logger05]]; //Note: Normally provided by the AtScript compiler.

                    var container = new auf.Container();
                    container.supportAtScript();

                    var app = <App05>container.get(App05);

                    expect(app.logger).toEqual(jasmine.any(Logger05));
                });
            });
            describe('registration',() => {
                it('06: automatically configures as singleton',() => {
                    var container = new auf.Container();
                    var app1 = <App06_1>container.get(App06_1);
                    var app2 = <App06_2>container.get(App06_2);

                    expect(app1.logger).toBe(app2.logger);
                });
            });
        });
    });
}


// classes for test 01
class App01 { }

// classes for test 02
class Logger02 { }

class App02 {
    static inject = [Logger02];
    constructor(public logger) { }
}

// classes for test 03
class Logger03 { }

class App03 {
    static inject;
    constructor(public logger) { }
}

// classes for test 04
class Logger04 { }

class App04 {
    static parameters;
    constructor(public logger) { }
}

// classes for test 05
class Logger05 { }

class App05 {
    static parameters;
    constructor(public logger) { }
}

// classes for test 06
class Logger06 { }

class App06_1 {
    static inject = [Logger06];
    constructor(public logger) { }
}

class App06_2 {
    static inject = [Logger06];
    constructor(public logger) { }
}



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
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01








//it('configures singleton via api',() => {
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
//container.registerSingleton(Logger, Logger);

//var app1 = container.get(App1);
//var app2 = container.get(App2);

//expect(app1.logger).toBe(app2.logger);
//    });

//it('configures singleton via metadata method (ES6)',() => {
//      class Logger {
//    static metadata() { return [new Singleton()] };
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

//expect(app1.logger).toBe(app2.logger);
//    });

//it('configures singleton via metadata property (ES5, AtScript, TypeScript, CoffeeScript)',() => {
//      class Logger { }
//Logger.metadata = [new Singleton()];

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

//expect(app1.logger).toBe(app2.logger);
//    });

//it('configures transient (non singleton) via api',() => {
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
//container.registerTransient(Logger, Logger);

//var app1 = container.get(App1);
//var app2 = container.get(App2);

//expect(app1.logger).not.toBe(app2.logger);
//    });

//it('configures transient (non singleton) via metadata method (ES6)',() => {
//      class Logger {
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