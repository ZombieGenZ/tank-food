export const formatNumber = (num: number): string => {
  let rounded: number
  if (num < 1000) {
    rounded = Math.floor(num / 10) * 10
  } else {
    rounded = Math.floor(num / 100) * 100
  }

  let result = rounded.toString()
  if (rounded >= 1000) {
    result = rounded.toLocaleString('en-US').replace(/,/g, ',')
  }

  return result + '+'
}
