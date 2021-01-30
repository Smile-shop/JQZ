// 全局方法
import moment from 'moment';
import { deepClone, compileStr, unCompileStr, getUrlParam } from "@/utils/functions";
import httpServer from '@/utils/http';
// 全局组件
import { Popup, Toast, Dialog } from 'vant';
import Header from '@/components/Header';
import InputField from '@/components/InputField';
import SelectField from '@/components/SelectField';
let GlobalUtils = {}
GlobalUtils.install = function(Vue, options) {
  // 全局方法
  Vue.prototype.moment = moment;
  Vue.prototype.deepClone = deepClone;
  Vue.prototype.compileStr = compileStr;
  Vue.prototype.unCompileStr = unCompileStr;
  Vue.prototype._http = httpServer;
  // 全局变量
  Vue.prototype.httpUrl = VUE_APP_BASE_API;
  Vue.prototype.urlData = null;
  // 全局过滤
  // 时间
  Vue.filter('datefmt', (input, fmtstring) => {
    if(input) {
      return moment(input).format(fmtstring);
    }
  });
  // 时间
  Vue.filter('datefmt2', (input) => {
      if(input) {
        //处理IOS环境没有夏令时问题   
        var date = new Date(input);
        if(date.getHours()>22){
          input = input+60*60*1000;
        }
        return moment(input).format("YYYY-MM-DD");
      }
    });
  // 金钱
  Vue.filter('moneyfc', (input, fcnum) => {
    if(input) {
      let number = typeof(fcnum) == 'undefined' ? 2 : fcnum;
      return (input * 1).toFixed(number);
    } else {
      return 0;
    }
  });
  // 全局组件
  Vue.component('VanPopup', Popup);
  Vue.component('Toast', Toast);
  Vue.component('Dialog', Dialog);
  Vue.component('Header', Header);
  Vue.component('InputField', InputField);
  Vue.component('SelectField', SelectField);
}
export default GlobalUtils