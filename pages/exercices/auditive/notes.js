let audioContext; // Declarar o AudioContext fora do escopo do evento 
const form = document.getElementById('noteForm');
let frequenciesReplays = []; // Armazena a última sequência gerada
const play = document.getElementById('playButton');
const replay = document.getElementById('replayButton');
const answerBtn = document.getElementById('answerButton');
const answer = document.getElementById('answer');
const answerNotes = document.getElementById('answerNotes');
const sequenceLength = document.getElementById('sequenceLength');
const sequenceLengthInput = document.getElementById('sequenceLengthInput');
const checkboxes = document.getElementById('checkboxes');
const ringing = document.getElementById('ringing');
const permissionButton = document.getElementById('permissionButton'); // Botão de permissão

// Solicitar permissão para tocar som
permissionButton.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            alert('Permissão concedida! Agora você pode tocar sons.');
        });
    } else {
        alert('Permissão já foi concedida anteriormente!');
    }
});

play.addEventListener('click', (event) => {
    event.preventDefault(); // Evitar o carregamento da página

    if (!audioContext) {
        alert('Por favor, permita tocar som antes de continuar.');
        return;
    }

    if (sequenceLengthInput.value == null || sequenceLengthInput.value == '') {
        error(true, document.getElementById('sequenceError'));
        return;
    } else {
        error(false, document.getElementById('sequenceError'));
    }

    // Pegando os valores dos Inputs
    const sequenceLengthValue = parseInt(sequenceLengthInput.value);
    const allCheckboxes = form.querySelectorAll('input[type="checkbox"]');

    // Pegar as frequências (convertendo para números)
    const frequencies = Array.from(allCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => parseFloat(checkbox.getAttribute('data-grau')));

    if (frequencies.length <= 0) {
        error(true, document.getElementById('notesError'));
        return;
    }
    if (frequencies.length > sequenceLengthInput.value) {
        error(true, document.getElementById('notesError'));
        return;
    } else {
        error(false, document.getElementById('notesError'));
    }

    // Gerar sequência aleatória de notas
    const notes = [];
    for (let i = 0; i < sequenceLengthValue; i++) {
        const randomIndex = Math.floor(Math.random() * frequencies.length); // Índice entre 0 e frequencies.length - 1
        notes.push(frequencies[randomIndex]);
    }

    // Armazenar a última sequência gerada
    frequenciesReplays = [frequencies[0], ...notes];

    // Tocar a referência e depois a sequência
    playSequence(frequenciesReplays);
});

// Outras funções existentes
// ...


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
    sequenceLength.style.display = 'block';
    checkboxes.style.display = 'block';
    replay.style.display = 'none';
    play.style.display = 'block';
    answerBtn.style.display = 'none';
    answer.style.display = 'block';

    // Obter os índices correspondentes às frequências
    const Allcheckboxes = form.querySelectorAll('input[type="checkbox"]');
    const frequencyMap = Array.from(Allcheckboxes).reduce((map, checkbox) => {
        map[parseFloat(checkbox.getAttribute('data-grau'))] = checkbox.nextElementSibling.innerText.split('-')[1].trim(); // Extrair o número (e.g., "1", "2")
        return map;
    }, {});

    // Mapear frequências para os números correspondentes
    const sequenceNumbers = frequenciesReplays.map(frequency => frequencyMap[frequency]);
    console.log(sequenceNumbers); // Para verificar no console

    // Exibir a sequência formatada
    const answerNotes = document.getElementById('answerNotes');
    answerNotes.textContent = sequenceNumbers.join(' - ');

    // Limpar a lista de frequências (opcional, dependendo da lógica)
    frequenciesReplays = [];
    sequenceLength.value = '';
});


function playSequence(notes) {
    sequenceLength.style.display = 'none';
    checkboxes.style.display = 'none';
    play.style.display = 'none';
    replay.style.display = 'none';
    answerBtn.style.display = 'none';
    answer.style.display = 'none';
    ringing.style.display = 'block';

    const noteDuration = 1; // Duração de cada nota em segundos
    const pauseDuration = 1; // Pausa após a primeira nota
    let startTime = audioContext.currentTime; // Tempo inicial no contexto de áudio

    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine'; // Tipo de onda (seno)
        oscillator.frequency.value = frequency; // Frequência da nota
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        let noteStartTime;

        if (index === 0) {
            // A primeira nota é tocada imediatamente
            noteStartTime = startTime;
        } else if (index === 1) {
            // A segunda nota começa após a pausa de 2 segundos
            noteStartTime = startTime + noteDuration + pauseDuration;
        } else {
            // As demais notas começam consecutivamente
            noteStartTime = startTime + noteDuration + pauseDuration + (index - 1) * noteDuration;
        }

        const noteEndTime = noteStartTime + noteDuration;

        oscillator.start(noteStartTime);
        oscillator.stop(noteEndTime);
    });

    // Exibir os botões de replay e resposta após todas as notas serem tocadas
    setTimeout(() => {
        showButtonsReplayAnswer();
    }, (notes.length * noteDuration + pauseDuration) * 1000);
}


function showButtonsReplayAnswer() {
    replay.style.display = 'block';
    answerBtn.style.display = 'block';
    ringing.style.display = 'none';
}


function error(bool, element) {
    if (bool) {
        element.style.display = 'block';
    }
    else {
        element.style.display = 'none';
    }
}
