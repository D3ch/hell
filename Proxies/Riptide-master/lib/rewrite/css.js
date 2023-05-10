function CSSRewriter(ctx) {
  return function CSS(data, context) {
    const cont = context;
    try {try{cont.Url = new URL(ctx.encoding.decode(context.clientRequest.url.replace(ctx.prefix, '')))}catch{cont.Url=new URL(ctx.encoding.decode(ctx.encoding.decode(context.clientRequest.url.replace(ctx.prefix, ''))))}} catch {return data}
    return data.replace(/url\("(.*?)"\)/gi, str => {var url = str.replace(/url\("(.*?)"\)/gi, '$1');return `url("${context.url.encode(url, cont)}")`;}).replace(/url\('(.*?)'\)/gi, str => {var url = str.replace(/url\('(.*?)'\)/gi, '$1');return `url('${context.url.encode(url, cont)}')`;}).replace(/url\((.*?)\)/gi, str => {var url = str.replace(/url\((.*?)\)/gi, '$1');if (url.startsWith(`"`) || url.startsWith(`'`)) return str;return `url("${context.url.encode(url, cont)}")`;}).replace(/@import (.*?)"(.*?)";/gi, str => {var url = str.replace(/@import (.*?)"(.*?)";/, '$2');return `@import "${context.url.encode(url, cont)}";`}).replace(/@import (.*?)'(.*?)';/gi, str => {var url = str.replace(/@import (.*?)'(.*?)';/, '$2');return `@import '${context.url.encode(url, cont)}';`})
  }
}

module.exports = CSSRewriter