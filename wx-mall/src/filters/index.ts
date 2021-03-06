import Vue from 'vue';
import {formatCurrencyFraction} from './format-currency';
import {dateYMD, dateYMDHMS} from './format-date';
import {pointSign} from './format-point';
import {padEndUnit, padStartUnit} from './format-unit';
import {addressConcat} from './format-address';
import {orderStatus, expressType} from './format-order';
import {notImage} from './format-notImageURL';

Vue.filter('formatCurrencyFraction', formatCurrencyFraction);
Vue.filter('dateYMD', dateYMD);
Vue.filter('dateYMDHMS', dateYMDHMS);
Vue.filter('pointSign', pointSign);
Vue.filter('padEndUnit', padEndUnit);
Vue.filter('padEndUnit', padEndUnit);
Vue.filter('padStartUnit', padStartUnit);
Vue.filter('addressConcat', addressConcat);
Vue.filter('orderStatus', orderStatus);
Vue.filter('expressType', expressType);
Vue.filter('notImage', notImage);
