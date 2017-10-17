require("../css/base.css");
require("../css/main.css");
require("./common.js");
(function(){
  /* Modal object handles the modal speciically*/
  var modal = {
    element:$('.modal'),
    image:'',
    title:'',
    /*  Loads the image into the modal*/
    loadImage:function(){
      var imageHtml = '<img src="'+this.image+'" alt="Gallery Image" />';
      this.element.find('.modal-content').html(imageHtml);
    },
    loadTitle:function(){
      this.element.find('.modal-header .image-title h3').html(this.title)
    },
    show:function(){
      this.element.removeClass('hide-modal');
      this.element.addClass('show-modal');
    },
    hide:function(){
      $('.modal').removeClass('show-modal');
      $('.modal').addClass('hide-modal');
    }
  };

  /* Modal object handles the overlay around the modal speciically*/
  var overlay = {
    element:$('.popup-overlay'),
    show:function(){
      $('.popup-overlay').removeClass('hide-overlay');
      $('.popup-overlay').addClass('show-overlay');
    },
    hide:function(){
      $('.popup-overlay').removeClass('show-overlay');
      $('.popup-overlay').addClass('hide-overlay');
    }
  };
  /* Handles the entire popup lifecycle*/
  var popup = {
    modalImage:'',
      modalTitle:'',
    show:function(){
      modal.image=this.modalImage;
      if(this.modalTitle.trim().length>0){
        modal.title = this.modalTitle;
      }else{
        modal.title = "Image";
      }
      modal.loadTitle();
      modal.loadImage();
      overlay.show();
      modal.show();
    },
    hide:function(){
      modal.hide();
      overlay.hide();
    }
  };
  /* Infinite scroll object*/
  var infiniteScroll={
    currentlyLoadedOffset:12,
    loadingLimit:12,
    showLoading:function(){
      $(".images-loading").addClass("show-images-loading");
    },
    hideLoading:function(){
      $(".images-loading").removeClass("show-images-loading");
    },
    next:function(){
        this.currentlyLoadedOffset+=this.loadingLimit;
    }
  };
  $(document).ready(function(e){
    $('body').on('click','.single-image',function(){
      // set the data for the modal
      var dataImage = $(this).attr('data-image');
      var dataTitle = $(this).attr('data-title');
      popup.modalImage = dataImage;
      popup.modalTitle = dataTitle;
      //show the popup
      popup.show();
    })
    $('body').on('click','.close-button',function(){
      //hide the popup
      popup.hide();
    });
    var isLoading = false; //Variable to check if a content is being loaded currently
    $(window).scroll(function() {
      if(!isLoading){
      if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        //setting the loading var to true
        isLoading = true;
        //display loading
        infiniteScroll.showLoading();
        //api url
        var url = "https://api.giphy.com/v1/gifs/search?q=movies&limit=12&offset="+infiniteScroll.currentlyLoadedOffset+"&api_key=EaCnmIG6flyizJVvfsCPUP7525WowfZu";
        $.get(url,function(response){
          var completeImagePackage="";
          console.log(response);
          response["data"].forEach(function(currentElement){
            var imagePreview = currentElement.images.fixed_width_small.url;
            var dataImage = currentElement.images.downsized_medium.url;
            var dataTitle = currentElement.title;
            var html = '<div class=single-image data-title='+dataTitle+' data-image='+dataImage+'>';
            html += '<img src='+imagePreview+' alt=Gallery Image />';
            html += '</div>';
            completeImagePackage += html;
          });
          //Hiding the loading for infinite scroll
          infiniteScroll.hideLoading();
          $(".images-container").append(completeImagePackage);
          //loading complete
          isLoading = false;
        });
        infiniteScroll.next();
      }
    }
    });
  });
})();
