import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormState } from "@/hooks/useFormState";
import { FormHeader } from "@/components/FormHeader";
import { FormOptionList } from "@/components/FormContent";
import { SuccessContent } from "@/components/SuccessContent";
import { TIME_OPTION_GROUPS } from "@/config/timeOptions";

/**
 * FormPage Component
 *
 * Main page component for time duration selection form.
 * Uses modular components for better maintainability and future extensibility.
 *
 * Features:
 * - Multi-select time duration options (minutes, hours)
 * - Smooth animations with Framer Motion
 * - Loading and success states
 * - Celebratory confetti animation on success
 */
const FormPage = () => {
  const { selected, status, submissionSummary, toggle, handleSubmit } = useFormState();

  return (
    <div className="min-h-screen home-bg-image">
      <div className="min-h-screen flex flex-col justify-center max-w-2xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-background/85 backdrop-blur-sm p-6 sm:p-8"
            >
              <FormHeader />

              {/* Time Duration Options - Organized by Groups */}
              <div className="mb-14">
                {TIME_OPTION_GROUPS.map((group) => (
                  <FormOptionList
                    key={group.label}
                    groupLabel={group.label}
                    options={group.options}
                    selected={selected}
                    onToggle={toggle}
                    status={status}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <Button
                variant="hero"
                size="xl"
                className="w-full sm:w-auto"
                disabled={selected.size === 0 || status === "loading"}
                onClick={handleSubmit}
              >
                {status === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Submit Response"
                )}
              </Button>
            </motion.div>
          ) : (
            <SuccessContent
              key="success"
              deductedMinutes={submissionSummary?.deductedMinutes}
              remainingMinutes={submissionSummary?.remainingMinutes}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormPage;
