// Function to change the theme
function changeTheme(theme) {
    document.getElementById('themeLink').href = `${theme}-theme.css`;
    localStorage.setItem('currentTheme', theme);
  }
  
  // Function to get the currently selected theme from localStorage
  function getCurrentTheme() {
    return localStorage.getItem('currentTheme');
  }
  
  // Set the theme on page load
  window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = getCurrentTheme();
    if (savedTheme) {
      changeTheme(savedTheme);
    }
  });
  
  // Event listener for the theme buttons
  document.getElementById('darkThemeBtn').addEventListener('click', function() {
    changeTheme('/dark');
  });
  
  document.getElementById('lightThemeBtn').addEventListener('click', function() {
    changeTheme('/light');
  });
  
  document.getElementById('lightThemeBtn').addEventListener('click', function() {
    changeTheme('/default');
  });
  
  // Clear the saved theme from localStorage
  document.getElementById('clearThemeBtn').addEventListener('click', function() {
    localStorage.removeItem('currentTheme');
  });