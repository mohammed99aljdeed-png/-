import React from 'react';
import { Menu, Plus, Search, Calendar, ShieldCheck } from 'lucide-react';
import { NexoraLogo } from './NexoraLogo';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenAddModal: () => void;
  onToggleMobileMenu: () => void;
  totalOrders: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenAddModal,
  onToggleMobileMenu,
  totalOrders,
}) => {
  // Format current Arabic date (e.g. الأحد، 27 سبتمبر)
  const todayArabic = new Intl.DateTimeFormat('ar-LY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-20 h-20 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Right Zone: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          aria-label="القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo Brand */}
        <div className="lg:hidden flex items-center">
          <NexoraLogo size="sm" showText={true} />
        </div>

        {/* Desktop Page Title & Context */}
        <div className="hidden lg:flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight font-sans">
              {title}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono tabular-nums border border-zinc-700/50">
              {totalOrders} {totalOrders === 1 ? 'طلب' : 'طلبات'}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-zinc-400 tracking-wide mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Center Zone: Discreet Date / Status Ticker (Desktop only) */}
      <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-3.5 py-1.5 rounded-full">
        <Calendar className="w-3.5 h-3.5 text-orange-400" />
        <span>{todayArabic}</span>
        <span className="text-zinc-600">·</span>
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
          <span>لوحة الإدارة الشخصية</span>
        </div>
      </div>

      {/* Left Zone: Primary Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Main CTA: Add New Order */}
        <button
          onClick={onOpenAddModal}
          className="group flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#c2410c] via-[#ea580c] to-[#ff7828] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#ff8c38] shadow-md shadow-orange-950/40 hover:shadow-orange-600/25 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span className="whitespace-nowrap font-medium">إضافة طلب جديد</span>
        </button>
      </div>
    </header>
  );
};
