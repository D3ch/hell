function JSRewriter(ctx) {
  return function JS(data, url) {
    /*var ndata = data.replace(/(window|document|this|\s|\+|\(|;|\[|,|\)\s|\|)+[\.,\s]*location\.+/gmi, (str, p1) => {
      return str.replace(/location/gi, '$Rhodium.location')
    })
    ndata = ndata.replace(/(window|document|this)\[['"`]*location['"`]*\]/gm, (str, p1) => {
      return str.replace(/location/g, '$Rhodium.location')
    })
    ndata = ndata.replace(/(window|document|this|\s|\+|\(|;|\[|,|\|)\.*location[ ]*=[ ]*///gm, (str) => {
    //  return str.replace(/location/g, '$Rhodium.location')
    //}).replace('myScript.src','(myScript.src?myScript.src:"")');
    //# sourceMappingURL=http://example.com/path/to/your/sourcemap.map
    //ndata = ndata.replace(/\/\/#\s*sourceMappingURL\s*=\s*(.*?)/gi, (str, p1) => {
    //  return str.replace(p1, ctx.url.encode(p1, url))
    //})
    //return ndata
    if (url&&url.href&&url.href.startsWith('https://www.googletagmanager.com/gtm.js')) data = data.toString().replace(/t\.location\./g, 't.$Rhodium.location.')
    return data.toString().replace(/(,| |=|\()document.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.$Rhodium.location`); }).replace(/(,| |=|\()window.location(,| |=|\)|\.)/gi, str => { return str.replace('.location', `.$Rhodium.location`); })
    /*return `
(function(window) {
${data.replace(/(var|const|let)\s([a-z0-9A-Z]+=[a-zA-Z0-9"'`{}()\-+:,_\.=\s|/&*^%$#!<>?\]\[]+)/g,(s,p)=>`$Rhodium.setWindow(atob('${new Buffer.from(p,'utf-8').toString('base64')}'))${s.endsWith(';')?'':';'}`)}
})($Rhodium._window)
`*/
  }
}

module.exports = JSRewriter