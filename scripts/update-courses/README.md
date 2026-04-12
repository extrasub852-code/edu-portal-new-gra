# LinkedIn Learning Course Updater

This script finds LinkedIn Learning courses about "how AI can be helpful" for each division and updates the Courses page data.

## Divisions

- IT
- Marketing & Communication
- Finance
- Business Administration
- Human Resources
- Data analysis
- Career services
- Facilities management

## Usage

```bash
# Use built-in seed data (no API key required)
pnpm run update-courses

# Preview proposed changes without writing
pnpm run update-courses --dry-run

# Use search API + fetch titles (requires API key)
pnpm run update-courses --fetch
```

## Output

Writes `client/data/linkedinCourses.json` with structure:

```json
{
  "IT": [{"title": "Applied AI for IT Operations (AIOps)", "url": "https://www.linkedin.com/learning/..."}],
  ...
}
```

## Search API Configuration

To use live web search instead of built-in seed data, set one of these in `.env`:

| Variable        | Provider | Docs |
|----------------|----------|------|
| `SERPAPI_KEY`  | SerpAPI  | https://serpapi.com/ |
| `BING_SEARCH_KEY` | Bing Web Search API | https://www.microsoft.com/en-us/bing/apis/bing-web-search-api |

**Keep secrets out of git.** `.env` is in `.gitignore`.

Without an API key, the script uses curated seed data. Run `--fetch` only when you have configured a key.
