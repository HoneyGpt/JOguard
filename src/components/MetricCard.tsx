import React from 'react';
import { Card } from './Card';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  icon,
}) => {
  return (
    <Card padding="sm" className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-warm-500 dark:text-warm-400">{label}</p>
          <p className="text-xl font-bold text-warm-900 dark:text-warm-50 mt-1 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-[11px] font-medium text-warm-400 dark:text-warm-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="p-2 rounded-xl bg-warm-100 dark:bg-warm-700/60 text-terracotta-600 dark:text-terracotta-400 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
      </div>
    </Card>
  );
};
