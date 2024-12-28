let audioContext;
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88
const C5 = 523.25;
let buttons = document.getElementsByTagName('button');

function playSequence(frequencies) {

    hideButtons();

    let currentTime = audioContext.currentTime;

    frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine'; // Tipo de onda: 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(freq, currentTime); // Define a frequência
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(1, currentTime); // Volume da nota
    oscillator.start(currentTime); // Inicia o oscilador
    oscillator.stop(currentTime + 0.5); // Toca por 0.5s

    currentTime += 0.6; // Intervalo entre as notas (0.1s de pausa)
    });

    setTimeout(() => {
        showButtons();
    }, (currentTime * 1000));
}

function hideButtons() {
    Array.from(buttons).forEach(button => {
        button.style.display = 'none';
    })
}

function showButtons() {
    Array.from(buttons).forEach(button => {
        button.removeAttribute('style');
    })
}

function exerciseOneBoccaChiusa() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const frequencies = [C4, D4, E4, F4, G4, A4, B4, C5, B4, A4, G4, F4, E4, D4, C4];

    playSequence(frequencies);
}
