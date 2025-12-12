/**
 * MMA Universe - Fighter Detail Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Button, Badge, ResultBadge, RankBadge, WinStreakBadge, VideoCard } from '@components/ui';
import { colors, typography, spacing, borders, shadows, layout } from '@theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_FIGHTER = {
  id: '1',
  firstName: 'Jon',
  lastName: 'Jones',
  nickname: 'Bones',
  photoUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  bannerUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200',
  nationality: 'USA',
  birthDate: new Date('1987-07-19'),
  heightCm: 193,
  reachCm: 215,
  weightClass: 'Heavyweight',
  rank: 'C' as const,
  organization: 'UFC',
  isChampion: true,
  isActive: true,
  stats: {
    wins: 27,
    losses: 1,
    draws: 0,
    noContests: 1,
    knockouts: 10,
    submissions: 7,
    decisions: 10,
    winStreak: 2,
    significantStrikesPerMin: 4.29,
    strikingAccuracy: 57,
    takedownsPerFight: 1.87,
    takedownAccuracy: 45,
    submissionAttempts: 1.6,
    defenseRate: 94,
  },
};

const MOCK_FIGHT_HISTORY = [
  {
    id: '1',
    opponent: { id: '2', name: 'Ciryl Gane', photoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=200' },
    event: { id: '1', name: 'UFC 285' },
    result: 'WIN' as const,
    method: 'SUB' as const,
    round: 1,
    time: '2:04',
    date: new Date('2023-03-04'),
  },
  {
    id: '2',
    opponent: { id: '3', name: 'Dominick Reyes', photoUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=200' },
    event: { id: '2', name: 'UFC 247' },
    result: 'WIN' as const,
    method: 'DEC' as const,
    round: 5,
    time: '5:00',
    date: new Date('2020-02-08'),
  },
  {
    id: '3',
    opponent: { id: '4', name: 'Thiago Santos', photoUrl: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=200' },
    event: { id: '3', name: 'UFC 239' },
    result: 'WIN' as const,
    method: 'SDEC' as const,
    round: 5,
    time: '5:00',
    date: new Date('2019-07-06'),
  },
];

const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'Jon Jones vs Ciryl Gane - Full Fight Highlights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
    duration: 312,
    views: 5200000,
  },
  {
    id: '2',
    title: 'Jon Jones - Career KO Highlights',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    duration: 845,
    views: 12400000,
  },
];

// =============================================================================
// FIGHTER DETAIL SCREEN
// =============================================================================

interface FighterDetailScreenProps {
  navigation?: any;
  route?: { params: { id: string } };
}

export const FighterDetailScreen: React.FC<FighterDetailScreenProps> = ({ navigation }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'history' | 'media'>('stats');

  const fighter = MOCK_FIGHTER;
  const age = Math.floor(
    (new Date().getTime() - new Date(fighter.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  // =============================================================================
  // HERO SECTION
  // =============================================================================
  
  const renderHero = () => (
    <View style={styles.hero}>
      <Image
        source={{ uri: fighter.bannerUrl }}
        style={styles.heroImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 11, 13, 0.6)', colors.primary.dark]}
        locations={[0, 0.5, 0.9]}
        style={styles.heroGradient}
      />
      
      {/* Back Button */}
      <SafeAreaView edges={['top']} style={styles.heroHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <BlurView intensity={30} style={styles.blurButton}>
            <Ionicons name="arrow-back" size={22} color={colors.text.primary} />
          </BlurView>
        </TouchableOpacity>
        
        <View style={styles.heroHeaderRight}>
          <TouchableOpacity style={styles.shareButton}>
            <BlurView intensity={30} style={styles.blurButton}>
              <Ionicons name="share-outline" size={22} color={colors.text.primary} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Fighter Info */}
      <View style={styles.heroContent}>
        <View style={styles.badgeRow}>
          <RankBadge rank={fighter.rank} />
          {fighter.stats.winStreak && fighter.stats.winStreak > 1 && (
            <WinStreakBadge streak={fighter.stats.winStreak} />
          )}
        </View>
        
        {fighter.nickname && (
          <Text style={styles.nickname}>"{fighter.nickname}"</Text>
        )}
        <Text style={styles.fighterName}>
          {fighter.firstName} {fighter.lastName}
        </Text>
        
        <View style={styles.recordContainer}>
          <Text style={styles.record}>
            {fighter.stats.wins}-{fighter.stats.losses}
            {fighter.stats.draws > 0 && `-${fighter.stats.draws}`}
            {fighter.stats.noContests > 0 && ` (${fighter.stats.noContests} NC)`}
          </Text>
          <View style={styles.weightClassBadge}>
            <Text style={styles.weightClassText}>{fighter.weightClass}</Text>
          </View>
        </View>
        
        <Button
          title={isFollowing ? 'Suivi' : 'Suivre'}
          variant={isFollowing ? 'secondary' : 'primary'}
          size="medium"
          icon={<Ionicons 
            name={isFollowing ? 'checkmark' : 'add'} 
            size={18} 
            color={isFollowing ? colors.status.success : colors.text.primary} 
          />}
          onPress={() => setIsFollowing(!isFollowing)}
          style={styles.followButton}
        />
      </View>
    </View>
  );

  // =============================================================================
  // INFO CARDS
  // =============================================================================
  
  const renderInfoCards = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.infoCardsContainer}
    >
      <View style={styles.infoCard}>
        <Ionicons name="flag-outline" size={20} color={colors.primary.red} />
        <Text style={styles.infoCardValue}>{fighter.nationality}</Text>
        <Text style={styles.infoCardLabel}>Nationalité</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary.red} />
        <Text style={styles.infoCardValue}>{age} ans</Text>
        <Text style={styles.infoCardLabel}>Âge</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Ionicons name="resize-outline" size={20} color={colors.primary.red} />
        <Text style={styles.infoCardValue}>{fighter.heightCm} cm</Text>
        <Text style={styles.infoCardLabel}>Taille</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Ionicons name="hand-left-outline" size={20} color={colors.primary.red} />
        <Text style={styles.infoCardValue}>{fighter.reachCm} cm</Text>
        <Text style={styles.infoCardLabel}>Allonge</Text>
      </View>
    </ScrollView>
  );

  // =============================================================================
  // TABS
  // =============================================================================
  
  const renderTabs = () => (
    <View style={styles.tabs}>
      {(['stats', 'history', 'media'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.tabActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
            {tab === 'stats' ? 'Statistiques' : tab === 'history' ? 'Historique' : 'Médias'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // =============================================================================
  // STATS TAB
  // =============================================================================
  
  const renderStatsTab = () => (
    <View style={styles.tabContent}>
      {/* Win Methods */}
      <View style={styles.statsSection}>
        <Text style={styles.statsSectionTitle}>Méthodes de victoire</Text>
        <View style={styles.winMethodsContainer}>
          <View style={styles.winMethodCard}>
            <Text style={styles.winMethodValue}>{fighter.stats.knockouts}</Text>
            <Badge label="KO/TKO" variant="ko" size="small" />
          </View>
          <View style={styles.winMethodCard}>
            <Text style={styles.winMethodValue}>{fighter.stats.submissions}</Text>
            <Badge label="SUB" variant="sub" size="small" />
          </View>
          <View style={styles.winMethodCard}>
            <Text style={styles.winMethodValue}>{fighter.stats.decisions}</Text>
            <Badge label="DEC" variant="dec" size="small" />
          </View>
        </View>
      </View>
      
      {/* Performance Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.statsSectionTitle}>Performance</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Frappes significatives / min</Text>
          <Text style={styles.statValue}>{fighter.stats.significantStrikesPerMin}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Précision des frappes</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: `${fighter.stats.strikingAccuracy}%` }]} />
          </View>
          <Text style={styles.statValue}>{fighter.stats.strikingAccuracy}%</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Takedowns / combat</Text>
          <Text style={styles.statValue}>{fighter.stats.takedownsPerFight}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Précision takedowns</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, { width: `${fighter.stats.takedownAccuracy}%` }]} />
          </View>
          <Text style={styles.statValue}>{fighter.stats.takedownAccuracy}%</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Défense (% frappes évitées)</Text>
          <View style={styles.statBarContainer}>
            <View style={[styles.statBar, styles.statBarSuccess, { width: `${fighter.stats.defenseRate}%` }]} />
          </View>
          <Text style={styles.statValue}>{fighter.stats.defenseRate}%</Text>
        </View>
      </View>
    </View>
  );

  // =============================================================================
  // HISTORY TAB
  // =============================================================================
  
  const renderHistoryTab = () => (
    <View style={styles.tabContent}>
      {MOCK_FIGHT_HISTORY.map((fight) => (
        <TouchableOpacity key={fight.id} style={styles.fightHistoryCard}>
          <Image
            source={{ uri: fight.opponent.photoUrl }}
            style={styles.opponentImage}
            contentFit="cover"
          />
          <View style={styles.fightHistoryContent}>
            <Text style={styles.opponentName}>{fight.opponent.name}</Text>
            <Text style={styles.eventName}>{fight.event.name}</Text>
            <Text style={styles.fightDate}>
              {new Date(fight.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
          <ResultBadge
            result={fight.result}
            method={fight.method}
            round={fight.round}
            time={fight.time}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  // =============================================================================
  // MEDIA TAB
  // =============================================================================
  
  const renderMediaTab = () => (
    <View style={styles.tabContent}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {MOCK_VIDEOS.map((video) => (
          <VideoCard
            key={video.id}
            {...video}
            onPress={() => navigation?.navigate('VideoPlayer', { id: video.id })}
          />
        ))}
      </ScrollView>
    </View>
  );

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {renderHero()}
        {renderInfoCards()}
        {renderTabs()}
        
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'media' && renderMediaTab()}
        
        <View style={{ height: layout.tabBarHeight + spacing[4] }} />
      </ScrollView>
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
  
  // Hero
  hero: {
    height: SCREEN_HEIGHT * 0.55,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  backButton: {},
  blurButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroHeaderRight: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  shareButton: {},
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  nickname: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.primary.red,
    marginBottom: spacing[1],
  },
  fighterName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display,
    color: colors.text.primary,
    lineHeight: 46,
  },
  recordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  record: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
  },
  weightClassBadge: {
    backgroundColor: colors.neutral[200],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.full,
  },
  weightClassText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  followButton: {
    alignSelf: 'flex-start',
  },
  
  // Info Cards
  infoCardsContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  infoCard: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borders.radius.lg,
    alignItems: 'center',
    minWidth: 90,
    marginRight: spacing[3],
  },
  infoCardValue: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginTop: spacing[2],
  },
  infoCardLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  
  // Tabs
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    marginHorizontal: spacing[4],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary.red,
  },
  tabText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.primary.red,
  },
  tabContent: {
    padding: spacing[4],
  },
  
  // Stats
  statsSection: {
    marginBottom: spacing[6],
  },
  statsSectionTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  winMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  winMethodCard: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    paddingVertical: spacing[4],
    borderRadius: borders.radius.lg,
    alignItems: 'center',
  },
  winMethodValue: {
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.h1,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  statLabel: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  statBarContainer: {
    width: 80,
    height: 6,
    backgroundColor: colors.neutral[300],
    borderRadius: 3,
    marginRight: spacing[3],
  },
  statBar: {
    height: '100%',
    backgroundColor: colors.primary.red,
    borderRadius: 3,
  },
  statBarSuccess: {
    backgroundColor: colors.status.success,
  },
  statValue: {
    fontFamily: typography.fonts.monoMedium,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    width: 50,
    textAlign: 'right',
  },
  
  // History
  fightHistoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    padding: spacing[3],
    borderRadius: borders.radius.lg,
    marginBottom: spacing[3],
  },
  opponentImage: {
    width: 60,
    height: 60,
    borderRadius: borders.radius.md,
  },
  fightHistoryContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  opponentName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  eventName: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  fightDate: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
});

export default FighterDetailScreen;
