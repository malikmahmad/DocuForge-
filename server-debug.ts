import express from "express";
import path from "path";
import { existsSync, readdirSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = parseInt(process.env.PORT || "3000", 10);

// Debug info on startup
const cwd = process.cwd();
const distPath = path.join(cwd, "dist");
const indexPath = path.join(distPath, "index.html");

console.error(`=== STARTUP DEBUG ===`);
console.error(`NODE_ENV: ${NODE_ENV}`);
console.error(`PORT: ${PORT}`);
console.error(`CWD: ${cwd}`);
console.error(`DIST PATH: ${distPath}`);
console.error(`INDEX PATH: ${indexPath}`);
console.error(`INDEX EXISTS: ${existsSync(indexPath)}`);
console.error(`DIST EXISTS: ${existsSync(distPath)}`);

if (existsSync(distPath)) {
  try {
    const files = readdirSync(distPath);
    console.error(`DIST CONTENTS: ${files.join(", ")}`);
  } catch (e) {
    console.error(`Cannot read dist dir: ${e}`);
  }
}

console.error(`====================\n`);

// API endpoint for debugging
app.get("/api/debug", (req, res) => {
  res.json({
    nodeEnv: NODE_ENV,
    port: PORT,
    cwd: cwd,
    distPath: distPath,
    indexPath: indexPath,
    distExists: existsSync(distPath),
    indexExists: existsSync(indexPath),
    distContents: existsSync(distPath) ? readdirSync(distPath) : [],
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Simple test route
app.get("/", (req, res) => {
  res.send("OK - Server is running");
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.error(`[OK] Server listening on port ${PORT}`);
});

server.on("error", (err: any) => {
  console.error(`[ERROR] ${err.message}`);
  process.exit(1);
});
