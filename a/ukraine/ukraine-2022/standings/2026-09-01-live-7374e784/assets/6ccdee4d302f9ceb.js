var a_zoom = 0;

jQuery(document).ready(function($){
    var resize = new Array('p', '.resizable', '#right-sidebar');
    resize = resize.join(',');
    
    $('.banner-slider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        lazyLoad: 'progressive',
        speed: 300,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        respondTo: 'min',
    });

    function zoomify( t_zoom, update = true ) {
        t_zoom += a_zoom;
        if(t_zoom > 3 || t_zoom < -3)
            return;
        
        $(resize).css('font-size', 16 + t_zoom);
        a_zoom = t_zoom;
        
        console.log(a_zoom, update);
        if(update)
            $.cookie("accessibility_zoom", a_zoom, { expires : 365, path: "/;SameSite=Lax" });
    }

    $(function() {
        $(".widget_media_image > a").attr("target","_blank");
        var t_zoom = parseInt($.cookie("accessibility_zoom"));
        if(isNaN(t_zoom))
            return;
        if(t_zoom > 3 || t_zoom == 0 || t_zoom < -3)
            return;
        
        a_zoom = t_zoom;
        zoomify(0, false);
    });
    
    $("#fontsize_down").click(function() {
        zoomify(-1);
        return false;
    });
    
    $("#fontsize_up").click(function() {
        zoomify(1);
        return false;
    });

    $('.menu-item-has-children > a').on('click', function(event){
        if ($(this).parents('.navbar-ua').length != 0) {
            return;
        }
        $(this).parent().find(".sub-menu").eq(0).toggleClass('sub-menu-active');
        return false;
    });
});


