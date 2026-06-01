import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

console.error(`[FINAL] Starting on port ${PORT}`);

// Health check - always works
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Catch all - serve simple test page
app.get("*", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DocuForge - Server Running</title>
      </head>
      <body>
        <h1>✅ Server is Running!</h1>
        <p>Path: ${req.path}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.error(`[FINAL] ✅ Listening on ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("[FINAL] Server error:", err.message);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("[FINAL] Uncaught exception:", err.message);
  process.exit(1);
});
