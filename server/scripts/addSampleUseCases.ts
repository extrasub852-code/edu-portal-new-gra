#!/usr/bin/env tsx
/**
 * Script to add diverse sample use cases with comprehensive tags
 */

import { initDatabase } from "../db/index.js";
import { createUseCase, setUseCaseTags } from "../db/queries.js";

const sampleUseCases = [
  {
    title: "Fraud Detection System",
    description: "AI-powered fraud detection system that analyzes transaction patterns, user behavior, and anomaly detection to identify fraudulent activities in real-time.",
    solution: "Implement machine learning models using historical transaction data to detect anomalies. Use features like transaction amount, location, time patterns, and user behavior. Set up real-time monitoring with alerts for suspicious activities.",
    author: "SecurityAI Team",
    category: "Security",
    tags: ["fraud", "detection", "anomaly-detection", "security", "ml", "real-time", "transaction-monitoring", "risk-analysis"],
    rating: 4.9,
    popularity: 2100,
  },
  {
    title: "Customer Segmentation Platform",
    description: "Advanced customer segmentation using clustering algorithms to group customers based on purchasing behavior, demographics, and engagement patterns for targeted marketing campaigns.",
    solution: "Use K-means or hierarchical clustering on customer data including purchase history, demographics, and engagement metrics. Create customer personas and enable personalized marketing campaigns.",
    author: "MarketingTech",
    category: "Marketing",
    tags: ["customer-segmentation", "clustering", "marketing", "personalization", "analytics", "crm", "data-science"],
    rating: 4.7,
    popularity: 1800,
  },
  {
    title: "Sentiment Analysis for Social Media",
    description: "Real-time sentiment analysis of social media posts, reviews, and comments to understand public opinion and brand perception.",
    solution: "Use NLP models (BERT, RoBERTa) to classify sentiment as positive, negative, or neutral. Process streaming data from social media APIs and provide dashboards with sentiment trends.",
    author: "SocialAI",
    category: "Marketing",
    tags: ["sentiment-analysis", "nlp", "social-media", "text-analysis", "brand-monitoring", "reviews", "opinion-mining"],
    rating: 4.6,
    popularity: 1650,
  },
  {
    title: "Predictive Maintenance System",
    description: "Predict equipment failures before they happen using sensor data and machine learning to schedule maintenance proactively, reducing downtime and costs.",
    solution: "Collect sensor data (temperature, vibration, pressure) from equipment. Train time-series models to predict failures. Set up alerts when failure probability exceeds threshold.",
    author: "IoT Solutions",
    category: "Technology",
    tags: ["predictive-maintenance", "iot", "time-series", "ml", "sensors", "equipment-monitoring", "preventive-maintenance"],
    rating: 4.8,
    popularity: 1950,
  },
  {
    title: "Recommendation Engine",
    description: "Personalized product or content recommendation system using collaborative filtering and content-based approaches to improve user engagement and sales.",
    solution: "Implement hybrid recommendation system combining collaborative filtering (user-item interactions) and content-based filtering (item features). Use matrix factorization and deep learning for better accuracy.",
    author: "RecSys Pro",
    category: "Technology",
    tags: ["recommendations", "collaborative-filtering", "personalization", "ml", "e-commerce", "content-recommendation"],
    rating: 4.7,
    popularity: 1750,
  },
  {
    title: "Medical Diagnosis Assistant",
    description: "AI assistant that helps doctors by analyzing patient symptoms, medical history, and test results to suggest possible diagnoses and treatment options.",
    solution: "Train deep learning models on medical records and symptom databases. Implement decision support system that provides differential diagnoses ranked by probability. Include safety checks and explanations.",
    author: "HealthTech AI",
    category: "Healthcare",
    tags: ["medical-ai", "diagnosis", "healthcare", "symptoms", "clinical-decision-support", "nlp", "medical-records"],
    rating: 4.9,
    popularity: 2200,
  },
  {
    title: "Demand Forecasting System",
    description: "Predict future product demand using historical sales data, seasonality patterns, and external factors to optimize inventory and supply chain management.",
    solution: "Use time-series forecasting models (ARIMA, Prophet, LSTM) with features like historical sales, promotions, seasonality, and economic indicators. Generate forecasts with confidence intervals.",
    author: "SupplyChain AI",
    category: "Business",
    tags: ["forecasting", "demand-planning", "time-series", "inventory", "supply-chain", "sales-prediction"],
    rating: 4.6,
    popularity: 1400,
  },
  {
    title: "Image Classification for Quality Control",
    description: "Computer vision system that automatically detects defects and quality issues in manufacturing using image classification and object detection.",
    solution: "Train CNN models (ResNet, EfficientNet) on images of good and defective products. Deploy on edge devices for real-time inspection. Set up feedback loop for continuous improvement.",
    author: "VisionAI",
    category: "Technology",
    tags: ["computer-vision", "image-classification", "quality-control", "manufacturing", "defect-detection", "cnn"],
    rating: 4.8,
    popularity: 1900,
  },
  {
    title: "Credit Scoring Model",
    description: "Machine learning model that assesses creditworthiness of loan applicants by analyzing financial history, employment, and risk factors.",
    solution: "Build ensemble models (XGBoost, Random Forest) using features like credit history, income, debt-to-income ratio, employment status. Ensure model interpretability for regulatory compliance.",
    author: "FinanceAI",
    category: "Business",
    tags: ["credit-scoring", "risk-assessment", "finance", "ml", "loan-assessment", "credit-risk"],
    rating: 4.7,
    popularity: 1600,
  },
  {
    title: "Language Translation Service",
    description: "Real-time multilingual translation service supporting 100+ languages for websites, applications, and documents.",
    solution: "Use transformer-based models (mBART, mT5) fine-tuned for specific language pairs. Implement caching for common translations. Provide API for easy integration.",
    author: "TranslateAI",
    category: "Technology",
    tags: ["translation", "nlp", "multilingual", "language-processing", "transformer", "localization"],
    rating: 4.6,
    popularity: 1500,
  },
];

async function addSampleUseCases() {
  console.log("Initializing database...");
  initDatabase();
  
  console.log(`Adding ${sampleUseCases.length} sample use cases...\n`);
  
  let added = 0;
  let skipped = 0;
  
  for (const useCase of sampleUseCases) {
    try {
      const created = createUseCase({
        title: useCase.title,
        description: useCase.description,
        solution: useCase.solution,
        author: useCase.author,
        category: useCase.category,
        rating: useCase.rating,
        popularity: useCase.popularity,
        dateAdded: new Date().toISOString(),
      });
      
      // Set tags
      if (useCase.tags && useCase.tags.length > 0) {
        setUseCaseTags(created.id, useCase.tags);
      }
      
      added++;
      console.log(`✓ Added: ${useCase.title}`);
      console.log(`  Tags: ${useCase.tags.join(", ")}\n`);
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint")) {
        skipped++;
        console.log(`⊘ Skipped (already exists): ${useCase.title}\n`);
      } else {
        console.error(`✗ Error adding ${useCase.title}:`, error.message);
      }
    }
  }
  
  console.log("\n" + "=".repeat(50));
  console.log(`Successfully added: ${added}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${sampleUseCases.length}`);
}

addSampleUseCases().catch((error) => {
  console.error("Failed to add sample use cases:", error);
  process.exit(1);
});

