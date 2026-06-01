import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PORT = parseInt(process.env.PORT || "3000", 10);
const cwd = process.cwd();
const indexPath = join(cwd, "dist", "index.html");

console.error(`[NATIVE] CWD: ${cwd}`);
console.error(`[NATIVE] Index path: ${indexPath}`);
console.error(`[NATIVE] Index exists: ${existsSync(indexPath)}`);

const server = createServer((req, res) => {
  console.error(`[NATIVE] ${req.method} ${req.url}`);
  
  try {
    const content = readFileSync(indexPath, "utf-8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  } catch (err) {
    console.error(`[NATIVE] Error: ${err.message}`);
    res.writeHead(500);
    res.end("Error: " + err.message);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.error(`[NATIVE] Listening on port ${PORT}`);
  console.log(`🚀 Server running`);
});

server.on("error", (err) => {
  console.error("[NATIVE] Server error:", err);
  process.exit(1);
});
