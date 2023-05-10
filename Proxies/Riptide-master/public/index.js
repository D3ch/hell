function updateweb() {
var search  = document.getElementById("search")
var web = document.getElementById("web")

if (web.contentWindow.location == window.location.protocol + "//" + window.location.hostname + "/pages/home/") {
search.value = ""
seturl("/pages/home")
} else if (web.contentWindow.location == window.location.protocol + "//" + window.location.hostname + "/pages/about/") {
search.value = "riptide://about"
seturl("/pages/home")
} else {
var fullurl = web.contentWindow.location.href
search.value = fullurl.split('/service/')[1]
seturl(fullurl.split('/service/')[1])
}

if (web.contentWindow.document.title !== "") {
settitle(web.contentWindow.document.title)
} else {
var fullurl = web.contentWindow.location.href
settitle(fullurl.split('/service/')[1])
}
}

function forward() {
var web = document.getElementById("web")
web.contentWindow.history.forward();
}

function back() {
var web = document.getElementById("web")
web.contentWindow.history.back();
}

function reload() {
var web = document.getElementById("web")
web.contentWindow.location.reload()
//web.src += ""
}

function home() {
var web = document.getElementById("web")
web.src = "/pages/home"
}

function setweb(url) {
var web = document.getElementById("web")
var search = url
if (!url) search = document.getElementById("search").value
if (search == "/pages/home" || search == "/pages/about") {
web.src = search
} else {
web.src = "/service/" + search
}
}

window.onload = function() {
var search  = document.getElementById("search")
search.onkeypress=function(e){
    if(e.keyCode==13){
        if (search.value !== "") {
             setweb()
        }
    }
}
}

function inspect() {
var inspect = document.getElementById("web").contentWindow.document.createElement("script");
inspect.src = "https://cdn.jsdelivr.net/gh/FogNetwork/Avo/avo.min.js";
document.getElementById("web").contentWindow.document.body.appendChild(inspect)

var more = document.getElementById("more")
var morebtn = document.getElementById("morebtn")
if (more.style.display == "initial") {
    more.style.display = "none"
    morebtn.classList.remove("morebtnactive")
}
}

function more() {
var more = document.getElementById("more")
var morebtn = document.getElementById("morebtn")
  if (more.style.display == "none") {
    more.style.display = "initial"
    morebtn.classList.add("morebtnactive")
  } else {
    more.style.display = "none"
    morebtn.classList.remove("morebtnactive")
  }
}

function fullscreen() {
  var web = document.getElementById("web")
  web.requestFullscreen()
}

function fullscreenwindow() {
  var html = document.getElementsByTagName("html")[0]
  html.requestFullscreen()
}

//tabs

$("#tabs").sortable({
items: ".tab",
cancel: ".tab:last-child",
axis: "x",
handle: ".tabtext",
containment: "body",
scroll: false,
start: function(event, ui) {
//Old fix
//ui.item[0].style.top = "8px"
}
})

function newtab() {
var tabs = document.getElementById("tabs")
var ntabs = document.querySelectorAll("div[class='tab']").length

if (ntabs < 17) {

var tab = document.createElement("div")
tab.className = "tab"
tab.setAttribute("url", "/pages/home")

var tabtext = document.createElement("div")
tabtext.innerText = "New Tab"
tabtext.className = "tabtext"
tabtext.setAttribute("onmousedown", "tabclicked(this)")
tab.appendChild(tabtext)

var closetab = document.createElement("div")
closetab.className = "closetab"
closetab.innerHTML = '<i class="fa-solid fa-xmark"></i>'
closetab.setAttribute("onclick", "removetab(this.parentElement)")

tab.appendChild(closetab)

tabs.insertBefore(tab, tabs.childNodes[tabs.childNodes.length - 2])

activetab(tab.childNodes[0])
var search = document.getElementById("search")
search.value = ""

var web = document.getElementById("web")
web.src = "/pages/home"
}
}

function removetab(element) {
var tabs = document.getElementById("tabs")
if (element.className == "tab activetab") {
if (tabs.children[Array.prototype.indexOf.call(element.parentNode.children, element) + 1].className !== "newtab") {
activetab(tabs.children[Array.prototype.indexOf.call(element.parentNode.children, element) + 1].firstChild)
} else if (tabs.childNodes.length !== 5) {
activetab(tabs.children[Array.prototype.indexOf.call(element.parentNode.children, element) - 1].firstChild)
}
}
element.remove()
if (tabs.childNodes.length == 4) return window.close()
}

function activetab(element) {
var activetabs = document.querySelectorAll("div[class = 'tab activetab']")
var activetabs2 = document.querySelectorAll("div[class = 'closetab activetab']")

for (elem in activetabs) {
activetabs[elem].className = "tab"
}

for (elem in activetabs2) {
activetabs2[elem].className = "closetab"
}

element.parentElement.className = "tab activetab"
element.parentElement.childNodes[1].className = "closetab activetab"
}

function currenttab() {
return document.querySelectorAll("div[class='tab activetab']")[0];
}

function settitle(text) {
currenttab().firstChild.innerText = text
}

function seturl(url) {
currenttab().setAttribute("url", url)
}

function geturl() {
return currenttab().getAttribute("url")
}

document.addEventListener('keydown', function(e){
//Ctrl + Y: New Tab
if (e.ctrlKey && e.keyCode == 89) {
newtab()
//Ctrl + Q: Close Tab
} else if (e.ctrlKey && e.keyCode == 81) {
removetab(currenttab())
}
});

//Ctrl + P: Print
jQuery(document).bind("keyup keydown", function(e){
if(e.ctrlKey && e.keyCode == 80){
var web = document.getElementById("web")
web.contentWindow.focus()
web.contentWindow.print()
return false;
}
});

//Ctrl + R: Reload
jQuery(document).bind("keyup keydown", function(e){
if(e.ctrlKey && e.keyCode == 82){
var web = document.getElementById("web")
web.contentWindow.location.reload()
return false;
}
});

function tabclicked(element) {
if (element.parentElement.className !== "tab activetab") {
setweb(element.parentElement.getAttribute("url"))
}
activetab(element)
}

function riptideclick() {
var more = document.getElementById("more")
var morebtn = document.getElementById("morebtn")
if (window.event.srcElement.id !== "more" && window.event.srcElement.id !== "morebtn") {
if (more.style.display == "initial")
more.style.display = "none"
morebtn.classList.remove("morebtnactive")
}
}

document.onclick = riptideclick

window.addEventListener("load", function () {
var web = document.getElementById("web")
web.contentWindow.addEventListener("mousedown", function () {
window.parent.riptideclick()
})
})

function printweb() {
var web = document.getElementById("web")
web.contentWindow.focus()
web.contentWindow.print()
}