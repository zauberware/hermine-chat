import React from "react";
import styles from "./FloatingButton.module.css";
import { FloatingButtonProps } from "./FloatingButton.types";
import ChatIcon from "../../assets/images/chat.svg";
import LogoIcon from "../../assets/images/logo.svg";
import RobotIcon from "../../assets/images/RobotIcon";
import { useSettings } from "../../context";

type Location = "top" | "center" | "bottom";

const FloatingButton: React.FC<FloatingButtonProps> = ({
  setToggled,
  style: propStyle,
}) => {
  const { settings, theme } = useSettings();
  const { floatingButtonIcon = "robot" } = settings;

  let borderColor = "var(--primary)";
  const { location } = settings || { location: "center" };

  if (settings.floatingButtonBorderColor) {
    borderColor = settings.floatingButtonBorderColor;
  } else if (theme.primary_900) {
    borderColor = theme.primary_900;
  }

  const backgroundColor =
    settings.floatingButtonBackgroundColor ||
    settings.buttonBackgroundColor ||
    "white";
  const iconColor = settings.floatingButtonIconColor || "white";

  const style = {
    ...propStyle,
    border: `2px solid ${borderColor}`,
    backgroundColor: backgroundColor,
    color: iconColor,
  };

  return (
    <button
      onClick={() => setToggled((t) => !t)}
      id={styles.floatingButton}
      className={styles[`floatingButton-${location as Location}`]}
      style={style}
    >
      {/* Zeige das konfigurierte SVG-Icon */}
      {floatingButtonIcon === "chat" && <ChatIcon height={50} width={40} />}
      {floatingButtonIcon === "logo" && <LogoIcon height={50} width={40} />}
      {(floatingButtonIcon === "robot" || !floatingButtonIcon) && (
        <RobotIcon height={50} width={40} fill={iconColor} />
      )}
    </button>
  );
};

export default FloatingButton;
