export const formatOptionKey = (optKey) => {
  if (optKey === 's') return '사이즈'
  if (optKey === 'g') return '상태'
  if (optKey === 'c') return '색상'
  if (optKey === 'o') return '옵션'
  if (optKey === 'm') return '옵션'
}

export const formatOptionValue = (opt) => {
  if (opt.split('=')[0] === 's' || opt.split('=')[0] === 'o' || opt.split('=')[0] === 'm') {
    return opt.split('=')[1]
  }
  if (opt.split('=')[0] === 'g') {
    const grade = opt.split('=')[1]
    if (grade === 'S') return '최상급'
    if (grade === 'AP') return 'A+ 최상급'
    if (grade === 'A') return 'A 상급'
    if (grade === 'BP') return 'B+ 중급'
    return ''
  }
  if (opt.split('=')[0] === 'c') {
    const color = opt.split('=')[1]
    if (color.indexOf('#') > -1) {
      const idx = color.indexOf('#')
      return color.slice(0, idx)
    }
    return color
  }
}
