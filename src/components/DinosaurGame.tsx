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
  const [isPaused, setIsPaused] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameLoopRef = useRef(null);
  const gameStateRef = useRef(null);
  const keysRef = useRef(new Set());
  const touchStateRef = useRef({
    left: false,
    right: false,
    shoot: false,
    moving: false,
    lastMoveX: 0
  });

  // Game constants
  const GAME_CONFIG = {
    PLAYER_SPEED: 6,
    BULLET_SPEED: 10,
    ALIEN_BULLET_SPEED: 4,
    BULLET_COOLDOWN: 150,
    ALIEN_SHOOT_CHANCE: 0.008,
    STARS_COUNT: 50,
    CANVAS_ASPECT_RATIO: 1.5,
    MIN_HEIGHT: 300,
    MAX_HEIGHT: 600
  };

  // Initialize game state
  const createGameState = useCallback((canvasWidth, canvasHeight) => {
    const playerWidth = 30;
    const playerHeight = 20;
    
    const gameState = {
      canvas: { width: canvasWidth, height: canvasHeight },
      player: {
        x: canvasWidth / 2 - playerWidth / 2,
        y: canvasHeight - 50,
        width: playerWidth,
        height: playerHeight,
        speed: GAME_CONFIG.PLAYER_SPEED
      },
      bullets: [],
      aliens: [],
      alienBullets: [],
      alienDirection: 1,
      alienSpeed: 0.5 + (level - 1) * 0.15,
      alienDropDistance: 20,
      lastBulletTime: 0,
      lastAlienShoot: 0,
      score: 0,
      level: level,
      gameOver: false,
      gameWon: false,
      stars: []
    };

    // Generate stars
    for (let i = 0; i < GAME_CONFIG.STARS_COUNT; i++) {
      gameState.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 2 + 1,
        brightness: Math.random() * 0.5 + 0.3
      });
    }

    // Create alien formation
    const createAliens = () => {
      const rows = 5;
      const cols = 10;
      const alienWidth = Math.max(20, Math.min(25, canvasWidth / (cols + 2)));
      const alienHeight = alienWidth * 0.8;
      const spacing = Math.max(6, alienWidth * 0.3);
      
      const gridWidth = cols * (alienWidth + spacing) - spacing;
      const startX = (canvasWidth - gridWidth) / 2;
      const startY = 60;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const alienType = row === 0 ? 'boss' : row < 2 ? 'medium' : 'small';
          const points = alienType === 'boss' ? 50 : alienType === 'medium' ? 25 : 10;
          
          gameState.aliens.push({
            x: startX + col * (alienWidth + spacing),
            y: startY + row * (alienHeight + spacing),
            width: alienWidth,
            height: alienHeight,
            type: alienType,
            points: points,
            animFrame: Math.floor(Math.random() * 2)
          });
        }
      }
    };

    createAliens();
    return gameState;
  }, [level]);

  // Canvas setup and resize handling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;

    const containerRect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate responsive dimensions
    const maxWidth = Math.min(containerRect.width - 32, 800);
    const calculatedHeight = maxWidth / GAME_CONFIG.CANVAS_ASPECT_RATIO;
    const finalHeight = Math.max(GAME_CONFIG.MIN_HEIGHT, Math.min(calculatedHeight, GAME_CONFIG.MAX_HEIGHT));
    const finalWidth = finalHeight * GAME_CONFIG.CANVAS_ASPECT_RATIO;

    // Set canvas size
    canvas.style.width = `${finalWidth}px`;
    canvas.style.height = `${finalHeight}px`;
    canvas.width = finalWidth * dpr;
    canvas.height = finalHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    return { ctx, width: finalWidth, height: finalHeight };
  }, []);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
        e.preventDefault();
        keysRef.current.add(e.code);
      }
      if (e.code === 'KeyP' && isPlaying) {
        setIsPaused(prev => !prev);
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current.delete(e.code);
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        setIsPaused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDragging = false;
    let dragStartX = 0;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      isDragging = true;
      dragStartX = x;
      touchStateRef.current.moving = true;
      touchStateRef.current.lastMoveX = x;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isDragging || !gameStateRef.current) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      
      // Direct position update for smooth movement
      const playerHalfWidth = gameStateRef.current.player.width / 2;
      const newX = Math.max(0, Math.min(x - playerHalfWidth, rect.width - gameStateRef.current.player.width));
      gameStateRef.current.player.x = newX;
      
      touchStateRef.current.lastMoveX = x;
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      isDragging = false;
      touchStateRef.current.moving = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Button touch handlers
  const createTouchHandler = (action, isDown) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    touchStateRef.current[action] = isDown;
  };

  // Draw functions
  const drawBackground = (ctx, width, height, stars) => {
    // Clear and fill background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw animated stars
    ctx.fillStyle = '#ffffff';
    stars.forEach((star, index) => {
      const flicker = Math.sin(Date.now() * 0.003 + index) * 0.2 + 0.8;
      ctx.globalAlpha = star.brightness * flicker;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1;
  };

  const drawPlayer = (ctx, player) => {
    // Player body
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player cannon
    const cannonWidth = 4;
    const cannonHeight = 8;
    ctx.fillRect(
      player.x + player.width / 2 - cannonWidth / 2,
      player.y - cannonHeight,
      cannonWidth,
      cannonHeight
    );
    
    // Player details
    ctx.fillStyle = '#6bb3ff';
    ctx.fillRect(player.x + 2, player.y + 2, player.width - 4, 4);
  };

  const drawAlien = (ctx, alien, animFrame) => {
    let color;
    switch (alien.type) {
      case 'boss':
        color = '#ff4757';
        break;
      case 'medium':
        color = '#ff6348';
        break;
      default:
        color = '#ffa726';
    }
    
    ctx.fillStyle = color;
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
    
    // Alien eyes with animation
    ctx.fillStyle = '#000000';
    const eyeOffset = animFrame ? 1 : 0;
    const eyeSize = Math.max(2, alien.width * 0.12);
    ctx.fillRect(alien.x + 3 + eyeOffset, alien.y + 3, eyeSize, eyeSize);
    ctx.fillRect(alien.x + alien.width - 3 - eyeSize - eyeOffset, alien.y + 3, eyeSize, eyeSize);
    
    // Alien details
    if (alien.type === 'boss') {
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(alien.x + 2, alien.y + alien.height - 4, alien.width - 4, 2);
    }
  };

  const drawBullet = (ctx, bullet, color = '#ff6b35') => {
    ctx.fillStyle = color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    
    // Add glow effect
    ctx.shadowBlur = 3;
    ctx.shadowColor = color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.shadowBlur = 0;
  };

  // Game logic
  const updateGame = (gameState, deltaTime) => {
    if (!gameState || gameState.gameOver || gameState.gameWon) return;

    const { player, bullets, aliens, alienBullets, canvas } = gameState;
    const currentTime = performance.now();

    // Handle input
    const moveLeft = keysRef.current.has('ArrowLeft') || keysRef.current.has('KeyA') || touchStateRef.current.left;
    const moveRight = keysRef.current.has('ArrowRight') || keysRef.current.has('KeyD') || touchStateRef.current.right;
    const shoot = keysRef.current.has('Space') || touchStateRef.current.shoot;

    // Update player movement (if not using touch drag)
    if (!touchStateRef.current.moving) {
      if (moveLeft) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if (moveRight) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      }
    }

    // Player shooting
    if (shoot && currentTime - gameState.lastBulletTime > GAME_CONFIG.BULLET_COOLDOWN) {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: GAME_CONFIG.BULLET_SPEED
      });
      gameState.lastBulletTime = currentTime;
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed;
      if (bullets[i].y + bullets[i].height < 0) {
        bullets.splice(i, 1);
      }
    }

    // Update aliens
    let shouldChangeDirection = false;
    let lowestAlienY = 0;
    
    aliens.forEach(alien => {
      alien.x += gameState.alienDirection * gameState.alienSpeed;
      alien.animFrame = Math.floor(currentTime / 500) % 2;
      
      if (alien.x <= 0 || alien.x + alien.width >= canvas.width) {
        shouldChangeDirection = true;
      }
      lowestAlienY = Math.max(lowestAlienY, alien.y + alien.height);
    });

    if (shouldChangeDirection) {
      gameState.alienDirection *= -1;
      aliens.forEach(alien => {
        alien.y += gameState.alienDropDistance;
      });
    }

    // Check if aliens reached player
    if (lowestAlienY >= player.y) {
      gameState.gameOver = true;
      return;
    }

    // Alien shooting
    if (aliens.length > 0 && Math.random() < GAME_CONFIG.ALIEN_SHOOT_CHANCE + level * 0.001) {
      const shooter = aliens[Math.floor(Math.random() * aliens.length)];
      alienBullets.push({
        x: shooter.x + shooter.width / 2 - 2,
        y: shooter.y + shooter.height,
        width: 4,
        height: 8,
        speed: GAME_CONFIG.ALIEN_BULLET_SPEED + level * 0.2
      });
    }

    // Update alien bullets
    for (let i = alienBullets.length - 1; i >= 0; i--) {
      alienBullets[i].y += alienBullets[i].speed;
      if (alienBullets[i].y > canvas.height) {
        alienBullets.splice(i, 1);
      }
    }

    // Collision detection: player bullets vs aliens
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      for (let j = aliens.length - 1; j >= 0; j--) {
        const alien = aliens[j];
        if (bullet.x < alien.x + alien.width &&
            bullet.x + bullet.width > alien.x &&
            bullet.y < alien.y + alien.height &&
            bullet.y + bullet.height > alien.y) {
          bullets.splice(i, 1);
          gameState.score += alien.points;
          aliens.splice(j, 1);
          break;
        }
      }
    }

    // Collision detection: alien bullets vs player
    for (let i = alienBullets.length - 1; i >= 0; i--) {
      const bullet = alienBullets[i];
      if (bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y) {
        alienBullets.splice(i, 1);
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            gameState.gameOver = true;
          }
          return newLives;
        });
        break;
      }
    }

    // Check win condition
    if (aliens.length === 0) {
      gameState.gameWon = true;
    }

    // Update score state
    setScore(gameState.score);
  };

  // Main game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const canvasSetup = setupCanvas();
    if (!canvasSetup) return;

    const { ctx, width, height } = canvasSetup;
    const gameState = createGameState(width, height);
    gameStateRef.current = gameState;

    let lastTime = performance.now();
    let animationId;

    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (gameState.gameOver) {
        setGameOver(true);
        setIsPlaying(false);
        if (gameState.score > highScore) {
          setHighScore(gameState.score);
        }
        return;
      }

      if (gameState.gameWon) {
        setGameWon(true);
        setIsPlaying(false);
        if (gameState.score > highScore) {
          setHighScore(gameState.score);
        }
        return;
      }

      updateGame(gameState, deltaTime);

      // Render
      drawBackground(ctx, width, height, gameState.stars);
      drawPlayer(ctx, gameState.player);
      
      gameState.aliens.forEach(alien => drawAlien(ctx, alien, alien.animFrame));
      gameState.bullets.forEach(bullet => drawBullet(ctx, bullet, '#00ff88'));
      gameState.alienBullets.forEach(bullet => drawBullet(ctx, bullet, '#ff4757'));

      if (!isPaused) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = animationId = requestAnimationFrame(gameLoop);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying, isPaused, createGameState, setupCanvas, level, highScore]);

  // Draw static state when not playing
  useEffect(() => {
    if (isPlaying || !isVisible) return;

    const canvasSetup = setupCanvas();
    if (!canvasSetup) return;

    const { ctx, width, height } = canvasSetup;
    const staticState = createGameState(width, height);

    drawBackground(ctx, width, height, staticState.stars);
    drawPlayer(ctx, staticState.player);
    staticState.aliens.forEach(alien => drawAlien(ctx, alien, 0));
  }, [isVisible, isPlaying, setupCanvas, createGameState]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (isVisible) {
        setTimeout(setupCanvas, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible, setupCanvas]);

  // Game control functions
  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setIsPlaying(true);
    touchStateRef.current = { left: false, right: false, shoot: false, moving: false, lastMoveX: 0 };
    keysRef.current.clear();
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameWon(false);
    setIsPaused(false);
    setIsPlaying(true);
    touchStateRef.current = { left: false, right: false, shoot: false, moving: false, lastMoveX: 0 };
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setIsPlaying(false);
    touchStateRef.current = { left: false, right: false, shoot: false, moving: false, lastMoveX: 0 };
    keysRef.current.clear();
  };

  const togglePause = () => {
    if (isPlaying) {
      setIsPaused(prev => !prev);
    }
  };

  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              🚀 Space Invaders 🚀
            </h3>
            <p className="text-base sm:text-lg text-gray-600 italic font-medium">
              Try getting a high score while I reply to your email ✉️
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(v => !v)} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base mt-3"
          >
            {isVisible ? 'Hide Game' : 'Play Game'}
          </button>
        </div>

        {isVisible && (
          <div className="bg-gray-50 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                <div className="flex items-center space-x-1">
                  <Trophy className="text-orange-500" size={14} />
                  <span className="font-medium text-gray-700">High: {highScore}</span>
                </div>
                <div className="text-blue-600 font-medium">Score: {score}</div>
                <div className="text-gray-600">Level: {level}</div>
                <div className="text-red-500">Lives: {lives}</div>
              </div>
              
              <div className="flex space-x-2">
                {!isPlaying && !gameOver && !gameWon && (
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
                {gameWon && (
                  <button 
                    onClick={nextLevel} 
                    className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                  >
                    <Play size={12} />
                    <span>Next Level</span>
                  </button>
                )}
                {isPlaying && (
                  <button 
                    onClick={togglePause} 
                    className="flex items-center space-x-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                  >
                    {isPaused ? <Play size={12} /> : <span>⏸</span>}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
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

            <div className="bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-300 relative" ref={containerRef}>
              <canvas 
                ref={canvasRef} 
                className="w-full max-w-none border border-gray-600 rounded bg-gray-900 touch-none" 
                style={{ imageRendering: 'pixelated' }} 
              />

              {isPaused && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded z-20">
                  <div className="text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">⏸ PAUSED</h3>
                    <p className="text-sm opacity-80">Press P or click Resume to continue</p>
                  </div>
                </div>
              )}

              <div className="text-center mt-2 text-gray-400 text-xs">
                <span className="hidden md:inline">
                  Arrow Keys / WASD: Move • SPACE: Shoot • P: Pause • Drag canvas to move player
                </span>
                <span className="md:hidden">
                  Drag canvas to move • Use touch controls below • Tap FIRE to shoot
                </span>
              </div>
            </div>

            <div className="md:hidden mt-3 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <button 
                  onTouchStart={createTouchHandler('left', true)}
                  onTouchEnd={createTouchHandler('left', false)}
                  onTouchCancel={createTouchHandler('left', false)}
                  className="w-14 h-14 rounded-lg bg-blue-500/90 backdrop-blur-sm border border-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-lg active:scale-95 transition-transform touch-manipulation"
                >
                  ◀
                </button>
                <button 
                  onTouchStart={createTouchHandler('right', true)}
                  onTouchEnd={createTouchHandler('right', false)}
                  onTouchCancel={createTouchHandler('right', false)}
                  className="w-14 h-14 rounded-lg bg-blue-500/90 backdrop-blur-sm border border-blue-400 flex items-center justify-center text-white text-xl font-bold shadow-lg active:scale-95 transition-transform touch-manipulation"
                >
                  ▶
                </button>
              </div>

              <div>
                <button 
                  onTouchStart={createTouchHandler('shoot', true)}
                  onTouchEnd={createTouchHandler('shoot', false)}
                  onTouchCancel={createTouchHandler('shoot', false)}
                  className="w-16 h-16 rounded-full bg-red-500/90 backdrop-blur-sm border-2 border-red-400 text-white flex items-center justify-center font-bold shadow-lg active:scale-95 transition-transform text-xs touch-manipulation"
                >
                  FIRE
                </button>
              </div>
            </div>

            {gameOver && (
              <div className="text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-1">Game Over!</h4>
                <p className="text-red-600 text-xs sm:text-sm">Final Score: {score} | Level Reached: {level}</p>
                {score > highScore && (
                  <p className="text-orange-500 font-medium text-xs sm:text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}

            {gameWon && (
              <div className="text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-base sm:text-lg font-semibold text-green-700 mb-1">Level Complete! 🚀</h4>
                <p className="text-green-600 text-xs sm:text-sm">Score: {score} | Ready for Level {level + 1}?</p>
                {score > highScore && (
                  <p className="text-orange-500 font-medium text-xs sm:text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
