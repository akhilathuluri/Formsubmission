export interface FormOption {
  id: string;
  label: string;
  desc: string;
  category?: string;
}

export interface TimeOption extends FormOption {
  duration: number; // in minutes
}

export type FormStatus = "idle" | "loading" | "success";
