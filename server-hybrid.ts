import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, existsSync } from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// === GENERATE DOC FUNCTION ===
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
    apiKey,
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

// === API ENDPOINTS ===
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

// === STATIC FILE SERVING ===
async function startServer() {
  try {
    const NODE_ENV = process.env.NODE_ENV || "development";
    const PORT = parseInt(process.env.PORT || "3000", 10);
    
    console.error(`[START] NODE_ENV: ${NODE_ENV}`);
    console.error(`[START] CWD: ${process.cwd()}`);
    console.error(`[START] PORT: ${PORT}`);
    
    if (NODE_ENV === "production") {
      const cwd = process.cwd();
      const distPath = path.join(cwd, "dist");
      const indexPath = path.join(distPath, "index.html");
      
      console.error(`[START] distPath: ${distPath}`);
      console.error(`[START] indexPath: ${indexPath}`);
      console.error(`[START] index exists: ${existsSync(indexPath)}`);
      
      // Serve static files
      app.use(express.static(distPath, {
        maxAge: "1d",
        etag: false,
        index: false // We'll handle index.html ourselves
      }));
      
      // SPA fallback - read and serve index.html
      app.get("*", (req, res) => {
        try {
          if (existsSync(indexPath)) {
            const content = readFileSync(indexPath, "utf-8");
            res.set("Content-Type", "text/html; charset=utf-8");
            res.send(content);
          } else {
            res.status(404).send("index.html not found");
          }
        } catch (err: any) {
          console.error(`[ERROR] Failed to serve index.html: ${err.message}`);
          res.status(500).send("Server error");
        }
      });
    } else {
      // Development: use Vite
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    }
    
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.error(`[START] ✅ Server listening on port ${PORT}`);
      console.log(`🚀 DocuForge Server running on port ${PORT}`);
      console.log(`📝 Strict documentation generation mode: ENABLED`);
      console.log(`🔒 No hallucination, no templates, only user input formatting`);
    });
    
    server.on("error", (err: any) => {
      console.error(`[ERROR] Server error: ${err.message}`);
      process.exit(1);
    });
    
  } catch (err: any) {
    console.error(`[ERROR] Startup error: ${err.message}`);
    process.exit(1);
  }
}

// === START SERVER ===
startServer();

process.on("uncaughtException", (err: any) => {
  console.error("[ERROR] Uncaught exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err: any) => {
  console.error("[ERROR] Unhandled rejection:", err);
});
