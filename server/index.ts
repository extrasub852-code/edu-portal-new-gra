import dotenv from "dotenv";
import path from "path";

// Load .env from project root so OPENAI_API_KEY is available in dev and production
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";
import {
  listSolutions,
  searchSolutions,
} from "./routes/solutions.js";
import {
  listUseCases,
  getUseCase,
  getUseCaseBySlug,
  searchUseCases,
  getUseCaseSuggestions,
  createUseCaseHandler,
  updateUseCaseHandler,
  deleteUseCaseHandler,
  trackUseCaseAnalytics,
} from "./routes/useCases.js";
import { generateUseCaseAnalysis } from "./routes/useCaseAnalysis.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Use Case Finder routes (backward compatible)
  app.get("/api/solutions", listSolutions);
  app.get("/api/solutions/search", searchSolutions);
  app.post("/api/solutions/search", searchSolutions);

  // Enhanced Use Case routes
  // Note: More specific routes (search, suggestions, slug) must come before parameterized routes (:id)
  app.get("/api/use-cases", listUseCases);
  app.get("/api/use-cases/search", searchUseCases);
  app.post("/api/use-cases/search", searchUseCases);
  app.get("/api/use-cases/suggestions", getUseCaseSuggestions);
  app.post("/api/use-cases/suggestions", getUseCaseSuggestions);
  app.get("/api/use-cases/slug/:slug", getUseCaseBySlug);
  app.get("/api/use-cases/:id", getUseCase);
  
  // Analytics route
  app.post("/api/use-cases/analytics", trackUseCaseAnalytics);
  
  // Use Case Analysis generation (AI-powered)
  app.post("/api/use-cases/analyze", generateUseCaseAnalysis);
  
  // CRUD routes for use cases (placeholder)
  app.post("/api/use-cases", createUseCaseHandler);
  app.put("/api/use-cases/:id", updateUseCaseHandler);
  app.delete("/api/use-cases/:id", deleteUseCaseHandler);

  return app;
}
