function UnityProgress (dom) {
	this.progress = 0.0;
	this.message = "";
	this.dom = dom;

	// find parent DOM element
	var parent = dom.parentNode;

	// initialize DOM elements
	var background = document.createElement("div");
	var logoImage = document.createElement("img");
	var progressFrame = document.createElement("div");
	var progressBar = document.createElement("div");
	var messageArea = document.createElement("p");

	// initialize spinner
	var spinner = document.createElement('div')
	spinner.className='fading-circle'
	for (var i = 0; i < 12; i++) {
		var circle = document.createElement('div')
		circle.className='circle' + (i + 1) + ' circle'
		spinner.appendChild(circle)
	}

	// set class to background
	background.id='bg'
	logoImage.src = "TemplateData/progresslogo.png";
	logoImage.id = "dt2-logo";
	progressFrame.id = "progress-frame";
	progressBar.id = "progress-bar";
	messageArea.id = "message-area";

	// bind elements to this "class" for easier handling
	this.background = background;
	this.logoImage = logoImage;
	this.progressFrame = progressFrame;
	this.progressBar = progressBar;
	this.messageArea = messageArea;
	this.spinner = spinner

	// add elements to dom
	parent.appendChild(background);
	parent.appendChild(logoImage);
	progressFrame.appendChild(progressBar);
	parent.appendChild(progressFrame);
	parent.appendChild(messageArea);
	parent.appendChild(spinner);

	// some weirdly done styling
	this.background.style.width = this.dom.offsetWidth + 'px';
	this.background.style.height = this.dom.offsetHeight + 'px';

	var _this = this
	this.fakeProgress = window.setInterval(function() {
		_this.progress += 0.01
		_this.Update()
	}, 100)

	this.SetProgress = function (progress) {
		if (this.progress < progress) {
			this.progress = progress;
		}
		this.messageArea.style.display = "none";
		this.progressBar.style.display = "block";
		this.Update();
	}

	this.SetMessage = function (message) {
		this.message = message;
		// this.background.style.display = "block";
		// this.logoImage.style.display = "block";
		// this.progressBar.style.display = "none";
		this.Update();
	}

	// clear everything once game is loaded
	this.Clear = function() {
		window.clearInterval(this.fakeProgress)

		this.background.style.display = "none";
		this.logoImage.style.display = "none";
		this.progressFrame.style.display = "none";
		this.progressBar.style.display = "none";
		this.spinner.style.display = "none";
	}

	this.Update = function() {

		// update progress bar completeness
		this.progressBar.style.width = 100 * Math.min(this.progress, 1) + '%';

		// update message?
		this.messageArea.style.top = this.progressBar.style.top;
		this.messageArea.innerHTML = this.message;
	}

	this.Update();
}
