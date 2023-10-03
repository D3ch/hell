//comments obvi
const subtitles = [
    "hi welcome to hell",
    "stop reading start playing",
    "shuttle.rip/xd",
    "made by dach",
    "check my git pls -> github.com/d3ch",
    "sm1 told me to go to hell",
    "stop touching me please",
    "over 260+ games and your reading a subtitle rn",
    "chinese song goes hard",
    "check my youtube -> youtube.com/dachxd",
    "i did not spend time doing this. you did",
    "enjoy ur stay thx",
    "love the site? go to github.com/d3ch/hell and star it thx",
    "someone out there cares for you. ",
    "hell (the game site) is cool",
    "play then work",
    "imagination is important smt smt - einstin",
    "chat is this real???",
    "chat this has over 260+ games",
    "this is randomized everytime you load it",
    "fffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "no im not adding roblox.",
];

function xd() {
    const subtitleElement = document.getElementById("subtitle");
    const randomIndex = Math.floor(Math.random() * subtitles.length);
    const randomSubtitle = subtitles[randomIndex];
    subtitleElement.textContent = randomSubtitle;
}

xd();
setInterval(updateSubtitle, 10);
