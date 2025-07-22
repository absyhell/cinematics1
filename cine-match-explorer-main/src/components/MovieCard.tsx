
import React from 'react';
import { Star, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  releaseYear: number;
  genres: string[];
  averageRating: number;
  director?: string;
  duration?: number;
}

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  return (
    <div className={cn("movie-card group animate-fade-in", className)}>
      <Link to={`/movie/${movie.id}`}>
        <div className="movie-poster">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
            <div className="flex items-center text-white">
              <Star className="fill-cinema-accent stroke-cinema-accent h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{movie.averageRating.toFixed(1)}</span>
            </div>
            {movie.duration && (
              <div className="flex items-center text-white">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{movie.duration} min</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <div className="movie-info">
        <div className="flex justify-between items-start">
          <Link to={`/movie/${movie.id}`} className="block">
            <h3 className="font-bold text-sm truncate hover:text-cinema-accent transition-colors">{movie.title}</h3>
            <p className="text-xs text-muted-foreground">{movie.releaseYear}</p>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-cinema-accent">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap mt-2">
          {movie.genres.slice(0, 2).map(genre => (
            <span key={genre} className="genre-tag">
              {genre}
            </span>
          ))}
          {movie.genres.length > 2 && (
            <span className="genre-tag">+{movie.genres.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
