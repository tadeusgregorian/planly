
export const createCookie = (name, value, domain, days) => {
  let expires;

  let date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  expires = date.toGMTString();

  //document.cookie = name + '=' + value + expires + '; path=/ ; domain=' + domain  + ';';

  const cookieStr =  `loggedIn=${value}; expires=${expires}; path=/; domain=${domain}`
  console.log(cookieStr);
  document.cookie= cookieStr
};

export const deleteCookie = (name) =>  {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
