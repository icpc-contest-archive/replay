$(document).ready(function() {
	change_spn=function(){
		var spn=$('#spn1').html();
		$('#spn1').html($('#spn2').html());
		$('#spn2').html(spn);
		setTimeout("change_spn()",60000);
	}
	setTimeout("change_spn()",60000);
});