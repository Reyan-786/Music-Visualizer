import * as THREE from './three/build/three.module.js';
import { analyzer } from './music_player.js';
// import * as TONE from './tone/build/Tone.js';

// import {beat} from './tone/build/Tone.js';

const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; 
// camera.position.x = 10;
// camera.position.y = 20;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

const sphereRadius =1;
const spherewidthSegment = 32;
const sphereheightSegment =32;

const sphereGeometry = new THREE.SphereGeometry(sphereRadius, spherewidthSegment, sphereheightSegment);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff,
    wireframe: true,
 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// sphere.position.set(10,10,10);
sphere.rotation.set(THREE.MathUtils.degToRad(10), THREE.MathUtils.degToRad(2), THREE.MathUtils.degToRad(10));

function burstAnimation() {
    const scalefactor = 2;
    sphere.scale.set(scalefactor,scalefactor,scalefactor);

    setTimeout(() => {
        sphere.scale.set(1, 1, 1); // Restore the original scale
    }, burstDuration);
}


// const beats = TONE.beat({
//     tempo: 120,
//     subdivision: '4n',
//     swing:0.2,

// })


// beats.on('beat', () => {
//     // Trigger your animation or burst effect here
//     burstAnimation();
// });

// beats.start();
function updateSphereWithAudioData(analyzer, sphere) {
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    // console.log(dataArray);
    analyzer.getByteFrequencyData(dataArray);

    // Calculate the average amplitude from the frequency data
    const averageAmplitude = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
    // console.log(averageAmplitude);
    const scaleFactor = 1 + (averageAmplitude / 256)*0.5; // You may need to adjust this scale factor
    sphere.scale.set(scaleFactor, scaleFactor, scaleFactor);

    
    const red = averageAmplitude / 256; // Adjust as needed
    const green = 1 - averageAmplitude / 256; // Adjust as needed
    const blue = (averageAmplitude -red - green)/256;
    sphere.material.color.setRGB(red, green, blue);
}



function animate() {

    requestAnimationFrame(animate);
    // console.log(`Rotation: X:${sphere.rotation.x}, Y:${sphere.rotation.y}, Z:${sphere.rotation.z}`);
    if (analyzer) {
        updateSphereWithAudioData(analyzer, sphere);
    }

    
    sphere.rotation.z += 0.01; 
    sphere.rotation.x +=0.01;
    sphere.rotation.y +=0.01;
    renderer.render(scene, camera);
}
const musicBox = document.querySelector('.music-box');
const audioElement = document.getElementById('musicPlayer');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

audioElement.addEventListener('canplay', () => {
    audioContext.resume().then(() => {
        audioElement.play();
        updateBackgroundColor();
    });
});

function updateBackgroundColor() {
    // const analyzer = audioContext.createAnalyser();
    // const source = audioContext.createMediaElementSource(audioElement);
    // source.connect(analyzer);
    // analyzer.connect(audioContext.destination);
    // analyzer.fftSize = 256;
    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    function animateMusicBox() {
        analyzer.getByteFrequencyData(dataArray);
        const averageAmplitude = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
        const red = averageAmplitude / 256;
        const green = 1 - averageAmplitude / 256;
        const blue = (averageAmplitude - red - green) / 256;

        musicBox.style.backgroundColor = `rgb(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)})`;

        requestAnimationFrame(animateMusicBox);
    }

    animateMusicBox();
}


animate();