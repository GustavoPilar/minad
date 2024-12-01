document.getElementById('playButton').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obter os valores dos inputs
    const sequenceLength = parseInt(document.getElementById('sequenceLength').value);
    const maxDegree = parseInt(document.getElementById('maxDegree').value);

    // Validar os valores
    if (sequenceLength <= 0 || maxDegree < 1 || maxDegree > 7) {
        alert("Insira valores válidos.");
        return;
    }

    // Tabela de frequências (notas musicais da escala maior, grau 1 a 7)
    const frequencies = [
        261.63, // C (Dó)
        293.66, // D (Ré)
        329.63, // E (Mi)
        349.23, // F (Fá)
        392.00, // G (Sol)
        440.00, // A (Lá)
        493.88  // B (Si)
    ];

    // Gerar sequência aleatória de notas
    const notes = [];
    for (let i = 0; i < sequenceLength; i++) {
        const randomDegree = Math.floor(Math.random() * maxDegree); // Grau entre 0 e maxDegree-1
        notes.push(frequencies[randomDegree]);
    }

    // Tocar as notas
    playSequence(notes);
});

function playSequence(notes) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    let startTime = audioContext.currentTime; // Tempo inicial
    const noteDuration = 0.5; // Duração de cada nota em segundos

    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine'; // Tipo de onda (sine = seno)
        oscillator.frequency.value = frequency; // Frequência da nota
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Definir início e fim da nota
        const noteStartTime = startTime + index * noteDuration;
        const noteEndTime = noteStartTime + noteDuration;

        oscillator.start(noteStartTime);
        oscillator.stop(noteEndTime);
    });
}
