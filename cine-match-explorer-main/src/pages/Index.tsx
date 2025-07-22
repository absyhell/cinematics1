import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieGrid from '@/components/MovieGrid';
import GenreFilter from '@/components/GenreFilter';
import { 
  fetchTopRatedMovies, 
  fetchRecommendedMovies, 
  fetchMoviesByGenre,
  fetchTrendingMovies,
  subscribeToMovieUpdates
} from '@/services/movieService';
import { genres } from '@/data/mockMovies';
import { Movie } from '@/components/MovieCard';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { POLLING_INTERVALS } from '@/services/apiConfig';
import { toast as sonnerToast } from 'sonner';

const Index = () => {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const { toast } = useToast();
  
  // Use real-time data hooks for various movie lists
  const { 
    data: topRatedMovies = [], 
    lastUpdated: topRatedUpdated,
    isLoading: topRatedLoading 
  } = useRealtimeData<Movie[]>(
    ['topRated'], 
    () => fetchTopRatedMovies(5),
    { pollingInterval: POLLING_INTERVALS.ratings }
  );
  
  const { 
    data: recommendedMovies = [], 
    lastUpdated: recommendedUpdated,
    isLoading: recommendedLoading 
  } = useRealtimeData<Movie[]>(
    ['recommended'], 
    () => fetchRecommendedMovies(10),
    { 
      pollingInterval: POLLING_INTERVALS.recommendations,
    }
  );
  
  const { 
    data: trendingMovies = [], 
    isLoading: trendingLoading 
  } = useRealtimeData<Movie[]>(
    ['trending'], 
    () => fetchTrendingMovies(5),
    { pollingInterval: POLLING_INTERVALS.trending }
  );
  
  const { 
    data: filteredMovies = [], 
    isLoading: filteredLoading,
    refreshData: refreshFiltered 
  } = useRealtimeData<Movie[]>(
    ['movies', selectedGenre], 
    () => fetchMoviesByGenre(selectedGenre),
    { enabled: true }
  );
  
  // Set up real-time updates subscription
  useEffect(() => {
    const unsubscribe = subscribeToMovieUpdates((updates) => {
      console.log("Received real-time updates:", updates);
      
      // Show notification for recent movie ratings
      if (updates.recentlyRated.length > 0) {
        sonnerToast("Movies recently rated", {
          description: "Some movies have new ratings from other users",
        });
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Update filtered movies when genre changes
  useEffect(() => {
    refreshFiltered();
  }, [selectedGenre, refreshFiltered]);
  
  // Set featured movie from top rated
  useEffect(() => {
    if (topRatedMovies.length > 0 && !featuredMovie) {
      setFeaturedMovie(topRatedMovies[0]);
    }
  }, [topRatedMovies, featuredMovie]);
  
  const isLoading = topRatedLoading || recommendedLoading || !featuredMovie;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-gradient">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-12 w-12 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-gradient">
      <Navbar />
      
      <main>
        <Hero featuredMovie={featuredMovie} />
        
        <div className="cinema-container pt-8 space-y-12">
          <MovieGrid 
            title="Top Rated" 
            movies={topRatedMovies} 
          />
          
          <MovieGrid 
            title="Trending Now" 
            movies={trendingMovies} 
          />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Explore Movies</h2>
            </div>
            <GenreFilter 
              genres={genres} 
              selectedGenre={selectedGenre} 
              onSelectGenre={setSelectedGenre} 
            />
            <MovieGrid 
              movies={filteredMovies} 
              isLoading={filteredLoading}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
              <div className="text-sm text-muted-foreground">
                Updated {new Date(recommendedUpdated).toLocaleTimeString()}
              </div>
            </div>
            <p className="text-muted-foreground">Based on your preferences and real-time activity</p>
            <MovieGrid 
              movies={recommendedMovies} 
            />
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

export default Index;
