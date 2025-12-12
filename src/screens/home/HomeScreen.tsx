/**
 * MMA Universe - Home Dashboard Screen
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  FighterCard,
  EventCard,
  VideoCard,
  ArticleCard,
  Avatar,
  SkeletonFighterCard,
  SkeletonEventCard,
} from '@components/ui';
import { colors, typography, spacing, borders, shadows, layout } from '@theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_EVENTS = [
  {
    id: '1',
    title: 'UFC 300',
    posterUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
    date: new Date('2024-04-13T22:00:00'),
    venue: 'T-Mobile Arena',
    city: 'Las Vegas',
    mainEvent: { fighterA: 'Alex Pereira', fighterB: 'Jamahal Hill' },
    isLive: false,
  },
  {
    id: '2',
    title: 'UFC Fight Night',
    posterUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
    date: new Date('2024-03-30T20:00:00'),
    venue: 'UFC Apex',
    city: 'Las Vegas',
    mainEvent: { fighterA: 'Nicolau', fighterB: 'Kape' },
    isLive: true,
  },
];

const MOCK_FIGHTERS = [
  {
    id: '1',
    name: 'Jon Jones',
    nickname: 'Bones',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
    weightClass: 'Heavyweight',
    record: { wins: 27, losses: 1, draws: 0 },
    isFollowing: true,
  },
  {
    id: '2',
    name: 'Islam Makhachev',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    weightClass: 'Lightweight',
    record: { wins: 25, losses: 1, draws: 0 },
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Alex Pereira',
    nickname: 'Poatan',
    imageUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=400',
    weightClass: 'Light Heavyweight',
    record: { wins: 9, losses: 2, draws: 0 },
    isFollowing: true,
  },
];

const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'UFC 299 Full Fight Highlights - O\'Malley vs Dvalishvili',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600',
    duration: 425,
    views: 1250000,
    date: new Date('2024-03-09'),
  },
  {
    id: '2',
    title: 'Inside the Octagon - UFC 300 Preview',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600',
    duration: 892,
    views: 890000,
    date: new Date('2024-03-15'),
  },
  {
    id: '3',
    title: 'Khabib\'s Best Moments - Retirement Special',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=600',
    duration: 1205,
    views: 3400000,
    date: new Date('2024-02-28'),
  },
];

const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'UFC 300: Everything You Need to Know About the Historic Event',
    excerpt: 'The milestone event features three title fights and the return of legendary fighters...',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600',
    source: 'ESPN MMA',
    date: new Date('2024-03-20'),
  },
  {
    id: '2',
    title: 'Conor McGregor Announces Comeback Fight Date',
    excerpt: 'The Irish superstar is set to return to the octagon after a long absence...',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600',
    source: 'MMA Fighting',
    date: new Date('2024-03-19'),
  },
];

// =============================================================================
// HOME SCREEN
// =============================================================================

interface HomeScreenProps {
  navigation?: any;
  user?: {
    name: string;
    avatar?: string;
  };
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, user }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  // =============================================================================
  // SECTION: Header
  // =============================================================================
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.greeting}>Bonjour,</Text>
        <Text style={styles.userName}>{user?.name || 'Fan de MMA'} 👊</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
        <Avatar 
          source={user?.avatar} 
          name={user?.name} 
          size="medium"
          onPress={() => navigation?.navigate('Profile')}
        />
      </View>
    </View>
  );

  // =============================================================================
  // SECTION: Next Fight Card
  // =============================================================================
  
  const renderNextFightCard = () => {
    const nextEvent = MOCK_EVENTS[0];
    const daysUntil = Math.ceil(
      (new Date(nextEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity style={styles.nextFightCard} activeOpacity={0.9}>
        <Image
          source={{ uri: nextEvent.posterUrl }}
          style={styles.nextFightImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(11, 11, 13, 0.8)', colors.primary.dark]}
          style={styles.nextFightGradient}
        />
        
        <View style={styles.nextFightBadge}>
          <Ionicons name="time-outline" size={14} color={colors.text.primary} />
          <Text style={styles.nextFightBadgeText}>Dans {daysUntil} jours</Text>
        </View>
        
        <View style={styles.nextFightContent}>
          <Text style={styles.nextFightLabel}>PROCHAIN ÉVÉNEMENT</Text>
          <Text style={styles.nextFightTitle}>{nextEvent.title}</Text>
          
          {nextEvent.mainEvent && (
            <View style={styles.mainEventPreview}>
              <Text style={styles.mainEventName}>{nextEvent.mainEvent.fighterA}</Text>
              <View style={styles.vsContainer}>
                <Text style={styles.vsText}>VS</Text>
              </View>
              <Text style={styles.mainEventName}>{nextEvent.mainEvent.fighterB}</Text>
            </View>
          )}
          
          <View style={styles.nextFightMeta}>
            <Ionicons name="location-outline" size={14} color={colors.text.secondary} />
            <Text style={styles.nextFightMetaText}>
              {nextEvent.venue}, {nextEvent.city}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // =============================================================================
  // SECTION: Quick Filters
  // =============================================================================
  
  const QUICK_FILTERS = [
    { id: 'all', label: 'Tout', icon: 'grid-outline' },
    { id: 'ufc', label: 'UFC', icon: 'trophy-outline' },
    { id: 'bellator', label: 'Bellator', icon: 'shield-outline' },
    { id: 'pfl', label: 'PFL', icon: 'medal-outline' },
    { id: 'one', label: 'ONE', icon: 'globe-outline' },
  ];

  const [activeFilter, setActiveFilter] = useState('all');

  const renderQuickFilters = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      {QUICK_FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterChip,
            activeFilter === filter.id && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter(filter.id)}
        >
          <Ionicons 
            name={filter.icon as any} 
            size={16} 
            color={activeFilter === filter.id ? colors.text.primary : colors.text.secondary} 
          />
          <Text style={[
            styles.filterChipText,
            activeFilter === filter.id && styles.filterChipTextActive,
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // =============================================================================
  // SECTION: Section Header
  // =============================================================================
  
  const renderSectionHeader = (title: string, onSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Voir tout</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary.red} />
        </TouchableOpacity>
      )}
    </View>
  );

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.red}
              colors={[colors.primary.red]}
            />
          }
        >
          {renderHeader()}
          
          {/* Next Fight Card */}
          <View style={styles.section}>
            {renderNextFightCard()}
          </View>
          
          {/* Quick Filters */}
          {renderQuickFilters()}
          
          {/* Events Carousel */}
          <View style={styles.section}>
            {renderSectionHeader('Événements à venir', () => navigation?.navigate('Events'))}
            {isLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <SkeletonEventCard />
                <SkeletonEventCard />
              </ScrollView>
            ) : (
              <FlatList
                data={MOCK_EVENTS}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContent}
                renderItem={({ item }) => (
                  <EventCard
                    {...item}
                    onPress={() => navigation?.navigate('EventDetail', { id: item.id })}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
          
          {/* Trending Fighters */}
          <View style={styles.section}>
            {renderSectionHeader('Combattants populaires', () => navigation?.navigate('Fighters'))}
            <FlatList
              data={MOCK_FIGHTERS}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              renderItem={({ item }) => (
                <FighterCard
                  {...item}
                  onPress={() => navigation?.navigate('FighterDetail', { id: item.id })}
                  onFollowPress={() => console.log('Follow', item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          
          {/* Videos Section */}
          <View style={styles.section}>
            {renderSectionHeader('Vidéos recommandées', () => navigation?.navigate('Videos'))}
            <FlatList
              data={MOCK_VIDEOS}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              renderItem={({ item }) => (
                <VideoCard
                  {...item}
                  onPress={() => navigation?.navigate('VideoPlayer', { id: item.id })}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
          
          {/* Articles Section */}
          <View style={styles.section}>
            {renderSectionHeader('Actualités', () => navigation?.navigate('Articles'))}
            {MOCK_ARTICLES.map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                onPress={() => navigation?.navigate('ArticleDetail', { id: article.id })}
              />
            ))}
          </View>
          
          {/* Bottom Spacing */}
          <View style={{ height: layout.tabBarHeight + spacing[4] }} />
        </ScrollView>
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
  safeArea: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  headerLeft: {},
  greeting: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  userName: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.red,
  },
  
  // Section
  section: {
    marginTop: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.primary.red,
    marginRight: spacing[1],
  },
  carouselContent: {
    paddingHorizontal: spacing[4],
  },
  
  // Next Fight Card
  nextFightCard: {
    marginHorizontal: spacing[4],
    height: 200,
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    ...shadows.lg,
  },
  nextFightImage: {
    ...StyleSheet.absoluteFillObject,
  },
  nextFightGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  nextFightBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
  },
  nextFightBadgeText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
    marginLeft: spacing[1],
  },
  nextFightContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing[4],
  },
  nextFightLabel: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.primary.red,
    letterSpacing: 1.5,
    marginBottom: spacing[1],
  },
  nextFightTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  mainEventPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  mainEventName: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  vsContainer: {
    marginHorizontal: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    backgroundColor: colors.primary.red,
    borderRadius: borders.radius.sm,
  },
  vsText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
  },
  nextFightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextFightMetaText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginLeft: spacing[1],
  },
  
  // Quick Filters
  filtersContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.full,
    marginRight: spacing[2],
  },
  filterChipActive: {
    backgroundColor: colors.primary.red,
  },
  filterChipText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
    marginLeft: spacing[1],
  },
  filterChipTextActive: {
    color: colors.text.primary,
  },
});

export default HomeScreen;
