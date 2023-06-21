var gaenabled = window.localStorage.getItem("ga");
if (gaenabled == "false") {
  script("Skipped GA injection because it is disabled by the user.");
} else {
  const gascript = document.createElement("script");
  gascript.setAttribute("async", "");
  gascript.setAttribute("src", "https://www.googletagmanager.com/gtag/js?id=G-WJMM73SFL1");
  const inlinegascript = document.createElement("script");
  inlinegascript.innerHTML = `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-WJMM73SFL1');`;
  document.head.append(gascript, inlinegascript);
}

function addCss(){
  const e = document.createElement('style');
  e.innerHTML = ` .iframeClose {
    position: fixed;
    left: 5px;
    top: 5px;
    background: url(/img/back-home.png) no-repeat 50%;
    background-size: cover;
    width: 51px;
    height: 51px;
    display: none;
    z-index: 10;
    cursor: pointer;
  }
  .iframeClose.active {
    display: block;
  }`;  
  document.getElementsByTagName('head')[0].appendChild(e);
}

function addBtnHome(){
  var e = document.createElement('div');
  e.className = 'iframeClose active';
  e.id = 'iframeClose';
  document.getElementsByTagName('body')[0].appendChild(e);
}

window.addEventListener('load', function() {
  addCss();
  addBtnHome();
  var btn = document.getElementById("iframeClose");
  btn.addEventListener("click", returnHome);    
});

function returnHome(){
  if(window.hold == true){
    return;
  }
  location.href = "https://ubg365.github.io";
}