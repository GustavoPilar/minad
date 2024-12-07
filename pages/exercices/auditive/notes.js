let audioContext; // Declarar o AudioContext fora do escopo do evento
const form = document.getElementById('noteForm');
let frequenciesReplays = []; // Armazena a última sequência gerada
const play = document.getElementById('playButton');
const replay = document.getElementById('replayButton');
const answerBtn = document.getElementById('answerButton');
const answer = document.getElementById('answer');
const answerNotes = document.getElementById('answerNotes');

play.addEventListener('click', (event) => {
    event.preventDefault(); // Evitar o carregamento da página

    // Garantir que o AudioContext seja criado apenas uma vez
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Pegando os valores dos Inputs
    const sequenceLength = parseInt(document.getElementById('sequenceLength').value);
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');

    // Pegar as frequências (convertendo para números)
    const frequencies = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseFloat(checkbox.getAttribute('data-grau')));

    if (frequencies.length === 0) {
        alert("Selecione pelo menos uma nota!");
        return;
    }

    // Gerar sequência aleatória de notas
    const notes = [];
    for (let i = 0; i < sequenceLength; i++) {
        const randomIndex = Math.floor(Math.random() * frequencies.length); // Índice entre 0 e frequencies.length - 1
        notes.push(frequencies[randomIndex]);
    }

    // Armazenar a última sequência gerada
    frequenciesReplays = [frequencies[0], ...notes];

    // Atualizar exibição dos botões
    play.style.display = 'none';
    replay.style.display = 'block';
    answerBtn.style.display = 'block';
    answer.style.display = 'none';

    // Tocar a referência e depois a sequência
    playSequence(frequenciesReplays);
});

replay.addEventListener('click', (event) => {
    event.preventDefault();
    if (frequenciesReplays.length > 0) {
        console.log(frequenciesReplays);
        playSequence(frequenciesReplays);
    } else {
        alert("Nenhuma sequência para reproduzir.");
    }
});

answerBtn.addEventListener('click', (event) => {
    event.preventDefault();

    // Exibir os elementos apropriados
    replay.style.display = 'none';
    play.style.display = 'block';
    answerBtn.style.display = 'none';
    answer.style.display = 'block';

    // Obter os índices correspondentes às frequências
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const frequencyMap = Array.from(checkboxes).reduce((map, checkbox) => {
        map[parseFloat(checkbox.getAttribute('data-grau'))] = checkbox.nextElementSibling.innerText.split('-')[1].trim(); // Extrair o número (e.g., "1", "2")
        return map;
    }, {});

    // Mapear frequências para os números correspondentes
    const sequenceNumbers = frequenciesReplays.map(frequency => frequencyMap[frequency]);

    // Exibir a sequência formatada
    const answerNotes = document.getElementById('answerNotes');
    answerNotes.textContent = sequenceNumbers.join(' - ');

    // Limpar a lista de frequências (opcional, dependendo da lógica)
    frequenciesReplays = [];
    console.log(sequenceNumbers); // Para verificar no console
});


function playSequence(notes) {
    const noteDuration = 1; // Duração de cada nota em segundos
    let startTime = audioContext.currentTime; // Tempo inicial no contexto de áudio

    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine'; // Tipo de onda (seno)
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
