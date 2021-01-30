import dayjs from 'dayjs';

enum Status {
  notStarted,
  hasStarted,
  over
}

export function getRelativeTime(start: number | dayjs.Dayjs, end: number | dayjs.Dayjs) {
  const now = dayjs();
  start = dayjs(start);
  end = dayjs(end);
  let tartgetTime = null;
  // 状态
  const result = {
    status: 2,
    day: '0',
    hour: '0',
    minute: '0',
    second: '0',
    millisecond: '0'
  };


  if (now.isBefore(start)) {
    // 还没开始
    result.status = Status.notStarted;
    tartgetTime = start;
  } else if (now.isAfter(end)) {
    // 已经结束
    result.status = Status.over;
  } else {
    // 进行中
    result.status = Status.hasStarted;
    tartgetTime = end;
  }

  function fillZero(number: number, length = 2) {
    return String(number).padStart(length, '0');
  }

  if (tartgetTime) {
    const differenceDay = tartgetTime.diff(now, 'day');
    const differenceHour = tartgetTime.diff(now, 'hour');
    const differenceMinute = tartgetTime.diff(now, 'minute');
    const differenceSecond = tartgetTime.diff(now, 'second');
    const differenceMillisecond = tartgetTime.diff(now, 'millisecond');
    result.day = fillZero(differenceDay, 1);
    result.hour = fillZero(differenceHour - differenceDay * 24);
    result.minute = fillZero(differenceMinute - differenceHour * 60);
    result.second = fillZero(differenceSecond - differenceMinute * 60);
    result.millisecond = fillZero(differenceMillisecond - differenceSecond * 1000);
  }

  return result;
}
