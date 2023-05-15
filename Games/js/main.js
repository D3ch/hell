// Hello there!
//
// If you want to add my games to your site, please reach out at my email: echo-the-coder@tuta.io, or discord: 3kh0_#6969

console.warn(
  "%cNote!",
  "color: purple; font-weight: 600; background: yellow; padding: 0 5px; border-radius: 5px",
  "If you want to add my games to your site, please reach out at my email: echo-the-coder@tuta.io\nPlease do not just add them without asking me first! Thank you!"
);

function script(text) {
  console.log("%cScript Injection", "color: cyan; font-weight: 600; background: black; padding: 0 5px; border-radius: 5px", text);
}

// ====================================
// SCRIPT INJECTION
// ====================================
const gascript = document.createElement("script");
gascript.setAttribute("async", "");
gascript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-98DP5VKS42");
const inlinegascript = document.createElement("script");
inlinegascript.innerHTML = `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-98DP5VKS42');`;
document.head.append(gascript, inlinegascript);
script("Injected script 1/4 (Google Tag Manager)");

const arc = document.createElement("script");
arc.setAttribute("async", "");
arc.setAttribute("src", "https://arc.io/widget.min.js#eRPHFgiC");
document.head.append(arc);
script("Injected script 2/4 (Widget stuff)");

const adblock = document.createElement("script");
adblock.setAttribute("src", "https://fundingchoicesmessages.google.com/i/pub-5756835229788588?ers=1");
adblock.setAttribute("nonce", "yibq-w_TR5NOCRWsU-VL0Q");
adblock.setAttribute("async", "");
document.head.append(adblock);
script("Injected script 3/4 (Ad stuff)");

const ad = document.createElement("script");
ad.setAttribute("async", "");
ad.setAttribute("src", "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5756835229788588");
ad.setAttribute("crossorigin", "anonymous");
document.head.append(ad);
script("Injected script 4/4 (Ad stuff)");