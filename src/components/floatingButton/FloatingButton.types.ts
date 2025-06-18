export interface FloatingButtonProps {
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}
