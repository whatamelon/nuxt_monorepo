export const formatCompname = (template) => {
  if (template.type !== template.alias) {
    return template.alias.replace('_', '')
  }
  return template.type
}
