import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const DinosaurGame = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const animationRef = useRef();
  const keysRef = useRef({});

  // Game initialization
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 600;
    canvas.height = 200;

    const game = {
      dino: {
        x: 50,
        y: canvas.height - 50,
        width: 24,
        height: 26,
        velocityY: 0,
        jumpPower: -12,
        gravity: 0.8,
        grounded: true,
        ducking: false,
        duckHeight: 18,
        normalHeight: 26
      },
      obstacles: [],
      clouds: [],
      ground: {
        x: 0,
        y: canvas.height - 20,
        width: canvas.width,
        height: 20
      },
      gameSpeed: 3,
      spawnTimer: 0,
      spawnDelay: 120, // frames between obstacles
      score: 0,
      gameOver: false,
      lastObstacleX: canvas.width
    };

    // Initialize clouds
    for (let i = 0; i < 5; i++) {
      game.clouds.push({
        x: Math.random() * canvas.width * 2,
        y: 20 + Math.random() * 40,
        width: 30,
        height: 15,
        speed: 0.5
      });
    }

    gameRef.current = game;
    return game;
  }, []);

  // Touch controls
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    const canvasHeight = rect.height;

    // Upper half - jump, lower half - duck
    if (y < canvasHeight * 0.6) {
      // Jump
      if (gameRef.current && gameRef.current.dino.grounded) {
        gameRef.current.dino.velocityY = gameRef.current.dino.jumpPower;
        gameRef.current.dino.grounded = false;
        setIsJumping(true);
      }
    } else {
      // Duck
      if (gameRef.current && gameRef.current.dino.grounded) {
        gameRef.current.dino.ducking = true;
        gameRef.current.dino.height = gameRef.current.dino.duckHeight;
        setIsDucking(true);
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (gameRef.current) {
      gameRef.current.dino.ducking = false;
      gameRef.current.dino.height = gameRef.current.dino.normalHeight;
      setIsDucking(false);
    }
  };

  // Key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
      
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (gameRef.current && gameRef.current.dino.grounded && !gameRef.current.gameOver) {
          gameRef.current.dino.velocityY = gameRef.current.dino.jumpPower;
          gameRef.current.dino.grounded = false;
          setIsJumping(true);
        }
      }
      
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        if (gameRef.current && gameRef.current.dino.grounded && !gameRef.current.gameOver) {
          gameRef.current.dino.ducking = true;
          gameRef.current.dino.height = gameRef.current.dino.duckHeight;
          setIsDucking(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
      
      if (e.code === 'ArrowDown') {
        if (gameRef.current) {
          gameRef.current.dino.ducking = false;
          gameRef.current.dino.height = gameRef.current.dino.normalHeight;
          setIsDucking(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;

    const game = initializeGame();
    if (!game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = () => {
      if (game.gameOver) {
        setGameOver(true);
        setIsPlaying(false);
        if (game.score > highScore) {
          setHighScore(game.score);
        }
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update score
      game.score += 0.1;
      
      // Increase speed over time
      game.gameSpeed = Math.min(3 + game.score * 0.005, 8);

      // Update dinosaur physics
      if (!game.dino.grounded) {
        game.dino.velocityY += game.dino.gravity;
        game.dino.y += game.dino.velocityY;
      }

      // Ground collision
      const groundY = canvas.height - 20 - game.dino.height;
      if (game.dino.y >= groundY) {
        game.dino.y = groundY;
        game.dino.velocityY = 0;
        game.dino.grounded = true;
        setIsJumping(false);
      }

      // Spawn obstacles
      game.spawnTimer++;
      if (game.spawnTimer >= game.spawnDelay && game.lastObstacleX < canvas.width - 200) {
        const obstacleType = Math.random() < 0.7 ? 'cactus' : 'bird';
        const obstacle = {
          x: canvas.width,
          y: obstacleType === 'cactus' ? canvas.height - 35 : canvas.height - 70,
          width: obstacleType === 'cactus' ? 12 : 20,
          height: obstacleType === 'cactus' ? 25 : 15,
          type: obstacleType
        };
        game.obstacles.push(obstacle);
        game.spawnTimer = 0;
        game.spawnDelay = Math.max(60, 120 - game.score * 0.5); // Decrease spawn delay over time
        game.lastObstacleX = obstacle.x;
      }

      // Update obstacles
      game.obstacles.forEach((obstacle, index) => {
        obstacle.x -= game.gameSpeed;
        if (obstacle.x + obstacle.width < 0) {
          game.obstacles.splice(index, 1);
        }
      });

      // Update last obstacle position
      if (game.obstacles.length > 0) {
        game.lastObstacleX = Math.max(...game.obstacles.map(o => o.x));
      } else {
        game.lastObstacleX = 0;
      }

      // Update clouds
      game.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
          cloud.x = canvas.width + Math.random() * 100;
          cloud.y = 20 + Math.random() * 40;
        }
      });

      // Collision detection
      const dinoRect = {
        x: game.dino.x + 2,
        y: game.dino.y + 2,
        width: game.dino.width - 4,
        height: game.dino.height - 4
      };

      game.obstacles.forEach(obstacle => {
        if (
          dinoRect.x < obstacle.x + obstacle.width &&
          dinoRect.x + dinoRect.width > obstacle.x &&
          dinoRect.y < obstacle.y + obstacle.height &&
          dinoRect.y + dinoRect.height > obstacle.y
        ) {
          game.gameOver = true;
        }
      });

      // Draw sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      ctx.fillStyle = '#FFFFFF';
      game.clouds.forEach(cloud => {
        ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
        ctx.fillRect(cloud.x + 5, cloud.y - 3, cloud.width - 10, cloud.height + 6);
        ctx.fillRect(cloud.x + 8, cloud.y - 5, cloud.width - 16, cloud.height + 10);
      });

      // Draw ground
      ctx.fillStyle = '#654321';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      
      // Ground pattern
      ctx.fillStyle = '#8B4513';
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.fillRect(i - (game.score * game.gameSpeed) % 20, canvas.height - 20, 10, 2);
      }

      // Draw dinosaur
      const dinoColor = game.dino.ducking ? '#228B22' : '#32CD32';
      ctx.fillStyle = dinoColor;
      
      if (game.dino.ducking) {
        // Ducking dino (more horizontal)
        ctx.fillRect(game.dino.x, game.dino.y + 8, game.dino.width, game.dino.height);
        ctx.fillRect(game.dino.x + game.dino.width, game.dino.y + 12, 8, 10);
      } else {
        // Standing/jumping dino
        ctx.fillRect(game.dino.x, game.dino.y, game.dino.width, game.dino.height);
        ctx.fillRect(game.dino.x + game.dino.width, game.dino.y + 8, 6, 12);
      }
      
      // Dino eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(game.dino.x + 18, game.dino.y + 4, 2, 2);
      
      // Dino legs (simple animation)
      if (game.dino.grounded && Math.floor(game.score * 10) % 20 < 10) {
        ctx.fillStyle = dinoColor;
        ctx.fillRect(game.dino.x + 4, game.dino.y + game.dino.height, 4, 6);
        ctx.fillRect(game.dino.x + 16, game.dino.y + game.dino.height + 2, 4, 4);
      } else if (game.dino.grounded) {
        ctx.fillStyle = dinoColor;
        ctx.fillRect(game.dino.x + 4, game.dino.y + game.dino.height + 2, 4, 4);
        ctx.fillRect(game.dino.x + 16, game.dino.y + game.dino.height, 4, 6);
      }

      // Draw obstacles
      game.obstacles.forEach(obstacle => {
        if (obstacle.type === 'cactus') {
          ctx.fillStyle = '#228B22';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.fillRect(obstacle.x + 4, obstacle.y - 8, 4, 12);
        } else { // bird
          ctx.fillStyle = '#4B4B4D';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.fillRect(obstacle.x + 5, obstacle.y - 2, 10, 4);
          // Wing animation
          if (Math.floor(game.score * 20) % 10 < 5) {
            ctx.fillRect(obstacle.x - 2, obstacle.y + 2, 8, 3);
            ctx.fillRect(obstacle.x + 14, obstacle.y + 2, 8, 3);
          } else {
            ctx.fillRect(obstacle.x - 2, obstacle.y + 8, 8, 3);
            ctx.fillRect(obstacle.x + 14, obstacle.y + 8, 8, 3);
          }
        }
      });

      setScore(Math.floor(game.score));
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, highScore]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setIsJumping(false);
    setIsDucking(false);
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setIsJumping(false);
    setIsDucking(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
               Try Getting a High Score 
            </h3>
            <p className="text-base sm:text-lg text-gray-600 italic font-medium">
              While i reply to your email 
            </p>
            <div className="absolute -top-2 -left-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute -bottom-1 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            {isVisible ? 'Hide Game' : 'Play Game'}
          </button>
        </div>

        {isVisible && (
          <div className="bg-gray-50 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                <div className="flex items-center space-x-1">
                  <Trophy className="text-green-500" size={14} />
                  <span className="font-medium text-gray-700">High: {highScore}</span>
                </div>
                <div className="text-blue-600 font-medium">Score: {score}</div>
              </div>
              <div className="flex space-x-2">
                {!isPlaying && !gameOver && (
                  <button
                    onClick={startGame}
                    className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                  >
                    <Play size={12} />
                    <span>Start</span>
                  </button>
                )}
                {gameOver && (
                  <button
                    onClick={startGame}
                    className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                  >
                    <Play size={12} />
                    <span>Play Again</span>
                  </button>
                )}
                <button
                  onClick={resetGame}
                  className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-300 relative">
              <canvas
                ref={canvasRef}
                className="w-full max-w-none border border-gray-600 rounded touch-none"
                style={{ imageRendering: 'pixelated', maxHeight: '200px', height: '200px' }}
              />
              
              {/* Touch Control Overlay for Mobile */}
              <div className="absolute inset-0 pointer-events-none md:hidden">
                {/* Upper half - Jump */}
                <div className="absolute left-0 top-0 w-full h-3/5 bg-blue-500 opacity-5 flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-sm pointer-events-auto">JUMP</span>
                </div>
                {/* Lower half - Duck */}
                <div className="absolute left-0 bottom-0 w-full h-2/5 bg-orange-500 opacity-5 flex items-center justify-center">
                  <span className="text-orange-700 font-semibold text-sm pointer-events-auto">DUCK</span>
                </div>
              </div>
              
              <div className="text-center mt-2 text-gray-400 text-xs">
                <span className="hidden md:inline">SPACE/↑: Jump • ↓: Duck • </span>
                <span className="md:hidden">Touch Upper: Jump • Touch Lower: Duck • </span>
                Avoid obstacles!
              </div>
            </div>

            {gameOver && (
              <div className="text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-1">Game Over!</h4>
                <p className="text-red-600 text-xs sm:text-sm">Final Score: {score}</p>
                {score > highScore && (
                  <p className="text-green-500 font-medium text-xs sm:text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DinosaurGame;
