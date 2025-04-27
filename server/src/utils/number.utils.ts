// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

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
