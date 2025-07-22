
import { Movie } from '@/components/MovieCard';

export const genres = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller'
];

export const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Interstellar',
    posterUrl: 'https://images.unsplash.com/photo-1629772229926-3f9383cde660?w=500&h=750&fit=crop',
    releaseYear: 2014,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    averageRating: 8.7,
    director: 'Christopher Nolan',
    duration: 169,
  },
  {
    id: '2',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&h=750&fit=crop',
    releaseYear: 1994,
    genres: ['Drama', 'Crime'],
    averageRating: 9.3,
    director: 'Frank Darabont',
    duration: 142,
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=500&h=750&fit=crop',
    releaseYear: 1994,
    genres: ['Crime', 'Drama'],
    averageRating: 8.9,
    director: 'Quentin Tarantino',
    duration: 154,
  },
  {
    id: '4',
    title: 'The Dark Knight',
    posterUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=500&h=750&fit=crop',
    releaseYear: 2008,
    genres: ['Action', 'Crime', 'Drama'],
    averageRating: 9.0,
    director: 'Christopher Nolan',
    duration: 152,
  },
  {
    id: '5',
    title: 'Fight Club',
    posterUrl: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&h=750&fit=crop',
    releaseYear: 1999,
    genres: ['Drama', 'Thriller'],
    averageRating: 8.8,
    director: 'David Fincher',
    duration: 139,
  },
  {
    id: '6',
    title: 'Inception',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=750&fit=crop',
    releaseYear: 2010,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    averageRating: 8.8,
    director: 'Christopher Nolan',
    duration: 148,
  },
  {
    id: '7',
    title: 'The Matrix',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop',
    releaseYear: 1999,
    genres: ['Action', 'Sci-Fi'],
    averageRating: 8.7,
    director: 'Lana Wachowski',
    duration: 136,
  },
  {
    id: '8',
    title: 'Parasite',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&h=750&fit=crop',
    releaseYear: 2019,
    genres: ['Comedy', 'Drama', 'Thriller'],
    averageRating: 8.6,
    director: 'Bong Joon Ho',
    duration: 132,
  },
  {
    id: '9',
    title: 'Joker',
    posterUrl: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?w=500&h=750&fit=crop',
    releaseYear: 2019,
    genres: ['Crime', 'Drama', 'Thriller'],
    averageRating: 8.4,
    director: 'Todd Phillips',
    duration: 122,
  },
  {
    id: '10',
    title: 'The Lord of the Rings',
    posterUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?w=500&h=750&fit=crop',
    releaseYear: 2001,
    genres: ['Action', 'Adventure', 'Fantasy'],
    averageRating: 8.9,
    director: 'Peter Jackson',
    duration: 178,
  },
];

export const getRecommendedMovies = (count: number = 5): Movie[] => {
  return [...mockMovies].sort(() => 0.5 - Math.random()).slice(0, count);
};

export const getTopRatedMovies = (count: number = 5): Movie[] => {
  return [...mockMovies].sort((a, b) => b.averageRating - a.averageRating).slice(0, count);
};

export const getMoviesByGenre = (genre: string): Movie[] => {
  if (genre === 'All') return mockMovies;
  return mockMovies.filter(movie => movie.genres.includes(genre));
};
