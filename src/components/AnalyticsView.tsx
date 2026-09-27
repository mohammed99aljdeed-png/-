import React, { useMemo } from 'react';
import {
  TrendingUp,
  CreditCard,
  AlertCircle,
  Package,
  CheckCircle2,
  Sparkles,
  XCircle,
  Clock,
  PieChart,
  BarChart2,
  MapPin,
  Percent,
} from 'lucide-react';
import { Order, ORDER_STATUSES, OrderStatus } from '../types/order';

interface AnalyticsViewProps {
  orders: Order[];
  currency: string;
  onOpenAddModal: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  orders,
  currency,
  onOpenAddModal,
}) => {
  // All metrics strictly calculated from actual stored orders
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const validOrders = orders.filter((o) => o.status !== 'cancelled');

    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
    const totalPaid = validOrders.reduce((sum, o) => sum + (Number(o.paidAmount) || 0), 0);
    const totalRemaining = validOrders.reduce((sum, o) => sum + (Number(o.remainingAmount) || 0), 0);

    const newOrders = orders.filter((o) => o.status === 'new').length;
    const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
    const readyOrders = orders.filter((o) => o.status === 'ready').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

    // Delivery completion rate %
    const completionRate =
      totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

    // Collection rate %
    const collectionRate =
      totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0;

    // Average order value
    const averageOrderValue =
      validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    // City distribution
    const cityMap: Record<string, number> = {};
    orders.forEach((o) => {
      const c = o.city ? o.city.trim() : 'غير محدد';
      cityMap[c] = (cityMap[c] || 0) + 1;
    });

    const topCities = Object.entries(cityMap)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      totalPaid,
      totalRemaining,
      newOrders,
      preparingOrders,
      readyOrders,
      deliveredOrders,
      cancelledOrders,
      completionRate,
      collectionRate,
      averageOrderValue,
      topCities,
    };
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            لوحة الإحصائيات والتقارير
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            متابعة الإحصائيات والمبالغ المالية المحصلة لمتجر NEXORA
          </p>
        </div>

        <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-4 text-orange-400">
            <BarChart2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">لا توجد بيانات إحصائية حتى الآن</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
            ستظهر هنا مؤشرات الأداء، إجمالي المبيعات، ومعدلات إتمام الطلبات فور إضافة طلباتك الأولى.
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#c2410c] to-[#ff7828] hover:opacity-95 shadow-md shadow-orange-950/50"
          >
            + إضافة أول طلب لحساب الإحصائيات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          إحصائيات وتقارير الطلبات
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          تحليل الأداء والمبيعات ونسب التوصيل لمتجر NEXORA بناءً على طلباتك المسجلة
        </p>
      </div>

      {/* Main Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#141419] border border-orange-500/30 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400">إجمالي المبيعات</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
            {metrics.totalRevenue.toLocaleString('ar-LY')}{' '}
            <span className="text-xs font-normal text-orange-400">{currency}</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            من إجمالي {metrics.totalOrders - metrics.cancelledOrders} طلب ساري
          </span>
        </div>

        {/* Collected Paid Amount */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#141419] border border-emerald-500/30 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-emerald-400">المبالغ المدفوعة (المحصلة)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {metrics.totalPaid.toLocaleString('ar-LY')}{' '}
            <span className="text-xs font-normal text-emerald-500">{currency}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
            <span className="text-emerald-400 font-bold">{metrics.collectionRate}%</span>
            <span>نسبة التحصيل من المبيعات</span>
          </div>
        </div>

        {/* Pending Remaining Amount */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#141419] border border-amber-500/30 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-amber-400">المبالغ المتبقية للتحصيل</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
            {metrics.totalRemaining.toLocaleString('ar-LY')}{' '}
            <span className="text-xs font-normal text-amber-500">{currency}</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            مستحقات عند التسليم والاستلام
          </span>
        </div>

        {/* Completion Rate */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#141419] border border-zinc-800 shadow-lg shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400">معدل إتمام الطلبات</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 tabular-nums">
            {metrics.completionRate}%
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">
            تم تسليم {metrics.deliveredOrders} من أصل {metrics.totalOrders} طلب
          </span>
        </div>
      </div>

      {/* Orders Status Visual Distribution Bar */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-orange-400" />
            <span>توزيع الطلبات حسب الحالة الحالية</span>
          </h3>
          <span className="text-xs font-mono text-zinc-400">
            {metrics.totalOrders} طلب كلي
          </span>
        </div>

        {/* Visual Progress Line */}
        <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden flex">
          {metrics.newOrders > 0 && (
            <div
              style={{ width: `${(metrics.newOrders / metrics.totalOrders) * 100}%` }}
              className="bg-orange-500 h-full"
              title={`جديد: ${metrics.newOrders}`}
            />
          )}
          {metrics.preparingOrders > 0 && (
            <div
              style={{ width: `${(metrics.preparingOrders / metrics.totalOrders) * 100}%` }}
              className="bg-amber-500 h-full"
              title={`قيد التجهيز: ${metrics.preparingOrders}`}
            />
          )}
          {metrics.readyOrders > 0 && (
            <div
              style={{ width: `${(metrics.readyOrders / metrics.totalOrders) * 100}%` }}
              className="bg-emerald-500 h-full"
              title={`جاهز: ${metrics.readyOrders}`}
            />
          )}
          {metrics.deliveredOrders > 0 && (
            <div
              style={{ width: `${(metrics.deliveredOrders / metrics.totalOrders) * 100}%` }}
              className="bg-cyan-500 h-full"
              title={`تم التسليم: ${metrics.deliveredOrders}`}
            />
          )}
          {metrics.cancelledOrders > 0 && (
            <div
              style={{ width: `${(metrics.cancelledOrders / metrics.totalOrders) * 100}%` }}
              className="bg-red-500 h-full"
              title={`ملغي: ${metrics.cancelledOrders}`}
            />
          )}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-orange-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>جديد</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {metrics.newOrders}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>قيد التجهيز</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {metrics.preparingOrders}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>جاهز</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {metrics.readyOrders}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>تم التسليم</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {metrics.deliveredOrders}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>ملغي</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-1">
              {metrics.cancelledOrders}
            </div>
          </div>
        </div>
      </div>

      {/* Top Cities Distribution */}
      {metrics.topCities.length > 0 && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>أعلى المدن طلباً</span>
            </h3>
            <span className="text-xs text-zinc-400">توزيع الزبائن الجغرافي</span>
          </div>

          <div className="space-y-3">
            {metrics.topCities.map((city) => (
              <div key={city.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-200">{city.name}</span>
                  <span className="font-mono text-orange-400">
                    {city.count} {city.count === 1 ? 'طلب' : 'طلبات'} ({city.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    style={{ width: `${city.percent}%` }}
                    className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
