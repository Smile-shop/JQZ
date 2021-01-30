import moment from 'moment';
import Vue from 'vue';

Vue.directive('activityDateTime', (element, vNodeDirective) => {
  const {dateStart, dateEnd} = vNodeDirective.value;
  // 开始时间
  const dateStartMoment = moment(dateStart);
  // 结束时间
  const dateEndMoment = moment(dateEnd);
  // 定时器
  let timer: any = null;

  function dateTimeOutput() {
    // 当前时间
    const dateNowMoment = moment();

    // 判断时间是否能够解析
    if (dateStartMoment.isValid() && dateEndMoment.isValid()) {
      if (dateNowMoment.isBefore(dateStartMoment)) {
        // 活动开始前

        // 活动开始相差天数
        const daysStartDiff = dateStartMoment.diff(dateNowMoment, 'days');
        // 活动开始相差小时数
        const hourStartDiff = dateStartMoment.diff(dateNowMoment, 'hours');
        // 活动开始相差分数
        const minutesStartDiff = dateStartMoment.diff(dateNowMoment, 'minutes');
        // 活动开始相差秒数
        const secondsStartDiff = dateStartMoment.diff(dateNowMoment, 'seconds');
        // 开始文本
        const startText = '距离活动开始还剩';
        // 开始时间
        const startTime = `
          ${daysStartDiff}天
          ${hourStartDiff - daysStartDiff * 24}小时
          ${minutesStartDiff - hourStartDiff * 60}分
          ${secondsStartDiff - minutesStartDiff * 60}秒
        `;

        const nameElement = element.querySelector('.name');
        const timeElement = element.querySelector('.time');
        nameElement!.textContent = startText;
        timeElement!.textContent = startTime;
      } else if (dateNowMoment.isBetween(dateStartMoment, dateEndMoment)) {
        // 活动开始相差天数
        const daysEndDiff = dateEndMoment.diff(dateNowMoment, 'days');
        // 活动开始相差小时数
        const hourEndDiff = dateEndMoment.diff(dateNowMoment, 'hours');
        // 活动开始相差分数
        const minutesEndDiff = dateEndMoment.diff(dateNowMoment, 'minutes');
        // 活动开始相差秒数
        const secondsEndDiff = dateEndMoment.diff(dateNowMoment, 'seconds');
        // 结束文本
        const endText = '距离活动结束还剩';
        // 结束时间
        const endTime = `
          ${daysEndDiff}天
          ${hourEndDiff - daysEndDiff * 24}小时
          ${minutesEndDiff - hourEndDiff * 60}分
          ${secondsEndDiff - minutesEndDiff * 60}秒
        `;

        const nameElement = element.querySelector('.name');
        const timeElement = element.querySelector('.time');
        nameElement!.textContent = endText;
        timeElement!.textContent = endTime;
      } else if (dateNowMoment.isAfter(dateEndMoment)) {
        // 活动结束了

        element.innerHTML = '活动结束了';
        clearInterval(timer);
      }
    } else {
      // 时间错误
      element.innerHTML = '时间解析错误';
      clearInterval(timer);
    }
  }

  timer = setInterval(dateTimeOutput, 1000);
});
