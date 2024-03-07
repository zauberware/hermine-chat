import { SettingsProps } from "../floatingContainer";

export interface FloatingButtonProps {
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
  settings: SettingsProps;
}
