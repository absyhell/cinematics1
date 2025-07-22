
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Play, Clock, Calendar } from 'lucide-react';
import { Movie } from './MovieCard';

interface HeroProps {
  featuredMovie: Movie;
}

const Hero = ({ featuredMovie }: HeroProps) => {
  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={featuredMovie.posterUrl} 
          alt={featuredMovie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema via-cinema/60 to-transparent" />
      </div>
      
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {featuredMovie.title}
          </h1>
          
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Star className="fill-cinema-accent stroke-cinema-accent h-5 w-5 mr-1" />
              <span>{featuredMovie.averageRating.toFixed(1)}</span>
            </div>
            {featuredMovie.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{featuredMovie.duration} min</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{featuredMovie.releaseYear}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {featuredMovie.genres.map(genre => (
              <span key={genre} className="bg-cinema-light text-xs font-medium px-3 py-1 rounded-full">
                {genre}
              </span>
            ))}
          </div>
          
          <p className="text-muted-foreground text-sm md:text-base line-clamp-3">
            A captivating story of adventure and discovery that will keep you on the edge of your seat.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Button className="bg-cinema-accent text-cinema hover:bg-cinema-accent-hover">
              <Play className="h-4 w-4 mr-2" /> Watch Trailer
            </Button>
            <Button variant="outline" className="border-white/20 hover:bg-white/10 transition-colors">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
