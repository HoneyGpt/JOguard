import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  size = 'md',
}) => {
  const sizeConfig = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7.5', thumb: 'w-6 h-6', translate: 'translate-x-6.5' },
  };

  const { track, thumb, translate } = sizeConfig[size];

  return (
    <label className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`${track} relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 ${
          checked
            ? 'bg-terracotta-600 shadow-terracotta-glow'
            : 'bg-warm-300 dark:bg-warm-700'
        }`}
      >
        <span
          className={`${thumb} pointer-events-none transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
            checked ? translate : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-warm-800 dark:text-warm-200 select-none">{label}</span>}
    </label>
  );
};
