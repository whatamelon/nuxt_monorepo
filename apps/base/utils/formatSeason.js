export const formatSeason = (payment) => {
  if (payment == null) return '-'
  if (payment === '-') return '-'
  if (payment === '') return '-'
  if (payment === 's') return '봄'
  if (payment === 'm') return '여름'
  if (payment === 'a') return '가을'
  if (payment === 'w') return '겨울'
  if (payment === 'f') return '사계절'
  if (payment === 'x') return '사계절'
  if (payment === '1') return 'SS'
  if (payment === '2') return 'AW'
  if (payment === '0') return '-'
}
