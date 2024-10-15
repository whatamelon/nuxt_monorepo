export const formatConvertCamelToSnake = (value) => {
  if (!value) return ''
  return value.replace(/([a-zA-Z])(?=[A-Z])/g, '$1_').toLowerCase()
}
