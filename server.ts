import express from "express";
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
  customHeadings?: string | string[];
  apiDetails?: string;
  advancedPrompt?: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return `# ${userInput.title}\n\n## Overview\n${userInput.description}\n\n**Note:** API Key not configured. Set GEMINI_API_KEY environment variable to generate AI-powered documentation.`;
  }

  const apiDetailsStr = typeof userInput.apiDetails === 'string' ? userInput.apiDetails : '';
  const advancedPromptStr = typeof userInput.advancedPrompt === 'string' ? userInput.advancedPrompt : '';
  const customHeadingsStr = typeof userInput.customHeadings === 'string' 
    ? userInput.customHeadings 
    : Array.isArray(userInput.customHeadings) 
      ? userInput.customHeadings.join(', ') 
      : '';

  const userProvidedAPI = apiDetailsStr && apiDetailsStr.trim().length > 0;
  const userProvidedAdvanced = advancedPromptStr && advancedPromptStr.trim().length > 0;
  const userProvidedCustomHeadings = customHeadingsStr && customHeadingsStr.trim().length > 0;

  const strictPrompt = `You are a professional documentation writer. Generate enterprise-grade Markdown documentation from ONLY the user input below. Do NOT invent anything. Do NOT add sections the user did not request. Do NOT repeat information. Be precise and structured.

Title: ${userInput.title}
Scale: ${userInput.scale}
Description: ${userInput.description}
${userProvidedAPI ? `API Details: ${apiDetailsStr}\n` : ""}${userProvidedAdvanced ? `Advanced Requirements: ${advancedPromptStr}\n` : ""}${userProvidedCustomHeadings ? `Custom Sections: ${customHeadingsStr}\n` : ""}

Generate professional Markdown documentation with the following structure:
1. Executive Summary (brief overview)
2. Project Overview (scope and context)
3. Key Features & Objectives (what will be delivered)
4. Technical Architecture (if applicable based on description)
${userProvidedAPI ? "5. API Specifications & Integration Points\n" : ""}${userProvidedAdvanced ? "6. Advanced Requirements & Specifications\n" : ""}${userProvidedCustomHeadings ? "7. Custom Sections\n" : ""}

Output ONLY the Markdown document. No preamble, no explanations, just the professional documentation.`;

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{
          text: strictPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4000,
      } as any,
    } as any);

    const content = (response.text || response.toString()).trim();

    if (!content || content.length === 0) {
      throw new Error("API returned empty response");
    }

    return content;
  } catch (error: any) {
    const errorMsg = error?.message || JSON.stringify(error);
    
    if (errorMsg.includes("API_KEY") || errorMsg.includes("401")) {
      throw new Error("API key authentication failed. Please verify your GEMINI_API_KEY is valid.");
    }
    
    if (errorMsg.includes("timeout") || errorMsg.includes("DEADLINE_EXCEEDED")) {
      throw new Error("API request timeout. Please try with shorter input.");
    }

    if (errorMsg.includes("PERMISSION_DENIED")) {
      throw new Error("Permission denied. Check your API key has access to Gemini API.");
    }

    throw error;
  }
}

// === API ENDPOINTS ===
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DocuForge API is running" });
});

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
      scale: scale || "startup",
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
    console.error("[ERROR] API error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to generate documentation"
    });
  }
});

app.get("/api/debug", (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    port: process.env.PORT,
    timestamp: new Date().toISOString()
  });
});

// === STATIC FILE SERVING & SPA SETUP ===
async function startServer() {
  try {
    const NODE_ENV = process.env.NODE_ENV || "development";
    const PORT = parseInt(process.env.PORT || "3000", 10);

    console.error(`[START] NODE_ENV: ${NODE_ENV}`);
    console.error(`[START] PORT: ${PORT}`);
    console.error(`[START] API_KEY_SET: ${!!process.env.GEMINI_API_KEY}`);

    // Serve static files
    const distPath = path.join(process.cwd(), "dist");
    
    if (existsSync(distPath)) {
      console.error(`[INFO] Serving static files from: ${distPath}`);
      app.use(express.static(distPath, {
        maxAge: "1d",
        etag: false,
        index: false
      }));
    }

    // SPA fallback - serve index.html for non-API routes
    app.get("*", (req, res) => {
      // API routes should 404
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "Not found" });
      }

      try {
        const indexPath = path.join(distPath, "index.html");
        if (existsSync(indexPath)) {
          const html = readFileSync(indexPath, "utf-8");
          res.set("Content-Type", "text/html; charset=utf-8");
          return res.send(html);
        }
      } catch (err: any) {
        console.error("[ERROR] Failed to serve index.html:", err.message);
      }

      // Fallback
      res.send(`<!DOCTYPE html>
<html>
  <head><title>DocuForge</title></head>
  <body>
    <h1>🎉 DocuForge - AI Documentation Generator</h1>
    <p>App is running. API endpoints available at /api/</p>
    <p>NODE_ENV: ${NODE_ENV}</p>
  </body>
</html>`);
    });

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.error(`✅ DocuForge Server started on port ${PORT}`);
      console.error(`📝 MODE: ${NODE_ENV}`);
      console.error(`🔒 API Key configured: ${!!process.env.GEMINI_API_KEY}`);
    });

    server.on("error", (err: any) => {
      console.error(`❌ Server error: ${err.message}`);
      process.exit(1);
    });

  } catch (err: any) {
    console.error(`❌ FATAL: Failed to start server: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

startServer();
