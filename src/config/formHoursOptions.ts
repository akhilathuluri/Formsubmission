import { TimeOption } from "@/types/form";

export const FORM_HOURS_OPTIONS: TimeOption[] = Array.from({ length: 20 }, (_, i) => {
  const hours = (i + 1) * 50;
  return {
    id: `${hours}hr`,
    label: `${hours} hours`,
    desc: "",
    category: "extended-hours",
    duration: hours * 60,
  };
});

export const FORM_HOURS_OPTION_BY_ID: Record<string, TimeOption> = Object.fromEntries(
  FORM_HOURS_OPTIONS.map((option) => [option.id, option]),
);

export const FORM_HOURS_OPTION_GROUPS = [
  {
    label: "Hours (50-1000)",
    options: FORM_HOURS_OPTIONS,
  },
];