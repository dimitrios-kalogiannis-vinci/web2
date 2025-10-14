// server.js
const express = require("express");
const app = express();
const PORT = 3000;

let films = require("./data");

app.use(express.json());

// ✅ GET /films : retourne tous les films
app.get("/films", (req, res) => {
  res.status(200).json(fils);
});

// ✅ GET /films/:id : retourne un film par ID ou 404 si non trouvé
app.get("/films/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  const film = films.find((f) => f.id === id);
  if (!film) {
    return res.status(404).json({ error: "Film non trouvé" });
  }

  res.status(200).json(film);
});

// ✅ POST /films : ajoute un nouveau film ou renvoie une erreur si invalide ou en double
app.post("/films", (req, res) => {
  const { title, director } = req.body;

  // Vérification des champs
  if (!title || !director) {
    return res.status(400).json({ error: "Champs manquants : title et director requis" });
  }

  // Vérification doublon
  const filmExiste = films.find(
    (f) => f.title.toLowerCase() === title.toLowerCase() && f.director.toLowerCase() === director.toLowerCase()
  );
  if (filmExiste) {
    return res.status(409).json({ error: "Le film existe déjà" }); // 409 Conflict
  }

  // Création du nouveau film
  const newFilm = {
    id: films.length ? films[films.length - 1].id + 1 : 1,
    title,
    director,
  };
  films.push(newFilm);

  res.status(201).json(newFilm); // 201 Created
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});