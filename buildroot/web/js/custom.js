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
        if(isMobile()){
          window.location.href = '/mob'
        }else{
          window.location.href = '/app'
        }
    });
})

function isMobile() {
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
