// Resolves a theme logo path against the API host the widget talks to. The
// theme endpoint returns Rails asset paths like "/assets/logo-….svg" for
// accounts without a custom logo — those only exist on the API host, so the
// base must be the widget target, not the marketing site.
export const getLogoUrl = (relativePath?: string, baseUrl: string = 'https://app.hermine.ai') => {
  if (relativePath) {
    if (relativePath.startsWith('http')) return relativePath
    return `${baseUrl.replace(/\/$/, '')}/${relativePath.replace(/^\//, '')}`
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
