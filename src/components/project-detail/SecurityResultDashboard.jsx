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
import { SECURITY_COMPARISON_SERIES_PALETTE } from './projectDetailPalettes.js';

const SURFACE_CLASSNAME = 'rounded-[16px] border border-[#1A3A5C]';
const VULNERABILITY_RADAR_DISPLAY_FLOOR = 25;
const BENCHMARK_RADAR_DISPLAY_FLOOR = 20;

function parseJsonSafely(value, fallback) {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
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

function getSummaryCounts(sessionDetail) {
  const summaryCache = sessionDetail?.summary_cache;
  return {
    failCount: Number(summaryCache?.fail_count ?? 0),
    reviewCount: Number(summaryCache?.review_count ?? 0),
    safeCount: Number(summaryCache?.safe_count ?? 0),
  };
}

function getSummaryText(sessionDetail) {
  return String(
    sessionDetail?.summary_cache?.conclusion_text ?? sessionDetail?.summary_cache?.ai_analysis ?? ''
  ).trim();
}

function toSafetyScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(100, score));
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

function riskToSafetyScore(value) {
  const score = Number(value);
  if (!Number.isFinite(score)) return null;
  return Math.max(0, Math.min(100, 100 - score));
}

function toNullableNumericScore(value) {
  if (value == null || value === '') return null;
  const score = Number(value);
  return Number.isFinite(score) ? score : null;
}

function applyRadarDisplayValue(value, floor = 0) {
  const score = toSafetyScore(value);
  if (score == null) return 0;
  return score + floor;
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

function getOverallSafetyScore(sessionDetail) {
  const summaryCache = sessionDetail?.summary_cache;
  const directSafetyScore = toSafetyScore(summaryCache?.overall_safety_score);
  if (directSafetyScore != null) return directSafetyScore;

  const sessionSafetyScore = toSafetyScore(sessionDetail?.safety_total);
  if (sessionSafetyScore != null) return sessionSafetyScore;

  const benchmarkSafetyScore = toSafetyScore(
    sessionDetail?.baseline_benchmark?.current?.overall_safety_score
  );
  if (benchmarkSafetyScore != null) return benchmarkSafetyScore;

  const benchmarkOverallScore = toSafetyScore(
    sessionDetail?.baseline_benchmark?.current?.overall_score
  );
  if (benchmarkOverallScore != null) return benchmarkOverallScore;

  const legacyRiskScore = Number(summaryCache?.overall_risk_score);
  if (Number.isFinite(legacyRiskScore)) {
    return Math.max(0, Math.min(100, 100 - legacyRiskScore));
  }

  return 0;
}

function getOverallScoreToneClass(score) {
  const normalizedScore = toSafetyScore(score);
  if (normalizedScore == null) return 'text-white';
  if (normalizedScore >= 70) return 'text-[#31D66B]';
  if (normalizedScore >= 60) return 'text-[#FFB02E]';
  return 'text-[#FF4D6A]';
}

function getRunRoundLabel(sessionDetail) {
  const runNumber = Number(sessionDetail?.run_number ?? 0);
  return runNumber > 0 ? `${runNumber}회차` : '';
}

function getLabel(value, fallbacks = []) {
  return [value, ...fallbacks].map(item => String(item ?? '').trim()).find(Boolean) ?? '';
}

function buildLabelMaps(sessionDetail) {
  const rows = Array.isArray(sessionDetail?.matrix_progress) ? sessionDetail.matrix_progress : [];
  const safetyBreakdown = parseJsonSafely(sessionDetail?.summary_cache?.safety_breakdown_json, []);
  const riskBreakdown = parseJsonSafely(sessionDetail?.summary_cache?.risk_breakdown_json, []);
  const attackSafetyBreakdown = parseJsonSafely(
    sessionDetail?.summary_cache?.attack_safety_breakdown_json,
    []
  );
  const attackBreakdown = parseJsonSafely(sessionDetail?.summary_cache?.attack_breakdown_json, []);

  const categoryMap = new Map();
  const attackMap = new Map();

  rows.forEach(row => {
    const riskCategory = String(row?.risk_category ?? '').trim();
    const riskCategoryLabel = String(row?.risk_category_label ?? '').trim();

    if (riskCategory && riskCategoryLabel) {
      categoryMap.set(riskCategory, riskCategoryLabel);
    }

    const cells = Array.isArray(row?.cells) ? row.cells : [];
    cells.forEach(cell => {
      const attackStyle = String(cell?.attack_style ?? '').trim();
      const attackStyleLabel = String(cell?.attack_style_label ?? '').trim();

      if (attackStyle && attackStyleLabel) {
        attackMap.set(attackStyle, attackStyleLabel);
      }
    });
  });

  [safetyBreakdown, riskBreakdown].forEach(items => {
    if (!Array.isArray(items)) return;

    items.forEach(item => {
      const riskCategory = String(item?.risk_category ?? item?.category ?? '').trim();
      const riskCategoryLabel = String(
        item?.risk_category_label ?? item?.category_label ?? item?.risk_label ?? ''
      ).trim();

      if (riskCategory && riskCategoryLabel && !categoryMap.has(riskCategory)) {
        categoryMap.set(riskCategory, riskCategoryLabel);
      }
    });
  });

  [attackSafetyBreakdown, attackBreakdown].forEach(items => {
    if (!Array.isArray(items)) return;

    items.forEach(item => {
      const attackStyle = String(item?.attack_style ?? item?.attack_type ?? '').trim();
      const attackStyleLabel = String(
        item?.attack_style_label ?? item?.attack_type_label ?? item?.attack_label ?? ''
      ).trim();

      if (attackStyle && attackStyleLabel && !attackMap.has(attackStyle)) {
        attackMap.set(attackStyle, attackStyleLabel);
      }
    });
  });

  return { categoryMap, attackMap };
}

function getCategoryLabel(item, labelMaps) {
  const code = String(item?.risk_category ?? item?.category ?? '').trim();

  return getLabel(item?.risk_category_label, [
    item?.category_label,
    item?.risk_label,
    labelMaps?.categoryMap?.get(code),
    item?.label,
    item?.display_label,
    item?.risk_category,
    item?.category,
    item?.name,
    item?.title,
  ]);
}

function getAttackLabel(item, labelMaps) {
  const code = String(
    item?.attack_style ??
      item?.attack_type ??
      item?.question_format ??
      item?.question_type ??
      item?.attack ??
      ''
  ).trim();

  return getLabel(item?.attack_style_label, [
    item?.attack_type_label,
    item?.question_format_label,
    item?.question_type_label,
    item?.attack_label,
    labelMaps?.attackMap?.get(code),
    item?.label,
    item?.display_label,
    item?.attack_style,
    item?.attack_type,
    item?.question_format,
    item?.question_type,
    item?.attack,
    item?.subtitle,
    item?.column,
    item?.key,
    item?.name,
  ]);
}

function normalizeStatus(value) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');

  if (
    [
      'fail',
      'failed',
      'danger',
      'vulnerable',
      'unsafe',
      '취약',
      'high_risk',
      'critical',
      'blocked',
      'block',
    ].includes(normalized)
  ) {
    return '취약';
  }

  if (
    [
      'review',
      'warning',
      'warn',
      'manual',
      '검토_필요',
      '검토필요',
      'manual_review',
      'needs_review',
      'review_required',
      'review_needed',
      'requires_review',
      'caution',
    ].includes(normalized)
  ) {
    return '검토 필요';
  }

  if (
    ['safe', 'pass', 'passed', 'ok', '안전', 'success', 'clean', 'normal', 'completed'].includes(
      normalized
    )
  ) {
    return '안전';
  }

  return '';
}

function getCellScore(cell, rawStatus = '') {
  const directSafetyFields = [
    cell?.overall_safety_score,
    cell?.safety_score,
    cell?.score_safety,
    cell?.result_safety_score,
  ];

  for (const value of directSafetyFields) {
    const score = toSafetyScore(value);
    if (score != null) return Math.round(score);
  }

  const legacyRiskFields = [
    cell?.risk_score,
    cell?.severity_score,
    cell?.judgement_score,
    cell?.result_score,
    cell?.absolute_severity,
    cell?.max_severity,
    cell?.severity,
  ];

  for (const value of legacyRiskFields) {
    const score = riskToSafetyScore(value);
    if (score != null) return Math.round(score);
  }

  const genericScore = toSafetyScore(cell?.score);
  if (genericScore != null) return Math.round(genericScore);

  const normalizedStatus = normalizeStatus(rawStatus);
  if (normalizedStatus === '안전') return 100;
  if (normalizedStatus === '검토 필요') return 50;
  if (normalizedStatus === '취약') return 0;

  return 0;
}

function getStatusPalette(status) {
  if (status === '취약') {
    return {
      chipClassName:
        'border border-[rgba(255,77,106,0.3)] bg-[rgba(255,77,106,0.15)] text-[#FF4D6A]',
      matrixClassName:
        'border border-[rgba(255,77,106,0.18)] bg-[rgba(255,77,106,0.16)] text-[#FF4D6A]',
      accentClassName: 'bg-[#FF4D6A]',
    };
  }

  if (status === '검토 필요') {
    return {
      chipClassName:
        'border border-[rgba(255,176,46,0.3)] bg-[rgba(255,176,46,0.15)] text-[#FFB02E]',
      matrixClassName:
        'border border-[rgba(255,176,46,0.18)] bg-[rgba(255,176,46,0.12)] text-[#FFB02E]',
      accentClassName: 'bg-[#FFB02E]',
    };
  }

  if (status === '안전') {
    return {
      chipClassName:
        'border border-[rgba(49,214,107,0.24)] bg-[rgba(49,214,107,0.12)] text-[#31D66B]',
      matrixClassName:
        'border border-[rgba(49,214,107,0.16)] bg-[rgba(33,122,87,0.28)] text-[#31D66B]',
      accentClassName: 'bg-[#31D66B]',
    };
  }

  return {
    chipClassName: 'border border-[rgba(90,106,122,0.16)] bg-[rgba(26,44,78,0.36)] text-white',
    matrixClassName: 'border border-[rgba(90,106,122,0.16)] bg-[rgba(26,44,78,0.36)] text-white',
    accentClassName: 'bg-white',
  };
}

function normalizeMatrixCell(cell, row, sessionDetail, labelMaps) {
  const attackType = getAttackLabel(cell, labelMaps);
  if (!attackType) return null;

  const rawStatus = getLabel(cell?.result_label, [
    cell?.judge_status,
    cell?.judgement_label,
    cell?.status_label,
    cell?.status,
    cell?.result,
    cell?.risk_level,
    cell?.verdict,
  ]);

  return {
    attackType,
    score: getCellScore(cell, rawStatus),
    status: normalizeStatus(rawStatus),
    rawStatus,
    isNotEvaluated: isNotEvaluatedEntry(cell, [rawStatus]),
    description: getLabel(cell?.description, [
      cell?.reason,
      cell?.attack_description,
      row?.risk_description,
      row?.description,
    ]),
    executedAt: getLabel(cell?.completed_at, [
      cell?.executed_at,
      cell?.updated_at,
      sessionDetail?.completed_at,
      sessionDetail?.started_at,
      sessionDetail?.created_at,
    ]),
    owasp: getLabel(cell?.framework_owasp, [cell?.owasp, cell?.owasp_code, cell?.owasp_category]),
    mitre: getLabel(cell?.framework_mitre, [cell?.mitre, cell?.mitre_code, cell?.mitre_attack]),
  };
}

function buildMatrixRows(sessionDetail, labelMaps) {
  const progressRows = Array.isArray(sessionDetail?.matrix_progress)
    ? sessionDetail.matrix_progress
    : [];
  const summaryCells = parseJsonSafely(sessionDetail?.summary_cache?.matrix_json, []);

  if (progressRows.length === 0) return [];

  const summaryCellMap = new Map(
    (Array.isArray(summaryCells) ? summaryCells : [])
      .map(cell => {
        const riskCategory = getLabel(cell?.risk_category);
        const attackStyle = getLabel(cell?.attack_style);
        if (!riskCategory || !attackStyle) return null;
        return [`${riskCategory}::${attackStyle}`, cell];
      })
      .filter(Boolean)
  );

  return progressRows
    .map(row => {
      const category = getCategoryLabel(row, labelMaps);
      if (!category) return null;

      const cells = (Array.isArray(row?.cells) ? row.cells : [])
        .map(progressCell => {
          const attackStyle = getLabel(progressCell?.attack_style);
          const attackLabel = getAttackLabel(progressCell, labelMaps);
          if (!attackStyle || !attackLabel) return null;

          const summaryCell = summaryCellMap.get(`${getLabel(row?.risk_category)}::${attackStyle}`);

          if (!summaryCell) {
            return {
              attackType: attackLabel,
              score: 0,
              status: '',
              rawStatus: '',
              isNotEvaluated: false,
            };
          }

          return normalizeMatrixCell(
            {
              ...summaryCell,
              attack_style_label: progressCell?.attack_style_label,
            },
            row,
            sessionDetail,
            labelMaps
          );
        })
        .filter(Boolean);

      return {
        category,
        description: getLabel(row?.risk_description, [row?.description]),
        cells,
      };
    })
    .filter(Boolean);
}

function buildTopRiskItems(matrixRows) {
  const statusPriority = {
    취약: 3,
    '검토 필요': 2,
    안전: 1,
    '': 0,
  };

  return matrixRows
    .flatMap(row =>
      row.cells.map(cell => ({
        ...cell,
        category: row.category,
        categoryDescription: row.description,
      }))
    )
    .filter(item => item.status === '취약' || item.status === '검토 필요')
    .sort((a, b) => {
      const statusDiff = (statusPriority[b.status] ?? 0) - (statusPriority[a.status] ?? 0);
      if (statusDiff !== 0) return statusDiff;
      return a.score - b.score || a.category.localeCompare(b.category, 'ko');
    })
    .slice(0, 3);
}

function buildTopRiskItemsFromSummary(sessionDetail, fallbackItems, labelMaps) {
  const parsed = parseJsonSafely(sessionDetail?.summary_cache?.top_risks_json, []);
  if (!Array.isArray(parsed) || parsed.length === 0) return fallbackItems;

  const executions = Array.isArray(sessionDetail?.executions) ? sessionDetail.executions : [];

  const executionMap = new Map(
    executions.map(execution => {
      const riskCategory = String(execution?.risk_category ?? '').trim();
      const attackStyle = String(execution?.attack_style ?? '').trim();

      return [`${riskCategory}::${attackStyle}`, execution];
    })
  );

  const statusPriority = {
    취약: 3,
    '검토 필요': 2,
    안전: 1,
    '': 0,
  };

  return parsed
    .map(item => {
      const rawStatus = getLabel(item?.status, [
        item?.judge_status,
        item?.status_label,
        item?.result,
        item?.judgement,
      ]);

      const riskCategory = String(item?.risk_category ?? '').trim();
      const attackStyle = String(item?.attack_style ?? '').trim();
      const matchedExecution = executionMap.get(`${riskCategory}::${attackStyle}`);

      return {
        category: getCategoryLabel(item, labelMaps),
        attackType: getAttackLabel(item, labelMaps),
        score: getCellScore(item, rawStatus),
        status: normalizeStatus(rawStatus),
        description: getLabel(item?.description, [item?.detail, item?.reason, item?.prompt_text]),
        mitigation: getLabel(item?.mitigation_text, [
          matchedExecution?.mitigation_text,
          matchedExecution?.security_result?.mitigation_text,
        ]),
        executedAt: getLabel(item?.executed_at, [
          item?.completed_at,
          matchedExecution?.completed_at,
          matchedExecution?.created_at,
        ]),
        owasp: getLabel(item?.framework_owasp, [
          item?.owasp,
          item?.owasp_code,
          matchedExecution?.framework_owasp,
          matchedExecution?.security_result?.framework_owasp,
        ]),
        mitre: getLabel(item?.framework_mitre, [
          item?.mitre,
          item?.mitre_code,
          matchedExecution?.framework_mitre,
          matchedExecution?.security_result?.framework_mitre,
        ]),
      };
    })
    .filter(item => item.category && (item.status === '취약' || item.status === '검토 필요'))
    .sort((a, b) => {
      const statusDiff = (statusPriority[b.status] ?? 0) - (statusPriority[a.status] ?? 0);
      if (statusDiff !== 0) return statusDiff;
      return a.score - b.score;
    })
    .slice(0, 3);
}

function buildRadarData(matrixRows) {
  const prioritized = [...matrixRows]
    .map(row => ({
      label: row.category,
      value: row.cells.reduce((max, cell) => {
        if (cell?.isNotEvaluated || cell?.score == null) return max;
        return Math.max(max, cell.score);
      }, 0),
      isNotEvaluated:
        row.cells.length > 0 &&
        row.cells.every(cell => cell?.isNotEvaluated || cell?.score == null),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return prioritized.map(item => ({
    subject: item.label,
    value: item.isNotEvaluated ? null : item.value,
    displayValue: applyRadarDisplayValue(item.value, VULNERABILITY_RADAR_DISPLAY_FLOOR),
    fullMark: getRadarDisplayDomainMax(VULNERABILITY_RADAR_DISPLAY_FLOOR),
    isNotEvaluated: item.isNotEvaluated,
  }));
}

function getUnifiedCategoryOrder(sessionDetail, matrixRows, labelMaps) {
  const orderedLabels = [];
  const seen = new Set();

  const addLabel = label => {
    const normalized = String(label ?? '').trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    orderedLabels.push(normalized);
  };

  matrixRows.forEach(row => {
    addLabel(row?.category);
  });

  const safetyParsed = parseJsonSafely(sessionDetail?.summary_cache?.safety_breakdown_json, null);
  if (Array.isArray(safetyParsed)) {
    safetyParsed.forEach(item => {
      addLabel(getCategoryLabel(item, labelMaps));
    });
  }

  const riskParsed = parseJsonSafely(sessionDetail?.summary_cache?.risk_breakdown_json, null);
  if (Array.isArray(riskParsed)) {
    riskParsed.forEach(item => {
      addLabel(getCategoryLabel(item, labelMaps));
    });
  } else if (riskParsed && typeof riskParsed === 'object') {
    Object.keys(riskParsed).forEach(key => {
      addLabel(labelMaps?.categoryMap?.get(key) ?? key);
    });
  }

  const baselineBenchmark = sessionDetail?.baseline_benchmark;
  const currentRiskScores =
    baselineBenchmark?.current?.risk_scores &&
    typeof baselineBenchmark.current.risk_scores === 'object'
      ? baselineBenchmark.current.risk_scores
      : {};

  Object.keys(currentRiskScores).forEach(key => {
    addLabel(labelMaps?.categoryMap?.get(key) ?? key);
  });

  const baselines = Array.isArray(baselineBenchmark?.baselines) ? baselineBenchmark.baselines : [];
  baselines.forEach(baseline => {
    const riskScores =
      baseline?.risk_scores && typeof baseline.risk_scores === 'object' ? baseline.risk_scores : {};
    Object.keys(riskScores).forEach(key => {
      addLabel(labelMaps?.categoryMap?.get(key) ?? key);
    });
  });

  return orderedLabels.slice(0, 6);
}

function buildRadarDataFromSummary(sessionDetail, fallbackRows, labelMaps, categoryOrder = []) {
  const order = Array.isArray(categoryOrder) ? categoryOrder.filter(Boolean) : [];
  const scoreMap = new Map();

  const buildRadarRows = entries =>
    entries.map(([subject, value]) => {
      const normalizedValue =
        value && typeof value === 'object' && !Array.isArray(value)
          ? value
          : { value, isNotEvaluated: false };

      return {
        subject,
        value: normalizedValue.isNotEvaluated ? null : normalizedValue.value,
        displayValue: applyRadarDisplayValue(
          normalizedValue.value ?? 0,
          VULNERABILITY_RADAR_DISPLAY_FLOOR
        ),
        fullMark: getRadarDisplayDomainMax(VULNERABILITY_RADAR_DISPLAY_FLOOR),
        isNotEvaluated: normalizedValue.isNotEvaluated === true,
      };
    });

  const safetyParsed = parseJsonSafely(sessionDetail?.summary_cache?.safety_breakdown_json, null);

  if (Array.isArray(safetyParsed) && safetyParsed.length > 0) {
    safetyParsed.forEach(item => {
      const subject = getCategoryLabel(item, labelMaps);
      if (!subject) return;

      const notEvaluated = isNotEvaluatedEntry(item, [item?.judge_status]);
      const value = toSafetyScore(item?.safety_score) ?? getCellScore(item, item?.judge_status);
      scoreMap.set(subject, {
        value: notEvaluated ? null : value,
        isNotEvaluated: notEvaluated,
      });
    });

    if (order.length > 0) {
      return buildRadarRows(
        order.map(subject => [
          subject,
          scoreMap.get(subject) ?? { value: 0, isNotEvaluated: false },
        ])
      );
    }

    return buildRadarRows([...scoreMap.entries()].slice(0, 6));
  }

  const riskParsed = parseJsonSafely(sessionDetail?.summary_cache?.risk_breakdown_json, null);

  if (Array.isArray(riskParsed) && riskParsed.length > 0) {
    riskParsed.forEach(item => {
      const subject = getCategoryLabel(item, labelMaps);
      if (!subject) return;

      const value = getCellScore(item, item?.judge_status);
      const notEvaluated = isNotEvaluatedEntry(item, [item?.judge_status]);
      scoreMap.set(subject, {
        value: notEvaluated ? null : value,
        isNotEvaluated: notEvaluated,
      });
    });

    if (order.length > 0) {
      return buildRadarRows(
        order.map(subject => [
          subject,
          scoreMap.get(subject) ?? { value: 0, isNotEvaluated: false },
        ])
      );
    }

    return buildRadarRows([...scoreMap.entries()].slice(0, 6));
  }

  const entries =
    riskParsed && !Array.isArray(riskParsed) && typeof riskParsed === 'object'
      ? Object.entries(riskParsed)
      : [];

  if (entries.length > 0) {
    entries.forEach(([key, value]) => {
      const subject = labelMaps?.categoryMap?.get(key) ?? key;
      const notEvaluated = value && typeof value === 'object' ? isNotEvaluatedEntry(value) : false;
      scoreMap.set(subject, {
        value: notEvaluated ? null : getCellScore({ max_severity: value }),
        isNotEvaluated: notEvaluated,
      });
    });

    if (order.length > 0) {
      return buildRadarRows(
        order.map(subject => [
          subject,
          scoreMap.get(subject) ?? { value: 0, isNotEvaluated: false },
        ])
      );
    }

    return buildRadarRows([...scoreMap.entries()].slice(0, 6));
  }

  const fallbackRadar = buildRadarData(fallbackRows);
  if (order.length > 0) {
    const fallbackMap = new Map(fallbackRadar.map(item => [item.subject, item.value]));
    return buildRadarRows(order.map(subject => [subject, fallbackMap.get(subject) ?? 0]));
  }

  return fallbackRadar;
}

function buildExecutionLogItems(sessionDetail, labelMaps) {
  const executions = Array.isArray(sessionDetail?.executions) ? sessionDetail.executions : [];
  if (executions.length === 0) return [];

  return executions
    .map(execution => {
      const rawStatus = getLabel(execution?.result_label, [
        execution?.judge_status,
        execution?.judgement_label,
        execution?.status_label,
        execution?.status,
        execution?.result,
      ]);

      return {
        category: getCategoryLabel(execution, labelMaps),
        attackType: getAttackLabel(execution, labelMaps),
        status: normalizeStatus(rawStatus),
        score: getCellScore(execution, rawStatus),
        executedAt: getLabel(execution?.completed_at, [
          execution?.executed_at,
          execution?.updated_at,
          execution?.created_at,
        ]),
        description: getLabel(execution?.judge_notes, [
          execution?.reason,
          execution?.description,
          execution?.attack_description,
        ]),
      };
    })
    .filter(item => item.category || item.attackType)
    .filter(item => item.status === '취약' || item.status === '검토 필요')
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
}

function buildBenchmarkComparison(sessionDetail, labelMaps, categoryOrder = []) {
  const baselineBenchmark = sessionDetail?.baseline_benchmark;
  const current = baselineBenchmark?.current ?? {};
  const baselines = Array.isArray(baselineBenchmark?.baselines) ? baselineBenchmark.baselines : [];
  const currentRiskScores =
    current?.risk_scores && typeof current.risk_scores === 'object' ? current.risk_scores : {};
  const series = [
    {
      key: 'current',
      label: '현재',
      shortLabel: '현재',
      score: toSafetyScore(current?.overall_safety_score ?? current?.overall_score) ?? 0,
      color: SECURITY_COMPARISON_SERIES_PALETTE[0],
      glow: true,
      riskScores: currentRiskScores,
      riskScoreNotEvaluatedMap: new Map(
        Object.entries(currentRiskScores).map(([key, value]) => [
          key,
          value == null || (value && typeof value === 'object' && isNotEvaluatedEntry(value)),
        ])
      ),
    },
    ...baselines.slice(0, 4).map((baseline, index) => ({
      key: `baseline-${index}`,
      label: getLabel(baseline?.model_label, [
        baseline?.name,
        baseline?.title,
        baseline?.model_key,
        baseline?.model_name,
        baseline?.dataset_name,
        baseline?.vendor,
        baseline?.measured_at,
        `baseline-${index + 1}`,
      ]),
      shortLabel: getLabel(baseline?.model_label, [
        baseline?.short_name,
        baseline?.model_key,
        baseline?.name,
        baseline?.vendor,
        `baseline-${index + 1}`,
      ]),
      score: toSafetyScore(baseline?.overall_safety_score ?? baseline?.overall_score) ?? 0,
      color:
        SECURITY_COMPARISON_SERIES_PALETTE[(index + 1) % SECURITY_COMPARISON_SERIES_PALETTE.length],
      glow: false,
      riskScores:
        baseline?.risk_scores && typeof baseline.risk_scores === 'object'
          ? baseline.risk_scores
          : {},
      riskScoreNotEvaluatedMap: new Map(
        Object.entries(
          baseline?.risk_scores && typeof baseline?.risk_scores === 'object'
            ? baseline.risk_scores
            : {}
        ).map(([key, value]) => [
          key,
          value == null || (value && typeof value === 'object' && isNotEvaluatedEntry(value)),
        ])
      ),
    })),
  ];

  const bestBaseline =
    [...series].filter(item => item.key !== 'current').sort((a, b) => b.score - a.score)[0] ?? null;

  const categories =
    Array.isArray(categoryOrder) && categoryOrder.length > 0
      ? categoryOrder
      : [
          ...new Set(
            series.flatMap(item =>
              Object.keys(item.riskScores ?? {}).map(key => labelMaps?.categoryMap?.get(key) ?? key)
            )
          ),
        ].slice(0, 6);

  const radarData = categories.map(categoryLabel => {
    const row = {
      subject: categoryLabel,
    };

    const matchedKeys = series.map(
      item =>
        Object.keys(item.riskScores ?? {}).find(key => {
          const convertedLabel = labelMaps?.categoryMap?.get(key) ?? key;
          return convertedLabel === categoryLabel;
        }) ?? null
    );

    const rawScores = series.map((item, index) => {
      const matchedKey = matchedKeys[index];
      const rawValue = matchedKey ? item.riskScores?.[matchedKey] : null;
      const numericScore = toNullableNumericScore(rawValue);
      return numericScore ?? 0;
    });

    const displayFloor = BENCHMARK_RADAR_DISPLAY_FLOOR;

    series.forEach((item, index) => {
      const score = rawScores[index] ?? 0;
      const matchedKey = matchedKeys[index];
      row[item.key] = score;
      row[`${item.key}Display`] = applyRadarDisplayValue(score, displayFloor);
      row[`${item.key}IsNotEvaluated`] = matchedKey
        ? item.riskScoreNotEvaluatedMap?.get(matchedKey) === true
        : false;
    });

    return row;
  });

  const categoryComparisonRows = bestBaseline
    ? categories.map(categoryLabel => {
        const currentMatchedKey =
          Object.keys(series[0]?.riskScores ?? {}).find(key => {
            const convertedLabel = labelMaps?.categoryMap?.get(key) ?? key;
            return convertedLabel === categoryLabel;
          }) ?? null;

        const baselineMatchedKey =
          Object.keys(bestBaseline?.riskScores ?? {}).find(key => {
            const convertedLabel = labelMaps?.categoryMap?.get(key) ?? key;
            return convertedLabel === categoryLabel;
          }) ?? null;

        const currentScore = currentMatchedKey
          ? toNullableNumericScore(series[0]?.riskScores?.[currentMatchedKey])
          : null;
        const benchmarkScore = baselineMatchedKey
          ? toNullableNumericScore(bestBaseline?.riskScores?.[baselineMatchedKey])
          : null;
        const currentNotEvaluated = currentMatchedKey
          ? series[0]?.riskScoreNotEvaluatedMap?.get(currentMatchedKey) === true
          : false;
        const benchmarkNotEvaluated = baselineMatchedKey
          ? bestBaseline?.riskScoreNotEvaluatedMap?.get(baselineMatchedKey) === true
          : false;
        const gap =
          currentScore != null && benchmarkScore != null ? currentScore - benchmarkScore : null;

        return {
          key: categoryLabel,
          label: categoryLabel,
          currentScore,
          benchmarkScore,
          currentNotEvaluated,
          benchmarkNotEvaluated,
          gap,
        };
      })
    : [];

  return { series, radarData, bestBaseline, categoryComparisonRows };
}

function SummaryCard({ label, helperText = '', value, bottomText, colorClassName, large = false }) {
  return (
    <article className={`${SURFACE_CLASSNAME} min-h-[164px] px-5 py-4 lg:min-h-[170px]`.trim()}>
      <p className="text-[13px] leading-5 text-white">{label}</p>
      {helperText ? <p className="mt-1 text-[11px] leading-4 text-white">{helperText}</p> : null}
      <p
        className={`${helperText ? 'mt-6' : 'mt-8'} font-bold leading-none tracking-[1px] ${
          large ? 'text-[48px] lg:text-[54px]' : 'text-[48px] lg:text-[54px]'
        } ${colorClassName}`.trim()}
      >
        {value}
      </p>
      <p className="mt-6 text-[13px] leading-5 text-white">{bottomText}</p>
    </article>
  );
}

function StatusDistributionSection({ failCount = 0, reviewCount = 0, safeCount = 0 }) {
  const chartData = [
    { name: '안전', value: safeCount, color: '#3B82F6' },
    { name: '검토 필요', value: reviewCount, color: '#FACC15' },
    { name: '취약', value: failCount, color: '#EF4444' },
  ];
  const total = safeCount + reviewCount + failCount;

  return (
    <section className={`${SURFACE_CLASSNAME} h-[380px] px-5 py-4 lg:h-[396px]`.trim()}>
      <h3 className="text-[15px] font-bold leading-[150%] text-white">상태 분포</h3>
      <div className="mt-4 flex h-[294px] flex-col lg:h-[308px]">
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
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[24px] font-bold text-white lg:text-[26px]">{total}</span>
            <span className="text-[12px] text-[#94A3B8]">Total</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-[#94A3B8]">{item.name}</span>
              <span className="font-semibold text-white">{item.value}건</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RadarAxisTick({ x, y, payload, cx, cy }) {
  const centerX = Number.isFinite(Number(cx)) ? Number(cx) : 150;
  const centerY = Number.isFinite(Number(cy)) ? Number(cy) : 150;

  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const labelOffset = 14;
  const adjustedX = x + (dx / distance) * labelOffset;
  const adjustedY = y + (dy / distance) * labelOffset;

  return (
    <text
      x={adjustedX}
      y={adjustedY}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="#D6E7FF"
      fontSize="9.5"
      fontWeight="700"
    >
      {payload.value}
    </text>
  );
}

function SafetyRadarTooltip({ active, payload, label }) {
  if (!active || !Array.isArray(payload) || payload.length === 0) return null;

  const point = payload.find(item => typeof item?.payload?.value === 'number') ?? payload[0];
  const value = Number(point?.payload?.value ?? point?.value ?? 0);
  const isNotEvaluated = point?.payload?.isNotEvaluated === true;

  return (
    <div className="rounded-[10px] border border-[rgba(109,235,253,0.24)] bg-[#0D1F3C] px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
      <p className="text-[11px] font-semibold leading-4 text-[#C8D8E8]">{label}</p>
      <p className="mt-1 text-[12px] font-bold leading-4 text-[#6DEBFD]">
        {isNotEvaluated ? '미검증' : `안전 점수 ${value.toFixed(1)}`}
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
      <p className="text-[11px] font-semibold leading-4 text-[#C8D8E8]">{label}</p>
      <div className="mt-2 grid gap-1.5">
        {items.map(item => (
          <div key={item.label} className="flex items-center justify-between gap-4 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[#C8D8E8]">{item.label}</span>
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

function VulnerabilityRadarSection({ radarData }) {
  const radarDomainMax = getRadarDisplayDomainMax(VULNERABILITY_RADAR_DISPLAY_FLOOR);
  const radarTicks = getRadarAxisTicks(VULNERABILITY_RADAR_DISPLAY_FLOOR);

  return (
    <section className={`${SURFACE_CLASSNAME} h-[380px] px-5 py-4 lg:h-[396px]`.trim()}>
      <h3 className="text-[15px] font-bold leading-[150%] text-white">검증 범주별 안전도</h3>
      <div className="mt-4 flex h-[294px] items-center justify-center lg:h-[308px]">
        <div className="h-[284px] w-[284px] rounded-[12px] lg:h-[300px] lg:w-[300px]">
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
        </div>
      </div>
    </section>
  );
}

function RiskItem({ item, index }) {
  const palette = getStatusPalette(item.status);
  const highlighted = item.status === '취약';

  return (
    <div
      className={`rounded-[12px] border px-4 py-4 ${
        highlighted ? 'border-[rgba(255,77,106,0.15)]' : 'border-[#1A3A5C]'
      }`.trim()}
    >
      <div className="grid grid-cols-[40px_minmax(0,1fr)_auto_auto] items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,212,255,0.15)] text-[13px] font-bold text-[#00D4FF]">
          {index + 1}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold leading-4 text-[#E8EDF5]">{item.category}</p>
          <p className="mt-1 truncate text-[11px] leading-[13px] text-white">
            {item.attackType}
            {item.description ? ` · ${item.description}` : ''}
          </p>
        </div>
        <span
          className={`inline-flex min-h-6 items-center rounded-[8px] px-3 text-[11px] font-bold ${palette.chipClassName}`.trim()}
        >
          {item.status}
        </span>
        <span className="text-[13px] font-bold text-[#E8EDF5]">{item.score}점</span>
      </div>
    </div>
  );
}

function TopRiskSection({ items }) {
  return (
    <section className={`${SURFACE_CLASSNAME} overflow-hidden`.trim()}>
      <div className="h-[56px] px-6">
        <div className="flex h-full items-center">
          <h3 className="text-[14px] font-bold text-[#E8EDF5]">가장 낮은 안전 점수 항목</h3>
        </div>
      </div>
      <div className="grid gap-3 px-4 pb-4 pt-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <RiskItem
              key={`${item.category}-${item.attackType}-${index}`}
              item={item}
              index={index}
            />
          ))
        ) : (
          <EmptySectionCard message="표시할 위험 항목이 없습니다." />
        )}
      </div>
    </section>
  );
}

function MitigationItem({ item }) {
  const palette = getStatusPalette(item.status);

  return (
    <div className="relative border-b border-[#1A3A5C] px-6 py-4 last:border-b-0">
      <div
        className={`absolute bottom-6 left-6 top-6 w-[3px] rounded-full ${palette.accentClassName}`.trim()}
      />
      <div className="pl-4">
        <p className="text-[13px] font-bold leading-4 text-[#E8EDF5]">
          {item.category} · {item.attackType}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-flex min-h-6 items-center rounded-[8px] px-3 text-[11px] font-bold ${palette.chipClassName}`.trim()}
          >
            {item.status}
          </span>
          <span className="text-[11px] text-white">/ 안전 점수 {item.score}점</span>
        </div>
        {item.mitigation ? (
          <p className="mt-3 text-[12px] leading-[14px] text-white">{item.mitigation}</p>
        ) : null}
        {item.owasp || item.mitre ? (
          <p className="mt-3 text-[11px] leading-[13px] text-white">
            {item.owasp ? `OWASP: ${item.owasp}` : ''}
            {item.owasp && item.mitre ? ' · ' : ''}
            {item.mitre ? `MITRE: ${item.mitre}` : ''}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function MitigationSection({ items }) {
  return (
    <section className={`${SURFACE_CLASSNAME} overflow-hidden`.trim()}>
      <div className="h-[56px] px-6">
        <div className="flex h-full items-center">
          <h3 className="text-[14px] font-bold text-[#E8EDF5]">우선 완화 필요 항목</h3>
        </div>
      </div>
      <div>
        {items.length > 0 ? (
          items.map(item => (
            <MitigationItem key={`${item.category}-${item.attackType}`} item={item} />
          ))
        ) : (
          <div className="px-4 py-4">
            <EmptySectionCard message="표시할 완화 필요 항목이 없습니다." />
          </div>
        )}
      </div>
    </section>
  );
}

function MatrixCell({ cell }) {
  const displayStatus = cell?.status || String(cell?.rawStatus ?? '').trim();

  if (!displayStatus) {
    return <div className="h-[62px] rounded-[8px] border border-[rgba(28,42,56,0.55)]" />;
  }

  const palette = getStatusPalette(cell.status);
  return (
    <div className={`rounded-[8px] px-2.5 py-3 text-center ${palette.matrixClassName}`.trim()}>
      <p className="text-[11px] font-bold leading-[13px]">{displayStatus}</p>
      <p className="mt-1 text-[9px] leading-[11px] text-white">안전 점수 {cell.score}</p>
    </div>
  );
}

function ValidationMatrixSection({ rows, columns }) {
  return (
    <section className={`${SURFACE_CLASSNAME} overflow-hidden`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <h3 className="text-[14px] font-bold text-[#E8EDF5]">검증 매트릭스</h3>
        <div className="flex flex-wrap items-center gap-2">
          {['안전', '검토 필요', '취약'].map(status => {
            const palette = getStatusPalette(status);
            return (
              <span
                key={status}
                className={`inline-flex min-h-6 items-center rounded-[8px] px-3 text-[10px] font-bold ${palette.chipClassName}`.trim()}
              >
                {status}
              </span>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-hidden px-5 pb-5">
        <div className="min-w-0">
          <div
            className="grid items-center gap-3 pb-4 text-[11px] text-white"
            style={{ gridTemplateColumns: `6.5rem repeat(${columns.length}, minmax(0, 1fr))` }}
          >
            <div>검증 항목 \ 공격 유형</div>
            {columns.map(column => (
              <div key={column} className="text-center leading-[1.25]">
                {column}
              </div>
            ))}
          </div>

          <div className="grid gap-3">
            {rows.map(row => (
              <div
                key={row.category}
                className="grid items-center gap-3"
                style={{ gridTemplateColumns: `6.5rem repeat(${columns.length}, minmax(0, 1fr))` }}
              >
                <div className="text-[12px] leading-[14px] text-white">{row.category}</div>
                {columns.map(column => (
                  <MatrixCell
                    key={`${row.category}-${column}`}
                    cell={
                      row.cells.find(cell => cell.attackType === column) ?? { status: '', score: 0 }
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExecutionLogSection({ items, isDownloading, onDownloadCsv }) {
  return (
    <section className={`${SURFACE_CLASSNAME} overflow-hidden`.trim()}>
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <h3 className="text-[14px] font-bold text-[#E8EDF5]">주요 취약 내역</h3>
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
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr] gap-4 border-b border-[#1A3A5C] pb-3 text-[11px] text-white">
          <div className="truncate">검증 항목</div>
          <div className="truncate">공격 유형</div>
          <div>판정</div>
          <div>안전 점수</div>
        </div>

        <div className="grid gap-3 pt-3">
          {items.map(item => {
            const palette = getStatusPalette(item.status);

            return (
              <div
                key={`${item.category}-${item.attackType}-${item.executedAt}`}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr] items-center gap-4 text-[12px]"
              >
                <div className="text-white truncate">{item.category}</div>
                <div className="text-white truncate">{item.attackType}</div>

                <div>
                  <span
                    className={`inline-flex min-h-6 items-center rounded-[8px] px-3 text-[11px] font-bold ${palette.chipClassName}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="font-bold text-[#E8EDF5]">{item.score}</div>
              </div>
            );
          })}

          {items.length === 0 ? (
            <div className="py-6 text-center text-[12px] text-white">취약한 사례가 없습니다.</div>
          ) : null}
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
    <section className="overflow-hidden rounded-[12px] border border-[#1A3A5C]">
      <div className="flex items-center gap-3 border-b border-[#1C2A38] px-[22px] py-[15px]">
        <div className="flex flex-col">
          <p className="text-[13px] font-bold leading-5 text-white">벤치마크 비교</p>
          <p className="text-[11px] leading-4 text-white">
            현재 결과와 상용 모델의 범주별 안전도를 비교합니다.
          </p>
        </div>
      </div>

      {!hasComparison ? (
        <div className="px-6 py-6">
          <EmptySectionCard message="비교 가능한 벤치마크 데이터가 없습니다." />
        </div>
      ) : (
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
                          className={`text-[12px] leading-[18px] ${
                            index === 0 ? 'font-bold text-[#C8D8E8]' : 'font-normal text-white'
                          }`.trim()}
                        >
                          {item.label}
                        </span>
                        {index === 0 ? (
                          <span className="rounded-[3px] border border-[rgba(91,156,246,0.157)] bg-[rgba(91,156,246,0.1)] px-[6px] py-[1px] text-[9px] font-bold leading-[14px] text-[#5B9CF6]">
                            현재
                          </span>
                        ) : null}
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
              <p className="text-[11px] font-medium leading-4 text-white">
                카테고리별 안전 점수 비교
              </p>
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
                      className={
                        item.key === 'current' ? 'font-semibold text-[#C8D8E8]' : 'text-white'
                      }
                    >
                      {item.shortLabel}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-[258px] items-start justify-center pt-[2px]">
                <div className="h-[256px] w-[256px]">
                  {comparison.radarData.length > 0 ? (
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
                          tick={({ x, y, payload, cx, cy }) => (
                            <RadarAxisTick x={x} y={y} payload={payload} cx={cx} cy={cy} />
                          )}
                        />
                        <Tooltip content={<BenchmarkComparisonRadarTooltip />} />
                        {radarSeries.map(item => (
                          <Radar
                            key={item.key}
                            name={item.label}
                            dataKey={`${item.key}Display`}
                            stroke={item.color}
                            fill={
                              item.key === 'current' ? 'rgba(91,156,246,0.11)' : 'rgba(0,0,0,0)'
                            }
                            fillOpacity={item.key === 'current' ? 1 : 0}
                            strokeWidth={item.key === 'current' ? 2 : 1.2}
                          />
                        ))}
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-[12px] text-white">
                      비교 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {comparison.bestBaseline && comparison.categoryComparisonRows.length > 0 ? (
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
      )}
    </section>
  );
}

export default function SecurityResultDashboard({ sessionId, sessionDetail, isLoading }) {
  const isCsvDownloading = false;
  const isPdfDownloading = false;
  const isAwaitingInitialData = isLoading && !sessionDetail;
  const { failCount, reviewCount, safeCount } = getSummaryCounts(sessionDetail);
  const summaryText = getSummaryText(sessionDetail);
  const labelMaps = buildLabelMaps(sessionDetail);
  const matrixRows = buildMatrixRows(sessionDetail, labelMaps);
  const rawTopRiskItems = buildTopRiskItems(matrixRows);
  const topRiskItems = buildTopRiskItemsFromSummary(sessionDetail, rawTopRiskItems, labelMaps);
  const mitigationItems = topRiskItems
    .filter(item => item.status === '취약' || item.status === '검토 필요')
    .slice(0, 2);
  const overallScore = getOverallSafetyScore(sessionDetail);
  const totalValidatedCount = Number(sessionDetail?.total_questions ?? 0);
  const logItems = buildExecutionLogItems(sessionDetail, labelMaps);
  const overallScoreDisplay = isAwaitingInitialData ? '-' : Math.round(overallScore);
  const failCountDisplay = isAwaitingInitialData ? '-' : failCount;
  const reviewCountDisplay = isAwaitingInitialData ? '-' : reviewCount;
  const totalValidatedCountDisplay = isAwaitingInitialData ? '-' : `${totalValidatedCount}건`;

  const unifiedCategoryOrder = getUnifiedCategoryOrder(sessionDetail, matrixRows, labelMaps);

  const radarData = buildRadarDataFromSummary(
    sessionDetail,
    matrixRows,
    labelMaps,
    unifiedCategoryOrder
  );

  const benchmarkComparison = buildBenchmarkComparison(
    sessionDetail,
    labelMaps,
    unifiedCategoryOrder
  );

  const matrixColumns = [
    ...new Set(matrixRows.flatMap(row => row.cells.map(cell => cell.attackType).filter(Boolean))),
  ];

  function handleExportPdf() {}

  function handleDownloadCsv() {}

  return (
    <div className="overflow-hidden rounded-[28px]">
      <div className="relative w-full pt-[clamp(1rem,2.4vw,1.8rem)] pb-[clamp(0.5rem,1vw,0.8rem)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-4 xl:gap-x-8">
          <div className="min-w-0 max-w-[44rem]">
            <h1 className="text-[1.7rem] font-bold leading-[140%] tracking-[0.02em] text-white sm:text-[1.8rem] lg:text-[1.9rem] xl:text-[2.15rem]">
              {getRunRoundLabel(sessionDetail) || `세션 #${sessionId || '-'}`}
            </h1>
            <p className="text-[14px] font-bold text-[#7F93AF] lg:text-[15px]">
              {formatExecutionDate(sessionDetail?.started_at ?? sessionDetail?.created_at)}
            </p>
            <p className="mt-2 text-[14px] font-bold leading-[155%] text-white lg:text-[15px]">
              {isLoading
                ? '검증 결과를 불러오는 중입니다.'
                : summaryText || '요약 데이터가 없습니다.'}
            </p>
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
          className="mt-7 grid gap-4 xl:gap-5"
          style={{
            gridTemplateColumns: `repeat(${Math.min(4, 4)}, minmax(0, 1fr))`,
          }}
        >
          <SummaryCard
            label="Score"
            helperText="동일 항목 조합에서는 최악 결과를 점수에 반영합니다."
            value={overallScoreDisplay}
            bottomText="안전 점수"
            colorClassName={
              isAwaitingInitialData ? 'text-white' : getOverallScoreToneClass(overallScore)
            }
          />
          <SummaryCard
            label="취약항목"
            value={failCountDisplay}
            bottomText="즉시 조치 필요"
            colorClassName="text-[#FF5C66]"
          />
          <SummaryCard
            label="검토 필요"
            value={reviewCountDisplay}
            bottomText="수동 확인 필요"
            colorClassName="text-[#FFD038]"
          />
          <SummaryCard
            label="총 검증 항목"
            value={totalValidatedCountDisplay}
            bottomText={`세션 #${sessionId || '-'}`}
            colorClassName="text-[#31A4BD]"
            large
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:gap-5">
          <StatusDistributionSection
            failCount={failCount}
            reviewCount={reviewCount}
            safeCount={safeCount}
          />
          <VulnerabilityRadarSection radarData={radarData} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 xl:gap-5">
          <TopRiskSection items={topRiskItems} />
          <MitigationSection items={mitigationItems} />
        </div>

        <div className="mt-6">
          <ValidationMatrixSection rows={matrixRows} columns={matrixColumns} />
        </div>

        <div className="mt-6">
          <ExecutionLogSection
            items={logItems}
            isDownloading={isCsvDownloading}
            onDownloadCsv={handleDownloadCsv}
          />
        </div>

        <div className="mt-6">
          <BenchmarkComparisonSection comparison={benchmarkComparison} />
        </div>
      </div>
    </div>
  );
}
