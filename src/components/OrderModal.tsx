import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Package,
  FileText,
  DollarSign,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Order, OrderStatus, ORDER_STATUSES, COMMON_CITIES, POPULAR_GAMING_CATEGORIES } from '../types/order';
import { storageService } from '../services/storageService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToEdit?: Order | null;
  onOrderSaved: (savedOrder: Order) => void;
  currency: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  orderToEdit,
  onOrderSaved,
  currency,
}) => {
  const isEditing = Boolean(orderToEdit);

  // Form State
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [productName, setProductName] = useState('');
  const [details, setDetails] = useState('');
  const [price, setPrice] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<OrderStatus>('new');
  const [category, setCategory] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or Populate fields on open
  useEffect(() => {
    if (!isOpen) return;

    if (orderToEdit) {
      setOrderNumber(orderToEdit.id);
      setCustomerName(orderToEdit.customerName || '');
      setPhone(orderToEdit.phone || '');
      setCity(orderToEdit.city || '');
      setProductName(orderToEdit.productName || '');
      setDetails(orderToEdit.details || '');
      setPrice(orderToEdit.price ? String(orderToEdit.price) : '');
      setPaidAmount(orderToEdit.paidAmount !== undefined ? String(orderToEdit.paidAmount) : '0');
      setNotes(orderToEdit.notes || '');
      setStatus(orderToEdit.status || 'new');
      setCategory(orderToEdit.category || '');
    } else {
      // New order
      setOrderNumber(storageService.getNextOrderNumber());
      setCustomerName('');
      setPhone('');
      setCity('طرابلس');
      setProductName('');
      setDetails('');
      setPrice('');
      setPaidAmount('0');
      setNotes('');
      setStatus('new');
      setCategory('');
    }
    setErrors({});
  }, [isOpen, orderToEdit]);

  // Compute calculated remaining amount
  const numericPrice = parseFloat(price) || 0;
  const numericPaid = parseFloat(paidAmount) || 0;
  const computedRemaining = Math.max(0, numericPrice - numericPaid);

  // Quick payment presets
  const handleSetPaidFull = () => {
    if (numericPrice > 0) {
      setPaidAmount(String(numericPrice));
    }
  };

  const handleSetPaidZero = () => {
    setPaidAmount('0');
  };

  const handleSetPaidHalf = () => {
    if (numericPrice > 0) {
      setPaidAmount(String(Math.round(numericPrice / 2)));
    }
  };

  // Form Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) {
      newErrors.customerName = 'يرجى كتابة اسم الزبون';
    }
    if (!phone.trim()) {
      newErrors.phone = 'يرجى إدخال رقم الهاتف';
    }
    if (!productName.trim()) {
      newErrors.productName = 'يرجى إدخال اسم المنتج أو الطلب';
    }
    if (numericPrice <= 0) {
      newErrors.price = 'يرجى تحديد السعر الإجمالي للطلب';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && orderToEdit) {
      const updated = storageService.updateOrder(orderToEdit.id, {
        customerName: customerName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        productName: productName.trim(),
        details: details.trim(),
        price: numericPrice,
        paidAmount: numericPaid,
        notes: notes.trim(),
        status,
        category: category.trim(),
      });
      if (updated) {
        onOrderSaved(updated);
        onClose();
      }
    } else {
      const created = storageService.createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        city: city.trim() || 'طرابلس',
        productName: productName.trim(),
        details: details.trim(),
        price: numericPrice,
        paidAmount: numericPaid,
        notes: notes.trim(),
        status,
        category: category.trim(),
      });
      onOrderSaved(created);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-[#101015] border border-orange-500/25 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-10 my-auto"
        dir="rtl"
      >
        {/* Top Glow Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#ff7828]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isEditing ? `تعديل الطلب ${orderNumber}` : 'إضافة طلب جديد للزبون'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-400">
                <span>رقم الطلب:</span>
                <span className="font-mono font-bold text-orange-400">{orderNumber}</span>
                <span>(يتم إنشاؤه تلقائياً)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section: Customer Info */}
          <div>
            <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              بيانات الزبون والتوصيل
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  اسم الزبون <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: محمد الفيتوري"
                    className={`w-full px-3.5 py-2.5 bg-zinc-900/90 border rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors ${
                      errors.customerName ? 'border-red-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-[11px] text-red-400">{errors.customerName}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  رقم الهاتف / الواتساب <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="مثال: 0912345678 أو 0921234567"
                    dir="ltr"
                    className={`w-full px-3.5 py-2.5 bg-zinc-900/90 border rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-right ${
                      errors.phone ? 'border-red-500' : 'border-zinc-800'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-red-400">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  المدينة <span className="text-zinc-500 text-[11px]">(اختر أو اكتب يدوياً)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="طرابلس"
                    className="flex-1 px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) setCity(e.target.value);
                    }}
                    className="px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">مدن سريعة...</option>
                    {COMMON_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Product & Order Details */}
          <div className="pt-2 border-t border-zinc-800/60">
            <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              تفاصيل المنتج والطلب
            </h3>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  اسم المنتج / الطلب <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="مثال: كرسي قيمنق NEXORA Titan RGB أو كرت شاشة RTX 4070"
                  className={`w-full px-3.5 py-2.5 bg-zinc-900/90 border rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                    errors.productName ? 'border-red-500' : 'border-zinc-800'
                  }`}
                />
                {errors.productName && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.productName}</p>
                )}
              </div>

              {/* Category Quick Tags */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1.5">
                  تصنيف سريع (اختياري):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_GAMING_CATEGORIES.slice(0, 5).map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(category === cat ? '' : cat)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        category === cat
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                          : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  تفاصيل الطلب ومواصفاته
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={2}
                  placeholder="مثال: لون أسود وبرتقالي، تطريز يدوي، مقاس L، مع مساند ذراع 4D"
                  className="w-full px-3.5 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Financials (Price, Paid, Remaining) */}
          <div className="pt-2 border-t border-zinc-800/60">
            <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              الأسعار والمبالغ المالية ({currency})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Total Price */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  السعر الإجمالي <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className={`w-full px-3.5 py-2.5 bg-zinc-900/90 border rounded-xl text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ${
                      errors.price ? 'border-red-500' : 'border-zinc-800'
                    }`}
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-zinc-500">
                    {currency}
                  </span>
                </div>
                {errors.price && (
                  <p className="mt-1 text-[11px] text-red-400">{errors.price}</p>
                )}
              </div>

              {/* Paid Amount */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    المبلغ المدفوع
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-zinc-500">
                    {currency}
                  </span>
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <button
                    type="button"
                    onClick={handleSetPaidFull}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-300 transition-colors"
                  >
                    كامل المبلغ
                  </button>
                  <button
                    type="button"
                    onClick={handleSetPaidHalf}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-300 transition-colors"
                  >
                    نصف المبلغ
                  </button>
                  <button
                    type="button"
                    onClick={handleSetPaidZero}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    بدون دفعة (0)
                  </button>
                </div>
              </div>

              {/* Remaining Amount (Auto-Calculated) */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  المبلغ المتبقي <span className="text-[10px] text-zinc-500">(تلقائي)</span>
                </label>
                <div className="relative">
                  <div
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-mono font-bold flex items-center justify-between border ${
                      computedRemaining > 0
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                        : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                    }`}
                  >
                    <span>{computedRemaining.toLocaleString('ar-SA')}</span>
                    <span className="text-xs font-normal opacity-75">{currency}</span>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  {computedRemaining === 0 ? '✓ تم السداد بالكامل' : 'مستحق عند الاستلام أو التوصيل'}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Status & Notes */}
          <div className="pt-2 border-t border-zinc-800/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Order Status */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  حالة الطلب
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer"
                >
                  {Object.values(ORDER_STATUSES).map((st) => (
                    <option key={st.key} value={st.key}>
                      {st.label} — {st.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  ملاحظات خاصة
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="ملاحظات للتذكير (وقت التسليم المفضل، حي الزبون، إلخ)"
                  className="w-full px-3.5 py-2 bg-zinc-900/90 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#ff7828] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#ff8c38] shadow-lg shadow-orange-950/40 active:scale-95 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'حفظ التعديلات' : 'إضافة وتأكيد الطلب'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
