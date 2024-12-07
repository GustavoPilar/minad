const form = document.getElementById('noteForm');

form.addEventListener('submit', (event) => {

    event.preventDefault(); // Evitar o carregamento da página

    // Pegando os valores dos inputs
    const sequenceLength = parseInt(document.getElementById('sequenceLength').value);
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    const frequencies = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseFloat(checkbox.getAttribute('data-grau')));
    
    // Verificar se há frequências disponíveis
    if (frequencies.length === 0) {
        alert("Selecione pelo menos uma nota!");
        return;
    }

    //Gerar sequência aleatória de notas
    const notes = [];
    for (let i = 0; i < sequenceLength; i++) {
        const randomDegree = Math.floor(Math.random() * frequencies.length); // Grau entre 0 e grau máximo
        notes.push(frequencies[randomDegree]);
    }

    console.log(notes);

    // Tocar a primeira nota como referência e depois a sequência
    playSequence([frequencies[0], ...notes]);
});

function playSequence(notes) {

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    let startTime = audioContext.currentTime; // Tempo inicial
    const noteDuration = 1; // Duração de cada nota em segundos

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

