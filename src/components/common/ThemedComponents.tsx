import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  TextProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';

// Custom TextInput Component
interface ThemedTextInputProps extends RNTextInputProps {
  variant?: 'default' | 'bordered';
  error?: boolean;
  showPasswordToggle?: boolean;
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  style,
  variant = 'default',
  error = false,
  showPasswordToggle = false,
  secureTextEntry,
  placeholderTextColor = theme.colors.textMuted,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const inputStyle = [
    styles.textInput,
    variant === 'bordered' && styles.textInputBordered,
    error && styles.textInputError,
    showPasswordToggle && styles.textInputWithIcon,
    style,
  ];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (showPasswordToggle) {
    return (
      <View style={styles.inputContainer}>
        <RNTextInput
          style={inputStyle}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={togglePasswordVisibility}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.eyeIcon}>
            {isPasswordVisible ? '🙈' : '👁️'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <RNTextInput
      style={inputStyle}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
};

// Custom Button Component
interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'accent' | 'sunset' | 'ocean';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const buttonStyle = [
    styles.button,
    styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    styles[`buttonText${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles],
    styles[`buttonText${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    disabled && styles.buttonTextDisabled,
  ];

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return theme.gradients.primary as readonly string[];
      case 'secondary':
        return theme.gradients.secondary as readonly string[];
      case 'tertiary':
        return theme.gradients.tertiary as readonly string[];
      case 'accent':
        return theme.gradients.accent as readonly string[];
      case 'sunset':
        return theme.gradients.sunset as readonly string[];
      case 'ocean':
        return theme.gradients.ocean as readonly string[];
      case 'outline':
        return ['transparent', 'transparent'] as readonly string[]; // No gradient for outline
      default:
        return theme.gradients.primary as readonly string[];
    }
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[buttonStyle, styles.buttonOutline]}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <ActivityIndicator
            size={size === 'small' ? 'small' : 24}
            color={theme.colors.primary}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        <Text style={textStyle}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      {...props}
    >
      <LinearGradient
        colors={getGradientColors() as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientBackground,
          styles[`gradientBackground${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles]
        ]}
      >
        {loading && (
          <ActivityIndicator
            size={size === 'small' ? 'small' : 24}
            color={theme.colors.textPrimary}
            style={{ marginRight: theme.spacing.sm }}
          />
        )}
        <Text style={textStyle}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Custom Text Component
interface ThemedTextProps extends TextProps {
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'label';
  color?: keyof typeof theme.colors;
  weight?: keyof typeof theme.typography.fontWeight;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  color = 'textPrimary',
  weight,
  style,
  children,
  ...props
}) => {
  const baseStyles = [
    styles.text,
    styles[`text${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof styles] as TextStyle,
    { color: theme.colors[color] },
  ];
  
  if (weight) {
    baseStyles.push({ fontWeight: theme.typography.fontWeight[weight] });
  }
  
  if (style) {
    baseStyles.push(style as TextStyle);
  }

  return (
    <Text style={baseStyles} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // TextInput Styles
  textInput: {
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  } as ViewStyle & TextStyle,
  textInputBordered: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceLight,
  } as ViewStyle,
  textInputError: {
    borderColor: theme.colors.error,
    borderWidth: 1,
  } as ViewStyle,
  textInputWithIcon: {
    paddingRight: 50, // Make room for the eye icon
  } as ViewStyle,
  
  // Password Toggle Styles
  inputContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  } as ViewStyle,
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 0,
    bottom: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  } as ViewStyle,
  eyeIcon: {
    fontSize: 20,
    color: theme.colors.textMuted,
  } as TextStyle,

  // Button Styles
  button: {
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...theme.shadows.sm,
    overflow: 'hidden', // Ensure gradient stays within border radius
  } as ViewStyle,
  gradientBackground: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  } as ViewStyle,
  gradientBackgroundSmall: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  } as ViewStyle,
  gradientBackgroundMedium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  } as ViewStyle,
  gradientBackgroundLarge: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  } as ViewStyle,
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  } as ViewStyle,
  buttonSmall: {
    height: 36,
  } as ViewStyle,
  buttonMedium: {
    height: 50,
  } as ViewStyle,
  buttonLarge: {
    height: 56,
  } as ViewStyle,
  buttonFullWidth: {
    width: '100%',
  } as ViewStyle,
  buttonDisabled: {
    opacity: 0.5,
  } as ViewStyle,

  // Button Text Styles
  buttonText: {
    fontWeight: theme.typography.fontWeight.semibold,
  } as TextStyle,
  buttonTextPrimary: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  buttonTextSecondary: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  buttonTextTertiary: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  buttonTextAccent: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  buttonTextSunset: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  buttonTextOcean: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  buttonTextOutline: {
    color: theme.colors.primary,
  } as TextStyle,
  buttonTextSmall: {
    fontSize: theme.typography.fontSize.sm,
  } as TextStyle,
  buttonTextMedium: {
    fontSize: theme.typography.fontSize.md,
  } as TextStyle,
  buttonTextLarge: {
    fontSize: theme.typography.fontSize.lg,
  } as TextStyle,
  buttonTextDisabled: {
    opacity: 0.7,
  } as TextStyle,

  // Text Styles
  text: {
    color: theme.colors.textPrimary,
  } as TextStyle,
  textHeading1: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.fontSize.xxxl * theme.typography.lineHeight.tight,
  } as TextStyle,
  textHeading2: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.tight,
  } as TextStyle,
  textHeading3: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
  } as TextStyle,
  textBody: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
  } as TextStyle,
  textCaption: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  } as TextStyle,
  textLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  } as TextStyle,
});

export default {
  ThemedTextInput,
  ThemedButton,
  ThemedText,
};