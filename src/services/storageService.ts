import { Order, OrderStatus, AppSettings } from '../types/order';

const STORAGE_KEY = 'nexora_orders_data_v1';
const SETTINGS_KEY = 'nexora_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'د.ل',
  storeName: 'NEXORA',
  ownerName: 'المدير',
};

export const storageService = {
  // Get all orders from localStorage
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Failed to read orders from localStorage:', error);
      return [];
    }
  },

  // Save list of orders
  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      // Dispatch custom event so all active views update in sync
      window.dispatchEvent(new Event('nexora_orders_updated'));
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error);
    }
  },

  // Generate next sequential order number (NX-1001, NX-1002, etc.)
  getNextOrderNumber(): string {
    const orders = this.getOrders();
    if (orders.length === 0) {
      return 'NX-1001';
    }

    let highestNum = 1000;
    orders.forEach((order) => {
      const match = order.id.match(/NX-(\d+)/i);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > highestNum) {
          highestNum = num;
        }
      }
    });

    return `NX-${highestNum + 1}`;
  },

  // Add a new order
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'remainingAmount'> & { remainingAmount?: number }): Order {
    const orders = this.getOrders();
    const id = this.getNextOrderNumber();
    const now = new Date().toISOString();

    const price = Number(orderData.price) || 0;
    const paidAmount = Number(orderData.paidAmount) || 0;
    const remainingAmount = price - paidAmount;

    const newOrder: Order = {
      ...orderData,
      id,
      price,
      paidAmount,
      remainingAmount: remainingAmount < 0 ? 0 : remainingAmount,
      createdAt: now,
      updatedAt: now,
    };

    orders.unshift(newOrder); // Newest first
    this.saveOrders(orders);
    return newOrder;
  },

  // Update an existing order
  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const current = orders[index];
    const updatedPrice = updates.price !== undefined ? Number(updates.price) : current.price;
    const updatedPaid = updates.paidAmount !== undefined ? Number(updates.paidAmount) : current.paidAmount;
    const updatedRemaining = updatedPrice - updatedPaid;

    const updatedOrder: Order = {
      ...current,
      ...updates,
      price: updatedPrice,
      paidAmount: updatedPaid,
      remainingAmount: updatedRemaining < 0 ? 0 : updatedRemaining,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    this.saveOrders(orders);
    return updatedOrder;
  },

  // Quick status update
  updateOrderStatus(id: string, newStatus: OrderStatus): Order | null {
    return this.updateOrder(id, { status: newStatus });
  },

  // Delete an order
  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length !== orders.length) {
      this.saveOrders(filtered);
      return true;
    }
    return false;
  },

  // Get settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(data);
      if (parsed && (parsed.currency === 'ر.س' || !parsed.currency || parsed.currency === 'SAR')) {
        parsed.currency = 'د.ل';
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  // Save settings
  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new Event('nexora_settings_updated'));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Export all data as JSON
  exportData(): string {
    const orders = this.getOrders();
    const settings = this.getSettings();
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      store: 'NEXORA',
      settings,
      orders,
    };
    return JSON.stringify(payload, null, 2);
  },

  // Import JSON data
  importData(jsonString: string): { success: boolean; count: number; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.orders)) {
        return { success: false, count: 0, error: 'صيغة الملف غير صحيحة. يجب أن يحتوي على قائمة orders.' };
      }

      this.saveOrders(data.orders);
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      return { success: true, count: data.orders.length };
    } catch (err) {
      return { success: false, count: 0, error: (err as Error).message || 'فشل في قراءة ملف النسخة الاحتياطية' };
    }
  },

  // Clear all
  clearAllOrders(): void {
    this.saveOrders([]);
  },

  // Optional sample orders helper (for owner testing only if desired)
  loadSampleOrders(): void {
    const samples: Order[] = [
      {
        id: 'NX-1001',
        customerName: 'محمد الفيتوري',
        phone: '0912345678',
        city: 'طرابلس',
        productName: 'كرسي ألعاب NEXORA Titan Pro RGB',
        details: 'جلد أسود مع تطريز برتقالي، مساند ذراع 4D، وسادة رأس قطنية',
        price: 1350,
        paidAmount: 500,
        remainingAmount: 850,
        notes: 'الزبون يرغب بالتسليم في طرابلس (النوفليين) بعد العصر',
        status: 'preparing',
        category: 'كراسي قيمنق (Gaming Chairs)',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'NX-1002',
        customerName: 'أحمد الورفلي',
        phone: '0928765432',
        city: 'بنغازي',
        productName: 'كرت شاشة RTX 4070 Ti Super 16GB',
        details: 'إصدار OC Gaming، جديد بتغليف المصنع مع الضمان',
        price: 3600,
        paidAmount: 3600,
        remainingAmount: 0,
        notes: 'تم الدفع بالكامل عبر تداول / سداد - إرسال عبر شركة توصيل إلى بنغازي',
        status: 'ready',
        category: 'كروت شاشة (Graphics Cards)',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'NX-1003',
        customerName: 'عمر المصراتي',
        phone: '0945678901',
        city: 'مصراتة',
        productName: 'شاشة قيمنق OLED 27 بوصة 240Hz',
        details: 'دقة 2K QHD، زمن استجابة 0.03ms، مع حامل هيدروليك هدية',
        price: 2850,
        paidAmount: 1000,
        remainingAmount: 1850,
        notes: 'الاتصال قبل التوصيل للتأكيد على العنوان في مصراتة',
        status: 'new',
        category: 'شاشات قيمنق (Gaming Monitors)',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];

    this.saveOrders(samples);
  },
};
