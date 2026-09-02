var http_request = false;

//   Parameters:
// 1) URL
// 2) target div
// 3) true => async, false => sync (default true => 'async')
function makeRequest(url, targetdiv, async) {
	if (http_request != false){
		// Busy!
		return;
	}
	document.body.style.cursor = "wait";
	
	http_request = false;
	if (typeof(async) != "boolean") async = true;
		
	if (window.XMLHttpRequest) { // Mozilla, Opera, Safari, ...
		http_request = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE
		try {
			http_request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
	}

	if (!http_request) {
		alert('Cannot create XMLHTTP instance');
		return false;
	}
	
	http_request.open('GET', url, async);

	if (async){
		http_request.onreadystatechange = function(){ updateContents(targetdiv); }
		http_request.send(null);
	} else {
		http_request.send(null);
		updateContents(targetdiv);
	}
}

function updateContents(target){
	if (http_request.readyState == 4 && target != null){
		document.getElementById(target).innerHTML = http_request.responseText;
		http_request = false;
	}
	
	if (document.body.style.cursor == "wait") {
		document.body.style.cursor = "auto";
	}
}
	
function dummy(){}
