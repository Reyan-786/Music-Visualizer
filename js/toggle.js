const toggleButton = document.getElementById('toggleLightorDark');
let toggleMode = 0; // 0 represents dark mode, 1 represents light mode

toggleButton.addEventListener('click', function() {
    const body = document.body; // Get the body element

    if (toggleMode === 0) {
        body.style.backgroundColor = 'white';
        toggleMode = 1; // Update toggleMode to represent light mode
    } else if (toggleMode === 1) {
        body.style.backgroundColor = 'black';
        toggleMode = 0; // Update toggleMode to represent dark mode
    }
});
