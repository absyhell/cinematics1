
// This file would be replaced with real MongoDB connection details in a production app
// For frontend-only apps, we would use a MongoDB API service like MongoDB Atlas Data API

const API_BASE_URL = "https://ap-api.example.com"; // Placeholder for MongoDB API endpoint

export const API_ENDPOINTS = {
  movies: `${API_BASE_URL}/movies`,
  recommendations: `${API_BASE_URL}/recommendations`,
  users: `${API_BASE_URL}/users`,
  ratings: `${API_BASE_URL}/ratings`,
  realtime: {
    movieUpdates: `${API_BASE_URL}/realtime/movies`,
    ratingUpdates: `${API_BASE_URL}/realtime/ratings`,
    recommendationUpdates: `${API_BASE_URL}/realtime/recommendations`,
  }
};

// Polling intervals in milliseconds
export const POLLING_INTERVALS = {
  ratings: 10000,         // 10 seconds
  recommendations: 30000, // 30 seconds
  trending: 60000,        // 1 minute
};

export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "An error occurred while fetching data");
  }
  return response.json();
};
