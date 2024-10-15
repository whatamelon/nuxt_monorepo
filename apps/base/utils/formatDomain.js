export const formatCategoryDomainCode = () => {
  if (appStore().getDomain === 'orm') return '20'
  if (appStore().getDomain === 'nsr') return '10'
  return '30'
}

export const formatDomainCode = () => {
  if (appStore().getDomain === 'orm') return '10'
  if (appStore().getDomain === 'nsr') return '20'
  if (appStore().getDomain === 'greenforet') return '30'
}
