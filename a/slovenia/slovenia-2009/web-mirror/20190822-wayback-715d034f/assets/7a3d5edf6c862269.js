Drupal.locale = { 'pluralFormula': function ($n) { return Number(((($n%100)==1)?(0):((($n%100)==2)?(1):(((($n%100)==3)||(($n%100)==4))?(2):3)))); }, 'strings': {"":{"Next":"Naslednja","Disabled":"Onemogo\u010deno","Enabled":"Omogo\u010deno","none":"ni\u010d","Done":"Opravljeno","Sunday":"nedelja","Thursday":"\u010detrtek","Friday":"petek","Saturday":"sobota","Add":"Dodaj","Tuesday":"torek","Monday":"ponedeljek","Prev":"Prej","OK":"OK","Mon":"Pon","Tue":"Tor","Wed":"Sre","Thu":"\u010cet","Fri":"Pet","Sat":"Sob","Sun":"Ned","January":"januar","February":"februar","March":"marec","April":"april","May":"Maj","June":"Junij","August":"avgust","September":"september","October":"oktober","November":"november","December":"december","Show":"Prika\u017ei","Select all rows in this table":"Ozna\u010di vse vrstice v tej tabeli","Deselect all rows in this table":"Odzna\u010di vse vrstice v tej tabeli","Today":"Danes","Jan":"Jan","Feb":"Feb","Mar":"Mar","Apr":"Apr","Jun":"Jun","Jul":"Jul","Aug":"Aug","Sep":"Sep","Oct":"Okt","Nov":"Nov","Dec":"Dec","Su":"ned","Mo":"pon","Tu":"tor","We":"sre","Th":"\u010det","Fr":"pet","Sa":"sob","Please wait...":"Prosimo po\u010dakajte...","Not published":"Ni objavljeno","Hide":"Skrij","Loading":"Nalagam","mm\/dd\/yy":"mm\/dd\/yy","Drag to re-order":"Preuredi z vle\u010denjem","Changes made in this table will not be saved until the form is submitted.":"Spremembe narejene v tej tabeli ne bodo shranjenem dokler ne shranite obrazca.","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"Spremembe na blokih ne bodo shranjene, dokler ne kliknete\u003Cem\u003EShrani bloke\u003C\/em\u003E","Wednesday":"sreda","Configure":"Nastavi","Submit":"Po\u0161lji","Cancel":"Prekli\u010di","Title":"Naslov","Edit":"Uredi","July":"julij"}} };;
/**
 * @file
 * Colorbox module init js.
 */

(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox) || typeof settings.colorbox === 'undefined') {
      return;
    }

    if (settings.colorbox.mobiledetect && window.matchMedia) {
      // Disable Colorbox for small screens.
      var mq = window.matchMedia("(max-device-width: " + settings.colorbox.mobiledevicewidth + ")");
      if (mq.matches) {
        return;
      }
    }

    // Use "data-colorbox-gallery" if set otherwise use "rel".
    settings.colorbox.rel = function () {
      if ($(this).data('colorbox-gallery')) {
        return $(this).data('colorbox-gallery');
      }
      else {
        return $(this).attr('rel');
      }
    };

    $('.colorbox', context)
      .once('init-colorbox')
      .colorbox(settings.colorbox);

    $(context).bind('cbox_complete', function () {
      Drupal.attachBehaviors('#cboxLoadedContent');
    });
  }
};

})(jQuery);
;
/**
 * @file
 * Colorbox module style js.
 */

(function ($) {

Drupal.behaviors.initColorboxDefaultStyle = {
  attach: function (context, settings) {
    $(context).bind('cbox_complete', function () {
      // Only run if there is a title.
      if ($('#cboxTitle:empty', context).length == false) {
        $('#cboxLoadedContent img', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideDown();
        });
        $('#cboxOverlay', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideUp();
        });
      }
      else {
        $('#cboxTitle', context).hide();
      }
    });
  }
};

})(jQuery);
;
