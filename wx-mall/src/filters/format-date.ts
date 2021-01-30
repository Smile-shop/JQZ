import moment from 'moment';

// 年月日
export function dateYMD(date: string | Date): string {
  if (date) {
    return moment(date).format('YYYY-MM-DD');
  } else {
    return date;
  }
}

// 年月日时分秒
export function dateYMDHMS(date: string): string {
  if (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return date;
  }
}
