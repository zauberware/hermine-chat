import React from "react";
import Markdown from "react-markdown";
import styles from "./SplashScreen.module.css";
import { SplashScreenProps } from "./SplashScreen.types";
import { useSettings } from "../../context";
import { getLogoUrl } from "../../utils";

const SplashScreen: React.FC<SplashScreenProps> = ({ sendMessage }) => {

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
  const prompts = conversation?.prompts

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
        <div className={styles.promptsContainer}>
          {prompts?.filter((prompt: string) => !!prompt).map((prompt: string) => (
            <div className={styles.promptContainer} onClick={() => sendMessage(prompt)}>{prompt}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
