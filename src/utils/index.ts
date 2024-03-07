type Position = "right" | "bottom-right";

export interface Theme {
  backgroundColor: string;
  primary_900: string;
  primary_800: string;
  primary_700: string;
  primary_600: string;
  primary_500: string;
  primary_400: string;
  primary_300: string;
  primary_200: string;
  primary_100: string;
  primary_50: string;
  name: string;
}

const createFetchConfig = (agentId: string): RequestInit => {
  const headers = new Headers();
  headers.append("X-API-Key", agentId);
  headers.append("Accept", "application/json");

  return {
    method: "GET",
    headers,
  };
};

export const getTheme = async (agentId: string): Promise<string> => {
  const fetchConfig = createFetchConfig(agentId);
  console.log("fetchConfig", fetchConfig);
  console.log("getHost()", getHost());
  const response = await fetch(
    "http://localhost:3000/api/v1/account_theme",
    fetchConfig,
  );
  const json = await response.json();
  console.log("response", json);
  return json || "";
};

const getHost = () => {
  return process.env.REACT_APP_ENV;
};
