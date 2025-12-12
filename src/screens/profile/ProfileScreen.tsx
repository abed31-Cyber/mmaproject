/**
 * MMA Universe - Profile Screen
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Avatar, Button } from '@components/ui';
import { colors, typography, spacing, borders, layout, shadows } from '@theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_USER = {
  id: 'current-user',
  name: 'Alexandre Martin',
  username: 'alex_mma',
  bio: '🥊 Passionné de MMA depuis 2015\n🏆 BJJ Purple Belt\n📍 Paris, France',
  avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=400',
  coverUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
  stats: {
    posts: 42,
    followers: 1234,
    following: 567,
  },
  badges: ['verified', 'early_adopter', 'contributor'],
  followedFighters: [
    {
      id: 'f1',
      name: 'Alex Pereira',
      imageUrl: 'https://images.unsplash.com/photo-1583473848882-f9a5bc1dcdc0?w=200',
      nickname: 'Poatan',
    },
    {
      id: 'f2',
      name: 'Islam Makhachev',
      imageUrl: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=200',
      nickname: '',
    },
    {
      id: 'f3',
      name: 'Jon Jones',
      imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200',
      nickname: 'Bones',
    },
  ],
  savedEvents: 5,
  predictions: {
    total: 48,
    correct: 31,
    accuracy: 64.6,
  },
};

const MOCK_POSTS = [
  {
    id: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=300',
    likesCount: 124,
    commentsCount: 8,
  },
  {
    id: 'p2',
    imageUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=300',
    likesCount: 89,
    commentsCount: 5,
  },
  {
    id: 'p3',
    imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=300',
    likesCount: 256,
    commentsCount: 23,
  },
  {
    id: 'p4',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300',
    likesCount: 45,
    commentsCount: 2,
  },
  {
    id: 'p5',
    imageUrl: 'https://images.unsplash.com/photo-1597347343908-2937e7dcc560?w=300',
    likesCount: 178,
    commentsCount: 15,
  },
  {
    id: 'p6',
    imageUrl: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=300',
    likesCount: 67,
    commentsCount: 4,
  },
];

// =============================================================================
// STATS CARD COMPONENT
// =============================================================================

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, value, color = colors.primary.red }) => (
  <View style={statsStyles.card}>
    <View style={[statsStyles.iconWrapper, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <Text style={statsStyles.value}>{value}</Text>
    <Text style={statsStyles.label}>{label}</Text>
  </View>
);

const statsStyles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.lg,
    padding: spacing[3],
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  value: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
  },
  label: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
});

// =============================================================================
// PROFILE SCREEN
// =============================================================================

interface ProfileScreenProps {
  navigation?: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'predictions' | 'saved'>('posts');
  const scrollY = useRef(new Animated.Value(0)).current;
  const user = MOCK_USER;

  const TABS = [
    { id: 'posts', icon: 'grid-outline', label: 'Posts' },
    { id: 'predictions', icon: 'trophy-outline', label: 'Pronostics' },
    { id: 'saved', icon: 'bookmark-outline', label: 'Favoris' },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>{user.username}</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation?.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text.primary} />
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
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: user.coverUrl }}
            style={styles.coverImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', colors.primary.dark]}
            style={styles.coverGradient}
          />
          
          <SafeAreaView edges={['top']} style={styles.coverActions}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity
              style={styles.coverButton}
              onPress={() => navigation?.navigate('Settings')}
            >
              <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
              <Ionicons name="settings-outline" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: user.avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={14} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(user.stats.posts)}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(user.stats.followers)}</Text>
                <Text style={styles.statLabel}>Abonnés</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statValue}>{formatNumber(user.stats.following)}</Text>
                <Text style={styles.statLabel}>Suivis</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <Ionicons name="checkmark-circle" size={18} color={colors.primary.red} />
            </View>
            <Text style={styles.userHandle}>@{user.username}</Text>
            <Text style={styles.userBio}>{user.bio}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => navigation?.navigate('EditProfile')}
            >
              <Text style={styles.editProfileText}>Modifier le profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <StatsCard
            icon="trophy"
            label="Pronostics"
            value={`${user.predictions.accuracy}%`}
            color={colors.badge.gold}
          />
          <StatsCard
            icon="calendar"
            label="Événements"
            value={user.savedEvents}
            color={colors.primary.red}
          />
          <StatsCard
            icon="people"
            label="Combattants"
            value={user.followedFighters.length}
            color={colors.status.success}
          />
        </View>

        {/* Followed Fighters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Combattants suivis</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('FollowedFighters')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fightersScroll}
          >
            {user.followedFighters.map((fighter) => (
              <TouchableOpacity
                key={fighter.id}
                style={styles.fighterCard}
                onPress={() => navigation?.navigate('FighterDetail', { id: fighter.id })}
              >
                <Image
                  source={{ uri: fighter.imageUrl }}
                  style={styles.fighterImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.fighterGradient}
                />
                <Text style={styles.fighterName}>{fighter.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addFighterCard}
              onPress={() => navigation?.navigate('FightersList')}
            >
              <Ionicons name="add" size={32} color={colors.text.muted} />
              <Text style={styles.addFighterText}>Ajouter</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Ionicons
                name={tab.icon as any}
                size={22}
                color={activeTab === tab.id ? colors.text.primary : colors.text.muted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts Grid */}
        {activeTab === 'posts' && (
          <View style={styles.postsGrid}>
            {MOCK_POSTS.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postItem}
                onPress={() => navigation?.navigate('PostDetail', { postId: post.id })}
              >
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                  contentFit="cover"
                />
                <View style={styles.postOverlay}>
                  <View style={styles.postStat}>
                    <Ionicons name="heart" size={14} color={colors.text.primary} />
                    <Text style={styles.postStatText}>{post.likesCount}</Text>
                  </View>
                  <View style={styles.postStat}>
                    <Ionicons name="chatbubble" size={14} color={colors.text.primary} />
                    <Text style={styles.postStatText}>{post.commentsCount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <View style={styles.predictionsContent}>
            <View style={styles.predictionStats}>
              <View style={styles.predictionCircle}>
                <Text style={styles.predictionPercentage}>
                  {user.predictions.accuracy}%
                </Text>
                <Text style={styles.predictionLabel}>Précision</Text>
              </View>
              <View style={styles.predictionDetails}>
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionDetailLabel}>Total</Text>
                  <Text style={styles.predictionDetailValue}>{user.predictions.total}</Text>
                </View>
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionDetailLabel}>Corrects</Text>
                  <Text style={[styles.predictionDetailValue, { color: colors.status.success }]}>
                    {user.predictions.correct}
                  </Text>
                </View>
                <View style={styles.predictionRow}>
                  <Text style={styles.predictionDetailLabel}>Incorrects</Text>
                  <Text style={[styles.predictionDetailValue, { color: colors.status.error }]}>
                    {user.predictions.total - user.predictions.correct}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <View style={styles.savedContent}>
            <Ionicons name="bookmark-outline" size={48} color={colors.text.muted} />
            <Text style={styles.savedTitle}>Vos favoris</Text>
            <Text style={styles.savedSubtitle}>
              Les posts que vous sauvegardez apparaîtront ici
            </Text>
          </View>
        )}

        <View style={{ height: layout.tabBarHeight + spacing[8] }} />
      </Animated.ScrollView>
    </View>
  );
};

// =============================================================================
// SETTINGS SCREEN
// =============================================================================

interface SettingsScreenProps {
  navigation?: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [fightReminders, setFightReminders] = useState(true);

  const MENU_ITEMS = [
    {
      section: 'Compte',
      items: [
        { icon: 'person-outline', label: 'Informations personnelles', screen: 'EditProfile' },
        { icon: 'lock-closed-outline', label: 'Sécurité', screen: 'Security' },
        { icon: 'card-outline', label: 'Abonnement', screen: 'Subscription' },
      ],
    },
    {
      section: 'Préférences',
      items: [
        { icon: 'notifications-outline', label: 'Notifications', toggle: true, value: notifications, onToggle: setNotifications },
        { icon: 'moon-outline', label: 'Mode sombre', toggle: true, value: darkMode, onToggle: setDarkMode },
        { icon: 'alarm-outline', label: 'Rappels de combats', toggle: true, value: fightReminders, onToggle: setFightReminders },
        { icon: 'language-outline', label: 'Langue', value: 'Français', screen: 'Language' },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Aide & FAQ', screen: 'Help' },
        { icon: 'chatbox-outline', label: 'Contacter le support', screen: 'Support' },
        { icon: 'document-text-outline', label: 'Conditions d\'utilisation', screen: 'Terms' },
        { icon: 'shield-outline', label: 'Politique de confidentialité', screen: 'Privacy' },
      ],
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => navigation?.navigate('Auth') },
      ]
    );
  };

  return (
    <View style={settingsStyles.container}>
      <SafeAreaView edges={['top']} style={settingsStyles.safeArea}>
        {/* Header */}
        <View style={settingsStyles.header}>
          <TouchableOpacity
            style={settingsStyles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={settingsStyles.headerTitle}>Paramètres</Text>
          <View style={settingsStyles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {MENU_ITEMS.map((section) => (
            <View key={section.section} style={settingsStyles.section}>
              <Text style={settingsStyles.sectionTitle}>{section.section}</Text>
              <View style={settingsStyles.sectionContent}>
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      settingsStyles.menuItem,
                      index < section.items.length - 1 && settingsStyles.menuItemBorder,
                    ]}
                    onPress={() => item.screen && navigation?.navigate(item.screen)}
                    disabled={item.toggle}
                  >
                    <View style={settingsStyles.menuItemLeft}>
                      <Ionicons name={item.icon as any} size={22} color={colors.text.secondary} />
                      <Text style={settingsStyles.menuItemLabel}>{item.label}</Text>
                    </View>
                    {item.toggle ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.neutral[200], true: colors.primary.red }}
                        thumbColor={colors.text.primary}
                      />
                    ) : item.value ? (
                      <View style={settingsStyles.menuItemRight}>
                        <Text style={settingsStyles.menuItemValue}>{item.value}</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                      </View>
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={settingsStyles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.status.error} />
            <Text style={settingsStyles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={settingsStyles.version}>MMA Universe v1.0.0</Text>

          <View style={{ height: spacing[8] }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const COVER_HEIGHT = 180;
const AVATAR_SIZE = 100;

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
  headerTitle: {
    flex: 1,
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContainer: {
    height: COVER_HEIGHT,
    position: 'relative',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  coverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  coverButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileSection: {
    paddingHorizontal: spacing[4],
    marginTop: -AVATAR_SIZE / 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: colors.primary.dark,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary.dark,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: spacing[4],
    paddingBottom: spacing[2],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
  },
  statLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
  userInfo: {
    marginTop: spacing[3],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  userName: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
  },
  userHandle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
  userBio: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    lineHeight: 22,
    marginTop: spacing[2],
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: spacing[4],
    gap: spacing[3],
  },
  editProfileButton: {
    flex: 1,
    backgroundColor: colors.neutral[100],
    paddingVertical: spacing[3],
    borderRadius: borders.radius.lg,
    alignItems: 'center',
  },
  editProfileText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  shareButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    marginTop: spacing[4],
    gap: spacing[3],
  },
  section: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
  },
  seeAll: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.primary.red,
  },
  fightersScroll: {
    gap: spacing[3],
  },
  fighterCard: {
    width: 100,
    height: 130,
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  fighterImage: {
    ...StyleSheet.absoluteFillObject,
  },
  fighterGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  fighterName: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
    right: spacing[2],
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.primary,
  },
  addFighterCard: {
    width: 100,
    height: 130,
    borderRadius: borders.radius.lg,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
  },
  addFighterText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginTop: spacing[1],
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.text.primary,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 1,
  },
  postItem: {
    width: SCREEN_WIDTH / 3 - 1,
    aspectRatio: 1,
    margin: 0.5,
    position: 'relative',
  },
  postImage: {
    ...StyleSheet.absoluteFillObject,
  },
  postOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    opacity: 0,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  postStatText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
  },
  predictionsContent: {
    padding: spacing[4],
  },
  predictionStats: {
    flexDirection: 'row',
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    padding: spacing[4],
    alignItems: 'center',
  },
  predictionCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.effects.glowRed,
    borderWidth: 4,
    borderColor: colors.primary.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionPercentage: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    color: colors.primary.red,
  },
  predictionLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  predictionDetails: {
    flex: 1,
    marginLeft: spacing[4],
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  predictionDetailLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
  },
  predictionDetailValue: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  savedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
  },
  savedTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  savedSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.muted,
    marginTop: spacing[2],
    textAlign: 'center',
    paddingHorizontal: spacing[8],
  },
});

const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.dark,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  section: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
  sectionTitle: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  sectionContent: {
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  menuItemLabel: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  menuItemValue: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[6],
    marginHorizontal: spacing[4],
    paddingVertical: spacing[4],
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    gap: spacing[2],
  },
  logoutText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.status.error,
  },
  version: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing[4],
  },
});

export default ProfileScreen;
