export const formatWon = (value) => {
  if (!value) return ''
  return Number(value).toLocaleString()
}

export const formatWonNoBlank = (value) => {
  if (!value) return '0'
  return Number(value).toLocaleString()
}

export const formatPhone = (phone) => {
  if (!phone) return '0'
  if (phone.length === 9) {
    return `${phone.substring(0, 2)}-${phone.substring(2, 5)}-${phone.substring(5)}`
  }
  if (phone.length === 10) {
    return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`
  }
  return `${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7, 11)}`
}

export const formatWonWithSymbol = (value) => {
  if (!value) return ''
  if (value.toString().indexOf('-') > -1) {
    return Number(value.toString().slice(1)).toLocaleString()
  }
  return `-${Number(value).toLocaleString()}`
}

export const formatPayMethod = (value) => {
  if (!value) return '-'
  switch (value) {
    case 'card':
      return '신용/체크카드'
    case 'vbank':
      return '가상계좌'
    case 'kakaopay':
      return '카카오페이'
    default:
      return value
  }
}
