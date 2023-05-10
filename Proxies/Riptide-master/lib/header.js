function Header(ctx) {
  return {
    request(request, response) {
      delete request.headers['host']
      delete request.headers['accept-encoding']
      delete request.headers['cache-control']
      delete request.headers['upgrade-insecure-requests']
      //request.headers['host'] = new URL(ctx.encoding.decode(request.url.replace(ctx.prefix, ''))).hostname
      request.headers['origin'] = new URL(ctx.encoding.decode(request.url.replace(ctx.prefix, ''))).origin
      request.headers['referrer'] = new URL(ctx.encoding.decode(request.url.replace(ctx.prefix, ''))).href
      if (ctx.userAgent) request.headers['user-agent'] = ctx.userAgent
      return request.headers
    },
    response(request, response) {
      var cont = ctx
      cont.Url = new URL(ctx.encoding.decode(request.url.replace(ctx.prefix, '')))
      Object.entries(response.headers).forEach(([name, value]) => {
        if (name=='Location'||name=='location') {
          response.headers[name] = ctx.url.encode(value, cont)
        }
        if (name=='Refresh'||name=='refresh') {
          response.headers[name] = value.split(';')[0] + ' ; ' + value.split(';')[1]
        }
      });
      [
        'content-length',
        'content-security-policy',
        'content-security-policy-report-only',
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
      ].forEach(name => delete response.headers[name]);
      if (ctx.cors==true) response.headers['access-control-allow-origin'] = '*'
      return response.headers
    }
  }
}

module.exports = Header