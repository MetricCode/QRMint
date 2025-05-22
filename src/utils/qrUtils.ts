import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRCodeData, ScanResult, ContactData, WifiData, EventData, LocationData } from '../types/qr';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format content based on QR type
export const formatQRContent = (type: string, content: string): string => {
  switch (type) {
    case 'email':
      return content.startsWith('mailto:') ? content : `mailto:${content}`;
    case 'phone':
      return content.startsWith('tel:') ? content : `tel:${content}`;
    case 'sms':
      return content.startsWith('sms:') ? content : `sms:${content}`;
    case 'url':
      if (!content.startsWith('http://') && !content.startsWith('https://')) {
        return `https://${content}`;
      }
      return content;
    default:
      return content;
  }
};

// Generate WiFi QR content
export const generateWifiQR = (data: WifiData): string => {
  const { ssid, password, security, hidden } = data;
  const hiddenFlag = hidden ? 'H:true' : '';
  return `WIFI:T:${security};S:${ssid};P:${password};${hiddenFlag};`;
};

// Generate Contact (vCard) QR content
export const generateContactQR = (data: ContactData): string => {
  const { firstName, lastName, organization, phone, email, website, address } = data;
  
  let vcard = 'BEGIN:VCARD\n';
  vcard += 'VERSION:3.0\n';
  vcard += `FN:${firstName} ${lastName}\n`;
  if (organization) vcard += `ORG:${organization}\n`;
  if (phone) vcard += `TEL:${phone}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (website) vcard += `URL:${website}\n`;
  if (address) vcard += `ADR:;;${address};;;;\n`;
  vcard += 'END:VCARD';
  
  return vcard;
};

// Generate Event (iCal) QR content
export const generateEventQR = (data: EventData): string => {
  const { title, description, location, startDate, endDate, allDay } = data;
  
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  let ical = 'BEGIN:VCALENDAR\n';
  ical += 'VERSION:2.0\n';
  ical += 'BEGIN:VEVENT\n';
  ical += `SUMMARY:${title}\n`;
  if (description) ical += `DESCRIPTION:${description}\n`;
  if (location) ical += `LOCATION:${location}\n`;
  ical += `DTSTART:${formatDate(startDate)}\n`;
  if (endDate) ical += `DTEND:${formatDate(endDate)}\n`;
  ical += 'END:VEVENT\n';
  ical += 'END:VCALENDAR';
  
  return ical;
};

// Generate Location QR content
export const generateLocationQR = (data: LocationData): string => {
  const { latitude, longitude, query } = data;
  if (query) {
    return `geo:${latitude},${longitude}?q=${encodeURIComponent(query)}`;
  }
  return `geo:${latitude},${longitude}`;
};

// Save generated QR to storage
export const saveGeneratedQR = async (qrData: QRCodeData): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem('generated_qrs') || '[]';
    const qrs: QRCodeData[] = JSON.parse(existing);
    qrs.unshift(qrData); // Add to beginning
    
    // Keep only last 50 items
    const limited = qrs.slice(0, 50);
    await AsyncStorage.setItem('generated_qrs', JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving generated QR:', error);
    throw error;
  }
};

// Save scanned QR to storage
export const saveScanResult = async (scanResult: ScanResult): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem('scanned_qrs') || '[]';
    const scans: ScanResult[] = JSON.parse(existing);
    scans.unshift(scanResult); // Add to beginning
    
    // Keep only last 50 items
    const limited = scans.slice(0, 50);
    await AsyncStorage.setItem('scanned_qrs', JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }
};

// Get QR type from scanned content
export const detectQRType = (content: string): string => {
  if (content.startsWith('http://') || content.startsWith('https://')) {
    return 'url';
  }
  if (content.startsWith('mailto:')) {
    return 'email';
  }
  if (content.startsWith('tel:')) {
    return 'phone';
  }
  if (content.startsWith('sms:')) {
    return 'sms';
  }
  if (content.startsWith('WIFI:')) {
    return 'wifi';
  }
  if (content.startsWith('BEGIN:VCARD')) {
    return 'contact';
  }
  if (content.startsWith('BEGIN:VCALENDAR')) {
    return 'event';
  }
  if (content.startsWith('geo:')) {
    return 'location';
  }
  return 'text';
};

// Parse WiFi QR content
export const parseWifiQR = (content: string): WifiData | null => {
  try {
    const match = content.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);(H:([^;]*))?/);
    if (!match) return null;
    
    return {
      security: match[1] as 'WPA' | 'WEP' | 'nopass',
      ssid: match[2],
      password: match[3],
      hidden: match[5] === 'true',
    };
  } catch {
    return null;
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

// Validate phone number format
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Get default QR customization
export const getDefaultCustomization = () => ({
  size: 200,
  backgroundColor: '#FFFFFF',
  foregroundColor: '#000000',
  errorCorrectionLevel: 'M' as const,
  borderRadius: 0,
  gradientType: 'none' as const,
});

// Color validation
export const isValidColor = (color: string): boolean => {
  const colorRegex = /^#([0-9A-F]{3}){1,2}$/i;
  return colorRegex.test(color);
};

// Generate filename for QR code
export const generateQRFilename = (type: string, timestamp: Date): string => {
  const dateStr = timestamp.toISOString().split('T')[0];
  const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
  return `QR_${type}_${dateStr}_${timeStr}.png`;
};