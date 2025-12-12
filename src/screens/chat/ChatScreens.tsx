/**
 * MMA Universe - Chat Screens
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { Avatar } from '@components/ui';
import { ChatBubble, ConversationItem } from '@components/social';
import { colors, typography, spacing, borders, layout, shadows } from '@theme/tokens';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    user: {
      id: 'u1',
      name: 'John Fighter',
      avatarUrl: 'https://images.unsplash.com/photo-1583473848882-f9a5bc1dcdc0?w=100',
      isOnline: true,
    },
    lastMessage: {
      content: 'Tu as vu le KO de Pereira ? Incroyable !',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
    unreadCount: 2,
  },
  {
    id: 'c2',
    user: {
      id: 'u2',
      name: 'MMA Group',
      avatarUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=100',
      isOnline: false,
    },
    lastMessage: {
      content: 'Pierre: Qui regarde UFC 300 ce week-end ?',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
    },
    unreadCount: 0,
    isGroup: true,
    memberCount: 12,
  },
  {
    id: 'c3',
    user: {
      id: 'u3',
      name: 'Coach Martinez',
      avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=100',
      isOnline: true,
      isVerified: true,
    },
    lastMessage: {
      content: 'L\'entraînement de demain commence à 18h',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
    },
    unreadCount: 0,
  },
  {
    id: 'c4',
    user: {
      id: 'u4',
      name: 'Sarah MMA',
      avatarUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=100',
      isOnline: false,
    },
    lastMessage: {
      content: 'Merci pour le conseil de grappling 🙏',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true,
    },
    unreadCount: 0,
  },
];

const MOCK_MESSAGES = [
  {
    id: 'm1',
    content: 'Salut ! Tu as vu le combat hier soir ?',
    senderId: 'u1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'm2',
    content: 'Oui ! Le KO de Pereira était incroyable 😱',
    senderId: 'me',
    createdAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
  },
  {
    id: 'm3',
    content: 'Cette gauche était parfaitement placée. Hill ne l\'a jamais vue venir.',
    senderId: 'u1',
    createdAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
  },
  {
    id: 'm4',
    content: 'Exactement ! Et sa technique de counter est vraiment impeccable. Je pense qu\'il est le meilleur striker du UFC en ce moment.',
    senderId: 'me',
    createdAt: new Date(Date.now() - 1.7 * 60 * 60 * 1000),
  },
  {
    id: 'm5',
    content: 'Difficile de contester ça. 3 titres dans 2 organisations différentes, c\'est historique.',
    senderId: 'u1',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'm6',
    content: 'Tu penses qu\'il va monter chez les Heavyweight ?',
    senderId: 'u1',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: 'm7',
    content: 'Ce serait fou mais je ne crois pas. Il est parfait à 205.',
    senderId: 'me',
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: 'm8',
    content: 'Tu as vu le KO de Pereira ? Incroyable !',
    senderId: 'u1',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
];

// =============================================================================
// CONVERSATIONS LIST SCREEN
// =============================================================================

interface ConversationsScreenProps {
  navigation?: any;
}

export const ConversationsScreen: React.FC<ConversationsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = MOCK_CONVERSATIONS.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }: { item: typeof MOCK_CONVERSATIONS[0] }) => (
    <ConversationItem
      id={item.id}
      user={item.user}
      lastMessage={item.lastMessage.content}
      timestamp={formatTime(item.lastMessage.createdAt)}
      unreadCount={item.unreadCount}
      isGroup={item.isGroup}
      onPress={() => navigation?.navigate('ChatRoom', { conversationId: item.id, user: item.user })}
    />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation?.navigate('NewConversation')}
            >
              <Ionicons name="create-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Ionicons name="search-outline" size={20} color={colors.text.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une conversation..."
              placeholderTextColor={colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Online Contacts */}
        <View style={styles.onlineSection}>
          <FlatList
            horizontal
            data={MOCK_CONVERSATIONS.filter(c => c.user.isOnline)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.onlineContact}
                onPress={() => navigation?.navigate('ChatRoom', { conversationId: item.id, user: item.user })}
              >
                <View style={styles.onlineAvatarWrapper}>
                  <Avatar
                    imageUrl={item.user.avatarUrl}
                    name={item.user.name}
                    size={56}
                    showOnline
                    isOnline={true}
                  />
                </View>
                <Text style={styles.onlineName} numberOfLines={1}>
                  {item.user.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.onlineList}
          />
        </View>

        {/* Conversations List */}
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.red}
            />
          }
          contentContainerStyle={styles.conversationsList}
          ListFooterComponent={<View style={{ height: layout.tabBarHeight + spacing[4] }} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={colors.text.muted} />
              <Text style={styles.emptyTitle}>Aucune conversation</Text>
              <Text style={styles.emptySubtitle}>
                Commencez une conversation avec d'autres fans de MMA
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

// =============================================================================
// CHAT ROOM SCREEN
// =============================================================================

interface ChatRoomScreenProps {
  route?: { params: { conversationId: string; user: any } };
  navigation?: any;
}

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ route, navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const user = route?.params?.user || {
    id: 'u1',
    name: 'John Fighter',
    avatarUrl: 'https://images.unsplash.com/photo-1583473848882-f9a5bc1dcdc0?w=100',
    isOnline: true,
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `m${messages.length + 1}`,
      content: message.trim(),
      senderId: 'me',
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item, index }: { item: typeof MOCK_MESSAGES[0]; index: number }) => {
    const isOwn = item.senderId === 'me';
    const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== item.senderId);
    const showTime = index === messages.length - 1 || 
      messages[index + 1].senderId !== item.senderId ||
      new Date(messages[index + 1].createdAt).getTime() - new Date(item.createdAt).getTime() > 5 * 60 * 1000;

    return (
      <View style={[
        chatStyles.messageRow,
        isOwn && chatStyles.messageRowOwn,
      ]}>
        {!isOwn && (
          <View style={chatStyles.avatarSpace}>
            {showAvatar && (
              <Avatar
                imageUrl={user.avatarUrl}
                name={user.name}
                size={32}
              />
            )}
          </View>
        )}
        <View style={chatStyles.messageBubbleWrapper}>
          <ChatBubble
            content={item.content}
            isOwn={isOwn}
            timestamp={showTime ? formatTime(item.createdAt) : undefined}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        {/* Header */}
        <View style={chatStyles.header}>
          <TouchableOpacity
            style={chatStyles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={chatStyles.userInfo}
            onPress={() => navigation?.navigate('UserProfile', { userId: user.id })}
          >
            <Avatar
              imageUrl={user.avatarUrl}
              name={user.name}
              size={40}
              showOnline
              isOnline={user.isOnline}
            />
            <View style={chatStyles.userTextInfo}>
              <Text style={chatStyles.userName}>{user.name}</Text>
              <Text style={chatStyles.userStatus}>
                {user.isOnline ? 'En ligne' : 'Hors ligne'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={chatStyles.headerActions}>
            <TouchableOpacity style={chatStyles.headerButton}>
              <Ionicons name="call-outline" size={22} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={chatStyles.headerButton}>
              <Ionicons name="videocam-outline" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={chatStyles.headerButton}>
              <Ionicons name="ellipsis-vertical" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={chatStyles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={chatStyles.inputContainer}>
            <TouchableOpacity style={chatStyles.attachButton}>
              <Ionicons name="add-circle-outline" size={28} color={colors.text.secondary} />
            </TouchableOpacity>
            
            <View style={chatStyles.textInputWrapper}>
              <TextInput
                style={chatStyles.textInput}
                placeholder="Message..."
                placeholderTextColor={colors.text.muted}
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity style={chatStyles.emojiButton}>
                <Ionicons name="happy-outline" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {message.trim() ? (
              <TouchableOpacity style={chatStyles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={22} color={colors.text.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={chatStyles.micButton}>
                <Ionicons name="mic-outline" size={26} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
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
  },
  searchContainer: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.lg,
    paddingHorizontal: spacing[3],
    height: 44,
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  onlineSection: {
    marginBottom: spacing[3],
  },
  onlineList: {
    paddingHorizontal: spacing[4],
  },
  onlineContact: {
    alignItems: 'center',
    marginRight: spacing[4],
    width: 64,
  },
  onlineAvatarWrapper: {
    marginBottom: spacing[1],
  },
  onlineName: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  conversationsList: {
    paddingHorizontal: spacing[4],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[12],
  },
  emptyTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  emptySubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.muted,
    marginTop: spacing[2],
    textAlign: 'center',
    paddingHorizontal: spacing[8],
  },
});

const chatStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing[1],
  },
  userTextInfo: {
    marginLeft: spacing[3],
  },
  userName: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  userStatus: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    padding: spacing[4],
    paddingBottom: spacing[2],
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  messageRowOwn: {
    justifyContent: 'flex-end',
  },
  avatarSpace: {
    width: 40,
    marginRight: spacing[2],
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageBubbleWrapper: {
    maxWidth: '75%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    gap: spacing[2],
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 40,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    maxHeight: 100,
  },
  emojiButton: {
    marginLeft: spacing[2],
    paddingBottom: 2,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { ConversationsScreen as default };
