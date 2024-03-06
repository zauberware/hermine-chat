import React, { useEffect, useState } from "react";
import "./FloatingButton.css";
import { FloatingButtonProps } from "./FloatingButton.types";
import Icon from "../../assets/images/logo.svg";
import ChatWindow from "../chatWindow";
import { getTheme } from "../../utils";

const FloatingButton: React.FC<FloatingButtonProps> = (props) => {
  const [toggled, setToggled] = useState<boolean>(false);
  const [theme, setTheme] = useState<any>();

  console.log("toggled", toggled);
  useEffect(() => {
    const fetchTheme = async () => {
      const newTheme = await getTheme('api_key_52d0367ead3e020a7fec6f5745b5a71d');
      setTheme(newTheme);
    };

    fetchTheme();
  }, []);
  return (
    <div className="floating-container">
      {toggled && <ChatWindow theme={theme} />}
      <button onClick={() => setToggled((t) => !t)} className="floating-button">
        <Icon />
      </button>
    </div>
  );
};

export default FloatingButton;
