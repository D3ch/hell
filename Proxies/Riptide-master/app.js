const port = 8080
const express = require('express');
const app = express();
const Rhodium = require("./lib/main/bundle")

var proxy = new Rhodium({
  prefix: "/service/",
  encode: "plain",
  server: app,
  title: "Ripiide",
  favicon: "https://discord.com",
  wss: true,
  corrosion: [false, {}],
  userAgent: undefined
});

proxy.init();

app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: './public'})
});

app.use(function (req, res) {
  if (req.url.startsWith(proxy.prefix)) {
  proxy.request(req,res);
} else {
  res.status(404).send("404 Error")
}
})

app.listen(process.env.PORT || port, () => {
  console.log(`Riptide is running at localhost:${port}`)
});