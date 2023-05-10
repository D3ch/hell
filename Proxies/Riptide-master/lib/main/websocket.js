const http = require('http');
const https = require('https');
const WebSocketServer = require('ws').Server

function WebSocket(ctx) {
  const wss = new WebSocketServer({server: ctx.server})
  wss.on('connection', (socket, req) => {
    try {
      var url = ctx.encoding.decode(req.url.replace(ctx.prefix, '').split('?ws=')[1]).split('origin=')[0].replace(/(\?|&)$/g, '')
      console.log(url)
      var origin = ctx.encoding.decode(req.url.replace(ctx.prefix, '').split('?ws=')[1]).split('origin=')[1]
      console.log(url)
      const websocket = new (require('ws'))(url, {
        origin: origin
      })
      websocket.on('error', () => socket.terminate())
      socket.on('error', () => websocket.terminate())
      websocket.on('close', () => socket.close())
      socket.on('close', () => websocket.close())
      websocket.on('open', () => {
        socket.on('message', message => {
          websocket.send(message.toString())
        })
        websocket.on('message', message => {
          message = message.toString().includes('�') ? message : message.toString()
          socket.send(message)
        })
      })
    } catch(e) {
      socket.close()
    }
  })
    /*
    const options = {
      host: url.hostname,
      port: url.port,
      path: url.pathname,
      method: clientRequest.method,
      headers: clientRequest.headers,
      origin: ctx.encoding.decode(clientRequest.url.replace(ctx.prefix, '')).split('?ws=')[1].split('?origin=')[1],
    };
    var request = https.request(options);
    request.on("upgrade", function(remoteResponse, remoteSocket, remoteHead) {

      let key = true;
      let headers = "HTTP/1.1 101 Web Socket Protocol Handshake\r\n";
      remoteResponse.rawHeaders.forEach(function (val) {
        headers += val + (key ? ": " : "\r\n");
        key = !key;
      });
      headers += "\r\n";

      clientSocket.write(headers);

      if (remoteHead && remoteHead.length) {
        clientSocket.write(remoteHead);
      }
      clientSocket.pipe(remoteSocket);
      remoteSocket.pipe(clientSocket);

      clientSocket.on("error", function (err) {
        remoteSocket.end();
        clientSocket.end();
      });

      remoteSocket.on("error", function (err) {
        clientSocket.end();
        remoteSocket.end();
      });
    })
    request.end();*/
}

module.exports = WebSocket