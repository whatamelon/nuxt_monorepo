/** product list 로딩 상태 */
export const useLoadingProductList = () => useState('loadingProductList', () => true)
/** home dialog open 상태 */
export const useHomeDialogOpen = () => useState('homeDialogOpen', () => false)
/**
 * 제품 상세 페이지를 어떤 경로에서 들어왔는지 확인
 * 1. /product_list
 * 2. index
 * 3. /event/pl/[id]
 * 4. /my/product/favor
 * 5. /my/product/recent
 * */
export const useContinueShopping = () => useState('continueShopping', () => '/product_list')
