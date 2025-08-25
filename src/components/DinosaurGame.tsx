import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, ChevronLeft, ChevronRight, Target } from 'lucide-react';

export default function SpaceInvadersGame() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
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
  
  const touchStateRef = useRef({
    left: false,
    right: false,
    shoot: false,
    dragging: false,
    lastX: 0
  });

  const GAME_CONFIG = {
    PLAYER_SPEED: 4,
    BULLET_SPEED: 6,
    ALIEN_BULLET_SPEED: 2.5,
    BULLET_COOLDOWN: 200,
    ALIEN_SHOOT_CHANCE: 0.004,
    STARS_COUNT: 30,
    CANVAS_ASPECT_RATIO: 0.75, // Slightly wider for better mobile experience
    MIN_HEIGHT: 400, // Increased for better visibility
    MAX_HEIGHT: 500
  };

  const createGameState = useCallback((canvasWidth, canvasHeight) => {
    const playerWidth = Math.max(20, Math.min(32, canvasWidth / 15));
    const playerHeight = playerWidth * 0.7;
    
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
      alienSpeed: 0.6 + (level - 1) * 0.15,
      alienDropDistance: 12,
      lastBulletTime: 0,
      lastAlienShoot: 0,
      animationFrame: 0,
      stars: []
    };

    for (let i = 0; i < GAME_CONFIG.STARS_COUNT; i++) {
      gameState.stars.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        size: Math.random() * 1.2 + 0.4,
        brightness: Math.random() * 0.5 + 0.3,
        twinkle: Math.random() * 0.015 + 0.008
      });
    }

    const createAliens = () => {
      const rows = 5;
      const cols = 8;
      const alienWidth = Math.max(16, Math.min(24, canvasWidth / (cols + 2)));
      const alienHeight = alienWidth * 0.8;
      const spacingX = Math.max(4, alienWidth * 0.25);
      const spacingY = Math.max(4, alienHeight * 0.3);
      
      const gridWidth = cols * (alienWidth + spacingX) - spacingX;
      const startX = (canvasWidth - gridWidth) / 2;
      const startY = 40;

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

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;

    const containerRect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Improved mobile-first responsive calculation
    const containerWidth = containerRect.width - 16;
    const maxWidth = Math.min(containerWidth, 400);
    const calculatedHeight = maxWidth / GAME_CONFIG.CANVAS_ASPECT_RATIO;
    const finalHeight = Math.max(GAME_CONFIG.MIN_HEIGHT, Math.min(calculatedHeight, GAME_CONFIG.MAX_HEIGHT));
    const finalWidth = Math.min(maxWidth, finalHeight * GAME_CONFIG.CANVAS_ASPECT_RATIO);

    canvas.style.width = `${finalWidth}px`;
    canvas.style.height = `${finalHeight}px`;
    
    canvas.width = finalWidth * dpr;
    canvas.height = finalHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    return { ctx, width: finalWidth, height: finalHeight };
  }, []);

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

  const createTouchHandler = (action, isDown) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    touchStateRef.current[action] = isDown;
  };

  const drawBackground = (ctx, width, height, stars, time) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0e1a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    stars.forEach((star, index) => {
      const flicker = Math.sin(time * star.twinkle + index) * 0.3 + 0.7;
      ctx.globalAlpha = star.brightness * flicker;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(Math.floor(star.x), Math.floor(star.y), star.size, star.size);
    });
    ctx.globalAlpha = 1;
  };

  const drawPlayer = (ctx, player) => {
    const gradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + player.height);
    gradient.addColorStop(0, '#4a90e2');
    gradient.addColorStop(1, '#357abd');
    ctx.fillStyle = gradient;
    ctx.fillRect(Math.floor(player.x), Math.floor(player.y), player.width, player.height);
    
    const cannonWidth = Math.max(3, player.width * 0.12);
    const cannonHeight = Math.max(5, player.height * 0.4);
    ctx.fillStyle = '#6bb3ff';
    ctx.fillRect(
      Math.floor(player.x + player.width / 2 - cannonWidth / 2),
      Math.floor(player.y - cannonHeight),
      cannonWidth,
      cannonHeight
    );
    
    ctx.fillStyle = '#7dc3ff';
    ctx.fillRect(Math.floor(player.x + 1), Math.floor(player.y + 1), Math.max(1, player.width - 2), Math.max(1, player.height * 0.2));
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
    
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(alien.x), Math.floor(alien.y), alien.width, alien.height);
    
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
    
    ctx.fillStyle = highlightColor;
    ctx.fillRect(Math.floor(alien.x + 1), Math.floor(alien.y + 1), Math.max(1, alien.width - 2), Math.max(1, alien.height * 0.2));
  };

  const drawBullet = (ctx, bullet, color = '#00ff88') => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(bullet.x), Math.floor(bullet.y), bullet.width, bullet.height);
    
    ctx.shadowBlur = 3;
    ctx.shadowColor = color;
    ctx.fillRect(Math.floor(bullet.x), Math.floor(bullet.y), bullet.width, bullet.height);
    ctx.shadowBlur = 0;
  };

  const checkCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  };

  const updateGame = useCallback((gameState, deltaTime, currentTime) => {
    if (!gameState || gameState.gameOver || gameState.gameWon) return;

    const { player, bullets, aliens, alienBullets, canvas } = gameState;

    const moveLeft = (keysRef.current.has('ArrowLeft') || keysRef.current.has('KeyA') || touchStateRef.current.left) && !touchStateRef.current.dragging;
    const moveRight = (keysRef.current.has('ArrowRight') || keysRef.current.has('KeyD') || touchStateRef.current.right) && !touchStateRef.current.dragging;
    const shoot = keysRef.current.has('Space') || touchStateRef.current.shoot;

    if (moveLeft) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (moveRight) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }

    if (shoot && currentTime - gameState.lastBulletTime > GAME_CONFIG.BULLET_COOLDOWN) {
      bullets.push({
        x: player.x + player.width / 2 - 1.5,
        y: player.y - 4,
        width: 3,
        height: 10,
        speed: GAME_CONFIG.BULLET_SPEED
      });
      gameState.lastBulletTime = currentTime;
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed;
      if (bullets[i].y + bullets[i].height < 0) {
        bullets.splice(i, 1);
      }
    }

    let shouldChangeDirection = false;
    let lowestAlienY = 0;
    
    gameState.animationFrame = Math.floor(currentTime / 700) % 2;
    
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
      gameState.alienSpeed *= 1.015;
    }

    if (lowestAlienY >= player.y - 8) {
      gameState.gameOver = true;
      return;
    }

    const shootChance = GAME_CONFIG.ALIEN_SHOOT_CHANCE + (level - 1) * 0.0008;
    if (aliens.length > 0 && Math.random() < shootChance) {
      const frontAliens = aliens.filter(alien => {
        return !aliens.some(other => other.x === alien.x && other.y > alien.y);
      });
      
      if (frontAliens.length > 0) {
        const shooter = frontAliens[Math.floor(Math.random() * frontAliens.length)];
        alienBullets.push({
          x: shooter.x + shooter.width / 2 - 1.5,
          y: shooter.y + shooter.height,
          width: 3,
          height: 6,
          speed: GAME_CONFIG.ALIEN_BULLET_SPEED + (level - 1) * 0.2
        });
      }
    }

    for (let i = alienBullets.length - 1; i >= 0; i--) {
      alienBullets[i].y += alienBullets[i].speed;
      if (alienBullets[i].y > canvas.height + 8) {
        alienBullets.splice(i, 1);
      }
    }

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
        break;
      }
    }

    if (aliens.length === 0) {
      gameState.gameWon = true;
    }
  }, [level]);

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
    
    if (!gameStateRef.current || gameStateRef.current.canvas.width !== width) {
      gameStateRef.current = createGameState(width, height);
      gameStateRef.current.score = score;
    }

    let lastTime = performance.now();

    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const gameState = gameStateRef.current;
      if (!gameState) return;

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

      updateGame(gameState, deltaTime, currentTime);

      drawBackground(ctx, width, height, gameState.stars, currentTime * 0.001);
      drawPlayer(ctx, gameState.player);
      
      gameState.aliens.forEach(alien => drawAlien(ctx, alien, alien.animFrame));
      gameState.bullets.forEach(bullet => drawBullet(ctx, bullet, '#00ff88'));
      gameState.alienBullets.forEach(bullet => drawBullet(ctx, bullet, '#ff4757'));

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

  const startGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    
    gameStateRef.current = null;
    touchStateRef.current = { left: false, right: false, shoot: false, dragging: false, lastX: 0 };
    keysRef.current.clear();
    
    setIsPlaying(true);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameWon(false);
    setIsPaused(false);
    gameStateRef.current = null;
    touchStateRef.current = { left: false, right: false, shoot: false, dragging: false, lastX: 0 };
    setIsPlaying(true);
  };

  const resetGame = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setIsPlaying(false);
    
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col">
      {/* Header */}
      <div className="w-full max-w-lg mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            🚀 Space Invaders 🚀
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
            Try getting a high score while I reply to your email ✉️
          </p>
          <button 
            onClick={() => setIsVisible(v => !v)} 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 text-base shadow-lg transform active:scale-95 touch-manipulation"
          >
            {isVisible ? 'Hide Game' : 'Play Game'}
          </button>
        </div>
      </div>

      {isVisible && (
        <div className="flex-1 w-full max-w-lg mx-auto px-4 pb-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl px-3 py-2.5 border border-orange-200">
                <Trophy className="text-orange-500" size={16} />
                <div className="text-center">
                  <div className="text-xs text-orange-600 font-medium">High Score</div>
                  <div className="text-lg font-bold text-orange-700">{highScore}</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-3 py-2.5 border border-blue-200 text-center">
                <div className="text-xs text-blue-600 font-medium">Score</div>
                <div className="text-lg font-bold text-blue-700">{score}</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-3 py-2.5 border border-purple-200 text-center">
                <div className="text-xs text-purple-600 font-medium">Level</div>
                <div className="text-lg font-bold text-purple-700">{level}</div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl px-3 py-2.5 border border-red-200 text-center">
                <div className="text-xs text-red-600 font-medium">Lives</div>
                <div className="text-lg font-bold text-red-700">{"❤️".repeat(lives)}</div>
              </div>
            </div>
            
            {/* Enhanced Control Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {!isPlaying && !gameOver && !gameWon && (
                <button 
                  onClick={startGame} 
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all transform active:scale-95 shadow-md touch-manipulation"
                >
                  <Play size={14} />
                  <span>Start Game</span>
                </button>
              )}
              {gameOver && (
                <button 
                  onClick={startGame} 
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all transform active:scale-95 shadow-md touch-manipulation"
                >
                  <Play size={14} />
                  <span>Try Again</span>
                </button>
              )}
              {gameWon && (
                <button 
                  onClick={nextLevel} 
                  className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:from-orange-700 active:to-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all transform active:scale-95 shadow-md touch-manipulation"
                >
                  <Play size={14} />
                  <span>Next Level</span>
                </button>
              )}
              {isPlaying && (
                <button 
                  onClick={togglePause} 
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 active:from-yellow-700 active:to-orange-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all transform active:scale-95 shadow-md touch-manipulation"
                >
                  {isPaused ? <Play size={14} /> : <span className="text-sm">⏸</span>}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
              )}
              <button 
                onClick={resetGame} 
                className="flex items-center space-x-2 bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 active:from-gray-700 active:to-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all transform active:scale-95 shadow-md touch-manipulation"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            {/* Game Canvas Container */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-3 border border-gray-300 relative shadow-inner" ref={containerRef}>
              <canvas 
                ref={canvasRef} 
                className="w-full border-2 border-gray-600 rounded-lg bg-gray-900 touch-none block mx-auto shadow-lg" 
                style={{ imageRendering: 'pixelated' }} 
              />

              {isPaused && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                  <div className="text-white text-center bg-black/50 rounded-xl p-4 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-2">⏸ PAUSED</h3>
                    <p className="text-sm opacity-80">Tap Resume to continue</p>
                  </div>
                </div>
              )}

              {gameOver && (
                <div className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                  <div className="text-white text-center bg-red-900/70 rounded-xl p-4 backdrop-blur-sm border border-red-500">
                    <h3 className="text-xl font-bold mb-2">💀 GAME OVER</h3>
                    <p className="text-sm opacity-90">Final Score: {score}</p>
                  </div>
                </div>
              )}

              {gameWon && (
                <div className="absolute inset-0 bg-green-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                  <div className="text-white text-center bg-green-900/70 rounded-xl p-4 backdrop-blur-sm border border-green-500">
                    <h3 className="text-xl font-bold mb-2">🎉 LEVEL COMPLETE!</h3>
                    <p className="text-sm opacity-90">Score: {score}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Touch Controls */}
            {isVisible && (
              <div className="mt-4 flex justify-center items-center gap-3">
                <button
                  onTouchStart={createTouchHandler('left', true)}
                  onTouchEnd={createTouchHandler('left', false)}
                  onMouseDown={createTouchHandler('left', true)}
                  onMouseUp={createTouchHandler('left', false)}
                  onMouseLeave={createTouchHandler('left', false)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white p-3 rounded-xl font-bold text-lg shadow-md transform active:scale-95 touch-manipulation select-none"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onTouchStart={createTouchHandler('shoot', true)}
                  onTouchEnd={createTouchHandler('shoot', false)}
                  onMouseDown={createTouchHandler('shoot', true)}
                  onMouseUp={createTouchHandler('shoot', false)}
                  onMouseLeave={createTouchHandler('shoot', false)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 active:from-red-700 active:to-pink-700 text-white p-4 rounded-xl font-bold text-lg shadow-md transform active:scale-95 touch-manipulation select-none"
                >
                  <Target size={28} />
                </button>
                
                <button
                  onTouchStart={createTouchHandler('right', true)}
                  onTouchEnd={createTouchHandler('right', false)}
                  onMouseDown={createTouchHandler('right', true)}
                  onMouseUp={createTouchHandler('right', false)}
                  onMouseLeave={createTouchHandler('right', false)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 active:from-blue-700 active:to-indigo-700 text-white p-3 rounded-xl font-bold text-lg shadow-md transform active:scale-95 touch-manipulation select-none"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-4 text-center">
              <div className="text-gray-500 text-xs px-2">
                <div className="hidden sm:block">
                  <span className="font-medium">Desktop:</span> Arrow Keys / WASD: Move • SPACE: Shoot • P: Pause
                </div>
                <div className="sm:hidden">
                  <span className="font-medium">Mobile:</span> Drag on game screen to move • Use buttons below
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
