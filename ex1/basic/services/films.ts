import fs from "fs";
import path from "path";

const dataFile = path.join(__dirname, "../../data/films.json");

export interface Film {
  id: number;
  title: string;
  director: string;
  duration: number;
  budget?: number;
}

export class FilmService {
  private readFilms(): Film[] {
    try {
      const data = fs.readFileSync(dataFile, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Erreur lecture films.json", err);
      return [];
    }
  }

  private writeFilms(films: Film[]) {
    try {
      fs.writeFileSync(dataFile, JSON.stringify(films, null, 2), "utf-8");
    } catch (err) {
      console.error("Erreur écriture films.json", err);
    }
  }

  getAll(): Film[] {
    return this.readFilms();
  }

  getById(id: number): Film | null {
    const films = this.readFilms();
    return films.find(f => f.id === id) || null;
  }

  create(filmData: Omit<Film, "id">): Film | null {
    const films = this.readFilms();

    const exists = films.find(
      f => f.title === filmData.title && f.director === filmData.director
    );
    if (exists) return null;

    const newFilm: Film = {
      id: films.length ? Math.max(...films.map(f => f.id)) + 1 : 1,
      ...filmData
    };

    films.push(newFilm);
    this.writeFilms(films);
    return newFilm;
  }

  update(id: number, filmData: Partial<Omit<Film, "id">>): Film | null {
    const films = this.readFilms();
    const film = films.find(f => f.id === id);
    if (!film) return null;

    Object.assign(film, filmData);
    this.writeFilms(films);
    return film;
  }

  replace(id: number, filmData: Omit<Film, "id">): Film {
    const films = this.readFilms();
    const existingIndex = films.findIndex(f => f.id === id);

    const newFilm: Film = { id, ...filmData };

    if (existingIndex !== -1) {
      films[existingIndex] = newFilm;
    } else {
      films.push(newFilm);
    }

    this.writeFilms(films);
    return newFilm;
  }

  delete(id: number): Film | null {
    const films = this.readFilms();
    const index = films.findIndex(f => f.id === id);
    if (index === -1) return null;

    const deleted = films.splice(index, 1)[0];
    this.writeFilms(films);
    return deleted;
  }
}
