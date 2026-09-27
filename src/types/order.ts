export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string; // e.g. "NX-1001"
  customerName: string;
  phone: string;
  city: string;
  productName: string;
  details: string;
  price: number;
  paidAmount: number;
  remainingAmount: number;
  notes: string;
  status: OrderStatus;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  category?: string;
}

export interface AppSettings {
  currency: string;
  storeName: string;
  ownerName: string;
}

export interface StatusConfig {
  key: OrderStatus;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  dotColor: string;
  gradient: string;
}

export const ORDER_STATUSES: Record<OrderStatus, StatusConfig> = {
  new: {
    key: 'new',
    label: 'جديد',
    description: 'تم استلام الطلب وبانتظار بدء التجهيز',
    color: '#ff8c38',
    badgeBg: 'rgba(234, 88, 12, 0.12)',
    badgeText: '#ff8c38',
    borderColor: 'rgba(234, 88, 12, 0.4)',
    dotColor: '#ea580c',
    gradient: 'from-orange-500 to-amber-500',
  },
  preparing: {
    key: 'preparing',
    label: 'قيد التجهيز',
    description: 'يتم تجهيز القطع وتجميعها وتغليفها',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeText: '#fbbf24',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    dotColor: '#f59e0b',
    gradient: 'from-amber-500 to-yellow-500',
  },
  ready: {
    key: 'ready',
    label: 'جاهز',
    description: 'الطلب جاهز للاستلام أو في انتظار مندوب الشحن',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeText: '#34d399',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    dotColor: '#10b981',
    gradient: 'from-emerald-500 to-teal-500',
  },
  delivered: {
    key: 'delivered',
    label: 'تم التسليم',
    description: 'تم تسليم الطلب للزبون بنجاح واستلام المستحقات',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    badgeText: '#22d3ee',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    dotColor: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-500',
  },
  cancelled: {
    key: 'cancelled',
    label: 'ملغي',
    description: 'طلب ملغي من قِبل الزبون أو تم استرجاعه',
    color: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.12)',
    badgeText: '#f87171',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    dotColor: '#ef4444',
    gradient: 'from-red-500 to-rose-600',
  },
};

export const COMMON_CITIES = [
  'طرابلس',
  'بنغازي',
  'مصراتة',
  'الزاوية',
  'زليتن',
  'الخمس',
  'البيضاء',
  'طبرق',
  'سبها',
  'درنة',
  'سرت',
  'صبراتة',
  'صرمان',
  'غريان',
  'المرج',
  'أجدابيا',
  'زوارة',
  'بني وليد',
  'تاجورة',
  'جنزور',
  'ترهونة',
  'يفرن',
  'نالوت',
  'الكفرة',
  'شحات',
  'مسلاتة',
  'أخرى',
];

export const POPULAR_GAMING_CATEGORIES = [
  'كراسي قيمنق (Gaming Chairs)',
  'كروت شاشة (Graphics Cards)',
  'معالجات وتجميعات PC',
  'شاشات قيمنق (Gaming Monitors)',
  'لوحات مفاتيح ميكانيكية (Keyboards)',
  'ماوسات وبادات احترافية (Mice & Pads)',
  'سماعات قيمنق (Headsets)',
  'طاولات وإضاءات RGB',
  'إكسسوارات ومشتتات',
];
