define('aurelia-path',['exports'], function (exports) {
  

  exports.__esModule = true;
  exports.relativeToFile = relativeToFile;
  exports.join = join;
  exports.buildQueryString = buildQueryString;
  function trimDots(ary) {
    var i, part;
    for (i = 0; i < ary.length; ++i) {
      part = ary[i];
      if (part === '.') {
        ary.splice(i, 1);
        i -= 1;
      } else if (part === '..') {
        if (i === 0 || i == 1 && ary[2] === '..' || ary[i - 1] === '..') {
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
        fileParts = file && file.split('/');

    name = name.trim();
    name = name.split('/');

    if (name[0].charAt(0) === '.' && fileParts) {
      normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
      name = normalizedBaseParts.concat(name);
    }

    trimDots(name);

    return name.join('/');
  }

  function join(path1, path2) {
    var url1, url2, url3, i, ii, urlPrefix;

    if (!path1) {
      return path2;
    }

    if (!path2) {
      return path1;
    }

    urlPrefix = path1.indexOf('//') === 0 ? '//' : path1.indexOf('/') === 0 ? '/' : '';
    trailingSlash = path2.slice(-1) == '/' ? '/' : '';

    url1 = path1.split('/');
    url2 = path2.split('/');
    url3 = [];

    for (i = 0, ii = url1.length; i < ii; ++i) {
      if (url1[i] == '..') {
        url3.pop();
      } else if (url1[i] == '.' || url1[i] == '') {
        continue;
      } else {
        url3.push(url1[i]);
      }
    }

    for (i = 0, ii = url2.length; i < ii; ++i) {
      if (url2[i] == '..') {
        url3.pop();
      } else if (url2[i] == '.' || url2[i] == '') {
        continue;
      } else {
        url3.push(url2[i]);
      }
    }

    return urlPrefix + url3.join('/').replace(/\:\//g, '://') + trailingSlash;
  }

  var r20 = /%20/g,
      rbracket = /\[\]$/,
      class2type = {};

  'Boolean Number String Function Array Date RegExp Object Error'.split(' ').forEach(function (name, i) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  });

  function type(obj) {
    if (obj == null) {
      return obj + '';
    }

    return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] || 'object' : typeof obj;
  }

  function buildQueryString(a, traditional) {
    var prefix,
        s = [],
        add = function add(key, value) {
      value = typeof value === 'function' ? value() : value == null ? '' : value;
      s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    };

    for (prefix in a) {
      _buildQueryString(prefix, a[prefix], traditional, add);
    }

    return s.join('&').replace(r20, '+');
  }

  function _buildQueryString(prefix, obj, traditional, add) {
    var name;

    if (Array.isArray(obj)) {
      obj.forEach(function (v, i) {
        if (traditional || rbracket.test(prefix)) {
          add(prefix, v);
        } else {
          _buildQueryString(prefix + '[' + (typeof v === 'object' ? i : '') + ']', v, traditional, add);
        }
      });
    } else if (!traditional && type(obj) === 'object') {
      for (name in obj) {
        _buildQueryString(prefix + '[' + name + ']', obj[name], traditional, add);
      }
    } else {
      add(prefix, obj);
    }
  }
});
define('aurelia-loader/template-registry-entry',['exports', 'aurelia-path'], function (exports, _aureliaPath) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var TemplateDependency = function TemplateDependency(src, name) {
    _classCallCheck(this, TemplateDependency);

    this.src = src;
    this.name = name;
  };

  exports.TemplateDependency = TemplateDependency;

  var TemplateRegistryEntry = (function () {
    function TemplateRegistryEntry(id) {
      _classCallCheck(this, TemplateRegistryEntry);

      this.id = id;
      this.template = null;
      this.dependencies = null;
      this.resources = null;
      this.factory = null;
    }

    TemplateRegistryEntry.prototype.setTemplate = function setTemplate(template) {
      var id = this.id,
          useResources,
          i,
          ii,
          current,
          src;

      this.template = template;
      useResources = template.content.querySelectorAll('require');
      this.dependencies = new Array(useResources.length);

      if (useResources.length === 0) {
        return;
      }

      for (i = 0, ii = useResources.length; i < ii; ++i) {
        current = useResources[i];
        src = current.getAttribute('from');

        if (!src) {
          throw new Error('<require> element in ' + this.id + ' has no "from" attribute.');
        }

        this.dependencies[i] = new TemplateDependency(_aureliaPath.relativeToFile(src, id), current.getAttribute('as'));

        if (current.parentNode) {
          current.parentNode.removeChild(current);
        }
      }
    };

    TemplateRegistryEntry.prototype.setResources = function setResources(resources) {
      this.resources = resources;
    };

    TemplateRegistryEntry.prototype.setFactory = function setFactory(factory) {
      this.factory = factory;
    };

    _createClass(TemplateRegistryEntry, [{
      key: 'templateIsLoaded',
      get: function () {
        return this.template !== null;
      }
    }, {
      key: 'isReady',
      get: function () {
        return this.factory !== null;
      }
    }]);

    return TemplateRegistryEntry;
  })();

  exports.TemplateRegistryEntry = TemplateRegistryEntry;
});
/**
 * Core.js 0.9.6
 * https://github.com/zloirock/core-js
 * License: http://rock.mit-license.org
 * © 2015 Denis Pushkarev
 */
!function(undefined){

var __e = null, __g = null;

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(7);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(23);
	__webpack_require__(22);
	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(31);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);
	__webpack_require__(37);
	__webpack_require__(38);
	__webpack_require__(39);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);
	__webpack_require__(43);
	__webpack_require__(44);
	__webpack_require__(45);
	__webpack_require__(48);
	__webpack_require__(49);
	__webpack_require__(46);
	__webpack_require__(47);
	__webpack_require__(50);
	__webpack_require__(51);
	__webpack_require__(52);
	__webpack_require__(53);
	__webpack_require__(54);
	__webpack_require__(55);
	__webpack_require__(56);
	__webpack_require__(57);
	__webpack_require__(58);
	__webpack_require__(59);
	__webpack_require__(60);
	__webpack_require__(61);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $                = __webpack_require__(62)
	  , cel              = __webpack_require__(63)
	  , cof              = __webpack_require__(64)
	  , $def             = __webpack_require__(65)
	  , invoke           = __webpack_require__(66)
	  , arrayMethod      = __webpack_require__(67)
	  , IE_PROTO         = __webpack_require__(68).safe('__proto__')
	  , assert           = __webpack_require__(69)
	  , assertObject     = assert.obj
	  , ObjectProto      = Object.prototype
	  , A                = []
	  , slice            = A.slice
	  , indexOf          = A.indexOf
	  , classof          = cof.classof
	  , has              = $.has
	  , defineProperty   = $.setDesc
	  , getOwnDescriptor = $.getDesc
	  , defineProperties = $.setDescs
	  , isFunction       = $.isFunction
	  , toObject         = $.toObject
	  , toLength         = $.toLength
	  , IE8_DOM_DEFINE   = false
	  , $indexOf         = __webpack_require__(70)(false)
	  , $forEach         = arrayMethod(0)
	  , $map             = arrayMethod(1)
	  , $filter          = arrayMethod(2)
	  , $some            = arrayMethod(3)
	  , $every           = arrayMethod(4);

	if(!$.DESC){
	  try {
	    IE8_DOM_DEFINE = defineProperty(cel('div'), 'x',
	      {get: function(){ return 8; }}
	    ).x == 8;
	  } catch(e){ /* empty */ }
	  $.setDesc = function(O, P, Attributes){
	    if(IE8_DOM_DEFINE)try {
	      return defineProperty(O, P, Attributes);
	    } catch(e){ /* empty */ }
	    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	    if('value' in Attributes)assertObject(O)[P] = Attributes.value;
	    return O;
	  };
	  $.getDesc = function(O, P){
	    if(IE8_DOM_DEFINE)try {
	      return getOwnDescriptor(O, P);
	    } catch(e){ /* empty */ }
	    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
	  };
	  $.setDescs = defineProperties = function(O, Properties){
	    assertObject(O);
	    var keys   = $.getKeys(Properties)
	      , length = keys.length
	      , i = 0
	      , P;
	    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
	    return O;
	  };
	}
	$def($def.S + $def.F * !$.DESC, 'Object', {
	  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $.getDesc,
	  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	  defineProperty: $.setDesc,
	  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	  defineProperties: defineProperties
	});

	  // IE 8- don't enum bug keys
	var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
	            'toLocaleString,toString,valueOf').split(',')
	  // Additional keys for getOwnPropertyNames
	  , keys2 = keys1.concat('length', 'prototype')
	  , keysLen1 = keys1.length;

	// Create object with `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = cel('iframe')
	    , i      = keysLen1
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  $.html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict.prototype[keys1[i]];
	  return createDict();
	};
	function createGetKeys(names, length){
	  return function(object){
	    var O      = toObject(object)
	      , i      = 0
	      , result = []
	      , key;
	    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	    // Don't enum bug & hidden keys
	    while(length > i)if(has(O, key = names[i++])){
	      ~indexOf.call(result, key) || result.push(key);
	    }
	    return result;
	  };
	}
	function isPrimitive(it){ return !$.isObject(it); }
	function Empty(){}
	$def($def.S, 'Object', {
	  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	  getPrototypeOf: $.getProto = $.getProto || function(O){
	    O = Object(assert.def(O));
	    if(has(O, IE_PROTO))return O[IE_PROTO];
	    if(isFunction(O.constructor) && O instanceof O.constructor){
	      return O.constructor.prototype;
	    } return O instanceof Object ? ObjectProto : null;
	  },
	  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
	  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	  create: $.create = $.create || function(O, /*?*/Properties){
	    var result;
	    if(O !== null){
	      Empty.prototype = assertObject(O);
	      result = new Empty();
	      Empty.prototype = null;
	      // add "__proto__" for Object.getPrototypeOf shim
	      result[IE_PROTO] = O;
	    } else result = createDict();
	    return Properties === undefined ? result : defineProperties(result, Properties);
	  },
	  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
	  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
	  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
	  seal: $.it, // <- cap
	  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
	  freeze: $.it, // <- cap
	  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
	  preventExtensions: $.it, // <- cap
	  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
	  isSealed: isPrimitive, // <- cap
	  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
	  isFrozen: isPrimitive, // <- cap
	  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
	  isExtensible: $.isObject // <- cap
	});

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	$def($def.P, 'Function', {
	  bind: function(that /*, args... */){
	    var fn       = assert.fn(this)
	      , partArgs = slice.call(arguments, 1);
	    function bound(/* args... */){
	      var args = partArgs.concat(slice.call(arguments));
	      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
	    }
	    if(fn.prototype)bound.prototype = fn.prototype;
	    return bound;
	  }
	});

	// Fix for not array-like ES3 string
	function arrayMethodFix(fn){
	  return function(){
	    return fn.apply($.ES5Object(this), arguments);
	  };
	}
	if(!(0 in Object('z') && 'z'[0] == 'z')){
	  $.ES5Object = function(it){
	    return cof(it) == 'String' ? it.split('') : Object(it);
	  };
	}
	$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
	  slice: arrayMethodFix(slice),
	  join: arrayMethodFix(A.join)
	});

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	$def($def.S, 'Array', {
	  isArray: function(arg){
	    return cof(arg) == 'Array';
	  }
	});
	function createArrayReduce(isRight){
	  return function(callbackfn, memo){
	    assert.fn(callbackfn);
	    var O      = toObject(this)
	      , length = toLength(O.length)
	      , index  = isRight ? length - 1 : 0
	      , i      = isRight ? -1 : 1;
	    if(arguments.length < 2)for(;;){
	      if(index in O){
	        memo = O[index];
	        index += i;
	        break;
	      }
	      index += i;
	      assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
	    }
	    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
	      memo = callbackfn(memo, O[index], index, this);
	    }
	    return memo;
	  };
	}
	$def($def.P, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: $.each = $.each || function forEach(callbackfn/*, that = undefined */){
	    return $forEach(this, callbackfn, arguments[1]);
	  },
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn/*, that = undefined */){
	    return $map(this, callbackfn, arguments[1]);
	  },
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn/*, that = undefined */){
	    return $filter(this, callbackfn, arguments[1]);
	  },
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: function some(callbackfn/*, that = undefined */){
	    return $some(this, callbackfn, arguments[1]);
	  },
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: function every(callbackfn/*, that = undefined */){
	    return $every(this, callbackfn, arguments[1]);
	  },
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: createArrayReduce(false),
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: createArrayReduce(true),
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: indexOf = indexOf || function indexOf(el /*, fromIndex = 0 */){
	    return $indexOf(this, el, arguments[1]);
	  },
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
	    var O      = toObject(this)
	      , length = toLength(O.length)
	      , index  = length - 1;
	    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));
	    if(index < 0)index = toLength(length + index);
	    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
	    return -1;
	  }
	});

	// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
	$def($def.P, 'String', {trim: __webpack_require__(71)(/^\s*([\s\S]*\S)?\s*$/, '$1')});

	// 20.3.3.1 / 15.9.4.4 Date.now()
	$def($def.S, 'Date', {now: function(){
	  return +new Date;
	}});

	function lz(num){
	  return num > 9 ? num : '0' + num;
	}

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	// PhantomJS and old webkit had a broken Date implementation.
	var date       = new Date(-5e13 - 1)
	  , brokenDate = !(date.toISOString && date.toISOString() == '0385-07-25T07:06:39.999Z'
	      && __webpack_require__(72)(function(){ new Date(NaN).toISOString(); }));
	$def($def.P + $def.F * brokenDate, 'Date', {toISOString: function(){
	  if(!isFinite(this))throw RangeError('Invalid time value');
	  var d = this
	    , y = d.getUTCFullYear()
	    , m = d.getUTCMilliseconds()
	    , s = y < 0 ? '-' : y > 9999 ? '+' : '';
	  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	}});

	if(classof(function(){ return arguments; }()) == 'Object')cof.classof = function(it){
	  var tag = classof(it);
	  return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	// ECMAScript 6 symbols shim
	var $        = __webpack_require__(62)
	  , setTag   = __webpack_require__(64).set
	  , uid      = __webpack_require__(68)
	  , $def     = __webpack_require__(65)
	  , keyOf    = __webpack_require__(73)
	  , enumKeys = __webpack_require__(74)
	  , assertObject = __webpack_require__(69).obj
	  , has      = $.has
	  , $create  = $.create
	  , getDesc  = $.getDesc
	  , setDesc  = $.setDesc
	  , desc     = $.desc
	  , getNames = $.getNames
	  , toObject = $.toObject
	  , $Symbol  = $.g.Symbol
	  , setter   = false
	  , TAG      = uid('tag')
	  , HIDDEN   = uid('hidden')
	  , SymbolRegistry = {}
	  , AllSymbols = {}
	  , useNative = $.isFunction($Symbol);

	function wrap(tag){
	  var sym = AllSymbols[tag] = $.set($create($Symbol.prototype), TAG, tag);
	  $.DESC && setter && setDesc(Object.prototype, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setDesc(this, tag, desc(1, value));
	    }
	  });
	  return sym;
	}

	function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, desc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D.enumerable = false;
	    }
	  } return setDesc(it, key, D);
	}
	function defineProperties(it, P){
	  assertObject(it);
	  var keys = enumKeys(P = toObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)defineProperty(it, key = keys[i++], P[key]);
	  return it;
	}
	function create(it, P){
	  return P === undefined ? $create(it) : defineProperties($create(it), P);
	}
	function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	}
	function getOwnPropertyNames(it){
	  var names  = getNames(toObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	}
	function getOwnPropertySymbols(it){
	  var names  = getNames(toObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	}

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(description){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor');
	    return wrap(uid(description));
	  };
	  $.hide($Symbol.prototype, 'toString', function(){
	    return this[TAG];
	  });

	  $.create     = create;
	  $.setDesc    = defineProperty;
	  $.getDesc    = getOwnPropertyDescriptor;
	  $.setDescs   = defineProperties;
	  $.getNames   = getOwnPropertyNames;
	  $.getSymbols = getOwnPropertySymbols;
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	    'species,split,toPrimitive,toStringTag,unscopables'
	  ).split(','), function(it){
	    var sym = __webpack_require__(75)(it);
	    symbolStatics[it] = useNative ? sym : wrap(sym);
	  }
	);

	setter = true;

	$def($def.G + $def.W, {Symbol: $Symbol});

	$def($def.S, 'Symbol', symbolStatics);

	$def($def.S + $def.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: getOwnPropertySymbols
	});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setTag($.g.JSON, 'JSON', true);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(65);
	$def($def.S, 'Object', {assign: __webpack_require__(76)});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $def = __webpack_require__(65);
	$def($def.S, 'Object', {
	  is: function is(x, y){
	    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $def = __webpack_require__(65);
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(77).set});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	
	// 19.1.3.6 Object.prototype.toString()
	var $   = __webpack_require__(62)
	  , cof = __webpack_require__(64)
	  , tmp = {};
	tmp[__webpack_require__(75)('toStringTag')] = 'z';
	if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function toString(){
	  return '[object ' + cof.classof(this) + ']';
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	
	var $    = __webpack_require__(62)
	  , NAME = 'name'
	  , setDesc = $.setDesc
	  , FunctionProto = Function.prototype;
	// 19.2.4.2 name
	NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
	  configurable: true,
	  get: function(){
	    var match = String(this).match(/^\s*function ([^ (]*)/)
	      , name  = match ? match[1] : '';
	    $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
	    return name;
	  },
	  set: function(value){
	    $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
	  }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(62)
	  , $def     = __webpack_require__(65)
	  , isObject = $.isObject
	  , toObject = $.toObject;
	function wrapObjectMethod(METHOD, MODE){
	  var fn  = ($.core.Object || {})[METHOD] || Object[METHOD]
	    , f   = 0
	    , o   = {};
	  o[METHOD] = MODE == 1 ? function(it){
	    return isObject(it) ? fn(it) : it;
	  } : MODE == 2 ? function(it){
	    return isObject(it) ? fn(it) : true;
	  } : MODE == 3 ? function(it){
	    return isObject(it) ? fn(it) : false;
	  } : MODE == 4 ? function getOwnPropertyDescriptor(it, key){
	    return fn(toObject(it), key);
	  } : MODE == 5 ? function getPrototypeOf(it){
	    return fn(Object($.assertDefined(it)));
	  } : function(it){
	    return fn(toObject(it));
	  };
	  try {
	    fn('z');
	  } catch(e){
	    f = 1;
	  }
	  $def($def.S + $def.F * f, 'Object', o);
	}
	wrapObjectMethod('freeze', 1);
	wrapObjectMethod('seal', 1);
	wrapObjectMethod('preventExtensions', 1);
	wrapObjectMethod('isFrozen', 2);
	wrapObjectMethod('isSealed', 2);
	wrapObjectMethod('isExtensible', 3);
	wrapObjectMethod('getOwnPropertyDescriptor', 4);
	wrapObjectMethod('getPrototypeOf', 5);
	wrapObjectMethod('keys');
	wrapObjectMethod('getOwnPropertyNames');

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var $             = __webpack_require__(62)
	  , HAS_INSTANCE  = __webpack_require__(75)('hasInstance')
	  , FunctionProto = Function.prototype;
	// 19.2.3.6 Function.prototype[@@hasInstance](V)
	if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
	  if(!$.isFunction(this) || !$.isObject(O))return false;
	  if(!$.isObject(this.prototype))return O instanceof this;
	  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	  while(O = $.getProto(O))if(this.prototype === O)return true;
	  return false;
	}});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	var $          = __webpack_require__(62)
	  , isObject   = $.isObject
	  , isFunction = $.isFunction
	  , NUMBER     = 'Number'
	  , $Number    = $.g[NUMBER]
	  , Base       = $Number
	  , proto      = $Number.prototype;
	function toPrimitive(it){
	  var fn, val;
	  if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
	  if(isFunction(fn = it.toString) && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to number");
	}
	function toNumber(it){
	  if(isObject(it))it = toPrimitive(it);
	  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
	    var binary = false;
	    switch(it.charCodeAt(1)){
	      case 66 : case 98  : binary = true;
	      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
	    }
	  } return +it;
	}
	if($.FW && !($Number('0o1') && $Number('0b1'))){
	  $Number = function Number(it){
	    return this instanceof $Number ? new Base(toNumber(it)) : toNumber(it);
	  };
	  $.each.call($.DESC ? $.getNames(Base) : (
	      // ES3:
	      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	      // ES6 (in case, if modules with ES6 Number statics required before):
	      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	    ).split(','), function(key){
	      if($.has(Base, key) && !$.has($Number, key)){
	        $.setDesc($Number, key, $.getDesc(Base, key));
	      }
	    }
	  );
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  $.hide($.g, NUMBER, $Number);
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var $     = __webpack_require__(62)
	  , $def  = __webpack_require__(65)
	  , abs   = Math.abs
	  , floor = Math.floor
	  , _isFinite = $.g.isFinite
	  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
	function isInteger(it){
	  return !$.isObject(it) && _isFinite(it) && floor(it) === it;
	}
	$def($def.S, 'Number', {
	  // 20.1.2.1 Number.EPSILON
	  EPSILON: Math.pow(2, -52),
	  // 20.1.2.2 Number.isFinite(number)
	  isFinite: function isFinite(it){
	    return typeof it == 'number' && _isFinite(it);
	  },
	  // 20.1.2.3 Number.isInteger(number)
	  isInteger: isInteger,
	  // 20.1.2.4 Number.isNaN(number)
	  isNaN: function isNaN(number){
	    return number != number;
	  },
	  // 20.1.2.5 Number.isSafeInteger(number)
	  isSafeInteger: function isSafeInteger(number){
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Infinity = 1 / 0
	  , $def  = __webpack_require__(65)
	  , E     = Math.E
	  , pow   = Math.pow
	  , abs   = Math.abs
	  , exp   = Math.exp
	  , log   = Math.log
	  , sqrt  = Math.sqrt
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , EPSILON   = pow(2, -52)
	  , EPSILON32 = pow(2, -23)
	  , MAX32     = pow(2, 127) * (2 - EPSILON32)
	  , MIN32     = pow(2, -126);
	function roundTiesToEven(n){
	  return n + 1 / EPSILON - 1 / EPSILON;
	}

	// 20.2.2.28 Math.sign(x)
	function sign(x){
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	}
	// 20.2.2.5 Math.asinh(x)
	function asinh(x){
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
	}
	// 20.2.2.14 Math.expm1(x)
	function expm1(x){
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
	}

	$def($def.S, 'Math', {
	  // 20.2.2.3 Math.acosh(x)
	  acosh: function acosh(x){
	    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
	  },
	  // 20.2.2.5 Math.asinh(x)
	  asinh: asinh,
	  // 20.2.2.7 Math.atanh(x)
	  atanh: function atanh(x){
	    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
	  },
	  // 20.2.2.9 Math.cbrt(x)
	  cbrt: function cbrt(x){
	    return sign(x = +x) * pow(abs(x), 1 / 3);
	  },
	  // 20.2.2.11 Math.clz32(x)
	  clz32: function clz32(x){
	    return (x >>>= 0) ? 31 - floor(log(x + 0.5) * Math.LOG2E) : 32;
	  },
	  // 20.2.2.12 Math.cosh(x)
	  cosh: function cosh(x){
	    return (exp(x = +x) + exp(-x)) / 2;
	  },
	  // 20.2.2.14 Math.expm1(x)
	  expm1: expm1,
	  // 20.2.2.16 Math.fround(x)
	  fround: function fround(x){
	    var $abs  = abs(x)
	      , $sign = sign(x)
	      , a, result;
	    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	    a = (1 + EPSILON32 / EPSILON) * $abs;
	    result = a - (a - $abs);
	    if(result > MAX32 || result != result)return $sign * Infinity;
	    return $sign * result;
	  },
	  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
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
	  imul: function imul(x, y){
	    var UInt16 = 0xffff
	      , xn = +x
	      , yn = +y
	      , xl = UInt16 & xn
	      , yl = UInt16 & yn;
	    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
	  },
	  // 20.2.2.20 Math.log1p(x)
	  log1p: function log1p(x){
	    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
	  },
	  // 20.2.2.21 Math.log10(x)
	  log10: function log10(x){
	    return log(x) / Math.LN10;
	  },
	  // 20.2.2.22 Math.log2(x)
	  log2: function log2(x){
	    return log(x) / Math.LN2;
	  },
	  // 20.2.2.28 Math.sign(x)
	  sign: sign,
	  // 20.2.2.30 Math.sinh(x)
	  sinh: function sinh(x){
	    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
	  },
	  // 20.2.2.33 Math.tanh(x)
	  tanh: function tanh(x){
	    var a = expm1(x = +x)
	      , b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  },
	  // 20.2.2.34 Math.trunc(x)
	  trunc: function trunc(it){
	    return (it > 0 ? floor : ceil)(it);
	  }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var $def    = __webpack_require__(65)
	  , toIndex = __webpack_require__(62).toIndex
	  , fromCharCode = String.fromCharCode
	  , $fromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	$def($def.S + $def.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
	    var res = []
	      , len = arguments.length
	      , i   = 0
	      , code;
	    while(len > i){
	      code = +arguments[i++];
	      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
	      );
	    } return res.join('');
	  }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var $    = __webpack_require__(62)
	  , $def = __webpack_require__(65);

	$def($def.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function raw(callSite){
	    var tpl = $.toObject(callSite.raw)
	      , len = $.toLength(tpl.length)
	      , sln = arguments.length
	      , res = []
	      , i   = 0;
	    while(len > i){
	      res.push(String(tpl[i++]));
	      if(i < sln)res.push(String(arguments[i]));
	    } return res.join('');
	  }
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var set   = __webpack_require__(62).set
	  , $at   = __webpack_require__(78)(true)
	  , ITER  = __webpack_require__(68).safe('iter')
	  , $iter = __webpack_require__(79)
	  , step  = $iter.step;

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(80)(String, 'String', function(iterated){
	  set(this, ITER, {o: String(iterated), i: 0});
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , index = iter.i
	    , point;
	  if(index >= O.length)return step(1);
	  point = $at(O, index);
	  iter.i += point.length;
	  return step(0, point);
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	var $def = __webpack_require__(65)
	  , $at  = __webpack_require__(78)(false);
	$def($def.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: function codePointAt(pos){
	    return $at(this, pos);
	  }
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	
	var $    = __webpack_require__(62)
	  , cof  = __webpack_require__(64)
	  , $def = __webpack_require__(65)
	  , toLength = $.toLength;

	// should throw error on regex
	$def($def.P + $def.F * !__webpack_require__(72)(function(){ 'q'.endsWith(/./); }), 'String', {
	  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	  endsWith: function endsWith(searchString /*, endPosition = @length */){
	    if(cof(searchString) == 'RegExp')throw TypeError();
	    var that = String($.assertDefined(this))
	      , endPosition = arguments[1]
	      , len = toLength(that.length)
	      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
	    searchString += '';
	    return that.slice(end - searchString.length, end) === searchString;
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	
	var $    = __webpack_require__(62)
	  , cof  = __webpack_require__(64)
	  , $def = __webpack_require__(65);

	$def($def.P, 'String', {
	  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
	  includes: function includes(searchString /*, position = 0 */){
	    if(cof(searchString) == 'RegExp')throw TypeError();
	    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
	  }
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(65);

	$def($def.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: __webpack_require__(95)
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	var $    = __webpack_require__(62)
	  , cof  = __webpack_require__(64)
	  , $def = __webpack_require__(65);

	// should throw error on regex
	$def($def.P + $def.F * !__webpack_require__(72)(function(){ 'q'.startsWith(/./); }), 'String', {
	  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	  startsWith: function startsWith(searchString /*, position = 0 */){
	    if(cof(searchString) == 'RegExp')throw TypeError();
	    var that  = String($.assertDefined(this))
	      , index = $.toLength(Math.min(arguments[1], that.length));
	    searchString += '';
	    return that.slice(index, index + searchString.length) === searchString;
	  }
	});

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var $     = __webpack_require__(62)
	  , ctx   = __webpack_require__(81)
	  , $def  = __webpack_require__(65)
	  , $iter = __webpack_require__(79)
	  , call  = __webpack_require__(82);
	$def($def.S + $def.F * !__webpack_require__(83)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = Object($.assertDefined(arrayLike))
	      , mapfn   = arguments[1]
	      , mapping = mapfn !== undefined
	      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
	      , index   = 0
	      , length, result, step, iterator;
	    if($iter.is(O)){
	      iterator = $iter.get(O);
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result   = new (typeof this == 'function' ? this : Array);
	      for(; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, f, [step.value, index], true) : step.value;
	      }
	    } else {
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
	      for(; length > index; index++){
	        result[index] = mapping ? f(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(62)
	  , setUnscope = __webpack_require__(84)
	  , ITER       = __webpack_require__(68).safe('iter')
	  , $iter      = __webpack_require__(79)
	  , step       = $iter.step
	  , Iterators  = $iter.Iterators;

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(80)(Array, 'Array', function(iterated, kind){
	  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , kind  = iter.k
	    , index = iter.i++;
	  if(!O || index >= O.length){
	    iter.o = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(65);
	$def($def.S, 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function of(/* ...args */){
	    var index  = 0
	      , length = arguments.length
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      , result = new (typeof this == 'function' ? this : Array)(length);
	    while(length > index)result[index] = arguments[index++];
	    result.length = length;
	    return result;
	  }
	});

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(85)(Array);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , toIndex = $.toIndex;
	$def($def.P, 'Array', {
	  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	  copyWithin: function copyWithin(target/* = 0 */, start /* = 0, end = @length */){
	    var O     = Object($.assertDefined(this))
	      , len   = $.toLength(O.length)
	      , to    = toIndex(target, len)
	      , from  = toIndex(start, len)
	      , end   = arguments[2]
	      , fin   = end === undefined ? len : toIndex(end, len)
	      , count = Math.min(fin - from, len - to)
	      , inc   = 1;
	    if(from < to && to < from + count){
	      inc  = -1;
	      from = from + count - 1;
	      to   = to   + count - 1;
	    }
	    while(count-- > 0){
	      if(from in O)O[to] = O[from];
	      else delete O[to];
	      to   += inc;
	      from += inc;
	    } return O;
	  }
	});
	__webpack_require__(84)('copyWithin');

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	
	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , toIndex = $.toIndex;
	$def($def.P, 'Array', {
	  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	  fill: function fill(value /*, start = 0, end = @length */){
	    var O      = Object($.assertDefined(this))
	      , length = $.toLength(O.length)
	      , index  = toIndex(arguments[1], length)
	      , end    = arguments[2]
	      , endPos = end === undefined ? length : toIndex(end, length);
	    while(endPos > index)O[index++] = value;
	    return O;
	  }
	});
	__webpack_require__(84)('fill');

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
	var KEY    = 'find'
	  , $def   = __webpack_require__(65)
	  , forced = true
	  , $find  = __webpack_require__(67)(5);
	// Shouldn't skip holes
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });
	$def($def.P + $def.F * forced, 'Array', {
	  find: function find(callbackfn/*, that = undefined */){
	    return $find(this, callbackfn, arguments[1]);
	  }
	});
	__webpack_require__(84)(KEY);

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
	var KEY    = 'findIndex'
	  , $def   = __webpack_require__(65)
	  , forced = true
	  , $find  = __webpack_require__(67)(6);
	// Shouldn't skip holes
	if(KEY in [])Array(1)[KEY](function(){ forced = false; });
	$def($def.P + $def.F * forced, 'Array', {
	  findIndex: function findIndex(callbackfn/*, that = undefined */){
	    return $find(this, callbackfn, arguments[1]);
	  }
	});
	__webpack_require__(84)(KEY);

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var $       = __webpack_require__(62)
	  , cof     = __webpack_require__(64)
	  , $RegExp = $.g.RegExp
	  , Base    = $RegExp
	  , proto   = $RegExp.prototype
	  , re      = /a/g
	  // "new" creates a new object
	  , CORRECT_NEW = new $RegExp(re) !== re
	  // RegExp allows a regex with flags as the pattern
	  , ALLOWS_RE_WITH_FLAGS = function(){
	    try {
	      return $RegExp(re, 'i') == '/a/i';
	    } catch(e){ /* empty */ }
	  }();
	if($.FW && $.DESC){
	  if(!CORRECT_NEW || !ALLOWS_RE_WITH_FLAGS){
	    $RegExp = function RegExp(pattern, flags){
	      var patternIsRegExp  = cof(pattern) == 'RegExp'
	        , flagsIsUndefined = flags === undefined;
	      if(!(this instanceof $RegExp) && patternIsRegExp && flagsIsUndefined)return pattern;
	      return CORRECT_NEW
	        ? new Base(patternIsRegExp && !flagsIsUndefined ? pattern.source : pattern, flags)
	        : new Base(patternIsRegExp ? pattern.source : pattern
	          , patternIsRegExp && flagsIsUndefined ? pattern.flags : flags);
	    };
	    $.each.call($.getNames(Base), function(key){
	      key in $RegExp || $.setDesc($RegExp, key, {
	        configurable: true,
	        get: function(){ return Base[key]; },
	        set: function(it){ Base[key] = it; }
	      });
	    });
	    proto.constructor = $RegExp;
	    $RegExp.prototype = proto;
	    $.hide($.g, 'RegExp', $RegExp);
	  }
	  // 21.2.5.3 get RegExp.prototype.flags()
	  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
	    configurable: true,
	    get: __webpack_require__(71)(/^.*\/(\w*)$/, '$1')
	  });
	}
	__webpack_require__(85)($RegExp);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	
	var $        = __webpack_require__(62)
	  , ctx      = __webpack_require__(81)
	  , cof      = __webpack_require__(64)
	  , $def     = __webpack_require__(65)
	  , assert   = __webpack_require__(69)
	  , forOf    = __webpack_require__(86)
	  , setProto = __webpack_require__(77).set
	  , species  = __webpack_require__(85)
	  , SPECIES  = __webpack_require__(75)('species')
	  , RECORD   = __webpack_require__(68).safe('record')
	  , PROMISE  = 'Promise'
	  , global   = $.g
	  , process  = global.process
	  , asap     = process && process.nextTick || __webpack_require__(87).set
	  , P        = global[PROMISE]
	  , isFunction     = $.isFunction
	  , isObject       = $.isObject
	  , assertFunction = assert.fn
	  , assertObject   = assert.obj;

	var useNative = function(){
	  var test, works = false;
	  function P2(x){
	    var self = new P(x);
	    setProto(self, P2.prototype);
	    return self;
	  }
	  try {
	    works = isFunction(P) && isFunction(P.resolve) && P.resolve(test = new P(function(){})) == test;
	    setProto(P2, P);
	    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
	    // actual Firefox has broken subclass support, test that
	    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
	      works = false;
	    }
	  } catch(e){ works = false; }
	  return works;
	}();

	// helpers
	function getConstructor(C){
	  var S = assertObject(C)[SPECIES];
	  return S != undefined ? S : C;
	}
	function isThenable(it){
	  var then;
	  if(isObject(it))then = it.then;
	  return isFunction(then) ? then : false;
	}
	function notify(record){
	  var chain = record.c;
	  if(chain.length)asap(function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    function run(react){
	      var cb = ok ? react.ok : react.fail
	        , ret, then;
	      try {
	        if(cb){
	          if(!ok)record.h = true;
	          ret = cb === true ? value : cb(value);
	          if(ret === react.P){
	            react.rej(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(ret)){
	            then.call(ret, react.res, react.rej);
	          } else react.res(ret);
	        } else react.rej(value);
	      } catch(err){
	        react.rej(err);
	      }
	    }
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	  });
	}
	function isUnhandled(promise){
	  var record = promise[RECORD]
	    , chain  = record.a || record.c
	    , i      = 0
	    , react;
	  if(record.h)return false;
	  while(chain.length > i){
	    react = chain[i++];
	    if(react.fail || !isUnhandled(react.P))return false;
	  } return true;
	}
	function $reject(value){
	  var record = this
	    , promise;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  record.v = value;
	  record.s = 2;
	  record.a = record.c.slice();
	  setTimeout(function(){
	    asap(function(){
	      if(isUnhandled(promise = record.p)){
	        if(cof(process) == 'process'){
	          process.emit('unhandledRejection', value, promise);
	        } else if(global.console && isFunction(console.error)){
	          console.error('Unhandled promise rejection', value);
	        }
	      }
	      record.a = undefined;
	    });
	  }, 1);
	  notify(record);
	}
	function $resolve(value){
	  var record = this
	    , then, wrapper;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  try {
	    if(then = isThenable(value)){
	      wrapper = {r: record, d: false}; // wrap
	      then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	    } else {
	      record.v = value;
	      record.s = 1;
	      notify(record);
	    }
	  } catch(err){
	    $reject.call(wrapper || {r: record, d: false}, err); // wrap
	  }
	}

	// constructor polyfill
	if(!useNative){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    assertFunction(executor);
	    var record = {
	      p: assert.inst(this, P, PROMISE),       // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false                                // <- handled rejection
	    };
	    $.hide(this, RECORD, record);
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  $.mix(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var S = assertObject(assertObject(this).constructor)[SPECIES];
	      var react = {
	        ok:   isFunction(onFulfilled) ? onFulfilled : true,
	        fail: isFunction(onRejected)  ? onRejected  : false
	      };
	      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
	        react.res = assertFunction(res);
	        react.rej = assertFunction(rej);
	      });
	      var record = this[RECORD];
	      record.c.push(react);
	      if(record.a)record.a.push(react);
	      record.s && notify(record);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}

	// export
	$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
	cof.set(P, PROMISE);
	species(P);
	species($.core[PROMISE]); // for wrapper

	// statics
	$def($def.S + $def.F * !useNative, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    return new (getConstructor(this))(function(res, rej){
	      rej(r);
	    });
	  },
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    return isObject(x) && RECORD in x && $.getProto(x) === this.prototype
	      ? x : new (getConstructor(this))(function(res){
	        res(x);
	      });
	  }
	});
	$def($def.S + $def.F * !(useNative && __webpack_require__(83)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C      = getConstructor(this)
	      , values = [];
	    return new C(function(res, rej){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        C.resolve(promise).then(function(value){
	          results[index] = value;
	          --remaining || res(results);
	        }, rej);
	      });
	      else res(results);
	    });
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C = getConstructor(this);
	    return new C(function(res, rej){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(res, rej);
	      });
	    });
	  }
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	
	var strong = __webpack_require__(88);

	// 23.1 Map Objects
	__webpack_require__(89)('Map', {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	
	var strong = __webpack_require__(88);

	// 23.2 Set Objects
	__webpack_require__(89)('Set', {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	
	var $         = __webpack_require__(62)
	  , weak      = __webpack_require__(90)
	  , leakStore = weak.leakStore
	  , ID        = weak.ID
	  , WEAK      = weak.WEAK
	  , has       = $.has
	  , isObject  = $.isObject
	  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
	  , tmp       = {};

	// 23.3 WeakMap Objects
	var WeakMap = __webpack_require__(89)('WeakMap', {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function get(key){
	    if(isObject(key)){
	      if(isFrozen(key))return leakStore(this).get(key);
	      if(has(key, WEAK))return key[WEAK][this[ID]];
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function set(key, value){
	    return weak.def(this, key, value);
	  }
	}, weak, true, true);

	// IE11 WeakMap frozen keys fix
	if($.FW && new WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
	  $.each.call(['delete', 'has', 'get', 'set'], function(key){
	    var method = WeakMap.prototype[key];
	    WeakMap.prototype[key] = function(a, b){
	      // store frozen objects on leaky map
	      if(isObject(a) && isFrozen(a)){
	        var result = leakStore(this)[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    };
	  });
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	
	var weak = __webpack_require__(90);

	// 23.4 WeakSet Objects
	__webpack_require__(89)('WeakSet', {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function add(value){
	    return weak.def(this, value, true);
	  }
	}, weak, false, true);

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(62)
	  , $def      = __webpack_require__(65)
	  , setProto  = __webpack_require__(77)
	  , $iter     = __webpack_require__(79)
	  , ITERATOR  = __webpack_require__(75)('iterator')
	  , ITER      = __webpack_require__(68).safe('iter')
	  , step      = $iter.step
	  , assert    = __webpack_require__(69)
	  , isObject  = $.isObject
	  , getProto  = $.getProto
	  , $Reflect  = $.g.Reflect
	  , _apply    = Function.apply
	  , assertObject = assert.obj
	  , _isExtensible = Object.isExtensible || $.isObject
	  , _preventExtensions = Object.preventExtensions || $.it
	  // IE TP has broken Reflect.enumerate
	  , buggyEnumerate = !($Reflect && $Reflect.enumerate && ITERATOR in $Reflect.enumerate({}));

	function Enumerate(iterated){
	  $.set(this, ITER, {o: iterated, k: undefined, i: 0});
	}
	$iter.create(Enumerate, 'Object', function(){
	  var iter = this[ITER]
	    , keys = iter.k
	    , key;
	  if(keys == undefined){
	    iter.k = keys = [];
	    for(key in iter.o)keys.push(key);
	  }
	  do {
	    if(iter.i >= keys.length)return step(1);
	  } while(!((key = keys[iter.i++]) in iter.o));
	  return step(0, key);
	});

	var reflect = {
	  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	  apply: function apply(target, thisArgument, argumentsList){
	    return _apply.call(target, thisArgument, argumentsList);
	  },
	  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	  construct: function construct(target, argumentsList /*, newTarget*/){
	    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
	      , instance = $.create(isObject(proto) ? proto : Object.prototype)
	      , result   = _apply.call(target, instance, argumentsList);
	    return isObject(result) ? result : instance;
	  },
	  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	  defineProperty: function defineProperty(target, propertyKey, attributes){
	    assertObject(target);
	    try {
	      $.setDesc(target, propertyKey, attributes);
	      return true;
	    } catch(e){
	      return false;
	    }
	  },
	  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
	  deleteProperty: function deleteProperty(target, propertyKey){
	    var desc = $.getDesc(assertObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  },
	  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
	  get: function get(target, propertyKey/*, receiver*/){
	    var receiver = arguments.length < 3 ? target : arguments[2]
	      , desc = $.getDesc(assertObject(target), propertyKey), proto;
	    if(desc)return $.has(desc, 'value')
	      ? desc.value
	      : desc.get === undefined
	        ? undefined
	        : desc.get.call(receiver);
	    return isObject(proto = getProto(target))
	      ? get(proto, propertyKey, receiver)
	      : undefined;
	  },
	  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
	    return $.getDesc(assertObject(target), propertyKey);
	  },
	  // 26.1.8 Reflect.getPrototypeOf(target)
	  getPrototypeOf: function getPrototypeOf(target){
	    return getProto(assertObject(target));
	  },
	  // 26.1.9 Reflect.has(target, propertyKey)
	  has: function has(target, propertyKey){
	    return propertyKey in target;
	  },
	  // 26.1.10 Reflect.isExtensible(target)
	  isExtensible: function isExtensible(target){
	    return _isExtensible(assertObject(target));
	  },
	  // 26.1.11 Reflect.ownKeys(target)
	  ownKeys: __webpack_require__(91),
	  // 26.1.12 Reflect.preventExtensions(target)
	  preventExtensions: function preventExtensions(target){
	    assertObject(target);
	    try {
	      _preventExtensions(target);
	      return true;
	    } catch(e){
	      return false;
	    }
	  },
	  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	  set: function set(target, propertyKey, V/*, receiver*/){
	    var receiver = arguments.length < 4 ? target : arguments[3]
	      , ownDesc  = $.getDesc(assertObject(target), propertyKey)
	      , existingDescriptor, proto;
	    if(!ownDesc){
	      if(isObject(proto = getProto(target))){
	        return set(proto, propertyKey, V, receiver);
	      }
	      ownDesc = $.desc(0);
	    }
	    if($.has(ownDesc, 'value')){
	      if(ownDesc.writable === false || !isObject(receiver))return false;
	      existingDescriptor = $.getDesc(receiver, propertyKey) || $.desc(0);
	      existingDescriptor.value = V;
	      $.setDesc(receiver, propertyKey, existingDescriptor);
	      return true;
	    }
	    return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	  }
	};
	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	if(setProto)reflect.setPrototypeOf = function setPrototypeOf(target, proto){
	  setProto.check(target, proto);
	  try {
	    setProto.set(target, proto);
	    return true;
	  } catch(e){
	    return false;
	  }
	};

	$def($def.G, {Reflect: {}});

	$def($def.S + $def.F * buggyEnumerate, 'Reflect', {
	  // 26.1.5 Reflect.enumerate(target)
	  enumerate: function enumerate(target){
	    return new Enumerate(assertObject(target));
	  }
	});

	$def($def.S, 'Reflect', reflect);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/domenic/Array.prototype.includes
	var $def      = __webpack_require__(65)
	  , $includes = __webpack_require__(70)(true);
	$def($def.P, 'Array', {
	  includes: function includes(el /*, fromIndex = 0 */){
	    return $includes(this, el, arguments[1]);
	  }
	});
	__webpack_require__(84)('includes');

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/mathiasbynens/String.prototype.at
	
	var $def = __webpack_require__(65)
	  , $at  = __webpack_require__(78)(true);
	$def($def.P, 'String', {
	  at: function at(pos){
	    return $at(this, pos);
	  }
	});

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	
	var $def = __webpack_require__(65)
	  , $pad = __webpack_require__(92);
	$def($def.P, 'String', {
	  lpad: function lpad(n){
	    return $pad(this, n, arguments[1], true);
	  }
	});

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	
	var $def = __webpack_require__(65)
	  , $pad = __webpack_require__(92);
	$def($def.P, 'String', {
	  rpad: function rpad(n){
	    return $pad(this, n, arguments[1], false);
	  }
	});

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/kangax/9698100
	var $def = __webpack_require__(65);
	$def($def.S, 'RegExp', {
	  escape: __webpack_require__(71)(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
	});

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/WebReflection/9353781
	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , ownKeys = __webpack_require__(91);

	$def($def.S, 'Object', {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
	    var O      = $.toObject(object)
	      , result = {};
	    $.each.call(ownKeys(O), function(key){
	      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
	    });
	    return result;
	  }
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $    = __webpack_require__(62)
	  , $def = __webpack_require__(65);
	function createObjectToArray(isEntries){
	  return function(object){
	    var O      = $.toObject(object)
	      , keys   = $.getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , result = Array(length)
	      , key;
	    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
	    else while(length > i)result[i] = O[keys[i++]];
	    return result;
	  };
	}
	$def($def.S, 'Object', {
	  values:  createObjectToArray(false),
	  entries: createObjectToArray(true)
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	__webpack_require__(93)('Map');

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	__webpack_require__(93)('Set');

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var $def  = __webpack_require__(65)
	  , $task = __webpack_require__(87);
	$def($def.G + $def.B, {
	  setImmediate:   $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(62)
	  , ctx      = __webpack_require__(81)
	  , $def     = __webpack_require__(65)
	  , assign   = __webpack_require__(76)
	  , keyOf    = __webpack_require__(73)
	  , ITER     = __webpack_require__(68).safe('iter')
	  , assert   = __webpack_require__(69)
	  , $iter    = __webpack_require__(79)
	  , forOf    = __webpack_require__(86)
	  , step     = $iter.step
	  , getKeys  = $.getKeys
	  , toObject = $.toObject
	  , has      = $.has;

	function Dict(iterable){
	  var dict = $.create(null);
	  if(iterable != undefined){
	    if($iter.is(iterable)){
	      forOf(iterable, true, function(key, value){
	        dict[key] = value;
	      });
	    } else assign(dict, iterable);
	  }
	  return dict;
	}
	Dict.prototype = null;

	function DictIterator(iterated, kind){
	  $.set(this, ITER, {o: toObject(iterated), a: getKeys(iterated), i: 0, k: kind});
	}
	$iter.create(DictIterator, 'Dict', function(){
	  var iter = this[ITER]
	    , O    = iter.o
	    , keys = iter.a
	    , kind = iter.k
	    , key;
	  do {
	    if(iter.i >= keys.length){
	      iter.o = undefined;
	      return step(1);
	    }
	  } while(!has(O, key = keys[iter.i++]));
	  if(kind == 'keys'  )return step(0, key);
	  if(kind == 'values')return step(0, O[key]);
	  return step(0, [key, O[key]]);
	});
	function createDictIter(kind){
	  return function(it){
	    return new DictIterator(it, kind);
	  };
	}
	function generic(A, B){
	  // strange IE quirks mode bug -> use typeof instead of isFunction
	  return typeof A == 'function' ? A : B;
	}

	// 0 -> Dict.forEach
	// 1 -> Dict.map
	// 2 -> Dict.filter
	// 3 -> Dict.some
	// 4 -> Dict.every
	// 5 -> Dict.find
	// 6 -> Dict.findKey
	// 7 -> Dict.mapPairs
	function createDictMethod(TYPE){
	  var IS_MAP   = TYPE == 1
	    , IS_EVERY = TYPE == 4;
	  return function(object, callbackfn, that /* = undefined */){
	    var f      = ctx(callbackfn, that, 3)
	      , O      = toObject(object)
	      , result = IS_MAP || TYPE == 7 || TYPE == 2 ? new (generic(this, Dict)) : undefined
	      , key, val, res;
	    for(key in O)if(has(O, key)){
	      val = O[key];
	      res = f(val, key, object);
	      if(TYPE){
	        if(IS_MAP)result[key] = res;            // map
	        else if(res)switch(TYPE){
	          case 2: result[key] = val; break;     // filter
	          case 3: return true;                  // some
	          case 5: return val;                   // find
	          case 6: return key;                   // findKey
	          case 7: result[res[0]] = res[1];      // mapPairs
	        } else if(IS_EVERY)return false;        // every
	      }
	    }
	    return TYPE == 3 || IS_EVERY ? IS_EVERY : result;
	  };
	}

	// true  -> Dict.turn
	// false -> Dict.reduce
	function createDictReduce(IS_TURN){
	  return function(object, mapfn, init){
	    assert.fn(mapfn);
	    var O      = toObject(object)
	      , keys   = getKeys(O)
	      , length = keys.length
	      , i      = 0
	      , memo, key, result;
	    if(IS_TURN){
	      memo = init == undefined ? new (generic(this, Dict)) : Object(init);
	    } else if(arguments.length < 3){
	      assert(length, 'Reduce of empty object with no initial value');
	      memo = O[keys[i++]];
	    } else memo = Object(init);
	    while(length > i)if(has(O, key = keys[i++])){
	      result = mapfn(memo, O[key], key, object);
	      if(IS_TURN){
	        if(result === false)break;
	      } else memo = result;
	    }
	    return memo;
	  };
	}
	var findKey = createDictMethod(6);

	$def($def.G + $def.F, {Dict: $.mix(Dict, {
	  keys:     createDictIter('keys'),
	  values:   createDictIter('values'),
	  entries:  createDictIter('entries'),
	  forEach:  createDictMethod(0),
	  map:      createDictMethod(1),
	  filter:   createDictMethod(2),
	  some:     createDictMethod(3),
	  every:    createDictMethod(4),
	  find:     createDictMethod(5),
	  findKey:  findKey,
	  mapPairs: createDictMethod(7),
	  reduce:   createDictReduce(false),
	  turn:     createDictReduce(true),
	  keyOf:    keyOf,
	  includes: function(object, el){
	    return (el == el ? keyOf(object, el) : findKey(object, function(it){
	      return it != it;
	    })) !== undefined;
	  },
	  // Has / get / set own property
	  has: has,
	  get: function(object, key){
	    if(has(object, key))return object[key];
	  },
	  set: $.def,
	  isDict: function(it){
	    return $.isObject(it) && $.getProto(it) === Dict.prototype;
	  }
	})});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(62).core
	  , $iter = __webpack_require__(79);
	core.isIterable  = $iter.is;
	core.getIterator = $iter.get;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(22);
	var $           = __webpack_require__(62)
	  , Iterators   = __webpack_require__(79).Iterators
	  , ITERATOR    = __webpack_require__(75)('iterator')
	  , ArrayValues = Iterators.Array
	  , NodeList    = $.g.NodeList;
	if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){
	  $.hide(NodeList.prototype, ITERATOR, ArrayValues);
	}
	Iterators.NodeList = ArrayValues;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// ie9- setTimeout & setInterval additional parameters fix
	var $         = __webpack_require__(62)
	  , $def      = __webpack_require__(65)
	  , invoke    = __webpack_require__(66)
	  , partial   = __webpack_require__(94)
	  , navigator = $.g.navigator
	  , MSIE      = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
	function wrap(set){
	  return MSIE ? function(fn, time /*, ...args */){
	    return set(invoke(
	      partial,
	      [].slice.call(arguments, 2),
	      $.isFunction(fn) ? fn : Function(fn)
	    ), time);
	  } : set;
	}
	$def($def.G + $def.B + $def.F * MSIE, {
	  setTimeout:  wrap($.g.setTimeout),
	  setInterval: wrap($.g.setInterval)
	});

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	
	var $       = __webpack_require__(62)
	  , ctx     = __webpack_require__(81)
	  , safe    = __webpack_require__(68).safe
	  , $def    = __webpack_require__(65)
	  , $iter   = __webpack_require__(79)
	  , forOf   = __webpack_require__(86)
	  , ENTRIES = safe('entries')
	  , FN      = safe('fn')
	  , ITER    = safe('iter')
	  , call    = __webpack_require__(82)
	  , getIterator    = $iter.get
	  , setIterator    = $iter.set
	  , createIterator = $iter.create;
	function $for(iterable, entries){
	  if(!(this instanceof $for))return new $for(iterable, entries);
	  this[ITER]    = getIterator(iterable);
	  this[ENTRIES] = !!entries;
	}

	createIterator($for, 'Wrapper', function(){
	  return this[ITER].next();
	});
	var $forProto = $for.prototype;
	setIterator($forProto, function(){
	  return this[ITER]; // unwrap
	});

	function createChainIterator(next){
	  function Iterator(iter, fn, that){
	    this[ITER]    = getIterator(iter);
	    this[ENTRIES] = iter[ENTRIES];
	    this[FN]      = ctx(fn, that, iter[ENTRIES] ? 2 : 1);
	  }
	  createIterator(Iterator, 'Chain', next, $forProto);
	  setIterator(Iterator.prototype, $.that); // override $forProto iterator
	  return Iterator;
	}

	var MapIter = createChainIterator(function(){
	  var step = this[ITER].next();
	  return step.done
	    ? step
	    : $iter.step(0, call(this[ITER], this[FN], step.value, this[ENTRIES]));
	});

	var FilterIter = createChainIterator(function(){
	  for(;;){
	    var step = this[ITER].next();
	    if(step.done || call(this[ITER], this[FN], step.value, this[ENTRIES]))return step;
	  }
	});

	$.mix($forProto, {
	  of: function(fn, that){
	    forOf(this, this[ENTRIES], fn, that);
	  },
	  array: function(fn, that){
	    var result = [];
	    forOf(fn != undefined ? this.map(fn, that) : this, false, result.push, result);
	    return result;
	  },
	  filter: function(fn, that){
	    return new FilterIter(this, fn, that);
	  },
	  map: function(fn, that){
	    return new MapIter(this, fn, that);
	  }
	});

	$for.isIterable  = $iter.is;
	$for.getIterator = getIterator;

	$def($def.G + $def.F, {$for: $for});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , partial = __webpack_require__(94);
	// https://esdiscuss.org/topic/promise-returning-delay-function
	$def($def.G + $def.F, {
	  delay: function(time){
	    return new ($.core.Promise || $.g.Promise)(function(resolve){
	      setTimeout(partial.call(resolve, true), time);
	    });
	  }
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	
	var $    = __webpack_require__(62)
	  , $def = __webpack_require__(65);

	// Placeholder
	$.core._ = $.path._ = $.path._ || {};

	$def($def.P + $def.F, 'Function', {
	  part: __webpack_require__(94)
	});

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , ownKeys = __webpack_require__(91);
	function define(target, mixin){
	  var keys   = ownKeys($.toObject(mixin))
	    , length = keys.length
	    , i = 0, key;
	  while(length > i)$.setDesc(target, key = keys[i++], $.getDesc(mixin, key));
	  return target;
	}
	$def($def.S + $def.F, 'Object', {
	  isObject: $.isObject,
	  classof: __webpack_require__(64).classof,
	  define: define,
	  make: function(proto, mixin){
	    return define($.create(proto), mixin);
	  }
	});

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	
	var $              = __webpack_require__(62)
	  , $def           = __webpack_require__(65)
	  , assertFunction = __webpack_require__(69).fn;
	$def($def.P + $def.F, 'Array', {
	  turn: function(fn, target /* = [] */){
	    assertFunction(fn);
	    var memo   = target == undefined ? [] : Object(target)
	      , O      = $.ES5Object(this)
	      , length = $.toLength(O.length)
	      , index  = 0;
	    while(length > index)if(fn(memo, O[index], index++, this) === false)break;
	    return memo;
	  }
	});
	__webpack_require__(84)('turn');

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	
	var $    = __webpack_require__(62)
	  , ITER = __webpack_require__(68).safe('iter');

	__webpack_require__(80)(Number, 'Number', function(iterated){
	  $.set(this, ITER, {l: $.toLength(iterated), i: 0});
	}, function(){
	  var iter = this[ITER]
	    , i    = iter.i++
	    , done = i >= iter.l;
	  return {done: done, value: done ? undefined : i};
	});

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	
	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , invoke  = __webpack_require__(66)
	  , methods = {};

	methods.random = function(lim /* = 0 */){
	  var a = +this
	    , b = lim == undefined ? 0 : +lim
	    , m = Math.min(a, b);
	  return Math.random() * (Math.max(a, b) - m) + m;
	};

	if($.FW)$.each.call((
	    // ES3:
	    'round,floor,ceil,abs,sin,asin,cos,acos,tan,atan,exp,sqrt,max,min,pow,atan2,' +
	    // ES6:
	    'acosh,asinh,atanh,cbrt,clz32,cosh,expm1,hypot,imul,log1p,log10,log2,sign,sinh,tanh,trunc'
	  ).split(','), function(key){
	    var fn = Math[key];
	    if(fn)methods[key] = function(/* ...args */){
	      // ie9- dont support strict mode & convert `this` to object -> convert it to number
	      var args = [+this]
	        , i    = 0;
	      while(arguments.length > i)args.push(arguments[i++]);
	      return invoke(fn, args);
	    };
	  }
	);

	$def($def.P + $def.F, 'Number', methods);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var $def     = __webpack_require__(65)
	  , replacer = __webpack_require__(71);
	var escapeHTMLDict = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&apos;'
	}, unescapeHTMLDict = {}, key;
	for(key in escapeHTMLDict)unescapeHTMLDict[escapeHTMLDict[key]] = key;
	$def($def.P + $def.F, 'String', {
	  escapeHTML:   replacer(/[&<>"']/g, escapeHTMLDict),
	  unescapeHTML: replacer(/&(?:amp|lt|gt|quot|apos);/g, unescapeHTMLDict)
	});

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var $            = __webpack_require__(62)
	  , $def         = __webpack_require__(65)
	  , core         = $.core
	  , formatRegExp = /\b\w\w?\b/g
	  , flexioRegExp = /:(.*)\|(.*)$/
	  , locales      = {}
	  , current      = 'en'
	  , SECONDS      = 'Seconds'
	  , MINUTES      = 'Minutes'
	  , HOURS        = 'Hours'
	  , DATE         = 'Date'
	  , MONTH        = 'Month'
	  , YEAR         = 'FullYear';
	function lz(num){
	  return num > 9 ? num : '0' + num;
	}
	function createFormat(prefix){
	  return function(template, locale /* = current */){
	    var that = this
	      , dict = locales[$.has(locales, locale) ? locale : current];
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
	  };
	}
	function addLocale(lang, locale){
	  function split(index){
	    var result = [];
	    $.each.call(locale.months.split(','), function(it){
	      result.push(it.replace(flexioRegExp, '$' + index));
	    });
	    return result;
	  }
	  locales[lang] = [locale.weekdays.split(','), split(1), split(2)];
	  return core;
	}
	$def($def.P + $def.F, DATE, {
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
	  return $.has(locales, locale) ? current = locale : current;
	};
	core.addLocale = addLocale;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(65);
	$def($def.G + $def.F, {global: __webpack_require__(62).g});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var $    = __webpack_require__(62)
	  , $def = __webpack_require__(65)
	  , log  = {}
	  , enabled = true;
	// Methods from https://github.com/DeveloperToolsWG/console-object/blob/master/api.md
	$.each.call(('assert,clear,count,debug,dir,dirxml,error,exception,' +
	    'group,groupCollapsed,groupEnd,info,isIndependentlyComposed,log,' +
	    'markTimeline,profile,profileEnd,table,time,timeEnd,timeline,' +
	    'timelineEnd,timeStamp,trace,warn').split(','), function(key){
	  log[key] = function(){
	    if(enabled && $.g.console && $.isFunction(console[key])){
	      return Function.apply.call(console[key], console, arguments);
	    }
	  };
	});
	$def($def.G + $def.F, {log: __webpack_require__(76)(log.log, log, {
	  enable: function(){
	    enabled = true;
	  },
	  disable: function(){
	    enabled = false;
	  }
	})});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	// JavaScript 1.6 / Strawman array statics shim
	var $       = __webpack_require__(62)
	  , $def    = __webpack_require__(65)
	  , $Array  = $.core.Array || Array
	  , statics = {};
	function setStatics(keys, length){
	  $.each.call(keys.split(','), function(key){
	    if(length == undefined && key in $Array)statics[key] = $Array[key];
	    else if(key in [])statics[key] = __webpack_require__(81)(Function.call, [][key], length);
	  });
	}
	setStatics('pop,reverse,shift,keys,values,entries', 1);
	setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
	setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
	           'reduce,reduceRight,copyWithin,fill,turn');
	$def($def.S, 'Array', statics);

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value));
	  } : simpleSet;
	}

	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}

	var $ = module.exports = __webpack_require__(96)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  it: function(it){
	    return it;
	  },
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  setDescs:   Object.defineProperties,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  assertDefined: assertDefined,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  mix: function(target, src){
	    for(var key in src)hide(target, key, src[key]);
	    return target;
	  },
	  each: [].forEach
	});
	/* eslint-disable no-undef */
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(62)
	  , document = $.g.document
	  , isObject = $.isObject
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(62)
	  , TAG      = __webpack_require__(75)('toStringTag')
	  , toString = {}.toString;
	function cof(it){
	  return toString.call(it).slice(8, -1);
	}
	cof.classof = function(it){
	  var O, T;
	  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
	};
	cof.set = function(it, tag, stat){
	  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
	};
	module.exports = cof;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(62)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	global.core = core;
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    if(type & $def.B && own)exp = ctx(out, global);
	    else exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
	    // extend global
	    if(target && !own){
	      if(isGlobal)target[key] = out;
	      else delete target[key] && $.hide(target, key, out);
	    }
	    // export
	    if(exports[key] != out)$.hide(exports, key, exp);
	  }
	}
	module.exports = $def;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	// Fast apply
	// http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
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
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var $   = __webpack_require__(62)
	  , ctx = __webpack_require__(81);
	module.exports = function(TYPE){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
	  return function($this, callbackfn, that){
	    var O      = Object($.assertDefined($this))
	      , self   = $.ES5Object(O)
	      , f      = ctx(callbackfn, that, 3)
	      , length = $.toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var sid = 0;
	function uid(key){
	  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
	}
	uid.safe = __webpack_require__(62).g.Symbol || uid;
	module.exports = uid;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(62);
	function assert(condition, msg1, msg2){
	  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
	}
	assert.def = $.assertDefined;
	assert.fn = function(it){
	  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
	  return it;
	};
	assert.obj = function(it){
	  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};
	assert.inst = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};
	module.exports = assert;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var $ = __webpack_require__(62);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = $.toObject($this)
	      , length = $.toLength(O.length)
	      , index  = $.toIndex(fromIndex, length)
	      , value;
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = function(regExp, replace, isStatic){
	  var replacer = replace === Object(replace) ? function(part){
	    return replace[part];
	  } : replace;
	  return function(it){
	    return String(isStatic ? it : this).replace(regExp, replacer);
	  };
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(exec){
	  try {
	    exec();
	    return false;
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(62);
	module.exports = function(object, el){
	  var O      = $.toObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(62);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getDesc    = $.getDesc
	    , getSymbols = $.getSymbols;
	  if(getSymbols)$.each.call(getSymbols(it), function(key){
	    if(getDesc(it, key).enumerable)keys.push(key);
	  });
	  return keys;
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(62).g
	  , store  = {};
	module.exports = function(name){
	  return store[name] || (store[name] =
	    global.Symbol && global.Symbol[name] || __webpack_require__(68).safe('Symbol.' + name));
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(62)
	  , enumKeys = __webpack_require__(74);
	// 19.1.2.1 Object.assign(target, source, ...)
	/* eslint-disable no-unused-vars */
	module.exports = Object.assign || function assign(target, source){
	/* eslint-enable no-unused-vars */
	  var T = Object($.assertDefined(target))
	    , l = arguments.length
	    , i = 1;
	  while(l > i){
	    var S      = $.ES5Object(arguments[i++])
	      , keys   = enumKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)T[key = keys[j++]] = S[key];
	  }
	  return T;
	};

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var $      = __webpack_require__(62)
	  , assert = __webpack_require__(69);
	function check(O, proto){
	  assert.obj(O);
	  assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
	}
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
	    ? function(buggy, set){
	        try {
	          set = __webpack_require__(81)(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
	          set({}, []);
	        } catch(e){ buggy = true; }
	        return function setPrototypeOf(O, proto){
	          check(O, proto);
	          if(buggy)O.__proto__ = proto;
	          else set(O, proto);
	          return O;
	        };
	      }()
	    : undefined),
	  check: check
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var $ = __webpack_require__(62);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String($.assertDefined(that))
	      , i = $.toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	
	var $                 = __webpack_require__(62)
	  , cof               = __webpack_require__(64)
	  , assertObject      = __webpack_require__(69).obj
	  , SYMBOL_ITERATOR   = __webpack_require__(75)('iterator')
	  , FF_ITERATOR       = '@@iterator'
	  , Iterators         = {}
	  , IteratorPrototype = {};
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	setIterator(IteratorPrototype, $.that);
	function setIterator(O, value){
	  $.hide(O, SYMBOL_ITERATOR, value);
	  // Add iterator for FF iterator protocol
	  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
	}

	module.exports = {
	  // Safari has buggy iterators w/o `next`
	  BUGGY: 'keys' in [] && !('next' in [].keys()),
	  Iterators: Iterators,
	  step: function(done, value){
	    return {value: value, done: !!done};
	  },
	  is: function(it){
	    var O      = Object(it)
	      , Symbol = $.g.Symbol
	      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
	    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
	  },
	  get: function(it){
	    var Symbol  = $.g.Symbol
	      , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
	      , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
	    return assertObject(getIter.call(it));
	  },
	  set: setIterator,
	  create: function(Constructor, NAME, next, proto){
	    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
	    cof.set(Constructor, NAME + ' Iterator');
	  }
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var $def            = __webpack_require__(65)
	  , $               = __webpack_require__(62)
	  , cof             = __webpack_require__(64)
	  , $iter           = __webpack_require__(79)
	  , SYMBOL_ITERATOR = __webpack_require__(75)('iterator')
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values'
	  , Iterators       = $iter.Iterators;
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  $iter.create(Constructor, NAME, next);
	  function createMethod(kind){
	    function $$(that){
	      return new Constructor(that, kind);
	    }
	    switch(kind){
	      case KEYS: return function keys(){ return $$(this); };
	      case VALUES: return function values(){ return $$(this); };
	    } return function entries(){ return $$(this); };
	  }
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = $.getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    cof.set(IteratorPrototype, TAG, true);
	    // FF fix
	    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
	  }
	  // Define iterator
	  if($.FW)$iter.set(proto, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = $.that;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$.hide(proto, key, methods[key]);
	    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// Optional / simple context binding
	var assertFunction = __webpack_require__(69).fn;
	module.exports = function(fn, that, length){
	  assertFunction(fn);
	  if(~length && that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var assertObject = __webpack_require__(69).obj;
	function close(iterator){
	  var ret = iterator['return'];
	  if(ret !== undefined)assertObject(ret.call(iterator));
	}
	function call(iterator, fn, value, entries){
	  try {
	    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
	  } catch(e){
	    close(iterator);
	    throw e;
	  }
	}
	call.close = close;
	module.exports = call;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var SYMBOL_ITERATOR = __webpack_require__(75)('iterator')
	  , SAFE_CLOSING    = false;
	try {
	  var riter = [7][SYMBOL_ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	module.exports = function(exec){
	  if(!SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[SYMBOL_ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.31 Array.prototype[@@unscopables]
	var $           = __webpack_require__(62)
	  , UNSCOPABLES = __webpack_require__(75)('unscopables');
	if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
	module.exports = function(key){
	  if($.FW)[][UNSCOPABLES][key] = true;
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var $       = __webpack_require__(62)
	  , SPECIES = __webpack_require__(75)('species');
	module.exports = function(C){
	  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: $.that
	  });
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var ctx  = __webpack_require__(81)
	  , get  = __webpack_require__(79).get
	  , call = __webpack_require__(82);
	module.exports = function(iterable, entries, fn, that){
	  var iterator = get(iterable)
	    , f        = ctx(fn, that, entries ? 2 : 1)
	    , step;
	  while(!(step = iterator.next()).done){
	    if(call(iterator, f, step.value, entries) === false){
	      return call.close(iterator);
	    }
	  }
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	
	var $      = __webpack_require__(62)
	  , ctx    = __webpack_require__(81)
	  , cof    = __webpack_require__(64)
	  , invoke = __webpack_require__(66)
	  , cel    = __webpack_require__(63)
	  , global             = $.g
	  , isFunction         = $.isFunction
	  , html               = $.html
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , postMessage        = global.postMessage
	  , addEventListener   = global.addEventListener
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	function run(){
	  var id = +this;
	  if($.has(queue, id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	}
	function listner(event){
	  run.call(event.data);
	}
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!isFunction(setTask) || !isFunction(clearTask)){
	  setTask = function(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(isFunction(fn) ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(cof(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Modern browsers, skip implementation for WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is object
	  } else if(addEventListener && isFunction(postMessage) && !global.importScripts){
	    defer = function(id){
	      postMessage(id, '*');
	    };
	    addEventListener('message', listner, false);
	  // WebWorkers
	  } else if(isFunction(MessageChannel)){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	
	var $        = __webpack_require__(62)
	  , ctx      = __webpack_require__(81)
	  , safe     = __webpack_require__(68).safe
	  , assert   = __webpack_require__(69)
	  , forOf    = __webpack_require__(86)
	  , step     = __webpack_require__(79).step
	  , has      = $.has
	  , set      = $.set
	  , isObject = $.isObject
	  , hide     = $.hide
	  , isFrozen = Object.isFrozen || $.core.Object.isFrozen
	  , ID       = safe('id')
	  , O1       = safe('O1')
	  , LAST     = safe('last')
	  , FIRST    = safe('first')
	  , ITER     = safe('iter')
	  , SIZE     = $.DESC ? safe('size') : 'size'
	  , id       = 0;

	function fastKey(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
	  // can't set id to frozen object
	  if(isFrozen(it))return 'F';
	  if(!has(it, ID)){
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
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

	module.exports = {
	  getConstructor: function(NAME, IS_MAP, ADDER){
	    function C(){
	      var that     = assert.inst(this, C, NAME)
	        , iterable = arguments[0];
	      set(that, O1, $.create(null));
	      set(that, SIZE, 0);
	      set(that, LAST, undefined);
	      set(that, FIRST, undefined);
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    }
	    $.mix(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
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
	      forEach: function forEach(callbackfn /*, that = undefined */){
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
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if($.DESC)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return assert.def(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
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
	  },
	  getEntry: getEntry,
	  // add .keys, .values, .entries, [@@iterator]
	  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	  setIter: function(C, NAME, IS_MAP){
	    __webpack_require__(80)(C, NAME, function(iterated, kind){
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
	        iter.o = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
	  }
	};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	
	var $     = __webpack_require__(62)
	  , $def  = __webpack_require__(65)
	  , BUGGY = __webpack_require__(79).BUGGY
	  , forOf = __webpack_require__(86)
	  , species = __webpack_require__(85)
	  , assertInstance = __webpack_require__(69).inst;

	module.exports = function(NAME, methods, common, IS_MAP, IS_WEAK){
	  var Base  = $.g[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  function fixMethod(KEY, CHAIN){
	    var method = proto[KEY];
	    if($.FW)proto[KEY] = function(a, b){
	      var result = method.call(this, a === 0 ? 0 : a, b);
	      return CHAIN ? this : result;
	    };
	  }
	  if(!$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
	    // create collection constructor
	    C = common.getConstructor(NAME, IS_MAP, ADDER);
	    $.mix(C.prototype, methods);
	  } else {
	    var inst  = new C
	      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
	      , buggyZero;
	    // wrap for init collections from iterable
	    if(!__webpack_require__(83)(function(iter){ new C(iter); })){ // eslint-disable-line no-new
	      C = function(){
	        assertInstance(this, C, NAME);
	        var that     = new Base
	          , iterable = arguments[0];
	        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      };
	      C.prototype = proto;
	      if($.FW)proto.constructor = C;
	    }
	    IS_WEAK || inst.forEach(function(val, key){
	      buggyZero = 1 / key === -Infinity;
	    });
	    // fix converting -0 key to +0
	    if(buggyZero){
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    // + fix .add & .set for chaining
	    if(buggyZero || chain !== inst)fixMethod(ADDER, true);
	  }

	  __webpack_require__(64).set(C, NAME);

	  O[NAME] = C;
	  $def($def.G + $def.W + $def.F * (C != Base), O);
	  species(C);
	  species($.core[NAME]); // for wrapper

	  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	
	var $         = __webpack_require__(62)
	  , safe      = __webpack_require__(68).safe
	  , assert    = __webpack_require__(69)
	  , forOf     = __webpack_require__(86)
	  , _has      = $.has
	  , isObject  = $.isObject
	  , hide      = $.hide
	  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
	  , id        = 0
	  , ID        = safe('id')
	  , WEAK      = safe('weak')
	  , LEAK      = safe('leak')
	  , method    = __webpack_require__(67)
	  , find      = method(5)
	  , findIndex = method(6);
	function findFrozen(store, key){
	  return find(store.array, function(it){
	    return it[0] === key;
	  });
	}
	// fallback for frozen keys
	function leakStore(that){
	  return that[LEAK] || hide(that, LEAK, {
	    array: [],
	    get: function(key){
	      var entry = findFrozen(this, key);
	      if(entry)return entry[1];
	    },
	    has: function(key){
	      return !!findFrozen(this, key);
	    },
	    set: function(key, value){
	      var entry = findFrozen(this, key);
	      if(entry)entry[1] = value;
	      else this.array.push([key, value]);
	    },
	    'delete': function(key){
	      var index = findIndex(this.array, function(it){
	        return it[0] === key;
	      });
	      if(~index)this.array.splice(index, 1);
	      return !!~index;
	    }
	  })[LEAK];
	}

	module.exports = {
	  getConstructor: function(NAME, IS_MAP, ADDER){
	    function C(){
	      $.set(assert.inst(this, C, NAME), ID, id++);
	      var iterable = arguments[0];
	      if(iterable != undefined)forOf(iterable, IS_MAP, this[ADDER], this);
	    }
	    $.mix(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function(key){
	        if(!isObject(key))return false;
	        if(isFrozen(key))return leakStore(this)['delete'](key);
	        return _has(key, WEAK) && _has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key){
	        if(!isObject(key))return false;
	        if(isFrozen(key))return leakStore(this).has(key);
	        return _has(key, WEAK) && _has(key[WEAK], this[ID]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    if(isFrozen(assert.obj(key))){
	      leakStore(that).set(key, value);
	    } else {
	      _has(key, WEAK) || hide(key, WEAK, {});
	      key[WEAK][that[ID]] = value;
	    } return that;
	  },
	  leakStore: leakStore,
	  WEAK: WEAK,
	  ID: ID
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var $            = __webpack_require__(62)
	  , assertObject = __webpack_require__(69).obj;
	module.exports = function ownKeys(it){
	  assertObject(it);
	  var keys       = $.getNames(it)
	    , getSymbols = $.getSymbols;
	  return getSymbols ? keys.concat(getSymbols(it)) : keys;
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.ecmascript.org/doku.php?id=strawman:string_padding
	var $      = __webpack_require__(62)
	  , repeat = __webpack_require__(95);

	module.exports = function(that, minLength, fillChar, left){
	  // 1. Let O be CheckObjectCoercible(this value).
	  // 2. Let S be ToString(O).
	  var S = String($.assertDefined(that));
	  // 4. If intMinLength is undefined, return S.
	  if(minLength === undefined)return S;
	  // 4. Let intMinLength be ToInteger(minLength).
	  var intMinLength = $.toInteger(minLength);
	  // 5. Let fillLen be the number of characters in S minus intMinLength.
	  var fillLen = intMinLength - S.length;
	  // 6. If fillLen < 0, then throw a RangeError exception.
	  // 7. If fillLen is +∞, then throw a RangeError exception.
	  if(fillLen < 0 || fillLen === Infinity){
	    throw new RangeError('Cannot satisfy string length ' + minLength + ' for string: ' + S);
	  }
	  // 8. Let sFillStr be the string represented by fillStr.
	  // 9. If sFillStr is undefined, let sFillStr be a space character.
	  var sFillStr = fillChar === undefined ? ' ' : String(fillChar);
	  // 10. Let sFillVal be a String made of sFillStr, repeated until fillLen is met.
	  var sFillVal = repeat.call(sFillStr, Math.ceil(fillLen / sFillStr.length));
	  // truncate if we overflowed
	  if(sFillVal.length > fillLen)sFillVal = left
	    ? sFillVal.slice(sFillVal.length - fillLen)
	    : sFillVal.slice(0, fillLen);
	  // 11. Return a string made from sFillVal, followed by S.
	  // 11. Return a String made from S, followed by sFillVal.
	  return left ? sFillVal.concat(S) : S.concat(sFillVal);
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $def  = __webpack_require__(65)
	  , forOf = __webpack_require__(86);
	module.exports = function(NAME){
	  $def($def.P, NAME, {
	    toJSON: function toJSON(){
	      var arr = [];
	      forOf(this, false, arr.push, arr);
	      return arr;
	    }
	  });
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	
	var $      = __webpack_require__(62)
	  , invoke = __webpack_require__(66)
	  , assertFunction = __webpack_require__(69).fn;
	module.exports = function(/* ...pargs */){
	  var fn     = assertFunction(this)
	    , length = arguments.length
	    , pargs  = Array(length)
	    , i      = 0
	    , _      = $.path._
	    , holder = false;
	  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
	  return function(/* ...args */){
	    var that    = this
	      , _length = arguments.length
	      , j = 0, k = 0, args;
	    if(!holder && !_length)return invoke(fn, pargs, that);
	    args = pargs.slice();
	    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
	    while(_length > k)args.push(arguments[k++]);
	    return invoke(fn, args, that);
	  };
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	
	var $ = __webpack_require__(62);

	module.exports = function repeat(count){
	  var str = String($.assertDefined(this))
	    , res = ''
	    , n   = $.toInteger(count);
	  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	  return res;
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function($){
	  $.FW   = true;
	  $.path = $.g;
	  return $;
	};

/***/ }
/******/ ]);
// CommonJS export
if(typeof module != 'undefined' && module.exports)module.exports = __e;
// RequireJS export
else if(typeof define == 'function' && define.amd)define('core-js/core',[],function(){return __e});
// Export to global object
else __g.core = __e;
}();
define('core-js', ['core-js/core'], function (main) { return main; });

define('aurelia-loader/loader',['exports', 'core-js', './template-registry-entry'], function (exports, _coreJs, _templateRegistryEntry) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var hasTemplateElement = ('content' in document.createElement('template'));

  function importElements(frag, link, callback) {
    document.head.appendChild(frag);

    if (window.Polymer && Polymer.whenReady) {
      Polymer.whenReady(callback);
    } else {
      link.addEventListener('load', callback);
    }
  }

  var Loader = (function () {
    function Loader() {
      _classCallCheck(this, Loader);

      this.templateRegistry = {};
    }

    Loader.prototype.loadModule = function loadModule(id) {
      throw new Error('Loaders must implement loadModule(id).');
    };

    Loader.prototype.loadAllModules = function loadAllModules(ids) {
      throw new Error('Loader must implement loadAllModules(ids).');
    };

    Loader.prototype.loadTemplate = function loadTemplate(url) {
      throw new Error('Loader must implement loadTemplate(url).');
    };

    Loader.prototype.loadText = function loadText(url) {
      throw new Error('Loader must implement loadText(url).');
    };

    Loader.prototype.getOrCreateTemplateRegistryEntry = function getOrCreateTemplateRegistryEntry(id) {
      var entry = this.templateRegistry[id];

      if (entry === undefined) {
        this.templateRegistry[id] = entry = new _templateRegistryEntry.TemplateRegistryEntry(id);
      }

      return entry;
    };

    Loader.prototype.importDocument = function importDocument(url) {
      return new Promise(function (resolve, reject) {
        var frag = document.createDocumentFragment();
        var link = document.createElement('link');

        link.rel = 'import';
        link.href = url;
        frag.appendChild(link);

        importElements(frag, link, function () {
          return resolve(link['import']);
        });
      });
    };

    Loader.prototype.importTemplate = function importTemplate(url) {
      var _this = this;

      return this.importDocument(url).then(function (doc) {
        return _this.findTemplate(doc, url);
      });
    };

    Loader.prototype.findTemplate = function findTemplate(doc, url) {
      if (!hasTemplateElement) {
        HTMLTemplateElement.bootstrap(doc);
      }

      var template = doc.getElementsByTagName('template')[0];

      if (!template) {
        throw new Error('There was no template element found in \'' + url + '\'.');
      }

      return template;
    };

    return Loader;
  })();

  exports.Loader = Loader;
});
define('aurelia-loader/index',['exports', './template-registry-entry', './loader'], function (exports, _templateRegistryEntry, _loader) {
  

  exports.__esModule = true;
  exports.TemplateRegistryEntry = _templateRegistryEntry.TemplateRegistryEntry;
  exports.TemplateDependency = _templateRegistryEntry.TemplateDependency;
  exports.Loader = _loader.Loader;
});
define('aurelia-loader', ['aurelia-loader/index'], function (main) { return main; });

define('aurelia-metadata/origin',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var originStorage = new Map(),
      unknownOrigin = Object.freeze({ moduleId: undefined, moduleMember: undefined });

  function ensureType(value) {
    if (value instanceof Origin) {
      return value;
    }

    return new Origin(value);
  }

  var Origin = (function () {
    function Origin(moduleId, moduleMember) {
      _classCallCheck(this, Origin);

      this.moduleId = moduleId;
      this.moduleMember = moduleMember;
    }

    Origin.get = function get(fn) {
      var origin = originStorage.get(fn);

      if (origin !== undefined) {
        return origin;
      }

      if (typeof fn.origin === 'function') {
        originStorage.set(fn, origin = ensureType(fn.origin()));
      } else if (fn.origin !== undefined) {
        originStorage.set(fn, origin = ensureType(fn.origin));
      }

      return origin || unknownOrigin;
    };

    Origin.set = function set(fn, origin) {
      if (Origin.get(fn) === unknownOrigin) {
        originStorage.set(fn, origin);
      }
    };

    return Origin;
  })();

  exports.Origin = Origin;
});
define('aurelia-metadata/reflect-metadata',["exports", "core-js"], function (exports, _coreJs) {
    

    function _interopRequire(obj) { return obj && obj.__esModule ? obj["default"] : obj; }

    var _core = _interopRequire(_coreJs);

    var functionPrototype = Object.getPrototypeOf(Function);
    var _Map = Map;
    var _Set = Set;
    var _WeakMap = WeakMap;

    var __Metadata__ = new _WeakMap();

    function decorate(decorators, target, targetKey, targetDescriptor) {
        if (!IsUndefined(targetDescriptor)) {
            if (!IsArray(decorators)) {
                throw new TypeError();
            } else if (!IsObject(target)) {
                throw new TypeError();
            } else if (IsUndefined(targetKey)) {
                throw new TypeError();
            } else if (!IsObject(targetDescriptor)) {
                throw new TypeError();
            }
            targetKey = ToPropertyKey(targetKey);
            return DecoratePropertyWithDescriptor(decorators, target, targetKey, targetDescriptor);
        } else if (!IsUndefined(targetKey)) {
            if (!IsArray(decorators)) {
                throw new TypeError();
            } else if (!IsObject(target)) {
                throw new TypeError();
            }
            targetKey = ToPropertyKey(targetKey);
            return DecoratePropertyWithoutDescriptor(decorators, target, targetKey);
        } else {
            if (!IsArray(decorators)) {
                throw new TypeError();
            } else if (!IsConstructor(target)) {
                throw new TypeError();
            }
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;

    function metadata(metadataKey, metadataValue) {
        function decorator(target, targetKey) {
            if (!IsUndefined(targetKey)) {
                if (!IsObject(target)) {
                    throw new TypeError();
                }
                targetKey = ToPropertyKey(targetKey);
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
            } else {
                if (!IsConstructor(target)) {
                    throw new TypeError();
                }
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, undefined);
            }
        }
        return decorator;
    }
    Reflect.metadata = metadata;

    function defineMetadata(metadataKey, metadataValue, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, targetKey);
    }
    Reflect.defineMetadata = defineMetadata;

    function hasMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryHasMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasMetadata = hasMetadata;

    function hasOwnMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryHasOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;

    function getMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryGetMetadata(metadataKey, target, targetKey);
    }
    Reflect.getMetadata = getMetadata;

    function getOwnMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryGetOwnMetadata(metadataKey, target, targetKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;

    function getMetadataKeys(target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryMetadataKeys(target, targetKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;

    function getOwnMetadataKeys(target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }
        return OrdinaryOwnMetadataKeys(target, targetKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;

    function deleteMetadata(metadataKey, target, targetKey) {
        if (!IsObject(target)) {
            throw new TypeError();
        } else if (!IsUndefined(targetKey)) {
            targetKey = ToPropertyKey(targetKey);
        }

        var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
        if (IsUndefined(metadataMap)) {
            return false;
        }
        if (!metadataMap["delete"](metadataKey)) {
            return false;
        }
        if (metadataMap.size > 0) {
            return true;
        }
        var targetMetadata = __Metadata__.get(target);
        targetMetadata["delete"](targetKey);
        if (targetMetadata.size > 0) {
            return true;
        }
        __Metadata__["delete"](target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;

    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated)) {
                if (!IsConstructor(decorated)) {
                    throw new TypeError();
                }
                target = decorated;
            }
        }
        return target;
    }
    function DecoratePropertyWithDescriptor(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated)) {
                if (!IsObject(decorated)) {
                    throw new TypeError();
                }
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function DecoratePropertyWithoutDescriptor(decorators, target, propertyKey) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            decorator(target, propertyKey);
        }
    }

    function GetOrCreateMetadataMap(target, targetKey, create) {
        var targetMetadata = __Metadata__.get(target);
        if (!targetMetadata) {
            if (!create) {
                return undefined;
            }
            targetMetadata = new _Map();
            __Metadata__.set(target, targetMetadata);
        }
        var keyMetadata = targetMetadata.get(targetKey);
        if (!keyMetadata) {
            if (!create) {
                return undefined;
            }
            keyMetadata = new _Map();
            targetMetadata.set(targetKey, keyMetadata);
        }
        return keyMetadata;
    }

    function OrdinaryHasMetadata(_x, _x2, _x3) {
        var _again = true;

        _function: while (_again) {
            hasOwn = parent = undefined;
            _again = false;
            var MetadataKey = _x,
                O = _x2,
                P = _x3;

            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn) {
                return true;
            }
            var parent = GetPrototypeOf(O);
            if (parent !== null) {
                _x = MetadataKey;
                _x2 = parent;
                _x3 = P;
                _again = true;
                continue _function;
            }
            return false;
        }
    }

    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (metadataMap === undefined) {
            return false;
        }
        return Boolean(metadataMap.has(MetadataKey));
    }

    function OrdinaryGetMetadata(_x4, _x5, _x6) {
        var _again2 = true;

        _function2: while (_again2) {
            hasOwn = parent = undefined;
            _again2 = false;
            var MetadataKey = _x4,
                O = _x5,
                P = _x6;

            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn) {
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            }
            var parent = GetPrototypeOf(O);
            if (parent !== null) {
                _x4 = MetadataKey;
                _x5 = parent;
                _x6 = P;
                _again2 = true;
                continue _function2;
            }
            return undefined;
        }
    }

    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, false);
        if (metadataMap === undefined) {
            return undefined;
        }
        return metadataMap.get(MetadataKey);
    }

    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, true);
        metadataMap.set(MetadataKey, MetadataValue);
    }

    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = GetPrototypeOf(O);
        if (parent === null) {
            return ownKeys;
        }
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0) {
            return ownKeys;
        }
        if (ownKeys.length <= 0) {
            return parentKeys;
        }
        var set = new _Set();
        var keys = [];
        for (var _i = 0; _i < ownKeys.length; _i++) {
            var key = ownKeys[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0; _a < parentKeys.length; _a++) {
            var key = parentKeys[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }

    function OrdinaryOwnMetadataKeys(target, targetKey) {
        var metadataMap = GetOrCreateMetadataMap(target, targetKey, false);
        var keys = [];
        if (metadataMap) {
            metadataMap.forEach(function (_, key) {
                return keys.push(key);
            });
        }
        return keys;
    }

    function IsUndefined(x) {
        return x === undefined;
    }

    function IsArray(x) {
        return Array.isArray(x);
    }

    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }

    function IsConstructor(x) {
        return typeof x === "function";
    }

    function IsSymbol(x) {
        return typeof x === "symbol";
    }

    function ToPropertyKey(value) {
        if (IsSymbol(value)) {
            return value;
        }
        return String(value);
    }
    function GetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype) {
            return proto;
        }

        if (proto !== functionPrototype) {
            return proto;
        }

        var prototype = O.prototype;
        var prototypeProto = Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype) {
            return proto;
        }

        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function") {
            return proto;
        }

        if (constructor === O) {
            return proto;
        }

        return constructor;
    }
});
define('aurelia-metadata/metadata',['exports', './reflect-metadata'], function (exports, _reflectMetadata) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _meta = _interopRequire(_reflectMetadata);

  function ensureDecorators(target) {
    var applicator;

    if (typeof target.decorators === 'function') {
      applicator = target.decorators();
    } else {
      applicator = target.decorators;
    }

    if (typeof applicator._decorate === 'function') {
      delete target.decorators;
      applicator._decorate(target);
    } else {
      throw new Error('The return value of your decorator\'s method was not valid.');
    }
  }

  var Metadata = {
    resource: 'aurelia:resource',
    paramTypes: 'design:paramtypes',
    properties: 'design:properties',
    get: function get(metadataKey, target, propertyKey) {
      if (!target) {
        return undefined;
      }

      var result = Metadata.getOwn(metadataKey, target, propertyKey);
      return result === undefined ? Metadata.get(metadataKey, Object.getPrototypeOf(target), propertyKey) : result;
    },
    getOwn: function getOwn(metadataKey, target, propertyKey) {
      if (!target) {
        return undefined;
      }

      if (target.hasOwnProperty('decorators')) {
        ensureDecorators(target);
      }

      return Reflect.getOwnMetadata(metadataKey, target, propertyKey);
    },
    getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, propertyKey) {
      var result = Metadata.getOwn(metadataKey, target, propertyKey);

      if (result === undefined) {
        result = new Type();
        Reflect.defineMetadata(metadataKey, result, target, propertyKey);
      }

      return result;
    }
  };
  exports.Metadata = Metadata;
});
define('aurelia-metadata/decorator-applicator',['exports', './metadata'], function (exports, _metadata) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var DecoratorApplicator = (function () {
    function DecoratorApplicator() {
      _classCallCheck(this, DecoratorApplicator);

      this._first = null;
      this._second = null;
      this._third = null;
      this._rest = null;
    }

    DecoratorApplicator.prototype.decorator = function decorator(decorator) {
      if (this._first === null) {
        this._first = decorator;
        return this;
      }

      if (this._second === null) {
        this._second = decorator;
        return this;
      }

      if (this._third === null) {
        this._third = decorator;
        return this;
      }

      if (this._rest === null) {
        this._rest = [];
      }

      this._rest.push(decorator);

      return this;
    };

    DecoratorApplicator.prototype._decorate = function _decorate(target) {
      var i, ii, rest;

      if (this._first !== null) {
        this._first(target);
      }

      if (this._second !== null) {
        this._second(target);
      }

      if (this._third !== null) {
        this._third(target);
      }

      rest = this._rest;
      if (rest !== null) {
        for (i = 0, ii = rest.length; i < ii; ++i) {
          rest[i](target);
        }
      }
    };

    return DecoratorApplicator;
  })();

  exports.DecoratorApplicator = DecoratorApplicator;
});
define('aurelia-metadata/decorators',['exports', './decorator-applicator'], function (exports, _decoratorApplicator) {
  

  exports.__esModule = true;
  var Decorators = {
    configure: {
      parameterizedDecorator: function parameterizedDecorator(name, decorator) {
        Decorators[name] = function () {
          var applicator = new _decoratorApplicator.DecoratorApplicator();
          return applicator[name].apply(applicator, arguments);
        };

        _decoratorApplicator.DecoratorApplicator.prototype[name] = function () {
          var result = decorator.apply(null, arguments);
          return this.decorator(result);
        };
      },
      simpleDecorator: function simpleDecorator(name, decorator) {
        Decorators[name] = function () {
          return new _decoratorApplicator.DecoratorApplicator().decorator(decorator);
        };

        _decoratorApplicator.DecoratorApplicator.prototype[name] = function () {
          return this.decorator(decorator);
        };
      }
    }
  };
  exports.Decorators = Decorators;
});
define('aurelia-metadata/index',['exports', './origin', './metadata', './decorators'], function (exports, _origin, _metadata, _decorators) {
  

  exports.__esModule = true;
  exports.Origin = _origin.Origin;
  exports.Metadata = _metadata.Metadata;
  exports.Decorators = _decorators.Decorators;
});
define('aurelia-metadata', ['aurelia-metadata/index'], function (main) { return main; });

define('aurelia-loader-default',['exports', 'aurelia-metadata', 'aurelia-loader'], function (exports, _aureliaMetadata, _aureliaLoader) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var polyfilled = false;

  if (!window.System || !window.System['import']) {
    var sys = window.System = window.System || {};

    sys.polyfilled = polyfilled = true;
    sys.map = {};

    sys['import'] = function (moduleId) {
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
      target = target['default'];
    }

    _aureliaMetadata.Origin.set(target, new _aureliaMetadata.Origin(name, 'default'));

    for (key in target) {
      exportedValue = target[key];

      if (typeof exportedValue === 'function') {
        _aureliaMetadata.Origin.set(exportedValue, new _aureliaMetadata.Origin(name, key));
      }
    }

    return executed;
  }

  var DefaultLoader = (function (_Loader) {
    function DefaultLoader() {
      _classCallCheck(this, DefaultLoader);

      _Loader.call(this);

      this.moduleRegistry = {};
      var that = this;

      if (polyfilled) {
        define('view', [], {
          'load': function load(name, req, onload, config) {
            var entry = that.getOrCreateTemplateRegistryEntry(name),
                address;

            if (entry.templateIsLoaded) {
              onload(entry);
              return;
            }

            address = req.toUrl(name);

            that.importTemplate(address).then(function (template) {
              entry.setTemplate(template);
              onload(entry);
            });
          }
        });
      } else {
        System.set('view', System.newModule({
          'fetch': function fetch(load, _fetch) {
            var id = load.name.substring(0, load.name.indexOf('!'));
            var entry = load.metadata.templateRegistryEntry = that.getOrCreateTemplateRegistryEntry(id);

            if (entry.templateIsLoaded) {
              return '';
            }

            return that.importTemplate(load.address).then(function (template) {
              entry.setTemplate(template);
              return '';
            });
          },
          'instantiate': function instantiate(load) {
            return load.metadata.templateRegistryEntry;
          }
        }));
      }
    }

    _inherits(DefaultLoader, _Loader);

    DefaultLoader.prototype.loadModule = function loadModule(id) {
      var _this = this;

      return System.normalize(id).then(function (newId) {
        var existing = _this.moduleRegistry[newId];
        if (existing) {
          return existing;
        }

        return System['import'](newId).then(function (m) {
          _this.moduleRegistry[newId] = m;
          return ensureOriginOnExports(m, newId);
        });
      });
    };

    DefaultLoader.prototype.loadAllModules = function loadAllModules(ids) {
      var loads = [];

      for (var i = 0, ii = ids.length; i < ii; ++i) {
        loads.push(this.loadModule(ids[i]));
      }

      return Promise.all(loads);
    };

    DefaultLoader.prototype.loadTemplate = function loadTemplate(url) {
      return polyfilled ? System['import']('view!' + url) : System['import'](url + '!view');
    };

    DefaultLoader.prototype.loadText = function loadText(url) {
      return polyfilled ? System['import']('text!' + url) : System['import'](url + '!text');
    };

    return DefaultLoader;
  })(_aureliaLoader.Loader);

  exports.DefaultLoader = DefaultLoader;

  window.AureliaLoader = DefaultLoader;
});
define('aurelia-task-queue',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BrowserMutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var hasSetImmediate = typeof setImmediate === 'function';

  function makeRequestFlushFromMutationObserver(flush) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, { characterData: true });
    return function requestFlush() {
      toggle = -toggle;
      node.data = toggle;
    };
  }

  function makeRequestFlushFromTimer(flush) {
    return function requestFlush() {
      var timeoutHandle = setTimeout(handleFlushTimer, 0);

      var intervalHandle = setInterval(handleFlushTimer, 50);
      function handleFlushTimer() {
        clearTimeout(timeoutHandle);
        clearInterval(intervalHandle);
        flush();
      }
    };
  }

  var TaskQueue = (function () {
    function TaskQueue() {
      var _this = this;

      _classCallCheck(this, TaskQueue);

      this.microTaskQueue = [];
      this.microTaskQueueCapacity = 1024;
      this.taskQueue = [];

      if (typeof BrowserMutationObserver === 'function') {
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

    TaskQueue.prototype.queueMicroTask = function queueMicroTask(task) {
      if (this.microTaskQueue.length < 1) {
        this.requestFlushMicroTaskQueue();
      }

      this.microTaskQueue.push(task);
    };

    TaskQueue.prototype.queueTask = function queueTask(task) {
      if (this.taskQueue.length < 1) {
        this.requestFlushTaskQueue();
      }

      this.taskQueue.push(task);
    };

    TaskQueue.prototype.flushTaskQueue = function flushTaskQueue() {
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
    };

    TaskQueue.prototype.flushMicroTaskQueue = function flushMicroTaskQueue() {
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
    };

    TaskQueue.prototype.onError = function onError(error, task) {
      if ('onError' in task) {
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
    };

    return TaskQueue;
  })();

  exports.TaskQueue = TaskQueue;
});
define('aurelia-logging',['exports'], function (exports) {
  

  exports.__esModule = true;
  exports.AggregateError = AggregateError;
  exports.getLogger = getLogger;
  exports.addAppender = addAppender;
  exports.setLevel = setLevel;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function AggregateError(msg, inner, skipIfAlreadyAggregate) {
    if (inner) {
      if (inner.innerError && skipIfAlreadyAggregate) {
        return inner;
      }

      if (inner.stack) {
        msg += '\n------------------------------------------------\ninner error: ' + inner.stack;
      }
    }

    var err = new Error(msg);
    if (inner) {
      err.innerError = inner;
    }

    return err;
  }

  var logLevel = {
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  };

  exports.logLevel = logLevel;
  var loggers = {},
      currentLevel = logLevel.none,
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
    if (currentLevel < 4) {
      return;
    }

    log(this, 'debug', arguments);
  }

  function info() {
    if (currentLevel < 3) {
      return;
    }

    log(this, 'info', arguments);
  }

  function warn() {
    if (currentLevel < 2) {
      return;
    }

    log(this, 'warn', arguments);
  }

  function error() {
    if (currentLevel < 1) {
      return;
    }

    log(this, 'error', arguments);
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
    currentLevel = level;
  }

  var Logger = (function () {
    function Logger(id, key) {
      _classCallCheck(this, Logger);

      if (key !== loggerConstructionKey) {
        throw new Error('You cannot instantiate "Logger". Use the "getLogger" API instead.');
      }

      this.id = id;
    }

    Logger.prototype.debug = function debug() {};

    Logger.prototype.info = function info() {};

    Logger.prototype.warn = function warn() {};

    Logger.prototype.error = function error() {};

    return Logger;
  })();

  exports.Logger = Logger;
});
define('aurelia-logging-console',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  (function (global) {
    
    global.console = global.console || {};
    var con = global.console;
    var prop, method;
    var empty = {};
    var dummy = function dummy() {};
    var properties = 'memory'.split(',');
    var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' + 'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' + 'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
    while (prop = properties.pop()) if (!con[prop]) con[prop] = empty;
    while (method = methods.pop()) if (!con[method]) con[method] = dummy;
  })(typeof window === 'undefined' ? undefined : window);

  if (Function.prototype.bind && window.console && typeof console.log == 'object') {
    ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'].forEach(function (method) {
      console[method] = this.bind(console[method], console);
    }, Function.prototype.call);
  }

  var ConsoleAppender = (function () {
    function ConsoleAppender() {
      _classCallCheck(this, ConsoleAppender);
    }

    ConsoleAppender.prototype.debug = function debug(logger, message) {
      for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        rest[_key - 2] = arguments[_key];
      }

      console.debug.apply(console, ['DEBUG [' + logger.id + '] ' + message].concat(rest));
    };

    ConsoleAppender.prototype.info = function info(logger, message) {
      for (var _len2 = arguments.length, rest = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        rest[_key2 - 2] = arguments[_key2];
      }

      console.info.apply(console, ['INFO [' + logger.id + '] ' + message].concat(rest));
    };

    ConsoleAppender.prototype.warn = function warn(logger, message) {
      for (var _len3 = arguments.length, rest = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        rest[_key3 - 2] = arguments[_key3];
      }

      console.warn.apply(console, ['WARN [' + logger.id + '] ' + message].concat(rest));
    };

    ConsoleAppender.prototype.error = function error(logger, message) {
      for (var _len4 = arguments.length, rest = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        rest[_key4 - 2] = arguments[_key4];
      }

      console.error.apply(console, ['ERROR [' + logger.id + '] ' + message].concat(rest));
    };

    return ConsoleAppender;
  })();

  exports.ConsoleAppender = ConsoleAppender;
});
define('aurelia-history',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var History = (function () {
    function History() {
      _classCallCheck(this, History);
    }

    History.prototype.activate = function activate() {
      throw new Error('History must implement activate().');
    };

    History.prototype.deactivate = function deactivate() {
      throw new Error('History must implement deactivate().');
    };

    History.prototype.navigate = function navigate() {
      throw new Error('History must implement navigate().');
    };

    History.prototype.navigateBack = function navigateBack() {
      throw new Error('History must implement navigateBack().');
    };

    return History;
  })();

  exports.History = History;
});
define('aurelia-history-browser',['exports', 'core-js', 'aurelia-history'], function (exports, _coreJs, _aureliaHistory) {
  

  exports.__esModule = true;
  exports.configure = configure;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _core = _interopRequire(_coreJs);

  var routeStripper = /^[#\/]|\s+$/g;

  var rootStripper = /^\/+|\/+$/g;

  var isExplorer = /msie [\w.]+/;

  var trailingSlash = /\/$/;

  function updateHash(location, fragment, replace) {
    if (replace) {
      var href = location.href.replace(/(javascript:|#).*$/, '');
      location.replace(href + '#' + fragment);
    } else {
      location.hash = '#' + fragment;
    }
  }

  var BrowserHistory = (function (_History) {
    function BrowserHistory() {
      _classCallCheck(this, BrowserHistory);

      _History.call(this);

      this.interval = 50;
      this.active = false;
      this.previousFragment = '';
      this._checkUrlCallback = this.checkUrl.bind(this);

      if (typeof window !== 'undefined') {
        this.location = window.location;
        this.history = window.history;
      }
    }

    _inherits(BrowserHistory, _History);

    BrowserHistory.prototype.getHash = function getHash(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    };

    BrowserHistory.prototype.getFragment = function getFragment(fragment, forcePushState) {
      var root;

      if (!fragment) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = this.location.pathname + this.location.search;
          root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) {
            fragment = fragment.substr(root.length);
          }
        } else {
          fragment = this.getHash();
        }
      }

      return fragment.replace(routeStripper, '');
    };

    BrowserHistory.prototype.activate = function activate(options) {
      if (this.active) {
        throw new Error('History has already been activated.');
      }

      this.active = true;

      this.options = Object.assign({}, { root: '/' }, this.options, options);
      this.root = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState = !!this.options.pushState;
      this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);

      var fragment = this.getFragment();

      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (this._hasPushState) {
        window.onpopstate = this._checkUrlCallback;
      } else if (this._wantsHashChange && 'onhashchange' in window) {
        window.addEventListener('hashchange', this._checkUrlCallback);
      } else if (this._wantsHashChange) {
        this._checkUrlTimer = setTimeout(this._checkUrlCallback, this.interval);
      }

      this.fragment = fragment;

      var loc = this.location;
      var atRoot = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

      if (this._wantsHashChange && this._wantsPushState) {
        if (!this._hasPushState && !atRoot) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + this.location.search + '#' + this.fragment);

          return true;
        } else if (this._hasPushState && atRoot && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment + loc.search);
        }
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    };

    BrowserHistory.prototype.deactivate = function deactivate() {
      window.onpopstate = null;
      window.removeEventListener('hashchange', this._checkUrlCallback);
      clearTimeout(this._checkUrlTimer);
      this.active = false;
    };

    BrowserHistory.prototype.checkUrl = function checkUrl() {
      var current = this.getFragment();

      if (this._checkUrlTimer) {
        clearTimeout(this._checkUrlTimer);
        this._checkUrlTimer = setTimeout(this._checkUrlCallback, this.interval);
      }

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
    };

    BrowserHistory.prototype.loadUrl = function loadUrl(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);

      return this.options.routeHandler ? this.options.routeHandler(fragment) : false;
    };

    BrowserHistory.prototype.navigate = function navigate(fragment, options) {
      if (fragment && fragment.indexOf('://') != -1) {
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
      } else if (typeof options === 'boolean') {
        options = {
          trigger: options
        };
      }

      fragment = this.getFragment(fragment || '');

      if (this.fragment === fragment) {
        return;
      }

      this.fragment = fragment;

      var url = this.root + fragment;

      if (fragment === '' && url !== '/') {
        url = url.slice(0, -1);
      }

      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
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
    };

    BrowserHistory.prototype.navigateBack = function navigateBack() {
      this.history.back();
    };

    return BrowserHistory;
  })(_aureliaHistory.History);

  exports.BrowserHistory = BrowserHistory;

  function configure(aurelia) {
    aurelia.withSingleton(_aureliaHistory.History, BrowserHistory);
  }
});
define('aurelia-event-aggregator',['exports'], function (exports) {
  

  exports.__esModule = true;
  exports.includeEventsIn = includeEventsIn;
  exports.configure = configure;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Handler = (function () {
    function Handler(messageType, callback) {
      _classCallCheck(this, Handler);

      this.messageType = messageType;
      this.callback = callback;
    }

    Handler.prototype.handle = function handle(message) {
      if (message instanceof this.messageType) {
        this.callback.call(null, message);
      }
    };

    return Handler;
  })();

  var EventAggregator = (function () {
    function EventAggregator() {
      _classCallCheck(this, EventAggregator);

      this.eventLookup = {};
      this.messageHandlers = [];
    }

    EventAggregator.prototype.publish = function publish(event, data) {
      var subscribers, i;

      if (typeof event === 'string') {
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
    };

    EventAggregator.prototype.subscribe = function subscribe(event, callback) {
      var subscribers, handler;

      if (typeof event === 'string') {
        subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);

        subscribers.push(callback);

        return function () {
          var idx = subscribers.indexOf(callback);
          if (idx != -1) {
            subscribers.splice(idx, 1);
          }
        };
      } else {
        handler = new Handler(event, callback);
        subscribers = this.messageHandlers;

        subscribers.push(handler);

        return function () {
          var idx = subscribers.indexOf(handler);
          if (idx != -1) {
            subscribers.splice(idx, 1);
          }
        };
      }
    };

    EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
      var sub = this.subscribe(event, function (data, event) {
        sub();
        return callback(data, event);
      });
      return sub;
    };

    return EventAggregator;
  })();

  exports.EventAggregator = EventAggregator;

  function includeEventsIn(obj) {
    var ea = new EventAggregator();

    obj.subscribeOnce = function (event, callback) {
      return ea.subscribeOnce(event, callback);
    };

    obj.subscribe = function (event, callback) {
      return ea.subscribe(event, callback);
    };

    obj.publish = function (event, data) {
      ea.publish(event, data);
    };

    return ea;
  }

  function configure(aurelia) {
    aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
  }
});
define('aurelia-dependency-injection/metadata',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var TransientRegistration = (function () {
    function TransientRegistration(key) {
      _classCallCheck(this, TransientRegistration);

      this.key = key;
    }

    TransientRegistration.prototype.register = function register(container, key, fn) {
      container.registerTransient(this.key || key, fn);
    };

    return TransientRegistration;
  })();

  exports.TransientRegistration = TransientRegistration;

  var SingletonRegistration = (function () {
    function SingletonRegistration(keyOrRegisterInChild) {
      var registerInChild = arguments[1] === undefined ? false : arguments[1];

      _classCallCheck(this, SingletonRegistration);

      if (typeof keyOrRegisterInChild === 'boolean') {
        this.registerInChild = keyOrRegisterInChild;
      } else {
        this.key = keyOrRegisterInChild;
        this.registerInChild = registerInChild;
      }
    }

    SingletonRegistration.prototype.register = function register(container, key, fn) {
      var destination = this.registerInChild ? container : container.root;
      destination.registerSingleton(this.key || key, fn);
    };

    return SingletonRegistration;
  })();

  exports.SingletonRegistration = SingletonRegistration;

  var Resolver = (function () {
    function Resolver() {
      _classCallCheck(this, Resolver);
    }

    Resolver.prototype.get = function get(container) {
      throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
    };

    return Resolver;
  })();

  exports.Resolver = Resolver;

  var Lazy = (function (_Resolver) {
    function Lazy(key) {
      _classCallCheck(this, Lazy);

      _Resolver.call(this);
      this.key = key;
    }

    _inherits(Lazy, _Resolver);

    Lazy.prototype.get = function get(container) {
      var _this = this;

      return function () {
        return container.get(_this.key);
      };
    };

    Lazy.of = function of(key) {
      return new Lazy(key);
    };

    return Lazy;
  })(Resolver);

  exports.Lazy = Lazy;

  var All = (function (_Resolver2) {
    function All(key) {
      _classCallCheck(this, All);

      _Resolver2.call(this);
      this.key = key;
    }

    _inherits(All, _Resolver2);

    All.prototype.get = function get(container) {
      return container.getAll(this.key);
    };

    All.of = function of(key) {
      return new All(key);
    };

    return All;
  })(Resolver);

  exports.All = All;

  var Optional = (function (_Resolver3) {
    function Optional(key) {
      var checkParent = arguments[1] === undefined ? false : arguments[1];

      _classCallCheck(this, Optional);

      _Resolver3.call(this);
      this.key = key;
      this.checkParent = checkParent;
    }

    _inherits(Optional, _Resolver3);

    Optional.prototype.get = function get(container) {
      if (container.hasHandler(this.key, this.checkParent)) {
        return container.get(this.key);
      }

      return null;
    };

    Optional.of = function of(key) {
      var checkParent = arguments[1] === undefined ? false : arguments[1];

      return new Optional(key, checkParent);
    };

    return Optional;
  })(Resolver);

  exports.Optional = Optional;

  var Parent = (function (_Resolver4) {
    function Parent(key) {
      _classCallCheck(this, Parent);

      _Resolver4.call(this);
      this.key = key;
    }

    _inherits(Parent, _Resolver4);

    Parent.prototype.get = function get(container) {
      return container.parent ? container.parent.get(this.key) : null;
    };

    Parent.of = function of(key) {
      return new Parent(key);
    };

    return Parent;
  })(Resolver);

  exports.Parent = Parent;

  var ClassActivator = (function () {
    function ClassActivator() {
      _classCallCheck(this, ClassActivator);
    }

    ClassActivator.prototype.invoke = function invoke(fn, args) {
      return Reflect.construct(fn, args);
    };

    _createClass(ClassActivator, null, [{
      key: 'instance',
      value: new ClassActivator(),
      enumerable: true
    }]);

    return ClassActivator;
  })();

  exports.ClassActivator = ClassActivator;

  var FactoryActivator = (function () {
    function FactoryActivator() {
      _classCallCheck(this, FactoryActivator);
    }

    FactoryActivator.prototype.invoke = function invoke(fn, args) {
      return fn.apply(undefined, args);
    };

    _createClass(FactoryActivator, null, [{
      key: 'instance',
      value: new FactoryActivator(),
      enumerable: true
    }]);

    return FactoryActivator;
  })();

  exports.FactoryActivator = FactoryActivator;
});
define('aurelia-dependency-injection/container',['exports', 'core-js', 'aurelia-metadata', 'aurelia-logging', './metadata'], function (exports, _coreJs, _aureliaMetadata, _aureliaLogging, _metadata) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  _aureliaMetadata.Metadata.registration = 'aurelia:registration';
  _aureliaMetadata.Metadata.instanceActivator = 'aurelia:instance-activator';

  function test() {}
  if (!test.name) {
    Object.defineProperty(Function.prototype, 'name', {
      get: function get() {
        var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];

        Object.defineProperty(this, 'name', { value: name });
        return name;
      }
    });
  }

  var emptyParameters = Object.freeze([]);

  exports.emptyParameters = emptyParameters;

  var Container = (function () {
    function Container(constructionInfo) {
      _classCallCheck(this, Container);

      this.constructionInfo = constructionInfo || new Map();
      this.entries = new Map();
      this.root = this;
    }

    Container.prototype.addParameterInfoLocator = function addParameterInfoLocator(locator) {
      if (this.locateParameterInfoElsewhere === undefined) {
        this.locateParameterInfoElsewhere = locator;
        return;
      }

      var original = this.locateParameterInfoElsewhere;
      this.locateParameterInfoElsewhere = function (fn) {
        return original(fn) || locator(fn);
      };
    };

    Container.prototype.registerInstance = function registerInstance(key, instance) {
      this.registerHandler(key, function (x) {
        return instance;
      });
    };

    Container.prototype.registerTransient = function registerTransient(key, fn) {
      fn = fn || key;
      this.registerHandler(key, function (x) {
        return x.invoke(fn);
      });
    };

    Container.prototype.registerSingleton = function registerSingleton(key, fn) {
      var singleton = null;
      fn = fn || key;
      this.registerHandler(key, function (x) {
        return singleton || (singleton = x.invoke(fn));
      });
    };

    Container.prototype.autoRegister = function autoRegister(fn, key) {
      var registration;

      if (fn === null || fn === undefined) {
        throw new Error('fn cannot be null or undefined.');
      }

      registration = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.registration, fn);

      if (registration !== undefined) {
        registration.register(this, key || fn, fn);
      } else {
        this.registerSingleton(key || fn, fn);
      }
    };

    Container.prototype.autoRegisterAll = function autoRegisterAll(fns) {
      var i = fns.length;
      while (i--) {
        this.autoRegister(fns[i]);
      }
    };

    Container.prototype.registerHandler = function registerHandler(key, handler) {
      this.getOrCreateEntry(key).push(handler);
    };

    Container.prototype.unregister = function unregister(key) {
      this.entries['delete'](key);
    };

    Container.prototype.get = function get(key) {
      var entry;

      if (key === null || key === undefined) {
        throw new Error('key cannot be null or undefined.');
      }

      if (key === Container) {
        return this;
      }

      if (key instanceof _metadata.Resolver) {
        return key.get(this);
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
    };

    Container.prototype.getAll = function getAll(key) {
      var _this = this;

      var entry;

      if (key === null || key === undefined) {
        throw new Error('key cannot be null or undefined.');
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
    };

    Container.prototype.hasHandler = function hasHandler(key) {
      var checkParent = arguments[1] === undefined ? false : arguments[1];

      if (key === null || key === undefined) {
        throw new Error('key cannot be null or undefined.');
      }

      return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
    };

    Container.prototype.createChild = function createChild() {
      var childContainer = new Container(this.constructionInfo);
      childContainer.parent = this;
      childContainer.root = this.root;
      childContainer.locateParameterInfoElsewhere = this.locateParameterInfoElsewhere;
      return childContainer;
    };

    Container.prototype.invoke = function invoke(fn) {
      try {
        var info = this.getOrCreateConstructionInfo(fn),
            keys = info.keys,
            args = new Array(keys.length),
            i,
            ii;

        for (i = 0, ii = keys.length; i < ii; ++i) {
          args[i] = this.get(keys[i]);
        }

        return info.activator.invoke(fn, args);
      } catch (e) {
        throw _aureliaLogging.AggregateError('Error instantiating ' + fn.name + '.', e, true);
      }
    };

    Container.prototype.getOrCreateEntry = function getOrCreateEntry(key) {
      var entry;

      if (key === null || key === undefined) {
        throw new Error('key cannot be null or undefined.');
      }

      entry = this.entries.get(key);

      if (entry === undefined) {
        entry = [];
        this.entries.set(key, entry);
      }

      return entry;
    };

    Container.prototype.getOrCreateConstructionInfo = function getOrCreateConstructionInfo(fn) {
      var info = this.constructionInfo.get(fn);

      if (info === undefined) {
        info = this.createConstructionInfo(fn);
        this.constructionInfo.set(fn, info);
      }

      return info;
    };

    Container.prototype.createConstructionInfo = function createConstructionInfo(fn) {
      var info = { activator: _aureliaMetadata.Metadata.getOwn(_aureliaMetadata.Metadata.instanceActivator, fn) || _metadata.ClassActivator.instance };

      if (fn.inject !== undefined) {
        if (typeof fn.inject === 'function') {
          info.keys = fn.inject();
        } else {
          info.keys = fn.inject;
        }

        return info;
      }

      if (this.locateParameterInfoElsewhere !== undefined) {
        info.keys = this.locateParameterInfoElsewhere(fn) || Reflect.getOwnMetadata(_aureliaMetadata.Metadata.paramTypes, fn) || emptyParameters;
      } else {
        info.keys = Reflect.getOwnMetadata(_aureliaMetadata.Metadata.paramTypes, fn) || emptyParameters;
      }

      return info;
    };

    return Container;
  })();

  exports.Container = Container;
});
define('aurelia-dependency-injection/index',['exports', 'aurelia-metadata', './metadata', './container'], function (exports, _aureliaMetadata, _metadata, _container) {
  

  exports.__esModule = true;
  exports.autoinject = autoinject;
  exports.inject = inject;
  exports.registration = registration;
  exports.transient = transient;
  exports.singleton = singleton;
  exports.instanceActivator = instanceActivator;
  exports.factory = factory;
  exports.TransientRegistration = _metadata.TransientRegistration;
  exports.SingletonRegistration = _metadata.SingletonRegistration;
  exports.Resolver = _metadata.Resolver;
  exports.Lazy = _metadata.Lazy;
  exports.All = _metadata.All;
  exports.Optional = _metadata.Optional;
  exports.Parent = _metadata.Parent;
  exports.ClassActivator = _metadata.ClassActivator;
  exports.FactoryActivator = _metadata.FactoryActivator;
  exports.Container = _container.Container;

  function autoinject(target) {
    var deco = function deco(target) {
      target.inject = Reflect.getOwnMetadata(_aureliaMetadata.Metadata.paramTypes, target) || _metadata.emptyParameters;
    };

    return target ? deco(target) : deco;
  }

  function inject() {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return function (target) {
      target.inject = rest;
    };
  }

  function registration(value) {
    return function (target) {
      Reflect.defineMetadata(_aureliaMetadata.Metadata.registration, value, target);
    };
  }

  function transient(key) {
    return registration(new _metadata.TransientRegistration(key));
  }

  function singleton(keyOrRegisterInChild) {
    var registerInChild = arguments[1] === undefined ? false : arguments[1];

    return registration(new _metadata.SingletonRegistration(keyOrRegisterInChild, registerInChild));
  }

  function instanceActivator(value) {
    return function (target) {
      Reflect.defineMetadata(_aureliaMetadata.Metadata.instanceActivator, value, target);
    };
  }

  function factory() {
    return instanceActivator(_metadata.FactoryActivator.instance);
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('autoinject', autoinject);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('inject', inject);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('registration', registration);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('transient', transient);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('singleton', singleton);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('instanceActivator', instanceActivator);
  _aureliaMetadata.Decorators.configure.parameterizedDecorator('factory', factory);
});
define('aurelia-dependency-injection', ['aurelia-dependency-injection/index'], function (main) { return main; });

define('aurelia-framework/plugins',['exports', 'core-js', 'aurelia-logging', 'aurelia-metadata'], function (exports, _coreJs, _aureliaLogging, _aureliaMetadata) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var logger = _aureliaLogging.getLogger('aurelia');

  function loadPlugin(aurelia, loader, info) {
    logger.debug('Loading plugin ' + info.moduleId + '.');
    aurelia.currentPluginId = info.moduleId;

    return loader.loadModule(info.moduleId).then(function (m) {
      if ('configure' in m) {
        return Promise.resolve(m.configure(aurelia, info.config || {})).then(function () {
          aurelia.currentPluginId = null;
          logger.debug('Configured plugin ' + info.moduleId + '.');
        });
      } else {
        aurelia.currentPluginId = null;
        logger.debug('Loaded plugin ' + info.moduleId + '.');
      }
    });
  }

  var Plugins = (function () {
    function Plugins(aurelia) {
      _classCallCheck(this, Plugins);

      this.aurelia = aurelia;
      this.info = [];
      this.processed = false;
    }

    Plugins.prototype.plugin = function plugin(moduleId, config) {
      var plugin = { moduleId: moduleId, config: config || {} };

      if (this.processed) {
        loadPlugin(this.aurelia, this.aurelia.loader, plugin);
      } else {
        this.info.push(plugin);
      }

      return this;
    };

    Plugins.prototype._process = function _process() {
      var _this = this;

      var aurelia = this.aurelia,
          loader = aurelia.loader,
          info = this.info,
          current;

      if (this.processed) {
        return;
      }

      var next = function next() {
        if (current = info.shift()) {
          return loadPlugin(aurelia, loader, current).then(next);
        }

        _this.processed = true;
        return Promise.resolve();
      };

      return next();
    };

    return Plugins;
  })();

  exports.Plugins = Plugins;
});
define('aurelia-binding/value-converter',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  function camelCase(name) {
    return name.charAt(0).toLowerCase() + name.slice(1);
  }

  var ValueConverterResource = (function () {
    function ValueConverterResource(name) {
      _classCallCheck(this, ValueConverterResource);

      this.name = name;
    }

    ValueConverterResource.convention = function convention(name) {
      if (name.endsWith('ValueConverter')) {
        return new ValueConverterResource(camelCase(name.substring(0, name.length - 14)));
      }
    };

    ValueConverterResource.prototype.analyze = function analyze(container, target) {
      this.instance = container.get(target);
    };

    ValueConverterResource.prototype.register = function register(registry, name) {
      registry.registerValueConverter(name || this.name, this.instance);
    };

    ValueConverterResource.prototype.load = function load(container, target) {
      return Promise.resolve(this);
    };

    return ValueConverterResource;
  })();

  exports.ValueConverterResource = ValueConverterResource;
});
define('aurelia-binding/event-manager',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var DefaultEventStrategy = (function () {
    function DefaultEventStrategy() {
      _classCallCheck(this, DefaultEventStrategy);

      this.delegatedEvents = {};
    }

    DefaultEventStrategy.prototype.ensureDelegatedEvent = function ensureDelegatedEvent(eventName) {
      if (this.delegatedEvents[eventName]) {
        return;
      }

      this.delegatedEvents[eventName] = true;
      document.addEventListener(eventName, this.handleDelegatedEvent.bind(this), false);
    };

    DefaultEventStrategy.prototype.handleCallbackResult = function handleCallbackResult(result) {};

    DefaultEventStrategy.prototype.handleDelegatedEvent = function handleDelegatedEvent(event) {
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
    };

    DefaultEventStrategy.prototype.createDirectEventCallback = function createDirectEventCallback(callback) {
      var _this = this;

      return function (event) {
        _this.handleCallbackResult(callback(event));
      };
    };

    DefaultEventStrategy.prototype.subscribeToDelegatedEvent = function subscribeToDelegatedEvent(target, targetEvent, callback) {
      var lookup = target.delegatedEvents || (target.delegatedEvents = {});

      this.ensureDelegatedEvent(targetEvent);
      lookup[targetEvent] = callback;

      return function () {
        lookup[targetEvent] = null;
      };
    };

    DefaultEventStrategy.prototype.subscribeToDirectEvent = function subscribeToDirectEvent(target, targetEvent, callback) {
      var directEventCallback = this.createDirectEventCallback(callback);
      target.addEventListener(targetEvent, directEventCallback, false);

      return function () {
        target.removeEventListener(targetEvent, directEventCallback);
      };
    };

    DefaultEventStrategy.prototype.subscribe = function subscribe(target, targetEvent, callback, delegate) {
      if (delegate) {
        return this.subscribeToDirectEvent(target, targetEvent, callback);
      } else {
        return this.subscribeToDelegatedEvent(target, targetEvent, callback);
      }
    };

    return DefaultEventStrategy;
  })();

  var EventManager = (function () {
    function EventManager() {
      _classCallCheck(this, EventManager);

      this.elementHandlerLookup = {};
      this.eventStrategyLookup = {};

      this.registerElementConfig({
        tagName: 'input',
        properties: {
          value: ['change', 'input'],
          checked: ['change', 'input']
        }
      });

      this.registerElementConfig({
        tagName: 'textarea',
        properties: {
          value: ['change', 'input']
        }
      });

      this.registerElementConfig({
        tagName: 'select',
        properties: {
          value: ['change']
        }
      });

      this.registerElementConfig({
        tagName: 'content editable',
        properties: {
          value: ['change', 'input', 'blur', 'keyup', 'paste'] }
      });

      this.defaultEventStrategy = new DefaultEventStrategy();
    }

    EventManager.prototype.registerElementConfig = function registerElementConfig(config) {
      var tagName = config.tagName.toLowerCase(),
          properties = config.properties,
          propertyName;
      this.elementHandlerLookup[tagName] = {};
      for (propertyName in properties) {
        if (properties.hasOwnProperty(propertyName)) {
          this.registerElementPropertyConfig(tagName, propertyName, properties[propertyName]);
        }
      }
    };

    EventManager.prototype.registerElementPropertyConfig = function registerElementPropertyConfig(tagName, propertyName, events) {
      this.elementHandlerLookup[tagName][propertyName] = {
        subscribe: function subscribe(target, callback) {
          events.forEach(function (changeEvent) {
            target.addEventListener(changeEvent, callback, false);
          });

          return function () {
            events.forEach(function (changeEvent) {
              target.removeEventListener(changeEvent, callback);
            });
          };
        }
      };
    };

    EventManager.prototype.registerElementHandler = function registerElementHandler(tagName, handler) {
      this.elementHandlerLookup[tagName.toLowerCase()] = handler;
    };

    EventManager.prototype.registerEventStrategy = function registerEventStrategy(eventName, strategy) {
      this.eventStrategyLookup[eventName] = strategy;
    };

    EventManager.prototype.getElementHandler = function getElementHandler(target, propertyName) {
      var tagName,
          lookup = this.elementHandlerLookup;
      if (target.tagName) {
        tagName = target.tagName.toLowerCase();
        if (lookup[tagName] && lookup[tagName][propertyName]) {
          return lookup[tagName][propertyName];
        }
        if (propertyName === 'textContent' || propertyName === 'innerHTML') {
          return lookup['content editable']['value'];
        }
      }

      return null;
    };

    EventManager.prototype.addEventListener = function addEventListener(target, targetEvent, callback, delegate) {
      return (this.eventStrategyLookup[targetEvent] || this.defaultEventStrategy).subscribe(target, targetEvent, callback, delegate);
    };

    return EventManager;
  })();

  exports.EventManager = EventManager;
});
define('aurelia-binding/environment',['exports'], function (exports) {
  

  exports.__esModule = true;
  var hasObjectObserve = (function detectObjectObserve() {
    if (typeof Object.observe !== 'function') {
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
    if (records.length !== 3) return false;

    if (records[0].type != 'add' || records[1].type != 'update' || records[2].type != 'delete') {
      return false;
    }

    Object.unobserve(test, callback);

    return true;
  })();

  exports.hasObjectObserve = hasObjectObserve;
  var hasArrayObserve = (function detectArrayObserve() {
    if (typeof Array.observe !== 'function') {
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
    if (records.length !== 2) return false;

    if (records[0].type != 'splice' || records[1].type != 'splice') {
      return false;
    }

    Array.unobserve(arr, callback);

    return true;
  })();
  exports.hasArrayObserve = hasArrayObserve;
});
define('aurelia-binding/array-change-records',['exports'], function (exports) {
  

  exports.__esModule = true;
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
    calcEditDistances: function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
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

    sharedPrefix: function sharedPrefix(current, old, searchLength) {
      for (var i = 0; i < searchLength; ++i) if (!this.equals(current[i], old[i])) return i;
      return searchLength;
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
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name)) continue;
          var index = toNumber(record.name);
          if (index < 0) continue;
          mergeSplice(splices, index, [record.oldValue], record.type === 'delete' ? 0 : 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
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
define('aurelia-binding/map-change-records',['exports'], function (exports) {
  

  exports.__esModule = true;
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
    for (var _iterator = map.keys(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var key = _ref;

      entries.push(newRecord('added', map, key));
    }
    return entries;
  }
});
define('aurelia-binding/collection-observation',['exports', './array-change-records', './map-change-records'], function (exports, _arrayChangeRecords, _mapChangeRecords) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ModifyCollectionObserver = (function () {
    function ModifyCollectionObserver(taskQueue, collection) {
      _classCallCheck(this, ModifyCollectionObserver);

      this.taskQueue = taskQueue;
      this.queued = false;
      this.callbacks = [];
      this.changeRecords = [];
      this.oldCollection = null;
      this.collection = collection;
      this.lengthPropertyName = collection instanceof Map ? 'size' : 'length';
    }

    ModifyCollectionObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      return function () {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };

    ModifyCollectionObserver.prototype.addChangeRecord = function addChangeRecord(changeRecord) {
      if (this.callbacks.length === 0 && !this.lengthObserver) {
        return;
      }

      this.changeRecords.push(changeRecord);

      if (!this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    };

    ModifyCollectionObserver.prototype.reset = function reset(oldCollection) {
      if (!this.callbacks.length) {
        return;
      }

      this.oldCollection = oldCollection;

      if (!this.queued) {
        this.queued = true;
        this.taskQueue.queueMicroTask(this);
      }
    };

    ModifyCollectionObserver.prototype.getLengthObserver = function getLengthObserver() {
      return this.lengthObserver || (this.lengthObserver = new CollectionLengthObserver(this.collection));
    };

    ModifyCollectionObserver.prototype.call = function call() {
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
          if (this.collection instanceof Map) {
            records = _mapChangeRecords.getChangeRecords(oldCollection);
          } else {
            records = _arrayChangeRecords.calcSplices(this.collection, 0, this.collection.length, oldCollection, 0, oldCollection.length);
          }
        } else {
          if (this.collection instanceof Map) {
            records = changeRecords;
          } else {
            records = _arrayChangeRecords.projectArraySplices(this.collection, changeRecords);
          }
        }

        while (i--) {
          callbacks[i](records);
        }
      }

      if (this.lengthObserver) {
        this.lengthObserver.call(this.collection[this.lengthPropertyName]);
      }
    };

    return ModifyCollectionObserver;
  })();

  exports.ModifyCollectionObserver = ModifyCollectionObserver;

  var CollectionLengthObserver = (function () {
    function CollectionLengthObserver(collection) {
      _classCallCheck(this, CollectionLengthObserver);

      this.collection = collection;
      this.callbacks = [];
      this.lengthPropertyName = collection instanceof Map ? 'size' : 'length';
      this.currentValue = collection[this.lengthPropertyName];
    }

    CollectionLengthObserver.prototype.getValue = function getValue() {
      return this.collection[this.lengthPropertyName];
    };

    CollectionLengthObserver.prototype.setValue = function setValue(newValue) {
      this.collection[this.lengthPropertyName] = newValue;
    };

    CollectionLengthObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      return function () {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };

    CollectionLengthObserver.prototype.call = function call(newValue) {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.currentValue;

      while (i--) {
        callbacks[i](newValue, oldValue);
      }

      this.currentValue = newValue;
    };

    return CollectionLengthObserver;
  })();

  exports.CollectionLengthObserver = CollectionLengthObserver;
});
define('aurelia-binding/array-observation',['exports', './environment', './array-change-records', './collection-observation'], function (exports, _environment, _arrayChangeRecords, _collectionObservation) {
  

  exports.__esModule = true;
  exports.getArrayObserver = getArrayObserver;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var arrayProto = Array.prototype;

  function getArrayObserver(taskQueue, array) {
    if (_environment.hasArrayObserve) {
      return new ArrayObserveObserver(array);
    } else {
      return ModifyArrayObserver.create(taskQueue, array);
    }
  }

  var ModifyArrayObserver = (function (_ModifyCollectionObserver) {
    function ModifyArrayObserver(taskQueue, array) {
      _classCallCheck(this, ModifyArrayObserver);

      _ModifyCollectionObserver.call(this, taskQueue, array);
    }

    _inherits(ModifyArrayObserver, _ModifyCollectionObserver);

    ModifyArrayObserver.create = function create(taskQueue, array) {
      var observer = new ModifyArrayObserver(taskQueue, array);

      array['pop'] = function () {
        var methodCallResult = arrayProto['pop'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'delete',
          object: array,
          name: array.length,
          oldValue: methodCallResult
        });
        return methodCallResult;
      };

      array['push'] = function () {
        var methodCallResult = arrayProto['push'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'splice',
          object: array,
          index: array.length - arguments.length,
          removed: [],
          addedCount: arguments.length
        });
        return methodCallResult;
      };

      array['reverse'] = function () {
        var oldArray = array.slice();
        var methodCallResult = arrayProto['reverse'].apply(array, arguments);
        observer.reset(oldArray);
        return methodCallResult;
      };

      array['shift'] = function () {
        var methodCallResult = arrayProto['shift'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'delete',
          object: array,
          name: 0,
          oldValue: methodCallResult
        });
        return methodCallResult;
      };

      array['sort'] = function () {
        var oldArray = array.slice();
        var methodCallResult = arrayProto['sort'].apply(array, arguments);
        observer.reset(oldArray);
        return methodCallResult;
      };

      array['splice'] = function () {
        var methodCallResult = arrayProto['splice'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'splice',
          object: array,
          index: arguments[0],
          removed: methodCallResult,
          addedCount: arguments.length > 2 ? arguments.length - 2 : 0
        });
        return methodCallResult;
      };

      array['unshift'] = function () {
        var methodCallResult = arrayProto['unshift'].apply(array, arguments);
        observer.addChangeRecord({
          type: 'splice',
          object: array,
          index: 0,
          removed: [],
          addedCount: arguments.length
        });
        return methodCallResult;
      };

      return observer;
    };

    return ModifyArrayObserver;
  })(_collectionObservation.ModifyCollectionObserver);

  var ArrayObserveObserver = (function () {
    function ArrayObserveObserver(array) {
      _classCallCheck(this, ArrayObserveObserver);

      this.array = array;
      this.callbacks = [];
      this.observing = false;
    }

    ArrayObserveObserver.prototype.subscribe = function subscribe(callback) {
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
    };

    ArrayObserveObserver.prototype.getLengthObserver = function getLengthObserver() {
      return this.lengthObserver || (this.lengthObserver = new _collectionObservation.CollectionLengthObserver(this.array));
    };

    ArrayObserveObserver.prototype.handleChanges = function handleChanges(changeRecords) {
      var callbacks = this.callbacks,
          i = callbacks.length,
          splices;

      if (i) {
        splices = _arrayChangeRecords.projectArraySplices(this.array, changeRecords);

        while (i--) {
          callbacks[i](splices);
        }
      }

      if (this.lengthObserver) {
        this.lengthObserver.call(this.array.length);
      }
    };

    return ArrayObserveObserver;
  })();
});
define('aurelia-binding/map-observation',['exports', 'core-js', './map-change-records', './collection-observation'], function (exports, _coreJs, _mapChangeRecords, _collectionObservation) {
  

  exports.__esModule = true;
  exports.getMapObserver = getMapObserver;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _core = _interopRequire(_coreJs);

  var mapProto = Map.prototype;

  function getMapObserver(taskQueue, map) {
    return ModifyMapObserver.create(taskQueue, map);
  }

  var ModifyMapObserver = (function (_ModifyCollectionObserver) {
    function ModifyMapObserver(taskQueue, map) {
      _classCallCheck(this, ModifyMapObserver);

      _ModifyCollectionObserver.call(this, taskQueue, map);
    }

    _inherits(ModifyMapObserver, _ModifyCollectionObserver);

    ModifyMapObserver.create = function create(taskQueue, map) {
      var observer = new ModifyMapObserver(taskQueue, map);

      map['set'] = function () {
        var oldValue = map.get(arguments[0]);
        var type = oldValue ? 'update' : 'add';
        var methodCallResult = mapProto['set'].apply(map, arguments);
        observer.addChangeRecord({
          type: type,
          object: map,
          key: arguments[0],
          oldValue: oldValue
        });
        return methodCallResult;
      };

      map['delete'] = function () {
        var oldValue = map.get(arguments[0]);
        var methodCallResult = mapProto['delete'].apply(map, arguments);
        observer.addChangeRecord({
          type: 'delete',
          object: map,
          key: arguments[0],
          oldValue: oldValue
        });
        return methodCallResult;
      };

      map['clear'] = function () {
        var methodCallResult = mapProto['clear'].apply(map, arguments);
        observer.addChangeRecord({
          type: 'clear',
          object: map
        });
        return methodCallResult;
      };

      return observer;
    };

    return ModifyMapObserver;
  })(_collectionObservation.ModifyCollectionObserver);
});
define('aurelia-binding/dirty-checking',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var DirtyChecker = (function () {
    function DirtyChecker() {
      _classCallCheck(this, DirtyChecker);

      this.tracked = [];
      this.checkDelay = 120;
    }

    DirtyChecker.prototype.addProperty = function addProperty(property) {
      var tracked = this.tracked;

      tracked.push(property);

      if (tracked.length === 1) {
        this.scheduleDirtyCheck();
      }
    };

    DirtyChecker.prototype.removeProperty = function removeProperty(property) {
      var tracked = this.tracked;
      tracked.splice(tracked.indexOf(property), 1);
    };

    DirtyChecker.prototype.scheduleDirtyCheck = function scheduleDirtyCheck() {
      var _this = this;

      setTimeout(function () {
        return _this.check();
      }, this.checkDelay);
    };

    DirtyChecker.prototype.check = function check() {
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
    };

    return DirtyChecker;
  })();

  exports.DirtyChecker = DirtyChecker;

  var DirtyCheckProperty = (function () {
    function DirtyCheckProperty(dirtyChecker, obj, propertyName) {
      _classCallCheck(this, DirtyCheckProperty);

      this.dirtyChecker = dirtyChecker;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.isSVG = obj instanceof SVGElement;
    }

    DirtyCheckProperty.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    DirtyCheckProperty.prototype.setValue = function setValue(newValue) {
      if (this.isSVG) {
        this.obj.setAttributeNS(null, this.propertyName, newValue);
      } else {
        this.obj[this.propertyName] = newValue;
      }
    };

    DirtyCheckProperty.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.getValue();

      while (i--) {
        callbacks[i](newValue, oldValue);
      }

      this.oldValue = newValue;
    };

    DirtyCheckProperty.prototype.isDirty = function isDirty() {
      return this.oldValue !== this.getValue();
    };

    DirtyCheckProperty.prototype.beginTracking = function beginTracking() {
      this.tracking = true;
      this.oldValue = this.newValue = this.getValue();
      this.dirtyChecker.addProperty(this);
    };

    DirtyCheckProperty.prototype.endTracking = function endTracking() {
      this.tracking = false;
      this.dirtyChecker.removeProperty(this);
    };

    DirtyCheckProperty.prototype.subscribe = function subscribe(callback) {
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
    };

    return DirtyCheckProperty;
  })();

  exports.DirtyCheckProperty = DirtyCheckProperty;
});
define('aurelia-binding/property-observation',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var SetterObserver = (function () {
    function SetterObserver(taskQueue, obj, propertyName) {
      _classCallCheck(this, SetterObserver);

      this.taskQueue = taskQueue;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
      this.queued = false;
      this.observing = false;
    }

    SetterObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    SetterObserver.prototype.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };

    SetterObserver.prototype.getterValue = function getterValue() {
      return this.currentValue;
    };

    SetterObserver.prototype.setterValue = function setterValue(newValue) {
      var oldValue = this.currentValue;

      if (oldValue !== newValue) {
        if (!this.queued) {
          this.oldValue = oldValue;
          this.queued = true;
          this.taskQueue.queueMicroTask(this);
        }

        this.currentValue = newValue;
      }
    };

    SetterObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.currentValue;

      this.queued = false;

      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };

    SetterObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);

      if (!this.observing) {
        this.convertProperty();
      }

      return function () {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };

    SetterObserver.prototype.convertProperty = function convertProperty() {
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
    };

    return SetterObserver;
  })();

  exports.SetterObserver = SetterObserver;

  var OoObjectObserver = (function () {
    function OoObjectObserver(obj, observerLocator) {
      _classCallCheck(this, OoObjectObserver);

      this.obj = obj;
      this.observers = {};
      this.observerLocator = observerLocator;
    }

    OoObjectObserver.prototype.subscribe = function subscribe(propertyObserver, callback) {
      var _this = this;

      var callbacks = propertyObserver.callbacks;
      callbacks.push(callback);

      if (!this.observing) {
        this.observing = true;
        try {
          Object.observe(this.obj, function (changes) {
            return _this.handleChanges(changes);
          }, ['update', 'add']);
        } catch (_) {}
      }

      return function () {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };

    OoObjectObserver.prototype.getObserver = function getObserver(propertyName, descriptor) {
      var propertyObserver = this.observers[propertyName];
      if (!propertyObserver) {
        if (descriptor) {
          propertyObserver = this.observers[propertyName] = new OoPropertyObserver(this, this.obj, propertyName);
        } else {
          propertyObserver = this.observers[propertyName] = new UndefinedPropertyObserver(this, this.obj, propertyName);
        }
      }
      return propertyObserver;
    };

    OoObjectObserver.prototype.handleChanges = function handleChanges(changeRecords) {
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
    };

    return OoObjectObserver;
  })();

  exports.OoObjectObserver = OoObjectObserver;

  var OoPropertyObserver = (function () {
    function OoPropertyObserver(owner, obj, propertyName) {
      _classCallCheck(this, OoPropertyObserver);

      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbacks = [];
    }

    OoPropertyObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    OoPropertyObserver.prototype.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };

    OoPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
      var callbacks = this.callbacks,
          i = callbacks.length;

      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };

    OoPropertyObserver.prototype.subscribe = function subscribe(callback) {
      return this.owner.subscribe(this, callback);
    };

    return OoPropertyObserver;
  })();

  exports.OoPropertyObserver = OoPropertyObserver;

  var UndefinedPropertyObserver = (function () {
    function UndefinedPropertyObserver(owner, obj, propertyName) {
      _classCallCheck(this, UndefinedPropertyObserver);

      this.owner = owner;
      this.obj = obj;
      this.propertyName = propertyName;
      this.callbackMap = new Map();
      this.callbacks = [];
    }

    UndefinedPropertyObserver.prototype.getValue = function getValue() {
      if (this.actual) {
        return this.actual.getValue();
      }
      return this.obj[this.propertyName];
    };

    UndefinedPropertyObserver.prototype.setValue = function setValue(newValue) {
      if (this.actual) {
        this.actual.setValue(newValue);
        return;
      }

      this.obj[this.propertyName] = newValue;
      this.trigger(newValue, undefined);
    };

    UndefinedPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
      var callback;

      if (this.subscription) {
        this.subscription();
      }

      this.getObserver();

      for (var _iterator = this.callbackMap.keys(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        if (_isArray) {
          if (_i >= _iterator.length) break;
          callback = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          callback = _i.value;
        }

        callback(newValue, oldValue);
      }
    };

    UndefinedPropertyObserver.prototype.getObserver = function getObserver() {
      var callback, observerLocator;

      if (!Object.getOwnPropertyDescriptor(this.obj, this.propertyName)) {
        return;
      }

      observerLocator = this.owner.observerLocator;
      delete this.owner.observers[this.propertyName];
      delete observerLocator.getObserversLookup(this.obj, observerLocator)[this.propertyName];
      this.actual = observerLocator.getObserver(this.obj, this.propertyName);

      for (var _iterator2 = this.callbackMap.keys(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          callback = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          callback = _i2.value;
        }

        this.callbackMap.set(callback, this.actual.subscribe(callback));
      }
    };

    UndefinedPropertyObserver.prototype.subscribe = function subscribe(callback) {
      var _this2 = this;

      if (!this.actual) {
        this.getObserver();
      }

      if (this.actual) {
        return this.actual.subscribe(callback);
      }

      if (!this.subscription) {
        this.subscription = this.owner.subscribe(this);
      }

      this.callbackMap.set(callback, null);

      return function () {
        var actualDispose = _this2.callbackMap.get(callback);
        if (actualDispose) actualDispose();
        _this2.callbackMap['delete'](callback);
      };
    };

    return UndefinedPropertyObserver;
  })();

  exports.UndefinedPropertyObserver = UndefinedPropertyObserver;
});
define('aurelia-binding/element-observation',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var XLinkAttributeObserver = (function () {
    function XLinkAttributeObserver(element, propertyName, attributeName) {
      _classCallCheck(this, XLinkAttributeObserver);

      this.element = element;
      this.propertyName = propertyName;
      this.attributeName = attributeName;
    }

    XLinkAttributeObserver.prototype.getValue = function getValue() {
      return this.element.getAttributeNS('http://www.w3.org/1999/xlink', this.attributeName);
    };

    XLinkAttributeObserver.prototype.setValue = function setValue(newValue) {
      return this.element.setAttributeNS('http://www.w3.org/1999/xlink', this.attributeName, newValue);
    };

    XLinkAttributeObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of an Element\'s "' + this.propertyName + '" property is not supported.');
    };

    return XLinkAttributeObserver;
  })();

  exports.XLinkAttributeObserver = XLinkAttributeObserver;

  var DataAttributeObserver = (function () {
    function DataAttributeObserver(element, propertyName) {
      _classCallCheck(this, DataAttributeObserver);

      this.element = element;
      this.propertyName = propertyName;
    }

    DataAttributeObserver.prototype.getValue = function getValue() {
      return this.element.getAttribute(this.propertyName);
    };

    DataAttributeObserver.prototype.setValue = function setValue(newValue) {
      return this.element.setAttribute(this.propertyName, newValue);
    };

    DataAttributeObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of an Element\'s "' + this.propertyName + '" property is not supported.');
    };

    return DataAttributeObserver;
  })();

  exports.DataAttributeObserver = DataAttributeObserver;

  var StyleObserver = (function () {
    function StyleObserver(element, propertyName) {
      _classCallCheck(this, StyleObserver);

      this.element = element;
      this.propertyName = propertyName;
    }

    StyleObserver.prototype.getValue = function getValue() {
      return this.element.style.cssText;
    };

    StyleObserver.prototype.setValue = function setValue(newValue) {
      if (newValue instanceof Object) {
        newValue = this.flattenCss(newValue);
      }
      this.element.style.cssText = newValue;
    };

    StyleObserver.prototype.subscribe = function subscribe(callback) {
      throw new Error('Observation of an Element\'s "' + this.propertyName + '" property is not supported.');
    };

    StyleObserver.prototype.flattenCss = function flattenCss(object) {
      var s = '';
      for (var propertyName in object) {
        if (object.hasOwnProperty(propertyName)) {
          s += propertyName + ': ' + object[propertyName] + '; ';
        }
      }
      return s;
    };

    return StyleObserver;
  })();

  exports.StyleObserver = StyleObserver;

  var ValueAttributeObserver = (function () {
    function ValueAttributeObserver(element, propertyName, handler) {
      _classCallCheck(this, ValueAttributeObserver);

      this.element = element;
      this.propertyName = propertyName;
      this.handler = handler;
      this.callbacks = [];
    }

    ValueAttributeObserver.prototype.getValue = function getValue() {
      return this.element[this.propertyName];
    };

    ValueAttributeObserver.prototype.setValue = function setValue(newValue) {
      this.element[this.propertyName] = newValue;
      this.call();
    };

    ValueAttributeObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.getValue();

      while (i--) {
        callbacks[i](newValue, oldValue);
      }

      this.oldValue = newValue;
    };

    ValueAttributeObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;

      if (!this.disposeHandler) {
        this.oldValue = this.getValue();
        this.disposeHandler = this.handler.subscribe(this.element, this.call.bind(this));
      }

      this.callbacks.push(callback);

      return this.unsubscribe.bind(this, callback);
    };

    ValueAttributeObserver.prototype.unsubscribe = function unsubscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length === 0) {
        this.disposeHandler();
        this.disposeHandler = null;
      }
    };

    return ValueAttributeObserver;
  })();

  exports.ValueAttributeObserver = ValueAttributeObserver;

  var SelectValueObserver = (function () {
    function SelectValueObserver(element, handler, observerLocator) {
      _classCallCheck(this, SelectValueObserver);

      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }

    SelectValueObserver.prototype.getValue = function getValue() {
      return this.value;
    };

    SelectValueObserver.prototype.setValue = function setValue(newValue) {
      var _this = this;

      if (newValue !== null && newValue !== undefined && this.element.multiple && !Array.isArray(newValue)) {
        throw new Error('Only null or Array instances can be bound to a multi-select.');
      }
      if (this.value === newValue) {
        return;
      }

      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }

      if (Array.isArray(newValue)) {
        this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeOptions.bind(this));
      }

      this.value = newValue;
      this.synchronizeOptions();

      if (this.element.options.length > 0 && !this.initialSync) {
        this.initialSync = true;
        this.observerLocator.taskQueue.queueMicroTask({ call: function call() {
            return _this.synchronizeOptions();
          } });
      }
    };

    SelectValueObserver.prototype.synchronizeOptions = function synchronizeOptions() {
      var value = this.value,
          i,
          options,
          option,
          optionValue,
          clear,
          isArray;

      if (value === null || value === undefined) {
        clear = true;
      } else if (Array.isArray(value)) {
        isArray = true;
      }

      options = this.element.options;
      i = options.length;
      while (i--) {
        option = options.item(i);
        if (clear) {
          option.selected = false;
          continue;
        }
        optionValue = option.hasOwnProperty('model') ? option.model : option.value;
        if (isArray) {
          option.selected = value.indexOf(optionValue) !== -1;
          continue;
        }
        option.selected = value === optionValue;
      }
    };

    SelectValueObserver.prototype.synchronizeValue = function synchronizeValue() {
      var options = this.element.options,
          option,
          i,
          ii,
          count = 0,
          value = [];

      for (i = 0, ii = options.length; i < ii; i++) {
        option = options.item(i);
        if (!option.selected) {
          continue;
        }
        value[count] = option.hasOwnProperty('model') ? option.model : option.value;
        count++;
      }

      if (!this.element.multiple) {
        if (count === 0) {
          value = null;
        } else {
          value = value[0];
        }
      }

      this.oldValue = this.value;
      this.value = value;
      this.call();
    };

    SelectValueObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.value;

      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };

    SelectValueObserver.prototype.subscribe = function subscribe(callback) {
      if (!this.callbacks) {
        this.callbacks = [];
        this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
      }

      this.callbacks.push(callback);
      return this.unsubscribe.bind(this, callback);
    };

    SelectValueObserver.prototype.unsubscribe = function unsubscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length === 0) {
        this.disposeHandler();
        this.disposeHandler = null;
        this.callbacks = null;
      }
    };

    SelectValueObserver.prototype.bind = function bind() {
      var _this2 = this;

      this.domObserver = new MutationObserver(function () {
        _this2.synchronizeOptions();
        _this2.synchronizeValue();
      });
      this.domObserver.observe(this.element, { childList: true, subtree: true });
    };

    SelectValueObserver.prototype.unbind = function unbind() {
      this.domObserver.disconnect();
      this.domObserver = null;

      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }
    };

    return SelectValueObserver;
  })();

  exports.SelectValueObserver = SelectValueObserver;

  var CheckedObserver = (function () {
    function CheckedObserver(element, handler, observerLocator) {
      _classCallCheck(this, CheckedObserver);

      this.element = element;
      this.handler = handler;
      this.observerLocator = observerLocator;
    }

    CheckedObserver.prototype.getValue = function getValue() {
      return this.value;
    };

    CheckedObserver.prototype.setValue = function setValue(newValue) {
      var _this3 = this;

      if (this.value === newValue) {
        return;
      }

      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }

      if (this.element.type === 'checkbox' && Array.isArray(newValue)) {
        this.arraySubscription = this.observerLocator.getArrayObserver(newValue).subscribe(this.synchronizeElement.bind(this));
      }

      this.value = newValue;
      this.synchronizeElement();

      if (!this.element.hasOwnProperty('model') && !this.initialSync) {
        this.initialSync = true;
        this.observerLocator.taskQueue.queueMicroTask({ call: function call() {
            return _this3.synchronizeElement();
          } });
      }
    };

    CheckedObserver.prototype.synchronizeElement = function synchronizeElement() {
      var value = this.value,
          element = this.element,
          elementValue = element.hasOwnProperty('model') ? element.model : element.value,
          isRadio = element.type === 'radio';

      element.checked = isRadio && value === elementValue || !isRadio && value === true || !isRadio && Array.isArray(value) && value.indexOf(elementValue) !== -1;
    };

    CheckedObserver.prototype.synchronizeValue = function synchronizeValue() {
      var value = this.value,
          element = this.element,
          elementValue = element.hasOwnProperty('model') ? element.model : element.value,
          index;

      if (element.type === 'checkbox') {
        if (Array.isArray(value)) {
          index = value.indexOf(elementValue);
          if (element.checked && index === -1) {
            value.push(elementValue);
          } else if (!element.checked && index !== -1) {
            value.splice(index, 1);
          }

          return;
        } else {
          value = element.checked;
        }
      } else if (element.checked) {
        value = elementValue;
      } else {
        return;
      }

      this.oldValue = this.value;
      this.value = value;
      this.call();
    };

    CheckedObserver.prototype.call = function call() {
      var callbacks = this.callbacks,
          i = callbacks.length,
          oldValue = this.oldValue,
          newValue = this.value;

      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };

    CheckedObserver.prototype.subscribe = function subscribe(callback) {
      if (!this.callbacks) {
        this.callbacks = [];
        this.disposeHandler = this.handler.subscribe(this.element, this.synchronizeValue.bind(this, false));
      }

      this.callbacks.push(callback);
      return this.unsubscribe.bind(this, callback);
    };

    CheckedObserver.prototype.unsubscribe = function unsubscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.splice(callbacks.indexOf(callback), 1);
      if (callbacks.length === 0) {
        this.disposeHandler();
        this.disposeHandler = null;
        this.callbacks = null;
      }
    };

    CheckedObserver.prototype.unbind = function unbind() {
      if (this.arraySubscription) {
        this.arraySubscription();
        this.arraySubscription = null;
      }
    };

    return CheckedObserver;
  })();

  exports.CheckedObserver = CheckedObserver;
});
define('aurelia-binding/computed-observation',['exports'], function (exports) {
  

  exports.__esModule = true;
  exports.hasDeclaredDependencies = hasDeclaredDependencies;
  exports.declarePropertyDependencies = declarePropertyDependencies;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ComputedPropertyObserver = (function () {
    function ComputedPropertyObserver(obj, propertyName, descriptor, observerLocator) {
      _classCallCheck(this, ComputedPropertyObserver);

      this.obj = obj;
      this.propertyName = propertyName;
      this.descriptor = descriptor;
      this.observerLocator = observerLocator;
      this.callbacks = [];
    }

    ComputedPropertyObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    ComputedPropertyObserver.prototype.setValue = function setValue(newValue) {
      throw new Error('Computed properties cannot be assigned.');
    };

    ComputedPropertyObserver.prototype.trigger = function trigger(newValue, oldValue) {
      var callbacks = this.callbacks,
          i = callbacks.length;

      while (i--) {
        callbacks[i](newValue, oldValue);
      }
    };

    ComputedPropertyObserver.prototype.evaluate = function evaluate() {
      var newValue = this.getValue();
      if (this.oldValue === newValue) return;
      this.trigger(newValue, this.oldValue);
      this.oldValue = newValue;
    };

    ComputedPropertyObserver.prototype.subscribe = function subscribe(callback) {
      var _this = this;

      var dependencies, i, ii;

      this.callbacks.push(callback);

      if (this.oldValue === undefined) {
        this.oldValue = this.getValue();
        this.subscriptions = [];

        dependencies = this.descriptor.get.dependencies;
        for (i = 0, ii = dependencies.length; i < ii; i++) {
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
    };

    return ComputedPropertyObserver;
  })();

  exports.ComputedPropertyObserver = ComputedPropertyObserver;

  function hasDeclaredDependencies(descriptor) {
    return descriptor && descriptor.get && !descriptor.set && descriptor.get.dependencies && descriptor.get.dependencies.length;
  }

  function declarePropertyDependencies(ctor, propertyName, dependencies) {
    var descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, propertyName);
    if (descriptor.set) throw new Error('The property cannot have a setter function.');
    descriptor.get.dependencies = dependencies;
  }
});
define('aurelia-binding/observer-locator',['exports', 'aurelia-task-queue', './environment', './array-observation', './map-observation', './event-manager', './dirty-checking', './property-observation', './element-observation', 'aurelia-dependency-injection', './computed-observation'], function (exports, _aureliaTaskQueue, _environment, _arrayObservation, _mapObservation, _eventManager, _dirtyChecking, _propertyObservation, _elementObservation, _aureliaDependencyInjection, _computedObservation) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function (subject, name) {
      var pd = Object.getOwnPropertyDescriptor(subject, name);
      var proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  function createObserversLookup(obj) {
    var value = {};

    try {
      Object.defineProperty(obj, '__observers__', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}

    return value;
  }

  function createObserverLookup(obj, observerLocator) {
    var value = new _propertyObservation.OoObjectObserver(obj, observerLocator);

    try {
      Object.defineProperty(obj, '__observer__', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
      });
    } catch (_) {}

    return value;
  }

  var ObserverLocator = (function () {
    function ObserverLocator(taskQueue, eventManager, dirtyChecker, observationAdapters) {
      _classCallCheck(this, ObserverLocator);

      this.taskQueue = taskQueue;
      this.eventManager = eventManager;
      this.dirtyChecker = dirtyChecker;
      this.observationAdapters = observationAdapters;
    }

    ObserverLocator.inject = function inject() {
      return [_aureliaTaskQueue.TaskQueue, _eventManager.EventManager, _dirtyChecking.DirtyChecker, _aureliaDependencyInjection.All.of(ObjectObservationAdapter)];
    };

    ObserverLocator.prototype.getObserversLookup = function getObserversLookup(obj) {
      return obj.__observers__ || createObserversLookup(obj);
    };

    ObserverLocator.prototype.getObserver = function getObserver(obj, propertyName) {
      var observersLookup = this.getObserversLookup(obj);

      if (propertyName in observersLookup) {
        return observersLookup[propertyName];
      }

      return observersLookup[propertyName] = this.createPropertyObserver(obj, propertyName);
    };

    ObserverLocator.prototype.getObservationAdapter = function getObservationAdapter(obj, propertyName, descriptor) {
      var i, ii, observationAdapter;
      for (i = 0, ii = this.observationAdapters.length; i < ii; i++) {
        observationAdapter = this.observationAdapters[i];
        if (observationAdapter.handlesProperty(obj, propertyName, descriptor)) return observationAdapter;
      }
      return null;
    };

    ObserverLocator.prototype.createPropertyObserver = function createPropertyObserver(obj, propertyName) {
      var observerLookup, descriptor, handler, observationAdapter, xlinkResult;

      if (obj instanceof Element) {
        handler = this.eventManager.getElementHandler(obj, propertyName);
        if (propertyName === 'value' && obj.tagName.toLowerCase() === 'select') {
          return new _elementObservation.SelectValueObserver(obj, handler, this);
        }
        if (propertyName === 'checked' && obj.tagName.toLowerCase() === 'input') {
          return new _elementObservation.CheckedObserver(obj, handler, this);
        }
        if (handler) {
          return new _elementObservation.ValueAttributeObserver(obj, propertyName, handler);
        }
        xlinkResult = /^xlink:(.+)$/.exec(propertyName);
        if (xlinkResult) {
          return new _elementObservation.XLinkAttributeObserver(obj, propertyName, xlinkResult[1]);
        }
        if (/^\w+:|^data-|^aria-/.test(propertyName) || obj instanceof SVGElement) {
          return new _elementObservation.DataAttributeObserver(obj, propertyName);
        }
        if (propertyName === 'style' || propertyName === 'css') {
          return new _elementObservation.StyleObserver(obj, propertyName);
        }
      }

      descriptor = Object.getPropertyDescriptor(obj, propertyName);

      if (_computedObservation.hasDeclaredDependencies(descriptor)) {
        return new _computedObservation.ComputedPropertyObserver(obj, propertyName, descriptor, this);
      }

      if (descriptor && (descriptor.get || descriptor.set)) {
        observationAdapter = this.getObservationAdapter(obj, propertyName, descriptor);
        if (observationAdapter) return observationAdapter.getObserver(obj, propertyName, descriptor);
        return new _dirtyChecking.DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
      }

      if (_environment.hasObjectObserve) {
        observerLookup = obj.__observer__ || createObserverLookup(obj, this);
        return observerLookup.getObserver(propertyName, descriptor);
      }

      if (obj instanceof Array) {
        if (propertyName === 'length') {
          return this.getArrayObserver(obj).getLengthObserver();
        } else {
          return new _dirtyChecking.DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
        }
      } else if (obj instanceof Map) {
        if (propertyName === 'size') {
          return this.getMapObserver(obj).getLengthObserver();
        } else {
          return new _dirtyChecking.DirtyCheckProperty(this.dirtyChecker, obj, propertyName);
        }
      }

      return new _propertyObservation.SetterObserver(this.taskQueue, obj, propertyName);
    };

    ObserverLocator.prototype.getArrayObserver = function getArrayObserver(array) {
      if ('__array_observer__' in array) {
        return array.__array_observer__;
      }

      return array.__array_observer__ = _arrayObservation.getArrayObserver(this.taskQueue, array);
    };

    ObserverLocator.prototype.getMapObserver = function getMapObserver(map) {
      if ('__map_observer__' in map) {
        return map.__map_observer__;
      }

      return map.__map_observer__ = _mapObservation.getMapObserver(this.taskQueue, map);
    };

    return ObserverLocator;
  })();

  exports.ObserverLocator = ObserverLocator;

  var ObjectObservationAdapter = (function () {
    function ObjectObservationAdapter() {
      _classCallCheck(this, ObjectObservationAdapter);
    }

    ObjectObservationAdapter.prototype.handlesProperty = function handlesProperty(object, propertyName, descriptor) {
      throw new Error('BindingAdapters must implement handlesProperty(object, propertyName).');
    };

    ObjectObservationAdapter.prototype.getObserver = function getObserver(object, propertyName, descriptor) {
      throw new Error('BindingAdapters must implement createObserver(object, propertyName).');
    };

    return ObjectObservationAdapter;
  })();

  exports.ObjectObservationAdapter = ObjectObservationAdapter;
});
define('aurelia-binding/binding-modes',["exports"], function (exports) {
  

  exports.__esModule = true;
  var bindingMode = {
    oneTime: 0,
    oneWay: 1,
    twoWay: 2
  };
  exports.bindingMode = bindingMode;
});
define('aurelia-binding/lexer',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Token = (function () {
    function Token(index, text) {
      _classCallCheck(this, Token);

      this.index = index;
      this.text = text;
    }

    Token.prototype.withOp = function withOp(op) {
      this.opKey = op;
      return this;
    };

    Token.prototype.withGetterSetter = function withGetterSetter(key) {
      this.key = key;
      return this;
    };

    Token.prototype.withValue = function withValue(value) {
      this.value = value;
      return this;
    };

    Token.prototype.toString = function toString() {
      return 'Token(' + this.text + ')';
    };

    return Token;
  })();

  exports.Token = Token;

  var Lexer = (function () {
    function Lexer() {
      _classCallCheck(this, Lexer);
    }

    Lexer.prototype.lex = function lex(text) {
      var scanner = new Scanner(text);
      var tokens = [];
      var token = scanner.scanToken();

      while (token) {
        tokens.push(token);
        token = scanner.scanToken();
      }

      return tokens;
    };

    return Lexer;
  })();

  exports.Lexer = Lexer;

  var Scanner = (function () {
    function Scanner(input) {
      _classCallCheck(this, Scanner);

      this.input = input;
      this.length = input.length;
      this.peek = 0;
      this.index = -1;

      this.advance();
    }

    Scanner.prototype.scanToken = function scanToken() {
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
          return isDigit(this.peek) ? this.scanNumber(start) : new Token(start, '.');
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
          return this.scanComplexOperator(start, $EQ, String.fromCharCode(this.peek), '=');
        case $AMPERSAND:
          return this.scanComplexOperator(start, $AMPERSAND, '&', '&');
        case $BAR:
          return this.scanComplexOperator(start, $BAR, '|', '|');
        case $NBSP:
          while (isWhitespace(this.peek)) {
            this.advance();
          }

          return this.scanToken();
      }

      var character = String.fromCharCode(this.peek);
      this.error('Unexpected character [' + character + ']');
      return null;
    };

    Scanner.prototype.scanCharacter = function scanCharacter(start, text) {
      assert(this.peek === text.charCodeAt(0));
      this.advance();
      return new Token(start, text);
    };

    Scanner.prototype.scanOperator = function scanOperator(start, text) {
      assert(this.peek === text.charCodeAt(0));
      assert(OPERATORS.indexOf(text) !== -1);
      this.advance();
      return new Token(start, text).withOp(text);
    };

    Scanner.prototype.scanComplexOperator = function scanComplexOperator(start, code, one, two) {
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
    };

    Scanner.prototype.scanIdentifier = function scanIdentifier() {
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
    };

    Scanner.prototype.scanNumber = function scanNumber(start) {
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
            this.error('Invalid exponent', -1);
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
    };

    Scanner.prototype.scanString = function scanString() {
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
              this.error('Invalid unicode escape [\\u' + hex + ']');
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
          this.error('Unterminated quote');
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
        unescaped = buffer.join('');
      }

      return new Token(start, text).withValue(unescaped);
    };

    Scanner.prototype.advance = function advance() {
      if (++this.index >= this.length) {
        this.peek = $EOF;
      } else {
        this.peek = this.input.charCodeAt(this.index);
      }
    };

    Scanner.prototype.error = function error(message) {
      var offset = arguments[1] === undefined ? 0 : arguments[1];

      var position = this.index + offset;
      throw new Error('Lexer Error: ' + message + ' at column ' + position + ' in expression [' + this.input + ']');
    };

    return Scanner;
  })();

  exports.Scanner = Scanner;

  var OPERATORS = ['undefined', 'null', 'true', 'false', '+', '-', '*', '/', '%', '^', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '&', '|', '!', '?'];

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
      throw message || 'Assertion failed';
    }
  }
});
define('aurelia-binding/path-observer',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var PathObserver = (function () {
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

    PathObserver.prototype.updateRight = function updateRight(observer) {
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
    };

    PathObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      that.callback = callback;
      return function () {
        that.callback = null;
      };
    };

    PathObserver.prototype.notify = function notify(newValue) {
      var callback = this.callback;

      if (callback) {
        callback(newValue);
      }
    };

    PathObserver.prototype.dispose = function dispose() {
      if (this.disposeLeft) {
        this.disposeLeft();
      }

      if (this.disposeRight) {
        this.disposeRight();
      }
    };

    return PathObserver;
  })();

  exports.PathObserver = PathObserver;
});
define('aurelia-binding/composite-observer',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var CompositeObserver = (function () {
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

    CompositeObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      that.callback = callback;
      return function () {
        that.callback = null;
      };
    };

    CompositeObserver.prototype.notify = function notify(newValue) {
      var callback = this.callback;

      if (callback) {
        callback(newValue);
      }
    };

    CompositeObserver.prototype.dispose = function dispose() {
      var subscriptions = this.subscriptions;

      var i = subscriptions.length;
      while (i--) {
        subscriptions[i]();
      }
    };

    return CompositeObserver;
  })();

  exports.CompositeObserver = CompositeObserver;
});
define('aurelia-binding/access-keyed-observer',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var AccessKeyedObserver = (function () {
    function AccessKeyedObserver(objectInfo, keyInfo, observerLocator, evaluate) {
      var _this = this;

      _classCallCheck(this, AccessKeyedObserver);

      this.objectInfo = objectInfo;
      this.keyInfo = keyInfo;
      this.evaluate = evaluate;
      this.observerLocator = observerLocator;

      if (keyInfo.observer) {
        this.disposeKey = keyInfo.observer.subscribe(function (newValue) {
          return _this.objectOrKeyChanged(undefined, newValue);
        });
      }

      if (objectInfo.observer) {
        this.disposeObject = objectInfo.observer.subscribe(function (newValue) {
          return _this.objectOrKeyChanged(newValue);
        });
      }

      this.updatePropertySubscription(objectInfo.value, keyInfo.value);
    }

    AccessKeyedObserver.prototype.updatePropertySubscription = function updatePropertySubscription(object, key) {
      var _this2 = this;

      var callback;
      if (this.disposeProperty) {
        this.disposeProperty();
        this.disposeProperty = null;
      }
      if (object instanceof Object) {
        this.disposeProperty = this.observerLocator.getObserver(object, key).subscribe(function () {
          return _this2.notify();
        });
      }
    };

    AccessKeyedObserver.prototype.objectOrKeyChanged = function objectOrKeyChanged(object, key) {
      var oo, ko;
      object = object || ((oo = this.objectInfo.observer) && oo.getValue ? oo.getValue() : this.objectInfo.value);
      key = key || ((ko = this.keyInfo.observer) && ko.getValue ? ko.getValue() : this.keyInfo.value);
      this.updatePropertySubscription(object, key);

      this.notify();
    };

    AccessKeyedObserver.prototype.subscribe = function subscribe(callback) {
      var that = this;
      that.callback = callback;
      return function () {
        that.callback = null;
      };
    };

    AccessKeyedObserver.prototype.notify = function notify() {
      var callback = this.callback;

      if (callback) {
        callback(this.evaluate());
      }
    };

    AccessKeyedObserver.prototype.dispose = function dispose() {
      this.objectInfo = null;
      this.keyInfo = null;
      this.evaluate = null;
      this.observerLocator = null;
      if (this.disposeObject) {
        this.disposeObject();
      }
      if (this.disposeKey) {
        this.disposeKey();
      }
      if (this.disposeProperty) {
        this.disposeProperty();
      }
    };

    return AccessKeyedObserver;
  })();

  exports.AccessKeyedObserver = AccessKeyedObserver;
});
define('aurelia-binding/ast',['exports', './path-observer', './composite-observer', './access-keyed-observer'], function (exports, _pathObserver, _compositeObserver, _accessKeyedObserver) {
  

  exports.__esModule = true;

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Expression = (function () {
    function Expression() {
      _classCallCheck(this, Expression);

      this.isChain = false;
      this.isAssignable = false;
    }

    Expression.prototype.evaluate = function evaluate() {
      throw new Error('Cannot evaluate ' + this);
    };

    Expression.prototype.assign = function assign() {
      throw new Error('Cannot assign to ' + this);
    };

    Expression.prototype.toString = function toString() {
      return Unparser.unparse(this);
    };

    return Expression;
  })();

  exports.Expression = Expression;

  var Chain = (function (_Expression) {
    function Chain(expressions) {
      _classCallCheck(this, Chain);

      _Expression.call(this);

      this.expressions = expressions;
      this.isChain = true;
    }

    _inherits(Chain, _Expression);

    Chain.prototype.evaluate = function evaluate(scope, valueConverters) {
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
    };

    Chain.prototype.accept = function accept(visitor) {
      visitor.visitChain(this);
    };

    return Chain;
  })(Expression);

  exports.Chain = Chain;

  var ValueConverter = (function (_Expression2) {
    function ValueConverter(expression, name, args, allArgs) {
      _classCallCheck(this, ValueConverter);

      _Expression2.call(this);

      this.expression = expression;
      this.name = name;
      this.args = args;
      this.allArgs = allArgs;
    }

    _inherits(ValueConverter, _Expression2);

    ValueConverter.prototype.evaluate = function evaluate(scope, valueConverters) {
      var converter = valueConverters(this.name);
      if (!converter) {
        throw new Error('No ValueConverter named "' + this.name + '" was found!');
      }

      if ('toView' in converter) {
        return converter.toView.apply(converter, evalList(scope, this.allArgs, valueConverters));
      }

      return this.allArgs[0].evaluate(scope, valueConverters);
    };

    ValueConverter.prototype.assign = function assign(scope, value, valueConverters) {
      var converter = valueConverters(this.name);
      if (!converter) {
        throw new Error('No ValueConverter named "' + this.name + '" was found!');
      }

      if ('fromView' in converter) {
        value = converter.fromView.apply(converter, [value].concat(evalList(scope, this.args, valueConverters)));
      }

      return this.allArgs[0].assign(scope, value, valueConverters);
    };

    ValueConverter.prototype.accept = function accept(visitor) {
      visitor.visitValueConverter(this);
    };

    ValueConverter.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };

    return ValueConverter;
  })(Expression);

  exports.ValueConverter = ValueConverter;

  var Assign = (function (_Expression3) {
    function Assign(target, value) {
      _classCallCheck(this, Assign);

      _Expression3.call(this);

      this.target = target;
      this.value = value;
    }

    _inherits(Assign, _Expression3);

    Assign.prototype.evaluate = function evaluate(scope, valueConverters) {
      return this.target.assign(scope, this.value.evaluate(scope, valueConverters));
    };

    Assign.prototype.accept = function accept(vistor) {
      vistor.visitAssign(this);
    };

    Assign.prototype.connect = function connect(binding, scope) {
      return { value: this.evaluate(scope, binding.valueConverterLookupFunction) };
    };

    return Assign;
  })(Expression);

  exports.Assign = Assign;

  var Conditional = (function (_Expression4) {
    function Conditional(condition, yes, no) {
      _classCallCheck(this, Conditional);

      _Expression4.call(this);

      this.condition = condition;
      this.yes = yes;
      this.no = no;
    }

    _inherits(Conditional, _Expression4);

    Conditional.prototype.evaluate = function evaluate(scope, valueConverters) {
      return !!this.condition.evaluate(scope) ? this.yes.evaluate(scope) : this.no.evaluate(scope);
    };

    Conditional.prototype.accept = function accept(visitor) {
      visitor.visitConditional(this);
    };

    Conditional.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this2.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: !!conditionInfo.value ? yesInfo.value : noInfo.value,
        observer: observer
      };
    };

    return Conditional;
  })(Expression);

  exports.Conditional = Conditional;

  var AccessScope = (function (_Expression5) {
    function AccessScope(name) {
      _classCallCheck(this, AccessScope);

      _Expression5.call(this);

      this.name = name;
      this.isAssignable = true;
    }

    _inherits(AccessScope, _Expression5);

    AccessScope.prototype.evaluate = function evaluate(scope, valueConverters) {
      return scope[this.name];
    };

    AccessScope.prototype.assign = function assign(scope, value) {
      return scope[this.name] = value;
    };

    AccessScope.prototype.accept = function accept(visitor) {
      visitor.visitAccessScope(this);
    };

    AccessScope.prototype.connect = function connect(binding, scope) {
      var observer = binding.getObserver(scope, this.name);

      return {
        value: observer.getValue(),
        observer: observer
      };
    };

    return AccessScope;
  })(Expression);

  exports.AccessScope = AccessScope;

  var AccessMember = (function (_Expression6) {
    function AccessMember(object, name) {
      _classCallCheck(this, AccessMember);

      _Expression6.call(this);

      this.object = object;
      this.name = name;
      this.isAssignable = true;
    }

    _inherits(AccessMember, _Expression6);

    AccessMember.prototype.evaluate = function evaluate(scope, valueConverters) {
      var instance = this.object.evaluate(scope, valueConverters);
      return instance === null || instance === undefined ? instance : instance[this.name];
    };

    AccessMember.prototype.assign = function assign(scope, value) {
      var instance = this.object.evaluate(scope);

      if (instance === null || instance === undefined) {
        instance = {};
        this.object.assign(scope, instance);
      }

      return instance[this.name] = value;
    };

    AccessMember.prototype.accept = function accept(visitor) {
      visitor.visitAccessMember(this);
    };

    AccessMember.prototype.connect = function connect(binding, scope) {
      var _this3 = this;

      var info = this.object.connect(binding, scope),
          objectInstance = info.value,
          objectObserver = info.observer,
          observer;

      if (objectObserver) {
        observer = new _pathObserver.PathObserver(objectObserver, function (value) {
          if (value == null || value == undefined) {
            return value;
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
    };

    return AccessMember;
  })(Expression);

  exports.AccessMember = AccessMember;

  var AccessKeyed = (function (_Expression7) {
    function AccessKeyed(object, key) {
      _classCallCheck(this, AccessKeyed);

      _Expression7.call(this);

      this.object = object;
      this.key = key;
      this.isAssignable = true;
    }

    _inherits(AccessKeyed, _Expression7);

    AccessKeyed.prototype.evaluate = function evaluate(scope, valueConverters) {
      var instance = this.object.evaluate(scope, valueConverters);
      var lookup = this.key.evaluate(scope, valueConverters);
      return getKeyed(instance, lookup);
    };

    AccessKeyed.prototype.assign = function assign(scope, value) {
      var instance = this.object.evaluate(scope);
      var lookup = this.key.evaluate(scope);
      return setKeyed(instance, lookup, value);
    };

    AccessKeyed.prototype.accept = function accept(visitor) {
      visitor.visitAccessKeyed(this);
    };

    AccessKeyed.prototype.connect = function connect(binding, scope) {
      var _this4 = this;

      var objectInfo = this.object.connect(binding, scope),
          keyInfo = this.key.connect(binding, scope),
          observer = new _accessKeyedObserver.AccessKeyedObserver(objectInfo, keyInfo, binding.observerLocator, function () {
        return _this4.evaluate(scope, binding.valueConverterLookupFunction);
      });

      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };

    return AccessKeyed;
  })(Expression);

  exports.AccessKeyed = AccessKeyed;

  var CallScope = (function (_Expression8) {
    function CallScope(name, args) {
      _classCallCheck(this, CallScope);

      _Expression8.call(this);

      this.name = name;
      this.args = args;
    }

    _inherits(CallScope, _Expression8);

    CallScope.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      args = args || evalList(scope, this.args, valueConverters);
      return ensureFunctionFromMap(scope, this.name).apply(scope, args);
    };

    CallScope.prototype.accept = function accept(visitor) {
      visitor.visitCallScope(this);
    };

    CallScope.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this5.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };

    return CallScope;
  })(Expression);

  exports.CallScope = CallScope;

  var CallMember = (function (_Expression9) {
    function CallMember(object, name, args) {
      _classCallCheck(this, CallMember);

      _Expression9.call(this);

      this.object = object;
      this.name = name;
      this.args = args;
    }

    _inherits(CallMember, _Expression9);

    CallMember.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      var instance = this.object.evaluate(scope, valueConverters);
      args = args || evalList(scope, this.args, valueConverters);
      return ensureFunctionFromMap(instance, this.name).apply(instance, args);
    };

    CallMember.prototype.accept = function accept(visitor) {
      visitor.visitCallMember(this);
    };

    CallMember.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this6.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };

    return CallMember;
  })(Expression);

  exports.CallMember = CallMember;

  var CallFunction = (function (_Expression10) {
    function CallFunction(func, args) {
      _classCallCheck(this, CallFunction);

      _Expression10.call(this);

      this.func = func;
      this.args = args;
    }

    _inherits(CallFunction, _Expression10);

    CallFunction.prototype.evaluate = function evaluate(scope, valueConverters, args) {
      var func = this.func.evaluate(scope, valueConverters);

      if (typeof func !== 'function') {
        throw new Error('' + this.func + ' is not a function');
      } else {
        return func.apply(null, args || evalList(scope, this.args, valueConverters));
      }
    };

    CallFunction.prototype.accept = function accept(visitor) {
      visitor.visitCallFunction(this);
    };

    CallFunction.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this7.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };

    return CallFunction;
  })(Expression);

  exports.CallFunction = CallFunction;

  var Binary = (function (_Expression11) {
    function Binary(operation, left, right) {
      _classCallCheck(this, Binary);

      _Expression11.call(this);

      this.operation = operation;
      this.left = left;
      this.right = right;
    }

    _inherits(Binary, _Expression11);

    Binary.prototype.evaluate = function evaluate(scope, valueConverters) {
      var left = this.left.evaluate(scope);

      switch (this.operation) {
        case '&&':
          return !!left && !!this.right.evaluate(scope);
        case '||':
          return !!left || !!this.right.evaluate(scope);
      }

      var right = this.right.evaluate(scope);

      switch (this.operation) {
        case '==':
          return left == right;
        case '===':
          return left === right;
        case '!=':
          return left != right;
        case '!==':
          return left !== right;
      }

      if (left === null || right === null) {
        switch (this.operation) {
          case '+':
            if (left != null) return left;
            if (right != null) return right;
            return 0;
          case '-':
            if (left != null) return left;
            if (right != null) return 0 - right;
            return 0;
        }

        return null;
      }

      switch (this.operation) {
        case '+':
          return autoConvertAdd(left, right);
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          return left / right;
        case '%':
          return left % right;
        case '<':
          return left < right;
        case '>':
          return left > right;
        case '<=':
          return left <= right;
        case '>=':
          return left >= right;
        case '^':
          return left ^ right;
        case '&':
          return left & right;
      }

      throw new Error('Internal error [' + this.operation + '] not handled');
    };

    Binary.prototype.accept = function accept(visitor) {
      visitor.visitBinary(this);
    };

    Binary.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this8.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: this.evaluate(scope, binding.valueConverterLookupFunction),
        observer: observer
      };
    };

    return Binary;
  })(Expression);

  exports.Binary = Binary;

  var PrefixNot = (function (_Expression12) {
    function PrefixNot(operation, expression) {
      _classCallCheck(this, PrefixNot);

      _Expression12.call(this);

      this.operation = operation;
      this.expression = expression;
    }

    _inherits(PrefixNot, _Expression12);

    PrefixNot.prototype.evaluate = function evaluate(scope, valueConverters) {
      return !this.expression.evaluate(scope);
    };

    PrefixNot.prototype.accept = function accept(visitor) {
      visitor.visitPrefix(this);
    };

    PrefixNot.prototype.connect = function connect(binding, scope) {
      var _this9 = this;

      var info = this.expression.connect(binding, scope),
          observer;

      if (info.observer) {
        observer = new _compositeObserver.CompositeObserver([info.observer], function () {
          return _this9.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: !info.value,
        observer: observer
      };
    };

    return PrefixNot;
  })(Expression);

  exports.PrefixNot = PrefixNot;

  var LiteralPrimitive = (function (_Expression13) {
    function LiteralPrimitive(value) {
      _classCallCheck(this, LiteralPrimitive);

      _Expression13.call(this);

      this.value = value;
    }

    _inherits(LiteralPrimitive, _Expression13);

    LiteralPrimitive.prototype.evaluate = function evaluate(scope, valueConverters) {
      return this.value;
    };

    LiteralPrimitive.prototype.accept = function accept(visitor) {
      visitor.visitLiteralPrimitive(this);
    };

    LiteralPrimitive.prototype.connect = function connect(binding, scope) {
      return { value: this.value };
    };

    return LiteralPrimitive;
  })(Expression);

  exports.LiteralPrimitive = LiteralPrimitive;

  var LiteralString = (function (_Expression14) {
    function LiteralString(value) {
      _classCallCheck(this, LiteralString);

      _Expression14.call(this);

      this.value = value;
    }

    _inherits(LiteralString, _Expression14);

    LiteralString.prototype.evaluate = function evaluate(scope, valueConverters) {
      return this.value;
    };

    LiteralString.prototype.accept = function accept(visitor) {
      visitor.visitLiteralString(this);
    };

    LiteralString.prototype.connect = function connect(binding, scope) {
      return { value: this.value };
    };

    return LiteralString;
  })(Expression);

  exports.LiteralString = LiteralString;

  var LiteralArray = (function (_Expression15) {
    function LiteralArray(elements) {
      _classCallCheck(this, LiteralArray);

      _Expression15.call(this);

      this.elements = elements;
    }

    _inherits(LiteralArray, _Expression15);

    LiteralArray.prototype.evaluate = function evaluate(scope, valueConverters) {
      var elements = this.elements,
          length = elements.length,
          result = [],
          i;

      for (i = 0; i < length; ++i) {
        result[i] = elements[i].evaluate(scope, valueConverters);
      }

      return result;
    };

    LiteralArray.prototype.accept = function accept(visitor) {
      visitor.visitLiteralArray(this);
    };

    LiteralArray.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this10.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: results,
        observer: observer
      };
    };

    return LiteralArray;
  })(Expression);

  exports.LiteralArray = LiteralArray;

  var LiteralObject = (function (_Expression16) {
    function LiteralObject(keys, values) {
      _classCallCheck(this, LiteralObject);

      _Expression16.call(this);

      this.keys = keys;
      this.values = values;
    }

    _inherits(LiteralObject, _Expression16);

    LiteralObject.prototype.evaluate = function evaluate(scope, valueConverters) {
      var instance = {},
          keys = this.keys,
          values = this.values,
          length = keys.length,
          i;

      for (i = 0; i < length; ++i) {
        instance[keys[i]] = values[i].evaluate(scope, valueConverters);
      }

      return instance;
    };

    LiteralObject.prototype.accept = function accept(visitor) {
      visitor.visitLiteralObject(this);
    };

    LiteralObject.prototype.connect = function connect(binding, scope) {
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
        observer = new _compositeObserver.CompositeObserver(childObservers, function () {
          return _this11.evaluate(scope, binding.valueConverterLookupFunction);
        });
      }

      return {
        value: instance,
        observer: observer
      };
    };

    return LiteralObject;
  })(Expression);

  exports.LiteralObject = LiteralObject;

  var Unparser = (function () {
    function Unparser(buffer) {
      _classCallCheck(this, Unparser);

      this.buffer = buffer;
    }

    Unparser.unparse = function unparse(expression) {
      var buffer = [],
          visitor = new Unparser(buffer);

      expression.accept(visitor);

      return buffer.join('');
    };

    Unparser.prototype.write = function write(text) {
      this.buffer.push(text);
    };

    Unparser.prototype.writeArgs = function writeArgs(args) {
      var i, length;

      this.write('(');

      for (i = 0, length = args.length; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }

        args[i].accept(this);
      }

      this.write(')');
    };

    Unparser.prototype.visitChain = function visitChain(chain) {
      var expressions = chain.expressions,
          length = expressions.length,
          i;

      for (i = 0; i < length; ++i) {
        if (i !== 0) {
          this.write(';');
        }

        expressions[i].accept(this);
      }
    };

    Unparser.prototype.visitValueConverter = function visitValueConverter(converter) {
      var args = converter.args,
          length = args.length,
          i;

      this.write('(');
      converter.expression.accept(this);
      this.write('|' + converter.name);

      for (i = 0; i < length; ++i) {
        this.write(' :');
        args[i].accept(this);
      }

      this.write(')');
    };

    Unparser.prototype.visitAssign = function visitAssign(assign) {
      assign.target.accept(this);
      this.write('=');
      assign.value.accept(this);
    };

    Unparser.prototype.visitConditional = function visitConditional(conditional) {
      conditional.condition.accept(this);
      this.write('?');
      conditional.yes.accept(this);
      this.write(':');
      conditional.no.accept(this);
    };

    Unparser.prototype.visitAccessScope = function visitAccessScope(access) {
      this.write(access.name);
    };

    Unparser.prototype.visitAccessMember = function visitAccessMember(access) {
      access.object.accept(this);
      this.write('.' + access.name);
    };

    Unparser.prototype.visitAccessKeyed = function visitAccessKeyed(access) {
      access.object.accept(this);
      this.write('[');
      access.key.accept(this);
      this.write(']');
    };

    Unparser.prototype.visitCallScope = function visitCallScope(call) {
      this.write(call.name);
      this.writeArgs(call.args);
    };

    Unparser.prototype.visitCallFunction = function visitCallFunction(call) {
      call.func.accept(this);
      this.writeArgs(call.args);
    };

    Unparser.prototype.visitCallMember = function visitCallMember(call) {
      call.object.accept(this);
      this.write('.' + call.name);
      this.writeArgs(call.args);
    };

    Unparser.prototype.visitPrefix = function visitPrefix(prefix) {
      this.write('(' + prefix.operation);
      prefix.expression.accept(this);
      this.write(')');
    };

    Unparser.prototype.visitBinary = function visitBinary(binary) {
      this.write('(');
      binary.left.accept(this);
      this.write(binary.operation);
      binary.right.accept(this);
      this.write(')');
    };

    Unparser.prototype.visitLiteralPrimitive = function visitLiteralPrimitive(literal) {
      this.write('' + literal.value);
    };

    Unparser.prototype.visitLiteralArray = function visitLiteralArray(literal) {
      var elements = literal.elements,
          length = elements.length,
          i;

      this.write('[');

      for (i = 0; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }

        elements[i].accept(this);
      }

      this.write(']');
    };

    Unparser.prototype.visitLiteralObject = function visitLiteralObject(literal) {
      var keys = literal.keys,
          values = literal.values,
          length = keys.length,
          i;

      this.write('{');

      for (i = 0; i < length; ++i) {
        if (i !== 0) {
          this.write(',');
        }

        this.write('\'' + keys[i] + '\':');
        values[i].accept(this);
      }

      this.write('}');
    };

    Unparser.prototype.visitLiteralString = function visitLiteralString(literal) {
      var escaped = literal.value.replace(/'/g, '\'');
      this.write('\'' + escaped + '\'');
    };

    return Unparser;
  })();

  exports.Unparser = Unparser;

  var evalListCache = [[], [0], [0, 0], [0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0, 0]];

  function evalList(scope, list, valueConverters) {
    var length = list.length,
        cacheLength,
        i;

    for (cacheLength = evalListCache.length; cacheLength <= length; ++cacheLength) {
      evalListCache.push([]);
    }

    var result = evalListCache[length];

    for (i = 0; i < length; ++i) {
      result[i] = list[i].evaluate(scope, valueConverters);
    }

    return result;
  }

  function autoConvertAdd(a, b) {
    if (a != null && b != null) {
      if (typeof a == 'string' && typeof b != 'string') {
        return a + b.toString();
      }

      if (typeof a != 'string' && typeof b == 'string') {
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

    if (typeof func === 'function') {
      return func;
    }

    if (func === null) {
      throw new Error('Undefined function ' + name);
    } else {
      throw new Error('' + name + ' is not a function');
    }
  }

  function getKeyed(obj, key) {
    if (Array.isArray(obj)) {
      return obj[parseInt(key)];
    } else if (obj) {
      return obj[key];
    } else if (obj === null) {
      throw new Error('Accessing null object');
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
define('aurelia-binding/parser',['exports', './lexer', './ast'], function (exports, _lexer, _ast) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var EOF = new _lexer.Token(-1, null);

  var Parser = (function () {
    function Parser() {
      _classCallCheck(this, Parser);

      this.cache = {};
      this.lexer = new _lexer.Lexer();
    }

    Parser.prototype.parse = function parse(input) {
      input = input || '';

      return this.cache[input] || (this.cache[input] = new ParserImplementation(this.lexer, input).parseChain());
    };

    return Parser;
  })();

  exports.Parser = Parser;

  var ParserImplementation = (function () {
    function ParserImplementation(lexer, input) {
      _classCallCheck(this, ParserImplementation);

      this.index = 0;
      this.input = input;
      this.tokens = lexer.lex(input);
    }

    ParserImplementation.prototype.parseChain = function parseChain() {
      var isChain = false,
          expressions = [];

      while (this.optional(';')) {
        isChain = true;
      }

      while (this.index < this.tokens.length) {
        if (this.peek.text === ')' || this.peek.text === '}' || this.peek.text === ']') {
          this.error('Unconsumed token ' + this.peek.text);
        }

        var expr = this.parseValueConverter();
        expressions.push(expr);

        while (this.optional(';')) {
          isChain = true;
        }

        if (isChain && expr instanceof _ast.ValueConverter) {
          this.error('cannot have a value converter in a chain');
        }
      }

      return expressions.length === 1 ? expressions[0] : new _ast.Chain(expressions);
    };

    ParserImplementation.prototype.parseValueConverter = function parseValueConverter() {
      var result = this.parseExpression();

      while (this.optional('|')) {
        var name = this.peek.text,
            args = [];

        this.advance();

        while (this.optional(':')) {
          args.push(this.parseExpression());
        }

        result = new _ast.ValueConverter(result, name, args, [result].concat(args));
      }

      return result;
    };

    ParserImplementation.prototype.parseExpression = function parseExpression() {
      var start = this.peek.index,
          result = this.parseConditional();

      while (this.peek.text === '=') {
        if (!result.isAssignable) {
          var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
          var expression = this.input.substring(start, end);

          this.error('Expression ' + expression + ' is not assignable');
        }

        this.expect('=');
        result = new _ast.Assign(result, this.parseConditional());
      }

      return result;
    };

    ParserImplementation.prototype.parseConditional = function parseConditional() {
      var start = this.peek.index,
          result = this.parseLogicalOr();

      if (this.optional('?')) {
        var yes = this.parseExpression();

        if (!this.optional(':')) {
          var end = this.index < this.tokens.length ? this.peek.index : this.input.length;
          var expression = this.input.substring(start, end);

          this.error('Conditional expression ' + expression + ' requires all 3 expressions');
        }

        var no = this.parseExpression();
        result = new _ast.Conditional(result, yes, no);
      }

      return result;
    };

    ParserImplementation.prototype.parseLogicalOr = function parseLogicalOr() {
      var result = this.parseLogicalAnd();

      while (this.optional('||')) {
        result = new _ast.Binary('||', result, this.parseLogicalAnd());
      }

      return result;
    };

    ParserImplementation.prototype.parseLogicalAnd = function parseLogicalAnd() {
      var result = this.parseEquality();

      while (this.optional('&&')) {
        result = new _ast.Binary('&&', result, this.parseEquality());
      }

      return result;
    };

    ParserImplementation.prototype.parseEquality = function parseEquality() {
      var result = this.parseRelational();

      while (true) {
        if (this.optional('==')) {
          result = new _ast.Binary('==', result, this.parseRelational());
        } else if (this.optional('!=')) {
          result = new _ast.Binary('!=', result, this.parseRelational());
        } else if (this.optional('===')) {
          result = new _ast.Binary('===', result, this.parseRelational());
        } else if (this.optional('!==')) {
          result = new _ast.Binary('!==', result, this.parseRelational());
        } else {
          return result;
        }
      }
    };

    ParserImplementation.prototype.parseRelational = function parseRelational() {
      var result = this.parseAdditive();

      while (true) {
        if (this.optional('<')) {
          result = new _ast.Binary('<', result, this.parseAdditive());
        } else if (this.optional('>')) {
          result = new _ast.Binary('>', result, this.parseAdditive());
        } else if (this.optional('<=')) {
          result = new _ast.Binary('<=', result, this.parseAdditive());
        } else if (this.optional('>=')) {
          result = new _ast.Binary('>=', result, this.parseAdditive());
        } else {
          return result;
        }
      }
    };

    ParserImplementation.prototype.parseAdditive = function parseAdditive() {
      var result = this.parseMultiplicative();

      while (true) {
        if (this.optional('+')) {
          result = new _ast.Binary('+', result, this.parseMultiplicative());
        } else if (this.optional('-')) {
          result = new _ast.Binary('-', result, this.parseMultiplicative());
        } else {
          return result;
        }
      }
    };

    ParserImplementation.prototype.parseMultiplicative = function parseMultiplicative() {
      var result = this.parsePrefix();

      while (true) {
        if (this.optional('*')) {
          result = new _ast.Binary('*', result, this.parsePrefix());
        } else if (this.optional('%')) {
          result = new _ast.Binary('%', result, this.parsePrefix());
        } else if (this.optional('/')) {
          result = new _ast.Binary('/', result, this.parsePrefix());
        } else {
          return result;
        }
      }
    };

    ParserImplementation.prototype.parsePrefix = function parsePrefix() {
      if (this.optional('+')) {
        return this.parsePrefix();
      } else if (this.optional('-')) {
        return new _ast.Binary('-', new _ast.LiteralPrimitive(0), this.parsePrefix());
      } else if (this.optional('!')) {
        return new _ast.PrefixNot('!', this.parsePrefix());
      } else {
        return this.parseAccessOrCallMember();
      }
    };

    ParserImplementation.prototype.parseAccessOrCallMember = function parseAccessOrCallMember() {
      var result = this.parsePrimary();

      while (true) {
        if (this.optional('.')) {
          var name = this.peek.text;

          this.advance();

          if (this.optional('(')) {
            var args = this.parseExpressionList(')');
            this.expect(')');
            result = new _ast.CallMember(result, name, args);
          } else {
            result = new _ast.AccessMember(result, name);
          }
        } else if (this.optional('[')) {
          var key = this.parseExpression();
          this.expect(']');
          result = new _ast.AccessKeyed(result, key);
        } else if (this.optional('(')) {
          var args = this.parseExpressionList(')');
          this.expect(')');
          result = new _ast.CallFunction(result, args);
        } else {
          return result;
        }
      }
    };

    ParserImplementation.prototype.parsePrimary = function parsePrimary() {
      if (this.optional('(')) {
        var result = this.parseExpression();
        this.expect(')');
        return result;
      } else if (this.optional('null') || this.optional('undefined')) {
        return new _ast.LiteralPrimitive(null);
      } else if (this.optional('true')) {
        return new _ast.LiteralPrimitive(true);
      } else if (this.optional('false')) {
        return new _ast.LiteralPrimitive(false);
      } else if (this.optional('[')) {
        var elements = this.parseExpressionList(']');
        this.expect(']');
        return new _ast.LiteralArray(elements);
      } else if (this.peek.text == '{') {
        return this.parseObject();
      } else if (this.peek.key != null) {
        return this.parseAccessOrCallScope();
      } else if (this.peek.value != null) {
        var value = this.peek.value;
        this.advance();
        return isNaN(value) ? new _ast.LiteralString(value) : new _ast.LiteralPrimitive(value);
      } else if (this.index >= this.tokens.length) {
        throw new Error('Unexpected end of expression: ' + this.input);
      } else {
        this.error('Unexpected token ' + this.peek.text);
      }
    };

    ParserImplementation.prototype.parseAccessOrCallScope = function parseAccessOrCallScope() {
      var name = this.peek.key;

      this.advance();

      if (!this.optional('(')) {
        return new _ast.AccessScope(name);
      }

      var args = this.parseExpressionList(')');
      this.expect(')');
      return new _ast.CallScope(name, args);
    };

    ParserImplementation.prototype.parseObject = function parseObject() {
      var keys = [],
          values = [];

      this.expect('{');

      if (this.peek.text !== '}') {
        do {
          var value = this.peek.value;
          keys.push(typeof value === 'string' ? value : this.peek.text);

          this.advance();
          this.expect(':');

          values.push(this.parseExpression());
        } while (this.optional(','));
      }

      this.expect('}');

      return new _ast.LiteralObject(keys, values);
    };

    ParserImplementation.prototype.parseExpressionList = function parseExpressionList(terminator) {
      var result = [];

      if (this.peek.text != terminator) {
        do {
          result.push(this.parseExpression());
        } while (this.optional(','));
      }

      return result;
    };

    ParserImplementation.prototype.optional = function optional(text) {
      if (this.peek.text === text) {
        this.advance();
        return true;
      }

      return false;
    };

    ParserImplementation.prototype.expect = function expect(text) {
      if (this.peek.text === text) {
        this.advance();
      } else {
        this.error('Missing expected ' + text);
      }
    };

    ParserImplementation.prototype.advance = function advance() {
      this.index++;
    };

    ParserImplementation.prototype.error = function error(message) {
      var location = this.index < this.tokens.length ? 'at column ' + (this.tokens[this.index].index + 1) + ' in' : 'at the end of the expression';

      throw new Error('Parser Error: ' + message + ' ' + location + ' [' + this.input + ']');
    };

    _createClass(ParserImplementation, [{
      key: 'peek',
      get: function () {
        return this.index < this.tokens.length ? this.tokens[this.index] : EOF;
      }
    }]);

    return ParserImplementation;
  })();

  exports.ParserImplementation = ParserImplementation;
});
define('aurelia-binding/binding-expression',['exports', './binding-modes'], function (exports, _bindingModes) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BindingExpression = (function () {
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

    BindingExpression.prototype.createBinding = function createBinding(target) {
      return new Binding(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
    };

    return BindingExpression;
  })();

  exports.BindingExpression = BindingExpression;

  var Binding = (function () {
    function Binding(observerLocator, sourceExpression, target, targetProperty, mode, valueConverterLookupFunction) {
      _classCallCheck(this, Binding);

      this.observerLocator = observerLocator;
      this.sourceExpression = sourceExpression;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }

    Binding.prototype.getObserver = function getObserver(obj, propertyName) {
      return this.observerLocator.getObserver(obj, propertyName);
    };

    Binding.prototype.bind = function bind(source) {
      var _this = this;

      var targetProperty = this.targetProperty,
          info;

      if ('bind' in targetProperty) {
        targetProperty.bind();
      }

      if (this.mode == _bindingModes.bindingMode.oneWay || this.mode == _bindingModes.bindingMode.twoWay) {
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

        if (this.mode == _bindingModes.bindingMode.twoWay) {
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
    };

    Binding.prototype.unbind = function unbind() {
      if ('unbind' in this.targetProperty) {
        this.targetProperty.unbind();
      }
      if (this._disposeObserver) {
        this._disposeObserver();
        this._disposeObserver = null;
      }

      if (this._disposeListener) {
        this._disposeListener();
        this._disposeListener = null;
      }
    };

    return Binding;
  })();
});
define('aurelia-binding/listener-expression',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var ListenerExpression = (function () {
    function ListenerExpression(eventManager, targetEvent, sourceExpression, delegate, preventDefault) {
      _classCallCheck(this, ListenerExpression);

      this.eventManager = eventManager;
      this.targetEvent = targetEvent;
      this.sourceExpression = sourceExpression;
      this.delegate = delegate;
      this.discrete = true;
      this.preventDefault = preventDefault;
    }

    ListenerExpression.prototype.createBinding = function createBinding(target) {
      return new Listener(this.eventManager, this.targetEvent, this.delegate, this.sourceExpression, target, this.preventDefault);
    };

    return ListenerExpression;
  })();

  exports.ListenerExpression = ListenerExpression;

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

    Listener.prototype.bind = function bind(source) {
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
    };

    Listener.prototype.unbind = function unbind() {
      if (this._disposeListener) {
        this._disposeListener();
        this._disposeListener = null;
      }
    };

    return Listener;
  })();
});
define('aurelia-binding/name-expression',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var NameExpression = (function () {
    function NameExpression(name, mode) {
      _classCallCheck(this, NameExpression);

      this.property = name;
      this.discrete = true;
      this.mode = (mode || 'view-model').toLowerCase();
    }

    NameExpression.prototype.createBinding = function createBinding(target) {
      return new NameBinder(this.property, target, this.mode);
    };

    return NameExpression;
  })();

  exports.NameExpression = NameExpression;

  var NameBinder = (function () {
    function NameBinder(property, target, mode) {
      _classCallCheck(this, NameBinder);

      this.property = property;

      switch (mode) {
        case 'element':
          this.target = target;
          break;
        case 'view-model':
          this.target = target.primaryBehavior ? target.primaryBehavior.executionContext : target;
          break;
        default:
          throw new Error('Name expressions do not support mode: ' + mode);
      }
    }

    NameBinder.prototype.bind = function bind(source) {
      if (this.source) {
        if (this.source === source) {
          return;
        }

        this.unbind();
      }

      this.source = source;
      source[this.property] = this.target;
    };

    NameBinder.prototype.unbind = function unbind() {
      this.source[this.property] = null;
    };

    return NameBinder;
  })();
});
define('aurelia-binding/call-expression',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var CallExpression = (function () {
    function CallExpression(observerLocator, targetProperty, sourceExpression, valueConverterLookupFunction) {
      _classCallCheck(this, CallExpression);

      this.observerLocator = observerLocator;
      this.targetProperty = targetProperty;
      this.sourceExpression = sourceExpression;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }

    CallExpression.prototype.createBinding = function createBinding(target) {
      return new Call(this.observerLocator, this.sourceExpression, target, this.targetProperty, this.valueConverterLookupFunction);
    };

    return CallExpression;
  })();

  exports.CallExpression = CallExpression;

  var Call = (function () {
    function Call(observerLocator, sourceExpression, target, targetProperty, valueConverterLookupFunction) {
      _classCallCheck(this, Call);

      this.sourceExpression = sourceExpression;
      this.target = target;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.valueConverterLookupFunction = valueConverterLookupFunction;
    }

    Call.prototype.bind = function bind(source) {
      var _this = this;

      if (this.source === source) {
        return;
      }

      if (this.source) {
        this.unbind();
      }

      this.source = source;
      this.targetProperty.setValue(function ($event) {
        var result,
            temp = source.$event;
        source.$event = $event;
        result = _this.sourceExpression.evaluate(source, _this.valueConverterLookupFunction);
        source.$event = temp;
        return result;
      });
    };

    Call.prototype.unbind = function unbind() {
      this.targetProperty.setValue(null);
    };

    return Call;
  })();
});
define('aurelia-binding/index',['exports', 'aurelia-metadata', './value-converter', './event-manager', './observer-locator', './array-change-records', './binding-modes', './parser', './binding-expression', './listener-expression', './name-expression', './call-expression', './dirty-checking', './map-change-records', './computed-observation'], function (exports, _aureliaMetadata, _valueConverter, _eventManager, _observerLocator, _arrayChangeRecords, _bindingModes, _parser, _bindingExpression, _listenerExpression, _nameExpression, _callExpression, _dirtyChecking, _mapChangeRecords, _computedObservation) {
  

  exports.__esModule = true;
  exports.valueConverter = valueConverter;
  exports.computedFrom = computedFrom;

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  exports.EventManager = _eventManager.EventManager;
  exports.ObserverLocator = _observerLocator.ObserverLocator;
  exports.ObjectObservationAdapter = _observerLocator.ObjectObservationAdapter;
  exports.ValueConverterResource = _valueConverter.ValueConverterResource;
  exports.calcSplices = _arrayChangeRecords.calcSplices;

  _defaults(exports, _interopRequireWildcard(_bindingModes));

  exports.Parser = _parser.Parser;
  exports.BindingExpression = _bindingExpression.BindingExpression;
  exports.ListenerExpression = _listenerExpression.ListenerExpression;
  exports.NameExpression = _nameExpression.NameExpression;
  exports.CallExpression = _callExpression.CallExpression;
  exports.DirtyChecker = _dirtyChecking.DirtyChecker;
  exports.getChangeRecords = _mapChangeRecords.getChangeRecords;
  exports.ComputedPropertyObserver = _computedObservation.ComputedPropertyObserver;
  exports.declarePropertyDependencies = _computedObservation.declarePropertyDependencies;

  function valueConverter(nameOrTarget) {
    if (nameOrTarget === undefined || typeof nameOrTarget === 'string') {
      return function (target) {
        Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, new _valueConverter.ValueConverterResource(nameOrTarget), target);
      };
    }

    Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, new _valueConverter.ValueConverterResource(), nameOrTarget);
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('valueConverter', valueConverter);

  function computedFrom() {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return function (target, key, descriptor) {
      if (descriptor.set) {
        throw new Error('The computed property "' + key + '" cannot have a setter function.');
      }
      descriptor.get.dependencies = rest;
      return descriptor;
    };
  }
});
define('aurelia-binding', ['aurelia-binding/index'], function (main) { return main; });

define('aurelia-templating/view-strategy',['exports', 'aurelia-metadata', 'aurelia-path'], function (exports, _aureliaMetadata, _aureliaPath) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ViewStrategy = (function () {
    function ViewStrategy() {
      _classCallCheck(this, ViewStrategy);
    }

    ViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(baseUrl) {};

    ViewStrategy.normalize = function normalize(value) {
      if (typeof value === 'string') {
        value = new UseViewStrategy(value);
      }

      if (value && !(value instanceof ViewStrategy)) {
        throw new Error('The view must be a string or an instance of ViewStrategy.');
      }

      return value;
    };

    ViewStrategy.getDefault = function getDefault(target) {
      var strategy, annotation;

      if (typeof target !== 'function') {
        target = target.constructor;
      }

      annotation = _aureliaMetadata.Origin.get(target);
      strategy = _aureliaMetadata.Metadata.get(ViewStrategy.metadataKey, target);

      if (!strategy) {
        if (!annotation) {
          throw new Error('Cannot determinte default view strategy for object.', target);
        }

        strategy = new ConventionalViewStrategy(annotation.moduleId);
      } else if (annotation) {
        strategy.moduleId = annotation.moduleId;
      }

      return strategy;
    };

    _createClass(ViewStrategy, null, [{
      key: 'metadataKey',
      value: 'aurelia:view-strategy',
      enumerable: true
    }]);

    return ViewStrategy;
  })();

  exports.ViewStrategy = ViewStrategy;

  var UseViewStrategy = (function (_ViewStrategy) {
    function UseViewStrategy(path) {
      _classCallCheck(this, UseViewStrategy);

      _ViewStrategy.call(this);
      this.path = path;
    }

    _inherits(UseViewStrategy, _ViewStrategy);

    UseViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options) {
      if (!this.absolutePath && this.moduleId) {
        this.absolutePath = _aureliaPath.relativeToFile(this.path, this.moduleId);
      }

      return viewEngine.loadViewFactory(this.absolutePath || this.path, options, this.moduleId);
    };

    UseViewStrategy.prototype.makeRelativeTo = function makeRelativeTo(file) {
      this.absolutePath = _aureliaPath.relativeToFile(this.path, file);
    };

    return UseViewStrategy;
  })(ViewStrategy);

  exports.UseViewStrategy = UseViewStrategy;

  var ConventionalViewStrategy = (function (_ViewStrategy2) {
    function ConventionalViewStrategy(moduleId) {
      _classCallCheck(this, ConventionalViewStrategy);

      _ViewStrategy2.call(this);
      this.moduleId = moduleId;
      this.viewUrl = ConventionalViewStrategy.convertModuleIdToViewUrl(moduleId);
    }

    _inherits(ConventionalViewStrategy, _ViewStrategy2);

    ConventionalViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options) {
      return viewEngine.loadViewFactory(this.viewUrl, options, this.moduleId);
    };

    ConventionalViewStrategy.convertModuleIdToViewUrl = function convertModuleIdToViewUrl(moduleId) {
      return moduleId + '.html';
    };

    return ConventionalViewStrategy;
  })(ViewStrategy);

  exports.ConventionalViewStrategy = ConventionalViewStrategy;

  var NoViewStrategy = (function (_ViewStrategy3) {
    function NoViewStrategy() {
      _classCallCheck(this, NoViewStrategy);

      if (_ViewStrategy3 != null) {
        _ViewStrategy3.apply(this, arguments);
      }
    }

    _inherits(NoViewStrategy, _ViewStrategy3);

    NoViewStrategy.prototype.loadViewFactory = function loadViewFactory() {
      return Promise.resolve(null);
    };

    return NoViewStrategy;
  })(ViewStrategy);

  exports.NoViewStrategy = NoViewStrategy;

  var TemplateRegistryViewStrategy = (function (_ViewStrategy4) {
    function TemplateRegistryViewStrategy(moduleId, registryEntry) {
      _classCallCheck(this, TemplateRegistryViewStrategy);

      _ViewStrategy4.call(this);
      this.moduleId = moduleId;
      this.registryEntry = registryEntry;
    }

    _inherits(TemplateRegistryViewStrategy, _ViewStrategy4);

    TemplateRegistryViewStrategy.prototype.loadViewFactory = function loadViewFactory(viewEngine, options) {
      if (this.registryEntry.isReady) {
        return Promise.resolve(this.registryEntry.factory);
      }

      return viewEngine.loadViewFactory(this.registryEntry, options, this.moduleId);
    };

    return TemplateRegistryViewStrategy;
  })(ViewStrategy);

  exports.TemplateRegistryViewStrategy = TemplateRegistryViewStrategy;
});
define('aurelia-templating/resource-registry',['exports', 'aurelia-path'], function (exports, _aureliaPath) {
  

  exports.__esModule = true;

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function register(lookup, name, resource, type) {
    if (!name) {
      return;
    }

    var existing = lookup[name];
    if (existing) {
      if (existing != resource) {
        throw new Error('Attempted to register ' + type + ' when one with the same name already exists. Name: ' + name + '.');
      }

      return;
    }

    lookup[name] = resource;
  }

  var ResourceRegistry = (function () {
    function ResourceRegistry() {
      _classCallCheck(this, ResourceRegistry);

      this.attributes = {};
      this.elements = {};
      this.valueConverters = {};
      this.attributeMap = {};
      this.baseResourceUrl = '';
    }

    ResourceRegistry.prototype.registerElement = function registerElement(tagName, behavior) {
      register(this.elements, tagName, behavior, 'an Element');
    };

    ResourceRegistry.prototype.getElement = function getElement(tagName) {
      return this.elements[tagName];
    };

    ResourceRegistry.prototype.registerAttribute = function registerAttribute(attribute, behavior, knownAttribute) {
      this.attributeMap[attribute] = knownAttribute;
      register(this.attributes, attribute, behavior, 'an Attribute');
    };

    ResourceRegistry.prototype.getAttribute = function getAttribute(attribute) {
      return this.attributes[attribute];
    };

    ResourceRegistry.prototype.registerValueConverter = function registerValueConverter(name, valueConverter) {
      register(this.valueConverters, name, valueConverter, 'a ValueConverter');
    };

    ResourceRegistry.prototype.getValueConverter = function getValueConverter(name) {
      return this.valueConverters[name];
    };

    return ResourceRegistry;
  })();

  exports.ResourceRegistry = ResourceRegistry;

  var ViewResources = (function (_ResourceRegistry) {
    function ViewResources(parent, viewUrl) {
      _classCallCheck(this, ViewResources);

      _ResourceRegistry.call(this);
      this.parent = parent;
      this.viewUrl = viewUrl;
      this.valueConverterLookupFunction = this.getValueConverter.bind(this);
    }

    _inherits(ViewResources, _ResourceRegistry);

    ViewResources.prototype.relativeToView = function relativeToView(path) {
      return _aureliaPath.relativeToFile(path, this.viewUrl);
    };

    ViewResources.prototype.getElement = function getElement(tagName) {
      return this.elements[tagName] || this.parent.getElement(tagName);
    };

    ViewResources.prototype.mapAttribute = function mapAttribute(attribute) {
      return this.attributeMap[attribute] || this.parent.attributeMap[attribute];
    };

    ViewResources.prototype.getAttribute = function getAttribute(attribute) {
      return this.attributes[attribute] || this.parent.getAttribute(attribute);
    };

    ViewResources.prototype.getValueConverter = function getValueConverter(name) {
      return this.valueConverters[name] || this.parent.getValueConverter(name);
    };

    return ViewResources;
  })(ResourceRegistry);

  exports.ViewResources = ViewResources;
});
define('aurelia-templating/view',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var View = (function () {
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

    View.prototype.created = function created(executionContext) {
      var i,
          ii,
          behaviors = this.behaviors;
      for (i = 0, ii = behaviors.length; i < ii; ++i) {
        behaviors[i].created(executionContext);
      }
    };

    View.prototype.bind = function bind(executionContext, systemUpdate) {
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
    };

    View.prototype.addBinding = function addBinding(binding) {
      this.bindings.push(binding);

      if (this.isBound) {
        binding.bind(this.executionContext);
      }
    };

    View.prototype.unbind = function unbind() {
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
    };

    View.prototype.insertNodesBefore = function insertNodesBefore(refNode) {
      var parent = refNode.parentNode;
      parent.insertBefore(this.fragment, refNode);
    };

    View.prototype.appendNodesTo = function appendNodesTo(parent) {
      parent.appendChild(this.fragment);
    };

    View.prototype.removeNodes = function removeNodes() {
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
    };

    View.prototype.attached = function attached() {
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
    };

    View.prototype.detached = function detached() {
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
    };

    return View;
  })();

  exports.View = View;
});
define('aurelia-templating/content-selector',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

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

    return insertionPoint;
  }

  var ContentSelector = (function () {
    function ContentSelector(anchor, selector) {
      _classCallCheck(this, ContentSelector);

      this.anchor = anchor;
      this.selector = selector;
      this.all = !this.selector;
      this.groups = [];
    }

    ContentSelector.applySelectors = function applySelectors(view, contentSelectors, callback) {
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
    };

    ContentSelector.prototype.copyForViewSlot = function copyForViewSlot() {
      return new ContentSelector(this.anchor, this.selector);
    };

    ContentSelector.prototype.matches = function matches(node) {
      return this.all || node.nodeType === 1 && node.matches(this.selector);
    };

    ContentSelector.prototype.add = function add(group) {
      var anchor = this.anchor,
          parent = anchor.parentNode,
          i,
          ii;

      for (i = 0, ii = group.length; i < ii; ++i) {
        parent.insertBefore(group[i], anchor);
      }

      this.groups.push(group);
    };

    ContentSelector.prototype.insert = function insert(index, group) {
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
    };

    ContentSelector.prototype.removeAt = function removeAt(index, fragment) {
      var group = this.groups[index],
          i,
          ii;

      for (i = 0, ii = group.length; i < ii; ++i) {
        fragment.appendChild(group[i]);
      }

      this.groups.splice(index, 1);
    };

    return ContentSelector;
  })();

  exports.ContentSelector = ContentSelector;
});
define('aurelia-templating/animator',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Animator = (function () {
    function Animator() {
      _classCallCheck(this, Animator);
    }

    Animator.configureDefault = function configureDefault(container, animatorInstance) {
      container.registerInstance(Animator, Animator.instance = animatorInstance || new Animator());
    };

    Animator.prototype.move = function move() {
      return Promise.resolve(false);
    };

    Animator.prototype.enter = function enter(element) {
      return Promise.resolve(false);
    };

    Animator.prototype.leave = function leave(element) {
      return Promise.resolve(false);
    };

    Animator.prototype.removeClass = function removeClass(element, className) {
      return Promise.resolve(false);
    };

    Animator.prototype.addClass = function addClass(element, className) {
      return Promise.resolve(false);
    };

    return Animator;
  })();

  exports.Animator = Animator;
});
define('aurelia-templating/view-slot',['exports', './content-selector', './animator'], function (exports, _contentSelector, _animator) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ViewSlot = (function () {
    function ViewSlot(anchor, anchorIsContainer, executionContext) {
      var animator = arguments[3] === undefined ? _animator.Animator.instance : arguments[3];

      _classCallCheck(this, ViewSlot);

      this.anchor = anchor;
      this.viewAddMethod = anchorIsContainer ? 'appendNodesTo' : 'insertNodesBefore';
      this.executionContext = executionContext;
      this.animator = animator;
      this.children = [];
      this.isBound = false;
      this.isAttached = false;
      anchor.viewSlot = this;
    }

    ViewSlot.prototype.transformChildNodesIntoView = function transformChildNodesIntoView() {
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
    };

    ViewSlot.prototype.bind = function bind(executionContext) {
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
    };

    ViewSlot.prototype.unbind = function unbind() {
      var i,
          ii,
          children = this.children;
      this.isBound = false;

      for (i = 0, ii = children.length; i < ii; ++i) {
        children[i].unbind();
      }
    };

    ViewSlot.prototype.add = function add(view) {
      view[this.viewAddMethod](this.anchor);
      this.children.push(view);

      if (this.isAttached) {
        view.attached();

        var element = view.firstChild ? view.firstChild.nextElementSibling : null;
        if (view.firstChild && view.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains('au-animate')) {
          this.animator.enter(element);
        }
      }
    };

    ViewSlot.prototype.insert = function insert(index, view) {
      if (index === 0 && !this.children.length || index >= this.children.length) {
        this.add(view);
      } else {
        view.insertNodesBefore(this.children[index].firstChild);
        this.children.splice(index, 0, view);

        if (this.isAttached) {
          view.attached();
        }
      }
    };

    ViewSlot.prototype.remove = function remove(view) {
      view.removeNodes();

      this.children.splice(this.children.indexOf(view), 1);

      if (this.isAttached) {
        view.detached();
      }
    };

    ViewSlot.prototype.removeAt = function removeAt(index) {
      var _this = this;

      var view = this.children[index];

      var removeAction = function removeAction() {
        view.removeNodes();
        _this.children.splice(index, 1);

        if (_this.isAttached) {
          view.detached();
        }

        return view;
      };

      var element = view.firstChild && view.firstChild.nextElementSibling ? view.firstChild.nextElementSibling : null;
      if (view.firstChild && view.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains('au-animate')) {
        return this.animator.leave(element).then(function () {
          return removeAction();
        });
      } else {
        return removeAction();
      }
    };

    ViewSlot.prototype.removeAll = function removeAll() {
      var _this2 = this;

      var children = this.children,
          ii = children.length,
          i;

      var rmPromises = [];

      children.forEach(function (child) {
        var element = child.firstChild ? child.firstChild.nextElementSibling : null;
        if (child.firstChild && child.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains('au-animate')) {
          rmPromises.push(_this2.animator.leave(element).then(function () {
            child.removeNodes();
          }));
        } else {
          child.removeNodes();
        }
      });

      var removeAction = function removeAction() {
        if (_this2.isAttached) {
          for (i = 0; i < ii; ++i) {
            children[i].detached();
          }
        }

        _this2.children = [];
      };

      if (rmPromises.length > 0) {
        return Promise.all(rmPromises).then(function () {
          removeAction();
        });
      } else {
        removeAction();
      }
    };

    ViewSlot.prototype.swap = function swap(view) {
      var _this3 = this;

      var removeResponse = this.removeAll();
      if (removeResponse !== undefined) {
        removeResponse.then(function () {
          _this3.add(view);
        });
      } else {
        this.add(view);
      }
    };

    ViewSlot.prototype.attached = function attached() {
      var i, ii, children, child;

      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      children = this.children;
      for (i = 0, ii = children.length; i < ii; ++i) {
        child = children[i];
        child.attached();

        var element = child.firstChild ? child.firstChild.nextElementSibling : null;
        if (child.firstChild && child.firstChild.nodeType === 8 && element && element.nodeType === 1 && element.classList.contains('au-animate')) {
          this.animator.enter(element);
        }
      }
    };

    ViewSlot.prototype.detached = function detached() {
      var i, ii, children;

      if (this.isAttached) {
        this.isAttached = false;
        children = this.children;
        for (i = 0, ii = children.length; i < ii; ++i) {
          children[i].detached();
        }
      }
    };

    ViewSlot.prototype.installContentSelectors = function installContentSelectors(contentSelectors) {
      this.contentSelectors = contentSelectors;
      this.add = this.contentSelectorAdd;
      this.insert = this.contentSelectorInsert;
      this.remove = this.contentSelectorRemove;
      this.removeAt = this.contentSelectorRemoveAt;
      this.removeAll = this.contentSelectorRemoveAll;
    };

    ViewSlot.prototype.contentSelectorAdd = function contentSelectorAdd(view) {
      _contentSelector.ContentSelector.applySelectors(view, this.contentSelectors, function (contentSelector, group) {
        return contentSelector.add(group);
      });

      this.children.push(view);

      if (this.isAttached) {
        view.attached();
      }
    };

    ViewSlot.prototype.contentSelectorInsert = function contentSelectorInsert(index, view) {
      if (index === 0 && !this.children.length || index >= this.children.length) {
        this.add(view);
      } else {
        _contentSelector.ContentSelector.applySelectors(view, this.contentSelectors, function (contentSelector, group) {
          return contentSelector.insert(index, group);
        });

        this.children.splice(index, 0, view);

        if (this.isAttached) {
          view.attached();
        }
      }
    };

    ViewSlot.prototype.contentSelectorRemove = function contentSelectorRemove(view) {
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
    };

    ViewSlot.prototype.contentSelectorRemoveAt = function contentSelectorRemoveAt(index) {
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
    };

    ViewSlot.prototype.contentSelectorRemoveAll = function contentSelectorRemoveAll() {
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
    };

    return ViewSlot;
  })();

  exports.ViewSlot = ViewSlot;
});
define('aurelia-templating/view-factory',['exports', 'aurelia-dependency-injection', './view', './view-slot', './content-selector', './resource-registry'], function (exports, _aureliaDependencyInjection, _view, _viewSlot, _contentSelector, _resourceRegistry) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function elementContainerGet(key) {
    if (key === Element) {
      return this.element;
    }

    if (key === BoundViewFactory) {
      return this.boundViewFactory || (this.boundViewFactory = new BoundViewFactory(this, this.instruction.viewFactory, this.executionContext));
    }

    if (key === _viewSlot.ViewSlot) {
      if (this.viewSlot === undefined) {
        this.viewSlot = new _viewSlot.ViewSlot(this.element, this.instruction.anchorIsContainer, this.executionContext);
        this.children.push(this.viewSlot);
      }

      return this.viewSlot;
    }

    if (key === _resourceRegistry.ViewResources) {
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
      contentSelectors.push(new _contentSelector.ContentSelector(element, instruction.selector));
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
      _classCallCheck(this, BoundViewFactory);

      this.parentContainer = parentContainer;
      this.viewFactory = viewFactory;
      this.executionContext = executionContext;
      this.factoryOptions = { behaviorInstance: false };
    }

    BoundViewFactory.prototype.create = function create(executionContext) {
      var childContainer = this.parentContainer.createChild(),
          context = executionContext || this.executionContext;

      this.factoryOptions.systemControlled = !executionContext;

      return this.viewFactory.create(childContainer, context, this.factoryOptions);
    };

    return BoundViewFactory;
  })();

  exports.BoundViewFactory = BoundViewFactory;

  var defaultFactoryOptions = {
    systemControlled: false,
    suppressBind: false
  };

  var ViewFactory = (function () {
    function ViewFactory(template, instructions, resources) {
      _classCallCheck(this, ViewFactory);

      this.template = template;
      this.instructions = instructions;
      this.resources = resources;
    }

    ViewFactory.prototype.create = function create(container, executionContext) {
      var options = arguments[2] === undefined ? defaultFactoryOptions : arguments[2];

      var fragment = this.template.cloneNode(true),
          instructables = fragment.querySelectorAll('.au-target'),
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

      view = new _view.View(fragment, behaviors, bindings, children, options.systemControlled, contentSelectors);
      view.created(executionContext);

      if (!options.suppressBind) {
        view.bind(executionContext);
      }

      return view;
    };

    return ViewFactory;
  })();

  exports.ViewFactory = ViewFactory;
});
define('aurelia-templating/binding-language',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BindingLanguage = (function () {
    function BindingLanguage() {
      _classCallCheck(this, BindingLanguage);
    }

    BindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, attrName, attrValue) {
      throw new Error('A BindingLanguage must implement inspectAttribute(...)');
    };

    BindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
      throw new Error('A BindingLanguage must implement createAttributeInstruction(...)');
    };

    BindingLanguage.prototype.parseText = function parseText(resources, value) {
      throw new Error('A BindingLanguage must implement parseText(...)');
    };

    return BindingLanguage;
  })();

  exports.BindingLanguage = BindingLanguage;
});
define('aurelia-templating/view-compiler',['exports', './resource-registry', './view-factory', './binding-language'], function (exports, _resourceRegistry, _viewFactory, _bindingLanguage) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

      if (typeof value !== 'string') {
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
    var value = element.getAttribute('class');
    element.setAttribute('class', value ? value += ' au-target' : 'au-target');
  }

  var ViewCompiler = (function () {
    function ViewCompiler(bindingLanguage) {
      _classCallCheck(this, ViewCompiler);

      this.bindingLanguage = bindingLanguage;
    }

    ViewCompiler.inject = function inject() {
      return [_bindingLanguage.BindingLanguage];
    };

    ViewCompiler.prototype.compile = function compile(templateOrFragment, resources) {
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

      this.compileNode(content, resources, instructions, templateOrFragment, 'root', !targetShadowDOM);

      content.insertBefore(document.createComment('<view>'), content.firstChild);
      content.appendChild(document.createComment('</view>'));

      return new _viewFactory.ViewFactory(content, instructions, resources);
    };

    ViewCompiler.prototype.compileNode = function compileNode(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
      switch (node.nodeType) {
        case 1:
          return this.compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM);
        case 3:
          var expression = this.bindingLanguage.parseText(resources, node.textContent);
          if (expression) {
            var marker = document.createElement('au-marker');
            marker.className = 'au-target';
            (node.parentNode || parentNode).insertBefore(marker, node);
            node.textContent = ' ';
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
    };

    ViewCompiler.prototype.compileElement = function compileElement(node, resources, instructions, parentNode, parentInjectorId, targetLightDOM) {
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

      if (tagName === 'content') {
        if (targetLightDOM) {
          instructions.push({
            parentInjectorId: parentInjectorId,
            contentSelector: true,
            selector: node.getAttribute('select'),
            suppressBind: true
          });
          makeIntoInstructionTarget(node);
        }
        return node.nextSibling;
      } else if (tagName === 'template') {
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
          knownAttribute = resources.mapAttribute(info.attrName);
          if (knownAttribute) {
            property = type.attributes[knownAttribute];

            if (property) {
              info.defaultBindingMode = property.defaultBindingMode;

              if (!info.command && !info.expression) {
                info.command = property.hasOptions ? 'options' : null;
              }
            }
          }
        } else if (elementInstruction) {
          elementProperty = elementInstruction.type.attributes[info.attrName];
          if (elementProperty) {
            info.defaultBindingMode = elementProperty.defaultBindingMode;

            if (!info.command && !info.expression) {
              info.command = elementProperty.hasOptions ? 'options' : null;
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
            instruction.attributes[resources.mapAttribute(attrName)] = attrValue;

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

        if (elementInstruction && elementInstruction.type.skipContentProcessing) {
          return node.nextSibling;
        }

        var currentChild = node.firstChild;
        while (currentChild) {
          currentChild = this.compileNode(currentChild, resources, instructions, node, injectorId || parentInjectorId, targetLightDOM);
        }
      }

      return node.nextSibling;
    };

    return ViewCompiler;
  })();

  exports.ViewCompiler = ViewCompiler;
});
define('aurelia-templating/util',["exports"], function (exports) {
  

  exports.__esModule = true;
  exports.hyphenate = hyphenate;
  var capitalMatcher = /([A-Z])/g;

  function addHyphenAndLower(char) {
    return "-" + char.toLowerCase();
  }

  function hyphenate(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
  }
});
define('aurelia-templating/module-analyzer',['exports', 'aurelia-metadata', 'aurelia-loader', 'aurelia-binding', './html-behavior', './view-strategy', './util'], function (exports, _aureliaMetadata, _aureliaLoader, _aureliaBinding, _htmlBehavior, _viewStrategy, _util) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ResourceModule = (function () {
    function ResourceModule(moduleId) {
      _classCallCheck(this, ResourceModule);

      this.id = moduleId;
      this.moduleInstance = null;
      this.mainResource = null;
      this.resources = null;
      this.viewStrategy = null;
      this.isAnalyzed = false;
    }

    ResourceModule.prototype.analyze = function analyze(container) {
      var current = this.mainResource,
          resources = this.resources,
          viewStrategy = this.viewStrategy,
          i,
          ii,
          metadata;

      if (this.isAnalyzed) {
        return;
      }

      this.isAnalyzed = true;

      if (current) {
        metadata = current.metadata;
        metadata.viewStrategy = viewStrategy;

        if ('analyze' in metadata && !metadata.isAnalyzed) {
          metadata.isAnalyzed = true;
          metadata.analyze(container, current.value);
        }
      }

      for (i = 0, ii = resources.length; i < ii; ++i) {
        current = resources[i];
        metadata = current.metadata;
        metadata.viewStrategy = viewStrategy;

        if ('analyze' in metadata && !metadata.isAnalyzed) {
          metadata.isAnalyzed = true;
          metadata.analyze(container, current.value);
        }
      }
    };

    ResourceModule.prototype.register = function register(registry, name) {
      var i,
          ii,
          resources = this.resources;

      if (this.mainResource) {
        this.mainResource.metadata.register(registry, name);
        name = null;
      }

      for (i = 0, ii = resources.length; i < ii; ++i) {
        resources[i].metadata.register(registry, name);
        name = null;
      }
    };

    ResourceModule.prototype.load = function load(container) {
      var current = this.mainResource,
          resources = this.resources,
          i,
          ii,
          metadata,
          loads;

      if (this.isLoaded) {
        return Promise.resolve();
      }

      this.isLoaded = true;
      loads = [];

      if (current) {
        metadata = current.metadata;

        if ('load' in metadata && !metadata.isLoaded) {
          metadata.isLoaded = true;
          loads.push(metadata.load(container, current.value));
        }
      }

      for (i = 0, ii = resources.length; i < ii; ++i) {
        current = resources[i];
        metadata = current.metadata;

        if ('load' in metadata && !metadata.isLoaded) {
          metadata.isLoaded = true;
          loads.push(metadata.load(container, current.value));
        }
      }

      return Promise.all(loads);
    };

    return ResourceModule;
  })();

  var ResourceDescription = function ResourceDescription(key, exportedValue, resourceTypeMeta) {
    _classCallCheck(this, ResourceDescription);

    if (!resourceTypeMeta) {
      resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, exportedValue);

      if (!resourceTypeMeta) {
        resourceTypeMeta = new _htmlBehavior.HtmlBehaviorResource();
        resourceTypeMeta.elementName = _util.hyphenate(key);
        Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, resourceTypeMeta, exportedValue);
      }
    }

    if (resourceTypeMeta instanceof _htmlBehavior.HtmlBehaviorResource) {
      if (resourceTypeMeta.elementName === undefined) {
        resourceTypeMeta.elementName = _util.hyphenate(key);
      } else if (resourceTypeMeta.attributeName === undefined) {
        resourceTypeMeta.attributeName = _util.hyphenate(key);
      } else if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
        _htmlBehavior.HtmlBehaviorResource.convention(key, resourceTypeMeta);
      }
    } else if (!resourceTypeMeta.name) {
      resourceTypeMeta.name = _util.hyphenate(key);
    }

    this.metadata = resourceTypeMeta;
    this.value = exportedValue;
  };

  var ModuleAnalyzer = (function () {
    function ModuleAnalyzer() {
      _classCallCheck(this, ModuleAnalyzer);

      this.cache = {};
    }

    ModuleAnalyzer.prototype.getAnalysis = function getAnalysis(moduleId) {
      return this.cache[moduleId];
    };

    ModuleAnalyzer.prototype.analyze = function analyze(moduleId, moduleInstance, viewModelMember) {
      var mainResource,
          fallbackValue,
          fallbackKey,
          resourceTypeMeta,
          key,
          exportedValue,
          resources = [],
          conventional,
          viewStrategy,
          resourceModule;

      resourceModule = this.cache[moduleId];
      if (resourceModule) {
        return resourceModule;
      }

      resourceModule = new ResourceModule(moduleId);
      this.cache[moduleId] = resourceModule;

      if (typeof moduleInstance === 'function') {
        moduleInstance = { 'default': moduleInstance };
      }

      if (viewModelMember) {
        mainResource = new ResourceDescription(viewModelMember, moduleInstance[viewModelMember]);
      }

      for (key in moduleInstance) {
        exportedValue = moduleInstance[key];

        if (key === viewModelMember || typeof exportedValue !== 'function') {
          continue;
        }

        resourceTypeMeta = _aureliaMetadata.Metadata.get(_aureliaMetadata.Metadata.resource, exportedValue);

        if (resourceTypeMeta) {
          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            _htmlBehavior.HtmlBehaviorResource.convention(key, resourceTypeMeta);
          }

          if (resourceTypeMeta.attributeName === null && resourceTypeMeta.elementName === null) {
            resourceTypeMeta.elementName = _util.hyphenate(key);
          }

          if (!mainResource && resourceTypeMeta instanceof _htmlBehavior.HtmlBehaviorResource && resourceTypeMeta.elementName !== null) {
            mainResource = new ResourceDescription(key, exportedValue, resourceTypeMeta);
          } else {
            resources.push(new ResourceDescription(key, exportedValue, resourceTypeMeta));
          }
        } else if (exportedValue instanceof _viewStrategy.ViewStrategy) {
          viewStrategy = exportedValue;
        } else if (exportedValue instanceof _aureliaLoader.TemplateRegistryEntry) {
          viewStrategy = new _viewStrategy.TemplateRegistryViewStrategy(moduleId, exportedValue);
        } else {
          if (conventional = _htmlBehavior.HtmlBehaviorResource.convention(key)) {
            if (conventional.elementName !== null && !mainResource) {
              mainResource = new ResourceDescription(key, exportedValue, conventional);
            } else {
              resources.push(new ResourceDescription(key, exportedValue, conventional));
            }

            Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, conventional, exportedValue);
          } else if (conventional = _aureliaBinding.ValueConverterResource.convention(key)) {
            resources.push(new ResourceDescription(key, exportedValue, conventional));
            Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, conventional, exportedValue);
          } else if (!fallbackValue) {
            fallbackValue = exportedValue;
            fallbackKey = key;
          }
        }
      }

      if (!mainResource && fallbackValue) {
        mainResource = new ResourceDescription(fallbackKey, fallbackValue);
      }

      resourceModule.moduleInstance = moduleInstance;
      resourceModule.mainResource = mainResource;
      resourceModule.resources = resources;
      resourceModule.viewStrategy = viewStrategy;

      return resourceModule;
    };

    return ModuleAnalyzer;
  })();

  exports.ModuleAnalyzer = ModuleAnalyzer;
});
define('aurelia-templating/view-engine',['exports', 'core-js', 'aurelia-logging', 'aurelia-metadata', 'aurelia-loader', 'aurelia-dependency-injection', './view-compiler', './resource-registry', './module-analyzer'], function (exports, _coreJs, _aureliaLogging, _aureliaMetadata, _aureliaLoader, _aureliaDependencyInjection, _viewCompiler, _resourceRegistry, _moduleAnalyzer) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var logger = _aureliaLogging.getLogger('templating');

  function ensureRegistryEntry(loader, urlOrRegistryEntry) {
    if (urlOrRegistryEntry instanceof _aureliaLoader.TemplateRegistryEntry) {
      return Promise.resolve(urlOrRegistryEntry);
    }

    return loader.loadTemplate(urlOrRegistryEntry);
  }

  var ViewEngine = (function () {
    function ViewEngine(loader, container, viewCompiler, moduleAnalyzer, appResources) {
      _classCallCheck(this, ViewEngine);

      this.loader = loader;
      this.container = container;
      this.viewCompiler = viewCompiler;
      this.moduleAnalyzer = moduleAnalyzer;
      this.appResources = appResources;
    }

    ViewEngine.inject = function inject() {
      return [_aureliaLoader.Loader, _aureliaDependencyInjection.Container, _viewCompiler.ViewCompiler, _moduleAnalyzer.ModuleAnalyzer, _resourceRegistry.ResourceRegistry];
    };

    ViewEngine.prototype.loadViewFactory = function loadViewFactory(urlOrRegistryEntry, compileOptions, associatedModuleId) {
      var _this = this;

      return ensureRegistryEntry(this.loader, urlOrRegistryEntry).then(function (viewRegistryEntry) {
        if (viewRegistryEntry.isReady) {
          return viewRegistryEntry.factory;
        }

        return _this.loadTemplateResources(viewRegistryEntry, associatedModuleId).then(function (resources) {
          if (viewRegistryEntry.isReady) {
            return viewRegistryEntry.factory;
          }

          viewRegistryEntry.setResources(resources);

          var viewFactory = _this.viewCompiler.compile(viewRegistryEntry.template, resources, compileOptions);
          viewRegistryEntry.setFactory(viewFactory);
          return viewFactory;
        });
      });
    };

    ViewEngine.prototype.loadTemplateResources = function loadTemplateResources(viewRegistryEntry, associatedModuleId) {
      var resources = new _resourceRegistry.ViewResources(this.appResources, viewRegistryEntry.id),
          dependencies = viewRegistryEntry.dependencies,
          importIds,
          names;

      if (dependencies.length === 0 && !associatedModuleId) {
        return Promise.resolve(resources);
      }

      importIds = dependencies.map(function (x) {
        return x.src;
      });
      names = dependencies.map(function (x) {
        return x.name;
      });
      logger.debug('importing resources for ' + viewRegistryEntry.id, importIds);

      return this.importViewResources(importIds, names, resources, associatedModuleId);
    };

    ViewEngine.prototype.importViewModelResource = function importViewModelResource(moduleImport, moduleMember) {
      var _this2 = this;

      return this.loader.loadModule(moduleImport).then(function (viewModelModule) {
        var normalizedId = _aureliaMetadata.Origin.get(viewModelModule).moduleId,
            resourceModule = _this2.moduleAnalyzer.analyze(normalizedId, viewModelModule, moduleMember);

        if (!resourceModule.mainResource) {
          throw new Error('No view model found in module "' + moduleImport + '".');
        }

        resourceModule.analyze(_this2.container);

        return resourceModule.mainResource;
      });
    };

    ViewEngine.prototype.importViewResources = function importViewResources(moduleIds, names, resources, associatedModuleId) {
      var _this3 = this;

      return this.loader.loadAllModules(moduleIds).then(function (imports) {
        var i,
            ii,
            analysis,
            normalizedId,
            current,
            associatedModule,
            container = _this3.container,
            moduleAnalyzer = _this3.moduleAnalyzer,
            allAnalysis = new Array(imports.length);

        for (i = 0, ii = imports.length; i < ii; ++i) {
          current = imports[i];
          normalizedId = _aureliaMetadata.Origin.get(current).moduleId;

          analysis = moduleAnalyzer.analyze(normalizedId, current);
          analysis.analyze(container);
          analysis.register(resources, names[i]);

          allAnalysis[i] = analysis;
        }

        if (associatedModuleId) {
          associatedModule = moduleAnalyzer.getAnalysis(associatedModuleId);

          if (associatedModule) {
            associatedModule.register(resources);
          }
        }

        for (i = 0, ii = allAnalysis.length; i < ii; ++i) {
          allAnalysis[i] = allAnalysis[i].load(container);
        }

        return Promise.all(allAnalysis).then(function () {
          return resources;
        });
      });
    };

    return ViewEngine;
  })();

  exports.ViewEngine = ViewEngine;
});
define('aurelia-templating/bindable-property',['exports', 'core-js', './util', 'aurelia-binding'], function (exports, _coreJs, _util, _aureliaBinding) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  function getObserver(behavior, instance, name) {
    var lookup = instance.__observers__;

    if (lookup === undefined) {
      lookup = behavior.observerLocator.getObserversLookup(instance);
      behavior.ensurePropertiesDefined(instance, lookup);
    }

    return lookup[name];
  }

  var BindableProperty = (function () {
    function BindableProperty(nameOrConfig) {
      _classCallCheck(this, BindableProperty);

      if (typeof nameOrConfig === 'string') {
        this.name = nameOrConfig;
      } else {
        Object.assign(this, nameOrConfig);
      }

      this.attribute = this.attribute || _util.hyphenate(this.name);
      this.defaultBindingMode = this.defaultBindingMode || _aureliaBinding.bindingMode.oneWay;
      this.changeHandler = this.changeHandler || null;
      this.owner = null;
    }

    BindableProperty.prototype.registerWith = function registerWith(target, behavior) {
      behavior.properties.push(this);
      behavior.attributes[this.attribute] = this;
      this.owner = behavior;
    };

    BindableProperty.prototype.defineOn = function defineOn(target, behavior) {
      var name = this.name,
          handlerName;

      if (this.changeHandler === null) {
        handlerName = name + 'Changed';
        if (handlerName in target.prototype) {
          this.changeHandler = handlerName;
        }
      }

      Object.defineProperty(target.prototype, name, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return getObserver(behavior, this, name).getValue();
        },
        set: function set(value) {
          getObserver(behavior, this, name).setValue(value);
        }
      });
    };

    BindableProperty.prototype.createObserver = function createObserver(executionContext) {
      var _this = this;

      var selfSubscriber = null;

      if (this.hasOptions) {
        return;
      }

      if (this.changeHandler !== null) {
        selfSubscriber = function (newValue, oldValue) {
          return executionContext[_this.changeHandler](newValue, oldValue);
        };
      }

      return new BehaviorPropertyObserver(this.owner.taskQueue, executionContext, this.name, selfSubscriber);
    };

    BindableProperty.prototype.initialize = function initialize(executionContext, observerLookup, attributes, behaviorHandlesBind, boundProperties) {
      var selfSubscriber, observer, attribute;

      if (this.isDynamic) {
        for (var key in attributes) {
          this.createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, key, attributes[key], boundProperties);
        }
      } else if (!this.hasOptions) {
        observer = observerLookup[this.name];

        if (attributes !== undefined) {
          selfSubscriber = observer.selfSubscriber;
          attribute = attributes[this.attribute];

          if (behaviorHandlesBind) {
            observer.selfSubscriber = null;
          }

          if (typeof attribute === 'string') {
            executionContext[this.name] = attribute;
            observer.call();
          } else if (attribute) {
            boundProperties.push({ observer: observer, binding: attribute.createBinding(executionContext) });
          } else if (this.defaultValue !== undefined) {
            executionContext[this.name] = this.defaultValue;
            observer.call();
          }

          observer.selfSubscriber = selfSubscriber;
        }

        observer.publishing = true;
      }
    };

    BindableProperty.prototype.createDynamicProperty = function createDynamicProperty(executionContext, observerLookup, behaviorHandlesBind, name, attribute, boundProperties) {
      var changeHandlerName = name + 'Changed',
          selfSubscriber = null,
          observer,
          info;

      if (changeHandlerName in executionContext) {
        selfSubscriber = function (newValue, oldValue) {
          return executionContext[changeHandlerName](newValue, oldValue);
        };
      } else if ('dynamicPropertyChanged' in executionContext) {
        selfSubscriber = function (newValue, oldValue) {
          return executionContext['dynamicPropertyChanged'](name, newValue, oldValue);
        };
      }

      observer = observerLookup[name] = new BehaviorPropertyObserver(this.owner.taskQueue, executionContext, name, selfSubscriber);

      Object.defineProperty(executionContext, name, {
        configurable: true,
        enumerable: true,
        get: observer.getValue.bind(observer),
        set: observer.setValue.bind(observer)
      });

      if (behaviorHandlesBind) {
        observer.selfSubscriber = null;
      }

      if (typeof attribute === 'string') {
        executionContext[name] = attribute;
        observer.call();
      } else if (attribute) {
        info = { observer: observer, binding: attribute.createBinding(executionContext) };
        boundProperties.push(info);
      }

      observer.publishing = true;
      observer.selfSubscriber = selfSubscriber;
    };

    return BindableProperty;
  })();

  exports.BindableProperty = BindableProperty;

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

    BehaviorPropertyObserver.prototype.getValue = function getValue() {
      return this.currentValue;
    };

    BehaviorPropertyObserver.prototype.setValue = function setValue(newValue) {
      var oldValue = this.currentValue;

      if (oldValue != newValue) {
        if (this.publishing && this.notqueued) {
          this.notqueued = false;
          this.taskQueue.queueMicroTask(this);
        }

        this.oldValue = oldValue;
        this.currentValue = newValue;
      }
    };

    BehaviorPropertyObserver.prototype.call = function call() {
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
    };

    BehaviorPropertyObserver.prototype.subscribe = function subscribe(callback) {
      var callbacks = this.callbacks;
      callbacks.push(callback);
      return function () {
        callbacks.splice(callbacks.indexOf(callback), 1);
      };
    };

    return BehaviorPropertyObserver;
  })();
});
define('aurelia-templating/behavior-instance',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var BehaviorInstance = (function () {
    function BehaviorInstance(behavior, executionContext, instruction) {
      _classCallCheck(this, BehaviorInstance);

      this.behavior = behavior;
      this.executionContext = executionContext;
      this.isAttached = false;

      var observerLookup = behavior.observerLocator.getObserversLookup(executionContext),
          handlesBind = behavior.handlesBind,
          attributes = instruction.attributes,
          boundProperties = this.boundProperties = [],
          properties = behavior.properties,
          i,
          ii;

      behavior.ensurePropertiesDefined(executionContext, observerLookup);

      for (i = 0, ii = properties.length; i < ii; ++i) {
        properties[i].initialize(executionContext, observerLookup, attributes, handlesBind, boundProperties);
      }
    }

    BehaviorInstance.prototype.created = function created(context) {
      if (this.behavior.handlesCreated) {
        this.executionContext.created(context);
      }
    };

    BehaviorInstance.prototype.bind = function bind(context) {
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
    };

    BehaviorInstance.prototype.unbind = function unbind() {
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
    };

    BehaviorInstance.prototype.attached = function attached() {
      if (this.isAttached) {
        return;
      }

      this.isAttached = true;

      if (this.behavior.handlesAttached) {
        this.executionContext.attached();
      }

      if (this.view) {
        this.view.attached();
      }
    };

    BehaviorInstance.prototype.detached = function detached() {
      if (this.isAttached) {
        this.isAttached = false;

        if (this.view) {
          this.view.detached();
        }

        if (this.behavior.handlesDetached) {
          this.executionContext.detached();
        }
      }
    };

    return BehaviorInstance;
  })();

  exports.BehaviorInstance = BehaviorInstance;
});
define('aurelia-templating/html-behavior',['exports', 'aurelia-metadata', 'aurelia-binding', 'aurelia-task-queue', './view-strategy', './view-engine', './content-selector', './util', './bindable-property', './behavior-instance'], function (exports, _aureliaMetadata, _aureliaBinding, _aureliaTaskQueue, _viewStrategy, _viewEngine, _contentSelector, _util, _bindableProperty, _behaviorInstance) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var defaultInstruction = { suppressBind: false },
      contentSelectorFactoryOptions = { suppressBind: true },
      hasShadowDOM = !!HTMLElement.prototype.createShadowRoot;

  var HtmlBehaviorResource = (function () {
    function HtmlBehaviorResource() {
      _classCallCheck(this, HtmlBehaviorResource);

      this.elementName = null;
      this.attributeName = null;
      this.liftsContent = false;
      this.targetShadowDOM = false;
      this.skipContentProcessing = false;
      this.usesShadowDOM = false;
      this.childExpression = null;
      this.hasDynamicOptions = false;
      this.properties = [];
      this.attributes = {};
    }

    HtmlBehaviorResource.convention = function convention(name, existing) {
      var behavior;

      if (name.endsWith('CustomAttribute')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.attributeName = _util.hyphenate(name.substring(0, name.length - 15));
      }

      if (name.endsWith('CustomElement')) {
        behavior = existing || new HtmlBehaviorResource();
        behavior.elementName = _util.hyphenate(name.substring(0, name.length - 13));
      }

      return behavior;
    };

    HtmlBehaviorResource.prototype.analyze = function analyze(container, target) {
      var proto = target.prototype,
          properties = this.properties,
          attributeName = this.attributeName,
          i,
          ii,
          current;

      this.observerLocator = container.get(_aureliaBinding.ObserverLocator);
      this.taskQueue = container.get(_aureliaTaskQueue.TaskQueue);

      this.target = target;
      this.usesShadowDOM = this.targetShadowDOM && hasShadowDOM;
      this.handlesCreated = 'created' in proto;
      this.handlesBind = 'bind' in proto;
      this.handlesUnbind = 'unbind' in proto;
      this.handlesAttached = 'attached' in proto;
      this.handlesDetached = 'detached' in proto;
      this.apiName = (this.elementName || this.attributeName).replace(/-([a-z])/g, function (m, w) {
        return w.toUpperCase();
      });

      if (attributeName !== null) {
        if (properties.length === 0) {
          new _bindableProperty.BindableProperty({
            name: 'value',
            changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
            attribute: attributeName
          }).registerWith(target, this);
        }

        current = properties[0];

        if (properties.length === 1 && current.name === 'value') {
          current.isDynamic = current.hasOptions = this.hasDynamicOptions;
          current.defineOn(target, this);
        } else {
          for (i = 0, ii = properties.length; i < ii; ++i) {
            properties[i].defineOn(target, this);
          }

          current = new _bindableProperty.BindableProperty({
            name: 'value',
            changeHandler: 'valueChanged' in proto ? 'valueChanged' : null,
            attribute: attributeName
          });

          current.hasOptions = true;
          current.registerWith(target, this);
        }
      } else {
        for (i = 0, ii = properties.length; i < ii; ++i) {
          properties[i].defineOn(target, this);
        }
      }
    };

    HtmlBehaviorResource.prototype.load = function load(container, target, viewStrategy, transientView) {
      var _this = this;

      var options;

      if (this.elementName !== null) {
        viewStrategy = viewStrategy || this.viewStrategy || _viewStrategy.ViewStrategy.getDefault(target);
        options = {
          targetShadowDOM: this.targetShadowDOM,
          beforeCompile: target.beforeCompile
        };

        if (!viewStrategy.moduleId) {
          viewStrategy.moduleId = _aureliaMetadata.Origin.get(target).moduleId;
        }

        return viewStrategy.loadViewFactory(container.get(_viewEngine.ViewEngine), options).then(function (viewFactory) {
          if (!transientView) {
            _this.viewFactory = viewFactory;
          }

          return viewFactory;
        });
      }

      return Promise.resolve(this);
    };

    HtmlBehaviorResource.prototype.register = function register(registry, name) {
      if (this.attributeName !== null) {
        registry.registerAttribute(name || this.attributeName, this, this.attributeName);
      }

      if (this.elementName !== null) {
        registry.registerElement(name || this.elementName, this);
      }
    };

    HtmlBehaviorResource.prototype.compile = function compile(compiler, resources, node, instruction, parentNode) {
      if (this.liftsContent) {
        if (!instruction.viewFactory) {
          var template = document.createElement('template'),
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
      } else if (this.elementName !== null && !this.usesShadowDOM && !this.skipContentProcessing && node.hasChildNodes()) {
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
    };

    HtmlBehaviorResource.prototype.create = function create(container, _x, _x2, bindings) {
      var instruction = arguments[1] === undefined ? defaultInstruction : arguments[1];
      var element = arguments[2] === undefined ? null : arguments[2];

      var executionContext = instruction.executionContext || container.get(this.target),
          behaviorInstance = new _behaviorInstance.BehaviorInstance(this, executionContext, instruction),
          viewFactory,
          host;

      if (this.liftsContent) {
        element.primaryBehavior = behaviorInstance;
      } else if (this.elementName !== null) {
        viewFactory = instruction.viewFactory || this.viewFactory;

        if (viewFactory) {
          behaviorInstance.view = viewFactory.create(container, behaviorInstance.executionContext, instruction);
        }

        if (element) {
          element.primaryBehavior = behaviorInstance;

          if (behaviorInstance.view) {
            if (this.usesShadowDOM) {
              host = element.createShadowRoot();
            } else {
              host = element;

              if (instruction.contentFactory) {
                var contentView = instruction.contentFactory.create(container, null, contentSelectorFactoryOptions);

                _contentSelector.ContentSelector.applySelectors(contentView, behaviorInstance.view.contentSelectors, function (contentSelector, group) {
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
      } else if (this.childExpression) {
        bindings.push(this.childExpression.createBinding(element, behaviorInstance.executionContext));
      }

      if (element && !(this.apiName in element)) {
        element[this.apiName] = behaviorInstance.executionContext;
      }

      return behaviorInstance;
    };

    HtmlBehaviorResource.prototype.ensurePropertiesDefined = function ensurePropertiesDefined(instance, lookup) {
      var properties, i, ii, observer;

      if ('__propertiesDefined__' in lookup) {
        return;
      }

      lookup.__propertiesDefined__ = true;
      properties = this.properties;

      for (i = 0, ii = properties.length; i < ii; ++i) {
        observer = properties[i].createObserver(instance);

        if (observer !== undefined) {
          lookup[observer.propertyName] = observer;
        }
      }
    };

    return HtmlBehaviorResource;
  })();

  exports.HtmlBehaviorResource = HtmlBehaviorResource;
});
define('aurelia-templating/children',["exports"], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var noMutations = [];

  var ChildObserver = (function () {
    function ChildObserver(property, changeHandler, selector) {
      _classCallCheck(this, ChildObserver);

      this.selector = selector;
      this.changeHandler = changeHandler;
      this.property = property;
    }

    ChildObserver.prototype.createBinding = function createBinding(target, behavior) {
      return new ChildObserverBinder(this.selector, target, this.property, behavior, this.changeHandler);
    };

    return ChildObserver;
  })();

  exports.ChildObserver = ChildObserver;

  var ChildObserverBinder = (function () {
    function ChildObserverBinder(selector, target, property, behavior, changeHandler) {
      _classCallCheck(this, ChildObserverBinder);

      this.selector = selector;
      this.target = target;
      this.property = property;
      this.behavior = behavior;
      this.changeHandler = changeHandler;
      this.observer = new MutationObserver(this.onChange.bind(this));
    }

    ChildObserverBinder.prototype.bind = function bind(source) {
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
    };

    ChildObserverBinder.prototype.unbind = function unbind() {
      this.observer.disconnect();
    };

    ChildObserverBinder.prototype.onChange = function onChange(mutations) {
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
    };

    return ChildObserverBinder;
  })();

  exports.ChildObserverBinder = ChildObserverBinder;
});
define('aurelia-templating/element-config',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var ElementConfigResource = (function () {
    function ElementConfigResource() {
      _classCallCheck(this, ElementConfigResource);
    }

    ElementConfigResource.prototype.load = function load(container, target) {
      var config = new target(),
          eventManager = container.get(_aureliaBinding.EventManager);

      eventManager.registerElementConfig(config);
      return Promise.resolve(this);
    };

    ElementConfigResource.prototype.register = function register() {};

    return ElementConfigResource;
  })();

  exports.ElementConfigResource = ElementConfigResource;
});
define('aurelia-templating/composition-engine',['exports', 'aurelia-metadata', './view-strategy', './view-engine', './html-behavior'], function (exports, _aureliaMetadata, _viewStrategy, _viewEngine, _htmlBehavior) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var CompositionEngine = (function () {
    function CompositionEngine(viewEngine) {
      _classCallCheck(this, CompositionEngine);

      this.viewEngine = viewEngine;
    }

    CompositionEngine.inject = function inject() {
      return [_viewEngine.ViewEngine];
    };

    CompositionEngine.prototype.activate = function activate(instruction) {
      if (instruction.skipActivation || typeof instruction.viewModel.activate !== 'function') {
        return Promise.resolve();
      }

      return instruction.viewModel.activate(instruction.model) || Promise.resolve();
    };

    CompositionEngine.prototype.createBehaviorAndSwap = function createBehaviorAndSwap(instruction) {
      return this.createBehavior(instruction).then(function (behavior) {
        behavior.view.bind(behavior.executionContext);
        instruction.viewSlot.swap(behavior.view);

        if (instruction.currentBehavior) {
          instruction.currentBehavior.unbind();
        }

        return behavior;
      });
    };

    CompositionEngine.prototype.createBehavior = function createBehavior(instruction) {
      var childContainer = instruction.childContainer,
          viewModelResource = instruction.viewModelResource,
          viewModel = instruction.viewModel,
          metadata;

      return this.activate(instruction).then(function () {
        var doneLoading, viewStrategyFromViewModel, origin;

        if ('getViewStrategy' in viewModel && !instruction.view) {
          viewStrategyFromViewModel = true;
          instruction.view = _viewStrategy.ViewStrategy.normalize(viewModel.getViewStrategy());
        }

        if (instruction.view) {
          if (viewStrategyFromViewModel) {
            origin = _aureliaMetadata.Origin.get(viewModel.constructor);
            if (origin) {
              instruction.view.makeRelativeTo(origin.moduleId);
            }
          } else if (instruction.viewResources) {
            instruction.view.makeRelativeTo(instruction.viewResources.viewUrl);
          }
        }

        if (viewModelResource) {
          metadata = viewModelResource.metadata;
          doneLoading = metadata.load(childContainer, viewModelResource.value, instruction.view, true);
        } else {
          metadata = new _htmlBehavior.HtmlBehaviorResource();
          metadata.elementName = 'dynamic-element';
          doneLoading = metadata.load(childContainer, viewModel.constructor, instruction.view, true).then(function (viewFactory) {
            metadata.analyze(instruction.container || childContainer, viewModel.constructor);
            return viewFactory;
          });
        }

        return doneLoading.then(function (viewFactory) {
          return metadata.create(childContainer, {
            executionContext: viewModel,
            viewFactory: viewFactory,
            suppressBind: true
          });
        });
      });
    };

    CompositionEngine.prototype.createViewModel = function createViewModel(instruction) {
      var childContainer = instruction.childContainer || instruction.container.createChild();

      instruction.viewModel = instruction.viewResources ? instruction.viewResources.relativeToView(instruction.viewModel) : instruction.viewModel;

      return this.viewEngine.importViewModelResource(instruction.viewModel).then(function (viewModelResource) {
        childContainer.autoRegister(viewModelResource.value);
        instruction.viewModel = childContainer.viewModel = childContainer.get(viewModelResource.value);
        instruction.viewModelResource = viewModelResource;
        return instruction;
      });
    };

    CompositionEngine.prototype.compose = function compose(instruction) {
      var _this = this;

      instruction.childContainer = instruction.childContainer || instruction.container.createChild();
      instruction.view = _viewStrategy.ViewStrategy.normalize(instruction.view);

      if (instruction.viewModel) {
        if (typeof instruction.viewModel === 'string') {
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
    };

    return CompositionEngine;
  })();

  exports.CompositionEngine = CompositionEngine;
});
define('aurelia-templating/decorators',['exports', 'core-js', 'aurelia-metadata', './bindable-property', './children', './element-config', './view-strategy', './html-behavior'], function (exports, _coreJs, _aureliaMetadata, _bindableProperty, _children, _elementConfig, _viewStrategy, _htmlBehavior) {
  

  exports.__esModule = true;
  exports.behavior = behavior;
  exports.customElement = customElement;
  exports.customAttribute = customAttribute;
  exports.templateController = templateController;
  exports.bindable = bindable;
  exports.dynamicOptions = dynamicOptions;
  exports.syncChildren = syncChildren;
  exports.useShadowDOM = useShadowDOM;
  exports.skipContentProcessing = skipContentProcessing;
  exports.viewStrategy = viewStrategy;
  exports.useView = useView;
  exports.noView = noView;
  exports.elementConfig = elementConfig;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _core = _interopRequire(_coreJs);

  function behavior(override) {
    return function (target) {
      if (override instanceof _htmlBehavior.HtmlBehaviorResource) {
        Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, override, target);
      } else {
        var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
        Object.assign(resource, override);
      }
    };
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('behavior', behavior);

  function customElement(name) {
    return function (target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.elementName = name;
    };
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('customElement', customElement);

  function customAttribute(name) {
    return function (target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.attributeName = name;
    };
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('customAttribute', customAttribute);

  function templateController(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.liftsContent = true;
    };

    return target ? deco(target) : deco;
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('templateController', templateController);

  function bindable(nameOrConfigOrTarget, key, descriptor) {
    var deco = function deco(target, key, descriptor) {
      var actualTarget = key ? target.constructor : target,
          resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, actualTarget),
          prop;

      if (key) {
        nameOrConfigOrTarget = nameOrConfigOrTarget || {};
        nameOrConfigOrTarget.name = key;
      }

      prop = new _bindableProperty.BindableProperty(nameOrConfigOrTarget);
      prop.registerWith(actualTarget, resource);
    };

    if (!nameOrConfigOrTarget) {
      return deco;
    }

    if (key) {
      var target = nameOrConfigOrTarget;
      nameOrConfigOrTarget = null;
      return deco(target, key, descriptor);
    }

    return deco;
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('bindable', bindable);

  function dynamicOptions(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.hasDynamicOptions = true;
    };

    return target ? deco(target) : deco;
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('dynamicOptions', dynamicOptions);

  function syncChildren(property, changeHandler, selector) {
    return function (target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.childExpression = new _children.ChildObserver(property, changeHandler, selector);
    };
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('syncChildren', syncChildren);

  function useShadowDOM(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.targetShadowDOM = true;
    };

    return target ? deco(target) : deco;
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('useShadowDOM', useShadowDOM);

  function skipContentProcessing(target) {
    var deco = function deco(target) {
      var resource = _aureliaMetadata.Metadata.getOrCreateOwn(_aureliaMetadata.Metadata.resource, _htmlBehavior.HtmlBehaviorResource, target);
      resource.skipContentProcessing = true;
    };

    return target ? deco(target) : deco;
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('skipContentProcessing', skipContentProcessing);

  function viewStrategy(strategy) {
    return function (target) {
      Reflect.defineMetadata(_viewStrategy.ViewStrategy.metadataKey, strategy, target);
    };
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('viewStrategy', useView);

  function useView(path) {
    return viewStrategy(new _viewStrategy.UseViewStrategy(path));
  }

  _aureliaMetadata.Decorators.configure.parameterizedDecorator('useView', useView);

  function noView(target) {
    var deco = function deco(target) {
      Reflect.defineMetadata(_viewStrategy.ViewStrategy.metadataKey, new _viewStrategy.NoViewStrategy(), target);
    };

    return target ? deco(target) : deco;
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('noView', noView);

  function elementConfig(target) {
    var deco = function deco(target) {
      Reflect.defineMetadata(_aureliaMetadata.Metadata.resource, new _elementConfig.ElementConfigResource(), target);
    };

    return target ? deco(target) : deco;
  }

  _aureliaMetadata.Decorators.configure.simpleDecorator('elementConfig', elementConfig);
});
define('aurelia-templating/index',['exports', './html-behavior', './bindable-property', './resource-registry', './children', './element-config', './view-strategy', './view-compiler', './view-engine', './view-factory', './view-slot', './binding-language', './composition-engine', './animator', './decorators'], function (exports, _htmlBehavior, _bindableProperty, _resourceRegistry, _children, _elementConfig, _viewStrategy, _viewCompiler, _viewEngine, _viewFactory, _viewSlot, _bindingLanguage, _compositionEngine, _animator, _decorators) {
  

  exports.__esModule = true;

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  exports.HtmlBehaviorResource = _htmlBehavior.HtmlBehaviorResource;
  exports.BindableProperty = _bindableProperty.BindableProperty;
  exports.ResourceRegistry = _resourceRegistry.ResourceRegistry;
  exports.ViewResources = _resourceRegistry.ViewResources;
  exports.ChildObserver = _children.ChildObserver;
  exports.ElementConfigResource = _elementConfig.ElementConfigResource;
  exports.ViewStrategy = _viewStrategy.ViewStrategy;
  exports.UseViewStrategy = _viewStrategy.UseViewStrategy;
  exports.ConventionalViewStrategy = _viewStrategy.ConventionalViewStrategy;
  exports.NoViewStrategy = _viewStrategy.NoViewStrategy;
  exports.ViewCompiler = _viewCompiler.ViewCompiler;
  exports.ViewEngine = _viewEngine.ViewEngine;
  exports.ViewFactory = _viewFactory.ViewFactory;
  exports.BoundViewFactory = _viewFactory.BoundViewFactory;
  exports.ViewSlot = _viewSlot.ViewSlot;
  exports.BindingLanguage = _bindingLanguage.BindingLanguage;
  exports.CompositionEngine = _compositionEngine.CompositionEngine;
  exports.Animator = _animator.Animator;

  _defaults(exports, _interopRequireWildcard(_decorators));
});
define('aurelia-templating', ['aurelia-templating/index'], function (main) { return main; });

define('aurelia-framework/aurelia',['exports', 'core-js', 'aurelia-logging', 'aurelia-dependency-injection', 'aurelia-loader', 'aurelia-path', './plugins', 'aurelia-templating'], function (exports, _coreJs, _aureliaLogging, _aureliaDependencyInjection, _aureliaLoader, _aureliaPath, _plugins, _aureliaTemplating) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var logger = _aureliaLogging.getLogger('aurelia'),
      slice = Array.prototype.slice;

  if (!window.CustomEvent || typeof window.CustomEvent !== 'function') {
    var CustomEvent = function CustomEvent(event, params) {
      var params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };

      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

  function preventActionlessFormSubmit() {
    document.body.addEventListener('submit', function (evt) {
      var target = evt.target;
      var action = target.action;

      if (target.tagName.toLowerCase() === 'form' && !action) {
        evt.preventDefault();
      }
    });
  }

  function loadResources(container, resourcesToLoad, appResources) {
    var viewEngine = container.get(_aureliaTemplating.ViewEngine),
        importIds = Object.keys(resourcesToLoad),
        names = new Array(importIds.length),
        i,
        ii;

    for (i = 0, ii = importIds.length; i < ii; ++i) {
      names[i] = resourcesToLoad[importIds[i]];
    }

    return viewEngine.importViewResources(importIds, names, appResources);
  }

  var Aurelia = (function () {
    function Aurelia(loader, container, resources) {
      _classCallCheck(this, Aurelia);

      this.loader = loader || new window.AureliaLoader();
      this.container = container || new _aureliaDependencyInjection.Container();
      this.resources = resources || new _aureliaTemplating.ResourceRegistry();
      this.use = new _plugins.Plugins(this);
      this.resourcesToLoad = {};

      this.withInstance(Aurelia, this);
      this.withInstance(_aureliaLoader.Loader, this.loader);
      this.withInstance(_aureliaTemplating.ResourceRegistry, this.resources);
    }

    Aurelia.prototype.withInstance = function withInstance(type, instance) {
      this.container.registerInstance(type, instance);
      return this;
    };

    Aurelia.prototype.withSingleton = function withSingleton(type, implementation) {
      this.container.registerSingleton(type, implementation);
      return this;
    };

    Aurelia.prototype.globalizeResources = function globalizeResources(resources) {
      var toAdd = Array.isArray(resources) ? resources : arguments,
          i,
          ii,
          resource,
          pluginPath = this.currentPluginId || '',
          path,
          internalPlugin = pluginPath.startsWith('./');

      for (i = 0, ii = toAdd.length; i < ii; ++i) {
        resource = toAdd[i];
        if (typeof resource != 'string') {
          throw new Error('Invalid resource path [' + resource + ']. Resources must be specified as relative module IDs.');
        }

        path = internalPlugin ? _aureliaPath.relativeToFile(resource, pluginPath) : _aureliaPath.join(pluginPath, resource);

        this.resourcesToLoad[path] = this.resourcesToLoad[path];
      }

      return this;
    };

    Aurelia.prototype.renameGlobalResource = function renameGlobalResource(resourcePath, newName) {
      this.resourcesToLoad[resourcePath] = newName;
      return this;
    };

    Aurelia.prototype.start = function start() {
      var _this = this;

      if (this.started) {
        return Promise.resolve(this);
      }

      this.started = true;
      logger.info('Aurelia Starting');

      preventActionlessFormSubmit();

      return this.use._process().then(function () {
        if (!_this.container.hasHandler(_aureliaTemplating.BindingLanguage)) {
          var message = 'You must configure Aurelia with a BindingLanguage implementation.';
          logger.error(message);
          throw new Error(message);
        }

        if (!_this.container.hasHandler(_aureliaTemplating.Animator)) {
          _aureliaTemplating.Animator.configureDefault(_this.container);
        }

        return loadResources(_this.container, _this.resourcesToLoad, _this.resources).then(function () {
          logger.info('Aurelia Started');
          var evt = new window.CustomEvent('aurelia-started', { bubbles: true, cancelable: true });
          document.dispatchEvent(evt);
          return _this;
        });
      });
    };

    Aurelia.prototype.setRoot = function setRoot() {
      var _this2 = this;

      var root = arguments[0] === undefined ? 'app' : arguments[0];
      var applicationHost = arguments[1] === undefined ? null : arguments[1];

      var compositionEngine,
          instruction = {};

      applicationHost = applicationHost || this.host;

      if (!applicationHost || typeof applicationHost == 'string') {
        this.host = document.getElementById(applicationHost || 'applicationHost') || document.body;
      } else {
        this.host = applicationHost;
      }

      this.host.aurelia = this;
      this.container.registerInstance(Element, this.host);

      compositionEngine = this.container.get(_aureliaTemplating.CompositionEngine);
      instruction.viewModel = root;
      instruction.container = instruction.childContainer = this.container;
      instruction.viewSlot = new _aureliaTemplating.ViewSlot(this.host, true);
      instruction.viewSlot.transformChildNodesIntoView();

      return compositionEngine.compose(instruction).then(function (root) {
        _this2.root = root;
        instruction.viewSlot.attached();
        var evt = new window.CustomEvent('aurelia-composed', { bubbles: true, cancelable: true });
        setTimeout(function () {
          return document.dispatchEvent(evt);
        }, 1);
        return _this2;
      });
    };

    return Aurelia;
  })();

  exports.Aurelia = Aurelia;
});
define('aurelia-framework/index',['exports', 'aurelia-logging', './aurelia', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-metadata', 'aurelia-templating', 'aurelia-loader', 'aurelia-task-queue'], function (exports, _aureliaLogging, _aurelia, _aureliaDependencyInjection, _aureliaBinding, _aureliaMetadata, _aureliaTemplating, _aureliaLoader, _aureliaTaskQueue) {
  

  exports.__esModule = true;

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

  function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

  exports.Aurelia = _aurelia.Aurelia;

  _defaults(exports, _interopRequireWildcard(_aureliaDependencyInjection));

  _defaults(exports, _interopRequireWildcard(_aureliaBinding));

  _defaults(exports, _interopRequireWildcard(_aureliaMetadata));

  _defaults(exports, _interopRequireWildcard(_aureliaTemplating));

  _defaults(exports, _interopRequireWildcard(_aureliaLoader));

  _defaults(exports, _interopRequireWildcard(_aureliaTaskQueue));

  var LogManager = _aureliaLogging;
  exports.LogManager = LogManager;
});
define('aurelia-framework', ['aurelia-framework/index'], function (main) { return main; });

define('aurelia-route-recognizer/state',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var State = (function () {
    function State(charSpec) {
      _classCallCheck(this, State);

      this.charSpec = charSpec;
      this.nextStates = [];
    }

    State.prototype.get = function get(charSpec) {
      for (var _iterator = this.nextStates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var child = _ref;

        var isEqual = child.charSpec.validChars === charSpec.validChars && child.charSpec.invalidChars === charSpec.invalidChars;

        if (isEqual) {
          return child;
        }
      }
    };

    State.prototype.put = function put(charSpec) {
      var state = this.get(charSpec);

      if (state) {
        return state;
      }

      state = new State(charSpec);

      this.nextStates.push(state);

      if (charSpec.repeat) {
        state.nextStates.push(state);
      }

      return state;
    };

    State.prototype.match = function match(ch) {
      var nextStates = this.nextStates,
          results = [],
          child,
          charSpec,
          chars;

      for (var i = 0, l = nextStates.length; i < l; i++) {
        child = nextStates[i];

        charSpec = child.charSpec;

        if (typeof (chars = charSpec.validChars) !== 'undefined') {
          if (chars.indexOf(ch) !== -1) {
            results.push(child);
          }
        } else if (typeof (chars = charSpec.invalidChars) !== 'undefined') {
          if (chars.indexOf(ch) === -1) {
            results.push(child);
          }
        }
      }

      return results;
    };

    return State;
  })();

  exports.State = State;
  ;
});
define('aurelia-route-recognizer/segments',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];

  var escapeRegex = new RegExp('(\\' + specials.join('|\\') + ')', 'g');

  var StaticSegment = (function () {
    function StaticSegment(string) {
      _classCallCheck(this, StaticSegment);

      this.string = string;
    }

    StaticSegment.prototype.eachChar = function eachChar(callback) {
      for (var _iterator = this.string, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var ch = _ref;

        callback({ validChars: ch });
      }
    };

    StaticSegment.prototype.regex = function regex() {
      return this.string.replace(escapeRegex, '\\$1');
    };

    StaticSegment.prototype.generate = function generate() {
      return this.string;
    };

    return StaticSegment;
  })();

  exports.StaticSegment = StaticSegment;

  var DynamicSegment = (function () {
    function DynamicSegment(name) {
      _classCallCheck(this, DynamicSegment);

      this.name = name;
    }

    DynamicSegment.prototype.eachChar = function eachChar(callback) {
      callback({ invalidChars: '/', repeat: true });
    };

    DynamicSegment.prototype.regex = function regex() {
      return '([^/]+)';
    };

    DynamicSegment.prototype.generate = function generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    };

    return DynamicSegment;
  })();

  exports.DynamicSegment = DynamicSegment;

  var StarSegment = (function () {
    function StarSegment(name) {
      _classCallCheck(this, StarSegment);

      this.name = name;
    }

    StarSegment.prototype.eachChar = function eachChar(callback) {
      callback({ invalidChars: '', repeat: true });
    };

    StarSegment.prototype.regex = function regex() {
      return '(.+)';
    };

    StarSegment.prototype.generate = function generate(params, consumed) {
      consumed[this.name] = true;
      return params[this.name];
    };

    return StarSegment;
  })();

  exports.StarSegment = StarSegment;

  var EpsilonSegment = (function () {
    function EpsilonSegment() {
      _classCallCheck(this, EpsilonSegment);
    }

    EpsilonSegment.prototype.eachChar = function eachChar() {};

    EpsilonSegment.prototype.regex = function regex() {
      return '';
    };

    EpsilonSegment.prototype.generate = function generate() {
      return '';
    };

    return EpsilonSegment;
  })();

  exports.EpsilonSegment = EpsilonSegment;
});
define('aurelia-route-recognizer/index',['exports', 'core-js', './state', './segments'], function (exports, _coreJs, _state, _segments) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var RouteRecognizer = (function () {
    function RouteRecognizer() {
      _classCallCheck(this, RouteRecognizer);

      this.rootState = new _state.State();
      this.names = {};
    }

    RouteRecognizer.prototype.add = function add(route) {
      if (Array.isArray(route)) {
        for (var _iterator = route, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var r = _ref;

          this.add(r);
        }

        return;
      }

      var currentState = this.rootState,
          regex = '^',
          types = { statics: 0, dynamics: 0, stars: 0 },
          names = [],
          routeName = route.handler.name,
          isEmpty = true;

      var segments = parse(route.path, names, types);
      for (var _iterator2 = segments, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var segment = _ref2;

        if (segment instanceof _segments.EpsilonSegment) {
          continue;
        }

        isEmpty = false;

        currentState = currentState.put({ validChars: '/' });
        regex += '/';

        currentState = addSegment(currentState, segment);
        regex += segment.regex();
      }

      if (isEmpty) {
        currentState = currentState.put({ validChars: '/' });
        regex += '/';
      }

      var handlers = [{ handler: route.handler, names: names }];

      if (routeName) {
        this.names[routeName] = {
          segments: segments,
          handlers: handlers
        };
      }

      currentState.handlers = handlers;
      currentState.regex = new RegExp(regex + '$');
      currentState.types = types;

      return currentState;
    };

    RouteRecognizer.prototype.handlersFor = function handlersFor(name) {
      var route = this.names[name],
          result = [];

      if (!route) {
        throw new Error('There is no route named ' + name);
      }

      for (var i = 0, l = route.handlers.length; i < l; i++) {
        result.push(route.handlers[i]);
      }

      return result;
    };

    RouteRecognizer.prototype.hasRoute = function hasRoute(name) {
      return !!this.names[name];
    };

    RouteRecognizer.prototype.generate = function generate(name, params) {
      params = Object.assign({}, params);

      var route = this.names[name],
          consumed = {},
          output = '';

      if (!route) {
        throw new Error('There is no route named ' + name);
      }

      var segments = route.segments;

      for (var i = 0, l = segments.length; i < l; i++) {
        var segment = segments[i];

        if (segment instanceof _segments.EpsilonSegment) {
          continue;
        }

        output += '/';
        var segmentValue = segment.generate(params, consumed);
        if (segmentValue === null || segmentValue === undefined) {
          throw new Error('A value is required for route parameter \'' + segment.name + '\' in route \'' + name + '\'.');
        }

        output += segmentValue;
      }

      if (output.charAt(0) !== '/') {
        output = '/' + output;
      }

      for (var param in consumed) {
        delete params[param];
      }

      output += this.generateQueryString(params);

      return output;
    };

    RouteRecognizer.prototype.generateQueryString = function generateQueryString(params) {
      var pairs = [],
          keys = [],
          encode = encodeURIComponent;

      for (var key in params) {
        if (params.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      keys.sort();
      for (var i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        var value = params[key];
        if (value === null || value === undefined) {
          continue;
        }

        if (Array.isArray(value)) {
          var arrayKey = '' + encode(key) + '[]';
          for (var j = 0, l = value.length; j < l; j++) {
            pairs.push('' + arrayKey + '=' + encode(value[j]));
          }
        } else {
          pairs.push('' + encode(key) + '=' + encode(value));
        }
      }

      if (pairs.length === 0) {
        return '';
      }

      return '?' + pairs.join('&');
    };

    RouteRecognizer.prototype.parseQueryString = function parseQueryString(queryString) {
      var queryParams = {};
      if (!queryString || typeof queryString !== 'string') {
        return queryParams;
      }

      if (queryString.charAt(0) === '?') {
        queryString = queryString.substr(1);
      }

      var pairs = queryString.split('&');
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('='),
            key = decodeURIComponent(pair[0]),
            keyLength = key.length,
            isArray = false,
            value;

        if (!key) {
          continue;
        } else if (pair.length === 1) {
          value = true;
        } else {
          if (keyLength > 2 && key.slice(keyLength - 2) === '[]') {
            isArray = true;
            key = key.slice(0, keyLength - 2);
            if (!queryParams[key]) {
              queryParams[key] = [];
            }
          }
          value = pair[1] ? decodeURIComponent(pair[1]) : '';
        }
        if (isArray) {
          queryParams[key].push(value);
        } else {
          queryParams[key] = value;
        }
      }
      return queryParams;
    };

    RouteRecognizer.prototype.recognize = function recognize(path) {
      var states = [this.rootState],
          pathLen,
          i,
          l,
          queryStart,
          queryParams = {},
          isSlashDropped = false;

      queryStart = path.indexOf('?');
      if (queryStart !== -1) {
        var queryString = path.substr(queryStart + 1, path.length);
        path = path.substr(0, queryStart);
        queryParams = this.parseQueryString(queryString);
      }

      path = decodeURI(path);

      if (path.charAt(0) !== '/') {
        path = '/' + path;
      }

      pathLen = path.length;
      if (pathLen > 1 && path.charAt(pathLen - 1) === '/') {
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
        if (isSlashDropped && state.regex.source.slice(-5) === '(.+)$') {
          path = path + '/';
        }
        return findHandler(state, path, queryParams);
      }
    };

    return RouteRecognizer;
  })();

  exports.RouteRecognizer = RouteRecognizer;

  var RecognizeResults = function RecognizeResults(queryParams) {
    _classCallCheck(this, RecognizeResults);

    this.splice = Array.prototype.splice;
    this.slice = Array.prototype.slice;
    this.push = Array.prototype.push;
    this.length = 0;
    this.queryParams = queryParams || {};
  };

  function parse(route, names, types) {
    if (route.charAt(0) === '/') {
      route = route.substr(1);
    }

    var results = [];

    for (var _iterator3 = route.split('/'), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var segment = _ref3;

      var match = undefined;

      if (match = segment.match(/^:([^\/]+)$/)) {
        results.push(new _segments.DynamicSegment(match[1]));
        names.push(match[1]);
        types.dynamics++;
      } else if (match = segment.match(/^\*([^\/]+)$/)) {
        results.push(new _segments.StarSegment(match[1]));
        names.push(match[1]);
        types.stars++;
      } else if (segment === '') {
        results.push(new _segments.EpsilonSegment());
      } else {
        results.push(new _segments.StaticSegment(segment));
        types.statics++;
      }
    }

    return results;
  }

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
      currentState = currentState.put(ch);
    });

    return currentState;
  }
});
define('aurelia-route-recognizer', ['aurelia-route-recognizer/index'], function (main) { return main; });

define('aurelia-router/navigation-commands',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;
  exports.isNavigationCommand = isNavigationCommand;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  function isNavigationCommand(obj) {
    return obj && typeof obj.navigate === 'function';
  }

  var Redirect = (function () {
    function Redirect(url, options) {
      _classCallCheck(this, Redirect);

      this.url = url;
      this.options = Object.assign({ trigger: true, replace: true }, options || {});
      this.shouldContinueProcessing = false;
    }

    Redirect.prototype.setRouter = function setRouter(router) {
      this.router = router;
    };

    Redirect.prototype.navigate = function navigate(appRouter) {
      var navigatingRouter = this.options.useAppRouter ? appRouter : this.router || appRouter;
      navigatingRouter.navigate(this.url, this.options);
    };

    return Redirect;
  })();

  exports.Redirect = Redirect;
});
define('aurelia-router/navigation-plan',['exports', './navigation-commands'], function (exports, _navigationCommands) {
  

  exports.__esModule = true;
  exports.buildNavigationPlan = buildNavigationPlan;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var activationStrategy = {
    noChange: 'no-change',
    invokeLifecycle: 'invoke-lifecycle',
    replace: 'replace'
  };

  exports.activationStrategy = activationStrategy;

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
          viewPortPlan.strategy = activationStrategy.replace;
        } else if ('determineActivationStrategy' in prevViewPortInstruction.component.executionContext) {
          var _prevViewPortInstruction$component$executionContext;

          viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, next.lifecycleArgs);
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = activationStrategy.invokeLifecycle;
        } else {
          viewPortPlan.strategy = activationStrategy.noChange;
        }

        if (viewPortPlan.strategy !== activationStrategy.replace && prevViewPortInstruction.childRouter) {
          var path = next.getWildcardPath();
          var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then(function (childInstruction) {
            viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);

            return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == activationStrategy.invokeLifecycle).then(function (childPlan) {
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
          strategy: activationStrategy.replace,
          config: next.config.viewPorts[viewPortName]
        };
      }

      return Promise.resolve(plan);
    }
  }

  var BuildNavigationPlanStep = (function () {
    function BuildNavigationPlanStep() {
      _classCallCheck(this, BuildNavigationPlanStep);
    }

    BuildNavigationPlanStep.prototype.run = function run(navigationContext, next) {
      if (navigationContext.nextInstruction.config.redirect) {
        return next.cancel(new _navigationCommands.Redirect(navigationContext.nextInstruction.config.redirect));
      }

      return buildNavigationPlan(navigationContext).then(function (plan) {
        navigationContext.plan = plan;
        return next();
      })['catch'](next.cancel);
    };

    return BuildNavigationPlanStep;
  })();

  exports.BuildNavigationPlanStep = BuildNavigationPlanStep;

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
});
define('aurelia-router/navigation-context',['exports', './navigation-plan'], function (exports, _navigationPlan) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var NavigationContext = (function () {
    function NavigationContext(router, nextInstruction) {
      _classCallCheck(this, NavigationContext);

      this.router = router;
      this.nextInstruction = nextInstruction;
      this.currentInstruction = router.currentInstruction;
      this.prevInstruction = router.currentInstruction;
    }

    NavigationContext.prototype.getAllContexts = function getAllContexts() {
      var acc = arguments[0] === undefined ? [] : arguments[0];

      acc.push(this);
      if (this.plan) {
        for (var key in this.plan) {
          this.plan[key].childNavigationContext && this.plan[key].childNavigationContext.getAllContexts(acc);
        }
      }
      return acc;
    };

    NavigationContext.prototype.commitChanges = function commitChanges(waitToSwap) {
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
          throw new Error('There was no router-view found in the view for ' + viewPortInstruction.moduleId + '.');
        }

        if (viewPortInstruction.strategy === _navigationPlan.activationStrategy.replace) {
          if (waitToSwap) {
            delaySwaps.push({ viewPort: viewPort, viewPortInstruction: viewPortInstruction });
          }

          loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(function (x) {
            if ('childNavigationContext' in viewPortInstruction) {
              return viewPortInstruction.childNavigationContext.commitChanges();
            }
          }));
        } else {
          if ('childNavigationContext' in viewPortInstruction) {
            loads.push(viewPortInstruction.childNavigationContext.commitChanges(waitToSwap));
          }
        }
      }

      return Promise.all(loads).then(function () {
        delaySwaps.forEach(function (x) {
          return x.viewPort.swap(x.viewPortInstruction);
        });
      });
    };

    NavigationContext.prototype.buildTitle = function buildTitle() {
      var separator = arguments[0] === undefined ? ' | ' : arguments[0];

      var next = this.nextInstruction,
          title = next.config.navModel.title || '',
          viewPortInstructions = next.viewPortInstructions,
          childTitles = [];

      for (var viewPortName in viewPortInstructions) {
        var viewPortInstruction = viewPortInstructions[viewPortName];

        if ('childNavigationContext' in viewPortInstruction) {
          var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
          if (childTitle) {
            childTitles.push(childTitle);
          }
        }
      }

      if (childTitles.length) {
        title = childTitles.join(separator) + (title ? separator : '') + title;
      }

      if (this.router.title) {
        title += (title ? separator : '') + this.router.title;
      }

      return title;
    };

    _createClass(NavigationContext, [{
      key: 'nextInstructions',
      get: function () {
        return this.getAllContexts().map(function (c) {
          return c.nextInstruction;
        }).filter(function (c) {
          return c;
        });
      }
    }, {
      key: 'currentInstructions',
      get: function () {
        return this.getAllContexts().map(function (c) {
          return c.currentInstruction;
        }).filter(function (c) {
          return c;
        });
      }
    }, {
      key: 'prevInstructions',
      get: function () {
        return this.getAllContexts().map(function (c) {
          return c.prevInstruction;
        }).filter(function (c) {
          return c;
        });
      }
    }]);

    return NavigationContext;
  })();

  exports.NavigationContext = NavigationContext;

  var CommitChangesStep = (function () {
    function CommitChangesStep() {
      _classCallCheck(this, CommitChangesStep);
    }

    CommitChangesStep.prototype.run = function run(navigationContext, next) {
      return navigationContext.commitChanges(true).then(function () {
        var title = navigationContext.buildTitle();
        if (title) {
          document.title = title;
        }

        return next();
      });
    };

    return CommitChangesStep;
  })();

  exports.CommitChangesStep = CommitChangesStep;
});
define('aurelia-router/navigation-instruction',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var NavigationInstruction = (function () {
    function NavigationInstruction(fragment, queryString, params, queryParams, config, parentInstruction) {
      _classCallCheck(this, NavigationInstruction);

      var allParams = Object.assign({}, queryParams, params);

      this.fragment = fragment;
      this.queryString = queryString;
      this.params = params || {};
      this.queryParams = queryParams;
      this.config = config;
      this.lifecycleArgs = [allParams, config, this];
      this.viewPortInstructions = {};

      if (parentInstruction) {
        this.params.$parent = parentInstruction.params;
      }
    }

    NavigationInstruction.prototype.addViewPortInstruction = function addViewPortInstruction(viewPortName, strategy, moduleId, component) {
      return this.viewPortInstructions[viewPortName] = {
        name: viewPortName,
        strategy: strategy,
        moduleId: moduleId,
        component: component,
        childRouter: component.childRouter,
        lifecycleArgs: this.lifecycleArgs.slice()
      };
    };

    NavigationInstruction.prototype.getWildCardName = function getWildCardName() {
      var wildcardIndex = this.config.route.lastIndexOf('*');
      return this.config.route.substr(wildcardIndex + 1);
    };

    NavigationInstruction.prototype.getWildcardPath = function getWildcardPath() {
      var wildcardName = this.getWildCardName(),
          path = this.params[wildcardName];

      if (this.queryString) {
        path += '?' + this.queryString;
      }

      return path;
    };

    NavigationInstruction.prototype.getBaseUrl = function getBaseUrl() {
      if (!this.params) {
        return this.fragment;
      }

      var wildcardName = this.getWildCardName(),
          path = this.params[wildcardName];

      if (!path) {
        return this.fragment;
      }

      return this.fragment.substr(0, this.fragment.lastIndexOf(path));
    };

    return NavigationInstruction;
  })();

  exports.NavigationInstruction = NavigationInstruction;
});
define('aurelia-router/route-filters',['exports', 'aurelia-dependency-injection'], function (exports, _aureliaDependencyInjection) {
  

  exports.__esModule = true;
  exports.createRouteFilterStep = createRouteFilterStep;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RouteFilterContainer = (function () {
    function RouteFilterContainer(container) {
      _classCallCheck(this, RouteFilterContainer);

      this.container = container;
      this.filters = {};
      this.filterCache = {};
    }

    RouteFilterContainer.inject = function inject() {
      return [_aureliaDependencyInjection.Container];
    };

    RouteFilterContainer.prototype.addStep = function addStep(name, step) {
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
    };

    RouteFilterContainer.prototype.getFilterSteps = function getFilterSteps(name) {
      if (this.filterCache[name]) {
        return this.filterCache[name];
      }

      var steps = [];
      var filter = this.filters[name];
      if (!filter) {
        return steps;
      }

      for (var i = 0, l = filter.length; i < l; i++) {
        if (typeof filter[i] === 'string') {
          steps.push.apply(steps, this.getFilterSteps(filter[i]));
        } else {
          steps.push(this.container.get(filter[i]));
        }
      }

      return this.filterCache[name] = steps;
    };

    return RouteFilterContainer;
  })();

  exports.RouteFilterContainer = RouteFilterContainer;

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

    RouteFilterStep.prototype.getSteps = function getSteps() {
      return this.routeFilterContainer.getFilterSteps(this.name);
    };

    return RouteFilterStep;
  })();
});
define('aurelia-router/router-configuration',['exports', './route-filters'], function (exports, _routeFilters) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RouterConfiguration = (function () {
    function RouterConfiguration() {
      _classCallCheck(this, RouterConfiguration);

      this.instructions = [];
      this.options = {};
      this.pipelineSteps = [];
    }

    RouterConfiguration.prototype.addPipelineStep = function addPipelineStep(name, step) {
      this.pipelineSteps.push({ name: name, step: step });
    };

    RouterConfiguration.prototype.map = function map(route, config) {
      if (Array.isArray(route)) {
        for (var i = 0; i < route.length; i++) {
          this.map(route[i]);
        }

        return this;
      }

      if (typeof route == 'string') {
        if (!config) {
          config = {};
        } else if (typeof config == 'string') {
          config = { moduleId: config };
        }

        config.route = route;
      } else {
        config = route;
      }

      return this.mapRoute(config);
    };

    RouterConfiguration.prototype.mapRoute = function mapRoute(config) {
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
    };

    RouterConfiguration.prototype.mapUnknownRoutes = function mapUnknownRoutes(config) {
      this.unknownRouteConfig = config;
      return this;
    };

    RouterConfiguration.prototype.exportToRouter = function exportToRouter(router) {
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
        if (!router.isRoot) {
          throw new Error('Pipeline steps can only be added to the root router');
        }

        filterContainer = router.container.get(_routeFilters.RouteFilterContainer);
        for (i = 0, ii = pipelineSteps.length; i < ii; ++i) {
          var _pipelineSteps$i = pipelineSteps[i];
          var name = _pipelineSteps$i.name;
          var step = _pipelineSteps$i.step;

          filterContainer.addStep(name, step);
        }
      }
    };

    RouterConfiguration.prototype.configureRoute = function configureRoute(router, config, navModel) {
      this.ensureDefaultsForRouteConfig(config);
      router.addRoute(config, navModel);
    };

    RouterConfiguration.prototype.ensureDefaultsForRouteConfig = function ensureDefaultsForRouteConfig(config) {
      config.name = ensureConfigValue(config, 'name', this.deriveName);
      config.route = ensureConfigValue(config, 'route', this.deriveRoute);
      config.title = ensureConfigValue(config, 'title', this.deriveTitle);
      config.moduleId = ensureConfigValue(config, 'moduleId', this.deriveModuleId);
    };

    RouterConfiguration.prototype.deriveName = function deriveName(config) {
      return config.title || (config.route ? stripParametersFromRoute(config.route) : config.moduleId);
    };

    RouterConfiguration.prototype.deriveRoute = function deriveRoute(config) {
      return config.moduleId || config.name;
    };

    RouterConfiguration.prototype.deriveTitle = function deriveTitle(config) {
      var value = config.name;
      return value ? value.substr(0, 1).toUpperCase() + value.substr(1) : null;
    };

    RouterConfiguration.prototype.deriveModuleId = function deriveModuleId(config) {
      return stripParametersFromRoute(config.route);
    };

    return RouterConfiguration;
  })();

  exports.RouterConfiguration = RouterConfiguration;

  function ensureConfigValue(config, property, getter) {
    var value = config[property];

    if (value || value === '') {
      return value;
    }

    return getter(config);
  }

  function stripParametersFromRoute(route) {
    var colonIndex = route.indexOf(':');
    var length = colonIndex > 0 ? colonIndex - 1 : route.length;
    return route.substr(0, length);
  }
});
define('aurelia-router/util',['exports'], function (exports) {
  

  exports.__esModule = true;
  exports.processPotential = processPotential;

  function processPotential(obj, resolve, reject) {
    if (obj && typeof obj.then === 'function') {
      var dfd = obj.then(resolve);

      if (typeof dfd['catch'] === 'function') {
        return dfd['catch'](reject);
      } else if (typeof dfd.fail === 'function') {
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
});
define('aurelia-router/router',['exports', 'core-js', 'aurelia-route-recognizer', 'aurelia-path', './navigation-context', './navigation-instruction', './router-configuration', './util'], function (exports, _coreJs, _aureliaRouteRecognizer, _aureliaPath, _navigationContext, _navigationInstruction, _routerConfiguration, _util) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  var isRooted = /^#?\//;

  var Router = (function () {
    function Router(container, history) {
      _classCallCheck(this, Router);

      this.container = container;
      this.history = history;
      this.viewPorts = {};
      this.reset();
      this.baseUrl = '';
      this.isConfigured = false;
    }

    Router.prototype.registerViewPort = function registerViewPort(viewPort, name) {
      name = name || 'default';
      this.viewPorts[name] = viewPort;
    };

    Router.prototype.refreshBaseUrl = function refreshBaseUrl() {
      if (this.parent) {
        var baseUrl = this.parent.currentInstruction.getBaseUrl();
        this.baseUrl = this.parent.baseUrl + baseUrl;
      }
    };

    Router.prototype.refreshNavigation = function refreshNavigation() {
      var nav = this.navigation;

      for (var i = 0, length = nav.length; i < length; i++) {
        var current = nav[i];
        current.href = this.createRootedPath(current.relativeHref);
      }
    };

    Router.prototype.configure = function configure(callbackOrConfig) {
      this.isConfigured = true;

      if (typeof callbackOrConfig == 'function') {
        var config = new _routerConfiguration.RouterConfiguration();
        callbackOrConfig(config);
        config.exportToRouter(this);
      } else {
        callbackOrConfig.exportToRouter(this);
      }

      return this;
    };

    Router.prototype.createRootedPath = function createRootedPath(fragment) {
      var path = '';

      if (this.baseUrl.length && this.baseUrl[0] !== '/') {
        path += '/';
      }

      path += this.baseUrl;

      if (path[path.length - 1] != '/' && fragment[0] != '/') {
        path += '/';
      }

      return normalizeAbsolutePath(path + fragment, this.history._hasPushState);
    };

    Router.prototype.navigate = function navigate(fragment, options) {
      if (!this.isConfigured && this.parent) {
        return this.parent.navigate(fragment, options);
      }

      if (fragment === '') {
        fragment = '/';
      }

      if (isRooted.test(fragment)) {
        fragment = normalizeAbsolutePath(fragment, this.history._hasPushState);
      } else {
        fragment = this.createRootedPath(fragment);
      }

      return this.history.navigate(fragment, options);
    };

    Router.prototype.navigateToRoute = function navigateToRoute(route, params, options) {
      var path = this.generate(route, params);
      return this.navigate(path, options);
    };

    Router.prototype.navigateBack = function navigateBack() {
      this.history.navigateBack();
    };

    Router.prototype.createChild = function createChild(container) {
      var childRouter = new Router(container || this.container.createChild(), this.history);
      childRouter.parent = this;
      return childRouter;
    };

    Router.prototype.createNavigationInstruction = function createNavigationInstruction() {
      var url = arguments[0] === undefined ? '' : arguments[0];
      var parentInstruction = arguments[1] === undefined ? null : arguments[1];

      var fragment = url;
      var queryString = '';

      var queryIndex = url.indexOf('?');
      if (queryIndex != -1) {
        fragment = url.substr(0, queryIndex);
        queryString = url.substr(queryIndex + 1);
      }

      var results = this.recognizer.recognize(url);
      if (!results || !results.length) {
        results = this.childRecognizer.recognize(url);
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
        var first = results[0];
        var instruction = new _navigationInstruction.NavigationInstruction(fragment, queryString, first.params, first.queryParams || results.queryParams, first.config || first.handler, parentInstruction);

        if (typeof first.handler === 'function') {
          return evaluateNavigationStrategy(instruction, first.handler, first);
        } else if (first.config && 'navigationStrategy' in first.config) {
          return evaluateNavigationStrategy(instruction, first.config.navigationStrategy, first.config);
        }

        return Promise.resolve(instruction);
      }

      return Promise.reject(new Error('Route not found: ' + url));
    };

    Router.prototype.createNavigationContext = function createNavigationContext(instruction) {
      return new _navigationContext.NavigationContext(this, instruction);
    };

    Router.prototype.generate = function generate(name, params) {
      if ((!this.isConfigured || !this.recognizer.hasRoute(name)) && this.parent) {
        return this.parent.generate(name, params);
      }

      var path = this.recognizer.generate(name, params);
      return this.createRootedPath(path);
    };

    Router.prototype.addRoute = function addRoute(config) {
      var navModel = arguments[1] === undefined ? {} : arguments[1];

      validateRouteConfig(config);

      if (!('viewPorts' in config)) {
        config.viewPorts = {
          'default': {
            moduleId: config.moduleId,
            view: config.view
          }
        };
      }

      navModel.title = navModel.title || config.title;
      navModel.setTitle = function (newTitle) {
        navModel.title = newTitle;
      };
      navModel.settings = config.settings || (config.settings = {});

      this.routes.push(config);
      var state = this.recognizer.add({ path: config.route, handler: config });

      if (config.route) {
        var withChild,
            settings = config.settings;
        delete config.settings;
        withChild = JSON.parse(JSON.stringify(config));
        config.settings = settings;
        withChild.route += '/*childRoute';
        withChild.hasChildRouter = true;
        this.childRecognizer.add({
          path: withChild.route,
          handler: withChild
        });

        withChild.navModel = navModel;
        withChild.settings = config.settings;
      }

      config.navModel = navModel;

      if ((config.nav || 'order' in navModel) && this.navigation.indexOf(navModel) === -1) {
        navModel.order = navModel.order || config.nav;
        navModel.href = navModel.href || config.href;
        navModel.isActive = false;
        navModel.config = config;

        if (!config.href) {
          if (state.types.dynamics || state.types.stars) {
            throw new Error('Invalid route config: dynamic routes must specify an href to be included in the navigation model.');
          }

          navModel.relativeHref = config.route;
          navModel.href = '';
        }

        if (typeof navModel.order != 'number') {
          navModel.order = ++this.fallbackOrder;
        }

        this.navigation.push(navModel);
        this.navigation = this.navigation.sort(function (a, b) {
          return a.order - b.order;
        });
      }
    };

    Router.prototype.hasRoute = function hasRoute(name) {
      return !!(this.recognizer.hasRoute(name) || this.parent && this.parent.hasRoute(name));
    };

    Router.prototype.hasOwnRoute = function hasOwnRoute(name) {
      return this.recognizer.hasRoute(name);
    };

    Router.prototype.handleUnknownRoutes = function handleUnknownRoutes(config) {
      var callback = function callback(instruction) {
        return new Promise(function (resolve, reject) {
          function done(inst) {
            inst = inst || instruction;
            inst.config.route = inst.params.path;
            resolve(inst);
          }

          if (!config) {
            instruction.config.moduleId = instruction.fragment;
            done(instruction);
          } else if (typeof config == 'string') {
            instruction.config.moduleId = config;
            done(instruction);
          } else if (typeof config == 'function') {
            _util.processPotential(config(instruction), done, reject);
          } else {
            instruction.config = config;
            done(instruction);
          }
        });
      };

      this.catchAllHandler = callback;
    };

    Router.prototype.reset = function reset() {
      this.fallbackOrder = 100;
      this.recognizer = new _aureliaRouteRecognizer.RouteRecognizer();
      this.childRecognizer = new _aureliaRouteRecognizer.RouteRecognizer();
      this.routes = [];
      this.isNavigating = false;
      this.navigation = [];
      this.isConfigured = false;
    };

    _createClass(Router, [{
      key: 'isRoot',
      get: function () {
        return false;
      }
    }]);

    return Router;
  })();

  exports.Router = Router;

  function validateRouteConfig(config) {
    var isValid = typeof config === 'object' && (config.moduleId || config.redirect || config.viewPorts) && config.route !== null && config.route !== undefined;

    if (!isValid) {
      throw new Error('Invalid Route Config: You must have at least a route and a moduleId, redirect, or viewPorts.');
    }
  }

  function normalizeAbsolutePath(path, hasPushState) {
    if (!hasPushState && path[0] !== '#') {
      path = '#' + path;
    }

    return path;
  }

  function evaluateNavigationStrategy(instruction, evaluator, context) {
    return Promise.resolve(evaluator.call(context, instruction)).then(function () {
      if (!('viewPorts' in instruction.config)) {
        instruction.config.viewPorts = {
          'default': {
            moduleId: instruction.config.moduleId
          }
        };
      }

      return instruction;
    });
  }
});
define('aurelia-router/pipeline',['exports', 'core-js'], function (exports, _coreJs) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  function createResult(ctx, next) {
    return {
      status: next.status,
      context: ctx,
      output: next.output,
      completed: next.status == pipelineStatus.completed
    };
  }

  var pipelineStatus = {
    completed: 'completed',
    cancelled: 'cancelled',
    rejected: 'rejected',
    running: 'running'
  };

  exports.pipelineStatus = pipelineStatus;

  var Pipeline = (function () {
    function Pipeline() {
      _classCallCheck(this, Pipeline);

      this.steps = [];
    }

    Pipeline.prototype.withStep = function withStep(step) {
      var run, steps, i, l;

      if (typeof step == 'function') {
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
    };

    Pipeline.prototype.run = function run(ctx) {
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
        next.status = pipelineStatus.completed;
        next.output = output;
        return Promise.resolve(createResult(ctx, next));
      };

      next.cancel = function (reason) {
        next.status = pipelineStatus.cancelled;
        next.output = reason;
        return Promise.resolve(createResult(ctx, next));
      };

      next.reject = function (error) {
        next.status = pipelineStatus.rejected;
        next.output = error;
        return Promise.reject(createResult(ctx, next));
      };

      next.status = pipelineStatus.running;

      return next();
    };

    return Pipeline;
  })();

  exports.Pipeline = Pipeline;
});
define('aurelia-router/route-loading',['exports', './navigation-plan', './router-configuration'], function (exports, _navigationPlan, _routerConfiguration) {
  

  exports.__esModule = true;
  exports.loadNewRoute = loadNewRoute;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RouteLoader = (function () {
    function RouteLoader() {
      _classCallCheck(this, RouteLoader);
    }

    RouteLoader.prototype.loadRoute = function loadRoute(router, config) {
      throw Error('Route loaders must implment "loadRoute(router, config)".');
    };

    return RouteLoader;
  })();

  exports.RouteLoader = RouteLoader;

  var LoadRouteStep = (function () {
    function LoadRouteStep(routeLoader) {
      _classCallCheck(this, LoadRouteStep);

      this.routeLoader = routeLoader;
    }

    LoadRouteStep.inject = function inject() {
      return [RouteLoader];
    };

    LoadRouteStep.prototype.run = function run(navigationContext, next) {
      return loadNewRoute(this.routeLoader, navigationContext).then(next)['catch'](next.cancel);
    };

    return LoadRouteStep;
  })();

  exports.LoadRouteStep = LoadRouteStep;

  function loadNewRoute(routeLoader, navigationContext) {
    var toLoad = determineWhatToLoad(navigationContext);
    var loadPromises = toLoad.map(function (current) {
      return loadRoute(routeLoader, current.navigationContext, current.viewPortPlan);
    });

    return Promise.all(loadPromises);
  }

  function determineWhatToLoad(navigationContext, toLoad) {
    var plan = navigationContext.plan;
    var next = navigationContext.nextInstruction;

    toLoad = toLoad || [];

    for (var viewPortName in plan) {
      var viewPortPlan = plan[viewPortName];

      if (viewPortPlan.strategy == _navigationPlan.activationStrategy.replace) {
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

  function loadRoute(routeLoader, navigationContext, viewPortPlan) {
    var moduleId = viewPortPlan.config.moduleId;
    var next = navigationContext.nextInstruction;

    return loadComponent(routeLoader, navigationContext, viewPortPlan.config).then(function (component) {
      var viewPortInstruction = next.addViewPortInstruction(viewPortPlan.name, viewPortPlan.strategy, moduleId, component);

      var controller = component.executionContext,
          childRouter = component.childRouter;

      if (childRouter) {
        var path = next.getWildcardPath();

        return childRouter.createNavigationInstruction(path, next).then(function (childInstruction) {
          viewPortPlan.childNavigationContext = childRouter.createNavigationContext(childInstruction);

          return _navigationPlan.buildNavigationPlan(viewPortPlan.childNavigationContext).then(function (childPlan) {
            viewPortPlan.childNavigationContext.plan = childPlan;
            viewPortInstruction.childNavigationContext = viewPortPlan.childNavigationContext;

            return loadNewRoute(routeLoader, viewPortPlan.childNavigationContext);
          });
        });
      }
    });
  }

  function loadComponent(routeLoader, navigationContext, config) {
    var router = navigationContext.router,
        lifecycleArgs = navigationContext.nextInstruction.lifecycleArgs;

    return routeLoader.loadRoute(router, config).then(function (component) {
      component.router = router;
      component.config = config;

      if ('configureRouter' in component.executionContext) {
        var _component$executionContext;

        component.childRouter = component.childContainer.getChildRouter();

        var config = new _routerConfiguration.RouterConfiguration();
        var result = Promise.resolve((_component$executionContext = component.executionContext).configureRouter.apply(_component$executionContext, [config, component.childRouter].concat(lifecycleArgs)));

        return result.then(function () {
          component.childRouter.configure(config);
          return component;
        });
      }

      return component;
    });
  }
});
define('aurelia-router/activation',['exports', './navigation-plan', './navigation-commands', './util'], function (exports, _navigationPlan, _navigationCommands, _util) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var affirmations = ['yes', 'ok', 'true'];

  exports.affirmations = affirmations;

  var CanDeactivatePreviousStep = (function () {
    function CanDeactivatePreviousStep() {
      _classCallCheck(this, CanDeactivatePreviousStep);
    }

    CanDeactivatePreviousStep.prototype.run = function run(navigationContext, next) {
      return processDeactivatable(navigationContext.plan, 'canDeactivate', next);
    };

    return CanDeactivatePreviousStep;
  })();

  exports.CanDeactivatePreviousStep = CanDeactivatePreviousStep;

  var CanActivateNextStep = (function () {
    function CanActivateNextStep() {
      _classCallCheck(this, CanActivateNextStep);
    }

    CanActivateNextStep.prototype.run = function run(navigationContext, next) {
      return processActivatable(navigationContext, 'canActivate', next);
    };

    return CanActivateNextStep;
  })();

  exports.CanActivateNextStep = CanActivateNextStep;

  var DeactivatePreviousStep = (function () {
    function DeactivatePreviousStep() {
      _classCallCheck(this, DeactivatePreviousStep);
    }

    DeactivatePreviousStep.prototype.run = function run(navigationContext, next) {
      return processDeactivatable(navigationContext.plan, 'deactivate', next, true);
    };

    return DeactivatePreviousStep;
  })();

  exports.DeactivatePreviousStep = DeactivatePreviousStep;

  var ActivateNextStep = (function () {
    function ActivateNextStep() {
      _classCallCheck(this, ActivateNextStep);
    }

    ActivateNextStep.prototype.run = function run(navigationContext, next) {
      return processActivatable(navigationContext, 'activate', next, true);
    };

    return ActivateNextStep;
  })();

  exports.ActivateNextStep = ActivateNextStep;

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
          return _util.processPotential(result, inspect, next.cancel);
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

      if ((viewPortPlan.strategy == _navigationPlan.activationStrategy.invokeLifecycle || viewPortPlan.strategy == _navigationPlan.activationStrategy.replace) && prevComponent) {

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
    var controller = component.executionContext,
        childRouter = component.childRouter;

    if (childRouter && childRouter.currentInstruction) {
      var viewPortInstructions = childRouter.currentInstruction.viewPortInstructions;

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
          var result = (_current$controller = current.controller)[callbackName].apply(_current$controller, current.lifecycleArgs);
          return _util.processPotential(result, function (val) {
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

      if ((viewPortPlan.strategy === _navigationPlan.activationStrategy.invokeLifecycle || viewPortPlan.strategy === _navigationPlan.activationStrategy.replace) && callbackName in controller) {
        list.push({
          controller: controller,
          lifecycleArgs: viewPortInstruction.lifecycleArgs,
          router: router
        });
      }

      if (viewPortPlan.childNavigationContext) {
        findActivatable(viewPortPlan.childNavigationContext, callbackName, list, viewPortInstruction.component.childRouter || router);
      }
    });

    return list;
  }

  function shouldContinue(output, router) {
    if (output instanceof Error) {
      return false;
    }

    if (_navigationCommands.isNavigationCommand(output)) {
      if (typeof output.setRouter === 'function') {
        output.setRouter(router);
      }

      return !!output.shouldContinueProcessing;
    }

    if (typeof output === 'string') {
      return affirmations.indexOf(output.toLowerCase()) !== -1;
    }

    if (typeof output === 'undefined') {
      return true;
    }

    return output;
  }
});
define('aurelia-router/pipeline-provider',['exports', 'aurelia-dependency-injection', './pipeline', './navigation-plan', './route-loading', './navigation-context', './activation', './route-filters'], function (exports, _aureliaDependencyInjection, _pipeline, _navigationPlan, _routeLoading, _navigationContext, _activation, _routeFilters) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var PipelineProvider = (function () {
    function PipelineProvider(container) {
      _classCallCheck(this, PipelineProvider);

      this.container = container;
      this.steps = [_navigationPlan.BuildNavigationPlanStep, _activation.CanDeactivatePreviousStep, _routeLoading.LoadRouteStep, _routeFilters.createRouteFilterStep('authorize'), _routeFilters.createRouteFilterStep('modelbind'), _activation.CanActivateNextStep, _activation.DeactivatePreviousStep, _activation.ActivateNextStep, _routeFilters.createRouteFilterStep('precommit'), _navigationContext.CommitChangesStep];
    }

    PipelineProvider.inject = function inject() {
      return [_aureliaDependencyInjection.Container];
    };

    PipelineProvider.prototype.createPipeline = function createPipeline(navigationContext) {
      var _this = this;

      var pipeline = new _pipeline.Pipeline();
      this.steps.forEach(function (step) {
        return pipeline.withStep(_this.container.get(step));
      });
      return pipeline;
    };

    return PipelineProvider;
  })();

  exports.PipelineProvider = PipelineProvider;
});
define('aurelia-router/app-router',['exports', 'core-js', 'aurelia-dependency-injection', 'aurelia-history', './router', './pipeline-provider', './navigation-commands', 'aurelia-event-aggregator', './router-configuration'], function (exports, _coreJs, _aureliaDependencyInjection, _aureliaHistory, _router, _pipelineProvider, _navigationCommands, _aureliaEventAggregator, _routerConfiguration) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var _core = _interopRequire(_coreJs);

  var AppRouter = (function (_Router) {
    function AppRouter(container, history, pipelineProvider, events) {
      _classCallCheck(this, AppRouter);

      _Router.call(this, container, history);
      this.pipelineProvider = pipelineProvider;
      document.addEventListener('click', handleLinkClick.bind(this), true);
      this.events = events;
    }

    _inherits(AppRouter, _Router);

    AppRouter.inject = function inject() {
      return [_aureliaDependencyInjection.Container, _aureliaHistory.History, _pipelineProvider.PipelineProvider, _aureliaEventAggregator.EventAggregator];
    };

    AppRouter.prototype.loadUrl = function loadUrl(url) {
      var _this = this;

      return this.createNavigationInstruction(url).then(function (instruction) {
        return _this.queueInstruction(instruction);
      })['catch'](function (error) {
        console.error(error);

        if (_this.history.previousFragment) {
          _this.navigate(_this.history.previousFragment, false);
        }
      });
    };

    AppRouter.prototype.queueInstruction = function queueInstruction(instruction) {
      var _this2 = this;

      return new Promise(function (resolve) {
        instruction.resolve = resolve;
        _this2.queue.unshift(instruction);
        _this2.dequeueInstruction();
      });
    };

    AppRouter.prototype.dequeueInstruction = function dequeueInstruction() {
      var _this3 = this;

      if (this.isNavigating) {
        return;
      }

      var instruction = this.queue.shift();
      this.queue = [];

      if (!instruction) {
        return;
      }

      this.isNavigating = true;
      this.events.publish('router:navigation:processing', instruction);

      var context = this.createNavigationContext(instruction);
      var pipeline = this.pipelineProvider.createPipeline(context);

      pipeline.run(context).then(function (result) {
        _this3.isNavigating = false;

        if (!(result && 'completed' in result && 'output' in result)) {
          throw new Error('Expected router pipeline to return a navigation result, but got [' + JSON.stringify(result) + '] instead.');
        }

        if (result.completed) {
          _this3.history.previousFragment = instruction.fragment;
        }

        if (result.output instanceof Error) {
          console.error(result.output);
          _this3.events.publish('router:navigation:error', { instruction: instruction, result: result });
        }

        if (_navigationCommands.isNavigationCommand(result.output)) {
          result.output.navigate(_this3);
        } else if (!result.completed) {
          _this3.navigate(_this3.history.previousFragment || '', false);
          _this3.events.publish('router:navigation:cancelled', instruction);
        }

        instruction.resolve(result);
        _this3.dequeueInstruction();
      }).then(function (result) {
        return _this3.events.publish('router:navigation:complete', instruction);
      })['catch'](function (error) {
        console.error(error);
      });
    };

    AppRouter.prototype.registerViewPort = function registerViewPort(viewPort, name) {
      var _this4 = this;

      _Router.prototype.registerViewPort.call(this, viewPort, name);

      if (!this.isActive) {
        if ('configureRouter' in this.container.viewModel) {
          var config = new _routerConfiguration.RouterConfiguration();
          var result = Promise.resolve(this.container.viewModel.configureRouter(config, this));

          return result.then(function () {
            _this4.configure(config);
            _this4.activate();
          });
        } else {
          this.activate();
        }
      } else {
        this.dequeueInstruction();
      }
    };

    AppRouter.prototype.activate = function activate(options) {
      if (this.isActive) {
        return;
      }

      this.isActive = true;
      this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
      this.history.activate(this.options);
      this.dequeueInstruction();
    };

    AppRouter.prototype.deactivate = function deactivate() {
      this.isActive = false;
      this.history.deactivate();
    };

    AppRouter.prototype.reset = function reset() {
      _Router.prototype.reset.call(this);
      this.queue = [];
      this.options = null;
    };

    _createClass(AppRouter, [{
      key: 'isRoot',
      get: function () {
        return true;
      }
    }]);

    return AppRouter;
  })(_router.Router);

  exports.AppRouter = AppRouter;

  function findAnchor(el) {
    while (el) {
      if (el.tagName === 'A') return el;
      el = el.parentNode;
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
        var href = target.getAttribute('href');

        if (href !== null && !(href.charAt(0) === '#' || /^[a-z]+:/i.test(href))) {
          evt.preventDefault();
          this.history.navigate(href);
        }
      }
    }
  }

  function targetIsThisWindow(target) {
    var targetWindow = target.getAttribute('target');

    return !targetWindow || targetWindow === window.name || targetWindow === '_self' || targetWindow === 'top' && window === window.top;
  }
});
define('aurelia-router/index',['exports', './router', './app-router', './pipeline-provider', './navigation-commands', './route-loading', './router-configuration', './navigation-plan', './route-filters'], function (exports, _router, _appRouter, _pipelineProvider, _navigationCommands, _routeLoading, _routerConfiguration, _navigationPlan, _routeFilters) {
  

  exports.__esModule = true;
  exports.Router = _router.Router;
  exports.AppRouter = _appRouter.AppRouter;
  exports.PipelineProvider = _pipelineProvider.PipelineProvider;
  exports.Redirect = _navigationCommands.Redirect;
  exports.RouteLoader = _routeLoading.RouteLoader;
  exports.RouterConfiguration = _routerConfiguration.RouterConfiguration;
  exports.activationStrategy = _navigationPlan.activationStrategy;
  exports.RouteFilterContainer = _routeFilters.RouteFilterContainer;
  exports.createRouteFilterStep = _routeFilters.createRouteFilterStep;
});
define('aurelia-router', ['aurelia-router/index'], function (main) { return main; });

define('aurelia-templating-binding/syntax-interpreter',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var SyntaxInterpreter = (function () {
    function SyntaxInterpreter(parser, observerLocator, eventManager) {
      _classCallCheck(this, SyntaxInterpreter);

      this.parser = parser;
      this.observerLocator = observerLocator;
      this.eventManager = eventManager;
    }

    SyntaxInterpreter.inject = function inject() {
      return [_aureliaBinding.Parser, _aureliaBinding.ObserverLocator, _aureliaBinding.EventManager];
    };

    SyntaxInterpreter.prototype.interpret = function interpret(resources, element, info, existingInstruction) {
      if (info.command in this) {
        return this[info.command](resources, element, info, existingInstruction);
      }

      return this.handleUnknownCommand(resources, element, info, existingInstruction);
    };

    SyntaxInterpreter.prototype.handleUnknownCommand = function handleUnknownCommand(resources, element, info, existingInstruction) {
      var attrName = info.attrName,
          command = info.command;

      var instruction = this.options(resources, element, info, existingInstruction);

      instruction.alteredAttr = true;
      instruction.attrName = 'global-behavior';
      instruction.attributes.aureliaAttrName = attrName;
      instruction.attributes.aureliaCommand = command;

      return instruction;
    };

    SyntaxInterpreter.prototype.determineDefaultBindingMode = function determineDefaultBindingMode(element, attrName) {
      var tagName = element.tagName.toLowerCase();

      if (tagName === 'input') {
        return attrName === 'value' || attrName === 'checked' ? _aureliaBinding.bindingMode.twoWay : _aureliaBinding.bindingMode.oneWay;
      } else if (tagName == 'textarea' || tagName == 'select') {
        return attrName == 'value' ? _aureliaBinding.bindingMode.twoWay : _aureliaBinding.bindingMode.oneWay;
      } else if (attrName === 'textcontent' || attrName === 'innerhtml') {
        return element.contentEditable === 'true' ? _aureliaBinding.bindingMode.twoWay : _aureliaBinding.bindingMode.oneWay;
      }

      return _aureliaBinding.bindingMode.oneWay;
    };

    SyntaxInterpreter.prototype.bind = function bind(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

      instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), info.defaultBindingMode || this.determineDefaultBindingMode(element, info.attrName), resources.valueConverterLookupFunction);

      return instruction;
    };

    SyntaxInterpreter.prototype.trigger = function trigger(resources, element, info) {
      return new _aureliaBinding.ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), false, true);
    };

    SyntaxInterpreter.prototype.delegate = function delegate(resources, element, info) {
      return new _aureliaBinding.ListenerExpression(this.eventManager, info.attrName, this.parser.parse(info.attrValue), true, true);
    };

    SyntaxInterpreter.prototype.call = function call(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

      instruction.attributes[info.attrName] = new _aureliaBinding.CallExpression(this.observerLocator, info.attrName, this.parser.parse(info.attrValue), resources.valueConverterLookupFunction);

      return instruction;
    };

    SyntaxInterpreter.prototype.options = function options(resources, element, info, existingInstruction) {
      var instruction = existingInstruction || { attrName: info.attrName, attributes: {} },
          attrValue = info.attrValue,
          language = this.language,
          name = null,
          target = '',
          current,
          i,
          ii;

      for (i = 0, ii = attrValue.length; i < ii; ++i) {
        current = attrValue[i];

        if (current === ';') {
          info = language.inspectAttribute(resources, name, target.trim());
          language.createAttributeInstruction(resources, element, info, instruction);

          if (!instruction.attributes[info.attrName]) {
            instruction.attributes[info.attrName] = info.attrValue;
          }

          target = '';
          name = null;
        } else if (current === ':' && name === null) {
          name = target.trim();
          target = '';
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
    };

    return SyntaxInterpreter;
  })();

  exports.SyntaxInterpreter = SyntaxInterpreter;

  SyntaxInterpreter.prototype['for'] = function (resources, element, info, existingInstruction) {
    var parts = info.attrValue.split(' of ');

    if (parts.length !== 2) {
      throw new Error('Incorrect syntax for "for". The form is: "$local of $items".');
    }

    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    if (parts[0].match(/[[].+[,]\s.+[\]]/)) {
      var firstPart = parts[0];
      parts[0] = firstPart.substr(1, firstPart.indexOf(',') - 1);
      parts.splice(1, 0, firstPart.substring(firstPart.indexOf(', ') + 2, firstPart.length - 1));
      instruction.attributes.key = parts[0];
      instruction.attributes.value = parts[1];
    } else {
      instruction.attributes.local = parts[0];
    }

    instruction.attributes.items = new _aureliaBinding.BindingExpression(this.observerLocator, 'items', this.parser.parse(parts[parts.length - 1]), _aureliaBinding.bindingMode.oneWay, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype['two-way'] = function (resources, element, info, existingInstruction) {
    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.twoWay, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype['one-way'] = function (resources, element, info, existingInstruction) {
    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.oneWay, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype['one-time'] = function (resources, element, info, existingInstruction) {
    var instruction = existingInstruction || { attrName: info.attrName, attributes: {} };

    instruction.attributes[info.attrName] = new _aureliaBinding.BindingExpression(this.observerLocator, this.attributeMap[info.attrName] || info.attrName, this.parser.parse(info.attrValue), _aureliaBinding.bindingMode.oneTime, resources.valueConverterLookupFunction);

    return instruction;
  };

  SyntaxInterpreter.prototype['view-model'] = function (resources, element, info) {
    return new _aureliaBinding.NameExpression(info.attrValue, 'view-model');
  };
});
define('aurelia-templating-binding/binding-language',['exports', 'aurelia-templating', 'aurelia-binding', './syntax-interpreter', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaBinding, _syntaxInterpreter, _aureliaLogging) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var info = {},
      logger = _aureliaLogging.getLogger('templating-binding');

  var TemplatingBindingLanguage = (function (_BindingLanguage) {
    function TemplatingBindingLanguage(parser, observerLocator, syntaxInterpreter) {
      _classCallCheck(this, TemplatingBindingLanguage);

      _BindingLanguage.call(this);
      this.parser = parser;
      this.observerLocator = observerLocator;
      this.syntaxInterpreter = syntaxInterpreter;
      this.emptyStringExpression = this.parser.parse('\'\'');
      syntaxInterpreter.language = this;
      this.attributeMap = syntaxInterpreter.attributeMap = {
        'class': 'className',
        'contenteditable': 'contentEditable',
        'for': 'htmlFor',
        'tabindex': 'tabIndex',
        'textcontent': 'textContent',
        'innerhtml': 'innerHTML',
        'maxlength': 'maxLength',
        'minlength': 'minLength',
        'formaction': 'formAction',
        'formenctype': 'formEncType',
        'formmethod': 'formMethod',
        'formnovalidate': 'formNoValidate',
        'formtarget': 'formTarget' };
    }

    _inherits(TemplatingBindingLanguage, _BindingLanguage);

    TemplatingBindingLanguage.inject = function inject() {
      return [_aureliaBinding.Parser, _aureliaBinding.ObserverLocator, _syntaxInterpreter.SyntaxInterpreter];
    };

    TemplatingBindingLanguage.prototype.inspectAttribute = function inspectAttribute(resources, attrName, attrValue) {
      var parts = attrName.split('.');

      info.defaultBindingMode = null;

      if (parts.length == 2) {
        info.attrName = parts[0].trim();
        info.attrValue = attrValue;
        info.command = parts[1].trim();
        info.expression = null;
      } else if (attrName == 'ref') {
        info.attrName = attrName;
        info.attrValue = attrValue;
        info.command = null;
        info.expression = new _aureliaBinding.NameExpression(attrValue, 'element');
      } else {
        info.attrName = attrName;
        info.attrValue = attrValue;
        info.command = null;
        info.expression = this.parseContent(resources, attrName, attrValue);
      }

      return info;
    };

    TemplatingBindingLanguage.prototype.createAttributeInstruction = function createAttributeInstruction(resources, element, info, existingInstruction) {
      var instruction;

      if (info.expression) {
        if (info.attrName === 'ref') {
          return info.expression;
        }

        instruction = existingInstruction || { attrName: info.attrName, attributes: {} };
        instruction.attributes[info.attrName] = info.expression;
      } else if (info.command) {
        instruction = this.syntaxInterpreter.interpret(resources, element, info, existingInstruction);
      }

      return instruction;
    };

    TemplatingBindingLanguage.prototype.parseText = function parseText(resources, value) {
      return this.parseContent(resources, 'textContent', value);
    };

    TemplatingBindingLanguage.prototype.parseContent = function parseContent(resources, attrName, attrValue) {
      var i = attrValue.indexOf('${', 0),
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
            case '\'':
            case '"':
              if (quote === null) {
                quote = char;
              } else if (quote === char) {
                quote = null;
              }
              continue;
            case '\\':
              i++;
              continue;
          }

          if (quote !== null) {
            continue;
          }

          if (char === '{') {
            open++;
          } else if (char === '}') {
            open--;
          }
        } while (open > 0 && i < ii);

        if (open === 0) {
          parts = parts || [];
          if (attrValue[interpolationStart - 1] === '\\' && attrValue[interpolationStart - 2] !== '\\') {
            parts[partIndex] = attrValue.substring(pos, interpolationStart - 1) + attrValue.substring(interpolationStart, i);
            partIndex++;
            parts[partIndex] = this.emptyStringExpression;
            partIndex++;
          } else {
            parts[partIndex] = attrValue.substring(pos, interpolationStart);
            partIndex++;
            parts[partIndex] = this.parser.parse(attrValue.substring(interpolationStart + 2, i - 1));
            partIndex++;
          }
          pos = i;
          i = attrValue.indexOf('${', i);
        } else {
          break;
        }
      }

      if (partIndex === 0) {
        return null;
      }

      parts[partIndex] = attrValue.substr(pos);

      return new InterpolationBindingExpression(this.observerLocator, this.attributeMap[attrName] || attrName, parts, _aureliaBinding.bindingMode.oneWay, resources.valueConverterLookupFunction, attrName);
    };

    return TemplatingBindingLanguage;
  })(_aureliaTemplating.BindingLanguage);

  exports.TemplatingBindingLanguage = TemplatingBindingLanguage;

  var InterpolationBindingExpression = (function () {
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

    InterpolationBindingExpression.prototype.createBinding = function createBinding(target) {
      return new InterpolationBinding(this.observerLocator, this.parts, target, this.targetProperty, this.mode, this.valueConverterLookupFunction);
    };

    return InterpolationBindingExpression;
  })();

  exports.InterpolationBindingExpression = InterpolationBindingExpression;

  var InterpolationBinding = (function () {
    function InterpolationBinding(observerLocator, parts, target, targetProperty, mode, valueConverterLookupFunction) {
      _classCallCheck(this, InterpolationBinding);

      if (targetProperty === 'style') {
        logger.info('Internet Explorer does not support interpolation in "style" attributes.  Use the style attribute\'s alias, "css" instead.');
      } else if (target.parentElement && target.parentElement.nodeName === 'TEXTAREA' && targetProperty === 'textContent') {
        throw new Error('Interpolation binding cannot be used in the content of a textarea element.  Use <textarea value.bind="expression"></textarea> instead.');
      }
      this.observerLocator = observerLocator;
      this.parts = parts;
      this.targetProperty = observerLocator.getObserver(target, targetProperty);
      this.mode = mode;
      this.valueConverterLookupFunction = valueConverterLookupFunction;
      this.toDispose = [];
    }

    InterpolationBinding.prototype.getObserver = function getObserver(obj, propertyName) {
      return this.observerLocator.getObserver(obj, propertyName);
    };

    InterpolationBinding.prototype.bind = function bind(source) {
      this.source = source;

      if (this.mode == _aureliaBinding.bindingMode.oneWay) {
        this.unbind();
        this.connect();
        this.setValue();
      } else {
        this.setValue();
      }
    };

    InterpolationBinding.prototype.setValue = function setValue() {
      var value = this.interpolate();
      this.targetProperty.setValue(value);
    };

    InterpolationBinding.prototype.partChanged = function partChanged(newValue, oldValue, connecting) {
      var _this = this;

      var map, info;
      if (!connecting) {
        this.setValue();
      }
      if (oldValue instanceof Array) {
        map = this.arrayPartMap;
        info = map ? map.get(oldValue) : null;
        if (info) {
          info.refs--;
          if (info.refs === 0) {
            info.dispose();
            map['delete'](oldValue);
          }
        }
      }
      if (newValue instanceof Array) {
        map = this.arrayPartMap || (this.arrayPartMap = new Map());
        info = map.get(newValue);
        if (!info) {
          info = {
            refs: 0,
            dispose: this.observerLocator.getArrayObserver(newValue).subscribe(function () {
              return _this.setValue();
            })
          };
          map.set(newValue, info);
        }
        info.refs++;
      }
    };

    InterpolationBinding.prototype.connect = function connect() {
      var info,
          parts = this.parts,
          source = this.source,
          toDispose = this.toDispose = [],
          partChanged = this.partChanged.bind(this),
          i,
          ii;

      for (i = 0, ii = parts.length; i < ii; ++i) {
        if (i % 2 === 0) {} else {
          info = parts[i].connect(this, source);
          if (info.observer) {
            toDispose.push(info.observer.subscribe(partChanged));
          }
          if (info.value instanceof Array) {
            partChanged(info.value, undefined, true);
          }
        }
      }
    };

    InterpolationBinding.prototype.interpolate = function interpolate() {
      var value = '',
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
          value += typeof temp !== 'undefined' && temp !== null ? temp.toString() : '';
        }
      }

      return value;
    };

    InterpolationBinding.prototype.unbind = function unbind() {
      var i,
          ii,
          toDispose = this.toDispose,
          map = this.arrayPartMap;

      if (toDispose) {
        for (i = 0, ii = toDispose.length; i < ii; ++i) {
          toDispose[i]();
        }
      }

      this.toDispose = null;

      if (map) {
        for (var _iterator = map.values(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          if (_isArray) {
            if (_i >= _iterator.length) break;
            toDispose = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            toDispose = _i.value;
          }

          toDispose.dispose();
        }
        map.clear();
      }

      this.arrayPartMap = null;
    };

    return InterpolationBinding;
  })();
});
define('aurelia-templating-binding/index',['exports', 'aurelia-templating', './binding-language', './syntax-interpreter'], function (exports, _aureliaTemplating, _bindingLanguage, _syntaxInterpreter) {
  

  exports.__esModule = true;

  function configure(aurelia) {
    var instance,
        getInstance = function getInstance(c) {
      return instance || (instance = c.invoke(_bindingLanguage.TemplatingBindingLanguage));
    };

    if (aurelia.container.hasHandler(_bindingLanguage.TemplatingBindingLanguage)) {
      instance = aurelia.container.get(_bindingLanguage.TemplatingBindingLanguage);
    } else {
      aurelia.container.registerHandler(_bindingLanguage.TemplatingBindingLanguage, getInstance);
    }

    aurelia.container.registerHandler(_aureliaTemplating.BindingLanguage, getInstance);
  }

  exports.TemplatingBindingLanguage = _bindingLanguage.TemplatingBindingLanguage;
  exports.SyntaxInterpreter = _syntaxInterpreter.SyntaxInterpreter;
  exports.configure = configure;
});
define('aurelia-templating-binding', ['aurelia-templating-binding/index'], function (main) { return main; });

define('aurelia-templating-resources/compose',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Compose = (function () {
    function Compose(container, compositionEngine, viewSlot, viewResources) {
      _classCallCheck(this, _Compose);

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.viewSlot = viewSlot;
      this.viewResources = viewResources;
    }

    var _Compose = Compose;

    _Compose.prototype.bind = function bind(executionContext) {
      this.executionContext = executionContext;
      processInstruction(this, { view: this.view, viewModel: this.viewModel, model: this.model });
    };

    _Compose.prototype.modelChanged = function modelChanged(newValue, oldValue) {
      var vm = this.currentViewModel;

      if (vm && typeof vm.activate === 'function') {
        vm.activate(newValue);
      }
    };

    _Compose.prototype.viewChanged = function viewChanged(newValue, oldValue) {
      processInstruction(this, { view: newValue, viewModel: this.currentViewModel || this.viewModel, model: this.model });
    };

    _Compose.prototype.viewModelChanged = function viewModelChanged(newValue, oldValue) {
      processInstruction(this, { viewModel: newValue, view: this.view, model: this.model });
    };

    Compose = _aureliaDependencyInjection.inject(_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine, _aureliaTemplating.ViewSlot, _aureliaTemplating.ViewResources)(Compose) || Compose;
    Compose = _aureliaTemplating.noView(Compose) || Compose;
    Compose = _aureliaTemplating.bindable('viewModel')(Compose) || Compose;
    Compose = _aureliaTemplating.bindable('view')(Compose) || Compose;
    Compose = _aureliaTemplating.bindable('model')(Compose) || Compose;
    Compose = _aureliaTemplating.customElement('compose')(Compose) || Compose;
    return Compose;
  })();

  exports.Compose = Compose;

  function processInstruction(composer, instruction) {
    composer.compositionEngine.compose(Object.assign(instruction, {
      executionContext: composer.executionContext,
      container: composer.container,
      viewSlot: composer.viewSlot,
      viewResources: composer.viewResources,
      currentBehavior: composer.currentBehavior
    })).then(function (next) {
      composer.currentBehavior = next;
      composer.currentViewModel = next ? next.executionContext : null;
    });
  }
});
define('aurelia-templating-resources/if',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var If = (function () {
    function If(viewFactory, viewSlot) {
      _classCallCheck(this, _If);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.showing = false;
    }

    var _If = If;

    _If.prototype.valueChanged = function valueChanged(newValue) {
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
    };

    If = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(If) || If;
    If = _aureliaTemplating.templateController(If) || If;
    If = _aureliaTemplating.customAttribute('if')(If) || If;
    return If;
  })();

  exports.If = If;
});
define('aurelia-templating-resources/with',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var With = (function () {
    function With(viewFactory, viewSlot) {
      _classCallCheck(this, _With);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
    }

    var _With = With;

    _With.prototype.valueChanged = function valueChanged(newValue) {
      if (!this.view) {
        this.view = this.viewFactory.create(newValue);
        this.viewSlot.add(this.view);
      } else {
        this.view.bind(newValue);
      }
    };

    With = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot)(With) || With;
    With = _aureliaTemplating.templateController(With) || With;
    With = _aureliaTemplating.customAttribute('with')(With) || With;
    return With;
  })();

  exports.With = With;
});
define('aurelia-templating-resources/repeat',['exports', 'aurelia-dependency-injection', 'aurelia-binding', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaBinding, _aureliaTemplating) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Repeat = (function () {
    function Repeat(viewFactory, viewSlot, observerLocator) {
      _classCallCheck(this, _Repeat);

      this.viewFactory = viewFactory;
      this.viewSlot = viewSlot;
      this.observerLocator = observerLocator;
      this.local = 'item';
      this.key = 'key';
      this.value = 'value';
    }

    var _Repeat = Repeat;

    _Repeat.prototype.bind = function bind(executionContext) {
      var _this = this;

      var items = this.items,
          observer;

      this.executionContext = executionContext;

      if (!items) {
        if (this.oldItems) {
          this.viewSlot.removeAll();
        }

        return;
      }

      if (this.oldItems === items) {
        if (items instanceof Map) {
          var records = _aureliaBinding.getChangeRecords(items);
          observer = this.observerLocator.getMapObserver(items);

          this.handleMapChangeRecords(items, records);

          this.disposeSubscription = observer.subscribe(function (records) {
            _this.handleMapChangeRecords(items, records);
          });
        } else {
          var splices = _aureliaBinding.calcSplices(items, 0, items.length, this.lastBoundItems, 0, this.lastBoundItems.length);
          observer = this.observerLocator.getArrayObserver(items);

          this.handleSplices(items, splices);
          this.lastBoundItems = this.oldItems = null;

          this.disposeSubscription = observer.subscribe(function (splices) {
            _this.handleSplices(items, splices);
          });
        }
      } else {
        this.processItems();
      }
    };

    _Repeat.prototype.unbind = function unbind() {
      this.oldItems = this.items;

      if (this.items instanceof Array) {
        this.lastBoundItems = this.items.slice(0);
      }

      if (this.disposeSubscription) {
        this.disposeSubscription();
        this.disposeSubscription = null;
      }
    };

    _Repeat.prototype.itemsChanged = function itemsChanged() {
      this.processItems();
    };

    _Repeat.prototype.processItems = function processItems() {
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
    };

    _Repeat.prototype.processArrayItems = function processArrayItems(items) {
      var _this2 = this;

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
        _this2.handleSplices(items, splices);
      });
    };

    _Repeat.prototype.processMapEntries = function processMapEntries(items) {
      var _this3 = this;

      var viewFactory = this.viewFactory,
          viewSlot = this.viewSlot,
          index = 0,
          row,
          view,
          observer;

      observer = this.observerLocator.getMapObserver(items);

      items.forEach(function (value, key) {
        row = _this3.createFullExecutionKvpContext(key, value, index, items.size);
        view = viewFactory.create(row);
        viewSlot.add(view);
        ++index;
      });

      this.disposeSubscription = observer.subscribe(function (record) {
        _this3.handleMapChangeRecords(items, record);
      });
    };

    _Repeat.prototype.createBaseExecutionContext = function createBaseExecutionContext(data) {
      var context = {};
      context[this.local] = data;
      context.$parent = this.executionContext;
      return context;
    };

    _Repeat.prototype.createBaseExecutionKvpContext = function createBaseExecutionKvpContext(key, value) {
      var context = {};
      context[this.key] = key;
      context[this.value] = value;
      context.$parent = this.executionContext;
      return context;
    };

    _Repeat.prototype.createFullExecutionContext = function createFullExecutionContext(data, index, length) {
      var context = this.createBaseExecutionContext(data);
      return this.updateExecutionContext(context, index, length);
    };

    _Repeat.prototype.createFullExecutionKvpContext = function createFullExecutionKvpContext(key, value, index, length) {
      var context = this.createBaseExecutionKvpContext(key, value);
      return this.updateExecutionContext(context, index, length);
    };

    _Repeat.prototype.updateExecutionContext = function updateExecutionContext(context, index, length) {
      var first = index === 0,
          last = index === length - 1,
          even = index % 2 === 0;

      context.$index = index;
      context.$first = first;
      context.$last = last;
      context.$middle = !(first || last);
      context.$odd = !even;
      context.$even = even;

      return context;
    };

    _Repeat.prototype.handleSplices = function handleSplices(array, splices) {
      var viewLookup = new Map(),
          viewSlot = this.viewSlot,
          spliceIndexLow,
          view,
          i,
          ii,
          j,
          jj,
          row,
          splice,
          addIndex,
          end,
          itemsLeftToAdd,
          removed,
          model,
          children,
          length;

      for (i = 0, ii = splices.length; i < ii; ++i) {
        splice = splices[i];
        addIndex = splice.index;
        itemsLeftToAdd = splice.addedCount;
        end = splice.index + splice.addedCount;
        removed = splice.removed;
        if (typeof spliceIndexLow === 'undefined' || spliceIndexLow === null || spliceIndexLow > splice.index) {
          spliceIndexLow = splice.index;
        }

        for (j = 0, jj = removed.length; j < jj; ++j) {
          if (itemsLeftToAdd > 0) {
            view = viewSlot.children[splice.index + j];
            view.executionContext[this.local] = array[addIndex + j];
            --itemsLeftToAdd;
          } else {
            view = viewSlot.removeAt(addIndex + splice.addedCount);
            if (view) {
              viewLookup.set(removed[j], view);
            }
          }
        }

        addIndex += removed.length;

        for (; 0 < itemsLeftToAdd; ++addIndex) {
          model = array[addIndex];
          view = viewLookup.get(model);
          if (view) {
            viewLookup['delete'](model);
            viewSlot.insert(addIndex, view);
          } else {
            row = this.createBaseExecutionContext(model);
            view = this.viewFactory.create(row);
            viewSlot.insert(addIndex, view);
          }
          --itemsLeftToAdd;
        }
      }

      children = this.viewSlot.children;
      length = children.length;

      if (spliceIndexLow > 0) {
        spliceIndexLow = spliceIndexLow - 1;
      }

      for (; spliceIndexLow < length; ++spliceIndexLow) {
        this.updateExecutionContext(children[spliceIndexLow].executionContext, spliceIndexLow, length);
      }

      viewLookup.forEach(function (x) {
        return x.unbind();
      });
    };

    _Repeat.prototype.handleMapChangeRecords = function handleMapChangeRecords(map, records) {
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
          case 'update':
            removeIndex = this.getViewIndexByKey(key);
            viewSlot.removeAt(removeIndex);
            row = this.createBaseExecutionKvpContext(key, map.get(key));
            view = this.viewFactory.create(row);
            viewSlot.insert(removeIndex, view);
            break;
          case 'add':
            row = this.createBaseExecutionKvpContext(key, map.get(key));
            view = this.viewFactory.create(row);
            viewSlot.insert(map.size, view);
            break;
          case 'delete':
            if (!record.oldValue) {
              return;
            }
            removeIndex = this.getViewIndexByKey(key);
            viewSlot.removeAt(removeIndex);
            break;
          case 'clear':
            viewSlot.removeAll();
        }
      }

      children = viewSlot.children;
      length = children.length;

      for (i = 0; i < length; i++) {
        this.updateExecutionContext(children[i].executionContext, i, length);
      }
    };

    _Repeat.prototype.getViewIndexByKey = function getViewIndexByKey(key) {
      var viewSlot = this.viewSlot,
          i,
          ii,
          child;

      for (i = 0, ii = viewSlot.children.length; i < ii; ++i) {
        child = viewSlot.children[i];
        if (child.bindings[0].source[this.key] === key) {
          return i;
        }
      }
    };

    Repeat = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot, _aureliaBinding.ObserverLocator)(Repeat) || Repeat;
    Repeat = _aureliaTemplating.templateController(Repeat) || Repeat;
    Repeat = _aureliaTemplating.bindable('value')(Repeat) || Repeat;
    Repeat = _aureliaTemplating.bindable('key')(Repeat) || Repeat;
    Repeat = _aureliaTemplating.bindable('local')(Repeat) || Repeat;
    Repeat = _aureliaTemplating.bindable('items')(Repeat) || Repeat;
    Repeat = _aureliaTemplating.customAttribute('repeat')(Repeat) || Repeat;
    return Repeat;
  })();

  exports.Repeat = Repeat;
});
define('aurelia-templating-resources/show',['exports', 'aurelia-dependency-injection', 'aurelia-templating'], function (exports, _aureliaDependencyInjection, _aureliaTemplating) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    node.type = 'text/css';
    document.head.appendChild(node);
  }

  addStyleString('.aurelia-hide { display:none !important; }');

  var Show = (function () {
    function Show(element) {
      _classCallCheck(this, _Show);

      this.element = element;
    }

    var _Show = Show;

    _Show.prototype.valueChanged = function valueChanged(newValue) {
      if (newValue) {
        this.element.classList.remove('aurelia-hide');
      } else {
        this.element.classList.add('aurelia-hide');
      }
    };

    Show = _aureliaDependencyInjection.inject(Element)(Show) || Show;
    Show = _aureliaTemplating.customAttribute('show')(Show) || Show;
    return Show;
  })();

  exports.Show = Show;
});
define('aurelia-templating-resources/global-behavior',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-logging'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaLogging) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var GlobalBehavior = (function () {
    function GlobalBehavior(element) {
      _classCallCheck(this, _GlobalBehavior);

      this.element = element;
    }

    var _GlobalBehavior = GlobalBehavior;

    _GlobalBehavior.prototype.bind = function bind() {
      var handler = GlobalBehavior.handlers[this.aureliaAttrName];

      if (!handler) {
        throw new Error('Binding handler not found for \'' + this.aureliaAttrName + '.' + this.aureliaCommand + '\'. Element:\n' + this.element.outerHTML + '\n');
      }

      try {
        this.handler = handler.bind(this, this.element, this.aureliaCommand) || handler;
      } catch (error) {
        throw _aureliaLogging.AggregateError('Conventional binding handler failed.', error);
      }
    };

    _GlobalBehavior.prototype.attached = function attached() {
      if (this.handler && 'attached' in this.handler) {
        this.handler.attached(this, this.element);
      }
    };

    _GlobalBehavior.prototype.detached = function detached() {
      if (this.handler && 'detached' in this.handler) {
        this.handler.detached(this, this.element);
      }
    };

    _GlobalBehavior.prototype.unbind = function unbind() {
      if (this.handler && 'unbind' in this.handler) {
        this.handler.unbind(this, this.element);
      }

      this.handler = null;
    };

    GlobalBehavior = _aureliaDependencyInjection.inject(Element)(GlobalBehavior) || GlobalBehavior;
    GlobalBehavior = _aureliaTemplating.dynamicOptions(GlobalBehavior) || GlobalBehavior;
    GlobalBehavior = _aureliaTemplating.customAttribute('global-behavior')(GlobalBehavior) || GlobalBehavior;
    return GlobalBehavior;
  })();

  exports.GlobalBehavior = GlobalBehavior;

  GlobalBehavior.createSettingsFromBehavior = function (behavior) {
    var settings = {};

    for (var key in behavior) {
      if (key === 'aureliaAttrName' || key === 'aureliaCommand' || !behavior.hasOwnProperty(key)) {
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
          _aureliaLogging.getLogger('templating-resources').warn('Could not find the jQuery plugin ' + pluginName + ', possibly due to case mismatch. Trying to enumerate jQuery methods in lowercase. Add the correctly cased plugin name to the GlobalBehavior to avoid this performance hit.');

          for (var prop in jqueryElement) {
            if (prop.toLowerCase() === pluginName) {
              pluginName = prop;
            }
          }
        }

        behavior.plugin = jqueryElement[pluginName](settings);
      },
      unbind: function unbind(behavior, element) {
        if (typeof behavior.plugin.destroy === 'function') {
          behavior.plugin.destroy();
          behavior.plugin = null;
        }
      }
    }
  };
});
define('aurelia-templating-resources/sanitize-html',['exports', 'aurelia-binding'], function (exports, _aureliaBinding) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  var SanitizeHtmlValueConverter = (function () {
    function SanitizeHtmlValueConverter() {
      _classCallCheck(this, _SanitizeHtmlValueConverter);

      this.sanitizer = SanitizeHtmlValueConverter.defaultSanitizer;
    }

    var _SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;

    _SanitizeHtmlValueConverter.defaultSanitizer = function defaultSanitizer(untrustedMarkup) {
      return untrustedMarkup.replace(SCRIPT_REGEX, '');
    };

    _SanitizeHtmlValueConverter.prototype.toView = function toView(untrustedMarkup) {
      if (untrustedMarkup === null) {
        return null;
      }

      return this.sanitizer(untrustedMarkup);
    };

    SanitizeHtmlValueConverter = _aureliaBinding.valueConverter('sanitizeHtml')(SanitizeHtmlValueConverter) || SanitizeHtmlValueConverter;
    return SanitizeHtmlValueConverter;
  })();

  exports.SanitizeHtmlValueConverter = SanitizeHtmlValueConverter;
});
define('aurelia-templating-resources/index',['exports', './compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html'], function (exports, _compose, _if, _with, _repeat, _show, _globalBehavior, _sanitizeHtml) {
  

  exports.__esModule = true;

  function configure(aurelia) {
    aurelia.globalizeResources('./compose', './if', './with', './repeat', './show', './global-behavior', './sanitize-html');
  }

  exports.Compose = _compose.Compose;
  exports.If = _if.If;
  exports.With = _with.With;
  exports.Repeat = _repeat.Repeat;
  exports.Show = _show.Show;
  exports.SanitizeHtmlValueConverter = _sanitizeHtml.SanitizeHtmlValueConverter;
  exports.GlobalBehavior = _globalBehavior.GlobalBehavior;
  exports.configure = configure;
});
define('aurelia-templating-resources', ['aurelia-templating-resources/index'], function (main) { return main; });

define('aurelia-templating-router/route-loader',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-path', 'aurelia-metadata'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaPath, _aureliaMetadata) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

  var TemplatingRouteLoader = (function (_RouteLoader) {
    function TemplatingRouteLoader(compositionEngine) {
      _classCallCheck(this, _TemplatingRouteLoader);

      _RouteLoader.call(this);
      this.compositionEngine = compositionEngine;
    }

    _inherits(TemplatingRouteLoader, _RouteLoader);

    var _TemplatingRouteLoader = TemplatingRouteLoader;

    _TemplatingRouteLoader.prototype.loadRoute = function loadRoute(router, config) {
      var childContainer = router.container.createChild(),
          instruction = {
        viewModel: _aureliaPath.relativeToFile(config.moduleId, _aureliaMetadata.Origin.get(router.container.viewModel.constructor).moduleId),
        childContainer: childContainer,
        view: config.view || config.viewStrategy
      };

      childContainer.getChildRouter = function () {
        var childRouter;

        childContainer.registerHandler(_aureliaRouter.Router, function (c) {
          return childRouter || (childRouter = router.createChild(childContainer));
        });

        return childContainer.get(_aureliaRouter.Router);
      };

      return this.compositionEngine.createViewModel(instruction).then(function (instruction) {
        instruction.executionContext = instruction.viewModel;
        instruction.router = router;
        return instruction;
      });
    };

    TemplatingRouteLoader = _aureliaDependencyInjection.inject(_aureliaTemplating.CompositionEngine)(TemplatingRouteLoader) || TemplatingRouteLoader;
    return TemplatingRouteLoader;
  })(_aureliaRouter.RouteLoader);

  exports.TemplatingRouteLoader = TemplatingRouteLoader;
});
define('aurelia-templating-router/router-view',['exports', 'aurelia-dependency-injection', 'aurelia-templating', 'aurelia-router', 'aurelia-metadata'], function (exports, _aureliaDependencyInjection, _aureliaTemplating, _aureliaRouter, _aureliaMetadata) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RouterView = (function () {
    function RouterView(element, container, viewSlot, router) {
      _classCallCheck(this, _RouterView);

      this.element = element;
      this.container = container;
      this.viewSlot = viewSlot;
      this.router = router;
      this.router.registerViewPort(this, this.element.getAttribute('name'));
    }

    var _RouterView = RouterView;

    _RouterView.prototype.bind = function bind(executionContext) {
      this.container.viewModel = executionContext;
    };

    _RouterView.prototype.process = function process(viewPortInstruction, waitToSwap) {
      var _this = this;

      var component = viewPortInstruction.component,
          viewStrategy = component.view,
          childContainer = component.childContainer,
          viewModel = component.executionContext,
          viewModelResource = component.viewModelResource,
          metadata = viewModelResource.metadata;

      if (!viewStrategy && 'getViewStrategy' in viewModel) {
        viewStrategy = viewModel.getViewStrategy();
      }

      if (viewStrategy) {
        viewStrategy = _aureliaTemplating.ViewStrategy.normalize(viewStrategy);
        viewStrategy.makeRelativeTo(_aureliaMetadata.Origin.get(component.router.container.viewModel.constructor).moduleId);
      }

      return metadata.load(childContainer, viewModelResource.value, viewStrategy, true).then(function (viewFactory) {
        viewPortInstruction.behavior = metadata.create(childContainer, {
          executionContext: viewModel,
          viewFactory: viewFactory,
          suppressBind: true
        });

        if (waitToSwap) {
          return;
        }

        _this.swap(viewPortInstruction);
      });
    };

    _RouterView.prototype.swap = function swap(viewPortInstruction) {
      viewPortInstruction.behavior.view.bind(viewPortInstruction.behavior.executionContext);
      this.viewSlot.swap(viewPortInstruction.behavior.view);

      if (this.view) {
        this.view.unbind();
      }

      this.view = viewPortInstruction.behavior.view;
    };

    RouterView = _aureliaDependencyInjection.inject(Element, _aureliaDependencyInjection.Container, _aureliaTemplating.ViewSlot, _aureliaRouter.Router)(RouterView) || RouterView;
    RouterView = _aureliaTemplating.noView(RouterView) || RouterView;
    RouterView = _aureliaTemplating.customElement('router-view')(RouterView) || RouterView;
    return RouterView;
  })();

  exports.RouterView = RouterView;
});
define('aurelia-templating-router/route-href',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-router'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaRouter) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RouteHref = (function () {
    function RouteHref(router, element) {
      _classCallCheck(this, _RouteHref);

      this.router = router;
      this.element = element;
    }

    var _RouteHref = RouteHref;

    _RouteHref.prototype.bind = function bind() {
      this.processChange();
    };

    _RouteHref.prototype.attributeChanged = function attributeChanged(value, previous) {
      if (previous) {
        this.element.removeAttribute(previous);
      }

      this.processChange();
    };

    _RouteHref.prototype.processChange = function processChange() {
      var href = this.router.generate(this.route, this.params);
      this.element.setAttribute(this.attribute, href);
    };

    RouteHref = _aureliaDependencyInjection.inject(_aureliaRouter.Router, Element)(RouteHref) || RouteHref;
    RouteHref = _aureliaTemplating.bindable({ name: 'attribute', defaultValue: 'href' })(RouteHref) || RouteHref;
    RouteHref = _aureliaTemplating.bindable({ name: 'params', changeHandler: 'processChange' })(RouteHref) || RouteHref;
    RouteHref = _aureliaTemplating.bindable({ name: 'route', changeHandler: 'processChange' })(RouteHref) || RouteHref;
    RouteHref = _aureliaTemplating.customAttribute('route-href')(RouteHref) || RouteHref;
    return RouteHref;
  })();

  exports.RouteHref = RouteHref;
});
define('aurelia-templating-router/index',['exports', 'aurelia-router', './route-loader', './router-view', './route-href'], function (exports, _aureliaRouter, _routeLoader, _routerView, _routeHref) {
  

  exports.__esModule = true;

  function configure(aurelia) {
    aurelia.withSingleton(_aureliaRouter.RouteLoader, _routeLoader.TemplatingRouteLoader).withSingleton(_aureliaRouter.Router, _aureliaRouter.AppRouter).globalizeResources('./router-view', './route-href');
  }

  exports.TemplatingRouteLoader = _routeLoader.TemplatingRouteLoader;
  exports.RouterView = _routerView.RouterView;
  exports.RouteHref = _routeHref.RouteHref;
  exports.configure = configure;
});
define('aurelia-templating-router', ['aurelia-templating-router/index'], function (main) { return main; });

define('aurelia-http-client/headers',['exports'], function (exports) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Headers = (function () {
    function Headers() {
      var headers = arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Headers);

      this.headers = headers;
    }

    Headers.prototype.add = function add(key, value) {
      this.headers[key] = value;
    };

    Headers.prototype.get = function get(key) {
      return this.headers[key];
    };

    Headers.prototype.clear = function clear() {
      this.headers = {};
    };

    Headers.prototype.configureXHR = function configureXHR(xhr) {
      var headers = this.headers,
          key;

      for (key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }
    };

    Headers.parse = function parse(headerStr) {
      var headers = new Headers();
      if (!headerStr) {
        return headers;
      }

      var headerPairs = headerStr.split('\r\n');
      for (var i = 0; i < headerPairs.length; i++) {
        var headerPair = headerPairs[i];

        var index = headerPair.indexOf(': ');
        if (index > 0) {
          var key = headerPair.substring(0, index);
          var val = headerPair.substring(index + 2);
          headers.add(key, val);
        }
      }

      return headers;
    };

    return Headers;
  })();

  exports.Headers = Headers;
});
define('aurelia-http-client/http-response-message',["exports", "./headers"], function (exports, _headers) {
  

  exports.__esModule = true;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var HttpResponseMessage = (function () {
    function HttpResponseMessage(requestMessage, xhr, responseType, reviver) {
      _classCallCheck(this, HttpResponseMessage);

      this.requestMessage = requestMessage;
      this.statusCode = xhr.status;
      this.response = xhr.response;
      this.isSuccess = xhr.status >= 200 && xhr.status < 400;
      this.statusText = xhr.statusText;
      this.reviver = reviver;
      this.mimeType = null;

      if (xhr.getAllResponseHeaders) {
        try {
          this.headers = _headers.Headers.parse(xhr.getAllResponseHeaders());
        } catch (err) {
          if (xhr.requestHeaders) this.headers = { headers: xhr.requestHeaders };
        }
      } else {
        this.headers = new _headers.Headers();
      }

      var contentType;
      if (this.headers && this.headers.headers) contentType = this.headers.headers["Content-Type"];
      if (contentType) {
        this.mimeType = responseType = contentType.split(";")[0].trim();
        if (mimeTypes.hasOwnProperty(this.mimeType)) responseType = mimeTypes[this.mimeType];
      }
      this.responseType = responseType;
    }

    _createClass(HttpResponseMessage, [{
      key: "content",
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
      }
    }]);

    return HttpResponseMessage;
  })();

  exports.HttpResponseMessage = HttpResponseMessage;
  var mimeTypes = {
    "text/html": "html",
    "text/javascript": "js",
    "application/javascript": "js",
    "text/json": "json",
    "application/json": "json",
    "application/rss+xml": "rss",
    "application/atom+xml": "atom",
    "application/xhtml+xml": "xhtml",
    "text/markdown": "md",
    "text/xml": "xml",
    "text/mathml": "mml",
    "application/xml": "xml",
    "text/yml": "yml",
    "text/csv": "csv",
    "text/css": "css",
    "text/less": "less",
    "text/stylus": "styl",
    "text/scss": "scss",
    "text/sass": "sass",
    "text/plain": "txt"
  };
  exports.mimeTypes = mimeTypes;
});
define('aurelia-http-client/request-message-processor',['exports', 'core-js', './http-response-message', 'aurelia-path'], function (exports, _coreJs, _httpResponseMessage, _aureliaPath) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  function buildFullUrl(message) {
    var url = _aureliaPath.join(message.baseUrl, message.url),
        qs;

    if (message.params) {
      qs = _aureliaPath.buildQueryString(message.params);
      url = qs ? '' + url + '?' + qs : url;
    }

    message.fullUrl = url;
  }

  var RequestMessageProcessor = (function () {
    function RequestMessageProcessor(xhrType, transformers) {
      _classCallCheck(this, RequestMessageProcessor);

      this.XHRType = xhrType;
      this.transformers = transformers;
    }

    RequestMessageProcessor.prototype.abort = function abort() {
      if (this.xhr) {
        this.xhr.abort();
      }
    };

    RequestMessageProcessor.prototype.process = function process(client, message) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var xhr = _this.xhr = new _this.XHRType(),
            transformers = _this.transformers,
            i,
            ii;

        buildFullUrl(message);
        xhr.open(message.method, message.fullUrl, true);

        for (i = 0, ii = transformers.length; i < ii; ++i) {
          transformers[i](client, _this, message, xhr);
        }

        xhr.onload = function (e) {
          var response = new _httpResponseMessage.HttpResponseMessage(message, xhr, message.responseType, message.reviver);
          if (response.isSuccess) {
            resolve(response);
          } else {
            reject(response);
          }
        };

        xhr.ontimeout = function (e) {
          reject(new _httpResponseMessage.HttpResponseMessage(message, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'timeout'));
        };

        xhr.onerror = function (e) {
          reject(new _httpResponseMessage.HttpResponseMessage(message, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'error'));
        };

        xhr.onabort = function (e) {
          reject(new _httpResponseMessage.HttpResponseMessage(message, {
            response: e,
            status: xhr.status,
            statusText: xhr.statusText
          }, 'abort'));
        };

        xhr.send(message.content);
      });
    };

    return RequestMessageProcessor;
  })();

  exports.RequestMessageProcessor = RequestMessageProcessor;
});
define('aurelia-http-client/transformers',['exports'], function (exports) {
  

  exports.__esModule = true;
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

    if (responseType === 'json') {
      responseType = 'text';
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

    if (typeof message.content === 'string') {
      return;
    }

    if (message.content === null || message.content === undefined) {
      return;
    }

    message.content = JSON.stringify(message.content, message.replacer);
  }
});
define('aurelia-http-client/http-request-message',['exports', './headers', './request-message-processor', './transformers'], function (exports, _headers, _requestMessageProcessor, _transformers) {
  

  exports.__esModule = true;
  exports.createHttpRequestMessageProcessor = createHttpRequestMessageProcessor;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var HttpRequestMessage = function HttpRequestMessage(method, url, content, headers) {
    _classCallCheck(this, HttpRequestMessage);

    this.method = method;
    this.url = url;
    this.content = content;
    this.headers = headers || new _headers.Headers();
    this.responseType = 'json';
  };

  exports.HttpRequestMessage = HttpRequestMessage;

  function createHttpRequestMessageProcessor() {
    return new _requestMessageProcessor.RequestMessageProcessor(XMLHttpRequest, [_transformers.timeoutTransformer, _transformers.credentialsTransformer, _transformers.progressTransformer, _transformers.responseTypeTransformer, _transformers.headerTransformer, _transformers.contentTransformer]);
  }
});
define('aurelia-http-client/jsonp-request-message',['exports', './headers', './request-message-processor', './transformers'], function (exports, _headers, _requestMessageProcessor, _transformers) {
  

  exports.__esModule = true;
  exports.createJSONPRequestMessageProcessor = createJSONPRequestMessageProcessor;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var JSONPRequestMessage = function JSONPRequestMessage(url, callbackParameterName) {
    _classCallCheck(this, JSONPRequestMessage);

    this.method = 'JSONP';
    this.url = url;
    this.content = undefined;
    this.headers = new _headers.Headers();
    this.responseType = 'jsonp';
    this.callbackParameterName = callbackParameterName;
  };

  exports.JSONPRequestMessage = JSONPRequestMessage;

  var JSONPXHR = (function () {
    function JSONPXHR() {
      _classCallCheck(this, JSONPXHR);
    }

    JSONPXHR.prototype.open = function open(method, url) {
      this.method = method;
      this.url = url;
      this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    };

    JSONPXHR.prototype.send = function send() {
      var _this = this;

      var url = this.url + (this.url.indexOf('?') >= 0 ? '&' : '?') + this.callbackParameterName + '=' + this.callbackName;

      window[this.callbackName] = function (data) {
        delete window[_this.callbackName];
        document.body.removeChild(script);

        if (_this.status === undefined) {
          _this.status = 200;
          _this.statusText = 'OK';
          _this.response = data;
          _this.onload(_this);
        }
      };

      var script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);

      if (this.timeout !== undefined) {
        setTimeout(function () {
          if (_this.status === undefined) {
            _this.status = 0;
            _this.ontimeout(new Error('timeout'));
          }
        }, this.timeout);
      }
    };

    JSONPXHR.prototype.abort = function abort() {
      if (this.status === undefined) {
        this.status = 0;
        this.onabort(new Error('abort'));
      }
    };

    JSONPXHR.prototype.setRequestHeader = function setRequestHeader() {};

    return JSONPXHR;
  })();

  function createJSONPRequestMessageProcessor() {
    return new _requestMessageProcessor.RequestMessageProcessor(JSONPXHR, [_transformers.timeoutTransformer, _transformers.callbackParameterNameTransformer]);
  }
});
define('aurelia-http-client/request-builder',['exports', 'aurelia-path', './http-request-message', './jsonp-request-message'], function (exports, _aureliaPath, _httpRequestMessage, _jsonpRequestMessage) {
  

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var RequestBuilder = (function () {
    function RequestBuilder(client) {
      _classCallCheck(this, RequestBuilder);

      this.client = client;
      this.transformers = client.requestTransformers.slice(0);
      this.useJsonp = false;
    }

    RequestBuilder.addHelper = function addHelper(name, fn) {
      RequestBuilder.prototype[name] = function () {
        this.transformers.push(fn.apply(this, arguments));
        return this;
      };
    };

    RequestBuilder.prototype.send = function send() {
      var message = this.useJsonp ? new _jsonpRequestMessage.JSONPRequestMessage() : new _httpRequestMessage.HttpRequestMessage();
      return this.client.send(message, this.transformers);
    };

    return RequestBuilder;
  })();

  exports.RequestBuilder = RequestBuilder;

  RequestBuilder.addHelper('asDelete', function () {
    return function (client, processor, message) {
      message.method = 'DELETE';
    };
  });

  RequestBuilder.addHelper('asGet', function () {
    return function (client, processor, message) {
      message.method = 'GET';
    };
  });

  RequestBuilder.addHelper('asHead', function () {
    return function (client, processor, message) {
      message.method = 'HEAD';
    };
  });

  RequestBuilder.addHelper('asOptions', function () {
    return function (client, processor, message) {
      message.method = 'OPTIONS';
    };
  });

  RequestBuilder.addHelper('asPatch', function () {
    return function (client, processor, message) {
      message.method = 'PATCH';
    };
  });

  RequestBuilder.addHelper('asPost', function () {
    return function (client, processor, message) {
      message.method = 'POST';
    };
  });

  RequestBuilder.addHelper('asPut', function () {
    return function (client, processor, message) {
      message.method = 'PUT';
    };
  });

  RequestBuilder.addHelper('asJsonp', function (callbackParameterName) {
    this.useJsonp = true;
    return function (client, processor, message) {
      message.callbackParameterName = callbackParameterName;
    };
  });

  RequestBuilder.addHelper('withUrl', function (url) {
    return function (client, processor, message) {
      message.url = url;
    };
  });

  RequestBuilder.addHelper('withContent', function (content) {
    return function (client, processor, message) {
      message.content = content;
    };
  });

  RequestBuilder.addHelper('withBaseUrl', function (baseUrl) {
    return function (client, processor, message) {
      message.baseUrl = baseUrl;
    };
  });

  RequestBuilder.addHelper('withParams', function (params) {
    return function (client, processor, message) {
      message.params = params;
    };
  });

  RequestBuilder.addHelper('withResponseType', function (responseType) {
    return function (client, processor, message) {
      message.responseType = responseType;
    };
  });

  RequestBuilder.addHelper('withTimeout', function (timeout) {
    return function (client, processor, message) {
      message.timeout = timeout;
    };
  });

  RequestBuilder.addHelper('withHeader', function (key, value) {
    return function (client, processor, message) {
      message.headers.add(key, value);
    };
  });

  RequestBuilder.addHelper('withCredentials', function (value) {
    return function (client, processor, message) {
      message.withCredentials = value;
    };
  });

  RequestBuilder.addHelper('withReviver', function (reviver) {
    return function (client, processor, message) {
      message.reviver = reviver;
    };
  });

  RequestBuilder.addHelper('withReplacer', function (replacer) {
    return function (client, processor, message) {
      message.replacer = replacer;
    };
  });

  RequestBuilder.addHelper('withProgressCallback', function (progressCallback) {
    return function (client, processor, message) {
      message.progressCallback = progressCallback;
    };
  });

  RequestBuilder.addHelper('withCallbackParameterName', function (callbackParameterName) {
    return function (client, processor, message) {
      message.callbackParameterName = callbackParameterName;
    };
  });
});
define('aurelia-http-client/http-client',['exports', 'core-js', './headers', './request-builder', './http-request-message', './jsonp-request-message'], function (exports, _coreJs, _headers, _requestBuilder, _httpRequestMessage, _jsonpRequestMessage) {
  

  exports.__esModule = true;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _core = _interopRequire(_coreJs);

  function trackRequestStart(client, processor) {
    client.pendingRequests.push(processor);
    client.isRequesting = true;
  }

  function trackRequestEnd(client, processor) {
    var index = client.pendingRequests.indexOf(processor);

    client.pendingRequests.splice(index, 1);
    client.isRequesting = client.pendingRequests.length > 0;

    if (!client.isRequesting) {
      var evt = new window.CustomEvent('aurelia-http-client-requests-drained', { bubbles: true, cancelable: true });
      setTimeout(function () {
        return document.dispatchEvent(evt);
      }, 1);
    }
  }

  var HttpClient = (function () {
    function HttpClient() {
      _classCallCheck(this, HttpClient);

      this.requestTransformers = [];
      this.requestProcessorFactories = new Map();
      this.requestProcessorFactories.set(_httpRequestMessage.HttpRequestMessage, _httpRequestMessage.createHttpRequestMessageProcessor);
      this.requestProcessorFactories.set(_jsonpRequestMessage.JSONPRequestMessage, _jsonpRequestMessage.createJSONPRequestMessageProcessor);
      this.pendingRequests = [];
      this.isRequesting = false;
    }

    HttpClient.prototype.configure = function configure(fn) {
      var builder = new _requestBuilder.RequestBuilder(this);
      fn(builder);
      this.requestTransformers = builder.transformers;
      return this;
    };

    HttpClient.prototype.createRequest = function createRequest(url) {
      var builder = new _requestBuilder.RequestBuilder(this);

      if (url) {
        builder.withUrl(url);
      }

      return builder;
    };

    HttpClient.prototype.send = function send(message, transformers) {
      var _this = this;

      var createProcessor = this.requestProcessorFactories.get(message.constructor),
          processor,
          promise,
          i,
          ii;

      if (!createProcessor) {
        throw new Error('No request message processor factory for ' + message.constructor + '.');
      }

      processor = createProcessor();
      trackRequestStart(this, processor);

      transformers = transformers || this.requestTransformers;

      for (i = 0, ii = transformers.length; i < ii; ++i) {
        transformers[i](this, processor, message);
      }

      promise = processor.process(this, message).then(function (response) {
        trackRequestEnd(_this, processor);
        return response;
      })['catch'](function (response) {
        trackRequestEnd(_this, processor);
        throw response;
      });

      promise.abort = promise.cancel = function () {
        processor.abort();
      };

      return promise;
    };

    HttpClient.prototype['delete'] = function _delete(url) {
      return this.createRequest(url).asDelete().send();
    };

    HttpClient.prototype.get = function get(url) {
      return this.createRequest(url).asGet().send();
    };

    HttpClient.prototype.head = function head(url) {
      return this.createRequest(url).asHead().send();
    };

    HttpClient.prototype.jsonp = function jsonp(url) {
      var callbackParameterName = arguments[1] === undefined ? 'jsoncallback' : arguments[1];

      return this.createRequest(url).asJsonp(callbackParameterName).send();
    };

    HttpClient.prototype.options = function options(url) {
      return this.createRequest(url).asOptions().send();
    };

    HttpClient.prototype.put = function put(url, content) {
      return this.createRequest(url).asPut().withContent(content).send();
    };

    HttpClient.prototype.patch = function patch(url, content) {
      return this.createRequest(url).asPatch().withContent(content).send();
    };

    HttpClient.prototype.post = function post(url, content) {
      return this.createRequest(url).asPost().withContent(content).send();
    };

    return HttpClient;
  })();

  exports.HttpClient = HttpClient;
});
define('aurelia-http-client/index',['exports', './http-client', './http-request-message', './http-response-message', './jsonp-request-message', './headers', './request-builder'], function (exports, _httpClient, _httpRequestMessage, _httpResponseMessage, _jsonpRequestMessage, _headers, _requestBuilder) {
  

  exports.__esModule = true;
  exports.HttpClient = _httpClient.HttpClient;
  exports.HttpRequestMessage = _httpRequestMessage.HttpRequestMessage;
  exports.HttpResponseMessage = _httpResponseMessage.HttpResponseMessage;
  exports.mimeTypes = _httpResponseMessage.mimeTypes;
  exports.JSONPRequestMessage = _jsonpRequestMessage.JSONPRequestMessage;
  exports.Headers = _headers.Headers;
  exports.RequestBuilder = _requestBuilder.RequestBuilder;
});
define('aurelia-http-client', ['aurelia-http-client/index'], function (main) { return main; });

define('aurelia-bootstrapper',['exports', 'core-js', 'aurelia-framework', 'aurelia-logging-console'], function (exports, _coreJs, _aureliaFramework, _aureliaLoggingConsole) {
  

  exports.__esModule = true;
  exports.bootstrap = bootstrap;

  function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

  var _core = _interopRequire(_coreJs);

  var logger = _aureliaFramework.LogManager.getLogger('bootstrapper');

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
      var loader = new window.AureliaLoader(),
          aurelia = new _aureliaFramework.Aurelia(loader);

      return configureAurelia(aurelia).then(function () {
        return configure(aurelia);
      });
    });
  }

  function ready(global) {
    return new Promise(function (resolve, reject) {
      if (global.document.readyState === 'complete') {
        resolve(global.document);
      } else {
        global.document.addEventListener('DOMContentLoaded', completed, false);
        global.addEventListener('load', completed, false);
      }

      function completed() {
        global.document.removeEventListener('DOMContentLoaded', completed, false);
        global.removeEventListener('load', completed, false);
        resolve(global.document);
      }
    });
  }

  function ensureLoader() {
    if (!window.AureliaLoader) {
      return System.normalize('aurelia-bootstrapper').then(function (bootstrapperName) {
        return System.normalize('aurelia-loader-default', bootstrapperName).then(function (loaderName) {
          return System['import'](loaderName);
        });
      });
    }

    return Promise.resolve();
  }

  function preparePlatform() {
    return System.normalize('aurelia-bootstrapper').then(function (bootstrapperName) {
      return System.normalize('aurelia-framework', bootstrapperName).then(function (frameworkName) {
        System.map['aurelia-framework'] = frameworkName;

        return System.normalize('aurelia-loader', frameworkName).then(function (loaderName) {
          var toLoad = [];

          if (!System.polyfilled) {
            logger.debug('loading core-js');
            toLoad.push(System.normalize('core-js', loaderName).then(function (name) {
              return System['import'](name);
            }));
          }

          toLoad.push(System.normalize('aurelia-dependency-injection', frameworkName).then(function (name) {
            System.map['aurelia-dependency-injection'] = name;
          }));

          toLoad.push(System.normalize('aurelia-router', bootstrapperName).then(function (name) {
            System.map['aurelia-router'] = name;
          }));

          toLoad.push(System.normalize('aurelia-logging-console', bootstrapperName).then(function (name) {
            System.map['aurelia-logging-console'] = name;
          }));

          if (!('import' in document.createElement('link'))) {
            logger.debug('loading the HTMLImports polyfill');
            toLoad.push(System.normalize('webcomponentsjs/HTMLImports.min', loaderName).then(function (name) {
              return System['import'](name);
            }));
          }

          if (!('content' in document.createElement('template'))) {
            logger.debug('loading the HTMLTemplateElement polyfill');
            toLoad.push(System.normalize('aurelia-html-template-element', loaderName).then(function (name) {
              return System['import'](name);
            }));
          }

          return Promise.all(toLoad);
        });
      });
    });
  }

  var installedDevelopmentLogging = false;

  function configureAurelia(aurelia) {
    return System.normalize('aurelia-bootstrapper').then(function (bName) {
      var toLoad = [];

      toLoad.push(System.normalize('aurelia-templating-binding', bName).then(function (templatingBinding) {
        aurelia.use.defaultBindingLanguage = function () {
          aurelia.use.plugin(templatingBinding);
          return this;
        };
      }));

      toLoad.push(System.normalize('aurelia-history-browser', bName).then(function (historyBrowser) {
        return System.normalize('aurelia-templating-router', bName).then(function (templatingRouter) {
          aurelia.use.router = function () {
            aurelia.use.plugin(historyBrowser);
            aurelia.use.plugin(templatingRouter);
            return this;
          };
        });
      }));

      toLoad.push(System.normalize('aurelia-templating-resources', bName).then(function (name) {
        System.map['aurelia-templating-resources'] = name;
        aurelia.use.defaultResources = function () {
          aurelia.use.plugin(name);
          return this;
        };
      }));

      toLoad.push(System.normalize('aurelia-event-aggregator', bName).then(function (eventAggregator) {
        System.map['aurelia-event-aggregator'] = eventAggregator;
        aurelia.use.eventAggregator = function () {
          aurelia.use.plugin(eventAggregator);
          return this;
        };
      }));

      aurelia.use.standardConfiguration = function () {
        aurelia.use.defaultBindingLanguage().defaultResources().router().eventAggregator();
        return this;
      };

      aurelia.use.developmentLogging = function () {
        if (!installedDevelopmentLogging) {
          installedDevelopmentLogging = true;
          _aureliaFramework.LogManager.addAppender(new _aureliaLoggingConsole.ConsoleAppender());
          _aureliaFramework.LogManager.setLevel(_aureliaFramework.LogManager.logLevel.debug);
        }
        return this;
      };

      return Promise.all(toLoad);
    });
  }

  function runningLocally() {
    return window.location.protocol !== 'http' && window.location.protocol !== 'https';
  }

  function handleApp(appHost) {
    var configModuleId = appHost.getAttribute('aurelia-app'),
        aurelia,
        loader;

    if (configModuleId) {
      loader = new window.AureliaLoader();

      return loader.loadModule(configModuleId).then(function (m) {
        aurelia = new _aureliaFramework.Aurelia(loader);
        aurelia.host = appHost;
        return configureAurelia(aurelia).then(function () {
          return m.configure(aurelia);
        });
      })['catch'](function (e) {
        setTimeout(function () {
          throw e;
        }, 0);
      });
    } else {
      aurelia = new _aureliaFramework.Aurelia();
      aurelia.host = appHost;

      return configureAurelia(aurelia).then(function () {
        if (runningLocally()) {
          aurelia.use.developmentLogging();
        }

        aurelia.use.standardConfiguration();

        return aurelia.start().then(function (a) {
          return a.setRoot();
        });
      })['catch'](function (e) {
        setTimeout(function () {
          throw e;
        }, 0);
      });
    }
  }

  function run() {
    return ready(window).then(function (doc) {
      var appHost = doc.querySelectorAll('[aurelia-app]');

      return ensureLoader().then(function () {
        return preparePlatform().then(function () {
          var i, ii;

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
    });
  }

  run();
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
  
  function extractTemplateFromSVGTemplate(el) {
    var template = el.ownerDocument.createElement('template');
    el.parentNode.insertBefore(template, el);

    var attribs = el.attributes;
    var count = attribs.length;
    while (count-- > 0) {
      var attrib = attribs[count];
      template.setAttribute(attrib.name, attrib.value);
      el.removeAttribute(attrib.name);
    }

    el.parentNode.removeChild(el);
    return template;
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

define("aurelia-bundle-manifest", [
  'aurelia-path',
  'aurelia-loader',
  'aurelia-loader-default',
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
  'aurelia-html-template-element',
  'core-js'
  ], function(_path,
  _loader,
  _loader_default,
  _task_queue,
  _logging,
  _logging_console,
  _history,
  _history_browser,
  _event_aggregator,
  _framework,
  _metadata,
  _binding,
  _templating,
  _dependency_injection,
  _router,
  _templating_binding,
  _templating_resources,
  _templating_router,
  _route_recognizer,
  _http_client,
  _bootstrapper,
  _html_template_element,
  _core_js
){
    // alert(_dependency_injection.inject)
  });

