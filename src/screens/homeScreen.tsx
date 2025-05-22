import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const quickActions = [
    {
      id: 'generate',
      title: 'Generate QR',
      subtitle: 'Create custom QR codes',
      icon: 'qr-code',
      color: colors.primary,
      action: () => navigation.navigate('Generate'),
    },
    {
      id: 'scan',
      title: 'Scan QR',
      subtitle: 'Scan any QR code instantly',
      icon: 'scan',
      color: colors.secondary,
      action: () => navigation.navigate('Scan'),
    },
  ];

  const features = [
    {
      icon: 'color-palette',
      title: 'Custom Design',
      description: 'Beautiful colors and gradients',
    },
    {
      icon: 'download',
      title: 'Save & Share',
      description: 'Export in high quality',
    },
    {
      icon: 'shield-checkmark',
      title: 'Secure Scanning',
      description: 'Safe and reliable detection',
    },
    {
      icon: 'flash',
      title: 'Lightning Fast',
      description: 'Instant generation and scanning',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>QR Master</Text>
          <Text style={styles.subtitle}>
            Create beautiful QR codes and scan them with ease
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { borderColor: action.color }]}
              onPress={action.action}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={32} color="white" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('History')}
          >
            <Ionicons name="time" size={24} color={colors.primary} />
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>View History</Text>
              <Text style={styles.historySubtitle}>
                Access your recent QR codes and scans
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    width: (width - spacing.lg * 3) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    ...typography.caption,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    width: (width - spacing.lg * 3) / 2,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    ...typography.h3,
    fontSize: 16,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.caption,
    fontSize: 12,
  },
  historyButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  historyTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  historySubtitle: {
    ...typography.caption,
  },
});