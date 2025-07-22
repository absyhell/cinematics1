
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  className?: string;
}

const GenreFilter = ({ genres, selectedGenre, onSelectGenre, className }: GenreFilterProps) => {
  return (
    <div className={cn("flex overflow-x-auto pb-2 hide-scrollbar", className)}>
      <div className="flex space-x-2">
        <Button
          variant={selectedGenre === 'All' ? 'default' : 'outline'}
          size="sm"
          className={selectedGenre === 'All' ? 'bg-cinema-accent text-cinema' : 'border-cinema-light'}
          onClick={() => onSelectGenre('All')}
        >
          All
        </Button>
        
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? 'default' : 'outline'}
            size="sm"
            className={selectedGenre === genre ? 'bg-cinema-accent text-cinema' : 'border-cinema-light'}
            onClick={() => onSelectGenre(genre)}
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GenreFilter;
