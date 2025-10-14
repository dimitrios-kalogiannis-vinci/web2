import express, { Request, Response } from "express";
import { TextService, Level } from "./services/texts";

const app = express();
const port = 3000;
const textService = new TextService();

app.use(express.json());

// ==========================
// GET /texts avec filtrage par level
// ==========================
app.get("/texts", (req: Request, res: Response) => {
  const levelQuery = req.query.level as string | undefined;
  if (levelQuery && !["easy", "medium", "hard"].includes(levelQuery)) {
    return res.status(400).json({ error: "Invalid level" });
  }

  const texts = textService.getAll(levelQuery as Level | undefined);
  res.status(200).json(texts);
});

// ==========================
// GET /texts/:id
// ==========================
app.get("/texts/:id", (req: Request, res: Response) => {
  const text = textService.getById(req.params.id);
  if (!text) return res.status(404).json({ error: "Text not found" });
  res.status(200).json(text);
});

// ==========================
// POST /texts
// ==========================
app.post("/texts", (req: Request, res: Response) => {
  const { content, level } = req.body;
  if (!content || !level || !["easy", "medium", "hard"].includes(level)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  const newText = textService.create(content, level);
  res.status(201).json(newText);
});

// ==========================
// PUT /texts/:id
// ==========================
app.put("/texts/:id", (req: Request, res: Response) => {
  const { content, level } = req.body;
  if (!content || !level || !["easy", "medium", "hard"].includes(level)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  const updatedText = textService.replace(req.params.id, content, level);
  res.status(200).json(updatedText);
});

// ==========================
// DELETE /texts/:id
// ==========================
app.delete("/texts/:id", (req: Request, res: Response) => {
  const deleted = textService.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Text not found" });
  res.status(200).json(deleted);
});

// ==========================
// Lancement serveur
// ==========================
app.listen(port, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${port}`);
});
