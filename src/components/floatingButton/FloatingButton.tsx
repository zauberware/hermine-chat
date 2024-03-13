import React from "react";
import "./FloatingButton.css";
import { FloatingButtonProps } from "./FloatingButton.types";
import Icon from "../../assets/images/logo.svg";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";

const FloatingButton: React.FC<FloatingButtonProps> = ({ setToggled }) => {
  const { settings, theme } = useSettings();
  let logoUrl;
  if (theme.logo) {
    logoUrl = getLogoUrl(theme.logo);
  }
  let borderColor = "var(--primary)";
  if (settings.floatingButtonBorderColor) {
    borderColor = settings.floatingButtonBorderColor
} else if (theme.primary_900) {
    borderColor = theme.primary_900;
  }

  const style = {
    ...(logoUrl
      ? {
          backgroundImage: `url(${logoUrl})`,
          backgroundSize: "cover",
        }
      : {}),
    border: `2px solid ${borderColor}`,
  };
  return (
    <button
      onClick={() => setToggled((t) => !t)}
      className={`floating-button floating-button-${settings.location}`}
      style={style}
    >
      {!logoUrl ? <Icon height={50} width={40} /> : null}
    </button>
  );
};

export default FloatingButton;
