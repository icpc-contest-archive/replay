var QueryString = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));


function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}
function fn_SliderAnimate(desc) {
    $(desc).find('p').show();
    var intLength = $(desc).find('p').length;
    if (intLength == 1) {
        $(desc).find('p:first').each(function () {
            $(this).animate({ marginLeft: 0 }, '500', 'linear', function () {

            });
        });
    } else if (intLength == 2) {
        $(desc).find('p:first').each(function () {
            $(this).animate({ marginLeft: 0 }, '500', 'linear', function () {
                $(this).next().animate({ marginLeft: 0 }, '500', 'swing', function () { });
            });
        });
    } else if (intLength == 3) {
        $(desc).find('p:first').each(function () {
            $(this).animate({ marginLeft: 0 }, '500', 'linear', function () {
                $(this).next().animate({ marginLeft: 0 }, '500', 'swing', function () {
                    $(this).next().animate({ marginLeft: 0 }, '500', 'swing', function () { });
                });
            });
        });
    } else if (intLength == 4) {
        $(desc).find('p:first').each(function () {
            $(this).animate({ marginLeft: 0 }, '500', 'linear', function () {
                $(this).next().animate({ marginLeft: 0 }, '500', 'swing', function () {
                    $(this).next().animate({ marginLeft: 0 }, '500', 'swing', function () {
                        $(this).next().animate({ marginLeft: 0 }, '500', 'swing', function () { });
                    });
                });
            });
        });
    }
}
$(document).ready(function () {
    $('#pnlHeader').affix({
        offset: {
            top: $('.header').height() - 20
        }
    });
    $('.topbar-search i.fa-search').click(function () {
        if ($(this).parent().hasClass('topbar-search-open')) {
            $(this).parent().removeClass('topbar-search-open');
        } else {
            $(this).parent().addClass('topbar-search-open');
        }
    });
    $('.main-slider .slide').each(function () {
        var top = 0;
        $(this).find('div.desc p').each(function () {
            $(this).css('top', top);
            top += 40;
        });
    });
    $('.main-slider').slick({
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        onBeforeChange: function (slick, currentSlide, targetSlide) {
            var desc = $(slick.$slides.get(currentSlide)).find('div.desc');
            $(desc).find('p').animate({ marginLeft: -500 }, '500', 'swing', function () {

            });
            $(desc).find('p').hide();
        },
        onInit: function (slick) {
            var currentSlide = 0;
            var desc = $(slick.$slides.get(currentSlide)).find('div.desc');
            fn_SliderAnimate(desc);
            //$(desc).find('p').show();
            //$(desc).find('p').animate({ marginLeft: 0 }, '500', 'linear', function () { });
        },
        onAfterChange: function (slider, index) {
            var desc = $(slider.$slides.get(index)).find('div.desc');
            fn_SliderAnimate(desc);

            //$(desc).find('p:first').animate({ marginLeft: 0 }, { duration: 1000, step: function (now, fx) { $(desc).find('p:gt(0)').css("margin-left", now); } });

        }
    });
    $('.life-at-umt .row').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 3,
        arrows: true,
        prevArrow: '<i class="fa fa-angle-left"></i>',
        nextArrow: '<i class="fa fa-angle-right"></i>',
        appendArrows: $('.life-at-umt .header .container'),
        slidesToScroll: 1,
        responsive: [
          {
              breakpoint: 1024,
              settings: {
                  slidesToShow: 3
              }
          },
          {
              breakpoint: 946,
              settings: {
                  slidesToShow: 2
              }
          },
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1
              }
          }
        ]
    });
    $('.discover-umt .row').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        arrows: true,
        prevArrow: '<i class="fa fa-angle-left"></i>',
        nextArrow: '<i class="fa fa-angle-right"></i>',
        appendArrows: $('.discover-umt .header .container'),
        slidesToScroll: 1,
        responsive: [
          {
              breakpoint: 1024,
              settings: {
                  slidesToShow: 4
              }
          },
          {
              breakpoint: 946,
              settings: {
                  slidesToShow: 3
              }
          },
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1
              }
          }
        ]
    });
    $('.business .body').slick({
        infinite: false,
        speed: 300,
        slidesToShow: 4,
        arrows: true,
        prevArrow: '<i class="fa fa-angle-left"></i>',
        nextArrow: '<i class="fa fa-angle-right"></i>',
        appendArrows: $('.business h2 span.arrow'),
        slidesToScroll: 1,
        responsive: [
          {
              breakpoint: 1024,
              settings: {
                  slidesToShow: 4
              }
          },
          {
              breakpoint: 946,
              settings: {
                  slidesToShow: 3
              }
          },
          {
              breakpoint: 480,
              settings: {
                  slidesToShow: 1
              }
          }
        ]
    });
    $('#copy-right span i.fa').click(function () {
        $("html, body").animate({ scrollTop: 0 }, '300', 'swing', function () {

        });
    });
    $('.scroller .items').each(function () {
        $(this).enscroll({
            verticalScrolling: false,
            horizontalTrackClass: 'horizontal-track',
            horizontalHandleClass: 'horizontal-handle fa fa-bars',
            horizontalScrolling: true,
            cornerClass: 'corner2',
            pollChanges: true,
            easingDuration: 100
        });
        $(this).parent().find('.horizontal-track').parent().addClass('enscroll');
    });
    $(".prettyphoto").each(function () {
        $(this).find("a[rel^='prettyPhoto']").prettyPhoto();
    });
});

function formValidation(strClass) {
    try {
        if (strClass == undefined || strClass == '')
            strClass = 'form-validate';
        var aryControls = new Array();
        $("." + strClass + " input").each(function () {
            if ($(this).attr("validate") != undefined)
                aryControls.push($(this).attr('id'));
        });
        $("." + strClass + " select").each(function () {
            if ($(this).attr("validate") != undefined)
                aryControls.push($(this).attr('id'));
        });
        $("." + strClass + " textarea").each(function () {
            if ($(this).attr("validate") != undefined)
                aryControls.push($(this).attr('id'));
        });
        var blnIsValid = validateControls(aryControls);
        if (blnIsValid) {
            $("." + strClass).append('<input type="hidden" id="' + strClass + '_hidden" name="' + strClass + '_hidden" value="1"/>');
        }
        return blnIsValid;
    } catch (ex) {
        alert('');
    }
}
function setFormValues() {
    $(".form select").each(function () {
        var strValue = $(this).attr("text");
        $(this).val(strValue).attr('selected', true);
    });
}
$(document).ready(function () {
    $(".short-info1 img").each(function () {
        $(this).error(function () {
            $(this).attr('src', '//admin.umt.edu.pk/Media/UserProfile/unknown.jpg');
        });
    });
});
function loadDefaultPic(objImage) {
    $(objImage).attr('src', '//admin.umt.edu.pk/Media/UserProfile/unknown.jpg');
}