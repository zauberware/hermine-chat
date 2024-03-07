export interface SettingsProps {
  agentId: string;
  location?: "center" | "bottom" | "top";
}

export interface FloatingContainerProps {
  settings: SettingsProps;
}
