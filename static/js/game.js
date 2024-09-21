const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10},
];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let level = 1;
let speed = 100;

const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreSpan = document.getElementById('final-score');
const levelDisplay = document.getElementById('level');
const scoreDisplay = document.getElementById('score');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    level = 1;
    speed = 100;
    generateFood();
    gameRunning = true;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    canvas.classList.remove('hidden');
    updateScore();
    updateLevel();
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    setTimeout(() => {
        clearCanvas();
        moveSnake();
        drawSnake();
        drawFood();
        checkCollision();
        gameLoop();
    }, speed);
}

function clearCanvas() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        generateFood();
        if (score % 5 === 0) {
            level++;
            updateLevel();
            speed = Math.max(50, speed - 10);
        }
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * gridSize,
            segment.y * gridSize,
            (segment.x + 1) * gridSize,
            (segment.y + 1) * gridSize
        );
        gradient.addColorStop(0, index === 0 ? '#00a86b' : '#2ecc71');
        gradient.addColorStop(1, index === 0 ? '#008f5b' : '#27ae60');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
}

function drawFood() {
    const gradient = ctx.createRadialGradient(
        (food.x + 0.5) * gridSize,
        (food.y + 0.5) * gridSize,
        gridSize / 4,
        (food.x + 0.5) * gridSize,
        (food.y + 0.5) * gridSize,
        gridSize / 2
    );
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ee5253');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc((food.x + 0.5) * gridSize, (food.y + 0.5) * gridSize, gridSize / 2 - 1, 0, 2 * Math.PI);
    ctx.fill();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    gameRunning = false;
    finalScoreSpan.textContent = score;
    gameOverScreen.classList.remove('hidden');
    canvas.classList.add('hidden');
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
    scoreDisplay.classList.add('animate-pulse');
    setTimeout(() => scoreDisplay.classList.remove('animate-pulse'), 300);
}

function updateLevel() {
    levelDisplay.textContent = `Level: ${level}`;
    levelDisplay.classList.add('animate-pulse');
    setTimeout(() => levelDisplay.classList.remove('animate-pulse'), 300);
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Show start screen initially
startScreen.classList.remove('hidden');
canvas.classList.add('hidden');
