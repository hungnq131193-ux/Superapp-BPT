import React, { useState } from 'react';
import { faqs } from '../data';
import { FAQItem } from '../types';
import { ArrowLeft, ChevronRight, Phone } from 'lucide-react';
import { motion } from 'motion/react';

interface FAQProps {
  onBack: () => void;
}

export function FAQ({ onBack }: FAQProps) {
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);

  if (selectedFAQ) {
    return (
      <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200">
        <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0">
          <button onClick={() => setSelectedFAQ(null)} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider line-clamp-1">{selectedFAQ.title}</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {selectedFAQ.steps.map((step, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="bg-[#0d1428] rounded-2xl border border-blue-900/30 p-4"
            >
              <p className="text-xs font-medium text-white whitespace-pre-line mb-3 leading-relaxed">{step.text}</p>
              {step.image && (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={step.image} alt={`Bước ${idx + 1}`} className="w-full h-auto object-contain max-h-[400px]" loading="lazy" />
                </div>
              )}
            </motion.div>
          ))}

          {selectedFAQ.videoLink && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: selectedFAQ.steps.length * 0.1 }}
              className="bg-[#0d1428] rounded-2xl border border-blue-900/30 p-4"
            >
              <h3 className="text-xs font-bold font-display text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                <span className="w-1.5 h-4 bg-blue-500 mr-2 rounded-full"></span> Video hướng dẫn
              </h3>
              <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                <iframe 
                  className="w-full h-full"
                  src={selectedFAQ.videoLink} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          )}

          {!feedbackGiven ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#0d1428] rounded-2xl p-5 border border-blue-900/30 text-center mt-8"
            >
              <p className="text-sm font-medium text-white mb-4">Khách hàng thực hiện ổn hay chưa?</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setSelectedFAQ(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Đã ổn
                </button>
                <button 
                  onClick={() => setFeedbackGiven(true)}
                  className="px-6 py-2 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors"
                >
                  Chưa ổn
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 text-red-400 p-5 rounded-2xl border border-red-500/20 mt-8"
            >
              <p className="font-bold text-sm mb-2 text-white">Cảm ơn Quý khách đã phản hồi.</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quý khách có thể liên hệ Chuyên viên tư vấn <strong className="text-slate-200">Trần Hoàng Trung</strong> – số điện thoại: 
                <a href="tel:0973874232" className="inline-flex items-center text-blue-400 font-bold mx-1">
                  <Phone className="w-3 h-3 mr-1" />
                  0973.874.232
                </a>
                để hỗ trợ trực tiếp. Em sẽ cố gắng cải thiện để phục vụ Quý khách tốt hơn!
              </p>
              <button 
                onClick={() => setSelectedFAQ(null)}
                className="mt-4 px-4 py-2 w-full bg-white/10 text-white border border-white/10 rounded-lg text-xs hover:bg-white/20 font-bold"
              >
                Quay lại
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Giải đáp thắc mắc</h2>
      </header>

      <div className="p-4 md:p-6 flex-1 overflow-y-auto">
        <h3 className="text-xs font-bold font-display text-blue-400 uppercase tracking-widest mb-4 flex items-center">
          <span className="w-1.5 h-4 bg-blue-500 mr-2 rounded-full"></span> Chọn nội dung hỗ trợ
        </h3>
        <div className="grid gap-3 md:gap-4">
          {faqs.map((faq, idx) => (
            <motion.button
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedFAQ(faq)}
              className="bg-[#0d1428] border border-blue-900/30 hover:bg-blue-500/10 transition-all rounded-2xl p-4 flex items-center justify-between group"
            >
              <span className="text-xs font-medium text-white text-left">
                {faq.title}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
