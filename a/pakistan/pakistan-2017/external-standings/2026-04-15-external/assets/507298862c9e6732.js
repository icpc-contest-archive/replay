var js_local_vars = {"header_padding_bottom":"0px","header_padding_top":"0px",
"header_position":"Left","header_sticky":"1","header_sticky_tablet":"0","header_sticky_mobile":"0",
"header_sticky_type2_layout":"menu_only","sticky_header_shrinkage":"1","is_responsive":"1","logo_alignment":"Left","logo_margin_bottom":"31px","logo_margin_top":"31px",
"submenu_slideout":"1","side_header_break_point":"850","sidenav_behavior":"Hover",
"site_width":"1300px","slider_position":"below","slideshow_autoplay":"1","slideshow_speed":"7000","smooth_scrolling":"0","side_header_width":"203"};
function blah(){
        var element = document.getElementById("side-header");
        element.className += " " + 'bounceInLeft';
    }
    blah();
	  jQuery('.footerLabel').click(function() {
    var clicks = jQuery(this).data('clicks');
    if (clicks) {
	    jQuery(this).find("span.footerAccordPlus i.fa").removeClass("fa-minus-square-o");
	    jQuery(this).find("span.footerAccordPlus i.fa").addClass("fa-plus-square-o");
    } else {
        jQuery(this).find("span.footerAccordPlus i.fa").removeClass("fa-plus-square-o");
	    jQuery(this).find("span.footerAccordPlus i.fa").addClass("fa-minus-square-o");
    }
    jQuery(this).data("clicks", !clicks);
});
 jQuery(document).ready(function() {
     jQuery('<div id="mobile-nav-logo"><a href="/" class="linkNavLogo"><img src="https://admin.umt.edu.pk/Media/Site/sst1/FileManager/2025/June/unnamed.png" /></a></div>').insertAfter("#mobile-nav-toggle");
    
        if(jQuery('body').hasClass('admin-bar')){
			jQuery('#mobile-header-wrapper').css('top','41px');
		}
		
		jQuery('#mobile-nav-toggle').click(function(e){
				jQuery('#mobile-header-wrapper').addClass("mobileNavActive");
		});

		jQuery('.close-mobile-nav').click(function(){
				jQuery('#mobile-header-wrapper').removeClass("mobileNavActive");
        });
     $('.collapse').on('shown.bs.collapse', function () {
         $(this).parent().addClass('active-header');
     });

     $('.collapse').on('hidden.bs.collapse', function () {
         $(this).parent().removeClass('active-header');
     });
  
  

    
		
 });
$('.video-mix-slider').owlCarousel({

    loop: false,
    margin: 10,
    nav: true,
    dots: false,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    video: true,
    items: 1,
    lazyLoad: false,
    nav: true,
    responsive: {
        0: {
            items: 1,
           
        },
        600: {
            items: 1,
            
        },
        1000: {
            items: 1,
            
        },
        1200: {
            items: 1,
           
        }
      
       
    }
});
//video slider
$(".home-video-slider").owlCarousel({
    loop: false,
    autoplay: false,
    nav: true,
    dots: false,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    navContainer: '#arrow-her',
    margin: 10,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true,
            autoplay: true,
            margin: 10,
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: false
        },
        1280: {
            items: 3,
            nav: true,
            loop: false
        }
    }
})
//news slider
$(".home-news-slider").owlCarousel({
    loop: false,
    autoplay: false,
    nav: true,
    dots: false,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    navContainer: '#arrow-her2',
    margin: 10,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true,
            autoplay: true,
            margin: 10,
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: false
        },
        1280: {
            items: 3,
            nav: true,
            loop: false
        }
    }
})
$(".home-news-slider").owlCarousel({
    loop: false,
    autoplay: false,
    nav: true,
    dots: false,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    navContainer: '#arrow-her1',
    margin: 10,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: true,
            autoplay: true,
            margin: 10,
        },
        600: {
            items: 2,
            nav: true
        },
        1000: {
            items: 2,
            nav: true,
            loop: false
        },
        1280: {
            items: 3,
            nav: true,
            loop: false
        }
    }
})
$(".slider-fac").owlCarousel({
    loop:false,
	autoplay:false,
	nav:true,
    dots: false,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    margin: 30,
    navContainer: '#customNav',
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav: false,
            autoplay: true,
            margin:10,
        
           
        },
        600:{
            items: 2,
            nav: true
        },
        1000:{
            items:4,
            nav: true,
            loop: false
        }
    }
})

$(".news-slider").owlCarousel({
    loop: true,
    autoplay: true,
    nav: false,
    dots: false,
    margin: 10,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: false
        },
        600: {
            items: 2,
            nav: false
        },
        1000: {
            items: 2,
            nav: false,
            loop: true
        }
    }
})

 $(".ranking-boxs12").owlCarousel({
    loop:true,
	autoplay:false,
	nav:false,
	dots:true,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        600:{
            items:2,
            nav:false
        },
        1000:{
            items:5,
            nav:false,
            loop:true
        }
    }
})

 $(".numbers-slider").owlCarousel({
    loop:true,
	autoplay:true,
	nav:false,
	items:1,
	dots:true,
})
 $(".more-news-slider-box").owlCarousel({
    loop:true,
	autoplay:true,
	nav:false,
	dots:true,
	 items:3,
    margin:20,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:false
        },
        600:{
            items:2,
            nav:false
        },
        1000:{
            items:3,
            nav:false,
            loop:true
        }
    }
 })
$(".our-partners").owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    dots: false,
    items: 4,
    margin: 20,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: false
        },
        600: {
            items: 2,
            nav: false
        },
        1000: {
            items: 4,
            nav: true,
            loop: true
        }
    }
})
$(".slider-accmem").owlCarousel({
    loop: true,
    autoplay: true,
    nav: true,
    dots: false,
    items: 4,
    margin: 20,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: false
        },
        480: {
            items: 2,
            nav: false
        },
        600: {
            items: 2,
            nav: false
        },
        1000: {
            items: 4,
            nav: false,
            loop: true
        }
    }
})
$(".umt-numbers-slider").owlCarousel({
    loop: true,
    autoplay: true,
    center: true,
    nav: true,
    dots: false,
    items: 3,
    margin: 20,
    responsiveClass: true,
    responsive: {
        0: {
            items: 1,
            nav: false,
            autoplay: true,
        },
        600: {
            items: 2,
            center: false,
            nav: false
        },
        1000: {
            items: 3,
            nav: true,
            loop: true
        }
    }
})
    $(".video-boxes-slider").owlCarousel({
        loop: true,
        autoplay: true,
        nav: true,
        dots: false,
        items: 4,
        margin: 20,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2,
                center: false,
                nav: false
            },
            1000: {
                items: 4,
                nav: true,
                loop: true
            }
        }
    })
$('.video-btn').magnificPopup({
    type: 'iframe',
    iframe: {
        patterns: {
            youtube: {
                index: 'youtube.com/',
                id: function (url) {
                    var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                    if (!m || !m[1]) return null;
                    return m[1];
                },
                src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0'
            },
            vimeo: {
                index: 'vimeo.com/',
                id: function (url) {
                    var m = url.match(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                    if (!m || !m[5]) return null;
                    return m[5];
                },
                src: '//player.vimeo.com/video/%id%?autoplay=1'
            }
        }
    }
});
$('.play-button').magnificPopup({
    type: 'iframe',
    iframe: {
        patterns: {
            youtube: {
                index: 'youtube.com/',
                id: function (url) {
                    var m = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
                    if (!m || !m[1]) return null;
                    return m[1];
                },
                src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0'
            },
            vimeo: {
                index: 'vimeo.com/',
                id: function (url) {
                    var m = url.match(/(https?:\/\/)?(www.)?(player.)?vimeo.com\/([a-z]*\/)*([0-9]{6,11})[?]?.*/);
                    if (!m || !m[5]) return null;
                    return m[5];
                },
                src: '//player.vimeo.com/video/%id%?autoplay=1'
            }
        }
    }
});
//apply opacity to arrow
  jQuery(window).scroll( function(){

  //get scroll position
  var topWindow = jQuery(window).scrollTop();
  //multiply by 1.5 so the arrow will become transparent half-way up the page
  var topWindow = topWindow * 1.5;
  
  //get height of window
  var windowHeight = jQuery(window).height();
      
  //set position as percentage of how far the user has scrolled 
  var position = topWindow / windowHeight;
  //invert the percentage
  position = 1.75 - position;

  //define arrow opacity as based on how far up the page the user has scrolled
  //no scrolling = 1, half-way up the page = 0
  jQuery('.arrow-wrap').css('opacity', position);
  //hide arrow if halfway up page
  if ( position<0 ){
        jQuery('.arrow-wrap').hide();
  }
  else {
        jQuery('.arrow-wrap').show();
  }
});
$(function() {
  $('.section-down').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
  });
});
$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('#scroll').fadeIn();
    } else {
        $('#scroll').fadeOut();
    }
});
$('#scroll').click(function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
});


$(document).ready(function () {
    function loadDefaultPic(objImage) {
        $(objImage).attr('src', '//admin.umt.edu.pk/Media/UserProfile/unknown.jpg');
    }
});
function loadDefaultPic(objImage) {
    $(objImage).attr('src', '//admin.umt.edu.pk/Media/UserProfile/unknown.jpg');
}

function loadDefaultFeatureImage(objImage) {
    $(objImage).attr('src', 'https://admin.umt.edu.pk/Media/Site/UMT/FileManager/2020/newwebsite/Header.jpg');
}





