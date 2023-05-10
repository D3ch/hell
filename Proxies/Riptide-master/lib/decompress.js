const zlib = require('zlib')


function Decompress(ctx) {
  return function(res, data) {
    var sendData = ''
    switch(res.headers['content-encoding']) {
        case 'gzip':
            sendData = zlib.gunzipSync(Buffer.concat(data));
        break;
        case 'deflate':
            sendData = zlib.inflateSync(Buffer.concat(data));
        break;
        case 'br':
            sendData = zlib.brotliDecompressSync(Buffer.concat(data));
        break;
        default: sendData = Buffer.concat(data); break;
    };
    return sendData
  }
}

module.exports = Decompress