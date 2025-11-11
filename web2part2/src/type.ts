// src/types.ts
export type Movie = {
  title: string;
  director: string;
};

export type PageTitleProps = {
  title: string;
};

export type CinemaProps = {
  name: string;
  movies: Movie[];
};
