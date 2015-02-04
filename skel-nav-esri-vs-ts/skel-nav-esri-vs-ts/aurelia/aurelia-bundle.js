define('aurelia-metadata/origin',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var originStorage = new Map();

  function ensureType(value) {
    if (value instanceof Origin) {
      return value;
    }

    return new Origin(value);
  }

  var Origin = (function () {
    function Origin(moduleId, moduleMember) {
      this.moduleId = moduleId;
      this.moduleMember = moduleMember;
    }

    _prototypeProperties(Origin, {
      get: {
        value: function get(fn) {
          var origin = originStorage.get(fn);

          if (origin !== undefined) {
            return origin;
          }

          if (typeof fn.origin === "function") {
            originStorage.set(fn, origin = ensureType(fn.origin()));
          } else if (fn.origin !== undefined) {
            originStorage.set(fn, origin = ensureType(fn.origin));
          }

          return origin;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      set: {
        value: function set(fn, origin) {
          if (Origin.get(fn) === undefined) {
            originStorage.set(fn, origin);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Origin;
  })();

  exports.Origin = Origin;
});
define('aurelia-metadata/resource-type',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ResourceType = (function () {
    function ResourceType() {}

    _prototypeProperties(ResourceType, null, {
      load: {
        value: function load(container, target) {
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          throw new Error("All descendents of \"ResourceType\" must implement the \"register\" method.");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ResourceType;
  })();

  exports.ResourceType = ResourceType;
});
define('aurelia-metadata/metadata',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var functionMetadataStorage = new Map(),
      emptyArray = Object.freeze([]),
      locateFunctionMetadataElsewhere;

  var MetadataStorage = (function () {
    function MetadataStorage(metadata, owner) {
      this.metadata = metadata;
      this.owner = owner;
    }

    _prototypeProperties(MetadataStorage, null, {
      first: {
        value: function first(type, searchPrototype) {
          var metadata = this.metadata,
              i,
              ii,
              potential;

          if (metadata === undefined || metadata.length === 0) {
            if (searchPrototype && this.owner !== undefined) {
              return Metadata.on(Object.getPrototypeOf(this.owner)).first(type, searchPrototype);
            }

            return null;
          }

          for (i = 0, ii = metadata.length; i < ii; ++i) {
            potential = metadata[i];

            if (potential instanceof type) {
              return potential;
            }
          }

          if (searchPrototype && this.owner !== undefined) {
            return Metadata.on(Object.getPrototypeOf(this.owner)).first(type, searchPrototype);
          }

          return null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      has: {
        value: function has(type, searchPrototype) {
          return this.first(type, searchPrototype) !== null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      all: {
        value: function all(type, searchPrototype) {
          var metadata = this.metadata,
              i,
              ii,
              found,
              potential;

          if (metadata === undefined || metadata.length === 0) {
            if (searchPrototype && this.owner !== undefined) {
              return Metadata.on(Object.getPrototypeOf(this.owner)).all(type, searchPrototype);
            }

            return emptyArray;
          }

          found = [];

          for (i = 0, ii = metadata.length; i < ii; ++i) {
            potential = metadata[i];

            if (potential instanceof type) {
              found.push(potential);
            }
          }

          if (searchPrototype && this.owner !== undefined) {
            found = found.concat(Metadata.on(Object.getPrototypeOf(this.owner)).all(type, searchPrototype));
          }

          return found;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      add: {
        value: function add(instance) {
          if (this.metadata === undefined) {
            this.metadata = [];
          }

          this.last = instance;
          this.metadata.push(instance);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      and: {
        value: function and(func) {
          func(this.last);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return MetadataStorage;
  })();

  MetadataStorage.empty = Object.freeze(new MetadataStorage());

  function normalize(metadata, fn, replace) {
    if (metadata instanceof MetadataStorage) {
      if (replace) {
        fn.metadata = function () {
          return metadata;
        };
      }

      metadata.owner = fn;
      return metadata;
    }

    if (Array.isArray(metadata)) {
      return new MetadataStorage(metadata, fn);
    }

    throw new Error("Incorrect metadata format for " + metadata + ".");
  }

  var Metadata = exports.Metadata = {
    on: function on(owner) {
      var metadata;

      if (!owner) {
        return MetadataStorage.empty;
      }

      metadata = functionMetadataStorage.get(owner);

      if (metadata === undefined) {
        if ("metadata" in owner) {
          if (typeof owner.metadata === "function") {
            functionMetadataStorage.set(owner, metadata = normalize(owner.metadata(), owner, true));
          } else {
            functionMetadataStorage.set(owner, metadata = normalize(owner.metadata, owner));
          }
        } else if (locateFunctionMetadataElsewhere !== undefined) {
          metadata = locateFunctionMetadataElsewhere(owner);

          if (metadata === undefined) {
            functionMetadataStorage.set(owner, metadata = new MetadataStorage(undefined, owner));
          } else {
            functionMetadataStorage.set(owner, metadata = normalize(metadata, owner));
          }
        } else {
          functionMetadataStorage.set(owner, metadata = new MetadataStorage(undefined, owner));
        }
      }

      return metadata;
    },
    configure: {
      location: function location(staticPropertyName) {
        this.locator(function (fn) {
          return fn[staticPropertyName];
        });
      },
      locator: function locator(loc) {
        if (locateFunctionMetadataElsewhere === undefined) {
          locateFunctionMetadataElsewhere = loc;
          return;
        }

        var original = locateFunctionMetadataElsewhere;
        locateFunctionMetadataElsewhere = function (fn) {
          return original(fn) || loc(fn);
        };
      },
      classHelper: function classHelper(name, fn) {
        MetadataStorage.prototype[name] = function () {
          var context = Object.create(fn.prototype);
          var metadata = fn.apply(context, arguments) || context;
          this.add(metadata);
          return this;
        };

        Metadata[name] = function () {
          var storage = new MetadataStorage([]);
          return storage[name].apply(storage, arguments);
        };
      },
      functionHelper: function functionHelper(name, fn) {
        MetadataStorage.prototype[name] = function () {
          fn.apply(this, arguments);
          return this;
        };

        Metadata[name] = function () {
          var storage = new MetadataStorage([]);
          return storage[name].apply(storage, arguments);
        };
      }
    }
  };
});
define('aurelia-metadata/index',["exports", "./origin", "./resource-type", "./metadata"], function (exports, _origin, _resourceType, _metadata) {
  

  exports.Origin = _origin.Origin;
  exports.ResourceType = _resourceType.ResourceType;
  exports.Metadata = _metadata.Metadata;
});
define('aurelia-metadata', ['aurelia-metadata/index'], function (main) { return main; });

define('aurelia-loader',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var hasTemplateElement = ("content" in document.createElement("template"));

  function importElements(frag, link, callback) {
    document.head.appendChild(frag);

    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(callback);
    } else {
      link.addEventListener("load", callback);
    }
  }

  var Loader = (function () {
    function Loader() {}

    _prototypeProperties(Loader, {
      createDefaultLoader: {
        value: function createDefaultLoader() {
          throw new Error("No default loader module imported.");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      loadModule: {
        value: function loadModule(id) {
          throw new Error("Loaders must implement loadModule(id).");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadAllModules: {
        value: function loadAllModules(ids) {
          throw new Error("Loader must implement loadAllModules(ids).");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadTemplate: {
        value: function loadTemplate(url) {
          throw new Error("Loader must implement loadTemplate(url).");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      importDocument: {
        value: function importDocument(url) {
          return new Promise(function (resolve, reject) {
            var frag = document.createDocumentFragment();
            var link = document.createElement("link");

            link.rel = "import";
            link.href = url;
            frag.appendChild(link);

            importElements(frag, link, function () {
              return resolve(link["import"]);
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      importTemplate: {
        value: function importTemplate(url) {
          var _this = this;
          return this.importDocument(url).then(function (doc) {
            return _this.findTemplate(doc, url);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      findTemplate: {
        value: function findTemplate(doc, url) {
          if (!hasTemplateElement) {
            HTMLTemplateElement.bootstrap(doc);
          }

          var template = doc.querySelector("template");

          if (!template) {
            throw new Error("There was no template element found in '" + url + "'.");
          }

          return template;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Loader;
  })();

  exports.Loader = Loader;
});
define('aurelia-path',["exports"], function (exports) {
  

  exports.relativeToFile = relativeToFile;
  exports.join = join;
  function trimDots(ary) {
    var i, part;
    for (i = 0; i < ary.length; ++i) {
      part = ary[i];
      if (part === ".") {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === "..") {
        if (i === 0 || i == 1 && ary[2] === ".." || ary[i - 1] === "..") {
          continue;
        } else if (i > 0) {
          ary.splice(i - 1, 2);
          i -= 2;
        }
      }
    }
  }

  function relativeToFile(name, file) {
    var lastIndex,
        normalizedBaseParts,
        fileParts = file && file.split("/");

    name = name.trim();
    name = name.split("/");

    if (name[0].charAt(0) === "." && fileParts) {
      normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
      name = normalizedBaseParts.concat(name);
    }

    trimDots(name);

    return name.join("/");
  }

  function join(path1, path2) {
    var url1, url2, url3, i, ii, urlPrefix;

    if (!path1) {
      return path2;
    }

    if (!path2) {
      return path1;
    }

    urlPrefix = path1.indexOf("/") === 0 ? "/" : "";

    url1 = path1.split("/");
    url2 = path2.split("/");
    url3 = [];

    for (i = 0, ii = url1.length; i < ii; ++i) {
      if (url1[i] == "..") {
        url3.pop();
      } else if (url1[i] == "." || url1[i] == "") {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }

    for (i = 0, ii = url2.length; i < ii; ++i) {
      if (url2[i] == "..") {
        url3.pop();
      } else if (url2[i] == "." || url2[i] == "") {
        continue;
      } else {
        url3.push(url2[i]);
      }
    }

    return urlPrefix + url3.join("/").replace(/\:\//g, "://");;
  }
  exports.__esModule = true;
});
define('aurelia-loader-default',["exports", "aurelia-metadata", "aurelia-loader", "aurelia-path"], function (exports, _aureliaMetadata, _aureliaLoader, _aureliaPath) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var Origin = _aureliaMetadata.Origin;
  var Loader = _aureliaLoader.Loader;
  var join = _aureliaPath.join;


  if (!window.System || !window.System["import"]) {
    var sys = window.System = window.System || {};
    sys.polyfilled = true;
    sys.map = {};
    sys["import"] = function (moduleId) {
      return new Promise(function (resolve, reject) {
        require([moduleId], resolve, reject);
      });
    };
    sys.normalize = function (url) {
      return Promise.resolve(url);
    };
  }

  function ensureOriginOnExports(executed, name) {
    var target = executed,
        key,
        exportedValue;

    if (target.__useDefault) {
      target = target["default"];
    }

    Origin.set(target, new Origin(name, "default"));

    for (key in target) {
      exportedValue = target[key];

      if (typeof exportedValue === "function") {
        Origin.set(exportedValue, new Origin(name, key));
      }
    }

    return executed;
  }

  Loader.createDefaultLoader = function () {
    return new DefaultLoader();
  };

  var DefaultLoader = (function (Loader) {
    function DefaultLoader() {
      this.baseUrl = System.baseUrl;
      this.baseViewUrl = System.baseViewUrl || System.baseUrl;
      this.registry = {};
    }

    _inherits(DefaultLoader, Loader);

    _prototypeProperties(DefaultLoader, null, {
      loadModule: {
        value: function loadModule(id, baseUrl) {
          var _this = this;
          baseUrl = baseUrl === undefined ? this.baseUrl : baseUrl;

          if (baseUrl && !id.startsWith(baseUrl)) {
            id = join(baseUrl, id);
          }

          return System.normalize(id).then(function (newId) {
            var existing = _this.registry[newId];
            if (existing) {
              return existing;
            }

            return System["import"](newId).then(function (m) {
              _this.registry[newId] = m;
              return ensureOriginOnExports(m, newId);
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadAllModules: {
        value: function loadAllModules(ids) {
          var loads = [],
              i,
              ii,
              loader = this.loader;

          for (i = 0, ii = ids.length; i < ii; ++i) {
            loads.push(this.loadModule(ids[i]));
          }

          return Promise.all(loads);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadTemplate: {
        value: function loadTemplate(url) {
          if (this.baseViewUrl && !url.startsWith(this.baseViewUrl)) {
            url = join(this.baseViewUrl, url);
          }

          return this.importTemplate(url);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return DefaultLoader;
  })(Loader);

  exports.DefaultLoader = DefaultLoader;
});
define('aurelia-logging',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  exports.getLogger = getLogger;
  exports.addAppender = addAppender;
  exports.setLevel = setLevel;
  var levels = exports.levels = {
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  };

  var loggers = {},
      logLevel = levels.none,
      appenders = [],
      slice = Array.prototype.slice,
      loggerConstructionKey = {};

  function log(logger, level, args) {
    var i = appenders.length,
        current;

    args = slice.call(args);
    args.unshift(logger);

    while (i--) {
      current = appenders[i];
      current[level].apply(current, args);
    }
  }

  function debug() {
    if (logLevel < 4) {
      return;
    }

    log(this, "debug", arguments);
  }

  function info() {
    if (logLevel < 3) {
      return;
    }

    log(this, "info", arguments);
  }

  function warn() {
    if (logLevel < 2) {
      return;
    }

    log(this, "warn", arguments);
  }

  function error() {
    if (logLevel < 1) {
      return;
    }

    log(this, "error", arguments);
  }

  function connectLogger(logger) {
    logger.debug = debug;
    logger.info = info;
    logger.warn = warn;
    logger.error = error;
  }

  function createLogger(id) {
    var logger = new Logger(id, loggerConstructionKey);

    if (appenders.length) {
      connectLogger(logger);
    }

    return logger;
  }

  function getLogger(id) {
    return loggers[id] || (loggers[id] = createLogger(id));
  }

  function addAppender(appender) {
    appenders.push(appender);

    if (appenders.length === 1) {
      for (var key in loggers) {
        connectLogger(loggers[key]);
      }
    }
  }

  function setLevel(level) {
    logLevel = level;
  }

  var Logger = (function () {
    function Logger(id, key) {
      if (key !== loggerConstructionKey) {
        throw new Error("You cannot instantiate \"Logger\". Use the \"getLogger\" API instead.");
      }

      this.id = id;
    }

    _prototypeProperties(Logger, null, {
      debug: {
        value: function debug() {},
        writable: true,
        enumerable: true,
        configurable: true
      },
      info: {
        value: function info() {},
        writable: true,
        enumerable: true,
        configurable: true
      },
      warn: {
        value: function warn() {},
        writable: true,
        enumerable: true,
        configurable: true
      },
      error: {
        value: function error() {},
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Logger;
  })();

  exports.Logger = Logger;
});
define('aurelia-dependency-injection/metadata',["exports"], function (exports) {
  

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Registration = (function () {
    function Registration() {}

    _prototypeProperties(Registration, null, {
      register: {
        value: function register(container, key, fn) {
          throw new Error("A custom Registration must implement register(container, key, fn).");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Registration;
  })();

  exports.Registration = Registration;
  var Transient = (function (Registration) {
    function Transient(key) {
      this.key = key;
    }

    _inherits(Transient, Registration);

    _prototypeProperties(Transient, null, {
      register: {
        value: function register(container, key, fn) {
          container.registerTransient(this.key || key, fn);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Transient;
  })(Registration);

  exports.Transient = Transient;
  var Singleton = (function (Registration) {
    function Singleton(key) {
      this.key = key;
    }

    _inherits(Singleton, Registration);

    _prototypeProperties(Singleton, null, {
      register: {
        value: function register(container, key, fn) {
          container.registerSingleton(this.key || key, fn);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Singleton;
  })(Registration);

  exports.Singleton = Singleton;
  var Resolver = (function () {
    function Resolver() {}

    _prototypeProperties(Resolver, null, {
      get: {
        value: function get(container) {
          throw new Error("A custom Resolver must implement get(container) and return the resolved instance(s).");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Resolver;
  })();

  exports.Resolver = Resolver;
  var Lazy = (function (Resolver) {
    function Lazy(key) {
      this.key = key;
    }

    _inherits(Lazy, Resolver);

    _prototypeProperties(Lazy, {
      of: {
        value: function of(key) {
          return new Lazy(key);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      get: {
        value: function get(container) {
          var _this = this;
          return function () {
            return container.get(_this.key);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Lazy;
  })(Resolver);

  exports.Lazy = Lazy;
  var All = (function (Resolver) {
    function All(key) {
      this.key = key;
    }

    _inherits(All, Resolver);

    _prototypeProperties(All, {
      of: {
        value: function of(key) {
          return new All(key);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      get: {
        value: function get(container) {
          return container.getAll(this.key);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return All;
  })(Resolver);

  exports.All = All;
  var Optional = (function (Resolver) {
    function Optional(key) {
      var checkParent = arguments[1] === undefined ? false : arguments[1];
      this.key = key;
      this.checkParent = checkParent;
    }

    _inherits(Optional, Resolver);

    _prototypeProperties(Optional, {
      of: {
        value: function of(key) {
          var checkParent = arguments[1] === undefined ? false : arguments[1];
          return new Optional(key, checkParent);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      get: {
        value: function get(container) {
          if (container.hasHandler(this.key, this.checkParent)) {
            return container.get(this.key);
          }

          return null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Optional;
  })(Resolver);

  exports.Optional = Optional;
  var Parent = (function (Resolver) {
    function Parent(key) {
      this.key = key;
    }

    _inherits(Parent, Resolver);

    _prototypeProperties(Parent, {
      of: {
        value: function of(key) {
          return new Parent(key);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      get: {
        value: function get(container) {
          return container.parent ? container.parent.get(this.key) : null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Parent;
  })(Resolver);

  exports.Parent = Parent;
});
define('aurelia-dependency-injection/util',["exports"], function (exports) {
  

  exports.isClass = isClass;
  if (!(function f() {}).name) {
    Object.defineProperty(Function.prototype, "name", {
      get: function () {
        var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
        Object.defineProperty(this, "name", { value: name });
        return name;
      }
    });
  }

  function isUpperCase(char) {
    return char.toUpperCase() === char;
  }

  function isClass(clsOrFunction) {
    if (clsOrFunction.name) {
      return isUpperCase(clsOrFunction.name.charAt(0));
    }

    return Object.keys(clsOrFunction.prototype).length > 0;
  }
});
define('aurelia-dependency-injection/container',["exports", "aurelia-metadata", "./metadata", "./util"], function (exports, _aureliaMetadata, _metadata, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Metadata = _aureliaMetadata.Metadata;
  var Resolver = _metadata.Resolver;
  var Registration = _metadata.Registration;
  var isClass = _util.isClass;


  var emptyParameters = Object.freeze([]);

  var Container = (function () {
    function Container(constructionInfo) {
      this.constructionInfo = constructionInfo || new Map();
      this.entries = new Map();
    }

    _prototypeProperties(Container, null, {
      supportAtScript: {
        value: function supportAtScript() {
          this.addParameterInfoLocator(function (fn) {
            var parameters = fn.parameters,
                keys,
                i,
                ii;

            if (parameters) {
              keys = new Array(parameters.length);

              for (i = 0, ii = parameters.length; i < ii; ++i) {
                keys[i] = parameters[i].is;
              }
            }

            return keys;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      addParameterInfoLocator: {
        value: function addParameterInfoLocator(locator) {
          if (this.locateParameterInfoElsewhere === undefined) {
            this.locateParameterInfoElsewhere = locator;
            return;
          }

          var original = this.locateParameterInfoElsewhere;
          this.locateParameterInfoElsewhere = function (fn) {
            return original(fn) || locator(fn);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerInstance: {
        value: function registerInstance(key, instance) {
          this.registerHandler(key, function (x) {
            return instance;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerTransient: {
        value: function registerTransient(key, fn) {
          fn = fn || key;
          this.registerHandler(key, function (x) {
            return x.invoke(fn);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerSingleton: {
        value: function registerSingleton(key, fn) {
          var singleton = null;
          fn = fn || key;
          this.registerHandler(key, function (x) {
            return singleton || (singleton = x.invoke(fn));
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      autoRegister: {
        value: function autoRegister(fn, key) {
          var registration = Metadata.on(fn).first(Registration, true);

          if (registration) {
            registration.register(this, key || fn, fn);
          } else {
            this.registerSingleton(key || fn, fn);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      autoRegisterAll: {
        value: function autoRegisterAll(fns) {
          var i = fns.length;
          while (i--) {
            this.autoRegister(fns[i]);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerHandler: {
        value: function registerHandler(key, handler) {
          this.getOrCreateEntry(key).push(handler);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      get: {
        value: function get(key) {
          var entry;

          if (key instanceof Resolver) {
            return key.get(this);
          }

          if (key === Container) {
            return this;
          }

          entry = this.entries.get(key);

          if (entry !== undefined) {
            return entry[0](this);
          }

          if (this.parent) {
            return this.parent.get(key);
          }

          this.autoRegister(key);
          entry = this.entries.get(key);

          return entry[0](this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getAll: {
        value: function getAll(key) {
          var _this = this;
          var entry = this.entries.get(key);

          if (entry !== undefined) {
            return entry.map(function (x) {
              return x(_this);
            });
          }

          if (this.parent) {
            return this.parent.getAll(key);
          }

          return [];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      hasHandler: {
        value: function hasHandler(key) {
          var checkParent = arguments[1] === undefined ? false : arguments[1];
          return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createChild: {
        value: function createChild() {
          var childContainer = new Container(this.constructionInfo);
          childContainer.parent = this;
          childContainer.locateParameterInfoElsewhere = this.locateParameterInfoElsewhere;
          return childContainer;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      invoke: {
        value: function invoke(fn) {
          var info = this.getOrCreateConstructionInfo(fn),
              keys = info.keys,
              args = new Array(keys.length),
              context,
              i,
              ii;

          for (i = 0, ii = keys.length; i < ii; ++i) {
            args[i] = this.get(keys[i]);
          }

          if (info.isClass) {
            context = Object.create(fn.prototype);

            if ("initialize" in fn) {
              fn.initialize(context);
            }

            return fn.apply(context, args) || context;
          } else {
            return fn.apply(undefined, args);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getOrCreateEntry: {
        value: function getOrCreateEntry(key) {
          var entry = this.entries.get(key);

          if (entry === undefined) {
            entry = [];
            this.entries.set(key, entry);
          }

          return entry;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getOrCreateConstructionInfo: {
        value: function getOrCreateConstructionInfo(fn) {
          var info = this.constructionInfo.get(fn);

          if (info === undefined) {
            info = this.createConstructionInfo(fn);
            this.constructionInfo.set(fn, info);
          }

          return info;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createConstructionInfo: {
        value: function createConstructionInfo(fn) {
          var info = { isClass: isClass(fn) };

          if (fn.inject !== undefined) {
            if (typeof fn.inject === "function") {
              info.keys = fn.inject();
            } else {
              info.keys = fn.inject;
            }

            return info;
          }

          if (this.locateParameterInfoElsewhere !== undefined) {
            info.keys = this.locateParameterInfoElsewhere(fn) || emptyParameters;
          } else {
            info.keys = emptyParameters;
          }

          return info;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Container;
  })();

  exports.Container = Container;
});
define('aurelia-dependency-injection/index',["exports", "aurelia-metadata", "./metadata", "./container"], function (exports, _aureliaMetadata, _metadata, _container) {
  

  var Metadata = _aureliaMetadata.Metadata;
  var Transient = _metadata.Transient;
  var Singleton = _metadata.Singleton;
  exports.Registration = _metadata.Registration;
  exports.Transient = _metadata.Transient;
  exports.Singleton = _metadata.Singleton;
  exports.Resolver = _metadata.Resolver;
  exports.Lazy = _metadata.Lazy;
  exports.All = _metadata.All;
  exports.Optional = _metadata.Optional;
  exports.Parent = _metadata.Parent;
  exports.Container = _container.Container;


  Metadata.configure.classHelper("transient", Transient);
  Metadata.configure.classHelper("singleton", Singleton);
});
define('aurelia-dependency-injection', ['aurelia-dependency-injection/index'], function (main) { return main; });

define('aurelia-templating/util',["exports"], function (exports) {
  

  exports.hyphenate = hyphenate;
  var capitalMatcher = /([A-Z])/g;

  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }

  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
});
define('aurelia-binding/value-converter',["exports", "aurelia-metadata"], function (exports, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var ResourceType = _aureliaMetadata.ResourceType;


  var capitalMatcher = /([A-Z])/g;

  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }

  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }

  var ValueConverter = (function (ResourceType) {
    function ValueConverter(name) {
      this.name = name;
    }

    _inherits(ValueConverter, ResourceType);

    _prototypeProperties(ValueConverter, {
      convention: {
        value: function convention(name) {
          if (name.endsWith("ValueConverter")) {
            return new ValueConverter(hyphenate(name.substring(0, name.length - 14)));
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      load: {
        value: function load(container, target) {
          this.instance = container.get(target);
          return Promise.resolve(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerValueConverter(name || this.name, this.instance);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ValueConverter;
  })(ResourceType);

  exports.ValueConverter = ValueConverter;
});
define('aurelia-binding/event-manager',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var DefaultEventStrategy = (function () {
    function DefaultEventStrategy() {
      this.delegatedEvents = {};
    }

    _prototypeProperties(DefaultEventStrategy, null, {
      ensureDelegatedEvent: {
        value: function ensureDelegatedEvent(eventName) {
          if (this.delegatedEvents[eventName]) {
            return;
          }

          this.delegatedEvents[eventName] = true;
          document.addEventListener(eventName, this.handleDelegatedEvent.bind(this), false);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleCallbackResult: {
        value: function handleCallbackResult(result) {},
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleDelegatedEvent: {
        value: function handleDelegatedEvent(event) {
          event = event || window.event;
          var target = event.target || event.srcElement,
              callback;

          while (target && !callback) {
            if (target.delegatedEvents) {
              callback = target.delegatedEvents[event.type];
            }

            if (!callback) {
              target = target.parentNode;
            }
          }

          if (callback) {
            this.handleCallbackResult(callback(event));
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createDirectEventCallback: {
        value: function createDirectEventCallback(callback) {
          var _this = this;
          return function (event) {
            _this.handleCallbackResult(callback(event));
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribeToDelegatedEvent: {
        value: function subscribeToDelegatedEvent(target, targetEvent, callback) {
          var lookup = target.delegatedEvents || (target.delegatedEvents = {});

          this.ensureDelegatedEvent(targetEvent);
          lookup[targetEvent] = callback;

          return function () {
            lookup[targetEvent] = null;
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribeToDirectEvent: {
        value: function subscribeToDirectEvent(target, targetEvent, callback) {
          var directEventCallback = this.createDirectEventCallback(callback);
          target.addEventListener(targetEvent, directEventCallback, false);

          return function () {
            target.removeEventListener(targetEvent, directEventCallback);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(target, targetEvent, callback, delegate) {
          if (delegate) {
            return this.subscribeToDirectEvent(target, targetEvent, callback);
          } else {
            return this.subscribeToDelegatedEvent(target, targetEvent, callback);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return DefaultEventStrategy;
  })();

  var EventManager = (function () {
    function EventManager() {
      this.elementHandlerLookup = {};
      this.eventStrategyLookup = {};

      this.registerElementConfig({
        tagName: "input",
        properties: {
          value: ["change", "input"],
          checked: ["change", "input"]
        }
      });

      this.registerElementConfig({
        tagName: "textarea",
        properties: {
          value: ["change", "input"]
        }
      });

      this.registerElementConfig({
        tagName: "select",
        properties: {
          value: ["change"]
        }
      });

      this.defaultEventStrategy = new DefaultEventStrategy();
    }

    _prototypeProperties(EventManager, null, {
      registerElementConfig: {
        value: function registerElementConfig(config) {
          this.elementHandlerLookup[config.tagName.toLowerCase()] = {
            subscribe: function subscribe(target, property, callback) {
              var events = config.properties[property];
              if (events) {
                events.forEach(function (changeEvent) {
                  target.addEventListener(changeEvent, callback, false);
                });

                return function () {
                  events.forEach(function (changeEvent) {
                    target.removeEventListener(changeEvent, callback);
                  });
                };
              } else {
                throw new Error("Cannot observe property " + property + " of " + config.tagName + ". No events found.");
              }
            }
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerElementHandler: {
        value: function registerElementHandler(tagName, handler) {
          this.elementHandlerLookup[tagName.toLowerCase()] = handler;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerEventStrategy: {
        value: function registerEventStrategy(eventName, strategy) {
          this.eventStrategyLookup[eventName] = strategy;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getElementHandler: {
        value: function getElementHandler(target) {
          if (target.tagName) {
            var handler = this.elementHandlerLookup[target.tagName.toLowerCase()];
            if (handler) {
              return handler;
            }
          }

          return null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      addEventListener: {
        value: function addEventListener(target, targetEvent, callback, delegate) {
          return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return EventManager;
  })();

  exports.EventManager = EventManager;
});
define('aurelia-task-queue',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var hasSetImmediate = typeof setImmediate === "function";

  function makeRequestFlushFromMutationObserver(flush) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode("");
    observer.observe(node, { characterData: true });
    return function requestFlush() {
      toggle = -toggle;
      node.data = toggle;
    };
  }

  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      var handleFlushTimer = function () {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      };

      var timeoutHandle = setTimeout(handleFlushTimer, 0);
      var intervalHandle = setInterval(handleFlushTimer, 50);
    };
  }

  var TaskQueue = (function () {
    function TaskQueue() {
      var _this = this;
      this.microTaskQueue = [];
      this.microTaskQueueCapacity = 1024;
      this.taskQueue = [];

      if (typeof BrowserMutationObserver === "function") {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromMutationObserver(function () {
          return _this.flushMicroTaskQueue();
        });
      } else {
        this.requestFlushMicroTaskQueue = makeRequestFlushFromTimer(function () {
          return _this.flushMicroTaskQueue();
        });
      }

      this.requestFlushTaskQueue = makeRequestFlushFromTimer(function () {
        return _this.flushTaskQueue();
      });
    }

    _prototypeProperties(TaskQueue, null, {
      queueMicroTask: {
        value: function queueMicroTask(task) {
          if (!this.microTaskQueue.length) {
            this.requestFlushMicroTaskQueue();
          }

          this.microTaskQueue.push(task);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      queueTask: {
        value: function queueTask(task) {
          if (!this.taskQueue.length) {
            this.requestFlushTaskQueue();
          }

          this.taskQueue.push(task);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      flushTaskQueue: {
        value: function flushTaskQueue() {
          var queue = this.taskQueue,
              index = 0,
              task;

          this.taskQueue = [];

          while (index < queue.length) {
            task = queue[index];

            try {
              task.call();
            } catch (error) {
              this.onError(error, task);
            }

            index++;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      flushMicroTaskQueue: {
        value: function flushMicroTaskQueue() {
          var queue = this.microTaskQueue,
              capacity = this.microTaskQueueCapacity,
              index = 0,
              task;

          while (index < queue.length) {
            task = queue[index];

            try {
              task.call();
            } catch (error) {
              this.onError(error, task);
            }

            index++;

            if (index > capacity) {
              for (var scan = 0; scan < index; scan++) {
                queue[scan] = queue[scan + index];
              }

              queue.length -= index;
              index = 0;
            }
          }

          queue.length = 0;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      onError: {
        value: function onError(error, task) {
          if ("onError" in task) {
            task.onError(error);
          } else if (hasSetImmediate) {
            setImmediate(function () {
              throw error;
            });
          } else {
            setTimeout(function () {
              throw error;
            }, 0);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return TaskQueue;
  })();

  exports.TaskQueue = TaskQueue;
});
define('aurelia-binding/array-change-records',["exports"], function (exports) {
  

  exports.calcSplices = calcSplices;
  exports.projectArraySplices = projectArraySplices;
  function isIndex(s) {
    return +s === s >>> 0;
  }

  function toNumber(s) {
    return +s;
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {
    calcEditDistances: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);
      var i, j, north, west;

      for (i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      for (j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
      }

      for (i = 1; i < rowCount; ++i) {
        for (j = 1; j < columnCount; ++j) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1])) distances[i][j] = distances[i - 1][j - 1];else {
            north = distances[i - 1][j] + 1;
            west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },
    spliceOperationsFromEditDistances: function (distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north) min = west < northWest ? west : northWest;else min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },
    calcSplices: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0) prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length) suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) return [];

      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);

        return [splice];
      } else if (oldStart == oldEnd) return [newSplice(currentStart, [], currentEnd - currentStart)];

      var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));

      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice) splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice) splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice) splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function (current, old, searchLength) {
      for (var i = 0; i < searchLength; ++i) if (!this.equals(current[i], old[i])) return i;
      return searchLength;
    },

    sharedSuffix: function (current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2])) count++;

      return count;
    },

    calculateSplices: function (current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },

    equals: function (currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    if (end1 < start2 || end2 < start1) return -1;

    if (end1 == start2 || end2 == start1) return 0;

    if (start1 < start2) {
      if (end1 < end2) return end1 - start2;else return end2 - start2;
    } else {
      if (end2 < end1) return end2 - start1;else return end1 - start1;
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {
    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted) continue;

      var intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);

      if (intersectCount >= 0) {
        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length + current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          inserted = true;
        } else {
          var removed = current.removed;

          if (splice.index < current.index) {
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length;
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted) splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch (record.type) {
        case "splice":
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case "add":
        case "update":
        case "delete":
          if (!isIndex(record.name)) continue;
          var index = toNumber(record.name);
          if (index < 0) continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error("Unexpected record type: " + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function (splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index]) splices.push(splice);

        return;
      };

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    });

    return splices;
  }
});
define('aurelia-binding/array-observation',["exports", "./array-change-records"], function (exports, _arrayChangeRecords) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  exports.getArrayObserver = getArrayObserver;
  var calcSplices = _arrayChangeRecords.calcSplices;
  var projectArraySplices = _arrayChangeRecords.projectArraySplices;


  var arrayProto = Array.prototype,
      hasArrayObserve = (function detectArrayObserve() {
    var callback = function (recs) {
      records = recs;
    };

    if (typeof Array.observe !== "function") {
      return false;
    }

    var records = [];

    var arr = [];
    Array.observe(arr, callback);
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 2) return false;

    if (records[0].type != "splice" || records[1].type != "splice") {
      return false;
    }

    Array.unobserve(arr, callback);

    return true;
  })();

  function getArrayObserver(taskQueue, array) {
    if (hasArrayObserve) {
      return new ArrayObserveObserver(array);
    } else {
      return ModifyArrayObserver.create(taskQueue, array);
    }
  }

  var ModifyArrayObserver = (function () {
    function ModifyArrayObserver(taskQueue, array) {
      this.taskQueue = taskQueue;
      this.callbacks = [];
      this.changeRecords = [];
      this.queued = false;
      this.array = array;
      this.oldArray = null;
    }

    _prototypeProperties(ModifyArrayObserver, {
      create: {
        value: function create(taskQueue, array) {
          var observer = new ModifyArrayObserver(taskQueue, array);

          array.pop = function () {
            var methodCallResult = arrayProto.pop.apply(array, arguments);
            observer.addChangeRecord({
              type: "delete",
              object: array,
              name: array.length,
              oldValue: methodCallResult
            });
            return methodCallResult;
          };

          array.push = function () {
            var methodCallResult = arrayProto.push.apply(array, arguments);
            observer.addChangeRecord({
              type: "splice",
              object: array,
              index: array.length - arguments.length,
              removed: [],
              addedCount: arguments.length
            });
            return methodCallResult;
          };

          array.reverse = function () {
            var oldArray = array.slice();
            var methodCallResult = arrayProto.reverse.apply(array, arguments);
            observer.reset(oldArray);
            return methodCallResult;
          };

          array.shift = function () {
            var methodCallResult = arrayProto.shift.apply(array, arguments);
            observer.addChangeRecord({
              type: "delete",
              object: array,
              name: 0,
              oldValue: methodCallResult
            });
            return methodCallResult;
          };

          array.sort = function () {
            var oldArray = array.slice();
            var methodCallResult = arrayProto.sort.apply(array, arguments);
            observer.reset(oldArray);
            return methodCallResult;
          };

          array.splice = function () {
            var methodCallResult = arrayProto.splice.apply(array, arguments);
            observer.addChangeRecord({
              type: "splice",
              object: array,
              index: arguments[0],
              removed: methodCallResult,
              addedCount: arguments.length > 2 ? arguments.length - 2 : 0
            });
            return methodCallResult;
          };

          array.unshift = function () {
            var methodCallResult = arrayProto.unshift.apply(array, arguments);
            observer.addChangeRecord({
              type: "splice",
              object: array,
              index: 0,
              removed: [],
              addedCount: arguments.length
            });
            return methodCallResult;
          };

          return observer;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      subscribe: {
        value: function subscribe(callback) {
          var callbacks = this.callbacks;
          callbacks.push(callback);
          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      addChangeRecord: {
        value: function addChangeRecord(changeRecord) {
          if (!this.callbacks.length) {
            return;
          }

          this.changeRecords.push(changeRecord);

          if (!this.queued) {
            this.queued = true;
            this.taskQueue.queueMicroTask(this);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      reset: {
        value: function reset(oldArray) {
          if (!this.callbacks.length) {
            return;
          }

          this.oldArray = oldArray;

          if (!this.queued) {
            this.queued = true;
            this.taskQueue.queueMicroTask(this);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName) {
          if (propertyName == "length") {
            return this.lengthObserver || (this.lengthObserver = new ArrayLengthObserver(this.array));
          } else {
            throw new Error("You cannot observe the " + propertyName + " property of an array.");
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call() {
          var callbacks = this.callbacks,
              i = callbacks.length,
              changeRecords = this.changeRecords,
              oldArray = this.oldArray,
              splices;

          this.queued = false;
          this.changeRecords = [];
          this.oldArray = null;

          if (i) {
            if (oldArray) {
              splices = calcSplices(this.array, 0, this.array.length, oldArray, 0, oldArray.length);
            } else {
              splices = projectArraySplices(this.array, changeRecords);
            }

            while (i--) {
              callbacks[i](splices);
            }
          }

          if (this.lengthObserver) {
            this.lengthObserver(this.array.length);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ModifyArrayObserver;
  })();

  var ArrayObserveObserver = (function () {
    function ArrayObserveObserver(array) {
      this.array = array;
      this.callbacks = [];
      this.observing = false;
    }

    _prototypeProperties(ArrayObserveObserver, null, {
      subscribe: {
        value: function subscribe(callback) {
          var _this = this;
          var callbacks = this.callbacks;

          callbacks.push(callback);

          if (!this.observing) {
            this.observing = true;
            Array.observe(this.array, function (changes) {
              return _this.handleChanges(changes);
            });
          }

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName) {
          if (propertyName == "length") {
            return this.lengthObserver || (this.lengthObserver = new ArrayLengthObserver(this.array));
          } else {
            throw new Error("You cannot observe the " + propertyName + " property of an array.");
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleChanges: {
        value: function handleChanges(changeRecords) {
          var callbacks = this.callbacks,
              i = callbacks.length,
              splices;

          if (!i) {
            return;
          }

          var splices = projectArraySplices(this.array, changeRecords);

          while (i--) {
            callbacks[i](splices);
          }

          if (this.lengthObserver) {
            this.lengthObserver.call(this.array.length);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ArrayObserveObserver;
  })();

  var ArrayLengthObserver = (function () {
    function ArrayLengthObserver(array) {
      this.array = array;
      this.callbacks = [];
      this.currentValue = array.length;
    }

    _prototypeProperties(ArrayLengthObserver, null, {
      getValue: {
        value: function getValue() {
          return this.array.length;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          this.array.length = newValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var callbacks = this.callbacks;
          callbacks.push(callback);
          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call(newValue) {
          var callbacks = this.callbacks,
              i = callbacks.length,
              oldValue = this.currentValue;

          while (i--) {
            callbacks[i](newValue, oldValue);
          }

          this.currentValue = newValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ArrayLengthObserver;
  })();
});
define('aurelia-binding/dirty-checking',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var DirtyChecker = (function () {
    function DirtyChecker() {
      this.tracked = [];
      this.checkDelay = 120;
    }

    _prototypeProperties(DirtyChecker, null, {
      addProperty: {
        value: function addProperty(property) {
          var tracked = this.tracked;

          tracked.push(property);

          if (tracked.length === 1) {
            this.scheduleDirtyCheck();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      removeProperty: {
        value: function removeProperty(property) {
          var tracked = this.tracked;
          tracked.splice(tracked.indexOf(property), 1);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scheduleDirtyCheck: {
        value: function scheduleDirtyCheck() {
          var _this = this;
          setTimeout(function () {
            return _this.check();
          }, this.checkDelay);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      check: {
        value: function check() {
          var tracked = this.tracked,
              i = tracked.length;

          while (i--) {
            var current = tracked[i];

            if (current.isDirty()) {
              current.call();
            }
          }

          if (tracked.length) {
            this.scheduleDirtyCheck();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return DirtyChecker;
  })();

  exports.DirtyChecker = DirtyChecker;
  var DirtyCheckProperty = (function () {
    function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
      this.dirtyChecker = dirtyChecker;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.isSVG = obj instanceof SVGElement;
    }

    _prototypeProperties(DirtyCheckProperty, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          if (this.isSVG) {
            this.obj.setAttributeNS(null, this.propertyName, newValue);
          } else {
            this.obj[this.propertyName] = newValue;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call() {
          var callbacks = this.callbacks,
              i = callbacks.length,
              oldValue = this.oldValue,
              newValue = this.getValue();

          while (i--) {
            callbacks[i](newValue, oldValue);
          }

          this.oldValue = newValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      isDirty: {
        value: function isDirty() {
          return this.oldValue !== this.getValue();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      beginTracking: {
        value: function beginTracking() {
          this.tracking = true;
          this.oldValue = this.newValue = this.getValue();
          this.dirtyChecker.addProperty(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      endTracking: {
        value: function endTracking() {
          this.tracking = false;
          this.dirtyChecker.removeProperty(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var callbacks = this.callbacks,
              that = this;

          callbacks.push(callback);

          if (!this.tracking) {
            this.beginTracking();
          }

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
            if (callbacks.length === 0) {
              that.endTracking();
            }
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return DirtyCheckProperty;
  })();

  exports.DirtyCheckProperty = DirtyCheckProperty;
});
define('aurelia-binding/property-observation',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var SetterObserver = (function () {
    function SetterObserver(taskQueue, obj, propertyName) {
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.queued = false;
      this.observing = false;
      this.isSVG = obj instanceof SVGElement;
    }

    _prototypeProperties(SetterObserver, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          if (this.isSVG) {
            this.obj.setAttributeNS(null, this.propertyName, newValue);
          } else {
            this.obj[this.propertyName] = newValue;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getterValue: {
        value: function getterValue() {
          return this.currentValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setterValue: {
        value: function setterValue(newValue) {
          var oldValue = this.currentValue;

          if (oldValue != newValue) {
            if (!this.queued) {
              this.oldValue = oldValue;
              this.queued = true;
              this.taskQueue.queueMicroTask(this);
            }

            this.currentValue = newValue;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call() {
          var callbacks = this.callbacks,
              i = callbacks.length,
              oldValue = this.oldValue,
              newValue = this.currentValue;

          this.queued = false;

          while (i--) {
            callbacks[i](newValue, oldValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var callbacks = this.callbacks;
          callbacks.push(callback);

          if (!this.observing) {
            this.convertProperty();
          }

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      convertProperty: {
        value: function convertProperty() {
          this.observing = true;
          this.currentValue = this.obj[this.propertyName];
          this.setValue = this.setterValue;
          this.getValue = this.getterValue;

          Object.defineProperty(this.obj, this.propertyName, {
            configurable: true,
            enumerable: true,
            get: this.getValue.bind(this),
            set: this.setValue.bind(this)
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return SetterObserver;
  })();

  exports.SetterObserver = SetterObserver;
  var OoObjectObserver = (function () {
    function OoObjectObserver(obj) {
      this.obj = obj;
      this.observers = {};
    }

    _prototypeProperties(OoObjectObserver, null, {
      subscribe: {
        value: function subscribe(propertyObserver, callback) {
          var _this = this;
          var callbacks = propertyObserver.callbacks;
          callbacks.push(callback);

          if (!this.observing) {
            this.observing = true;
            Object.observe(this.obj, function (changes) {
              return _this.handleChanges(changes);
            }, ["update", "add"]);
          }

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName) {
          var propertyObserver = this.observers[propertyName] || (this.observers[propertyName] = new OoPropertyObserver(this, this.obj, propertyName));

          return propertyObserver;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleChanges: {
        value: function handleChanges(changeRecords) {
          var updates = {},
              observers = this.observers,
              i = changeRecords.length;

          while (i--) {
            var change = changeRecords[i],
                name = change.name;

            if (!(name in updates)) {
              var observer = observers[name];
              updates[name] = true;
              if (observer) {
                observer.trigger(change.object[name], change.oldValue);
              }
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return OoObjectObserver;
  })();

  exports.OoObjectObserver = OoObjectObserver;
  var OoPropertyObserver = (function () {
    function OoPropertyObserver(owner, obj, propertyName) {
      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.isSVG = obj instanceof SVGElement;
    }

    _prototypeProperties(OoPropertyObserver, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          if (this.isSVG) {
            this.obj.setAttributeNS(null, this.propertyName, newValue);
          } else {
            this.obj[this.propertyName] = newValue;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      trigger: {
        value: function trigger(newValue, oldValue) {
          var callbacks = this.callbacks,
              i = callbacks.length;

          while (i--) {
            callbacks[i](newValue, oldValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          return this.owner.subscribe(this, callback);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return OoPropertyObserver;
  })();

  exports.OoPropertyObserver = OoPropertyObserver;
  var ElementObserver = (function () {
    function ElementObserver(handler, element, propertyName) {
      this.element = element;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.oldValue = element[propertyName];
      this.handler = handler;
    }

    _prototypeProperties(ElementObserver, null, {
      getValue: {
        value: function getValue() {
          return this.element[this.propertyName];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          this.element[this.propertyName] = newValue;
          this.call();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call() {
          var callbacks = this.callbacks,
              i = callbacks.length,
              oldValue = this.oldValue,
              newValue = this.getValue();

          while (i--) {
            callbacks[i](newValue, oldValue);
          }

          this.oldValue = newValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var that = this;

          if (!this.disposeHandler) {
            this.disposeHandler = this.handler.subscribe(this.element, this.propertyName, this.call.bind(this));
          }

          var callbacks = this.callbacks;

          callbacks.push(callback);

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
            if (callback.length === 0) {
              that.disposeHandler();
              that.disposeHandler = null;
            }
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ElementObserver;
  })();

  exports.ElementObserver = ElementObserver;
});
define('aurelia-binding/observer-locator',["exports", "aurelia-task-queue", "./array-observation", "./event-manager", "./dirty-checking", "./property-observation"], function (exports, _aureliaTaskQueue, _arrayObservation, _eventManager, _dirtyChecking, _propertyObservation) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var TaskQueue = _aureliaTaskQueue.TaskQueue;
  var getArrayObserver = _arrayObservation.getArrayObserver;
  var EventManager = _eventManager.EventManager;
  var DirtyChecker = _dirtyChecking.DirtyChecker;
  var DirtyCheckProperty = _dirtyChecking.DirtyCheckProperty;
  var SetterObserver = _propertyObservation.SetterObserver;
  var OoObjectObserver = _propertyObservation.OoObjectObserver;
  var OoPropertyObserver = _propertyObservation.OoPropertyObserver;
  var ElementObserver = _propertyObservation.ElementObserver;


  if (typeof Object.getPropertyDescriptor !== "function") {
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === "undefined" && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  var hasObjectObserve = (function detectObjectObserve() {
    var callback = function (recs) {
      records = recs;
    };

    if (typeof Object.observe !== "function") {
      return false;
    }

    var records = [];

    var test = {};
    Object.observe(test, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;

    Object.deliverChangeRecords(callback);
    if (records.length !== 3) return false;

    if (records[0].type != "add" || records[1].type != "update" || records[2].type != "delete") {
      return false;
    }

    Object.unobserve(test, callback);

    return true;
  })();

  function createObserversLookup(obj) {
    var value = {};

    Object.defineProperty(obj, "__observers__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  function createObserverLookup(obj) {
    var value = new OoObjectObserver(obj);

    Object.defineProperty(obj, "__observer__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  var ObserverLocator = (function () {
    function ObserverLocator(taskQueue, eventManager, dirtyChecker) {
      this.taskQueue = taskQueue;
      this.eventManager = eventManager;
      this.dirtyChecker = dirtyChecker;
    }

    _prototypeProperties(ObserverLocator, {
      inject: {
        value: function inject() {
          return [TaskQueue, EventManager, DirtyChecker];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      getObserversLookup: {
        value: function getObserversLookup(obj) {
          return obj.__observers__ || createObserversLookup(obj);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(obj, propertyName) {
          var observersLookup = this.getObserversLookup(obj);

          if (propertyName in observersLookup) {
            return observersLookup[propertyName];
          }

          return observersLookup[propertyName] = this.createPropertyObserver(obj, propertyName);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createPropertyObserver: {
        value: function createPropertyObserver(obj, propertyName) {
          var observerLookup, descriptor, handler;

          if (obj instanceof Element) {
            handler = this.eventManager.getElementHandler(obj);
            if (handler) {
              return new ElementObserver(handler, obj, propertyName);
            }
          }

          descriptor = Object.getPropertyDescriptor(obj, propertyName);
          if (descriptor && (descriptor.get || descriptor.set)) {
            return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
          }

          if (hasObjectObserve) {
            observerLookup = obj.__observer__ || createObserverLookup(obj);
            return observerLookup.getObserver(propertyName);
          }

          if (obj instanceof Array) {
            observerLookup = this.getArrayObserver(obj);
            return observerLookup.getObserver(propertyName);
          }

          return new SetterObserver(this.taskQueue, obj, propertyName);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getArrayObserver: {
        value: (function (_getArrayObserver) {
          var _getArrayObserverWrapper = function getArrayObserver() {
            return _getArrayObserver.apply(this, arguments);
          };

          _getArrayObserverWrapper.toString = function () {
            return _getArrayObserver.toString();
          };

          return _getArrayObserverWrapper;
        })(function (array) {
          if ("__array_observer__" in array) {
            return array.__array_observer__;
          }

          return array.__array_observer__ = getArrayObserver(this.taskQueue, array);
        }),
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ObserverLocator;
  })();

  exports.ObserverLocator = ObserverLocator;
});
define('aurelia-binding/binding-modes',["exports"], function (exports) {
  

  var ONE_WAY = exports.ONE_WAY = 1;
  var TWO_WAY = exports.TWO_WAY = 2;
  var ONE_TIME = exports.ONE_TIME = 3;
});
define('aurelia-binding/lexer',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Token = (function () {
    function Token(index, text) {
      this.index = index;
      this.text = text;
    }

    _prototypeProperties(Token, null, {
      withOp: {
        value: function withOp(op) {
          this.opKey = op;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withGetterSetter: {
        value: function withGetterSetter(key) {
          this.key = key;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withValue: {
        value: function withValue(value) {
          this.value = value;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      toString: {
        value: function toString() {
          return "Token(" + this.text + ")";
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Token;
  })();

  exports.Token = Token;
  var Lexer = (function () {
    function Lexer() {}

    _prototypeProperties(Lexer, null, {
      lex: {
        value: function lex(text) {
          var scanner = new Scanner(text);
          var tokens = [];
          var token = scanner.scanToken();

          while (token) {
            tokens.push(token);
            token = scanner.scanToken();
          }

          return tokens;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Lexer;
  })();

  exports.Lexer = Lexer;
  var Scanner = (function () {
    function Scanner(input) {
      this.input = input;
      this.length = input.length;
      this.peek = 0;
      this.index = -1;

      this.advance();
    }

    _prototypeProperties(Scanner, null, {
      scanToken: {
        value: function scanToken() {
          while (this.peek <= $SPACE) {
            if (++this.index >= this.length) {
              this.peek = $EOF;
              return null;
            } else {
              this.peek = this.input.charCodeAt(this.index);
            }
          }

          if (isIdentifierStart(this.peek)) {
            return this.scanIdentifier();
          }

          if (isDigit(this.peek)) {
            return this.scanNumber(this.index);
          }

          var start = this.index;

          switch (this.peek) {
            case $PERIOD:
              this.advance();
              return isDigit(this.peek) ? this.scanNumber(start) : new Token(start, ".");
            case $LPAREN:
            case $RPAREN:
            case $LBRACE:
            case $RBRACE:
            case $LBRACKET:
            case $RBRACKET:
            case $COMMA:
            case $COLON:
            case $SEMICOLON:
              return this.scanCharacter(start, String.fromCharCode(this.peek));
            case $SQ:
            case $DQ:
              return this.scanString();
            case $PLUS:
            case $MINUS:
            case $STAR:
            case $SLASH:
            case $PERCENT:
            case $CARET:
            case $QUESTION:
              return this.scanOperator(start, String.fromCharCode(this.peek));
            case $LT:
            case $GT:
            case $BANG:
            case $EQ:
              return this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), "=");
            case $AMPERSAND:
              return this.scanComplexOperator(start, $AMPERSAND, "&", "&");
            case $BAR:
              return this.scanComplexOperator(start, $BAR, "|", "|");
            case $NBSP:
              while (isWhitespace(this.peek)) {
                this.advance();
              }

              return this.scanToken();
          }

          var character = String.fromCharCode(this.peek);
          this.error("Unexpected character [" + character + "]");
          return null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scanCharacter: {
        value: function scanCharacter(start, text) {
          assert(this.peek === text.charCodeAt(0));
          this.advance();
          return new Token(start, text);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scanOperator: {
        value: function scanOperator(start, text) {
          assert(this.peek === text.charCodeAt(0));
          assert(OPERATORS.indexOf(text) !== -1);
          this.advance();
          return new Token(start, text).withOp(text);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scanComplexOperator: {
        value: function scanComplexOperator(start, code, one, two) {
          assert(this.peek === one.charCodeAt(0));
          this.advance();

          var text = one;

          if (this.peek === code) {
            this.advance();
            text += two;
          }

          if (this.peek === code) {
            this.advance();
            text += two;
          }

          assert(OPERATORS.indexOf(text) != -1);

          return new Token(start, text).withOp(text);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scanIdentifier: {
        value: function scanIdentifier() {
          assert(isIdentifierStart(this.peek));
          var start = this.index;

          this.advance();

          while (isIdentifierPart(this.peek)) {
            this.advance();
          }

          var text = this.input.substring(start, this.index);
          var result = new Token(start, text);

          if (OPERATORS.indexOf(text) !== -1) {
            result.withOp(text);
          } else {
            result.withGetterSetter(text);
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scanNumber: {
        value: function scanNumber(start) {
          assert(isDigit(this.peek));
          var simple = this.index === start;
          this.advance();

          while (true) {
            if (isDigit(this.peek)) {} else if (this.peek === $PERIOD) {
              simple = false;
            } else if (isExponentStart(this.peek)) {
              this.advance();

              if (isExponentSign(this.peek)) {
                this.advance();
              }

              if (!isDigit(this.peek)) {
                this.error("Invalid exponent", -1);
              }

              simple = false;
            } else {
              break;
            }

            this.advance();
          }

          var text = this.input.substring(start, this.index);
          var value = simple ? parseInt(text) : parseFloat(text);
          return new Token(start, text).withValue(value);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      scanString: {
        value: function scanString() {
          assert(this.peek === $SQ || this.peek === $DQ);

          var start = this.index;
          var quote = this.peek;

          this.advance();

          var buffer;
          var marker = this.index;

          while (this.peek !== quote) {
            if (this.peek === $BACKSLASH) {
              if (buffer === null) {
                buffer = [];
              }

              buffer.push(this.input.substring(marker, this.index));
              this.advance();

              var unescaped;

              if (this.peek === $u) {
                var hex = this.input.substring(this.index + 1, this.index + 5);

                if (!/[A-Z0-9]{4}/.test(hex)) {
                  this.error("Invalid unicode escape [\\u" + hex + "]");
                }

                unescaped = parseInt(hex, 16);

                for (var i = 0; i < 5; ++i) {
                  this.advance();
                }
              } else {
                unescaped = decodeURIComponent(this.peek);
                this.advance();
              }

              buffer.push(String.fromCharCode(unescaped));
              marker = this.index;
            } else if (this.peek === $EOF) {
              this.error("Unterminated quote");
            } else {
              this.advance();
            }
          }

          var last = this.input.substring(marker, this.index);
          this.advance();
          var text = this.input.substring(start, this.index);

          var unescaped = last;

          if (buffer != null) {
            buffer.push(last);
            unescaped = buffer.join("");
          }

          return new Token(start, text).withValue(unescaped);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      advance: {
        value: function advance() {
          if (++this.index >= this.length) {
            this.peek = $EOF;
          } else {
            this.peek = this.input.charCodeAt(this.index);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      error: {
        value: function error(message) {
          var offset = arguments[1] === undefined ? 0 : arguments[1];
          var position = this.index + offset;
          throw new Error("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Scanner;
  })();

  exports.Scanner = Scanner;


  var OPERATORS = ["undefined", "null", "true", "false", "+", "-", "*", "/", "%", "^", "=", "==", "===", "!=", "!==", "<", ">", "<=", ">=", "&&", "||", "&", "|", "!", "?"];

  var $EOF = 0;
  var $TAB = 9;
  var $LF = 10;
  var $VTAB = 11;
  var $FF = 12;
  var $CR = 13;
  var $SPACE = 32;
  var $BANG = 33;
  var $DQ = 34;
  var $$ = 36;
  var $PERCENT = 37;
  var $AMPERSAND = 38;
  var $SQ = 39;
  var $LPAREN = 40;
  var $RPAREN = 41;
  var $STAR = 42;
  var $PLUS = 43;
  var $COMMA = 44;
  var $MINUS = 45;
  var $PERIOD = 46;
  var $SLASH = 47;
  var $COLON = 58;
  var $SEMICOLON = 59;
  var $LT = 60;
  var $EQ = 61;
  var $GT = 62;
  var $QUESTION = 63;

  var $0 = 48;
  var $9 = 57;

  var $A = 65;
  var $E = 69;
  var $Z = 90;

  var $LBRACKET = 91;
  var $BACKSLASH = 92;
  var $RBRACKET = 93;
  var $CARET = 94;
  var $_ = 95;

  var $a = 97;
  var $e = 101;
  var $f = 102;
  var $n = 110;
  var $r = 114;
  var $t = 116;
  var $u = 117;
  var $v = 118;
  var $z = 122;

  var $LBRACE = 123;
  var $BAR = 124;
  var $RBRACE = 125;
  var $NBSP = 160;

  function isWhitespace(code) {
    return code >= $TAB && code <= $SPACE || code === $NBSP;
  }

  function isIdentifierStart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || code === $_ || code === $$;
  }

  function isIdentifierPart(code) {
    return $a <= code && code <= $z || $A <= code && code <= $Z || $0 <= code && code <= $9 || code === $_ || code === $$;
  }

  function isDigit(code) {
    return $0 <= code && code <= $9;
  }

  function isExponentStart(code) {
    return code === $e || code === $E;
  }

  function isExponentSign(code) {
    return code === $MINUS || code === $PLUS;
  }

  function unescape(code) {
    switch (code) {
      case $n:
        return $LF;
      case $f:
        return $FF;
      case $r:
        return $CR;
      case $t:
        return $TAB;
      case $v:
        return $VTAB;
      default:
        return code;
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw message || "Assertion failed";
    }
  }
});
define('aurelia-binding/path-observer',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var PathObserver = (function () {
    function PathObserver(leftObserver, getRightObserver, value) {
      var _this = this;
      this.leftObserver = leftObserver;

      this.disposeLeft = leftObserver.subscribe(function (newValue) {
        var newRightValue = _this.updateRight(getRightObserver(newValue));
        _this.notify(newRightValue);
      });

      this.updateRight(getRightObserver(value));
    }

    _prototypeProperties(PathObserver, null, {
      updateRight: {
        value: function updateRight(observer) {
          var _this2 = this;
          this.rightObserver = observer;

          if (this.disposeRight) {
            this.disposeRight();
          }

          if (!observer) {
            return null;
          }

          this.disposeRight = observer.subscribe(function (newValue) {
            return _this2.notify(newValue);
          });
          return observer.getValue();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var that = this;
          that.callback = callback;
          return function () {
            that.callback = null;
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      notify: {
        value: function notify(newValue) {
          var callback = this.callback;

          if (callback) {
            callback(newValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      dispose: {
        value: function dispose() {
          if (this.disposeLeft) {
            this.disposeLeft();
          }

          if (this.disposeRight) {
            this.disposeRight();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return PathObserver;
  })();

  exports.PathObserver = PathObserver;
});
define('aurelia-binding/composite-observer',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var CompositeObserver = (function () {
    function CompositeObserver(observers, evaluate) {
      var _this = this;
      this.subscriptions = new Array(observers.length);
      this.evaluate = evaluate;

      for (var i = 0, ii = observers.length; i < ii; i++) {
        this.subscriptions[i] = observers[i].subscribe(function (newValue) {
          _this.notify(_this.evaluate());
        });
      }
    }

    _prototypeProperties(CompositeObserver, null, {
      subscribe: {
        value: function subscribe(callback) {
          var that = this;
          that.callback = callback;
          return function () {
            that.callback = null;
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      notify: {
        value: function notify(newValue) {
          var callback = this.callback;

          if (callback) {
            callback(newValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      dispose: {
        value: function dispose() {
          var subscriptions = this.subscriptions;

          while (i--) {
            subscriptions[i]();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CompositeObserver;
  })();

  exports.CompositeObserver = CompositeObserver;
});
define('aurelia-binding/ast',["exports", "./path-observer", "./composite-observer"], function (exports, _pathObserver, _compositeObserver) {
  

  var _get = function get(object, property, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var PathObserver = _pathObserver.PathObserver;
  var CompositeObserver = _compositeObserver.CompositeObserver;
  var Expression = (function () {
    function Expression() {
      this.isChain = false;
      this.isAssignable = false;
    }

    _prototypeProperties(Expression, null, {
      evaluate: {
        value: function evaluate() {
          throw new Error("Cannot evaluate " + this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      assign: {
        value: function assign() {
          throw new Error("Cannot assign to " + this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      toString: {
        value: function toString() {
          return Unparser.unparse(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Expression;
  })();

  exports.Expression = Expression;
  var Chain = (function (Expression) {
    function Chain(expressions) {
      _get(Object.getPrototypeOf(Chain.prototype), "constructor", this).call(this);

      this.expressions = expressions;
      this.isChain = true;
    }

    _inherits(Chain, Expression);

    _prototypeProperties(Chain, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var result,
              expressions = this.expressions,
              length = expressions.length,
              i,
              last;

          for (i = 0; i < length; ++i) {
            last = expressions[i].evaluate(scope, valueConverters);

            if (last !== null) {
              result = last;
            }
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitChain(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Chain;
  })(Expression);

  exports.Chain = Chain;
  var ValueConverter = (function (Expression) {
    function ValueConverter(expression, name, args, allArgs) {
      _get(Object.getPrototypeOf(ValueConverter.prototype), "constructor", this).call(this);

      this.expression = expression;
      this.name = name;
      this.args = args;
      this.allArgs = allArgs;
    }

    _inherits(ValueConverter, Expression);

    _prototypeProperties(ValueConverter, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var converter = valueConverters(this.name);
          if (!converter) {
            throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
          }

          if ("toView" in converter) {
            return converter.toView.apply(converter, evalList(scope, this.allArgs, valueConverters));
          }

          return this.allArgs[0].evaluate(scope, valueConverters);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      assign: {
        value: function assign(scope, value, valueConverters) {
          var converter = valueConverters(this.name);
          if (!converter) {
            throw new Error("No ValueConverter named \"" + this.name + "\" was found!");
          }

          if ("fromView" in converter) {
            value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, valueConverters)));
          }

          return this.allArgs[0].assign(scope, value, valueConverters);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitValueConverter(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;
          var observer,
              childObservers = [],
              i,
              ii,
              exp,
              expInfo;

          for (i = 0, ii = this.allArgs.length; i < ii; ++i) {
            exp = this.allArgs[i];
            expInfo = exp.connect(binding, scope);

            if (expInfo.observer) {
              childObservers.push(expInfo.observer);
            }
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ValueConverter;
  })(Expression);

  exports.ValueConverter = ValueConverter;
  var Assign = (function (Expression) {
    function Assign(target, value) {
      _get(Object.getPrototypeOf(Assign.prototype), "constructor", this).call(this);

      this.target = target;
      this.value = value;
    }

    _inherits(Assign, Expression);

    _prototypeProperties(Assign, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          return this.target.assign(scope, this.value.evaluate(scope, valueConverters));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(vistor) {
          vistor.visitAssign(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          return { value: this.evaluate(scope, binding.valueConverterLookupFunction) };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Assign;
  })(Expression);

  exports.Assign = Assign;
  var Conditional = (function (Expression) {
    function Conditional(condition, yes, no) {
      _get(Object.getPrototypeOf(Conditional.prototype), "constructor", this).call(this);

      this.condition = condition;
      this.yes = yes;
      this.no = no;
    }

    _inherits(Conditional, Expression);

    _prototypeProperties(Conditional, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          return !!this.condition.evaluate(scope) ? this.yes.evaluate(scope) : this.no.evaluate(scope);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitConditional(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this2 = this;
          var conditionInfo = this.condition.connect(binding, scope),
              yesInfo = this.yes.connect(binding, scope),
              noInfo = this.no.connect(binding, scope),
              childObservers = [],
              observer;

          if (conditionInfo.observer) {
            childObservers.push(conditionInfo.observer);
          }

          if (yesInfo.observer) {
            childObservers.push(yesInfo.observer);
          }

          if (noInfo.observer) {
            childObservers.push(noInfo.observer);
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this2.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Conditional;
  })(Expression);

  exports.Conditional = Conditional;
  var AccessScope = (function (Expression) {
    function AccessScope(name) {
      _get(Object.getPrototypeOf(AccessScope.prototype), "constructor", this).call(this);

      this.name = name;
      this.isAssignable = true;
    }

    _inherits(AccessScope, Expression);

    _prototypeProperties(AccessScope, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          return scope[this.name];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      assign: {
        value: function assign(scope, value) {
          return scope[this.name] = value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitAccessScope(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var observer = binding.getObserver(scope, this.name);

          return {
            value: observer.getValue(),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return AccessScope;
  })(Expression);

  exports.AccessScope = AccessScope;
  var AccessMember = (function (Expression) {
    function AccessMember(object, name) {
      _get(Object.getPrototypeOf(AccessMember.prototype), "constructor", this).call(this);

      this.object = object;
      this.name = name;
      this.isAssignable = true;
    }

    _inherits(AccessMember, Expression);

    _prototypeProperties(AccessMember, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var instance = this.object.evaluate(scope, valueConverters);
          return instance === null ? null : instance[this.name];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      assign: {
        value: function assign(scope, value) {
          var instance = this.object.evaluate(scope);

          if (!instance) {
            instance = {};
            this.object.assign(scope, instance);
          }

          return instance[this.name] = value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitAccessMember(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this3 = this;
          var info = this.object.connect(binding, scope),
              objectInstance = info.value,
              objectObserver = info.observer,
              observer;

          if (objectObserver) {
            observer = new PathObserver(objectObserver, function (value) {
              if (value == null) {
                return null;
              }

              return binding.getObserver(value, _this3.name);
            }, objectInstance);
          } else {
            observer = binding.getObserver(objectInstance, this.name);
          }

          return {
            value: objectInstance == null ? null : objectInstance[this.name],
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return AccessMember;
  })(Expression);

  exports.AccessMember = AccessMember;
  var AccessKeyed = (function (Expression) {
    function AccessKeyed(object, key) {
      _get(Object.getPrototypeOf(AccessKeyed.prototype), "constructor", this).call(this);

      this.object = object;
      this.key = key;
      this.isAssignable = true;
    }

    _inherits(AccessKeyed, Expression);

    _prototypeProperties(AccessKeyed, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var instance = this.object.evaluate(scope, valueConverters);
          var lookup = this.key.evaluate(scope, valueConverters);
          return getKeyed(instance, lookup);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      assign: {
        value: function assign(scope, value) {
          var instance = this.object.evaluate(scope);
          var lookup = this.key.evaluate(scope);
          return setKeyed(instance, lookup, value);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitAccessKeyed(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this4 = this;
          var objectInfo = this.object.connect(binding, scope),
              keyInfo = this.key.connect(binding, scope),
              childObservers = [],
              observer;

          if (objectInfo.observer) {
            childObservers.push(objectInfo.observer);
          }

          if (keyInfo.observer) {
            childObservers.push(keyInfo.observer);
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this4.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return AccessKeyed;
  })(Expression);

  exports.AccessKeyed = AccessKeyed;
  var CallScope = (function (Expression) {
    function CallScope(name, args) {
      _get(Object.getPrototypeOf(CallScope.prototype), "constructor", this).call(this);

      this.name = name;
      this.args = args;
    }

    _inherits(CallScope, Expression);

    _prototypeProperties(CallScope, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters, args) {
          args = args || evalList(scope, this.args, valueConverters);
          return ensureFunctionFromMap(scope, this.name).apply(scope, args);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitCallScope(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this5 = this;
          var observer,
              childObservers = [],
              i,
              ii,
              exp,
              expInfo;

          for (i = 0, ii = this.args.length; i < ii; ++i) {
            exp = this.args[i];
            expInfo = exp.connect(binding, scope);

            if (expInfo.observer) {
              childObservers.push(expInfo.observer);
            }
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this5.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CallScope;
  })(Expression);

  exports.CallScope = CallScope;
  var CallMember = (function (Expression) {
    function CallMember(object, name, args) {
      _get(Object.getPrototypeOf(CallMember.prototype), "constructor", this).call(this);

      this.object = object;
      this.name = name;
      this.args = args;
    }

    _inherits(CallMember, Expression);

    _prototypeProperties(CallMember, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters, args) {
          var instance = this.object.evaluate(scope, valueConverters);
          args = args || evalList(scope, this.args, valueConverters);
          return ensureFunctionFromMap(instance, this.name).apply(instance, args);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitCallMember(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this6 = this;
          var observer,
              objectInfo = this.object.connect(binding, scope),
              childObservers = [],
              i,
              ii,
              exp,
              expInfo;

          if (objectInfo.observer) {
            childObservers.push(objectInfo.observer);
          }

          for (i = 0, ii = this.args.length; i < ii; ++i) {
            exp = this.args[i];
            expInfo = exp.connect(binding, scope);

            if (expInfo.observer) {
              childObservers.push(expInfo.observer);
            }
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this6.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CallMember;
  })(Expression);

  exports.CallMember = CallMember;
  var CallFunction = (function (Expression) {
    function CallFunction(func, args) {
      _get(Object.getPrototypeOf(CallFunction.prototype), "constructor", this).call(this);

      this.func = func;
      this.args = args;
    }

    _inherits(CallFunction, Expression);

    _prototypeProperties(CallFunction, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters, args) {
          var func = this.func.evaluate(scope, valueConverters);

          if (typeof func !== "function") {
            throw new Error("" + this.func + " is not a function");
          } else {
            return func.apply(null, args || evalList(scope, this.args, valueConverters));
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitCallFunction(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this7 = this;
          var observer,
              funcInfo = this.func.connect(binding, scope),
              childObservers = [],
              i,
              ii,
              exp,
              expInfo;

          if (funcInfo.observer) {
            childObservers.push(funcInfo.observer);
          }

          for (i = 0, ii = this.args.length; i < ii; ++i) {
            exp = this.args[i];
            expInfo = exp.connect(binding, scope);

            if (expInfo.observer) {
              childObservers.push(expInfo.observer);
            }
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this7.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CallFunction;
  })(Expression);

  exports.CallFunction = CallFunction;
  var Binary = (function (Expression) {
    function Binary(operation, left, right) {
      _get(Object.getPrototypeOf(Binary.prototype), "constructor", this).call(this);

      this.operation = operation;
      this.left = left;
      this.right = right;
    }

    _inherits(Binary, Expression);

    _prototypeProperties(Binary, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var left = this.left.evaluate(scope);

          switch (this.operation) {
            case "&&":
              return !!left && !!this.right.evaluate(scope);
            case "||":
              return !!left || !!this.right.evaluate(scope);
          }

          var right = this.right.evaluate(scope);

          if (left === null || right === null) {
            switch (this.operation) {
              case "+":
                if (left != null) return left;
                if (right != null) return right;
                return 0;
              case "-":
                if (left != null) return left;
                if (right != null) return 0 - right;
                return 0;
            }

            return null;
          }

          switch (this.operation) {
            case "+":
              return autoConvertAdd(left, right);
            case "-":
              return left - right;
            case "*":
              return left * right;
            case "/":
              return left / right;
            case "%":
              return left % right;
            case "==":
              return left == right;
            case "===":
              return left === right;
            case "!=":
              return left != right;
            case "!==":
              return left !== right;
            case "<":
              return left < right;
            case ">":
              return left > right;
            case "<=":
              return left <= right;
            case ">=":
              return left >= right;
            case "^":
              return left ^ right;
            case "&":
              return left & right;
          }

          throw new Error("Internal error [" + this.operation + "] not handled");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitBinary(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this8 = this;
          var leftInfo = this.left.connect(binding, scope),
              rightInfo = this.right.connect(binding, scope),
              childObservers = [],
              observer;

          if (leftInfo.observer) {
            childObservers.push(leftInfo.observer);
          }

          if (rightInfo.observer) {
            childObservers.push(rightInfo.observer);
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this8.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Binary;
  })(Expression);

  exports.Binary = Binary;
  var PrefixNot = (function (Expression) {
    function PrefixNot(operation, expression) {
      _get(Object.getPrototypeOf(PrefixNot.prototype), "constructor", this).call(this);

      this.operation = operation;
      this.expression = expression;
    }

    _inherits(PrefixNot, Expression);

    _prototypeProperties(PrefixNot, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          return !this.expression.evaluate(scope);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitPrefix(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this9 = this;
          var info = this.expression.connect(binding, scope),
              observer;

          if (info.observer) {
            observer = new CompositeObserver([info.observer], function () {
              return _this9.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: !info.value,
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return PrefixNot;
  })(Expression);

  exports.PrefixNot = PrefixNot;
  var LiteralPrimitive = (function (Expression) {
    function LiteralPrimitive(value) {
      _get(Object.getPrototypeOf(LiteralPrimitive.prototype), "constructor", this).call(this);

      this.value = value;
    }

    _inherits(LiteralPrimitive, Expression);

    _prototypeProperties(LiteralPrimitive, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          return this.value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralPrimitive(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          return { value: this.value };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return LiteralPrimitive;
  })(Expression);

  exports.LiteralPrimitive = LiteralPrimitive;
  var LiteralString = (function (Expression) {
    function LiteralString(value) {
      _get(Object.getPrototypeOf(LiteralString.prototype), "constructor", this).call(this);

      this.value = value;
    }

    _inherits(LiteralString, Expression);

    _prototypeProperties(LiteralString, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          return this.value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralString(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          return { value: this.value };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return LiteralString;
  })(Expression);

  exports.LiteralString = LiteralString;
  var LiteralArray = (function (Expression) {
    function LiteralArray(elements) {
      _get(Object.getPrototypeOf(LiteralArray.prototype), "constructor", this).call(this);

      this.elements = elements;
    }

    _inherits(LiteralArray, Expression);

    _prototypeProperties(LiteralArray, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var elements = this.elements,
              length = elements.length,
              result = [],
              i;

          for (i = 0; i < length; ++i) {
            result[i] = elements[i].evaluate(scope, valueConverters);
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralArray(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this10 = this;
          var observer,
              childObservers = [],
              results = [],
              i,
              ii,
              exp,
              expInfo;

          for (i = 0, ii = this.elements.length; i < ii; ++i) {
            exp = this.elements[i];
            expInfo = exp.connect(binding, scope);

            if (expInfo.observer) {
              childObservers.push(expInfo.observer);
            }

            results[i] = expInfo.value;
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this10.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: results,
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return LiteralArray;
  })(Expression);

  exports.LiteralArray = LiteralArray;
  var LiteralObject = (function (Expression) {
    function LiteralObject(keys, values) {
      _get(Object.getPrototypeOf(LiteralObject.prototype), "constructor", this).call(this);

      this.keys = keys;
      this.values = values;
    }

    _inherits(LiteralObject, Expression);

    _prototypeProperties(LiteralObject, null, {
      evaluate: {
        value: function evaluate(scope, valueConverters) {
          var instance = {},
              keys = this.keys,
              values = this.values,
              length = keys.length,
              i;

          for (i = 0; i < length; ++i) {
            instance[keys[i]] = values[i].evaluate(scope, valueConverters);
          }

          return instance;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralObject(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this11 = this;
          var observer,
              childObservers = [],
              instance = {},
              keys = this.keys,
              values = this.values,
              length = keys.length,
              i,
              valueInfo;

          for (i = 0; i < length; ++i) {
            valueInfo = values[i].connect(binding, scope);

            if (valueInfo.observer) {
              childObservers.push(valueInfo.observer);
            }

            instance[keys[i]] = valueInfo.value;
          }

          if (childObservers.length) {
            observer = new CompositeObserver(childObservers, function () {
              return _this11.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: instance,
            observer: observer
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return LiteralObject;
  })(Expression);

  exports.LiteralObject = LiteralObject;
  var Unparser = (function () {
    function Unparser(buffer) {
      this.buffer = buffer;
    }

    _prototypeProperties(Unparser, {
      unparse: {
        value: function unparse(expression) {
          var buffer = [],
              visitor = new Unparser(buffer);

          expression.accept(visitor);

          return buffer.join("");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      write: {
        value: function write(text) {
          this.buffer.push(text);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      writeArgs: {
        value: function writeArgs(args) {
          var i, length;

          this.write("(");

          for (i = 0, length = args.length; i < length; ++i) {
            if (i !== 0) {
              this.write(",");
            }

            args[i].accept(this);
          }

          this.write(")");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitChain: {
        value: function visitChain(chain) {
          var expressions = chain.expressions,
              length = expressions.length,
              i;

          for (i = 0; i < length; ++i) {
            if (i !== 0) {
              this.write(";");
            }

            expressions[i].accept(this);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitValueConverter: {
        value: function visitValueConverter(converter) {
          var args = converter.args,
              length = args.length,
              i;

          this.write("(");
          converter.expression.accept(this);
          this.write("|" + converter.name);

          for (i = 0; i < length; ++i) {
            this.write(" :");
            args[i].accept(this);
          }

          this.write(")");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitAssign: {
        value: function visitAssign(assign) {
          assign.target.accept(this);
          this.write("=");
          assign.value.accept(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitConditional: {
        value: function visitConditional(conditional) {
          conditional.condition.accept(this);
          this.write("?");
          conditional.yes.accept(this);
          this.write(":");
          conditional.no.accept(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitAccessScope: {
        value: function visitAccessScope(access) {
          this.write(access.name);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitAccessMember: {
        value: function visitAccessMember(access) {
          access.object.accept(this);
          this.write("." + access.name);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitAccessKeyed: {
        value: function visitAccessKeyed(access) {
          access.object.accept(this);
          this.write("[");
          access.key.accept(this);
          this.write("]");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitCallScope: {
        value: function visitCallScope(call) {
          this.write(call.name);
          this.writeArgs(call.args);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitCallFunction: {
        value: function visitCallFunction(call) {
          call.func.accept(this);
          this.writeArgs(call.args);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitCallMember: {
        value: function visitCallMember(call) {
          call.object.accept(this);
          this.write("." + call.name);
          this.writeArgs(call.args);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitPrefix: {
        value: function visitPrefix(prefix) {
          this.write("(" + prefix.operation);
          prefix.expression.accept(this);
          this.write(")");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitBinary: {
        value: function visitBinary(binary) {
          this.write("(");
          binary.left.accept(this);
          this.write(binary.operation);
          binary.right.accept(this);
          this.write(")");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitLiteralPrimitive: {
        value: function visitLiteralPrimitive(literal) {
          this.write("" + literal.value);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitLiteralArray: {
        value: function visitLiteralArray(literal) {
          var elements = literal.elements,
              length = elements.length,
              i;

          this.write("[");

          for (i = 0; i < length; ++i) {
            if (i !== 0) {
              this.write(",");
            }

            elements[i].accept(this);
          }

          this.write("]");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitLiteralObject: {
        value: function visitLiteralObject(literal) {
          var keys = literal.keys,
              values = literal.values,
              length = keys.length,
              i;

          this.write("{");

          for (i = 0; i < length; ++i) {
            if (i !== 0) {
              this.write(",");
            }

            this.write("'" + keys[i] + "':");
            values[i].accept(this);
          }

          this.write("}");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      visitLiteralString: {
        value: function visitLiteralString(literal) {
          var escaped = literal.value.replace(/'/g, "'");
          this.write("'" + escaped + "'");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Unparser;
  })();

  exports.Unparser = Unparser;


  var evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];

  function evalList(scope, list, valueConverters) {
    var length = list.length,
        cacheLength,
        i;

    for (cacheLength = evalListCache.length; cacheLength <= length; ++cacheLength) {
      _evalListCache.push([]);
    }

    var result = evalListCache[length];

    for (i = 0; i < length; ++i) {
      result[i] = list[i].evaluate(scope, valueConverters);
    }

    return result;
  }

  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      if (typeof a == "string" && typeof b != "string") {
        return a + b.toString();
      }

      if (typeof a != "string" && typeof b == "string") {
        return a.toString() + b;
      }

      return a + b;
    }

    if (a != null) {
      return a;
    }

    if (b != null) {
      return b;
    }

    return 0;
  }

  function ensureFunctionFromMap(obj, name) {
    var func = obj[name];

    if (typeof func === "function") {
      return func;
    }

    if (func === null) {
      throw new Error("Undefined function " + name);
    } else {
      throw new Error("" + name + " is not a function");
    }
  }

  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key)];
    } else if (obj) {
      return obj[key];
    } else if (obj === null) {
      throw new Error("Accessing null object");
    } else {
      return obj[key];
    }
  }

  function setKeyed(obj, key, value) {
    if (Array.isArray(obj)) {
      var index = parseInt(key);

      if (obj.length <= index) {
        obj.length = index + 1;
      }

      obj[index] = value;
    } else {
      obj[key] = value;
    }

    return value;
  }
});
define('aurelia-binding/parser',["exports", "./lexer", "./ast"], function (exports, _lexer, _ast) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Lexer = _lexer.Lexer;
  var Token = _lexer.Token;
  var Expression = _ast.Expression;
  var ArrayOfExpression = _ast.ArrayOfExpression;
  var Chain = _ast.Chain;
  var ValueConverter = _ast.ValueConverter;
  var Assign = _ast.Assign;
  var Conditional = _ast.Conditional;
  var AccessScope = _ast.AccessScope;
  var AccessMember = _ast.AccessMember;
  var AccessKeyed = _ast.AccessKeyed;
  var CallScope = _ast.CallScope;
  var CallFunction = _ast.CallFunction;
  var CallMember = _ast.CallMember;
  var PrefixNot = _ast.PrefixNot;
  var Binary = _ast.Binary;
  var LiteralPrimitive = _ast.LiteralPrimitive;
  var LiteralArray = _ast.LiteralArray;
  var LiteralObject = _ast.LiteralObject;
  var LiteralString = _ast.LiteralString;


  var EOF = new Token(-1, null);

  var Parser = (function () {
    function Parser() {
      this.cache = {};
      this.lexer = new Lexer();
    }

    _prototypeProperties(Parser, null, {
      parse: {
        value: function parse(input) {
          input = input || "";

          return this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain());
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Parser;
  })();

  exports.Parser = Parser;
  var ParserImplementation = (function () {
    function ParserImplementation(lexer, input) {
      this.index = 0;
      this.input = input;
      this.tokens = lexer.lex(input);
    }

    _prototypeProperties(ParserImplementation, null, {
      peek: {
        get: function () {
          return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
        },
        enumerable: true,
        configurable: true
      },
      parseChain: {
        value: function parseChain() {
          var isChain = false,
              expressions = [];

          while (this.optional(";")) {
            isChain = true;
          }

          while (this.index < this.tokens.length) {
            if (this.peek.text === ")" || this.peek.text === "}" || this.peek.text === "]") {
              this.error("Unconsumed token " + this.peek.text);
            }

            var expr = this.parseValueConverter();
            expressions.push(expr);

            while (this.optional(";")) {
              isChain = true;
            }

            if (isChain && expr instanceof ValueConverter) {
              this.error("cannot have a value converter in a chain");
            }
          }

          return expressions.length === 1 ? expressions[0] : new Chain(expressions);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseValueConverter: {
        value: function parseValueConverter() {
          var result = this.parseExpression();

          while (this.optional("|")) {
            var name = this.peek.text,
                args = [];

            this.advance();

            while (this.optional(":")) {
              args.push(this.parseExpression());
            }

            result = new ValueConverter(result, name, args, [result].concat(args));
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseExpression: {
        value: function parseExpression() {
          var start = this.peek.index,
              result = this.parseConditional();

          while (this.peek.text === "=") {
            if (!result.isAssignable) {
              var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
              var expression = this.input.substring(start, end);

              this.error("Expression " + expression + " is not assignable");
            }

            this.expect("=");
            result = new Assign(result, this.parseConditional());
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseConditional: {
        value: function parseConditional() {
          var start = this.peek.index,
              result = this.parseLogicalOr();

          if (this.optional("?")) {
            var yes = this.parseExpression();

            if (!this.optional(":")) {
              var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
              var expression = this.input.substring(start, end);

              this.error("Conditional expression " + expression + " requires all 3 expressions");
            }

            var no = this.parseExpression();
            result = new Conditional(result, yes, no);
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseLogicalOr: {
        value: function parseLogicalOr() {
          var result = this.parseLogicalAnd();

          while (this.optional("||")) {
            result = new Binary("||", result, this.parseLogicalAnd());
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseLogicalAnd: {
        value: function parseLogicalAnd() {
          var result = this.parseEquality();

          while (this.optional("&&")) {
            result = new Binary("&&", result, this.parseEquality());
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseEquality: {
        value: function parseEquality() {
          var result = this.parseRelational();

          while (true) {
            if (this.optional("==")) {
              result = new Binary("==", result, this.parseRelational());
            } else if (this.optional("!=")) {
              result = new Binary("!=", result, this.parseRelational());
            } else if (this.optional("===")) {
              result = new Binary("===", result, this.parseRelational());
            } else if (this.optional("!==")) {
              result = new Binary("!==", result, this.parseRelational());
            } else {
              return result;
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseRelational: {
        value: function parseRelational() {
          var result = this.parseAdditive();

          while (true) {
            if (this.optional("<")) {
              result = new Binary("<", result, this.parseAdditive());
            } else if (this.optional(">")) {
              result = new Binary(">", result, this.parseAdditive());
            } else if (this.optional("<=")) {
              result = new Binary("<=", result, this.parseAdditive());
            } else if (this.optional(">=")) {
              result = new Binary(">=", result, this.parseAdditive());
            } else {
              return result;
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseAdditive: {
        value: function parseAdditive() {
          var result = this.parseMultiplicative();

          while (true) {
            if (this.optional("+")) {
              result = new Binary("+", result, this.parseMultiplicative());
            } else if (this.optional("-")) {
              result = new Binary("-", result, this.parseMultiplicative());
            } else {
              return result;
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseMultiplicative: {
        value: function parseMultiplicative() {
          var result = this.parsePrefix();

          while (true) {
            if (this.optional("*")) {
              result = new Binary("*", result, this.parsePrefix());
            } else if (this.optional("%")) {
              result = new Binary("%", result, this.parsePrefix());
            } else if (this.optional("/")) {
              result = new Binary("/", result, this.parsePrefix());
            } else {
              return result;
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parsePrefix: {
        value: function parsePrefix() {
          if (this.optional("+")) {
            return this.parsePrefix();
          } else if (this.optional("-")) {
            return new Binary("-", new LiteralPrimitive(0), this.parsePrefix());
          } else if (this.optional("!")) {
            return new PrefixNot("!", this.parsePrefix());
          } else {
            return this.parseAccessOrCallMember();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseAccessOrCallMember: {
        value: function parseAccessOrCallMember() {
          var result = this.parsePrimary();

          while (true) {
            if (this.optional(".")) {
              var name = this.peek.text;

              this.advance();

              if (this.optional("(")) {
                var args = this.parseExpressionList(")");
                this.expect(")");
                result = new CallMember(result, name, args);
              } else {
                result = new AccessMember(result, name);
              }
            } else if (this.optional("[")) {
              var key = this.parseExpression();
              this.expect("]");
              result = new AccessKeyed(result, key);
            } else if (this.optional("(")) {
              var args = this.parseExpressionList(")");
              this.expect(")");
              result = new CallFunction(result, args);
            } else {
              return result;
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parsePrimary: {
        value: function parsePrimary() {
          if (this.optional("(")) {
            var result = this.parseExpression();
            this.expect(")");
            return result;
          } else if (this.optional("null") || this.optional("undefined")) {
            return new LiteralPrimitive(null);
          } else if (this.optional("true")) {
            return new LiteralPrimitive(true);
          } else if (this.optional("false")) {
            return new LiteralPrimitive(false);
          } else if (this.optional("[")) {
            var elements = this.parseExpressionList("]");
            this.expect("]");
            return new LiteralArray(elements);
          } else if (this.peek.text == "{") {
            return this.parseObject();
          } else if (this.peek.key != null) {
            return this.parseAccessOrCallScope();
          } else if (this.peek.value != null) {
            var value = this.peek.value;
            this.advance();
            return isNaN(value) ? new LiteralString(value) : new LiteralPrimitive(value);
          } else if (this.index >= this.tokens.length) {
            throw new Error("Unexpected end of expression: " + this.input);
          } else {
            this.error("Unexpected token " + this.peek.text);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseAccessOrCallScope: {
        value: function parseAccessOrCallScope() {
          var name = this.peek.key;

          this.advance();

          if (!this.optional("(")) {
            return new AccessScope(name);
          }

          var args = this.parseExpressionList(")");
          this.expect(")");
          return new CallScope(name, args);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseObject: {
        value: function parseObject() {
          var keys = [],
              values = [];

          this.expect("{");

          if (this.peek.text !== "}") {
            do {
              var value = this.peek.value;
              keys.push(typeof value === "string" ? value : this.peek.text);

              this.advance();
              this.expect(":");

              values.push(this.parseExpression());
            } while (this.optional(","));
          }

          this.expect("}");

          return new LiteralObject(keys, values);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseExpressionList: {
        value: function parseExpressionList(terminator) {
          var result = [];

          if (this.peek.text != terminator) {
            do {
              result.push(this.parseExpression());
            } while (this.optional(","));
          }

          return result;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      optional: {
        value: function optional(text) {
          if (this.peek.text === text) {
            this.advance();
            return true;
          }

          return false;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      expect: {
        value: function expect(text) {
          if (this.peek.text === text) {
            this.advance();
          } else {
            this.error("Missing expected " + text);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      advance: {
        value: function advance() {
          this.index++;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      error: {
        value: function error(message) {
          var location = this.index < this.tokens.length ? "at column " + (this.tokens[this.index].index + 1) + " in" : "at the end of the expression";

          throw new Error("Parser Error: " + message + " " + location + " [" + this.input + "]");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ParserImplementation;
  })();

  exports.ParserImplementation = ParserImplementation;
});
define('aurelia-binding/binding-expression',["exports", "./binding-modes"], function (exports, _bindingModes) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ONE_WAY = _bindingModes.ONE_WAY;
  var TWO_WAY = _bindingModes.TWO_WAY;
  var BindingExpression = (function () {
    function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, valueConverterLookupFunction, attribute) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
      this.attribute = attribute;
      this.discrete = false;
    }

    _prototypeProperties(BindingExpression, null, {
      createBinding: {
        value: function createBinding(target) {
          return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BindingExpression;
  })();

  exports.BindingExpression = BindingExpression;
  var Binding = (function () {
    function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }

    _prototypeProperties(Binding, null, {
      getObserver: {
        value: function getObserver(obj, propertyName) {
          return this.observerLocator.getObserver(obj, propertyName);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bind: {
        value: function bind(source) {
          var _this = this;
          var targetProperty = this.targetProperty,
              info;

          if (this.mode == ONE_WAY || this.mode == TWO_WAY) {
            if (this._disposeObserver) {
              if (this.source === source) {
                return;
              }

              this.unbind();
            }

            info = this.sourceExpression.connect(this, source);

            if (info.observer) {
              this._disposeObserver = info.observer.subscribe(function (newValue) {
                var existing = targetProperty.getValue();
                if (newValue !== existing) {
                  targetProperty.setValue(newValue);
                }
              });
            }

            if (info.value !== undefined) {
              targetProperty.setValue(info.value);
            }

            if (this.mode == TWO_WAY) {
              this._disposeListener = targetProperty.subscribe(function (newValue) {
                _this.sourceExpression.assign(source, newValue, _this.valueConverterLookupFunction);
              });
            }

            this.source = source;
          } else {
            var value = this.sourceExpression.evaluate(source, this.valueConverterLookupFunction);

            if (value !== undefined) {
              targetProperty.setValue(value);
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          if (this._disposeObserver) {
            this._disposeObserver();
            this._disposeObserver = null;
          }

          if (this._disposeListener) {
            this._disposeListener();
            this._disposeListener = null;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Binding;
  })();
});
define('aurelia-binding/listener-expression',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ListenerExpression = (function () {
    function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.sourceExpression = sourceExpression;
      this.delegate = delegate;
      this.discrete = true;
      this.preventDefault = preventDefault;
    }

    _prototypeProperties(ListenerExpression, null, {
      createBinding: {
        value: function createBinding(target) {
          return new Listener(this.eventManager, this.targetEvent, this.delegate, this.sourceExpression, target, this.preventDefault);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ListenerExpression;
  })();

  exports.ListenerExpression = ListenerExpression;
  var Listener = (function () {
    function Listener(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault) {
      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.delegate = delegate;
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.preventDefault = preventDefault;
    }

    _prototypeProperties(Listener, null, {
      bind: {
        value: function bind(source) {
          var _this = this;
          if (this._disposeListener) {
            if (this.source === source) {
              return;
            }

            this.unbind();
          }

          this.source = source;
          this._disposeListener = this.eventManager.addEventListener(this.target, this.targetEvent, function (event) {
            var prevEvent = source.$event;
            source.$event = event;
            var result = _this.sourceExpression.evaluate(source);
            source.$event = prevEvent;
            if (_this.preventDefault) {
              event.preventDefault();
            }
            return result;
          }, this.delegate);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          if (this._disposeListener) {
            this._disposeListener();
            this._disposeListener = null;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Listener;
  })();
});
define('aurelia-binding/name-expression',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var NameExpression = (function () {
    function NameExpression(name, mode) {
      this.property = name;
      this.discrete = true;
      this.mode = (mode || "view-model").toLowerCase();
    }

    _prototypeProperties(NameExpression, null, {
      createBinding: {
        value: function createBinding(target) {
          return new NameBinder(this.property, target, this.mode);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return NameExpression;
  })();

  exports.NameExpression = NameExpression;
  var NameBinder = (function () {
    function NameBinder(property, target, mode) {
      this.property = property;

      switch (mode) {
        case "element":
          this.target = target;
          break;
        case "view-model":
          this.target = target.primaryBehavior ? target.primaryBehavior.executionContext : target;
          break;
        default:
          throw new Error("Name expressions do not support mode: " + mode);
      }
    }

    _prototypeProperties(NameBinder, null, {
      bind: {
        value: function bind(source) {
          if (this.source) {
            if (this.source === source) {
              return;
            }

            this.unbind();
          }

          this.source = source;
          source[this.property] = this.target;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.source[this.property] = null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return NameBinder;
  })();
});
define('aurelia-binding/call-expression',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var CallExpression = (function () {
    function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }

    _prototypeProperties(CallExpression, null, {
      createBinding: {
        value: function createBinding(target) {
          return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.valueConverterLookupFunction);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CallExpression;
  })();

  exports.CallExpression = CallExpression;
  var Call = (function () {
    function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }

    _prototypeProperties(Call, null, {
      bind: {
        value: function bind(source) {
          var _this = this;
          if (this.source === source) {
            return;
          }

          if (this.source) {
            this.unbind();
          }

          this.source = source;
          this.targetProperty.setValue(function () {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
              rest[_key] = arguments[_key];
            }

            return _this.sourceExpression.evaluate(source, _this.valueConverterLookupFunction, rest);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.targetProperty.setValue(null);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Call;
  })();
});
define('aurelia-binding/index',["exports", "aurelia-metadata", "./value-converter", "./event-manager", "./observer-locator", "./array-change-records", "./binding-modes", "./parser", "./binding-expression", "./listener-expression", "./name-expression", "./call-expression", "./dirty-checking"], function (exports, _aureliaMetadata, _valueConverter, _eventManager, _observerLocator, _arrayChangeRecords, _bindingModes, _parser, _bindingExpression, _listenerExpression, _nameExpression, _callExpression, _dirtyChecking) {
  

  var _interopRequireWildcard = function (obj) {
    return obj && obj.constructor === Object ? obj : {
      "default": obj
    };
  };

  var _defaults = function (obj, defaults) {
    for (var key in defaults) {
      if (obj[key] === undefined) {
        obj[key] = defaults[key];
      }
    }

    return obj;
  };

  var Metadata = _aureliaMetadata.Metadata;
  var ValueConverter = _valueConverter.ValueConverter;
  exports.EventManager = _eventManager.EventManager;
  exports.ObserverLocator = _observerLocator.ObserverLocator;
  exports.ValueConverter = _valueConverter.ValueConverter;
  exports.calcSplices = _arrayChangeRecords.calcSplices;
  _defaults(exports, _interopRequireWildcard(_bindingModes));

  exports.Parser = _parser.Parser;
  exports.BindingExpression = _bindingExpression.BindingExpression;
  exports.ListenerExpression = _listenerExpression.ListenerExpression;
  exports.NameExpression = _nameExpression.NameExpression;
  exports.CallExpression = _callExpression.CallExpression;
  exports.DirtyChecker = _dirtyChecking.DirtyChecker;


  Metadata.configure.classHelper("valueConverter", ValueConverter);
});
define('aurelia-binding', ['aurelia-binding/index'], function (main) { return main; });

define('aurelia-templating/property',["exports", "./util", "aurelia-binding"], function (exports, _util, _aureliaBinding) {
  

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var hyphenate = _util.hyphenate;
  var ONE_WAY = _aureliaBinding.ONE_WAY;
  var TWO_WAY = _aureliaBinding.TWO_WAY;
  var ONE_TIME = _aureliaBinding.ONE_TIME;
  var BehaviorProperty = (function () {
    function BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
      this.name = name;
      this.changeHandler = changeHandler;
      this.attribute = attribute || hyphenate(name);
      this.defaultValue = defaultValue;
      this.defaultBindingMode = defaultBindingMode || ONE_WAY;
    }

    _prototypeProperties(BehaviorProperty, null, {
      bindingIsTwoWay: {
        value: function bindingIsTwoWay() {
          this.defaultBindingMode = TWO_WAY;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bindingIsOneWay: {
        value: function bindingIsOneWay() {
          this.defaultBindingMode = ONE_WAY;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bindingIsOneTime: {
        value: function bindingIsOneTime() {
          this.defaultBindingMode = ONE_TIME;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      define: {
        value: function define(taskQueue, behavior) {
          var that = this,
              handlerName;

          this.taskQueue = taskQueue;

          if (!this.changeHandler) {
            handlerName = this.name + "Changed";
            if (handlerName in behavior.target.prototype) {
              this.changeHandler = handlerName;
            }
          }

          behavior.properties.push(this);
          behavior.attributes[this.attribute] = this;

          Object.defineProperty(behavior.target.prototype, this.name, {
            configurable: true,
            enumerable: true,
            get: function () {
              return this.__observers__[that.name].getValue();
            },
            set: function (value) {
              this.__observers__[that.name].setValue(value);
            }
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createObserver: {
        value: function createObserver(executionContext) {
          var _this = this;
          var selfSubscriber = null;

          if (this.changeHandler) {
            selfSubscriber = function (newValue, oldValue) {
              return executionContext[_this.changeHandler](newValue, oldValue);
            };
          }

          return new BehaviorPropertyObserver(this.taskQueue, executionContext, this.name, selfSubscriber);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      initialize: {
        value: function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
          var selfSubscriber, observer, attribute;

          observer = observerLookup[this.name];

          if (attributes !== undefined) {
            selfSubscriber = observer.selfSubscriber;
            attribute = attributes[this.attribute];

            if (behaviorHandlesBind) {
              observer.selfSubscriber = null;
            }

            if (typeof attribute === "string") {
              executionContext[this.name] = attribute;
              observer.call();
            } else if (attribute) {
              boundProperties.push({ observer: observer, binding: attribute.createBinding(executionContext) });
            } else if (this.defaultValue) {
              executionContext[this.name] = this.defaultValue;
              observer.call();
            }

            observer.selfSubscriber = selfSubscriber;
          }

          observer.publishing = true;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BehaviorProperty;
  })();

  exports.BehaviorProperty = BehaviorProperty;
  var OptionsProperty = (function (BehaviorProperty) {
    function OptionsProperty(attribute) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      if (typeof attribute === "string") {
        this.attribute = attribute;
      } else if (attribute) {
        rest.unshift(attribute);
      }

      this.properties = rest;
      this.hasOptions = true;
    }

    _inherits(OptionsProperty, BehaviorProperty);

    _prototypeProperties(OptionsProperty, null, {
      dynamic: {
        value: function dynamic() {
          this.isDynamic = true;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withProperty: {
        value: function withProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
          this.properties.push(new BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode));
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      define: {
        value: function define(taskQueue, behavior) {
          var i,
              ii,
              properties = this.properties;

          this.attribute = this.attribute || behavior.name;

          behavior.properties.push(this);
          behavior.attributes[this.attribute] = this;

          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].define(taskQueue, behavior);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createObserver: {
        value: function createObserver(executionContext) {},
        writable: true,
        enumerable: true,
        configurable: true
      },
      initialize: {
        value: function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
          var value, key, info;

          if (!this.isDynamic) {
            return;
          }

          for (key in attributes) {
            this.createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createDynamicProperty: {
        value: function createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
          var changeHandlerName = name + "Changed",
              selfSubscriber = null,
              observer,
              info;

          if (changeHandlerName in executionContext) {
            selfSubscriber = function (newValue, oldValue) {
              return executionContext[changeHandlerName](newValue, oldValue);
            };
          }

          observer = observerLookup[name] = new BehaviorPropertyObserver(this.taskQueue, executionContext, name, selfSubscriber);

          Object.defineProperty(executionContext, name, {
            configurable: true,
            enumerable: true,
            get: observer.getValue.bind(observer),
            set: observer.setValue.bind(observer)
          });

          if (behaviorHandlesBind) {
            observer.selfSubscriber = null;
          }

          if (typeof attribute === "string") {
            executionContext[name] = attribute;
            observer.call();
          } else if (attribute) {
            info = { observer: observer, binding: attribute.createBinding(executionContext) };
            boundProperties.push(info);
          }

          observer.publishing = true;
          observer.selfSubscriber = selfSubscriber;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return OptionsProperty;
  })(BehaviorProperty);

  exports.OptionsProperty = OptionsProperty;
  var BehaviorPropertyObserver = (function () {
    function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber) {
      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.notqueued = true;
      this.publishing = false;
      this.selfSubscriber = selfSubscriber;
    }

    _prototypeProperties(BehaviorPropertyObserver, null, {
      getValue: {
        value: function getValue() {
          return this.currentValue;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          var oldValue = this.currentValue;

          if (oldValue != newValue) {
            if (this.publishing && this.notqueued) {
              this.notqueued = false;
              this.taskQueue.queueMicroTask(this);
            }

            this.oldValue = oldValue;
            this.currentValue = newValue;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call() {
          var callbacks = this.callbacks,
              i = callbacks.length,
              oldValue = this.oldValue,
              newValue = this.currentValue;

          this.notqueued = true;

          if (newValue != oldValue) {
            if (this.selfSubscriber !== null) {
              this.selfSubscriber(newValue, oldValue);
            }

            while (i--) {
              callbacks[i](newValue, oldValue);
            }

            this.oldValue = newValue;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var callbacks = this.callbacks;
          callbacks.push(callback);
          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BehaviorPropertyObserver;
  })();
});
define('aurelia-templating/behavior-instance',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var BehaviorInstance = (function () {
    function BehaviorInstance(behavior, executionContext, instruction) {
      this.behavior = behavior;
      this.executionContext = executionContext;

      var observerLookup = behavior.observerLocator.getObserversLookup(executionContext),
          handlesBind = behavior.handlesBind,
          attributes = instruction.attributes,
          boundProperties = this.boundProperties = [],
          properties = behavior.properties,
          i,
          ii;

      for (i = 0, ii = properties.length; i < ii; ++i) {
        properties[i].initialize(executionContext, observerLookup, attributes, handlesBind, boundProperties);
      }
    }

    _prototypeProperties(BehaviorInstance, null, {
      created: {
        value: function created(context) {
          if (this.behavior.handlesCreated) {
            this.executionContext.created(context);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bind: {
        value: function bind(context) {
          var skipSelfSubscriber = this.behavior.handlesBind,
              boundProperties = this.boundProperties,
              i,
              ii,
              x,
              observer,
              selfSubscriber;

          for (i = 0, ii = boundProperties.length; i < ii; ++i) {
            x = boundProperties[i];
            observer = x.observer;
            selfSubscriber = observer.selfSubscriber;
            observer.publishing = false;

            if (skipSelfSubscriber) {
              observer.selfSubscriber = null;
            }

            x.binding.bind(context);
            observer.call();

            observer.publishing = true;
            observer.selfSubscriber = selfSubscriber;
          }

          if (skipSelfSubscriber) {
            this.executionContext.bind(context);
          }

          if (this.view) {
            this.view.bind(this.executionContext);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          var boundProperties = this.boundProperties,
              i,
              ii;

          if (this.view) {
            this.view.unbind();
          }

          if (this.behavior.handlesUnbind) {
            this.executionContext.unbind();
          }

          for (i = 0, ii = boundProperties.length; i < ii; ++i) {
            boundProperties[i].binding.unbind();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      attached: {
        value: function attached() {
          if (this.behavior.handlesAttached) {
            this.executionContext.attached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      detached: {
        value: function detached() {
          if (this.behavior.handlesDetached) {
            this.executionContext.detached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BehaviorInstance;
  })();

  exports.BehaviorInstance = BehaviorInstance;
});
define('aurelia-templating/children',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var noMutations = [];

  var ChildObserver = (function () {
    function ChildObserver(property, changeHandler, selector) {
      this.selector = selector;
      this.changeHandler = changeHandler;
      this.property = property;
    }

    _prototypeProperties(ChildObserver, null, {
      createBinding: {
        value: function createBinding(target, behavior) {
          return new ChildObserverBinder(this.selector, target, this.property, behavior, this.changeHandler);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ChildObserver;
  })();

  exports.ChildObserver = ChildObserver;
  var ChildObserverBinder = (function () {
    function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
      this.selector = selector;
      this.target = target;
      this.property = property;
      this.target = target;
      this.behavior = behavior;
      this.changeHandler = changeHandler;
      this.observer = new MutationObserver(this.onChange.bind(this));
    }

    _prototypeProperties(ChildObserverBinder, null, {
      bind: {
        value: function bind(source) {
          var items,
              results,
              i,
              ii,
              node,
              behavior = this.behavior;

          this.observer.observe(this.target, { childList: true, subtree: true });

          items = behavior[this.property];
          if (!items) {
            items = behavior[this.property] = [];
          } else {
            items.length = 0;
          }

          results = this.target.querySelectorAll(this.selector);

          for (i = 0, ii = results.length; i < ii; ++i) {
            node = results[i];
            items.push(node.primaryBehavior ? node.primaryBehavior.executionContext : node);
          }

          if (this.changeHandler) {
            this.behavior[this.changeHandler](noMutations);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.observer.disconnect();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      onChange: {
        value: function onChange(mutations) {
          var items = this.behavior[this.property],
              selector = this.selector;

          mutations.forEach(function (record) {
            var added = record.addedNodes,
                removed = record.removedNodes,
                prev = record.previousSibling,
                i,
                ii,
                primary,
                index,
                node;

            for (i = 0, ii = removed.length; i < ii; ++i) {
              node = removed[i];
              if (node.nodeType === 1 && node.matches(selector)) {
                primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
                index = items.indexOf(primary);
                if (index != -1) {
                  items.splice(index, 1);
                }
              }
            }

            for (i = 0, ii = added.length; i < ii; ++i) {
              node = added[i];
              if (node.nodeType === 1 && node.matches(selector)) {
                primary = node.primaryBehavior ? node.primaryBehavior.executionContext : node;
                index = 0;

                while (prev) {
                  if (prev.nodeType === 1 && prev.matches(selector)) {
                    index++;
                  }

                  prev = prev.previousSibling;
                }

                items.splice(index, 0, primary);
              }
            }
          });

          if (this.changeHandler) {
            this.behavior[this.changeHandler](mutations);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ChildObserverBinder;
  })();

  exports.ChildObserverBinder = ChildObserverBinder;
});
define('aurelia-templating/behaviors',["exports", "aurelia-metadata", "aurelia-task-queue", "aurelia-binding", "./children", "./property", "./util"], function (exports, _aureliaMetadata, _aureliaTaskQueue, _aureliaBinding, _children, _property, _util) {
  

  exports.configureBehavior = configureBehavior;
  var Metadata = _aureliaMetadata.Metadata;
  var TaskQueue = _aureliaTaskQueue.TaskQueue;
  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var ChildObserver = _children.ChildObserver;
  var BehaviorProperty = _property.BehaviorProperty;
  var hyphenate = _util.hyphenate;
  function configureBehavior(container, behavior, target, valuePropertyName) {
    var proto = target.prototype,
        taskQueue = container.get(TaskQueue),
        meta = Metadata.on(target),
        observerLocator = container.get(ObserverLocator),
        i,
        ii,
        properties;

    if (!behavior.name) {
      behavior.name = hyphenate(target.name);
    }

    behavior.target = target;
    behavior.observerLocator = observerLocator;
    behavior.handlesCreated = "created" in proto;
    behavior.handlesBind = "bind" in proto;
    behavior.handlesUnbind = "unbind" in proto;
    behavior.handlesAttached = "attached" in proto;
    behavior.handlesDetached = "detached" in proto;

    properties = meta.all(BehaviorProperty);

    for (i = 0, ii = properties.length; i < ii; ++i) {
      properties[i].define(taskQueue, behavior);
    }

    properties = behavior.properties;

    if (properties.length === 0 && "valueChanged" in target.prototype) {
      new BehaviorProperty("value", "valueChanged", valuePropertyName || behavior.name).define(taskQueue, behavior);
    }

    if (properties.length !== 0) {
      target.initialize = function (executionContext) {
        var observerLookup = observerLocator.getObserversLookup(executionContext),
            i,
            ii,
            observer;

        for (i = 0, ii = properties.length; i < ii; ++i) {
          observer = properties[i].createObserver(executionContext);

          if (observer !== undefined) {
            observerLookup[observer.propertyName] = observer;
          }
        }
      };
    }

    behavior.childExpression = meta.first(ChildObserver);
  }
});
define('aurelia-templating/attached-behavior',["exports", "aurelia-metadata", "./behavior-instance", "./behaviors", "./util"], function (exports, _aureliaMetadata, _behaviorInstance, _behaviors, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var ResourceType = _aureliaMetadata.ResourceType;
  var BehaviorInstance = _behaviorInstance.BehaviorInstance;
  var configureBehavior = _behaviors.configureBehavior;
  var hyphenate = _util.hyphenate;
  var AttachedBehavior = (function (ResourceType) {
    function AttachedBehavior(attribute) {
      this.name = attribute;
      this.properties = [];
      this.attributes = {};
    }

    _inherits(AttachedBehavior, ResourceType);

    _prototypeProperties(AttachedBehavior, {
      convention: {
        value: function convention(name) {
          if (name.endsWith("AttachedBehavior")) {
            return new AttachedBehavior(hyphenate(name.substring(0, name.length - 16)));
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      analyze: {
        value: function analyze(container, target) {
          configureBehavior(container, this, target);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      load: {
        value: function load(container, target) {
          return Promise.resolve(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerAttribute(name || this.name, this, this.name);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      compile: {
        value: function compile(compiler, resources, node, instruction) {
          instruction.suppressBind = true;
          return node;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      create: {
        value: function create(container, instruction, element, bindings) {
          var executionContext = instruction.executionContext || container.get(this.target),
              behaviorInstance = new BehaviorInstance(this, executionContext, instruction);

          if (this.childExpression) {
            bindings.push(this.childExpression.createBinding(element, behaviorInstance.executionContext));
          }

          return behaviorInstance;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return AttachedBehavior;
  })(ResourceType);

  exports.AttachedBehavior = AttachedBehavior;
});
define('aurelia-templating/content-selector',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
  }

  var placeholder = [];

  function findInsertionPoint(groups, index) {
    var insertionPoint;

    while (!insertionPoint && index >= 0) {
      insertionPoint = groups[index][0];
      index--;
    }

    return insertionPoint || anchor;
  }

  var ContentSelector = (function () {
    function ContentSelector(anchor, selector) {
      this.anchor = anchor;
      this.selector = selector;
      this.all = !this.selector;
      this.groups = [];
    }

    _prototypeProperties(ContentSelector, {
      applySelectors: {
        value: function applySelectors(view, contentSelectors, callback) {
          var currentChild = view.fragment.firstChild,
              contentMap = new Map(),
              nextSibling,
              i,
              ii,
              contentSelector;

          while (currentChild) {
            nextSibling = currentChild.nextSibling;

            if (currentChild.viewSlot) {
              var viewSlotSelectors = contentSelectors.map(function (x) {
                return x.copyForViewSlot();
              });
              currentChild.viewSlot.installContentSelectors(viewSlotSelectors);
            } else {
              for (i = 0, ii = contentSelectors.length; i < ii; i++) {
                contentSelector = contentSelectors[i];
                if (contentSelector.matches(currentChild)) {
                  var elements = contentMap.get(contentSelector);
                  if (!elements) {
                    elements = [];
                    contentMap.set(contentSelector, elements);
                  }

                  elements.push(currentChild);
                  break;
                }
              }
            }

            currentChild = nextSibling;
          }

          for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
            contentSelector = contentSelectors[i];
            callback(contentSelector, contentMap.get(contentSelector) || placeholder);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      copyForViewSlot: {
        value: function copyForViewSlot() {
          return new ContentSelector(this.anchor, this.selector);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      matches: {
        value: function matches(node) {
          return this.all || node.nodeType === 1 && node.matches(this.selector);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      add: {
        value: function add(group) {
          var anchor = this.anchor,
              parent = anchor.parentNode,
              i,
              ii;

          for (i = 0, ii = group.length; i < ii; ++i) {
            parent.insertBefore(group[i], anchor);
          }

          this.groups.push(group);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      insert: {
        value: function insert(index, group) {
          if (group.length) {
            var anchor = findInsertionPoint(this.groups, index) || this.anchor,
                parent = anchor.parentNode,
                i,
                ii;

            for (i = 0, ii = group.length; i < ii; ++i) {
              parent.insertBefore(group[i], anchor);
            }
          }

          this.groups.splice(index, 0, group);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      removeAt: {
        value: function removeAt(index, fragment) {
          var group = this.groups[index],
              i,
              ii;

          for (i = 0, ii = group.length; i < ii; ++i) {
            fragment.appendChild(group[i]);
          }

          this.groups.splice(index, 1);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ContentSelector;
  })();

  exports.ContentSelector = ContentSelector;
});
define('aurelia-templating/resource-registry',["exports", "aurelia-path"], function (exports, _aureliaPath) {
  

  var _get = function get(object, property, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      return desc.value;
    } else {
      var getter = desc.get;
      if (getter === undefined) {
        return undefined;
      }
      return getter.call(receiver);
    }
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var relativeToFile = _aureliaPath.relativeToFile;


  function register(lookup, name, resource, type) {
    if (!name) {
      return;
    }

    var existing = lookup[name];
    if (existing) {
      if (existing != resource) {
        throw new Error("Attempted to register " + type + " when one with the same name already exists. Name: " + name + ".");
      }

      return;
    }

    lookup[name] = resource;
  }

  var ResourceRegistry = (function () {
    function ResourceRegistry() {
      this.attributes = {};
      this.elements = {};
      this.valueConverters = {};
      this.attributeMap = {};
      this.baseResourceUrl = "";
    }

    _prototypeProperties(ResourceRegistry, null, {
      registerElement: {
        value: function registerElement(tagName, behavior) {
          register(this.elements, tagName, behavior, "an Element");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getElement: {
        value: function getElement(tagName) {
          return this.elements[tagName];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerAttribute: {
        value: function registerAttribute(attribute, behavior, knownAttribute) {
          this.attributeMap[attribute] = knownAttribute;
          register(this.attributes, attribute, behavior, "an Attribute");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getAttribute: {
        value: function getAttribute(attribute) {
          return this.attributes[attribute];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      registerValueConverter: {
        value: function registerValueConverter(name, valueConverter) {
          register(this.valueConverters, name, valueConverter, "a ValueConverter");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getValueConverter: {
        value: function getValueConverter(name) {
          return this.valueConverters[name];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ResourceRegistry;
  })();

  exports.ResourceRegistry = ResourceRegistry;
  var ViewResources = (function (ResourceRegistry) {
    function ViewResources(parent, viewUrl) {
      _get(Object.getPrototypeOf(ViewResources.prototype), "constructor", this).call(this);
      this.parent = parent;
      this.viewUrl = viewUrl;
      this.valueConverterLookupFunction = this.getValueConverter.bind(this);
    }

    _inherits(ViewResources, ResourceRegistry);

    _prototypeProperties(ViewResources, null, {
      relativeToView: {
        value: function relativeToView(path) {
          return relativeToFile(path, this.viewUrl);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getElement: {
        value: function getElement(tagName) {
          return this.elements[tagName] || this.parent.getElement(tagName);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getAttribute: {
        value: function getAttribute(attribute) {
          return this.attributes[attribute] || this.parent.getAttribute(attribute);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getValueConverter: {
        value: function getValueConverter(name) {
          return this.valueConverters[name] || this.parent.getValueConverter(name);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ViewResources;
  })(ResourceRegistry);

  exports.ViewResources = ViewResources;
});
define('aurelia-templating/view',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var View = (function () {
    function View(fragment, behaviors, bindings, children, systemControlled, contentSelectors) {
      this.fragment = fragment;
      this.behaviors = behaviors;
      this.bindings = bindings;
      this.children = children;
      this.systemControlled = systemControlled;
      this.contentSelectors = contentSelectors;
      this.firstChild = fragment.firstChild;
      this.lastChild = fragment.lastChild;
      this.isBound = false;
      this.isAttached = false;
    }

    _prototypeProperties(View, null, {
      created: {
        value: function created(executionContext) {
          var i,
              ii,
              behaviors = this.behaviors;
          for (i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].created(executionContext);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bind: {
        value: function bind(executionContext, systemUpdate) {
          var context, behaviors, bindings, children, i, ii;

          if (systemUpdate && !this.systemControlled) {
            context = this.executionContext || executionContext;
          } else {
            context = executionContext || this.executionContext;
          }

          if (this.isBound) {
            if (this.executionContext === context) {
              return;
            }

            this.unbind();
          }

          this.isBound = true;
          this.executionContext = context;

          if (this.owner) {
            this.owner.bind(context);
          }

          bindings = this.bindings;
          for (i = 0, ii = bindings.length; i < ii; ++i) {
            bindings[i].bind(context);
          }

          behaviors = this.behaviors;
          for (i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].bind(context);
          }

          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].bind(context, true);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      addBinding: {
        value: function addBinding(binding) {
          this.bindings.push(binding);

          if (this.isBound) {
            binding.bind(this.executionContext);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          var behaviors, bindings, children, i, ii;

          if (this.isBound) {
            this.isBound = false;

            if (this.owner) {
              this.owner.unbind();
            }

            bindings = this.bindings;
            for (i = 0, ii = bindings.length; i < ii; ++i) {
              bindings[i].unbind();
            }

            behaviors = this.behaviors;
            for (i = 0, ii = behaviors.length; i < ii; ++i) {
              behaviors[i].unbind();
            }

            children = this.children;
            for (i = 0, ii = children.length; i < ii; ++i) {
              children[i].unbind();
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      insertNodesBefore: {
        value: function insertNodesBefore(refNode) {
          var parent = refNode.parentNode;
          parent.insertBefore(this.fragment, refNode);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      appendNodesTo: {
        value: function appendNodesTo(parent) {
          parent.appendChild(this.fragment);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      removeNodes: {
        value: function removeNodes() {
          var start = this.firstChild,
              end = this.lastChild,
              fragment = this.fragment,
              next;

          var current = start,
              loop = true,
              nodes = [];

          while (loop) {
            if (current === end) {
              loop = false;
            }

            next = current.nextSibling;
            this.fragment.appendChild(current);
            current = next;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      attached: {
        value: function attached() {
          var behaviors, children, i, ii;

          if (this.isAttached) {
            return;
          }

          this.isAttached = true;

          if (this.owner) {
            this.owner.attached();
          }

          behaviors = this.behaviors;
          for (i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].attached();
          }

          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].attached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      detached: {
        value: function detached() {
          var behaviors, children, i, ii;

          if (this.isAttached) {
            this.isAttached = false;

            if (this.owner) {
              this.owner.detached();
            }

            behaviors = this.behaviors;
            for (i = 0, ii = behaviors.length; i < ii; ++i) {
              behaviors[i].detached();
            }

            children = this.children;
            for (i = 0, ii = children.length; i < ii; ++i) {
              children[i].detached();
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return View;
  })();

  exports.View = View;
});
define('aurelia-templating/view-slot',["exports", "./content-selector"], function (exports, _contentSelector) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ContentSelector = _contentSelector.ContentSelector;
  var ViewSlot = (function () {
    function ViewSlot(anchor, anchorIsContainer, executionContext) {
      this.anchor = anchor;
      this.viewAddMethod = anchorIsContainer ? "appendNodesTo" : "insertNodesBefore";
      this.executionContext = executionContext;
      this.children = [];
      this.isBound = false;
      this.isAttached = false;

      anchor.viewSlot = this;
    }

    _prototypeProperties(ViewSlot, null, {
      transformChildNodesIntoView: {
        value: function transformChildNodesIntoView() {
          var parent = this.anchor;

          this.children.push({
            removeNodes: function removeNodes() {
              var last;

              while (last = parent.lastChild) {
                parent.removeChild(last);
              }
            },
            created: function created() {},
            bind: function bind() {},
            unbind: function unbind() {},
            attached: function attached() {},
            detached: function detached() {}
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bind: {
        value: function bind(executionContext) {
          var i, ii, children;

          if (this.isBound) {
            if (this.executionContext === executionContext) {
              return;
            }

            this.unbind();
          }

          this.isBound = true;
          this.executionContext = executionContext = executionContext || this.executionContext;

          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].bind(executionContext, true);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          var i,
              ii,
              children = this.children;
          this.isBound = false;

          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].unbind();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      add: {
        value: function add(view) {
          view[this.viewAddMethod](this.anchor);
          this.children.push(view);

          if (this.isAttached) {
            view.attached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      insert: {
        value: function insert(index, view) {
          if (index === 0 && !this.children.length || index >= this.children.length) {
            this.add(view);
          } else {
            view.insertNodesBefore(this.children[index].firstChild);
            this.children.splice(index, 0, view);

            if (this.isAttached) {
              view.attached();
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      remove: {
        value: function remove(view) {
          view.removeNodes();
          this.children.splice(this.children.indexOf(view), 1);

          if (this.isAttached) {
            view.detached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      removeAt: {
        value: function removeAt(index) {
          var view = this.children[index];

          view.removeNodes();
          this.children.splice(index, 1);

          if (this.isAttached) {
            view.detached();
          }

          return view;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      removeAll: {
        value: function removeAll() {
          var children = this.children,
              ii = children.length,
              i;

          for (i = 0; i < ii; ++i) {
            children[i].removeNodes();
          }

          if (this.isAttached) {
            for (i = 0; i < ii; ++i) {
              children[i].detached();
            }
          }

          this.children = [];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      swap: {
        value: function swap(view) {
          this.removeAll();
          this.add(view);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      attached: {
        value: function attached() {
          var i, ii, children;

          if (this.isAttached) {
            return;
          }

          this.isAttached = true;

          children = this.children;
          for (i = 0, ii = children.length; i < ii; ++i) {
            children[i].attached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      detached: {
        value: function detached() {
          var i, ii, children;

          if (this.isAttached) {
            this.isAttached = false;
            children = this.children;
            for (i = 0, ii = children.length; i < ii; ++i) {
              children[i].detached();
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      installContentSelectors: {
        value: function installContentSelectors(contentSelectors) {
          this.contentSelectors = contentSelectors;
          this.add = this.contentSelectorAdd;
          this.insert = this.contentSelectorInsert;
          this.remove = this.contentSelectorRemove;
          this.removeAt = this.contentSelectorRemoveAt;
          this.removeAll = this.contentSelectorRemoveAll;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      contentSelectorAdd: {
        value: function contentSelectorAdd(view) {
          ContentSelector.applySelectors(view, this.contentSelectors, function (contentSelector, group) {
            return contentSelector.add(group);
          });

          this.children.push(view);

          if (this.isAttached) {
            view.attached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      contentSelectorInsert: {
        value: function contentSelectorInsert(index, view) {
          if (index === 0 && !this.children.length || index >= this.children.length) {
            this.add(view);
          } else {
            ContentSelector.applySelectors(view, this.contentSelectors, function (contentSelector, group) {
              return contentSelector.insert(index, group);
            });

            this.children.splice(index, 0, view);

            if (this.isAttached) {
              view.attached();
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      contentSelectorRemove: {
        value: function contentSelectorRemove(view) {
          var index = this.children.indexOf(view),
              contentSelectors = this.contentSelectors,
              i,
              ii;

          for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
            contentSelectors[i].removeAt(index, view.fragment);
          }

          this.children.splice(index, 1);

          if (this.isAttached) {
            view.detached();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      contentSelectorRemoveAt: {
        value: function contentSelectorRemoveAt(index) {
          var view = this.children[index],
              contentSelectors = this.contentSelectors,
              i,
              ii;

          for (i = 0, ii = contentSelectors.length; i < ii; ++i) {
            contentSelectors[i].removeAt(index, view.fragment);
          }

          this.children.splice(index, 1);

          if (this.isAttached) {
            view.detached();
          }

          return view;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      contentSelectorRemoveAll: {
        value: function contentSelectorRemoveAll() {
          var children = this.children,
              contentSelectors = this.contentSelectors,
              ii = children.length,
              jj = contentSelectors.length,
              i,
              j,
              view;

          for (i = 0; i < ii; ++i) {
            view = children[i];

            for (j = 0; j < jj; ++j) {
              contentSelectors[j].removeAt(i, view.fragment);
            }
          }

          if (this.isAttached) {
            for (i = 0; i < ii; ++i) {
              children[i].detached();
            }
          }

          this.children = [];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ViewSlot;
  })();

  exports.ViewSlot = ViewSlot;
});
define('aurelia-templating/view-factory',["exports", "aurelia-dependency-injection", "./view", "./view-slot", "./content-selector", "./resource-registry"], function (exports, _aureliaDependencyInjection, _view, _viewSlot, _contentSelector, _resourceRegistry) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Container = _aureliaDependencyInjection.Container;
  var View = _view.View;
  var ViewSlot = _viewSlot.ViewSlot;
  var ContentSelector = _contentSelector.ContentSelector;
  var ViewResources = _resourceRegistry.ViewResources;


  function elementContainerGet(key) {
    if (key === Element) {
      return this.element;
    }

    if (key === BoundViewFactory) {
      return this.boundViewFactory || (this.boundViewFactory = new BoundViewFactory(this, this.instruction.viewFactory, this.executionContext));
    }

    if (key === ViewSlot) {
      if (this.viewSlot === undefined) {
        this.viewSlot = new ViewSlot(this.element, this.instruction.anchorIsContainer, this.executionContext);
        this.children.push(this.viewSlot);
      }

      return this.viewSlot;
    }

    if (key === ViewResources) {
      return this.viewResources;
    }

    return this.superGet(key);
  }

  function createElementContainer(parent, element, instruction, executionContext, children, resources) {
    var container = parent.createChild(),
        providers,
        i;

    container.element = element;
    container.instruction = instruction;
    container.executionContext = executionContext;
    container.children = children;
    container.viewResources = resources;

    providers = instruction.providers;
    i = providers.length;

    while (i--) {
      container.registerSingleton(providers[i]);
    }

    container.superGet = container.get;
    container.get = elementContainerGet;

    return container;
  }

  function applyInstructions(containers, executionContext, element, instruction, behaviors, bindings, children, contentSelectors, resources) {
    var behaviorInstructions = instruction.behaviorInstructions,
        expressions = instruction.expressions,
        elementContainer,
        i,
        ii,
        current,
        instance;

    if (instruction.contentExpression) {
      bindings.push(instruction.contentExpression.createBinding(element.nextSibling));
      element.parentNode.removeChild(element);
      return;
    }

    if (instruction.contentSelector) {
      contentSelectors.push(new ContentSelector(element, instruction.selector));
      return;
    }

    if (behaviorInstructions.length) {
      containers[instruction.injectorId] = elementContainer = createElementContainer(containers[instruction.parentInjectorId], element, instruction, executionContext, children, resources);

      for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
        current = behaviorInstructions[i];
        instance = current.type.create(elementContainer, current, element, bindings);

        if (instance.contentView) {
          children.push(instance.contentView);
        }

        behaviors.push(instance);
      }
    }

    for (i = 0, ii = expressions.length; i < ii; ++i) {
      bindings.push(expressions[i].createBinding(element));
    }
  }

  var BoundViewFactory = (function () {
    function BoundViewFactory(parentContainer, viewFactory, executionContext) {
      this.parentContainer = parentContainer;
      this.viewFactory = viewFactory;
      this.executionContext = executionContext;
      this.factoryOptions = { behaviorInstance: false };
    }

    _prototypeProperties(BoundViewFactory, null, {
      create: {
        value: function create(executionContext) {
          var childContainer = this.parentContainer.createChild(),
              context = executionContext || this.executionContext;

          this.factoryOptions.systemControlled = !executionContext;

          return this.viewFactory.create(childContainer, context, this.factoryOptions);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BoundViewFactory;
  })();

  exports.BoundViewFactory = BoundViewFactory;


  var defaultFactoryOptions = {
    systemControlled: false,
    suppressBind: false
  };

  var ViewFactory = (function () {
    function ViewFactory(template, instructions, resources) {
      this.template = template;
      this.instructions = instructions;
      this.resources = resources;
    }

    _prototypeProperties(ViewFactory, null, {
      create: {
        value: function create(container, executionContext) {
          var _this = this;
          var options = arguments[2] === undefined ? defaultFactoryOptions : arguments[2];
          return (function () {
            var fragment = _this.template.cloneNode(true),
                instructables = fragment.querySelectorAll(".au-target"),
                instructions = _this.instructions,
                resources = _this.resources,
                behaviors = [],
                bindings = [],
                children = [],
                contentSelectors = [],
                containers = { root: container },
                i,
                ii,
                view;

            for (i = 0, ii = instructables.length; i < ii; ++i) {
              applyInstructions(containers, executionContext, instructables[i], instructions[i], behaviors, bindings, children, contentSelectors, resources);
            }

            view = new View(fragment, behaviors, bindings, children, options.systemControlled, contentSelectors);
            view.created(executionContext);

            if (!options.suppressBind) {
              view.bind(executionContext);
            }

            return view;
          })();
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ViewFactory;
  })();

  exports.ViewFactory = ViewFactory;
});
define('aurelia-templating/binding-language',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var BindingLanguage = (function () {
    function BindingLanguage() {}

    _prototypeProperties(BindingLanguage, null, {
      inspectAttribute: {
        value: function inspectAttribute(resources, attrName, attrValue) {
          throw new Error("A BindingLanguage must implement inspectAttribute(...)");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createAttributeInstruction: {
        value: function createAttributeInstruction(resources, element, info, existingInstruction) {
          throw new Error("A BindingLanguage must implement createAttributeInstruction(...)");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseText: {
        value: function parseText(resources, value) {
          throw new Error("A BindingLanguage must implement parseText(...)");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BindingLanguage;
  })();

  exports.BindingLanguage = BindingLanguage;
});
define('aurelia-templating/view-compiler',["exports", "./resource-registry", "./view-factory", "./binding-language"], function (exports, _resourceRegistry, _viewFactory, _bindingLanguage) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ResourceRegistry = _resourceRegistry.ResourceRegistry;
  var ViewFactory = _viewFactory.ViewFactory;
  var BindingLanguage = _bindingLanguage.BindingLanguage;


  var nextInjectorId = 0,
      defaultCompileOptions = { targetShadowDOM: false },
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;

  function getNextInjectorId() {
    return ++nextInjectorId;
  }

  function configureProperties(instruction, resources) {
    var type = instruction.type,
        attrName = instruction.attrName,
        attributes = instruction.attributes,
        property,
        key,
        value;

    var knownAttribute = resources.attributeMap[attrName];
    if (knownAttribute && attrName in attributes && knownAttribute !== attrName) {
      attributes[knownAttribute] = attributes[attrName];
      delete attributes[attrName];
    }

    for (key in attributes) {
      value = attributes[key];

      if (typeof value !== "string") {
        property = type.attributes[key];

        if (property !== undefined) {
          value.targetProperty = property.name;
        } else {
          value.targetProperty = key;
        }
      }
    }
  }

  function makeIntoInstructionTarget(element) {
    var value = element.getAttribute("class");
    element.setAttribute("class", value ? value += " au-target" : "au-target");
  }

  var ViewCompiler = (function () {
    function ViewCompiler(bindingLanguage) {
      this.bindingLanguage = bindingLanguage;
    }

    _prototypeProperties(ViewCompiler, {
      inject: {
        value: function inject() {
          return [BindingLanguage];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      compile: {
        value: function compile(templateOrFragment, resources) {
          var _this = this;
          var options = arguments[2] === undefined ? defaultCompileOptions : arguments[2];
          return (function () {
            var instructions = [],
                targetShadowDOM = options.targetShadowDOM,
                content;

            targetShadowDOM = targetShadowDOM && hasShadowDOM;

            if (templateOrFragment.content) {
              content = document.adoptNode(templateOrFragment.content, true);
            } else {
              content = templateOrFragment;
            }

            _this.compileNode(content, resources, instructions, templateOrFragment, "root", !targetShadowDOM);

            content.insertBefore(document.createComment("<view>"), content.firstChild);
            content.appendChild(document.createComment("</view>"));

            return new ViewFactory(content, instructions, resources);
          })();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      compileNode: {
        value: function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
          switch (node.nodeType) {
            case 1:
              return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
            case 3:
              var expression = this.bindingLanguage.parseText(resources, node.textContent);
              if (expression) {
                var marker = document.createElement("au-marker");
                marker.className = "au-target";
                node.parentNode.insertBefore(marker, node);
                node.textContent = " ";
                instructions.push({ contentExpression: expression });
              }
              return node.nextSibling;
            case 11:
              var currentChild = node.firstChild;
              while (currentChild) {
                currentChild = this.compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
              }
              break;
          }

          return node.nextSibling;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      compileElement: {
        value: function compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
          var tagName = node.tagName.toLowerCase(),
              attributes = node.attributes,
              expressions = [],
              behaviorInstructions = [],
              providers = [],
              bindingLanguage = this.bindingLanguage,
              liftingInstruction,
              viewFactory,
              type,
              elementInstruction,
              elementProperty,
              i,
              ii,
              attr,
              attrName,
              attrValue,
              instruction,
              info,
              property,
              knownAttribute;

          if (tagName === "content") {
            if (targetLightDOM) {
              instructions.push({
                parentInjectorId: parentInjectorId,
                contentSelector: true,
                selector: node.getAttribute("select"),
                suppressBind: true
              });
              makeIntoInstructionTarget(node);
            }
            return node.nextSibling;
          } else if (tagName === "template") {
            viewFactory = this.compile(node, resources);
          } else {
            type = resources.getElement(tagName);
            if (type) {
              elementInstruction = { type: type, attributes: {} };
              behaviorInstructions.push(elementInstruction);
            }
          }

          for (i = 0, ii = attributes.length; i < ii; ++i) {
            attr = attributes[i];
            attrName = attr.name;
            attrValue = attr.value;
            info = bindingLanguage.inspectAttribute(resources, attrName, attrValue);
            type = resources.getAttribute(info.attrName);
            elementProperty = null;

            if (type) {
              knownAttribute = resources.attributeMap[info.attrName];
              if (knownAttribute) {
                property = type.attributes[knownAttribute];

                if (property) {
                  info.defaultBindingMode = property.defaultBindingMode;

                  if (!info.command && !info.expression) {
                    info.command = property.hasOptions ? "options" : null;
                  }
                }
              }
            } else if (elementInstruction) {
              elementProperty = elementInstruction.type.attributes[info.attrName];
              if (elementProperty) {
                info.defaultBindingMode = elementProperty.defaultBindingMode;

                if (!info.command && !info.expression) {
                  info.command = elementProperty.hasOptions ? "options" : null;
                }
              }
            }

            if (elementProperty) {
              instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
            } else {
              instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
            }

            if (instruction) {
              if (instruction.alteredAttr) {
                type = resources.getAttribute(instruction.attrName);
              }

              if (instruction.discrete) {
                expressions.push(instruction);
              } else {
                if (type) {
                  instruction.type = type;
                  configureProperties(instruction, resources);

                  if (type.liftsContent) {
                    instruction.originalAttrName = attrName;
                    liftingInstruction = instruction;
                    break;
                  } else {
                    behaviorInstructions.push(instruction);
                  }
                } else if (elementProperty) {
                  elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
                } else {
                  expressions.push(instruction.attributes[instruction.attrName]);
                }
              }
            } else {
              if (type) {
                instruction = { attrName: attrName, type: type, attributes: {} };
                instruction.attributes[resources.attributeMap[attrName]] = attrValue;

                if (type.liftsContent) {
                  instruction.originalAttrName = attrName;
                  liftingInstruction = instruction;
                  break;
                } else {
                  behaviorInstructions.push(instruction);
                }
              } else if (elementProperty) {
                elementInstruction.attributes[attrName] = attrValue;
              }
            }
          }

          if (liftingInstruction) {
            liftingInstruction.viewFactory = viewFactory;
            node = liftingInstruction.type.compile(this, resources, node, liftingInstruction, parentNode);
            makeIntoInstructionTarget(node);
            instructions.push({
              anchorIsContainer: false,
              parentInjectorId: parentInjectorId,
              expressions: [],
              behaviorInstructions: [liftingInstruction],
              viewFactory: liftingInstruction.viewFactory,
              providers: [liftingInstruction.type.target]
            });
          } else {
            for (i = 0, ii = behaviorInstructions.length; i < ii; ++i) {
              instruction = behaviorInstructions[i];
              instruction.type.compile(this, resources, node, instruction, parentNode);
              providers.push(instruction.type.target);
            }

            var injectorId = behaviorInstructions.length ? getNextInjectorId() : false;

            if (expressions.length || behaviorInstructions.length) {
              makeIntoInstructionTarget(node);
              instructions.push({
                anchorIsContainer: true,
                injectorId: injectorId,
                parentInjectorId: parentInjectorId,
                expressions: expressions,
                behaviorInstructions: behaviorInstructions,
                providers: providers
              });
            }

            var currentChild = node.firstChild;
            while (currentChild) {
              currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
            }
          }

          return node.nextSibling;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ViewCompiler;
  })();

  exports.ViewCompiler = ViewCompiler;
});
define('aurelia-templating/view-engine',["exports", "aurelia-logging", "aurelia-loader", "aurelia-path", "./view-compiler", "./resource-registry"], function (exports, _aureliaLogging, _aureliaLoader, _aureliaPath, _viewCompiler, _resourceRegistry) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var LogManager = _aureliaLogging;
  var Loader = _aureliaLoader.Loader;
  var relativeToFile = _aureliaPath.relativeToFile;
  var ViewCompiler = _viewCompiler.ViewCompiler;
  var ResourceRegistry = _resourceRegistry.ResourceRegistry;
  var ViewResources = _resourceRegistry.ViewResources;


  var importSplitter = /\s*,\s*/,
      logger = LogManager.getLogger("templating");

  var ViewEngine = (function () {
    function ViewEngine(loader, viewCompiler, appResources) {
      this.loader = loader;
      this.viewCompiler = viewCompiler;
      this.appResources = appResources;
      this.importedViews = {};
    }

    _prototypeProperties(ViewEngine, {
      inject: {
        value: function inject() {
          return [Loader, ViewCompiler, ResourceRegistry];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      loadViewFactory: {
        value: function loadViewFactory(url, compileOptions, associatedModuleId) {
          var _this = this;
          var existing = this.importedViews[url];
          if (existing) {
            return Promise.resolve(existing);
          }

          return this.loader.loadTemplate(url).then(function (template) {
            return _this.loadTemplateResources(url, template, associatedModuleId).then(function (resources) {
              existing = _this.importedViews[url];
              if (existing) {
                return existing;
              }

              var viewFactory = _this.viewCompiler.compile(template, resources, compileOptions);
              _this.importedViews[url] = viewFactory;
              return viewFactory;
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadTemplateResources: {
        value: function loadTemplateResources(templateUrl, template, associatedModuleId) {
          var _this2 = this;
          var importIds,
              names,
              i,
              ii,
              src,
              current,
              registry = new ViewResources(this.appResources, templateUrl),
              dxImportElements = template.content.querySelectorAll("import"),
              associatedModule;

          if (dxImportElements.length === 0 && !associatedModuleId) {
            return Promise.resolve(registry);
          }

          importIds = new Array(dxImportElements.length);
          names = new Array(dxImportElements.length);

          for (i = 0, ii = dxImportElements.length; i < ii; ++i) {
            current = dxImportElements[i];
            src = current.getAttribute("from");

            if (!src) {
              throw new Error("Import element in " + templateUrl + " has no \"from\" attribute.");
            }

            importIds[i] = src;
            names[i] = current.getAttribute("as");

            if (current.parentNode) {
              current.parentNode.removeChild(current);
            }
          }

          importIds = importIds.map(function (x) {
            return relativeToFile(x, templateUrl);
          });
          logger.debug("importing resources for " + templateUrl, importIds);

          return this.resourceCoordinator.importResourcesFromModuleIds(importIds).then(function (toRegister) {
            for (i = 0, ii = toRegister.length; i < ii; ++i) {
              toRegister[i].register(registry, names[i]);
            }

            if (associatedModuleId) {
              associatedModule = _this2.resourceCoordinator.getExistingModuleAnalysis(associatedModuleId);

              if (associatedModule) {
                associatedModule.register(registry);
              }
            }

            return registry;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ViewEngine;
  })();

  exports.ViewEngine = ViewEngine;
});
define('aurelia-templating/view-strategy',["exports", "aurelia-metadata", "aurelia-path"], function (exports, _aureliaMetadata, _aureliaPath) {
  

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Metadata = _aureliaMetadata.Metadata;
  var Origin = _aureliaMetadata.Origin;
  var relativeToFile = _aureliaPath.relativeToFile;
  var ViewStrategy = (function () {
    function ViewStrategy() {}

    _prototypeProperties(ViewStrategy, {
      normalize: {
        value: function normalize(value) {
          if (typeof value === "string") {
            value = new UseView(value);
          }

          if (value && !(value instanceof ViewStrategy)) {
            throw new Error("The view must be a string or an instance of ViewStrategy.");
          }

          return value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getDefault: {
        value: function getDefault(target) {
          var strategy, annotation;

          if (typeof target !== "function") {
            target = target.constructor;
          }

          annotation = Origin.get(target);
          strategy = Metadata.on(target).first(ViewStrategy);

          if (!strategy) {
            if (!annotation) {
              throw new Error("Cannot determinte default view strategy for object.", target);
            }

            strategy = new ConventionalView(annotation.moduleId);
          } else if (annotation) {
            strategy.moduleId = annotation.moduleId;
          }

          return strategy;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      makeRelativeTo: {
        value: function makeRelativeTo(baseUrl) {},
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadViewFactory: {
        value: function loadViewFactory(viewEngine, options) {
          throw new Error("A ViewStrategy must implement loadViewFactory(viewEngine, options).");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ViewStrategy;
  })();

  exports.ViewStrategy = ViewStrategy;
  var UseView = (function (ViewStrategy) {
    function UseView(path) {
      this.path = path;
    }

    _inherits(UseView, ViewStrategy);

    _prototypeProperties(UseView, null, {
      loadViewFactory: {
        value: function loadViewFactory(viewEngine, options) {
          if (!this.absolutePath && this.moduleId) {
            this.absolutePath = relativeToFile(this.path, this.moduleId);
          }

          return viewEngine.loadViewFactory(this.absolutePath || this.path, options, this.moduleId);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      makeRelativeTo: {
        value: function makeRelativeTo(file) {
          this.absolutePath = relativeToFile(this.path, file);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return UseView;
  })(ViewStrategy);

  exports.UseView = UseView;
  var ConventionalView = (function (ViewStrategy) {
    function ConventionalView(moduleId) {
      this.moduleId = moduleId;
      this.viewUrl = ConventionalView.convertModuleIdToViewUrl(moduleId);
    }

    _inherits(ConventionalView, ViewStrategy);

    _prototypeProperties(ConventionalView, {
      convertModuleIdToViewUrl: {
        value: function convertModuleIdToViewUrl(moduleId) {
          return moduleId + ".html";
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      loadViewFactory: {
        value: function loadViewFactory(viewEngine, options) {
          return viewEngine.loadViewFactory(this.viewUrl, options, this.moduleId);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ConventionalView;
  })(ViewStrategy);

  exports.ConventionalView = ConventionalView;
  var NoView = (function (ViewStrategy) {
    function NoView() {
      if (Object.getPrototypeOf(NoView) !== null) {
        Object.getPrototypeOf(NoView).apply(this, arguments);
      }
    }

    _inherits(NoView, ViewStrategy);

    _prototypeProperties(NoView, null, {
      loadViewFactory: {
        value: function loadViewFactory() {
          return Promise.resolve(null);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return NoView;
  })(ViewStrategy);

  exports.NoView = NoView;
});
define('aurelia-templating/custom-element',["exports", "aurelia-metadata", "./behavior-instance", "./behaviors", "./content-selector", "./view-engine", "./view-strategy", "./util"], function (exports, _aureliaMetadata, _behaviorInstance, _behaviors, _contentSelector, _viewEngine, _viewStrategy, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var Metadata = _aureliaMetadata.Metadata;
  var Origin = _aureliaMetadata.Origin;
  var ResourceType = _aureliaMetadata.ResourceType;
  var BehaviorInstance = _behaviorInstance.BehaviorInstance;
  var configureBehavior = _behaviors.configureBehavior;
  var ContentSelector = _contentSelector.ContentSelector;
  var ViewEngine = _viewEngine.ViewEngine;
  var ViewStrategy = _viewStrategy.ViewStrategy;
  var hyphenate = _util.hyphenate;


  var defaultInstruction = { suppressBind: false },
      contentSelectorFactoryOptions = { suppressBind: true },
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot,
      valuePropertyName = "value";

  var UseShadowDOM = function UseShadowDOM() {};

  exports.UseShadowDOM = UseShadowDOM;
  var CustomElement = (function (ResourceType) {
    function CustomElement(tagName) {
      this.name = tagName;
      this.properties = [];
      this.attributes = {};
    }

    _inherits(CustomElement, ResourceType);

    _prototypeProperties(CustomElement, {
      convention: {
        value: function convention(name) {
          if (name.endsWith("CustomElement")) {
            return new CustomElement(hyphenate(name.substring(0, name.length - 13)));
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      analyze: {
        value: function analyze(container, target) {
          configureBehavior(container, this, target, valuePropertyName);

          this.configured = true;
          this.targetShadowDOM = Metadata.on(target).has(UseShadowDOM);
          this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      load: {
        value: function load(container, target, viewStrategy) {
          var _this = this;
          var options;

          viewStrategy = viewStrategy || ViewStrategy.getDefault(target);
          options = { targetShadowDOM: this.targetShadowDOM };

          if (!viewStrategy.moduleId) {
            viewStrategy.moduleId = Origin.get(target).moduleId;
          }

          return viewStrategy.loadViewFactory(container.get(ViewEngine), options).then(function (viewFactory) {
            _this.viewFactory = viewFactory;
            return _this;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerElement(name || this.name, this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      compile: {
        value: function compile(compiler, resources, node, instruction) {
          if (!this.usesShadowDOM && node.hasChildNodes()) {
            var fragment = document.createDocumentFragment(),
                currentChild = node.firstChild,
                nextSibling;

            while (currentChild) {
              nextSibling = currentChild.nextSibling;
              fragment.appendChild(currentChild);
              currentChild = nextSibling;
            }

            instruction.contentFactory = compiler.compile(fragment, resources);
          }

          instruction.suppressBind = true;

          return node;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      create: {
        value: function create(container) {
          var _this2 = this;
          var instruction = arguments[1] === undefined ? defaultInstruction : arguments[1];
          var element = arguments[2] === undefined ? null : arguments[2];
          return (function () {
            var executionContext = instruction.executionContext || container.get(_this2.target),
                behaviorInstance = new BehaviorInstance(_this2, executionContext, instruction),
                host;

            if (_this2.viewFactory) {
              behaviorInstance.view = _this2.viewFactory.create(container, behaviorInstance.executionContext, instruction);
            }

            if (element) {
              element.elementBehavior = behaviorInstance;
              element.primaryBehavior = behaviorInstance;

              if (behaviorInstance.view) {
                if (_this2.usesShadowDOM) {
                  host = element.createShadowRoot();
                } else {
                  host = element;

                  if (instruction.contentFactory) {
                    var contentView = instruction.contentFactory.create(container, null, contentSelectorFactoryOptions);

                    ContentSelector.applySelectors(contentView, behaviorInstance.view.contentSelectors, function (contentSelector, group) {
                      return contentSelector.add(group);
                    });

                    behaviorInstance.contentView = contentView;
                  }
                }

                if (_this2.childExpression) {
                  behaviorInstance.view.addBinding(_this2.childExpression.createBinding(host, behaviorInstance.executionContext));
                }

                behaviorInstance.view.appendNodesTo(host);
              }
            } else if (behaviorInstance.view) {
              behaviorInstance.view.owner = behaviorInstance;
            }

            return behaviorInstance;
          })();
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CustomElement;
  })(ResourceType);

  exports.CustomElement = CustomElement;
});
define('aurelia-templating/element-config',["exports", "aurelia-metadata", "aurelia-binding"], function (exports, _aureliaMetadata, _aureliaBinding) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var ResourceType = _aureliaMetadata.ResourceType;
  var EventManager = _aureliaBinding.EventManager;
  var ElementConfig = (function (ResourceType) {
    function ElementConfig() {
      if (Object.getPrototypeOf(ElementConfig) !== null) {
        Object.getPrototypeOf(ElementConfig).apply(this, arguments);
      }
    }

    _inherits(ElementConfig, ResourceType);

    _prototypeProperties(ElementConfig, null, {
      load: {
        value: function load(container, target) {
          var config = new target(),
              eventManager = container.get(EventManager);

          eventManager.registerElementConfig(config);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register() {},
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ElementConfig;
  })(ResourceType);

  exports.ElementConfig = ElementConfig;
});
define('aurelia-templating/template-controller',["exports", "aurelia-metadata", "./behavior-instance", "./behaviors", "./util"], function (exports, _aureliaMetadata, _behaviorInstance, _behaviors, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var ResourceType = _aureliaMetadata.ResourceType;
  var BehaviorInstance = _behaviorInstance.BehaviorInstance;
  var configureBehavior = _behaviors.configureBehavior;
  var hyphenate = _util.hyphenate;
  var TemplateController = (function (ResourceType) {
    function TemplateController(attribute) {
      this.name = attribute;
      this.properties = [];
      this.attributes = {};
      this.liftsContent = true;
    }

    _inherits(TemplateController, ResourceType);

    _prototypeProperties(TemplateController, {
      convention: {
        value: function convention(name) {
          if (name.endsWith("TemplateController")) {
            return new TemplateController(hyphenate(name.substring(0, name.length - 18)));
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      analyze: {
        value: function analyze(container, target) {
          configureBehavior(container, this, target);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      load: {
        value: function load(container, target) {
          return Promise.resolve(this);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerAttribute(name || this.name, this, this.name);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      compile: {
        value: function compile(compiler, resources, node, instruction, parentNode) {
          if (!instruction.viewFactory) {
            var template = document.createElement("template"),
                fragment = document.createDocumentFragment();

            node.removeAttribute(instruction.originalAttrName);

            if (node.parentNode) {
              node.parentNode.replaceChild(template, node);
            } else if (window.ShadowDOMPolyfill) {
              ShadowDOMPolyfill.unwrap(parentNode).replaceChild(ShadowDOMPolyfill.unwrap(template), ShadowDOMPolyfill.unwrap(node));
            } else {
              parentNode.replaceChild(template, node);
            }

            fragment.appendChild(node);

            instruction.viewFactory = compiler.compile(fragment, resources);
            node = template;
          }

          instruction.suppressBind = true;

          return node;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      create: {
        value: function create(container, instruction, element) {
          var executionContext = instruction.executionContext || container.get(this.target),
              behaviorInstance = new BehaviorInstance(this, executionContext, instruction);
          element.primaryBehavior = behaviorInstance;
          return behaviorInstance;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return TemplateController;
  })(ResourceType);

  exports.TemplateController = TemplateController;
});
define('aurelia-templating/resource-coordinator',["exports", "aurelia-loader", "aurelia-path", "aurelia-dependency-injection", "aurelia-metadata", "aurelia-binding", "./custom-element", "./attached-behavior", "./template-controller", "./view-engine", "./resource-registry"], function (exports, _aureliaLoader, _aureliaPath, _aureliaDependencyInjection, _aureliaMetadata, _aureliaBinding, _customElement, _attachedBehavior, _templateController, _viewEngine, _resourceRegistry) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Loader = _aureliaLoader.Loader;
  var relativeToFile = _aureliaPath.relativeToFile;
  var join = _aureliaPath.join;
  var Container = _aureliaDependencyInjection.Container;
  var Metadata = _aureliaMetadata.Metadata;
  var ResourceType = _aureliaMetadata.ResourceType;
  var Origin = _aureliaMetadata.Origin;
  var ValueConverter = _aureliaBinding.ValueConverter;
  var CustomElement = _customElement.CustomElement;
  var AttachedBehavior = _attachedBehavior.AttachedBehavior;
  var TemplateController = _templateController.TemplateController;
  var ViewEngine = _viewEngine.ViewEngine;
  var ResourceRegistry = _resourceRegistry.ResourceRegistry;


  var id = 0;

  function nextId() {
    return ++id;
  }

  var ResourceCoordinator = (function () {
    function ResourceCoordinator(loader, container, viewEngine, appResources) {
      this.loader = loader;
      this.container = container;
      this.viewEngine = viewEngine;
      this.importedModules = {};
      this.importedAnonymous = {};
      this.appResources = appResources;
      viewEngine.resourceCoordinator = this;
    }

    _prototypeProperties(ResourceCoordinator, {
      inject: {
        value: function inject() {
          return [Loader, Container, ViewEngine, ResourceRegistry];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      getExistingModuleAnalysis: {
        value: function getExistingModuleAnalysis(id) {
          return this.importedModules[id] || this.importedAnonymous[id];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadViewModelInfo: {
        value: function loadViewModelInfo(moduleImport, moduleMember) {
          return this._loadAndAnalyzeModuleForElement(moduleImport, moduleMember, this.importedAnonymous);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadElement: {
        value: function loadElement(moduleImport, moduleMember, viewStategy) {
          var _this = this;
          return this._loadAndAnalyzeModuleForElement(moduleImport, moduleMember, this.importedModules).then(function (info) {
            var type = info.type;

            if (type.isLoaded) {
              return type;
            }

            type.isLoaded = true;

            return type.load(_this.container, info.value, viewStategy);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      _loadAndAnalyzeModuleForElement: {
        value: function LoadAndAnalyzeModuleForElement(moduleImport, moduleMember, cache) {
          var _this2 = this;
          var existing = cache[moduleImport];

          if (existing) {
            return Promise.resolve(existing.element);
          }

          return this.loader.loadModule(moduleImport).then(function (elementModule) {
            var analysis = analyzeModule(elementModule, moduleMember),
                resources = analysis.resources,
                container = _this2.container,
                loads = [],
                type,
                current,
                i,
                ii;

            if (!analysis.element) {
              throw new Error("No element found in module \"" + moduleImport + "\".");
            }

            analysis.analyze(container);

            for (i = 0, ii = resources.length; i < ii; ++i) {
              current = resources[i];
              type = current.type;

              if (!type.isLoaded) {
                type.isLoaded = true;
                loads.push(type.load(container, current.value));
              }
            }

            cache[analysis.id] = analysis;

            return Promise.all(loads).then(function () {
              return analysis.element;
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      importResources: {
        value: function importResources(imports, resourceManifestUrl) {
          var i,
              ii,
              current,
              annotation,
              existing,
              lookup = {},
              finalModules = [],
              importIds = [],
              analysis,
              type;

          var container = this.container;

          for (i = 0, ii = imports.length; i < ii; ++i) {
            current = imports[i];
            annotation = Origin.get(current);

            if (!annotation) {
              analysis = analyzeModule({ "default": current });
              analysis.analyze(container);
              type = (analysis.element || analysis.resources[0]).type;

              if (resourceManifestUrl) {
                annotation = new Origin(relativeToFile("./" + type.name, resourceManifestUrl));
              } else {
                annotation = new Origin(join(this.appResources.baseResourceUrl, type.name));
              }

              Origin.set(current, annotation);
            }

            existing = lookup[annotation.moduleId];

            if (!existing) {
              existing = {};
              importIds.push(annotation.moduleId);
              finalModules.push(existing);
              lookup[annotation.moduleId] = existing;
            }

            existing[nextId()] = current;
          }

          return this.importResourcesFromModules(finalModules, importIds);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      importResourcesFromModuleIds: {
        value: function importResourcesFromModuleIds(importIds) {
          var _this3 = this;
          return this.loader.loadAllModules(importIds).then(function (imports) {
            return _this3.importResourcesFromModules(imports, importIds);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      importResourcesFromModules: {
        value: function importResourcesFromModules(imports, importIds) {
          var loads = [],
              i,
              ii,
              analysis,
              type,
              key,
              annotation,
              j,
              jj,
              resources,
              current,
              existing = this.importedModules,
              container = this.container,
              allAnalysis = new Array(imports.length);

          if (!importIds) {
            importIds = new Array(imports.length);

            for (i = 0, ii = imports.length; i < ii; ++i) {
              current = imports[i];

              for (key in current) {
                type = current[key];
                annotation = Origin.get(type);
                if (annotation) {
                  importIds[i] = annotation.moduleId;
                  break;
                }
              }
            }
          }

          for (i = 0, ii = imports.length; i < ii; ++i) {
            analysis = existing[importIds[i]];

            if (analysis) {
              allAnalysis[i] = analysis;
              continue;
            }

            analysis = analyzeModule(imports[i]);
            analysis.analyze(container);
            existing[analysis.id] = analysis;
            allAnalysis[i] = analysis;
            resources = analysis.resources;

            for (j = 0, jj = resources.length; j < jj; ++j) {
              current = resources[j];
              type = current.type;

              if (!type.isLoaded) {
                type.isLoaded = true;
                loads.push(type.load(container, current.value));
              }
            }

            if (analysis.element) {
              type = analysis.element.type;

              if (!type.isLoaded) {
                type.isLoaded = true;
                loads.push(type.load(container, analysis.element.value));
              }
            }
          }

          return Promise.all(loads).then(function () {
            return allAnalysis;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ResourceCoordinator;
  })();

  exports.ResourceCoordinator = ResourceCoordinator;
  var ResourceModule = (function () {
    function ResourceModule(source, element, resources) {
      var i, ii, org;

      this.source = source;
      this.element = element;
      this.resources = resources;

      if (element) {
        org = Origin.get(element.value);
      } else if (resources.length) {
        org = Origin.get(resources[0].value);
      } else {
        org = Origin.get(source);
      }

      if (org) {
        this.id = org.moduleId;
      }
    }

    _prototypeProperties(ResourceModule, null, {
      analyze: {
        value: function analyze(container) {
          var current = this.element,
              resources = this.resources,
              i,
              ii;

          if (current) {
            if (!current.type.isAnalyzed) {
              current.type.isAnalyzed = true;
              current.type.analyze(container, current.value);
            }
          }

          for (i = 0, ii = resources.length; i < ii; ++i) {
            current = resources[i];

            if ("analyze" in current.type && !current.type.isAnalyzed) {
              current.type.isAnalyzed = true;
              current.type.analyze(container, current.value);
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          var i,
              ii,
              resources = this.resources;

          if (this.element) {
            this.element.type.register(registry, name);
            name = null;
          }

          for (i = 0, ii = resources.length; i < ii; ++i) {
            resources[i].type.register(registry, name);
            name = null;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ResourceModule;
  })();

  function analyzeModule(moduleInstance, viewModelMember) {
    var viewModelType,
        fallback,
        annotation,
        key,
        meta,
        exportedValue,
        resources = [],
        name,
        conventional;

    if (typeof moduleInstance === "function") {
      moduleInstance = { "default": moduleInstance };
    }

    if (viewModelMember) {
      viewModelType = moduleInstance[viewModelMember];
    }

    for (key in moduleInstance) {
      exportedValue = moduleInstance[key];

      if (key === viewModelMember || typeof exportedValue !== "function") {
        continue;
      }

      meta = Metadata.on(exportedValue);
      annotation = meta.first(ResourceType);

      if (annotation) {
        if (!viewModelType && annotation instanceof CustomElement) {
          viewModelType = exportedValue;
        } else {
          resources.push({ type: annotation, value: exportedValue });
        }
      } else {
        name = exportedValue.name;

        if (conventional = CustomElement.convention(name)) {
          if (!viewModelType) {
            meta.add(conventional);
            viewModelType = exportedValue;
          } else {
            resources.push({ type: conventional, value: exportedValue });
          }
        } else if (conventional = AttachedBehavior.convention(name)) {
          resources.push({ type: conventional, value: exportedValue });
        } else if (conventional = TemplateController.convention(name)) {
          resources.push({ type: conventional, value: exportedValue });
        } else if (conventional = ValueConverter.convention(name)) {
          resources.push({ type: conventional, value: exportedValue });
        } else if (!fallback) {
          fallback = exportedValue;
        }
      }
    }

    viewModelType = viewModelType || fallback;

    return new ResourceModule(moduleInstance, viewModelType ? {
      value: viewModelType,
      type: Metadata.on(viewModelType).first(CustomElement) || new CustomElement()
    } : null, resources);
  }
});
define('aurelia-templating/composition-engine',["exports", "aurelia-metadata", "./view-strategy", "./resource-coordinator", "./view-engine", "./custom-element"], function (exports, _aureliaMetadata, _viewStrategy, _resourceCoordinator, _viewEngine, _customElement) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Origin = _aureliaMetadata.Origin;
  var ViewStrategy = _viewStrategy.ViewStrategy;
  var UseView = _viewStrategy.UseView;
  var ResourceCoordinator = _resourceCoordinator.ResourceCoordinator;
  var ViewEngine = _viewEngine.ViewEngine;
  var CustomElement = _customElement.CustomElement;
  var CompositionEngine = (function () {
    function CompositionEngine(resourceCoordinator, viewEngine) {
      this.resourceCoordinator = resourceCoordinator;
      this.viewEngine = viewEngine;
    }

    _prototypeProperties(CompositionEngine, {
      inject: {
        value: function inject() {
          return [ResourceCoordinator, ViewEngine];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      activate: {
        value: function activate(instruction) {
          if (instruction.skipActivation || typeof instruction.viewModel.activate !== "function") {
            return Promise.resolve();
          }

          return instruction.viewModel.activate(instruction.model) || Promise.resolve();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createBehaviorAndSwap: {
        value: function createBehaviorAndSwap(instruction) {
          return this.createBehavior(instruction).then(function (behavior) {
            behavior.view.bind(behavior.executionContext);
            instruction.viewSlot.swap(behavior.view);

            if (instruction.currentBehavior) {
              instruction.currentBehavior.unbind();
            }

            return behavior;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createBehavior: {
        value: function createBehavior(instruction) {
          var childContainer = instruction.childContainer,
              viewModelInfo = instruction.viewModelInfo,
              viewModel = instruction.viewModel;

          return this.activate(instruction).then(function () {
            var doneLoading, viewStrategyFromViewModel, origin;

            if ("getViewStrategy" in viewModel && !instruction.view) {
              viewStrategyFromViewModel = true;
              instruction.view = ViewStrategy.normalize(viewModel.getViewStrategy());
            }

            if (instruction.view) {
              if (viewStrategyFromViewModel) {
                origin = Origin.get(viewModel.constructor);
                if (origin) {
                  instruction.view.makeRelativeTo(origin.moduleId);
                }
              } else if (instruction.viewResources) {
                instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
              }
            }

            if (viewModelInfo) {
              doneLoading = viewModelInfo.type.load(childContainer, viewModelInfo.value, instruction.view);
            } else {
              doneLoading = new CustomElement().load(childContainer, viewModel.constructor, instruction.view);
            }

            return doneLoading.then(function (behaviorType) {
              return behaviorType.create(childContainer, { executionContext: viewModel, suppressBind: true });
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createViewModel: {
        value: function createViewModel(instruction) {
          var childContainer = instruction.childContainer || instruction.container.createChild();

          instruction.viewModel = instruction.viewResources ? instruction.viewResources.relativeToView(instruction.viewModel) : instruction.viewModel;

          return this.resourceCoordinator.loadViewModelInfo(instruction.viewModel).then(function (viewModelInfo) {
            childContainer.autoRegister(viewModelInfo.value);
            instruction.viewModel = childContainer.viewModel = childContainer.get(viewModelInfo.value);
            instruction.viewModelInfo = viewModelInfo;
            return instruction;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      compose: {
        value: function compose(instruction) {
          var _this = this;
          instruction.childContainer = instruction.childContainer || instruction.container.createChild();
          instruction.view = ViewStrategy.normalize(instruction.view);

          if (instruction.viewModel) {
            if (typeof instruction.viewModel === "string") {
              return this.createViewModel(instruction).then(function (instruction) {
                return _this.createBehaviorAndSwap(instruction);
              });
            } else {
              return this.createBehaviorAndSwap(instruction);
            }
          } else if (instruction.view) {
            if (instruction.viewResources) {
              instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
            }

            return instruction.view.loadViewFactory(this.viewEngine).then(function (viewFactory) {
              var result = viewFactory.create(instruction.childContainer, instruction.executionContext);
              instruction.viewSlot.swap(result);
              return result;
            });
          } else if (instruction.viewSlot) {
            instruction.viewSlot.removeAll();
            return Promise.resolve(null);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return CompositionEngine;
  })();

  exports.CompositionEngine = CompositionEngine;
});
define('aurelia-templating/index',["exports", "aurelia-metadata", "./property", "./attached-behavior", "./children", "./custom-element", "./element-config", "./template-controller", "./view-strategy", "./resource-coordinator", "./resource-registry", "./view-compiler", "./view-engine", "./view-factory", "./view-slot", "./binding-language", "./composition-engine"], function (exports, _aureliaMetadata, _property, _attachedBehavior, _children, _customElement, _elementConfig, _templateController, _viewStrategy, _resourceCoordinator, _resourceRegistry, _viewCompiler, _viewEngine, _viewFactory, _viewSlot, _bindingLanguage, _compositionEngine) {
  

  var Metadata = _aureliaMetadata.Metadata;
  var BehaviorProperty = _property.BehaviorProperty;
  var OptionsProperty = _property.OptionsProperty;
  var AttachedBehavior = _attachedBehavior.AttachedBehavior;
  var ChildObserver = _children.ChildObserver;
  var CustomElement = _customElement.CustomElement;
  var UseShadowDOM = _customElement.UseShadowDOM;
  var ElementConfig = _elementConfig.ElementConfig;
  var TemplateController = _templateController.TemplateController;
  var UseView = _viewStrategy.UseView;
  var NoView = _viewStrategy.NoView;
  exports.AttachedBehavior = _attachedBehavior.AttachedBehavior;
  exports.BehaviorProperty = _property.BehaviorProperty;
  exports.OptionsProperty = _property.OptionsProperty;
  exports.ResourceCoordinator = _resourceCoordinator.ResourceCoordinator;
  exports.ResourceRegistry = _resourceRegistry.ResourceRegistry;
  exports.ViewResources = _resourceRegistry.ViewResources;
  exports.ChildObserver = _children.ChildObserver;
  exports.CustomElement = _customElement.CustomElement;
  exports.UseShadowDOM = _customElement.UseShadowDOM;
  exports.ElementConfig = _elementConfig.ElementConfig;
  exports.TemplateController = _templateController.TemplateController;
  exports.ViewStrategy = _viewStrategy.ViewStrategy;
  exports.UseView = _viewStrategy.UseView;
  exports.ConventionalView = _viewStrategy.ConventionalView;
  exports.NoView = _viewStrategy.NoView;
  exports.ViewCompiler = _viewCompiler.ViewCompiler;
  exports.ViewEngine = _viewEngine.ViewEngine;
  exports.ViewFactory = _viewFactory.ViewFactory;
  exports.BoundViewFactory = _viewFactory.BoundViewFactory;
  exports.ViewSlot = _viewSlot.ViewSlot;
  exports.BindingLanguage = _bindingLanguage.BindingLanguage;
  exports.CompositionEngine = _compositionEngine.CompositionEngine;
  var Behavior = exports.Behavior = Metadata;

  Metadata.configure.classHelper("withProperty", BehaviorProperty);
  Metadata.configure.classHelper("withOptions", OptionsProperty);
  Metadata.configure.classHelper("attachedBehavior", AttachedBehavior);
  Metadata.configure.classHelper("syncChildren", ChildObserver);
  Metadata.configure.classHelper("customElement", CustomElement);
  Metadata.configure.classHelper("useShadowDOM", UseShadowDOM);
  Metadata.configure.classHelper("elementConfig", ElementConfig);
  Metadata.configure.classHelper("templateController", TemplateController);
  Metadata.configure.classHelper("useView", UseView);
  Metadata.configure.classHelper("noView", NoView);
});
define('aurelia-templating', ['aurelia-templating/index'], function (main) { return main; });

define('aurelia-framework/plugins',["exports", "aurelia-logging", "aurelia-metadata"], function (exports, _aureliaLogging, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var LogManager = _aureliaLogging;
  var Metadata = _aureliaMetadata.Metadata;


  var logger = LogManager.getLogger("aurelia");

  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");

    aurelia.currentPluginId = info.moduleId;

    var baseUrl = info.moduleId.startsWith("./") ? undefined : "";

    return loader.loadModule(info.moduleId, baseUrl).then(function (exportedValue) {
      if ("install" in exportedValue) {
        var result = exportedValue.install(aurelia, info.config || {});

        if (result) {
          return result.then(function () {
            aurelia.currentPluginId = null;
            logger.debug("Installed plugin " + info.moduleId + ".");
          });
        } else {
          logger.debug("Installed plugin " + info.moduleId + ".");
        }
      } else {
        logger.debug("Loaded plugin " + info.moduleId + ".");
      }

      aurelia.currentPluginId = null;
    });
  }

  var Plugins = (function () {
    function Plugins(aurelia) {
      this.aurelia = aurelia;
      this.info = [];
      this.processed = false;
    }

    _prototypeProperties(Plugins, null, {
      plugin: {
        value: function plugin(moduleId, config) {
          var plugin = { moduleId: moduleId, config: config || {} };

          if (this.processed) {
            loadPlugin(this.aurelia, this.aurelia.loader, plugin);
          } else {
            this.info.push(plugin);
          }

          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      es5: {
        value: function es5() {
          Function.prototype.computed = function (computedProperties) {
            for (var key in computedProperties) {
              if (computedProperties.hasOwnProperty(key)) {
                Object.defineProperty(this.prototype, key, { get: computedProperties[key], enumerable: true });
              }
            }
          };

          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      atscript: {
        value: function atscript() {
          this.aurelia.container.supportAtScript();
          Metadata.configure.location("annotate");
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      _process: {
        value: function Process() {
          var _this = this;
          var aurelia = this.aurelia,
              loader = aurelia.loader,
              info = this.info,
              current;

          if (this.processed) {
            return;
          }

          var next = function () {
            if (current = info.shift()) {
              return loadPlugin(aurelia, loader, current).then(next);
            }

            _this.processed = true;
            return Promise.resolve();
          };

          return next();
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Plugins;
  })();

  exports.Plugins = Plugins;
});
define('aurelia-framework/aurelia',["exports", "aurelia-logging", "aurelia-dependency-injection", "aurelia-loader", "aurelia-templating", "./plugins"], function (exports, _aureliaLogging, _aureliaDependencyInjection, _aureliaLoader, _aureliaTemplating, _plugins) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var LogManager = _aureliaLogging;
  var Container = _aureliaDependencyInjection.Container;
  var Loader = _aureliaLoader.Loader;
  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ResourceRegistry = _aureliaTemplating.ResourceRegistry;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var Plugins = _plugins.Plugins;


  var logger = LogManager.getLogger("aurelia"),
      slice = Array.prototype.slice;

  if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
    var CustomEvent = function (event, params) {
      var params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  function loadResources(container, resourcesToLoad, appResources) {
    var next = function () {
      if (current = resourcesToLoad.shift()) {
        return resourceCoordinator.importResources(current, current.resourceManifestUrl).then(function (resources) {
          resources.forEach(function (x) {
            return x.register(appResources);
          });
          return next();
        });
      }

      return Promise.resolve();
    };

    var resourceCoordinator = container.get(ResourceCoordinator),
        current;

    return next();
  }

  var Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      this.loader = loader || Loader.createDefaultLoader();
      this.container = container || new Container();
      this.resources = resources || new ResourceRegistry();
      this.resourcesToLoad = [];
      this.use = new Plugins(this);

      if (!this.resources.baseResourcePath) {
        this.resources.baseResourcePath = System.baseUrl || "";
      }

      this.withInstance(Aurelia, this);
      this.withInstance(Loader, this.loader);
      this.withInstance(ResourceRegistry, this.resources);
    }

    _prototypeProperties(Aurelia, null, {
      withInstance: {
        value: function withInstance(type, instance) {
          this.container.registerInstance(type, instance);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withSingleton: {
        value: function withSingleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      withResources: {
        value: function withResources(resources) {
          var toAdd = Array.isArray(resources) ? resources : slice.call(arguments);
          toAdd.resourceManifestUrl = this.currentPluginId;
          this.resourcesToLoad.push(toAdd);
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      start: {
        value: function start() {
          var _this = this;
          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info("Aurelia Starting");

          var resourcesToLoad = this.resourcesToLoad;
          this.resourcesToLoad = [];

          return this.use._process().then(function () {
            if (!_this.container.hasHandler(BindingLanguage)) {
              logger.error("You must configure Aurelia with a BindingLanguage implementation.");
            }

            _this.resourcesToLoad = _this.resourcesToLoad.concat(resourcesToLoad);

            return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function () {
              logger.info("Aurelia Started");
              var evt = new window.CustomEvent("aurelia-started", { bubbles: true, cancelable: true });
              document.dispatchEvent(evt);
              return _this;
            });
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setRoot: {
        value: function setRoot(root, applicationHost) {
          var _this2 = this;
          var compositionEngine,
              instruction = {};

          if (!applicationHost || typeof applicationHost == "string") {
            this.host = document.getElementById(applicationHost || "applicationHost") || document.body;
          } else {
            this.host = applicationHost;
          }

          this.host.aurelia = this;
          this.container.registerInstance(Element, this.host);

          compositionEngine = this.container.get(CompositionEngine);
          instruction.viewModel = root;
          instruction.container = instruction.childContainer = this.container;
          instruction.viewSlot = new ViewSlot(this.host, true);
          instruction.viewSlot.transformChildNodesIntoView();

          return compositionEngine.compose(instruction).then(function (root) {
            _this2.root = root;
            instruction.viewSlot.attached();
            var evt = new window.CustomEvent("aurelia-composed", { bubbles: true, cancelable: true });
            setTimeout(function () {
              return document.dispatchEvent(evt);
            }, 1);
            return _this2;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Aurelia;
  })();

  exports.Aurelia = Aurelia;
});
define('aurelia-framework/index',["exports", "./aurelia", "aurelia-dependency-injection", "aurelia-binding", "aurelia-metadata", "aurelia-templating", "aurelia-loader", "aurelia-task-queue", "aurelia-logging"], function (exports, _aurelia, _aureliaDependencyInjection, _aureliaBinding, _aureliaMetadata, _aureliaTemplating, _aureliaLoader, _aureliaTaskQueue, _aureliaLogging) {
  

  var _interopRequireWildcard = function (obj) {
    return obj && obj.constructor === Object ? obj : {
      "default": obj
    };
  };

  var _defaults = function (obj, defaults) {
    for (var key in defaults) {
      if (obj[key] === undefined) {
        obj[key] = defaults[key];
      }
    }

    return obj;
  };

  exports.Aurelia = _aurelia.Aurelia;
  _defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));

  _defaults(exports, _interopRequireWildcard(_aureliaBinding));

  _defaults(exports, _interopRequireWildcard(_aureliaMetadata));

  _defaults(exports, _interopRequireWildcard(_aureliaTemplating));

  _defaults(exports, _interopRequireWildcard(_aureliaLoader));

  _defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));

  var TheLogManager = _aureliaLogging;
  var LogManager = exports.LogManager = TheLogManager;
});
define('aurelia-framework', ['aurelia-framework/index'], function (main) { return main; });

define('aurelia-logging-console',["exports"], function (exports) {
  

  var _toArray = function (arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  };

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ConsoleAppender = (function () {
    function ConsoleAppender() {}

    _prototypeProperties(ConsoleAppender, null, {
      debug: {
        value: function debug(logger, message) {
          for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rest[_key - 2] = arguments[_key];
          }

          console.debug.apply(console, ["DEBUG [" + logger.id + "] " + message].concat(_toArray(rest)));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      info: {
        value: function info(logger, message) {
          for (var _len2 = arguments.length, rest = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            rest[_key2 - 2] = arguments[_key2];
          }

          console.info.apply(console, ["INFO [" + logger.id + "] " + message].concat(_toArray(rest)));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      warn: {
        value: function warn(logger, message) {
          for (var _len3 = arguments.length, rest = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            rest[_key3 - 2] = arguments[_key3];
          }

          console.warn.apply(console, ["WARN [" + logger.id + "] " + message].concat(_toArray(rest)));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      error: {
        value: function error(logger, message) {
          for (var _len4 = arguments.length, rest = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
            rest[_key4 - 2] = arguments[_key4];
          }

          console.error.apply(console, ["ERROR [" + logger.id + "] " + message].concat(_toArray(rest)));
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return ConsoleAppender;
  })();

  exports.ConsoleAppender = ConsoleAppender;
});
define('aurelia-bootstrapper',["exports", "aurelia-loader-default", "aurelia-framework", "aurelia-logging-console"], function (exports, _aureliaLoaderDefault, _aureliaFramework, _aureliaLoggingConsole) {
  

  exports.bootstrap = bootstrap;
  var DefaultLoader = _aureliaLoaderDefault.DefaultLoader;
  var Aurelia = _aureliaFramework.Aurelia;
  var LogManager = _aureliaFramework.LogManager;
  var ConsoleAppender = _aureliaLoggingConsole.ConsoleAppender;


  var logger = LogManager.getLogger("bootstrapper");

  var readyQueue = [];
  var isReady = false;

  function onReady(callback) {
    return new Promise(function (resolve, reject) {
      if (!isReady) {
        readyQueue.push(function () {
          try {
            resolve(callback());
          } catch (e) {
            reject(e);
          }
        });
      } else {
        resolve(callback());
      }
    });
  }

  function bootstrap(configure) {
    return onReady(function () {
      var loader = new DefaultLoader(),
          aurelia = new Aurelia(loader);

      return configureAurelia(aurelia).then(function () {
        return configure(aurelia);
      });
    });
  }

  function ready(global) {
    return new Promise(function (resolve, reject) {
      var completed = function () {
        global.document.removeEventListener("DOMContentLoaded", completed, false);
        global.removeEventListener("load", completed, false);
        resolve(global.document);
      };

      if (global.document.readyState === "complete") {
        resolve(global.document);
      } else {
        global.document.addEventListener("DOMContentLoaded", completed, false);
        global.addEventListener("load", completed, false);
      }
    });
  }

  function loadPolyfills() {
    return System.normalize("aurelia-bootstrapper").then(function (bootstrapperName) {
      return System.normalize("aurelia-framework", bootstrapperName).then(function (frameworkName) {
        System.map["aurelia-framework"] = frameworkName;

        return System.normalize("aurelia-loader", frameworkName).then(function (loaderName) {
          var toLoad = [];

          if (!System.polyfilled) {
            logger.debug("loading core-js");
            toLoad.push(System.normalize("core-js", loaderName).then(function (name) {
              return System["import"](name);
            }));
          }

          toLoad.push(System.normalize("aurelia-depedency-injection", frameworkName).then(function (name) {
            System.map["aurelia-depedency-injection"] = name;
          }));

          toLoad.push(System.normalize("aurelia-router", bootstrapperName).then(function (name) {
            System.map["aurelia-router"] = name;
          }));

          toLoad.push(System.normalize("aurelia-logging-console", bootstrapperName).then(function (name) {
            System.map["aurelia-logging-console"] = name;
          }));

          if (!("import" in document.createElement("link"))) {
            logger.debug("loading the HTMLImports polyfill");
            toLoad.push(System.normalize("webcomponentsjs/HTMLImports.min", loaderName).then(function (name) {
              return System["import"](name);
            }));
          }

          if (!("content" in document.createElement("template"))) {
            logger.debug("loading the HTMLTemplateElement polyfill");
            toLoad.push(System.normalize("aurelia-html-template-element", loaderName).then(function (name) {
              return System["import"](name);
            }));
          }

          return Promise.all(toLoad);
        });
      });
    });
  }

  function configureAurelia(aurelia) {
    return System.normalize("aurelia-bootstrapper").then(function (bName) {
      var toLoad = [];

      toLoad.push(System.normalize("aurelia-templating-binding", bName).then(function (templatingBinding) {
        aurelia.use.defaultBindingLanguage = function () {
          aurelia.use.plugin(templatingBinding);
          return this;
        };
      }));

      toLoad.push(System.normalize("aurelia-history-browser", bName).then(function (historyBrowser) {
        return System.normalize("aurelia-templating-router", bName).then(function (templatingRouter) {
          aurelia.use.router = function () {
            aurelia.use.plugin(historyBrowser);
            aurelia.use.plugin(templatingRouter);
            return this;
          };
        });
      }));

      toLoad.push(System.normalize("aurelia-templating-resources", bName).then(function (name) {
        System.map["aurelia-templating-resources"] = name;
        aurelia.use.defaultResources = function () {
          aurelia.use.plugin(name);
          return this;
        };
      }));

      toLoad.push(System.normalize("aurelia-event-aggregator", bName).then(function (eventAggregator) {
        System.map["aurelia-event-aggregator"] = eventAggregator;
        aurelia.use.eventAggregator = function () {
          aurelia.use.plugin(eventAggregator);
          return this;
        };
      }));

      return Promise.all(toLoad);
    });
  }

  function handleMain(mainHost) {
    var mainModuleId = mainHost.getAttribute("aurelia-main") || "main",
        loader = new DefaultLoader();

    return loader.loadModule(mainModuleId).then(function (m) {
      var aurelia = new Aurelia(loader);
      return configureAurelia(aurelia).then(function () {
        return m.configure(aurelia);
      });
    })["catch"](function (e) {
      setTimeout(function () {
        throw e;
      }, 0);
    });
  }

  function handleApp(appHost) {
    var appModuleId = appHost.getAttribute("aurelia-app") || "app",
        aurelia = new Aurelia();

    return configureAurelia(aurelia).then(function () {
      aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();

      if (appHost.hasAttribute("es5")) {
        aurelia.use.es5();
      } else if (appHost.hasAttribute("atscript")) {
        aurelia.use.atscript();
      }

      return aurelia.start().then(function (a) {
        return a.setRoot(appModuleId, appHost);
      });
    })["catch"](function (e) {
      setTimeout(function () {
        throw e;
      }, 0);
    });
  }

  function runningLocally() {
    return window.location.protocol !== "http" && window.location.protocol !== "https";
  }

  function run() {
    return ready(window).then(function (doc) {
      var mainHost = doc.querySelectorAll("[aurelia-main]"),
          appHost = doc.querySelectorAll("[aurelia-app]"),
          i,
          ii;

      if (appHost.length && !mainHost.length && runningLocally()) {
        LogManager.addAppender(new ConsoleAppender());
        LogManager.setLevel(LogManager.levels.debug);
      }

      return loadPolyfills().then(function () {
        for (i = 0, ii = mainHost.length; i < ii; ++i) {
          handleMain(mainHost[i]);
        }

        for (i = 0, ii = appHost.length; i < ii; ++i) {
          handleApp(appHost[i]);
        }

        isReady = true;
        for (i = 0, ii = readyQueue.length; i < ii; ++i) {
          readyQueue[i]();
        }
        readyQueue = [];
      });
    });
  }

  run();
});
define('aurelia-history',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var History = (function () {
    function History() {}

    _prototypeProperties(History, null, {
      activate: {
        value: function activate() {
          throw new Error("History must implement activate().");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      deactivate: {
        value: function deactivate() {
          throw new Error("History must implement deactivate().");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      navigate: {
        value: function navigate() {
          throw new Error("History must implement navigate().");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      navigateBack: {
        value: function navigateBack() {
          throw new Error("History must implement navigateBack().");
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return History;
  })();

  exports.History = History;
});
define('aurelia-history-browser',["exports", "aurelia-history"], function (exports, _aureliaHistory) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var History = _aureliaHistory.History;
  var routeStripper = /^[#\/]|\s+$/g;

  var rootStripper = /^\/+|\/+$/g;

  var isExplorer = /msie [\w.]+/;

  var trailingSlash = /\/$/;

  function updateHash(location, fragment, replace) {
    if (replace) {
      var href = location.href.replace(/(javascript:|#).*$/, "");
      location.replace(href + "#" + fragment);
    } else {
      location.hash = "#" + fragment;
    }
  }

  var BrowserHistory = (function (History) {
    function BrowserHistory() {
      this.interval = 50;
      this.active = false;
      this.previousFragment = "";
      this._checkUrlCallback = this.checkUrl.bind(this);

      if (typeof window !== "undefined") {
        this.location = window.location;
        this.history = window.history;
      }
    }

    _inherits(BrowserHistory, History);

    _prototypeProperties(BrowserHistory, null, {
      getHash: {
        value: function getHash(window) {
          var match = (window || this).location.href.match(/#(.*)$/);
          return match ? match[1] : "";
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      getFragment: {
        value: function getFragment(fragment, forcePushState) {
          var root;

          if (!fragment) {
            if (this._hasPushState || !this._wantsHashChange || forcePushState) {
              fragment = this.location.pathname + this.location.search;
              root = this.root.replace(trailingSlash, "");
              if (!fragment.indexOf(root)) {
                fragment = fragment.substr(root.length);
              }
            } else {
              fragment = this.getHash();
            }
          }

          return fragment.replace(routeStripper, "");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      activate: {
        value: function activate(options) {
          if (this.active) {
            throw new Error("History has already been activated.");
          }

          this.active = true;

          this.options = Object.assign({}, { root: "/" }, this.options, options);
          this.root = this.options.root;
          this._wantsHashChange = this.options.hashChange !== false;
          this._wantsPushState = !!this.options.pushState;
          this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

          var fragment = this.getFragment();

          this.root = ("/" + this.root + "/").replace(rootStripper, "/");

          if (this._hasPushState) {
            window.onpopstate = this._checkUrlCallback;
          } else if (this._wantsHashChange && "onhashchange" in window) {
            window.addEventListener("hashchange", this._checkUrlCallback);
          } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this._checkUrlCallback, this.interval);
          }

          this.fragment = fragment;

          var loc = this.location;
          var atRoot = loc.pathname.replace(/[^\/]$/, "$&/") === this.root;

          if (this._wantsHashChange && this._wantsPushState) {
            if (!this._hasPushState && !atRoot) {
              this.fragment = this.getFragment(null, true);
              this.location.replace(this.root + this.location.search + "#" + this.fragment);
              return true;
            } else if (this._hasPushState && atRoot && loc.hash) {
              this.fragment = this.getHash().replace(routeStripper, "");
              this["this"].replaceState({}, document.title, this.root + this.fragment + loc.search);
            }
          }

          if (!this.options.silent) {
            return this.loadUrl();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      deactivate: {
        value: function deactivate() {
          window.onpopstate = null;
          window.removeEventListener("hashchange", this._checkUrlCallback);
          clearInterval(this._checkUrlInterval);
          this.active = false;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      checkUrl: {
        value: function checkUrl() {
          var current = this.getFragment();

          if (current === this.fragment && this.iframe) {
            current = this.getFragment(this.getHash(this.iframe));
          }

          if (current === this.fragment) {
            return false;
          }

          if (this.iframe) {
            this.navigate(current, false);
          }

          this.loadUrl();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      loadUrl: {
        value: function loadUrl(fragmentOverride) {
          var fragment = this.fragment = this.getFragment(fragmentOverride);

          return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      navigate: {
        value: function navigate(fragment, options) {
          if (fragment && fragment.indexOf("://") != -1) {
            window.location.href = fragment;
            return true;
          }

          if (!this.active) {
            return false;
          }

          if (options === undefined) {
            options = {
              trigger: true
            };
          } else if (typeof options === "boolean") {
            options = {
              trigger: options
            };
          }

          fragment = this.getFragment(fragment || "");

          if (this.fragment === fragment) {
            return;
          }

          this.fragment = fragment;

          var url = this.root + fragment;

          if (fragment === "" && url !== "/") {
            url = url.slice(0, -1);
          }

          if (this._hasPushState) {
            this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);
          } else if (this._wantsHashChange) {
            updateHash(this.location, fragment, options.replace);

            if (this.iframe && fragment !== this.getFragment(this.getHash(this.iframe))) {
              if (!options.replace) {
                this.iframe.document.open().close();
              }

              updateHash(this.iframe.location, fragment, options.replace);
            }
          } else {
            return this.location.assign(url);
          }

          if (options.trigger) {
            return this.loadUrl(fragment);
          } else {
            this.previousFragment = fragment;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      navigateBack: {
        value: function navigateBack() {
          this.history.back();
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return BrowserHistory;
  })(History);

  function install(aurelia) {
    aurelia.withSingleton(History, BrowserHistory);
  }

  exports.BrowserHistory = BrowserHistory;
  exports.install = install;
});
define('aurelia-event-aggregator',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  exports.includeEventsIn = includeEventsIn;
  exports.install = install;
  var Handler = (function () {
    function Handler(messageType, callback) {
      this.messageType = messageType;
      this.callback = callback;
    }

    _prototypeProperties(Handler, null, {
      handle: {
        value: function handle(message) {
          if (message instanceof this.messageType) {
            this.callback.call(null, message);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Handler;
  })();

  var EventAggregator = (function () {
    function EventAggregator() {
      this.eventLookup = {};
      this.messageHandlers = [];
    }

    _prototypeProperties(EventAggregator, null, {
      publish: {
        value: function publish(event, data) {
          var subscribers, i, handler;

          if (typeof event === "string") {
            subscribers = this.eventLookup[event];
            if (subscribers) {
              subscribers = subscribers.slice();
              i = subscribers.length;

              while (i--) {
                subscribers[i](data, event);
              }
            }
          } else {
            subscribers = this.messageHandlers.slice();
            i = subscribers.length;

            while (i--) {
              subscribers[i].handle(event);
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(event, callback) {
          var subscribers, handler;

          if (typeof event === "string") {
            subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);

            subscribers.push(callback);

            return function () {
              subscribers.splice(subscribers.indexOf(callback), 1);
            };
          } else {
            handler = new Handler(event, callback);
            subscribers = this.messageHandlers;

            subscribers.push(handler);

            return function () {
              subscribers.splice(subscribers.indexOf(handler), 1);
            };
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return EventAggregator;
  })();

  exports.EventAggregator = EventAggregator;
  function includeEventsIn(obj) {
    var ea = new EventAggregator();

    obj.subscribe = function (event, callback) {
      return ea.subscribe(event, callback);
    };

    obj.publish = function (event, data) {
      ea.publish(event, data);
    };

    return ea;
  }

  function install(aurelia) {
    aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
  }
});
define('aurelia-route-recognizer/dsl',["exports"], function (exports) {
  

  exports.map = map;
  function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }

  Target.prototype = {
    to: function (target, callback) {
      var delegate = this.delegate;

      if (delegate && delegate.willAddRoute) {
        target = delegate.willAddRoute(this.matcher.target, target);
      }

      this.matcher.add(this.path, target);

      if (callback) {
        if (callback.length === 0) {
          throw new Error("You must have an argument in the function passed to `to`");
        }
        this.matcher.addChild(this.path, target, callback, this.delegate);
      }
      return this;
    }
  };

  function Matcher(target) {
    this.routes = {};
    this.children = {};
    this.target = target;
  }

  Matcher.prototype = {
    add: function (path, handler) {
      this.routes[path] = handler;
    },

    addChild: function (path, target, callback, delegate) {
      var matcher = new Matcher(target);
      this.children[path] = matcher;

      var match = generateMatch(path, matcher, delegate);

      if (delegate && delegate.contextEntered) {
        delegate.contextEntered(target, match);
      }

      callback(match);
    }
  };

  function generateMatch(startingPath, matcher, delegate) {
    return function (path, nestedCallback) {
      var fullPath = startingPath + path;

      if (nestedCallback) {
        nestedCallback(generateMatch(fullPath, matcher, delegate));
      } else {
        return new Target(startingPath + path, matcher, delegate);
      }
    };
  }

  function addRoute(routeArray, path, handler) {
    var len = 0;
    for (var i = 0, l = routeArray.length; i < l; i++) {
      len += routeArray[i].path.length;
    }

    path = path.substr(len);
    var route = { path: path, handler: handler };
    routeArray.push(route);
  }

  function eachRoute(baseRoute, matcher, callback, binding) {
    var routes = matcher.routes;

    for (var path in routes) {
      if (routes.hasOwnProperty(path)) {
        var routeArray = baseRoute.slice();
        addRoute(routeArray, path, routes[path]);

        if (matcher.children[path]) {
          eachRoute(routeArray, matcher.children[path], callback, binding);
        } else {
          callback.call(binding, routeArray);
        }
      }
    }
  }

  function map(callback, addRouteCallback) {
    var matcher = new Matcher();

    callback(generateMatch("", matcher, this.delegate));

    eachRoute([], matcher, function (route) {
      if (addRouteCallback) {
        addRouteCallback(this, route);
      } else {
        this.add(route);
      }
    }, this);
  }
});
define('aurelia-route-recognizer/index',["exports", "./dsl"], function (exports, _dsl) {
  

  var map = _dsl.map;


  var specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];

  var escapeRegex = new RegExp("(\\" + specials.join("|\\") + ")", "g");

  function isArray(test) {
    return Object.prototype.toString.call(test) === "[object Array]";
  }

  function StaticSegment(string) {
    this.string = string;
  }
  StaticSegment.prototype = {
    eachChar: function (callback) {
      var string = this.string,
          ch;

      for (var i = 0, l = string.length; i < l; i++) {
        ch = string.charAt(i);
        callback({ validChars: ch });
      }
    },

    regex: function () {
      return this.string.replace(escapeRegex, "\\$1");
    },

    generate: function () {
      return this.string;
    }
  };

  function DynamicSegment(name) {
    this.name = name;
  }
  DynamicSegment.prototype = {
    eachChar: function (callback) {
      callback({ invalidChars: "/", repeat: true });
    },

    regex: function () {
      return "([^/]+)";
    },

    generate: function (params) {
      return params[this.name];
    }
  };

  function StarSegment(name) {
    this.name = name;
  }
  StarSegment.prototype = {
    eachChar: function (callback) {
      callback({ invalidChars: "", repeat: true });
    },

    regex: function () {
      return "(.+)";
    },

    generate: function (params) {
      return params[this.name];
    }
  };

  function EpsilonSegment() {}
  EpsilonSegment.prototype = {
    eachChar: function () {},
    regex: function () {
      return "";
    },
    generate: function () {
      return "";
    }
  };

  function parse(route, names, types) {
    if (route.charAt(0) === "/") {
      route = route.substr(1);
    }

    var segments = route.split("/"),
        results = [];

    for (var i = 0, l = segments.length; i < l; i++) {
      var segment = segments[i],
          match;

      if (match = segment.match(/^:([^\/]+)$/)) {
        results.push(new DynamicSegment(match[1]));
        names.push(match[1]);
        types.dynamics++;
      } else if (match = segment.match(/^\*([^\/]+)$/)) {
        results.push(new StarSegment(match[1]));
        names.push(match[1]);
        types.stars++;
      } else if (segment === "") {
        results.push(new EpsilonSegment());
      } else {
        results.push(new StaticSegment(segment));
        types.statics++;
      }
    }

    return results;
  }

  function State(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
  }

  State.prototype = {
    get: function (charSpec) {
      var nextStates = this.nextStates;

      for (var i = 0, l = nextStates.length; i < l; i++) {
        var child = nextStates[i];

        var isEqual = child.charSpec.validChars === charSpec.validChars;
        isEqual = isEqual && child.charSpec.invalidChars === charSpec.invalidChars;

        if (isEqual) {
          return child;
        }
      }
    },

    put: function (charSpec) {
      var state;

      if (state = this.get(charSpec)) {
        return state;
      }

      state = new State(charSpec);

      this.nextStates.push(state);

      if (charSpec.repeat) {
        state.nextStates.push(state);
      }

      return state;
    },
    match: function (ch) {
      var nextStates = this.nextStates,
          child,
          charSpec,
          chars;

      var returned = [];

      for (var i = 0, l = nextStates.length; i < l; i++) {
        child = nextStates[i];

        charSpec = child.charSpec;

        if (typeof (chars = charSpec.validChars) !== "undefined") {
          if (chars.indexOf(ch) !== -1) {
            returned.push(child);
          }
        } else if (typeof (chars = charSpec.invalidChars) !== "undefined") {
          if (chars.indexOf(ch) === -1) {
            returned.push(child);
          }
        }
      }

      return returned;
    }

  };

  function sortSolutions(states) {
    return states.sort(function (a, b) {
      if (a.types.stars !== b.types.stars) {
        return a.types.stars - b.types.stars;
      }

      if (a.types.stars) {
        if (a.types.statics !== b.types.statics) {
          return b.types.statics - a.types.statics;
        }
        if (a.types.dynamics !== b.types.dynamics) {
          return b.types.dynamics - a.types.dynamics;
        }
      }

      if (a.types.dynamics !== b.types.dynamics) {
        return a.types.dynamics - b.types.dynamics;
      }
      if (a.types.statics !== b.types.statics) {
        return b.types.statics - a.types.statics;
      }

      return 0;
    });
  }

  function recognizeChar(states, ch) {
    var nextStates = [];

    for (var i = 0, l = states.length; i < l; i++) {
      var state = states[i];

      nextStates = nextStates.concat(state.match(ch));
    }

    return nextStates;
  }

  var oCreate = Object.create || function (proto) {
    var F = function () {};

    F.prototype = proto;
    return new F();
  };

  function RecognizeResults(queryParams) {
    this.queryParams = queryParams || {};
  }
  RecognizeResults.prototype = oCreate({
    splice: Array.prototype.splice,
    slice: Array.prototype.slice,
    push: Array.prototype.push,
    length: 0,
    queryParams: null
  });

  function findHandler(state, path, queryParams) {
    var handlers = state.handlers,
        regex = state.regex;
    var captures = path.match(regex),
        currentCapture = 1;
    var result = new RecognizeResults(queryParams);

    for (var i = 0, l = handlers.length; i < l; i++) {
      var handler = handlers[i],
          names = handler.names,
          params = {};

      for (var j = 0, m = names.length; j < m; j++) {
        params[names[j]] = captures[currentCapture++];
      }

      result.push({ handler: handler.handler, params: params, isDynamic: !!names.length });
    }

    return result;
  }

  function addSegment(currentState, segment) {
    segment.eachChar(function (ch) {
      var state;

      currentState = currentState.put(ch);
    });

    return currentState;
  }

  var RouteRecognizer = exports.RouteRecognizer = function () {
    this.rootState = new State();
    this.names = {};
  };


  RouteRecognizer.prototype = {
    add: function (routes, options) {
      var currentState = this.rootState,
          regex = "^",
          types = { statics: 0, dynamics: 0, stars: 0 },
          handlers = [],
          allSegments = [],
          name;

      var isEmpty = true;

      for (var i = 0, l = routes.length; i < l; i++) {
        var route = routes[i],
            names = [];

        var segments = parse(route.path, names, types);

        allSegments = allSegments.concat(segments);

        for (var j = 0, m = segments.length; j < m; j++) {
          var segment = segments[j];

          if (segment instanceof EpsilonSegment) {
            continue;
          }

          isEmpty = false;

          currentState = currentState.put({ validChars: "/" });
          regex += "/";

          currentState = addSegment(currentState, segment);
          regex += segment.regex();
        }

        var handler = { handler: route.handler, names: names };
        handlers.push(handler);
      }

      if (isEmpty) {
        currentState = currentState.put({ validChars: "/" });
        regex += "/";
      }

      currentState.handlers = handlers;
      currentState.regex = new RegExp(regex + "$");
      currentState.types = types;

      if (name = options && options.as) {
        this.names[name] = {
          segments: allSegments,
          handlers: handlers
        };
      }
    },

    handlersFor: function (name) {
      var route = this.names[name],
          result = [];
      if (!route) {
        throw new Error("There is no route named " + name);
      }

      for (var i = 0, l = route.handlers.length; i < l; i++) {
        result.push(route.handlers[i]);
      }

      return result;
    },

    hasRoute: function (name) {
      return !!this.names[name];
    },

    generate: function (name, params) {
      var route = this.names[name],
          output = "";
      if (!route) {
        throw new Error("There is no route named " + name);
      }

      var segments = route.segments;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i];

        if (segment instanceof EpsilonSegment) {
          continue;
        }

        output += "/";
        output += segment.generate(params);
      }

      if (output.charAt(0) !== "/") {
        output = "/" + output;
      }

      if (params && params.queryParams) {
        output += this.generateQueryString(params.queryParams, route.handlers);
      }

      return output;
    },

    generateQueryString: function (params, handlers) {
      var pairs = [];
      var keys = [];
      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      keys.sort();
      for (var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        var value = params[key];
        if (value === null) {
          continue;
        }
        var pair = encodeURIComponent(key);
        if (isArray(value)) {
          for (var j = 0, l = value.length; j < l; j++) {
            var arrayPair = key + "[]" + "=" + encodeURIComponent(value[j]);
            pairs.push(arrayPair);
          }
        } else {
          pair += "=" + encodeURIComponent(value);
          pairs.push(pair);
        }
      }

      if (pairs.length === 0) {
        return "";
      }

      return "?" + pairs.join("&");
    },

    parseQueryString: function (queryString) {
      var pairs = queryString.split("&"),
          queryParams = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("="),
            key = decodeURIComponent(pair[0]),
            keyLength = key.length,
            isArray = false,
            value;
        if (pair.length === 1) {
          value = "true";
        } else {
          if (keyLength > 2 && key.slice(keyLength - 2) === "[]") {
            isArray = true;
            key = key.slice(0, keyLength - 2);
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
          }
          value = pair[1] ? decodeURIComponent(pair[1]) : "";
        }
        if (isArray) {
          queryParams[key].push(value);
        } else {
          queryParams[key] = value;
        }
      }
      return queryParams;
    },

    recognize: function (path) {
      var states = [this.rootState],
          pathLen,
          i,
          l,
          queryStart,
          queryParams = {},
          isSlashDropped = false;

      queryStart = path.indexOf("?");
      if (queryStart !== -1) {
        var queryString = path.substr(queryStart + 1, path.length);
        path = path.substr(0, queryStart);
        queryParams = this.parseQueryString(queryString);
      }

      path = decodeURI(path);

      if (path.charAt(0) !== "/") {
        path = "/" + path;
      }

      pathLen = path.length;
      if (pathLen > 1 && path.charAt(pathLen - 1) === "/") {
        path = path.substr(0, pathLen - 1);
        isSlashDropped = true;
      }

      for (i = 0, l = path.length; i < l; i++) {
        states = recognizeChar(states, path.charAt(i));
        if (!states.length) {
          break;
        }
      }

      var solutions = [];
      for (i = 0, l = states.length; i < l; i++) {
        if (states[i].handlers) {
          solutions.push(states[i]);
        }
      }

      states = sortSolutions(solutions);

      var state = solutions[0];

      if (state && state.handlers) {
        if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
          path = path + "/";
        }
        return findHandler(state, path, queryParams);
      }
    }
  };

  RouteRecognizer.prototype.map = map;
});
define('aurelia-route-recognizer', ['aurelia-route-recognizer/index'], function (main) { return main; });

define('aurelia-router/navigation-plan',["exports"], function (exports) {
  

  var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  exports.buildNavigationPlan = buildNavigationPlan;
  var NO_CHANGE = exports.NO_CHANGE = "no-change";
  var INVOKE_LIFECYCLE = exports.INVOKE_LIFECYCLE = "invoke-lifecycle";
  var REPLACE = exports.REPLACE = "replace";

  function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
    var prev = navigationContext.prevInstruction;
    var next = navigationContext.nextInstruction;
    var plan = {},
        viewPortName;

    if (prev) {
      var newParams = hasDifferentParameterValues(prev, next);
      var pending = [];

      for (viewPortName in prev.viewPortInstructions) {
        var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
        var nextViewPortConfig = next.config.viewPorts[viewPortName];
        var viewPortPlan = plan[viewPortName] = {
          name: viewPortName,
          config: nextViewPortConfig,
          prevComponent: prevViewPortInstruction.component,
          prevModuleId: prevViewPortInstruction.moduleId
        };

        if (prevViewPortInstruction.moduleId != nextViewPortConfig.moduleId) {
          viewPortPlan.strategy = REPLACE;
        } else if ("determineActivationStrategy" in prevViewPortInstruction.component.executionContext) {
          var _prevViewPortInstruction$component$executionContext;
          viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, _toArray(next.lifecycleArgs));
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = INVOKE_LIFECYCLE;
        } else {
          viewPortPlan.strategy = NO_CHANGE;
        }

        if (viewPortPlan.strategy !== REPLACE && prevViewPortInstruction.childRouter) {
          var path = next.getWildcardPath();
          var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then(function (childInstruction) {
            viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);

            return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == INVOKE_LIFECYCLE).then(function (childPlan) {
              viewPortPlan.childNavigationContext.plan = childPlan;
            });
          });

          pending.push(task);
        }
      }

      return Promise.all(pending).then(function () {
        return plan;
      });
    } else {
      for (viewPortName in next.config.viewPorts) {
        plan[viewPortName] = {
          name: viewPortName,
          strategy: REPLACE,
          config: next.config.viewPorts[viewPortName]
        };
      }

      return Promise.resolve(plan);
    }
  }

  var BuildNavigationPlanStep = exports.BuildNavigationPlanStep = (function () {
    function BuildNavigationPlanStep() {}

    _prototypeProperties(BuildNavigationPlanStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return buildNavigationPlan(navigationContext).then(function (plan) {
            navigationContext.plan = plan;
            return next();
          })["catch"](next.cancel);
        },
        writable: true,
        configurable: true
      }
    });

    return BuildNavigationPlanStep;
  })();


  function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params,
        nextParams = next.params,
        nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;

    for (var key in nextParams) {
      if (key == nextWildCardName) {
        continue;
      }

      if (prevParams[key] != nextParams[key]) {
        return true;
      }
    }

    return false;
  }
  exports.__esModule = true;
});
define('aurelia-router/navigation-context',["exports", "./navigation-plan"], function (exports, _navigationPlan) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var REPLACE = _navigationPlan.REPLACE;
  var NavigationContext = exports.NavigationContext = (function () {
    function NavigationContext(router, nextInstruction) {
      this.router = router;
      this.nextInstruction = nextInstruction;
      this.currentInstruction = router.currentInstruction;
      this.prevInstruction = router.currentInstruction;
    }

    _prototypeProperties(NavigationContext, null, {
      commitChanges: {
        value: function commitChanges(waitToSwap) {
          var next = this.nextInstruction,
              prev = this.prevInstruction,
              viewPortInstructions = next.viewPortInstructions,
              router = this.router,
              loads = [],
              delaySwaps = [];

          router.currentInstruction = next;

          if (prev) {
            prev.config.navModel.isActive = false;
          }

          next.config.navModel.isActive = true;

          router.refreshBaseUrl();
          router.refreshNavigation();

          for (var viewPortName in viewPortInstructions) {
            var viewPortInstruction = viewPortInstructions[viewPortName];
            var viewPort = router.viewPorts[viewPortName];

            if (!viewPort) {
              throw new Error("There was no router-view found in the view for " + viewPortInstruction.moduleId + ".");
            }

            if (viewPortInstruction.strategy === REPLACE) {
              if (waitToSwap) {
                delaySwaps.push({ viewPort: viewPort, viewPortInstruction: viewPortInstruction });
              }

              loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function (x) {
                if ("childNavigationContext" in viewPortInstruction) {
                  return viewPortInstruction.childNavigationContext.commitChanges();
                }
              }));
            } else {
              if ("childNavigationContext" in viewPortInstruction) {
                loads.push(viewPortInstruction.childNavigationContext.commitChanges(waitToSwap));
              }
            }
          }

          return Promise.all(loads).then(function () {
            delaySwaps.forEach(function (x) {
              return x.viewPort.swap(x.viewPortInstruction);
            });
          });
        },
        writable: true,
        configurable: true
      },
      buildTitle: {
        value: function buildTitle() {
          var separator = arguments[0] === undefined ? " | " : arguments[0];
          var next = this.nextInstruction,
              title = next.config.navModel.title || "",
              viewPortInstructions = next.viewPortInstructions,
              childTitles = [];

          for (var viewPortName in viewPortInstructions) {
            var viewPortInstruction = viewPortInstructions[viewPortName];

            if ("childNavigationContext" in viewPortInstruction) {
              var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
              if (childTitle) {
                childTitles.push(childTitle);
              }
            }
          }

          if (childTitles.length) {
            title = childTitles.join(separator) + (title ? separator : "") + title;
          }

          if (this.router.title) {
            title += (title ? separator : "") + this.router.title;
          }

          return title;
        },
        writable: true,
        configurable: true
      }
    });

    return NavigationContext;
  })();
  var CommitChangesStep = exports.CommitChangesStep = (function () {
    function CommitChangesStep() {}

    _prototypeProperties(CommitChangesStep, null, {
      run: {
        value: function run(navigationContext, next) {
          navigationContext.commitChanges(true);

          var title = navigationContext.buildTitle();
          if (title) {
            document.title = title;
          }

          return next();
        },
        writable: true,
        configurable: true
      }
    });

    return CommitChangesStep;
  })();
  exports.__esModule = true;
});
define('aurelia-router/navigation-instruction',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var NavigationInstruction = exports.NavigationInstruction = (function () {
    function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
      this.fragment = fragment;
      this.queryString = queryString;
      this.params = params || {};
      this.queryParams = queryParams;
      this.config = config;
      this.lifecycleArgs = [params, queryParams, config];
      this.viewPortInstructions = {};

      if (parentInstruction) {
        this.params.$parent = parentInstruction.params;
      }
    }

    _prototypeProperties(NavigationInstruction, null, {
      addViewPortInstruction: {
        value: function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
          return this.viewPortInstructions[viewPortName] = {
            name: viewPortName,
            strategy: strategy,
            moduleId: moduleId,
            component: component,
            childRouter: component.executionContext.router,
            lifecycleArgs: this.lifecycleArgs.slice()
          };
        },
        writable: true,
        configurable: true
      },
      getWildCardName: {
        value: function getWildCardName() {
          var wildcardIndex = this.config.route.lastIndexOf("*");
          return this.config.route.substr(wildcardIndex + 1);
        },
        writable: true,
        configurable: true
      },
      getWildcardPath: {
        value: function getWildcardPath() {
          var wildcardName = this.getWildCardName(),
              path = this.params[wildcardName];

          if (this.queryString) {
            path += "?" + this.queryString;
          }

          return path;
        },
        writable: true,
        configurable: true
      },
      getBaseUrl: {
        value: function getBaseUrl() {
          if (!this.params) {
            return this.fragment;
          }

          var wildcardName = this.getWildCardName(),
              path = this.params[wildcardName];

          if (!path) {
            return this.fragment;
          }

          return this.fragment.substr(0, this.fragment.lastIndexOf(path));
        },
        writable: true,
        configurable: true
      }
    });

    return NavigationInstruction;
  })();
  exports.__esModule = true;
});
define('aurelia-router/router-configuration',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var RouterConfiguration = exports.RouterConfiguration = (function () {
    function RouterConfiguration() {
      this.instructions = [];
      this.options = {};
    }

    _prototypeProperties(RouterConfiguration, null, {
      map: {
        value: function map(route, config) {
          if (Array.isArray(route)) {
            for (var i = 0; i < route.length; i++) {
              this.map(route[i]);
            }

            return this;
          }

          if (typeof route == "string") {
            if (!config) {
              config = {};
            } else if (typeof config == "string") {
              config = { moduleId: config };
            }

            config.route = route;
          } else {
            config = route;
          }

          return this.mapRoute(config);
        },
        writable: true,
        configurable: true
      },
      mapRoute: {
        value: function mapRoute(config) {
          var _this = this;
          this.instructions.push(function (router) {
            if (Array.isArray(config.route)) {
              var navModel = {},
                  i,
                  ii,
                  current;

              for (i = 0, ii = config.route.length; i < ii; ++i) {
                current = Object.assign({}, config);
                current.route = config.route[i];
                _this.configureRoute(router, current, navModel);
              }
            } else {
              _this.configureRoute(router, Object.assign({}, config));
            }
          });

          return this;
        },
        writable: true,
        configurable: true
      },
      mapUnknownRoutes: {
        value: function mapUnknownRoutes(config) {
          this.unknownRouteConfig = config;
          return this;
        },
        writable: true,
        configurable: true
      },
      exportToRouter: {
        value: function exportToRouter(router) {
          var instructions = this.instructions,
              i,
              ii;

          for (i = 0, ii = instructions.length; i < ii; ++i) {
            instructions[i](router);
          }

          if (this.title) {
            router.title = this.title;
          }

          if (this.unknownRouteConfig) {
            router.handleUnknownRoutes(this.unknownRouteConfig);
          }

          router.options = this.options;
        },
        writable: true,
        configurable: true
      },
      configureRoute: {
        value: function configureRoute(router, config, navModel) {
          this.ensureDefaultsForRouteConfig(config);
          router.addRoute(config, navModel);
        },
        writable: true,
        configurable: true
      },
      ensureDefaultsForRouteConfig: {
        value: function ensureDefaultsForRouteConfig(config) {
          config.name = ensureConfigValue(config, "name", this.deriveName);
          config.route = ensureConfigValue(config, "route", this.deriveRoute);
          config.title = ensureConfigValue(config, "title", this.deriveTitle);
          config.moduleId = ensureConfigValue(config, "moduleId", this.deriveModuleId);
        },
        writable: true,
        configurable: true
      },
      deriveName: {
        value: function deriveName(config) {
          return config.title || (config.route ? stripParametersFromRoute(config.route) : config.moduleId);
        },
        writable: true,
        configurable: true
      },
      deriveRoute: {
        value: function deriveRoute(config) {
          return config.moduleId || config.name;
        },
        writable: true,
        configurable: true
      },
      deriveTitle: {
        value: function deriveTitle(config) {
          var value = config.name;
          return value.substr(0, 1).toUpperCase() + value.substr(1);
        },
        writable: true,
        configurable: true
      },
      deriveModuleId: {
        value: function deriveModuleId(config) {
          return stripParametersFromRoute(config.route);
        },
        writable: true,
        configurable: true
      }
    });

    return RouterConfiguration;
  })();


  function ensureConfigValue(config, property, getter) {
    var value = config[property];

    if (value || value === "") {
      return value;
    }

    return getter(config);
  }

  function stripParametersFromRoute(route) {
    var colonIndex = route.indexOf(":");
    var length = colonIndex > 0 ? colonIndex - 1 : route.length;
    return route.substr(0, length);
  }
  exports.__esModule = true;
});
define('aurelia-router/util',["exports"], function (exports) {
  

  exports.processPotential = processPotential;
  function processPotential(obj, resolve, reject) {
    if (obj && typeof obj.then === "function") {
      var dfd = obj.then(resolve);

      if (typeof dfd["catch"] === "function") {
        return dfd["catch"](reject);
      } else if (typeof dfd.fail === "function") {
        return dfd.fail(reject);
      }

      return dfd;
    } else {
      try {
        return resolve(obj);
      } catch (error) {
        return reject(error);
      }
    }
  }
  exports.__esModule = true;
});
define('aurelia-router/router',["exports", "aurelia-route-recognizer", "aurelia-path", "./navigation-context", "./navigation-instruction", "./router-configuration", "./util"], function (exports, _aureliaRouteRecognizer, _aureliaPath, _navigationContext, _navigationInstruction, _routerConfiguration, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var RouteRecognizer = _aureliaRouteRecognizer.RouteRecognizer;
  var join = _aureliaPath.join;
  var NavigationContext = _navigationContext.NavigationContext;
  var NavigationInstruction = _navigationInstruction.NavigationInstruction;
  var RouterConfiguration = _routerConfiguration.RouterConfiguration;
  var processPotential = _util.processPotential;
  var Router = exports.Router = (function () {
    function Router(container, history) {
      this.container = container;
      this.history = history;
      this.viewPorts = {};
      this.reset();
      this.baseUrl = "";
    }

    _prototypeProperties(Router, null, {
      registerViewPort: {
        value: function registerViewPort(viewPort, name) {
          name = name || "default";
          this.viewPorts[name] = viewPort;
        },
        writable: true,
        configurable: true
      },
      refreshBaseUrl: {
        value: function refreshBaseUrl() {
          if (this.parent) {
            var baseUrl = this.parent.currentInstruction.getBaseUrl();
            this.baseUrl = this.parent.baseUrl + baseUrl;
          }
        },
        writable: true,
        configurable: true
      },
      refreshNavigation: {
        value: function refreshNavigation() {
          var nav = this.navigation;

          for (var i = 0, length = nav.length; i < length; i++) {
            var current = nav[i];

            if (!this.history._hasPushState) {
              if (this.baseUrl[0] == "/") {
                current.href = "#" + this.baseUrl;
              } else {
                current.href = "#/" + this.baseUrl;
              }
            } else {
              current.href = "/" + this.baseUrl;
            }

            if (current.href[current.href.length - 1] != "/") {
              current.href += "/";
            }

            current.href += current.relativeHref;
          }
        },
        writable: true,
        configurable: true
      },
      configure: {
        value: function configure(callbackOrConfig) {
          if (typeof callbackOrConfig == "function") {
            var config = new RouterConfiguration();
            callbackOrConfig(config);
            config.exportToRouter(this);
          } else {
            callbackOrConfig.exportToRouter(this);
          }

          return this;
        },
        writable: true,
        configurable: true
      },
      navigate: {
        value: function navigate(fragment, options) {
          fragment = join(this.baseUrl, fragment);
          return this.history.navigate(fragment, options);
        },
        writable: true,
        configurable: true
      },
      navigateBack: {
        value: function navigateBack() {
          this.history.navigateBack();
        },
        writable: true,
        configurable: true
      },
      createChild: {
        value: function createChild(container) {
          var childRouter = new Router(container || this.container.createChild(), this.history);
          childRouter.parent = this;
          return childRouter;
        },
        writable: true,
        configurable: true
      },
      createNavigationInstruction: {
        value: function createNavigationInstruction() {
          var url = arguments[0] === undefined ? "" : arguments[0];
          var parentInstruction = arguments[1] === undefined ? null : arguments[1];
          var results = this.recognizer.recognize(url);
          var fragment, queryIndex, queryString;

          if (!results || !results.length) {
            results = this.childRecognizer.recognize(url);
          }

          fragment = url;
          queryIndex = fragment.indexOf("?");

          if (queryIndex != -1) {
            fragment = url.substr(0, queryIndex);
            queryString = url.substr(queryIndex + 1);
          }

          if ((!results || !results.length) && this.catchAllHandler) {
            results = [{
              config: {
                navModel: {}
              },
              handler: this.catchAllHandler,
              params: {
                path: fragment
              }
            }];
          }

          if (results && results.length) {
            var first = results[0],
                fragment = url,
                queryIndex = fragment.indexOf("?"),
                queryString;

            if (queryIndex != -1) {
              fragment = url.substr(0, queryIndex);
              queryString = url.substr(queryIndex + 1);
            }

            var instruction = new NavigationInstruction(fragment, queryString, first.params, first.queryParams || results.queryParams, first.config || first.handler, parentInstruction);

            if (typeof first.handler == "function") {
              return first.handler(instruction).then(function (instruction) {
                if (!("viewPorts" in instruction.config)) {
                  instruction.config.viewPorts = {
                    "default": {
                      moduleId: instruction.config.moduleId
                    }
                  };
                }

                return instruction;
              });
            }

            return Promise.resolve(instruction);
          } else {
            return Promise.reject(new Error("Route Not Found: " + url));
          }
        },
        writable: true,
        configurable: true
      },
      createNavigationContext: {
        value: function createNavigationContext(instruction) {
          return new NavigationContext(this, instruction);
        },
        writable: true,
        configurable: true
      },
      generate: {
        value: function generate(name, params) {
          return this.recognizer.generate(name, params);
        },
        writable: true,
        configurable: true
      },
      addRoute: {
        value: function addRoute(config) {
          var navModel = arguments[1] === undefined ? {} : arguments[1];
          if (!("viewPorts" in config)) {
            config.viewPorts = {
              "default": {
                moduleId: config.moduleId,
                view: config.view
              }
            };
          }

          navModel.title = navModel.title || config.title;

          this.routes.push(config);
          this.recognizer.add([{ path: config.route, handler: config }]);

          if (config.route) {
            var withChild = JSON.parse(JSON.stringify(config));
            withChild.route += "/*childRoute";
            withChild.hasChildRouter = true;
            this.childRecognizer.add([{
              path: withChild.route,
              handler: withChild
            }]);

            withChild.navModel = navModel;
          }

          config.navModel = navModel;

          if ((config.nav || "order" in navModel) && this.navigation.indexOf(navModel) === -1) {
            navModel.order = navModel.order || config.nav;
            navModel.href = navModel.href || config.href;
            navModel.isActive = false;
            navModel.config = config;

            if (!config.href) {
              navModel.relativeHref = config.route;
              navModel.href = "";
            }

            if (typeof navModel.order != "number") {
              navModel.order = ++this.fallbackOrder;
            }

            this.navigation.push(navModel);
            this.navigation = this.navigation.sort(function (a, b) {
              return a.order - b.order;
            });
          }
        },
        writable: true,
        configurable: true
      },
      handleUnknownRoutes: {
        value: function handleUnknownRoutes(config) {
          var callback = function (instruction) {
            return new Promise(function (resolve, reject) {
              function done(inst) {
                inst = inst || instruction;
                inst.config.route = inst.params.path;
                resolve(inst);
              }

              if (!config) {
                instruction.config.moduleId = instruction.fragment;
                done(instruction);
              } else if (typeof config == "string") {
                instruction.config.moduleId = config;
                done(instruction);
              } else if (typeof config == "function") {
                processPotential(config(instruction), done, reject);
              } else {
                instruction.config = config;
                done(instruction);
              }
            });
          };

          this.catchAllHandler = callback;
        },
        writable: true,
        configurable: true
      },
      reset: {
        value: function reset() {
          this.fallbackOrder = 100;
          this.recognizer = new RouteRecognizer();
          this.childRecognizer = new RouteRecognizer();
          this.routes = [];
          this.isNavigating = false;
          this.navigation = [];
        },
        writable: true,
        configurable: true
      }
    });

    return Router;
  })();
  exports.__esModule = true;
});
define('aurelia-router/pipeline',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  function createResult(ctx, next) {
    return {
      status: next.status,
      context: ctx,
      output: next.output,
      completed: next.status == COMPLETED
    };
  }

  var COMPLETED = exports.COMPLETED = "completed";
  var CANCELLED = exports.CANCELLED = "cancelled";
  var REJECTED = exports.REJECTED = "rejected";
  var RUNNING = exports.RUNNING = "running";

  var Pipeline = exports.Pipeline = (function () {
    function Pipeline() {
      this.steps = [];
    }

    _prototypeProperties(Pipeline, null, {
      withStep: {
        value: function withStep(step) {
          var run;

          if (typeof step == "function") {
            run = step;
          } else {
            run = step.run.bind(step);
          }

          this.steps.push(run);

          return this;
        },
        writable: true,
        configurable: true
      },
      run: {
        value: function run(ctx) {
          var index = -1,
              steps = this.steps,
              next,
              currentStep;

          next = function () {
            index++;

            if (index < steps.length) {
              currentStep = steps[index];

              try {
                return currentStep(ctx, next);
              } catch (e) {
                return next.reject(e);
              }
            } else {
              return next.complete();
            }
          };

          next.complete = function (output) {
            next.status = COMPLETED;
            next.output = output;
            return Promise.resolve(createResult(ctx, next));
          };

          next.cancel = function (reason) {
            next.status = CANCELLED;
            next.output = reason;
            return Promise.resolve(createResult(ctx, next));
          };

          next.reject = function (error) {
            next.status = REJECTED;
            next.output = error;
            return Promise.reject(createResult(ctx, next));
          };

          next.status = RUNNING;

          return next();
        },
        writable: true,
        configurable: true
      }
    });

    return Pipeline;
  })();
  exports.__esModule = true;
});
define('aurelia-router/model-binding',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var ApplyModelBindersStep = exports.ApplyModelBindersStep = (function () {
    function ApplyModelBindersStep() {}

    _prototypeProperties(ApplyModelBindersStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return next();
        },
        writable: true,
        configurable: true
      }
    });

    return ApplyModelBindersStep;
  })();
  exports.__esModule = true;
});
define('aurelia-router/route-loading',["exports", "./navigation-plan"], function (exports, _navigationPlan) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  exports.loadNewRoute = loadNewRoute;
  var REPLACE = _navigationPlan.REPLACE;
  var buildNavigationPlan = _navigationPlan.buildNavigationPlan;
  var RouteLoader = exports.RouteLoader = (function () {
    function RouteLoader() {}

    _prototypeProperties(RouteLoader, null, {
      loadRoute: {
        value: function loadRoute(router, config) {
          throw Error("Route loaders must implment \"loadRoute(router, config)\".");
        },
        writable: true,
        configurable: true
      }
    });

    return RouteLoader;
  })();
  var LoadRouteStep = exports.LoadRouteStep = (function () {
    function LoadRouteStep(routeLoader) {
      this.routeLoader = routeLoader;
    }

    _prototypeProperties(LoadRouteStep, {
      inject: {
        value: function inject() {
          return [RouteLoader];
        },
        writable: true,
        configurable: true
      }
    }, {
      run: {
        value: function run(navigationContext, next) {
          return loadNewRoute([], this.routeLoader, navigationContext).then(next)["catch"](next.cancel);
        },
        writable: true,
        configurable: true
      }
    });

    return LoadRouteStep;
  })();
  function loadNewRoute(routers, routeLoader, navigationContext) {
    var toLoad = determineWhatToLoad(navigationContext);
    var loadPromises = toLoad.map(function (current) {
      return loadRoute(routers, routeLoader, current.navigationContext, current.viewPortPlan);
    });

    return Promise.all(loadPromises);
  }

  function determineWhatToLoad(navigationContext, toLoad) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;

    toLoad = toLoad || [];

    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];

      if (viewPortPlan.strategy == REPLACE) {
        toLoad.push({
          viewPortPlan: viewPortPlan,
          navigationContext: navigationContext
        });

        if (viewPortPlan.childNavigationContext) {
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      } else {
        var viewPortInstruction = next.addViewPortInstruction(viewPortName, viewPortPlan.strategy, viewPortPlan.prevModuleId, viewPortPlan.prevComponent);

        if (viewPortPlan.childNavigationContext) {
          viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;
          determineWhatToLoad(viewPortPlan.childNavigationContext, toLoad);
        }
      }
    }

    return toLoad;
  }

  function loadRoute(routers, routeLoader, navigationContext, viewPortPlan) {
    var moduleId = viewPortPlan.config.moduleId;
    var next = navigationContext.nextInstruction;

    routers.push(navigationContext.router);

    return loadComponent(routeLoader, navigationContext.router, viewPortPlan.config).then(function (component) {
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);

      var controller = component.executionContext;

      if (controller.router && routers.indexOf(controller.router) === -1) {
        var path = next.getWildcardPath();

        return controller.router.createNavigationInstruction(path, next).then(function (childInstruction) {
          viewPortPlan.childNavigationContext = controller.router.createNavigationContext(childInstruction);

          return buildNavigationPlan(viewPortPlan.childNavigationContext).then(function (childPlan) {
            viewPortPlan.childNavigationContext.plan = childPlan;
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;

            return loadNewRoute(routers, routeLoader, viewPortPlan.childNavigationContext);
          });
        });
      }
    });
  }

  function loadComponent(routeLoader, router, config) {
    return routeLoader.loadRoute(router, config).then(function (component) {
      if ("configureRouter" in component.executionContext) {
        var result = component.executionContext.configureRouter() || Promise.resolve();
        return result.then(function () {
          return component;
        });
      }

      component.router = router;
      component.config = config;
      return component;
    });
  }
  exports.__esModule = true;
});
define('aurelia-router/navigation-commands',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  exports.isNavigationCommand = isNavigationCommand;
  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === "function";
  }

  var Redirect = exports.Redirect = (function () {
    function Redirect(url) {
      this.url = url;
      this.shouldContinueProcessing = false;
    }

    _prototypeProperties(Redirect, null, {
      navigate: {
        value: function navigate(appRouter) {
          (this.router || appRouter).navigate(this.url, { trigger: true, replace: true });
        },
        writable: true,
        configurable: true
      }
    });

    return Redirect;
  })();
  exports.__esModule = true;
});
define('aurelia-router/activation',["exports", "./navigation-plan", "./navigation-commands", "./util"], function (exports, _navigationPlan, _navigationCommands, _util) {
  

  var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var INVOKE_LIFECYCLE = _navigationPlan.INVOKE_LIFECYCLE;
  var REPLACE = _navigationPlan.REPLACE;
  var isNavigationCommand = _navigationCommands.isNavigationCommand;
  var processPotential = _util.processPotential;
  var affirmations = exports.affirmations = ["yes", "ok", "true"];

  var CanDeactivatePreviousStep = exports.CanDeactivatePreviousStep = (function () {
    function CanDeactivatePreviousStep() {}

    _prototypeProperties(CanDeactivatePreviousStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return processDeactivatable(navigationContext.plan, "canDeactivate", next);
        },
        writable: true,
        configurable: true
      }
    });

    return CanDeactivatePreviousStep;
  })();
  var CanActivateNextStep = exports.CanActivateNextStep = (function () {
    function CanActivateNextStep() {}

    _prototypeProperties(CanActivateNextStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return processActivatable(navigationContext, "canActivate", next);
        },
        writable: true,
        configurable: true
      }
    });

    return CanActivateNextStep;
  })();
  var DeactivatePreviousStep = exports.DeactivatePreviousStep = (function () {
    function DeactivatePreviousStep() {}

    _prototypeProperties(DeactivatePreviousStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return processDeactivatable(navigationContext.plan, "deactivate", next, true);
        },
        writable: true,
        configurable: true
      }
    });

    return DeactivatePreviousStep;
  })();
  var ActivateNextStep = exports.ActivateNextStep = (function () {
    function ActivateNextStep() {}

    _prototypeProperties(ActivateNextStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return processActivatable(navigationContext, "activate", next, true);
        },
        writable: true,
        configurable: true
      }
    });

    return ActivateNextStep;
  })();


  function processDeactivatable(plan, callbackName, next, ignoreResult) {
    var infos = findDeactivatable(plan, callbackName),
        i = infos.length;

    function inspect(val) {
      if (ignoreResult || shouldContinue(val)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }

    function iterate() {
      if (i--) {
        try {
          var controller = infos[i];
          var result = controller[callbackName]();
          return processPotential(result, inspect, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }

    return iterate();
  }

  function findDeactivatable(plan, callbackName, list) {
    list = list || [];

    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];
      var prevComponent = viewPortPlan.prevComponent;

      if ((viewPortPlan.strategy == INVOKE_LIFECYCLE || viewPortPlan.strategy == REPLACE) && prevComponent) {
        var controller = prevComponent.executionContext;

        if (callbackName in controller) {
          list.push(controller);
        }
      }

      if (viewPortPlan.childNavigationContext) {
        findDeactivatable(viewPortPlan.childNavigationContext.plan, callbackName, list);
      } else if (prevComponent) {
        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }

    return list;
  }

  function addPreviousDeactivatable(component, callbackName, list) {
    var controller = component.executionContext;

    if (controller.router && controller.router.currentInstruction) {
      var viewPortInstructions = controller.router.currentInstruction.viewPortInstructions;

      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];
        var prevComponent = viewPortInstruction.component;
        var prevController = prevComponent.executionContext;

        if (callbackName in prevController) {
          list.push(prevController);
        }

        addPreviousDeactivatable(prevComponent, callbackName, list);
      }
    }
  }

  function processActivatable(navigationContext, callbackName, next, ignoreResult) {
    var infos = findActivatable(navigationContext, callbackName),
        length = infos.length,
        i = -1;

    function inspect(val, router) {
      if (ignoreResult || shouldContinue(val, router)) {
        return iterate();
      } else {
        return next.cancel(val);
      }
    }

    function iterate() {
      i++;

      if (i < length) {
        try {
          var _current$controller;
          var current = infos[i];
          var result = (_current$controller = current.controller)[callbackName].apply(_current$controller, _toArray(current.lifecycleArgs));
          return processPotential(result, function (val) {
            return inspect(val, current.router);
          }, next.cancel);
        } catch (error) {
          return next.cancel(error);
        }
      } else {
        return next();
      }
    }

    return iterate();
  }

  function findActivatable(navigationContext, callbackName, list, router) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;

    list = list || [];

    Object.keys(plan).filter(function (viewPortName) {
      var viewPortPlan = plan[viewPortName];
      var viewPortInstruction = next.viewPortInstructions[viewPortName];
      var controller = viewPortInstruction.component.executionContext;

      if ((viewPortPlan.strategy === INVOKE_LIFECYCLE || viewPortPlan.strategy === REPLACE) && callbackName in controller) {
        list.push({
          controller: controller,
          lifecycleArgs: viewPortInstruction.lifecycleArgs,
          router: router
        });
      }

      if (viewPortPlan.childNavigationContext) {
        findActivatable(viewPortPlan.childNavigationContext, callbackName, list, controller.router || router);
      }
    });

    return list;
  }

  function shouldContinue(output, router) {
    if (output instanceof Error) {
      return false;
    }

    if (isNavigationCommand(output)) {
      output.router = router;
      return !!output.shouldContinueProcessing;
    }

    if (typeof output == "string") {
      return affirmations.indexOf(value.toLowerCase()) !== -1;
    }

    if (typeof output == "undefined") {
      return true;
    }

    return output;
  }
  exports.__esModule = true;
});
define('aurelia-router/pipeline-provider',["exports", "aurelia-dependency-injection", "./pipeline", "./navigation-plan", "./model-binding", "./route-loading", "./navigation-context", "./activation"], function (exports, _aureliaDependencyInjection, _pipeline, _navigationPlan, _modelBinding, _routeLoading, _navigationContext, _activation) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var Container = _aureliaDependencyInjection.Container;
  var Pipeline = _pipeline.Pipeline;
  var BuildNavigationPlanStep = _navigationPlan.BuildNavigationPlanStep;
  var ApplyModelBindersStep = _modelBinding.ApplyModelBindersStep;
  var LoadRouteStep = _routeLoading.LoadRouteStep;
  var CommitChangesStep = _navigationContext.CommitChangesStep;
  var CanDeactivatePreviousStep = _activation.CanDeactivatePreviousStep;
  var CanActivateNextStep = _activation.CanActivateNextStep;
  var DeactivatePreviousStep = _activation.DeactivatePreviousStep;
  var ActivateNextStep = _activation.ActivateNextStep;
  var PipelineProvider = exports.PipelineProvider = (function () {
    function PipelineProvider(container) {
      this.container = container;
      this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, LoadRouteStep, ApplyModelBindersStep, CanActivateNextStep, DeactivatePreviousStep, ActivateNextStep, CommitChangesStep];
    }

    _prototypeProperties(PipelineProvider, {
      inject: {
        value: function inject() {
          return [Container];
        },
        writable: true,
        configurable: true
      }
    }, {
      createPipeline: {
        value: function createPipeline(navigationContext) {
          var _this = this;
          var pipeline = new Pipeline();
          this.steps.forEach(function (step) {
            return pipeline.withStep(_this.container.get(step));
          });
          return pipeline;
        },
        writable: true,
        configurable: true
      }
    });

    return PipelineProvider;
  })();
  exports.__esModule = true;
});
define('aurelia-router/app-router',["exports", "aurelia-dependency-injection", "aurelia-history", "./router", "./pipeline-provider", "./navigation-commands"], function (exports, _aureliaDependencyInjection, _aureliaHistory, _router, _pipelineProvider, _navigationCommands) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var Container = _aureliaDependencyInjection.Container;
  var History = _aureliaHistory.History;
  var Router = _router.Router;
  var PipelineProvider = _pipelineProvider.PipelineProvider;
  var isNavigationCommand = _navigationCommands.isNavigationCommand;
  var AppRouter = exports.AppRouter = (function (Router) {
    function AppRouter(container, history, pipelineProvider) {
      _get(Object.getPrototypeOf(AppRouter.prototype), "constructor", this).call(this, container, history);
      this.pipelineProvider = pipelineProvider;
      document.addEventListener("click", handleLinkClick.bind(this), true);
    }

    _inherits(AppRouter, Router);

    _prototypeProperties(AppRouter, {
      inject: {
        value: function inject() {
          return [Container, History, PipelineProvider];
        },
        writable: true,
        configurable: true
      }
    }, {
      loadUrl: {
        value: function loadUrl(url) {
          var _this = this;
          return this.createNavigationInstruction(url).then(function (instruction) {
            return _this.queueInstruction(instruction);
          })["catch"](function (error) {
            console.error(error);

            if (_this.history.previousFragment) {
              _this.navigate(_this.history.previousFragment, false);
            }
          });
        },
        writable: true,
        configurable: true
      },
      queueInstruction: {
        value: function queueInstruction(instruction) {
          var _this = this;
          return new Promise(function (resolve) {
            instruction.resolve = resolve;
            _this.queue.unshift(instruction);
            _this.dequeueInstruction();
          });
        },
        writable: true,
        configurable: true
      },
      dequeueInstruction: {
        value: function dequeueInstruction() {
          var _this = this;
          if (this.isNavigating) {
            return;
          }

          var instruction = this.queue.shift();
          this.queue = [];

          if (!instruction) {
            return;
          }

          this.isNavigating = true;

          var context = this.createNavigationContext(instruction);
          var pipeline = this.pipelineProvider.createPipeline(context);

          pipeline.run(context).then(function (result) {
            _this.isNavigating = false;

            if (result.completed) {
              _this.history.previousFragment = instruction.fragment;
            }

            if (result.output instanceof Error) {
              console.error(result.output);
            }

            if (isNavigationCommand(result.output)) {
              result.output.navigate(_this);
            } else if (!result.completed && _this.history.previousFragment) {
              _this.navigate(_this.history.previousFragment, false);
            }

            instruction.resolve(result);
            _this.dequeueInstruction();
          })["catch"](function (error) {
            console.error(error);
          });
        },
        writable: true,
        configurable: true
      },
      registerViewPort: {
        value: function registerViewPort(viewPort, name) {
          var _this = this;
          _get(Object.getPrototypeOf(AppRouter.prototype), "registerViewPort", this).call(this, viewPort, name);

          if (!this.isActive) {
            if ("configureRouter" in this.container.viewModel) {
              var result = this.container.viewModel.configureRouter() || Promise.resolve();
              return result.then(function () {
                return _this.activate();
              });
            } else {
              this.activate();
            }
          } else {
            this.dequeueInstruction();
          }
        },
        writable: true,
        configurable: true
      },
      activate: {
        value: function activate(options) {
          if (this.isActive) {
            return;
          }

          this.isActive = true;
          this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
          this.history.activate(this.options);
          this.dequeueInstruction();
        },
        writable: true,
        configurable: true
      },
      deactivate: {
        value: function deactivate() {
          this.isActive = false;
          this.history.deactivate();
        },
        writable: true,
        configurable: true
      },
      reset: {
        value: function reset() {
          _get(Object.getPrototypeOf(AppRouter.prototype), "reset", this).call(this);
          this.queue = [];
          this.options = null;
        },
        writable: true,
        configurable: true
      }
    });

    return AppRouter;
  })(Router);


  function handleLinkClick(evt) {
    if (!this.isActive) {
      return;
    }

    var target = evt.target;
    if (target.tagName != "A") {
      return;
    }

    if (this.history._hasPushState) {
      if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
        var href = target.getAttribute("href");

        if (href !== null && !(href.charAt(0) === "#" || /^[a-z]+:/i.test(href))) {
          evt.preventDefault();
          this.history.navigate(href);
        }
      }
    }
  }

  function targetIsThisWindow(target) {
    var targetWindow = target.getAttribute("target");

    return !targetWindow || targetWindow === window.name || targetWindow === "_self" || targetWindow === "top" && window === window.top;
  }
  exports.__esModule = true;
});
define('aurelia-router/index',["exports", "./router", "./app-router", "./pipeline-provider", "./navigation-commands", "./route-loading", "./router-configuration", "./navigation-plan"], function (exports, _router, _appRouter, _pipelineProvider, _navigationCommands, _routeLoading, _routerConfiguration, _navigationPlan) {
  

  exports.Router = _router.Router;
  exports.AppRouter = _appRouter.AppRouter;
  exports.PipelineProvider = _pipelineProvider.PipelineProvider;
  exports.Redirect = _navigationCommands.Redirect;
  exports.RouteLoader = _routeLoading.RouteLoader;
  exports.RouterConfiguration = _routerConfiguration.RouterConfiguration;
  exports.NO_CHANGE = _navigationPlan.NO_CHANGE;
  exports.INVOKE_LIFECYCLE = _navigationPlan.INVOKE_LIFECYCLE;
  exports.REPLACE = _navigationPlan.REPLACE;
  exports.__esModule = true;
});
define('aurelia-router', ['aurelia-router/index'], function (main) { return main; });

define('aurelia-templating-binding/syntax-interpreter',["exports", "aurelia-binding"], function (exports, _aureliaBinding) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Parser = _aureliaBinding.Parser;
  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var EventManager = _aureliaBinding.EventManager;
  var ListenerExpression = _aureliaBinding.ListenerExpression;
  var BindingExpression = _aureliaBinding.BindingExpression;
  var NameExpression = _aureliaBinding.NameExpression;
  var CallExpression = _aureliaBinding.CallExpression;
  var ONE_WAY = _aureliaBinding.ONE_WAY;
  var TWO_WAY = _aureliaBinding.TWO_WAY;
  var ONE_TIME = _aureliaBinding.ONE_TIME;
  var SyntaxInterpreter = (function () {
    function SyntaxInterpreter(parser, observerLocator, eventManager) {
      this.parser = parser;
      this.observerLocator = observerLocator;
      this.eventManager = eventManager;
    }

    _prototypeProperties(SyntaxInterpreter, {
      inject: {
        value: function inject() {
          return [Parser, ObserverLocator, EventManager];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      interpret: {
        value: function interpret(resources, element, info, existingInstruction) {
          if (info.command in this) {
            return this[info.command](resources, element, info, existingInstruction);
          }

          return this.handleUnknownCommand(resources, element, info, existingInstruction);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleUnknownCommand: {
        value: function handleUnknownCommand(resources, element, info, existingInstruction) {
          var attrName = info.attrName,
              command = info.command;

          var instruction = this.options(resources, element, info, existingInstruction);

          instruction.alteredAttr = true;
          instruction.attrName = "global-behavior";
          instruction.attributes.aureliaAttrName = attrName;
          instruction.attributes.aureliaCommand = command;

          return instruction;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      determineDefaultBindingMode: {
        value: function determineDefaultBindingMode(element, attrName) {
          var tagName = element.tagName.toLowerCase();

          if (tagName === "input") {
            return attrName === "value" || attrName === "checked" ? TWO_WAY : ONE_WAY;
          } else if (tagName == "textarea" || tagName == "select") {
            return attrName == "value" ? TWO_WAY : ONE_WAY;
          }

          return ONE_WAY;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bind: {
        value: function bind(resources, element, info, existingInstruction) {
          var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

          instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), info.defaultBindingMode || this.determineDefaultBindingMode(element, info.attrName), resources.valueConverterLookupFunction);

          return instruction;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      trigger: {
        value: function trigger(resources, element, info) {
          return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), false, true);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      delegate: {
        value: function delegate(resources, element, info) {
          return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), true, true);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      call: {
        value: function call(resources, element, info, existingInstruction) {
          var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

          instruction.attributes[info.attrName] = new CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.valueConverterLookupFunction);

          return instruction;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      options: {
        value: function options(resources, element, info, existingInstruction) {
          var instruction = existingInstruction || { attrName: info.attrName, attributes: {} },
              attrValue = info.attrValue,
              language = this.language,
              name = null,
              target = "",
              current,
              i,
              ii;

          for (i = 0, ii = attrValue.length; i < ii; ++i) {
            current = attrValue[i];

            if (current === ";") {
              info = language.inspectAttribute(resources, name, target.trim());
              language.createAttributeInstruction(resources, element, info, instruction);

              if (!instruction.attributes[info.attrName]) {
                instruction.attributes[info.attrName] = info.attrValue;
              }

              target = "";
              name = null;
            } else if (current === ":" && name === null) {
              name = target.trim();
              target = "";
            } else {
              target += current;
            }
          }

          if (name !== null) {
            info = language.inspectAttribute(resources, name, target.trim());
            language.createAttributeInstruction(resources, element, info, instruction);

            if (!instruction.attributes[info.attrName]) {
              instruction.attributes[info.attrName] = info.attrValue;
            }
          }

          return instruction;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return SyntaxInterpreter;
  })();

  exports.SyntaxInterpreter = SyntaxInterpreter;


  SyntaxInterpreter.prototype["for"] = function (resources, element, info, existingInstruction) {
    var parts = info.attrValue.split(" of ");

    if (parts.length !== 2) {
      throw new Error("Incorrect syntax for \"for\". The form is: \"$local of $items\".");
    }

    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes.local = parts[0];
    instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, info.attrName, this.parser.parse(parts[1]), ONE_WAY, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype["two-way"] = function (resources, element, info, existingInstruction) {
    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), TWO_WAY, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype["one-way"] = function (resources, element, info, existingInstruction) {
    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), ONE_WAY, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype["one-time"] = function (resources, element, info, existingInstruction) {
    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), ONE_TIME, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype["view-model"] = function (resources, element, info) {
    return new NameExpression(info.attrValue, "view-model");
  };
});
define('aurelia-templating-binding/binding-language',["exports", "aurelia-templating", "aurelia-binding", "./syntax-interpreter"], function (exports, _aureliaTemplating, _aureliaBinding, _syntaxInterpreter) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var Parser = _aureliaBinding.Parser;
  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var BindingExpression = _aureliaBinding.BindingExpression;
  var NameExpression = _aureliaBinding.NameExpression;
  var ONE_WAY = _aureliaBinding.ONE_WAY;
  var SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;


  var info = {};

  var TemplatingBindingLanguage = (function (BindingLanguage) {
    function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter) {
      this.parser = parser;
      this.observerLocator = observerLocator;
      this.syntaxInterpreter = syntaxInterpreter;
      this.interpolationRegex = /\${(.*?)}/g;
      syntaxInterpreter.language = this;
      this.attributeMap = syntaxInterpreter.attributeMap = {
        "class": "className",
        "for": "htmlFor"
      };
    }

    _inherits(TemplatingBindingLanguage, BindingLanguage);

    _prototypeProperties(TemplatingBindingLanguage, {
      inject: {
        value: function inject() {
          return [Parser, ObserverLocator, SyntaxInterpreter];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      inspectAttribute: {
        value: function inspectAttribute(resources, attrName, attrValue) {
          var parts = attrName.split(".");

          info.defaultBindingMode = null;

          if (parts.length == 2) {
            info.attrName = parts[0].trim();
            info.attrValue = attrValue;
            info.command = parts[1].trim();
            info.expression = null;
          } else if (attrName == "ref") {
            info.attrName = attrName;
            info.attrValue = attrValue;
            info.command = null;
            info.expression = new NameExpression(attrValue, "element");
          } else {
            info.attrName = attrName;
            info.attrValue = attrValue;
            info.command = null;
            info.expression = this.parseContent(resources, attrName, attrValue);
          }

          return info;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createAttributeInstruction: {
        value: function createAttributeInstruction(resources, element, info, existingInstruction) {
          var instruction;

          if (info.expression) {
            if (info.attrName === "ref") {
              return info.expression;
            }

            instruction = existingInstruction || { attrName: info.attrName, attributes: {} };
            instruction.attributes[info.attrName] = info.expression;
          } else if (info.command) {
            instruction = this.syntaxInterpreter.interpret(resources, element, info, existingInstruction);
          }

          return instruction;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseText: {
        value: function parseText(resources, value) {
          return this.parseContent(resources, "textContent", value);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      parseContent: {
        value: function parseContent(resources, attrName, attrValue) {
          var parts = attrValue.split(this.interpolationRegex),
              i,
              ii;
          if (parts.length <= 1) {
            return null;
          }

          for (i = 0, ii = parts.length; i < ii; ++i) {
            if (i % 2 === 0) {} else {
              parts[i] = this.parser.parse(parts[i]);
            }
          }

          return new InterpolationBindingExpression(this.observerLocator, this.attributeMap[attrName] || attrName, parts, ONE_WAY, resources.valueConverterLookupFunction, attrName);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return TemplatingBindingLanguage;
  })(BindingLanguage);

  exports.TemplatingBindingLanguage = TemplatingBindingLanguage;
  var InterpolationBindingExpression = (function () {
    function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, valueConverterLookupFunction, attribute) {
      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.parts = parts;
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
      this.attribute = attribute;
      this.discrete = false;
    }

    _prototypeProperties(InterpolationBindingExpression, null, {
      createBinding: {
        value: function createBinding(target) {
          return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return InterpolationBindingExpression;
  })();

  exports.InterpolationBindingExpression = InterpolationBindingExpression;
  var InterpolationBinding = (function () {
    function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, valueConverterLookupFunction) {
      this.observerLocator = observerLocator;
      this.parts = parts;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
      this.toDispose = [];
    }

    _prototypeProperties(InterpolationBinding, null, {
      getObserver: {
        value: function getObserver(obj, propertyName) {
          return this.observerLocator.getObserver(obj, propertyName);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      bind: {
        value: function bind(source) {
          this.source = source;

          if (this.mode == ONE_WAY) {
            this.unbind();
            this.connect();
            this.setValue();
          } else {
            this.setValue();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      setValue: {
        value: function setValue() {
          var value = this.interpolate();
          this.targetProperty.setValue(value);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      connect: {
        value: function connect() {
          var _this = this;
          var info,
              parts = this.parts,
              source = this.source,
              toDispose = this.toDispose = [],
              i,
              ii;

          for (i = 0, ii = parts.length; i < ii; ++i) {
            if (i % 2 === 0) {} else {
              info = parts[i].connect(this, source);
              if (info.observer) {
                toDispose.push(info.observer.subscribe(function (newValue) {
                  _this.setValue();
                }));
              }
            }
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      interpolate: {
        value: function interpolate() {
          var value = "",
              parts = this.parts,
              source = this.source,
              valueConverterLookupFunction = this.valueConverterLookupFunction,
              i,
              ii,
              temp;

          for (i = 0, ii = parts.length; i < ii; ++i) {
            if (i % 2 === 0) {
              value += parts[i];
            } else {
              temp = parts[i].evaluate(source, valueConverterLookupFunction);
              value += typeof temp !== "undefined" && temp !== null ? temp.toString() : "";
            }
          }

          return value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          var i,
              ii,
              toDispose = this.toDispose;

          if (toDispose) {
            for (i = 0, ii = toDispose.length; i < ii; ++i) {
              toDispose[i]();
            }
          }

          this.toDispose = null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return InterpolationBinding;
  })();
});
define('aurelia-templating-binding/index',["exports", "aurelia-templating", "./binding-language", "./syntax-interpreter"], function (exports, _aureliaTemplating, _bindingLanguage, _syntaxInterpreter) {
  

  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var TemplatingBindingLanguage = _bindingLanguage.TemplatingBindingLanguage;
  var SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;


  function install(aurelia) {
    var instance,
        getInstance = function (c) {
      return instance || (instance = c.invoke(TemplatingBindingLanguage));
    };

    if (aurelia.container.hasHandler(TemplatingBindingLanguage)) {
      instance = aurelia.container.get(TemplatingBindingLanguage);
    } else {
      aurelia.container.registerHandler(TemplatingBindingLanguage, getInstance);
    }

    aurelia.container.registerHandler(BindingLanguage, getInstance);
  }

  exports.TemplatingBindingLanguage = TemplatingBindingLanguage;
  exports.SyntaxInterpreter = SyntaxInterpreter;
  exports.install = install;
});
define('aurelia-templating-binding', ['aurelia-templating-binding/index'], function (main) { return main; });

define('aurelia-templating-resources/compose',["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Container = _aureliaDependencyInjection.Container;
  var Behavior = _aureliaTemplating.Behavior;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ViewResources = _aureliaTemplating.ViewResources;
  var Compose = (function () {
    function Compose(container, compositionEngine, viewSlot, viewResources) {
      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
    }

    _prototypeProperties(Compose, {
      metadata: {
        value: function metadata() {
          return Behavior.customElement("compose").withProperty("model").withProperty("view").withProperty("viewModel").noView();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Container, CompositionEngine, ViewSlot, ViewResources];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind(executionContext) {
          this.executionContext = executionContext;
          processInstruction(this, {
            view: this.view,
            viewModel: this.viewModel,
            model: this.model
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      modelChanged: {
        value: function modelChanged(newValue, oldValue) {
          if (this.viewModel && typeof this.viewModel.activate === "function") {
            this.viewModel.activate(newValue);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      viewChanged: {
        value: function viewChanged(newValue, oldValue) {
          processInstruction(this, { view: newValue });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      viewModelChanged: {
        value: function viewModelChanged(newValue, oldValue) {
          processInstruction(this, { viewModel: newValue });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Compose;
  })();

  exports.Compose = Compose;


  function processInstruction(composer, instruction) {
    composer.compositionEngine.compose(Object.assign(instruction, {
      executionContext: composer.executionContext,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentBehavior: composer.current
    })).then(function (next) {
      composer.current = next;
    });
  }
});
define('aurelia-templating-resources/if',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Behavior = _aureliaTemplating.Behavior;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var If = (function () {
    function If(viewFactory, viewSlot) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
    }

    _prototypeProperties(If, {
      metadata: {
        value: function metadata() {
          return Behavior.templateController("if").withProperty("value", "valueChanged", "if");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [BoundViewFactory, ViewSlot];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      valueChanged: {
        value: function valueChanged(newValue) {
          if (!newValue) {
            if (this.view) {
              this.viewSlot.remove(this.view);
              this.view.unbind();
            }

            this.showing = false;
            return;
          }

          if (!this.view) {
            this.view = this.viewFactory.create();
          }

          if (!this.showing) {
            this.showing = true;

            if (!this.view.bound) {
              this.view.bind();
            }

            this.viewSlot.add(this.view);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return If;
  })();

  exports.If = If;
});
define('aurelia-templating-resources/repeat',["exports", "aurelia-binding", "aurelia-templating"], function (exports, _aureliaBinding, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var calcSplices = _aureliaBinding.calcSplices;
  var Behavior = _aureliaTemplating.Behavior;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var Repeat = (function () {
    function Repeat(viewFactory, viewSlot, observerLocator) {
      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.observerLocator = observerLocator;
      this.local = "item";
    }

    _prototypeProperties(Repeat, {
      metadata: {
        value: function metadata() {
          return Behavior.templateController("repeat").withProperty("items", "itemsChanged", "repeat").withProperty("local");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [BoundViewFactory, ViewSlot, ObserverLocator];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind(executionContext) {
          var _this = this;
          var items = this.items;

          this.executionContext = executionContext;

          if (this.oldItems === items) {
            var splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
            var observer = this.observerLocator.getArrayObserver(items);

            this.handleSplices(items, splices);
            this.lastBoundItems = this.oldItems = null;

            this.disposeArraySubscription = observer.subscribe(function (splices) {
              _this.handleSplices(items, splices);
            });
          } else {
            this.processItems();
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.oldItems = this.items;
          this.lastBoundItems = this.items.slice(0);

          if (this.disposeArraySubscription) {
            this.disposeArraySubscription();
            this.disposeArraySubscription = null;
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      itemsChanged: {
        value: function itemsChanged() {
          this.processItems();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      processItems: {
        value: function processItems() {
          var _this2 = this;
          var items = this.items,
              observer = this.observerLocator.getArrayObserver(items),
              viewSlot = this.viewSlot,
              viewFactory = this.viewFactory,
              i,
              ii,
              row,
              view;

          if (this.disposeArraySubscription) {
            this.disposeArraySubscription();
            viewSlot.removeAll();
          }

          for (i = 0, ii = items.length; i < ii; ++i) {
            row = this.createFullExecutionContext(items[i], i, ii);
            view = viewFactory.create(row);
            viewSlot.add(view);
          }

          this.disposeArraySubscription = observer.subscribe(function (splices) {
            _this2.handleSplices(items, splices);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createBaseExecutionContext: {
        value: function createBaseExecutionContext(data) {
          var context = {};
          context[this.local] = data;
          return context;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      createFullExecutionContext: {
        value: function createFullExecutionContext(data, index, length) {
          var context = this.createBaseExecutionContext(data);
          return this.updateExecutionContext(context, index, length);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      updateExecutionContext: {
        value: function updateExecutionContext(context, index, length) {
          var first = index === 0,
              last = index === length - 1,
              even = index % 2 === 0;

          context.$parent = this.executionContext;
          context.$index = index;
          context.$first = first;
          context.$last = last;
          context.$middle = !(first || last);
          context.$odd = !even;
          context.$even = even;

          return context;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      handleSplices: {
        value: function handleSplices(array, splices) {
          var viewLookup = new Map(),
              removeDelta = 0,
              arrayLength = array.length,
              viewSlot = this.viewSlot,
              viewFactory = this.viewFactory,
              i,
              ii,
              j,
              jj,
              splice,
              removed,
              addIndex,
              end,
              model,
              view,
              children,
              length,
              row;

          for (i = 0, ii = splices.length; i < ii; ++i) {
            splice = splices[i];
            removed = splice.removed;

            for (j = 0, jj = removed.length; j < jj; ++j) {
              model = removed[j];
              view = viewSlot.removeAt(splice.index + removeDelta);

              if (view) {
                viewLookup.set(model, view);
              }
            }

            removeDelta -= splice.addedCount;
          }

          for (i = 0, ii = splices.length; i < ii; ++i) {
            splice = splices[i];
            addIndex = splice.index;
            end = splice.index + splice.addedCount;

            for (; addIndex < end; ++addIndex) {
              model = array[addIndex];
              view = viewLookup.get(model);

              if (view) {
                viewLookup["delete"](model);
                viewSlot.insert(addIndex, view);
              } else {
                row = this.createBaseExecutionContext(model);
                view = this.viewFactory.create(row);
                viewSlot.insert(addIndex, view);
              }
            }
          }

          children = viewSlot.children;
          length = children.length;

          for (i = 0; i < length; i++) {
            this.updateExecutionContext(children[i].executionContext, i, length);
          }

          viewLookup.forEach(function (x) {
            return x.unbind();
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Repeat;
  })();

  exports.Repeat = Repeat;
});
define('aurelia-templating-resources/show',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Behavior = _aureliaTemplating.Behavior;


  function addStyleString(str) {
    var node = document.createElement("style");
    node.innerHTML = str;
    node.type = "text/css";
    document.head.appendChild(node);
  }

  addStyleString(".aurelia-hide { display:none; }");

  var Show = (function () {
    function Show(element) {
      this.element = element;
    }

    _prototypeProperties(Show, {
      metadata: {
        value: function metadata() {
          return Behavior.attachedBehavior("show").withProperty("value", "valueChanged", "show");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      valueChanged: {
        value: function valueChanged(newValue) {
          if (newValue) {
            this.element.classList.remove("aurelia-hide");
          } else {
            this.element.classList.add("aurelia-hide");
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Show;
  })();

  exports.Show = Show;
});
define('aurelia-templating-resources/selected-item',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Behavior = _aureliaTemplating.Behavior;
  var SelectedItem = (function () {
    function SelectedItem(element) {
      this.element = element;
      this.options = [];
      this.callback = this.selectedIndexChanged.bind(this);
    }

    _prototypeProperties(SelectedItem, {
      metadata: {
        value: function metadata() {
          return Behavior.attachedBehavior("selected-item").withProperty("value", "valueChanged", "selected-item").and(function (x) {
            return x.bindingIsTwoWay();
          }).syncChildren("options", "optionsChanged", "option");
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind() {
          this.element.addEventListener("change", this.callback, false);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.element.removeEventListener("change", this.callback);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      valueChanged: {
        value: function valueChanged(newValue) {
          this.optionsChanged();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      selectedIndexChanged: {
        value: function selectedIndexChanged() {
          var index = this.element.selectedIndex,
              option = this.options[index];

          this.value = option ? option.model : null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      optionsChanged: {
        value: function optionsChanged(mutations) {
          var value = this.value,
              options = this.options,
              option,
              i,
              ii;

          for (i = 0, ii = options.length; i < ii; ++i) {
            option = options[i];

            if (option.model === value) {
              if (this.element.selectedIndex !== i) {
                this.element.selectedIndex = i;
              }

              return;
            }
          }

          this.element.selectedIndex = 0;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return SelectedItem;
  })();

  exports.SelectedItem = SelectedItem;
});
define('aurelia-templating-resources/global-behavior',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Behavior = _aureliaTemplating.Behavior;
  var GlobalBehavior = (function () {
    function GlobalBehavior(element) {
      this.element = element;
    }

    _prototypeProperties(GlobalBehavior, {
      metadata: {
        value: function metadata() {
          return Behavior.attachedBehavior("global-behavior").withOptions().and(function (x) {
            return x.dynamic();
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind() {
          var handler = GlobalBehavior.handlers[this.aureliaAttrName];

          if (!handler) {
            throw new Error("Conventional binding handler not found for " + this.aureliaAttrName + ".");
          }

          try {
            this.handler = handler.bind(this, this.element, this.aureliaCommand) || handler;
          } catch (error) {
            throw new Error("Conventional binding handler failed.", error);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      attached: {
        value: function attached() {
          if (this.handler && "attached" in this.handler) {
            this.handler.attached(this, this.element);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      detached: {
        value: function detached() {
          if (this.handler && "detached" in this.handler) {
            this.handler.detached(this, this.element);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          if (this.handler && "unbind" in this.handler) {
            this.handler.unbind(this, this.element);
          }

          this.handler = null;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return GlobalBehavior;
  })();

  exports.GlobalBehavior = GlobalBehavior;


  GlobalBehavior.createSettingsFromBehavior = function (behavior) {
    var settings = {};

    for (var key in behavior) {
      if (key === "aureliaAttrName" || key === "aureliaCommand" || !behavior.hasOwnProperty(key)) {
        continue;
      }

      settings[key] = behavior[key];
    }

    return settings;
  };

  GlobalBehavior.jQueryPlugins = {};

  GlobalBehavior.handlers = {
    jquery: {
      bind: function bind(behavior, element, command) {
        var settings = GlobalBehavior.createSettingsFromBehavior(behavior);
        var pluginName = GlobalBehavior.jQueryPlugins[command] || command;
        behavior.plugin = window.jQuery(element)[pluginName](settings);
      },
      unbind: function unbind(behavior, element) {
        if ("destroy" in behavior.plugin) {
          behavior.plugin.destroy();
          behavior.plugin = null;
        }
      }
    }
  };
});
define('aurelia-templating-resources/index',["exports", "./compose", "./if", "./repeat", "./show", "./selected-item", "./global-behavior"], function (exports, _compose, _if, _repeat, _show, _selectedItem, _globalBehavior) {
  

  var Compose = _compose.Compose;
  var If = _if.If;
  var Repeat = _repeat.Repeat;
  var Show = _show.Show;
  var SelectedItem = _selectedItem.SelectedItem;
  var GlobalBehavior = _globalBehavior.GlobalBehavior;


  function install(aurelia) {
    aurelia.withResources([Show, If, Repeat, Compose, SelectedItem, GlobalBehavior]);
  }

  exports.Compose = Compose;
  exports.If = If;
  exports.Repeat = Repeat;
  exports.Show = Show;
  exports.SelectedItem = SelectedItem;
  exports.GlobalBehavior = GlobalBehavior;
  exports.install = install;
});
define('aurelia-templating-resources', ['aurelia-templating-resources/index'], function (main) { return main; });

define('aurelia-templating-router/route-loader',["exports", "aurelia-templating", "aurelia-router", "aurelia-path", "aurelia-metadata"], function (exports, _aureliaTemplating, _aureliaRouter, _aureliaPath, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var _inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) subClass.__proto__ = superClass;
  };

  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var RouteLoader = _aureliaRouter.RouteLoader;
  var Router = _aureliaRouter.Router;
  var relativeToFile = _aureliaPath.relativeToFile;
  var Origin = _aureliaMetadata.Origin;
  var TemplatingRouteLoader = (function (RouteLoader) {
    function TemplatingRouteLoader(compositionEngine) {
      this.compositionEngine = compositionEngine;
    }

    _inherits(TemplatingRouteLoader, RouteLoader);

    _prototypeProperties(TemplatingRouteLoader, {
      inject: {
        value: function inject() {
          return [CompositionEngine];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      loadRoute: {
        value: function loadRoute(router, config) {
          var childContainer = router.container.createChild(),
              instruction = {
            viewModel: relativeToFile(config.moduleId, Origin.get(router.container.viewModel.constructor).moduleId),
            childContainer: childContainer,
            view: config.view
          },
              childRouter;

          childContainer.registerHandler(Router, function (c) {
            return childRouter || (childRouter = router.createChild(childContainer));
          });

          return this.compositionEngine.createViewModel(instruction).then(function (instruction) {
            instruction.executionContext = instruction.viewModel;
            instruction.router = router;
            return instruction;
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return TemplatingRouteLoader;
  })(RouteLoader);

  exports.TemplatingRouteLoader = TemplatingRouteLoader;
});
define('aurelia-templating-router/router-view',["exports", "aurelia-dependency-injection", "aurelia-templating", "aurelia-router", "aurelia-metadata"], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Container = _aureliaDependencyInjection.Container;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ViewStrategy = _aureliaTemplating.ViewStrategy;
  var Router = _aureliaRouter.Router;
  var Metadata = _aureliaMetadata.Metadata;
  var Origin = _aureliaMetadata.Origin;
  var RouterView = (function () {
    function RouterView(element, container, viewSlot, router) {
      this.element = element;
      this.container = container;
      this.viewSlot = viewSlot;
      this.router = router;
      router.registerViewPort(this, element.getAttribute("name"));
    }

    _prototypeProperties(RouterView, {
      metadata: {
        value: function metadata() {
          return Metadata.customElement("router-view").noView();
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element, Container, ViewSlot, Router];
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    }, {
      process: {
        value: function process(viewPortInstruction, waitToSwap) {
          var _this = this;
          var component = viewPortInstruction.component,
              viewStrategy = component.view,
              viewModelInfo = component.viewModelInfo,
              childContainer = component.childContainer,
              viewModel = component.executionContext;

          if (!viewStrategy && "getViewStrategy" in viewModel) {
            viewStrategy = viewModel.getViewStrategy();
          }

          if (viewStrategy) {
            viewStrategy = ViewStrategy.normalize(viewStrategy);
            viewStrategy.makeRelativeTo(Origin.get(component.router.container.viewModel.constructor).moduleId);
          }

          return viewModelInfo.type.load(childContainer, viewModelInfo.value, viewStrategy).then(function (behaviorType) {
            viewPortInstruction.behavior = behaviorType.create(childContainer, { executionContext: viewModel, suppressBind: true });

            if (waitToSwap) {
              return;
            }

            _this.swap(viewPortInstruction);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      swap: {
        value: function swap(viewPortInstruction) {
          viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
          this.viewSlot.swap(viewPortInstruction.behavior.view);

          if (this.view) {
            this.view.unbind();
          }

          this.view = viewPortInstruction.behavior.view;
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return RouterView;
  })();

  exports.RouterView = RouterView;
});
define('aurelia-templating-router/index',["exports", "aurelia-router", "./route-loader", "./router-view"], function (exports, _aureliaRouter, _routeLoader, _routerView) {
  

  var Router = _aureliaRouter.Router;
  var AppRouter = _aureliaRouter.AppRouter;
  var RouteLoader = _aureliaRouter.RouteLoader;
  var TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
  var RouterView = _routerView.RouterView;


  function install(aurelia) {
    aurelia.withSingleton(RouteLoader, TemplatingRouteLoader).withSingleton(Router, AppRouter).withResources(RouterView);
  }

  exports.TemplatingRouteLoader = TemplatingRouteLoader;
  exports.RouterView = RouterView;
  exports.install = install;
});
define('aurelia-templating-router', ['aurelia-templating-router/index'], function (main) { return main; });

define('aurelia-http-client/headers',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Headers = (function () {
    function Headers() {
      var headers = arguments[0] === undefined ? {} : arguments[0];
      this.headers = headers;
    }

    _prototypeProperties(Headers, null, {
      add: {
        value: function add(key, value) {
          this.headers[key] = value;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      get: {
        value: function get(key) {
          return this.headers[key];
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      clear: {
        value: function clear() {
          this.headers = {};
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      configureXHR: {
        value: function configureXHR(xhr) {
          var headers = this.headers,
              key;

          for (key in headers) {
            xhr.setRequestHeader(key, headers[key]);
          }
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return Headers;
  })();

  exports.Headers = Headers;
});
define('aurelia-http-client/http-response-message',["exports", "./headers"], function (exports, _headers) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Headers = _headers.Headers;
  function parseResponseHeaders(headerStr) {
    var headers = {};
    if (!headerStr) {
      return headers;
    }

    var headerPairs = headerStr.split("\r\n");
    for (var i = 0; i < headerPairs.length; i++) {
      var headerPair = headerPairs[i];
      var index = headerPair.indexOf(": ");
      if (index > 0) {
        var key = headerPair.substring(0, index);
        var val = headerPair.substring(index + 2);
        headers[key] = val;
      }
    }

    return headers;
  }

  var HttpResponseMessage = (function () {
    function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
      this.requestMessage = requestMessage;
      this.statusCode = xhr.status;
      this.response = xhr.response;
      this.isSuccess = xhr.status >= 200 && xhr.status < 300;
      this.statusText = xhr.statusText;
      this.responseType = responseType;
      this.reviver = reviver;

      if (xhr.getAllResponseHeaders) {
        this.headers = new Headers(parseResponseHeaders(xhr.getAllResponseHeaders()));
      } else {
        this.headers = new Headers();
      }
    }

    _prototypeProperties(HttpResponseMessage, null, {
      content: {
        get: function () {
          if (this._content !== undefined) {
            return this._content;
          }

          if (this.responseType === "json") {
            return this._content = JSON.parse(this.response, this.reviver);
          }

          if (this.reviver) {
            return this._content = this.reviver(this.response);
          }

          return this._content = this.response;
        },
        enumerable: true,
        configurable: true
      }
    });

    return HttpResponseMessage;
  })();

  exports.HttpResponseMessage = HttpResponseMessage;
});
define('aurelia-http-client/http-request-message',["exports", "./headers", "./http-response-message"], function (exports, _headers, _httpResponseMessage) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var Headers = _headers.Headers;
  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var HttpRequestMessage = (function () {
    function HttpRequestMessage(method, uri, content, replacer) {
      this.method = method;
      this.uri = uri;
      this.content = content;
      this.headers = new Headers();
      this.responseType = "json";
      this.replacer = replacer;
    }

    _prototypeProperties(HttpRequestMessage, null, {
      withHeaders: {
        value: function withHeaders(headers) {
          this.headers = headers;
          return this;
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      configureXHR: {
        value: function configureXHR(xhr) {
          xhr.open(this.method, this.uri, true);
          xhr.responseType = this.responseType;
          this.headers.configureXHR(xhr);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      formatContent: {
        value: function formatContent() {
          var content = this.content;

          if (window.FormData && content instanceof FormData) {
            return content;
          }

          if (window.Blob && content instanceof Blob) {
            return content;
          }

          if (window.ArrayBufferView && content instanceof ArrayBufferView) {
            return content;
          }

          if (content instanceof Document) {
            return content;
          }

          if (typeof content === "string") {
            return content;
          }

          return JSON.stringify(content, this.replacer);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      send: {
        value: function send(client, progressCallback) {
          var _this = this;
          return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest(),
                responseType = _this.responseType;

            if (responseType === "json") {
              _this.responseType = "text";
            }

            if (client.timeout !== undefined) {
              xhr.timeout = client.timeout;
            }

            _this.configureXHR(xhr);

            xhr.onload = function (e) {
              resolve(new HttpResponseMessage(_this, xhr, responseType, client.reviver));
            };

            xhr.ontimeout = function (e) {
              reject(new Error(e));
            };

            xhr.onerror = function (e) {
              reject(new Error(e));
            };

            if (progressCallback) {
              xhr.upload.onprogress = progressCallback;
            }

            xhr.send(_this.formatContent());
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return HttpRequestMessage;
  })();

  exports.HttpRequestMessage = HttpRequestMessage;
});
define('aurelia-http-client/jsonp-request-message',["exports", "./http-response-message"], function (exports, _httpResponseMessage) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var JSONPRequestMessage = (function () {
    function JSONPRequestMessage(uri, callbackParameterName) {
      this.uri = uri;
      this.callbackParameterName = callbackParameterName;
    }

    _prototypeProperties(JSONPRequestMessage, null, {
      send: {
        value: function send(client) {
          var _this = this;
          return new Promise(function (resolve, reject) {
            var callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
            var uri = _this.uri + (_this.uri.indexOf("?") >= 0 ? "&" : "?") + _this.callbackParameterName + "=" + callbackName;

            window[callbackName] = function (data) {
              delete window[callbackName];
              document.body.removeChild(script);
              resolve(new HttpResponseMessage(_this, {
                response: data,
                status: 200,
                statusText: "OK"
              }, "jsonp"));
            };

            var script = document.createElement("script");
            script.src = uri;
            document.body.appendChild(script);
          });
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return JSONPRequestMessage;
  })();

  exports.JSONPRequestMessage = JSONPRequestMessage;
});
define('aurelia-http-client/http-client',["exports", "aurelia-path", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers"], function (exports, _aureliaPath, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) {
    if (staticProps) Object.defineProperties(child, staticProps);
    if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
  };

  var join = _aureliaPath.join;
  var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  var Headers = _headers.Headers;
  var HttpClient = (function () {
    function HttpClient() {
      var _this = this;
      var baseUrl = arguments[0] === undefined ? null : arguments[0];
      var defaultRequestHeaders = arguments[1] === undefined ? new Headers() : arguments[1];
      return (function () {
        _this.baseUrl = baseUrl;
        _this.defaultRequestHeaders = defaultRequestHeaders;
      })();
    }

    _prototypeProperties(HttpClient, null, {
      send: {
        value: function send(requestMessage, progressCallback) {
          return requestMessage.send(this, progressCallback);
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      get: {
        value: function get(uri) {
          return this.send(new HttpRequestMessage("GET", join(this.baseUrl, uri)).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      put: {
        value: function put(uri, content, replacer) {
          return this.send(new HttpRequestMessage("PUT", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      patch: {
        value: function patch(uri, content, replacer) {
          return this.send(new HttpRequestMessage("PATCH", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      post: {
        value: function post(uri, content, replacer) {
          return this.send(new HttpRequestMessage("POST", join(this.baseUrl, uri), content, replacer || this.replacer).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      "delete": {
        value: function _delete(uri) {
          return this.send(new HttpRequestMessage("DELETE", join(this.baseUrl, uri)).withHeaders(this.defaultRequestHeaders));
        },
        writable: true,
        enumerable: true,
        configurable: true
      },
      jsonp: {
        value: function jsonp(uri) {
          var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];
          return this.send(new JSONPRequestMessage(join(this.baseUrl, uri), callbackParameterName));
        },
        writable: true,
        enumerable: true,
        configurable: true
      }
    });

    return HttpClient;
  })();

  exports.HttpClient = HttpClient;
});
define('aurelia-http-client/index',["exports", "./http-client", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers"], function (exports, _httpClient, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers) {
  

  exports.HttpClient = _httpClient.HttpClient;
  exports.HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  exports.HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  exports.JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  exports.Headers = _headers.Headers;
});
define('aurelia-http-client', ['aurelia-http-client/index'], function (main) { return main; });

require([
  'aurelia-bootstrapper',
  'aurelia-loader',
  'aurelia-loader-default',
  'aurelia-path',
  'aurelia-task-queue',
  'aurelia-logging',
  'aurelia-logging-console',
  'aurelia-history',
  'aurelia-history-browser',
  'aurelia-event-aggregator',
  'aurelia-framework',
  'aurelia-metadata',
  'aurelia-binding',
  'aurelia-templating',
  'aurelia-dependency-injection',
  'aurelia-router',
  'aurelia-templating-binding',
  'aurelia-templating-resources',
  'aurelia-templating-router',
  'aurelia-route-recognizer',
  'aurelia-http-client'
  ]);
define("aurelia-bundle-manifest", function(){});

