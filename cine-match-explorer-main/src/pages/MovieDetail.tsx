import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Star, Play, Heart, Share2, Clock, Calendar, User, RefreshCw } from 'lucide-react';
import MovieGrid from '@/components/MovieGrid';
import { fetchMovieById, fetchRecommendedMovies, rateMovie, subscribeToMovieUpdates } from '@/services/movieService';
import { Movie } from '@/components/MovieCard';
import { useToast } from '@/hooks/use-toast';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { toast as sonnerToast } from 'sonner';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [userRating, setUserRating] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Use real-time data for movie details
  const { 
    data: movie,
    isLoading: movieLoading,
    refreshData: refreshMovie,
    lastUpdated: movieUpdated
  } = useRealtimeData<Movie | null>(
    ['movie', id as string],
    async () => id ? await fetchMovieById(id) : null,
    { 
      enabled: !!id,
      pollingInterval: 30000, // Check for updates every 30 seconds
    }
  );
  
  // Use real-time data for similar movies
  const {
    data: similarMovies = [],
    isLoading: similarLoading,
    refreshData: refreshSimilar
  } = useRealtimeData<Movie[]>(
    ['similar', id as string],
    () => fetchRecommendedMovies(5),
    { enabled: !!id }
  );
  
  // Set up real-time updates subscription
  useEffect(() => {
    if (!id) return;
    
    const unsubscribe = subscribeToMovieUpdates((updates) => {
      // Check if this movie has been recently rated
      if (updates.recentlyRated.includes(id)) {
        sonnerToast("Rating updated", {
          description: "This movie's rating has been updated by other users",
        });
        refreshMovie();
      }
    });
    
    return () => unsubscribe();
  }, [id, refreshMovie]);

  const handleRateMovie = async (rating: number) => {
    if (!id) return;
    
    try {
      await rateMovie(id, rating);
      setUserRating(rating);
      
      // Force refresh the movie data to get updated ratings
      refreshMovie();
      
      toast({
        title: "Rating submitted",
        description: `You rated this movie ${rating} stars.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error rating movie:', error);
      toast({
        title: "Failed to submit rating",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleRefresh = () => {
    refreshMovie();
    refreshSimilar();
    sonnerToast("Refreshing movie data", {
      description: "Getting the latest information about this movie",
    });
  };

  if (movieLoading || !movie) {
    return (
      <div>
        <Navbar />
        <div className="cinema-container flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-cinema-accent border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-gradient">
      <Navbar />
      
      {/* Movie Hero */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema via-cinema/70 to-transparent" />
        </div>
        
        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="flex flex-col md:flex-row md:items-end gap-8">
            <div className="w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-xl hidden md:block">
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {movie.title}
                </h1>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRefresh}
                  className="md:hidden"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <Star className="fill-cinema-accent stroke-cinema-accent h-5 w-5 mr-1" />
                  <span>{movie.averageRating.toFixed(1)}</span>
                </div>
                {movie.duration && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{movie.duration} min</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{movie.releaseYear}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleRefresh}
                  className="hidden md:flex"
                  title="Refresh movie data"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(genre => (
                  <Link to={`/discover?genre=${genre}`} key={genre}>
                    <span className="bg-cinema-light text-xs font-medium px-3 py-1 rounded-full hover:bg-cinema-muted transition-colors">
                      {genre}
                    </span>
                  </Link>
                ))}
              </div>
              
              <p className="text-muted-foreground text-sm md:text-base">
                A gripping tale that explores the depths of human emotion and the consequences of our choices.
                This critically acclaimed film takes you on a journey through spectacular visuals and
                unforgettable performances.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Button className="bg-cinema-accent text-cinema hover:bg-cinema-accent-hover">
                  <Play className="h-4 w-4 mr-2" /> Watch Trailer
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 transition-colors">
                  <Heart className="h-4 w-4 mr-2" /> Add to Favorites
                </Button>
                <Button variant="outline" className="border-white/20 hover:bg-white/10 transition-colors">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie Details */}
      <div className="cinema-container space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">Synopsis</h2>
              <p className="text-muted-foreground">
                In a world where imagination and reality blur, our protagonist embarks on a journey of
                self-discovery and redemption. Faced with impossible choices and unexpected allies,
                they must navigate a landscape of deception and danger to uncover the truth that lies
                beneath the surface. As the story unfolds, secrets are revealed and loyalties are tested,
                culminating in a breathtaking finale that will leave audiences questioning everything
                they thought they knew.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-3">Cast & Crew</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-cinema-light mb-2">
                      <User className="w-full h-full p-6 text-cinema-muted" />
                    </div>
                    <p className="font-medium text-sm">Actor Name</p>
                    <p className="text-xs text-muted-foreground">Character</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-cinema-light rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Details</h2>
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(movieUpdated).toLocaleTimeString()}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Director</span>
                  <span>{movie.director || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Release Date</span>
                  <span>{movie.releaseYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Runtime</span>
                  <span>{movie.duration || 'Unknown'} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center">
                    <Star className="fill-cinema-accent stroke-cinema-accent h-4 w-4 mr-1" />
                    {movie.averageRating.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-cinema-light rounded-lg p-5 space-y-4">
              <h2 className="text-xl font-bold">Rate This Movie</h2>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button 
                    key={rating} 
                    className="p-1"
                    onClick={() => handleRateMovie(rating)}
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        userRating && rating <= userRating 
                          ? 'fill-cinema-accent stroke-cinema-accent' 
                          : 'hover:fill-cinema-accent hover:stroke-cinema-accent'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              {userRating && (
                <div className="text-center text-cinema-accent font-medium">
                  You rated this movie {userRating} stars
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Similar Movies</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshSimilar}
              className="text-xs gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh Recommendations
            </Button>
          </div>
          <MovieGrid 
            movies={similarMovies} 
            isLoading={similarLoading}
          />
        </div>
      </div>
      
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

export default MovieDetail;
