import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Star } from 'lucide-react';

export default function CosmicDefender() {
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
    shields: [],
    powerUps: [],
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
    game.shields = [];
    game.powerUps = [];
    game.alienDirection = 1;
    game.alienSpeed = 1 + (level - 1) * 0.3;
    game.alienBulletDelay = Math.max(300, 1000 - (level - 1) * 100);

    // Aliens
    const rows = 5;
    const cols = 10;
    const alienWidth = 30;
    const alienHeight = 20;
    const spacing = 10;
    const gridWidth = cols * (alienWidth + spacing) - spacing;
    const startX = (GAME_WIDTH - gridWidth) / 2;
    const startY = 80;
    const colors = ['#ff4d4d', '#ff9933', '#ffff66', '#66ff66', '#66ccff'];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        game.aliens.push({
          x: startX + col * (alienWidth + spacing),
          y: startY + row * (alienHeight + spacing),
          width: alienWidth,
          height: alienHeight,
          color: colors[row],
          points: (rows - row) * 10,
          alive: true
        });
      }
    }

    // Shields
    for (let s = 0; s < 4; s++) {
      game.shields.push({
        x: 120 + s * 160,
        y: GAME_HEIGHT - 120,
        width: 60,
        height: 30,
        health: 5
      });
    }
  }, [level]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const game = gameStateRef.current;

    // Clear
    ctx.fillStyle = '#000020';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars background
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % GAME_WIDTH;
      const y = (i * 71) % GAME_HEIGHT;
      if (Math.sin(i + Date.now() * 0.001) > 0.9) ctx.fillRect(x, y, 2, 2);
    }

    // Player
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
    ctx.fillRect(game.player.x + 10, game.player.y - 8, 10, 8);

    // Bullets
    ctx.fillStyle = '#ffff00';
    game.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Aliens
    game.aliens.forEach(a => {
      if (!a.alive) return;
      ctx.fillStyle = a.color;
      ctx.fillRect(a.x, a.y, a.width, a.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(a.x + 6, a.y + 5, 3, 3);
      ctx.fillRect(a.x + a.width - 9, a.y + 5, 3, 3);
    });

    // Alien bullets
    ctx.fillStyle = '#ff0000';
    game.alienBullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

    // Shields
    game.shields.forEach(s => {
      if (s.health > 0) {
        ctx.fillStyle = `rgba(0,255,0,${s.health / 5})`;
        ctx.fillRect(s.x, s.y, s.width, s.height);
      }
    });

    // Power-ups
    game.powerUps.forEach(p => {
      ctx.fillStyle = p.type === 'life' ? '#00ff00' : '#00aaff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
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
      game.bullets.push({ x: game.player.x + game.player.width / 2 - 2, y: game.player.y, width: 4, height: 10, speed: 8 });
      game.lastBulletTime = Date.now();
    }

    // Bullets
    game.bullets = game.bullets.filter(b => { b.y -= b.speed; return b.y > -b.height; });

    // Aliens move
    let hitEdge = false;
    const liveAliens = game.aliens.filter(a => a.alive);
    liveAliens.forEach(a => { a.x += game.alienDirection * game.alienSpeed; if (a.x <= 0 || a.x >= GAME_WIDTH - a.width) hitEdge = true; });
    if (hitEdge) { game.alienDirection *= -1; liveAliens.forEach(a => a.y += game.alienDropDistance); }

    // Alien shooting
    if (liveAliens.length > 0 && Date.now() - game.lastAlienBulletTime > game.alienBulletDelay) {
      const shooter = liveAliens[Math.floor(Math.random() * liveAliens.length)];
      game.alienBullets.push({ x: shooter.x + shooter.width / 2 - 2, y: shooter.y + shooter.height, width: 4, height: 8, speed: 3 + level * 0.5 });
      game.lastAlienBulletTime = Date.now();
    }

    // Alien bullets
    game.alienBullets = game.alienBullets.filter(b => { b.y += b.speed; return b.y < GAME_HEIGHT; });

    // Collisions: bullets vs aliens
    for (let i = game.bullets.length - 1; i >= 0; i--) {
      const b = game.bullets[i];
      let hit = false;
      for (let j = game.aliens.length - 1; j >= 0; j--) {
        const a = game.aliens[j];
        if (!a.alive) continue;
        if (b.x < a.x + a.width && b.x + b.width > a.x && b.y < a.y + a.height && b.y + b.height > a.y) {
          a.alive = false;
          setScore(prev => prev + a.points);
          if (Math.random() < 0.1) game.powerUps.push({ x: a.x, y: a.y, type: Math.random() < 0.5 ? 'life' : 'rapid', speed: 2 });
          hit = true;
          break;
        }
      }
      if (hit) game.bullets.splice(i, 1);
    }

    // Collisions: alien bullets vs shields/player
    for (let i = game.alienBullets.length - 1; i >= 0; i--) {
      const b = game.alienBullets[i];
      let blocked = false;

      // Shields
      for (const s of game.shields) {
        if (s.health > 0 && b.x < s.x + s.width && b.x + b.width > s.x && b.y < s.y + s.height && b.y + b.height > s.y) {
          s.health -= 1;
          blocked = true;
          break;
        }
      }

      // Player
      if (!blocked && b.x < game.player.x + game.player.width && b.x + b.width > game.player.x && b.y < game.player.y + game.player.height && b.y + b.height > game.player.y) {
        setLives(prev => prev - 1);
        blocked = true;
      }

      if (blocked) game.alienBullets.splice(i, 1);
    }

    // Power-up collection
    for (let i = game.powerUps.length - 1; i >= 0; i--) {
      const p = game.powerUps[i];
      p.y += p.speed;
      if (p.y > GAME_HEIGHT) { game.powerUps.splice(i, 1); continue; }
      if (p.x > game.player.x && p.x < game.player.x + game.player.width && p.y > game.player.y && p.y < game.player.y + game.player.height) {
        if (p.type === 'life') setLives(prev => prev + 1);
        if (p.type === 'rapid') game.bulletDelay = Math.max(80, game.bulletDelay - 50);
        game.powerUps.splice(i, 1);
      }
    }

    // Lose condition
    if (liveAliens.some(a => a.y + a.height >= game.player.y)) setLives(0);

    // Win condition
    if (game.aliens.every(a => !a.alive)) {
      setGameWon(true);
      setIsPlaying(false);
      if (score > highScore) setHighScore(score);
    }
  }, [isPlaying, gameOver, gameWon, level, score, highScore]);

  const gameLoop = useCallback(() => { update(); draw(); animationRef.current = requestAnimationFrame(gameLoop); }, [update, draw]);

  useEffect(() => { const canvas = canvasRef.current; if (canvas) { canvas.width = GAME_WIDTH; canvas.height = GAME_HEIGHT; } }, []);
  useEffect(() => { if (isPlaying && !gameOver && !gameWon) { initGame(); animationRef.current = requestAnimationFrame(gameLoop); } else if (animationRef.current) cancelAnimationFrame(animationRef.current); return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); }; }, [isPlaying, gameOver, gameWon, initGame, gameLoop]);
  useEffect(() => { if (lives <= 0 && isPlaying) { setGameOver(true); setIsPlaying(false); if (score > highScore) setHighScore(score); } }, [lives, isPlaying, score, highScore]);
  useEffect(() => { const handleKeyDown = e => { keysRef.current[e.code] = true; if (e.code === 'Space') e.preventDefault(); }; const handleKeyUp = e => keysRef.current[e.code] = false; window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp); return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); }; }, []);

  const handleTouchStart = control => () => touchControlsRef.current[control] = true;
  const handleTouchEnd = control => () => touchControlsRef.current[control] = false;

  const startGame = () => { setScore(0); setLives(3); setLevel(1); setGameOver(false); setGameWon(false); setIsPlaying(true); };
  const nextLevel = () => { setLevel(prev => prev + 1); setGameWon(false); setIsPlaying(true); };
  const resetGame = () => { setScore(0); setLives(3); setLevel(1); setGameOver(false); setGameWon(false); setIsPlaying(false); };

  return (
    <div className="py-6 sm:py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            ⭐ Cosmic Defender ⭐
          </h3>
          <p className="text-base sm:text-lg text-gray-600 italic font-medium">Protect humanity with shields and power-ups!</p>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-700 relative">
          <div className="flex flex-wrap justify-between items-center mb-4 text-sm text-white">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-1"><Trophy className="text-yellow-400" size={16} /><span>High: {highScore}</span></div>
              <div className="text-green-400">Score: {score}</div>
              <div className="text-blue-400">Level: {level}</div>
              <div className="text-red-400">Lives: {lives}</div>
            </div>
            <div className="flex space-x-2">
              {!isPlaying && !gameOver && !gameWon && (<button onClick={startGame} className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"><Play size={14} /><span>Start</span></button>)}
              {gameWon && (<button onClick={nextLevel} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium">Next Level</button>)}
              <button onClick={resetGame} className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium"><RotateCcw size={14} /><span>Reset</span></button>
            </div>
          </div>

          <div className="relative bg-black rounded border-2 border-gray-600">
            <canvas ref={canvasRef} className="block mx-auto max-w-full h-auto" style={{ imageRendering: 'pixelated', aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}` }} />
            <div className="md:hidden absolute bottom-4 left-0 right-0 px-4">
              <div className="flex justify-between items-end">
                <div className="flex gap-3">
                  <button onTouchStart={handleTouchStart('left')} onTouchEnd={handleTouchEnd('left')} className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">◀</button>
                  <button onTouchStart={handleTouchStart('right')} onTouchEnd={handleTouchEnd('right')} className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">▶</button>
                </div>
                <button onTouchStart={handleTouchStart('shoot')} onTouchEnd={handleTouchEnd('shoot')} className="w-16 h-16 bg
