require("../css/normalize.css");
$(document).ready(function(){
  $(".loading-wrapper").hide();
  $('body').on('click','.mobile-menu',function(){
    $('.navigation-container').slideToggle();
  });
});
