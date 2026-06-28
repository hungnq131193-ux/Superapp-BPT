import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onBack: () => void;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type SnakeState = 'READY' | 'PLAYING' | 'GAME_OVER';
type Cell = { x: number; y: number };

const GRID = 20;
const CELL = 18;
const CANVAS = GRID * CELL;
const TICK_MS = 115;

const opposite: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

export function SnakeGame({ onBack }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Cell[]>([]);
  const foodRef = useRef<Cell>({ x: 14, y: 10 });
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const [gameState, setGameState] = useState<SnakeState>('READY');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const touchStartRef = useRef<Cell | null>(null);

  const reset = () => {
    snakeRef.current = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 },
      { x: 5, y: 10 },
    ];
    foodRef.current = { x: 14, y: 10 };
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    setScore(0);
  };

  const start = () => {
    reset();
    setGameState('PLAYING');
  };

  const placeFood = () => {
    let food: Cell;
    do {
      food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snakeRef.current.some(part => part.x === food.x && part.y === food.y));
    foodRef.current = food;
  };

  const changeDirection = (direction: Direction) => {
    if (gameState === 'READY') setGameState('PLAYING');
    if (opposite[direction] !== dirRef.current) nextDirRef.current = direction;
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') changeDirection('UP');
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') changeDirection('DOWN');
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') changeDirection('LEFT');
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') changeDirection('RIGHT');
      if (event.key === ' ' && gameState !== 'PLAYING') start();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const draw = () => {
      ctx.fillStyle = '#9bbc0f';
      ctx.fillRect(0, 0, CANVAS, CANVAS);

      ctx.fillStyle = '#8bac0f';
      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          if ((x + y) % 2 === 0) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
        }
      }

      ctx.strokeStyle = '#0f380f';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, CANVAS - 6, CANVAS - 6);

      const food = foodRef.current;
      ctx.fillStyle = '#0f380f';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#306230';
      ctx.fillRect(food.x * CELL + 6, food.y * CELL + 3, 7, 4);

      snakeRef.current.forEach((part, index) => {
        const px = part.x * CELL;
        const py = part.y * CELL;
        ctx.fillStyle = index === 0 ? '#0f380f' : '#306230';
        ctx.fillRect(px + 2, py + 2, CELL - 4, CELL - 4);
        ctx.fillStyle = '#9bbc0f';
        ctx.fillRect(px + 5, py + 5, 3, 3);
        if (index === 0) {
          ctx.fillStyle = '#9bbc0f';
          ctx.fillRect(px + 11, py + 5, 3, 3);
        }
      });

      if (gameState !== 'PLAYING') {
        ctx.fillStyle = 'rgba(15, 56, 15, 0.78)';
        ctx.fillRect(24, 132, CANVAS - 48, 96);
        ctx.fillStyle = '#f4f4c9';
        ctx.textAlign = 'center';
        ctx.font = 'bold 24px monospace';
        ctx.fillText(gameState === 'GAME_OVER' ? 'GAME OVER' : 'SNAKE', CANVAS / 2, 170);
        ctx.font = 'bold 13px monospace';
        ctx.fillText('Vuốt hoặc bấm phím để chơi', CANVAS / 2, 196);
      }
    };

    draw();
    const timer = window.setInterval(() => {
      if (gameState !== 'PLAYING') {
        draw();
        return;
      }

      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const delta = dirRef.current === 'UP' ? { x: 0, y: -1 } : dirRef.current === 'DOWN' ? { x: 0, y: 1 } : dirRef.current === 'LEFT' ? { x: -1, y: 0 } : { x: 1, y: 0 };
      const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
      const hitWall = nextHead.x < 0 || nextHead.x >= GRID || nextHead.y < 0 || nextHead.y >= GRID;
      const hitSelf = snakeRef.current.some(part => part.x === nextHead.x && part.y === nextHead.y);
      if (hitWall || hitSelf) {
        setGameState('GAME_OVER');
        setHighScore(prev => Math.max(prev, score));
        draw();
        return;
      }

      const ate = nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y;
      snakeRef.current = [nextHead, ...snakeRef.current];
      if (ate) {
        setScore(prev => {
          const next = prev + 10;
          setHighScore(high => Math.max(high, next));
          return next;
        });
        placeFood();
      } else {
        snakeRef.current.pop();
      }
      draw();
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [gameState, score]);

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200 select-none">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0 z-10">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Snake cổ điển</h2>
      </header>
      <div className="flex-1 p-5 flex flex-col items-center justify-center gap-4 bg-[#17240d]">
        <div className="w-full max-w-[360px] flex justify-between text-[#9bbc0f] font-mono font-bold text-sm uppercase">
          <span>Score {score}</span>
          <span>Best {highScore}</span>
        </div>
        <div
          className="rounded-xl p-3 bg-[#0f380f] shadow-2xl border-4 border-[#306230] touch-none"
          onPointerDown={(e) => { touchStartRef.current = { x: e.clientX, y: e.clientY }; }}
          onPointerUp={(e) => {
            if (!touchStartRef.current) return;
            const dx = e.clientX - touchStartRef.current.x;
            const dy = e.clientY - touchStartRef.current.y;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) {
              if (gameState !== 'PLAYING') start();
              return;
            }
            changeDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'RIGHT' : 'LEFT') : (dy > 0 ? 'DOWN' : 'UP'));
          }}
        >
          <canvas ref={canvasRef} width={CANVAS} height={CANVAS} className="w-full max-w-[360px] aspect-square image-render-pixelated" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-[#0f380f]">
          <span />
          <button onClick={() => changeDirection('UP')} className="bg-[#9bbc0f] rounded-lg p-3 font-black">▲</button>
          <span />
          <button onClick={() => changeDirection('LEFT')} className="bg-[#9bbc0f] rounded-lg p-3 font-black">◀</button>
          <button onClick={start} className="bg-[#9bbc0f] rounded-lg p-3 font-black"><RotateCcw className="w-5 h-5" /></button>
          <button onClick={() => changeDirection('RIGHT')} className="bg-[#9bbc0f] rounded-lg p-3 font-black">▶</button>
          <span />
          <button onClick={() => changeDirection('DOWN')} className="bg-[#9bbc0f] rounded-lg p-3 font-black">▼</button>
        </div>
      </div>
    </div>
  );
}
