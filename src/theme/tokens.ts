/**
 * MMA Universe - Design Tokens
 * Système de design complet pour l'application
 */

// =============================================================================
// COULEURS
// =============================================================================

export const colors = {
  // Couleurs principales
  primary: {
    dark: '#0B0B0D',      // Background principal
    red: '#C72C2C',       // Accent principal / CTA
    redDark: '#A12222',   // Hover state
    redLight: '#E53E3E',  // Active state
  },
  
  // Surfaces neutres
  neutral: {
    100: '#1F1F21',       // Cards / surfaces
    200: '#2E2E30',       // Surfaces secondaires
    300: '#3D3D40',       // Borders
    400: '#4D4D50',       // Disabled backgrounds
  },
  
  // Textes
  text: {
    primary: '#FFFFFF',
    secondary: '#9AA0A6',
    muted: '#6B7280',
    disabled: '#4B5563',
    inverse: '#0B0B0D',
  },
  
  // États
  status: {
    success: '#1FA05A',
    successLight: '#34D399',
    warning: '#FFC857',
    warningLight: '#FBBF24',
    error: '#EF4444',
    errorLight: '#F87171',
    info: '#3B82F6',
    infoLight: '#60A5FA',
  },
  
  // Effets spéciaux
  effects: {
    glass: 'rgba(255, 255, 255, 0.06)',
    glassDark: 'rgba(0, 0, 0, 0.4)',
    glowRed: 'rgba(199, 44, 44, 0.3)',
    overlay: 'rgba(11, 11, 13, 0.8)',
    overlayLight: 'rgba(11, 11, 13, 0.5)',
  },
  
  // Gradients
  gradients: {
    redToDark: ['#C72C2C', '#0B0B0D'],
    darkToTransparent: ['#0B0B0D', 'transparent'],
    cardOverlay: ['transparent', 'rgba(11, 11, 13, 0.9)'],
    heroOverlay: ['transparent', 'rgba(11, 11, 13, 0.7)', '#0B0B0D'],
  },
  
  // Badges et tags
  badge: {
    ko: '#C72C2C',
    sub: '#6366F1',
    dec: '#3B82F6',
    win: '#1FA05A',
    loss: '#EF4444',
    draw: '#9AA0A6',
    live: '#EF4444',
    upcoming: '#FFC857',
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },
} as const;

// =============================================================================
// TYPOGRAPHIE
// =============================================================================

export const typography = {
  // Familles de polices
  fonts: {
    heading: 'Montserrat_700Bold',
    headingBold: 'Montserrat_700Bold',
    headingSemiBold: 'Montserrat_600SemiBold',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodySemiBold: 'Inter_600SemiBold',
    bodyBold: 'Inter_600SemiBold',
    mono: 'Inter_400Regular',
    monoMedium: 'Inter_500Medium',
  },
  
  // Tailles de police
  sizes: {
    // Headings
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,
    
    // Body
    bodyLarge: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
    tiny: 10,
    
    // Special
    display: 40,
    stat: 48,
    badge: 11,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
} as const;

// Presets de texte
export const textStyles = {
  displayLarge: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display,
    lineHeight: typography.sizes.display * typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h1: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    lineHeight: typography.sizes.h1 * typography.lineHeights.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    lineHeight: typography.sizes.h2 * typography.lineHeights.snug,
  },
  h3: {
    fontFamily: typography.fonts.headingBold,
    fontSize: typography.sizes.h3,
    lineHeight: typography.sizes.h3 * typography.lineHeights.snug,
  },
  h4: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    lineHeight: typography.sizes.h4 * typography.lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodyLarge,
    lineHeight: typography.sizes.bodyLarge * typography.lineHeights.relaxed,
  },
  body: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
  },
  bodyMedium: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.normal,
  },
  bodySmall: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    lineHeight: typography.sizes.bodySmall * typography.lineHeights.normal,
  },
  caption: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    lineHeight: typography.sizes.caption * typography.lineHeights.normal,
  },
  stat: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.stat,
    lineHeight: typography.sizes.stat * typography.lineHeights.tight,
  },
  statSmall: {
    fontFamily: typography.fonts.monoMedium,
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * typography.lineHeights.tight,
  },
  badge: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    lineHeight: typography.sizes.badge * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
} as const;

// =============================================================================
// ESPACEMENT
// =============================================================================

export const spacing = {
  // Base 8px scale
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  
  // Semantic spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

// =============================================================================
// LAYOUT
// =============================================================================

export const layout = {
  // Screen
  screenPadding: spacing[4],
  safeAreaTop: 44,
  safeAreaBottom: 34,
  
  // Grid
  gridColumns: 4,
  gridGutter: spacing[4],
  maxWidth: 428,
  
  // Components
  tabBarHeight: 84,
  headerHeight: 56,
  
  // Cards
  cardBorderRadius: 16,
  cardPadding: spacing[4],
  
  // Inputs
  inputHeight: 56,
  inputBorderRadius: 12,
  
  // Buttons
  buttonHeightLarge: 56,
  buttonHeightMedium: 48,
  buttonHeightSmall: 36,
  buttonBorderRadius: 12,
  buttonBorderRadiusPill: 28,
  
  // Avatar
  avatarSizeSmall: 32,
  avatarSizeMedium: 48,
  avatarSizeLarge: 80,
  avatarSizeXLarge: 120,
} as const;

// =============================================================================
// BORDURES & OMBRES
// =============================================================================

export const borders = {
  width: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  glow: {
    shadowColor: colors.primary.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  glowStrong: {
    shadowColor: colors.primary.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

export const animations = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: { damping: 15, stiffness: 150 },
  },
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
  background: -1,
  base: 0,
  card: 10,
  sticky: 100,
  modal: 200,
  overlay: 300,
  toast: 400,
  tooltip: 500,
} as const;

// =============================================================================
// THEME OBJECT
// =============================================================================

export const theme = {
  colors,
  typography,
  textStyles,
  spacing,
  layout,
  borders,
  shadows,
  animations,
  zIndex,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;

export default theme;
