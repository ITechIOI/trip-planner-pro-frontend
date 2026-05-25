interface UnpaidRingProps {
  pct: number;
  unpaidCount: number;
  totalCount: number;
}

const RADIUS = 36;
const CX = 44;
const CY = 44;
const STROKE_WIDTH = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function UnpaidRing({ pct, unpaidCount, totalCount }: UnpaidRingProps) {
  const dashOffset = CIRCUMFERENCE * (pct / 100);
  const ringColor = pct >= 50 ? '#E24B4A' : '#378ADD';

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-[88px] w-[88px] shrink-0">
        <svg width={88} height={88} aria-hidden="true">
          {/* Track */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={STROKE_WIDTH}
            className="dark:stroke-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${dashOffset} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${CX} ${CY})`}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {pct}%
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {unpaidCount}/{totalCount}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Unpaid Budget Items
        </p>
      </div>
    </div>
  );
}
