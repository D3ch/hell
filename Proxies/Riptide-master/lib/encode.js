module.exports = (ctx) => {
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
            //console.log(e)
            return e
          }).join('')+(Slash?'/':'')
        }
      }
      break;
    case "b64":
      return {
        encode(str) {
          return new Buffer.from(str, 'utf-8').toString('base64')
        },
        decode(str) {
          return new Buffer.from(str, 'base64').toString('utf-8')
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

function xor() {
  return {
    encode(str) {
      if (str.startsWith('http')) return encodeURIComponent(str.toString().split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join(''));
    },
    decode(str) {
      if (!str.startsWith('http')) return decodeURIComponent(str).split('').map((char, ind) => ind % 2 ? String.fromCharCode(char.charCodeAt() ^ 2) : char).join('');
    }
  }
}