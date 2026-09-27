import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  ArrowUpDown,
  Download,
  CheckCircle2,
  ChevronDown,
  X,
  MessageCircle,
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES, COMMON_CITIES } from '../types/order';
import { StatusBadge } from './StatusBadge';

interface OrdersViewProps {
  orders: Order[];
  onOpenAddModal: () => void;
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onQuickStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  initialStatusFilter?: OrderStatus;
  currency: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onOpenAddModal,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  onQuickStatusChange,
  initialStatusFilter,
  currency,
}) => {
  // State for search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>(
    initialStatusFilter || 'all'
  );
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'price-desc' | 'price-asc' | 'remaining-desc'>('date-desc');
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Extract all unique cities from actual orders + common
  const citiesInOrders = useMemo(() => {
    const set = new Set<string>();
    orders.forEach((o) => {
      if (o.city) set.add(o.city.trim());
    });
    return Array.from(set);
  }, [orders]);

  // Status Counts for Tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: orders.length,
      new: 0,
      preparing: 0,
      ready: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  }, [orders]);

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Status filter
        if (selectedStatus !== 'all' && order.status !== selectedStatus) {
          return false;
        }

        // City filter
        if (selectedCity !== 'all' && order.city !== selectedCity) {
          return false;
        }

        // Search query: customer name, phone, order ID, product name
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchId = order.id.toLowerCase().includes(query);
          const matchCustomer = order.customerName.toLowerCase().includes(query);
          const matchPhone = order.phone.includes(query);
          const matchProduct = order.productName.toLowerCase().includes(query);
          const matchDetails = order.details ? order.details.toLowerCase().includes(query) : false;

          if (!matchId && !matchCustomer && !matchPhone && !matchProduct && !matchDetails) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'price-desc') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'price-asc') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'remaining-desc') {
          return (b.remainingAmount || 0) - (a.remainingAmount || 0);
        }
        return 0;
      });
  }, [orders, selectedStatus, selectedCity, searchQuery, sortBy]);

  // Export filtered orders as CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ['رقم الطلب', 'اسم الزبون', 'الهاتف', 'المدينة', 'المنتج', 'السعر', 'المدفوع', 'المتبقي', 'الحالة', 'التاريخ'];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.city}"`,
      `"${o.productName.replace(/"/g, '""')}"`,
      o.price,
      o.paidAmount,
      o.remainingAmount,
      ORDER_STATUSES[o.status]?.label || o.status,
      new Date(o.createdAt).toLocaleDateString('ar-LY'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nexora_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusTabs: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'جميع الطلبات' },
    { id: 'new', label: 'جديد' },
    { id: 'preparing', label: 'قيد التجهيز' },
    { id: 'ready', label: 'جاهز' },
    { id: 'delivered', label: 'تم التسليم' },
    { id: 'cancelled', label: 'ملغي' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            سجل جميع الطلبات
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            البحث في الطلبات وتصفيتها وتحديث حالتها أو تعديلها
          </p>
        </div>

        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-colors"
              title="تصدير كملف إكسل / CSV"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>تصدير CSV</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#c2410c] to-[#ff7828] hover:opacity-95 shadow-md shadow-orange-950/40 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة طلب جديد</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.id;
          const count = statusCounts[tab.id] || 0;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                isActive
                  ? 'bg-orange-500/15 border-orange-500 text-orange-400 shadow-sm'
                  : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono tabular-nums ${
                  isActive ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        {/* Search Bar (Customer name, phone, order ID, product) */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 absolute right-3.5 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم الزبون، رقم الهاتف، رقم الطلب، أو المنتج..."
            className="w-full pr-10 pl-8 py-2 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2.5 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">جميع المدن ({orders.length})</option>
              {citiesInOrders.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="md:col-span-3">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-950/90 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="date-desc">الأحدث تاريخاً أولاً</option>
              <option value="date-asc">الأقدم تاريخاً أولاً</option>
              <option value="price-desc">الأعلى سعراً</option>
              <option value="price-asc">الأقل سعراً</option>
              <option value="remaining-desc">الأعلى مبلغاً متبقياً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Content View */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
          <p className="text-base font-bold text-zinc-300 mb-1">
            {orders.length === 0
              ? 'لا توجد أي طلبات مسجلة بعد'
              : 'لم يتم العثور على طلبات مطابقة لمعايير البحث والفلترة'}
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
            {orders.length === 0
              ? 'ابدأ بإضافة أول طلب لزبائن متجرك عبر الزر أدناه'
              : 'جرب تغيير نص البحث أو اختيار "جميع الحالات" لعرض الطلبات'}
          </p>
          {orders.length === 0 && (
            <button
              onClick={onOpenAddModal}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#c2410c] to-[#ff7828] hover:opacity-90 shadow-md"
            >
              + إضافة طلب جديد الآن
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden lg:block rounded-2xl border border-zinc-800 bg-[#101015] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-semibold select-none">
                    <th className="py-3.5 px-4 font-mono">رقم الطلب</th>
                    <th className="py-3.5 px-4">الزبون</th>
                    <th className="py-3.5 px-4">رقم الهاتف</th>
                    <th className="py-3.5 px-4">الطلب / المنتج</th>
                    <th className="py-3.5 px-4">السعر</th>
                    <th className="py-3.5 px-4">المدفوع</th>
                    <th className="py-3.5 px-4">المتبقي</th>
                    <th className="py-3.5 px-4">الحالة</th>
                    <th className="py-3.5 px-4">التاريخ</th>
                    <th className="py-3.5 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredOrders.map((order) => {
                    const formattedDate = new Intl.DateTimeFormat('ar-LY', {
                      month: 'short',
                      day: 'numeric',
                    }).format(new Date(order.createdAt));

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-zinc-900/50 transition-colors group"
                      >
                        {/* Order ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                          {order.id}
                        </td>

                        {/* Customer & City */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            <span>{order.city}</span>
                          </div>
                        </td>

                        {/* Phone with WhatsApp shortcut */}
                        <td className="py-3.5 px-4 font-mono" dir="ltr">
                          <a
                            href={`tel:${order.phone}`}
                            className="text-zinc-300 hover:text-orange-400 hover:underline inline-flex items-center gap-1 text-right"
                          >
                            <Phone className="w-3 h-3 text-zinc-500" />
                            <span>{order.phone}</span>
                          </a>
                        </td>

                        {/* Product & details */}
                        <td className="py-3.5 px-4 max-w-[220px]">
                          <div className="font-semibold text-zinc-200 truncate">
                            {order.productName}
                          </div>
                          {order.details && (
                            <div className="text-[11px] text-zinc-500 truncate">
                              {order.details}
                            </div>
                          )}
                        </td>

                        {/* Total Price */}
                        <td className="py-3.5 px-4 font-mono font-bold text-zinc-200 tabular-nums">
                          {order.price.toLocaleString('ar-LY')} {currency}
                        </td>

                        {/* Paid */}
                        <td className="py-3.5 px-4 font-mono text-emerald-400 tabular-nums">
                          {order.paidAmount.toLocaleString('ar-LY')} {currency}
                        </td>

                        {/* Remaining */}
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          {order.remainingAmount > 0 ? (
                            <span className="font-bold text-amber-400 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
                              {order.remainingAmount.toLocaleString('ar-LY')} {currency}
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">مكتمل ✓</span>
                          )}
                        </td>

                        {/* Status (with quick-changer select) */}
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              onQuickStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            className="bg-zinc-900 border border-zinc-700/80 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                            style={{
                              color: ORDER_STATUSES[order.status]?.color,
                            }}
                          >
                            {Object.values(ORDER_STATUSES).map((st) => (
                              <option key={st.key} value={st.key}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Actions: View, Edit, Delete */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onViewOrder(order)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              title="عرض تفاصيل الطلب"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEditOrder(order)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                              title="تعديل بيانات الطلب"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setOrderToDelete(order.id)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Responsive Cards View (Shown on small & medium screens) */}
          <div className="lg:hidden space-y-3">
            {filteredOrders.map((order) => {
              const formattedDate = new Intl.DateTimeFormat('ar-LY', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(new Date(order.createdAt));

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-[#121217] border border-zinc-800/80 shadow-md space-y-3"
                >
                  {/* Top Bar: ID, Status, Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/25">
                        {order.id}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {order.customerName}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        {order.city}
                      </span>
                      <span>·</span>
                      <a
                        href={`tel:${order.phone}`}
                        className="flex items-center gap-1 font-mono text-zinc-300"
                        dir="ltr"
                      >
                        <Phone className="w-3 h-3 text-orange-400" />
                        {order.phone}
                      </a>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs">
                    <span className="font-semibold text-orange-300 block">
                      {order.productName}
                    </span>
                    {order.details && (
                      <p className="text-zinc-400 text-[11px] mt-0.5 line-clamp-2">
                        {order.details}
                      </p>
                    )}
                  </div>

                  {/* Pricing Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block">السعر</span>
                      <span className="font-mono font-bold text-zinc-200">
                        {order.price} {currency}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-[10px] text-emerald-500 block">المدفوع</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {order.paidAmount} {currency}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <span className="text-[10px] text-amber-500 block">المتبقي</span>
                      <span className="font-mono font-bold text-amber-400">
                        {order.remainingAmount} {currency}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Quick Status Select */}
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onQuickStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-orange-500"
                    >
                      {Object.values(ORDER_STATUSES).map((st) => (
                        <option key={st.key} value={st.key}>
                          {st.label}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => onEditOrder(order)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setOrderToDelete(order.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOrderToDelete(null)}
          />
          <div className="relative w-full max-w-sm bg-[#121217] border border-red-500/40 rounded-2xl p-6 text-zinc-100 z-10 shadow-2xl">
            <h4 className="text-base font-bold text-red-400 mb-2">تأكيد حذف الطلب</h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              هل أنت متأكد من رغبتك بحذف هذا الطلب ({orderToDelete})؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  onDeleteOrder(orderToDelete);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
