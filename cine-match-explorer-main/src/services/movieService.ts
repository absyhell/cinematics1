import { Movie } from '@/components/MovieCard';
import { API_ENDPOINTS, handleApiResponse, POLLING_INTERVALS } from './apiConfig';
import { mockMovies, getRecommendedMovies, getTopRatedMovies, getMoviesByGenre } from '@/data/mockMovies';

// Flag to determine whether to use mock data or real API
// In a real implementation, this would be controlled by environment variables
const USE_MOCK_DATA = true;

// Cache for real-time updates simulation
let movieUpdateCache = {
  lastUpdate: Date.now(),
  recentlyRated: new Set<string>(),
  trendingMovies: new Set<string>(),
};

// Fetch all movies
export const fetchMovies = async (): Promise<Movie[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => resolve(mockMovies), 800);
    });
  }
  
  const response = await fetch(API_ENDPOINTS.movies);
  return handleApiResponse(response);
};

// Fetch movies by genre
export const fetchMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => resolve(getMoviesByGenre(genre)), 800);
    });
  }
  
  const response = await fetch(`${API_ENDPOINTS.movies}?genre=${encodeURIComponent(genre)}`);
  return handleApiResponse(response);
};

// Fetch movie by ID
export const fetchMovieById = async (id: string): Promise<Movie> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const movie = mockMovies.find(m => m.id === id);
        if (movie) {
          resolve(movie);
        } else {
          reject(new Error('Movie not found'));
        }
      }, 800);
    });
  }
  
  const response = await fetch(`${API_ENDPOINTS.movies}/${id}`);
  return handleApiResponse(response);
};

// Fetch recommended movies (with real-time updates)
export const fetchRecommendedMovies = async (count: number = 10): Promise<Movie[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      // In a real implementation, this would fetch fresh recommendations based on 
      // recent user activity and updated movie ratings
      setTimeout(() => {
        const recommended = getRecommendedMovies(count);
        
        // Simulate real-time updates by prioritizing recently rated movies
        if (movieUpdateCache.recentlyRated.size > 0) {
          const recentlyRatedMovies = mockMovies.filter(m => 
            movieUpdateCache.recentlyRated.has(m.id)
          );
          
          if (recentlyRatedMovies.length > 0) {
            // Add some recently rated movies to recommendations
            const result = [...recommended];
            for (let i = 0; i < Math.min(2, recentlyRatedMovies.length); i++) {
              if (!result.some(m => m.id === recentlyRatedMovies[i].id)) {
                result.unshift(recentlyRatedMovies[i]);
                result.pop(); // Keep the array at the requested count
              }
            }
            resolve(result);
            return;
          }
        }
        
        resolve(recommended);
      }, 800);
    });
  }
  
  const response = await fetch(`${API_ENDPOINTS.recommendations}?count=${count}`);
  return handleApiResponse(response);
};

// Fetch top rated movies (with real-time updates)
export const fetchTopRatedMovies = async (count: number = 5): Promise<Movie[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      // In a real implementation, this would get the latest top-rated movies
      // from MongoDB, which might change as users rate movies
      setTimeout(() => resolve(getTopRatedMovies(count)), 800);
    });
  }
  
  const response = await fetch(`${API_ENDPOINTS.movies}/top-rated?count=${count}`);
  return handleApiResponse(response);
};

// Fetch trending movies in real-time
export const fetchTrendingMovies = async (count: number = 5): Promise<Movie[]> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      // Simulate real-time trending movies based on recent activity
      setTimeout(() => {
        // In a real app, this would be based on MongoDB aggregation of recent views
        const trending = [...mockMovies]
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
        
        // Update trending cache for real-time simulation
        movieUpdateCache.trendingMovies = new Set(trending.map(m => m.id));
        
        resolve(trending);
      }, 800);
    });
  }
  
  const response = await fetch(`${API_ENDPOINTS.movies}/trending?count=${count}`);
  return handleApiResponse(response);
};

// Rate a movie (with real-time update simulation)
export const rateMovie = async (movieId: string, rating: number): Promise<void> => {
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      console.log(`Rating movie ${movieId} with ${rating} stars`);
      
      // Update mock rating in the movie object
      const movieIndex = mockMovies.findIndex(m => m.id === movieId);
      if (movieIndex !== -1) {
        // Adjust the average rating to simulate the effect of this new rating
        const currentRating = mockMovies[movieIndex].averageRating;
        const newRating = (currentRating * 10 + rating) / 11; // Simulate effect of new rating
        mockMovies[movieIndex].averageRating = parseFloat(newRating.toFixed(1));
        
        // Add to recently rated cache for real-time updates
        movieUpdateCache.recentlyRated.add(movieId);
        movieUpdateCache.lastUpdate = Date.now();
      }
      
      setTimeout(resolve, 800);
    });
  }
  
  const response = await fetch(`${API_ENDPOINTS.ratings}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ movieId, rating }),
  });
  
  return handleApiResponse(response);
};

// Subscribe to real-time movie updates (simulated)
export const subscribeToMovieUpdates = (callback: (updates: any) => void): (() => void) => {
  if (USE_MOCK_DATA) {
    // Set up polling interval to simulate real-time updates
    const intervalId = setInterval(() => {
      // In a real app, this would be a websocket connection or MongoDB Change Stream
      const updates = {
        timestamp: Date.now(),
        recentlyRated: Array.from(movieUpdateCache.recentlyRated),
        trending: Array.from(movieUpdateCache.trendingMovies),
      };
      
      callback(updates);
      
      // Clean up old entries to simulate time decay of relevance
      if (movieUpdateCache.recentlyRated.size > 10) {
        // Keep only the 5 most recent
        const recentIds = Array.from(movieUpdateCache.recentlyRated);
        movieUpdateCache.recentlyRated = new Set(recentIds.slice(-5));
      }
    }, POLLING_INTERVALS.ratings);
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }
  
  // In a real implementation, this would subscribe to MongoDB Change Streams
  // or set up a WebSocket connection
  console.log("Would connect to real-time updates endpoint in production");
  return () => console.log("Would disconnect from real-time endpoint in production");
};
