$(document).ready(function() 
{
	   $("#zoekform input[type='button']").click(function() 
	   {
			$("#zoekresultaten").html('<img src="/Layout/Images/Icons/busy.gif" alt="Loading results"> Even laden .. Dit kan even duren!');
			$.get("/Ajax/Form/UitgebreidZoeken/formUitgebreidZoekenPersonen?"+$("form").serialize(), function(data) {
				$("#zoekresultaten").html(data);	
				});
			});
	   });

	function nextPage(data)
	{
		$('<input>').attr({
			    type: 'hidden',
				id: 'offset',
				name: 'offset',
				value: data
		}).appendTo('form');

		$("#zoekresultaten").html('<img src="/Layout/Images/Icons/busy.gif" alt="Loading results"> Even laden .. Dit kan even duren!');
		$.get("/Ajax/Form/UitgebreidZoeken/formUitgebreidZoekenPersonen?"+$("form").serialize(), function(data) {
			$("#zoekresultaten").html(data);	
			});

}

function clickOpPopup(e)
{
	//Stop event propagation als er op de popup geklikt wordt, want dan wordt de background click niet getriggerd
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}
