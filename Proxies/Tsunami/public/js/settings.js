var initTab = window.location.hash.split("#")[1] || "Tab"
    
try {
document.querySelector(".sidecard[tab='" + initTab + "']").classList.add("sidecardsel")
document.querySelector(".tabcontent[tab='" + initTab + "']").classList.add("tabcontentopen")
} catch {
initTab = "Tab"
document.querySelector(".sidecard[tab='" + initTab + "']").classList.add("sidecardsel")
document.querySelector(".tabcontent[tab='" + initTab + "']").classList.add("tabcontentopen")
}

function setTab(tab) {
document.querySelectorAll(".sidecardsel").forEach(elem => elem.classList.remove("sidecardsel"))
tab.classList.add("sidecardsel")

document.querySelectorAll(".tabcontentopen").forEach(elem => elem.classList.remove("tabcontentopen"))
document.querySelector(".tabcontent[tab='" + tab.getAttribute("tab") + "']").classList.add("tabcontentopen")
window.location.hash = "#" + tab.getAttribute("tab") 
}

var search1 = localStorage.getItem("search")
var google = document.getElementById("google")
var duckduckgo = document.getElementById("duckduckgo")
var bing = document.getElementById("bing")
var brave = document.getElementById("brave")

if (localStorage.getItem("search") !== null) {
var search2 = search1.toLowerCase()
document.getElementById(search2).classList.add("tabbuttonactive")
} else {
localStorage.setItem("search", "Google")
google.classList.add("tabbuttonactive")
}

function setsearch(engine) {
localStorage.setItem("search", engine)

if (engine == "Google") {
google.classList.add("tabbuttonactive")
duckduckgo.classList.remove("tabbuttonactive")
bing.classList.remove("tabbuttonactive")
brave.classList.remove("tabbuttonactive")
} else if (engine == "DuckDuckGo") {
google.classList.remove("tabbuttonactive")
duckduckgo.classList.add("tabbuttonactive")
bing.classList.remove("tabbuttonactive")
brave.classList.remove("tabbuttonactive")
} else if (engine == "Bing") {
google.classList.remove("tabbuttonactive")
duckduckgo.classList.remove("tabbuttonactive")
bing.classList.add("tabbuttonactive")
brave.classList.remove("tabbuttonactive")
} else if (engine == "Brave") {
google.classList.remove("tabbuttonactive")
duckduckgo.classList.remove("tabbuttonactive")
bing.classList.remove("tabbuttonactive")
brave.classList.add("tabbuttonactive")
}
}

function setcss(input) {
if (input !== "") {
localStorage.setItem("css", input)
location.reload();
} else {
localStorage.removeItem("css")
location.reload();
}
}

var css = localStorage.getItem("css")

if (css !== null) {
document.getElementById("setcssinput").value = css
}

var appearance = localStorage.getItem("appearance")

if (localStorage.getItem("appearance") !== null) {
document.getElementsByTagName("body")[0].setAttribute("appearance", appearance)
document.querySelectorAll(".tabtheme").forEach(e => e.classList.remove("tabbuttonactive"));
document.querySelector(".tabtheme[theme='" + appearance + "']").classList.add("tabbuttonactive")
} else {
localStorage.setItem("appearance", "default")
document.getElementsByTagName("body")[0].setAttribute("appearance", "default")
}

function setapp(theme) {
  localStorage.setItem("appearance", theme)
  document.querySelectorAll(".tabtheme").forEach(e =>  e.classList.remove("tabbuttonactive"));
  document.querySelector(".tabtheme[theme='" + theme + "']").classList.add("tabbuttonactive")
  document.getElementsByTagName("body")[0].setAttribute("appearance", theme)
if (!localStorage.getItem("favicon")) {
setLogo(getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", ""))
}
console.clear()
console.log("%cTsunami", "color: " + getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", "") + "; font-size: 45px")
console.log("%cBy Fog Network", "color: " + getComputedStyle(document.body).getPropertyValue('--highlight').replaceAll(" ", "") + "; font-size: 20px")
console.log("%chttps://discord.gg/yk33HZSZkU", "font-size: 15px")
console.log("%chttps://github.com/FogNetwork/Tsunami", "font-size: 15px")
}

var mode = localStorage.getItem("mode") || "default"
document.querySelector(".tabmode[mode='" + mode + "']").classList.add("tabbuttonactive")

function setmode(mode) {
document.querySelectorAll(".tabmode").forEach(e =>  e.classList.remove("tabbuttonactive"));
localStorage.setItem("mode", mode)
document.querySelector(".tabmode[mode='" + mode + "']").classList.add("tabbuttonactive")
}

var gosurf = localStorage.getItem("go") || "default"
document.querySelector(".tabgo[go='" + gosurf + "']").classList.add("tabbuttonactive")

function setgo(go) {
document.querySelectorAll(".tabgo").forEach(e =>  e.classList.remove("tabbuttonactive"));
localStorage.setItem("go", go)
document.querySelector(".tabgo[go='" + go + "']").classList.add("tabbuttonactive")
}

var background = localStorage.getItem("background") || "none"
document.querySelector(".tabbg[bg='" + background + "']").classList.add("tabbuttonactive")

function setbg(bg) {
document.querySelectorAll(".tabbg").forEach(e =>  e.classList.remove("tabbuttonactive"));
localStorage.setItem("background", bg)
document.querySelector(".tabbg[bg='" + bg + "']").classList.add("tabbuttonactive")
if (bg == "particles") {
loadParticles()
} else if (bg == "stars") {
loadStars()
} else if (bg == "none") {
destroySquares()
destroyParticles()
} else if (bg == "squares") {
loadSquares()
}
}

async function installPWA() {
installApp.prompt()
var { outcome } = await deferredPrompt.userChoice
if (outcome == "accepted") {
window.location.hash = "#Tab"
window.location.reload()
}
}