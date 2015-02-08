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
                it('07: configures singleton via api',() => {
                    var container = new auf.Container();
                    container.registerSingleton(Logger07, Logger07);

                    var app1 = <App07_1>container.get(App07_1);
                    var app2 = <App07_2>container.get(App07_2);

                    expect(app1.logger).toBe(app2.logger);
                });
                it('08: configures singleton via metadata method (ES6)',() => {
                    var container = new auf.Container();
                    var app1 = <App08_1>container.get(App08_1);
                    var app2 = <App08_1>container.get(App08_2);

                    expect(app1.logger).toBe(app2.logger);
                });
                it('09: configures singleton via metadata property (ES5, AtScript, TypeScript, CoffeeScript)',() => {
                    var container = new auf.Container();
                    var app1 = <App09_1>container.get(App09_1);
                    var app2 = <App09_2>container.get(App09_2);

                    expect(app1.logger).toBe(app2.logger);
                });
                it('10: configures transient (non singleton) via api',() => {
                    var container = new auf.Container();
                    container.registerTransient(Logger10, Logger10);

                    var app1 = <App10_1>container.get(App10_1);
                    var app2 = <App10_2>container.get(App10_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('11: configures transient (non singleton) via metadata method (ES6)',() => {
                    var container = new auf.Container();
                    var app1 = <App11_1>container.get(App11_1);
                    var app2 = <App11_2>container.get(App11_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('12: configures transient (non singleton) via metadata property (ES5, AtScript, TypeScript, CoffeeScript)',() => {
                    var container = new auf.Container();
                    var app1 = <App12_1>container.get(App12_1);
                    var app2 = <App12_2>container.get(App12_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('13: configures instance via api',() => {
                    var container = new auf.Container();
                    var instance = new Logger13();
                    container.registerInstance(Logger13, instance);

                    var app1 = <App13_1>container.get(App13_1);
                    var app2 = <App13_2>container.get(App13_2);

                    expect(app1.logger).toBe(instance);
                    expect(app2.logger).toBe(instance);
                });
                it('14: configures custom via api',() => {
                    var container = new auf.Container();
                    container.registerHandler(Logger14, c => "something strange");

                    var app1 = <App14_1>container.get(App14_1);
                    var app2 = <App14_2>container.get(App14_2);

                    expect(app1.logger).toEqual("something strange");
                    expect(app2.logger).toEqual("something strange");
                });
                it('15: uses base metadata method (ES6) when derived does not specify',() => {
                    var container = new auf.Container();
                    var app1 = <App15_1>container.get(App15_1);
                    var app2 = <App15_2>container.get(App15_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('16: uses base metadata property (ES5, AtScript, TypeScript, CoffeeScript) when derived does not specify',() => {
                    var container = new auf.Container();
                    var app1 = <App16_1>container.get(App16_1);
                    var app2 = <App16_2>container.get(App16_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('17: overrides base metadata method (ES6) with derived configuration',() => {
                    var container = new auf.Container();
                    var app1 = <App17_1>container.get(App17_1);
                    var app2 = <App17_2>container.get(App17_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('18: overrides base metadata property (ES5, AtScript, TypeScript, CoffeeScript) with derived configuration',() => {
                    var container = new auf.Container();
                    var app1 = <App18_1>container.get(App18_1);
                    var app2 = <App18_2>container.get(App18_2);

                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('19: configures key as service when transient api only provided with key',() => {
                    var container = new auf.Container();
                    container.registerTransient(Logger19);

                    var logger1 = container.get(Logger19),
                        logger2 = container.get(Logger19);

                    expect(logger1).toEqual(jasmine.any(Logger19));
                    expect(logger2).toEqual(jasmine.any(Logger19));
                    expect(logger2).not.toBe(logger1);
                });
                it('20: configures key as service when singleton api only provided with key',() => {
                    var container = new auf.Container();
                    container.registerSingleton(Logger20);

                    var logger1 = container.get(Logger20),
                        logger2 = container.get(Logger20);

                    expect(logger1).toEqual(jasmine.any(Logger20));
                    expect(logger2).toEqual(jasmine.any(Logger20));
                    expect(logger2).toBe(logger1);
                });
                it('21: configures concrete singelton via api for abstract dependency',() => {
                    var container = new auf.Container();
                    container.registerSingleton(LoggerBase21, Logger21);

                    var app = <App21>container.get(App21);

                    expect(app.logger).toEqual(jasmine.any(Logger21));
                });
                it('22: configures concrete transient via api for abstract dependency',() => {
                    var container = new auf.Container();
                    container.registerTransient(LoggerBase22, Logger22);

                    var app = <App22>container.get(App22);

                    expect(app.logger).toEqual(jasmine.any(Logger22));
                });
                it('23: !!! TypeScript Fails !!!!  doesn\'t get hidden when a super class adds metadata which don\'t include the base registration type',() => {
                    var container = new auf.Container();
                    var app1 = <App23_1>container.get(App23_1);
                    var app2 = <App23_2>container.get(App23_2);

                    expect(app1.logger).toBe(app2.logger);
                });
            });
        });
        describe('Custom resolvers',() => {
            describe('Lazy',() => {
                it('24: provides a function which, when called, will return the instance',() => {
                    var container = new auf.Container();
                    var app1 = <App24_1>container.get(App24_1);

                    var logger = app1.getLogger;

                    expect(logger()).toEqual(jasmine.any(Logger24));
                });
            });
            describe('All',() => {
                it('25: resolves all matching dependencies as an array of instances',() => {
                    var container = new auf.Container();
                    container.registerSingleton(LoggerBase25, VerboseLogger25);
                    container.registerTransient(LoggerBase25, Logger25);
                    var app = <App25>container.get(App25);

                    expect(app.loggers).toEqual(jasmine.any(Array));
                    expect(app.loggers.length).toBe(2);
                    expect(app.loggers[0]).toEqual(jasmine.any(VerboseLogger25));
                    expect(app.loggers[1]).toEqual(jasmine.any(Logger25));
                });
            });
            describe('Optional',() => {
                it('26: injects the instance if its registered in the container',() => {
                    var container = new auf.Container();
                    container.registerSingleton(Logger26, Logger26);
                    var app = <App26>container.get(App26);

                    expect(app.logger).toEqual(jasmine.any(Logger26));
                });
                it('27: injects null if key is not registered in the container',() => {
                    var container = new auf.Container();
                    container.registerSingleton(VerboseLogger27, Logger27);
                    var app = <App27>container.get(App27);

                    expect(app.logger).toBe(null);
                });
                it('28: injects null if key nor function is registered in the container',() => {
                    var container = new auf.Container();
                    var app = <App28>container.get(App28);

                    expect(app.logger).toBe(null);
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

// classes for test 07
class Logger07 { }

class App07_1 {
    static inject = [Logger07];
    constructor(public logger) { }
}

class App07_2 {
    static inject = [Logger07];
    constructor(public logger) { }
}

// classes for test 08
class Logger08 {
    static metadata = [new auf.Singleton()];
}

class App08_1 {
    static inject = [Logger08];
    constructor(public logger) { }
}

class App08_2 {
    static inject = [Logger08];
    constructor(public logger) { }
}

// classes for test 09
class Logger09 {
    static metadata;
}
Logger09.metadata = [new auf.Singleton()];

class App09_1 {
    static inject = [Logger09];
    constructor(public logger) { }
}

class App09_2 {
    static inject = [Logger09];
    constructor(public logger) { }
}

// classes for test 10
class Logger10 { }

class App10_1 {
    static inject = [Logger10];
    constructor(public logger) { }
}

class App10_2 {
    static inject = [Logger10];
    constructor(public logger) { }
}

// classes for test 11
class Logger11 {
    static metadata = [new auf.Transient()];
}

class App11_1 {
    static inject = [Logger11];
    constructor(public logger) { }
}

class App11_2 {
    static inject = [Logger11];
    constructor(public logger) { }
}

// classes for test 12
class Logger12 {
    static metadata;
}
Logger12.metadata = [new auf.Transient()];

class App12_1 {
    static inject = [Logger12];
    constructor(public logger) { }
}

class App12_2 {
    static inject = [Logger12];
    constructor(public logger) { }
}


// classes for test 13
class Logger13 { }

class App13_1 {
    static inject = [Logger13];
    constructor(public logger) { }
}

class App13_2 {
    static inject = [Logger13];
    constructor(public logger) { }
}

// classes for test 14
class Logger14 { }

class App14_1 {
    static inject = [Logger14];
    constructor(public logger) { }
}

class App14_2 {
    static inject = [Logger14];
    constructor(public logger) { }
}

// classes for test 15
class LoggerBase15 {
    static metadata = [new auf.Transient()];
}

class Logger15 extends LoggerBase15 { }

class App15_1 {
    static inject = [Logger15];
    constructor(public logger) { }
}

class App15_2 {
    static inject = [Logger15];
    constructor(public logger) { }
}

// classes for test 16
class LoggerBase16 {
    static metadata;
}
LoggerBase16.metadata = [new auf.Transient()];

class Logger16 extends LoggerBase16 { }

class App16_1 {
    static inject = [Logger16];
    constructor(public logger) { }
}

class App16_2 {
    static inject = [Logger16];
    constructor(public logger) { }
}

// classes for test 17
class LoggerBase17 {
    static metadata = [new auf.Singleton()];
}

class Logger17 extends LoggerBase17 {
    static metadata = [new auf.Transient()];
}

class App17_1 {
    static inject = [Logger17];
    constructor(public logger) { }
}

class App17_2 {
    static inject = [Logger17];
    constructor(public logger) { }
}

// classes for test 18
class LoggerBase18 {
    static metadata = [new auf.Singleton()];
}

class Logger18 extends LoggerBase18 { }
Logger18.metadata = [new auf.Transient()];

class App18_1 {
    static inject = [Logger18];
    constructor(public logger) { }
}

class App18_2 {
    static inject = [Logger18];
    constructor(public logger) { }
}


// classes for test 19
class Logger19 { }

// classes for test 20
class Logger20 { }

// classes for test 21
class LoggerBase21 { }
class Logger21 extends LoggerBase21 { }

class App21 {
    static inject = [LoggerBase21];
    constructor(public logger) { }
}

// classes for test 22
class LoggerBase22 { }
class Logger22 extends LoggerBase22 { }

class App22 {
    static inject = [LoggerBase22];
    constructor(public logger) { }
}

// classes for test 23
class LoggerBase23 {
    static metadata = [new auf.Transient()];
}

class Logger23 extends LoggerBase23 {
    static metadata = ['goofy', 'mickey'];
}

class App23_1 {
    static inject = [Logger23];
    constructor(public logger) { }
}

class App23_2 {
    static inject = [Logger23];
    constructor(public logger) { }
}


// classes for test 24
class Logger24 { }

class App24_1 {
    static inject = [auf.Lazy.of(Logger24)];
    constructor(public getLogger) { }
}

// classes for test 25
class LoggerBase25 { }

class VerboseLogger25 extends LoggerBase25 { }

class Logger25 extends LoggerBase25 { }

class App25 {
    static inject = [auf.All.of(LoggerBase25)];
    constructor(public loggers) { }
}


// classes for test 26
class Logger26 { }

class App26 {
    static inject = [auf.Optional.of(Logger26)];
    constructor(public logger) { }
}

// classes for test 27
class VerboseLogger27 { }
class Logger27 { }

class App27 {
    static inject = [auf.Optional.of(Logger27)];
    constructor(public logger) { }
}

// classes for test 28
class VerboseLogger28 { }
class Logger28 { }

class App28 {
    static inject = [auf.Optional.of(Logger28)];
    constructor(public logger) { }
}

// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01
// classes for test 01

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