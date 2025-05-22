import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  Clipboard,
  Dimensions,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScanResult(data);
    
    // Haptic feedback would be nice here
    Alert.alert(
      'QR Code Scanned!',
      `Type: ${type}\nData: ${data}`,
      [
        { text: 'Scan Again', onPress: () => setScanned(false) },
        { text: 'Copy', onPress: () => handleCopy(data) },
        { text: 'Open', onPress: () => handleOpen(data) },
      ]
    );
  };

  const handleCopy = async (data: string) => {
    await Clipboard.setStringAsync(data);
    Alert.alert('Copied!', 'QR code content copied to clipboard');
    setScanned(false);
  };

  const handleOpen = async (data: string) => {
    try {
      if (data.startsWith('http://') || data.startsWith('https://')) {
        await Linking.openURL(data);
      } else if (data.startsWith('mailto:')) {
        await Linking.openURL(data);
      } else if (data.startsWith('tel:')) {
        await Linking.openURL(data);
      } else if (data.startsWith('sms:')) {
        await Linking.openURL(data);
      } else {
        // For other types, just copy to clipboard
        await Clipboard.setStringAsync(data);
        Alert.alert('Copied!', 'QR code content copied to clipboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open the QR code content');
    }
    setScanned(false);
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  const resetScan = () => {
    setScanned(false);
    setScanResult(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-off" size={64} color={colors.textSecondary} />
        <Text style={styles.errorTitle}>Camera Permission Required</Text>
        <Text style={styles.errorText}>
          Please grant camera access to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.permissionButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
        flashMode={flashOn ? 'torch' : 'off'}
      />
      
      {/* Scanning Overlay */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={styles.overlayTop}>
          <Text style={styles.instructionText}>
            Point your camera at a QR code to scan
          </Text>
        </View>

        {/* Scanning frame */}
        <View style={styles.scanFrame}>
          <View style={styles.scanFrameCorner} />
          <View style={[styles.scanFrameCorner, styles.topRight]} />
          <View style={[styles.scanFrameCorner, styles.bottomLeft]} />
          <View style={[styles.scanFrameCorner, styles.bottomRight]} />
          
          {scanned && (
            <View style={styles.scanSuccess}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
              <Text style={styles.scanSuccessText}>Scanned!</Text>
            </View>
          )}
        </View>

        {/* Bottom controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, flashOn && styles.controlButtonActive]}
            onPress={toggleFlash}
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={24}
              color={flashOn ? colors.warning : colors.onPrimary}
            />
            <Text style={styles.controlButtonText}>Flash</Text>
          </TouchableOpacity>

          {scanned && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={resetScan}
            >
              <Ionicons name="refresh" size={24} color={colors.onPrimary} />
              <Text style={styles.controlButtonText}>Scan Again</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => {/* Add gallery picker functionality */}}
          >
            <Ionicons name="image" size={24} color={colors.onPrimary} />
            <Text style={styles.controlButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Result Panel */}
      {scanResult && (
        <View style={styles.resultPanel}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Scan Result</Text>
            <TouchableOpacity onPress={() => setScanResult(null)}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.resultText} numberOfLines={3}>
            {scanResult}
          </Text>
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={() => handleCopy(scanResult)}
            >
              <Ionicons name="copy" size={16} color={colors.primary} />
              <Text style={styles.resultButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={() => handleOpen(scanResult)}
            >
              <Ionicons name="open" size={16} color={colors.primary} />
              <Text style={styles.resultButtonText}>Open</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  overlayTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingTop: 60,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  scanFrame: {
    alignSelf: 'center',
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    left: 'auto',
    top: 'auto',
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanSuccess: {
    alignItems: 'center',
  },
  scanSuccessText: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    paddingBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  controlButtonText: {
    color: colors.onPrimary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  resultPanel: {
    position: 'absolute',
    bottom: 100,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  resultTitle: {
    ...typography.h3,
    fontSize: 16,
  },
  resultText: {
    ...typography.body,
    marginBottom: spacing.md,
    color: colors.textSecondary,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resultButtonText: {
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: '500',
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
});