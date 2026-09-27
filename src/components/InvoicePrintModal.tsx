import React from 'react';
import { X, Printer, CheckCircle } from 'lucide-react';
import { Order, ORDER_STATUSES } from '../types/order';
import { NexoraLogo } from './NexoraLogo';

interface InvoicePrintModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  order,
  isOpen,
  onClose,
  currency,
}) => {
  if (!isOpen || !order) return null;

  const statusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.new;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Intl.DateTimeFormat('ar-LY', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(order.createdAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:m-0 print:bg-white">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Printable Sheet */}
      <div
        className="relative w-full max-w-xl bg-[#121217] border border-zinc-800 text-zinc-100 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 print:w-full print:max-w-none print:shadow-none print:border-none print:bg-white print:text-black my-auto"
        dir="rtl"
      >
        {/* Print Controls (hidden when printing) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-zinc-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-orange-400" />
            <span className="font-bold text-sm text-white">معاينة إيصال الطلب للطباعة</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#c2410c] to-[#ff7828] hover:opacity-90 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الإيصال</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="flex items-center justify-between border-b pb-4 border-zinc-800 print:border-zinc-300">
            <div>
              <NexoraLogo size="md" subtitle="Gaming & PC Accessories" />
              <p className="text-xs text-zinc-400 print:text-zinc-600 mt-1">
                إيصال وفاتورة تسليم طلب زبون
              </p>
            </div>
            <div className="text-left font-mono" dir="ltr">
              <span className="text-xs text-zinc-500 block">ORDER ID</span>
              <span className="text-lg font-bold text-orange-500 print:text-orange-700">
                {order.id}
              </span>
              <span className="text-[11px] text-zinc-400 print:text-zinc-600 block mt-0.5">
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Customer & Delivery Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200">
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 print:text-zinc-500 block mb-1">
                بيانات الزبون:
              </span>
              <div className="font-bold text-sm text-white print:text-black">
                {order.customerName}
              </div>
              <div className="text-xs text-zinc-400 print:text-zinc-700 mt-0.5" dir="ltr">
                {order.phone}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-zinc-400 print:text-zinc-500 block mb-1">
                مدينة واستلام الطلب:
              </span>
              <div className="font-semibold text-sm text-white print:text-black">
                {order.city}
              </div>
              <div className="text-xs text-orange-400 print:text-orange-700 font-medium mt-0.5">
                الحالة: {statusConfig.label}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-zinc-800 rounded-xl overflow-hidden print:border-zinc-300">
            <div className="grid grid-cols-12 bg-zinc-900/90 print:bg-zinc-100 p-3 text-xs font-semibold text-zinc-300 print:text-zinc-700">
              <span className="col-span-8">المنتج / تفاصيل الطلب</span>
              <span className="col-span-4 text-left">السعر</span>
            </div>
            <div className="grid grid-cols-12 p-3 text-sm border-t border-zinc-800 print:border-zinc-200">
              <div className="col-span-8">
                <div className="font-bold text-zinc-100 print:text-black">
                  {order.productName}
                </div>
                {order.details && (
                  <p className="text-xs text-zinc-400 print:text-zinc-600 mt-1">
                    {order.details}
                  </p>
                )}
                {order.notes && (
                  <p className="text-[11px] text-amber-400 print:text-amber-800 mt-1">
                    ملاحظات: {order.notes}
                  </p>
                )}
              </div>
              <div className="col-span-4 text-left font-mono font-bold text-zinc-100 print:text-black">
                {order.price.toLocaleString('ar-LY')} {currency}
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="space-y-2 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200">
            <div className="flex justify-between text-xs text-zinc-400 print:text-zinc-600">
              <span>إجمالي الطلب:</span>
              <span className="font-mono font-bold text-zinc-200 print:text-black">
                {order.price.toLocaleString('ar-LY')} {currency}
              </span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400 print:text-emerald-700">
              <span>المبلغ المدفوع:</span>
              <span className="font-mono font-bold">
                {order.paidAmount.toLocaleString('ar-LY')} {currency}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-800 print:border-zinc-200 flex justify-between text-sm font-bold">
              <span className="text-white print:text-black">المبلغ المتبقي للتحصيل:</span>
              <span className="font-mono text-orange-400 print:text-orange-700 text-base">
                {order.remainingAmount.toLocaleString('ar-LY')} {currency}
              </span>
            </div>
          </div>

          {/* Footer Receipt Note */}
          <div className="text-center pt-2 text-xs text-zinc-500 print:text-zinc-600">
            <p>شكراً لتعاملكم مع متجر NEXORA للألعاب والكمبيوتر</p>
            <p className="text-[10px] text-zinc-600 print:text-zinc-400 mt-0.5">
              نظام إدارة الطلبات الداخلي · NEXORA Orders Manager
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
