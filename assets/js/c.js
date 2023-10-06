//comments obvi
const subtitles = [
    "welcome to hell",
    "stop reading start playing",
    "shuttle.rip/xd",
    "made by dach",
    "github.com/d3ch",
    "thx for visiting!",
    "stop touching me please",
    "over 260+ games and your reading a subtitle rn",
    "chinese song goes hard",
    "youtube.com/dachxd",
    "i did not spend time doing this. you did",
    "enjoy ur stay thx",
    "github.com/d3ch/hell star it pls tysm",
    "someone out there cares for you. ",
    "hell (the game site) is cool",
    "play then work",
    "imagination is important smt smt - einstin",
    "chat is this real???",
    "over 260+ games.",
    "this is randomized",
    "this hits dif",
    "no im not adding roblox.",
    "did you pray today?",
];

function xd() {
    const subtitleElement = document.getElementById("subtitle");
    const randomIndex = Math.floor(Math.random() * subtitles.length);
    const randomSubtitle = subtitles[randomIndex];
    subtitleElement.textContent = randomSubtitle;
}

xd();
setInterval(updateSubtitle, 10);
