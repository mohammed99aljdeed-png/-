import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { OrdersView } from './components/OrdersView';
import { AnalyticsView } from './components/AnalyticsView';
import { OrderModal } from './components/OrderModal';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { SettingsModal } from './components/SettingsModal';
import { Order, OrderStatus, ORDER_STATUSES, AppSettings } from './types/order';
import { storageService } from './services/storageService';
import brandBackdrop from './assets/images/nexora_brand_backdrop_1790481335103.jpg';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  // Orders & Settings State from LocalStorage
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [initialStatusFilter, setInitialStatusFilter] = useState<OrderStatus | undefined>(undefined);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Responsive Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Reload orders handler
  const reloadOrders = useCallback(() => {
    const updated = storageService.getOrders();
    setOrders(updated);
  }, []);

  // Sync with storage changes across tabs or custom dispatch
  useEffect(() => {
    const handleStorageUpdate = () => {
      reloadOrders();
    };

    const handleSettingsUpdate = () => {
      setSettings(storageService.getSettings());
    };

    window.addEventListener('nexora_orders_updated', handleStorageUpdate);
    window.addEventListener('nexora_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('nexora_orders_updated', handleStorageUpdate);
      window.removeEventListener('nexora_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [reloadOrders]);

  // Handle Quick Status Change
  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = storageService.updateOrderStatus(orderId, newStatus);
    if (updated) {
      reloadOrders();
      const statusLabel = ORDER_STATUSES[newStatus]?.label || newStatus;
      showToast(`تم تغيير حالة الطلب ${orderId} إلى: ${statusLabel}`);
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder(updated);
      }
    }
  };

  // Handle Order Saved (Created or Edited)
  const handleOrderSaved = (savedOrder: Order) => {
    reloadOrders();
    const isEdit = Boolean(orderToEdit);
    showToast(
      isEdit
        ? `تم تحديث بيانات الطلب ${savedOrder.id} بنجاح`
        : `تم إضافة الطلب الجديد ${savedOrder.id} بنجاح`
    );
    setOrderToEdit(null);
  };

  // Handle Order Deleted
  const handleDeleteOrder = (orderId: string) => {
    const success = storageService.deleteOrder(orderId);
    if (success) {
      reloadOrders();
      showToast(`تم حذف الطلب ${orderId} نهائياً`, 'info');
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder(null);
      }
    }
  };

  // Navigate to Orders Tab with optional status filter
  const handleNavigateToOrders = (filterStatus?: OrderStatus) => {
    setInitialStatusFilter(filterStatus);
    setCurrentTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Edit Modal
  const handleOpenEdit = (order: Order) => {
    setOrderToEdit(order);
    setIsAddModalOpen(true);
  };

  // Calculate badge counts
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans relative selection:bg-orange-500 selection:text-white" dir="rtl">
      {/* Ambient Backdrop Image & Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
        <img
          src={brandBackdrop}
          alt=""
          className="w-full h-full object-cover object-center filter blur-xl scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
      </div>

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-zinc-900/95 text-orange-300 border-orange-500/40 shadow-orange-950/40'
                : toast.type === 'error'
                ? 'bg-zinc-900/95 text-red-300 border-red-500/40 shadow-red-950/40'
                : 'bg-zinc-900/95 text-zinc-200 border-zinc-700 shadow-black/50'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-zinc-400 shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'orders') {
            setInitialStatusFilter(undefined);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAddModal={() => {
          setOrderToEdit(null);
          setIsAddModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        ordersCount={orders.length}
        newOrdersCount={newOrdersCount}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
          isSidebarCollapsed ? 'lg:mr-[76px]' : 'lg:mr-64'
        }`}
      >
        {/* Top Header */}
        <Header
          title={
            currentTab === 'dashboard'
              ? 'لوحة التحكم الرئيسية'
              : currentTab === 'orders'
              ? 'إدارة الطلبات'
              : 'الإحصائيات والتقارير'
          }
          subtitle={
            currentTab === 'dashboard'
              ? 'نظام تنظيم ومتابعة طلبات متجر NEXORA للألعاب والكمبيوتر'
              : currentTab === 'orders'
              ? 'سجل كامل لطلبات الزبائن مع إمكانية البحث والتصفية والتعديل'
              : 'مؤشرات الأداء المالي ونسب التوصيل'
          }
          onOpenAddModal={() => {
            setOrderToEdit(null);
            setIsAddModalOpen(true);
          }}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          totalOrders={orders.length}
        />

        {/* View Content (Dashboard / Orders / Analytics) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {currentTab === 'dashboard' && (
            <DashboardView
              orders={orders}
              onOpenAddModal={() => {
                setOrderToEdit(null);
                setIsAddModalOpen(true);
              }}
              onViewOrder={(order) => setViewingOrder(order)}
              onNavigateToOrders={handleNavigateToOrders}
              onQuickStatusChange={handleQuickStatusChange}
              currency={settings.currency}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersView
              orders={orders}
              onOpenAddModal={() => {
                setOrderToEdit(null);
                setIsAddModalOpen(true);
              }}
              onViewOrder={(order) => setViewingOrder(order)}
              onEditOrder={handleOpenEdit}
              onDeleteOrder={handleDeleteOrder}
              onQuickStatusChange={handleQuickStatusChange}
              initialStatusFilter={initialStatusFilter}
              currency={settings.currency}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              orders={orders}
              currency={settings.currency}
              onOpenAddModal={() => {
                setOrderToEdit(null);
                setIsAddModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Order Modal */}
      <OrderModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setOrderToEdit(null);
        }}
        orderToEdit={orderToEdit}
        onOrderSaved={handleOrderSaved}
        currency={settings.currency}
      />

      {/* Order Details Sheet Modal */}
      <OrderDetailsModal
        order={viewingOrder}
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        onEdit={(order) => {
          setViewingOrder(null);
          handleOpenEdit(order);
        }}
        onDelete={(orderId) => {
          handleDeleteOrder(orderId);
          setViewingOrder(null);
        }}
        onStatusUpdated={(updated) => {
          setViewingOrder(updated);
          reloadOrders();
          showToast(`تم تحديث حالة الطلب ${updated.id}`);
        }}
        onPrint={(order) => setPrintingOrder(order)}
        currency={settings.currency}
      />

      {/* Invoice Print & Receipt Modal */}
      <InvoicePrintModal
        order={printingOrder}
        isOpen={Boolean(printingOrder)}
        onClose={() => setPrintingOrder(null)}
        currency={settings.currency}
      />

      {/* System Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChanged={(newSettings) => {
          setSettings(newSettings);
        }}
        onOrdersReloadNeeded={reloadOrders}
      />
    </div>
  );
}
