var gameCDN = "deadtrigger2.ssl.hwcdn.net/";

var XMLHttpRequestCached = function() {
  var self = this, xhr = new XMLHttpRequestCached.cache.XMLHttpRequest(), cache = {};

  function send() {
    var onload = xhr.onload;

// DEBUG
var _onload = onload; onload = function(e) { console.log('[XMLHttpRequestCached] "' + cache.requestURL + '" ' + (cache.override ? 'served from indexedDB cache (' + cache.response.byteLength + ' bytes)' : cache.stored ? 'downloaded and stored in cache' : 'not handled properly (probably the file is not available on the server)')); _onload(e);}
// _DEBUG

    xhr.onload = function(e) {
      var meta = {
        requestURL: cache.requestURL,
        responseURL: xhr.responseURL,
        responseType: xhr.responseType,
        lastModified: xhr.getResponseHeader('Last-Modified'),
        eTag: xhr.getResponseHeader('ETag'),
      };
      if (xhr.status == 200 && (meta.lastModified || meta.eTag) && xhr.responseType == 'arraybuffer' && cache.requestURL.includes(gameCDN)) {
        meta.size = xhr.response.byteLength;
        XMLHttpRequestCached.cache.put(cache.requestURL, meta, xhr.response, function(err) {
          if (!err)
            cache.stored = true;
          onload(e);
        });
      } else {
        if (xhr.status == 304)
          cache.override = true;
        onload(e);
      }
    }
    return xhr.send.apply(xhr, arguments);
  }
  
  Object.defineProperty(self, 'open', { value: function(method, url, async) {
    cache = { method: method, requestURL: XMLHttpRequestCached.cache.requestURL(url), async: async };
    return xhr.open.apply(xhr, arguments);
  }});
  
  Object.defineProperty(self, 'send', { value: function() {
    var sendArguments = arguments;
	if (cache.requestURL.substr(0, 5) == 'file:' || cache.method.toUpperCase() != 'GET' || cache.async === false || xhr.responseType != 'arraybuffer' || !cache.requestURL.includes(gameCDN))
	{
		return xhr.send.apply(xhr, sendArguments);
	}
    XMLHttpRequestCached.cache.get(cache.requestURL, function(err, result) {
      if (err || !result || !result.meta || result.meta.responseType != xhr.responseType)
	{    
		return send.apply(self, sendArguments);
	}
      if (result.meta.lastModified)
        xhr.setRequestHeader('If-Modified-Since', result.meta.lastModified);
      else if (result.meta.eTag)
        xhr.setRequestHeader('If-None-Match', result.meta.eTag);
      xhr.setRequestHeader('Cache-Control', 'no-cache');
	  cache.status = 200;
	  cache.response = result.response;
	  cache.responseURL = result.meta.responseURL;
	  console.log('[XMLHttpRequestCached] serving "' + cache.responseURL + '" from indexedDB cache without revalidation (' + cache.response.byteLength + ' bytes).');
	  cache.override = true;
	  
	  self.onload();
    });
  }});
  
  ['readyState', 'response', 'responseText', 'responseType', 'responseURL', 'responseXML', 'status', 'statusText', 'timeout', 'upload', 'withCredentials',
    'onloadstart', 'onprogress', 'onabort', 'onerror', 'onload', 'ontimeout', 'onloadend', 'onreadystatechange'].forEach(function(property) {
    Object.defineProperty(self, property, {
      get: function() { return (cache.override && cache[property]) ? cache[property] : xhr[property]; },
      set: function(value) { xhr[property] = value; },
    });
  });
  
  ['abort', 'getAllResponseHeaders', 'getResponseHeader', 'overrideMimeType', 'addEventListener', 'setRequestHeader'].forEach(function(method) {
    Object.defineProperty(self, method, { value: function() { return xhr[method].apply(xhr, arguments); } });
  });
  
}

XMLHttpRequestCached.cache = {
  database: 'cached',
  version: 21,
  store: 'content',
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
  XMLHttpRequest: window.XMLHttpRequest,
  link: document.createElement('a'),
  requestURL: function(url) {
    this.link.href = url;
    return this.link.href;

  },
  id: function(requestURL) {
    return encodeURIComponent(requestURL);
    
  },
  queue: [],
  processQueue: function () {
    var self = this;
    self.queue.forEach(function(queued) { self[queued.action].apply(self, queued.arguments) });
    self.queue = [];

  },
  init: function() {
    var self = this;
    if (!self.indexedDB)
      return console.log('indexedDB is not available');
    var openDB;
    try {
      openDB = indexedDB.open(self.database, self.version);
    } catch(e) {
      return console.log('indexedDB access denied');
    }
    openDB.onupgradeneeded = function(e) {
      var db = e.target.result;
      var transaction = e.target.transaction;
      var objectStore;
      if (db.objectStoreNames.contains(self.store)) {
        objectStore = transaction.objectStore(self.store);
      } else {
        objectStore = db.createObjectStore(self.store, {keyPath: 'id'});
        objectStore.createIndex('meta', 'meta', {unique: false});
      }
      objectStore.clear();
    }
    openDB.onerror = function(e) {
      console.log('can not open indexedDB cache database');
      self.indexedDB = null;
      self.processQueue();
    }
    openDB.onsuccess = function(e) {
      self.db = e.target.result;
      self.processQueue();
    }
    
  },  
  put: function(requestURL, meta, response, callback) {
    var self = this;
    if (!self.indexedDB)
      return callback(new Error('indexedDB is not available'));
    if (!self.db)
      return self.queue.push({action: 'put', arguments: arguments});
    meta.version = self.version;
    var putDB = self.db.transaction([self.store], 'readwrite').objectStore(self.store).put({id: self.id(requestURL), meta: meta, response: response});
    putDB.onerror = function(e) { callback(new Error('failed to put request into indexedDB cache')); }
    putDB.onsuccess = function(e) 
	{ 
		callback(null); 
	}
    
  },
  get: function(requestURL, callback) {
    var self = this;
    if (!self.indexedDB)
      return callback(new Error('indexedDB is not available'));
    if (!self.db)
      return self.queue.push({action: 'get', arguments: arguments});
    var getDB = self.db.transaction([self.store], 'readonly').objectStore(self.store).get(self.id(requestURL));
    getDB.onerror = function(e) { callback(new Error('failed to get request from indexedDB cache')); }
    getDB.onsuccess = function(e) { callback(null, e.target.result); }

  },
  clear: function(callback) {
    var self = this;
    if (!self.indexedDB)
      return callback(new Error('indexedDB is not available'));
    if (!self.db)
      return self.queue.push({action: 'cleanup', arguments: arguments});
    var clearDB = self.db.transaction([self.store], 'readwrite').objectStore(self.store).clear();
    clearDB.onerror = function(e) { callback(new Error('failed to clear indexedDB cache')); }
    clearDB.onsuccess = function(e) { callback(null); };
  }
};
XMLHttpRequestCached.cache.init();
XMLHttpRequest = XMLHttpRequestCached;
console.log('[XMLHttpRequestCached] use the following command in your console to clear the XMLHttpRequest indexedDB cache:\nXMLHttpRequest.cache.clear(function() {alert("Cache cleared successfully")});');
