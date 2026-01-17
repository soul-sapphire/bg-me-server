import express from "express";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();

app.get("/", async (req, res) => {
  const imageUrl = req.query.u;
  if (!imageUrl) return res.send("No image URL");

  // Try remove.bg first (best for people)
  try {
    const form = new FormData();
    form.append("image_url", imageUrl);
    form.append("size", "auto");

    const r = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": "jE9La5zkmFsN4AR55xzqpxP1" },
      body: form
    });

    if (r.ok) {
      const buf = await r.buffer();
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", "attachment; filename=removed-bg.png");
      return res.send(buf);
    }
  } catch {}

  // Fallback to local AI (works for everything)
  const r2 = await fetch("http://127.0.0.1:5000/?u=" + encodeURIComponent(imageUrl));
  const buf2 = await r2.buffer();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "attachment; filename=removed-bg.png");
  res.send(buf2);
});

app.listen(3000, () =>
  console.log("Server running at http://localhost:3000")
);
