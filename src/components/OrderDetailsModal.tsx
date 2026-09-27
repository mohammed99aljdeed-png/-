import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Share2,
  Printer,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Copy,
  AlertTriangle,
  ChevronLeft,
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES } from '../types/order';
import { StatusBadge } from './StatusBadge';
import { storageService } from '../services/storageService';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onStatusUpdated: (updatedOrder: Order) => void;
  onPrint: (order: Order) => void;
  currency: string;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusUpdated,
  onPrint,
  currency,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const currentStatusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.new;

  // Status progression flow: new -> preparing -> ready -> delivered
  const statusFlow: OrderStatus[] = ['new', 'preparing', 'ready', 'delivered'];

  const handleStatusChange = (newStatus: OrderStatus) => {
    const updated = storageService.updateOrderStatus(order.id, newStatus);
    if (updated) {
      onStatusUpdated(updated);
    }
  };

  // WhatsApp link & message
  const handleOpenWhatsApp = () => {
    // Clean phone number for Libyan numbers (091, 092, 093, 094, 095 etc.) with country code +218
    let cleanPhone = order.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('00218')) {
      cleanPhone = cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('0')) {
      cleanPhone = '218' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('9')) {
      cleanPhone = '218' + cleanPhone;
    } else if (!cleanPhone.startsWith('218')) {
      cleanPhone = '218' + cleanPhone;
    }

    const message = encodeURIComponent(
      `مرحباً ${order.customerName}،\nمعك متجر NEXORA بخصوص طلبك رقم (${order.id})\n` +
      `الطلب: ${order.productName}\n` +
      `الحالة الحالية: ${currentStatusConfig.label}\n` +
      `المبلغ المتبقي: ${order.remainingAmount.toLocaleString('ar-LY')} ${currency}\n` +
      `نسعد بخدمتك دائماً!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Copy full details to clipboard
  const handleCopySummary = () => {
    const summary =
      `طلب NEXORA رقم: ${order.id}\n` +
      `الزبون: ${order.customerName}\n` +
      `الهاتف: ${order.phone}\n` +
      `المدينة: ${order.city}\n` +
      `الطلب: ${order.productName}\n` +
      (order.details ? `التفاصيل: ${order.details}\n` : '') +
      `السعر الإجمالي: ${order.price} ${currency}\n` +
      `المدفوع: ${order.paidAmount} ${currency}\n` +
      `المتبقي: ${order.remainingAmount} ${currency}\n` +
      `الحالة: ${currentStatusConfig.label}\n` +
      (order.notes ? `ملاحظات: ${order.notes}` : '');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Intl.DateTimeFormat('ar-LY', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(order.createdAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-2xl bg-[#101015] border border-orange-500/25 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-auto"
        dir="rtl"
      >
        {/* Glow Header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#ff7828]" />

        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold font-mono tracking-wider text-orange-400">
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="نسخ تفاصيل الطلب"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPrint(order)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="طباعة إيصال الطلب"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status Stepper Progression */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-xs font-semibold text-zinc-400 mb-3 flex items-center justify-between">
              <span>مسار حالة الطلب (تغيير فوري):</span>
              {order.status === 'cancelled' ? (
                <span className="text-red-400 font-bold">الطلب ملغي</span>
              ) : (
                <span className="text-orange-400">{currentStatusConfig.label}</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusFlow.map((stKey) => {
                const cfg = ORDER_STATUSES[stKey];
                const isActive = order.status === stKey;
                return (
                  <button
                    key={stKey}
                    onClick={() => handleStatusChange(stKey)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500 shadow-sm'
                        : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cfg.dotColor }}
                    />
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Cancel / Reactivate Toggle */}
            <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="text-xs text-zinc-500">حالات إضافية:</span>
              {order.status === 'cancelled' ? (
                <button
                  onClick={() => handleStatusChange('new')}
                  className="text-xs text-orange-400 hover:text-orange-300 hover:underline"
                >
                  إلغاء حالة الإلغاء وإعادة الطلب كجديد ↺
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="text-xs text-red-400/80 hover:text-red-400 hover:underline"
                >
                  تحويل الطلب إلى "ملغي" ✕
                </button>
              )}
            </div>
          </div>

          {/* Customer Profile Box */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>بيانات الزبون والتواصل</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {order.customerName}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    {order.city}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono" dir="ltr">
                    <Phone className="w-3.5 h-3.5 text-orange-400" />
                    {order.phone}
                  </span>
                </div>
              </div>

              {/* Contact Actions: WhatsApp & Call */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenWhatsApp}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>محادثة واتساب</span>
                </button>

                <a
                  href={`tel:${order.phone}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-800/80 hover:bg-zinc-800 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>
          </div>

          {/* Order Details & Specs */}
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
            <div className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              تفاصيل المنتج والطلب
            </div>

            <div>
              <div className="text-base font-bold text-zinc-100 mb-1">
                {order.productName}
              </div>
              {order.category && (
                <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-orange-300 border border-zinc-700/60 mb-2">
                  {order.category}
                </span>
              )}
              {order.details ? (
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
                  {order.details}
                </p>
              ) : (
                <p className="text-xs text-zinc-500 italic">لا توجد تفاصيل إضافية مسجلة</p>
              )}
            </div>

            {/* Notes if any */}
            {order.notes && (
              <div className="pt-2 border-t border-zinc-800/60">
                <span className="text-xs font-semibold text-amber-400 block mb-1">
                  ملاحظات خاصة للتذكير:
                </span>
                <p className="text-xs text-zinc-300 bg-amber-950/15 border border-amber-500/20 p-2.5 rounded-lg">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Financial Breakdown Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block mb-1">السعر الإجمالي</span>
              <div className="text-base sm:text-lg font-mono font-bold text-white">
                {order.price.toLocaleString('ar-LY')}{' '}
                <span className="text-xs font-normal text-zinc-400">{currency}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
              <span className="text-[11px] text-emerald-400/90 block mb-1">المبلغ المدفوع</span>
              <div className="text-base sm:text-lg font-mono font-bold text-emerald-400">
                {order.paidAmount.toLocaleString('ar-LY')}{' '}
                <span className="text-xs font-normal text-zinc-400">{currency}</span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                order.remainingAmount > 0
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-zinc-900/70 border-zinc-800'
              }`}
            >
              <span className="text-[11px] text-amber-400/90 block mb-1">المبلغ المتبقي</span>
              <div
                className={`text-base sm:text-lg font-mono font-bold ${
                  order.remainingAmount > 0 ? 'text-amber-400' : 'text-zinc-400'
                }`}
              >
                {order.remainingAmount.toLocaleString('ar-LY')}{' '}
                <span className="text-xs font-normal text-zinc-400">{currency}</span>
              </div>
            </div>
          </div>

          {/* Creation Timestamp */}
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>تاريخ إنشاء الطلب: {formattedDate}</span>
          </div>

          {/* Delete Confirmation Warning */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>تأكيد حذف الطلب نهائياً</span>
              </div>
              <p className="text-xs text-red-300/90">
                هل أنت متأكد من رغبتك بحذف هذا الطلب ({order.id})؟ لن تتمكن من استرجاعه بعد الحذف.
              </p>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                >
                  تراجع
                </button>
                <button
                  onClick={() => {
                    onDelete(order.id);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm"
                >
                  نعم، احذف الطلب
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:px-6 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف الطلب</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(order);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>تعديل الطلب</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-zinc-400 hover:text-zinc-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
