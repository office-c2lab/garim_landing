export function getFirstText(...values) {
  for (const value of values) {
    const normalized = String(value ?? '').trim();
    if (normalized) return normalized;
  }

  return '';
}

export function getBenchmarkSessionId(session) {
  return Number(session?.session_id ?? session?.id ?? 0) || null;
}

export function createProgressRowsFromMatrix(sessionDetail) {
  const matrixProgress = Array.isArray(sessionDetail?.matrix_progress)
    ? sessionDetail.matrix_progress
    : [];
  return matrixProgress
    .map(row => {
      const label = getFirstText(
        row?.risk_category_label,
        row?.category_label,
        row?.risk_category,
        row?.category
      );
      const items = (Array.isArray(row?.cells) ? row.cells : [])
        .map(cell => ({
          label: getFirstText(
            cell?.attack_style_label,
            cell?.question_format_label,
            cell?.question_type_label,
            cell?.attack_style,
            cell?.question_format,
            cell?.question_type
          ),
          completed: Boolean(cell?.done),
        }))
        .filter(item => item.label);

      if (!label || items.length === 0) return null;

      return {
        label,
        items,
        isComplete: Boolean(row?.row_done),
      };
    })
    .filter(Boolean);
}

export function getBenchmarkTerminalToast(status, normalizedType) {
  if (status === 'completed') {
    return {
      title: '검증 완료',
      tone: 'news',
      actionLabel: '결과 보기',
      duration: 10000,
      fallbackMessage: `${normalizedType === 'security' ? '보안성' : '책임성'} 검증이 완료되었습니다.`,
    };
  }

  if (status === 'canceled') {
    return {
      title: '검증 취소',
      tone: 'info',
      actionLabel: '',
      duration: 7000,
      fallbackMessage: `${normalizedType === 'security' ? '보안성' : '책임성'} 검증이 취소되었습니다.`,
    };
  }

  return {
    title: '검증 실패',
    tone: 'error',
    actionLabel: '',
    duration: undefined,
    fallbackMessage: `${normalizedType === 'security' ? '보안성' : '책임성'} 검증 상태를 확인해 주세요.`,
  };
}
