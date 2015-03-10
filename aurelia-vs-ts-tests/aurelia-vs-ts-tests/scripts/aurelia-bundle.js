define('aurelia-loader',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var hasTemplateElement = ("content" in document.createElement("template"));

  function importElements(frag, link, callback) {
    document.head.appendChild(frag);

    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(callback);
    } else {
      link.addEventListener("load", callback);
    }
  }

  var Loader = exports.Loader = (function () {
    function Loader() {
      _classCallCheck(this, Loader);
    }

    _prototypeProperties(Loader, {
      createDefaultLoader: {
        value: function createDefaultLoader() {
          throw new Error("No default loader module imported.");
        },
        writable: true,
        configurable: true
      }
    }, {
      loadModule: {
        value: function loadModule(id) {
          throw new Error("Loaders must implement loadModule(id).");
        },
        writable: true,
        configurable: true
      },
      loadAllModules: {
        value: function loadAllModules(ids) {
          throw new Error("Loader must implement loadAllModules(ids).");
        },
        writable: true,
        configurable: true
      },
      loadTemplate: {
        value: function loadTemplate(url) {
          throw new Error("Loader must implement loadTemplate(url).");
        },
        writable: true,
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
        configurable: true
      }
    });

    return Loader;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-metadata/origin',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var originStorage = new Map();

  function ensureType(value) {
    if (value instanceof Origin) {
      return value;
    }

    return new Origin(value);
  }

  /**
  * A metadata annotation that describes the origin module of the function to which it's attached.
  *
  * @class Origin
  * @constructor
  * @param {string} moduleId The origin module id.
  * @param {string} moduleMember The name of the export in the origin module.
  */

  var Origin = exports.Origin = (function () {
    function Origin(moduleId, moduleMember) {
      _classCallCheck(this, Origin);

      this.moduleId = moduleId;
      this.moduleMember = moduleMember;
    }

    _prototypeProperties(Origin, {
      get: {

        /**
        * Get the Origin annotation for the specified function.
        *
        * @method get
        * @static
        * @param {Function} fn The function to inspect for Origin metadata.
        * @return {Origin} Returns the Origin metadata.
        */

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
        configurable: true
      },
      set: {

        /**
        * Set the Origin annotation for the specified function.
        *
        * @method set
        * @static
        * @param {Function} fn The function to set the Origin metadata on.
        * @param {origin} fn The Origin metadata to store on the function.
        * @return {Origin} Returns the Origin metadata.
        */

        value: function set(fn, origin) {
          if (Origin.get(fn) === undefined) {
            originStorage.set(fn, origin);
          }
        },
        writable: true,
        configurable: true
      }
    });

    return Origin;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-metadata/resource-type',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  /**
  * An abstract base class used to designate resources which can be loaded and registered in a framework.
  *
  * @class ResourceType
  * @constructor
  */

  var ResourceType = exports.ResourceType = (function () {
    function ResourceType() {
      _classCallCheck(this, ResourceType);
    }

    _prototypeProperties(ResourceType, null, {
      load: {
        /**
        * Implemented by resource metadata to allow it to self-configure and load dependencies.
        *
        * @method load
        * @param {Container} container The dependency injection container to use for service resolution.
        * @param {Object} target The target that is decorated by this ResourceType metadata.
        * @return {Promise} Returns a promise for itself, resolving when all dependent resources are loaded.
        */

        value: function load(container, target) {
          return this;
        },
        writable: true,
        configurable: true
      },
      register: {

        /**
        * Implemented by resources to allow them to register themselved in a resource registry.
        *
        * @method register
        * @param {ResourceRegistry} registry The resource registry that this resource needs to be registered in.
        * @param {String} [name] A possible name override for the resource.
        */

        value: function register(registry, name) {
          throw new Error("All descendents of \"ResourceType\" must implement the \"register\" method.");
        },
        writable: true,
        configurable: true
      }
    });

    return ResourceType;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-metadata/metadata',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var functionMetadataStorage = new Map(),
      emptyArray = Object.freeze([]),
      locateFunctionMetadataElsewhere;

  /**
  * Stores metadata and provides helpers for searching and adding to it.
  *
  * @class MetadataStorage
  */

  var MetadataStorage = (function () {
    function MetadataStorage(metadata, owner) {
      _classCallCheck(this, MetadataStorage);

      this.metadata = metadata;
      this.owner = owner;
    }

    _prototypeProperties(MetadataStorage, null, {
      first: {

        /**
        * Searches metadata and returns the first instance of a particular type.
        *
        * @method first
        * @param {Function} type The metadata type to look for.
        * @param {Boolean} searchPrototype Indicates whether or not to search the inheritance hierarchy for metadata.
        * @return {Object} Returns an instance of the specified metadata type if found; otherwise null.
        */

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
        configurable: true
      },
      has: {
        value: function has(type, searchPrototype) {
          return this.first(type, searchPrototype) !== null;
        },
        writable: true,
        configurable: true
      },
      all: {

        /**
        * Searches metadata for all instances of a particular type.
        *
        * @method all
        * @param {Function} type The metadata type to look for.
        * @param {Boolean} searchPrototype Indicates whether or not to search the inheritance hierarchy for metadata.
        * @return {Array} Returns an array of the specified metadata type.
        */

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
        configurable: true
      },
      add: {

        /**
        * Adds metadata.
        *
        * @method add
        * @param {Object} instance The metadata instance to add.
        */

        value: function add(instance) {
          if (this.metadata === undefined) {
            this.metadata = [];
          }

          this.last = instance;
          this.metadata.push(instance);
          return this;
        },
        writable: true,
        configurable: true
      },
      and: {
        value: function and(func) {
          func(this.last);
          return this;
        },
        writable: true,
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

  /**
  * Provides access to metadata.
  *
  * @class Metadata
  * @static
  */
  var Metadata = exports.Metadata = {
    /**
    * Locates the metadata on the owner.
    *
    * @method on
    * @param {Function} owner The owner of the metadata.
    * @return {MetadataStorage} Returns the stored metadata.
    */
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
      /**
      * Adds an additional location to search for metadata in.
      *
      * @method location
      * @param {String} staticPropertyName The name of the property on the function instance to search for metadata.
      */
      location: function location(staticPropertyName) {
        this.locator(function (fn) {
          return fn[staticPropertyName];
        });
      },
      /**
      * Adds a function capable of locating metadata.
      *
      * @method locator
      * @param {Function} locator Configures a function which searches for metadata. It should return undefined if none is found.
      */
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-metadata/index',["exports", "./origin", "./resource-type", "./metadata"], function (exports, _origin, _resourceType, _metadata) {
  

  /**
   * Utilities for reading and writing the metadata of JavaScript functions.
   *
   * @module metadata
   */

  exports.Origin = _origin.Origin;
  exports.ResourceType = _resourceType.ResourceType;
  exports.Metadata = _metadata.Metadata;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-metadata', ['aurelia-metadata/index'], function (main) { return main; });

define('aurelia-path',["exports"], function (exports) {
  

  exports.relativeToFile = relativeToFile;
  exports.join = join;
  exports.buildQueryString = buildQueryString;
  function trimDots(ary) {
    var i, part;
    for (i = 0; i < ary.length; ++i) {
      part = ary[i];
      if (part === ".") {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === "..") {
        // If at the start, or previous value is still ..,
        // keep them so that when converted to a path it may
        // still work when converted to a path, even though
        // as an ID it is less than ideal. In larger point
        // releases, may be better to just kick out an error.
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
      //Convert file to array, and lop off the last part,
      //so that . matches that 'directory' and not name of the file's
      //module. For instance, file of 'one/two/three', maps to
      //'one/two/three.js', but we want the directory, 'one/two' for
      //this normalization.
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

  var r20 = /%20/g,
      rbracket = /\[\]$/,
      class2type = {};

  "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function (name, i) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

  function type(obj) {
    if (obj == null) {
      return obj + "";
    }

    // Support: Android<4.0 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
  }

  function buildQueryString(a, traditional) {
    var prefix,
        s = [],
        add = function add(key, value) {
      // If value is a function, invoke it and return its value
      value = typeof value === "function" ? value() : value == null ? "" : value;
      s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    };

    for (prefix in a) {
      _buildQueryString(prefix, a[prefix], traditional, add);
    }

    // Return the resulting serialization
    return s.join("&").replace(r20, "+");
  }

  function _buildQueryString(prefix, obj, traditional, add) {
    var name;

    if (Array.isArray(obj)) {
      // Serialize array item.
      obj.forEach(function (v, i) {
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v);
        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          _buildQueryString(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
        }
      });
    } else if (!traditional && type(obj) === "object") {
      // Serialize object item.
      for (name in obj) {
        _buildQueryString(prefix + "[" + name + "]", obj[name], traditional, add);
      }
    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  }
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-loader-default',["exports", "aurelia-metadata", "aurelia-loader", "aurelia-path"], function (exports, _aureliaMetadata, _aureliaLoader, _aureliaPath) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var DefaultLoader = exports.DefaultLoader = (function (Loader) {
    function DefaultLoader() {
      _classCallCheck(this, DefaultLoader);

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

          if (baseUrl && id.indexOf(baseUrl) !== 0) {
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
        configurable: true
      },
      loadAllModules: {
        value: function loadAllModules(ids) {
          var loads = [];

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = ids[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var id = _step.value;

              loads.push(this.loadModule(id));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          return Promise.all(loads);
        },
        writable: true,
        configurable: true
      },
      loadTemplate: {
        value: function loadTemplate(url) {
          if (this.baseViewUrl && url.indexOf(this.baseViewUrl) !== 0) {
            url = join(this.baseViewUrl, url);
          }

          return this.importTemplate(url);
        },
        writable: true,
        configurable: true
      }
    });

    return DefaultLoader;
  })(Loader);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-task-queue',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
      // We dispatch a timeout with a specified delay of 0 for engines that
      // can reliably accommodate that request. This will usually be snapped
      // to a 4 milisecond delay, but once we're flushing, there's no delay
      // between events.
      var timeoutHandle = setTimeout(handleFlushTimer, 0);
      // However, since this timer gets frequently dropped in Firefox
      // workers, we enlist an interval handle that will try to fire
      // an event 20 times per second until it succeeds.
      var intervalHandle = setInterval(handleFlushTimer, 50);
      function handleFlushTimer() {
        // Whichever timer succeeds will cancel both timers and request the
        // flush.
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      }
    };
  }

  var TaskQueue = exports.TaskQueue = (function () {
    function TaskQueue() {
      var _this = this;

      _classCallCheck(this, TaskQueue);

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
          if (this.microTaskQueue.length < 1) {
            this.requestFlushMicroTaskQueue();
          }

          this.microTaskQueue.push(task);
        },
        writable: true,
        configurable: true
      },
      queueTask: {
        value: function queueTask(task) {
          if (this.taskQueue.length < 1) {
            this.requestFlushTaskQueue();
          }

          this.taskQueue.push(task);
        },
        writable: true,
        configurable: true
      },
      flushTaskQueue: {
        value: function flushTaskQueue() {
          var queue = this.taskQueue,
              index = 0,
              task;

          this.taskQueue = []; //recursive calls to queueTask should be scheduled after the next cycle

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

            // Prevent leaking memory for long chains of recursive calls to `queueMicroTask`.
            // If we call `queueMicroTask` within a MicroTask scheduled by `queueMicroTask`, the queue will
            // grow, but to avoid an O(n) walk for every MicroTask we execute, we don't
            // shift MicroTasks off the queue after they have been executed.
            // Instead, we periodically shift 1024 MicroTasks off the queue.
            if (index > capacity) {
              // Manually shift all values starting at the index back to the
              // beginning of the queue.
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
        configurable: true
      }
    });

    return TaskQueue;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-logging',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  /**
  * Gets an instance of a logger by the Id used when creating.
  *
  * @method getLogger
  * @param {string} id The id of the logger you wish to get an instance of.
  * @return {Logger} The instance of the logger, or creates a new logger if none exists for that Id.
  * @for export
  */
  exports.getLogger = getLogger;

  /**
   * Adds an appender capable of processing logs and channeling them to an output.
   *
   * @method addAppender
   * @param {Object} appender An appender instance to begin processing logs with.
   * @for export
   */
  exports.addAppender = addAppender;

  /**
  * Sets the level of the logging for the application loggers
  *
  * @method setLevel
  * @param {Number} level Matches an enum specifying the level of logging.
  * @for export
  */
  exports.setLevel = setLevel;
  /**
   * This library is part of the Aurelia platform and contains a minimal but effective logging mechanism
   * with support for log levels and pluggable log appenders.
   *
   * @module logging
   */

  /**
  * Enum specifying the levels of the logger
  * 
  * @property levels
  * @type Enum
  * @for export
  */
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

  /**
  * The logger is essentially responsible for having log statements that appear during debugging but are squelched
  * when using the build tools, depending on the log level that is set.  The available levels are -
  * 1. none
  * 2. error
  * 3. warn
  * 4. info
  * 5. debug
  *
  * You cannot instantiate the logger directly - you must use the getLogger method instead.
  *
  * @class Logger
  * @constructor
  */

  var Logger = exports.Logger = (function () {
    function Logger(id, key) {
      _classCallCheck(this, Logger);

      if (key !== loggerConstructionKey) {
        throw new Error("You cannot instantiate \"Logger\". Use the \"getLogger\" API instead.");
      }

      this.id = id;
    }

    _prototypeProperties(Logger, null, {
      debug: {

        /**
         * Logs a debug message.
         *
         * @method debug
         * @param {string} message The message to log
         */

        value: function debug() {},
        writable: true,
        configurable: true
      },
      info: {

        /**
         * Logs info.
         *
         * @method info
         * @param {string} message The message to log
         */

        value: function info() {},
        writable: true,
        configurable: true
      },
      warn: {

        /**
         * Logs a warning.
         *
         * @method warn
         * @param {string} message The message to log
         */

        value: function warn() {},
        writable: true,
        configurable: true
      },
      error: {

        /**
         * Logs an error.
         *
         * @method error
         * @param {string} message The message to log
         */

        value: function error() {},
        writable: true,
        configurable: true
      }
    });

    return Logger;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-logging-console',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ConsoleAppender = exports.ConsoleAppender = (function () {
    function ConsoleAppender() {
      _classCallCheck(this, ConsoleAppender);
    }

    _prototypeProperties(ConsoleAppender, null, {
      debug: {
        value: function debug(logger, message) {
          for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rest[_key - 2] = arguments[_key];
          }

          console.debug.apply(console, ["DEBUG [" + logger.id + "] " + message].concat(rest));
        },
        writable: true,
        configurable: true
      },
      info: {
        value: function info(logger, message) {
          for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rest[_key - 2] = arguments[_key];
          }

          console.info.apply(console, ["INFO [" + logger.id + "] " + message].concat(rest));
        },
        writable: true,
        configurable: true
      },
      warn: {
        value: function warn(logger, message) {
          for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rest[_key - 2] = arguments[_key];
          }

          console.warn.apply(console, ["WARN [" + logger.id + "] " + message].concat(rest));
        },
        writable: true,
        configurable: true
      },
      error: {
        value: function error(logger, message) {
          for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            rest[_key - 2] = arguments[_key];
          }

          console.error.apply(console, ["ERROR [" + logger.id + "] " + message].concat(rest));
        },
        writable: true,
        configurable: true
      }
    });

    return ConsoleAppender;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-history',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var History = exports.History = (function () {
    function History() {
      _classCallCheck(this, History);
    }

    _prototypeProperties(History, null, {
      activate: {
        value: function activate() {
          throw new Error("History must implement activate().");
        },
        writable: true,
        configurable: true
      },
      deactivate: {
        value: function deactivate() {
          throw new Error("History must implement deactivate().");
        },
        writable: true,
        configurable: true
      },
      navigate: {
        value: function navigate() {
          throw new Error("History must implement navigate().");
        },
        writable: true,
        configurable: true
      },
      navigateBack: {
        value: function navigateBack() {
          throw new Error("History must implement navigateBack().");
        },
        writable: true,
        configurable: true
      }
    });

    return History;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-history-browser',["exports", "aurelia-history"], function (exports, _aureliaHistory) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var History = _aureliaHistory.History;

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Update the hash location, either replacing the current entry, or adding
  // a new one to the browser history.
  function updateHash(location, fragment, replace) {
    if (replace) {
      var href = location.href.replace(/(javascript:|#).*$/, "");
      location.replace(href + "#" + fragment);
    } else {
      // Some browsers require that `hash` contains a leading #.
      location.hash = "#" + fragment;
    }
  }

  var BrowserHistory = (function (History) {
    function BrowserHistory() {
      _classCallCheck(this, BrowserHistory);

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
        configurable: true
      },
      activate: {
        value: function activate(options) {
          if (this.active) {
            throw new Error("History has already been activated.");
          }

          this.active = true;

          // Figure out the initial configuration. Do we need an iframe?
          // Is pushState desired ... is it available?
          this.options = Object.assign({}, { root: "/" }, this.options, options);
          this.root = this.options.root;
          this._wantsHashChange = this.options.hashChange !== false;
          this._wantsPushState = !!this.options.pushState;
          this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

          var fragment = this.getFragment();

          // Normalize root to always include a leading and trailing slash.
          this.root = ("/" + this.root + "/").replace(rootStripper, "/");

          // Depending on whether we're using pushState or hashes, and whether
          // 'onhashchange' is supported, determine how we check the URL state.
          if (this._hasPushState) {
            window.onpopstate = this._checkUrlCallback;
          } else if (this._wantsHashChange && "onhashchange" in window) {
            window.addEventListener("hashchange", this._checkUrlCallback);
          } else if (this._wantsHashChange) {
            this._checkUrlInterval = setInterval(this._checkUrlCallback, this.interval);
          }

          // Determine if we need to change the base url, for a pushState link
          // opened by a non-pushState browser.
          this.fragment = fragment;

          var loc = this.location;
          var atRoot = loc.pathname.replace(/[^\/]$/, "$&/") === this.root;

          // Transition from hashChange to pushState or vice versa if both are requested.
          if (this._wantsHashChange && this._wantsPushState) {
            // If we've started off with a route from a `pushState`-enabled
            // browser, but we're currently in a browser that doesn't support it...
            if (!this._hasPushState && !atRoot) {
              this.fragment = this.getFragment(null, true);
              this.location.replace(this.root + this.location.search + "#" + this.fragment);
              // Return immediately as browser will do redirect to new url
              return true;

              // Or if we've started out with a hash-based route, but we're currently
              // in a browser where it could be `pushState`-based instead...
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
        configurable: true
      },
      loadUrl: {
        value: function loadUrl(fragmentOverride) {
          var fragment = this.fragment = this.getFragment(fragmentOverride);

          return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
        },
        writable: true,
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

          // Don't include a trailing slash on the root.
          if (fragment === "" && url !== "/") {
            url = url.slice(0, -1);
          }

          // If pushState is available, we use it to set the fragment as a real URL.
          if (this._hasPushState) {
            this.history[options.replace ? "replaceState" : "pushState"]({}, document.title, url);

            // If hash changes haven't been explicitly disabled, update the hash
            // fragment to store history.
          } else if (this._wantsHashChange) {
            updateHash(this.location, fragment, options.replace);

            if (this.iframe && fragment !== this.getFragment(this.getHash(this.iframe))) {
              // Opening and closing the iframe tricks IE7 and earlier to push a
              // history entry on hash-tag change.  When replace is true, we don't
              // want history.
              if (!options.replace) {
                this.iframe.document.open().close();
              }

              updateHash(this.iframe.location, fragment, options.replace);
            }

            // If you've told us that you explicitly don't want fallback hashchange-
            // based history, then `navigate` becomes a page refresh.
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
        configurable: true
      },
      navigateBack: {
        value: function navigateBack() {
          this.history.back();
        },
        writable: true,
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-event-aggregator',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.includeEventsIn = includeEventsIn;
  exports.install = install;

  var Handler = (function () {
    function Handler(messageType, callback) {
      _classCallCheck(this, Handler);

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
        configurable: true
      }
    });

    return Handler;
  })();

  var EventAggregator = exports.EventAggregator = (function () {
    function EventAggregator() {
      _classCallCheck(this, EventAggregator);

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
        configurable: true
      }
    });

    return EventAggregator;
  })();

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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-dependency-injection/metadata',["exports"], function (exports) {
  

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  /**
  * An abstract annotation used to allow functions/classes to indicate how they should be registered with the container.
  *
  * @class Registration
  * @constructor
  */

  var Registration = exports.Registration = (function () {
    function Registration() {
      _classCallCheck(this, Registration);
    }

    _prototypeProperties(Registration, null, {
      register: {
        /**
        * Called by the container to allow custom registration logic for the annotated function/class.
        *
        * @method register
        * @param {Container} container The container to register with.
        * @param {Object} key The key to register as.
        * @param {Object} fn The function to register (target of the annotation).
        */

        value: function register(container, key, fn) {
          throw new Error("A custom Registration must implement register(container, key, fn).");
        },
        writable: true,
        configurable: true
      }
    });

    return Registration;
  })();

  /**
  * An annotation used to allow functions/classes to indicate that they should be registered as transients with the container.
  *
  * @class Transient
  * @constructor
  * @extends Registration
  * @param {Object} [key] The key to register as.
  */

  var Transient = exports.Transient = (function (Registration) {
    function Transient(key) {
      _classCallCheck(this, Transient);

      this.key = key;
    }

    _inherits(Transient, Registration);

    _prototypeProperties(Transient, null, {
      register: {

        /**
        * Called by the container to register the annotated function/class as transient.
        *
        * @method register
        * @param {Container} container The container to register with.
        * @param {Object} key The key to register as.
        * @param {Object} fn The function to register (target of the annotation).
        */

        value: function register(container, key, fn) {
          container.registerTransient(this.key || key, fn);
        },
        writable: true,
        configurable: true
      }
    });

    return Transient;
  })(Registration);

  /**
  * An annotation used to allow functions/classes to indicate that they should be registered as singletons with the container.
  *
  * @class Singleton
  * @constructor
  * @extends Registration
  * @param {Object} [key] The key to register as.
  */

  var Singleton = exports.Singleton = (function (Registration) {
    function Singleton(keyOrRegisterInRoot) {
      var registerInRoot = arguments[1] === undefined ? false : arguments[1];

      _classCallCheck(this, Singleton);

      if (typeof keyOrRegisterInRoot === "boolean") {
        this.registerInRoot = keyOrRegisterInRoot;
      } else {
        this.key = keyOrRegisterInRoot;
        this.registerInRoot = registerInRoot;
      }
    }

    _inherits(Singleton, Registration);

    _prototypeProperties(Singleton, null, {
      register: {

        /**
        * Called by the container to register the annotated function/class as a singleton.
        *
        * @method register
        * @param {Container} container The container to register with.
        * @param {Object} key The key to register as.
        * @param {Object} fn The function to register (target of the annotation).
        */

        value: function register(container, key, fn) {
          var destination = this.registerInRoot ? container.root : container;
          destination.registerSingleton(this.key || key, fn);
        },
        writable: true,
        configurable: true
      }
    });

    return Singleton;
  })(Registration);

  /**
  * An abstract annotation used to allow functions/classes to specify custom dependency resolution logic.
  *
  * @class Resolver
  * @constructor
  */

  var Resolver = exports.Resolver = (function () {
    function Resolver() {
      _classCallCheck(this, Resolver);
    }

    _prototypeProperties(Resolver, null, {
      get: {
        /**
        * Called by the container to allow custom resolution of dependencies for a function/class.
        *
        * @method get
        * @param {Container} container The container to resolve from.
        * @return {Object} Returns the resolved object.
        */

        value: function get(container) {
          throw new Error("A custom Resolver must implement get(container) and return the resolved instance(s).");
        },
        writable: true,
        configurable: true
      }
    });

    return Resolver;
  })();

  /**
  * An annotation used to allow functions/classes to specify lazy resolution logic.
  *
  * @class Lazy
  * @constructor
  * @extends Resolver
  * @param {Object} key The key to lazily resolve.
  */

  var Lazy = exports.Lazy = (function (Resolver) {
    function Lazy(key) {
      _classCallCheck(this, Lazy);

      this.key = key;
    }

    _inherits(Lazy, Resolver);

    _prototypeProperties(Lazy, {
      of: {

        /**
        * Creates a Lazy Resolver for the supplied key.
        *
        * @method of
        * @static
        * @param {Object} key The key to lazily resolve.
        * @return {Lazy} Returns an insance of Lazy for the key.
        */

        value: function of(key) {
          return new Lazy(key);
        },
        writable: true,
        configurable: true
      }
    }, {
      get: {

        /**
        * Called by the container to lazily resolve the dependency into a lazy locator function.
        *
        * @method get
        * @param {Container} container The container to resolve from.
        * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
        */

        value: function get(container) {
          var _this = this;

          return function () {
            return container.get(_this.key);
          };
        },
        writable: true,
        configurable: true
      }
    });

    return Lazy;
  })(Resolver);

  /**
  * An annotation used to allow functions/classes to specify resolution of all matches to a key.
  *
  * @class All
  * @constructor
  * @extends Resolver
  * @param {Object} key The key to lazily resolve all matches for.
  */

  var All = exports.All = (function (Resolver) {
    function All(key) {
      _classCallCheck(this, All);

      this.key = key;
    }

    _inherits(All, Resolver);

    _prototypeProperties(All, {
      of: {

        /**
        * Creates an All Resolver for the supplied key.
        *
        * @method of
        * @static
        * @param {Object} key The key to resolve all instances for.
        * @return {All} Returns an insance of All for the key.
        */

        value: function of(key) {
          return new All(key);
        },
        writable: true,
        configurable: true
      }
    }, {
      get: {

        /**
        * Called by the container to resolve all matching dependencies as an array of instances.
        *
        * @method get
        * @param {Container} container The container to resolve from.
        * @return {Object[]} Returns an array of all matching instances.
        */

        value: function get(container) {
          return container.getAll(this.key);
        },
        writable: true,
        configurable: true
      }
    });

    return All;
  })(Resolver);

  /**
  * An annotation used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
  *
  * @class Optional
  * @constructor
  * @extends Resolver
  * @param {Object} key The key to optionally resolve for.
  * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
  */

  var Optional = exports.Optional = (function (Resolver) {
    function Optional(key) {
      var checkParent = arguments[1] === undefined ? false : arguments[1];

      _classCallCheck(this, Optional);

      this.key = key;
      this.checkParent = checkParent;
    }

    _inherits(Optional, Resolver);

    _prototypeProperties(Optional, {
      of: {

        /**
        * Creates an Optional Resolver for the supplied key.
        *
        * @method of
        * @static
        * @param {Object} key The key to optionally resolve for.
        * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
        * @return {Optional} Returns an insance of Optional for the key.
        */

        value: function of(key) {
          var checkParent = arguments[1] === undefined ? false : arguments[1];

          return new Optional(key, checkParent);
        },
        writable: true,
        configurable: true
      }
    }, {
      get: {

        /**
        * Called by the container to provide optional resolution of the key.
        *
        * @method get
        * @param {Container} container The container to resolve from.
        * @return {Object} Returns the instance if found; otherwise null.
        */

        value: function get(container) {
          if (container.hasHandler(this.key, this.checkParent)) {
            return container.get(this.key);
          }

          return null;
        },
        writable: true,
        configurable: true
      }
    });

    return Optional;
  })(Resolver);

  /**
  * An annotation used to inject the dependency from the parent container instead of the current one.
  *
  * @class Parent
  * @constructor
  * @extends Resolver
  * @param {Object} key The key to resolve from the parent container.
  */

  var Parent = exports.Parent = (function (Resolver) {
    function Parent(key) {
      _classCallCheck(this, Parent);

      this.key = key;
    }

    _inherits(Parent, Resolver);

    _prototypeProperties(Parent, {
      of: {

        /**
        * Creates a Parent Resolver for the supplied key.
        *
        * @method of
        * @static
        * @param {Object} key The key to resolve.
        * @return {Parent} Returns an insance of Parent for the key.
        */

        value: function of(key) {
          return new Parent(key);
        },
        writable: true,
        configurable: true
      }
    }, {
      get: {

        /**
        * Called by the container to load the dependency from the parent container
        *
        * @method get
        * @param {Container} container The container to resolve the parent from.
        * @return {Function} Returns the matching instance from the parent container
        */

        value: function get(container) {
          return container.parent ? container.parent.get(this.key) : null;
        },
        writable: true,
        configurable: true
      }
    });

    return Parent;
  })(Resolver);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-dependency-injection/util',["exports"], function (exports) {
  

  exports.isClass = isClass;
  // Fix Function#name on browsers that do not support it (IE):
  function test() {}
  if (!test.name) {
    Object.defineProperty(Function.prototype, "name", {
      get: function get() {
        var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
        // For better performance only parse once, and then cache the
        // result through a new accessor for repeated access.
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-dependency-injection/container',["exports", "aurelia-metadata", "./metadata", "./util"], function (exports, _aureliaMetadata, _metadata, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Metadata = _aureliaMetadata.Metadata;
  var Resolver = _metadata.Resolver;
  var Registration = _metadata.Registration;
  var isClass = _util.isClass;

  var emptyParameters = Object.freeze([]);

  /**
  * A lightweight, extensible dependency injection container.
  *
  * @class Container
  * @constructor
  */

  var Container = exports.Container = (function () {
    function Container(constructionInfo) {
      _classCallCheck(this, Container);

      this.constructionInfo = constructionInfo || new Map();
      this.entries = new Map();
      this.root = this;
    }

    _prototypeProperties(Container, null, {
      supportAtScript: {

        /**
        * Add support for AtScript RTTI according to spec at http://www.atscript.org
        *
        * @method useAtScript
        */

        value: function supportAtScript() {
          this.addParameterInfoLocator(function (fn) {
            var parameters = fn.parameters,
                keys,
                i,
                ii;

            if (parameters) {
              keys = new Array(parameters.length);

              for (i = 0, ii = parameters.length; i < ii; ++i) {
                keys[i] = parameters[i].is || parameters[i][0];
              }
            }

            return keys;
          });
        },
        writable: true,
        configurable: true
      },
      addParameterInfoLocator: {

        /**
        * Adds an additional location to search for constructor parameter type info.
        *
        * @method addParameterInfoLocator
        * @param {Function} locator Configures a locator function to use when searching for parameter info. It should return undefined if no parameter info is found.
        */

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
        configurable: true
      },
      registerInstance: {

        /**
        * Registers an existing object instance with the container.
        *
        * @method registerInstance
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        * @param {Object} instance The instance that will be resolved when the key is matched.
        */

        value: function registerInstance(key, instance) {
          this.registerHandler(key, function (x) {
            return instance;
          });
        },
        writable: true,
        configurable: true
      },
      registerTransient: {

        /**
        * Registers a type (constructor function) such that the container returns a new instance for each request.
        *
        * @method registerTransient
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        * @param {Function} [fn] The constructor function to use when the dependency needs to be instantiated.
        */

        value: function registerTransient(key, fn) {
          fn = fn || key;
          this.registerHandler(key, function (x) {
            return x.invoke(fn);
          });
        },
        writable: true,
        configurable: true
      },
      registerSingleton: {

        /**
        * Registers a type (constructor function) such that the container always returns the same instance for each request.
        *
        * @method registerSingleton
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        * @param {Function} [fn] The constructor function to use when the dependency needs to be instantiated.
        */

        value: function registerSingleton(key, fn) {
          var singleton = null;
          fn = fn || key;
          this.registerHandler(key, function (x) {
            return singleton || (singleton = x.invoke(fn));
          });
        },
        writable: true,
        configurable: true
      },
      autoRegister: {

        /**
        * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default singleton registration is used.
        *
        * @method autoRegister
        * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
        * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
        */

        value: function autoRegister(fn, key) {
          var registration;

          if (fn === null || fn === undefined) {
            throw new Error("fn cannot be null or undefined.");
          }

          registration = Metadata.on(fn).first(Registration, true);

          if (registration) {
            registration.register(this, key || fn, fn);
          } else {
            this.registerSingleton(key || fn, fn);
          }
        },
        writable: true,
        configurable: true
      },
      autoRegisterAll: {

        /**
        * Registers an array of types (constructor functions) by inspecting their registration annotations. If none are found, then the default singleton registration is used.
        *
        * @method autoRegisterAll
        * @param {Function[]} fns The constructor function to use when the dependency needs to be instantiated.
        */

        value: function autoRegisterAll(fns) {
          var i = fns.length;
          while (i--) {
            this.autoRegister(fns[i]);
          }
        },
        writable: true,
        configurable: true
      },
      registerHandler: {

        /**
        * Registers a custom resolution function such that the container calls this function for each request to obtain the instance.
        *
        * @method registerHandler
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        * @param {Function} handler The resolution function to use when the dependency is needed. It will be passed one arguement, the container instance that is invoking it.
        */

        value: function registerHandler(key, handler) {
          this.getOrCreateEntry(key).push(handler);
        },
        writable: true,
        configurable: true
      },
      get: {

        /**
        * Resolves a single instance based on the provided key.
        *
        * @method get
        * @param {Object} key The key that identifies the object to resolve.
        * @return {Object} Returns the resolved instance.
        */

        value: function get(key) {
          var entry;

          if (key === null || key === undefined) {
            throw new Error("key cannot be null or undefined.");
          }

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
        configurable: true
      },
      getAll: {

        /**
        * Resolves all instance registered under the provided key.
        *
        * @method getAll
        * @param {Object} key The key that identifies the objects to resolve.
        * @return {Object[]} Returns an array of the resolved instances.
        */

        value: function getAll(key) {
          var _this = this;

          var entry;

          if (key === null || key === undefined) {
            throw new Error("key cannot be null or undefined.");
          }

          entry = this.entries.get(key);

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
        configurable: true
      },
      hasHandler: {

        /**
        * Inspects the container to determine if a particular key has been registred.
        *
        * @method hasHandler
        * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
        * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
        * @return {Boolean} Returns true if the key has been registred; false otherwise.
        */

        value: function hasHandler(key) {
          var checkParent = arguments[1] === undefined ? false : arguments[1];

          if (key === null || key === undefined) {
            throw new Error("key cannot be null or undefined.");
          }

          return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
        },
        writable: true,
        configurable: true
      },
      createChild: {

        /**
        * Creates a new dependency injection container whose parent is the current container.
        *
        * @method createChild
        * @return {Container} Returns a new container instance parented to this.
        */

        value: function createChild() {
          var childContainer = new Container(this.constructionInfo);
          childContainer.parent = this;
          childContainer.root = this.root;
          childContainer.locateParameterInfoElsewhere = this.locateParameterInfoElsewhere;
          return childContainer;
        },
        writable: true,
        configurable: true
      },
      invoke: {

        /**
        * Invokes a function, recursively resolving its dependencies.
        *
        * @method invoke
        * @param {Function} fn The function to invoke with the auto-resolved dependencies.
        * @return {Object} Returns the instance resulting from calling the function.
        */

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
        configurable: true
      },
      getOrCreateEntry: {
        value: function getOrCreateEntry(key) {
          var entry;

          if (key === null || key === undefined) {
            throw new Error("key cannot be null or undefined.");
          }

          entry = this.entries.get(key);

          if (entry === undefined) {
            entry = [];
            this.entries.set(key, entry);
          }

          return entry;
        },
        writable: true,
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
        configurable: true
      }
    });

    return Container;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-dependency-injection/index',["exports", "aurelia-metadata", "./metadata", "./container"], function (exports, _aureliaMetadata, _metadata, _container) {
  

  /**
   * A lightweight, extensible dependency injection container for JavaScript.
   *
   * @module dependency-injection
   */
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/value-converter',["exports", "aurelia-metadata"], function (exports, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ResourceType = _aureliaMetadata.ResourceType;

  if (typeof String.prototype.endsWith !== "function") {
    String.prototype.endsWith = function (suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  function camelCase(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

  var ValueConverter = exports.ValueConverter = (function (ResourceType) {
    function ValueConverter(name) {
      _classCallCheck(this, ValueConverter);

      this.name = name;
    }

    _inherits(ValueConverter, ResourceType);

    _prototypeProperties(ValueConverter, {
      convention: {
        value: function convention(name) {
          if (name.endsWith("ValueConverter")) {
            return new ValueConverter(camelCase(name.substring(0, name.length - 14)));
          }
        },
        writable: true,
        configurable: true
      }
    }, {
      load: {
        value: function load(container, target) {
          this.instance = container.get(target);
          return Promise.resolve(this);
        },
        writable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerValueConverter(name || this.name, this.instance);
        },
        writable: true,
        configurable: true
      }
    });

    return ValueConverter;
  })(ResourceType);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/event-manager',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var DefaultEventStrategy = (function () {
    function DefaultEventStrategy() {
      _classCallCheck(this, DefaultEventStrategy);

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
        configurable: true
      },
      handleCallbackResult: {
        value: function handleCallbackResult(result) {},
        writable: true,
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
        configurable: true
      }
    });

    return DefaultEventStrategy;
  })();

  var EventManager = exports.EventManager = (function () {
    function EventManager() {
      _classCallCheck(this, EventManager);

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
            },
            properties: config.properties
          };
        },
        writable: true,
        configurable: true
      },
      registerElementHandler: {
        value: function registerElementHandler(tagName, handler) {
          this.elementHandlerLookup[tagName.toLowerCase()] = handler;
        },
        writable: true,
        configurable: true
      },
      registerEventStrategy: {
        value: function registerEventStrategy(eventName, strategy) {
          this.eventStrategyLookup[eventName] = strategy;
        },
        writable: true,
        configurable: true
      },
      getElementHandler: {
        value: function getElementHandler(target, propertyName) {
          if (target.tagName) {
            var handler = this.elementHandlerLookup[target.tagName.toLowerCase()];
            if (handler && handler.properties[propertyName]) {
              return handler;
            }
          }

          return null;
        },
        writable: true,
        configurable: true
      },
      addEventListener: {
        value: function addEventListener(target, targetEvent, callback, delegate) {
          return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
        },
        writable: true,
        configurable: true
      }
    });

    return EventManager;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});

//todo: coroutine via result?;
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
    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);
      var i, j, north, west;

      // "Addition" rows. Initialize null column.
      for (i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
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

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function spliceOperationsFromEditDistances(distances) {
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

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0) prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length) suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0) {
        return [];
      }if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) splice.removed.push(old[oldStart++]);

        return [splice];
      } else if (oldStart == oldEnd) {
        return [newSplice(currentStart, [], currentEnd - currentStart)];
      }var ops = this.spliceOperationsFromEditDistances(this.calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));

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

    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      for (var i = 0; i < searchLength; ++i) if (!this.equals(current[i], old[i])) {
        return i;
      }return searchLength;
    },

    sharedSuffix: function sharedSuffix(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2])) count++;

      return count;
    },

    calculateSplices: function calculateSplices(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0, previous.length);
    },

    equals: function equals(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1) {
      return -1;
    } // Adjacent
    if (end1 == start2 || end2 == start1) {
      return 0;
    } // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2) {
        return end1 - start2; // Overlap
      } else {
        return end2 - start2; // Contained
      }
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1) {
        return end2 - start1; // Overlap
      } else {
        return end1 - start1; // Contained
      }
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
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length + current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          var removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

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
          mergeSplice(splices, index, [record.oldValue], record.type === "delete" ? 0 : 1);
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/collection-observation',["exports", "./array-change-records"], function (exports, _arrayChangeRecords) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var calcSplices = _arrayChangeRecords.calcSplices;
  var projectArraySplices = _arrayChangeRecords.projectArraySplices;

  var ModifyCollectionObserver = exports.ModifyCollectionObserver = (function () {
    function ModifyCollectionObserver(taskQueue, collection) {
      _classCallCheck(this, ModifyCollectionObserver);

      this.taskQueue = taskQueue;
      this.queued = false;
      this.callbacks = [];
      this.changeRecords = [];
      this.oldCollection = null;
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map ? "size" : "length";
    }

    _prototypeProperties(ModifyCollectionObserver, null, {
      subscribe: {
        value: function subscribe(callback) {
          var callbacks = this.callbacks;
          callbacks.push(callback);
          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        configurable: true
      },
      addChangeRecord: {
        value: function addChangeRecord(changeRecord) {
          if (this.callbacks.length === 0) {
            return;
          }

          this.changeRecords.push(changeRecord);

          if (!this.queued) {
            this.queued = true;
            this.taskQueue.queueMicroTask(this);
          }
        },
        writable: true,
        configurable: true
      },
      reset: {
        value: function reset(oldCollection) {
          if (!this.callbacks.length) {
            return;
          }

          this.oldCollection = oldCollection;

          if (!this.queued) {
            this.queued = true;
            this.taskQueue.queueMicroTask(this);
          }
        },
        writable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName) {
          if (propertyName == this.lengthPropertyName) {
            return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection, this.lengthPropertyName));
          } else {
            throw new Error("You cannot observe the " + propertyName + " property of an array.");
          }
        },
        writable: true,
        configurable: true
      },
      call: {
        value: function call() {
          var callbacks = this.callbacks,
              i = callbacks.length,
              changeRecords = this.changeRecords,
              oldCollection = this.oldCollection,
              records;

          this.queued = false;
          this.changeRecords = [];
          this.oldCollection = null;

          if (i) {
            if (oldCollection) {
              // TODO (martingust) we might want to refactor this to a common, independent of collection type, way of getting the records
              if (this.collection instanceof Map) {
                records = getChangeRecords(oldCollection);
              } else {
                //we might need to combine this with existing change records....
                records = calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
              }
            } else {
              if (this.collection instanceof Map) {
                records = changeRecords;
              } else {
                records = projectArraySplices(this.collection, changeRecords);
              }
            }

            while (i--) {
              callbacks[i](records);
            }
          }

          if (this.lengthObserver) {
            this.lengthObserver(this.array.length);
          }
        },
        writable: true,
        configurable: true
      }
    });

    return ModifyCollectionObserver;
  })();

  var CollectionLengthObserver = exports.CollectionLengthObserver = (function () {
    function CollectionLengthObserver(collection) {
      _classCallCheck(this, CollectionLengthObserver);

      this.collection = collection;
      this.callbacks = [];
      this.lengthPropertyName = collection instanceof Map ? "size" : "length";
      this.currentValue = collection[this.lengthPropertyName];
    }

    _prototypeProperties(CollectionLengthObserver, null, {
      getValue: {
        value: function getValue() {
          return this.collection[this.lengthPropertyName];
        },
        writable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          this.collection[this.lengthPropertyName] = newValue;
        },
        writable: true,
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
        configurable: true
      }
    });

    return CollectionLengthObserver;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/array-observation',["exports", "./array-change-records", "./collection-observation"], function (exports, _arrayChangeRecords, _collectionObservation) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.getArrayObserver = getArrayObserver;
  var projectArraySplices = _arrayChangeRecords.projectArraySplices;
  var ModifyCollectionObserver = _collectionObservation.ModifyCollectionObserver;
  var CollectionLengthObserver = _collectionObservation.CollectionLengthObserver;

  var arrayProto = Array.prototype,
      hasArrayObserve = (function detectArrayObserve() {
    if (typeof Array.observe !== "function") {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var arr = [];
    Array.observe(arr, callback);
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 2) {
      return false;
    }if (records[0].type != "splice" || records[1].type != "splice") {
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

  var ModifyArrayObserver = (function (ModifyCollectionObserver) {
    function ModifyArrayObserver(taskQueue, array) {
      _classCallCheck(this, ModifyArrayObserver);

      _get(Object.getPrototypeOf(ModifyArrayObserver.prototype), "constructor", this).call(this, taskQueue, array);
    }

    _inherits(ModifyArrayObserver, ModifyCollectionObserver);

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
        configurable: true
      }
    });

    return ModifyArrayObserver;
  })(ModifyCollectionObserver);

  var ArrayObserveObserver = (function () {
    function ArrayObserveObserver(array) {
      _classCallCheck(this, ArrayObserveObserver);

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
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName) {
          if (propertyName == "length") {
            return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.array));
          } else {
            throw new Error("You cannot observe the " + propertyName + " property of an array.");
          }
        },
        writable: true,
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

          splices = projectArraySplices(this.array, changeRecords);

          while (i--) {
            callbacks[i](splices);
          }

          if (this.lengthObserver) {
            this.lengthObserver.call(this.array.length);
          }
        },
        writable: true,
        configurable: true
      }
    });

    return ArrayObserveObserver;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/map-change-records',["exports"], function (exports) {
  

  exports.getChangeRecords = getChangeRecords;
  function newRecord(type, object, key, oldValue) {
    return {
      type: type,
      object: object,
      key: key,
      oldValue: oldValue
    };
  }

  function getChangeRecords(map) {
    var entries = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = map.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        entries.push(newRecord("added", map, key));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return entries;
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/map-observation',["exports", "./map-change-records", "./collection-observation"], function (exports, _mapChangeRecords, _collectionObservation) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.getMapObserver = getMapObserver;
  var getEntries = _mapChangeRecords.getEntries;
  var getChangeRecords = _mapChangeRecords.getChangeRecords;
  var ModifyCollectionObserver = _collectionObservation.ModifyCollectionObserver;

  var mapProto = Map.prototype;

  function getMapObserver(taskQueue, map) {
    return ModifyMapObserver.create(taskQueue, map);
  }

  var ModifyMapObserver = (function (ModifyCollectionObserver) {
    function ModifyMapObserver(taskQueue, map) {
      _classCallCheck(this, ModifyMapObserver);

      _get(Object.getPrototypeOf(ModifyMapObserver.prototype), "constructor", this).call(this, taskQueue, map);
    }

    _inherits(ModifyMapObserver, ModifyCollectionObserver);

    _prototypeProperties(ModifyMapObserver, {
      create: {
        value: function create(taskQueue, map) {
          var observer = new ModifyMapObserver(taskQueue, map);

          map.set = function () {
            var oldValue = map.get(arguments[0]);
            var type = oldValue ? "update" : "add";
            var methodCallResult = mapProto.set.apply(map, arguments);
            observer.addChangeRecord({
              type: type,
              object: map,
              key: arguments[0],
              oldValue: oldValue
            });
            return methodCallResult;
          };

          map["delete"] = function () {
            var oldValue = map.get(arguments[0]);
            var methodCallResult = mapProto["delete"].apply(map, arguments);
            observer.addChangeRecord({
              type: "delete",
              object: map,
              key: arguments[0],
              oldValue: oldValue
            });
            return methodCallResult;
          };

          map.clear = function () {
            var methodCallResult = mapProto.clear.apply(map, arguments);
            observer.addChangeRecord({
              type: "clear",
              object: map
            });
            return methodCallResult;
          };

          return observer;
        },
        writable: true,
        configurable: true
      }
    });

    return ModifyMapObserver;
  })(ModifyCollectionObserver);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/dirty-checking',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var DirtyChecker = exports.DirtyChecker = (function () {
    function DirtyChecker() {
      _classCallCheck(this, DirtyChecker);

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
        configurable: true
      },
      removeProperty: {
        value: function removeProperty(property) {
          var tracked = this.tracked;
          tracked.splice(tracked.indexOf(property), 1);
        },
        writable: true,
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
        configurable: true
      }
    });

    return DirtyChecker;
  })();

  var DirtyCheckProperty = exports.DirtyCheckProperty = (function () {
    function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
      _classCallCheck(this, DirtyCheckProperty);

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
        configurable: true
      },
      isDirty: {
        value: function isDirty() {
          return this.oldValue !== this.getValue();
        },
        writable: true,
        configurable: true
      },
      beginTracking: {
        value: function beginTracking() {
          this.tracking = true;
          this.oldValue = this.newValue = this.getValue();
          this.dirtyChecker.addProperty(this);
        },
        writable: true,
        configurable: true
      },
      endTracking: {
        value: function endTracking() {
          this.tracking = false;
          this.dirtyChecker.removeProperty(this);
        },
        writable: true,
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
        configurable: true
      }
    });

    return DirtyCheckProperty;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/property-observation',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var SetterObserver = exports.SetterObserver = (function () {
    function SetterObserver(taskQueue, obj, propertyName) {
      _classCallCheck(this, SetterObserver);

      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.queued = false;
      this.observing = false;
    }

    _prototypeProperties(SetterObserver, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          this.obj[this.propertyName] = newValue;
        },
        writable: true,
        configurable: true
      },
      getterValue: {
        value: function getterValue() {
          return this.currentValue;
        },
        writable: true,
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
        configurable: true
      },
      convertProperty: {
        value: function convertProperty() {
          this.observing = true;
          this.currentValue = this.obj[this.propertyName];
          this.setValue = this.setterValue;
          this.getValue = this.getterValue;

          try {
            Object.defineProperty(this.obj, this.propertyName, {
              configurable: true,
              enumerable: true,
              get: this.getValue.bind(this),
              set: this.setValue.bind(this)
            });
          } catch (_) {}
        },
        writable: true,
        configurable: true
      }
    });

    return SetterObserver;
  })();

  var OoObjectObserver = exports.OoObjectObserver = (function () {
    function OoObjectObserver(obj, observerLocator) {
      _classCallCheck(this, OoObjectObserver);

      this.obj = obj;
      this.observers = {};
      this.observerLocator = observerLocator;
    }

    _prototypeProperties(OoObjectObserver, null, {
      subscribe: {
        value: function subscribe(propertyObserver, callback) {
          var _this = this;

          var callbacks = propertyObserver.callbacks;
          callbacks.push(callback);

          if (!this.observing) {
            this.observing = true;
            try {
              Object.observe(this.obj, function (changes) {
                return _this.handleChanges(changes);
              }, ["update", "add"]);
            } catch (_) {}
          }

          return function () {
            callbacks.splice(callbacks.indexOf(callback), 1);
          };
        },
        writable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(propertyName, descriptor) {
          var propertyObserver = this.observers[propertyName];
          if (!propertyObserver) {
            if (descriptor) {
              propertyObserver = this.observers[propertyName] = new OoPropertyObserver(this, this.obj, propertyName);
            } else {
              propertyObserver = this.observers[propertyName] = new UndefinedPropertyObserver(this, this.obj, propertyName);
            }
          }
          return propertyObserver;
        },
        writable: true,
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
        configurable: true
      }
    });

    return OoObjectObserver;
  })();

  var OoPropertyObserver = exports.OoPropertyObserver = (function () {
    function OoPropertyObserver(owner, obj, propertyName) {
      _classCallCheck(this, OoPropertyObserver);

      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
    }

    _prototypeProperties(OoPropertyObserver, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          this.obj[this.propertyName] = newValue;
        },
        writable: true,
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
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          return this.owner.subscribe(this, callback);
        },
        writable: true,
        configurable: true
      }
    });

    return OoPropertyObserver;
  })();

  var UndefinedPropertyObserver = exports.UndefinedPropertyObserver = (function () {
    function UndefinedPropertyObserver(owner, obj, propertyName) {
      _classCallCheck(this, UndefinedPropertyObserver);

      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbackMap = new Map();
      this.callbacks = []; // unused here, but required by owner OoObjectObserver.
    }

    _prototypeProperties(UndefinedPropertyObserver, null, {
      getValue: {
        value: function getValue() {
          // delegate this to the actual observer if possible.
          if (this.actual) {
            return this.actual.getValue();
          }
          return this.obj[this.propertyName];
        },
        writable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          // delegate this to the actual observer if possible.
          if (this.actual) {
            this.actual.setValue(newValue);
            return;
          }
          // define the property and trigger the callbacks.
          this.obj[this.propertyName] = newValue;
          this.trigger(newValue, undefined);
        },
        writable: true,
        configurable: true
      },
      trigger: {
        value: function trigger(newValue, oldValue) {
          var callback;

          // we only care about this event one time:  when the property becomes defined.
          if (this.subscription) {
            this.subscription();
          }

          // get the actual observer.
          this.getObserver();

          // invoke the callbacks.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.callbackMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              callback = _step.value;

              callback(newValue, oldValue);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        },
        writable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver() {
          var callback, observerLocator;

          // has the property has been defined?
          if (!Object.getOwnPropertyDescriptor(this.obj, this.propertyName)) {
            return;
          }

          // get the actual observer.
          observerLocator = this.owner.observerLocator;
          delete this.owner.observers[this.propertyName];
          delete observerLocator.getObserversLookup(this.obj, observerLocator)[this.propertyName];
          this.actual = observerLocator.getObserver(this.obj, this.propertyName);

          // attach any existing callbacks to the actual observer.
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.callbackMap.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              callback = _step.value;

              this.callbackMap.set(callback, this.actual.subscribe(callback));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        },
        writable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var _this = this;

          // attempt to get the actual observer in case the property has become
          // defined since the ObserverLocator returned [this].
          if (!this.actual) {
            this.getObserver();
          }

          // if we have the actual observer, use it.
          if (this.actual) {
            return this.actual.subscribe(callback);
          }

          // start listening for the property to become defined.
          if (!this.subscription) {
            this.subscription = this.owner.subscribe(this);
          }

          // cache the callback.
          this.callbackMap.set(callback, null);

          // return the method to dispose the subscription.
          return function () {
            var actualDispose = _this.callbackMap.get(callback);
            if (actualDispose) actualDispose();
            _this.callbackMap["delete"](callback);
          };
        },
        writable: true,
        configurable: true
      }
    });

    return UndefinedPropertyObserver;
  })();

  var ElementObserver = exports.ElementObserver = (function () {
    function ElementObserver(element, propertyName, handler) {
      var _this = this;

      _classCallCheck(this, ElementObserver);

      var xlinkResult = /^xlink:(.+)$/.exec(propertyName);

      this.element = element;
      this.propertyName = propertyName;
      this.handler = handler;
      this.callbacks = [];

      if (xlinkResult) {
        // xlink namespaced attributes require getAttributeNS/setAttributeNS
        // (even though the NS version doesn't work for other namespaces
        // in html5 documents)
        propertyName = xlinkResult[1];
        this.getValue = function () {
          return element.getAttributeNS("http://www.w3.org/1999/xlink", propertyName);
        };
        this.setValue = function (newValue) {
          return element.setAttributeNS("http://www.w3.org/1999/xlink", propertyName, newValue);
        };
      } else if (/^\w+:|^data-|^aria-/.test(propertyName) || element instanceof SVGElement) {
        // namespaced attributes, data-* attributes, aria-* attributes and any native SVGElement attribute require getAttribute/setAttribute
        this.getValue = function () {
          return element.getAttribute(propertyName);
        };
        this.setValue = function (newValue) {
          return element.setAttribute(propertyName, newValue);
        };
      } else {
        // everything else uses standard property accessor/assignment.
        this.getValue = function () {
          return element[propertyName];
        };
        this.setValue = function (newValue) {
          element[propertyName] = newValue;
          if (handler) {
            _this.call();
          }
        };
      }

      this.oldValue = this.getValue();
    }

    _prototypeProperties(ElementObserver, null, {
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
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var that = this;

          if (!this.handler) {
            // todo: consider adding logic to use DirtyChecking for "native" Element
            // properties and O.o/SetterObserver/etc for "ad-hoc" Element properties.
            throw new Error("Observation of an Element's \"" + this.propertyName + "\" is not supported.");
          }

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
        configurable: true
      }
    });

    return ElementObserver;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/computed-observation',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.hasDeclaredDependencies = hasDeclaredDependencies;
  exports.declarePropertyDependencies = declarePropertyDependencies;

  var ComputedPropertyObserver = exports.ComputedPropertyObserver = (function () {
    function ComputedPropertyObserver(obj, propertyName, descriptor, observerLocator) {
      _classCallCheck(this, ComputedPropertyObserver);

      this.obj = obj;
      this.propertyName = propertyName;
      this.descriptor = descriptor;
      this.observerLocator = observerLocator;
      this.callbacks = [];
    }

    _prototypeProperties(ComputedPropertyObserver, null, {
      getValue: {
        value: function getValue() {
          return this.obj[this.propertyName];
        },
        writable: true,
        configurable: true
      },
      setValue: {
        value: function setValue(newValue) {
          throw new Error("Computed properties cannot be assigned.");
        },
        writable: true,
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
        configurable: true
      },
      evaluate: {
        value: function evaluate() {
          var newValue = this.getValue();
          if (this.oldValue === newValue) {
            return;
          }this.trigger(newValue, this.oldValue);
          this.oldValue = newValue;
        },
        writable: true,
        configurable: true
      },
      subscribe: {
        value: function subscribe(callback) {
          var _this = this;

          var dependencies, i, ii;

          this.callbacks.push(callback);

          if (this.oldValue === undefined) {
            this.oldValue = this.getValue();
            this.subscriptions = [];

            dependencies = this.descriptor.get.dependencies;
            for (i = 0, ii = dependencies.length; i < ii; i++) {
              // todo:  consider throwing when a dependency's observer is an instance of DirtyCheckProperty.
              this.subscriptions.push(this.observerLocator.getObserver(this.obj, dependencies[i]).subscribe(function () {
                return _this.evaluate();
              }));
            }
          }

          return function () {
            _this.callbacks.splice(_this.callbacks.indexOf(callback), 1);
            if (_this.callbacks.length > 0) return;
            while (_this.subscriptions.length) {
              _this.subscriptions.pop()();
            }
            _this.oldValue = undefined;
          };
        },
        writable: true,
        configurable: true
      }
    });

    return ComputedPropertyObserver;
  })();

  function hasDeclaredDependencies(descriptor) {
    return descriptor && descriptor.get && !descriptor.set && descriptor.get.dependencies && descriptor.get.dependencies.length;
  }

  function declarePropertyDependencies(ctor, propertyName, dependencies) {
    var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
    if (descriptor.set) throw new Error("The property cannot have a setter function.");
    descriptor.get.dependencies = dependencies;
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/observer-locator',["exports", "aurelia-task-queue", "./array-observation", "./map-observation", "./event-manager", "./dirty-checking", "./property-observation", "aurelia-dependency-injection", "./computed-observation"], function (exports, _aureliaTaskQueue, _arrayObservation, _mapObservation, _eventManager, _dirtyChecking, _propertyObservation, _aureliaDependencyInjection, _computedObservation) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var TaskQueue = _aureliaTaskQueue.TaskQueue;
  var getArrayObserver = _arrayObservation.getArrayObserver;
  var getMapObserver = _mapObservation.getMapObserver;
  var EventManager = _eventManager.EventManager;
  var DirtyChecker = _dirtyChecking.DirtyChecker;
  var DirtyCheckProperty = _dirtyChecking.DirtyCheckProperty;
  var SetterObserver = _propertyObservation.SetterObserver;
  var OoObjectObserver = _propertyObservation.OoObjectObserver;
  var OoPropertyObserver = _propertyObservation.OoPropertyObserver;
  var ElementObserver = _propertyObservation.ElementObserver;
  var All = _aureliaDependencyInjection.All;
  var hasDeclaredDependencies = _computedObservation.hasDeclaredDependencies;
  var ComputedPropertyObserver = _computedObservation.ComputedPropertyObserver;

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
    if (typeof Object.observe !== "function") {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var test = {};
    Object.observe(test, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;

    Object.deliverChangeRecords(callback);
    if (records.length !== 3) {
      return false;
    }if (records[0].type != "add" || records[1].type != "update" || records[2].type != "delete") {
      return false;
    }

    Object.unobserve(test, callback);

    return true;
  })();

  function createObserversLookup(obj) {
    var value = {};

    try {
      Object.defineProperty(obj, "__observers__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}

    return value;
  }

  function createObserverLookup(obj, observerLocator) {
    var value = new OoObjectObserver(obj, observerLocator);

    try {
      Object.defineProperty(obj, "__observer__", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}

    return value;
  }

  var ObserverLocator = exports.ObserverLocator = (function () {
    function ObserverLocator(taskQueue, eventManager, dirtyChecker, observationAdapters) {
      _classCallCheck(this, ObserverLocator);

      this.taskQueue = taskQueue;
      this.eventManager = eventManager;
      this.dirtyChecker = dirtyChecker;
      this.observationAdapters = observationAdapters;
    }

    _prototypeProperties(ObserverLocator, {
      inject: {
        value: function inject() {
          return [TaskQueue, EventManager, DirtyChecker, All.of(ObjectObservationAdapter)];
        },
        writable: true,
        configurable: true
      }
    }, {
      getObserversLookup: {
        value: function getObserversLookup(obj) {
          return obj.__observers__ || createObserversLookup(obj);
        },
        writable: true,
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
        configurable: true
      },
      getObservationAdapter: {
        value: function getObservationAdapter(obj, propertyName, descriptor) {
          var i, ii, observationAdapter;
          for (i = 0, ii = this.observationAdapters.length; i < ii; i++) {
            observationAdapter = this.observationAdapters[i];
            if (observationAdapter.handlesProperty(obj, propertyName, descriptor)) {
              return observationAdapter;
            }
          }
          return null;
        },
        writable: true,
        configurable: true
      },
      createPropertyObserver: {
        value: function createPropertyObserver(obj, propertyName) {
          var observerLookup, descriptor, handler, observationAdapter;

          if (obj instanceof Element) {
            handler = this.eventManager.getElementHandler(obj, propertyName);
            return new ElementObserver(obj, propertyName, handler);
          }

          descriptor = Object.getPropertyDescriptor(obj, propertyName);

          if (hasDeclaredDependencies(descriptor)) {
            return new ComputedPropertyObserver(obj, propertyName, descriptor, this);
          }

          if (descriptor && (descriptor.get || descriptor.set)) {
            // attempt to use an adapter before resorting to dirty checking.
            observationAdapter = this.getObservationAdapter(obj, propertyName, descriptor);
            if (observationAdapter) {
              return observationAdapter.getObserver(obj, propertyName, descriptor);
            }return new DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
          }

          if (hasObjectObserve) {
            observerLookup = obj.__observer__ || createObserverLookup(obj, this);
            return observerLookup.getObserver(propertyName, descriptor);
          }

          if (obj instanceof Array) {
            observerLookup = this.getArrayObserver(obj);
            return observerLookup.getObserver(propertyName);
          } else if (obj instanceof Map) {
            observerLookup = this.getMapObserver(obj);
            return observerLookup.getObserver(propertyName);
          }

          return new SetterObserver(this.taskQueue, obj, propertyName);
        },
        writable: true,
        configurable: true
      },
      getArrayObserver: {
        value: (function (_getArrayObserver) {
          var _getArrayObserverWrapper = function getArrayObserver(_x) {
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
        configurable: true
      },
      getMapObserver: {
        value: (function (_getMapObserver) {
          var _getMapObserverWrapper = function getMapObserver(_x2) {
            return _getMapObserver.apply(this, arguments);
          };

          _getMapObserverWrapper.toString = function () {
            return _getMapObserver.toString();
          };

          return _getMapObserverWrapper;
        })(function (map) {
          if ("__map_observer__" in map) {
            return map.__map_observer__;
          }

          return map.__map_observer__ = getMapObserver(this.taskQueue, map);
        }),
        writable: true,
        configurable: true
      }
    });

    return ObserverLocator;
  })();

  var ObjectObservationAdapter = exports.ObjectObservationAdapter = (function () {
    function ObjectObservationAdapter() {
      _classCallCheck(this, ObjectObservationAdapter);
    }

    _prototypeProperties(ObjectObservationAdapter, null, {
      handlesProperty: {
        value: function handlesProperty(object, propertyName, descriptor) {
          throw new Error("BindingAdapters must implement handlesProperty(object, propertyName).");
        },
        writable: true,
        configurable: true
      },
      getObserver: {
        value: function getObserver(object, propertyName, descriptor) {
          throw new Error("BindingAdapters must implement createObserver(object, propertyName).");
        },
        writable: true,
        configurable: true
      }
    });

    return ObjectObservationAdapter;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/binding-modes',["exports"], function (exports) {
  

  var ONE_WAY = exports.ONE_WAY = 1;
  var TWO_WAY = exports.TWO_WAY = 2;
  var ONE_TIME = exports.ONE_TIME = 3;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/lexer',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Token = exports.Token = (function () {
    function Token(index, text) {
      _classCallCheck(this, Token);

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
        configurable: true
      },
      withGetterSetter: {
        value: function withGetterSetter(key) {
          this.key = key;
          return this;
        },
        writable: true,
        configurable: true
      },
      withValue: {
        value: function withValue(value) {
          this.value = value;
          return this;
        },
        writable: true,
        configurable: true
      },
      toString: {
        value: function toString() {
          return "Token(" + this.text + ")";
        },
        writable: true,
        configurable: true
      }
    });

    return Token;
  })();

  var Lexer = exports.Lexer = (function () {
    function Lexer() {
      _classCallCheck(this, Lexer);
    }

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
        configurable: true
      }
    });

    return Lexer;
  })();

  var Scanner = exports.Scanner = (function () {
    function Scanner(input) {
      _classCallCheck(this, Scanner);

      this.input = input;
      this.length = input.length;
      this.peek = 0;
      this.index = -1;

      this.advance();
    }

    _prototypeProperties(Scanner, null, {
      scanToken: {
        value: function scanToken() {
          // Skip whitespace.
          while (this.peek <= $SPACE) {
            if (++this.index >= this.length) {
              this.peek = $EOF;
              return null;
            } else {
              this.peek = this.input.charCodeAt(this.index);
            }
          }

          // Handle identifiers and numbers.
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
        configurable: true
      },
      scanCharacter: {
        value: function scanCharacter(start, text) {
          assert(this.peek === text.charCodeAt(0));
          this.advance();
          return new Token(start, text);
        },
        writable: true,
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

          // TODO(kasperl): Deal with null, undefined, true, and false in
          // a cleaner and faster way.
          if (OPERATORS.indexOf(text) !== -1) {
            result.withOp(text);
          } else {
            result.withGetterSetter(text);
          }

          return result;
        },
        writable: true,
        configurable: true
      },
      scanNumber: {
        value: function scanNumber(start) {
          assert(isDigit(this.peek));
          var simple = this.index === start;
          this.advance(); // Skip initial digit.

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
        configurable: true
      },
      scanString: {
        value: function scanString() {
          assert(this.peek === $SQ || this.peek === $DQ);

          var start = this.index;
          var quote = this.peek;

          this.advance(); // Skip initial quote.

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
                // TODO(kasperl): Check bounds? Make sure we have test
                // coverage for this.
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
          this.advance(); // Skip terminating quote.
          var text = this.input.substring(start, this.index);

          // Compute the unescaped string value.
          var unescaped = last;

          if (buffer != null) {
            buffer.push(last);
            unescaped = buffer.join("");
          }

          return new Token(start, text).withValue(unescaped);
        },
        writable: true,
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
        configurable: true
      },
      error: {
        value: function error(message) {
          var offset = arguments[1] === undefined ? 0 : arguments[1];

          // TODO(kasperl): Try to get rid of the offset. It is only used to match
          // the error expectations in the lexer tests for numbers with exponents.
          var position = this.index + offset;
          throw new Error("Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
        },
        writable: true,
        configurable: true
      }
    });

    return Scanner;
  })();

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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});

// Do nothing.;
define('aurelia-binding/path-observer',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var PathObserver = exports.PathObserver = (function () {
    function PathObserver(leftObserver, getRightObserver, value) {
      var _this = this;

      _classCallCheck(this, PathObserver);

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
          var _this = this;

          this.rightObserver = observer;

          if (this.disposeRight) {
            this.disposeRight();
          }

          if (!observer) {
            return null;
          }

          this.disposeRight = observer.subscribe(function (newValue) {
            return _this.notify(newValue);
          });
          return observer.getValue();
        },
        writable: true,
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
        configurable: true
      }
    });

    return PathObserver;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/composite-observer',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var CompositeObserver = exports.CompositeObserver = (function () {
    function CompositeObserver(observers, evaluate) {
      var _this = this;

      _classCallCheck(this, CompositeObserver);

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
        configurable: true
      }
    });

    return CompositeObserver;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/ast',["exports", "./path-observer", "./composite-observer"], function (exports, _pathObserver, _compositeObserver) {
  

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var PathObserver = _pathObserver.PathObserver;
  var CompositeObserver = _compositeObserver.CompositeObserver;

  var Expression = exports.Expression = (function () {
    function Expression() {
      _classCallCheck(this, Expression);

      this.isChain = false;
      this.isAssignable = false;
    }

    _prototypeProperties(Expression, null, {
      evaluate: {
        value: function evaluate() {
          throw new Error("Cannot evaluate " + this);
        },
        writable: true,
        configurable: true
      },
      assign: {
        value: function assign() {
          throw new Error("Cannot assign to " + this);
        },
        writable: true,
        configurable: true
      },
      toString: {
        value: function toString() {
          return Unparser.unparse(this);
        },
        writable: true,
        configurable: true
      }
    });

    return Expression;
  })();

  var Chain = exports.Chain = (function (Expression) {
    function Chain(expressions) {
      _classCallCheck(this, Chain);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitChain(this);
        },
        writable: true,
        configurable: true
      }
    });

    return Chain;
  })(Expression);

  var ValueConverter = exports.ValueConverter = (function (Expression) {
    function ValueConverter(expression, name, args, allArgs) {
      _classCallCheck(this, ValueConverter);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitValueConverter(this);
        },
        writable: true,
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
        configurable: true
      }
    });

    return ValueConverter;
  })(Expression);

  var Assign = exports.Assign = (function (Expression) {
    function Assign(target, value) {
      _classCallCheck(this, Assign);

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
        configurable: true
      },
      accept: {
        value: function accept(vistor) {
          vistor.visitAssign(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          return { value: this.evaluate(scope, binding.valueConverterLookupFunction) };
        },
        writable: true,
        configurable: true
      }
    });

    return Assign;
  })(Expression);

  var Conditional = exports.Conditional = (function (Expression) {
    function Conditional(condition, yes, no) {
      _classCallCheck(this, Conditional);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitConditional(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return Conditional;
  })(Expression);

  var AccessScope = exports.AccessScope = (function (Expression) {
    function AccessScope(name) {
      _classCallCheck(this, AccessScope);

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
        configurable: true
      },
      assign: {
        value: function assign(scope, value) {
          return scope[this.name] = value;
        },
        writable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitAccessScope(this);
        },
        writable: true,
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
        configurable: true
      }
    });

    return AccessScope;
  })(Expression);

  var AccessMember = exports.AccessMember = (function (Expression) {
    function AccessMember(object, name) {
      _classCallCheck(this, AccessMember);

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
          return instance === null || instance === undefined ? instance : instance[this.name];
        },
        writable: true,
        configurable: true
      },
      assign: {
        value: function assign(scope, value) {
          var instance = this.object.evaluate(scope);

          if (instance === null || instance === undefined) {
            instance = {};
            this.object.assign(scope, instance);
          }

          return instance[this.name] = value;
        },
        writable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitAccessMember(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

          var info = this.object.connect(binding, scope),
              objectInstance = info.value,
              objectObserver = info.observer,
              observer;

          if (objectObserver) {
            observer = new PathObserver(objectObserver, function (value) {
              if (value == null || value == undefined) {
                return value;
              }

              return binding.getObserver(value, _this.name);
            }, objectInstance);
          } else {
            observer = binding.getObserver(objectInstance, this.name);
          }

          return {
            value: objectInstance == null ? null : objectInstance[this.name], //TODO: use prop abstraction
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return AccessMember;
  })(Expression);

  var AccessKeyed = exports.AccessKeyed = (function (Expression) {
    function AccessKeyed(object, key) {
      _classCallCheck(this, AccessKeyed);

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
        configurable: true
      },
      assign: {
        value: function assign(scope, value) {
          var instance = this.object.evaluate(scope);
          var lookup = this.key.evaluate(scope);
          return setKeyed(instance, lookup, value);
        },
        writable: true,
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitAccessKeyed(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return AccessKeyed;
  })(Expression);

  var CallScope = exports.CallScope = (function (Expression) {
    function CallScope(name, args) {
      _classCallCheck(this, CallScope);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitCallScope(this);
        },
        writable: true,
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

          for (i = 0, ii = this.args.length; i < ii; ++i) {
            exp = this.args[i];
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
        configurable: true
      }
    });

    return CallScope;
  })(Expression);

  var CallMember = exports.CallMember = (function (Expression) {
    function CallMember(object, name, args) {
      _classCallCheck(this, CallMember);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitCallMember(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return CallMember;
  })(Expression);

  var CallFunction = exports.CallFunction = (function (Expression) {
    function CallFunction(func, args) {
      _classCallCheck(this, CallFunction);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitCallFunction(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return CallFunction;
  })(Expression);

  var Binary = exports.Binary = (function (Expression) {
    function Binary(operation, left, right) {
      _classCallCheck(this, Binary);

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

          switch (this.operation) {
            case "==":
              return left == right;
            case "===":
              return left === right;
            case "!=":
              return left != right;
            case "!==":
              return left !== right;
          }

          // Null check for the operations.
          if (left === null || right === null) {
            switch (this.operation) {
              case "+":
                if (left != null) {
                  return left;
                }if (right != null) {
                  return right;
                }return 0;
              case "-":
                if (left != null) {
                  return left;
                }if (right != null) {
                  return 0 - right;
                }return 0;
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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitBinary(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: this.evaluate(scope, binding.valueConverterLookupFunction),
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return Binary;
  })(Expression);

  var PrefixNot = exports.PrefixNot = (function (Expression) {
    function PrefixNot(operation, expression) {
      _classCallCheck(this, PrefixNot);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitPrefix(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

          var info = this.expression.connect(binding, scope),
              observer;

          if (info.observer) {
            observer = new CompositeObserver([info.observer], function () {
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: !info.value,
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return PrefixNot;
  })(Expression);

  var LiteralPrimitive = exports.LiteralPrimitive = (function (Expression) {
    function LiteralPrimitive(value) {
      _classCallCheck(this, LiteralPrimitive);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralPrimitive(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          return { value: this.value };
        },
        writable: true,
        configurable: true
      }
    });

    return LiteralPrimitive;
  })(Expression);

  var LiteralString = exports.LiteralString = (function (Expression) {
    function LiteralString(value) {
      _classCallCheck(this, LiteralString);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralString(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          return { value: this.value };
        },
        writable: true,
        configurable: true
      }
    });

    return LiteralString;
  })(Expression);

  var LiteralArray = exports.LiteralArray = (function (Expression) {
    function LiteralArray(elements) {
      _classCallCheck(this, LiteralArray);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralArray(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: results,
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return LiteralArray;
  })(Expression);

  var LiteralObject = exports.LiteralObject = (function (Expression) {
    function LiteralObject(keys, values) {
      _classCallCheck(this, LiteralObject);

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
        configurable: true
      },
      accept: {
        value: function accept(visitor) {
          visitor.visitLiteralObject(this);
        },
        writable: true,
        configurable: true
      },
      connect: {
        value: function connect(binding, scope) {
          var _this = this;

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
              return _this.evaluate(scope, binding.valueConverterLookupFunction);
            });
          }

          return {
            value: instance,
            observer: observer
          };
        },
        writable: true,
        configurable: true
      }
    });

    return LiteralObject;
  })(Expression);

  var Unparser = exports.Unparser = (function () {
    function Unparser(buffer) {
      _classCallCheck(this, Unparser);

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
        configurable: true
      }
    }, {
      write: {
        value: function write(text) {
          this.buffer.push(text);
        },
        writable: true,
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
        configurable: true
      },
      visitAssign: {
        value: function visitAssign(assign) {
          assign.target.accept(this);
          this.write("=");
          assign.value.accept(this);
        },
        writable: true,
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
        configurable: true
      },
      visitAccessScope: {
        value: function visitAccessScope(access) {
          this.write(access.name);
        },
        writable: true,
        configurable: true
      },
      visitAccessMember: {
        value: function visitAccessMember(access) {
          access.object.accept(this);
          this.write("." + access.name);
        },
        writable: true,
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
        configurable: true
      },
      visitCallScope: {
        value: function visitCallScope(call) {
          this.write(call.name);
          this.writeArgs(call.args);
        },
        writable: true,
        configurable: true
      },
      visitCallFunction: {
        value: function visitCallFunction(call) {
          call.func.accept(this);
          this.writeArgs(call.args);
        },
        writable: true,
        configurable: true
      },
      visitCallMember: {
        value: function visitCallMember(call) {
          call.object.accept(this);
          this.write("." + call.name);
          this.writeArgs(call.args);
        },
        writable: true,
        configurable: true
      },
      visitPrefix: {
        value: function visitPrefix(prefix) {
          this.write("(" + prefix.operation);
          prefix.expression.accept(this);
          this.write(")");
        },
        writable: true,
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
        configurable: true
      },
      visitLiteralPrimitive: {
        value: function visitLiteralPrimitive(literal) {
          this.write("" + literal.value);
        },
        writable: true,
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
        configurable: true
      },
      visitLiteralString: {
        value: function visitLiteralString(literal) {
          var escaped = literal.value.replace(/'/g, "'");
          this.write("'" + escaped + "'");
        },
        writable: true,
        configurable: true
      }
    });

    return Unparser;
  })();

  var evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];

  /// Evaluate the [list] in context of the [scope].
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

  /// Add the two arguments with automatic type conversion.
  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      // TODO(deboer): Support others.
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/parser',["exports", "./lexer", "./ast"], function (exports, _lexer, _ast) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var Parser = exports.Parser = (function () {
    function Parser() {
      _classCallCheck(this, Parser);

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
        configurable: true
      }
    });

    return Parser;
  })();

  var ParserImplementation = exports.ParserImplementation = (function () {
    function ParserImplementation(lexer, input) {
      _classCallCheck(this, ParserImplementation);

      this.index = 0;
      this.input = input;
      this.tokens = lexer.lex(input);
    }

    _prototypeProperties(ParserImplementation, null, {
      peek: {
        get: function () {
          return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
        },
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
        configurable: true
      },
      parseValueConverter: {
        value: function parseValueConverter() {
          var result = this.parseExpression();

          while (this.optional("|")) {
            var name = this.peek.text,
                // TODO(kasperl): Restrict to identifier?
            args = [];

            this.advance();

            while (this.optional(":")) {
              // TODO(kasperl): Is this really supposed to be expressions?
              args.push(this.parseExpression());
            }

            result = new ValueConverter(result, name, args, [result].concat(args));
          }

          return result;
        },
        writable: true,
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
        configurable: true
      },
      parsePrefix: {
        value: function parsePrefix() {
          if (this.optional("+")) {
            return this.parsePrefix(); // TODO(kasperl): This is different than the original parser.
          } else if (this.optional("-")) {
            return new Binary("-", new LiteralPrimitive(0), this.parsePrefix());
          } else if (this.optional("!")) {
            return new PrefixNot("!", this.parsePrefix());
          } else {
            return this.parseAccessOrCallMember();
          }
        },
        writable: true,
        configurable: true
      },
      parseAccessOrCallMember: {
        value: function parseAccessOrCallMember() {
          var result = this.parsePrimary();

          while (true) {
            if (this.optional(".")) {
              var name = this.peek.text; // TODO(kasperl): Check that this is an identifier. Are keywords okay?

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
        configurable: true
      },
      parseObject: {
        value: function parseObject() {
          var keys = [],
              values = [];

          this.expect("{");

          if (this.peek.text !== "}") {
            do {
              // TODO(kasperl): Stricter checking. Only allow identifiers
              // and strings as keys. Maybe also keywords?
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
        configurable: true
      },
      advance: {
        value: function advance() {
          this.index++;
        },
        writable: true,
        configurable: true
      },
      error: {
        value: function error(message) {
          var location = this.index < this.tokens.length ? "at column " + (this.tokens[this.index].index + 1) + " in" : "at the end of the expression";

          throw new Error("Parser Error: " + message + " " + location + " [" + this.input + "]");
        },
        writable: true,
        configurable: true
      }
    });

    return ParserImplementation;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/binding-expression',["exports", "./binding-modes"], function (exports, _bindingModes) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ONE_WAY = _bindingModes.ONE_WAY;
  var TWO_WAY = _bindingModes.TWO_WAY;

  var BindingExpression = exports.BindingExpression = (function () {
    function BindingExpression(observerLocator, targetProperty, sourceExpression, mode, valueConverterLookupFunction, attribute) {
      _classCallCheck(this, BindingExpression);

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
        configurable: true
      }
    });

    return BindingExpression;
  })();

  var Binding = (function () {
    function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
      _classCallCheck(this, Binding);

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
        configurable: true
      }
    });

    return Binding;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/listener-expression',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ListenerExpression = exports.ListenerExpression = (function () {
    function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
      _classCallCheck(this, ListenerExpression);

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
        configurable: true
      }
    });

    return ListenerExpression;
  })();

  var Listener = (function () {
    function Listener(eventManager, targetEvent, delegate, sourceExpression, target, preventDefault) {
      _classCallCheck(this, Listener);

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
            if (result !== true && _this.preventDefault) {
              event.preventDefault();
            }
            return result;
          }, this.delegate);
        },
        writable: true,
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
        configurable: true
      }
    });

    return Listener;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/name-expression',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var NameExpression = exports.NameExpression = (function () {
    function NameExpression(name, mode) {
      _classCallCheck(this, NameExpression);

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
        configurable: true
      }
    });

    return NameExpression;
  })();

  var NameBinder = (function () {
    function NameBinder(property, target, mode) {
      _classCallCheck(this, NameBinder);

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
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.source[this.property] = null;
        },
        writable: true,
        configurable: true
      }
    });

    return NameBinder;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/call-expression',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var CallExpression = exports.CallExpression = (function () {
    function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
      _classCallCheck(this, CallExpression);

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
        configurable: true
      }
    });

    return CallExpression;
  })();

  var Call = (function () {
    function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
      _classCallCheck(this, Call);

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
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.targetProperty.setValue(null);
        },
        writable: true,
        configurable: true
      }
    });

    return Call;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding/index',["exports", "aurelia-metadata", "./value-converter", "./event-manager", "./observer-locator", "./array-change-records", "./binding-modes", "./parser", "./binding-expression", "./listener-expression", "./name-expression", "./call-expression", "./dirty-checking", "./map-change-records", "./computed-observation"], function (exports, _aureliaMetadata, _valueConverter, _eventManager, _observerLocator, _arrayChangeRecords, _bindingModes, _parser, _bindingExpression, _listenerExpression, _nameExpression, _callExpression, _dirtyChecking, _mapChangeRecords, _computedObservation) {
  

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  var Metadata = _aureliaMetadata.Metadata;
  var ValueConverter = _valueConverter.ValueConverter;
  exports.EventManager = _eventManager.EventManager;
  exports.ObserverLocator = _observerLocator.ObserverLocator;
  exports.ObjectObservationAdapter = _observerLocator.ObjectObservationAdapter;
  exports.ValueConverter = _valueConverter.ValueConverter;
  exports.calcSplices = _arrayChangeRecords.calcSplices;

  _defaults(exports, _interopRequireWildcard(_bindingModes));

  exports.Parser = _parser.Parser;
  exports.BindingExpression = _bindingExpression.BindingExpression;
  exports.ListenerExpression = _listenerExpression.ListenerExpression;
  exports.NameExpression = _nameExpression.NameExpression;
  exports.CallExpression = _callExpression.CallExpression;
  exports.DirtyChecker = _dirtyChecking.DirtyChecker;
  exports.getChangeRecords = _mapChangeRecords.getChangeRecords;
  exports.ComputedObservationAdapter = _computedObservation.ComputedObservationAdapter;
  exports.declarePropertyDependencies = _computedObservation.declarePropertyDependencies;

  Metadata.configure.classHelper("valueConverter", ValueConverter);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-binding', ['aurelia-binding/index'], function (main) { return main; });

define('aurelia-templating/property',["exports", "./util", "aurelia-binding"], function (exports, _util, _aureliaBinding) {
  

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var hyphenate = _util.hyphenate;
  var ONE_WAY = _aureliaBinding.ONE_WAY;
  var TWO_WAY = _aureliaBinding.TWO_WAY;
  var ONE_TIME = _aureliaBinding.ONE_TIME;

  var BehaviorProperty = exports.BehaviorProperty = (function () {
    function BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
      _classCallCheck(this, BehaviorProperty);

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
        configurable: true
      },
      bindingIsOneWay: {
        value: function bindingIsOneWay() {
          this.defaultBindingMode = ONE_WAY;
          return this;
        },
        writable: true,
        configurable: true
      },
      bindingIsOneTime: {
        value: function bindingIsOneTime() {
          this.defaultBindingMode = ONE_TIME;
          return this;
        },
        writable: true,
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
            get: function get() {
              return this.__observers__[that.name].getValue();
            },
            set: function set(value) {
              this.__observers__[that.name].setValue(value);
            }
          });
        },
        writable: true,
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
        configurable: true
      }
    });

    return BehaviorProperty;
  })();

  var OptionsProperty = exports.OptionsProperty = (function (BehaviorProperty) {
    function OptionsProperty(attribute) {
      for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }

      _classCallCheck(this, OptionsProperty);

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
        configurable: true
      },
      withProperty: {
        value: function withProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode) {
          this.properties.push(new BehaviorProperty(name, changeHandler, attribute, defaultValue, defaultBindingMode));
          return this;
        },
        writable: true,
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
        configurable: true
      },
      createObserver: {
        value: function createObserver(executionContext) {},
        writable: true,
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
        configurable: true
      }
    });

    return OptionsProperty;
  })(BehaviorProperty);

  var BehaviorPropertyObserver = (function () {
    function BehaviorPropertyObserver(taskQueue, obj, propertyName, selfSubscriber) {
      _classCallCheck(this, BehaviorPropertyObserver);

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
        configurable: true
      }
    });

    return BehaviorPropertyObserver;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/behavior-instance',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var BehaviorInstance = exports.BehaviorInstance = (function () {
    function BehaviorInstance(behavior, executionContext, instruction) {
      _classCallCheck(this, BehaviorInstance);

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
        configurable: true
      },
      attached: {
        value: function attached() {
          if (this.behavior.handlesAttached) {
            this.executionContext.attached();
          }
        },
        writable: true,
        configurable: true
      },
      detached: {
        value: function detached() {
          if (this.behavior.handlesDetached) {
            this.executionContext.detached();
          }
        },
        writable: true,
        configurable: true
      }
    });

    return BehaviorInstance;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/children',["exports"], function (exports) {
	

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var noMutations = [];

	var ChildObserver = exports.ChildObserver = (function () {
		function ChildObserver(property, changeHandler, selector) {
			_classCallCheck(this, ChildObserver);

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
				configurable: true
			}
		});

		return ChildObserver;
	})();

	var ChildObserverBinder = exports.ChildObserverBinder = (function () {
		function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
			_classCallCheck(this, ChildObserverBinder);

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
				configurable: true
			},
			unbind: {
				value: function unbind() {
					this.observer.disconnect();
				},
				writable: true,
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
				configurable: true
			}
		});

		return ChildObserverBinder;
	})();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
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
    behavior.apiName = behavior.name.replace(/-([a-z])/g, function (m, w) {
      return w.toUpperCase();
    });

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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/attached-behavior',["exports", "aurelia-metadata", "./behavior-instance", "./behaviors", "./util"], function (exports, _aureliaMetadata, _behaviorInstance, _behaviors, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ResourceType = _aureliaMetadata.ResourceType;
  var BehaviorInstance = _behaviorInstance.BehaviorInstance;
  var configureBehavior = _behaviors.configureBehavior;
  var hyphenate = _util.hyphenate;

  var AttachedBehavior = exports.AttachedBehavior = (function (ResourceType) {
    function AttachedBehavior(attribute) {
      _classCallCheck(this, AttachedBehavior);

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
        configurable: true
      }
    }, {
      analyze: {
        value: function analyze(container, target) {
          configureBehavior(container, this, target);
        },
        writable: true,
        configurable: true
      },
      load: {
        value: function load(container, target) {
          return Promise.resolve(this);
        },
        writable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerAttribute(name || this.name, this, this.name);
        },
        writable: true,
        configurable: true
      },
      compile: {
        value: function compile(compiler, resources, node, instruction) {
          instruction.suppressBind = true;
          return node;
        },
        writable: true,
        configurable: true
      },
      create: {
        value: function create(container, instruction, element, bindings) {
          var executionContext = instruction.executionContext || container.get(this.target),
              behaviorInstance = new BehaviorInstance(this, executionContext, instruction);

          if (!(this.apiName in element)) {
            element[this.apiName] = behaviorInstance.executionContext;
          }

          if (this.childExpression) {
            bindings.push(this.childExpression.createBinding(element, behaviorInstance.executionContext));
          }

          return behaviorInstance;
        },
        writable: true,
        configurable: true
      }
    });

    return AttachedBehavior;
  })(ResourceType);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/content-selector',["exports"], function (exports) {
	

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

	var ContentSelector = exports.ContentSelector = (function () {
		function ContentSelector(anchor, selector) {
			_classCallCheck(this, ContentSelector);

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
				configurable: true
			}
		}, {
			copyForViewSlot: {
				value: function copyForViewSlot() {
					return new ContentSelector(this.anchor, this.selector);
				},
				writable: true,
				configurable: true
			},
			matches: {
				value: function matches(node) {
					return this.all || node.nodeType === 1 && node.matches(this.selector);
				},
				writable: true,
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
				configurable: true
			}
		});

		return ContentSelector;
	})();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
});
define('aurelia-templating/resource-registry',["exports", "aurelia-path"], function (exports, _aureliaPath) {
  

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var ResourceRegistry = exports.ResourceRegistry = (function () {
    function ResourceRegistry() {
      _classCallCheck(this, ResourceRegistry);

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
        configurable: true
      },
      getElement: {
        value: function getElement(tagName) {
          return this.elements[tagName];
        },
        writable: true,
        configurable: true
      },
      registerAttribute: {
        value: function registerAttribute(attribute, behavior, knownAttribute) {
          this.attributeMap[attribute] = knownAttribute;
          register(this.attributes, attribute, behavior, "an Attribute");
        },
        writable: true,
        configurable: true
      },
      getAttribute: {
        value: function getAttribute(attribute) {
          return this.attributes[attribute];
        },
        writable: true,
        configurable: true
      },
      registerValueConverter: {
        value: function registerValueConverter(name, valueConverter) {
          register(this.valueConverters, name, valueConverter, "a ValueConverter");
        },
        writable: true,
        configurable: true
      },
      getValueConverter: {
        value: function getValueConverter(name) {
          return this.valueConverters[name];
        },
        writable: true,
        configurable: true
      }
    });

    return ResourceRegistry;
  })();

  var ViewResources = exports.ViewResources = (function (ResourceRegistry) {
    function ViewResources(parent, viewUrl) {
      _classCallCheck(this, ViewResources);

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
        configurable: true
      },
      getElement: {
        value: function getElement(tagName) {
          return this.elements[tagName] || this.parent.getElement(tagName);
        },
        writable: true,
        configurable: true
      },
      mapAttribute: {
        value: function mapAttribute(attribute) {
          return this.attributeMap[attribute] || this.parent.attributeMap[attribute];
        },
        writable: true,
        configurable: true
      },
      getAttribute: {
        value: function getAttribute(attribute) {
          return this.attributes[attribute] || this.parent.getAttribute(attribute);
        },
        writable: true,
        configurable: true
      },
      getValueConverter: {
        value: function getValueConverter(name) {
          return this.valueConverters[name] || this.parent.getValueConverter(name);
        },
        writable: true,
        configurable: true
      }
    });

    return ViewResources;
  })(ResourceRegistry);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/view',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  //NOTE: Adding a fragment to the document causes the nodes to be removed from the fragment.
  //NOTE: Adding to the fragment, causes the nodes to be removed from the document.

  var View = exports.View = (function () {
    function View(fragment, behaviors, bindings, children, systemControlled, contentSelectors) {
      _classCallCheck(this, View);

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
        configurable: true
      },
      insertNodesBefore: {
        value: function insertNodesBefore(refNode) {
          var parent = refNode.parentNode;
          parent.insertBefore(this.fragment, refNode);
        },
        writable: true,
        configurable: true
      },
      appendNodesTo: {
        value: function appendNodesTo(parent) {
          parent.appendChild(this.fragment);
        },
        writable: true,
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
        configurable: true
      }
    });

    return View;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/animator',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Animator = exports.Animator = (function () {
    function Animator() {
      _classCallCheck(this, Animator);

      Animator.instance = this;
      this.animationStack = [];
    }

    _prototypeProperties(Animator, null, {
      addMultipleEventListener: {
        value: function addMultipleEventListener(el, s, fn) {
          var evts = s.split(" "),
              i,
              ii;

          for (i = 0, ii = evts.length; i < ii; ++i) {
            el.addEventListener(evts[i], fn, false);
          }
        },
        writable: true,
        configurable: true
      },
      addAnimationToStack: {
        value: function addAnimationToStack(animId) {
          if (this.animationStack.indexOf(animId) < 0) {
            this.animationStack.push(animId);
          }
        },
        writable: true,
        configurable: true
      },
      removeAnimationFromStack: {
        value: function removeAnimationFromStack(animId) {
          var idx = this.animationStack.indexOf(animId);
          if (idx > -1) {
            this.animationStack.splice(idx, 1);
          }
        },
        writable: true,
        configurable: true
      },
      move: {
        value: function move() {
          return Promise.resolve(false);
        },
        writable: true,
        configurable: true
      },
      enter: {
        value: function enter(element) {
          return Promise.resolve(false);
        },
        writable: true,
        configurable: true
      },
      leave: {
        value: function leave(element) {
          return Promise.resolve(false);
        },
        writable: true,
        configurable: true
      },
      removeClass: {
        value: function removeClass(element, className) {
          return Promise.resolve(false);
        },
        writable: true,
        configurable: true
      },
      addClass: {
        value: function addClass(element, className) {
          return Promise.resolve(false);
        },
        writable: true,
        configurable: true
      }
    });

    return Animator;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/view-slot',["exports", "./content-selector", "./animator"], function (exports, _contentSelector, _animator) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ContentSelector = _contentSelector.ContentSelector;
  var Animator = _animator.Animator;

  var ViewSlot = exports.ViewSlot = (function () {
    function ViewSlot(anchor, anchorIsContainer, executionContext) {
      var animator = arguments[3] === undefined ? Animator.instance : arguments[3];

      _classCallCheck(this, ViewSlot);

      this.anchor = anchor;
      this.viewAddMethod = anchorIsContainer ? "appendNodesTo" : "insertNodesBefore";
      this.executionContext = executionContext;
      this.animator = animator;
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
            fragment: parent,
            firstChild: parent.firstChild,
            lastChild: parent.lastChild,
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
        configurable: true
      },
      add: {
        value: function add(view) {
          view[this.viewAddMethod](this.anchor);
          this.children.push(view);

          if (this.isAttached) {
            view.attached();
            // Animate page itself
            var element = view.firstChild.nextElementSibling;
            if (view.firstChild.nodeType === 8 && element !== undefined && element.nodeType === 1 && element.classList.contains("au-animate")) {
              this.animator.enter(element);
            }
          }
        },
        writable: true,
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
        configurable: true
      },
      removeAt: {
        value: function removeAt(index) {
          var _this = this;

          var view = this.children[index];

          var removeAction = function () {
            view.removeNodes();
            _this.children.splice(index, 1);

            if (_this.isAttached) {
              view.detached();
            }

            return view;
          };

          var element = view.firstChild.nextElementSibling;
          if (view.firstChild.nodeType === 8 && element !== undefined && element.nodeType === 1 && element.classList.contains("au-animate")) {
            return this.animator.leave(element).then(function () {
              return removeAction();
            });
          } else {
            return removeAction();
          }
        },
        writable: true,
        configurable: true
      },
      removeAll: {
        value: function removeAll() {
          var _this = this;

          var children = this.children,
              ii = children.length,
              i;

          var rmPromises = [];

          children.forEach(function (child) {
            var element = child.firstChild.nextElementSibling;
            if (child.firstChild !== undefined && child.firstChild.nodeType === 8 && element !== undefined && element.nodeType === 1 && element.classList.contains("au-animate")) {
              rmPromises.push(_this.animator.leave(element).then(function () {
                child.removeNodes();
              }));
            } else {
              child.removeNodes();
            }
          });

          var removeAction = function () {
            if (_this.isAttached) {
              for (i = 0; i < ii; ++i) {
                children[i].detached();
              }
            }

            _this.children = [];
          };

          if (rmPromises.length > 0) {
            return Promise.all(rmPromises).then(function () {
              removeAction();
            });
          } else {
            removeAction();
          }
        },
        writable: true,
        configurable: true
      },
      swap: {
        value: function swap(view) {
          var _this = this;

          var removeResponse = this.removeAll();
          if (removeResponse !== undefined) {
            removeResponse.then(function () {
              _this.add(view);
            });
          } else {
            this.add(view);
          }
        },
        writable: true,
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

            var element = children[i].firstChild.nextElementSibling;
            if (children[i].firstChild.nodeType === 8 && element !== undefined && element.nodeType === 1 && element.classList.contains("au-animate")) {
              this.animator.enter(element);
            }
          }
        },
        writable: true,
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
        configurable: true
      }
    });

    return ViewSlot;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/view-factory',["exports", "aurelia-dependency-injection", "./view", "./view-slot", "./content-selector", "./resource-registry"], function (exports, _aureliaDependencyInjection, _view, _viewSlot, _contentSelector, _resourceRegistry) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var BoundViewFactory = exports.BoundViewFactory = (function () {
    function BoundViewFactory(parentContainer, viewFactory, executionContext) {
      _classCallCheck(this, BoundViewFactory);

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
        configurable: true
      }
    });

    return BoundViewFactory;
  })();

  var defaultFactoryOptions = {
    systemControlled: false,
    suppressBind: false
  };

  var ViewFactory = exports.ViewFactory = (function () {
    function ViewFactory(template, instructions, resources) {
      _classCallCheck(this, ViewFactory);

      this.template = template;
      this.instructions = instructions;
      this.resources = resources;
    }

    _prototypeProperties(ViewFactory, null, {
      create: {
        value: function create(container, executionContext) {
          var options = arguments[2] === undefined ? defaultFactoryOptions : arguments[2];

          var fragment = this.template.cloneNode(true),
              instructables = fragment.querySelectorAll(".au-target"),
              instructions = this.instructions,
              resources = this.resources,
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
        },
        writable: true,
        configurable: true
      }
    });

    return ViewFactory;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/binding-language',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var BindingLanguage = exports.BindingLanguage = (function () {
    function BindingLanguage() {
      _classCallCheck(this, BindingLanguage);
    }

    _prototypeProperties(BindingLanguage, null, {
      inspectAttribute: {
        value: function inspectAttribute(resources, attrName, attrValue) {
          throw new Error("A BindingLanguage must implement inspectAttribute(...)");
        },
        writable: true,
        configurable: true
      },
      createAttributeInstruction: {
        value: function createAttributeInstruction(resources, element, info, existingInstruction) {
          throw new Error("A BindingLanguage must implement createAttributeInstruction(...)");
        },
        writable: true,
        configurable: true
      },
      parseText: {
        value: function parseText(resources, value) {
          throw new Error("A BindingLanguage must implement parseText(...)");
        },
        writable: true,
        configurable: true
      }
    });

    return BindingLanguage;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/view-compiler',["exports", "./resource-registry", "./view-factory", "./binding-language"], function (exports, _resourceRegistry, _viewFactory, _bindingLanguage) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

    var knownAttribute = resources.mapAttribute(attrName);
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

  var ViewCompiler = exports.ViewCompiler = (function () {
    function ViewCompiler(bindingLanguage) {
      _classCallCheck(this, ViewCompiler);

      this.bindingLanguage = bindingLanguage;
    }

    _prototypeProperties(ViewCompiler, {
      inject: {
        value: function inject() {
          return [BindingLanguage];
        },
        writable: true,
        configurable: true
      }
    }, {
      compile: {
        value: function compile(templateOrFragment, resources) {
          var options = arguments[2] === undefined ? defaultCompileOptions : arguments[2];

          var instructions = [],
              targetShadowDOM = options.targetShadowDOM,
              content;

          targetShadowDOM = targetShadowDOM && hasShadowDOM;

          if (options.beforeCompile) {
            options.beforeCompile(templateOrFragment);
          }

          if (templateOrFragment.content) {
            content = document.adoptNode(templateOrFragment.content, true);
          } else {
            content = templateOrFragment;
          }

          this.compileNode(content, resources, instructions, templateOrFragment, "root", !targetShadowDOM);

          content.insertBefore(document.createComment("<view>"), content.firstChild);
          content.appendChild(document.createComment("</view>"));

          return new ViewFactory(content, instructions, resources);
        },
        writable: true,
        configurable: true
      },
      compileNode: {
        value: function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
          switch (node.nodeType) {
            case 1:
              //element node
              return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
            case 3:
              //text node
              var expression = this.bindingLanguage.parseText(resources, node.textContent);
              if (expression) {
                var marker = document.createElement("au-marker");
                marker.className = "au-target";
                (node.parentNode || parentNode).insertBefore(marker, node);
                node.textContent = " ";
                instructions.push({ contentExpression: expression });
              }
              return node.nextSibling;
            case 11:
              //document fragment node
              var currentChild = node.firstChild;
              while (currentChild) {
                currentChild = this.compileNode(currentChild, resources, instructions, node, parentInjectorId, targetLightDOM);
              }
              break;
          }

          return node.nextSibling;
        },
        writable: true,
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
              //do we have an attached behavior?
              knownAttribute = resources.mapAttribute(info.attrName); //map the local name to real name
              if (knownAttribute) {
                property = type.attributes[knownAttribute];

                if (property) {
                  //if there's a defined property
                  info.defaultBindingMode = property.defaultBindingMode; //set the default binding mode

                  if (!info.command && !info.expression) {
                    // if there is no command or detected expression
                    info.command = property.hasOptions ? "options" : null; //and it is an optons property, set the options command
                  }
                }
              }
            } else if (elementInstruction) {
              //or if this is on a custom element
              elementProperty = elementInstruction.type.attributes[info.attrName];
              if (elementProperty) {
                //and this attribute is a custom property
                info.defaultBindingMode = elementProperty.defaultBindingMode; //set the default binding mode

                if (!info.command && !info.expression) {
                  // if there is no command or detected expression
                  info.command = elementProperty.hasOptions ? "options" : null; //and it is an optons property, set the options command
                }
              }
            }

            if (elementProperty) {
              instruction = bindingLanguage.createAttributeInstruction(resources, node, info, elementInstruction);
            } else {
              instruction = bindingLanguage.createAttributeInstruction(resources, node, info);
            }

            if (instruction) {
              //HAS BINDINGS
              if (instruction.alteredAttr) {
                type = resources.getAttribute(instruction.attrName);
              }

              if (instruction.discrete) {
                //ref binding or listener binding
                expressions.push(instruction);
              } else {
                //attribute bindings
                if (type) {
                  //templator or attached behavior found
                  instruction.type = type;
                  configureProperties(instruction, resources);

                  if (type.liftsContent) {
                    //template controller
                    instruction.originalAttrName = attrName;
                    liftingInstruction = instruction;
                    break;
                  } else {
                    //attached behavior
                    behaviorInstructions.push(instruction);
                  }
                } else if (elementProperty) {
                  //custom element attribute
                  elementInstruction.attributes[info.attrName].targetProperty = elementProperty.name;
                } else {
                  //standard attribute binding
                  expressions.push(instruction.attributes[instruction.attrName]);
                }
              }
            } else {
              //NO BINDINGS
              if (type) {
                //templator or attached behavior found
                instruction = { attrName: attrName, type: type, attributes: {} };
                instruction.attributes[resources.mapAttribute(attrName)] = attrValue;

                if (type.liftsContent) {
                  //template controller
                  instruction.originalAttrName = attrName;
                  liftingInstruction = instruction;
                  break;
                } else {
                  //attached behavior
                  behaviorInstructions.push(instruction);
                }
              } else if (elementProperty) {
                //custom element attribute
                elementInstruction.attributes[attrName] = attrValue;
              }

              //else; normal attribute; do nothing
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

            if (elementInstruction && elementInstruction.type.skipContentProcessing) {
              return node.nextSibling;
            }

            var currentChild = node.firstChild;
            while (currentChild) {
              currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
            }
          }

          return node.nextSibling;
        },
        writable: true,
        configurable: true
      }
    });

    return ViewCompiler;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/view-engine',["exports", "aurelia-logging", "aurelia-loader", "aurelia-path", "./view-compiler", "./resource-registry"], function (exports, _aureliaLogging, _aureliaLoader, _aureliaPath, _viewCompiler, _resourceRegistry) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var LogManager = _aureliaLogging;
  var Loader = _aureliaLoader.Loader;
  var relativeToFile = _aureliaPath.relativeToFile;
  var ViewCompiler = _viewCompiler.ViewCompiler;
  var ResourceRegistry = _resourceRegistry.ResourceRegistry;
  var ViewResources = _resourceRegistry.ViewResources;

  var importSplitter = /\s*,\s*/,
      logger = LogManager.getLogger("templating");

  var ViewEngine = exports.ViewEngine = (function () {
    function ViewEngine(loader, viewCompiler, appResources) {
      _classCallCheck(this, ViewEngine);

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
        configurable: true
      },
      loadTemplateResources: {
        value: function loadTemplateResources(templateUrl, template, associatedModuleId) {
          var _this = this;

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
              associatedModule = _this.resourceCoordinator.getExistingModuleAnalysis(associatedModuleId);

              if (associatedModule) {
                associatedModule.register(registry);
              }
            }

            return registry;
          });
        },
        writable: true,
        configurable: true
      }
    });

    return ViewEngine;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/view-strategy',["exports", "aurelia-metadata", "aurelia-path"], function (exports, _aureliaMetadata, _aureliaPath) {
  

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Metadata = _aureliaMetadata.Metadata;
  var Origin = _aureliaMetadata.Origin;
  var relativeToFile = _aureliaPath.relativeToFile;

  var ViewStrategy = exports.ViewStrategy = (function () {
    function ViewStrategy() {
      _classCallCheck(this, ViewStrategy);
    }

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
        configurable: true
      }
    }, {
      makeRelativeTo: {
        value: function makeRelativeTo(baseUrl) {},
        writable: true,
        configurable: true
      },
      loadViewFactory: {
        value: function loadViewFactory(viewEngine, options) {
          throw new Error("A ViewStrategy must implement loadViewFactory(viewEngine, options).");
        },
        writable: true,
        configurable: true
      }
    });

    return ViewStrategy;
  })();

  var UseView = exports.UseView = (function (ViewStrategy) {
    function UseView(path) {
      _classCallCheck(this, UseView);

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
        configurable: true
      },
      makeRelativeTo: {
        value: function makeRelativeTo(file) {
          this.absolutePath = relativeToFile(this.path, file);
        },
        writable: true,
        configurable: true
      }
    });

    return UseView;
  })(ViewStrategy);

  var ConventionalView = exports.ConventionalView = (function (ViewStrategy) {
    function ConventionalView(moduleId) {
      _classCallCheck(this, ConventionalView);

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
        configurable: true
      }
    }, {
      loadViewFactory: {
        value: function loadViewFactory(viewEngine, options) {
          return viewEngine.loadViewFactory(this.viewUrl, options, this.moduleId);
        },
        writable: true,
        configurable: true
      }
    });

    return ConventionalView;
  })(ViewStrategy);

  var NoView = exports.NoView = (function (ViewStrategy) {
    function NoView() {
      _classCallCheck(this, NoView);

      if (ViewStrategy != null) {
        ViewStrategy.apply(this, arguments);
      }
    }

    _inherits(NoView, ViewStrategy);

    _prototypeProperties(NoView, null, {
      loadViewFactory: {
        value: function loadViewFactory() {
          return Promise.resolve(null);
        },
        writable: true,
        configurable: true
      }
    });

    return NoView;
  })(ViewStrategy);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/custom-element',["exports", "aurelia-metadata", "./behavior-instance", "./behaviors", "./content-selector", "./view-engine", "./view-strategy", "./util"], function (exports, _aureliaMetadata, _behaviorInstance, _behaviors, _contentSelector, _viewEngine, _viewStrategy, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var UseShadowDOM = exports.UseShadowDOM = function UseShadowDOM() {
    _classCallCheck(this, UseShadowDOM);
  };

  var SkipContentProcessing = exports.SkipContentProcessing = function SkipContentProcessing() {
    _classCallCheck(this, SkipContentProcessing);
  };

  var CustomElement = exports.CustomElement = (function (ResourceType) {
    function CustomElement(tagName) {
      _classCallCheck(this, CustomElement);

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
        configurable: true
      }
    }, {
      analyze: {
        value: function analyze(container, target) {
          var meta = Metadata.on(target);
          configureBehavior(container, this, target, valuePropertyName);

          this.configured = true;
          this.targetShadowDOM = meta.has(UseShadowDOM);
          this.skipContentProcessing = meta.has(SkipContentProcessing);
          this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
        },
        writable: true,
        configurable: true
      },
      load: {
        value: function load(container, target, viewStrategy) {
          var _this = this;

          var options;

          viewStrategy = viewStrategy || ViewStrategy.getDefault(target);
          options = {
            targetShadowDOM: this.targetShadowDOM,
            beforeCompile: target.beforeCompile
          };

          if (!viewStrategy.moduleId) {
            viewStrategy.moduleId = Origin.get(target).moduleId;
          }

          return viewStrategy.loadViewFactory(container.get(ViewEngine), options).then(function (viewFactory) {
            _this.viewFactory = viewFactory;
            return _this;
          });
        },
        writable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerElement(name || this.name, this);
        },
        writable: true,
        configurable: true
      },
      compile: {
        value: function compile(compiler, resources, node, instruction) {
          if (!this.usesShadowDOM && !this.skipContentProcessing && node.hasChildNodes()) {
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
        configurable: true
      },
      create: {
        value: function create(container) {
          var instruction = arguments[1] === undefined ? defaultInstruction : arguments[1];
          var element = arguments[2] === undefined ? null : arguments[2];

          var executionContext = instruction.executionContext || container.get(this.target),
              behaviorInstance = new BehaviorInstance(this, executionContext, instruction),
              host;

          if (this.viewFactory) {
            behaviorInstance.view = this.viewFactory.create(container, behaviorInstance.executionContext, instruction);
          }

          if (element) {
            element.primaryBehavior = behaviorInstance;

            if (!(this.apiName in element)) {
              element[this.apiName] = behaviorInstance.executionContext;
            }

            if (behaviorInstance.view) {
              if (this.usesShadowDOM) {
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

              if (this.childExpression) {
                behaviorInstance.view.addBinding(this.childExpression.createBinding(host, behaviorInstance.executionContext));
              }

              behaviorInstance.view.appendNodesTo(host);
            }
          } else if (behaviorInstance.view) {
            behaviorInstance.view.owner = behaviorInstance;
          }

          return behaviorInstance;
        },
        writable: true,
        configurable: true
      }
    });

    return CustomElement;
  })(ResourceType);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/element-config',["exports", "aurelia-metadata", "aurelia-binding"], function (exports, _aureliaMetadata, _aureliaBinding) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ResourceType = _aureliaMetadata.ResourceType;
  var EventManager = _aureliaBinding.EventManager;

  var ElementConfig = exports.ElementConfig = (function (ResourceType) {
    function ElementConfig() {
      _classCallCheck(this, ElementConfig);

      if (ResourceType != null) {
        ResourceType.apply(this, arguments);
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
        configurable: true
      },
      register: {
        value: function register() {},
        writable: true,
        configurable: true
      }
    });

    return ElementConfig;
  })(ResourceType);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/template-controller',["exports", "aurelia-metadata", "./behavior-instance", "./behaviors", "./util"], function (exports, _aureliaMetadata, _behaviorInstance, _behaviors, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ResourceType = _aureliaMetadata.ResourceType;
  var BehaviorInstance = _behaviorInstance.BehaviorInstance;
  var configureBehavior = _behaviors.configureBehavior;
  var hyphenate = _util.hyphenate;

  var TemplateController = exports.TemplateController = (function (ResourceType) {
    function TemplateController(attribute) {
      _classCallCheck(this, TemplateController);

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
        configurable: true
      }
    }, {
      analyze: {
        value: function analyze(container, target) {
          configureBehavior(container, this, target);
        },
        writable: true,
        configurable: true
      },
      load: {
        value: function load(container, target) {
          return Promise.resolve(this);
        },
        writable: true,
        configurable: true
      },
      register: {
        value: function register(registry, name) {
          registry.registerAttribute(name || this.name, this, this.name);
        },
        writable: true,
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
              //HACK: IE template element and shadow dom polyfills not quite right...
              ShadowDOMPolyfill.unwrap(parentNode).replaceChild(ShadowDOMPolyfill.unwrap(template), ShadowDOMPolyfill.unwrap(node));
            } else {
              //HACK: same as above
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
        configurable: true
      },
      create: {
        value: function create(container, instruction, element) {
          var executionContext = instruction.executionContext || container.get(this.target),
              behaviorInstance = new BehaviorInstance(this, executionContext, instruction);

          element.primaryBehavior = behaviorInstance;

          if (!(this.apiName in element)) {
            element[this.apiName] = behaviorInstance.executionContext;
          }

          return behaviorInstance;
        },
        writable: true,
        configurable: true
      }
    });

    return TemplateController;
  })(ResourceType);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/resource-coordinator',["exports", "aurelia-loader", "aurelia-path", "aurelia-dependency-injection", "aurelia-metadata", "aurelia-binding", "./custom-element", "./attached-behavior", "./template-controller", "./view-engine", "./resource-registry"], function (exports, _aureliaLoader, _aureliaPath, _aureliaDependencyInjection, _aureliaMetadata, _aureliaBinding, _customElement, _attachedBehavior, _templateController, _viewEngine, _resourceRegistry) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var ResourceCoordinator = exports.ResourceCoordinator = (function () {
    function ResourceCoordinator(loader, container, viewEngine, appResources) {
      _classCallCheck(this, ResourceCoordinator);

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
        configurable: true
      }
    }, {
      getExistingModuleAnalysis: {
        value: function getExistingModuleAnalysis(id) {
          return this.importedModules[id] || this.importedAnonymous[id];
        },
        writable: true,
        configurable: true
      },
      loadViewModelInfo: {
        value: function loadViewModelInfo(moduleImport, moduleMember) {
          return this._loadAndAnalyzeModuleForElement(moduleImport, moduleMember, this.importedAnonymous, true);
        },
        writable: true,
        configurable: true
      },
      loadElement: {
        value: function loadElement(moduleImport, moduleMember, viewStategy) {
          var _this = this;

          return this._loadAndAnalyzeModuleForElement(moduleImport, moduleMember, this.importedModules, false).then(function (info) {
            var type = info.type;

            if (type.isLoaded) {
              return type;
            }

            type.isLoaded = true;

            return type.load(_this.container, info.value, viewStategy);
          });
        },
        writable: true,
        configurable: true
      },
      _loadAndAnalyzeModuleForElement: {
        value: function _loadAndAnalyzeModuleForElement(moduleImport, moduleMember, cache, skipCacheLookup) {
          var _this = this;

          var existing = !skipCacheLookup && cache[moduleImport];

          if (existing) {
            return Promise.resolve(existing.element);
          }

          return this.loader.loadModule(moduleImport).then(function (elementModule) {
            var analysis = analyzeModule(elementModule, moduleMember),
                resources = analysis.resources,
                container = _this.container,
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
        configurable: true
      },
      importResourcesFromModuleIds: {
        value: function importResourcesFromModuleIds(importIds) {
          var _this = this;

          return this.loader.loadAllModules(importIds).then(function (imports) {
            return _this.importResourcesFromModules(imports, importIds);
          });
        },
        writable: true,
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
        configurable: true
      }
    });

    return ResourceCoordinator;
  })();

  var ResourceModule = (function () {
    function ResourceModule(source, element, resources) {
      _classCallCheck(this, ResourceModule);

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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/composition-engine',["exports", "aurelia-metadata", "aurelia-dependency-injection", "./view-strategy", "./resource-coordinator", "./view-engine", "./custom-element"], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _viewStrategy, _resourceCoordinator, _viewEngine, _customElement) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Origin = _aureliaMetadata.Origin;
  var Metadata = _aureliaMetadata.Metadata;
  var ViewStrategy = _viewStrategy.ViewStrategy;
  var UseView = _viewStrategy.UseView;
  var ResourceCoordinator = _resourceCoordinator.ResourceCoordinator;
  var ViewEngine = _viewEngine.ViewEngine;
  var CustomElement = _customElement.CustomElement;

  var CompositionEngine = exports.CompositionEngine = (function () {
    function CompositionEngine(resourceCoordinator, viewEngine) {
      _classCallCheck(this, CompositionEngine);

      this.resourceCoordinator = resourceCoordinator;
      this.viewEngine = viewEngine;
    }

    _prototypeProperties(CompositionEngine, {
      inject: {
        value: function inject() {
          return [ResourceCoordinator, ViewEngine];
        },
        writable: true,
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
        configurable: true
      }
    });

    return CompositionEngine;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating/index',["exports", "aurelia-metadata", "./property", "./attached-behavior", "./children", "./custom-element", "./element-config", "./template-controller", "./view-strategy", "./resource-coordinator", "./resource-registry", "./view-compiler", "./view-engine", "./view-factory", "./view-slot", "./binding-language", "./composition-engine", "./animator"], function (exports, _aureliaMetadata, _property, _attachedBehavior, _children, _customElement, _elementConfig, _templateController, _viewStrategy, _resourceCoordinator, _resourceRegistry, _viewCompiler, _viewEngine, _viewFactory, _viewSlot, _bindingLanguage, _compositionEngine, _animator) {
  

  var Metadata = _aureliaMetadata.Metadata;
  var BehaviorProperty = _property.BehaviorProperty;
  var OptionsProperty = _property.OptionsProperty;
  var AttachedBehavior = _attachedBehavior.AttachedBehavior;
  var ChildObserver = _children.ChildObserver;
  var CustomElement = _customElement.CustomElement;
  var UseShadowDOM = _customElement.UseShadowDOM;
  var SkipContentProcessing = _customElement.SkipContentProcessing;
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
  exports.SkipContentProcessing = _customElement.SkipContentProcessing;
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
  exports.Animator = _animator.Animator;
  var Behavior = exports.Behavior = Metadata;
  var Behaviour = exports.Behaviour = Metadata;

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
  Metadata.configure.classHelper("skipContentProcessing", SkipContentProcessing);
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating', ['aurelia-templating/index'], function (main) { return main; });

define('aurelia-framework/plugins',["exports", "aurelia-logging", "aurelia-metadata"], function (exports, _aureliaLogging, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var LogManager = _aureliaLogging;
  var Metadata = _aureliaMetadata.Metadata;

  var logger = LogManager.getLogger("aurelia");

  function loadPlugin(aurelia, loader, info) {
    logger.debug("Loading plugin " + info.moduleId + ".");

    aurelia.currentPluginId = info.moduleId;

    var baseUrl = info.moduleId.indexOf("./") === 0 ? undefined : "";

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

  /**
   * Manages loading and installing plugins.
   *
   * @class Plugins
   * @constructor
   * @param {Aurelia} aurelia An instance of Aurelia.
   */

  var Plugins = exports.Plugins = (function () {
    function Plugins(aurelia) {
      _classCallCheck(this, Plugins);

      this.aurelia = aurelia;
      this.info = [];
      this.processed = false;
    }

    _prototypeProperties(Plugins, null, {
      plugin: {

        /**
         * Installs a plugin before Aurelia starts.
         *
         * @method plugin
         * @param {moduleId} moduleId The ID of the module to install.
         * @param {config} config The configuration for the specified module.
         * @return {Plugins} Returns the current Plugins instance.
        */

        value: (function (_plugin) {
          var _pluginWrapper = function plugin(_x, _x2) {
            return _plugin.apply(this, arguments);
          };

          _pluginWrapper.toString = function () {
            return _plugin.toString();
          };

          return _pluginWrapper;
        })(function (moduleId, config) {
          var plugin = { moduleId: moduleId, config: config || {} };

          if (this.processed) {
            loadPlugin(this.aurelia, this.aurelia.loader, plugin);
          } else {
            this.info.push(plugin);
          }

          return this;
        }),
        writable: true,
        configurable: true
      },
      es5: {

        /**
         * Installs special support for ES5 authoring.
         *
         * @method es5
         * @return {Plugins} Returns the current Plugins instance.
        */

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
        configurable: true
      },
      atscript: {

        /**
         * Installs special support for AtScript authoring.
         *
         * @method atscript
         * @return {Plugins} Returns the current Plugins instance.
        */

        value: function atscript() {
          this.aurelia.container.supportAtScript();
          Metadata.configure.locator(function (fn) {
            return fn.annotate || fn.annotations;
          });
          return this;
        },
        writable: true,
        configurable: true
      },
      _process: {
        value: function _process() {
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
        configurable: true
      }
    });

    return Plugins;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-framework/aurelia',["exports", "aurelia-logging", "aurelia-dependency-injection", "aurelia-loader", "aurelia-templating", "./plugins"], function (exports, _aureliaLogging, _aureliaDependencyInjection, _aureliaLoader, _aureliaTemplating, _plugins) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var LogManager = _aureliaLogging;
  var Container = _aureliaDependencyInjection.Container;
  var Loader = _aureliaLoader.Loader;
  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var ResourceCoordinator = _aureliaTemplating.ResourceCoordinator;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ResourceRegistry = _aureliaTemplating.ResourceRegistry;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var Animator = _aureliaTemplating.Animator;
  var Plugins = _plugins.Plugins;

  var logger = LogManager.getLogger("aurelia"),
      slice = Array.prototype.slice;

  if (!window.CustomEvent || typeof window.CustomEvent !== "function") {
    var CustomEvent = function CustomEvent(event, params) {
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

  function preventActionlessFormSubmit() {
    document.body.addEventListener("submit", function (evt) {
      var target = evt.target;
      var action = target.action;

      if (target.tagName.toLowerCase() === "form" && !action) {
        evt.preventDefault();
      }
    });
  }

  function loadResources(container, resourcesToLoad, appResources) {
    var resourceCoordinator = container.get(ResourceCoordinator),
        current;

    function next() {
      if (current = resourcesToLoad.shift()) {
        return resourceCoordinator.importResources(current, current.resourceManifestUrl).then(function (resources) {
          resources.forEach(function (x) {
            return x.register(appResources);
          });
          return next();
        });
      }

      return Promise.resolve();
    }

    return next();
  }

  /**
   * The framework core that provides the main Aurelia object.
   *
   * @class Aurelia
   * @constructor
   * @param {Loader} loader The loader for this Aurelia instance to use. If a loader is not specified, Aurelia will use a defaultLoader.
   * @param {Container} container The dependency injection container for this Aurelia instance to use. If a container is not specified, Aurelia will create an empty container.
   * @param {ResourceRegistry} resources The resource registry for this Aurelia instance to use. If a resource registry is not specified, Aurelia will create an empty registry.
   */

  var Aurelia = exports.Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      _classCallCheck(this, Aurelia);

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

        /**
         * Adds an existing object to the framework's dependency injection container.
         *
         * @method withInstance
         * @param {Class} type The object type of the dependency that the framework will inject.
         * @param {Object} instance The existing instance of the dependency that the framework will inject.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function withInstance(type, instance) {
          this.container.registerInstance(type, instance);
          return this;
        },
        writable: true,
        configurable: true
      },
      withSingleton: {

        /**
         * Adds a singleton to the framework's dependency injection container.
         *
         * @method withSingleton
         * @param {Class} type The object type of the dependency that the framework will inject.
         * @param {Object} implementation The constructor function of the dependency that the framework will inject.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function withSingleton(type, implementation) {
          this.container.registerSingleton(type, implementation);
          return this;
        },
        writable: true,
        configurable: true
      },
      withResources: {

        /**
         * Adds a resource to be imported into the Aurelia framework.
         *
         * @method withResources
         * @param {Object|Array} resources The constructor function(s) to use when the dependency needs to be instantiated.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function withResources(resources) {
          var toAdd = Array.isArray(resources) ? resources : slice.call(arguments);
          toAdd.resourceManifestUrl = this.currentPluginId;
          this.resourcesToLoad.push(toAdd);
          return this;
        },
        writable: true,
        configurable: true
      },
      start: {

        /**
         * Loads plugins, then resources, and then starts the Aurelia instance.
         *
         * @method start
         * @return {Aurelia} Returns the started Aurelia instance.
         */

        value: function start() {
          var _this = this;

          if (this.started) {
            return Promise.resolve(this);
          }

          this.started = true;
          logger.info("Aurelia Starting");

          preventActionlessFormSubmit();

          var resourcesToLoad = this.resourcesToLoad;
          this.resourcesToLoad = [];

          return this.use._process().then(function () {
            if (!_this.container.hasHandler(BindingLanguage)) {
              var message = "You must configure Aurelia with a BindingLanguage implementation.";
              logger.error(message);
              throw new Error(message);
            }

            if (!_this.container.hasHandler(Animator)) {
              _this.withInstance(Animator, new Animator());
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
        configurable: true
      },
      setRoot: {

        /**
         * Instantiates the root view-model and view and add them to the DOM.
         *
         * @method withSingleton
         * @param {Object} root The root view-model to load upon bootstrap.
         * @param {string|Object} applicationHost The DOM object that Aurelia will attach to.
         * @return {Aurelia} Returns the current Aurelia instance.
         */

        value: function setRoot(root, applicationHost) {
          var _this = this;

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
            _this.root = root;
            instruction.viewSlot.attached();
            var evt = new window.CustomEvent("aurelia-composed", { bubbles: true, cancelable: true });
            setTimeout(function () {
              return document.dispatchEvent(evt);
            }, 1);
            return _this;
          });
        },
        writable: true,
        configurable: true
      }
    });

    return Aurelia;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-framework/index',["exports", "./aurelia", "aurelia-dependency-injection", "aurelia-binding", "aurelia-metadata", "aurelia-templating", "aurelia-loader", "aurelia-task-queue", "aurelia-logging"], function (exports, _aurelia, _aureliaDependencyInjection, _aureliaBinding, _aureliaMetadata, _aureliaTemplating, _aureliaLoader, _aureliaTaskQueue, _aureliaLogging) {
  

  var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

  var _defaults = function (obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; };

  /**
   * The aurelia framework brings together all the required core aurelia libraries into a ready-to-go application-building platform.
   *
   * @module framework
   */

  exports.Aurelia = _aurelia.Aurelia;

  _defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));

  _defaults(exports, _interopRequireWildcard(_aureliaBinding));

  _defaults(exports, _interopRequireWildcard(_aureliaMetadata));

  _defaults(exports, _interopRequireWildcard(_aureliaTemplating));

  _defaults(exports, _interopRequireWildcard(_aureliaLoader));

  _defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));

  var TheLogManager = _aureliaLogging;
  var LogManager = exports.LogManager = TheLogManager;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-framework', ['aurelia-framework/index'], function (main) { return main; });

define('aurelia-route-recognizer/dsl',["exports"], function (exports) {
  

  exports.map = map;
  function Target(path, matcher, delegate) {
    this.path = path;
    this.matcher = matcher;
    this.delegate = delegate;
  }

  Target.prototype = {
    to: function to(target, callback) {
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
    add: function add(path, handler) {
      this.routes[path] = handler;
    },

    addChild: function addChild(path, target, callback, delegate) {
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-route-recognizer/index',["exports", "./dsl"], function (exports, _dsl) {
  

  var map = _dsl.map;

  var specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];

  var escapeRegex = new RegExp("(\\" + specials.join("|\\") + ")", "g");

  function isArray(test) {
    return Object.prototype.toString.call(test) === "[object Array]";
  }

  // A Segment represents a segment in the original route description.
  // Each Segment type provides an `eachChar` and `regex` method.
  //
  // The `eachChar` method invokes the callback with one or more character
  // specifications. A character specification consumes one or more input
  // characters.
  //
  // The `regex` method returns a regex fragment for the segment. If the
  // segment is a dynamic of star segment, the regex fragment also includes
  // a capture.
  //
  // A character specification contains:
  //
  // * `validChars`: a String with a list of all valid characters, or
  // * `invalidChars`: a String with a list of all invalid characters
  // * `repeat`: true if the character specification can repeat

  function StaticSegment(string) {
    this.string = string;
  }
  StaticSegment.prototype = {
    eachChar: function eachChar(callback) {
      var string = this.string,
          ch;

      for (var i = 0, l = string.length; i < l; i++) {
        ch = string.charAt(i);
        callback({ validChars: ch });
      }
    },

    regex: function regex() {
      return this.string.replace(escapeRegex, "\\$1");
    },

    generate: function generate() {
      return this.string;
    }
  };

  function DynamicSegment(name) {
    this.name = name;
  }
  DynamicSegment.prototype = {
    eachChar: function eachChar(callback) {
      callback({ invalidChars: "/", repeat: true });
    },

    regex: function regex() {
      return "([^/]+)";
    },

    generate: function generate(params) {
      return params[this.name];
    }
  };

  function StarSegment(name) {
    this.name = name;
  }
  StarSegment.prototype = {
    eachChar: function eachChar(callback) {
      callback({ invalidChars: "", repeat: true });
    },

    regex: function regex() {
      return "(.+)";
    },

    generate: function generate(params) {
      return params[this.name];
    }
  };

  function EpsilonSegment() {}
  EpsilonSegment.prototype = {
    eachChar: function eachChar() {},
    regex: function regex() {
      return "";
    },
    generate: function generate() {
      return "";
    }
  };

  function parse(route, names, types) {
    // normalize route as not starting with a "/". Recognition will
    // also normalize.
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

  // A State has a character specification and (`charSpec`) and a list of possible
  // subsequent states (`nextStates`).
  //
  // If a State is an accepting state, it will also have several additional
  // properties:
  //
  // * `regex`: A regular expression that is used to extract parameters from paths
  //   that reached this accepting state.
  // * `handlers`: Information on how to convert the list of captures into calls
  //   to registered handlers with the specified parameters
  // * `types`: How many static, dynamic or star segments in this route. Used to
  //   decide which route to use if multiple registered routes match a path.
  //
  // Currently, State is implemented naively by looping over `nextStates` and
  // comparing a character specification against a character. A more efficient
  // implementation would use a hash of keys pointing at one or more next states.

  function State(charSpec) {
    this.charSpec = charSpec;
    this.nextStates = [];
  }

  State.prototype = {
    get: function get(charSpec) {
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

    put: function put(charSpec) {
      var state;

      // If the character specification already exists in a child of the current
      // state, just return that state.
      if (state = this.get(charSpec)) {
        return state;
      }

      // Make a new state for the character spec
      state = new State(charSpec);

      // Insert the new state as a child of the current state
      this.nextStates.push(state);

      // If this character specification repeats, insert the new state as a child
      // of itself. Note that this will not trigger an infinite loop because each
      // transition during recognition consumes a character.
      if (charSpec.repeat) {
        state.nextStates.push(state);
      }

      // Return the new state
      return state;
    },

    // Find a list of child states matching the next character
    match: function match(ch) {
      // DEBUG "Processing `" + ch + "`:"
      var nextStates = this.nextStates,
          child,
          charSpec,
          chars;

      // DEBUG "  " + debugState(this)
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

    /** IF DEBUG
    , debug: function() {
      var charSpec = this.charSpec,
          debug = "[",
          chars = charSpec.validChars || charSpec.invalidChars;
       if (charSpec.invalidChars) { debug += "^"; }
      debug += chars;
      debug += "]";
       if (charSpec.repeat) { debug += "+"; }
       return debug;
    }
    END IF **/
  };

  /** IF DEBUG
  function debug(log) {
    console.log(log);
  }
  
  function debugState(state) {
    return state.nextStates.map(function(n) {
      if (n.nextStates.length === 0) { return "( " + n.debug() + " [accepting] )"; }
      return "( " + n.debug() + " <then> " + n.nextStates.map(function(s) { return s.debug() }).join(" or ") + " )";
    }).join(", ")
  }
  END IF **/

  // This is a somewhat naive strategy, but should work in a lot of cases
  // A better strategy would properly resolve /posts/:id/new and /posts/edit/:id.
  //
  // This strategy generally prefers more static and less dynamic matching.
  // Specifically, it
  //
  //  * prefers fewer stars to more, then
  //  * prefers using stars for less of the match to more, then
  //  * prefers fewer dynamic segments to more, then
  //  * prefers more static segments to more
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
    function F() {}
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

  // The main interface

  var RouteRecognizer = exports.RouteRecognizer = function RouteRecognizer() {
    this.rootState = new State();
    this.names = {};
  };

  RouteRecognizer.prototype = {
    add: function add(routes, options) {
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

          // Add a "/" for the new segment
          currentState = currentState.put({ validChars: "/" });
          regex += "/";

          // Add a representation of the segment to the NFA and regex
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

    handlersFor: function handlersFor(name) {
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

    hasRoute: function hasRoute(name) {
      return !!this.names[name];
    },

    generate: function generate(name, params) {
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

    generateQueryString: function generateQueryString(params, handlers) {
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

    parseQueryString: function parseQueryString(queryString) {
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
          //Handle arrays
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

    recognize: function recognize(path) {
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

      // DEBUG GROUP path

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

      // END DEBUG GROUP

      var solutions = [];
      for (i = 0, l = states.length; i < l; i++) {
        if (states[i].handlers) {
          solutions.push(states[i]);
        }
      }

      states = sortSolutions(solutions);

      var state = solutions[0];

      if (state && state.handlers) {
        // if a trailing slash was dropped and a star segment is the last segment
        // specified, put the trailing slash back
        if (isSlashDropped && state.regex.source.slice(-5) === "(.+)$") {
          path = path + "/";
        }
        return findHandler(state, path, queryParams);
      }
    }
  };

  RouteRecognizer.prototype.map = map;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-route-recognizer', ['aurelia-route-recognizer/index'], function (main) { return main; });

define('aurelia-router/navigation-commands',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  /**
   * Determines if the provided object is a navigation command.
   * A navigation command is anything with a navigate method.
   * @param {object} obj The item to check.
   * @return {boolean}
   */
  exports.isNavigationCommand = isNavigationCommand;

  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === "function";
  }

  /**
  * Used during the activation lifecycle to cause a redirect.
  *
  * @class Redirect
  * @constructor
  * @param {String} url The url to redirect to.
  */

  var Redirect = exports.Redirect = (function () {
    function Redirect(url) {
      _classCallCheck(this, Redirect);

      this.url = url;
      this.shouldContinueProcessing = false;
    }

    _prototypeProperties(Redirect, null, {
      navigate: {

        /**
        * Called by the navigation pipeline to navigate.
        *
        * @method navigate
        * @param {Router} appRouter - a router which should redirect
        */

        value: function navigate(appRouter) {
          (this.router || appRouter).navigate(this.url, { trigger: true, replace: true });
        },
        writable: true,
        configurable: true
      }
    });

    return Redirect;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/navigation-plan',["exports", "./navigation-commands"], function (exports, _navigationCommands) {
  

  var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.buildNavigationPlan = buildNavigationPlan;
  var Redirect = _navigationCommands.Redirect;
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

          //TODO: should we tell them if the parent had a lifecycle min change?
          viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, _toConsumableArray(next.lifecycleArgs));
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
    function BuildNavigationPlanStep() {
      _classCallCheck(this, BuildNavigationPlanStep);
    }

    _prototypeProperties(BuildNavigationPlanStep, null, {
      run: {
        value: function run(navigationContext, next) {
          if (navigationContext.nextInstruction.config.redirect) {
            return next.cancel(new Redirect(navigationContext.nextInstruction.config.redirect));
          }

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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/navigation-context',["exports", "./navigation-plan"], function (exports, _navigationPlan) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var REPLACE = _navigationPlan.REPLACE;

  var NavigationContext = exports.NavigationContext = (function () {
    function NavigationContext(router, nextInstruction) {
      _classCallCheck(this, NavigationContext);

      this.router = router;
      this.nextInstruction = nextInstruction;
      this.currentInstruction = router.currentInstruction;
      this.prevInstruction = router.currentInstruction;
    }

    _prototypeProperties(NavigationContext, null, {
      getAllContexts: {
        value: function getAllContexts() {
          var acc = arguments[0] === undefined ? [] : arguments[0];

          acc.push(this);
          if (this.plan) {
            for (var key in this.plan) {
              this.plan[key].childNavigationContext && this.plan[key].childNavigationContext.getAllContexts(acc);
            }
          }
          return acc;
        },
        writable: true,
        configurable: true
      },
      nextInstructions: {
        get: function () {
          return this.getAllContexts().map(function (c) {
            return c.nextInstruction;
          }).filter(function (c) {
            return c;
          });
        },
        configurable: true
      },
      currentInstructions: {
        get: function () {
          return this.getAllContexts().map(function (c) {
            return c.currentInstruction;
          }).filter(function (c) {
            return c;
          });
        },
        configurable: true
      },
      prevInstructions: {
        get: function () {
          return this.getAllContexts().map(function (c) {
            return c.prevInstruction;
          }).filter(function (c) {
            return c;
          });
        },
        configurable: true
      },
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
    function CommitChangesStep() {
      _classCallCheck(this, CommitChangesStep);
    }

    _prototypeProperties(CommitChangesStep, null, {
      run: {
        value: function run(navigationContext, next) {
          return navigationContext.commitChanges(true).then(function () {
            var title = navigationContext.buildTitle();
            if (title) {
              document.title = title;
            }

            return next();
          });
        },
        writable: true,
        configurable: true
      }
    });

    return CommitChangesStep;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/navigation-instruction',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var NavigationInstruction = exports.NavigationInstruction = (function () {
    function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
      _classCallCheck(this, NavigationInstruction);

      this.fragment = fragment;
      this.queryString = queryString;
      this.params = params || {};
      this.queryParams = queryParams;
      this.config = config;
      this.lifecycleArgs = [params, queryParams, config, this];
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/route-filters',["exports", "aurelia-dependency-injection"], function (exports, _aureliaDependencyInjection) {
  

  var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.createRouteFilterStep = createRouteFilterStep;
  var Container = _aureliaDependencyInjection.Container;

  var RouteFilterContainer = exports.RouteFilterContainer = (function () {
    function RouteFilterContainer(container) {
      _classCallCheck(this, RouteFilterContainer);

      this.container = container;
      this.filters = {};
      this.filterCache = {};
    }

    _prototypeProperties(RouteFilterContainer, {
      inject: {
        value: function inject() {
          return [Container];
        },
        writable: true,
        configurable: true
      }
    }, {
      addStep: {
        value: function addStep(name, step) {
          var index = arguments[2] === undefined ? -1 : arguments[2];

          var filter = this.filters[name];
          if (!filter) {
            filter = this.filters[name] = [];
          }

          if (index === -1) {
            index = filter.length;
          }

          filter.splice(index, 0, step);
          this.filterCache = {};
        },
        writable: true,
        configurable: true
      },
      getFilterSteps: {
        value: function getFilterSteps(name) {
          if (this.filterCache[name]) {
            return this.filterCache[name];
          }

          var steps = [];
          var filter = this.filters[name];
          if (!filter) {
            return steps;
          }

          for (var i = 0, l = filter.length; i < l; i++) {
            if (typeof filter[i] === "string") {
              steps.push.apply(steps, _toConsumableArray(this.getFilterSteps(filter[i])));
            } else {
              steps.push(this.container.get(filter[i]));
            }
          }

          return this.filterCache[name] = steps;
        },
        writable: true,
        configurable: true
      }
    });

    return RouteFilterContainer;
  })();

  function createRouteFilterStep(name) {
    function create(routeFilterContainer) {
      return new RouteFilterStep(name, routeFilterContainer);
    };
    create.inject = function () {
      return [RouteFilterContainer];
    };
    return create;
  }

  var RouteFilterStep = (function () {
    function RouteFilterStep(name, routeFilterContainer) {
      _classCallCheck(this, RouteFilterStep);

      this.name = name;
      this.routeFilterContainer = routeFilterContainer;
      this.isMultiStep = true;
    }

    _prototypeProperties(RouteFilterStep, null, {
      getSteps: {
        value: function getSteps() {
          return this.routeFilterContainer.getFilterSteps(this.name);
        },
        writable: true,
        configurable: true
      }
    });

    return RouteFilterStep;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/router-configuration',["exports", "./route-filters"], function (exports, _routeFilters) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var RouteFilterContainer = _routeFilters.RouteFilterContainer;

  var RouterConfiguration = exports.RouterConfiguration = (function () {
    function RouterConfiguration() {
      _classCallCheck(this, RouterConfiguration);

      this.instructions = [];
      this.options = {};
      this.pipelineSteps = [];
    }

    _prototypeProperties(RouterConfiguration, null, {
      addPipelineStep: {
        value: function addPipelineStep(name, step) {
          this.pipelineSteps.push({ name: name, step: step });
        },
        writable: true,
        configurable: true
      },
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
              pipelineSteps = this.pipelineSteps,
              i,
              ii,
              filterContainer;

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

          if (pipelineSteps.length) {
            // Pipeline steps should only be added at the app router
            if (!router.isRoot) {
              throw new Error("Pipeline steps can only be added to the root router");
            }

            filterContainer = router.container.get(RouteFilterContainer);
            for (i = 0, ii = pipelineSteps.length; i < ii; ++i) {
              var _pipelineSteps$i = pipelineSteps[i];
              var name = _pipelineSteps$i.name;
              var step = _pipelineSteps$i.step;

              filterContainer.addStep(name, step);
            }
          }
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
          return value ? value.substr(0, 1).toUpperCase() + value.substr(1) : null;
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/router',["exports", "aurelia-route-recognizer", "aurelia-path", "./navigation-context", "./navigation-instruction", "./router-configuration", "./util"], function (exports, _aureliaRouteRecognizer, _aureliaPath, _navigationContext, _navigationInstruction, _routerConfiguration, _util) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var RouteRecognizer = _aureliaRouteRecognizer.RouteRecognizer;
  var join = _aureliaPath.join;
  var NavigationContext = _navigationContext.NavigationContext;
  var NavigationInstruction = _navigationInstruction.NavigationInstruction;
  var RouterConfiguration = _routerConfiguration.RouterConfiguration;
  var processPotential = _util.processPotential;

  var Router = exports.Router = (function () {
    function Router(container, history) {
      _classCallCheck(this, Router);

      this.container = container;
      this.history = history;
      this.viewPorts = {};
      this.reset();
      this.baseUrl = "";
    }

    _prototypeProperties(Router, null, {
      isRoot: {
        get: function () {
          return false;
        },
        configurable: true
      },
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
          if (fragment === "") fragment = "/";
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
          navModel.settings = config.settings || (config.settings = {});

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
            withChild.settings = config.settings;
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/pipeline',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
      _classCallCheck(this, Pipeline);

      this.steps = [];
    }

    _prototypeProperties(Pipeline, null, {
      withStep: {
        value: function withStep(step) {
          var run, steps, i, l;

          if (typeof step == "function") {
            run = step;
          } else if (step.isMultiStep) {
            steps = step.getSteps();
            for (i = 0, l = steps.length; i < l; i++) {
              this.withStep(steps[i]);
            }

            return this;
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/model-binding',["exports"], function (exports) {
	

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var ApplyModelBindersStep = exports.ApplyModelBindersStep = (function () {
		function ApplyModelBindersStep() {
			_classCallCheck(this, ApplyModelBindersStep);
		}

		_prototypeProperties(ApplyModelBindersStep, null, {
			run: {
				value: function run(navigationContext, next) {
					//look at each channel and determine if there's a custom binder to be used
					//to transform any of the lifecycleArgs

					//this needs to be done at each level...
					//chache across levels to avoid multiple loads of data, etc.

					return next();
				},
				writable: true,
				configurable: true
			}
		});

		return ApplyModelBindersStep;
	})();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
});
define('aurelia-router/route-loading',["exports", "./navigation-plan"], function (exports, _navigationPlan) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.loadNewRoute = loadNewRoute;
  var REPLACE = _navigationPlan.REPLACE;
  var buildNavigationPlan = _navigationPlan.buildNavigationPlan;

  var RouteLoader = exports.RouteLoader = (function () {
    function RouteLoader() {
      _classCallCheck(this, RouteLoader);
    }

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
      _classCallCheck(this, LoadRouteStep);

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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/activation',["exports", "./navigation-plan", "./navigation-commands", "./util"], function (exports, _navigationPlan, _navigationCommands, _util) {
  

  var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var INVOKE_LIFECYCLE = _navigationPlan.INVOKE_LIFECYCLE;
  var REPLACE = _navigationPlan.REPLACE;
  var isNavigationCommand = _navigationCommands.isNavigationCommand;
  var processPotential = _util.processPotential;
  var affirmations = exports.affirmations = ["yes", "ok", "true"];

  var CanDeactivatePreviousStep = exports.CanDeactivatePreviousStep = (function () {
    function CanDeactivatePreviousStep() {
      _classCallCheck(this, CanDeactivatePreviousStep);
    }

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
    function CanActivateNextStep() {
      _classCallCheck(this, CanActivateNextStep);
    }

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
    function DeactivatePreviousStep() {
      _classCallCheck(this, DeactivatePreviousStep);
    }

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
    function ActivateNextStep() {
      _classCallCheck(this, ActivateNextStep);
    }

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
        i = infos.length; //query from inside out

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
        i = -1; //query from top down

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
          var result = (_current$controller = current.controller)[callbackName].apply(_current$controller, _toConsumableArray(current.lifecycleArgs));
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/pipeline-provider',["exports", "aurelia-dependency-injection", "./pipeline", "./navigation-plan", "./model-binding", "./route-loading", "./navigation-context", "./activation", "./route-filters"], function (exports, _aureliaDependencyInjection, _pipeline, _navigationPlan, _modelBinding, _routeLoading, _navigationContext, _activation, _routeFilters) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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
  var createRouteFilterStep = _routeFilters.createRouteFilterStep;

  var PipelineProvider = exports.PipelineProvider = (function () {
    function PipelineProvider(container) {
      _classCallCheck(this, PipelineProvider);

      this.container = container;
      this.steps = [BuildNavigationPlanStep, CanDeactivatePreviousStep, //optional
      LoadRouteStep, createRouteFilterStep("authorize"), createRouteFilterStep("modelbind"), CanActivateNextStep, //optional
      //NOTE: app state changes start below - point of no return
      DeactivatePreviousStep, //optional
      ActivateNextStep, //optional
      createRouteFilterStep("precommit"), CommitChangesStep];
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

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/app-router',["exports", "aurelia-dependency-injection", "aurelia-history", "./router", "./pipeline-provider", "./navigation-commands", "aurelia-event-aggregator"], function (exports, _aureliaDependencyInjection, _aureliaHistory, _router, _pipelineProvider, _navigationCommands, _aureliaEventAggregator) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Container = _aureliaDependencyInjection.Container;
  var History = _aureliaHistory.History;
  var Router = _router.Router;
  var PipelineProvider = _pipelineProvider.PipelineProvider;
  var isNavigationCommand = _navigationCommands.isNavigationCommand;
  var EventAggregator = _aureliaEventAggregator.EventAggregator;

  var AppRouter = exports.AppRouter = (function (Router) {
    function AppRouter(container, history, pipelineProvider, events) {
      _classCallCheck(this, AppRouter);

      _get(Object.getPrototypeOf(AppRouter.prototype), "constructor", this).call(this, container, history);
      this.pipelineProvider = pipelineProvider;
      document.addEventListener("click", handleLinkClick.bind(this), true);
      this.events = events;
    }

    _inherits(AppRouter, Router);

    _prototypeProperties(AppRouter, {
      inject: {
        value: function inject() {
          return [Container, History, PipelineProvider, EventAggregator];
        },
        writable: true,
        configurable: true
      }
    }, {
      isRoot: {
        get: function () {
          return true;
        },
        configurable: true
      },
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
          this.events.publish("router:navigation:processing", instruction);

          var context = this.createNavigationContext(instruction);
          var pipeline = this.pipelineProvider.createPipeline(context);

          pipeline.run(context).then(function (result) {
            _this.isNavigating = false;

            if (result.completed) {
              _this.history.previousFragment = instruction.fragment;
            }

            if (result.output instanceof Error) {
              console.error(result.output);
              _this.events.publish("router:navigation:error", { instruction: instruction, result: result });
            }

            if (isNavigationCommand(result.output)) {
              result.output.navigate(_this);
            } else if (!result.completed) {
              _this.navigate(_this.history.previousFragment || "", false);
              _this.events.publish("router:navigation:cancelled", instruction);
            }

            instruction.resolve(result);
            _this.dequeueInstruction();
          }).then(function (result) {
            return _this.events.publish("router:navigation:complete", instruction);
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

  function findAnchor(el) {
    while (el) {
      if (el.tagName === "A") {
        return el;
      }el = el.parentNode;
    }
  }

  function handleLinkClick(evt) {
    if (!this.isActive) {
      return;
    }

    var target = findAnchor(evt.target);
    if (!target) {
      return;
    }

    if (this.history._hasPushState) {
      if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
        var href = target.getAttribute("href");

        // Ensure the protocol is not part of URL, meaning its relative.
        // Stop the event bubbling to ensure the link will not cause a page refresh.
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router/index',["exports", "./router", "./app-router", "./pipeline-provider", "./navigation-commands", "./route-loading", "./router-configuration", "./navigation-plan", "./route-filters"], function (exports, _router, _appRouter, _pipelineProvider, _navigationCommands, _routeLoading, _routerConfiguration, _navigationPlan, _routeFilters) {
  

  exports.Router = _router.Router;
  exports.AppRouter = _appRouter.AppRouter;
  exports.PipelineProvider = _pipelineProvider.PipelineProvider;
  exports.Redirect = _navigationCommands.Redirect;
  exports.RouteLoader = _routeLoading.RouteLoader;
  exports.RouterConfiguration = _routerConfiguration.RouterConfiguration;
  exports.NO_CHANGE = _navigationPlan.NO_CHANGE;
  exports.INVOKE_LIFECYCLE = _navigationPlan.INVOKE_LIFECYCLE;
  exports.REPLACE = _navigationPlan.REPLACE;
  exports.RouteFilterContainer = _routeFilters.RouteFilterContainer;
  exports.createRouteFilterStep = _routeFilters.createRouteFilterStep;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-router', ['aurelia-router/index'], function (main) { return main; });

define('aurelia-templating-binding/syntax-interpreter',["exports", "aurelia-binding"], function (exports, _aureliaBinding) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

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

  var SyntaxInterpreter = exports.SyntaxInterpreter = (function () {
    function SyntaxInterpreter(parser, observerLocator, eventManager) {
      _classCallCheck(this, SyntaxInterpreter);

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
        configurable: true
      },
      bind: {
        value: function bind(resources, element, info, existingInstruction) {
          var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

          instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), info.defaultBindingMode || this.determineDefaultBindingMode(element, info.attrName), resources.valueConverterLookupFunction);

          return instruction;
        },
        writable: true,
        configurable: true
      },
      trigger: {
        value: function trigger(resources, element, info) {
          return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), false, true);
        },
        writable: true,
        configurable: true
      },
      delegate: {
        value: function delegate(resources, element, info) {
          return new ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), true, true);
        },
        writable: true,
        configurable: true
      },
      call: {
        value: function call(resources, element, info, existingInstruction) {
          var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

          instruction.attributes[info.attrName] = new CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.valueConverterLookupFunction);

          return instruction;
        },
        writable: true,
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
        configurable: true
      }
    });

    return SyntaxInterpreter;
  })();

  SyntaxInterpreter.prototype["for"] = function (resources, element, info, existingInstruction) {
    var parts = info.attrValue.split(" of ");

    if (parts.length !== 2) {
      throw new Error("Incorrect syntax for \"for\". The form is: \"$local of $items\".");
    }

    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    if (parts[0].match(/[[].+[,]\s.+[\]]/)) {
      var firstPart = parts[0];
      parts[0] = firstPart.substr(1, firstPart.indexOf(",") - 1);
      parts.splice(1, 0, firstPart.substring(firstPart.indexOf(", ") + 2, firstPart.length - 1));
      instruction.attributes.key = parts[0];
      instruction.attributes.value = parts[1];
    } else {
      instruction.attributes.local = parts[0];
    }

    instruction.attributes[info.attrName] = new BindingExpression(this.observerLocator, info.attrName, this.parser.parse(parts[parts.length - 1]), ONE_WAY, resources.valueConverterLookupFunction);

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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-binding/binding-language',["exports", "aurelia-templating", "aurelia-binding", "./syntax-interpreter"], function (exports, _aureliaTemplating, _aureliaBinding, _syntaxInterpreter) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var Parser = _aureliaBinding.Parser;
  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var BindingExpression = _aureliaBinding.BindingExpression;
  var NameExpression = _aureliaBinding.NameExpression;
  var ONE_WAY = _aureliaBinding.ONE_WAY;
  var SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;

  var info = {};

  var TemplatingBindingLanguage = exports.TemplatingBindingLanguage = (function (BindingLanguage) {
    function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter) {
      _classCallCheck(this, TemplatingBindingLanguage);

      this.parser = parser;
      this.observerLocator = observerLocator;
      this.syntaxInterpreter = syntaxInterpreter;
      this.emptyStringExpression = this.parser.parse("''");
      syntaxInterpreter.language = this;
      this.attributeMap = syntaxInterpreter.attributeMap = {
        "class": "className",
        "for": "htmlFor",
        tabindex: "tabIndex",
        // HTMLInputElement https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
        maxlength: "maxLength",
        minlength: "minLength",
        formaction: "formAction",
        formenctype: "formEncType",
        formmethod: "formMethod",
        formnovalidate: "formNoValidate",
        formtarget: "formTarget" };
    }

    _inherits(TemplatingBindingLanguage, BindingLanguage);

    _prototypeProperties(TemplatingBindingLanguage, {
      inject: {
        value: function inject() {
          return [Parser, ObserverLocator, SyntaxInterpreter];
        },
        writable: true,
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
        configurable: true
      },
      parseText: {
        value: function parseText(resources, value) {
          return this.parseContent(resources, "textContent", value);
        },
        writable: true,
        configurable: true
      },
      parseContent: {
        value: function parseContent(resources, attrName, attrValue) {
          var i = attrValue.indexOf("${", 0),
              ii = attrValue.length,
              char,
              pos = 0,
              open = 0,
              quote = null,
              interpolationStart,
              parts,
              partIndex = 0;
          while (i >= 0 && i < ii - 2) {
            open = 1;
            interpolationStart = i;
            i += 2;

            do {
              char = attrValue[i];
              i++;
              switch (char) {
                case "'":
                case "\"":
                  if (quote === null) {
                    quote = char;
                  } else if (quote === char) {
                    quote = null;
                  }
                  continue;
                case "\\":
                  i++;
                  continue;
              }

              if (quote !== null) {
                continue;
              }

              if (char === "{") {
                open++;
              } else if (char === "}") {
                open--;
              }
            } while (open > 0 && i < ii);

            if (open === 0) {
              // lazy allocate array
              parts = parts || [];
              if (attrValue[interpolationStart - 1] === "\\" && attrValue[interpolationStart - 2] !== "\\") {
                // escaped interpolation
                parts[partIndex] = attrValue.substring(pos, interpolationStart - 1) + attrValue.substring(interpolationStart, i);
                partIndex++;
                parts[partIndex] = this.emptyStringExpression;
                partIndex++;
              } else {
                // standard interpolation
                parts[partIndex] = attrValue.substring(pos, interpolationStart);
                partIndex++;
                parts[partIndex] = this.parser.parse(attrValue.substring(interpolationStart + 2, i - 1));
                partIndex++;
              }
              pos = i;
              i = attrValue.indexOf("${", i);
            } else {
              break;
            }
          }

          // no interpolation.
          if (partIndex === 0) {
            return null;
          }

          // literal.
          parts[partIndex] = attrValue.substr(pos);

          return new InterpolationBindingExpression(this.observerLocator, this.attributeMap[attrName] || attrName, parts, ONE_WAY, resources.valueConverterLookupFunction, attrName);
        },
        writable: true,
        configurable: true
      }
    });

    return TemplatingBindingLanguage;
  })(BindingLanguage);

  var InterpolationBindingExpression = exports.InterpolationBindingExpression = (function () {
    function InterpolationBindingExpression(observerLocator, targetProperty, parts, mode, valueConverterLookupFunction, attribute) {
      _classCallCheck(this, InterpolationBindingExpression);

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
        configurable: true
      }
    });

    return InterpolationBindingExpression;
  })();

  var InterpolationBinding = (function () {
    function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, valueConverterLookupFunction) {
      _classCallCheck(this, InterpolationBinding);

      if (target.parentElement && target.parentElement.nodeName === "TEXTAREA" && targetProperty === "textContent") {
        throw new Error("Interpolation binding cannot be used in the content of a textarea element.  Use \"<textarea value.bind=\"expression\"></textarea>\"\" instead");
      }
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
        configurable: true
      },
      setValue: {
        value: function setValue() {
          var value = this.interpolate();
          this.targetProperty.setValue(value);
        },
        writable: true,
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
        configurable: true
      }
    });

    return InterpolationBinding;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});

//do nothing;
define('aurelia-templating-binding/index',["exports", "aurelia-templating", "./binding-language", "./syntax-interpreter"], function (exports, _aureliaTemplating, _bindingLanguage, _syntaxInterpreter) {
  

  var BindingLanguage = _aureliaTemplating.BindingLanguage;
  var TemplatingBindingLanguage = _bindingLanguage.TemplatingBindingLanguage;
  var SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;

  function install(aurelia) {
    var instance,
        getInstance = function getInstance(c) {
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-binding', ['aurelia-templating-binding/index'], function (main) { return main; });

define('aurelia-templating-resources/compose',["exports", "aurelia-dependency-injection", "aurelia-templating"], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Container = _aureliaDependencyInjection.Container;
  var Behavior = _aureliaTemplating.Behavior;
  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ViewResources = _aureliaTemplating.ViewResources;

  var Compose = exports.Compose = (function () {
    function Compose(container, compositionEngine, viewSlot, viewResources) {
      _classCallCheck(this, Compose);

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
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Container, CompositionEngine, ViewSlot, ViewResources];
        },
        writable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind(executionContext) {
          this.executionContext = executionContext;
          processInstruction(this, { view: this.view, viewModel: this.viewModel, model: this.model });
        },
        writable: true,
        configurable: true
      },
      modelChanged: {
        value: function modelChanged(newValue, oldValue) {
          if (this.viewModel && typeof this.viewModel.activate === "function") {
            this.viewModel.activate(newValue);
          }
        },
        writable: true,
        configurable: true
      },
      viewChanged: {
        value: function viewChanged(newValue, oldValue) {
          processInstruction(this, { view: newValue, viewModel: this.viewModel, model: this.model });
        },
        writable: true,
        configurable: true
      },
      viewModelChanged: {
        value: function viewModelChanged(newValue, oldValue) {
          processInstruction(this, { viewModel: newValue, view: this.view, model: this.model });
        },
        writable: true,
        configurable: true
      }
    });

    return Compose;
  })();

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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/if',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Behavior = _aureliaTemplating.Behavior;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;

  var If = exports.If = (function () {
    function If(viewFactory, viewSlot) {
      _classCallCheck(this, If);

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
        configurable: true
      },
      inject: {
        value: function inject() {
          return [BoundViewFactory, ViewSlot];
        },
        writable: true,
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
        configurable: true
      }
    });

    return If;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/with',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Behavior = _aureliaTemplating.Behavior;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;

  var With = exports.With = (function () {
    function With(viewFactory, viewSlot) {
      _classCallCheck(this, With);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
    }

    _prototypeProperties(With, {
      metadata: {
        value: function metadata() {
          return Behavior.templateController("with").withProperty("value", "valueChanged", "with");
        },
        writable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [BoundViewFactory, ViewSlot];
        },
        writable: true,
        configurable: true
      }
    }, {
      valueChanged: {
        value: function valueChanged(newValue) {
          if (!this.view) {
            this.view = this.viewFactory.create(newValue);
            this.viewSlot.add(this.view);
          } else {
            this.view.bind(newValue);
          }
        },
        writable: true,
        configurable: true
      }
    });

    return With;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/repeat',["exports", "aurelia-binding", "aurelia-templating"], function (exports, _aureliaBinding, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var ObserverLocator = _aureliaBinding.ObserverLocator;
  var calcSplices = _aureliaBinding.calcSplices;
  var getChangeRecords = _aureliaBinding.getChangeRecords;
  var Behavior = _aureliaTemplating.Behavior;
  var BoundViewFactory = _aureliaTemplating.BoundViewFactory;
  var ViewSlot = _aureliaTemplating.ViewSlot;

  var Repeat = exports.Repeat = (function () {
    function Repeat(viewFactory, viewSlot, observerLocator) {
      _classCallCheck(this, Repeat);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.observerLocator = observerLocator;
      this.local = "item";
      this.key = "key";
      this.value = "value";
    }

    _prototypeProperties(Repeat, {
      metadata: {
        value: function metadata() {
          return Behavior.templateController("repeat").withProperty("items", "itemsChanged", "repeat").withProperty("local").withProperty("key").withProperty("value");
        },
        writable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [BoundViewFactory, ViewSlot, ObserverLocator];
        },
        writable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind(executionContext) {
          var _this = this;

          var items = this.items;

          this.executionContext = executionContext;

          if (!items) {
            if (this.oldItems) {
              this.viewSlot.removeAll();
            }

            return;
          }

          if (this.oldItems === items) {
            if (items instanceof Map) {
              var records = getChangeRecords(items);
              var observer = this.observerLocator.getMapObserver(items);

              this.handleMapChangeRecords(items, records);

              this.disposeSubscription = observer.subscribe(function (records) {
                _this.handleMapChangeRecords(items, records);
              });
            } else {
              var splices = calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
              var observer = this.observerLocator.getArrayObserver(items);

              this.handleSplices(items, splices);
              this.lastBoundItems = this.oldItems = null;

              this.disposeSubscription = observer.subscribe(function (splices) {
                _this.handleSplices(items, splices);
              });
            }
          } else {
            this.processItems();
          }
        },
        writable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.oldItems = this.items;

          if (this.items instanceof Array) {
            this.lastBoundItems = this.items.slice(0);
          }

          if (this.disposeSubscription) {
            this.disposeSubscription();
            this.disposeSubscription = null;
          }
        },
        writable: true,
        configurable: true
      },
      itemsChanged: {
        value: function itemsChanged() {
          this.processItems();
        },
        writable: true,
        configurable: true
      },
      processItems: {
        value: function processItems() {
          var items = this.items,
              viewSlot = this.viewSlot;

          if (this.disposeSubscription) {
            this.disposeSubscription();
            viewSlot.removeAll();
          }

          if (!items) {
            return;
          }

          if (items instanceof Map) {
            this.processMapEntries(items);
          } else {
            this.processArrayItems(items);
          }
        },
        writable: true,
        configurable: true
      },
      processArrayItems: {
        value: function processArrayItems(items) {
          var _this = this;

          var viewFactory = this.viewFactory,
              viewSlot = this.viewSlot,
              i,
              ii,
              row,
              view,
              observer;

          observer = this.observerLocator.getArrayObserver(items);

          for (i = 0, ii = items.length; i < ii; ++i) {
            row = this.createFullExecutionContext(items[i], i, ii);
            view = viewFactory.create(row);
            viewSlot.add(view);
          }

          this.disposeSubscription = observer.subscribe(function (splices) {
            _this.handleSplices(items, splices);
          });
        },
        writable: true,
        configurable: true
      },
      processMapEntries: {
        value: function processMapEntries(items) {
          var _this = this;

          var viewFactory = this.viewFactory,
              viewSlot = this.viewSlot,
              index = 0,
              row,
              view,
              observer;

          observer = this.observerLocator.getMapObserver(items);

          items.forEach(function (value, key) {
            row = _this.createFullExecutionKvpContext(key, value, index, items.size);
            view = viewFactory.create(row);
            viewSlot.add(view);
            ++index;
          });

          this.disposeSubscription = observer.subscribe(function (record) {
            _this.handleMapChangeRecords(items, record);
          });
        },
        writable: true,
        configurable: true
      },
      createBaseExecutionContext: {
        value: function createBaseExecutionContext(data) {
          var context = {};
          context[this.local] = data;
          return context;
        },
        writable: true,
        configurable: true
      },
      createBaseExecutionKvpContext: {
        value: function createBaseExecutionKvpContext(key, value) {
          var context = {};
          context[this.key] = key;
          context[this.value] = value;
          return context;
        },
        writable: true,
        configurable: true
      },
      createFullExecutionContext: {
        value: function createFullExecutionContext(data, index, length) {
          var context = this.createBaseExecutionContext(data);
          return this.updateExecutionContext(context, index, length);
        },
        writable: true,
        configurable: true
      },
      createFullExecutionKvpContext: {
        value: function createFullExecutionKvpContext(key, value, index, length) {
          var context = this.createBaseExecutionKvpContext(key, value);
          return this.updateExecutionContext(context, index, length);
        },
        writable: true,
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

          //TODO: track which views are moved instead of removed better
          //TODO: only update context after highest changed index

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
                viewSlot.insert(addIndex, view); //TODO: move
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
        configurable: true
      },
      handleMapChangeRecords: {
        value: function handleMapChangeRecords(map, records) {
          var viewSlot = this.viewSlot,
              key,
              i,
              ii,
              view,
              children,
              length,
              row,
              removeIndex,
              record;

          for (i = 0, ii = records.length; i < ii; ++i) {
            record = records[i];
            key = record.key;
            switch (record.type) {
              case "update":
                removeIndex = this.getViewIndexByKey(key);
                viewSlot.removeAt(removeIndex);
                row = this.createBaseExecutionKvpContext(key, map.get(key));
                view = this.viewFactory.create(row);
                viewSlot.insert(removeIndex, view);
                break;
              case "add":
                row = this.createBaseExecutionKvpContext(key, map.get(key));
                view = this.viewFactory.create(row);
                viewSlot.insert(map.size, view);
                break;
              case "delete":
                if (!record.oldValue) {
                  return;
                }
                removeIndex = this.getViewIndexByKey(key);
                viewSlot.removeAt(removeIndex);
                break;
              case "clear":
                viewSlot.removeAll();
            }
          }

          children = viewSlot.children;
          length = children.length;

          for (i = 0; i < length; i++) {
            this.updateExecutionContext(children[i].executionContext, i, length);
          }
        },
        writable: true,
        configurable: true
      },
      getViewIndexByKey: {
        value: function getViewIndexByKey(key) {
          var viewSlot = this.viewSlot,
              i,
              ii,
              child;

          for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
            // TODO (martingust) better way to get index?
            child = viewSlot.children[i];
            if (child.bindings[0].source[this.key] === key) {
              return i;
            }
          }
        },
        writable: true,
        configurable: true
      }
    });

    return Repeat;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/show',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Behavior = _aureliaTemplating.Behavior;

  function addStyleString(str) {
    var node = document.createElement("style");
    node.innerHTML = str;
    node.type = "text/css";
    document.head.appendChild(node);
  }

  addStyleString(".aurelia-hide { display:none !important; }");

  var Show = exports.Show = (function () {
    function Show(element) {
      _classCallCheck(this, Show);

      this.element = element;
    }

    _prototypeProperties(Show, {
      metadata: {
        value: function metadata() {
          return Behavior.attachedBehavior("show").withProperty("value", "valueChanged", "show");
        },
        writable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
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
        configurable: true
      }
    });

    return Show;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/selected-item',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Behavior = _aureliaTemplating.Behavior;

  var SelectedItem = exports.SelectedItem = (function () {
    function SelectedItem(element) {
      _classCallCheck(this, SelectedItem);

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
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind() {
          this.element.addEventListener("change", this.callback, false);
        },
        writable: true,
        configurable: true
      },
      unbind: {
        value: function unbind() {
          this.element.removeEventListener("change", this.callback);
        },
        writable: true,
        configurable: true
      },
      valueChanged: {
        value: function valueChanged(newValue) {
          this.optionsChanged();
        },
        writable: true,
        configurable: true
      },
      selectedIndexChanged: {
        value: function selectedIndexChanged() {
          var index = this.element.selectedIndex,
              option = this.options[index];

          this.value = option ? option.model : null;
        },
        writable: true,
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
        configurable: true
      }
    });

    return SelectedItem;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/global-behavior',["exports", "aurelia-templating", "aurelia-logging"], function (exports, _aureliaTemplating, _aureliaLogging) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Behavior = _aureliaTemplating.Behavior;
  var LogManager = _aureliaLogging;

  var GlobalBehavior = exports.GlobalBehavior = (function () {
    function GlobalBehavior(element) {
      _classCallCheck(this, GlobalBehavior);

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
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
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
        configurable: true
      },
      attached: {
        value: function attached() {
          if (this.handler && "attached" in this.handler) {
            this.handler.attached(this, this.element);
          }
        },
        writable: true,
        configurable: true
      },
      detached: {
        value: function detached() {
          if (this.handler && "detached" in this.handler) {
            this.handler.detached(this, this.element);
          }
        },
        writable: true,
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
        configurable: true
      }
    });

    return GlobalBehavior;
  })();

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
        var jqueryElement = window.jQuery(element);

        if (!jqueryElement[pluginName]) {
          LogManager.getLogger("templating-resources").warn("Could not find the jQuery plugin " + pluginName + ", possibly due to case mismatch. Trying to enumerate jQuery methods in lowercase. Add the correctly cased plugin name to the GlobalBehavior to avoid this performance hit.");

          for (var prop in jqueryElement) {
            if (prop.toLowerCase() === pluginName) {
              pluginName = prop;
            }
          }
        }

        behavior.plugin = jqueryElement[pluginName](settings);
      },
      unbind: function unbind(behavior, element) {
        if (typeof behavior.plugin.destroy === "function") {
          behavior.plugin.destroy();
          behavior.plugin = null;
        }
      }
    }
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/inner-html',["exports", "aurelia-templating"], function (exports, _aureliaTemplating) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Behavior = _aureliaTemplating.Behavior;

  var InnerHTML = exports.InnerHTML = (function () {
    function InnerHTML(element) {
      _classCallCheck(this, InnerHTML);

      this.element = element;
      this.sanitizer = InnerHTML.defaultSanitizer;
    }

    _prototypeProperties(InnerHTML, {
      metadata: {
        value: function metadata() {
          return Behavior.attachedBehavior("inner-html").withOptions().and(function (x) {
            x.withProperty("value", "valueChanged");
            x.withProperty("sanitizer");
          });
        },
        writable: true,
        configurable: true
      },
      defaultSanitizer: {
        value: function defaultSanitizer(text) {
          var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

          while (SCRIPT_REGEX.test(text)) {
            text = text.replace(SCRIPT_REGEX, "");
          }

          return text;
        },
        writable: true,
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element];
        },
        writable: true,
        configurable: true
      }
    }, {
      bind: {
        value: function bind() {
          this.setElementInnerHTML(this.value);
        },
        writable: true,
        configurable: true
      },
      valueChanged: {
        value: function valueChanged(newValue) {
          this.setElementInnerHTML(newValue);
        },
        writable: true,
        configurable: true
      },
      setElementInnerHTML: {
        value: function setElementInnerHTML(text) {
          text = this.sanitizer(text);
          this.element.innerHTML = text;
        },
        writable: true,
        configurable: true
      }
    });

    return InnerHTML;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources/index',["exports", "./compose", "./if", "./with", "./repeat", "./show", "./selected-item", "./global-behavior", "./inner-html"], function (exports, _compose, _if, _with, _repeat, _show, _selectedItem, _globalBehavior, _innerHtml) {
  

  var Compose = _compose.Compose;
  var If = _if.If;
  var With = _with.With;
  var Repeat = _repeat.Repeat;
  var Show = _show.Show;
  var SelectedItem = _selectedItem.SelectedItem;
  var GlobalBehavior = _globalBehavior.GlobalBehavior;
  var InnerHTML = _innerHtml.InnerHTML;

  function install(aurelia) {
    aurelia.withResources([Show, If, With, Repeat, Compose, SelectedItem, GlobalBehavior, InnerHTML]);
  }

  exports.Compose = Compose;
  exports.If = If;
  exports.With = With;
  exports.Repeat = Repeat;
  exports.Show = Show;
  exports.InnerHTML = InnerHTML;
  exports.SelectedItem = SelectedItem;
  exports.GlobalBehavior = GlobalBehavior;
  exports.install = install;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-resources', ['aurelia-templating-resources/index'], function (main) { return main; });

define('aurelia-templating-router/route-loader',["exports", "aurelia-templating", "aurelia-router", "aurelia-path", "aurelia-metadata"], function (exports, _aureliaTemplating, _aureliaRouter, _aureliaPath, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var CompositionEngine = _aureliaTemplating.CompositionEngine;
  var RouteLoader = _aureliaRouter.RouteLoader;
  var Router = _aureliaRouter.Router;
  var relativeToFile = _aureliaPath.relativeToFile;
  var Origin = _aureliaMetadata.Origin;

  var TemplatingRouteLoader = exports.TemplatingRouteLoader = (function (RouteLoader) {
    function TemplatingRouteLoader(compositionEngine) {
      _classCallCheck(this, TemplatingRouteLoader);

      this.compositionEngine = compositionEngine;
    }

    _inherits(TemplatingRouteLoader, RouteLoader);

    _prototypeProperties(TemplatingRouteLoader, {
      inject: {
        value: function inject() {
          return [CompositionEngine];
        },
        writable: true,
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
        configurable: true
      }
    });

    return TemplatingRouteLoader;
  })(RouteLoader);

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-router/router-view',["exports", "aurelia-dependency-injection", "aurelia-templating", "aurelia-router", "aurelia-metadata"], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaMetadata) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Container = _aureliaDependencyInjection.Container;
  var ViewSlot = _aureliaTemplating.ViewSlot;
  var ViewStrategy = _aureliaTemplating.ViewStrategy;
  var Router = _aureliaRouter.Router;
  var Metadata = _aureliaMetadata.Metadata;
  var Origin = _aureliaMetadata.Origin;

  var RouterView = exports.RouterView = (function () {
    function RouterView(element, container, viewSlot, router) {
      _classCallCheck(this, RouterView);

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
        configurable: true
      },
      inject: {
        value: function inject() {
          return [Element, Container, ViewSlot, Router];
        },
        writable: true,
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
        configurable: true
      }
    });

    return RouterView;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-templating-router', ['aurelia-templating-router/index'], function (main) { return main; });

define('aurelia-http-client/headers',["exports"], function (exports) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Headers = exports.Headers = (function () {
    function Headers() {
      var headers = arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Headers);

      this.headers = headers;
    }

    _prototypeProperties(Headers, {
      parse: {

        /**
         * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
         * headers according to the format described here:
         * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
         * This method parses that string into a user-friendly key/value pair object.
         */

        value: function parse(headerStr) {
          var headers = new Headers();
          if (!headerStr) {
            return headers;
          }

          var headerPairs = headerStr.split("\r\n");
          for (var i = 0; i < headerPairs.length; i++) {
            var headerPair = headerPairs[i];
            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            var index = headerPair.indexOf(": ");
            if (index > 0) {
              var key = headerPair.substring(0, index);
              var val = headerPair.substring(index + 2);
              headers.add(key, val);
            }
          }

          return headers;
        },
        writable: true,
        configurable: true
      }
    }, {
      add: {
        value: function add(key, value) {
          this.headers[key] = value;
        },
        writable: true,
        configurable: true
      },
      get: {
        value: function get(key) {
          return this.headers[key];
        },
        writable: true,
        configurable: true
      },
      clear: {
        value: function clear() {
          this.headers = {};
        },
        writable: true,
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
        configurable: true
      }
    });

    return Headers;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/http-response-message',["exports", "./headers"], function (exports, _headers) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Headers = _headers.Headers;

  var HttpResponseMessage = exports.HttpResponseMessage = (function () {
    function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
      _classCallCheck(this, HttpResponseMessage);

      this.requestMessage = requestMessage;
      this.statusCode = xhr.status;
      this.response = xhr.response;
      this.isSuccess = xhr.status >= 200 && xhr.status < 400;
      this.statusText = xhr.statusText;
      this.responseType = responseType;
      this.reviver = reviver;

      if (xhr.getAllResponseHeaders) {
        this.headers = Headers.parse(xhr.getAllResponseHeaders());
      } else {
        this.headers = new Headers();
      }
    }

    _prototypeProperties(HttpResponseMessage, null, {
      content: {
        get: function () {
          try {
            if (this._content !== undefined) {
              return this._content;
            }

            if (this.response === undefined || this.response === null) {
              return this._content = this.response;
            }

            if (this.responseType === "json") {
              return this._content = JSON.parse(this.response, this.reviver);
            }

            if (this.reviver) {
              return this._content = this.reviver(this.response);
            }

            return this._content = this.response;
          } catch (e) {
            if (this.isSuccess) {
              throw e;
            }

            return this._content = null;
          }
        },
        configurable: true
      }
    });

    return HttpResponseMessage;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/request-message-processor',["exports", "./http-response-message", "aurelia-path"], function (exports, _httpResponseMessage, _aureliaPath) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  var join = _aureliaPath.join;
  var buildQueryString = _aureliaPath.buildQueryString;

  function buildFullUri(message) {
    var uri = join(message.baseUrl, message.uri),
        qs;

    if (message.params) {
      qs = buildQueryString(message.params);
      uri = qs ? "" + uri + "?" + qs : uri;
    }

    message.fullUri = uri;
  }

  var RequestMessageProcessor = exports.RequestMessageProcessor = (function () {
    function RequestMessageProcessor(xhrType, transformers) {
      _classCallCheck(this, RequestMessageProcessor);

      this.XHRType = xhrType;
      this.transformers = transformers;
    }

    _prototypeProperties(RequestMessageProcessor, null, {
      abort: {
        value: function abort() {
          //The logic here is if the xhr object is not set then there is nothing to abort so the intent was carried out
          if (this.xhr) {
            this.xhr.abort();
          }
        },
        writable: true,
        configurable: true
      },
      process: {
        value: function process(client, message) {
          var _this = this;

          return new Promise(function (resolve, reject) {
            var xhr = _this.xhr = new _this.XHRType(),
                transformers = _this.transformers,
                i,
                ii;

            buildFullUri(message);
            xhr.open(message.method, message.fullUri, true);

            for (i = 0, ii = transformers.length; i < ii; ++i) {
              transformers[i](client, _this, message, xhr);
            }

            xhr.onload = function (e) {
              var response = new HttpResponseMessage(message, xhr, message.responseType, message.reviver);
              if (response.isSuccess) {
                resolve(response);
              } else {
                reject(response);
              }
            };

            xhr.ontimeout = function (e) {
              reject(new HttpResponseMessage(message, {
                response: e,
                status: xhr.status,
                statusText: xhr.statusText
              }, "timeout"));
            };

            xhr.onerror = function (e) {
              reject(new HttpResponseMessage(message, {
                response: e,
                status: xhr.status,
                statusText: xhr.statusText
              }, "error"));
            };

            xhr.onabort = function (e) {
              reject(new HttpResponseMessage(message, {
                response: e,
                status: xhr.status,
                statusText: xhr.statusText
              }, "abort"));
            };

            xhr.send(message.content);
          });
        },
        writable: true,
        configurable: true
      }
    });

    return RequestMessageProcessor;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/transformers',["exports"], function (exports) {
  

  exports.timeoutTransformer = timeoutTransformer;
  exports.callbackParameterNameTransformer = callbackParameterNameTransformer;
  exports.credentialsTransformer = credentialsTransformer;
  exports.progressTransformer = progressTransformer;
  exports.responseTypeTransformer = responseTypeTransformer;
  exports.headerTransformer = headerTransformer;
  exports.contentTransformer = contentTransformer;

  function timeoutTransformer(client, processor, message, xhr) {
    if (message.timeout !== undefined) {
      xhr.timeout = message.timeout;
    }
  }

  function callbackParameterNameTransformer(client, processor, message, xhr) {
    if (message.callbackParameterName !== undefined) {
      xhr.callbackParameterName = message.callbackParameterName;
    }
  }

  function credentialsTransformer(client, processor, message, xhr) {
    if (message.withCredentials !== undefined) {
      xhr.withCredentials = message.withCredentials;
    }
  }

  function progressTransformer(client, processor, message, xhr) {
    if (message.progressCallback) {
      xhr.upload.onprogress = message.progressCallback;
    }
  }

  function responseTypeTransformer(client, processor, message, xhr) {
    var responseType = message.responseType;

    if (responseType === "json") {
      responseType = "text"; //IE does not support json
    }

    xhr.responseType = responseType;
  }

  function headerTransformer(client, processor, message, xhr) {
    message.headers.configureXHR(xhr);
  }

  function contentTransformer(client, processor, message, xhr) {
    if (window.FormData && message.content instanceof FormData) {
      return;
    }

    if (window.Blob && message.content instanceof Blob) {
      return;
    }

    if (window.ArrayBufferView && message.content instanceof ArrayBufferView) {
      return;
    }

    if (message.content instanceof Document) {
      return;
    }

    if (typeof message.content === "string") {
      return;
    }

    if (message.content === null || message.content === undefined) {
      return;
    }

    message.content = JSON.stringify(message.content, message.replacer);
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/http-request-message',["exports", "./headers", "./request-message-processor", "./transformers"], function (exports, _headers, _requestMessageProcessor, _transformers) {
  

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;
  var Headers = _headers.Headers;
  var RequestMessageProcessor = _requestMessageProcessor.RequestMessageProcessor;
  var timeoutTransformer = _transformers.timeoutTransformer;
  var credentialsTransformer = _transformers.credentialsTransformer;
  var progressTransformer = _transformers.progressTransformer;
  var responseTypeTransformer = _transformers.responseTypeTransformer;
  var headerTransformer = _transformers.headerTransformer;
  var contentTransformer = _transformers.contentTransformer;

  var HttpRequestMessage = exports.HttpRequestMessage = function HttpRequestMessage(method, uri, content, headers) {
    _classCallCheck(this, HttpRequestMessage);

    this.method = method;
    this.uri = uri;
    this.content = content;
    this.headers = headers || new Headers();
    this.responseType = "json"; //text, arraybuffer, blob, document
  };

  function createHttpRequestMessageProcessor() {
    return new RequestMessageProcessor(XMLHttpRequest, [timeoutTransformer, credentialsTransformer, progressTransformer, responseTypeTransformer, headerTransformer, contentTransformer]);
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/jsonp-request-message',["exports", "./headers", "./request-message-processor", "./transformers"], function (exports, _headers, _requestMessageProcessor, _transformers) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;
  var Headers = _headers.Headers;
  var RequestMessageProcessor = _requestMessageProcessor.RequestMessageProcessor;
  var timeoutTransformer = _transformers.timeoutTransformer;
  var callbackParameterNameTransformer = _transformers.callbackParameterNameTransformer;

  var JSONPRequestMessage = exports.JSONPRequestMessage = function JSONPRequestMessage(uri, callbackParameterName) {
    _classCallCheck(this, JSONPRequestMessage);

    this.method = "JSONP";
    this.uri = uri;
    this.content = undefined;
    this.headers = new Headers();
    this.responseType = "jsonp";
    this.callbackParameterName = callbackParameterName;
  };

  var JSONPXHR = (function () {
    function JSONPXHR() {
      _classCallCheck(this, JSONPXHR);
    }

    _prototypeProperties(JSONPXHR, null, {
      open: {
        value: function open(method, uri) {
          this.method = method;
          this.uri = uri;
          this.callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
        },
        writable: true,
        configurable: true
      },
      send: {
        value: function send() {
          var _this = this;

          var uri = this.uri + (this.uri.indexOf("?") >= 0 ? "&" : "?") + this.callbackParameterName + "=" + this.callbackName;

          window[this.callbackName] = function (data) {
            delete window[_this.callbackName];
            document.body.removeChild(script);

            if (_this.status === undefined) {
              _this.status = 200;
              _this.statusText = "OK";
              _this.response = data;
              _this.onload(_this);
            }
          };

          var script = document.createElement("script");
          script.src = uri;
          document.body.appendChild(script);

          if (this.timeout !== undefined) {
            setTimeout(function () {
              if (_this.status === undefined) {
                _this.status = 0;
                _this.ontimeout(new Error("timeout"));
              }
            }, this.timeout);
          }
        },
        writable: true,
        configurable: true
      },
      abort: {
        value: function abort() {
          if (this.status === undefined) {
            this.status = 0;
            this.onabort(new Error("abort"));
          }
        },
        writable: true,
        configurable: true
      },
      setRequestHeader: {
        value: function setRequestHeader() {},
        writable: true,
        configurable: true
      }
    });

    return JSONPXHR;
  })();

  function createJSONPRequestMessageProcessor() {
    return new RequestMessageProcessor(JSONPXHR, [timeoutTransformer, callbackParameterNameTransformer]);
  }

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/request-builder',["exports", "aurelia-path", "./http-request-message", "./jsonp-request-message"], function (exports, _aureliaPath, _httpRequestMessage, _jsonpRequestMessage) {
	

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var join = _aureliaPath.join;
	var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
	var JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;

	/**
 * A builder class allowing fluent composition of HTTP requests.
 *
 * @class RequestBuilder
 * @constructor
 */

	var RequestBuilder = exports.RequestBuilder = (function () {
		function RequestBuilder(client) {
			_classCallCheck(this, RequestBuilder);

			this.client = client;
			this.transformers = client.requestTransformers.slice(0);
		}

		_prototypeProperties(RequestBuilder, {
			addHelper: {

				/**
    * Adds a user-defined request transformer to the RequestBuilder.
    *
    * @method addHelper
    * @param {String} name The name of the helper to add.
    * @param {Function} fn The helper function.
    * @chainable
    */

				value: function addHelper(name, fn) {
					RequestBuilder.prototype[name] = function () {
						this.transformers.push(fn.apply(this, arguments));
						return this;
					};
				},
				writable: true,
				configurable: true
			}
		}, {
			"delete": {

				/**
    * Sends an HTTP DELETE request.
    *
    * @method delete
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */

				value: function _delete(uri) {
					var message = new HttpRequestMessage("DELETE", uri);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			get: {

				/**
    * Sends an HTTP GET request.
    *
    * @method get
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */

				value: function get(uri) {
					var message = new HttpRequestMessage("GET", uri);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			head: {

				/**
    * Sends an HTTP HEAD request.
    *
    * @method head
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */

				value: function head(uri) {
					var message = new HttpRequestMessage("HEAD", uri);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			jsonp: {

				/**
    * Sends a JSONP request.
    *
    * @method jsonp
    * @param {String} uri The target URI.
    * @param {String} [callbackParameterName=jsoncallback] The target Javascript expression to invoke.
    * @return {Promise} A cancellable promise object.
    */

				value: function jsonp(uri) {
					var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];

					var message = new JSONPRequestMessage(uri, callbackParameterName);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			options: {

				/**
    * Sends an HTTP OPTIONS request.
    *
    * @method options
    * @param {String} uri The target URI.
    * @return {Promise} A cancellable promise object.
    */

				value: function options(uri) {
					var message = new HttpRequestMessage("OPTIONS", uri);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			put: {

				/**
    * Sends an HTTP PUT request.
    *
    * @method put
    * @param {String} uri The target URI.
    * @param {Object} uri The request payload.
    * @return {Promise} A cancellable promise object.
    */

				value: function put(uri, content) {
					var message = new HttpRequestMessage("PUT", uri, content);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			patch: {

				/**
    * Sends an HTTP PATCH request.
    *
    * @method patch
    * @param {String} uri The target URI.
    * @param {Object} uri The request payload.
    * @return {Promise} A cancellable promise object.
    */

				value: function patch(uri, content) {
					var message = new HttpRequestMessage("PATCH", uri, content);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			},
			post: {

				/**
    * Sends an HTTP POST request.
    *
    * @method post
    * @param {String} uri The target URI.
    * @param {Object} uri The request payload.
    * @return {Promise} A cancellable promise object.
    */

				value: function post(uri, content) {
					var message = new HttpRequestMessage("POST", uri, content);
					return this.client.send(message, this.transformers);
				},
				writable: true,
				configurable: true
			}
		});

		return RequestBuilder;
	})();

	RequestBuilder.addHelper("withBaseUrl", function (baseUrl) {
		return function (client, processor, message) {
			message.baseUrl = baseUrl;
		};
	});

	RequestBuilder.addHelper("withParams", function (params) {
		return function (client, processor, message) {
			message.params = params;
		};
	});

	RequestBuilder.addHelper("withResponseType", function (responseType) {
		return function (client, processor, message) {
			message.responseType = responseType;
		};
	});

	RequestBuilder.addHelper("withTimeout", function (timeout) {
		return function (client, processor, message) {
			message.timeout = timeout;
		};
	});

	RequestBuilder.addHelper("withHeader", function (key, value) {
		return function (client, processor, message) {
			message.headers.add(key, value);
		};
	});

	RequestBuilder.addHelper("withCredentials", function (value) {
		return function (client, processor, message) {
			message.withCredentials = value;
		};
	});

	RequestBuilder.addHelper("withReviver", function (reviver) {
		return function (client, processor, message) {
			message.reviver = reviver;
		};
	});

	RequestBuilder.addHelper("withReplacer", function (replacer) {
		return function (client, processor, message) {
			message.replacer = replacer;
		};
	});

	RequestBuilder.addHelper("withProgressCallback", function (progressCallback) {
		return function (client, processor, message) {
			message.progressCallback = progressCallback;
		};
	});

	RequestBuilder.addHelper("withCallbackParameterName", function (callbackParameterName) {
		return function (client, processor, message) {
			message.callbackParameterName = callbackParameterName;
		};
	});
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
});
define('aurelia-http-client/http-client',["exports", "./headers", "./request-builder", "./http-request-message", "./jsonp-request-message"], function (exports, _headers, _requestBuilder, _httpRequestMessage, _jsonpRequestMessage) {
  

  var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

  var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

  var Headers = _headers.Headers;
  var RequestBuilder = _requestBuilder.RequestBuilder;
  var HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  var createHttpRequestMessageProcessor = _httpRequestMessage.createHttpRequestMessageProcessor;
  var JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  var createJSONPRequestMessageProcessor = _jsonpRequestMessage.createJSONPRequestMessageProcessor;

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      var evt = new window.CustomEvent("aurelia-http-client-requests-drained", { bubbles: true, cancelable: true });
      setTimeout(function () {
        return document.dispatchEvent(evt);
      }, 1);
    }
  }

  /**
  * The main HTTP client object.
  *
  * @class HttpClient
  * @constructor
  */

  var HttpClient = exports.HttpClient = (function () {
    function HttpClient() {
      _classCallCheck(this, HttpClient);

      this.requestTransformers = [];
      this.requestProcessorFactories = new Map();
      this.requestProcessorFactories.set(HttpRequestMessage, createHttpRequestMessageProcessor);
      this.requestProcessorFactories.set(JSONPRequestMessage, createJSONPRequestMessageProcessor);
      this.pendingRequests = [];
      this.isRequesting = false;
    }

    _prototypeProperties(HttpClient, null, {
      request: {

        /**
         * Returns a new RequestBuilder for this HttpClient instance which can be used to build and send HTTP requests.
         *
         * @property request
         * @type RequestBuilder
         */

        get: function () {
          return new RequestBuilder(this);
        },
        configurable: true
      },
      configure: {

        /**
         * Configure this HttpClient with default settings to be used by all requests.
         *
         * @method configure
         * @param {Function} fn A function that takes a RequestBuilder as an argument.
         * @chainable
         */

        value: function configure(fn) {
          var builder = new RequestBuilder(this);
          fn(builder);
          this.requestTransformers = builder.transformers;
          return this;
        },
        writable: true,
        configurable: true
      },
      send: {

        /**
         * Sends a message using the underlying networking stack.
         *
         * @method send
         * @param message A configured HttpRequestMessage or JSONPRequestMessage.
         * @param {Array} transformers A collection of transformers to apply to the HTTP request.
         * @return {Promise} A cancellable promise object.
         */

        value: function send(message, transformers) {
          var _this = this;

          var createProcessor = this.requestProcessorFactories.get(message.constructor),
              processor,
              promise,
              i,
              ii;

          if (!createProcessor) {
            throw new Error("No request message processor factory for " + message.constructor + ".");
          }

          processor = createProcessor();
          trackRequestStart(this, processor);

          transformers = transformers || this.requestTransformers;

          for (i = 0, ii = transformers.length; i < ii; ++i) {
            transformers[i](this, processor, message);
          }

          promise = processor.process(this, message);

          promise.abort = promise.cancel = function () {
            processor.abort();
          };

          return promise.then(function (response) {
            trackRequestEnd(_this, processor);
            return response;
          })["catch"](function (response) {
            trackRequestEnd(_this, processor);
            throw response;
          });
        },
        writable: true,
        configurable: true
      },
      "delete": {

        /**
         * Sends an HTTP DELETE request.
         *
         * @method delete
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function _delete(uri) {
          return this.request["delete"](uri);
        },
        writable: true,
        configurable: true
      },
      get: {

        /**
         * Sends an HTTP GET request.
         *
         * @method get
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function get(uri) {
          return this.request.get(uri);
        },
        writable: true,
        configurable: true
      },
      head: {

        /**
         * Sends an HTTP HEAD request.
         *
         * @method head
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function head(uri) {
          return this.request.head(uri);
        },
        writable: true,
        configurable: true
      },
      jsonp: {

        /**
         * Sends a JSONP request.
         *
         * @method jsonp
         * @param {String} uri The target URI.
         * @param {String} [callbackParameterName=jsoncallback] The target Javascript expression to invoke.
         * @return {Promise} A cancellable promise object.
         */

        value: function jsonp(uri) {
          var callbackParameterName = arguments[1] === undefined ? "jsoncallback" : arguments[1];

          return this.request.jsonp(uri, callbackParameterName);
        },
        writable: true,
        configurable: true
      },
      options: {

        /**
         * Sends an HTTP OPTIONS request.
         *
         * @method options
         * @param {String} uri The target URI.
         * @return {Promise} A cancellable promise object.
         */

        value: function options(uri) {
          return this.request.options(uri);
        },
        writable: true,
        configurable: true
      },
      put: {

        /**
         * Sends an HTTP PUT request.
         *
         * @method put
         * @param {String} uri The target URI.
         * @param {Object} uri The request payload.
         * @return {Promise} A cancellable promise object.
         */

        value: function put(uri, content) {
          return this.request.put(uri, content);
        },
        writable: true,
        configurable: true
      },
      patch: {

        /**
         * Sends an HTTP PATCH request.
         *
         * @method patch
         * @param {String} uri The target URI.
         * @param {Object} uri The request payload.
         * @return {Promise} A cancellable promise object.
         */

        value: function patch(uri, content) {
          return this.request.patch(uri, content);
        },
        writable: true,
        configurable: true
      },
      post: {

        /**
         * Sends an HTTP POST request.
         *
         * @method post
         * @param {String} uri The target URI.
         * @param {Object} uri The request payload.
         * @return {Promise} A cancellable promise object.
         */

        value: function post(uri, content) {
          return this.request.post(uri, content);
        },
        writable: true,
        configurable: true
      }
    });

    return HttpClient;
  })();

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client/index',["exports", "./http-client", "./http-request-message", "./http-response-message", "./jsonp-request-message", "./headers", "./request-builder"], function (exports, _httpClient, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers, _requestBuilder) {
  

  /**
   * An extensible HTTP client provided by Aurelia.
   *
   * @module HttpClient
   */

  exports.HttpClient = _httpClient.HttpClient;
  exports.HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  exports.HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  exports.JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  exports.Headers = _headers.Headers;
  exports.RequestBuilder = _requestBuilder.RequestBuilder;
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
define('aurelia-http-client', ['aurelia-http-client/index'], function (main) { return main; });

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
      if (global.document.readyState === "complete") {
        resolve(global.document);
      } else {
        global.document.addEventListener("DOMContentLoaded", completed, false);
        global.addEventListener("load", completed, false);
      }

      function completed() {
        global.document.removeEventListener("DOMContentLoaded", completed, false);
        global.removeEventListener("load", completed, false);
        resolve(global.document);
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
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
});
(function(global){
  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);
  var hasTemplateElement = typeof HTMLTemplateElement !== 'undefined';

  function isSVGTemplate(el) {
    return el.tagName == 'template' &&
           el.namespaceURI == 'http://www.w3.org/2000/svg';
  }

  function isHTMLTemplate(el) {
    return el.tagName == 'TEMPLATE' &&
           el.namespaceURI == 'http://www.w3.org/1999/xhtml';
  }

  function isTemplate(el) {
    if (el.isTemplate_ === undefined)
      el.isTemplate_ = el.tagName == 'TEMPLATE';

    return el.isTemplate_;
  }

  function forAllTemplatesFrom(node, fn) {
    var subTemplates = node.querySelectorAll('template');

    if (isTemplate(node))
      fn(node);

    forEach(subTemplates, fn);
  }

  function bootstrapTemplatesRecursivelyFrom(node) {
    function bootstrap(template) {
      if (!HTMLTemplateElement.decorate(template))
        bootstrapTemplatesRecursivelyFrom(template.content);
    }

    forAllTemplatesFrom(node, bootstrap);
  }

  if (!hasTemplateElement) {
    /**
     * This represents a <template> element.
     * @constructor
     * @extends {HTMLElement}
     */
    global.HTMLTemplateElement = function() {
      throw TypeError('Illegal constructor');
    };
  }

  function getOrCreateTemplateContentsOwner(template) {
    var doc = template.ownerDocument;
    if (!doc.defaultView)
      return doc;
    var d = doc.templateContentsOwner_;
    if (!d) {
      // TODO(arv): This should either be a Document or HTMLDocument depending
      // on doc.
      d = doc.implementation.createHTMLDocument('');
      while (d.lastChild) {
        d.removeChild(d.lastChild);
      }
      doc.templateContentsOwner_ = d;
    }
    return d;
  }

  function liftNonNativeTemplateChildrenIntoContent(template, el, useRoot) {
    var content = template.content;
    if (useRoot) {
      content.appendChild(el);
      return;
    }

    var child;
    while (child = el.firstChild) {
      content.appendChild(child);
    }
  }

  var hasProto = '__proto__' in {};

  function mixin(to, from) {
    Object.getOwnPropertyNames(from).forEach(function(name) {
      Object.defineProperty(to, name, Object.getOwnPropertyDescriptor(from, name));
    });
  }

  function fixTemplateElementPrototype(el) {
    if (hasProto)
      el.__proto__ = HTMLTemplateElement.prototype;
    else
      mixin(el, HTMLTemplateElement.prototype);
  }

  HTMLTemplateElement.decorate = function(el, opt_instanceRef) {
    if (el.templateIsDecorated_)
      return false;

    var templateElement = el;
    templateElement.templateIsDecorated_ = true;

    var isNativeHTMLTemplate = isHTMLTemplate(templateElement) &&
                               hasTemplateElement;
    var bootstrapContents = isNativeHTMLTemplate;
    var liftContents = !isNativeHTMLTemplate;
    var liftRoot = false;

    if (!isNativeHTMLTemplate) {
      if (isSVGTemplate(templateElement)) {
        templateElement = extractTemplateFromSVGTemplate(el);
        templateElement.templateIsDecorated_ = true;
        isNativeHTMLTemplate = hasTemplateElement;
      }
    }

    if (!isNativeHTMLTemplate) {
      fixTemplateElementPrototype(templateElement);
      var doc = getOrCreateTemplateContentsOwner(templateElement);
      templateElement.content_ = doc.createDocumentFragment();
    }

    if (opt_instanceRef) {
      // template is contained within an instance, its direct content must be
      // empty
      templateElement.instanceRef_ = opt_instanceRef;
    } else if (liftContents) {
      liftNonNativeTemplateChildrenIntoContent(templateElement,
                                               el,
                                               liftRoot);
    } else if (bootstrapContents) {
      bootstrapTemplatesRecursivelyFrom(templateElement.content);
    }

    return true;
  };

  var htmlElement = global.HTMLUnknownElement || HTMLElement;

  var contentDescriptor = {
    get: function() {
      return this.content_;
    },
    enumerable: true,
    configurable: true
  };

  if (!hasTemplateElement) {
    // Gecko is more picky with the prototype than WebKit. Make sure to use the
    // same prototype as created in the constructor.
    HTMLTemplateElement.prototype = Object.create(htmlElement.prototype);

    Object.defineProperty(HTMLTemplateElement.prototype, 'content', contentDescriptor);
  }

  HTMLTemplateElement.bootstrap = bootstrapTemplatesRecursivelyFrom;
}(window));
define("aurelia-html-template-element", function(){});

require([
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
  'aurelia-bootstrapper',
  'aurelia-html-template-element'
  ]);
define("aurelia-bundle-manifest", function(){});

