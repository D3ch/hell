function blackList(list, reason = 'Website Blocked') {
  return (ctx) => {
    try {
      if (list.indexOf(new URL(ctx.url).hostname) > -1) {
        ctx.response.end(reason)
      }
    } catch { }
  }
}

function allow(list, config) {
  return function(ctx) {
    try {
      if (list.indexOf(new URL(ctx.url).hostname) == -1) {
        if (config[0] == 'redirect') {
          ctx.response.writeHead(301, { location: ctx.prefix + 'gateway?url=' + config[1] }).end('')
        } else {
          ctx.response.end(config[1])
        }
      }
    } catch { }
  }
}

function force(ctx) {
  return ctx.url.replace(/http:\/\//g, 'https://');
}

function userAgent(ctx) {
  switch (ctx) {
    case "fx":
      ctx = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"
      break;
    case "gl":
      ctx = "Mozilla/5.0 (X11; CrOS x86_64 14150.87.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.124 Safari/537.36"
      break;
    case "sf":
      ctx = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15"
      break;
    case "ed":
      ctx = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59"
      break;
    case "mosf":
      ctx = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"
      break;
    case "mogl":
      ctx = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.124 Mobile Safari/537.36"
      break;
    case "mofx":
      ctx = "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) FxiOS/7.5b3349 Mobile/14F89 Safari/603.2.4"
      break;
    case "op":
      ctx = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36 OPR/38.0.2220.41"
      break;
    case "moop":
      ctx = "Mozilla/5.0 (Linux; Android 7.0; SM-A310F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36 OPR/42.7.2246.114996"
      break;
    default:
      break;
  }
  return ctx
}

module.exports.blackList = blackList;
module.exports.force = force;
module.exports.allow = allow;
module.exports.userAgent = userAgent;