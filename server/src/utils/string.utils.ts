// Bản quyền (c) 2025 TANK Groups
//
// Tác phẩm này được cấp phép theo Giấy phép Creative Commons
// Attribution-NonCommercial-NoDerivatives 4.0 International.
// Để xem một bản sao của giấy phép này, vui lòng truy cập
// http://creativecommons.org/licenses/by-nc-nd/4.0/

import { LocationData } from '~/constants/location.constants'

export const SplitTranslationString = (content: string) => {
  const firstPart: string = content.substring(0, 5)
  const secondPart: string = content.substring(9, 14)
  const remainingPart: string = content.substring(15)

  return {
    language_1: firstPart,
    language_2: secondPart,
    translate_string: remainingPart
  }
}

export const extractLocationData = (text: string): LocationData => {
  const departureLocationPattern = /Địa điểm xuất phát: (.*)\n/
  const destinationLocationPattern = /Địa điểm đến: (.*)\n/
  const departureCountryPattern = /Quốc gia xuất phát: (.*)\n/
  const destinationCountryPattern = /Quốc gia đến: (.*)\n/
  const distancePattern = /Khoảng cách: (.*) km\n/
  const travelCostPattern = /Chi phí di chuyển: (.*) VND\n/
  const suggestedRoutePattern = /Tuyến đường đề xuất: (.*)\n/
  const estimatedTimePattern = /Thời gian ước tính: (.*)/

  const departureLocation = text.match(departureLocationPattern)?.[1] || ''
  const destinationLocation = text.match(destinationLocationPattern)?.[1] || ''
  const departureCountry = text.match(departureCountryPattern)?.[1] || ''
  const destinationCountry = text.match(destinationCountryPattern)?.[1] || ''
  const distance = text.match(distancePattern)?.[1] || ''
  const travelCost = text.match(travelCostPattern)?.[1] || ''
  const suggestedRoute = text.match(suggestedRoutePattern)?.[1] || ''
  const estimatedTime = text.match(estimatedTimePattern)?.[1] || ''

  return {
    departureLocation,
    destinationLocation,
    departureCountry,
    destinationCountry,
    distance: Number(distance),
    travelCost: Number(travelCost),
    suggestedRoute,
    estimatedTime
  }
}
