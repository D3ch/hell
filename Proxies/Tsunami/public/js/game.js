function searchgames() {
  var searchgames = document.getElementById("searchgames");
  var filter = searchgames.value.toLowerCase();
  var game = document.getElementsByClassName('game');

  for (i = 0; i < game.length; i++) {
    if (game[i].innerText.toLowerCase().includes(filter)) {
      game[i].style.display = "initial";
    } else {
      game[i].style.display = "none";
    }
  }


document.getElementById("nogame").style.display = "inherit"

for (item in game) {
if (game[item].innerText !== undefined) {
if (game[item].style.display !== "none") {
document.getElementById("nogame").style.display = "none"
}
}
}

}

function opengame(game) {
var arcade = document.getElementById("arcade");
var closearcade = document.getElementById("closearcade");
var fullarcade = document.getElementById("fullarcade");
arcade.style.display = "initial";
closearcade.style.display = "initial";
fullarcade.style.display = "initial";
arcade.setAttribute("src", game);
}
    
function closegame() {
var arcade = document.getElementById("arcade");
var closearcade = document.getElementById("closearcade");
var fullarcade = document.getElementById("fullarcade");
arcade.style.display = "none";
closearcade.style.display = "none";
fullarcade.style.display = "none";
arcade.setAttribute("src", "");
}

function fullgame() {
  var arcade = document.getElementById("arcade")
  arcade.requestFullscreen()
}

async function fetchgames() {
let response = await fetch("../games/games.json")
let json = await response.json()

for (game in json) {
var title = json[game].title
var image = json[game].image
var location = json[game].location

var gameelm = document.createElement("div")
gameelm.className = "game"
gameelm.setAttribute("onclick", 'opengame(' + '"' + location + '"' + ')')
document.getElementsByClassName("games")[0].appendChild(gameelm)

var game = document.getElementsByClassName("game")[game]

var imageelm = document.createElement("img")
imageelm.className = "gameimg"
imageelm.src = image
game.appendChild(imageelm)

var titleelm = document.createElement("div")
titleelm.innerText = title
titleelm.className = "gameinfo"
game.appendChild(titleelm)
}

}

fetchgames()