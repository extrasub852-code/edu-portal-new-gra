# Quick Start Guide

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Migrate existing data (optional):**
   ```bash
   pnpm tsx server/scripts/migrate.ts
   ```
   This will import all use cases from `server/data/solutions.json` into the SQLite database.

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

The backend API will be available at `http://localhost:8080`.

## Adding Your First Use Case

### Option 1: Interactive Script
```bash
pnpm tsx server/scripts/addUseCase.ts
```

### Option 2: API Call
```bash
curl -X POST http://localhost:8080/api/use-cases \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fraud Detection System",
    "description": "AI-powered fraud detection for financial transactions",
    "author": "John Doe",
    "category": "Security",
    "tags": ["fraud", "detection", "ml"]
  }'
```

### Option 3: Command Line Script
```bash
pnpm tsx server/scripts/addUseCase.ts \
  --title "Fraud Detection System" \
  --description "AI-powered fraud detection" \
  --author "John Doe" \
  --category "Security" \
  --tags "fraud,detection,ml"
```

## Testing the Search

The frontend search on the "Use-Case Finder" page is already connected to the backend. Simply:

1. Navigate to `/use-case-finder` in your browser
2. Enter a search query (e.g., "fraud detection")
3. Click "Find Solutions"

The search will query the SQLite database and return relevant results.

## API Endpoints Summary

- `GET /api/use-cases` - List all use cases
- `GET /api/use-cases/:id` - Get a specific use case
- `POST /api/use-cases` - Create a new use case
- `PUT /api/use-cases/:id` - Update a use case
- `DELETE /api/use-cases/:id` - Delete a use case
- `GET/POST /api/solutions/search` - Search use cases (backward compatible)

For detailed API documentation, see [BACKEND_README.md](./BACKEND_README.md).

