import express from "express";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();

app.get("/", async (req, res) => {
  const imageUrl = req.query.u;
  if (!imageUrl) return res.send("No image URL");

  const form = new FormData();
  form.append("image_url", imageUrl);
  form.append("size", "auto");

  const r = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": process.env.REMOVEBG_KEY },
    body: form
  });

  if (!r.ok) {
    const err = await r.text();
    return res.status(500).send("RemoveBG failed: " + err);
  }

  const buf = await r.buffer();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "attachment; filename=removed-bg.png");
  res.send(buf);
});

app.listen(3000, () =>
  console.log("Server running")
);
