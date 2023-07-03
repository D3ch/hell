        // Big update soon?????
        window.addEventListener('DOMContentLoaded', (event) => {
            const windows = document.querySelectorAll('.window');
            let selectedWindow = null;
            let offsetX = 0;
            let offsetY = 0;

            windows.forEach((window) => {
                window.addEventListener('mousedown', handleDragStart);
                window.addEventListener('mouseup', handleDragEnd);
                window.addEventListener('mousemove', handleDrag);
            });

            function handleDragStart(event) {
                selectedWindow = event.target;
                offsetX = event.offsetX;
                offsetY = event.offsetY;
                selectedWindow.style.zIndex = '1';
                selectedWindow.style.opacity = '0.5';
                selectedWindow.style.cursor = 'grabbing';
            }

            function handleDragEnd(event) {
                selectedWindow.style.zIndex = '0';
                selectedWindow.style.opacity = '1';
                selectedWindow.style.cursor = 'move';
                selectedWindow = null;
            }

            function handleDrag(event) {
                if (selectedWindow) {
                    const newLeft = event.clientX - offsetX;
                    const newTop = event.clientY - offsetY;

                    selectedWindow.style.left = `${newLeft}px`;
                    selectedWindow.style.top = `${newTop}px`;
                }
            }
        });

        // Toggle functionality
        function toggleWindow(windowId) {
            const window = document.getElementById(windowId);
            if (window.style.display === 'none') {
                window.style.display = 'block';
            } else {
                window.style.display = 'none';
            }
        }

        // Close button functionality
        function closeWindow(windowId) {
            const window = document.getElementById(windowId);
            window.style.display = 'none';
        }