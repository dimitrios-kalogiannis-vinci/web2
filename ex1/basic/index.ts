import express, { Request, Response, NextFunction } from "express";
const app = express();
const port = 3000;

app.use(express.json());

// ==========================
// Données initiales
// ==========================
let films = [
  { id: 1, title: "Inception", director: "Christopher Nolan", duration: 148, budget: 160 },
  { id: 2, title: "Interstellar", director: "Christopher Nolan", duration: 169, budget: 165 },
  { id: 3, title: "Parasite", director: "Bong Joon-ho", duration: 132, budget: 11 },
];

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
  res.status(200).json(films);
});

// ==========================
// GET /films/:id
// ==========================
app.get("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const film = films.find(f => f.id === id);
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

  const exists = films.find(f => f.title === title && f.director === director);
  if (exists) return res.status(409).json({ error: "Film already exists" });

  const newFilm = {
    id: films.length ? Math.max(...films.map(f => f.id)) + 1 : 1,
    title,
    director,
    duration,
    budget
  };
  films.push(newFilm);
  res.status(201).json(newFilm);
});

// ==========================
// DELETE /films/:id
// ==========================
app.delete("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const index = films.findIndex(f => f.id === id);
  if (index === -1) return res.status(404).json({ error: "Film not found" });

  const deleted = films.splice(index, 1);
  res.status(200).json(deleted[0]);
});

// ==========================
// PATCH /films/:id
// ==========================
app.patch("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const film = films.find(f => f.id === id);
  if (!film) return res.status(404).json({ error: "Film not found" });

  const { title, director, duration, budget } = req.body;

  if (duration !== undefined && (typeof duration !== "number" || duration <= 0))
    return res.status(400).json({ error: "Invalid duration" });

  if (budget !== undefined && (typeof budget !== "number" || budget <= 0))
    return res.status(400).json({ error: "Invalid budget" });

  if (title !== undefined) film.title = title;
  if (director !== undefined) film.director = director;
  if (duration !== undefined) film.duration = duration;
  if (budget !== undefined) film.budget = budget;

  res.status(200).json(film);
});

// ==========================
// PUT /films/:id
// ==========================
app.put("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { title, director, duration, budget } = req.body;

  // Vérification des champs obligatoires
  if (!title || !director || duration === undefined)
    return res.status(400).json({ error: "Missing required fields for PUT" });

  if (typeof duration !== "number" || duration <= 0)
    return res.status(400).json({ error: "Invalid duration" });

  if (budget !== undefined && (typeof budget !== "number" || budget <= 0))
    return res.status(400).json({ error: "Invalid budget" });

  const existingIndex = films.findIndex(f => f.id === id);

  const newFilm = { id, title, director, duration, budget };

  if (existingIndex !== -1) {
    films[existingIndex] = newFilm;
    return res.status(200).json(newFilm);
  }

  // Si le film n'existe pas, création seulement si l'id n'est pas déjà utilisé
  if (films.find(f => f.id === id))
    return res.status(409).json({ error: "ID already exists" });

  films.push(newFilm);
  res.status(201).json(newFilm);
});

// ==========================
// Lancement serveur
// ==========================
app.listen(port, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${port}`);
});
