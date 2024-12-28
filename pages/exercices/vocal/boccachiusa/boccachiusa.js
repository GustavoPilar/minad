let audioContext;
let frequencies = [];
let currentTime
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88
const C5 = 523.25;
const buttons = document.getElementsByTagName('button');
const stopBtn = document.getElementById('stop');

function hasMany(bool) {
    hideButtons();
    if (bool) {
        playSequencesArrays();
    }
    else {
        playSequence();
    }
    showButtons();
}

function playSequence() {

    currentTime = audioContext.currentTime;

    frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine'; // Tipo de onda: 'sine', 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(freq, currentTime); // Define a frequência
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(.1, currentTime); // Volume da nota
    oscillator.start(currentTime); // Inicia o oscilador
    oscillator.stop(currentTime + 1); // Toca por 1s

    currentTime += 1; // Intervalo entre as notas (1s de pausa)
    });
}

function playSequencesArrays() {
    currentTime = audioContext.currentTime;

    console.log(frequencies);

    frequencies.forEach((frequencies) => {
        console.log('proximo');
        frequencies.forEach((freq, index) => {

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, currentTime);
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(.1, currentTime); 
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.5);
            
            currentTime += 0.6;
        });
    });

}

function hideButtons() {
    stopBtn.classList.remove('d-none');
    stopBtn.classList.add('d-block');

    Array.from(buttons).forEach(button => {
        button.style.display = 'none';
    })
}

function showButtons(time) {
    setTimeout(() => {
        stopBtn.classList.remove('d-block');
        stopBtn.classList.add('d-none');
        Array.from(buttons).forEach(button => {
            button.removeAttribute('style');
        })
        clearFrequencies();
    }, currentTime * 1000);
}

function clearFrequencies() {
    if (frequencies.length > 0) {
        frequencies = [];
    }
}

function exerciseOneBoccaChiusa() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    frequencies = [C4, D4, E4, F4, G4, A4, B4, C5, B4, A4, G4, F4, E4, D4, C4];

    hasMany(false);
}

function stop() {
    window.location.reload();
}

function exerciseTwoBoccaChiusa() {

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    frequencies = [
        [261.63, 293.66, 329.63, 293.66, 261.63, 277.18],  // C4
        [277.18, 311.13, 329.63, 311.13, 277.18, 293.66],  // C#4
        [293.66, 329.63, 349.23, 329.63, 293.66, 311.13],  // D4
        [311.13, 349.23, 369.99, 349.23, 311.13, 329.63],  // D#4
        [329.63, 369.99, 392.00, 369.99, 329.63, 349.23],  // E4
        [349.23, 392.00, 415.30, 392.00, 349.23, 369.99],  // F4
        [369.99, 415.30, 440.00, 415.30, 369.99, 392.00],  // F#4
        [392.00, 440.00, 466.16, 440.00, 392.00, 415.30],  // G4
        [415.30, 466.16, 493.88, 466.16, 415.30, 440.00],  // G#4
        [440.00, 493.88, 523.25, 493.88, 440.00, 466.16],  // A4
        [466.16, 523.25, 554.37, 523.25, 466.16, 493.88],  // A#4
        [493.88, 554.37, 587.33, 554.37, 493.88, 523.25],  // B4
        [523.25, 587.33, 622.25, 587.33, 523.25, 554.37],  // C5
        [554.37, 622.25, 659.26, 622.25, 554.37, 587.33],  // C#5
        [587.33, 659.26, 698.46, 659.26, 587.33, 622.25],  // D5
        [622.25, 698.46, 739.99, 698.46, 622.25, 659.26],  // D#5
        [659.26, 739.99, 783.99, 739.99, 659.26, 698.46],  // E5
        [698.46, 783.99, 830.61, 783.99, 698.46, 659.26],  // F5
        [659.26, 739.99, 783.99, 739.99, 659.26, 622.25],  // E5
        [622.25, 698.46, 739.99, 698.46, 622.25, 587.33],  // D#5
        [587.33, 659.26, 698.46, 659.26, 587.33, 523.25],  // D5
        [523.25, 587.33, 622.25, 587.33, 523.25, 493.88],  // C5
        [493.88, 554.37, 587.33, 554.37, 493.88, 466.16],  // B4
        [466.16, 523.25, 554.37, 523.25, 466.16, 440.00],  // A#4
        [440.00, 493.88, 523.25, 493.88, 440.00, 415.30],  // A4
        [415.30, 466.16, 493.88, 466.16, 415.30, 392.00],  // G#4
        [392.00, 440.00, 466.16, 440.00, 392.00, 369.99],  // G4
        [369.99, 415.30, 440.00, 415.30, 369.99, 349.23],  // F#4
        [349.23, 392.00, 415.30, 392.00, 349.23, 329.63],  // F4
        [329.63, 369.99, 392.00, 369.99, 329.63, 311.13],  // E4
        [311.13, 349.23, 369.99, 349.23, 311.13, 293.66],  // D#4
        [293.66, 329.63, 349.23, 329.63, 293.66, 277.18],  // D4
        [277.18, 311.13, 329.63, 311.13, 277.18, 261.63]   // C#4
        [261.63, 293.66, 329.63, 293.66, 261.63],  // C4
    ]
    

      hasMany(true);

}
