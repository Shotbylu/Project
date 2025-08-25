import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export default function SpaceInvadersGame() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    // Initialize from memory instead of localStorage
    return 0;
  });
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
  const lastFrameTimeRef = useRef(0);
  const highScoreMemoryRef = useRef(0);
  
  // Separate touch state for better control
  const touchStateRef = useRef({
    left: false,
    right: false,
    shoot: false,
    dragging: false,
    lastX: 0
  });

  // Game constants
  const GAME_CONFIG = {
    PLAYER_SPEED: 5,
    BULLET_SPEED: 8,
    ALIEN_BULLET_SPEED: 3,
    BULLET_COOLDOWN: 200,
    ALIEN_SHOOT_CHANCE: 0.005,
    STARS_COUNT: 40,
    CANVAS_ASPECT_RATIO: 1.4,
    MIN_HEIGHT: 320,
    MAX_HEIGHT: 600
  };

  // Initialize game state
  const createGameState = useCallback((canvasWidth, canvasHeight) => {
    const playerWidth = Math.max(25, Math.min(35, canvasWidth / 20));
    const playerHeight = playerWidth * 0.7;
    
    const gameState = {
      canvas: { width: canvasWidth, height: canvasHeight },
      player: {
        x: canvasWidth / 2 - playerWidth / 2,
        y: canvasHeight - 60,
        width: playerWidth,
        height: playerHeight,
        speed: GAME_CONFIG.PLAYER_SPEED
      },
      bullets: [],
      aliens: [],
      alienBullets: [],
      alienDirection: 1,
      alienSpeed: 0.8 + (level - 1) * 0.2,
      alienDropDistance: 15,
      lastBulletTime: 0,
      lastAlienShoot: 0,
      animationFrame: 0,
      stars: []
    };

    // Generate stars with better distribution
    for (let i = 0; i < GAME_CONFIG.STARS_COUNT; i++) {
      gameState.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.6 + 0.4,
        twinkle: Math.random() * 0.02 + 0.01
      });
    }

    // Create alien formation with better scaling
    const createAliens = () => {
      const rows = 5;
      const cols = 10;
      const alienWidth = Math.max(18, Math.min(28, canvasWidth / (cols + 3)));
      const alienHeight = alienWidth * 0.8;
      const spacingX = Math.max(4, alienWidth * 0.25);
      const spacingY = Math.max(4, alienHeight * 0.3);
      
      const gridWidth = cols * (alienWidth + spacingX) - spacingX;
      const startX = (canvasWidth - gridWidth) / 2;
      const startY = 50;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let alienType, points;
          if (row === 0) {
            alienType = 'boss';
            points = 50;
          } else if (row < 3) {
            alienType = 'medium';
            points = 25;
          } else {
            alienType = 'small';
            points = 10;
          }
          
          gameState.aliens.push({
            x: startX + col * (alienWidth + spacingX),
            y: startY + row * (alienHeight + spacingY),
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

  // Canvas setup with better responsiveness
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;

    const containerRect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
    
    // Calculate responsive dimensions
    const maxWidth = Math.min(containerRect.width - 20, 700);
    const calculatedHeight = maxWidth / GAME_CONFIG.CANVAS_ASPECT_RATIO;
    const finalHeight = Math.max(GAME_CONFIG.MIN_HEIGHT, Math.min(calculatedHeight, GAME_CONFIG.MAX_HEIGHT));
    const finalWidth = finalHeight * GAME_CONFIG.CANVAS_ASPECT_RATIO;

    // Set canvas display size
    canvas.style.width = `${finalWidth}px`;
    canvas.style.height = `${finalHeight}px`;
    
    // Set canvas actual size
    canvas.width = finalWidth * dpr;
    canvas.height = finalHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    return { ctx, width: finalWidth, height: finalHeight };
  }, []);

  // Improved input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      const validKeys = ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space', 'KeyP'];
      if (validKeys.includes(e.code)) {
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
      if (document.hidden && isPlaying && !isPaused) {
        setIsPaused(true);
      }
    };

    const handleBlur = () => {
      if (isPlaying && !isPaused) {
        setIsPaused(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isPlaying, isPaused]);

  // Improved touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * (gameStateRef.current?.canvas.width || rect.width);
      
      touchStateRef.current.dragging = true;
      touchStateRef.current.lastX = x;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!touchStateRef.current.dragging || !gameStateRef.current) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * gameStateRef.current.canvas.width;
      
      // Update player position directly for smooth movement
      const playerHalfWidth = gameStateRef.current.player.width / 2;
      const newX = Math.max(0, Math.min(x - playerHalfWidth, gameStateRef.current.canvas.width - gameStateRef.current.player.width));
      gameStateRef.current.player.x = newX;
      
      touchStateRef.current.lastX = x;
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      touchStateRef.current.dragging = false;
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isPlaying]);

  // Touch button handlers
  const createTouchHandler = (action, isDown) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    touchStateRef.current[action] = isDown;
  };

  // Enhanced drawing functions
  const drawBackground = (ctx, width, height, stars, time) => {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0e1a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw animated stars
    stars.forEach((star, index) => {
      const flicker = Math.sin(time * star.twinkle + index) * 0.3 + 0.7;
      ctx.globalAlpha = star.brightness * flicker;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    });
    ctx.globalAlpha = 1;
  };

  const drawPlayer = (ctx, player) => {
    // Player body with gradient
    const gradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#357abd');
    ctx.fillStyle = gradient;
    ctx.fillRect(Math.floor(player.x), Math.floor(player.y), player.width, player.height);
    
    // Player cannon
    const cannonWidth = Math.max(3, player.width * 0.12);
    const cannonHeight = Math.max(6, player.height * 0.4);
    ctx.fillStyle = '#6bb3ff';
    ctx.fillRect(
      Math.floor(player.x + player.width / 2 - cannonWidth / 2),
      Math.floor(player.y - cannonHeight),
      cannonWidth,
      cannonHeight
    );
    
    // Player highlights
    ctx.fillStyle = '#7dc3ff';
    ctx.fillRect(Math.floor(player.x + 2), Math.floor(player.y + 2), Math.max(1, player.width - 4), Math.max(1, player.height * 0.2));
  };

  const drawAlien = (ctx, alien, animFrame) => {
    let color, highlightColor;
    switch (alien.type) {
      case 'boss':
        color = '#ff4757';
        highlightColor = '#ff6b6b';
        break;
      case 'medium':
        color = '#ff6348';
        highlightColor = '#ff7f66';
        break;
      default:
        color = '#ffa726';
        highlightColor = '#ffb74d';
    }
    
    // Main alien body
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(alien.x), Math.floor(alien.y), alien.width, alien.height);
    
    // Alien eyes with animation
    ctx.fillStyle = '#000000';
    const eyeOffset = animFrame ? 1 : 0;
    const eyeSize = Math.max(2, alien.width * 0.15);
    const eyeY = alien.y + Math.max(2, alien.height * 0.2);
    
    ctx.fillRect(
      Math.floor(alien.x + Math.max(2, alien.width * 0.15) + eyeOffset), 
      Math.floor(eyeY), 
      eyeSize, 
      eyeSize
    );
    ctx.fillRect(
      Math.floor(alien.x + alien.width - Math.max(2, alien.width * 0.15) - eyeSize - eyeOffset), 
      Math.floor(eyeY), 
      eyeSize, 
      eyeSize
    );
    
    // Alien highlights
    ctx.fillStyle = highlightColor;
    ctx.fillRect(Math.floor(alien.x + 1), Math.floor(alien.y + 1), Math.max(1, alien.width - 2), Math.max(1, alien.height * 0.2));
  };

  const drawBullet = (ctx, bullet, color = '#00ff88') => {
    // Main bullet
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(bullet.x), Math.floor(bullet.y), bullet.width, bullet.height);
    
    // Bullet glow effect
    ctx.shadowBlur = 4;
    ctx.shadowColor = color;
    ctx.fillRect(Math.floor(bullet.x), Math.floor(bullet.y), bullet.width, bullet.height);
    ctx.shadowBlur = 0;
  };

  // Improved collision detection
  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  // Enhanced game logic
  const updateGame = useCallback((gameState, deltaTime, currentTime) => {
    if (!gameState || gameState.gameOver || gameState.gameWon) return;

    const { player, bullets, aliens, alienBullets, canvas } = gameState;

    // Handle input (avoid interference between touch drag and buttons)
    const moveLeft = (keysRef.current.has('ArrowLeft') || keysRef.current.has('KeyA') || touchStateRef.current.left) && !touchStateRef.current.dragging;
    const moveRight = (keysRef.current.has('ArrowRight') || keysRef.current.has('KeyD') || touchStateRef.current.right) && !touchStateRef.current.dragging;
    const shoot = keysRef.current.has('Space') || touchStateRef.current.shoot;

    // Update player movement
    if (moveLeft) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (moveRight) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }

    // Player shooting with cooldown
    if (shoot && currentTime - gameState.lastBulletTime > GAME_CONFIG.BULLET_COOLDOWN) {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y - 5,
        width: 4,
        height: 12,
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

    // Update aliens with improved movement
    let shouldChangeDirection = false;
    let lowestAlienY = 0;
    
    // Update animation frame
    gameState.animationFrame = Math.floor(currentTime / 600) % 2;
    
    aliens.forEach(alien => {
      alien.x += gameState.alienDirection * gameState.alienSpeed;
      alien.animFrame = gameState.animationFrame;
      
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
      // Increase speed slightly each direction change
      gameState.alienSpeed *= 1.02;
    }

    // Check if aliens reached player
    if (lowestAlienY >= player.y - 10) {
      gameState.gameOver = true;
      return;
    }

    // Improved alien shooting
    const shootChance = GAME_CONFIG.ALIEN_SHOOT_CHANCE + (level - 1) * 0.001;
    if (aliens.length > 0 && Math.random() < shootChance) {
      // Prefer aliens in front columns
      const frontAliens = aliens.filter(alien => {
        return !aliens.some(other => other.x === alien.x && other.y > alien.y);
      });
      
      if (frontAliens.length > 0) {
        const shooter = frontAliens[Math.floor(Math.random() * frontAliens.length)];
        alienBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 8,
          speed: GAME_CONFIG.ALIEN_BULLET_SPEED + (level - 1) * 0.3
        });
      }
    }

    // Update alien bullets
    for (let i = alienBullets.length - 1; i >= 0; i--) {
      alienBullets[i].y += alienBullets[i].speed;
      if (alienBullets[i].y > canvas.height + 10) {
        alienBullets.splice(i, 1);
      }
    }

    // Collision detection: player bullets vs aliens
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      for (let j = aliens.length - 1; j >= 0; j--) {
        const alien = aliens[j];
        if (checkCollision(bullet, alien)) {
          bullets.splice(i, 1);
          setScore(prev => prev + alien.points);
          aliens.splice(j, 1);
          break;
        }
      }
    }

    // Collision detection: alien bullets vs player
    for (let i = alienBullets.length - 1; i >= 0; i--) {
      const bullet = alienBullets[i];
      if (checkCollision(bullet, player)) {
        alienBullets.splice(i, 1);
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            gameState.gameOver = true;
          }
          return newLives;
        });
        // Brief invincibility could be added here
        break;
      }
    }

    // Check win condition
    if (aliens.length === 0) {
      gameState.gameWon = true;
    }
  }, [level]);

  // Main game loop with proper cleanup
  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const canvasSetup = setupCanvas();
    if (!canvasSetup) return;

    const { ctx, width, height } = canvasSetup;
    
    // Create new game state or preserve existing one
    if (!gameStateRef.current || gameStateRef.current.canvas.width !== width) {
      gameStateRef.current = createGameState(width, height);
      gameStateRef.current.score = score; // Preserve score
    }

    let lastTime = performance.now();

    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const gameState = gameStateRef.current;
      if (!gameState) return;

      // Handle game over
      if (gameState.gameOver) {
        setGameOver(true);
        setIsPlaying(false);
        const finalScore = Math.max(score, gameState.score || 0);
        if (finalScore > highScoreMemoryRef.current) {
          setHighScore(finalScore);
          highScoreMemoryRef.current = finalScore;
        }
        return;
      }

      // Handle game won
      if (gameState.gameWon) {
        setGameWon(true);
        setIsPlaying(false);
        const finalScore = Math.max(score, gameState.score || 0);
        if (finalScore > highScoreMemoryRef.current) {
          setHighScore(finalScore);
          highScoreMemoryRef.current = finalScore;
        }
        return;
      }

      // Update game logic
      updateGame(gameState, deltaTime, currentTime);

      // Render game
      drawBackground(ctx, width, height, gameState.stars, currentTime * 0.001);
      drawPlayer(ctx, gameState.player);
      
      gameState.aliens.forEach(alien => drawAlien(ctx, alien, alien.animFrame));
      gameState.bullets.forEach(bullet => drawBullet(ctx, bullet, '#00ff88'));
      gameState.alienBullets.forEach(bullet => drawBullet(ctx, bullet, '#ff4757'));

      // Continue loop
      if (!isPaused && isPlaying) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [isPlaying, isPaused, setupCanvas, createGameState, updateGame, score]);

  // Draw static state when not playing
  useEffect(() => {
    if (isPlaying || !isVisible) return;

    const canvasSetup = setupCanvas();
    if (!canvasSetup) return;

    const { ctx, width, height } = canvasSetup;
    const staticState = createGameState(width, height);

    drawBackground(ctx, width, height, staticState.stars, 0);
    drawPlayer(ctx, staticState.player);
    staticState.aliens.forEach(alien => drawAlien(ctx, alien, 0));
  }, [isVisible, isPlaying, setupCanvas, createGameState]);

  // Handle resize with debounce
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isVisible && !isPlaying) {
          setupCanvas();
        }
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isVisible, isPlaying, setupCanvas]);

  // Game control functions
  const startGame = () => {
    // Reset all states
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    
    // Clear refs
    gameStateRef.current = null;
    touchStateRef.current = { left: false, right: false, shoot: false, dragging: false, lastX: 0 };
    keysRef.current.clear();
    
    // Start playing
    setIsPlaying(true);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameWon(false);
    setIsPaused(false);
    gameStateRef.current = null; // Force new game state creation
    touchStateRef.current = { left: false, right: false, shoot: false, dragging: false, lastX: 0 };
    setIsPlaying(true);
  };

  const resetGame = () => {
    // Cancel any running animation
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Reset all states
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setIsPlaying(false);
    
    // Clear refs
    gameStateRef.current = null;
    touchStateRef.current = { left: false, right: false, shoot: false, dragging: false, lastX: 0 };
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
