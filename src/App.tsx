/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewState } from './types';
import { FAQ } from './components/FAQ';
import { DepositCalculator } from './components/DepositCalculator';
import { LoanCalculator } from './components/LoanCalculator';
import { Locations } from './components/Locations';
import { MiniGames } from './components/MiniGames';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Calculator, CalendarDays, Map, Gamepad2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('MENU');

  const backToMenu = () => setCurrentView('MENU');

  return (
    <div className="w-full min-h-screen bg-[#0a0e1a] flex justify-center items-center font-sans text-slate-200">
      <div className="w-full max-w-[420px] h-[100dvh] bg-[#0a0e1a] shadow-2xl relative overflow-hidden flex flex-col border-x border-blue-900/50">
        <AnimatePresence mode="wait">
          {currentView === 'MENU' && (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <header className="pt-12 pb-6 px-6 border-b border-blue-900/50 bg-[#0d1428] rounded-b-2xl shadow-md">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src="https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png" 
                    alt="VietinBank" 
                    className="h-10 object-contain"
                  />
                  <span className="text-sm text-blue-400 font-bold uppercase tracking-wider leading-tight border-l border-blue-500/30 pl-4 py-1">Chi nhánh<br/>Bắc Phú Thọ</span>
                </div>
                <h1 className="text-xl font-bold font-display tracking-tight text-white uppercase mt-4">Xin chào Quý khách!</h1>
                <p className="text-[10px] text-blue-400 font-medium uppercase tracking-[0.2em] mt-1">Vui lòng chọn dịch vụ bạn cần hỗ trợ hôm nay.</p>
              </header>

              <div className="flex-1 overflow-y-auto px-5 pt-8 pb-10 space-y-4">
                <MenuCard 
                  icon={<HelpCircle className="w-6 h-6 text-[#005aa9]" />}
                  title="Hướng dẫn dịch vụ"
                  desc="Giải đáp thắc mắc Ipay, thẻ, CCCD..."
                  onClick={() => setCurrentView('FAQ')}
                />
                <MenuCard 
                  icon={<Calculator className="w-6 h-6 text-[#005aa9]" />}
                  title="Tính lãi tiền gửi"
                  desc="Tra cứu nhanh tiền lãi nhận được"
                  onClick={() => setCurrentView('DEPOSIT')}
                />
                <MenuCard 
                  icon={<CalendarDays className="w-6 h-6 text-[#005aa9]" />}
                  title="Lịch trả nợ hàng tháng"
                  desc="Dư nợ giảm dần"
                  onClick={() => setCurrentView('LOAN')}
                />
                <MenuCard 
                  icon={<Map className="w-6 h-6 text-[#005aa9]" />}
                  title="Mạng lưới Chi nhánh"
                  desc="Địa chỉ và bản đồ các PGD"
                  onClick={() => setCurrentView('LOCATIONS')}
                />
                
                <div className="relative mt-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                  <button 
                    onClick={() => setCurrentView('GAME')}
                    className="relative w-full h-32 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl p-4 overflow-hidden group transition-transform hover:scale-[1.02] text-left"
                  >
                    <div className="relative z-10 h-full flex flex-col justify-center">
                      <p className="text-[10px] font-bold text-white/70 uppercase flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> Mini Game</p>
                      <h3 className="text-lg font-black font-display text-white leading-tight mt-1">GIẢI TRÍ<br/>& NHẬN QUÀ</h3>
                      <p className="text-[10px] text-white/80 mt-2">Chơi Flappy Bird hoặc Snake cổ điển!</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'FAQ' && <FAQ onBack={backToMenu} />}
          {currentView === 'DEPOSIT' && <DepositCalculator onBack={backToMenu} />}
          {currentView === 'LOAN' && <LoanCalculator onBack={backToMenu} />}
          {currentView === 'LOCATIONS' && <Locations onBack={backToMenu} />}
          {currentView === 'GAME' && <MiniGames onBack={backToMenu} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MenuCard({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full bg-[#0d1428] border border-blue-900/30 rounded-2xl p-4 flex items-center gap-4 hover:bg-blue-500/10 transition-all text-left"
    >
      <div className="w-10 h-10 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-bold font-display text-white uppercase tracking-wide">{title}</h3>
        <p className="text-[10px] text-slate-400 mt-1">{desc}</p>
      </div>
    </button>
  );
}

