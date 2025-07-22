
import React from 'react';
import MovieCard, { Movie } from './MovieCard';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieGridProps {
  title?: string;
  movies: Movie[];
  className?: string;
  isLoading?: boolean;
}

const MovieGrid = ({ title, movies, className, isLoading = false }: MovieGridProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          {isLoading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-cinema-accent border-t-transparent" />
          )}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          // Show skeleton loaders when loading
          Array(5).fill(0).map((_, index) => (
            <div key={`skeleton-${index}`} className="flex flex-col space-y-2">
              <Skeleton className="h-[180px] sm:h-[220px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : movies.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No movies found.
          </div>
        ) : (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieGrid;
