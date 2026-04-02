import { TimeSelectionScreen } from "@/components/TimeSelectionScreen";
import { TIME_OPTION_BY_ID, TIME_OPTION_GROUPS } from "@/config/timeOptions";

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
  return <TimeSelectionScreen optionGroups={TIME_OPTION_GROUPS} optionById={TIME_OPTION_BY_ID} />;
};

export default FormPage;
