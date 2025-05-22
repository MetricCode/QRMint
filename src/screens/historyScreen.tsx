import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';
import { QRCodeData, ScanResult } from '../types/qr';

interface HistoryItem {
  id: string;
  type: 'generated' | 'scanned';
  title: string;
  subtitle: string;
  content: string;
  date: Date;
  qrType?: string;
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'generated' | 'scanned'>('all');
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const generatedQRs = await AsyncStorage.getItem('generated_qrs') || '[]';
      const scannedQRs = await AsyncStorage.getItem('scanned_qrs') || '[]';
      
      const generated: QRCodeData[] = JSON.parse(generatedQRs);
      const scanned: ScanResult[] = JSON.parse(scannedQRs);

      const allItems: HistoryItem[] = [
        ...generated.map(item => ({
          id: item.id,
          type: 'generated' as const,
          title: item.title || getTypeLabel(item.type),
          subtitle: formatDate(new Date(item.createdAt)),
          content: item.content,
          date: new Date(item.createdAt),
          qrType: item.type,
        })),
        ...scanned.map(item => ({
          id: item.id,
          type: 'scanned' as const,
          title: 'Scanned QR Code',
          subtitle: formatDate(new Date(item.scannedAt)),
          content: item.data,
          date: new Date(item.scannedAt),
          qrType: item.type,
        }))
      ];

      // Sort by date (newest first)
      allItems.sort((a, b) => b.date.getTime() - a.date.getTime());
      setHistoryItems(allItems);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const getTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      text: 'Text',
      url: 'Website',
      email: 'Email',
      phone: 'Phone',
      sms: 'SMS',
      wifi: 'WiFi',
      contact: 'Contact',
      event: 'Event',
      location: 'Location',
    };
    return labels[type] || 'QR Code';
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getFilteredItems = (): HistoryItem[] => {
    if (activeTab === 'all') return historyItems;
    return historyItems.filter(item => item.type === activeTab);
  };

  const deleteItem = async (itemId: string, itemType: 'generated' | 'scanned') => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const storageKey = itemType === 'generated' ? 'generated_qrs' : 'scanned_qrs';
              const existing = await AsyncStorage.getItem(storageKey) || '[]';
              const items = JSON.parse(existing);
              const filtered = items.filter((item: any) => item.id !== itemId);
              await AsyncStorage.setItem(storageKey, JSON.stringify(filtered));
              loadHistory();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to clear all history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('generated_qrs');
              await AsyncStorage.removeItem('scanned_qrs');
              setHistoryItems([]);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity style={styles.historyItem} activeOpacity={0.7}>
      <View style={styles.itemIcon}>
        <Ionicons
          name={item.type === 'generated' ? 'qr-code' : 'scan'}
          size={24}
          color={item.type === 'generated' ? colors.primary : colors.secondary}
        />
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        <Text style={styles.itemText} numberOfLines={2}>
          {item.content}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id, item.type)}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="time-outline" size={64} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No History Yet</Text>
      <Text style={styles.emptyText}>
        Your generated and scanned QR codes will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'all', label: 'All', count: historyItems.length },
          { key: 'generated', label: 'Generated', count: historyItems.filter(i => i.type === 'generated').length },
          { key: 'scanned', label: 'Scanned', count: historyItems.filter(i => i.type === 'scanned').length },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
            <Text
              style={[
                styles.tabCount,
                activeTab === tab.key && styles.activeTabCount,
              ]}
            >
              {tab.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* History List */}
      <FlatList
        data={getFilteredItems()}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />

      {/* Clear All Button */}
      {historyItems.length > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllHistory}
          >
            <Ionicons name="trash" size={16} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear All History</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: 12,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.onPrimary,
  },
  tabCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activeTabCount: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    ...typography.caption,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  itemText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.sm,
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomActions: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  clearButtonText: {
    color: colors.error,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
});