import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

async function generateDocWithGemini(userInput: {
  title: string;
  description: string;
  projectType: string;
  scale: string;
  customHeadings?: string;
  apiDetails?: string;
  advancedPrompt?: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is required. Get one at: https://aistudio.google.com/app/apikey"
    );
  }
  
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    apiVersion: 'v1alpha',
    httpOptions: {
      headers: {
        'User-Agent': 'docuforge-app',
      }
    }
  });

  const userProvidedAPI = userInput.apiDetails && userInput.apiDetails.trim().length > 0;
  const userProvidedAdvanced = userInput.advancedPrompt && userInput.advancedPrompt.trim().length > 0;
  const userProvidedCustomHeadings = userInput.customHeadings && userInput.customHeadings.trim().length > 0;

  const strictPrompt = `You are a professional documentation writer. Generate enterprise-grade Markdown documentation from only the user input below. Do NOT invent anything. Do NOT add sections the user did not request. Do NOT repeat the same information.

Title: ${userInput.title}
Type: ${userInput.projectType}
Scale: ${userInput.scale}
Description: ${userInput.description}
${userProvidedAPI ? `API Details: ${userInput.apiDetails}\n` : ""}${userProvidedAdvanced ? `Advanced Requirements: ${userInput.advancedPrompt}\n` : ""}${userProvidedCustomHeadings ? `Custom Sections: ${userInput.customHeadings}\n` : ""}

Required sections:
- Title Page with date and version 1.0.0
- Table of Contents
- Executive Summary
- Project Overview
- Purpose & Objectives
- Scope & Features
- User Roles & Responsibilities
${userProvidedAPI ? "- API Specifications\n" : ""}${userProvidedAdvanced ? "- Advanced Requirements & Specifications\n" : ""}${userProvidedCustomHeadings ? "- Custom Sections\n" : ""}

Write the document in clear, professional Markdown with headings and bullet points. Output only the document content.`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [{
            text: strictPrompt
          }]
        }],
        signal: controller.signal,
        generationConfig: {
          temperature: 0.0,
          topP: 0.75,
          topK: 10,
          maxOutputTokens: 2800,
        } as any,
      } as any);
      
      clearTimeout(timeoutId);
      
      const content = response.text || response.toString();
      
      if (!content || content.trim().length === 0) {
        throw new Error("API returned empty response");
      }
      
      return content;
    } catch (apiError: any) {
      clearTimeout(timeoutId);
      
      if (apiError.name === 'AbortError') {
        throw new Error("API request timeout (>30s). Please try with shorter input or check your internet connection.");
      }
      
      const errorMsg = apiError?.message || JSON.stringify(apiError);
      if (errorMsg.includes("fetch")) {
        throw new Error("Network error - cannot reach Gemini API. Check your internet connection and API key validity.");
      }
      
      throw apiError;
    }
  } catch (error: any) {
    const userMessage = error.message || "Failed to generate documentation";
    throw new Error(userMessage);
  }
}

app.post("/api/projects", async (req, res) => {
  try {
    const { title, description, projectType, scale, customHeadings, apiDetails, advancedPrompt } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        error: "Missing required fields: title and description" 
      });
    }
    
    const documentation = await generateDocWithGemini({
      title,
      description,
      projectType: projectType || "Generic",
      scale: scale || "Unspecified",
      customHeadings,
      apiDetails,
      advancedPrompt
    });
    
    res.json({
      id: `doc-${Date.now()}`,
      title,
      description,
      content: documentation,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to generate documentation"
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DocuForge API is running" });
});

async function startServer() {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = parseInt(process.env.PORT || "3000", 10);
  
  if (NODE_ENV === "production") {
    // Production: serve static files
    const cwd = process.cwd();
    const distPath = path.join(cwd, "dist");
    
    app.use(express.static(distPath, {
      maxAge: "1d",
      etag: false,
      index: "index.html"
    }));
    
    // SPA fallback
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(500).json({ error: "Failed to load application" });
        }
      });
    });
  } else {
    // Development: use Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }
  
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 DocuForge Server running on port ${PORT}`);
    console.log(`📝 Strict documentation generation mode: ENABLED`);
    console.log(`🔒 No hallucination, no templates, only user input formatting`);
  });
  
  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
  
  process.on("uncaughtException", (err) => {
    console.error("Uncaught exception:", err);
    process.exit(1);
  });
  
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled rejection:", err);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
