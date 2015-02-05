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

/**
 * Core.js 0.4.10
 * https://github.com/zloirock/core-js
 * License: http://rock.mit-license.org
 * © 2015 Denis Pushkarev
 */
!function(global, framework, undefined){


/******************************************************************************
 * Module : common                                                            *
 ******************************************************************************/

  // Shortcuts for [[Class]] & property names
var OBJECT          = 'Object'
  , FUNCTION        = 'Function'
  , ARRAY           = 'Array'
  , STRING          = 'String'
  , NUMBER          = 'Number'
  , REGEXP          = 'RegExp'
  , DATE            = 'Date'
  , MAP             = 'Map'
  , SET             = 'Set'
  , WEAKMAP         = 'WeakMap'
  , WEAKSET         = 'WeakSet'
  , SYMBOL          = 'Symbol'
  , PROMISE         = 'Promise'
  , MATH            = 'Math'
  , ARGUMENTS       = 'Arguments'
  , PROTOTYPE       = 'prototype'
  , CONSTRUCTOR     = 'constructor'
  , TO_STRING       = 'toString'
  , TO_STRING_TAG   = TO_STRING + 'Tag'
  , TO_LOCALE       = 'toLocaleString'
  , HAS_OWN         = 'hasOwnProperty'
  , FOR_EACH        = 'forEach'
  , ITERATOR        = 'iterator'
  , FF_ITERATOR     = '@@' + ITERATOR
  , PROCESS         = 'process'
  , CREATE_ELEMENT  = 'createElement'
  // Aliases global objects and prototypes
  , Function        = global[FUNCTION]
  , Object          = global[OBJECT]
  , Array           = global[ARRAY]
  , String          = global[STRING]
  , Number          = global[NUMBER]
  , RegExp          = global[REGEXP]
  , Date            = global[DATE]
  , Map             = global[MAP]
  , Set             = global[SET]
  , WeakMap         = global[WEAKMAP]
  , WeakSet         = global[WEAKSET]
  , Symbol          = global[SYMBOL]
  , Math            = global[MATH]
  , TypeError       = global.TypeError
  , setTimeout      = global.setTimeout
  , setImmediate    = global.setImmediate
  , clearImmediate  = global.clearImmediate
  , isFinite        = global.isFinite
  , process         = global[PROCESS]
  , nextTick        = process && process.nextTick
  , document        = global.document
  , html            = document && document.documentElement
  , navigator       = global.navigator
  , define          = global.define
  , ArrayProto      = Array[PROTOTYPE]
  , ObjectProto     = Object[PROTOTYPE]
  , FunctionProto   = Function[PROTOTYPE]
  , Infinity        = 1 / 0
  , DOT             = '.';

// http://jsperf.com/core-js-isobject
function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
// Native function?
var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);

// Object internal [[Class]] or toStringTag
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring
var toString = ObjectProto[TO_STRING];
function setToStringTag(it, tag, stat){
  if(it && !has(it = stat ? it : it[PROTOTYPE], SYMBOL_TAG))hidden(it, SYMBOL_TAG, tag);
}
function cof(it){
  return it == undefined ? it === undefined
    ? 'Undefined' : 'Null' : toString.call(it).slice(8, -1);
}
function classof(it){
  var klass = cof(it), tag;
  return klass == OBJECT && (tag = it[SYMBOL_TAG]) ? tag : klass;
}

// Function
var call  = FunctionProto.call
  , apply = FunctionProto.apply
  , REFERENCE_GET;
// Partial apply
function part(/* ...args */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , args   = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((args[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , i = 0, j = 0, _args;
    if(!holder && !_length)return invoke(fn, args, that);
    _args = args.slice();
    if(holder)for(;length > i; i++)if(_args[i] === _)_args[i] = arguments[j++];
    while(_length > j)_args.push(arguments[j++]);
    return invoke(fn, _args, that);
  }
}
// Optional / simple context binding
function ctx(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    }
    case 2: return function(a, b){
      return fn.call(that, a, b);
    }
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    }
  } return function(/* ...args */){
      return fn.apply(that, arguments);
  }
}
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
function invoke(fn, args, that){
  var un = that === undefined;
  switch(args.length | 0){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
}
function construct(target, argumentsList /*, newTarget*/){
  var proto    = assertFunction(arguments.length < 3 ? target : arguments[2])[PROTOTYPE]
    , instance = create(isObject(proto) ? proto : ObjectProto)
    , result   = apply.call(target, instance, argumentsList);
  return isObject(result) ? result : instance;
}

// Object:
var create           = Object.create
  , getPrototypeOf   = Object.getPrototypeOf
  , setPrototypeOf   = Object.setPrototypeOf
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , getOwnDescriptor = Object.getOwnPropertyDescriptor
  , getKeys          = Object.keys
  , getNames         = Object.getOwnPropertyNames
  , getSymbols       = Object.getOwnPropertySymbols
  , isFrozen         = Object.isFrozen
  , has              = ctx(call, ObjectProto[HAS_OWN], 2)
  // Dummy, fix for not array-like ES3 string in es5 module
  , ES5Object        = Object
  , Dict;
function toObject(it){
  return ES5Object(assertDefined(it));
}
function returnIt(it){
  return it;
}
function returnThis(){
  return this;
}
function get(object, key){
  if(has(object, key))return object[key];
}
function ownKeys(it){
  assertObject(it);
  return getSymbols ? getNames(it).concat(getSymbols(it)) : getNames(it);
}
// 19.1.2.1 Object.assign(target, source, ...)
var assign = Object.assign || function(target, source){
  var T = Object(assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = ES5Object(arguments[i++])
      , keys   = getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
}
function keyOf(object, el){
  var O      = toObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
}

// Array
// array('str1,str2,str3') => ['str1', 'str2', 'str3']
function array(it){
  return String(it).split(',');
}
var push    = ArrayProto.push
  , unshift = ArrayProto.unshift
  , slice   = ArrayProto.slice
  , splice  = ArrayProto.splice
  , indexOf = ArrayProto.indexOf
  , forEach = ArrayProto[FOR_EACH];
/*
 * 0 -> forEach
 * 1 -> map
 * 2 -> filter
 * 3 -> some
 * 4 -> every
 * 5 -> find
 * 6 -> findIndex
 */
function createArrayMethod(type){
  var isMap       = type == 1
    , isFilter    = type == 2
    , isSome      = type == 3
    , isEvery     = type == 4
    , isFindIndex = type == 6
    , noholes     = type == 5 || isFindIndex;
  return function(callbackfn/*, that = undefined */){
    var O      = Object(assertDefined(this))
      , that   = arguments[1]
      , self   = ES5Object(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = isMap ? Array(length) : isFilter ? [] : undefined
      , val, res;
    for(;length > index; index++)if(noholes || index in self){
      val = self[index];
      res = f(val, index, O);
      if(type){
        if(isMap)result[index] = res;             // map
        else if(res)switch(type){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(isEvery)return false;           // every
      }
    }
    return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
  }
}
function createArrayContains(isContains){
  return function(el /*, fromIndex = 0 */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = toIndex(arguments[1], length);
    if(isContains && el != el){
      for(;length > index; index++)if(sameNaN(O[index]))return isContains || index;
    } else for(;length > index; index++)if(isContains || index in O){
      if(O[index] === el)return isContains || index;
    } return !isContains && -1;
  }
}
function generic(A, B){
  // strange IE quirks mode bug -> use typeof vs isFunction
  return typeof A == 'function' ? A : B;
}

// Math
var MAX_SAFE_INTEGER = 0x1fffffffffffff // pow(2, 53) - 1 == 9007199254740991
  , pow    = Math.pow
  , abs    = Math.abs
  , ceil   = Math.ceil
  , floor  = Math.floor
  , max    = Math.max
  , min    = Math.min
  , random = Math.random
  , trunc  = Math.trunc || function(it){
      return (it > 0 ? floor : ceil)(it);
    }
// 20.1.2.4 Number.isNaN(number)
function sameNaN(number){
  return number != number;
}
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it) ? 0 : trunc(it);
}
// 7.1.15 ToLength
function toLength(it){
  return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
}
function toIndex(index, length){
  var index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
}

function createReplacer(regExp, replace, isStatic){
  var replacer = isObject(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  }
}
function createPointAt(toString){
  return function(pos){
    var s = String(assertDefined(this))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return toString ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? toString ? s.charAt(i) : a
      : toString ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  }
}

// Assertion & errors
var REDUCE_ERROR = 'Reduce of empty object with no initial value';
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
function assertDefined(it){
  if(it == undefined)throw TypeError('Function called on null or undefined');
  return it;
}
function assertFunction(it){
  assert(isFunction(it), it, ' is not a function!');
  return it;
}
function assertObject(it){
  assert(isObject(it), it, ' is not an object!');
  return it;
}
function assertInstance(it, Constructor, name){
  assert(it instanceof Constructor, name, ": use the 'new' operator!");
}

// Property descriptors & Symbol
function descriptor(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  }
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return defineProperty(object, key, descriptor(bitmap, value));
  } : simpleSet;
}
function uid(key){
  return SYMBOL + '(' + key + ')_' + (++sid + random())[TO_STRING](36);
}
function getWellKnownSymbol(name, setter){
  return (Symbol && Symbol[name]) || (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name);
}
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC   = !!function(){try{return defineProperty({}, DOT, ObjectProto)}catch(e){}}()
  , sid    = 0
  , hidden = createDefiner(1)
  , set    = Symbol ? simpleSet : hidden
  , safeSymbol = Symbol || uid;
function assignHidden(target, src){
  for(var key in src)hidden(target, key, src[key]);
  return target;
}

var SYMBOL_UNSCOPABLES = getWellKnownSymbol('unscopables')
  , ArrayUnscopables   = ArrayProto[SYMBOL_UNSCOPABLES] || {}
  , SYMBOL_SPECIES     = getWellKnownSymbol('species');
function setSpecies(C){
  if(framework || !isNative(C))defineProperty(C, SYMBOL_SPECIES, {
    configurable: true,
    get: returnThis
  });
}

// Iterators
var SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR)
  , SYMBOL_TAG      = getWellKnownSymbol(TO_STRING_TAG)
  , SUPPORT_FF_ITER = FF_ITERATOR in ArrayProto
  , ITER  = safeSymbol('iter')
  , KEY   = 1
  , VALUE = 2
  , Iterators = {}
  , IteratorPrototype = {}
  , NATIVE_ITERATORS = SYMBOL_ITERATOR in ArrayProto
    // Safari define byggy iterators w/o `next`
  , BUGGY_ITERATORS = 'keys' in ArrayProto && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, returnThis);
function setIterator(O, value){
  hidden(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  SUPPORT_FF_ITER && hidden(O, FF_ITERATOR, value);
}
function createIterator(Constructor, NAME, next, proto){
  Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor[PROTOTYPE]
    , iter  = get(proto, SYMBOL_ITERATOR) || get(proto, FF_ITERATOR) || (DEFAULT && get(proto, DEFAULT)) || value;
  if(framework){
    // Define iterator
    setIterator(proto, iter);
    if(iter !== value){
      var iterProto = getPrototypeOf(iter.call(new Constructor));
      // Set @@toStringTag to native iterators
      setToStringTag(iterProto, NAME + ' Iterator', true);
      // FF fix
      has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
    }
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = returnThis;
  return iter;
}
function defineStdIterators(Base, NAME, Constructor, next, DEFAULT, IS_SET){
  function createIter(kind){
    return function(){
      return new Constructor(this, kind);
    }
  }
  createIterator(Constructor, NAME, next);
  var entries = createIter(KEY+VALUE)
    , values  = createIter(VALUE);
  if(DEFAULT == VALUE)values = defineIterator(Base, NAME, values, 'values');
  else entries = defineIterator(Base, NAME, entries, 'entries');
  if(DEFAULT){
    $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
      entries: entries,
      keys: IS_SET ? values : createIter(KEY),
      values: values
    });
  }
}
function iterResult(done, value){
  return {value: value, done: !!done};
}
function isIterable(it){
  var O      = Object(it)
    , Symbol = global[SYMBOL]
    , hasExt = (Symbol && Symbol[ITERATOR] || FF_ITERATOR) in O;
  return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
}
function getIterator(it){
  var Symbol  = global[SYMBOL]
    , ext     = it[Symbol && Symbol[ITERATOR] || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
  return assertObject(getIter.call(it));
}
function stepCall(fn, value, entries){
  return entries ? invoke(fn, value) : fn(value);
}
function forOf(iterable, entries, fn, that){
  var iterator = getIterator(iterable)
    , f        = ctx(fn, that, entries ? 2 : 1)
    , step;
  while(!(step = iterator.next()).done)if(stepCall(f, step.value, entries) === false)return;
}

// core
var NODE = cof(process) == PROCESS
  , core = {}
  , path = framework ? global : core
  , old  = global.core
  , exportGlobal
  // type bitmap
  , FORCED = 1
  , GLOBAL = 2
  , STATIC = 4
  , PROTO  = 8
  , BIND   = 16
  , WRAP   = 32;
function $define(type, name, source){
  var key, own, out, exp
    , isGlobal = type & GLOBAL
    , target   = isGlobal ? global : (type & STATIC)
        ? global[name] : (global[name] || ObjectProto)[PROTOTYPE]
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // there is a similar native
    own = !(type & FORCED) && target && key in target
      && (!isFunction(target[key]) || isNative(target[key]));
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & BIND && own)exp = ctx(out, global);
    // wrap global constructors for prevent change them in library
    else if(type & WRAP && !framework && target[key] == out){
      exp = function(param){
        return this instanceof out ? new out(param) : out(param);
      }
      exp[PROTOTYPE] = out[PROTOTYPE];
    } else exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
    // export
    if(exports[key] != out)hidden(exports, key, exp);
    // extend global
    if(framework && target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && hidden(target, key, out);
    }
  }
}
// CommonJS export
if(typeof module != 'undefined' && module.exports)module.exports = core;
// RequireJS export
else if(isFunction(define) && define.amd)define(function(){return core});
// Export to global object
else exportGlobal = true;
if(exportGlobal || framework){
  core.noConflict = function(){
    global.core = old;
    return core;
  }
  global.core = core;
}

/******************************************************************************
 * Module : es6.symbol                                                        *
 ******************************************************************************/

// ECMAScript 6 symbols shim
!function(TAG, SymbolRegistry, AllSymbols, setter){
  // 19.4.1.1 Symbol([description])
  if(!isNative(Symbol)){
    Symbol = function(description){
      assert(!(this instanceof Symbol), SYMBOL + ' is not a ' + CONSTRUCTOR);
      var tag = uid(description)
        , sym = set(create(Symbol[PROTOTYPE]), TAG, tag);
      AllSymbols[tag] = sym;
      DESC && setter && defineProperty(ObjectProto, tag, {
        configurable: true,
        set: function(value){
          hidden(this, tag, value);
        }
      });
      return sym;
    }
    hidden(Symbol[PROTOTYPE], TO_STRING, function(){
      return this[TAG];
    });
  }
  $define(GLOBAL + WRAP, {Symbol: Symbol});
  
  var symbolStatics = {
    // 19.4.2.1 Symbol.for(key)
    'for': function(key){
      return has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = Symbol(key);
    },
    // 19.4.2.4 Symbol.iterator
    iterator: SYMBOL_ITERATOR,
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: part.call(keyOf, SymbolRegistry),
    // 19.4.2.10 Symbol.species
    species: SYMBOL_SPECIES,
    // 19.4.2.13 Symbol.toStringTag
    toStringTag: SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG, true),
    // 19.4.2.14 Symbol.unscopables
    unscopables: SYMBOL_UNSCOPABLES,
    pure: safeSymbol,
    set: set,
    useSetter: function(){setter = true},
    useSimple: function(){setter = false}
  };
  // 19.4.2.2 Symbol.hasInstance
  // 19.4.2.3 Symbol.isConcatSpreadable
  // 19.4.2.6 Symbol.match
  // 19.4.2.8 Symbol.replace
  // 19.4.2.9 Symbol.search
  // 19.4.2.11 Symbol.split
  // 19.4.2.12 Symbol.toPrimitive
  forEach.call(array('hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive'),
    function(it){
      symbolStatics[it] = getWellKnownSymbol(it);
    }
  );
  $define(STATIC, SYMBOL, symbolStatics);
  
  setToStringTag(Symbol, SYMBOL);
  
  $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
      return result;
    },
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: function(it){
      var names = getNames(toObject(it)), result = [], key, i = 0;
      while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
      return result;
    }
  });
}(safeSymbol('tag'), {}, {}, true);

/******************************************************************************
 * Module : es6.object                                                        *
 ******************************************************************************/

!function(tmp){
  var objectStatic = {
    // 19.1.3.1 Object.assign(target, source)
    assign: assign,
    // 19.1.3.10 Object.is(value1, value2)
    is: function(x, y){
      return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
    }
  };
  // 19.1.3.19 Object.setPrototypeOf(O, proto)
  // Works with __proto__ only. Old v8 can't works with null proto objects.
  '__proto__' in ObjectProto && function(buggy, set){
    try {
      set = ctx(call, getOwnDescriptor(ObjectProto, '__proto__').set, 2);
      set({}, ArrayProto);
    } catch(e){ buggy = true }
    objectStatic.setPrototypeOf = setPrototypeOf = setPrototypeOf || function(O, proto){
      assertObject(O);
      assert(proto === null || isObject(proto), proto, ": can't set as prototype!");
      if(buggy)O.__proto__ = proto;
      else set(O, proto);
      return O;
    }
  }();
  $define(STATIC, OBJECT, objectStatic);
  
  if(framework){
    // 19.1.3.6 Object.prototype.toString()
    tmp[SYMBOL_TAG] = DOT;
    if(cof(tmp) != DOT)hidden(ObjectProto, TO_STRING, function(){
      return '[object ' + classof(this) + ']';
    });
  }
  
  // 20.2.1.9 Math[@@toStringTag]
  setToStringTag(Math, MATH, true);
  // 24.3.3 JSON[@@toStringTag]
  setToStringTag(global.JSON, 'JSON', true);
}({});

/******************************************************************************
 * Module : es6.object.statics-accept-primitives                              *
 ******************************************************************************/

!function(){
  // Object static methods accept primitives
  function wrapObjectMethod(key, MODE){
    var fn  = Object[key]
      , exp = core[OBJECT][key]
      , f   = 0
      , o   = {};
    if(!exp || isNative(exp)){
      o[key] = MODE == 1 ? function(it){
        return isObject(it) ? fn(it) : it;
      } : MODE == 2 ? function(it){
        return isObject(it) ? fn(it) : true;
      } : MODE == 3 ? function(it){
        return isObject(it) ? fn(it) : false;
      } : MODE == 4 ? function(it, key){
        return fn(toObject(it), key);
      } : function(it){
        return fn(toObject(it));
      };
      try { fn(DOT) }
      catch(e){ f = 1 }
      $define(STATIC + FORCED * f, OBJECT, o);
    }
  }
  wrapObjectMethod('freeze', 1);
  wrapObjectMethod('seal', 1);
  wrapObjectMethod('preventExtensions', 1);
  wrapObjectMethod('isFrozen', 2);
  wrapObjectMethod('isSealed', 2);
  wrapObjectMethod('isExtensible', 3);
  wrapObjectMethod('getOwnPropertyDescriptor', 4);
  wrapObjectMethod('getPrototypeOf');
  wrapObjectMethod('keys');
  wrapObjectMethod('getOwnPropertyNames');
}();

/******************************************************************************
 * Module : es6.function                                                      *
 ******************************************************************************/

!function(NAME){
  // 19.2.4.2 name
  NAME in FunctionProto || defineProperty(FunctionProto, NAME, {
    configurable: true,
    get: function(){
      var match = String(this).match(/^\s*function ([^ (]*)/)
        , name  = match ? match[1] : '';
      has(this, NAME) || defineProperty(this, NAME, descriptor(5, name));
      return name;
    },
    set: function(value){
      has(this, NAME) || defineProperty(this, NAME, descriptor(0, value));
    }
  });
}('name');

/******************************************************************************
 * Module : es6.number                                                        *
 ******************************************************************************/

!function(isInteger){
  $define(STATIC, NUMBER, {
    // 20.1.2.1 Number.EPSILON
    EPSILON: pow(2, -52),
    // 20.1.2.2 Number.isFinite(number)
    isFinite: function(it){
      return typeof it == 'number' && isFinite(it);
    },
    // 20.1.2.3 Number.isInteger(number)
    isInteger: isInteger,
    // 20.1.2.4 Number.isNaN(number)
    isNaN: sameNaN,
    // 20.1.2.5 Number.isSafeInteger(number)
    isSafeInteger: function(number){
      return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
    },
    // 20.1.2.6 Number.MAX_SAFE_INTEGER
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
    // 20.1.2.10 Number.MIN_SAFE_INTEGER
    MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
    // 20.1.2.12 Number.parseFloat(string)
    parseFloat: parseFloat,
    // 20.1.2.13 Number.parseInt(string, radix)
    parseInt: parseInt
  });
// 20.1.2.3 Number.isInteger(number)
}(Number.isInteger || function(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
});

/******************************************************************************
 * Module : es6.math                                                          *
 ******************************************************************************/

// ECMAScript 6 shim
!function(){
  // 20.2.2.28 Math.sign(x)
  var E    = Math.E
    , exp  = Math.exp
    , log  = Math.log
    , sqrt = Math.sqrt
    , sign = Math.sign || function(x){
        return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
      };
  
  // 20.2.2.5 Math.asinh(x)
  function asinh(x){
    return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
  }
  // 20.2.2.14 Math.expm1(x)
  function expm1(x){
    return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
  }
    
  $define(STATIC, MATH, {
    // 20.2.2.3 Math.acosh(x)
    acosh: function(x){
      return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
    },
    // 20.2.2.5 Math.asinh(x)
    asinh: asinh,
    // 20.2.2.7 Math.atanh(x)
    atanh: function(x){
      return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
    },
    // 20.2.2.9 Math.cbrt(x)
    cbrt: function(x){
      return sign(x = +x) * pow(abs(x), 1 / 3);
    },
    // 20.2.2.11 Math.clz32(x)
    clz32: function(x){
      return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
    },
    // 20.2.2.12 Math.cosh(x)
    cosh: function(x){
      return (exp(x = +x) + exp(-x)) / 2;
    },
    // 20.2.2.14 Math.expm1(x)
    expm1: expm1,
    // 20.2.2.16 Math.fround(x)
    // TODO: fallback for IE9-
    fround: function(x){
      return new Float32Array([x])[0];
    },
    // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
    hypot: function(value1, value2){
      var sum  = 0
        , len1 = arguments.length
        , len2 = len1
        , args = Array(len1)
        , larg = -Infinity
        , arg;
      while(len1--){
        arg = args[len1] = +arguments[len1];
        if(arg == Infinity || arg == -Infinity)return Infinity;
        if(arg > larg)larg = arg;
      }
      larg = arg || 1;
      while(len2--)sum += pow(args[len2] / larg, 2);
      return larg * sqrt(sum);
    },
    // 20.2.2.18 Math.imul(x, y)
    imul: function(x, y){
      var UInt16 = 0xffff
        , xn = +x
        , yn = +y
        , xl = UInt16 & xn
        , yl = UInt16 & yn;
      return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
    },
    // 20.2.2.20 Math.log1p(x)
    log1p: function(x){
      return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
    },
    // 20.2.2.21 Math.log10(x)
    log10: function(x){
      return log(x) / Math.LN10;
    },
    // 20.2.2.22 Math.log2(x)
    log2: function(x){
      return log(x) / Math.LN2;
    },
    // 20.2.2.28 Math.sign(x)
    sign: sign,
    // 20.2.2.30 Math.sinh(x)
    sinh: function(x){
      return (abs(x = +x) < 1) ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
    },
    // 20.2.2.33 Math.tanh(x)
    tanh: function(x){
      var a = expm1(x = +x)
        , b = expm1(-x);
      return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
    },
    // 20.2.2.34 Math.trunc(x)
    trunc: trunc
  });
}();

/******************************************************************************
 * Module : es6.string                                                        *
 ******************************************************************************/

!function(RangeError, fromCharCode){
  function assertNotRegExp(it){
    if(cof(it) == REGEXP)throw TypeError();
  }
  
  $define(STATIC, STRING, {
    // 21.1.2.2 String.fromCodePoint(...codePoints)
    fromCodePoint: function(x){
      var res = []
        , len = arguments.length
        , i   = 0
        , code
      while(len > i){
        code = +arguments[i++];
        if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
        res.push(code < 0x10000
          ? fromCharCode(code)
          : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
        );
      } return res.join('');
    },
    // 21.1.2.4 String.raw(callSite, ...substitutions)
    raw: function(callSite){
      var raw = toObject(callSite.raw)
        , len = toLength(raw.length)
        , sln = arguments.length
        , res = []
        , i   = 0;
      while(len > i){
        res.push(String(raw[i++]));
        if(i < sln)res.push(String(arguments[i]));
      } return res.join('');
    }
  });
  
  $define(PROTO, STRING, {
    // 21.1.3.3 String.prototype.codePointAt(pos)
    codePointAt: createPointAt(false),
    // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
    endsWith: function(searchString /*, endPosition = @length */){
      assertNotRegExp(searchString);
      var that = String(assertDefined(this))
        , endPosition = arguments[1]
        , len = toLength(that.length)
        , end = endPosition === undefined ? len : min(toLength(endPosition), len);
      searchString += '';
      return that.slice(end - searchString.length, end) === searchString;
    },
    // 21.1.3.7 String.prototype.includes(searchString, position = 0)
    includes: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      return !!~String(assertDefined(this)).indexOf(searchString, arguments[1]);
    },
    // 21.1.3.13 String.prototype.repeat(count)
    repeat: function(count){
      var str = String(assertDefined(this))
        , res = ''
        , n   = toInteger(count);
      if(0 > n || n == Infinity)throw RangeError("Count can't be negative");
      for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
      return res;
    },
    // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
    startsWith: function(searchString /*, position = 0 */){
      assertNotRegExp(searchString);
      var that  = String(assertDefined(this))
        , index = toLength(min(arguments[1], that.length));
      searchString += '';
      return that.slice(index, index + searchString.length) === searchString;
    }
  });
}(global.RangeError, String.fromCharCode);

/******************************************************************************
 * Module : es6.array                                                         *
 ******************************************************************************/

!function(){
  $define(STATIC, ARRAY, {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
      var O       = Object(assertDefined(arrayLike))
        , result  = new (generic(this, Array))
        , mapfn   = arguments[1]
        , that    = arguments[2]
        , mapping = mapfn !== undefined
        , f       = mapping ? ctx(mapfn, that, 2) : undefined
        , index   = 0
        , length;
      if(isIterable(O))for(var iter = getIterator(O), step; !(step = iter.next()).done; index++){
        result[index] = mapping ? f(step.value, index) : step.value;
      } else for(length = toLength(O.length); length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
      result.length = index;
      return result;
    },
    // 22.1.2.3 Array.of( ...items)
    of: function(/* ...args */){
      var index  = 0
        , length = arguments.length
        , result = new (generic(this, Array))(length);
      while(length > index)result[index] = arguments[index++];
      result.length = length;
      return result;
    }
  });
  
  $define(PROTO, ARRAY, {
    // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
    copyWithin: function(target /* = 0 */, start /* = 0, end = @length */){
      var O     = Object(assertDefined(this))
        , len   = toLength(O.length)
        , to    = toIndex(target, len)
        , from  = toIndex(start, len)
        , end   = arguments[2]
        , fin   = end === undefined ? len : toIndex(end, len)
        , count = min(fin - from, len - to)
        , inc   = 1;
      if(from < to && to < from + count){
        inc  = -1;
        from = from + count - 1;
        to   = to + count - 1;
      }
      while(count-- > 0){
        if(from in O)O[to] = O[from];
        else delete O[to];
        to += inc;
        from += inc;
      } return O;
    },
    // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
    fill: function(value /*, start = 0, end = @length */){
      var O      = Object(assertDefined(this))
        , length = toLength(O.length)
        , index  = toIndex(arguments[1], length)
        , end    = arguments[2]
        , endPos = end === undefined ? length : toIndex(end, length);
      while(endPos > index)O[index++] = value;
      return O;
    },
    // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
    find: createArrayMethod(5),
    // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
    findIndex: createArrayMethod(6)
  });
  
  if(framework){
    // 22.1.3.31 Array.prototype[@@unscopables]
    forEach.call(array('find,findIndex,fill,copyWithin,entries,keys,values'), function(it){
      ArrayUnscopables[it] = true;
    });
    SYMBOL_UNSCOPABLES in ArrayProto || hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
  }  
  
  setSpecies(Array);
}();

/******************************************************************************
 * Module : es6.iterators                                                     *
 ******************************************************************************/

!function(at){
  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  defineStdIterators(Array, ARRAY, function(iterated, kind){
    set(this, ITER, {o: toObject(iterated), i: 0, k: kind});
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , kind  = iter.k
      , index = iter.i++;
    if(!O || index >= O.length)return iter.o = undefined, iterResult(1);
    if(kind == KEY)  return iterResult(0, index);
    if(kind == VALUE)return iterResult(0, O[index]);
                     return iterResult(0, [index, O[index]]);
  }, VALUE);
  
  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators[ARGUMENTS] = Iterators[ARRAY];
  
  // 21.1.3.27 String.prototype[@@iterator]()
  defineStdIterators(String, STRING, function(iterated){
    set(this, ITER, {o: String(iterated), i: 0});
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , index = iter.i
      , point;
    if(index >= O.length)return iterResult(1);
    point = at.call(O, index);
    iter.i += point.length;
    return iterResult(0, point);
  });
}(createPointAt(true));

/******************************************************************************
 * Module : es6.regexp                                                        *
 ******************************************************************************/

!function(RegExpProto, _RegExp){
  function assertRegExpWrapper(fn){
    return function(){
      assert(cof(this) === REGEXP);
      return fn(this);
    }
  }
  
  // RegExp allows a regex with flags as the pattern
  if(DESC && !function(){try{return RegExp(/a/g, 'i') == '/a/i'}catch(e){}}()){
    RegExp = function RegExp(pattern, flags){
      return new _RegExp(cof(pattern) == REGEXP && flags !== undefined
        ? pattern.source : pattern, flags);
    }
    forEach.call(getNames(_RegExp), function(key){
      key in RegExp || defineProperty(RegExp, key, {
        configurable: true,
        get: function(){ return _RegExp[key] },
        set: function(it){ _RegExp[key] = it }
      });
    });
    RegExpProto[CONSTRUCTOR] = RegExp;
    RegExp[PROTOTYPE] = RegExpProto;
    hidden(global, REGEXP, RegExp);
  }
  
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')defineProperty(RegExpProto, 'flags', {
    configurable: true,
    get: assertRegExpWrapper(createReplacer(/^.*\/(\w*)$/, '$1', true))
  });
  
  // 21.2.5.12 get RegExp.prototype.sticky()
  // 21.2.5.15 get RegExp.prototype.unicode()
  forEach.call(array('sticky,unicode'), function(key){
    key in /./ || defineProperty(RegExpProto, key, DESC ? {
      configurable: true,
      get: assertRegExpWrapper(function(){
        return false;
      })
    } : descriptor(5, false));
  });
  
  setSpecies(RegExp);
}(RegExp[PROTOTYPE], RegExp);

/******************************************************************************
 * Module : web.immediate                                                     *
 ******************************************************************************/

// setImmediate shim
// Node.js 0.9+ & IE10+ has setImmediate, else:
isFunction(setImmediate) && isFunction(clearImmediate) || function(ONREADYSTATECHANGE){
  var postMessage      = global.postMessage
    , addEventListener = global.addEventListener
    , MessageChannel   = global.MessageChannel
    , counter          = 0
    , queue            = {}
    , defer, channel, port;
  setImmediate = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    }
    defer(counter);
    return counter;
  }
  clearImmediate = function(id){
    delete queue[id];
  }
  function run(id){
    if(has(queue, id)){
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  }
  function listner(event){
    run(event.data);
  }
  // Node.js 0.8-
  if(NODE){
    defer = function(id){
      nextTick(part.call(run, id));
    }
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
    defer = function(id){
      postMessage(id, '*');
    }
    addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if(document && ONREADYSTATECHANGE in document[CREATE_ELEMENT]('script')){
    defer = function(id){
      html.appendChild(document[CREATE_ELEMENT]('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run(id);
      }
    }
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(run, 0, id);
    }
  }
}('onreadystatechange');
$define(GLOBAL + BIND, {
  setImmediate:   setImmediate,
  clearImmediate: clearImmediate
});

/******************************************************************************
 * Module : es6.promise                                                       *
 ******************************************************************************/

// ES6 promises shim
// Based on https://github.com/getify/native-promise-only/
!function(Promise, test){
  isFunction(Promise) && isFunction(Promise.resolve)
  && Promise.resolve(test = new Promise(function(){})) == test
  || function(asap, DEF){
    function isThenable(o){
      var then;
      if(isObject(o))then = o.then;
      return isFunction(then) ? then : false;
    }
    function notify(def){
      var chain = def.chain;
      chain.length && asap(function(){
        var msg = def.msg
          , ok  = def.state == 1
          , i   = 0;
        while(chain.length > i)!function(react){
          var cb = ok ? react.ok : react.fail
            , ret, then;
          try {
            if(cb){
              ret = cb === true ? msg : cb(msg);
              if(ret === react.P){
                react.rej(TypeError(PROMISE + '-chain cycle'));
              } else if(then = isThenable(ret)){
                then.call(ret, react.res, react.rej);
              } else react.res(ret);
            } else react.rej(msg);
          } catch(err){
            react.rej(err);
          }
        }(chain[i++]);
        chain.length = 0;
      });
    }
    function resolve(msg){
      var def = this
        , then, wrapper;
      if(def.done)return;
      def.done = true;
      def = def.def || def; // unwrap
      try {
        if(then = isThenable(msg)){
          wrapper = {def: def, done: false}; // wrap
          then.call(msg, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
        } else {
          def.msg = msg;
          def.state = 1;
          notify(def);
        }
      } catch(err){
        reject.call(wrapper || {def: def, done: false}, err); // wrap
      }
    }
    function reject(msg){
      var def = this;
      if(def.done)return;
      def.done = true;
      def = def.def || def; // unwrap
      def.msg = msg;
      def.state = 2;
      notify(def);
    }
    function getConstructor(C){
      var S = assertObject(C)[SYMBOL_SPECIES];
      return S != undefined ? S : C;
    }
    // 25.4.3.1 Promise(executor)
    Promise = function(executor){
      assertFunction(executor);
      assertInstance(this, Promise, PROMISE);
      var def = {chain: [], state: 0, done: false, msg: undefined};
      hidden(this, DEF, def);
      try {
        executor(ctx(resolve, def, 1), ctx(reject, def, 1));
      } catch(err){
        reject.call(def, err);
      }
    }
    assignHidden(Promise[PROTOTYPE], {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function(onFulfilled, onRejected){
        var S = assertObject(assertObject(this)[CONSTRUCTOR])[SYMBOL_SPECIES];
        var react = {
          ok:   isFunction(onFulfilled) ? onFulfilled : true,
          fail: isFunction(onRejected)  ? onRejected  : false
        } , P = react.P = new (S != undefined ? S : Promise)(function(resolve, reject){
          react.res = assertFunction(resolve);
          react.rej = assertFunction(reject);
        }), def = this[DEF];
        def.chain.push(react);
        def.state && notify(def);
        return P;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function(onRejected){
        return this.then(undefined, onRejected);
      }
    });
    assignHidden(Promise, {
      // 25.4.4.1 Promise.all(iterable)
      all: function(iterable){
        var Promise = getConstructor(this)
          , values  = [];
        return new Promise(function(resolve, reject){
          forOf(iterable, false, push, values);
          var remaining = values.length
            , results   = Array(remaining);
          if(remaining)forEach.call(values, function(promise, index){
            Promise.resolve(promise).then(function(value){
              results[index] = value;
              --remaining || resolve(results);
            }, reject);
          });
          else resolve(results);
        });
      },
      // 25.4.4.4 Promise.race(iterable)
      race: function(iterable){
        var Promise = getConstructor(this);
        return new Promise(function(resolve, reject){
          forOf(iterable, false, function(promise){
            Promise.resolve(promise).then(resolve, reject);
          });
        });
      },
      // 25.4.4.5 Promise.reject(r)
      reject: function(r){
        return new (getConstructor(this))(function(resolve, reject){
          reject(r);
        });
      },
      // 25.4.4.6 Promise.resolve(x)
      resolve: function(x){
        return isObject(x) && DEF in x && getPrototypeOf(x) === this[PROTOTYPE]
          ? x : new (getConstructor(this))(function(resolve, reject){
            resolve(x);
          });
      }
    });
  }(nextTick || setImmediate, safeSymbol('def'));
  setToStringTag(Promise, PROMISE);
  setSpecies(Promise);
  $define(GLOBAL + FORCED * !isNative(Promise), {Promise: Promise});
}(global[PROMISE]);

/******************************************************************************
 * Module : es6.collections                                                   *
 ******************************************************************************/

// ECMAScript 6 collections shim
!function(){
  var UID   = safeSymbol('uid')
    , O1    = safeSymbol('O1')
    , WEAK  = safeSymbol('weak')
    , LEAK  = safeSymbol('leak')
    , LAST  = safeSymbol('last')
    , FIRST = safeSymbol('first')
    , SIZE  = DESC ? safeSymbol('size') : 'size'
    , uid   = 0
    , tmp   = {};
  
  function getCollection(C, NAME, methods, commonMethods, isMap, isWeak){
    var ADDER = isMap ? 'set' : 'add'
      , proto = C && C[PROTOTYPE]
      , O     = {};
    function initFromIterable(that, iterable){
      if(iterable != undefined)forOf(iterable, isMap, that[ADDER], that);
      return that;
    }
    function fixSVZ(key, chain){
      var method = proto[key];
      if(framework)proto[key] = function(a, b){
        var result = method.call(this, a === 0 ? 0 : a, b);
        return chain ? this : result;
      };
    }
    if(!isNative(C) || !(isWeak || (!BUGGY_ITERATORS && has(proto, FOR_EACH) && has(proto, 'entries')))){
      // create collection constructor
      C = isWeak
        ? function(iterable){
            assertInstance(this, C, NAME);
            set(this, UID, uid++);
            initFromIterable(this, iterable);
          }
        : function(iterable){
            var that = this;
            assertInstance(that, C, NAME);
            set(that, O1, create(null));
            set(that, SIZE, 0);
            set(that, LAST, undefined);
            set(that, FIRST, undefined);
            initFromIterable(that, iterable);
          };
      assignHidden(assignHidden(C[PROTOTYPE], methods), commonMethods);
      isWeak || defineProperty(C[PROTOTYPE], 'size', {get: function(){
        return assertDefined(this[SIZE]);
      }});
    } else {
      var Native = C
        , inst   = new C
        , chain  = inst[ADDER](isWeak ? {} : -0, 1)
        , buggyZero;
      // wrap to init collections from iterable
      if(!NATIVE_ITERATORS || !C.length){
        C = function(iterable){
          assertInstance(this, C, NAME);
          return initFromIterable(new Native, iterable);
        }
        C[PROTOTYPE] = proto;
        if(framework)proto[CONSTRUCTOR] = C;
      }
      isWeak || inst[FOR_EACH](function(val, key){
        buggyZero = 1 / key === -Infinity;
      });
      // fix converting -0 key to +0
      if(buggyZero){
        fixSVZ('delete');
        fixSVZ('has');
        isMap && fixSVZ('get');
      }
      // + fix .add & .set for chaining
      if(buggyZero || chain !== inst)fixSVZ(ADDER, true);
    }
    setToStringTag(C, NAME);
    setSpecies(C);
    
    O[NAME] = C;
    $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
    
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    isWeak || defineStdIterators(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        return iter.o = undefined, iterResult(1);
      }
      // return step by kind
      if(kind == KEY)  return iterResult(0, entry.k);
      if(kind == VALUE)return iterResult(0, entry.v);
                       return iterResult(0, [entry.k, entry.v]);   
    }, isMap ? KEY+VALUE : VALUE, !isMap);
    
    return C;
  }
  
  function fastKey(it, create){
    // return primitive with prefix
    if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
    // can't set id to frozen object
    if(isFrozen(it))return 'F';
    if(!has(it, UID)){
      // not necessary to add id
      if(!create)return 'E';
      // add missing object id
      hidden(it, UID, ++uid);
    // return object id with prefix
    } return 'O' + it[UID];
  }
  function getEntry(that, key){
    // fast case
    var index = fastKey(key), entry;
    if(index != 'F')return that[O1][index];
    // frozen object case
    for(entry = that[FIRST]; entry; entry = entry.n){
      if(entry.k == key)return entry;
    }
  }
  function def(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry)entry.v = value;
    // create new entry
    else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index != 'F')that[O1][index] = entry;
    } return that;
  }

  var collectionMethods = {
    // 23.1.3.1 Map.prototype.clear()
    // 23.2.3.2 Set.prototype.clear()
    clear: function(){
      for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
        entry.r = true;
        entry.p = entry.n = undefined;
        delete data[entry.i];
      }
      that[FIRST] = that[LAST] = undefined;
      that[SIZE] = 0;
    },
    // 23.1.3.3 Map.prototype.delete(key)
    // 23.2.3.4 Set.prototype.delete(value)
    'delete': function(key){
      var that  = this
        , entry = getEntry(that, key);
      if(entry){
        var next = entry.n
          , prev = entry.p;
        delete that[O1][entry.i];
        entry.r = true;
        if(prev)prev.n = next;
        if(next)next.p = prev;
        if(that[FIRST] == entry)that[FIRST] = next;
        if(that[LAST] == entry)that[LAST] = prev;
        that[SIZE]--;
      } return !!entry;
    },
    // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
    // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
    forEach: function(callbackfn /*, that = undefined */){
      var f = ctx(callbackfn, arguments[1], 3)
        , entry;
      while(entry = entry ? entry.n : this[FIRST]){
        f(entry.v, entry.k, this);
        // revert to the last existing entry
        while(entry && entry.r)entry = entry.p;
      }
    },
    // 23.1.3.7 Map.prototype.has(key)
    // 23.2.3.7 Set.prototype.has(value)
    has: function(key){
      return !!getEntry(this, key);
    }
  }
  
  // 23.1 Map Objects
  Map = getCollection(Map, MAP, {
    // 23.1.3.6 Map.prototype.get(key)
    get: function(key){
      var entry = getEntry(this, key);
      return entry && entry.v;
    },
    // 23.1.3.9 Map.prototype.set(key, value)
    set: function(key, value){
      return def(this, key === 0 ? 0 : key, value);
    }
  }, collectionMethods, true);
  
  // 23.2 Set Objects
  Set = getCollection(Set, SET, {
    // 23.2.3.1 Set.prototype.add(value)
    add: function(value){
      return def(this, value = value === 0 ? 0 : value, value);
    }
  }, collectionMethods);
  
  function defWeak(that, key, value){
    if(isFrozen(assertObject(key)))leakStore(that).set(key, value);
    else {
      has(key, WEAK) || hidden(key, WEAK, {});
      key[WEAK][that[UID]] = value;
    } return that;
  }
  function leakStore(that){
    return that[LEAK] || hidden(that, LEAK, new Map)[LEAK];
  }
  
  var weakMethods = {
    // 23.3.3.2 WeakMap.prototype.delete(key)
    // 23.4.3.3 WeakSet.prototype.delete(value)
    'delete': function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this)['delete'](key);
      return has(key, WEAK) && has(key[WEAK], this[UID]) && delete key[WEAK][this[UID]];
    },
    // 23.3.3.4 WeakMap.prototype.has(key)
    // 23.4.3.4 WeakSet.prototype.has(value)
    has: function(key){
      if(!isObject(key))return false;
      if(isFrozen(key))return leakStore(this).has(key);
      return has(key, WEAK) && has(key[WEAK], this[UID]);
    }
  };
  
  // 23.3 WeakMap Objects
  WeakMap = getCollection(WeakMap, WEAKMAP, {
    // 23.3.3.3 WeakMap.prototype.get(key)
    get: function(key){
      if(isObject(key)){
        if(isFrozen(key))return leakStore(this).get(key);
        if(has(key, WEAK))return key[WEAK][this[UID]];
      }
    },
    // 23.3.3.5 WeakMap.prototype.set(key, value)
    set: function(key, value){
      return defWeak(this, key, value);
    }
  }, weakMethods, true, true);
  
  // IE11 WeakMap frozen keys fix
  if(framework && new WeakMap().set(Object.freeze(tmp), 7).get(tmp) != 7){
    forEach.call(array('delete,has,get,set'), function(key){
      var method = WeakMap[PROTOTYPE][key];
      WeakMap[PROTOTYPE][key] = function(a, b){
        // store frozen objects on leaky map
        if(isObject(a) && isFrozen(a)){
          var result = leakStore(this)[key](a, b);
          return key == 'set' ? this : result;
        // store all the rest on native weakmap
        } return method.call(this, a, b);
      };
    });
  }
  
  // 23.4 WeakSet Objects
  WeakSet = getCollection(WeakSet, WEAKSET, {
    // 23.4.3.1 WeakSet.prototype.add(value)
    add: function(value){
      return defWeak(this, value, true);
    }
  }, weakMethods, false, true);
}();

/******************************************************************************
 * Module : es6.reflect                                                       *
 ******************************************************************************/

!function(){
  function Enumerate(iterated){
    var keys = [], key;
    for(key in iterated)keys.push(key);
    set(this, ITER, {o: iterated, a: keys, i: 0});
  }
  createIterator(Enumerate, OBJECT, function(){
    var iter = this[ITER]
      , keys = iter.a
      , key;
    do {
      if(iter.i >= keys.length)return iterResult(1);
    } while(!((key = keys[iter.i++]) in iter.o));
    return iterResult(0, key);
  });
  
  function wrap(fn){
    return function(it){
      assertObject(it);
      try {
        return fn.apply(undefined, arguments), true;
      } catch(e){
        return false;
      }
    }
  }
  
  function reflectGet(target, propertyKey/*, receiver*/){
    var receiver = arguments.length < 3 ? target : arguments[2]
      , desc = getOwnDescriptor(assertObject(target), propertyKey), proto;
    if(desc)return desc.get ? desc.get.call(receiver) : desc.value;
    return isObject(proto = getPrototypeOf(target)) ? reflectGet(proto, propertyKey, receiver) : undefined;
  }
  function reflectSet(target, propertyKey, V/*, receiver*/){
    var receiver = arguments.length < 4 ? target : arguments[3]
      , desc = getOwnDescriptor(assertObject(target), propertyKey), proto;
    if(desc){
      if(desc.writable === false)return false;
      if(desc.set)return desc.set.call(receiver, V), true;
    }
    if(isObject(proto = getPrototypeOf(target)))return reflectSet(proto, propertyKey, V, receiver);
    desc = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
    desc.value = V;
    return defineProperty(receiver, propertyKey, desc), true;
  }
  var isExtensible = Object.isExtensible || returnIt;
  
  var reflect = {
    // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
    apply: ctx(call, apply, 3),
    // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
    construct: construct,
    // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
    defineProperty: wrap(defineProperty),
    // 26.1.4 Reflect.deleteProperty(target, propertyKey)
    deleteProperty: function(target, propertyKey){
      var desc = getOwnDescriptor(assertObject(target), propertyKey);
      return desc && !desc.configurable ? false : delete target[propertyKey];
    },
    // 26.1.5 Reflect.enumerate(target)
    enumerate: function(target){
      return new Enumerate(assertObject(target));
    },
    // 26.1.6 Reflect.get(target, propertyKey [, receiver])
    get: reflectGet,
    // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
    getOwnPropertyDescriptor: function(target, propertyKey){
      return getOwnDescriptor(assertObject(target), propertyKey);
    },
    // 26.1.8 Reflect.getPrototypeOf(target)
    getPrototypeOf: function(target){
      return getPrototypeOf(assertObject(target));
    },
    // 26.1.9 Reflect.has(target, propertyKey)
    has: function(target, propertyKey){
      return propertyKey in target;
    },
    // 26.1.10 Reflect.isExtensible(target)
    isExtensible: function(target){
      return !!isExtensible(assertObject(target));
    },
    // 26.1.11 Reflect.ownKeys(target)
    ownKeys: ownKeys,
    // 26.1.12 Reflect.preventExtensions(target)
    preventExtensions: wrap(Object.preventExtensions || returnIt),
    // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
    set: reflectSet
  }
  // 26.1.14 Reflect.setPrototypeOf(target, proto)
  if(setPrototypeOf)reflect.setPrototypeOf = function(target, proto){
    return setPrototypeOf(assertObject(target), proto), true;
  };
  
  $define(GLOBAL, {Reflect: {}});
  $define(STATIC, 'Reflect', reflect);
}();

/******************************************************************************
 * Module : es7.proposals                                                     *
 ******************************************************************************/

!function(){
  $define(PROTO, ARRAY, {
    // https://github.com/domenic/Array.prototype.includes
    includes: createArrayContains(true)
  });
  $define(PROTO, STRING, {
    // https://github.com/mathiasbynens/String.prototype.at
    at: createPointAt(true)
  });
  
  function createObjectToArray(isEntries){
    return function(object){
      var O      = toObject(object)
        , keys   = getKeys(object)
        , length = keys.length
        , i      = 0
        , result = Array(length)
        , key;
      if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
      else while(length > i)result[i] = O[keys[i++]];
      return result;
    }
  }
  $define(STATIC, OBJECT, {
    // https://github.com/rwaldron/tc39-notes/blob/master/es6/2014-04/apr-9.md#51-objectentries-objectvalues
    values: createObjectToArray(false),
    entries: createObjectToArray(true)
  });
  $define(STATIC, REGEXP, {
    // https://gist.github.com/kangax/9698100
    escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
  });
}();

/******************************************************************************
 * Module : es7.abstract-refs                                                 *
 ******************************************************************************/

// https://github.com/zenparsing/es-abstract-refs
!function(REFERENCE){
  REFERENCE_GET = getWellKnownSymbol(REFERENCE+'Get', true);
  var REFERENCE_SET = getWellKnownSymbol(REFERENCE+SET, true)
    , REFERENCE_DELETE = getWellKnownSymbol(REFERENCE+'Delete', true);
  
  $define(STATIC, SYMBOL, {
    referenceGet: REFERENCE_GET,
    referenceSet: REFERENCE_SET,
    referenceDelete: REFERENCE_DELETE
  });
  
  hidden(FunctionProto, REFERENCE_GET, returnThis);
  
  function setMapMethods(Constructor){
    if(Constructor){
      var MapProto = Constructor[PROTOTYPE];
      hidden(MapProto, REFERENCE_GET, MapProto.get);
      hidden(MapProto, REFERENCE_SET, MapProto.set);
      hidden(MapProto, REFERENCE_DELETE, MapProto['delete']);
    }
  }
  setMapMethods(Map);
  setMapMethods(WeakMap);
}('reference');

/******************************************************************************
 * Module : core.dict                                                         *
 ******************************************************************************/

!function(DICT){
  Dict = function(iterable){
    var dict = create(null);
    if(iterable != undefined){
      if(isIterable(iterable)){
        for(var iter = getIterator(iterable), step, value; !(step = iter.next()).done;){
          value = step.value;
          dict[value[0]] = value[1];
        }
      } else assign(dict, iterable);
    }
    return dict;
  }
  Dict[PROTOTYPE] = null;
  
  function DictIterator(iterated, kind){
    set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
  }
  createIterator(DictIterator, DICT, function(){
    var iter  = this[ITER]
      , O     = iter.o
      , keys  = iter.a
      , kind  = iter.k
      , key;
    do {
      if(iter.i >= keys.length)return iterResult(1);
    } while(!has(O, key = keys[iter.i++]));
    if(kind == KEY)  return iterResult(0, key);
    if(kind == VALUE)return iterResult(0, O[key]);
                     return iterResult(0, [key, O[key]]);
  });
  function createDictIter(kind){
    return function(it){
      return new DictIterator(it, kind);
    }
  }
  
  /*
   * 0 -> forEach
   * 1 -> map
   * 2 -> filter
   * 3 -> some
   * 4 -> every
   * 5 -> find
   * 6 -> findKey
   * 7 -> mapPairs
   */
  function createDictMethod(type){
    var isMap    = type == 1
      , isEvery  = type == 4;
    return function(object, callbackfn, that /* = undefined */){
      var f      = ctx(callbackfn, that, 3)
        , O      = toObject(object)
        , result = isMap || type == 7 || type == 2 ? new (generic(this, Dict)) : undefined
        , key, val, res;
      for(key in O)if(has(O, key)){
        val = O[key];
        res = f(val, key, object);
        if(type){
          if(isMap)result[key] = res;             // map
          else if(res)switch(type){
            case 2: result[key] = val; break      // filter
            case 3: return true;                  // some
            case 5: return val;                   // find
            case 6: return key;                   // findKey
            case 7: result[res[0]] = res[1];      // mapPairs
          } else if(isEvery)return false;         // every
        }
      }
      return type == 3 || isEvery ? isEvery : result;
    }
  }
  function createDictReduce(isTurn){
    return function(object, mapfn, init){
      assertFunction(mapfn);
      var O      = toObject(object)
        , keys   = getKeys(O)
        , length = keys.length
        , i      = 0
        , memo, key, result;
      if(isTurn)memo = init == undefined ? new (generic(this, Dict)) : Object(init);
      else if(arguments.length < 3){
        assert(length, REDUCE_ERROR);
        memo = O[keys[i++]];
      } else memo = Object(init);
      while(length > i)if(has(O, key = keys[i++])){
        result = mapfn(memo, O[key], key, object);
        if(isTurn){
          if(result === false)break;
        } else memo = result;
      }
      return memo;
    }
  }
  var findKey = createDictMethod(6);
  function includes(object, el){
    return (el == el ? keyOf(object, el) : findKey(object, sameNaN)) !== undefined;
  }
  
  var dictMethods = {
    keys:    createDictIter(KEY),
    values:  createDictIter(VALUE),
    entries: createDictIter(KEY+VALUE),
    forEach: createDictMethod(0),
    map:     createDictMethod(1),
    filter:  createDictMethod(2),
    some:    createDictMethod(3),
    every:   createDictMethod(4),
    find:    createDictMethod(5),
    findKey: findKey,
    mapPairs:createDictMethod(7),
    reduce:  createDictReduce(false),
    turn:    createDictReduce(true),
    keyOf:   keyOf,
    includes:includes,
    // Has / get / set own property
    has: has,
    get: get,
    set: createDefiner(0),
    isDict: function(it){
      return isObject(it) && getPrototypeOf(it) === Dict[PROTOTYPE];
    }
  };
  
  if(REFERENCE_GET)for(var key in dictMethods)!function(fn){
    function method(){
      for(var args = [this], i = 0; i < arguments.length;)args.push(arguments[i++]);
      return invoke(fn, args);
    }
    fn[REFERENCE_GET] = function(){
      return method;
    }
  }(dictMethods[key]);
  
  $define(GLOBAL + FORCED, {Dict: assignHidden(Dict, dictMethods)});
}('Dict');

/******************************************************************************
 * Module : core.$for                                                         *
 ******************************************************************************/

!function(ENTRIES, FN){  
  function $for(iterable, entries){
    if(!(this instanceof $for))return new $for(iterable, entries);
    this[ITER]    = getIterator(iterable);
    this[ENTRIES] = !!entries;
  }
  
  createIterator($for, 'Wrapper', function(){
    return this[ITER].next();
  });
  var $forProto = $for[PROTOTYPE];
  setIterator($forProto, function(){
    return this[ITER]; // unwrap
  });
  
  function createChainIterator(next){
    function Iter(I, fn, that){
      this[ITER]    = getIterator(I);
      this[ENTRIES] = I[ENTRIES];
      this[FN]      = ctx(fn, that, I[ENTRIES] ? 2 : 1);
    }
    createIterator(Iter, 'Chain', next, $forProto);
    setIterator(Iter[PROTOTYPE], returnThis); // override $forProto iterator
    return Iter;
  }
  
  var MapIter = createChainIterator(function(){
    var step = this[ITER].next();
    return step.done ? step : iterResult(0, stepCall(this[FN], step.value, this[ENTRIES]));
  });
  
  var FilterIter = createChainIterator(function(){
    for(;;){
      var step = this[ITER].next();
      if(step.done || stepCall(this[FN], step.value, this[ENTRIES]))return step;
    }
  });
  
  assignHidden($forProto, {
    of: function(fn, that){
      forOf(this, this[ENTRIES], fn, that);
    },
    array: function(fn, that){
      var result = [];
      forOf(fn != undefined ? this.map(fn, that) : this, false, push, result);
      return result;
    },
    filter: function(fn, that){
      return new FilterIter(this, fn, that);
    },
    map: function(fn, that){
      return new MapIter(this, fn, that);
    }
  });
  
  $for.isIterable  = isIterable;
  $for.getIterator = getIterator;
  
  $define(GLOBAL + FORCED, {$for: $for});
}('entries', safeSymbol('fn'));

/******************************************************************************
 * Module : core.binding                                                      *
 ******************************************************************************/

!function(_, toLocaleString){
  // Placeholder
  core._ = path._ = path._ || {};

  $define(PROTO + FORCED, FUNCTION, {
    part: part,
    only: function(numberArguments, that /* = @ */){
      var fn     = assertFunction(this)
        , n      = toLength(numberArguments)
        , isThat = arguments.length > 1;
      return function(/* ...args */){
        var length = min(n, arguments.length)
          , args   = Array(length)
          , i      = 0;
        while(length > i)args[i] = arguments[i++];
        return invoke(fn, args, isThat ? that : this);
      }
    }
  });
  
  function tie(key){
    var that  = this
      , bound = {};
    return hidden(that, _, function(key){
      if(key === undefined || !(key in that))return toLocaleString.call(that);
      return has(bound, key) ? bound[key] : (bound[key] = ctx(that[key], that, -1));
    })[_](key);
  }
  
  hidden(path._, TO_STRING, function(){
    return _;
  });
  
  hidden(ObjectProto, _, tie);
  DESC || hidden(ArrayProto, _, tie);
  // IE8- dirty hack - redefined toLocaleString is not enumerable
}(DESC ? uid('tie') : TO_LOCALE, ObjectProto[TO_LOCALE]);

/******************************************************************************
 * Module : core.object                                                       *
 ******************************************************************************/

!function(){
  function define(target, mixin){
    var keys   = ownKeys(toObject(mixin))
      , length = keys.length
      , i = 0, key;
    while(length > i)defineProperty(target, key = keys[i++], getOwnDescriptor(mixin, key));
    return target;
  };
  $define(STATIC + FORCED, OBJECT, {
    isObject: isObject,
    classof: classof,
    define: define,
    make: function(proto, mixin){
      return define(create(proto), mixin);
    }
  });
}();

/******************************************************************************
 * Module : core.array                                                        *
 ******************************************************************************/

$define(PROTO + FORCED, ARRAY, {
  turn: function(fn, target /* = [] */){
    assertFunction(fn);
    var memo   = target == undefined ? [] : Object(target)
      , O      = ES5Object(this)
      , length = toLength(O.length)
      , index  = 0;
    while(length > index)if(fn(memo, O[index], index++, this) === false)break;
    return memo;
  }
});
if(framework)ArrayUnscopables.turn = true;

/******************************************************************************
 * Module : core.number                                                       *
 ******************************************************************************/

!function(numberMethods){  
  function NumberIterator(iterated){
    set(this, ITER, {l: toLength(iterated), i: 0});
  }
  createIterator(NumberIterator, NUMBER, function(){
    var iter = this[ITER]
      , i    = iter.i++;
    return i < iter.l ? iterResult(0, i) : iterResult(1);
  });
  defineIterator(Number, NUMBER, function(){
    return new NumberIterator(this);
  });
  
  numberMethods.random = function(lim /* = 0 */){
    var a = +this
      , b = lim == undefined ? 0 : +lim
      , m = min(a, b);
    return random() * (max(a, b) - m) + m;
  };

  forEach.call(array(
      // ES3:
      'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
      // ES6:
      'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
    ), function(key){
      var fn = Math[key];
      if(fn)numberMethods[key] = function(/* ...args */){
        // ie9- dont support strict mode & convert `this` to object -> convert it to number
        var args = [+this]
          , i    = 0;
        while(arguments.length > i)args.push(arguments[i++]);
        return invoke(fn, args);
      }
    }
  );
  
  $define(PROTO + FORCED, NUMBER, numberMethods);
}({});

/******************************************************************************
 * Module : core.string                                                       *
 ******************************************************************************/

!function(){
  var escapeHTMLDict = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  }, unescapeHTMLDict = {}, key;
  for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
  $define(PROTO + FORCED, STRING, {
    escapeHTML:   createReplacer(/[&<>"']/g, escapeHTMLDict),
    unescapeHTML: createReplacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
  });
}();

/******************************************************************************
 * Module : core.date                                                         *
 ******************************************************************************/

!function(formatRegExp, flexioRegExp, locales, current, SECONDS, MINUTES, HOURS, MONTH, YEAR){
  function createFormat(prefix){
    return function(template, locale /* = current */){
      var that = this
        , dict = locales[has(locales, locale) ? locale : current];
      function get(unit){
        return that[prefix + unit]();
      }
      return String(template).replace(formatRegExp, function(part){
        switch(part){
          case 's'  : return get(SECONDS);                  // Seconds : 0-59
          case 'ss' : return lz(get(SECONDS));              // Seconds : 00-59
          case 'm'  : return get(MINUTES);                  // Minutes : 0-59
          case 'mm' : return lz(get(MINUTES));              // Minutes : 00-59
          case 'h'  : return get(HOURS);                    // Hours   : 0-23
          case 'hh' : return lz(get(HOURS));                // Hours   : 00-23
          case 'D'  : return get(DATE);                     // Date    : 1-31
          case 'DD' : return lz(get(DATE));                 // Date    : 01-31
          case 'W'  : return dict[0][get('Day')];           // Day     : Понедельник
          case 'N'  : return get(MONTH) + 1;                // Month   : 1-12
          case 'NN' : return lz(get(MONTH) + 1);            // Month   : 01-12
          case 'M'  : return dict[2][get(MONTH)];           // Month   : Январь
          case 'MM' : return dict[1][get(MONTH)];           // Month   : Января
          case 'Y'  : return get(YEAR);                     // Year    : 2014
          case 'YY' : return lz(get(YEAR) % 100);           // Year    : 14
        } return part;
      });
    }
  }
  function lz(num){
    return num > 9 ? num : '0' + num;
  }
  function addLocale(lang, locale){
    function split(index){
      var result = [];
      forEach.call(array(locale.months), function(it){
        result.push(it.replace(flexioRegExp, '$' + index));
      });
      return result;
    }
    locales[lang] = [array(locale.weekdays), split(1), split(2)];
    return core;
  }
  $define(PROTO + FORCED, DATE, {
    format:    createFormat('get'),
    formatUTC: createFormat('getUTC')
  });
  addLocale(current, {
    weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
    months: 'January,February,March,April,May,June,July,August,September,October,November,December'
  });
  addLocale('ru', {
    weekdays: 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
    months: 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,' +
            'Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь'
  });
  core.locale = function(locale){
    return has(locales, locale) ? current = locale : current;
  };
  core.addLocale = addLocale;
}(/\b\w\w?\b/g, /:(.*)\|(.*)$/, {}, 'en', 'Seconds', 'Minutes', 'Hours', 'Month', 'FullYear');

/******************************************************************************
 * Module : core.global                                                       *
 ******************************************************************************/

$define(GLOBAL + FORCED, {global: global});

/******************************************************************************
 * Module : js.array.statics                                                  *
 ******************************************************************************/

// JavaScript 1.6 / Strawman array statics shim
!function(arrayStatics){
  function setArrayStatics(keys, length){
    forEach.call(array(keys), function(key){
      if(key in ArrayProto)arrayStatics[key] = ctx(call, ArrayProto[key], length);
    });
  }
  setArrayStatics('pop,reverse,shift,keys,values,entries', 1);
  setArrayStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
  setArrayStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
                  'reduce,reduceRight,copyWithin,fill,turn');
  $define(STATIC, ARRAY, arrayStatics);
}({});

/******************************************************************************
 * Module : web.dom.itarable                                                  *
 ******************************************************************************/

!function(NodeList){
  if(framework && NodeList && !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])){
    hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
  }
  Iterators.NodeList = Iterators[ARRAY];
}(global.NodeList);
}(typeof self != 'undefined' && self.Math === Math ? self : Function('return this')(), true);
define('core-js', ['core-js/index'], function (main) { return main; });

define("core-js/index", function(){});

/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.5.4
window.WebComponents = window.WebComponents || {};

(function(scope) {
  var flags = scope.flags || {};
  var file = "webcomponents.js";
  var script = document.querySelector('script[src*="' + file + '"]');
  if (!flags.noOpts) {
    location.search.slice(1).split("&").forEach(function(o) {
      o = o.split("=");
      o[0] && (flags[o[0]] = o[1] || true);
    });
    if (script) {
      for (var i = 0, a; a = script.attributes[i]; i++) {
        if (a.name !== "src") {
          flags[a.name] = a.value || true;
        }
      }
    }
    if (flags.log) {
      var parts = flags.log.split(",");
      flags.log = {};
      parts.forEach(function(f) {
        flags.log[f] = true;
      });
    } else {
      flags.log = {};
    }
  }
  flags.shadow = flags.shadow || flags.shadowdom || flags.polyfill;
  if (flags.shadow === "native") {
    flags.shadow = false;
  } else {
    flags.shadow = flags.shadow || !HTMLElement.prototype.createShadowRoot;
  }
  if (flags.register) {
    window.CustomElements = window.CustomElements || {
      flags: {}
    };
    window.CustomElements.flags.register = flags.register;
  }
  scope.flags = flags;
})(WebComponents);

if (WebComponents.flags.shadow) {
  if (typeof WeakMap === "undefined") {
    (function() {
      var defineProperty = Object.defineProperty;
      var counter = Date.now() % 1e9;
      var WeakMap = function() {
        this.name = "__st" + (Math.random() * 1e9 >>> 0) + (counter++ + "__");
      };
      WeakMap.prototype = {
        set: function(key, value) {
          var entry = key[this.name];
          if (entry && entry[0] === key) entry[1] = value; else defineProperty(key, this.name, {
            value: [ key, value ],
            writable: true
          });
          return this;
        },
        get: function(key) {
          var entry;
          return (entry = key[this.name]) && entry[0] === key ? entry[1] : undefined;
        },
        "delete": function(key) {
          var entry = key[this.name];
          if (!entry || entry[0] !== key) return false;
          entry[0] = entry[1] = undefined;
          return true;
        },
        has: function(key) {
          var entry = key[this.name];
          if (!entry) return false;
          return entry[0] === key;
        }
      };
      window.WeakMap = WeakMap;
    })();
  }
  window.ShadowDOMPolyfill = {};
  (function(scope) {
    
    var constructorTable = new WeakMap();
    var nativePrototypeTable = new WeakMap();
    var wrappers = Object.create(null);
    function detectEval() {
      if (typeof chrome !== "undefined" && chrome.app && chrome.app.runtime) {
        return false;
      }
      if (navigator.getDeviceStorage) {
        return false;
      }
      try {
        var f = new Function("return true;");
        return f();
      } catch (ex) {
        return false;
      }
    }
    var hasEval = detectEval();
    function assert(b) {
      if (!b) throw new Error("Assertion failed");
    }
    var defineProperty = Object.defineProperty;
    var getOwnPropertyNames = Object.getOwnPropertyNames;
    var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    function mixin(to, from) {
      var names = getOwnPropertyNames(from);
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        defineProperty(to, name, getOwnPropertyDescriptor(from, name));
      }
      return to;
    }
    function mixinStatics(to, from) {
      var names = getOwnPropertyNames(from);
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        switch (name) {
         case "arguments":
         case "caller":
         case "length":
         case "name":
         case "prototype":
         case "toString":
          continue;
        }
        defineProperty(to, name, getOwnPropertyDescriptor(from, name));
      }
      return to;
    }
    function oneOf(object, propertyNames) {
      for (var i = 0; i < propertyNames.length; i++) {
        if (propertyNames[i] in object) return propertyNames[i];
      }
    }
    var nonEnumerableDataDescriptor = {
      value: undefined,
      configurable: true,
      enumerable: false,
      writable: true
    };
    function defineNonEnumerableDataProperty(object, name, value) {
      nonEnumerableDataDescriptor.value = value;
      defineProperty(object, name, nonEnumerableDataDescriptor);
    }
    getOwnPropertyNames(window);
    function getWrapperConstructor(node) {
      var nativePrototype = node.__proto__ || Object.getPrototypeOf(node);
      var wrapperConstructor = constructorTable.get(nativePrototype);
      if (wrapperConstructor) return wrapperConstructor;
      var parentWrapperConstructor = getWrapperConstructor(nativePrototype);
      var GeneratedWrapper = createWrapperConstructor(parentWrapperConstructor);
      registerInternal(nativePrototype, GeneratedWrapper, node);
      return GeneratedWrapper;
    }
    function addForwardingProperties(nativePrototype, wrapperPrototype) {
      installProperty(nativePrototype, wrapperPrototype, true);
    }
    function registerInstanceProperties(wrapperPrototype, instanceObject) {
      installProperty(instanceObject, wrapperPrototype, false);
    }
    var isFirefox = /Firefox/.test(navigator.userAgent);
    var dummyDescriptor = {
      get: function() {},
      set: function(v) {},
      configurable: true,
      enumerable: true
    };
    function isEventHandlerName(name) {
      return /^on[a-z]+$/.test(name);
    }
    function isIdentifierName(name) {
      return /^\w[a-zA-Z_0-9]*$/.test(name);
    }
    function getGetter(name) {
      return hasEval && isIdentifierName(name) ? new Function("return this.__impl4cf1e782hg__." + name) : function() {
        return this.__impl4cf1e782hg__[name];
      };
    }
    function getSetter(name) {
      return hasEval && isIdentifierName(name) ? new Function("v", "this.__impl4cf1e782hg__." + name + " = v") : function(v) {
        this.__impl4cf1e782hg__[name] = v;
      };
    }
    function getMethod(name) {
      return hasEval && isIdentifierName(name) ? new Function("return this.__impl4cf1e782hg__." + name + ".apply(this.__impl4cf1e782hg__, arguments)") : function() {
        return this.__impl4cf1e782hg__[name].apply(this.__impl4cf1e782hg__, arguments);
      };
    }
    function getDescriptor(source, name) {
      try {
        return Object.getOwnPropertyDescriptor(source, name);
      } catch (ex) {
        return dummyDescriptor;
      }
    }
    var isBrokenSafari = function() {
      var descr = Object.getOwnPropertyDescriptor(Node.prototype, "nodeType");
      return descr && !descr.get && !descr.set;
    }();
    function installProperty(source, target, allowMethod, opt_blacklist) {
      var names = getOwnPropertyNames(source);
      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (name === "polymerBlackList_") continue;
        if (name in target) continue;
        if (source.polymerBlackList_ && source.polymerBlackList_[name]) continue;
        if (isFirefox) {
          source.__lookupGetter__(name);
        }
        var descriptor = getDescriptor(source, name);
        var getter, setter;
        if (allowMethod && typeof descriptor.value === "function") {
          target[name] = getMethod(name);
          continue;
        }
        var isEvent = isEventHandlerName(name);
        if (isEvent) getter = scope.getEventHandlerGetter(name); else getter = getGetter(name);
        if (descriptor.writable || descriptor.set || isBrokenSafari) {
          if (isEvent) setter = scope.getEventHandlerSetter(name); else setter = getSetter(name);
        }
        defineProperty(target, name, {
          get: getter,
          set: setter,
          configurable: descriptor.configurable,
          enumerable: descriptor.enumerable
        });
      }
    }
    function register(nativeConstructor, wrapperConstructor, opt_instance) {
      var nativePrototype = nativeConstructor.prototype;
      registerInternal(nativePrototype, wrapperConstructor, opt_instance);
      mixinStatics(wrapperConstructor, nativeConstructor);
    }
    function registerInternal(nativePrototype, wrapperConstructor, opt_instance) {
      var wrapperPrototype = wrapperConstructor.prototype;
      assert(constructorTable.get(nativePrototype) === undefined);
      constructorTable.set(nativePrototype, wrapperConstructor);
      nativePrototypeTable.set(wrapperPrototype, nativePrototype);
      addForwardingProperties(nativePrototype, wrapperPrototype);
      if (opt_instance) registerInstanceProperties(wrapperPrototype, opt_instance);
      defineNonEnumerableDataProperty(wrapperPrototype, "constructor", wrapperConstructor);
      wrapperConstructor.prototype = wrapperPrototype;
    }
    function isWrapperFor(wrapperConstructor, nativeConstructor) {
      return constructorTable.get(nativeConstructor.prototype) === wrapperConstructor;
    }
    function registerObject(object) {
      var nativePrototype = Object.getPrototypeOf(object);
      var superWrapperConstructor = getWrapperConstructor(nativePrototype);
      var GeneratedWrapper = createWrapperConstructor(superWrapperConstructor);
      registerInternal(nativePrototype, GeneratedWrapper, object);
      return GeneratedWrapper;
    }
    function createWrapperConstructor(superWrapperConstructor) {
      function GeneratedWrapper(node) {
        superWrapperConstructor.call(this, node);
      }
      var p = Object.create(superWrapperConstructor.prototype);
      p.constructor = GeneratedWrapper;
      GeneratedWrapper.prototype = p;
      return GeneratedWrapper;
    }
    function isWrapper(object) {
      return object && object.__impl4cf1e782hg__;
    }
    function isNative(object) {
      return !isWrapper(object);
    }
    function wrap(impl) {
      if (impl === null) return null;
      assert(isNative(impl));
      return impl.__wrapper8e3dd93a60__ || (impl.__wrapper8e3dd93a60__ = new (getWrapperConstructor(impl))(impl));
    }
    function unwrap(wrapper) {
      if (wrapper === null) return null;
      assert(isWrapper(wrapper));
      return wrapper.__impl4cf1e782hg__;
    }
    function unsafeUnwrap(wrapper) {
      return wrapper.__impl4cf1e782hg__;
    }
    function setWrapper(impl, wrapper) {
      wrapper.__impl4cf1e782hg__ = impl;
      impl.__wrapper8e3dd93a60__ = wrapper;
    }
    function unwrapIfNeeded(object) {
      return object && isWrapper(object) ? unwrap(object) : object;
    }
    function wrapIfNeeded(object) {
      return object && !isWrapper(object) ? wrap(object) : object;
    }
    function rewrap(node, wrapper) {
      if (wrapper === null) return;
      assert(isNative(node));
      assert(wrapper === undefined || isWrapper(wrapper));
      node.__wrapper8e3dd93a60__ = wrapper;
    }
    var getterDescriptor = {
      get: undefined,
      configurable: true,
      enumerable: true
    };
    function defineGetter(constructor, name, getter) {
      getterDescriptor.get = getter;
      defineProperty(constructor.prototype, name, getterDescriptor);
    }
    function defineWrapGetter(constructor, name) {
      defineGetter(constructor, name, function() {
        return wrap(this.__impl4cf1e782hg__[name]);
      });
    }
    function forwardMethodsToWrapper(constructors, names) {
      constructors.forEach(function(constructor) {
        names.forEach(function(name) {
          constructor.prototype[name] = function() {
            var w = wrapIfNeeded(this);
            return w[name].apply(w, arguments);
          };
        });
      });
    }
    scope.assert = assert;
    scope.constructorTable = constructorTable;
    scope.defineGetter = defineGetter;
    scope.defineWrapGetter = defineWrapGetter;
    scope.forwardMethodsToWrapper = forwardMethodsToWrapper;
    scope.isWrapper = isWrapper;
    scope.isWrapperFor = isWrapperFor;
    scope.mixin = mixin;
    scope.nativePrototypeTable = nativePrototypeTable;
    scope.oneOf = oneOf;
    scope.registerObject = registerObject;
    scope.registerWrapper = register;
    scope.rewrap = rewrap;
    scope.setWrapper = setWrapper;
    scope.unsafeUnwrap = unsafeUnwrap;
    scope.unwrap = unwrap;
    scope.unwrapIfNeeded = unwrapIfNeeded;
    scope.wrap = wrap;
    scope.wrapIfNeeded = wrapIfNeeded;
    scope.wrappers = wrappers;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
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
      calcEditDistances: function(current, currentStart, currentEnd, old, oldStart, oldEnd) {
        var rowCount = oldEnd - oldStart + 1;
        var columnCount = currentEnd - currentStart + 1;
        var distances = new Array(rowCount);
        for (var i = 0; i < rowCount; i++) {
          distances[i] = new Array(columnCount);
          distances[i][0] = i;
        }
        for (var j = 0; j < columnCount; j++) distances[0][j] = j;
        for (var i = 1; i < rowCount; i++) {
          for (var j = 1; j < columnCount; j++) {
            if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1])) distances[i][j] = distances[i - 1][j - 1]; else {
              var north = distances[i - 1][j] + 1;
              var west = distances[i][j - 1] + 1;
              distances[i][j] = north < west ? north : west;
            }
          }
        }
        return distances;
      },
      spliceOperationsFromEditDistances: function(distances) {
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
          if (west < north) min = west < northWest ? west : northWest; else min = north < northWest ? north : northWest;
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
      calcSplices: function(current, currentStart, currentEnd, old, oldStart, oldEnd) {
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
          return [ splice ];
        } else if (oldStart == oldEnd) return [ newSplice(currentStart, [], currentEnd - currentStart) ];
        var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
        var splice = undefined;
        var splices = [];
        var index = currentStart;
        var oldIndex = oldStart;
        for (var i = 0; i < ops.length; i++) {
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
      sharedPrefix: function(current, old, searchLength) {
        for (var i = 0; i < searchLength; i++) if (!this.equals(current[i], old[i])) return i;
        return searchLength;
      },
      sharedSuffix: function(current, old, searchLength) {
        var index1 = current.length;
        var index2 = old.length;
        var count = 0;
        while (count < searchLength && this.equals(current[--index1], old[--index2])) count++;
        return count;
      },
      calculateSplices: function(current, previous) {
        return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
      },
      equals: function(currentValue, previousValue) {
        return currentValue === previousValue;
      }
    };
    scope.ArraySplice = ArraySplice;
  })(window.ShadowDOMPolyfill);
  (function(context) {
    
    var OriginalMutationObserver = window.MutationObserver;
    var callbacks = [];
    var pending = false;
    var timerFunc;
    function handle() {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks = [];
      for (var i = 0; i < copies.length; i++) {
        (0, copies[i])();
      }
    }
    if (OriginalMutationObserver) {
      var counter = 1;
      var observer = new OriginalMutationObserver(handle);
      var textNode = document.createTextNode(counter);
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function() {
        counter = (counter + 1) % 2;
        textNode.data = counter;
      };
    } else {
      timerFunc = window.setTimeout;
    }
    function setEndOfMicrotask(func) {
      callbacks.push(func);
      if (pending) return;
      pending = true;
      timerFunc(handle, 0);
    }
    context.setEndOfMicrotask = setEndOfMicrotask;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var setEndOfMicrotask = scope.setEndOfMicrotask;
    var wrapIfNeeded = scope.wrapIfNeeded;
    var wrappers = scope.wrappers;
    var registrationsTable = new WeakMap();
    var globalMutationObservers = [];
    var isScheduled = false;
    function scheduleCallback(observer) {
      if (observer.scheduled_) return;
      observer.scheduled_ = true;
      globalMutationObservers.push(observer);
      if (isScheduled) return;
      setEndOfMicrotask(notifyObservers);
      isScheduled = true;
    }
    function notifyObservers() {
      isScheduled = false;
      while (globalMutationObservers.length) {
        var notifyList = globalMutationObservers;
        globalMutationObservers = [];
        notifyList.sort(function(x, y) {
          return x.uid_ - y.uid_;
        });
        for (var i = 0; i < notifyList.length; i++) {
          var mo = notifyList[i];
          mo.scheduled_ = false;
          var queue = mo.takeRecords();
          removeTransientObserversFor(mo);
          if (queue.length) {
            mo.callback_(queue, mo);
          }
        }
      }
    }
    function MutationRecord(type, target) {
      this.type = type;
      this.target = target;
      this.addedNodes = new wrappers.NodeList();
      this.removedNodes = new wrappers.NodeList();
      this.previousSibling = null;
      this.nextSibling = null;
      this.attributeName = null;
      this.attributeNamespace = null;
      this.oldValue = null;
    }
    function registerTransientObservers(ancestor, node) {
      for (;ancestor; ancestor = ancestor.parentNode) {
        var registrations = registrationsTable.get(ancestor);
        if (!registrations) continue;
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          if (registration.options.subtree) registration.addTransientObserver(node);
        }
      }
    }
    function removeTransientObserversFor(observer) {
      for (var i = 0; i < observer.nodes_.length; i++) {
        var node = observer.nodes_[i];
        var registrations = registrationsTable.get(node);
        if (!registrations) return;
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          if (registration.observer === observer) registration.removeTransientObservers();
        }
      }
    }
    function enqueueMutation(target, type, data) {
      var interestedObservers = Object.create(null);
      var associatedStrings = Object.create(null);
      for (var node = target; node; node = node.parentNode) {
        var registrations = registrationsTable.get(node);
        if (!registrations) continue;
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          var options = registration.options;
          if (node !== target && !options.subtree) continue;
          if (type === "attributes" && !options.attributes) continue;
          if (type === "attributes" && options.attributeFilter && (data.namespace !== null || options.attributeFilter.indexOf(data.name) === -1)) {
            continue;
          }
          if (type === "characterData" && !options.characterData) continue;
          if (type === "childList" && !options.childList) continue;
          var observer = registration.observer;
          interestedObservers[observer.uid_] = observer;
          if (type === "attributes" && options.attributeOldValue || type === "characterData" && options.characterDataOldValue) {
            associatedStrings[observer.uid_] = data.oldValue;
          }
        }
      }
      for (var uid in interestedObservers) {
        var observer = interestedObservers[uid];
        var record = new MutationRecord(type, target);
        if ("name" in data && "namespace" in data) {
          record.attributeName = data.name;
          record.attributeNamespace = data.namespace;
        }
        if (data.addedNodes) record.addedNodes = data.addedNodes;
        if (data.removedNodes) record.removedNodes = data.removedNodes;
        if (data.previousSibling) record.previousSibling = data.previousSibling;
        if (data.nextSibling) record.nextSibling = data.nextSibling;
        if (associatedStrings[uid] !== undefined) record.oldValue = associatedStrings[uid];
        scheduleCallback(observer);
        observer.records_.push(record);
      }
    }
    var slice = Array.prototype.slice;
    function MutationObserverOptions(options) {
      this.childList = !!options.childList;
      this.subtree = !!options.subtree;
      if (!("attributes" in options) && ("attributeOldValue" in options || "attributeFilter" in options)) {
        this.attributes = true;
      } else {
        this.attributes = !!options.attributes;
      }
      if ("characterDataOldValue" in options && !("characterData" in options)) this.characterData = true; else this.characterData = !!options.characterData;
      if (!this.attributes && (options.attributeOldValue || "attributeFilter" in options) || !this.characterData && options.characterDataOldValue) {
        throw new TypeError();
      }
      this.characterData = !!options.characterData;
      this.attributeOldValue = !!options.attributeOldValue;
      this.characterDataOldValue = !!options.characterDataOldValue;
      if ("attributeFilter" in options) {
        if (options.attributeFilter == null || typeof options.attributeFilter !== "object") {
          throw new TypeError();
        }
        this.attributeFilter = slice.call(options.attributeFilter);
      } else {
        this.attributeFilter = null;
      }
    }
    var uidCounter = 0;
    function MutationObserver(callback) {
      this.callback_ = callback;
      this.nodes_ = [];
      this.records_ = [];
      this.uid_ = ++uidCounter;
      this.scheduled_ = false;
    }
    MutationObserver.prototype = {
      constructor: MutationObserver,
      observe: function(target, options) {
        target = wrapIfNeeded(target);
        var newOptions = new MutationObserverOptions(options);
        var registration;
        var registrations = registrationsTable.get(target);
        if (!registrations) registrationsTable.set(target, registrations = []);
        for (var i = 0; i < registrations.length; i++) {
          if (registrations[i].observer === this) {
            registration = registrations[i];
            registration.removeTransientObservers();
            registration.options = newOptions;
          }
        }
        if (!registration) {
          registration = new Registration(this, target, newOptions);
          registrations.push(registration);
          this.nodes_.push(target);
        }
      },
      disconnect: function() {
        this.nodes_.forEach(function(node) {
          var registrations = registrationsTable.get(node);
          for (var i = 0; i < registrations.length; i++) {
            var registration = registrations[i];
            if (registration.observer === this) {
              registrations.splice(i, 1);
              break;
            }
          }
        }, this);
        this.records_ = [];
      },
      takeRecords: function() {
        var copyOfRecords = this.records_;
        this.records_ = [];
        return copyOfRecords;
      }
    };
    function Registration(observer, target, options) {
      this.observer = observer;
      this.target = target;
      this.options = options;
      this.transientObservedNodes = [];
    }
    Registration.prototype = {
      addTransientObserver: function(node) {
        if (node === this.target) return;
        scheduleCallback(this.observer);
        this.transientObservedNodes.push(node);
        var registrations = registrationsTable.get(node);
        if (!registrations) registrationsTable.set(node, registrations = []);
        registrations.push(this);
      },
      removeTransientObservers: function() {
        var transientObservedNodes = this.transientObservedNodes;
        this.transientObservedNodes = [];
        for (var i = 0; i < transientObservedNodes.length; i++) {
          var node = transientObservedNodes[i];
          var registrations = registrationsTable.get(node);
          for (var j = 0; j < registrations.length; j++) {
            if (registrations[j] === this) {
              registrations.splice(j, 1);
              break;
            }
          }
        }
      }
    };
    scope.enqueueMutation = enqueueMutation;
    scope.registerTransientObservers = registerTransientObservers;
    scope.wrappers.MutationObserver = MutationObserver;
    scope.wrappers.MutationRecord = MutationRecord;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    function TreeScope(root, parent) {
      this.root = root;
      this.parent = parent;
    }
    TreeScope.prototype = {
      get renderer() {
        if (this.root instanceof scope.wrappers.ShadowRoot) {
          return scope.getRendererForHost(this.root.host);
        }
        return null;
      },
      contains: function(treeScope) {
        for (;treeScope; treeScope = treeScope.parent) {
          if (treeScope === this) return true;
        }
        return false;
      }
    };
    function setTreeScope(node, treeScope) {
      if (node.treeScope_ !== treeScope) {
        node.treeScope_ = treeScope;
        for (var sr = node.shadowRoot; sr; sr = sr.olderShadowRoot) {
          sr.treeScope_.parent = treeScope;
        }
        for (var child = node.firstChild; child; child = child.nextSibling) {
          setTreeScope(child, treeScope);
        }
      }
    }
    function getTreeScope(node) {
      if (node instanceof scope.wrappers.Window) {
        debugger;
      }
      if (node.treeScope_) return node.treeScope_;
      var parent = node.parentNode;
      var treeScope;
      if (parent) treeScope = getTreeScope(parent); else treeScope = new TreeScope(node, null);
      return node.treeScope_ = treeScope;
    }
    scope.TreeScope = TreeScope;
    scope.getTreeScope = getTreeScope;
    scope.setTreeScope = setTreeScope;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var forwardMethodsToWrapper = scope.forwardMethodsToWrapper;
    var getTreeScope = scope.getTreeScope;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var wrappers = scope.wrappers;
    var wrappedFuns = new WeakMap();
    var listenersTable = new WeakMap();
    var handledEventsTable = new WeakMap();
    var currentlyDispatchingEvents = new WeakMap();
    var targetTable = new WeakMap();
    var currentTargetTable = new WeakMap();
    var relatedTargetTable = new WeakMap();
    var eventPhaseTable = new WeakMap();
    var stopPropagationTable = new WeakMap();
    var stopImmediatePropagationTable = new WeakMap();
    var eventHandlersTable = new WeakMap();
    var eventPathTable = new WeakMap();
    function isShadowRoot(node) {
      return node instanceof wrappers.ShadowRoot;
    }
    function rootOfNode(node) {
      return getTreeScope(node).root;
    }
    function getEventPath(node, event) {
      var path = [];
      var current = node;
      path.push(current);
      while (current) {
        var destinationInsertionPoints = getDestinationInsertionPoints(current);
        if (destinationInsertionPoints && destinationInsertionPoints.length > 0) {
          for (var i = 0; i < destinationInsertionPoints.length; i++) {
            var insertionPoint = destinationInsertionPoints[i];
            if (isShadowInsertionPoint(insertionPoint)) {
              var shadowRoot = rootOfNode(insertionPoint);
              var olderShadowRoot = shadowRoot.olderShadowRoot;
              if (olderShadowRoot) path.push(olderShadowRoot);
            }
            path.push(insertionPoint);
          }
          current = destinationInsertionPoints[destinationInsertionPoints.length - 1];
        } else {
          if (isShadowRoot(current)) {
            if (inSameTree(node, current) && eventMustBeStopped(event)) {
              break;
            }
            current = current.host;
            path.push(current);
          } else {
            current = current.parentNode;
            if (current) path.push(current);
          }
        }
      }
      return path;
    }
    function eventMustBeStopped(event) {
      if (!event) return false;
      switch (event.type) {
       case "abort":
       case "error":
       case "select":
       case "change":
       case "load":
       case "reset":
       case "resize":
       case "scroll":
       case "selectstart":
        return true;
      }
      return false;
    }
    function isShadowInsertionPoint(node) {
      return node instanceof HTMLShadowElement;
    }
    function getDestinationInsertionPoints(node) {
      return scope.getDestinationInsertionPoints(node);
    }
    function eventRetargetting(path, currentTarget) {
      if (path.length === 0) return currentTarget;
      if (currentTarget instanceof wrappers.Window) currentTarget = currentTarget.document;
      var currentTargetTree = getTreeScope(currentTarget);
      var originalTarget = path[0];
      var originalTargetTree = getTreeScope(originalTarget);
      var relativeTargetTree = lowestCommonInclusiveAncestor(currentTargetTree, originalTargetTree);
      for (var i = 0; i < path.length; i++) {
        var node = path[i];
        if (getTreeScope(node) === relativeTargetTree) return node;
      }
      return path[path.length - 1];
    }
    function getTreeScopeAncestors(treeScope) {
      var ancestors = [];
      for (;treeScope; treeScope = treeScope.parent) {
        ancestors.push(treeScope);
      }
      return ancestors;
    }
    function lowestCommonInclusiveAncestor(tsA, tsB) {
      var ancestorsA = getTreeScopeAncestors(tsA);
      var ancestorsB = getTreeScopeAncestors(tsB);
      var result = null;
      while (ancestorsA.length > 0 && ancestorsB.length > 0) {
        var a = ancestorsA.pop();
        var b = ancestorsB.pop();
        if (a === b) result = a; else break;
      }
      return result;
    }
    function getTreeScopeRoot(ts) {
      if (!ts.parent) return ts;
      return getTreeScopeRoot(ts.parent);
    }
    function relatedTargetResolution(event, currentTarget, relatedTarget) {
      if (currentTarget instanceof wrappers.Window) currentTarget = currentTarget.document;
      var currentTargetTree = getTreeScope(currentTarget);
      var relatedTargetTree = getTreeScope(relatedTarget);
      var relatedTargetEventPath = getEventPath(relatedTarget, event);
      var lowestCommonAncestorTree;
      var lowestCommonAncestorTree = lowestCommonInclusiveAncestor(currentTargetTree, relatedTargetTree);
      if (!lowestCommonAncestorTree) lowestCommonAncestorTree = relatedTargetTree.root;
      for (var commonAncestorTree = lowestCommonAncestorTree; commonAncestorTree; commonAncestorTree = commonAncestorTree.parent) {
        var adjustedRelatedTarget;
        for (var i = 0; i < relatedTargetEventPath.length; i++) {
          var node = relatedTargetEventPath[i];
          if (getTreeScope(node) === commonAncestorTree) return node;
        }
      }
      return null;
    }
    function inSameTree(a, b) {
      return getTreeScope(a) === getTreeScope(b);
    }
    var NONE = 0;
    var CAPTURING_PHASE = 1;
    var AT_TARGET = 2;
    var BUBBLING_PHASE = 3;
    var pendingError;
    function dispatchOriginalEvent(originalEvent) {
      if (handledEventsTable.get(originalEvent)) return;
      handledEventsTable.set(originalEvent, true);
      dispatchEvent(wrap(originalEvent), wrap(originalEvent.target));
      if (pendingError) {
        var err = pendingError;
        pendingError = null;
        throw err;
      }
    }
    function isLoadLikeEvent(event) {
      switch (event.type) {
       case "load":
       case "beforeunload":
       case "unload":
        return true;
      }
      return false;
    }
    function dispatchEvent(event, originalWrapperTarget) {
      if (currentlyDispatchingEvents.get(event)) throw new Error("InvalidStateError");
      currentlyDispatchingEvents.set(event, true);
      scope.renderAllPending();
      var eventPath;
      var overrideTarget;
      var win;
      if (isLoadLikeEvent(event) && !event.bubbles) {
        var doc = originalWrapperTarget;
        if (doc instanceof wrappers.Document && (win = doc.defaultView)) {
          overrideTarget = doc;
          eventPath = [];
        }
      }
      if (!eventPath) {
        if (originalWrapperTarget instanceof wrappers.Window) {
          win = originalWrapperTarget;
          eventPath = [];
        } else {
          eventPath = getEventPath(originalWrapperTarget, event);
          if (!isLoadLikeEvent(event)) {
            var doc = eventPath[eventPath.length - 1];
            if (doc instanceof wrappers.Document) win = doc.defaultView;
          }
        }
      }
      eventPathTable.set(event, eventPath);
      if (dispatchCapturing(event, eventPath, win, overrideTarget)) {
        if (dispatchAtTarget(event, eventPath, win, overrideTarget)) {
          dispatchBubbling(event, eventPath, win, overrideTarget);
        }
      }
      eventPhaseTable.set(event, NONE);
      currentTargetTable.delete(event, null);
      currentlyDispatchingEvents.delete(event);
      return event.defaultPrevented;
    }
    function dispatchCapturing(event, eventPath, win, overrideTarget) {
      var phase = CAPTURING_PHASE;
      if (win) {
        if (!invoke(win, event, phase, eventPath, overrideTarget)) return false;
      }
      for (var i = eventPath.length - 1; i > 0; i--) {
        if (!invoke(eventPath[i], event, phase, eventPath, overrideTarget)) return false;
      }
      return true;
    }
    function dispatchAtTarget(event, eventPath, win, overrideTarget) {
      var phase = AT_TARGET;
      var currentTarget = eventPath[0] || win;
      return invoke(currentTarget, event, phase, eventPath, overrideTarget);
    }
    function dispatchBubbling(event, eventPath, win, overrideTarget) {
      var phase = BUBBLING_PHASE;
      for (var i = 1; i < eventPath.length; i++) {
        if (!invoke(eventPath[i], event, phase, eventPath, overrideTarget)) return;
      }
      if (win && eventPath.length > 0) {
        invoke(win, event, phase, eventPath, overrideTarget);
      }
    }
    function invoke(currentTarget, event, phase, eventPath, overrideTarget) {
      var listeners = listenersTable.get(currentTarget);
      if (!listeners) return true;
      var target = overrideTarget || eventRetargetting(eventPath, currentTarget);
      if (target === currentTarget) {
        if (phase === CAPTURING_PHASE) return true;
        if (phase === BUBBLING_PHASE) phase = AT_TARGET;
      } else if (phase === BUBBLING_PHASE && !event.bubbles) {
        return true;
      }
      if ("relatedTarget" in event) {
        var originalEvent = unwrap(event);
        var unwrappedRelatedTarget = originalEvent.relatedTarget;
        if (unwrappedRelatedTarget) {
          if (unwrappedRelatedTarget instanceof Object && unwrappedRelatedTarget.addEventListener) {
            var relatedTarget = wrap(unwrappedRelatedTarget);
            var adjusted = relatedTargetResolution(event, currentTarget, relatedTarget);
            if (adjusted === target) return true;
          } else {
            adjusted = null;
          }
          relatedTargetTable.set(event, adjusted);
        }
      }
      eventPhaseTable.set(event, phase);
      var type = event.type;
      var anyRemoved = false;
      targetTable.set(event, target);
      currentTargetTable.set(event, currentTarget);
      listeners.depth++;
      for (var i = 0, len = listeners.length; i < len; i++) {
        var listener = listeners[i];
        if (listener.removed) {
          anyRemoved = true;
          continue;
        }
        if (listener.type !== type || !listener.capture && phase === CAPTURING_PHASE || listener.capture && phase === BUBBLING_PHASE) {
          continue;
        }
        try {
          if (typeof listener.handler === "function") listener.handler.call(currentTarget, event); else listener.handler.handleEvent(event);
          if (stopImmediatePropagationTable.get(event)) return false;
        } catch (ex) {
          if (!pendingError) pendingError = ex;
        }
      }
      listeners.depth--;
      if (anyRemoved && listeners.depth === 0) {
        var copy = listeners.slice();
        listeners.length = 0;
        for (var i = 0; i < copy.length; i++) {
          if (!copy[i].removed) listeners.push(copy[i]);
        }
      }
      return !stopPropagationTable.get(event);
    }
    function Listener(type, handler, capture) {
      this.type = type;
      this.handler = handler;
      this.capture = Boolean(capture);
    }
    Listener.prototype = {
      equals: function(that) {
        return this.handler === that.handler && this.type === that.type && this.capture === that.capture;
      },
      get removed() {
        return this.handler === null;
      },
      remove: function() {
        this.handler = null;
      }
    };
    var OriginalEvent = window.Event;
    OriginalEvent.prototype.polymerBlackList_ = {
      returnValue: true,
      keyLocation: true
    };
    function Event(type, options) {
      if (type instanceof OriginalEvent) {
        var impl = type;
        if (!OriginalBeforeUnloadEvent && impl.type === "beforeunload" && !(this instanceof BeforeUnloadEvent)) {
          return new BeforeUnloadEvent(impl);
        }
        setWrapper(impl, this);
      } else {
        return wrap(constructEvent(OriginalEvent, "Event", type, options));
      }
    }
    Event.prototype = {
      get target() {
        return targetTable.get(this);
      },
      get currentTarget() {
        return currentTargetTable.get(this);
      },
      get eventPhase() {
        return eventPhaseTable.get(this);
      },
      get path() {
        var eventPath = eventPathTable.get(this);
        if (!eventPath) return [];
        return eventPath.slice();
      },
      stopPropagation: function() {
        stopPropagationTable.set(this, true);
      },
      stopImmediatePropagation: function() {
        stopPropagationTable.set(this, true);
        stopImmediatePropagationTable.set(this, true);
      }
    };
    registerWrapper(OriginalEvent, Event, document.createEvent("Event"));
    function unwrapOptions(options) {
      if (!options || !options.relatedTarget) return options;
      return Object.create(options, {
        relatedTarget: {
          value: unwrap(options.relatedTarget)
        }
      });
    }
    function registerGenericEvent(name, SuperEvent, prototype) {
      var OriginalEvent = window[name];
      var GenericEvent = function(type, options) {
        if (type instanceof OriginalEvent) setWrapper(type, this); else return wrap(constructEvent(OriginalEvent, name, type, options));
      };
      GenericEvent.prototype = Object.create(SuperEvent.prototype);
      if (prototype) mixin(GenericEvent.prototype, prototype);
      if (OriginalEvent) {
        try {
          registerWrapper(OriginalEvent, GenericEvent, new OriginalEvent("temp"));
        } catch (ex) {
          registerWrapper(OriginalEvent, GenericEvent, document.createEvent(name));
        }
      }
      return GenericEvent;
    }
    var UIEvent = registerGenericEvent("UIEvent", Event);
    var CustomEvent = registerGenericEvent("CustomEvent", Event);
    var relatedTargetProto = {
      get relatedTarget() {
        var relatedTarget = relatedTargetTable.get(this);
        if (relatedTarget !== undefined) return relatedTarget;
        return wrap(unwrap(this).relatedTarget);
      }
    };
    function getInitFunction(name, relatedTargetIndex) {
      return function() {
        arguments[relatedTargetIndex] = unwrap(arguments[relatedTargetIndex]);
        var impl = unwrap(this);
        impl[name].apply(impl, arguments);
      };
    }
    var mouseEventProto = mixin({
      initMouseEvent: getInitFunction("initMouseEvent", 14)
    }, relatedTargetProto);
    var focusEventProto = mixin({
      initFocusEvent: getInitFunction("initFocusEvent", 5)
    }, relatedTargetProto);
    var MouseEvent = registerGenericEvent("MouseEvent", UIEvent, mouseEventProto);
    var FocusEvent = registerGenericEvent("FocusEvent", UIEvent, focusEventProto);
    var defaultInitDicts = Object.create(null);
    var supportsEventConstructors = function() {
      try {
        new window.FocusEvent("focus");
      } catch (ex) {
        return false;
      }
      return true;
    }();
    function constructEvent(OriginalEvent, name, type, options) {
      if (supportsEventConstructors) return new OriginalEvent(type, unwrapOptions(options));
      var event = unwrap(document.createEvent(name));
      var defaultDict = defaultInitDicts[name];
      var args = [ type ];
      Object.keys(defaultDict).forEach(function(key) {
        var v = options != null && key in options ? options[key] : defaultDict[key];
        if (key === "relatedTarget") v = unwrap(v);
        args.push(v);
      });
      event["init" + name].apply(event, args);
      return event;
    }
    if (!supportsEventConstructors) {
      var configureEventConstructor = function(name, initDict, superName) {
        if (superName) {
          var superDict = defaultInitDicts[superName];
          initDict = mixin(mixin({}, superDict), initDict);
        }
        defaultInitDicts[name] = initDict;
      };
      configureEventConstructor("Event", {
        bubbles: false,
        cancelable: false
      });
      configureEventConstructor("CustomEvent", {
        detail: null
      }, "Event");
      configureEventConstructor("UIEvent", {
        view: null,
        detail: 0
      }, "Event");
      configureEventConstructor("MouseEvent", {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null
      }, "UIEvent");
      configureEventConstructor("FocusEvent", {
        relatedTarget: null
      }, "UIEvent");
    }
    var OriginalBeforeUnloadEvent = window.BeforeUnloadEvent;
    function BeforeUnloadEvent(impl) {
      Event.call(this, impl);
    }
    BeforeUnloadEvent.prototype = Object.create(Event.prototype);
    mixin(BeforeUnloadEvent.prototype, {
      get returnValue() {
        return unsafeUnwrap(this).returnValue;
      },
      set returnValue(v) {
        unsafeUnwrap(this).returnValue = v;
      }
    });
    if (OriginalBeforeUnloadEvent) registerWrapper(OriginalBeforeUnloadEvent, BeforeUnloadEvent);
    function isValidListener(fun) {
      if (typeof fun === "function") return true;
      return fun && fun.handleEvent;
    }
    function isMutationEvent(type) {
      switch (type) {
       case "DOMAttrModified":
       case "DOMAttributeNameChanged":
       case "DOMCharacterDataModified":
       case "DOMElementNameChanged":
       case "DOMNodeInserted":
       case "DOMNodeInsertedIntoDocument":
       case "DOMNodeRemoved":
       case "DOMNodeRemovedFromDocument":
       case "DOMSubtreeModified":
        return true;
      }
      return false;
    }
    var OriginalEventTarget = window.EventTarget;
    function EventTarget(impl) {
      setWrapper(impl, this);
    }
    var methodNames = [ "addEventListener", "removeEventListener", "dispatchEvent" ];
    [ Node, Window ].forEach(function(constructor) {
      var p = constructor.prototype;
      methodNames.forEach(function(name) {
        Object.defineProperty(p, name + "_", {
          value: p[name]
        });
      });
    });
    function getTargetToListenAt(wrapper) {
      if (wrapper instanceof wrappers.ShadowRoot) wrapper = wrapper.host;
      return unwrap(wrapper);
    }
    EventTarget.prototype = {
      addEventListener: function(type, fun, capture) {
        if (!isValidListener(fun) || isMutationEvent(type)) return;
        var listener = new Listener(type, fun, capture);
        var listeners = listenersTable.get(this);
        if (!listeners) {
          listeners = [];
          listeners.depth = 0;
          listenersTable.set(this, listeners);
        } else {
          for (var i = 0; i < listeners.length; i++) {
            if (listener.equals(listeners[i])) return;
          }
        }
        listeners.push(listener);
        var target = getTargetToListenAt(this);
        target.addEventListener_(type, dispatchOriginalEvent, true);
      },
      removeEventListener: function(type, fun, capture) {
        capture = Boolean(capture);
        var listeners = listenersTable.get(this);
        if (!listeners) return;
        var count = 0, found = false;
        for (var i = 0; i < listeners.length; i++) {
          if (listeners[i].type === type && listeners[i].capture === capture) {
            count++;
            if (listeners[i].handler === fun) {
              found = true;
              listeners[i].remove();
            }
          }
        }
        if (found && count === 1) {
          var target = getTargetToListenAt(this);
          target.removeEventListener_(type, dispatchOriginalEvent, true);
        }
      },
      dispatchEvent: function(event) {
        var nativeEvent = unwrap(event);
        var eventType = nativeEvent.type;
        handledEventsTable.set(nativeEvent, false);
        scope.renderAllPending();
        var tempListener;
        if (!hasListenerInAncestors(this, eventType)) {
          tempListener = function() {};
          this.addEventListener(eventType, tempListener, true);
        }
        try {
          return unwrap(this).dispatchEvent_(nativeEvent);
        } finally {
          if (tempListener) this.removeEventListener(eventType, tempListener, true);
        }
      }
    };
    function hasListener(node, type) {
      var listeners = listenersTable.get(node);
      if (listeners) {
        for (var i = 0; i < listeners.length; i++) {
          if (!listeners[i].removed && listeners[i].type === type) return true;
        }
      }
      return false;
    }
    function hasListenerInAncestors(target, type) {
      for (var node = unwrap(target); node; node = node.parentNode) {
        if (hasListener(wrap(node), type)) return true;
      }
      return false;
    }
    if (OriginalEventTarget) registerWrapper(OriginalEventTarget, EventTarget);
    function wrapEventTargetMethods(constructors) {
      forwardMethodsToWrapper(constructors, methodNames);
    }
    var originalElementFromPoint = document.elementFromPoint;
    function elementFromPoint(self, document, x, y) {
      scope.renderAllPending();
      var element = wrap(originalElementFromPoint.call(unsafeUnwrap(document), x, y));
      if (!element) return null;
      var path = getEventPath(element, null);
      var idx = path.lastIndexOf(self);
      if (idx == -1) return null; else path = path.slice(0, idx);
      return eventRetargetting(path, self);
    }
    function getEventHandlerGetter(name) {
      return function() {
        var inlineEventHandlers = eventHandlersTable.get(this);
        return inlineEventHandlers && inlineEventHandlers[name] && inlineEventHandlers[name].value || null;
      };
    }
    function getEventHandlerSetter(name) {
      var eventType = name.slice(2);
      return function(value) {
        var inlineEventHandlers = eventHandlersTable.get(this);
        if (!inlineEventHandlers) {
          inlineEventHandlers = Object.create(null);
          eventHandlersTable.set(this, inlineEventHandlers);
        }
        var old = inlineEventHandlers[name];
        if (old) this.removeEventListener(eventType, old.wrapped, false);
        if (typeof value === "function") {
          var wrapped = function(e) {
            var rv = value.call(this, e);
            if (rv === false) e.preventDefault(); else if (name === "onbeforeunload" && typeof rv === "string") e.returnValue = rv;
          };
          this.addEventListener(eventType, wrapped, false);
          inlineEventHandlers[name] = {
            value: value,
            wrapped: wrapped
          };
        }
      };
    }
    scope.elementFromPoint = elementFromPoint;
    scope.getEventHandlerGetter = getEventHandlerGetter;
    scope.getEventHandlerSetter = getEventHandlerSetter;
    scope.wrapEventTargetMethods = wrapEventTargetMethods;
    scope.wrappers.BeforeUnloadEvent = BeforeUnloadEvent;
    scope.wrappers.CustomEvent = CustomEvent;
    scope.wrappers.Event = Event;
    scope.wrappers.EventTarget = EventTarget;
    scope.wrappers.FocusEvent = FocusEvent;
    scope.wrappers.MouseEvent = MouseEvent;
    scope.wrappers.UIEvent = UIEvent;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var UIEvent = scope.wrappers.UIEvent;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var wrap = scope.wrap;
    var OriginalTouchEvent = window.TouchEvent;
    if (!OriginalTouchEvent) return;
    var nativeEvent;
    try {
      nativeEvent = document.createEvent("TouchEvent");
    } catch (ex) {
      return;
    }
    var nonEnumDescriptor = {
      enumerable: false
    };
    function nonEnum(obj, prop) {
      Object.defineProperty(obj, prop, nonEnumDescriptor);
    }
    function Touch(impl) {
      setWrapper(impl, this);
    }
    Touch.prototype = {
      get target() {
        return wrap(unsafeUnwrap(this).target);
      }
    };
    var descr = {
      configurable: true,
      enumerable: true,
      get: null
    };
    [ "clientX", "clientY", "screenX", "screenY", "pageX", "pageY", "identifier", "webkitRadiusX", "webkitRadiusY", "webkitRotationAngle", "webkitForce" ].forEach(function(name) {
      descr.get = function() {
        return unsafeUnwrap(this)[name];
      };
      Object.defineProperty(Touch.prototype, name, descr);
    });
    function TouchList() {
      this.length = 0;
      nonEnum(this, "length");
    }
    TouchList.prototype = {
      item: function(index) {
        return this[index];
      }
    };
    function wrapTouchList(nativeTouchList) {
      var list = new TouchList();
      for (var i = 0; i < nativeTouchList.length; i++) {
        list[i] = new Touch(nativeTouchList[i]);
      }
      list.length = i;
      return list;
    }
    function TouchEvent(impl) {
      UIEvent.call(this, impl);
    }
    TouchEvent.prototype = Object.create(UIEvent.prototype);
    mixin(TouchEvent.prototype, {
      get touches() {
        return wrapTouchList(unsafeUnwrap(this).touches);
      },
      get targetTouches() {
        return wrapTouchList(unsafeUnwrap(this).targetTouches);
      },
      get changedTouches() {
        return wrapTouchList(unsafeUnwrap(this).changedTouches);
      },
      initTouchEvent: function() {
        throw new Error("Not implemented");
      }
    });
    registerWrapper(OriginalTouchEvent, TouchEvent, nativeEvent);
    scope.wrappers.Touch = Touch;
    scope.wrappers.TouchEvent = TouchEvent;
    scope.wrappers.TouchList = TouchList;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var unsafeUnwrap = scope.unsafeUnwrap;
    var wrap = scope.wrap;
    var nonEnumDescriptor = {
      enumerable: false
    };
    function nonEnum(obj, prop) {
      Object.defineProperty(obj, prop, nonEnumDescriptor);
    }
    function NodeList() {
      this.length = 0;
      nonEnum(this, "length");
    }
    NodeList.prototype = {
      item: function(index) {
        return this[index];
      }
    };
    nonEnum(NodeList.prototype, "item");
    function wrapNodeList(list) {
      if (list == null) return list;
      var wrapperList = new NodeList();
      for (var i = 0, length = list.length; i < length; i++) {
        wrapperList[i] = wrap(list[i]);
      }
      wrapperList.length = length;
      return wrapperList;
    }
    function addWrapNodeListMethod(wrapperConstructor, name) {
      wrapperConstructor.prototype[name] = function() {
        return wrapNodeList(unsafeUnwrap(this)[name].apply(unsafeUnwrap(this), arguments));
      };
    }
    scope.wrappers.NodeList = NodeList;
    scope.addWrapNodeListMethod = addWrapNodeListMethod;
    scope.wrapNodeList = wrapNodeList;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    scope.wrapHTMLCollection = scope.wrapNodeList;
    scope.wrappers.HTMLCollection = scope.wrappers.NodeList;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var EventTarget = scope.wrappers.EventTarget;
    var NodeList = scope.wrappers.NodeList;
    var TreeScope = scope.TreeScope;
    var assert = scope.assert;
    var defineWrapGetter = scope.defineWrapGetter;
    var enqueueMutation = scope.enqueueMutation;
    var getTreeScope = scope.getTreeScope;
    var isWrapper = scope.isWrapper;
    var mixin = scope.mixin;
    var registerTransientObservers = scope.registerTransientObservers;
    var registerWrapper = scope.registerWrapper;
    var setTreeScope = scope.setTreeScope;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var wrap = scope.wrap;
    var wrapIfNeeded = scope.wrapIfNeeded;
    var wrappers = scope.wrappers;
    function assertIsNodeWrapper(node) {
      assert(node instanceof Node);
    }
    function createOneElementNodeList(node) {
      var nodes = new NodeList();
      nodes[0] = node;
      nodes.length = 1;
      return nodes;
    }
    var surpressMutations = false;
    function enqueueRemovalForInsertedNodes(node, parent, nodes) {
      enqueueMutation(parent, "childList", {
        removedNodes: nodes,
        previousSibling: node.previousSibling,
        nextSibling: node.nextSibling
      });
    }
    function enqueueRemovalForInsertedDocumentFragment(df, nodes) {
      enqueueMutation(df, "childList", {
        removedNodes: nodes
      });
    }
    function collectNodes(node, parentNode, previousNode, nextNode) {
      if (node instanceof DocumentFragment) {
        var nodes = collectNodesForDocumentFragment(node);
        surpressMutations = true;
        for (var i = nodes.length - 1; i >= 0; i--) {
          node.removeChild(nodes[i]);
          nodes[i].parentNode_ = parentNode;
        }
        surpressMutations = false;
        for (var i = 0; i < nodes.length; i++) {
          nodes[i].previousSibling_ = nodes[i - 1] || previousNode;
          nodes[i].nextSibling_ = nodes[i + 1] || nextNode;
        }
        if (previousNode) previousNode.nextSibling_ = nodes[0];
        if (nextNode) nextNode.previousSibling_ = nodes[nodes.length - 1];
        return nodes;
      }
      var nodes = createOneElementNodeList(node);
      var oldParent = node.parentNode;
      if (oldParent) {
        oldParent.removeChild(node);
      }
      node.parentNode_ = parentNode;
      node.previousSibling_ = previousNode;
      node.nextSibling_ = nextNode;
      if (previousNode) previousNode.nextSibling_ = node;
      if (nextNode) nextNode.previousSibling_ = node;
      return nodes;
    }
    function collectNodesNative(node) {
      if (node instanceof DocumentFragment) return collectNodesForDocumentFragment(node);
      var nodes = createOneElementNodeList(node);
      var oldParent = node.parentNode;
      if (oldParent) enqueueRemovalForInsertedNodes(node, oldParent, nodes);
      return nodes;
    }
    function collectNodesForDocumentFragment(node) {
      var nodes = new NodeList();
      var i = 0;
      for (var child = node.firstChild; child; child = child.nextSibling) {
        nodes[i++] = child;
      }
      nodes.length = i;
      enqueueRemovalForInsertedDocumentFragment(node, nodes);
      return nodes;
    }
    function snapshotNodeList(nodeList) {
      return nodeList;
    }
    function nodeWasAdded(node, treeScope) {
      setTreeScope(node, treeScope);
      node.nodeIsInserted_();
    }
    function nodesWereAdded(nodes, parent) {
      var treeScope = getTreeScope(parent);
      for (var i = 0; i < nodes.length; i++) {
        nodeWasAdded(nodes[i], treeScope);
      }
    }
    function nodeWasRemoved(node) {
      setTreeScope(node, new TreeScope(node, null));
    }
    function nodesWereRemoved(nodes) {
      for (var i = 0; i < nodes.length; i++) {
        nodeWasRemoved(nodes[i]);
      }
    }
    function ensureSameOwnerDocument(parent, child) {
      var ownerDoc = parent.nodeType === Node.DOCUMENT_NODE ? parent : parent.ownerDocument;
      if (ownerDoc !== child.ownerDocument) ownerDoc.adoptNode(child);
    }
    function adoptNodesIfNeeded(owner, nodes) {
      if (!nodes.length) return;
      var ownerDoc = owner.ownerDocument;
      if (ownerDoc === nodes[0].ownerDocument) return;
      for (var i = 0; i < nodes.length; i++) {
        scope.adoptNodeNoRemove(nodes[i], ownerDoc);
      }
    }
    function unwrapNodesForInsertion(owner, nodes) {
      adoptNodesIfNeeded(owner, nodes);
      var length = nodes.length;
      if (length === 1) return unwrap(nodes[0]);
      var df = unwrap(owner.ownerDocument.createDocumentFragment());
      for (var i = 0; i < length; i++) {
        df.appendChild(unwrap(nodes[i]));
      }
      return df;
    }
    function clearChildNodes(wrapper) {
      if (wrapper.firstChild_ !== undefined) {
        var child = wrapper.firstChild_;
        while (child) {
          var tmp = child;
          child = child.nextSibling_;
          tmp.parentNode_ = tmp.previousSibling_ = tmp.nextSibling_ = undefined;
        }
      }
      wrapper.firstChild_ = wrapper.lastChild_ = undefined;
    }
    function removeAllChildNodes(wrapper) {
      if (wrapper.invalidateShadowRenderer()) {
        var childWrapper = wrapper.firstChild;
        while (childWrapper) {
          assert(childWrapper.parentNode === wrapper);
          var nextSibling = childWrapper.nextSibling;
          var childNode = unwrap(childWrapper);
          var parentNode = childNode.parentNode;
          if (parentNode) originalRemoveChild.call(parentNode, childNode);
          childWrapper.previousSibling_ = childWrapper.nextSibling_ = childWrapper.parentNode_ = null;
          childWrapper = nextSibling;
        }
        wrapper.firstChild_ = wrapper.lastChild_ = null;
      } else {
        var node = unwrap(wrapper);
        var child = node.firstChild;
        var nextSibling;
        while (child) {
          nextSibling = child.nextSibling;
          originalRemoveChild.call(node, child);
          child = nextSibling;
        }
      }
    }
    function invalidateParent(node) {
      var p = node.parentNode;
      return p && p.invalidateShadowRenderer();
    }
    function cleanupNodes(nodes) {
      for (var i = 0, n; i < nodes.length; i++) {
        n = nodes[i];
        n.parentNode.removeChild(n);
      }
    }
    var originalImportNode = document.importNode;
    var originalCloneNode = window.Node.prototype.cloneNode;
    function cloneNode(node, deep, opt_doc) {
      var clone;
      if (opt_doc) clone = wrap(originalImportNode.call(opt_doc, unsafeUnwrap(node), false)); else clone = wrap(originalCloneNode.call(unsafeUnwrap(node), false));
      if (deep) {
        for (var child = node.firstChild; child; child = child.nextSibling) {
          clone.appendChild(cloneNode(child, true, opt_doc));
        }
        if (node instanceof wrappers.HTMLTemplateElement) {
          var cloneContent = clone.content;
          for (var child = node.content.firstChild; child; child = child.nextSibling) {
            cloneContent.appendChild(cloneNode(child, true, opt_doc));
          }
        }
      }
      return clone;
    }
    function contains(self, child) {
      if (!child || getTreeScope(self) !== getTreeScope(child)) return false;
      for (var node = child; node; node = node.parentNode) {
        if (node === self) return true;
      }
      return false;
    }
    var OriginalNode = window.Node;
    function Node(original) {
      assert(original instanceof OriginalNode);
      EventTarget.call(this, original);
      this.parentNode_ = undefined;
      this.firstChild_ = undefined;
      this.lastChild_ = undefined;
      this.nextSibling_ = undefined;
      this.previousSibling_ = undefined;
      this.treeScope_ = undefined;
    }
    var OriginalDocumentFragment = window.DocumentFragment;
    var originalAppendChild = OriginalNode.prototype.appendChild;
    var originalCompareDocumentPosition = OriginalNode.prototype.compareDocumentPosition;
    var originalInsertBefore = OriginalNode.prototype.insertBefore;
    var originalRemoveChild = OriginalNode.prototype.removeChild;
    var originalReplaceChild = OriginalNode.prototype.replaceChild;
    var isIe = /Trident|Edge/.test(navigator.userAgent);
    var removeChildOriginalHelper = isIe ? function(parent, child) {
      try {
        originalRemoveChild.call(parent, child);
      } catch (ex) {
        if (!(parent instanceof OriginalDocumentFragment)) throw ex;
      }
    } : function(parent, child) {
      originalRemoveChild.call(parent, child);
    };
    Node.prototype = Object.create(EventTarget.prototype);
    mixin(Node.prototype, {
      appendChild: function(childWrapper) {
        return this.insertBefore(childWrapper, null);
      },
      insertBefore: function(childWrapper, refWrapper) {
        assertIsNodeWrapper(childWrapper);
        var refNode;
        if (refWrapper) {
          if (isWrapper(refWrapper)) {
            refNode = unwrap(refWrapper);
          } else {
            refNode = refWrapper;
            refWrapper = wrap(refNode);
          }
        } else {
          refWrapper = null;
          refNode = null;
        }
        refWrapper && assert(refWrapper.parentNode === this);
        var nodes;
        var previousNode = refWrapper ? refWrapper.previousSibling : this.lastChild;
        var useNative = !this.invalidateShadowRenderer() && !invalidateParent(childWrapper);
        if (useNative) nodes = collectNodesNative(childWrapper); else nodes = collectNodes(childWrapper, this, previousNode, refWrapper);
        if (useNative) {
          ensureSameOwnerDocument(this, childWrapper);
          clearChildNodes(this);
          originalInsertBefore.call(unsafeUnwrap(this), unwrap(childWrapper), refNode);
        } else {
          if (!previousNode) this.firstChild_ = nodes[0];
          if (!refWrapper) {
            this.lastChild_ = nodes[nodes.length - 1];
            if (this.firstChild_ === undefined) this.firstChild_ = this.firstChild;
          }
          var parentNode = refNode ? refNode.parentNode : unsafeUnwrap(this);
          if (parentNode) {
            originalInsertBefore.call(parentNode, unwrapNodesForInsertion(this, nodes), refNode);
          } else {
            adoptNodesIfNeeded(this, nodes);
          }
        }
        enqueueMutation(this, "childList", {
          addedNodes: nodes,
          nextSibling: refWrapper,
          previousSibling: previousNode
        });
        nodesWereAdded(nodes, this);
        return childWrapper;
      },
      removeChild: function(childWrapper) {
        assertIsNodeWrapper(childWrapper);
        if (childWrapper.parentNode !== this) {
          var found = false;
          var childNodes = this.childNodes;
          for (var ieChild = this.firstChild; ieChild; ieChild = ieChild.nextSibling) {
            if (ieChild === childWrapper) {
              found = true;
              break;
            }
          }
          if (!found) {
            throw new Error("NotFoundError");
          }
        }
        var childNode = unwrap(childWrapper);
        var childWrapperNextSibling = childWrapper.nextSibling;
        var childWrapperPreviousSibling = childWrapper.previousSibling;
        if (this.invalidateShadowRenderer()) {
          var thisFirstChild = this.firstChild;
          var thisLastChild = this.lastChild;
          var parentNode = childNode.parentNode;
          if (parentNode) removeChildOriginalHelper(parentNode, childNode);
          if (thisFirstChild === childWrapper) this.firstChild_ = childWrapperNextSibling;
          if (thisLastChild === childWrapper) this.lastChild_ = childWrapperPreviousSibling;
          if (childWrapperPreviousSibling) childWrapperPreviousSibling.nextSibling_ = childWrapperNextSibling;
          if (childWrapperNextSibling) {
            childWrapperNextSibling.previousSibling_ = childWrapperPreviousSibling;
          }
          childWrapper.previousSibling_ = childWrapper.nextSibling_ = childWrapper.parentNode_ = undefined;
        } else {
          clearChildNodes(this);
          removeChildOriginalHelper(unsafeUnwrap(this), childNode);
        }
        if (!surpressMutations) {
          enqueueMutation(this, "childList", {
            removedNodes: createOneElementNodeList(childWrapper),
            nextSibling: childWrapperNextSibling,
            previousSibling: childWrapperPreviousSibling
          });
        }
        registerTransientObservers(this, childWrapper);
        return childWrapper;
      },
      replaceChild: function(newChildWrapper, oldChildWrapper) {
        assertIsNodeWrapper(newChildWrapper);
        var oldChildNode;
        if (isWrapper(oldChildWrapper)) {
          oldChildNode = unwrap(oldChildWrapper);
        } else {
          oldChildNode = oldChildWrapper;
          oldChildWrapper = wrap(oldChildNode);
        }
        if (oldChildWrapper.parentNode !== this) {
          throw new Error("NotFoundError");
        }
        var nextNode = oldChildWrapper.nextSibling;
        var previousNode = oldChildWrapper.previousSibling;
        var nodes;
        var useNative = !this.invalidateShadowRenderer() && !invalidateParent(newChildWrapper);
        if (useNative) {
          nodes = collectNodesNative(newChildWrapper);
        } else {
          if (nextNode === newChildWrapper) nextNode = newChildWrapper.nextSibling;
          nodes = collectNodes(newChildWrapper, this, previousNode, nextNode);
        }
        if (!useNative) {
          if (this.firstChild === oldChildWrapper) this.firstChild_ = nodes[0];
          if (this.lastChild === oldChildWrapper) this.lastChild_ = nodes[nodes.length - 1];
          oldChildWrapper.previousSibling_ = oldChildWrapper.nextSibling_ = oldChildWrapper.parentNode_ = undefined;
          if (oldChildNode.parentNode) {
            originalReplaceChild.call(oldChildNode.parentNode, unwrapNodesForInsertion(this, nodes), oldChildNode);
          }
        } else {
          ensureSameOwnerDocument(this, newChildWrapper);
          clearChildNodes(this);
          originalReplaceChild.call(unsafeUnwrap(this), unwrap(newChildWrapper), oldChildNode);
        }
        enqueueMutation(this, "childList", {
          addedNodes: nodes,
          removedNodes: createOneElementNodeList(oldChildWrapper),
          nextSibling: nextNode,
          previousSibling: previousNode
        });
        nodeWasRemoved(oldChildWrapper);
        nodesWereAdded(nodes, this);
        return oldChildWrapper;
      },
      nodeIsInserted_: function() {
        for (var child = this.firstChild; child; child = child.nextSibling) {
          child.nodeIsInserted_();
        }
      },
      hasChildNodes: function() {
        return this.firstChild !== null;
      },
      get parentNode() {
        return this.parentNode_ !== undefined ? this.parentNode_ : wrap(unsafeUnwrap(this).parentNode);
      },
      get firstChild() {
        return this.firstChild_ !== undefined ? this.firstChild_ : wrap(unsafeUnwrap(this).firstChild);
      },
      get lastChild() {
        return this.lastChild_ !== undefined ? this.lastChild_ : wrap(unsafeUnwrap(this).lastChild);
      },
      get nextSibling() {
        return this.nextSibling_ !== undefined ? this.nextSibling_ : wrap(unsafeUnwrap(this).nextSibling);
      },
      get previousSibling() {
        return this.previousSibling_ !== undefined ? this.previousSibling_ : wrap(unsafeUnwrap(this).previousSibling);
      },
      get parentElement() {
        var p = this.parentNode;
        while (p && p.nodeType !== Node.ELEMENT_NODE) {
          p = p.parentNode;
        }
        return p;
      },
      get textContent() {
        var s = "";
        for (var child = this.firstChild; child; child = child.nextSibling) {
          if (child.nodeType != Node.COMMENT_NODE) {
            s += child.textContent;
          }
        }
        return s;
      },
      set textContent(textContent) {
        if (textContent == null) textContent = "";
        var removedNodes = snapshotNodeList(this.childNodes);
        if (this.invalidateShadowRenderer()) {
          removeAllChildNodes(this);
          if (textContent !== "") {
            var textNode = unsafeUnwrap(this).ownerDocument.createTextNode(textContent);
            this.appendChild(textNode);
          }
        } else {
          clearChildNodes(this);
          unsafeUnwrap(this).textContent = textContent;
        }
        var addedNodes = snapshotNodeList(this.childNodes);
        enqueueMutation(this, "childList", {
          addedNodes: addedNodes,
          removedNodes: removedNodes
        });
        nodesWereRemoved(removedNodes);
        nodesWereAdded(addedNodes, this);
      },
      get childNodes() {
        var wrapperList = new NodeList();
        var i = 0;
        for (var child = this.firstChild; child; child = child.nextSibling) {
          wrapperList[i++] = child;
        }
        wrapperList.length = i;
        return wrapperList;
      },
      cloneNode: function(deep) {
        return cloneNode(this, deep);
      },
      contains: function(child) {
        return contains(this, wrapIfNeeded(child));
      },
      compareDocumentPosition: function(otherNode) {
        return originalCompareDocumentPosition.call(unsafeUnwrap(this), unwrapIfNeeded(otherNode));
      },
      normalize: function() {
        var nodes = snapshotNodeList(this.childNodes);
        var remNodes = [];
        var s = "";
        var modNode;
        for (var i = 0, n; i < nodes.length; i++) {
          n = nodes[i];
          if (n.nodeType === Node.TEXT_NODE) {
            if (!modNode && !n.data.length) this.removeChild(n); else if (!modNode) modNode = n; else {
              s += n.data;
              remNodes.push(n);
            }
          } else {
            if (modNode && remNodes.length) {
              modNode.data += s;
              cleanupNodes(remNodes);
            }
            remNodes = [];
            s = "";
            modNode = null;
            if (n.childNodes.length) n.normalize();
          }
        }
        if (modNode && remNodes.length) {
          modNode.data += s;
          cleanupNodes(remNodes);
        }
      }
    });
    defineWrapGetter(Node, "ownerDocument");
    registerWrapper(OriginalNode, Node, document.createDocumentFragment());
    delete Node.prototype.querySelector;
    delete Node.prototype.querySelectorAll;
    Node.prototype = mixin(Object.create(EventTarget.prototype), Node.prototype);
    scope.cloneNode = cloneNode;
    scope.nodeWasAdded = nodeWasAdded;
    scope.nodeWasRemoved = nodeWasRemoved;
    scope.nodesWereAdded = nodesWereAdded;
    scope.nodesWereRemoved = nodesWereRemoved;
    scope.originalInsertBefore = originalInsertBefore;
    scope.originalRemoveChild = originalRemoveChild;
    scope.snapshotNodeList = snapshotNodeList;
    scope.wrappers.Node = Node;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLCollection = scope.wrappers.HTMLCollection;
    var NodeList = scope.wrappers.NodeList;
    var getTreeScope = scope.getTreeScope;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var wrap = scope.wrap;
    var originalDocumentQuerySelector = document.querySelector;
    var originalElementQuerySelector = document.documentElement.querySelector;
    var originalDocumentQuerySelectorAll = document.querySelectorAll;
    var originalElementQuerySelectorAll = document.documentElement.querySelectorAll;
    var originalDocumentGetElementsByTagName = document.getElementsByTagName;
    var originalElementGetElementsByTagName = document.documentElement.getElementsByTagName;
    var originalDocumentGetElementsByTagNameNS = document.getElementsByTagNameNS;
    var originalElementGetElementsByTagNameNS = document.documentElement.getElementsByTagNameNS;
    var OriginalElement = window.Element;
    var OriginalDocument = window.HTMLDocument || window.Document;
    function filterNodeList(list, index, result, deep) {
      var wrappedItem = null;
      var root = null;
      for (var i = 0, length = list.length; i < length; i++) {
        wrappedItem = wrap(list[i]);
        if (!deep && (root = getTreeScope(wrappedItem).root)) {
          if (root instanceof scope.wrappers.ShadowRoot) {
            continue;
          }
        }
        result[index++] = wrappedItem;
      }
      return index;
    }
    function shimSelector(selector) {
      return String(selector).replace(/\/deep\//g, " ");
    }
    function findOne(node, selector) {
      var m, el = node.firstElementChild;
      while (el) {
        if (el.matches(selector)) return el;
        m = findOne(el, selector);
        if (m) return m;
        el = el.nextElementSibling;
      }
      return null;
    }
    function matchesSelector(el, selector) {
      return el.matches(selector);
    }
    var XHTML_NS = "http://www.w3.org/1999/xhtml";
    function matchesTagName(el, localName, localNameLowerCase) {
      var ln = el.localName;
      return ln === localName || ln === localNameLowerCase && el.namespaceURI === XHTML_NS;
    }
    function matchesEveryThing() {
      return true;
    }
    function matchesLocalNameOnly(el, ns, localName) {
      return el.localName === localName;
    }
    function matchesNameSpace(el, ns) {
      return el.namespaceURI === ns;
    }
    function matchesLocalNameNS(el, ns, localName) {
      return el.namespaceURI === ns && el.localName === localName;
    }
    function findElements(node, index, result, p, arg0, arg1) {
      var el = node.firstElementChild;
      while (el) {
        if (p(el, arg0, arg1)) result[index++] = el;
        index = findElements(el, index, result, p, arg0, arg1);
        el = el.nextElementSibling;
      }
      return index;
    }
    function querySelectorAllFiltered(p, index, result, selector, deep) {
      var target = unsafeUnwrap(this);
      var list;
      var root = getTreeScope(this).root;
      if (root instanceof scope.wrappers.ShadowRoot) {
        return findElements(this, index, result, p, selector, null);
      } else if (target instanceof OriginalElement) {
        list = originalElementQuerySelectorAll.call(target, selector);
      } else if (target instanceof OriginalDocument) {
        list = originalDocumentQuerySelectorAll.call(target, selector);
      } else {
        return findElements(this, index, result, p, selector, null);
      }
      return filterNodeList(list, index, result, deep);
    }
    var SelectorsInterface = {
      querySelector: function(selector) {
        var shimmed = shimSelector(selector);
        var deep = shimmed !== selector;
        selector = shimmed;
        var target = unsafeUnwrap(this);
        var wrappedItem;
        var root = getTreeScope(this).root;
        if (root instanceof scope.wrappers.ShadowRoot) {
          return findOne(this, selector);
        } else if (target instanceof OriginalElement) {
          wrappedItem = wrap(originalElementQuerySelector.call(target, selector));
        } else if (target instanceof OriginalDocument) {
          wrappedItem = wrap(originalDocumentQuerySelector.call(target, selector));
        } else {
          return findOne(this, selector);
        }
        if (!wrappedItem) {
          return wrappedItem;
        } else if (!deep && (root = getTreeScope(wrappedItem).root)) {
          if (root instanceof scope.wrappers.ShadowRoot) {
            return findOne(this, selector);
          }
        }
        return wrappedItem;
      },
      querySelectorAll: function(selector) {
        var shimmed = shimSelector(selector);
        var deep = shimmed !== selector;
        selector = shimmed;
        var result = new NodeList();
        result.length = querySelectorAllFiltered.call(this, matchesSelector, 0, result, selector, deep);
        return result;
      }
    };
    function getElementsByTagNameFiltered(p, index, result, localName, lowercase) {
      var target = unsafeUnwrap(this);
      var list;
      var root = getTreeScope(this).root;
      if (root instanceof scope.wrappers.ShadowRoot) {
        return findElements(this, index, result, p, localName, lowercase);
      } else if (target instanceof OriginalElement) {
        list = originalElementGetElementsByTagName.call(target, localName, lowercase);
      } else if (target instanceof OriginalDocument) {
        list = originalDocumentGetElementsByTagName.call(target, localName, lowercase);
      } else {
        return findElements(this, index, result, p, localName, lowercase);
      }
      return filterNodeList(list, index, result, false);
    }
    function getElementsByTagNameNSFiltered(p, index, result, ns, localName) {
      var target = unsafeUnwrap(this);
      var list;
      var root = getTreeScope(this).root;
      if (root instanceof scope.wrappers.ShadowRoot) {
        return findElements(this, index, result, p, ns, localName);
      } else if (target instanceof OriginalElement) {
        list = originalElementGetElementsByTagNameNS.call(target, ns, localName);
      } else if (target instanceof OriginalDocument) {
        list = originalDocumentGetElementsByTagNameNS.call(target, ns, localName);
      } else {
        return findElements(this, index, result, p, ns, localName);
      }
      return filterNodeList(list, index, result, false);
    }
    var GetElementsByInterface = {
      getElementsByTagName: function(localName) {
        var result = new HTMLCollection();
        var match = localName === "*" ? matchesEveryThing : matchesTagName;
        result.length = getElementsByTagNameFiltered.call(this, match, 0, result, localName, localName.toLowerCase());
        return result;
      },
      getElementsByClassName: function(className) {
        return this.querySelectorAll("." + className);
      },
      getElementsByTagNameNS: function(ns, localName) {
        var result = new HTMLCollection();
        var match = null;
        if (ns === "*") {
          match = localName === "*" ? matchesEveryThing : matchesLocalNameOnly;
        } else {
          match = localName === "*" ? matchesNameSpace : matchesLocalNameNS;
        }
        result.length = getElementsByTagNameNSFiltered.call(this, match, 0, result, ns || null, localName);
        return result;
      }
    };
    scope.GetElementsByInterface = GetElementsByInterface;
    scope.SelectorsInterface = SelectorsInterface;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var NodeList = scope.wrappers.NodeList;
    function forwardElement(node) {
      while (node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.nextSibling;
      }
      return node;
    }
    function backwardsElement(node) {
      while (node && node.nodeType !== Node.ELEMENT_NODE) {
        node = node.previousSibling;
      }
      return node;
    }
    var ParentNodeInterface = {
      get firstElementChild() {
        return forwardElement(this.firstChild);
      },
      get lastElementChild() {
        return backwardsElement(this.lastChild);
      },
      get childElementCount() {
        var count = 0;
        for (var child = this.firstElementChild; child; child = child.nextElementSibling) {
          count++;
        }
        return count;
      },
      get children() {
        var wrapperList = new NodeList();
        var i = 0;
        for (var child = this.firstElementChild; child; child = child.nextElementSibling) {
          wrapperList[i++] = child;
        }
        wrapperList.length = i;
        return wrapperList;
      },
      remove: function() {
        var p = this.parentNode;
        if (p) p.removeChild(this);
      }
    };
    var ChildNodeInterface = {
      get nextElementSibling() {
        return forwardElement(this.nextSibling);
      },
      get previousElementSibling() {
        return backwardsElement(this.previousSibling);
      }
    };
    scope.ChildNodeInterface = ChildNodeInterface;
    scope.ParentNodeInterface = ParentNodeInterface;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var ChildNodeInterface = scope.ChildNodeInterface;
    var Node = scope.wrappers.Node;
    var enqueueMutation = scope.enqueueMutation;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var OriginalCharacterData = window.CharacterData;
    function CharacterData(node) {
      Node.call(this, node);
    }
    CharacterData.prototype = Object.create(Node.prototype);
    mixin(CharacterData.prototype, {
      get textContent() {
        return this.data;
      },
      set textContent(value) {
        this.data = value;
      },
      get data() {
        return unsafeUnwrap(this).data;
      },
      set data(value) {
        var oldValue = unsafeUnwrap(this).data;
        enqueueMutation(this, "characterData", {
          oldValue: oldValue
        });
        unsafeUnwrap(this).data = value;
      }
    });
    mixin(CharacterData.prototype, ChildNodeInterface);
    registerWrapper(OriginalCharacterData, CharacterData, document.createTextNode(""));
    scope.wrappers.CharacterData = CharacterData;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var CharacterData = scope.wrappers.CharacterData;
    var enqueueMutation = scope.enqueueMutation;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    function toUInt32(x) {
      return x >>> 0;
    }
    var OriginalText = window.Text;
    function Text(node) {
      CharacterData.call(this, node);
    }
    Text.prototype = Object.create(CharacterData.prototype);
    mixin(Text.prototype, {
      splitText: function(offset) {
        offset = toUInt32(offset);
        var s = this.data;
        if (offset > s.length) throw new Error("IndexSizeError");
        var head = s.slice(0, offset);
        var tail = s.slice(offset);
        this.data = head;
        var newTextNode = this.ownerDocument.createTextNode(tail);
        if (this.parentNode) this.parentNode.insertBefore(newTextNode, this.nextSibling);
        return newTextNode;
      }
    });
    registerWrapper(OriginalText, Text, document.createTextNode(""));
    scope.wrappers.Text = Text;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var unsafeUnwrap = scope.unsafeUnwrap;
    var enqueueMutation = scope.enqueueMutation;
    function getClass(el) {
      return unsafeUnwrap(el).getAttribute("class");
    }
    function enqueueClassAttributeChange(el, oldValue) {
      enqueueMutation(el, "attributes", {
        name: "class",
        namespace: null,
        oldValue: oldValue
      });
    }
    function invalidateClass(el) {
      scope.invalidateRendererBasedOnAttribute(el, "class");
    }
    function changeClass(tokenList, method, args) {
      var ownerElement = tokenList.ownerElement_;
      if (ownerElement == null) {
        return method.apply(tokenList, args);
      }
      var oldValue = getClass(ownerElement);
      var retv = method.apply(tokenList, args);
      if (getClass(ownerElement) !== oldValue) {
        enqueueClassAttributeChange(ownerElement, oldValue);
        invalidateClass(ownerElement);
      }
      return retv;
    }
    var oldAdd = DOMTokenList.prototype.add;
    DOMTokenList.prototype.add = function() {
      changeClass(this, oldAdd, arguments);
    };
    var oldRemove = DOMTokenList.prototype.remove;
    DOMTokenList.prototype.remove = function() {
      changeClass(this, oldRemove, arguments);
    };
    var oldToggle = DOMTokenList.prototype.toggle;
    DOMTokenList.prototype.toggle = function() {
      return changeClass(this, oldToggle, arguments);
    };
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var ChildNodeInterface = scope.ChildNodeInterface;
    var GetElementsByInterface = scope.GetElementsByInterface;
    var Node = scope.wrappers.Node;
    var ParentNodeInterface = scope.ParentNodeInterface;
    var SelectorsInterface = scope.SelectorsInterface;
    var addWrapNodeListMethod = scope.addWrapNodeListMethod;
    var enqueueMutation = scope.enqueueMutation;
    var mixin = scope.mixin;
    var oneOf = scope.oneOf;
    var registerWrapper = scope.registerWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var wrappers = scope.wrappers;
    var OriginalElement = window.Element;
    var matchesNames = [ "matches", "mozMatchesSelector", "msMatchesSelector", "webkitMatchesSelector" ].filter(function(name) {
      return OriginalElement.prototype[name];
    });
    var matchesName = matchesNames[0];
    var originalMatches = OriginalElement.prototype[matchesName];
    function invalidateRendererBasedOnAttribute(element, name) {
      var p = element.parentNode;
      if (!p || !p.shadowRoot) return;
      var renderer = scope.getRendererForHost(p);
      if (renderer.dependsOnAttribute(name)) renderer.invalidate();
    }
    function enqueAttributeChange(element, name, oldValue) {
      enqueueMutation(element, "attributes", {
        name: name,
        namespace: null,
        oldValue: oldValue
      });
    }
    var classListTable = new WeakMap();
    function Element(node) {
      Node.call(this, node);
    }
    Element.prototype = Object.create(Node.prototype);
    mixin(Element.prototype, {
      createShadowRoot: function() {
        var newShadowRoot = new wrappers.ShadowRoot(this);
        unsafeUnwrap(this).polymerShadowRoot_ = newShadowRoot;
        var renderer = scope.getRendererForHost(this);
        renderer.invalidate();
        return newShadowRoot;
      },
      get shadowRoot() {
        return unsafeUnwrap(this).polymerShadowRoot_ || null;
      },
      setAttribute: function(name, value) {
        var oldValue = unsafeUnwrap(this).getAttribute(name);
        unsafeUnwrap(this).setAttribute(name, value);
        enqueAttributeChange(this, name, oldValue);
        invalidateRendererBasedOnAttribute(this, name);
      },
      removeAttribute: function(name) {
        var oldValue = unsafeUnwrap(this).getAttribute(name);
        unsafeUnwrap(this).removeAttribute(name);
        enqueAttributeChange(this, name, oldValue);
        invalidateRendererBasedOnAttribute(this, name);
      },
      matches: function(selector) {
        return originalMatches.call(unsafeUnwrap(this), selector);
      },
      get classList() {
        var list = classListTable.get(this);
        if (!list) {
          list = unsafeUnwrap(this).classList;
          list.ownerElement_ = this;
          classListTable.set(this, list);
        }
        return list;
      },
      get className() {
        return unsafeUnwrap(this).className;
      },
      set className(v) {
        this.setAttribute("class", v);
      },
      get id() {
        return unsafeUnwrap(this).id;
      },
      set id(v) {
        this.setAttribute("id", v);
      }
    });
    matchesNames.forEach(function(name) {
      if (name !== "matches") {
        Element.prototype[name] = function(selector) {
          return this.matches(selector);
        };
      }
    });
    if (OriginalElement.prototype.webkitCreateShadowRoot) {
      Element.prototype.webkitCreateShadowRoot = Element.prototype.createShadowRoot;
    }
    mixin(Element.prototype, ChildNodeInterface);
    mixin(Element.prototype, GetElementsByInterface);
    mixin(Element.prototype, ParentNodeInterface);
    mixin(Element.prototype, SelectorsInterface);
    registerWrapper(OriginalElement, Element, document.createElementNS(null, "x"));
    scope.invalidateRendererBasedOnAttribute = invalidateRendererBasedOnAttribute;
    scope.matchesNames = matchesNames;
    scope.wrappers.Element = Element;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var Element = scope.wrappers.Element;
    var defineGetter = scope.defineGetter;
    var enqueueMutation = scope.enqueueMutation;
    var mixin = scope.mixin;
    var nodesWereAdded = scope.nodesWereAdded;
    var nodesWereRemoved = scope.nodesWereRemoved;
    var registerWrapper = scope.registerWrapper;
    var snapshotNodeList = scope.snapshotNodeList;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var wrappers = scope.wrappers;
    var escapeAttrRegExp = /[&\u00A0"]/g;
    var escapeDataRegExp = /[&\u00A0<>]/g;
    function escapeReplace(c) {
      switch (c) {
       case "&":
        return "&amp;";

       case "<":
        return "&lt;";

       case ">":
        return "&gt;";

       case '"':
        return "&quot;";

       case " ":
        return "&nbsp;";
      }
    }
    function escapeAttr(s) {
      return s.replace(escapeAttrRegExp, escapeReplace);
    }
    function escapeData(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    }
    function makeSet(arr) {
      var set = {};
      for (var i = 0; i < arr.length; i++) {
        set[arr[i]] = true;
      }
      return set;
    }
    var voidElements = makeSet([ "area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr" ]);
    var plaintextParents = makeSet([ "style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript" ]);
    function getOuterHTML(node, parentNode) {
      switch (node.nodeType) {
       case Node.ELEMENT_NODE:
        var tagName = node.tagName.toLowerCase();
        var s = "<" + tagName;
        var attrs = node.attributes;
        for (var i = 0, attr; attr = attrs[i]; i++) {
          s += " " + attr.name + '="' + escapeAttr(attr.value) + '"';
        }
        s += ">";
        if (voidElements[tagName]) return s;
        return s + getInnerHTML(node) + "</" + tagName + ">";

       case Node.TEXT_NODE:
        var data = node.data;
        if (parentNode && plaintextParents[parentNode.localName]) return data;
        return escapeData(data);

       case Node.COMMENT_NODE:
        return "<!--" + node.data + "-->";

       default:
        console.error(node);
        throw new Error("not implemented");
      }
    }
    function getInnerHTML(node) {
      if (node instanceof wrappers.HTMLTemplateElement) node = node.content;
      var s = "";
      for (var child = node.firstChild; child; child = child.nextSibling) {
        s += getOuterHTML(child, node);
      }
      return s;
    }
    function setInnerHTML(node, value, opt_tagName) {
      var tagName = opt_tagName || "div";
      node.textContent = "";
      var tempElement = unwrap(node.ownerDocument.createElement(tagName));
      tempElement.innerHTML = value;
      var firstChild;
      while (firstChild = tempElement.firstChild) {
        node.appendChild(wrap(firstChild));
      }
    }
    var oldIe = /MSIE/.test(navigator.userAgent);
    var OriginalHTMLElement = window.HTMLElement;
    var OriginalHTMLTemplateElement = window.HTMLTemplateElement;
    function HTMLElement(node) {
      Element.call(this, node);
    }
    HTMLElement.prototype = Object.create(Element.prototype);
    mixin(HTMLElement.prototype, {
      get innerHTML() {
        return getInnerHTML(this);
      },
      set innerHTML(value) {
        if (oldIe && plaintextParents[this.localName]) {
          this.textContent = value;
          return;
        }
        var removedNodes = snapshotNodeList(this.childNodes);
        if (this.invalidateShadowRenderer()) {
          if (this instanceof wrappers.HTMLTemplateElement) setInnerHTML(this.content, value); else setInnerHTML(this, value, this.tagName);
        } else if (!OriginalHTMLTemplateElement && this instanceof wrappers.HTMLTemplateElement) {
          setInnerHTML(this.content, value);
        } else {
          unsafeUnwrap(this).innerHTML = value;
        }
        var addedNodes = snapshotNodeList(this.childNodes);
        enqueueMutation(this, "childList", {
          addedNodes: addedNodes,
          removedNodes: removedNodes
        });
        nodesWereRemoved(removedNodes);
        nodesWereAdded(addedNodes, this);
      },
      get outerHTML() {
        return getOuterHTML(this, this.parentNode);
      },
      set outerHTML(value) {
        var p = this.parentNode;
        if (p) {
          p.invalidateShadowRenderer();
          var df = frag(p, value);
          p.replaceChild(df, this);
        }
      },
      insertAdjacentHTML: function(position, text) {
        var contextElement, refNode;
        switch (String(position).toLowerCase()) {
         case "beforebegin":
          contextElement = this.parentNode;
          refNode = this;
          break;

         case "afterend":
          contextElement = this.parentNode;
          refNode = this.nextSibling;
          break;

         case "afterbegin":
          contextElement = this;
          refNode = this.firstChild;
          break;

         case "beforeend":
          contextElement = this;
          refNode = null;
          break;

         default:
          return;
        }
        var df = frag(contextElement, text);
        contextElement.insertBefore(df, refNode);
      },
      get hidden() {
        return this.hasAttribute("hidden");
      },
      set hidden(v) {
        if (v) {
          this.setAttribute("hidden", "");
        } else {
          this.removeAttribute("hidden");
        }
      }
    });
    function frag(contextElement, html) {
      var p = unwrap(contextElement.cloneNode(false));
      p.innerHTML = html;
      var df = unwrap(document.createDocumentFragment());
      var c;
      while (c = p.firstChild) {
        df.appendChild(c);
      }
      return wrap(df);
    }
    function getter(name) {
      return function() {
        scope.renderAllPending();
        return unsafeUnwrap(this)[name];
      };
    }
    function getterRequiresRendering(name) {
      defineGetter(HTMLElement, name, getter(name));
    }
    [ "clientHeight", "clientLeft", "clientTop", "clientWidth", "offsetHeight", "offsetLeft", "offsetTop", "offsetWidth", "scrollHeight", "scrollWidth" ].forEach(getterRequiresRendering);
    function getterAndSetterRequiresRendering(name) {
      Object.defineProperty(HTMLElement.prototype, name, {
        get: getter(name),
        set: function(v) {
          scope.renderAllPending();
          unsafeUnwrap(this)[name] = v;
        },
        configurable: true,
        enumerable: true
      });
    }
    [ "scrollLeft", "scrollTop" ].forEach(getterAndSetterRequiresRendering);
    function methodRequiresRendering(name) {
      Object.defineProperty(HTMLElement.prototype, name, {
        value: function() {
          scope.renderAllPending();
          return unsafeUnwrap(this)[name].apply(unsafeUnwrap(this), arguments);
        },
        configurable: true,
        enumerable: true
      });
    }
    [ "getBoundingClientRect", "getClientRects", "scrollIntoView" ].forEach(methodRequiresRendering);
    registerWrapper(OriginalHTMLElement, HTMLElement, document.createElement("b"));
    scope.wrappers.HTMLElement = HTMLElement;
    scope.getInnerHTML = getInnerHTML;
    scope.setInnerHTML = setInnerHTML;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var wrap = scope.wrap;
    var OriginalHTMLCanvasElement = window.HTMLCanvasElement;
    function HTMLCanvasElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLCanvasElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLCanvasElement.prototype, {
      getContext: function() {
        var context = unsafeUnwrap(this).getContext.apply(unsafeUnwrap(this), arguments);
        return context && wrap(context);
      }
    });
    registerWrapper(OriginalHTMLCanvasElement, HTMLCanvasElement, document.createElement("canvas"));
    scope.wrappers.HTMLCanvasElement = HTMLCanvasElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var OriginalHTMLContentElement = window.HTMLContentElement;
    function HTMLContentElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLContentElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLContentElement.prototype, {
      constructor: HTMLContentElement,
      get select() {
        return this.getAttribute("select");
      },
      set select(value) {
        this.setAttribute("select", value);
      },
      setAttribute: function(n, v) {
        HTMLElement.prototype.setAttribute.call(this, n, v);
        if (String(n).toLowerCase() === "select") this.invalidateShadowRenderer(true);
      }
    });
    if (OriginalHTMLContentElement) registerWrapper(OriginalHTMLContentElement, HTMLContentElement);
    scope.wrappers.HTMLContentElement = HTMLContentElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var wrapHTMLCollection = scope.wrapHTMLCollection;
    var unwrap = scope.unwrap;
    var OriginalHTMLFormElement = window.HTMLFormElement;
    function HTMLFormElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLFormElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLFormElement.prototype, {
      get elements() {
        return wrapHTMLCollection(unwrap(this).elements);
      }
    });
    registerWrapper(OriginalHTMLFormElement, HTMLFormElement, document.createElement("form"));
    scope.wrappers.HTMLFormElement = HTMLFormElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var registerWrapper = scope.registerWrapper;
    var unwrap = scope.unwrap;
    var rewrap = scope.rewrap;
    var OriginalHTMLImageElement = window.HTMLImageElement;
    function HTMLImageElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLImageElement.prototype = Object.create(HTMLElement.prototype);
    registerWrapper(OriginalHTMLImageElement, HTMLImageElement, document.createElement("img"));
    function Image(width, height) {
      if (!(this instanceof Image)) {
        throw new TypeError("DOM object constructor cannot be called as a function.");
      }
      var node = unwrap(document.createElement("img"));
      HTMLElement.call(this, node);
      rewrap(node, this);
      if (width !== undefined) node.width = width;
      if (height !== undefined) node.height = height;
    }
    Image.prototype = HTMLImageElement.prototype;
    scope.wrappers.HTMLImageElement = HTMLImageElement;
    scope.wrappers.Image = Image;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var NodeList = scope.wrappers.NodeList;
    var registerWrapper = scope.registerWrapper;
    var OriginalHTMLShadowElement = window.HTMLShadowElement;
    function HTMLShadowElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLShadowElement.prototype = Object.create(HTMLElement.prototype);
    HTMLShadowElement.prototype.constructor = HTMLShadowElement;
    if (OriginalHTMLShadowElement) registerWrapper(OriginalHTMLShadowElement, HTMLShadowElement);
    scope.wrappers.HTMLShadowElement = HTMLShadowElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var contentTable = new WeakMap();
    var templateContentsOwnerTable = new WeakMap();
    function getTemplateContentsOwner(doc) {
      if (!doc.defaultView) return doc;
      var d = templateContentsOwnerTable.get(doc);
      if (!d) {
        d = doc.implementation.createHTMLDocument("");
        while (d.lastChild) {
          d.removeChild(d.lastChild);
        }
        templateContentsOwnerTable.set(doc, d);
      }
      return d;
    }
    function extractContent(templateElement) {
      var doc = getTemplateContentsOwner(templateElement.ownerDocument);
      var df = unwrap(doc.createDocumentFragment());
      var child;
      while (child = templateElement.firstChild) {
        df.appendChild(child);
      }
      return df;
    }
    var OriginalHTMLTemplateElement = window.HTMLTemplateElement;
    function HTMLTemplateElement(node) {
      HTMLElement.call(this, node);
      if (!OriginalHTMLTemplateElement) {
        var content = extractContent(node);
        contentTable.set(this, wrap(content));
      }
    }
    HTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLTemplateElement.prototype, {
      constructor: HTMLTemplateElement,
      get content() {
        if (OriginalHTMLTemplateElement) return wrap(unsafeUnwrap(this).content);
        return contentTable.get(this);
      }
    });
    if (OriginalHTMLTemplateElement) registerWrapper(OriginalHTMLTemplateElement, HTMLTemplateElement);
    scope.wrappers.HTMLTemplateElement = HTMLTemplateElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var registerWrapper = scope.registerWrapper;
    var OriginalHTMLMediaElement = window.HTMLMediaElement;
    if (!OriginalHTMLMediaElement) return;
    function HTMLMediaElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLMediaElement.prototype = Object.create(HTMLElement.prototype);
    registerWrapper(OriginalHTMLMediaElement, HTMLMediaElement, document.createElement("audio"));
    scope.wrappers.HTMLMediaElement = HTMLMediaElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLMediaElement = scope.wrappers.HTMLMediaElement;
    var registerWrapper = scope.registerWrapper;
    var unwrap = scope.unwrap;
    var rewrap = scope.rewrap;
    var OriginalHTMLAudioElement = window.HTMLAudioElement;
    if (!OriginalHTMLAudioElement) return;
    function HTMLAudioElement(node) {
      HTMLMediaElement.call(this, node);
    }
    HTMLAudioElement.prototype = Object.create(HTMLMediaElement.prototype);
    registerWrapper(OriginalHTMLAudioElement, HTMLAudioElement, document.createElement("audio"));
    function Audio(src) {
      if (!(this instanceof Audio)) {
        throw new TypeError("DOM object constructor cannot be called as a function.");
      }
      var node = unwrap(document.createElement("audio"));
      HTMLMediaElement.call(this, node);
      rewrap(node, this);
      node.setAttribute("preload", "auto");
      if (src !== undefined) node.setAttribute("src", src);
    }
    Audio.prototype = HTMLAudioElement.prototype;
    scope.wrappers.HTMLAudioElement = HTMLAudioElement;
    scope.wrappers.Audio = Audio;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var rewrap = scope.rewrap;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var OriginalHTMLOptionElement = window.HTMLOptionElement;
    function trimText(s) {
      return s.replace(/\s+/g, " ").trim();
    }
    function HTMLOptionElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLOptionElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLOptionElement.prototype, {
      get text() {
        return trimText(this.textContent);
      },
      set text(value) {
        this.textContent = trimText(String(value));
      },
      get form() {
        return wrap(unwrap(this).form);
      }
    });
    registerWrapper(OriginalHTMLOptionElement, HTMLOptionElement, document.createElement("option"));
    function Option(text, value, defaultSelected, selected) {
      if (!(this instanceof Option)) {
        throw new TypeError("DOM object constructor cannot be called as a function.");
      }
      var node = unwrap(document.createElement("option"));
      HTMLElement.call(this, node);
      rewrap(node, this);
      if (text !== undefined) node.text = text;
      if (value !== undefined) node.setAttribute("value", value);
      if (defaultSelected === true) node.setAttribute("selected", "");
      node.selected = selected === true;
    }
    Option.prototype = HTMLOptionElement.prototype;
    scope.wrappers.HTMLOptionElement = HTMLOptionElement;
    scope.wrappers.Option = Option;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var OriginalHTMLSelectElement = window.HTMLSelectElement;
    function HTMLSelectElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLSelectElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLSelectElement.prototype, {
      add: function(element, before) {
        if (typeof before === "object") before = unwrap(before);
        unwrap(this).add(unwrap(element), before);
      },
      remove: function(indexOrNode) {
        if (indexOrNode === undefined) {
          HTMLElement.prototype.remove.call(this);
          return;
        }
        if (typeof indexOrNode === "object") indexOrNode = unwrap(indexOrNode);
        unwrap(this).remove(indexOrNode);
      },
      get form() {
        return wrap(unwrap(this).form);
      }
    });
    registerWrapper(OriginalHTMLSelectElement, HTMLSelectElement, document.createElement("select"));
    scope.wrappers.HTMLSelectElement = HTMLSelectElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var wrapHTMLCollection = scope.wrapHTMLCollection;
    var OriginalHTMLTableElement = window.HTMLTableElement;
    function HTMLTableElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLTableElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLTableElement.prototype, {
      get caption() {
        return wrap(unwrap(this).caption);
      },
      createCaption: function() {
        return wrap(unwrap(this).createCaption());
      },
      get tHead() {
        return wrap(unwrap(this).tHead);
      },
      createTHead: function() {
        return wrap(unwrap(this).createTHead());
      },
      createTFoot: function() {
        return wrap(unwrap(this).createTFoot());
      },
      get tFoot() {
        return wrap(unwrap(this).tFoot);
      },
      get tBodies() {
        return wrapHTMLCollection(unwrap(this).tBodies);
      },
      createTBody: function() {
        return wrap(unwrap(this).createTBody());
      },
      get rows() {
        return wrapHTMLCollection(unwrap(this).rows);
      },
      insertRow: function(index) {
        return wrap(unwrap(this).insertRow(index));
      }
    });
    registerWrapper(OriginalHTMLTableElement, HTMLTableElement, document.createElement("table"));
    scope.wrappers.HTMLTableElement = HTMLTableElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var wrapHTMLCollection = scope.wrapHTMLCollection;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var OriginalHTMLTableSectionElement = window.HTMLTableSectionElement;
    function HTMLTableSectionElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLTableSectionElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLTableSectionElement.prototype, {
      constructor: HTMLTableSectionElement,
      get rows() {
        return wrapHTMLCollection(unwrap(this).rows);
      },
      insertRow: function(index) {
        return wrap(unwrap(this).insertRow(index));
      }
    });
    registerWrapper(OriginalHTMLTableSectionElement, HTMLTableSectionElement, document.createElement("thead"));
    scope.wrappers.HTMLTableSectionElement = HTMLTableSectionElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var wrapHTMLCollection = scope.wrapHTMLCollection;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var OriginalHTMLTableRowElement = window.HTMLTableRowElement;
    function HTMLTableRowElement(node) {
      HTMLElement.call(this, node);
    }
    HTMLTableRowElement.prototype = Object.create(HTMLElement.prototype);
    mixin(HTMLTableRowElement.prototype, {
      get cells() {
        return wrapHTMLCollection(unwrap(this).cells);
      },
      insertCell: function(index) {
        return wrap(unwrap(this).insertCell(index));
      }
    });
    registerWrapper(OriginalHTMLTableRowElement, HTMLTableRowElement, document.createElement("tr"));
    scope.wrappers.HTMLTableRowElement = HTMLTableRowElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLContentElement = scope.wrappers.HTMLContentElement;
    var HTMLElement = scope.wrappers.HTMLElement;
    var HTMLShadowElement = scope.wrappers.HTMLShadowElement;
    var HTMLTemplateElement = scope.wrappers.HTMLTemplateElement;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var OriginalHTMLUnknownElement = window.HTMLUnknownElement;
    function HTMLUnknownElement(node) {
      switch (node.localName) {
       case "content":
        return new HTMLContentElement(node);

       case "shadow":
        return new HTMLShadowElement(node);

       case "template":
        return new HTMLTemplateElement(node);
      }
      HTMLElement.call(this, node);
    }
    HTMLUnknownElement.prototype = Object.create(HTMLElement.prototype);
    registerWrapper(OriginalHTMLUnknownElement, HTMLUnknownElement);
    scope.wrappers.HTMLUnknownElement = HTMLUnknownElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var Element = scope.wrappers.Element;
    var HTMLElement = scope.wrappers.HTMLElement;
    var registerObject = scope.registerObject;
    var SVG_NS = "http://www.w3.org/2000/svg";
    var svgTitleElement = document.createElementNS(SVG_NS, "title");
    var SVGTitleElement = registerObject(svgTitleElement);
    var SVGElement = Object.getPrototypeOf(SVGTitleElement.prototype).constructor;
    if (!("classList" in svgTitleElement)) {
      var descr = Object.getOwnPropertyDescriptor(Element.prototype, "classList");
      Object.defineProperty(HTMLElement.prototype, "classList", descr);
      delete Element.prototype.classList;
    }
    scope.wrappers.SVGElement = SVGElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var OriginalSVGUseElement = window.SVGUseElement;
    var SVG_NS = "http://www.w3.org/2000/svg";
    var gWrapper = wrap(document.createElementNS(SVG_NS, "g"));
    var useElement = document.createElementNS(SVG_NS, "use");
    var SVGGElement = gWrapper.constructor;
    var parentInterfacePrototype = Object.getPrototypeOf(SVGGElement.prototype);
    var parentInterface = parentInterfacePrototype.constructor;
    function SVGUseElement(impl) {
      parentInterface.call(this, impl);
    }
    SVGUseElement.prototype = Object.create(parentInterfacePrototype);
    if ("instanceRoot" in useElement) {
      mixin(SVGUseElement.prototype, {
        get instanceRoot() {
          return wrap(unwrap(this).instanceRoot);
        },
        get animatedInstanceRoot() {
          return wrap(unwrap(this).animatedInstanceRoot);
        }
      });
    }
    registerWrapper(OriginalSVGUseElement, SVGUseElement, useElement);
    scope.wrappers.SVGUseElement = SVGUseElement;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var EventTarget = scope.wrappers.EventTarget;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var wrap = scope.wrap;
    var OriginalSVGElementInstance = window.SVGElementInstance;
    if (!OriginalSVGElementInstance) return;
    function SVGElementInstance(impl) {
      EventTarget.call(this, impl);
    }
    SVGElementInstance.prototype = Object.create(EventTarget.prototype);
    mixin(SVGElementInstance.prototype, {
      get correspondingElement() {
        return wrap(unsafeUnwrap(this).correspondingElement);
      },
      get correspondingUseElement() {
        return wrap(unsafeUnwrap(this).correspondingUseElement);
      },
      get parentNode() {
        return wrap(unsafeUnwrap(this).parentNode);
      },
      get childNodes() {
        throw new Error("Not implemented");
      },
      get firstChild() {
        return wrap(unsafeUnwrap(this).firstChild);
      },
      get lastChild() {
        return wrap(unsafeUnwrap(this).lastChild);
      },
      get previousSibling() {
        return wrap(unsafeUnwrap(this).previousSibling);
      },
      get nextSibling() {
        return wrap(unsafeUnwrap(this).nextSibling);
      }
    });
    registerWrapper(OriginalSVGElementInstance, SVGElementInstance);
    scope.wrappers.SVGElementInstance = SVGElementInstance;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var wrap = scope.wrap;
    var OriginalCanvasRenderingContext2D = window.CanvasRenderingContext2D;
    function CanvasRenderingContext2D(impl) {
      setWrapper(impl, this);
    }
    mixin(CanvasRenderingContext2D.prototype, {
      get canvas() {
        return wrap(unsafeUnwrap(this).canvas);
      },
      drawImage: function() {
        arguments[0] = unwrapIfNeeded(arguments[0]);
        unsafeUnwrap(this).drawImage.apply(unsafeUnwrap(this), arguments);
      },
      createPattern: function() {
        arguments[0] = unwrap(arguments[0]);
        return unsafeUnwrap(this).createPattern.apply(unsafeUnwrap(this), arguments);
      }
    });
    registerWrapper(OriginalCanvasRenderingContext2D, CanvasRenderingContext2D, document.createElement("canvas").getContext("2d"));
    scope.wrappers.CanvasRenderingContext2D = CanvasRenderingContext2D;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var wrap = scope.wrap;
    var OriginalWebGLRenderingContext = window.WebGLRenderingContext;
    if (!OriginalWebGLRenderingContext) return;
    function WebGLRenderingContext(impl) {
      setWrapper(impl, this);
    }
    mixin(WebGLRenderingContext.prototype, {
      get canvas() {
        return wrap(unsafeUnwrap(this).canvas);
      },
      texImage2D: function() {
        arguments[5] = unwrapIfNeeded(arguments[5]);
        unsafeUnwrap(this).texImage2D.apply(unsafeUnwrap(this), arguments);
      },
      texSubImage2D: function() {
        arguments[6] = unwrapIfNeeded(arguments[6]);
        unsafeUnwrap(this).texSubImage2D.apply(unsafeUnwrap(this), arguments);
      }
    });
    var instanceProperties = /WebKit/.test(navigator.userAgent) ? {
      drawingBufferHeight: null,
      drawingBufferWidth: null
    } : {};
    registerWrapper(OriginalWebGLRenderingContext, WebGLRenderingContext, instanceProperties);
    scope.wrappers.WebGLRenderingContext = WebGLRenderingContext;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var wrap = scope.wrap;
    var OriginalRange = window.Range;
    function Range(impl) {
      setWrapper(impl, this);
    }
    Range.prototype = {
      get startContainer() {
        return wrap(unsafeUnwrap(this).startContainer);
      },
      get endContainer() {
        return wrap(unsafeUnwrap(this).endContainer);
      },
      get commonAncestorContainer() {
        return wrap(unsafeUnwrap(this).commonAncestorContainer);
      },
      setStart: function(refNode, offset) {
        unsafeUnwrap(this).setStart(unwrapIfNeeded(refNode), offset);
      },
      setEnd: function(refNode, offset) {
        unsafeUnwrap(this).setEnd(unwrapIfNeeded(refNode), offset);
      },
      setStartBefore: function(refNode) {
        unsafeUnwrap(this).setStartBefore(unwrapIfNeeded(refNode));
      },
      setStartAfter: function(refNode) {
        unsafeUnwrap(this).setStartAfter(unwrapIfNeeded(refNode));
      },
      setEndBefore: function(refNode) {
        unsafeUnwrap(this).setEndBefore(unwrapIfNeeded(refNode));
      },
      setEndAfter: function(refNode) {
        unsafeUnwrap(this).setEndAfter(unwrapIfNeeded(refNode));
      },
      selectNode: function(refNode) {
        unsafeUnwrap(this).selectNode(unwrapIfNeeded(refNode));
      },
      selectNodeContents: function(refNode) {
        unsafeUnwrap(this).selectNodeContents(unwrapIfNeeded(refNode));
      },
      compareBoundaryPoints: function(how, sourceRange) {
        return unsafeUnwrap(this).compareBoundaryPoints(how, unwrap(sourceRange));
      },
      extractContents: function() {
        return wrap(unsafeUnwrap(this).extractContents());
      },
      cloneContents: function() {
        return wrap(unsafeUnwrap(this).cloneContents());
      },
      insertNode: function(node) {
        unsafeUnwrap(this).insertNode(unwrapIfNeeded(node));
      },
      surroundContents: function(newParent) {
        unsafeUnwrap(this).surroundContents(unwrapIfNeeded(newParent));
      },
      cloneRange: function() {
        return wrap(unsafeUnwrap(this).cloneRange());
      },
      isPointInRange: function(node, offset) {
        return unsafeUnwrap(this).isPointInRange(unwrapIfNeeded(node), offset);
      },
      comparePoint: function(node, offset) {
        return unsafeUnwrap(this).comparePoint(unwrapIfNeeded(node), offset);
      },
      intersectsNode: function(node) {
        return unsafeUnwrap(this).intersectsNode(unwrapIfNeeded(node));
      },
      toString: function() {
        return unsafeUnwrap(this).toString();
      }
    };
    if (OriginalRange.prototype.createContextualFragment) {
      Range.prototype.createContextualFragment = function(html) {
        return wrap(unsafeUnwrap(this).createContextualFragment(html));
      };
    }
    registerWrapper(window.Range, Range, document.createRange());
    scope.wrappers.Range = Range;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var GetElementsByInterface = scope.GetElementsByInterface;
    var ParentNodeInterface = scope.ParentNodeInterface;
    var SelectorsInterface = scope.SelectorsInterface;
    var mixin = scope.mixin;
    var registerObject = scope.registerObject;
    var DocumentFragment = registerObject(document.createDocumentFragment());
    mixin(DocumentFragment.prototype, ParentNodeInterface);
    mixin(DocumentFragment.prototype, SelectorsInterface);
    mixin(DocumentFragment.prototype, GetElementsByInterface);
    var Comment = registerObject(document.createComment(""));
    scope.wrappers.Comment = Comment;
    scope.wrappers.DocumentFragment = DocumentFragment;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var DocumentFragment = scope.wrappers.DocumentFragment;
    var TreeScope = scope.TreeScope;
    var elementFromPoint = scope.elementFromPoint;
    var getInnerHTML = scope.getInnerHTML;
    var getTreeScope = scope.getTreeScope;
    var mixin = scope.mixin;
    var rewrap = scope.rewrap;
    var setInnerHTML = scope.setInnerHTML;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var shadowHostTable = new WeakMap();
    var nextOlderShadowTreeTable = new WeakMap();
    var spaceCharRe = /[ \t\n\r\f]/;
    function ShadowRoot(hostWrapper) {
      var node = unwrap(unsafeUnwrap(hostWrapper).ownerDocument.createDocumentFragment());
      DocumentFragment.call(this, node);
      rewrap(node, this);
      var oldShadowRoot = hostWrapper.shadowRoot;
      nextOlderShadowTreeTable.set(this, oldShadowRoot);
      this.treeScope_ = new TreeScope(this, getTreeScope(oldShadowRoot || hostWrapper));
      shadowHostTable.set(this, hostWrapper);
    }
    ShadowRoot.prototype = Object.create(DocumentFragment.prototype);
    mixin(ShadowRoot.prototype, {
      constructor: ShadowRoot,
      get innerHTML() {
        return getInnerHTML(this);
      },
      set innerHTML(value) {
        setInnerHTML(this, value);
        this.invalidateShadowRenderer();
      },
      get olderShadowRoot() {
        return nextOlderShadowTreeTable.get(this) || null;
      },
      get host() {
        return shadowHostTable.get(this) || null;
      },
      invalidateShadowRenderer: function() {
        return shadowHostTable.get(this).invalidateShadowRenderer();
      },
      elementFromPoint: function(x, y) {
        return elementFromPoint(this, this.ownerDocument, x, y);
      },
      getElementById: function(id) {
        if (spaceCharRe.test(id)) return null;
        return this.querySelector('[id="' + id + '"]');
      }
    });
    scope.wrappers.ShadowRoot = ShadowRoot;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var Element = scope.wrappers.Element;
    var HTMLContentElement = scope.wrappers.HTMLContentElement;
    var HTMLShadowElement = scope.wrappers.HTMLShadowElement;
    var Node = scope.wrappers.Node;
    var ShadowRoot = scope.wrappers.ShadowRoot;
    var assert = scope.assert;
    var getTreeScope = scope.getTreeScope;
    var mixin = scope.mixin;
    var oneOf = scope.oneOf;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var ArraySplice = scope.ArraySplice;
    function updateWrapperUpAndSideways(wrapper) {
      wrapper.previousSibling_ = wrapper.previousSibling;
      wrapper.nextSibling_ = wrapper.nextSibling;
      wrapper.parentNode_ = wrapper.parentNode;
    }
    function updateWrapperDown(wrapper) {
      wrapper.firstChild_ = wrapper.firstChild;
      wrapper.lastChild_ = wrapper.lastChild;
    }
    function updateAllChildNodes(parentNodeWrapper) {
      assert(parentNodeWrapper instanceof Node);
      for (var childWrapper = parentNodeWrapper.firstChild; childWrapper; childWrapper = childWrapper.nextSibling) {
        updateWrapperUpAndSideways(childWrapper);
      }
      updateWrapperDown(parentNodeWrapper);
    }
    function insertBefore(parentNodeWrapper, newChildWrapper, refChildWrapper) {
      var parentNode = unwrap(parentNodeWrapper);
      var newChild = unwrap(newChildWrapper);
      var refChild = refChildWrapper ? unwrap(refChildWrapper) : null;
      remove(newChildWrapper);
      updateWrapperUpAndSideways(newChildWrapper);
      if (!refChildWrapper) {
        parentNodeWrapper.lastChild_ = parentNodeWrapper.lastChild;
        if (parentNodeWrapper.lastChild === parentNodeWrapper.firstChild) parentNodeWrapper.firstChild_ = parentNodeWrapper.firstChild;
        var lastChildWrapper = wrap(parentNode.lastChild);
        if (lastChildWrapper) lastChildWrapper.nextSibling_ = lastChildWrapper.nextSibling;
      } else {
        if (parentNodeWrapper.firstChild === refChildWrapper) parentNodeWrapper.firstChild_ = refChildWrapper;
        refChildWrapper.previousSibling_ = refChildWrapper.previousSibling;
      }
      scope.originalInsertBefore.call(parentNode, newChild, refChild);
    }
    function remove(nodeWrapper) {
      var node = unwrap(nodeWrapper);
      var parentNode = node.parentNode;
      if (!parentNode) return;
      var parentNodeWrapper = wrap(parentNode);
      updateWrapperUpAndSideways(nodeWrapper);
      if (nodeWrapper.previousSibling) nodeWrapper.previousSibling.nextSibling_ = nodeWrapper;
      if (nodeWrapper.nextSibling) nodeWrapper.nextSibling.previousSibling_ = nodeWrapper;
      if (parentNodeWrapper.lastChild === nodeWrapper) parentNodeWrapper.lastChild_ = nodeWrapper;
      if (parentNodeWrapper.firstChild === nodeWrapper) parentNodeWrapper.firstChild_ = nodeWrapper;
      scope.originalRemoveChild.call(parentNode, node);
    }
    var distributedNodesTable = new WeakMap();
    var destinationInsertionPointsTable = new WeakMap();
    var rendererForHostTable = new WeakMap();
    function resetDistributedNodes(insertionPoint) {
      distributedNodesTable.set(insertionPoint, []);
    }
    function getDistributedNodes(insertionPoint) {
      var rv = distributedNodesTable.get(insertionPoint);
      if (!rv) distributedNodesTable.set(insertionPoint, rv = []);
      return rv;
    }
    function getChildNodesSnapshot(node) {
      var result = [], i = 0;
      for (var child = node.firstChild; child; child = child.nextSibling) {
        result[i++] = child;
      }
      return result;
    }
    var request = oneOf(window, [ "requestAnimationFrame", "mozRequestAnimationFrame", "webkitRequestAnimationFrame", "setTimeout" ]);
    var pendingDirtyRenderers = [];
    var renderTimer;
    function renderAllPending() {
      for (var i = 0; i < pendingDirtyRenderers.length; i++) {
        var renderer = pendingDirtyRenderers[i];
        var parentRenderer = renderer.parentRenderer;
        if (parentRenderer && parentRenderer.dirty) continue;
        renderer.render();
      }
      pendingDirtyRenderers = [];
    }
    function handleRequestAnimationFrame() {
      renderTimer = null;
      renderAllPending();
    }
    function getRendererForHost(host) {
      var renderer = rendererForHostTable.get(host);
      if (!renderer) {
        renderer = new ShadowRenderer(host);
        rendererForHostTable.set(host, renderer);
      }
      return renderer;
    }
    function getShadowRootAncestor(node) {
      var root = getTreeScope(node).root;
      if (root instanceof ShadowRoot) return root;
      return null;
    }
    function getRendererForShadowRoot(shadowRoot) {
      return getRendererForHost(shadowRoot.host);
    }
    var spliceDiff = new ArraySplice();
    spliceDiff.equals = function(renderNode, rawNode) {
      return unwrap(renderNode.node) === rawNode;
    };
    function RenderNode(node) {
      this.skip = false;
      this.node = node;
      this.childNodes = [];
    }
    RenderNode.prototype = {
      append: function(node) {
        var rv = new RenderNode(node);
        this.childNodes.push(rv);
        return rv;
      },
      sync: function(opt_added) {
        if (this.skip) return;
        var nodeWrapper = this.node;
        var newChildren = this.childNodes;
        var oldChildren = getChildNodesSnapshot(unwrap(nodeWrapper));
        var added = opt_added || new WeakMap();
        var splices = spliceDiff.calculateSplices(newChildren, oldChildren);
        var newIndex = 0, oldIndex = 0;
        var lastIndex = 0;
        for (var i = 0; i < splices.length; i++) {
          var splice = splices[i];
          for (;lastIndex < splice.index; lastIndex++) {
            oldIndex++;
            newChildren[newIndex++].sync(added);
          }
          var removedCount = splice.removed.length;
          for (var j = 0; j < removedCount; j++) {
            var wrapper = wrap(oldChildren[oldIndex++]);
            if (!added.get(wrapper)) remove(wrapper);
          }
          var addedCount = splice.addedCount;
          var refNode = oldChildren[oldIndex] && wrap(oldChildren[oldIndex]);
          for (var j = 0; j < addedCount; j++) {
            var newChildRenderNode = newChildren[newIndex++];
            var newChildWrapper = newChildRenderNode.node;
            insertBefore(nodeWrapper, newChildWrapper, refNode);
            added.set(newChildWrapper, true);
            newChildRenderNode.sync(added);
          }
          lastIndex += addedCount;
        }
        for (var i = lastIndex; i < newChildren.length; i++) {
          newChildren[i].sync(added);
        }
      }
    };
    function ShadowRenderer(host) {
      this.host = host;
      this.dirty = false;
      this.invalidateAttributes();
      this.associateNode(host);
    }
    ShadowRenderer.prototype = {
      render: function(opt_renderNode) {
        if (!this.dirty) return;
        this.invalidateAttributes();
        var host = this.host;
        this.distribution(host);
        var renderNode = opt_renderNode || new RenderNode(host);
        this.buildRenderTree(renderNode, host);
        var topMostRenderer = !opt_renderNode;
        if (topMostRenderer) renderNode.sync();
        this.dirty = false;
      },
      get parentRenderer() {
        return getTreeScope(this.host).renderer;
      },
      invalidate: function() {
        if (!this.dirty) {
          this.dirty = true;
          var parentRenderer = this.parentRenderer;
          if (parentRenderer) parentRenderer.invalidate();
          pendingDirtyRenderers.push(this);
          if (renderTimer) return;
          renderTimer = window[request](handleRequestAnimationFrame, 0);
        }
      },
      distribution: function(root) {
        this.resetAllSubtrees(root);
        this.distributionResolution(root);
      },
      resetAll: function(node) {
        if (isInsertionPoint(node)) resetDistributedNodes(node); else resetDestinationInsertionPoints(node);
        this.resetAllSubtrees(node);
      },
      resetAllSubtrees: function(node) {
        for (var child = node.firstChild; child; child = child.nextSibling) {
          this.resetAll(child);
        }
        if (node.shadowRoot) this.resetAll(node.shadowRoot);
        if (node.olderShadowRoot) this.resetAll(node.olderShadowRoot);
      },
      distributionResolution: function(node) {
        if (isShadowHost(node)) {
          var shadowHost = node;
          var pool = poolPopulation(shadowHost);
          var shadowTrees = getShadowTrees(shadowHost);
          for (var i = 0; i < shadowTrees.length; i++) {
            this.poolDistribution(shadowTrees[i], pool);
          }
          for (var i = shadowTrees.length - 1; i >= 0; i--) {
            var shadowTree = shadowTrees[i];
            var shadow = getShadowInsertionPoint(shadowTree);
            if (shadow) {
              var olderShadowRoot = shadowTree.olderShadowRoot;
              if (olderShadowRoot) {
                pool = poolPopulation(olderShadowRoot);
              }
              for (var j = 0; j < pool.length; j++) {
                destributeNodeInto(pool[j], shadow);
              }
            }
            this.distributionResolution(shadowTree);
          }
        }
        for (var child = node.firstChild; child; child = child.nextSibling) {
          this.distributionResolution(child);
        }
      },
      poolDistribution: function(node, pool) {
        if (node instanceof HTMLShadowElement) return;
        if (node instanceof HTMLContentElement) {
          var content = node;
          this.updateDependentAttributes(content.getAttribute("select"));
          var anyDistributed = false;
          for (var i = 0; i < pool.length; i++) {
            var node = pool[i];
            if (!node) continue;
            if (matches(node, content)) {
              destributeNodeInto(node, content);
              pool[i] = undefined;
              anyDistributed = true;
            }
          }
          if (!anyDistributed) {
            for (var child = content.firstChild; child; child = child.nextSibling) {
              destributeNodeInto(child, content);
            }
          }
          return;
        }
        for (var child = node.firstChild; child; child = child.nextSibling) {
          this.poolDistribution(child, pool);
        }
      },
      buildRenderTree: function(renderNode, node) {
        var children = this.compose(node);
        for (var i = 0; i < children.length; i++) {
          var child = children[i];
          var childRenderNode = renderNode.append(child);
          this.buildRenderTree(childRenderNode, child);
        }
        if (isShadowHost(node)) {
          var renderer = getRendererForHost(node);
          renderer.dirty = false;
        }
      },
      compose: function(node) {
        var children = [];
        var p = node.shadowRoot || node;
        for (var child = p.firstChild; child; child = child.nextSibling) {
          if (isInsertionPoint(child)) {
            this.associateNode(p);
            var distributedNodes = getDistributedNodes(child);
            for (var j = 0; j < distributedNodes.length; j++) {
              var distributedNode = distributedNodes[j];
              if (isFinalDestination(child, distributedNode)) children.push(distributedNode);
            }
          } else {
            children.push(child);
          }
        }
        return children;
      },
      invalidateAttributes: function() {
        this.attributes = Object.create(null);
      },
      updateDependentAttributes: function(selector) {
        if (!selector) return;
        var attributes = this.attributes;
        if (/\.\w+/.test(selector)) attributes["class"] = true;
        if (/#\w+/.test(selector)) attributes["id"] = true;
        selector.replace(/\[\s*([^\s=\|~\]]+)/g, function(_, name) {
          attributes[name] = true;
        });
      },
      dependsOnAttribute: function(name) {
        return this.attributes[name];
      },
      associateNode: function(node) {
        unsafeUnwrap(node).polymerShadowRenderer_ = this;
      }
    };
    function poolPopulation(node) {
      var pool = [];
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (isInsertionPoint(child)) {
          pool.push.apply(pool, getDistributedNodes(child));
        } else {
          pool.push(child);
        }
      }
      return pool;
    }
    function getShadowInsertionPoint(node) {
      if (node instanceof HTMLShadowElement) return node;
      if (node instanceof HTMLContentElement) return null;
      for (var child = node.firstChild; child; child = child.nextSibling) {
        var res = getShadowInsertionPoint(child);
        if (res) return res;
      }
      return null;
    }
    function destributeNodeInto(child, insertionPoint) {
      getDistributedNodes(insertionPoint).push(child);
      var points = destinationInsertionPointsTable.get(child);
      if (!points) destinationInsertionPointsTable.set(child, [ insertionPoint ]); else points.push(insertionPoint);
    }
    function getDestinationInsertionPoints(node) {
      return destinationInsertionPointsTable.get(node);
    }
    function resetDestinationInsertionPoints(node) {
      destinationInsertionPointsTable.set(node, undefined);
    }
    var selectorStartCharRe = /^(:not\()?[*.#[a-zA-Z_|]/;
    function matches(node, contentElement) {
      var select = contentElement.getAttribute("select");
      if (!select) return true;
      select = select.trim();
      if (!select) return true;
      if (!(node instanceof Element)) return false;
      if (!selectorStartCharRe.test(select)) return false;
      try {
        return node.matches(select);
      } catch (ex) {
        return false;
      }
    }
    function isFinalDestination(insertionPoint, node) {
      var points = getDestinationInsertionPoints(node);
      return points && points[points.length - 1] === insertionPoint;
    }
    function isInsertionPoint(node) {
      return node instanceof HTMLContentElement || node instanceof HTMLShadowElement;
    }
    function isShadowHost(shadowHost) {
      return shadowHost.shadowRoot;
    }
    function getShadowTrees(host) {
      var trees = [];
      for (var tree = host.shadowRoot; tree; tree = tree.olderShadowRoot) {
        trees.push(tree);
      }
      return trees;
    }
    function render(host) {
      new ShadowRenderer(host).render();
    }
    Node.prototype.invalidateShadowRenderer = function(force) {
      var renderer = unsafeUnwrap(this).polymerShadowRenderer_;
      if (renderer) {
        renderer.invalidate();
        return true;
      }
      return false;
    };
    HTMLContentElement.prototype.getDistributedNodes = HTMLShadowElement.prototype.getDistributedNodes = function() {
      renderAllPending();
      return getDistributedNodes(this);
    };
    Element.prototype.getDestinationInsertionPoints = function() {
      renderAllPending();
      return getDestinationInsertionPoints(this) || [];
    };
    HTMLContentElement.prototype.nodeIsInserted_ = HTMLShadowElement.prototype.nodeIsInserted_ = function() {
      this.invalidateShadowRenderer();
      var shadowRoot = getShadowRootAncestor(this);
      var renderer;
      if (shadowRoot) renderer = getRendererForShadowRoot(shadowRoot);
      unsafeUnwrap(this).polymerShadowRenderer_ = renderer;
      if (renderer) renderer.invalidate();
    };
    scope.getRendererForHost = getRendererForHost;
    scope.getShadowTrees = getShadowTrees;
    scope.renderAllPending = renderAllPending;
    scope.getDestinationInsertionPoints = getDestinationInsertionPoints;
    scope.visual = {
      insertBefore: insertBefore,
      remove: remove
    };
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var HTMLElement = scope.wrappers.HTMLElement;
    var assert = scope.assert;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var elementsWithFormProperty = [ "HTMLButtonElement", "HTMLFieldSetElement", "HTMLInputElement", "HTMLKeygenElement", "HTMLLabelElement", "HTMLLegendElement", "HTMLObjectElement", "HTMLOutputElement", "HTMLTextAreaElement" ];
    function createWrapperConstructor(name) {
      if (!window[name]) return;
      assert(!scope.wrappers[name]);
      var GeneratedWrapper = function(node) {
        HTMLElement.call(this, node);
      };
      GeneratedWrapper.prototype = Object.create(HTMLElement.prototype);
      mixin(GeneratedWrapper.prototype, {
        get form() {
          return wrap(unwrap(this).form);
        }
      });
      registerWrapper(window[name], GeneratedWrapper, document.createElement(name.slice(4, -7)));
      scope.wrappers[name] = GeneratedWrapper;
    }
    elementsWithFormProperty.forEach(createWrapperConstructor);
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var wrap = scope.wrap;
    var OriginalSelection = window.Selection;
    function Selection(impl) {
      setWrapper(impl, this);
    }
    Selection.prototype = {
      get anchorNode() {
        return wrap(unsafeUnwrap(this).anchorNode);
      },
      get focusNode() {
        return wrap(unsafeUnwrap(this).focusNode);
      },
      addRange: function(range) {
        unsafeUnwrap(this).addRange(unwrap(range));
      },
      collapse: function(node, index) {
        unsafeUnwrap(this).collapse(unwrapIfNeeded(node), index);
      },
      containsNode: function(node, allowPartial) {
        return unsafeUnwrap(this).containsNode(unwrapIfNeeded(node), allowPartial);
      },
      extend: function(node, offset) {
        unsafeUnwrap(this).extend(unwrapIfNeeded(node), offset);
      },
      getRangeAt: function(index) {
        return wrap(unsafeUnwrap(this).getRangeAt(index));
      },
      removeRange: function(range) {
        unsafeUnwrap(this).removeRange(unwrap(range));
      },
      selectAllChildren: function(node) {
        unsafeUnwrap(this).selectAllChildren(unwrapIfNeeded(node));
      },
      toString: function() {
        return unsafeUnwrap(this).toString();
      }
    };
    registerWrapper(window.Selection, Selection, window.getSelection());
    scope.wrappers.Selection = Selection;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var GetElementsByInterface = scope.GetElementsByInterface;
    var Node = scope.wrappers.Node;
    var ParentNodeInterface = scope.ParentNodeInterface;
    var Selection = scope.wrappers.Selection;
    var SelectorsInterface = scope.SelectorsInterface;
    var ShadowRoot = scope.wrappers.ShadowRoot;
    var TreeScope = scope.TreeScope;
    var cloneNode = scope.cloneNode;
    var defineWrapGetter = scope.defineWrapGetter;
    var elementFromPoint = scope.elementFromPoint;
    var forwardMethodsToWrapper = scope.forwardMethodsToWrapper;
    var matchesNames = scope.matchesNames;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var renderAllPending = scope.renderAllPending;
    var rewrap = scope.rewrap;
    var setWrapper = scope.setWrapper;
    var unsafeUnwrap = scope.unsafeUnwrap;
    var unwrap = scope.unwrap;
    var wrap = scope.wrap;
    var wrapEventTargetMethods = scope.wrapEventTargetMethods;
    var wrapNodeList = scope.wrapNodeList;
    var implementationTable = new WeakMap();
    function Document(node) {
      Node.call(this, node);
      this.treeScope_ = new TreeScope(this, null);
    }
    Document.prototype = Object.create(Node.prototype);
    defineWrapGetter(Document, "documentElement");
    defineWrapGetter(Document, "body");
    defineWrapGetter(Document, "head");
    function wrapMethod(name) {
      var original = document[name];
      Document.prototype[name] = function() {
        return wrap(original.apply(unsafeUnwrap(this), arguments));
      };
    }
    [ "createComment", "createDocumentFragment", "createElement", "createElementNS", "createEvent", "createEventNS", "createRange", "createTextNode", "getElementById" ].forEach(wrapMethod);
    var originalAdoptNode = document.adoptNode;
    function adoptNodeNoRemove(node, doc) {
      originalAdoptNode.call(unsafeUnwrap(doc), unwrap(node));
      adoptSubtree(node, doc);
    }
    function adoptSubtree(node, doc) {
      if (node.shadowRoot) doc.adoptNode(node.shadowRoot);
      if (node instanceof ShadowRoot) adoptOlderShadowRoots(node, doc);
      for (var child = node.firstChild; child; child = child.nextSibling) {
        adoptSubtree(child, doc);
      }
    }
    function adoptOlderShadowRoots(shadowRoot, doc) {
      var oldShadowRoot = shadowRoot.olderShadowRoot;
      if (oldShadowRoot) doc.adoptNode(oldShadowRoot);
    }
    var originalGetSelection = document.getSelection;
    mixin(Document.prototype, {
      adoptNode: function(node) {
        if (node.parentNode) node.parentNode.removeChild(node);
        adoptNodeNoRemove(node, this);
        return node;
      },
      elementFromPoint: function(x, y) {
        return elementFromPoint(this, this, x, y);
      },
      importNode: function(node, deep) {
        return cloneNode(node, deep, unsafeUnwrap(this));
      },
      getSelection: function() {
        renderAllPending();
        return new Selection(originalGetSelection.call(unwrap(this)));
      },
      getElementsByName: function(name) {
        return SelectorsInterface.querySelectorAll.call(this, "[name=" + JSON.stringify(String(name)) + "]");
      }
    });
    if (document.registerElement) {
      var originalRegisterElement = document.registerElement;
      Document.prototype.registerElement = function(tagName, object) {
        var prototype, extendsOption;
        if (object !== undefined) {
          prototype = object.prototype;
          extendsOption = object.extends;
        }
        if (!prototype) prototype = Object.create(HTMLElement.prototype);
        if (scope.nativePrototypeTable.get(prototype)) {
          throw new Error("NotSupportedError");
        }
        var proto = Object.getPrototypeOf(prototype);
        var nativePrototype;
        var prototypes = [];
        while (proto) {
          nativePrototype = scope.nativePrototypeTable.get(proto);
          if (nativePrototype) break;
          prototypes.push(proto);
          proto = Object.getPrototypeOf(proto);
        }
        if (!nativePrototype) {
          throw new Error("NotSupportedError");
        }
        var newPrototype = Object.create(nativePrototype);
        for (var i = prototypes.length - 1; i >= 0; i--) {
          newPrototype = Object.create(newPrototype);
        }
        [ "createdCallback", "attachedCallback", "detachedCallback", "attributeChangedCallback" ].forEach(function(name) {
          var f = prototype[name];
          if (!f) return;
          newPrototype[name] = function() {
            if (!(wrap(this) instanceof CustomElementConstructor)) {
              rewrap(this);
            }
            f.apply(wrap(this), arguments);
          };
        });
        var p = {
          prototype: newPrototype
        };
        if (extendsOption) p.extends = extendsOption;
        function CustomElementConstructor(node) {
          if (!node) {
            if (extendsOption) {
              return document.createElement(extendsOption, tagName);
            } else {
              return document.createElement(tagName);
            }
          }
          setWrapper(node, this);
        }
        CustomElementConstructor.prototype = prototype;
        CustomElementConstructor.prototype.constructor = CustomElementConstructor;
        scope.constructorTable.set(newPrototype, CustomElementConstructor);
        scope.nativePrototypeTable.set(prototype, newPrototype);
        var nativeConstructor = originalRegisterElement.call(unwrap(this), tagName, p);
        return CustomElementConstructor;
      };
      forwardMethodsToWrapper([ window.HTMLDocument || window.Document ], [ "registerElement" ]);
    }
    forwardMethodsToWrapper([ window.HTMLBodyElement, window.HTMLDocument || window.Document, window.HTMLHeadElement, window.HTMLHtmlElement ], [ "appendChild", "compareDocumentPosition", "contains", "getElementsByClassName", "getElementsByTagName", "getElementsByTagNameNS", "insertBefore", "querySelector", "querySelectorAll", "removeChild", "replaceChild" ]);
    forwardMethodsToWrapper([ window.HTMLBodyElement, window.HTMLHeadElement, window.HTMLHtmlElement ], matchesNames);
    forwardMethodsToWrapper([ window.HTMLDocument || window.Document ], [ "adoptNode", "importNode", "contains", "createComment", "createDocumentFragment", "createElement", "createElementNS", "createEvent", "createEventNS", "createRange", "createTextNode", "elementFromPoint", "getElementById", "getElementsByName", "getSelection" ]);
    mixin(Document.prototype, GetElementsByInterface);
    mixin(Document.prototype, ParentNodeInterface);
    mixin(Document.prototype, SelectorsInterface);
    mixin(Document.prototype, {
      get implementation() {
        var implementation = implementationTable.get(this);
        if (implementation) return implementation;
        implementation = new DOMImplementation(unwrap(this).implementation);
        implementationTable.set(this, implementation);
        return implementation;
      },
      get defaultView() {
        return wrap(unwrap(this).defaultView);
      }
    });
    registerWrapper(window.Document, Document, document.implementation.createHTMLDocument(""));
    if (window.HTMLDocument) registerWrapper(window.HTMLDocument, Document);
    wrapEventTargetMethods([ window.HTMLBodyElement, window.HTMLDocument || window.Document, window.HTMLHeadElement ]);
    function DOMImplementation(impl) {
      setWrapper(impl, this);
    }
    function wrapImplMethod(constructor, name) {
      var original = document.implementation[name];
      constructor.prototype[name] = function() {
        return wrap(original.apply(unsafeUnwrap(this), arguments));
      };
    }
    function forwardImplMethod(constructor, name) {
      var original = document.implementation[name];
      constructor.prototype[name] = function() {
        return original.apply(unsafeUnwrap(this), arguments);
      };
    }
    wrapImplMethod(DOMImplementation, "createDocumentType");
    wrapImplMethod(DOMImplementation, "createDocument");
    wrapImplMethod(DOMImplementation, "createHTMLDocument");
    forwardImplMethod(DOMImplementation, "hasFeature");
    registerWrapper(window.DOMImplementation, DOMImplementation);
    forwardMethodsToWrapper([ window.DOMImplementation ], [ "createDocumentType", "createDocument", "createHTMLDocument", "hasFeature" ]);
    scope.adoptNodeNoRemove = adoptNodeNoRemove;
    scope.wrappers.DOMImplementation = DOMImplementation;
    scope.wrappers.Document = Document;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var EventTarget = scope.wrappers.EventTarget;
    var Selection = scope.wrappers.Selection;
    var mixin = scope.mixin;
    var registerWrapper = scope.registerWrapper;
    var renderAllPending = scope.renderAllPending;
    var unwrap = scope.unwrap;
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var wrap = scope.wrap;
    var OriginalWindow = window.Window;
    var originalGetComputedStyle = window.getComputedStyle;
    var originalGetDefaultComputedStyle = window.getDefaultComputedStyle;
    var originalGetSelection = window.getSelection;
    function Window(impl) {
      EventTarget.call(this, impl);
    }
    Window.prototype = Object.create(EventTarget.prototype);
    OriginalWindow.prototype.getComputedStyle = function(el, pseudo) {
      return wrap(this || window).getComputedStyle(unwrapIfNeeded(el), pseudo);
    };
    if (originalGetDefaultComputedStyle) {
      OriginalWindow.prototype.getDefaultComputedStyle = function(el, pseudo) {
        return wrap(this || window).getDefaultComputedStyle(unwrapIfNeeded(el), pseudo);
      };
    }
    OriginalWindow.prototype.getSelection = function() {
      return wrap(this || window).getSelection();
    };
    delete window.getComputedStyle;
    delete window.getDefaultComputedStyle;
    delete window.getSelection;
    [ "addEventListener", "removeEventListener", "dispatchEvent" ].forEach(function(name) {
      OriginalWindow.prototype[name] = function() {
        var w = wrap(this || window);
        return w[name].apply(w, arguments);
      };
      delete window[name];
    });
    mixin(Window.prototype, {
      getComputedStyle: function(el, pseudo) {
        renderAllPending();
        return originalGetComputedStyle.call(unwrap(this), unwrapIfNeeded(el), pseudo);
      },
      getSelection: function() {
        renderAllPending();
        return new Selection(originalGetSelection.call(unwrap(this)));
      },
      get document() {
        return wrap(unwrap(this).document);
      }
    });
    if (originalGetDefaultComputedStyle) {
      Window.prototype.getDefaultComputedStyle = function(el, pseudo) {
        renderAllPending();
        return originalGetDefaultComputedStyle.call(unwrap(this), unwrapIfNeeded(el), pseudo);
      };
    }
    registerWrapper(OriginalWindow, Window, window);
    scope.wrappers.Window = Window;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var unwrap = scope.unwrap;
    var OriginalDataTransfer = window.DataTransfer || window.Clipboard;
    var OriginalDataTransferSetDragImage = OriginalDataTransfer.prototype.setDragImage;
    if (OriginalDataTransferSetDragImage) {
      OriginalDataTransfer.prototype.setDragImage = function(image, x, y) {
        OriginalDataTransferSetDragImage.call(this, unwrap(image), x, y);
      };
    }
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var registerWrapper = scope.registerWrapper;
    var setWrapper = scope.setWrapper;
    var unwrap = scope.unwrap;
    var OriginalFormData = window.FormData;
    if (!OriginalFormData) return;
    function FormData(formElement) {
      var impl;
      if (formElement instanceof OriginalFormData) {
        impl = formElement;
      } else {
        impl = new OriginalFormData(formElement && unwrap(formElement));
      }
      setWrapper(impl, this);
    }
    registerWrapper(OriginalFormData, FormData, new OriginalFormData());
    scope.wrappers.FormData = FormData;
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var unwrapIfNeeded = scope.unwrapIfNeeded;
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(obj) {
      return originalSend.call(this, unwrapIfNeeded(obj));
    };
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    
    var isWrapperFor = scope.isWrapperFor;
    var elements = {
      a: "HTMLAnchorElement",
      area: "HTMLAreaElement",
      audio: "HTMLAudioElement",
      base: "HTMLBaseElement",
      body: "HTMLBodyElement",
      br: "HTMLBRElement",
      button: "HTMLButtonElement",
      canvas: "HTMLCanvasElement",
      caption: "HTMLTableCaptionElement",
      col: "HTMLTableColElement",
      content: "HTMLContentElement",
      data: "HTMLDataElement",
      datalist: "HTMLDataListElement",
      del: "HTMLModElement",
      dir: "HTMLDirectoryElement",
      div: "HTMLDivElement",
      dl: "HTMLDListElement",
      embed: "HTMLEmbedElement",
      fieldset: "HTMLFieldSetElement",
      font: "HTMLFontElement",
      form: "HTMLFormElement",
      frame: "HTMLFrameElement",
      frameset: "HTMLFrameSetElement",
      h1: "HTMLHeadingElement",
      head: "HTMLHeadElement",
      hr: "HTMLHRElement",
      html: "HTMLHtmlElement",
      iframe: "HTMLIFrameElement",
      img: "HTMLImageElement",
      input: "HTMLInputElement",
      keygen: "HTMLKeygenElement",
      label: "HTMLLabelElement",
      legend: "HTMLLegendElement",
      li: "HTMLLIElement",
      link: "HTMLLinkElement",
      map: "HTMLMapElement",
      marquee: "HTMLMarqueeElement",
      menu: "HTMLMenuElement",
      menuitem: "HTMLMenuItemElement",
      meta: "HTMLMetaElement",
      meter: "HTMLMeterElement",
      object: "HTMLObjectElement",
      ol: "HTMLOListElement",
      optgroup: "HTMLOptGroupElement",
      option: "HTMLOptionElement",
      output: "HTMLOutputElement",
      p: "HTMLParagraphElement",
      param: "HTMLParamElement",
      pre: "HTMLPreElement",
      progress: "HTMLProgressElement",
      q: "HTMLQuoteElement",
      script: "HTMLScriptElement",
      select: "HTMLSelectElement",
      shadow: "HTMLShadowElement",
      source: "HTMLSourceElement",
      span: "HTMLSpanElement",
      style: "HTMLStyleElement",
      table: "HTMLTableElement",
      tbody: "HTMLTableSectionElement",
      template: "HTMLTemplateElement",
      textarea: "HTMLTextAreaElement",
      thead: "HTMLTableSectionElement",
      time: "HTMLTimeElement",
      title: "HTMLTitleElement",
      tr: "HTMLTableRowElement",
      track: "HTMLTrackElement",
      ul: "HTMLUListElement",
      video: "HTMLVideoElement"
    };
    function overrideConstructor(tagName) {
      var nativeConstructorName = elements[tagName];
      var nativeConstructor = window[nativeConstructorName];
      if (!nativeConstructor) return;
      var element = document.createElement(tagName);
      var wrapperConstructor = element.constructor;
      window[nativeConstructorName] = wrapperConstructor;
    }
    Object.keys(elements).forEach(overrideConstructor);
    Object.getOwnPropertyNames(scope.wrappers).forEach(function(name) {
      window[name] = scope.wrappers[name];
    });
  })(window.ShadowDOMPolyfill);
  (function(scope) {
    var ShadowCSS = {
      strictStyling: false,
      registry: {},
      shimStyling: function(root, name, extendsName) {
        var scopeStyles = this.prepareRoot(root, name, extendsName);
        var typeExtension = this.isTypeExtension(extendsName);
        var scopeSelector = this.makeScopeSelector(name, typeExtension);
        var cssText = stylesToCssText(scopeStyles, true);
        cssText = this.scopeCssText(cssText, scopeSelector);
        if (root) {
          root.shimmedStyle = cssText;
        }
        this.addCssToDocument(cssText, name);
      },
      shimStyle: function(style, selector) {
        return this.shimCssText(style.textContent, selector);
      },
      shimCssText: function(cssText, selector) {
        cssText = this.insertDirectives(cssText);
        return this.scopeCssText(cssText, selector);
      },
      makeScopeSelector: function(name, typeExtension) {
        if (name) {
          return typeExtension ? "[is=" + name + "]" : name;
        }
        return "";
      },
      isTypeExtension: function(extendsName) {
        return extendsName && extendsName.indexOf("-") < 0;
      },
      prepareRoot: function(root, name, extendsName) {
        var def = this.registerRoot(root, name, extendsName);
        this.replaceTextInStyles(def.rootStyles, this.insertDirectives);
        this.removeStyles(root, def.rootStyles);
        if (this.strictStyling) {
          this.applyScopeToContent(root, name);
        }
        return def.scopeStyles;
      },
      removeStyles: function(root, styles) {
        for (var i = 0, l = styles.length, s; i < l && (s = styles[i]); i++) {
          s.parentNode.removeChild(s);
        }
      },
      registerRoot: function(root, name, extendsName) {
        var def = this.registry[name] = {
          root: root,
          name: name,
          extendsName: extendsName
        };
        var styles = this.findStyles(root);
        def.rootStyles = styles;
        def.scopeStyles = def.rootStyles;
        var extendee = this.registry[def.extendsName];
        if (extendee) {
          def.scopeStyles = extendee.scopeStyles.concat(def.scopeStyles);
        }
        return def;
      },
      findStyles: function(root) {
        if (!root) {
          return [];
        }
        var styles = root.querySelectorAll("style");
        return Array.prototype.filter.call(styles, function(s) {
          return !s.hasAttribute(NO_SHIM_ATTRIBUTE);
        });
      },
      applyScopeToContent: function(root, name) {
        if (root) {
          Array.prototype.forEach.call(root.querySelectorAll("*"), function(node) {
            node.setAttribute(name, "");
          });
          Array.prototype.forEach.call(root.querySelectorAll("template"), function(template) {
            this.applyScopeToContent(template.content, name);
          }, this);
        }
      },
      insertDirectives: function(cssText) {
        cssText = this.insertPolyfillDirectivesInCssText(cssText);
        return this.insertPolyfillRulesInCssText(cssText);
      },
      insertPolyfillDirectivesInCssText: function(cssText) {
        cssText = cssText.replace(cssCommentNextSelectorRe, function(match, p1) {
          return p1.slice(0, -2) + "{";
        });
        return cssText.replace(cssContentNextSelectorRe, function(match, p1) {
          return p1 + " {";
        });
      },
      insertPolyfillRulesInCssText: function(cssText) {
        cssText = cssText.replace(cssCommentRuleRe, function(match, p1) {
          return p1.slice(0, -1);
        });
        return cssText.replace(cssContentRuleRe, function(match, p1, p2, p3) {
          var rule = match.replace(p1, "").replace(p2, "");
          return p3 + rule;
        });
      },
      scopeCssText: function(cssText, scopeSelector) {
        var unscoped = this.extractUnscopedRulesFromCssText(cssText);
        cssText = this.insertPolyfillHostInCssText(cssText);
        cssText = this.convertColonHost(cssText);
        cssText = this.convertColonHostContext(cssText);
        cssText = this.convertShadowDOMSelectors(cssText);
        if (scopeSelector) {
          var self = this, cssText;
          withCssRules(cssText, function(rules) {
            cssText = self.scopeRules(rules, scopeSelector);
          });
        }
        cssText = cssText + "\n" + unscoped;
        return cssText.trim();
      },
      extractUnscopedRulesFromCssText: function(cssText) {
        var r = "", m;
        while (m = cssCommentUnscopedRuleRe.exec(cssText)) {
          r += m[1].slice(0, -1) + "\n\n";
        }
        while (m = cssContentUnscopedRuleRe.exec(cssText)) {
          r += m[0].replace(m[2], "").replace(m[1], m[3]) + "\n\n";
        }
        return r;
      },
      convertColonHost: function(cssText) {
        return this.convertColonRule(cssText, cssColonHostRe, this.colonHostPartReplacer);
      },
      convertColonHostContext: function(cssText) {
        return this.convertColonRule(cssText, cssColonHostContextRe, this.colonHostContextPartReplacer);
      },
      convertColonRule: function(cssText, regExp, partReplacer) {
        return cssText.replace(regExp, function(m, p1, p2, p3) {
          p1 = polyfillHostNoCombinator;
          if (p2) {
            var parts = p2.split(","), r = [];
            for (var i = 0, l = parts.length, p; i < l && (p = parts[i]); i++) {
              p = p.trim();
              r.push(partReplacer(p1, p, p3));
            }
            return r.join(",");
          } else {
            return p1 + p3;
          }
        });
      },
      colonHostContextPartReplacer: function(host, part, suffix) {
        if (part.match(polyfillHost)) {
          return this.colonHostPartReplacer(host, part, suffix);
        } else {
          return host + part + suffix + ", " + part + " " + host + suffix;
        }
      },
      colonHostPartReplacer: function(host, part, suffix) {
        return host + part.replace(polyfillHost, "") + suffix;
      },
      convertShadowDOMSelectors: function(cssText) {
        for (var i = 0; i < shadowDOMSelectorsRe.length; i++) {
          cssText = cssText.replace(shadowDOMSelectorsRe[i], " ");
        }
        return cssText;
      },
      scopeRules: function(cssRules, scopeSelector) {
        var cssText = "";
        if (cssRules) {
          Array.prototype.forEach.call(cssRules, function(rule) {
            if (rule.selectorText && (rule.style && rule.style.cssText !== undefined)) {
              cssText += this.scopeSelector(rule.selectorText, scopeSelector, this.strictStyling) + " {\n	";
              cssText += this.propertiesFromRule(rule) + "\n}\n\n";
            } else if (rule.type === CSSRule.MEDIA_RULE) {
              cssText += "@media " + rule.media.mediaText + " {\n";
              cssText += this.scopeRules(rule.cssRules, scopeSelector);
              cssText += "\n}\n\n";
            } else {
              try {
                if (rule.cssText) {
                  cssText += rule.cssText + "\n\n";
                }
              } catch (x) {
                if (rule.type === CSSRule.KEYFRAMES_RULE && rule.cssRules) {
                  cssText += this.ieSafeCssTextFromKeyFrameRule(rule);
                }
              }
            }
          }, this);
        }
        return cssText;
      },
      ieSafeCssTextFromKeyFrameRule: function(rule) {
        var cssText = "@keyframes " + rule.name + " {";
        Array.prototype.forEach.call(rule.cssRules, function(rule) {
          cssText += " " + rule.keyText + " {" + rule.style.cssText + "}";
        });
        cssText += " }";
        return cssText;
      },
      scopeSelector: function(selector, scopeSelector, strict) {
        var r = [], parts = selector.split(",");
        parts.forEach(function(p) {
          p = p.trim();
          if (this.selectorNeedsScoping(p, scopeSelector)) {
            p = strict && !p.match(polyfillHostNoCombinator) ? this.applyStrictSelectorScope(p, scopeSelector) : this.applySelectorScope(p, scopeSelector);
          }
          r.push(p);
        }, this);
        return r.join(", ");
      },
      selectorNeedsScoping: function(selector, scopeSelector) {
        if (Array.isArray(scopeSelector)) {
          return true;
        }
        var re = this.makeScopeMatcher(scopeSelector);
        return !selector.match(re);
      },
      makeScopeMatcher: function(scopeSelector) {
        scopeSelector = scopeSelector.replace(/\[/g, "\\[").replace(/\[/g, "\\]");
        return new RegExp("^(" + scopeSelector + ")" + selectorReSuffix, "m");
      },
      applySelectorScope: function(selector, selectorScope) {
        return Array.isArray(selectorScope) ? this.applySelectorScopeList(selector, selectorScope) : this.applySimpleSelectorScope(selector, selectorScope);
      },
      applySelectorScopeList: function(selector, scopeSelectorList) {
        var r = [];
        for (var i = 0, s; s = scopeSelectorList[i]; i++) {
          r.push(this.applySimpleSelectorScope(selector, s));
        }
        return r.join(", ");
      },
      applySimpleSelectorScope: function(selector, scopeSelector) {
        if (selector.match(polyfillHostRe)) {
          selector = selector.replace(polyfillHostNoCombinator, scopeSelector);
          return selector.replace(polyfillHostRe, scopeSelector + " ");
        } else {
          return scopeSelector + " " + selector;
        }
      },
      applyStrictSelectorScope: function(selector, scopeSelector) {
        scopeSelector = scopeSelector.replace(/\[is=([^\]]*)\]/g, "$1");
        var splits = [ " ", ">", "+", "~" ], scoped = selector, attrName = "[" + scopeSelector + "]";
        splits.forEach(function(sep) {
          var parts = scoped.split(sep);
          scoped = parts.map(function(p) {
            var t = p.trim().replace(polyfillHostRe, "");
            if (t && splits.indexOf(t) < 0 && t.indexOf(attrName) < 0) {
              p = t.replace(/([^:]*)(:*)(.*)/, "$1" + attrName + "$2$3");
            }
            return p;
          }).join(sep);
        });
        return scoped;
      },
      insertPolyfillHostInCssText: function(selector) {
        return selector.replace(colonHostContextRe, polyfillHostContext).replace(colonHostRe, polyfillHost);
      },
      propertiesFromRule: function(rule) {
        var cssText = rule.style.cssText;
        if (rule.style.content && !rule.style.content.match(/['"]+|attr/)) {
          cssText = cssText.replace(/content:[^;]*;/g, "content: '" + rule.style.content + "';");
        }
        var style = rule.style;
        for (var i in style) {
          if (style[i] === "initial") {
            cssText += i + ": initial; ";
          }
        }
        return cssText;
      },
      replaceTextInStyles: function(styles, action) {
        if (styles && action) {
          if (!(styles instanceof Array)) {
            styles = [ styles ];
          }
          Array.prototype.forEach.call(styles, function(s) {
            s.textContent = action.call(this, s.textContent);
          }, this);
        }
      },
      addCssToDocument: function(cssText, name) {
        if (cssText.match("@import")) {
          addOwnSheet(cssText, name);
        } else {
          addCssToDocument(cssText);
        }
      }
    };
    var selectorRe = /([^{]*)({[\s\S]*?})/gim, cssCommentRe = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim, cssCommentNextSelectorRe = /\/\*\s*@polyfill ([^*]*\*+([^/*][^*]*\*+)*\/)([^{]*?){/gim, cssContentNextSelectorRe = /polyfill-next-selector[^}]*content\:[\s]*?['"](.*?)['"][;\s]*}([^{]*?){/gim, cssCommentRuleRe = /\/\*\s@polyfill-rule([^*]*\*+([^/*][^*]*\*+)*)\//gim, cssContentRuleRe = /(polyfill-rule)[^}]*(content\:[\s]*['"](.*?)['"])[;\s]*[^}]*}/gim, cssCommentUnscopedRuleRe = /\/\*\s@polyfill-unscoped-rule([^*]*\*+([^/*][^*]*\*+)*)\//gim, cssContentUnscopedRuleRe = /(polyfill-unscoped-rule)[^}]*(content\:[\s]*['"](.*?)['"])[;\s]*[^}]*}/gim, cssPseudoRe = /::(x-[^\s{,(]*)/gim, cssPartRe = /::part\(([^)]*)\)/gim, polyfillHost = "-shadowcsshost", polyfillHostContext = "-shadowcsscontext", parenSuffix = ")(?:\\((" + "(?:\\([^)(]*\\)|[^)(]*)+?" + ")\\))?([^,{]*)";
    var cssColonHostRe = new RegExp("(" + polyfillHost + parenSuffix, "gim"), cssColonHostContextRe = new RegExp("(" + polyfillHostContext + parenSuffix, "gim"), selectorReSuffix = "([>\\s~+[.,{:][\\s\\S]*)?$", colonHostRe = /\:host/gim, colonHostContextRe = /\:host-context/gim, polyfillHostNoCombinator = polyfillHost + "-no-combinator", polyfillHostRe = new RegExp(polyfillHost, "gim"), polyfillHostContextRe = new RegExp(polyfillHostContext, "gim"), shadowDOMSelectorsRe = [ /\^\^/g, /\^/g, /\/shadow\//g, /\/shadow-deep\//g, /::shadow/g, /\/deep\//g, /::content/g ];
    function stylesToCssText(styles, preserveComments) {
      var cssText = "";
      Array.prototype.forEach.call(styles, function(s) {
        cssText += s.textContent + "\n\n";
      });
      if (!preserveComments) {
        cssText = cssText.replace(cssCommentRe, "");
      }
      return cssText;
    }
    function cssTextToStyle(cssText) {
      var style = document.createElement("style");
      style.textContent = cssText;
      return style;
    }
    function cssToRules(cssText) {
      var style = cssTextToStyle(cssText);
      document.head.appendChild(style);
      var rules = [];
      if (style.sheet) {
        try {
          rules = style.sheet.cssRules;
        } catch (e) {}
      } else {
        console.warn("sheet not found", style);
      }
      style.parentNode.removeChild(style);
      return rules;
    }
    var frame = document.createElement("iframe");
    frame.style.display = "none";
    function initFrame() {
      frame.initialized = true;
      document.body.appendChild(frame);
      var doc = frame.contentDocument;
      var base = doc.createElement("base");
      base.href = document.baseURI;
      doc.head.appendChild(base);
    }
    function inFrame(fn) {
      if (!frame.initialized) {
        initFrame();
      }
      document.body.appendChild(frame);
      fn(frame.contentDocument);
      document.body.removeChild(frame);
    }
    var isChrome = navigator.userAgent.match("Chrome");
    function withCssRules(cssText, callback) {
      if (!callback) {
        return;
      }
      var rules;
      if (cssText.match("@import") && isChrome) {
        var style = cssTextToStyle(cssText);
        inFrame(function(doc) {
          doc.head.appendChild(style.impl);
          rules = Array.prototype.slice.call(style.sheet.cssRules, 0);
          callback(rules);
        });
      } else {
        rules = cssToRules(cssText);
        callback(rules);
      }
    }
    function rulesToCss(cssRules) {
      for (var i = 0, css = []; i < cssRules.length; i++) {
        css.push(cssRules[i].cssText);
      }
      return css.join("\n\n");
    }
    function addCssToDocument(cssText) {
      if (cssText) {
        getSheet().appendChild(document.createTextNode(cssText));
      }
    }
    function addOwnSheet(cssText, name) {
      var style = cssTextToStyle(cssText);
      style.setAttribute(name, "");
      style.setAttribute(SHIMMED_ATTRIBUTE, "");
      document.head.appendChild(style);
    }
    var SHIM_ATTRIBUTE = "shim-shadowdom";
    var SHIMMED_ATTRIBUTE = "shim-shadowdom-css";
    var NO_SHIM_ATTRIBUTE = "no-shim";
    var sheet;
    function getSheet() {
      if (!sheet) {
        sheet = document.createElement("style");
        sheet.setAttribute(SHIMMED_ATTRIBUTE, "");
        sheet[SHIMMED_ATTRIBUTE] = true;
      }
      return sheet;
    }
    if (window.ShadowDOMPolyfill) {
      addCssToDocument("style { display: none !important; }\n");
      var doc = ShadowDOMPolyfill.wrap(document);
      var head = doc.querySelector("head");
      head.insertBefore(getSheet(), head.childNodes[0]);
      document.addEventListener("DOMContentLoaded", function() {
        var urlResolver = scope.urlResolver;
        if (window.HTMLImports && !HTMLImports.useNative) {
          var SHIM_SHEET_SELECTOR = "link[rel=stylesheet]" + "[" + SHIM_ATTRIBUTE + "]";
          var SHIM_STYLE_SELECTOR = "style[" + SHIM_ATTRIBUTE + "]";
          HTMLImports.importer.documentPreloadSelectors += "," + SHIM_SHEET_SELECTOR;
          HTMLImports.importer.importsPreloadSelectors += "," + SHIM_SHEET_SELECTOR;
          HTMLImports.parser.documentSelectors = [ HTMLImports.parser.documentSelectors, SHIM_SHEET_SELECTOR, SHIM_STYLE_SELECTOR ].join(",");
          var originalParseGeneric = HTMLImports.parser.parseGeneric;
          HTMLImports.parser.parseGeneric = function(elt) {
            if (elt[SHIMMED_ATTRIBUTE]) {
              return;
            }
            var style = elt.__importElement || elt;
            if (!style.hasAttribute(SHIM_ATTRIBUTE)) {
              originalParseGeneric.call(this, elt);
              return;
            }
            if (elt.__resource) {
              style = elt.ownerDocument.createElement("style");
              style.textContent = elt.__resource;
            }
            HTMLImports.path.resolveUrlsInStyle(style);
            style.textContent = ShadowCSS.shimStyle(style);
            style.removeAttribute(SHIM_ATTRIBUTE, "");
            style.setAttribute(SHIMMED_ATTRIBUTE, "");
            style[SHIMMED_ATTRIBUTE] = true;
            if (style.parentNode !== head) {
              if (elt.parentNode === head) {
                head.replaceChild(style, elt);
              } else {
                this.addElementToDocument(style);
              }
            }
            style.__importParsed = true;
            this.markParsingComplete(elt);
            this.parseNext();
          };
          var hasResource = HTMLImports.parser.hasResource;
          HTMLImports.parser.hasResource = function(node) {
            if (node.localName === "link" && node.rel === "stylesheet" && node.hasAttribute(SHIM_ATTRIBUTE)) {
              return node.__resource;
            } else {
              return hasResource.call(this, node);
            }
          };
        }
      });
    }
    scope.ShadowCSS = ShadowCSS;
  })(window.WebComponents);
}

(function(scope) {
  if (window.ShadowDOMPolyfill) {
    window.wrap = ShadowDOMPolyfill.wrapIfNeeded;
    window.unwrap = ShadowDOMPolyfill.unwrapIfNeeded;
  } else {
    window.wrap = window.unwrap = function(n) {
      return n;
    };
  }
})(window.WebComponents);

(function(global) {
  var registrationsTable = new WeakMap();
  var setImmediate;
  if (/Trident|Edge/.test(navigator.userAgent)) {
    setImmediate = setTimeout;
  } else if (window.setImmediate) {
    setImmediate = window.setImmediate;
  } else {
    var setImmediateQueue = [];
    var sentinel = String(Math.random());
    window.addEventListener("message", function(e) {
      if (e.data === sentinel) {
        var queue = setImmediateQueue;
        setImmediateQueue = [];
        queue.forEach(function(func) {
          func();
        });
      }
    });
    setImmediate = function(func) {
      setImmediateQueue.push(func);
      window.postMessage(sentinel, "*");
    };
  }
  var isScheduled = false;
  var scheduledObservers = [];
  function scheduleCallback(observer) {
    scheduledObservers.push(observer);
    if (!isScheduled) {
      isScheduled = true;
      setImmediate(dispatchCallbacks);
    }
  }
  function wrapIfNeeded(node) {
    return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(node) || node;
  }
  function dispatchCallbacks() {
    isScheduled = false;
    var observers = scheduledObservers;
    scheduledObservers = [];
    observers.sort(function(o1, o2) {
      return o1.uid_ - o2.uid_;
    });
    var anyNonEmpty = false;
    observers.forEach(function(observer) {
      var queue = observer.takeRecords();
      removeTransientObserversFor(observer);
      if (queue.length) {
        observer.callback_(queue, observer);
        anyNonEmpty = true;
      }
    });
    if (anyNonEmpty) dispatchCallbacks();
  }
  function removeTransientObserversFor(observer) {
    observer.nodes_.forEach(function(node) {
      var registrations = registrationsTable.get(node);
      if (!registrations) return;
      registrations.forEach(function(registration) {
        if (registration.observer === observer) registration.removeTransientObservers();
      });
    });
  }
  function forEachAncestorAndObserverEnqueueRecord(target, callback) {
    for (var node = target; node; node = node.parentNode) {
      var registrations = registrationsTable.get(node);
      if (registrations) {
        for (var j = 0; j < registrations.length; j++) {
          var registration = registrations[j];
          var options = registration.options;
          if (node !== target && !options.subtree) continue;
          var record = callback(options);
          if (record) registration.enqueue(record);
        }
      }
    }
  }
  var uidCounter = 0;
  function JsMutationObserver(callback) {
    this.callback_ = callback;
    this.nodes_ = [];
    this.records_ = [];
    this.uid_ = ++uidCounter;
  }
  JsMutationObserver.prototype = {
    observe: function(target, options) {
      target = wrapIfNeeded(target);
      if (!options.childList && !options.attributes && !options.characterData || options.attributeOldValue && !options.attributes || options.attributeFilter && options.attributeFilter.length && !options.attributes || options.characterDataOldValue && !options.characterData) {
        throw new SyntaxError();
      }
      var registrations = registrationsTable.get(target);
      if (!registrations) registrationsTable.set(target, registrations = []);
      var registration;
      for (var i = 0; i < registrations.length; i++) {
        if (registrations[i].observer === this) {
          registration = registrations[i];
          registration.removeListeners();
          registration.options = options;
          break;
        }
      }
      if (!registration) {
        registration = new Registration(this, target, options);
        registrations.push(registration);
        this.nodes_.push(target);
      }
      registration.addListeners();
    },
    disconnect: function() {
      this.nodes_.forEach(function(node) {
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          var registration = registrations[i];
          if (registration.observer === this) {
            registration.removeListeners();
            registrations.splice(i, 1);
            break;
          }
        }
      }, this);
      this.records_ = [];
    },
    takeRecords: function() {
      var copyOfRecords = this.records_;
      this.records_ = [];
      return copyOfRecords;
    }
  };
  function MutationRecord(type, target) {
    this.type = type;
    this.target = target;
    this.addedNodes = [];
    this.removedNodes = [];
    this.previousSibling = null;
    this.nextSibling = null;
    this.attributeName = null;
    this.attributeNamespace = null;
    this.oldValue = null;
  }
  function copyMutationRecord(original) {
    var record = new MutationRecord(original.type, original.target);
    record.addedNodes = original.addedNodes.slice();
    record.removedNodes = original.removedNodes.slice();
    record.previousSibling = original.previousSibling;
    record.nextSibling = original.nextSibling;
    record.attributeName = original.attributeName;
    record.attributeNamespace = original.attributeNamespace;
    record.oldValue = original.oldValue;
    return record;
  }
  var currentRecord, recordWithOldValue;
  function getRecord(type, target) {
    return currentRecord = new MutationRecord(type, target);
  }
  function getRecordWithOldValue(oldValue) {
    if (recordWithOldValue) return recordWithOldValue;
    recordWithOldValue = copyMutationRecord(currentRecord);
    recordWithOldValue.oldValue = oldValue;
    return recordWithOldValue;
  }
  function clearRecords() {
    currentRecord = recordWithOldValue = undefined;
  }
  function recordRepresentsCurrentMutation(record) {
    return record === recordWithOldValue || record === currentRecord;
  }
  function selectRecord(lastRecord, newRecord) {
    if (lastRecord === newRecord) return lastRecord;
    if (recordWithOldValue && recordRepresentsCurrentMutation(lastRecord)) return recordWithOldValue;
    return null;
  }
  function Registration(observer, target, options) {
    this.observer = observer;
    this.target = target;
    this.options = options;
    this.transientObservedNodes = [];
  }
  Registration.prototype = {
    enqueue: function(record) {
      var records = this.observer.records_;
      var length = records.length;
      if (records.length > 0) {
        var lastRecord = records[length - 1];
        var recordToReplaceLast = selectRecord(lastRecord, record);
        if (recordToReplaceLast) {
          records[length - 1] = recordToReplaceLast;
          return;
        }
      } else {
        scheduleCallback(this.observer);
      }
      records[length] = record;
    },
    addListeners: function() {
      this.addListeners_(this.target);
    },
    addListeners_: function(node) {
      var options = this.options;
      if (options.attributes) node.addEventListener("DOMAttrModified", this, true);
      if (options.characterData) node.addEventListener("DOMCharacterDataModified", this, true);
      if (options.childList) node.addEventListener("DOMNodeInserted", this, true);
      if (options.childList || options.subtree) node.addEventListener("DOMNodeRemoved", this, true);
    },
    removeListeners: function() {
      this.removeListeners_(this.target);
    },
    removeListeners_: function(node) {
      var options = this.options;
      if (options.attributes) node.removeEventListener("DOMAttrModified", this, true);
      if (options.characterData) node.removeEventListener("DOMCharacterDataModified", this, true);
      if (options.childList) node.removeEventListener("DOMNodeInserted", this, true);
      if (options.childList || options.subtree) node.removeEventListener("DOMNodeRemoved", this, true);
    },
    addTransientObserver: function(node) {
      if (node === this.target) return;
      this.addListeners_(node);
      this.transientObservedNodes.push(node);
      var registrations = registrationsTable.get(node);
      if (!registrations) registrationsTable.set(node, registrations = []);
      registrations.push(this);
    },
    removeTransientObservers: function() {
      var transientObservedNodes = this.transientObservedNodes;
      this.transientObservedNodes = [];
      transientObservedNodes.forEach(function(node) {
        this.removeListeners_(node);
        var registrations = registrationsTable.get(node);
        for (var i = 0; i < registrations.length; i++) {
          if (registrations[i] === this) {
            registrations.splice(i, 1);
            break;
          }
        }
      }, this);
    },
    handleEvent: function(e) {
      e.stopImmediatePropagation();
      switch (e.type) {
       case "DOMAttrModified":
        var name = e.attrName;
        var namespace = e.relatedNode.namespaceURI;
        var target = e.target;
        var record = new getRecord("attributes", target);
        record.attributeName = name;
        record.attributeNamespace = namespace;
        var oldValue = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
        forEachAncestorAndObserverEnqueueRecord(target, function(options) {
          if (!options.attributes) return;
          if (options.attributeFilter && options.attributeFilter.length && options.attributeFilter.indexOf(name) === -1 && options.attributeFilter.indexOf(namespace) === -1) {
            return;
          }
          if (options.attributeOldValue) return getRecordWithOldValue(oldValue);
          return record;
        });
        break;

       case "DOMCharacterDataModified":
        var target = e.target;
        var record = getRecord("characterData", target);
        var oldValue = e.prevValue;
        forEachAncestorAndObserverEnqueueRecord(target, function(options) {
          if (!options.characterData) return;
          if (options.characterDataOldValue) return getRecordWithOldValue(oldValue);
          return record;
        });
        break;

       case "DOMNodeRemoved":
        this.addTransientObserver(e.target);

       case "DOMNodeInserted":
        var target = e.relatedNode;
        var changedNode = e.target;
        var addedNodes, removedNodes;
        if (e.type === "DOMNodeInserted") {
          addedNodes = [ changedNode ];
          removedNodes = [];
        } else {
          addedNodes = [];
          removedNodes = [ changedNode ];
        }
        var previousSibling = changedNode.previousSibling;
        var nextSibling = changedNode.nextSibling;
        var record = getRecord("childList", target);
        record.addedNodes = addedNodes;
        record.removedNodes = removedNodes;
        record.previousSibling = previousSibling;
        record.nextSibling = nextSibling;
        forEachAncestorAndObserverEnqueueRecord(target, function(options) {
          if (!options.childList) return;
          return record;
        });
      }
      clearRecords();
    }
  };
  global.JsMutationObserver = JsMutationObserver;
  if (!global.MutationObserver) global.MutationObserver = JsMutationObserver;
})(this);

window.HTMLImports = window.HTMLImports || {
  flags: {}
};

(function(scope) {
  var IMPORT_LINK_TYPE = "import";
  var useNative = Boolean(IMPORT_LINK_TYPE in document.createElement("link"));
  var hasShadowDOMPolyfill = Boolean(window.ShadowDOMPolyfill);
  var wrap = function(node) {
    return hasShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(node) : node;
  };
  var rootDocument = wrap(document);
  var currentScriptDescriptor = {
    get: function() {
      var script = HTMLImports.currentScript || document.currentScript || (document.readyState !== "complete" ? document.scripts[document.scripts.length - 1] : null);
      return wrap(script);
    },
    configurable: true
  };
  Object.defineProperty(document, "_currentScript", currentScriptDescriptor);
  Object.defineProperty(rootDocument, "_currentScript", currentScriptDescriptor);
  var isIE = /Trident|Edge/.test(navigator.userAgent);
  function whenReady(callback, doc) {
    doc = doc || rootDocument;
    whenDocumentReady(function() {
      watchImportsLoad(callback, doc);
    }, doc);
  }
  var requiredReadyState = isIE ? "complete" : "interactive";
  var READY_EVENT = "readystatechange";
  function isDocumentReady(doc) {
    return doc.readyState === "complete" || doc.readyState === requiredReadyState;
  }
  function whenDocumentReady(callback, doc) {
    if (!isDocumentReady(doc)) {
      var checkReady = function() {
        if (doc.readyState === "complete" || doc.readyState === requiredReadyState) {
          doc.removeEventListener(READY_EVENT, checkReady);
          whenDocumentReady(callback, doc);
        }
      };
      doc.addEventListener(READY_EVENT, checkReady);
    } else if (callback) {
      callback();
    }
  }
  function markTargetLoaded(event) {
    event.target.__loaded = true;
  }
  function watchImportsLoad(callback, doc) {
    var imports = doc.querySelectorAll("link[rel=import]");
    var loaded = 0, l = imports.length;
    function checkDone(d) {
      if (loaded == l && callback) {
        callback();
      }
    }
    function loadedImport(e) {
      markTargetLoaded(e);
      loaded++;
      checkDone();
    }
    if (l) {
      for (var i = 0, imp; i < l && (imp = imports[i]); i++) {
        if (isImportLoaded(imp)) {
          loadedImport.call(imp, {
            target: imp
          });
        } else {
          imp.addEventListener("load", loadedImport);
          imp.addEventListener("error", loadedImport);
        }
      }
    } else {
      checkDone();
    }
  }
  function isImportLoaded(link) {
    return useNative ? link.__loaded || link.import && link.import.readyState !== "loading" : link.__importParsed;
  }
  if (useNative) {
    new MutationObserver(function(mxns) {
      for (var i = 0, l = mxns.length, m; i < l && (m = mxns[i]); i++) {
        if (m.addedNodes) {
          handleImports(m.addedNodes);
        }
      }
    }).observe(document.head, {
      childList: true
    });
    function handleImports(nodes) {
      for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
        if (isImport(n)) {
          handleImport(n);
        }
      }
    }
    function isImport(element) {
      return element.localName === "link" && element.rel === "import";
    }
    function handleImport(element) {
      var loaded = element.import;
      if (loaded) {
        markTargetLoaded({
          target: element
        });
      } else {
        element.addEventListener("load", markTargetLoaded);
        element.addEventListener("error", markTargetLoaded);
      }
    }
    (function() {
      if (document.readyState === "loading") {
        var imports = document.querySelectorAll("link[rel=import]");
        for (var i = 0, l = imports.length, imp; i < l && (imp = imports[i]); i++) {
          handleImport(imp);
        }
      }
    })();
  }
  whenReady(function() {
    HTMLImports.ready = true;
    HTMLImports.readyTime = new Date().getTime();
    var evt = rootDocument.createEvent("CustomEvent");
    evt.initCustomEvent("HTMLImportsLoaded", true, true, {});
    rootDocument.dispatchEvent(evt);
  });
  scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
  scope.useNative = useNative;
  scope.rootDocument = rootDocument;
  scope.whenReady = whenReady;
  scope.isIE = isIE;
})(HTMLImports);

(function(scope) {
  var modules = [];
  var addModule = function(module) {
    modules.push(module);
  };
  var initializeModules = function() {
    modules.forEach(function(module) {
      module(scope);
    });
  };
  scope.addModule = addModule;
  scope.initializeModules = initializeModules;
})(HTMLImports);

HTMLImports.addModule(function(scope) {
  var CSS_URL_REGEXP = /(url\()([^)]*)(\))/g;
  var CSS_IMPORT_REGEXP = /(@import[\s]+(?!url\())([^;]*)(;)/g;
  var path = {
    resolveUrlsInStyle: function(style) {
      var doc = style.ownerDocument;
      var resolver = doc.createElement("a");
      style.textContent = this.resolveUrlsInCssText(style.textContent, resolver);
      return style;
    },
    resolveUrlsInCssText: function(cssText, urlObj) {
      var r = this.replaceUrls(cssText, urlObj, CSS_URL_REGEXP);
      r = this.replaceUrls(r, urlObj, CSS_IMPORT_REGEXP);
      return r;
    },
    replaceUrls: function(text, urlObj, regexp) {
      return text.replace(regexp, function(m, pre, url, post) {
        var urlPath = url.replace(/["']/g, "");
        urlObj.href = urlPath;
        urlPath = urlObj.href;
        return pre + "'" + urlPath + "'" + post;
      });
    }
  };
  scope.path = path;
});

HTMLImports.addModule(function(scope) {
  var xhr = {
    async: true,
    ok: function(request) {
      return request.status >= 200 && request.status < 300 || request.status === 304 || request.status === 0;
    },
    load: function(url, next, nextContext) {
      var request = new XMLHttpRequest();
      if (scope.flags.debug || scope.flags.bust) {
        url += "?" + Math.random();
      }
      request.open("GET", url, xhr.async);
      request.addEventListener("readystatechange", function(e) {
        if (request.readyState === 4) {
          var locationHeader = request.getResponseHeader("Location");
          var redirectedUrl = null;
          if (locationHeader) {
            var redirectedUrl = locationHeader.substr(0, 1) === "/" ? location.origin + locationHeader : locationHeader;
          }
          next.call(nextContext, !xhr.ok(request) && request, request.response || request.responseText, redirectedUrl);
        }
      });
      request.send();
      return request;
    },
    loadDocument: function(url, next, nextContext) {
      this.load(url, next, nextContext).responseType = "document";
    }
  };
  scope.xhr = xhr;
});

HTMLImports.addModule(function(scope) {
  var xhr = scope.xhr;
  var flags = scope.flags;
  var Loader = function(onLoad, onComplete) {
    this.cache = {};
    this.onload = onLoad;
    this.oncomplete = onComplete;
    this.inflight = 0;
    this.pending = {};
  };
  Loader.prototype = {
    addNodes: function(nodes) {
      this.inflight += nodes.length;
      for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
        this.require(n);
      }
      this.checkDone();
    },
    addNode: function(node) {
      this.inflight++;
      this.require(node);
      this.checkDone();
    },
    require: function(elt) {
      var url = elt.src || elt.href;
      elt.__nodeUrl = url;
      if (!this.dedupe(url, elt)) {
        this.fetch(url, elt);
      }
    },
    dedupe: function(url, elt) {
      if (this.pending[url]) {
        this.pending[url].push(elt);
        return true;
      }
      var resource;
      if (this.cache[url]) {
        this.onload(url, elt, this.cache[url]);
        this.tail();
        return true;
      }
      this.pending[url] = [ elt ];
      return false;
    },
    fetch: function(url, elt) {
      flags.load && console.log("fetch", url, elt);
      if (!url) {
        setTimeout(function() {
          this.receive(url, elt, {
            error: "href must be specified"
          }, null);
        }.bind(this), 0);
      } else if (url.match(/^data:/)) {
        var pieces = url.split(",");
        var header = pieces[0];
        var body = pieces[1];
        if (header.indexOf(";base64") > -1) {
          body = atob(body);
        } else {
          body = decodeURIComponent(body);
        }
        setTimeout(function() {
          this.receive(url, elt, null, body);
        }.bind(this), 0);
      } else {
        var receiveXhr = function(err, resource, redirectedUrl) {
          this.receive(url, elt, err, resource, redirectedUrl);
        }.bind(this);
        xhr.load(url, receiveXhr);
      }
    },
    receive: function(url, elt, err, resource, redirectedUrl) {
      this.cache[url] = resource;
      var $p = this.pending[url];
      for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
        this.onload(url, p, resource, err, redirectedUrl);
        this.tail();
      }
      this.pending[url] = null;
    },
    tail: function() {
      --this.inflight;
      this.checkDone();
    },
    checkDone: function() {
      if (!this.inflight) {
        this.oncomplete();
      }
    }
  };
  scope.Loader = Loader;
});

HTMLImports.addModule(function(scope) {
  var Observer = function(addCallback) {
    this.addCallback = addCallback;
    this.mo = new MutationObserver(this.handler.bind(this));
  };
  Observer.prototype = {
    handler: function(mutations) {
      for (var i = 0, l = mutations.length, m; i < l && (m = mutations[i]); i++) {
        if (m.type === "childList" && m.addedNodes.length) {
          this.addedNodes(m.addedNodes);
        }
      }
    },
    addedNodes: function(nodes) {
      if (this.addCallback) {
        this.addCallback(nodes);
      }
      for (var i = 0, l = nodes.length, n, loading; i < l && (n = nodes[i]); i++) {
        if (n.children && n.children.length) {
          this.addedNodes(n.children);
        }
      }
    },
    observe: function(root) {
      this.mo.observe(root, {
        childList: true,
        subtree: true
      });
    }
  };
  scope.Observer = Observer;
});

HTMLImports.addModule(function(scope) {
  var path = scope.path;
  var rootDocument = scope.rootDocument;
  var flags = scope.flags;
  var isIE = scope.isIE;
  var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;
  var IMPORT_SELECTOR = "link[rel=" + IMPORT_LINK_TYPE + "]";
  var importParser = {
    documentSelectors: IMPORT_SELECTOR,
    importsSelectors: [ IMPORT_SELECTOR, "link[rel=stylesheet]", "style", "script:not([type])", 'script[type="text/javascript"]' ].join(","),
    map: {
      link: "parseLink",
      script: "parseScript",
      style: "parseStyle"
    },
    dynamicElements: [],
    parseNext: function() {
      var next = this.nextToParse();
      if (next) {
        this.parse(next);
      }
    },
    parse: function(elt) {
      if (this.isParsed(elt)) {
        flags.parse && console.log("[%s] is already parsed", elt.localName);
        return;
      }
      var fn = this[this.map[elt.localName]];
      if (fn) {
        this.markParsing(elt);
        fn.call(this, elt);
      }
    },
    parseDynamic: function(elt, quiet) {
      this.dynamicElements.push(elt);
      if (!quiet) {
        this.parseNext();
      }
    },
    markParsing: function(elt) {
      flags.parse && console.log("parsing", elt);
      this.parsingElement = elt;
    },
    markParsingComplete: function(elt) {
      elt.__importParsed = true;
      this.markDynamicParsingComplete(elt);
      if (elt.__importElement) {
        elt.__importElement.__importParsed = true;
        this.markDynamicParsingComplete(elt.__importElement);
      }
      this.parsingElement = null;
      flags.parse && console.log("completed", elt);
    },
    markDynamicParsingComplete: function(elt) {
      var i = this.dynamicElements.indexOf(elt);
      if (i >= 0) {
        this.dynamicElements.splice(i, 1);
      }
    },
    parseImport: function(elt) {
      if (HTMLImports.__importsParsingHook) {
        HTMLImports.__importsParsingHook(elt);
      }
      if (elt.import) {
        elt.import.__importParsed = true;
      }
      this.markParsingComplete(elt);
      if (elt.__resource && !elt.__error) {
        elt.dispatchEvent(new CustomEvent("load", {
          bubbles: false
        }));
      } else {
        elt.dispatchEvent(new CustomEvent("error", {
          bubbles: false
        }));
      }
      if (elt.__pending) {
        var fn;
        while (elt.__pending.length) {
          fn = elt.__pending.shift();
          if (fn) {
            fn({
              target: elt
            });
          }
        }
      }
      this.parseNext();
    },
    parseLink: function(linkElt) {
      if (nodeIsImport(linkElt)) {
        this.parseImport(linkElt);
      } else {
        linkElt.href = linkElt.href;
        this.parseGeneric(linkElt);
      }
    },
    parseStyle: function(elt) {
      var src = elt;
      elt = cloneStyle(elt);
      elt.__importElement = src;
      this.parseGeneric(elt);
    },
    parseGeneric: function(elt) {
      this.trackElement(elt);
      this.addElementToDocument(elt);
    },
    rootImportForElement: function(elt) {
      var n = elt;
      while (n.ownerDocument.__importLink) {
        n = n.ownerDocument.__importLink;
      }
      return n;
    },
    addElementToDocument: function(elt) {
      var port = this.rootImportForElement(elt.__importElement || elt);
      port.parentNode.insertBefore(elt, port);
    },
    trackElement: function(elt, callback) {
      var self = this;
      var done = function(e) {
        if (callback) {
          callback(e);
        }
        self.markParsingComplete(elt);
        self.parseNext();
      };
      elt.addEventListener("load", done);
      elt.addEventListener("error", done);
      if (isIE && elt.localName === "style") {
        var fakeLoad = false;
        if (elt.textContent.indexOf("@import") == -1) {
          fakeLoad = true;
        } else if (elt.sheet) {
          fakeLoad = true;
          var csr = elt.sheet.cssRules;
          var len = csr ? csr.length : 0;
          for (var i = 0, r; i < len && (r = csr[i]); i++) {
            if (r.type === CSSRule.IMPORT_RULE) {
              fakeLoad = fakeLoad && Boolean(r.styleSheet);
            }
          }
        }
        if (fakeLoad) {
          elt.dispatchEvent(new CustomEvent("load", {
            bubbles: false
          }));
        }
      }
    },
    parseScript: function(scriptElt) {
      var script = document.createElement("script");
      script.__importElement = scriptElt;
      script.src = scriptElt.src ? scriptElt.src : generateScriptDataUrl(scriptElt);
      scope.currentScript = scriptElt;
      this.trackElement(script, function(e) {
        script.parentNode.removeChild(script);
        scope.currentScript = null;
      });
      this.addElementToDocument(script);
    },
    nextToParse: function() {
      this._mayParse = [];
      return !this.parsingElement && (this.nextToParseInDoc(rootDocument) || this.nextToParseDynamic());
    },
    nextToParseInDoc: function(doc, link) {
      if (doc && this._mayParse.indexOf(doc) < 0) {
        this._mayParse.push(doc);
        var nodes = doc.querySelectorAll(this.parseSelectorsForNode(doc));
        for (var i = 0, l = nodes.length, p = 0, n; i < l && (n = nodes[i]); i++) {
          if (!this.isParsed(n)) {
            if (this.hasResource(n)) {
              return nodeIsImport(n) ? this.nextToParseInDoc(n.import, n) : n;
            } else {
              return;
            }
          }
        }
      }
      return link;
    },
    nextToParseDynamic: function() {
      return this.dynamicElements[0];
    },
    parseSelectorsForNode: function(node) {
      var doc = node.ownerDocument || node;
      return doc === rootDocument ? this.documentSelectors : this.importsSelectors;
    },
    isParsed: function(node) {
      return node.__importParsed;
    },
    needsDynamicParsing: function(elt) {
      return this.dynamicElements.indexOf(elt) >= 0;
    },
    hasResource: function(node) {
      if (nodeIsImport(node) && node.import === undefined) {
        return false;
      }
      return true;
    }
  };
  function nodeIsImport(elt) {
    return elt.localName === "link" && elt.rel === IMPORT_LINK_TYPE;
  }
  function generateScriptDataUrl(script) {
    var scriptContent = generateScriptContent(script);
    return "data:text/javascript;charset=utf-8," + encodeURIComponent(scriptContent);
  }
  function generateScriptContent(script) {
    return script.textContent + generateSourceMapHint(script);
  }
  function generateSourceMapHint(script) {
    var owner = script.ownerDocument;
    owner.__importedScripts = owner.__importedScripts || 0;
    var moniker = script.ownerDocument.baseURI;
    var num = owner.__importedScripts ? "-" + owner.__importedScripts : "";
    owner.__importedScripts++;
    return "\n//# sourceURL=" + moniker + num + ".js\n";
  }
  function cloneStyle(style) {
    var clone = style.ownerDocument.createElement("style");
    clone.textContent = style.textContent;
    path.resolveUrlsInStyle(clone);
    return clone;
  }
  scope.parser = importParser;
  scope.IMPORT_SELECTOR = IMPORT_SELECTOR;
});

HTMLImports.addModule(function(scope) {
  var flags = scope.flags;
  var IMPORT_LINK_TYPE = scope.IMPORT_LINK_TYPE;
  var IMPORT_SELECTOR = scope.IMPORT_SELECTOR;
  var rootDocument = scope.rootDocument;
  var Loader = scope.Loader;
  var Observer = scope.Observer;
  var parser = scope.parser;
  var importer = {
    documents: {},
    documentPreloadSelectors: IMPORT_SELECTOR,
    importsPreloadSelectors: [ IMPORT_SELECTOR ].join(","),
    loadNode: function(node) {
      importLoader.addNode(node);
    },
    loadSubtree: function(parent) {
      var nodes = this.marshalNodes(parent);
      importLoader.addNodes(nodes);
    },
    marshalNodes: function(parent) {
      return parent.querySelectorAll(this.loadSelectorsForNode(parent));
    },
    loadSelectorsForNode: function(node) {
      var doc = node.ownerDocument || node;
      return doc === rootDocument ? this.documentPreloadSelectors : this.importsPreloadSelectors;
    },
    loaded: function(url, elt, resource, err, redirectedUrl) {
      flags.load && console.log("loaded", url, elt);
      elt.__resource = resource;
      elt.__error = err;
      if (isImportLink(elt)) {
        var doc = this.documents[url];
        if (doc === undefined) {
          doc = err ? null : makeDocument(resource, redirectedUrl || url);
          if (doc) {
            doc.__importLink = elt;
            this.bootDocument(doc);
          }
          this.documents[url] = doc;
        }
        elt.import = doc;
      }
      parser.parseNext();
    },
    bootDocument: function(doc) {
      this.loadSubtree(doc);
      this.observer.observe(doc);
      parser.parseNext();
    },
    loadedAll: function() {
      parser.parseNext();
    }
  };
  var importLoader = new Loader(importer.loaded.bind(importer), importer.loadedAll.bind(importer));
  importer.observer = new Observer();
  function isImportLink(elt) {
    return isLinkRel(elt, IMPORT_LINK_TYPE);
  }
  function isLinkRel(elt, rel) {
    return elt.localName === "link" && elt.getAttribute("rel") === rel;
  }
  function makeDocument(resource, url) {
    var doc = document.implementation.createHTMLDocument(IMPORT_LINK_TYPE);
    doc._URL = url;
    var base = doc.createElement("base");
    base.setAttribute("href", url);
    if (!doc.baseURI) {
      Object.defineProperty(doc, "baseURI", {
        value: url
      });
    }
    var meta = doc.createElement("meta");
    meta.setAttribute("charset", "utf-8");
    doc.head.appendChild(meta);
    doc.head.appendChild(base);
    doc.body.innerHTML = resource;
    if (window.HTMLTemplateElement && HTMLTemplateElement.bootstrap) {
      HTMLTemplateElement.bootstrap(doc);
    }
    return doc;
  }
  if (!document.baseURI) {
    var baseURIDescriptor = {
      get: function() {
        var base = document.querySelector("base");
        return base ? base.href : window.location.href;
      },
      configurable: true
    };
    Object.defineProperty(document, "baseURI", baseURIDescriptor);
    Object.defineProperty(rootDocument, "baseURI", baseURIDescriptor);
  }
  scope.importer = importer;
  scope.importLoader = importLoader;
});

HTMLImports.addModule(function(scope) {
  var parser = scope.parser;
  var importer = scope.importer;
  var dynamic = {
    added: function(nodes) {
      var owner, parsed, loading;
      for (var i = 0, l = nodes.length, n; i < l && (n = nodes[i]); i++) {
        if (!owner) {
          owner = n.ownerDocument;
          parsed = parser.isParsed(owner);
        }
        loading = this.shouldLoadNode(n);
        if (loading) {
          importer.loadNode(n);
        }
        if (this.shouldParseNode(n) && parsed) {
          parser.parseDynamic(n, loading);
        }
      }
    },
    shouldLoadNode: function(node) {
      return node.nodeType === 1 && matches.call(node, importer.loadSelectorsForNode(node));
    },
    shouldParseNode: function(node) {
      return node.nodeType === 1 && matches.call(node, parser.parseSelectorsForNode(node));
    }
  };
  importer.observer.addCallback = dynamic.added.bind(dynamic);
  var matches = HTMLElement.prototype.matches || HTMLElement.prototype.matchesSelector || HTMLElement.prototype.webkitMatchesSelector || HTMLElement.prototype.mozMatchesSelector || HTMLElement.prototype.msMatchesSelector;
});

(function(scope) {
  var initializeModules = scope.initializeModules;
  var isIE = scope.isIE;
  if (scope.useNative) {
    return;
  }
  if (isIE && typeof window.CustomEvent !== "function") {
    window.CustomEvent = function(inType, params) {
      params = params || {};
      var e = document.createEvent("CustomEvent");
      e.initCustomEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
      return e;
    };
    window.CustomEvent.prototype = window.Event.prototype;
  }
  initializeModules();
  var rootDocument = scope.rootDocument;
  function bootstrap() {
    HTMLImports.importer.bootDocument(rootDocument);
  }
  if (document.readyState === "complete" || document.readyState === "interactive" && !window.attachEvent) {
    bootstrap();
  } else {
    document.addEventListener("DOMContentLoaded", bootstrap);
  }
})(HTMLImports);

window.CustomElements = window.CustomElements || {
  flags: {}
};

(function(scope) {
  var flags = scope.flags;
  var modules = [];
  var addModule = function(module) {
    modules.push(module);
  };
  var initializeModules = function() {
    modules.forEach(function(module) {
      module(scope);
    });
  };
  scope.addModule = addModule;
  scope.initializeModules = initializeModules;
  scope.hasNative = Boolean(document.registerElement);
  scope.useNative = !flags.register && scope.hasNative && !window.ShadowDOMPolyfill && (!window.HTMLImports || HTMLImports.useNative);
})(CustomElements);

CustomElements.addModule(function(scope) {
  var IMPORT_LINK_TYPE = window.HTMLImports ? HTMLImports.IMPORT_LINK_TYPE : "none";
  function forSubtree(node, cb) {
    findAllElements(node, function(e) {
      if (cb(e)) {
        return true;
      }
      forRoots(e, cb);
    });
    forRoots(node, cb);
  }
  function findAllElements(node, find, data) {
    var e = node.firstElementChild;
    if (!e) {
      e = node.firstChild;
      while (e && e.nodeType !== Node.ELEMENT_NODE) {
        e = e.nextSibling;
      }
    }
    while (e) {
      if (find(e, data) !== true) {
        findAllElements(e, find, data);
      }
      e = e.nextElementSibling;
    }
    return null;
  }
  function forRoots(node, cb) {
    var root = node.shadowRoot;
    while (root) {
      forSubtree(root, cb);
      root = root.olderShadowRoot;
    }
  }
  var processingDocuments;
  function forDocumentTree(doc, cb) {
    processingDocuments = [];
    _forDocumentTree(doc, cb);
    processingDocuments = null;
  }
  function _forDocumentTree(doc, cb) {
    doc = wrap(doc);
    if (processingDocuments.indexOf(doc) >= 0) {
      return;
    }
    processingDocuments.push(doc);
    var imports = doc.querySelectorAll("link[rel=" + IMPORT_LINK_TYPE + "]");
    for (var i = 0, l = imports.length, n; i < l && (n = imports[i]); i++) {
      if (n.import) {
        _forDocumentTree(n.import, cb);
      }
    }
    cb(doc);
  }
  scope.forDocumentTree = forDocumentTree;
  scope.forSubtree = forSubtree;
});

CustomElements.addModule(function(scope) {
  var flags = scope.flags;
  var forSubtree = scope.forSubtree;
  var forDocumentTree = scope.forDocumentTree;
  function addedNode(node) {
    return added(node) || addedSubtree(node);
  }
  function added(node) {
    if (scope.upgrade(node)) {
      return true;
    }
    attached(node);
  }
  function addedSubtree(node) {
    forSubtree(node, function(e) {
      if (added(e)) {
        return true;
      }
    });
  }
  function attachedNode(node) {
    attached(node);
    if (inDocument(node)) {
      forSubtree(node, function(e) {
        attached(e);
      });
    }
  }
  var hasPolyfillMutations = !window.MutationObserver || window.MutationObserver === window.JsMutationObserver;
  scope.hasPolyfillMutations = hasPolyfillMutations;
  var isPendingMutations = false;
  var pendingMutations = [];
  function deferMutation(fn) {
    pendingMutations.push(fn);
    if (!isPendingMutations) {
      isPendingMutations = true;
      setTimeout(takeMutations);
    }
  }
  function takeMutations() {
    isPendingMutations = false;
    var $p = pendingMutations;
    for (var i = 0, l = $p.length, p; i < l && (p = $p[i]); i++) {
      p();
    }
    pendingMutations = [];
  }
  function attached(element) {
    if (hasPolyfillMutations) {
      deferMutation(function() {
        _attached(element);
      });
    } else {
      _attached(element);
    }
  }
  function _attached(element) {
    if (element.__upgraded__ && (element.attachedCallback || element.detachedCallback)) {
      if (!element.__attached && inDocument(element)) {
        element.__attached = true;
        if (element.attachedCallback) {
          element.attachedCallback();
        }
      }
    }
  }
  function detachedNode(node) {
    detached(node);
    forSubtree(node, function(e) {
      detached(e);
    });
  }
  function detached(element) {
    if (hasPolyfillMutations) {
      deferMutation(function() {
        _detached(element);
      });
    } else {
      _detached(element);
    }
  }
  function _detached(element) {
    if (element.__upgraded__ && (element.attachedCallback || element.detachedCallback)) {
      if (element.__attached && !inDocument(element)) {
        element.__attached = false;
        if (element.detachedCallback) {
          element.detachedCallback();
        }
      }
    }
  }
  function inDocument(element) {
    var p = element;
    var doc = wrap(document);
    while (p) {
      if (p == doc) {
        return true;
      }
      p = p.parentNode || p.host;
    }
  }
  function watchShadow(node) {
    if (node.shadowRoot && !node.shadowRoot.__watched) {
      flags.dom && console.log("watching shadow-root for: ", node.localName);
      var root = node.shadowRoot;
      while (root) {
        observe(root);
        root = root.olderShadowRoot;
      }
    }
  }
  function handler(mutations) {
    if (flags.dom) {
      var mx = mutations[0];
      if (mx && mx.type === "childList" && mx.addedNodes) {
        if (mx.addedNodes) {
          var d = mx.addedNodes[0];
          while (d && d !== document && !d.host) {
            d = d.parentNode;
          }
          var u = d && (d.URL || d._URL || d.host && d.host.localName) || "";
          u = u.split("/?").shift().split("/").pop();
        }
      }
      console.group("mutations (%d) [%s]", mutations.length, u || "");
    }
    mutations.forEach(function(mx) {
      if (mx.type === "childList") {
        forEach(mx.addedNodes, function(n) {
          if (!n.localName) {
            return;
          }
          addedNode(n);
        });
        forEach(mx.removedNodes, function(n) {
          if (!n.localName) {
            return;
          }
          detachedNode(n);
        });
      }
    });
    flags.dom && console.groupEnd();
  }
  function takeRecords(node) {
    node = wrap(node);
    if (!node) {
      node = wrap(document);
    }
    while (node.parentNode) {
      node = node.parentNode;
    }
    var observer = node.__observer;
    if (observer) {
      handler(observer.takeRecords());
      takeMutations();
    }
  }
  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
  function observe(inRoot) {
    if (inRoot.__observer) {
      return;
    }
    var observer = new MutationObserver(handler);
    observer.observe(inRoot, {
      childList: true,
      subtree: true
    });
    inRoot.__observer = observer;
  }
  function upgradeDocument(doc) {
    doc = wrap(doc);
    flags.dom && console.group("upgradeDocument: ", doc.baseURI.split("/").pop());
    addedNode(doc);
    observe(doc);
    flags.dom && console.groupEnd();
  }
  function upgradeDocumentTree(doc) {
    forDocumentTree(doc, upgradeDocument);
  }
  var originalCreateShadowRoot = Element.prototype.createShadowRoot;
  Element.prototype.createShadowRoot = function() {
    var root = originalCreateShadowRoot.call(this);
    CustomElements.watchShadow(this);
    return root;
  };
  scope.watchShadow = watchShadow;
  scope.upgradeDocumentTree = upgradeDocumentTree;
  scope.upgradeSubtree = addedSubtree;
  scope.upgradeAll = addedNode;
  scope.attachedNode = attachedNode;
  scope.takeRecords = takeRecords;
});

CustomElements.addModule(function(scope) {
  var flags = scope.flags;
  function upgrade(node) {
    if (!node.__upgraded__ && node.nodeType === Node.ELEMENT_NODE) {
      var is = node.getAttribute("is");
      var definition = scope.getRegisteredDefinition(is || node.localName);
      if (definition) {
        if (is && definition.tag == node.localName) {
          return upgradeWithDefinition(node, definition);
        } else if (!is && !definition.extends) {
          return upgradeWithDefinition(node, definition);
        }
      }
    }
  }
  function upgradeWithDefinition(element, definition) {
    flags.upgrade && console.group("upgrade:", element.localName);
    if (definition.is) {
      element.setAttribute("is", definition.is);
    }
    implementPrototype(element, definition);
    element.__upgraded__ = true;
    created(element);
    scope.attachedNode(element);
    scope.upgradeSubtree(element);
    flags.upgrade && console.groupEnd();
    return element;
  }
  function implementPrototype(element, definition) {
    if (Object.__proto__) {
      element.__proto__ = definition.prototype;
    } else {
      customMixin(element, definition.prototype, definition.native);
      element.__proto__ = definition.prototype;
    }
  }
  function customMixin(inTarget, inSrc, inNative) {
    var used = {};
    var p = inSrc;
    while (p !== inNative && p !== HTMLElement.prototype) {
      var keys = Object.getOwnPropertyNames(p);
      for (var i = 0, k; k = keys[i]; i++) {
        if (!used[k]) {
          Object.defineProperty(inTarget, k, Object.getOwnPropertyDescriptor(p, k));
          used[k] = 1;
        }
      }
      p = Object.getPrototypeOf(p);
    }
  }
  function created(element) {
    if (element.createdCallback) {
      element.createdCallback();
    }
  }
  scope.upgrade = upgrade;
  scope.upgradeWithDefinition = upgradeWithDefinition;
  scope.implementPrototype = implementPrototype;
});

CustomElements.addModule(function(scope) {
  var upgradeDocumentTree = scope.upgradeDocumentTree;
  var upgrade = scope.upgrade;
  var upgradeWithDefinition = scope.upgradeWithDefinition;
  var implementPrototype = scope.implementPrototype;
  var useNative = scope.useNative;
  function register(name, options) {
    var definition = options || {};
    if (!name) {
      throw new Error("document.registerElement: first argument `name` must not be empty");
    }
    if (name.indexOf("-") < 0) {
      throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(name) + "'.");
    }
    if (isReservedTag(name)) {
      throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(name) + "'. The type name is invalid.");
    }
    if (getRegisteredDefinition(name)) {
      throw new Error("DuplicateDefinitionError: a type with name '" + String(name) + "' is already registered");
    }
    if (!definition.prototype) {
      definition.prototype = Object.create(HTMLElement.prototype);
    }
    definition.__name = name.toLowerCase();
    definition.lifecycle = definition.lifecycle || {};
    definition.ancestry = ancestry(definition.extends);
    resolveTagName(definition);
    resolvePrototypeChain(definition);
    overrideAttributeApi(definition.prototype);
    registerDefinition(definition.__name, definition);
    definition.ctor = generateConstructor(definition);
    definition.ctor.prototype = definition.prototype;
    definition.prototype.constructor = definition.ctor;
    if (scope.ready) {
      upgradeDocumentTree(document);
    }
    return definition.ctor;
  }
  function overrideAttributeApi(prototype) {
    if (prototype.setAttribute._polyfilled) {
      return;
    }
    var setAttribute = prototype.setAttribute;
    prototype.setAttribute = function(name, value) {
      changeAttribute.call(this, name, value, setAttribute);
    };
    var removeAttribute = prototype.removeAttribute;
    prototype.removeAttribute = function(name) {
      changeAttribute.call(this, name, null, removeAttribute);
    };
    prototype.setAttribute._polyfilled = true;
  }
  function changeAttribute(name, value, operation) {
    name = name.toLowerCase();
    var oldValue = this.getAttribute(name);
    operation.apply(this, arguments);
    var newValue = this.getAttribute(name);
    if (this.attributeChangedCallback && newValue !== oldValue) {
      this.attributeChangedCallback(name, oldValue, newValue);
    }
  }
  function isReservedTag(name) {
    for (var i = 0; i < reservedTagList.length; i++) {
      if (name === reservedTagList[i]) {
        return true;
      }
    }
  }
  var reservedTagList = [ "annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph" ];
  function ancestry(extnds) {
    var extendee = getRegisteredDefinition(extnds);
    if (extendee) {
      return ancestry(extendee.extends).concat([ extendee ]);
    }
    return [];
  }
  function resolveTagName(definition) {
    var baseTag = definition.extends;
    for (var i = 0, a; a = definition.ancestry[i]; i++) {
      baseTag = a.is && a.tag;
    }
    definition.tag = baseTag || definition.__name;
    if (baseTag) {
      definition.is = definition.__name;
    }
  }
  function resolvePrototypeChain(definition) {
    if (!Object.__proto__) {
      var nativePrototype = HTMLElement.prototype;
      if (definition.is) {
        var inst = document.createElement(definition.tag);
        var expectedPrototype = Object.getPrototypeOf(inst);
        if (expectedPrototype === definition.prototype) {
          nativePrototype = expectedPrototype;
        }
      }
      var proto = definition.prototype, ancestor;
      while (proto && proto !== nativePrototype) {
        ancestor = Object.getPrototypeOf(proto);
        proto.__proto__ = ancestor;
        proto = ancestor;
      }
      definition.native = nativePrototype;
    }
  }
  function instantiate(definition) {
    return upgradeWithDefinition(domCreateElement(definition.tag), definition);
  }
  var registry = {};
  function getRegisteredDefinition(name) {
    if (name) {
      return registry[name.toLowerCase()];
    }
  }
  function registerDefinition(name, definition) {
    registry[name] = definition;
  }
  function generateConstructor(definition) {
    return function() {
      return instantiate(definition);
    };
  }
  var HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
  function createElementNS(namespace, tag, typeExtension) {
    if (namespace === HTML_NAMESPACE) {
      return createElement(tag, typeExtension);
    } else {
      return domCreateElementNS(namespace, tag);
    }
  }
  function createElement(tag, typeExtension) {
    var definition = getRegisteredDefinition(typeExtension || tag);
    if (definition) {
      if (tag == definition.tag && typeExtension == definition.is) {
        return new definition.ctor();
      }
      if (!typeExtension && !definition.is) {
        return new definition.ctor();
      }
    }
    var element;
    if (typeExtension) {
      element = createElement(tag);
      element.setAttribute("is", typeExtension);
      return element;
    }
    element = domCreateElement(tag);
    if (tag.indexOf("-") >= 0) {
      implementPrototype(element, HTMLElement);
    }
    return element;
  }
  function cloneNode(deep) {
    var n = domCloneNode.call(this, deep);
    upgrade(n);
    return n;
  }
  var domCreateElement = document.createElement.bind(document);
  var domCreateElementNS = document.createElementNS.bind(document);
  var domCloneNode = Node.prototype.cloneNode;
  var isInstance;
  if (!Object.__proto__ && !useNative) {
    isInstance = function(obj, ctor) {
      var p = obj;
      while (p) {
        if (p === ctor.prototype) {
          return true;
        }
        p = p.__proto__;
      }
      return false;
    };
  } else {
    isInstance = function(obj, base) {
      return obj instanceof base;
    };
  }
  document.registerElement = register;
  document.createElement = createElement;
  document.createElementNS = createElementNS;
  Node.prototype.cloneNode = cloneNode;
  scope.registry = registry;
  scope.instanceof = isInstance;
  scope.reservedTagList = reservedTagList;
  scope.getRegisteredDefinition = getRegisteredDefinition;
  document.register = document.registerElement;
});

(function(scope) {
  var useNative = scope.useNative;
  var initializeModules = scope.initializeModules;
  var isIE11OrOlder = /Trident/.test(navigator.userAgent);
  if (useNative) {
    var nop = function() {};
    scope.watchShadow = nop;
    scope.upgrade = nop;
    scope.upgradeAll = nop;
    scope.upgradeDocumentTree = nop;
    scope.upgradeSubtree = nop;
    scope.takeRecords = nop;
    scope.instanceof = function(obj, base) {
      return obj instanceof base;
    };
  } else {
    initializeModules();
  }
  var upgradeDocumentTree = scope.upgradeDocumentTree;
  if (!window.wrap) {
    if (window.ShadowDOMPolyfill) {
      window.wrap = ShadowDOMPolyfill.wrapIfNeeded;
      window.unwrap = ShadowDOMPolyfill.unwrapIfNeeded;
    } else {
      window.wrap = window.unwrap = function(node) {
        return node;
      };
    }
  }
  function bootstrap() {
    upgradeDocumentTree(wrap(document));
    if (window.HTMLImports) {
      HTMLImports.__importsParsingHook = function(elt) {
        upgradeDocumentTree(wrap(elt.import));
      };
    }
    CustomElements.ready = true;
    setTimeout(function() {
      CustomElements.readyTime = Date.now();
      if (window.HTMLImports) {
        CustomElements.elapsed = CustomElements.readyTime - HTMLImports.readyTime;
      }
      document.dispatchEvent(new CustomEvent("WebComponentsReady", {
        bubbles: true
      }));
    });
  }
  if (isIE11OrOlder && typeof window.CustomEvent !== "function") {
    window.CustomEvent = function(inType, params) {
      params = params || {};
      var e = document.createEvent("CustomEvent");
      e.initCustomEvent(inType, Boolean(params.bubbles), Boolean(params.cancelable), params.detail);
      return e;
    };
    window.CustomEvent.prototype = window.Event.prototype;
  }
  if (document.readyState === "complete" || scope.flags.eager) {
    bootstrap();
  } else if (document.readyState === "interactive" && !window.attachEvent && (!window.HTMLImports || window.HTMLImports.ready)) {
    bootstrap();
  } else {
    var loadEvent = window.HTMLImports && !HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
    window.addEventListener(loadEvent, bootstrap);
  }
})(window.CustomElements);

(function(scope) {
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(scope) {
      var self = this;
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
        var args2 = args.slice();
        args2.push.apply(args2, arguments);
        return self.apply(scope, args2);
      };
    };
  }
})(window.WebComponents);

(function(scope) {
  
  if (!window.performance) {
    var start = Date.now();
    window.performance = {
      now: function() {
        return Date.now() - start;
      }
    };
  }
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function() {
      var nativeRaf = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
      return nativeRaf ? function(callback) {
        return nativeRaf(function() {
          callback(performance.now());
        });
      } : function(callback) {
        return window.setTimeout(callback, 1e3 / 60);
      };
    }();
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function() {
      return window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(id) {
        clearTimeout(id);
      };
    }();
  }
  var elementDeclarations = [];
  var polymerStub = function(name, dictionary) {
    if (typeof name !== "string" && arguments.length === 1) {
      Array.prototype.push.call(arguments, document._currentScript);
    }
    elementDeclarations.push(arguments);
  };
  window.Polymer = polymerStub;
  scope.consumeDeclarations = function(callback) {
    scope.consumeDeclarations = function() {
      throw "Possible attempt to load Polymer twice";
    };
    if (callback) {
      callback(elementDeclarations);
    }
    elementDeclarations = null;
  };
  function installPolymerWarning() {
    if (window.Polymer === polymerStub) {
      window.Polymer = function() {
        throw new Error("You tried to use polymer without loading it first. To " + 'load polymer, <link rel="import" href="' + 'components/polymer/polymer.html">');
      };
    }
  }
  if (HTMLImports.useNative) {
    installPolymerWarning();
  } else {
    addEventListener("DOMContentLoaded", installPolymerWarning);
  }
})(window.WebComponents);

(function(scope) {
  var style = document.createElement("style");
  style.textContent = "" + "body {" + "transition: opacity ease-in 0.2s;" + " } \n" + "body[unresolved] {" + "opacity: 0; display: block; overflow: hidden; position: relative;" + " } \n";
  var head = document.querySelector("head");
  head.insertBefore(style, head.firstChild);
})(window.WebComponents);

(function(scope) {
  window.Platform = scope;
})(window.WebComponents);
define('webcomponents', ['webcomponents/webcomponents'], function (main) { return main; });

define("webcomponents/webcomponents", function(){});

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
  'aurelia-http-client',
  'core-js',
  'webcomponents'
  ]);
define("aurelia-bundle-manifest", function(){});

