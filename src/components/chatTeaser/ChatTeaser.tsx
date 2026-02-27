import React, { useState } from "react";
import styles from "./ChatTeaser.module.css";
import { ChatTeaserProps } from "./ChatTeaser.types";
import { useSettings } from "../../context";

const ChatTeaser: React.FC<ChatTeaserProps> = ({
  onClick,
  onClose,
  imageUrl,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { settings } = useSettings();

  const teaserText = settings.teaserText || settings.chatTitle || "Hallo!";
  const teaserSubText =
    settings.teaserSubText ||
    settings.chatDescription ||
    "Klicken Sie hier, um zu chatten";

  const backgroundColor =
    settings.teaserBackgroundColor ||
    settings.floatingButtonBackgroundColor ||
    "#ffffff";
  const textColor = settings.teaserTextColor || "#1f2937";

  const borderColor = settings.floatingButtonBorderColor || "#e5e7eb";

  const iconColor = settings.floatingButtonIconColor || "#6B7280";

  const { floatingButtonIcon = "robot" } = settings;
  const displayImageUrl = floatingButtonIcon === "image" ? imageUrl : null;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={styles.chatTeaser}
      onClick={onClick}
      style={{
        backgroundColor,
        color: textColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      <div className={styles.teaserAvatar}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Agent"
            onLoad={() => setImageLoaded(true)}
            className={
              imageLoaded
                ? styles.teaserAvatarImageLoaded
                : styles.teaserAvatarImageLoading
            }
          />
        )}
      </div>
      <div className={styles.teaserContent}>
        <span className={styles.teaserText} style={{ color: textColor }}>
          {teaserText}
        </span>
        <span className={styles.teaserSubText} style={{ color: textColor }}>
          {teaserSubText}
        </span>
      </div>
      <button
        className={styles.teaserClose}
        onClick={handleClose}
        aria-label="Teaser schließen"
      >
        ✕
      </button>
    </div>
  );
};

export default ChatTeaser;
