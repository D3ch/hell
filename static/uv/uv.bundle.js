/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
    /* harmony import */ var parse5__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
    
    
    
    class HTML extends _events_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
        constructor(ctx) {
            super();
            this.ctx = ctx;
            this.rewriteUrl = ctx.rewriteUrl;
            this.sourceUrl = ctx.sourceUrl;
        };
        rewrite(str, options = {}) {
            if (!str) return str;
            return this.recast(str, node => {
                if (node.tagName) this.emit('element', node, 'rewrite');
                if (node.attr) this.emit('attr', node, 'rewrite');
                if (node.nodeName === '#text') this.emit('text', node, 'rewrite');
            }, options)
        };
        source(str, options = {}) {
            if (!str) return str;
            return this.recast(str, node => {
                if (node.tagName) this.emit('element', node, 'source');
                if (node.attr) this.emit('attr', node, 'source');
                if (node.nodeName === '#text') this.emit('text', node, 'source');
            }, options)
        };
        recast(str, fn, options = {}) {
            try {
                const ast = (options.document ? parse5__WEBPACK_IMPORTED_MODULE_1__.parse : parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(new String(str).toString());
                this.iterate(ast, fn, options);
                return (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serialize)(ast);
            } catch(e) {
                return str;
            };
        };
        iterate(ast, fn, fnOptions) {
            if (!ast) return ast;
        
            if (ast.tagName) {
                const element = new P5Element(ast, false, fnOptions);
                fn(element);
                if (ast.attrs) {
                    for (const attr of ast.attrs) {
                        if (!attr.skip) fn(new AttributeEvent(element, attr, fnOptions));
                    };
                };
            };
    
            if (ast.childNodes) {
                for (const child of ast.childNodes) {
                    if (!child.skip) this.iterate(child, fn, fnOptions);
                };
            };
    
            if (ast.nodeName === '#text') {
                fn(new TextEvent(ast, new P5Element(ast.parentNode), false, fnOptions));
            };
    
            return ast;
        };
        wrapSrcset(str, meta = this.ctx.meta) {
            return str.split(',').map(src => {
                const parts = src.trimStart().split(' ');
                if (parts[0]) parts[0] = this.ctx.rewriteUrl(parts[0], meta);
                return parts.join(' ');
            }).join(', ');
        };
        unwrapSrcset(str, meta = this.ctx.meta) {
            return str.split(',').map(src => {
                const parts = src.trimStart().split(' ');
                if (parts[0]) parts[0] = this.ctx.sourceUrl(parts[0], meta);
                return parts.join(' ');
            }).join(', ');
        };
        static parse = parse5__WEBPACK_IMPORTED_MODULE_1__.parse;
        static parseFragment = parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment;
        static serialize = parse5__WEBPACK_IMPORTED_MODULE_1__.serialize;  
    };
    
    class P5Element extends _events_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
        constructor(node, stream = false, options = {}) {
            super();
            this.stream = stream;
            this.node = node;
            this.options = options;
        };
        setAttribute(name, value) {
            for (const attr of this.attrs) {
                if (attr.name === name) {
                    attr.value = value;
                    return true;
                };
            };
    
            this.attrs.push(
                {
                    name,
                    value,
                }
            );
        };
        getAttribute(name) {
            const attr = this.attrs.find(attr => attr.name === name) || {};
            return attr.value;
        };
        hasAttribute(name) {
            return !!this.attrs.find(attr => attr.name === name);
        };
        removeAttribute(name) {
            const i = this.attrs.findIndex(attr => attr.name === name);
            if (typeof i !== 'undefined') this.attrs.splice(i, 1);
        };
        get tagName() {
            return this.node.tagName;
        };
        set tagName(val) {
            this.node.tagName = val;
        };
        get childNodes() {
            return !this.stream ? this.node.childNodes : null;
        };
        get innerHTML() {
            return !this.stream ? (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serialize)(
                {
                    nodeName: '#document-fragment',
                    childNodes: this.childNodes,
                }
            ) : null;
        };
        set innerHTML(val) {
            if (!this.stream) this.node.childNodes = (0,parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(val).childNodes;
        };
        get outerHTML() {
            return !this.stream ? (0,parse5__WEBPACK_IMPORTED_MODULE_1__.serialize)(
                {
                    nodeName: '#document-fragment',
                    childNodes: [ this ],
                }
            ) : null;
        };
        set outerHTML(val) {
            if (!this.stream) this.parentNode.childNodes.splice(this.parentNode.childNodes.findIndex(node => node === this.node), 1, ...(0,parse5__WEBPACK_IMPORTED_MODULE_1__.parseFragment)(val).childNodes);
        };
        get textContent() {
            if (this.stream) return null;
    
            let str = '';
            iterate(this.node, node => {
                if (node.nodeName === '#text') str += node.value;
            });
            
            return str;
        };
        set textContent(val) {
            if (!this.stream) this.node.childNodes = [ 
                { 
                    nodeName: '#text', 
                    value: val,
                    parentNode: this.node 
                }
            ];
        };
        get nodeName() {
            return this.node.nodeName;
        } 
        get parentNode() {
            return this.node.parentNode ? new P5Element(this.node.parentNode) : null;
        };
        get attrs() {
            return this.node.attrs;
        }
        get namespaceURI() {
            return this.node.namespaceURI;
        }
    };
    
    class AttributeEvent {
        constructor(node, attr, options = {}) {
            this.attr = attr;
            this.attrs = node.attrs;
            this.node = node;
            this.options = options;
        };
        delete() {
            const i = this.attrs.findIndex(attr => attr === this.attr);
    
            this.attrs.splice(i, 1);
    
            Object.defineProperty(this, 'deleted', {
                get: () => true,
            });
    
            return true;
        };
        get name() {
            return this.attr.name;
        };
    
        set name(val) {
            this.attr.name = val;
        };
        get value() {
            return this.attr.value;
        };
    
        set value(val) {
            this.attr.value = val;
        };
        get deleted() {
            return false;
        };
    };
    
    class TextEvent {
        constructor(node, element, stream = false, options = {}) {
            this.stream = stream;
            this.node = node;
            this.element = element;
            this.options = options;
        };
        get nodeName() {
            return this.node.nodeName;
        } 
        get parentNode() {
            return this.element;
        };
        get value() {
            return this.stream ? this.node.text : this.node.value;
        };
        set value(val) {
    
            if (this.stream) this.node.text = val;
            else this.node.value = val;
        };
    };
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTML);
    
    /***/ }),
    /* 2 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.
    
    
    
    var R = typeof Reflect === 'object' ? Reflect : null
    var ReflectApply = R && typeof R.apply === 'function'
      ? R.apply
      : function ReflectApply(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      }
    
    var ReflectOwnKeys
    if (R && typeof R.ownKeys === 'function') {
      ReflectOwnKeys = R.ownKeys
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target)
          .concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    
    var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
      return value !== value;
    }
    
    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventEmitter);
    
    // Backwards-compat with node 0.10.x
    EventEmitter.EventEmitter = EventEmitter;
    
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._eventsCount = 0;
    EventEmitter.prototype._maxListeners = undefined;
    
    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    var defaultMaxListeners = 10;
    
    function checkListener(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    
    Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
        }
        defaultMaxListeners = arg;
      }
    });
    
    EventEmitter.init = function() {
    
      if (this._events === undefined ||
          this._events === Object.getPrototypeOf(this)._events) {
        this._events = Object.create(null);
        this._eventsCount = 0;
      }
    
      this._maxListeners = this._maxListeners || undefined;
    };
    
    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
      }
      this._maxListeners = n;
      return this;
    };
    
    function _getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }
    
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    
    EventEmitter.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = (type === 'error');
    
      var events = this._events;
      if (events !== undefined)
        doError = (doError && events.error === undefined);
      else if (!doError)
        return false;
    
      // If there is no 'error' event listener then throw.
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          // Note: The comments on the `throw` lines are intentional, they show
          // up in Node's output if this results in an unhandled exception.
          throw er; // Unhandled 'error' event
        }
        // At least give some kind of context to the user
        var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
        err.context = er;
        throw err; // Unhandled 'error' event
      }
    
      var handler = events[type];
    
      if (handler === undefined)
        return false;
    
      if (typeof handler === 'function') {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
    
      return true;
    };
    
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
    
      checkListener(listener);
    
      events = target._events;
      if (events === undefined) {
        events = target._events = Object.create(null);
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener !== undefined) {
          target.emit('newListener', type,
                      listener.listener ? listener.listener : listener);
    
          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }
    
      if (existing === undefined) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] =
            prepend ? [listener, existing] : [existing, listener];
          // If we've already got an array, just append.
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
    
        // Check for listener leak
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          // No error code for this since it is a Warning
          // eslint-disable-next-line no-restricted-syntax
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + String(type) + ' listeners ' +
                              'added. Use emitter.setMaxListeners() to ' +
                              'increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
    
      return target;
    }
    
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    
    EventEmitter.prototype.prependListener =
        function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };
    
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    
    EventEmitter.prototype.once = function once(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    
    EventEmitter.prototype.prependOnceListener =
        function prependOnceListener(type, listener) {
          checkListener(listener);
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        };
    
    // Emits a 'removeListener' event if and only if the listener was removed.
    EventEmitter.prototype.removeListener =
        function removeListener(type, listener) {
          var list, events, position, i, originalListener;
    
          checkListener(listener);
    
          events = this._events;
          if (events === undefined)
            return this;
    
          list = events[type];
          if (list === undefined)
            return this;
    
          if (list === listener || list.listener === listener) {
            if (--this._eventsCount === 0)
              this._events = Object.create(null);
            else {
              delete events[type];
              if (events.removeListener)
                this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;
    
            for (i = list.length - 1; i >= 0; i--) {
              if (list[i] === listener || list[i].listener === listener) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }
    
            if (position < 0)
              return this;
    
            if (position === 0)
              list.shift();
            else {
              spliceOne(list, position);
            }
    
            if (list.length === 1)
              events[type] = list[0];
    
            if (events.removeListener !== undefined)
              this.emit('removeListener', type, originalListener || listener);
          }
    
          return this;
        };
    
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    
    EventEmitter.prototype.removeAllListeners =
        function removeAllListeners(type) {
          var listeners, events, i;
    
          events = this._events;
          if (events === undefined)
            return this;
    
          // not listening for removeListener, no need to emit
          if (events.removeListener === undefined) {
            if (arguments.length === 0) {
              this._events = Object.create(null);
              this._eventsCount = 0;
            } else if (events[type] !== undefined) {
              if (--this._eventsCount === 0)
                this._events = Object.create(null);
              else
                delete events[type];
            }
            return this;
          }
    
          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            var keys = Object.keys(events);
            var key;
            for (i = 0; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = Object.create(null);
            this._eventsCount = 0;
            return this;
          }
    
          listeners = events[type];
    
          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners !== undefined) {
            // LIFO order
            for (i = listeners.length - 1; i >= 0; i--) {
              this.removeListener(type, listeners[i]);
            }
          }
    
          return this;
        };
    
    function _listeners(target, type, unwrap) {
      var events = target._events;
    
      if (events === undefined)
        return [];
    
      var evlistener = events[type];
      if (evlistener === undefined)
        return [];
    
      if (typeof evlistener === 'function')
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
    
      return unwrap ?
        unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    
    EventEmitter.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    
    EventEmitter.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    
    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
    
      if (events !== undefined) {
        var evlistener = events[type];
    
        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener !== undefined) {
          return evlistener.length;
        }
      }
    
      return 0;
    }
    
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    
    function once(emitter, name) {
      return new Promise(function (resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
    
        function resolver() {
          if (typeof emitter.removeListener === 'function') {
            emitter.removeListener('error', errorListener);
          }
          resolve([].slice.call(arguments));
        };
    
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== 'error') {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === 'function') {
        eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
      }
    }
    
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === 'function') {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === 'function') {
        // EventTarget does not have `error` event semantics like Node
        // EventEmitters, we do not listen for `error` events here.
        emitter.addEventListener(name, function wrapListener(arg) {
          // IE does not have builtin `{ once: true }` support so we
          // have to do it manually.
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
    
    /***/ }),
    /* 3 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Parser = __webpack_require__(4);
    const Serializer = __webpack_require__(26);
    
    // Shorthands
    exports.parse = function parse(html, options) {
        const parser = new Parser(options);
    
        return parser.parse(html);
    };
    
    exports.parseFragment = function parseFragment(fragmentContext, html, options) {
        if (typeof fragmentContext === 'string') {
            options = html;
            html = fragmentContext;
            fragmentContext = null;
        }
    
        const parser = new Parser(options);
    
        return parser.parseFragment(html, fragmentContext);
    };
    
    exports.serialize = function(node, options) {
        const serializer = new Serializer(node, options);
    
        return serializer.serialize();
    };
    
    
    /***/ }),
    /* 4 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Tokenizer = __webpack_require__(5);
    const OpenElementStack = __webpack_require__(10);
    const FormattingElementList = __webpack_require__(12);
    const LocationInfoParserMixin = __webpack_require__(13);
    const ErrorReportingParserMixin = __webpack_require__(18);
    const Mixin = __webpack_require__(14);
    const defaultTreeAdapter = __webpack_require__(22);
    const mergeOptions = __webpack_require__(23);
    const doctype = __webpack_require__(24);
    const foreignContent = __webpack_require__(25);
    const ERR = __webpack_require__(8);
    const unicode = __webpack_require__(7);
    const HTML = __webpack_require__(11);
    
    //Aliases
    const $ = HTML.TAG_NAMES;
    const NS = HTML.NAMESPACES;
    const ATTRS = HTML.ATTRS;
    
    const DEFAULT_OPTIONS = {
        scriptingEnabled: true,
        sourceCodeLocationInfo: false,
        onParseError: null,
        treeAdapter: defaultTreeAdapter
    };
    
    //Misc constants
    const HIDDEN_INPUT_TYPE = 'hidden';
    
    //Adoption agency loops iteration count
    const AA_OUTER_LOOP_ITER = 8;
    const AA_INNER_LOOP_ITER = 3;
    
    //Insertion modes
    const INITIAL_MODE = 'INITIAL_MODE';
    const BEFORE_HTML_MODE = 'BEFORE_HTML_MODE';
    const BEFORE_HEAD_MODE = 'BEFORE_HEAD_MODE';
    const IN_HEAD_MODE = 'IN_HEAD_MODE';
    const IN_HEAD_NO_SCRIPT_MODE = 'IN_HEAD_NO_SCRIPT_MODE';
    const AFTER_HEAD_MODE = 'AFTER_HEAD_MODE';
    const IN_BODY_MODE = 'IN_BODY_MODE';
    const TEXT_MODE = 'TEXT_MODE';
    const IN_TABLE_MODE = 'IN_TABLE_MODE';
    const IN_TABLE_TEXT_MODE = 'IN_TABLE_TEXT_MODE';
    const IN_CAPTION_MODE = 'IN_CAPTION_MODE';
    const IN_COLUMN_GROUP_MODE = 'IN_COLUMN_GROUP_MODE';
    const IN_TABLE_BODY_MODE = 'IN_TABLE_BODY_MODE';
    const IN_ROW_MODE = 'IN_ROW_MODE';
    const IN_CELL_MODE = 'IN_CELL_MODE';
    const IN_SELECT_MODE = 'IN_SELECT_MODE';
    const IN_SELECT_IN_TABLE_MODE = 'IN_SELECT_IN_TABLE_MODE';
    const IN_TEMPLATE_MODE = 'IN_TEMPLATE_MODE';
    const AFTER_BODY_MODE = 'AFTER_BODY_MODE';
    const IN_FRAMESET_MODE = 'IN_FRAMESET_MODE';
    const AFTER_FRAMESET_MODE = 'AFTER_FRAMESET_MODE';
    const AFTER_AFTER_BODY_MODE = 'AFTER_AFTER_BODY_MODE';
    const AFTER_AFTER_FRAMESET_MODE = 'AFTER_AFTER_FRAMESET_MODE';
    
    //Insertion mode reset map
    const INSERTION_MODE_RESET_MAP = {
        [$.TR]: IN_ROW_MODE,
        [$.TBODY]: IN_TABLE_BODY_MODE,
        [$.THEAD]: IN_TABLE_BODY_MODE,
        [$.TFOOT]: IN_TABLE_BODY_MODE,
        [$.CAPTION]: IN_CAPTION_MODE,
        [$.COLGROUP]: IN_COLUMN_GROUP_MODE,
        [$.TABLE]: IN_TABLE_MODE,
        [$.BODY]: IN_BODY_MODE,
        [$.FRAMESET]: IN_FRAMESET_MODE
    };
    
    //Template insertion mode switch map
    const TEMPLATE_INSERTION_MODE_SWITCH_MAP = {
        [$.CAPTION]: IN_TABLE_MODE,
        [$.COLGROUP]: IN_TABLE_MODE,
        [$.TBODY]: IN_TABLE_MODE,
        [$.TFOOT]: IN_TABLE_MODE,
        [$.THEAD]: IN_TABLE_MODE,
        [$.COL]: IN_COLUMN_GROUP_MODE,
        [$.TR]: IN_TABLE_BODY_MODE,
        [$.TD]: IN_ROW_MODE,
        [$.TH]: IN_ROW_MODE
    };
    
    //Token handlers map for insertion modes
    const TOKEN_HANDLERS = {
        [INITIAL_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInInitialMode,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInInitialMode,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: doctypeInInitialMode,
            [Tokenizer.START_TAG_TOKEN]: tokenInInitialMode,
            [Tokenizer.END_TAG_TOKEN]: tokenInInitialMode,
            [Tokenizer.EOF_TOKEN]: tokenInInitialMode
        },
        [BEFORE_HTML_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenBeforeHtml,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenBeforeHtml,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagBeforeHtml,
            [Tokenizer.END_TAG_TOKEN]: endTagBeforeHtml,
            [Tokenizer.EOF_TOKEN]: tokenBeforeHtml
        },
        [BEFORE_HEAD_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenBeforeHead,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenBeforeHead,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagBeforeHead,
            [Tokenizer.END_TAG_TOKEN]: endTagBeforeHead,
            [Tokenizer.EOF_TOKEN]: tokenBeforeHead
        },
        [IN_HEAD_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInHead,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInHead,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagInHead,
            [Tokenizer.END_TAG_TOKEN]: endTagInHead,
            [Tokenizer.EOF_TOKEN]: tokenInHead
        },
        [IN_HEAD_NO_SCRIPT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInHeadNoScript,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInHeadNoScript,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagInHeadNoScript,
            [Tokenizer.END_TAG_TOKEN]: endTagInHeadNoScript,
            [Tokenizer.EOF_TOKEN]: tokenInHeadNoScript
        },
        [AFTER_HEAD_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenAfterHead,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenAfterHead,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: misplacedDoctype,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterHead,
            [Tokenizer.END_TAG_TOKEN]: endTagAfterHead,
            [Tokenizer.EOF_TOKEN]: tokenAfterHead
        },
        [IN_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInBody,
            [Tokenizer.END_TAG_TOKEN]: endTagInBody,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [TEXT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.NULL_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: ignoreToken,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: ignoreToken,
            [Tokenizer.END_TAG_TOKEN]: endTagInText,
            [Tokenizer.EOF_TOKEN]: eofInText
        },
        [IN_TABLE_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.NULL_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInTable,
            [Tokenizer.END_TAG_TOKEN]: endTagInTable,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_TABLE_TEXT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTableText,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInTableText,
            [Tokenizer.COMMENT_TOKEN]: tokenInTableText,
            [Tokenizer.DOCTYPE_TOKEN]: tokenInTableText,
            [Tokenizer.START_TAG_TOKEN]: tokenInTableText,
            [Tokenizer.END_TAG_TOKEN]: tokenInTableText,
            [Tokenizer.EOF_TOKEN]: tokenInTableText
        },
        [IN_CAPTION_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInCaption,
            [Tokenizer.END_TAG_TOKEN]: endTagInCaption,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_COLUMN_GROUP_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenInColumnGroup,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenInColumnGroup,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInColumnGroup,
            [Tokenizer.END_TAG_TOKEN]: endTagInColumnGroup,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_TABLE_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.NULL_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInTableBody,
            [Tokenizer.END_TAG_TOKEN]: endTagInTableBody,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_ROW_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.NULL_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: characterInTable,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInRow,
            [Tokenizer.END_TAG_TOKEN]: endTagInRow,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_CELL_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInCell,
            [Tokenizer.END_TAG_TOKEN]: endTagInCell,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_SELECT_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInSelect,
            [Tokenizer.END_TAG_TOKEN]: endTagInSelect,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_SELECT_IN_TABLE_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInSelectInTable,
            [Tokenizer.END_TAG_TOKEN]: endTagInSelectInTable,
            [Tokenizer.EOF_TOKEN]: eofInBody
        },
        [IN_TEMPLATE_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: characterInBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInTemplate,
            [Tokenizer.END_TAG_TOKEN]: endTagInTemplate,
            [Tokenizer.EOF_TOKEN]: eofInTemplate
        },
        [AFTER_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenAfterBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenAfterBody,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendCommentToRootHtmlElement,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterBody,
            [Tokenizer.END_TAG_TOKEN]: endTagAfterBody,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [IN_FRAMESET_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagInFrameset,
            [Tokenizer.END_TAG_TOKEN]: endTagInFrameset,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [AFTER_FRAMESET_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: insertCharacters,
            [Tokenizer.COMMENT_TOKEN]: appendComment,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterFrameset,
            [Tokenizer.END_TAG_TOKEN]: endTagAfterFrameset,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [AFTER_AFTER_BODY_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: tokenAfterAfterBody,
            [Tokenizer.NULL_CHARACTER_TOKEN]: tokenAfterAfterBody,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendCommentToDocument,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterAfterBody,
            [Tokenizer.END_TAG_TOKEN]: tokenAfterAfterBody,
            [Tokenizer.EOF_TOKEN]: stopParsing
        },
        [AFTER_AFTER_FRAMESET_MODE]: {
            [Tokenizer.CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.NULL_CHARACTER_TOKEN]: ignoreToken,
            [Tokenizer.WHITESPACE_CHARACTER_TOKEN]: whitespaceCharacterInBody,
            [Tokenizer.COMMENT_TOKEN]: appendCommentToDocument,
            [Tokenizer.DOCTYPE_TOKEN]: ignoreToken,
            [Tokenizer.START_TAG_TOKEN]: startTagAfterAfterFrameset,
            [Tokenizer.END_TAG_TOKEN]: ignoreToken,
            [Tokenizer.EOF_TOKEN]: stopParsing
        }
    };
    
    //Parser
    class Parser {
        constructor(options) {
            this.options = mergeOptions(DEFAULT_OPTIONS, options);
    
            this.treeAdapter = this.options.treeAdapter;
            this.pendingScript = null;
    
            if (this.options.sourceCodeLocationInfo) {
                Mixin.install(this, LocationInfoParserMixin);
            }
    
            if (this.options.onParseError) {
                Mixin.install(this, ErrorReportingParserMixin, { onParseError: this.options.onParseError });
            }
        }
    
        // API
        parse(html) {
            const document = this.treeAdapter.createDocument();
    
            this._bootstrap(document, null);
            this.tokenizer.write(html, true);
            this._runParsingLoop(null);
    
            return document;
        }
    
        parseFragment(html, fragmentContext) {
            //NOTE: use <template> element as a fragment context if context element was not provided,
            //so we will parse in "forgiving" manner
            if (!fragmentContext) {
                fragmentContext = this.treeAdapter.createElement($.TEMPLATE, NS.HTML, []);
            }
    
            //NOTE: create fake element which will be used as 'document' for fragment parsing.
            //This is important for jsdom there 'document' can't be recreated, therefore
            //fragment parsing causes messing of the main `document`.
            const documentMock = this.treeAdapter.createElement('documentmock', NS.HTML, []);
    
            this._bootstrap(documentMock, fragmentContext);
    
            if (this.treeAdapter.getTagName(fragmentContext) === $.TEMPLATE) {
                this._pushTmplInsertionMode(IN_TEMPLATE_MODE);
            }
    
            this._initTokenizerForFragmentParsing();
            this._insertFakeRootElement();
            this._resetInsertionMode();
            this._findFormInFragmentContext();
            this.tokenizer.write(html, true);
            this._runParsingLoop(null);
    
            const rootElement = this.treeAdapter.getFirstChild(documentMock);
            const fragment = this.treeAdapter.createDocumentFragment();
    
            this._adoptNodes(rootElement, fragment);
    
            return fragment;
        }
    
        //Bootstrap parser
        _bootstrap(document, fragmentContext) {
            this.tokenizer = new Tokenizer(this.options);
    
            this.stopped = false;
    
            this.insertionMode = INITIAL_MODE;
            this.originalInsertionMode = '';
    
            this.document = document;
            this.fragmentContext = fragmentContext;
    
            this.headElement = null;
            this.formElement = null;
    
            this.openElements = new OpenElementStack(this.document, this.treeAdapter);
            this.activeFormattingElements = new FormattingElementList(this.treeAdapter);
    
            this.tmplInsertionModeStack = [];
            this.tmplInsertionModeStackTop = -1;
            this.currentTmplInsertionMode = null;
    
            this.pendingCharacterTokens = [];
            this.hasNonWhitespacePendingCharacterToken = false;
    
            this.framesetOk = true;
            this.skipNextNewLine = false;
            this.fosterParentingEnabled = false;
        }
    
        //Errors
        _err() {
            // NOTE: err reporting is noop by default. Enabled by mixin.
        }
    
        //Parsing loop
        _runParsingLoop(scriptHandler) {
            while (!this.stopped) {
                this._setupTokenizerCDATAMode();
    
                const token = this.tokenizer.getNextToken();
    
                if (token.type === Tokenizer.HIBERNATION_TOKEN) {
                    break;
                }
    
                if (this.skipNextNewLine) {
                    this.skipNextNewLine = false;
    
                    if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN && token.chars[0] === '\n') {
                        if (token.chars.length === 1) {
                            continue;
                        }
    
                        token.chars = token.chars.substr(1);
                    }
                }
    
                this._processInputToken(token);
    
                if (scriptHandler && this.pendingScript) {
                    break;
                }
            }
        }
    
        runParsingLoopForCurrentChunk(writeCallback, scriptHandler) {
            this._runParsingLoop(scriptHandler);
    
            if (scriptHandler && this.pendingScript) {
                const script = this.pendingScript;
    
                this.pendingScript = null;
    
                scriptHandler(script);
    
                return;
            }
    
            if (writeCallback) {
                writeCallback();
            }
        }
    
        //Text parsing
        _setupTokenizerCDATAMode() {
            const current = this._getAdjustedCurrentElement();
    
            this.tokenizer.allowCDATA =
                current &&
                current !== this.document &&
                this.treeAdapter.getNamespaceURI(current) !== NS.HTML &&
                !this._isIntegrationPoint(current);
        }
    
        _switchToTextParsing(currentToken, nextTokenizerState) {
            this._insertElement(currentToken, NS.HTML);
            this.tokenizer.state = nextTokenizerState;
            this.originalInsertionMode = this.insertionMode;
            this.insertionMode = TEXT_MODE;
        }
    
        switchToPlaintextParsing() {
            this.insertionMode = TEXT_MODE;
            this.originalInsertionMode = IN_BODY_MODE;
            this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
        }
    
        //Fragment parsing
        _getAdjustedCurrentElement() {
            return this.openElements.stackTop === 0 && this.fragmentContext
                ? this.fragmentContext
                : this.openElements.current;
        }
    
        _findFormInFragmentContext() {
            let node = this.fragmentContext;
    
            do {
                if (this.treeAdapter.getTagName(node) === $.FORM) {
                    this.formElement = node;
                    break;
                }
    
                node = this.treeAdapter.getParentNode(node);
            } while (node);
        }
    
        _initTokenizerForFragmentParsing() {
            if (this.treeAdapter.getNamespaceURI(this.fragmentContext) === NS.HTML) {
                const tn = this.treeAdapter.getTagName(this.fragmentContext);
    
                if (tn === $.TITLE || tn === $.TEXTAREA) {
                    this.tokenizer.state = Tokenizer.MODE.RCDATA;
                } else if (
                    tn === $.STYLE ||
                    tn === $.XMP ||
                    tn === $.IFRAME ||
                    tn === $.NOEMBED ||
                    tn === $.NOFRAMES ||
                    tn === $.NOSCRIPT
                ) {
                    this.tokenizer.state = Tokenizer.MODE.RAWTEXT;
                } else if (tn === $.SCRIPT) {
                    this.tokenizer.state = Tokenizer.MODE.SCRIPT_DATA;
                } else if (tn === $.PLAINTEXT) {
                    this.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
                }
            }
        }
    
        //Tree mutation
        _setDocumentType(token) {
            const name = token.name || '';
            const publicId = token.publicId || '';
            const systemId = token.systemId || '';
    
            this.treeAdapter.setDocumentType(this.document, name, publicId, systemId);
        }
    
        _attachElementToTree(element) {
            if (this._shouldFosterParentOnInsertion()) {
                this._fosterParentElement(element);
            } else {
                const parent = this.openElements.currentTmplContent || this.openElements.current;
    
                this.treeAdapter.appendChild(parent, element);
            }
        }
    
        _appendElement(token, namespaceURI) {
            const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
    
            this._attachElementToTree(element);
        }
    
        _insertElement(token, namespaceURI) {
            const element = this.treeAdapter.createElement(token.tagName, namespaceURI, token.attrs);
    
            this._attachElementToTree(element);
            this.openElements.push(element);
        }
    
        _insertFakeElement(tagName) {
            const element = this.treeAdapter.createElement(tagName, NS.HTML, []);
    
            this._attachElementToTree(element);
            this.openElements.push(element);
        }
    
        _insertTemplate(token) {
            const tmpl = this.treeAdapter.createElement(token.tagName, NS.HTML, token.attrs);
            const content = this.treeAdapter.createDocumentFragment();
    
            this.treeAdapter.setTemplateContent(tmpl, content);
            this._attachElementToTree(tmpl);
            this.openElements.push(tmpl);
        }
    
        _insertFakeRootElement() {
            const element = this.treeAdapter.createElement($.HTML, NS.HTML, []);
    
            this.treeAdapter.appendChild(this.openElements.current, element);
            this.openElements.push(element);
        }
    
        _appendCommentNode(token, parent) {
            const commentNode = this.treeAdapter.createCommentNode(token.data);
    
            this.treeAdapter.appendChild(parent, commentNode);
        }
    
        _insertCharacters(token) {
            if (this._shouldFosterParentOnInsertion()) {
                this._fosterParentText(token.chars);
            } else {
                const parent = this.openElements.currentTmplContent || this.openElements.current;
    
                this.treeAdapter.insertText(parent, token.chars);
            }
        }
    
        _adoptNodes(donor, recipient) {
            for (let child = this.treeAdapter.getFirstChild(donor); child; child = this.treeAdapter.getFirstChild(donor)) {
                this.treeAdapter.detachNode(child);
                this.treeAdapter.appendChild(recipient, child);
            }
        }
    
        //Token processing
        _shouldProcessTokenInForeignContent(token) {
            const current = this._getAdjustedCurrentElement();
    
            if (!current || current === this.document) {
                return false;
            }
    
            const ns = this.treeAdapter.getNamespaceURI(current);
    
            if (ns === NS.HTML) {
                return false;
            }
    
            if (
                this.treeAdapter.getTagName(current) === $.ANNOTATION_XML &&
                ns === NS.MATHML &&
                token.type === Tokenizer.START_TAG_TOKEN &&
                token.tagName === $.SVG
            ) {
                return false;
            }
    
            const isCharacterToken =
                token.type === Tokenizer.CHARACTER_TOKEN ||
                token.type === Tokenizer.NULL_CHARACTER_TOKEN ||
                token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN;
    
            const isMathMLTextStartTag =
                token.type === Tokenizer.START_TAG_TOKEN && token.tagName !== $.MGLYPH && token.tagName !== $.MALIGNMARK;
    
            if ((isMathMLTextStartTag || isCharacterToken) && this._isIntegrationPoint(current, NS.MATHML)) {
                return false;
            }
    
            if (
                (token.type === Tokenizer.START_TAG_TOKEN || isCharacterToken) &&
                this._isIntegrationPoint(current, NS.HTML)
            ) {
                return false;
            }
    
            return token.type !== Tokenizer.EOF_TOKEN;
        }
    
        _processToken(token) {
            TOKEN_HANDLERS[this.insertionMode][token.type](this, token);
        }
    
        _processTokenInBodyMode(token) {
            TOKEN_HANDLERS[IN_BODY_MODE][token.type](this, token);
        }
    
        _processTokenInForeignContent(token) {
            if (token.type === Tokenizer.CHARACTER_TOKEN) {
                characterInForeignContent(this, token);
            } else if (token.type === Tokenizer.NULL_CHARACTER_TOKEN) {
                nullCharacterInForeignContent(this, token);
            } else if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN) {
                insertCharacters(this, token);
            } else if (token.type === Tokenizer.COMMENT_TOKEN) {
                appendComment(this, token);
            } else if (token.type === Tokenizer.START_TAG_TOKEN) {
                startTagInForeignContent(this, token);
            } else if (token.type === Tokenizer.END_TAG_TOKEN) {
                endTagInForeignContent(this, token);
            }
        }
    
        _processInputToken(token) {
            if (this._shouldProcessTokenInForeignContent(token)) {
                this._processTokenInForeignContent(token);
            } else {
                this._processToken(token);
            }
    
            if (token.type === Tokenizer.START_TAG_TOKEN && token.selfClosing && !token.ackSelfClosing) {
                this._err(ERR.nonVoidHtmlElementStartTagWithTrailingSolidus);
            }
        }
    
        //Integration points
        _isIntegrationPoint(element, foreignNS) {
            const tn = this.treeAdapter.getTagName(element);
            const ns = this.treeAdapter.getNamespaceURI(element);
            const attrs = this.treeAdapter.getAttrList(element);
    
            return foreignContent.isIntegrationPoint(tn, ns, attrs, foreignNS);
        }
    
        //Active formatting elements reconstruction
        _reconstructActiveFormattingElements() {
            const listLength = this.activeFormattingElements.length;
    
            if (listLength) {
                let unopenIdx = listLength;
                let entry = null;
    
                do {
                    unopenIdx--;
                    entry = this.activeFormattingElements.entries[unopenIdx];
    
                    if (entry.type === FormattingElementList.MARKER_ENTRY || this.openElements.contains(entry.element)) {
                        unopenIdx++;
                        break;
                    }
                } while (unopenIdx > 0);
    
                for (let i = unopenIdx; i < listLength; i++) {
                    entry = this.activeFormattingElements.entries[i];
                    this._insertElement(entry.token, this.treeAdapter.getNamespaceURI(entry.element));
                    entry.element = this.openElements.current;
                }
            }
        }
    
        //Close elements
        _closeTableCell() {
            this.openElements.generateImpliedEndTags();
            this.openElements.popUntilTableCellPopped();
            this.activeFormattingElements.clearToLastMarker();
            this.insertionMode = IN_ROW_MODE;
        }
    
        _closePElement() {
            this.openElements.generateImpliedEndTagsWithExclusion($.P);
            this.openElements.popUntilTagNamePopped($.P);
        }
    
        //Insertion modes
        _resetInsertionMode() {
            for (let i = this.openElements.stackTop, last = false; i >= 0; i--) {
                let element = this.openElements.items[i];
    
                if (i === 0) {
                    last = true;
    
                    if (this.fragmentContext) {
                        element = this.fragmentContext;
                    }
                }
    
                const tn = this.treeAdapter.getTagName(element);
                const newInsertionMode = INSERTION_MODE_RESET_MAP[tn];
    
                if (newInsertionMode) {
                    this.insertionMode = newInsertionMode;
                    break;
                } else if (!last && (tn === $.TD || tn === $.TH)) {
                    this.insertionMode = IN_CELL_MODE;
                    break;
                } else if (!last && tn === $.HEAD) {
                    this.insertionMode = IN_HEAD_MODE;
                    break;
                } else if (tn === $.SELECT) {
                    this._resetInsertionModeForSelect(i);
                    break;
                } else if (tn === $.TEMPLATE) {
                    this.insertionMode = this.currentTmplInsertionMode;
                    break;
                } else if (tn === $.HTML) {
                    this.insertionMode = this.headElement ? AFTER_HEAD_MODE : BEFORE_HEAD_MODE;
                    break;
                } else if (last) {
                    this.insertionMode = IN_BODY_MODE;
                    break;
                }
            }
        }
    
        _resetInsertionModeForSelect(selectIdx) {
            if (selectIdx > 0) {
                for (let i = selectIdx - 1; i > 0; i--) {
                    const ancestor = this.openElements.items[i];
                    const tn = this.treeAdapter.getTagName(ancestor);
    
                    if (tn === $.TEMPLATE) {
                        break;
                    } else if (tn === $.TABLE) {
                        this.insertionMode = IN_SELECT_IN_TABLE_MODE;
                        return;
                    }
                }
            }
    
            this.insertionMode = IN_SELECT_MODE;
        }
    
        _pushTmplInsertionMode(mode) {
            this.tmplInsertionModeStack.push(mode);
            this.tmplInsertionModeStackTop++;
            this.currentTmplInsertionMode = mode;
        }
    
        _popTmplInsertionMode() {
            this.tmplInsertionModeStack.pop();
            this.tmplInsertionModeStackTop--;
            this.currentTmplInsertionMode = this.tmplInsertionModeStack[this.tmplInsertionModeStackTop];
        }
    
        //Foster parenting
        _isElementCausesFosterParenting(element) {
            const tn = this.treeAdapter.getTagName(element);
    
            return tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD || tn === $.TR;
        }
    
        _shouldFosterParentOnInsertion() {
            return this.fosterParentingEnabled && this._isElementCausesFosterParenting(this.openElements.current);
        }
    
        _findFosterParentingLocation() {
            const location = {
                parent: null,
                beforeElement: null
            };
    
            for (let i = this.openElements.stackTop; i >= 0; i--) {
                const openElement = this.openElements.items[i];
                const tn = this.treeAdapter.getTagName(openElement);
                const ns = this.treeAdapter.getNamespaceURI(openElement);
    
                if (tn === $.TEMPLATE && ns === NS.HTML) {
                    location.parent = this.treeAdapter.getTemplateContent(openElement);
                    break;
                } else if (tn === $.TABLE) {
                    location.parent = this.treeAdapter.getParentNode(openElement);
    
                    if (location.parent) {
                        location.beforeElement = openElement;
                    } else {
                        location.parent = this.openElements.items[i - 1];
                    }
    
                    break;
                }
            }
    
            if (!location.parent) {
                location.parent = this.openElements.items[0];
            }
    
            return location;
        }
    
        _fosterParentElement(element) {
            const location = this._findFosterParentingLocation();
    
            if (location.beforeElement) {
                this.treeAdapter.insertBefore(location.parent, element, location.beforeElement);
            } else {
                this.treeAdapter.appendChild(location.parent, element);
            }
        }
    
        _fosterParentText(chars) {
            const location = this._findFosterParentingLocation();
    
            if (location.beforeElement) {
                this.treeAdapter.insertTextBefore(location.parent, chars, location.beforeElement);
            } else {
                this.treeAdapter.insertText(location.parent, chars);
            }
        }
    
        //Special elements
        _isSpecialElement(element) {
            const tn = this.treeAdapter.getTagName(element);
            const ns = this.treeAdapter.getNamespaceURI(element);
    
            return HTML.SPECIAL_ELEMENTS[ns][tn];
        }
    }
    
    module.exports = Parser;
    
    //Adoption agency algorithm
    //(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html#adoptionAgency)
    //------------------------------------------------------------------
    
    //Steps 5-8 of the algorithm
    function aaObtainFormattingElementEntry(p, token) {
        let formattingElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName(token.tagName);
    
        if (formattingElementEntry) {
            if (!p.openElements.contains(formattingElementEntry.element)) {
                p.activeFormattingElements.removeEntry(formattingElementEntry);
                formattingElementEntry = null;
            } else if (!p.openElements.hasInScope(token.tagName)) {
                formattingElementEntry = null;
            }
        } else {
            genericEndTagInBody(p, token);
        }
    
        return formattingElementEntry;
    }
    
    //Steps 9 and 10 of the algorithm
    function aaObtainFurthestBlock(p, formattingElementEntry) {
        let furthestBlock = null;
    
        for (let i = p.openElements.stackTop; i >= 0; i--) {
            const element = p.openElements.items[i];
    
            if (element === formattingElementEntry.element) {
                break;
            }
    
            if (p._isSpecialElement(element)) {
                furthestBlock = element;
            }
        }
    
        if (!furthestBlock) {
            p.openElements.popUntilElementPopped(formattingElementEntry.element);
            p.activeFormattingElements.removeEntry(formattingElementEntry);
        }
    
        return furthestBlock;
    }
    
    //Step 13 of the algorithm
    function aaInnerLoop(p, furthestBlock, formattingElement) {
        let lastElement = furthestBlock;
        let nextElement = p.openElements.getCommonAncestor(furthestBlock);
    
        for (let i = 0, element = nextElement; element !== formattingElement; i++, element = nextElement) {
            //NOTE: store next element for the next loop iteration (it may be deleted from the stack by step 9.5)
            nextElement = p.openElements.getCommonAncestor(element);
    
            const elementEntry = p.activeFormattingElements.getElementEntry(element);
            const counterOverflow = elementEntry && i >= AA_INNER_LOOP_ITER;
            const shouldRemoveFromOpenElements = !elementEntry || counterOverflow;
    
            if (shouldRemoveFromOpenElements) {
                if (counterOverflow) {
                    p.activeFormattingElements.removeEntry(elementEntry);
                }
    
                p.openElements.remove(element);
            } else {
                element = aaRecreateElementFromEntry(p, elementEntry);
    
                if (lastElement === furthestBlock) {
                    p.activeFormattingElements.bookmark = elementEntry;
                }
    
                p.treeAdapter.detachNode(lastElement);
                p.treeAdapter.appendChild(element, lastElement);
                lastElement = element;
            }
        }
    
        return lastElement;
    }
    
    //Step 13.7 of the algorithm
    function aaRecreateElementFromEntry(p, elementEntry) {
        const ns = p.treeAdapter.getNamespaceURI(elementEntry.element);
        const newElement = p.treeAdapter.createElement(elementEntry.token.tagName, ns, elementEntry.token.attrs);
    
        p.openElements.replace(elementEntry.element, newElement);
        elementEntry.element = newElement;
    
        return newElement;
    }
    
    //Step 14 of the algorithm
    function aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement) {
        if (p._isElementCausesFosterParenting(commonAncestor)) {
            p._fosterParentElement(lastElement);
        } else {
            const tn = p.treeAdapter.getTagName(commonAncestor);
            const ns = p.treeAdapter.getNamespaceURI(commonAncestor);
    
            if (tn === $.TEMPLATE && ns === NS.HTML) {
                commonAncestor = p.treeAdapter.getTemplateContent(commonAncestor);
            }
    
            p.treeAdapter.appendChild(commonAncestor, lastElement);
        }
    }
    
    //Steps 15-19 of the algorithm
    function aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry) {
        const ns = p.treeAdapter.getNamespaceURI(formattingElementEntry.element);
        const token = formattingElementEntry.token;
        const newElement = p.treeAdapter.createElement(token.tagName, ns, token.attrs);
    
        p._adoptNodes(furthestBlock, newElement);
        p.treeAdapter.appendChild(furthestBlock, newElement);
    
        p.activeFormattingElements.insertElementAfterBookmark(newElement, formattingElementEntry.token);
        p.activeFormattingElements.removeEntry(formattingElementEntry);
    
        p.openElements.remove(formattingElementEntry.element);
        p.openElements.insertAfter(furthestBlock, newElement);
    }
    
    //Algorithm entry point
    function callAdoptionAgency(p, token) {
        let formattingElementEntry;
    
        for (let i = 0; i < AA_OUTER_LOOP_ITER; i++) {
            formattingElementEntry = aaObtainFormattingElementEntry(p, token, formattingElementEntry);
    
            if (!formattingElementEntry) {
                break;
            }
    
            const furthestBlock = aaObtainFurthestBlock(p, formattingElementEntry);
    
            if (!furthestBlock) {
                break;
            }
    
            p.activeFormattingElements.bookmark = formattingElementEntry;
    
            const lastElement = aaInnerLoop(p, furthestBlock, formattingElementEntry.element);
            const commonAncestor = p.openElements.getCommonAncestor(formattingElementEntry.element);
    
            p.treeAdapter.detachNode(lastElement);
            aaInsertLastNodeInCommonAncestor(p, commonAncestor, lastElement);
            aaReplaceFormattingElement(p, furthestBlock, formattingElementEntry);
        }
    }
    
    //Generic token handlers
    //------------------------------------------------------------------
    function ignoreToken() {
        //NOTE: do nothing =)
    }
    
    function misplacedDoctype(p) {
        p._err(ERR.misplacedDoctype);
    }
    
    function appendComment(p, token) {
        p._appendCommentNode(token, p.openElements.currentTmplContent || p.openElements.current);
    }
    
    function appendCommentToRootHtmlElement(p, token) {
        p._appendCommentNode(token, p.openElements.items[0]);
    }
    
    function appendCommentToDocument(p, token) {
        p._appendCommentNode(token, p.document);
    }
    
    function insertCharacters(p, token) {
        p._insertCharacters(token);
    }
    
    function stopParsing(p) {
        p.stopped = true;
    }
    
    // The "initial" insertion mode
    //------------------------------------------------------------------
    function doctypeInInitialMode(p, token) {
        p._setDocumentType(token);
    
        const mode = token.forceQuirks ? HTML.DOCUMENT_MODE.QUIRKS : doctype.getDocumentMode(token);
    
        if (!doctype.isConforming(token)) {
            p._err(ERR.nonConformingDoctype);
        }
    
        p.treeAdapter.setDocumentMode(p.document, mode);
    
        p.insertionMode = BEFORE_HTML_MODE;
    }
    
    function tokenInInitialMode(p, token) {
        p._err(ERR.missingDoctype, { beforeToken: true });
        p.treeAdapter.setDocumentMode(p.document, HTML.DOCUMENT_MODE.QUIRKS);
        p.insertionMode = BEFORE_HTML_MODE;
        p._processToken(token);
    }
    
    // The "before html" insertion mode
    //------------------------------------------------------------------
    function startTagBeforeHtml(p, token) {
        if (token.tagName === $.HTML) {
            p._insertElement(token, NS.HTML);
            p.insertionMode = BEFORE_HEAD_MODE;
        } else {
            tokenBeforeHtml(p, token);
        }
    }
    
    function endTagBeforeHtml(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML || tn === $.HEAD || tn === $.BODY || tn === $.BR) {
            tokenBeforeHtml(p, token);
        }
    }
    
    function tokenBeforeHtml(p, token) {
        p._insertFakeRootElement();
        p.insertionMode = BEFORE_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "before head" insertion mode
    //------------------------------------------------------------------
    function startTagBeforeHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.HEAD) {
            p._insertElement(token, NS.HTML);
            p.headElement = p.openElements.current;
            p.insertionMode = IN_HEAD_MODE;
        } else {
            tokenBeforeHead(p, token);
        }
    }
    
    function endTagBeforeHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HEAD || tn === $.BODY || tn === $.HTML || tn === $.BR) {
            tokenBeforeHead(p, token);
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenBeforeHead(p, token) {
        p._insertFakeElement($.HEAD);
        p.headElement = p.openElements.current;
        p.insertionMode = IN_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "in head" insertion mode
    //------------------------------------------------------------------
    function startTagInHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.BASE || tn === $.BASEFONT || tn === $.BGSOUND || tn === $.LINK || tn === $.META) {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
        } else if (tn === $.TITLE) {
            p._switchToTextParsing(token, Tokenizer.MODE.RCDATA);
        } else if (tn === $.NOSCRIPT) {
            if (p.options.scriptingEnabled) {
                p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
            } else {
                p._insertElement(token, NS.HTML);
                p.insertionMode = IN_HEAD_NO_SCRIPT_MODE;
            }
        } else if (tn === $.NOFRAMES || tn === $.STYLE) {
            p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
        } else if (tn === $.SCRIPT) {
            p._switchToTextParsing(token, Tokenizer.MODE.SCRIPT_DATA);
        } else if (tn === $.TEMPLATE) {
            p._insertTemplate(token, NS.HTML);
            p.activeFormattingElements.insertMarker();
            p.framesetOk = false;
            p.insertionMode = IN_TEMPLATE_MODE;
            p._pushTmplInsertionMode(IN_TEMPLATE_MODE);
        } else if (tn === $.HEAD) {
            p._err(ERR.misplacedStartTagForHeadElement);
        } else {
            tokenInHead(p, token);
        }
    }
    
    function endTagInHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HEAD) {
            p.openElements.pop();
            p.insertionMode = AFTER_HEAD_MODE;
        } else if (tn === $.BODY || tn === $.BR || tn === $.HTML) {
            tokenInHead(p, token);
        } else if (tn === $.TEMPLATE) {
            if (p.openElements.tmplCount > 0) {
                p.openElements.generateImpliedEndTagsThoroughly();
    
                if (p.openElements.currentTagName !== $.TEMPLATE) {
                    p._err(ERR.closingOfElementWithOpenChildElements);
                }
    
                p.openElements.popUntilTagNamePopped($.TEMPLATE);
                p.activeFormattingElements.clearToLastMarker();
                p._popTmplInsertionMode();
                p._resetInsertionMode();
            } else {
                p._err(ERR.endTagWithoutMatchingOpenElement);
            }
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenInHead(p, token) {
        p.openElements.pop();
        p.insertionMode = AFTER_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "in head no script" insertion mode
    //------------------------------------------------------------------
    function startTagInHeadNoScript(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (
            tn === $.BASEFONT ||
            tn === $.BGSOUND ||
            tn === $.HEAD ||
            tn === $.LINK ||
            tn === $.META ||
            tn === $.NOFRAMES ||
            tn === $.STYLE
        ) {
            startTagInHead(p, token);
        } else if (tn === $.NOSCRIPT) {
            p._err(ERR.nestedNoscriptInHead);
        } else {
            tokenInHeadNoScript(p, token);
        }
    }
    
    function endTagInHeadNoScript(p, token) {
        const tn = token.tagName;
    
        if (tn === $.NOSCRIPT) {
            p.openElements.pop();
            p.insertionMode = IN_HEAD_MODE;
        } else if (tn === $.BR) {
            tokenInHeadNoScript(p, token);
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenInHeadNoScript(p, token) {
        const errCode =
            token.type === Tokenizer.EOF_TOKEN ? ERR.openElementsLeftAfterEof : ERR.disallowedContentInNoscriptInHead;
    
        p._err(errCode);
        p.openElements.pop();
        p.insertionMode = IN_HEAD_MODE;
        p._processToken(token);
    }
    
    // The "after head" insertion mode
    //------------------------------------------------------------------
    function startTagAfterHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.BODY) {
            p._insertElement(token, NS.HTML);
            p.framesetOk = false;
            p.insertionMode = IN_BODY_MODE;
        } else if (tn === $.FRAMESET) {
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_FRAMESET_MODE;
        } else if (
            tn === $.BASE ||
            tn === $.BASEFONT ||
            tn === $.BGSOUND ||
            tn === $.LINK ||
            tn === $.META ||
            tn === $.NOFRAMES ||
            tn === $.SCRIPT ||
            tn === $.STYLE ||
            tn === $.TEMPLATE ||
            tn === $.TITLE
        ) {
            p._err(ERR.abandonedHeadElementChild);
            p.openElements.push(p.headElement);
            startTagInHead(p, token);
            p.openElements.remove(p.headElement);
        } else if (tn === $.HEAD) {
            p._err(ERR.misplacedStartTagForHeadElement);
        } else {
            tokenAfterHead(p, token);
        }
    }
    
    function endTagAfterHead(p, token) {
        const tn = token.tagName;
    
        if (tn === $.BODY || tn === $.HTML || tn === $.BR) {
            tokenAfterHead(p, token);
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        } else {
            p._err(ERR.endTagWithoutMatchingOpenElement);
        }
    }
    
    function tokenAfterHead(p, token) {
        p._insertFakeElement($.BODY);
        p.insertionMode = IN_BODY_MODE;
        p._processToken(token);
    }
    
    // The "in body" insertion mode
    //------------------------------------------------------------------
    function whitespaceCharacterInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertCharacters(token);
    }
    
    function characterInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertCharacters(token);
        p.framesetOk = false;
    }
    
    function htmlStartTagInBody(p, token) {
        if (p.openElements.tmplCount === 0) {
            p.treeAdapter.adoptAttributes(p.openElements.items[0], token.attrs);
        }
    }
    
    function bodyStartTagInBody(p, token) {
        const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    
        if (bodyElement && p.openElements.tmplCount === 0) {
            p.framesetOk = false;
            p.treeAdapter.adoptAttributes(bodyElement, token.attrs);
        }
    }
    
    function framesetStartTagInBody(p, token) {
        const bodyElement = p.openElements.tryPeekProperlyNestedBodyElement();
    
        if (p.framesetOk && bodyElement) {
            p.treeAdapter.detachNode(bodyElement);
            p.openElements.popAllUpToHtmlElement();
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_FRAMESET_MODE;
        }
    }
    
    function addressStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function numberedHeaderStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        const tn = p.openElements.currentTagName;
    
        if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) {
            p.openElements.pop();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function preStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
        //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
        //on to the next one. (Newlines at the start of pre blocks are ignored as an authoring convenience.)
        p.skipNextNewLine = true;
        p.framesetOk = false;
    }
    
    function formStartTagInBody(p, token) {
        const inTemplate = p.openElements.tmplCount > 0;
    
        if (!p.formElement || inTemplate) {
            if (p.openElements.hasInButtonScope($.P)) {
                p._closePElement();
            }
    
            p._insertElement(token, NS.HTML);
    
            if (!inTemplate) {
                p.formElement = p.openElements.current;
            }
        }
    }
    
    function listItemStartTagInBody(p, token) {
        p.framesetOk = false;
    
        const tn = token.tagName;
    
        for (let i = p.openElements.stackTop; i >= 0; i--) {
            const element = p.openElements.items[i];
            const elementTn = p.treeAdapter.getTagName(element);
            let closeTn = null;
    
            if (tn === $.LI && elementTn === $.LI) {
                closeTn = $.LI;
            } else if ((tn === $.DD || tn === $.DT) && (elementTn === $.DD || elementTn === $.DT)) {
                closeTn = elementTn;
            }
    
            if (closeTn) {
                p.openElements.generateImpliedEndTagsWithExclusion(closeTn);
                p.openElements.popUntilTagNamePopped(closeTn);
                break;
            }
    
            if (elementTn !== $.ADDRESS && elementTn !== $.DIV && elementTn !== $.P && p._isSpecialElement(element)) {
                break;
            }
        }
    
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function plaintextStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
        p.tokenizer.state = Tokenizer.MODE.PLAINTEXT;
    }
    
    function buttonStartTagInBody(p, token) {
        if (p.openElements.hasInScope($.BUTTON)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped($.BUTTON);
        }
    
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
    }
    
    function aStartTagInBody(p, token) {
        const activeElementEntry = p.activeFormattingElements.getElementEntryInScopeWithTagName($.A);
    
        if (activeElementEntry) {
            callAdoptionAgency(p, token);
            p.openElements.remove(activeElementEntry.element);
            p.activeFormattingElements.removeEntry(activeElementEntry);
        }
    
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.pushElement(p.openElements.current, token);
    }
    
    function bStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.pushElement(p.openElements.current, token);
    }
    
    function nobrStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
    
        if (p.openElements.hasInScope($.NOBR)) {
            callAdoptionAgency(p, token);
            p._reconstructActiveFormattingElements();
        }
    
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.pushElement(p.openElements.current, token);
    }
    
    function appletStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.activeFormattingElements.insertMarker();
        p.framesetOk = false;
    }
    
    function tableStartTagInBody(p, token) {
        if (
            p.treeAdapter.getDocumentMode(p.document) !== HTML.DOCUMENT_MODE.QUIRKS &&
            p.openElements.hasInButtonScope($.P)
        ) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
        p.insertionMode = IN_TABLE_MODE;
    }
    
    function areaStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._appendElement(token, NS.HTML);
        p.framesetOk = false;
        token.ackSelfClosing = true;
    }
    
    function inputStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._appendElement(token, NS.HTML);
    
        const inputType = Tokenizer.getTokenAttr(token, ATTRS.TYPE);
    
        if (!inputType || inputType.toLowerCase() !== HIDDEN_INPUT_TYPE) {
            p.framesetOk = false;
        }
    
        token.ackSelfClosing = true;
    }
    
    function paramStartTagInBody(p, token) {
        p._appendElement(token, NS.HTML);
        token.ackSelfClosing = true;
    }
    
    function hrStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._appendElement(token, NS.HTML);
        p.framesetOk = false;
        token.ackSelfClosing = true;
    }
    
    function imageStartTagInBody(p, token) {
        token.tagName = $.IMG;
        areaStartTagInBody(p, token);
    }
    
    function textareaStartTagInBody(p, token) {
        p._insertElement(token, NS.HTML);
        //NOTE: If the next token is a U+000A LINE FEED (LF) character token, then ignore that token and move
        //on to the next one. (Newlines at the start of textarea elements are ignored as an authoring convenience.)
        p.skipNextNewLine = true;
        p.tokenizer.state = Tokenizer.MODE.RCDATA;
        p.originalInsertionMode = p.insertionMode;
        p.framesetOk = false;
        p.insertionMode = TEXT_MODE;
    }
    
    function xmpStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._reconstructActiveFormattingElements();
        p.framesetOk = false;
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
    }
    
    function iframeStartTagInBody(p, token) {
        p.framesetOk = false;
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
    }
    
    //NOTE: here we assume that we always act as an user agent with enabled plugins, so we parse
    //<noembed> as a rawtext.
    function noembedStartTagInBody(p, token) {
        p._switchToTextParsing(token, Tokenizer.MODE.RAWTEXT);
    }
    
    function selectStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
        p.framesetOk = false;
    
        if (
            p.insertionMode === IN_TABLE_MODE ||
            p.insertionMode === IN_CAPTION_MODE ||
            p.insertionMode === IN_TABLE_BODY_MODE ||
            p.insertionMode === IN_ROW_MODE ||
            p.insertionMode === IN_CELL_MODE
        ) {
            p.insertionMode = IN_SELECT_IN_TABLE_MODE;
        } else {
            p.insertionMode = IN_SELECT_MODE;
        }
    }
    
    function optgroupStartTagInBody(p, token) {
        if (p.openElements.currentTagName === $.OPTION) {
            p.openElements.pop();
        }
    
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
    }
    
    function rbStartTagInBody(p, token) {
        if (p.openElements.hasInScope($.RUBY)) {
            p.openElements.generateImpliedEndTags();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function rtStartTagInBody(p, token) {
        if (p.openElements.hasInScope($.RUBY)) {
            p.openElements.generateImpliedEndTagsWithExclusion($.RTC);
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function menuStartTagInBody(p, token) {
        if (p.openElements.hasInButtonScope($.P)) {
            p._closePElement();
        }
    
        p._insertElement(token, NS.HTML);
    }
    
    function mathStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
    
        foreignContent.adjustTokenMathMLAttrs(token);
        foreignContent.adjustTokenXMLAttrs(token);
    
        if (token.selfClosing) {
            p._appendElement(token, NS.MATHML);
        } else {
            p._insertElement(token, NS.MATHML);
        }
    
        token.ackSelfClosing = true;
    }
    
    function svgStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
    
        foreignContent.adjustTokenSVGAttrs(token);
        foreignContent.adjustTokenXMLAttrs(token);
    
        if (token.selfClosing) {
            p._appendElement(token, NS.SVG);
        } else {
            p._insertElement(token, NS.SVG);
        }
    
        token.ackSelfClosing = true;
    }
    
    function genericStartTagInBody(p, token) {
        p._reconstructActiveFormattingElements();
        p._insertElement(token, NS.HTML);
    }
    
    //OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
    //It's faster than using dictionary.
    function startTagInBody(p, token) {
        const tn = token.tagName;
    
        switch (tn.length) {
            case 1:
                if (tn === $.I || tn === $.S || tn === $.B || tn === $.U) {
                    bStartTagInBody(p, token);
                } else if (tn === $.P) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.A) {
                    aStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 2:
                if (tn === $.DL || tn === $.OL || tn === $.UL) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) {
                    numberedHeaderStartTagInBody(p, token);
                } else if (tn === $.LI || tn === $.DD || tn === $.DT) {
                    listItemStartTagInBody(p, token);
                } else if (tn === $.EM || tn === $.TT) {
                    bStartTagInBody(p, token);
                } else if (tn === $.BR) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.HR) {
                    hrStartTagInBody(p, token);
                } else if (tn === $.RB) {
                    rbStartTagInBody(p, token);
                } else if (tn === $.RT || tn === $.RP) {
                    rtStartTagInBody(p, token);
                } else if (tn !== $.TH && tn !== $.TD && tn !== $.TR) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 3:
                if (tn === $.DIV || tn === $.DIR || tn === $.NAV) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.PRE) {
                    preStartTagInBody(p, token);
                } else if (tn === $.BIG) {
                    bStartTagInBody(p, token);
                } else if (tn === $.IMG || tn === $.WBR) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.XMP) {
                    xmpStartTagInBody(p, token);
                } else if (tn === $.SVG) {
                    svgStartTagInBody(p, token);
                } else if (tn === $.RTC) {
                    rbStartTagInBody(p, token);
                } else if (tn !== $.COL) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 4:
                if (tn === $.HTML) {
                    htmlStartTagInBody(p, token);
                } else if (tn === $.BASE || tn === $.LINK || tn === $.META) {
                    startTagInHead(p, token);
                } else if (tn === $.BODY) {
                    bodyStartTagInBody(p, token);
                } else if (tn === $.MAIN || tn === $.MENU) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.FORM) {
                    formStartTagInBody(p, token);
                } else if (tn === $.CODE || tn === $.FONT) {
                    bStartTagInBody(p, token);
                } else if (tn === $.NOBR) {
                    nobrStartTagInBody(p, token);
                } else if (tn === $.AREA) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.MATH) {
                    mathStartTagInBody(p, token);
                } else if (tn === $.MENU) {
                    menuStartTagInBody(p, token);
                } else if (tn !== $.HEAD) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 5:
                if (tn === $.STYLE || tn === $.TITLE) {
                    startTagInHead(p, token);
                } else if (tn === $.ASIDE) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.SMALL) {
                    bStartTagInBody(p, token);
                } else if (tn === $.TABLE) {
                    tableStartTagInBody(p, token);
                } else if (tn === $.EMBED) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.INPUT) {
                    inputStartTagInBody(p, token);
                } else if (tn === $.PARAM || tn === $.TRACK) {
                    paramStartTagInBody(p, token);
                } else if (tn === $.IMAGE) {
                    imageStartTagInBody(p, token);
                } else if (tn !== $.FRAME && tn !== $.TBODY && tn !== $.TFOOT && tn !== $.THEAD) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 6:
                if (tn === $.SCRIPT) {
                    startTagInHead(p, token);
                } else if (
                    tn === $.CENTER ||
                    tn === $.FIGURE ||
                    tn === $.FOOTER ||
                    tn === $.HEADER ||
                    tn === $.HGROUP ||
                    tn === $.DIALOG
                ) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.BUTTON) {
                    buttonStartTagInBody(p, token);
                } else if (tn === $.STRIKE || tn === $.STRONG) {
                    bStartTagInBody(p, token);
                } else if (tn === $.APPLET || tn === $.OBJECT) {
                    appletStartTagInBody(p, token);
                } else if (tn === $.KEYGEN) {
                    areaStartTagInBody(p, token);
                } else if (tn === $.SOURCE) {
                    paramStartTagInBody(p, token);
                } else if (tn === $.IFRAME) {
                    iframeStartTagInBody(p, token);
                } else if (tn === $.SELECT) {
                    selectStartTagInBody(p, token);
                } else if (tn === $.OPTION) {
                    optgroupStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 7:
                if (tn === $.BGSOUND) {
                    startTagInHead(p, token);
                } else if (
                    tn === $.DETAILS ||
                    tn === $.ADDRESS ||
                    tn === $.ARTICLE ||
                    tn === $.SECTION ||
                    tn === $.SUMMARY
                ) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.LISTING) {
                    preStartTagInBody(p, token);
                } else if (tn === $.MARQUEE) {
                    appletStartTagInBody(p, token);
                } else if (tn === $.NOEMBED) {
                    noembedStartTagInBody(p, token);
                } else if (tn !== $.CAPTION) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 8:
                if (tn === $.BASEFONT) {
                    startTagInHead(p, token);
                } else if (tn === $.FRAMESET) {
                    framesetStartTagInBody(p, token);
                } else if (tn === $.FIELDSET) {
                    addressStartTagInBody(p, token);
                } else if (tn === $.TEXTAREA) {
                    textareaStartTagInBody(p, token);
                } else if (tn === $.TEMPLATE) {
                    startTagInHead(p, token);
                } else if (tn === $.NOSCRIPT) {
                    if (p.options.scriptingEnabled) {
                        noembedStartTagInBody(p, token);
                    } else {
                        genericStartTagInBody(p, token);
                    }
                } else if (tn === $.OPTGROUP) {
                    optgroupStartTagInBody(p, token);
                } else if (tn !== $.COLGROUP) {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 9:
                if (tn === $.PLAINTEXT) {
                    plaintextStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            case 10:
                if (tn === $.BLOCKQUOTE || tn === $.FIGCAPTION) {
                    addressStartTagInBody(p, token);
                } else {
                    genericStartTagInBody(p, token);
                }
    
                break;
    
            default:
                genericStartTagInBody(p, token);
        }
    }
    
    function bodyEndTagInBody(p) {
        if (p.openElements.hasInScope($.BODY)) {
            p.insertionMode = AFTER_BODY_MODE;
        }
    }
    
    function htmlEndTagInBody(p, token) {
        if (p.openElements.hasInScope($.BODY)) {
            p.insertionMode = AFTER_BODY_MODE;
            p._processToken(token);
        }
    }
    
    function addressEndTagInBody(p, token) {
        const tn = token.tagName;
    
        if (p.openElements.hasInScope(tn)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(tn);
        }
    }
    
    function formEndTagInBody(p) {
        const inTemplate = p.openElements.tmplCount > 0;
        const formElement = p.formElement;
    
        if (!inTemplate) {
            p.formElement = null;
        }
    
        if ((formElement || inTemplate) && p.openElements.hasInScope($.FORM)) {
            p.openElements.generateImpliedEndTags();
    
            if (inTemplate) {
                p.openElements.popUntilTagNamePopped($.FORM);
            } else {
                p.openElements.remove(formElement);
            }
        }
    }
    
    function pEndTagInBody(p) {
        if (!p.openElements.hasInButtonScope($.P)) {
            p._insertFakeElement($.P);
        }
    
        p._closePElement();
    }
    
    function liEndTagInBody(p) {
        if (p.openElements.hasInListItemScope($.LI)) {
            p.openElements.generateImpliedEndTagsWithExclusion($.LI);
            p.openElements.popUntilTagNamePopped($.LI);
        }
    }
    
    function ddEndTagInBody(p, token) {
        const tn = token.tagName;
    
        if (p.openElements.hasInScope(tn)) {
            p.openElements.generateImpliedEndTagsWithExclusion(tn);
            p.openElements.popUntilTagNamePopped(tn);
        }
    }
    
    function numberedHeaderEndTagInBody(p) {
        if (p.openElements.hasNumberedHeaderInScope()) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilNumberedHeaderPopped();
        }
    }
    
    function appletEndTagInBody(p, token) {
        const tn = token.tagName;
    
        if (p.openElements.hasInScope(tn)) {
            p.openElements.generateImpliedEndTags();
            p.openElements.popUntilTagNamePopped(tn);
            p.activeFormattingElements.clearToLastMarker();
        }
    }
    
    function brEndTagInBody(p) {
        p._reconstructActiveFormattingElements();
        p._insertFakeElement($.BR);
        p.openElements.pop();
        p.framesetOk = false;
    }
    
    function genericEndTagInBody(p, token) {
        const tn = token.tagName;
    
        for (let i = p.openElements.stackTop; i > 0; i--) {
            const element = p.openElements.items[i];
    
            if (p.treeAdapter.getTagName(element) === tn) {
                p.openElements.generateImpliedEndTagsWithExclusion(tn);
                p.openElements.popUntilElementPopped(element);
                break;
            }
    
            if (p._isSpecialElement(element)) {
                break;
            }
        }
    }
    
    //OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
    //It's faster than using dictionary.
    function endTagInBody(p, token) {
        const tn = token.tagName;
    
        switch (tn.length) {
            case 1:
                if (tn === $.A || tn === $.B || tn === $.I || tn === $.S || tn === $.U) {
                    callAdoptionAgency(p, token);
                } else if (tn === $.P) {
                    pEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 2:
                if (tn === $.DL || tn === $.UL || tn === $.OL) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.LI) {
                    liEndTagInBody(p, token);
                } else if (tn === $.DD || tn === $.DT) {
                    ddEndTagInBody(p, token);
                } else if (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) {
                    numberedHeaderEndTagInBody(p, token);
                } else if (tn === $.BR) {
                    brEndTagInBody(p, token);
                } else if (tn === $.EM || tn === $.TT) {
                    callAdoptionAgency(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 3:
                if (tn === $.BIG) {
                    callAdoptionAgency(p, token);
                } else if (tn === $.DIR || tn === $.DIV || tn === $.NAV || tn === $.PRE) {
                    addressEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 4:
                if (tn === $.BODY) {
                    bodyEndTagInBody(p, token);
                } else if (tn === $.HTML) {
                    htmlEndTagInBody(p, token);
                } else if (tn === $.FORM) {
                    formEndTagInBody(p, token);
                } else if (tn === $.CODE || tn === $.FONT || tn === $.NOBR) {
                    callAdoptionAgency(p, token);
                } else if (tn === $.MAIN || tn === $.MENU) {
                    addressEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 5:
                if (tn === $.ASIDE) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.SMALL) {
                    callAdoptionAgency(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 6:
                if (
                    tn === $.CENTER ||
                    tn === $.FIGURE ||
                    tn === $.FOOTER ||
                    tn === $.HEADER ||
                    tn === $.HGROUP ||
                    tn === $.DIALOG
                ) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.APPLET || tn === $.OBJECT) {
                    appletEndTagInBody(p, token);
                } else if (tn === $.STRIKE || tn === $.STRONG) {
                    callAdoptionAgency(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 7:
                if (
                    tn === $.ADDRESS ||
                    tn === $.ARTICLE ||
                    tn === $.DETAILS ||
                    tn === $.SECTION ||
                    tn === $.SUMMARY ||
                    tn === $.LISTING
                ) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.MARQUEE) {
                    appletEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 8:
                if (tn === $.FIELDSET) {
                    addressEndTagInBody(p, token);
                } else if (tn === $.TEMPLATE) {
                    endTagInHead(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            case 10:
                if (tn === $.BLOCKQUOTE || tn === $.FIGCAPTION) {
                    addressEndTagInBody(p, token);
                } else {
                    genericEndTagInBody(p, token);
                }
    
                break;
    
            default:
                genericEndTagInBody(p, token);
        }
    }
    
    function eofInBody(p, token) {
        if (p.tmplInsertionModeStackTop > -1) {
            eofInTemplate(p, token);
        } else {
            p.stopped = true;
        }
    }
    
    // The "text" insertion mode
    //------------------------------------------------------------------
    function endTagInText(p, token) {
        if (token.tagName === $.SCRIPT) {
            p.pendingScript = p.openElements.current;
        }
    
        p.openElements.pop();
        p.insertionMode = p.originalInsertionMode;
    }
    
    function eofInText(p, token) {
        p._err(ERR.eofInElementThatCanContainOnlyText);
        p.openElements.pop();
        p.insertionMode = p.originalInsertionMode;
        p._processToken(token);
    }
    
    // The "in table" insertion mode
    //------------------------------------------------------------------
    function characterInTable(p, token) {
        const curTn = p.openElements.currentTagName;
    
        if (curTn === $.TABLE || curTn === $.TBODY || curTn === $.TFOOT || curTn === $.THEAD || curTn === $.TR) {
            p.pendingCharacterTokens = [];
            p.hasNonWhitespacePendingCharacterToken = false;
            p.originalInsertionMode = p.insertionMode;
            p.insertionMode = IN_TABLE_TEXT_MODE;
            p._processToken(token);
        } else {
            tokenInTable(p, token);
        }
    }
    
    function captionStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p.activeFormattingElements.insertMarker();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_CAPTION_MODE;
    }
    
    function colgroupStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_COLUMN_GROUP_MODE;
    }
    
    function colStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertFakeElement($.COLGROUP);
        p.insertionMode = IN_COLUMN_GROUP_MODE;
        p._processToken(token);
    }
    
    function tbodyStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertElement(token, NS.HTML);
        p.insertionMode = IN_TABLE_BODY_MODE;
    }
    
    function tdStartTagInTable(p, token) {
        p.openElements.clearBackToTableContext();
        p._insertFakeElement($.TBODY);
        p.insertionMode = IN_TABLE_BODY_MODE;
        p._processToken(token);
    }
    
    function tableStartTagInTable(p, token) {
        if (p.openElements.hasInTableScope($.TABLE)) {
            p.openElements.popUntilTagNamePopped($.TABLE);
            p._resetInsertionMode();
            p._processToken(token);
        }
    }
    
    function inputStartTagInTable(p, token) {
        const inputType = Tokenizer.getTokenAttr(token, ATTRS.TYPE);
    
        if (inputType && inputType.toLowerCase() === HIDDEN_INPUT_TYPE) {
            p._appendElement(token, NS.HTML);
        } else {
            tokenInTable(p, token);
        }
    
        token.ackSelfClosing = true;
    }
    
    function formStartTagInTable(p, token) {
        if (!p.formElement && p.openElements.tmplCount === 0) {
            p._insertElement(token, NS.HTML);
            p.formElement = p.openElements.current;
            p.openElements.pop();
        }
    }
    
    function startTagInTable(p, token) {
        const tn = token.tagName;
    
        switch (tn.length) {
            case 2:
                if (tn === $.TD || tn === $.TH || tn === $.TR) {
                    tdStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 3:
                if (tn === $.COL) {
                    colStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 4:
                if (tn === $.FORM) {
                    formStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 5:
                if (tn === $.TABLE) {
                    tableStartTagInTable(p, token);
                } else if (tn === $.STYLE) {
                    startTagInHead(p, token);
                } else if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
                    tbodyStartTagInTable(p, token);
                } else if (tn === $.INPUT) {
                    inputStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 6:
                if (tn === $.SCRIPT) {
                    startTagInHead(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 7:
                if (tn === $.CAPTION) {
                    captionStartTagInTable(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            case 8:
                if (tn === $.COLGROUP) {
                    colgroupStartTagInTable(p, token);
                } else if (tn === $.TEMPLATE) {
                    startTagInHead(p, token);
                } else {
                    tokenInTable(p, token);
                }
    
                break;
    
            default:
                tokenInTable(p, token);
        }
    }
    
    function endTagInTable(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TABLE) {
            if (p.openElements.hasInTableScope($.TABLE)) {
                p.openElements.popUntilTagNamePopped($.TABLE);
                p._resetInsertionMode();
            }
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        } else if (
            tn !== $.BODY &&
            tn !== $.CAPTION &&
            tn !== $.COL &&
            tn !== $.COLGROUP &&
            tn !== $.HTML &&
            tn !== $.TBODY &&
            tn !== $.TD &&
            tn !== $.TFOOT &&
            tn !== $.TH &&
            tn !== $.THEAD &&
            tn !== $.TR
        ) {
            tokenInTable(p, token);
        }
    }
    
    function tokenInTable(p, token) {
        const savedFosterParentingState = p.fosterParentingEnabled;
    
        p.fosterParentingEnabled = true;
        p._processTokenInBodyMode(token);
        p.fosterParentingEnabled = savedFosterParentingState;
    }
    
    // The "in table text" insertion mode
    //------------------------------------------------------------------
    function whitespaceCharacterInTableText(p, token) {
        p.pendingCharacterTokens.push(token);
    }
    
    function characterInTableText(p, token) {
        p.pendingCharacterTokens.push(token);
        p.hasNonWhitespacePendingCharacterToken = true;
    }
    
    function tokenInTableText(p, token) {
        let i = 0;
    
        if (p.hasNonWhitespacePendingCharacterToken) {
            for (; i < p.pendingCharacterTokens.length; i++) {
                tokenInTable(p, p.pendingCharacterTokens[i]);
            }
        } else {
            for (; i < p.pendingCharacterTokens.length; i++) {
                p._insertCharacters(p.pendingCharacterTokens[i]);
            }
        }
    
        p.insertionMode = p.originalInsertionMode;
        p._processToken(token);
    }
    
    // The "in caption" insertion mode
    //------------------------------------------------------------------
    function startTagInCaption(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TD ||
            tn === $.TFOOT ||
            tn === $.TH ||
            tn === $.THEAD ||
            tn === $.TR
        ) {
            if (p.openElements.hasInTableScope($.CAPTION)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped($.CAPTION);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = IN_TABLE_MODE;
                p._processToken(token);
            }
        } else {
            startTagInBody(p, token);
        }
    }
    
    function endTagInCaption(p, token) {
        const tn = token.tagName;
    
        if (tn === $.CAPTION || tn === $.TABLE) {
            if (p.openElements.hasInTableScope($.CAPTION)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped($.CAPTION);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = IN_TABLE_MODE;
    
                if (tn === $.TABLE) {
                    p._processToken(token);
                }
            }
        } else if (
            tn !== $.BODY &&
            tn !== $.COL &&
            tn !== $.COLGROUP &&
            tn !== $.HTML &&
            tn !== $.TBODY &&
            tn !== $.TD &&
            tn !== $.TFOOT &&
            tn !== $.TH &&
            tn !== $.THEAD &&
            tn !== $.TR
        ) {
            endTagInBody(p, token);
        }
    }
    
    // The "in column group" insertion mode
    //------------------------------------------------------------------
    function startTagInColumnGroup(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.COL) {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
        } else if (tn === $.TEMPLATE) {
            startTagInHead(p, token);
        } else {
            tokenInColumnGroup(p, token);
        }
    }
    
    function endTagInColumnGroup(p, token) {
        const tn = token.tagName;
    
        if (tn === $.COLGROUP) {
            if (p.openElements.currentTagName === $.COLGROUP) {
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
            }
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        } else if (tn !== $.COL) {
            tokenInColumnGroup(p, token);
        }
    }
    
    function tokenInColumnGroup(p, token) {
        if (p.openElements.currentTagName === $.COLGROUP) {
            p.openElements.pop();
            p.insertionMode = IN_TABLE_MODE;
            p._processToken(token);
        }
    }
    
    // The "in table body" insertion mode
    //------------------------------------------------------------------
    function startTagInTableBody(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TR) {
            p.openElements.clearBackToTableBodyContext();
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_ROW_MODE;
        } else if (tn === $.TH || tn === $.TD) {
            p.openElements.clearBackToTableBodyContext();
            p._insertFakeElement($.TR);
            p.insertionMode = IN_ROW_MODE;
            p._processToken(token);
        } else if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD
        ) {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
                p._processToken(token);
            }
        } else {
            startTagInTable(p, token);
        }
    }
    
    function endTagInTableBody(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
            }
        } else if (tn === $.TABLE) {
            if (p.openElements.hasTableBodyContextInTableScope()) {
                p.openElements.clearBackToTableBodyContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_MODE;
                p._processToken(token);
            }
        } else if (
            (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP) ||
            (tn !== $.HTML && tn !== $.TD && tn !== $.TH && tn !== $.TR)
        ) {
            endTagInTable(p, token);
        }
    }
    
    // The "in row" insertion mode
    //------------------------------------------------------------------
    function startTagInRow(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TH || tn === $.TD) {
            p.openElements.clearBackToTableRowContext();
            p._insertElement(token, NS.HTML);
            p.insertionMode = IN_CELL_MODE;
            p.activeFormattingElements.insertMarker();
        } else if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD ||
            tn === $.TR
        ) {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
                p._processToken(token);
            }
        } else {
            startTagInTable(p, token);
        }
    }
    
    function endTagInRow(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TR) {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
            }
        } else if (tn === $.TABLE) {
            if (p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
                p._processToken(token);
            }
        } else if (tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD) {
            if (p.openElements.hasInTableScope(tn) || p.openElements.hasInTableScope($.TR)) {
                p.openElements.clearBackToTableRowContext();
                p.openElements.pop();
                p.insertionMode = IN_TABLE_BODY_MODE;
                p._processToken(token);
            }
        } else if (
            (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP) ||
            (tn !== $.HTML && tn !== $.TD && tn !== $.TH)
        ) {
            endTagInTable(p, token);
        }
    }
    
    // The "in cell" insertion mode
    //------------------------------------------------------------------
    function startTagInCell(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.COL ||
            tn === $.COLGROUP ||
            tn === $.TBODY ||
            tn === $.TD ||
            tn === $.TFOOT ||
            tn === $.TH ||
            tn === $.THEAD ||
            tn === $.TR
        ) {
            if (p.openElements.hasInTableScope($.TD) || p.openElements.hasInTableScope($.TH)) {
                p._closeTableCell();
                p._processToken(token);
            }
        } else {
            startTagInBody(p, token);
        }
    }
    
    function endTagInCell(p, token) {
        const tn = token.tagName;
    
        if (tn === $.TD || tn === $.TH) {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.generateImpliedEndTags();
                p.openElements.popUntilTagNamePopped(tn);
                p.activeFormattingElements.clearToLastMarker();
                p.insertionMode = IN_ROW_MODE;
            }
        } else if (tn === $.TABLE || tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD || tn === $.TR) {
            if (p.openElements.hasInTableScope(tn)) {
                p._closeTableCell();
                p._processToken(token);
            }
        } else if (tn !== $.BODY && tn !== $.CAPTION && tn !== $.COL && tn !== $.COLGROUP && tn !== $.HTML) {
            endTagInBody(p, token);
        }
    }
    
    // The "in select" insertion mode
    //------------------------------------------------------------------
    function startTagInSelect(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.OPTION) {
            if (p.openElements.currentTagName === $.OPTION) {
                p.openElements.pop();
            }
    
            p._insertElement(token, NS.HTML);
        } else if (tn === $.OPTGROUP) {
            if (p.openElements.currentTagName === $.OPTION) {
                p.openElements.pop();
            }
    
            if (p.openElements.currentTagName === $.OPTGROUP) {
                p.openElements.pop();
            }
    
            p._insertElement(token, NS.HTML);
        } else if (tn === $.INPUT || tn === $.KEYGEN || tn === $.TEXTAREA || tn === $.SELECT) {
            if (p.openElements.hasInSelectScope($.SELECT)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p._resetInsertionMode();
    
                if (tn !== $.SELECT) {
                    p._processToken(token);
                }
            }
        } else if (tn === $.SCRIPT || tn === $.TEMPLATE) {
            startTagInHead(p, token);
        }
    }
    
    function endTagInSelect(p, token) {
        const tn = token.tagName;
    
        if (tn === $.OPTGROUP) {
            const prevOpenElement = p.openElements.items[p.openElements.stackTop - 1];
            const prevOpenElementTn = prevOpenElement && p.treeAdapter.getTagName(prevOpenElement);
    
            if (p.openElements.currentTagName === $.OPTION && prevOpenElementTn === $.OPTGROUP) {
                p.openElements.pop();
            }
    
            if (p.openElements.currentTagName === $.OPTGROUP) {
                p.openElements.pop();
            }
        } else if (tn === $.OPTION) {
            if (p.openElements.currentTagName === $.OPTION) {
                p.openElements.pop();
            }
        } else if (tn === $.SELECT && p.openElements.hasInSelectScope($.SELECT)) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();
        } else if (tn === $.TEMPLATE) {
            endTagInHead(p, token);
        }
    }
    
    //12.2.5.4.17 The "in select in table" insertion mode
    //------------------------------------------------------------------
    function startTagInSelectInTable(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.TABLE ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD ||
            tn === $.TR ||
            tn === $.TD ||
            tn === $.TH
        ) {
            p.openElements.popUntilTagNamePopped($.SELECT);
            p._resetInsertionMode();
            p._processToken(token);
        } else {
            startTagInSelect(p, token);
        }
    }
    
    function endTagInSelectInTable(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.CAPTION ||
            tn === $.TABLE ||
            tn === $.TBODY ||
            tn === $.TFOOT ||
            tn === $.THEAD ||
            tn === $.TR ||
            tn === $.TD ||
            tn === $.TH
        ) {
            if (p.openElements.hasInTableScope(tn)) {
                p.openElements.popUntilTagNamePopped($.SELECT);
                p._resetInsertionMode();
                p._processToken(token);
            }
        } else {
            endTagInSelect(p, token);
        }
    }
    
    // The "in template" insertion mode
    //------------------------------------------------------------------
    function startTagInTemplate(p, token) {
        const tn = token.tagName;
    
        if (
            tn === $.BASE ||
            tn === $.BASEFONT ||
            tn === $.BGSOUND ||
            tn === $.LINK ||
            tn === $.META ||
            tn === $.NOFRAMES ||
            tn === $.SCRIPT ||
            tn === $.STYLE ||
            tn === $.TEMPLATE ||
            tn === $.TITLE
        ) {
            startTagInHead(p, token);
        } else {
            const newInsertionMode = TEMPLATE_INSERTION_MODE_SWITCH_MAP[tn] || IN_BODY_MODE;
    
            p._popTmplInsertionMode();
            p._pushTmplInsertionMode(newInsertionMode);
            p.insertionMode = newInsertionMode;
            p._processToken(token);
        }
    }
    
    function endTagInTemplate(p, token) {
        if (token.tagName === $.TEMPLATE) {
            endTagInHead(p, token);
        }
    }
    
    function eofInTemplate(p, token) {
        if (p.openElements.tmplCount > 0) {
            p.openElements.popUntilTagNamePopped($.TEMPLATE);
            p.activeFormattingElements.clearToLastMarker();
            p._popTmplInsertionMode();
            p._resetInsertionMode();
            p._processToken(token);
        } else {
            p.stopped = true;
        }
    }
    
    // The "after body" insertion mode
    //------------------------------------------------------------------
    function startTagAfterBody(p, token) {
        if (token.tagName === $.HTML) {
            startTagInBody(p, token);
        } else {
            tokenAfterBody(p, token);
        }
    }
    
    function endTagAfterBody(p, token) {
        if (token.tagName === $.HTML) {
            if (!p.fragmentContext) {
                p.insertionMode = AFTER_AFTER_BODY_MODE;
            }
        } else {
            tokenAfterBody(p, token);
        }
    }
    
    function tokenAfterBody(p, token) {
        p.insertionMode = IN_BODY_MODE;
        p._processToken(token);
    }
    
    // The "in frameset" insertion mode
    //------------------------------------------------------------------
    function startTagInFrameset(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.FRAMESET) {
            p._insertElement(token, NS.HTML);
        } else if (tn === $.FRAME) {
            p._appendElement(token, NS.HTML);
            token.ackSelfClosing = true;
        } else if (tn === $.NOFRAMES) {
            startTagInHead(p, token);
        }
    }
    
    function endTagInFrameset(p, token) {
        if (token.tagName === $.FRAMESET && !p.openElements.isRootHtmlElementCurrent()) {
            p.openElements.pop();
    
            if (!p.fragmentContext && p.openElements.currentTagName !== $.FRAMESET) {
                p.insertionMode = AFTER_FRAMESET_MODE;
            }
        }
    }
    
    // The "after frameset" insertion mode
    //------------------------------------------------------------------
    function startTagAfterFrameset(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.NOFRAMES) {
            startTagInHead(p, token);
        }
    }
    
    function endTagAfterFrameset(p, token) {
        if (token.tagName === $.HTML) {
            p.insertionMode = AFTER_AFTER_FRAMESET_MODE;
        }
    }
    
    // The "after after body" insertion mode
    //------------------------------------------------------------------
    function startTagAfterAfterBody(p, token) {
        if (token.tagName === $.HTML) {
            startTagInBody(p, token);
        } else {
            tokenAfterAfterBody(p, token);
        }
    }
    
    function tokenAfterAfterBody(p, token) {
        p.insertionMode = IN_BODY_MODE;
        p._processToken(token);
    }
    
    // The "after after frameset" insertion mode
    //------------------------------------------------------------------
    function startTagAfterAfterFrameset(p, token) {
        const tn = token.tagName;
    
        if (tn === $.HTML) {
            startTagInBody(p, token);
        } else if (tn === $.NOFRAMES) {
            startTagInHead(p, token);
        }
    }
    
    // The rules for parsing tokens in foreign content
    //------------------------------------------------------------------
    function nullCharacterInForeignContent(p, token) {
        token.chars = unicode.REPLACEMENT_CHARACTER;
        p._insertCharacters(token);
    }
    
    function characterInForeignContent(p, token) {
        p._insertCharacters(token);
        p.framesetOk = false;
    }
    
    function startTagInForeignContent(p, token) {
        if (foreignContent.causesExit(token) && !p.fragmentContext) {
            while (
                p.treeAdapter.getNamespaceURI(p.openElements.current) !== NS.HTML &&
                !p._isIntegrationPoint(p.openElements.current)
            ) {
                p.openElements.pop();
            }
    
            p._processToken(token);
        } else {
            const current = p._getAdjustedCurrentElement();
            const currentNs = p.treeAdapter.getNamespaceURI(current);
    
            if (currentNs === NS.MATHML) {
                foreignContent.adjustTokenMathMLAttrs(token);
            } else if (currentNs === NS.SVG) {
                foreignContent.adjustTokenSVGTagName(token);
                foreignContent.adjustTokenSVGAttrs(token);
            }
    
            foreignContent.adjustTokenXMLAttrs(token);
    
            if (token.selfClosing) {
                p._appendElement(token, currentNs);
            } else {
                p._insertElement(token, currentNs);
            }
    
            token.ackSelfClosing = true;
        }
    }
    
    function endTagInForeignContent(p, token) {
        for (let i = p.openElements.stackTop; i > 0; i--) {
            const element = p.openElements.items[i];
    
            if (p.treeAdapter.getNamespaceURI(element) === NS.HTML) {
                p._processToken(token);
                break;
            }
    
            if (p.treeAdapter.getTagName(element).toLowerCase() === token.tagName) {
                p.openElements.popUntilElementPopped(element);
                break;
            }
        }
    }
    
    
    /***/ }),
    /* 5 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Preprocessor = __webpack_require__(6);
    const unicode = __webpack_require__(7);
    const neTree = __webpack_require__(9);
    const ERR = __webpack_require__(8);
    
    //Aliases
    const $ = unicode.CODE_POINTS;
    const $$ = unicode.CODE_POINT_SEQUENCES;
    
    //C1 Unicode control character reference replacements
    const C1_CONTROLS_REFERENCE_REPLACEMENTS = {
        0x80: 0x20ac,
        0x82: 0x201a,
        0x83: 0x0192,
        0x84: 0x201e,
        0x85: 0x2026,
        0x86: 0x2020,
        0x87: 0x2021,
        0x88: 0x02c6,
        0x89: 0x2030,
        0x8a: 0x0160,
        0x8b: 0x2039,
        0x8c: 0x0152,
        0x8e: 0x017d,
        0x91: 0x2018,
        0x92: 0x2019,
        0x93: 0x201c,
        0x94: 0x201d,
        0x95: 0x2022,
        0x96: 0x2013,
        0x97: 0x2014,
        0x98: 0x02dc,
        0x99: 0x2122,
        0x9a: 0x0161,
        0x9b: 0x203a,
        0x9c: 0x0153,
        0x9e: 0x017e,
        0x9f: 0x0178
    };
    
    // Named entity tree flags
    const HAS_DATA_FLAG = 1 << 0;
    const DATA_DUPLET_FLAG = 1 << 1;
    const HAS_BRANCHES_FLAG = 1 << 2;
    const MAX_BRANCH_MARKER_VALUE = HAS_DATA_FLAG | DATA_DUPLET_FLAG | HAS_BRANCHES_FLAG;
    
    //States
    const DATA_STATE = 'DATA_STATE';
    const RCDATA_STATE = 'RCDATA_STATE';
    const RAWTEXT_STATE = 'RAWTEXT_STATE';
    const SCRIPT_DATA_STATE = 'SCRIPT_DATA_STATE';
    const PLAINTEXT_STATE = 'PLAINTEXT_STATE';
    const TAG_OPEN_STATE = 'TAG_OPEN_STATE';
    const END_TAG_OPEN_STATE = 'END_TAG_OPEN_STATE';
    const TAG_NAME_STATE = 'TAG_NAME_STATE';
    const RCDATA_LESS_THAN_SIGN_STATE = 'RCDATA_LESS_THAN_SIGN_STATE';
    const RCDATA_END_TAG_OPEN_STATE = 'RCDATA_END_TAG_OPEN_STATE';
    const RCDATA_END_TAG_NAME_STATE = 'RCDATA_END_TAG_NAME_STATE';
    const RAWTEXT_LESS_THAN_SIGN_STATE = 'RAWTEXT_LESS_THAN_SIGN_STATE';
    const RAWTEXT_END_TAG_OPEN_STATE = 'RAWTEXT_END_TAG_OPEN_STATE';
    const RAWTEXT_END_TAG_NAME_STATE = 'RAWTEXT_END_TAG_NAME_STATE';
    const SCRIPT_DATA_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_LESS_THAN_SIGN_STATE';
    const SCRIPT_DATA_END_TAG_OPEN_STATE = 'SCRIPT_DATA_END_TAG_OPEN_STATE';
    const SCRIPT_DATA_END_TAG_NAME_STATE = 'SCRIPT_DATA_END_TAG_NAME_STATE';
    const SCRIPT_DATA_ESCAPE_START_STATE = 'SCRIPT_DATA_ESCAPE_START_STATE';
    const SCRIPT_DATA_ESCAPE_START_DASH_STATE = 'SCRIPT_DATA_ESCAPE_START_DASH_STATE';
    const SCRIPT_DATA_ESCAPED_STATE = 'SCRIPT_DATA_ESCAPED_STATE';
    const SCRIPT_DATA_ESCAPED_DASH_STATE = 'SCRIPT_DATA_ESCAPED_DASH_STATE';
    const SCRIPT_DATA_ESCAPED_DASH_DASH_STATE = 'SCRIPT_DATA_ESCAPED_DASH_DASH_STATE';
    const SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE';
    const SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE = 'SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE';
    const SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE = 'SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE';
    const SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE = 'SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE';
    const BEFORE_ATTRIBUTE_NAME_STATE = 'BEFORE_ATTRIBUTE_NAME_STATE';
    const ATTRIBUTE_NAME_STATE = 'ATTRIBUTE_NAME_STATE';
    const AFTER_ATTRIBUTE_NAME_STATE = 'AFTER_ATTRIBUTE_NAME_STATE';
    const BEFORE_ATTRIBUTE_VALUE_STATE = 'BEFORE_ATTRIBUTE_VALUE_STATE';
    const ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE';
    const ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE = 'ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE';
    const ATTRIBUTE_VALUE_UNQUOTED_STATE = 'ATTRIBUTE_VALUE_UNQUOTED_STATE';
    const AFTER_ATTRIBUTE_VALUE_QUOTED_STATE = 'AFTER_ATTRIBUTE_VALUE_QUOTED_STATE';
    const SELF_CLOSING_START_TAG_STATE = 'SELF_CLOSING_START_TAG_STATE';
    const BOGUS_COMMENT_STATE = 'BOGUS_COMMENT_STATE';
    const MARKUP_DECLARATION_OPEN_STATE = 'MARKUP_DECLARATION_OPEN_STATE';
    const COMMENT_START_STATE = 'COMMENT_START_STATE';
    const COMMENT_START_DASH_STATE = 'COMMENT_START_DASH_STATE';
    const COMMENT_STATE = 'COMMENT_STATE';
    const COMMENT_LESS_THAN_SIGN_STATE = 'COMMENT_LESS_THAN_SIGN_STATE';
    const COMMENT_LESS_THAN_SIGN_BANG_STATE = 'COMMENT_LESS_THAN_SIGN_BANG_STATE';
    const COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE = 'COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE';
    const COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE = 'COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE';
    const COMMENT_END_DASH_STATE = 'COMMENT_END_DASH_STATE';
    const COMMENT_END_STATE = 'COMMENT_END_STATE';
    const COMMENT_END_BANG_STATE = 'COMMENT_END_BANG_STATE';
    const DOCTYPE_STATE = 'DOCTYPE_STATE';
    const BEFORE_DOCTYPE_NAME_STATE = 'BEFORE_DOCTYPE_NAME_STATE';
    const DOCTYPE_NAME_STATE = 'DOCTYPE_NAME_STATE';
    const AFTER_DOCTYPE_NAME_STATE = 'AFTER_DOCTYPE_NAME_STATE';
    const AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE = 'AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE';
    const BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE = 'BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE';
    const DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE = 'DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE';
    const DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE = 'DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE';
    const AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE = 'AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE';
    const BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE = 'BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE';
    const AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE = 'AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE';
    const BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE = 'BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE';
    const DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE = 'DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE';
    const DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE = 'DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE';
    const AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE = 'AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE';
    const BOGUS_DOCTYPE_STATE = 'BOGUS_DOCTYPE_STATE';
    const CDATA_SECTION_STATE = 'CDATA_SECTION_STATE';
    const CDATA_SECTION_BRACKET_STATE = 'CDATA_SECTION_BRACKET_STATE';
    const CDATA_SECTION_END_STATE = 'CDATA_SECTION_END_STATE';
    const CHARACTER_REFERENCE_STATE = 'CHARACTER_REFERENCE_STATE';
    const NAMED_CHARACTER_REFERENCE_STATE = 'NAMED_CHARACTER_REFERENCE_STATE';
    const AMBIGUOUS_AMPERSAND_STATE = 'AMBIGUOS_AMPERSAND_STATE';
    const NUMERIC_CHARACTER_REFERENCE_STATE = 'NUMERIC_CHARACTER_REFERENCE_STATE';
    const HEXADEMICAL_CHARACTER_REFERENCE_START_STATE = 'HEXADEMICAL_CHARACTER_REFERENCE_START_STATE';
    const DECIMAL_CHARACTER_REFERENCE_START_STATE = 'DECIMAL_CHARACTER_REFERENCE_START_STATE';
    const HEXADEMICAL_CHARACTER_REFERENCE_STATE = 'HEXADEMICAL_CHARACTER_REFERENCE_STATE';
    const DECIMAL_CHARACTER_REFERENCE_STATE = 'DECIMAL_CHARACTER_REFERENCE_STATE';
    const NUMERIC_CHARACTER_REFERENCE_END_STATE = 'NUMERIC_CHARACTER_REFERENCE_END_STATE';
    
    //Utils
    
    //OPTIMIZATION: these utility functions should not be moved out of this module. V8 Crankshaft will not inline
    //this functions if they will be situated in another module due to context switch.
    //Always perform inlining check before modifying this functions ('node --trace-inlining').
    function isWhitespace(cp) {
        return cp === $.SPACE || cp === $.LINE_FEED || cp === $.TABULATION || cp === $.FORM_FEED;
    }
    
    function isAsciiDigit(cp) {
        return cp >= $.DIGIT_0 && cp <= $.DIGIT_9;
    }
    
    function isAsciiUpper(cp) {
        return cp >= $.LATIN_CAPITAL_A && cp <= $.LATIN_CAPITAL_Z;
    }
    
    function isAsciiLower(cp) {
        return cp >= $.LATIN_SMALL_A && cp <= $.LATIN_SMALL_Z;
    }
    
    function isAsciiLetter(cp) {
        return isAsciiLower(cp) || isAsciiUpper(cp);
    }
    
    function isAsciiAlphaNumeric(cp) {
        return isAsciiLetter(cp) || isAsciiDigit(cp);
    }
    
    function isAsciiUpperHexDigit(cp) {
        return cp >= $.LATIN_CAPITAL_A && cp <= $.LATIN_CAPITAL_F;
    }
    
    function isAsciiLowerHexDigit(cp) {
        return cp >= $.LATIN_SMALL_A && cp <= $.LATIN_SMALL_F;
    }
    
    function isAsciiHexDigit(cp) {
        return isAsciiDigit(cp) || isAsciiUpperHexDigit(cp) || isAsciiLowerHexDigit(cp);
    }
    
    function toAsciiLowerCodePoint(cp) {
        return cp + 0x0020;
    }
    
    //NOTE: String.fromCharCode() function can handle only characters from BMP subset.
    //So, we need to workaround this manually.
    //(see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/fromCharCode#Getting_it_to_work_with_higher_values)
    function toChar(cp) {
        if (cp <= 0xffff) {
            return String.fromCharCode(cp);
        }
    
        cp -= 0x10000;
        return String.fromCharCode(((cp >>> 10) & 0x3ff) | 0xd800) + String.fromCharCode(0xdc00 | (cp & 0x3ff));
    }
    
    function toAsciiLowerChar(cp) {
        return String.fromCharCode(toAsciiLowerCodePoint(cp));
    }
    
    function findNamedEntityTreeBranch(nodeIx, cp) {
        const branchCount = neTree[++nodeIx];
        let lo = ++nodeIx;
        let hi = lo + branchCount - 1;
    
        while (lo <= hi) {
            const mid = (lo + hi) >>> 1;
            const midCp = neTree[mid];
    
            if (midCp < cp) {
                lo = mid + 1;
            } else if (midCp > cp) {
                hi = mid - 1;
            } else {
                return neTree[mid + branchCount];
            }
        }
    
        return -1;
    }
    
    //Tokenizer
    class Tokenizer {
        constructor() {
            this.preprocessor = new Preprocessor();
    
            this.tokenQueue = [];
    
            this.allowCDATA = false;
    
            this.state = DATA_STATE;
            this.returnState = '';
    
            this.charRefCode = -1;
            this.tempBuff = [];
            this.lastStartTagName = '';
    
            this.consumedAfterSnapshot = -1;
            this.active = false;
    
            this.currentCharacterToken = null;
            this.currentToken = null;
            this.currentAttr = null;
        }
    
        //Errors
        _err() {
            // NOTE: err reporting is noop by default. Enabled by mixin.
        }
    
        _errOnNextCodePoint(err) {
            this._consume();
            this._err(err);
            this._unconsume();
        }
    
        //API
        getNextToken() {
            while (!this.tokenQueue.length && this.active) {
                this.consumedAfterSnapshot = 0;
    
                const cp = this._consume();
    
                if (!this._ensureHibernation()) {
                    this[this.state](cp);
                }
            }
    
            return this.tokenQueue.shift();
        }
    
        write(chunk, isLastChunk) {
            this.active = true;
            this.preprocessor.write(chunk, isLastChunk);
        }
    
        insertHtmlAtCurrentPos(chunk) {
            this.active = true;
            this.preprocessor.insertHtmlAtCurrentPos(chunk);
        }
    
        //Hibernation
        _ensureHibernation() {
            if (this.preprocessor.endOfChunkHit) {
                for (; this.consumedAfterSnapshot > 0; this.consumedAfterSnapshot--) {
                    this.preprocessor.retreat();
                }
    
                this.active = false;
                this.tokenQueue.push({ type: Tokenizer.HIBERNATION_TOKEN });
    
                return true;
            }
    
            return false;
        }
    
        //Consumption
        _consume() {
            this.consumedAfterSnapshot++;
            return this.preprocessor.advance();
        }
    
        _unconsume() {
            this.consumedAfterSnapshot--;
            this.preprocessor.retreat();
        }
    
        _reconsumeInState(state) {
            this.state = state;
            this._unconsume();
        }
    
        _consumeSequenceIfMatch(pattern, startCp, caseSensitive) {
            let consumedCount = 0;
            let isMatch = true;
            const patternLength = pattern.length;
            let patternPos = 0;
            let cp = startCp;
            let patternCp = void 0;
    
            for (; patternPos < patternLength; patternPos++) {
                if (patternPos > 0) {
                    cp = this._consume();
                    consumedCount++;
                }
    
                if (cp === $.EOF) {
                    isMatch = false;
                    break;
                }
    
                patternCp = pattern[patternPos];
    
                if (cp !== patternCp && (caseSensitive || cp !== toAsciiLowerCodePoint(patternCp))) {
                    isMatch = false;
                    break;
                }
            }
    
            if (!isMatch) {
                while (consumedCount--) {
                    this._unconsume();
                }
            }
    
            return isMatch;
        }
    
        //Temp buffer
        _isTempBufferEqualToScriptString() {
            if (this.tempBuff.length !== $$.SCRIPT_STRING.length) {
                return false;
            }
    
            for (let i = 0; i < this.tempBuff.length; i++) {
                if (this.tempBuff[i] !== $$.SCRIPT_STRING[i]) {
                    return false;
                }
            }
    
            return true;
        }
    
        //Token creation
        _createStartTagToken() {
            this.currentToken = {
                type: Tokenizer.START_TAG_TOKEN,
                tagName: '',
                selfClosing: false,
                ackSelfClosing: false,
                attrs: []
            };
        }
    
        _createEndTagToken() {
            this.currentToken = {
                type: Tokenizer.END_TAG_TOKEN,
                tagName: '',
                selfClosing: false,
                attrs: []
            };
        }
    
        _createCommentToken() {
            this.currentToken = {
                type: Tokenizer.COMMENT_TOKEN,
                data: ''
            };
        }
    
        _createDoctypeToken(initialName) {
            this.currentToken = {
                type: Tokenizer.DOCTYPE_TOKEN,
                name: initialName,
                forceQuirks: false,
                publicId: null,
                systemId: null
            };
        }
    
        _createCharacterToken(type, ch) {
            this.currentCharacterToken = {
                type: type,
                chars: ch
            };
        }
    
        _createEOFToken() {
            this.currentToken = { type: Tokenizer.EOF_TOKEN };
        }
    
        //Tag attributes
        _createAttr(attrNameFirstCh) {
            this.currentAttr = {
                name: attrNameFirstCh,
                value: ''
            };
        }
    
        _leaveAttrName(toState) {
            if (Tokenizer.getTokenAttr(this.currentToken, this.currentAttr.name) === null) {
                this.currentToken.attrs.push(this.currentAttr);
            } else {
                this._err(ERR.duplicateAttribute);
            }
    
            this.state = toState;
        }
    
        _leaveAttrValue(toState) {
            this.state = toState;
        }
    
        //Token emission
        _emitCurrentToken() {
            this._emitCurrentCharacterToken();
    
            const ct = this.currentToken;
    
            this.currentToken = null;
    
            //NOTE: store emited start tag's tagName to determine is the following end tag token is appropriate.
            if (ct.type === Tokenizer.START_TAG_TOKEN) {
                this.lastStartTagName = ct.tagName;
            } else if (ct.type === Tokenizer.END_TAG_TOKEN) {
                if (ct.attrs.length > 0) {
                    this._err(ERR.endTagWithAttributes);
                }
    
                if (ct.selfClosing) {
                    this._err(ERR.endTagWithTrailingSolidus);
                }
            }
    
            this.tokenQueue.push(ct);
        }
    
        _emitCurrentCharacterToken() {
            if (this.currentCharacterToken) {
                this.tokenQueue.push(this.currentCharacterToken);
                this.currentCharacterToken = null;
            }
        }
    
        _emitEOFToken() {
            this._createEOFToken();
            this._emitCurrentToken();
        }
    
        //Characters emission
    
        //OPTIMIZATION: specification uses only one type of character tokens (one token per character).
        //This causes a huge memory overhead and a lot of unnecessary parser loops. parse5 uses 3 groups of characters.
        //If we have a sequence of characters that belong to the same group, parser can process it
        //as a single solid character token.
        //So, there are 3 types of character tokens in parse5:
        //1)NULL_CHARACTER_TOKEN - \u0000-character sequences (e.g. '\u0000\u0000\u0000')
        //2)WHITESPACE_CHARACTER_TOKEN - any whitespace/new-line character sequences (e.g. '\n  \r\t   \f')
        //3)CHARACTER_TOKEN - any character sequence which don't belong to groups 1 and 2 (e.g. 'abcdef1234@@#$%^')
        _appendCharToCurrentCharacterToken(type, ch) {
            if (this.currentCharacterToken && this.currentCharacterToken.type !== type) {
                this._emitCurrentCharacterToken();
            }
    
            if (this.currentCharacterToken) {
                this.currentCharacterToken.chars += ch;
            } else {
                this._createCharacterToken(type, ch);
            }
        }
    
        _emitCodePoint(cp) {
            let type = Tokenizer.CHARACTER_TOKEN;
    
            if (isWhitespace(cp)) {
                type = Tokenizer.WHITESPACE_CHARACTER_TOKEN;
            } else if (cp === $.NULL) {
                type = Tokenizer.NULL_CHARACTER_TOKEN;
            }
    
            this._appendCharToCurrentCharacterToken(type, toChar(cp));
        }
    
        _emitSeveralCodePoints(codePoints) {
            for (let i = 0; i < codePoints.length; i++) {
                this._emitCodePoint(codePoints[i]);
            }
        }
    
        //NOTE: used then we emit character explicitly. This is always a non-whitespace and a non-null character.
        //So we can avoid additional checks here.
        _emitChars(ch) {
            this._appendCharToCurrentCharacterToken(Tokenizer.CHARACTER_TOKEN, ch);
        }
    
        // Character reference helpers
        _matchNamedCharacterReference(startCp) {
            let result = null;
            let excess = 1;
            let i = findNamedEntityTreeBranch(0, startCp);
    
            this.tempBuff.push(startCp);
    
            while (i > -1) {
                const current = neTree[i];
                const inNode = current < MAX_BRANCH_MARKER_VALUE;
                const nodeWithData = inNode && current & HAS_DATA_FLAG;
    
                if (nodeWithData) {
                    //NOTE: we use greedy search, so we continue lookup at this point
                    result = current & DATA_DUPLET_FLAG ? [neTree[++i], neTree[++i]] : [neTree[++i]];
                    excess = 0;
                }
    
                const cp = this._consume();
    
                this.tempBuff.push(cp);
                excess++;
    
                if (cp === $.EOF) {
                    break;
                }
    
                if (inNode) {
                    i = current & HAS_BRANCHES_FLAG ? findNamedEntityTreeBranch(i, cp) : -1;
                } else {
                    i = cp === current ? ++i : -1;
                }
            }
    
            while (excess--) {
                this.tempBuff.pop();
                this._unconsume();
            }
    
            return result;
        }
    
        _isCharacterReferenceInAttribute() {
            return (
                this.returnState === ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE ||
                this.returnState === ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE ||
                this.returnState === ATTRIBUTE_VALUE_UNQUOTED_STATE
            );
        }
    
        _isCharacterReferenceAttributeQuirk(withSemicolon) {
            if (!withSemicolon && this._isCharacterReferenceInAttribute()) {
                const nextCp = this._consume();
    
                this._unconsume();
    
                return nextCp === $.EQUALS_SIGN || isAsciiAlphaNumeric(nextCp);
            }
    
            return false;
        }
    
        _flushCodePointsConsumedAsCharacterReference() {
            if (this._isCharacterReferenceInAttribute()) {
                for (let i = 0; i < this.tempBuff.length; i++) {
                    this.currentAttr.value += toChar(this.tempBuff[i]);
                }
            } else {
                this._emitSeveralCodePoints(this.tempBuff);
            }
    
            this.tempBuff = [];
        }
    
        // State machine
    
        // Data state
        //------------------------------------------------------------------
        [DATA_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.LESS_THAN_SIGN) {
                this.state = TAG_OPEN_STATE;
            } else if (cp === $.AMPERSAND) {
                this.returnState = DATA_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitCodePoint(cp);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        //  RCDATA state
        //------------------------------------------------------------------
        [RCDATA_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.AMPERSAND) {
                this.returnState = RCDATA_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = RCDATA_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // RAWTEXT state
        //------------------------------------------------------------------
        [RAWTEXT_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.LESS_THAN_SIGN) {
                this.state = RAWTEXT_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Script data state
        //------------------------------------------------------------------
        [SCRIPT_DATA_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // PLAINTEXT state
        //------------------------------------------------------------------
        [PLAINTEXT_STATE](cp) {
            this.preprocessor.dropParsedChunk();
    
            if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Tag open state
        //------------------------------------------------------------------
        [TAG_OPEN_STATE](cp) {
            if (cp === $.EXCLAMATION_MARK) {
                this.state = MARKUP_DECLARATION_OPEN_STATE;
            } else if (cp === $.SOLIDUS) {
                this.state = END_TAG_OPEN_STATE;
            } else if (isAsciiLetter(cp)) {
                this._createStartTagToken();
                this._reconsumeInState(TAG_NAME_STATE);
            } else if (cp === $.QUESTION_MARK) {
                this._err(ERR.unexpectedQuestionMarkInsteadOfTagName);
                this._createCommentToken();
                this._reconsumeInState(BOGUS_COMMENT_STATE);
            } else if (cp === $.EOF) {
                this._err(ERR.eofBeforeTagName);
                this._emitChars('<');
                this._emitEOFToken();
            } else {
                this._err(ERR.invalidFirstCharacterOfTagName);
                this._emitChars('<');
                this._reconsumeInState(DATA_STATE);
            }
        }
    
        // End tag open state
        //------------------------------------------------------------------
        [END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(TAG_NAME_STATE);
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingEndTagName);
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofBeforeTagName);
                this._emitChars('</');
                this._emitEOFToken();
            } else {
                this._err(ERR.invalidFirstCharacterOfTagName);
                this._createCommentToken();
                this._reconsumeInState(BOGUS_COMMENT_STATE);
            }
        }
    
        // Tag name state
        //------------------------------------------------------------------
        [TAG_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_ATTRIBUTE_NAME_STATE;
            } else if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.tagName += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentToken.tagName += toChar(cp);
            }
        }
    
        // RCDATA less-than sign state
        //------------------------------------------------------------------
        [RCDATA_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = RCDATA_END_TAG_OPEN_STATE;
            } else {
                this._emitChars('<');
                this._reconsumeInState(RCDATA_STATE);
            }
        }
    
        // RCDATA end tag open state
        //------------------------------------------------------------------
        [RCDATA_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(RCDATA_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(RCDATA_STATE);
            }
        }
    
        // RCDATA end tag name state
        //------------------------------------------------------------------
        [RCDATA_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    }
    
                    if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    }
    
                    if (cp === $.GREATER_THAN_SIGN) {
                        this.state = DATA_STATE;
                        this._emitCurrentToken();
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(RCDATA_STATE);
            }
        }
    
        // RAWTEXT less-than sign state
        //------------------------------------------------------------------
        [RAWTEXT_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = RAWTEXT_END_TAG_OPEN_STATE;
            } else {
                this._emitChars('<');
                this._reconsumeInState(RAWTEXT_STATE);
            }
        }
    
        // RAWTEXT end tag open state
        //------------------------------------------------------------------
        [RAWTEXT_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(RAWTEXT_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(RAWTEXT_STATE);
            }
        }
    
        // RAWTEXT end tag name state
        //------------------------------------------------------------------
        [RAWTEXT_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    }
    
                    if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    }
    
                    if (cp === $.GREATER_THAN_SIGN) {
                        this._emitCurrentToken();
                        this.state = DATA_STATE;
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(RAWTEXT_STATE);
            }
        }
    
        // Script data less-than sign state
        //------------------------------------------------------------------
        [SCRIPT_DATA_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = SCRIPT_DATA_END_TAG_OPEN_STATE;
            } else if (cp === $.EXCLAMATION_MARK) {
                this.state = SCRIPT_DATA_ESCAPE_START_STATE;
                this._emitChars('<!');
            } else {
                this._emitChars('<');
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data end tag open state
        //------------------------------------------------------------------
        [SCRIPT_DATA_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(SCRIPT_DATA_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data end tag name state
        //------------------------------------------------------------------
        [SCRIPT_DATA_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    } else if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    } else if (cp === $.GREATER_THAN_SIGN) {
                        this._emitCurrentToken();
                        this.state = DATA_STATE;
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data escape start state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPE_START_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPE_START_DASH_STATE;
                this._emitChars('-');
            } else {
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data escape start dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPE_START_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPED_DASH_DASH_STATE;
                this._emitChars('-');
            } else {
                this._reconsumeInState(SCRIPT_DATA_STATE);
            }
        }
    
        // Script data escaped state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPED_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Script data escaped dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_ESCAPED_DASH_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data escaped dash dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_DASH_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = SCRIPT_DATA_STATE;
                this._emitChars('>');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data escaped less-than sign state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE;
            } else if (isAsciiLetter(cp)) {
                this.tempBuff = [];
                this._emitChars('<');
                this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE);
            } else {
                this._emitChars('<');
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data escaped end tag open state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_END_TAG_OPEN_STATE](cp) {
            if (isAsciiLetter(cp)) {
                this._createEndTagToken();
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE);
            } else {
                this._emitChars('</');
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data escaped end tag name state
        //------------------------------------------------------------------
        [SCRIPT_DATA_ESCAPED_END_TAG_NAME_STATE](cp) {
            if (isAsciiUpper(cp)) {
                this.currentToken.tagName += toAsciiLowerChar(cp);
                this.tempBuff.push(cp);
            } else if (isAsciiLower(cp)) {
                this.currentToken.tagName += toChar(cp);
                this.tempBuff.push(cp);
            } else {
                if (this.lastStartTagName === this.currentToken.tagName) {
                    if (isWhitespace(cp)) {
                        this.state = BEFORE_ATTRIBUTE_NAME_STATE;
                        return;
                    }
    
                    if (cp === $.SOLIDUS) {
                        this.state = SELF_CLOSING_START_TAG_STATE;
                        return;
                    }
    
                    if (cp === $.GREATER_THAN_SIGN) {
                        this._emitCurrentToken();
                        this.state = DATA_STATE;
                        return;
                    }
                }
    
                this._emitChars('</');
                this._emitSeveralCodePoints(this.tempBuff);
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data double escape start state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPE_START_STATE](cp) {
            if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN) {
                this.state = this._isTempBufferEqualToScriptString()
                    ? SCRIPT_DATA_DOUBLE_ESCAPED_STATE
                    : SCRIPT_DATA_ESCAPED_STATE;
                this._emitCodePoint(cp);
            } else if (isAsciiUpper(cp)) {
                this.tempBuff.push(toAsciiLowerCodePoint(cp));
                this._emitCodePoint(cp);
            } else if (isAsciiLower(cp)) {
                this.tempBuff.push(cp);
                this._emitCodePoint(cp);
            } else {
                this._reconsumeInState(SCRIPT_DATA_ESCAPED_STATE);
            }
        }
    
        // Script data double escaped state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
                this._emitChars('<');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // Script data double escaped dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE;
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
                this._emitChars('<');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data double escaped dash dash state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this._emitChars('-');
            } else if (cp === $.LESS_THAN_SIGN) {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE;
                this._emitChars('<');
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = SCRIPT_DATA_STATE;
                this._emitChars('>');
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitChars(unicode.REPLACEMENT_CHARACTER);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInScriptHtmlCommentLikeText);
                this._emitEOFToken();
            } else {
                this.state = SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
                this._emitCodePoint(cp);
            }
        }
    
        // Script data double escaped less-than sign state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.SOLIDUS) {
                this.tempBuff = [];
                this.state = SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE;
                this._emitChars('/');
            } else {
                this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE);
            }
        }
    
        // Script data double escape end state
        //------------------------------------------------------------------
        [SCRIPT_DATA_DOUBLE_ESCAPE_END_STATE](cp) {
            if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN) {
                this.state = this._isTempBufferEqualToScriptString()
                    ? SCRIPT_DATA_ESCAPED_STATE
                    : SCRIPT_DATA_DOUBLE_ESCAPED_STATE;
    
                this._emitCodePoint(cp);
            } else if (isAsciiUpper(cp)) {
                this.tempBuff.push(toAsciiLowerCodePoint(cp));
                this._emitCodePoint(cp);
            } else if (isAsciiLower(cp)) {
                this.tempBuff.push(cp);
                this._emitCodePoint(cp);
            } else {
                this._reconsumeInState(SCRIPT_DATA_DOUBLE_ESCAPED_STATE);
            }
        }
    
        // Before attribute name state
        //------------------------------------------------------------------
        [BEFORE_ATTRIBUTE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN || cp === $.EOF) {
                this._reconsumeInState(AFTER_ATTRIBUTE_NAME_STATE);
            } else if (cp === $.EQUALS_SIGN) {
                this._err(ERR.unexpectedEqualsSignBeforeAttributeName);
                this._createAttr('=');
                this.state = ATTRIBUTE_NAME_STATE;
            } else {
                this._createAttr('');
                this._reconsumeInState(ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Attribute name state
        //------------------------------------------------------------------
        [ATTRIBUTE_NAME_STATE](cp) {
            if (isWhitespace(cp) || cp === $.SOLIDUS || cp === $.GREATER_THAN_SIGN || cp === $.EOF) {
                this._leaveAttrName(AFTER_ATTRIBUTE_NAME_STATE);
                this._unconsume();
            } else if (cp === $.EQUALS_SIGN) {
                this._leaveAttrName(BEFORE_ATTRIBUTE_VALUE_STATE);
            } else if (isAsciiUpper(cp)) {
                this.currentAttr.name += toAsciiLowerChar(cp);
            } else if (cp === $.QUOTATION_MARK || cp === $.APOSTROPHE || cp === $.LESS_THAN_SIGN) {
                this._err(ERR.unexpectedCharacterInAttributeName);
                this.currentAttr.name += toChar(cp);
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.name += unicode.REPLACEMENT_CHARACTER;
            } else {
                this.currentAttr.name += toChar(cp);
            }
        }
    
        // After attribute name state
        //------------------------------------------------------------------
        [AFTER_ATTRIBUTE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.SOLIDUS) {
                this.state = SELF_CLOSING_START_TAG_STATE;
            } else if (cp === $.EQUALS_SIGN) {
                this.state = BEFORE_ATTRIBUTE_VALUE_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this._createAttr('');
                this._reconsumeInState(ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Before attribute value state
        //------------------------------------------------------------------
        [BEFORE_ATTRIBUTE_VALUE_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.QUOTATION_MARK) {
                this.state = ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.state = ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingAttributeValue);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else {
                this._reconsumeInState(ATTRIBUTE_VALUE_UNQUOTED_STATE);
            }
        }
    
        // Attribute value (double-quoted) state
        //------------------------------------------------------------------
        [ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE](cp) {
            if (cp === $.QUOTATION_MARK) {
                this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
            } else if (cp === $.AMPERSAND) {
                this.returnState = ATTRIBUTE_VALUE_DOUBLE_QUOTED_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.value += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentAttr.value += toChar(cp);
            }
        }
    
        // Attribute value (single-quoted) state
        //------------------------------------------------------------------
        [ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE](cp) {
            if (cp === $.APOSTROPHE) {
                this.state = AFTER_ATTRIBUTE_VALUE_QUOTED_STATE;
            } else if (cp === $.AMPERSAND) {
                this.returnState = ATTRIBUTE_VALUE_SINGLE_QUOTED_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.value += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentAttr.value += toChar(cp);
            }
        }
    
        // Attribute value (unquoted) state
        //------------------------------------------------------------------
        [ATTRIBUTE_VALUE_UNQUOTED_STATE](cp) {
            if (isWhitespace(cp)) {
                this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE);
            } else if (cp === $.AMPERSAND) {
                this.returnState = ATTRIBUTE_VALUE_UNQUOTED_STATE;
                this.state = CHARACTER_REFERENCE_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._leaveAttrValue(DATA_STATE);
                this._emitCurrentToken();
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentAttr.value += unicode.REPLACEMENT_CHARACTER;
            } else if (
                cp === $.QUOTATION_MARK ||
                cp === $.APOSTROPHE ||
                cp === $.LESS_THAN_SIGN ||
                cp === $.EQUALS_SIGN ||
                cp === $.GRAVE_ACCENT
            ) {
                this._err(ERR.unexpectedCharacterInUnquotedAttributeValue);
                this.currentAttr.value += toChar(cp);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this.currentAttr.value += toChar(cp);
            }
        }
    
        // After attribute value (quoted) state
        //------------------------------------------------------------------
        [AFTER_ATTRIBUTE_VALUE_QUOTED_STATE](cp) {
            if (isWhitespace(cp)) {
                this._leaveAttrValue(BEFORE_ATTRIBUTE_NAME_STATE);
            } else if (cp === $.SOLIDUS) {
                this._leaveAttrValue(SELF_CLOSING_START_TAG_STATE);
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._leaveAttrValue(DATA_STATE);
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this._err(ERR.missingWhitespaceBetweenAttributes);
                this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Self-closing start tag state
        //------------------------------------------------------------------
        [SELF_CLOSING_START_TAG_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.currentToken.selfClosing = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInTag);
                this._emitEOFToken();
            } else {
                this._err(ERR.unexpectedSolidusInTag);
                this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
            }
        }
    
        // Bogus comment state
        //------------------------------------------------------------------
        [BOGUS_COMMENT_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._emitCurrentToken();
                this._emitEOFToken();
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.data += unicode.REPLACEMENT_CHARACTER;
            } else {
                this.currentToken.data += toChar(cp);
            }
        }
    
        // Markup declaration open state
        //------------------------------------------------------------------
        [MARKUP_DECLARATION_OPEN_STATE](cp) {
            if (this._consumeSequenceIfMatch($$.DASH_DASH_STRING, cp, true)) {
                this._createCommentToken();
                this.state = COMMENT_START_STATE;
            } else if (this._consumeSequenceIfMatch($$.DOCTYPE_STRING, cp, false)) {
                this.state = DOCTYPE_STATE;
            } else if (this._consumeSequenceIfMatch($$.CDATA_START_STRING, cp, true)) {
                if (this.allowCDATA) {
                    this.state = CDATA_SECTION_STATE;
                } else {
                    this._err(ERR.cdataInHtmlContent);
                    this._createCommentToken();
                    this.currentToken.data = '[CDATA[';
                    this.state = BOGUS_COMMENT_STATE;
                }
            }
    
            //NOTE: sequence lookup can be abrupted by hibernation. In that case lookup
            //results are no longer valid and we will need to start over.
            else if (!this._ensureHibernation()) {
                this._err(ERR.incorrectlyOpenedComment);
                this._createCommentToken();
                this._reconsumeInState(BOGUS_COMMENT_STATE);
            }
        }
    
        // Comment start state
        //------------------------------------------------------------------
        [COMMENT_START_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_START_DASH_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptClosingOfEmptyComment);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else {
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment start dash state
        //------------------------------------------------------------------
        [COMMENT_START_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_END_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptClosingOfEmptyComment);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '-';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment state
        //------------------------------------------------------------------
        [COMMENT_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_END_DASH_STATE;
            } else if (cp === $.LESS_THAN_SIGN) {
                this.currentToken.data += '<';
                this.state = COMMENT_LESS_THAN_SIGN_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.data += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += toChar(cp);
            }
        }
    
        // Comment less-than sign state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_STATE](cp) {
            if (cp === $.EXCLAMATION_MARK) {
                this.currentToken.data += '!';
                this.state = COMMENT_LESS_THAN_SIGN_BANG_STATE;
            } else if (cp === $.LESS_THAN_SIGN) {
                this.currentToken.data += '!';
            } else {
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment less-than sign bang state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_BANG_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE;
            } else {
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment less-than sign bang dash state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_BANG_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE;
            } else {
                this._reconsumeInState(COMMENT_END_DASH_STATE);
            }
        }
    
        // Comment less-than sign bang dash dash state
        //------------------------------------------------------------------
        [COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH_STATE](cp) {
            if (cp !== $.GREATER_THAN_SIGN && cp !== $.EOF) {
                this._err(ERR.nestedComment);
            }
    
            this._reconsumeInState(COMMENT_END_STATE);
        }
    
        // Comment end dash state
        //------------------------------------------------------------------
        [COMMENT_END_DASH_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.state = COMMENT_END_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '-';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment end state
        //------------------------------------------------------------------
        [COMMENT_END_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EXCLAMATION_MARK) {
                this.state = COMMENT_END_BANG_STATE;
            } else if (cp === $.HYPHEN_MINUS) {
                this.currentToken.data += '-';
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '--';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // Comment end bang state
        //------------------------------------------------------------------
        [COMMENT_END_BANG_STATE](cp) {
            if (cp === $.HYPHEN_MINUS) {
                this.currentToken.data += '--!';
                this.state = COMMENT_END_DASH_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.incorrectlyClosedComment);
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInComment);
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.data += '--!';
                this._reconsumeInState(COMMENT_STATE);
            }
        }
    
        // DOCTYPE state
        //------------------------------------------------------------------
        [DOCTYPE_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_DOCTYPE_NAME_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._reconsumeInState(BEFORE_DOCTYPE_NAME_STATE);
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this._createDoctypeToken(null);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingWhitespaceBeforeDoctypeName);
                this._reconsumeInState(BEFORE_DOCTYPE_NAME_STATE);
            }
        }
    
        // Before DOCTYPE name state
        //------------------------------------------------------------------
        [BEFORE_DOCTYPE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (isAsciiUpper(cp)) {
                this._createDoctypeToken(toAsciiLowerChar(cp));
                this.state = DOCTYPE_NAME_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this._createDoctypeToken(unicode.REPLACEMENT_CHARACTER);
                this.state = DOCTYPE_NAME_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypeName);
                this._createDoctypeToken(null);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this._createDoctypeToken(null);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._createDoctypeToken(toChar(cp));
                this.state = DOCTYPE_NAME_STATE;
            }
        }
    
        // DOCTYPE name state
        //------------------------------------------------------------------
        [DOCTYPE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = AFTER_DOCTYPE_NAME_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (isAsciiUpper(cp)) {
                this.currentToken.name += toAsciiLowerChar(cp);
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.name += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.name += toChar(cp);
            }
        }
    
        // After DOCTYPE name state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_NAME_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else if (this._consumeSequenceIfMatch($$.PUBLIC_STRING, cp, false)) {
                this.state = AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE;
            } else if (this._consumeSequenceIfMatch($$.SYSTEM_STRING, cp, false)) {
                this.state = AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE;
            }
            //NOTE: sequence lookup can be abrupted by hibernation. In that case lookup
            //results are no longer valid and we will need to start over.
            else if (!this._ensureHibernation()) {
                this._err(ERR.invalidCharacterSequenceAfterDoctypeName);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // After DOCTYPE public keyword state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_PUBLIC_KEYWORD_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE;
            } else if (cp === $.QUOTATION_MARK) {
                this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this._err(ERR.missingWhitespaceAfterDoctypePublicKeyword);
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Before DOCTYPE public identifier state
        //------------------------------------------------------------------
        [BEFORE_DOCTYPE_PUBLIC_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.QUOTATION_MARK) {
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.currentToken.publicId = '';
                this.state = DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // DOCTYPE public identifier (double-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED_STATE](cp) {
            if (cp === $.QUOTATION_MARK) {
                this.state = AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.publicId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.publicId += toChar(cp);
            }
        }
    
        // DOCTYPE public identifier (single-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED_STATE](cp) {
            if (cp === $.APOSTROPHE) {
                this.state = AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.publicId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypePublicIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.publicId += toChar(cp);
            }
        }
    
        // After DOCTYPE public identifier state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_PUBLIC_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.QUOTATION_MARK) {
                this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this._err(ERR.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Between DOCTYPE public and system identifiers state
        //------------------------------------------------------------------
        [BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.QUOTATION_MARK) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // After DOCTYPE system keyword state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_SYSTEM_KEYWORD_STATE](cp) {
            if (isWhitespace(cp)) {
                this.state = BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
            } else if (cp === $.QUOTATION_MARK) {
                this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this._err(ERR.missingWhitespaceAfterDoctypeSystemKeyword);
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Before DOCTYPE system identifier state
        //------------------------------------------------------------------
        [BEFORE_DOCTYPE_SYSTEM_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.QUOTATION_MARK) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE;
            } else if (cp === $.APOSTROPHE) {
                this.currentToken.systemId = '';
                this.state = DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.missingDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this.state = DATA_STATE;
                this._emitCurrentToken();
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.missingQuoteBeforeDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // DOCTYPE system identifier (double-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED_STATE](cp) {
            if (cp === $.QUOTATION_MARK) {
                this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.systemId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.systemId += toChar(cp);
            }
        }
    
        // DOCTYPE system identifier (single-quoted) state
        //------------------------------------------------------------------
        [DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED_STATE](cp) {
            if (cp === $.APOSTROPHE) {
                this.state = AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
                this.currentToken.systemId += unicode.REPLACEMENT_CHARACTER;
            } else if (cp === $.GREATER_THAN_SIGN) {
                this._err(ERR.abruptDoctypeSystemIdentifier);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this.currentToken.systemId += toChar(cp);
            }
        }
    
        // After DOCTYPE system identifier state
        //------------------------------------------------------------------
        [AFTER_DOCTYPE_SYSTEM_IDENTIFIER_STATE](cp) {
            if (isWhitespace(cp)) {
                return;
            }
    
            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInDoctype);
                this.currentToken.forceQuirks = true;
                this._emitCurrentToken();
                this._emitEOFToken();
            } else {
                this._err(ERR.unexpectedCharacterAfterDoctypeSystemIdentifier);
                this._reconsumeInState(BOGUS_DOCTYPE_STATE);
            }
        }
    
        // Bogus DOCTYPE state
        //------------------------------------------------------------------
        [BOGUS_DOCTYPE_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this._emitCurrentToken();
                this.state = DATA_STATE;
            } else if (cp === $.NULL) {
                this._err(ERR.unexpectedNullCharacter);
            } else if (cp === $.EOF) {
                this._emitCurrentToken();
                this._emitEOFToken();
            }
        }
    
        // CDATA section state
        //------------------------------------------------------------------
        [CDATA_SECTION_STATE](cp) {
            if (cp === $.RIGHT_SQUARE_BRACKET) {
                this.state = CDATA_SECTION_BRACKET_STATE;
            } else if (cp === $.EOF) {
                this._err(ERR.eofInCdata);
                this._emitEOFToken();
            } else {
                this._emitCodePoint(cp);
            }
        }
    
        // CDATA section bracket state
        //------------------------------------------------------------------
        [CDATA_SECTION_BRACKET_STATE](cp) {
            if (cp === $.RIGHT_SQUARE_BRACKET) {
                this.state = CDATA_SECTION_END_STATE;
            } else {
                this._emitChars(']');
                this._reconsumeInState(CDATA_SECTION_STATE);
            }
        }
    
        // CDATA section end state
        //------------------------------------------------------------------
        [CDATA_SECTION_END_STATE](cp) {
            if (cp === $.GREATER_THAN_SIGN) {
                this.state = DATA_STATE;
            } else if (cp === $.RIGHT_SQUARE_BRACKET) {
                this._emitChars(']');
            } else {
                this._emitChars(']]');
                this._reconsumeInState(CDATA_SECTION_STATE);
            }
        }
    
        // Character reference state
        //------------------------------------------------------------------
        [CHARACTER_REFERENCE_STATE](cp) {
            this.tempBuff = [$.AMPERSAND];
    
            if (cp === $.NUMBER_SIGN) {
                this.tempBuff.push(cp);
                this.state = NUMERIC_CHARACTER_REFERENCE_STATE;
            } else if (isAsciiAlphaNumeric(cp)) {
                this._reconsumeInState(NAMED_CHARACTER_REFERENCE_STATE);
            } else {
                this._flushCodePointsConsumedAsCharacterReference();
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Named character reference state
        //------------------------------------------------------------------
        [NAMED_CHARACTER_REFERENCE_STATE](cp) {
            const matchResult = this._matchNamedCharacterReference(cp);
    
            //NOTE: matching can be abrupted by hibernation. In that case match
            //results are no longer valid and we will need to start over.
            if (this._ensureHibernation()) {
                this.tempBuff = [$.AMPERSAND];
            } else if (matchResult) {
                const withSemicolon = this.tempBuff[this.tempBuff.length - 1] === $.SEMICOLON;
    
                if (!this._isCharacterReferenceAttributeQuirk(withSemicolon)) {
                    if (!withSemicolon) {
                        this._errOnNextCodePoint(ERR.missingSemicolonAfterCharacterReference);
                    }
    
                    this.tempBuff = matchResult;
                }
    
                this._flushCodePointsConsumedAsCharacterReference();
                this.state = this.returnState;
            } else {
                this._flushCodePointsConsumedAsCharacterReference();
                this.state = AMBIGUOUS_AMPERSAND_STATE;
            }
        }
    
        // Ambiguos ampersand state
        //------------------------------------------------------------------
        [AMBIGUOUS_AMPERSAND_STATE](cp) {
            if (isAsciiAlphaNumeric(cp)) {
                if (this._isCharacterReferenceInAttribute()) {
                    this.currentAttr.value += toChar(cp);
                } else {
                    this._emitCodePoint(cp);
                }
            } else {
                if (cp === $.SEMICOLON) {
                    this._err(ERR.unknownNamedCharacterReference);
                }
    
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Numeric character reference state
        //------------------------------------------------------------------
        [NUMERIC_CHARACTER_REFERENCE_STATE](cp) {
            this.charRefCode = 0;
    
            if (cp === $.LATIN_SMALL_X || cp === $.LATIN_CAPITAL_X) {
                this.tempBuff.push(cp);
                this.state = HEXADEMICAL_CHARACTER_REFERENCE_START_STATE;
            } else {
                this._reconsumeInState(DECIMAL_CHARACTER_REFERENCE_START_STATE);
            }
        }
    
        // Hexademical character reference start state
        //------------------------------------------------------------------
        [HEXADEMICAL_CHARACTER_REFERENCE_START_STATE](cp) {
            if (isAsciiHexDigit(cp)) {
                this._reconsumeInState(HEXADEMICAL_CHARACTER_REFERENCE_STATE);
            } else {
                this._err(ERR.absenceOfDigitsInNumericCharacterReference);
                this._flushCodePointsConsumedAsCharacterReference();
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Decimal character reference start state
        //------------------------------------------------------------------
        [DECIMAL_CHARACTER_REFERENCE_START_STATE](cp) {
            if (isAsciiDigit(cp)) {
                this._reconsumeInState(DECIMAL_CHARACTER_REFERENCE_STATE);
            } else {
                this._err(ERR.absenceOfDigitsInNumericCharacterReference);
                this._flushCodePointsConsumedAsCharacterReference();
                this._reconsumeInState(this.returnState);
            }
        }
    
        // Hexademical character reference state
        //------------------------------------------------------------------
        [HEXADEMICAL_CHARACTER_REFERENCE_STATE](cp) {
            if (isAsciiUpperHexDigit(cp)) {
                this.charRefCode = this.charRefCode * 16 + cp - 0x37;
            } else if (isAsciiLowerHexDigit(cp)) {
                this.charRefCode = this.charRefCode * 16 + cp - 0x57;
            } else if (isAsciiDigit(cp)) {
                this.charRefCode = this.charRefCode * 16 + cp - 0x30;
            } else if (cp === $.SEMICOLON) {
                this.state = NUMERIC_CHARACTER_REFERENCE_END_STATE;
            } else {
                this._err(ERR.missingSemicolonAfterCharacterReference);
                this._reconsumeInState(NUMERIC_CHARACTER_REFERENCE_END_STATE);
            }
        }
    
        // Decimal character reference state
        //------------------------------------------------------------------
        [DECIMAL_CHARACTER_REFERENCE_STATE](cp) {
            if (isAsciiDigit(cp)) {
                this.charRefCode = this.charRefCode * 10 + cp - 0x30;
            } else if (cp === $.SEMICOLON) {
                this.state = NUMERIC_CHARACTER_REFERENCE_END_STATE;
            } else {
                this._err(ERR.missingSemicolonAfterCharacterReference);
                this._reconsumeInState(NUMERIC_CHARACTER_REFERENCE_END_STATE);
            }
        }
    
        // Numeric character reference end state
        //------------------------------------------------------------------
        [NUMERIC_CHARACTER_REFERENCE_END_STATE]() {
            if (this.charRefCode === $.NULL) {
                this._err(ERR.nullCharacterReference);
                this.charRefCode = $.REPLACEMENT_CHARACTER;
            } else if (this.charRefCode > 0x10ffff) {
                this._err(ERR.characterReferenceOutsideUnicodeRange);
                this.charRefCode = $.REPLACEMENT_CHARACTER;
            } else if (unicode.isSurrogate(this.charRefCode)) {
                this._err(ERR.surrogateCharacterReference);
                this.charRefCode = $.REPLACEMENT_CHARACTER;
            } else if (unicode.isUndefinedCodePoint(this.charRefCode)) {
                this._err(ERR.noncharacterCharacterReference);
            } else if (unicode.isControlCodePoint(this.charRefCode) || this.charRefCode === $.CARRIAGE_RETURN) {
                this._err(ERR.controlCharacterReference);
    
                const replacement = C1_CONTROLS_REFERENCE_REPLACEMENTS[this.charRefCode];
    
                if (replacement) {
                    this.charRefCode = replacement;
                }
            }
    
            this.tempBuff = [this.charRefCode];
    
            this._flushCodePointsConsumedAsCharacterReference();
            this._reconsumeInState(this.returnState);
        }
    }
    
    //Token types
    Tokenizer.CHARACTER_TOKEN = 'CHARACTER_TOKEN';
    Tokenizer.NULL_CHARACTER_TOKEN = 'NULL_CHARACTER_TOKEN';
    Tokenizer.WHITESPACE_CHARACTER_TOKEN = 'WHITESPACE_CHARACTER_TOKEN';
    Tokenizer.START_TAG_TOKEN = 'START_TAG_TOKEN';
    Tokenizer.END_TAG_TOKEN = 'END_TAG_TOKEN';
    Tokenizer.COMMENT_TOKEN = 'COMMENT_TOKEN';
    Tokenizer.DOCTYPE_TOKEN = 'DOCTYPE_TOKEN';
    Tokenizer.EOF_TOKEN = 'EOF_TOKEN';
    Tokenizer.HIBERNATION_TOKEN = 'HIBERNATION_TOKEN';
    
    //Tokenizer initial states for different modes
    Tokenizer.MODE = {
        DATA: DATA_STATE,
        RCDATA: RCDATA_STATE,
        RAWTEXT: RAWTEXT_STATE,
        SCRIPT_DATA: SCRIPT_DATA_STATE,
        PLAINTEXT: PLAINTEXT_STATE
    };
    
    //Static
    Tokenizer.getTokenAttr = function(token, attrName) {
        for (let i = token.attrs.length - 1; i >= 0; i--) {
            if (token.attrs[i].name === attrName) {
                return token.attrs[i].value;
            }
        }
    
        return null;
    };
    
    module.exports = Tokenizer;
    
    
    /***/ }),
    /* 6 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const unicode = __webpack_require__(7);
    const ERR = __webpack_require__(8);
    
    //Aliases
    const $ = unicode.CODE_POINTS;
    
    //Const
    const DEFAULT_BUFFER_WATERLINE = 1 << 16;
    
    //Preprocessor
    //NOTE: HTML input preprocessing
    //(see: http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#preprocessing-the-input-stream)
    class Preprocessor {
        constructor() {
            this.html = null;
    
            this.pos = -1;
            this.lastGapPos = -1;
            this.lastCharPos = -1;
    
            this.gapStack = [];
    
            this.skipNextNewLine = false;
    
            this.lastChunkWritten = false;
            this.endOfChunkHit = false;
            this.bufferWaterline = DEFAULT_BUFFER_WATERLINE;
        }
    
        _err() {
            // NOTE: err reporting is noop by default. Enabled by mixin.
        }
    
        _addGap() {
            this.gapStack.push(this.lastGapPos);
            this.lastGapPos = this.pos;
        }
    
        _processSurrogate(cp) {
            //NOTE: try to peek a surrogate pair
            if (this.pos !== this.lastCharPos) {
                const nextCp = this.html.charCodeAt(this.pos + 1);
    
                if (unicode.isSurrogatePair(nextCp)) {
                    //NOTE: we have a surrogate pair. Peek pair character and recalculate code point.
                    this.pos++;
    
                    //NOTE: add gap that should be avoided during retreat
                    this._addGap();
    
                    return unicode.getSurrogatePairCodePoint(cp, nextCp);
                }
            }
    
            //NOTE: we are at the end of a chunk, therefore we can't infer surrogate pair yet.
            else if (!this.lastChunkWritten) {
                this.endOfChunkHit = true;
                return $.EOF;
            }
    
            //NOTE: isolated surrogate
            this._err(ERR.surrogateInInputStream);
    
            return cp;
        }
    
        dropParsedChunk() {
            if (this.pos > this.bufferWaterline) {
                this.lastCharPos -= this.pos;
                this.html = this.html.substring(this.pos);
                this.pos = 0;
                this.lastGapPos = -1;
                this.gapStack = [];
            }
        }
    
        write(chunk, isLastChunk) {
            if (this.html) {
                this.html += chunk;
            } else {
                this.html = chunk;
            }
    
            this.lastCharPos = this.html.length - 1;
            this.endOfChunkHit = false;
            this.lastChunkWritten = isLastChunk;
        }
    
        insertHtmlAtCurrentPos(chunk) {
            this.html = this.html.substring(0, this.pos + 1) + chunk + this.html.substring(this.pos + 1, this.html.length);
    
            this.lastCharPos = this.html.length - 1;
            this.endOfChunkHit = false;
        }
    
        advance() {
            this.pos++;
    
            if (this.pos > this.lastCharPos) {
                this.endOfChunkHit = !this.lastChunkWritten;
                return $.EOF;
            }
    
            let cp = this.html.charCodeAt(this.pos);
    
            //NOTE: any U+000A LINE FEED (LF) characters that immediately follow a U+000D CARRIAGE RETURN (CR) character
            //must be ignored.
            if (this.skipNextNewLine && cp === $.LINE_FEED) {
                this.skipNextNewLine = false;
                this._addGap();
                return this.advance();
            }
    
            //NOTE: all U+000D CARRIAGE RETURN (CR) characters must be converted to U+000A LINE FEED (LF) characters
            if (cp === $.CARRIAGE_RETURN) {
                this.skipNextNewLine = true;
                return $.LINE_FEED;
            }
    
            this.skipNextNewLine = false;
    
            if (unicode.isSurrogate(cp)) {
                cp = this._processSurrogate(cp);
            }
    
            //OPTIMIZATION: first check if code point is in the common allowed
            //range (ASCII alphanumeric, whitespaces, big chunk of BMP)
            //before going into detailed performance cost validation.
            const isCommonValidRange =
                (cp > 0x1f && cp < 0x7f) || cp === $.LINE_FEED || cp === $.CARRIAGE_RETURN || (cp > 0x9f && cp < 0xfdd0);
    
            if (!isCommonValidRange) {
                this._checkForProblematicCharacters(cp);
            }
    
            return cp;
        }
    
        _checkForProblematicCharacters(cp) {
            if (unicode.isControlCodePoint(cp)) {
                this._err(ERR.controlCharacterInInputStream);
            } else if (unicode.isUndefinedCodePoint(cp)) {
                this._err(ERR.noncharacterInInputStream);
            }
        }
    
        retreat() {
            if (this.pos === this.lastGapPos) {
                this.lastGapPos = this.gapStack.pop();
                this.pos--;
            }
    
            this.pos--;
        }
    }
    
    module.exports = Preprocessor;
    
    
    /***/ }),
    /* 7 */
    /***/ ((__unused_webpack_module, exports) => {
    
    "use strict";
    
    
    const UNDEFINED_CODE_POINTS = [
        0xfffe,
        0xffff,
        0x1fffe,
        0x1ffff,
        0x2fffe,
        0x2ffff,
        0x3fffe,
        0x3ffff,
        0x4fffe,
        0x4ffff,
        0x5fffe,
        0x5ffff,
        0x6fffe,
        0x6ffff,
        0x7fffe,
        0x7ffff,
        0x8fffe,
        0x8ffff,
        0x9fffe,
        0x9ffff,
        0xafffe,
        0xaffff,
        0xbfffe,
        0xbffff,
        0xcfffe,
        0xcffff,
        0xdfffe,
        0xdffff,
        0xefffe,
        0xeffff,
        0xffffe,
        0xfffff,
        0x10fffe,
        0x10ffff
    ];
    
    exports.REPLACEMENT_CHARACTER = '\uFFFD';
    
    exports.CODE_POINTS = {
        EOF: -1,
        NULL: 0x00,
        TABULATION: 0x09,
        CARRIAGE_RETURN: 0x0d,
        LINE_FEED: 0x0a,
        FORM_FEED: 0x0c,
        SPACE: 0x20,
        EXCLAMATION_MARK: 0x21,
        QUOTATION_MARK: 0x22,
        NUMBER_SIGN: 0x23,
        AMPERSAND: 0x26,
        APOSTROPHE: 0x27,
        HYPHEN_MINUS: 0x2d,
        SOLIDUS: 0x2f,
        DIGIT_0: 0x30,
        DIGIT_9: 0x39,
        SEMICOLON: 0x3b,
        LESS_THAN_SIGN: 0x3c,
        EQUALS_SIGN: 0x3d,
        GREATER_THAN_SIGN: 0x3e,
        QUESTION_MARK: 0x3f,
        LATIN_CAPITAL_A: 0x41,
        LATIN_CAPITAL_F: 0x46,
        LATIN_CAPITAL_X: 0x58,
        LATIN_CAPITAL_Z: 0x5a,
        RIGHT_SQUARE_BRACKET: 0x5d,
        GRAVE_ACCENT: 0x60,
        LATIN_SMALL_A: 0x61,
        LATIN_SMALL_F: 0x66,
        LATIN_SMALL_X: 0x78,
        LATIN_SMALL_Z: 0x7a,
        REPLACEMENT_CHARACTER: 0xfffd
    };
    
    exports.CODE_POINT_SEQUENCES = {
        DASH_DASH_STRING: [0x2d, 0x2d], //--
        DOCTYPE_STRING: [0x44, 0x4f, 0x43, 0x54, 0x59, 0x50, 0x45], //DOCTYPE
        CDATA_START_STRING: [0x5b, 0x43, 0x44, 0x41, 0x54, 0x41, 0x5b], //[CDATA[
        SCRIPT_STRING: [0x73, 0x63, 0x72, 0x69, 0x70, 0x74], //script
        PUBLIC_STRING: [0x50, 0x55, 0x42, 0x4c, 0x49, 0x43], //PUBLIC
        SYSTEM_STRING: [0x53, 0x59, 0x53, 0x54, 0x45, 0x4d] //SYSTEM
    };
    
    //Surrogates
    exports.isSurrogate = function(cp) {
        return cp >= 0xd800 && cp <= 0xdfff;
    };
    
    exports.isSurrogatePair = function(cp) {
        return cp >= 0xdc00 && cp <= 0xdfff;
    };
    
    exports.getSurrogatePairCodePoint = function(cp1, cp2) {
        return (cp1 - 0xd800) * 0x400 + 0x2400 + cp2;
    };
    
    //NOTE: excluding NULL and ASCII whitespace
    exports.isControlCodePoint = function(cp) {
        return (
            (cp !== 0x20 && cp !== 0x0a && cp !== 0x0d && cp !== 0x09 && cp !== 0x0c && cp >= 0x01 && cp <= 0x1f) ||
            (cp >= 0x7f && cp <= 0x9f)
        );
    };
    
    exports.isUndefinedCodePoint = function(cp) {
        return (cp >= 0xfdd0 && cp <= 0xfdef) || UNDEFINED_CODE_POINTS.indexOf(cp) > -1;
    };
    
    
    /***/ }),
    /* 8 */
    /***/ ((module) => {
    
    "use strict";
    
    
    module.exports = {
        controlCharacterInInputStream: 'control-character-in-input-stream',
        noncharacterInInputStream: 'noncharacter-in-input-stream',
        surrogateInInputStream: 'surrogate-in-input-stream',
        nonVoidHtmlElementStartTagWithTrailingSolidus: 'non-void-html-element-start-tag-with-trailing-solidus',
        endTagWithAttributes: 'end-tag-with-attributes',
        endTagWithTrailingSolidus: 'end-tag-with-trailing-solidus',
        unexpectedSolidusInTag: 'unexpected-solidus-in-tag',
        unexpectedNullCharacter: 'unexpected-null-character',
        unexpectedQuestionMarkInsteadOfTagName: 'unexpected-question-mark-instead-of-tag-name',
        invalidFirstCharacterOfTagName: 'invalid-first-character-of-tag-name',
        unexpectedEqualsSignBeforeAttributeName: 'unexpected-equals-sign-before-attribute-name',
        missingEndTagName: 'missing-end-tag-name',
        unexpectedCharacterInAttributeName: 'unexpected-character-in-attribute-name',
        unknownNamedCharacterReference: 'unknown-named-character-reference',
        missingSemicolonAfterCharacterReference: 'missing-semicolon-after-character-reference',
        unexpectedCharacterAfterDoctypeSystemIdentifier: 'unexpected-character-after-doctype-system-identifier',
        unexpectedCharacterInUnquotedAttributeValue: 'unexpected-character-in-unquoted-attribute-value',
        eofBeforeTagName: 'eof-before-tag-name',
        eofInTag: 'eof-in-tag',
        missingAttributeValue: 'missing-attribute-value',
        missingWhitespaceBetweenAttributes: 'missing-whitespace-between-attributes',
        missingWhitespaceAfterDoctypePublicKeyword: 'missing-whitespace-after-doctype-public-keyword',
        missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers:
            'missing-whitespace-between-doctype-public-and-system-identifiers',
        missingWhitespaceAfterDoctypeSystemKeyword: 'missing-whitespace-after-doctype-system-keyword',
        missingQuoteBeforeDoctypePublicIdentifier: 'missing-quote-before-doctype-public-identifier',
        missingQuoteBeforeDoctypeSystemIdentifier: 'missing-quote-before-doctype-system-identifier',
        missingDoctypePublicIdentifier: 'missing-doctype-public-identifier',
        missingDoctypeSystemIdentifier: 'missing-doctype-system-identifier',
        abruptDoctypePublicIdentifier: 'abrupt-doctype-public-identifier',
        abruptDoctypeSystemIdentifier: 'abrupt-doctype-system-identifier',
        cdataInHtmlContent: 'cdata-in-html-content',
        incorrectlyOpenedComment: 'incorrectly-opened-comment',
        eofInScriptHtmlCommentLikeText: 'eof-in-script-html-comment-like-text',
        eofInDoctype: 'eof-in-doctype',
        nestedComment: 'nested-comment',
        abruptClosingOfEmptyComment: 'abrupt-closing-of-empty-comment',
        eofInComment: 'eof-in-comment',
        incorrectlyClosedComment: 'incorrectly-closed-comment',
        eofInCdata: 'eof-in-cdata',
        absenceOfDigitsInNumericCharacterReference: 'absence-of-digits-in-numeric-character-reference',
        nullCharacterReference: 'null-character-reference',
        surrogateCharacterReference: 'surrogate-character-reference',
        characterReferenceOutsideUnicodeRange: 'character-reference-outside-unicode-range',
        controlCharacterReference: 'control-character-reference',
        noncharacterCharacterReference: 'noncharacter-character-reference',
        missingWhitespaceBeforeDoctypeName: 'missing-whitespace-before-doctype-name',
        missingDoctypeName: 'missing-doctype-name',
        invalidCharacterSequenceAfterDoctypeName: 'invalid-character-sequence-after-doctype-name',
        duplicateAttribute: 'duplicate-attribute',
        nonConformingDoctype: 'non-conforming-doctype',
        missingDoctype: 'missing-doctype',
        misplacedDoctype: 'misplaced-doctype',
        endTagWithoutMatchingOpenElement: 'end-tag-without-matching-open-element',
        closingOfElementWithOpenChildElements: 'closing-of-element-with-open-child-elements',
        disallowedContentInNoscriptInHead: 'disallowed-content-in-noscript-in-head',
        openElementsLeftAfterEof: 'open-elements-left-after-eof',
        abandonedHeadElementChild: 'abandoned-head-element-child',
        misplacedStartTagForHeadElement: 'misplaced-start-tag-for-head-element',
        nestedNoscriptInHead: 'nested-noscript-in-head',
        eofInElementThatCanContainOnlyText: 'eof-in-element-that-can-contain-only-text'
    };
    
    
    /***/ }),
    /* 9 */
    /***/ ((module) => {
    
    "use strict";
    
    
    //NOTE: this file contains auto-generated array mapped radix tree that is used for the named entity references consumption
    //(details: https://github.com/inikulin/parse5/tree/master/scripts/generate-named-entity-data/README.md)
    module.exports = new Uint16Array([4,52,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,106,303,412,810,1432,1701,1796,1987,2114,2360,2420,2484,3170,3251,4140,4393,4575,4610,5106,5512,5728,6117,6274,6315,6345,6427,6516,7002,7910,8733,9323,9870,10170,10631,10893,11318,11386,11467,12773,13092,14474,14922,15448,15542,16419,17666,18166,18611,19004,19095,19298,19397,4,16,69,77,97,98,99,102,103,108,109,110,111,112,114,115,116,117,140,150,158,169,176,194,199,210,216,222,226,242,256,266,283,294,108,105,103,5,198,1,59,148,1,198,80,5,38,1,59,156,1,38,99,117,116,101,5,193,1,59,167,1,193,114,101,118,101,59,1,258,4,2,105,121,182,191,114,99,5,194,1,59,189,1,194,59,1,1040,114,59,3,55349,56580,114,97,118,101,5,192,1,59,208,1,192,112,104,97,59,1,913,97,99,114,59,1,256,100,59,1,10835,4,2,103,112,232,237,111,110,59,1,260,102,59,3,55349,56632,112,108,121,70,117,110,99,116,105,111,110,59,1,8289,105,110,103,5,197,1,59,264,1,197,4,2,99,115,272,277,114,59,3,55349,56476,105,103,110,59,1,8788,105,108,100,101,5,195,1,59,292,1,195,109,108,5,196,1,59,301,1,196,4,8,97,99,101,102,111,114,115,117,321,350,354,383,388,394,400,405,4,2,99,114,327,336,107,115,108,97,115,104,59,1,8726,4,2,118,119,342,345,59,1,10983,101,100,59,1,8966,121,59,1,1041,4,3,99,114,116,362,369,379,97,117,115,101,59,1,8757,110,111,117,108,108,105,115,59,1,8492,97,59,1,914,114,59,3,55349,56581,112,102,59,3,55349,56633,101,118,101,59,1,728,99,114,59,1,8492,109,112,101,113,59,1,8782,4,14,72,79,97,99,100,101,102,104,105,108,111,114,115,117,442,447,456,504,542,547,569,573,577,616,678,784,790,796,99,121,59,1,1063,80,89,5,169,1,59,454,1,169,4,3,99,112,121,464,470,497,117,116,101,59,1,262,4,2,59,105,476,478,1,8914,116,97,108,68,105,102,102,101,114,101,110,116,105,97,108,68,59,1,8517,108,101,121,115,59,1,8493,4,4,97,101,105,111,514,520,530,535,114,111,110,59,1,268,100,105,108,5,199,1,59,528,1,199,114,99,59,1,264,110,105,110,116,59,1,8752,111,116,59,1,266,4,2,100,110,553,560,105,108,108,97,59,1,184,116,101,114,68,111,116,59,1,183,114,59,1,8493,105,59,1,935,114,99,108,101,4,4,68,77,80,84,591,596,603,609,111,116,59,1,8857,105,110,117,115,59,1,8854,108,117,115,59,1,8853,105,109,101,115,59,1,8855,111,4,2,99,115,623,646,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8754,101,67,117,114,108,121,4,2,68,81,658,671,111,117,98,108,101,81,117,111,116,101,59,1,8221,117,111,116,101,59,1,8217,4,4,108,110,112,117,688,701,736,753,111,110,4,2,59,101,696,698,1,8759,59,1,10868,4,3,103,105,116,709,717,722,114,117,101,110,116,59,1,8801,110,116,59,1,8751,111,117,114,73,110,116,101,103,114,97,108,59,1,8750,4,2,102,114,742,745,59,1,8450,111,100,117,99,116,59,1,8720,110,116,101,114,67,108,111,99,107,119,105,115,101,67,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8755,111,115,115,59,1,10799,99,114,59,3,55349,56478,112,4,2,59,67,803,805,1,8915,97,112,59,1,8781,4,11,68,74,83,90,97,99,101,102,105,111,115,834,850,855,860,865,888,903,916,921,1011,1415,4,2,59,111,840,842,1,8517,116,114,97,104,100,59,1,10513,99,121,59,1,1026,99,121,59,1,1029,99,121,59,1,1039,4,3,103,114,115,873,879,883,103,101,114,59,1,8225,114,59,1,8609,104,118,59,1,10980,4,2,97,121,894,900,114,111,110,59,1,270,59,1,1044,108,4,2,59,116,910,912,1,8711,97,59,1,916,114,59,3,55349,56583,4,2,97,102,927,998,4,2,99,109,933,992,114,105,116,105,99,97,108,4,4,65,68,71,84,950,957,978,985,99,117,116,101,59,1,180,111,4,2,116,117,964,967,59,1,729,98,108,101,65,99,117,116,101,59,1,733,114,97,118,101,59,1,96,105,108,100,101,59,1,732,111,110,100,59,1,8900,102,101,114,101,110,116,105,97,108,68,59,1,8518,4,4,112,116,117,119,1021,1026,1048,1249,102,59,3,55349,56635,4,3,59,68,69,1034,1036,1041,1,168,111,116,59,1,8412,113,117,97,108,59,1,8784,98,108,101,4,6,67,68,76,82,85,86,1065,1082,1101,1189,1211,1236,111,110,116,111,117,114,73,110,116,101,103,114,97,108,59,1,8751,111,4,2,116,119,1089,1092,59,1,168,110,65,114,114,111,119,59,1,8659,4,2,101,111,1107,1141,102,116,4,3,65,82,84,1117,1124,1136,114,114,111,119,59,1,8656,105,103,104,116,65,114,114,111,119,59,1,8660,101,101,59,1,10980,110,103,4,2,76,82,1149,1177,101,102,116,4,2,65,82,1158,1165,114,114,111,119,59,1,10232,105,103,104,116,65,114,114,111,119,59,1,10234,105,103,104,116,65,114,114,111,119,59,1,10233,105,103,104,116,4,2,65,84,1199,1206,114,114,111,119,59,1,8658,101,101,59,1,8872,112,4,2,65,68,1218,1225,114,114,111,119,59,1,8657,111,119,110,65,114,114,111,119,59,1,8661,101,114,116,105,99,97,108,66,97,114,59,1,8741,110,4,6,65,66,76,82,84,97,1264,1292,1299,1352,1391,1408,114,114,111,119,4,3,59,66,85,1276,1278,1283,1,8595,97,114,59,1,10515,112,65,114,114,111,119,59,1,8693,114,101,118,101,59,1,785,101,102,116,4,3,82,84,86,1310,1323,1334,105,103,104,116,86,101,99,116,111,114,59,1,10576,101,101,86,101,99,116,111,114,59,1,10590,101,99,116,111,114,4,2,59,66,1345,1347,1,8637,97,114,59,1,10582,105,103,104,116,4,2,84,86,1362,1373,101,101,86,101,99,116,111,114,59,1,10591,101,99,116,111,114,4,2,59,66,1384,1386,1,8641,97,114,59,1,10583,101,101,4,2,59,65,1399,1401,1,8868,114,114,111,119,59,1,8615,114,114,111,119,59,1,8659,4,2,99,116,1421,1426,114,59,3,55349,56479,114,111,107,59,1,272,4,16,78,84,97,99,100,102,103,108,109,111,112,113,115,116,117,120,1466,1470,1478,1489,1515,1520,1525,1536,1544,1593,1609,1617,1650,1664,1668,1677,71,59,1,330,72,5,208,1,59,1476,1,208,99,117,116,101,5,201,1,59,1487,1,201,4,3,97,105,121,1497,1503,1512,114,111,110,59,1,282,114,99,5,202,1,59,1510,1,202,59,1,1069,111,116,59,1,278,114,59,3,55349,56584,114,97,118,101,5,200,1,59,1534,1,200,101,109,101,110,116,59,1,8712,4,2,97,112,1550,1555,99,114,59,1,274,116,121,4,2,83,86,1563,1576,109,97,108,108,83,113,117,97,114,101,59,1,9723,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9643,4,2,103,112,1599,1604,111,110,59,1,280,102,59,3,55349,56636,115,105,108,111,110,59,1,917,117,4,2,97,105,1624,1640,108,4,2,59,84,1631,1633,1,10869,105,108,100,101,59,1,8770,108,105,98,114,105,117,109,59,1,8652,4,2,99,105,1656,1660,114,59,1,8496,109,59,1,10867,97,59,1,919,109,108,5,203,1,59,1675,1,203,4,2,105,112,1683,1689,115,116,115,59,1,8707,111,110,101,110,116,105,97,108,69,59,1,8519,4,5,99,102,105,111,115,1713,1717,1722,1762,1791,121,59,1,1060,114,59,3,55349,56585,108,108,101,100,4,2,83,86,1732,1745,109,97,108,108,83,113,117,97,114,101,59,1,9724,101,114,121,83,109,97,108,108,83,113,117,97,114,101,59,1,9642,4,3,112,114,117,1770,1775,1781,102,59,3,55349,56637,65,108,108,59,1,8704,114,105,101,114,116,114,102,59,1,8497,99,114,59,1,8497,4,12,74,84,97,98,99,100,102,103,111,114,115,116,1822,1827,1834,1848,1855,1877,1882,1887,1890,1896,1978,1984,99,121,59,1,1027,5,62,1,59,1832,1,62,109,109,97,4,2,59,100,1843,1845,1,915,59,1,988,114,101,118,101,59,1,286,4,3,101,105,121,1863,1869,1874,100,105,108,59,1,290,114,99,59,1,284,59,1,1043,111,116,59,1,288,114,59,3,55349,56586,59,1,8921,112,102,59,3,55349,56638,101,97,116,101,114,4,6,69,70,71,76,83,84,1915,1933,1944,1953,1959,1971,113,117,97,108,4,2,59,76,1925,1927,1,8805,101,115,115,59,1,8923,117,108,108,69,113,117,97,108,59,1,8807,114,101,97,116,101,114,59,1,10914,101,115,115,59,1,8823,108,97,110,116,69,113,117,97,108,59,1,10878,105,108,100,101,59,1,8819,99,114,59,3,55349,56482,59,1,8811,4,8,65,97,99,102,105,111,115,117,2005,2012,2026,2032,2036,2049,2073,2089,82,68,99,121,59,1,1066,4,2,99,116,2018,2023,101,107,59,1,711,59,1,94,105,114,99,59,1,292,114,59,1,8460,108,98,101,114,116,83,112,97,99,101,59,1,8459,4,2,112,114,2055,2059,102,59,1,8461,105,122,111,110,116,97,108,76,105,110,101,59,1,9472,4,2,99,116,2079,2083,114,59,1,8459,114,111,107,59,1,294,109,112,4,2,68,69,2097,2107,111,119,110,72,117,109,112,59,1,8782,113,117,97,108,59,1,8783,4,14,69,74,79,97,99,100,102,103,109,110,111,115,116,117,2144,2149,2155,2160,2171,2189,2194,2198,2209,2245,2307,2329,2334,2341,99,121,59,1,1045,108,105,103,59,1,306,99,121,59,1,1025,99,117,116,101,5,205,1,59,2169,1,205,4,2,105,121,2177,2186,114,99,5,206,1,59,2184,1,206,59,1,1048,111,116,59,1,304,114,59,1,8465,114,97,118,101,5,204,1,59,2207,1,204,4,3,59,97,112,2217,2219,2238,1,8465,4,2,99,103,2225,2229,114,59,1,298,105,110,97,114,121,73,59,1,8520,108,105,101,115,59,1,8658,4,2,116,118,2251,2281,4,2,59,101,2257,2259,1,8748,4,2,103,114,2265,2271,114,97,108,59,1,8747,115,101,99,116,105,111,110,59,1,8898,105,115,105,98,108,101,4,2,67,84,2293,2300,111,109,109,97,59,1,8291,105,109,101,115,59,1,8290,4,3,103,112,116,2315,2320,2325,111,110,59,1,302,102,59,3,55349,56640,97,59,1,921,99,114,59,1,8464,105,108,100,101,59,1,296,4,2,107,109,2347,2352,99,121,59,1,1030,108,5,207,1,59,2358,1,207,4,5,99,102,111,115,117,2372,2386,2391,2397,2414,4,2,105,121,2378,2383,114,99,59,1,308,59,1,1049,114,59,3,55349,56589,112,102,59,3,55349,56641,4,2,99,101,2403,2408,114,59,3,55349,56485,114,99,121,59,1,1032,107,99,121,59,1,1028,4,7,72,74,97,99,102,111,115,2436,2441,2446,2452,2467,2472,2478,99,121,59,1,1061,99,121,59,1,1036,112,112,97,59,1,922,4,2,101,121,2458,2464,100,105,108,59,1,310,59,1,1050,114,59,3,55349,56590,112,102,59,3,55349,56642,99,114,59,3,55349,56486,4,11,74,84,97,99,101,102,108,109,111,115,116,2508,2513,2520,2562,2585,2981,2986,3004,3011,3146,3167,99,121,59,1,1033,5,60,1,59,2518,1,60,4,5,99,109,110,112,114,2532,2538,2544,2548,2558,117,116,101,59,1,313,98,100,97,59,1,923,103,59,1,10218,108,97,99,101,116,114,102,59,1,8466,114,59,1,8606,4,3,97,101,121,2570,2576,2582,114,111,110,59,1,317,100,105,108,59,1,315,59,1,1051,4,2,102,115,2591,2907,116,4,10,65,67,68,70,82,84,85,86,97,114,2614,2663,2672,2728,2735,2760,2820,2870,2888,2895,4,2,110,114,2620,2633,103,108,101,66,114,97,99,107,101,116,59,1,10216,114,111,119,4,3,59,66,82,2644,2646,2651,1,8592,97,114,59,1,8676,105,103,104,116,65,114,114,111,119,59,1,8646,101,105,108,105,110,103,59,1,8968,111,4,2,117,119,2679,2692,98,108,101,66,114,97,99,107,101,116,59,1,10214,110,4,2,84,86,2699,2710,101,101,86,101,99,116,111,114,59,1,10593,101,99,116,111,114,4,2,59,66,2721,2723,1,8643,97,114,59,1,10585,108,111,111,114,59,1,8970,105,103,104,116,4,2,65,86,2745,2752,114,114,111,119,59,1,8596,101,99,116,111,114,59,1,10574,4,2,101,114,2766,2792,101,4,3,59,65,86,2775,2777,2784,1,8867,114,114,111,119,59,1,8612,101,99,116,111,114,59,1,10586,105,97,110,103,108,101,4,3,59,66,69,2806,2808,2813,1,8882,97,114,59,1,10703,113,117,97,108,59,1,8884,112,4,3,68,84,86,2829,2841,2852,111,119,110,86,101,99,116,111,114,59,1,10577,101,101,86,101,99,116,111,114,59,1,10592,101,99,116,111,114,4,2,59,66,2863,2865,1,8639,97,114,59,1,10584,101,99,116,111,114,4,2,59,66,2881,2883,1,8636,97,114,59,1,10578,114,114,111,119,59,1,8656,105,103,104,116,97,114,114,111,119,59,1,8660,115,4,6,69,70,71,76,83,84,2922,2936,2947,2956,2962,2974,113,117,97,108,71,114,101,97,116,101,114,59,1,8922,117,108,108,69,113,117,97,108,59,1,8806,114,101,97,116,101,114,59,1,8822,101,115,115,59,1,10913,108,97,110,116,69,113,117,97,108,59,1,10877,105,108,100,101,59,1,8818,114,59,3,55349,56591,4,2,59,101,2992,2994,1,8920,102,116,97,114,114,111,119,59,1,8666,105,100,111,116,59,1,319,4,3,110,112,119,3019,3110,3115,103,4,4,76,82,108,114,3030,3058,3070,3098,101,102,116,4,2,65,82,3039,3046,114,114,111,119,59,1,10229,105,103,104,116,65,114,114,111,119,59,1,10231,105,103,104,116,65,114,114,111,119,59,1,10230,101,102,116,4,2,97,114,3079,3086,114,114,111,119,59,1,10232,105,103,104,116,97,114,114,111,119,59,1,10234,105,103,104,116,97,114,114,111,119,59,1,10233,102,59,3,55349,56643,101,114,4,2,76,82,3123,3134,101,102,116,65,114,114,111,119,59,1,8601,105,103,104,116,65,114,114,111,119,59,1,8600,4,3,99,104,116,3154,3158,3161,114,59,1,8466,59,1,8624,114,111,107,59,1,321,59,1,8810,4,8,97,99,101,102,105,111,115,117,3188,3192,3196,3222,3227,3237,3243,3248,112,59,1,10501,121,59,1,1052,4,2,100,108,3202,3213,105,117,109,83,112,97,99,101,59,1,8287,108,105,110,116,114,102,59,1,8499,114,59,3,55349,56592,110,117,115,80,108,117,115,59,1,8723,112,102,59,3,55349,56644,99,114,59,1,8499,59,1,924,4,9,74,97,99,101,102,111,115,116,117,3271,3276,3283,3306,3422,3427,4120,4126,4137,99,121,59,1,1034,99,117,116,101,59,1,323,4,3,97,101,121,3291,3297,3303,114,111,110,59,1,327,100,105,108,59,1,325,59,1,1053,4,3,103,115,119,3314,3380,3415,97,116,105,118,101,4,3,77,84,86,3327,3340,3365,101,100,105,117,109,83,112,97,99,101,59,1,8203,104,105,4,2,99,110,3348,3357,107,83,112,97,99,101,59,1,8203,83,112,97,99,101,59,1,8203,101,114,121,84,104,105,110,83,112,97,99,101,59,1,8203,116,101,100,4,2,71,76,3389,3405,114,101,97,116,101,114,71,114,101,97,116,101,114,59,1,8811,101,115,115,76,101,115,115,59,1,8810,76,105,110,101,59,1,10,114,59,3,55349,56593,4,4,66,110,112,116,3437,3444,3460,3464,114,101,97,107,59,1,8288,66,114,101,97,107,105,110,103,83,112,97,99,101,59,1,160,102,59,1,8469,4,13,59,67,68,69,71,72,76,78,80,82,83,84,86,3492,3494,3517,3536,3578,3657,3685,3784,3823,3860,3915,4066,4107,1,10988,4,2,111,117,3500,3510,110,103,114,117,101,110,116,59,1,8802,112,67,97,112,59,1,8813,111,117,98,108,101,86,101,114,116,105,99,97,108,66,97,114,59,1,8742,4,3,108,113,120,3544,3552,3571,101,109,101,110,116,59,1,8713,117,97,108,4,2,59,84,3561,3563,1,8800,105,108,100,101,59,3,8770,824,105,115,116,115,59,1,8708,114,101,97,116,101,114,4,7,59,69,70,71,76,83,84,3600,3602,3609,3621,3631,3637,3650,1,8815,113,117,97,108,59,1,8817,117,108,108,69,113,117,97,108,59,3,8807,824,114,101,97,116,101,114,59,3,8811,824,101,115,115,59,1,8825,108,97,110,116,69,113,117,97,108,59,3,10878,824,105,108,100,101,59,1,8821,117,109,112,4,2,68,69,3666,3677,111,119,110,72,117,109,112,59,3,8782,824,113,117,97,108,59,3,8783,824,101,4,2,102,115,3692,3724,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3709,3711,3717,1,8938,97,114,59,3,10703,824,113,117,97,108,59,1,8940,115,4,6,59,69,71,76,83,84,3739,3741,3748,3757,3764,3777,1,8814,113,117,97,108,59,1,8816,114,101,97,116,101,114,59,1,8824,101,115,115,59,3,8810,824,108,97,110,116,69,113,117,97,108,59,3,10877,824,105,108,100,101,59,1,8820,101,115,116,101,100,4,2,71,76,3795,3812,114,101,97,116,101,114,71,114,101,97,116,101,114,59,3,10914,824,101,115,115,76,101,115,115,59,3,10913,824,114,101,99,101,100,101,115,4,3,59,69,83,3838,3840,3848,1,8832,113,117,97,108,59,3,10927,824,108,97,110,116,69,113,117,97,108,59,1,8928,4,2,101,105,3866,3881,118,101,114,115,101,69,108,101,109,101,110,116,59,1,8716,103,104,116,84,114,105,97,110,103,108,101,4,3,59,66,69,3900,3902,3908,1,8939,97,114,59,3,10704,824,113,117,97,108,59,1,8941,4,2,113,117,3921,3973,117,97,114,101,83,117,4,2,98,112,3933,3952,115,101,116,4,2,59,69,3942,3945,3,8847,824,113,117,97,108,59,1,8930,101,114,115,101,116,4,2,59,69,3963,3966,3,8848,824,113,117,97,108,59,1,8931,4,3,98,99,112,3981,4000,4045,115,101,116,4,2,59,69,3990,3993,3,8834,8402,113,117,97,108,59,1,8840,99,101,101,100,115,4,4,59,69,83,84,4015,4017,4025,4037,1,8833,113,117,97,108,59,3,10928,824,108,97,110,116,69,113,117,97,108,59,1,8929,105,108,100,101,59,3,8831,824,101,114,115,101,116,4,2,59,69,4056,4059,3,8835,8402,113,117,97,108,59,1,8841,105,108,100,101,4,4,59,69,70,84,4080,4082,4089,4100,1,8769,113,117,97,108,59,1,8772,117,108,108,69,113,117,97,108,59,1,8775,105,108,100,101,59,1,8777,101,114,116,105,99,97,108,66,97,114,59,1,8740,99,114,59,3,55349,56489,105,108,100,101,5,209,1,59,4135,1,209,59,1,925,4,14,69,97,99,100,102,103,109,111,112,114,115,116,117,118,4170,4176,4187,4205,4212,4217,4228,4253,4259,4292,4295,4316,4337,4346,108,105,103,59,1,338,99,117,116,101,5,211,1,59,4185,1,211,4,2,105,121,4193,4202,114,99,5,212,1,59,4200,1,212,59,1,1054,98,108,97,99,59,1,336,114,59,3,55349,56594,114,97,118,101,5,210,1,59,4226,1,210,4,3,97,101,105,4236,4241,4246,99,114,59,1,332,103,97,59,1,937,99,114,111,110,59,1,927,112,102,59,3,55349,56646,101,110,67,117,114,108,121,4,2,68,81,4272,4285,111,117,98,108,101,81,117,111,116,101,59,1,8220,117,111,116,101,59,1,8216,59,1,10836,4,2,99,108,4301,4306,114,59,3,55349,56490,97,115,104,5,216,1,59,4314,1,216,105,4,2,108,109,4323,4332,100,101,5,213,1,59,4330,1,213,101,115,59,1,10807,109,108,5,214,1,59,4344,1,214,101,114,4,2,66,80,4354,4380,4,2,97,114,4360,4364,114,59,1,8254,97,99,4,2,101,107,4372,4375,59,1,9182,101,116,59,1,9140,97,114,101,110,116,104,101,115,105,115,59,1,9180,4,9,97,99,102,104,105,108,111,114,115,4413,4422,4426,4431,4435,4438,4448,4471,4561,114,116,105,97,108,68,59,1,8706,121,59,1,1055,114,59,3,55349,56595,105,59,1,934,59,1,928,117,115,77,105,110,117,115,59,1,177,4,2,105,112,4454,4467,110,99,97,114,101,112,108,97,110,101,59,1,8460,102,59,1,8473,4,4,59,101,105,111,4481,4483,4526,4531,1,10939,99,101,100,101,115,4,4,59,69,83,84,4498,4500,4507,4519,1,8826,113,117,97,108,59,1,10927,108,97,110,116,69,113,117,97,108,59,1,8828,105,108,100,101,59,1,8830,109,101,59,1,8243,4,2,100,112,4537,4543,117,99,116,59,1,8719,111,114,116,105,111,110,4,2,59,97,4555,4557,1,8759,108,59,1,8733,4,2,99,105,4567,4572,114,59,3,55349,56491,59,1,936,4,4,85,102,111,115,4585,4594,4599,4604,79,84,5,34,1,59,4592,1,34,114,59,3,55349,56596,112,102,59,1,8474,99,114,59,3,55349,56492,4,12,66,69,97,99,101,102,104,105,111,114,115,117,4636,4642,4650,4681,4704,4763,4767,4771,5047,5069,5081,5094,97,114,114,59,1,10512,71,5,174,1,59,4648,1,174,4,3,99,110,114,4658,4664,4668,117,116,101,59,1,340,103,59,1,10219,114,4,2,59,116,4675,4677,1,8608,108,59,1,10518,4,3,97,101,121,4689,4695,4701,114,111,110,59,1,344,100,105,108,59,1,342,59,1,1056,4,2,59,118,4710,4712,1,8476,101,114,115,101,4,2,69,85,4722,4748,4,2,108,113,4728,4736,101,109,101,110,116,59,1,8715,117,105,108,105,98,114,105,117,109,59,1,8651,112,69,113,117,105,108,105,98,114,105,117,109,59,1,10607,114,59,1,8476,111,59,1,929,103,104,116,4,8,65,67,68,70,84,85,86,97,4792,4840,4849,4905,4912,4972,5022,5040,4,2,110,114,4798,4811,103,108,101,66,114,97,99,107,101,116,59,1,10217,114,111,119,4,3,59,66,76,4822,4824,4829,1,8594,97,114,59,1,8677,101,102,116,65,114,114,111,119,59,1,8644,101,105,108,105,110,103,59,1,8969,111,4,2,117,119,4856,4869,98,108,101,66,114,97,99,107,101,116,59,1,10215,110,4,2,84,86,4876,4887,101,101,86,101,99,116,111,114,59,1,10589,101,99,116,111,114,4,2,59,66,4898,4900,1,8642,97,114,59,1,10581,108,111,111,114,59,1,8971,4,2,101,114,4918,4944,101,4,3,59,65,86,4927,4929,4936,1,8866,114,114,111,119,59,1,8614,101,99,116,111,114,59,1,10587,105,97,110,103,108,101,4,3,59,66,69,4958,4960,4965,1,8883,97,114,59,1,10704,113,117,97,108,59,1,8885,112,4,3,68,84,86,4981,4993,5004,111,119,110,86,101,99,116,111,114,59,1,10575,101,101,86,101,99,116,111,114,59,1,10588,101,99,116,111,114,4,2,59,66,5015,5017,1,8638,97,114,59,1,10580,101,99,116,111,114,4,2,59,66,5033,5035,1,8640,97,114,59,1,10579,114,114,111,119,59,1,8658,4,2,112,117,5053,5057,102,59,1,8477,110,100,73,109,112,108,105,101,115,59,1,10608,105,103,104,116,97,114,114,111,119,59,1,8667,4,2,99,104,5087,5091,114,59,1,8475,59,1,8625,108,101,68,101,108,97,121,101,100,59,1,10740,4,13,72,79,97,99,102,104,105,109,111,113,115,116,117,5134,5150,5157,5164,5198,5203,5259,5265,5277,5283,5374,5380,5385,4,2,67,99,5140,5146,72,99,121,59,1,1065,121,59,1,1064,70,84,99,121,59,1,1068,99,117,116,101,59,1,346,4,5,59,97,101,105,121,5176,5178,5184,5190,5195,1,10940,114,111,110,59,1,352,100,105,108,59,1,350,114,99,59,1,348,59,1,1057,114,59,3,55349,56598,111,114,116,4,4,68,76,82,85,5216,5227,5238,5250,111,119,110,65,114,114,111,119,59,1,8595,101,102,116,65,114,114,111,119,59,1,8592,105,103,104,116,65,114,114,111,119,59,1,8594,112,65,114,114,111,119,59,1,8593,103,109,97,59,1,931,97,108,108,67,105,114,99,108,101,59,1,8728,112,102,59,3,55349,56650,4,2,114,117,5289,5293,116,59,1,8730,97,114,101,4,4,59,73,83,85,5306,5308,5322,5367,1,9633,110,116,101,114,115,101,99,116,105,111,110,59,1,8851,117,4,2,98,112,5329,5347,115,101,116,4,2,59,69,5338,5340,1,8847,113,117,97,108,59,1,8849,101,114,115,101,116,4,2,59,69,5358,5360,1,8848,113,117,97,108,59,1,8850,110,105,111,110,59,1,8852,99,114,59,3,55349,56494,97,114,59,1,8902,4,4,98,99,109,112,5395,5420,5475,5478,4,2,59,115,5401,5403,1,8912,101,116,4,2,59,69,5411,5413,1,8912,113,117,97,108,59,1,8838,4,2,99,104,5426,5468,101,101,100,115,4,4,59,69,83,84,5440,5442,5449,5461,1,8827,113,117,97,108,59,1,10928,108,97,110,116,69,113,117,97,108,59,1,8829,105,108,100,101,59,1,8831,84,104,97,116,59,1,8715,59,1,8721,4,3,59,101,115,5486,5488,5507,1,8913,114,115,101,116,4,2,59,69,5498,5500,1,8835,113,117,97,108,59,1,8839,101,116,59,1,8913,4,11,72,82,83,97,99,102,104,105,111,114,115,5536,5546,5552,5567,5579,5602,5607,5655,5695,5701,5711,79,82,78,5,222,1,59,5544,1,222,65,68,69,59,1,8482,4,2,72,99,5558,5563,99,121,59,1,1035,121,59,1,1062,4,2,98,117,5573,5576,59,1,9,59,1,932,4,3,97,101,121,5587,5593,5599,114,111,110,59,1,356,100,105,108,59,1,354,59,1,1058,114,59,3,55349,56599,4,2,101,105,5613,5631,4,2,114,116,5619,5627,101,102,111,114,101,59,1,8756,97,59,1,920,4,2,99,110,5637,5647,107,83,112,97,99,101,59,3,8287,8202,83,112,97,99,101,59,1,8201,108,100,101,4,4,59,69,70,84,5668,5670,5677,5688,1,8764,113,117,97,108,59,1,8771,117,108,108,69,113,117,97,108,59,1,8773,105,108,100,101,59,1,8776,112,102,59,3,55349,56651,105,112,108,101,68,111,116,59,1,8411,4,2,99,116,5717,5722,114,59,3,55349,56495,114,111,107,59,1,358,4,14,97,98,99,100,102,103,109,110,111,112,114,115,116,117,5758,5789,5805,5823,5830,5835,5846,5852,5921,5937,6089,6095,6101,6108,4,2,99,114,5764,5774,117,116,101,5,218,1,59,5772,1,218,114,4,2,59,111,5781,5783,1,8607,99,105,114,59,1,10569,114,4,2,99,101,5796,5800,121,59,1,1038,118,101,59,1,364,4,2,105,121,5811,5820,114,99,5,219,1,59,5818,1,219,59,1,1059,98,108,97,99,59,1,368,114,59,3,55349,56600,114,97,118,101,5,217,1,59,5844,1,217,97,99,114,59,1,362,4,2,100,105,5858,5905,101,114,4,2,66,80,5866,5892,4,2,97,114,5872,5876,114,59,1,95,97,99,4,2,101,107,5884,5887,59,1,9183,101,116,59,1,9141,97,114,101,110,116,104,101,115,105,115,59,1,9181,111,110,4,2,59,80,5913,5915,1,8899,108,117,115,59,1,8846,4,2,103,112,5927,5932,111,110,59,1,370,102,59,3,55349,56652,4,8,65,68,69,84,97,100,112,115,5955,5985,5996,6009,6026,6033,6044,6075,114,114,111,119,4,3,59,66,68,5967,5969,5974,1,8593,97,114,59,1,10514,111,119,110,65,114,114,111,119,59,1,8645,111,119,110,65,114,114,111,119,59,1,8597,113,117,105,108,105,98,114,105,117,109,59,1,10606,101,101,4,2,59,65,6017,6019,1,8869,114,114,111,119,59,1,8613,114,114,111,119,59,1,8657,111,119,110,97,114,114,111,119,59,1,8661,101,114,4,2,76,82,6052,6063,101,102,116,65,114,114,111,119,59,1,8598,105,103,104,116,65,114,114,111,119,59,1,8599,105,4,2,59,108,6082,6084,1,978,111,110,59,1,933,105,110,103,59,1,366,99,114,59,3,55349,56496,105,108,100,101,59,1,360,109,108,5,220,1,59,6115,1,220,4,9,68,98,99,100,101,102,111,115,118,6137,6143,6148,6152,6166,6250,6255,6261,6267,97,115,104,59,1,8875,97,114,59,1,10987,121,59,1,1042,97,115,104,4,2,59,108,6161,6163,1,8873,59,1,10982,4,2,101,114,6172,6175,59,1,8897,4,3,98,116,121,6183,6188,6238,97,114,59,1,8214,4,2,59,105,6194,6196,1,8214,99,97,108,4,4,66,76,83,84,6209,6214,6220,6231,97,114,59,1,8739,105,110,101,59,1,124,101,112,97,114,97,116,111,114,59,1,10072,105,108,100,101,59,1,8768,84,104,105,110,83,112,97,99,101,59,1,8202,114,59,3,55349,56601,112,102,59,3,55349,56653,99,114,59,3,55349,56497,100,97,115,104,59,1,8874,4,5,99,101,102,111,115,6286,6292,6298,6303,6309,105,114,99,59,1,372,100,103,101,59,1,8896,114,59,3,55349,56602,112,102,59,3,55349,56654,99,114,59,3,55349,56498,4,4,102,105,111,115,6325,6330,6333,6339,114,59,3,55349,56603,59,1,926,112,102,59,3,55349,56655,99,114,59,3,55349,56499,4,9,65,73,85,97,99,102,111,115,117,6365,6370,6375,6380,6391,6405,6410,6416,6422,99,121,59,1,1071,99,121,59,1,1031,99,121,59,1,1070,99,117,116,101,5,221,1,59,6389,1,221,4,2,105,121,6397,6402,114,99,59,1,374,59,1,1067,114,59,3,55349,56604,112,102,59,3,55349,56656,99,114,59,3,55349,56500,109,108,59,1,376,4,8,72,97,99,100,101,102,111,115,6445,6450,6457,6472,6477,6501,6505,6510,99,121,59,1,1046,99,117,116,101,59,1,377,4,2,97,121,6463,6469,114,111,110,59,1,381,59,1,1047,111,116,59,1,379,4,2,114,116,6483,6497,111,87,105,100,116,104,83,112,97,99,101,59,1,8203,97,59,1,918,114,59,1,8488,112,102,59,1,8484,99,114,59,3,55349,56501,4,16,97,98,99,101,102,103,108,109,110,111,112,114,115,116,117,119,6550,6561,6568,6612,6622,6634,6645,6672,6699,6854,6870,6923,6933,6963,6974,6983,99,117,116,101,5,225,1,59,6559,1,225,114,101,118,101,59,1,259,4,6,59,69,100,105,117,121,6582,6584,6588,6591,6600,6609,1,8766,59,3,8766,819,59,1,8767,114,99,5,226,1,59,6598,1,226,116,101,5,180,1,59,6607,1,180,59,1,1072,108,105,103,5,230,1,59,6620,1,230,4,2,59,114,6628,6630,1,8289,59,3,55349,56606,114,97,118,101,5,224,1,59,6643,1,224,4,2,101,112,6651,6667,4,2,102,112,6657,6663,115,121,109,59,1,8501,104,59,1,8501,104,97,59,1,945,4,2,97,112,6678,6692,4,2,99,108,6684,6688,114,59,1,257,103,59,1,10815,5,38,1,59,6697,1,38,4,2,100,103,6705,6737,4,5,59,97,100,115,118,6717,6719,6724,6727,6734,1,8743,110,100,59,1,10837,59,1,10844,108,111,112,101,59,1,10840,59,1,10842,4,7,59,101,108,109,114,115,122,6753,6755,6758,6762,6814,6835,6848,1,8736,59,1,10660,101,59,1,8736,115,100,4,2,59,97,6770,6772,1,8737,4,8,97,98,99,100,101,102,103,104,6790,6793,6796,6799,6802,6805,6808,6811,59,1,10664,59,1,10665,59,1,10666,59,1,10667,59,1,10668,59,1,10669,59,1,10670,59,1,10671,116,4,2,59,118,6821,6823,1,8735,98,4,2,59,100,6830,6832,1,8894,59,1,10653,4,2,112,116,6841,6845,104,59,1,8738,59,1,197,97,114,114,59,1,9084,4,2,103,112,6860,6865,111,110,59,1,261,102,59,3,55349,56658,4,7,59,69,97,101,105,111,112,6886,6888,6891,6897,6900,6904,6908,1,8776,59,1,10864,99,105,114,59,1,10863,59,1,8778,100,59,1,8779,115,59,1,39,114,111,120,4,2,59,101,6917,6919,1,8776,113,59,1,8778,105,110,103,5,229,1,59,6931,1,229,4,3,99,116,121,6941,6946,6949,114,59,3,55349,56502,59,1,42,109,112,4,2,59,101,6957,6959,1,8776,113,59,1,8781,105,108,100,101,5,227,1,59,6972,1,227,109,108,5,228,1,59,6981,1,228,4,2,99,105,6989,6997,111,110,105,110,116,59,1,8755,110,116,59,1,10769,4,16,78,97,98,99,100,101,102,105,107,108,110,111,112,114,115,117,7036,7041,7119,7135,7149,7155,7219,7224,7347,7354,7463,7489,7786,7793,7814,7866,111,116,59,1,10989,4,2,99,114,7047,7094,107,4,4,99,101,112,115,7058,7064,7073,7080,111,110,103,59,1,8780,112,115,105,108,111,110,59,1,1014,114,105,109,101,59,1,8245,105,109,4,2,59,101,7088,7090,1,8765,113,59,1,8909,4,2,118,119,7100,7105,101,101,59,1,8893,101,100,4,2,59,103,7113,7115,1,8965,101,59,1,8965,114,107,4,2,59,116,7127,7129,1,9141,98,114,107,59,1,9142,4,2,111,121,7141,7146,110,103,59,1,8780,59,1,1073,113,117,111,59,1,8222,4,5,99,109,112,114,116,7167,7181,7188,7193,7199,97,117,115,4,2,59,101,7176,7178,1,8757,59,1,8757,112,116,121,118,59,1,10672,115,105,59,1,1014,110,111,117,59,1,8492,4,3,97,104,119,7207,7210,7213,59,1,946,59,1,8502,101,101,110,59,1,8812,114,59,3,55349,56607,103,4,7,99,111,115,116,117,118,119,7241,7262,7288,7305,7328,7335,7340,4,3,97,105,117,7249,7253,7258,112,59,1,8898,114,99,59,1,9711,112,59,1,8899,4,3,100,112,116,7270,7275,7281,111,116,59,1,10752,108,117,115,59,1,10753,105,109,101,115,59,1,10754,4,2,113,116,7294,7300,99,117,112,59,1,10758,97,114,59,1,9733,114,105,97,110,103,108,101,4,2,100,117,7318,7324,111,119,110,59,1,9661,112,59,1,9651,112,108,117,115,59,1,10756,101,101,59,1,8897,101,100,103,101,59,1,8896,97,114,111,119,59,1,10509,4,3,97,107,111,7362,7436,7458,4,2,99,110,7368,7432,107,4,3,108,115,116,7377,7386,7394,111,122,101,110,103,101,59,1,10731,113,117,97,114,101,59,1,9642,114,105,97,110,103,108,101,4,4,59,100,108,114,7411,7413,7419,7425,1,9652,111,119,110,59,1,9662,101,102,116,59,1,9666,105,103,104,116,59,1,9656,107,59,1,9251,4,2,49,51,7442,7454,4,2,50,52,7448,7451,59,1,9618,59,1,9617,52,59,1,9619,99,107,59,1,9608,4,2,101,111,7469,7485,4,2,59,113,7475,7478,3,61,8421,117,105,118,59,3,8801,8421,116,59,1,8976,4,4,112,116,119,120,7499,7504,7517,7523,102,59,3,55349,56659,4,2,59,116,7510,7512,1,8869,111,109,59,1,8869,116,105,101,59,1,8904,4,12,68,72,85,86,98,100,104,109,112,116,117,118,7549,7571,7597,7619,7655,7660,7682,7708,7715,7721,7728,7750,4,4,76,82,108,114,7559,7562,7565,7568,59,1,9559,59,1,9556,59,1,9558,59,1,9555,4,5,59,68,85,100,117,7583,7585,7588,7591,7594,1,9552,59,1,9574,59,1,9577,59,1,9572,59,1,9575,4,4,76,82,108,114,7607,7610,7613,7616,59,1,9565,59,1,9562,59,1,9564,59,1,9561,4,7,59,72,76,82,104,108,114,7635,7637,7640,7643,7646,7649,7652,1,9553,59,1,9580,59,1,9571,59,1,9568,59,1,9579,59,1,9570,59,1,9567,111,120,59,1,10697,4,4,76,82,108,114,7670,7673,7676,7679,59,1,9557,59,1,9554,59,1,9488,59,1,9484,4,5,59,68,85,100,117,7694,7696,7699,7702,7705,1,9472,59,1,9573,59,1,9576,59,1,9516,59,1,9524,105,110,117,115,59,1,8863,108,117,115,59,1,8862,105,109,101,115,59,1,8864,4,4,76,82,108,114,7738,7741,7744,7747,59,1,9563,59,1,9560,59,1,9496,59,1,9492,4,7,59,72,76,82,104,108,114,7766,7768,7771,7774,7777,7780,7783,1,9474,59,1,9578,59,1,9569,59,1,9566,59,1,9532,59,1,9508,59,1,9500,114,105,109,101,59,1,8245,4,2,101,118,7799,7804,118,101,59,1,728,98,97,114,5,166,1,59,7812,1,166,4,4,99,101,105,111,7824,7829,7834,7846,114,59,3,55349,56503,109,105,59,1,8271,109,4,2,59,101,7841,7843,1,8765,59,1,8909,108,4,3,59,98,104,7855,7857,7860,1,92,59,1,10693,115,117,98,59,1,10184,4,2,108,109,7872,7885,108,4,2,59,101,7879,7881,1,8226,116,59,1,8226,112,4,3,59,69,101,7894,7896,7899,1,8782,59,1,10926,4,2,59,113,7905,7907,1,8783,59,1,8783,4,15,97,99,100,101,102,104,105,108,111,114,115,116,117,119,121,7942,8021,8075,8080,8121,8126,8157,8279,8295,8430,8446,8485,8491,8707,8726,4,3,99,112,114,7950,7956,8007,117,116,101,59,1,263,4,6,59,97,98,99,100,115,7970,7972,7977,7984,7998,8003,1,8745,110,100,59,1,10820,114,99,117,112,59,1,10825,4,2,97,117,7990,7994,112,59,1,10827,112,59,1,10823,111,116,59,1,10816,59,3,8745,65024,4,2,101,111,8013,8017,116,59,1,8257,110,59,1,711,4,4,97,101,105,117,8031,8046,8056,8061,4,2,112,114,8037,8041,115,59,1,10829,111,110,59,1,269,100,105,108,5,231,1,59,8054,1,231,114,99,59,1,265,112,115,4,2,59,115,8069,8071,1,10828,109,59,1,10832,111,116,59,1,267,4,3,100,109,110,8088,8097,8104,105,108,5,184,1,59,8095,1,184,112,116,121,118,59,1,10674,116,5,162,2,59,101,8112,8114,1,162,114,100,111,116,59,1,183,114,59,3,55349,56608,4,3,99,101,105,8134,8138,8154,121,59,1,1095,99,107,4,2,59,109,8146,8148,1,10003,97,114,107,59,1,10003,59,1,967,114,4,7,59,69,99,101,102,109,115,8174,8176,8179,8258,8261,8268,8273,1,9675,59,1,10691,4,3,59,101,108,8187,8189,8193,1,710,113,59,1,8791,101,4,2,97,100,8200,8223,114,114,111,119,4,2,108,114,8210,8216,101,102,116,59,1,8634,105,103,104,116,59,1,8635,4,5,82,83,97,99,100,8235,8238,8241,8246,8252,59,1,174,59,1,9416,115,116,59,1,8859,105,114,99,59,1,8858,97,115,104,59,1,8861,59,1,8791,110,105,110,116,59,1,10768,105,100,59,1,10991,99,105,114,59,1,10690,117,98,115,4,2,59,117,8288,8290,1,9827,105,116,59,1,9827,4,4,108,109,110,112,8305,8326,8376,8400,111,110,4,2,59,101,8313,8315,1,58,4,2,59,113,8321,8323,1,8788,59,1,8788,4,2,109,112,8332,8344,97,4,2,59,116,8339,8341,1,44,59,1,64,4,3,59,102,108,8352,8354,8358,1,8705,110,59,1,8728,101,4,2,109,120,8365,8371,101,110,116,59,1,8705,101,115,59,1,8450,4,2,103,105,8382,8395,4,2,59,100,8388,8390,1,8773,111,116,59,1,10861,110,116,59,1,8750,4,3,102,114,121,8408,8412,8417,59,3,55349,56660,111,100,59,1,8720,5,169,2,59,115,8424,8426,1,169,114,59,1,8471,4,2,97,111,8436,8441,114,114,59,1,8629,115,115,59,1,10007,4,2,99,117,8452,8457,114,59,3,55349,56504,4,2,98,112,8463,8474,4,2,59,101,8469,8471,1,10959,59,1,10961,4,2,59,101,8480,8482,1,10960,59,1,10962,100,111,116,59,1,8943,4,7,100,101,108,112,114,118,119,8507,8522,8536,8550,8600,8697,8702,97,114,114,4,2,108,114,8516,8519,59,1,10552,59,1,10549,4,2,112,115,8528,8532,114,59,1,8926,99,59,1,8927,97,114,114,4,2,59,112,8545,8547,1,8630,59,1,10557,4,6,59,98,99,100,111,115,8564,8566,8573,8587,8592,8596,1,8746,114,99,97,112,59,1,10824,4,2,97,117,8579,8583,112,59,1,10822,112,59,1,10826,111,116,59,1,8845,114,59,1,10821,59,3,8746,65024,4,4,97,108,114,118,8610,8623,8663,8672,114,114,4,2,59,109,8618,8620,1,8631,59,1,10556,121,4,3,101,118,119,8632,8651,8656,113,4,2,112,115,8639,8645,114,101,99,59,1,8926,117,99,99,59,1,8927,101,101,59,1,8910,101,100,103,101,59,1,8911,101,110,5,164,1,59,8670,1,164,101,97,114,114,111,119,4,2,108,114,8684,8690,101,102,116,59,1,8630,105,103,104,116,59,1,8631,101,101,59,1,8910,101,100,59,1,8911,4,2,99,105,8713,8721,111,110,105,110,116,59,1,8754,110,116,59,1,8753,108,99,116,121,59,1,9005,4,19,65,72,97,98,99,100,101,102,104,105,106,108,111,114,115,116,117,119,122,8773,8778,8783,8821,8839,8854,8887,8914,8930,8944,9036,9041,9058,9197,9227,9258,9281,9297,9305,114,114,59,1,8659,97,114,59,1,10597,4,4,103,108,114,115,8793,8799,8805,8809,103,101,114,59,1,8224,101,116,104,59,1,8504,114,59,1,8595,104,4,2,59,118,8816,8818,1,8208,59,1,8867,4,2,107,108,8827,8834,97,114,111,119,59,1,10511,97,99,59,1,733,4,2,97,121,8845,8851,114,111,110,59,1,271,59,1,1076,4,3,59,97,111,8862,8864,8880,1,8518,4,2,103,114,8870,8876,103,101,114,59,1,8225,114,59,1,8650,116,115,101,113,59,1,10871,4,3,103,108,109,8895,8902,8907,5,176,1,59,8900,1,176,116,97,59,1,948,112,116,121,118,59,1,10673,4,2,105,114,8920,8926,115,104,116,59,1,10623,59,3,55349,56609,97,114,4,2,108,114,8938,8941,59,1,8643,59,1,8642,4,5,97,101,103,115,118,8956,8986,8989,8996,9001,109,4,3,59,111,115,8965,8967,8983,1,8900,110,100,4,2,59,115,8975,8977,1,8900,117,105,116,59,1,9830,59,1,9830,59,1,168,97,109,109,97,59,1,989,105,110,59,1,8946,4,3,59,105,111,9009,9011,9031,1,247,100,101,5,247,2,59,111,9020,9022,1,247,110,116,105,109,101,115,59,1,8903,110,120,59,1,8903,99,121,59,1,1106,99,4,2,111,114,9048,9053,114,110,59,1,8990,111,112,59,1,8973,4,5,108,112,116,117,119,9070,9076,9081,9130,9144,108,97,114,59,1,36,102,59,3,55349,56661,4,5,59,101,109,112,115,9093,9095,9109,9116,9122,1,729,113,4,2,59,100,9102,9104,1,8784,111,116,59,1,8785,105,110,117,115,59,1,8760,108,117,115,59,1,8724,113,117,97,114,101,59,1,8865,98,108,101,98,97,114,119,101,100,103,101,59,1,8966,110,4,3,97,100,104,9153,9160,9172,114,114,111,119,59,1,8595,111,119,110,97,114,114,111,119,115,59,1,8650,97,114,112,111,111,110,4,2,108,114,9184,9190,101,102,116,59,1,8643,105,103,104,116,59,1,8642,4,2,98,99,9203,9211,107,97,114,111,119,59,1,10512,4,2,111,114,9217,9222,114,110,59,1,8991,111,112,59,1,8972,4,3,99,111,116,9235,9248,9252,4,2,114,121,9241,9245,59,3,55349,56505,59,1,1109,108,59,1,10742,114,111,107,59,1,273,4,2,100,114,9264,9269,111,116,59,1,8945,105,4,2,59,102,9276,9278,1,9663,59,1,9662,4,2,97,104,9287,9292,114,114,59,1,8693,97,114,59,1,10607,97,110,103,108,101,59,1,10662,4,2,99,105,9311,9315,121,59,1,1119,103,114,97,114,114,59,1,10239,4,18,68,97,99,100,101,102,103,108,109,110,111,112,113,114,115,116,117,120,9361,9376,9398,9439,9444,9447,9462,9495,9531,9585,9598,9614,9659,9755,9771,9792,9808,9826,4,2,68,111,9367,9372,111,116,59,1,10871,116,59,1,8785,4,2,99,115,9382,9392,117,116,101,5,233,1,59,9390,1,233,116,101,114,59,1,10862,4,4,97,105,111,121,9408,9414,9430,9436,114,111,110,59,1,283,114,4,2,59,99,9421,9423,1,8790,5,234,1,59,9428,1,234,108,111,110,59,1,8789,59,1,1101,111,116,59,1,279,59,1,8519,4,2,68,114,9453,9458,111,116,59,1,8786,59,3,55349,56610,4,3,59,114,115,9470,9472,9482,1,10906,97,118,101,5,232,1,59,9480,1,232,4,2,59,100,9488,9490,1,10902,111,116,59,1,10904,4,4,59,105,108,115,9505,9507,9515,9518,1,10905,110,116,101,114,115,59,1,9191,59,1,8467,4,2,59,100,9524,9526,1,10901,111,116,59,1,10903,4,3,97,112,115,9539,9544,9564,99,114,59,1,275,116,121,4,3,59,115,118,9554,9556,9561,1,8709,101,116,59,1,8709,59,1,8709,112,4,2,49,59,9571,9583,4,2,51,52,9577,9580,59,1,8196,59,1,8197,1,8195,4,2,103,115,9591,9594,59,1,331,112,59,1,8194,4,2,103,112,9604,9609,111,110,59,1,281,102,59,3,55349,56662,4,3,97,108,115,9622,9635,9640,114,4,2,59,115,9629,9631,1,8917,108,59,1,10723,117,115,59,1,10865,105,4,3,59,108,118,9649,9651,9656,1,949,111,110,59,1,949,59,1,1013,4,4,99,115,117,118,9669,9686,9716,9747,4,2,105,111,9675,9680,114,99,59,1,8790,108,111,110,59,1,8789,4,2,105,108,9692,9696,109,59,1,8770,97,110,116,4,2,103,108,9705,9710,116,114,59,1,10902,101,115,115,59,1,10901,4,3,97,101,105,9724,9729,9734,108,115,59,1,61,115,116,59,1,8799,118,4,2,59,68,9741,9743,1,8801,68,59,1,10872,112,97,114,115,108,59,1,10725,4,2,68,97,9761,9766,111,116,59,1,8787,114,114,59,1,10609,4,3,99,100,105,9779,9783,9788,114,59,1,8495,111,116,59,1,8784,109,59,1,8770,4,2,97,104,9798,9801,59,1,951,5,240,1,59,9806,1,240,4,2,109,114,9814,9822,108,5,235,1,59,9820,1,235,111,59,1,8364,4,3,99,105,112,9834,9838,9843,108,59,1,33,115,116,59,1,8707,4,2,101,111,9849,9859,99,116,97,116,105,111,110,59,1,8496,110,101,110,116,105,97,108,101,59,1,8519,4,12,97,99,101,102,105,106,108,110,111,112,114,115,9896,9910,9914,9921,9954,9960,9967,9989,9994,10027,10036,10164,108,108,105,110,103,100,111,116,115,101,113,59,1,8786,121,59,1,1092,109,97,108,101,59,1,9792,4,3,105,108,114,9929,9935,9950,108,105,103,59,1,64259,4,2,105,108,9941,9945,103,59,1,64256,105,103,59,1,64260,59,3,55349,56611,108,105,103,59,1,64257,108,105,103,59,3,102,106,4,3,97,108,116,9975,9979,9984,116,59,1,9837,105,103,59,1,64258,110,115,59,1,9649,111,102,59,1,402,4,2,112,114,10000,10005,102,59,3,55349,56663,4,2,97,107,10011,10016,108,108,59,1,8704,4,2,59,118,10022,10024,1,8916,59,1,10969,97,114,116,105,110,116,59,1,10765,4,2,97,111,10042,10159,4,2,99,115,10048,10155,4,6,49,50,51,52,53,55,10062,10102,10114,10135,10139,10151,4,6,50,51,52,53,54,56,10076,10083,10086,10093,10096,10099,5,189,1,59,10081,1,189,59,1,8531,5,188,1,59,10091,1,188,59,1,8533,59,1,8537,59,1,8539,4,2,51,53,10108,10111,59,1,8532,59,1,8534,4,3,52,53,56,10122,10129,10132,5,190,1,59,10127,1,190,59,1,8535,59,1,8540,53,59,1,8536,4,2,54,56,10145,10148,59,1,8538,59,1,8541,56,59,1,8542,108,59,1,8260,119,110,59,1,8994,99,114,59,3,55349,56507,4,17,69,97,98,99,100,101,102,103,105,106,108,110,111,114,115,116,118,10206,10217,10247,10254,10268,10273,10358,10363,10374,10380,10385,10406,10458,10464,10470,10497,10610,4,2,59,108,10212,10214,1,8807,59,1,10892,4,3,99,109,112,10225,10231,10244,117,116,101,59,1,501,109,97,4,2,59,100,10239,10241,1,947,59,1,989,59,1,10886,114,101,118,101,59,1,287,4,2,105,121,10260,10265,114,99,59,1,285,59,1,1075,111,116,59,1,289,4,4,59,108,113,115,10283,10285,10288,10308,1,8805,59,1,8923,4,3,59,113,115,10296,10298,10301,1,8805,59,1,8807,108,97,110,116,59,1,10878,4,4,59,99,100,108,10318,10320,10324,10345,1,10878,99,59,1,10921,111,116,4,2,59,111,10332,10334,1,10880,4,2,59,108,10340,10342,1,10882,59,1,10884,4,2,59,101,10351,10354,3,8923,65024,115,59,1,10900,114,59,3,55349,56612,4,2,59,103,10369,10371,1,8811,59,1,8921,109,101,108,59,1,8503,99,121,59,1,1107,4,4,59,69,97,106,10395,10397,10400,10403,1,8823,59,1,10898,59,1,10917,59,1,10916,4,4,69,97,101,115,10416,10419,10434,10453,59,1,8809,112,4,2,59,112,10426,10428,1,10890,114,111,120,59,1,10890,4,2,59,113,10440,10442,1,10888,4,2,59,113,10448,10450,1,10888,59,1,8809,105,109,59,1,8935,112,102,59,3,55349,56664,97,118,101,59,1,96,4,2,99,105,10476,10480,114,59,1,8458,109,4,3,59,101,108,10489,10491,10494,1,8819,59,1,10894,59,1,10896,5,62,6,59,99,100,108,113,114,10512,10514,10527,10532,10538,10545,1,62,4,2,99,105,10520,10523,59,1,10919,114,59,1,10874,111,116,59,1,8919,80,97,114,59,1,10645,117,101,115,116,59,1,10876,4,5,97,100,101,108,115,10557,10574,10579,10599,10605,4,2,112,114,10563,10570,112,114,111,120,59,1,10886,114,59,1,10616,111,116,59,1,8919,113,4,2,108,113,10586,10592,101,115,115,59,1,8923,108,101,115,115,59,1,10892,101,115,115,59,1,8823,105,109,59,1,8819,4,2,101,110,10616,10626,114,116,110,101,113,113,59,3,8809,65024,69,59,3,8809,65024,4,10,65,97,98,99,101,102,107,111,115,121,10653,10658,10713,10718,10724,10760,10765,10786,10850,10875,114,114,59,1,8660,4,4,105,108,109,114,10668,10674,10678,10684,114,115,112,59,1,8202,102,59,1,189,105,108,116,59,1,8459,4,2,100,114,10690,10695,99,121,59,1,1098,4,3,59,99,119,10703,10705,10710,1,8596,105,114,59,1,10568,59,1,8621,97,114,59,1,8463,105,114,99,59,1,293,4,3,97,108,114,10732,10748,10754,114,116,115,4,2,59,117,10741,10743,1,9829,105,116,59,1,9829,108,105,112,59,1,8230,99,111,110,59,1,8889,114,59,3,55349,56613,115,4,2,101,119,10772,10779,97,114,111,119,59,1,10533,97,114,111,119,59,1,10534,4,5,97,109,111,112,114,10798,10803,10809,10839,10844,114,114,59,1,8703,116,104,116,59,1,8763,107,4,2,108,114,10816,10827,101,102,116,97,114,114,111,119,59,1,8617,105,103,104,116,97,114,114,111,119,59,1,8618,102,59,3,55349,56665,98,97,114,59,1,8213,4,3,99,108,116,10858,10863,10869,114,59,3,55349,56509,97,115,104,59,1,8463,114,111,107,59,1,295,4,2,98,112,10881,10887,117,108,108,59,1,8259,104,101,110,59,1,8208,4,15,97,99,101,102,103,105,106,109,110,111,112,113,115,116,117,10925,10936,10958,10977,10990,11001,11039,11045,11101,11192,11220,11226,11237,11285,11299,99,117,116,101,5,237,1,59,10934,1,237,4,3,59,105,121,10944,10946,10955,1,8291,114,99,5,238,1,59,10953,1,238,59,1,1080,4,2,99,120,10964,10968,121,59,1,1077,99,108,5,161,1,59,10975,1,161,4,2,102,114,10983,10986,59,1,8660,59,3,55349,56614,114,97,118,101,5,236,1,59,10999,1,236,4,4,59,105,110,111,11011,11013,11028,11034,1,8520,4,2,105,110,11019,11024,110,116,59,1,10764,116,59,1,8749,102,105,110,59,1,10716,116,97,59,1,8489,108,105,103,59,1,307,4,3,97,111,112,11053,11092,11096,4,3,99,103,116,11061,11065,11088,114,59,1,299,4,3,101,108,112,11073,11076,11082,59,1,8465,105,110,101,59,1,8464,97,114,116,59,1,8465,104,59,1,305,102,59,1,8887,101,100,59,1,437,4,5,59,99,102,111,116,11113,11115,11121,11136,11142,1,8712,97,114,101,59,1,8453,105,110,4,2,59,116,11129,11131,1,8734,105,101,59,1,10717,100,111,116,59,1,305,4,5,59,99,101,108,112,11154,11156,11161,11179,11186,1,8747,97,108,59,1,8890,4,2,103,114,11167,11173,101,114,115,59,1,8484,99,97,108,59,1,8890,97,114,104,107,59,1,10775,114,111,100,59,1,10812,4,4,99,103,112,116,11202,11206,11211,11216,121,59,1,1105,111,110,59,1,303,102,59,3,55349,56666,97,59,1,953,114,111,100,59,1,10812,117,101,115,116,5,191,1,59,11235,1,191,4,2,99,105,11243,11248,114,59,3,55349,56510,110,4,5,59,69,100,115,118,11261,11263,11266,11271,11282,1,8712,59,1,8953,111,116,59,1,8949,4,2,59,118,11277,11279,1,8948,59,1,8947,59,1,8712,4,2,59,105,11291,11293,1,8290,108,100,101,59,1,297,4,2,107,109,11305,11310,99,121,59,1,1110,108,5,239,1,59,11316,1,239,4,6,99,102,109,111,115,117,11332,11346,11351,11357,11363,11380,4,2,105,121,11338,11343,114,99,59,1,309,59,1,1081,114,59,3,55349,56615,97,116,104,59,1,567,112,102,59,3,55349,56667,4,2,99,101,11369,11374,114,59,3,55349,56511,114,99,121,59,1,1112,107,99,121,59,1,1108,4,8,97,99,102,103,104,106,111,115,11404,11418,11433,11438,11445,11450,11455,11461,112,112,97,4,2,59,118,11413,11415,1,954,59,1,1008,4,2,101,121,11424,11430,100,105,108,59,1,311,59,1,1082,114,59,3,55349,56616,114,101,101,110,59,1,312,99,121,59,1,1093,99,121,59,1,1116,112,102,59,3,55349,56668,99,114,59,3,55349,56512,4,23,65,66,69,72,97,98,99,100,101,102,103,104,106,108,109,110,111,112,114,115,116,117,118,11515,11538,11544,11555,11560,11721,11780,11818,11868,12136,12160,12171,12203,12208,12246,12275,12327,12509,12523,12569,12641,12732,12752,4,3,97,114,116,11523,11528,11532,114,114,59,1,8666,114,59,1,8656,97,105,108,59,1,10523,97,114,114,59,1,10510,4,2,59,103,11550,11552,1,8806,59,1,10891,97,114,59,1,10594,4,9,99,101,103,109,110,112,113,114,116,11580,11586,11594,11600,11606,11624,11627,11636,11694,117,116,101,59,1,314,109,112,116,121,118,59,1,10676,114,97,110,59,1,8466,98,100,97,59,1,955,103,4,3,59,100,108,11615,11617,11620,1,10216,59,1,10641,101,59,1,10216,59,1,10885,117,111,5,171,1,59,11634,1,171,114,4,8,59,98,102,104,108,112,115,116,11655,11657,11669,11673,11677,11681,11685,11690,1,8592,4,2,59,102,11663,11665,1,8676,115,59,1,10527,115,59,1,10525,107,59,1,8617,112,59,1,8619,108,59,1,10553,105,109,59,1,10611,108,59,1,8610,4,3,59,97,101,11702,11704,11709,1,10923,105,108,59,1,10521,4,2,59,115,11715,11717,1,10925,59,3,10925,65024,4,3,97,98,114,11729,11734,11739,114,114,59,1,10508,114,107,59,1,10098,4,2,97,107,11745,11758,99,4,2,101,107,11752,11755,59,1,123,59,1,91,4,2,101,115,11764,11767,59,1,10635,108,4,2,100,117,11774,11777,59,1,10639,59,1,10637,4,4,97,101,117,121,11790,11796,11811,11815,114,111,110,59,1,318,4,2,100,105,11802,11807,105,108,59,1,316,108,59,1,8968,98,59,1,123,59,1,1083,4,4,99,113,114,115,11828,11832,11845,11864,97,59,1,10550,117,111,4,2,59,114,11840,11842,1,8220,59,1,8222,4,2,100,117,11851,11857,104,97,114,59,1,10599,115,104,97,114,59,1,10571,104,59,1,8626,4,5,59,102,103,113,115,11880,11882,12008,12011,12031,1,8804,116,4,5,97,104,108,114,116,11895,11913,11935,11947,11996,114,114,111,119,4,2,59,116,11905,11907,1,8592,97,105,108,59,1,8610,97,114,112,111,111,110,4,2,100,117,11925,11931,111,119,110,59,1,8637,112,59,1,8636,101,102,116,97,114,114,111,119,115,59,1,8647,105,103,104,116,4,3,97,104,115,11959,11974,11984,114,114,111,119,4,2,59,115,11969,11971,1,8596,59,1,8646,97,114,112,111,111,110,115,59,1,8651,113,117,105,103,97,114,114,111,119,59,1,8621,104,114,101,101,116,105,109,101,115,59,1,8907,59,1,8922,4,3,59,113,115,12019,12021,12024,1,8804,59,1,8806,108,97,110,116,59,1,10877,4,5,59,99,100,103,115,12043,12045,12049,12070,12083,1,10877,99,59,1,10920,111,116,4,2,59,111,12057,12059,1,10879,4,2,59,114,12065,12067,1,10881,59,1,10883,4,2,59,101,12076,12079,3,8922,65024,115,59,1,10899,4,5,97,100,101,103,115,12095,12103,12108,12126,12131,112,112,114,111,120,59,1,10885,111,116,59,1,8918,113,4,2,103,113,12115,12120,116,114,59,1,8922,103,116,114,59,1,10891,116,114,59,1,8822,105,109,59,1,8818,4,3,105,108,114,12144,12150,12156,115,104,116,59,1,10620,111,111,114,59,1,8970,59,3,55349,56617,4,2,59,69,12166,12168,1,8822,59,1,10897,4,2,97,98,12177,12198,114,4,2,100,117,12184,12187,59,1,8637,4,2,59,108,12193,12195,1,8636,59,1,10602,108,107,59,1,9604,99,121,59,1,1113,4,5,59,97,99,104,116,12220,12222,12227,12235,12241,1,8810,114,114,59,1,8647,111,114,110,101,114,59,1,8990,97,114,100,59,1,10603,114,105,59,1,9722,4,2,105,111,12252,12258,100,111,116,59,1,320,117,115,116,4,2,59,97,12267,12269,1,9136,99,104,101,59,1,9136,4,4,69,97,101,115,12285,12288,12303,12322,59,1,8808,112,4,2,59,112,12295,12297,1,10889,114,111,120,59,1,10889,4,2,59,113,12309,12311,1,10887,4,2,59,113,12317,12319,1,10887,59,1,8808,105,109,59,1,8934,4,8,97,98,110,111,112,116,119,122,12345,12359,12364,12421,12446,12467,12474,12490,4,2,110,114,12351,12355,103,59,1,10220,114,59,1,8701,114,107,59,1,10214,103,4,3,108,109,114,12373,12401,12409,101,102,116,4,2,97,114,12382,12389,114,114,111,119,59,1,10229,105,103,104,116,97,114,114,111,119,59,1,10231,97,112,115,116,111,59,1,10236,105,103,104,116,97,114,114,111,119,59,1,10230,112,97,114,114,111,119,4,2,108,114,12433,12439,101,102,116,59,1,8619,105,103,104,116,59,1,8620,4,3,97,102,108,12454,12458,12462,114,59,1,10629,59,3,55349,56669,117,115,59,1,10797,105,109,101,115,59,1,10804,4,2,97,98,12480,12485,115,116,59,1,8727,97,114,59,1,95,4,3,59,101,102,12498,12500,12506,1,9674,110,103,101,59,1,9674,59,1,10731,97,114,4,2,59,108,12517,12519,1,40,116,59,1,10643,4,5,97,99,104,109,116,12535,12540,12548,12561,12564,114,114,59,1,8646,111,114,110,101,114,59,1,8991,97,114,4,2,59,100,12556,12558,1,8651,59,1,10605,59,1,8206,114,105,59,1,8895,4,6,97,99,104,105,113,116,12583,12589,12594,12597,12614,12635,113,117,111,59,1,8249,114,59,3,55349,56513,59,1,8624,109,4,3,59,101,103,12606,12608,12611,1,8818,59,1,10893,59,1,10895,4,2,98,117,12620,12623,59,1,91,111,4,2,59,114,12630,12632,1,8216,59,1,8218,114,111,107,59,1,322,5,60,8,59,99,100,104,105,108,113,114,12660,12662,12675,12680,12686,12692,12698,12705,1,60,4,2,99,105,12668,12671,59,1,10918,114,59,1,10873,111,116,59,1,8918,114,101,101,59,1,8907,109,101,115,59,1,8905,97,114,114,59,1,10614,117,101,115,116,59,1,10875,4,2,80,105,12711,12716,97,114,59,1,10646,4,3,59,101,102,12724,12726,12729,1,9667,59,1,8884,59,1,9666,114,4,2,100,117,12739,12746,115,104,97,114,59,1,10570,104,97,114,59,1,10598,4,2,101,110,12758,12768,114,116,110,101,113,113,59,3,8808,65024,69,59,3,8808,65024,4,14,68,97,99,100,101,102,104,105,108,110,111,112,115,117,12803,12809,12893,12908,12914,12928,12933,12937,13011,13025,13032,13049,13052,13069,68,111,116,59,1,8762,4,4,99,108,112,114,12819,12827,12849,12887,114,5,175,1,59,12825,1,175,4,2,101,116,12833,12836,59,1,9794,4,2,59,101,12842,12844,1,10016,115,101,59,1,10016,4,2,59,115,12855,12857,1,8614,116,111,4,4,59,100,108,117,12869,12871,12877,12883,1,8614,111,119,110,59,1,8615,101,102,116,59,1,8612,112,59,1,8613,107,101,114,59,1,9646,4,2,111,121,12899,12905,109,109,97,59,1,10793,59,1,1084,97,115,104,59,1,8212,97,115,117,114,101,100,97,110,103,108,101,59,1,8737,114,59,3,55349,56618,111,59,1,8487,4,3,99,100,110,12945,12954,12985,114,111,5,181,1,59,12952,1,181,4,4,59,97,99,100,12964,12966,12971,12976,1,8739,115,116,59,1,42,105,114,59,1,10992,111,116,5,183,1,59,12983,1,183,117,115,4,3,59,98,100,12995,12997,13000,1,8722,59,1,8863,4,2,59,117,13006,13008,1,8760,59,1,10794,4,2,99,100,13017,13021,112,59,1,10971,114,59,1,8230,112,108,117,115,59,1,8723,4,2,100,112,13038,13044,101,108,115,59,1,8871,102,59,3,55349,56670,59,1,8723,4,2,99,116,13058,13063,114,59,3,55349,56514,112,111,115,59,1,8766,4,3,59,108,109,13077,13079,13087,1,956,116,105,109,97,112,59,1,8888,97,112,59,1,8888,4,24,71,76,82,86,97,98,99,100,101,102,103,104,105,106,108,109,111,112,114,115,116,117,118,119,13142,13165,13217,13229,13247,13330,13359,13414,13420,13508,13513,13579,13602,13626,13631,13762,13767,13855,13936,13995,14214,14285,14312,14432,4,2,103,116,13148,13152,59,3,8921,824,4,2,59,118,13158,13161,3,8811,8402,59,3,8811,824,4,3,101,108,116,13173,13200,13204,102,116,4,2,97,114,13181,13188,114,114,111,119,59,1,8653,105,103,104,116,97,114,114,111,119,59,1,8654,59,3,8920,824,4,2,59,118,13210,13213,3,8810,8402,59,3,8810,824,105,103,104,116,97,114,114,111,119,59,1,8655,4,2,68,100,13235,13241,97,115,104,59,1,8879,97,115,104,59,1,8878,4,5,98,99,110,112,116,13259,13264,13270,13275,13308,108,97,59,1,8711,117,116,101,59,1,324,103,59,3,8736,8402,4,5,59,69,105,111,112,13287,13289,13293,13298,13302,1,8777,59,3,10864,824,100,59,3,8779,824,115,59,1,329,114,111,120,59,1,8777,117,114,4,2,59,97,13316,13318,1,9838,108,4,2,59,115,13325,13327,1,9838,59,1,8469,4,2,115,117,13336,13344,112,5,160,1,59,13342,1,160,109,112,4,2,59,101,13352,13355,3,8782,824,59,3,8783,824,4,5,97,101,111,117,121,13371,13385,13391,13407,13411,4,2,112,114,13377,13380,59,1,10819,111,110,59,1,328,100,105,108,59,1,326,110,103,4,2,59,100,13399,13401,1,8775,111,116,59,3,10861,824,112,59,1,10818,59,1,1085,97,115,104,59,1,8211,4,7,59,65,97,100,113,115,120,13436,13438,13443,13466,13472,13478,13494,1,8800,114,114,59,1,8663,114,4,2,104,114,13450,13454,107,59,1,10532,4,2,59,111,13460,13462,1,8599,119,59,1,8599,111,116,59,3,8784,824,117,105,118,59,1,8802,4,2,101,105,13484,13489,97,114,59,1,10536,109,59,3,8770,824,105,115,116,4,2,59,115,13503,13505,1,8708,59,1,8708,114,59,3,55349,56619,4,4,69,101,115,116,13523,13527,13563,13568,59,3,8807,824,4,3,59,113,115,13535,13537,13559,1,8817,4,3,59,113,115,13545,13547,13551,1,8817,59,3,8807,824,108,97,110,116,59,3,10878,824,59,3,10878,824,105,109,59,1,8821,4,2,59,114,13574,13576,1,8815,59,1,8815,4,3,65,97,112,13587,13592,13597,114,114,59,1,8654,114,114,59,1,8622,97,114,59,1,10994,4,3,59,115,118,13610,13612,13623,1,8715,4,2,59,100,13618,13620,1,8956,59,1,8954,59,1,8715,99,121,59,1,1114,4,7,65,69,97,100,101,115,116,13647,13652,13656,13661,13665,13737,13742,114,114,59,1,8653,59,3,8806,824,114,114,59,1,8602,114,59,1,8229,4,4,59,102,113,115,13675,13677,13703,13725,1,8816,116,4,2,97,114,13684,13691,114,114,111,119,59,1,8602,105,103,104,116,97,114,114,111,119,59,1,8622,4,3,59,113,115,13711,13713,13717,1,8816,59,3,8806,824,108,97,110,116,59,3,10877,824,4,2,59,115,13731,13734,3,10877,824,59,1,8814,105,109,59,1,8820,4,2,59,114,13748,13750,1,8814,105,4,2,59,101,13757,13759,1,8938,59,1,8940,105,100,59,1,8740,4,2,112,116,13773,13778,102,59,3,55349,56671,5,172,3,59,105,110,13787,13789,13829,1,172,110,4,4,59,69,100,118,13800,13802,13806,13812,1,8713,59,3,8953,824,111,116,59,3,8949,824,4,3,97,98,99,13820,13823,13826,59,1,8713,59,1,8951,59,1,8950,105,4,2,59,118,13836,13838,1,8716,4,3,97,98,99,13846,13849,13852,59,1,8716,59,1,8958,59,1,8957,4,3,97,111,114,13863,13892,13899,114,4,4,59,97,115,116,13874,13876,13883,13888,1,8742,108,108,101,108,59,1,8742,108,59,3,11005,8421,59,3,8706,824,108,105,110,116,59,1,10772,4,3,59,99,101,13907,13909,13914,1,8832,117,101,59,1,8928,4,2,59,99,13920,13923,3,10927,824,4,2,59,101,13929,13931,1,8832,113,59,3,10927,824,4,4,65,97,105,116,13946,13951,13971,13982,114,114,59,1,8655,114,114,4,3,59,99,119,13961,13963,13967,1,8603,59,3,10547,824,59,3,8605,824,103,104,116,97,114,114,111,119,59,1,8603,114,105,4,2,59,101,13990,13992,1,8939,59,1,8941,4,7,99,104,105,109,112,113,117,14011,14036,14060,14080,14085,14090,14106,4,4,59,99,101,114,14021,14023,14028,14032,1,8833,117,101,59,1,8929,59,3,10928,824,59,3,55349,56515,111,114,116,4,2,109,112,14045,14050,105,100,59,1,8740,97,114,97,108,108,101,108,59,1,8742,109,4,2,59,101,14067,14069,1,8769,4,2,59,113,14075,14077,1,8772,59,1,8772,105,100,59,1,8740,97,114,59,1,8742,115,117,4,2,98,112,14098,14102,101,59,1,8930,101,59,1,8931,4,3,98,99,112,14114,14157,14171,4,4,59,69,101,115,14124,14126,14130,14133,1,8836,59,3,10949,824,59,1,8840,101,116,4,2,59,101,14141,14144,3,8834,8402,113,4,2,59,113,14151,14153,1,8840,59,3,10949,824,99,4,2,59,101,14164,14166,1,8833,113,59,3,10928,824,4,4,59,69,101,115,14181,14183,14187,14190,1,8837,59,3,10950,824,59,1,8841,101,116,4,2,59,101,14198,14201,3,8835,8402,113,4,2,59,113,14208,14210,1,8841,59,3,10950,824,4,4,103,105,108,114,14224,14228,14238,14242,108,59,1,8825,108,100,101,5,241,1,59,14236,1,241,103,59,1,8824,105,97,110,103,108,101,4,2,108,114,14254,14269,101,102,116,4,2,59,101,14263,14265,1,8938,113,59,1,8940,105,103,104,116,4,2,59,101,14279,14281,1,8939,113,59,1,8941,4,2,59,109,14291,14293,1,957,4,3,59,101,115,14301,14303,14308,1,35,114,111,59,1,8470,112,59,1,8199,4,9,68,72,97,100,103,105,108,114,115,14332,14338,14344,14349,14355,14369,14376,14408,14426,97,115,104,59,1,8877,97,114,114,59,1,10500,112,59,3,8781,8402,97,115,104,59,1,8876,4,2,101,116,14361,14365,59,3,8805,8402,59,3,62,8402,110,102,105,110,59,1,10718,4,3,65,101,116,14384,14389,14393,114,114,59,1,10498,59,3,8804,8402,4,2,59,114,14399,14402,3,60,8402,105,101,59,3,8884,8402,4,2,65,116,14414,14419,114,114,59,1,10499,114,105,101,59,3,8885,8402,105,109,59,3,8764,8402,4,3,65,97,110,14440,14445,14468,114,114,59,1,8662,114,4,2,104,114,14452,14456,107,59,1,10531,4,2,59,111,14462,14464,1,8598,119,59,1,8598,101,97,114,59,1,10535,4,18,83,97,99,100,101,102,103,104,105,108,109,111,112,114,115,116,117,118,14512,14515,14535,14560,14597,14603,14618,14643,14657,14662,14701,14741,14747,14769,14851,14877,14907,14916,59,1,9416,4,2,99,115,14521,14531,117,116,101,5,243,1,59,14529,1,243,116,59,1,8859,4,2,105,121,14541,14557,114,4,2,59,99,14548,14550,1,8858,5,244,1,59,14555,1,244,59,1,1086,4,5,97,98,105,111,115,14572,14577,14583,14587,14591,115,104,59,1,8861,108,97,99,59,1,337,118,59,1,10808,116,59,1,8857,111,108,100,59,1,10684,108,105,103,59,1,339,4,2,99,114,14609,14614,105,114,59,1,10687,59,3,55349,56620,4,3,111,114,116,14626,14630,14640,110,59,1,731,97,118,101,5,242,1,59,14638,1,242,59,1,10689,4,2,98,109,14649,14654,97,114,59,1,10677,59,1,937,110,116,59,1,8750,4,4,97,99,105,116,14672,14677,14693,14698,114,114,59,1,8634,4,2,105,114,14683,14687,114,59,1,10686,111,115,115,59,1,10683,110,101,59,1,8254,59,1,10688,4,3,97,101,105,14709,14714,14719,99,114,59,1,333,103,97,59,1,969,4,3,99,100,110,14727,14733,14736,114,111,110,59,1,959,59,1,10678,117,115,59,1,8854,112,102,59,3,55349,56672,4,3,97,101,108,14755,14759,14764,114,59,1,10679,114,112,59,1,10681,117,115,59,1,8853,4,7,59,97,100,105,111,115,118,14785,14787,14792,14831,14837,14841,14848,1,8744,114,114,59,1,8635,4,4,59,101,102,109,14802,14804,14817,14824,1,10845,114,4,2,59,111,14811,14813,1,8500,102,59,1,8500,5,170,1,59,14822,1,170,5,186,1,59,14829,1,186,103,111,102,59,1,8886,114,59,1,10838,108,111,112,101,59,1,10839,59,1,10843,4,3,99,108,111,14859,14863,14873,114,59,1,8500,97,115,104,5,248,1,59,14871,1,248,108,59,1,8856,105,4,2,108,109,14884,14893,100,101,5,245,1,59,14891,1,245,101,115,4,2,59,97,14901,14903,1,8855,115,59,1,10806,109,108,5,246,1,59,14914,1,246,98,97,114,59,1,9021,4,12,97,99,101,102,104,105,108,109,111,114,115,117,14948,14992,14996,15033,15038,15068,15090,15189,15192,15222,15427,15441,114,4,4,59,97,115,116,14959,14961,14976,14989,1,8741,5,182,2,59,108,14968,14970,1,182,108,101,108,59,1,8741,4,2,105,108,14982,14986,109,59,1,10995,59,1,11005,59,1,8706,121,59,1,1087,114,4,5,99,105,109,112,116,15009,15014,15019,15024,15027,110,116,59,1,37,111,100,59,1,46,105,108,59,1,8240,59,1,8869,101,110,107,59,1,8241,114,59,3,55349,56621,4,3,105,109,111,15046,15057,15063,4,2,59,118,15052,15054,1,966,59,1,981,109,97,116,59,1,8499,110,101,59,1,9742,4,3,59,116,118,15076,15078,15087,1,960,99,104,102,111,114,107,59,1,8916,59,1,982,4,2,97,117,15096,15119,110,4,2,99,107,15103,15115,107,4,2,59,104,15110,15112,1,8463,59,1,8462,118,59,1,8463,115,4,9,59,97,98,99,100,101,109,115,116,15140,15142,15148,15151,15156,15168,15171,15179,15184,1,43,99,105,114,59,1,10787,59,1,8862,105,114,59,1,10786,4,2,111,117,15162,15165,59,1,8724,59,1,10789,59,1,10866,110,5,177,1,59,15177,1,177,105,109,59,1,10790,119,111,59,1,10791,59,1,177,4,3,105,112,117,15200,15208,15213,110,116,105,110,116,59,1,10773,102,59,3,55349,56673,110,100,5,163,1,59,15220,1,163,4,10,59,69,97,99,101,105,110,111,115,117,15244,15246,15249,15253,15258,15334,15347,15367,15416,15421,1,8826,59,1,10931,112,59,1,10935,117,101,59,1,8828,4,2,59,99,15264,15266,1,10927,4,6,59,97,99,101,110,115,15280,15282,15290,15299,15303,15329,1,8826,112,112,114,111,120,59,1,10935,117,114,108,121,101,113,59,1,8828,113,59,1,10927,4,3,97,101,115,15311,15319,15324,112,112,114,111,120,59,1,10937,113,113,59,1,10933,105,109,59,1,8936,105,109,59,1,8830,109,101,4,2,59,115,15342,15344,1,8242,59,1,8473,4,3,69,97,115,15355,15358,15362,59,1,10933,112,59,1,10937,105,109,59,1,8936,4,3,100,102,112,15375,15378,15404,59,1,8719,4,3,97,108,115,15386,15392,15398,108,97,114,59,1,9006,105,110,101,59,1,8978,117,114,102,59,1,8979,4,2,59,116,15410,15412,1,8733,111,59,1,8733,105,109,59,1,8830,114,101,108,59,1,8880,4,2,99,105,15433,15438,114,59,3,55349,56517,59,1,968,110,99,115,112,59,1,8200,4,6,102,105,111,112,115,117,15462,15467,15472,15478,15485,15491,114,59,3,55349,56622,110,116,59,1,10764,112,102,59,3,55349,56674,114,105,109,101,59,1,8279,99,114,59,3,55349,56518,4,3,97,101,111,15499,15520,15534,116,4,2,101,105,15506,15515,114,110,105,111,110,115,59,1,8461,110,116,59,1,10774,115,116,4,2,59,101,15528,15530,1,63,113,59,1,8799,116,5,34,1,59,15540,1,34,4,21,65,66,72,97,98,99,100,101,102,104,105,108,109,110,111,112,114,115,116,117,120,15586,15609,15615,15620,15796,15855,15893,15931,15977,16001,16039,16183,16204,16222,16228,16285,16312,16318,16363,16408,16416,4,3,97,114,116,15594,15599,15603,114,114,59,1,8667,114,59,1,8658,97,105,108,59,1,10524,97,114,114,59,1,10511,97,114,59,1,10596,4,7,99,100,101,110,113,114,116,15636,15651,15656,15664,15687,15696,15770,4,2,101,117,15642,15646,59,3,8765,817,116,101,59,1,341,105,99,59,1,8730,109,112,116,121,118,59,1,10675,103,4,4,59,100,101,108,15675,15677,15680,15683,1,10217,59,1,10642,59,1,10661,101,59,1,10217,117,111,5,187,1,59,15694,1,187,114,4,11,59,97,98,99,102,104,108,112,115,116,119,15721,15723,15727,15739,15742,15746,15750,15754,15758,15763,15767,1,8594,112,59,1,10613,4,2,59,102,15733,15735,1,8677,115,59,1,10528,59,1,10547,115,59,1,10526,107,59,1,8618,112,59,1,8620,108,59,1,10565,105,109,59,1,10612,108,59,1,8611,59,1,8605,4,2,97,105,15776,15781,105,108,59,1,10522,111,4,2,59,110,15788,15790,1,8758,97,108,115,59,1,8474,4,3,97,98,114,15804,15809,15814,114,114,59,1,10509,114,107,59,1,10099,4,2,97,107,15820,15833,99,4,2,101,107,15827,15830,59,1,125,59,1,93,4,2,101,115,15839,15842,59,1,10636,108,4,2,100,117,15849,15852,59,1,10638,59,1,10640,4,4,97,101,117,121,15865,15871,15886,15890,114,111,110,59,1,345,4,2,100,105,15877,15882,105,108,59,1,343,108,59,1,8969,98,59,1,125,59,1,1088,4,4,99,108,113,115,15903,15907,15914,15927,97,59,1,10551,100,104,97,114,59,1,10601,117,111,4,2,59,114,15922,15924,1,8221,59,1,8221,104,59,1,8627,4,3,97,99,103,15939,15966,15970,108,4,4,59,105,112,115,15950,15952,15957,15963,1,8476,110,101,59,1,8475,97,114,116,59,1,8476,59,1,8477,116,59,1,9645,5,174,1,59,15975,1,174,4,3,105,108,114,15985,15991,15997,115,104,116,59,1,10621,111,111,114,59,1,8971,59,3,55349,56623,4,2,97,111,16007,16028,114,4,2,100,117,16014,16017,59,1,8641,4,2,59,108,16023,16025,1,8640,59,1,10604,4,2,59,118,16034,16036,1,961,59,1,1009,4,3,103,110,115,16047,16167,16171,104,116,4,6,97,104,108,114,115,116,16063,16081,16103,16130,16143,16155,114,114,111,119,4,2,59,116,16073,16075,1,8594,97,105,108,59,1,8611,97,114,112,111,111,110,4,2,100,117,16093,16099,111,119,110,59,1,8641,112,59,1,8640,101,102,116,4,2,97,104,16112,16120,114,114,111,119,115,59,1,8644,97,114,112,111,111,110,115,59,1,8652,105,103,104,116,97,114,114,111,119,115,59,1,8649,113,117,105,103,97,114,114,111,119,59,1,8605,104,114,101,101,116,105,109,101,115,59,1,8908,103,59,1,730,105,110,103,100,111,116,115,101,113,59,1,8787,4,3,97,104,109,16191,16196,16201,114,114,59,1,8644,97,114,59,1,8652,59,1,8207,111,117,115,116,4,2,59,97,16214,16216,1,9137,99,104,101,59,1,9137,109,105,100,59,1,10990,4,4,97,98,112,116,16238,16252,16257,16278,4,2,110,114,16244,16248,103,59,1,10221,114,59,1,8702,114,107,59,1,10215,4,3,97,102,108,16265,16269,16273,114,59,1,10630,59,3,55349,56675,117,115,59,1,10798,105,109,101,115,59,1,10805,4,2,97,112,16291,16304,114,4,2,59,103,16298,16300,1,41,116,59,1,10644,111,108,105,110,116,59,1,10770,97,114,114,59,1,8649,4,4,97,99,104,113,16328,16334,16339,16342,113,117,111,59,1,8250,114,59,3,55349,56519,59,1,8625,4,2,98,117,16348,16351,59,1,93,111,4,2,59,114,16358,16360,1,8217,59,1,8217,4,3,104,105,114,16371,16377,16383,114,101,101,59,1,8908,109,101,115,59,1,8906,105,4,4,59,101,102,108,16394,16396,16399,16402,1,9657,59,1,8885,59,1,9656,116,114,105,59,1,10702,108,117,104,97,114,59,1,10600,59,1,8478,4,19,97,98,99,100,101,102,104,105,108,109,111,112,113,114,115,116,117,119,122,16459,16466,16472,16572,16590,16672,16687,16746,16844,16850,16924,16963,16988,17115,17121,17154,17206,17614,17656,99,117,116,101,59,1,347,113,117,111,59,1,8218,4,10,59,69,97,99,101,105,110,112,115,121,16494,16496,16499,16513,16518,16531,16536,16556,16564,16569,1,8827,59,1,10932,4,2,112,114,16505,16508,59,1,10936,111,110,59,1,353,117,101,59,1,8829,4,2,59,100,16524,16526,1,10928,105,108,59,1,351,114,99,59,1,349,4,3,69,97,115,16544,16547,16551,59,1,10934,112,59,1,10938,105,109,59,1,8937,111,108,105,110,116,59,1,10771,105,109,59,1,8831,59,1,1089,111,116,4,3,59,98,101,16582,16584,16587,1,8901,59,1,8865,59,1,10854,4,7,65,97,99,109,115,116,120,16606,16611,16634,16642,16646,16652,16668,114,114,59,1,8664,114,4,2,104,114,16618,16622,107,59,1,10533,4,2,59,111,16628,16630,1,8600,119,59,1,8600,116,5,167,1,59,16640,1,167,105,59,1,59,119,97,114,59,1,10537,109,4,2,105,110,16659,16665,110,117,115,59,1,8726,59,1,8726,116,59,1,10038,114,4,2,59,111,16679,16682,3,55349,56624,119,110,59,1,8994,4,4,97,99,111,121,16697,16702,16716,16739,114,112,59,1,9839,4,2,104,121,16708,16713,99,121,59,1,1097,59,1,1096,114,116,4,2,109,112,16724,16729,105,100,59,1,8739,97,114,97,108,108,101,108,59,1,8741,5,173,1,59,16744,1,173,4,2,103,109,16752,16770,109,97,4,3,59,102,118,16762,16764,16767,1,963,59,1,962,59,1,962,4,8,59,100,101,103,108,110,112,114,16788,16790,16795,16806,16817,16828,16832,16838,1,8764,111,116,59,1,10858,4,2,59,113,16801,16803,1,8771,59,1,8771,4,2,59,69,16812,16814,1,10910,59,1,10912,4,2,59,69,16823,16825,1,10909,59,1,10911,101,59,1,8774,108,117,115,59,1,10788,97,114,114,59,1,10610,97,114,114,59,1,8592,4,4,97,101,105,116,16860,16883,16891,16904,4,2,108,115,16866,16878,108,115,101,116,109,105,110,117,115,59,1,8726,104,112,59,1,10803,112,97,114,115,108,59,1,10724,4,2,100,108,16897,16900,59,1,8739,101,59,1,8995,4,2,59,101,16910,16912,1,10922,4,2,59,115,16918,16920,1,10924,59,3,10924,65024,4,3,102,108,112,16932,16938,16958,116,99,121,59,1,1100,4,2,59,98,16944,16946,1,47,4,2,59,97,16952,16954,1,10692,114,59,1,9023,102,59,3,55349,56676,97,4,2,100,114,16970,16985,101,115,4,2,59,117,16978,16980,1,9824,105,116,59,1,9824,59,1,8741,4,3,99,115,117,16996,17028,17089,4,2,97,117,17002,17015,112,4,2,59,115,17009,17011,1,8851,59,3,8851,65024,112,4,2,59,115,17022,17024,1,8852,59,3,8852,65024,117,4,2,98,112,17035,17062,4,3,59,101,115,17043,17045,17048,1,8847,59,1,8849,101,116,4,2,59,101,17056,17058,1,8847,113,59,1,8849,4,3,59,101,115,17070,17072,17075,1,8848,59,1,8850,101,116,4,2,59,101,17083,17085,1,8848,113,59,1,8850,4,3,59,97,102,17097,17099,17112,1,9633,114,4,2,101,102,17106,17109,59,1,9633,59,1,9642,59,1,9642,97,114,114,59,1,8594,4,4,99,101,109,116,17131,17136,17142,17148,114,59,3,55349,56520,116,109,110,59,1,8726,105,108,101,59,1,8995,97,114,102,59,1,8902,4,2,97,114,17160,17172,114,4,2,59,102,17167,17169,1,9734,59,1,9733,4,2,97,110,17178,17202,105,103,104,116,4,2,101,112,17188,17197,112,115,105,108,111,110,59,1,1013,104,105,59,1,981,115,59,1,175,4,5,98,99,109,110,112,17218,17351,17420,17423,17427,4,9,59,69,100,101,109,110,112,114,115,17238,17240,17243,17248,17261,17267,17279,17285,17291,1,8834,59,1,10949,111,116,59,1,10941,4,2,59,100,17254,17256,1,8838,111,116,59,1,10947,117,108,116,59,1,10945,4,2,69,101,17273,17276,59,1,10955,59,1,8842,108,117,115,59,1,10943,97,114,114,59,1,10617,4,3,101,105,117,17299,17335,17339,116,4,3,59,101,110,17308,17310,17322,1,8834,113,4,2,59,113,17317,17319,1,8838,59,1,10949,101,113,4,2,59,113,17330,17332,1,8842,59,1,10955,109,59,1,10951,4,2,98,112,17345,17348,59,1,10965,59,1,10963,99,4,6,59,97,99,101,110,115,17366,17368,17376,17385,17389,17415,1,8827,112,112,114,111,120,59,1,10936,117,114,108,121,101,113,59,1,8829,113,59,1,10928,4,3,97,101,115,17397,17405,17410,112,112,114,111,120,59,1,10938,113,113,59,1,10934,105,109,59,1,8937,105,109,59,1,8831,59,1,8721,103,59,1,9834,4,13,49,50,51,59,69,100,101,104,108,109,110,112,115,17455,17462,17469,17476,17478,17481,17496,17509,17524,17530,17536,17548,17554,5,185,1,59,17460,1,185,5,178,1,59,17467,1,178,5,179,1,59,17474,1,179,1,8835,59,1,10950,4,2,111,115,17487,17491,116,59,1,10942,117,98,59,1,10968,4,2,59,100,17502,17504,1,8839,111,116,59,1,10948,115,4,2,111,117,17516,17520,108,59,1,10185,98,59,1,10967,97,114,114,59,1,10619,117,108,116,59,1,10946,4,2,69,101,17542,17545,59,1,10956,59,1,8843,108,117,115,59,1,10944,4,3,101,105,117,17562,17598,17602,116,4,3,59,101,110,17571,17573,17585,1,8835,113,4,2,59,113,17580,17582,1,8839,59,1,10950,101,113,4,2,59,113,17593,17595,1,8843,59,1,10956,109,59,1,10952,4,2,98,112,17608,17611,59,1,10964,59,1,10966,4,3,65,97,110,17622,17627,17650,114,114,59,1,8665,114,4,2,104,114,17634,17638,107,59,1,10534,4,2,59,111,17644,17646,1,8601,119,59,1,8601,119,97,114,59,1,10538,108,105,103,5,223,1,59,17664,1,223,4,13,97,98,99,100,101,102,104,105,111,112,114,115,119,17694,17709,17714,17737,17742,17749,17754,17860,17905,17957,17964,18090,18122,4,2,114,117,17700,17706,103,101,116,59,1,8982,59,1,964,114,107,59,1,9140,4,3,97,101,121,17722,17728,17734,114,111,110,59,1,357,100,105,108,59,1,355,59,1,1090,111,116,59,1,8411,108,114,101,99,59,1,8981,114,59,3,55349,56625,4,4,101,105,107,111,17764,17805,17836,17851,4,2,114,116,17770,17786,101,4,2,52,102,17777,17780,59,1,8756,111,114,101,59,1,8756,97,4,3,59,115,118,17795,17797,17802,1,952,121,109,59,1,977,59,1,977,4,2,99,110,17811,17831,107,4,2,97,115,17818,17826,112,112,114,111,120,59,1,8776,105,109,59,1,8764,115,112,59,1,8201,4,2,97,115,17842,17846,112,59,1,8776,105,109,59,1,8764,114,110,5,254,1,59,17858,1,254,4,3,108,109,110,17868,17873,17901,100,101,59,1,732,101,115,5,215,3,59,98,100,17884,17886,17898,1,215,4,2,59,97,17892,17894,1,8864,114,59,1,10801,59,1,10800,116,59,1,8749,4,3,101,112,115,17913,17917,17953,97,59,1,10536,4,4,59,98,99,102,17927,17929,17934,17939,1,8868,111,116,59,1,9014,105,114,59,1,10993,4,2,59,111,17945,17948,3,55349,56677,114,107,59,1,10970,97,59,1,10537,114,105,109,101,59,1,8244,4,3,97,105,112,17972,17977,18082,100,101,59,1,8482,4,7,97,100,101,109,112,115,116,17993,18051,18056,18059,18066,18072,18076,110,103,108,101,4,5,59,100,108,113,114,18009,18011,18017,18032,18035,1,9653,111,119,110,59,1,9663,101,102,116,4,2,59,101,18026,18028,1,9667,113,59,1,8884,59,1,8796,105,103,104,116,4,2,59,101,18045,18047,1,9657,113,59,1,8885,111,116,59,1,9708,59,1,8796,105,110,117,115,59,1,10810,108,117,115,59,1,10809,98,59,1,10701,105,109,101,59,1,10811,101,122,105,117,109,59,1,9186,4,3,99,104,116,18098,18111,18116,4,2,114,121,18104,18108,59,3,55349,56521,59,1,1094,99,121,59,1,1115,114,111,107,59,1,359,4,2,105,111,18128,18133,120,116,59,1,8812,104,101,97,100,4,2,108,114,18143,18154,101,102,116,97,114,114,111,119,59,1,8606,105,103,104,116,97,114,114,111,119,59,1,8608,4,18,65,72,97,98,99,100,102,103,104,108,109,111,112,114,115,116,117,119,18204,18209,18214,18234,18250,18268,18292,18308,18319,18343,18379,18397,18413,18504,18547,18553,18584,18603,114,114,59,1,8657,97,114,59,1,10595,4,2,99,114,18220,18230,117,116,101,5,250,1,59,18228,1,250,114,59,1,8593,114,4,2,99,101,18241,18245,121,59,1,1118,118,101,59,1,365,4,2,105,121,18256,18265,114,99,5,251,1,59,18263,1,251,59,1,1091,4,3,97,98,104,18276,18281,18287,114,114,59,1,8645,108,97,99,59,1,369,97,114,59,1,10606,4,2,105,114,18298,18304,115,104,116,59,1,10622,59,3,55349,56626,114,97,118,101,5,249,1,59,18317,1,249,4,2,97,98,18325,18338,114,4,2,108,114,18332,18335,59,1,8639,59,1,8638,108,107,59,1,9600,4,2,99,116,18349,18374,4,2,111,114,18355,18369,114,110,4,2,59,101,18363,18365,1,8988,114,59,1,8988,111,112,59,1,8975,114,105,59,1,9720,4,2,97,108,18385,18390,99,114,59,1,363,5,168,1,59,18395,1,168,4,2,103,112,18403,18408,111,110,59,1,371,102,59,3,55349,56678,4,6,97,100,104,108,115,117,18427,18434,18445,18470,18475,18494,114,114,111,119,59,1,8593,111,119,110,97,114,114,111,119,59,1,8597,97,114,112,111,111,110,4,2,108,114,18457,18463,101,102,116,59,1,8639,105,103,104,116,59,1,8638,117,115,59,1,8846,105,4,3,59,104,108,18484,18486,18489,1,965,59,1,978,111,110,59,1,965,112,97,114,114,111,119,115,59,1,8648,4,3,99,105,116,18512,18537,18542,4,2,111,114,18518,18532,114,110,4,2,59,101,18526,18528,1,8989,114,59,1,8989,111,112,59,1,8974,110,103,59,1,367,114,105,59,1,9721,99,114,59,3,55349,56522,4,3,100,105,114,18561,18566,18572,111,116,59,1,8944,108,100,101,59,1,361,105,4,2,59,102,18579,18581,1,9653,59,1,9652,4,2,97,109,18590,18595,114,114,59,1,8648,108,5,252,1,59,18601,1,252,97,110,103,108,101,59,1,10663,4,15,65,66,68,97,99,100,101,102,108,110,111,112,114,115,122,18643,18648,18661,18667,18847,18851,18857,18904,18909,18915,18931,18937,18943,18949,18996,114,114,59,1,8661,97,114,4,2,59,118,18656,18658,1,10984,59,1,10985,97,115,104,59,1,8872,4,2,110,114,18673,18679,103,114,116,59,1,10652,4,7,101,107,110,112,114,115,116,18695,18704,18711,18720,18742,18754,18810,112,115,105,108,111,110,59,1,1013,97,112,112,97,59,1,1008,111,116,104,105,110,103,59,1,8709,4,3,104,105,114,18728,18732,18735,105,59,1,981,59,1,982,111,112,116,111,59,1,8733,4,2,59,104,18748,18750,1,8597,111,59,1,1009,4,2,105,117,18760,18766,103,109,97,59,1,962,4,2,98,112,18772,18791,115,101,116,110,101,113,4,2,59,113,18784,18787,3,8842,65024,59,3,10955,65024,115,101,116,110,101,113,4,2,59,113,18803,18806,3,8843,65024,59,3,10956,65024,4,2,104,114,18816,18822,101,116,97,59,1,977,105,97,110,103,108,101,4,2,108,114,18834,18840,101,102,116,59,1,8882,105,103,104,116,59,1,8883,121,59,1,1074,97,115,104,59,1,8866,4,3,101,108,114,18865,18884,18890,4,3,59,98,101,18873,18875,18880,1,8744,97,114,59,1,8891,113,59,1,8794,108,105,112,59,1,8942,4,2,98,116,18896,18901,97,114,59,1,124,59,1,124,114,59,3,55349,56627,116,114,105,59,1,8882,115,117,4,2,98,112,18923,18927,59,3,8834,8402,59,3,8835,8402,112,102,59,3,55349,56679,114,111,112,59,1,8733,116,114,105,59,1,8883,4,2,99,117,18955,18960,114,59,3,55349,56523,4,2,98,112,18966,18981,110,4,2,69,101,18973,18977,59,3,10955,65024,59,3,8842,65024,110,4,2,69,101,18988,18992,59,3,10956,65024,59,3,8843,65024,105,103,122,97,103,59,1,10650,4,7,99,101,102,111,112,114,115,19020,19026,19061,19066,19072,19075,19089,105,114,99,59,1,373,4,2,100,105,19032,19055,4,2,98,103,19038,19043,97,114,59,1,10847,101,4,2,59,113,19050,19052,1,8743,59,1,8793,101,114,112,59,1,8472,114,59,3,55349,56628,112,102,59,3,55349,56680,59,1,8472,4,2,59,101,19081,19083,1,8768,97,116,104,59,1,8768,99,114,59,3,55349,56524,4,14,99,100,102,104,105,108,109,110,111,114,115,117,118,119,19125,19146,19152,19157,19173,19176,19192,19197,19202,19236,19252,19269,19286,19291,4,3,97,105,117,19133,19137,19142,112,59,1,8898,114,99,59,1,9711,112,59,1,8899,116,114,105,59,1,9661,114,59,3,55349,56629,4,2,65,97,19163,19168,114,114,59,1,10234,114,114,59,1,10231,59,1,958,4,2,65,97,19182,19187,114,114,59,1,10232,114,114,59,1,10229,97,112,59,1,10236,105,115,59,1,8955,4,3,100,112,116,19210,19215,19230,111,116,59,1,10752,4,2,102,108,19221,19225,59,3,55349,56681,117,115,59,1,10753,105,109,101,59,1,10754,4,2,65,97,19242,19247,114,114,59,1,10233,114,114,59,1,10230,4,2,99,113,19258,19263,114,59,3,55349,56525,99,117,112,59,1,10758,4,2,112,116,19275,19281,108,117,115,59,1,10756,114,105,59,1,9651,101,101,59,1,8897,101,100,103,101,59,1,8896,4,8,97,99,101,102,105,111,115,117,19316,19335,19349,19357,19362,19367,19373,19379,99,4,2,117,121,19323,19332,116,101,5,253,1,59,19330,1,253,59,1,1103,4,2,105,121,19341,19346,114,99,59,1,375,59,1,1099,110,5,165,1,59,19355,1,165,114,59,3,55349,56630,99,121,59,1,1111,112,102,59,3,55349,56682,99,114,59,3,55349,56526,4,2,99,109,19385,19389,121,59,1,1102,108,5,255,1,59,19395,1,255,4,10,97,99,100,101,102,104,105,111,115,119,19419,19426,19441,19446,19462,19467,19472,19480,19486,19492,99,117,116,101,59,1,378,4,2,97,121,19432,19438,114,111,110,59,1,382,59,1,1079,111,116,59,1,380,4,2,101,116,19452,19458,116,114,102,59,1,8488,97,59,1,950,114,59,3,55349,56631,99,121,59,1,1078,103,114,97,114,114,59,1,8669,112,102,59,3,55349,56683,99,114,59,3,55349,56527,4,2,106,110,19498,19501,59,1,8205,106,59,1,8204]);
    
    /***/ }),
    /* 10 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const HTML = __webpack_require__(11);
    
    //Aliases
    const $ = HTML.TAG_NAMES;
    const NS = HTML.NAMESPACES;
    
    //Element utils
    
    //OPTIMIZATION: Integer comparisons are low-cost, so we can use very fast tag name length filters here.
    //It's faster than using dictionary.
    function isImpliedEndTagRequired(tn) {
        switch (tn.length) {
            case 1:
                return tn === $.P;
    
            case 2:
                return tn === $.RB || tn === $.RP || tn === $.RT || tn === $.DD || tn === $.DT || tn === $.LI;
    
            case 3:
                return tn === $.RTC;
    
            case 6:
                return tn === $.OPTION;
    
            case 8:
                return tn === $.OPTGROUP;
        }
    
        return false;
    }
    
    function isImpliedEndTagRequiredThoroughly(tn) {
        switch (tn.length) {
            case 1:
                return tn === $.P;
    
            case 2:
                return (
                    tn === $.RB ||
                    tn === $.RP ||
                    tn === $.RT ||
                    tn === $.DD ||
                    tn === $.DT ||
                    tn === $.LI ||
                    tn === $.TD ||
                    tn === $.TH ||
                    tn === $.TR
                );
    
            case 3:
                return tn === $.RTC;
    
            case 5:
                return tn === $.TBODY || tn === $.TFOOT || tn === $.THEAD;
    
            case 6:
                return tn === $.OPTION;
    
            case 7:
                return tn === $.CAPTION;
    
            case 8:
                return tn === $.OPTGROUP || tn === $.COLGROUP;
        }
    
        return false;
    }
    
    function isScopingElement(tn, ns) {
        switch (tn.length) {
            case 2:
                if (tn === $.TD || tn === $.TH) {
                    return ns === NS.HTML;
                } else if (tn === $.MI || tn === $.MO || tn === $.MN || tn === $.MS) {
                    return ns === NS.MATHML;
                }
    
                break;
    
            case 4:
                if (tn === $.HTML) {
                    return ns === NS.HTML;
                } else if (tn === $.DESC) {
                    return ns === NS.SVG;
                }
    
                break;
    
            case 5:
                if (tn === $.TABLE) {
                    return ns === NS.HTML;
                } else if (tn === $.MTEXT) {
                    return ns === NS.MATHML;
                } else if (tn === $.TITLE) {
                    return ns === NS.SVG;
                }
    
                break;
    
            case 6:
                return (tn === $.APPLET || tn === $.OBJECT) && ns === NS.HTML;
    
            case 7:
                return (tn === $.CAPTION || tn === $.MARQUEE) && ns === NS.HTML;
    
            case 8:
                return tn === $.TEMPLATE && ns === NS.HTML;
    
            case 13:
                return tn === $.FOREIGN_OBJECT && ns === NS.SVG;
    
            case 14:
                return tn === $.ANNOTATION_XML && ns === NS.MATHML;
        }
    
        return false;
    }
    
    //Stack of open elements
    class OpenElementStack {
        constructor(document, treeAdapter) {
            this.stackTop = -1;
            this.items = [];
            this.current = document;
            this.currentTagName = null;
            this.currentTmplContent = null;
            this.tmplCount = 0;
            this.treeAdapter = treeAdapter;
        }
    
        //Index of element
        _indexOf(element) {
            let idx = -1;
    
            for (let i = this.stackTop; i >= 0; i--) {
                if (this.items[i] === element) {
                    idx = i;
                    break;
                }
            }
            return idx;
        }
    
        //Update current element
        _isInTemplate() {
            return this.currentTagName === $.TEMPLATE && this.treeAdapter.getNamespaceURI(this.current) === NS.HTML;
        }
    
        _updateCurrentElement() {
            this.current = this.items[this.stackTop];
            this.currentTagName = this.current && this.treeAdapter.getTagName(this.current);
    
            this.currentTmplContent = this._isInTemplate() ? this.treeAdapter.getTemplateContent(this.current) : null;
        }
    
        //Mutations
        push(element) {
            this.items[++this.stackTop] = element;
            this._updateCurrentElement();
    
            if (this._isInTemplate()) {
                this.tmplCount++;
            }
        }
    
        pop() {
            this.stackTop--;
    
            if (this.tmplCount > 0 && this._isInTemplate()) {
                this.tmplCount--;
            }
    
            this._updateCurrentElement();
        }
    
        replace(oldElement, newElement) {
            const idx = this._indexOf(oldElement);
    
            this.items[idx] = newElement;
    
            if (idx === this.stackTop) {
                this._updateCurrentElement();
            }
        }
    
        insertAfter(referenceElement, newElement) {
            const insertionIdx = this._indexOf(referenceElement) + 1;
    
            this.items.splice(insertionIdx, 0, newElement);
    
            if (insertionIdx === ++this.stackTop) {
                this._updateCurrentElement();
            }
        }
    
        popUntilTagNamePopped(tagName) {
            while (this.stackTop > -1) {
                const tn = this.currentTagName;
                const ns = this.treeAdapter.getNamespaceURI(this.current);
    
                this.pop();
    
                if (tn === tagName && ns === NS.HTML) {
                    break;
                }
            }
        }
    
        popUntilElementPopped(element) {
            while (this.stackTop > -1) {
                const poppedElement = this.current;
    
                this.pop();
    
                if (poppedElement === element) {
                    break;
                }
            }
        }
    
        popUntilNumberedHeaderPopped() {
            while (this.stackTop > -1) {
                const tn = this.currentTagName;
                const ns = this.treeAdapter.getNamespaceURI(this.current);
    
                this.pop();
    
                if (
                    tn === $.H1 ||
                    tn === $.H2 ||
                    tn === $.H3 ||
                    tn === $.H4 ||
                    tn === $.H5 ||
                    (tn === $.H6 && ns === NS.HTML)
                ) {
                    break;
                }
            }
        }
    
        popUntilTableCellPopped() {
            while (this.stackTop > -1) {
                const tn = this.currentTagName;
                const ns = this.treeAdapter.getNamespaceURI(this.current);
    
                this.pop();
    
                if (tn === $.TD || (tn === $.TH && ns === NS.HTML)) {
                    break;
                }
            }
        }
    
        popAllUpToHtmlElement() {
            //NOTE: here we assume that root <html> element is always first in the open element stack, so
            //we perform this fast stack clean up.
            this.stackTop = 0;
            this._updateCurrentElement();
        }
    
        clearBackToTableContext() {
            while (
                (this.currentTagName !== $.TABLE && this.currentTagName !== $.TEMPLATE && this.currentTagName !== $.HTML) ||
                this.treeAdapter.getNamespaceURI(this.current) !== NS.HTML
            ) {
                this.pop();
            }
        }
    
        clearBackToTableBodyContext() {
            while (
                (this.currentTagName !== $.TBODY &&
                    this.currentTagName !== $.TFOOT &&
                    this.currentTagName !== $.THEAD &&
                    this.currentTagName !== $.TEMPLATE &&
                    this.currentTagName !== $.HTML) ||
                this.treeAdapter.getNamespaceURI(this.current) !== NS.HTML
            ) {
                this.pop();
            }
        }
    
        clearBackToTableRowContext() {
            while (
                (this.currentTagName !== $.TR && this.currentTagName !== $.TEMPLATE && this.currentTagName !== $.HTML) ||
                this.treeAdapter.getNamespaceURI(this.current) !== NS.HTML
            ) {
                this.pop();
            }
        }
    
        remove(element) {
            for (let i = this.stackTop; i >= 0; i--) {
                if (this.items[i] === element) {
                    this.items.splice(i, 1);
                    this.stackTop--;
                    this._updateCurrentElement();
                    break;
                }
            }
        }
    
        //Search
        tryPeekProperlyNestedBodyElement() {
            //Properly nested <body> element (should be second element in stack).
            const element = this.items[1];
    
            return element && this.treeAdapter.getTagName(element) === $.BODY ? element : null;
        }
    
        contains(element) {
            return this._indexOf(element) > -1;
        }
    
        getCommonAncestor(element) {
            let elementIdx = this._indexOf(element);
    
            return --elementIdx >= 0 ? this.items[elementIdx] : null;
        }
    
        isRootHtmlElementCurrent() {
            return this.stackTop === 0 && this.currentTagName === $.HTML;
        }
    
        //Element in scope
        hasInScope(tagName) {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (tn === tagName && ns === NS.HTML) {
                    return true;
                }
    
                if (isScopingElement(tn, ns)) {
                    return false;
                }
            }
    
            return true;
        }
    
        hasNumberedHeaderInScope() {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (
                    (tn === $.H1 || tn === $.H2 || tn === $.H3 || tn === $.H4 || tn === $.H5 || tn === $.H6) &&
                    ns === NS.HTML
                ) {
                    return true;
                }
    
                if (isScopingElement(tn, ns)) {
                    return false;
                }
            }
    
            return true;
        }
    
        hasInListItemScope(tagName) {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (tn === tagName && ns === NS.HTML) {
                    return true;
                }
    
                if (((tn === $.UL || tn === $.OL) && ns === NS.HTML) || isScopingElement(tn, ns)) {
                    return false;
                }
            }
    
            return true;
        }
    
        hasInButtonScope(tagName) {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (tn === tagName && ns === NS.HTML) {
                    return true;
                }
    
                if ((tn === $.BUTTON && ns === NS.HTML) || isScopingElement(tn, ns)) {
                    return false;
                }
            }
    
            return true;
        }
    
        hasInTableScope(tagName) {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (ns !== NS.HTML) {
                    continue;
                }
    
                if (tn === tagName) {
                    return true;
                }
    
                if (tn === $.TABLE || tn === $.TEMPLATE || tn === $.HTML) {
                    return false;
                }
            }
    
            return true;
        }
    
        hasTableBodyContextInTableScope() {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (ns !== NS.HTML) {
                    continue;
                }
    
                if (tn === $.TBODY || tn === $.THEAD || tn === $.TFOOT) {
                    return true;
                }
    
                if (tn === $.TABLE || tn === $.HTML) {
                    return false;
                }
            }
    
            return true;
        }
    
        hasInSelectScope(tagName) {
            for (let i = this.stackTop; i >= 0; i--) {
                const tn = this.treeAdapter.getTagName(this.items[i]);
                const ns = this.treeAdapter.getNamespaceURI(this.items[i]);
    
                if (ns !== NS.HTML) {
                    continue;
                }
    
                if (tn === tagName) {
                    return true;
                }
    
                if (tn !== $.OPTION && tn !== $.OPTGROUP) {
                    return false;
                }
            }
    
            return true;
        }
    
        //Implied end tags
        generateImpliedEndTags() {
            while (isImpliedEndTagRequired(this.currentTagName)) {
                this.pop();
            }
        }
    
        generateImpliedEndTagsThoroughly() {
            while (isImpliedEndTagRequiredThoroughly(this.currentTagName)) {
                this.pop();
            }
        }
    
        generateImpliedEndTagsWithExclusion(exclusionTagName) {
            while (isImpliedEndTagRequired(this.currentTagName) && this.currentTagName !== exclusionTagName) {
                this.pop();
            }
        }
    }
    
    module.exports = OpenElementStack;
    
    
    /***/ }),
    /* 11 */
    /***/ ((__unused_webpack_module, exports) => {
    
    "use strict";
    
    
    const NS = (exports.NAMESPACES = {
        HTML: 'http://www.w3.org/1999/xhtml',
        MATHML: 'http://www.w3.org/1998/Math/MathML',
        SVG: 'http://www.w3.org/2000/svg',
        XLINK: 'http://www.w3.org/1999/xlink',
        XML: 'http://www.w3.org/XML/1998/namespace',
        XMLNS: 'http://www.w3.org/2000/xmlns/'
    });
    
    exports.ATTRS = {
        TYPE: 'type',
        ACTION: 'action',
        ENCODING: 'encoding',
        PROMPT: 'prompt',
        NAME: 'name',
        COLOR: 'color',
        FACE: 'face',
        SIZE: 'size'
    };
    
    exports.DOCUMENT_MODE = {
        NO_QUIRKS: 'no-quirks',
        QUIRKS: 'quirks',
        LIMITED_QUIRKS: 'limited-quirks'
    };
    
    const $ = (exports.TAG_NAMES = {
        A: 'a',
        ADDRESS: 'address',
        ANNOTATION_XML: 'annotation-xml',
        APPLET: 'applet',
        AREA: 'area',
        ARTICLE: 'article',
        ASIDE: 'aside',
    
        B: 'b',
        BASE: 'base',
        BASEFONT: 'basefont',
        BGSOUND: 'bgsound',
        BIG: 'big',
        BLOCKQUOTE: 'blockquote',
        BODY: 'body',
        BR: 'br',
        BUTTON: 'button',
    
        CAPTION: 'caption',
        CENTER: 'center',
        CODE: 'code',
        COL: 'col',
        COLGROUP: 'colgroup',
    
        DD: 'dd',
        DESC: 'desc',
        DETAILS: 'details',
        DIALOG: 'dialog',
        DIR: 'dir',
        DIV: 'div',
        DL: 'dl',
        DT: 'dt',
    
        EM: 'em',
        EMBED: 'embed',
    
        FIELDSET: 'fieldset',
        FIGCAPTION: 'figcaption',
        FIGURE: 'figure',
        FONT: 'font',
        FOOTER: 'footer',
        FOREIGN_OBJECT: 'foreignObject',
        FORM: 'form',
        FRAME: 'frame',
        FRAMESET: 'frameset',
    
        H1: 'h1',
        H2: 'h2',
        H3: 'h3',
        H4: 'h4',
        H5: 'h5',
        H6: 'h6',
        HEAD: 'head',
        HEADER: 'header',
        HGROUP: 'hgroup',
        HR: 'hr',
        HTML: 'html',
    
        I: 'i',
        IMG: 'img',
        IMAGE: 'image',
        INPUT: 'input',
        IFRAME: 'iframe',
    
        KEYGEN: 'keygen',
    
        LABEL: 'label',
        LI: 'li',
        LINK: 'link',
        LISTING: 'listing',
    
        MAIN: 'main',
        MALIGNMARK: 'malignmark',
        MARQUEE: 'marquee',
        MATH: 'math',
        MENU: 'menu',
        META: 'meta',
        MGLYPH: 'mglyph',
        MI: 'mi',
        MO: 'mo',
        MN: 'mn',
        MS: 'ms',
        MTEXT: 'mtext',
    
        NAV: 'nav',
        NOBR: 'nobr',
        NOFRAMES: 'noframes',
        NOEMBED: 'noembed',
        NOSCRIPT: 'noscript',
    
        OBJECT: 'object',
        OL: 'ol',
        OPTGROUP: 'optgroup',
        OPTION: 'option',
    
        P: 'p',
        PARAM: 'param',
        PLAINTEXT: 'plaintext',
        PRE: 'pre',
    
        RB: 'rb',
        RP: 'rp',
        RT: 'rt',
        RTC: 'rtc',
        RUBY: 'ruby',
    
        S: 's',
        SCRIPT: 'script',
        SECTION: 'section',
        SELECT: 'select',
        SOURCE: 'source',
        SMALL: 'small',
        SPAN: 'span',
        STRIKE: 'strike',
        STRONG: 'strong',
        STYLE: 'style',
        SUB: 'sub',
        SUMMARY: 'summary',
        SUP: 'sup',
    
        TABLE: 'table',
        TBODY: 'tbody',
        TEMPLATE: 'template',
        TEXTAREA: 'textarea',
        TFOOT: 'tfoot',
        TD: 'td',
        TH: 'th',
        THEAD: 'thead',
        TITLE: 'title',
        TR: 'tr',
        TRACK: 'track',
        TT: 'tt',
    
        U: 'u',
        UL: 'ul',
    
        SVG: 'svg',
    
        VAR: 'var',
    
        WBR: 'wbr',
    
        XMP: 'xmp'
    });
    
    exports.SPECIAL_ELEMENTS = {
        [NS.HTML]: {
            [$.ADDRESS]: true,
            [$.APPLET]: true,
            [$.AREA]: true,
            [$.ARTICLE]: true,
            [$.ASIDE]: true,
            [$.BASE]: true,
            [$.BASEFONT]: true,
            [$.BGSOUND]: true,
            [$.BLOCKQUOTE]: true,
            [$.BODY]: true,
            [$.BR]: true,
            [$.BUTTON]: true,
            [$.CAPTION]: true,
            [$.CENTER]: true,
            [$.COL]: true,
            [$.COLGROUP]: true,
            [$.DD]: true,
            [$.DETAILS]: true,
            [$.DIR]: true,
            [$.DIV]: true,
            [$.DL]: true,
            [$.DT]: true,
            [$.EMBED]: true,
            [$.FIELDSET]: true,
            [$.FIGCAPTION]: true,
            [$.FIGURE]: true,
            [$.FOOTER]: true,
            [$.FORM]: true,
            [$.FRAME]: true,
            [$.FRAMESET]: true,
            [$.H1]: true,
            [$.H2]: true,
            [$.H3]: true,
            [$.H4]: true,
            [$.H5]: true,
            [$.H6]: true,
            [$.HEAD]: true,
            [$.HEADER]: true,
            [$.HGROUP]: true,
            [$.HR]: true,
            [$.HTML]: true,
            [$.IFRAME]: true,
            [$.IMG]: true,
            [$.INPUT]: true,
            [$.LI]: true,
            [$.LINK]: true,
            [$.LISTING]: true,
            [$.MAIN]: true,
            [$.MARQUEE]: true,
            [$.MENU]: true,
            [$.META]: true,
            [$.NAV]: true,
            [$.NOEMBED]: true,
            [$.NOFRAMES]: true,
            [$.NOSCRIPT]: true,
            [$.OBJECT]: true,
            [$.OL]: true,
            [$.P]: true,
            [$.PARAM]: true,
            [$.PLAINTEXT]: true,
            [$.PRE]: true,
            [$.SCRIPT]: true,
            [$.SECTION]: true,
            [$.SELECT]: true,
            [$.SOURCE]: true,
            [$.STYLE]: true,
            [$.SUMMARY]: true,
            [$.TABLE]: true,
            [$.TBODY]: true,
            [$.TD]: true,
            [$.TEMPLATE]: true,
            [$.TEXTAREA]: true,
            [$.TFOOT]: true,
            [$.TH]: true,
            [$.THEAD]: true,
            [$.TITLE]: true,
            [$.TR]: true,
            [$.TRACK]: true,
            [$.UL]: true,
            [$.WBR]: true,
            [$.XMP]: true
        },
        [NS.MATHML]: {
            [$.MI]: true,
            [$.MO]: true,
            [$.MN]: true,
            [$.MS]: true,
            [$.MTEXT]: true,
            [$.ANNOTATION_XML]: true
        },
        [NS.SVG]: {
            [$.TITLE]: true,
            [$.FOREIGN_OBJECT]: true,
            [$.DESC]: true
        }
    };
    
    
    /***/ }),
    /* 12 */
    /***/ ((module) => {
    
    "use strict";
    
    
    //Const
    const NOAH_ARK_CAPACITY = 3;
    
    //List of formatting elements
    class FormattingElementList {
        constructor(treeAdapter) {
            this.length = 0;
            this.entries = [];
            this.treeAdapter = treeAdapter;
            this.bookmark = null;
        }
    
        //Noah Ark's condition
        //OPTIMIZATION: at first we try to find possible candidates for exclusion using
        //lightweight heuristics without thorough attributes check.
        _getNoahArkConditionCandidates(newElement) {
            const candidates = [];
    
            if (this.length >= NOAH_ARK_CAPACITY) {
                const neAttrsLength = this.treeAdapter.getAttrList(newElement).length;
                const neTagName = this.treeAdapter.getTagName(newElement);
                const neNamespaceURI = this.treeAdapter.getNamespaceURI(newElement);
    
                for (let i = this.length - 1; i >= 0; i--) {
                    const entry = this.entries[i];
    
                    if (entry.type === FormattingElementList.MARKER_ENTRY) {
                        break;
                    }
    
                    const element = entry.element;
                    const elementAttrs = this.treeAdapter.getAttrList(element);
    
                    const isCandidate =
                        this.treeAdapter.getTagName(element) === neTagName &&
                        this.treeAdapter.getNamespaceURI(element) === neNamespaceURI &&
                        elementAttrs.length === neAttrsLength;
    
                    if (isCandidate) {
                        candidates.push({ idx: i, attrs: elementAttrs });
                    }
                }
            }
    
            return candidates.length < NOAH_ARK_CAPACITY ? [] : candidates;
        }
    
        _ensureNoahArkCondition(newElement) {
            const candidates = this._getNoahArkConditionCandidates(newElement);
            let cLength = candidates.length;
    
            if (cLength) {
                const neAttrs = this.treeAdapter.getAttrList(newElement);
                const neAttrsLength = neAttrs.length;
                const neAttrsMap = Object.create(null);
    
                //NOTE: build attrs map for the new element so we can perform fast lookups
                for (let i = 0; i < neAttrsLength; i++) {
                    const neAttr = neAttrs[i];
    
                    neAttrsMap[neAttr.name] = neAttr.value;
                }
    
                for (let i = 0; i < neAttrsLength; i++) {
                    for (let j = 0; j < cLength; j++) {
                        const cAttr = candidates[j].attrs[i];
    
                        if (neAttrsMap[cAttr.name] !== cAttr.value) {
                            candidates.splice(j, 1);
                            cLength--;
                        }
    
                        if (candidates.length < NOAH_ARK_CAPACITY) {
                            return;
                        }
                    }
                }
    
                //NOTE: remove bottommost candidates until Noah's Ark condition will not be met
                for (let i = cLength - 1; i >= NOAH_ARK_CAPACITY - 1; i--) {
                    this.entries.splice(candidates[i].idx, 1);
                    this.length--;
                }
            }
        }
    
        //Mutations
        insertMarker() {
            this.entries.push({ type: FormattingElementList.MARKER_ENTRY });
            this.length++;
        }
    
        pushElement(element, token) {
            this._ensureNoahArkCondition(element);
    
            this.entries.push({
                type: FormattingElementList.ELEMENT_ENTRY,
                element: element,
                token: token
            });
    
            this.length++;
        }
    
        insertElementAfterBookmark(element, token) {
            let bookmarkIdx = this.length - 1;
    
            for (; bookmarkIdx >= 0; bookmarkIdx--) {
                if (this.entries[bookmarkIdx] === this.bookmark) {
                    break;
                }
            }
    
            this.entries.splice(bookmarkIdx + 1, 0, {
                type: FormattingElementList.ELEMENT_ENTRY,
                element: element,
                token: token
            });
    
            this.length++;
        }
    
        removeEntry(entry) {
            for (let i = this.length - 1; i >= 0; i--) {
                if (this.entries[i] === entry) {
                    this.entries.splice(i, 1);
                    this.length--;
                    break;
                }
            }
        }
    
        clearToLastMarker() {
            while (this.length) {
                const entry = this.entries.pop();
    
                this.length--;
    
                if (entry.type === FormattingElementList.MARKER_ENTRY) {
                    break;
                }
            }
        }
    
        //Search
        getElementEntryInScopeWithTagName(tagName) {
            for (let i = this.length - 1; i >= 0; i--) {
                const entry = this.entries[i];
    
                if (entry.type === FormattingElementList.MARKER_ENTRY) {
                    return null;
                }
    
                if (this.treeAdapter.getTagName(entry.element) === tagName) {
                    return entry;
                }
            }
    
            return null;
        }
    
        getElementEntry(element) {
            for (let i = this.length - 1; i >= 0; i--) {
                const entry = this.entries[i];
    
                if (entry.type === FormattingElementList.ELEMENT_ENTRY && entry.element === element) {
                    return entry;
                }
            }
    
            return null;
        }
    }
    
    //Entry types
    FormattingElementList.MARKER_ENTRY = 'MARKER_ENTRY';
    FormattingElementList.ELEMENT_ENTRY = 'ELEMENT_ENTRY';
    
    module.exports = FormattingElementList;
    
    
    /***/ }),
    /* 13 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Mixin = __webpack_require__(14);
    const Tokenizer = __webpack_require__(5);
    const LocationInfoTokenizerMixin = __webpack_require__(15);
    const LocationInfoOpenElementStackMixin = __webpack_require__(17);
    const HTML = __webpack_require__(11);
    
    //Aliases
    const $ = HTML.TAG_NAMES;
    
    class LocationInfoParserMixin extends Mixin {
        constructor(parser) {
            super(parser);
    
            this.parser = parser;
            this.treeAdapter = this.parser.treeAdapter;
            this.posTracker = null;
            this.lastStartTagToken = null;
            this.lastFosterParentingLocation = null;
            this.currentToken = null;
        }
    
        _setStartLocation(element) {
            let loc = null;
    
            if (this.lastStartTagToken) {
                loc = Object.assign({}, this.lastStartTagToken.location);
                loc.startTag = this.lastStartTagToken.location;
            }
    
            this.treeAdapter.setNodeSourceCodeLocation(element, loc);
        }
    
        _setEndLocation(element, closingToken) {
            const loc = this.treeAdapter.getNodeSourceCodeLocation(element);
    
            if (loc) {
                if (closingToken.location) {
                    const ctLoc = closingToken.location;
                    const tn = this.treeAdapter.getTagName(element);
    
                    // NOTE: For cases like <p> <p> </p> - First 'p' closes without a closing
                    // tag and for cases like <td> <p> </td> - 'p' closes without a closing tag.
                    const isClosingEndTag = closingToken.type === Tokenizer.END_TAG_TOKEN && tn === closingToken.tagName;
                    const endLoc = {};
                    if (isClosingEndTag) {
                        endLoc.endTag = Object.assign({}, ctLoc);
                        endLoc.endLine = ctLoc.endLine;
                        endLoc.endCol = ctLoc.endCol;
                        endLoc.endOffset = ctLoc.endOffset;
                    } else {
                        endLoc.endLine = ctLoc.startLine;
                        endLoc.endCol = ctLoc.startCol;
                        endLoc.endOffset = ctLoc.startOffset;
                    }
    
                    this.treeAdapter.updateNodeSourceCodeLocation(element, endLoc);
                }
            }
        }
    
        _getOverriddenMethods(mxn, orig) {
            return {
                _bootstrap(document, fragmentContext) {
                    orig._bootstrap.call(this, document, fragmentContext);
    
                    mxn.lastStartTagToken = null;
                    mxn.lastFosterParentingLocation = null;
                    mxn.currentToken = null;
    
                    const tokenizerMixin = Mixin.install(this.tokenizer, LocationInfoTokenizerMixin);
    
                    mxn.posTracker = tokenizerMixin.posTracker;
    
                    Mixin.install(this.openElements, LocationInfoOpenElementStackMixin, {
                        onItemPop: function(element) {
                            mxn._setEndLocation(element, mxn.currentToken);
                        }
                    });
                },
    
                _runParsingLoop(scriptHandler) {
                    orig._runParsingLoop.call(this, scriptHandler);
    
                    // NOTE: generate location info for elements
                    // that remains on open element stack
                    for (let i = this.openElements.stackTop; i >= 0; i--) {
                        mxn._setEndLocation(this.openElements.items[i], mxn.currentToken);
                    }
                },
    
                //Token processing
                _processTokenInForeignContent(token) {
                    mxn.currentToken = token;
                    orig._processTokenInForeignContent.call(this, token);
                },
    
                _processToken(token) {
                    mxn.currentToken = token;
                    orig._processToken.call(this, token);
    
                    //NOTE: <body> and <html> are never popped from the stack, so we need to updated
                    //their end location explicitly.
                    const requireExplicitUpdate =
                        token.type === Tokenizer.END_TAG_TOKEN &&
                        (token.tagName === $.HTML || (token.tagName === $.BODY && this.openElements.hasInScope($.BODY)));
    
                    if (requireExplicitUpdate) {
                        for (let i = this.openElements.stackTop; i >= 0; i--) {
                            const element = this.openElements.items[i];
    
                            if (this.treeAdapter.getTagName(element) === token.tagName) {
                                mxn._setEndLocation(element, token);
                                break;
                            }
                        }
                    }
                },
    
                //Doctype
                _setDocumentType(token) {
                    orig._setDocumentType.call(this, token);
    
                    const documentChildren = this.treeAdapter.getChildNodes(this.document);
                    const cnLength = documentChildren.length;
    
                    for (let i = 0; i < cnLength; i++) {
                        const node = documentChildren[i];
    
                        if (this.treeAdapter.isDocumentTypeNode(node)) {
                            this.treeAdapter.setNodeSourceCodeLocation(node, token.location);
                            break;
                        }
                    }
                },
    
                //Elements
                _attachElementToTree(element) {
                    //NOTE: _attachElementToTree is called from _appendElement, _insertElement and _insertTemplate methods.
                    //So we will use token location stored in this methods for the element.
                    mxn._setStartLocation(element);
                    mxn.lastStartTagToken = null;
                    orig._attachElementToTree.call(this, element);
                },
    
                _appendElement(token, namespaceURI) {
                    mxn.lastStartTagToken = token;
                    orig._appendElement.call(this, token, namespaceURI);
                },
    
                _insertElement(token, namespaceURI) {
                    mxn.lastStartTagToken = token;
                    orig._insertElement.call(this, token, namespaceURI);
                },
    
                _insertTemplate(token) {
                    mxn.lastStartTagToken = token;
                    orig._insertTemplate.call(this, token);
    
                    const tmplContent = this.treeAdapter.getTemplateContent(this.openElements.current);
    
                    this.treeAdapter.setNodeSourceCodeLocation(tmplContent, null);
                },
    
                _insertFakeRootElement() {
                    orig._insertFakeRootElement.call(this);
                    this.treeAdapter.setNodeSourceCodeLocation(this.openElements.current, null);
                },
    
                //Comments
                _appendCommentNode(token, parent) {
                    orig._appendCommentNode.call(this, token, parent);
    
                    const children = this.treeAdapter.getChildNodes(parent);
                    const commentNode = children[children.length - 1];
    
                    this.treeAdapter.setNodeSourceCodeLocation(commentNode, token.location);
                },
    
                //Text
                _findFosterParentingLocation() {
                    //NOTE: store last foster parenting location, so we will be able to find inserted text
                    //in case of foster parenting
                    mxn.lastFosterParentingLocation = orig._findFosterParentingLocation.call(this);
    
                    return mxn.lastFosterParentingLocation;
                },
    
                _insertCharacters(token) {
                    orig._insertCharacters.call(this, token);
    
                    const hasFosterParent = this._shouldFosterParentOnInsertion();
    
                    const parent =
                        (hasFosterParent && mxn.lastFosterParentingLocation.parent) ||
                        this.openElements.currentTmplContent ||
                        this.openElements.current;
    
                    const siblings = this.treeAdapter.getChildNodes(parent);
    
                    const textNodeIdx =
                        hasFosterParent && mxn.lastFosterParentingLocation.beforeElement
                            ? siblings.indexOf(mxn.lastFosterParentingLocation.beforeElement) - 1
                            : siblings.length - 1;
    
                    const textNode = siblings[textNodeIdx];
    
                    //NOTE: if we have location assigned by another token, then just update end position
                    const tnLoc = this.treeAdapter.getNodeSourceCodeLocation(textNode);
    
                    if (tnLoc) {
                        const { endLine, endCol, endOffset } = token.location;
                        this.treeAdapter.updateNodeSourceCodeLocation(textNode, { endLine, endCol, endOffset });
                    } else {
                        this.treeAdapter.setNodeSourceCodeLocation(textNode, token.location);
                    }
                }
            };
        }
    }
    
    module.exports = LocationInfoParserMixin;
    
    
    /***/ }),
    /* 14 */
    /***/ ((module) => {
    
    "use strict";
    
    
    class Mixin {
        constructor(host) {
            const originalMethods = {};
            const overriddenMethods = this._getOverriddenMethods(this, originalMethods);
    
            for (const key of Object.keys(overriddenMethods)) {
                if (typeof overriddenMethods[key] === 'function') {
                    originalMethods[key] = host[key];
                    host[key] = overriddenMethods[key];
                }
            }
        }
    
        _getOverriddenMethods() {
            throw new Error('Not implemented');
        }
    }
    
    Mixin.install = function(host, Ctor, opts) {
        if (!host.__mixins) {
            host.__mixins = [];
        }
    
        for (let i = 0; i < host.__mixins.length; i++) {
            if (host.__mixins[i].constructor === Ctor) {
                return host.__mixins[i];
            }
        }
    
        const mixin = new Ctor(host, opts);
    
        host.__mixins.push(mixin);
    
        return mixin;
    };
    
    module.exports = Mixin;
    
    
    /***/ }),
    /* 15 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Mixin = __webpack_require__(14);
    const Tokenizer = __webpack_require__(5);
    const PositionTrackingPreprocessorMixin = __webpack_require__(16);
    
    class LocationInfoTokenizerMixin extends Mixin {
        constructor(tokenizer) {
            super(tokenizer);
    
            this.tokenizer = tokenizer;
            this.posTracker = Mixin.install(tokenizer.preprocessor, PositionTrackingPreprocessorMixin);
            this.currentAttrLocation = null;
            this.ctLoc = null;
        }
    
        _getCurrentLocation() {
            return {
                startLine: this.posTracker.line,
                startCol: this.posTracker.col,
                startOffset: this.posTracker.offset,
                endLine: -1,
                endCol: -1,
                endOffset: -1
            };
        }
    
        _attachCurrentAttrLocationInfo() {
            this.currentAttrLocation.endLine = this.posTracker.line;
            this.currentAttrLocation.endCol = this.posTracker.col;
            this.currentAttrLocation.endOffset = this.posTracker.offset;
    
            const currentToken = this.tokenizer.currentToken;
            const currentAttr = this.tokenizer.currentAttr;
    
            if (!currentToken.location.attrs) {
                currentToken.location.attrs = Object.create(null);
            }
    
            currentToken.location.attrs[currentAttr.name] = this.currentAttrLocation;
        }
    
        _getOverriddenMethods(mxn, orig) {
            const methods = {
                _createStartTagToken() {
                    orig._createStartTagToken.call(this);
                    this.currentToken.location = mxn.ctLoc;
                },
    
                _createEndTagToken() {
                    orig._createEndTagToken.call(this);
                    this.currentToken.location = mxn.ctLoc;
                },
    
                _createCommentToken() {
                    orig._createCommentToken.call(this);
                    this.currentToken.location = mxn.ctLoc;
                },
    
                _createDoctypeToken(initialName) {
                    orig._createDoctypeToken.call(this, initialName);
                    this.currentToken.location = mxn.ctLoc;
                },
    
                _createCharacterToken(type, ch) {
                    orig._createCharacterToken.call(this, type, ch);
                    this.currentCharacterToken.location = mxn.ctLoc;
                },
    
                _createEOFToken() {
                    orig._createEOFToken.call(this);
                    this.currentToken.location = mxn._getCurrentLocation();
                },
    
                _createAttr(attrNameFirstCh) {
                    orig._createAttr.call(this, attrNameFirstCh);
                    mxn.currentAttrLocation = mxn._getCurrentLocation();
                },
    
                _leaveAttrName(toState) {
                    orig._leaveAttrName.call(this, toState);
                    mxn._attachCurrentAttrLocationInfo();
                },
    
                _leaveAttrValue(toState) {
                    orig._leaveAttrValue.call(this, toState);
                    mxn._attachCurrentAttrLocationInfo();
                },
    
                _emitCurrentToken() {
                    const ctLoc = this.currentToken.location;
    
                    //NOTE: if we have pending character token make it's end location equal to the
                    //current token's start location.
                    if (this.currentCharacterToken) {
                        this.currentCharacterToken.location.endLine = ctLoc.startLine;
                        this.currentCharacterToken.location.endCol = ctLoc.startCol;
                        this.currentCharacterToken.location.endOffset = ctLoc.startOffset;
                    }
    
                    if (this.currentToken.type === Tokenizer.EOF_TOKEN) {
                        ctLoc.endLine = ctLoc.startLine;
                        ctLoc.endCol = ctLoc.startCol;
                        ctLoc.endOffset = ctLoc.startOffset;
                    } else {
                        ctLoc.endLine = mxn.posTracker.line;
                        ctLoc.endCol = mxn.posTracker.col + 1;
                        ctLoc.endOffset = mxn.posTracker.offset + 1;
                    }
    
                    orig._emitCurrentToken.call(this);
                },
    
                _emitCurrentCharacterToken() {
                    const ctLoc = this.currentCharacterToken && this.currentCharacterToken.location;
    
                    //NOTE: if we have character token and it's location wasn't set in the _emitCurrentToken(),
                    //then set it's location at the current preprocessor position.
                    //We don't need to increment preprocessor position, since character token
                    //emission is always forced by the start of the next character token here.
                    //So, we already have advanced position.
                    if (ctLoc && ctLoc.endOffset === -1) {
                        ctLoc.endLine = mxn.posTracker.line;
                        ctLoc.endCol = mxn.posTracker.col;
                        ctLoc.endOffset = mxn.posTracker.offset;
                    }
    
                    orig._emitCurrentCharacterToken.call(this);
                }
            };
    
            //NOTE: patch initial states for each mode to obtain token start position
            Object.keys(Tokenizer.MODE).forEach(modeName => {
                const state = Tokenizer.MODE[modeName];
    
                methods[state] = function(cp) {
                    mxn.ctLoc = mxn._getCurrentLocation();
                    orig[state].call(this, cp);
                };
            });
    
            return methods;
        }
    }
    
    module.exports = LocationInfoTokenizerMixin;
    
    
    /***/ }),
    /* 16 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Mixin = __webpack_require__(14);
    
    class PositionTrackingPreprocessorMixin extends Mixin {
        constructor(preprocessor) {
            super(preprocessor);
    
            this.preprocessor = preprocessor;
            this.isEol = false;
            this.lineStartPos = 0;
            this.droppedBufferSize = 0;
    
            this.offset = 0;
            this.col = 0;
            this.line = 1;
        }
    
        _getOverriddenMethods(mxn, orig) {
            return {
                advance() {
                    const pos = this.pos + 1;
                    const ch = this.html[pos];
    
                    //NOTE: LF should be in the last column of the line
                    if (mxn.isEol) {
                        mxn.isEol = false;
                        mxn.line++;
                        mxn.lineStartPos = pos;
                    }
    
                    if (ch === '\n' || (ch === '\r' && this.html[pos + 1] !== '\n')) {
                        mxn.isEol = true;
                    }
    
                    mxn.col = pos - mxn.lineStartPos + 1;
                    mxn.offset = mxn.droppedBufferSize + pos;
    
                    return orig.advance.call(this);
                },
    
                retreat() {
                    orig.retreat.call(this);
    
                    mxn.isEol = false;
                    mxn.col = this.pos - mxn.lineStartPos + 1;
                },
    
                dropParsedChunk() {
                    const prevPos = this.pos;
    
                    orig.dropParsedChunk.call(this);
    
                    const reduction = prevPos - this.pos;
    
                    mxn.lineStartPos -= reduction;
                    mxn.droppedBufferSize += reduction;
                    mxn.offset = mxn.droppedBufferSize + this.pos;
                }
            };
        }
    }
    
    module.exports = PositionTrackingPreprocessorMixin;
    
    
    /***/ }),
    /* 17 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Mixin = __webpack_require__(14);
    
    class LocationInfoOpenElementStackMixin extends Mixin {
        constructor(stack, opts) {
            super(stack);
    
            this.onItemPop = opts.onItemPop;
        }
    
        _getOverriddenMethods(mxn, orig) {
            return {
                pop() {
                    mxn.onItemPop(this.current);
                    orig.pop.call(this);
                },
    
                popAllUpToHtmlElement() {
                    for (let i = this.stackTop; i > 0; i--) {
                        mxn.onItemPop(this.items[i]);
                    }
    
                    orig.popAllUpToHtmlElement.call(this);
                },
    
                remove(element) {
                    mxn.onItemPop(this.current);
                    orig.remove.call(this, element);
                }
            };
        }
    }
    
    module.exports = LocationInfoOpenElementStackMixin;
    
    
    /***/ }),
    /* 18 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const ErrorReportingMixinBase = __webpack_require__(19);
    const ErrorReportingTokenizerMixin = __webpack_require__(20);
    const LocationInfoTokenizerMixin = __webpack_require__(15);
    const Mixin = __webpack_require__(14);
    
    class ErrorReportingParserMixin extends ErrorReportingMixinBase {
        constructor(parser, opts) {
            super(parser, opts);
    
            this.opts = opts;
            this.ctLoc = null;
            this.locBeforeToken = false;
        }
    
        _setErrorLocation(err) {
            if (this.ctLoc) {
                err.startLine = this.ctLoc.startLine;
                err.startCol = this.ctLoc.startCol;
                err.startOffset = this.ctLoc.startOffset;
    
                err.endLine = this.locBeforeToken ? this.ctLoc.startLine : this.ctLoc.endLine;
                err.endCol = this.locBeforeToken ? this.ctLoc.startCol : this.ctLoc.endCol;
                err.endOffset = this.locBeforeToken ? this.ctLoc.startOffset : this.ctLoc.endOffset;
            }
        }
    
        _getOverriddenMethods(mxn, orig) {
            return {
                _bootstrap(document, fragmentContext) {
                    orig._bootstrap.call(this, document, fragmentContext);
    
                    Mixin.install(this.tokenizer, ErrorReportingTokenizerMixin, mxn.opts);
                    Mixin.install(this.tokenizer, LocationInfoTokenizerMixin);
                },
    
                _processInputToken(token) {
                    mxn.ctLoc = token.location;
    
                    orig._processInputToken.call(this, token);
                },
    
                _err(code, options) {
                    mxn.locBeforeToken = options && options.beforeToken;
                    mxn._reportError(code);
                }
            };
        }
    }
    
    module.exports = ErrorReportingParserMixin;
    
    
    /***/ }),
    /* 19 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Mixin = __webpack_require__(14);
    
    class ErrorReportingMixinBase extends Mixin {
        constructor(host, opts) {
            super(host);
    
            this.posTracker = null;
            this.onParseError = opts.onParseError;
        }
    
        _setErrorLocation(err) {
            err.startLine = err.endLine = this.posTracker.line;
            err.startCol = err.endCol = this.posTracker.col;
            err.startOffset = err.endOffset = this.posTracker.offset;
        }
    
        _reportError(code) {
            const err = {
                code: code,
                startLine: -1,
                startCol: -1,
                startOffset: -1,
                endLine: -1,
                endCol: -1,
                endOffset: -1
            };
    
            this._setErrorLocation(err);
            this.onParseError(err);
        }
    
        _getOverriddenMethods(mxn) {
            return {
                _err(code) {
                    mxn._reportError(code);
                }
            };
        }
    }
    
    module.exports = ErrorReportingMixinBase;
    
    
    /***/ }),
    /* 20 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const ErrorReportingMixinBase = __webpack_require__(19);
    const ErrorReportingPreprocessorMixin = __webpack_require__(21);
    const Mixin = __webpack_require__(14);
    
    class ErrorReportingTokenizerMixin extends ErrorReportingMixinBase {
        constructor(tokenizer, opts) {
            super(tokenizer, opts);
    
            const preprocessorMixin = Mixin.install(tokenizer.preprocessor, ErrorReportingPreprocessorMixin, opts);
    
            this.posTracker = preprocessorMixin.posTracker;
        }
    }
    
    module.exports = ErrorReportingTokenizerMixin;
    
    
    /***/ }),
    /* 21 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const ErrorReportingMixinBase = __webpack_require__(19);
    const PositionTrackingPreprocessorMixin = __webpack_require__(16);
    const Mixin = __webpack_require__(14);
    
    class ErrorReportingPreprocessorMixin extends ErrorReportingMixinBase {
        constructor(preprocessor, opts) {
            super(preprocessor, opts);
    
            this.posTracker = Mixin.install(preprocessor, PositionTrackingPreprocessorMixin);
            this.lastErrOffset = -1;
        }
    
        _reportError(code) {
            //NOTE: avoid reporting error twice on advance/retreat
            if (this.lastErrOffset !== this.posTracker.offset) {
                this.lastErrOffset = this.posTracker.offset;
                super._reportError(code);
            }
        }
    }
    
    module.exports = ErrorReportingPreprocessorMixin;
    
    
    /***/ }),
    /* 22 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    "use strict";
    
    
    const { DOCUMENT_MODE } = __webpack_require__(11);
    
    //Node construction
    exports.createDocument = function() {
        return {
            nodeName: '#document',
            mode: DOCUMENT_MODE.NO_QUIRKS,
            childNodes: []
        };
    };
    
    exports.createDocumentFragment = function() {
        return {
            nodeName: '#document-fragment',
            childNodes: []
        };
    };
    
    exports.createElement = function(tagName, namespaceURI, attrs) {
        return {
            nodeName: tagName,
            tagName: tagName,
            attrs: attrs,
            namespaceURI: namespaceURI,
            childNodes: [],
            parentNode: null
        };
    };
    
    exports.createCommentNode = function(data) {
        return {
            nodeName: '#comment',
            data: data,
            parentNode: null
        };
    };
    
    const createTextNode = function(value) {
        return {
            nodeName: '#text',
            value: value,
            parentNode: null
        };
    };
    
    //Tree mutation
    const appendChild = (exports.appendChild = function(parentNode, newNode) {
        parentNode.childNodes.push(newNode);
        newNode.parentNode = parentNode;
    });
    
    const insertBefore = (exports.insertBefore = function(parentNode, newNode, referenceNode) {
        const insertionIdx = parentNode.childNodes.indexOf(referenceNode);
    
        parentNode.childNodes.splice(insertionIdx, 0, newNode);
        newNode.parentNode = parentNode;
    });
    
    exports.setTemplateContent = function(templateElement, contentElement) {
        templateElement.content = contentElement;
    };
    
    exports.getTemplateContent = function(templateElement) {
        return templateElement.content;
    };
    
    exports.setDocumentType = function(document, name, publicId, systemId) {
        let doctypeNode = null;
    
        for (let i = 0; i < document.childNodes.length; i++) {
            if (document.childNodes[i].nodeName === '#documentType') {
                doctypeNode = document.childNodes[i];
                break;
            }
        }
    
        if (doctypeNode) {
            doctypeNode.name = name;
            doctypeNode.publicId = publicId;
            doctypeNode.systemId = systemId;
        } else {
            appendChild(document, {
                nodeName: '#documentType',
                name: name,
                publicId: publicId,
                systemId: systemId
            });
        }
    };
    
    exports.setDocumentMode = function(document, mode) {
        document.mode = mode;
    };
    
    exports.getDocumentMode = function(document) {
        return document.mode;
    };
    
    exports.detachNode = function(node) {
        if (node.parentNode) {
            const idx = node.parentNode.childNodes.indexOf(node);
    
            node.parentNode.childNodes.splice(idx, 1);
            node.parentNode = null;
        }
    };
    
    exports.insertText = function(parentNode, text) {
        if (parentNode.childNodes.length) {
            const prevNode = parentNode.childNodes[parentNode.childNodes.length - 1];
    
            if (prevNode.nodeName === '#text') {
                prevNode.value += text;
                return;
            }
        }
    
        appendChild(parentNode, createTextNode(text));
    };
    
    exports.insertTextBefore = function(parentNode, text, referenceNode) {
        const prevNode = parentNode.childNodes[parentNode.childNodes.indexOf(referenceNode) - 1];
    
        if (prevNode && prevNode.nodeName === '#text') {
            prevNode.value += text;
        } else {
            insertBefore(parentNode, createTextNode(text), referenceNode);
        }
    };
    
    exports.adoptAttributes = function(recipient, attrs) {
        const recipientAttrsMap = [];
    
        for (let i = 0; i < recipient.attrs.length; i++) {
            recipientAttrsMap.push(recipient.attrs[i].name);
        }
    
        for (let j = 0; j < attrs.length; j++) {
            if (recipientAttrsMap.indexOf(attrs[j].name) === -1) {
                recipient.attrs.push(attrs[j]);
            }
        }
    };
    
    //Tree traversing
    exports.getFirstChild = function(node) {
        return node.childNodes[0];
    };
    
    exports.getChildNodes = function(node) {
        return node.childNodes;
    };
    
    exports.getParentNode = function(node) {
        return node.parentNode;
    };
    
    exports.getAttrList = function(element) {
        return element.attrs;
    };
    
    //Node data
    exports.getTagName = function(element) {
        return element.tagName;
    };
    
    exports.getNamespaceURI = function(element) {
        return element.namespaceURI;
    };
    
    exports.getTextNodeContent = function(textNode) {
        return textNode.value;
    };
    
    exports.getCommentNodeContent = function(commentNode) {
        return commentNode.data;
    };
    
    exports.getDocumentTypeNodeName = function(doctypeNode) {
        return doctypeNode.name;
    };
    
    exports.getDocumentTypeNodePublicId = function(doctypeNode) {
        return doctypeNode.publicId;
    };
    
    exports.getDocumentTypeNodeSystemId = function(doctypeNode) {
        return doctypeNode.systemId;
    };
    
    //Node types
    exports.isTextNode = function(node) {
        return node.nodeName === '#text';
    };
    
    exports.isCommentNode = function(node) {
        return node.nodeName === '#comment';
    };
    
    exports.isDocumentTypeNode = function(node) {
        return node.nodeName === '#documentType';
    };
    
    exports.isElementNode = function(node) {
        return !!node.tagName;
    };
    
    // Source code location
    exports.setNodeSourceCodeLocation = function(node, location) {
        node.sourceCodeLocation = location;
    };
    
    exports.getNodeSourceCodeLocation = function(node) {
        return node.sourceCodeLocation;
    };
    
    exports.updateNodeSourceCodeLocation = function(node, endLocation) {
        node.sourceCodeLocation = Object.assign(node.sourceCodeLocation, endLocation);
    };
    
    
    /***/ }),
    /* 23 */
    /***/ ((module) => {
    
    "use strict";
    
    
    module.exports = function mergeOptions(defaults, options) {
        options = options || Object.create(null);
    
        return [defaults, options].reduce((merged, optObj) => {
            Object.keys(optObj).forEach(key => {
                merged[key] = optObj[key];
            });
    
            return merged;
        }, Object.create(null));
    };
    
    
    /***/ }),
    /* 24 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    "use strict";
    
    
    const { DOCUMENT_MODE } = __webpack_require__(11);
    
    //Const
    const VALID_DOCTYPE_NAME = 'html';
    const VALID_SYSTEM_ID = 'about:legacy-compat';
    const QUIRKS_MODE_SYSTEM_ID = 'http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd';
    
    const QUIRKS_MODE_PUBLIC_ID_PREFIXES = [
        '+//silmaril//dtd html pro v0r11 19970101//',
        '-//as//dtd html 3.0 aswedit + extensions//',
        '-//advasoft ltd//dtd html 3.0 aswedit + extensions//',
        '-//ietf//dtd html 2.0 level 1//',
        '-//ietf//dtd html 2.0 level 2//',
        '-//ietf//dtd html 2.0 strict level 1//',
        '-//ietf//dtd html 2.0 strict level 2//',
        '-//ietf//dtd html 2.0 strict//',
        '-//ietf//dtd html 2.0//',
        '-//ietf//dtd html 2.1e//',
        '-//ietf//dtd html 3.0//',
        '-//ietf//dtd html 3.2 final//',
        '-//ietf//dtd html 3.2//',
        '-//ietf//dtd html 3//',
        '-//ietf//dtd html level 0//',
        '-//ietf//dtd html level 1//',
        '-//ietf//dtd html level 2//',
        '-//ietf//dtd html level 3//',
        '-//ietf//dtd html strict level 0//',
        '-//ietf//dtd html strict level 1//',
        '-//ietf//dtd html strict level 2//',
        '-//ietf//dtd html strict level 3//',
        '-//ietf//dtd html strict//',
        '-//ietf//dtd html//',
        '-//metrius//dtd metrius presentational//',
        '-//microsoft//dtd internet explorer 2.0 html strict//',
        '-//microsoft//dtd internet explorer 2.0 html//',
        '-//microsoft//dtd internet explorer 2.0 tables//',
        '-//microsoft//dtd internet explorer 3.0 html strict//',
        '-//microsoft//dtd internet explorer 3.0 html//',
        '-//microsoft//dtd internet explorer 3.0 tables//',
        '-//netscape comm. corp.//dtd html//',
        '-//netscape comm. corp.//dtd strict html//',
        "-//o'reilly and associates//dtd html 2.0//",
        "-//o'reilly and associates//dtd html extended 1.0//",
        "-//o'reilly and associates//dtd html extended relaxed 1.0//",
        '-//sq//dtd html 2.0 hotmetal + extensions//',
        '-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//',
        '-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//',
        '-//spyglass//dtd html 2.0 extended//',
        '-//sun microsystems corp.//dtd hotjava html//',
        '-//sun microsystems corp.//dtd hotjava strict html//',
        '-//w3c//dtd html 3 1995-03-24//',
        '-//w3c//dtd html 3.2 draft//',
        '-//w3c//dtd html 3.2 final//',
        '-//w3c//dtd html 3.2//',
        '-//w3c//dtd html 3.2s draft//',
        '-//w3c//dtd html 4.0 frameset//',
        '-//w3c//dtd html 4.0 transitional//',
        '-//w3c//dtd html experimental 19960712//',
        '-//w3c//dtd html experimental 970421//',
        '-//w3c//dtd w3 html//',
        '-//w3o//dtd w3 html 3.0//',
        '-//webtechs//dtd mozilla html 2.0//',
        '-//webtechs//dtd mozilla html//'
    ];
    
    const QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES = QUIRKS_MODE_PUBLIC_ID_PREFIXES.concat([
        '-//w3c//dtd html 4.01 frameset//',
        '-//w3c//dtd html 4.01 transitional//'
    ]);
    
    const QUIRKS_MODE_PUBLIC_IDS = ['-//w3o//dtd w3 html strict 3.0//en//', '-/w3c/dtd html 4.0 transitional/en', 'html'];
    const LIMITED_QUIRKS_PUBLIC_ID_PREFIXES = ['-//w3c//dtd xhtml 1.0 frameset//', '-//w3c//dtd xhtml 1.0 transitional//'];
    
    const LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES = LIMITED_QUIRKS_PUBLIC_ID_PREFIXES.concat([
        '-//w3c//dtd html 4.01 frameset//',
        '-//w3c//dtd html 4.01 transitional//'
    ]);
    
    //Utils
    function enquoteDoctypeId(id) {
        const quote = id.indexOf('"') !== -1 ? "'" : '"';
    
        return quote + id + quote;
    }
    
    function hasPrefix(publicId, prefixes) {
        for (let i = 0; i < prefixes.length; i++) {
            if (publicId.indexOf(prefixes[i]) === 0) {
                return true;
            }
        }
    
        return false;
    }
    
    //API
    exports.isConforming = function(token) {
        return (
            token.name === VALID_DOCTYPE_NAME &&
            token.publicId === null &&
            (token.systemId === null || token.systemId === VALID_SYSTEM_ID)
        );
    };
    
    exports.getDocumentMode = function(token) {
        if (token.name !== VALID_DOCTYPE_NAME) {
            return DOCUMENT_MODE.QUIRKS;
        }
    
        const systemId = token.systemId;
    
        if (systemId && systemId.toLowerCase() === QUIRKS_MODE_SYSTEM_ID) {
            return DOCUMENT_MODE.QUIRKS;
        }
    
        let publicId = token.publicId;
    
        if (publicId !== null) {
            publicId = publicId.toLowerCase();
    
            if (QUIRKS_MODE_PUBLIC_IDS.indexOf(publicId) > -1) {
                return DOCUMENT_MODE.QUIRKS;
            }
    
            let prefixes = systemId === null ? QUIRKS_MODE_NO_SYSTEM_ID_PUBLIC_ID_PREFIXES : QUIRKS_MODE_PUBLIC_ID_PREFIXES;
    
            if (hasPrefix(publicId, prefixes)) {
                return DOCUMENT_MODE.QUIRKS;
            }
    
            prefixes =
                systemId === null ? LIMITED_QUIRKS_PUBLIC_ID_PREFIXES : LIMITED_QUIRKS_WITH_SYSTEM_ID_PUBLIC_ID_PREFIXES;
    
            if (hasPrefix(publicId, prefixes)) {
                return DOCUMENT_MODE.LIMITED_QUIRKS;
            }
        }
    
        return DOCUMENT_MODE.NO_QUIRKS;
    };
    
    exports.serializeContent = function(name, publicId, systemId) {
        let str = '!DOCTYPE ';
    
        if (name) {
            str += name;
        }
    
        if (publicId) {
            str += ' PUBLIC ' + enquoteDoctypeId(publicId);
        } else if (systemId) {
            str += ' SYSTEM';
        }
    
        if (systemId !== null) {
            str += ' ' + enquoteDoctypeId(systemId);
        }
    
        return str;
    };
    
    
    /***/ }),
    /* 25 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    "use strict";
    
    
    const Tokenizer = __webpack_require__(5);
    const HTML = __webpack_require__(11);
    
    //Aliases
    const $ = HTML.TAG_NAMES;
    const NS = HTML.NAMESPACES;
    const ATTRS = HTML.ATTRS;
    
    //MIME types
    const MIME_TYPES = {
        TEXT_HTML: 'text/html',
        APPLICATION_XML: 'application/xhtml+xml'
    };
    
    //Attributes
    const DEFINITION_URL_ATTR = 'definitionurl';
    const ADJUSTED_DEFINITION_URL_ATTR = 'definitionURL';
    const SVG_ATTRS_ADJUSTMENT_MAP = {
        attributename: 'attributeName',
        attributetype: 'attributeType',
        basefrequency: 'baseFrequency',
        baseprofile: 'baseProfile',
        calcmode: 'calcMode',
        clippathunits: 'clipPathUnits',
        diffuseconstant: 'diffuseConstant',
        edgemode: 'edgeMode',
        filterunits: 'filterUnits',
        glyphref: 'glyphRef',
        gradienttransform: 'gradientTransform',
        gradientunits: 'gradientUnits',
        kernelmatrix: 'kernelMatrix',
        kernelunitlength: 'kernelUnitLength',
        keypoints: 'keyPoints',
        keysplines: 'keySplines',
        keytimes: 'keyTimes',
        lengthadjust: 'lengthAdjust',
        limitingconeangle: 'limitingConeAngle',
        markerheight: 'markerHeight',
        markerunits: 'markerUnits',
        markerwidth: 'markerWidth',
        maskcontentunits: 'maskContentUnits',
        maskunits: 'maskUnits',
        numoctaves: 'numOctaves',
        pathlength: 'pathLength',
        patterncontentunits: 'patternContentUnits',
        patterntransform: 'patternTransform',
        patternunits: 'patternUnits',
        pointsatx: 'pointsAtX',
        pointsaty: 'pointsAtY',
        pointsatz: 'pointsAtZ',
        preservealpha: 'preserveAlpha',
        preserveaspectratio: 'preserveAspectRatio',
        primitiveunits: 'primitiveUnits',
        refx: 'refX',
        refy: 'refY',
        repeatcount: 'repeatCount',
        repeatdur: 'repeatDur',
        requiredextensions: 'requiredExtensions',
        requiredfeatures: 'requiredFeatures',
        specularconstant: 'specularConstant',
        specularexponent: 'specularExponent',
        spreadmethod: 'spreadMethod',
        startoffset: 'startOffset',
        stddeviation: 'stdDeviation',
        stitchtiles: 'stitchTiles',
        surfacescale: 'surfaceScale',
        systemlanguage: 'systemLanguage',
        tablevalues: 'tableValues',
        targetx: 'targetX',
        targety: 'targetY',
        textlength: 'textLength',
        viewbox: 'viewBox',
        viewtarget: 'viewTarget',
        xchannelselector: 'xChannelSelector',
        ychannelselector: 'yChannelSelector',
        zoomandpan: 'zoomAndPan'
    };
    
    const XML_ATTRS_ADJUSTMENT_MAP = {
        'xlink:actuate': { prefix: 'xlink', name: 'actuate', namespace: NS.XLINK },
        'xlink:arcrole': { prefix: 'xlink', name: 'arcrole', namespace: NS.XLINK },
        'xlink:href': { prefix: 'xlink', name: 'href', namespace: NS.XLINK },
        'xlink:role': { prefix: 'xlink', name: 'role', namespace: NS.XLINK },
        'xlink:show': { prefix: 'xlink', name: 'show', namespace: NS.XLINK },
        'xlink:title': { prefix: 'xlink', name: 'title', namespace: NS.XLINK },
        'xlink:type': { prefix: 'xlink', name: 'type', namespace: NS.XLINK },
        'xml:base': { prefix: 'xml', name: 'base', namespace: NS.XML },
        'xml:lang': { prefix: 'xml', name: 'lang', namespace: NS.XML },
        'xml:space': { prefix: 'xml', name: 'space', namespace: NS.XML },
        xmlns: { prefix: '', name: 'xmlns', namespace: NS.XMLNS },
        'xmlns:xlink': { prefix: 'xmlns', name: 'xlink', namespace: NS.XMLNS }
    };
    
    //SVG tag names adjustment map
    const SVG_TAG_NAMES_ADJUSTMENT_MAP = (exports.SVG_TAG_NAMES_ADJUSTMENT_MAP = {
        altglyph: 'altGlyph',
        altglyphdef: 'altGlyphDef',
        altglyphitem: 'altGlyphItem',
        animatecolor: 'animateColor',
        animatemotion: 'animateMotion',
        animatetransform: 'animateTransform',
        clippath: 'clipPath',
        feblend: 'feBlend',
        fecolormatrix: 'feColorMatrix',
        fecomponenttransfer: 'feComponentTransfer',
        fecomposite: 'feComposite',
        feconvolvematrix: 'feConvolveMatrix',
        fediffuselighting: 'feDiffuseLighting',
        fedisplacementmap: 'feDisplacementMap',
        fedistantlight: 'feDistantLight',
        feflood: 'feFlood',
        fefunca: 'feFuncA',
        fefuncb: 'feFuncB',
        fefuncg: 'feFuncG',
        fefuncr: 'feFuncR',
        fegaussianblur: 'feGaussianBlur',
        feimage: 'feImage',
        femerge: 'feMerge',
        femergenode: 'feMergeNode',
        femorphology: 'feMorphology',
        feoffset: 'feOffset',
        fepointlight: 'fePointLight',
        fespecularlighting: 'feSpecularLighting',
        fespotlight: 'feSpotLight',
        fetile: 'feTile',
        feturbulence: 'feTurbulence',
        foreignobject: 'foreignObject',
        glyphref: 'glyphRef',
        lineargradient: 'linearGradient',
        radialgradient: 'radialGradient',
        textpath: 'textPath'
    });
    
    //Tags that causes exit from foreign content
    const EXITS_FOREIGN_CONTENT = {
        [$.B]: true,
        [$.BIG]: true,
        [$.BLOCKQUOTE]: true,
        [$.BODY]: true,
        [$.BR]: true,
        [$.CENTER]: true,
        [$.CODE]: true,
        [$.DD]: true,
        [$.DIV]: true,
        [$.DL]: true,
        [$.DT]: true,
        [$.EM]: true,
        [$.EMBED]: true,
        [$.H1]: true,
        [$.H2]: true,
        [$.H3]: true,
        [$.H4]: true,
        [$.H5]: true,
        [$.H6]: true,
        [$.HEAD]: true,
        [$.HR]: true,
        [$.I]: true,
        [$.IMG]: true,
        [$.LI]: true,
        [$.LISTING]: true,
        [$.MENU]: true,
        [$.META]: true,
        [$.NOBR]: true,
        [$.OL]: true,
        [$.P]: true,
        [$.PRE]: true,
        [$.RUBY]: true,
        [$.S]: true,
        [$.SMALL]: true,
        [$.SPAN]: true,
        [$.STRONG]: true,
        [$.STRIKE]: true,
        [$.SUB]: true,
        [$.SUP]: true,
        [$.TABLE]: true,
        [$.TT]: true,
        [$.U]: true,
        [$.UL]: true,
        [$.VAR]: true
    };
    
    //Check exit from foreign content
    exports.causesExit = function(startTagToken) {
        const tn = startTagToken.tagName;
        const isFontWithAttrs =
            tn === $.FONT &&
            (Tokenizer.getTokenAttr(startTagToken, ATTRS.COLOR) !== null ||
                Tokenizer.getTokenAttr(startTagToken, ATTRS.SIZE) !== null ||
                Tokenizer.getTokenAttr(startTagToken, ATTRS.FACE) !== null);
    
        return isFontWithAttrs ? true : EXITS_FOREIGN_CONTENT[tn];
    };
    
    //Token adjustments
    exports.adjustTokenMathMLAttrs = function(token) {
        for (let i = 0; i < token.attrs.length; i++) {
            if (token.attrs[i].name === DEFINITION_URL_ATTR) {
                token.attrs[i].name = ADJUSTED_DEFINITION_URL_ATTR;
                break;
            }
        }
    };
    
    exports.adjustTokenSVGAttrs = function(token) {
        for (let i = 0; i < token.attrs.length; i++) {
            const adjustedAttrName = SVG_ATTRS_ADJUSTMENT_MAP[token.attrs[i].name];
    
            if (adjustedAttrName) {
                token.attrs[i].name = adjustedAttrName;
            }
        }
    };
    
    exports.adjustTokenXMLAttrs = function(token) {
        for (let i = 0; i < token.attrs.length; i++) {
            const adjustedAttrEntry = XML_ATTRS_ADJUSTMENT_MAP[token.attrs[i].name];
    
            if (adjustedAttrEntry) {
                token.attrs[i].prefix = adjustedAttrEntry.prefix;
                token.attrs[i].name = adjustedAttrEntry.name;
                token.attrs[i].namespace = adjustedAttrEntry.namespace;
            }
        }
    };
    
    exports.adjustTokenSVGTagName = function(token) {
        const adjustedTagName = SVG_TAG_NAMES_ADJUSTMENT_MAP[token.tagName];
    
        if (adjustedTagName) {
            token.tagName = adjustedTagName;
        }
    };
    
    //Integration points
    function isMathMLTextIntegrationPoint(tn, ns) {
        return ns === NS.MATHML && (tn === $.MI || tn === $.MO || tn === $.MN || tn === $.MS || tn === $.MTEXT);
    }
    
    function isHtmlIntegrationPoint(tn, ns, attrs) {
        if (ns === NS.MATHML && tn === $.ANNOTATION_XML) {
            for (let i = 0; i < attrs.length; i++) {
                if (attrs[i].name === ATTRS.ENCODING) {
                    const value = attrs[i].value.toLowerCase();
    
                    return value === MIME_TYPES.TEXT_HTML || value === MIME_TYPES.APPLICATION_XML;
                }
            }
        }
    
        return ns === NS.SVG && (tn === $.FOREIGN_OBJECT || tn === $.DESC || tn === $.TITLE);
    }
    
    exports.isIntegrationPoint = function(tn, ns, attrs, foreignNS) {
        if ((!foreignNS || foreignNS === NS.HTML) && isHtmlIntegrationPoint(tn, ns, attrs)) {
            return true;
        }
    
        if ((!foreignNS || foreignNS === NS.MATHML) && isMathMLTextIntegrationPoint(tn, ns)) {
            return true;
        }
    
        return false;
    };
    
    
    /***/ }),
    /* 26 */
    /***/ ((module, __unused_webpack_exports, __webpack_require__) => {
    
    "use strict";
    
    
    const defaultTreeAdapter = __webpack_require__(22);
    const mergeOptions = __webpack_require__(23);
    const doctype = __webpack_require__(24);
    const HTML = __webpack_require__(11);
    
    //Aliases
    const $ = HTML.TAG_NAMES;
    const NS = HTML.NAMESPACES;
    
    //Default serializer options
    const DEFAULT_OPTIONS = {
        treeAdapter: defaultTreeAdapter
    };
    
    //Escaping regexes
    const AMP_REGEX = /&/g;
    const NBSP_REGEX = /\u00a0/g;
    const DOUBLE_QUOTE_REGEX = /"/g;
    const LT_REGEX = /</g;
    const GT_REGEX = />/g;
    
    //Serializer
    class Serializer {
        constructor(node, options) {
            this.options = mergeOptions(DEFAULT_OPTIONS, options);
            this.treeAdapter = this.options.treeAdapter;
    
            this.html = '';
            this.startNode = node;
        }
    
        //API
        serialize() {
            this._serializeChildNodes(this.startNode);
    
            return this.html;
        }
    
        //Internals
        _serializeChildNodes(parentNode) {
            const childNodes = this.treeAdapter.getChildNodes(parentNode);
    
            if (childNodes) {
                for (let i = 0, cnLength = childNodes.length; i < cnLength; i++) {
                    const currentNode = childNodes[i];
    
                    if (this.treeAdapter.isElementNode(currentNode)) {
                        this._serializeElement(currentNode);
                    } else if (this.treeAdapter.isTextNode(currentNode)) {
                        this._serializeTextNode(currentNode);
                    } else if (this.treeAdapter.isCommentNode(currentNode)) {
                        this._serializeCommentNode(currentNode);
                    } else if (this.treeAdapter.isDocumentTypeNode(currentNode)) {
                        this._serializeDocumentTypeNode(currentNode);
                    }
                }
            }
        }
    
        _serializeElement(node) {
            const tn = this.treeAdapter.getTagName(node);
            const ns = this.treeAdapter.getNamespaceURI(node);
    
            this.html += '<' + tn;
            this._serializeAttributes(node);
            this.html += '>';
    
            if (
                tn !== $.AREA &&
                tn !== $.BASE &&
                tn !== $.BASEFONT &&
                tn !== $.BGSOUND &&
                tn !== $.BR &&
                tn !== $.COL &&
                tn !== $.EMBED &&
                tn !== $.FRAME &&
                tn !== $.HR &&
                tn !== $.IMG &&
                tn !== $.INPUT &&
                tn !== $.KEYGEN &&
                tn !== $.LINK &&
                tn !== $.META &&
                tn !== $.PARAM &&
                tn !== $.SOURCE &&
                tn !== $.TRACK &&
                tn !== $.WBR
            ) {
                const childNodesHolder =
                    tn === $.TEMPLATE && ns === NS.HTML ? this.treeAdapter.getTemplateContent(node) : node;
    
                this._serializeChildNodes(childNodesHolder);
                this.html += '</' + tn + '>';
            }
        }
    
        _serializeAttributes(node) {
            const attrs = this.treeAdapter.getAttrList(node);
    
            for (let i = 0, attrsLength = attrs.length; i < attrsLength; i++) {
                const attr = attrs[i];
                const value = Serializer.escapeString(attr.value, true);
    
                this.html += ' ';
    
                if (!attr.namespace) {
                    this.html += attr.name;
                } else if (attr.namespace === NS.XML) {
                    this.html += 'xml:' + attr.name;
                } else if (attr.namespace === NS.XMLNS) {
                    if (attr.name !== 'xmlns') {
                        this.html += 'xmlns:';
                    }
    
                    this.html += attr.name;
                } else if (attr.namespace === NS.XLINK) {
                    this.html += 'xlink:' + attr.name;
                } else {
                    this.html += attr.prefix + ':' + attr.name;
                }
    
                this.html += '="' + value + '"';
            }
        }
    
        _serializeTextNode(node) {
            const content = this.treeAdapter.getTextNodeContent(node);
            const parent = this.treeAdapter.getParentNode(node);
            let parentTn = void 0;
    
            if (parent && this.treeAdapter.isElementNode(parent)) {
                parentTn = this.treeAdapter.getTagName(parent);
            }
    
            if (
                parentTn === $.STYLE ||
                parentTn === $.SCRIPT ||
                parentTn === $.XMP ||
                parentTn === $.IFRAME ||
                parentTn === $.NOEMBED ||
                parentTn === $.NOFRAMES ||
                parentTn === $.PLAINTEXT ||
                parentTn === $.NOSCRIPT
            ) {
                this.html += content;
            } else {
                this.html += Serializer.escapeString(content, false);
            }
        }
    
        _serializeCommentNode(node) {
            this.html += '<!--' + this.treeAdapter.getCommentNodeContent(node) + '-->';
        }
    
        _serializeDocumentTypeNode(node) {
            const name = this.treeAdapter.getDocumentTypeNodeName(node);
    
            this.html += '<' + doctype.serializeContent(name, null, null) + '>';
        }
    }
    
    // NOTE: used in tests and by rewriting stream
    Serializer.escapeString = function(str, attrMode) {
        str = str.replace(AMP_REGEX, '&amp;').replace(NBSP_REGEX, '&nbsp;');
    
        if (attrMode) {
            str = str.replace(DOUBLE_QUOTE_REGEX, '&quot;');
        } else {
            str = str.replace(LT_REGEX, '&lt;').replace(GT_REGEX, '&gt;');
        }
    
        return str;
    };
    
    module.exports = Serializer;
    
    
    /***/ }),
    /* 27 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var css_tree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
    /* harmony import */ var _events_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
    /* harmony import */ var _parsel_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(138);
    
    
    
    
    class CSS extends _events_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
        constructor(ctx) {
            super();
            this.ctx = ctx;
            this.meta = ctx.meta;
            this.parsel = _parsel_js__WEBPACK_IMPORTED_MODULE_2__["default"];
            this.parse = css_tree__WEBPACK_IMPORTED_MODULE_0__.parse;
            this.walk = css_tree__WEBPACK_IMPORTED_MODULE_0__.walk;
            this.generate = css_tree__WEBPACK_IMPORTED_MODULE_0__.generate;
        };
        rewrite(str, options) {
            return this.recast(str, options, 'rewrite');
        };
        source(str, options) {
            return this.recast(str, options, 'source');
        };
        recast(str, options, type) {
            if (!str) return str;
            str = new String(str).toString();
            try {
                const ast = this.parse(str, { ...options, parseCustomProperty: true });
                this.walk(ast, node => {
                    this.emit(node.type, node, options, type);
                });
                return this.generate(ast);
            } catch(e) {
                return str;
            };
        };
    };
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CSS);
    
    /***/ }),
    /* 28 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "version": () => (/* reexport safe */ _version_js__WEBPACK_IMPORTED_MODULE_1__.version),
    /* harmony export */   "createSyntax": () => (/* reexport safe */ _syntax_create_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
    /* harmony export */   "List": () => (/* reexport safe */ _utils_List_js__WEBPACK_IMPORTED_MODULE_3__.List),
    /* harmony export */   "Lexer": () => (/* reexport safe */ _lexer_Lexer_js__WEBPACK_IMPORTED_MODULE_4__.Lexer),
    /* harmony export */   "tokenTypes": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_5__.tokenTypes),
    /* harmony export */   "tokenNames": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_5__.tokenNames),
    /* harmony export */   "TokenStream": () => (/* reexport safe */ _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_5__.TokenStream),
    /* harmony export */   "definitionSyntax": () => (/* reexport module object */ _definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_6__),
    /* harmony export */   "clone": () => (/* reexport safe */ _utils_clone_js__WEBPACK_IMPORTED_MODULE_7__.clone),
    /* harmony export */   "isCustomProperty": () => (/* reexport safe */ _utils_names_js__WEBPACK_IMPORTED_MODULE_8__.isCustomProperty),
    /* harmony export */   "keyword": () => (/* reexport safe */ _utils_names_js__WEBPACK_IMPORTED_MODULE_8__.keyword),
    /* harmony export */   "property": () => (/* reexport safe */ _utils_names_js__WEBPACK_IMPORTED_MODULE_8__.property),
    /* harmony export */   "vendorPrefix": () => (/* reexport safe */ _utils_names_js__WEBPACK_IMPORTED_MODULE_8__.vendorPrefix),
    /* harmony export */   "ident": () => (/* reexport module object */ _utils_ident_js__WEBPACK_IMPORTED_MODULE_9__),
    /* harmony export */   "string": () => (/* reexport module object */ _utils_string_js__WEBPACK_IMPORTED_MODULE_10__),
    /* harmony export */   "url": () => (/* reexport module object */ _utils_url_js__WEBPACK_IMPORTED_MODULE_11__),
    /* harmony export */   "tokenize": () => (/* binding */ tokenize),
    /* harmony export */   "parse": () => (/* binding */ parse),
    /* harmony export */   "generate": () => (/* binding */ generate),
    /* harmony export */   "lexer": () => (/* binding */ lexer),
    /* harmony export */   "createLexer": () => (/* binding */ createLexer),
    /* harmony export */   "walk": () => (/* binding */ walk),
    /* harmony export */   "find": () => (/* binding */ find),
    /* harmony export */   "findLast": () => (/* binding */ findLast),
    /* harmony export */   "findAll": () => (/* binding */ findAll),
    /* harmony export */   "toPlainObject": () => (/* binding */ toPlainObject),
    /* harmony export */   "fromPlainObject": () => (/* binding */ fromPlainObject),
    /* harmony export */   "fork": () => (/* binding */ fork)
    /* harmony export */ });
    /* harmony import */ var _syntax_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(29);
    /* harmony import */ var _version_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(135);
    /* harmony import */ var _syntax_create_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30);
    /* harmony import */ var _utils_List_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(40);
    /* harmony import */ var _lexer_Lexer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(55);
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(31);
    /* harmony import */ var _definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(62);
    /* harmony import */ var _utils_clone_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(136);
    /* harmony import */ var _utils_names_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(58);
    /* harmony import */ var _utils_ident_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(137);
    /* harmony import */ var _utils_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(111);
    /* harmony import */ var _utils_url_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(116);
    
    
    
    
    
    
    
    
    
    
    
    
    
    const {
        tokenize,
        parse,
        generate,
        lexer,
        createLexer,
    
        walk,
        find,
        findLast,
        findAll,
    
        toPlainObject,
        fromPlainObject,
    
        fork
    } = _syntax_index_js__WEBPACK_IMPORTED_MODULE_0__["default"];
    
    
    /***/ }),
    /* 29 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _create_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(30);
    /* harmony import */ var _config_lexer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74);
    /* harmony import */ var _config_parser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(119);
    /* harmony import */ var _config_walker_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(134);
    
    
    
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_create_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
        ..._config_lexer_js__WEBPACK_IMPORTED_MODULE_1__["default"],
        ..._config_parser_js__WEBPACK_IMPORTED_MODULE_2__["default"],
        ..._config_walker_js__WEBPACK_IMPORTED_MODULE_3__["default"]
    }));
    
    
    /***/ }),
    /* 30 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    /* harmony import */ var _parser_create_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(39);
    /* harmony import */ var _generator_create_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(44);
    /* harmony import */ var _convertor_create_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(53);
    /* harmony import */ var _walker_create_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(54);
    /* harmony import */ var _lexer_Lexer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(55);
    /* harmony import */ var _config_mix_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(73);
    
    
    
    
    
    
    
    
    function createSyntax(config) {
        const parse = (0,_parser_create_js__WEBPACK_IMPORTED_MODULE_1__.createParser)(config);
        const walk = (0,_walker_create_js__WEBPACK_IMPORTED_MODULE_4__.createWalker)(config);
        const generate = (0,_generator_create_js__WEBPACK_IMPORTED_MODULE_2__.createGenerator)(config);
        const { fromPlainObject, toPlainObject } = (0,_convertor_create_js__WEBPACK_IMPORTED_MODULE_3__.createConvertor)(walk);
    
        const syntax = {
            lexer: null,
            createLexer: config => new _lexer_Lexer_js__WEBPACK_IMPORTED_MODULE_5__.Lexer(config, syntax, syntax.lexer.structure),
    
            tokenize: _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.tokenize,
            parse,
            generate,
    
            walk,
            find: walk.find,
            findLast: walk.findLast,
            findAll: walk.findAll,
    
            fromPlainObject,
            toPlainObject,
    
            fork(extension) {
                const base = (0,_config_mix_js__WEBPACK_IMPORTED_MODULE_6__["default"])({}, config); // copy of config
    
                return createSyntax(
                    typeof extension === 'function'
                        ? extension(base, Object.assign)
                        : (0,_config_mix_js__WEBPACK_IMPORTED_MODULE_6__["default"])(base, extension)
                );
            }
        };
    
        syntax.lexer = new _lexer_Lexer_js__WEBPACK_IMPORTED_MODULE_5__.Lexer({
            generic: true,
            types: config.types,
            atrules: config.atrules,
            properties: config.properties,
            node: config.node
        }, syntax);
    
        return syntax;
    };
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (config => createSyntax((0,_config_mix_js__WEBPACK_IMPORTED_MODULE_6__["default"])({}, config)));
    
    
    /***/ }),
    /* 31 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "tokenize": () => (/* binding */ tokenize),
    /* harmony export */   "AtKeyword": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword),
    /* harmony export */   "BadString": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.BadString),
    /* harmony export */   "BadUrl": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl),
    /* harmony export */   "CDC": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.CDC),
    /* harmony export */   "CDO": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.CDO),
    /* harmony export */   "Colon": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Colon),
    /* harmony export */   "Comma": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Comma),
    /* harmony export */   "Comment": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Comment),
    /* harmony export */   "Delim": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim),
    /* harmony export */   "Dimension": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Dimension),
    /* harmony export */   "EOF": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.EOF),
    /* harmony export */   "Function": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Function),
    /* harmony export */   "Hash": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Hash),
    /* harmony export */   "Ident": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Ident),
    /* harmony export */   "LeftCurlyBracket": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.LeftCurlyBracket),
    /* harmony export */   "LeftParenthesis": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.LeftParenthesis),
    /* harmony export */   "LeftSquareBracket": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.LeftSquareBracket),
    /* harmony export */   "Number": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Number),
    /* harmony export */   "Percentage": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Percentage),
    /* harmony export */   "RightCurlyBracket": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.RightCurlyBracket),
    /* harmony export */   "RightParenthesis": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis),
    /* harmony export */   "RightSquareBracket": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.RightSquareBracket),
    /* harmony export */   "Semicolon": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Semicolon),
    /* harmony export */   "String": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.String),
    /* harmony export */   "Url": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.Url),
    /* harmony export */   "WhiteSpace": () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_0__.WhiteSpace),
    /* harmony export */   "tokenTypes": () => (/* reexport module object */ _types_js__WEBPACK_IMPORTED_MODULE_0__),
    /* harmony export */   "tokenNames": () => (/* reexport safe */ _names_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
    /* harmony export */   "DigitCategory": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.DigitCategory),
    /* harmony export */   "EofCategory": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.EofCategory),
    /* harmony export */   "NameStartCategory": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.NameStartCategory),
    /* harmony export */   "NonPrintableCategory": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.NonPrintableCategory),
    /* harmony export */   "WhiteSpaceCategory": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.WhiteSpaceCategory),
    /* harmony export */   "charCodeCategory": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.charCodeCategory),
    /* harmony export */   "isBOM": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isBOM),
    /* harmony export */   "isDigit": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isDigit),
    /* harmony export */   "isHexDigit": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isHexDigit),
    /* harmony export */   "isIdentifierStart": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isIdentifierStart),
    /* harmony export */   "isLetter": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isLetter),
    /* harmony export */   "isLowercaseLetter": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isLowercaseLetter),
    /* harmony export */   "isName": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isName),
    /* harmony export */   "isNameStart": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNameStart),
    /* harmony export */   "isNewline": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNewline),
    /* harmony export */   "isNonAscii": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNonAscii),
    /* harmony export */   "isNonPrintable": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNonPrintable),
    /* harmony export */   "isNumberStart": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNumberStart),
    /* harmony export */   "isUppercaseLetter": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isUppercaseLetter),
    /* harmony export */   "isValidEscape": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isValidEscape),
    /* harmony export */   "isWhiteSpace": () => (/* reexport safe */ _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isWhiteSpace),
    /* harmony export */   "cmpChar": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.cmpChar),
    /* harmony export */   "cmpStr": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.cmpStr),
    /* harmony export */   "consumeBadUrlRemnants": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeBadUrlRemnants),
    /* harmony export */   "consumeEscaped": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeEscaped),
    /* harmony export */   "consumeName": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeName),
    /* harmony export */   "consumeNumber": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeNumber),
    /* harmony export */   "decodeEscaped": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.decodeEscaped),
    /* harmony export */   "findDecimalNumberEnd": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.findDecimalNumberEnd),
    /* harmony export */   "findWhiteSpaceEnd": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceEnd),
    /* harmony export */   "findWhiteSpaceStart": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceStart),
    /* harmony export */   "getNewlineLength": () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_2__.getNewlineLength),
    /* harmony export */   "OffsetToLocation": () => (/* reexport safe */ _OffsetToLocation_js__WEBPACK_IMPORTED_MODULE_4__.OffsetToLocation),
    /* harmony export */   "TokenStream": () => (/* reexport safe */ _TokenStream_js__WEBPACK_IMPORTED_MODULE_5__.TokenStream)
    /* harmony export */ });
    /* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
    /* harmony import */ var _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(33);
    /* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34);
    /* harmony import */ var _names_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(35);
    /* harmony import */ var _OffsetToLocation_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(36);
    /* harmony import */ var _TokenStream_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(38);
    
    
    
    
    function tokenize(source, onToken) {
        function getCharCode(offset) {
            return offset < sourceLength ? source.charCodeAt(offset) : 0;
        }
    
        // Â§ 4.3.3. Consume a numeric token
        function consumeNumericToken() {
            // Consume a number and let number be the result.
            offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeNumber)(source, offset);
    
            // If the next 3 input code points would start an identifier, then:
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isIdentifierStart)(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2))) {
                // Create a <dimension-token> with the same value and type flag as number, and a unit set initially to the empty string.
                // Consume a name. Set the <dimension-token>â€™s unit to the returned value.
                // Return the <dimension-token>.
                type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Dimension;
                offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeName)(source, offset);
                return;
            }
    
            // Otherwise, if the next input code point is U+0025 PERCENTAGE SIGN (%), consume it.
            if (getCharCode(offset) === 0x0025) {
                // Create a <percentage-token> with the same value as number, and return it.
                type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Percentage;
                offset++;
                return;
            }
    
            // Otherwise, create a <number-token> with the same value and type flag as number, and return it.
            type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Number;
        }
    
        // Â§ 4.3.4. Consume an ident-like token
        function consumeIdentLikeToken() {
            const nameStartOffset = offset;
    
            // Consume a name, and let string be the result.
            offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeName)(source, offset);
    
            // If stringâ€™s value is an ASCII case-insensitive match for "url",
            // and the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
            if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.cmpStr)(source, nameStartOffset, offset, 'url') && getCharCode(offset) === 0x0028) {
                // While the next two input code points are whitespace, consume the next input code point.
                offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceEnd)(source, offset + 1);
    
                // If the next one or two input code points are U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('),
                // or whitespace followed by U+0022 QUOTATION MARK (") or U+0027 APOSTROPHE ('),
                // then create a <function-token> with its value set to string and return it.
                if (getCharCode(offset) === 0x0022 ||
                    getCharCode(offset) === 0x0027) {
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Function;
                    offset = nameStartOffset + 4;
                    return;
                }
    
                // Otherwise, consume a url token, and return it.
                consumeUrlToken();
                return;
            }
    
            // Otherwise, if the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
            // Create a <function-token> with its value set to string and return it.
            if (getCharCode(offset) === 0x0028) {
                type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Function;
                offset++;
                return;
            }
    
            // Otherwise, create an <ident-token> with its value set to string and return it.
            type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Ident;
        }
    
        // Â§ 4.3.5. Consume a string token
        function consumeStringToken(endingCodePoint) {
            // This algorithm may be called with an ending code point, which denotes the code point
            // that ends the string. If an ending code point is not specified,
            // the current input code point is used.
            if (!endingCodePoint) {
                endingCodePoint = getCharCode(offset++);
            }
    
            // Initially create a <string-token> with its value set to the empty string.
            type = _types_js__WEBPACK_IMPORTED_MODULE_0__.String;
    
            // Repeatedly consume the next input code point from the stream:
            for (; offset < source.length; offset++) {
                const code = source.charCodeAt(offset);
    
                switch ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.charCodeCategory)(code)) {
                    // ending code point
                    case endingCodePoint:
                        // Return the <string-token>.
                        offset++;
                        return;
    
                        // EOF
                        // case EofCategory:
                        // This is a parse error. Return the <string-token>.
                        // return;
    
                    // newline
                    case _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.WhiteSpaceCategory:
                        if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNewline)(code)) {
                            // This is a parse error. Reconsume the current input code point,
                            // create a <bad-string-token>, and return it.
                            offset += (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getNewlineLength)(source, offset, code);
                            type = _types_js__WEBPACK_IMPORTED_MODULE_0__.BadString;
                            return;
                        }
                        break;
    
                    // U+005C REVERSE SOLIDUS (\)
                    case 0x005C:
                        // If the next input code point is EOF, do nothing.
                        if (offset === source.length - 1) {
                            break;
                        }
    
                        const nextCode = getCharCode(offset + 1);
    
                        // Otherwise, if the next input code point is a newline, consume it.
                        if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNewline)(nextCode)) {
                            offset += (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.getNewlineLength)(source, offset + 1, nextCode);
                        } else if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isValidEscape)(code, nextCode)) {
                            // Otherwise, (the stream starts with a valid escape) consume
                            // an escaped code point and append the returned code point to
                            // the <string-token>â€™s value.
                            offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeEscaped)(source, offset) - 1;
                        }
                        break;
    
                    // anything else
                    // Append the current input code point to the <string-token>â€™s value.
                }
            }
        }
    
        // Â§ 4.3.6. Consume a url token
        // Note: This algorithm assumes that the initial "url(" has already been consumed.
        // This algorithm also assumes that itâ€™s being called to consume an "unquoted" value, like url(foo).
        // A quoted value, like url("foo"), is parsed as a <function-token>. Consume an ident-like token
        // automatically handles this distinction; this algorithm shouldnâ€™t be called directly otherwise.
        function consumeUrlToken() {
            // Initially create a <url-token> with its value set to the empty string.
            type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Url;
    
            // Consume as much whitespace as possible.
            offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceEnd)(source, offset);
    
            // Repeatedly consume the next input code point from the stream:
            for (; offset < source.length; offset++) {
                const code = source.charCodeAt(offset);
    
                switch ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.charCodeCategory)(code)) {
                    // U+0029 RIGHT PARENTHESIS ())
                    case 0x0029:
                        // Return the <url-token>.
                        offset++;
                        return;
    
                        // EOF
                        // case EofCategory:
                        // This is a parse error. Return the <url-token>.
                        // return;
    
                    // whitespace
                    case _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.WhiteSpaceCategory:
                        // Consume as much whitespace as possible.
                        offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceEnd)(source, offset);
    
                        // If the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF,
                        // consume it and return the <url-token>
                        // (if EOF was encountered, this is a parse error);
                        if (getCharCode(offset) === 0x0029 || offset >= source.length) {
                            if (offset < source.length) {
                                offset++;
                            }
                            return;
                        }
    
                        // otherwise, consume the remnants of a bad url, create a <bad-url-token>,
                        // and return it.
                        offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeBadUrlRemnants)(source, offset);
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl;
                        return;
    
                    // U+0022 QUOTATION MARK (")
                    // U+0027 APOSTROPHE (')
                    // U+0028 LEFT PARENTHESIS (()
                    // non-printable code point
                    case 0x0022:
                    case 0x0027:
                    case 0x0028:
                    case _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.NonPrintableCategory:
                        // This is a parse error. Consume the remnants of a bad url,
                        // create a <bad-url-token>, and return it.
                        offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeBadUrlRemnants)(source, offset);
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl;
                        return;
    
                    // U+005C REVERSE SOLIDUS (\)
                    case 0x005C:
                        // If the stream starts with a valid escape, consume an escaped code point and
                        // append the returned code point to the <url-token>â€™s value.
                        if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isValidEscape)(code, getCharCode(offset + 1))) {
                            offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeEscaped)(source, offset) - 1;
                            break;
                        }
    
                        // Otherwise, this is a parse error. Consume the remnants of a bad url,
                        // create a <bad-url-token>, and return it.
                        offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeBadUrlRemnants)(source, offset);
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl;
                        return;
    
                    // anything else
                    // Append the current input code point to the <url-token>â€™s value.
                }
            }
        }
    
        // ensure source is a string
        source = String(source || '');
    
        const sourceLength = source.length;
        let start = (0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isBOM)(getCharCode(0));
        let offset = start;
        let type;
    
        // https://drafts.csswg.org/css-syntax-3/#consume-token
        // Â§ 4.3.1. Consume a token
        while (offset < sourceLength) {
            const code = source.charCodeAt(offset);
    
            switch ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.charCodeCategory)(code)) {
                // whitespace
                case _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.WhiteSpaceCategory:
                    // Consume as much whitespace as possible. Return a <whitespace-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.WhiteSpace;
                    offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceEnd)(source, offset + 1);
                    break;
    
                // U+0022 QUOTATION MARK (")
                case 0x0022:
                    // Consume a string token and return it.
                    consumeStringToken();
                    break;
    
                // U+0023 NUMBER SIGN (#)
                case 0x0023:
                    // If the next input code point is a name code point or the next two input code points are a valid escape, then:
                    if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isName)(getCharCode(offset + 1)) || (0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isValidEscape)(getCharCode(offset + 1), getCharCode(offset + 2))) {
                        // Create a <hash-token>.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Hash;
    
                        // If the next 3 input code points would start an identifier, set the <hash-token>â€™s type flag to "id".
                        // if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
                        //     // TODO: set id flag
                        // }
    
                        // Consume a name, and set the <hash-token>â€™s value to the returned string.
                        offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeName)(source, offset + 1);
    
                        // Return the <hash-token>.
                    } else {
                        // Otherwise, return a <delim-token> with its value set to the current input code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
    
                    break;
    
                // U+0027 APOSTROPHE (')
                case 0x0027:
                    // Consume a string token and return it.
                    consumeStringToken();
                    break;
    
                // U+0028 LEFT PARENTHESIS (()
                case 0x0028:
                    // Return a <(-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.LeftParenthesis;
                    offset++;
                    break;
    
                // U+0029 RIGHT PARENTHESIS ())
                case 0x0029:
                    // Return a <)-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis;
                    offset++;
                    break;
    
                // U+002B PLUS SIGN (+)
                case 0x002B:
                    // If the input stream starts with a number, ...
                    if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNumberStart)(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                        // ... reconsume the current input code point, consume a numeric token, and return it.
                        consumeNumericToken();
                    } else {
                        // Otherwise, return a <delim-token> with its value set to the current input code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
                    break;
    
                // U+002C COMMA (,)
                case 0x002C:
                    // Return a <comma-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Comma;
                    offset++;
                    break;
    
                // U+002D HYPHEN-MINUS (-)
                case 0x002D:
                    // If the input stream starts with a number, reconsume the current input code point, consume a numeric token, and return it.
                    if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNumberStart)(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                        consumeNumericToken();
                    } else {
                        // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
                        if (getCharCode(offset + 1) === 0x002D &&
                            getCharCode(offset + 2) === 0x003E) {
                            type = _types_js__WEBPACK_IMPORTED_MODULE_0__.CDC;
                            offset = offset + 3;
                        } else {
                            // Otherwise, if the input stream starts with an identifier, ...
                            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isIdentifierStart)(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                                // ... reconsume the current input code point, consume an ident-like token, and return it.
                                consumeIdentLikeToken();
                            } else {
                                // Otherwise, return a <delim-token> with its value set to the current input code point.
                                type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                                offset++;
                            }
                        }
                    }
                    break;
    
                // U+002E FULL STOP (.)
                case 0x002E:
                    // If the input stream starts with a number, ...
                    if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isNumberStart)(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
                        // ... reconsume the current input code point, consume a numeric token, and return it.
                        consumeNumericToken();
                    } else {
                        // Otherwise, return a <delim-token> with its value set to the current input code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
    
                    break;
    
                // U+002F SOLIDUS (/)
                case 0x002F:
                    // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A ASTERISK (*),
                    if (getCharCode(offset + 1) === 0x002A) {
                        // ... consume them and all following code points up to and including the first U+002A ASTERISK (*)
                        // followed by a U+002F SOLIDUS (/), or up to an EOF code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Comment;
                        offset = source.indexOf('*/', offset + 2);
                        offset = offset === -1 ? source.length : offset + 2;
                    } else {
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
                    break;
    
                // U+003A COLON (:)
                case 0x003A:
                    // Return a <colon-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Colon;
                    offset++;
                    break;
    
                // U+003B SEMICOLON (;)
                case 0x003B:
                    // Return a <semicolon-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Semicolon;
                    offset++;
                    break;
    
                // U+003C LESS-THAN SIGN (<)
                case 0x003C:
                    // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), ...
                    if (getCharCode(offset + 1) === 0x0021 &&
                        getCharCode(offset + 2) === 0x002D &&
                        getCharCode(offset + 3) === 0x002D) {
                        // ... consume them and return a <CDO-token>.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.CDO;
                        offset = offset + 4;
                    } else {
                        // Otherwise, return a <delim-token> with its value set to the current input code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
    
                    break;
    
                // U+0040 COMMERCIAL AT (@)
                case 0x0040:
                    // If the next 3 input code points would start an identifier, ...
                    if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isIdentifierStart)(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
                        // ... consume a name, create an <at-keyword-token> with its value set to the returned value, and return it.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword;
                        offset = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.consumeName)(source, offset + 1);
                    } else {
                        // Otherwise, return a <delim-token> with its value set to the current input code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
    
                    break;
    
                // U+005B LEFT SQUARE BRACKET ([)
                case 0x005B:
                    // Return a <[-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.LeftSquareBracket;
                    offset++;
                    break;
    
                // U+005C REVERSE SOLIDUS (\)
                case 0x005C:
                    // If the input stream starts with a valid escape, ...
                    if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isValidEscape)(code, getCharCode(offset + 1))) {
                        // ... reconsume the current input code point, consume an ident-like token, and return it.
                        consumeIdentLikeToken();
                    } else {
                        // Otherwise, this is a parse error. Return a <delim-token> with its value set to the current input code point.
                        type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                        offset++;
                    }
                    break;
    
                // U+005D RIGHT SQUARE BRACKET (])
                case 0x005D:
                    // Return a <]-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.RightSquareBracket;
                    offset++;
                    break;
    
                // U+007B LEFT CURLY BRACKET ({)
                case 0x007B:
                    // Return a <{-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.LeftCurlyBracket;
                    offset++;
                    break;
    
                // U+007D RIGHT CURLY BRACKET (})
                case 0x007D:
                    // Return a <}-token>.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.RightCurlyBracket;
                    offset++;
                    break;
    
                // digit
                case _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.DigitCategory:
                    // Reconsume the current input code point, consume a numeric token, and return it.
                    consumeNumericToken();
                    break;
    
                // name-start code point
                case _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.NameStartCategory:
                    // Reconsume the current input code point, consume an ident-like token, and return it.
                    consumeIdentLikeToken();
                    break;
    
                    // EOF
                    // case EofCategory:
                    // Return an <EOF-token>.
                    // break;
    
                // anything else
                default:
                    // Return a <delim-token> with its value set to the current input code point.
                    type = _types_js__WEBPACK_IMPORTED_MODULE_0__.Delim;
                    offset++;
            }
    
            // put token to stream
            onToken(type, start, start = offset);
        }
    }
    
    
    
    
    
    
    
    
    
    
    /***/ }),
    /* 32 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "EOF": () => (/* binding */ EOF),
    /* harmony export */   "Ident": () => (/* binding */ Ident),
    /* harmony export */   "Function": () => (/* binding */ Function),
    /* harmony export */   "AtKeyword": () => (/* binding */ AtKeyword),
    /* harmony export */   "Hash": () => (/* binding */ Hash),
    /* harmony export */   "String": () => (/* binding */ String),
    /* harmony export */   "BadString": () => (/* binding */ BadString),
    /* harmony export */   "Url": () => (/* binding */ Url),
    /* harmony export */   "BadUrl": () => (/* binding */ BadUrl),
    /* harmony export */   "Delim": () => (/* binding */ Delim),
    /* harmony export */   "Number": () => (/* binding */ Number),
    /* harmony export */   "Percentage": () => (/* binding */ Percentage),
    /* harmony export */   "Dimension": () => (/* binding */ Dimension),
    /* harmony export */   "WhiteSpace": () => (/* binding */ WhiteSpace),
    /* harmony export */   "CDO": () => (/* binding */ CDO),
    /* harmony export */   "CDC": () => (/* binding */ CDC),
    /* harmony export */   "Colon": () => (/* binding */ Colon),
    /* harmony export */   "Semicolon": () => (/* binding */ Semicolon),
    /* harmony export */   "Comma": () => (/* binding */ Comma),
    /* harmony export */   "LeftSquareBracket": () => (/* binding */ LeftSquareBracket),
    /* harmony export */   "RightSquareBracket": () => (/* binding */ RightSquareBracket),
    /* harmony export */   "LeftParenthesis": () => (/* binding */ LeftParenthesis),
    /* harmony export */   "RightParenthesis": () => (/* binding */ RightParenthesis),
    /* harmony export */   "LeftCurlyBracket": () => (/* binding */ LeftCurlyBracket),
    /* harmony export */   "RightCurlyBracket": () => (/* binding */ RightCurlyBracket),
    /* harmony export */   "Comment": () => (/* binding */ Comment)
    /* harmony export */ });
    // CSS Syntax Module Level 3
    // https://www.w3.org/TR/css-syntax-3/
    const EOF = 0;                 // <EOF-token>
    const Ident = 1;               // <ident-token>
    const Function = 2;            // <function-token>
    const AtKeyword = 3;           // <at-keyword-token>
    const Hash = 4;                // <hash-token>
    const String = 5;              // <string-token>
    const BadString = 6;           // <bad-string-token>
    const Url = 7;                 // <url-token>
    const BadUrl = 8;              // <bad-url-token>
    const Delim = 9;               // <delim-token>
    const Number = 10;             // <number-token>
    const Percentage = 11;         // <percentage-token>
    const Dimension = 12;          // <dimension-token>
    const WhiteSpace = 13;         // <whitespace-token>
    const CDO = 14;                // <CDO-token>
    const CDC = 15;                // <CDC-token>
    const Colon = 16;              // <colon-token>     :
    const Semicolon = 17;          // <semicolon-token> ;
    const Comma = 18;              // <comma-token>     ,
    const LeftSquareBracket = 19;  // <[-token>
    const RightSquareBracket = 20; // <]-token>
    const LeftParenthesis = 21;    // <(-token>
    const RightParenthesis = 22;   // <)-token>
    const LeftCurlyBracket = 23;   // <{-token>
    const RightCurlyBracket = 24;  // <}-token>
    const Comment = 25;
    
    
    /***/ }),
    /* 33 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "isDigit": () => (/* binding */ isDigit),
    /* harmony export */   "isHexDigit": () => (/* binding */ isHexDigit),
    /* harmony export */   "isUppercaseLetter": () => (/* binding */ isUppercaseLetter),
    /* harmony export */   "isLowercaseLetter": () => (/* binding */ isLowercaseLetter),
    /* harmony export */   "isLetter": () => (/* binding */ isLetter),
    /* harmony export */   "isNonAscii": () => (/* binding */ isNonAscii),
    /* harmony export */   "isNameStart": () => (/* binding */ isNameStart),
    /* harmony export */   "isName": () => (/* binding */ isName),
    /* harmony export */   "isNonPrintable": () => (/* binding */ isNonPrintable),
    /* harmony export */   "isNewline": () => (/* binding */ isNewline),
    /* harmony export */   "isWhiteSpace": () => (/* binding */ isWhiteSpace),
    /* harmony export */   "isValidEscape": () => (/* binding */ isValidEscape),
    /* harmony export */   "isIdentifierStart": () => (/* binding */ isIdentifierStart),
    /* harmony export */   "isNumberStart": () => (/* binding */ isNumberStart),
    /* harmony export */   "isBOM": () => (/* binding */ isBOM),
    /* harmony export */   "EofCategory": () => (/* binding */ EofCategory),
    /* harmony export */   "WhiteSpaceCategory": () => (/* binding */ WhiteSpaceCategory),
    /* harmony export */   "DigitCategory": () => (/* binding */ DigitCategory),
    /* harmony export */   "NameStartCategory": () => (/* binding */ NameStartCategory),
    /* harmony export */   "NonPrintableCategory": () => (/* binding */ NonPrintableCategory),
    /* harmony export */   "charCodeCategory": () => (/* binding */ charCodeCategory)
    /* harmony export */ });
    const EOF = 0;
    
    // https://drafts.csswg.org/css-syntax-3/
    // Â§ 4.2. Definitions
    
    // digit
    // A code point between U+0030 DIGIT ZERO (0) and U+0039 DIGIT NINE (9).
    function isDigit(code) {
        return code >= 0x0030 && code <= 0x0039;
    }
    
    // hex digit
    // A digit, or a code point between U+0041 LATIN CAPITAL LETTER A (A) and U+0046 LATIN CAPITAL LETTER F (F),
    // or a code point between U+0061 LATIN SMALL LETTER A (a) and U+0066 LATIN SMALL LETTER F (f).
    function isHexDigit(code) {
        return (
            isDigit(code) || // 0 .. 9
            (code >= 0x0041 && code <= 0x0046) || // A .. F
            (code >= 0x0061 && code <= 0x0066)    // a .. f
        );
    }
    
    // uppercase letter
    // A code point between U+0041 LATIN CAPITAL LETTER A (A) and U+005A LATIN CAPITAL LETTER Z (Z).
    function isUppercaseLetter(code) {
        return code >= 0x0041 && code <= 0x005A;
    }
    
    // lowercase letter
    // A code point between U+0061 LATIN SMALL LETTER A (a) and U+007A LATIN SMALL LETTER Z (z).
    function isLowercaseLetter(code) {
        return code >= 0x0061 && code <= 0x007A;
    }
    
    // letter
    // An uppercase letter or a lowercase letter.
    function isLetter(code) {
        return isUppercaseLetter(code) || isLowercaseLetter(code);
    }
    
    // non-ASCII code point
    // A code point with a value equal to or greater than U+0080 <control>.
    function isNonAscii(code) {
        return code >= 0x0080;
    }
    
    // name-start code point
    // A letter, a non-ASCII code point, or U+005F LOW LINE (_).
    function isNameStart(code) {
        return isLetter(code) || isNonAscii(code) || code === 0x005F;
    }
    
    // name code point
    // A name-start code point, a digit, or U+002D HYPHEN-MINUS (-).
    function isName(code) {
        return isNameStart(code) || isDigit(code) || code === 0x002D;
    }
    
    // non-printable code point
    // A code point between U+0000 NULL and U+0008 BACKSPACE, or U+000B LINE TABULATION,
    // or a code point between U+000E SHIFT OUT and U+001F INFORMATION SEPARATOR ONE, or U+007F DELETE.
    function isNonPrintable(code) {
        return (
            (code >= 0x0000 && code <= 0x0008) ||
            (code === 0x000B) ||
            (code >= 0x000E && code <= 0x001F) ||
            (code === 0x007F)
        );
    }
    
    // newline
    // U+000A LINE FEED. Note that U+000D CARRIAGE RETURN and U+000C FORM FEED are not included in this definition,
    // as they are converted to U+000A LINE FEED during preprocessing.
    // TODO: we doesn't do a preprocessing, so check a code point for U+000D CARRIAGE RETURN and U+000C FORM FEED
    function isNewline(code) {
        return code === 0x000A || code === 0x000D || code === 0x000C;
    }
    
    // whitespace
    // A newline, U+0009 CHARACTER TABULATION, or U+0020 SPACE.
    function isWhiteSpace(code) {
        return isNewline(code) || code === 0x0020 || code === 0x0009;
    }
    
    // Â§ 4.3.8. Check if two code points are a valid escape
    function isValidEscape(first, second) {
        // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
        if (first !== 0x005C) {
            return false;
        }
    
        // Otherwise, if the second code point is a newline or EOF, return false.
        if (isNewline(second) || second === EOF) {
            return false;
        }
    
        // Otherwise, return true.
        return true;
    }
    
    // Â§ 4.3.9. Check if three code points would start an identifier
    function isIdentifierStart(first, second, third) {
        // Look at the first code point:
    
        // U+002D HYPHEN-MINUS
        if (first === 0x002D) {
            // If the second code point is a name-start code point or a U+002D HYPHEN-MINUS,
            // or the second and third code points are a valid escape, return true. Otherwise, return false.
            return (
                isNameStart(second) ||
                second === 0x002D ||
                isValidEscape(second, third)
            );
        }
    
        // name-start code point
        if (isNameStart(first)) {
            // Return true.
            return true;
        }
    
        // U+005C REVERSE SOLIDUS (\)
        if (first === 0x005C) {
            // If the first and second code points are a valid escape, return true. Otherwise, return false.
            return isValidEscape(first, second);
        }
    
        // anything else
        // Return false.
        return false;
    }
    
    // Â§ 4.3.10. Check if three code points would start a number
    function isNumberStart(first, second, third) {
        // Look at the first code point:
    
        // U+002B PLUS SIGN (+)
        // U+002D HYPHEN-MINUS (-)
        if (first === 0x002B || first === 0x002D) {
            // If the second code point is a digit, return true.
            if (isDigit(second)) {
                return 2;
            }
    
            // Otherwise, if the second code point is a U+002E FULL STOP (.)
            // and the third code point is a digit, return true.
            // Otherwise, return false.
            return second === 0x002E && isDigit(third) ? 3 : 0;
        }
    
        // U+002E FULL STOP (.)
        if (first === 0x002E) {
            // If the second code point is a digit, return true. Otherwise, return false.
            return isDigit(second) ? 2 : 0;
        }
    
        // digit
        if (isDigit(first)) {
            // Return true.
            return 1;
        }
    
        // anything else
        // Return false.
        return 0;
    }
    
    //
    // Misc
    //
    
    // detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)
    function isBOM(code) {
        // UTF-16BE
        if (code === 0xFEFF) {
            return 1;
        }
    
        // UTF-16LE
        if (code === 0xFFFE) {
            return 1;
        }
    
        return 0;
    }
    
    // Fast code category
    // Only ASCII code points has a special meaning, that's why we define a maps for 0..127 codes only
    const CATEGORY = new Array(0x80);
    const EofCategory = 0x80;
    const WhiteSpaceCategory = 0x82;
    const DigitCategory = 0x83;
    const NameStartCategory = 0x84;
    const NonPrintableCategory = 0x85;
    
    for (let i = 0; i < CATEGORY.length; i++) {
        CATEGORY[i] =
            isWhiteSpace(i) && WhiteSpaceCategory ||
            isDigit(i) && DigitCategory ||
            isNameStart(i) && NameStartCategory ||
            isNonPrintable(i) && NonPrintableCategory ||
            i || EofCategory;
    }
    
    function charCodeCategory(code) {
        return code < 0x80 ? CATEGORY[code] : NameStartCategory;
    }
    
    
    /***/ }),
    /* 34 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "getNewlineLength": () => (/* binding */ getNewlineLength),
    /* harmony export */   "cmpChar": () => (/* binding */ cmpChar),
    /* harmony export */   "cmpStr": () => (/* binding */ cmpStr),
    /* harmony export */   "findWhiteSpaceStart": () => (/* binding */ findWhiteSpaceStart),
    /* harmony export */   "findWhiteSpaceEnd": () => (/* binding */ findWhiteSpaceEnd),
    /* harmony export */   "findDecimalNumberEnd": () => (/* binding */ findDecimalNumberEnd),
    /* harmony export */   "consumeEscaped": () => (/* binding */ consumeEscaped),
    /* harmony export */   "consumeName": () => (/* binding */ consumeName),
    /* harmony export */   "consumeNumber": () => (/* binding */ consumeNumber),
    /* harmony export */   "consumeBadUrlRemnants": () => (/* binding */ consumeBadUrlRemnants),
    /* harmony export */   "decodeEscaped": () => (/* binding */ decodeEscaped)
    /* harmony export */ });
    /* harmony import */ var _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);
    
    
    function getCharCode(source, offset) {
        return offset < source.length ? source.charCodeAt(offset) : 0;
    }
    
    function getNewlineLength(source, offset, code) {
        if (code === 13 /* \r */ && getCharCode(source, offset + 1) === 10 /* \n */) {
            return 2;
        }
    
        return 1;
    }
    
    function cmpChar(testStr, offset, referenceCode) {
        let code = testStr.charCodeAt(offset);
    
        // code.toLowerCase() for A..Z
        if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isUppercaseLetter)(code)) {
            code = code | 32;
        }
    
        return code === referenceCode;
    }
    
    function cmpStr(testStr, start, end, referenceStr) {
        if (end - start !== referenceStr.length) {
            return false;
        }
    
        if (start < 0 || end > testStr.length) {
            return false;
        }
    
        for (let i = start; i < end; i++) {
            const referenceCode = referenceStr.charCodeAt(i - start);
            let testCode = testStr.charCodeAt(i);
    
            // testCode.toLowerCase() for A..Z
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isUppercaseLetter)(testCode)) {
                testCode = testCode | 32;
            }
    
            if (testCode !== referenceCode) {
                return false;
            }
        }
    
        return true;
    }
    
    function findWhiteSpaceStart(source, offset) {
        for (; offset >= 0; offset--) {
            if (!(0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isWhiteSpace)(source.charCodeAt(offset))) {
                break;
            }
        }
    
        return offset + 1;
    }
    
    function findWhiteSpaceEnd(source, offset) {
        for (; offset < source.length; offset++) {
            if (!(0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isWhiteSpace)(source.charCodeAt(offset))) {
                break;
            }
        }
    
        return offset;
    }
    
    function findDecimalNumberEnd(source, offset) {
        for (; offset < source.length; offset++) {
            if (!(0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isDigit)(source.charCodeAt(offset))) {
                break;
            }
        }
    
        return offset;
    }
    
    // Â§ 4.3.7. Consume an escaped code point
    function consumeEscaped(source, offset) {
        // It assumes that the U+005C REVERSE SOLIDUS (\) has already been consumed and
        // that the next input code point has already been verified to be part of a valid escape.
        offset += 2;
    
        // hex digit
        if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isHexDigit)(getCharCode(source, offset - 1))) {
            // Consume as many hex digits as possible, but no more than 5.
            // Note that this means 1-6 hex digits have been consumed in total.
            for (const maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
                if (!(0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isHexDigit)(getCharCode(source, offset))) {
                    break;
                }
            }
    
            // If the next input code point is whitespace, consume it as well.
            const code = getCharCode(source, offset);
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isWhiteSpace)(code)) {
                offset += getNewlineLength(source, offset, code);
            }
        }
    
        return offset;
    }
    
    // Â§4.3.11. Consume a name
    // Note: This algorithm does not do the verification of the first few code points that are necessary
    // to ensure the returned code points would constitute an <ident-token>. If that is the intended use,
    // ensure that the stream starts with an identifier before calling this algorithm.
    function consumeName(source, offset) {
        // Let result initially be an empty string.
        // Repeatedly consume the next input code point from the stream:
        for (; offset < source.length; offset++) {
            const code = source.charCodeAt(offset);
    
            // name code point
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isName)(code)) {
                // Append the code point to result.
                continue;
            }
    
            // the stream starts with a valid escape
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isValidEscape)(code, getCharCode(source, offset + 1))) {
                // Consume an escaped code point. Append the returned code point to result.
                offset = consumeEscaped(source, offset) - 1;
                continue;
            }
    
            // anything else
            // Reconsume the current input code point. Return result.
            break;
        }
    
        return offset;
    }
    
    // Â§4.3.12. Consume a number
    function consumeNumber(source, offset) {
        let code = source.charCodeAt(offset);
    
        // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
        // consume it and append it to repr.
        if (code === 0x002B || code === 0x002D) {
            code = source.charCodeAt(offset += 1);
        }
    
        // 3. While the next input code point is a digit, consume it and append it to repr.
        if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isDigit)(code)) {
            offset = findDecimalNumberEnd(source, offset + 1);
            code = source.charCodeAt(offset);
        }
    
        // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
        if (code === 0x002E && (0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isDigit)(source.charCodeAt(offset + 1))) {
            // 4.1 Consume them.
            // 4.2 Append them to repr.
            offset += 2;
    
            // 4.3 Set type to "number".
            // TODO
    
            // 4.4 While the next input code point is a digit, consume it and append it to repr.
    
            offset = findDecimalNumberEnd(source, offset);
        }
    
        // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
        // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
        if (cmpChar(source, offset, 101 /* e */)) {
            let sign = 0;
            code = source.charCodeAt(offset + 1);
    
            // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...
            if (code === 0x002D || code === 0x002B) {
                sign = 1;
                code = source.charCodeAt(offset + 2);
            }
    
            // ... followed by a digit
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isDigit)(code)) {
                // 5.1 Consume them.
                // 5.2 Append them to repr.
    
                // 5.3 Set type to "number".
                // TODO
    
                // 5.4 While the next input code point is a digit, consume it and append it to repr.
                offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
            }
        }
    
        return offset;
    }
    
    // Â§ 4.3.14. Consume the remnants of a bad url
    // ... its sole use is to consume enough of the input stream to reach a recovery point
    // where normal tokenizing can resume.
    function consumeBadUrlRemnants(source, offset) {
        // Repeatedly consume the next input code point from the stream:
        for (; offset < source.length; offset++) {
            const code = source.charCodeAt(offset);
    
            // U+0029 RIGHT PARENTHESIS ())
            // EOF
            if (code === 0x0029) {
                // Return.
                offset++;
                break;
            }
    
            if ((0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isValidEscape)(code, getCharCode(source, offset + 1))) {
                // Consume an escaped code point.
                // Note: This allows an escaped right parenthesis ("\)") to be encountered
                // without ending the <bad-url-token>. This is otherwise identical to
                // the "anything else" clause.
                offset = consumeEscaped(source, offset);
            }
        }
    
        return offset;
    }
    
    // Â§ 4.3.7. Consume an escaped code point
    // Note: This algorithm assumes that escaped is valid without leading U+005C REVERSE SOLIDUS (\)
    function decodeEscaped(escaped) {
        // Single char escaped that's not a hex digit
        if (escaped.length === 1 && !(0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_0__.isHexDigit)(escaped.charCodeAt(0))) {
            return escaped[0];
        }
    
        // Interpret the hex digits as a hexadecimal number.
        let code = parseInt(escaped, 16);
    
        if (
            (code === 0) ||                       // If this number is zero,
            (code >= 0xD800 && code <= 0xDFFF) || // or is for a surrogate,
            (code > 0x10FFFF)                     // or is greater than the maximum allowed code point
        ) {
            // ... return U+FFFD REPLACEMENT CHARACTER
            code = 0xFFFD;
        }
    
        // Otherwise, return the code point with that value.
        return String.fromCodePoint(code);
    }
    
    
    /***/ }),
    /* 35 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([
        'EOF-token',
        'ident-token',
        'function-token',
        'at-keyword-token',
        'hash-token',
        'string-token',
        'bad-string-token',
        'url-token',
        'bad-url-token',
        'delim-token',
        'number-token',
        'percentage-token',
        'dimension-token',
        'whitespace-token',
        'CDO-token',
        'CDC-token',
        'colon-token',
        'semicolon-token',
        'comma-token',
        '[-token',
        ']-token',
        '(-token',
        ')-token',
        '{-token',
        '}-token'
    ]);
    
    
    /***/ }),
    /* 36 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "OffsetToLocation": () => (/* binding */ OffsetToLocation)
    /* harmony export */ });
    /* harmony import */ var _adopt_buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);
    /* harmony import */ var _char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(33);
    
    
    
    const N = 10;
    const F = 12;
    const R = 13;
    
    function computeLinesAndColumns(host) {
        const source = host.source;
        const sourceLength = source.length;
        const startOffset = source.length > 0 ? (0,_char_code_definitions_js__WEBPACK_IMPORTED_MODULE_1__.isBOM)(source.charCodeAt(0)) : 0;
        const lines = (0,_adopt_buffer_js__WEBPACK_IMPORTED_MODULE_0__.adoptBuffer)(host.lines, sourceLength);
        const columns = (0,_adopt_buffer_js__WEBPACK_IMPORTED_MODULE_0__.adoptBuffer)(host.columns, sourceLength);
        let line = host.startLine;
        let column = host.startColumn;
    
        for (let i = startOffset; i < sourceLength; i++) {
            const code = source.charCodeAt(i);
    
            lines[i] = line;
            columns[i] = column++;
    
            if (code === N || code === R || code === F) {
                if (code === R && i + 1 < sourceLength && source.charCodeAt(i + 1) === N) {
                    i++;
                    lines[i] = line;
                    columns[i] = column;
                }
    
                line++;
                column = 1;
            }
        }
    
        lines[sourceLength] = line;
        columns[sourceLength] = column;
    
        host.lines = lines;
        host.columns = columns;
        host.computed = true;
    }
    
    class OffsetToLocation {
        constructor() {
            this.lines = null;
            this.columns = null;
            this.computed = false;
        }
        setSource(source, startOffset = 0, startLine = 1, startColumn = 1) {
            this.source = source;
            this.startOffset = startOffset;
            this.startLine = startLine;
            this.startColumn = startColumn;
            this.computed = false;
        }
        getLocation(offset, filename) {
            if (!this.computed) {
                computeLinesAndColumns(this);
            }
    
            return {
                source: filename,
                offset: this.startOffset + offset,
                line: this.lines[offset],
                column: this.columns[offset]
            };
        }
        getLocationRange(start, end, filename) {
            if (!this.computed) {
                computeLinesAndColumns(this);
            }
    
            return {
                source: filename,
                start: {
                    offset: this.startOffset + start,
                    line: this.lines[start],
                    column: this.columns[start]
                },
                end: {
                    offset: this.startOffset + end,
                    line: this.lines[end],
                    column: this.columns[end]
                }
            };
        }
    };
    
    
    /***/ }),
    /* 37 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "adoptBuffer": () => (/* binding */ adoptBuffer)
    /* harmony export */ });
    const MIN_SIZE = 16 * 1024;
    
    function adoptBuffer(buffer = null, size) {
        if (buffer === null || buffer.length < size) {
            return new Uint32Array(Math.max(size + 1024, MIN_SIZE));
        }
    
        return buffer;
    };
    
    
    /***/ }),
    /* 38 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "TokenStream": () => (/* binding */ TokenStream)
    /* harmony export */ });
    /* harmony import */ var _adopt_buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(37);
    /* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34);
    /* harmony import */ var _names_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35);
    /* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32);
    
    
    
    
    
    const OFFSET_MASK = 0x00FFFFFF;
    const TYPE_SHIFT = 24;
    const balancePair = new Map([
        [_types_js__WEBPACK_IMPORTED_MODULE_3__.Function, _types_js__WEBPACK_IMPORTED_MODULE_3__.RightParenthesis],
        [_types_js__WEBPACK_IMPORTED_MODULE_3__.LeftParenthesis, _types_js__WEBPACK_IMPORTED_MODULE_3__.RightParenthesis],
        [_types_js__WEBPACK_IMPORTED_MODULE_3__.LeftSquareBracket, _types_js__WEBPACK_IMPORTED_MODULE_3__.RightSquareBracket],
        [_types_js__WEBPACK_IMPORTED_MODULE_3__.LeftCurlyBracket, _types_js__WEBPACK_IMPORTED_MODULE_3__.RightCurlyBracket]
    ]);
    
    class TokenStream {
        constructor(source, tokenize) {
            this.setSource(source, tokenize);
        }
        reset() {
            this.eof = false;
            this.tokenIndex = -1;
            this.tokenType = 0;
            this.tokenStart = this.firstCharOffset;
            this.tokenEnd = this.firstCharOffset;
        }
        setSource(source = '', tokenize = () => {}) {
            source = String(source || '');
    
            const sourceLength = source.length;
            const offsetAndType = (0,_adopt_buffer_js__WEBPACK_IMPORTED_MODULE_0__.adoptBuffer)(this.offsetAndType, source.length + 1); // +1 because of eof-token
            const balance = (0,_adopt_buffer_js__WEBPACK_IMPORTED_MODULE_0__.adoptBuffer)(this.balance, source.length + 1);
            let tokenCount = 0;
            let balanceCloseType = 0;
            let balanceStart = 0;
            let firstCharOffset = -1;
    
            // capture buffers
            this.offsetAndType = null;
            this.balance = null;
    
            tokenize(source, (type, start, end) => {
                switch (type) {
                    default:
                        balance[tokenCount] = sourceLength;
                        break;
    
                    case balanceCloseType: {
                        let balancePrev = balanceStart & OFFSET_MASK;
                        balanceStart = balance[balancePrev];
                        balanceCloseType = balanceStart >> TYPE_SHIFT;
                        balance[tokenCount] = balancePrev;
                        balance[balancePrev++] = tokenCount;
                        for (; balancePrev < tokenCount; balancePrev++) {
                            if (balance[balancePrev] === sourceLength) {
                                balance[balancePrev] = tokenCount;
                            }
                        }
                        break;
                    }
    
                    case _types_js__WEBPACK_IMPORTED_MODULE_3__.LeftParenthesis:
                    case _types_js__WEBPACK_IMPORTED_MODULE_3__.Function:
                    case _types_js__WEBPACK_IMPORTED_MODULE_3__.LeftSquareBracket:
                    case _types_js__WEBPACK_IMPORTED_MODULE_3__.LeftCurlyBracket:
                        balance[tokenCount] = balanceStart;
                        balanceCloseType = balancePair.get(type);
                        balanceStart = (balanceCloseType << TYPE_SHIFT) | tokenCount;
                        break;
                }
    
                offsetAndType[tokenCount++] = (type << TYPE_SHIFT) | end;
                if (firstCharOffset === -1) {
                    firstCharOffset = start;
                }
            });
    
            // finalize buffers
            offsetAndType[tokenCount] = (_types_js__WEBPACK_IMPORTED_MODULE_3__.EOF << TYPE_SHIFT) | sourceLength; // <EOF-token>
            balance[tokenCount] = sourceLength;
            balance[sourceLength] = sourceLength; // prevents false positive balance match with any token
            while (balanceStart !== 0) {
                const balancePrev = balanceStart & OFFSET_MASK;
                balanceStart = balance[balancePrev];
                balance[balancePrev] = sourceLength;
            }
    
            this.source = source;
            this.firstCharOffset = firstCharOffset === -1 ? 0 : firstCharOffset;
            this.tokenCount = tokenCount;
            this.offsetAndType = offsetAndType;
            this.balance = balance;
    
            this.reset();
            this.next();
        }
    
        lookupType(offset) {
            offset += this.tokenIndex;
    
            if (offset < this.tokenCount) {
                return this.offsetAndType[offset] >> TYPE_SHIFT;
            }
    
            return _types_js__WEBPACK_IMPORTED_MODULE_3__.EOF;
        }
        lookupOffset(offset) {
            offset += this.tokenIndex;
    
            if (offset < this.tokenCount) {
                return this.offsetAndType[offset - 1] & OFFSET_MASK;
            }
    
            return this.source.length;
        }
        lookupValue(offset, referenceStr) {
            offset += this.tokenIndex;
    
            if (offset < this.tokenCount) {
                return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.cmpStr)(
                    this.source,
                    this.offsetAndType[offset - 1] & OFFSET_MASK,
                    this.offsetAndType[offset] & OFFSET_MASK,
                    referenceStr
                );
            }
    
            return false;
        }
        getTokenStart(tokenIndex) {
            if (tokenIndex === this.tokenIndex) {
                return this.tokenStart;
            }
    
            if (tokenIndex > 0) {
                return tokenIndex < this.tokenCount
                    ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK
                    : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
            }
    
            return this.firstCharOffset;
        }
        substrToCursor(start) {
            return this.source.substring(start, this.tokenStart);
        }
    
        isBalanceEdge(pos) {
            return this.balance[this.tokenIndex] < pos;
        }
        isDelim(code, offset) {
            if (offset) {
                return (
                    this.lookupType(offset) === _types_js__WEBPACK_IMPORTED_MODULE_3__.Delim &&
                    this.source.charCodeAt(this.lookupOffset(offset)) === code
                );
            }
    
            return (
                this.tokenType === _types_js__WEBPACK_IMPORTED_MODULE_3__.Delim &&
                this.source.charCodeAt(this.tokenStart) === code
            );
        }
    
        skip(tokenCount) {
            let next = this.tokenIndex + tokenCount;
    
            if (next < this.tokenCount) {
                this.tokenIndex = next;
                this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
                next = this.offsetAndType[next];
                this.tokenType = next >> TYPE_SHIFT;
                this.tokenEnd = next & OFFSET_MASK;
            } else {
                this.tokenIndex = this.tokenCount;
                this.next();
            }
        }
        next() {
            let next = this.tokenIndex + 1;
    
            if (next < this.tokenCount) {
                this.tokenIndex = next;
                this.tokenStart = this.tokenEnd;
                next = this.offsetAndType[next];
                this.tokenType = next >> TYPE_SHIFT;
                this.tokenEnd = next & OFFSET_MASK;
            } else {
                this.eof = true;
                this.tokenIndex = this.tokenCount;
                this.tokenType = _types_js__WEBPACK_IMPORTED_MODULE_3__.EOF;
                this.tokenStart = this.tokenEnd = this.source.length;
            }
        }
        skipSC() {
            while (this.tokenType === _types_js__WEBPACK_IMPORTED_MODULE_3__.WhiteSpace || this.tokenType === _types_js__WEBPACK_IMPORTED_MODULE_3__.Comment) {
                this.next();
            }
        }
        skipUntilBalanced(startToken, stopConsume) {
            let cursor = startToken;
            let balanceEnd;
            let offset;
    
            loop:
            for (; cursor < this.tokenCount; cursor++) {
                balanceEnd = this.balance[cursor];
    
                // stop scanning on balance edge that points to offset before start token
                if (balanceEnd < startToken) {
                    break loop;
                }
    
                offset = cursor > 0 ? this.offsetAndType[cursor - 1] & OFFSET_MASK : this.firstCharOffset;
    
                // check stop condition
                switch (stopConsume(this.source.charCodeAt(offset))) {
                    case 1: // just stop
                        break loop;
    
                    case 2: // stop & included
                        cursor++;
                        break loop;
    
                    default:
                        // fast forward to the end of balanced block
                        if (this.balance[balanceEnd] === cursor) {
                            cursor = balanceEnd;
                        }
                }
            }
    
            this.skip(cursor - this.tokenIndex);
        }
    
        forEachToken(fn) {
            for (let i = 0, offset = this.firstCharOffset; i < this.tokenCount; i++) {
                const start = offset;
                const item = this.offsetAndType[i];
                const end = item & OFFSET_MASK;
                const type = item >> TYPE_SHIFT;
    
                offset = end;
    
                fn(type, start, end, i);
            }
        }
        dump() {
            const tokens = new Array(this.tokenCount);
    
            this.forEachToken((type, start, end, index) => {
                tokens[index] = {
                    idx: index,
                    type: _names_js__WEBPACK_IMPORTED_MODULE_2__["default"][type],
                    chunk: this.source.substring(start, end),
                    balance: this.balance[index]
                };
            });
    
            return tokens;
        }
    };
    
    
    /***/ }),
    /* 39 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "createParser": () => (/* binding */ createParser)
    /* harmony export */ });
    /* harmony import */ var _utils_List_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);
    /* harmony import */ var _SyntaxError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41);
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31);
    /* harmony import */ var _sequence_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(43);
    
    
    
    
    
    const NOOP = () => {};
    const EXCLAMATIONMARK = 0x0021;  // U+0021 EXCLAMATION MARK (!)
    const NUMBERSIGN = 0x0023;       // U+0023 NUMBER SIGN (#)
    const SEMICOLON = 0x003B;        // U+003B SEMICOLON (;)
    const LEFTCURLYBRACKET = 0x007B; // U+007B LEFT CURLY BRACKET ({)
    const NULL = 0;
    
    function createParseContext(name) {
        return function() {
            return this[name]();
        };
    }
    
    function fetchParseValues(dict) {
        const result = Object.create(null);
    
        for (const name in dict) {
            const item = dict[name];
    
            if (item.parse) {
                result[name] = item.parse;
            }
        }
    
        return result;
    }
    
    function processConfig(config) {
        const parseConfig = {
            context: Object.create(null),
            scope: Object.assign(Object.create(null), config.scope),
            atrule: fetchParseValues(config.atrule),
            pseudo: fetchParseValues(config.pseudo),
            node: fetchParseValues(config.node)
        };
    
        for (const name in config.parseContext) {
            switch (typeof config.parseContext[name]) {
                case 'function':
                    parseConfig.context[name] = config.parseContext[name];
                    break;
    
                case 'string':
                    parseConfig.context[name] = createParseContext(config.parseContext[name]);
                    break;
            }
        }
    
        return {
            config: parseConfig,
            ...parseConfig,
            ...parseConfig.node
        };
    }
    
    function createParser(config) {
        let source = '';
        let filename = '<unknown>';
        let needPositions = false;
        let onParseError = NOOP;
        let onParseErrorThrow = false;
    
        const locationMap = new _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.OffsetToLocation();
        const parser = Object.assign(new _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.TokenStream(), processConfig(config || {}), {
            parseAtrulePrelude: true,
            parseRulePrelude: true,
            parseValue: true,
            parseCustomProperty: false,
    
            readSequence: _sequence_js__WEBPACK_IMPORTED_MODULE_3__.readSequence,
    
            consumeUntilBalanceEnd: () => 0,
            consumeUntilLeftCurlyBracket(code) {
                return code === LEFTCURLYBRACKET ? 1 : 0;
            },
            consumeUntilLeftCurlyBracketOrSemicolon(code) {
                return code === LEFTCURLYBRACKET || code === SEMICOLON ? 1 : 0;
            },
            consumeUntilExclamationMarkOrSemicolon(code) {
                return code === EXCLAMATIONMARK || code === SEMICOLON ? 1 : 0;
            },
            consumeUntilSemicolonIncluded(code) {
                return code === SEMICOLON ? 2 : 0;
            },
    
            createList() {
                return new _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List();
            },
            createSingleNodeList(node) {
                return new _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List().appendData(node);
            },
            getFirstListNode(list) {
                return list && list.first;
            },
            getLastListNode(list) {
                return list && list.last;
            },
    
            parseWithFallback(consumer, fallback) {
                const startToken = this.tokenIndex;
    
                try {
                    return consumer.call(this);
                } catch (e) {
                    if (onParseErrorThrow) {
                        throw e;
                    }
    
                    const fallbackNode = fallback.call(this, startToken);
    
                    onParseErrorThrow = true;
                    onParseError(e, fallbackNode);
                    onParseErrorThrow = false;
    
                    return fallbackNode;
                }
            },
    
            lookupNonWSType(offset) {
                let type;
    
                do {
                    type = this.lookupType(offset++);
                    if (type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.WhiteSpace) {
                        return type;
                    }
                } while (type !== NULL);
    
                return NULL;
            },
    
            charCodeAt(offset) {
                return offset >= 0 && offset < source.length ? source.charCodeAt(offset) : 0;
            },
            substring(offsetStart, offsetEnd) {
                return source.substring(offsetStart, offsetEnd);
            },
            substrToCursor(start) {
                return this.source.substring(start, this.tokenStart);
            },
    
            cmpChar(offset, charCode) {
                return (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.cmpChar)(source, offset, charCode);
            },
            cmpStr(offsetStart, offsetEnd, str) {
                return (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.cmpStr)(source, offsetStart, offsetEnd, str);
            },
    
            consume(tokenType) {
                const start = this.tokenStart;
    
                this.eat(tokenType);
    
                return this.substrToCursor(start);
            },
            consumeFunctionName() {
                const name = source.substring(this.tokenStart, this.tokenEnd - 1);
    
                this.eat(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function);
    
                return name;
            },
            consumeNumber(type) {
                const number = source.substring(this.tokenStart, (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.consumeNumber)(source, this.tokenStart));
    
                this.eat(type);
    
                return number;
            },
    
            eat(tokenType) {
                if (this.tokenType !== tokenType) {
                    const tokenName = _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.tokenNames[tokenType].slice(0, -6).replace(/-/g, ' ').replace(/^./, m => m.toUpperCase());
                    let message = `${/[[\](){}]/.test(tokenName) ? `"${tokenName}"` : tokenName} is expected`;
                    let offset = this.tokenStart;
    
                    // tweak message and offset
                    switch (tokenType) {
                        case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Ident:
                            // when identifier is expected but there is a function or url
                            if (this.tokenType === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function || this.tokenType === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Url) {
                                offset = this.tokenEnd - 1;
                                message = 'Identifier is expected but function found';
                            } else {
                                message = 'Identifier is expected';
                            }
                            break;
    
                        case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Hash:
                            if (this.isDelim(NUMBERSIGN)) {
                                this.next();
                                offset++;
                                message = 'Name is expected';
                            }
                            break;
    
                        case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Percentage:
                            if (this.tokenType === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Number) {
                                offset = this.tokenEnd;
                                message = 'Percent sign is expected';
                            }
                            break;
                    }
    
                    this.error(message, offset);
                }
    
                this.next();
            },
            eatIdent(name) {
                if (this.tokenType !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Ident || this.lookupValue(0, name) === false) {
                    this.error(`Identifier "${name}" is expected`);
                }
    
                this.next();
            },
            eatDelim(code) {
                if (!this.isDelim(code)) {
                    this.error(`Delim "${String.fromCharCode(code)}" is expected`);
                }
    
                this.next();
            },
    
            getLocation(start, end) {
                if (needPositions) {
                    return locationMap.getLocationRange(
                        start,
                        end,
                        filename
                    );
                }
    
                return null;
            },
            getLocationFromList(list) {
                if (needPositions) {
                    const head = this.getFirstListNode(list);
                    const tail = this.getLastListNode(list);
                    return locationMap.getLocationRange(
                        head !== null ? head.loc.start.offset - locationMap.startOffset : this.tokenStart,
                        tail !== null ? tail.loc.end.offset - locationMap.startOffset : this.tokenStart,
                        filename
                    );
                }
    
                return null;
            },
    
            error(message, offset) {
                const location = typeof offset !== 'undefined' && offset < source.length
                    ? locationMap.getLocation(offset)
                    : this.eof
                        ? locationMap.getLocation((0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.findWhiteSpaceStart)(source, source.length - 1))
                        : locationMap.getLocation(this.tokenStart);
    
                throw new _SyntaxError_js__WEBPACK_IMPORTED_MODULE_1__.SyntaxError(
                    message || 'Unexpected input',
                    source,
                    location.offset,
                    location.line,
                    location.column
                );
            }
        });
    
        const parse = function(source_, options) {
            source = source_;
            options = options || {};
    
            parser.setSource(source, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.tokenize);
            locationMap.setSource(
                source,
                options.offset,
                options.line,
                options.column
            );
    
            filename = options.filename || '<unknown>';
            needPositions = Boolean(options.positions);
            onParseError = typeof options.onParseError === 'function' ? options.onParseError : NOOP;
            onParseErrorThrow = false;
    
            parser.parseAtrulePrelude = 'parseAtrulePrelude' in options ? Boolean(options.parseAtrulePrelude) : true;
            parser.parseRulePrelude = 'parseRulePrelude' in options ? Boolean(options.parseRulePrelude) : true;
            parser.parseValue = 'parseValue' in options ? Boolean(options.parseValue) : true;
            parser.parseCustomProperty = 'parseCustomProperty' in options ? Boolean(options.parseCustomProperty) : false;
    
            const { context = 'default', onComment } = options;
    
            if (context in parser.context === false) {
                throw new Error('Unknown context `' + context + '`');
            }
    
            if (typeof onComment === 'function') {
                parser.forEachToken((type, start, end) => {
                    if (type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Comment) {
                        const loc = parser.getLocation(start, end);
                        const value = (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.cmpStr)(source, end - 2, end, '*/')
                            ? source.slice(start + 2, end - 2)
                            : source.slice(start + 2, end);
    
                        onComment(value, loc);
                    }
                });
            }
    
            const ast = parser.context[context].call(parser, options);
    
            if (!parser.eof) {
                parser.error();
            }
    
            return ast;
        };
    
        return Object.assign(parse, {
            SyntaxError: _SyntaxError_js__WEBPACK_IMPORTED_MODULE_1__.SyntaxError,
            config: parser.config
        });
    };
    
    
    /***/ }),
    /* 40 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "List": () => (/* binding */ List)
    /* harmony export */ });
    //
    //                              list
    //                            â”Œâ”€â”€â”€â”€â”€â”€â”
    //             â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€head â”‚
    //             â”‚              â”‚ tailâ”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
    //             â”‚              â””â”€â”€â”€â”€â”€â”€â”˜              â”‚
    //             â–¼                                    â–¼
    //            item        item        item        item
    //          â”Œâ”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”    â”Œâ”€â”€â”€â”€â”€â”€â”
    //  null â—€â”€â”€â”¼â”€prev â”‚â—€â”€â”€â”€â”¼â”€prev â”‚â—€â”€â”€â”€â”¼â”€prev â”‚â—€â”€â”€â”€â”¼â”€prev â”‚
    //          â”‚ nextâ”€â”¼â”€â”€â”€â–¶â”‚ nextâ”€â”¼â”€â”€â”€â–¶â”‚ nextâ”€â”¼â”€â”€â”€â–¶â”‚ nextâ”€â”¼â”€â”€â–¶ null
    //          â”œâ”€â”€â”€â”€â”€â”€â”¤    â”œâ”€â”€â”€â”€â”€â”€â”¤    â”œâ”€â”€â”€â”€â”€â”€â”¤    â”œâ”€â”€â”€â”€â”€â”€â”¤
    //          â”‚ data â”‚    â”‚ data â”‚    â”‚ data â”‚    â”‚ data â”‚
    //          â””â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”˜    â””â”€â”€â”€â”€â”€â”€â”˜
    //
    
    let releasedCursors = null;
    
    class List {
        static createItem(data) {
            return {
                prev: null,
                next: null,
                data
            };
        }
    
        constructor() {
            this.head = null;
            this.tail = null;
            this.cursor = null;
        }
        createItem(data) {
            return List.createItem(data);
        }
    
        // cursor helpers
        allocateCursor(prev, next) {
            let cursor;
    
            if (releasedCursors !== null) {
                cursor = releasedCursors;
                releasedCursors = releasedCursors.cursor;
                cursor.prev = prev;
                cursor.next = next;
                cursor.cursor = this.cursor;
            } else {
                cursor = {
                    prev,
                    next,
                    cursor: this.cursor
                };
            }
    
            this.cursor = cursor;
    
            return cursor;
        }
        releaseCursor() {
            const { cursor } = this;
    
            this.cursor = cursor.cursor;
            cursor.prev = null;
            cursor.next = null;
            cursor.cursor = releasedCursors;
            releasedCursors = cursor;
        }
        updateCursors(prevOld, prevNew, nextOld, nextNew) {
            let { cursor } = this;
    
            while (cursor !== null) {
                if (cursor.prev === prevOld) {
                    cursor.prev = prevNew;
                }
    
                if (cursor.next === nextOld) {
                    cursor.next = nextNew;
                }
    
                cursor = cursor.cursor;
            }
        }
        *[Symbol.iterator]() {
            for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
                yield cursor.data;
            }
        }
    
        // getters
        get size() {
            let size = 0;
    
            for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
                size++;
            }
    
            return size;
        }
        get isEmpty() {
            return this.head === null;
        }
        get first() {
            return this.head && this.head.data;
        }
        get last() {
            return this.tail && this.tail.data;
        }
    
        // convertors
        fromArray(array) {
            let cursor = null;
            this.head = null;
    
            for (let data of array) {
                const item = List.createItem(data);
    
                if (cursor !== null) {
                    cursor.next = item;
                } else {
                    this.head = item;
                }
    
                item.prev = cursor;
                cursor = item;
            }
    
            this.tail = cursor;
            return this;
        }
        toArray() {
            return [...this];
        }
        toJSON() {
            return [...this];
        }
    
        // array-like methods
        forEach(fn, thisArg = this) {
            // push cursor
            const cursor = this.allocateCursor(null, this.head);
    
            while (cursor.next !== null) {
                const item = cursor.next;
                cursor.next = item.next;
                fn.call(thisArg, item.data, item, this);
            }
    
            // pop cursor
            this.releaseCursor();
        }
        forEachRight(fn, thisArg = this) {
            // push cursor
            const cursor = this.allocateCursor(this.tail, null);
    
            while (cursor.prev !== null) {
                const item = cursor.prev;
                cursor.prev = item.prev;
                fn.call(thisArg, item.data, item, this);
            }
    
            // pop cursor
            this.releaseCursor();
        }
        reduce(fn, initialValue, thisArg = this) {
            // push cursor
            let cursor = this.allocateCursor(null, this.head);
            let acc = initialValue;
            let item;
    
            while (cursor.next !== null) {
                item = cursor.next;
                cursor.next = item.next;
    
                acc = fn.call(thisArg, acc, item.data, item, this);
            }
    
            // pop cursor
            this.releaseCursor();
    
            return acc;
        }
        reduceRight(fn, initialValue, thisArg = this) {
            // push cursor
            let cursor = this.allocateCursor(this.tail, null);
            let acc = initialValue;
            let item;
    
            while (cursor.prev !== null) {
                item = cursor.prev;
                cursor.prev = item.prev;
    
                acc = fn.call(thisArg, acc, item.data, item, this);
            }
    
            // pop cursor
            this.releaseCursor();
    
            return acc;
        }
        some(fn, thisArg = this) {
            for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
                if (fn.call(thisArg, cursor.data, cursor, this)) {
                    return true;
                }
            }
    
            return false;
        }
        map(fn, thisArg = this) {
            const result = new List();
    
            for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
                result.appendData(fn.call(thisArg, cursor.data, cursor, this));
            }
    
            return result;
        }
        filter(fn, thisArg = this) {
            const result = new List();
    
            for (let cursor = this.head; cursor !== null; cursor = cursor.next) {
                if (fn.call(thisArg, cursor.data, cursor, this)) {
                    result.appendData(cursor.data);
                }
            }
    
            return result;
        }
    
        nextUntil(start, fn, thisArg = this) {
            if (start === null) {
                return;
            }
    
            // push cursor
            const cursor = this.allocateCursor(null, start);
    
            while (cursor.next !== null) {
                const item = cursor.next;
                cursor.next = item.next;
                if (fn.call(thisArg, item.data, item, this)) {
                    break;
                }
            }
    
            // pop cursor
            this.releaseCursor();
        }
        prevUntil(start, fn, thisArg = this) {
            if (start === null) {
                return;
            }
    
            // push cursor
            const cursor = this.allocateCursor(start, null);
    
            while (cursor.prev !== null) {
                const item = cursor.prev;
                cursor.prev = item.prev;
                if (fn.call(thisArg, item.data, item, this)) {
                    break;
                }
            }
    
            // pop cursor
            this.releaseCursor();
        }
    
        // mutation
        clear() {
            this.head = null;
            this.tail = null;
        }
        copy() {
            const result = new List();
    
            for (let data of this) {
                result.appendData(data);
            }
    
            return result;
        }
        prepend(item) {
            //      head
            //    ^
            // item
            this.updateCursors(null, item, this.head, item);
    
            // insert to the beginning of the list
            if (this.head !== null) {
                // new item <- first item
                this.head.prev = item;
                // new item -> first item
                item.next = this.head;
            } else {
                // if list has no head, then it also has no tail
                // in this case tail points to the new item
                this.tail = item;
            }
    
            // head always points to new item
            this.head = item;
            return this;
        }
        prependData(data) {
            return this.prepend(List.createItem(data));
        }
        append(item) {
            return this.insert(item);
        }
        appendData(data) {
            return this.insert(List.createItem(data));
        }
        insert(item, before = null) {
            if (before !== null) {
                // prev   before
                //      ^
                //     item
                this.updateCursors(before.prev, item, before, item);
    
                if (before.prev === null) {
                    // insert to the beginning of list
                    if (this.head !== before) {
                        throw new Error('before doesn\'t belong to list');
                    }
                    // since head points to before therefore list doesn't empty
                    // no need to check tail
                    this.head = item;
                    before.prev = item;
                    item.next = before;
                    this.updateCursors(null, item);
                } else {
                    // insert between two items
                    before.prev.next = item;
                    item.prev = before.prev;
                    before.prev = item;
                    item.next = before;
                }
            } else {
                // tail
                //      ^
                //      item
                this.updateCursors(this.tail, item, null, item);
    
                // insert to the ending of the list
                if (this.tail !== null) {
                    // last item -> new item
                    this.tail.next = item;
                    // last item <- new item
                    item.prev = this.tail;
                } else {
                    // if list has no tail, then it also has no head
                    // in this case head points to new item
                    this.head = item;
                }
    
                // tail always points to new item
                this.tail = item;
            }
    
            return this;
        }
        insertData(data, before) {
            return this.insert(List.createItem(data), before);
        }
        remove(item) {
            //      item
            //       ^
            // prev     next
            this.updateCursors(item, item.prev, item, item.next);
    
            if (item.prev !== null) {
                item.prev.next = item.next;
            } else {
                if (this.head !== item) {
                    throw new Error('item doesn\'t belong to list');
                }
    
                this.head = item.next;
            }
    
            if (item.next !== null) {
                item.next.prev = item.prev;
            } else {
                if (this.tail !== item) {
                    throw new Error('item doesn\'t belong to list');
                }
    
                this.tail = item.prev;
            }
    
            item.prev = null;
            item.next = null;
    
            return item;
        }
        push(data) {
            this.insert(List.createItem(data));
        }
        pop() {
            return this.tail !== null ? this.remove(this.tail) : null;
        }
        unshift(data) {
            this.prepend(List.createItem(data));
        }
        shift() {
            return this.head !== null ? this.remove(this.head) : null;
        }
        prependList(list) {
            return this.insertList(list, this.head);
        }
        appendList(list) {
            return this.insertList(list);
        }
        insertList(list, before) {
            // ignore empty lists
            if (list.head === null) {
                return this;
            }
    
            if (before !== undefined && before !== null) {
                this.updateCursors(before.prev, list.tail, before, list.head);
    
                // insert in the middle of dist list
                if (before.prev !== null) {
                    // before.prev <-> list.head
                    before.prev.next = list.head;
                    list.head.prev = before.prev;
                } else {
                    this.head = list.head;
                }
    
                before.prev = list.tail;
                list.tail.next = before;
            } else {
                this.updateCursors(this.tail, list.tail, null, list.head);
    
                // insert to end of the list
                if (this.tail !== null) {
                    // if destination list has a tail, then it also has a head,
                    // but head doesn't change
                    // dest tail -> source head
                    this.tail.next = list.head;
                    // dest tail <- source head
                    list.head.prev = this.tail;
                } else {
                    // if list has no a tail, then it also has no a head
                    // in this case points head to new item
                    this.head = list.head;
                }
    
                // tail always start point to new item
                this.tail = list.tail;
            }
    
            list.head = null;
            list.tail = null;
            return this;
        }
        replace(oldItem, newItemOrList) {
            if ('head' in newItemOrList) {
                this.insertList(newItemOrList, oldItem);
            } else {
                this.insert(newItemOrList, oldItem);
            }
    
            this.remove(oldItem);
        }
    }
    
    
    /***/ }),
    /* 41 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "SyntaxError": () => (/* binding */ SyntaxError)
    /* harmony export */ });
    /* harmony import */ var _utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42);
    
    
    const MAX_LINE_LENGTH = 100;
    const OFFSET_CORRECTION = 60;
    const TAB_REPLACEMENT = '    ';
    
    function sourceFragment({ source, line, column }, extraLines) {
        function processLines(start, end) {
            return lines
                .slice(start, end)
                .map((line, idx) =>
                    String(start + idx + 1).padStart(maxNumLength) + ' |' + line
                ).join('\n');
        }
    
        const lines = source.split(/\r\n?|\n|\f/);
        const startLine = Math.max(1, line - extraLines) - 1;
        const endLine = Math.min(line + extraLines, lines.length + 1);
        const maxNumLength = Math.max(4, String(endLine).length) + 1;
        let cutLeft = 0;
    
        // column correction according to replaced tab before column
        column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;
    
        if (column > MAX_LINE_LENGTH) {
            cutLeft = column - OFFSET_CORRECTION + 3;
            column = OFFSET_CORRECTION - 2;
        }
    
        for (let i = startLine; i <= endLine; i++) {
            if (i >= 0 && i < lines.length) {
                lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
                lines[i] =
                    (cutLeft > 0 && lines[i].length > cutLeft ? '\u2026' : '') +
                    lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) +
                    (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? '\u2026' : '');
            }
        }
    
        return [
            processLines(startLine, line),
            new Array(column + maxNumLength + 2).join('-') + '^',
            processLines(line, endLine)
        ].filter(Boolean).join('\n');
    }
    
    function SyntaxError(message, source, offset, line, column) {
        const error = Object.assign((0,_utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__.createCustomError)('SyntaxError', message), {
            source,
            offset,
            line,
            column,
            sourceFragment(extraLines) {
                return sourceFragment({ source, line, column }, isNaN(extraLines) ? 0 : extraLines);
            },
            get formattedMessage() {
                return (
                    `Parse error: ${message}\n` +
                    sourceFragment({ source, line, column }, 2)
                );
            }
        });
    
        return error;
    }
    
    
    /***/ }),
    /* 42 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "createCustomError": () => (/* binding */ createCustomError)
    /* harmony export */ });
    function createCustomError(name, message) {
        // use Object.create(), because some VMs prevent setting line/column otherwise
        // (iOS Safari 10 even throws an exception)
        const error = Object.create(SyntaxError.prototype);
        const errorStack = new Error();
    
        return Object.assign(error, {
            name,
            message,
            get stack() {
                return (errorStack.stack || '').replace(/^(.+\n){1,3}/, `${name}: ${message}\n`);
            }
        });
    };
    
    
    /***/ }),
    /* 43 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "readSequence": () => (/* binding */ readSequence)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    
    
    function readSequence(recognizer) {
        const children = this.createList();
        let space = false;
        const context = {
            recognizer
        };
    
        while (!this.eof) {
            switch (this.tokenType) {
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Comment:
                    this.next();
                    continue;
    
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.WhiteSpace:
                    space = true;
                    this.next();
                    continue;
            }
    
            let child = recognizer.getNode.call(this, context);
    
            if (child === undefined) {
                break;
            }
    
            if (space) {
                if (recognizer.onWhiteSpace) {
                    recognizer.onWhiteSpace.call(this, child, children, context);
                }
                space = false;
            }
    
            children.push(child);
        }
    
        if (space && recognizer.onWhiteSpace) {
            recognizer.onWhiteSpace.call(this, null, children, context);
        }
    
        return children;
    };
    
    
    /***/ }),
    /* 44 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "createGenerator": () => (/* binding */ createGenerator)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    /* harmony import */ var _sourceMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(45);
    /* harmony import */ var _token_before_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(52);
    
    
    
    
    const REVERSESOLIDUS = 0x005c; // U+005C REVERSE SOLIDUS (\)
    
    function processChildren(node, delimeter) {
        if (typeof delimeter === 'function') {
            let prev = null;
    
            node.children.forEach(node => {
                if (prev !== null) {
                    delimeter.call(this, prev);
                }
    
                this.node(node);
                prev = node;
            });
    
            return;
        }
    
        node.children.forEach(this.node, this);
    }
    
    function processChunk(chunk) {
        (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.tokenize)(chunk, (type, start, end) => {
            this.token(type, chunk.slice(start, end));
        });
    }
    
    function createGenerator(config) {
        const types = new Map();
    
        for (let name in config.node) {
            types.set(name, config.node[name].generate);
        }
    
        return function(node, options) {
            let buffer = '';
            let prevCode = 0;
            let handlers = {
                node(node) {
                    if (types.has(node.type)) {
                        types.get(node.type).call(publicApi, node);
                    } else {
                        throw new Error('Unknown node type: ' + node.type);
                    }
                },
                tokenBefore: _token_before_js__WEBPACK_IMPORTED_MODULE_2__.safe,
                token(type, value) {
                    prevCode = this.tokenBefore(prevCode, type, value);
    
                    this.emit(value, type, false);
    
                    if (type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Delim && value.charCodeAt(0) === REVERSESOLIDUS) {
                        this.emit('\n', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.WhiteSpace, true);
                    }
                },
                emit(value) {
                    buffer += value;
                },
                result() {
                    return buffer;
                }
            };
    
            if (options) {
                if (typeof options.decorator === 'function') {
                    handlers = options.decorator(handlers);
                }
    
                if (options.sourceMap) {
                    handlers = (0,_sourceMap_js__WEBPACK_IMPORTED_MODULE_1__.generateSourceMap)(handlers);
                }
    
                if (options.mode in _token_before_js__WEBPACK_IMPORTED_MODULE_2__) {
                    handlers.tokenBefore = _token_before_js__WEBPACK_IMPORTED_MODULE_2__[options.mode];
                }
            }
    
            const publicApi = {
                node: (node) => handlers.node(node),
                children: processChildren,
                token: (type, value) => handlers.token(type, value),
                tokenize: processChunk
            };
    
            handlers.node(node);
    
            return handlers.result();
        };
    };
    
    
    /***/ }),
    /* 45 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "generateSourceMap": () => (/* binding */ generateSourceMap)
    /* harmony export */ });
    /* harmony import */ var source_map_js_lib_source_map_generator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
    
    
    const trackNodes = new Set(['Atrule', 'Selector', 'Declaration']);
    
    function generateSourceMap(handlers) {
        const map = new source_map_js_lib_source_map_generator_js__WEBPACK_IMPORTED_MODULE_0__.SourceMapGenerator();
        const generated = {
            line: 1,
            column: 0
        };
        const original = {
            line: 0, // should be zero to add first mapping
            column: 0
        };
        const activatedGenerated = {
            line: 1,
            column: 0
        };
        const activatedMapping = {
            generated: activatedGenerated
        };
        let line = 1;
        let column = 0;
        let sourceMappingActive = false;
    
        const origHandlersNode = handlers.node;
        handlers.node = function(node) {
            if (node.loc && node.loc.start && trackNodes.has(node.type)) {
                const nodeLine = node.loc.start.line;
                const nodeColumn = node.loc.start.column - 1;
    
                if (original.line !== nodeLine ||
                    original.column !== nodeColumn) {
                    original.line = nodeLine;
                    original.column = nodeColumn;
    
                    generated.line = line;
                    generated.column = column;
    
                    if (sourceMappingActive) {
                        sourceMappingActive = false;
                        if (generated.line !== activatedGenerated.line ||
                            generated.column !== activatedGenerated.column) {
                            map.addMapping(activatedMapping);
                        }
                    }
    
                    sourceMappingActive = true;
                    map.addMapping({
                        source: node.loc.source,
                        original,
                        generated
                    });
                }
            }
    
            origHandlersNode.call(this, node);
    
            if (sourceMappingActive && trackNodes.has(node.type)) {
                activatedGenerated.line = line;
                activatedGenerated.column = column;
            }
        };
    
        const origHandlersEmit = handlers.emit;
        handlers.emit = function(value, type, auto) {
            for (let i = 0; i < value.length; i++) {
                if (value.charCodeAt(i) === 10) { // \n
                    line++;
                    column = 0;
                } else {
                    column++;
                }
            }
    
            origHandlersEmit(value, type, auto);
        };
    
        const origHandlersResult = handlers.result;
        handlers.result = function() {
            if (sourceMappingActive) {
                map.addMapping(activatedMapping);
            }
    
            return {
                css: origHandlersResult(),
                map
            };
        };
    
        return handlers;
    };
    
    
    /***/ }),
    /* 46 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    /* -*- Mode: js; js-indent-level: 2; -*- */
    /*
     * Copyright 2011 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     */
    
    var base64VLQ = __webpack_require__(47);
    var util = __webpack_require__(49);
    var ArraySet = (__webpack_require__(50).ArraySet);
    var MappingList = (__webpack_require__(51).MappingList);
    
    /**
     * An instance of the SourceMapGenerator represents a source map which is
     * being built incrementally. You may pass an object with the following
     * properties:
     *
     *   - file: The filename of the generated source.
     *   - sourceRoot: A root for all relative URLs in this source map.
     */
    function SourceMapGenerator(aArgs) {
      if (!aArgs) {
        aArgs = {};
      }
      this._file = util.getArg(aArgs, 'file', null);
      this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
      this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
      this._sources = new ArraySet();
      this._names = new ArraySet();
      this._mappings = new MappingList();
      this._sourcesContents = null;
    }
    
    SourceMapGenerator.prototype._version = 3;
    
    /**
     * Creates a new SourceMapGenerator based on a SourceMapConsumer
     *
     * @param aSourceMapConsumer The SourceMap.
     */
    SourceMapGenerator.fromSourceMap =
      function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
        var sourceRoot = aSourceMapConsumer.sourceRoot;
        var generator = new SourceMapGenerator({
          file: aSourceMapConsumer.file,
          sourceRoot: sourceRoot
        });
        aSourceMapConsumer.eachMapping(function (mapping) {
          var newMapping = {
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            }
          };
    
          if (mapping.source != null) {
            newMapping.source = mapping.source;
            if (sourceRoot != null) {
              newMapping.source = util.relative(sourceRoot, newMapping.source);
            }
    
            newMapping.original = {
              line: mapping.originalLine,
              column: mapping.originalColumn
            };
    
            if (mapping.name != null) {
              newMapping.name = mapping.name;
            }
          }
    
          generator.addMapping(newMapping);
        });
        aSourceMapConsumer.sources.forEach(function (sourceFile) {
          var sourceRelative = sourceFile;
          if (sourceRoot !== null) {
            sourceRelative = util.relative(sourceRoot, sourceFile);
          }
    
          if (!generator._sources.has(sourceRelative)) {
            generator._sources.add(sourceRelative);
          }
    
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            generator.setSourceContent(sourceFile, content);
          }
        });
        return generator;
      };
    
    /**
     * Add a single mapping from original source line and column to the generated
     * source's line and column for this source map being created. The mapping
     * object should have the following properties:
     *
     *   - generated: An object with the generated line and column positions.
     *   - original: An object with the original line and column positions.
     *   - source: The original source file (relative to the sourceRoot).
     *   - name: An optional original token name for this mapping.
     */
    SourceMapGenerator.prototype.addMapping =
      function SourceMapGenerator_addMapping(aArgs) {
        var generated = util.getArg(aArgs, 'generated');
        var original = util.getArg(aArgs, 'original', null);
        var source = util.getArg(aArgs, 'source', null);
        var name = util.getArg(aArgs, 'name', null);
    
        if (!this._skipValidation) {
          this._validateMapping(generated, original, source, name);
        }
    
        if (source != null) {
          source = String(source);
          if (!this._sources.has(source)) {
            this._sources.add(source);
          }
        }
    
        if (name != null) {
          name = String(name);
          if (!this._names.has(name)) {
            this._names.add(name);
          }
        }
    
        this._mappings.add({
          generatedLine: generated.line,
          generatedColumn: generated.column,
          originalLine: original != null && original.line,
          originalColumn: original != null && original.column,
          source: source,
          name: name
        });
      };
    
    /**
     * Set the source content for a source file.
     */
    SourceMapGenerator.prototype.setSourceContent =
      function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
        var source = aSourceFile;
        if (this._sourceRoot != null) {
          source = util.relative(this._sourceRoot, source);
        }
    
        if (aSourceContent != null) {
          // Add the source content to the _sourcesContents map.
          // Create a new _sourcesContents map if the property is null.
          if (!this._sourcesContents) {
            this._sourcesContents = Object.create(null);
          }
          this._sourcesContents[util.toSetString(source)] = aSourceContent;
        } else if (this._sourcesContents) {
          // Remove the source file from the _sourcesContents map.
          // If the _sourcesContents map is empty, set the property to null.
          delete this._sourcesContents[util.toSetString(source)];
          if (Object.keys(this._sourcesContents).length === 0) {
            this._sourcesContents = null;
          }
        }
      };
    
    /**
     * Applies the mappings of a sub-source-map for a specific source file to the
     * source map being generated. Each mapping to the supplied source file is
     * rewritten using the supplied source map. Note: The resolution for the
     * resulting mappings is the minimium of this map and the supplied map.
     *
     * @param aSourceMapConsumer The source map to be applied.
     * @param aSourceFile Optional. The filename of the source file.
     *        If omitted, SourceMapConsumer's file property will be used.
     * @param aSourceMapPath Optional. The dirname of the path to the source map
     *        to be applied. If relative, it is relative to the SourceMapConsumer.
     *        This parameter is needed when the two source maps aren't in the same
     *        directory, and the source map to be applied contains relative source
     *        paths. If so, those relative source paths need to be rewritten
     *        relative to the SourceMapGenerator.
     */
    SourceMapGenerator.prototype.applySourceMap =
      function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        var sourceFile = aSourceFile;
        // If aSourceFile is omitted, we will use the file property of the SourceMap
        if (aSourceFile == null) {
          if (aSourceMapConsumer.file == null) {
            throw new Error(
              'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
              'or the source map\'s "file" property. Both were omitted.'
            );
          }
          sourceFile = aSourceMapConsumer.file;
        }
        var sourceRoot = this._sourceRoot;
        // Make "sourceFile" relative if an absolute Url is passed.
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        // Applying the SourceMap can add and remove items from the sources and
        // the names array.
        var newSources = new ArraySet();
        var newNames = new ArraySet();
    
        // Find mappings for the "sourceFile"
        this._mappings.unsortedForEach(function (mapping) {
          if (mapping.source === sourceFile && mapping.originalLine != null) {
            // Check if it can be mapped by the source map, then update the mapping.
            var original = aSourceMapConsumer.originalPositionFor({
              line: mapping.originalLine,
              column: mapping.originalColumn
            });
            if (original.source != null) {
              // Copy mapping
              mapping.source = original.source;
              if (aSourceMapPath != null) {
                mapping.source = util.join(aSourceMapPath, mapping.source)
              }
              if (sourceRoot != null) {
                mapping.source = util.relative(sourceRoot, mapping.source);
              }
              mapping.originalLine = original.line;
              mapping.originalColumn = original.column;
              if (original.name != null) {
                mapping.name = original.name;
              }
            }
          }
    
          var source = mapping.source;
          if (source != null && !newSources.has(source)) {
            newSources.add(source);
          }
    
          var name = mapping.name;
          if (name != null && !newNames.has(name)) {
            newNames.add(name);
          }
    
        }, this);
        this._sources = newSources;
        this._names = newNames;
    
        // Copy sourcesContents of applied map.
        aSourceMapConsumer.sources.forEach(function (sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            if (aSourceMapPath != null) {
              sourceFile = util.join(aSourceMapPath, sourceFile);
            }
            if (sourceRoot != null) {
              sourceFile = util.relative(sourceRoot, sourceFile);
            }
            this.setSourceContent(sourceFile, content);
          }
        }, this);
      };
    
    /**
     * A mapping can have one of the three levels of data:
     *
     *   1. Just the generated position.
     *   2. The Generated position, original position, and original source.
     *   3. Generated and original position, original source, as well as a name
     *      token.
     *
     * To maintain consistency, we validate that any new mapping being added falls
     * in to one of these categories.
     */
    SourceMapGenerator.prototype._validateMapping =
      function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                  aName) {
        // When aOriginal is truthy but has empty values for .line and .column,
        // it is most likely a programmer error. In this case we throw a very
        // specific error message to try to guide them the right way.
        // For example: https://github.com/Polymer/polymer-bundler/pull/519
        if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
            throw new Error(
                'original.line and original.column are not numbers -- you probably meant to omit ' +
                'the original mapping entirely and only map the generated position. If so, pass ' +
                'null for the original mapping instead of an object with empty or null values.'
            );
        }
    
        if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
            && aGenerated.line > 0 && aGenerated.column >= 0
            && !aOriginal && !aSource && !aName) {
          // Case 1.
          return;
        }
        else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
                 && aOriginal && 'line' in aOriginal && 'column' in aOriginal
                 && aGenerated.line > 0 && aGenerated.column >= 0
                 && aOriginal.line > 0 && aOriginal.column >= 0
                 && aSource) {
          // Cases 2 and 3.
          return;
        }
        else {
          throw new Error('Invalid mapping: ' + JSON.stringify({
            generated: aGenerated,
            source: aSource,
            original: aOriginal,
            name: aName
          }));
        }
      };
    
    /**
     * Serialize the accumulated mappings in to the stream of base 64 VLQs
     * specified by the source map format.
     */
    SourceMapGenerator.prototype._serializeMappings =
      function SourceMapGenerator_serializeMappings() {
        var previousGeneratedColumn = 0;
        var previousGeneratedLine = 1;
        var previousOriginalColumn = 0;
        var previousOriginalLine = 0;
        var previousName = 0;
        var previousSource = 0;
        var result = '';
        var next;
        var mapping;
        var nameIdx;
        var sourceIdx;
    
        var mappings = this._mappings.toArray();
        for (var i = 0, len = mappings.length; i < len; i++) {
          mapping = mappings[i];
          next = ''
    
          if (mapping.generatedLine !== previousGeneratedLine) {
            previousGeneratedColumn = 0;
            while (mapping.generatedLine !== previousGeneratedLine) {
              next += ';';
              previousGeneratedLine++;
            }
          }
          else {
            if (i > 0) {
              if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
                continue;
              }
              next += ',';
            }
          }
    
          next += base64VLQ.encode(mapping.generatedColumn
                                     - previousGeneratedColumn);
          previousGeneratedColumn = mapping.generatedColumn;
    
          if (mapping.source != null) {
            sourceIdx = this._sources.indexOf(mapping.source);
            next += base64VLQ.encode(sourceIdx - previousSource);
            previousSource = sourceIdx;
    
            // lines are stored 0-based in SourceMap spec version 3
            next += base64VLQ.encode(mapping.originalLine - 1
                                       - previousOriginalLine);
            previousOriginalLine = mapping.originalLine - 1;
    
            next += base64VLQ.encode(mapping.originalColumn
                                       - previousOriginalColumn);
            previousOriginalColumn = mapping.originalColumn;
    
            if (mapping.name != null) {
              nameIdx = this._names.indexOf(mapping.name);
              next += base64VLQ.encode(nameIdx - previousName);
              previousName = nameIdx;
            }
          }
    
          result += next;
        }
    
        return result;
      };
    
    SourceMapGenerator.prototype._generateSourcesContent =
      function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
        return aSources.map(function (source) {
          if (!this._sourcesContents) {
            return null;
          }
          if (aSourceRoot != null) {
            source = util.relative(aSourceRoot, source);
          }
          var key = util.toSetString(source);
          return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
            ? this._sourcesContents[key]
            : null;
        }, this);
      };
    
    /**
     * Externalize the source map.
     */
    SourceMapGenerator.prototype.toJSON =
      function SourceMapGenerator_toJSON() {
        var map = {
          version: this._version,
          sources: this._sources.toArray(),
          names: this._names.toArray(),
          mappings: this._serializeMappings()
        };
        if (this._file != null) {
          map.file = this._file;
        }
        if (this._sourceRoot != null) {
          map.sourceRoot = this._sourceRoot;
        }
        if (this._sourcesContents) {
          map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
        }
    
        return map;
      };
    
    /**
     * Render the source map being generated to a string.
     */
    SourceMapGenerator.prototype.toString =
      function SourceMapGenerator_toString() {
        return JSON.stringify(this.toJSON());
      };
    
    exports.SourceMapGenerator = SourceMapGenerator;
    
    
    /***/ }),
    /* 47 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    /* -*- Mode: js; js-indent-level: 2; -*- */
    /*
     * Copyright 2011 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     *
     * Based on the Base 64 VLQ implementation in Closure Compiler:
     * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
     *
     * Copyright 2011 The Closure Compiler Authors. All rights reserved.
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are
     * met:
     *
     *  * Redistributions of source code must retain the above copyright
     *    notice, this list of conditions and the following disclaimer.
     *  * Redistributions in binary form must reproduce the above
     *    copyright notice, this list of conditions and the following
     *    disclaimer in the documentation and/or other materials provided
     *    with the distribution.
     *  * Neither the name of Google Inc. nor the names of its
     *    contributors may be used to endorse or promote products derived
     *    from this software without specific prior written permission.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
     * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
     * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
     * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
     * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
     * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
     * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
     * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
     * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
     * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */
    
    var base64 = __webpack_require__(48);
    
    // A single base 64 digit can contain 6 bits of data. For the base 64 variable
    // length quantities we use in the source map spec, the first bit is the sign,
    // the next four bits are the actual value, and the 6th bit is the
    // continuation bit. The continuation bit tells us whether there are more
    // digits in this value following this digit.
    //
    //   Continuation
    //   |    Sign
    //   |    |
    //   V    V
    //   101011
    
    var VLQ_BASE_SHIFT = 5;
    
    // binary: 100000
    var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
    
    // binary: 011111
    var VLQ_BASE_MASK = VLQ_BASE - 1;
    
    // binary: 100000
    var VLQ_CONTINUATION_BIT = VLQ_BASE;
    
    /**
     * Converts from a two-complement value to a value where the sign bit is
     * placed in the least significant bit.  For example, as decimals:
     *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
     *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
     */
    function toVLQSigned(aValue) {
      return aValue < 0
        ? ((-aValue) << 1) + 1
        : (aValue << 1) + 0;
    }
    
    /**
     * Converts to a two-complement value from a value where the sign bit is
     * placed in the least significant bit.  For example, as decimals:
     *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
     *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
     */
    function fromVLQSigned(aValue) {
      var isNegative = (aValue & 1) === 1;
      var shifted = aValue >> 1;
      return isNegative
        ? -shifted
        : shifted;
    }
    
    /**
     * Returns the base 64 VLQ encoded value.
     */
    exports.encode = function base64VLQ_encode(aValue) {
      var encoded = "";
      var digit;
    
      var vlq = toVLQSigned(aValue);
    
      do {
        digit = vlq & VLQ_BASE_MASK;
        vlq >>>= VLQ_BASE_SHIFT;
        if (vlq > 0) {
          // There are still more digits in this value, so we must make sure the
          // continuation bit is marked.
          digit |= VLQ_CONTINUATION_BIT;
        }
        encoded += base64.encode(digit);
      } while (vlq > 0);
    
      return encoded;
    };
    
    /**
     * Decodes the next base 64 VLQ value from the given string and returns the
     * value and the rest of the string via the out parameter.
     */
    exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
      var strLen = aStr.length;
      var result = 0;
      var shift = 0;
      var continuation, digit;
    
      do {
        if (aIndex >= strLen) {
          throw new Error("Expected more digits in base 64 VLQ value.");
        }
    
        digit = base64.decode(aStr.charCodeAt(aIndex++));
        if (digit === -1) {
          throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
        }
    
        continuation = !!(digit & VLQ_CONTINUATION_BIT);
        digit &= VLQ_BASE_MASK;
        result = result + (digit << shift);
        shift += VLQ_BASE_SHIFT;
      } while (continuation);
    
      aOutParam.value = fromVLQSigned(result);
      aOutParam.rest = aIndex;
    };
    
    
    /***/ }),
    /* 48 */
    /***/ ((__unused_webpack_module, exports) => {
    
    /* -*- Mode: js; js-indent-level: 2; -*- */
    /*
     * Copyright 2011 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     */
    
    var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    
    /**
     * Encode an integer in the range of 0 to 63 to a single base 64 digit.
     */
    exports.encode = function (number) {
      if (0 <= number && number < intToCharMap.length) {
        return intToCharMap[number];
      }
      throw new TypeError("Must be between 0 and 63: " + number);
    };
    
    /**
     * Decode a single base 64 character code digit to an integer. Returns -1 on
     * failure.
     */
    exports.decode = function (charCode) {
      var bigA = 65;     // 'A'
      var bigZ = 90;     // 'Z'
    
      var littleA = 97;  // 'a'
      var littleZ = 122; // 'z'
    
      var zero = 48;     // '0'
      var nine = 57;     // '9'
    
      var plus = 43;     // '+'
      var slash = 47;    // '/'
    
      var littleOffset = 26;
      var numberOffset = 52;
    
      // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
      if (bigA <= charCode && charCode <= bigZ) {
        return (charCode - bigA);
      }
    
      // 26 - 51: abcdefghijklmnopqrstuvwxyz
      if (littleA <= charCode && charCode <= littleZ) {
        return (charCode - littleA + littleOffset);
      }
    
      // 52 - 61: 0123456789
      if (zero <= charCode && charCode <= nine) {
        return (charCode - zero + numberOffset);
      }
    
      // 62: +
      if (charCode == plus) {
        return 62;
      }
    
      // 63: /
      if (charCode == slash) {
        return 63;
      }
    
      // Invalid base64 digit.
      return -1;
    };
    
    
    /***/ }),
    /* 49 */
    /***/ ((__unused_webpack_module, exports) => {
    
    /* -*- Mode: js; js-indent-level: 2; -*- */
    /*
     * Copyright 2011 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     */
    
    /**
     * This is a helper function for getting values from parameter/options
     * objects.
     *
     * @param args The object we are extracting values from
     * @param name The name of the property we are getting.
     * @param defaultValue An optional value to return if the property is missing
     * from the object. If this is not specified and the property is missing, an
     * error will be thrown.
     */
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports.getArg = getArg;
    
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports.urlParse = urlParse;
    
    function urlGenerate(aParsedUrl) {
      var url = '';
      if (aParsedUrl.scheme) {
        url += aParsedUrl.scheme + ':';
      }
      url += '//';
      if (aParsedUrl.auth) {
        url += aParsedUrl.auth + '@';
      }
      if (aParsedUrl.host) {
        url += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url += ":" + aParsedUrl.port
      }
      if (aParsedUrl.path) {
        url += aParsedUrl.path;
      }
      return url;
    }
    exports.urlGenerate = urlGenerate;
    
    var MAX_CACHED_INPUTS = 32;
    
    /**
     * Takes some function `f(input) -> result` and returns a memoized version of
     * `f`.
     *
     * We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
     * memoization is a dumb-simple, linear least-recently-used cache.
     */
    function lruMemoize(f) {
      var cache = [];
    
      return function(input) {
        for (var i = 0; i < cache.length; i++) {
          if (cache[i].input === input) {
            var temp = cache[0];
            cache[0] = cache[i];
            cache[i] = temp;
            return cache[0].result;
          }
        }
    
        var result = f(input);
    
        cache.unshift({
          input,
          result,
        });
    
        if (cache.length > MAX_CACHED_INPUTS) {
          cache.pop();
        }
    
        return result;
      };
    }
    
    /**
     * Normalizes a path, or the path portion of a URL:
     *
     * - Replaces consecutive slashes with one slash.
     * - Removes unnecessary '.' parts.
     * - Removes unnecessary '<dir>/..' parts.
     *
     * Based on code in the Node.js 'path' core module.
     *
     * @param aPath The path or url to normalize.
     */
    var normalize = lruMemoize(function normalize(aPath) {
      var path = aPath;
      var url = urlParse(aPath);
      if (url) {
        if (!url.path) {
          return aPath;
        }
        path = url.path;
      }
      var isAbsolute = exports.isAbsolute(path);
      // Split the path into parts between `/` characters. This is much faster than
      // using `.split(/\/+/g)`.
      var parts = [];
      var start = 0;
      var i = 0;
      while (true) {
        start = i;
        i = path.indexOf("/", start);
        if (i === -1) {
          parts.push(path.slice(start));
          break;
        } else {
          parts.push(path.slice(start, i));
          while (i < path.length && path[i] === "/") {
            i++;
          }
        }
      }
    
      for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
        part = parts[i];
        if (part === '.') {
          parts.splice(i, 1);
        } else if (part === '..') {
          up++;
        } else if (up > 0) {
          if (part === '') {
            // The first part is blank if the path is absolute. Trying to go
            // above the root is a no-op. Therefore we can remove all '..' parts
            // directly after the root.
            parts.splice(i + 1, up);
            up = 0;
          } else {
            parts.splice(i, 2);
            up--;
          }
        }
      }
      path = parts.join('/');
    
      if (path === '') {
        path = isAbsolute ? '/' : '.';
      }
    
      if (url) {
        url.path = path;
        return urlGenerate(url);
      }
      return path;
    });
    exports.normalize = normalize;
    
    /**
     * Joins two paths/URLs.
     *
     * @param aRoot The root path or URL.
     * @param aPath The path or URL to be joined with the root.
     *
     * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
     *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
     *   first.
     * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
     *   is updated with the result and aRoot is returned. Otherwise the result
     *   is returned.
     *   - If aPath is absolute, the result is aPath.
     *   - Otherwise the two paths are joined with a slash.
     * - Joining for example 'http://' and 'www.example.com' is also supported.
     */
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || '/';
      }
    
      // `join(foo, '//www.example.org')`
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
    
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
    
      // `join('http://', 'www.example.com')`
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
    
      var joined = aPath.charAt(0) === '/'
        ? aPath
        : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
    
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports.join = join;
    
    exports.isAbsolute = function (aPath) {
      return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
    };
    
    /**
     * Make a path relative to a URL or another path.
     *
     * @param aRoot The root path or URL.
     * @param aPath The path or URL to be made relative to aRoot.
     */
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
    
      aRoot = aRoot.replace(/\/$/, '');
    
      // It is possible for the path to be above the root. In this case, simply
      // checking whether the root is a prefix of the path won't work. Instead, we
      // need to remove components from the root one by one, until either we find
      // a prefix that fits, or we run out of components to remove.
      var level = 0;
      while (aPath.indexOf(aRoot + '/') !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
    
        // If the only part of the root that is left is the scheme (i.e. http://,
        // file:///, etc.), one or more slashes (/), or simply nothing at all, we
        // have exhausted all components, so the path is not relative to the root.
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
    
        ++level;
      }
    
      // Make sure we add a "../" for each component we removed from the root.
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports.relative = relative;
    
    var supportsNullProto = (function () {
      var obj = Object.create(null);
      return !('__proto__' in obj);
    }());
    
    function identity (s) {
      return s;
    }
    
    /**
     * Because behavior goes wacky when you set `__proto__` on objects, we
     * have to prefix all the strings in our set with an arbitrary character.
     *
     * See https://github.com/mozilla/source-map/pull/31 and
     * https://github.com/mozilla/source-map/issues/30
     *
     * @param String aStr
     */
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return '$' + aStr;
      }
    
      return aStr;
    }
    exports.toSetString = supportsNullProto ? identity : toSetString;
    
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
    
      return aStr;
    }
    exports.fromSetString = supportsNullProto ? identity : fromSetString;
    
    function isProtoString(s) {
      if (!s) {
        return false;
      }
    
      var length = s.length;
    
      if (length < 9 /* "__proto__".length */) {
        return false;
      }
    
      if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
          s.charCodeAt(length - 2) !== 95  /* '_' */ ||
          s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
          s.charCodeAt(length - 4) !== 116 /* 't' */ ||
          s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
          s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
          s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
          s.charCodeAt(length - 8) !== 95  /* '_' */ ||
          s.charCodeAt(length - 9) !== 95  /* '_' */) {
        return false;
      }
    
      for (var i = length - 10; i >= 0; i--) {
        if (s.charCodeAt(i) !== 36 /* '$' */) {
          return false;
        }
      }
    
      return true;
    }
    
    /**
     * Comparator between two mappings where the original positions are compared.
     *
     * Optionally pass in `true` as `onlyCompareGenerated` to consider two
     * mappings with the same original source/line/column, but different generated
     * line and column the same. Useful when searching for a mapping with a
     * stubbed out mapping.
     */
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
    
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositions = compareByOriginalPositions;
    
    function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
      var cmp
    
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
    
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;
    
    /**
     * Comparator between two mappings with deflated source and name indices where
     * the generated positions are compared.
     *
     * Optionally pass in `true` as `onlyCompareGenerated` to consider two
     * mappings with the same generated line and column, but different
     * source/name/original line and column the same. Useful when searching for a
     * mapping with a stubbed out mapping.
     */
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
    
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
    
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    
    function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
    
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
    
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;
    
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
    
      if (aStr1 === null) {
        return 1; // aStr2 !== null
      }
    
      if (aStr2 === null) {
        return -1; // aStr1 !== null
      }
    
      if (aStr1 > aStr2) {
        return 1;
      }
    
      return -1;
    }
    
    /**
     * Comparator between two mappings with inflated source and name strings where
     * the generated positions are compared.
     */
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
    
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
    
      return strcmp(mappingA.name, mappingB.name);
    }
    exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    
    /**
     * Strip any JSON XSSI avoidance prefix from the string (as documented
     * in the source maps specification), and then parse the string as
     * JSON.
     */
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
    }
    exports.parseSourceMapInput = parseSourceMapInput;
    
    /**
     * Compute the URL of a source given the the source root, the source's
     * URL, and the source map's URL.
     */
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || '';
    
      if (sourceRoot) {
        // This follows what Chrome does.
        if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
          sourceRoot += '/';
        }
        // The spec says:
        //   Line 4: An optional source root, useful for relocating source
        //   files on a server or removing repeated values in the
        //   â€œsourcesâ€ entry.  This value is prepended to the individual
        //   entries in the â€œsourceâ€ field.
        sourceURL = sourceRoot + sourceURL;
      }
    
      // Historically, SourceMapConsumer did not take the sourceMapURL as
      // a parameter.  This mode is still somewhat supported, which is why
      // this code block is conditional.  However, it's preferable to pass
      // the source map URL to SourceMapConsumer, so that this function
      // can implement the source URL resolution algorithm as outlined in
      // the spec.  This block is basically the equivalent of:
      //    new URL(sourceURL, sourceMapURL).toString()
      // ... except it avoids using URL, which wasn't available in the
      // older releases of node still supported by this library.
      //
      // The spec says:
      //   If the sources are not absolute URLs after prepending of the
      //   â€œsourceRootâ€, the sources are resolved relative to the
      //   SourceMap (like resolving script src in a html document).
      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          // Strip the last path component, but keep the "/".
          var index = parsed.path.lastIndexOf('/');
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
    
      return normalize(sourceURL);
    }
    exports.computeSourceURL = computeSourceURL;
    
    
    /***/ }),
    /* 50 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    /* -*- Mode: js; js-indent-level: 2; -*- */
    /*
     * Copyright 2011 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     */
    
    var util = __webpack_require__(49);
    var has = Object.prototype.hasOwnProperty;
    var hasNativeMap = typeof Map !== "undefined";
    
    /**
     * A data structure which is a combination of an array and a set. Adding a new
     * member is O(1), testing for membership is O(1), and finding the index of an
     * element is O(1). Removing elements from the set is not supported. Only
     * strings are supported for membership.
     */
    function ArraySet() {
      this._array = [];
      this._set = hasNativeMap ? new Map() : Object.create(null);
    }
    
    /**
     * Static method for creating ArraySet instances from an existing array.
     */
    ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
      var set = new ArraySet();
      for (var i = 0, len = aArray.length; i < len; i++) {
        set.add(aArray[i], aAllowDuplicates);
      }
      return set;
    };
    
    /**
     * Return how many unique items are in this ArraySet. If duplicates have been
     * added, than those do not count towards the size.
     *
     * @returns Number
     */
    ArraySet.prototype.size = function ArraySet_size() {
      return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
    };
    
    /**
     * Add the given string to this set.
     *
     * @param String aStr
     */
    ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
      var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
      var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
      var idx = this._array.length;
      if (!isDuplicate || aAllowDuplicates) {
        this._array.push(aStr);
      }
      if (!isDuplicate) {
        if (hasNativeMap) {
          this._set.set(aStr, idx);
        } else {
          this._set[sStr] = idx;
        }
      }
    };
    
    /**
     * Is the given string a member of this set?
     *
     * @param String aStr
     */
    ArraySet.prototype.has = function ArraySet_has(aStr) {
      if (hasNativeMap) {
        return this._set.has(aStr);
      } else {
        var sStr = util.toSetString(aStr);
        return has.call(this._set, sStr);
      }
    };
    
    /**
     * What is the index of the given string in the array?
     *
     * @param String aStr
     */
    ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
      if (hasNativeMap) {
        var idx = this._set.get(aStr);
        if (idx >= 0) {
            return idx;
        }
      } else {
        var sStr = util.toSetString(aStr);
        if (has.call(this._set, sStr)) {
          return this._set[sStr];
        }
      }
    
      throw new Error('"' + aStr + '" is not in the set.');
    };
    
    /**
     * What is the element at the given index?
     *
     * @param Number aIdx
     */
    ArraySet.prototype.at = function ArraySet_at(aIdx) {
      if (aIdx >= 0 && aIdx < this._array.length) {
        return this._array[aIdx];
      }
      throw new Error('No element indexed by ' + aIdx);
    };
    
    /**
     * Returns the array representation of this set (which has the proper indices
     * indicated by indexOf). Note that this is a copy of the internal array used
     * for storing the members so that no one can mess with internal state.
     */
    ArraySet.prototype.toArray = function ArraySet_toArray() {
      return this._array.slice();
    };
    
    exports.ArraySet = ArraySet;
    
    
    /***/ }),
    /* 51 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    /* -*- Mode: js; js-indent-level: 2; -*- */
    /*
     * Copyright 2014 Mozilla Foundation and contributors
     * Licensed under the New BSD license. See LICENSE or:
     * http://opensource.org/licenses/BSD-3-Clause
     */
    
    var util = __webpack_require__(49);
    
    /**
     * Determine whether mappingB is after mappingA with respect to generated
     * position.
     */
    function generatedPositionAfter(mappingA, mappingB) {
      // Optimized for most common case
      var lineA = mappingA.generatedLine;
      var lineB = mappingB.generatedLine;
      var columnA = mappingA.generatedColumn;
      var columnB = mappingB.generatedColumn;
      return lineB > lineA || lineB == lineA && columnB >= columnA ||
             util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
    }
    
    /**
     * A data structure to provide a sorted view of accumulated mappings in a
     * performance conscious manner. It trades a neglibable overhead in general
     * case for a large speedup in case of mappings being added in order.
     */
    function MappingList() {
      this._array = [];
      this._sorted = true;
      // Serves as infimum
      this._last = {generatedLine: -1, generatedColumn: 0};
    }
    
    /**
     * Iterate through internal items. This method takes the same arguments that
     * `Array.prototype.forEach` takes.
     *
     * NOTE: The order of the mappings is NOT guaranteed.
     */
    MappingList.prototype.unsortedForEach =
      function MappingList_forEach(aCallback, aThisArg) {
        this._array.forEach(aCallback, aThisArg);
      };
    
    /**
     * Add the given source mapping.
     *
     * @param Object aMapping
     */
    MappingList.prototype.add = function MappingList_add(aMapping) {
      if (generatedPositionAfter(this._last, aMapping)) {
        this._last = aMapping;
        this._array.push(aMapping);
      } else {
        this._sorted = false;
        this._array.push(aMapping);
      }
    };
    
    /**
     * Returns the flat, sorted array of mappings. The mappings are sorted by
     * generated position.
     *
     * WARNING: This method returns internal data without copying, for
     * performance. The return value must NOT be mutated, and should be treated as
     * an immutable borrow. If you want to take ownership, you must make your own
     * copy.
     */
    MappingList.prototype.toArray = function MappingList_toArray() {
      if (!this._sorted) {
        this._array.sort(util.compareByGeneratedPositionsInflated);
        this._sorted = true;
      }
      return this._array;
    };
    
    exports.MappingList = MappingList;
    
    
    /***/ }),
    /* 52 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "spec": () => (/* binding */ spec),
    /* harmony export */   "safe": () => (/* binding */ safe)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    
    
    const PLUSSIGN = 0x002B;    // U+002B PLUS SIGN (+)
    const HYPHENMINUS = 0x002D; // U+002D HYPHEN-MINUS (-)
    
    const code = (type, value) => {
        if (type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Delim) {
            type = value;
        }
    
        if (typeof type === 'string') {
            const charCode = type.charCodeAt(0);
            return charCode > 0x7F ? 0x8000 : charCode << 8;
        }
    
        return type;
    };
    
    // https://www.w3.org/TR/css-syntax-3/#serialization
    // The only requirement for serialization is that it must "round-trip" with parsing,
    // that is, parsing the stylesheet must produce the same data structures as parsing,
    // serializing, and parsing again, except for consecutive <whitespace-token>s,
    // which may be collapsed into a single token.
    
    const specPairs = [
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, '-'],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.LeftParenthesis],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, '-'],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, '-'],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, '-'],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC],
    
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        ['#', '-'],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        ['#', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC], // https://github.com/w3c/csswg-drafts/pull/6874
    
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        ['-', '-'],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        ['-', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC], // https://github.com/w3c/csswg-drafts/pull/6874
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, '%'],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC], // https://github.com/w3c/csswg-drafts/pull/6874
    
        ['@', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        ['@', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        ['@', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Url],
        ['@', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.BadUrl],
        ['@', '-'],
        ['@', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC], // https://github.com/w3c/csswg-drafts/pull/6874
    
        ['.', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        ['.', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        ['.', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
    
        ['+', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number],
        ['+', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        ['+', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
    
        ['/', '*']
    ];
    // validate with scripts/generate-safe
    const safePairs = specPairs.concat([
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.LeftParenthesis],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.String],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.AtKeyword, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Colon],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage, '-'],
    
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Percentage],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Hash],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.RightParenthesis, '-']
    ]);
    
    function createMap(pairs) {
        const isWhiteSpaceRequired = new Set(
            pairs.map(([prev, next]) => (code(prev) << 16 | code(next)))
        );
    
        return function(prevCode, type, value) {
            const nextCode = code(type, value);
            const nextCharCode = value.charCodeAt(0);
            const emitWs =
                (nextCharCode === HYPHENMINUS &&
                    type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident &&
                    type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Function &&
                    type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.CDC) ||
                (nextCharCode === PLUSSIGN)
                    ? isWhiteSpaceRequired.has(prevCode << 16 | nextCharCode << 8)
                    : isWhiteSpaceRequired.has(prevCode << 16 | nextCode);
    
            if (emitWs) {
                this.emit(' ', _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.WhiteSpace, true);
            }
    
            return nextCode;
        };
    }
    
    const spec = createMap(specPairs);
    const safe = createMap(safePairs);
    
    
    /***/ }),
    /* 53 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "createConvertor": () => (/* binding */ createConvertor)
    /* harmony export */ });
    /* harmony import */ var _utils_List_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);
    
    
    function createConvertor(walk) {
        return {
            fromPlainObject: function(ast) {
                walk(ast, {
                    enter: function(node) {
                        if (node.children && node.children instanceof _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List === false) {
                            node.children = new _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List().fromArray(node.children);
                        }
                    }
                });
    
                return ast;
            },
            toPlainObject: function(ast) {
                walk(ast, {
                    leave: function(node) {
                        if (node.children && node.children instanceof _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List) {
                            node.children = node.children.toArray();
                        }
                    }
                });
    
                return ast;
            }
        };
    };
    
    
    /***/ }),
    /* 54 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "createWalker": () => (/* binding */ createWalker)
    /* harmony export */ });
    const { hasOwnProperty } = Object.prototype;
    const noop = function() {};
    
    function ensureFunction(value) {
        return typeof value === 'function' ? value : noop;
    }
    
    function invokeForType(fn, type) {
        return function(node, item, list) {
            if (node.type === type) {
                fn.call(this, node, item, list);
            }
        };
    }
    
    function getWalkersFromStructure(name, nodeType) {
        const structure = nodeType.structure;
        const walkers = [];
    
        for (const key in structure) {
            if (hasOwnProperty.call(structure, key) === false) {
                continue;
            }
    
            let fieldTypes = structure[key];
            const walker = {
                name: key,
                type: false,
                nullable: false
            };
    
            if (!Array.isArray(fieldTypes)) {
                fieldTypes = [fieldTypes];
            }
    
            for (const fieldType of fieldTypes) {
                if (fieldType === null) {
                    walker.nullable = true;
                } else if (typeof fieldType === 'string') {
                    walker.type = 'node';
                } else if (Array.isArray(fieldType)) {
                    walker.type = 'list';
                }
            }
    
            if (walker.type) {
                walkers.push(walker);
            }
        }
    
        if (walkers.length) {
            return {
                context: nodeType.walkContext,
                fields: walkers
            };
        }
    
        return null;
    }
    
    function getTypesFromConfig(config) {
        const types = {};
    
        for (const name in config.node) {
            if (hasOwnProperty.call(config.node, name)) {
                const nodeType = config.node[name];
    
                if (!nodeType.structure) {
                    throw new Error('Missed `structure` field in `' + name + '` node type definition');
                }
    
                types[name] = getWalkersFromStructure(name, nodeType);
            }
        }
    
        return types;
    }
    
    function createTypeIterator(config, reverse) {
        const fields = config.fields.slice();
        const contextName = config.context;
        const useContext = typeof contextName === 'string';
    
        if (reverse) {
            fields.reverse();
        }
    
        return function(node, context, walk, walkReducer) {
            let prevContextValue;
    
            if (useContext) {
                prevContextValue = context[contextName];
                context[contextName] = node;
            }
    
            for (const field of fields) {
                const ref = node[field.name];
    
                if (!field.nullable || ref) {
                    if (field.type === 'list') {
                        const breakWalk = reverse
                            ? ref.reduceRight(walkReducer, false)
                            : ref.reduce(walkReducer, false);
    
                        if (breakWalk) {
                            return true;
                        }
                    } else if (walk(ref)) {
                        return true;
                    }
                }
            }
    
            if (useContext) {
                context[contextName] = prevContextValue;
            }
        };
    }
    
    function createFastTraveralMap({
        StyleSheet,
        Atrule,
        Rule,
        Block,
        DeclarationList
    }) {
        return {
            Atrule: {
                StyleSheet,
                Atrule,
                Rule,
                Block
            },
            Rule: {
                StyleSheet,
                Atrule,
                Rule,
                Block
            },
            Declaration: {
                StyleSheet,
                Atrule,
                Rule,
                Block,
                DeclarationList
            }
        };
    }
    
    function createWalker(config) {
        const types = getTypesFromConfig(config);
        const iteratorsNatural = {};
        const iteratorsReverse = {};
        const breakWalk = Symbol('break-walk');
        const skipNode = Symbol('skip-node');
    
        for (const name in types) {
            if (hasOwnProperty.call(types, name) && types[name] !== null) {
                iteratorsNatural[name] = createTypeIterator(types[name], false);
                iteratorsReverse[name] = createTypeIterator(types[name], true);
            }
        }
    
        const fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
        const fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);
    
        const walk = function(root, options) {
            function walkNode(node, item, list) {
                const enterRet = enter.call(context, node, item, list);
    
                if (enterRet === breakWalk) {
                    return true;
                }
    
                if (enterRet === skipNode) {
                    return false;
                }
    
                if (iterators.hasOwnProperty(node.type)) {
                    if (iterators[node.type](node, context, walkNode, walkReducer)) {
                        return true;
                    }
                }
    
                if (leave.call(context, node, item, list) === breakWalk) {
                    return true;
                }
    
                return false;
            }
    
            let enter = noop;
            let leave = noop;
            let iterators = iteratorsNatural;
            let walkReducer = (ret, data, item, list) => ret || walkNode(data, item, list);
            const context = {
                break: breakWalk,
                skip: skipNode,
    
                root,
                stylesheet: null,
                atrule: null,
                atrulePrelude: null,
                rule: null,
                selector: null,
                block: null,
                declaration: null,
                function: null
            };
    
            if (typeof options === 'function') {
                enter = options;
            } else if (options) {
                enter = ensureFunction(options.enter);
                leave = ensureFunction(options.leave);
    
                if (options.reverse) {
                    iterators = iteratorsReverse;
                }
    
                if (options.visit) {
                    if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
                        iterators = options.reverse
                            ? fastTraversalIteratorsReverse[options.visit]
                            : fastTraversalIteratorsNatural[options.visit];
                    } else if (!types.hasOwnProperty(options.visit)) {
                        throw new Error('Bad value `' + options.visit + '` for `visit` option (should be: ' + Object.keys(types).sort().join(', ') + ')');
                    }
    
                    enter = invokeForType(enter, options.visit);
                    leave = invokeForType(leave, options.visit);
                }
            }
    
            if (enter === noop && leave === noop) {
                throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
            }
    
            walkNode(root);
        };
    
        walk.break = breakWalk;
        walk.skip = skipNode;
    
        walk.find = function(ast, fn) {
            let found = null;
    
            walk(ast, function(node, item, list) {
                if (fn.call(this, node, item, list)) {
                    found = node;
                    return breakWalk;
                }
            });
    
            return found;
        };
    
        walk.findLast = function(ast, fn) {
            let found = null;
    
            walk(ast, {
                reverse: true,
                enter: function(node, item, list) {
                    if (fn.call(this, node, item, list)) {
                        found = node;
                        return breakWalk;
                    }
                }
            });
    
            return found;
        };
    
        walk.findAll = function(ast, fn) {
            const found = [];
    
            walk(ast, function(node, item, list) {
                if (fn.call(this, node, item, list)) {
                    found.push(node);
                }
            });
    
            return found;
        };
    
        return walk;
    };
    
    
    /***/ }),
    /* 55 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "Lexer": () => (/* binding */ Lexer)
    /* harmony export */ });
    /* harmony import */ var _error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56);
    /* harmony import */ var _utils_names_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(58);
    /* harmony import */ var _generic_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59);
    /* harmony import */ var _definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62);
    /* harmony import */ var _prepare_tokens_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(67);
    /* harmony import */ var _match_graph_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(68);
    /* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(69);
    /* harmony import */ var _trace_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(70);
    /* harmony import */ var _search_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(71);
    /* harmony import */ var _structure_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(72);
    
    
    
    
    
    
    
    
    
    
    
    const cssWideKeywords = (0,_match_graph_js__WEBPACK_IMPORTED_MODULE_5__.buildMatchGraph)('inherit | initial | unset');
    const cssWideKeywordsWithExpression = (0,_match_graph_js__WEBPACK_IMPORTED_MODULE_5__.buildMatchGraph)('inherit | initial | unset | <-ms-legacy-expression>');
    
    function dumpMapSyntax(map, compact, syntaxAsAst) {
        const result = {};
    
        for (const name in map) {
            if (map[name].syntax) {
                result[name] = syntaxAsAst
                    ? map[name].syntax
                    : (0,_definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_3__.generate)(map[name].syntax, { compact });
            }
        }
    
        return result;
    }
    
    function dumpAtruleMapSyntax(map, compact, syntaxAsAst) {
        const result = {};
    
        for (const [name, atrule] of Object.entries(map)) {
            result[name] = {
                prelude: atrule.prelude && (
                    syntaxAsAst
                        ? atrule.prelude.syntax
                        : (0,_definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_3__.generate)(atrule.prelude.syntax, { compact })
                ),
                descriptors: atrule.descriptors && dumpMapSyntax(atrule.descriptors, compact, syntaxAsAst)
            };
        }
    
        return result;
    }
    
    function valueHasVar(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].value.toLowerCase() === 'var(') {
                return true;
            }
        }
    
        return false;
    }
    
    function buildMatchResult(matched, error, iterations) {
        return {
            matched,
            iterations,
            error,
            ..._trace_js__WEBPACK_IMPORTED_MODULE_7__
        };
    }
    
    function matchSyntax(lexer, syntax, value, useCommon) {
        const tokens = (0,_prepare_tokens_js__WEBPACK_IMPORTED_MODULE_4__["default"])(value, lexer.syntax);
        let result;
    
        if (valueHasVar(tokens)) {
            return buildMatchResult(null, new Error('Matching for a tree with var() is not supported'));
        }
    
        if (useCommon) {
            result = (0,_match_js__WEBPACK_IMPORTED_MODULE_6__.matchAsTree)(tokens, lexer.valueCommonSyntax, lexer);
        }
    
        if (!useCommon || !result.match) {
            result = (0,_match_js__WEBPACK_IMPORTED_MODULE_6__.matchAsTree)(tokens, syntax.match, lexer);
            if (!result.match) {
                return buildMatchResult(
                    null,
                    new _error_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxMatchError(result.reason, syntax.syntax, value, result),
                    result.iterations
                );
            }
        }
    
        return buildMatchResult(result.match, null, result.iterations);
    }
    
    class Lexer {
        constructor(config, syntax, structure) {
            this.valueCommonSyntax = cssWideKeywords;
            this.syntax = syntax;
            this.generic = false;
            this.atrules = Object.create(null);
            this.properties = Object.create(null);
            this.types = Object.create(null);
            this.structure = structure || (0,_structure_js__WEBPACK_IMPORTED_MODULE_9__.getStructureFromConfig)(config);
    
            if (config) {
                if (config.types) {
                    for (const name in config.types) {
                        this.addType_(name, config.types[name]);
                    }
                }
    
                if (config.generic) {
                    this.generic = true;
                    for (const name in _generic_js__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                        this.addType_(name, _generic_js__WEBPACK_IMPORTED_MODULE_2__["default"][name]);
                    }
                }
    
                if (config.atrules) {
                    for (const name in config.atrules) {
                        this.addAtrule_(name, config.atrules[name]);
                    }
                }
    
                if (config.properties) {
                    for (const name in config.properties) {
                        this.addProperty_(name, config.properties[name]);
                    }
                }
            }
        }
    
        checkStructure(ast) {
            function collectWarning(node, message) {
                warns.push({ node, message });
            }
    
            const structure = this.structure;
            const warns = [];
    
            this.syntax.walk(ast, function(node) {
                if (structure.hasOwnProperty(node.type)) {
                    structure[node.type].check(node, collectWarning);
                } else {
                    collectWarning(node, 'Unknown node type `' + node.type + '`');
                }
            });
    
            return warns.length ? warns : false;
        }
    
        createDescriptor(syntax, type, name, parent = null) {
            const ref = {
                type,
                name
            };
            const descriptor = {
                type,
                name,
                parent,
                serializable: typeof syntax === 'string' || (syntax && typeof syntax.type === 'string'),
                syntax: null,
                match: null
            };
    
            if (typeof syntax === 'function') {
                descriptor.match = (0,_match_graph_js__WEBPACK_IMPORTED_MODULE_5__.buildMatchGraph)(syntax, ref);
            } else {
                if (typeof syntax === 'string') {
                    // lazy parsing on first access
                    Object.defineProperty(descriptor, 'syntax', {
                        get() {
                            Object.defineProperty(descriptor, 'syntax', {
                                value: (0,_definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_3__.parse)(syntax)
                            });
    
                            return descriptor.syntax;
                        }
                    });
                } else {
                    descriptor.syntax = syntax;
                }
    
                // lazy graph build on first access
                Object.defineProperty(descriptor, 'match', {
                    get() {
                        Object.defineProperty(descriptor, 'match', {
                            value: (0,_match_graph_js__WEBPACK_IMPORTED_MODULE_5__.buildMatchGraph)(descriptor.syntax, ref)
                        });
    
                        return descriptor.match;
                    }
                });
            }
    
            return descriptor;
        }
        addAtrule_(name, syntax) {
            if (!syntax) {
                return;
            }
    
            this.atrules[name] = {
                type: 'Atrule',
                name: name,
                prelude: syntax.prelude ? this.createDescriptor(syntax.prelude, 'AtrulePrelude', name) : null,
                descriptors: syntax.descriptors
                    ? Object.keys(syntax.descriptors).reduce(
                        (map, descName) => {
                            map[descName] = this.createDescriptor(syntax.descriptors[descName], 'AtruleDescriptor', descName, name);
                            return map;
                        },
                        Object.create(null)
                    )
                    : null
            };
        }
        addProperty_(name, syntax) {
            if (!syntax) {
                return;
            }
    
            this.properties[name] = this.createDescriptor(syntax, 'Property', name);
        }
        addType_(name, syntax) {
            if (!syntax) {
                return;
            }
    
            this.types[name] = this.createDescriptor(syntax, 'Type', name);
    
            if (syntax === _generic_js__WEBPACK_IMPORTED_MODULE_2__["default"]["-ms-legacy-expression"]) {
                this.valueCommonSyntax = cssWideKeywordsWithExpression;
            }
        }
    
        checkAtruleName(atruleName) {
            if (!this.getAtrule(atruleName)) {
                return new _error_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxReferenceError('Unknown at-rule', '@' + atruleName);
            }
        }
        checkAtrulePrelude(atruleName, prelude) {
            const error = this.checkAtruleName(atruleName);
    
            if (error) {
                return error;
            }
    
            const atrule = this.getAtrule(atruleName);
    
            if (!atrule.prelude && prelude) {
                return new SyntaxError('At-rule `@' + atruleName + '` should not contain a prelude');
            }
    
            if (atrule.prelude && !prelude) {
                return new SyntaxError('At-rule `@' + atruleName + '` should contain a prelude');
            }
        }
        checkAtruleDescriptorName(atruleName, descriptorName) {
            const error = this.checkAtruleName(atruleName);
    
            if (error) {
                return error;
            }
    
            const atrule = this.getAtrule(atruleName);
            const descriptor = _utils_names_js__WEBPACK_IMPORTED_MODULE_1__.keyword(descriptorName);
    
            if (!atrule.descriptors) {
                return new SyntaxError('At-rule `@' + atruleName + '` has no known descriptors');
            }
    
            if (!atrule.descriptors[descriptor.name] &&
                !atrule.descriptors[descriptor.basename]) {
                return new _error_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxReferenceError('Unknown at-rule descriptor', descriptorName);
            }
        }
        checkPropertyName(propertyName) {
            if (!this.getProperty(propertyName)) {
                return new _error_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxReferenceError('Unknown property', propertyName);
            }
        }
    
        matchAtrulePrelude(atruleName, prelude) {
            const error = this.checkAtrulePrelude(atruleName, prelude);
    
            if (error) {
                return buildMatchResult(null, error);
            }
    
            if (!prelude) {
                return buildMatchResult(null, null);
            }
    
            return matchSyntax(this, this.getAtrule(atruleName).prelude, prelude, false);
        }
        matchAtruleDescriptor(atruleName, descriptorName, value) {
            const error = this.checkAtruleDescriptorName(atruleName, descriptorName);
    
            if (error) {
                return buildMatchResult(null, error);
            }
    
            const atrule = this.getAtrule(atruleName);
            const descriptor = _utils_names_js__WEBPACK_IMPORTED_MODULE_1__.keyword(descriptorName);
    
            return matchSyntax(this, atrule.descriptors[descriptor.name] || atrule.descriptors[descriptor.basename], value, false);
        }
        matchDeclaration(node) {
            if (node.type !== 'Declaration') {
                return buildMatchResult(null, new Error('Not a Declaration node'));
            }
    
            return this.matchProperty(node.property, node.value);
        }
        matchProperty(propertyName, value) {
            // don't match syntax for a custom property at the moment
            if (_utils_names_js__WEBPACK_IMPORTED_MODULE_1__.property(propertyName).custom) {
                return buildMatchResult(null, new Error('Lexer matching doesn\'t applicable for custom properties'));
            }
    
            const error = this.checkPropertyName(propertyName);
    
            if (error) {
                return buildMatchResult(null, error);
            }
    
            return matchSyntax(this, this.getProperty(propertyName), value, true);
        }
        matchType(typeName, value) {
            const typeSyntax = this.getType(typeName);
    
            if (!typeSyntax) {
                return buildMatchResult(null, new _error_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxReferenceError('Unknown type', typeName));
            }
    
            return matchSyntax(this, typeSyntax, value, false);
        }
        match(syntax, value) {
            if (typeof syntax !== 'string' && (!syntax || !syntax.type)) {
                return buildMatchResult(null, new _error_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxReferenceError('Bad syntax'));
            }
    
            if (typeof syntax === 'string' || !syntax.match) {
                syntax = this.createDescriptor(syntax, 'Type', 'anonymous');
            }
    
            return matchSyntax(this, syntax, value, false);
        }
    
        findValueFragments(propertyName, value, type, name) {
            return (0,_search_js__WEBPACK_IMPORTED_MODULE_8__.matchFragments)(this, value, this.matchProperty(propertyName, value), type, name);
        }
        findDeclarationValueFragments(declaration, type, name) {
            return (0,_search_js__WEBPACK_IMPORTED_MODULE_8__.matchFragments)(this, declaration.value, this.matchDeclaration(declaration), type, name);
        }
        findAllFragments(ast, type, name) {
            const result = [];
    
            this.syntax.walk(ast, {
                visit: 'Declaration',
                enter: (declaration) => {
                    result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
                }
            });
    
            return result;
        }
    
        getAtrule(atruleName, fallbackBasename = true) {
            const atrule = _utils_names_js__WEBPACK_IMPORTED_MODULE_1__.keyword(atruleName);
            const atruleEntry = atrule.vendor && fallbackBasename
                ? this.atrules[atrule.name] || this.atrules[atrule.basename]
                : this.atrules[atrule.name];
    
            return atruleEntry || null;
        }
        getAtrulePrelude(atruleName, fallbackBasename = true) {
            const atrule = this.getAtrule(atruleName, fallbackBasename);
    
            return atrule && atrule.prelude || null;
        }
        getAtruleDescriptor(atruleName, name) {
            return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators
                ? this.atrules[atruleName].declarators[name] || null
                : null;
        }
        getProperty(propertyName, fallbackBasename = true) {
            const property = _utils_names_js__WEBPACK_IMPORTED_MODULE_1__.property(propertyName);
            const propertyEntry = property.vendor && fallbackBasename
                ? this.properties[property.name] || this.properties[property.basename]
                : this.properties[property.name];
    
            return propertyEntry || null;
        }
        getType(name) {
            return hasOwnProperty.call(this.types, name) ? this.types[name] : null;
        }
    
        validate() {
            function validate(syntax, name, broken, descriptor) {
                if (broken.has(name)) {
                    return broken.get(name);
                }
    
                broken.set(name, false);
                if (descriptor.syntax !== null) {
                    (0,_definition_syntax_index_js__WEBPACK_IMPORTED_MODULE_3__.walk)(descriptor.syntax, function(node) {
                        if (node.type !== 'Type' && node.type !== 'Property') {
                            return;
                        }
    
                        const map = node.type === 'Type' ? syntax.types : syntax.properties;
                        const brokenMap = node.type === 'Type' ? brokenTypes : brokenProperties;
    
                        if (!hasOwnProperty.call(map, node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
                            broken.set(name, true);
                        }
                    }, this);
                }
            }
    
            let brokenTypes = new Map();
            let brokenProperties = new Map();
    
            for (const key in this.types) {
                validate(this, key, brokenTypes, this.types[key]);
            }
    
            for (const key in this.properties) {
                validate(this, key, brokenProperties, this.properties[key]);
            }
    
            brokenTypes = [...brokenTypes.keys()].filter(name => brokenTypes.get(name));
            brokenProperties = [...brokenProperties.keys()].filter(name => brokenProperties.get(name));
    
            if (brokenTypes.length || brokenProperties.length) {
                return {
                    types: brokenTypes,
                    properties: brokenProperties
                };
            }
    
            return null;
        }
        dump(syntaxAsAst, pretty) {
            return {
                generic: this.generic,
                types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
                properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst),
                atrules: dumpAtruleMapSyntax(this.atrules, !pretty, syntaxAsAst)
            };
        }
        toString() {
            return JSON.stringify(this.dump());
        }
    };
    
    
    /***/ }),
    /* 56 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "SyntaxReferenceError": () => (/* binding */ SyntaxReferenceError),
    /* harmony export */   "SyntaxMatchError": () => (/* binding */ SyntaxMatchError)
    /* harmony export */ });
    /* harmony import */ var _utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42);
    /* harmony import */ var _definition_syntax_generate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57);
    
    
    
    const defaultLoc = { offset: 0, line: 1, column: 1 };
    
    function locateMismatch(matchResult, node) {
        const tokens = matchResult.tokens;
        const longestMatch = matchResult.longestMatch;
        const mismatchNode = longestMatch < tokens.length ? tokens[longestMatch].node || null : null;
        const badNode = mismatchNode !== node ? mismatchNode : null;
        let mismatchOffset = 0;
        let mismatchLength = 0;
        let entries = 0;
        let css = '';
        let start;
        let end;
    
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i].value;
    
            if (i === longestMatch) {
                mismatchLength = token.length;
                mismatchOffset = css.length;
            }
    
            if (badNode !== null && tokens[i].node === badNode) {
                if (i <= longestMatch) {
                    entries++;
                } else {
                    entries = 0;
                }
            }
    
            css += token;
        }
    
        if (longestMatch === tokens.length || entries > 1) { // last
            start = fromLoc(badNode || node, 'end') || buildLoc(defaultLoc, css);
            end = buildLoc(start);
        } else {
            start = fromLoc(badNode, 'start') ||
                buildLoc(fromLoc(node, 'start') || defaultLoc, css.slice(0, mismatchOffset));
            end = fromLoc(badNode, 'end') ||
                buildLoc(start, css.substr(mismatchOffset, mismatchLength));
        }
    
        return {
            css,
            mismatchOffset,
            mismatchLength,
            start,
            end
        };
    }
    
    function fromLoc(node, point) {
        const value = node && node.loc && node.loc[point];
    
        if (value) {
            return 'line' in value ? buildLoc(value) : value;
        }
    
        return null;
    }
    
    function buildLoc({ offset, line, column }, extra) {
        const loc = {
            offset,
            line,
            column
        };
    
        if (extra) {
            const lines = extra.split(/\n|\r\n?|\f/);
    
            loc.offset += extra.length;
            loc.line += lines.length - 1;
            loc.column = lines.length === 1 ? loc.column + extra.length : lines.pop().length + 1;
        }
    
        return loc;
    }
    
    const SyntaxReferenceError = function(type, referenceName) {
        const error = (0,_utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__.createCustomError)(
            'SyntaxReferenceError',
            type + (referenceName ? ' `' + referenceName + '`' : '')
        );
    
        error.reference = referenceName;
    
        return error;
    };
    
    const SyntaxMatchError = function(message, syntax, node, matchResult) {
        const error = (0,_utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__.createCustomError)('SyntaxMatchError', message);
        const {
            css,
            mismatchOffset,
            mismatchLength,
            start,
            end
        } = locateMismatch(matchResult, node);
    
        error.rawMessage = message;
        error.syntax = syntax ? (0,_definition_syntax_generate_js__WEBPACK_IMPORTED_MODULE_1__.generate)(syntax) : '<generic>';
        error.css = css;
        error.mismatchOffset = mismatchOffset;
        error.mismatchLength = mismatchLength;
        error.message = message + '\n' +
            '  syntax: ' + error.syntax + '\n' +
            '   value: ' + (css || '<empty string>') + '\n' +
            '  --------' + new Array(error.mismatchOffset + 1).join('-') + '^';
    
        Object.assign(error, start);
        error.loc = {
            source: (node && node.loc && node.loc.source) || '<unknown>',
            start,
            end
        };
    
        return error;
    };
    
    
    /***/ }),
    /* 57 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "generate": () => (/* binding */ generate)
    /* harmony export */ });
    function noop(value) {
        return value;
    }
    
    function generateMultiplier(multiplier) {
        const { min, max, comma } = multiplier;
    
        if (min === 0 && max === 0) {
            return '*';
        }
    
        if (min === 0 && max === 1) {
            return '?';
        }
    
        if (min === 1 && max === 0) {
            return comma ? '#' : '+';
        }
    
        if (min === 1 && max === 1) {
            return '';
        }
    
        return (
            (comma ? '#' : '') +
            (min === max
                ? '{' + min + '}'
                : '{' + min + ',' + (max !== 0 ? max : '') + '}'
            )
        );
    }
    
    function generateTypeOpts(node) {
        switch (node.type) {
            case 'Range':
                return (
                    ' [' +
                    (node.min === null ? '-âˆž' : node.min) +
                    ',' +
                    (node.max === null ? 'âˆž' : node.max) +
                    ']'
                );
    
            default:
                throw new Error('Unknown node type `' + node.type + '`');
        }
    }
    
    function generateSequence(node, decorate, forceBraces, compact) {
        const combinator = node.combinator === ' ' || compact ? node.combinator : ' ' + node.combinator + ' ';
        const result = node.terms
            .map(term => internalGenerate(term, decorate, forceBraces, compact))
            .join(combinator);
    
        if (node.explicit || forceBraces) {
            return (compact || result[0] === ',' ? '[' : '[ ') + result + (compact ? ']' : ' ]');
        }
    
        return result;
    }
    
    function internalGenerate(node, decorate, forceBraces, compact) {
        let result;
    
        switch (node.type) {
            case 'Group':
                result =
                    generateSequence(node, decorate, forceBraces, compact) +
                    (node.disallowEmpty ? '!' : '');
                break;
    
            case 'Multiplier':
                // return since node is a composition
                return (
                    internalGenerate(node.term, decorate, forceBraces, compact) +
                    decorate(generateMultiplier(node), node)
                );
    
            case 'Type':
                result = '<' + node.name + (node.opts ? decorate(generateTypeOpts(node.opts), node.opts) : '') + '>';
                break;
    
            case 'Property':
                result = '<\'' + node.name + '\'>';
                break;
    
            case 'Keyword':
                result = node.name;
                break;
    
            case 'AtKeyword':
                result = '@' + node.name;
                break;
    
            case 'Function':
                result = node.name + '(';
                break;
    
            case 'String':
            case 'Token':
                result = node.value;
                break;
    
            case 'Comma':
                result = ',';
                break;
    
            default:
                throw new Error('Unknown node type `' + node.type + '`');
        }
    
        return decorate(result, node);
    }
    
    function generate(node, options) {
        let decorate = noop;
        let forceBraces = false;
        let compact = false;
    
        if (typeof options === 'function') {
            decorate = options;
        } else if (options) {
            forceBraces = Boolean(options.forceBraces);
            compact = Boolean(options.compact);
            if (typeof options.decorate === 'function') {
                decorate = options.decorate;
            }
        }
    
        return internalGenerate(node, decorate, forceBraces, compact);
    };
    
    
    /***/ }),
    /* 58 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "keyword": () => (/* binding */ keyword),
    /* harmony export */   "property": () => (/* binding */ property),
    /* harmony export */   "vendorPrefix": () => (/* binding */ vendorPrefix),
    /* harmony export */   "isCustomProperty": () => (/* binding */ isCustomProperty)
    /* harmony export */ });
    const keywords = new Map();
    const properties = new Map();
    const HYPHENMINUS = 45; // '-'.charCodeAt()
    
    const keyword = getKeywordDescriptor;
    const property = getPropertyDescriptor;
    const vendorPrefix = getVendorPrefix;
    function isCustomProperty(str, offset) {
        offset = offset || 0;
    
        return str.length - offset >= 2 &&
               str.charCodeAt(offset) === HYPHENMINUS &&
               str.charCodeAt(offset + 1) === HYPHENMINUS;
    }
    
    function getVendorPrefix(str, offset) {
        offset = offset || 0;
    
        // verdor prefix should be at least 3 chars length
        if (str.length - offset >= 3) {
            // vendor prefix starts with hyper minus following non-hyper minus
            if (str.charCodeAt(offset) === HYPHENMINUS &&
                str.charCodeAt(offset + 1) !== HYPHENMINUS) {
                // vendor prefix should contain a hyper minus at the ending
                const secondDashIndex = str.indexOf('-', offset + 2);
    
                if (secondDashIndex !== -1) {
                    return str.substring(offset, secondDashIndex + 1);
                }
            }
        }
    
        return '';
    }
    
    function getKeywordDescriptor(keyword) {
        if (keywords.has(keyword)) {
            return keywords.get(keyword);
        }
    
        const name = keyword.toLowerCase();
        let descriptor = keywords.get(name);
    
        if (descriptor === undefined) {
            const custom = isCustomProperty(name, 0);
            const vendor = !custom ? getVendorPrefix(name, 0) : '';
            descriptor = Object.freeze({
                basename: name.substr(vendor.length),
                name,
                prefix: vendor,
                vendor,
                custom
            });
        }
    
        keywords.set(keyword, descriptor);
    
        return descriptor;
    }
    
    function getPropertyDescriptor(property) {
        if (properties.has(property)) {
            return properties.get(property);
        }
    
        let name = property;
        let hack = property[0];
    
        if (hack === '/') {
            hack = property[1] === '/' ? '//' : '/';
        } else if (hack !== '_' &&
                   hack !== '*' &&
                   hack !== '$' &&
                   hack !== '#' &&
                   hack !== '+' &&
                   hack !== '&') {
            hack = '';
        }
    
        const custom = isCustomProperty(name, hack.length);
    
        // re-use result when possible (the same as for lower case)
        if (!custom) {
            name = name.toLowerCase();
            if (properties.has(name)) {
                const descriptor = properties.get(name);
                properties.set(property, descriptor);
                return descriptor;
            }
        }
    
        const vendor = !custom ? getVendorPrefix(name, hack.length) : '';
        const prefix = name.substr(0, hack.length + vendor.length);
        const descriptor = Object.freeze({
            basename: name.substr(prefix.length),
            name: name.substr(hack.length),
            hack,
            vendor,
            prefix,
            custom
        });
    
        properties.set(property, descriptor);
    
        return descriptor;
    }
    
    
    /***/ }),
    /* 59 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _generic_an_plus_b_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
    /* harmony import */ var _generic_urange_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61);
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(31);
    
    
    
    
    const cssWideKeywords = ['unset', 'initial', 'inherit'];
    const calcFunctionNames = ['calc(', '-moz-calc(', '-webkit-calc('];
    const balancePair = new Map([
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightParenthesis],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftParenthesis, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightParenthesis],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftSquareBracket, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightSquareBracket],
        [_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftCurlyBracket, _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightCurlyBracket]
    ]);
    
    // units
    const LENGTH = [                              // https://www.w3.org/TR/css-values-3/#lengths
        'px', 'mm', 'cm', 'in', 'pt', 'pc', 'q',  // absolute length units
        'em', 'ex', 'ch', 'rem',                  // relative length units
        'vh', 'vw', 'vmin', 'vmax', 'vm'          // viewport-percentage lengths
    ];
    const ANGLE = ['deg', 'grad', 'rad', 'turn']; // https://www.w3.org/TR/css-values-3/#angles
    const TIME = ['s', 'ms'];                     // https://www.w3.org/TR/css-values-3/#time
    const FREQUENCY = ['hz', 'khz'];              // https://www.w3.org/TR/css-values-3/#frequency
    const RESOLUTION = ['dpi', 'dpcm', 'dppx', 'x']; // https://www.w3.org/TR/css-values-3/#resolution
    const FLEX = ['fr'];                          // https://drafts.csswg.org/css-grid/#fr-unit
    const DECIBEL = ['db'];                       // https://www.w3.org/TR/css3-speech/#mixing-props-voice-volume
    const SEMITONES = ['st'];                     // https://www.w3.org/TR/css3-speech/#voice-props-voice-pitch
    
    // safe char code getter
    function charCodeAt(str, index) {
        return index < str.length ? str.charCodeAt(index) : 0;
    }
    
    function eqStr(actual, expected) {
        return (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.cmpStr)(actual, 0, actual.length, expected);
    }
    
    function eqStrAny(actual, expected) {
        for (let i = 0; i < expected.length; i++) {
            if (eqStr(actual, expected[i])) {
                return true;
            }
        }
    
        return false;
    }
    
    // IE postfix hack, i.e. 123\0 or 123px\9
    function isPostfixIeHack(str, offset) {
        if (offset !== str.length - 2) {
            return false;
        }
    
        return (
            charCodeAt(str, offset) === 0x005C &&  // U+005C REVERSE SOLIDUS (\)
            (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.isDigit)(charCodeAt(str, offset + 1))
        );
    }
    
    function outOfRange(opts, value, numEnd) {
        if (opts && opts.type === 'Range') {
            const num = Number(
                numEnd !== undefined && numEnd !== value.length
                    ? value.substr(0, numEnd)
                    : value
            );
    
            if (isNaN(num)) {
                return true;
            }
    
            if (opts.min !== null && num < opts.min) {
                return true;
            }
    
            if (opts.max !== null && num > opts.max) {
                return true;
            }
        }
    
        return false;
    }
    
    function consumeFunction(token, getNextToken) {
        let balanceCloseType = 0;
        let balanceStash = [];
        let length = 0;
    
        // balanced token consuming
        scan:
        do {
            switch (token.type) {
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightCurlyBracket:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightParenthesis:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightSquareBracket:
                    if (token.type !== balanceCloseType) {
                        break scan;
                    }
    
                    balanceCloseType = balanceStash.pop();
    
                    if (balanceStash.length === 0) {
                        length++;
                        break scan;
                    }
    
                    break;
    
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftParenthesis:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftSquareBracket:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftCurlyBracket:
                    balanceStash.push(balanceCloseType);
                    balanceCloseType = balancePair.get(token.type);
                    break;
            }
    
            length++;
        } while (token = getNextToken(length));
    
        return length;
    }
    
    // TODO: implement
    // can be used wherever <length>, <frequency>, <angle>, <time>, <percentage>, <number>, or <integer> values are allowed
    // https://drafts.csswg.org/css-values/#calc-notation
    function calc(next) {
        return function(token, getNextToken, opts) {
            if (token === null) {
                return 0;
            }
    
            if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function && eqStrAny(token.value, calcFunctionNames)) {
                return consumeFunction(token, getNextToken);
            }
    
            return next(token, getNextToken, opts);
        };
    }
    
    function tokenType(expectedTokenType) {
        return function(token) {
            if (token === null || token.type !== expectedTokenType) {
                return 0;
            }
    
            return 1;
        };
    }
    
    function func(name) {
        name = name + '(';
    
        return function(token, getNextToken) {
            if (token !== null && eqStr(token.value, name)) {
                return consumeFunction(token, getNextToken);
            }
    
            return 0;
        };
    }
    
    // =========================
    // Complex types
    //
    
    // https://drafts.csswg.org/css-values-4/#custom-idents
    // 4.2. Author-defined Identifiers: the <custom-ident> type
    // Some properties accept arbitrary author-defined identifiers as a component value.
    // This generic data type is denoted by <custom-ident>, and represents any valid CSS identifier
    // that would not be misinterpreted as a pre-defined keyword in that propertyâ€™s value definition.
    //
    // See also: https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident
    function customIdent(token) {
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Ident) {
            return 0;
        }
    
        const name = token.value.toLowerCase();
    
        // The CSS-wide keywords are not valid <custom-ident>s
        if (eqStrAny(name, cssWideKeywords)) {
            return 0;
        }
    
        // The default keyword is reserved and is also not a valid <custom-ident>
        if (eqStr(name, 'default')) {
            return 0;
        }
    
        // TODO: ignore property specific keywords (as described https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)
        // Specifications using <custom-ident> must specify clearly what other keywords
        // are excluded from <custom-ident>, if anyâ€”for example by saying that any pre-defined keywords
        // in that propertyâ€™s value definition are excluded. Excluded keywords are excluded
        // in all ASCII case permutations.
    
        return 1;
    }
    
    // https://drafts.csswg.org/css-variables/#typedef-custom-property-name
    // A custom property is any property whose name starts with two dashes (U+002D HYPHEN-MINUS), like --foo.
    // The <custom-property-name> production corresponds to this: itâ€™s defined as any valid identifier
    // that starts with two dashes, except -- itself, which is reserved for future use by CSS.
    // NOTE: Current implementation treat `--` as a valid name since most (all?) major browsers treat it as valid.
    function customPropertyName(token) {
        // ... defined as any valid identifier
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Ident) {
            return 0;
        }
    
        // ... that starts with two dashes (U+002D HYPHEN-MINUS)
        if (charCodeAt(token.value, 0) !== 0x002D || charCodeAt(token.value, 1) !== 0x002D) {
            return 0;
        }
    
        return 1;
    }
    
    // https://drafts.csswg.org/css-color-4/#hex-notation
    // The syntax of a <hex-color> is a <hash-token> token whose value consists of 3, 4, 6, or 8 hexadecimal digits.
    // In other words, a hex color is written as a hash character, "#", followed by some number of digits 0-9 or
    // letters a-f (the case of the letters doesnâ€™t matter - #00ff00 is identical to #00FF00).
    function hexColor(token) {
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Hash) {
            return 0;
        }
    
        const length = token.value.length;
    
        // valid values (length): #rgb (4), #rgba (5), #rrggbb (7), #rrggbbaa (9)
        if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
            return 0;
        }
    
        for (let i = 1; i < length; i++) {
            if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.isHexDigit)(charCodeAt(token.value, i))) {
                return 0;
            }
        }
    
        return 1;
    }
    
    function idSelector(token) {
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Hash) {
            return 0;
        }
    
        if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.isIdentifierStart)(charCodeAt(token.value, 1), charCodeAt(token.value, 2), charCodeAt(token.value, 3))) {
            return 0;
        }
    
        return 1;
    }
    
    // https://drafts.csswg.org/css-syntax/#any-value
    // It represents the entirety of what a valid declaration can have as its value.
    function declarationValue(token, getNextToken) {
        if (!token) {
            return 0;
        }
    
        let balanceCloseType = 0;
        let balanceStash = [];
        let length = 0;
    
        // The <declaration-value> production matches any sequence of one or more tokens,
        // so long as the sequence does not contain ...
        scan:
        do {
            switch (token.type) {
                // ... <bad-string-token>, <bad-url-token>,
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.BadString:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.BadUrl:
                    break scan;
    
                // ... unmatched <)-token>, <]-token>, or <}-token>,
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightCurlyBracket:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightParenthesis:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightSquareBracket:
                    if (token.type !== balanceCloseType) {
                        break scan;
                    }
    
                    balanceCloseType = balanceStash.pop();
                    break;
    
                // ... or top-level <semicolon-token> tokens
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Semicolon:
                    if (balanceCloseType === 0) {
                        break scan;
                    }
    
                    break;
    
                // ... or <delim-token> tokens with a value of "!"
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Delim:
                    if (balanceCloseType === 0 && token.value === '!') {
                        break scan;
                    }
    
                    break;
    
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftParenthesis:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftSquareBracket:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftCurlyBracket:
                    balanceStash.push(balanceCloseType);
                    balanceCloseType = balancePair.get(token.type);
                    break;
            }
    
            length++;
        } while (token = getNextToken(length));
    
        return length;
    }
    
    // https://drafts.csswg.org/css-syntax/#any-value
    // The <any-value> production is identical to <declaration-value>, but also
    // allows top-level <semicolon-token> tokens and <delim-token> tokens
    // with a value of "!". It represents the entirety of what valid CSS can be in any context.
    function anyValue(token, getNextToken) {
        if (!token) {
            return 0;
        }
    
        let balanceCloseType = 0;
        let balanceStash = [];
        let length = 0;
    
        // The <any-value> production matches any sequence of one or more tokens,
        // so long as the sequence ...
        scan:
        do {
            switch (token.type) {
                // ... does not contain <bad-string-token>, <bad-url-token>,
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.BadString:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.BadUrl:
                    break scan;
    
                // ... unmatched <)-token>, <]-token>, or <}-token>,
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightCurlyBracket:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightParenthesis:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightSquareBracket:
                    if (token.type !== balanceCloseType) {
                        break scan;
                    }
    
                    balanceCloseType = balanceStash.pop();
                    break;
    
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftParenthesis:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftSquareBracket:
                case _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftCurlyBracket:
                    balanceStash.push(balanceCloseType);
                    balanceCloseType = balancePair.get(token.type);
                    break;
            }
    
            length++;
        } while (token = getNextToken(length));
    
        return length;
    }
    
    // =========================
    // Dimensions
    //
    
    function dimension(type) {
        if (type) {
            type = new Set(type);
        }
    
        return function(token, getNextToken, opts) {
            if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Dimension) {
                return 0;
            }
    
            const numberEnd = (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.consumeNumber)(token.value, 0);
    
            // check unit
            if (type !== null) {
                // check for IE postfix hack, i.e. 123px\0 or 123px\9
                const reverseSolidusOffset = token.value.indexOf('\\', numberEnd);
                const unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset)
                    ? token.value.substr(numberEnd)
                    : token.value.substring(numberEnd, reverseSolidusOffset);
    
                if (type.has(unit.toLowerCase()) === false) {
                    return 0;
                }
            }
    
            // check range if specified
            if (outOfRange(opts, token.value, numberEnd)) {
                return 0;
            }
    
            return 1;
        };
    }
    
    // =========================
    // Percentage
    //
    
    // Â§5.5. Percentages: the <percentage> type
    // https://drafts.csswg.org/css-values-4/#percentages
    function percentage(token, getNextToken, opts) {
        // ... corresponds to the <percentage-token> production
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Percentage) {
            return 0;
        }
    
        // check range if specified
        if (outOfRange(opts, token.value, token.value.length - 1)) {
            return 0;
        }
    
        return 1;
    }
    
    // =========================
    // Numeric
    //
    
    // https://drafts.csswg.org/css-values-4/#numbers
    // The value <zero> represents a literal number with the value 0. Expressions that merely
    // evaluate to a <number> with the value 0 (for example, calc(0)) do not match <zero>;
    // only literal <number-token>s do.
    function zero(next) {
        if (typeof next !== 'function') {
            next = function() {
                return 0;
            };
        }
    
        return function(token, getNextToken, opts) {
            if (token !== null && token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Number) {
                if (Number(token.value) === 0) {
                    return 1;
                }
            }
    
            return next(token, getNextToken, opts);
        };
    }
    
    // Â§ 5.3. Real Numbers: the <number> type
    // https://drafts.csswg.org/css-values-4/#numbers
    // Number values are denoted by <number>, and represent real numbers, possibly with a fractional component.
    // ... It corresponds to the <number-token> production
    function number(token, getNextToken, opts) {
        if (token === null) {
            return 0;
        }
    
        const numberEnd = (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.consumeNumber)(token.value, 0);
        const isNumber = numberEnd === token.value.length;
        if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
            return 0;
        }
    
        // check range if specified
        if (outOfRange(opts, token.value, numberEnd)) {
            return 0;
        }
    
        return 1;
    }
    
    // Â§5.2. Integers: the <integer> type
    // https://drafts.csswg.org/css-values-4/#integers
    function integer(token, getNextToken, opts) {
        // ... corresponds to a subset of the <number-token> production
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Number) {
            return 0;
        }
    
        // The first digit of an integer may be immediately preceded by `-` or `+` to indicate the integerâ€™s sign.
        let i = charCodeAt(token.value, 0) === 0x002B ||       // U+002B PLUS SIGN (+)
                charCodeAt(token.value, 0) === 0x002D ? 1 : 0; // U+002D HYPHEN-MINUS (-)
    
        // When written literally, an integer is one or more decimal digits 0 through 9 ...
        for (; i < token.value.length; i++) {
            if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.isDigit)(charCodeAt(token.value, i))) {
                return 0;
            }
        }
    
        // check range if specified
        if (outOfRange(opts, token.value, i)) {
            return 0;
        }
    
        return 1;
    }
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
        // token types
        'ident-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Ident),
        'function-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Function),
        'at-keyword-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.AtKeyword),
        'hash-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Hash),
        'string-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.String),
        'bad-string-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.BadString),
        'url-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Url),
        'bad-url-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.BadUrl),
        'delim-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Delim),
        'number-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Number),
        'percentage-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Percentage),
        'dimension-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Dimension),
        'whitespace-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.WhiteSpace),
        'CDO-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.CDO),
        'CDC-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.CDC),
        'colon-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Colon),
        'semicolon-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Semicolon),
        'comma-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Comma),
        '[-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftSquareBracket),
        ']-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightSquareBracket),
        '(-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftParenthesis),
        ')-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightParenthesis),
        '{-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.LeftCurlyBracket),
        '}-token': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.RightCurlyBracket),
    
        // token type aliases
        'string': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.String),
        'ident': tokenType(_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_2__.Ident),
    
        // complex types
        'custom-ident': customIdent,
        'custom-property-name': customPropertyName,
        'hex-color': hexColor,
        'id-selector': idSelector, // element( <id-selector> )
        'an-plus-b': _generic_an_plus_b_js__WEBPACK_IMPORTED_MODULE_0__["default"],
        'urange': _generic_urange_js__WEBPACK_IMPORTED_MODULE_1__["default"],
        'declaration-value': declarationValue,
        'any-value': anyValue,
    
        // dimensions
        'dimension': calc(dimension(null)),
        'angle': calc(dimension(ANGLE)),
        'decibel': calc(dimension(DECIBEL)),
        'frequency': calc(dimension(FREQUENCY)),
        'flex': calc(dimension(FLEX)),
        'length': calc(zero(dimension(LENGTH))),
        'resolution': calc(dimension(RESOLUTION)),
        'semitones': calc(dimension(SEMITONES)),
        'time': calc(dimension(TIME)),
    
        // percentage
        'percentage': calc(percentage),
    
        // numeric
        'zero': zero(),
        'number': calc(number),
        'integer': calc(integer),
    
        // old IE stuff
        '-ms-legacy-expression': func('expression')
    });
    
    
    /***/ }),
    /* 60 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ anPlusB)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    
    
    const PLUSSIGN = 0x002B;    // U+002B PLUS SIGN (+)
    const HYPHENMINUS = 0x002D; // U+002D HYPHEN-MINUS (-)
    const N = 0x006E;           // U+006E LATIN SMALL LETTER N (n)
    const DISALLOW_SIGN = true;
    const ALLOW_SIGN = false;
    
    function isDelim(token, code) {
        return token !== null && token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Delim && token.value.charCodeAt(0) === code;
    }
    
    function skipSC(token, offset, getNextToken) {
        while (token !== null && (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.WhiteSpace || token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Comment)) {
            token = getNextToken(++offset);
        }
    
        return offset;
    }
    
    function checkInteger(token, valueOffset, disallowSign, offset) {
        if (!token) {
            return 0;
        }
    
        const code = token.value.charCodeAt(valueOffset);
    
        if (code === PLUSSIGN || code === HYPHENMINUS) {
            if (disallowSign) {
                // Number sign is not allowed
                return 0;
            }
            valueOffset++;
        }
    
        for (; valueOffset < token.value.length; valueOffset++) {
            if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.isDigit)(token.value.charCodeAt(valueOffset))) {
                // Integer is expected
                return 0;
            }
        }
    
        return offset + 1;
    }
    
    // ... <signed-integer>
    // ... ['+' | '-'] <signless-integer>
    function consumeB(token, offset_, getNextToken) {
        let sign = false;
        let offset = skipSC(token, offset_, getNextToken);
    
        token = getNextToken(offset);
    
        if (token === null) {
            return offset_;
        }
    
        if (token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number) {
            if (isDelim(token, PLUSSIGN) || isDelim(token, HYPHENMINUS)) {
                sign = true;
                offset = skipSC(getNextToken(++offset), offset, getNextToken);
                token = getNextToken(offset);
    
                if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number) {
                    return 0;
                }
            } else {
                return offset_;
            }
        }
    
        if (!sign) {
            const code = token.value.charCodeAt(0);
            if (code !== PLUSSIGN && code !== HYPHENMINUS) {
                // Number sign is expected
                return 0;
            }
        }
    
        return checkInteger(token, sign ? 0 : 1, sign, offset);
    }
    
    // An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb
    function anPlusB(token, getNextToken) {
        /* eslint-disable brace-style*/
        let offset = 0;
    
        if (!token) {
            return 0;
        }
    
        // <integer>
        if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number) {
            return checkInteger(token, 0, ALLOW_SIGN, offset); // b
        }
    
        // -n
        // -n <signed-integer>
        // -n ['+' | '-'] <signless-integer>
        // -n- <signless-integer>
        // <dashndashdigit-ident>
        else if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident && token.value.charCodeAt(0) === HYPHENMINUS) {
            // expect 1st char is N
            if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.cmpChar)(token.value, 1, N)) {
                return 0;
            }
    
            switch (token.value.length) {
                // -n
                // -n <signed-integer>
                // -n ['+' | '-'] <signless-integer>
                case 2:
                    return consumeB(getNextToken(++offset), offset, getNextToken);
    
                // -n- <signless-integer>
                case 3:
                    if (token.value.charCodeAt(2) !== HYPHENMINUS) {
                        return 0;
                    }
    
                    offset = skipSC(getNextToken(++offset), offset, getNextToken);
                    token = getNextToken(offset);
    
                    return checkInteger(token, 0, DISALLOW_SIGN, offset);
    
                // <dashndashdigit-ident>
                default:
                    if (token.value.charCodeAt(2) !== HYPHENMINUS) {
                        return 0;
                    }
    
                    return checkInteger(token, 3, DISALLOW_SIGN, offset);
            }
        }
    
        // '+'? n
        // '+'? n <signed-integer>
        // '+'? n ['+' | '-'] <signless-integer>
        // '+'? n- <signless-integer>
        // '+'? <ndashdigit-ident>
        else if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident || (isDelim(token, PLUSSIGN) && getNextToken(offset + 1).type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident)) {
            // just ignore a plus
            if (token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident) {
                token = getNextToken(++offset);
            }
    
            if (token === null || !(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.cmpChar)(token.value, 0, N)) {
                return 0;
            }
    
            switch (token.value.length) {
                // '+'? n
                // '+'? n <signed-integer>
                // '+'? n ['+' | '-'] <signless-integer>
                case 1:
                    return consumeB(getNextToken(++offset), offset, getNextToken);
    
                // '+'? n- <signless-integer>
                case 2:
                    if (token.value.charCodeAt(1) !== HYPHENMINUS) {
                        return 0;
                    }
    
                    offset = skipSC(getNextToken(++offset), offset, getNextToken);
                    token = getNextToken(offset);
    
                    return checkInteger(token, 0, DISALLOW_SIGN, offset);
    
                // '+'? <ndashdigit-ident>
                default:
                    if (token.value.charCodeAt(1) !== HYPHENMINUS) {
                        return 0;
                    }
    
                    return checkInteger(token, 2, DISALLOW_SIGN, offset);
            }
        }
    
        // <ndashdigit-dimension>
        // <ndash-dimension> <signless-integer>
        // <n-dimension>
        // <n-dimension> <signed-integer>
        // <n-dimension> ['+' | '-'] <signless-integer>
        else if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension) {
            let code = token.value.charCodeAt(0);
            let sign = code === PLUSSIGN || code === HYPHENMINUS ? 1 : 0;
            let i = sign;
    
            for (; i < token.value.length; i++) {
                if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.isDigit)(token.value.charCodeAt(i))) {
                    break;
                }
            }
    
            if (i === sign) {
                // Integer is expected
                return 0;
            }
    
            if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.cmpChar)(token.value, i, N)) {
                return 0;
            }
    
            // <n-dimension>
            // <n-dimension> <signed-integer>
            // <n-dimension> ['+' | '-'] <signless-integer>
            if (i + 1 === token.value.length) {
                return consumeB(getNextToken(++offset), offset, getNextToken);
            } else {
                if (token.value.charCodeAt(i + 1) !== HYPHENMINUS) {
                    return 0;
                }
    
                // <ndash-dimension> <signless-integer>
                if (i + 2 === token.value.length) {
                    offset = skipSC(getNextToken(++offset), offset, getNextToken);
                    token = getNextToken(offset);
    
                    return checkInteger(token, 0, DISALLOW_SIGN, offset);
                }
                // <ndashdigit-dimension>
                else {
                    return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
                }
            }
        }
    
        return 0;
    };
    
    
    /***/ }),
    /* 61 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* binding */ urange)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    
    
    const PLUSSIGN = 0x002B;     // U+002B PLUS SIGN (+)
    const HYPHENMINUS = 0x002D;  // U+002D HYPHEN-MINUS (-)
    const QUESTIONMARK = 0x003F; // U+003F QUESTION MARK (?)
    const U = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)
    
    function isDelim(token, code) {
        return token !== null && token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Delim && token.value.charCodeAt(0) === code;
    }
    
    function startsWith(token, code) {
        return token.value.charCodeAt(0) === code;
    }
    
    function hexSequence(token, offset, allowDash) {
        let hexlen = 0;
    
        for (let pos = offset; pos < token.value.length; pos++) {
            const code = token.value.charCodeAt(pos);
    
            if (code === HYPHENMINUS && allowDash && hexlen !== 0) {
                hexSequence(token, offset + hexlen + 1, false);
                return 6; // dissallow following question marks
            }
    
            if (!(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.isHexDigit)(code)) {
                return 0; // not a hex digit
            }
    
            if (++hexlen > 6) {
                return 0; // too many hex digits
            };
        }
    
        return hexlen;
    }
    
    function withQuestionMarkSequence(consumed, length, getNextToken) {
        if (!consumed) {
            return 0; // nothing consumed
        }
    
        while (isDelim(getNextToken(length), QUESTIONMARK)) {
            if (++consumed > 6) {
                return 0; // too many question marks
            }
    
            length++;
        }
    
        return length;
    }
    
    // https://drafts.csswg.org/css-syntax/#urange
    // Informally, the <urange> production has three forms:
    // U+0001
    //      Defines a range consisting of a single code point, in this case the code point "1".
    // U+0001-00ff
    //      Defines a range of codepoints between the first and the second value, in this case
    //      the range between "1" and "ff" (255 in decimal) inclusive.
    // U+00??
    //      Defines a range of codepoints where the "?" characters range over all hex digits,
    //      in this case defining the same as the value U+0000-00ff.
    // In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
    //
    // <urange> =
    //   u '+' <ident-token> '?'* |
    //   u <dimension-token> '?'* |
    //   u <number-token> '?'* |
    //   u <number-token> <dimension-token> |
    //   u <number-token> <number-token> |
    //   u '+' '?'+
    function urange(token, getNextToken) {
        let length = 0;
    
        // should start with `u` or `U`
        if (token === null || token.type !== _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident || !(0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.cmpChar)(token.value, 0, U)) {
            return 0;
        }
    
        token = getNextToken(++length);
        if (token === null) {
            return 0;
        }
    
        // u '+' <ident-token> '?'*
        // u '+' '?'+
        if (isDelim(token, PLUSSIGN)) {
            token = getNextToken(++length);
            if (token === null) {
                return 0;
            }
    
            if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Ident) {
                // u '+' <ident-token> '?'*
                return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
            }
    
            if (isDelim(token, QUESTIONMARK)) {
                // u '+' '?'+
                return withQuestionMarkSequence(1, ++length, getNextToken);
            }
    
            // Hex digit or question mark is expected
            return 0;
        }
    
        // u <number-token> '?'*
        // u <number-token> <dimension-token>
        // u <number-token> <number-token>
        if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number) {
            const consumedHexLength = hexSequence(token, 1, true);
            if (consumedHexLength === 0) {
                return 0;
            }
    
            token = getNextToken(++length);
            if (token === null) {
                // u <number-token> <eof>
                return length;
            }
    
            if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension || token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Number) {
                // u <number-token> <dimension-token>
                // u <number-token> <number-token>
                if (!startsWith(token, HYPHENMINUS) || !hexSequence(token, 1, false)) {
                    return 0;
                }
    
                return length + 1;
            }
    
            // u <number-token> '?'*
            return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
        }
    
        // u <dimension-token> '?'*
        if (token.type === _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.Dimension) {
            return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
        }
    
        return 0;
    };
    
    
    /***/ }),
    /* 62 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "SyntaxError": () => (/* reexport safe */ _SyntaxError_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxError),
    /* harmony export */   "generate": () => (/* reexport safe */ _generate_js__WEBPACK_IMPORTED_MODULE_1__.generate),
    /* harmony export */   "parse": () => (/* reexport safe */ _parse_js__WEBPACK_IMPORTED_MODULE_2__.parse),
    /* harmony export */   "walk": () => (/* reexport safe */ _walk_js__WEBPACK_IMPORTED_MODULE_3__.walk)
    /* harmony export */ });
    /* harmony import */ var _SyntaxError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);
    /* harmony import */ var _generate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57);
    /* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);
    /* harmony import */ var _walk_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(66);
    
    
    
    
    
    
    /***/ }),
    /* 63 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "SyntaxError": () => (/* binding */ SyntaxError)
    /* harmony export */ });
    /* harmony import */ var _utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42);
    
    
    function SyntaxError(message, input, offset) {
        return Object.assign((0,_utils_create_custom_error_js__WEBPACK_IMPORTED_MODULE_0__.createCustomError)('SyntaxError', message), {
            input,
            offset,
            rawMessage: message,
            message: message + '\n' +
                '  ' + input + '\n' +
                '--' + new Array((offset || input.length) + 1).join('-') + '^'
        });
    };
    
    
    /***/ }),
    /* 64 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "parse": () => (/* binding */ parse)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65);
    
    
    const TAB = 9;
    const N = 10;
    const F = 12;
    const R = 13;
    const SPACE = 32;
    const EXCLAMATIONMARK = 33;    // !
    const NUMBERSIGN = 35;         // #
    const AMPERSAND = 38;          // &
    const APOSTROPHE = 39;         // '
    const LEFTPARENTHESIS = 40;    // (
    const RIGHTPARENTHESIS = 41;   // )
    const ASTERISK = 42;           // *
    const PLUSSIGN = 43;           // +
    const COMMA = 44;              // ,
    const HYPERMINUS = 45;         // -
    const LESSTHANSIGN = 60;       // <
    const GREATERTHANSIGN = 62;    // >
    const QUESTIONMARK = 63;       // ?
    const COMMERCIALAT = 64;       // @
    const LEFTSQUAREBRACKET = 91;  // [
    const RIGHTSQUAREBRACKET = 93; // ]
    const LEFTCURLYBRACKET = 123;  // {
    const VERTICALLINE = 124;      // |
    const RIGHTCURLYBRACKET = 125; // }
    const INFINITY = 8734;         // âˆž
    const NAME_CHAR = new Uint8Array(128).map((_, idx) =>
        /[a-zA-Z0-9\-]/.test(String.fromCharCode(idx)) ? 1 : 0
    );
    const COMBINATOR_PRECEDENCE = {
        ' ': 1,
        '&&': 2,
        '||': 3,
        '|': 4
    };
    
    function scanSpaces(tokenizer) {
        return tokenizer.substringToPos(
            tokenizer.findWsEnd(tokenizer.pos)
        );
    }
    
    function scanWord(tokenizer) {
        let end = tokenizer.pos;
    
        for (; end < tokenizer.str.length; end++) {
            const code = tokenizer.str.charCodeAt(end);
            if (code >= 128 || NAME_CHAR[code] === 0) {
                break;
            }
        }
    
        if (tokenizer.pos === end) {
            tokenizer.error('Expect a keyword');
        }
    
        return tokenizer.substringToPos(end);
    }
    
    function scanNumber(tokenizer) {
        let end = tokenizer.pos;
    
        for (; end < tokenizer.str.length; end++) {
            const code = tokenizer.str.charCodeAt(end);
            if (code < 48 || code > 57) {
                break;
            }
        }
    
        if (tokenizer.pos === end) {
            tokenizer.error('Expect a number');
        }
    
        return tokenizer.substringToPos(end);
    }
    
    function scanString(tokenizer) {
        const end = tokenizer.str.indexOf('\'', tokenizer.pos + 1);
    
        if (end === -1) {
            tokenizer.pos = tokenizer.str.length;
            tokenizer.error('Expect an apostrophe');
        }
    
        return tokenizer.substringToPos(end + 1);
    }
    
    function readMultiplierRange(tokenizer) {
        let min = null;
        let max = null;
    
        tokenizer.eat(LEFTCURLYBRACKET);
    
        min = scanNumber(tokenizer);
    
        if (tokenizer.charCode() === COMMA) {
            tokenizer.pos++;
            if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
                max = scanNumber(tokenizer);
            }
        } else {
            max = min;
        }
    
        tokenizer.eat(RIGHTCURLYBRACKET);
    
        return {
            min: Number(min),
            max: max ? Number(max) : 0
        };
    }
    
    function readMultiplier(tokenizer) {
        let range = null;
        let comma = false;
    
        switch (tokenizer.charCode()) {
            case ASTERISK:
                tokenizer.pos++;
    
                range = {
                    min: 0,
                    max: 0
                };
    
                break;
    
            case PLUSSIGN:
                tokenizer.pos++;
    
                range = {
                    min: 1,
                    max: 0
                };
    
                break;
    
            case QUESTIONMARK:
                tokenizer.pos++;
    
                range = {
                    min: 0,
                    max: 1
                };
    
                break;
    
            case NUMBERSIGN:
                tokenizer.pos++;
    
                comma = true;
    
                if (tokenizer.charCode() === LEFTCURLYBRACKET) {
                    range = readMultiplierRange(tokenizer);
                } else {
                    range = {
                        min: 1,
                        max: 0
                    };
                }
    
                break;
    
            case LEFTCURLYBRACKET:
                range = readMultiplierRange(tokenizer);
                break;
    
            default:
                return null;
        }
    
        return {
            type: 'Multiplier',
            comma,
            min: range.min,
            max: range.max,
            term: null
        };
    }
    
    function maybeMultiplied(tokenizer, node) {
        const multiplier = readMultiplier(tokenizer);
    
        if (multiplier !== null) {
            multiplier.term = node;
            return multiplier;
        }
    
        return node;
    }
    
    function maybeToken(tokenizer) {
        const ch = tokenizer.peek();
    
        if (ch === '') {
            return null;
        }
    
        return {
            type: 'Token',
            value: ch
        };
    }
    
    function readProperty(tokenizer) {
        let name;
    
        tokenizer.eat(LESSTHANSIGN);
        tokenizer.eat(APOSTROPHE);
    
        name = scanWord(tokenizer);
    
        tokenizer.eat(APOSTROPHE);
        tokenizer.eat(GREATERTHANSIGN);
    
        return maybeMultiplied(tokenizer, {
            type: 'Property',
            name
        });
    }
    
    // https://drafts.csswg.org/css-values-3/#numeric-ranges
    // 4.1. Range Restrictions and Range Definition Notation
    //
    // Range restrictions can be annotated in the numeric type notation using CSS bracketed
    // range notationâ€”[min,max]â€”within the angle brackets, after the identifying keyword,
    // indicating a closed range between (and including) min and max.
    // For example, <integer [0, 10]> indicates an integer between 0 and 10, inclusive.
    function readTypeRange(tokenizer) {
        // use null for Infinity to make AST format JSON serializable/deserializable
        let min = null; // -Infinity
        let max = null; // Infinity
        let sign = 1;
    
        tokenizer.eat(LEFTSQUAREBRACKET);
    
        if (tokenizer.charCode() === HYPERMINUS) {
            tokenizer.peek();
            sign = -1;
        }
    
        if (sign == -1 && tokenizer.charCode() === INFINITY) {
            tokenizer.peek();
        } else {
            min = sign * Number(scanNumber(tokenizer));
        }
    
        scanSpaces(tokenizer);
        tokenizer.eat(COMMA);
        scanSpaces(tokenizer);
    
        if (tokenizer.charCode() === INFINITY) {
            tokenizer.peek();
        } else {
            sign = 1;
    
            if (tokenizer.charCode() === HYPERMINUS) {
                tokenizer.peek();
                sign = -1;
            }
    
            max = sign * Number(scanNumber(tokenizer));
        }
    
        tokenizer.eat(RIGHTSQUAREBRACKET);
    
        // If no range is indicated, either by using the bracketed range notation
        // or in the property description, then [âˆ’âˆž,âˆž] is assumed.
        if (min === null && max === null) {
            return null;
        }
    
        return {
            type: 'Range',
            min,
            max
        };
    }
    
    function readType(tokenizer) {
        let name;
        let opts = null;
    
        tokenizer.eat(LESSTHANSIGN);
        name = scanWord(tokenizer);
    
        if (tokenizer.charCode() === LEFTPARENTHESIS &&
            tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
            tokenizer.pos += 2;
            name += '()';
        }
    
        if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
            scanSpaces(tokenizer);
            opts = readTypeRange(tokenizer);
        }
    
        tokenizer.eat(GREATERTHANSIGN);
    
        return maybeMultiplied(tokenizer, {
            type: 'Type',
            name,
            opts
        });
    }
    
    function readKeywordOrFunction(tokenizer) {
        const name = scanWord(tokenizer);
    
        if (tokenizer.charCode() === LEFTPARENTHESIS) {
            tokenizer.pos++;
    
            return {
                type: 'Function',
                name
            };
        }
    
        return maybeMultiplied(tokenizer, {
            type: 'Keyword',
            name
        });
    }
    
    function regroupTerms(terms, combinators) {
        function createGroup(terms, combinator) {
            return {
                type: 'Group',
                terms,
                combinator,
                disallowEmpty: false,
                explicit: false
            };
        }
    
        let combinator;
    
        combinators = Object.keys(combinators)
            .sort((a, b) => COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b]);
    
        while (combinators.length > 0) {
            combinator = combinators.shift();
    
            let i = 0;
            let subgroupStart = 0;
    
            for (; i < terms.length; i++) {
                const term = terms[i];
    
                if (term.type === 'Combinator') {
                    if (term.value === combinator) {
                        if (subgroupStart === -1) {
                            subgroupStart = i - 1;
                        }
                        terms.splice(i, 1);
                        i--;
                    } else {
                        if (subgroupStart !== -1 && i - subgroupStart > 1) {
                            terms.splice(
                                subgroupStart,
                                i - subgroupStart,
                                createGroup(terms.slice(subgroupStart, i), combinator)
                            );
                            i = subgroupStart + 1;
                        }
                        subgroupStart = -1;
                    }
                }
            }
    
            if (subgroupStart !== -1 && combinators.length) {
                terms.splice(
                    subgroupStart,
                    i - subgroupStart,
                    createGroup(terms.slice(subgroupStart, i), combinator)
                );
            }
        }
    
        return combinator;
    }
    
    function readImplicitGroup(tokenizer) {
        const terms = [];
        const combinators = {};
        let token;
        let prevToken = null;
        let prevTokenPos = tokenizer.pos;
    
        while (token = peek(tokenizer)) {
            if (token.type !== 'Spaces') {
                if (token.type === 'Combinator') {
                    // check for combinator in group beginning and double combinator sequence
                    if (prevToken === null || prevToken.type === 'Combinator') {
                        tokenizer.pos = prevTokenPos;
                        tokenizer.error('Unexpected combinator');
                    }
    
                    combinators[token.value] = true;
                } else if (prevToken !== null && prevToken.type !== 'Combinator') {
                    combinators[' '] = true;  // a b
                    terms.push({
                        type: 'Combinator',
                        value: ' '
                    });
                }
    
                terms.push(token);
                prevToken = token;
                prevTokenPos = tokenizer.pos;
            }
        }
    
        // check for combinator in group ending
        if (prevToken !== null && prevToken.type === 'Combinator') {
            tokenizer.pos -= prevTokenPos;
            tokenizer.error('Unexpected combinator');
        }
    
        return {
            type: 'Group',
            terms,
            combinator: regroupTerms(terms, combinators) || ' ',
            disallowEmpty: false,
            explicit: false
        };
    }
    
    function readGroup(tokenizer) {
        let result;
    
        tokenizer.eat(LEFTSQUAREBRACKET);
        result = readImplicitGroup(tokenizer);
        tokenizer.eat(RIGHTSQUAREBRACKET);
    
        result.explicit = true;
    
        if (tokenizer.charCode() === EXCLAMATIONMARK) {
            tokenizer.pos++;
            result.disallowEmpty = true;
        }
    
        return result;
    }
    
    function peek(tokenizer) {
        let code = tokenizer.charCode();
    
        if (code < 128 && NAME_CHAR[code] === 1) {
            return readKeywordOrFunction(tokenizer);
        }
    
        switch (code) {
            case RIGHTSQUAREBRACKET:
                // don't eat, stop scan a group
                break;
    
            case LEFTSQUAREBRACKET:
                return maybeMultiplied(tokenizer, readGroup(tokenizer));
    
            case LESSTHANSIGN:
                return tokenizer.nextCharCode() === APOSTROPHE
                    ? readProperty(tokenizer)
                    : readType(tokenizer);
    
            case VERTICALLINE:
                return {
                    type: 'Combinator',
                    value: tokenizer.substringToPos(
                        tokenizer.pos + (tokenizer.nextCharCode() === VERTICALLINE ? 2 : 1)
                    )
                };
    
            case AMPERSAND:
                tokenizer.pos++;
                tokenizer.eat(AMPERSAND);
    
                return {
                    type: 'Combinator',
                    value: '&&'
                };
    
            case COMMA:
                tokenizer.pos++;
                return {
                    type: 'Comma'
                };
    
            case APOSTROPHE:
                return maybeMultiplied(tokenizer, {
                    type: 'String',
                    value: scanString(tokenizer)
                });
    
            case SPACE:
            case TAB:
            case N:
            case R:
            case F:
                return {
                    type: 'Spaces',
                    value: scanSpaces(tokenizer)
                };
    
            case COMMERCIALAT:
                code = tokenizer.nextCharCode();
    
                if (code < 128 && NAME_CHAR[code] === 1) {
                    tokenizer.pos++;
                    return {
                        type: 'AtKeyword',
                        name: scanWord(tokenizer)
                    };
                }
    
                return maybeToken(tokenizer);
    
            case ASTERISK:
            case PLUSSIGN:
            case QUESTIONMARK:
            case NUMBERSIGN:
            case EXCLAMATIONMARK:
                // prohibited tokens (used as a multiplier start)
                break;
    
            case LEFTCURLYBRACKET:
                // LEFTCURLYBRACKET is allowed since mdn/data uses it w/o quoting
                // check next char isn't a number, because it's likely a disjoined multiplier
                code = tokenizer.nextCharCode();
    
                if (code < 48 || code > 57) {
                    return maybeToken(tokenizer);
                }
    
                break;
    
            default:
                return maybeToken(tokenizer);
        }
    }
    
    function parse(source) {
        const tokenizer = new _tokenizer_js__WEBPACK_IMPORTED_MODULE_0__.Tokenizer(source);
        const result = readImplicitGroup(tokenizer);
    
        if (tokenizer.pos !== source.length) {
            tokenizer.error('Unexpected input');
        }
    
        // reduce redundant groups with single group term
        if (result.terms.length === 1 && result.terms[0].type === 'Group') {
            return result.terms[0];
        }
    
        return result;
    };
    
    
    /***/ }),
    /* 65 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "Tokenizer": () => (/* binding */ Tokenizer)
    /* harmony export */ });
    /* harmony import */ var _SyntaxError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);
    
    
    const TAB = 9;
    const N = 10;
    const F = 12;
    const R = 13;
    const SPACE = 32;
    
    class Tokenizer {
        constructor(str) {
            this.str = str;
            this.pos = 0;
        }
        charCodeAt(pos) {
            return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
        }
        charCode() {
            return this.charCodeAt(this.pos);
        }
        nextCharCode() {
            return this.charCodeAt(this.pos + 1);
        }
        nextNonWsCode(pos) {
            return this.charCodeAt(this.findWsEnd(pos));
        }
        findWsEnd(pos) {
            for (; pos < this.str.length; pos++) {
                const code = this.str.charCodeAt(pos);
                if (code !== R && code !== N && code !== F && code !== SPACE && code !== TAB) {
                    break;
                }
            }
    
            return pos;
        }
        substringToPos(end) {
            return this.str.substring(this.pos, this.pos = end);
        }
        eat(code) {
            if (this.charCode() !== code) {
                this.error('Expect `' + String.fromCharCode(code) + '`');
            }
    
            this.pos++;
        }
        peek() {
            return this.pos < this.str.length ? this.str.charAt(this.pos++) : '';
        }
        error(message) {
            throw new _SyntaxError_js__WEBPACK_IMPORTED_MODULE_0__.SyntaxError(message, this.str, this.pos);
        }
    };
    
    
    /***/ }),
    /* 66 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "walk": () => (/* binding */ walk)
    /* harmony export */ });
    const noop = function() {};
    
    function ensureFunction(value) {
        return typeof value === 'function' ? value : noop;
    }
    
    function walk(node, options, context) {
        function walk(node) {
            enter.call(context, node);
    
            switch (node.type) {
                case 'Group':
                    node.terms.forEach(walk);
                    break;
    
                case 'Multiplier':
                    walk(node.term);
                    break;
    
                case 'Type':
                case 'Property':
                case 'Keyword':
                case 'AtKeyword':
                case 'Function':
                case 'String':
                case 'Token':
                case 'Comma':
                    break;
    
                default:
                    throw new Error('Unknown type: ' + node.type);
            }
    
            leave.call(context, node);
        }
    
        let enter = noop;
        let leave = noop;
    
        if (typeof options === 'function') {
            enter = options;
        } else if (options) {
            enter = ensureFunction(options.enter);
            leave = ensureFunction(options.leave);
        }
    
        if (enter === noop && leave === noop) {
            throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
        }
    
        walk(node, context);
    };
    
    
    /***/ }),
    /* 67 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
    
    
    const astToTokens = {
        decorator: function(handlers) {
            const tokens = [];
            let curNode = null;
    
            return {
                ...handlers,
                node(node) {
                    const tmp = curNode;
                    curNode = node;
                    handlers.node.call(this, node);
                    curNode = tmp;
                },
                emit(value, type, auto) {
                    tokens.push({
                        type,
                        value,
                        node: auto ? null : curNode
                    });
                },
                result() {
                    return tokens;
                }
            };
        }
    };
    
    function stringToTokens(str) {
        const tokens = [];
    
        (0,_tokenizer_index_js__WEBPACK_IMPORTED_MODULE_0__.tokenize)(str, (type, start, end) =>
            tokens.push({
                type,
                value: str.slice(start, end),
                node: null
            })
        );
    
        return tokens;
    }
    
    /* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value, syntax) {
        if (typeof value === 'string') {
            return stringToTokens(value);
        }
    
        return syntax.generate(value, astToTokens);
    };
    
    
    /***/ }),
    /* 68 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "MATCH": () => (/* binding */ MATCH),
    /* harmony export */   "MISMATCH": () => (/* binding */ MISMATCH),
    /* harmony export */   "DISALLOW_EMPTY": () => (/* binding */ DISALLOW_EMPTY),
    /* harmony export */   "buildMatchGraph": () => (/* binding */ buildMatchGraph)
    /* harmony export */ });
    /* harmony import */ var _definition_syntax_parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
    
    
    const MATCH = { type: 'Match' };
    const MISMATCH = { type: 'Mismatch' };
    const DISALLOW_EMPTY = { type: 'DisallowEmpty' };
    
    const LEFTPARENTHESIS = 40;  // (
    const RIGHTPARENTHESIS = 41; // )
    
    function createCondition(match, thenBranch, elseBranch) {
        // reduce node count
        if (thenBranch === MATCH && elseBranch === MISMATCH) {
            return match;
        }
    
        if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
            return match;
        }
    
        if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH) {
            thenBranch = match.then;
            match = match.match;
        }
    
        return {
            type: 'If',
            match,
            then: thenBranch,
            else: elseBranch
        };
    }
    
    function isFunctionType(name) {
        return (
            name.length > 2 &&
            name.charCodeAt(name.length - 2) === LEFTPARENTHESIS &&
            name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS
        );
    }
    
    function isEnumCapatible(term) {
        return (
            term.type === 'Keyword' ||
            term.type === 'AtKeyword' ||
            term.type === 'Function' ||
            term.type === 'Type' && isFunctionType(term.name)
        );
    }
    
    function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
        switch (combinator) {
            case ' ': {
                // Juxtaposing components means that all of them must occur, in the given order.
                //
                // a b c
                // =
                // match a
                //   then match b
                //     then match c
                //       then MATCH
                //       else MISMATCH
                //     else MISMATCH
                //   else MISMATCH
                let result = MATCH;
    
                for (let i = terms.length - 1; i >= 0; i--) {
                    const term = terms[i];
    
                    result = createCondition(
                        term,
                        result,
                        MISMATCH
                    );
                };
    
                return result;
            }
    
            case '|': {
                // A bar (|) separates two or more alternatives: exactly one of them must occur.
                //
                // a | b | c
                // =
                // match a
                //   then MATCH
                //   else match b
                //     then MATCH
                //     else match c
                //       then MATCH
                //       else MISMATCH
    
                let result = MISMATCH;
                let map = null;
    
                for (let i = terms.length - 1; i >= 0; i--) {
                    let term = terms[i];
    
                    // reduce sequence of keywords into a Enum
                    if (isEnumCapatible(term)) {
                        if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
                            map = Object.create(null);
                            result = createCondition(
                                {
                                    type: 'Enum',
                                    map
                                },
                                MATCH,
                                result
                            );
                        }
    
                        if (map !== null) {
                            const key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
                            if (key in map === false) {
                                map[key] = term;
                                continue;
                            }
                        }
                    }
    
                    map = null;
    
                    // create a new conditonal node
                    result = createCondition(
                        term,
                        MATCH,
                        result
                    );
                };
    
                return result;
            }
    
            case '&&': {
                // A double ampersand (&&) separates two or more components,
                // all of which must occur, in any order.
    
                // Use MatchOnce for groups with a large number of terms,
                // since &&-groups produces at least N!-node trees
                if (terms.length > 5) {
                    return {
                        type: 'MatchOnce',
                        terms,
                        all: true
                    };
                }
    
                // Use a combination tree for groups with small number of terms
                //
                // a && b && c
                // =
                // match a
                //   then [b && c]
                //   else match b
                //     then [a && c]
                //     else match c
                //       then [a && b]
                //       else MISMATCH
                //
                // a && b
                // =
                // match a
                //   then match b
                //     then MATCH
                //     else MISMATCH
                //   else match b
                //     then match a
                //       then MATCH
                //       else MISMATCH
                //     else MISMATCH
                let result = MISMATCH;
    
                for (let i = terms.length - 1; i >= 0; i--) {
                    const term = terms[i];
                    let thenClause;
    
                    if (terms.length > 1) {
                        thenClause = buildGroupMatchGraph(
                            combinator,
                            terms.filter(function(newGroupTerm) {
                                return newGroupTerm !== term;
                            }),
                            false
                        );
                    } else {
                        thenClause = MATCH;
                    }
    
                    result = createCondition(
                        term,
                        thenClause,
                        result
                    );
                };
    
                return result;
            }
    
            case '||': {
                // A double bar (||) separates two or more options:
                // one or more of them must occur, in any order.
    
                // Use MatchOnce for groups with a large number of terms,
                // since ||-groups produces at least N!-node trees
                if (terms.length > 5) {
                    return {
                        type: 'MatchOnce',
                        terms,
                        all: false
                    };
                }
    
                // Use a combination tree for groups with small number of terms
                //
                // a || b || c
                // =
                // match a
                //   then [b || c]
                //   else match b
                //     then [a || c]
                //     else match c
                //       then [a || b]
                //       else MISMATCH
                //
                // a || b
                // =
                // match a
                //   then match b
                //     then MATCH
                //     else MATCH
                //   else match b
                //     then match a
                //       then MATCH
                //       else MATCH
                //     else MISMATCH
                let result = atLeastOneTermMatched ? MATCH : MISMATCH;
    
                for (let i = terms.length - 1; i >= 0; i--) {
                    const term = terms[i];
                    let thenClause;
    
                    if (terms.length > 1) {
                        thenClause = buildGroupMatchGraph(
                            combinator,
                            terms.filter(function(newGroupTerm) {
                                return newGroupTerm !== term;
                            }),
                            true
                        );
                    } else {
                        thenClause = MATCH;
                    }
    
                    result = createCondition(
                        term,
                        thenClause,
                        result
                    );
                };
    
                return result;
            }
        }
    }
    
    function buildMultiplierMatchGraph(node) {
        let result = MATCH;
        let matchTerm = buildMatchGraphInternal(node.term);
    
        if (node.max === 0) {
            // disable repeating of empty match to prevent infinite loop
            matchTerm = createCondition(
                matchTerm,
                DISALLOW_EMPTY,
                MISMATCH
            );
    
            // an occurrence count is not limited, make a cycle;
            // to collect more terms on each following matching mismatch
            result = createCondition(
                matchTerm,
                null, // will be a loop
                MISMATCH
            );
    
            result.then = createCondition(
                MATCH,
                MATCH,
                result // make a loop
            );
    
            if (node.comma) {
                result.then.else = createCondition(
                    { type: 'Comma', syntax: node },
                    result,
                    MISMATCH
                );
            }
        } else {
            // create a match node chain for [min .. max] interval with optional matches
            for (let i = node.min || 1; i <= node.max; i++) {
                if (node.comma && result !== MATCH) {
                    result = createCondition(
                        { type: 'Comma', syntax: node },
                        result,
                        MISMATCH
                    );
                }
    
                result = createCondition(
                    matchTerm,
                    createCondition(
                        MATCH,
                        MATCH,
                        result
                    ),
                    MISMATCH
                );
            }
        }
    
        if (node.min === 0) {
            // allow zero match
            result = createCondition(
                MATCH,
                MATCH,
                result
            );
        } else {
            // create a match node chain to collect [0 ... min - 1] required matches
            for (let i = 0; i < node.min - 1; i++) {
                if (node.comma && result !== MATCH) {
                    result = createCondition(
                        { type: 'Comma', syntax: node },
                        result,
                        MISMATCH
                    );
                }
    
                result = createCondition(
                    matchTerm,
                    result,
                    MISMATCH
                );
            }
        }
    
        return result;
    }
    
    function buildMatchGraphInternal(node) {
        if (typeof node === 'function') {
            return {
                type: 'Generic',
                fn: node
            };
        }
    
        switch (node.type) {
            case 'Group': {
                let result = buildGroupMatchGraph(
                    node.combinator,
                    node.terms.map(buildMatchGraphInternal),
                    false
                );
    
                if (node.disallowEmpty) {
                    result = createCondition(
                        result,
                        DISALLOW_EMPTY,
                        MISMATCH
                    );
                }
    
                return result;
            }
    
            case 'Multiplier':
                return buildMultiplierMatchGraph(node);
    
            case 'Type':
            case 'Property':
                return {
                    type: node.type,
                    name: node.name,
                    syntax: node
                };
    
            case 'Keyword':
                return {
                    type: node.type,
                    name: node.name.toLowerCase(),
                    syntax: node
                };
    
            case 'AtKeyword':
                return {
                    type: node.type,
                    name: '@' + node.name.toLowerCase(),
                    syntax: node
                };
    
            case 'Function':
                return {
                    type: node.type,
                    name: node.name.toLowerCase() + '(',
                    syntax: node
                };
    
            case 'String':
                // convert a one char length String to a Token
                if (node.value.length === 3) {
                    return {
                        type: 'Token',
                        value: node.value.charAt(1),
                        syntax: node
                    };
                }
    
                // otherwise use it as is
                return {
                    type: node.type,
                    value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, '\''),
                    syntax: node
                };
    
            case 'Token':
                return {
                    type: node.type,
                    value: node.value,
                    syntax: node
                };
    
            case 'Comma':
                return {
                    type: node.type,
                    syntax: node
                };
    
            default:
                throw new Error('Unknown node type:', node.type);
        }
    }
    
    function buildMatchGraph(syntaxTree, ref) {
        if (typeof syntaxTree === 'string') {
            syntaxTree = (0,_definition_syntax_parse_js__WEBPACK_IMPORTED_MODULE_0__.parse)(syntaxTree);
        }
    
        return {
            type: 'MatchGraph',
            match: buildMatchGraphInternal(syntaxTree),
            syntax: ref || null,
            source: syntaxTree
        };
    }
    
    
    /***/ }),
    /* 69 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "totalIterationCount": () => (/* binding */ totalIterationCount),
    /* harmony export */   "matchAsList": () => (/* binding */ matchAsList),
    /* harmony export */   "matchAsTree": () => (/* binding */ matchAsTree)
    /* harmony export */ });
    /* harmony import */ var _match_graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68);
    /* harmony import */ var _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32);
    
    
    
    const { hasOwnProperty } = Object.prototype;
    const STUB = 0;
    const TOKEN = 1;
    const OPEN_SYNTAX = 2;
    const CLOSE_SYNTAX = 3;
    
    const EXIT_REASON_MATCH = 'Match';
    const EXIT_REASON_MISMATCH = 'Mismatch';
    const EXIT_REASON_ITERATION_LIMIT = 'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)';
    
    const ITERATION_LIMIT = 15000;
    let totalIterationCount = 0;
    
    function reverseList(list) {
        let prev = null;
        let next = null;
        let item = list;
    
        while (item !== null) {
            next = item.prev;
            item.prev = prev;
            prev = item;
            item = next;
        }
    
        return prev;
    }
    
    function areStringsEqualCaseInsensitive(testStr, referenceStr) {
        if (testStr.length !== referenceStr.length) {
            return false;
        }
    
        for (let i = 0; i < testStr.length; i++) {
            const referenceCode = referenceStr.charCodeAt(i);
            let testCode = testStr.charCodeAt(i);
    
            // testCode.toLowerCase() for U+0041 LATIN CAPITAL LETTER A (A) .. U+005A LATIN CAPITAL LETTER Z (Z).
            if (testCode >= 0x0041 && testCode <= 0x005A) {
                testCode = testCode | 32;
            }
    
            if (testCode !== referenceCode) {
                return false;
            }
        }
    
        return true;
    }
    
    function isContextEdgeDelim(token) {
        if (token.type !== _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Delim) {
            return false;
        }
    
        // Fix matching for unicode-range: U+30??, U+FF00-FF9F
        // Probably we need to check out previous match instead
        return token.value !== '?';
    }
    
    function isCommaContextStart(token) {
        if (token === null) {
            return true;
        }
    
        return (
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Comma ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Function ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.LeftParenthesis ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.LeftSquareBracket ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.LeftCurlyBracket ||
            isContextEdgeDelim(token)
        );
    }
    
    function isCommaContextEnd(token) {
        if (token === null) {
            return true;
        }
    
        return (
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.RightParenthesis ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.RightSquareBracket ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.RightCurlyBracket ||
            token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Delim
        );
    }
    
    function internalMatch(tokens, state, syntaxes) {
        function moveToNextToken() {
            do {
                tokenIndex++;
                token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
            } while (token !== null && (token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.WhiteSpace || token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Comment));
        }
    
        function getNextToken(offset) {
            const nextIndex = tokenIndex + offset;
    
            return nextIndex < tokens.length ? tokens[nextIndex] : null;
        }
    
        function stateSnapshotFromSyntax(nextState, prev) {
            return {
                nextState,
                matchStack,
                syntaxStack,
                thenStack,
                tokenIndex,
                prev
            };
        }
    
        function pushThenStack(nextState) {
            thenStack = {
                nextState,
                matchStack,
                syntaxStack,
                prev: thenStack
            };
        }
    
        function pushElseStack(nextState) {
            elseStack = stateSnapshotFromSyntax(nextState, elseStack);
        }
    
        function addTokenToMatch() {
            matchStack = {
                type: TOKEN,
                syntax: state.syntax,
                token,
                prev: matchStack
            };
    
            moveToNextToken();
            syntaxStash = null;
    
            if (tokenIndex > longestMatch) {
                longestMatch = tokenIndex;
            }
        }
    
        function openSyntax() {
            syntaxStack = {
                syntax: state.syntax,
                opts: state.syntax.opts || (syntaxStack !== null && syntaxStack.opts) || null,
                prev: syntaxStack
            };
    
            matchStack = {
                type: OPEN_SYNTAX,
                syntax: state.syntax,
                token: matchStack.token,
                prev: matchStack
            };
        }
    
        function closeSyntax() {
            if (matchStack.type === OPEN_SYNTAX) {
                matchStack = matchStack.prev;
            } else {
                matchStack = {
                    type: CLOSE_SYNTAX,
                    syntax: syntaxStack.syntax,
                    token: matchStack.token,
                    prev: matchStack
                };
            }
    
            syntaxStack = syntaxStack.prev;
        }
    
        let syntaxStack = null;
        let thenStack = null;
        let elseStack = null;
    
        // null â€“ stashing allowed, nothing stashed
        // false â€“ stashing disabled, nothing stashed
        // anithing else â€“ fail stashable syntaxes, some syntax stashed
        let syntaxStash = null;
    
        let iterationCount = 0; // count iterations and prevent infinite loop
        let exitReason = null;
    
        let token = null;
        let tokenIndex = -1;
        let longestMatch = 0;
        let matchStack = {
            type: STUB,
            syntax: null,
            token: null,
            prev: null
        };
    
        moveToNextToken();
    
        while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
            // function mapList(list, fn) {
            //     const result = [];
            //     while (list) {
            //         result.unshift(fn(list));
            //         list = list.prev;
            //     }
            //     return result;
            // }
            // console.log('--\n',
            //     '#' + iterationCount,
            //     require('util').inspect({
            //         match: mapList(matchStack, x => x.type === TOKEN ? x.token && x.token.value : x.syntax ? ({ [OPEN_SYNTAX]: '<', [CLOSE_SYNTAX]: '</' }[x.type] || x.type) + '!' + x.syntax.name : null),
            //         token: token && token.value,
            //         tokenIndex,
            //         syntax: syntax.type + (syntax.id ? ' #' + syntax.id : '')
            //     }, { depth: null })
            // );
            switch (state.type) {
                case 'Match':
                    if (thenStack === null) {
                        // turn to MISMATCH when some tokens left unmatched
                        if (token !== null) {
                            // doesn't mismatch if just one token left and it's an IE hack
                            if (tokenIndex !== tokens.length - 1 || (token.value !== '\\0' && token.value !== '\\9')) {
                                state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                                break;
                            }
                        }
    
                        // break the main loop, return a result - MATCH
                        exitReason = EXIT_REASON_MATCH;
                        break;
                    }
    
                    // go to next syntax (`then` branch)
                    state = thenStack.nextState;
    
                    // check match is not empty
                    if (state === _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.DISALLOW_EMPTY) {
                        if (thenStack.matchStack === matchStack) {
                            state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                            break;
                        } else {
                            state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                        }
                    }
    
                    // close syntax if needed
                    while (thenStack.syntaxStack !== syntaxStack) {
                        closeSyntax();
                    }
    
                    // pop stack
                    thenStack = thenStack.prev;
                    break;
    
                case 'Mismatch':
                    // when some syntax is stashed
                    if (syntaxStash !== null && syntaxStash !== false) {
                        // there is no else branches or a branch reduce match stack
                        if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
                            // restore state from the stash
                            elseStack = syntaxStash;
                            syntaxStash = false; // disable stashing
                        }
                    } else if (elseStack === null) {
                        // no else branches -> break the main loop
                        // return a result - MISMATCH
                        exitReason = EXIT_REASON_MISMATCH;
                        break;
                    }
    
                    // go to next syntax (`else` branch)
                    state = elseStack.nextState;
    
                    // restore all the rest stack states
                    thenStack = elseStack.thenStack;
                    syntaxStack = elseStack.syntaxStack;
                    matchStack = elseStack.matchStack;
                    tokenIndex = elseStack.tokenIndex;
                    token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
    
                    // pop stack
                    elseStack = elseStack.prev;
                    break;
    
                case 'MatchGraph':
                    state = state.match;
                    break;
    
                case 'If':
                    // IMPORTANT: else stack push must go first,
                    // since it stores the state of thenStack before changes
                    if (state.else !== _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH) {
                        pushElseStack(state.else);
                    }
    
                    if (state.then !== _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH) {
                        pushThenStack(state.then);
                    }
    
                    state = state.match;
                    break;
    
                case 'MatchOnce':
                    state = {
                        type: 'MatchOnceBuffer',
                        syntax: state,
                        index: 0,
                        mask: 0
                    };
                    break;
    
                case 'MatchOnceBuffer': {
                    const terms = state.syntax.terms;
    
                    if (state.index === terms.length) {
                        // no matches at all or it's required all terms to be matched
                        if (state.mask === 0 || state.syntax.all) {
                            state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                            break;
                        }
    
                        // a partial match is ok
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                        break;
                    }
    
                    // all terms are matched
                    if (state.mask === (1 << terms.length) - 1) {
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                        break;
                    }
    
                    for (; state.index < terms.length; state.index++) {
                        const matchFlag = 1 << state.index;
    
                        if ((state.mask & matchFlag) === 0) {
                            // IMPORTANT: else stack push must go first,
                            // since it stores the state of thenStack before changes
                            pushElseStack(state);
                            pushThenStack({
                                type: 'AddMatchOnce',
                                syntax: state.syntax,
                                mask: state.mask | matchFlag
                            });
    
                            // match
                            state = terms[state.index++];
                            break;
                        }
                    }
                    break;
                }
    
                case 'AddMatchOnce':
                    state = {
                        type: 'MatchOnceBuffer',
                        syntax: state.syntax,
                        index: 0,
                        mask: state.mask
                    };
                    break;
    
                case 'Enum':
                    if (token !== null) {
                        let name = token.value.toLowerCase();
    
                        // drop \0 and \9 hack from keyword name
                        if (name.indexOf('\\') !== -1) {
                            name = name.replace(/\\[09].*$/, '');
                        }
    
                        if (hasOwnProperty.call(state.map, name)) {
                            state = state.map[name];
                            break;
                        }
                    }
    
                    state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    break;
    
                case 'Generic': {
                    const opts = syntaxStack !== null ? syntaxStack.opts : null;
                    const lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));
    
                    if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
                        while (tokenIndex < lastTokenIndex) {
                            addTokenToMatch();
                        }
    
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                    } else {
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    }
    
                    break;
                }
    
                case 'Type':
                case 'Property': {
                    const syntaxDict = state.type === 'Type' ? 'types' : 'properties';
                    const dictSyntax = hasOwnProperty.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;
    
                    if (!dictSyntax || !dictSyntax.match) {
                        throw new Error(
                            'Bad syntax reference: ' +
                            (state.type === 'Type'
                                ? '<' + state.name + '>'
                                : '<\'' + state.name + '\'>')
                        );
                    }
    
                    // stash a syntax for types with low priority
                    if (syntaxStash !== false && token !== null && state.type === 'Type') {
                        const lowPriorityMatching =
                            // https://drafts.csswg.org/css-values-4/#custom-idents
                            // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
                            // can only claim the keyword if no other unfulfilled production can claim it.
                            (state.name === 'custom-ident' && token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Ident) ||
    
                            // https://drafts.csswg.org/css-values-4/#lengths
                            // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
                            // it must parse as a <number>
                            (state.name === 'length' && token.value === '0');
    
                        if (lowPriorityMatching) {
                            if (syntaxStash === null) {
                                syntaxStash = stateSnapshotFromSyntax(state, elseStack);
                            }
    
                            state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                            break;
                        }
                    }
    
                    openSyntax();
                    state = dictSyntax.match;
                    break;
                }
    
                case 'Keyword': {
                    const name = state.name;
    
                    if (token !== null) {
                        let keywordName = token.value;
    
                        // drop \0 and \9 hack from keyword name
                        if (keywordName.indexOf('\\') !== -1) {
                            keywordName = keywordName.replace(/\\[09].*$/, '');
                        }
    
                        if (areStringsEqualCaseInsensitive(keywordName, name)) {
                            addTokenToMatch();
                            state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                            break;
                        }
                    }
    
                    state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    break;
                }
    
                case 'AtKeyword':
                case 'Function':
                    if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
                        addTokenToMatch();
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                        break;
                    }
    
                    state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    break;
    
                case 'Token':
                    if (token !== null && token.value === state.value) {
                        addTokenToMatch();
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                        break;
                    }
    
                    state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    break;
    
                case 'Comma':
                    if (token !== null && token.type === _tokenizer_types_js__WEBPACK_IMPORTED_MODULE_1__.Comma) {
                        if (isCommaContextStart(matchStack.token)) {
                            state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                        } else {
                            addTokenToMatch();
                            state = isCommaContextEnd(token) ? _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH : _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                        }
                    } else {
                        state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH : _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    }
    
                    break;
    
                case 'String':
                    let string = '';
                    let lastTokenIndex = tokenIndex;
    
                    for (; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
                        string += tokens[lastTokenIndex].value;
                    }
    
                    if (areStringsEqualCaseInsensitive(string, state.value)) {
                        while (tokenIndex < lastTokenIndex) {
                            addTokenToMatch();
                        }
    
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MATCH;
                    } else {
                        state = _match_graph_js__WEBPACK_IMPORTED_MODULE_0__.MISMATCH;
                    }
    
                    break;
    
                default:
                    throw new Error('Unknown node type: ' + state.type);
            }
        }
    
        totalIterationCount += iterationCount;
    
        switch (exitReason) {
            case null:
                console.warn('[csstree-match] BREAK after ' + ITERATION_LIMIT + ' iterations');
                exitReason = EXIT_REASON_ITERATION_LIMIT;
                matchStack = null;
                break;
    
            case EXIT_REASON_MATCH:
                while (syntaxStack !== null) {
                    closeSyntax();
                }
                break;
    
            default:
                matchStack = null;
        }
    
        return {
            tokens,
            reason: exitReason,
            iterations: iterationCount,
            match: matchStack,
            longestMatch
        };
    }
    
    function matchAsList(tokens, matchGraph, syntaxes) {
        const matchResult = internalMatch(tokens, matchGraph, syntaxes || {});
    
        if (matchResult.match !== null) {
            let item = reverseList(matchResult.match).prev;
    
            matchResult.match = [];
    
            while (item !== null) {
                switch (item.type) {
                    case OPEN_SYNTAX:
                    case CLOSE_SYNTAX:
                        matchResult.match.push({
                            type: item.type,
                            syntax: item.syntax
                        });
                        break;
    
                    default:
                        matchResult.match.push({
                            token: item.token.value,
                            node: item.token.node
                        });
                        break;
                }
    
                item = item.prev;
            }
        }
    
        return matchResult;
    }
    
    function matchAsTree(tokens, matchGraph, syntaxes) {
        const matchResult = internalMatch(tokens, matchGraph, syntaxes || {});
    
        if (matchResult.match === null) {
            return matchResult;
        }
    
        let item = matchResult.match;
        let host = matchResult.match = {
            syntax: matchGraph.syntax || null,
            match: []
        };
        const hostStack = [host];
    
        // revert a list and start with 2nd item since 1st is a stub item
        item = reverseList(item).prev;
    
        // build a tree
        while (item !== null) {
            switch (item.type) {
                case OPEN_SYNTAX:
                    host.match.push(host = {
                        syntax: item.syntax,
                        match: []
                    });
                    hostStack.push(host);
                    break;
    
                case CLOSE_SYNTAX:
                    hostStack.pop();
                    host = hostStack[hostStack.length - 1];
                    break;
    
                default:
                    host.match.push({
                        syntax: item.syntax || null,
                        token: item.token.value,
                        node: item.token.node
                    });
            }
    
            item = item.prev;
        }
    
        return matchResult;
    }
    
    
    /***/ }),
    /* 70 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "getTrace": () => (/* binding */ getTrace),
    /* harmony export */   "isType": () => (/* binding */ isType),
    /* harmony export */   "isProperty": () => (/* binding */ isProperty),
    /* harmony export */   "isKeyword": () => (/* binding */ isKeyword)
    /* harmony export */ });
    function getTrace(node) {
        function shouldPutToTrace(syntax) {
            if (syntax === null) {
                return false;
            }
    
            return (
                syntax.type === 'Type' ||
                syntax.type === 'Property' ||
                syntax.type === 'Keyword'
            );
        }
    
        function hasMatch(matchNode) {
            if (Array.isArray(matchNode.match)) {
                // use for-loop for better perfomance
                for (let i = 0; i < matchNode.match.length; i++) {
                    if (hasMatch(matchNode.match[i])) {
                        if (shouldPutToTrace(matchNode.syntax)) {
                            result.unshift(matchNode.syntax);
                        }
    
                        return true;
                    }
                }
            } else if (matchNode.node === node) {
                result = shouldPutToTrace(matchNode.syntax)
                    ? [matchNode.syntax]
                    : [];
    
                return true;
            }
    
            return false;
        }
    
        let result = null;
    
        if (this.matched !== null) {
            hasMatch(this.matched);
        }
    
        return result;
    }
    
    function isType(node, type) {
        return testNode(this, node, match => match.type === 'Type' && match.name === type);
    }
    
    function isProperty(node, property) {
        return testNode(this, node, match => match.type === 'Property' && match.name === property);
    }
    
    function isKeyword(node) {
        return testNode(this, node, match => match.type === 'Keyword');
    }
    
    function testNode(match, node, fn) {
        const trace = getTrace.call(match, node);
    
        if (trace === null) {
            return false;
        }
    
        return trace.some(fn);
    }
    
    
    /***/ }),
    /* 71 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "matchFragments": () => (/* binding */ matchFragments)
    /* harmony export */ });
    /* harmony import */ var _utils_List_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);
    
    
    function getFirstMatchNode(matchNode) {
        if ('node' in matchNode) {
            return matchNode.node;
        }
    
        return getFirstMatchNode(matchNode.match[0]);
    }
    
    function getLastMatchNode(matchNode) {
        if ('node' in matchNode) {
            return matchNode.node;
        }
    
        return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
    }
    
    function matchFragments(lexer, ast, match, type, name) {
        function findFragments(matchNode) {
            if (matchNode.syntax !== null &&
                matchNode.syntax.type === type &&
                matchNode.syntax.name === name) {
                const start = getFirstMatchNode(matchNode);
                const end = getLastMatchNode(matchNode);
    
                lexer.syntax.walk(ast, function(node, item, list) {
                    if (node === start) {
                        const nodes = new _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List();
    
                        do {
                            nodes.appendData(item.data);
    
                            if (item.data === end) {
                                break;
                            }
    
                            item = item.next;
                        } while (item !== null);
    
                        fragments.push({
                            parent: list,
                            nodes
                        });
                    }
                });
            }
    
            if (Array.isArray(matchNode.match)) {
                matchNode.match.forEach(findFragments);
            }
        }
    
        const fragments = [];
    
        if (match.matched !== null) {
            findFragments(match.matched);
        }
    
        return fragments;
    }
    
    
    /***/ }),
    /* 72 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "getStructureFromConfig": () => (/* binding */ getStructureFromConfig)
    /* harmony export */ });
    /* harmony import */ var _utils_List_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(40);
    
    
    const { hasOwnProperty } = Object.prototype;
    
    function isValidNumber(value) {
        // Number.isInteger(value) && value >= 0
        return (
            typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value &&
            value >= 0
        );
    }
    
    function isValidLocation(loc) {
        return (
            Boolean(loc) &&
            isValidNumber(loc.offset) &&
            isValidNumber(loc.line) &&
            isValidNumber(loc.column)
        );
    }
    
    function createNodeStructureChecker(type, fields) {
        return function checkNode(node, warn) {
            if (!node || node.constructor !== Object) {
                return warn(node, 'Type of node should be an Object');
            }
    
            for (let key in node) {
                let valid = true;
    
                if (hasOwnProperty.call(node, key) === false) {
                    continue;
                }
    
                if (key === 'type') {
                    if (node.type !== type) {
                        warn(node, 'Wrong node type `' + node.type + '`, expected `' + type + '`');
                    }
                } else if (key === 'loc') {
                    if (node.loc === null) {
                        continue;
                    } else if (node.loc && node.loc.constructor === Object) {
                        if (typeof node.loc.source !== 'string') {
                            key += '.source';
                        } else if (!isValidLocation(node.loc.start)) {
                            key += '.start';
                        } else if (!isValidLocation(node.loc.end)) {
                            key += '.end';
                        } else {
                            continue;
                        }
                    }
    
                    valid = false;
                } else if (fields.hasOwnProperty(key)) {
                    valid = false;
    
                    for (let i = 0; !valid && i < fields[key].length; i++) {
                        const fieldType = fields[key][i];
    
                        switch (fieldType) {
                            case String:
                                valid = typeof node[key] === 'string';
                                break;
    
                            case Boolean:
                                valid = typeof node[key] === 'boolean';
                                break;
    
                            case null:
                                valid = node[key] === null;
                                break;
    
                            default:
                                if (typeof fieldType === 'string') {
                                    valid = node[key] && node[key].type === fieldType;
                                } else if (Array.isArray(fieldType)) {
                                    valid = node[key] instanceof _utils_List_js__WEBPACK_IMPORTED_MODULE_0__.List;
                                }
                        }
                    }
                } else {
                    warn(node, 'Unknown field `' + key + '` for ' + type + ' node type');
                }
    
                if (!valid) {
                    warn(node, 'Bad value for `' + type + '.' + key + '`');
                }
            }
    
            for (const key in fields) {
                if (hasOwnProperty.call(fields, key) &&
                    hasOwnProperty.call(node, key) === false) {
                    warn(node, 'Field `' + type + '.' + key + '` is missed');
                }
            }
        };
    }
    
    function processStructure(name, nodeType) {
        const structure = nodeType.structure;
        const fields = {
            type: String,
            loc: true
        };
        const docs = {
            type: '"' + name + '"'
        };
    
        for (const key in structure) {
            if (hasOwnProperty.call(structure, key) === false) {
                continue;
            }
    
            const docsTypes = [];
            const fieldTypes = fields[key] = Array.isArray(structure[key])
                ? structure[key].slice()
                : [structure[key]];
    
            for (let i = 0; i < fieldTypes.length; i++) {
                const fieldType = fieldTypes[i];
                if (fieldType === String || fieldType === Boolean) {
                    docsTypes.push(fieldType.name);
                } else if (fieldType === null) {
                    docsTypes.push('null');
                } else if (typeof fieldType === 'string') {
                    docsTypes.push('<' + fieldType + '>');
                } else if (Array.isArray(fieldType)) {
                    docsTypes.push('List'); // TODO: use type enum
                } else {
                    throw new Error('Wrong value `' + fieldType + '` in `' + name + '.' + key + '` structure definition');
                }
            }
    
            docs[key] = docsTypes.join(' | ');
        }
    
        return {
            docs,
            check: createNodeStructureChecker(name, fields)
        };
    }
    
    function getStructureFromConfig(config) {
        const structure = {};
    
        if (config.node) {
            for (const name in config.node) {
                if (hasOwnProperty.call(config.node, name)) {
                    const nodeType = config.node[name];
    
                    if (nodeType.structure) {
                        structure[name] = processStructure(name, nodeType);
                    } else {
                        throw new Error('Missed `structure` field in `' + name + '` node type definition');
                    }
                }
            }
        }
    
        return structure;
    };
    
    
    /***/ }),
    /* 73 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    const { hasOwnProperty } = Object.prototype;
    const shape = {
        generic: true,
        types: appendOrAssign,
        atrules: {
            prelude: appendOrAssignOrNull,
            descriptors: appendOrAssignOrNull
        },
        properties: appendOrAssign,
        parseContext: assign,
        scope: deepAssign,
        atrule: ['parse'],
        pseudo: ['parse'],
        node: ['name', 'structure', 'parse', 'generate', 'walkContext']
    };
    
    function isObject(value) {
        return value && value.constructor === Object;
    }
    
    function copy(value) {
        return isObject(value)
            ? { ...value }
            : value;
    }
    
    function assign(dest, src) {
        return Object.assign(dest, src);
    }
    
    function deepAssign(dest, src) {
        for (const key in src) {
            if (hasOwnProperty.call(src, key)) {
                if (isObject(dest[key])) {
                    deepAssign(dest[key], copy(src[key]));
                } else {
                    dest[key] = copy(src[key]);
                }
            }
        }
    
        return dest;
    }
    
    function append(a, b) {
        if (typeof b === 'string' && /^\s*\|/.test(b)) {
            return typeof a === 'string'
                ? a + b
                : b.replace(/^\s*\|\s*/, '');
        }
    
        return b || null;
    }
    
    function appendOrAssign(a, b) {
        if (typeof b === 'string') {
            return append(a, b);
        }
    
        const result = { ...a };
        for (let key in b) {
            if (hasOwnProperty.call(b, key)) {
                result[key] = append(hasOwnProperty.call(a, key) ? a[key] : undefined, b[key]);
            }
        }
    
        return result;
    }
    
    function appendOrAssignOrNull(a, b) {
        const result = appendOrAssign(a, b);
    
        return !isObject(result) || Object.keys(result).length
            ? result
            : null;
    }
    
    function mix(dest, src, shape) {
        for (const key in shape) {
            if (hasOwnProperty.call(shape, key) === false) {
                continue;
            }
    
            if (shape[key] === true) {
                if (key in src) {
                    if (hasOwnProperty.call(src, key)) {
                        dest[key] = copy(src[key]);
                    }
                }
            } else if (shape[key]) {
                if (typeof shape[key] === 'function') {
                    const fn = shape[key];
                    dest[key] = fn({}, dest[key]);
                    dest[key] = fn(dest[key] || {}, src[key]);
                } else if (isObject(shape[key])) {
                    const result = {};
    
                    for (let name in dest[key]) {
                        result[name] = mix({}, dest[key][name], shape[key]);
                    }
    
                    for (let name in src[key]) {
                        result[name] = mix(result[name] || {}, src[key][name], shape[key]);
                    }
    
                    dest[key] = result;
                } else if (Array.isArray(shape[key])) {
                    const res = {};
                    const innerShape = shape[key].reduce(function(s, k) {
                        s[k] = true;
                        return s;
                    }, {});
    
                    for (const [name, value] of Object.entries(dest[key] || {})) {
                        res[name] = {};
                        if (value) {
                            mix(res[name], value, innerShape);
                        }
                    }
    
                    for (const name in src[key]) {
                        if (hasOwnProperty.call(src[key], name)) {
                            if (!res[name]) {
                                res[name] = {};
                            }
    
                            if (src[key] && src[key][name]) {
                                mix(res[name], src[key][name], innerShape);
                            }
                        }
                    }
    
                    dest[key] = res;
                }
            }
        }
        return dest;
    }
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((dest, src) => mix(dest, src, shape));
    
    
    /***/ }),
    /* 74 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony import */ var _data_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(75);
    /* harmony import */ var _node_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(76);
    
    
    
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
        generic: true,
        ..._data_js__WEBPACK_IMPORTED_MODULE_0__["default"],
        node: _node_index_js__WEBPACK_IMPORTED_MODULE_1__
    });
    
    
    /***/ }),
    /* 75 */
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
    /* harmony export */ });
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
        "generic": true,
        "types": {
            "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
            "alpha-value": "<number>|<percentage>",
            "angle-percentage": "<angle>|<percentage>",
            "angular-color-hint": "<angle-percentage>",
            "angular-color-stop": "<color>&&<color-stop-angle>?",
            "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
            "animateable-feature": "scroll-position|contents|<custom-ident>",
            "attachment": "scroll|fixed|local",
            "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
            "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
            "attr-modifier": "i|s",
            "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
            "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
            "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
            "baseline-position": "[first|last]? baseline",
            "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
            "bg-image": "none|<image>",
            "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
            "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
            "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
            "blur()": "blur( <length> )",
            "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
            "box": "border-box|padding-box|content-box",
            "brightness()": "brightness( <number-percentage> )",
            "calc()": "calc( <calc-sum> )",
            "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
            "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
            "calc-value": "<number>|<dimension>|<percentage>|( <calc-sum> )",
            "cf-final-image": "<image>|<color>",
            "cf-mixing-image": "<percentage>?&&<image>",
            "circle()": "circle( [<shape-radius>]? [at <position>]? )",
            "clamp()": "clamp( <calc-sum>#{3} )",
            "class-selector": "'.' <ident-token>",
            "clip-source": "<url>",
            "color": "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
            "color-stop": "<color-stop-length>|<color-stop-angle>",
            "color-stop-angle": "<angle-percentage>{1,2}",
            "color-stop-length": "<length-percentage>{1,2}",
            "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
            "combinator": "'>'|'+'|'~'|['||']",
            "common-lig-values": "[common-ligatures|no-common-ligatures]",
            "compat-auto": "searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button",
            "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
            "compositing-operator": "add|subtract|intersect|exclude",
            "compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
            "compound-selector-list": "<compound-selector>#",
            "complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
            "complex-selector-list": "<complex-selector>#",
            "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
            "contextual-alt-values": "[contextual|no-contextual]",
            "content-distribution": "space-between|space-around|space-evenly|stretch",
            "content-list": "[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>]+",
            "content-position": "center|start|end|flex-start|flex-end",
            "content-replacement": "<image>",
            "contrast()": "contrast( [<number-percentage>] )",
            "counter()": "counter( <counter-name> , <counter-style>? )",
            "counter-style": "<counter-style-name>|symbols( )",
            "counter-style-name": "<custom-ident>",
            "counters()": "counters( <counter-name> , <string> , <counter-style>? )",
            "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
            "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
            "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
            "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
            "display-box": "contents|none",
            "display-inside": "flow|flow-root|table|flex|grid|ruby",
            "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
            "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
            "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
            "display-outside": "block|inline|run-in",
            "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
            "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
            "east-asian-width-values": "[full-width|proportional-width]",
            "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
            "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
            "ending-shape": "circle|ellipse",
            "env()": "env( <custom-ident> , <declaration-value>? )",
            "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
            "family-name": "<string>|<custom-ident>+",
            "feature-tag-value": "<string> [<integer>|on|off]?",
            "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
            "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
            "feature-value-block-list": "<feature-value-block>+",
            "feature-value-declaration": "<custom-ident> : <integer>+ ;",
            "feature-value-declaration-list": "<feature-value-declaration>",
            "feature-value-name": "<custom-ident>",
            "fill-rule": "nonzero|evenodd",
            "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
            "filter-function-list": "[<filter-function>|<url>]+",
            "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
            "fit-content()": "fit-content( [<length>|<percentage>] )",
            "fixed-breadth": "<length-percentage>",
            "fixed-repeat": "repeat( [<integer [1,âˆž]>] , [<line-names>? <fixed-size>]+ <line-names>? )",
            "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
            "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
            "font-variant-css21": "[normal|small-caps]",
            "font-weight-absolute": "normal|bold|<number [1,1000]>",
            "frequency-percentage": "<frequency>|<percentage>",
            "general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
            "generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
            "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
            "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
            "gradient": "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<-legacy-gradient>",
            "grayscale()": "grayscale( <number-percentage> )",
            "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
            "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
            "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
            "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
            "hue": "<number>|<angle>",
            "hue-rotate()": "hue-rotate( <angle> )",
            "image": "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
            "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
            "image-set()": "image-set( <image-set-option># )",
            "image-set-option": "[<image>|<string>] [<resolution>||type( <string> )]",
            "image-src": "<url>|<string>",
            "image-tags": "ltr|rtl",
            "inflexible-breadth": "<length>|<percentage>|min-content|max-content|auto",
            "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
            "invert()": "invert( <number-percentage> )",
            "keyframes-name": "<custom-ident>|<string>",
            "keyframe-block": "<keyframe-selector># { <declaration-list> }",
            "keyframe-block-list": "<keyframe-block>+",
            "keyframe-selector": "from|to|<percentage>",
            "leader()": "leader( <leader-type> )",
            "leader-type": "dotted|solid|space|<string>",
            "length-percentage": "<length>|<percentage>",
            "line-names": "'[' <custom-ident>* ']'",
            "line-name-list": "[<line-names>|<name-repeat>]+",
            "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
            "line-width": "<length>|thin|medium|thick",
            "linear-color-hint": "<length-percentage>",
            "linear-color-stop": "<color> <color-stop-length>?",
            "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
            "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
            "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
            "mask-reference": "none|<image>|<mask-source>",
            "mask-source": "<url>",
            "masking-mode": "alpha|luminance|match-source",
            "matrix()": "matrix( <number>#{6} )",
            "matrix3d()": "matrix3d( <number>#{16} )",
            "max()": "max( <calc-sum># )",
            "media-and": "<media-in-parens> [and <media-in-parens>]+",
            "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
            "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
            "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
            "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
            "media-not": "not <media-in-parens>",
            "media-or": "<media-in-parens> [or <media-in-parens>]+",
            "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
            "media-query-list": "<media-query>#",
            "media-type": "<ident>",
            "mf-boolean": "<mf-name>",
            "mf-name": "<ident>",
            "mf-plain": "<mf-name> : <mf-value>",
            "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
            "mf-value": "<number>|<dimension>|<ident>|<ratio>",
            "min()": "min( <calc-sum># )",
            "minmax()": "minmax( [<length>|<percentage>|min-content|max-content|auto] , [<length>|<percentage>|<flex>|min-content|max-content|auto] )",
            "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
            "namespace-prefix": "<ident>",
            "ns-prefix": "[<ident-token>|'*']? '|'",
            "number-percentage": "<number>|<percentage>",
            "numeric-figure-values": "[lining-nums|oldstyle-nums]",
            "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
            "numeric-spacing-values": "[proportional-nums|tabular-nums]",
            "nth": "<an-plus-b>|even|odd",
            "opacity()": "opacity( [<number-percentage>] )",
            "overflow-position": "unsafe|safe",
            "outline-radius": "<length>|<percentage>",
            "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
            "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
            "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
            "page-selector-list": "[<page-selector>#]?",
            "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
            "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
            "path()": "path( [<fill-rule> ,]? <string> )",
            "paint()": "paint( <ident> , <declaration-value>? )",
            "perspective()": "perspective( <length> )",
            "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
            "position": "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
            "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
            "pseudo-element-selector": "':' <pseudo-class-selector>",
            "pseudo-page": ": [left|right|first|blank]",
            "quote": "open-quote|close-quote|no-open-quote|no-close-quote",
            "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
            "relative-selector": "<combinator>? <complex-selector>",
            "relative-selector-list": "<relative-selector>#",
            "relative-size": "larger|smaller",
            "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
            "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
            "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
            "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
            "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
            "rotate()": "rotate( [<angle>|<zero>] )",
            "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
            "rotateX()": "rotateX( [<angle>|<zero>] )",
            "rotateY()": "rotateY( [<angle>|<zero>] )",
            "rotateZ()": "rotateZ( [<angle>|<zero>] )",
            "saturate()": "saturate( <number-percentage> )",
            "scale()": "scale( <number> , <number>? )",
            "scale3d()": "scale3d( <number> , <number> , <number> )",
            "scaleX()": "scaleX( <number> )",
            "scaleY()": "scaleY( <number> )",
            "scaleZ()": "scaleZ( <number> )",
            "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
            "shape-radius": "<length-percentage>|closest-side|farthest-side",
            "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
            "skewX()": "skewX( [<angle>|<zero>] )",
            "skewY()": "skewY( [<angle>|<zero>] )",
            "sepia()": "sepia( <number-percentage> )",
            "shadow": "inset?&&<length>{2,4}&&<color>?",
            "shadow-t": "[<length>{2,3}&&<color>?]",
            "shape": "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
            "shape-box": "<box>|margin-box",
            "side-or-corner": "[left|right]||[top|bottom]",
            "single-animation": "<time>||<easing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
            "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
            "single-animation-fill-mode": "none|forwards|backwards|both",
            "single-animation-iteration-count": "infinite|<number>",
            "single-animation-play-state": "running|paused",
            "single-transition": "[none|<single-transition-property>]||<time>||<easing-function>||<time>",
            "single-transition-property": "all|<custom-ident>",
            "size": "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
            "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
            "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
            "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
            "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
            "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
            "supports-feature": "<supports-decl>|<supports-selector-fn>",
            "supports-decl": "( <declaration> )",
            "supports-selector-fn": "selector( <complex-selector> )",
            "symbol": "<string>|<image>|<custom-ident>",
            "target": "<target-counter()>|<target-counters()>|<target-text()>",
            "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
            "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
            "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
            "time-percentage": "<time>|<percentage>",
            "easing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
            "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
            "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
            "track-repeat": "repeat( [<integer [1,âˆž]>] , [<line-names>? <track-size>]+ <line-names>? )",
            "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( [<length>|<percentage>] )",
            "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
            "transform-list": "<transform-function>+",
            "translate()": "translate( <length-percentage> , <length-percentage>? )",
            "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
            "translateX()": "translateX( <length-percentage> )",
            "translateY()": "translateY( <length-percentage> )",
            "translateZ()": "translateZ( <length> )",
            "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
            "type-selector": "<wq-name>|<ns-prefix>? '*'",
            "var()": "var( <custom-property-name> , <declaration-value>? )",
            "viewport-length": "auto|<length-percentage>",
            "visual-box": "content-box|padding-box|border-box",
            "wq-name": "<ns-prefix>? <ident-token>",
            "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
            "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
            "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
            "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
            "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
            "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
            "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
            "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
            "-legacy-radial-gradient-shape": "circle|ellipse",
            "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
            "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
            "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
            "-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
            "-non-standard-width": "fill-available|min-intrinsic|intrinsic|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
            "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
            "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
            "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
            "-webkit-gradient-radius": "<length>|<percentage>",
            "-webkit-gradient-type": "linear|radial",
            "-webkit-mask-box-repeat": "repeat|stretch|round",
            "-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
            "-ms-filter-function-list": "<-ms-filter-function>+",
            "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
            "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
            "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
            "-ms-filter": "<string>",
            "age": "child|young|old",
            "attr-name": "<wq-name>",
            "attr-fallback": "<any-value>",
            "border-radius": "<length-percentage>{1,2}",
            "bottom": "<length>|auto",
            "counter": "<counter()>|<counters()>",
            "counter-name": "<custom-ident>",
            "generic-voice": "[<age>? <gender> <integer>?]",
            "gender": "male|female|neutral",
            "left": "<length>|auto",
            "mask-image": "<mask-reference>#",
            "name-repeat": "repeat( [<positive-integer>|auto-fill] , <line-names>+ )",
            "paint": "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
            "ratio": "<integer> / <integer>",
            "right": "<length>|auto",
            "svg-length": "<percentage>|<length>|<number>",
            "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
            "top": "<length>|auto",
            "track-group": "'(' [<string>* <track-minmax> <string>*]+ ')' ['[' <positive-integer> ']']?|<track-minmax>",
            "track-list-v0": "[<string>* <track-group> <string>*]+|none",
            "track-minmax": "minmax( <track-breadth> , <track-breadth> )|auto|<track-breadth>|fit-content",
            "x": "<number>",
            "y": "<number>",
            "declaration": "<ident-token> : <declaration-value>? ['!' important]?",
            "declaration-list": "[<declaration>? ';']* <declaration>?",
            "url": "url( <string> <url-modifier>* )|<url-token>",
            "url-modifier": "<ident>|<function-token> <any-value> )",
            "number-zero-one": "<number [0,1]>",
            "number-one-or-greater": "<number [1,âˆž]>",
            "positive-integer": "<integer [0,âˆž]>",
            "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box"
        },
        "properties": {
            "--*": "<declaration-value>",
            "-ms-accelerator": "false|true",
            "-ms-block-progression": "tb|rl|bt|lr",
            "-ms-content-zoom-chaining": "none|chained",
            "-ms-content-zooming": "none|zoom",
            "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
            "-ms-content-zoom-limit-max": "<percentage>",
            "-ms-content-zoom-limit-min": "<percentage>",
            "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
            "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
            "-ms-content-zoom-snap-type": "none|proximity|mandatory",
            "-ms-filter": "<string>",
            "-ms-flow-from": "[none|<custom-ident>]#",
            "-ms-flow-into": "[none|<custom-ident>]#",
            "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
            "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
            "-ms-high-contrast-adjust": "auto|none",
            "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
            "-ms-hyphenate-limit-lines": "no-limit|<integer>",
            "-ms-hyphenate-limit-zone": "<percentage>|<length>",
            "-ms-ime-align": "auto|after",
            "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
            "-ms-scrollbar-3dlight-color": "<color>",
            "-ms-scrollbar-arrow-color": "<color>",
            "-ms-scrollbar-base-color": "<color>",
            "-ms-scrollbar-darkshadow-color": "<color>",
            "-ms-scrollbar-face-color": "<color>",
            "-ms-scrollbar-highlight-color": "<color>",
            "-ms-scrollbar-shadow-color": "<color>",
            "-ms-scrollbar-track-color": "<color>",
            "-ms-scroll-chaining": "chained|none",
            "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
            "-ms-scroll-limit-x-max": "auto|<length>",
            "-ms-scroll-limit-x-min": "<length>",
            "-ms-scroll-limit-y-max": "auto|<length>",
            "-ms-scroll-limit-y-min": "<length>",
            "-ms-scroll-rails": "none|railed",
            "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
            "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
            "-ms-scroll-snap-type": "none|proximity|mandatory",
            "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
            "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
            "-ms-scroll-translation": "none|vertical-to-horizontal",
            "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
            "-ms-touch-select": "grippers|none",
            "-ms-user-select": "none|element|text",
            "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
            "-ms-wrap-margin": "<length>",
            "-ms-wrap-through": "wrap|none",
            "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
            "-moz-binding": "<url>|none",
            "-moz-border-bottom-colors": "<color>+|none",
            "-moz-border-left-colors": "<color>+|none",
            "-moz-border-right-colors": "<color>+|none",
            "-moz-border-top-colors": "<color>+|none",
            "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
            "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
            "-moz-force-broken-image-icon": "0|1",
            "-moz-image-region": "<shape>|auto",
            "-moz-orient": "inline|block|horizontal|vertical",
            "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
            "-moz-outline-radius-bottomleft": "<outline-radius>",
            "-moz-outline-radius-bottomright": "<outline-radius>",
            "-moz-outline-radius-topleft": "<outline-radius>",
            "-moz-outline-radius-topright": "<outline-radius>",
            "-moz-stack-sizing": "ignore|stretch-to-fit",
            "-moz-text-blink": "none|blink",
            "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
            "-moz-user-input": "auto|none|enabled|disabled",
            "-moz-user-modify": "read-only|read-write|write-only",
            "-moz-window-dragging": "drag|no-drag",
            "-moz-window-shadow": "default|menu|tooltip|sheet|none",
            "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
            "-webkit-border-before": "<'border-width'>||<'border-style'>||<color>",
            "-webkit-border-before-color": "<color>",
            "-webkit-border-before-style": "<'border-style'>",
            "-webkit-border-before-width": "<'border-width'>",
            "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
            "-webkit-line-clamp": "none|<integer>",
            "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
            "-webkit-mask-attachment": "<attachment>#",
            "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
            "-webkit-mask-composite": "<composite-style>#",
            "-webkit-mask-image": "<mask-reference>#",
            "-webkit-mask-origin": "[<box>|border|padding|content]#",
            "-webkit-mask-position": "<position>#",
            "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
            "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
            "-webkit-mask-repeat": "<repeat-style>#",
            "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
            "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
            "-webkit-mask-size": "<bg-size>#",
            "-webkit-overflow-scrolling": "auto|touch",
            "-webkit-tap-highlight-color": "<color>",
            "-webkit-text-fill-color": "<color>",
            "-webkit-text-stroke": "<length>||<color>",
            "-webkit-text-stroke-color": "<color>",
            "-webkit-text-stroke-width": "<length>",
            "-webkit-touch-callout": "default|none",
            "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
            "accent-color": "auto|<color>",
            "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
            "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
            "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
            "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
            "all": "initial|inherit|unset|revert",
            "animation": "<single-animation>#",
            "animation-delay": "<time>#",
            "animation-direction": "<single-animation-direction>#",
            "animation-duration": "<time>#",
            "animation-fill-mode": "<single-animation-fill-mode>#",
            "animation-iteration-count": "<single-animation-iteration-count>#",
            "animation-name": "[none|<keyframes-name>]#",
            "animation-play-state": "<single-animation-play-state>#",
            "animation-timing-function": "<easing-function>#",
            "appearance": "none|auto|textfield|menulist-button|<compat-auto>",
            "aspect-ratio": "auto|<ratio>",
            "azimuth": "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
            "backdrop-filter": "none|<filter-function-list>",
            "backface-visibility": "visible|hidden",
            "background": "[<bg-layer> ,]* <final-bg-layer>",
            "background-attachment": "<attachment>#",
            "background-blend-mode": "<blend-mode>#",
            "background-clip": "<box>#",
            "background-color": "<color>",
            "background-image": "<bg-image>#",
            "background-origin": "<box>#",
            "background-position": "<bg-position>#",
            "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
            "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
            "background-repeat": "<repeat-style>#",
            "background-size": "<bg-size>#",
            "block-overflow": "clip|ellipsis|<string>",
            "block-size": "<'width'>",
            "border": "<line-width>||<line-style>||<color>",
            "border-block": "<'border-top-width'>||<'border-top-style'>||<color>",
            "border-block-color": "<'border-top-color'>{1,2}",
            "border-block-style": "<'border-top-style'>",
            "border-block-width": "<'border-top-width'>",
            "border-block-end": "<'border-top-width'>||<'border-top-style'>||<color>",
            "border-block-end-color": "<'border-top-color'>",
            "border-block-end-style": "<'border-top-style'>",
            "border-block-end-width": "<'border-top-width'>",
            "border-block-start": "<'border-top-width'>||<'border-top-style'>||<color>",
            "border-block-start-color": "<'border-top-color'>",
            "border-block-start-style": "<'border-top-style'>",
            "border-block-start-width": "<'border-top-width'>",
            "border-bottom": "<line-width>||<line-style>||<color>",
            "border-bottom-color": "<'border-top-color'>",
            "border-bottom-left-radius": "<length-percentage>{1,2}",
            "border-bottom-right-radius": "<length-percentage>{1,2}",
            "border-bottom-style": "<line-style>",
            "border-bottom-width": "<line-width>",
            "border-collapse": "collapse|separate",
            "border-color": "<color>{1,4}",
            "border-end-end-radius": "<length-percentage>{1,2}",
            "border-end-start-radius": "<length-percentage>{1,2}",
            "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
            "border-image-outset": "[<length>|<number>]{1,4}",
            "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
            "border-image-slice": "<number-percentage>{1,4}&&fill?",
            "border-image-source": "none|<image>",
            "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
            "border-inline": "<'border-top-width'>||<'border-top-style'>||<color>",
            "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<color>",
            "border-inline-color": "<'border-top-color'>{1,2}",
            "border-inline-style": "<'border-top-style'>",
            "border-inline-width": "<'border-top-width'>",
            "border-inline-end-color": "<'border-top-color'>",
            "border-inline-end-style": "<'border-top-style'>",
            "border-inline-end-width": "<'border-top-width'>",
            "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<color>",
            "border-inline-start-color": "<'border-top-color'>",
            "border-inline-start-style": "<'border-top-style'>",
            "border-inline-start-width": "<'border-top-width'>",
            "border-left": "<line-width>||<line-style>||<color>",
            "border-left-color": "<color>",
            "border-left-style": "<line-style>",
            "border-left-width": "<line-width>",
            "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
            "border-right": "<line-width>||<line-style>||<color>",
            "border-right-color": "<color>",
            "border-right-style": "<line-style>",
            "border-right-width": "<line-width>",
            "border-spacing": "<length> <length>?",
            "border-start-end-radius": "<length-percentage>{1,2}",
            "border-start-start-radius": "<length-percentage>{1,2}",
            "border-style": "<line-style>{1,4}",
            "border-top": "<line-width>||<line-style>||<color>",
            "border-top-color": "<color>",
            "border-top-left-radius": "<length-percentage>{1,2}",
            "border-top-right-radius": "<length-percentage>{1,2}",
            "border-top-style": "<line-style>",
            "border-top-width": "<line-width>",
            "border-width": "<line-width>{1,4}",
            "bottom": "<length>|<percentage>|auto",
            "box-align": "start|center|end|baseline|stretch",
            "box-decoration-break": "slice|clone",
            "box-direction": "normal|reverse|inherit",
            "box-flex": "<number>",
            "box-flex-group": "<integer>",
            "box-lines": "single|multiple",
            "box-ordinal-group": "<integer>",
            "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
            "box-pack": "start|center|end|justify",
            "box-shadow": "none|<shadow>#",
            "box-sizing": "content-box|border-box",
            "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
            "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
            "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
            "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
            "caret-color": "auto|<color>",
            "clear": "none|left|right|both|inline-start|inline-end",
            "clip": "<shape>|auto",
            "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
            "color": "<color>",
            "color-adjust": "economy|exact",
            "color-scheme": "normal|[light|dark|<custom-ident>]+",
            "column-count": "<integer>|auto",
            "column-fill": "auto|balance|balance-all",
            "column-gap": "normal|<length-percentage>",
            "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
            "column-rule-color": "<color>",
            "column-rule-style": "<'border-style'>",
            "column-rule-width": "<'border-width'>",
            "column-span": "none|all",
            "column-width": "<length>|auto",
            "columns": "<'column-width'>||<'column-count'>",
            "contain": "none|strict|content|[size||layout||style||paint]",
            "content": "normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>]+]?",
            "content-visibility": "visible|auto|hidden",
            "counter-increment": "[<counter-name> <integer>?]+|none",
            "counter-reset": "[<counter-name> <integer>?]+|none",
            "counter-set": "[<counter-name> <integer>?]+|none",
            "cursor": "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
            "direction": "ltr|rtl",
            "display": "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
            "empty-cells": "show|hide",
            "filter": "none|<filter-function-list>|<-ms-filter-function-list>",
            "flex": "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
            "flex-basis": "content|<'width'>",
            "flex-direction": "row|row-reverse|column|column-reverse",
            "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
            "flex-grow": "<number>",
            "flex-shrink": "<number>",
            "flex-wrap": "nowrap|wrap|wrap-reverse",
            "float": "left|right|none|inline-start|inline-end",
            "font": "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
            "font-family": "[<family-name>|<generic-family>]#",
            "font-feature-settings": "normal|<feature-tag-value>#",
            "font-kerning": "auto|normal|none",
            "font-language-override": "normal|<string>",
            "font-optical-sizing": "auto|none",
            "font-variation-settings": "normal|[<string> <number>]#",
            "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
            "font-size-adjust": "none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]",
            "font-smooth": "auto|never|always|<absolute-size>|<length>",
            "font-stretch": "<font-stretch-absolute>",
            "font-style": "normal|italic|oblique <angle>?",
            "font-synthesis": "none|[weight||style||small-caps]",
            "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
            "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
            "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
            "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
            "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
            "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
            "font-variant-position": "normal|sub|super",
            "font-weight": "<font-weight-absolute>|bolder|lighter",
            "forced-color-adjust": "auto|none",
            "gap": "<'row-gap'> <'column-gap'>?",
            "grid": "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
            "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
            "grid-auto-columns": "<track-size>+",
            "grid-auto-flow": "[row|column]||dense",
            "grid-auto-rows": "<track-size>+",
            "grid-column": "<grid-line> [/ <grid-line>]?",
            "grid-column-end": "<grid-line>",
            "grid-column-gap": "<length-percentage>",
            "grid-column-start": "<grid-line>",
            "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
            "grid-row": "<grid-line> [/ <grid-line>]?",
            "grid-row-end": "<grid-line>",
            "grid-row-gap": "<length-percentage>",
            "grid-row-start": "<grid-line>",
            "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
            "grid-template-areas": "none|<string>+",
            "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
            "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
            "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
            "height": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )",
            "hyphens": "none|manual|auto",
            "image-orientation": "from-image|<angle>|[<angle>? flip]",
            "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
            "image-resolution": "[from-image||<resolution>]&&snap?",
            "ime-mode": "auto|normal|active|inactive|disabled",
            "initial-letter": "normal|[<number> <integer>?]",
            "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
            "inline-size": "<'width'>",
            "inset": "<'top'>{1,4}",
            "inset-block": "<'top'>{1,2}",
            "inset-block-end": "<'top'>",
            "inset-block-start": "<'top'>",
            "inset-inline": "<'top'>{1,2}",
            "inset-inline-end": "<'top'>",
            "inset-inline-start": "<'top'>",
            "isolation": "auto|isolate",
            "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
            "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
            "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
            "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
            "left": "<length>|<percentage>|auto",
            "letter-spacing": "normal|<length-percentage>",
            "line-break": "auto|loose|normal|strict|anywhere",
            "line-clamp": "none|<integer>",
            "line-height": "normal|<number>|<length>|<percentage>",
            "line-height-step": "<length>",
            "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
            "list-style-image": "<image>|none",
            "list-style-position": "inside|outside",
            "list-style-type": "<counter-style>|<string>|none",
            "margin": "[<length>|<percentage>|auto]{1,4}",
            "margin-block": "<'margin-left'>{1,2}",
            "margin-block-end": "<'margin-left'>",
            "margin-block-start": "<'margin-left'>",
            "margin-bottom": "<length>|<percentage>|auto",
            "margin-inline": "<'margin-left'>{1,2}",
            "margin-inline-end": "<'margin-left'>",
            "margin-inline-start": "<'margin-left'>",
            "margin-left": "<length>|<percentage>|auto",
            "margin-right": "<length>|<percentage>|auto",
            "margin-top": "<length>|<percentage>|auto",
            "margin-trim": "none|in-flow|all",
            "mask": "<mask-layer>#",
            "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
            "mask-border-mode": "luminance|alpha",
            "mask-border-outset": "[<length>|<number>]{1,4}",
            "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
            "mask-border-slice": "<number-percentage>{1,4} fill?",
            "mask-border-source": "none|<image>",
            "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
            "mask-clip": "[<geometry-box>|no-clip]#",
            "mask-composite": "<compositing-operator>#",
            "mask-image": "<mask-reference>#",
            "mask-mode": "<masking-mode>#",
            "mask-origin": "<geometry-box>#",
            "mask-position": "<position>#",
            "mask-repeat": "<repeat-style