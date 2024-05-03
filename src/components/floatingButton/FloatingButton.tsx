import React from "react";
import styles from "./FloatingButton.module.css";
import { FloatingButtonProps } from "./FloatingButton.types";
import Icon from "../../assets/images/logo.svg";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";

type Location = 'top' | 'center' | 'bottom'

const FloatingButton: React.FC<FloatingButtonProps> = ({ setToggled }) => {
  const { settings, theme } = useSettings();
  let logoUrl;
  if (theme.ai_icon) {
    logoUrl = getLogoUrl(theme.ai_icon);
  }
  let borderColor = "var(--primary)";
  const { location } = settings || { location: 'center' }
  if (settings.floatingButtonBorderColor) {
    borderColor = settings.floatingButtonBorderColor
  } else if (theme.primary_900) {
    borderColor = theme.primary_900;
  }

  const style = {
    ...(logoUrl
      ? {
        backgroundImage: `url(${logoUrl})`,
      }
      : {}),
    border: `2px solid ${borderColor}`,
  };
  return (
    <button
      onClick={() => setToggled((t) => !t)}
      id={styles.floatingButton}
      className={styles[`floatingButton-${location as Location}`]}
      style={style}
    >
      {!logoUrl ? <Icon height={50} width={40} /> : null}
    </button>
  );
};

export default FloatingButton;
