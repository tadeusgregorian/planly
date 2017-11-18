//@flow
import moment from 'moment'

export const generateGuid = () => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const x1 = possible.charAt(Math.floor(Math.random() * possible.length))
  const x2 = possible.charAt(Math.floor(Math.random() * possible.length))
  const unix = moment().format('X')
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  let uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    // eslint-disable-next-line
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  });
  return unix + uuid + x1 + x2
}

export const shadeColor = (color: string, percent: number) => {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF; // eslint-disable-line
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

export const isValidEmail = (email: string) => {
	// eslint-disable-next-line
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export const getNextID = (prefix: string, num: number) => {
  if(num < 10) 	  return ( prefix + '00' + num)
  if(num < 100) 	return ( prefix + '0' + num)
  if(num < 1000)  return ( prefix + num)
  throw new Error('error_in_getNextID_tade')
}

export const replaceDotsWithCommas = (str: string | number) => str.toString().replace(/\./g, ',')
export const replaceCommasWithDots = (str: string | number) => str.toString().replace(/,/g, '.')

export const withoutProp = (obj: {}, prop: string) => {
	const obj_copy = { ...obj }
	delete obj_copy[prop]
	return obj_copy
}

// checks if the function fn is true for a node or a parent node.
export const closest = (el: any, fn: (any)=>boolean) => {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}

export const closestWithAttribute = (el: any, attrName: string, attrValue: string) => {
  const elementHasAttribute = (el: HTMLElement): boolean => {
    return !!(el.getAttribute && el.getAttribute(attrName) === attrValue)
  }
  return closest(el, (element) => elementHasAttribute(element))
}

export const momToSmart = (mom: moment): number => {
  return parseInt(moment(mom).format('YYYYMMDD'), 10)
}

export const smartToMom = (smartDate: number): moment => {
  return moment(smartDate.toString(), 'YYYYMMDD')
}

export const momToSmartWeek = (mom: moment): number => {
  const year = moment(mom).year()
  const week = moment(mom).week()
  return parseInt((year + '' + week), 10)
}

export const smartWeekToMom = (smartWeek: number | string) => {
  const year = parseInt(smartWeek.toString().substr(0, 4), 10)
  const week = parseInt(smartWeek.toString().substr(4, 2), 10)
  return moment().year(year).week(week).weekday(0) // .day() is not localeAware. .day(1) gets always the Monday.
}

// checks if the string is in the format of a Integer
export const isIntStr = (inp: string) => {
  const lastChar = inp.slice(-1)
  if(inp === '0') return true
  if(inp === '') return true
  if(parseInt(inp, 10) && (parseInt(lastChar,10) || lastChar === '0')) return true
  return false
}

export const inpToInt = (inp: string): number =>
  inp === '' ? 0 : parseInt(inp, 10)

export const getPagePosOfElement = (elem: HTMLElement) => {
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX
  };
}
