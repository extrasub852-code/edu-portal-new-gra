# Starting the Development Server

## Quick Start

Run the following command in your terminal:

```bash
npm run dev
```

Or if you're using pnpm:

```bash
pnpm dev
```

The server will start at: **http://localhost:8080**

## Testing the Use Case Explorer

### 1. Open the Use Case Finder
Navigate to: http://localhost:8080/use-case-finder

### 2. Test Semantic Search
Try these example searches:
- "customer onboarding flow"
- "boost user engagement"  
- "increase customer retention"
- "workflow automation"
- "analytics dashboard"

### 3. Test Real-time Suggestions
- Start typing in the search box
- After 2+ characters, suggestions will appear
- Click on a suggestion to use it

### 4. View Use Case Details
- Click "View Details" on any use case card
- Explore the detailed breakdown with:
  - Problem Statement
  - Proposed Solution
  - Tech Stack
  - Impact Metrics
  - Example Implementation
  - Related Use Cases

### 5. Check Analytics
- Open your server console/terminal
- View use case detail pages or click CTA buttons
- You should see analytics logs like:
  ```
  Analytics: Use case uc-5 - Action: view - Timestamp: 2025-...
  ```

## API Endpoints

The following endpoints are available:

- `GET /api/use-cases` - List all use cases
- `GET/POST /api/use-cases/search` - Semantic search
- `GET/POST /api/use-cases/suggestions` - Search suggestions (autocomplete)
- `GET /api/use-cases/slug/:slug` - Get use case by slug
- `GET /api/use-cases/:id` - Get use case by ID
- `POST /api/use-cases/analytics` - Track analytics events

## Troubleshooting

If you encounter any issues:

1. **Port already in use**: Make sure port 8080 is not being used by another process
2. **Module not found**: Run `npm install` or `pnpm install` to install dependencies
3. **TypeScript errors**: Run `npm run typecheck` to verify types
4. **JSON errors**: The useCases.json file has been validated and is correct

## Features Implemented

✅ 12 enhanced use cases with detailed information
✅ Semantic/intent-based search
✅ Real-time search suggestions
✅ Detailed use case pages
✅ Related use cases
✅ Analytics tracking
✅ Responsive UI matching existing theme

Enjoy testing!

