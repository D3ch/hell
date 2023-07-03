var windowElement = document.getElementById('window');
    var iframeElement = document.getElementById('iframe');

    function loadPath(path) {
      iframeElement.src = path;
      windowElement.classList.add("active");
    }

    function dragWindow(event) {
      var offsetX = event.clientX - windowElement.offsetLeft;
      var offsetY = event.clientY - windowElement.offsetTop;

      document.onmousemove = function(event) {
        windowElement.style.left = (event.clientX - offsetX) + "px";
        windowElement.style.top = (event.clientY - offsetY) + "px";
      };

      document.onmouseup = function() {
        document.onmousemove = null;
      };
    }

    function closeWindow() {
      windowElement.classList.remove("active");
      iframeElement.src = '';
    }