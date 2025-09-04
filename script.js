let timer;
let timeLeft = 60;
let score = 0;
let questionCount = 0;
let currentOperation = 'sum';
let countdownTimer;

function startGame() {
    const name = document.getElementById('nameInput').value;
    currentOperation = document.getElementById('operationSelect').value;
    if (name) {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('countdown-screen').style.display = 'block';
        startCountdown(); // Llama al inicio de la cuenta regresiva
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
}

function startCountdown() {
    let countdown = 3;
    document.getElementById('countdown-timer').innerText = countdown;

    countdownTimer = setInterval(() => {
        countdown--;
        document.getElementById('countdown-timer').innerText = countdown;

        if (countdown === 0) {
            clearInterval(countdownTimer);
            document.getElementById('countdown-screen').style.display = 'none';
            document.getElementById('game-screen').style.display = 'block';
            document.getElementById('operationTitle').innerText = `Resuelve las ${getOperationName(currentOperation)} de ${document.getElementById('nameInput').value}`;
            startTimer();
            generateQuestion();
            // Lee tecla enter para validación
            document.getElementById('answerInput').addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    submitAnswer();
                }
            });
        }
    }, 1000);
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
    const operacion = currentOperation;
    saveUserData(nombre, score, questionCount - score, operacion);
}

function resetGame() {
    score = 0;
    questionCount = 0;
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('countdown-screen').style.display = 'none';
}

function getOperationName(operation) {
    switch (operation) {
        case 'sum': return 'sumas';
        case 'sub': return 'restas';
        case 'mul': return 'multiplicaciones';
        case 'div': return 'divisiones';
    }
}

function saveUserData(nombre, correctas, incorrectas, operacion) {
    const url = "https://script.google.com/macros/s/AKfycbyyBBLLG-dd-5zKFCOPb7EnZdGvP35657B6H11ZkHNCl9_Huls8sTmQxSoqVbrvKDnzsg/exec";

    const data = {
        nombre: nombre,
        correctas: correctas,
        incorrectas: incorrectas,
        operacion: operacion
    };

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.text())
    .then(result => console.log("✅ Datos enviados correctamente:", result))
    .catch(error => console.error("❌ Error al guardar datos:", error));
}
