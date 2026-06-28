import React, { useMemo, useState } from 'react';
import { ArrowLeft, Banknote, Calendar, Percent, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DepositCalculatorProps {
  onBack: () => void;
}

type PayoutMode = 'MATURITY' | 'MONTHLY';

export function DepositCalculator({ onBack }: DepositCalculatorProps) {
  const [amount, setAmount] = useState<string>('100000000');
  const [term, setTerm] = useState<string>('12');
  const [rate, setRate] = useState<string>('4.8');
  const [payoutMode, setPayoutMode] = useState<PayoutMode>('MATURITY');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const amountNum = Number(amount.replace(/[,.\s]/g, ''));
  const termNum = parseInt(term, 10);
  const rateNum = parseFloat(rate);

  const result = useMemo(() => {
    if (!amountNum || !termNum || Number.isNaN(rateNum) || rateNum < 0) return null;
    const monthlyInterest = amountNum * (rateNum / 100) / 12;
    const grossInterest = monthlyInterest * termNum;
    const tax = 0;
    return {
      monthlyInterest: Math.round(monthlyInterest),
      grossInterest: Math.round(grossInterest),
      tax,
      netInterest: Math.round(grossInterest - tax),
      total: Math.round(amountNum + grossInterest - tax),
    };
  }, [amountNum, termNum, rateNum]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val);

  const validate = () => {
    setTouched(true);
    if (Number.isNaN(amountNum) || amountNum <= 0) return setError('Vui lòng nhập số tiền gửi hợp lệ.');
    if (Number.isNaN(termNum) || termNum <= 0) return setError('Vui lòng chọn kỳ hạn gửi hợp lệ.');
    if (Number.isNaN(rateNum) || rateNum < 0) return setError('Vui lòng nhập lãi suất hợp lệ.');
    setError('');
  };

  return (
    <div className="flex flex-col h-full bg-[#071225] text-slate-200">
      <header className="h-16 border-b border-white/10 bg-[#0d1b35]/95 px-4 flex items-center shrink-0 backdrop-blur">
        <button onClick={onBack} className="mr-3 w-9 h-9 rounded-full border border-blue-400/30 flex items-center justify-center bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Tính lãi tiền gửi</h2>
          <p className="text-[10px] text-blue-200/70">Ước tính nhanh, rõ gốc - lãi - tổng nhận</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#0f2e5e] via-[#0d1b35] to-[#111827] p-5 shadow-2xl">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="relative mb-5 flex items-start gap-3">
            <div className="rounded-2xl bg-white/10 p-3 text-blue-200"><Sparkles className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display text-lg font-black uppercase text-white">Bộ tính chuyên nghiệp</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">Nhập số tiền, kỳ hạn và lãi suất để xem lãi tạm tính theo tháng hoặc cuối kỳ.</p>
            </div>
          </div>

          <div className="space-y-4 relative">
            <Field icon={<Banknote className="h-4 w-4" />} label="Số tiền gửi (VND)">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} onBlur={validate} placeholder="Ví dụ: 100000000" className="pro-input" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field icon={<Calendar className="h-4 w-4" />} label="Kỳ hạn">
                <select value={term} onChange={(e) => setTerm(e.target.value)} onBlur={validate} className="pro-input appearance-none">
                  {[1, 2, 3, 6, 9, 12, 18, 24, 36].map(m => <option key={m} value={m}>{m} tháng</option>)}
                </select>
              </Field>
              <Field icon={<Percent className="h-4 w-4" />} label="Lãi suất/năm">
                <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} onBlur={validate} placeholder="0.0" className="pro-input" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-1">
              <button onClick={() => setPayoutMode('MATURITY')} className={`rounded-xl py-2 text-[11px] font-bold uppercase transition ${payoutMode === 'MATURITY' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-300'}`}>Cuối kỳ</button>
              <button onClick={() => setPayoutMode('MONTHLY')} className={`rounded-xl py-2 text-[11px] font-bold uppercase transition ${payoutMode === 'MONTHLY' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-300'}`}>Nhận hàng tháng</button>
            </div>

            {error && touched && <p className="text-red-300 text-xs font-medium">{error}</p>}
            <button onClick={validate} className="w-full rounded-2xl bg-gradient-to-r from-[#0066c9] to-[#00a3ff] py-3 text-xs font-black uppercase text-white shadow-lg shadow-blue-950/40">Cập nhật kết quả</button>
          </div>
        </motion.div>

        {result && !error && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">{payoutMode === 'MONTHLY' ? 'Lãi nhận mỗi tháng' : 'Tổng lãi cuối kỳ'}</p>
              <p className="mt-2 text-3xl font-black text-white">{formatCurrency(payoutMode === 'MONTHLY' ? result.monthlyInterest : result.netInterest)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Tổng lãi" value={formatCurrency(result.netInterest)} />
              <Metric label="Gốc + lãi" value={formatCurrency(result.total)} />
            </div>
            <p className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[10px] leading-relaxed text-slate-400">Kết quả chỉ mang tính tham khảo; lãi suất và điều kiện thực tế áp dụng theo quy định VietinBank tại thời điểm giao dịch.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blue-100/70">{icon}{label}</span>{children}</label>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"><p className="text-[10px] font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-sm font-black text-white">{value}</p></div>;
}
