export type TicketTierId = 'youth' | 'general' | 'vip' | 'exhibitor';

export interface TicketTier {
  id: TicketTierId;
  name: string;
  tagline: string;
  priceZAR: number;
  totalCapacity: number;
  bookedCount: number;
  color: string;
  badge: string;
  features: string[];
  popular?: boolean;
}

export type PaymentStatus = 'paid' | 'pending_verification' | 'comp';
export type CheckInStatus = 'not_checked_in' | 'checked_in';

export interface Attendee {
  id: string; // e.g. EBG-7201
  fullName: string;
  email: string;
  phone: string;
  companyOrAffiliation: string;
  jobTitle?: string;
  area: string; // e.g. "Ennerdale Ext 3", "Finetown", "Mid-Ennerdale", "Lenasia South"
  tierId: TicketTierId;
  quantity: number;
  totalPaidZAR: number;
  paymentMethod: 'capitec_qr' | 'capitec_eft' | 'card_instant' | 'comp_pass';
  paymentReference: string;
  paymentStatus: PaymentStatus;
  checkInStatus: CheckInStatus;
  checkInTime?: string;
  dietaryPreference: string;
  registrationDate: string;
  notes?: string;
  qrPayload: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
  swiftCode?: string;
  paymentNoticeEmail: string;
  contactPhone: string;
  contactWhatsApp?: string;
}

export interface LocalInsightItem {
  id: string;
  title: string;
  category: 'Community Empowerment' | 'Tech Innovation' | 'Trade & Procurement' | 'Logistics & Venue';
  summary: string;
  highlight: string;
  iconName: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker: string;
  designation: string;
  description: string;
  type: 'keynote' | 'showcase' | 'panel' | 'networking' | 'ceremony';
}
