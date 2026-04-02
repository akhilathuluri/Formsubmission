import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormHeader } from "@/components/FormHeader";
import { FormOptionList } from "@/components/FormContent";
import { SuccessContent } from "@/components/SuccessContent";
import { useFormState } from "@/hooks/useFormState";
import { TimeOption } from "@/types/form";

type OptionGroup = {
  label: string;
  options: TimeOption[];
};

type TimeSelectionScreenProps = {
  optionGroups: OptionGroup[];
  optionById: Record<string, TimeOption>;
};

export const TimeSelectionScreen = ({ optionGroups, optionById }: TimeSelectionScreenProps) => {
  const { selected, status, submissionSummary, toggle, handleSubmit } = useFormState({ optionById });

  return (
    <div className="min-h-screen home-bg-image">
      <div className="min-h-screen flex flex-col justify-center max-w-2xl mx-auto px-6 py-16">
        <img
          src="/images/logo.png"
          alt="Geetha logo"
          className="mx-auto mb-8 h-auto w-full max-w-[200px] sm:max-w-[240px]"
          loading="eager"
        />
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

              <div className="mb-14">
                {optionGroups.map((group) => (
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
              timeCompletedMinutes={submissionSummary?.timeCompletedMinutes}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};