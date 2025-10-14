import { Router, Request, Response } from 'express';

const router = Router();

// Hardcoding de 3 films préférés
const films = [
  {
    id: 1,
    title: "Le Seigneur des Anneaux : La Communauté de l'Anneau",
    director: "Peter Jackson",
    duration: 178,
    budget: 93, // en millions USD
    description: "https://fr.wikipedia.org/wiki/Le_Seigneur_des_anneaux_:_La_Communaut%C3%A9_de_l%27anneau",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/0/0c/The_Fellowship_Of_The_Ring.jpg"
  },
  {
    id: 2,
    title: "Inception",
    director: "Christopher Nolan",
    duration: 148,
    budget: 160,
    description: "https://fr.wikipedia.org/wiki/Inception",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg"
  },
  {
    id: 3,
    title: "Interstellar",
    director: "Christopher Nolan",
    duration: 169,
    budget: 165,
    description: "https://fr.wikipedia.org/wiki/Interstellar",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
  }
];

// READ ALL - GET /films
router.get('/', (req: Request, res: Response) => {
  let results = films;
  // Filtrage par durée minimale si le query param 'duration' est présent
  const minDurationParam = req.query['duration'];

  if(minDurationParam!==undefined){
    const minDuration = Number(minDurationParam);
    if(!isNaN(minDuration) || minDuration <= 0){
      return res.status(400).json({error: "Le paramètre 'duration' doit être un nombre positif."});
    }
    const filteredFilms = films.filter(film => film.duration >= minDuration);
    return res.json(filteredFilms);
  }
  res.json(films);
});

router.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if(isNaN(id)){
    return res.status(400).json({error: "L'id doit être un nombre."});
  }
  const film = films.find(f => f.id === id);
  if(!film){
    return res.status(404).json({error: "Film non trouvé."});
  }
  res.json(film);
});

router.post('/', (req: Request, res: Response) => {
  const { title, director, duration, budget, description, imageUrl } = req.body;
  if (!title || !director || !duration) {
    return res.status(400).json({ error: "Tous les champs basiques sont requis." });
  }

  if (typeof title !== 'string' || typeof director !== 'string') {
    return res.status(400).json({ error: "Titre et directeur doivent être en string" });
  }

  if (typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ error: "Durée doit être en entier positif" });
  }
  if(budget !== undefined && (typeof budget !== 'number' || budget < 0)){
    return res.status(400).json({ error: "Budget doit être un entier positif" });
  }
  const newFilm = {
    id: films.length + 1,
    title,
    director,
    duration,
    budget,
    description,
    imageUrl
  };
  films.push(newFilm);
  res.status(201).json(newFilm);
});

export default router;
