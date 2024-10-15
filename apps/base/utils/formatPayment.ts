export const formatPayment = (payment: string) => {
  const lowerPayment = payment.toLowerCase()
  if (lowerPayment === 'cash') return '가상계좌입금'
  if (lowerPayment === 'vbank') return '가상계좌입금'
  if (lowerPayment === 'kakao') return '카카오페이'
  if (lowerPayment === 'kakaopay') return '카카오페이'
  if (lowerPayment === 'card') return '신용/체크카드'
  if (lowerPayment === 'easy_pay') return '간편결제'
  if (lowerPayment === 'virtual_account') return '가상계좌'
  if (lowerPayment === 'mobile_phone') return '휴대폰'
  if (lowerPayment === 'transfer') return '계좌이체'
  if (lowerPayment === 'culture_gift_certificate') return '문화상품권'
  if (lowerPayment === 'book_gift_certificate') return '도서문화상품권'
  if (lowerPayment === 'gamee_gift_certificate') return '게임문화상품권'
  if (lowerPayment === 'tosspay') return '토스페이'
  if (lowerPayment === 'naverpay') return '네이버페이'
  if (lowerPayment === 'samsungpay') return '삼성페이'
  if (lowerPayment === 'lpay') return '엘페이'
  if (lowerPayment === 'kakaopay') return '카카오페이'
  if (lowerPayment === 'ssg') return 'SSG페이'
  if (lowerPayment === 'applepay') return '애플페이'
  if (lowerPayment === 'pinpay') return '핀페이'
  if (lowerPayment === 'payco') return '페이코'
  return '-'
}
