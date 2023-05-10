class Rhodium {
  constructor(ctx) {
    Object.entries(ctx).forEach(([e,v]) => {
      this[e] = v
    })
  }
  resetLocation() {
    window.rLocation = $Rhodium.Location()
    document.rLocation = window.rLocation
  }
  Location() {
    return new Proxy({}, {
      set(og, ob, val) {
        if (ob=='toString'||ob=='assign'||ob=='replace'||ob=='reload'||ob=='hash'||ob=='search' || ob=='protocol') return true;
        return location[ob] = URLParser.encode($Rhodium.Url.href.replace($Rhodium.Url[ob], val), $Rhodium);
      },
      get(og, ob) {
        if (ob=='toString'||ob=='assign'||ob=='replace'||ob=='reload'||ob=='hash'||ob=='search'||ob=='protocol') return {
          toString: () => $Rhodium.Url.href,
          assign: (a) => location.assign(URLParser.encode(a, $Rhodium)),
          replace: (a) => location.replace(URLParser.encode(a, $Rhodium)),
          reload: (a) => location.reload(a?a:null),
          hash: location.hash,
          search: location.search,
          protocol: location.protocol,
        }[ob]; else return $Rhodium.Url[ob];
      }
    });
  }
  fetch() {
    return new Proxy(window.fetch, {
      apply(t, g, a) {
        if (a[0] && typeof a[0] == 'object') {
          a[0].url = URLParser.encode(a[0].url, $Rhodium)
          if ($Rhodium.replit) a[0].url = a[0].url.replace('https://', 'https:/')
        } else if (a[0]) {
          a[0] = URLParser.encode(a[0], $Rhodium)
          if ($Rhodium.replit) a[0] = a[0].replace('https://', 'https:/')
        }
        return Reflect.apply(t, g, a)
      }
    })
  }
  querySelectorAll() {
    return new Proxy(document.querySelectorAll, {
      apply(t, g, a) {
        if (a[0]=='script') return [...Reflect.apply(t, g, a)].splice(0, 1);
        return Reflect.apply(t, g, a)
      }
    })
  }
  getElementsByTagName() {
    return new Proxy(document.getElementsByTagName, {
      apply(t, g, a) {
        if (a[0]=='script') {
          var apply = Reflect.apply(t, g, a);
          [...apply].splice(0, 1);
          console.log(apply)
          return apply;
        }
        return Reflect.apply(t, g, a);
      }
    })
  };
  History() {
    return {
      pushState: new Proxy(history.pushState, {
        apply(t, g, a) {
          console.log(a)
          if (a[2]) a[2] = URLParser.encode(a[2], $Rhodium)
          var a = Reflect.apply(t, g, a)
          $Rhodium.resetLocation();
          return a
        }
      }),
      replaceState: new Proxy(history.replaceState, {
        apply(t, g, a) {
          console.log(a)
          if (a[2]) a[2] = location.origin + URLParser.encode(a[2], $Rhodium)
          var a = Reflect.apply(t, g, a)
          $Rhodium.resetLocation();
          return a
        }
      })
    } 
  }
  WebSocket() {
    return new Proxy(window.WebSocket, {
      construct(t, a) {
        if (a[0].includes('?')) {
          var origin = '&origin='+$Rhodium.Url.origin
        } else var origin = '?origin='+$Rhodium.Url.origin
        var hostnm = location.port ? location.hostname+':'+location.port : location.hostname
        a[0] = location.protocol.replace('http', 'ws')+'//'+hostnm+$Rhodium.prefix+'?ws='+a[0]+origin
        return Reflect.construct(t, a)
      }
    })
  }
  XMLHttpRequest() {
    return new Proxy(window.XMLHttpRequest.prototype.open, {
      apply(t, g, a) {
        if (a[1]) a[1] = URLParser.encode(a[1], $Rhodium)
        if ($Rhodium.replit) a[1] = a[1].replace('https://', 'https:/')
        return Reflect.apply(t, g, a)
      }
    })
  }
  Worker() {
    return new Proxy(window.Worker, {
      construct(t, a) {
        if (a[0]) a[0] = URLParser.encode(a[0], $Rhodium)
        return Reflect.construct(t, a);
      }
    })
  }
  Eval() {
    return new Proxy(window.eval, {
      apply(t, g, a) {
        return Reflect.apply(t, g, a)
      }
    })
  }
  Open() {
    return new Proxy(window.open, {
      apply(t, g, a) {
        if (a[0]) a[0] = URLParser.encode(a[0], $Rhodium)
        return Reflect.apply(t, g, a)
      }
    })
  }
  PostMessage() {
    return new Proxy(window.postMessage, {
      apply(t, g, a) {
        if (a[1]) a[1] = location.origin;
        return Reflect.apply(t, g, a)
      }
    })
  }
  Navigator() {
    var oSBeacon = window.navigator.sendBeacon
    return new Proxy(window.navigator, {
      get(o, obj) {
        if (obj = 'sendBeacon') {
          return function(url, data) {
            if (url) url = URLParser.encode(url, $Rhodium)
            return oSBeacon.apply(this, arguments);
          };
        }
        //if (obj=='userAgent')
        return navigator[obj]
      }
    })
  }
}

Object.defineProperty(document, 'domain', {
  get() {
    return $Rhodium.Url.hostname;
  },
  set(val) {
    return val;
  }
});

var oCookie = document.cookie

Object.defineProperty(document, 'cookie', {
  get() {
    var cookie = Object.getOwnPropertyDescriptor(window.Document.prototype, 'cookie').get.call(this),
      new_cookie = [],
      cookie_array = cookie.split('; ');
    cookie_array.forEach(cookie => {
      const cookie_name = cookie.split('=').splice(0, 1).join(),
        cookie_value = cookie.split('=').splice(1).join();
      if ($Rhodium.Url.hostname.includes(cookie_name.split('@').splice(1).join())) new_cookie.push(cookie_name.split('@').splice(0, 1).join() + '=' + cookie_value);
    });
    return new_cookie.join('; ');;
  },
  set(val) {
    Object.getOwnPropertyDescriptor(Document.prototype, 'cookie').set.call(this, val);
  }
})

Object.defineProperty(window, "PLocation", {
  set: function(newValue){
    if (!newValue) return;
    rLocation.href = (newValue)
    resetLocation();
  },
  get: function(){
    return rLocation.href;
  }
});

window.Navigator.prototype.sendBeacon = function(url, data) {
  if (url) url = new Base(ctx).url(url);
  return oSBeacon.apply(this, arguments);
};

$Rhodium = new Rhodium(JSON.parse(document.currentScript.getAttribute('data-config')))

const Encoding = (ctx) => {
  switch(ctx.encode) {
    case "xor":
      return {
        encode(str) {
          return str
        },
        decode(str) {
          return str
        }
      }
      break;
    case "plain":
      return {
        encode(str) {
          return str
        },
        decode(str) {
          return str
        }
      }
      break;
    case "base64":
      return {
        encode(str) {
          return str
        },
        decode(str) {
          return str
        }
      }
      break;
    default:
      return {
        encode(str) {
          return str
        },
        decode(str) {
          return str
        }
      }
      break;
  }
}
$Rhodium.encoding = Encoding($Rhodium)
const URLParser = (function URL(ctx, curl) {
  return {
    encode(url, context) {
      try {
        url = url.toString()
        if (url.match(/^(data:|about:|javascript:|blob:)/g)) return url;
        else if (url.startsWith('./')) url = url.splice(2);
        if (url.startsWith(ctx.prefix)) return url
        url = url.replace(/^\/\//g, 'https://')
        const validProtocol = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ws://') || url.startsWith('wss://');
        if (!context.Url.origin.endsWith('/') && !url.startsWith('/')) {
          context.Url.origin = context.Url.origin + '/'
        }
        const rewritten = ctx.prefix + (validProtocol ? url : context.Url.origin + url);
        //throw new Error('');
        if (context.replit) rewritten = rewritten.replace('https://', 'https:/')
        return rewritten.replace('http:', 'https:');
      } catch {
        return url
      }
    },
    decode(url) {
      return ctx.encoding.decode(url.replace(ctx.prefix, ''))
    }
  }
})($Rhodium)
//const Rewrite = require('../rewrite/bundle')

$Rhodium.Url = new URL($Rhodium.url)

const Proxify = (function(rhodium, URLParser) {
  var proxify={};proxify.elementHTML=element_array=>{element_array.forEach(element=>{Object.defineProperty(element.prototype, 'innerHTML',{set(value){const elem=new DOMParser().parseFromString(Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this), 'text/html').body.querySelectorAll('*')[0]; Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").set.call(elem, value); elem.querySelectorAll("script[src], iframe[src], embed[src], audio[src], img[src], input[src], source[src], track[src], video[src]").forEach(node=> node.setAttribute('src', node.getAttribute('src'))); elem.querySelectorAll("object[data]").forEach(node=> node.setAttribute('data', node.getAttribute('data'))); elem.querySelectorAll("a[href], link[href], area[href").forEach(node=> node.setAttribute('href', node.getAttribute('href'))); return Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").set.call(this, elem.innerHTML);}, get(){return Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").get.call(this);}}); Object.defineProperty(element.prototype, 'outerHTML',{set(value){const elem=new DOMParser().parseFromString(Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this), 'text/html').body; Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").set.call(elem.querySelectorAll('*')[0], value); elem.querySelectorAll("script[src], iframe[src], embed[src], audio[src], img[src], input[src], source[src], track[src], video[src]").forEach(node=> node.setAttribute('src', node.getAttribute('src'))); elem.querySelectorAll("object[data]").forEach(node=> node.setAttribute('data', node.getAttribute('data'))); elem.querySelectorAll("a[href], link[href], area[href").forEach(node=> node.setAttribute('href', node.getAttribute('href'))); return Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").set.call(this, elem.innerHTML);}, get(){return Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this);}});});};proxify.elementAttribute=(element_array, attribute_array)=>{element_array.forEach(element=>{if (element==window.HTMLScriptElement){Object.defineProperty(element.prototype, 'integrity',{set(value){return this.removeAttribute('integrity')}, get(){return this.getAttribute('integrity');}}); Object.defineProperty(element.prototype, 'nonce',{set(value){return this.removeAttribute('nonce')}, get(){return this.getAttribute('nonce');}});}element.prototype.setAttribute=new Proxy(element.prototype.setAttribute,{apply(target, thisArg, [ element_attribute, value]){attribute_array.forEach(array_attribute=>{if (array_attribute=='srcset' && element_attribute.toLowerCase()==array_attribute){var arr=[]; value.split(',').forEach(url=>{url=url.trimStart().split(' '); url[0]=URLParser.encode(url[0] || '', rhodium); arr.push(url.join(' '));}); return Reflect.apply(target, thisArg, [ element_attribute, arr.join(', ')]);}; if (array_attribute=='http-equiv' && element_attribute.toLowerCase()==array_attribute){value='No-U-Content-Security-Policy'; return Reflect.apply(target, thisArg, [ element_attribute, value])}if (element_attribute.toLowerCase()==array_attribute) value=URLParser.encode(value || '', rhodium);}); return Reflect.apply(target, thisArg, [ element_attribute, value]);}}); attribute_array.forEach(attribute=>{Object.defineProperty(element.prototype, attribute,{set(value){return this.setAttribute(attribute, value);}, get(){return this.getAttribute(attribute);}});});});};
  return proxify
})($Rhodium, URLParser)

Proxify.elementHTML([ window.HTMLDivElement]);Proxify.elementAttribute([ window.HTMLAnchorElement, window.HTMLAreaElement, window.HTMLLinkElement], [ 'href']);Proxify.elementAttribute([ window.HTMLScriptElement, window.HTMLIFrameElement, window.HTMLEmbedElement, window.HTMLAudioElement, window.HTMLInputElement, window.HTMLTrackElement], [ 'src']);Proxify.elementAttribute([ window.HTMLImageElement, HTMLSourceElement], [ 'src', 'srcset']);Proxify.elementAttribute([ window.HTMLObjectElement], [ 'data']);Proxify.elementAttribute([ window.HTMLFormElement], [ 'action']); 

document.querySelectorAll = $Rhodium.querySelectorAll();
document.getElementsByTagName = $Rhodium.getElementsByTagName();

window.fetch = $Rhodium.fetch();
window.History.prototype.pushState = $Rhodium.History().pushState;
window.History.prototype.replaceState = $Rhodium.History().replaceState;
window.WebSocket = $Rhodium.WebSocket();
window.XMLHttpRequest.prototype.open = $Rhodium.XMLHttpRequest();
window.Worker = $Rhodium.Worker();
window.open = $Rhodium.Open();
window.rLocation = $Rhodium.Location();
document.rLocation = rLocation;
window.postMessage = $Rhodium.PostMessage();
window.navigator = $Rhodium.Navigator();
window.eval = $Rhodium.Eval();

window.Function = new Proxy(window.Function, {
  construct(t, a) {
    return Reflect.construct(t, a)
  }
})

document.currentScript.remove()