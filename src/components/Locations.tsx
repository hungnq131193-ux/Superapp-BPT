import React, { useState } from 'react';
import { locations } from '../data';
import { LocationInfo } from '../types';
import { ArrowLeft, MapPin, Clock, Search, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LocationsProps {
  onBack: () => void;
}

export function Locations({ onBack }: LocationsProps) {
  const [selectedLoc, setSelectedLoc] = useState<LocationInfo | null>(null);
  const [query, setQuery] = useState('');
  const filteredLocations = locations.filter((loc) => `${loc.name} ${loc.address}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-[#0a0e1a] text-slate-200">
      <header className="h-16 border-b border-blue-900/50 bg-[#0d1428] px-4 flex items-center shrink-0">
        <button onClick={onBack} className="mr-3 w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div><h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">Mạng lưới chi nhánh</h2><p className="text-[10px] text-blue-200/70">Tra cứu nhanh địa chỉ và bản đồ PGD</p></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-4">
        {/* List view */}
        <div className={`flex flex-col gap-3 w-full md:w-1/3 ${selectedLoc ? 'hidden md:flex' : 'flex'}`}>
          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#0f2e5e] to-[#0d1428] p-4 shadow-xl">
            <div className="flex items-center gap-2 text-blue-100">
              <Navigation className="h-4 w-4" />
              <p className="text-[10px] font-black uppercase tracking-wider">{locations.length} điểm giao dịch</p>
            </div>
            <label className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên hoặc địa chỉ..." className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500" />
            </label>
          </div>
          {filteredLocations.map((loc, idx) => (
            <motion.button
              key={loc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedLoc(loc)}
              className={`relative p-4 rounded-xl transition-all text-left overflow-hidden ${
                selectedLoc?.id === loc.id
                ? 'bg-gradient-to-br from-[#005baa]/30 to-white/5 border border-blue-400/60 shadow-[0_0_20px_rgba(0,91,170,0.22)]'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              {selectedLoc?.id === loc.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#005baa] to-[#ed1c24]"></div>
              )}
              <h3 className={`text-[11px] font-bold font-display uppercase mb-1.5 ${selectedLoc?.id === loc.id ? 'text-blue-400' : 'text-slate-200'}`}>
                {loc.name}
              </h3>
              <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-70" />
                {loc.address}
              </p>
            </motion.button>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 text-xs text-slate-300"
          >
            <h4 className="font-bold font-display flex items-center gap-2 mb-2 text-blue-400 uppercase tracking-wider text-[10px]">
              <Clock className="w-4 h-4" /> Thời gian giao dịch
            </h4>
            <ul className="space-y-1 ml-6 list-disc text-[10px]">
              <li>Thứ 2 đến thứ 6:<br/>Sáng: 07:30 - 11:30<br/>Chiều: 13:00 - 16:30</li>
              <li className="text-slate-500">Thứ 7 - Chủ nhật: Nghỉ giao dịch</li>
            </ul>
          </motion.div>
        </div>

        {/* Map view mobile full screen overlay or desktop split */}
        <AnimatePresence>
          {selectedLoc && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full md:w-2/3 bg-[#0d1428] rounded-2xl border border-blue-900/30 overflow-hidden flex flex-col h-full md:h-auto min-h-[400px]"
            >
              <div className="p-4 border-b border-blue-900/30 flex justify-between items-center bg-[#0d1428] shrink-0">
                <div>
                  <h3 className="font-bold font-display text-white text-xs uppercase tracking-wide">{selectedLoc.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">{selectedLoc.address}</p>
                </div>
                <button
                  onClick={() => setSelectedLoc(null)}
                  className="md:hidden p-2 text-blue-400 bg-blue-500/10 rounded-full hover:bg-blue-500/20"
                >
                  Đóng
                </button>
              </div>
              <div className="flex-1 w-full relative bg-slate-900">
                <iframe
                  src={selectedLoc.iframeSrc}
                  className="absolute inset-0 w-full h-full border-0 shadow-inner"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ ${selectedLoc.name}`}
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
