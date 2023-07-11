var mainarea, ffd, upload, legacy, rplayer, useLegacy;
var cdn = "swf/";

// query string into object
var search = decodeURIComponent(window.location.search).substring(1).split("&");
var queries = {};
for (var i = 0; i < search.length; i++) {
    var p = search[i].split('=');
    queries[p[0]] = p[1];
}

// xhr
function grab(url, type, success, fail) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.responseType = type;
    req.onload = function() {
        if (req.status >= "400") {
            fail(req.status);
        } else {
            success(this.response);
        }
    }
    req.send();
}

// file reader
function readFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function() {
        callback(this.result);
    }
    reader.readAsArrayBuffer(file);
}

// start
function startPlayer(data) {
    console.log("Initializing with " + data.byteLength + " bytes of data");
    if (useLegacy) {
        alert('Using flash object mode. If the game does not work, turn "Use flash object" in the menu off.');

        var flashObject = document.createElement("object");
        flashObject.classList.add("gembed");
        flashObject.type = "application/x-shockwave-flash";
        flashObject.data = URL.createObjectURL(new Blob([data]));
        var flashObjectWmode = document.createElement("param");
        flashObjectWmode.name = "wmode";
        flashObjectWmode.value = "direct";
        flashObject.appendChild(flashObjectWmode);
        mainarea.appendChild(flashObject);
    } else {
        // hide the custom context menu for now, but allow it to be shown
        rplayer.contextMenuElement.style.display = "none";
        rplayer.contextMenuElement.style.zIndex = "auto";

        rplayer.load({
            data: data
        });
    }
}

function readyForLoad() {
    // ready for file upload
    upload.onchange = function() {
        ffd.style.display = "none";
        let file = this.files[0];
        readFile(file, function(data) {
            console.log('Succesfully read SWF file "' + file.name + '"');
            startPlayer(data);
        });
    }
    document.ondragenter = function(e) {
        if (e.dataTransfer.types.includes("Files")) ffd.classList.add("filehover");
    }
    ffd.ondragover = function(e) {
        e.preventDefault();
    }
    ffd.ondrop = function(e) {
        if (e.dataTransfer.types.includes("Files")) {
            e.preventDefault();
            ffd.style.display = "none";
            let file = event.dataTransfer.files[0];
            readFile(file, function(data) {
                console.log('Succesfully read SWF file "' + file.name + '"');
                startPlayer(data);
            });
        }
    }

    if (queries.swf) {
        var swfloc = (/^(http:\/\/|https:\/\/|\/\/)/i).test(queries.swf) ? queries.swf : cdn + queries.swf;
        console.log("Fetching SWF from " + swfloc + "...");
        grab(swfloc, "arraybuffer", function(data) {
            // start
            console.log("Succesfully fetched SWF from " + swfloc);
            startPlayer(data);
        }, function(error) {
            // xhr error
            alert("Could not get SWF at " + swfloc + " (Error " + error + ")");
            ffd.style.display = "block";
        });
    } else {
        // prompt user to upload a file
        ffd.style.display = "block";
    }
}

window.addEventListener("load", function() {
    mainarea = document.getElementById("mainarea");
    ffd = document.getElementById("ffd");
    upload = document.getElementById("upload");
    legacy = document.getElementById("legacy");
    useLegacy = !!localStorage.getItem("useFlashObject");

    if (useLegacy) legacy.checked = true;

    legacy.onclick = function() {
        if (this.checked) {
            localStorage.setItem("useFlashObject", "true");
        } else {
            localStorage.removeItem("useFlashObject");
        }
        if (confirm("Reloading for changes to take effect")) location.reload();
    }

    if (useLegacy) {
        console.log("skipping ruffle load, using flash object...");
        readyForLoad();
    } else {
        // make ruffle player
        console.log("loading ruffle...");
        var rScript = document.createElement("script");
        rScript.type = "text/javascript";
        rScript.src = "https://unpkg.com/@ruffle-rs/ruffle";
        rScript.onload = function() {
            window.RufflePlayer = window.RufflePlayer || {};
            window.RufflePlayer.config = window.RufflePlayer.config || {};
            window.RufflePlayer.config.letterbox = "on";
            window.RufflePlayer.config.autoplay = "auto";
            const rufflei = window.RufflePlayer.newest();
            rplayer = rufflei.createPlayer();
            rplayer.classList.add("gembed");
            rplayer.playButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="250" height="100" style="margin: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"><svg viewBox="0 0 24 24" y="7pt" width="100%" height="36pt"><path fill="rgb(203, 203, 203)" d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"></path></svg><text style="font-family: sans-serif; font-size: 10pt; letter-spacing: normal; user-select: none;" fill="rgb(100, 100, 100)" x="50%" y="56pt" dominant-baseline="middle" text-anchor="middle">Click to enable Adobe Flash Player</text></svg>';
            rplayer.contextMenuElement.style.zIndex = "-100";
            mainarea.appendChild(rplayer);
            console.log("ruffle is loaded");

            readyForLoad();
        }
        document.body.appendChild(rScript);
    }
}, false);
