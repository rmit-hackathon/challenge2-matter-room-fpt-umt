import React from 'react';

export type LegalBadgeVariant = 'slate' | 'teal' | 'amber' | 'navy' | 'rose';

interface LegalBadgeProps {
  variant?: LegalBadgeVariant;
  icon?: string;
  dot?: boolean;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<LegalBadgeVariant, {
  container: string;
  dotColor: string;
  iconColor: string;
}> = {
  // 1. Tag Trạng thái chờ / Bản nháp / Metadata (Neutral Slate)
  slate: {
    container: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    dotColor: 'bg-[#64748B]',
    iconColor: 'text-[#64748B]',
  },
  // 2. Tag Bảo vệ nhân chứng / Lưu trữ kín / Nạn nhân (Subtle Teal)
  teal: {
    container: 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1]',
    dotColor: 'bg-[#0D9488]',
    iconColor: 'text-[#0F766E]',
  },
  // 3. Tag Thủ tục / Ấn chỉ tố tụng / Quorum (Muted Legal Amber)
  amber: {
    container: 'bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]',
    dotColor: 'bg-[#D97706]',
    iconColor: 'text-[#B45309]',
  },
  // 4. Tag Nghiệp vụ Luật sư / Tài liệu Cấp 2 (Classic Legal Blue)
  navy: {
    container: 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE]',
    dotColor: 'bg-[#1E3A8A]',
    iconColor: 'text-[#1E3A8A]',
  },
  // 5. Cảnh báo bảo mật / Tấn công bị chặn (Subtle Security Rose)
  rose: {
    container: 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]',
    dotColor: 'bg-[#DC2626]',
    iconColor: 'text-[#991B1B]',
  },
};

const sizeStyles = {
  sm: 'text-[11px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium',
  lg: 'text-sm px-3 py-1 gap-2 font-semibold',
};

export const LegalBadge: React.FC<LegalBadgeProps> = ({
  variant = 'slate',
  icon,
  dot = false,
  pulse = false,
  size = 'md',
  children,
  className = '',
}) => {
  const config = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors select-none ${config.container} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      {icon && (
        <span className={`material-symbols-outlined text-[15px] shrink-0 leading-none ${config.iconColor}`}>
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
};
