import React, { useEffect, useState } from "react";
import "./FloatingContainer.css";
import { FloatingContainerProps } from "./FloatingContainer.types";
import ChatWindow from "../chatWindow";
import { getTheme } from "../../utils";
import FloatingButton from "../floatingButton/FloatingButton";

const FloatingContainer: React.FC<FloatingContainerProps> = ({ settings }) => {
  const [toggled, setToggled] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>();

  console.log("toggled", toggled);
  useEffect(() => {
    const fetchTheme = async () => {
      const newTheme = await getTheme(settings.agentId);
      setTheme(newTheme);
    };

    fetchTheme();
  }, []);
  return (
    <div
      className={`floating-container floating-container-${settings.location}`}
    >
      {toggled && <ChatWindow theme={theme} />}
      <FloatingButton settings={settings} setToggled={setToggled} />
    </div>
  );
};

export default FloatingContainer;
