//@flow
export const createCookie = (name: string, value: string, days: number) => {
  let expires;
  if (days) {
    let date: any = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toGMTString();
  } else {
    expires = '';
  }
  document.cookie = name + '=' + value + expires + '; path=/';
};

export const getCookie = (name: string) => {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(name + '=');
    if (c_start !== -1) {
      c_start = c_start + name.length + 1;
      let c_end = document.cookie.indexOf(';', c_start);
      if (c_end === -1) {
        c_end = document.cookie.length;
      }
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
};

export const deleteCookie = (name: string) =>  {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const isMobile = () => {
 const isMobile =
      navigator.userAgent.match(/Android/i)
   || navigator.userAgent.match(/webOS/i)
   || navigator.userAgent.match(/iPhone|iPad|iPod/i)
   || navigator.userAgent.match(/BlackBerry/i)
   || navigator.userAgent.match(/Windows Phone/i)
   || navigator.userAgent.match(/IEMobile/i)
   || navigator.userAgent.match(/Opera Mini/i)
   || window.screen.width <= 600
  return !!isMobile
}
