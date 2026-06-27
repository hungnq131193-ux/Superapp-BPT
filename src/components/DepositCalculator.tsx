import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface DepositCalculatorProps {
  onBack: () => void;
}

export function DepositCalculator({ onBack }: DepositCalculatorProps) {
  const [amount, setAmount] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleCalculate = () => {
    setError('');
    
    const amountNum = parseFloat(amount.replace(/[,.]/g, ''));
    const termNum = parseInt(term, 10);
    const rateNum = parseFloat(rate);

    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Vui lòng nhập số tiền gửi hợp lệ.');
      return;
    }
    if (isNaN(termNum) || termNum <= 0) {
      setError('Vui lòng chọn kỳ hạn gửi hợp lệ.');
      return;
    }
    if (isNaN(rateNum) || rateNum < 0) {
      setError('Vui lòng nhập lãi suất hợp lệ.');
      return;
    }

    // Formula: Lãi = Số tiền * (Lãi suất / 100) * (Kỳ hạn / 12)
    const interest = Math.round(amountNum * (rateNum / 100) * (termNum / 12));
    const total = amountNum + interest;

    setResult({ interest, total });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Tính Toán Lãi Tiền Gửi</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d1428] rounded-2xl border border-blue-900/30 p-5 md:p-6 mb-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Số tiền gửi (VND)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền..."
                className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Kỳ hạn (Tháng)</label>
                <select 
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="" className="text-slate-500">Chọn kỳ hạn</option>
                  {[1, 2, 3, 6, 9, 12, 18, 24, 36].map(m => (
                    <option key={m} value={m}>{m} tháng</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Lãi suất (%/năm)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-2 font-medium">{error}</p>
            )}

            <button 
              onClick={handleCalculate}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-lg transition-colors"
            >
              TÍNH TOÁN
            </button>
          </div>
        </motion.div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-5 md:p-6 text-center"
          >
            <p className="text-[10px] uppercase text-blue-400 font-bold mb-1">Tổng tiền lãi nhận được</p>
            <p className="text-3xl font-black text-white mb-1">{formatCurrency(result.interest).replace('₫', '')}</p>
            <p className="text-xs text-slate-400 mb-6">VND (Tạm tính)</p>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <span className="text-xs text-slate-400 uppercase font-bold">Tổng tiền (Gốc + Lãi)</span>
              <span className="font-bold text-sm text-white">{formatCurrency(result.total)}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
