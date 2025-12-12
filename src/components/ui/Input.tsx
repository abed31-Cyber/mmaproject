/**
 * MMA Universe - Input Component
 * Champs de saisie avec validation et icônes
 */

import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, layout, spacing, borders } from '@theme/tokens';

// =============================================================================
// TYPES
// =============================================================================

type InputState = 'default' | 'focused' | 'error' | 'success' | 'disabled';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  state?: InputState;
  isPassword?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  state: externalState,
  isPassword = false,
  editable = true,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Determine current state
  const getState = (): InputState => {
    if (externalState) return externalState;
    if (!editable) return 'disabled';
    if (error) return 'error';
    if (isFocused) return 'focused';
    return 'default';
  };

  const currentState = getState();

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const getStateColor = () => {
    switch (currentState) {
      case 'focused':
        return colors.primary.red;
      case 'error':
        return colors.status.error;
      case 'success':
        return colors.status.success;
      case 'disabled':
        return colors.neutral[400];
      default:
        return colors.neutral[300];
    }
  };

  const actualRightIcon = isPassword 
    ? (showPassword ? 'eye-off-outline' : 'eye-outline')
    : rightIcon;

  const handleRightIconPress = isPassword ? togglePassword : onRightIconPress;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, currentState === 'error' && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        { borderColor: getStateColor() },
        currentState === 'focused' && styles.inputFocused,
        currentState === 'disabled' && styles.inputDisabled,
      ]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={currentState === 'focused' ? colors.primary.red : colors.text.secondary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          ref={ref}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            actualRightIcon && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={colors.text.muted}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        
        {actualRightIcon && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            style={styles.rightIconButton}
            disabled={!handleRightIconPress}
          >
            <Ionicons
              name={actualRightIcon}
              size={20}
              color={currentState === 'error' ? colors.status.error : colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || hint) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// =============================================================================
// TEXTAREA VARIANT
// =============================================================================

interface TextAreaProps extends InputProps {
  rows?: number;
}

export const TextArea = forwardRef<TextInput, TextAreaProps>(({
  rows = 4,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      {...props}
      multiline
      numberOfLines={rows}
      style={[{ height: rows * 24, textAlignVertical: 'top' }]}
    />
  );
});

TextArea.displayName = 'TextArea';

// =============================================================================
// SEARCH INPUT
// =============================================================================

interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  ...props
}) => {
  return (
    <Input
      leftIcon="search-outline"
      rightIcon={value ? 'close-circle' : undefined}
      onRightIconPress={onClear}
      placeholder="Rechercher..."
      {...props}
    />
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },

  label: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },

  labelError: {
    color: colors.status.error,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: layout.inputBorderRadius,
    borderWidth: borders.width.thin,
    borderColor: colors.neutral[300],
    height: layout.inputHeight,
    paddingHorizontal: spacing[4],
  },

  inputFocused: {
    borderWidth: borders.width.medium,
    borderColor: colors.primary.red,
    backgroundColor: colors.neutral[200],
  },

  inputDisabled: {
    backgroundColor: colors.neutral[400],
    opacity: 0.6,
  },

  input: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    height: '100%',
  },

  inputWithLeftIcon: {
    paddingLeft: spacing[2],
  },

  inputWithRightIcon: {
    paddingRight: spacing[2],
  },

  leftIcon: {
    marginRight: spacing[2],
  },

  rightIconButton: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },

  helperText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginTop: spacing[1],
  },

  errorText: {
    color: colors.status.error,
  },
});

export default Input;
