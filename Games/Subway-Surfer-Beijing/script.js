var more = document.getElementById("more_g");
var isFramed = false;
try {
    isFramed = window != window.top || document != top.document || self.location != top.location;
} catch (e) {
    isFramed = true;
}
if (isFramed) {
    var url = window.location !== window.parent.location ? (null != location.ancestorOrigins ? location.ancestorOrigins[0] : document.referrer) : document.location.href;
    var ref = url.match(/\/\/([^\/]+)/);
    if (ref != null) {
        if (ref[1] == "igroutka.ru") {
            more.style.display = "none";
        } else {
            if (ref[1].includes("igroutka.site")) {
                document.getElementById("game_lock").style.display = "block";
            }
        }
    }
} else {
    more.style.display = "none";
}
 