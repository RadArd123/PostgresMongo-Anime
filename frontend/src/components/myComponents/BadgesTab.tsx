import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { MedalIcon, PlusIcon, Trash2Icon, SendIcon, MegaphoneIcon, AwardIcon, ChevronDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminRecordDialog from './AdminRecordDialog';
import BadgeAssignments from './BadgeAssignments';

interface Badge {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  color: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

export const BadgesTab = () => {
  // ── State ──────────────────────────────────────────────
  const [badges, setBadges] = useState<Badge[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  // Create badge form
  const [newBadgeName, setNewBadgeName] = useState("");
  const [newBadgeDesc, setNewBadgeDesc] = useState("");
  const [newBadgeColor, setNewBadgeColor] = useState("#6366f1");
  const [newBadgeIcon, setNewBadgeIcon] = useState("");
  const [creatingBadge, setCreatingBadge] = useState(false);

  // AwardIcon badge form
  const [awardUserId, setAwardUserId] = useState("");
  const [awardBadgeId, setAwardBadgeId] = useState("");
  const [awardMsg, setAwardMsg] = useState("");
  const [awarding, setAwarding] = useState(false);

  // Admin message form
  const [msgUserId, setMsgUserId] = useState("");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgType, setMsgType] = useState<"admin_message" | "donation_thanks">("admin_message");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Broadcast form
  const [bcTitle, setBcTitle] = useState("");
  const [bcBody, setBcBody] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchBadges = async () => {
    setLoadingBadges(true);
    try {
      const res = await axiosInstance.get("/badges");
      setBadges(res.data.badges || []);
    } catch { setFeedback({ type: 'err', text: 'Unable to load badges. Try Refresh.' }); }
    finally { setLoadingBadges(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data.users || []);
    } catch { setFeedback({ type: 'err', text: 'Unable to load users. Reload this tab.' }); }
  };

  useEffect(() => {
    fetchBadges();
    fetchUsers();
  }, []);

  const showFeedback = (type: "ok" | "err", text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  // ── Handlers ────────────────────────────────────────────
  const handleCreateBadge = async () => {
    if (!newBadgeName.trim()) return showFeedback("err", "Numele insignei este obligatoriu");
    setCreatingBadge(true);
    try {
      await axiosInstance.post("/badges", {
        name: newBadgeName.trim(),
        description: newBadgeDesc.trim(),
        icon_url: newBadgeIcon.trim() || null,
        color: newBadgeColor,
      });
      showFeedback("ok", `Insigna "${newBadgeName}" a fost creată!`);
      setNewBadgeName(""); setNewBadgeDesc(""); setNewBadgeIcon(""); setNewBadgeColor("#6366f1");
      fetchBadges();
    } catch (e: any) {
      showFeedback("err", e.response?.data?.message || "Eroare la creare");
    } finally { setCreatingBadge(false); }
  };

  const handleDeleteBadge = async (id: number, name: string) => {
    if (!confirm(`Ștergi insigna "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/badges/${id}`);
      showFeedback("ok", `Insigna "${name}" a fost ștearsă`);
      fetchBadges();
    } catch { showFeedback("err", "Eroare la ștergere"); }
  };

  const handleAwardBadge = async () => {
    if (!awardUserId || !awardBadgeId) return showFeedback("err", "Selectează userul și insigna");
    setAwarding(true);
    try {
      await axiosInstance.post("/badges/award", {
        userId: Number(awardUserId),
        badgeId: Number(awardBadgeId),
        customMessage: awardMsg.trim() || undefined,
      });
      showFeedback("ok", "Insigna a fost acordată și notificarea trimisă! 🏅");
      setAwardUserId(""); setAwardBadgeId(""); setAwardMsg("");
    } catch (e: any) {
      showFeedback("err", e.response?.data?.message || "Eroare la acordare");
    } finally { setAwarding(false); }
  };

  const handleSendMessage = async () => {
    if (!msgUserId || !msgTitle || !msgBody) return showFeedback("err", "Completează toate câmpurile");
    setSendingMsg(true);
    try {
      await axiosInstance.post("/badges/admin/message", {
        userId: Number(msgUserId),
        title: msgTitle.trim(),
        message: msgBody.trim(),
        type: msgType,
      });
      showFeedback("ok", "Mesajul a fost trimis! ✉️");
      setMsgUserId(""); setMsgTitle(""); setMsgBody("");
    } catch { showFeedback("err", "Eroare la trimitere"); }
    finally { setSendingMsg(false); }
  };

  const handleBroadcast = async () => {
    if (!bcTitle || !bcBody) return showFeedback("err", "Completează titlul și mesajul");
    if (!confirm(`Trimiți broadcast către TOȚI userii?`)) return;
    setBroadcasting(true);
    try {
      const res = await axiosInstance.post("/badges/admin/broadcast", {
        title: bcTitle.trim(),
        message: bcBody.trim(),
      });
      showFeedback("ok", res.data.message || "Broadcast trimis!");
      setBcTitle(""); setBcBody("");
    } catch { showFeedback("err", "Eroare la broadcast"); }
    finally { setBroadcasting(false); }
  };

  // ── UI ──────────────────────────────────────────────────
  const cardClass = "bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-5";
  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;
  const btnPrimary = "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div
      key="badges"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Feedback toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl border ${
              feedback.type === "ok"
                ? "bg-emerald-900/90 border-emerald-500/50 text-emerald-300"
                : "bg-red-900/90 border-red-500/50 text-red-300"
            }`}
          >
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. Create Badge ─────────────────────────────── */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400"><MedalIcon size={20} /></div>
          <div>
            <h3 className="text-base font-extrabold text-white">Crează Insignă Nouă</h3>
            <p className="text-xs text-gray-400">Adaugă o insignă pe care o poți acorda userilor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nume *</label>
            <input className={inputClass} placeholder="ex: Donator Gold" value={newBadgeName} onChange={e => setNewBadgeName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Culoare</label>
            <div className="flex items-center gap-3">
              <input type="color" value={newBadgeColor} onChange={e => setNewBadgeColor(e.target.value)}
                className="h-10 w-14 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
              <span className="text-sm text-gray-400 font-mono">{newBadgeColor}</span>
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Descriere</label>
            <input className={inputClass} placeholder="ex: Acordată donatorilor generoși" value={newBadgeDesc} onChange={e => setNewBadgeDesc(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">URL Icon (opțional)</label>
            <input className={inputClass} placeholder="https://..." value={newBadgeIcon} onChange={e => setNewBadgeIcon(e.target.value)} />
          </div>
        </div>

        <button onClick={handleCreateBadge} disabled={creatingBadge} className={btnPrimary}>
          <PlusIcon size={16} /> {creatingBadge ? "Se creează..." : "Creează Insigna"}
        </button>
      </div>

      {/* ── 2. Existing Badges ──────────────────────────── */}
      <AdminRecordDialog title="Edit Badge" description="Update a badge’s name, description, icon and color" records={badges.map(badge => ({ id: badge.id, title: badge.name, values: { name: badge.name, description: badge.description || '', icon_url: badge.icon_url || '', color: badge.color } }))} fields={[
        { name: 'name', label: 'Name', required: true, maxLength: 100 },
        { name: 'description', label: 'Description', type: 'textarea', maxLength: 2000 },
        { name: 'icon_url', label: 'Icon URL' },
        { name: 'color', label: 'Color', type: 'color' },
      ]} onSave={async (id, data) => { await axiosInstance.put(`/badges/${id}`, Object.fromEntries(data)); await fetchBadges(); }} />
      <BadgeAssignments users={users} />
      <div className={cardClass}>
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-base font-extrabold text-white">Insigne Existente ({badges.length})</h3>
          <button onClick={fetchBadges} className="text-xs text-gray-400 hover:text-white transition-colors">↻ Refresh</button>
        </div>

        {loadingBadges ? (
          <p className="text-sm text-gray-500 text-center py-6">Se încarcă...</p>
        ) : badges.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6 italic">Nicio insignă creată încă</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {badges.map(b => (
              <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] group">
                <div className="size-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                  style={{ backgroundColor: b.color + "22", borderColor: b.color + "44" }}>
                  {b.icon_url
                    ? <img src={b.icon_url} alt={b.name} className="size-7 object-contain" />
                    : <MedalIcon size={20} style={{ color: b.color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{b.name}</p>
                  {b.description && <p className="text-xs text-gray-400 truncate">{b.description}</p>}
                </div>
                <button onClick={() => handleDeleteBadge(b.id, b.name)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2Icon size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 3. AwardIcon Badge ──────────────────────────────── */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 rounded-xl bg-yellow-500/15 text-yellow-400"><AwardIcon size={20} /></div>
          <div>
            <h3 className="text-base font-extrabold text-white">Acordă Insignă unui User</h3>
            <p className="text-xs text-gray-400">Userul va primi o notificare instant</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User *</label>
            <div className="relative">
              <select className={selectClass} value={awardUserId} onChange={e => setAwardUserId(e.target.value)}>
                <option value="">Selectează user...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username} — {u.email}</option>)}
              </select>
              <ChevronDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Insigna *</label>
            <div className="relative">
              <select className={selectClass} value={awardBadgeId} onChange={e => setAwardBadgeId(e.target.value)}>
                <option value="">Selectează insigna...</option>
                {badges.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mesaj personalizat (opțional)</label>
            <input className={inputClass} placeholder="ex: Mulțumim pentru susținere!" value={awardMsg} onChange={e => setAwardMsg(e.target.value)} />
          </div>
        </div>

        <button onClick={handleAwardBadge} disabled={awarding} className={`${btnPrimary} !bg-yellow-600 hover:!bg-yellow-500`}>
          <AwardIcon size={16} /> {awarding ? "Se acordă..." : "Acordă Insigna 🏅"}
        </button>
      </div>

      {/* ── 4. Admin Message ────────────────────────────── */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400"><SendIcon size={20} /></div>
          <div>
            <h3 className="text-base font-extrabold text-white">Trimite Mesaj unui User</h3>
            <p className="text-xs text-gray-400">Mulțumiri pentru donație, mesaje private, etc.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">User *</label>
            <div className="relative">
              <select className={selectClass} value={msgUserId} onChange={e => setMsgUserId(e.target.value)}>
                <option value="">Selectează user...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username} — {u.email}</option>)}
              </select>
              <ChevronDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tip mesaj</label>
            <div className="relative">
              <select className={selectClass} value={msgType} onChange={e => setMsgType(e.target.value as any)}>
                <option value="admin_message">Mesaj Admin</option>
                <option value="donation_thanks">Mulțumire Donație ☕</option>
              </select>
              <ChevronDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Titlu *</label>
            <input className={inputClass} placeholder="ex: Mulțumim pentru donație! ☕" value={msgTitle} onChange={e => setMsgTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mesaj *</label>
            <textarea className={`${inputClass} resize-none`} rows={3}
              placeholder="ex: Contul tău beneficiază acum de streaming fără reclame. Îți mulțumim!"
              value={msgBody} onChange={e => setMsgBody(e.target.value)} />
          </div>
        </div>

        <button onClick={handleSendMessage} disabled={sendingMsg} className={`${btnPrimary} !bg-blue-600 hover:!bg-blue-500`}>
          <SendIcon size={16} /> {sendingMsg ? "Se trimite..." : "Trimite Mesaj ✉️"}
        </button>
      </div>

      {/* ── 5. Broadcast ────────────────────────────────── */}
      <div className={cardClass}>
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400"><MegaphoneIcon size={20} /></div>
          <div>
            <h3 className="text-base font-extrabold text-white">Broadcast Sistem</h3>
            <p className="text-xs text-gray-400">Trimite un anunț tuturor userilor înregistrați</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Titlu *</label>
            <input className={inputClass} placeholder="ex: Actualizare Platformă 🚀" value={bcTitle} onChange={e => setBcTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mesaj *</label>
            <textarea className={`${inputClass} resize-none`} rows={3}
              placeholder="ex: Am adăugat 50+ anime-uri noi și am optimizat playerul video."
              value={bcBody} onChange={e => setBcBody(e.target.value)} />
          </div>
        </div>

        <button onClick={handleBroadcast} disabled={broadcasting}
          className={`${btnPrimary} !bg-orange-600 hover:!bg-orange-500`}>
          <MegaphoneIcon size={16} /> {broadcasting ? "Se trimite..." : "Trimite Broadcast 📣"}
        </button>
      </div>
    </motion.div>
  );
};

export default BadgesTab;
