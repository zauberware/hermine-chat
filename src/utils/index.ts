export const getLogoUrl = (relativePath?: string, baseUrl: string = 'https://hermine.ai') => {
  if (relativePath) {
    if (relativePath.startsWith('http')) return relativePath
    return `http://${baseUrl}/${relativePath}` 
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
