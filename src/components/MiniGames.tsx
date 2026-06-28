import React, { useState } from 'react';
import { ArrowLeft, Bird, Gift, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { Game } from './Game';
import { SnakeGame } from './SnakeGame';

interface MiniGamesProps {
  onBack: () => void;
}

type SelectedGame = 'MENU' | 'FLAPPY' | 'SNAKE';

export function MiniGames({ onBack }: MiniGamesProps) {
  const [selectedGame, setSelectedGame] = useState<SelectedGame>('MENU');

  if (selectedGame === 'FLAPPY') return <Game onBack={() => setSelectedGame('MENU')} />;
  if (selectedGame === 'SNAKE') return <SnakeGame onBack={() => setSelectedGame('MENU')} />;

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0 z-10">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Mini game</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">Chọn trò chơi yêu thích</p>
        <GameChoice
          icon={<Bird className="w-8 h-8 text-yellow-300" />}
          title="Flappy Bird"
          desc="Bay qua ống xanh, đạt 50 điểm nhận voucher 1 lít xăng; đạt 70 điểm nhận voucher 2 lít xăng."
          gradient="from-sky-400 via-cyan-300 to-emerald-300"
          onClick={() => setSelectedGame('FLAPPY')}
        />
        <GameChoice
          icon={<Smartphone className="w-8 h-8 text-[#9bbc0f]" />}
          title="Rắn săn mồi"
          desc="Snake cổ điển tối ưu cho điện thoại; đạt 200 điểm cũng sẽ nhận voucher."
          gradient="from-[#0f380f] via-[#306230] to-[#9bbc0f]"
          onClick={() => setSelectedGame('SNAKE')}
        />
        <div className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 flex gap-3 text-xs text-amber-50 leading-relaxed">
          <Gift className="w-5 h-5 text-amber-300 shrink-0" />
          <p>Mốc thưởng: Flappy Bird 50 điểm nhận voucher 1 lít xăng, 70 điểm nhận voucher 2 lít xăng. Snake đạt 200 điểm nhận voucher.</p>
        </div>
      </div>
    </div>
  );
}

function GameChoice({ icon, title, desc, gradient, onClick }: { icon: React.ReactNode; title: string; desc: string; gradient: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative w-full min-h-36 rounded-3xl overflow-hidden text-left shadow-2xl border border-white/10"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-black/35 border border-white/20 flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black font-display text-white uppercase tracking-wide drop-shadow">{title}</h3>
          <p className="text-xs text-white/85 mt-2 leading-relaxed">{desc}</p>
        </div>
      </div>
    </motion.button>
  );
}
