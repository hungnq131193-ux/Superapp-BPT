import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface LoanCalculatorProps {
  onBack: () => void;
}

interface ScheduleItem {
  period: number;
  date: string;
  remainingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}

export function LoanCalculator({ onBack }: LoanCalculatorProps) {
  const [amount, setAmount] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [schedule, setSchedule] = useState<ScheduleItem[] | null>(null);
  const [summary, setSummary] = useState<{totalInterest: number, totalPayment: number} | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Math.round(val));
  };

  const handleCalculate = () => {
    const amountNum = parseFloat(amount);
    const termNum = parseInt(term, 10);
    const rateNum = parseFloat(rate);
    const dateObj = new Date(startDate);

    if (!amountNum || amountNum <= 0 || !termNum || termNum <= 0 || !rateNum || rateNum < 0) {
      alert("Vui lòng nhập đầy đủ và chính xác các thông tin hợp lệ.");
      return;
    }

    const principalPerMonth = amountNum / termNum;
    const monthlyRate = (rateNum / 100) / 12;
    
    let currentPrincipal = amountNum;
    let totalInterest = 0;
    const newSchedule: ScheduleItem[] = [];

    for (let i = 1; i <= termNum; i++) {
      const interest = currentPrincipal * monthlyRate;
      totalInterest += interest;
      
      const pDate = new Date(dateObj);
      pDate.setMonth(pDate.getMonth() + i);
      const dateStr = pDate.toLocaleDateString('vi-VN');

      newSchedule.push({
        period: i,
        date: dateStr,
        remainingPrincipal: currentPrincipal,
        principalPayment: principalPerMonth,
        interestPayment: interest,
        totalPayment: principalPerMonth + interest
      });

      currentPrincipal -= principalPerMonth;
    }

    setSchedule(newSchedule);
    setSummary({
      totalInterest,
      totalPayment: amountNum + totalInterest
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Lịch Trả Nợ Dự Kiến</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d1428] rounded-2xl border border-blue-900/30 p-5 shrink-0"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Số tiền vay (VND)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền vay..."
                className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Thời gian vay (Tháng)</label>
                <input 
                  type="number"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="24"
                  className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Lãi suất (%/Năm)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="8.5"
                  className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-2">Ngày giải ngân</label>
              <input 
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-blue-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
              />
            </div>

            <button 
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-lg transition-colors mt-2"
            >
              XEM LỊCH CHI TIẾT
            </button>
          </div>
        </motion.div>

        {summary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 shrink-0 flex flex-col gap-2"
          >
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase">Tổng lãi phải trả:</span>
              <span className="font-mono text-white">{formatCurrency(summary.totalInterest)} VND</span>
            </div>
            <div className="flex justify-between text-xs mt-2 border-t border-white/5 pt-2">
              <span className="text-slate-400 font-bold uppercase">Tổng gốc + lãi:</span>
              <span className="font-mono text-lg text-blue-400 font-bold">{formatCurrency(summary.totalPayment)} VND</span>
            </div>
          </motion.div>
        )}

        {schedule && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d1428] rounded-2xl border border-blue-900/30 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-white/5 text-[10px] uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="p-3 text-center w-12">Kỳ</th>
                    <th className="p-3">Ngày trả</th>
                    <th className="p-3">Số gốc còn lại</th>
                    <th className="p-3">Gốc</th>
                    <th className="p-3">Lãi</th>
                    <th className="p-3 text-right">Tổng trả</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-mono">
                  {schedule.map((row) => (
                    <tr key={row.period} className="border-t border-white/5 hover:bg-white/5">
                      <td className="p-3 text-center text-slate-500">{row.period}</td>
                      <td className="p-3">{row.date}</td>
                      <td className="p-3 text-slate-300">{formatCurrency(row.remainingPrincipal)}</td>
                      <td className="p-3 text-slate-300">{formatCurrency(row.principalPayment)}</td>
                      <td className="p-3 text-slate-300">{formatCurrency(row.interestPayment)}</td>
                      <td className="p-3 text-right text-blue-400 font-bold">{formatCurrency(row.totalPayment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
