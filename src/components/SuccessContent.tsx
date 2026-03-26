import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SuccessContentProps {
  title?: string;
  message?: string;
  deductedMinutes?: number;
  remainingMinutes?: number;
}

const formatDuration = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);
  const rest = safeMinutes % 60;
  if (rest === 0) {
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  }

  return `${hours} hr${hours > 1 ? "s" : ""} ${rest} min`;
};

export const SuccessContent = ({
  title = "Thanks for your response!",
  message = "We appreciate your feedback.",
  deductedMinutes,
  remainingMinutes,
}: SuccessContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-8"
      >
        <Check className="h-10 w-10 text-primary-foreground" />
      </motion.div>
      <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-3">
        {title}
      </h2>
      <p className="text-lg text-muted-foreground">{message}</p>

      {typeof deductedMinutes === "number" && typeof remainingMinutes === "number" && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Current user added</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatDuration(deductedMinutes)}</p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total remaining</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{formatDuration(remainingMinutes)}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};
