# QRMint - React Native QR Code Generator & Scanner

A beautiful, feature-rich QR code generator and scanner app built with React Native and Expo.

## Features

### 🎨 QR Code Generation
- **Multiple QR Types**: Text, URL, Email, Phone, SMS, WiFi, Contact (vCard), Events (iCal), Location
- **Custom Design**: Choose colors, gradients, and backgrounds
- **High Quality**: Export in high resolution for printing
- **Templates**: Pre-designed templates for quick generation
- **Batch Generation**: Create multiple QR codes at once (Premium)

### 📱 QR Code Scanning
- **Fast Scanning**: Instant QR code detection
- **Multiple Actions**: Copy, open, save, or share scanned content
- **Flash Support**: Built-in flashlight for low-light scanning
- **Gallery Import**: Scan QR codes from photos
- **History**: Keep track of all scanned codes

### 📊 Smart Features
- **Type Detection**: Automatically detects QR content type
- **History Management**: Organized history with filtering
- **Offline Support**: Works without internet connection
- **Data Validation**: Smart validation for emails, URLs, phones
- **Export Options**: Save to gallery or share directly

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation 6
- **UI Components**: React Native Paper
- **QR Generation**: react-native-qrcode-svg
- **QR Scanning**: expo-barcode-scanner
- **Storage**: AsyncStorage for local data
- **Icons**: Expo Vector Icons (Ionicons)

## Installation

### Prerequisites
- Node.js 16+ 
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd qr-master-app
npm install
```

2. **Start Development Server**
```bash
npm start
# or
expo start
```

3. **Run on Device/Simulator**
```bash
# iOS
npm run ios

# Android  
npm run android

# Web (for testing)
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── constants/          # Theme, colors, typography
├── navigation/         # Navigation configuration
├── screens/           # Main app screens
│   ├── HomeScreen.tsx
│   ├── GenerateScreen.tsx
│   ├── ScanScreen.tsx
│   └── HistoryScreen.tsx
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

## Key Files

- `App.tsx` - Main app component with providers
- `src/navigation/MainNavigator.tsx` - Tab navigation setup
- `src/constants/theme.ts` - Design system (colors, typography, spacing)
- `src/types/qr.ts` - TypeScript interfaces for QR data
- `src/utils/qrUtils.ts` - QR generation and parsing utilities

## Permissions

The app requires the following permissions:

### iOS (`app.json`)
- `NSCameraUsageDescription` - Camera access for QR scanning
- `NSPhotoLibraryUsageDescription` - Photo library access for saving QR codes

### Android (`app.json`)
- `android.permission.CAMERA` - Camera access for QR scanning
- `android.permission.WRITE_EXTERNAL_STORAGE` - Storage access for saving
- `android.permission.READ_EXTERNAL_STORAGE` - Storage access for reading

## Building for Production

### Android APK
```bash
expo build:android
# or for EAS Build
eas build --platform android
```

### iOS IPA
```bash
expo build:ios
# or for EAS Build  
eas build --platform ios
```

## Monetization Strategy

### Freemium Model
**Free Tier:**
- Basic QR generation (6 types)
- Standard colors and templates
- Basic scanning functionality
- Limited history (25 items)

**Premium Tier ($2.99/month):**
- All QR types including WiFi, vCard, iCal
- Custom gradients and advanced design options
- Batch QR generation
- Unlimited history
- High-resolution exports
- Analytics and insights

**Business Tier ($9.99/month):**
- Dynamic QR codes (requires backend)
- Team collaboration features
- Advanced analytics dashboard
- API access
- White-label options

## Roadmap

### Phase 1 (MVP) ✅
- [x] Basic QR generation and scanning
- [x] Core UI and navigation
- [x] Local storage and history
- [x] Essential QR types (text, URL, email, phone)

### Phase 2 (Enhanced Features)
- [ ] Advanced QR types (WiFi, vCard, iCal, Location)
- [ ] Custom design templates
- [ ] Batch generation
- [ ] Enhanced scanning with gallery import
- [ ] Export/import functionality

### Phase 3 (Premium Features)
- [ ] User authentication
- [ ] Cloud sync
- [ ] Dynamic QR codes (requires backend)
- [ ] Analytics dashboard
- [ ] Team collaboration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@qrmaster.app or create an issue on GitHub.

---

Built with ❤️ using React Native and Expo