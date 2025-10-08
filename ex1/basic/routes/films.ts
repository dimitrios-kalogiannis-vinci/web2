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
  res.json(films);
});

export default router;
