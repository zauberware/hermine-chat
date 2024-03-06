type Position = "right" | "bottom-right";

export interface Theme {
  backgroundColor: string;
  name: string;
  position: Position;
}

const createFetchConfig = (apiToken: string): RequestInit => {
  const headers = new Headers();
  headers.append("X-API-Key", apiToken);
  headers.append("Accept", "application/json");

  return {
    method: "GET",
    headers,
  };
};

export const getTheme = async (apiToken: string): Promise<string> => {
  // if (!import.meta.env.apiToken) throw Error("Please enter an apiToken!");
  const fetchConfig = createFetchConfig(apiToken);
  console.log("Fetching theme...");
  console.log("fetchConfig", fetchConfig);
  const response = await fetch(
    "http://localhost:3000/api/v1/account_theme",
    fetchConfig,
  );
  const json = await response.json();
  console.log("response", json);
  return json || "";
};
