import React, { useState, useRef, useCallback } from "react";
import { useProfileStore } from "../../store/profileStore";
import { axiosInstance } from "../../lib/axios";
import {
  X, Loader2, AtSign, AlignLeft, CheckCircle2,
  Upload, Trash2, RefreshCw,
} from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { motion, AnimatePresence } from "framer-motion";

interface EditProfileDialogProps {
  onClose: () => void;
}

// ─── Upload state type ────────────────────────────────────
type UploadState = "idle" | "uploading" | "done" | "error";

// ─── ImageUploader component ──────────────────────────────
interface ImageUploaderProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  aspectClass?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label, hint, value, onChange, accept = "image/*", aspectClass = "aspect-square",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value || "");

  const upload = useCallback(async (file: File) => {
    const maxMB = 10;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File must be under ${maxMB} MB`);
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPEG, PNG, GIF and WebP are supported");
      return;
    }

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError("");
    setState("uploading");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axiosInstance.post("/profiles/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const cloudUrl: string = res.data.url;
      setPreview(cloudUrl);
      onChange(cloudUrl);
      setState("done");
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed");
      setState("error");
    }
  }, [onChange]);

  const handleFile = (file: File | undefined) => {
    if (file) upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleClear = () => {
    setPreview("");
    onChange("");
    setState("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</label>

      <div
        onClick={() => state !== "uploading" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${aspectClass}
          ${dragOver ? "border-blue-500 bg-blue-500/10" : "border-[#30363d] hover:border-[#58a6ff] hover:bg-white/[0.02]"}
          ${state === "uploading" ? "pointer-events-none" : ""}
        `}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            {/* overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="p-2 bg-white/20 rounded-full backdrop-blur-sm hover:bg-white/40 transition"
                >
                  <RefreshCw size={14} className="text-white" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleClear(); }}
                  className="p-2 bg-red-500/30 rounded-full backdrop-blur-sm hover:bg-red-500/60 transition"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
            {state === "uploading" ? (
              <Loader2 size={24} className="animate-spin text-blue-500" />
            ) : (
              <>
                <Upload size={22} className={dragOver ? "text-blue-400" : "text-gray-500"} />
                <span className="text-xs">{dragOver ? "Drop to upload" : "Click or drag & drop"}</span>
              </>
            )}
          </div>
        )}

        {/* uploading overlay */}
        <AnimatePresence>
          {state === "uploading" && preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <Loader2 size={28} className="animate-spin text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* done badge */}
        <AnimatePresence>
          {state === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 bg-green-500 rounded-full p-1"
            >
              <CheckCircle2 size={12} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-[11px] text-red-400 pl-1">{error}</p>}
      {hint && !error && <p className="text-[11px] text-gray-600 pl-1">{hint}</p>}
    </div>
  );
};

// ─── Field wrapper ────────────────────────────────────────
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-gray-600 pl-1">{hint}</p>}
  </div>
);

// ─── Main Dialog ──────────────────────────────────────────
const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ onClose }) => {
  const { profile, updateProfile, loading } = useProfileStore();

  const [status, setStatus]       = useState(profile?.status || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState(profile?.banner_url || "");
  const [bio, setBio]             = useState(profile?.bio || "");
  const [errorMsg, setErrorMsg]   = useState("");
  const [saved, setSaved]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await updateProfile({ status, avatar_url: avatarUrl, banner_url: bannerUrl, bio });
      setSaved(true);
      setTimeout(onClose, 900);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    }
  };

  const maxBio = 300;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-[#0D1117] border border-[#21262d] rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#21262d]">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "Righteous, cursive" }}>
              Edit Profile
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">@{profile?.username}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-950/40 text-red-400 p-3 rounded-xl text-sm border border-red-900/40"
              >
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">

            {/* ── Image uploaders ── */}
            <div className="grid grid-cols-2 gap-4">
              <ImageUploader
                label="Avatar"
                hint="Recommended: square PNG or GIF"
                value={avatarUrl}
                onChange={setAvatarUrl}
                aspectClass="aspect-square"
              />
              <ImageUploader
                label="Banner"
                hint="Recommended: 16:9 GIF"
                value={bannerUrl}
                onChange={setBannerUrl}
                aspectClass="aspect-video"
                accept="image/*"
              />
            </div>

            {/* ── Status ── */}
            <Field label="Status / Title">
              <InputGroup>
                <InputGroupInput
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder='e.g. "Biggest Naruto fan 🔥"'
                  className="pl-10 pr-16"
                />
                <InputGroupAddon align="inline-start">
                  <AtSign size={15} />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupText>{status.length}/60</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            {/* ── Bio ── */}
            <Field label="About Me (Bio)">
              <InputGroup>
                <InputGroupTextarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, maxBio))}
                  rows={4}
                  placeholder="Tell everyone what you love to watch..."
                />
                <InputGroupAddon align="block-end">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <AlignLeft size={11} /> Keep it short and fun!
                    </span>
                    <span className={`text-[11px] font-mono ${bio.length > maxBio - 30 ? "text-amber-400" : "text-gray-600"}`}>
                      {bio.length}/{maxBio}
                    </span>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </Field>

          </form>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#21262d] flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#30363d] transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-profile-form"
            disabled={loading || saved}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/20 min-w-[130px] justify-center"
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4 text-green-300" /><span className="text-green-300">Saved!</span></>
            ) : loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfileDialog;
