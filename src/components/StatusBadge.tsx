import React from 'react';
import { OrderStatus, ORDER_STATUSES } from '../types/order';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  interactive?: boolean;
  onStatusChange?: (newStatus: OrderStatus) => void;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const config = ORDER_STATUSES[status] || ORDER_STATUSES.new;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border transition-colors ${sizeClasses} ${className}`}
      style={{
        backgroundColor: config.badgeBg,
        borderColor: config.borderColor,
        color: config.badgeText,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: config.dotColor }}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap font-medium">{config.label}</span>
    </span>
  );
};
