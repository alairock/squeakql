export const numberParse = (value: string) => {
  const no_symbols = value.replace(/[^\-\.\d]+/g, '')
  const mark_first_decimal = no_symbols.replace('.', '__')
  const other_decimals_stripped = mark_first_decimal.replace(/\./g, '')
  const final = other_decimals_stripped.replace('__', '.')
  return +final
}
