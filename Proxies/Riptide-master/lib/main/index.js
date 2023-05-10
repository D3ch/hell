const $RConfig = JSON.parse(document.currentScript.getAttribute('data-config'))
$RConfig.url = $RConfig.url.replace('https://', 'https:/').replace('https:/','https://')

class rLocation {
  get [Symbol.toPrimitive]() {
      return () => this.href;
  };
}

window.EncodingConfiguration = ((ctx) => {
    switch(ctx.encode) {
      case "xor":
        return xor()
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
      case 'cc':
        var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','0','1','2','3','4','5','6','7','8','9',':','/','.','z']
        return {
          encode(str, key = 10) {
            if (!str) return str
            if (key>25) return str
            str = str.toLowerCase()
            return str.split('').map((e, ind) => {
              if (!e) return ''
              var o = e;
              e = letters[letters.indexOf(e)+key]
              if ((letters.indexOf(o)+key)>38) e = letters[(letters.indexOf(o)+key)-39]
              return e||''
            }).join('')
          },
          decode(str, key = 10) {
            if (!str) return str;
            if (key>25) return str;
            str = str.toString()
            if (str.endsWith('/')) {
              var Slash = true;str = str.replace(/\/$/g, '')
            }
            str = str.toLowerCase();
            return str.split('').map((e, ind) => {
              if (!e) return ''
              var o = e
              e = letters[letters.indexOf(e)-key]
              if ((letters.indexOf(o)-key)<0) e = letters[(letters.indexOf(o)-key)+39]
              return e
            }).join('')+(Slash?'/':'')
          }
        }
        break;
      case "b64":
        return {
          encode(str) {
            return btoa(str)
          },
          decode(str) {
            return atob(str)
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
  })($RConfig)

window.$Rhodium = {
  location: {},
  Location: new rLocation(),
  Url: new URL($RConfig.url),
  encoding: EncodingConfiguration
}

function xor() {
  return {
    encode(str) {
      //if (str.startsWith('hvtrs')) return 
      return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
    },
    decode(str) {
      //if (str.startsWith('http')) return 
      return decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('');
    }
  }
}

Object.entries($RConfig).forEach(([e,v])=>$Rhodium[e]=v)

Object.defineProperty($Rhodium, 'hlocation', {
  get() {
    return $Rhodium.location.href
  },
  set(val) {
    location.href = $Rhodium.url.encode(val,{Url:new URL($Rhodium.location.href)})
  }
})

$Rhodium.RewriteSrcset = function(sample) {
  return sample.split(',').map(e => {
    return(e.split(' ').map(a => {
      if (a.startsWith('http')||(a.startsWith('/')&&!a.startsWith($RConfig.prefix))) {
        var url = $Rhodium.url.encode(a, {Url:new URL($Rhodium.location.href)})
      }
      return a.replace(a, (url||a))
    }).join(' '))
  }).join(',')
}

$Rhodium.UndoSrcset = function(sample) {
  return sample.split(',').map(e => {
    return(e.split(' ').map(a => {
      if (a.startsWith($RConfig.prefix)) {
        var url = $Rhodium.url.decode(a, {Url:new URL($Rhodium.location.href)})
      }
      return a.replace(a, (url||a))
    }).join(' '))
  }).join(',')
}

$RConfig.encoding = ($Rhodium.encoding)

$Rhodium.url = (function URL(ctx, curl) {
  return {
    encode(url, context) {
      try {
        url = url.toString()
        url = (typeof window == 'object' ? url.replace(location.hostname, $Rhodium.location.hostname) : url)
        if (url.match(/^(javascript:|about:|mailto:|data:|blob:|#)/gi)) return url;
        else if (url.startsWith('./')) url = url.splice(2);
        if (url.startsWith(ctx.prefix)) return url
        if (url.startsWith(location.origin+ctx.prefix)) return url
        if (ctx.encode=='xor'&&url.startsWith('hvtrs')) return ctx.prefix+url
        url = url.replace(/^\/\//g, 'https://')
        const validProtocol = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ws://') || url.startsWith('wss://');
        if (!context.Url.origin.endsWith('/') && !url.startsWith('/') && !url.startsWith('http:') && !url.startsWith('https:')) {
          url = '/'+url
        }
        var rewritten = ctx.prefix + ctx.encoding.encode(validProtocol ? url : context.Url.origin + url);
        //throw new Error('');
        if ($RConfig.replit) rewritten = rewritten.replace('https://', 'https:/')
        return rewritten.replace('http:', 'https:').replace('https:/'+location.hostname, '').replace(location.origin, '');
      } catch(e) {
        return url
      }
    },
    decode(url) {
      return url?$Rhodium.encoding.decode(url.replace($Rhodium.prefix, '').replace(location.origin, '')).replace('https://', 'https:/').replace('https:/','https://'):undefined
    }
  }
})({...$RConfig,$Rhodium})

var _window = window

$Rhodium.Location = function(url, window = _window) {
  window.$Rhodium.location = {}
  var go = function(v) {return window.$Rhodium.url.encode(v, {Url: new URL($RConfig.url)})};
  window.$Rhodium.go = go;
  ['href','host','hash','origin','hostname','port','pathname','protocol','search'].forEach(prop => {
    Object.defineProperty(window.$Rhodium.location, prop, {
      get() {
        if (prop=='protocol') return window.location.protocol
        return url[prop]
      },
      set(val) {
        return window.location[prop] = window.$Rhodium.go(window.$Rhodium.Url.href.replace(window.$Rhodium.Url[prop], val));
      }
    })
  });
  ['assign','replace','toString','reload'].forEach(prop => {
    Object.defineProperty(window.$Rhodium.location, prop, {
      get() {
        return new Function('arg', `return window.location.${prop}(arg?${prop!=='reload'&&prop!=='toString'?'$Rhodium.go(arg)':'arg'}:null)`)
      },
      set(val) {
        return val
      }
    })
  })
  /*$Rhodium.location.href = url.href
  $Rhodium.location.hostname = url.hostname
  $Rhodium.location.host = url.host
  $Rhodium.location.origin = url.origin
  $Rhodium.location.port = url.port
  $Rhodium.location.pathname = url.pathname
  $Rhodium.location.protocol = location.protocol
  $Rhodium.location.search = url.search
  $Rhodium.location.hash = url.hash
  $Rhodium.location.assign = (a) => window.location.assign(a)
  $Rhodium.location.replace = (a) => window.location.replace(a)
  $Rhodium.location.toString = () => $Rhodium.location.href.toString()
  $Rhodium.location.reload = (a) => location.reload(a?a:null)*/
  if (window!==_window) return window
}

$Rhodium.css = function(body) {
  function CSSRewriter(ctx) {
    return function CSS(data, context) {
      const cont = context;
      cont.Url = new URL(ctx.encoding.decode($RConfig.url.replace(ctx.prefix, '')))
      return data.replace(/url\("(.*?)"\)/gi, str => {var url = str.replace(/url\("(.*?)"\)/gi, '$1');return `url("${context.url.encode(url, cont)}")`;}).replace(/url\('(.*?)'\)/gi, str => {var url = str.replace(/url\('(.*?)'\)/gi, '$1');return `url('${context.url.encode(url, cont)}')`;}).replace(/url\((.*?)\)/gi, str => {var url = str.replace(/url\((.*?)\)/gi, '$1');if (url.startsWith(`"`) || url.startsWith(`'`)) return str;return `url("${context.url.encode(url, cont)}")`;}).replace(/@import (.*?)"(.*?)";/gi, str => {var url = str.replace(/@import (.*?)"(.*?)";/, '$2');return `@import "${context.url.encode(url, cont)}";`}).replace(/@import (.*?)'(.*?)';/gi, str => {var url = str.replace(/@import (.*?)'(.*?)';/, '$2');return `@import '${context.url.encode(url, cont)}';`})
    }
  }
  return CSSRewriter($Rhodium)(body, arguments[1]?arguments[1]:$Rhodium)
}

Object.defineProperty(window.document, 'domain', {
  get() {
    return $Rhodium.location.hostname
  },
  set(val) {
    return val
  }
})

const Cookies = Object.getOwnPropertyDescriptor(window.Document.prototype, 'cookie')

const Navigat0r = Object.getOwnPropertyDescriptor(window, 'navigator')

//delete window.navigator

const sendBeaconProxy = new Proxy(Navigat0r.get.call(this).sendBeacon, {
  apply(t, g, a) {
    a[0] = $Rhodium.url.encode(a[0], {Url: new URL($RConfig.url)})
    return Reflect.apply(t, g, a)
  }
})

window.navigator.sendBeacon = sendBeaconProxy

/*window.navigator = new Proxy(Navigat0r.get.call(this), {
  get(o, prop) {
    if (prop=='userAgent'&&$RConfig.userAgent) return $RConfig.userAgent
    if (prop=='sendBeacon') return sendBeaconProxy
    return o[prop]
  },
  set(o, prop, value) {
    if (prop=='userAgent'||prop=='sendBeacon') return value
    return o[prop] = value
  }
})*/


Object.defineProperty(window.document, 'cookie', {
  get() {
    var cookieString = Cookies.get.call(this)
    var cookies = []
    cookieString.split('; ').map(e => e.split('=').map(a=>a.startsWith($Rhodium.location.hostname)?cookies.push(`${e.split('=')[0].replace($Rhodium.location.host, '')}=${e.split('=')[1]}`):null))
    return cookies.join('; ')
  },
  set(val) {
    var newVal = val.split('=').map((e,i)=>val.split('=').indexOf(e)==0?$Rhodium.location.host+e:e).join('=')
    return Cookies.set.call(this, newVal)
  }
})

$Rhodium.html = function(body) {
  //if (typeof window == 'undefined') var { JSDOM } = require('jsdom');
  //else {var DomParser = new DOMParser();var { JSDOM: parseFromString} = DomParser;}

  function HTMLRewriter(ctx) {
    return function HTML(data, request, context) {

      const cont = ctx;
      cont.Url = new URL(ctx.encoding.decode(request.url.replace(ctx.prefix, '')))

      var HTML_REWRITE_CONFIG = [
        {
          tags: ['http-equiv'],
          action: ['replace'],
          new: 'No-U-Content-Security-Policy',
        },
        {
          tags: ['href', 'src', 'action'],
          action: ['rewrite'],
        },
        {
          tags: ['srcset'],
          action: ['srcset'],
        },
        {
          tags: ['integrity'],
          action: ['replace'],
          newtag: 'nointegrity',
        },
        {
          tags: ['nonce'],
          action: ['replace'],
          newtag: 'nononce'
        },
        {
          elements: ['style'],
          tags: ['style'],
          action: ['css']
        },
        {
          elements: ['script'],
          tags: ['onclick'],
          action: ['js']
        }
      ]

      var injectData = {
        prefix: ctx.prefix,
        url: ctx.encoding.decode(request.url.replace(ctx.prefix, '')),
        title: ctx.title,
        encode: ctx.encode,
        userAgent: ctx.userAgent,
      }

      //JSDOM.prototype.removeAttribute=function(attr) {}

      var parser = new DOMParser();

      var html = parser.parseFromString(data, 'text/html')//, document = html.window.document;

      HTML_REWRITE_CONFIG.forEach((_config) => {
        if (_config.action[0]=='css') {
          _config.elements.forEach((el) => {
            document.querySelectorAll(`${el}`).forEach(node => {
              if (node.textContent) node.textContent = $Rhodium.css(node.textContent||'', context);
            })
          })
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              //if (node[tag]) node[tag] = $Rhodium.css(node[tag]||'', context);
            })
          })
        }
        if (_config.action[0]=='js') {
          _config.elements.forEach((el) => {
            document.querySelectorAll(`${el}`).forEach(node => {
              //if (node.textContent) node.textContent = ctx.rewrite.JS(node.textContent);
            })
          })
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              //if (node[tag]) node[tag] = ctx.rewrite.JS(node[tag]);
            })
          })
        }
        if (_config.action[0]=='rewrite') {
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              node.setAttribute('data-rhodium', node.getAttribute(tag))
              node.setAttribute(tag, ctx.url.encode(node.getAttribute(tag), cont))
            })
          })
        }
        if (_config.action[0]=='srcset') {
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              node.setAttribute('data-rhodium', node.getAttribute(tag))
              node.setAttribute(tag, $Rhodium.RewriteSrcset(node.getAttribute(tag)))
            })
          })
        }
        if (_config.action[0]=='replace') {
          _config.tags.forEach((tag) => {
            document.querySelectorAll(`*[${tag}]`).forEach(node => {
              if (_config.new) {
                node.setAttribute(tag, _config.new)
                node.removeAttribute(tag)
              }
              if (_config.newtag) {
                node.setAttribute(_config.newtag, node.getAttribute(tag))
                node.removeAttribute(tag)
              }
            })
          })
        }
      })

      return html
    }
  }
  HTMLRewriter($Rhodium)(body, $RConfig, $Rhodium)
}

setInterval(() => {
  /*document.querySelectorAll('a').forEach(node => {
    if (!node.getAttribute('data-rhodium')) {
      if (node.href) node.setAttribute('href', $Rhodium.go(node.href))
      node.setAttribute('data-rhodium', true)
    }
  })*/
}, 100)

var _window = window

$Rhodium.Element = function(window) {
  if (!window) window = _window;
  try {
  Object.defineProperty(window.HTMLDivElement.prototype, 'innerHTML', {
    set(value) {
      const elem = new DOMParser().parseFromString(Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this), 'text/html').body.querySelectorAll('*')[0];
      Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").set.call(elem, value);
      elem.querySelectorAll("script[src], iframe[src], embed[src], audio[src], img[src], input[src], source[src], track[src], video[src]").forEach(node => node.setAttribute('src', node.getAttribute('src')));
      elem.querySelectorAll("object[data]").forEach(node => node.setAttribute('data', node.getAttribute('data')));
      elem.querySelectorAll("a[href], link[href], area[href").forEach(node => node.setAttribute('href', node.getAttribute('href')));
      return Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").set.call(this, elem.innerHTML);
    },
    get() {
      return Object.getOwnPropertyDescriptor(window.Element.prototype, "innerHTML").get.call(this);
    }
  });
  Object.defineProperty(window.HTMLDivElement.prototype, 'outerHTML', {
    set(value) {
      const elem = new DOMParser().parseFromString(Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this), 'text/html').body;
      Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").set.call(elem.querySelectorAll('*')[0], value);
      elem.querySelectorAll("script[src], iframe[src], embed[src], audio[src], img[src], input[src], source[src], track[src], video[src]").forEach(node => node.setAttribute('src', node.getAttribute('src')));
      elem.querySelectorAll("object[data]").forEach(node => node.setAttribute('data', node.getAttribute('data')));
      elem.querySelectorAll("a[href], link[href], area[href").forEach(node => node.setAttribute('href', node.getAttribute('href')));
      return Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").set.call(this, elem.innerHTML);
    },
    get() {
      return Object.getOwnPropertyDescriptor(window.Element.prototype, "outerHTML").get.call(this);
    }
  });
  } catch {}
  var element = window.Element
  element.prototype.setAttribute = new Proxy(element.prototype.setAttribute, {
    apply(target, thisArg, [ element_attribute, value ]) {

        // Customized "srcset" rewriting.
      if (element_attribute=='srcset') {
        value = $Rhodium.RewriteSrcset(value)

        return Reflect.apply(target, thisArg, [ element_attribute, value ]);
      };

      if (['src', 'srcset', 'data', 'href', 'action'].indexOf(element_attribute.toLowerCase())>-1) value = $Rhodium.url.encode(value, {Url: new URL($RConfig.url)});
      return Reflect.apply(target, thisArg, [ element_attribute, value ]);
    }
  });
  [
    {
      "elements": [window.HTMLLinkElement],
      "tags": ['sussy'],
      "attributes": ['rel="icon"','rel="shortcut icon"'],
      "action": "config"
    },
    {
      "elements": [window.HTMLScriptElement, window.HTMLIFrameElement, window.HTMLEmbedElement, window.HTMLAudioElement, window.HTMLInputElement, window.HTMLTrackElement, window.HTMLMediaElement,window.HTMLSourceElement],
      "tags": ['src'],
      "action": "url"
    },
    {
      "elements": [window.HTMLSourceElement, window.HTMLImageElement],
      "tags": ['srcset'],
      "action": "srcset"
    },
    {
      "elements": [window.HTMLAnchorElement, window.HTMLLinkElement, window.HTMLAreaElement],
      "tags": ['href'],
      "action": "url"
    },
    {
      "elements": [window.HTMLIFrameElement],
      "tags": ['contentWindow'],
      "action": "window"
    },
    {
      "elements": [window.HTMLFormElement],
      "tags": ['action'],
      "action": "url"
    }, 
    {
      "elements": [window.HTMLObjectElement],
      "tags": ['data'],
      "action": "url",
    }
  ].forEach(config => {
    config.elements.forEach(element => {
      if (element == window.HTMLScriptElement) {
        try {
          Object.defineProperty(element.prototype, 'integrity', {
            set(value) {
              return this.removeAttribute('integrity')
            },
            get() {
              return this.getAttribute('integrity');
            },
            configurable: true
          });
          Object.defineProperty(element.prototype, 'nonce', {
            set(value) {
              return this.removeAttribute('nonce')
            },
            get() {
              return this.getAttribute('nonce');
            },
            configurable: true
          });
        } catch {}
      }
      config.tags.forEach(prop => {
        if (!element) return;
        if (!element.prototype.hasOwnProperty(prop)) return;
        const descriptor = Object.getOwnPropertyDescriptor(element.prototype, prop);
        Object.defineProperty(element.prototype, prop, {
          get: descriptor.get ? new Proxy(descriptor.get, {
            apply: (target, that, args) => {
              var val = Reflect.apply(target, that, args);
              switch(config.action) {
                case 'url':
                  val = $Rhodium.url.decode(val);
                  break;
                case 'window':
                  try {
                    if (!val.$Rhodium)  {
                      val = new $Rhodium.Window(val)
                    };
                  } catch(e) {};
                  break;
                case 'srcset':
                  val = $Rhodium.UndoSrcset(val)
                  break;
                default:
                  break;
              };
              return val||'';
            }, 
          }) : undefined,
          set: descriptor.set ? new Proxy(descriptor.set, {
            apply(target, that, [ val ]) {
              let newVal = val;
              switch(config.action) {
                case 'url':
                  if (val.startsWith('blob:')) return Reflect.apply(target, that, [ newVal ]);
                  newVal = $Rhodium.url.encode(newVal, {Url: new URL($RConfig.url)});
                  break;
                case 'srcset':
                  newVal = $Rhodium.RewriteSrcset(val);
                  break;
                case 'window':
                  newVal = val
                  break;
                default:
                  newVal = val
                  break;
              };
              return Reflect.apply(target, that, [ newVal ]);
            },
          }) : undefined,
          configurable: true
        });
      })
    })
  })
  var proxify={}
proxify.elementAttribute = (element_array, attribute_array) => {
    element_array.forEach(element => {
      try {

        /*if (element == window.HTMLScriptElement) {
            Object.defineProperty(element.prototype, 'integrity', {
                set(value) {
                    return this.removeAttribute('integrity')
                },
                get() {
                    return this.getAttribute('integrity');
                }
            });
            Object.defineProperty(element.prototype, 'nonce', {
                set(value) {
                    return this.removeAttribute('nonce')
                },
                get() {
                    return this.getAttribute('nonce');
                }
            });
        }*/

        try {element.amongus} catch {return''}

        element.prototype.setAttribute = new Proxy(element.prototype.setAttribute, {
            apply(target, thisArg, [ element_attribute, value ]) {
                attribute_array.forEach(array_attribute => {

                    if (array_attribute == 'srcset' && element_attribute.toLowerCase() == array_attribute) {
                        var arr = [];

                        value.split(',').forEach(url => {
                            url = url.trimStart().split(' ');
                            url[0] = $Rhodium.go(url[0] || '');
                            arr.push(url.join(' '));
                        });

                        return Reflect.apply(target, thisArg, [ element_attribute, arr.join(', ') ]);
                    };

                    if (array_attribute == 'http-equiv' && element_attribute.toLowerCase() == array_attribute) {
                      value = 'No-U-Content-Security-Policy'
                      return Reflect.apply(target, thisArg, [ element_attribute, value ])
                    }

                    if (element_attribute.toLowerCase() == array_attribute) value = $Rhodium.go(value || '');
                });
                return Reflect.apply(target, thisArg, [ element_attribute, value||"" ]);
            }
        });

        element.prototype.getAttribute = new Proxy(element.prototype.getAttribute, {
          apply(t, g, [attribute]) {
            attribute_array.forEach(array_attribute => {
              if (attribute.toLowerCase() == array_attribute) return g[attribute]
            })
            return Reflect.apply(t, g, [attribute])
          }
        })

        /*attribute_array.forEach(attribute => {

            Object.defineProperty(element.prototype, attribute, {
                set(value) {
                    return this.setAttribute(attribute, value);
                },
                get() {
                    return this.getAttribute(attribute);
                }
            }); 

        });*/
      } catch {}
    });
};

proxify.elementAttribute([ window.HTMLAnchorElement, window.HTMLAreaElement, window.HTMLLinkElement ], [ 'href' ]);

proxify.elementAttribute([ window.HTMLScriptElement, window.HTMLIFrameElement, window.HTMLEmbedElement, window.HTMLAudioElement, window.HTMLInputElement, window.HTMLTrackElement ], [ 'src' ]);

proxify.elementAttribute([ window.HTMLImageElement, HTMLSourceElement ], [ 'src', 'srcset' ]);

proxify.elementAttribute([ window.HTMLObjectElement ], [ 'data' ]);

proxify.elementAttribute([ window.HTMLFormElement ], [ 'action' ]); 
  if (_window!==window) return window
}

$Rhodium.Location(new URL($RConfig.url))

$Rhodium.document = {...HTMLMediaElement,HTMLScriptElement,HTMLAudioElement,HTMLVideoElement,HTMLInputElement,HTMLEmbedElement,HTMLTrackElement,HTMLAnchorElement,HTMLIFrameElement,HTMLAreaElement,HTMLLinkElement,HTMLBaseElement,HTMLFormElement,HTMLImageElement,HTMLSourceElement,HTMLElement,Element,Object,$Rhodium,$RConfig,window,HTMLDivElement}

$Rhodium.document = $Rhodium.Element($Rhodium.document)

$Rhodium.Element()

window.Worker = new Proxy(window.Worker, {
  construct(t, a) {
    a[0] = $Rhodium.url.encode(a[0], {Url:new URL($RConfig.url)})
    return Reflect.construct(t,a)
  }
})

$Rhodium.Worker = window.Worker

window.Document.prototype.writeln = new Proxy(window.Document.prototype.writeln, {
  apply: (target, that, args) => {
    if (args.length) args = [ $Rhodium.html(args.join('')) ];
    return Reflect.apply(target, that, args);
  },
});

var docWriteHTML = document.write

window.Document.prototype.write = function() {
  if (arguments[0]) {
    var regex = /(srcset|src|href|action|integrity|nonce|http-equiv)\s*=\s*['`"](.*?)['"`]/gi
    arguments[0] = arguments[0].toString()
    arguments[0] = arguments[0].replace(regex, (match, p1, p2) => {
      if (p1=='integrity' || p1=='nonce' || p1=='http-equiv') return ''
      if (p1=='srcset') {
        const src_arr = [];

        p2.split(',').forEach(url => {
          url = url.trimStart().split(' ');
          url[0] = $Rhodium.url.encode(url[0], {Url: new URL($RConfig.url)});
          src_arr.push(url.join(' '));
        });

        p2 = src_arr.join(', ')
        return `${p1}="${p2}"`
      }
      return `${p1}="${$Rhodium.url.encode(p2, {Url: new URL($RConfig.url)})}"`
    })
  }
  return docWriteHTML.apply(this, arguments)
}

history.pushState({},'',$RConfig.prefix+$Rhodium.encoding.encode($Rhodium.location.href))

window.History.prototype.pushState = new Proxy(window.History.prototype.pushState, {
  apply(t, g, a) {
    a[2] = $Rhodium.url.encode(a[2], {Url: new URL($RConfig.url)})
    Reflect.apply(t, g, a)
    return $Rhodium.Location(new URL($Rhodium.url.decode(location.pathname)))
  }
})

window.History.prototype.replaceState = new Proxy(window.History.prototype.replaceState, {
  apply(t, g, a) {
    a[2] = $Rhodium.url.encode(a[2],{Url: new URL($RConfig.url)})
    Reflect.apply(t,g,a)
    return $Rhodium.Location(new URL($Rhodium.url.decode(window.location.pathname+location.search+location.hash)))
  }
})

$Rhodium.history={pushState:window.History.prototype.pushState,replaceState:window.History.prototype.replaceState}

window.XMLHttpRequest.prototype.open = new Proxy(window.XMLHttpRequest.prototype.open, {
  apply(t, g, a) {
    a[1] = $Rhodium.url.encode(a[1], {Url: new URL($RConfig.url)})
    return Reflect.apply(t, g, a)
  }
})

$Rhodium.XMLHttpRequest = {prototype:{open:window.XMLHttpRequest.prototype.open}}

window.fetch = new Proxy(window.fetch, {
  apply(t, g, a) {
    var arg = a[0]
    if (typeof a[0]=='object') {a[0]=={};a[0].url=$Rhodium.go(arg.url);Object.assign(a[0],arg);return Reflect.apply(t,g,a)}//.url = $Rhodium.url.encode(a[0].url, {Url: new URL($RConfig.url)});return Reflect.apply(t, g, a)}
    if (a[0]) a[0] = $Rhodium.url.encode(a[0], {Url: new URL($RConfig.url)})
    return Reflect.apply(t, g, a)
  }
})

$Rhodium.urlRequest = Object.getOwnPropertyDescriptor(window.Request.prototype, 'url');
window.Request = new Proxy(window.Request, {
    construct(target, args) {
        if (args[0]) args[0] = $Rhodium.go(args[0])
        return Reflect.construct(target, args);
    },
});
Object.defineProperty(window.Request.prototype, 'url', {
    get: new Proxy($Rhodium.urlRequest.get, {
        apply: (target, that, args) => {
            var url = Reflect.apply(target, that, args);
            return url ? $Rhodium.url.decode(url) : url;
        },
    }),
});

$Rhodium.fetch = window.fetch

window.postMessage = new Proxy(window.postMessage, {
  apply(t, g, a) {
    if (a[1]) a[1] = "*";
    return Reflect.apply(t, g, a)
  }
})

$Rhodium.postMessage = window.postMessage

window.open = new Proxy(window.open, {
  apply(t, g, a) {
    a[0] = $Rhodium.url.encode(a[0],{Url:new URL($RConfg.url)})
  }
})

$Rhodium.open = window.open

window.WebSocket = new Proxy(window.WebSocket, {
  construct(t, a) {
    $Rhodium.Url = new URL($RConfig.url)
    if (a[0].includes('?')) {
      var origin = '&origin='+$Rhodium.Url.origin
    } else var origin = '?origin='+$Rhodium.Url.origin
    var hostnm = location.port ? location.hostname+':'+location.port : location.hostname
    a[0] = a[0].replace(location.host, $Rhodium.location.host)
    if (!a[0].startsWith('wss:')||!a[0].startsWith('ws:')) {
      //a[0] = location.protocol.replace('http', 'ws')+'//'+window.rLocation.hostname+(a[0].startsWith('/')?a[0]:'/'+a[0])
    }
    a[0] = location.protocol.replace('http', 'ws')+'//'+hostnm+$Rhodium.prefix+'?ws='+$Rhodium.encoding.encode(a[0]+origin)
    return Reflect.construct(t, a)
  }
})

const LocalStorage = Object.getOwnPropertyDescriptor(window, 'localStorage').get.call(this)

delete window.localStorage

window.localStorage = new Proxy({}, {
  get(ob, name) {
    if (name=='getItem'||name=='setItem'||name=='removeItem') {
      if (name=='setItem') return function() {return LocalStorage.setItem($Rhodium.location.hostname+arguments[0], arguments[1])}
      if (name=='removeItem') return function() {return LocalStorage.removeItem($Rhodium.location.hostname+arguments[0])}
      if (name=='getItem') return function() {return LocalStorage.getItem($Rhodium.location.hostname+arguments[0])}
    } else {
      return LocalStorage.getItem($Rhodium.location.hostname+name)
    }
  },
  set(ob, name, value) {
    return LocalStorage.setItem($Rhodium.location.hostname+name, value)
  } 
})

var localStorage = window.localStorage

$Rhodium.Window = class {
  constructor(window) {
    const Spoof = {
      $Rhodium: {
        location: {},
        Location: $Rhodium.Location,
        Url: new URL(window.location.href),
        encoding: EncodingConfiguration,
        url: _window.$Rhodium.url
      },
      postMessage: $Rhodium.postMessage,
      history: {
        ...$Rhodium.history
      },
      Request: window.Request,
      localStorage: localStorage,
      fetch: $Rhodium.fetch,
      XMLHttpRequest: $Rhodium.XMLHttpRequest,
      document: {
        ...window.document,
        $Rhodium: $Rhodium
      }
    }
    Spoof.$Rhodium.Location(new URL(window.location.href), Spoof)
    Object.entries(window).forEach(([e,v])=> {
      if (e=='location'||Spoof[e]) return ''
      Spoof[e] = v
    })
    return Spoof
  }
}

/*
window.localStorage = {}

Object.entries(LocalStorage).forEach(e => {
  if (e[0]!=='setItem'&&e[0]!=='getItem'&&e[0]!=='removeItem') {
    window.localStorage[e[0]] = e[1]
    Object.defineProperty(window.localStorage, e[0].replace($Rhodium.location.hostname, ''), {
      get() {
        return window.localStorage.getItem(e[0].replace($Rhodium.location.hostname,''))
      },
      set(val) {
        return localStorage.setItem(e[0].replace($Rhodium.location.hostname,''), val)
      }
    })
  }
})

window.localStorage.setItem = function() {return LocalStorage.setItem($Rhodium.location.hostname+arguments[0], arguments[1])}

window.localStorage.getItem = function() {return LocalStorage.getItem($Rhodium.location.hostname+arguments[0])}

window.localStorage.removeItem = function() {return LocalStorage.removeItem($Rhodium.location.hostname+arguments[0])}*/

document.$Rhodium=$Rhodium

document.currentScript.remove()
