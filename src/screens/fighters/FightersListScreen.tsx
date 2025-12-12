/**
 * MMA Universe - Fighters List Screen
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchInput, FighterCard, Button, SkeletonList } from '@components/ui';
import { colors, typography, spacing, borders, layout } from '@theme/tokens';
import type { WeightClass, FighterListItem } from '@types';

// =============================================================================
// FILTER DATA
// =============================================================================

const WEIGHT_CLASSES: WeightClass[] = [
  'Heavyweight',
  'Light Heavyweight',
  'Middleweight',
  'Welterweight',
  'Lightweight',
  'Featherweight',
  'Bantamweight',
  'Flyweight',
  'Strawweight',
  "Women's Featherweight",
  "Women's Bantamweight",
  "Women's Flyweight",
  "Women's Strawweight",
];

const ORGANIZATIONS = ['UFC', 'Bellator', 'PFL', 'ONE Championship', 'RIZIN'];
const NATIONALITIES = ['USA', 'Brazil', 'Russia', 'Ireland', 'France', 'Nigeria', 'Australia'];

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_FIGHTERS: FighterListItem[] = [
  {
    id: '1',
    firstName: 'Jon',
    lastName: 'Jones',
    nickname: 'Bones',
    photoUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
    weightClass: 'Heavyweight',
    record: { wins: 27, losses: 1, draws: 0 },
    rank: 'C',
    isFollowing: true,
  },
  {
    id: '2',
    firstName: 'Islam',
    lastName: 'Makhachev',
    photoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    weightClass: 'Lightweight',
    record: { wins: 25, losses: 1, draws: 0 },
    rank: 'C',
    isFollowing: false,
  },
  {
    id: '3',
    firstName: 'Alex',
    lastName: 'Pereira',
    nickname: 'Poatan',
    photoUrl: 'https://images.unsplash.com/photo-1517438322307-e67111335449?w=400',
    weightClass: 'Light Heavyweight',
    record: { wins: 9, losses: 2, draws: 0 },
    rank: 'C',
    isFollowing: true,
  },
  {
    id: '4',
    firstName: 'Leon',
    lastName: 'Edwards',
    nickname: 'Rocky',
    photoUrl: 'https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?w=400',
    weightClass: 'Welterweight',
    record: { wins: 22, losses: 3, draws: 0 },
    rank: 'C',
    isFollowing: false,
  },
  {
    id: '5',
    firstName: 'Sean',
    lastName: "O'Malley",
    nickname: 'Sugar',
    photoUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
    weightClass: 'Bantamweight',
    record: { wins: 18, losses: 1, draws: 0 },
    rank: 'C',
    isFollowing: true,
  },
  {
    id: '6',
    firstName: 'Ilia',
    lastName: 'Topuria',
    nickname: 'El Matador',
    photoUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    weightClass: 'Featherweight',
    record: { wins: 15, losses: 0, draws: 0 },
    rank: 'C',
    isFollowing: false,
  },
];

// =============================================================================
// FILTER MODAL
// =============================================================================

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (filters: Filters) => void;
}

interface Filters {
  weightClasses: WeightClass[];
  organizations: string[];
  nationalities: string[];
  isChampionOnly: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApply,
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const toggleWeightClass = (wc: WeightClass) => {
    setLocalFilters(prev => ({
      ...prev,
      weightClasses: prev.weightClasses.includes(wc)
        ? prev.weightClasses.filter(w => w !== wc)
        : [...prev.weightClasses, wc],
    }));
  };

  const toggleOrganization = (org: string) => {
    setLocalFilters(prev => ({
      ...prev,
      organizations: prev.organizations.includes(org)
        ? prev.organizations.filter(o => o !== org)
        : [...prev.organizations, org],
    }));
  };

  const resetFilters = () => {
    setLocalFilters({
      weightClasses: [],
      organizations: [],
      nationalities: [],
      isChampionOnly: false,
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={filterStyles.container}>
        <View style={filterStyles.header}>
          <Text style={filterStyles.title}>Filtres</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={filterStyles.content}>
          {/* Weight Classes */}
          <View style={filterStyles.section}>
            <Text style={filterStyles.sectionTitle}>Catégorie de poids</Text>
            <View style={filterStyles.chipContainer}>
              {WEIGHT_CLASSES.map((wc) => (
                <TouchableOpacity
                  key={wc}
                  style={[
                    filterStyles.chip,
                    localFilters.weightClasses.includes(wc) && filterStyles.chipActive,
                  ]}
                  onPress={() => toggleWeightClass(wc)}
                >
                  <Text style={[
                    filterStyles.chipText,
                    localFilters.weightClasses.includes(wc) && filterStyles.chipTextActive,
                  ]}>
                    {wc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Organizations */}
          <View style={filterStyles.section}>
            <Text style={filterStyles.sectionTitle}>Organisation</Text>
            <View style={filterStyles.chipContainer}>
              {ORGANIZATIONS.map((org) => (
                <TouchableOpacity
                  key={org}
                  style={[
                    filterStyles.chip,
                    localFilters.organizations.includes(org) && filterStyles.chipActive,
                  ]}
                  onPress={() => toggleOrganization(org)}
                >
                  <Text style={[
                    filterStyles.chipText,
                    localFilters.organizations.includes(org) && filterStyles.chipTextActive,
                  ]}>
                    {org}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Champion Only */}
          <View style={filterStyles.section}>
            <TouchableOpacity
              style={filterStyles.toggleRow}
              onPress={() => setLocalFilters(prev => ({ 
                ...prev, 
                isChampionOnly: !prev.isChampionOnly 
              }))}
            >
              <Text style={filterStyles.toggleText}>Champions uniquement</Text>
              <View style={[
                filterStyles.toggle,
                localFilters.isChampionOnly && filterStyles.toggleActive,
              ]}>
                {localFilters.isChampionOnly && (
                  <View style={filterStyles.toggleDot} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={filterStyles.footer}>
          <Button
            title="Réinitialiser"
            variant="ghost"
            size="large"
            onPress={resetFilters}
            style={{ flex: 1, marginRight: spacing[2] }}
          />
          <Button
            title="Appliquer"
            variant="primary"
            size="large"
            gradient
            onPress={handleApply}
            style={{ flex: 1, marginLeft: spacing[2] }}
          />
        </View>
      </View>
    </Modal>
  );
};

const filterStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  title: {
    fontFamily: typography.fonts.headingSemiBold,
    fontSize: typography.sizes.h3,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing[4],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borders.radius.full,
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.neutral[300],
  },
  chipActive: {
    backgroundColor: colors.primary.red,
    borderColor: colors.primary.red,
  },
  chipText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: colors.text.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  toggleText: {
    fontFamily: typography.fonts.bodyMedium,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral[300],
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleActive: {
    backgroundColor: colors.primary.red,
    alignItems: 'flex-end',
  },
  toggleDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
});

// =============================================================================
// FIGHTERS LIST SCREEN
// =============================================================================

interface FightersListScreenProps {
  navigation?: any;
}

export const FightersListScreen: React.FC<FightersListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Filters>({
    weightClasses: [],
    organizations: [],
    nationalities: [],
    isChampionOnly: false,
  });

  const filteredFighters = useMemo(() => {
    let result = MOCK_FIGHTERS;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        f =>
          f.firstName.toLowerCase().includes(query) ||
          f.lastName.toLowerCase().includes(query) ||
          f.nickname?.toLowerCase().includes(query)
      );
    }

    // Weight class filter
    if (filters.weightClasses.length > 0) {
      result = result.filter(f => filters.weightClasses.includes(f.weightClass));
    }

    // Champion filter
    if (filters.isChampionOnly) {
      result = result.filter(f => f.rank === 'C');
    }

    return result;
  }, [searchQuery, filters]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.weightClasses.length > 0) count++;
    if (filters.organizations.length > 0) count++;
    if (filters.nationalities.length > 0) count++;
    if (filters.isChampionOnly) count++;
    return count;
  }, [filters]);

  const renderFighter = ({ item }: { item: FighterListItem }) => (
    <FighterCard
      id={item.id}
      name={`${item.firstName} ${item.lastName}`}
      nickname={item.nickname}
      imageUrl={item.photoUrl}
      weightClass={item.weightClass}
      record={item.record}
      isFollowing={item.isFollowing}
      onPress={() => navigation?.navigate('FighterDetail', { id: item.id })}
      onFollowPress={() => console.log('Follow', item.id)}
      style={viewMode === 'list' ? styles.fighterListItem : styles.fighterGridItem}
    />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Combattants</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.viewModeButton}
              onPress={() => setViewMode(v => (v === 'grid' ? 'list' : 'grid'))}
            >
              <Ionicons
                name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
                size={22}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Filter Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchInputContainer}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Rechercher un combattant..."
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilterCount > 0 && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={activeFilterCount > 0 ? colors.text.primary : colors.text.secondary}
            />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>
            {filteredFighters.length} combattant{filteredFighters.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Fighters List */}
        {isLoading ? (
          <SkeletonList type="fighter" count={4} />
        ) : (
          <FlatList
            data={filteredFighters}
            renderItem={renderFighter}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 1 : 1}
            key={viewMode}
            horizontal={viewMode === 'grid'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              viewMode === 'grid' ? styles.gridContent : styles.listContent
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary.red}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={colors.text.muted} />
                <Text style={styles.emptyText}>Aucun combattant trouvé</Text>
                <Text style={styles.emptySubtext}>
                  Essayez avec d'autres termes de recherche
                </Text>
              </View>
            }
          />
        )}

        {/* Filter Modal */}
        <FilterModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onApply={setFilters}
        />
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
  viewModeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  searchInputContainer: {
    flex: 1,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: layout.inputBorderRadius,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary.red,
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: 10,
    color: colors.primary.dark,
  },
  resultsBar: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  resultsCount: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
  },
  gridContent: {
    paddingHorizontal: spacing[4],
  },
  listContent: {
    paddingHorizontal: spacing[4],
  },
  fighterGridItem: {
    marginRight: spacing[4],
  },
  fighterListItem: {
    width: '100%',
    marginBottom: spacing[4],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[16],
  },
  emptyText: {
    fontFamily: typography.fonts.bodySemiBold,
    fontSize: typography.sizes.body,
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  emptySubtext: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
});

export default FightersListScreen;
