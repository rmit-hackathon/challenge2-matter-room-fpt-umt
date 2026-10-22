import React from 'react';

interface LegalCardProps {
  variant?: 'surface' | 'muted' | 'accent';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LegalCard: React.FC<LegalCardProps> = ({
  variant = 'surface',
  title,
  children,
  className = '',
  onClick,
}) => {
  const bgClasses = {
    surface: 'bg-white border-[#E2E8F0] shadow-xs',
    muted: 'bg-[#F8FAFC] border-[#E2E8F0]',
    accent: 'bg-[#EFF6FF] border-[#BFDBFE]',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border transition-all ${bgClasses} ${
        onClick ? 'cursor-pointer hover:border-[#CBD5E1] hover:shadow-sm' : ''
      } ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">{title}</h3>
        </div>
      )}
      <div className={title ? 'p-4' : ''}>
        {children}
      </div>
    </div>
  );
};
