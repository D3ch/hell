getParameterByName = function(e) {
  var a = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(location.href);
  return null === a ? "" : decodeURIComponent(a[1].replace(/\+/g, " "))
}
function loadGoogleAds() {
  var script = document.createElement("script");
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5829551249359723"
  script.setAttribute('data-ad-frequency-hint','90s');
  //script.setAttribute('data-adbreak-test','on');	
  script.setAttribute('crossorigin','anonymous');
  document.head.appendChild(script);
  window.adsbygoogle = window.adsbygoogle || [];
  adBreak = adConfig = function(o) {adsbygoogle.push(o);}
  adConfig({preloadAdBreaks: 'on'});

  console.log("h5game ad Script is loaded");
}
loadGoogleAds();

isCmgAdBreakDone = false;

function cmgGoogleAdBreak(type,callback) {
	if(typeof type == "undefined") {
		type = "next";
	}
	
	adBreak({
	  type: type,  // ad shows at start of next level
	  name: 'restart-game',
	  beforeAd: () => { console.log("cmgAdBreak: :beforeAd call"); },  // You may also want to mute the game's sound.
	  afterAd: () => { console.log("cmgAdBreak: :afterAd call"); isCmgAdBreakDone = true;
		  if(window.parent.document.getElementById('swfgame') != null) {
		      window.parent.document.getElementById('swfgame').contentWindow.focus();
		      console.log("cmgAdBreak: swfgame setting iframe focus after closing ad");
		    } else if(window.parent.document.getElementById('html5game') != null){
		      window.parent.document.getElementById('html5game').contentWindow.focus();
		      console.log("cmgAdBreak: html5game setting iframe focus after closing ad");
		    }
		  if (typeof callback == "function") {
                callback();
        }
	  },    // resume the game flow.
	});
}