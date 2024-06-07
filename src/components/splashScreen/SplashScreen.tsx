import React from "react";
import styles from "./SplashScreen.module.css";
import { FloatingContainerProps } from "./SplashScreen.types";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";
import Markdown from "react-markdown";

const SplashScreen: React.FC<FloatingContainerProps> = () => {

  const {
    settings,
    theme,
    conversation,
  } = useSettings();

  const style = {
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
  }

  const titleStyle = {
    color: settings.chatTitleColor || 'black'
  }

  const firstMessage = conversation?.messages?.[0]

  return (
    <div
      style={style}
      className={styles.splashScreen}
    >
      <div className={styles.center}>
        <div id={styles.splashImage}
          style={{ backgroundImage: `url(${getLogoUrl(theme.ai_icon)})` }}
        />
        <div id={styles.title} style={titleStyle}>{settings.chatTitle}</div>
        {firstMessage ? (
          <Markdown>{firstMessage.result}</Markdown>
        ) : null}
      </div>
    </div>
  );
};

export default SplashScreen;
