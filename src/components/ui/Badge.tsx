/**
 * MMA Universe - Badge Components
 * Tags et badges pour stats, résultats, statuts
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borders } from '@theme/tokens';

// =============================================================================
// TYPES
// =============================================================================

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'ko' | 'sub' | 'dec' | 'live';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: keyof typeof Ionicons.glyphMap;
  outlined?: boolean;
  style?: ViewStyle;
}

// =============================================================================
// BADGE COMPONENT
// =============================================================================

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  icon,
  outlined = false,
  style,
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.status.success, text: colors.text.primary };
      case 'warning':
        return { bg: colors.status.warning, text: colors.primary.dark };
      case 'error':
        return { bg: colors.status.error, text: colors.text.primary };
      case 'info':
        return { bg: colors.status.info, text: colors.text.primary };
      case 'ko':
        return { bg: colors.badge.ko, text: colors.text.primary };
      case 'sub':
        return { bg: colors.badge.sub, text: colors.text.primary };
      case 'dec':
        return { bg: colors.badge.dec, text: colors.text.primary };
      case 'live':
        return { bg: colors.badge.live, text: colors.text.primary };
      default:
        return { bg: colors.neutral[300], text: colors.text.primary };
    }
  };

  const variantColors = getVariantColors();

  return (
    <View style={[
      styles.badge,
      styles[`${size}Size`],
      outlined 
        ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: variantColors.bg }
        : { backgroundColor: variantColors.bg },
      style,
    ]}>
      {icon && (
        <Ionicons
          name={icon}
          size={size === 'small' ? 10 : size === 'medium' ? 12 : 14}
          color={outlined ? variantColors.bg : variantColors.text}
          style={styles.badgeIcon}
        />
      )}
      <Text style={[
        styles.badgeText,
        styles[`${size}Text`],
        { color: outlined ? variantColors.bg : variantColors.text },
      ]}>
        {label}
      </Text>
    </View>
  );
};

// =============================================================================
// RESULT BADGE (spécifique MMA)
// =============================================================================

type FightResult = 'WIN' | 'LOSS' | 'DRAW' | 'NC';
type FightMethod = 'KO' | 'TKO' | 'SUB' | 'DEC' | 'UDEC' | 'SDEC' | 'NC';

interface ResultBadgeProps {
  result: FightResult;
  method?: FightMethod;
  round?: number;
  time?: string;
  style?: ViewStyle;
}

export const ResultBadge: React.FC<ResultBadgeProps> = ({
  result,
  method,
  round,
  time,
  style,
}) => {
  const getResultColor = () => {
    switch (result) {
      case 'WIN':
        return colors.badge.win;
      case 'LOSS':
        return colors.badge.loss;
      case 'DRAW':
      case 'NC':
        return colors.badge.draw;
    }
  };

  const getMethodVariant = (): BadgeVariant => {
    if (!method) return 'default';
    if (method === 'KO' || method === 'TKO') return 'ko';
    if (method === 'SUB') return 'sub';
    return 'dec';
  };

  return (
    <View style={[styles.resultContainer, style]}>
      <View style={[styles.resultBadge, { backgroundColor: getResultColor() }]}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
      {method && (
        <Badge 
          label={method} 
          variant={getMethodVariant()} 
          size="small"
        />
      )}
      {(round || time) && (
        <Text style={styles.resultDetails}>
          {round && `R${round}`}
          {round && time && ' • '}
          {time}
        </Text>
      )}
    </View>
  );
};

// =============================================================================
// STAT TAG
// =============================================================================

interface StatTagProps {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const StatTag: React.FC<StatTagProps> = ({
  label,
  value,
  icon,
  style,
}) => {
  return (
    <View style={[styles.statTag, style]}>
      {icon && (
        <Ionicons name={icon} size={16} color={colors.primary.red} style={styles.statIcon} />
      )}
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
};

// =============================================================================
// WIN STREAK BADGE
// =============================================================================

interface WinStreakBadgeProps {
  streak: number;
  style?: ViewStyle;
}

export const WinStreakBadge: React.FC<WinStreakBadgeProps> = ({ streak, style }) => {
  if (streak <= 0) return null;
  
  return (
    <View style={[styles.streakBadge, style]}>
      <Ionicons name="flame" size={14} color={colors.status.warning} />
      <Text style={styles.streakText}>{streak} Win Streak</Text>
    </View>
  );
};

// =============================================================================
// RANK BADGE
// =============================================================================

interface RankBadgeProps {
  rank: number | 'C'; // C for Champion
  style?: ViewStyle;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, style }) => {
  const isChampion = rank === 'C';
  
  return (
    <View style={[
      styles.rankBadge, 
      isChampion && styles.championBadge,
      style
    ]}>
      {isChampion && <Ionicons name="trophy" size={12} color={colors.status.warning} />}
      <Text style={[styles.rankText, isChampion && styles.championText]}>
        {isChampion ? 'CHAMPION' : `#${rank}`}
      </Text>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  // Badge Base
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borders.radius.sm,
  },
  smallSize: {
    paddingHorizontal: spacing[1],
    paddingVertical: 2,
  },
  mediumSize: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  largeSize: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  badgeIcon: {
    marginRight: spacing[1],
  },
  badgeText: {
    fontFamily: typography.fonts.bodySemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: typography.sizes.badge,
  },
  largeText: {
    fontSize: typography.sizes.caption,
  },

  // Result Badge
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  resultBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
  },
  resultText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  resultDetails: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },

  // Stat Tag
  statTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.md,
  },
  statIcon: {
    marginRight: spacing[2],
  },
  statValue: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },

  // Win Streak
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 200, 87, 0.15)',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.full,
    borderWidth: 1,
    borderColor: colors.status.warning,
  },
  streakText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.status.warning,
    marginLeft: spacing[1],
  },

  // Rank Badge
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[200],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
  },
  championBadge: {
    backgroundColor: 'rgba(255, 200, 87, 0.2)',
    borderWidth: 1,
    borderColor: colors.status.warning,
  },
  rankText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
  },
  championText: {
    color: colors.status.warning,
    marginLeft: spacing[1],
  },
});

export { Badge, ResultBadge, StatTag, WinStreakBadge, RankBadge };
