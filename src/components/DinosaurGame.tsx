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
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const keysRef = useRef({});
  const touchControlsRef = useRef({ left: false, right: false, shoot: false });

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('spaceInvadersHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Initialize game state based on level
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
      lastBulletTime: 0,
      bulletDelay: 200,
      score: score, // Carry over score to the next level
    };

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
    gameRef.current = game;
    return { ctx, canvas, gameWidth, gameHeight };
  }, [level, score]);

  // Draw initial state (when not playing)
  const drawInitialState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameWidth = canvas.width / (window.devicePixelRatio || 1);
    const gameHeight = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

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
        
        ctx.fillStyle = row < 1 ? '#ff6b35' : row < 3 ? '#ff8c42' : '#ffad42';
        ctx.fillRect(x, y, alienWidth, alienHeight);
        
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(x + 4, y + 4, 3, 3);
        ctx.fillRect(x + alienWidth - 7, y + 4, 3, 3);
      }
    }

    const playerX = gameWidth / 2 - 15;
    const playerY = gameHeight - 40;
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(playerX, playerY, 30, 20);
    ctx.fillRect(playerX + 13, playerY - 6, 4, 8);
  }, []);

  // Canvas resize logic
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    const cssWidth = Math.min(rect.width, 900);
    const cssHeight = cssWidth * 0.66;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    if (!isPlaying) {
      drawInitialState();
    }
  }, [isPlaying, drawInitialState]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // Handle player being hit
  const hitPlayer = useCallback(() => {
    setLives(prev => prev - 1);
  }, []);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;

    const initData = initializeGame();
    if (!initData) return;
    
    const { ctx, gameWidth, gameHeight } = initData;
    let animationFrameId;

    const loop = (time) => {
      const game = gameRef.current;
      if (!game) return;

      if (lives <= 0) {
        setGameOver(true);
        setIsPlaying(false);
        if (game.score > highScore) {
          setHighScore(game.score);
          localStorage.setItem('spaceInvadersHighScore', game.score.toString());
        }
        return;
      }
      if (game.aliens.length === 0) {
        setGameWon(true);
        setIsPlaying(false);
         if (game.score > highScore) {
          setHighScore(game.score);
          localStorage.setItem('spaceInvadersHighScore', game.score.toString());
        }
        return;
      }

      ctx.clearRect(0, 0, gameWidth, gameHeight);
      ctx.fillStyle = '#0b1220';
      ctx.fillRect(0, 0, gameWidth, gameHeight);

      const moveLeft = keysRef.current['ArrowLeft'] || keysRef.current['KeyA'] || touchControlsRef.current.left;
      const moveRight = keysRef.current['ArrowRight'] || keysRef.current['KeyD'] || touchControlsRef.current.right;
      const shoot = keysRef.current['Space'] || touchControlsRef.current.shoot;

      if (moveLeft) game.player.x = Math.max(0, game.player.x - game.player.speed);
      if (moveRight) game.player.x = Math.min(gameWidth - game.player.width, game.player.x + game.player.speed);

      if (shoot && time - game.lastBulletTime > game.bulletDelay) {
        game.bullets.push({
          x: game.player.x + game.player.width / 2 - 2,
          y: game.player.y,
          width: 4, height: 10, speed: 8
        });
        game.lastBulletTime = time;
      }

      game.bullets = game.bullets.filter(b => b.y + b.height > 0);
      game.bullets.forEach(b => b.y -= b.speed);

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
        game.aliens.forEach(a => a.y += game.alienDropDistance);
      }
      
      if (lowestAlien > gameHeight - 80) {
        setLives(0);
      }

      if (game.aliens.length > 0 && Math.random() < 0.01 + level * 0.002) {
        const shooter = game.aliens[Math.floor(Math.random() * game.aliens.length)];
        game.alienBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4, height: 8, speed: 3 + level * 0.2
        });
      }

      game.alienBullets = game.alienBullets.filter(b => b.y < gameHeight);
      game.alienBullets.forEach(b => b.y += b.speed);
      
      for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        for (let j = game.aliens.length - 1; j >= 0; j--) {
          const alien = game.aliens[j];
          if (bullet.x < alien.x + alien.width && bullet.x + bullet.width > alien.x &&
              bullet.y < alien.y + alien.height && bullet.y + bullet.height > alien.y) {
            game.bullets.splice(i, 1);
            game.score += alien.points;
            game.aliens.splice(j, 1);
            break;
          }
        }
      }

      for (let i = game.alienBullets.length - 1; i >= 0; i--) {
        const bullet = game.alienBullets[i];
        if (bullet.x < game.player.x + game.player.width && bullet.x + bullet.width > game.player.x &&
            bullet.y < game.player.y + game.player.height && bullet.y + bullet.height > game.player.y) {
          game.alienBullets.splice(i, 1);
          hitPlayer();
        }
      }

      setScore(game.score);

      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
      ctx.fillRect(game.player.x + game.player.width / 2 - 2, game.player.y - 6, 4, 8);

      ctx.fillStyle = '#ff6b35';
      game.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
      
      game.aliens.forEach(alien => {
        ctx.fillStyle = alien.type === 'small' ? '#ff6b35' : alien.type === 'medium' ? '#ff8c42' : '#ffad42';
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(alien.x + 4, alien.y + 4, 3, 3);
        ctx.fillRect(alien.x + alien.width - 7, alien.y + 4, 3, 3);
      });

      ctx.fillStyle = '#ff6b35';
      game.alienBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, initializeGame, hitPlayer, lives, highScore, level]);

  // Setup event listeners
  useEffect(() => {
    const handleKeyDown = (e) => { keysRef.current[e.code] = true; if (e.code === 'Space') e.preventDefault(); };
    const handleKeyUp = (e) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    let pointerDownOnCanvas = false;
    const onPointerDown = () => { pointerDownOnCanvas = true; };
    const onPointerMove = (e) => {
      if (!pointerDownOnCanvas || !gameRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      gameRef.current.player.x = Math.max(0, Math.min(x - gameRef.current.player.width / 2, rect.width - gameRef.current.player.width));
    };
    const onPointerUp = () => { pointerDownOnCanvas = false; };
    
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const handleControlDown = (control) => (e) => {
    e.preventDefault();
    touchControlsRef.current[control] = true;
  };
  const handleControlUp = (control) => (e) => {
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
    setTimeout(() => drawInitialState(), 0);
  };
  
  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            🚀 Space Invaders 🚀
          </h3>
          <p className="text-base sm:text-lg text-gray-600 italic font-medium">
            Try getting a high score while I reply to your email ✉️
          </p>
          <button onClick={() => setIsVisible(v => !v)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base mt-3">
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
                  <button onClick={startGame} className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors">
                    <Play size={12} />
                    <span>Start</span>
                  </button>
                )}
                {gameOver && (
                  <button onClick={startGame} className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors">
                    <Play size={12} />
                    <span>Play Again</span>
                  </button>
                )}
                {gameWon && (
                  <button onClick={nextLevel} className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors">
                    <Play size={12} />
                    <span>Next Level</span>
                  </button>
                )}
                <button onClick={resetGame} className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors">
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-2 sm:p-3 border border-gray-300 relative" ref={containerRef}>
              <canvas ref={canvasRef} className="w-full max-w-none block border border-gray-600 rounded bg-gray-900" style={{ imageRendering: 'pixelated' }} />

              <div className="md:hidden absolute left-0 right-0 bottom-2 flex items-end justify-between px-4 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                  <button onPointerDown={handleControlDown('left')} onPointerUp={handleControlUp('left')} onPointerLeave={handleControlUp('left')} onContextMenu={(e) => e.preventDefault()} className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-white font-semibold touch-action-none">
                    ◀
                  </button>
                  <button onPointerDown={handleControlDown('right')} onPointerUp={handleControlUp('right')} onPointerLeave={handleControlUp('right')} onContextMenu={(e) => e.preventDefault()} className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-white font-semibold touch-action-none">
                    ▶
                  </button>
                </div>
                <div className="pointer-events-auto">
                  <button onPointerDown={handleControlDown('shoot')} onPointerUp={handleControlUp('shoot')} onPointerLeave={handleControlUp('shoot')} onContextMenu={(e) => e.preventDefault()} className="w-16 h-16 rounded-full bg-red-500/90 text-white flex items-center justify-center font-bold touch-action-none">
                    FIRE
                  </button>
                </div>
              </div>

              <div className="text-center mt-2 text-gray-400 text-xs">
                <span className="hidden md:inline">Arrow Keys: Move • SPACE: Shoot • Drag on canvas to move</span>
                <span className="md:hidden">Touch controls at bottom • Drag canvas to move • Tap FIRE to shoot</span>
              </div>
            </div>

            {gameOver && (
              <div className="text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-base sm:text-lg font-semibold text-red-700 mb-1">Game Over!</h4>
                <p className="text-red-600 text-xs sm:text-sm">Final Score: {score} | Level: {level}</p>
                {score >= highScore && score > 0 && (
                  <p className="text-orange-500 font-medium text-xs sm:text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}

            {gameWon && (
              <div className="text-center mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-base sm:text-lg font-semibold text-green-700 mb-1">Level Complete! 🚀</h4>
                <p className="text-green-600 text-xs sm:text-sm">Score: {score} | Ready for Level {level + 1}?</p>
                {score >= highScore && (
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
