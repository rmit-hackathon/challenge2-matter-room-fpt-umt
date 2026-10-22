import React, { useEffect, useState } from 'react';

const TRACK = '#E2E8F0';

function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return mounted;
}

export interface DonutSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerValue: string | number;
  centerLabel: string;
  activeKey?: string | null;
  onSelect?: (key: string) => void;
  size?: number;
  ariaLabel: string;
}

/**
 * Part-to-whole donut. Segments are separated by a fixed gap and start at 12 o'clock.
 * The stroke is drawn in with a dasharray transition on mount.
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  centerValue,
  centerLabel,
  activeKey = null,
  onSelect,
  size = 148,
  ariaLabel,
}) => {
  const mounted = useMounted();
  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const gap = 3;
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const visible = segments.filter(s => s.value > 0);

  let offset = 0;
  const arcs = visible.map(s => {
    const share = s.value / total;
    const length = Math.max(share * circumference - (visible.length > 1 ? gap : 0), 0);
    const arc = { ...s, length, offset };
    offset += share * circumference;
    return arc;
  });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={ariaLabel}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke={TRACK} strokeWidth={strokeWidth} />
        <g transform="rotate(-90 50 50)">
          {arcs.map(arc => {
            const dimmed = activeKey !== null && activeKey !== arc.key;
            return (
              <circle
                key={arc.key}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={activeKey === arc.key ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${mounted ? arc.length : 0} ${circumference}`}
                strokeDashoffset={-arc.offset}
                opacity={dimmed ? 0.3 : 1}
                style={{
                  transition: 'stroke-dasharray 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms, stroke-width 200ms',
                  cursor: onSelect ? 'pointer' : 'default',
                }}
                onClick={onSelect ? () => onSelect(arc.key) : undefined}
              >
                <title>{`${arc.label}: ${arc.value}`}</title>
              </circle>
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-[#0F172A] leading-none tabular-nums">{centerValue}</span>
        <span className="text-[11px] font-medium text-[#64748B] mt-1">{centerLabel}</span>
      </div>
    </div>
  );
};

export type RingSlotState = 'signed' | 'pending' | 'excluded';

export interface RingSlot {
  key: string;
  label: string;
  state: RingSlotState;
}

interface SegmentedRingProps {
  slots: RingSlot[];
  centerValue: string;
  centerLabel: string;
  size?: number;
  ariaLabel: string;
}

const SLOT_COLOR: Record<RingSlotState, string> = {
  signed: '#0F766E',
  pending: TRACK,
  excluded: '#B91C1C',
};

/**
 * One arc per keyholder: filled when signed, grey track while pending,
 * dashed red when the keyholder is excluded by a safeguard exception.
 */
export const SegmentedRing: React.FC<SegmentedRingProps> = ({
  slots,
  centerValue,
  centerLabel,
  size = 148,
  ariaLabel,
}) => {
  const mounted = useMounted();
  const radius = 40;
  const strokeWidth = 12;
  const slotAngle = 360 / slots.length;
  const gapAngle = 8;

  const pointAt = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: 50 + radius * Math.cos(rad), y: 50 + radius * Math.sin(rad) };
  };

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={ariaLabel}>
        {slots.map((slot, i) => {
          const a0 = i * slotAngle + gapAngle / 2;
          const a1 = (i + 1) * slotAngle - gapAngle / 2;
          const from = pointAt(a0);
          const to = pointAt(a1);
          const arcLength = (radius * (a1 - a0) * Math.PI) / 180;
          const d = `M ${from.x} ${from.y} A ${radius} ${radius} 0 0 1 ${to.x} ${to.y}`;
          const isExcluded = slot.state === 'excluded';
          const drawn = slot.state !== 'signed' || mounted;
          return (
            <path
              key={slot.key}
              d={d}
              fill="none"
              stroke={SLOT_COLOR[slot.state]}
              strokeWidth={strokeWidth}
              strokeLinecap="butt"
              strokeDasharray={isExcluded ? '4 3' : `${arcLength} ${arcLength}`}
              strokeDashoffset={isExcluded || drawn ? 0 : arcLength}
              style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)' }}
            >
              <title>{slot.label}</title>
            </path>
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-[#0F172A] leading-none tabular-nums">{centerValue}</span>
        <span className="text-[11px] font-medium text-[#64748B] mt-1">{centerLabel}</span>
      </div>
    </div>
  );
};

interface ShareBarProps {
  value: number;
  total: number;
  color: string;
}

/** Thin horizontal share bar with a rounded data-end, anchored at the left baseline. */
export const ShareBar: React.FC<ShareBarProps> = ({ value, total, color }) => {
  const mounted = useMounted();
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: mounted ? `${pct}%` : '0%',
          backgroundColor: color,
          transition: 'width 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  );
};
