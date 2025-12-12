/**
 * MMA Universe - Social Feed Components
 * Posts, commentaires, bulles de chat
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Avatar } from '../ui/Avatar';
import { colors, typography, spacing, borders, shadows } from '@theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================================================
// POST COMPONENT
// =============================================================================

interface PostProps {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
  };
  content: string;
  media?: Array<{
    type: 'image' | 'video';
    url: string;
  }>;
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  createdAt: Date;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onUserPress?: () => void;
  style?: ViewStyle;
}

export const Post: React.FC<PostProps> = ({
  user,
  content,
  media,
  likes,
  comments,
  shares,
  isLiked = false,
  createdAt,
  onPress,
  onLike,
  onComment,
  onShare,
  onUserPress,
  style,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <TouchableOpacity 
      style={[styles.postContainer, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={onUserPress} style={styles.postUserInfo}>
          <Avatar source={user.avatar} name={user.name} size="medium" />
          <View style={styles.postUserText}>
            <View style={styles.postUserNameRow}>
              <Text style={styles.postUserName}>{user.name}</Text>
              {user.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.primary.red} />
              )}
            </View>
            <Text style={styles.postUsername}>@{user.username} · {formatDate(createdAt)}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.postContent}>{content}</Text>

      {/* Media */}
      {media && media.length > 0 && (
        <View style={styles.postMedia}>
          {media.length === 1 ? (
            <Image
              source={{ uri: media[0].url }}
              style={styles.postSingleImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.postMediaGrid}>
              {media.slice(0, 4).map((item, index) => (
                <Image
                  key={index}
                  source={{ uri: item.url }}
                  style={[
                    styles.postGridImage,
                    media.length === 2 && styles.postGridImage2,
                    media.length === 3 && index === 0 && styles.postGridImage3First,
                    media.length === 4 && styles.postGridImage4,
                  ]}
                  contentFit="cover"
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postAction} onPress={handleLike}>
          <Ionicons 
            name={liked ? 'heart' : 'heart-outline'} 
            size={22} 
            color={liked ? colors.primary.red : colors.text.secondary} 
          />
          <Text style={[styles.postActionText, liked && styles.postActionTextActive]}>
            {formatNumber(likeCount)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.postAction} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.postActionText}>{formatNumber(comments)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.postAction} onPress={onShare}>
          <Ionicons name="share-outline" size={22} color={colors.text.secondary} />
          <Text style={styles.postActionText}>{formatNumber(shares)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="bookmark-outline" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// COMMENT COMPONENT
// =============================================================================

interface CommentProps {
  id: string;
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: Date;
  onLike?: () => void;
  onReply?: () => void;
  style?: ViewStyle;
}

export const Comment: React.FC<CommentProps> = ({
  user,
  content,
  likes,
  isLiked = false,
  createdAt,
  onLike,
  onReply,
  style,
}) => {
  const formatDate = (date: Date) => {
    const hours = Math.floor((new Date().getTime() - new Date(date).getTime()) / 3600000);
    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}j`;
  };

  return (
    <View style={[styles.commentContainer, style]}>
      <Avatar source={user.avatar} name={user.name} size="small" />
      <View style={styles.commentContent}>
        <View style={styles.commentBubble}>
          <Text style={styles.commentUserName}>{user.name}</Text>
          <Text style={styles.commentText}>{content}</Text>
        </View>
        <View style={styles.commentActions}>
          <Text style={styles.commentTime}>{formatDate(createdAt)}</Text>
          <TouchableOpacity onPress={onLike}>
            <Text style={[styles.commentActionText, isLiked && styles.commentActionActive]}>
              {likes > 0 && `${likes} `}J'aime
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onReply}>
            <Text style={styles.commentActionText}>Répondre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// =============================================================================
// CHAT BUBBLE
// =============================================================================

interface ChatBubbleProps {
  content: string;
  isOwn?: boolean;
  time: Date;
  isRead?: boolean;
  attachment?: {
    type: 'image' | 'gif';
    url: string;
  };
  style?: ViewStyle;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  content,
  isOwn = false,
  time,
  isRead = false,
  attachment,
  style,
}) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[
      styles.chatBubbleContainer,
      isOwn ? styles.chatBubbleOwn : styles.chatBubbleOther,
      style,
    ]}>
      {attachment && (
        <Image
          source={{ uri: attachment.url }}
          style={styles.chatAttachment}
          contentFit="cover"
        />
      )}
      {content && (
        <View style={[
          styles.chatBubble,
          isOwn ? styles.chatBubbleOwnBg : styles.chatBubbleOtherBg,
        ]}>
          <Text style={[
            styles.chatText,
            isOwn && styles.chatTextOwn,
          ]}>
            {content}
          </Text>
        </View>
      )}
      <View style={styles.chatMeta}>
        <Text style={styles.chatTime}>{formatTime(time)}</Text>
        {isOwn && (
          <Ionicons 
            name={isRead ? 'checkmark-done' : 'checkmark'} 
            size={14} 
            color={isRead ? colors.primary.red : colors.text.muted} 
          />
        )}
      </View>
    </View>
  );
};

// =============================================================================
// CONVERSATION ITEM
// =============================================================================

interface ConversationItemProps {
  id: string;
  user: {
    name: string;
    avatar?: string;
    isOnline?: boolean;
  };
  lastMessage: string;
  time: Date;
  unreadCount?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  user,
  lastMessage,
  time,
  unreadCount = 0,
  onPress,
  style,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / 86400000);
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return messageDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <TouchableOpacity 
      style={[styles.conversationItem, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar 
        source={user.avatar} 
        name={user.name} 
        size="large" 
        showOnline 
        isOnline={user.isOnline}
      />
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{user.name}</Text>
          <Text style={[
            styles.conversationTime,
            unreadCount > 0 && styles.conversationTimeUnread
          ]}>
            {formatTime(time)}
          </Text>
        </View>
        <View style={styles.conversationFooter}>
          <Text 
            style={[
              styles.conversationMessage,
              unreadCount > 0 && styles.conversationMessageUnread
            ]} 
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  // Post
  postContainer: {
    backgroundColor: colors.neutral[100],
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postUserText: {
    marginLeft: spacing[3],
  },
  postUserNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  postUserName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  postUsername: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  moreButton: {
    padding: spacing[2],
  },
  postContent: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing[3],
  },
  postMedia: {
    marginBottom: spacing[3],
    borderRadius: borders.radius.lg,
    overflow: 'hidden',
  },
  postSingleImage: {
    width: '100%',
    height: 200,
    borderRadius: borders.radius.lg,
  },
  postMediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postGridImage: {
    width: '49%',
    height: 120,
  },
  postGridImage2: {
    width: '49.5%',
    height: 150,
  },
  postGridImage3First: {
    width: '100%',
    height: 150,
  },
  postGridImage4: {
    width: '49%',
    height: 100,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing[2],
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[2],
  },
  postActionText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  postActionTextActive: {
    color: colors.primary.red,
  },

  // Comment
  commentContainer: {
    flexDirection: 'row',
    padding: spacing[3],
    gap: spacing[2],
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: colors.neutral[200],
    padding: spacing[3],
    borderRadius: borders.radius.lg,
    borderTopLeftRadius: borders.radius.sm,
  },
  commentUserName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  commentText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginTop: spacing[2],
    marginLeft: spacing[2],
  },
  commentTime: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  commentActionText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
  },
  commentActionActive: {
    color: colors.primary.red,
  },

  // Chat Bubble
  chatBubbleContainer: {
    marginVertical: spacing[1],
    maxWidth: '80%',
  },
  chatBubbleOwn: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  chatBubbleOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  chatBubble: {
    padding: spacing[3],
    borderRadius: borders.radius.xl,
    maxWidth: '100%',
  },
  chatBubbleOwnBg: {
    backgroundColor: colors.primary.red,
    borderBottomRightRadius: borders.radius.sm,
  },
  chatBubbleOtherBg: {
    backgroundColor: colors.neutral[200],
    borderBottomLeftRadius: borders.radius.sm,
  },
  chatText: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  chatTextOwn: {
    color: colors.text.primary,
  },
  chatAttachment: {
    width: 200,
    height: 150,
    borderRadius: borders.radius.lg,
    marginBottom: spacing[1],
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  chatTime: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },

  // Conversation Item
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: colors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  conversationContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  conversationName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  conversationTime: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  conversationTimeUnread: {
    color: colors.primary.red,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationMessage: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  conversationMessageUnread: {
    fontFamily: typography.fonts.bodyMedium,
    color: colors.text.primary,
  },
  unreadBadge: {
    backgroundColor: colors.primary.red,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[1],
    marginLeft: spacing[2],
  },
  unreadText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: 11,
    color: colors.text.primary,
  },
});
