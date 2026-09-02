$.datepicker.setDefaults($.datepicker.regional["nl"]);
jQueryInitDatePicker = function()
{
	$('.date').datepicker({dateFormat:'yy-mm-dd'});
}
$(document).ready( 
	function() {jQueryInitDatePicker()} 
)

function nietBubbelen(event)
{
	if (!event) var event = window.event;
	event.stopPropagation();
}

//JQuery
/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* Written by Mathias Bynens <http://mathiasbynens.be/> */
jQuery(function($){
        $.datepicker.regional.nl = {
                closeText: 'Sluiten',
                prevText: '←',
                nextText: '→',
                currentText: 'Vandaag',
                monthNames: ['januari', 'februari', 'maart', 'april', 'mei', 'juni',
                'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
                monthNamesShort: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun',
                'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
                dayNames: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
                dayNamesShort: ['zon', 'maa', 'din', 'woe', 'don', 'vri', 'zat'],
                dayNamesMin: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
                weekHeader: 'Wk',
                dateFormat: 'dd-mm-yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''};
        $.datepicker.setDefaults($.datepicker.regional.nl);
});

function openFeedbackFormuliertje(mood)
{
	if($("#feedbackDialog").dialog("isOpen"))
		$( "#feedbackDialog" ).dialog( "close" );
	else
	{
		$("#feedback_dank").hide();
		$("#feedbackDialogForm").show();
		$("#feedbackDialogForm")[0].reset();
		$( "#feedbackDialog" ).dialog( "open" );
	}
	if(mood == 'pos')
	{
		$( "#feedback_mood" ).text("positieve");
		$( "#feedbackDialogForm [name=onderwerp]" ).val('Positieve feedback gemeld');
	}
	else
	{
		$( "#feedback_mood" ).text("negatieve");
		$( "#feedbackDialogForm [name=onderwerp]" ).val('Negatieve feedback gemeld');
	}
	$("#feedbackDialogForm [name=URL]").val(location.href);
	$("#feedbackDialogForm").submit(function()
	{
		if($("#feedbackDialogForm [name=cie]").val() == 'bugs'){
			$('#feedbackDialogForm').attr('action', '/Service/Bugs/NieuwFromForm');
		} else { 
			$('#feedbackDialogForm').attr('action', '/mailto.php/' + $("#feedbackDialogForm [name=cie]").val());
		}
		$("#feedbackDialogForm").hide();
		$("#feedback_dank").show();
	});
	return false;
}
