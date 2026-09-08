import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { CoffeeIcon, ZapIcon, TrophyIcon, UsersIcon, XIcon, MessageCircleIcon } from "lucide-react";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useDonationStore } from '@/store/donationStore';

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [3, 5, 10, 25];

export const SupportModal = ({ open, onOpenChange }: SupportModalProps) => {
  const { donations, stats, isLoading, fetchDonations, fetchStats, createCheckoutSession } = useDonationStore();

  const [amount, setAmount] = useState<number | ''>('');
  const [donorName, setDonorName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open) {
      fetchDonations();
      fetchStats();
    }
  }, [open, fetchDonations, fetchStats]);

  const handleQuickAmount = (value: number) => {
    setAmount(value);
  };

  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      toast.error('Introdu o sumă validă.');
      return;
    }

    const url = await createCheckoutSession({
      amount: Number(amount),
      donor_name: donorName || 'Anonim',
      message
    });

    if (url) {
      window.location.href = url; // Redirect to Stripe
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setAmount('');
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setAmount(num);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[520px] max-w-[95vw] p-0 bg-[#0c0d12] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10" />

        <DialogTitle className="sr-only">Susține Proiectul</DialogTitle>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="relative max-h-[85vh] overflow-y-auto hide-scrollbar"
        >
          {/* Close */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <XIcon size={16} />
          </button>

          <div className="p-6">
            {/* ── Header ── */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <CoffeeIcon className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h2
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "Righteous, cursive" }}
                >
                  Buy Me a Coffee
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Orice sumă contează și ne ajută să creștem
                </p>
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Susținători", value: stats?.total_supporters || 0, icon: UsersIcon, accent: "text-blue-400", bg: "bg-blue-400/10" },
                { label: "Cafele", value: stats?.total_coffees || 0, icon: CoffeeIcon, accent: "text-amber-400", bg: "bg-amber-400/10" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-3 text-center"
                >
                  <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`w-4 h-4 ${stat.accent}`} />
                  </div>
                  <div className="text-lg font-black text-white">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* ── Amount ── */}
            <div className="mb-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-3">Sumă ($)</p>

              {/* Quick select */}
              <div className="flex gap-2 mb-3">
                {QUICK_AMOUNTS.map(num => (
                  <button
                    key={num}
                    onClick={() => handleQuickAmount(num)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                      amount === num
                        ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    ${num}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Sau introdu o sumă..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            {/* ── Name & Message ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-2">Nume</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Anonim"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-2">Mesaj</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Opțional..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-all"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading || !amount || amount <= 0}
              whileTap={{ scale: 0.98 }}
              className="w-full mb-8 bg-amber-500 hover:bg-amber-400 disabled:bg-[#21262d] disabled:text-gray-500 text-black font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Se procesează... <ZapIcon className="w-4 h-4 animate-pulse" /></>
              ) : (
                <>
                  Continuă plata {amount ? `($${amount})` : ''} <CoffeeIcon className="w-4 h-4" />
                </>
              )}
            </motion.button>

            {/* ── Hall of Fame ── */}
            <AnimatePresence>
              {donations && donations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 border-t border-white/10 pt-6"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                    <div className="text-gray-400"><TrophyIcon size={16} /></div>
                    <h3 className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "Righteous, cursive" }}>
                      Susținători
                    </h3>
                    <span className="text-[10px] text-gray-500 ml-auto">{donations.length}</span>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto hide-scrollbar pr-1">
                    {donations.map((donation, i) => (
                      <motion.div
                        key={donation.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-gray-300 shrink-0 overflow-hidden shadow-inner">
                          {donation.avatar_url ? (
                            <img src={donation.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            (donation.donor_name || 'A')[0].toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white truncate">{donation.donor_name || 'Anonim'}</span>
                            <span className="text-[10px] font-bold text-gray-500 ml-2">${donation.amount}</span>
                          </div>
                          {donation.message && (
                            <span className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                              <MessageCircleIcon size={9} />
                              {donation.message}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
