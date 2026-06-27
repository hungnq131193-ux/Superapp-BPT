import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Gift, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameProps {
  onBack: () => void;
}

// Game states
type GameState = 'START' | 'PLAYING' | 'GAME_OVER' | 'CLAIM' | 'SUCCESS';

// Constants
const GRAVITY = 0.5;
const JUMP = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 2.5;

export function Game({ onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Claim form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [voucherCodes, setVoucherCodes] = useState<string[]>([]);
  const [rewardMessage, setRewardMessage] = useState('');

  // Physics state (refs for synchronous updates in requestAnimationFrame)
  const birdRef = useRef({ x: 50, y: 150, velocity: 0, radius: 14 });
  const pipesRef = useRef<{x: number, y: number, passed: boolean}[]>([]);
  const frameRef = useRef(0);
  const scoreRef = useRef(0);

  // Scenery refs
  const starsRef = useRef<{x: number, y: number, color: string, size: number}[]>([]);
  const buildingsRef = useRef<{w: number, h: number, gap: number}[]>([]);
  const ghostsRef = useRef<{x: number, y: number, speed: number, offset: number}[]>([]);

  // Initialize game
  const resetGame = () => {
    birdRef.current = { x: 50, y: 150, velocity: 0, radius: 14 };
    pipesRef.current = [];
    frameRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
  };

  const startGame = () => {
    resetGame();
    setGameState('PLAYING');
  };

  const jump = () => {
    if (gameState === 'PLAYING') {
      birdRef.current.velocity = JUMP;
    } else if (gameState === 'START') {
      startGame();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (starsRef.current.length === 0) {
      for(let i=0; i<30; i++) {
        starsRef.current.push({
            x: Math.random() * 360,
            y: Math.random() * 350,
            color: Math.random() > 0.5 ? '#ffffff' : '#fced60',
            size: Math.random() > 0.5 ? 2 : 3
        });
      }
      let w = 0;
      while(w < 360) {
        let bw = 30 + Math.random() * 40;
        let h = 30 + Math.random() * 80;
        let gap = Math.random() * 10;
        buildingsRef.current.push({w: bw, h, gap});
        w += bw + gap;
      }
      for(let i=0; i<3; i++) {
        ghostsRef.current.push({
            x: 100 + Math.random() * 200,
            y: 50 + Math.random() * 200,
            speed: 0.5 + Math.random() * 0.5,
            offset: Math.random() * Math.PI * 2
        });
      }
    }

    const drawBird = (x: number, y: number, radius: number, velocity: number) => {
      ctx.save();
      ctx.translate(x, y);
      const rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (velocity * 0.1)));
      ctx.rotate(rotation);
      
      // Outline
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#f4b324';
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Wing
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(-4, 2, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.stroke();

      // Beak
      ctx.fillStyle = '#e23122';
      ctx.beginPath();
      ctx.moveTo(radius - 2, -3);
      ctx.lineTo(radius + 8, 1);
      ctx.lineTo(radius - 2, 5);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(radius - 2, 1);
      ctx.lineTo(radius + 7, 1);
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(4, -4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(6, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawPipe = (px: number, py: number, pw: number, ph: number, isTop: boolean) => {
      ctx.fillStyle = '#73bf2e';
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = '#9cde45';
      ctx.fillRect(px + 4, py, 6, ph);
      ctx.fillStyle = '#538b1f';
      ctx.fillRect(px + pw - 10, py, 6, ph);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, pw, ph);

      const capH = 24;
      const capY = isTop ? (py + ph - capH) : py;
      const capX = px - 4;
      const capW = pw + 8;
      
      ctx.fillStyle = '#73bf2e';
      ctx.fillRect(capX, capY, capW, capH);
      ctx.fillStyle = '#9cde45';
      ctx.fillRect(capX + 4, capY + 2, 6, capH - 4);
      ctx.fillStyle = '#538b1f';
      ctx.fillRect(capX + capW - 10, capY + 2, 6, capH - 4);
      ctx.strokeRect(capX, capY, capW, capH);
    };

    const drawRepeating = (drawFn: () => void, speed: number) => {
      const offset = (frameRef.current * speed) % canvas.width;
      ctx.save();
      ctx.translate(-offset, 0);
      drawFn();
      ctx.translate(canvas.width, 0);
      drawFn();
      ctx.translate(canvas.width, 0);
      drawFn();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sky background
      ctx.fillStyle = '#313b63';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Stars
      starsRef.current.forEach(star => {
        ctx.fillStyle = star.color;
        if (star.size > 2) {
          ctx.fillRect(star.x - 1, star.y, 3, 1);
          ctx.fillRect(star.x, star.y - 1, 1, 3);
        } else {
          ctx.fillRect(star.x, star.y, star.size, star.size);
        }
      });

      // Clouds
      drawRepeating(() => {
        ctx.fillStyle = '#495a82';
        ctx.beginPath();
        for(let x=0; x<canvas.width; x+=40) ctx.arc(x, canvas.height - 130, 30, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#5d739e';
        ctx.beginPath();
        for(let x=20; x<canvas.width; x+=40) ctx.arc(x, canvas.height - 110, 35, 0, Math.PI*2);
        ctx.fill();
        ctx.fillRect(0, canvas.height - 110, canvas.width, 110);
      }, 0.2);

      // City
      drawRepeating(() => {
        ctx.fillStyle = '#657a9e';
        let cx = 0;
        buildingsRef.current.forEach(b => {
          ctx.fillRect(cx, canvas.height - 90 - b.h, b.w, b.h);
          cx += b.w + b.gap;
        });
      }, 0.5);

      // Bushes
      drawRepeating(() => {
        ctx.fillStyle = '#29822a';
        ctx.beginPath();
        for(let x=0; x<=canvas.width; x+=30) ctx.arc(x, canvas.height - 70, 20, 0, Math.PI*2);
        ctx.fill();
        ctx.fillRect(0, canvas.height - 70, canvas.width, 70);
      }, 1);

      // Ghosts
      ghostsRef.current.forEach(g => {
        if(gameState === 'PLAYING') g.x -= g.speed;
        if(g.x < -30) g.x = canvas.width + 30;
        const gy = g.y + Math.sin(frameRef.current * 0.05 + g.offset) * 10;
        
        ctx.save();
        ctx.translate(g.x, gy);
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -5, 10, Math.PI, 0);
        ctx.lineTo(10, 5);
        ctx.lineTo(5, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(-5, 10);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(2, -3, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(3, -4, 1, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      });

      if (gameState === 'START') {
        drawBird(birdRef.current.x, birdRef.current.y, birdRef.current.radius, 0);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.strokeText('CHẠM ĐỂ CHƠI', canvas.width/2, canvas.height/2);
        ctx.fillText('CHẠM ĐỂ CHƠI', canvas.width/2, canvas.height/2);
      } else if (gameState === 'PLAYING' || gameState === 'GAME_OVER') {
        if (gameState === 'PLAYING') {
          birdRef.current.velocity += GRAVITY;
          birdRef.current.y += birdRef.current.velocity;

          if (frameRef.current % 120 === 0) {
            const minHeight = 60;
            const maxHeight = canvas.height - 50 - PIPE_GAP - minHeight;
            const y = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            pipesRef.current.push({ x: canvas.width, y: y, passed: false });
          }

          for (let i = 0; i < pipesRef.current.length; i++) {
            let p = pipesRef.current[i];
            p.x -= PIPE_SPEED;

            const b = birdRef.current;
            if (b.x + b.radius > p.x && b.x - b.radius < p.x + PIPE_WIDTH && b.y - b.radius < p.y) {
              setGameState('GAME_OVER');
            }
            if (b.x + b.radius > p.x && b.x - b.radius < p.x + PIPE_WIDTH && b.y + b.radius > p.y + PIPE_GAP) {
              setGameState('GAME_OVER');
            }

            if (p.x + PIPE_WIDTH < b.x && !p.passed) {
              p.passed = true;
              scoreRef.current += 1;
              setScore(scoreRef.current);
            }
          }

          if (birdRef.current.y + birdRef.current.radius > canvas.height - 50 || birdRef.current.y - birdRef.current.radius < 0) {
            setGameState('GAME_OVER');
          }

          pipesRef.current = pipesRef.current.filter(p => p.x + PIPE_WIDTH > 0);
          frameRef.current++;
        }

        pipesRef.current.forEach(p => {
          drawPipe(p.x, 0, PIPE_WIDTH, p.y, true);
          drawPipe(p.x, p.y + PIPE_GAP, PIPE_WIDTH, canvas.height - 50 - (p.y + PIPE_GAP), false);
        });

        drawBird(birdRef.current.x, birdRef.current.y, birdRef.current.radius, birdRef.current.velocity);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Impact, sans-serif';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.strokeText(scoreRef.current.toString(), canvas.width/2, 80);
        ctx.fillText(scoreRef.current.toString(), canvas.width/2, 80);
      }

      // Ground
      const groundOffset = (frameRef.current * PIPE_SPEED) % 40;
      ctx.fillStyle = '#dfaf76';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
      ctx.fillStyle = '#8bd13e';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 12);
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 50);
      ctx.lineTo(canvas.width, canvas.height - 50);
      ctx.moveTo(0, canvas.height - 38);
      ctx.lineTo(canvas.width, canvas.height - 38);
      ctx.stroke();

      ctx.beginPath();
      for(let x = -groundOffset; x < canvas.width + 40; x += 20) {
        ctx.moveTo(x, canvas.height - 50);
        ctx.lineTo(x, canvas.height - 38);
      }
      ctx.stroke();

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  // Handle Game Over Side Effects
  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      if (score > highScore) setHighScore(score);
    }
  }, [gameState, score, highScore]);

  // Handle Claim Submission
  const submitClaim = () => {
    if (!name || !phone) {
      setErrorMsg('Vui lòng nhập đầy đủ họ tên và số điện thoại.');
      return;
    }
    if (!/^0\d{9}$/.test(phone)) {
      setErrorMsg('Số điện thoại không hợp lệ (gồm 10 chữ số, bắt đầu bằng 0).');
      return;
    }
    if (!agree) {
      setErrorMsg('Vui lòng đồng ý với điều kiện chương trình.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // Simulate backend call to Google Apps Script
    setTimeout(() => {
      let count = 0;
      if (score >= 50) count = 2;
      else if (score >= 30) count = 1;

      if (count > 0) {
        // Generate mock codes for preview
        const codes = Array.from({length: count}, () => 
          `VTB-XANG-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,8).toUpperCase()}`
        );
        
        setVoucherCodes(codes);
        setRewardMessage(`Xuất sắc! Quý khách nhận được ${count} voucher 2 lít xăng.`);
        setGameState('SUCCESS');
      } else {
        setErrorMsg('Điểm chưa đủ điều kiện nhận voucher.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200 select-none">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0 z-10">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Vòng Quay May Mắn</h2>
      </header>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* The Game Canvas */}
        <div 
          className="flex-1 relative touch-none"
          onPointerDown={jump}
        >
          <canvas 
            ref={canvasRef} 
            width={360} 
            height={600} 
            className="w-full h-full object-cover"
          />
          
          {/* Game Over UI Overlay */}
          <AnimatePresence>
            {gameState === 'GAME_OVER' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-[#0a0e1a]/80 backdrop-blur-sm flex items-center justify-center p-6 z-20"
              >
                <div className="bg-[#0d1428] border border-blue-900/50 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl">
                  <h3 className="text-2xl font-black font-display text-[#ed1c24] mb-2 uppercase tracking-wide">Trò Chơi Kết Thúc</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Bạn đạt <span className="text-white text-xl">{score}</span> điểm</p>
                  
                  {score >= 30 ? (
                    <div className="mb-6 p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 rounded-xl border border-green-500/30">
                      <Gift className="w-8 h-8 mx-auto mb-2 text-green-400" />
                      <p className="font-bold text-white uppercase tracking-wide">Chúc mừng!</p>
                      <p className="text-xs text-green-300 mt-1">Bạn đủ điều kiện nhận {score >= 50 ? '2' : '1'} voucher 2 lít xăng</p>
                      <button 
                        onClick={() => setGameState('CLAIM')}
                        className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-bold text-xs uppercase transition"
                      >
                        Nhận thưởng ngay
                      </button>
                    </div>
                  ) : (
                    <div className="mb-6 text-slate-400">
                      <p className="text-sm">Cố thêm chút nữa để nhận voucher nhé!</p>
                      <p className="text-[10px] mt-1 uppercase">(30 điểm = 1 voucher, 50 điểm = 2 voucher)</p>
                    </div>
                  )}

                  <button 
                    onClick={startGame}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-xs uppercase transition"
                  >
                    Chơi lại
                  </button>
                </div>
              </motion.div>
            )}

            {/* Claim Form Overlay */}
            {gameState === 'CLAIM' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-[#0a0e1a] text-slate-200 flex flex-col z-30"
              >
                <div className="p-4 border-b border-blue-900/30 bg-[#0d1428] flex items-center">
                  <button onClick={() => setGameState('GAME_OVER')} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h3 className="font-bold font-display text-sm text-white uppercase tracking-wider">Nhận phần thưởng</h3>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="bg-gradient-to-br from-[#005baa]/20 to-[#ed1c24]/20 border border-blue-500/20 p-4 rounded-xl mb-6 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thành tích: <span className="text-white text-base">{score}</span> điểm</p>
                    <p className="text-sm font-bold text-white uppercase">Phần thưởng: <span className="text-blue-400">{score >= 50 ? '2' : '1'} Voucher xăng 2L</span></p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Họ và tên</label>
                      <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#0d1428] border border-blue-900/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500" placeholder="Nhập họ tên..." />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-2">Số điện thoại</label>
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-[#0d1428] border border-blue-900/50 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 font-mono" placeholder="Ví dụ: 0912345678" />
                    </div>
                    <label className="flex items-start gap-3 mt-4 cursor-pointer">
                      <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 accent-blue-500 bg-[#0d1428] border-blue-900/50" />
                      <span className="text-xs text-slate-400 leading-relaxed">Tôi xác nhận thông tin trên là chính xác và đồng ý nhận voucher theo thể lệ chương trình.</span>
                    </label>
                    
                    {errorMsg && <p className="text-red-400 text-xs font-bold mt-2">{errorMsg}</p>}

                    <button 
                      onClick={submitClaim}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-xs uppercase mt-6 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Đang xử lý...' : 'Nhận mã voucher'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Overlay */}
            {gameState === 'SUCCESS' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-[#0a0e1a] text-slate-200 flex flex-col items-center justify-center p-6 z-40 text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                  <Award className="w-20 h-20 text-blue-400 relative z-10" />
                </div>
                <h3 className="text-2xl font-black font-display text-white uppercase tracking-wide mb-2">Chúc mừng!</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium">{rewardMessage}</p>
                
                <div className="w-full space-y-4 mb-8">
                  {voucherCodes.map((code, idx) => (
                    <div key={idx} className="bg-[#0d1428] border border-blue-500/30 p-5 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Mã Voucher {idx + 1}</p>
                      <p className="text-xl font-mono font-bold tracking-wider text-white">{code}</p>
                    </div>
                  ))}
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-6 px-4">
                    * Vui lòng chụp màn hình mã này và xuất trình với cán bộ VietinBank để nhận hỗ trợ.
                  </p>
                </div>

                <button 
                  onClick={startGame}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-xl font-bold text-xs uppercase transition-colors"
                >
                  Đóng & Chơi lại
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Persistent small text */}
          <div className="absolute bottom-2 left-0 right-0 text-center px-4">
            <p className="text-[10px] text-white/70 bg-black/30 inline-block px-2 py-1 rounded backdrop-blur-sm">
              Mỗi SĐT nhận tối đa 1 lần/ngày. Không cộng dồn mốc thưởng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
