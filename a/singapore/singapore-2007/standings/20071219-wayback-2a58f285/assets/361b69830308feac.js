function showChildNodes(elmParent) {
	var arrChildren = elmParent.getElementsByTagName("ul");
	var elmChildMenu = arrChildren[0];
	strChildDisplay = elmChildMenu.style.display;
	//Change CSS
	var strCurrentClass = elmParent.className;
	var strNewClass;
	switch(strCurrentClass) {
		case "expandable":
			strNewClass = "expanded";
			break;
		case "expanded":
			strNewClass = "expandable";
			break;
		//First in list
		case "expandablefirst":
			strNewClass = "expandedfirst";
			break;
		case "expandedfirst":
			strNewClass = "expandablefirst";
			break;
		//Last in list
		case "expandablelast":
			strNewClass = "expandedlast";
			break;
		case "expandedlast":
			strNewClass = "expandablelast";
			break;
	}
	if (!blnDoNotClose) {
		elmParent.className = strNewClass;
		//Change display property
		if (strChildDisplay == "none" || strChildDisplay == "") elmChildMenu.style.display = "block";
		else elmChildMenu.style.display = "none";
	}
}

var blnDoNotClose = false;
function goToURL(strURL) {
	blnDoNotClose = true;
	document.location.href = strURL;
}
