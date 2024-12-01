document.getElementById('noteForm').addEventListener('click', function (event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obter os valores dos inputs
    const sequenceLength = parseInt(document.getElementById('sequenceLength').value);
    const maxDegree = parseInt(document.getElementById('maxDegree').value);

    // Validar os valores
    if (sequenceLength <= 0 || maxDegree < 1 || maxDegree > 7) {
        alert("Insira valores válidos.");
        return;
    }

    // Gerar sequência aleatória de notas
    const notes = [];
    for (let i = 0; i < sequenceLength; i++) {
        const randomDegree = Math.floor(Math.random() * maxDegree) + 1; // Grau entre 1 e maxDegree
        notes.push(randomDegree);
    }

    // Tocar as notas
    playSequence(notes);
});

function playSequence(notes) {
    let currentIndex = 0;

    function playNote() {
        if (currentIndex >= notes.length) {
            return; // Fim da sequência
        }

        // Criar elemento de áudio e configurar o arquivo
        const audio = new Audio(`notas/${notes[currentIndex]}.opus`);
        audio.play();

        // Avançar para a próxima nota quando o áudio terminar
        audio.onended = () => {
            currentIndex++;
            playNote();
        };
    }

    playNote(); // Começa a tocar a sequência
}
