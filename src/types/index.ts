/**
 * MMA Universe - TypeScript Types
 */

// =============================================================================
// USER & AUTH
// =============================================================================

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  phone?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}

// =============================================================================
// FIGHTER
// =============================================================================

export type WeightClass = 
  | 'Strawweight'
  | 'Flyweight'
  | 'Bantamweight'
  | 'Featherweight'
  | 'Lightweight'
  | 'Welterweight'
  | 'Middleweight'
  | 'Light Heavyweight'
  | 'Heavyweight'
  | 'Women\'s Strawweight'
  | 'Women\'s Flyweight'
  | 'Women\'s Bantamweight'
  | 'Women\'s Featherweight';

export interface FighterStats {
  wins: number;
  losses: number;
  draws: number;
  noContests: number;
  knockouts: number;
  submissions: number;
  decisions: number;
  winStreak?: number;
  significantStrikesPerMin?: number;
  strikingAccuracy?: number;
  takedownsPerFight?: number;
  takedownAccuracy?: number;
  submissionAttempts?: number;
  defenseRate?: number;
}

export interface Fighter {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  photoUrl: string;
  bannerUrl?: string;
  nationality: string;
  birthDate: Date;
  heightCm: number;
  reachCm?: number;
  weightClass: WeightClass;
  rank?: number | 'C';
  organization: string;
  isChampion: boolean;
  isActive: boolean;
  stats: FighterStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface FighterListItem {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  photoUrl: string;
  weightClass: WeightClass;
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  rank?: number | 'C';
  isFollowing?: boolean;
}

// =============================================================================
// FIGHT & EVENT
// =============================================================================

export type FightResult = 'WIN' | 'LOSS' | 'DRAW' | 'NC';
export type FightMethod = 'KO' | 'TKO' | 'SUB' | 'DEC' | 'UDEC' | 'SDEC' | 'DQ' | 'NC';

export interface Fight {
  id: string;
  eventId: string;
  eventName?: string;
  fighterA: FighterListItem;
  fighterB: FighterListItem;
  weightClass: WeightClass;
  boutOrder: number;
  isMainEvent: boolean;
  isCoMain: boolean;
  isTitleFight: boolean;
  scheduledRounds: number;
  result?: {
    winner?: string;
    method: FightMethod;
    round: number;
    time: string;
  };
  date: Date;
}

export interface FightHistory {
  id: string;
  opponent: {
    id: string;
    name: string;
    photoUrl: string;
  };
  event: {
    id: string;
    name: string;
  };
  result: FightResult;
  method: FightMethod;
  round: number;
  time: string;
  date: Date;
}

export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  posterUrl: string;
  date: Date;
  venue: string;
  city: string;
  country: string;
  organizer: string;
  isLive: boolean;
  isUpcoming: boolean;
  mainEvent?: {
    fighterA: string;
    fighterB: string;
  };
  fightCount: number;
  createdAt: Date;
}

export interface EventDetails extends Event {
  fights: Fight[];
  description?: string;
  ticketsUrl?: string;
  streamUrl?: string;
}

// =============================================================================
// MEDIA
// =============================================================================

export interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  imageUrl: string;
  url: string;
  sourceName: string;
  sourceLogoUrl?: string;
  author?: string;
  publishedAt: Date;
  tags?: string[];
  relatedFighters?: string[];
  relatedEvents?: string[];
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  durationSeconds: number;
  views: number;
  likes: number;
  fighterId?: string;
  eventId?: string;
  type: 'highlight' | 'interview' | 'recap' | 'promo' | 'analysis';
  publishedAt: Date;
}

// =============================================================================
// SOCIAL
// =============================================================================

export interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  content: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
  }>;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags?: string[];
  mentionedFighters?: string[];
  mentionedEvents?: string[];
  createdAt: Date;
  editedAt?: Date;
}

export interface Comment {
  id: string;
  postId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  parentId?: string;
  replies?: Comment[];
  createdAt: Date;
}

// =============================================================================
// CHAT
// =============================================================================

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    isOnline?: boolean;
  }>;
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: Array<{
    type: 'image' | 'gif' | 'video';
    url: string;
  }>;
  isRead: boolean;
  readBy?: string[];
  createdAt: Date;
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export type NotificationType = 
  | 'follow'
  | 'like'
  | 'comment'
  | 'mention'
  | 'event_reminder'
  | 'fighter_update'
  | 'new_video'
  | 'new_article'
  | 'fight_result';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  imageUrl?: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

// =============================================================================
// API RESPONSES
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// =============================================================================
// FILTER & SEARCH
// =============================================================================

export interface FighterFilters {
  weightClass?: WeightClass[];
  nationality?: string[];
  organization?: string[];
  isActive?: boolean;
  isChampion?: boolean;
}

export interface EventFilters {
  fromDate?: Date;
  toDate?: Date;
  location?: string;
  organizer?: string;
  isLive?: boolean;
  isUpcoming?: boolean;
}

export interface SearchParams {
  query: string;
  type?: 'fighter' | 'event' | 'article' | 'video' | 'post' | 'all';
  limit?: number;
  page?: number;
}

export interface SearchResults {
  fighters: FighterListItem[];
  events: Event[];
  articles: Article[];
  videos: Video[];
  posts: Post[];
}
