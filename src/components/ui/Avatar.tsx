/**
 * MMA Universe - Avatar Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, layout, borders } from '@theme/tokens';

// =============================================================================
// TYPES
// =============================================================================

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: AvatarSize;
  showOnline?: boolean;
  isOnline?: boolean;
  showBorder?: boolean;
  borderColor?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  showOnline = false,
  isOnline = false,
  showBorder = false,
  borderColor = colors.primary.red,
  onPress,
  style,
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return layout.avatarSizeSmall;
      case 'medium': return layout.avatarSizeMedium;
      case 'large': return layout.avatarSizeLarge;
      case 'xlarge': return layout.avatarSizeXLarge;
    }
  };

  const getInitials = () => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarSize = getSize();
  const onlineSize = avatarSize * 0.25;
  const borderWidth = size === 'xlarge' ? 3 : 2;

  const Wrapper = onPress ? TouchableOpacity : View;

  const content = (
    <View style={[
      styles.container,
      {
        width: avatarSize,
        height: avatarSize,
        borderRadius: avatarSize / 2,
      },
      showBorder && {
        borderWidth,
        borderColor,
      },
      style,
    ]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { borderRadius: avatarSize / 2 }]}
          contentFit="cover"
        />
      ) : (
        <LinearGradient
          colors={[colors.primary.red, colors.primary.redDark]}
          style={[styles.placeholder, { borderRadius: avatarSize / 2 }]}
        >
          <Text style={[
            styles.initials,
            { fontSize: avatarSize * 0.4 }
          ]}>
            {getInitials()}
          </Text>
        </LinearGradient>
      )}
      
      {showOnline && (
        <View style={[
          styles.onlineIndicator,
          {
            width: onlineSize,
            height: onlineSize,
            borderRadius: onlineSize / 2,
            backgroundColor: isOnline ? colors.status.success : colors.text.muted,
            right: 0,
            bottom: 0,
          }
        ]} />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// =============================================================================
// AVATAR GROUP
// =============================================================================

interface AvatarGroupProps {
  avatars: Array<{ source?: string; name?: string }>;
  max?: number;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'small',
  style,
}) => {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const getSize = () => {
    switch (size) {
      case 'small': return layout.avatarSizeSmall;
      case 'medium': return layout.avatarSizeMedium;
      case 'large': return layout.avatarSizeLarge;
      case 'xlarge': return layout.avatarSizeXLarge;
    }
  };

  const avatarSize = getSize();
  const overlap = avatarSize * 0.3;

  return (
    <View style={[styles.group, style]}>
      {displayed.map((avatar, index) => (
        <View 
          key={index}
          style={{ marginLeft: index > 0 ? -overlap : 0, zIndex: displayed.length - index }}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
            showBorder
            borderColor={colors.primary.dark}
          />
        </View>
      ))}
      {remaining > 0 && (
        <View style={[
          styles.remainingBadge,
          { 
            width: avatarSize, 
            height: avatarSize, 
            borderRadius: avatarSize / 2,
            marginLeft: -overlap,
          }
        ]}>
          <Text style={styles.remainingText}>+{remaining}</Text>
        </View>
      )}
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.neutral[200],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.fonts.headingSemiBold,
    color: colors.text.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.primary.dark,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remainingBadge: {
    backgroundColor: colors.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary.dark,
  },
  remainingText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
  },
});

export default Avatar;
