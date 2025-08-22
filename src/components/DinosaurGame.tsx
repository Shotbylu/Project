import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export default function SpaceInvadersGame() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameStateRef = useRef(null);
  const animationRef = useRef(null);
  const keysRef = useRef({});
  const touchControlsRef = useRef({ left: false, right: false, shoot: false });
  const gameLoopActiveRef = useRef(false);

  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    return true;
  }, []);

  // Initialize game state
  const initializeGame = useCallback(() => {
    if (!initCanvas()) return;

    const game = {
      player: {
        x: GAME_WIDTH / 2 - 15,
        y: GAME_HEIGHT - 60,
        width: 30,
        height: 20,
        speed: 6,
      },
      bullets: [],
      aliens: [],
      alienBullets: [],
      alienDirection: 1,
      alienSpeed: 1 + (level - 1) * 0.3,
      alienDropDistance: 20,
      lastBulletTime: 0,
      bulletDelay: 150,
      lastAlienBulletTime: 0,
      alienBulletDelay: Math.max(300, 1000 - (level - 1) * 100),
      currentScore: score,
    };

    // Create alien grid
    const rows = 5;
    const cols = 10;
    const alienWidth = 30;
    const alienHeight = 20;
    const spacing = 10;
    const gridWidth = cols * (alienWidth + spacing) - spacing;
    const startX = (GAME_WIDTH - gridWidth) / 2;
    const startY = 80;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        game.aliens.push({
          x: startX + col * (alienWidth + spacing),
          y: startY + row * (alienHeight + spacing),
          width: alienWidth,
          height: alienHeight,
          type: row === 0 ? 'small' : row < 3 ? 'medium' : 'large',
          points: row === 0 ? 30 : row < 3 ? 20 : 10,
          alive: true
        });
      }
    }

    gameStateRef.current = game;
  }, [level, score, initCanvas]);

  // Draw game objects
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const game = gameStateRef.current;
    if (!canvas || !game) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw stars background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % GAME_WIDTH;
      const y = (i * 71) % GAME_HEIGHT;
      if (Math.sin(i) > 0.8) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Draw player
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    ctx.fillRect(game.player.x + 10, game.player.y - 8, 10, 8);

    // Draw player bullets
    ctx.fillStyle = '#ffff00';
    game.bullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw aliens
    game.aliens.forEach(alien => {
      if (!alien.alive) return;
      
      ctx.fillStyle = alien.type === 'small' ? '#ff0000' : 
                     alien.type === 'medium' ? '#ff8800' : '#ffaa00';
      ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
      
      // Add eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(alien.x + 6, alien.y + 5, 3, 3);
      ctx.fillRect(alien.x + alien.width - 9, alien.y + 5, 3, 3);
    });

    // Draw alien bullets
    ctx.fillStyle = '#ff0000';
    game.alienBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
  }, []);

  // Game update logic
  const update = useCallback(() => {
    const game = gameStateRef.current;
    if (!game || gameOver || gameWon || !isPlaying) return;

    const moveLeft = keysRef.current['ArrowLeft'] || keysRef.current['KeyA'] || touchControlsRef.current.left;
    const moveRight = keysRef.current['ArrowRight'] || keysRef.current['KeyD'] || touchControlsRef.current.right;
    const shoot = keysRef.current['Space'] || keysRef.current['KeyW'] || touchControlsRef.current.shoot;

    // Move player
    if (moveLeft && game.player.x > 0) {
      game.player.x -= game.player.speed;
    }
    if (moveRight && game.player.x < GAME_WIDTH - game.player.width) {
      game.player.x += game.player.speed;
    }

    // Player shooting
    if (shoot && Date.now() - game.lastBulletTime > game.bulletDelay) {
      game.bullets.push({
        x: game.player.x + game.player.width / 2 - 2,
        y: game.player.y,
        width: 4,
        height: 10,
        speed: 8
      });
      game.lastBulletTime = Date.now();
    }

    // Update bullets
    game.bullets = game.bullets.filter(bullet => {
      bullet.y -= bullet.speed;
      return bullet.y > -bullet.height;
    });

    // Move aliens
    let hitEdge = false;
    const liveAliens = game.aliens.filter(a => a.alive);
    
    liveAliens.forEach(alien => {
      alien.x += game.alienDirection * game.alienSpeed;
      if (alien.x <= 0 || alien.x >= GAME_WIDTH - alien.width) {
        hitEdge = true;
      }
    });

    if (hitEdge) {
      game.alienDirection *= -1;
      game.aliens.forEach(alien => {
        if (alien.alive) {
          alien.y += game.alienDropDistance;
        }
      });
    }

    // Check if aliens reached player
    const lowestAlienY = Math.max(...liveAliens.map(a => a.y + a.height));
    if (lowestAlienY > game.player.y) {
      setLives(0);
      return;
    }

    // Alien shooting
    if (liveAliens.length > 0 && Date.now() - game.lastAlienBulletTime > game.alienBulletDelay) {
      const shooter = liveAliens[Math.floor(Math.random() * liveAliens.length)];
      game.alienBullets.push({
        x: shooter.x + shooter.width / 2 - 2,
        y: shooter.y + shooter.height,
        width: 4,
        height: 8,
        speed: 3 + level * 0.5
      });
      game.lastAlienBulletTime = Date.now();
    }

    // Update alien bullets
    game.alienBullets = game.alienBullets.filter(bullet => {
      bullet.y += bullet.speed;
      return bullet.y < GAME_HEIGHT;
    });

    // Collision detection - bullets vs aliens
    for (let i = game.bullets.length - 1; i >= 0; i--) {
      const bullet = game.bullets[i];
      let bulletHit = false;
      
      for (let j = game.aliens.length - 1; j >= 0; j--) {
        const alien = game.aliens[j];
        if (!alien.alive) continue;
        
        // Check if bullet overlaps with alien
        if (bullet.x + bullet.width > alien.x &&
            bullet.x < alien.x + alien.width &&
            bullet.y + bullet.height > alien.y &&
            bullet.y < alien.y + alien.height) {
          
          // Hit! Remove alien and bullet
          alien.alive = false;
          game.currentScore += alien.points;
          bulletHit = true;
          break;
        }
      }
      
      // Remove bullet if it hit an alien
      if (bulletHit) {
        game.bullets.splice(i, 1);
      }
    }

    // Collision detection - alien bullets vs player
    for (let i = game.alienBullets.length - 1; i >= 0; i--) {
      const bullet = game.alienBullets[i];
      if (bullet.x < game.player.x + game.player.width &&
          bullet.x + bullet.width > game.player.x &&
          bullet.y < game.player.y + game.player.height &&
          bullet.y + bullet.height > game.player.y) {
        
        game.alienBullets.splice(i, 1);
        setLives(prev => prev - 1);
        break;
      }
    }

    // Update score
    setScore(game.currentScore);

    // Check win condition
    if (liveAliens.length === 0) {
      setGameWon(true);
      setIsPlaying(false);
      if (game.currentScore > highScore) {
        setHighScore(game.currentScore);
      }
    }
  }, [level, highScore, gameOver, gameWon, isPlaying]);

  // Main game loop
  const gameLoop = useCallback(() => {
    if (!gameLoopActiveRef.current || !gameStateRef.current || !isPlaying) return;

    update();
    draw();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [update, draw, isPlaying]);

  // Start game effect
  useEffect(() => {
    if (isPlaying && !gameOver && !gameWon) {
      initializeGame();
      gameLoopActiveRef.current = true;
      // Small delay to ensure initialization is complete
      setTimeout(() => {
        if (gameLoopActiveRef.current) {
          animationRef.current = requestAnimationFrame(gameLoop);
        }
      }, 50);
    } else {
      gameLoopActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      gameLoopActiveRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameOver, gameWon, initializeGame, gameLoop]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
      gameLoopActiveRef.current = false;
      
      if (score > highScore) {
        setHighScore(score);
      }
    }
  }, [lives, isPlaying, score, highScore]);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    
    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls
  const handleTouchStart = (control) => (e) => {
    e.preventDefault();
    touchControlsRef.current[control] = true;
  };

  const handleTouchEnd = (control) => (e) => {
    e.preventDefault();
    touchControlsRef.current[control] = false;
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameWon(false);
    setIsPlaying(true);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(false);
    gameLoopActiveRef.current = false;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            🚀 Space Invaders 🚀
          </h3>
          <p className="text-base sm:text-lg text-gray-600 italic font-medium">
            Defend Earth from the alien invasion!
          </p>
          <button 
            onClick={() => setIsVisible(v => !v)} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base mt-3"
          >
            {isVisible ? 'Hide Game' : 'Play Game'}
          </button>
        </div>

        {isVisible && (
          <div className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-700 relative">
            {/* Game Stats */}
            <div className="flex flex-wrap justify-between items-center mb-4 text-sm">
              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center space-x-1">
                  <Trophy className="text-yellow-400" size={16} />
                  <span>High: {highScore}</span>
                </div>
                <div className="text-green-400">Score: {score}</div>
                <div className="text-blue-400">Level: {level}</div>
                <div className="text-red-400">Lives: {lives}</div>
              </div>
              
              <div className="flex space-x-2">
                {!isPlaying && !gameOver && !gameWon && (
                  <button 
                    onClick={startGame} 
                    className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    <Play size={14} />
                    <span>Start</span>
                  </button>
                )}
                {gameWon && (
                  <button 
                    onClick={nextLevel} 
                    className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    <span>Next Level</span>
                  </button>
                )}
                <button 
                  onClick={resetGame} 
                  className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="relative bg-black rounded border-2 border-gray-600" ref={containerRef}>
              <canvas 
                ref={canvasRef}
                className="block mx-auto max-w-full h-auto"
                style={{ 
                  imageRendering: 'pixelated',
                  aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}`
                }}
              />

              {/* Mobile Controls */}
              <div className="md:hidden absolute bottom-4 left-0 right-0 px-4">
                <div className="flex justify-between items-end">
                  <div className="flex gap-3">
                    <button
                      onTouchStart={handleTouchStart('left')}
                      onTouchEnd={handleTouchEnd('left')}
                      onMouseDown={handleTouchStart('left')}
                      onMouseUp={handleTouchEnd('left')}
                      onMouseLeave={handleTouchEnd('left')}
                      className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold select-none"
                    >
                      ◀
                    </button>
                    <button
                      onTouchStart={handleTouchStart('right')}
                      onTouchEnd={handleTouchEnd('right')}
                      onMouseDown={handleTouchStart('right')}
                      onMouseUp={handleTouchEnd('right')}
                      onMouseLeave={handleTouchEnd('right')}
                      className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold select-none"
                    >
                      ▶
                    </button>
                  </div>
                  <button
                    onTouchStart={handleTouchStart('shoot')}
                    onTouchEnd={handleTouchEnd('shoot')}
                    onMouseDown={handleTouchStart('shoot')}
                    onMouseUp={handleTouchEnd('shoot')}
                    onMouseLeave={handleTouchEnd('shoot')}
                    className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs select-none"
                  >
                    FIRE
                  </button>
                </div>
              </div>
            </div>

            {/* Controls Info */}
            <div className="text-center mt-3 text-gray-400 text-xs">
              <span className="hidden md:inline">Arrow Keys or WASD: Move • SPACE or W: Shoot</span>
              <span className="md:hidden">Use touch controls to play</span>
            </div>

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg z-10">
                <div className="text-center text-white p-6">
                  <h2 className="text-2xl font-bold mb-2 text-red-400">Game Over!</h2>
                  <p className="mb-4">Final Score: {score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-yellow-400 font-bold mb-4">🎉 New High Score!</p>
                  )}
                  <button 
                    onClick={startGame}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {/* Level Complete Screen */}
            {gameWon && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg z-10">
                <div className="text-center text-white p-6">
                  <h2 className="text-2xl font-bold mb-2 text-green-400">Level Complete!</h2>
                  <p className="mb-4">Score: {score}</p>
                  {score >= highScore && (
                    <p className="text-yellow-400 font-bold mb-4">🎉 New High Score!</p>
                  )}
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={nextLevel}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Next Level
                    </button>
                    <button 
                      onClick={resetGame}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Main Menu
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
