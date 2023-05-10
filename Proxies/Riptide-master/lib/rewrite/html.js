if (typeof window == 'undefined') var { JSDOM } = require('jsdom');
else {var DomParser = new DOMParser();var { JSDOM: parseFromString} = DomParser;}

function HTMLRewriter(ctx) {
  return function HTML(data, request, context) {
    const ctx = context
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

    JSDOM.prototype.removeAttribute=function(attr) {}

    var html = new JSDOM(data, {'content-type': 'text/html'}), document = html.window.document;

    HTML_REWRITE_CONFIG.forEach((_config) => {
      if (_config.action[0]=='css') {
        _config.elements.forEach((el) => {
          document.querySelectorAll(`${el}`).forEach(node => {
            if (node.textContent) node.textContent = ctx.rewrite.CSS(node.textContent||'', context);
          })
        })
        _config.tags.forEach((tag) => {
          document.querySelectorAll(`*[${tag}]`).forEach(node => {
            //if (node[tag]) node[tag] = ctx.rewrite.CSS(node[tag]||'', context);
          })
        })
      }
      if (_config.action[0]=='js') {
        _config.elements.forEach((el) => {
          document.querySelectorAll(`${el}`).forEach(node => {
            if (node.textContent) node.textContent = ctx.rewrite.JS(node.textContent, cont);
          })
        })
        _config.tags.forEach((tag) => {
          document.querySelectorAll(`*[${tag}]`).forEach(node => {
            if (node[tag]) node[tag] = ctx.rewrite.JS(node[tag], cont);
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
            node.setAttribute(tag, RewriteSrcset(node.getAttribute(tag)))
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

    function RewriteSrcset(sample) {
      return sample.split(',').map(e => {
        return(e.split(' ').map(a => {
          if (a.startsWith('http')||(a.startsWith('/')&&!a.startsWith(ctx.prefix))) {
            var url = ctx.url.encode(a, cont)
          }
          return a.replace(a, (url||a))
        }).join(' '))
      }).join(',')
    }

    function InjectScript(){
      if (request.headers['x-replit-user-id']=='') injectData['replit'] = 'true'
      var e = document.createElement('script')
      e.setAttribute('data-config', JSON.stringify(injectData))
      e.src = injectData.prefix + 'index'
      document.querySelector('head').insertBefore(e, document.querySelector('head').childNodes[0])
    }

    InjectScript()

    return html.serialize()
  }
}

module.exports = HTMLRewriter