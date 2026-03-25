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

  const backgroundColor = settings.teaserBackgroundColor || "#0097ff";
  const textColor = settings.teaserTextColor || "#ffffff";
  const borderColor = settings.teaserBorderColor || "#00466f";

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // Split text by \n to render paragraphs with blank line between them
  const renderTextWithBreaks = (text: string) => {
    const parts = text.split("\n");
    if (parts.length === 1) return text;
    return parts.map((part, i) => (
      <p key={i} style={{ margin: 0, marginTop: i > 0 ? "0.8em" : 0, lineHeight: 1.4 }}>
        {part}
      </p>
    ));
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
      <div className={styles.teaserInner}>
        <div className={styles.teaserBody}>
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
            <p className={styles.teaserText} style={{ color: textColor }}>
              {renderTextWithBreaks(teaserText)}
            </p>
            <div className={styles.teaserSubText} style={{ color: textColor }}>
              {renderTextWithBreaks(teaserSubText)}
            </div>
          </div>
        </div>
        <button
          className={styles.teaserClose}
          onClick={handleClose}
          aria-label="Teaser schließen"
          style={{ color: textColor }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ChatTeaser;
