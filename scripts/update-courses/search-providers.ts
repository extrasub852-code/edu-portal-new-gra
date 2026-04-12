/**
 * Pluggable search providers for finding LinkedIn Learning course URLs.
 * Set SERPAPI_KEY or BING_SEARCH_KEY in .env to enable live search.
 */

function isLinkedInLearningCourseUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "www.linkedin.com" &&
      u.pathname.startsWith("/learning/") &&
      !u.pathname.startsWith("/learning/topics/") &&
      !u.pathname.startsWith("/learning/paths/") &&
      !u.pathname.includes("/learning-login")
    );
  } catch {
    return false;
  }
}

function canonicalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.search = "";
    u.hash = "";
    u.pathname = u.pathname.replace(/\/$/, "");
    return u.toString();
  } catch {
    return url;
  }
}

export interface SearchResult {
  title: string;
  url: string;
}

export interface SearchProvider {
  name: string;
  search(query: string, limit?: number): Promise<SearchResult[]>;
}

/**
 * SERPAPI provider. Requires SERPAPI_KEY in .env.
 * See https://serpapi.com/
 */
export async function serpApiSearch(
  query: string,
  apiKey: string,
  limit = 10
): Promise<SearchResult[]> {
  const url = new URL("https://serpapi.com/search");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("q", `${query} site:linkedin.com/learning`);
  url.searchParams.set("engine", "google");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`SERPAPI error: ${res.status}`);

  const data = (await res.json()) as {
    organic_results?: Array<{
      title?: string;
      link?: string;
    }>;
  };

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const r of data.organic_results ?? []) {
    if (results.length >= limit) break;
    const link = r.link;
    if (!link || !isLinkedInLearningCourseUrl(link)) continue;

    const canonical = canonicalizeUrl(link);
    if (seen.has(canonical)) continue;
    seen.add(canonical);

    let title = r.title ?? "";
    title = title.replace(/\s*\|\s*LinkedIn Learning.*$/i, "").trim();
    results.push({ title, url: canonical });
  }

  return results;
}

/**
 * Bing Web Search API provider. Requires BING_SEARCH_KEY in .env.
 * See https://www.microsoft.com/en-us/bing/apis/bing-web-search-api
 */
export async function bingSearch(
  query: string,
  apiKey: string,
  limit = 10
): Promise<SearchResult[]> {
  const url = new URL("https://api.bing.microsoft.com/v7.0/search");
  url.searchParams.set("q", `${query} site:linkedin.com/learning`);

  const res = await fetch(url.toString(), {
    headers: { "Ocp-Apim-Subscription-Key": apiKey },
  });
  if (!res.ok) throw new Error(`Bing API error: ${res.status}`);

  const data = (await res.json()) as {
    webPages?: {
      value?: Array<{
        name?: string;
        url?: string;
      }>;
    };
  };

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const r of data.webPages?.value ?? []) {
    if (results.length >= limit) break;
    const link = r.url;
    if (!link || !isLinkedInLearningCourseUrl(link)) continue;

    const canonical = canonicalizeUrl(link);
    if (seen.has(canonical)) continue;
    seen.add(canonical);

    let title = r.name ?? "";
    title = title.replace(/\s*\|\s*LinkedIn Learning.*$/i, "").trim();
    results.push({ title, url: canonical });
  }

  return results;
}

export function getDefaultSearchProvider(env: NodeJS.ProcessEnv): SearchProvider | null {
  if (env.SERPAPI_KEY) {
    return {
      name: "serpapi",
      search: (q, limit) => serpApiSearch(q, env.SERPAPI_KEY!, limit),
    };
  }
  if (env.BING_SEARCH_KEY) {
    return {
      name: "bing",
      search: (q, limit) => bingSearch(q, env.BING_SEARCH_KEY!, limit),
    };
  }
  return null;
}
