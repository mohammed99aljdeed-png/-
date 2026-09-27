import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { NexoraLogo } from './NexoraLogo';

export type NavTab = 'dashboard' | 'orders' | 'analytics';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  onOpenSettings: () => void;
  ordersCount: number;
  newOrdersCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  onOpenSettings,
  ordersCount,
  newOrdersCount,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'الرئيسية',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'orders' as NavTab,
      label: 'الطلبات',
      icon: Package,
      badge: ordersCount > 0 ? ordersCount : null,
      highlightBadge: newOrdersCount > 0,
    },
    {
      id: 'analytics' as NavTab,
      label: 'الإحصائيات',
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 flex flex-col bg-[#0d0d12] border-l border-zinc-800/80 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-[76px]' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-zinc-800/60">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => {
              onSelectTab('dashboard');
              onCloseMobile();
            }}
          >
            <NexoraLogo
              size={isCollapsed ? 'sm' : 'md'}
              showText={!isCollapsed}
              subtitle="Orders Manager"
            />
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            title={isCollapsed ? 'توسيع القائمة' : 'تصغير القائمة'}
          >
            {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onOpenAddModal();
              onCloseMobile();
            }}
            className={`w-full group relative flex items-center justify-center gap-2.5 rounded-xl font-medium transition-all duration-200 overflow-hidden shadow-lg shadow-orange-950/40 text-white ${
              isCollapsed ? 'h-11 px-0' : 'h-12 px-4'
            } bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#ff7828] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#ff8c38] active:scale-[0.98]`}
          >
            <PlusCircle className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-90 duration-300" />
            {!isCollapsed && (
              <span className="font-semibold text-sm tracking-wide whitespace-nowrap">
                إضافة طلب جديد
              </span>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          <div className={`px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ${isCollapsed ? 'hidden' : 'block'}`}>
            القائمة الرئيسية
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-l from-orange-500/15 to-transparent text-orange-400 border-r-2 border-orange-500 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-orange-500' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 text-right truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full tabular-nums ${
                      item.highlightBadge
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Store Info & Settings */}
        <div className="p-3 border-t border-zinc-800/60 space-y-2">
          {!isCollapsed && (
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/40 border border-zinc-800/80">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-zinc-300">لوحة التحكم الشخصية</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                نظام داخلي خاص بمتجر NEXORA لمتابعة وتنظيم طلبات الزبائن
              </p>
            </div>
          )}

          <button
            onClick={() => {
              onOpenSettings();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="إعدادات الواجهة والنسخ الاحتياطي"
          >
            <Settings className="w-5 h-5 shrink-0 text-zinc-400 group-hover:text-zinc-200" />
            {!isCollapsed && <span className="flex-1 text-right">إعدادات الواجهة</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Ultra convenient on iPhone/Android) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0d0d12]/95 backdrop-blur-md border-t border-zinc-800/80 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'dashboard' ? 'text-orange-500 font-semibold' : 'text-zinc-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => onSelectTab('orders')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'orders' ? 'text-orange-500 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>الطلبات</span>
          {ordersCount > 0 && (
            <span className="absolute -top-1 right-2 px-1.5 py-0.2 text-[10px] bg-orange-600 text-white rounded-full font-bold">
              {ordersCount}
            </span>
          )}
        </button>

        {/* Big Orange Center Add Button for Thumb Access */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-gradient-to-r from-[#c2410c] to-[#ff7828] text-white shadow-lg shadow-orange-950/60 active:scale-95 transition-transform"
          aria-label="إضافة طلب جديد"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'analytics' ? 'text-orange-500 font-semibold' : 'text-zinc-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>الإحصائيات</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>الإعدادات</span>
        </button>
      </div>
    </>
  );
};
