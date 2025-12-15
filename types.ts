export enum Tab {
  SCHEDULE = 'schedule',
  BOOKINGS = 'bookings',
  EXPENSES = 'expenses',
  MEMBERS = 'members',
  JOURNAL = 'journal',
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  type: 'spot' | 'food' | 'transport' | 'hotel';
  description: string;
  lat?: number;
  lng?: number;
  aiTips?: string; 
}

export interface DayPlan {
  date: string;
  dayLabel: string;
  weather: {
    condition: 'sunny' | 'cloudy' | 'rain' | 'sakura';
    temp: string;
  };
  items: ScheduleItem[];
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  amountJpy?: number;
  paidBy: string; // User ID
  splitWith: string[]; // Array of User IDs
  category: 'food' | 'transport' | 'ticket' | 'stay' | 'other';
  date: string;
  createdAt?: any;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  lastLocation?: string;
  lastSeen?: any;
}

export interface JournalEntry {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  photoUrl?: string;
  date: string; // Display string
  timestamp: any;
}

export interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'ticket';
  title: string;
  refNumber: string;
  date: string;
  time?: string;
  details: string;
  isPrivate?: boolean;
}
