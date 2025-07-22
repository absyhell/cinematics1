
// This file documents the MongoDB schemas we would use in a real implementation
// Note: In a full-stack app, these schemas would be defined on the server-side

/**
 * Movie Schema
 * 
 * Represents a movie in the database
 */
const movieSchema = {
  title: String,                 // Title of the movie
  posterUrl: String,             // URL to movie poster image
  releaseYear: Number,           // Year the movie was released
  genres: [String],              // Array of genre names
  director: String,              // Movie director
  duration: Number,              // Duration in minutes
  averageRating: Number,         // Average user rating
  plot: String,                  // Movie plot summary
  cast: [String],                // List of main actors
  keywords: [String],            // Keywords for improved search
  trailer: String,               // URL to movie trailer
  language: String,              // Original language
  country: String,               // Country of origin
  awards: String,                // Notable awards
  boxOffice: Number,             // Box office earnings in USD
  metascores: {                  // Scores from review aggregators
    imdb: Number,
    rottenTomatoes: Number,
    metacritic: Number
  },
  similarMovies: [{ type: "ObjectId", ref: "Movie" }]  // References to similar movies
};

/**
 * User Schema
 * 
 * Represents a user in the database
 */
const userSchema = {
  username: String,              // User's display name
  email: String,                 // User's email address
  password: String,              // Hashed password
  avatar: String,                // URL to user's avatar image
  joinedDate: Date,              // Date user joined
  favoriteGenres: [String],      // User's preferred genres
  watchedMovies: [{ 
    movieId: { type: "ObjectId", ref: "Movie" },
    watchedDate: Date
  }],
  watchlist: [{ 
    movieId: { type: "ObjectId", ref: "Movie" },
    addedDate: Date
  }],
  preferences: {                 // User's content preferences
    genreWeights: Object,        // e.g., {"Action": 0.8, "Comedy": 0.4}
    directorWeights: Object,     // Preferred directors
    actorWeights: Object,        // Preferred actors
    yearRange: {                 // Preferred era
      min: Number,
      max: Number
    }
  }
};

/**
 * Rating Schema
 * 
 * Represents a user's rating of a movie
 */
const ratingSchema = {
  userId: { type: "ObjectId", ref: "User" },
  movieId: { type: "ObjectId", ref: "Movie" },
  rating: Number,                // Rating value (e.g., 1-5 or 1-10)
  review: String,                // Optional user review
  timestamp: Date,               // When the rating was submitted
  likes: Number,                 // Number of likes the review received
  tags: [String]                 // Tags associated with the review
};

/**
 * Recommended Indexes:
 * 
 * db.movies.createIndex({ title: "text", plot: "text", cast: "text" }) // Text search
 * db.movies.createIndex({ genres: 1 })                                 // Genre filtering
 * db.movies.createIndex({ releaseYear: -1 })                           // Sort by year
 * db.movies.createIndex({ averageRating: -1 })                         // Sort by rating
 * db.ratings.createIndex({ userId: 1, movieId: 1 }, { unique: true })  // One rating per user-movie combo
 * db.users.createIndex({ email: 1 }, { unique: true })                 // Unique emails
 */

module.exports = {
  movieSchema,
  userSchema,
  ratingSchema
};
