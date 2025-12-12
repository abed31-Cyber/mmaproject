/**
 * MMA Universe - Events Screen
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SectionList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { EventCard, Badge } from '@components/ui';
import { colors, typography, spacing, borders, layout } from '@theme/tokens';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_EVENTS = {
  live: [
    {
      id: 'live-1',
      title: 'UFC Fight Night',
      posterUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800',
      date: new Date(),
      venue: 'UFC Apex',
      city: 'Las Vegas',
      country: 'USA',
      mainEvent: { fighterA: 'Nicolau', fighterB: 'Kape' },
      isLive: true,
    },
  ],
  upcoming: [
    {
      id: 'up-1',
      title: 'UFC 300',
      posterUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
      date: new Date('2024-04-13T22:00:00'),
      venue: 'T-Mobile Arena',
      city: 'Las Vegas',
      country: 'USA',
      mainEvent: { fighterA: 'Alex Pereira', fighterB: 'Jamahal Hill' },
      isLive: false,
    },
    {
      id: 'up-2',
      title: 'UFC 301',
      posterUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=800',
      date: new Date('2024-05-04T22:00:00'),
      venue: 'Farmasi Arena',
      city: 'Rio de Janeiro',
      country: 'Brazil',
      mainEvent: { fighterA: 'Pantoja', fighterB: 'Erceg' },
      isLive: false,
    },
  ],
  past: [
    {
      id: 'past-1',
      title: 'UFC 299',
      posterUrl: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=800',
      date: new Date('2024-03-09T22:00:00'),
      venue: 'Kaseya Center',
      city: 'Miami',
      country: 'USA',
      mainEvent: { fighterA: "O'Malley", fighterB: 'Dvalishvili' },
      isLive: false,
    },
  ],
};

// =============================================================================
// CALENDAR VIEW
// =============================================================================

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: any[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onSelectDate, events }) => {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding for first week
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(selectedDate);
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const monthName = selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const hasEvent = (date: Date) => {
    return events.some(
      e => new Date(e.date).toDateString() === date.toDateString()
    );
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  return (
    <View style={calendarStyles.container}>
      {/* Month Header */}
      <View style={calendarStyles.header}>
        <TouchableOpacity
          onPress={() => onSelectDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={calendarStyles.monthTitle}>{monthName}</Text>
        <TouchableOpacity
          onPress={() => onSelectDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={calendarStyles.weekDays}>
        {weekDays.map((day) => (
          <Text key={day} style={calendarStyles.weekDay}>{day}</Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={calendarStyles.daysGrid}>
        {days.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              calendarStyles.day,
              isSelected(date) && calendarStyles.daySelected,
              isToday(date) && !isSelected(date) && calendarStyles.dayToday,
            ]}
            onPress={() => onSelectDate(date)}
          >
            <Text style={[
              calendarStyles.dayText,
              !isCurrentMonth(date) && calendarStyles.dayTextMuted,
              isSelected(date) && calendarStyles.dayTextSelected,
            ]}>
              {date.getDate()}
            </Text>
            {hasEvent(date) && (
              <View style={[
                calendarStyles.eventDot,
                isSelected(date) && calendarStyles.eventDotSelected,
              ]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const calendarStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.xl,
    padding: spacing[4],
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  monthTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    textTransform: 'capitalize',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: colors.primary.red,
    borderRadius: 20,
  },
  dayToday: {
    borderWidth: 1,
    borderColor: colors.primary.red,
    borderRadius: 20,
  },
  dayText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
  },
  dayTextMuted: {
    color: colors.text.muted,
  },
  dayTextSelected: {
    color: colors.text.primary,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary.red,
    position: 'absolute',
    bottom: 6,
  },
  eventDotSelected: {
    backgroundColor: colors.text.primary,
  },
});

// =============================================================================
// EVENTS SCREEN
// =============================================================================

interface EventsScreenProps {
  navigation?: any;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const allEvents = [
    ...MOCK_EVENTS.live,
    ...MOCK_EVENTS.upcoming,
    ...MOCK_EVENTS.past,
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const renderLiveEvent = (event: any) => (
    <TouchableOpacity
      key={event.id}
      style={styles.liveEventCard}
      onPress={() => navigation?.navigate('EventDetail', { id: event.id })}
    >
      <Image
        source={{ uri: event.posterUrl }}
        style={styles.liveEventImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(11, 11, 13, 0.9)']}
        style={styles.liveEventGradient}
      />
      
      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>EN DIRECT</Text>
      </View>
      
      <View style={styles.liveEventContent}>
        <Text style={styles.liveEventTitle}>{event.title}</Text>
        {event.mainEvent && (
          <Text style={styles.liveMainEvent}>
            {event.mainEvent.fighterA} vs {event.mainEvent.fighterB}
          </Text>
        )}
        <View style={styles.watchNowButton}>
          <Ionicons name="play-circle" size={20} color={colors.text.primary} />
          <Text style={styles.watchNowText}>Regarder maintenant</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = (event: any) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventListCard}
      onPress={() => navigation?.navigate('EventDetail', { id: event.id })}
    >
      <Image
        source={{ uri: event.posterUrl }}
        style={styles.eventListImage}
        contentFit="cover"
      />
      <View style={styles.eventListContent}>
        <Text style={styles.eventListTitle} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.eventListDate}>
          {new Date(event.date).toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </Text>
        <View style={styles.eventListMeta}>
          <Ionicons name="location-outline" size={12} color={colors.text.muted} />
          <Text style={styles.eventListLocation}>{event.city}, {event.country}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.muted} />
    </TouchableOpacity>
  );

  const FILTERS = [
    { id: 'all', label: 'Tout' },
    { id: 'upcoming', label: 'À venir' },
    { id: 'past', label: 'Passés' },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Événements</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.viewModeButton,
                viewMode === 'calendar' && styles.viewModeButtonActive,
              ]}
              onPress={() => setViewMode(v => v === 'list' ? 'calendar' : 'list')}
            >
              <Ionicons
                name={viewMode === 'list' ? 'calendar-outline' : 'list-outline'}
                size={22}
                color={viewMode === 'calendar' ? colors.text.primary : colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                activeFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(filter.id as any)}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === filter.id && styles.filterChipTextActive,
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.red}
            />
          }
        >
          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={allEvents}
            />
          )}

          {/* Live Events */}
          {MOCK_EVENTS.live.length > 0 && (activeFilter === 'all' || activeFilter === 'upcoming') && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.liveDotSmall} />
                  <Text style={styles.sectionTitle}>En direct</Text>
                </View>
              </View>
              {MOCK_EVENTS.live.map(renderLiveEvent)}
            </View>
          )}

          {/* Upcoming Events */}
          {(activeFilter === 'all' || activeFilter === 'upcoming') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>À venir</Text>
              {MOCK_EVENTS.upcoming.map(renderEventCard)}
            </View>
          )}

          {/* Past Events */}
          {(activeFilter === 'all' || activeFilter === 'past') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Événements passés</Text>
              {MOCK_EVENTS.past.map(renderEventCard)}
            </View>
          )}

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
  },
  viewModeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: colors.primary.red,
  },
  filtersContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  filterChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.full,
    backgroundColor: colors.neutral[100],
    marginRight: spacing[2],
  },
  filterChipActive: {
    backgroundColor: colors.primary.red,
  },
  filterChipText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h4,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  liveDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.red,
    marginRight: spacing[2],
  },
  
  // Live Event Card
  liveEventCard: {
    height: 200,
    borderRadius: layout.cardBorderRadius,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  liveEventImage: {
    ...StyleSheet.absoluteFillObject,
  },
  liveEventGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  liveBadge: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borders.radius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.primary,
    marginRight: spacing[1],
  },
  liveText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.badge,
    color: colors.text.primary,
    letterSpacing: 1,
  },
  liveEventContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: spacing[4],
  },
  liveEventTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  liveMainEvent: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  watchNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary.red,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.full,
  },
  watchNowText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.primary,
    marginLeft: spacing[1],
  },
  
  // Event List Card
  eventListCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: borders.radius.lg,
    padding: spacing[3],
    marginBottom: spacing[3],
  },
  eventListImage: {
    width: 70,
    height: 70,
    borderRadius: borders.radius.md,
  },
  eventListContent: {
    flex: 1,
    marginLeft: spacing[3],
  },
  eventListTitle: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  eventListDate: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.primary.red,
    marginTop: spacing[1],
  },
  eventListMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  eventListLocation: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.caption,
    color: colors.text.muted,
    marginLeft: spacing[1],
  },
});

export default EventsScreen;
