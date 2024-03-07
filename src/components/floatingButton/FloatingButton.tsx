import React from "react";
import "./FloatingButton.css";
import { FloatingButtonProps } from "./FloatingButton.types";
import Icon from "../../assets/images/logo.svg";

const FloatingButton: React.FC<FloatingButtonProps> = ({
  setToggled,
  settings,
}) => {
  return (
    <button
      onClick={() => setToggled((t) => !t)}
      className={`floating-button floating-button-${settings.location}`}
    >
      <Icon height={50} width={40} />
    </button>
  );
};

export default FloatingButton;
