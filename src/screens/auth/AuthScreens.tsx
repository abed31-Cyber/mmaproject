/**
 * MMA Universe - Authentication Screens
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '@components/ui';
import { colors, typography, spacing, borders, shadows } from '@theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// LOGIN SCREEN
// =============================================================================

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
  onForgotPassword: () => void;
  onSocialLogin: (provider: 'google' | 'apple') => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onRegister,
  onForgotPassword,
  onSocialLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Mot de passe requis';
    else if (password.length < 6) newErrors.password = 'Minimum 6 caractères';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800' }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(11, 11, 13, 0.4)', colors.primary.dark]}
        locations={[0, 0.5]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons name="fitness" size={40} color={colors.primary.red} />
              </View>
              <Text style={styles.logoText}>MMA Universe</Text>
            </View>
            
            {/* Welcome Text */}
            <Text style={styles.welcomeTitle}>Bon retour !</Text>
            <Text style={styles.welcomeSubtitle}>
              Connectez-vous pour continuer
            </Text>
            
            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail-outline"
                error={errors.email}
              />
              
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon="lock-closed-outline"
                error={errors.password}
              />
              
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={onForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
              
              <Button
                title="Se connecter"
                variant="primary"
                size="large"
                fullWidth
                gradient
                loading={isLoading}
                onPress={handleLogin}
              />
            </View>
            
            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou continuer avec</Text>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Social Login */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => onSocialLogin('google')}
              >
                <Ionicons name="logo-google" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => onSocialLogin('apple')}
              >
                <Ionicons name="logo-apple" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Pas encore de compte ? </Text>
              <TouchableOpacity onPress={onRegister}>
                <Text style={styles.registerLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// =============================================================================
// REGISTER SCREEN
// =============================================================================

interface RegisterScreenProps {
  onRegister: (data: { email: string; password: string; displayName: string; phone?: string }) => void;
  onLogin: () => void;
  onSocialLogin: (provider: 'google' | 'apple') => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onLogin,
  onSocialLogin,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!displayName) newErrors.displayName = 'Nom requis';
    if (!email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email invalide';
    if (!password) newErrors.password = 'Mot de passe requis';
    else if (password.length < 8) newErrors.password = 'Minimum 8 caractères';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onRegister({ email, password, displayName, phone: phone || undefined });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.neutral[200], colors.primary.dark]}
        locations={[0, 0.3]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onLogin} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Title */}
            <Text style={styles.welcomeTitle}>Créer un compte</Text>
            <Text style={styles.welcomeSubtitle}>
              Rejoignez la communauté MMA Universe
            </Text>
            
            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Nom complet"
                placeholder="John Doe"
                value={displayName}
                onChangeText={setDisplayName}
                leftIcon="person-outline"
                error={errors.displayName}
              />
              
              <Input
                label="Email"
                placeholder="votre@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon="mail-outline"
                error={errors.email}
              />
              
              <Input
                label="Téléphone (optionnel)"
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                leftIcon="call-outline"
              />
              
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon="lock-closed-outline"
                error={errors.password}
                hint="Minimum 8 caractères"
              />
              
              <Input
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
                leftIcon="lock-closed-outline"
                error={errors.confirmPassword}
              />
              
              <Button
                title="Créer mon compte"
                variant="primary"
                size="large"
                fullWidth
                gradient
                loading={isLoading}
                onPress={handleRegister}
                style={{ marginTop: spacing[2] }}
              />
            </View>
            
            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou s'inscrire avec</Text>
              <View style={styles.dividerLine} />
            </View>
            
            {/* Social Login */}
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => onSocialLogin('google')}
              >
                <Ionicons name="logo-google" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => onSocialLogin('apple')}
              >
                <Ionicons name="logo-apple" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Terms */}
            <Text style={styles.termsText}>
              En vous inscrivant, vous acceptez nos{' '}
              <Text style={styles.termsLink}>Conditions d'utilisation</Text> et notre{' '}
              <Text style={styles.termsLink}>Politique de confidentialité</Text>
            </Text>
            
            {/* Login Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Déjà un compte ? </Text>
              <TouchableOpacity onPress={onLogin}>
                <Text style={styles.registerLink}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// =============================================================================
// FORGOT PASSWORD SCREEN
// =============================================================================

interface ForgotPasswordScreenProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onSubmit,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Email requis');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      await onSubmit(email);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.neutral[200], colors.primary.dark]}
        locations={[0, 0.3]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.forgotContent}>
          {isSubmitted ? (
            <>
              <View style={styles.successIcon}>
                <Ionicons name="mail" size={48} color={colors.primary.red} />
              </View>
              <Text style={styles.welcomeTitle}>Email envoyé !</Text>
              <Text style={styles.forgotSubtitle}>
                Nous avons envoyé un lien de réinitialisation à{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Button
                title="Retour à la connexion"
                variant="primary"
                size="large"
                fullWidth
                onPress={onBack}
                style={{ marginTop: spacing[6] }}
              />
            </>
          ) : (
            <>
              <View style={styles.successIcon}>
                <Ionicons name="lock-open-outline" size={48} color={colors.primary.red} />
              </View>
              <Text style={styles.welcomeTitle}>Mot de passe oublié ?</Text>
              <Text style={styles.forgotSubtitle}>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </Text>
              
              <View style={styles.form}>
                <Input
                  label="Email"
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="mail-outline"
                  error={error}
                />
                
                <Button
                  title="Envoyer le lien"
                  variant="primary"
                  size="large"
                  fullWidth
                  gradient
                  loading={isLoading}
                  onPress={handleSubmit}
                />
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.dark,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  backButton: {
    padding: spacing[2],
    marginLeft: -spacing[2],
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing[8],
    marginTop: spacing[4],
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
    ...shadows.lg,
  },
  logoText: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    color: colors.text.primary,
  },
  welcomeTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  welcomeSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing[6],
  },
  form: {
    marginBottom: spacing[6],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing[4],
    marginTop: -spacing[2],
  },
  forgotPasswordText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.primary.red,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral[300],
  },
  dividerText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
    marginHorizontal: spacing[4],
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[4],
    marginBottom: spacing[6],
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  registerText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  registerLink: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.primary.red,
  },
  termsText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  termsLink: {
    color: colors.primary.red,
  },
  forgotContent: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
  },
  forgotSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing[6],
    lineHeight: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.effects.glowRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    alignSelf: 'center',
  },
  emailHighlight: {
    color: colors.primary.red,
    fontFamily: typography.fonts.bodyMedium,
  },
});
