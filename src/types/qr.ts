export interface QRCodeData {
    id: string;
    type: QRType;
    content: string;
    title?: string;
    createdAt: Date;
    customization: QRCustomization;
  }
  
  export type QRType = 
    | 'text'
    | 'url' 
    | 'email'
    | 'phone'
    | 'sms'
    | 'wifi'
    | 'contact'
    | 'event'
    | 'location';
  
  export interface QRCustomization {
    size: number;
    backgroundColor: string;
    foregroundColor: string;
    logo?: string;
    borderRadius?: number;
    gradientType?: 'none' | 'linear' | 'radial';
    gradientColors?: string[];
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }
  
  export interface ContactData {
    firstName: string;
    lastName: string;
    organization?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  }
  
  export interface WifiData {
    ssid: string;
    password: string;
    security: 'WPA' | 'WEP' | 'nopass';
    hidden?: boolean;
  }
  
  export interface EventData {
    title: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    allDay?: boolean;
  }
  
  export interface LocationData {
    latitude: number;
    longitude: number;
    query?: string;
  }
  
  export interface ScanResult {
    id: string;
    type: string;
    data: string;
    scannedAt: Date;
    action?: 'opened' | 'copied' | 'saved';
  }
  
  export interface QRTemplate {
    id: string;
    name: string;
    description: string;
    type: QRType;
    customization: QRCustomization;
    isDefault: boolean;
    isPremium: boolean;
  }