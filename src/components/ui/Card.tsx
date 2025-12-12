/**
 * MMA Universe - Card Components
 * Cards pour combattants, événements, vidéos
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors, typography, layout, spacing, shadows, borders } from '@theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================================================
// BASE CARD
// =============================================================================

interface BaseCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glass?: boolean;
}

export const Card: React.FC<BaseCardProps> = ({ 
  children, 
  style, 
  onPress,
  glass = false,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  
  if (glass) {
    return (
      <Wrapper onPress={onPress} activeOpacity={0.8}>
        <BlurView intensity={20} style={[styles.card, styles.glassCard, style]}>
          {children}
        </BlurView>
      </Wrapper>
    );
  }
  
  return (
    <Wrapper 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {children}
    </Wrapper>
  );
};

// =============================================================================
// FIGHTER CARD
// =============================================================================

interface FighterCardProps {
  id: string;
  name: string;
  nickname?: string;
  imageUrl: string;
  weightClass: string;
  record: {
    wins: number;
    losses: number;
    draws: number;
  };
  isFollowing?: boolean;
  onPress?: () => void;
  onFollowPress?: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export const FighterCard: React.FC<FighterCardProps> = ({
  name,
  nickname,
  imageUrl,
  weightClass,
  record,
  isFollowing = false,
  onPress,
  onFollowPress,
  compact = false,
  style,
}) => {
  if (compact) {
    return (
      <TouchableOpacity 
        style={[styles.fighterCardCompact, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.fighterImageCompact}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(11, 11, 13, 0.95)']}
          style={styles.fighterOverlay}
        />
        <View style={styles.fighterCompactContent}>
          <Text style={styles.fighterNameCompact} numberOfLines={1}>{name}</Text>
          <Text style={styles.weightClassCompact}>{weightClass}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.fighterCard, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.fighterImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 11, 13, 0.8)', colors.primary.dark]}
        style={styles.fighterGradient}
      />
      
      <View style={styles.fighterContent}>
        <View style={styles.fighterInfo}>
          {nickname && (
            <Text style={styles.nickname}>"{nickname}"</Text>
          )}
          <Text style={styles.fighterName}>{name}</Text>
          <View style={styles.fighterMeta}>
            <View style={styles.weightBadge}>
              <Text style={styles.weightText}>{weightClass}</Text>
            </View>
            <Text style={styles.record}>
              {record.wins}W - {record.losses}L - {record.draws}D
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={(e) => {
            e.stopPropagation();
            onFollowPress?.();
          }}
        >
          <Ionicons 
            name={isFollowing ? 'checkmark' : 'add'} 
            size={18} 
            color={isFollowing ? colors.status.success : colors.text.primary} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// EVENT CARD
// =============================================================================

interface EventCardProps {
  id: string;
  title: string;
  posterUrl: string;
  date: Date;
  venue: string;
  city: string;
  mainEvent?: {
    fighterA: string;
    fighterB: string;
  };
  isLive?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const EventCard: React.FC<EventCardProps> = ({
  title,
  posterUrl,
  date,
  venue,
  city,
  mainEvent,
  isLive = false,
  onPress,
  style,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  const formattedTime = new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity 
      style={[styles.eventCard, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: posterUrl }}
        style={styles.eventPoster}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 11, 13, 0.95)']}
        style={styles.eventGradient}
      />
      
      {isLive && (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      )}
      
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>{title}</Text>
        
        {mainEvent && (
          <View style={styles.mainEventContainer}>
            <Text style={styles.mainEventLabel}>Main Event</Text>
            <Text style={styles.mainEventText}>
              {mainEvent.fighterA} <Text style={styles.vsText}>vs</Text> {mainEvent.fighterB}
            </Text>
          </View>
        )}
        
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.eventMetaText}>{formattedDate} • {formattedTime}</Text>
          </View>
          <View style={styles.eventMetaRow}>
            <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.eventMetaText}>{venue}, {city}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// VIDEO CARD
// =============================================================================

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views?: number;
  date?: Date;
  onPress?: () => void;
  style?: ViewStyle;
  horizontal?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  title,
  thumbnailUrl,
  duration,
  views,
  date,
  onPress,
  style,
  horizontal = false,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (horizontal) {
    return (
      <TouchableOpacity 
        style={[styles.videoCardHorizontal, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.videoThumbnailHorizontal}>
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.videoImageHorizontal}
            contentFit="cover"
          />
          <View style={styles.playOverlay}>
            <Ionicons name="play-circle" size={32} color={colors.text.primary} />
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
        </View>
        
        <View style={styles.videoInfoHorizontal}>
          <Text style={styles.videoTitle} numberOfLines={2}>{title}</Text>
          {(views || date) && (
            <Text style={styles.videoMeta}>
              {views && `${formatViews(views)} vues`}
              {views && date && ' • '}
              {date && new Date(date).toLocaleDateString('fr-FR')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.videoCard, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.videoThumbnail}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.videoImage}
          contentFit="cover"
        />
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={48} color={colors.text.primary} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{title}</Text>
        {(views || date) && (
          <Text style={styles.videoMeta}>
            {views && `${formatViews(views)} vues`}
            {views && date && ' • '}
            {date && new Date(date).toLocaleDateString('fr-FR')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// ARTICLE CARD
// =============================================================================

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl: string;
  source: string;
  date: Date;
  onPress?: () => void;
  style?: ViewStyle;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  excerpt,
  imageUrl,
  source,
  date,
  onPress,
  style,
  featured = false,
}) => {
  if (featured) {
    return (
      <TouchableOpacity 
        style={[styles.articleFeatured, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.articleImageFeatured}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(11, 11, 13, 0.9)']}
          style={styles.articleGradient}
        />
        <View style={styles.articleContentFeatured}>
          <View style={styles.sourceBadge}>
            <Text style={styles.sourceText}>{source}</Text>
          </View>
          <Text style={styles.articleTitleFeatured} numberOfLines={3}>{title}</Text>
          <Text style={styles.articleDate}>
            {new Date(date).toLocaleDateString('fr-FR', { 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.articleCard, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.articleImage}
        contentFit="cover"
      />
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleSource}>{source}</Text>
          <Text style={styles.articleDateSmall}>
            {new Date(date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <Text style={styles.articleTitle} numberOfLines={2}>{title}</Text>
        {excerpt && (
          <Text style={styles.articleExcerpt} numberOfLines={2}>{excerpt}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  // Base Card
  card: {
    backgroundColor: colors.neutral[100],
    borderRadius: layout.cardBorderRadius,
    padding: layout.cardPadding,
    ...shadows.md,
  },
  glassCard: {
    backgroundColor: colors.effects.glass,
    overflow: 'hidden',
  },

  // Fighter Card
  fighterCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 280,
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    marginRight: spacing[4],
    ...shadows.lg,
  },
  fighterImage: {
    ...StyleSheet.absoluteFillObject,
  },
  fighterGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  fighterContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  fighterInfo: {
    flex: 1,
  },
  nickname: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.primary.red,
    marginBottom: spacing[1],
  },
  fighterName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  fighterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightBadge: {
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
    marginRight: spacing[2],
  },
  weightText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
  },
  record: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  followButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingButton: {
    backgroundColor: colors.effects.glass,
    borderWidth: 1,
    borderColor: colors.status.success,
  },

  // Fighter Card Compact
  fighterCardCompact: {
    width: 120,
    height: 160,
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
    marginRight: spacing[3],
  },
  fighterImageCompact: {
    ...StyleSheet.absoluteFillObject,
  },
  fighterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  fighterCompactContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[2],
  },
  fighterNameCompact: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
  },
  weightClassCompact: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },

  // Event Card
  eventCard: {
    width: SCREEN_WIDTH - spacing[8],
    height: 220,
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    marginRight: spacing[4],
    ...shadows.lg,
  },
  eventPoster: {
    ...StyleSheet.absoluteFillObject,
  },
  eventGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  eventContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing[4],
  },
  eventTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  mainEventContainer: {
    marginBottom: spacing[3],
  },
  mainEventLabel: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.primary.red,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  mainEventText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  vsText: {
    color: colors.primary.red,
    fontFamily: typography.fonts.bodySemiBold,
  },
  eventMeta: {
    gap: spacing[1],
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMetaText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginLeft: spacing[1],
  },
  liveBadge: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badge.live,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.primary,
    marginRight: spacing[1],
  },
  liveText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.text.primary,
    letterSpacing: 1,
  },

  // Video Card
  videoCard: {
    width: SCREEN_WIDTH * 0.6,
    marginRight: spacing[4],
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  videoImage: {
    ...StyleSheet.absoluteFillObject,
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: spacing[1],
    paddingVertical: 2,
    borderRadius: borders.radius.sm,
  },
  durationText: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
  },
  videoInfo: {
    paddingHorizontal: spacing[1],
  },
  videoTitle: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  videoMeta: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },

  // Video Card Horizontal
  videoCardHorizontal: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  videoThumbnailHorizontal: {
    width: 140,
    height: 80,
    borderRadius: borders.radius.md,
    overflow: 'hidden',
    marginRight: spacing[3],
  },
  videoImageHorizontal: {
    ...StyleSheet.absoluteFillObject,
  },
  videoInfoHorizontal: {
    flex: 1,
    justifyContent: 'center',
  },

  // Article Card
  articleCard: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: spacing[3],
    justifyContent: 'center',
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  articleSource: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.primary.red,
    textTransform: 'uppercase',
  },
  articleDateSmall: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  articleTitle: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  articleExcerpt: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },

  // Article Featured
  articleFeatured: {
    width: SCREEN_WIDTH - spacing[8],
    height: 200,
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    marginRight: spacing[4],
    ...shadows.lg,
  },
  articleImageFeatured: {
    ...StyleSheet.absoluteFillObject,
  },
  articleGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  articleContentFeatured: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing[4],
  },
  sourceBadge: {
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing[2],
  },
  sourceText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  articleTitleFeatured: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  articleDate: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
});

export { Card, FighterCard, EventCard, VideoCard, ArticleCard };
