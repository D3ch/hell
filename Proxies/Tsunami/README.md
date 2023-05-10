# Update
Tsunami is no longer being worked on.

Like Tsunami and want to check out my latest proxy? Use [Metallic](https://github.com/Metallic-Web/Metallic)!

<div align="center">

<kbd>
<img style="border-radius:50%" height="150px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/public/img/logo.svg">
</kbd>

<h1>Tsunami</h1>

<h3>An official Fog Network proxy site, made to access the blocked web</h3>

<p>Surf without web filters or restrictions. Made with style, Tsunami is a rather fancy service dedicated to protecting your freedom from censorship.
Read the documentation below to find out more</p>

<p>Want to improve Tsunami? <a href="https://github.com/FogNetwork/Tsunami/compare">Create a pull request</a></p>
</div>

<p align="center">
<a href="https://heroku.com/deploy?template=https://github.com/FogNetwork/Tsunami"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/heroku2.svg"><img></a>
<a href="https://repl.it/github/FogNetwork/Tsunami"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/replit2.svg"><img></a>
<a href="https://glitch.com/edit/#!/import/github/FogNetwork/Tsunami"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/glitch2.svg"><img></a>
<a href="https://railway.app/new/template?template=https://github.com/FogNetwork/Tsunami"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/railway2.svg"><img></a>
<a href="https://app.koyeb.com/deploy?type=git&repository=github.com/FogNetwork/Tsunami&branch=main&name=Tsunami"><img height="30px" src="https://raw.githubusercontent.com/FogNetwork/Tsunami/main/deploy/koyeb2.svg"><img></a>
</p>

## Documentation

- [Overview](#overview)
  - [Supported Sites](#supported-sites)
  - [Features](#features)
  - [Pages](#pages)
- [Setup](#setup)
  - [Locally](#locally)
  - [Deploy](#deploy)
  - [Proxies](#proxies)
  - [Configuration](#configuration)
- [Support](#support)
  - [FAQ](#faq)
  - [Contact](#contact)
- [More](#more)
  - [Proxy Sources](#proxy-sources)
  - [Credits](#credits)
  - [Contributing](#contributing)

## Overview

### Supported Sites

- google.com
- discord.com
- youtube.com
- invidio.us
- reddit.com
- wolframalpha.com
- 1v1.lol

### Features

- All the best proxies
- Nice games library
- Tab cloaking and lots of themes/settings
- Basic auth
- Customizable CSS
- Installable PWA
- More games

## Pages

- `/` Homepage
- `/1` Apps
- `/2` Arcade
- `/3` Settings
- `/4` Terms
- `/5` Privacy
- `/6` Credits
- `/7` Support and Contact
- `/404` 404

## Changelog/Roadmap
### Version 1.0
- [x] Initial files

### Version 2.0
- [x] New proxies
- [x] Update css style (user-select:none and drop shadow)
- [x] Chromebook only mode
- [x] Changelog/roadmap
- [x] Faster js loading/themes loading
- [x] New themes
- [x] Update readme
- [x] Fix lightmode css
- [x] Css vars
- [x] PWA install button
- [x] Better tab cloak (enter website url, advanced, proxy favicon)
- [x] Better Go Page
- [x] Remove mist and docs
- [x] Background settings

### Release v2.25
- [ ] Remove keywords
- [ ] Apps page (Replace Chatbox)
- [ ] Inspect button (Avo)
- [ ] Inspect button (Avo)

### Version 2.5
- [ ] Lite mode (just sw proxies no backend)

### Version 3.0
- [ ] Mobile support (finish)
- [ ] Games

### Version 4.0
- [ ] Rewrite Code

## Setup

### Locally

```sh
git clone https://github.com/FogNetwork/Tsunami

cd Tsunami

npm install

npm start
```

### Deploy

Click one of the buttons above and follow the steps

### Proxies

All proxies hosted locally, so you don't need any subdomains

[Ultraviolet (/ultraviolet/)](https://github.com/titaniumnetwork-dev/Ultraviolet)

[Stomp (/stomp/)](https://github.com/sysce/stomp)

[Corrosion (/corrosion/)](https://github.com/titaniumnetwork-dev/Corrosion)

[Rhodium (/rhodium/)](https://github.com/LudicrousDevelopment/Rhodium)

### Configuration

**config.json**

```json
{
    "port": "8080",
    "auth": "false",
    "username": "user",
    "password": "secret",
    "chromebook": "false"
}
```

`"port": "8080"` Changes the port 

`"auth": "false"` Basic authentication, set to true or false

`"username"` Username for authentication

`"password"` Password for authentication

`"chromebook"` Chromebook only mode, set to true or false

## Support

### FAQ

**How can I get new domains?**

Join our [discord](https://discord.gg/yk33HZSZkU) for more Tsunami links

**Captcha not working/issues**

Captcha is only supported on Ultraviolet

**Why is Discord not working properly?**

Try using the QR code. Refreshing the page might help

### Contact

Nebelung - [Nebelung#1335](https://discord.com/users/887118260963782686)

## More

### Proxy Sources

[Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet)

[Stomp](https://github.com/sysce/stomp)

[Corrosion](https://github.com/titaniumnetwork-dev/Corrosion)

[Modified Corrosion](https://github.com/BinBashBanana/Corrosion-Heroku)

[Rhodium](https://github.com/LudicrousDevelopment/Rhodium)

[Palladium](https://github.com/FogNetwork/Palladium) (Not Used)

[Womginx](https://github.com/binary-person/womginx) (Not Used)

[PyDodge](https://github.com/BinBashBanana/PyDodge) (Not Used)

[Alloy](https://github.com/titaniumnetwork-dev/alloy) (Not Used)

[SystemYA](https://github.com/sysce/proxy) (Not Used)

[Via](https://github.com/hypothesis/via) (Not Used)

[Node Unblocker](https://github.com/nfriedly/node-unblocker) (Not Used)

[Powermouse](https://github.com/titaniumnetwork-dev/powermouse) (Not Used)

### Credits

[Nebelung](https://github.com/Nebelung-Dev) - Owner and Main Developer

[EnderKingJ](https://github.com/EnderKingJ) - Helper/Proxy Developer/Squares Background

[Caracal.js](https://github.com/caracal-js) - Inspiration/Proxy Developer

[Quite A Fancy Emerald](https://github.com/QuiteAFancyEmerald) - Inspiration/Holy Unblocker

[LQ16](https://github.com/https://github.com/Null-n-V0id) - TN Founder

[MikeLime](https://github.com/MikeLime-dev) - Developer

[BinBashBanana](https://github.com/BinBashBanana) - Games Library and PyDodge 

[Binary Person](https://github.com/binary-person) - Creator of Womginx and Rammerhead

[Divide](https://github.com/vibedivide) - TOMP and Stomp

[Shirt](https://github.com/shirt-dev) - Proxy Developer

### Contributing

See [CONTRIBUTING.md](https://github.com/FogNetwork/Tsunami/blob/main/CONTRIBUTING.md)
