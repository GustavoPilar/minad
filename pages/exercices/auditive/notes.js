let audioContext;
const form = document.getElementById('noteForm');
let frequenciesReplays = [];
const play = document.getElementById('playButton');
const replay = document.getElementById('replayButton');
const answerBtn = document.getElementById('answerButton');
const answer = document.getElementById('answer');
const answerNotes = document.getElementById('answerNotes');
const sequenceLength = document.getElementById('sequenceLength');
const sequenceLengthInput = document.getElementById('sequenceLengthInput');
const checkboxes = document.getElementById('checkboxes');
const ringing = document.getElementById('ringing');

play.addEventListener('click', (event) => {
    event.preventDefault();

    if (sequenceLengthInput.value == null || sequenceLengthInput.value == '') {
        error(true, document.getElementById('sequenceError'));
        return;
    }
    else {
        error(false, document.getElementById('sequenceError'));
    }

    // Garantir que o AudioContext seja criado apenas uma vez
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const sequenceLength = parseInt(sequenceLengthInput.value);
    const allCheckboxes = form.querySelectorAll('input[type="checkbox"]');

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
    }
    else {
        error(false, document.getElementById('notesError'));
    };

    const notes = [];
    for (let i = 0; i < sequenceLength; i++) {
        const randomIndex = Math.floor(Math.random() * frequencies.length); // Índice entre 0 e frequencies.length - 1
        notes.push(frequencies[randomIndex]);
    }

    frequenciesReplays = [frequencies[0], ...notes];

    play.style.display = 'none';
    replay.style.display = 'block';
    answerBtn.style.display = 'block';
    answer.style.display = 'none';

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

    sequenceLength.style.display = 'block';
    checkboxes.style.display = 'block';
    replay.style.display = 'none';
    play.style.display = 'block';
    answerBtn.style.display = 'none';
    answer.style.display = 'block';

    const allCheckboxes = form.querySelectorAll('input[type="checkbox"]');
    const frequencyMap = Array.from(allCheckboxes).reduce((map, checkbox) => {
        map[parseFloat(checkbox.getAttribute('data-grau'))] = checkbox.nextElementSibling.innerText.split('-')[1].trim();
        return map;
    }, {});

    const sequenceNumbers = frequenciesReplays.map(frequency => frequencyMap[frequency]);

    const answerNotes = document.getElementById('answerNotes');
    answerNotes.textContent = sequenceNumbers.join(' - ');

    frequenciesReplays = [];
});


function playSequence(notes) {
    sequenceLength.style.display = 'none';
    checkboxes.style.display = 'none';
    play.style.display = 'none';
    replay.style.display = 'none';
    answerBtn.style.display = 'none';
    answer.style.display = 'none';
    ringing.style.display = 'block';

    const noteDuration = 1;
    const pauseDuration = 1;
    let startTime = audioContext.currentTime;

    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine'; // Tipo de onda (seno)
        oscillator.frequency.value = frequency;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        let noteStartTime;

        if (index === 0) {
            noteStartTime = startTime;
        } else if (index === 1) {
            noteStartTime = startTime + noteDuration + pauseDuration;
        } else {
            noteStartTime = startTime + noteDuration + pauseDuration + (index - 1) * noteDuration;
        }

        const noteEndTime = noteStartTime + noteDuration;

        oscillator.start(noteStartTime);
        oscillator.stop(noteEndTime);
    });

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
