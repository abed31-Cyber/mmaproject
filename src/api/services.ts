/**
 * MMA Universe - API Services
 */

import api from './client';
import { ENDPOINTS } from './config';
import type {
  User,
  Fighter,
  FighterStats,
  Event,
  Fight,
  Post,
  Comment,
  Conversation,
  Message,
  Article,
  Video,
  Notification,
} from '@/types';

// =============================================================================
// AUTH SERVICE
// =============================================================================

export const authService = {
  async login(email: string, password: string) {
    return api.post<{ user: User; token: string; refreshToken: string }>(
      ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );
  },

  async register(data: { name: string; email: string; password: string; username: string }) {
    return api.post<{ user: User; token: string }>(ENDPOINTS.AUTH.REGISTER, data);
  },

  async logout() {
    return api.post(ENDPOINTS.AUTH.LOGOUT);
  },

  async refreshToken(refreshToken: string) {
    return api.post<{ token: string; refreshToken: string }>(
      ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
  },

  async forgotPassword(email: string) {
    return api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  async resetPassword(token: string, password: string) {
    return api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  },
};

// =============================================================================
// USER SERVICE
// =============================================================================

export const userService = {
  async getMe() {
    return api.get<User>(ENDPOINTS.USERS.ME);
  },

  async getProfile(userId: string) {
    return api.get<User>(ENDPOINTS.USERS.PROFILE(userId));
  },

  async updateProfile(data: Partial<User>) {
    return api.patch<User>(ENDPOINTS.USERS.UPDATE, data);
  },

  async getFollowers(userId: string, page = 1, limit = 20) {
    return api.get<User[]>(ENDPOINTS.USERS.FOLLOWERS(userId), { page, limit });
  },

  async getFollowing(userId: string, page = 1, limit = 20) {
    return api.get<User[]>(ENDPOINTS.USERS.FOLLOWING(userId), { page, limit });
  },

  async follow(userId: string) {
    return api.post(ENDPOINTS.USERS.FOLLOW(userId));
  },

  async unfollow(userId: string) {
    return api.post(ENDPOINTS.USERS.UNFOLLOW(userId));
  },
};

// =============================================================================
// FIGHTER SERVICE
// =============================================================================

export const fighterService = {
  async getList(params?: {
    page?: number;
    limit?: number;
    weightClass?: string;
    organization?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return api.get<Fighter[]>(ENDPOINTS.FIGHTERS.LIST, params);
  },

  async getDetail(fighterId: string) {
    return api.get<Fighter>(ENDPOINTS.FIGHTERS.DETAIL(fighterId));
  },

  async getStats(fighterId: string) {
    return api.get<FighterStats>(ENDPOINTS.FIGHTERS.STATS(fighterId));
  },

  async getFights(fighterId: string, page = 1, limit = 10) {
    return api.get<Fight[]>(ENDPOINTS.FIGHTERS.FIGHTS(fighterId), { page, limit });
  },

  async getRankings(weightClass?: string) {
    return api.get<Fighter[]>(ENDPOINTS.FIGHTERS.RANKINGS, { weightClass });
  },

  async search(query: string) {
    return api.get<Fighter[]>(ENDPOINTS.FIGHTERS.SEARCH, { q: query });
  },

  async follow(fighterId: string) {
    return api.post(ENDPOINTS.FIGHTERS.FOLLOW(fighterId));
  },
};

// =============================================================================
// EVENT SERVICE
// =============================================================================

export const eventService = {
  async getList(params?: {
    page?: number;
    limit?: number;
    organization?: string;
    from?: string;
    to?: string;
  }) {
    return api.get<Event[]>(ENDPOINTS.EVENTS.LIST, params);
  },

  async getDetail(eventId: string) {
    return api.get<Event>(ENDPOINTS.EVENTS.DETAIL(eventId));
  },

  async getUpcoming(limit = 10) {
    return api.get<Event[]>(ENDPOINTS.EVENTS.UPCOMING, { limit });
  },

  async getPast(page = 1, limit = 10) {
    return api.get<Event[]>(ENDPOINTS.EVENTS.PAST, { page, limit });
  },

  async getLive() {
    return api.get<Event[]>(ENDPOINTS.EVENTS.LIVE);
  },

  async getFights(eventId: string) {
    return api.get<Fight[]>(ENDPOINTS.EVENTS.FIGHTS(eventId));
  },
};

// =============================================================================
// POST SERVICE
// =============================================================================

export const postService = {
  async getFeed(page = 1, limit = 20) {
    return api.get<Post[]>(ENDPOINTS.POSTS.FEED, { page, limit });
  },

  async create(data: { content: string; images?: string[] }) {
    return api.post<Post>(ENDPOINTS.POSTS.CREATE, data);
  },

  async getDetail(postId: string) {
    return api.get<Post>(ENDPOINTS.POSTS.DETAIL(postId));
  },

  async update(postId: string, data: { content: string }) {
    return api.patch<Post>(ENDPOINTS.POSTS.UPDATE(postId), data);
  },

  async delete(postId: string) {
    return api.delete(ENDPOINTS.POSTS.DELETE(postId));
  },

  async like(postId: string) {
    return api.post(ENDPOINTS.POSTS.LIKE(postId));
  },

  async unlike(postId: string) {
    return api.post(ENDPOINTS.POSTS.UNLIKE(postId));
  },

  async getComments(postId: string, page = 1, limit = 20) {
    return api.get<Comment[]>(ENDPOINTS.POSTS.COMMENTS(postId), { page, limit });
  },

  async getUserPosts(userId: string, page = 1, limit = 20) {
    return api.get<Post[]>(ENDPOINTS.POSTS.USER_POSTS(userId), { page, limit });
  },
};

// =============================================================================
// COMMENT SERVICE
// =============================================================================

export const commentService = {
  async create(postId: string, content: string, parentId?: string) {
    return api.post<Comment>(ENDPOINTS.COMMENTS.CREATE(postId), { content, parentId });
  },

  async update(commentId: string, content: string) {
    return api.patch<Comment>(ENDPOINTS.COMMENTS.UPDATE(commentId), { content });
  },

  async delete(commentId: string) {
    return api.delete(ENDPOINTS.COMMENTS.DELETE(commentId));
  },

  async like(commentId: string) {
    return api.post(ENDPOINTS.COMMENTS.LIKE(commentId));
  },

  async getReplies(commentId: string, page = 1, limit = 10) {
    return api.get<Comment[]>(ENDPOINTS.COMMENTS.REPLIES(commentId), { page, limit });
  },
};

// =============================================================================
// CHAT SERVICE
// =============================================================================

export const chatService = {
  async getConversations() {
    return api.get<Conversation[]>(ENDPOINTS.CHAT.CONVERSATIONS);
  },

  async getConversation(conversationId: string) {
    return api.get<Conversation>(ENDPOINTS.CHAT.CONVERSATION(conversationId));
  },

  async getMessages(conversationId: string, page = 1, limit = 50) {
    return api.get<Message[]>(ENDPOINTS.CHAT.MESSAGES(conversationId), { page, limit });
  },

  async sendMessage(conversationId: string, content: string, type: 'text' | 'image' = 'text') {
    return api.post<Message>(ENDPOINTS.CHAT.SEND(conversationId), { content, type });
  },

  async markAsRead(conversationId: string) {
    return api.post(ENDPOINTS.CHAT.READ(conversationId));
  },
};

// =============================================================================
// NOTIFICATION SERVICE
// =============================================================================

export const notificationService = {
  async getList(page = 1, limit = 20) {
    return api.get<Notification[]>(ENDPOINTS.NOTIFICATIONS.LIST, { page, limit });
  },

  async markAsRead(notificationId: string) {
    return api.post(ENDPOINTS.NOTIFICATIONS.READ(notificationId));
  },

  async markAllAsRead() {
    return api.post(ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },

  async getSettings() {
    return api.get(ENDPOINTS.NOTIFICATIONS.SETTINGS);
  },

  async updateSettings(settings: Record<string, boolean>) {
    return api.patch(ENDPOINTS.NOTIFICATIONS.SETTINGS, settings);
  },
};

// =============================================================================
// MEDIA SERVICE
// =============================================================================

export const mediaService = {
  async upload(file: FormData) {
    return api.post<{ url: string }>(ENDPOINTS.MEDIA.UPLOAD, file);
  },

  async getVideos(page = 1, limit = 20) {
    return api.get<Video[]>(ENDPOINTS.MEDIA.VIDEOS, { page, limit });
  },

  async getVideo(videoId: string) {
    return api.get<Video>(ENDPOINTS.MEDIA.VIDEO(videoId));
  },

  async getArticles(page = 1, limit = 20) {
    return api.get<Article[]>(ENDPOINTS.MEDIA.ARTICLES, { page, limit });
  },

  async getArticle(articleId: string) {
    return api.get<Article>(ENDPOINTS.MEDIA.ARTICLE(articleId));
  },
};

// =============================================================================
// SEARCH SERVICE
// =============================================================================

export const searchService = {
  async searchAll(query: string) {
    return api.get<{
      fighters: Fighter[];
      events: Event[];
      users: User[];
      posts: Post[];
    }>(ENDPOINTS.SEARCH.ALL, { q: query });
  },

  async searchFighters(query: string, limit = 10) {
    return api.get<Fighter[]>(ENDPOINTS.SEARCH.FIGHTERS, { q: query, limit });
  },

  async searchEvents(query: string, limit = 10) {
    return api.get<Event[]>(ENDPOINTS.SEARCH.EVENTS, { q: query, limit });
  },

  async searchUsers(query: string, limit = 10) {
    return api.get<User[]>(ENDPOINTS.SEARCH.USERS, { q: query, limit });
  },
};
