//@flow
type CreateCookie = (string, string, string, number)=>void
export const createCookie: CreateCookie = (name, value, domain, days) => {
  let expires;

  let date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

  //$FlowFixMe
  expires = date.toGMTString();

  const cookieStr =  `${name}=${value}; expires=${expires}; path=/; domain=${domain}`
  document.cookie= cookieStr
};

export const deleteCookie = (name: string, domain: string) =>  {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=${domain}`;
}

export const getCookieByName = (name: string):string => {
  const cookie = document.cookie
  if(!cookie || !cookie.includes(name + '=')) return ''
  return cookie.split('=')[1]
}
