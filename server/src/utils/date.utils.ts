import { TimeUnit } from '~/constants/date.constants'

export const formatDateFull = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`
}

export const formatDateFull2 = (date: Date): string => {
  const formatDate = new Date(date)
  const second = String(formatDate.getSeconds()).padStart(2, '0')
  const minute = String(formatDate.getMinutes()).padStart(2, '0')
  const hour = String(formatDate.getHours()).padStart(2, '0')
  const day = String(formatDate.getDate()).padStart(2, '0')
  const month = String(formatDate.getMonth() + 1).padStart(2, '0')
  const year = formatDate.getFullYear()

  return `${hour}:${minute}:${second} ${day}/${month}/${year}`
}

export const formatDateNotSecond = (date: Date): string => {
  const formatDate = new Date(date)
  const minute = String(formatDate.getMinutes()).padStart(2, '0')
  const hour = String(formatDate.getHours()).padStart(2, '0')
  const day = String(formatDate.getDate()).padStart(2, '0')
  const month = String(formatDate.getMonth() + 1).padStart(2, '0')
  const year = formatDate.getFullYear()

  return `${hour}:${minute} ${day}/${month}/${year}`
}

export const formatDateOnlyDayAndMonth = (date: Date): string => {
  const formatDate = new Date(date)
  const day = String(formatDate.getDate()).padStart(2, '0')
  const month = String(formatDate.getMonth() + 1).padStart(2, '0')

  return `${day}/${month}`
}

export const formatDateOnlyDayAndMonthAndYear = (date: Date): string => {
  const formatDate = new Date(date)
  const day = formatDate.getDate().toString().padStart(2, '0')
  const month = (formatDate.getMonth() + 1).toString().padStart(2, '0')
  const year = formatDate.getFullYear()

  return `${day}/${month}/${year}`
}

export const isLastDayOfMonth = (): boolean => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return tomorrow.getDate() === 1
}

export const isValidTimeFormat = (str: string): boolean => /^\d+[smdwmo|ySMDWMO|Y]$/.test(str)

export const calculateFutureTime = (str: string): Date | null => {
  if (!isValidTimeFormat(str)) return null
  const [_, value, unit] = str.match(/^(\d+)([smdwmo|ySMDWMO|Y])$/)!
  const n = +value,
    u = unit.toLowerCase() as Lowercase<TimeUnit>
  const t = new Date()
  return new Date(
    t.setTime(
      t.getTime() + u === 's'
        ? n * 1000
        : u === 'm'
          ? n * 60000
          : u === 'd'
            ? n * 86400000
            : u === 'w'
              ? n * 604800000
              : u === 'mo'
                ? n * 2592000000
                : n * 31536000000
    )
  )
}
