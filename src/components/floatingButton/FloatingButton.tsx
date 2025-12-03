import React from "react";
import styles from "./FloatingButton.module.css";
import { FloatingButtonProps } from "./FloatingButton.types";
import ChatIcon from "../../assets/images/chat.svg";
import LogoIcon from "../../assets/images/logo.svg";
import RobotIcon from "../../assets/images/RobotIcon";
import { useSettings } from "../../context";
import cx from "classnames";

type Location = "top" | "center" | "bottom";

const FloatingButton: React.FC<FloatingButtonProps> = ({
  setToggled,
  style: propStyle,
  width = 70,
  height = 70,
  imageUrl,
  tooltipText,
}) => {
  const { settings, theme } = useSettings();
  const { floatingButtonIcon = "robot" } = settings;
  
  // Use prop or settings for tooltip
  const displayTooltip = tooltipText || settings.floatingButtonTooltipText;

  // Verwende imageUrl wenn floatingButtonIcon === "image"
  const displayImageUrl = floatingButtonIcon === "image" ? imageUrl : null;

  let borderColor = "#9d174d";
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

  // Calculate icon size based on button size (about 70% of button size)
  const buttonWidth =
    typeof width === "number" ? width : parseInt(width as string) || 70;
  const buttonHeight =
    typeof height === "number" ? height : parseInt(height as string) || 70;
  const iconWidth = Math.round(buttonWidth * 0.7);
  const iconHeight = Math.round(buttonHeight * 0.7);

  // Calculate pseudo-element size (2px smaller than button for border)
  const pseudoWidth = buttonWidth - 2;
  const pseudoHeight = buttonHeight - 2;

  const style = {
    ...propStyle,
    border: `2px solid ${borderColor}`,
    backgroundColor: backgroundColor,
    color: iconColor,
    width: width,
    height: height,
    "--pseudo-width": `${pseudoWidth}px`,
    "--pseudo-height": `${pseudoHeight}px`,
  } as React.CSSProperties & {
    "--pseudo-width": string;
    "--pseudo-height": string;
  };

  return (
    <button
      onClick={() => setToggled((t) => !t)}
      id={styles.floatingButton}
      className={cx(styles[`floatingButton-${location as Location}`], {
        [styles.withImage]: displayImageUrl,
      })}
      style={style}
    >
      {/* Zeige Wiggerl-Fallback sofort, echtes Bild wenn verfügbar */}
      {displayImageUrl ? (
        <img
          src={displayImageUrl}
          alt="Agent"
          style={{
            width: buttonWidth,
            height: buttonHeight,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ) : (
        <>
          {/* Zeige das konfigurierte SVG-Icon */}
          {floatingButtonIcon === "chat" && (
            <ChatIcon height={iconHeight} width={iconWidth} />
          )}
          {floatingButtonIcon === "logo" && (
            <LogoIcon height={iconHeight} width={iconWidth} />
          )}
          {(floatingButtonIcon === "robot" || !floatingButtonIcon) && (
            <RobotIcon height={iconHeight} width={iconWidth} fill={iconColor} />
          )}
        </>
      )}
      {displayTooltip && (
        <span className={styles.tooltip}>{displayTooltip}</span>
      )}
    </button>
  );
};

export default FloatingButton;
