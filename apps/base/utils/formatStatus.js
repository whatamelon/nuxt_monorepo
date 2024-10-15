export const formatSalesStatus = (state) => {
  if (state === '' || state == null) return '-'
  switch (state) {
    case '10':
      return '주문완료'
    case '11':
      return '입금전'
    case '20':
      return '배송준비중'
    case '30':
      return '배송중'
    case '40':
      return '배송완료'
    case '50':
      return '반품중'
    case '51':
      return '반품중'
    case '52':
      return '반품중'
    case '53':
      return '반품중'
    case '54':
      return '반품중'
    case '55':
      return '반품중'
    case '58':
      return '반품취소'
    case '59':
      return '반품취소'
    case '60':
      return '반품완료'
    case '80':
      return '주문취소'
    case '81':
      return '주문취소'
    case '90':
      return '구매확정'
    default:
      return ''
  }
}

export const formatIpuStatus = (pckgState, itemState) => {
  if (pckgState === '' || pckgState === null) return '-'
  switch (pckgState) {
    case 'b0':
      return '수거 KIT 신청완료'
    case 'b1':
      return '수거 KIT 배송중'
    case 'b2':
      return '수거 KIT 배송완료'
    case 'b3':
      return '신청완료'
    case 'b4':
      return '신청완료'
    case 'p0':
      return '신청완료'
    case 'p1':
      return '신청완료'
    case 'd0':
      return '물품수거중'
    case 'f0':
      return '판매 실패'
    case 'f1':
      return '신청취소'
    case 'c0':
      switch (itemState) {
        case 'c0':
          return '검수중'
        case 'c1':
          return '반송대기'
        case 'c2':
          return '반송완료'
        case 'c9':
          return '수거 실패'
        case 'f0':
          return '판매 실패'
        case 'f1':
          return '신청취소'
        case 'w0':
          return '판매 완료 '
        case 'w1':
          return '판매 완료 '
        case 'w2':
          return '판매 완료 '
        case 'w3':
          return '판매 완료 '
        case 'w4':
          return '판매 완료 '
        case 'm0':
          return '판매 완료 '
        case 'm1':
          return '판매 완료 '
        case 'm2':
          return '판매 완료 '
        case 'r2':
          return '판매 완료 '
        case 'e0':
          return '판매 완료 '
        case 's0':
          return '판매 완료 '
        case 's1':
          return '판매 완료 '
        case 's2':
          return '판매 완료 '
        case 's3':
          return '판매 완료 '
        case 's4':
          return '판매 완료 '
        case 's5':
          return '판매 완료 '
        default:
          return '판매 완료 '
      }
    default:
      return ''
  }
}

export const formatItemStatus = (itemState) => {
  if (itemState === '' || itemState == null) return '-'
  switch (itemState) {
    case 'b0':
      return '수거KIT 신청완료 '
    case 'b1':
      return '수거 KIT 배송중'
    case 'b2':
      return '수거 KIT 배송완료'
    case 'b3':
      return '수거준비중'
    case 'b4':
      return '수거준비중'
    case 'p0':
      return '수거준비중'
    case 'p1':
      return '수거준비중'
    case 'd0':
      return '수거중'
    case 'c0':
      return '검수중'
    case 'c1':
      return '판매 실패'
    case 'c2':
      return '판매 실패'
    case 'c9':
      return '판매 실패'
    case 'f0':
      return '신청취소'
    case 'f1':
      return '신청취소'
    case 'w0':
      return '판매 완료 '
    case 'w1':
      return '판매 완료 '
    case 'w2':
      return '판매 완료 '
    case 'w3':
      return '판매 완료 '
    case 'w4':
      return '판매 완료 '
    case 'm0':
      return '판매 완료 '
    case 'm1':
      return '판매 완료 '
    case 'm2':
      return '판매 완료 '
    case 'r2':
      return '판매 완료 '
    case 'e0':
      return '판매 완료 '
    case 's0':
      return '판매 완료 '
    case 's1':
      return '판매 완료 '
    case 's2':
      return '판매 완료 '
    case 's3':
      return '판매 완료 '
    case 's4':
      return '판매 완료 '
    case 's5':
      return '판매 완료 '
    default:
      return '판매 완료 '
  }
}
