import React from "react";
import Markdown from "react-markdown";
import styles from "./SplashScreen.module.css";
import { SplashScreenProps } from "./SplashScreen.types";
import { useSettings } from "../../context";

const SplashScreen: React.FC<SplashScreenProps> = ({ sendMessage }) => {
  const { settings, conversation } = useSettings();

  const style = {
    ...(settings.fontFamily ? { fontFamily: settings.fontFamily } : {}),
  };

  const firstMessage = conversation?.messages?.[0];
  const prompts = conversation?.prompts;

  return (
    <div style={style} className={styles.splashScreen}>
      <div>
        {firstMessage ? (
          <div id={styles.text} className={styles.text}>
            <Markdown
              components={{
                a: ({ href, children, ...props }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                ),
              }}
              className="reactMarkDown"
            >
              {firstMessage.result}
            </Markdown>
          </div>
        ) : null}
        <div className={styles.promptsContainer}>
          {prompts
            ?.filter((prompt: string) => !!prompt)
            .map((prompt: string) => (
              <div
                key={prompt}
                className={`${styles.text} ${styles.promptContainer}`}
                onClick={() => sendMessage(prompt)}
              >
                {prompt}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
