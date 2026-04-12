/**
 * Fetch exact course title from LinkedIn Learning page metadata.
 * Uses og:title or <title> - publicly accessible without login.
 */

export async function fetchCourseTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EduPortal/1.0; +https://github.com/edu-portal)",
      },
      redirect: "follow",
    });

    if (!res.ok) return null;

    const html = await res.text();

    const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (ogTitleMatch) {
      return normalizeTitle(ogTitleMatch[1]);
    }

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      return normalizeTitle(titleMatch[1]);
    }

    return null;
  } catch {
    return null;
  }
}

function normalizeTitle(title: string): string {
  return title
    .replace(/\s*\|\s*LinkedIn Learning,?\s*(formerly Lynda\.com)?\s*$/i, "")
    .replace(/\s+Online Class\s*$/i, "")
    .trim();
}

/**
 * Extract course slug from LinkedIn Learning URL for validation.
 */
export function getCourseSlugFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "www.linkedin.com" || !u.pathname.startsWith("/learning/")) {
      return null;
    }
    const match = u.pathname.match(/^\/learning\/([^/]+)(?:\/|$)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
