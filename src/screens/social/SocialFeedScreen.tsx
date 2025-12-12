/**
 * MMA Universe - Social Feed Screen
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Avatar } from '@components/ui';
import { Post } from '@components/social';
import { colors, typography, spacing, borders, layout, shadows } from '@theme/tokens';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_STORIES = [
  { id: 'create', isCreate: true },
  {
    id: 's1',
    userId: 'u1',
    userName: 'UFC',
    userAvatar: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100',
    isViewed: false,
    isVerified: true,
  },
  {
    id: 's2',
    userId: 'u2',
    userName: 'Pereira',
    userAvatar: 'https://images.unsplash.com/photo-1583473848882-f9a5bc1dcdc0?w=100',
    isViewed: false,
    isVerified: true,
  },
  {
    id: 's3',
    userId: 'u3',
    userName: 'MMAWorld',
    userAvatar: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=100',
    isViewed: true,
    isVerified: false,
  },
  {
    id: 's4',
    userId: 'u4',
    userName: 'Gaethje',
    userAvatar: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=100',
    isViewed: true,
    isVerified: true,
  },
  {
    id: 's5',
    userId: 'u5',
    userName: 'BellatorMMA',
    userAvatar: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=100',
    isViewed: true,
    isVerified: true,
  },
];

const MOCK_POSTS = [
  {
    id: 'p1',
    user: {
      id: 'u1',
      name: 'UFC',
      username: 'ufc',
      avatarUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100',
      isVerified: true,
    },
    content: `🔥 UFC 300 s'annonce LÉGENDAIRE !

Alex Pereira vs Jamahal Hill pour le titre Light Heavyweight.

Qui va remporter ce combat ? 🏆`,
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likesCount: 15420,
    commentsCount: 892,
    sharesCount: 234,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p2',
    user: {
      id: 'u2',
      name: 'Alex Pereira',
      username: 'alexpoatan',
      avatarUrl: 'https://images.unsplash.com/photo-1583473848882-f9a5bc1dcdc0?w=100',
      isVerified: true,
    },
    content: `Training camp terminé. Prêt pour UFC 300. 

Chama! 🔥👊`,
    images: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
      'https://images.unsplash.com/photo-1597347343908-2937e7dcc560?w=800',
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likesCount: 28340,
    commentsCount: 1203,
    sharesCount: 567,
    isLiked: true,
    isSaved: true,
  },
  {
    id: 'p3',
    user: {
      id: 'u3',
      name: 'MMA Universe Fan',
      username: 'mmafan2024',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100',
      isVerified: false,
    },
    content: `Mon pronostic pour UFC 300:

Main Event: Pereira par KO R2
Co-Main: Zhang par décision unanime
Holloway vs Gaethje: FOTN garanti 💥

Qui est d'accord ? 👀`,
    images: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likesCount: 234,
    commentsCount: 67,
    sharesCount: 12,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'p4',
    user: {
      id: 'u4',
      name: 'Justin Gaethje',
      username: 'justin_gaethje',
      avatarUrl: 'https://images.unsplash.com/photo-1564415315949-7a0c4c73aab4?w=100',
      isVerified: true,
    },
    content: `Max Holloway is a legend. But April 13th, we make history at 155. 

BMF title bout. Let's go! 🏆`,
    images: ['https://images.unsplash.com/photo-1517438322307-e67111335449?w=800'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likesCount: 42891,
    commentsCount: 2341,
    sharesCount: 891,
    isLiked: true,
    isSaved: false,
  },
];

// =============================================================================
// STORY ITEM
// =============================================================================

interface StoryItemProps {
  story: typeof MOCK_STORIES[0];
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress }) => {
  if (story.isCreate) {
    return (
      <TouchableOpacity style={storyStyles.container} onPress={onPress}>
        <View style={storyStyles.createStory}>
          <LinearGradient
            colors={[colors.neutral[200], colors.neutral[100]]}
            style={storyStyles.createGradient}
          >
            <Ionicons name="add" size={28} color={colors.text.primary} />
          </LinearGradient>
        </View>
        <Text style={storyStyles.name}>Créer</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={storyStyles.container} onPress={onPress}>
      <LinearGradient
        colors={story.isViewed 
          ? [colors.neutral[200], colors.neutral[200]] 
          : [colors.primary.red, colors.primary.redLight]
        }
        style={storyStyles.ring}
      >
        <View style={storyStyles.avatarWrapper}>
          <Image
            source={{ uri: story.userAvatar }}
            style={storyStyles.avatar}
            contentFit="cover"
          />
        </View>
      </LinearGradient>
      <View style={storyStyles.nameRow}>
        <Text style={storyStyles.name} numberOfLines={1}>{story.userName}</Text>
        {story.isVerified && (
          <Ionicons name="checkmark-circle" size={12} color={colors.primary.red} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const storyStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: spacing[3],
    width: 72,
  },
  ring: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: colors.primary.dark,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  createStory: {
    width: 68,
    height: 68,
  },
  createGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderStyle: 'dashed',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: 2,
  },
  name: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    maxWidth: 60,
  },
});

// =============================================================================
// SOCIAL FEED SCREEN
// =============================================================================

interface SocialFeedScreenProps {
  navigation?: any;
}

export const SocialFeedScreen: React.FC<SocialFeedScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'following' | 'trending'>('feed');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const TABS = [
    { id: 'feed', label: 'Pour vous' },
    { id: 'following', label: 'Abonnements' },
    { id: 'trending', label: 'Tendances' },
  ];

  const renderHeader = () => (
    <>
      {/* Stories */}
      <View style={styles.storiesSection}>
        <FlatList
          horizontal
          data={MOCK_STORIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryItem
              story={item}
              onPress={() => {
                if (item.isCreate) {
                  navigation?.navigate('CreateStory');
                } else {
                  navigation?.navigate('ViewStory', { userId: item.userId });
                }
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive,
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderPost = ({ item }: { item: typeof MOCK_POSTS[0] }) => (
    <Post
      id={item.id}
      user={item.user}
      content={item.content}
      images={item.images}
      createdAt={item.createdAt}
      likesCount={item.likesCount}
      commentsCount={item.commentsCount}
      sharesCount={item.sharesCount}
      isLiked={item.isLiked}
      isSaved={item.isSaved}
      onUserPress={() => navigation?.navigate('UserProfile', { userId: item.user.id })}
      onLikePress={() => console.log('Like pressed')}
      onCommentPress={() => navigation?.navigate('PostDetail', { postId: item.id })}
      onSharePress={() => console.log('Share pressed')}
      onSavePress={() => console.log('Save pressed')}
      onOptionsPress={() => console.log('Options pressed')}
    />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Communauté</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation?.navigate('Search')}
            >
              <Ionicons name="search-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation?.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed */}
        <FlatList
          data={MOCK_POSTS}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.red}
            />
          }
          contentContainerStyle={styles.feedList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: layout.tabBarHeight + spacing[4] }} />}
        />

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation?.navigate('CreatePost')}
        >
          <LinearGradient
            colors={[colors.effects.gradients.primary[0], colors.effects.gradients.primary[1]]}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color={colors.text.primary} />
          </LinearGradient>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  headerTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h2,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.primary.red,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.neutral[100],
  },
  notificationCount: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: 10,
    color: colors.text.primary,
  },
  
  // Stories
  storiesSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    paddingBottom: spacing[3],
  },
  storiesList: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  
  // Tabs
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[3],
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    color: colors.text.muted,
  },
  tabTextActive: {
    fontFamily: typography.fonts.bodySemiBold,
    color: colors.text.primary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 3,
    backgroundColor: colors.primary.red,
    borderRadius: 2,
  },
  
  // Feed
  feedList: {
    paddingTop: spacing[3],
  },
  separator: {
    height: spacing[3],
  },
  
  // FAB
  fab: {
    position: 'absolute',
    bottom: layout.tabBarHeight + spacing[4],
    right: spacing[4],
    ...shadows.glow,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SocialFeedScreen;
