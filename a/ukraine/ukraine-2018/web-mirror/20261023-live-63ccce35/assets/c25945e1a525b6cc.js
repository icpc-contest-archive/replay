function test_cookie() {
    document.cookie = 'jsync_cookie=1';
    return document.cookie.indexOf('jsync_cookie') != -1;
}

function set_gdpr_cookie() {
    var expireIn = parseInt(30 + "", 10) * 60 * 1000 * 60 * 24;
    var now = new Date(),
        cookieExpire = new Date();
    cookieExpire.setTime(now.getTime() + expireIn);
    document.cookie = "gdpr_cookie=1; expires=" + cookieExpire.toUTCString() + "; path=/;";
    }

function set_cookies_accept() {
    document.getElementById('gdpr-banner').style.display = 'none';
    set_gdpr_cookie();
}

function get_gdpr_cookie() {
    return document.cookie.indexOf('gdpr_cookie') != -1;
}

function get_current_locale() {
    return document.getElementById('d8_lang_id').value;
}

function jump_top() {
    jQuery('html, body').animate({ scrollTop: 0 }, 'fast');
}

function search_toggle() {
    if(jQuery(document).width() > 768){
        if(document.getElementById('vntu_breadcrumbs') == null) {
            jQuery("#vntu-search-zone").fadeToggle(200);
        } else {
            jQuery(".breadcrumbs-container").toggle();
            jQuery("#vntu-search-zone").toggle();
        }
    } else {
        window.location.href = '/search';
    }
    
}

function load_comments() {
    if(document.getElementById('vntu-jsload-comments')) {
        jQuery(document).ready(function($){
            $.getScript( "/sites/contrib/ininv/alumni-comments.js", function( data, textStatus, jqxhr ) {
                vntu_loadcomments();
            });
        });
    }
}

jQuery(document).ready(function($){
    $('.banner-slider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        lazyLoad: 'progressive',
        speed: 300,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        respondTo: 'min'
    });

    load_comments();

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-87367848-2', 'vntu.edu.ua');
    ga('send', 'pageview');

    if(get_current_locale() != "uk") {
        if(test_cookie() && get_gdpr_cookie() == false) {
            document.getElementById('gdpr-banner').style.display = 'block';
        }
    }
});

