/**
 * Maak makkelijk ajax-calls
 *
 * Variables
 * private http_request
 *
 * Methods
 * public makeRequest (url, async, posthook)
 * public makePostRequest (url, parameter, async, posthook)
 * public static makeDelayedRequest (url, async, posthook, time)
 * public static makeDelayedPostRequest (url, parameter, async, posthook, time)
 */
function Ajax ()
{
	if (window.XMLHttpRequest) { // Mozilla, Opera, Safari, ...
		this.http_request = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE
		try {
			this.http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				this.http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}
	if (!this.http_request) {
		alert('Cannot create XMLHTTP instance, please upgrade your browser');
		return false;
	}

	this.makeRequest = function (url, async, posthook)
	{
		if (typeof(async) != "boolean") async = true;

		this.http_request.open('GET', url, async);
		if (async){
			this.http_request.onreadystatechange = 
				function ()
				{
					if (this.readyState == 4)
						posthook(this.responseText);
				}
			this.http_request.send();
		} else {
			this.http_request.send();
			return posthook(this.http_request.responseText);
		}

		if (Ajax.delayIsOn)
			Ajax.delayIsOn = false;
	}

	this.makePostRequest = function (url, parameter, async, posthook)
	{
		if (typeof(async) != "boolean") async = true;

		this.http_request.open('POST', url, async);
		this.http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

		if (async){
			this.http_request.onreadystatechange = 
				function ()
				{
					if (this.readyState == 4)
						posthook(this.responseText);
				}
			this.http_request.send(parameter);
		} else {
			this.http_request.send(parameter);
			return posthook(this.http_request.responseText);
		}

		if (Ajax.delayIsOn)
			Ajax.delayIsOn = false;
	}
}

Ajax.makeDelayedRequest = function (url, async, posthook, time)
{
	if (typeof(async) != "boolean") async = true;
	if (typeof(time) != "integer") time = 500;

	if (Ajax.delayIsOn)
		clearTimeout(Ajax.delayTimeOut);

	Ajax.delayTimeOut = setTimeout("var o = new Ajax(); o.makeRequest('"+url+"', "+async+", "+posthook+");", time);
	Ajax.delayIsOn = true;
}

Ajax.makeDelayedPostRequest = function (url, parameter, async, posthook, time)
{
	if (typeof(async) != "boolean") async = true;
	if (typeof(time) != "integer") time = 500;

	if (Ajax.delayIsOn)
		clearTimeout(Ajax.delayTimeOut);

	Ajax.delayTimeOut = setTimeout("var o = new Ajax(); o.makePostRequest('"+url+"', '"+parameter+"', "+async+", "+posthook+");", time);
	Ajax.delayIsOn = true;
}

Ajax.delayIsOn = false;
Ajax.delayTimeOut;
