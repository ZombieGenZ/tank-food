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

export const isLastDayOfMonth = (): boolean => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  return tomorrow.getDate() === 1
}
