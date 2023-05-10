//  _____             _   _      _                      _    
// |  ___|__   __ _  | \ | | ___| |___      _____  _ __| | __
// | |_ / _ \ / _` | |  \| |/ _ \ __\ \ /\ / / _ \| '__| |/ /
// |  _| (_) | (_| | | |\  |  __/ |_ \ V  V / (_) | |  |   < 
// |_|  \___/ \__, | |_| \_|\___|\__| \_/\_/ \___/|_|  |_|\_\
//            |___/                                          

var appearance = localStorage.getItem("appearance")

if (localStorage.hasOwnProperty("appearance")) {
    document.getElementsByTagName("body")[0].setAttribute("appearance", appearance)
  setLogo(getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", ""))
} else {
    localStorage.setItem("appearance", "default")
    document.getElementsByTagName("body")[0].setAttribute("appearance", "default")
}

console.log("%cTsunami", "color: " + getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", "") + "; font-size: 45px")
console.log("%cBy Fog Network", "color: " + getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", "") + "; font-size: 20px")
console.log("%chttps://discord.gg/yk33HZSZkU", "font-size: 15px")
console.log("%chttps://github.com/FogNetwork/Tsunami", "font-size: 15px")

var title = localStorage.getItem("title")
var favicon = localStorage.getItem("favicon")

if (localStorage.hasOwnProperty("title")) {
    document.title = title
}

if (localStorage.hasOwnProperty("favicon")) {
  document.querySelector("link[rel='shortcut icon']").href = favicon;
}

function settitle(title) {
  if (title !== "") {
  localStorage.setItem("title", title)
  document.title = title
  } else {
  localStorage.removeItem("title")
  document.title = "Settings"
  }
}

function setfavicon(icon, noproxy) {
  if (icon !== "") {
  if (!noproxy) {
  icon = "/corrosion/gateway?url=" + icon
  }
  localStorage.setItem("favicon", icon)
  document.querySelector("link[rel='shortcut icon']").href = icon;
  } else {
  localStorage.removeItem("favicon")
  setLogo(getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", ""))
  }
}

function setgoogle() {
  settitle("Google")
  setfavicon("https://www.google.com/favicon.ico")
}

function setgoogled() {
  settitle("Google Drive")
  setfavicon("https://www.drive.google.com/favicon.ico")
}

function setedpuzzle() {
  settitle("Edpuzzle")
  setfavicon("https://edpuzzle.imgix.net/favicons/favicon-32.png")
}

function setzoom() {
  settitle("Zoom")
  setfavicon("https://st1.zoom.us/zoom.ico")
}

function setreset() {
  localStorage.removeItem("title")
  localStorage.removeItem("favicon")
  document.title = "Settings"
  setLogo(getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", ""))
  document.getElementById("cloaktitletitle").value = ""
  document.getElementById("cloaktitleicon").value = ""
  document.getElementById("cloaktitleurl").value = ""
}

async function setTabByURL(url) {
if (url == null || url == "") {
return setreset();
}
var title = url;
var favicon = "data:,"
var site = await fetch("/rhodium/gateway?url=" + url)
var code = await site.text()
var parser = new DOMParser();
var doc = parser.parseFromString(code, "text/html");
if (doc.getElementsByTagName("title")[0]) {
title = doc.getElementsByTagName("title")[0].innerText
}
if (doc.querySelector("link[rel='shortcut icon']")) {
favicon = doc.querySelector("link[rel='shortcut icon']").href
}
if (doc.querySelector("link[rel='icon']")) {
favicon = doc.querySelector("link[rel='icon']").href
}
settitle(title)
setfavicon(favicon, true)
}

var info = document.getElementById("info")
var isinfo = "no"

function goinfo() {
  if (isinfo == "no") {
    document.getElementById("info").style.display = "flex"
    isinfo = "yes"
  } else {
    document.getElementById("info").style.display = "none"
    isinfo = "no"
  }
}

if (localStorage.getItem("search") == null) {
localStorage.setItem("search", "Google")
}

var css = localStorage.getItem("css")

if (css !== null) {
  var csselm = document.createElement("style")
  csselm.innerText = css
  document.body.appendChild(csselm)
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(window.location.origin + "/sw.js");
}

function getLogo(highlight = "#2493ff") {
var logoCode = `<svg version="1.1" viewBox="0.0 0.0 500.0 500.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l500.0 0l0 500.0l-500.0 0l0 -500.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l500.0 0l0 500.0l-500.0 0z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m31.11811 250.0l0 0c0 -120.88513 97.99676 -218.8819 218.8819 -218.8819l0 0c58.051086 0 113.72455 23.060703 154.77286 64.109024c41.04834 41.048317 64.10904 96.72178 64.10904 154.77286l0 0c0 120.88513 -97.996765 218.8819 -218.8819 218.8819l0 0c-120.88513 0 -218.8819 -97.996765 -218.8819 -218.8819z" fill-rule="evenodd"/><path stroke="%HIGHLIGHT%" stroke-width="24.0" stroke-linejoin="round" stroke-linecap="butt" d="m31.11811 250.0l0 0c0 -120.88513 97.99676 -218.8819 218.8819 -218.8819l0 0c58.051086 0 113.72455 23.060703 154.77286 64.109024c41.04834 41.048317 64.10904 96.72178 64.10904 154.77286l0 0c0 120.88513 -97.996765 218.8819 -218.8819 218.8819l0 0c-120.88513 0 -218.8819 -97.996765 -218.8819 -218.8819z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m50.7455 250.00534l0 0c0 -110.04817 89.21167 -199.25984 199.25984 -199.25984l0 0c52.846985 0 103.52951 20.993385 140.89798 58.361855c37.36847 37.368477 58.361877 88.05099 58.361877 140.89798l0 0c0 110.04819 -89.21167 199.25986 -199.25986 199.25986l0 0c-110.04817 0 -199.25984 -89.21167 -199.25984 -199.25986z" fill-rule="evenodd"/><path stroke="%HIGHLIGHT%" stroke-width="24.0" stroke-linejoin="round" stroke-linecap="butt" d="m50.7455 250.00534l0 0c0 -110.04817 89.21167 -199.25984 199.25984 -199.25984l0 0c52.846985 0 103.52951 20.993385 140.89798 58.361855c37.36847 37.368477 58.361877 88.05099 58.361877 140.89798l0 0c0 110.04819 -89.21167 199.25986 -199.25986 199.25986l0 0c-110.04817 0 -199.25984 -89.21167 -199.25984 -199.25986z" fill-rule="evenodd"/><path fill="%HIGHLIGHT%" d="m282.27924 123.177414c-2.1687012 -2.4584656 -5.3442993 -1.2292328 -9.75946 2.7657776c-4.4151917 3.9950104 -9.450439 8.989075 -16.731552 21.2043c-7.2811127 12.215225 -19.674255 40.793945 -26.955185 52.08705c-7.2809143 11.293106 -6.583267 13.904633 -16.730347 15.67157c-10.147064 1.766922 -29.125076 -2.2275085 -44.15207 -5.0700073c-15.027008 -2.842514 -36.172928 -10.294846 -46.009956 -11.985031c-9.8370285 -1.6902008 -11.230736 -0.614624 -13.01223 1.8438416c-1.7815018 2.4584656 -1.0848465 7.990219 2.323227 12.906967c3.408081 4.916748 7.7458878 9.756165 18.125244 16.59349c10.379349 6.837326 34.546143 18.20755 44.150894 24.43045c9.604736 6.2229004 11.153763 8.066956 13.477585 12.906952c2.323822 4.840027 3.641159 8.758118 0.46536255 16.133118c-3.1757965 7.3750305 -14.79512 21.43332 -19.520126 28.116974c-4.7250214 6.6836853 -6.196472 7.5290833 -8.829941 11.985046c-2.633484 4.4559937 -5.189392 9.373108 -6.970886 14.750824c-1.7814941 5.3776855 -3.7181244 11.753662 -3.7181244 17.515411c0 5.7617493 1.3945007 14.519836 3.7181244 17.055054c2.3236237 2.5351868 3.6397705 4.071533 10.223648 -1.8438721c6.5838623 -5.9153748 20.681732 -24.967346 29.279587 -33.64853c8.597855 -8.681183 15.026413 -14.289856 22.30754 -18.438507c7.2811127 -4.1486816 14.330353 -7.1450195 21.37918 -6.453491c7.0488434 0.69155884 12.393539 2.9971313 20.913818 10.602753c8.520294 7.605591 21.997498 26.58023 30.207947 35.030823c8.210449 8.450592 13.322876 12.215607 19.05478 15.6727295c5.731903 3.4571228 11.851013 5.2236633 15.336639 5.0700073c3.4856567 -0.153656 5.034851 -1.9203796 5.577179 -5.991913c0.5423279 -4.0715637 -0.8515625 -12.521942 -2.3232117 -18.437347c-1.4716797 -5.9154053 -2.013977 -5.9154053 -6.506714 -17.055054c-4.492737 -11.139648 -16.809113 -39.48819 -20.449677 -49.782806c-3.6405334 -10.294647 -3.4076538 -8.374268 -1.3936768 -11.985046c2.013977 -3.6107788 0.38720703 -5.3007812 13.47757 -9.679626c13.090393 -4.3788757 51.509583 -12.675415 65.06473 -16.593506c13.555145 -3.9180908 13.787445 -4.533493 16.266174 -6.915039c2.4787598 -2.3815308 1.6271667 -4.83902 -1.3937073 -7.374222c-3.020874 -2.535202 -7.35907 -6.2234955 -16.731537 -7.83696c-9.372437 -1.6134644 -28.426819 -1.8438568 -39.503235 -1.8438568c-11.0763855 0 -19.364197 1.920578 -26.95517 1.8438568c-7.590973 -0.07673645 -13.788239 -0.8446045 -18.590607 -2.3042297c-4.802368 -1.45961 -8.054932 -2.765976 -10.223633 -6.453476c-2.1687012 -3.6875153 -4.182678 -2.841919 -2.7886047 -15.67157c1.394104 -12.829651 9.836456 -48.16916 11.153168 -61.306305c1.316742 -13.137154 -1.0840454 -15.058128 -3.2527466 -17.516602z" fill-rule="evenodd"/><path stroke="%HIGHLIGHT%" stroke-width="24.0" stroke-linejoin="round" stroke-linecap="butt" d="m282.27924 123.177414c-2.1687012 -2.4584656 -5.3442993 -1.2292328 -9.75946 2.7657776c-4.4151917 3.9950104 -9.450439 8.989075 -16.731552 21.2043c-7.2811127 12.215225 -19.674255 40.793945 -26.955185 52.08705c-7.2809143 11.293106 -6.583267 13.904633 -16.730347 15.67157c-10.147064 1.766922 -29.125076 -2.2275085 -44.15207 -5.0700073c-15.027008 -2.842514 -36.172928 -10.294846 -46.009956 -11.985031c-9.8370285 -1.6902008 -11.230736 -0.614624 -13.01223 1.8438416c-1.7815018 2.4584656 -1.0848465 7.990219 2.323227 12.906967c3.408081 4.916748 7.7458878 9.756165 18.125244 16.59349c10.379349 6.837326 34.546143 18.20755 44.150894 24.43045c9.604736 6.2229004 11.153763 8.066956 13.477585 12.906952c2.323822 4.840027 3.641159 8.758118 0.46536255 16.133118c-3.1757965 7.3750305 -14.79512 21.43332 -19.520126 28.116974c-4.7250214 6.6836853 -6.196472 7.5290833 -8.829941 11.985046c-2.633484 4.4559937 -5.189392 9.373108 -6.970886 14.750824c-1.7814941 5.3776855 -3.7181244 11.753662 -3.7181244 17.515411c0 5.7617493 1.3945007 14.519836 3.7181244 17.055054c2.3236237 2.5351868 3.6397705 4.071533 10.223648 -1.8438721c6.5838623 -5.9153748 20.681732 -24.967346 29.279587 -33.64853c8.597855 -8.681183 15.026413 -14.289856 22.30754 -18.438507c7.2811127 -4.1486816 14.330353 -7.1450195 21.37918 -6.453491c7.0488434 0.69155884 12.393539 2.9971313 20.913818 10.602753c8.520294 7.605591 21.997498 26.58023 30.207947 35.030823c8.210449 8.450592 13.322876 12.215607 19.05478 15.6727295c5.731903 3.4571228 11.851013 5.2236633 15.336639 5.0700073c3.4856567 -0.153656 5.034851 -1.9203796 5.577179 -5.991913c0.5423279 -4.0715637 -0.8515625 -12.521942 -2.3232117 -18.437347c-1.4716797 -5.9154053 -2.013977 -5.9154053 -6.506714 -17.055054c-4.492737 -11.139648 -16.809113 -39.48819 -20.449677 -49.782806c-3.6405334 -10.294647 -3.4076538 -8.374268 -1.3936768 -11.985046c2.013977 -3.6107788 0.38720703 -5.3007812 13.47757 -9.679626c13.090393 -4.3788757 51.509583 -12.675415 65.06473 -16.593506c13.555145 -3.9180908 13.787445 -4.533493 16.266174 -6.915039c2.4787598 -2.3815308 1.6271667 -4.83902 -1.3937073 -7.374222c-3.020874 -2.535202 -7.35907 -6.2234955 -16.731537 -7.83696c-9.372437 -1.6134644 -28.426819 -1.8438568 -39.503235 -1.8438568c-11.0763855 0 -19.364197 1.920578 -26.95517 1.8438568c-7.590973 -0.07673645 -13.788239 -0.8446045 -18.590607 -2.3042297c-4.802368 -1.45961 -8.054932 -2.765976 -10.223633 -6.453476c-2.1687012 -3.6875153 -4.182678 -2.841919 -2.7886047 -15.67157c1.394104 -12.829651 9.836456 -48.16916 11.153168 -61.306305c1.316742 -13.137154 -1.0840454 -15.058128 -3.2527466 -17.516602z" fill-rule="evenodd"/></g></svg>`
logoCode = logoCode.replaceAll("%HIGHLIGHT%", highlight)
logoCode = "data:image/svg+xml;base64," + window.btoa(logoCode)
return logoCode;
}

function setLogo(highlight) {
document.querySelector("link[rel='shortcut icon']").href = getLogo(highlight)
}

var installApp

window.addEventListener('beforeinstallprompt', function (e) {
e.preventDefault();
installApp = e;
});

function createBox() {
let span = document.createElement('span');
span.classList.add('animated-box');
let size = Math.random() * 80;
span.style.height = 40 + size + 'px';
span.style.width = 40 + size + 'px';
span.style.top = ((1.3 * Math.random()) * innerHeight) + 'px';
span.style.left = ((Math.random()) * (innerWidth)) + 'px';

document.querySelector('#squares').appendChild(span);

setTimeout(() => {
span.remove();
}, 6000)
}

function loadSquares() {
if (window.squareInt) return;
if (window.pJSDom[0]) {
window.pJSDom[0].pJS.fn.vendors.destroypJS();
window["pJSDom"] = [];
}
window.squareInt = setInterval(createBox, 300);
}

function destroySquares() {
clearInterval(window.squareInt);
window.squareInt = null;
document.querySelector('#squares').innerHTML = ""
}

function destroyParticles() {
if (!window.pJSDom[0]) return;
window.pJSDom[0].pJS.fn.vendors.destroypJS();
window["pJSDom"] = [];
}

function loadParticles() {
destroySquares()
destroyParticles()
particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "bubble"
        },
        "onclick": {
          "enable": false,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

function loadStars() {
destroySquares()
destroyParticles()
particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 160,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 4,
          "size_min": 0.3,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 1,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 600
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "bubble"
        },
        "onclick": {
          "enable": false,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 250,
          "size": 0,
          "duration": 2,
          "opacity": 0,
          "speed": 3
        },
        "repulse": {
          "distance": 400,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

var background = localStorage.getItem("background") || ""
if (background == "particles") {
loadParticles()
} else if (background == "stars") {
loadStars()
} else if (background == "squares") {
loadSquares()
}