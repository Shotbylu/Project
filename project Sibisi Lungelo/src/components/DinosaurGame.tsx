import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';

const SpaceInvadersGame = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
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
    canvas.height = 400;

    const game = {
      player: {
        x: canvas.width / 2 - 15,
        y: canvas.height - 40,
        width: 30,
        height: 20,
        speed: 5,
      },
      bullets: [],
      aliens: [],
      alienBullets: [],
      alienDirection: 1,
      alienSpeed: 1,
      alienDropDistance: 15,
      lastAlienShot: 0,
      alienShootDelay: 60,
      gameOver: false,
      gameWon: false,
      score: 0,
      level: level,
    };

    // Create alien grid
    const createAliens = () => {
      game.aliens = [];
      const rows = 4;
      const cols = 8;
      const alienWidth = 25;
      const alienHeight = 20;
      const spacing = 8;
      const startX = 80;
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
    return game;
  }, [level]);

  // Key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;

    const game = initializeGame();
    if (!game) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let lastBulletTime = 0;
    const bulletDelay = 200;

    const gameLoop = (currentTime) => {
      if (game.gameOver || game.gameWon) {
        if (game.gameOver) {
          setGameOver(true);
        } else {
          setGameWon(true);
        }
        setIsPlaying(false);
        if (game.score > highScore) {
          setHighScore(game.score);
        }
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle player input
      if (keysRef.current['ArrowLeft'] && game.player.x > 0) {
        game.player.x -= game.player.speed;
      }
      if (keysRef.current['ArrowRight'] && game.player.x < canvas.width - game.player.width) {
        game.player.x += game.player.speed;
      }
      if (keysRef.current['Space'] && currentTime - lastBulletTime > bulletDelay) {
        game.bullets.push({
          x: game.player.x + game.player.width / 2 - 2,
          y: game.player.y,
          width: 4,
          height: 10,
          speed: 8,
        });
        lastBulletTime = currentTime;
      }

      // Update player bullets
      game.bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
          game.bullets.splice(index, 1);
        }
      });

      // Update aliens
      let changeDirection = false;
      let lowestAlien = 0;

      game.aliens.forEach((alien) => {
        alien.x += game.alienDirection * game.alienSpeed;
        if (alien.x <= 0 || alien.x >= canvas.width - alien.width) {
          changeDirection = true;
        }
        lowestAlien = Math.max(lowestAlien, alien.y);
      });

      if (changeDirection) {
        game.alienDirection *= -1;
        game.aliens.forEach((alien) => {
          alien.y += game.alienDropDistance;
        });
      }

      // Check if aliens reached bottom
      if (lowestAlien > canvas.height - 80) {
        game.gameOver = true;
      }

      // Alien shooting
      if (game.aliens.length > 0 && Math.random() < 0.02) {
        const shootingAlien = game.aliens[Math.floor(Math.random() * game.aliens.length)];
        game.alienBullets.push({
          x: shootingAlien.x + shootingAlien.width / 2 - 2,
          y: shootingAlien.y + shootingAlien.height,
          width: 4,
          height: 8,
          speed: 3,
        });
      }

      // Update alien bullets
      game.alienBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed;
        if (bullet.y > canvas.height) {
          game.alienBullets.splice(index, 1);
        }
      });

      // Collision detection - player bullets vs aliens
      game.bullets.forEach((bullet, bulletIndex) => {
        game.aliens.forEach((alien, alienIndex) => {
          if (
            bullet.x < alien.x + alien.width &&
            bullet.x + bullet.width > alien.x &&
            bullet.y < alien.y + alien.height &&
            bullet.y + bullet.height > alien.y
          ) {
            game.bullets.splice(bulletIndex, 1);
            game.score += alien.points;
            game.aliens.splice(alienIndex, 1);
          }
        });
      });

      // Collision detection - alien bullets vs player
      game.alienBullets.forEach((bullet, index) => {
        if (
          bullet.x < game.player.x + game.player.width &&
          bullet.x + bullet.width > game.player.x &&
          bullet.y < game.player.y + game.player.height &&
          bullet.y + bullet.height > game.player.y
        ) {
          game.alienBullets.splice(index, 1);
          setLives(prev => prev - 1);
          if (lives <= 1) {
            game.gameOver = true;
          }
        }
      });

      // Check win condition
      if (game.aliens.length === 0) {
        game.gameWon = true;
      }

      // Draw everything
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars background
      ctx.fillStyle = '#4a90e2';
      for (let i = 0; i < 30; i++) {
        const x = (i * 123) % canvas.width;
        const y = (i * 456) % canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw player
      ctx.fillStyle = '#4a90e2';
      ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
      ctx.fillRect(game.player.x + 13, game.player.y - 5, 4, 8);

      // Draw player bullets
      ctx.fillStyle = '#ff6b35';
      game.bullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      // Draw aliens
      game.aliens.forEach((alien) => {
        switch (alien.type) {
          case 'small':
            ctx.fillStyle = '#ff6b35';
            break;
          case 'medium':
            ctx.fillStyle = '#ff8c42';
            break;
          case 'large':
            ctx.fillStyle = '#ffad42';
            break;
        }
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(alien.x + 4, alien.y + 4, 3, 3);
        ctx.fillRect(alien.x + 18, alien.y + 4, 3, 3);
      });

      // Draw alien bullets
      ctx.fillStyle = '#ff6b35';
      game.alienBullets.forEach((bullet) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      setScore(game.score);
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, level, highScore, lives]);

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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <div className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center justify-center gap-2">
            Space Invaders 
          </h3>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
          >
            {isVisible ? 'Hide Game' : 'Play Game'}
          </button>
        </div>

        {isVisible && (
          <div className="bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-4 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Trophy className="text-orange-500" size={16} />
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
                    className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    <Play size={14} />
                    <span>Start</span>
                  </button>
                )}
                {gameOver && (
                  <button
                    onClick={startGame}
                    className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    <Play size={14} />
                    <span>Play Again</span>
                  </button>
                )}
                {gameWon && (
                  <button
                    onClick={nextLevel}
                    className="flex items-center space-x-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    <Play size={14} />
                    <span>Next Level</span>
                  </button>
                )}
                <button
                  onClick={resetGame}
                  className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-3 border border-gray-300">
              <canvas
                ref={canvasRef}
                className="w-full max-w-none border border-gray-600 rounded bg-gray-900"
                style={{ imageRendering: 'pixelated', maxHeight: '400px' }}
              />
              <div className="text-center mt-2 text-gray-400 text-xs">
                Arrow Keys: Move • SPACE: Shoot • Destroy all aliens!
              </div>
            </div>

            {gameOver && (
              <div className="text-center mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-lg font-semibold text-red-700 mb-1">Game Over!</h4>
                <p className="text-red-600 text-sm">Final Score: {score} | Level: {level}</p>
                {score > highScore && (
                  <p className="text-orange-500 font-medium text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}

            {gameWon && (
              <div className="text-center mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-lg font-semibold text-green-700 mb-1">Level Complete! 🚀</h4>
                <p className="text-green-600 text-sm">Score: {score} | Ready for Level {level + 1}?</p>
                {score > highScore && (
                  <p className="text-orange-500 font-medium text-sm mt-1">🎉 New High Score!</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceInvadersGame;