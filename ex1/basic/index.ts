import express, { Application } from 'express';
import filmsRouter from './routes/films';

const app: Application = express();
const PORT = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route principale
app.use('/films', filmsRouter);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
