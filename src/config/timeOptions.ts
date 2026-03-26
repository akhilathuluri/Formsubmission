import { TimeOption } from "@/types/form";

export const MINUTES_OPTIONS: TimeOption[] = [
  {
    id: "1min",
    label: "1 minute",
    desc: "Quick task",
    category: "minutes",
    duration: 1,
  },
  ...Array.from({ length: 11 }, (_, i) => {
    const minutes = (i + 1) * 5;
    return {
      id: `${minutes}min`,
      label: `${minutes} minutes`,
      desc: "Short duration task",
      category: "minutes",
      duration: minutes,
    };
  }),
];

export const HOURS_SHORT_OPTIONS: TimeOption[] = Array.from({ length: 12 }, (_, i) => {
  const hours = i + 1;
  return {
    id: `${hours}hr`,
    label: `${hours} hour${hours > 1 ? "s" : ""}`,
    desc: "Medium duration task",
    category: "hours-short",
    duration: hours * 60,
  };
});

export const HOURS_LONG_OPTIONS: TimeOption[] = Array.from({ length: 12 }, (_, i) => {
  const hours = i + 13;
  return {
    id: `${hours}hr`,
    label: `${hours} hours`,
    desc: "Extended duration task",
    category: "hours-long",
    duration: hours * 60,
  };
});

export const ALL_TIME_OPTIONS: TimeOption[] = [
  ...MINUTES_OPTIONS,
  ...HOURS_SHORT_OPTIONS,
  ...HOURS_LONG_OPTIONS,
];

export const TIME_OPTION_BY_ID: Record<string, TimeOption> = Object.fromEntries(
  ALL_TIME_OPTIONS.map((opt) => [opt.id, opt]),
);

export const getSelectedTotalMinutes = (selectedIds: Iterable<string>): number => {
  let total = 0;
  for (const id of selectedIds) {
    total += TIME_OPTION_BY_ID[id]?.duration ?? 0;
  }
  return total;
};

export const TIME_OPTION_GROUPS = [
  { label: "Minutes", options: MINUTES_OPTIONS },
  { label: "Hours (1-12)", options: HOURS_SHORT_OPTIONS },
  { label: "Hours (13-24)", options: HOURS_LONG_OPTIONS },
];
