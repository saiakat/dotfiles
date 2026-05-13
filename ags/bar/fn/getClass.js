export const getClass = (conditions) => {
  const classes = ["success", "critical", "danger"];
  const [condition] = conditions.filter(cond => cond === true)
  return classes[conditions.indexOf(condition)]
}
