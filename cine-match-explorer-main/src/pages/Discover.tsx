
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MovieGrid from '@/components/MovieGrid';
import GenreFilter from '@/components/GenreFilter';
import { Movie } from '@/components/MovieCard';
import { genres } from '@/data/mockMovies';
import { fetchMovies, fetchMoviesByGenre } from '@/services/movieService';
import { useToast } from '@/hooks/use-toast';

const Discover = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = selectedGenre === 'All' 
          ? await fetchMovies() 
          : await fetchMoviesByGenre(selectedGenre);
        setMovies(data);
      } catch (error) {
        console.error('Error loading movies:', error);
        toast({
          title: "Error loading movies",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [selectedGenre, toast]);

  return (
    <div className="min-h-screen bg-cinema-gradient">
      <Navbar />
      
      <main className="cinema-container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-6">Discover Movies</h1>
            <p className="text-muted-foreground mb-6">
              Explore our collection of movies across different genres. Find your next favorite film!
            </p>
            
            <GenreFilter 
              genres={genres} 
              selectedGenre={selectedGenre} 
              onSelectGenre={setSelectedGenre} 
              className="mb-8"
            />
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <MovieGrid 
                movies={movies} 
              />
            )}
          </div>
        </div>
      </main>
      
      <footer className="border-t border-cinema-light mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="font-heading text-xl font-bold">CineMatch</span>
              <span className="text-xs text-muted-foreground">© {new Date().getFullYear()}</span>
            </div>
            
            <div className="flex space-x-8">
              <a href="#" className="text-sm text-muted-foreground hover:text-cinema-accent transition-colors">About</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cinema-accent transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cinema-accent transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-cinema-accent transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Discover;
