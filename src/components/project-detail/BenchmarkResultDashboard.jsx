import pdfIcon from '../../assets/icons/pdf.svg';
import {
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  RESPONSIBILITY_CATEGORY_PALETTE as CATEGORY_CARD_PALETTE,
  RESPONSIBILITY_COMPARISON_SERIES_PALETTE as COMPARISON_SERIES_PALETTE,
} from './projectDetailPalettes.js';

const SURFACE_CLASSNAME = 'overflow-hidden rounded-[16px] border border-[#1A3A5C]';
const CATEGORY_RADAR_DISPLAY_FLOOR = 20;
const BENCHMARK_RADAR_DISPLAY_FLOOR = 20;

const SCORE_STATUS_COLORS = {
  appropriate: '#34D399',
  review: '#FB923C',
  inappropriate: '#F87171',
};

function getResultScreen(sessionDetail) {
  const resultScreen = sessionDetail?.result_screen;
  return resultScreen && typeof resultScreen === 'object' ? resultScreen : null;
}

function getResultSource(sessionDetail) {
  return getResultScreen(sessionDetail) ?? sessionDetail ?? {};
}

function getNestedNumber(candidates) {
  for (const value of candidates) {
    const numberValue = Number(value);
    if (Number.isFinite(numberValue)) return numberValue;
  }
  return null;
}

function parseJsonSafely(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function clampScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(100, score));
}

function toNullableNumericScore(value) {
  if (value == null || value === '') return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function normalizeEvaluationStatus(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function isNotEvaluatedEntry(entry, extraStatuses = []) {
  if (entry?.not_evaluated === true) return true;

  return [
    entry?.evaluation_status,
    entry?.status,
    entry?.judge_status,
    entry?.result_status,
    entry?.validation_status,
    ...extraStatuses,
  ].some(value =>
    ['not_evaluated', 'unevaluated', 'not_verified', '미검증'].includes(
      normalizeEvaluationStatus(value)
    )
  );
}

function applyRadarDisplayValue(value, floor = 0) {
  const score = clampScore(value);
  if (score == null) return 0;
  return score + Math.max(0, Number(floor) || 0);
}

function getRadarDisplayDomainMax(floor = 0) {
  return 100 + Math.max(0, Number(floor) || 0);
}

function getRadarAxisTicks(floor = 0, step = 25) {
  const normalizedFloor = Math.max(0, Number(floor) || 0);
  const normalizedStep = Math.max(1, Number(step) || 25);
  const max = getRadarDisplayDomainMax(normalizedFloor);
  const ticks = [normalizedFloor];

  for (let current = normalizedFloor + normalizedStep; current < max; current += normalizedStep) {
    ticks.push(current);
  }

  ticks.push(max);
  return [...new Set(ticks)];
}

function parseDateTime(value) {
  const parsed = Date.parse(String(value ?? '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatExecutionDate(value) {
  const parsed = parseDateTime(value);
  if (!parsed) return '-';

  const parts = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .formatToParts(parsed)
    .reduce((accumulator, part) => {
      if (part.type !== 'literal') {
        accumulator[part.type] = part.value;
      }
      return accumulator;
    }, {});

  return `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}`;
}

function getRunRoundLabel(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const runNumber = Number(source?.hero?.run_number ?? source?.run_number ?? 0);
  return runNumber > 0 ? `${runNumber}회차` : '';
}

function getSummaryCounts(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const summaryCache = source?.summary_cache ?? {};
  const summary = source?.summary ?? {};
  const counts = source?.counts ?? {};
  const distribution = source?.status_distribution ?? {};
  const overview = source?.overview ?? {};
  const donutChart = source?.donut_chart ?? {};

  return {
    inappropriateCount:
      getNestedNumber([
        donutChart?.inappropriate_count,
        overview?.inappropriate_count,
        counts?.inappropriate_count,
        distribution?.inappropriate_count,
        summary?.inappropriate_count,
        summaryCache?.inappropriate_count,
        summaryCache?.fail_count,
      ]) ?? 0,
    reviewCount:
      getNestedNumber([
        donutChart?.needs_review_count,
        overview?.needs_review_count,
        counts?.needs_review_count,
        distribution?.needs_review_count,
        summary?.needs_review_count,
        summaryCache?.needs_review_count,
        summaryCache?.review_count,
      ]) ?? 0,
    appropriateCount:
      getNestedNumber([
        donutChart?.appropriate_count,
        overview?.appropriate_count,
        counts?.appropriate_count,
        distribution?.appropriate_count,
        summary?.appropriate_count,
        summaryCache?.appropriate_count,
        summaryCache?.safe_count,
      ]) ?? 0,
  };
}

function getHeroHeadline(sessionDetail) {
  const source = getResultSource(sessionDetail);
  return String(
    source?.hero?.headline ??
      source?.summary_text ??
      source?.conclusion_text ??
      source?.summary?.text ??
      source?.summary_cache?.conclusion_text ??
      source?.summary_cache?.ai_analysis ??
      ''
  ).trim();
}

function getHeroSubheadline(sessionDetail) {
  const source = getResultSource(sessionDetail);
  return String(source?.hero?.subheadline ?? source?.summary?.subheadline ?? '').trim();
}

function getOverallSafetyScore(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const summaryCache = source?.summary_cache ?? {};
  const summary = source?.summary ?? {};
  const overall = source?.overall ?? {};
  const overview = source?.overview ?? {};

  const preferredScores = [
    overview?.overall_score,
    source?.overall_safety_score,
    source?.overall_score,
    overall?.safety_score,
    overall?.score,
    summary?.overall_safety_score,
    summary?.overall_score,
    summaryCache?.overall_safety_score,
    summaryCache?.overall_score,
    source?.safety_total,
    source?.benchmark_comparison?.current?.overall_safety_score,
    source?.benchmark_comparison?.current?.overall_score,
    source?.baseline_benchmark?.current?.overall_safety_score,
    source?.baseline_benchmark?.current?.overall_score,
  ];

  for (const value of preferredScores) {
    const score = clampScore(value);
    if (score != null) return score;
  }

  const legacyRiskScore = Number(
    summaryCache?.overall_risk_score ?? summary?.overall_risk_score ?? source?.overall_risk_score
  );
  if (Number.isFinite(legacyRiskScore)) {
    return Math.max(0, Math.min(100, 100 - legacyRiskScore));
  }

  return 0;
}

function getOverallGrade(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const overview = source?.overview ?? {};
  const overviewGrade = String(overview?.overall_grade ?? '').trim();
  if (overviewGrade) return overviewGrade;

  const rawGrade =
    String(
      source?.overall_grade ??
        source?.summary?.overall_grade ??
        source?.overall?.grade ??
        source?.summary_cache?.overall_grade ??
        ''
    ).trim() ||
    String(source?.safety_level ?? '').trim() ||
    '-';

  if (rawGrade.includes('안전') || rawGrade.includes('적합')) {
    return '적절';
  }

  if (rawGrade.includes('검토')) return '검토 필요';
  if (rawGrade.includes('취약') || rawGrade.includes('부적합')) return '부적절';

  return rawGrade;
}

function getGradeTone(score, grade) {
  if (grade === '신뢰') return 'text-[#5B9CF6]';
  if (grade === '주의') return 'text-[#FBBF24]';
  if (grade === '위험') return 'text-[#F87171]';
  if (grade === '적절') return 'text-[#41C460]';
  if (grade === '검토 필요') return 'text-[#FB923C]';
  if (grade === '부적절') return 'text-[#F87171]';
  if (score >= 80) return 'text-[#41C460]';
  if (score >= 60) return 'text-[#5B9CF6]';
  if (score >= 40) return 'text-[#FBBF24]';
  return 'text-[#F87171]';
}

function deriveCategoryScore(entry) {
  const directScore = clampScore(
    entry?.safety_score ??
      entry?.avg_safety_score ??
      entry?.overall_safety_score ??
      entry?.avg_score ??
      entry?.score
  );
  if (directScore != null) return directScore;

  const avgRiskScore = Number(entry?.avg_risk_score);
  if (Number.isFinite(avgRiskScore)) {
    return Math.max(0, Math.min(100, 100 - avgRiskScore));
  }

  const appropriateCount = Number(entry?.appropriate ?? entry?.pass ?? 0);
  const reviewCount = Number(entry?.needs_review ?? entry?.review ?? 0);
  const inappropriateCount = Number(entry?.inappropriate ?? entry?.fail ?? 0);
  const totalCount = Number(entry?.count ?? appropriateCount + reviewCount + inappropriateCount);

  if (totalCount > 0) {
    return Math.round(((appropriateCount + reviewCount * 0.5) / totalCount) * 1000) / 10;
  }

  return 0;
}

function normalizeCategoryEntry(label, value) {
  const normalizedLabel = String(label ?? '').trim();
  if (!normalizedLabel) return null;

  const appropriateCount = Number(value?.appropriate ?? value?.pass ?? 0);
  const reviewCount = Number(value?.needs_review ?? value?.review ?? 0);
  const inappropriateCount = Number(value?.inappropriate ?? value?.fail ?? 0);
  const totalCount = Number(value?.count ?? appropriateCount + reviewCount + inappropriateCount);

  return {
    label: normalizedLabel,
    score: deriveCategoryScore(value),
    appropriateCount,
    reviewCount,
    inappropriateCount,
    totalCount,
    isNotEvaluated: isNotEvaluatedEntry(value),
  };
}

function getCategorySummaries(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const summaryCache = source?.summary_cache ?? {};
  const categoryCards = Array.isArray(source?.category_cards) ? source.category_cards : null;

  if (Array.isArray(categoryCards) && categoryCards.length > 0) {
    return categoryCards
      .map(item => normalizeCategoryEntry(item?.category ?? item?.label ?? item?.name, item))
      .filter(Boolean);
  }

  const rawByCategory =
    source?.responsibility_by_category ??
    source?.category_scores ??
    source?.category_summary ??
    source?.category_breakdown ??
    source?.category_items ??
    summaryCache?.responsibility_by_category ??
    summaryCache?.category_scores ??
    source?.responsibility_by_category ??
    parseJsonSafely(summaryCache?.responsibility_by_category_json, null);

  if (Array.isArray(rawByCategory)) {
    return rawByCategory
      .map(item =>
        normalizeCategoryEntry(
          item?.category ?? item?.label ?? item?.risk_category ?? item?.name,
          item
        )
      )
      .filter(Boolean);
  }

  if (rawByCategory && typeof rawByCategory === 'object') {
    return Object.entries(rawByCategory)
      .map(([label, value]) => normalizeCategoryEntry(label, value))
      .filter(Boolean);
  }

  const fallback = [
    ...(Array.isArray(source?.safety_breakdown) ? source.safety_breakdown : []),
    ...parseJsonSafely(summaryCache?.safety_breakdown_json, []),
  ];
  if (Array.isArray(fallback)) {
    return fallback
      .map(item =>
        normalizeCategoryEntry(
          item?.risk_category_label ??
            item?.category_label ??
            item?.risk_category ??
            item?.category,
          item
        )
      )
      .filter(Boolean);
  }

  return [];
}

function getScoreStatus(score) {
  const normalizedScore = Number(score);

  if (!Number.isFinite(normalizedScore)) return 'unknown';
  if (normalizedScore >= 70) return 'appropriate';
  if (normalizedScore >= 60) return 'review';
  return 'inappropriate';
}

function getScoreStatusColor(score) {
  const status = getScoreStatus(score);

  if (status === 'appropriate') return SCORE_STATUS_COLORS.appropriate;
  if (status === 'review') return SCORE_STATUS_COLORS.review;
  if (status === 'inappropriate') return SCORE_STATUS_COLORS.inappropriate;
  return '#5A6A7A';
}

function getStatusPalette(status) {
  if (status === '부적절') {
    return {
      chipClassName:
        'border border-[rgba(248,113,113,0.28)] bg-[rgba(248,113,113,0.14)] text-[#F87171]',
      matrixClassName:
        'border border-[rgba(248,113,113,0.28)] bg-[rgba(248,113,113,0.14)] text-[#F87171]',
      accentClassName: 'bg-[#F87171]',
    };
  }

  if (status === '검토 필요') {
    return {
      chipClassName:
        'border border-[rgba(251,146,60,0.28)] bg-[rgba(251,146,60,0.14)] text-[#FB923C]',
      matrixClassName:
        'border border-[rgba(251,146,60,0.28)] bg-[rgba(251,146,60,0.14)] text-[#FB923C]',
      accentClassName: 'bg-[#FB923C]',
    };
  }

  return {
    chipClassName:
      'border border-[rgba(52,211,153,0.28)] bg-[rgba(52,211,153,0.14)] text-[#34D399]',
    matrixClassName:
      'border border-[rgba(52,211,153,0.28)] bg-[rgba(52,211,153,0.14)] text-[#34D399]',
    accentClassName: 'bg-[#34D399]',
  };
}

function getCategoryTone(score) {
  return getScoreStatusColor(score);
}

function getScoreBandPalette(score) {
  const normalizedScore = Number(score);
  if (!Number.isFinite(normalizedScore)) {
    return {
      accent: '#5A6A7A',
      border: 'rgba(90,106,122,0.16)',
      background: 'rgba(26,44,78,0.36)',
      label: '',
    };
  }

  if (normalizedScore >= 70) {
    return {
      accent: SCORE_STATUS_COLORS.appropriate,
      border: 'rgba(52,211,153,0.28)',
      background: 'rgba(52,211,153,0.14)',
      label: '70+',
    };
  }

  if (normalizedScore >= 60) {
    return {
      accent: SCORE_STATUS_COLORS.review,
      border: 'rgba(251,146,60,0.28)',
      background: 'rgba(251,146,60,0.14)',
      label: '60-69',
    };
  }

  return {
    accent: SCORE_STATUS_COLORS.inappropriate,
    border: 'rgba(248,113,113,0.28)',
    background: 'rgba(248,113,113,0.14)',
    label: '59-',
  };
}

function buildRadarData(categorySummaries) {
  return categorySummaries.map(item => ({
    subject: item.label,
    value: item.isNotEvaluated ? null : item.score,
    displayValue: applyRadarDisplayValue(item.score, CATEGORY_RADAR_DISPLAY_FLOOR),
    fullMark: getRadarDisplayDomainMax(CATEGORY_RADAR_DISPLAY_FLOOR),
    color: getCategoryTone(item.score),
    isNotEvaluated: item.isNotEvaluated === true,
  }));
}

function getRadarData(sessionDetail, categorySummaries) {
  const source = getResultSource(sessionDetail);
  const radarChart = Array.isArray(source?.radar_chart) ? source.radar_chart : null;

  if (Array.isArray(radarChart) && radarChart.length > 0) {
    return radarChart
      .map(item => {
        const subject = String(item?.category ?? item?.label ?? '').trim();
        const value = clampScore(item?.score);
        const notEvaluated = isNotEvaluatedEntry(item);
        if (!subject || (value == null && !notEvaluated)) return null;
        return {
          subject,
          value: notEvaluated ? null : value,
          displayValue: applyRadarDisplayValue(value ?? 0, CATEGORY_RADAR_DISPLAY_FLOOR),
          fullMark: getRadarDisplayDomainMax(CATEGORY_RADAR_DISPLAY_FLOOR),
          color: getCategoryTone(value),
          isNotEvaluated: notEvaluated,
        };
      })
      .filter(Boolean);
  }

  return buildRadarData(categorySummaries);
}

function getHeatmap(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const heatmap = source?.heatmap;
  return heatmap && typeof heatmap === 'object' ? heatmap : null;
}

function getHeatmapColumns(sessionDetail, rows) {
  const heatmap = getHeatmap(sessionDetail);

  if (Array.isArray(heatmap?.column_averages) && heatmap.column_averages.length > 0) {
    return heatmap.column_averages
      .map(item => String(item?.question_format_label ?? item?.question_format ?? '').trim())
      .filter(Boolean);
  }

  if (Array.isArray(heatmap?.rows) && heatmap.rows.length > 0) {
    return [
      ...new Set(
        heatmap.rows.flatMap(row =>
          (Array.isArray(row?.cells) ? row.cells : [])
            .map(cell => String(cell?.question_format_label ?? cell?.question_format ?? '').trim())
            .filter(Boolean)
        )
      ),
    ];
  }

  return getMatrixColumns(rows);
}

function getTotalCount(sessionDetail) {
  const source = getResultSource(sessionDetail);

  return (
    getNestedNumber([
      source?.overview?.total_questions,
      source?.total_questions,
      source?.summary?.total_questions,
      source?.counts?.total_questions,
      sessionDetail?.total_questions,
    ]) ?? 0
  );
}

function getCompletedCount(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const totalCount = getTotalCount(sessionDetail);

  return (
    getNestedNumber([
      source?.overview?.completed_questions,
      source?.completed_questions,
      source?.summary?.completed_questions,
      source?.counts?.completed_questions,
      totalCount,
      sessionDetail?.completed_questions,
    ]) ?? 0
  );
}

function getMatrixColumns(rows) {
  return [...new Set(rows.flatMap(row => row.items.map(item => item.label).filter(Boolean)))];
}

function buildMatrixViewModel(rows, columns, categorySummaries, heatmap = null) {
  if (heatmap?.rows?.length) {
    const rowModels = heatmap.rows.map((row, index) => ({
      label: String(row?.category ?? '').trim(),
      score: clampScore(row?.category_average),
      palette: CATEGORY_CARD_PALETTE[index % CATEGORY_CARD_PALETTE.length],
      cells: columns.map(column => {
        const matched = (Array.isArray(row?.cells) ? row.cells : []).find(cell => {
          const cellLabel = String(
            cell?.question_format_label ?? cell?.question_format ?? ''
          ).trim();
          return cellLabel === column;
        });

        return {
          label: column,
          score: matched ? clampScore(matched?.score) : null,
        };
      }),
    }));

    const columnAverages = columns.map(column => {
      const matched = (Array.isArray(heatmap?.column_averages) ? heatmap.column_averages : []).find(
        item => {
          const label = String(item?.question_format_label ?? item?.question_format ?? '').trim();
          return label === column;
        }
      );

      return {
        label: column,
        score: matched ? clampScore(matched?.score) : null,
      };
    });

    const columnPaletteMap = new Map(
      columns.map((label, index) => [
        label,
        CATEGORY_CARD_PALETTE[index % CATEGORY_CARD_PALETTE.length],
      ])
    );

    return {
      rowModels,
      columnAverages,
      columnPaletteMap,
    };
  }

  const categoryScoreMap = new Map(categorySummaries.map(item => [item.label, item.score]));
  const categoryPaletteMap = new Map(
    categorySummaries.map((item, index) => [
      item.label,
      CATEGORY_CARD_PALETTE[index % CATEGORY_CARD_PALETTE.length],
    ])
  );

  const rowModels = rows.map(row => {
    const rowScore = categoryScoreMap.get(row.label) ?? null;
    const cells = columns.map(column => {
      const matched = row.items.find(item => item.label === column);
      if (!matched?.completed) return { label: column, score: null };
      return { label: column, score: rowScore };
    });

    return {
      label: row.label,
      score: rowScore,
      palette: categoryPaletteMap.get(row.label) ?? CATEGORY_CARD_PALETTE[0],
      cells,
    };
  });

  const columnAverages = columns.map(column => {
    const values = rowModels
      .map(row => row.cells.find(cell => cell.label === column)?.score)
      .filter(value => Number.isFinite(value));

    if (values.length === 0) {
      return { label: column, score: null };
    }

    const score = values.reduce((sum, value) => sum + value, 0) / values.length;
    return { label: column, score };
  });

  const columnPaletteMap = new Map(
    columns.map((label, index) => [
      label,
      CATEGORY_CARD_PALETTE[index % CATEGORY_CARD_PALETTE.length],
    ])
  );

  return {
    rowModels,
    columnAverages,
    columnPaletteMap,
  };
}

function buildBenchmarkScoreMap(entry) {
  const scoreMap = new Map();

  const rawSources = [
    entry?.category_scores,
    entry?.risk_scores,
    entry?.responsibility_by_category,
  ];

  rawSources.forEach(source => {
    if (!source || typeof source !== 'object') return;

    Object.entries(source).forEach(([label, value]) => {
      if (value && typeof value === 'object') {
        scoreMap.set(String(label).trim(), deriveCategoryScore(value));
      } else {
        const score = clampScore(value);
        if (score != null) scoreMap.set(String(label).trim(), score);
      }
    });
  });

  return scoreMap;
}

function buildBenchmarkScoreNotEvaluatedMap(entry) {
  const statusMap = new Map();

  const rawSources = [
    entry?.category_scores,
    entry?.risk_scores,
    entry?.responsibility_by_category,
  ];

  rawSources.forEach(source => {
    if (!source || typeof source !== 'object') return;

    Object.entries(source).forEach(([label, value]) => {
      if (value == null || (value && typeof value === 'object' && isNotEvaluatedEntry(value))) {
        statusMap.set(String(label).trim(), true);
      }
    });
  });

  return statusMap;
}

function buildBenchmarkComparison(sessionDetail, categorySummaries) {
  const source = getResultSource(sessionDetail);
  const benchmarkCompare = source?.benchmark_compare;
  const categoryAccentMap = new Map(
    categorySummaries.map((item, index) => [
      item.label,
      CATEGORY_CARD_PALETTE[index % CATEGORY_CARD_PALETTE.length]?.accent ?? '#5B9CF6',
    ])
  );

  if (benchmarkCompare && typeof benchmarkCompare === 'object') {
    const radarSeries = Array.isArray(benchmarkCompare?.radar_series)
      ? benchmarkCompare.radar_series
      : [];
    const leaderboard = Array.isArray(benchmarkCompare?.leaderboard)
      ? benchmarkCompare.leaderboard
      : [];

    const currentRadarEntry =
      radarSeries.find(item => item?.is_current) ??
      (benchmarkCompare?.current ? { ...benchmarkCompare.current, is_current: true } : null);

    const currentSeries = currentRadarEntry
      ? {
          key: 'current',
          label:
            String(
              currentRadarEntry?.model_label ??
                currentRadarEntry?.model_key ??
                benchmarkCompare?.current?.model_label ??
                '현재'
            ).trim() || '현재',
          shortLabel: '현재',
          score:
            clampScore(
              benchmarkCompare?.current?.overall_score ?? currentRadarEntry?.overall_score
            ) ?? getOverallSafetyScore(sessionDetail),
          color: COMPARISON_SERIES_PALETTE[0],
          glow: true,
          scoreMap: buildBenchmarkScoreMap(currentRadarEntry),
        }
      : {
          key: 'current',
          label: '현재',
          shortLabel: '현재',
          score: getOverallSafetyScore(sessionDetail),
          color: COMPARISON_SERIES_PALETTE[0],
          glow: true,
          scoreMap: new Map(categorySummaries.map(item => [item.label, item.score])),
        };

    const fallbackTopModelLabel = String(
      benchmarkCompare?.top_model?.model_label ?? benchmarkCompare?.top_model?.model_key ?? ''
    ).trim();

    const baselineSeries = radarSeries
      .filter(item => !item?.is_current)
      .map((item, index) => {
        const leaderboardMatch = leaderboard.find(entry => {
          const entryLabel = String(entry?.model_label ?? entry?.model_key ?? '').trim();
          const itemLabel = String(item?.model_label ?? item?.model_key ?? '').trim();
          return entryLabel && itemLabel && entryLabel === itemLabel;
        });

        return {
          key: `baseline-${index}`,
          label:
            String(
              item?.model_label ?? item?.model_key ?? item?.vendor ?? `기준 ${index + 1}`
            ).trim() || `기준 ${index + 1}`,
          shortLabel:
            String(item?.model_label ?? item?.model_key ?? `기준 ${index + 1}`).trim() ||
            `기준 ${index + 1}`,
          score: clampScore(leaderboardMatch?.overall_score ?? item?.overall_score) ?? 0,
          color: COMPARISON_SERIES_PALETTE[(index + 1) % COMPARISON_SERIES_PALETTE.length],
          glow: false,
          scoreMap: buildBenchmarkScoreMap(item),
          scoreNotEvaluatedMap: buildBenchmarkScoreNotEvaluatedMap(item),
        };
      })
      .filter(item => item.score > 0 || item.scoreMap.size > 0);

    const series = [currentSeries, ...baselineSeries];
    const bestBaseline =
      baselineSeries.find(
        item => fallbackTopModelLabel && String(item.label).trim() === fallbackTopModelLabel
      ) ??
      [...baselineSeries].sort((a, b) => b.score - a.score)[0] ??
      null;

    const categoryLabels = [
      ...new Set([
        ...categorySummaries.map(item => item.label),
        ...[...currentSeries.scoreMap.keys()],
        ...baselineSeries.flatMap(item => [...item.scoreMap.keys()]),
        ...Object.keys(benchmarkCompare?.delta_vs_top?.category_deltas ?? {}),
      ]),
    ].slice(0, 6);

    const radarData = categoryLabels.map(label => {
      const row = { subject: label };
      series.forEach(item => {
        const score = item.scoreMap.get(label) ?? 0;
        row[item.key] = score;
        row[`${item.key}Display`] = applyRadarDisplayValue(score, BENCHMARK_RADAR_DISPLAY_FLOOR);
        row[`${item.key}IsNotEvaluated`] = item.scoreNotEvaluatedMap?.get(label) === true;
      });
      return row;
    });

    const categoryComparisonRows = bestBaseline
      ? categoryLabels.map(label => {
          const currentScore = currentSeries.scoreNotEvaluatedMap?.get(label)
            ? null
            : toNullableNumericScore(currentSeries.scoreMap.get(label));
          const benchmarkScore = bestBaseline.scoreNotEvaluatedMap?.get(label)
            ? null
            : toNullableNumericScore(bestBaseline.scoreMap.get(label));
          const directDelta = benchmarkCompare?.delta_vs_top?.category_deltas?.[label];
          const gap =
            Number.isFinite(Number(directDelta)) &&
            bestBaseline.scoreMap.size === 0 &&
            currentScore != null &&
            benchmarkScore != null
              ? Number(directDelta)
              : currentScore != null && benchmarkScore != null
                ? currentScore - benchmarkScore
                : null;

          return {
            key: label,
            label,
            currentScore,
            benchmarkScore,
            gap,
          };
        })
      : [];

    return { series, bestBaseline, radarData, categoryComparisonRows, categoryAccentMap };
  }

  const baselineBenchmark = source?.benchmark_comparison ?? source?.baseline_benchmark;
  const baselines = Array.isArray(baselineBenchmark?.baselines) ? baselineBenchmark.baselines : [];

  const currentScoreMap = new Map(categorySummaries.map(item => [item.label, item.score]));
  const currentScoreNotEvaluatedMap = new Map(
    categorySummaries.map(item => [item.label, item.isNotEvaluated === true])
  );
  const currentOverallScore = getOverallSafetyScore(sessionDetail);

  const currentSeries = {
    key: 'current',
    label: '현재',
    shortLabel: '현재',
    score: currentOverallScore,
    color: COMPARISON_SERIES_PALETTE[0],
    glow: true,
    scoreMap: currentScoreMap,
    scoreNotEvaluatedMap: currentScoreNotEvaluatedMap,
  };

  const baselineSeries = baselines
    .map((baseline, index) => ({
      key: `baseline-${index}`,
      label:
        String(
          baseline?.model_label ??
            baseline?.model_key ??
            baseline?.name ??
            baseline?.vendor ??
            `기준 ${index + 1}`
        ).trim() || `기준 ${index + 1}`,
      shortLabel:
        String(
          baseline?.model_label ??
            baseline?.short_name ??
            baseline?.model_key ??
            baseline?.name ??
            `기준 ${index + 1}`
        ).trim() || `기준 ${index + 1}`,
      score:
        clampScore(baseline?.overall_safety_score ?? baseline?.overall_score ?? baseline?.score) ??
        0,
      color: COMPARISON_SERIES_PALETTE[(index + 1) % COMPARISON_SERIES_PALETTE.length],
      glow: false,
      scoreMap: buildBenchmarkScoreMap(baseline),
      scoreNotEvaluatedMap: buildBenchmarkScoreNotEvaluatedMap(baseline),
    }))
    .filter(item => item.scoreMap.size > 0 || item.score > 0);

  const series = [currentSeries, ...baselineSeries];
  const bestBaseline = [...baselineSeries].sort((a, b) => b.score - a.score)[0] ?? null;

  const categoryLabels = [
    ...new Set([
      ...categorySummaries.map(item => item.label),
      ...(bestBaseline ? [...bestBaseline.scoreMap.keys()] : []),
    ]),
  ].slice(0, 6);

  const radarData = categoryLabels.map(label => {
    const row = { subject: label };
    series.forEach(item => {
      const score = item.scoreMap.get(label) ?? 0;
      row[item.key] = score;
      row[`${item.key}Display`] = applyRadarDisplayValue(score, BENCHMARK_RADAR_DISPLAY_FLOOR);
      row[`${item.key}IsNotEvaluated`] = item.scoreNotEvaluatedMap?.get(label) === true;
    });
    return row;
  });

  const categoryComparisonRows = bestBaseline
    ? categoryLabels.map(label => {
        const currentScore = currentSeries.scoreNotEvaluatedMap?.get(label)
          ? null
          : toNullableNumericScore(currentSeries.scoreMap.get(label));
        const benchmarkScore = bestBaseline.scoreNotEvaluatedMap?.get(label)
          ? null
          : toNullableNumericScore(bestBaseline.scoreMap.get(label));

        return {
          key: label,
          label,
          currentScore,
          benchmarkScore,
          gap:
            currentScore != null && benchmarkScore != null ? currentScore - benchmarkScore : null,
        };
      })
    : [];

  return { series, bestBaseline, radarData, categoryComparisonRows, categoryAccentMap };
}

function getInsightItems(sessionDetail, categorySummaries, counts) {
  const source = getResultSource(sessionDetail);
  const directInsights = Array.isArray(source?.insights)
    ? source.insights.map(item => String(item ?? '').trim()).filter(Boolean)
    : [];

  if (directInsights.length > 0) {
    return directInsights.slice(0, 5);
  }

  if (categorySummaries.length === 0) return [];

  const sortedByScore = [...categorySummaries].sort((a, b) => a.score - b.score);
  const lowest = sortedByScore[0];
  const highestReview = [...categorySummaries].sort((a, b) => b.reviewCount - a.reviewCount)[0];
  const strongest = [...categorySummaries].sort((a, b) => b.score - a.score)[0];

  const items = [];

  if (lowest) {
    items.push(
      `${lowest.label} 범주의 안전도가 가장 낮습니다. 현재 ${lowest.score.toFixed(1)}점으로 우선 확인이 필요합니다.`
    );
  }

  if (highestReview && highestReview.reviewCount > 0) {
    items.push(
      `${highestReview.label} 범주에서 검토 필요 판정이 ${highestReview.reviewCount}건으로 가장 많습니다.`
    );
  }

  if (strongest) {
    items.push(
      `${strongest.label} 범주는 ${strongest.score.toFixed(1)}점으로 가장 안정적으로 나타났습니다.`
    );
  }

  if (counts.inappropriateCount > 0) {
    items.push(
      `부적절 ${counts.inappropriateCount}건은 후속 조치 기준을 먼저 확정하는 것이 좋습니다.`
    );
  }

  return items.slice(0, 4);
}

function getDetailHighlights(sessionDetail) {
  const source = getResultSource(sessionDetail);
  const items = Array.isArray(source?.detail_highlights) ? source.detail_highlights : [];

  const directHighlights = items
    .map((item, index) => ({
      key: `${item?.question_id ?? index}-${item?.category ?? ''}-${item?.question_format ?? ''}`,
      category: String(item?.category ?? '').trim(),
      questionFormat:
        String(item?.question_format_label ?? item?.question_format ?? '').trim() || '-',
      outcomeLabel: String(item?.outcome_label ?? '').trim() || '-',
      failureType: String(item?.failure_type ?? '').trim() || '-',
      questionText: String(item?.question_text ?? '').trim(),
      targetResponse: String(item?.target_response ?? '').trim(),
      judgeReason: String(item?.judge_reason ?? '').trim(),
    }))
    .filter(item => item.category || item.questionText);

  if (directHighlights.length > 0) {
    return directHighlights;
  }

  const summaryRows = Array.isArray(source?.summary_rows) ? source.summary_rows : [];
  const summaryRowHighlights = summaryRows
    .map((item, index) => {
      const passed = item?.pass_fail;
      return {
        key: `summary-row-${index}-${item?.Category ?? item?.category ?? ''}`,
        category: String(item?.Category ?? item?.category ?? '').trim(),
        questionFormat: String(item?.question_format ?? item?.questionFormat ?? '').trim() || '-',
        outcomeLabel:
          passed === true
            ? '적절'
            : passed === false
              ? '부적절'
              : String(item?.status ?? '-').trim(),
        failureType: passed === false ? '일관 실패' : '-',
        questionText: String(item?.question ?? item?.question_text ?? '').trim(),
        targetResponse: String(item?.response ?? item?.target_response ?? '').trim(),
        judgeReason: String(item?.reason ?? '').trim(),
      };
    })
    .filter(item => item.category || item.questionText);

  if (summaryRowHighlights.length > 0) {
    return summaryRowHighlights;
  }

  const executions = Array.isArray(source?.executions) ? source.executions : [];
  return executions
    .map((item, index) => {
      const result = item?.responsibility_result ?? {};
      const passed =
        result?.pass_fail ?? item?.final_pass ?? item?.pass_fail ?? item?.is_pass ?? undefined;

      return {
        key: `execution-${item?.id ?? index}-${item?.category ?? ''}`,
        category: String(item?.category ?? '').trim(),
        questionFormat: String(item?.question_format ?? item?.questionFormat ?? '').trim() || '-',
        outcomeLabel:
          passed === true
            ? '적절'
            : passed === false
              ? '부적절'
              : String(item?.status ?? '-').trim(),
        failureType: passed === false ? '일관 실패' : '-',
        questionText: String(item?.question_text ?? item?.question ?? '').trim(),
        targetResponse: String(result?.target_response ?? item?.target_response ?? '').trim(),
        judgeReason: String(result?.reason ?? item?.reason ?? '').trim(),
      };
    })
    .filter(item => item.category || item.questionText);
}

function SummaryHeroCard({ score, grade, toneClassName }) {
  const isScoreEmpty = score == null || score === '-';
  const gradeLabel = grade == null || grade === '' ? '-' : grade;
  return (
    <article className="flex h-[93px] items-center justify-center overflow-hidden rounded-[12px] border border-[#1A3A5C] px-5 py-[28px]">
      <div className="flex w-[128px] flex-col items-center justify-center">
        <p className="text-center text-[11px] font-normal leading-4 text-white">종합 신뢰성 등급</p>

        <div className="mt-[2px] flex items-end justify-center gap-[2px]">
          <span className="text-center text-[30.7px] font-bold leading-[31px] text-white">
            {isScoreEmpty ? '-' : score.toFixed(1)}
          </span>
          {!isScoreEmpty ? (
            <span className="mb-[2px] text-center text-[11px] font-normal leading-4 text-white">
              점
            </span>
          ) : null}
        </div>

        <p
          className={`mt-[2px] text-center text-[18px] font-bold leading-[27px] ${toneClassName}`.trim()}
        >
          {gradeLabel}
        </p>
      </div>
    </article>
  );
}
function CountCard({ label, value, toneColor }) {
  const isValueEmpty = value == null || value === '-';
  return (
    <article className={`${SURFACE_CLASSNAME} h-[93px] px-[16px] py-[14px]`.trim()}>
      <p className="text-[10px] leading-[15px] tracking-[0.04em] text-white">{label}</p>

      <div className="mt-[9px] flex items-end">
        <span className="text-[26px] font-bold leading-[39px]" style={{ color: toneColor }}>
          {value}
        </span>

        {!isValueEmpty ? (
          <span className="ml-[2px] mb-[6px] text-[11px] leading-4 text-white">건</span>
        ) : null}
      </div>
    </article>
  );
}

function StatusDistributionSection({ appropriateCount, reviewCount, inappropriateCount }) {
  const chartData = [
    { name: '적절', value: appropriateCount, color: SCORE_STATUS_COLORS.appropriate },
    { name: '검토 필요', value: reviewCount, color: SCORE_STATUS_COLORS.review },
    { name: '부적절', value: inappropriateCount, color: SCORE_STATUS_COLORS.inappropriate },
  ];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className={`${SURFACE_CLASSNAME} h-[392px]`.trim()}>
      <div className="flex items-center border-b border-[#1C2A38] px-[22px] py-[15px]">
        <p className="text-[13px] font-bold leading-5 text-white">상태 분포</p>
      </div>

      <div className="px-5 py-6">
        <div className="flex h-[300px] flex-col">
          <div className="relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={98}
                  outerRadius={110}
                  startAngle={90}
                  endAngle={-270}
                  cornerRadius={4}
                  stroke="none"
                >
                  {chartData.map(item => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[26px] font-bold text-white">{total}</span>
              <span className="text-[12px] text-[#94A3B8]">Total</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
            {chartData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-[#94A3B8]">{item.name}</span>
                <span className="font-semibold text-white">{item.value}건</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RadarAxisTick({ x, y, payload }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#D6E7FF"
      fontSize="10"
      fontWeight="700"
    >
      {payload.value}
    </text>
  );
}

function SafetyRadarTooltip({ active, payload, label }) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;

  const point =
    payload.find(item => typeof item?.payload?.value === 'number') ??
    payload.find(item => typeof item?.value === 'number') ??
    payload[0];
  const value = Number(point?.payload?.value ?? point?.value ?? 0);
  const isNotEvaluated = point?.payload?.isNotEvaluated === true;

  return (
    <div className="rounded-[10px] border border-[rgba(109,235,253,0.24)] bg-[#0D1F3C] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
      <p className="text-[11px] font-semibold leading-4 text-white">{label}</p>
      <p className="mt-1 text-[12px] font-bold leading-4 text-[#6DEBFD]">
        {isNotEvaluated ? '미검증' : `신뢰 점수 ${value.toFixed(1)}`}
      </p>
    </div>
  );
}

function BenchmarkComparisonRadarTooltip({ active, payload, label }) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;

  const getSeriesKey = item => {
    const dataKey = String(item?.dataKey ?? '').trim();
    if (dataKey) return dataKey.replace('Display', '');
    return String(item?.name ?? '').trim() === '현재' ? 'current' : '';
  };

  const items = payload
    .map(item => {
      const seriesKey = getSeriesKey(item);
      return {
        label: String(item?.name ?? seriesKey).trim(),
        color: item?.stroke ?? item?.color ?? '#C8D8E8',
        isNotEvaluated: item?.payload?.[`${seriesKey}IsNotEvaluated`] === true,
        value: Number(item?.payload?.[seriesKey] ?? 0),
      };
    })
    .filter(item => item.label);

  if (items.length === 0) return null;

  return (
    <div className="rounded-[10px] border border-[rgba(109,235,253,0.2)] bg-[#0D1F3C] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
      <p className="text-[11px] font-semibold leading-4 text-white">{label}</p>
      <div className="mt-2 grid gap-1.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-white">{item.label}</span>
            </div>
            <span className="font-bold text-white">
              {item.isNotEvaluated ? '미검증' : item.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptySectionCard({ message, className = '' }) {
  return (
    <div
      className={`flex min-h-[8rem] items-center justify-center rounded-[12px] border border-[#1A3A5C] px-5 py-6 text-center text-[12px] text-white ${className}`.trim()}
    >
      {message}
    </div>
  );
}

function CategorySafetySection({ categorySummaries, radarData }) {
  const radarDomainMax = getRadarDisplayDomainMax(CATEGORY_RADAR_DISPLAY_FLOOR);
  const radarTicks = getRadarAxisTicks(CATEGORY_RADAR_DISPLAY_FLOOR);

  return (
    <section className={`${SURFACE_CLASSNAME}`.trim()}>
      <div className="flex items-center border-b border-[#1C2A38] px-[22px] py-[15px]">
        <p className="text-[13px] font-bold leading-5 text-white">검증 범주별 신뢰도</p>
      </div>

      <div className="px-5 py-5">
        <div className="flex min-h-[294px] items-center justify-center">
          <div className="h-[300px] w-[300px] rounded-[14px]">
            <div className="h-full w-full">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid gridType="polygon" stroke="rgba(109,235,253,0.2)" radialLines />
                    <PolarRadiusAxis
                      domain={[0, radarDomainMax]}
                      ticks={radarTicks}
                      tick={false}
                      axisLine={false}
                    />
                    <PolarAngleAxis dataKey="subject" tick={<RadarAxisTick />} />
                    <Tooltip content={<SafetyRadarTooltip />} />
                    <Radar
                      dataKey="displayValue"
                      stroke="#6DEBFD"
                      fill="rgba(109,235,253,0.35)"
                      fillOpacity={1}
                      strokeWidth={4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-[12px] text-white">
                  카테고리 데이터가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightSection({ items }) {
  return (
    <section className="mt-6">
      <div className="mb-4">
        <h3 className="text-[16px] font-bold leading-6 text-[#E8EDF5]">분석 및 인사이트</h3>
      </div>
      {items.length > 0 ? (
        <div className="grid gap-2">
          {items.map((item, index) => (
            <article key={`${index}-${item}`} className={`${SURFACE_CLASSNAME} px-5 py-4`.trim()}>
              <div className="flex items-center gap-3">
                <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[rgba(46,213,115,0.19)] bg-[rgba(46,213,115,0.08)] text-[18px] font-black text-[#2ED573]">
                  {index + 1}
                </div>
                <p className="text-[14px] font-bold leading-[150%] text-[#E8EDF5]">{item}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptySectionCard message="표시할 인사이트가 없습니다." />
      )}
    </section>
  );
}

function ResponsibilityDetailSection({ items, isDownloading, onDownloadCsv }) {
  const riskyItems = items
    .filter(item => item.outcomeLabel === '부적절' || item.outcomeLabel === '검토 필요')
    .slice(0, 5);

  return (
    <section className={`${SURFACE_CLASSNAME} mt-6 overflow-hidden`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <h3 className="text-[14px] font-bold text-[#E8EDF5]">주요 부적절 내역</h3>
        <button
          type="button"
          onClick={onDownloadCsv}
          disabled={isDownloading}
          className="rounded-[8px] border border-[#1A3A5C] bg-[rgba(19,40,73,0.7)] px-4 py-2 text-[12px] text-white transition hover:bg-[rgba(25,49,86,0.95)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDownloading ? '다운로드 중...' : '전체 결과 CSV 다운로드'}
        </button>
      </div>

      <div className="px-5 pb-5">
        {/* 헤더 */}
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr] gap-4 border-b border-[#1A3A5C] pb-3 text-[11px] text-white">
          <div className="truncate">검증 항목</div>
          <div className="truncate">질문 형식</div>
          <div>판정</div>
          <div>실패 유형</div>
        </div>

        {/* 리스트 */}
        <div className="grid gap-3 pt-3">
          {riskyItems.length > 0 ? (
            riskyItems.map(item => {
              const palette = getStatusPalette(item.outcomeLabel);

              return (
                <div
                  key={item.key}
                  className="grid grid-cols-[2fr_1.2fr_1fr_1fr] items-center gap-4 text-[12px]"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{item.category}</p>
                  </div>

                  <div className="text-white truncate">{item.questionFormat}</div>

                  <div>
                    <span
                      className={`inline-flex min-h-6 items-center rounded-[8px] px-3 text-[11px] font-bold ${palette.chipClassName}`}
                    >
                      {item.outcomeLabel}
                    </span>
                  </div>

                  <div className="text-white truncate">{item.failureType}</div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-[12px] text-white">
              부적절하거나 검토가 필요한 사례가 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function MatrixLegend() {
  const items = [
    { label: '70+', score: 70 },
    { label: '60-69', score: 65 },
    { label: '59-', score: 50 },
  ].map(item => ({
    label: item.label,
    palette: getScoreBandPalette(item.score),
  }));

  return (
    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-2">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-[5px]">
          <span
            className="h-[10px] w-[10px] rounded-[2px] border"
            style={{
              backgroundColor: item.palette.background,
              borderColor: item.palette.border,
            }}
          />
          <span className="text-[10px] font-bold leading-[15px] text-white">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function MatrixHeaderScoreCell({ label, score }) {
  const scorePalette = getScoreBandPalette(score);

  return (
    <div className="flex h-[60px] flex-col items-center justify-center rounded-[7px] px-[6px] py-[7px]">
      <span className="text-center text-[11px] font-semibold leading-4 text-white">{label}</span>
      <span
        className="mt-1 text-center text-[16px] font-bold leading-6"
        style={{ color: scorePalette.accent }}
      >
        {score == null ? '-' : Math.round(score)}
      </span>
    </div>
  );
}

function MatrixValueCell({ score, average = false }) {
  if (score == null) {
    return (
      <div className="flex h-[47px] items-center justify-center rounded-[8px] border border-[rgba(28,42,56,0.5)] bg-[rgba(28,42,56,0.24)] text-[12px] font-semibold text-white">
        -
      </div>
    );
  }

  const palette = getScoreBandPalette(score);

  const backgroundColor = average ? palette.background.replace('0.14', '0.07') : palette.background;

  const borderColor = average ? palette.border.replace('0.28', '0.15') : palette.border;

  return (
    <div
      className="flex h-[47px] items-center justify-center rounded-[8px] border text-[19px] font-bold leading-[19px]"
      style={{
        backgroundColor,
        borderColor,
        color: palette.accent,
      }}
    >
      {Math.round(score)}
    </div>
  );
}

function MatrixRowLabel({ label }) {
  return (
    <div className="flex items-center">
      <span className="text-[12px] font-semibold leading-[18px] text-white">{label}</span>
    </div>
  );
}

function ValidationMatrixSection({ rows, columns, categorySummaries, heatmap }) {
  const matrix = buildMatrixViewModel(rows, columns, categorySummaries, heatmap);

  const matrixGridTemplate = `
    minmax(128px, 1.5fr)
    repeat(${columns.length}, minmax(64px, 1fr))
    minmax(92px, 1fr)
  `;

  const validColumnScores = matrix.columnAverages.filter(column => column.score != null);
  const overallAverage =
    validColumnScores.reduce((sum, column) => sum + column.score, 0) /
      Math.max(1, validColumnScores.length) || null;

  return (
    <section className={`${SURFACE_CLASSNAME} mt-6`.trim()}>
      <div className="flex items-center border-b border-[#1C2A38] px-[22px] py-[15px]">
        <p className="text-[15px] font-bold leading-6 text-white">카테고리 × 질문 유형</p>
      </div>

      <div className="flex flex-col gap-5 px-[22px] py-[18px]">
        <MatrixLegend />

        <div className="overflow-x-auto">
          <div className="min-w-0 rounded-[8px]">
            <div
              className="grid items-center gap-[8px] pb-[6px]"
              style={{ gridTemplateColumns: matrixGridTemplate }}
            >
              <div />
              {matrix.columnAverages.map(column => (
                <MatrixHeaderScoreCell
                  key={`header-${column.label}`}
                  label={column.label}
                  score={column.score}
                  palette={matrix.columnPaletteMap.get(column.label)}
                />
              ))}
              <div className="flex min-w-0 items-center justify-center px-[8px] text-center text-[12px] font-bold leading-[18px] text-white">
                카테고리 평균
              </div>
            </div>

            <div className="grid gap-[6px]">
              {matrix.rowModels.map(row => {
                const validCells = row.cells.filter(cell => cell.score != null);
                const rowAverage =
                  validCells.reduce((sum, cell) => sum + cell.score, 0) /
                    Math.max(1, validCells.length) || null;

                return (
                  <div
                    key={row.label}
                    className="grid items-center gap-[8px]"
                    style={{ gridTemplateColumns: matrixGridTemplate }}
                  >
                    <MatrixRowLabel label={row.label} />
                    {row.cells.map(cell => (
                      <MatrixValueCell key={`${row.label}-${cell.label}`} score={cell.score} />
                    ))}
                    <MatrixValueCell score={rowAverage} average />
                  </div>
                );
              })}

              <div
                className="grid items-center gap-[8px] pt-[4px]"
                style={{ gridTemplateColumns: matrixGridTemplate }}
              >
                <div className="min-w-0 px-[8px] text-[12px] font-bold leading-[18px] text-white">
                  질문유형 평균
                </div>

                {matrix.columnAverages.map(column => (
                  <MatrixValueCell
                    key={`footer-${column.label}`}
                    score={column.score}
                    average
                    paletteOverride={matrix.columnPaletteMap.get(column.label)}
                  />
                ))}

                <MatrixValueCell score={overallAverage} average />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenchmarkComparisonSection({ comparison }) {
  const hasComparison = Boolean(comparison && comparison.series.length > 0);
  const radarDomainMax = getRadarDisplayDomainMax(BENCHMARK_RADAR_DISPLAY_FLOOR);
  const radarTicks = getRadarAxisTicks(BENCHMARK_RADAR_DISPLAY_FLOOR);
  const radarSeries = hasComparison
    ? [
        ...comparison.series.filter(item => item.key !== 'current'),
        ...comparison.series.filter(item => item.key === 'current'),
      ]
    : [];

  return (
    <section className={`${SURFACE_CLASSNAME} mt-6`.trim()}>
      <div className="flex items-center border-b border-[#1C2A38] px-[22px] py-[15px]">
        <div className="flex flex-col">
          <p className="text-[13px] font-bold leading-5 text-white">벤치마크 비교</p>
          <p className="text-[11px] leading-4 text-white">
            현재 결과와 상용 모델의 범주별 신뢰도를 비교합니다.
          </p>
        </div>
      </div>

      {!hasComparison ? (
        <div className="px-6 py-6">
          <EmptySectionCard message="비교 가능한 벤치마크 데이터가 없습니다." />
        </div>
      ) : comparison.bestBaseline ? (
        <>
          <div className="grid border-b border-[#1C2A38] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="border-r border-[#1C2A38] px-6 py-[21px]">
              <p className="text-[11px] font-medium leading-4 text-white">종합 점수</p>
              <div className="mt-[18px] grid gap-4">
                {comparison.series.map((item, index) => (
                  <div
                    key={item.key}
                    className="grid grid-cols-[20px_minmax(0,1fr)_46px] items-center gap-[14px]"
                  >
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-[5px] text-[10px] font-bold ${
                        index === 0
                          ? 'bg-[rgba(251,191,36,0.094)] text-[#FBBF24]'
                          : 'bg-[#1C2A38] text-white/80'
                      }`.trim()}
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-[6px] flex items-center gap-[7px]">
                        <span
                          className="h-[6px] w-[6px] rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          className={`truncate text-[12px] leading-[18px] ${
                            index === 0 ? 'font-bold text-white' : 'font-normal text-white'
                          }`.trim()}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div className="h-4 w-full rounded-[4px] bg-[#1C2A38]">
                        <div
                          className={`h-4 rounded-[4px] ${
                            item.glow ? 'shadow-[0px_0px_5px_rgba(91,156,246,0.55)]' : 'opacity-60'
                          }`.trim()}
                          style={{
                            width: `${Math.max(0, Math.min(item.score, 100))}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className="text-right text-[15px] font-bold leading-[22px]"
                      style={{ color: item.color }}
                    >
                      {Math.round(item.score)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-[21px]">
              <p className="text-[11px] font-medium leading-4 text-white">검증 범주별 비교</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] leading-4">
                {comparison.series.map(item => (
                  <div key={item.key} className="flex items-center gap-[6px]">
                    <span
                      className={`h-[2.5px] w-[18px] rounded-[2px] ${
                        item.glow ? 'shadow-[0px_0px_5px_rgba(91,156,246,0.55)]' : ''
                      }`.trim()}
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className={item.key === 'current' ? 'font-semibold text-white' : 'text-white'}
                    >
                      {item.shortLabel}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex h-[258px] items-start justify-center pt-[2px]">
                <div className="h-[256px] w-[256px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="76%" data={comparison.radarData}>
                      <PolarGrid gridType="polygon" stroke="#1C2A38" radialLines />
                      <PolarRadiusAxis
                        domain={[0, radarDomainMax]}
                        ticks={radarTicks}
                        tick={false}
                        axisLine={false}
                      />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={({ x, y, payload }) => (
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#C8D8E8"
                            fontSize="10.5"
                            fontWeight="600"
                          >
                            {payload.value}
                          </text>
                        )}
                      />
                      <Tooltip content={<BenchmarkComparisonRadarTooltip />} />
                      {radarSeries.map(item => (
                        <Radar
                          key={item.key}
                          name={item.label}
                          dataKey={`${item.key}Display`}
                          stroke={item.color}
                          fill={item.key === 'current' ? 'rgba(91,156,246,0.11)' : 'rgba(0,0,0,0)'}
                          fillOpacity={item.key === 'current' ? 1 : 0}
                          strokeWidth={item.key === 'current' ? 2 : 1.2}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {comparison.categoryComparisonRows.length > 0 ? (
            <div className="border-t border-[#1C2A38] px-[22px] py-[13px]">
              <div
                className="grid items-center gap-x-5 gap-y-2"
                style={{
                  gridTemplateColumns: `5.75rem repeat(${comparison.categoryComparisonRows.length}, minmax(4.5rem, 1fr))`,
                }}
              >
                <div className="text-[11px] leading-4 text-white">최고 모델 대비</div>
                {comparison.categoryComparisonRows.map(row => (
                  <div key={`${row.key}-label`} className="text-center">
                    <span className="text-[11px] font-semibold leading-4 text-white">
                      {row.label}
                    </span>
                  </div>
                ))}

                <div className="text-[11px] leading-4 text-white">
                  {comparison.bestBaseline.shortLabel}
                </div>
                {comparison.categoryComparisonRows.map(row => {
                  const isAhead = row.gap == null ? false : row.gap >= 0;
                  return (
                    <div key={`${row.key}-gap`} className="text-center">
                      <span
                        className={`text-[14px] font-bold leading-5 ${
                          row.gap == null
                            ? 'text-white'
                            : isAhead
                              ? 'text-[#34D399]'
                              : 'text-[#F87171]'
                        }`.trim()}
                      >
                        {row.gap == null ? '미검증' : `${isAhead ? '+' : ''}${row.gap.toFixed(1)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="px-6 py-10 text-center text-[12px] text-white">
          비교 가능한 벤치마크 데이터가 아직 없습니다.
        </div>
      )}
    </section>
  );
}

export default function BenchmarkResultDashboard({
  sessionId,
  sessionDetail,
  isLoading,
  rows = [],
}) {
  const isCsvDownloading = false;
  const isPdfDownloading = false;
  const isAwaitingInitialData = isLoading && !sessionDetail;
  const summaryText = getHeroHeadline(sessionDetail);
  const subSummaryText = getHeroSubheadline(sessionDetail);
  const overallScore = getOverallSafetyScore(sessionDetail);
  const overallGrade = getOverallGrade(sessionDetail);
  const toneClassName = getGradeTone(overallScore, overallGrade);
  const resultSource = getResultSource(sessionDetail);
  const { inappropriateCount, reviewCount, appropriateCount } = getSummaryCounts(sessionDetail);
  const totalCount = getTotalCount(sessionDetail);
  const completedCount = getCompletedCount(sessionDetail);
  const categorySummaries = getCategorySummaries(sessionDetail);
  const radarData = getRadarData(sessionDetail, categorySummaries);
  const heatmap = getHeatmap(sessionDetail);
  const matrixColumns = getHeatmapColumns(sessionDetail, rows);
  const benchmarkComparison = buildBenchmarkComparison(sessionDetail, categorySummaries);
  const insightItems = getInsightItems(sessionDetail, categorySummaries, {
    inappropriateCount,
    reviewCount,
    appropriateCount,
  });
  const detailHighlights = getDetailHighlights(sessionDetail);
  const overallScoreDisplay = isAwaitingInitialData ? '-' : overallScore;
  const overallGradeDisplay = isAwaitingInitialData ? '-' : overallGrade;
  const totalCountDisplay = isAwaitingInitialData ? '-' : totalCount;
  const appropriateCountDisplay = isAwaitingInitialData ? '-' : appropriateCount;
  const inappropriateCountDisplay = isAwaitingInitialData ? '-' : inappropriateCount;
  const reviewCountDisplay = isAwaitingInitialData ? '-' : reviewCount;

  function handleExportPdf() {}

  function handleDownloadCsv() {}

  return (
    <div className="overflow-hidden rounded-[28px]">
      <div className="relative w-full pt-[clamp(1rem,2.4vw,1.8rem)] pb-[clamp(0.5rem,1vw,0.8rem)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-4 xl:gap-x-8">
          <div className="min-w-0 max-w-[48rem]">
            <h1 className="text-[1.7rem] font-bold leading-[140%] tracking-[0.02em] text-white sm:text-[1.8rem] lg:text-[1.9rem] xl:text-[2.15rem]">
              {getRunRoundLabel(sessionDetail) || `세션 #${sessionId || '-'}`}
            </h1>
            <p className="text-[14px] font-bold text-[#7F93AF] lg:text-[15px]">
              {formatExecutionDate(
                resultSource?.hero?.started_at ??
                  resultSource?.started_at ??
                  resultSource?.created_at ??
                  resultSource?.summary?.started_at ??
                  sessionDetail?.started_at ??
                  sessionDetail?.created_at
              )}
            </p>
            <p className="mt-2 text-[14px] font-bold leading-[155%] text-white lg:text-[15px]">
              {isLoading
                ? '검증 결과를 불러오는 중입니다.'
                : summaryText || '요약 데이터가 없습니다.'}
            </p>
            {!isLoading && subSummaryText ? (
              <p className="mt-1 text-[13px] font-bold leading-[150%] text-[#99ADC7] lg:text-[14px]">
                {subSummaryText}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 justify-self-end pt-0 xl:pt-3">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isPdfDownloading}
              className="inline-flex h-8 w-[148px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[4px] bg-[#6DEBFD] px-4 text-[13px] font-bold text-[#00555E] shadow-[0px_10px_15px_-3px_rgba(109,235,253,0.2),0px_4px_6px_-4px_rgba(109,235,253,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <img src={pdfIcon} alt="" aria-hidden="true" className="h-[14px] w-[14px]" />
              <span>{isPdfDownloading ? '다운로드 중...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>

        <div
          className="mt-7 grid gap-3 xl:gap-3"
          style={{
            gridTemplateColumns: `repeat(${Math.min(5, 5)}, minmax(0, 1fr))`,
          }}
        >
          <SummaryHeroCard
            score={overallScoreDisplay}
            grade={overallGradeDisplay}
            toneClassName={isAwaitingInitialData ? 'text-white' : toneClassName}
          />
          <CountCard label="총 테스트" value={totalCountDisplay} toneColor="white" />
          <CountCard
            label="적절"
            value={appropriateCountDisplay}
            toneColor={SCORE_STATUS_COLORS.appropriate}
          />
          <CountCard
            label="부적절"
            value={inappropriateCountDisplay}
            toneColor={SCORE_STATUS_COLORS.inappropriate}
          />
          <CountCard
            label="검토 필요"
            value={reviewCountDisplay}
            toneColor={SCORE_STATUS_COLORS.review}
          />
        </div>

        <div className="mt-4">
          {categorySummaries.length > 0 ? (
            <div
              className="grid gap-3 xl:gap-3"
              style={{
                gridTemplateColumns: `repeat(${Math.min(categorySummaries.length, 5)}, minmax(0, 1fr))`,
              }}
            >
              {categorySummaries.map(item => {
                const scoreColor = getScoreStatusColor(item.score);

                return (
                  <article
                    key={item.label}
                    className="overflow-hidden rounded-[12px] border border-[#1A3A5C] px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold leading-4 text-white">{item.label}</p>
                      <span className="text-[14px] font-bold" style={{ color: scoreColor }}>
                        {item.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="mt-4 h-[5px] w-full rounded-[5px] bg-[#1C2A38]">
                      <div
                        className="h-[5px] rounded-[5px]"
                        style={{
                          width: `${Math.max(0, Math.min(item.score, 100))}%`,
                          backgroundColor: scoreColor,
                        }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptySectionCard message="표시할 카테고리 요약 데이터가 없습니다." />
          )}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:gap-5">
          <CategorySafetySection categorySummaries={categorySummaries} radarData={radarData} />
          <StatusDistributionSection
            appropriateCount={appropriateCount}
            reviewCount={reviewCount}
            inappropriateCount={inappropriateCount}
          />
        </div>

        {((Array.isArray(heatmap?.rows) && heatmap.rows.length > 0) || rows.length > 0) &&
        matrixColumns.length > 0 ? (
          <ValidationMatrixSection
            rows={rows}
            columns={matrixColumns}
            categorySummaries={categorySummaries}
            heatmap={heatmap}
          />
        ) : (
          <section className={`${SURFACE_CLASSNAME} mt-6`.trim()}>
            <div className="flex items-center border-b border-[#1C2A38] px-[22px] py-[15px]">
              <p className="text-[15px] font-bold leading-6 text-white">카테고리 × 질문 유형</p>
            </div>
            <div className="px-[22px] py-[18px]">
              <EmptySectionCard message="표시할 매트릭스 데이터가 없습니다." />
            </div>
          </section>
        )}

        <ResponsibilityDetailSection
          items={detailHighlights}
          isDownloading={isCsvDownloading}
          onDownloadCsv={handleDownloadCsv}
        />
        <InsightSection items={insightItems} />
        <BenchmarkComparisonSection comparison={benchmarkComparison} />
      </div>
    </div>
  );
}
