<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dino Game - Website Theme</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: bold;
            color: #111827;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #f97316, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .header p {
            color: #6b7280;
            font-style: italic;
            margin-bottom: 20px;
        }

        .controls {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(249, 115, 22, 0.3);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
        }

        .btn-secondary:hover {
            background: #4b5563;
            transform: translateY(-2px);
        }

        .score-section {
            display: none;
            align-items: center;
            gap: 30px;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .high-score {
            color: #22c55e;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .current-score {
            color: #3b82f6;
        }

        .game-container {
            border: 3px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            background: #1f2937;
            position: relative;
            display: none;
        }

        #gameCanvas {
            display: block;
            background: linear-gradient(to bottom, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%);
        }

        .instructions {
            margin-top: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.8);
            padding: 10px 20px;
            border-radius: 8px;
            backdrop-filter: blur(10px);
            display: none;
        }

        .trophy {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: #22c55e;
            border-radius: 50%;
            position: relative;
        }

        .trophy::before {
            content: '🏆';
            position: absolute;
            top: -2px;
            left: -1px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Try Getting a High Score</h1>
        <p>While I reply to your email</p>
    </div>

    <div class="controls">
        <button class="btn btn-primary" onclick="toggleGame()">Show Game</button>
    </div>

    <div class="score-section">
        <div class="high-score">
            <span class="trophy"></span>
            <span>High: <span id="highScore">553</span></span>
        </div>
        <div class="current-score">Score: <span id="currentScore">0</span></div>
        <button class="btn btn-secondary" onclick="resetGame()">🔄 Reset</button>
    </div>

    <div class="game-container">
        <canvas id="gameCanvas" width="800" height="200"></canvas>
    </div>

    <div class="instructions">
        SPACE/↑: Jump • ↓: Duck • Avoid obstacles!
    </div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Website color palette
        const colors = {
            // Sky gradient - matching website's blue tones
            skyTop: '#dbeafe',    // light blue-100
            skyMiddle: '#bfdbfe', // blue-200
            skyBottom: '#93c5fd', // blue-300
            
            // Ground - using website's gray tones
            ground: '#6b7280',    // gray-500
            groundDark: '#4b5563', // gray-600
            
            // Dino - website's orange accent
            dino: '#f97316',      // orange-500
            dinoAccent: '#ea580c', // orange-600
            
            // Obstacles - website's darker grays
            cactus: '#374151',    // gray-700
            cactusAccent: '#1f2937', // gray-800
            
            // Clouds - light website tones
            cloud: '#f3f4f6',     // gray-100
            cloudBorder: '#e5e7eb', // gray-200
            
            // Text
            text: '#111827',      // gray-900
            scoreText: '#3b82f6'  // blue-500
        };

        let gameRunning = false;
        let gameSpeed = 5;
        let score = 0;
        let highScore = localStorage.getItem('dinoHighScore') || 553;
        
        // Game objects
        let dino = {
            x: 80,
            y: 120,
            width: 40,
            height: 40,
            isJumping: false,
            isDucking: false,
            jumpPower: 0,
            onGround: true
        };
        
        let obstacles = [];
        let clouds = [];
        let groundOffset = 0;

        // Update high score display
        document.getElementById('highScore').textContent = highScore;

        function startGame() {
            if (!gameRunning) {
                gameRunning = true;
                gameLoop();
            }
        }

        function resetGame() {
            gameRunning = false;
            score = 0;
            gameSpeed = 5;
            obstacles = [];
            clouds = [];
            dino.y = 120;
            dino.isJumping = false;
            dino.isDucking = false;
            dino.jumpPower = 0;
            dino.onGround = true;
            updateScore();
        }

        function toggleGame() {
            const container = document.querySelector('.game-container');
            const scoreSection = document.querySelector('.score-section');
            const instructions = document.querySelector('.instructions');
            const btn = document.querySelector('.btn-primary');
            
            if (container.style.display === 'none') {
                container.style.display = 'block';
                scoreSection.style.display = 'flex';
                instructions.style.display = 'block';
                btn.textContent = 'Hide Game';
                btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                btn.style.boxShadow = '0 10px 20px rgba(34, 197, 94, 0.3)';
            } else {
                container.style.display = 'none';
                scoreSection.style.display = 'none';
                instructions.style.display = 'none';
                btn.textContent = 'Show Game';
                btn.style.background = 'linear-gradient(135deg, #f97316, #ea580c)';
                btn.style.boxShadow = '0 10px 20px rgba(249, 115, 22, 0.3)';
                gameRunning = false;
            }
        }

        function updateScore() {
            document.getElementById('currentScore').textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('dinoHighScore', highScore);
                document.getElementById('highScore').textContent = highScore;
            }
        }

        function drawBackground() {
            // Sky gradient matching website blues
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, colors.skyTop);
            gradient.addColorStop(0.5, colors.skyMiddle);
            gradient.addColorStop(1, colors.skyBottom);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height - 30);
            
            // Ground with website gray
            ctx.fillStyle = colors.ground;
            ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
            
            // Ground pattern
            ctx.fillStyle = colors.groundDark;
            for (let i = 0; i < canvas.width; i += 20) {
                ctx.fillRect(i + groundOffset % 20, canvas.height - 30, 2, 30);
            }
        }

        function drawDino() {
            ctx.fillStyle = colors.dino;
            
            if (dino.isDucking) {
                // Ducking dino - lower and wider
                ctx.fillRect(dino.x, dino.y + 20, 50, 20);
                // Eye
                ctx.fillStyle = colors.dinoAccent;
                ctx.fillRect(dino.x + 35, dino.y + 22, 6, 6);
            } else {
                // Standing/jumping dino
                ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
                
                // Dino details with accent color
                ctx.fillStyle = colors.dinoAccent;
                // Eye
                ctx.fillRect(dino.x + 25, dino.y + 8, 8, 8);
                // Legs
                ctx.fillRect(dino.x + 5, dino.y + 30, 8, 15);
                ctx.fillRect(dino.x + 25, dino.y + 30, 8, 15);
                // Arms
                ctx.fillRect(dino.x + 35, dino.y + 15, 10, 8);
            }
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                ctx.fillStyle = colors.cactus;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Cactus details
                ctx.fillStyle = colors.cactusAccent;
                // Main stem
                ctx.fillRect(obstacle.x + obstacle.width/2 - 2, obstacle.y, 4, obstacle.height);
                // Arms
                if (obstacle.height > 40) {
                    ctx.fillRect(obstacle.x + 5, obstacle.y + 15, 15, 4);
                    ctx.fillRect(obstacle.x + obstacle.width - 20, obstacle.y + 25, 15, 4);
                }
            });
        }

        function drawClouds() {
            clouds.forEach(cloud => {
                ctx.fillStyle = colors.cloud;
                ctx.strokeStyle = colors.cloudBorder;
                ctx.lineWidth = 1;
                
                // Cloud shape
                ctx.beginPath();
                ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2);
                ctx.arc(cloud.x + 15, cloud.y, 20, 0, Math.PI * 2);
                ctx.arc(cloud.x + 30, cloud.y, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        }

        function drawScore() {
            ctx.fillStyle = colors.text;
            ctx.font = 'bold 18px Arial';
            ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
            
            if (score > 0 && score == highScore) {
                ctx.fillStyle = colors.scoreText;
                ctx.fillText('NEW HIGH!', canvas.width - 120, 50);
            }
        }

        function updateGame() {
            if (!gameRunning) return;

            // Move ground
            groundOffset += gameSpeed;

            // Dino physics
            if (dino.isJumping) {
                dino.y -= dino.jumpPower;
                dino.jumpPower -= 1.5;
                if (dino.y >= 120) {
                    dino.y = 120;
                    dino.isJumping = false;
                    dino.onGround = true;
                    dino.jumpPower = 0;
                }
            }

            // Generate obstacles
            if (Math.random() < 0.005) {
                obstacles.push({
                    x: canvas.width,
                    y: Math.random() < 0.5 ? 120 : 140,
                    width: 20 + Math.random() * 20,
                    height: 40 + Math.random() * 20
                });
            }

            // Generate clouds
            if (Math.random() < 0.002) {
                clouds.push({
                    x: canvas.width,
                    y: 30 + Math.random() * 40,
                    speed: 1 + Math.random()
                });
            }

            // Move obstacles
            obstacles = obstacles.filter(obstacle => {
                obstacle.x -= gameSpeed;
                return obstacle.x > -obstacle.width;
            });

            // Move clouds
            clouds = clouds.filter(cloud => {
                cloud.x -= cloud.speed;
                return cloud.x > -50;
            });

            // Collision detection
            obstacles.forEach(obstacle => {
                let dinoBox = {
                    x: dino.x,
                    y: dino.y + (dino.isDucking ? 20 : 0),
                    width: dino.isDucking ? 50 : dino.width,
                    height: dino.isDucking ? 20 : dino.height
                };

                if (dinoBox.x < obstacle.x + obstacle.width &&
                    dinoBox.x + dinoBox.width > obstacle.x &&
                    dinoBox.y < obstacle.y + obstacle.height &&
                    dinoBox.y + dinoBox.height > obstacle.y) {
                    gameRunning = false;
                    updateScore();
                }
            });

            // Increase score and speed
            score += 1;
            if (score % 100 === 0) {
                gameSpeed += 0.5;
            }

            updateScore();
        }

        function gameLoop() {
            if (!gameRunning) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            drawBackground();
            drawClouds();
            drawDino();
            drawObstacles();
            drawScore();
            
            updateGame();
            
            requestAnimationFrame(gameLoop);
        }

        // Controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!gameRunning) {
                    startGame();
                } else if (dino.onGround) {
                    dino.isJumping = true;
                    dino.jumpPower = 18;
                    dino.onGround = false;
                    dino.isDucking = false;
                }
            }
            
            if (e.code === 'ArrowDown') {
                e.preventDefault();
                if (!dino.isJumping) {
                    dino.isDucking = true;
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowDown') {
                dino.isDucking = false;
            }
        });

        // Touch/click controls for mobile
        canvas.addEventListener('click', (e) => {
            if (!gameRunning) {
                startGame();
            } else if (dino.onGround) {
                dino.isJumping = true;
                dino.jumpPower = 18;
                dino.onGround = false;
                dino.isDucking = false;
            }
        });

        // Initial game state
        drawBackground();
        drawDino();
        drawScore();
    </script>
</body>
</html>
