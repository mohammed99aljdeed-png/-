import React from 'react';
import {
  Package,
  Sparkles,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  AlertCircle,
  ChevronLeft,
  Calendar,
  Phone,
  MapPin,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES } from '../types/order';
import { StatusBadge } from './StatusBadge';
import { NexoraLogo } from './NexoraLogo';

interface DashboardViewProps {
  orders: Order[];
  onOpenAddModal: () => void;
  onViewOrder: (order: Order) => void;
  onNavigateToOrders: (filterStatus?: OrderStatus) => void;
  onQuickStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  currency: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  onOpenAddModal,
  onViewOrder,
  onNavigateToOrders,
  onQuickStatusChange,
  currency,
}) => {
  // Statistics Calculations strictly based on actual orders
  const totalCount = orders.length;
  const newCount = orders.filter((o) => o.status === 'new').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  // Financial calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  const totalPaid = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.paidAmount) || 0), 0);

  const totalRemaining = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.remainingAmount) || 0), 0);

  // Latest orders (up to 6)
  const recentOrders = orders.slice(0, 6);

  // Status Cards Data
  const statCards = [
    {
      id: 'total',
      label: 'إجمالي الطلبات',
      count: totalCount,
      icon: Package,
      iconColor: 'text-orange-400',
      borderColor: 'border-zinc-800 hover:border-orange-500/50',
      bgColor: 'bg-zinc-900/60',
      accentGlow: 'from-orange-500/10 to-transparent',
      statusFilter: undefined,
    },
    {
      id: 'new',
      label: 'الطلبات الجديدة',
      count: newCount,
      icon: Sparkles,
      iconColor: 'text-amber-400',
      borderColor: 'border-amber-500/30 hover:border-amber-500/70',
      bgColor: 'bg-amber-950/15',
      accentGlow: 'from-amber-500/15 to-transparent',
      statusFilter: 'new' as OrderStatus,
      highlight: newCount > 0,
    },
    {
      id: 'preparing',
      label: 'قيد التجهيز',
      count: preparingCount,
      icon: Clock,
      iconColor: 'text-orange-400',
      borderColor: 'border-orange-500/30 hover:border-orange-500/70',
      bgColor: 'bg-orange-950/15',
      accentGlow: 'from-orange-500/15 to-transparent',
      statusFilter: 'preparing' as OrderStatus,
    },
    {
      id: 'ready',
      label: 'جاهزة للتسليم',
      count: readyCount,
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/70',
      bgColor: 'bg-emerald-950/15',
      accentGlow: 'from-emerald-500/15 to-transparent',
      statusFilter: 'ready' as OrderStatus,
    },
    {
      id: 'delivered',
      label: 'تم التسليم',
      count: deliveredCount,
      icon: Truck,
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/70',
      bgColor: 'bg-cyan-950/15',
      accentGlow: 'from-cyan-500/15 to-transparent',
      statusFilter: 'delivered' as OrderStatus,
    },
    {
      id: 'cancelled',
      label: 'الطلبات الملغاة',
      count: cancelledCount,
      icon: XCircle,
      iconColor: 'text-red-400',
      borderColor: 'border-red-500/30 hover:border-red-500/60',
      bgColor: 'bg-red-950/15',
      accentGlow: 'from-red-500/10 to-transparent',
      statusFilter: 'cancelled' as OrderStatus,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-orange-500/25 p-6 sm:p-8 bg-gradient-to-br from-[#18120e] via-[#101015] to-[#0a0a0d] shadow-2xl shadow-black/80">
        {/* Ambient Orange Glow Spots */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(circle, #ea580c 0%, #7c2d12 60%, transparent 100%)',
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, #f97316 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-black/40 border border-orange-500/30 shadow-inner">
              <NexoraLogo size="lg" showText={false} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400">
                  Gaming & PC Accessories
                </span>
                <span className="text-xs text-zinc-500">نظام داخلي شخصي</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1.5 font-sans">
                NEXORA Orders Manager
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
                لوحة التحكم الشخصية لمتابعة طلبات الزبائن، تنظيم التجهيز، وتتبع المستحقات حتى لا يضيع أي طلب.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#ff7828] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#ff8c38] shadow-lg shadow-orange-950/60 hover:shadow-orange-600/30 active:scale-95 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>+ إضافة طلب جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <span>حالات الطلبات</span>
            <span className="text-[11px] text-zinc-500 font-normal">
              (انقر على أي بطاقة للتصفية المباشرة)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigateToOrders(card.statusFilter)}
                className={`group relative text-right p-4 sm:p-5 rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${card.bgColor} ${card.borderColor} hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-950/20 active:scale-95`}
              >
                {/* Glow accent */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${card.accentGlow} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-900/80 border border-zinc-800 ${card.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {card.highlight && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    )}
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                      {card.count}
                    </div>
                    <div className="text-xs font-medium text-zinc-400 mt-1 truncate">
                      {card.label}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block mb-1">إجمالي قيمة المبيعات</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
              {totalRevenue.toLocaleString('ar-LY')}{' '}
              <span className="text-xs text-orange-400 font-sans">{currency}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Collected Amount */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400/90 block mb-1">المبالغ المحصلة (المدفوعة)</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {totalPaid.toLocaleString('ar-LY')}{' '}
              <span className="text-xs text-emerald-500 font-sans">{currency}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Balance */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400/90 block mb-1">المبالغ المتبقية للتحصيل</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {totalRemaining.toLocaleString('ar-LY')}{' '}
              <span className="text-xs text-amber-500 font-sans">{currency}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              آخر الطلبات
            </h3>
            <p className="text-xs text-zinc-400">
              أحدث طلبات الزبائن المسجلة في النظام
            </p>
          </div>

          {orders.length > 0 && (
            <button
              onClick={() => onNavigateToOrders()}
              className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <span>عرض جميع الطلبات ({orders.length})</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Empty State when 0 orders exist */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-8 sm:p-12 text-center bg-zinc-900/30">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4 text-orange-400">
              <Package className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              النظام جاهز وفي انتظار أول طلب
            </h4>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              لم تقم بإضافة أي طلبات بعد. عندما يتواصل معك زبون لشراء كرسي قيمنق أو قطع كمبيوتر، اضغط على الزر بالأسفل لتسجيل الطلب فوراً.
            </p>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#c2410c] to-[#ff7828] hover:opacity-95 shadow-lg shadow-orange-950/40 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة أول طلب الآن</span>
            </button>
          </div>
        ) : (
          /* Recent Orders List */
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const formattedDate = new Intl.DateTimeFormat('ar-LY', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }).format(new Date(order.createdAt));

              return (
                <div
                  key={order.id}
                  className="group relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-zinc-900/90 to-[#121218] border border-zinc-800/80 hover:border-orange-500/40 transition-all duration-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Info: ID, Customer, Phone, City, Product */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="font-mono font-bold text-sm text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/25">
                        {order.id}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                      <span className="text-xs text-zinc-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h4 className="text-base font-bold text-white truncate">
                        {order.customerName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="flex items-center gap-1 font-mono" dir="ltr">
                          <Phone className="w-3 h-3 text-zinc-500" />
                          {order.phone}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {order.city}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs sm:text-sm text-zinc-300 flex items-center gap-2">
                      <span className="font-medium text-orange-300 truncate">
                        {order.productName}
                      </span>
                      {order.details && (
                        <span className="text-zinc-500 truncate hidden sm:inline">
                          — {order.details}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Info: Financials & View Button */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800/80 shrink-0">
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-bold font-mono text-white">
                        {order.price.toLocaleString('ar-LY')}{' '}
                        <span className="text-xs font-normal text-zinc-400">{currency}</span>
                      </div>
                      <div className="text-[11px] font-mono">
                        {order.remainingAmount > 0 ? (
                          <span className="text-amber-400">
                            متبقي: {order.remainingAmount.toLocaleString('ar-LY')} {currency}
                          </span>
                        ) : (
                          <span className="text-emerald-400">مدفوع بالكامل ✓</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-orange-500 hover:text-white border border-zinc-700/80 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض التفاصيل</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
