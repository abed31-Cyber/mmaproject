-- =============================================================================
-- MMA UNIVERSE - DATABASE SCHEMA
-- PostgreSQL Database Schema
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS TABLE
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    country VARCHAR(100),
    
    -- Stats
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Verification & Status
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Settings
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications_enabled BOOLEAN DEFAULT TRUE,
    dark_mode_enabled BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'fr',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =============================================================================
-- USER FOLLOWS TABLE (User to User)
-- =============================================================================

CREATE TABLE user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);

-- =============================================================================
-- ORGANIZATIONS TABLE
-- =============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    short_name VARCHAR(20),
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    country VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO organizations (name, short_name) VALUES 
    ('Ultimate Fighting Championship', 'UFC'),
    ('Bellator MMA', 'Bellator'),
    ('Professional Fighters League', 'PFL'),
    ('ONE Championship', 'ONE'),
    ('Absolute Championship Akhmat', 'ACA');

-- =============================================================================
-- WEIGHT CLASSES TABLE
-- =============================================================================

CREATE TABLE weight_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    weight_limit_lbs DECIMAL(5, 2) NOT NULL,
    weight_limit_kg DECIMAL(5, 2) NOT NULL,
    gender VARCHAR(10) DEFAULT 'male',
    organization_id UUID REFERENCES organizations(id),
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO weight_classes (name, weight_limit_lbs, weight_limit_kg, gender) VALUES
    ('Strawweight', 115, 52.2, 'female'),
    ('Flyweight', 125, 56.7, 'male'),
    ('Bantamweight', 135, 61.2, 'male'),
    ('Featherweight', 145, 65.8, 'male'),
    ('Lightweight', 155, 70.3, 'male'),
    ('Welterweight', 170, 77.1, 'male'),
    ('Middleweight', 185, 83.9, 'male'),
    ('Light Heavyweight', 205, 93.0, 'male'),
    ('Heavyweight', 265, 120.2, 'male');

-- =============================================================================
-- FIGHTERS TABLE
-- =============================================================================

CREATE TABLE fighters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    
    -- Demographics
    date_of_birth DATE,
    nationality VARCHAR(100),
    birth_city VARCHAR(100),
    birth_country VARCHAR(100),
    fighting_out_of VARCHAR(200),
    
    -- Physical
    height_cm INTEGER,
    weight_kg DECIMAL(5, 2),
    reach_cm INTEGER,
    leg_reach_cm INTEGER,
    stance VARCHAR(20), -- Orthodox, Southpaw, Switch
    
    -- Career
    organization_id UUID REFERENCES organizations(id),
    weight_class_id UUID REFERENCES weight_classes(id),
    team VARCHAR(200),
    is_champion BOOLEAN DEFAULT FALSE,
    ranking INTEGER,
    
    -- Record
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    no_contests INTEGER DEFAULT 0,
    
    -- Win Methods
    wins_ko_tko INTEGER DEFAULT 0,
    wins_submission INTEGER DEFAULT 0,
    wins_decision INTEGER DEFAULT 0,
    
    -- Loss Methods
    losses_ko_tko INTEGER DEFAULT 0,
    losses_submission INTEGER DEFAULT 0,
    losses_decision INTEGER DEFAULT 0,
    
    -- Media
    profile_image_url VARCHAR(500),
    action_image_url VARCHAR(500),
    
    -- Social
    instagram_handle VARCHAR(100),
    twitter_handle VARCHAR(100),
    
    -- Meta
    is_active BOOLEAN DEFAULT TRUE,
    is_retired BOOLEAN DEFAULT FALSE,
    debut_date DATE,
    followers_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fighters_name ON fighters(last_name, first_name);
CREATE INDEX idx_fighters_organization ON fighters(organization_id);
CREATE INDEX idx_fighters_weight_class ON fighters(weight_class_id);
CREATE INDEX idx_fighters_ranking ON fighters(ranking);
CREATE INDEX idx_fighters_is_champion ON fighters(is_champion);

-- =============================================================================
-- FIGHTER STATS TABLE
-- =============================================================================

CREATE TABLE fighter_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID NOT NULL REFERENCES fighters(id) ON DELETE CASCADE,
    
    -- Striking Stats (per minute)
    strikes_landed_per_min DECIMAL(4, 2),
    strikes_absorbed_per_min DECIMAL(4, 2),
    striking_accuracy DECIMAL(5, 2),
    striking_defense DECIMAL(5, 2),
    
    -- Grappling Stats
    takedowns_avg DECIMAL(4, 2),
    takedown_accuracy DECIMAL(5, 2),
    takedown_defense DECIMAL(5, 2),
    submission_avg DECIMAL(4, 2),
    
    -- Control
    avg_fight_time_seconds INTEGER,
    knockdown_avg DECIMAL(4, 2),
    
    -- Calculated
    finish_rate DECIMAL(5, 2),
    
    -- Timestamps
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(fighter_id)
);

-- =============================================================================
-- USER FIGHTER FOLLOWS TABLE
-- =============================================================================

CREATE TABLE user_fighter_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fighter_id UUID NOT NULL REFERENCES fighters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, fighter_id)
);

CREATE INDEX idx_user_fighter_follows_user ON user_fighter_follows(user_id);
CREATE INDEX idx_user_fighter_follows_fighter ON user_fighter_follows(fighter_id);

-- =============================================================================
-- EVENTS TABLE
-- =============================================================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100),
    
    -- Scheduling
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    
    -- Location
    venue VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    
    -- Organization
    organization_id UUID REFERENCES organizations(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
    is_ppv BOOLEAN DEFAULT FALSE,
    
    -- Media
    poster_url VARCHAR(500),
    banner_url VARCHAR(500),
    
    -- Fight Card Type
    card_type VARCHAR(50), -- ppv, fight_night, early_prelims
    
    -- Attendance
    attendance INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_date ON events(date_time);
CREATE INDEX idx_events_organization ON events(organization_id);
CREATE INDEX idx_events_status ON events(status);

-- =============================================================================
-- FIGHTS TABLE
-- =============================================================================

CREATE TABLE fights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    
    -- Fighters
    fighter_a_id UUID NOT NULL REFERENCES fighters(id),
    fighter_b_id UUID NOT NULL REFERENCES fighters(id),
    
    -- Fight Info
    weight_class_id UUID REFERENCES weight_classes(id),
    is_title_fight BOOLEAN DEFAULT FALSE,
    is_main_event BOOLEAN DEFAULT FALSE,
    bout_order INTEGER,
    scheduled_rounds INTEGER DEFAULT 3,
    
    -- Result
    winner_id UUID REFERENCES fighters(id),
    method VARCHAR(50), -- KO/TKO, Submission, Decision (Unanimous/Split/Majority), DQ, No Contest
    method_detail VARCHAR(200), -- e.g., "Rear-Naked Choke", "Head Kick"
    round INTEGER,
    time_in_round VARCHAR(10), -- e.g., "2:34"
    
    -- Status
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
    
    -- Stats
    total_strikes_a INTEGER,
    total_strikes_b INTEGER,
    significant_strikes_a INTEGER,
    significant_strikes_b INTEGER,
    takedowns_a INTEGER,
    takedowns_b INTEGER,
    submission_attempts_a INTEGER,
    submission_attempts_b INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT different_fighters CHECK (fighter_a_id != fighter_b_id)
);

CREATE INDEX idx_fights_event ON fights(event_id);
CREATE INDEX idx_fights_fighter_a ON fights(fighter_a_id);
CREATE INDEX idx_fights_fighter_b ON fights(fighter_b_id);
CREATE INDEX idx_fights_winner ON fights(winner_id);

-- =============================================================================
-- POSTS TABLE
-- =============================================================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT NOT NULL,
    
    -- Stats
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- Visibility
    visibility VARCHAR(20) DEFAULT 'public', -- public, followers, private
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- =============================================================================
-- POST MEDIA TABLE
-- =============================================================================

CREATE TABLE post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    media_url VARCHAR(500) NOT NULL,
    media_type VARCHAR(20) NOT NULL, -- image, video, gif
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER, -- for videos
    thumbnail_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_media_post ON post_media(post_id);

-- =============================================================================
-- POST LIKES TABLE
-- =============================================================================

CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- =============================================================================
-- POST SAVES TABLE
-- =============================================================================

CREATE TABLE post_saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(post_id, user_id)
);

-- =============================================================================
-- COMMENTS TABLE
-- =============================================================================

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    -- Content
    content TEXT NOT NULL,
    
    -- Stats
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- =============================================================================
-- COMMENT LIKES TABLE
-- =============================================================================

CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(comment_id, user_id)
);

-- =============================================================================
-- CONVERSATIONS TABLE
-- =============================================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Group Chat Info
    is_group BOOLEAN DEFAULT FALSE,
    name VARCHAR(100), -- for group chats
    image_url VARCHAR(500), -- for group chats
    
    -- Last Message Cache
    last_message_id UUID,
    last_message_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- CONVERSATION PARTICIPANTS TABLE
-- =============================================================================

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Role (for groups)
    role VARCHAR(20) DEFAULT 'member', -- admin, member
    
    -- Read Status
    last_read_at TIMESTAMP WITH TIME ZONE,
    unread_count INTEGER DEFAULT 0,
    
    -- Notifications
    is_muted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);

-- =============================================================================
-- MESSAGES TABLE
-- =============================================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    
    -- Content
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, video, audio, system
    media_url VARCHAR(500),
    
    -- Reply
    reply_to_id UUID REFERENCES messages(id),
    
    -- Status
    is_deleted BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- =============================================================================
-- NOTIFICATIONS TABLE
-- =============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Type & Content
    type VARCHAR(50) NOT NULL, -- like, comment, follow, mention, fight_reminder, news
    title VARCHAR(200),
    body TEXT,
    
    -- Reference
    reference_type VARCHAR(50), -- post, comment, user, event, fight, fighter
    reference_id UUID,
    
    -- Actor (who triggered the notification)
    actor_id UUID REFERENCES users(id),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =============================================================================
-- ARTICLES TABLE
-- =============================================================================

CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    
    -- Author
    author_name VARCHAR(100),
    author_id UUID REFERENCES users(id),
    
    -- Media
    featured_image_url VARCHAR(500),
    
    -- Categorization
    category VARCHAR(50), -- news, analysis, interview, recap
    tags TEXT[], -- array of tags
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    -- Related
    related_fighter_ids UUID[],
    related_event_id UUID REFERENCES events(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);

-- =============================================================================
-- VIDEOS TABLE
-- =============================================================================

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title VARCHAR(300) NOT NULL,
    description TEXT,
    
    -- Media
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER,
    
    -- Categorization
    category VARCHAR(50), -- highlight, interview, analysis, training, weigh_in
    tags TEXT[],
    
    -- Stats
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    
    -- Related
    related_fighter_ids UUID[],
    related_event_id UUID REFERENCES events(id),
    related_fight_id UUID REFERENCES fights(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'published',
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_videos_published_at ON videos(published_at DESC);
CREATE INDEX idx_videos_category ON videos(category);

-- =============================================================================
-- PREDICTIONS TABLE
-- =============================================================================

CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fight_id UUID NOT NULL REFERENCES fights(id) ON DELETE CASCADE,
    
    -- Prediction
    predicted_winner_id UUID NOT NULL REFERENCES fighters(id),
    predicted_method VARCHAR(50), -- KO/TKO, Submission, Decision
    predicted_round INTEGER,
    
    -- Confidence
    confidence_level INTEGER DEFAULT 50, -- 1-100
    
    -- Result
    is_correct BOOLEAN,
    points_earned INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, fight_id)
);

CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_fight ON predictions(fight_id);

-- =============================================================================
-- USER PREDICTION STATS TABLE
-- =============================================================================

CREATE TABLE user_prediction_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stats
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Streaks
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Points
    total_points INTEGER DEFAULT 0,
    rank INTEGER,
    
    -- Timestamps
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id)
);

-- =============================================================================
-- REFRESH TOKENS TABLE
-- =============================================================================

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    device_info TEXT,
    ip_address VARCHAR(50),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fighters_updated_at
    BEFORE UPDATE ON fighters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update user stats on follow/unfollow
CREATE OR REPLACE FUNCTION update_user_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
        UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
        UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_user_follow_counts
    AFTER INSERT OR DELETE ON user_follows
    FOR EACH ROW EXECUTE FUNCTION update_user_follow_counts();

-- Update post stats on like/unlike
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_post_like_count
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Update post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_post_comment_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
