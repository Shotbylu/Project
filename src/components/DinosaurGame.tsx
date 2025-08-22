import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';

export default function SpaceInvadersGame() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [touchControls, setTouchControls] = useState({ left: false, right: false, shoot: false });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const keysRef = useRef({});
  const livesRef = useRef(lives);

  // Keep ref in sync with state
  useEffect(() => { livesRef.current = lives; }, [lives]);

  // Initialize game state
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const rect = canvas.getBoundingClientRect();
    const gameWidth = rect.width;
    const gameHeight = rect.height;

    const game = {
      player: {
        x: gameWidth / 2 - 15,
        y: gameHeight - 40,
        width: 30,
        height: 20,
        speed: 5,
      },
      bullets: [],
      aliens: [],
      alienBullets: [],
      alienDirection: 1,
      alienSpeed: 0.5 + (level - 1) * 0.1,
      alienDropDistance: 15,
      lastAlienShot: 0,
      alienShootDelay: Math.max(60 - level * 3, 30),
      gameOver: false,
      gameWon: false,
      score: 0,
      level: level,
      lastBulletTime: 0,
      bulletDelay: 200,
    };

    // Create alien formation
    const createAliens = () => {
      game.aliens = [];
      const rows = 4;
      const cols = 8;
      const alienWidth = 25;
      const alienHeight = 20;
      const spacing = 8;
      const gridWidth = cols * (alienWidth + spacing) - spacing;
      const startX = (gameWidth - gridWidth) / 2;
      const startY = 40;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          game.aliens.push({
            x: startX + col * (alienWidth + spacing),
            y: startY + row * (alienHeight + spacing),
            width: alienWidth,
            height: alienHeight,
            type: row < 1 ? 'small' : row < 3 ? 'medium' : 'large',
            points: row < 1 ? 30 : row < 3 ? 20 : 10,
          });
        }
      }
    };

    createAliens();
    gameRef.current = game;
    return { ctx, canvas, game, gameWidth, gameHeight };
  }, [level]);

  // Draw initial game state (when not playing)
  const drawInitialState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const gameWidth = rect.width;
    const gameHeight = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    
    // Draw background
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw stars background
    ctx.fillStyle = '#1f3a6b';
    for (let i = 0; i < 40; i++) {
      const x = (i * 77) % gameWidth;
      const y = (i * 131) % gameHeight;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw aliens in formation
    const rows = 4;
    const cols = 8;
    const alienWidth = 25;
    const alienHeight = 20;
    const spacing = 8;
    const gridWidth = cols * (alienWidth + spacing) - spacing;
    const startX = (gameWidth - gridWidth) / 2;
    const startY = 40;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (alienWidth + spacing);
        const y = startY + row * (alienHeight + spacing);
        
        // Draw alien
        switch (row) {
          case 0:
            ctx.fillStyle = '#ff6b35';
            break;
          case 1:
          case 2:
            ctx.fillStyle = '#ff8c42';
            break;
          default:
            ctx.fillStyle = '#ffad42';
        }
        ctx.fillRect(x, y, alienWidth, alienHeight);
        
        // Draw alien eyes
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(x + 4, y + 4, 3, 3);
        ctx.fillRect(x + alienWidth - 7, y + 4, 3, 3);
      }
    }

    // Draw player ship
    ctx.fillStyle = '#4a90e2';
    const playerX = gameWidth / 2 - 15;
    const playerY = gameHeight - 40;
    ctx.fillRect(playerX, playerY, 30, 20);
    ctx.fillRect(playerX + 13, playerY - 6, 4, 8);
  }, []);

  // Draw initial state when component mounts or canvas resizes
  useEffect(() => {
    if (!isPlaying) {
      drawInitialState();
    }
  }, [isPlaying, drawInitialState]);

  // Resize canvas properly
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Maintain aspect ratio
    const maxHeight = Math.min(rect.width * 0.66, window.innerHeight * 0.6);
    const cssWidth = Math.min(rect.width, 900);
    const cssHeight = Math.max(240, Math.min(maxHeight, 600));

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Redraw initial state after resize
    if (!isPlaying) {
      setTimeout(() => drawInitialState(), 0);
    }
  }, [isPlaying, drawInitialState]);

  // Handle canvas resize
  useEffect(() => {
    resizeCanvas();
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas]);

  // Keyboard controls
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let pointerDownOnCanvas = false;

    const onPointerDown = (e) => {
      pointerDownOnCanvas = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      if (gameRef.current) {
        const newX = Math.max(0, Math.min(x - gameRef.current.player.width / 2, rect.width - gameRef.current.player.width));
        gameRef.current.player.x = newX;
      }
    };

    const onPointerMove = (e) => {
      if (!pointerDownOnCanvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      
      if (gameRef.current) {
        const newX = Math.max(0, Math.min(x - gameRef.current.player.width / 2, rect.width - gameRef.current.player.width));
        gameRef.current.player.x = newX;
      }
    };

    const onPointerUp = () => {
      pointerDownOnCanvas = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  // Handle player hit
  const hitPlayer = useCallback(() => {
    setLives(prev => {
      const next = prev - 1;
      livesRef.current = next;
      if (next <= 0 && gameRef.current) {
        gameRef.current.gameOver = true;
      }
      return next;
    });
  }, []);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;
    
    const init = initializeGame();
    if (!init) return;
    
    const { ctx, canvas, game, gameWidth, gameHeight } = init;

    let lastTime = performance.now();

    const loop = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (game.gameOver || game.gameWon) {
        if (game.gameOver) setGameOver(true);
        if (game.gameWon) setGameWon(true);
        setIsPlaying(false);
        if (game.score > highScore) setHighScore(game.score);
        setScore(game.score);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, gameWidth, gameHeight);
      
      // Draw background
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, gameWidth, gameHeight);

      // Handle input
      const moveLeft = keysRef.current['ArrowLeft'] || keysRef.current['KeyA'] || touchControls.left;
      const moveRight = keysRef.current['ArrowRight'] || keysRef.current['KeyD'] || touchControls.right;
      const shoot = keysRef.current['Space'] || touchControls.shoot;

      // Update player position
      if (moveLeft) {
        game.player.x = Math.max(0, game.player.x - game.player.speed);
      }
      if (moveRight) {
        game.player.x = Math.min(gameWidth - game.player.width, game.player.x + game.player.speed);
      }

      // Player shooting
      if (shoot && time - game.lastBulletTime > game.bulletDelay) {
        game.bullets.push({
          x: game.player.x + game.player.width / 2 - 2,
          y: game.player.y,
          width: 4,
          height: 10,
          speed: 8
        });
        game.lastBulletTime = time;
      }

      // Update player bullets
      for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) {
          game.bullets.splice(i, 1);
        }
      }

      // Update aliens
      let changeDirection = false;
      let lowestAlien = 0;
      
      for (const alien of game.aliens) {
        alien.x += game.alienDirection * game.alienSpeed;
        if (alien.x <= 0 || alien.x + alien.width >= gameWidth) {
          changeDirection = true;
        }
        lowestAlien = Math.max(lowestAlien, alien.y);
      }
      
      if (changeDirection) {
        game.alienDirection *= -1;
        for (const alien of game.aliens) {
          alien.y += game.alienDropDistance;
        }
      }
      
      // Check if aliens reached bottom
      if (lowestAlien > gameHeight - 80) {
        game.gameOver = true;
      }

      // Alien shooting
      if (game.aliens.length > 0 && Math.random() < 0.01 + level * 0.002) {
        const shooter = game.aliens[Math.floor(Math.random() * game.aliens.length)];
        game.alienBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 8,
          speed: 3 + level * 0.2
        });
      }

      // Update alien bullets
      for (let i = game.alienBullets.length - 1; i >= 0; i--) {
        const bullet = game.alienBullets[i];
        bullet.y += bullet.speed;
        if (bullet.y > gameHeight) {
          game.alienBullets.splice(i, 1);
        }
      }

      // Collision detection: player bullets vs aliens
      for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        for (let j = game.aliens.length - 1; j >= 0; j--) {
          const alien = game.aliens[j];
          if (bullet.x < alien.x + alien.width &&
              bullet.x + bullet.width > alien.x &&
              bullet.y < alien.y + alien.height &&
              bullet.y + bullet.height > alien.y) {
            game.bullets.splice(i, 1);
            game.score += alien.points;
            game.aliens.splice(j, 1);
            break;
          }
        }
      }

      // Collision detection: alien bullets vs player
      for (let i = game.alienBullets.length - 1; i >= 0; i--) {
        const bullet = game.alienBullets[i];
        if (bullet.x < game.player.x + game.player.width &&
            bullet.x + bullet.width > game.player.x &&
            bullet.y < game.player.y + game.player.height &&
            bullet.y + bullet.height > game.player.y) {
          game.alienBullets.splice(i, 1);
          hitPlayer();
          if (livesRef.current <= 0) {
            game.gameOver = true;
          }
        }
      }

      // Check win condition
      if (game.aliens.length === 0) {
        game.gameWon = true;
      }

      // Draw stars background
      ctx.fillStyle = '#1f3a6b';
      for (let i = 0; i < 40; i++) {
        const x = (i * 77) % gameWidth;
        const y = (i * 131) % gameHeight;
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw player
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
      ctx.fillRect(game.player.x + game.player.width / 2 - 2, game.player.y - 6, 4, 8);

      // Draw player bullets
      ctx.fillStyle = '#ff6b35';
      for (const bullet of game.bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }

      // Draw aliens
      for (const alien of game.aliens) {
        switch (alien.type) {
          case 'small':
            ctx.fillStyle = '#ff6b35';
            break;
          case 'medium':
            ctx.fillStyle = '#ff8c42';
            break;
          default:
            ctx.fillStyle = '#ffad42';
        }
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        
        // Draw alien eyes
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(alien.x + 4, alien.y + 4, 3, 3);
        ctx.fillRect(alien.x + alien.width - 7, alien.y + 4, 3, 3);
      }

      // Draw alien bullets
      ctx.fillStyle = '#ff6b35';
      for (const bullet of game.alienBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }

      // Update score
      setScore(game.score);

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, initializeGame, touchControls, level, highScore, hitPlayer]);

  // Touch control handlers
  const handleControlDown = (control) => (e) => {
    e.preventDefault();
    setTouchControls(prev => ({ ...prev, [control]: true }));
  };

  const handleControlUp = (control) => (e) => {
    e.preventDefault();
    setTouchControls(prev => ({ ...prev, [control]: false }));
  };

  // Game control functions
  const startGame = () => {
    setScore(0);
    setLives(3);
    livesRef.current = 3;
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(true);
    setTouchControls({ left: false, right: false, shoot: false });
    
    // Force a re-render of the game loop
    setTimeout(() => {
      if (gameRef.current) {
        gameRef.current.gameOver = false;
        gameRef.current.gameWon = false;
        gameRef.current.score = 0;
        gameRef.current.bullets = [];
        gameRef.current.alienBullets = [];
      }
    }, 0);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameWon(false);
    setIsPlaying(true);
    setTouchControls({ left: false, right: false, shoot: false });
    
    // Force a re-render of the game loop
    setTimeout(() => {
      if (gameRef.current) {
        gameRef.current.gameOver = false;
        gameRef.current.gameWon = false;
        gameRef.current.bullets = [];
        gameRef.current.alienBullets = [];
      }
    }, 0);
  };

  const resetGame = () => {
    setScore(0);
    setLives(3);
    livesRef.current = 3;
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(false);
    setTouchControls({ left: false, right: false, shoot: false });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Draw initial state after reset
    setTimeout(() => drawInitialState(), 0);
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
            {/* Game Stats */}
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
              
              {/* Game Controls */}
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
                <button 
                  onClick={resetGame} 
                  className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-300 relative" ref={containerRef}>
              <canvas 
                ref={canvasRef} 
                className="w-full max-w-none border border-gray-600 rounded bg-gray-900" 
                style={{ imageRendering: 'pixelated' }} 
              />

              {/* Mobile Touch Controls */}
              <div className="md:hidden absolute left-0 right-0 bottom-2 flex items-end justify-between px-4 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                  <button 
                    onPointerDown={handleControlDown('left')} 
                    onPointerUp={handleControlUp('left')} 
                    onPointerCancel={handleControlUp('left')} 
                    onContextMenu={(e) => e.preventDefault()} 
                    className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-white font-semibold touch-action-none"
                  >
                    ◀
                  </button>
                  <button 
                    onPointerDown={handleControlDown('right')} 
                    onPointerUp={handleControlUp('right')} 
                    onPointerCancel={handleControlUp('right')} 
                    onContextMenu={(e) => e.preventDefault()} 
                    className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-white font-semibold touch-action-none"
                  >
                    ▶
                  </button>
                </div>

                <div className="pointer-events-auto">
                  <button 
                    onPointerDown={handleControlDown('shoot')} 
                    onPointerUp={handleControlUp('shoot')} 
                    onPointerCancel={handleControlUp('shoot')} 
                    onContextMenu={(e) => e.preventDefault()} 
                    className="w-16 h-16 rounded-full bg-red-500/90 text-white flex items-center justify-center font-bold touch-action-none"
                  >
                    FIRE
                  </button>
                </div>
              </div>

              {/* Controls Instructions */}
              <div className="text-center mt-2 text-gray-400 text-xs">
                <span className="hidden md:inline">
                  Arrow Keys: Move • SPACE: Shoot • Drag on canvas to move
                </span>
                <span className="md:hidden">
                  Touch controls at bottom • Drag canvas to move • Tap FIRE to shoot
                </span>
              </div>
            </div>

            {/* Game Over Message */}
            {gameOver && (
              <div className="text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-1">Game Over!</h4>
                <p className="text-red-600 text-xs sm:text-sm">Final Score: {score} | Level: {level}</p>
                {score > highScore && (
                  <p className="text-orange-500 font-medium text-xs sm:text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}

            {/* Level Complete Message */}
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
