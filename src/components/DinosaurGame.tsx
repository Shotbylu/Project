import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

export default function GrokSpaceInvaders() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const canvasRef = useRef(null);
  const keysRef = useRef({});
  const touchControlsRef = useRef({ left: false, right: false, shoot: false });
  const animationRef = useRef(null);

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  const gameStateRef = useRef({
    player: { x: GAME_WIDTH / 2 - 15, y: GAME_HEIGHT - 60, width: 30, height: 20, speed: 6 },
    bullets: [],
    aliens: [],
    alienBullets: [],
    alienDirection: 1,
    alienSpeed: 1,
    alienDropDistance: 20,
    lastBulletTime: 0,
    bulletDelay: 150,
    lastAlienBulletTime: 0,
    alienBulletDelay: 1000,
  });

  const initGame = useCallback(() => {
    const game = gameStateRef.current;
    game.player.x = GAME_WIDTH / 2 - 15;
    game.bullets = [];
    game.alienBullets = [];
    game.aliens = [];
    game.alienDirection = 1;
    game.alienSpeed = 1 + (level - 1) * 0.3;
    game.alienBulletDelay = Math.max(300, 1000 - (level - 1) * 100);

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
  }, [level]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const game = gameStateRef.current;

    // Clear
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % GAME_WIDTH;
      const y = (i * 71) % GAME_HEIGHT;
      if (Math.sin(i) > 0.8) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Player
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    ctx.fillRect(game.player.x + 10, game.player.y - 8, 10, 8);

    // Bullets
    ctx.fillStyle = '#ffff00';
    game.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Aliens
    game.aliens.forEach(a => {
      if (!a.alive) return;
      ctx.fillStyle = a.type === 'small' ? '#ff0000' : a.type === 'medium' ? '#ff8800' : '#ffaa00';
      ctx.fillRect(a.x, a.y, a.width, a.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(a.x + 6, a.y + 5, 3, 3);
      ctx.fillRect(a.x + a.width - 9, a.y + 5, 3, 3);
    });

    // Alien bullets
    ctx.fillStyle = '#ff0000';
    game.alienBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));
  }, []);

  const update = useCallback(() => {
    const game = gameStateRef.current;
    if (!isPlaying || gameOver || gameWon) return;

    const moveLeft = keysRef.current['ArrowLeft'] || keysRef.current['KeyA'] || touchControlsRef.current.left;
    const moveRight = keysRef.current['ArrowRight'] || keysRef.current['KeyD'] || touchControlsRef.current.right;
    const shoot = keysRef.current['Space'] || touchControlsRef.current.shoot;

    // Player movement
    if (moveLeft && game.player.x > 0) game.player.x -= game.player.speed;
    if (moveRight && game.player.x < GAME_WIDTH - game.player.width) game.player.x += game.player.speed;

    // Shooting
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
    game.bullets = game.bullets.filter(b => {
      b.y -= b.speed;
      return b.y > -b.height;
    });

    // Move aliens
    let hitEdge = false;
    const liveAliens = game.aliens.filter(a => a.alive);
    liveAliens.forEach(a => {
      a.x += game.alienDirection * game.alienSpeed;
      if (a.x <= 0 || a.x >= GAME_WIDTH - a.width) hitEdge = true;
    });

    if (hitEdge) {
      game.alienDirection *= -1;
      game.aliens.forEach(a => { if (a.alive) a.y += game.alienDropDistance; });
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
    game.alienBullets = game.alienBullets.filter(b => {
      b.y += b.speed;
      return b.y < GAME_HEIGHT;
    });

    // Collisions player bullets vs aliens
    for (let i = game.bullets.length - 1; i >= 0; i--) {
      const b = game.bullets[i];
      let hit = false;
      for (let j = game.aliens.length - 1; j >= 0; j--) {
        const a = game.aliens[j];
        if (!a.alive) continue;
        if (b.x + b.width > a.x && b.x < a.x + a.width &&
            b.y + b.height > a.y && b.y < a.y + a.height) {
          a.alive = false;
          setScore(prev => prev + a.points);
          hit = true;
          break;
        }
      }
      if (hit) game.bullets.splice(i, 1);
    }

    // Collisions alien bullets vs player
    for (let i = game.alienBullets.length - 1; i >= 0; i--) {
      const b = game.alienBullets[i];
      if (b.x < game.player.x + game.player.width && b.x + b.width > game.player.x &&
          b.y < game.player.y + game.player.height && b.y + b.height > game.player.y) {
        game.alienBullets.splice(i, 1);
        setLives(prev => prev - 1);
        break;
      }
    }

    // Check invasion
    if (liveAliens.length > 0) {
      const lowestY = Math.max(...liveAliens.map(a => a.y + a.height));
      if (lowestY > game.player.y) {
        setLives(0);
      }
    }

    // Check win
    if (game.aliens.every(a => !a.alive)) {
      setGameWon(true);
      setIsPlaying(false);
      if (score > highScore) setHighScore(score);
    }
  }, [isPlaying, gameOver, gameWon, level, score, highScore]);

  const gameLoop = useCallback(() => {
    update();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [update, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
    }
  }, []);

  useEffect(() => {
    if (isPlaying && !gameOver && !gameWon) {
      initGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, gameOver, gameWon, initGame, gameLoop]);

  useEffect(() => {
    if (lives <= 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
      if (score > highScore) setHighScore(score);
    }
  }, [lives, isPlaying, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Space') e.preventDefault();
    };
    const handleKeyUp = (e) => keysRef.current[e.code] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleTouchStart = (control) => () => touchControlsRef.current[control] = true;
  const handleTouchEnd = (control) => () => touchControlsRef.current[control] = false;

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
  };

  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
            🚀 Grok's Space Invaders 🚀
          </h3>
          <p className="text-base sm:text-lg text-gray-600 italic font-medium">
            Defend Earth from the alien invasion!
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-700 relative">
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

          <div className="relative bg-black rounded border-2 border-gray-600">
            <canvas 
              ref={canvasRef}
              className="block mx-auto max-w-full h-auto"
              style={{ imageRendering: 'pixelated', aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}` }}
            />

            <div className="md:hidden absolute bottom-4 left-0 right-0 px-4">
              <div className="flex justify-between items-end">
                <div className="flex gap-3">
                  <button
                    onTouchStart={handleTouchStart('left')}
                    onTouchEnd={handleTouchEnd('left')}
                    className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold select-none"
                  >
                    ◀
                  </button>
                  <button
                    onTouchStart={handleTouchStart('right')}
                    onTouchEnd={handleTouchEnd('right')}
                    className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold select-none"
                  >
                    ▶
                  </button>
                </div>
                <button
                  onTouchStart={handleTouchStart('shoot')}
                  onTouchEnd={handleTouchEnd('shoot')}
                  className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs select-none"
                >
                  FIRE
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-3 text-gray-400 text-xs">
            <span className="hidden md:inline">Arrow Keys or WASD: Move • SPACE: Shoot</span>
            <span className="md:hidden">Use touch controls to play</span>
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg z-10">
              <div className="text-center text-white p-6">
                <h2 className="text-2xl font-bold mb-2 text-red-400">Game Over!</h2>
                <p className="mb-4">Final Score: {score}</p>
                {score > highScore && score > 0 && (
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

          {gameWon && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg z-10">
              <div className="text-center text-white p-6">
                <h2 className="text-2xl font-bold mb-2 text-green-400">Level Complete!</h2>
                <p className="mb-4">Score: {score}</p>
                {score > highScore && (
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
      </div>
    </div>
  );
}
