var currentProgress = 0;

function ShowSiteInfo() {
  // $("#siteInfo").style = $("#gameContainer").style;
  $("#gameContainer").append($("#siteInfo"));
  $("#siteInfo").addClass("show");
  $("#siteInfo").fadeIn(400);
  // console.log();
}

function ShowGameCanvas() {
  $("#gameContainer").addClass("show");
}

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById("gameTitle").innerHTML = document.title;

  //Animation
  
})

function UnityProgress (gameInstance, progress) {
    currentProgress = progress;
    // this.progress = 0.0;
    this.message = "Loading...";
    // this.gameInstance = gameInstance;
    // var parent = gameInstance.parentNode;
    
    this.CheckProgress = function () { 
      if (progress == 1) {
        this.SetMessage("Preparing...");
        document.getElementById("bgBar").style.display = "none";
        document.getElementById("progressBar").style.display = "none";
      } 
    }

    this.SetMessage = function (message) { 
      this.message = message; 
    }

    this.Clear = function() {
      document.getElementById("loadingBox").style.display = "none";
    }

    this.Update = function() {
      var length = 200 * Math.min(progress, 1);
      bar = document.getElementById("progressBar")
      bar.style.width = length + "px";
      document.getElementById("loadingInfo").innerHTML = this.message;

      if(progress == 1) {
        document.getElementById("loadingBox").style.display = "none";
        ShowSiteInfo();
        ShowGameCanvas();
      }
    }

    this.CheckProgress();
    this.Update ();
  }