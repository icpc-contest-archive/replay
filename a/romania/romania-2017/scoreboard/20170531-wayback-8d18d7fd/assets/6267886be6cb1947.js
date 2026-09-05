function Page_Init(){var flash=$('#flash');if(flash.length&&!flash.hasClass('flashError')){var callback=function(){flash.hide();}
setTimeout(callback,13000);}
var log=$('#log');if(log.length){log.scrollTop(log.prop('scrollHeight')- log.height());var callback=function(event){log.height(log.prop('scrollHeight'));log.prop('id','log_active');}
log.one('click',callback);}}
$(document).ready(Page_Init);