const urlp = require('url')

function Gateway(ctx) {
  return function(request, response) {
    if (!request.url.startsWith(ctx.prefix+'gateway')) return;
    var chunks = []
    request.on('data', data => chunks.push(data))
    request.on('end', () => {
      var string = Buffer.concat(chunks).toString()
      if (string==='') {
        if (!new URLSearchParams(urlp.parse(request.url, true).query).get('url')) return response.writeHead(500, {refresh: '5; /'}).end('Missing Parameter: URL')
        var url = new URLSearchParams(urlp.parse(request.url, true).query).get('url')
      } else {
        if (!new URLSearchParams(string).get('url')) return response.writeHead(500, {refresh: '5; /'}).end('Missing Parameter: URL')
        var url = new URLSearchParams(string).get('url')
      }
      if (!url.startsWith('http')) url = 'https://'+url

      url = url.replace(/http(s|):\/([a-zA-Z0-9]+)/g, 'https://$2')
      url = ctx.encoding.encode(url);
      response.writeHead(301, {location: `${this.prefix}${url}/`}).end('')
    })
  }
}

module.exports = Gateway