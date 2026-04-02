import { TimeSelectionScreen } from "@/components/TimeSelectionScreen";
import {
  FORM_HOURS_OPTION_BY_ID,
  FORM_HOURS_OPTION_GROUPS,
} from "@/config/formHoursOptions";

const FormRoutePage = () => {
  return (
    <TimeSelectionScreen
      optionGroups={FORM_HOURS_OPTION_GROUPS}
      optionById={FORM_HOURS_OPTION_BY_ID}
    />
  );
};

export default FormRoutePage;