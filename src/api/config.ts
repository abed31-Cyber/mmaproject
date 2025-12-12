/**
 * MMA Universe - API Configuration
 */

// Base API URL - change this for production
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api/v1'
  : 'https://api.mma-universe.com/api/v1';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // Users
  USERS: {
    ME: '/users/me',
    PROFILE: (id: string) => `/users/${id}`,
    UPDATE: '/users/me',
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
    FOLLOW: (id: string) => `/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/users/${id}/unfollow`,
  },

  // Fighters
  FIGHTERS: {
    LIST: '/fighters',
    DETAIL: (id: string) => `/fighters/${id}`,
    STATS: (id: string) => `/fighters/${id}/stats`,
    FIGHTS: (id: string) => `/fighters/${id}/fights`,
    RANKINGS: '/fighters/rankings',
    SEARCH: '/fighters/search',
    FOLLOW: (id: string) => `/fighters/${id}/follow`,
  },

  // Events
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    UPCOMING: '/events/upcoming',
    PAST: '/events/past',
    LIVE: '/events/live',
    FIGHTS: (id: string) => `/events/${id}/fights`,
  },

  // Posts
  POSTS: {
    FEED: '/posts/feed',
    LIST: '/posts',
    CREATE: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    UPDATE: (id: string) => `/posts/${id}`,
    DELETE: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    UNLIKE: (id: string) => `/posts/${id}/unlike`,
    COMMENTS: (id: string) => `/posts/${id}/comments`,
    USER_POSTS: (userId: string) => `/users/${userId}/posts`,
  },

  // Comments
  COMMENTS: {
    CREATE: (postId: string) => `/posts/${postId}/comments`,
    UPDATE: (id: string) => `/comments/${id}`,
    DELETE: (id: string) => `/comments/${id}`,
    LIKE: (id: string) => `/comments/${id}/like`,
    REPLIES: (id: string) => `/comments/${id}/replies`,
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    CONVERSATION: (id: string) => `/chat/conversations/${id}`,
    MESSAGES: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    SEND: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    READ: (conversationId: string) => `/chat/conversations/${conversationId}/read`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/notifications',
    READ: (id: string) => `/notifications/${id}/read`,
    READ_ALL: '/notifications/read-all',
    SETTINGS: '/notifications/settings',
  },

  // Media
  MEDIA: {
    UPLOAD: '/media/upload',
    VIDEOS: '/media/videos',
    VIDEO: (id: string) => `/media/videos/${id}`,
    ARTICLES: '/media/articles',
    ARTICLE: (id: string) => `/media/articles/${id}`,
  },

  // Search
  SEARCH: {
    ALL: '/search',
    FIGHTERS: '/search/fighters',
    EVENTS: '/search/events',
    USERS: '/search/users',
    POSTS: '/search/posts',
  },

  // Predictions
  PREDICTIONS: {
    LIST: '/predictions',
    CREATE: '/predictions',
    USER: (userId: string) => `/users/${userId}/predictions`,
    LEADERBOARD: '/predictions/leaderboard',
  },
};

// Request Timeout
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Retry Configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 500, 502, 503, 504],
};
