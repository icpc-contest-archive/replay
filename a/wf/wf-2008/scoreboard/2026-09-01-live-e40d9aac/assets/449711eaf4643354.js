function el(elm) {return document.getElementById(elm)}
function show(elm) {if (el(elm)) el(elm).style.display = 'block'}
function hide(elm) {if (el(elm)) el(elm).style.display = 'none'}
function toggle(elm) {if (el(elm)) el(elm).style.display = el(elm).style.display == 'block' ? 'none' : 'block'}
function setClass(elm, name)   {if (el(elm)) el(elm).className = name}
function setContent(elm, text) {if (el(elm)) el(elm).innerHTML = text}
function addContent(elm, text) {if (el(elm)) el(elm).innerHTML += text}
function nl2br(text) {return text.replace(/\n/g, "<br />");}

// ########################
// #### ajax functions ####
// ########################

var _data_handlers = {};
var _data_urls = {};
var _data_count = 0;
var _data_sid = Math.round(Math.random() * 9000) + 1000;
var _data_timeout = 15000;

function exec_script(href, id, postvars)
{
	var req;
	var postdata = '';
	if (postvars)
	{
		for (var i in postvars)
		{
			postdata += encodeURIComponent(i);
			postdata += '=';
			postdata += encodeURIComponent(postvars[i]);
			postdata += '&';
		}
	}
	postdata += 'js_id=' + id;
	if (session_id)
	{
		postdata += '&sid=' + encodeURIComponent(session_id);
	}
	if (window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
		req.onreadystatechange = function(){_processonchange(id)};
		req.open("post", href, true);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(postdata);
	}
	else if (window.ActiveXObject && (req = new ActiveXObject("Microsoft.XMLHTTP")))
	{
		req.onreadystatechange = function(){_processonchange(id)};
		req.open("post", href, true);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(postdata);
	}
	else
	{
		href += (href.indexOf('?') == -1 ? '?' : '&') + postdata;
		var span = null;
		span = document.body.appendChild(document.createElement('SPAN'));
		span.style.display = 'none';
		span.innerHTML = '.<s'+'cript></' + 'script>';
		setTimeout(function() {
			var s = span.getElementsByTagName("script")[0];
			s.language = "JavaScript";
			if (s.setAttribute) s.setAttribute('src', href); else s.src = href;
		}, 10);
	}

	setTimeout(function() {
		if (!_data_handlers[id])
		{
			return;
		}
		var req = _data_handlers[id].req;
		var foo = _data_handlers[id].handler;
		_release_id(id);
		req.abort();
		foo();
	}, _data_timeout);

	return req;
}

function _processonchange(id)
{
	if (!_data_handlers[id])
	{
		return;
	}
	var req = _data_handlers[id].req;
	var foo = _data_handlers[id].handler;
	if (req.readyState == 4)
	{
		if (req.status == 200 && req.responseText.substring(0, 13) == '_return_data(')
		{
			eval(req.responseText);
		}
		else
		{
			_release_id(id);
			foo();
		}
	}
}

function load_data(href, handler, allow_dupe, postvars)
{
	if (!allow_dupe && _data_urls[href])
	{
		return false;
	}
	var id = _data_sid + _data_count++;
	_data_urls[href] = id;

	var req = exec_script(href, id, postvars);
	_data_handlers[id] =
	{
		handler: handler,
		url: href,
		req: req
	};
	
}

function _release_id(id)
{
	delete _data_urls[_data_handlers[id].url];
	delete _data_handlers[id];
}

function _return_data(id, data)
{
	if (!_data_handlers[id])
	{
		return;
	}
	var foo = _data_handlers[id].handler;
	if (foo)
	{
		_release_id(id);
		foo(data);
	}
}

// #################
// #### cookies ####
// #################

function setcookie(name, value, days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function getcookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function unsetcookie(name)
{
	setcookie(name, "", -1);
}

// #####################
// #### other stuff ####
// #####################

function padZeros(a, width)
{
	var l = width - a.toString().length;
	for (; l > 0; l--)
	{
		a = '0' + a;
	}
	return a;
}

function formatDate(s, d)
{
	if (typeof(d) == 'undefined')
	{
		d = new Date();
	}
	if (typeof d != 'object')
	{
		d = new Date(d);
	}
	s = s.replace('Y', d.getFullYear());
	s = s.replace('m', padZeros(d.getMonth() + 1, 2));
	s = s.replace('d', padZeros(d.getDate(), 2));
	s = s.replace('H', padZeros(d.getHours(), 2));
	s = s.replace('i', padZeros(d.getMinutes(), 2));
	s = s.replace('s', padZeros(d.getSeconds(), 2));
	return s;
}
