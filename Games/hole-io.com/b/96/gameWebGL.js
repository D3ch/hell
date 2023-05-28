var currentScriptPath = function () {

    var currentScript = document.currentScript.src;
    var currentScriptChunks = currentScript.split( '/' );
    var currentScriptFile = currentScriptChunks[ currentScriptChunks.length - 1 ];

    return currentScript.replace( currentScriptFile, '' );
}

function waitForElement(selector) {
  return new Promise(function(resolve, reject) {
    var element = document.querySelector(selector);

    if(element) {
      resolve(element);
      return;
    }

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var nodes = Array.from(mutation.addedNodes);
        for(var node of nodes) {
          if(node.matches && node.matches(selector)) {
            observer.disconnect();
            resolve(node);
            return;
          }
        };
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

var container = document.querySelector("#webgl-content");
var canvas = document.querySelector("#gameContainer");
var buildUrl = currentScriptPath();
var loaderUrl = buildUrl + "Builds.loader.js";

var config = {
        dataUrl: buildUrl + "Builds.data.unityweb",
        frameworkUrl: buildUrl + "Builds.framework.js.unityweb",
        codeUrl: buildUrl + "Builds.wasm.unityweb",
        streamingAssetsUrl: buildUrl + "StreamingAssets",
        companyName: "DRA.RU",
        productName: "HOLE.io",
        productVersion: "3.0",
    };

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Mobile device style: fill the whole browser client area with the game canvas:

        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
        //container.className = "unity-mobile";

        // To lower canvas resolution on mobile devices to gain some
        // performance, uncomment the following line:
        // config.devicePixelRatio = 1;

        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        
        window.onresize = function () {
            console.log("window.innerWidth=" + window.innerWidth);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
        };
      } 
      
var script = document.createElement("script");
script.src = loaderUrl;
var gameInstance = {};

//var canvas = document.querySelector("#gameContainer");
waitForElement("#gameContainer").then(
	function(gameContainerCanvas) {
		script.onload = () => {
			createUnityInstance(gameContainerCanvas, config, (progress) => {
			  UnityProgress(progress);
			}).then((unityInstance) => {
				console.log("Unity Instance created");
			    gameInstance = unityInstance;
			    CallParameterless = gameInstance.Module.cwrap('call_cb_v', null, []);
				SendMessageInt = gameInstance.Module.cwrap('call_cb_vi', null, ['number']);
				SendMessageFloat = gameInstance.Module.cwrap('call_cb_vf', null, ['number']);
				SendMessageString = gameInstance.Module.cwrap('call_cb_vs', null, ['string']);
				SendMessageByteArray = gameInstance.Module.cwrap('call_cb_vb', null, ['number', 'number']);
				SendMessageVector3 = gameInstance.Module.cwrap('call_cb_vv3', null, ['number']);
				c_vv3json = gameInstance.Module.cwrap('call_cb_vv3json', null, ['string']);
				c_vx = gameInstance.Module.cwrap('call_cb_vx', null, ['number', 'number', 'number', 'number']);
				c_vxjson = gameInstance.Module.cwrap('call_cb_vxjson', null, ['string']);
				c_i = gameInstance.Module.cwrap('call_cb_i', 'number', []);
				c_f = gameInstance.Module.cwrap('call_cb_f', 'number', []);
				c_s = gameInstance.Module.cwrap('call_cb_s', 'string', []);

				gameInstance.SendMessage = function (param) {
					//console.log("gameInstance.SendMessage: " + param);
					if (param === undefined) {
						if (typeof this.SendMessage_vss != 'function')
							this.SendMessage_vss = CallParameterless;
						this.SendMessage_vss();
					} else if (typeof param === "string") {
						//console.log("SendMessage string ");
					
						if (typeof this.SendMessage_vsss != 'function')
							this.SendMessage_vsss = SendMessageString;
						this.SendMessage_vsss(param);
					} else if (typeof param === "number") {
						if (typeof this.SendMessage_vssn != 'function')
							this.SendMessage_vssn = SendMessageFloat;
						this.SendMessage_vssn(param);
					} else if (param instanceof Uint8Array) {
						if (typeof this.SendMessage_vb != 'function')
							this.SendMessage_vb = SendMessageByteArray;
						var ptr = gameInstance.Module._malloc(param.byteLength);
						var dataHeap = new Uint8Array(gameInstance.Module.HEAPU8.buffer, ptr, param.byteLength);
						dataHeap.set(param);

						this.SendMessage_vb(ptr, param.length);
					} else
						throw "" + param + " is does not have a type which is supported by SendMessage.";
				};
				var getPlayerIdObj = {
					eventName : "getPlayerId",
					data : {
						playerId : window.player_id
					}
				};
				gameInstance.SendMessage(JSON.stringify(getPlayerIdObj));
			}).catch((message) => {
			  alert(message);
			});
		};

	}
);

document.body.appendChild(script);

// this function is called from page to send data to Unity
window.sendMessageToUnity = function (data) {

    if (!(data instanceof Uint8Array)) {
        //data = msgpack.encode(data)
    }

    if (window.gameInstance.SendMessage === undefined) {
        console.log("Undefined SendMessage function");
    } else {
		//console.log("gameInstance 2 == " + gameInstance.SendMessage);
        gameInstance.SendMessage(data);
    }
};

async function fetchAsync (url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function getUserGeneratedSkins() {
	fetchAsync("https://skins.hole-io.com/skins/getAll").then(function(result) {
		//console.log( result );
		var struct = {
			eventName : "userGeneratedSkins",
			data : {
				list : {}
			}
		}
		struct.data.list = result;
		sendMessageToUnity(JSON.stringify(struct));
	});	
}

function getSkin(id){
	fetchAsync("https://skins.hole-io.com/skins/" + id).then(function(result) {
		//console.log( result );
		var struct = {
			eventName : "getUserGeneratedSkin",
			data : {
				skin : {}
			}
		}
		struct.data.skin = result;
		sendMessageToUnity(JSON.stringify(struct));
	});	
}

function getSkinPreview(id){
	fetchAsync("https://skins.hole-io.com/skins/" + id + "/activePreview").then(function(result) {
		console.log( result );
		var struct = {
			eventName : "userGeneratedSkinPreview",
			data : {
				preview : {}
			}
		}
		struct.data.preview = result;
		sendMessageToUnity(JSON.stringify(struct));
	});	
}

// this function is called from Unity to send data to server
function sendMessageToServer(bytes) {
    //gameWebSocket.send(bytes);
}

// this function is called by Unity when game is loaded 
function gameReady() {
	window.gameStart();
// hide web and show webGL unity div	
}
// this function is called by Unity when game is over and score is sent to server
function gameOver() {
	window.gameOverParent();
// hide webGL unity div and show web div
}
