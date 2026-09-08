import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckIcon, ArrowLeftIcon, CoffeeIcon } from "lucide-react";
import { axiosInstance } from '@/lib/axios';

interface CheckoutSummary {
  paid: boolean;
  amount: number;
  donor_name: string;
}

const DonationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [summary, setSummary] = useState<CheckoutSummary | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setVerificationError('Sesiunea de plată lipsește.');
      return;
    }

    const controller = new AbortController();
    axiosInstance
      .get<CheckoutSummary>(`/donations/checkout-session/${encodeURIComponent(sessionId)}`, {
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!data.paid) throw new Error('Payment is not complete');
        setSummary(data);
      })
      .catch((error) => {
        if (error.name !== 'CanceledError') {
          setVerificationError('Plata nu a putut fi verificată.');
        }
      });

    return () => controller.abort();
  }, [sessionId]);

  const amount = summary?.amount.toFixed(2) || '—';
  const name = summary?.donor_name || '—';
  
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* Edgy background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-700/10 rounded-full blur-[100px] filter -z-10 opacity-70"></div>
      
      <div className="max-w-md w-full mx-auto px-4 z-10 flex flex-col items-center">
        
        {/* GIF Container - 404/Edgy style */}
        <div className="mb-8 rounded-2xl p-1 bg-gradient-to-br from-red-900/40 to-zinc-900 relative shadow-2xl shadow-red-900/20">
           <div className="rounded-xl overflow-hidden bg-zinc-950">
             <img 
               src="/gifs/gachiakuta-riyo-riyo-reaper.gif" 
               alt="Reaper Success" 
               className="w-56 h-56 object-cover opacity-90 mix-blend-screen"
             />
           </div>
           
           {/* Success Checkmark overlaying like the user's screenshot but styled */}
           <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-green-500 rounded-full p-2.5 shadow-lg shadow-green-500/30 border-4 border-[#0a0a0a]">
             <CheckIcon className="w-6 h-6 text-[#0a0a0a] font-extrabold" />
           </div>
        </div>

        <h1 className="text-3xl font-black mt-2 mb-2 tracking-widest text-center text-white uppercase">
          MULȚUMIM!
        </h1>
        
        <p className="text-zinc-400 text-center mb-8 text-sm px-4">
          {verificationError
            ? verificationError
            : summary
              ? 'Donația ta a fost verificată. Sprijinul tău ne ajută să continuăm!'
              : 'Verificăm plata ta…'}
        </p>

        {/* Order Summary Card - Matching the user's screenshot layout but dark/edgy */}
        <div className="w-full bg-[#111111] border border-zinc-800/80 rounded-xl p-6 shadow-2xl mb-8">
          <h2 className="text-lg font-bold mb-4 text-zinc-100 border-b border-zinc-800/80 pb-3">
            Rezumat Donație
          </h2>
          
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/40">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center shadow-inner">
                  <CoffeeIcon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-200 text-sm">Sprijin Aplicație Anime</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Susținător: {name}</p>
                </div>
              </div>
              <p className="font-bold text-zinc-300">${amount}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs">TOTAL</p>
            <p className="text-xl font-black text-red-500">${amount}</p>
          </div>
        </div>

        <Link 
          to="/" 
          className="flex items-center gap-2 justify-center w-full px-6 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-red-950/30 hover:border-red-900/50 transition-all duration-300 group shadow-lg"
        >
          <ArrowLeftIcon className="w-5 h-5 text-zinc-500 group-hover:text-red-500 group-hover:-translate-x-1 transition-all" />
          <span className="font-bold text-zinc-300 group-hover:text-red-100 transition-colors">Înapoi Acasă</span>
        </Link>
        
      </div>
    </div>
  );
};

export default DonationSuccessPage;
