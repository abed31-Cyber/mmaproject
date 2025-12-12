/**
 * MMA Universe - Create Post Screen
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@components/ui';
import { colors, typography, spacing, borders, layout } from '@theme/tokens';

// =============================================================================
// CREATE POST SCREEN
// =============================================================================

interface CreatePostScreenProps {
  navigation?: any;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const currentUser = {
    name: 'Utilisateur',
    username: 'user123',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100',
  };

  const canPost = content.trim().length > 0 || images.length > 0;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Veuillez autoriser l\'accès à la galerie pour ajouter des images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4 - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, 4));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    if (!canPost) return;

    setIsPosting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigation?.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de publier le post. Veuillez réessayer.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation?.goBack()}
            >
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Nouveau post</Text>
            <TouchableOpacity
              style={[
                styles.postButton,
                !canPost && styles.postButtonDisabled,
              ]}
              onPress={handlePost}
              disabled={!canPost || isPosting}
            >
              <Text style={[
                styles.postButtonText,
                !canPost && styles.postButtonTextDisabled,
              ]}>
                {isPosting ? 'Publication...' : 'Publier'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Info */}
            <View style={styles.userSection}>
              <Avatar
                imageUrl={currentUser.avatarUrl}
                name={currentUser.name}
                size={48}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <TouchableOpacity style={styles.visibilityButton}>
                  <Ionicons name="earth-outline" size={14} color={colors.text.secondary} />
                  <Text style={styles.visibilityText}>Public</Text>
                  <Ionicons name="chevron-down" size={14} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Text Input */}
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="Partagez votre passion pour le MMA..."
              placeholderTextColor={colors.text.muted}
              multiline
              value={content}
              onChangeText={setContent}
              autoFocus
              maxLength={500}
            />

            {/* Character Count */}
            <Text style={[
              styles.charCount,
              content.length > 450 && styles.charCountWarning,
              content.length >= 500 && styles.charCountError,
            ]}>
              {content.length}/500
            </Text>

            {/* Image Preview */}
            {images.length > 0 && (
              <View style={styles.imageGrid}>
                {images.map((uri, index) => (
                  <View
                    key={index}
                    style={[
                      styles.imageWrapper,
                      images.length === 1 && styles.imageWrapperSingle,
                      images.length === 2 && styles.imageWrapperDouble,
                      images.length === 3 && index === 0 && styles.imageWrapperTriple,
                    ]}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.previewImage}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Mention Suggestions */}
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Suggestions</Text>
              <View style={styles.suggestionTags}>
                {['#UFC300', '#MMA', '#KnockOut', '#Pereira', '#Hill'].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.suggestionTag}
                    onPress={() => setContent(prev => `${prev} ${tag}`)}
                  >
                    <Text style={styles.suggestionTagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <View style={styles.mediaActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePickImage}
                disabled={images.length >= 4}
              >
                <Ionicons
                  name="image-outline"
                  size={24}
                  color={images.length >= 4 ? colors.text.muted : colors.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="camera-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="videocam-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="location-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="at-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="happy-outline" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// =============================================================================
// POST DETAIL SCREEN
// =============================================================================

interface PostDetailScreenProps {
  route?: { params: { postId: string } };
  navigation?: any;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({ route, navigation }) => {
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const post = {
    id: route?.params?.postId || 'p1',
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
  };

  const comments = [
    {
      id: 'c1',
      user: {
        name: 'MMAfan1',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100',
        isVerified: false,
      },
      content: 'Pereira par KO au 2e round, je le sens ! 🔥',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      likesCount: 45,
    },
    {
      id: 'c2',
      user: {
        name: 'FightExpert',
        avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100',
        isVerified: true,
      },
      content: 'Hill a les outils pour gagner mais Pereira est juste sur un autre niveau en ce moment.',
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      likesCount: 128,
    },
    {
      id: 'c3',
      user: {
        name: 'BrazilianFan',
        avatarUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100',
        isVerified: false,
      },
      content: 'CHAMA! 🇧🇷🔥 Poatan unstoppable!',
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
      likesCount: 89,
    },
  ];

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}j`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <TouchableOpacity style={styles.closeButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Content */}
          <View style={detailStyles.postContainer}>
            {/* Post Header */}
            <View style={detailStyles.postHeader}>
              <Avatar
                imageUrl={post.user.avatarUrl}
                name={post.user.name}
                size={48}
              />
              <View style={detailStyles.postUserInfo}>
                <View style={detailStyles.nameRow}>
                  <Text style={detailStyles.userName}>{post.user.name}</Text>
                  {post.user.isVerified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.primary.red} />
                  )}
                </View>
                <Text style={detailStyles.userHandle}>@{post.user.username}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.muted} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <Text style={detailStyles.postContent}>{post.content}</Text>

            {/* Images */}
            {post.images.length > 0 && (
              <View style={detailStyles.imageContainer}>
                <Image
                  source={{ uri: post.images[0] }}
                  style={detailStyles.postImage}
                  contentFit="cover"
                />
              </View>
            )}

            {/* Timestamp */}
            <Text style={detailStyles.timestamp}>
              {post.createdAt.toLocaleDateString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>

            {/* Stats */}
            <View style={detailStyles.stats}>
              <Text style={detailStyles.statText}>
                <Text style={detailStyles.statNumber}>{post.likesCount.toLocaleString()}</Text> J'aime
              </Text>
              <Text style={detailStyles.statText}>
                <Text style={detailStyles.statNumber}>{post.commentsCount.toLocaleString()}</Text> Commentaires
              </Text>
              <Text style={detailStyles.statText}>
                <Text style={detailStyles.statNumber}>{post.sharesCount.toLocaleString()}</Text> Partages
              </Text>
            </View>

            {/* Actions */}
            <View style={detailStyles.actions}>
              <TouchableOpacity
                style={detailStyles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? colors.primary.red : colors.text.secondary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={detailStyles.actionButton}>
                <Ionicons name="chatbubble-outline" size={22} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={detailStyles.actionButton}>
                <Ionicons name="share-outline" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={detailStyles.actionButton}>
                <Ionicons name="bookmark-outline" size={22} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Section */}
          <View style={detailStyles.commentsSection}>
            <Text style={detailStyles.commentsTitle}>Commentaires</Text>
            {comments.map((comment) => (
              <View key={comment.id} style={detailStyles.comment}>
                <Avatar
                  imageUrl={comment.user.avatarUrl}
                  name={comment.user.name}
                  size={40}
                />
                <View style={detailStyles.commentContent}>
                  <View style={detailStyles.commentBubble}>
                    <View style={detailStyles.commentHeader}>
                      <Text style={detailStyles.commentUserName}>{comment.user.name}</Text>
                      {comment.user.isVerified && (
                        <Ionicons name="checkmark-circle" size={12} color={colors.primary.red} />
                      )}
                    </View>
                    <Text style={detailStyles.commentText}>{comment.content}</Text>
                  </View>
                  <View style={detailStyles.commentMeta}>
                    <Text style={detailStyles.commentTime}>{formatTime(comment.createdAt)}</Text>
                    <TouchableOpacity>
                      <Text style={detailStyles.commentAction}>J'aime ({comment.likesCount})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Text style={detailStyles.commentAction}>Répondre</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={detailStyles.commentInputContainer}>
            <Avatar
              imageUrl="https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100"
              name="User"
              size={36}
            />
            <TextInput
              style={detailStyles.commentInput}
              placeholder="Ajouter un commentaire..."
              placeholderTextColor={colors.text.muted}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              style={[
                detailStyles.sendButton,
                !commentText.trim() && detailStyles.sendButtonDisabled,
              ]}
              disabled={!commentText.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={commentText.trim() ? colors.primary.red : colors.text.muted}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
  },
  postButton: {
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.full,
  },
  postButtonDisabled: {
    backgroundColor: colors.neutral[200],
  },
  postButtonText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  postButtonTextDisabled: {
    color: colors.text.muted,
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  userInfo: {
    marginLeft: spacing[3],
  },
  userName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  visibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.full,
    marginTop: spacing[1],
    gap: spacing[1],
  },
  visibilityText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
  textInput: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    paddingHorizontal: spacing[4],
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    textAlign: 'right',
    paddingHorizontal: spacing[4],
    marginTop: spacing[2],
  },
  charCountWarning: {
    color: colors.status.warning,
  },
  charCountError: {
    color: colors.status.error,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing[4],
    gap: spacing[2],
  },
  imageWrapper: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapperSingle: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  imageWrapperDouble: {
    width: '48%',
    aspectRatio: 1,
  },
  imageWrapperTriple: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
  },
  suggestions: {
    padding: spacing[4],
  },
  suggestionsTitle: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
    marginBottom: spacing[2],
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  suggestionTag: {
    backgroundColor: colors.neutral[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.full,
  },
  suggestionTagText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.primary.red,
  },
  bottomActions: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  mediaActions: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const detailStyles = StyleSheet.create({
  postContainer: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  postUserInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  userName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  userHandle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
  },
  postContent: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    lineHeight: 26,
    marginBottom: spacing[3],
  },
  imageContainer: {
    borderRadius: borders.radius.xl,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  postImage: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  timestamp: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
    marginBottom: spacing[3],
  },
  stats: {
    flexDirection: 'row',
    gap: spacing[4],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  statText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.muted,
  },
  statNumber: {
    fontFamily: typography.fonts.bodySemiBold,
    color: colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing[3],
  },
  actionButton: {
    padding: spacing[2],
  },
  commentsSection: {
    padding: spacing[4],
  },
  commentsTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  comment: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  commentContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  commentBubble: {
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.lg,
    padding: spacing[3],
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginBottom: spacing[1],
  },
  commentUserName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
  },
  commentText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    gap: spacing[4],
  },
  commentTime: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  commentAction: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.neutral[100],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing[3],
  },
  commentInput: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    backgroundColor: colors.primary.dark,
    borderRadius: borders.radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  sendButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default CreatePostScreen;
