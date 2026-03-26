import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FormOption, FormStatus } from "@/types/form";

interface FormOptionListProps {
  options: FormOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  status: FormStatus;
  groupLabel?: string;
}

export const FormOptionList = ({
  options,
  selected,
  onToggle,
  status,
  groupLabel,
}: FormOptionListProps) => {
  return (
    <div>
      {groupLabel && (
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 mt-8 first:mt-0 uppercase tracking-wider">
          {groupLabel}
        </h3>
      )}
      <div className="space-y-3">
        {options.map((opt, i) => {
          const active = selected.has(opt.id);
          return (
            <motion.button
              key={opt.id}
              onClick={() => onToggle(opt.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ x: 4 }}
              disabled={status !== "idle"}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-300 border ${
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-lg"
                  : "bg-card border-border hover:border-foreground/20 hover:shadow-sm"
              } ${status !== "idle" ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  active
                    ? "border-primary-foreground bg-primary-foreground/20"
                    : "border-border"
                }`}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Check
                    className={`h-3.5 w-3.5 ${
                      active ? "text-primary-foreground" : "text-foreground"
                    }`}
                  />
                </motion.div>
              </div>
              <div>
                <div
                  className={`font-semibold text-sm ${
                    active ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {opt.label}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    active
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {opt.desc}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
