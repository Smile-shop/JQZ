import Vue from 'vue';
import moment from 'moment';

Vue.filter('addUnitEnd', (
  data: string,
  unit: string,
  isForceShow: boolean
) => {
  if (data) {
    if (unit) {
      return String(data).concat(unit)
    } else {
      return data
    }
  } else if (isForceShow) {
    return String(data).concat(unit)
  } else {
    return ''
  }
})

Vue.filter('addUnitStart', (
  data: string,
  unit: string,
  isForceShow: boolean
) => {
  if (data) {
    if (unit) {
      return String(unit).concat(data)
    } else {
      return data
    }
  } else if (isForceShow) {
    return String(unit).concat(data)
  } else {
    return ''
  }
})
