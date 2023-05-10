function URL(ctx, curl) {
  return {
    encode(url, context) {
      try {
        url = url.toString()
        url = (typeof window == 'object' ? url.replace(location.hostname, $Rhodium.location.hostname) : url)
        if (url.match(/^(data:|about:|javascript:|blob:)/g)) return url;
        else if (url.startsWith('./')) url = url.splice(2);
        if (url.startsWith(ctx.prefix)) return url
        url = url.replace(/^\/\//g, 'https://')
        const validProtocol = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ws://') || url.startsWith('wss://');
        if (!context.Url.origin.endsWith('/') && !url.startsWith('/') && !url.startsWith('http:') && !url.startsWith('https:')) {
          url = '/'+url
        }
        var rewritten = ctx.prefix + ctx.encoding.encode(validProtocol ? url : context.Url.origin + url);
        if (context.clientRequest.headers['x-replit-user-id']=='') rewritten = rewritten.replace('https://', 'https:/')
        //throw new Error('');
        return rewritten.replace('http:', 'https:');
      } catch {
        return url
      }
    },
    decode(url) {
      return ctx.encoding.decode(url.replace(ctx.prefix, ''))
    }
  }
}

module.exports = URL