export const RESPONSIBILITY_CATEGORY_PALETTE = [
  {
    accent: '#5B9CF6',
    border: 'rgba(91,156,246,0.18)',
    background: 'rgba(91,156,246,0.04)',
  },
  {
    accent: '#34D399',
    border: 'rgba(52,211,153,0.18)',
    background: 'rgba(52,211,153,0.04)',
  },
  {
    accent: '#C084FC',
    border: 'rgba(192,132,252,0.18)',
    background: 'rgba(192,132,252,0.04)',
  },
  {
    accent: '#FB923C',
    border: 'rgba(251,146,60,0.18)',
    background: 'rgba(251,146,60,0.04)',
  },
  {
    accent: '#FBBF24',
    border: 'rgba(251,191,36,0.18)',
    background: 'rgba(251,191,36,0.04)',
  },
];

export const RESPONSIBILITY_COMPARISON_SERIES_PALETTE = [
  RESPONSIBILITY_CATEGORY_PALETTE[0]?.accent ?? '#5B9CF6',
  RESPONSIBILITY_CATEGORY_PALETTE[1]?.accent ?? '#34D399',
  RESPONSIBILITY_CATEGORY_PALETTE[2]?.accent ?? '#C084FC',
  RESPONSIBILITY_CATEGORY_PALETTE[3]?.accent ?? '#FB923C',
  RESPONSIBILITY_CATEGORY_PALETTE[4]?.accent ?? '#FBBF24',
];

export const SECURITY_CATEGORY_PALETTE = [
  '#5B9CF6',
  '#34D399',
  '#C084FC',
  '#FB923C',
  '#FBBF24',
  '#F87171',
];

export const SECURITY_COMPARISON_SERIES_PALETTE = SECURITY_CATEGORY_PALETTE;
