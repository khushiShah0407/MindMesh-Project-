import React, { useId } from 'react';

export const BrandMark = ({ className = 'brand-mark h-7 w-7', label }) => {
  const gradientId = `brand-mark-${useId().replaceAll(':', '')}`;
  const nodes = [
    [8, 56], [8, 8], [32, 48], [56, 8], [56, 56],
  ];
  const route = [
    [8, 56], [8, 8], [32, 48], [56, 8], [56, 56],
  ];
  const lineWidth = 1.6;
  const nodeRadius = 3;
  const trim = nodeRadius + 0.5;
  const connectors = route.slice(1).map(([x2, y2], index) => {
    const [x1, y1] = route[index];
    const length = Math.hypot(x2 - x1, y2 - y1);
    const dx = (x2 - x1) / length;
    const dy = (y2 - y1) / length;

    return `M${(x1 + dx * trim).toFixed(3)} ${(y1 + dy * trim).toFixed(3)}L${(x2 - dx * trim).toFixed(3)} ${(y2 - dy * trim).toFixed(3)}`;
  }).join('');

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.5" stopColor="#818cf8" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <path
        d={connectors}
        stroke={`url(#${gradientId})`}
        strokeWidth={lineWidth}
        strokeLinecap="round"
      />
      <g fill={`url(#${gradientId})`}>
        {nodes.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={nodeRadius} />)}
      </g>
    </svg>
  );
};
