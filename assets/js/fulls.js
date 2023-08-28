document.addEventListener('DOMContentLoaded', function() {
    const fullscreenButton = document.getElementById('fullscreen-button');
  
    fullscreenButton.addEventListener('click', function() {
      // Fullscreen functionality
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
      }
      
      window.location.href = '/static/';
    });
  });
  