var changed = false;
var num = 0;
var nb_show_alt="Show";
var nb_hide_alt="Hide";

function selectall(checkbox) {
 var form = checkbox.form;
 var bol = checkbox.checked;
 for (var i=1;i<form.elements.length;i++)  {
    if ( form.elements.item(i).type == "checkbox" )  {
      if (!bol) num--; else num++;
      form.elements.item(i).checked=bol;
    }
  }
}


function clic(checkbox)  {
  if (checkbox.checked)  {
    num++;
    if (checkbox.form.elements.item(0).value == num) {
	checkbox.form.elements.item(0).checked = true;
     }
  } else {
    num--;
    if (num != checkbox.form.elements.item(0).value)
       checkbox.form.elements.item(0).checked = false;
  }
}


   // Date Display Function
    function displayDate(){
      var this_month = new Array(12); 
      this_month[0]  = "Jan";
      this_month[1]  = "Feb";
      this_month[2]  = "Mar";
      this_month[3]  = "Apr";
      this_month[4]  = "May";
      this_month[5]  = "Jun";
      this_month[6]  = "Jul";
      this_month[7]  = "Aug";
      this_month[8]  = "Sep";
      this_month[9]  = "Oct";
      this_month[10] = "Nov";
      this_month[11] = "Dec";
      var today = new Date();
      var day   = today.getDate();
      var month = today.getMonth();
      var year  = today.getYear();
      if (year < 1900){
         year += 1900;
      }
      var d = this_month[month]+" "+day+","+" "+year+" "+today.getHours()+":";
      if (today.getMinutes()<10) { 
	d+="0";
      }
      d+=today.getMinutes();
      return d;
    }

function hideBar(showSrc,hideSrc) {
  var leftPart = document.getElementById("left-part");
  var menuPart = document.getElementById("menu-part");
  var panelKey = document.getElementById("panel-key");
  if (!leftPart) {
      return;
  }
  if (leftPart.className != "hidden") {
    menuPart.style.display = "none";
    leftPart.className="hidden";
    panelKey.src = showSrc;
    panelKey.alt = nb_show_alt;
    setCookie("nb_state","hidden");
    getCookie("nb_state");
  } else {
    menuPart.style.display = "block";
    leftPart.className="visible";
    panelKey.src = hideSrc; 
    panelKey.alt = nb_hide_alt;
    setCookie("nb_state","visible");
    getCookie("nb_state");
  }
//  document.getElementById('hide-link').blur();
}



function showHelp(topic) {
   window.open('/help/index.jsp?topic=/irunner'+topic+'.html','help','left=100,top=100,height=500,width=700,scrollbars=yes,toolbar=no,location=no,status=no,resizable=yes,menubar=no');
}


function getCookie(Name) {   
	var search = Name + "=";
        //alert(document.cookie);
	if (document.cookie.length > 0)	{ // if there are any cookies
		offset = document.cookie.indexOf(search);
		if (offset != -1) { // if cookie exists          
			offset += search.length;          // set index of beginning of value         
		    end = document.cookie.indexOf(";", offset);          // set index of end of cookie value         
		    if (end == -1)             
    			end = document.cookie.length ;
    		return unescape(document.cookie.substring(offset, end));
    	}
    }
    return null;
}

function setCookie2(name, value, expires, path, domain, secure) {
	document.cookie = name + "="+ escape(value)+ ((expires) ? "; expires=" + expires.toGMTString() : "")+ ((path) ? "; path=" + path : "")+ ((domain) ? "; domain=" + domain : "")+ ((secure) ? "; secure" : "")+";";
}

function setCookie(name,value) {
  setCookie2(name,value,null,"/",null,false);
}

function m_cancel(name) {
  document.location='rollback.cmd?mark='+name;
}


function navElement(navigator,action,par1,par2) {
  document.location=par2+(par2.indexOf("?")>0 ? "&":"?")+'kat_nav_'+navigator+'_'+action+'='+par1;
}


function fileTypeChange(element) {
  element.form.elements["languageID"].disabled = !(element.value==215 || element.value ==216 || element.value ==217 || element.value==218 || element.value ==219);
}

function invertImage(image,input,img_path) {
 if (input.value=='0' || input.value=='') {
    input.value='1';
    image.src=img_path+'/true.gif';
 } else {
    input.value='0';
    image.src=img_path+'/false.gif';
 }
 onFormChange();
}

function onFormChange() {
  changed = true;
}

function closeWindow() {
  window.close();
}

function compareText (option1, option2) {
  return option1.text.toLowerCase() < option2.text.toLowerCase() ? -1 :
    option1.text.toLowerCase() > option2.text.toLowerCase() ? 1 : 0;
}

function compareValue (option1, option2) {
  return option1.value < option2.value ? -1 : option1.value > option2.value ? 1 : 0;
}

function compareTextAsFloat (option1, option2) {
  var value1 = parseFloat(option1.text);
  var value2 = parseFloat(option2.text);
  return value1 < value2 ? -1 :
    value1 > value2 ? 1 : 0;
}

function compareValueAsFloat (option1, option2) {
  var value1 = parseFloat(option1.value);
  var value2 = parseFloat(option2.value);
  return value1 < value2 ? -1 :
    value1 > value2 ? 1 : 0;
}

function sortSelect (select, compareFunction) {
  if (!compareFunction)
    compareFunction = compareText;
  var options = new Array (select.options.length);
  for (var i = 0; i < options.length; i++)
    options[i] = 
      new Option (
        select.options[i].text,
        select.options[i].value,
        select.options[i].defaultSelected,
        select.options[i].selected
      );

  options.sort(compareFunction);

  select.options.length = 0;
  for (var i = 0; i < options.length; i++) {
    select.options[i] = options[i];
  } 
}

function new_window(src) {
   new_window2(src,'popup','left=100,top=100,height=500,width=500,scrollbars=yes,toolbar=no,location=no,status=no,resizable=yes,menubar=no');
}

function new_window2(theURL,winName,features) { //v2.0
   window.open(theURL,winName,features);
}
