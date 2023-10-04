var dbcontainer = document.createElement("div");
var dbfiles = {files:[], status: false};

var _func_ignore_drop = (e) => {e.stopPropagation();e.preventDefault();};
var _func_event_move = (e) => {
	_func_ignore_drop(e);
	dbfiles.status = true;
}
var _func_event_remove = (e) => {
	dbfiles.status = false;
}
var _func_event_drop = (e) => {
	_func_ignore_drop(e); 
	var dt = e.dataTransfer;
	var cfiles = dt.files;
	dbfiles.files = [];
	for (var i = 0; i < cfiles.length; i++) {
		var ourl = (window.URL || window.webkitURL).createObjectURL(cfiles[i]);
		dbfiles.files[i] = {link: ourl, name: cfiles[i].name};
	}
}


function dbCreateDropbox(x, y, w, h) {
	document.body.appendChild(dbcontainer);
	dbcontainer.innerHTML = `<div id="dropbox" style="
		top:` + x +`px;
		left:` + y + `px;
		width:` + w + `px;
		height:` + h +`px;
		color:red;
		position:absolute;
	">`;

	var dropbox;
	dropbox = document.getElementById("dropbox");

	dropbox.addEventListener("dragenter", _func_event_move, false);
	dropbox.addEventListener("dragover", _func_ignore_drop, false);
	dropbox.addEventListener("dragleave", _func_event_remove, false);
	dropbox.addEventListener("drop", _func_event_drop, false);
}

function dbRemoveDropbox() {
	var dropbox;
	dropbox = document.getElementById("dropbox");

	if (dropbox) {
		dbcontainer.removeChild(dropbox);
	}
	dbfiles.status = false;
}

function dbReturnFiles() {
	var cfiles = dbfiles.files;
	dbfiles.files = [];
	if (cfiles.length > 0) {
		dbfiles.status = false;
	}
	return JSON.stringify(cfiles);
}

function dbDropboxStatus() {
	return dbfiles.status;
}