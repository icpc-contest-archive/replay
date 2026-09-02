var hiddenStyle = 'none';
var showStyle   = 'inline';

function showTags(tagname, classname) {
	showHideTags(tagname, classname, showStyle);
}

function hideTags(tagname, classname) {
	showHideTags(tagname, classname, hiddenStyle);
}

function showHideTags(tagname, classname, display) {
	for (i = 0; i < document.getElementsByTagName(tagname).length; i++) {
		currelem = document.getElementsByTagName(tagname).item(i);

		if (hasClassName(currelem, classname)){
			currelem.style.display = display;
		}
	}
}

function toggleTags(tagname, classname) {
	for (i = 0; i < document.getElementsByTagName(tagname).length; i++) {
		currelem = document.getElementsByTagName(tagname).item(i);

		if (hasClassName(currelem, classname)){
			if (currelem.style.display == showStyle) {
				hideTags(tagname, classname);
			} else {
				showTags(tagname, classname);
			}

			return;
		}
	}
}

function hasClassName(elem, name){
	var re = new RegExp("(^| )" + name + "( |$)");
	if(re.test(elem.className)){
		return true;
	}
	return false;
}

function formButton(idname, event)
{
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (event) keycode = event.which;
	else return true;
	
	if (keycode == 13)
	{
		document.getElementById(idname).click();
		return false;
	}
	return true;
}

function trim(text){
	return text.replace(/^\s+|\s+$/g,"");
}
