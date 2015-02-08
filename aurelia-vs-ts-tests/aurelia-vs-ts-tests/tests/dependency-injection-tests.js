var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
                    it('12: configures transient (non singleton) via metadata property (ES5, AtScript, TypeScript, CoffeeScript)', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App12_1);
                        var app2 = container.get(App12_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                    it('13: configures instance via api', function () {
                        var container = new auf.Container();
                        var instance = new Logger13();
                        container.registerInstance(Logger13, instance);
                        var app1 = container.get(App13_1);
                        var app2 = container.get(App13_2);
                        expect(app1.logger).toBe(instance);
                        expect(app2.logger).toBe(instance);
                    });
                    it('14: configures custom via api', function () {
                        var container = new auf.Container();
                        container.registerHandler(Logger14, function (c) { return "something strange"; });
                        var app1 = container.get(App14_1);
                        var app2 = container.get(App14_2);
                        expect(app1.logger).toEqual("something strange");
                        expect(app2.logger).toEqual("something strange");
                    });
                    it('15: uses base metadata method (ES6) when derived does not specify', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App15_1);
                        var app2 = container.get(App15_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                    it('16: uses base metadata property (ES5, AtScript, TypeScript, CoffeeScript) when derived does not specify', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App16_1);
                        var app2 = container.get(App16_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                    it('17: overrides base metadata method (ES6) with derived configuration', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App17_1);
                        var app2 = container.get(App17_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                    it('18: overrides base metadata property (ES5, AtScript, TypeScript, CoffeeScript) with derived configuration', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App18_1);
                        var app2 = container.get(App18_2);
                        expect(app1.logger).not.toBe(app2.logger);
                    });
                    it('19: configures key as service when transient api only provided with key', function () {
                        var container = new auf.Container();
                        container.registerTransient(Logger19);
                        var logger1 = container.get(Logger19), logger2 = container.get(Logger19);
                        expect(logger1).toEqual(jasmine.any(Logger19));
                        expect(logger2).toEqual(jasmine.any(Logger19));
                        expect(logger2).not.toBe(logger1);
                    });
                    it('20: configures key as service when singleton api only provided with key', function () {
                        var container = new auf.Container();
                        container.registerSingleton(Logger20);
                        var logger1 = container.get(Logger20), logger2 = container.get(Logger20);
                        expect(logger1).toEqual(jasmine.any(Logger20));
                        expect(logger2).toEqual(jasmine.any(Logger20));
                        expect(logger2).toBe(logger1);
                    });
                    it('21: configures concrete singelton via api for abstract dependency', function () {
                        var container = new auf.Container();
                        container.registerSingleton(LoggerBase21, Logger21);
                        var app = container.get(App21);
                        expect(app.logger).toEqual(jasmine.any(Logger21));
                    });
                    it('22: configures concrete transient via api for abstract dependency', function () {
                        var container = new auf.Container();
                        container.registerTransient(LoggerBase22, Logger22);
                        var app = container.get(App22);
                        expect(app.logger).toEqual(jasmine.any(Logger22));
                    });
                    it('23: !!! TypeScript Fails !!!!  doesn\'t get hidden when a super class adds metadata which don\'t include the base registration type', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App23_1);
                        var app2 = container.get(App23_2);
                        expect(app1.logger).toBe(app2.logger);
                    });
                });
            });
            describe('Custom resolvers', function () {
                describe('Lazy', function () {
                    it('24: provides a function which, when called, will return the instance', function () {
                        var container = new auf.Container();
                        var app1 = container.get(App24_1);
                        var logger = app1.getLogger;
                        expect(logger()).toEqual(jasmine.any(Logger24));
                    });
                });
                describe('All', function () {
                    it('25: resolves all matching dependencies as an array of instances', function () {
                        var container = new auf.Container();
                        container.registerSingleton(LoggerBase25, VerboseLogger25);
                        container.registerTransient(LoggerBase25, Logger25);
                        var app = container.get(App25);
                        expect(app.loggers).toEqual(jasmine.any(Array));
                        expect(app.loggers.length).toBe(2);
                        expect(app.loggers[0]).toEqual(jasmine.any(VerboseLogger25));
                        expect(app.loggers[1]).toEqual(jasmine.any(Logger25));
                    });
                });
                describe('Optional', function () {
                    it('26: injects the instance if its registered in the container', function () {
                        var container = new auf.Container();
                        container.registerSingleton(Logger26, Logger26);
                        var app = container.get(App26);
                        expect(app.logger).toEqual(jasmine.any(Logger26));
                    });
                    it('27: injects null if key is not registered in the container', function () {
                        var container = new auf.Container();
                        container.registerSingleton(VerboseLogger27, Logger27);
                        var app = container.get(App27);
                        expect(app.logger).toBe(null);
                    });
                    it('28: injects null if key nor function is registered in the container', function () {
                        var container = new auf.Container();
                        var app = container.get(App28);
                        expect(app.logger).toBe(null);
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
    // classes for test 12
    var Logger12 = (function () {
        function Logger12() {
        }
        return Logger12;
    })();
    Logger12.metadata = [new auf.Transient()];
    var App12_1 = (function () {
        function App12_1(logger) {
            this.logger = logger;
        }
        App12_1.inject = [Logger12];
        return App12_1;
    })();
    var App12_2 = (function () {
        function App12_2(logger) {
            this.logger = logger;
        }
        App12_2.inject = [Logger12];
        return App12_2;
    })();
    // classes for test 13
    var Logger13 = (function () {
        function Logger13() {
        }
        return Logger13;
    })();
    var App13_1 = (function () {
        function App13_1(logger) {
            this.logger = logger;
        }
        App13_1.inject = [Logger13];
        return App13_1;
    })();
    var App13_2 = (function () {
        function App13_2(logger) {
            this.logger = logger;
        }
        App13_2.inject = [Logger13];
        return App13_2;
    })();
    // classes for test 14
    var Logger14 = (function () {
        function Logger14() {
        }
        return Logger14;
    })();
    var App14_1 = (function () {
        function App14_1(logger) {
            this.logger = logger;
        }
        App14_1.inject = [Logger14];
        return App14_1;
    })();
    var App14_2 = (function () {
        function App14_2(logger) {
            this.logger = logger;
        }
        App14_2.inject = [Logger14];
        return App14_2;
    })();
    // classes for test 15
    var LoggerBase15 = (function () {
        function LoggerBase15() {
        }
        LoggerBase15.metadata = [new auf.Transient()];
        return LoggerBase15;
    })();
    var Logger15 = (function (_super) {
        __extends(Logger15, _super);
        function Logger15() {
            _super.apply(this, arguments);
        }
        return Logger15;
    })(LoggerBase15);
    var App15_1 = (function () {
        function App15_1(logger) {
            this.logger = logger;
        }
        App15_1.inject = [Logger15];
        return App15_1;
    })();
    var App15_2 = (function () {
        function App15_2(logger) {
            this.logger = logger;
        }
        App15_2.inject = [Logger15];
        return App15_2;
    })();
    // classes for test 16
    var LoggerBase16 = (function () {
        function LoggerBase16() {
        }
        return LoggerBase16;
    })();
    LoggerBase16.metadata = [new auf.Transient()];
    var Logger16 = (function (_super) {
        __extends(Logger16, _super);
        function Logger16() {
            _super.apply(this, arguments);
        }
        return Logger16;
    })(LoggerBase16);
    var App16_1 = (function () {
        function App16_1(logger) {
            this.logger = logger;
        }
        App16_1.inject = [Logger16];
        return App16_1;
    })();
    var App16_2 = (function () {
        function App16_2(logger) {
            this.logger = logger;
        }
        App16_2.inject = [Logger16];
        return App16_2;
    })();
    // classes for test 17
    var LoggerBase17 = (function () {
        function LoggerBase17() {
        }
        LoggerBase17.metadata = [new auf.Singleton()];
        return LoggerBase17;
    })();
    var Logger17 = (function (_super) {
        __extends(Logger17, _super);
        function Logger17() {
            _super.apply(this, arguments);
        }
        Logger17.metadata = [new auf.Transient()];
        return Logger17;
    })(LoggerBase17);
    var App17_1 = (function () {
        function App17_1(logger) {
            this.logger = logger;
        }
        App17_1.inject = [Logger17];
        return App17_1;
    })();
    var App17_2 = (function () {
        function App17_2(logger) {
            this.logger = logger;
        }
        App17_2.inject = [Logger17];
        return App17_2;
    })();
    // classes for test 18
    var LoggerBase18 = (function () {
        function LoggerBase18() {
        }
        LoggerBase18.metadata = [new auf.Singleton()];
        return LoggerBase18;
    })();
    var Logger18 = (function (_super) {
        __extends(Logger18, _super);
        function Logger18() {
            _super.apply(this, arguments);
        }
        return Logger18;
    })(LoggerBase18);
    Logger18.metadata = [new auf.Transient()];
    var App18_1 = (function () {
        function App18_1(logger) {
            this.logger = logger;
        }
        App18_1.inject = [Logger18];
        return App18_1;
    })();
    var App18_2 = (function () {
        function App18_2(logger) {
            this.logger = logger;
        }
        App18_2.inject = [Logger18];
        return App18_2;
    })();
    // classes for test 19
    var Logger19 = (function () {
        function Logger19() {
        }
        return Logger19;
    })();
    // classes for test 20
    var Logger20 = (function () {
        function Logger20() {
        }
        return Logger20;
    })();
    // classes for test 21
    var LoggerBase21 = (function () {
        function LoggerBase21() {
        }
        return LoggerBase21;
    })();
    var Logger21 = (function (_super) {
        __extends(Logger21, _super);
        function Logger21() {
            _super.apply(this, arguments);
        }
        return Logger21;
    })(LoggerBase21);
    var App21 = (function () {
        function App21(logger) {
            this.logger = logger;
        }
        App21.inject = [LoggerBase21];
        return App21;
    })();
    // classes for test 22
    var LoggerBase22 = (function () {
        function LoggerBase22() {
        }
        return LoggerBase22;
    })();
    var Logger22 = (function (_super) {
        __extends(Logger22, _super);
        function Logger22() {
            _super.apply(this, arguments);
        }
        return Logger22;
    })(LoggerBase22);
    var App22 = (function () {
        function App22(logger) {
            this.logger = logger;
        }
        App22.inject = [LoggerBase22];
        return App22;
    })();
    // classes for test 23
    var LoggerBase23 = (function () {
        function LoggerBase23() {
        }
        LoggerBase23.metadata = [new auf.Transient()];
        return LoggerBase23;
    })();
    var Logger23 = (function (_super) {
        __extends(Logger23, _super);
        function Logger23() {
            _super.apply(this, arguments);
        }
        Logger23.metadata = ['goofy', 'mickey'];
        return Logger23;
    })(LoggerBase23);
    var App23_1 = (function () {
        function App23_1(logger) {
            this.logger = logger;
        }
        App23_1.inject = [Logger23];
        return App23_1;
    })();
    var App23_2 = (function () {
        function App23_2(logger) {
            this.logger = logger;
        }
        App23_2.inject = [Logger23];
        return App23_2;
    })();
    // classes for test 24
    var Logger24 = (function () {
        function Logger24() {
        }
        return Logger24;
    })();
    var App24_1 = (function () {
        function App24_1(getLogger) {
            this.getLogger = getLogger;
        }
        App24_1.inject = [auf.Lazy.of(Logger24)];
        return App24_1;
    })();
    // classes for test 25
    var LoggerBase25 = (function () {
        function LoggerBase25() {
        }
        return LoggerBase25;
    })();
    var VerboseLogger25 = (function (_super) {
        __extends(VerboseLogger25, _super);
        function VerboseLogger25() {
            _super.apply(this, arguments);
        }
        return VerboseLogger25;
    })(LoggerBase25);
    var Logger25 = (function (_super) {
        __extends(Logger25, _super);
        function Logger25() {
            _super.apply(this, arguments);
        }
        return Logger25;
    })(LoggerBase25);
    var App25 = (function () {
        function App25(loggers) {
            this.loggers = loggers;
        }
        App25.inject = [auf.All.of(LoggerBase25)];
        return App25;
    })();
    // classes for test 26
    var Logger26 = (function () {
        function Logger26() {
        }
        return Logger26;
    })();
    var App26 = (function () {
        function App26(logger) {
            this.logger = logger;
        }
        App26.inject = [auf.Optional.of(Logger26)];
        return App26;
    })();
    // classes for test 27
    var VerboseLogger27 = (function () {
        function VerboseLogger27() {
        }
        return VerboseLogger27;
    })();
    var Logger27 = (function () {
        function Logger27() {
        }
        return Logger27;
    })();
    var App27 = (function () {
        function App27(logger) {
            this.logger = logger;
        }
        App27.inject = [auf.Optional.of(Logger27)];
        return App27;
    })();
    // classes for test 28
    var VerboseLogger28 = (function () {
        function VerboseLogger28() {
        }
        return VerboseLogger28;
    })();
    var Logger28 = (function () {
        function Logger28() {
        }
        return Logger28;
    })();
    var App28 = (function () {
        function App28(logger) {
            this.logger = logger;
        }
        App28.inject = [auf.Optional.of(Logger28)];
        return App28;
    })();
});
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
//# sourceMappingURL=dependency-injection-tests.js.map