var popProfiles = {
    windowCenter: {
        width:720,
        height:400,
        center:1,
        createnew:0
    }
};

(function() {
    var beforePrint = function() {
        console.log('Functionality to run before printing.');
    };
    var afterPrint = function() {
        console.log('Functionality to run after printing');
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
}());

$(function() {
    var slideout = new Slideout({
        'panel': document.getElementById('TobbPagePanel'),
        'menu': document.getElementById('TobbSideMenu'),
        'padding': 256,
        'tolerance': 70,
        'side': 'right',
        'touch': false
    });
    $('.yardimPhoto').magnificPopup({type:'image'});
    document.querySelector('.showMobileMenu').addEventListener('click', function() {
        slideout.toggle();
    });
    $(".popWindow").popupwindow(popProfiles);
    $('table').stacktable();
    enquire.register("all and (max-width:1023px)", {
        match : function() {
            var footerLink = $('.tobbFooter .footerLinksToggle');
            var footerContent = $('.tobbFooter .tobbFooter__List');
            footerLink.click(function() {
                footerLink.removeClass('active');
                footerContent.removeClass('open');
                if($(this).next("div").is(":visible")){
                    $(this).next("div").slideUp(300).removeClass('open');
                    $(this).removeClass('active');
                } else {
                    footerContent.slideUp(300);
                    $(this).next("div").slideToggle(300).addClass('open');
                    $(this).addClass('active');
                }
            });
        },
        unmatch : function() {
            $('.tobbFooter .footerLinksToggle').removeClass('active');
            $('.tobbFooter .tobbFooter__List').removeClass('open');
        }
    }, true);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

