export interface ITheme {
  ai_icon?: string;
  logo?: string;
  logo_small?: string;
  backgroundColor?: string;
  primary_900?: string;
  primary_800?: string;
  primary_700?: string;
  primary_600?: string;
  primary_500?: string;
  primary_400?: string;
  primary_300?: string;
  primary_200?: string;
  primary_100?: string;
  primary_50?: string;
  name?: string;
}

export const getLogoUrl = (relativePath?: string) => {
  if (relativePath) {
    if (relativePath.startsWith('http')) return relativePath
    return `http://localhost:3000/${relativePath}` 
  }
  return ''
}

export const createFetchConfig = (
  agentSlug: string,
  accountId: string,
): RequestInit => {
  const headers = new Headers();
  headers.append("X-Agent-Slug", agentSlug);
  headers.append("X-Account-Id", accountId);
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  return {
    method: "GET",
    headers,
  };
};

export const getTheme = async (
  agentSlug: string,
  accountId: string,
): Promise<ITheme> => {
  const fetchConfig = createFetchConfig(agentSlug, accountId);
  console.log("fetchConfig", fetchConfig);
  // TODO: change route
  const response = await fetch(
    "http://localhost:3000/api/v1/account_theme",
    fetchConfig,
  );
  const json = await response.json();
  console.log("response json: ", json);
  return json || {};
};
