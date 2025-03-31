import { serve } from "bun";
import path from "path";
import fs from "fs";

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(import.meta.dir, "src"); // Ensure static files are served from a defined folder

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = path.join(PUBLIC_DIR, url.pathname);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(PUBLIC_DIR)) {
      return new Response("Forbidden", { status: 403 });
    }

    try {
      const stat = await fs.promises.stat(filePath);

      // If it's a directory, serve index.html inside it (if exists)
      if (stat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }

      // Ensure file exists before serving
      if (!fs.existsSync(filePath)) {
        return new Response("Not Found", { status: 404 });
      }

      return new Response(Bun.file(filePath));
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log(`✅ Server running at: ${process.env.VERCEL_URL || `http://localhost:${PORT}`}`);

