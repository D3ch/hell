
        // Function to show the popup
        function showPopup() {
            var popup = document.getElementById("popup");
            popup.style.display = "block";
        }
        
        // Function to hide the popup
        function hidePopup() {
            var popup = document.getElementById("popup");
            popup.style.display = "none";
        }
        
        // "event listener" or wtv for close button
        document.getElementById("closeBtn").addEventListener("click", hidePopup);
        
        // Show the popup after around 2 seconds
        setTimeout(showPopup, 2000)