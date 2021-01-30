import Vue from 'vue';
import moment from 'moment';

export function momentFilter(
  date: number| string,
  format: string = 'YYYY-MM-DD HH:mm:ss'
) {
  return date ? moment(date).format(format) : '';
}

Vue.filter('momentFilter', momentFilter);

// 年-月-日 时:分
Vue.filter('ymdhm', (date: any) => {
  if (date) {
    const importTime = moment(date) // 输入时间
    return importTime.format('YYYY-MM-DD HH:mm')
  } else {
    return ''
  }
})
