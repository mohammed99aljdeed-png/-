import React, { useState } from 'react';
import {
  X,
  Settings,
  Download,
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  Coins,
  RefreshCw,
} from 'lucide-react';
import { AppSettings } from '../types/order';
import { storageService } from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChanged: (newSettings: AppSettings) => void;
  onOrdersReloadNeeded: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChanged,
  onOrdersReloadNeeded,
}) => {
  const [currency, setCurrency] = useState(settings.currency || 'د.ل');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = () => {
    const updated = {
      ...settings,
      currency: currency.trim() || 'ر.س',
    };
    storageService.saveSettings(updated);
    onSettingsChanged(updated);
    showToast('تم حفظ الإعدادات بنجاح');
  };

  const handleExport = () => {
    const jsonStr = storageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora_orders_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تصدير النسخة الاحتياطية بنجاح');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = storageService.importData(content);
      if (res.success) {
        showToast(`تم استيراد ${res.count} طلب بنجاح`);
        onOrdersReloadNeeded();
      } else {
        alert(res.error || 'فشل الاستيراد');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleLoadSamples = () => {
    storageService.loadSampleOrders();
    onOrdersReloadNeeded();
    showToast('تم تحميل 3 طلبات توضيحية لتجربة المظهر');
  };

  const handleClearAll = () => {
    storageService.clearAllOrders();
    onOrdersReloadNeeded();
    setShowClearConfirm(false);
    showToast('تم تفريغ كافة الطلبات بنجاح. النظام فارغ الآن.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-lg bg-[#111116] border border-orange-500/20 rounded-2xl shadow-2xl p-6 z-10 my-auto text-zinc-100"
        dir="rtl"
      >
        {/* Top Glow */}
        <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-orange-600 to-amber-500 rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-orange-400" />
            <h2 className="text-base font-bold text-white">إعدادات النظام والواجهة</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="my-3 p-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="py-4 space-y-6">
          {/* Currency setting */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <Coins className="w-4 h-4 text-orange-400" />
              <span>رمز العملة المستخدمة في الحسابات:</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="د.ل"
                className="w-28 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-center font-bold text-orange-400 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                تطبيق الرمز
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              العملة الافتراضية المعتمدة هي الدينار الليبي (د.ل)، ويمكنك تخصيص الرمز إن رغبت.
            </p>
          </div>

          {/* Backup & Restore Data */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              حفظ ونسخ البيانات (Backup & Restore)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              جميع بياناتك تُحفظ محلياً على جهازك بشكل دائم. لحماية بياناتك من الحذف المفاجئ عند مسح المتصفح، يمكنك تصدير نسخة احتياطية واسترجاعها بأي وقت:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-xs font-semibold text-zinc-200 transition-all"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>تصدير نسخة احتياطية</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-xs font-semibold text-zinc-200 transition-all cursor-pointer">
                <Upload className="w-4 h-4 text-orange-400" />
                <span>استيراد نسخة احتياطية</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Optional Test helper / Reset */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              إدارة البيانات
            </h3>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleLoadSamples}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 text-xs text-zinc-300 border border-zinc-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل 3 طلبات توضيحية لتجربة شكل اللوحة</span>
                </span>
                <span className="text-[10px] text-zinc-500">اختياري</span>
              </button>

              {showClearConfirm ? (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 space-y-2">
                  <p className="text-xs">
                    تأكيد: هل تريد فعلاً مسح جميع الطلبات الحالية؟
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="px-3 py-1 rounded text-xs bg-zinc-800 text-zinc-300"
                    >
                      تراجع
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="px-3 py-1 rounded text-xs bg-red-600 text-white font-bold"
                    >
                      مسح الكل
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs text-red-400 hover:bg-red-950/20 border border-red-900/30 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح كافة الطلبات (تفريغ النظام)</span>
                  </span>
                  <span className="text-[10px] text-red-500/70">إعادة ضبط</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
