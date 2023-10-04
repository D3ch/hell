/* Generated Tue, 12 Jul 2016 15:21:59 -0400 */

/**
 * @license
 * Copyright (c) 2015 Newgrounds Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 
 /* start namespaces.js */

if (typeof(Newgrounds) == 'undefined') {
	/**
	 * Newgrounds namespace
	 * @namespace
	 */
	Newgrounds = {};
}

/**
 * Newgrounds.io namespace
 * @memberof Newgrounds
 * @type {object}
 * @version 1.0
 * @namespace Newgrounds.io
 */
Newgrounds.io = {
	/**
	 * @property {string} GATEWAY_URI - The script all commands get posted to
	 */
	GATEWAY_URI: '//newgrounds.io/gateway_v3.php'
};

/**
 * Newgrounds.io.events namespace
 * @memberof Newgrounds.io
 * @type {object}
 * @namespace Newgrounds.io.events
 */
Newgrounds.io.events = {};


/**
 * Newgrounds.io.call_validators namespace
 * @memberof Newgrounds.io
 * @type {object}
 * @namespace Newgrounds.io.call_validators
 */
Newgrounds.io.call_validators = {};

/**
 * Newgrounds.io.model namespace
 * @memberof Newgrounds.io
 * @type {object}
 * @namespace Newgrounds.io.model
 */
Newgrounds.io.model = {
	/* Used to enforce strict typing */
	checkStrictValue: function(classname, property, value, type, model, array_type, array_model) {
		if (type == 'mixed') return true;
		if (value === null || typeof(value) == 'undefined') return true;
		if (type && value.constructor === type) return true;
		if (type == Boolean && value.constructor === Number) return true;
		if (model && value.constructor === Newgrounds.io.model[model]) return true;
		if (value.constructor === Array && (array_type || array_model)) {
			for (var i=0; i<value.length; i++) {
				this.checkStrictValue(classname, property, value[i], array_type, array_model, null, null);
			}
			return true;
		}
		
		if (classname) throw new Error("Illegal '"+property+"' value set in model "+classname);
		
		return false;
	}
}

/* end namespaces.js */

/* start events.js */

/**
 * Contains data output by the Newgrounds.io server for use in event listeners
 * @constructor
 * @memberof Newgrounds.io.events
 * @param {string} type - The name of the event, typically the component name.
 * @param {Newgrounds.io.model.call} call - The call object that was posted to the server.
 * @param {(object|object[])} data - The results from the server.
 * @property {string} type - The name of the event, typically the component name.
 * @property {boolean} success - Will be true if the call was successful.
 * @property {Newgrounds.io.model.call} call - The call object that was posted to the server.
 * @property {(object|object[])} data - The results from the server.
 * @property {boolean} preventDefault - If set to true, event will not perform default behaviour (if any).
 */
Newgrounds.io.events.OutputEvent = function(type, call, data) {
	this.type = type;
	this.call = call;
	this.data = data;
	this.success = data && typeof(data['success'] != 'undefined') ? (data.success ? true:false) : false;
	this.preventDefault = false;
}
Newgrounds.io.events.OutputEvent.prototype.constructor = Newgrounds.io.events.OutputEvent;

/**
 * Contains data used when working with sessions
 * @constructor
 * @memberof Newgrounds.io.events
 * @param {string} type - The name of the event, typically a Newgrounds.io.events.SessionEvent constant.
 * @property {string} type - The name of the event, typically the component name.
 * @property {Newgrounds.io.model.user} user - The user associated with the session (if any).
 * @property {string} passport_url - A URL where the user can sign in securely.
 */
Newgrounds.io.events.SessionEvent = function(type) {
	this.type = type;
	this.user = null;
	this.passport_url = null;
}

/**
 * @constant
 * @type {string}
 */
Newgrounds.io.events.SessionEvent.USER_LOADED = 'user-loaded';

/**
 * @constant
 * @type {string}
 */
Newgrounds.io.events.SessionEvent.SESSION_EXPIRED = 'session-expired';

/**
 * @constant
 * @type {string}
 */
Newgrounds.io.events.SessionEvent.REQUEST_LOGIN = 'request-login';

Newgrounds.io.events.SessionEvent.prototype.constructor = Newgrounds.io.events.SessionEvent;

/**
 * Class for listening to and dispatching events.
 * @constructor
 * @memberof Newgrounds.io.events
 */
Newgrounds.io.events.EventDispatcher = function() {};
Newgrounds.io.events.EventDispatcher.prototype = {
	
	_event_listeners: {},
	
	/**
	 * Adds a listener function to the specified event.
	 * @instance
	 * @memberof Newgrounds.io.events.EventDispatcher
	 * @function addEventListener
	 * @param {string} type - The event name to listen for.
	 * @param {function} listener - A function to call when the event is triggered.
	 */
	addEventListener: function(type, listener) {
		if (type.constructor !== String) throw new Error('Event names must be a string format.');
		if (listener.constructor !== Function) throw new Error('Event listeners must be functions.');
		
		if (typeof(this._event_listeners[type]) == 'undefined') this._event_listeners[type] = [];
		this._event_listeners[type].push(listener);
	},
	
	/**
	 * Removes a listener function from the specified event.
	 * @instance
	 * @memberof Newgrounds.io.events.EventDispatcher
	 * @function removeEventListener
	 * @param {string} type - The event name you want to remove a listener from.
	 * @param {function} listener - The listener function you want to remove.
	 * @return {boolean} Returns true if a matching listener was removed.
	 */
	removeEventListener: function(type, listener) {
		if (typeof(this._event_listeners[type]) == 'undefined') return;
		var index=-1;
		for(i=0; i<this._event_listeners[type].length; i++) {
			if (this._event_listeners[type][i] === listener) {
				index = i;
				break;
			}
		}
		if (index >= 0) {
			this._event_listeners[type].splice(index,1);
			return true;
		}
		return false;
	},
	
	/**
	 * Removes ALL listener functions from the specified event.
	 * @instance
	 * @memberof Newgrounds.io.events.EventDispatcher
	 * @function removeAllEventListeners
	 * @param {string} type - The event name you want to remove listeners from.
	 * @return {number} The number of listeners that were removed.
	 */
	removeAllEventListeners: function(type) {
		if (typeof(this._event_listeners[type]) == 'undefined') return 0;
		var removed = this._event_listeners[type].length;
		this._event_listeners[type] = [];
		return removed;
	},
	
	/**
	 * Dispatches an event to any listener functions.
	 * @instance
	 * @memberof Newgrounds.io.events.EventDispatcher
	 * @function dispatchEvent
	 * @param event - The event to dispatch.
	 * @return {boolean}
	 */
	dispatchEvent: function(event) {
		var valid = false;
		var listener;
		for(var e in Newgrounds.io.events) {
			if(event.constructor === Newgrounds.io.events[e]) {
				valid = true;
				break;
			}
		}
		if (!valid) throw new Error('Unsupported event object');
		if (typeof(this._event_listeners[event.type]) == 'undefined') return false;
		for(var i=0; i<this._event_listeners[event.type].length; i++) {
			listener = this._event_listeners[event.type][i];
			if (listener(event) === false || event.preventDefault) return true;
		}
		return true;
	}
};
Newgrounds.io.events.EventDispatcher.prototype.constructor = Newgrounds.io.events.EventDispatcher;


/* end events.js */

/* start core.js */

/**
 * Handles making calls and processing results to the Newgrounds.io server
 * @constructor
 * @memberof Newgrounds.io
 * @property {boolean} debug - Set to true to operate in debug mode
 * @property {string} app_id - Your unique app ID (found in the 'API Tools' section of your Newgrounds.com project).
 * @property {Newgrounds.io.model.user} user - A user associated with an active session id. Use getSessionLoader to load.
 * @property {string} session_id - A user session id (acquire with App.startSession call).
 * @param {string} [app_id] - Your unique app ID (found in the 'API Tools' section of your Newgrounds.com project).
 * @param {string} [aes_key] - Your AES-128 encryption key (in Base64 format).
 */
Newgrounds.io.core = function(app_id, aes_key) {

	var _app_id;
	var _session_id;
	var _user;
	var _debug;
	var ngio = this;
	var _aes_key;
	
	var _urlhelper = new Newgrounds.io.urlHelper();
	if (_urlhelper.getRequestQueryParam("ngio_session_id")) {
		_session_id = _urlhelper.getRequestQueryParam("ngio_session_id");
	}
		
	Object.defineProperty(this, 'app_id', {
		get: function() {
			return _app_id;
		}
	});
	
	Object.defineProperty(this, 'user', {
		get: function() {
			return this.getCurrentUser();
		}
	});
	
	Object.defineProperty(this, 'session_id', {
		set: function(id) {
			if (id && typeof(id) != 'string') throw new Error("'session_id' must be a string value.");
			_session_id = id ? id : null;
		},
		get: function() {
			return _session_id ? _session_id : null;
		}
	});
	
	Object.defineProperty(this, 'debug', {
		set: function(debug) {
			_debug = debug ? true:false;
		},
		get: function() {
			return _debug;
		}
	});
	
	if (!app_id) throw new Error("Missing required 'app_id' in Newgrounds.io.core constructor");
	if (typeof(app_id) != 'string') throw new Error("'app_id' must be a string value in Newgrounds.io.core constructor");
	_app_id = app_id;
	
	if (aes_key) _aes_key = CryptoJS.enc.Base64.parse(aes_key);
	else console.warn("You did not set an encryption key. Some calls may not work without this.");
	
	var _session_storage_key = "Newgrounds-io-app_session-"+(_app_id.split(":").join("-"));
	
	function checkLocalStorage() {
		if (typeof(localStorage) != 'undefined' && localStorage && localStorage.getItem.constructor == Function) return true;
		console.warn('localStorage unavailable. Are you running from a web server?');
		return false;
	}
	
	function getStoredSession() {
		if (!checkLocalStorage()) return null;
		var id = localStorage.getItem(_session_storage_key);
		return id ? id : null;
	}
	
	function setStoredSession(id) {
		if (!checkLocalStorage()) return null;
		localStorage.setItem(_session_storage_key, id);
	}
	
	function clearStoredSession() {
		if (!checkLocalStorage()) return null;
		localStorage.removeItem(_session_storage_key);
	}
	
	if (!_session_id && getStoredSession()) _session_id = getStoredSession();
	
	this.addEventListener('App.endSession', function(e) {
		ngio.session_id = null;
		clearStoredSession();
	});
	
	this.addEventListener('App.startSession', function(e) {
		if (e.success) ngio.session_id = e.data.session.id;
	});
	
	this.addEventListener('App.checkSession', function(e) {
		if (e.success) {
			if (e.data.session.expired) {
				clearStoredSession();
				this.session_id = null;
			} else if (e.data.session.remember) {
				setStoredSession(e.data.session.id);
			}
		} else {
			this.session_id = null;
			clearStoredSession();
		}
	});
	
	this._encryptCall = function(call_model) {
		if (!call_model || !call_model.constructor == Newgrounds.io.model.call_model) throw new Error("Attempted to encrypt a non 'call' object");
		var iv  = CryptoJS.lib.WordArray.random(16);
		var encrypted = CryptoJS.AES.encrypt(JSON.stringify(call_model.toObject()), _aes_key, { iv: iv });
		var output = CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
		
		call_model.secure = output;
		call_model.parameters = null;
		return call_model;
	};
}

Newgrounds.io.core.prototype = {
	
	_session_loader: null,
	_call_queue: [],
	_event_listeners: {},
	
	/**
	 * Adds a listener function to the specified event.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function addEventListener
	 * @param {string} type - The event to listen for. Typically a component name like 'Gateway.getVersion'.
	 * @param {function} listener - A function to call when the event is triggered.
	 */
	addEventListener: Newgrounds.io.events.EventDispatcher.prototype.addEventListener,
	
	/**
	 * Removes a listener function from the specified event.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function removeEventListener
	 * @param {string} type - The event you want to remove a listener from. Typically a component name like 'Gateway.getVersion'.
	 * @param {function} listener - The listener function you want to remove.
	 * @return {boolean} Returns true if a matching listener was removed.
	 */
	removeEventListener: Newgrounds.io.events.EventDispatcher.prototype.removeEventListener,
	
	/**
	 * Removes ALL listener functions from the specified event.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function removeAllEventListeners
	 * @param {string} type - The event you want to remove listeners from.
	 * @return {number} The number of listeners that were removed.
	 */
	removeAllEventListeners: Newgrounds.io.events.EventDispatcher.prototype.removeAllEventListeners,
	
	/**
	 * Dispatches an event to any listener functions.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function dispatchEvent
	 * @param {Newgrounds.io.events.OutputEvent} event - The event to dispatch.
	 * @return {boolean}
	 */
	dispatchEvent: Newgrounds.io.events.EventDispatcher.prototype.dispatchEvent,
	
	/**
	 * Gets an initialized Newgrounds.io.SessionLoader instance.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function getSessionLoader
	 * @return {Newgrounds.io.SessionLoader}
	 */
	getSessionLoader: function() {
		if (this._session_loader == null) this._session_loader = new Newgrounds.io.SessionLoader(this);
		return this._session_loader;
	},
	/**
	 * Gets the current active session, if any.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function getSession
	 * @return {Newgrounds.io.model.session}
	 */
	getSession: function() {
		return this.getSessionLoader().session;
	},
	
	/**
	 * Gets the current logged in user, if available.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function getCurrentUser
	 * @return {Newgrounds.io.model.user}
	 */
	getCurrentUser: function() {
		var sl = this.getSessionLoader();
		if (sl.session) return sl.session.user;
		return null;
	},
	
	/**
	 * Gets the last login error (if any).
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function getLoginError
	 * @return {Newgrounds.io.model.error}
	 */
	getLoginError: function() {
		return this.getSessionLoader().last_error;
	},
	
	/**
	 * Gets an active session. If one does not already exist, one will be created.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function getValidSession
	 * @param {Newgrounds.io.SessionLoader~onStatusUpdate} [callback] - An optional callback function.
	 * @param {object} [context] - The context under which to call the callback. Optional.
	 */
	getValidSession: function(callback, context) {
		this.getSessionLoader().getValidSession(callback, context);
	},
	
	/**
	 * Loads Newgrounds Passport and waits for the user to log in, or cancel their login.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function requestLogin
	 * @param {function} [on_logged_in] - A function that will execute when the user is logged in
	 * @param {function} [on_login_failed] - A function that will execute if the login fails
	 * @param {function} [on_login_cancelled] - A function that will execute if the user cancels the login.
	 * @param {object} [context] - The context under which the callbacks will be called. Optional.
	 */
	requestLogin: function(on_logged_in, on_login_failed, on_login_cancelled, context) {
		
		if (!on_logged_in || on_logged_in.constructor !== Function) throw ("Missing required callback for 'on_logged_in'.");
		if (!on_login_failed || on_login_failed.constructor !== Function) throw ("Missing required callback for 'on_login_failed'.");
		
		var io = this;
		var loader = this.getSessionLoader();
		var login_interval;
		
		function end_request() {
			if (login_interval) clearInterval(login_interval);
			io.removeEventListener("cancelLoginRequest", cancel_request);
			loader.closePassport();
		}
		
		function cancel_request() {
			on_login_cancelled && on_login_cancelled.constructor === Function ? on_login_cancelled.call(context) : on_login_failed.call(context);
			end_request();
		}
		
		io.addEventListener("cancelLoginRequest", cancel_request);
		
		if (io.getCurrentUser()) {
			on_logged_in.call(context);
		} else {
			loader.loadPassport();
			login_interval = setInterval(function(){
				loader.checkSession(function(session) {
					if (!session || session.expired) {
						if (loader.last_error.code == 111) {
							cancel_request();
						} else {
							end_request();
							on_login_failed.call(context);
						}
					} else if (session.user) {
						end_request();
						on_logged_in.call(context);
					}
				});
			}, 3000);
		}
	},
	
	/**
	 * Cancels any pending login request created via requestLogin()
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function cancelLoginRequest
	 */
	cancelLoginRequest: function() {
		event = new Newgrounds.io.events.OutputEvent("cancelLoginRequest",null,null);
		this.dispatchEvent(event);
	},
	
	/**
	 * Ends any active user session and logs the user out of Newgrounds Passport.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function logOut
	 * @param {Newgrounds.io.SessionLoader~onStatusUpdate} [callback] - An optional callback function.
	 * @param {object} [context] - The context under which to call the callback. Optional.
	 */
	logOut: function(callback, context) {
		this.getSessionLoader().endSession(callback, context);
	},
	
	/**
	 * Adds a component call to the queue. Will be executed later with executeCall.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function queueComponent
	 * @param {string} component - The component to call, ie 'Gateway.ping'
	 * @param {(object|object[])} [parameters] - Parameters being passed to the component. You may also pass multiple parameters objects in an array to execute the component multiple times.
	 * @param {Newgrounds.io.core~onCallResult} [callback] - A function that will execute when this call has executed.
	 * @param {object} [context] - The context under which the callback will be executed. Optional.
	 */
	queueComponent: function(component, parameters, callback, context) {
		if (parameters && parameters.constructor ===  Function && !callback) {
			callback = parameters;
			parameters = null;
		}
		
		var call_model = new Newgrounds.io.model.call(this);
		call_model.component = component;
		if (typeof(parameters) != 'undefined') call_model.parameters = parameters;
		this._validateCall(call_model);
		
		this._call_queue.push([call_model,callback,context]);
	},
	
	/**
	 * Executes any queued calls and resets the queue.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function executeQueue
	 */
	executeQueue: function() {
		var calls = [];
		var callbacks = [];
		var contexts = [];
		for(var i=0; i<this._call_queue.length; i++) {
			calls.push(this._call_queue[i][0]);
			callbacks.push(this._call_queue[i][1]);
			contexts.push(this._call_queue[i][2]);
		}
		
		this._doCall(calls, callbacks, contexts);
		
		this._call_queue = [];
	},
	
	/**
	 * Executes a call to a single component.
	 * @instance
	 * @memberof Newgrounds.io.core
	 * @function callComponent
	 * @param {string} component - The component to call, ie 'Gateway.ping'
	 * @param {(object|object[])} [parameters] - Parameters being passed to the component. You may also pass multiple parameters objects in an array to execute the component multiple times.
	 * @param {Newgrounds.io.core~onCallResult} [callback] - A function that will execute when this call has executed.
	 * @param {object} [context] - The context under which the callback will be executed. Optional.
	 */
	callComponent: function(component, parameters, callback, context) {
	
		if (parameters.constructor ===  Function && !callback) {
			callback = parameters;
			parameters = null;
		}
		
		var call_model = new Newgrounds.io.model.call(this);
		call_model.component = component;
		if (typeof(parameters) != 'undefined') call_model.parameters = parameters;
		
		this._validateCall(call_model);
		this._doCall(call_model, callback, context);
	},
	
	_doCallback: function(call_model, callback, o_return, context) {
		
		var i, x_return, x_callback, x_call, x_context;
		
		// generic catch-all error
		var o_error = {success:false,error:{code:0,message:"Unexpected Server Response"}};
		
		if (typeof(o_return) == 'undefined') o_return = null;
		
		// if we sent an array of calls, we'll need to check for an array of callbacks
		if (call_model.constructor ===  Array && callback && callback.constructor ===  Array) {
		
			for(i=0; i<call_model.length; i++) {
				x_return = (!o_return || typeof(o_return[i]) == 'undefined') ? o_error : o_return[i];
				x_callback = typeof(callback[i]) == 'undefined' ? null:callback[i];
				this._doCallback(call_model[i], x_callback, x_return, context[i]);
			}			
			return;
			
		}
		
		if (o_return && typeof(o_return['data']) != 'undefined') {
			var data;
			if (o_return.data.constructor === Array) {
				data = [];
				for(i=0; i<o_return.data.length; i++) {
					data.push(this._formatResults(o_return.component, o_return.data[i]))
				}
			} else {
				data = this._formatResults(o_return.component, o_return.data);
			}
			o_return.data = data;
		}
		
		var o_data;
		
		if (o_return) {
			if (typeof(o_return['data']) != 'undefined') {
				o_data = o_return.data;
			} else {
				console.warn("Received empty data from '"+call_model.component+"'.");
				o_data = null;
			}
		} else {
			o_data = o_error;
		}
		
		var event;
		if (o_data.constructor === Array) {
			for(i=0; i<o_data.length; i++) {
				event = new Newgrounds.io.events.OutputEvent(call_model.component, call_model[i], o_data[i]);
				this.dispatchEvent(event);
			}
		} else {
			event = new Newgrounds.io.events.OutputEvent(call_model.component, call_model, o_data);
			this.dispatchEvent(event);
		}
		
		// if we get here we found an actual callback function
		if (callback && callback.constructor ===  Function) {
			callback.call(context, o_data);
		}

	},
	
	_formatResults: function(component, result_object) {
		var model, i, j, models, model_name, validator = null;
		
		if (typeof(result_object.success) != 'undefined' && result_object.success) {
			validator = Newgrounds.io.call_validators.getValidator(component);
		}
		
		if (!validator) return result_object;
		
		var formats = validator.returns;
		
		for(i in formats) {
			if (typeof(result_object[i]) == 'undefined' && result_object.success !== false) {
				console.warn("Newgrounds.io server failed to return expected '"+i+"' in '"+component+"' data.");
				continue;
			}
			
			if (typeof(formats[i]['array']) != 'undefined') {
				
				if (typeof(formats[i]['array']['object']) != 'undefined') {	
					model_name = formats[i]['array']['object'];
				} else {
					model_name = formats[i]['array'];
				}
				
				if (typeof(Newgrounds.io.model[model_name]) == 'undefined') {
					console.warn("Received unsupported model '"+model_name+"' from '"+component+"'.");
					continue;
				}
				
				if (result_object[i].constructor !== Array) {
					console.warn("Expected array<"+model_name+"> value for '"+i+"' in '"+component+"' data, got "+typeof(result_object[i]));
					continue;
				}
				models = [];
				for(j=0; j<result_object[i].length; j++) {
					model = new Newgrounds.io.model[model_name](this);
					model.fromObject(result_object[i][j]);
					models.push(model);
				}
				result_object[i] = models;
				
			} else if (typeof(formats[i]['object']) != 'undefined' && result_object[i]) {
				model_name = formats[i]['object'];
				if (typeof(Newgrounds.io.model[model_name]) == 'undefined') {
					console.warn("Received unsupported model '"+model_name+"' from '"+component+"'.");
					continue;
				}
				model = new Newgrounds.io.model[model_name](this);
				model.fromObject(result_object[i]);
				result_object[i] = model;
			}
		}
		return result_object;
	},
	
	_doCall: function(call_model, callback, context) {
	
		if (!this.app_id) throw new Error('Attempted to call Newgrounds.io server without setting an app_id in Newgrounds.io.core instance.');
		
		var call_object;
		var is_redirect = false;
		var io=this;
		
		function checkRedirect(model) {
			var validator = Newgrounds.io.call_validators.getValidator(model.component);
			if (validator.hasOwnProperty('redirect') && validator.redirect) {
				var parameters = model.parameters;
				if (!parameters || !parameters.hasOwnProperty('redirect') || parameters.redirect) {
					return true;
				}
			}
			return false;
		}
		
		if (call_model.constructor === Array) {
			call_object = [];
			for(i=0; i<call_model.length; i++) {
				if (checkRedirect(call_model[i])) {
					throw new Error("Loader components can not be called in an array without a redirect=false parameter.");
				}
				call_object.push(call_model[i].toObject());
			}
		} else {
			call_object = call_model.toObject();
			is_redirect = checkRedirect(call_model);
		}
		
		var input = {
			app_id:this.app_id,
			session_id:this.session_id,
			call: call_object
		};
		
		if (this.debug) input.debug = 1;
		
		if (is_redirect) {
			var result = {
				success: true,
				app_id: this.app_id,
				result: {
					component: call_model.component,
					data: { success: true }
				}
			};
			
			var _form = document.createElement("form");
			_form.action = Newgrounds.io.GATEWAY_URI;
			_form.target = "_blank";
			_form.method = "POST";
			
			var _form_input = document.createElement("input");
			_form_input.type="hidden";
			_form_input.name="input";
			
			_form.appendChild(_form_input);
			document.body.appendChild(_form);
			
			_form_input.value = JSON.stringify(input);
			_form.submit();
			document.body.removeChild(_form);
			
		} else {
			var xhr = new XMLHttpRequest();
			var output;
			var error = null
			
			var ngio = this;
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState==4) {
					var o_return;
					try { o_return = (JSON.parse(xhr.responseText)).result; } catch(e) {}
					ngio._doCallback(call_model, callback, o_return, context);
				}
			};
			
			var formData = new FormData();
			
			// jhax is a hack to get around JS frameworks that add a toJSON method to Array (wich breaks the native implementation).
			var jhax = typeof(Array.prototype.toJSON) != 'undefined' ? Array.prototype.toJSON : null;
			if (jhax) delete Array.prototype.toJSON;
			formData.append('input', JSON.stringify(input));
			if (jhax) Array.prototype.toJSON = jhax;
			
			xhr.open('POST', Newgrounds.io.GATEWAY_URI, true);

			xhr.send(formData);
		}
	},
	
	_doValidateCall: function(component,parameters) {
		
		var i, c, param, rules;
		
		var validator = Newgrounds.io.call_validators.getValidator(component);
		if (!validator) throw new Error("'"+component+"' is not a valid server component.");
		
		if (validator.require_session && !this.session_id) throw new Error("'"+component+"' requires a session id");
		
		if (validator.import && validator.import.length > 0) {
			for(i=0; i<validator.import.length; i++) {
				c = validator.import[i].split(".");
				this._doValidateCall(c[0],c[1],parameters);
			}
		}
		
		var param_value;
		
		for(param in validator.params) {
			rules = validator.params[param];
			param_value = parameters && typeof(parameters[param]) != 'undefined' ? parameters[param] : null;
			
			if (!param_value && rules.extract_from && rules.extract_from.alias) param_value = parameters[rules.extract_from.alias];
			
			if (param_value === null) {
				if (rules.required) throw new Error("Missing required parameter for '"+component+"': "+param);
				continue;
			}
			
			if (rules.extract_from && param_value.constructor === Newgrounds.io.model[rules.extract_from.object]) {
				param_value = param_value[rules.extract_from.property];
			}
			
			if (!Newgrounds.io.model.checkStrictValue(null, param, param_value, rules.type, null, null, null)) throw new Error("Illegal value for '"+param+"' parameter of '"+component+"': "+param_value);
		}
	},
	
	_validateCall: function(call_model) {
		
		var i;
		
		if (call_model.constructor === Array) {
			var c = [];
			for(i=0; i<call_model.length; i++) {
				c.push(this._validateCall(call_model[i]));
			}
			return c;
		} else if (call_model.constructor !== Newgrounds.io.model.call) {
			throw new Error("Unexpected 'call_model' value. Expected Newgrounds.io.model.call instance.");
		}
		
		var component = call_model.component;
		var parameters = call_model.parameters;
		var echo = call_model.echo;
		
		if (parameters && parameters.constructor === Array) {
			for(i=0; i<parameters.length; i++) {
				this._doValidateCall(component, parameters[i]);
			}
		} else {
			this._doValidateCall(component, parameters);
		}
		
		var call_object = {component: call_model.component};
		var validator = Newgrounds.io.call_validators.getValidator(call_model.component);
		
		if (typeof(parameters) != 'undefined') {
			if (validator.secure) {
				var secure = this._encryptCall(call_model);
				call_object.secure = secure.secure;
			} else {
				call_object.parameters = parameters;
			}
		}
		if (typeof(echo) != 'undefined') call_object.echo = echo;
		
		return call_object;
	}
}
Newgrounds.io.core.prototype.constructor = Newgrounds.io.core;

Newgrounds.io.core.instance_id = 0;
Newgrounds.io.core.getNextInstanceID = function() {
	Newgrounds.io.core.instance_id++;
	return Newgrounds.io.core.instance_id;
};

/**
 * Callback used by Newgrounds.io.core.callComponent and Newgrounds.io.core.queueComponent
 * @callback Newgrounds.io.core~onCallResult
 * @param {object} data - The results of the call.
 */

/**
 * Used to get query string parameters from any url hosting this script (specifically to look for a session id on newgrounds hosted games)
 **/
Newgrounds.io.urlHelper = function() {
	
	var uri = window.location.href;
	var requestParams = {};
	var query = uri.split("?").pop();
	
	if (query) {
		var pairs = query.split("&");
		var key_value;
		for(var i=0; i<pairs.length; i++) {
			key_value = pairs[i].split("=");
			requestParams[key_value[0]] = key_value[1];
		}
	}
	
	/**
	 * Gets the value (if any) of a query string parameter in the current url.
	 * @instance
	 * @memberof Newgrounds.io.urlHelper
	 * @function getRequestQueryParam
	 * @param {string} param_name - The name of the query parameter you want to look up
	 * @param [default_value] - A value to return if there is no matching query parameter.
	 */
	this.getRequestQueryParam = function(param_name, default_value) {
		if (typeof(default_value) == 'undefined') default_value = null;
		return typeof(requestParams[param_name]) == 'undefined' ? default_value : requestParams[param_name];
	};
}

/* end core.js *//**
 * Contains all the information needed to execute an API component. 
 * @name Newgrounds.io.model.call 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} component - The name of the component you want to call, ie 'App.connect'.
 * @property {object} echo - An optional value that will be returned, verbatim, in the #result object.
 * @property {(object|object[])} parameters - An object of parameters you want to pass to the component.
 * @property {string} secure - A an encrypted #call object or array of #call objects. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.call = function(ngio, from_object) {

	/* private vars */
	var _component, _echo, _parameters, _secure;
	this.__property_names = ["component","echo","parameters","secure"];
	this.__classname = "Newgrounds.io.model.call";
	this.__ngio = ngio;
	
	
	var _component;
	Object.defineProperty(this, 'component', {
		get: function() { return typeof(_component) == 'undefined' ? null : _component; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'component', __vv__, String, null, null, null); 
			_component = __vv__;
		}
	});

	var _echo;
	Object.defineProperty(this, 'echo', {
		get: function() { return typeof(_echo) == 'undefined' ? null : _echo; },
		set: function(__vv__) {
			_echo = __vv__;
		}
	});

	var _parameters;
	Object.defineProperty(this, 'parameters', {
		get: function() { return typeof(_parameters) == 'undefined' ? null : _parameters; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'parameters', __vv__, Object, null, Object, null); 
			_parameters = __vv__;
		}
	});

	var _secure;
	Object.defineProperty(this, 'secure', {
		get: function() { return typeof(_secure) == 'undefined' ? null : _secure; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'secure', __vv__, String, null, null, null); 
			_secure = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.call.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.call 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.call.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.call 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.call.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.call.prototype.constructor = Newgrounds.io.model.call;/**
 * Contains extra debugging information. 
 * @name Newgrounds.io.model.debug 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} exec_time - The time, in milliseconds, that it took to execute a request.
 * @property {Newgrounds.io.model.input} input - A copy of the input object that was posted to the server. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.debug = function(ngio, from_object) {

	/* private vars */
	var _exec_time, _input;
	this.__property_names = ["exec_time","input"];
	this.__classname = "Newgrounds.io.model.debug";
	this.__ngio = ngio;
	
	
	var _exec_time;
	Object.defineProperty(this, 'exec_time', {
		get: function() { return typeof(_exec_time) == 'undefined' ? null : _exec_time; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'exec_time', __vv__, String, null, null, null); 
			_exec_time = __vv__;
		}
	});

	var _input;
	Object.defineProperty(this, 'input', {
		get: function() { return typeof(_input) == 'undefined' ? null : _input; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'input', __vv__, null, 'input', null, null); 
			_input = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.debug.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.debug 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.debug.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.debug 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.debug.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		if (this.__property_names[i] == 'input' && property) property = new Newgrounds.io.model.input(this.__ngio, property);
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.debug.prototype.constructor = Newgrounds.io.model.debug;/**
 *  
 * @name Newgrounds.io.model.error 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {number} code - A code indication the error type.
 * @property {string} message - Contains details about the error. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.error = function(ngio, from_object) {

	/* private vars */
	var _code, _message;
	this.__property_names = ["code","message"];
	this.__classname = "Newgrounds.io.model.error";
	this.__ngio = ngio;
	
	
	var _code;
	Object.defineProperty(this, 'code', {
		get: function() { return typeof(_code) == 'undefined' ? null : _code; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'code', __vv__, Number, null, null, null); 
			_code = __vv__;
		}
	});

	var _message;
	Object.defineProperty(this, 'message', {
		get: function() { return typeof(_message) == 'undefined' ? null : _message; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'message', __vv__, String, null, null, null); 
			_message = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.error.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.error 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.error.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.error 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.error.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		this[this.__property_names[i]] = property;
	}
};

/**
 * Gets a new Newgrounds.io.model.error instance.
 * @memberof Newgrounds.io.model.error
 * @function get
 * @static
 * @param {string} [message=Unknown Error] - The error message.
 * @param {number} [code=0] - The error code.
 */
Newgrounds.io.model.error.get = function(message,code) {
	var e = new Newgrounds.io.model.error();
	e.message = message ? message : "Unknown Error";
	e.code = code ? code : 0;
	return e;
};

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.MISSING_INPUT = 100;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_INPUT = 101;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.MISSING_PARAMETER = 102;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_PARAMETER = 103;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.EXPIRED_SESSION = 104;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.DUPLICATE_SESSION = 105;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.MAX_CONNECTIONS_EXCEEDED = 106;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.MAX_CALLS_EXCEEDED = 107;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.MEMORY_EXCEEDED = 108;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.TIMED_OUT = 109;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.LOGIN_REQUIRED = 110;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_APP_ID = 200;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_ENCRYPTION = 201;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_MEDAL_ID = 202;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_SCOREBOARD_ID = 203;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.INVALID_SAVEGROUP_ID = 204;

/**
 * @constant
 * @type {number}
 */
Newgrounds.io.model.error.SERVER_UNAVAILABLE = 504;

 

Newgrounds.io.model.error.prototype.constructor = Newgrounds.io.model.error;/**
 * A top-level wrapper containing any information needed to authenticate the application/user and any component calls being made. 
 * @name Newgrounds.io.model.input 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} app_id - Your application's unique ID.
 * @property {(Newgrounds.io.model.call|Newgrounds.io.model.call[])} call - A #call object, or array of one-or-more #call objects.
 * @property {boolean} debug - If set to true, calls will be executed in debug mode.
 * @property {object} echo - An optional value that will be returned, verbatim, in the #output object.
 * @property {string} session_id - An optional login session id. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.input = function(ngio, from_object) {

	/* private vars */
	var _app_id, _call, _debug, _echo, _session_id;
	this.__property_names = ["app_id","call","debug","echo","session_id"];
	this.__classname = "Newgrounds.io.model.input";
	this.__ngio = ngio;
	
	
	var _app_id;
	Object.defineProperty(this, 'app_id', {
		get: function() { return typeof(_app_id) == 'undefined' ? null : _app_id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'app_id', __vv__, String, null, null, null); 
			_app_id = __vv__;
		}
	});

	var _call;
	Object.defineProperty(this, 'call', {
		get: function() { return typeof(_call) == 'undefined' ? null : _call; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'call', __vv__, null, 'call', null, 'call'); 
			_call = __vv__;
		}
	});

	var _debug;
	Object.defineProperty(this, 'debug', {
		get: function() { return typeof(_debug) == 'undefined' ? null : _debug; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'debug', __vv__, Boolean, null, null, null); 
			_debug = __vv__;
		}
	});

	var _echo;
	Object.defineProperty(this, 'echo', {
		get: function() { return typeof(_echo) == 'undefined' ? null : _echo; },
		set: function(__vv__) {
			_echo = __vv__;
		}
	});

	var _session_id;
	Object.defineProperty(this, 'session_id', {
		get: function() { return typeof(_session_id) == 'undefined' ? null : _session_id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'session_id', __vv__, String, null, null, null); 
			_session_id = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.input.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.input 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.input.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.input 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.input.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		if (this.__property_names[i] == 'call' && property) property = new Newgrounds.io.model.call(this.__ngio, property);
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.input.prototype.constructor = Newgrounds.io.model.input;/**
 * Contains information about a medal. 
 * @name Newgrounds.io.model.medal 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} description - A short description of the medal.
 * @property {number} difficulty - The difficulty id of the medal.
 * @property {string} icon - The URL for the medal's icon.
 * @property {number} id - The numeric ID of the medal.
 * @property {string} name - The name of the medal.
 * @property {boolean} unlocked - This will only be set if a valid user session exists.
 * @property {number} value - The medal's point value. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.medal = function(ngio, from_object) {

	/* private vars */
	var _description, _difficulty, _icon, _id, _name, _secret, _unlocked, _value;
	this.__property_names = ["description","difficulty","icon","id","name","secret","unlocked","value"];
	this.__classname = "Newgrounds.io.model.medal";
	this.__ngio = ngio;
	
	
	var _description;
	Object.defineProperty(this, 'description', {
		get: function() { return typeof(_description) == 'undefined' ? null : _description; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'description', __vv__, String, null, null, null); 
			_description = __vv__;
		}
	});

	var _difficulty;
	Object.defineProperty(this, 'difficulty', {
		get: function() { return typeof(_difficulty) == 'undefined' ? null : _difficulty; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'difficulty', __vv__, Number, null, null, null); 
			_difficulty = __vv__;
		}
	});

	var _icon;
	Object.defineProperty(this, 'icon', {
		get: function() { return typeof(_icon) == 'undefined' ? null : _icon; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'icon', __vv__, String, null, null, null); 
			_icon = __vv__;
		}
	});

	var _id;
	Object.defineProperty(this, 'id', {
		get: function() { return typeof(_id) == 'undefined' ? null : _id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'id', __vv__, Number, null, null, null); 
			_id = __vv__;
		}
	});

	var _name;
	Object.defineProperty(this, 'name', {
		get: function() { return typeof(_name) == 'undefined' ? null : _name; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'name', __vv__, String, null, null, null); 
			_name = __vv__;
		}
	});

	var _secret;
	Object.defineProperty(this, 'secret', {
		get: function() { return typeof(_secret) == 'undefined' ? null : _secret; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'secret', __vv__, Boolean, null, null, null); 
			_secret = __vv__;
		}
	});

	var _unlocked;
	Object.defineProperty(this, 'unlocked', {
		get: function() { return typeof(_unlocked) == 'undefined' ? null : _unlocked; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'unlocked', __vv__, Boolean, null, null, null); 
			_unlocked = __vv__;
		}
	});

	var _value;
	Object.defineProperty(this, 'value', {
		get: function() { return typeof(_value) == 'undefined' ? null : _value; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'value', __vv__, Number, null, null, null); 
			_value = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.medal.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.medal 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.medal.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.medal 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.medal.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		this[this.__property_names[i]] = property;
	}
};

/**
 * Calls 'Medal.unlock' component using this medal and updates the unlocked property accordingly.
 * @instance
 * @memberof Newgrounds.io.model.medal 
 * @function unlock
 * @param {Newgrounds.io.model.medal~onUnlocked} [callback] - Called on success
 */
Newgrounds.io.model.medal.prototype.unlock = function(callback) {
	var medal = this;
	
	if (this._has_ngio_user()) {
		this.__ngio.callComponent('Medal.unlock', {id:this.id}, function(result) {
			if (result.success) this.unlocked = true;
			callback(result);
		});
	} else if (typeof(callback) == 'function') {
		var error = Newgrounds.io.model.error.get("This function requires a valid user session.", Newgrounds.io.model.error.LOGIN_REQUIRED);
		var result = {success:false, error:error};
		callback(result);
	}
}

/**
 * Callback used by Newgrounds.io.model.medal.unlock
 * @callback Newgrounds.io.model.medal~onUnlocked
 * @param {object} result - The results from the component call.
 */
Newgrounds.io.model.medal.prototype.constructor = Newgrounds.io.model.medal;/**
 * Contains all return output from an API request. 
 * @name Newgrounds.io.model.output 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} api_version - If there was an error, this will contain the current version number of the API gateway.
 * @property {string} app_id - Your application's unique ID
 * @property {Newgrounds.io.model.debug} debug - Contains extra information you may need when debugging (debug mode only).
 * @property {object} echo - If you passed an 'echo' value in your input object, it will be echoed here.
 * @property {Newgrounds.io.model.error} error - This will contain any error info if the success property is false.
 * @property {string} help_url - If there was an error, this will contain the URL for our help docs.
 * @property {(Newgrounds.io.model.result|Newgrounds.io.model.result[])} result - This will be a #result object, or an array containing one-or-more #result objects (this will match the structure of the #call property in your #input object).
 * @property {boolean} success - If false, there was a problem with your 'input' object. Details will be in the #error property. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.output = function(ngio, from_object) {

	/* private vars */
	var _api_version, _app_id, _debug, _echo, _error, _help_url, _result, _success;
	this.__property_names = ["api_version","app_id","debug","echo","error","help_url","result","success"];
	this.__classname = "Newgrounds.io.model.output";
	this.__ngio = ngio;
	
	
	var _api_version;
	Object.defineProperty(this, 'api_version', {
		get: function() { return typeof(_api_version) == 'undefined' ? null : _api_version; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'api_version', __vv__, String, null, null, null); 
			_api_version = __vv__;
		}
	});

	var _app_id;
	Object.defineProperty(this, 'app_id', {
		get: function() { return typeof(_app_id) == 'undefined' ? null : _app_id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'app_id', __vv__, String, null, null, null); 
			_app_id = __vv__;
		}
	});

	var _debug;
	Object.defineProperty(this, 'debug', {
		get: function() { return typeof(_debug) == 'undefined' ? null : _debug; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'debug', __vv__, null, 'debug', null, null); 
			_debug = __vv__;
		}
	});

	var _echo;
	Object.defineProperty(this, 'echo', {
		get: function() { return typeof(_echo) == 'undefined' ? null : _echo; },
		set: function(__vv__) {
			_echo = __vv__;
		}
	});

	var _error;
	Object.defineProperty(this, 'error', {
		get: function() { return typeof(_error) == 'undefined' ? null : _error; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'error', __vv__, null, 'error', null, null); 
			_error = __vv__;
		}
	});

	var _help_url;
	Object.defineProperty(this, 'help_url', {
		get: function() { return typeof(_help_url) == 'undefined' ? null : _help_url; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'help_url', __vv__, String, null, null, null); 
			_help_url = __vv__;
		}
	});

	var _result;
	Object.defineProperty(this, 'result', {
		get: function() { return typeof(_result) == 'undefined' ? null : _result; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'result', __vv__, null, 'result', null, 'result'); 
			_result = __vv__;
		}
	});

	var _success;
	Object.defineProperty(this, 'success', {
		get: function() { return typeof(_success) == 'undefined' ? null : _success; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'success', __vv__, Boolean, null, null, null); 
			_success = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.output.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.output 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.output.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.output 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.output.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		if (this.__property_names[i] == 'debug' && property) property = new Newgrounds.io.model.debug(this.__ngio, property);
		else if (this.__property_names[i] == 'error' && property) property = new Newgrounds.io.model.error(this.__ngio, property);
		else if (this.__property_names[i] == 'result' && property) property = new Newgrounds.io.model.result(this.__ngio, property);
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.output.prototype.constructor = Newgrounds.io.model.output;/**
 * Contains information returned by an API component. 
 * @name Newgrounds.io.model.result 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} component - The name of the component that was executed (ie 'Medal.unlock').
 * @property {(object|object[])} data - An object, or array of one-or-more objects (follows the structure of the corresponding 'call' property), containing any returned properties or errors.
 * @property {object} echo - If you passed an 'echo' value in your call object, it will be echoed here. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.result = function(ngio, from_object) {

	/* private vars */
	var _component, _data, _echo;
	this.__property_names = ["component","data","echo"];
	this.__classname = "Newgrounds.io.model.result";
	this.__ngio = ngio;
	
	
	var _component;
	Object.defineProperty(this, 'component', {
		get: function() { return typeof(_component) == 'undefined' ? null : _component; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'component', __vv__, String, null, null, null); 
			_component = __vv__;
		}
	});

	var _data;
	Object.defineProperty(this, 'data', {
		get: function() { return typeof(_data) == 'undefined' ? null : _data; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'data', __vv__, Object, null, Object, null); 
			_data = __vv__;
		}
	});

	var _echo;
	Object.defineProperty(this, 'echo', {
		get: function() { return typeof(_echo) == 'undefined' ? null : _echo; },
		set: function(__vv__) {
			_echo = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.result.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.result 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.result.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.result 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.result.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.result.prototype.constructor = Newgrounds.io.model.result;/**
 * Contains information about a score posted to a scoreboard. 
 * @name Newgrounds.io.model.score 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} formatted_value - The score value in the format selected in your scoreboard settings.
 * @property {string} tag - The tag attached to this score (if any).
 * @property {Newgrounds.io.model.user} user - The user who earned score. If this property is absent, the score belongs to the active user.
 * @property {number} value - The integer value of the score. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.score = function(ngio, from_object) {

	/* private vars */
	var _formatted_value, _tag, _user, _value;
	this.__property_names = ["formatted_value","tag","user","value"];
	this.__classname = "Newgrounds.io.model.score";
	this.__ngio = ngio;
	
	
	var _formatted_value;
	Object.defineProperty(this, 'formatted_value', {
		get: function() { return typeof(_formatted_value) == 'undefined' ? null : _formatted_value; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'formatted_value', __vv__, String, null, null, null); 
			_formatted_value = __vv__;
		}
	});

	var _tag;
	Object.defineProperty(this, 'tag', {
		get: function() { return typeof(_tag) == 'undefined' ? null : _tag; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'tag', __vv__, String, null, null, null); 
			_tag = __vv__;
		}
	});

	var _user;
	Object.defineProperty(this, 'user', {
		get: function() { return typeof(_user) == 'undefined' ? null : _user; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'user', __vv__, null, 'user', null, null); 
			_user = __vv__;
		}
	});

	var _value;
	Object.defineProperty(this, 'value', {
		get: function() { return typeof(_value) == 'undefined' ? null : _value; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'value', __vv__, Number, null, null, null); 
			_value = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.score.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.score 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.score.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.score 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.score.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		if (this.__property_names[i] == 'user' && property) property = new Newgrounds.io.model.user(this.__ngio, property);
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.score.prototype.constructor = Newgrounds.io.model.score;/**
 * Contains information about a scoreboard. 
 * @name Newgrounds.io.model.scoreboard 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {number} id - The numeric ID of the scoreboard.
 * @property {string} name - The name of the scoreboard. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.scoreboard = function(ngio, from_object) {

	/* private vars */
	var _id, _name;
	this.__property_names = ["id","name"];
	this.__classname = "Newgrounds.io.model.scoreboard";
	this.__ngio = ngio;
	
	
	var _id;
	Object.defineProperty(this, 'id', {
		get: function() { return typeof(_id) == 'undefined' ? null : _id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'id', __vv__, Number, null, null, null); 
			_id = __vv__;
		}
	});

	var _name;
	Object.defineProperty(this, 'name', {
		get: function() { return typeof(_name) == 'undefined' ? null : _name; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'name', __vv__, String, null, null, null); 
			_name = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.scoreboard.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.scoreboard 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.scoreboard.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.scoreboard 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.scoreboard.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		this[this.__property_names[i]] = property;
	}
};

/**
 * Calls the 'ScoreBoard.postScore' component using this scoreboard and the score info provided.
 * @instance
 * @memberof Newgrounds.io.model.scoreboard 
 * @function postScore
 * @param {number} score - The flat, numeric value of the score to post.
 * @param {string} [tag] - An optional tag that can be used to filter this score.
 * @param {Newgrounds.io.model.scoreboard~onScorePosted} [callback] - Called when score is posted
 */
Newgrounds.io.model.scoreboard.prototype.postScore = function(score, tag, callback) {
	var board = this;
	
	if (typeof(tag) == 'function' && !callback) {
		callback = tag;
		tag = null;
	}
	if (!tag) tag = null;
	
	if (this._has_ngio_user()) {
		this.__ngio.callComponent('ScoreBoard.postScore', {id:this.id, value:score, tag:tag}, function(result) {
			callback(result);
		});
	} else if (typeof(callback) == 'function') {
		var error = Newgrounds.io.model.error.get("This function requires a valid user session.", Newgrounds.io.model.error.LOGIN_REQUIRED);
		var result = {success:false, error:error};
		callback(result);
	}
}

/**
 * Callback used by Newgrounds.io.model.scoreboard.postScore
 * @callback Newgrounds.io.model.scoreboard~onScorePosted
 * @param {object} result - The results from the component call.
 */
Newgrounds.io.model.scoreboard.prototype.constructor = Newgrounds.io.model.scoreboard;/**
 * Contains information about the current user session. 
 * @name Newgrounds.io.model.session 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {boolean} expired - If true, the session_id is expired. Use App.startSession to get a new one.
 * @property {string} id - A unique session identifier
 * @property {string} passport_url - If the session has no associated user but is not expired, this property will provide a URL that can be used to sign the user in.
 * @property {boolean} remember - If true, the user would like you to remember their session id.
 * @property {Newgrounds.io.model.user} user - If the user has not signed in, or granted access to your app, this will be null 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.session = function(ngio, from_object) {

	/* private vars */
	var _expired, _id, _passport_url, _remember, _user;
	this.__property_names = ["expired","id","passport_url","remember","user"];
	this.__classname = "Newgrounds.io.model.session";
	this.__ngio = ngio;
	
	
	var _expired;
	Object.defineProperty(this, 'expired', {
		get: function() { return typeof(_expired) == 'undefined' ? null : _expired; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'expired', __vv__, Boolean, null, null, null); 
			_expired = __vv__;
		}
	});

	var _id;
	Object.defineProperty(this, 'id', {
		get: function() { return typeof(_id) == 'undefined' ? null : _id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'id', __vv__, String, null, null, null); 
			_id = __vv__;
		}
	});

	var _passport_url;
	Object.defineProperty(this, 'passport_url', {
		get: function() { return typeof(_passport_url) == 'undefined' ? null : _passport_url; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'passport_url', __vv__, String, null, null, null); 
			_passport_url = __vv__;
		}
	});

	var _remember;
	Object.defineProperty(this, 'remember', {
		get: function() { return typeof(_remember) == 'undefined' ? null : _remember; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'remember', __vv__, Boolean, null, null, null); 
			_remember = __vv__;
		}
	});

	var _user;
	Object.defineProperty(this, 'user', {
		get: function() { return typeof(_user) == 'undefined' ? null : _user; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'user', __vv__, null, 'user', null, null); 
			_user = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.session.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.session 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.session.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.session 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.session.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		if (this.__property_names[i] == 'user' && property) property = new Newgrounds.io.model.user(this.__ngio, property);
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.session.prototype.constructor = Newgrounds.io.model.session;/**
 * Contains information about a user. 
 * @name Newgrounds.io.model.user 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {Newgrounds.io.model.usericons} icons - The user's icon images.
 * @property {number} id - The user's numeric ID.
 * @property {string} name - The user's textual name.
 * @property {boolean} supporter - Returns true if the user has a Newgrounds Supporter upgrade. 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.user = function(ngio, from_object) {

	/* private vars */
	var _icons, _id, _name, _supporter;
	this.__property_names = ["icons","id","name","supporter"];
	this.__classname = "Newgrounds.io.model.user";
	this.__ngio = ngio;
	
	
	var _icons;
	Object.defineProperty(this, 'icons', {
		get: function() { return typeof(_icons) == 'undefined' ? null : _icons; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'icons', __vv__, null, 'usericons', null, null); 
			_icons = __vv__;
		}
	});

	var _id;
	Object.defineProperty(this, 'id', {
		get: function() { return typeof(_id) == 'undefined' ? null : _id; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'id', __vv__, Number, null, null, null); 
			_id = __vv__;
		}
	});

	var _name;
	Object.defineProperty(this, 'name', {
		get: function() { return typeof(_name) == 'undefined' ? null : _name; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'name', __vv__, String, null, null, null); 
			_name = __vv__;
		}
	});

	var _supporter;
	Object.defineProperty(this, 'supporter', {
		get: function() { return typeof(_supporter) == 'undefined' ? null : _supporter; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'supporter', __vv__, Boolean, null, null, null); 
			_supporter = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.user.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.user 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.user.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.user 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.user.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		if (this.__property_names[i] == 'icons' && property) property = new Newgrounds.io.model.usericons(this.__ngio, property);
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.user.prototype.constructor = Newgrounds.io.model.user;/**
 * Contains any icons associated with this user. 
 * @name Newgrounds.io.model.usericons 
 * @constructor
 * @memberof Newgrounds.io.model
 * @property {string} large - The URL of the user's large icon
 * @property {string} medium - The URL of the user's medium icon
 * @property {string} small - The URL of the user's small icon 
 * @param {Newgrounds.io.core} [ngio] - A Newgrounds.io.core instance associated with the model object.
 * @param {object} [from_object] - A literal object used to populate this model's properties.
 */
Newgrounds.io.model.usericons = function(ngio, from_object) {

	/* private vars */
	var _large, _medium, _small;
	this.__property_names = ["large","medium","small"];
	this.__classname = "Newgrounds.io.model.usericons";
	this.__ngio = ngio;
	
	
	var _large;
	Object.defineProperty(this, 'large', {
		get: function() { return typeof(_large) == 'undefined' ? null : _large; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'large', __vv__, String, null, null, null); 
			_large = __vv__;
		}
	});

	var _medium;
	Object.defineProperty(this, 'medium', {
		get: function() { return typeof(_medium) == 'undefined' ? null : _medium; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'medium', __vv__, String, null, null, null); 
			_medium = __vv__;
		}
	});

	var _small;
	Object.defineProperty(this, 'small', {
		get: function() { return typeof(_small) == 'undefined' ? null : _small; },
		set: function(__vv__) {
			Newgrounds.io.model.checkStrictValue(this.__classname, 'small', __vv__, String, null, null, null); 
			_small = __vv__;
		}
	});
	if(from_object) this.fromObject(from_object);
};

Newgrounds.io.model.usericons.prototype._has_ngio_user = function() {
	return (this.__ngio && this.__ngio.user);
}

/**
 * Converts the model instance to a literal object.
 * @instance
 * @memberof Newgrounds.io.model.usericons 
 * @function toObject
 * @return {object}
 */
Newgrounds.io.model.usericons.prototype.toObject = function() {
	var object = {};
	for(var i=0; i<this.__property_names.length; i++) {
		if (typeof(this[this.__property_names[i]]) != 'undefined') object[this.__property_names[i]] = this[this.__property_names[i]];
	}
	return object;
};

/**
 * Populates the model instance using a literal object.
 * @instance
 * @memberof Newgrounds.io.model.usericons 
 * @function fromObject
 * @param {object} object - An object containing property/value pairs
 */
Newgrounds.io.model.usericons.prototype.fromObject = function(object) {
	var property, model;
	for(var i=0; i<this.__property_names.length; i++) {
		property = object[this.__property_names[i]]; 
		this[this.__property_names[i]] = property;
	}
};


Newgrounds.io.model.usericons.prototype.constructor = Newgrounds.io.model.usericons;/* start validators.js */

Newgrounds.io.call_validators.getValidator = function(component) {
	var c = component.split(".");
	var classname = c[0];
	var method = c[1];
	
	var validator = (Newgrounds.io.call_validators[classname] && Newgrounds.io.call_validators[classname][method]) ? Newgrounds.io.call_validators[classname][method] : null;
	return validator;
};

/**
 * Contains validation rules for calls within the 'App' component.
 * @memberof Newgrounds.io.call_validators
 * @type {object}
 */
Newgrounds.io.call_validators.App = { 

	/**
	 * @property {object} checkSession - Contains rules for validating calls to 'App.checkSession'.
	 */
	checkSession: {"require_session":true,"secure":false,"redirect":false,"import":false,"params":{},"returns":{"session":{"object":"session","description":null}}}, 

	/**
	 * @property {object} endSession - Contains rules for validating calls to 'App.endSession'.
	 */
	endSession: {"require_session":true,"secure":false,"redirect":false,"import":false,"params":{},"returns":{}}, 

	/**
	 * @property {object} getCurrentVersion - Contains rules for validating calls to 'App.getCurrentVersion'.
	 */
	getCurrentVersion: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{"version":{"type":String,"extract_from":null,"required":null,"description":"The version number (in \"X.Y.Z\" format) of the client-side app. (default = \"0.0.0\")"}},"returns":{}}, 

	/**
	 * @property {object} getHostLicense - Contains rules for validating calls to 'App.getHostLicense'.
	 */
	getHostLicense: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":null,"description":"The host domain to check (ei, somesite.com)."}},"returns":{}}, 

	/**
	 * @property {object} logView - Contains rules for validating calls to 'App.logView'.
	 */
	logView: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Examples: \"www.somesite.com\", \"localHost\""}},"returns":{}}, 

	/**
	 * @property {object} startSession - Contains rules for validating calls to 'App.startSession'.
	 */
	startSession: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{"force":{"type":Boolean,"extract_from":null,"required":null,"description":"If true, will create a new session even if the user already has an existing one.\n\nNote: Any previous session ids will no longer be valid if this is used."}},"returns":{"session":{"object":"session","description":null}}} 

};
/**
 * Contains validation rules for calls within the 'Event' component.
 * @memberof Newgrounds.io.call_validators
 * @type {object}
 */
Newgrounds.io.call_validators.Event = { 

	/**
	 * @property {object} logEvent - Contains rules for validating calls to 'Event.logEvent'.
	 */
	logEvent: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{"event_name":{"type":String,"extract_from":null,"required":true,"description":"The name of your custom event as defined in your Referrals & Events settings."},"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Example: \"newgrounds.com\", \"localHost\""}},"returns":{}} 

};
/**
 * Contains validation rules for calls within the 'Gateway' component.
 * @memberof Newgrounds.io.call_validators
 * @type {object}
 */
Newgrounds.io.call_validators.Gateway = { 

	/**
	 * @property {object} getDatetime - Contains rules for validating calls to 'Gateway.getDatetime'.
	 */
	getDatetime: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{},"returns":{}}, 

	/**
	 * @property {object} getVersion - Contains rules for validating calls to 'Gateway.getVersion'.
	 */
	getVersion: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{},"returns":{}}, 

	/**
	 * @property {object} ping - Contains rules for validating calls to 'Gateway.ping'.
	 */
	ping: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{},"returns":{}} 

};
/**
 * Contains validation rules for calls within the 'Loader' component.
 * @memberof Newgrounds.io.call_validators
 * @type {object}
 */
Newgrounds.io.call_validators.Loader = { 

	/**
	 * @property {object} loadAuthorUrl - Contains rules for validating calls to 'Loader.loadAuthorUrl'.
	 */
	loadAuthorUrl: {"require_session":false,"secure":false,"redirect":true,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Example: \"www.somesite.com\", \"localHost\""},"redirect":{"type":Boolean,"extract_from":null,"required":false,"description":"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},"returns":{}}, 

	/**
	 * @property {object} loadMoreGames - Contains rules for validating calls to 'Loader.loadMoreGames'.
	 */
	loadMoreGames: {"require_session":false,"secure":false,"redirect":true,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Example: \"www.somesite.com\", \"localHost\""},"redirect":{"type":Boolean,"extract_from":null,"required":false,"description":"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},"returns":{}}, 

	/**
	 * @property {object} loadNewgrounds - Contains rules for validating calls to 'Loader.loadNewgrounds'.
	 */
	loadNewgrounds: {"require_session":false,"secure":false,"redirect":true,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Example: \"www.somesite.com\", \"localHost\""},"redirect":{"type":Boolean,"extract_from":null,"required":false,"description":"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},"returns":{}}, 

	/**
	 * @property {object} loadOfficialUrl - Contains rules for validating calls to 'Loader.loadOfficialUrl'.
	 */
	loadOfficialUrl: {"require_session":false,"secure":false,"redirect":true,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Example: \"www.somesite.com\", \"localHost\""},"redirect":{"type":Boolean,"extract_from":null,"required":false,"description":"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."}},"returns":{}}, 

	/**
	 * @property {object} loadReferral - Contains rules for validating calls to 'Loader.loadReferral'.
	 */
	loadReferral: {"require_session":false,"secure":false,"redirect":true,"import":false,"params":{"host":{"type":String,"extract_from":null,"required":true,"description":"The domain hosting your app. Example: \"www.somesite.com\", \"localHost\""},"redirect":{"type":Boolean,"extract_from":null,"required":false,"description":"Set this to false to get a JSON response containing the URL instead of doing an actual redirect."},"referral_name":{"type":String,"extract_from":null,"required":true,"description":"The name of the referral (as defined in your \"Referrals & Events\" settings)."}},"returns":{}} 

};
/**
 * Contains validation rules for calls within the 'Medal' component.
 * @memberof Newgrounds.io.call_validators
 * @type {object}
 */
Newgrounds.io.call_validators.Medal = { 

	/**
	 * @property {object} getList - Contains rules for validating calls to 'Medal.getList'.
	 */
	getList: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{},"returns":{"medals":{"array":{"object":"medal"},"description":"An array of medal objects."}}}, 

	/**
	 * @property {object} unlock - Contains rules for validating calls to 'Medal.unlock'.
	 */
	unlock: {"require_session":true,"secure":true,"redirect":false,"import":false,"params":{"id":{"type":Number,"extract_from":{"object":"medal","alias":"medal","property":"id"},"required":true,"description":"The numeric ID of the medal to unlock."}},"returns":{"medal":{"object":"medal","description":"The #medal that was unlocked."}}} 

};
/**
 * Contains validation rules for calls within the 'ScoreBoard' component.
 * @memberof Newgrounds.io.call_validators
 * @type {object}
 */
Newgrounds.io.call_validators.ScoreBoard = { 

	/**
	 * @property {object} getBoards - Contains rules for validating calls to 'ScoreBoard.getBoards'.
	 */
	getBoards: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{},"returns":{"scoreboards":{"array":{"object":"scoreboard"},"description":"An array of #scoreboard objects."}}}, 

	/**
	 * @property {object} getScores - Contains rules for validating calls to 'ScoreBoard.getScores'.
	 */
	getScores: {"require_session":false,"secure":false,"redirect":false,"import":false,"params":{"id":{"type":Number,"extract_from":{"object":"scoreboard","alias":"scoreboard","property":"id"},"required":true,"description":"The numeric ID of the scoreboard."},"limit":{"type":Number,"extract_from":null,"required":null,"description":"An integer indicating the number of scores to include in the list. Default = 10."},"period":{"type":String,"extract_from":null,"required":null,"description":"The time-frame to pull scores from (see notes for acceptable values)."},"skip":{"type":Number,"extract_from":null,"required":null,"description":"An integer indicating the number of scores to skip before starting the list. Default = 0."},"social":{"type":Boolean,"extract_from":null,"required":null,"description":"If set to true, only social scores will be loaded (scores by the user and their friends). This param will be ignored if there is no valid session id and the 'user' param is absent."},"tag":{"type":String,"extract_from":null,"required":null,"description":"A tag to filter results by."},"user":{"type":"mixed","extract_from":null,"required":null,"description":"A user's ID or name.  If 'social' is true, this user and their friends will be included. Otherwise, only scores for this user will be loaded. If this param is missing and there is a valid session id, that user will be used by default."}},"returns":{"scoreboard":{"object":"scoreboard","description":"The #scoreboard being queried."},"scores":{"array":{"object":"score"},"description":"An array of #score objects."},"user":{"object":"user","description":"The #user the score list is associated with (either as defined in the 'user' param, or extracted from the current session when 'social' is set to true)"}}}, 

	/**
	 * @property {object} postScore - Contains rules for validating calls to 'ScoreBoard.postScore'.
	 */
	postScore: {"require_session":true,"secure":true,"redirect":false,"import":false,"params":{"id":{"type":Number,"extract_from":{"object":"scoreboard","alias":"scoreboard","property":"id"},"required":true,"description":"The numeric ID of the scoreboard."},"tag":{"type":String,"extract_from":null,"required":null,"description":"An optional tag that can be used to filter scores via ScoreBoard.getScores"},"value":{"type":Number,"extract_from":null,"required":true,"description":"The int value of the score."}},"returns":{"score":{"object":"score","description":"The #score that was posted to the board."},"scoreboard":{"object":"scoreboard","description":"The #scoreboard that was posted to."}}} 

};


/* end validators.js */

/* start sessionloader.js */

/**
 * Used to get a user logged in to your app
 * @constructor
 * @memberof Newgrounds.io
 * @param {Newgrounds.io.core} ngio - The Newgrounds.io.core instance being used.
 */
Newgrounds.io.SessionLoader = function(ngio) {
	if (!ngio || ngio.constructor !== Newgrounds.io.core) throw new Error("'ngio' must be a 'Newgrounds.io.core' instance.");
	this.__ngio = ngio;
	
	var _session = null;
	
	/**
	 * @property {Newgrounds.io.model.session} debug - Set to true to operate in debug mode
	 */
	Object.defineProperty(this, 'session', {
		set: function(session) {
			if (session && !session.constructor === Newgrounds.io.model.session) throw new Error("'session' must be a 'Newgrounds.io.model.session' instance.");
			_session = session;
		},
		get: function() {
			return _session;
		}
	});
}
Newgrounds.io.SessionLoader.prototype = {
	
	_event_listeners: {},
	last_error: null,
	passport_window: null,
	
	/**
	 * Adds a listener function to the specified event.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function addEventListener
	 * @param {string} type - The event to listen for.  Typically a Newgrounds.io.events.SessionEvent constant.
	 * @param {function} listener - A function to call when the event is triggered.
	 */
	addEventListener: Newgrounds.io.events.EventDispatcher.prototype.addEventListener,
	
	/**
	 * Removes a listener function from the specified event.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function removeEventListener
	 * @param {string} type - The event you want to remove a listener from. Typically a Newgrounds.io.events.SessionEvent constant.
	 * @param {function} listener - The listener function you want to remove.
	 * @return {boolean} Returns true if a matching listener was removed.
	 */
	removeEventListener: Newgrounds.io.events.EventDispatcher.prototype.removeEventListener,
	
	/**
	 * Removes ALL listener functions from the specified event.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function removeAllEventListeners
	 * @param {string} type - The event you want to remove listeners from.
	 * @return {number} The number of listeners that were removed.
	 */
	removeAllEventListeners: Newgrounds.io.events.EventDispatcher.prototype.removeAllEventListeners,
	
	/**
	 * Dispatches an event to any listener functions.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function dispatchEvent
	 * @param {Newgrounds.io.events.SessionEvent} event - The event to dispatch.
	 * @return {boolean}
	 */
	dispatchEvent: Newgrounds.io.events.EventDispatcher.prototype.dispatchEvent,
	
	/**
	 * Gets an active session. If one does not already exist, one will be created.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function getValidSession
	 * @param {Newgrounds.io.SessionLoader~onStatusUpdate} [callback] - An optional callback function.
	 * @param {object} [context] - The context under which the callback will be executed. Optional.
	 */
	getValidSession: function(callback, context) {
		var loader = this;
		loader.checkSession(function(session) {
			if (!session || session.expired) {
				loader.startSession(callback, context);
			} else {
				callback.call(context, session);
			}
		});
	},
	
	/**
	 * Starts a new Passport session.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function startSession
	 * @param {Newgrounds.io.SessionLoader~onStatusUpdate} [callback] - An optional callback function.
	 * @param {object} [context] - The context under which the callback will be executed. Optional.
	 */
	startSession: function(callback, context) {
		
		var event = new Newgrounds.io.events.SessionEvent();
		var loader = this;
		
		this.__ngio.callComponent('App.startSession', function(r) {
			if (!r.success || !r.session) {
				if (r.error) {
					loader.last_error = r.error;
				} else {
					loader.last_error = new Newgrounds.io.model.error;
					loader.last_error.message = "Unexpected Error";
				}
				event.type = Newgrounds.io.events.SessionEvent.SESSION_EXPIRED;
				loader.session = null;
			} else {
				event.type = Newgrounds.io.events.SessionEvent.REQUEST_LOGIN;
				event.passport_url = r.session.passport_url;
				loader.session = r.session;
			}
			
			loader.__ngio.session_id = loader.session ? loader.session.id : null;
			loader.dispatchEvent(event);
			if (callback && callback.constructor === Function) callback.call(context, loader.session);
		});
	},
	
	/**
	 * Loads the current session status and fires the appropriate event.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function checkSession
	 * @param {function} [callback] - An optional callback function.
	 * @param {object} [context] - The context under which the callback will be executed. Optional.
	 */
	checkSession: function(callback, context) {
		
		var event = new Newgrounds.io.events.SessionEvent();
		var loader = this;
		
		/* session has been successfully loaded already */
		if (loader.session && loader.session.user) {
			event.type = Newgrounds.io.events.SessionEvent.USER_LOADED;
			event.user = loader.session.user;
			
			loader.dispatchEvent(event);
			
			if (callback && callback.constructor === Function) callback.call(context, loader.session);
			
		/* we don't even have a session, treat it like it expired */
		} else if (!this.__ngio.session_id) {
			event.type = Newgrounds.io.events.SessionEvent.SESSION_EXPIRED;
			loader.session = null;
			loader.dispatchEvent(event);
			if (callback && callback.constructor === Function) callback.call(context, null);
			
		/* check existing session */
		} else {
			this.__ngio.callComponent('App.checkSession', function(r) {
				if (!r.success || !r.session || r.session.expired) {
					event.type = Newgrounds.io.events.SessionEvent.SESSION_EXPIRED;
					loader.session = null;
					if (r.error) {
						loader.last_error = r.error;
					} else {
						loader.last_error = new Newgrounds.io.model.error;
						if (r.session && r.session.expired) {
							loader.last_error.message = "Session is Expired";
						} else {
							loader.last_error.message = "Unexpected Error";
						}
					}
					
				} else if (!r.session.user) {
					event.type = Newgrounds.io.events.SessionEvent.REQUEST_LOGIN;
					event.passport_url = r.session.passport_url;
					loader.session = r.session;
					
				} else {
					event.type = Newgrounds.io.events.SessionEvent.USER_LOADED;
					event.user = r.session.user;
					loader.session = r.session;
				}
				
				loader.__ngio.session_id = loader.session ? loader.session.id : null;
				loader.dispatchEvent(event);
				if (callback && callback.constructor === Function) callback.call(context, loader.session);
			});
		}
	},
	
	/**
	 * Ends the current session and fires the appropriate event.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function endSession
	 * @param {function} [callback] - An optional callback function.
	 * @param {object} [context] - The context under which the callback will be executed. Optional.
	 */
	endSession: function(callback, context) {
		var loader = this;
		var ngio = this.__ngio;
		
		this.__ngio.callComponent('App.endSession', function(r) {
			loader.session = null;
			ngio.session_id = null;
			var event = new Newgrounds.io.events.SessionEvent(Newgrounds.io.events.SessionEvent.SESSION_EXPIRED);
			loader.dispatchEvent(event);
			if (callback && callback.constructor === Function) callback.call(context, loader.session);
		});
		
		this.__ngio.session_id = null;
		this.session = null;
	},
	
	/**
	 * Opens a Newgrounds Passport login page in a new browser window.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function loadPassport
	 * @param {string} [target=_blank] - The window target.
	 */
	loadPassport: function(target) {
		if(typeof(target) != 'string') target = "_blank";
		if(!this.session || !this.session.passport_url) {
			console.warn('Attempted to open Newgrounds Passport without a valid passport_url. Be sure you have called getValidSession() first!.');
			return false;
		}
		
		this.passport_window = window.open(this.session.passport_url, target);
		if (!this.passport_window) console.warn('Unable to detect passport window. Pop-up blockers will prevent loading Newgrounds Passport if loadPassport() or requestLogin() are not called from within a mouse click handler.');
		return this.passportOpen();
	},
	
	/**
	 * Closes the Newgrounds Passport window if it's still open.
	 * @instance
	 * @memberof Newgrounds.io.SessionLoader
	 * @function closePassport
	 * @return {boolean} - If true, a passport window was closed.
	 */
	closePassport: function() {
		if (!this.passport_window) return false;
		this.passport_window.close();
		return this.passportOpen();
	},
	
	/**
	 * Returns true if the passport login tab is open (must be opened from openPassport).
	 */
	passportOpen: function() {
		return this.passport_window && this.passport_window.parent ? true : false;
	}
};
Newgrounds.io.SessionLoader.prototype.constructor = Newgrounds.io.SessionLoader;


/* end sessionloader.js *//*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();