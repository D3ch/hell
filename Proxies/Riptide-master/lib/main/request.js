const http = require('http'),
  https = require('https')

function Request(ctx) {
  return function(request, response) {
    //var ctx = {gateway:octx.gateway,urlS: octx.urlS, index: octx.index, encoding: octx.encoding, header: octx.headers, rewrite: octx.rewrite, middleware: octx.middleware}
    if (request.url.startsWith(ctx.prefix+'gateway')) {
      return ctx.gateway(request, response)
    }
    if (request.url.startsWith(ctx.prefix+'index')) {
      return response.writeHead(200, {'content-type': 'application/javascript'}).end(ctx.index)
    }
    var url = ctx.encoding.decode(request.url.replace(ctx.prefix, '')).replace('https://','https:/').replace('https:/','https://')/*.replace('.map', '')*/.replace(/-$/g, '')
    if (url.endsWith(',jq.oar')) {
      //url = url.replace(url.split('/')[url.split('/').length - 1], '').replace(/\/$/, '')
    }

    if(url.endsWith('.asq.oar')) {
      url = url.split('-')[0]
    }

    ctx.url = ctx.urlS(ctx, url)
    ctx.clientRequest = request;
    ctx.clientResponse = response;
    try {new URL(url)} catch(e) {return response.writeHead(503).end(e.toString())}
    var Url = new URL(url)
    try {try {eval(Url.protocol.replace(':',''))} catch {url = ctx.encoding.encode(url);Url=new URL(url)}} catch(e) {return response.writeHead(503).end(e.toString())}
    //Url.address = request.headers['x-forwarded-for']
    var headers = ctx.header.request(request, response)
    const httpRequest = eval(Url.protocol.replace(':','')).request(Url, {method: request.method, headers: headers, rawHeaders: []}, (res) => {
      var chunks=[]
      res.on('data',e=>chunks.push(e)).on('end',()=>{
        //if (request.headers['x-replit-user-id']) url = url.replace('https://', 'https:/')
        var textData = ''
        textData = ctx.decompress(res, chunks)
        var type = (res.headers['content-type']||'text/plain').split(';')[0]
          if (type=='text/html') textData = ctx.rewrite.HTML(textData.toString(), request, ctx)
          if (type=='text/javascript') textData = ctx.rewrite.JS(textData.toString())
          if (type=='application/javascript'||type=='text/js'||type=='text/javascript') textData = ctx.rewrite.JS(textData.toString(), {Url: Url})
          if (type=='text/css') textData = ctx.rewrite.CSS(textData.toString(), ctx)
          if (type=='text/plain') textData = textData.toString()
        res.headers['rhodium-url'] = url
        response.writeHead(res.statusCode, ctx.header.response(request, res)).end(textData)
      })
    }).on('error', err => response.end('Error: '+err))
    if (!response.writableEnded) {
      request.on('data', (data) => httpRequest.write(data)).on('end', () => httpRequest.end())
    } else {
      httpRequest.end()
    }
  }
}

module.exports = Request