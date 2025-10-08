import express, { Application, Request, Response, NextFunction } from 'express';
import filmsRouter from './routes/films';

const app: Application = express();
const PORT = 3000;

// ✅ Compteur global de requêtes GET
let getRequestCount = 0;

// 📌 Middleware de niveau application
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    getRequestCount++;
    console.log(`GET counter : ${getRequestCount}`);
  }
  next();
});

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/films', filmsRouter);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

