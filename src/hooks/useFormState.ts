import { useState, useCallback } from "react";
import { FormStatus } from "@/types/form";
import confetti from "canvas-confetti";
import { TIME_OPTION_BY_ID } from "@/config/timeOptions";
import { submitForm } from "@/services/submissionApi";
import { toast } from "sonner";

type SubmissionSummary = {
  deductedMinutes: number;
  remainingMinutes: number;
  timeCompletedMinutes: number;
};

type OptionConfig = {
  duration: number;
  category?: string;
};

type UseFormStateOptions = {
  optionById?: Record<string, OptionConfig>;
};

const getSelectedTotalMinutes = (
  selectedIds: Iterable<string>,
  optionById: Record<string, OptionConfig>,
): number => {
  let total = 0;
  for (const id of selectedIds) {
    total += optionById[id]?.duration ?? 0;
  }
  return total;
};

export const useFormState = ({ optionById = TIME_OPTION_BY_ID }: UseFormStateOptions = {}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionSummary | null>(null);

  const toggle = useCallback((id: string) => {
    if (status !== "idle") return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }

      const selectedCategory = optionById[id]?.category;
      if (selectedCategory) {
        for (const selectedId of next) {
          if (optionById[selectedId]?.category === selectedCategory) {
            next.delete(selectedId);
          }
        }
      }

      next.add(id);
      return next;
    });
  }, [status, optionById]);

  const celebrate = useCallback(() => {
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#f9a8d4", "#fbbf24", "#a78bfa", "#34d399", "#fb923c"],
    };
    confetti({ ...defaults, particleCount: 80, spread: 80 });
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
      });
    }, 200);
  }, []);

  const handleSubmit = useCallback(() => {
    const submit = async () => {
      if (selected.size === 0) return;

      const selectedOptionIds = Array.from(selected);
      const requestedMinutes = getSelectedTotalMinutes(selectedOptionIds, optionById);
      if (requestedMinutes <= 0) {
        toast.error("Please select a valid time option.");
        return;
      }

      setStatus("loading");

      try {
        const result = await submitForm({ selectedOptionIds, requestedMinutes });
        setSubmissionSummary({
          deductedMinutes: result.deductedMinutes,
          remainingMinutes: result.remainingMinutes,
          timeCompletedMinutes: result.timeCompletedMinutes,
        });
        setStatus("success");
        celebrate();
      } catch (error) {
        setStatus("idle");
        const message =
          error instanceof Error ? error.message : "Unable to submit your response.";
        toast.error(message);
      }
    };

    void submit();
  }, [selected, celebrate, optionById]);

  const reset = useCallback(() => {
    setSelected(new Set());
    setStatus("idle");
    setSubmissionSummary(null);
  }, []);

  return {
    selected,
    status,
    submissionSummary,
    toggle,
    handleSubmit,
    celebrate,
    reset,
  };
};
