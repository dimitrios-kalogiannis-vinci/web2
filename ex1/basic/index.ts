import express, { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;

app.use(express.json());

// ==========================
// Données hardcodées initiales
// ==========================
let films = [
  {
    id: 1,
    title: "Le Seigneur des Anneaux : La Communauté de l'Anneau",
    director: "Peter Jackson",
    duration: 178,
    budget: 93,
    description:
      "https://fr.wikipedia.org/wiki/Le_Seigneur_des_Anneaux_:_La_Communaut%C3%A9_de_l%27Anneau",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/fr/0/0c/Seigneur_des_anneaux_I.jpg",
  },
  {
    id: 2,
    title: "Inception",
    director: "Christopher Nolan",
    duration: 148,
    budget: 160,
    description: "https://fr.wikipedia.org/wiki/Inception",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/fr/7/7f/Inception_ver3.jpg",
  },
  {
    id: 3,
    title: "Parasite",
    director: "Bong Joon-ho",
    duration: 132,
    budget: 11,
    description: "https://fr.wikipedia.org/wiki/Parasite_(film,_2019)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/fr/6/69/Parasite.png",
  },
  {
    id: 4,
    title: "Interstellar",
    director: "Christopher Nolan",
    duration: 169,
    budget: 165,
    description:
      "https://fr.wikipedia.org/wiki/Interstellar_(film)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/fr/b/bc/Interstellar_film_poster.jpg",
  },
  {
    id: 5,
    title: "Avatar",
    director: "James Cameron",
    duration: 162,
    budget: 237,
    description:
      "https://fr.wikipedia.org/wiki/Avatar_(film,_2009)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/fr/b/b0/Avatar_poster.jpg",
  },
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
// GET /films avec tri, filtre et pagination
// ==========================
app.get("/films", (req: Request, res: Response) => {
  let result = [...films];

  // --- Filtrage par durée minimale ---
  const minDurationStr = req.query["minimum-duration"] as string | undefined;
  if (minDurationStr !== undefined) {
    const minDuration = Number(minDurationStr);
    if (isNaN(minDuration) || minDuration <= 0) {
      return res.status(400).json({ error: "Wrong minimum duration" });
    }
    result = result.filter((film) => film.duration >= minDuration);
  }

  // --- Filtrage par titre commençant par une chaîne ---
  const titleFilter = req.query["title-starts-with"] as string | undefined;
  if (titleFilter) {
    const lower = titleFilter.toLowerCase();
    result = result.filter((film) =>
      film.title.toLowerCase().startsWith(lower)
    );
  }

  // --- Tri ---
  const sortBy = req.query["sort-by"] as string | undefined; // ex: title, duration, budget
  const order = (req.query["order"] as string | undefined) || "asc"; // asc ou desc
  if (sortBy) {
    result.sort((a: any, b: any) => {
      if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  // --- Pagination ---
  const pageStr = req.query["page"] as string | undefined;
  const limitStr = req.query["limit"] as string | undefined;

  if (pageStr && limitStr) {
    const page = Number(pageStr);
    const limit = Number(limitStr);

    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    result = result.slice(startIndex, endIndex);
  }

  res.status(200).json(result);
});

// ==========================
// GET /films/:id
// ==========================
app.get("/films/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const film = films.find((f) => f.id === id);
  if (!film) {
    return res.status(404).json({ error: "Film not found" });
  }
  res.status(200).json(film);
});

// ==========================
// POST /films
// ==========================
app.post("/films", (req: Request, res: Response) => {
  const { title, director, duration, budget, description, imageUrl } = req.body;

  if (!title || !director || duration === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof duration !== "number" || duration <= 0) {
    return res.status(400).json({ error: "Invalid duration" });
  }
  if (budget !== undefined && (typeof budget !== "number" || budget <= 0)) {
    return res.status(400).json({ error: "Invalid budget" });
  }

  const newFilm = {
    id: films.length > 0 ? Math.max(...films.map((f) => f.id)) + 1 : 1,
    title,
    director,
    duration,
    budget,
    description,
    imageUrl,
  };

  films.push(newFilm);
  res.status(201).json(newFilm);
});

// ==========================
// Lancement du serveur
// ==========================
app.listen(port, () => {
  console.log(`✅ Serveur en écoute sur http://localhost:${port}`);
});
