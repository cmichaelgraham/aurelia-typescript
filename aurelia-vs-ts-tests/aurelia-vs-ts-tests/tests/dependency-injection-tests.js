var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'aurelia-dependency-injection', 'aurelia-metadata'], function (require, exports, aurelia_dependency_injection_1, aurelia_metadata_1) {
    exports.run = function () {
        describe('container', function () {
            describe('injection', function () {
                it('01: instantiates class without injected services', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app = container.get(App_01);
                    expect(app).toEqual(jasmine.any(App_01));
                });
                it('02: uses static inject method (ES6)', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app = container.get(App_02);
                    expect(app.logger).toEqual(jasmine.any(Logger_02));
                });
                it('03: uses static inject property (TypeScript,CoffeeScript,ES5)', function () {
                    App_03.inject = [Logger_03];
                    var container = new aurelia_dependency_injection_1.Container();
                    var app = container.get(App_03);
                    expect(app.logger).toEqual(jasmine.any(Logger_03));
                });
            });
            describe('registration', function () {
                it('04: asserts keys are defined', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    expect(function () { return container.get(null); }).toThrow();
                    expect(function () { return container.get(undefined); }).toThrow();
                    expect(function () { return container.get(null); }).toThrow();
                    expect(function () { return container.get(undefined); }).toThrow();
                    expect(function () { return container.registerInstance(null, {}); }).toThrow();
                    expect(function () { return container.registerInstance(undefined, {}); }).toThrow();
                    expect(function () { return container.registerSingleton(null); }).toThrow();
                    expect(function () { return container.registerSingleton(undefined); }).toThrow();
                    expect(function () { return container.registerTransient(null); }).toThrow();
                    expect(function () { return container.registerTransient(undefined); }).toThrow();
                    expect(function () { return container.autoRegister(null); }).toThrow();
                    expect(function () { return container.autoRegister(undefined); }).toThrow();
                    expect(function () { return container.autoRegisterAll([null]); }).toThrow();
                    expect(function () { return container.autoRegisterAll([undefined]); }).toThrow();
                    expect(function () { return container.registerHandler(null, null); }).toThrow();
                    expect(function () { return container.registerHandler(undefined, null); }).toThrow();
                    expect(function () { return container.hasHandler(null); }).toThrow();
                    expect(function () { return container.hasHandler(undefined); }).toThrow();
                });
                it('05: automatically configures as singleton', function () {
                    aurelia_dependency_injection_1.inject(Logger_05)(App1_05);
                    aurelia_dependency_injection_1.inject(Logger_05)(App2_05);
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_05);
                    var app2 = container.get(App2_05);
                    expect(app1.logger).toBe(app2.logger);
                });
                it('06: configures singleton via api', function () {
                    aurelia_dependency_injection_1.inject(Logger_06)(App1_06);
                    aurelia_dependency_injection_1.inject(Logger_06)(App2_06);
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerSingleton(Logger_06, Logger_06);
                    var app1 = container.get(App1_06);
                    var app2 = container.get(App2_06);
                    expect(app1.logger).toBe(app2.logger);
                });
                it('07: configures singleton via metadata method (ES6)', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_07);
                    var app2 = container.get(App2_07);
                    expect(app1.logger).toBe(app2.logger);
                });
                it('08: configures singleton via metadata property (ES5, AtScript, TypeScript, CoffeeScript)', function () {
                    Logger_08.decorators = aurelia_metadata_1.Decorators.singleton();
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_08);
                    var app2 = container.get(App2_08);
                    expect(app1.logger).toBe(app2.logger);
                });
                it('09: configures transient (non singleton) via api', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerTransient(Logger_09, Logger_09);
                    var app1 = container.get(App1_09);
                    var app2 = container.get(App2_09);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('10: configures transient (non singleton) via metadata method (ES6)', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_10);
                    var app2 = container.get(App2_10);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('11: configures transient (non singleton) via metadata property (ES5, ES7, TypeScript, CoffeeScript)', function () {
                    Logger_11.decorators = aurelia_metadata_1.Decorators.transient();
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_11);
                    var app2 = container.get(App2_11);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('12: configures instance via api', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var instance = new Logger_12();
                    container.registerInstance(Logger_12, instance);
                    var app1 = container.get(App1_12);
                    var app2 = container.get(App2_12);
                    expect(app1.logger).toBe(instance);
                    expect(app2.logger).toBe(instance);
                });
                it('13: configures custom via api', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerHandler(Logger_13, function (c) { return "something strange"; });
                    var app1 = container.get(App1_13);
                    var app2 = container.get(App2_13);
                    expect(app1.logger).toEqual("something strange");
                    expect(app2.logger).toEqual("something strange");
                });
                it('14: uses base metadata method (ES6) when derived does not specify', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_14);
                    var app2 = container.get(App2_14);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('15: uses base metadata property (ES5, ES7, TypeScript, CoffeeScript) when derived does not specify', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_15);
                    var app2 = container.get(App2_15);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('16: overrides base metadata method (ES6) with derived configuration', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_16);
                    var app2 = container.get(App2_16);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('17: overrides base metadata property (ES5, ES7, TypeScript, CoffeeScript) with derived configuration', function () {
                    Logger_17.decorators = aurelia_metadata_1.Decorators.transient();
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1);
                    var app2 = container.get(App2_17);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                it('18: configures key as service when transient api only provided with key', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerTransient(Logger_18);
                    var logger1 = container.get(Logger_18), logger2 = container.get(Logger_18);
                    expect(logger1).toEqual(jasmine.any(Logger_18));
                    expect(logger2).toEqual(jasmine.any(Logger_18));
                    expect(logger2).not.toBe(logger1);
                });
                it('19: configures key as service when singleton api only provided with key', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerSingleton(Logger_19);
                    var logger1 = container.get(Logger_19), logger2 = container.get(Logger_19);
                    expect(logger1).toEqual(jasmine.any(Logger_19));
                    expect(logger2).toEqual(jasmine.any(Logger_19));
                    expect(logger2).toBe(logger1);
                });
                it('20: configures concrete singelton via api for abstract dependency', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerSingleton(LoggerBase_20, Logger_20);
                    var app = container.get(App_20);
                    expect(app.logger).toEqual(jasmine.any(Logger_20));
                });
                it('21: configures concrete transient via api for abstract dependency', function () {
                    var container = new aurelia_dependency_injection_1.Container();
                    container.registerTransient(LoggerBase_21, Logger_21);
                    var app = container.get(App_21);
                    expect(app.logger).toEqual(jasmine.any(Logger_21));
                });
                it('22: doesn\'t get hidden when a super class adds metadata which doesn\'t include the base registration type', function () {
                    Reflect.defineMetadata('something', 'test', Logger_22);
                    var container = new aurelia_dependency_injection_1.Container();
                    var app1 = container.get(App1_22);
                    var app2 = container.get(App2_22);
                    expect(app1.logger).not.toBe(app2.logger);
                });
                describe('Custom resolvers', function () {
                    describe('Lazy', function () {
                        it('23: provides a function which, when called, will return the instance', function () {
                            var container = new aurelia_dependency_injection_1.Container();
                            var app1 = container.get(App1_23);
                            var logger = app1.getLogger;
                            expect(logger()).toEqual(jasmine.any(Logger_23));
                        });
                    });
                    describe('All', function () {
                        it('24: resolves all matching dependencies as an array of instances', function () {
                            var container = new aurelia_dependency_injection_1.Container();
                            container.registerSingleton(LoggerBase_24, VerboseLogger_24);
                            container.registerTransient(LoggerBase_24, Logger_24);
                            var app = container.get(App_24);
                            expect(app.loggers).toEqual(jasmine.any(Array));
                            expect(app.loggers.length).toBe(2);
                            expect(app.loggers[0]).toEqual(jasmine.any(VerboseLogger_24));
                            expect(app.loggers[1]).toEqual(jasmine.any(Logger_24));
                        });
                    });
                    describe('Optional', function () {
                        it('25: injects the instance if its registered in the container', function () {
                            var container = new aurelia_dependency_injection_1.Container();
                            container.registerSingleton(Logger_25, Logger_25);
                            var app = container.get(App_25);
                            expect(app.logger).toEqual(jasmine.any(Logger_25));
                        });
                        it('26: injects null if key is not registered in the container', function () {
                            var container = new aurelia_dependency_injection_1.Container();
                            container.registerSingleton(VerboseLogger_26, Logger_26);
                            var app = container.get(App_26);
                            expect(app.logger).toBe(null);
                        });
                        it('27: injects null if key nor function is registered in the container', function () {
                            var container = new aurelia_dependency_injection_1.Container();
                            var app = container.get(App_27);
                            expect(app.logger).toBe(null);
                        });
                        it('28: doesn\'t check the parent container hierarchy when checkParent is false or default', function () {
                            var parentContainer = new aurelia_dependency_injection_1.Container();
                            parentContainer.registerSingleton(Logger_28, Logger_28);
                            var childContainer = parentContainer.createChild();
                            childContainer.registerSingleton(App_28, App_28);
                            var app = childContainer.get(App_28);
                            expect(app.logger).toBe(null);
                        });
                        it('29: checks the parent container hierarchy when checkParent is true', function () {
                            var parentContainer = new aurelia_dependency_injection_1.Container();
                            parentContainer.registerSingleton(Logger_29, Logger_29);
                            var childContainer = parentContainer.createChild();
                            childContainer.registerSingleton(App_29, App_29);
                            var app = childContainer.get(App_29);
                            expect(app.logger).toEqual(jasmine.any(Logger_29));
                        });
                    });
                    describe('Parent', function () {
                        it('30: bypasses the current container and injects instance from parent container', function () {
                            var parentContainer = new aurelia_dependency_injection_1.Container();
                            var parentInstance = new Logger_30();
                            parentContainer.registerInstance(Logger_30, parentInstance);
                            var childContainer = parentContainer.createChild();
                            var childInstance = new Logger_30();
                            childContainer.registerInstance(Logger_30, childInstance);
                            childContainer.registerSingleton(App_30, App_30);
                            var app = childContainer.get(App_30);
                            expect(app.logger).toBe(parentInstance);
                        });
                        it('31: returns null when no parent container exists', function () {
                            var container = new aurelia_dependency_injection_1.Container();
                            var instance = new Logger_31();
                            container.registerInstance(Logger_31, instance);
                            var app = container.get(App_31);
                            expect(app.logger).toBe(null);
                        });
                    });
                });
            });
        });
    };
    // 01 ------------------------------------------------------------------
    var App_01 = (function () {
        function App_01() {
        }
        return App_01;
    })();
    // 02 ------------------------------------------------------------------
    var Logger_02 = (function () {
        function Logger_02() {
        }
        return Logger_02;
    })();
    var App_02 = (function () {
        function App_02(logger) {
            this.logger = logger;
        }
        App_02.inject = function () { return [Logger_02]; };
        ;
        return App_02;
    })();
    // 03 ------------------------------------------------------------------
    var Logger_03 = (function () {
        function Logger_03() {
        }
        return Logger_03;
    })();
    var App_03 = (function () {
        function App_03(logger) {
            this.logger = logger;
        }
        return App_03;
    })();
    // 04 ------------------------------------------------------------------
    // 05 ------------------------------------------------------------------
    var Logger_05 = (function () {
        function Logger_05() {
        }
        return Logger_05;
    })();
    var App1_05 = (function () {
        function App1_05(logger) {
            this.logger = logger;
        }
        return App1_05;
    })();
    var App2_05 = (function () {
        function App2_05(logger) {
            this.logger = logger;
        }
        return App2_05;
    })();
    // 06 ------------------------------------------------------------------
    var Logger_06 = (function () {
        function Logger_06() {
        }
        return Logger_06;
    })();
    var App1_06 = (function () {
        function App1_06(logger) {
            this.logger = logger;
        }
        return App1_06;
    })();
    var App2_06 = (function () {
        function App2_06(logger) {
            this.logger = logger;
        }
        return App2_06;
    })();
    // 07 ------------------------------------------------------------------
    var Logger_07 = (function () {
        function Logger_07() {
        }
        Logger_07.decorators = function () { return aurelia_metadata_1.Decorators.singleton(); };
        ;
        return Logger_07;
    })();
    var App1_07 = (function () {
        function App1_07(logger) {
            this.logger = logger;
        }
        App1_07.inject = function () { return [Logger_07]; };
        ;
        return App1_07;
    })();
    var App2_07 = (function () {
        function App2_07(logger) {
            this.logger = logger;
        }
        App2_07.inject = function () { return [Logger_07]; };
        ;
        return App2_07;
    })();
    // 08 ------------------------------------------------------------------
    var Logger_08 = (function () {
        function Logger_08() {
        }
        return Logger_08;
    })();
    var App1_08 = (function () {
        function App1_08(logger) {
            this.logger = logger;
        }
        App1_08.inject = function () { return [Logger_08]; };
        ;
        return App1_08;
    })();
    var App2_08 = (function () {
        function App2_08(logger) {
            this.logger = logger;
        }
        App2_08.inject = function () { return [Logger_08]; };
        ;
        return App2_08;
    })();
    // 09 ------------------------------------------------------------------
    var Logger_09 = (function () {
        function Logger_09() {
        }
        return Logger_09;
    })();
    var App1_09 = (function () {
        function App1_09(logger) {
            this.logger = logger;
        }
        App1_09.inject = function () { return [Logger_09]; };
        ;
        return App1_09;
    })();
    var App2_09 = (function () {
        function App2_09(logger) {
            this.logger = logger;
        }
        App2_09.inject = function () { return [Logger_09]; };
        ;
        return App2_09;
    })();
    // 10 ------------------------------------------------------------------
    var Logger_10 = (function () {
        function Logger_10() {
        }
        Logger_10.decorators = function () { return aurelia_metadata_1.Decorators.transient(); };
        ;
        return Logger_10;
    })();
    var App1_10 = (function () {
        function App1_10(logger) {
            this.logger = logger;
        }
        App1_10.inject = function () { return [Logger_10]; };
        ;
        return App1_10;
    })();
    var App2_10 = (function () {
        function App2_10(logger) {
            this.logger = logger;
        }
        App2_10.inject = function () { return [Logger_10]; };
        ;
        return App2_10;
    })();
    // 11 ------------------------------------------------------------------
    var Logger_11 = (function () {
        function Logger_11() {
        }
        return Logger_11;
    })();
    var App1_11 = (function () {
        function App1_11(logger) {
            this.logger = logger;
        }
        App1_11.inject = function () { return [Logger_11]; };
        ;
        return App1_11;
    })();
    var App2_11 = (function () {
        function App2_11(logger) {
            this.logger = logger;
        }
        App2_11.inject = function () { return [Logger_11]; };
        ;
        return App2_11;
    })();
    // 12 ------------------------------------------------------------------
    var Logger_12 = (function () {
        function Logger_12() {
        }
        return Logger_12;
    })();
    var App1_12 = (function () {
        function App1_12(logger) {
            this.logger = logger;
        }
        App1_12.inject = function () { return [Logger_12]; };
        ;
        return App1_12;
    })();
    var App2_12 = (function () {
        function App2_12(logger) {
            this.logger = logger;
        }
        App2_12.inject = function () { return [Logger_12]; };
        ;
        return App2_12;
    })();
    // 13 ------------------------------------------------------------------
    var Logger_13 = (function () {
        function Logger_13() {
        }
        return Logger_13;
    })();
    var App1_13 = (function () {
        function App1_13(logger) {
            this.logger = logger;
        }
        App1_13.inject = function () { return [Logger_13]; };
        ;
        return App1_13;
    })();
    var App2_13 = (function () {
        function App2_13(logger) {
            this.logger = logger;
        }
        App2_13.inject = function () { return [Logger_13]; };
        ;
        return App2_13;
    })();
    // 14 ------------------------------------------------------------------
    var LoggerBase_14 = (function () {
        function LoggerBase_14() {
        }
        LoggerBase_14.decorators = function () { return aurelia_metadata_1.Decorators.transient(); };
        ;
        return LoggerBase_14;
    })();
    var Logger_14 = (function (_super) {
        __extends(Logger_14, _super);
        function Logger_14() {
            _super.apply(this, arguments);
        }
        return Logger_14;
    })(LoggerBase_14);
    var App1_14 = (function () {
        function App1_14(logger) {
            this.logger = logger;
        }
        App1_14.inject = function () { return [Logger_14]; };
        ;
        return App1_14;
    })();
    var App2_14 = (function () {
        function App2_14(logger) {
            this.logger = logger;
        }
        App2_14.inject = function () { return [Logger_14]; };
        ;
        return App2_14;
    })();
    // 15 ------------------------------------------------------------------
    var LoggerBase_15 = (function () {
        function LoggerBase_15() {
        }
        return LoggerBase_15;
    })();
    LoggerBase_15.decorators = aurelia_metadata_1.Decorators.transient();
    var Logger_15 = (function (_super) {
        __extends(Logger_15, _super);
        function Logger_15() {
            _super.apply(this, arguments);
        }
        return Logger_15;
    })(LoggerBase_15);
    var App1_15 = (function () {
        function App1_15(logger) {
            this.logger = logger;
        }
        App1_15.inject = function () { return [Logger_15]; };
        ;
        return App1_15;
    })();
    var App2_15 = (function () {
        function App2_15(logger) {
            this.logger = logger;
        }
        App2_15.inject = function () { return [Logger_15]; };
        ;
        return App2_15;
    })();
    // 16 ------------------------------------------------------------------
    var LoggerBase_16 = (function () {
        function LoggerBase_16() {
        }
        LoggerBase_16.decorators = function () { return aurelia_metadata_1.Decorators.singleton(); };
        ;
        return LoggerBase_16;
    })();
    var Logger_16 = (function (_super) {
        __extends(Logger_16, _super);
        function Logger_16() {
            _super.apply(this, arguments);
        }
        Logger_16.decorators = function () { return aurelia_metadata_1.Decorators.transient(); };
        ;
        return Logger_16;
    })(LoggerBase_16);
    var App1_16 = (function () {
        function App1_16(logger) {
            this.logger = logger;
        }
        App1_16.inject = function () { return [Logger_16]; };
        ;
        return App1_16;
    })();
    var App2_16 = (function () {
        function App2_16(logger) {
            this.logger = logger;
        }
        App2_16.inject = function () { return [Logger_16]; };
        ;
        return App2_16;
    })();
    // 17 ------------------------------------------------------------------
    var LoggerBase_17 = (function () {
        function LoggerBase_17() {
        }
        LoggerBase_17.decorators = function () { return aurelia_metadata_1.Decorators.singleton(); };
        ;
        return LoggerBase_17;
    })();
    var Logger_17 = (function (_super) {
        __extends(Logger_17, _super);
        function Logger_17() {
            _super.apply(this, arguments);
        }
        return Logger_17;
    })(LoggerBase_17);
    var App1 = (function () {
        function App1(logger) {
            this.logger = logger;
        }
        App1.inject = function () { return [Logger_17]; };
        ;
        return App1;
    })();
    var App2_17 = (function () {
        function App2_17(logger) {
            this.logger = logger;
        }
        App2_17.inject = function () { return [Logger_17]; };
        ;
        return App2_17;
    })();
    // 18 ------------------------------------------------------------------
    var Logger_18 = (function () {
        function Logger_18() {
        }
        return Logger_18;
    })();
    // 19 ------------------------------------------------------------------
    var Logger_19 = (function () {
        function Logger_19() {
        }
        return Logger_19;
    })();
    // 20 ------------------------------------------------------------------
    var LoggerBase_20 = (function () {
        function LoggerBase_20() {
        }
        return LoggerBase_20;
    })();
    var Logger_20 = (function (_super) {
        __extends(Logger_20, _super);
        function Logger_20() {
            _super.apply(this, arguments);
        }
        return Logger_20;
    })(LoggerBase_20);
    var App_20 = (function () {
        function App_20(logger) {
            this.logger = logger;
        }
        App_20.inject = function () { return [LoggerBase_20]; };
        ;
        return App_20;
    })();
    // 21 ------------------------------------------------------------------
    var LoggerBase_21 = (function () {
        function LoggerBase_21() {
        }
        return LoggerBase_21;
    })();
    var Logger_21 = (function (_super) {
        __extends(Logger_21, _super);
        function Logger_21() {
            _super.apply(this, arguments);
        }
        return Logger_21;
    })(LoggerBase_21);
    var App_21 = (function () {
        function App_21(logger) {
            this.logger = logger;
        }
        App_21.inject = function () { return [LoggerBase_21]; };
        ;
        return App_21;
    })();
    // 22 ------------------------------------------------------------------
    var LoggerBase_22 = (function () {
        function LoggerBase_22() {
        }
        LoggerBase_22.decorators = function () { return aurelia_metadata_1.Decorators.transient(); };
        ;
        return LoggerBase_22;
    })();
    var Logger_22 = (function (_super) {
        __extends(Logger_22, _super);
        function Logger_22() {
            _super.apply(this, arguments);
        }
        return Logger_22;
    })(LoggerBase_22);
    var App1_22 = (function () {
        function App1_22(logger) {
            this.logger = logger;
        }
        App1_22.inject = function () { return [Logger_22]; };
        ;
        return App1_22;
    })();
    var App2_22 = (function () {
        function App2_22(logger) {
            this.logger = logger;
        }
        App2_22.inject = function () { return [Logger_22]; };
        ;
        return App2_22;
    })();
    // 23 ------------------------------------------------------------------
    var Logger_23 = (function () {
        function Logger_23() {
        }
        return Logger_23;
    })();
    var App1_23 = (function () {
        function App1_23(getLogger) {
            this.getLogger = getLogger;
        }
        App1_23.inject = function () { return [aurelia_dependency_injection_1.Lazy.of(Logger_23)]; };
        ;
        return App1_23;
    })();
    // 24 ------------------------------------------------------------------
    var LoggerBase_24 = (function () {
        function LoggerBase_24() {
        }
        return LoggerBase_24;
    })();
    var VerboseLogger_24 = (function (_super) {
        __extends(VerboseLogger_24, _super);
        function VerboseLogger_24() {
            _super.apply(this, arguments);
        }
        return VerboseLogger_24;
    })(LoggerBase_24);
    var Logger_24 = (function (_super) {
        __extends(Logger_24, _super);
        function Logger_24() {
            _super.apply(this, arguments);
        }
        return Logger_24;
    })(LoggerBase_24);
    var App_24 = (function () {
        function App_24(loggers) {
            this.loggers = loggers;
        }
        App_24.inject = function () { return [aurelia_dependency_injection_1.All.of(LoggerBase_24)]; };
        ;
        return App_24;
    })();
    // 25 ------------------------------------------------------------------
    var Logger_25 = (function () {
        function Logger_25() {
        }
        return Logger_25;
    })();
    var App_25 = (function () {
        function App_25(logger) {
            this.logger = logger;
        }
        App_25.inject = function () { return [aurelia_dependency_injection_1.Optional.of(Logger_25)]; };
        ;
        return App_25;
    })();
    // 26 ------------------------------------------------------------------
    var VerboseLogger_26 = (function () {
        function VerboseLogger_26() {
        }
        return VerboseLogger_26;
    })();
    var Logger_26 = (function () {
        function Logger_26() {
        }
        return Logger_26;
    })();
    var App_26 = (function () {
        function App_26(logger) {
            this.logger = logger;
        }
        App_26.inject = function () { return [aurelia_dependency_injection_1.Optional.of(Logger_26)]; };
        ;
        return App_26;
    })();
    // 27 ------------------------------------------------------------------
    var VerboseLogger_27 = (function () {
        function VerboseLogger_27() {
        }
        return VerboseLogger_27;
    })();
    var Logger_27 = (function () {
        function Logger_27() {
        }
        return Logger_27;
    })();
    var App_27 = (function () {
        function App_27(logger) {
            this.logger = logger;
        }
        App_27.inject = function () { return [aurelia_dependency_injection_1.Optional.of(Logger_27)]; };
        ;
        return App_27;
    })();
    // 28 ------------------------------------------------------------------
    var Logger_28 = (function () {
        function Logger_28() {
        }
        return Logger_28;
    })();
    var App_28 = (function () {
        function App_28(logger) {
            this.logger = logger;
        }
        App_28.inject = function () { return [aurelia_dependency_injection_1.Optional.of(Logger_28)]; };
        ;
        return App_28;
    })();
    // 29 ------------------------------------------------------------------
    var Logger_29 = (function () {
        function Logger_29() {
        }
        return Logger_29;
    })();
    var App_29 = (function () {
        function App_29(logger) {
            this.logger = logger;
        }
        App_29.inject = function () { return [aurelia_dependency_injection_1.Optional.of(Logger_29, true)]; };
        ;
        return App_29;
    })();
    // 30 ------------------------------------------------------------------
    var Logger_30 = (function () {
        function Logger_30() {
        }
        return Logger_30;
    })();
    var App_30 = (function () {
        function App_30(logger) {
            this.logger = logger;
        }
        App_30.inject = function () { return [aurelia_dependency_injection_1.Parent.of(Logger_30)]; };
        ;
        return App_30;
    })();
    // 31 ------------------------------------------------------------------
    var Logger_31 = (function () {
        function Logger_31() {
        }
        return Logger_31;
    })();
    var App_31 = (function () {
        function App_31(logger) {
            this.logger = logger;
        }
        App_31.inject = function () { return [aurelia_dependency_injection_1.Parent.of(Logger_31)]; };
        ;
        return App_31;
    })();
});
//# sourceMappingURL=dependency-injection-tests.js.map