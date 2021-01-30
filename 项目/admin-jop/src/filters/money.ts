import Vue from 'vue';

export function money(num: number | string, toFixed?: number) {
  if (num === '--') {
    return num
  } else if (num === null || num === undefined) {
    return '--'
  }
  const n1 = toFixed && toFixed > 0 && toFixed <= 20 ? toFixed : 0;
  num = parseFloat((num + '').replace(/[^\d\.-]/g, '')).toFixed(n1) + '';
  const l = num.split('.')[0].split('').reverse();
  const r = num.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
  }
  return t.split('').reverse().join('') + '.' + r;
}

Vue.filter('money', money);