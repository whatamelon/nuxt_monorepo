export const formatAmpOrderNameFilter = (order) => {
  switch (order) {
    case 'latest':
      return 'latest'
    case 'highestPrice':
      return 'pricehigh'
    case 'lowestPrice':
      return 'pricelow'
    default:
      return ''
  }
}

export const formatAmpGenderNameFilter = (gender) => {
  if (gender === '10') {
    return 'male'
  }
  if (gender === '20') {
    return 'female'
  }
  if (gender === '30') {
    return 'kids'
  }
  return 'duesale'
}

export const formatAmpCatNameFilter = (cat) => {
  switch (cat) {
    case '00':
      return 'all'
    case '10':
      return 'outer'
    case '11':
      return 'jacket/gilet'
    case '20':
      return 'top'
    case '21':
      return 'jersey'
    case '22':
      return 'knit/cardigan'
    case '30':
      return 'bottom'
    case '31':
      return 'tights/pants'
    case '40':
      return 'onepiece'
    case '41':
      return 'onepiece/jumpsuite'
    case '50':
      return 'general'
    case '60':
      return 'bodysuite'
    case '70':
      return 'etc'
    default:
      return ''
  }
}

export const formatAmpBrandNameFilter = (cat) => {
  switch (cat) {
    case '11':
      return 'KOLON SPORT'
    case '12':
      return 'LUCKY CHOUETTE'
    case '15':
      return 'CAMBRIDGE MEMBERS'
    case '16':
      return 'SERIES'
    case '17':
      return 'RE;CODE'
    case '18':
      return 'SUECOMMA BONNIE'
    default:
      return ''
  }
}

export const formatAmpGradeNameFilter = (cat) => {
  switch (cat) {
    case 'AP':
      return 'aplus'
    case 'A':
      return 'a'
    case 'BP':
      return 'bplus'
    default:
      return ''
  }
}

export const formatAmpPriceNameFilter = (min, max) => {
  if (min === '0') return `${max.slice(0, 2)}under`
  if (max === '10000000') return `${min.slice(0, 2)}upper`
  return `${min.slice(0, 2)}to${max.slice(0, 2)}`
}

export const formatAmpQnatypeNameFilter = (cat) => {
  switch (cat) {
    case 'prod':
      return 'product'
    case 'deli':
      return 'delivery'
    case 'refu':
      return 'return'
    case 'etcq':
      return 'etc'
    default:
      return ''
  }
}

export const formatAmpPayMethodFilter = (payMethod) => {
  switch (payMethod) {
    case 'card':
      return 'card'
    case 'vbank':
      return 'cash'
    case 'kakaopay':
      return 'kakao'
    default:
      return ''
  }
}
