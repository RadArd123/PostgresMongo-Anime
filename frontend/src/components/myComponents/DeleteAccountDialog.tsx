import React, { useState } from "react";
import { useProfileStore } from "../../store/profileStore";
import { X, Loader2, AlertTriangle } from "lucide-react";

interface DeleteAccountDialogProps {
  onClose: () => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ onClose }) => {
  const { deleteAccount, loading } = useProfileStore();
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      setErrorMsg("Please type 'DELETE' to confirm.");
      return;
    }
    setErrorMsg("");
    try {
      await deleteAccount();
      // On success, deleteAccount redirects to "/"
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete account.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#161B22] border border-red-900/50 rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Delete Account
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <p className="text-gray-300 mb-6 leading-relaxed">
            Are you completely sure you want to delete your account? This action is <strong className="text-red-400">irreversible</strong>. 
            All your profile data, lists, and favorites will be permanently destroyed.
          </p>

          {errorMsg && (
            <div className="bg-red-900/30 text-red-400 p-3 rounded-lg text-sm mb-6 border border-red-900/50">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-400">Type <span className="text-red-400 font-bold">DELETE</span> to confirm:</label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="bg-[#0D1117] border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-[#0D1117]/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== "DELETE"}
            className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Everything"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteAccountDialog;
