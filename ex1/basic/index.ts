import express, { Request, Response, NextFunction } from "express";
import { FilmService, Film } from "./services/films";

const app = express();
const port = 3000;
const filmService = new FilmService();

app.use(express.json());

// ==========================
// Middleware compteur GET
// ==========================
let getRequestCount = 0;
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    getRequestCount++;
    console.log(`GET counter : ${getRequestCount}`);
  }
  next();
});

// ==========================
// GET /films
// ==========================
app.get("/films", (req: Request, res: Response) => {
  const films = filmService.getAll();
  res.status(200).json(films);
});

// ==========================
// GET /films/:id
// ==========================
app.get("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const film = filmService.getById(id);
  if (!film) return res.status(404).json({ error: "Film not found" });

  res.status(200).json(film);
});

// ==========================
// POST /films
// ==========================
app.post("/films", (req: Request, res: Response) => {
  const { title, director, duration, budget } = req.body;

  if (!title || !director || duration === undefined)
    return res.status(400).json({ error: "Missing required fields" });

  if (typeof duration !== "number" || duration <= 0)
    return res.status(400).json({ error: "Invalid duration" });

  if (budget !== undefined && (typeof budget !== "number" || budget <= 0))
    return res.status(400).json({ error: "Invalid budget" });

  const newFilm = filmService.create({ title, director, duration, budget });
  if (!newFilm) return res.status(409).json({ error: "Film already exists" });

  res.status(201).json(newFilm);
});

// ==========================
// PATCH /films/:id
// ==========================
app.patch("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { title, director, duration, budget } = req.body;

  if (duration !== undefined && (typeof duration !== "number" || duration <= 0))
    return res.status(400).json({ error: "Invalid duration" });

  if (budget !== undefined && (typeof budget !== "number" || budget <= 0))
    return res.status(400).json({ error: "Invalid budget" });

  const updatedFilm = filmService.update(id, { title, director, duration, budget });
  if (!updatedFilm) return res.status(404).json({ error: "Film not found" });

  res.status(200).json(updatedFilm);
});

// ==========================
// PUT /films/:id
// ==========================
app.put("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { title, director, duration, budget } = req.body;
  if (!title || !director || duration === undefined)
    return res.status(400).json({ error: "Missing required fields for PUT" });

  if (typeof duration !== "number" || duration <= 0)
    return res.status(400).json({ error: "Invalid duration" });

  if (budget !== undefined && (typeof budget !== "number" || budget <= 0))
    return res.status(400).json({ error: "Invalid budget" });

  const film = filmService.replace(id, { title, director, duration, budget });
  res.status(filmService.getById(id) ? 200 : 201).json(film);
});

// ==========================
// DELETE /films/:id
// ==========================
app.delete("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const deleted = filmService.delete(id);
  if (!deleted) return res.status(404).json({ error: "Film not found" });

  res.status(200).json(deleted);
});

// ==========================
// Lancement serveur
// ==========================
app.listen(port, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${port}`);
});
