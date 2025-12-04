# Backend API Documentation

This backend provides a RESTful API for managing use cases with SQLite database storage. The backend is built with Node.js, Express, and better-sqlite3.

## Features

- ✅ SQLite database with relational schema (use_cases, tags, use_case_tags)
- ✅ Full CRUD operations for use cases
- ✅ Tag management with many-to-many relationships
- ✅ Full-text search across titles, descriptions, and tags
- ✅ Category filtering
- ✅ Backward compatible with existing `/api/solutions` endpoints

## Database Schema

The database consists of three main tables:

1. **use_cases**: Stores use case information
   - `id` (TEXT, PRIMARY KEY)
   - `title` (TEXT, NOT NULL)
   - `description` (TEXT, NOT NULL)
   - `solution` (TEXT, optional)
   - `author` (TEXT, NOT NULL)
   - `category` (TEXT, NOT NULL)
   - `rating` (REAL, 0-5)
   - `popularity` (INTEGER)
   - `date_added` (TEXT, ISO timestamp)
   - `link` (TEXT, optional)

2. **tags**: Stores tag names
   - `id` (INTEGER, PRIMARY KEY, AUTOINCREMENT)
   - `name` (TEXT, UNIQUE)

3. **use_case_tags**: Junction table for many-to-many relationship
   - `use_case_id` (TEXT, FOREIGN KEY)
   - `tag_id` (INTEGER, FOREIGN KEY)

## Installation

1. Install dependencies:
```bash
pnpm install
```

This will install `better-sqlite3` and its TypeScript types.

## Database Location

The SQLite database file is stored at:
- Development: `server/db/use_cases.db`
- Production: `dist/server/db/use_cases.db`

The database is automatically created and initialized when the server starts.

## Migration from JSON

To migrate existing data from `server/data/solutions.json` to the database:

```bash
pnpm tsx server/scripts/migrate.ts
```

This script will:
- Create the database if it doesn't exist
- Import all solutions from the JSON file
- Create tags and associations
- Skip duplicates (based on ID)

## API Endpoints

### Search Use Cases (Backward Compatible)

**GET/POST** `/api/solutions/search`

Search for use cases by keyword.

Query Parameters (GET) or Body (POST):
- `query` (string): Search keyword
- `categories` (string[]): Optional category filter
- `limit` (number): Results per page (default: 20, max: 100)
- `offset` (number): Pagination offset (default: 0)

Example:
```bash
curl -X POST http://localhost:8080/api/solutions/search \
  -H "Content-Type: application/json" \
  -d '{"query": "fraud detection", "categories": ["Business"]}'
```

Response:
```json
{
  "query": "fraud detection",
  "extractedTags": ["fraud", "detection"],
  "results": [
    {
      "id": "uc-1",
      "title": "...",
      "description": "...",
      "solution": "...",
      "author": "...",
      "category": "...",
      "tags": ["tag1", "tag2"],
      "rating": 4.5,
      "popularity": 100,
      "dateAdded": "2024-01-01T00:00:00.000Z",
      "link": "https://...",
      "score": 2.5,
      "matchedTags": ["tag1"]
    }
  ],
  "total": 10
}
```

### List All Use Cases

**GET** `/api/use-cases`

Get all use cases with optional pagination.

Query Parameters:
- `limit` (number): Results per page
- `offset` (number): Pagination offset

Example:
```bash
curl http://localhost:8080/api/use-cases?limit=10&offset=0
```

### Get Use Case by ID

**GET** `/api/use-cases/:id`

Get a specific use case by its ID.

Example:
```bash
curl http://localhost:8080/api/use-cases/uc-1
```

### Create Use Case

**POST** `/api/use-cases`

Create a new use case.

Request Body:
```json
{
  "title": "Fraud Detection System",
  "description": "AI-powered fraud detection for financial transactions",
  "solution": "Use machine learning models to detect anomalous patterns...",
  "author": "John Doe",
  "category": "Security",
  "tags": ["fraud", "detection", "ml", "security"],
  "rating": 4.5,
  "popularity": 100,
  "link": "https://example.com/solution"
}
```

Example:
```bash
curl -X POST http://localhost:8080/api/use-cases \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fraud Detection System",
    "description": "AI-powered fraud detection",
    "author": "John Doe",
    "category": "Security",
    "tags": ["fraud", "detection"]
  }'
```

### Update Use Case

**PUT** `/api/use-cases/:id`

Update an existing use case. All fields are optional.

Example:
```bash
curl -X PUT http://localhost:8080/api/use-cases/uc-1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "popularity": 150
  }'
```

### Delete Use Case

**DELETE** `/api/use-cases/:id`

Delete a use case by ID.

Example:
```bash
curl -X DELETE http://localhost:8080/api/use-cases/uc-1
```

## Adding Use Cases

### Method 1: Using the API

Use the `POST /api/use-cases` endpoint as shown above.

### Method 2: Using the Script (Interactive)

Run the interactive script:

```bash
pnpm tsx server/scripts/addUseCase.ts
```

You'll be prompted to enter:
- Title
- Description
- Solution (optional)
- Author
- Category
- their Tags (comma-separated)
- Rating (0-5)
- Popularity
- Link (optional)

### Method 3: Using the Script (Command Line)

Provide all arguments directly:

```bash
pnpm tsx server/scripts/addUseCase.ts \
  --title "Fraud Detection System" \
  --description "AI-powered fraud detection for financial transactions" \
  --solution "Use machine learning models..." \
  --author "John Doe" \
  --category "Security" \
  --tags "fraud,detection,ml,security" \
  --rating 4.5 \
  --popularity 100 \
  --link "https://example.com/solution"
```

## Development

### Running the Server

Start the development server:

```bash
pnpm dev
```

The server runs on `http://localhost:8080` by default.

### Database Access

You can inspect the database using SQLite tools:

```bash
# Using sqlite3 CLI
sqlite3 server/db/use_cases.db

# Or using a GUI tool like DB Browser for SQLite
```

Example queries:
```sql
-- List all use cases
SELECT * FROM use_cases;

-- List all tags
SELECT * FROM tags;

-- Get use cases with their tags
SELECT uc.title, GROUP_CONCAT(t.name) as tags
FROM use_cases uc
LEFT JOIN use_case_tags uct ON uc.id = uct.use_case_id
LEFT JOIN tags t ON uct.tag_id = t.id
GROUP BY uc.id;
```

## Project Structure

```
server/
├── db/
│   ├── index.ts          # Database initialization
│   ├── schema.ts          # Schema definitions
│   └── queries.ts         # Database query functions
├── routes/
│   ├── useCases.ts        # CRUD route handlers
│   └── solutions.ts       # Legacy routes (deprecated)
├── scripts/
│   ├── migrate.ts         # Migration script
│   └── addUseCase.ts      # Utility to add use cases
└── index.ts               # Express server setup
```

## Type Safety

The backend uses TypeScript and shares types with the frontend via `shared/api.ts`. This ensures type safety across the entire stack.

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `204`: No Content (delete)
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "details": [...] // Optional, for validation errors
}
```

## Search Algorithm

The search endpoint performs:
1. Full-text search across title, description, solution, and tags
2. Category filtering (if provided)
3. Scoring based on:
   - Tag matches (weight: 1.0 per match)
   - Title matches (weight: 0.7)
   - Description matches (weight: 0.4)
   - Category matches (weight: 0.5)
4. Results sorted by score (descending), then popularity (descending)

## Future Enhancements

Potential improvements:
- Authentication/authorization
- Rate limiting
- Full-text search with SQLite FTS5
- Image/file uploads
- Admin UI for managing use cases
- Analytics and usage tracking
- Export/import functionality

## Troubleshooting

### Database locked error

If you see "database is locked" errors:
- Make sure only one instance of the server is running
- Close any SQLite GUI tools that might have the database open
- Restart the server

### Migration fails

If migration fails:
- Check that `server/data/solutions.json` exists
- Verify the JSON format is valid
- Check for duplicate IDs in the source data

### Type errors

If you see TypeScript errors:
- Run `pnpm typecheck` to see all errors
- Make sure all dependencies are installed: `pnpm install`
- Ensure TypeScript version is compatible

