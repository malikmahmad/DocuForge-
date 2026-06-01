import express from "express";
import path from "path";
import dotenv from "dotenv";

// Load environment
dotenv.config();
console.error("[MINIMAL] Env loaded");

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const cwd = process.cwd();
const staticPath = path.join(cwd, 'dist');

console.error(`[MINIMAL] CWD: ${cwd}`);
console.error(`[MINIMAL] Static Path: ${staticPath}`);
console.error(`[MINIMAL] PORT: ${PORT}`);

// Serve static files
app.use(express.static(staticPath));
console.error("[MINIMAL] Static middleware configured");

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});
console.error("[MINIMAL] Fallback route configured");

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.error(`[MINIMAL] Server listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('[MINIMAL] Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('[MINIMAL] Uncaught exception:', err);
});
