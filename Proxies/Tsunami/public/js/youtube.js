window.addEventListener('load', function() {
searchyoutube = document.getElementById("searchyoutube");
searchyoutube.addEventListener('keyup', function onEvent(e) {
    if (e.keyCode === 13) {
        if (searchyoutube.value.startsWith("https://www.youtube.com/watch?v=")) {
        window.location.href = "/watch?v=" + searchyoutube.value.split("https://www.youtube.com/watch?v=")[1]
        } else {
        window.location.href = "/watch?v=" + searchyoutube.value
        }
    }
});
})