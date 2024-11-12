let timer;
let timeLeft = 60;
let score = 0;
let questionCount = 0;
let currentOperation = 'sum';

function startGame() {
    const name = document.getElementById('nameInput').value;
    currentOperation = document.getElementById('operationSelect').value;
    if (name) {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        document.getElementById('operationTitle').innerText = `Resuelve las ${getOperationName(currentOperation)} de ${name}`;
        startTimer();
        generateQuestion();
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
}

function startTimer() {
    timeLeft = 60;
    timer = setInterval(() => {
        document.getElementById('timer').innerText = `Tiempo: ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            endGame();
        }
    }, 1000);
}

function generateQuestion() {
    questionCount++;
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    let questionText = '';
    let correctAnswer = 0;

    switch (currentOperation) {
        case 'sum':
            questionText = `${num1} + ${num2}`;
            correctAnswer = num1 + num2;
            break;
        case 'sub':
            questionText = `${num1} - ${num2}`;
            correctAnswer = num1 - num2;
            break;
        case 'mul':
            questionText = `${num1} * ${num2}`;
            correctAnswer = num1 * num2;
            break;
        case 'div':
            questionText = `${num1 * num2} / ${num2}`;
            correctAnswer = num1;
            break;
    }

    document.getElementById('question').innerText = questionText;
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();

    document.getElementById('answerInput').dataset.correctAnswer = correctAnswer;
}

// Detecta la tecla "Enter" para enviar la respuesta
document.getElementById('answerInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        submitAnswer();
    }
});

function submitAnswer() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    const correctAnswer = parseInt(document.getElementById('answerInput').dataset.correctAnswer);
    if (userAnswer === correctAnswer) {
        score++;
    }
    generateQuestion();
}

function endGame() {
    clearInterval(timer);
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    document.getElementById('resultMessage').innerText = `Respuestas correctas: ${score} de ${questionCount}`;
    
    const nombre = document.getElementById('nameInput').value;
    saveUserData(nombre, score, questionCount - score);
}

function resetGame() {
    score = 0;
    questionCount = 0;
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
}

function getOperationName(operation) {
    switch (operation) {
        case 'sum': return 'sumas';
        case 'sub': return 'restas';
        case 'mul': return 'multiplicaciones';
        case 'div': return 'divisiones';
    }
}

function saveUserData(nombre, correctas, incorrectas) {
    const url = "https://script.google.com/macros/s/AKfycbzTb-lmj5ACgR28_XkMMnuQ5fSDegzKJU1eH8RWW406mPdggk1NnIalQh-K9SjymwWO/exec"; // Pega el URL del script aquí
    const data = {
        nombre: nombre,
        correctas: correctas,
        incorrectas: incorrectas
    };

    fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => console.log("Datos enviados"))
    .catch(error => console.error("Error:", error));
}
