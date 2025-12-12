/**
 * MMA Universe - Event Detail Screen
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Avatar } from '@components/ui';
import { colors, typography, spacing, borders, layout, shadows } from '@theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_EVENT = {
  id: 'ufc-300',
  title: 'UFC 300',
  subtitle: 'Pereira vs Hill',
  posterUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  date: new Date('2024-04-13T22:00:00'),
  venue: 'T-Mobile Arena',
  city: 'Las Vegas',
  state: 'Nevada',
  country: 'USA',
  organization: 'UFC',
  isLive: false,
  isPPV: true,
  fights: [
    {
      id: 'main',
      order: 1,
      isMainEvent: true,
      isTitleFight: true,
      weightClass: 'Light Heavyweight',
      status: 'upcoming',
      fighterA: {
        id: 'pereira',
        name: 'Alex Pereira',
        nickname: 'Poatan',
        country: 'Brazil',
        imageUrl: 'https://images.unsplash.com/photo-1583473848882-f9a5bc1dcdc0?w=400',
        record: '9-2-0',
        ranking: 'C',
      },
      fighterB: {
        id: 'hill',
        name: 'Jamahal Hill',
        nickname: 'Sweet Dreams',
        country: 'USA',
        imageUrl: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=400',
        record: '12-1-0',
        ranking: '1',
      },
    },
    {
      id: 'co-main',
      order: 2,
      isMainEvent: false,
      isTitleFight: true,
      weightClass: 'Bantamweight',
      status: 'upcoming',
      fighterA: {
        id: 'zhang',
        name: 'Zhang Weili',
        nickname: 'Magnum',
        country: 'China',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
        record: '24-3-0',
        ranking: 'C',
      },
      fighterB: {
        id: 'yan',
        name: 'Yan Xiaonan',
        nickname: '',
        country: 'China',
        imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
        record: '17-3-0',
        ranking: '1',
      },
    },
    {
      id: 'main-card-1',
      order: 3,
      isMainEvent: false,
      isTitleFight: false,
      weightClass: 'Lightweight',
      status: 'upcoming',
      fighterA: {
        id: 'holloway',
        name: 'Max Holloway',
        nickname: 'Blessed',
        country: 'USA',
        imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400',
        record: '25-7-0',
        ranking: '6',
      },
      fighterB: {
        id: 'gaethje',
        name: 'Justin Gaethje',
        nickname: 'The Highlight',
        country: 'USA',
        imageUrl: 'https://images.unsplash.com/photo-1579748154278-c2d14a8f4b69?w=400',
        record: '24-4-0',
        ranking: '2',
      },
    },
    {
      id: 'main-card-2',
      order: 4,
      isMainEvent: false,
      isTitleFight: false,
      weightClass: 'Middleweight',
      status: 'upcoming',
      fighterA: {
        id: 'costa',
        name: 'Paulo Costa',
        nickname: 'Borrachinha',
        country: 'Brazil',
        imageUrl: 'https://images.unsplash.com/photo-1597347343908-2937e7dcc560?w=400',
        record: '14-2-0',
        ranking: '8',
      },
      fighterB: {
        id: 'allen',
        name: 'Brendan Allen',
        nickname: '',
        country: 'USA',
        imageUrl: 'https://images.unsplash.com/photo-1583469588117-3e3afa36d8c2?w=400',
        record: '22-5-0',
        ranking: '9',
      },
    },
  ],
};

// =============================================================================
// FIGHT CARD COMPONENT
// =============================================================================

interface FightCardProps {
  fight: typeof MOCK_EVENT.fights[0];
  onPress?: () => void;
}

const FightCard: React.FC<FightCardProps> = ({ fight, onPress }) => {
  return (
    <TouchableOpacity style={fightCardStyles.container} onPress={onPress}>
      {/* Header Badges */}
      <View style={fightCardStyles.header}>
        {fight.isMainEvent && (
          <View style={[fightCardStyles.badge, fightCardStyles.mainEventBadge]}>
            <Text style={fightCardStyles.badgeText}>MAIN EVENT</Text>
          </View>
        )}
        {fight.isTitleFight && (
          <View style={[fightCardStyles.badge, fightCardStyles.titleBadge]}>
            <Ionicons name="trophy" size={10} color={colors.badge.gold} />
            <Text style={[fightCardStyles.badgeText, { color: colors.badge.gold }]}>
              TITRE EN JEU
            </Text>
          </View>
        )}
        <Text style={fightCardStyles.weightClass}>{fight.weightClass}</Text>
      </View>

      {/* Fighters */}
      <View style={fightCardStyles.fighters}>
        {/* Fighter A */}
        <View style={fightCardStyles.fighter}>
          <View style={fightCardStyles.fighterImageWrapper}>
            <Image
              source={{ uri: fight.fighterA.imageUrl }}
              style={fightCardStyles.fighterImage}
              contentFit="cover"
            />
            {fight.fighterA.ranking === 'C' && (
              <View style={fightCardStyles.championBadge}>
                <Ionicons name="trophy" size={12} color={colors.badge.gold} />
              </View>
            )}
          </View>
          <Text style={fightCardStyles.fighterName}>{fight.fighterA.name}</Text>
          {fight.fighterA.nickname && (
            <Text style={fightCardStyles.fighterNickname}>"{fight.fighterA.nickname}"</Text>
          )}
          <Text style={fightCardStyles.fighterRecord}>{fight.fighterA.record}</Text>
        </View>

        {/* VS Badge */}
        <View style={fightCardStyles.vsContainer}>
          <Text style={fightCardStyles.vsText}>VS</Text>
        </View>

        {/* Fighter B */}
        <View style={fightCardStyles.fighter}>
          <View style={fightCardStyles.fighterImageWrapper}>
            <Image
              source={{ uri: fight.fighterB.imageUrl }}
              style={fightCardStyles.fighterImage}
              contentFit="cover"
            />
            {fight.fighterB.ranking === 'C' && (
              <View style={fightCardStyles.championBadge}>
                <Ionicons name="trophy" size={12} color={colors.badge.gold} />
              </View>
            )}
          </View>
          <Text style={fightCardStyles.fighterName}>{fight.fighterB.name}</Text>
          {fight.fighterB.nickname && (
            <Text style={fightCardStyles.fighterNickname}>"{fight.fighterB.nickname}"</Text>
          )}
          <Text style={fightCardStyles.fighterRecord}>{fight.fighterB.record}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const fightCardStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
    gap: spacing[1],
  },
  mainEventBadge: {
    backgroundColor: colors.primary.red,
  },
  titleBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 1,
    borderColor: colors.badge.gold,
  },
  badgeText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  weightClass: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginLeft: 'auto',
  },
  fighters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fighter: {
    flex: 1,
    alignItems: 'center',
  },
  fighterImageWrapper: {
    position: 'relative',
    marginBottom: spacing[2],
  },
  fighterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.neutral[200],
  },
  championBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.badge.gold,
  },
  fighterName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
    textAlign: 'center',
  },
  fighterNickname: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  fighterRecord: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  vsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
  },
});

// =============================================================================
// EVENT DETAIL SCREEN
// =============================================================================

interface EventDetailScreenProps {
  route?: { params: { id: string } };
  navigation?: any;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ route, navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const event = MOCK_EVENT;

  const formattedDate = event.date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = event.date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${event.title} - ${formattedDate} à ${event.venue}`,
        title: event.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{event.title}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Image
            source={{ uri: event.posterUrl }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', colors.primary.dark]}
            style={styles.heroGradient}
          />
          
          {/* Back Button */}
          <SafeAreaView edges={['top']} style={styles.heroActions}>
            <TouchableOpacity style={styles.heroBackButton} onPress={() => navigation?.goBack()}>
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBackButton} onPress={handleShare}>
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <Ionicons name="share-outline" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Badges */}
          <View style={styles.heroBadges}>
            {event.isPPV && (
              <View style={styles.ppvBadge}>
                <Text style={styles.ppvText}>PPV</Text>
              </View>
            )}
            {event.isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>EN DIRECT</Text>
              </View>
            )}
          </View>
          
          {/* Event Title */}
          <View style={styles.heroContent}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary.red} />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{formattedDate}</Text>
              </View>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="time-outline" size={20} color={colors.primary.red} />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Heure (locale)</Text>
                <Text style={styles.infoValue}>{formattedTime}</Text>
              </View>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="location-outline" size={20} color={colors.primary.red} />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Lieu</Text>
                <Text style={styles.infoValue}>{event.venue}</Text>
                <Text style={styles.infoSubvalue}>
                  {event.city}, {event.state}, {event.country}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton}>
              <LinearGradient
                colors={[colors.gradients.redToDark[0], colors.gradients.redToDark[1]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Ionicons name="notifications-outline" size={20} color={colors.text.primary} />
                <Text style={styles.primaryButtonText}>Me rappeler</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="ticket-outline" size={20} color={colors.text.primary} />
              <Text style={styles.secondaryButtonText}>Acheter des billets</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fight Card Section */}
        <View style={styles.fightCardSection}>
          <Text style={styles.sectionTitle}>Carte des combats</Text>
          
          {/* Main Card */}
          <Text style={styles.cardCategory}>Main Card</Text>
          {event.fights.map((fight) => (
            <FightCard
              key={fight.id}
              fight={fight}
              onPress={() => navigation?.navigate('FighterDetail', { id: fight.fighterA.id })}
            />
          ))}
          
          {/* Prelims */}
          <Text style={styles.cardCategory}>Préliminaires</Text>
          <View style={styles.prelimPlaceholder}>
            <Ionicons name="hourglass-outline" size={24} color={colors.text.muted} />
            <Text style={styles.prelimText}>À venir...</Text>
          </View>
        </View>

        <View style={{ height: layout.tabBarHeight + spacing[8] }} />
      </Animated.ScrollView>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const HERO_HEIGHT = 350;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.dark,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginHorizontal: spacing[3],
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Hero
  hero: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  heroBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroBadges: {
    position: 'absolute',
    top: 100,
    left: spacing[4],
    flexDirection: 'row',
    gap: spacing[2],
  },
  ppvBadge: {
    backgroundColor: colors.badge.gold,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
  },
  ppvText: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.badge,
    color: colors.primary.dark,
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
    gap: spacing[1],
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.primary,
  },
  liveText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[4],
  },
  eventTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h1,
    color: colors.text.primary,
  },
  eventSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.h4,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  
  // Event Info
  eventInfo: {
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
  },
  infoCard: {
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    padding: spacing[4],
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
  },
  infoIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.effects.glowRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  infoValue: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    marginTop: spacing[1],
    textTransform: 'capitalize',
  },
  infoSubvalue: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing[2],
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing[4],
    gap: spacing[3],
  },
  primaryButton: {
    flex: 1,
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  primaryButtonText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[100],
    paddingVertical: spacing[4],
    borderRadius: borders.radius.lg,
    gap: spacing[2],
  },
  secondaryButtonText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  
  // Fight Card Section
  fightCardSection: {
    paddingHorizontal: spacing[4],
    marginTop: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  cardCategory: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.primary.red,
    marginBottom: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  prelimPlaceholder: {
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    padding: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  prelimText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.muted,
  },
});

export default EventDetailScreen;
