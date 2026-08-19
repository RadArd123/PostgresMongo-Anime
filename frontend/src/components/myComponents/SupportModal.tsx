import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Coffee, Zap, Trophy, Users, TrendingUp, X, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useDonationStore } from '@/store/donationStore';

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_AMOUNTS = [3, 5, 10, 25];

export const SupportModal = ({ open, onOpenChange }: SupportModalProps) => {
  const { isAuthenticated } = useAuthStore();
  const { donations, stats, isLoading, fetchDonations, fetchStats, createDonation } = useDonationStore();

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

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Trebuie să fii conectat pentru a dona!');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Introdu o sumă validă.');
      return;
    }

    const coffees = Math.max(1, Math.round(amount / 3));

    const success = await createDonation({
      tier_name: 'Supporter',
      amount: Number(amount),
      coffees,
      donor_name: donorName || 'Anonim',
      message
    });

    if (success) {
      toast.success('Mulțumim pentru susținere! ☕');
      setDonorName('');
      setMessage('');
      setAmount('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-transparent border-none shadow-none text-white !outline-none [&>button]:hidden">
        <DialogTitle className="sr-only">Buy Me a Coffee</DialogTitle>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[#0D1117] border border-[#21262d] rounded-2xl max-h-[85vh] overflow-y-auto hide-scrollbar"
        >
          {/* Close */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="p-6 sm:p-8">
            {/* ── Header ── */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-7 h-7 text-amber-400" />
              </div>
              <h2
                className="text-2xl font-black text-white mb-1"
                style={{ fontFamily: "Righteous, cursive" }}
              >
                Buy Me a Coffee
              </h2>
              <p className="text-sm text-gray-500">
                Orice sumă contează și ne ajută să creștem
              </p>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "Susținători", value: stats?.total_supporters || 0, icon: Users, accent: "text-blue-400", bg: "bg-blue-400/10" },
                { label: "Cafele", value: stats?.total_coffees || 0, icon: Coffee, accent: "text-amber-400", bg: "bg-amber-400/10" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#161b22] border border-[#21262d] rounded-xl p-3 text-center"
                >
                  <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.accent}`} />
                  </div>
                  <div className="text-base font-black text-white">{stat.value}</div>
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
                        ? 'bg-white text-black'
                        : 'bg-[#161b22] text-gray-400 border border-[#21262d] hover:border-[#30363d] hover:text-white'
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
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-lg pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#30363d] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#30363d] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-gray-500 mb-2">Mesaj</label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Opțional..."
                  className="w-full bg-[#161b22] border border-[#21262d] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#30363d] transition-colors"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <motion.button
              onClick={handleSubmit}
              disabled={isLoading || !amount || amount <= 0}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-[#21262d] disabled:text-gray-500 text-black font-bold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>Se procesează... <Zap className="w-4 h-4 animate-pulse" /></>
              ) : (
                <>
                  Donează {amount ? `$${amount}` : ''} <Coffee className="w-4 h-4" />
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
                  className="mt-8 border-t border-[#21262d] pt-6"
                >
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#21262d]">
                    <div className="text-gray-400"><Trophy size={16} /></div>
                    <h3 className="text-sm font-bold text-white" style={{ fontFamily: "Righteous, cursive" }}>
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
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#161b22] border border-[#21262d] hover:border-[#30363d] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0 overflow-hidden border border-[#30363d]">
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
                              <MessageCircle size={9} />
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
