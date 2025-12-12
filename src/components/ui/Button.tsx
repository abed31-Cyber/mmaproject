/**
 * MMA Universe - Button Component
 * Bouton CTA principal avec variantes
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, typography, layout, shadows, spacing } from '@theme/tokens';

// =============================================================================
// TYPES
// =============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  pill?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  haptic?: boolean;
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  pill = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  haptic = true,
  gradient = false,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const handlePress = async (event: any) => {
    if (disabled || loading) return;
    
    if (haptic) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    onPress?.(event);
  };

  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`${size}Size`],
    pill && styles.pill,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.text.primary : colors.primary.red}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </View>
  );

  if (gradient && variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={[colors.primary.red, colors.primary.redDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={buttonStyles}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.buttonBorderRadius,
    ...shadows.md,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary.red,
  },
  secondary: {
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.red,
  },
  danger: {
    backgroundColor: colors.status.error,
  },
  success: {
    backgroundColor: colors.status.success,
  },

  // Sizes
  smallSize: {
    height: layout.buttonHeightSmall,
    paddingHorizontal: spacing[3],
  },
  mediumSize: {
    height: layout.buttonHeightMedium,
    paddingHorizontal: spacing[5],
  },
  largeSize: {
    height: layout.buttonHeightLarge,
    paddingHorizontal: spacing[6],
  },

  // Modifiers
  pill: {
    borderRadius: layout.buttonBorderRadiusPill,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: colors.neutral[400],
    opacity: 0.6,
  },

  // Content
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  text: {
    fontFamily: typography.fonts.bodySemiBold,
    textAlign: 'center',
  },
  primaryText: {
    color: colors.text.primary,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  ghostText: {
    color: colors.primary.red,
  },
  dangerText: {
    color: colors.text.primary,
  },
  successText: {
    color: colors.text.primary,
  },

  smallText: {
    fontSize: typography.sizes.bodySmall,
  },
  mediumText: {
    fontSize: typography.sizes.body,
  },
  largeText: {
    fontSize: typography.sizes.bodyLarge,
  },

  disabledText: {
    color: colors.text.disabled,
  },

  // Icons
  iconLeft: {
    marginRight: spacing[2],
  },
  iconRight: {
    marginLeft: spacing[2],
  },
});

export default Button;
