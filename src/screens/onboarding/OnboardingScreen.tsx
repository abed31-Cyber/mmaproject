/**
 * MMA Universe - Onboarding Screens
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import { Button } from '@components/ui';
import { colors, typography, spacing, borders } from '@theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// ONBOARDING DATA
// =============================================================================

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  quote?: string;
  quoteAuthor?: string;
  image: string;
}

const ONBOARDING_DATA: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Bienvenue dans\nMMA Universe',
    subtitle: 'Votre plateforme ultime pour suivre le monde du MMA',
    quote: '"Le combat est la plus pure forme de compétition"',
    quoteAuthor: 'Georges St-Pierre',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  },
  {
    id: '2',
    title: 'Suivez vos\nCombattants',
    subtitle: 'Accédez aux stats détaillées, historiques et prochains combats de tous vos fighters préférés',
    quote: '"La discipline bat le talent quand le talent manque de discipline"',
    quoteAuthor: 'Conor McGregor',
    image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
  },
  {
    id: '3',
    title: 'Ne Manquez\nAucun Événement',
    subtitle: 'Calendrier complet, fight cards, résultats en direct et vidéos highlights',
    quote: '"Champions ne sont pas faits dans les gyms. Champions sont faits de quelque chose de profond en eux"',
    quoteAuthor: 'Muhammad Ali',
    image: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800',
  },
  {
    id: '4',
    title: 'Rejoignez la\nCommunauté',
    subtitle: 'Partagez, discutez et vivez votre passion du MMA avec des fans du monde entier',
    image: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=800',
  },
];

// =============================================================================
// ONBOARDING SCREEN
// =============================================================================

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const goToNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={styles.slide}>
      <Image
        source={{ uri: item.image }}
        style={styles.slideImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 11, 13, 0.6)', colors.primary.dark]}
        locations={[0, 0.5, 0.85]}
        style={styles.slideGradient}
      />
      
      <View style={styles.slideContent}>
        {item.quote && (
          <View style={styles.quoteContainer}>
            <Text style={styles.quote}>{item.quote}</Text>
            {item.quoteAuthor && (
              <Text style={styles.quoteAuthor}>— {item.quoteAuthor}</Text>
            )}
          </View>
        )}
        
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {ONBOARDING_DATA.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  const isLastSlide = currentIndex === ONBOARDING_DATA.length - 1;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />
      
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        {renderPagination()}
        
        <View style={styles.buttonContainer}>
          {!isLastSlide && (
            <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
              <Text style={styles.skipText}>Passer</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={isLastSlide ? "Commencer" : "Suivant"}
            variant="primary"
            size="large"
            gradient
            fullWidth={isLastSlide}
            style={isLastSlide ? styles.startButton : styles.nextButton}
            onPress={goToNext}
          />
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
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  slideImage: {
    ...StyleSheet.absoluteFillObject,
  },
  slideGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[6],
    paddingBottom: 180,
  },
  quoteContainer: {
    marginBottom: spacing[8],
    paddingLeft: spacing[4],
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.red,
  },
  quote: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.primary.red,
    marginTop: spacing[2],
  },
  slideTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: 36,
    color: colors.text.primary,
    lineHeight: 44,
    marginBottom: spacing[3],
  },
  slideSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodyLarge,
    color: colors.text.secondary,
    lineHeight: 26,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral[400],
    marginHorizontal: spacing[1],
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: colors.primary.red,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  skipText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  nextButton: {
    minWidth: 140,
  },
  startButton: {
    flex: 1,
  },
});

export default OnboardingScreen;
