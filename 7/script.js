const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');

// 设置画布尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 游戏对象
const game = {
    score: 0,
    isRunning: true,
    speed: 5,
    jialu: {
        x: 100,
        y: canvas.height - 150,
        width: 80,
        height: 100,
        isJumping: false,
        jumpForce: 20,
        gravity: 0.8,
        velocityY: 0
    },
    obstacles: []
};

// 加载图片
const jialuImg = new Image();
jialuImg.src = 'images/jialu.png';
const obstacleImg = new Image();
obstacleImg.src = 'images/obstacle.png';

// 键盘控制
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// 游戏循环
function gameLoop() {
    if (!game.isRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    handleInput();
    updateJialu();
    updateObstacles();
    checkCollisions();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// 处理玩家输入
function handleInput() {
    if (keys['ArrowUp'] && !game.jialu.isJumping) {
        game.jialu.isJumping = true;
        game.jialu.velocityY = -game.jialu.jumpForce;
    }
}

// 更新嘉璐状态
function updateJialu() {
    if (game.jialu.isJumping) {
        game.jialu.y += game.jialu.velocityY;
        game.jialu.velocityY += game.jialu.gravity;

        if (game.jialu.y >= canvas.height - 150) {
            game.jialu.isJumping = false;
            game.jialu.velocityY = 0;
            game.jialu.y = canvas.height - 150;
        }
    }
}

// 生成障碍物
function spawnObstacle() {
    if (Math.random() < 0.02) {
        game.obstacles.push({
            x: canvas.width,
            y: canvas.height - 100,
            width: 50,
            height: 50
        });
    }
}

// 更新障碍物
function updateObstacles() {
    spawnObstacle();
    game.obstacles.forEach(obstacle => {
        obstacle.x -= game.speed;
        if (obstacle.x + obstacle.width < 0) {
            game.obstacles.shift();
            game.score += 10;
            scoreElement.textContent = `得分: ${game.score}`;
        }
    });
}

// 碰撞检测
function checkCollisions() {
    game.obstacles.forEach(obstacle => {
        if (
            game.jialu.x < obstacle.x + obstacle.width &&
            game.jialu.x + game.jialu.width > obstacle.x &&
            game.jialu.y < obstacle.y + obstacle.height &&
            game.jialu.y + game.jialu.height > obstacle.y
        ) {
            game.isRunning = false;
            gameOverScreen.classList.remove('hidden');
        }
    });
}

// 绘制画面
function draw() {
    // 绘制嘉璐
    ctx.drawImage(jialuImg, game.jialu.x, game.jialu.y, game.jialu.width, game.jialu.height);
    
    // 绘制障碍物
    game.obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// 重新开始游戏
function restartGame() {
    game.isRunning = true;
    game.score = 0;
    game.obstacles = [];
    game.jialu.y = canvas.height - 150;
    gameOverScreen.classList.add('hidden');
    scoreElement.textContent = `得分: 0`;
    gameLoop();
}

// 启动游戏
gameLoop();