function Html_ShowPopup ()
{
	var elem = document.getElementById('popup');
	elem.style.display = 'inline';
}

function Html_HidePopup ()
{
	var elem = document.getElementById('popup');
	elem.style.display = 'none';
}

function Html_LinkPopup (url, callback)
{
	Html_ShowPopup();

	var container = document.getElementById('popup_content');
	container.innerHTML = 'Laden / Loading';

	var ajax = new Ajax();
	ajax.makeRequest(url, true,
		function (html)
		{
			var container = document.getElementById('popup_content');
			container.innerHTML = html;
			if(typeof callback != "undefined")
				callback();
		});
}

function Html_LinkPostPopup (url, parameter)
{
	Html_ShowPopup();

	var container = document.getElementById('popup_content');
	container.innerHTML = 'Laden / Loading';

	var ajax = new Ajax();
	ajax.makePostRequest(url, parameter, true,
		function (html)
		{
			var container = document.getElementById('popup_content');
			container.innerHTML = html;
		});
}

function Html_HtmlHideableDiv (id, caption1, caption2)
{
	div = document.getElementById(id);
	cap = document.getElementById(id + '_caption');

	var link = '<a href="#" onclick="Html_HtmlHideableDiv(\''+id+'\', \''+caption1+'\', \''+caption2+'\')">';

	if (div.style.display == 'none')
	{
		div.style.display = 'inline';
		cap.innerHTML = link + caption2 + '</a>';
	}
	else
	{
		div.style.display = 'none';
		cap.innerHTML = link + caption1 + '</a>';
	}
}
