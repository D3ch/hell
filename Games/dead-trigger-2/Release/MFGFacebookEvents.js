function PreInit()
{
	if(IsFB())
	{
		delete FB;
	}
	
	var fbScript = document.getElementById("facebook-jssdk");
	if(fbScript != null)
	{
		fbScript.parentNode.removeChild(fbScript);
	}
	
	var fbDiv = document.getElementById("fb-root");
	if(fbDiv != null)
	{
		fbDiv.parentNode.removeChild(fbDiv);
	}
}

function OnInit()
{
	console.log("Event: Page Loaded");
	if(IsFB())
	{
		FB.AppEvents.logEvent("WebGL Page Loaded");
	}
}

function CustomErrorHandler(desc,page,line,chr)
{
	if(IsFB())
	{
		var params            = {};
		params["Description"] = desc;
		
		FB.AppEvents.logEvent("WebGL App crashed", null, params);
	}
	alert("Custom MFG Error Handler:\n" + desc);
	return true;
}

function OnUnload()
{
	console.log("Event: App closed");
	if(IsFB())
	{
		FB.AppEvents.logEvent("WebGL App closed");
	}
}

function IsFB()
{
	return typeof FB !== "undefined";
}

window.onerror     = CustomErrorHandler;
window.onunload    = OnUnload;
window.fbAsyncInit = function()
{
	FB.init({
		appId      : '463319163784205',
		xfbml      : true,
		version    : 'v2.8'
	});
	
	OnInit();
};

(function(d, s, id)
{
	var js, fjs = d.getElementsByTagName(s)[0];
	if(d.getElementById(id))
		return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
