import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export default function Toast({ toast, onClose }) {
  const Icon = icons[toast?.type] || Info;
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          className={`toast toast-${toast.type || "info"}`}
          role="status"
        >
          <Icon size={18} />
          <span>{toast.message}</span>
          <button className="icon-button toast-close" onClick={onClose} aria-label="Dismiss notification">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
