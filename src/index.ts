import { serve } from "bun";

serve({
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = "./src" + (url.pathname === "/" ? "/index.html" : url.pathname);
    const file = Bun.file(filePath);
    const exists = await file.exists();
    if (exists) return new Response(file);
    return new Response("Not found", { status: 404 });
  },
});
