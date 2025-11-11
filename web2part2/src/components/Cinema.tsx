// src/components/Cinema.tsx
import React from "react";
import type { CinemaProps } from "../type";

const Cinema = ({ name, movies }: CinemaProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <strong>{movie.title}</strong> - Réalisateur : {movie.director}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cinema;
