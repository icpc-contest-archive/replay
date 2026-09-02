var form_defaultFormDatetimeVerzameling_data = new Array();
var form_defaultFormDatetimeVerzameling_geselecteerd = new Array();

function Form_defaultFormDatetimeVerzameling_enkel (form)
{
	var parameter = 'str=' + escape(form.elements[0].value) + ' ' + escape(form.elements[1].value);

	var container = document.getElementById('popup_content');
	container.innerHTML = 'Laden / Loading';
	
	Ajax.makeDelayedPostRequest('/Ajax/Form/defaultFormDatetimeVerzameling/Enkel', parameter, true,
		function (html)
		{
			eval(html);
		});
}

function Form_defaultFormDatetimeVerzameling_herhalend (form)
{
	var ajax = new Ajax();
	var parameter = 'DatetimeVerzameling[vanaf]=' + escape(form.elements['DatetimeVerzameling[Herhalend][vanaf]'].value) + '&'
				  + 'DatetimeVerzameling[tot]=' + escape(form.elements['DatetimeVerzameling[Herhalend][tot]'].value) + '&'
				  + 'DatetimeVerzameling[tijd]=' + escape(form.elements['DatetimeVerzameling[Herhalend][tijd]'].value) + '&'
				  + 'DatetimeVerzameling[numweek]=' + escape(form.elements['DatetimeVerzameling[Herhalend][numweek]'].value) + '&'
				  + 'DatetimeVerzameling[ma]=' + escape(form.elements['DatetimeVerzameling[Herhalend][ma]'][1].checked) + '&'
				  + 'DatetimeVerzameling[di]=' + escape(form.elements['DatetimeVerzameling[Herhalend][di]'][1].checked) + '&'
				  + 'DatetimeVerzameling[wo]=' + escape(form.elements['DatetimeVerzameling[Herhalend][wo]'][1].checked) + '&'
				  + 'DatetimeVerzameling[do]=' + escape(form.elements['DatetimeVerzameling[Herhalend][do]'][1].checked) + '&'
				  + 'DatetimeVerzameling[vr]=' + escape(form.elements['DatetimeVerzameling[Herhalend][vr]'][1].checked) + '&'
				  + 'DatetimeVerzameling[za]=' + escape(form.elements['DatetimeVerzameling[Herhalend][za]'][1].checked) + '&'
				  + 'DatetimeVerzameling[zo]=' + escape(form.elements['DatetimeVerzameling[Herhalend][zo]'][1].checked);

	var container = document.getElementById('popup_content');
	container.innerHTML = 'Laden / Loading';

	ajax.makePostRequest('/Ajax/Form/defaultFormDatetimeVerzameling/Herhalend', parameter, true,
		function (html)
		{
			eval(html);
		});
}

function Form_defaultFormDatetimeVerzameling_verander (elem)
{
	var regex = /[a-z_]+(?:\[Lid\])?\[([0-9]{1,5})\]/i
	var id = regex.exec(elem.name)[1];

	if (elem.checked == true)
		form_defaultFormDatetimeVerzameling_geselecteerd.push(id);
	else
		for (var x in form_defaultFormDatetimeVerzameling_geselecteerd)
			if (form_defaultFormDatetimeVerzameling_geselecteerd[x] == id)
				form_defaultFormDatetimeVerzameling_geselecteerd.splice(x, 1);
}

function Form_defaultFormDatetimeVerzameling_vernieuw ()
{
	var regex = /[a-z_]+\[([0-9]{1,5})\]/i
	var form = document.getElementById('Form_defaultFormDatetimeVerzameling_select_lijst')
	var elems = form.getElementsByTagName('input');

	for (var x in form_defaultFormDatetimeVerzameling_data)
	{
		var id = form_defaultFormDatetimeVerzameling_data[x];
		var elem = null;
		for (var i in elems)
			if (elems[i].type == 'checkbox' && elems[i].name == 'DatetimeVerzameling['+id+']')
				var elem = elems[i];
		if (elem == null)
			continue;
		elem.checked = false;
		for (var y in form_defaultFormDatetimeVerzameling_geselecteerd)
			if (form_defaultFormDatetimeVerzameling_geselecteerd[y] == id)
				elem.checked = true;
	}
}

function Form_defaultFormDatetimeVerzameling_voegtoe (id, label, selected)
{
	for (var x in form_defaultFormDatetimeVerzameling_data)
		if (form_defaultFormDatetimeVerzameling_data[x] == id)
			return;
	
	form_defaultFormDatetimeVerzameling_data.push(id);

	var lijst  = document.getElementById('Form_defaultFormDatetimeVerzameling_select_lijst');
	if (lijst == null)
	{
		var select = document.getElementById('Form_defaultFormDatetimeVerzameling_select');
		select.innerHTML = "<ul id='Form_defaultFormDatetimeVerzameling_select_lijst'></ul>";
		var lijst  = document.getElementById('Form_defaultFormDatetimeVerzameling_select_lijst');
	}

	var li = document.createElement('li');
	if (selected)
	{
		li.innerHTML = '<input type="hidden" value="0" name="DatetimeVerzameling['+id+']">'
					 + '<input type="checkbox" name="DatetimeVerzameling['+id+']" onchange="Form_defaultFormDatetimeVerzameling_verander(this)" checked>'
					 + '<span>'+label+'</span>';
		form_defaultFormDatetimeVerzameling_geselecteerd.push(id);
	}
	else
	{
		li.innerHTML = '<input type="hidden" value="0" name="DatetimeVerzameling['+id+']">'
					 + '<input type="checkbox" name="DatetimeVerzameling['+id+']" onchange="Form_defaultFormDatetimeVerzameling_verander(this)">'
					 + '<span>'+label+'</span>';
	}

	lijst.appendChild(li);
}

var form_defaultFormPersoonVerzameling_leden = new Array();
var form_defaultFormPersoonVerzameling_geselecteerd = new Array();

function Form_defaultFormPersoonVerzameling_setInvoer (str, search)
{
	document.forms['LidVerzameling'].elements['LidVerzamelingZoeken'].value = str;
	if (search)
		Form_defaultFormPersoonVerzameling_zoek(true);
}

function Form_defaultFormPersoonVerzameling_selecteer ()
{
	var form = document.getElementById('Form_defaultFormPersoonVerzameling_select_lijst')
	if (form == null)
		return;
	var boxes = form.getElementsByTagName('input');
	for (var i = 0; i < boxes.length; i++)
		if (boxes[i].type == 'checkbox')
			boxes[i].checked = true;
	form_defaultFormPersoonVerzameling_geselecteerd = form_defaultFormPersoonVerzameling_leden;
}

function Form_defaultFormPersoonVerzameling_deselecteer ()
{
	var form = document.getElementById('Form_defaultFormPersoonVerzameling_select_lijst')
	if (form == null)
		return;
	var boxes = form.getElementsByTagName('input');
	for (var i = 0; i < boxes.length; i++)
		if (boxes[i].type == 'checkbox')
			boxes[i].checked = false;
	form_defaultFormPersoonVerzameling_geselecteerd = new Array();
}

function Form_defaultFormPersoonVerzameling_zoek (clr)
{
	var str = document.forms['LidVerzameling'].elements['LidVerzamelingZoeken'].value;
	str.replace(/^\s+|\s+$/g,"");
	
	var container = document.getElementById('Form_defaultFormPersoonVerzameling_container');
	if (clr)
		container.innerHTML = 'Laden / Loading';

	if (str.length < 3)
	{
		container.innerHTML = 'Vul een zoekterm in / Enter a search term';
		return;
	}

	Ajax.makeDelayedPostRequest('/Ajax/Form/defaultFormPersoonVerzameling/Zoek', 'str=' + escape(str) + '&sel=' + form_defaultFormPersoonVerzameling_geselecteerd.join(','), true,
		function (html)
		{
			var container = document.getElementById('Form_defaultFormPersoonVerzameling_container');
			container.innerHTML = html;
		});
}

function Form_defaultFormPersoonVerzameling_invoer (form)
{
	var ajax = new Ajax();
	var parameter = 'str=' + escape(form.elements['LidVerzamelingInvoer'].value);
	
	var container = document.getElementById('popup_content');
	container.innerHTML = 'Laden / Loading';

	ajax.makePostRequest('/Ajax/Form/defaultFormPersoonVerzameling/Invoer', parameter, true,
		function (html)
		{
			eval(html);
		});
}

function Form_defaultFormPersoonVerzameling_verander (elem)
{
	var regex = /[a-z_]+(?:\[Lid\])?\[([0-9]{1,5})\]/i
	var id = regex.exec(elem.name)[1];

	if (elem.checked == true)
		form_defaultFormPersoonVerzameling_geselecteerd.push(id);
	else
		for (var x in form_defaultFormPersoonVerzameling_geselecteerd)
			if (form_defaultFormPersoonVerzameling_geselecteerd[x] == id)
				form_defaultFormPersoonVerzameling_geselecteerd.splice(x, 1);
}

function Form_defaultFormPersoonVerzameling_vernieuw ()
{
	var regex = /[a-z_]+\[([0-9]{1,5})\]/i
	var form = document.getElementById('Form_defaultFormPersoonVerzameling_select_lijst')
	var elems = form.getElementsByTagName('input');

	for (var x in form_defaultFormPersoonVerzameling_leden)
	{
		var id = form_defaultFormPersoonVerzameling_leden[x];
		var elem = null;
		for (var i in elems)
			if (elems[i].type == 'checkbox' && elems[i].name == 'LidVerzameling[Lid]['+id+']')
				var elem = elems[i];
		if (elem == null)
			continue;
		elem.checked = false;
		for (var y in form_defaultFormPersoonVerzameling_geselecteerd)
			if (form_defaultFormPersoonVerzameling_geselecteerd[y] == id)
				elem.checked = true;
	}
}

function Form_defaultFormPersoonVerzameling_voegtoe (id, naam, selected)
{
	for (var x in form_defaultFormPersoonVerzameling_leden)
		if (form_defaultFormPersoonVerzameling_leden[x] == id)
			return;
	
	form_defaultFormPersoonVerzameling_leden.push(id);

	var lijst  = document.getElementById('Form_defaultFormPersoonVerzameling_select_lijst');
	if (lijst == null)
	{
		var select = document.getElementById('Form_defaultFormPersoonVerzameling_select');
		select.innerHTML = "<ul id='Form_defaultFormPersoonVerzameling_select_lijst'></ul>";
		var lijst  = document.getElementById('Form_defaultFormPersoonVerzameling_select_lijst');
	}

	var li = document.createElement('li');
	if (selected)
	{
		li.innerHTML = '<input type="hidden" value="0" name="LidVerzameling[Lid]['+id+']"><label>'
					 + '<input type="checkbox" name="LidVerzameling[Lid]['+id+']" onchange="Form_defaultFormPersoonVerzameling_verander(this)" checked>'
					 + '<span>'+naam+'</span></label>';
		form_defaultFormPersoonVerzameling_geselecteerd.push(id);
	}
	else
	{
		li.innerHTML = '<input type="hidden" value="0" name="LidVerzameling[Lid]['+id+']"><label>'
					 + '<input type="checkbox" name="LidVerzameling[Lid]['+id+']" onchange="Form_defaultFormPersoonVerzameling_verander(this)">'
					 + '<span>'+naam+'</span></label>';
	}

	lijst.appendChild(li);

	var extra = document.getElementById('Form_defaultFormPersoonVerzameling_select_extra');
	extra.setAttribute('class', '');
}
