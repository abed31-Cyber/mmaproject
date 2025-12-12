/**
 * MMA Universe - Loading & Skeleton Components
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borders, layout } from '@theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================================================
// SHIMMER EFFECT
// =============================================================================

interface ShimmerProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width,
  height,
  borderRadius = borders.radius.md,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={[
      styles.shimmerContainer,
      { width, height, borderRadius },
      style,
    ]}>
      <Animated.View
        style={[
          styles.shimmerAnimation,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={[
            colors.neutral[200],
            colors.neutral[300],
            colors.neutral[200],
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    </View>
  );
};

// =============================================================================
// SKELETON FIGHTER CARD
// =============================================================================

export const SkeletonFighterCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.skeletonFighterCard, style]}>
      <Shimmer width="100%" height={200} borderRadius={0} />
      <View style={styles.skeletonFighterContent}>
        <Shimmer width={80} height={12} />
        <Shimmer width={150} height={20} style={{ marginTop: spacing[2] }} />
        <View style={styles.skeletonFighterMeta}>
          <Shimmer width={70} height={24} borderRadius={borders.radius.sm} />
          <Shimmer width={100} height={16} />
        </View>
      </View>
    </View>
  );
};

// =============================================================================
// SKELETON EVENT CARD
// =============================================================================

export const SkeletonEventCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.skeletonEventCard, style]}>
      <Shimmer width="100%" height={220} borderRadius={layout.cardBorderRadius} />
    </View>
  );
};

// =============================================================================
// SKELETON POST
// =============================================================================

export const SkeletonPost: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.skeletonPost, style]}>
      <View style={styles.skeletonPostHeader}>
        <Shimmer width={48} height={48} borderRadius={24} />
        <View style={styles.skeletonPostUserInfo}>
          <Shimmer width={120} height={16} />
          <Shimmer width={80} height={12} style={{ marginTop: spacing[1] }} />
        </View>
      </View>
      <Shimmer width="100%" height={16} style={{ marginTop: spacing[3] }} />
      <Shimmer width="80%" height={16} style={{ marginTop: spacing[2] }} />
      <Shimmer width="60%" height={16} style={{ marginTop: spacing[2] }} />
      <Shimmer width="100%" height={180} style={{ marginTop: spacing[3] }} borderRadius={borders.radius.lg} />
      <View style={styles.skeletonPostActions}>
        <Shimmer width={60} height={20} />
        <Shimmer width={60} height={20} />
        <Shimmer width={60} height={20} />
      </View>
    </View>
  );
};

// =============================================================================
// SKELETON ARTICLE
// =============================================================================

export const SkeletonArticle: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.skeletonArticle, style]}>
      <Shimmer width={100} height={100} borderRadius={borders.radius.lg} />
      <View style={styles.skeletonArticleContent}>
        <Shimmer width={60} height={12} />
        <Shimmer width="90%" height={16} style={{ marginTop: spacing[2] }} />
        <Shimmer width="70%" height={16} style={{ marginTop: spacing[1] }} />
        <Shimmer width="100%" height={12} style={{ marginTop: spacing[2] }} />
      </View>
    </View>
  );
};

// =============================================================================
// SKELETON VIDEO
// =============================================================================

export const SkeletonVideo: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.skeletonVideo, style]}>
      <Shimmer width="100%" height={120} borderRadius={borders.radius.lg} />
      <Shimmer width="80%" height={14} style={{ marginTop: spacing[2] }} />
      <Shimmer width="50%" height={12} style={{ marginTop: spacing[1] }} />
    </View>
  );
};

// =============================================================================
// SKELETON LIST
// =============================================================================

interface SkeletonListProps {
  count?: number;
  type: 'fighter' | 'event' | 'post' | 'article' | 'video';
  style?: ViewStyle;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  type,
  style,
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'fighter':
        return <SkeletonFighterCard />;
      case 'event':
        return <SkeletonEventCard />;
      case 'post':
        return <SkeletonPost />;
      case 'article':
        return <SkeletonArticle />;
      case 'video':
        return <SkeletonVideo />;
    }
  };

  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ marginBottom: spacing[4] }}>
          {renderSkeleton()}
        </View>
      ))}
    </View>
  );
};

// =============================================================================
// LOADING SPINNER
// =============================================================================

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = colors.primary.red,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 32;
      case 'large': return 48;
    }
  };

  const spinnerSize = getSize();

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <View style={[
        styles.spinner,
        {
          width: spinnerSize,
          height: spinnerSize,
          borderRadius: spinnerSize / 2,
          borderColor: color,
          borderTopColor: 'transparent',
        }
      ]} />
    </Animated.View>
  );
};

// =============================================================================
// LOADING OVERLAY
// =============================================================================

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.overlayContent}>
        <LoadingSpinner size="large" />
        {message && (
          <Animated.Text style={styles.overlayMessage}>{message}</Animated.Text>
        )}
      </View>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  // Shimmer
  shimmerContainer: {
    backgroundColor: colors.neutral[200],
    overflow: 'hidden',
  },
  shimmerAnimation: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmerGradient: {
    flex: 1,
    width: SCREEN_WIDTH * 2,
  },

  // Skeleton Fighter Card
  skeletonFighterCard: {
    width: SCREEN_WIDTH * 0.7,
    height: 280,
    borderRadius: layout.cardBorderRadius,
    backgroundColor: colors.neutral[100],
    overflow: 'hidden',
    marginRight: spacing[4],
  },
  skeletonFighterContent: {
    padding: spacing[4],
    marginTop: 'auto',
  },
  skeletonFighterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[3],
  },

  // Skeleton Event Card
  skeletonEventCard: {
    width: SCREEN_WIDTH - spacing[8],
    marginRight: spacing[4],
  },

  // Skeleton Post
  skeletonPost: {
    backgroundColor: colors.neutral[100],
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  skeletonPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonPostUserInfo: {
    marginLeft: spacing[3],
  },
  skeletonPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing[4],
    paddingHorizontal: spacing[4],
  },

  // Skeleton Article
  skeletonArticle: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    padding: spacing[3],
  },
  skeletonArticleContent: {
    flex: 1,
    marginLeft: spacing[3],
    justifyContent: 'center',
  },

  // Skeleton Video
  skeletonVideo: {
    width: SCREEN_WIDTH * 0.6,
    marginRight: spacing[4],
  },

  // Loading Spinner
  spinner: {
    borderWidth: 3,
  },

  // Loading Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.effects.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    alignItems: 'center',
    padding: spacing[6],
    backgroundColor: colors.neutral[100],
    borderRadius: layout.cardBorderRadius,
  },
  overlayMessage: {
    marginTop: spacing[4],
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text.primary,
  },
});
