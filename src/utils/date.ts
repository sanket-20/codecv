import dayjs from 'dayjs'
import 'dayjs/locale/en-us'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('en-us')

export function formatTime(time: string | number) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
// Return based on the current time, such as: seconds ago...minutes ago...words
export function formatTimefromNow(time: string | number) {
  return dayjs(time).fromNow()
}
