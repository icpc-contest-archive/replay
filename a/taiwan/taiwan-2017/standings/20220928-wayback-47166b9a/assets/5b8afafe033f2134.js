var scwDateNow = new Date(Date.parse(new Date().toDateString()));
var scwBaseYear = scwDateNow.getFullYear()-100;
var scwDropDownYears = 150;
function scwSetDefaultLanguage()
{try
{scwSetLanguage();}
catch (exception)
{// English
scwToday = 'Today:';
scwDrag = 'click here to drag';
scwArrMonthNames = ['Jan','Feb','Mar','Apr','May','Jun',
'Jul','Aug','Sep','Oct','Nov','Dec'];
scwArrWeekInits = ['S','M','T','W','T','F','S'];
scwInvalidDateMsg = 'The entered date is invalid.\n';
scwOutOfRangeMsg = 'The entered date is out of range.';
scwDoesNotExistMsg = 'The entered date does not exist.';
scwInvalidAlert = ['Invalid date (',') ignored.'];
scwDateDisablingError = ['Error ',' is not a Date object.'];
scwRangeDisablingError = ['Error ',
' should consist of two elements.'];
}
}
var scwWeekStart = 0;
var scwWeekNumberDisplay = false;
var scwWeekNumberBaseDay = 4;
var scwShowInvalidDateMsg = true,
scwShowOutOfRangeMsg = true,
scwShowDoesNotExistMsg = true,
scwShowInvalidAlert = true,
scwShowDateDisablingError = true,
scwShowRangeDisablingError = true;
var scwArrDelimiters = ['/','-','.',',',' '];
var scwDateDisplayFormat = 'YYYY-MM-DD'; // e.g. 'MMM-DD-YYYY' for the US
var scwDateOutputFormat = 'YYYY-MM-DD'; // e.g. 'MMM-DD-YYYY' for the US
var scwDateInputSequence = 'YMD'; // e.g. 'MDY' for the US
var scwZindex = 100;
var scwBlnStrict = false;
var scwEnabledDay = [true, true, true, true, true, true, true,
true, true, true, true, true, true, true,
true, true, true, true, true, true, true,
true, true, true, true, true, true, true,
true, true, true, true, true, true, true,
true, true, true, true, true, true, true];
var scwDisabledDates = new Array();
var scwActiveToday = true;
var scwOutOfRangeDisable = true;
var scwAllowDrag = false;
var scwClickToHide = false;
var js=document.getElementsByTagName("script");
js=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/")+1);
document.writeln(
'<style type="text/css">' +
'@import url('+js+'/calendar.css);' +
'.scw {padding:1px;vertical-align:middle;}' +
'iframe.scw {position:absolute;z-index:' + scwZindex +
';top:0px;left:0px;visibility:hidden;' +
'width:1px;height:1px;}' +
'table.scw {padding:0px;visibility:hidden;' +
'position:absolute;cursor:default;' +
'width:200px;top:0px;left:0px;' +
'z-index:' + (scwZindex+1) +
';text-align:center;}' +
'</style>' );
var scwTargetEle,
scwTriggerEle,
scwMonthSum = 0,
scwBlnFullInputDate = false,
scwPassEnabledDay = new Array(),
scwSeedDate = new Date(),
scwParmActiveToday = true,
scwWeekStart = scwWeekStart%7,
scwToday,
scwDrag,
scwArrMonthNames,
scwArrWeekInits,
scwInvalidDateMsg,
scwOutOfRangeMsg,
scwDoesNotExistMsg,
scwInvalidAlert,
scwDateDisablingError,
scwRangeDisablingError;
Date.prototype.scwFormat =
function(scwFormat)
{var charCount = 0,
codeChar = '',
result = '';
for (var i=0;i<=scwFormat.length;i++)
{if (i<scwFormat.length && scwFormat.charAt(i)==codeChar)
{// If we haven't hit the end of the string and
charCount++;
}
else {switch (codeChar)
{case 'y': case 'Y':
result += (this.getFullYear()%Math.
pow(10,charCount)).toString().
scwPadLeft(charCount);
break;
case 'm': case 'M':
result += (charCount<3)
?(this.getMonth()+1).
toString().scwPadLeft(charCount)
:scwArrMonthNames[this.getMonth()];
break;
case 'd': case 'D':
result += this.getDate().toString().
scwPadLeft(charCount);
break;
default:
while (charCount-- > 0) {result += codeChar;}
}
if (i<scwFormat.length)
{// Store the character we have just worked on
codeChar = scwFormat.charAt(i);
charCount = 1;
}
}
}
return result;
}
String.prototype.scwPadLeft =
function(padToLength)
{var result = '';
for (var i=0;i<(padToLength - this.length);i++) {result += '0';}
return (result + this);
}
Function.prototype.runsAfterSCW =
function() {var func = this,
args = new Array(arguments.length);
for (var i=0;i<args.length;++i)
{args[i] = arguments[i];}
return function()
{// concat/join the two argument arrays
for (var i=0;i<arguments.length;++i)
{args[args.length] = arguments[i];}
return (args.shift()==scwTriggerEle)
?func.apply(this, args):null;
}
};
var scwNextActionReturn, scwNextAction;
function showCal(scwEle,scwSourceEle,event) {scwShow(scwEle,scwSourceEle,event);}
function scwShow(scwEle,scwSourceEle,event)
{scwTriggerEle = scwSourceEle;
scwParmActiveToday = true;
for (var i=0;i<7;i++)
{scwPassEnabledDay[(i+7-scwWeekStart)%7] = true;
for (var j=2;j<arguments.length;j++)
{if (arguments[j]==i)
{scwPassEnabledDay[(i+7-scwWeekStart)%7] = false;
if (scwDateNow.getDay()==i) scwParmActiveToday = false;
}
}
}
scwSeedDate = scwDateNow;
scwEle.value = scwEle.value.replace(/^\s+/,'').replace(/\s+$/,'');
scwSetDefaultLanguage();
document.getElementById('scwDragText').innerHTML = scwDrag;
document.getElementById('scwMonths').options.length = 0;
for (i=0;i<scwArrMonthNames.length;i++)
document.getElementById('scwMonths').options[i] =
new Option(scwArrMonthNames[i],scwArrMonthNames[i]);
document.getElementById('scwYears').options.length = 0;
for (i=0;i<scwDropDownYears;i++)
document.getElementById('scwYears').options[i] =
new Option((scwBaseYear+i),(scwBaseYear+i));
for (i=0;i<scwArrWeekInits.length;i++)
document.getElementById('scwWeekInit' + i).innerHTML =
scwArrWeekInits[(i+scwWeekStart)%
scwArrWeekInits.length];
if (document.getElementById('scwFoot'))
document.getElementById('scwFoot').innerHTML =
scwToday + " " +
scwDateNow.scwFormat(scwDateDisplayFormat);
if (scwEle.value.length==0)
{// If no value is entered and today is within the range,
scwBlnFullInputDate=false;
if ((new Date(scwBaseYear+scwDropDownYears-1,11,31))<scwSeedDate ||
(new Date(scwBaseYear,0,1)) >scwSeedDate
)
{scwSeedDate = new Date(scwBaseYear +
Math.floor(scwDropDownYears / 2), 5, 1);
}
}
else
{function scwInputFormat(scwEleValue)
{var scwArrSeed = new Array(),
scwArrInput = scwEle.value.
split(new RegExp('[\\'+scwArrDelimiters.
join('\\')+']+','g'));
if (scwArrInput[0].length==0) scwArrInput.splice(0,1);
if (scwArrInput[scwArrInput.length-1].length==0)
scwArrInput.splice(scwArrInput.length-1,1);
scwBlnFullInputDate = false;
switch (scwArrInput.length)
{case 1:
{// Year only entry
scwArrSeed[0] = parseInt(scwArrInput[0],10); // Year
scwArrSeed[1] = '6'; // Month
scwArrSeed[2] = 1; // Day
break;
}
case 2:
{// Year and Month entry
scwArrSeed[0] =
parseInt(scwArrInput[scwDateInputSequence.
replace(/D/i,'').
search(/Y/i)],10); // Year
scwArrSeed[1] = scwArrInput[scwDateInputSequence.
replace(/D/i,'').
search(/M/i)]; // Month
scwArrSeed[2] = 1; // Day
break;
}
case 3:
{// Day Month and Year entry
scwArrSeed[0] =
parseInt(scwArrInput[scwDateInputSequence.
search(/Y/i)],10); // Year
scwArrSeed[1] = scwArrInput[scwDateInputSequence.
search(/M/i)]; // Month
scwArrSeed[2] =
parseInt(scwArrInput[scwDateInputSequence.
search(/D/i)],10); // Day
scwBlnFullInputDate = true;
break;
}
default:
{// A stuff-up has led to more than three elements in
scwArrSeed[0] = 0; // Year
scwArrSeed[1] = 0; // Month
scwArrSeed[2] = 0; // Day
}
}
var scwExpValDay = /^(0?[1-9]|[1-2]\d|3[0-1])$/,
scwExpValMonth = new RegExp("^(0?[1-9]|1[0-2]|" +
scwArrMonthNames.join("|") +
")$","i"),
scwExpValYear = /^(\d{1,2}|\d{4})$/;
if (scwExpValYear.exec(scwArrSeed[0]) == null ||
scwExpValMonth.exec(scwArrSeed[1]) == null ||
scwExpValDay.exec(scwArrSeed[2]) == null
)
{if (scwShowInvalidDateMsg)
alert(scwInvalidDateMsg +
scwInvalidAlert[0] + scwEleValue +
scwInvalidAlert[1]);
scwBlnFullInputDate = false;
scwArrSeed[0] = scwBaseYear +
Math.floor(scwDropDownYears/2); // Year
scwArrSeed[1] = '6'; // Month
scwArrSeed[2] = 1; // Day
}
return scwArrSeed;
}
scwArrSeedDate = scwInputFormat(scwEle.value);
if (scwArrSeedDate[0]<100)
scwArrSeedDate[0] += (scwArrSeedDate[0]>50)?1900:2000;
if (scwArrSeedDate[1].search(/\d+/)!=0)
{month = scwArrMonthNames.join('|').toUpperCase().
search(scwArrSeedDate[1].substr(0,3).
toUpperCase());
scwArrSeedDate[1] = Math.floor(month/4)+1;
}
scwSeedDate = new Date(scwArrSeedDate[0],
scwArrSeedDate[1]-1,
scwArrSeedDate[2]);
}
if (isNaN(scwSeedDate))
{if (scwShowInvalidDateMsg)
alert( scwInvalidDateMsg +
scwInvalidAlert[0] + scwEle.value +
scwInvalidAlert[1]);
scwSeedDate = new Date(scwBaseYear +
Math.floor(scwDropDownYears/2),5,1);
scwBlnFullInputDate=false;
}
else
{// Test that the date is within range,
if ((new Date(scwBaseYear,0,1)) > scwSeedDate)
{if (scwBlnStrict && scwShowOutOfRangeMsg)
alert(scwOutOfRangeMsg);
scwSeedDate = new Date(scwBaseYear,0,1);
scwBlnFullInputDate=false;
}
else
{if ((new Date(scwBaseYear+scwDropDownYears-1,11,31))<
scwSeedDate)
{if (scwBlnStrict && scwShowOutOfRangeMsg)
alert(scwOutOfRangeMsg);
scwSeedDate = new Date(scwBaseYear +
Math.floor(scwDropDownYears)-1,
11,1);
scwBlnFullInputDate=false;
}
else
{if (scwBlnStrict && scwBlnFullInputDate &&
(scwSeedDate.getDate() != scwArrSeedDate[2] ||
(scwSeedDate.getMonth()+1) != scwArrSeedDate[1] ||
scwSeedDate.getFullYear() != scwArrSeedDate[0]
)
)
{if (scwShowDoesNotExistMsg) alert(scwDoesNotExistMsg);
scwSeedDate = new Date(scwSeedDate.getFullYear(),
scwSeedDate.getMonth()-1,1);
scwBlnFullInputDate=false;
}
}
}
}
for (var i=0;i<scwDisabledDates.length;i++)
{if (!((typeof scwDisabledDates[i] == 'object') &&
(scwDisabledDates[i].constructor == Date)))
{if ((typeof scwDisabledDates[i] == 'object') &&
(scwDisabledDates[i].constructor == Array))
{var scwPass = true;
if (scwDisabledDates[i].length !=2)
{if (scwShowRangeDisablingError)
alert( scwRangeDisablingError[0] +
scwDisabledDates[i] +
scwRangeDisablingError[1]);
scwPass = false;
}
else
{for (var j=0;j<scwDisabledDates[i].length;j++)
{if (!((typeof scwDisabledDates[i][j]
== 'object') &&
(scwDisabledDates[i][j].constructor
== Date)))
{if (scwShowRangeDisablingError)
alert( scwDateDisablingError[0] +
scwDisabledDates[i][j] +
scwDateDisablingError[1]);
scwPass = false;
}
}
}
if (scwPass &&
(scwDisabledDates[i][0] > scwDisabledDates[i][1])
)
{scwDisabledDates[i].reverse();}
}
else
{if (scwShowRangeDisablingError)
alert( scwDateDisablingError[0] +
scwDisabledDates[i] +
scwDateDisablingError[1]);
}
}
}
scwMonthSum = 12*(scwSeedDate.getFullYear()-scwBaseYear)+
scwSeedDate.getMonth();
document.getElementById('scwYears').options.selectedIndex =
Math.floor(scwMonthSum/12);
document.getElementById('scwMonths').options.selectedIndex=
(scwMonthSum%12);
var offsetTop =parseInt(scwEle.offsetTop ,10) +
parseInt(scwEle.offsetHeight,10),
offsetLeft=parseInt(scwEle.offsetLeft,10);
scwTargetEle=scwEle;
do {scwEle=scwEle.offsetParent;
offsetTop +=parseInt(scwEle.offsetTop,10);
offsetLeft+=parseInt(scwEle.offsetLeft,10);
}
while (scwEle.tagName!='BODY' && scwEle.tagName!='HTML');
document.getElementById('scw').style.top =offsetTop +'px';
if(event){
	var bodyheight ;
   if(document.documentElement) {
      bodyheight = document.documentElement.clientHeight;
	}
   else {
      bodyheight = document.body.offsetHeight;
	}
	var height=parseInt(divOsClass.prototype.getScrollTop())+parseInt(event.clientY);
	if(height+200 > bodyheight)
		document.getElementById('scw').style.top=height - 200+'px';
	else 
		document.getElementById('scw').style.top =height+'px';
}
document.getElementById('scw').style.left=offsetLeft+'px';
document.getElementById('scw').style.zIndex='1000';
if (document.getElementById('scwIframe'))
{
//document.getElementById('scwIframe').style.top=offsetTop +'px';
document.getElementById('scwIframe').style.top=document.getElementById('scw').style.top;
document.getElementById('scwIframe').style.left=offsetLeft+'px';
document.getElementById('scwIframe').style.width=
(document.getElementById('scw').offsetWidth-2)+'px';
document.getElementById('scwIframe').style.height=
(document.getElementById('scw').offsetHeight-2)+'px';
document.getElementById('scwIframe').style.visibility='visible';
}
document.getElementById('scwDrag').style.display=
(scwAllowDrag)
?((document.getElementById('scwIFrame')||
document.getElementById('scwIEgte7'))?'block':'table-row')
:'none';
scwShowMonth(0);
document.getElementById('scw').style.visibility='visible';
if (typeof event=='undefined')
{scwSourceEle.parentNode.
addEventListener("click",scwStopPropagation,false);
}
else {event.cancelBubble = true;}
}
function scwHide()
{
document.getElementById('scw').style.visibility='hidden';
if (document.getElementById('scwIframe'))
{document.getElementById('scwIframe').style.visibility='hidden';}
if (typeof scwNextAction!='undefined' && scwNextAction!=null)
{scwNextActionReturn = scwNextAction();
scwNextAction = null;
}
}
function scwCancel(scwEvt)
{if (scwClickToHide) scwHide();
scwStopPropagation(scwEvt);
}
function scwStopPropagation(scwEvt)
{if (scwEvt.stopPropagation)
scwEvt.stopPropagation(); // Capture phase
else scwEvt.cancelBubble = true; // Bubbling phase
}
function scwBeginDrag(event)
{var elementToDrag = document.getElementById('scw');
var deltaX = event.clientX,
deltaY = event.clientY,
offsetEle = elementToDrag;
do {deltaX -= parseInt(offsetEle.offsetLeft,10);
deltaY -= parseInt(offsetEle.offsetTop ,10);
offsetEle = offsetEle.offsetParent;
}
while (offsetEle.tagName!='BODY' &&
offsetEle.tagName!='HTML');
if (document.addEventListener)
{document.addEventListener('mousemove',
moveHandler,
true); // Capture phase
document.addEventListener('mouseup',
upHandler,
true); // Capture phase
}
else {elementToDrag.attachEvent('onmousemove',
moveHandler); // Bubbling phase
elementToDrag.attachEvent('onmouseup',
upHandler); // Bubbling phase
elementToDrag.setCapture();
}
scwStopPropagation(event);
function moveHandler(scwEvt)
{if (!scwEvt) scwEvt = window.event;
elementToDrag.style.left = (scwEvt.clientX - deltaX) + 'px';
elementToDrag.style.top = (scwEvt.clientY - deltaY) + 'px';
if (document.getElementById('scwIframe'))
{document.getElementById('scwIframe').style.left =
(scwEvt.clientX - deltaX) + 'px';
document.getElementById('scwIframe').style.top =
(scwEvt.clientY - deltaY) + 'px';
}
scwStopPropagation(scwEvt);
}
function upHandler(scwEvt)
{if (!scwEvt) scwEvt = window.event;
if (document.removeEventListener)
{document.removeEventListener('mousemove',
moveHandler,
true); // Capture phase
document.removeEventListener('mouseup',
upHandler,
true); // Capture phase
}
else {elementToDrag.detachEvent('onmouseup',
upHandler); // Bubbling phase
elementToDrag.detachEvent('onmousemove',
moveHandler); // Bubbling phase
elementToDrag.releaseCapture();
}
scwStopPropagation(scwEvt);
}
}
function scwShowMonth(scwBias)
{// Set the selectable Month and Year
var scwShowDate = new Date(Date.parse(new Date().toDateString())),
scwStartDate = new Date();
scwSelYears = document.getElementById('scwYears');
scwSelMonths = document.getElementById('scwMonths');
if (scwSelYears.options.selectedIndex>-1)
{scwMonthSum=12*(scwSelYears.options.selectedIndex)+scwBias;
if (scwSelMonths.options.selectedIndex>-1)
{scwMonthSum+=scwSelMonths.options.selectedIndex;}
}
else
{if (scwSelMonths.options.selectedIndex>-1)
{scwMonthSum+=scwSelMonths.options.selectedIndex;}
}
scwShowDate.setFullYear(scwBaseYear + Math.floor(scwMonthSum/12),
(scwMonthSum%12),
1);
document.getElementById("scwWeek_").style.display=
(scwWeekNumberDisplay)
?((document.getElementById('scwIFrame')||
document.getElementById('scwIEgte7'))?'block':'table-cell')
:'none';
if ((12*parseInt((scwShowDate.getFullYear()-scwBaseYear),10)) +
parseInt(scwShowDate.getMonth(),10) < (12*scwDropDownYears) &&
(12*parseInt((scwShowDate.getFullYear()-scwBaseYear),10)) +
parseInt(scwShowDate.getMonth(),10) > -1)
{scwSelYears.options.selectedIndex=Math.floor(scwMonthSum/12);
scwSelMonths.options.selectedIndex=(scwMonthSum%12);
scwCurMonth = scwShowDate.getMonth();
scwShowDate.setDate((((scwShowDate.
getDay()-scwWeekStart)<0)?-6:1)+
scwWeekStart-scwShowDate.getDay());
scwStartDate = new Date(scwShowDate);
var scwFoot = document.getElementById('scwFoot');
function scwFootOutput() {scwSetOutput(scwDateNow);}
if (scwDisabledDates.length==0)
{if (scwActiveToday && scwParmActiveToday)
{scwFoot.onclick = scwFootOutput;
scwFoot.className = 'scwFoot';
if (document.getElementById('scwIFrame'))
{scwFoot.onmouseover = scwChangeClass;
scwFoot.onmouseout = scwChangeClass;
}
}
else
{scwFoot.onclick = null;
scwFoot.className = 'scwFootDisabled';
if (document.getElementById('scwIFrame'))
{scwFoot.onmouseover = null;
scwFoot.onmouseout = null;
}
if (document.addEventListener)
{scwFoot.addEventListener('click',
scwStopPropagation,
false);}
else {scwFoot.attachEvent('onclick',
scwStopPropagation);}
}
}
else
{for (var k=0;k<scwDisabledDates.length;k++)
{if (!scwActiveToday || !scwParmActiveToday ||
((typeof scwDisabledDates[k] == 'object') &&
(((scwDisabledDates[k].constructor == Date) &&
scwDateNow.valueOf() == scwDisabledDates[k].
valueOf()
) ||
((scwDisabledDates[k].constructor == Array) &&
scwDateNow.valueOf() >= scwDisabledDates[k][0].
valueOf() &&
scwDateNow.valueOf() <= scwDisabledDates[k][1].
valueOf()
)
)
)
)
{scwFoot.onclick = null;
scwFoot.className = 'scwFootDisabled';
if (document.getElementById('scwIFrame'))
{scwFoot.onmouseover = null;
scwFoot.onmouseout = null;
}
if (document.addEventListener)
{scwFoot.addEventListener('click',
scwStopPropagation,
false);
}
else {scwFoot.attachEvent('onclick',
scwStopPropagation);
}
break;
}
else
{scwFoot.onclick=scwFootOutput;
scwFoot.className='scwFoot';
if (document.getElementById('scwIFrame'))
{scwFoot.onmouseover = scwChangeClass;
scwFoot.onmouseout = scwChangeClass;
}
}
}
}
function scwSetOutput(scwOutputDate)
{scwTargetEle.value =
scwOutputDate.scwFormat(scwDateOutputFormat);
scwHide();
}
function scwCellOutput(scwEvt)
{var scwEle = scwEventTrigger(scwEvt),
scwOutputDate = new Date(scwStartDate);
if (scwEle.nodeType==3) scwEle=scwEle.parentNode;
scwOutputDate.setDate(scwStartDate.getDate() +
parseInt(scwEle.id.substr(8),10));
scwSetOutput(scwOutputDate);
}
function scwChangeClass(scwEvt)
{var scwEle = scwEventTrigger(scwEvt);
if (scwEle.nodeType==3) scwEle=scwEle.parentNode;
switch (scwEle.className)
{case 'scwCells':
scwEle.className = 'scwCellsHover';
break;
case 'scwCellsHover':
scwEle.className = 'scwCells';
break;
case 'scwCellsExMonth':
scwEle.className = 'scwCellsExMonthHover';
break;
case 'scwCellsExMonthHover':
scwEle.className = 'scwCellsExMonth';
break;
case 'scwCellsWeekend':
scwEle.className = 'scwCellsWeekendHover';
break;
case 'scwCellsWeekendHover':
scwEle.className = 'scwCellsWeekend';
break;
case 'scwFoot':
scwEle.className = 'scwFootHover';
break;
case 'scwFootHover':
scwEle.className = 'scwFoot';
break;
case 'scwInputDate':
scwEle.className = 'scwInputDateHover';
break;
case 'scwInputDateHover':
scwEle.className = 'scwInputDate';
}
return true;
}
function scwEventTrigger(scwEvt)
{if (!scwEvt) scwEvt = event;
return scwEvt.target||scwEvt.srcElement;
}
function scwWeekNumber(scwInDate)
{// The base day in the week of the input date
var scwInDateWeekBase = new Date(scwInDate);
scwInDateWeekBase.setDate(scwInDateWeekBase.getDate()
- scwInDateWeekBase.getDay()
+ scwWeekNumberBaseDay
+ ((scwInDate.getDay()>
scwWeekNumberBaseDay)?7:0));
var scwFirstBaseDay =
new Date(scwInDateWeekBase.getFullYear(),0,1)
scwFirstBaseDay.setDate(scwFirstBaseDay.getDate()
- scwFirstBaseDay.getDay()
+ scwWeekNumberBaseDay
);
if (scwFirstBaseDay <
new Date(scwInDateWeekBase.getFullYear(),0,1))
{scwFirstBaseDay.setDate(scwFirstBaseDay.getDate()+7);}
var scwStartWeekOne = new Date(scwFirstBaseDay
- scwWeekNumberBaseDay
+ scwInDate.getDay());
if (scwStartWeekOne > scwFirstBaseDay)
{scwStartWeekOne.setDate(scwStartWeekOne.getDate()-7);}
var scwWeekNo =
"0" + (Math.round((scwInDateWeekBase -
scwFirstBaseDay)/604800000,0) + 1);
return scwWeekNo.substring(scwWeekNo.length-2,
scwWeekNo.length);
}
var scwCells = document.getElementById('scwCells');
for (i=0;i<scwCells.childNodes.length;i++)
{var scwRows = scwCells.childNodes[i];
if (scwRows.nodeType==1 && scwRows.tagName=='TR')
{if (scwWeekNumberDisplay)
{//Calculate the week number using scwShowDate
scwRows.childNodes[0].innerHTML =
scwWeekNumber(scwShowDate);
scwRows.childNodes[0].style.display=
(document.getElementById('scwIFrame')||
document.getElementById('scwIEgte7'))
?'block'
:'table-cell';
}
else
{scwRows.childNodes[0].style.display='none';}
for (j=1;j<scwRows.childNodes.length;j++)
{var scwCols = scwRows.childNodes[j];
if (scwCols.nodeType==1 && scwCols.tagName=='TD')
{scwRows.childNodes[j].innerHTML=
scwShowDate.getDate();
var scwCell=scwRows.childNodes[j],
scwDisabled =
(scwOutOfRangeDisable &&
(scwShowDate < (new Date(scwBaseYear,0,1))
||
scwShowDate > (new Date(scwBaseYear+
scwDropDownYears-
1,11,31))
)
)?true:false;
for (var k=0;k<scwDisabledDates.length;k++)
{if ((typeof scwDisabledDates[k]=='object')
&&
(scwDisabledDates[k].constructor ==
Date
)
&&
scwShowDate.valueOf() ==
scwDisabledDates[k].valueOf()
)
{scwDisabled = true;}
else
{if ((typeof scwDisabledDates[k]=='object')
&&
(scwDisabledDates[k].constructor ==
Array
)
&&
scwShowDate.valueOf() >=
scwDisabledDates[k][0].valueOf()
&&
scwShowDate.valueOf() <=
scwDisabledDates[k][1].valueOf()
)
{scwDisabled = true;}
}
}
if (scwDisabled ||
!scwEnabledDay[j-1+(7*((i*scwCells.
childNodes.
length)/6))] ||
!scwPassEnabledDay[(j-1+(7*(i*scwCells.
childNodes.
length/6)))%7]
)
{scwRows.childNodes[j].onclick = null;
if (document.getElementById('scwIFrame'))
{scwRows.childNodes[j].onmouseover = null;
scwRows.childNodes[j].onmouseout = null;
}
scwCell.className=
(scwShowDate.getMonth()!=scwCurMonth)
?'scwCellsExMonthDisabled'
:(scwBlnFullInputDate &&
scwShowDate.toDateString()==
scwSeedDate.toDateString())
?'scwInputDateDisabled'
:(scwShowDate.getDay()%6==0)
?'scwCellsWeekendDisabled'
:'scwCellsDisabled';
}
else
{scwRows.childNodes[j].onclick=scwCellOutput;
if (document.getElementById('scwIFrame'))
{scwRows.childNodes[j].onmouseover =
scwChangeClass;
scwRows.childNodes[j].onmouseout =
scwChangeClass;
}
scwCell.className=
(scwShowDate.getMonth()!=scwCurMonth)
?'scwCellsExMonth'
:(scwBlnFullInputDate &&
scwShowDate.toDateString()==
scwSeedDate.toDateString())
?'scwInputDate'
:(scwShowDate.getDay()%6==0)
?'scwCellsWeekend'
:'scwCells';
}
scwShowDate.setDate(scwShowDate.getDate()+1);
}
}
}
}
}
document.getElementById('scw').style.visibility='hidden';
document.getElementById('scw').style.visibility='visible';
}
document.write(
"<!--[if gte IE 7]>" +
"<div id='scwIEgte7'></div>" +
"<![endif]-->" +
"<!--[if lt IE 7]>" +
"<iframe class='scw' src='"+js+"/scwblank.html' " +
"id='scwIframe' name='scwIframe' " +
"frameborder='0'>" +
"</iframe>" +
"<![endif]-->" +
"<table id='scw' class='scw' onclick='scwCancel(event);'>" +
"<tr class='scw'>" +
"<td class='scw'>" +
"<table class='scwHead' id='scwHead' width='100%' " +
"onClick='scwStopPropagation(event);' " +
"cellspacing='0' cellpadding='0'>" +
"<tr id='scwDrag' style='display:none;'>" +
"<td colspan='4' class='scwDrag' " +
"onmousedown='scwBeginDrag(event);'>" +
"<div id='scwDragText'></div>" +
"</td>" +
"</tr>" +
"<tr class='scwHead'>" +
"<td class='scwHead' align='left'>" +
"<input class='scwHead' type='button' value='&lt;' " +
"onclick='scwShowMonth(-1);' /></td>" +
"<td class='scwHead' colspan='2'>" +
"<select id='scwMonths' class='scwHead' " +
"onChange='scwShowMonth(0);'>" +
"</select>" +
"<select id='scwYears' class='scwHead' " +
"onChange='scwShowMonth(0);'>" +
"</select>" +
"</td>" +
"<td class='scwHead' align='right'>" +
"<input class='scwHead' type='button' value='&gt;' " +
"onclick='scwShowMonth(1);' /></td>" +
"</tr>" +
"</table>" +
"</td>" +
"</tr>" +
"<tr class='scw'>" +
"<td class='scw'>" +
"<table class='scwCells' cellspacing='0' cellpadding='0' align='center' width='100%'>" +
"<thead>" +
"<tr><td class='scwWeekNumberHead' id='scwWeek_' ></td>");
for (i=0;i<7;i++)
document.write( "<td class='scwWeek' id='scwWeekInit" + i + "'></td>");
document.write("</tr>" +
"</thead>" +
"<tbody id='scwCells' " +
"onClick='scwStopPropagation(event);'>");
for (i=0;i<6;i++)
{document.write(
"<tr>" +
"<td class='scwWeekNo' id='scwWeek_" + i + "'></td>");
for (j=0;j<7;j++)
{document.write(
"<td class='scwCells' id='scwCell_" + (j+(i*7)) +
"'></td>");
}
document.write(
"</tr>");
}
document.write(
"</tbody>");
if ((new Date(scwBaseYear + scwDropDownYears, 11, 32)) > scwDateNow &&
(new Date(scwBaseYear, 0, 0)) < scwDateNow)
{document.write(
"<tfoot class='scwFoot'>" +
"<tr class='scwFoot'>" +
"<td class='scwFoot' id='scwFoot' colspan='8'>" +
"</td>" +
"</tr>" +
"</tfoot>");
}
document.write(
"</table>" +
"</td>" +
"</tr>" +
"</table>");
if (document.addEventListener)
{document.addEventListener('click',scwHide, false);}
else {document.attachEvent('onclick',scwHide);}

/**
*       show calendar
*
*
*       @param string scwEle  form name;
*       @param object scwSourceEle coloumn item
*       @return null
*/
function showCalendar(scwEle,scwSourceEle,event) {scwShow(scwEle,scwSourceEle,event);}
