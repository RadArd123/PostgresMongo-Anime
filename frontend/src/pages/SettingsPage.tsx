import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { useContinueWatchingStore } from '@/store/continueWatchingStore';
import { useThemeStore, type ThemeColor } from '@/store/themeStore';
import { 
  Settings, Play, Palette, Bell, Shield, Trash2, Check, RefreshCw, 
  Eye, Sparkles, Tv, Lock, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const {
    autoPlayNext, autoSkipIntro, autoSkipOutro, defaultQuality, audioPreference,
    layoutMode, blurIntensity, publicWatchlist, nsfwFilter, spoilerProtection,
    notifications, updateSetting, updateNotification, resetSettings
  } = useSettingsStore();

  const { themeColor, setTheme } = useThemeStore();
  const { items, removeItem, fetchContinueWatching } = useContinueWatchingStore();
  const [activeTab, setActiveTab] = useState<'player' | 'theme' | 'notifications' | 'privacy'>('player');

  const handleReset = () => {
    resetSettings();
    setTheme('blue');
    toast.success('⚙️ Setările au fost resetate la valorile implicite!');
  };

  const handleClearHistory = async () => {
    // Clear from backend by removing each continue-watching item
    try {
      for (const item of items) {
        await removeItem(item.episode_id);
      }
      // Also clear any local storage caches
      localStorage.removeItem('continue-watching');
      localStorage.removeItem('watch-history');
      // Refresh the store state
      await fetchContinueWatching();
      toast.success('🧹 Istoricul de vizionare a fost curățat complet!');
    } catch {
      toast.error('❌ Eroare la curățarea istoricului.');
    }
  };

  const themes: { id: ThemeColor; name: string; bg: string; accent: string }[] = [
    { id: 'blue', name: 'Albastru Cyberpunk', bg: 'from-blue-600 to-indigo-700', accent: '#3b82f6' },
    { id: 'purple', name: 'Mov Neon (Sakura)', bg: 'from-purple-600 to-fuchsia-700', accent: '#a855f7' },
    { id: 'red', name: 'Roșu Aprins (Akatsuki)', bg: 'from-red-600 to-rose-700', accent: '#ef4444' },
    { id: 'green', name: 'Verde Smarald (Deku)', bg: 'from-emerald-600 to-teal-700', accent: '#10b981' },
    { id: 'gold', name: 'Auriu Legendar (Super Saiyan)', bg: 'from-amber-500 to-yellow-600', accent: '#f59e0b' },
    { id: 'cyan', name: 'Cyan Electric (Vocaloid)', bg: 'from-cyan-500 to-blue-600', accent: '#06b6d4' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-6xl mx-auto text-white">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_25px_rgba(37,99,235,0.4)] text-white">
            <Settings className="size-8 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Setări Aplicație & Preferințe
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Personalizează playerul video, temele de culori și experiența de streaming
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-bold text-neutral-300 hover:text-white transition-all duration-300"
        >
          <RefreshCw className="size-4" />
          <span>Resetează la implicit</span>
        </button>
      </div>

      {/* Main Layout (Sidebar Tabs + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'player', label: 'Player & Redare', icon: <Play className="size-5" />, desc: 'Auto-play, Calitate, Audio' },
            { id: 'theme', label: 'Aspect & Teme', icon: <Palette className="size-5" />, desc: 'Culori, Design, Glass' },
            { id: 'notifications', label: 'Notificări', icon: <Bell className="size-5" />, desc: 'Alerte, Episoade noi' },
            { id: 'privacy', label: 'Confidențialitate', icon: <Shield className="size-5" />, desc: 'Istoric, Filtru 18+, Spoilere' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl transition-all duration-300 text-left border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-transparent border-blue-500/50 text-white shadow-[0_0_25px_rgba(59,130,246,0.15)] font-extrabold'
                  : 'bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.05] hover:text-white hover:border-white/10 font-semibold'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white/5 text-neutral-400'}`}>
                {tab.icon}
              </div>
              <div>
                <div className="text-sm">{tab.label}</div>
                <div className="text-[11px] text-neutral-500 font-normal mt-0.5">{tab.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* 1. PLAYER & REDARE TAB */}
          {activeTab === 'player' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#ffffff03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <Tv className="size-6 text-blue-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Setări Video Player</h2>
                  <p className="text-xs text-neutral-400">Opțiuni pentru controlul automat și calitatea redării în timpul vizionării</p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-white">Auto-Play Episodul Următor</h4>
                    <p className="text-xs text-neutral-400 mt-1">Trece automat la următorul episod când se termină cel curent (pentru binge-watching)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoPlayNext}
                    onChange={(e) => updateSetting('autoPlayNext', e.target.checked)}
                    className="size-5 accent-blue-500 cursor-pointer rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-white">Auto-Skip Opening (OP)</h4>
                    <p className="text-xs text-neutral-400 mt-1">Sare automat peste generic-ul de început unde este marcat timpii intro-ului</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSkipIntro}
                    onChange={(e) => updateSetting('autoSkipIntro', e.target.checked)}
                    className="size-5 accent-blue-500 cursor-pointer rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-white">Auto-Skip Ending (ED)</h4>
                    <p className="text-xs text-neutral-400 mt-1">Sare automat peste genericul de final pentru a trece direct la următorul episod</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSkipOutro}
                    onChange={(e) => updateSetting('autoSkipOutro', e.target.checked)}
                    className="size-5 accent-blue-500 cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Quality & Audio Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Calitate Video Implicită</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['1080p', '720p', '480p', 'auto'].map((qual) => (
                      <button
                        key={qual}
                        onClick={() => updateSetting('defaultQuality', qual as any)}
                        className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                          defaultQuality === qual
                            ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                            : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {qual} {qual === '1080p' && '🔥'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Preferință Audio / Subtitrare</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'sub', label: 'Subtitrat (Sub)' },
                      { id: 'dub', label: 'Dublat (Dub)' },
                    ].map((aud) => (
                      <button
                        key={aud.id}
                        onClick={() => updateSetting('audioPreference', aud.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          audioPreference === aud.id
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
                            : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {aud.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. THEME & APPEARANCE TAB */}
          {activeTab === 'theme' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#ffffff03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <Palette className="size-6 text-indigo-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Aspect și Teme de Culori</h2>
                  <p className="text-xs text-neutral-400">Alege paleta de culori și efectul vizual pentru întreaga interfață a platformei</p>
                </div>
              </div>

              {/* Theme Selector Grid */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="size-4 text-amber-400" />
                  Culoare Tematică de Accent (Schimbare în timp real)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map((t) => {
                    const isSelected = themeColor === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-28 ${
                          isSelected
                            ? 'border-white bg-white/[0.08] shadow-[0_0_25px_rgba(255,255,255,0.15)] scale-[1.02]'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-40 bg-gradient-to-br ${t.bg}`} />
                        
                        <div className="flex items-center justify-between z-10">
                          <div className="flex items-center gap-2">
                            <span className="size-4 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: t.accent }} />
                            <span className="text-xs font-bold text-white">{t.name}</span>
                          </div>
                          {isSelected && <Check className="size-4 text-white" />}
                        </div>

                        <div className="z-10 mt-auto">
                          <div className={`h-2.5 w-full rounded-full bg-gradient-to-r ${t.bg} shadow-md`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Layout & Glass Intensity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Mod Afișare Cataloage</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'grid', label: 'Grilă Carduri Mari (Grid)' },
                      { id: 'list', label: 'Listă Compactă (List)' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => updateSetting('layoutMode', l.id as any)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                          layoutMode === l.id
                            ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider">Intensitate Blur Fundal (Glassmorphism)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'medium', 'high'].map((blur) => (
                      <button
                        key={blur}
                        onClick={() => updateSetting('blurIntensity', blur as any)}
                        className={`py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                          blurIntensity === blur
                            ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                            : 'bg-black/40 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {blur === 'low' ? 'Scăzut' : blur === 'medium' ? 'Mediu' : 'Ultra High'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#ffffff03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <Bell className="size-6 text-amber-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Setări Notificări & Alerte</h2>
                  <p className="text-xs text-neutral-400">Alege pentru ce evenimente vrei să primești notificări și sunete pe platformă</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'newEpisodes', title: 'Alerte Episoade Noi din Watchlist', desc: 'Primește notificare instantă când apare un episod nou din seriile urmărite' },
                  { key: 'communityMentions', title: 'Mențiuni în Comunitate & Live Chat', desc: 'Notifică-mă când cineva îmi răspunde la mesaj în chat-ul public' },
                  { key: 'soundEffects', title: 'Efecte Sonore la Notificare', desc: 'Redă un sunet discret de alertă (anime chimes) la primirea unei notificări' },
                  { key: 'emailDigest', title: 'Rezumat Săptămânal pe E-mail', desc: 'Trimite pe e-mail o listă cu cele mai populare lansări din săptămâna curentă' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="pr-4">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => updateNotification(item.key as any, e.target.checked)}
                      className="size-5 accent-blue-500 cursor-pointer rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PRIVACY & ACCOUNT TAB */}
          {activeTab === 'privacy' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#ffffff03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <Shield className="size-6 text-emerald-400" />
                <div>
                  <h2 className="text-xl font-bold text-white">Confidențialitate & Securitate Cont</h2>
                  <p className="text-xs text-neutral-400">Controlează ce pot vedea ceilalți utilizatori și protecția împotriva spoilerelor</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="size-4 text-blue-400" />
                      Listă Watchlist & Favorite Publică
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">Permite altor membri din Live Chat sau comunitate să îți vizualizeze profilul și seriile preferate</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={publicWatchlist}
                    onChange={(e) => updateSetting('publicWatchlist', e.target.checked)}
                    className="size-5 accent-blue-500 cursor-pointer rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Eye className="size-4 text-emerald-400" />
                      Protecție Anti-Spoilere (Spoiler Protection)
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">Ascunde sinopsisul și titlurile episoadelor pe care nu le-ai vizionat încă pentru a păstra misterul</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={spoilerProtection}
                    onChange={(e) => updateSetting('spoilerProtection', e.target.checked)}
                    className="size-5 accent-blue-500 cursor-pointer rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-400" />
                      Filtru Conținut Matur (18+ / Ecchi Toggle)
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">Filtrează și ascunde automat seriile cu conținut exclusiv pentru adulți din recomandări</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={nsfwFilter}
                    onChange={(e) => updateSetting('nsfwFilter', e.target.checked)}
                    className="size-5 accent-blue-500 cursor-pointer rounded"
                  />
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
                <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Trash2 className="size-4" />
                  Zonă de Pericol (Danger Zone)
                </h4>
                <p className="text-xs text-neutral-300">
                  Această acțiune va curăța tot istoricul tău local de Continue Watching și va șterge cache-ul de progres video.
                </p>
                <button
                  onClick={handleClearHistory}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg hover:shadow-red-500/30 transition-all"
                >
                  🧹 Șterge Istoricul „Continue Watching”
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
