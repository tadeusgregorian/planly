/* eslint-disable */

// preloader
$(window).load(function(){
    $('.preloader').fadeOut(1000); // set duration in brackets
});

$(function() {
    new WOW().init();
    $('.templatemo-nav').singlePageNav({
    	offset: 70
    });

    /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a').click(function(){
        $(".navbar-collapse").collapse('hide');
    });

    $('#loginBtn').click(function(){
        window.location.href = '/login/'
    });
})

export const getCookie = (name) => {
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
