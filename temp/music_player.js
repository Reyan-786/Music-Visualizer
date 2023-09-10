const musicInput = document.getElementById('musicInput');
const musicPlayer = document.getElementById('musicPlayer');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let audioSource;
let analyzer; // Declare the analyzer variable

function loadMusic() {
    const file = musicInput.files[0];

    if (file) {
        const objectURL = URL.createObjectURL(file);
        musicPlayer.src = objectURL;

        const source = audioContext.createMediaElementSource(musicPlayer);
        source.connect(audioContext.destination);

        if (audioSource) {
            audioSource.disconnect();
        }

        audioSource = source;

        // Create the analyzer when a file is loaded
        analyzer = audioContext.createAnalyser();
        audioSource.connect(analyzer);
        analyzer.fftSize = 256;
    }
}



musicInput.addEventListener('change', loadMusic);

const ifStuckButton = document.getElementById('playButton');
playButton.addEventListener('click', () => {
    // Check if audioSource is defined before attempting to play
    if (audioSource) {
        audioContext.resume().then(() => {
            audioSource.play();
        });
    }
});

export {analyzer};