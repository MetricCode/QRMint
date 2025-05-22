import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';
import { QRType } from '../types/qr';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.6;

export default function GenerateScreen() {
  const [selectedType, setSelectedType] = useState<QRType>('text');
  const [content, setContent] = useState('');
  const [qrColor, setQrColor] = useState(colors.primary);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isGenerating, setIsGenerating] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const qrTypes = [
    { type: 'text' as QRType, label: 'Text', icon: 'text' },
    { type: 'url' as QRType, label: 'Website', icon: 'link' },
    { type: 'email' as QRType, label: 'Email', icon: 'mail' },
    { type: 'phone' as QRType, label: 'Phone', icon: 'call' },
    { type: 'sms' as QRType, label: 'SMS', icon: 'chatbox' },
    { type: 'wifi' as QRType, label: 'WiFi', icon: 'wifi' },
  ];

  const colorOptions = [
    colors.primary,
    colors.secondary,
    '#000000',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#06b6d4',
  ];

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'text':
        return 'Enter your text here...';
      case 'url':
        return 'https://example.com';
      case 'email':
        return 'example@email.com';
      case 'phone':
        return '+1234567890';
      case 'sms':
        return 'Hello! This is a message.';
      case 'wifi':
        return 'WIFI:T:WPA;S:NetworkName;P:Password;;';
      default:
        return 'Enter content...';
    }
  };

  const formatContent = () => {
    switch (selectedType) {
      case 'email':
        return `mailto:${content}`;
      case 'phone':
        return `tel:${content}`;
      case 'sms':
        return `sms:${content}`;
      default:
        return content;
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content to generate QR code');
      return;
    }

    setIsGenerating(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant photo library access to save QR codes');
        return;
      }

      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Success', 'QR code saved to photo library!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content to generate QR code');
      return;
    }

    setIsGenerating(true);
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* QR Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QR Code Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
            {qrTypes.map((type) => (
              <TouchableOpacity
                key={type.type}
                style={[
                  styles.typeButton,
                  selectedType === type.type && styles.typeButtonActive,
                ]}
                onPress={() => setSelectedType(type.type)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={20}
                  color={selectedType === type.type ? colors.onPrimary : colors.primary}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === type.type && styles.typeButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <TextInput
            style={styles.textInput}
            placeholder={getPlaceholder()}
            value={content}
            onChangeText={setContent}
            multiline={selectedType === 'text' || selectedType === 'sms'}
            numberOfLines={selectedType === 'text' || selectedType === 'sms' ? 4 : 1}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* QR Code Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.qrContainer}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
              <View style={[styles.qrWrapper, { backgroundColor }]}>
                {content.trim() ? (
                  <QRCode
                    value={formatContent()}
                    size={QR_SIZE}
                    color={qrColor}
                    backgroundColor={backgroundColor}
                    logo={{ uri: undefined }}
                    logoSize={QR_SIZE * 0.2}
                    logoBackgroundColor="transparent"
                  />
                ) : (
                  <View style={[styles.qrPlaceholder, { width: QR_SIZE, height: QR_SIZE }]}>
                    <Ionicons name="qr-code-outline" size={80} color={colors.textSecondary} />
                    <Text style={styles.placeholderText}>Enter content to generate QR code</Text>
                  </View>
                )}
              </View>
            </ViewShot>
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QR Code Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorSelector}>
            {colorOptions.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color },
                  qrColor === color && styles.colorButtonActive,
                ]}
                onPress={() => setQrColor(color)}
              >
                {qrColor === color && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Background Color Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorSelector}>
            {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8'].map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  { backgroundColor: color, borderWidth: color === '#FFFFFF' ? 1 : 0, borderColor: colors.border },
                  backgroundColor === color && styles.colorButtonActive,
                ]}
                onPress={() => setBackgroundColor(color)}
              >
                {backgroundColor === color && (
                  <Ionicons name="checkmark" size={16} color={color === '#FFFFFF' ? colors.primary : 'white'} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
            disabled={isGenerating || !content.trim()}
          >
            <Ionicons name="download" size={20} color="white" />
            <Text style={styles.actionButtonText}>Save to Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
            disabled={isGenerating || !content.trim()}
          >
            <Ionicons name="share" size={20} color="white" />
            <Text style={styles.actionButtonText}>Share</Text>
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
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
  },
  typeButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    ...typography.body,
    marginLeft: spacing.xs,
    color: colors.primary,
  },
  typeButtonTextActive: {
    color: colors.onPrimary,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlignVertical: 'top',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrWrapper: {
    padding: spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  placeholderText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: QR_SIZE * 0.8,
  },
  colorSelector: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorButtonActive: {
    borderWidth: 3,
    borderColor: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginHorizontal: spacing.xs,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  shareButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: 16,
  },
});