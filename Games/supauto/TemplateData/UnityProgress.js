function UnityProgress(progress, loader, logo) {
    logo.style.display = "block";
    loader.style.display = "block";

    setLoaderProgressTo(loader, progress);

    if (progress == 1) {
        logo.style.display = "none";
        loader.style.display = "none";
    }
}

// value - 0 to 1
function setLoaderProgressTo(loader, value) {
    const fill = loader.getElementsByClassName("fill")[0];
    const fillText = loader.getElementsByClassName("label")[0];

    fill.animate(
        [
            { width: (value * 100) + "%" }
        ], {
            duration: 300,
            fill: "forwards"
        }
    );

    fillText.textContent = (value * 100).toFixed() + "%";
}