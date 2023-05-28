function UnityProgress(progress) {
	var progressBarFull = document.querySelector("#progressBar");
	progressBarFull.style.width = (100 * progress) + "%";
    
    var spinner = document.querySelector("#spinner");
    
	var loadInfo = document.querySelector("#loadingInfo");
	var loadPercent = document.querySelector("#loadingPercent");
    
    if (progress < 0.9 && loadPercent.className != "in-final-stage") {
        loadInfo.textContent = "Loading... ";
        loadPercent.textContent = Math.round(progress * 100) + "%";
	}
    
	if (progress == 0.9 && loadPercent.className != "in-final-stage") {
		loadPercent.className = "in-final-stage";
        progressBarFull.className = "in-final-stage";
        loadPercent.textContent = "";
	}
	if (progress == 1) {		
        var loadingBox = document.querySelector("#loadingBox");
        loadingBox.style.display = "none";
        var bg = document.querySelector("#bg");
        bg.style.display = "none";
	}
}
