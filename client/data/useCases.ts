// This file is kept for backward compatibility
// The actual use cases are now fetched from the API
// See client/pages/UseCaseFinder.tsx for the implementation

import type { UseCase } from "@shared/api";

// Legacy use cases - deprecated, use API instead
export const useCases: UseCase[] = [];

export const categories = [
  "Education",
  "Healthcare",
  "Marketing",
  "Technology",
  "Business",
];
