export function pattern (dateTimeStamp) {
  var d = new Date(dateTimeStamp)
  d.pattern = function name(fmt) {
    var o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
      'H+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds() // 毫秒
    }
    var week = {
      0: '/u65e5',
      1: '/u4e00',
      2: '/u4e8c',
      3: '/u4e09',
      4: '/u56db',
      5: '/u4e94',
      6: '/u516d'
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (RegExp.$1.length > 1
          ? RegExp.$1.length > 2
            ? '/u661f/u671f'
            : '/u5468'
          : '') + week[this.getDay() + '']
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
  return d.pattern('MM月dd号HH时mm分')
}

export function timeago(dateTimeStamp) {
  let result
  // dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  var minute = 1000 * 60 // 把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60
  var day = hour * 24
  var week = day * 7
  // eslint-disable-next-line no-unused-vars
  var halfamonth = day * 15
  var month = day * 30
  var now = new Date().getTime() // 获取当前时间毫秒
  var diffValue = now - dateTimeStamp // 时间差

  if (diffValue < 0) {
    return
  }
  var minC = diffValue / minute // 计算时间差的分，时，天，周，月
  var hourC = diffValue / hour
  var dayC = diffValue / day
  var weekC = diffValue / week
  var monthC = diffValue / month
  if (monthC >= 1 && monthC <= 3) {
    // eslint-disable-next-line no-undef
    result = ' ' + parseInt(monthC) + '月前'
  } else if (weekC >= 1 && weekC <= 3) {
    // eslint-disable-next-line no-undef
    result = ' ' + parseInt(weekC) + '周前'
  } else if (dayC >= 1 && dayC <= 6) {
    // eslint-disable-next-line no-undef
    result = ' ' + parseInt(dayC) + '天前'
  } else if (hourC >= 1 && hourC <= 23) {
    // eslint-disable-next-line no-undef
    result = ' ' + parseInt(hourC) + '小时前'
  } else if (minC >= 1 && minC <= 59) {
    // eslint-disable-next-line no-undef
    result = ' ' + parseInt(minC) + '分钟前'
  } else if (diffValue >= 0 && diffValue <= minute) {
    // eslint-disable-next-line no-undef
    result = '刚刚'
  } else {
    var datetime = new Date()
    datetime.setTime(dateTimeStamp)
    var Nyear = datetime.getFullYear()
    var Nmonth =
      datetime.getMonth() + 1 < 10
        ? '0' + (datetime.getMonth() + 1)
        : datetime.getMonth() + 1
    var Ndate =
      datetime.getDate() < 10
        ? '0' + datetime.getDate()
        : datetime.getDate()
    // eslint-disable-next-line no-unused-vars
    var Nhour =
      datetime.getHours() < 10
        ? '0' + datetime.getHours()
        : datetime.getHours()
    // eslint-disable-next-line no-unused-vars
    var Nminute =
      datetime.getMinutes() < 10
        ? '0' + datetime.getMinutes()
        : datetime.getMinutes()
    // eslint-disable-next-line no-unused-vars
    var Nsecond =
      datetime.getSeconds() < 10
        ? '0' + datetime.getSeconds()
        : datetime.getSeconds()
    // eslint-disable-next-line no-undef
    result = Nyear + '-' + Nmonth + '-' + Ndate
  }
  return result
}
