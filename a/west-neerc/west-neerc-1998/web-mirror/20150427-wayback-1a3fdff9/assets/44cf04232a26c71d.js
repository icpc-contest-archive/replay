// Title: Tigra Calendar
// URL: http://www.softcomplex.com/products/tigra_calendar/
// Version: 3.2 (European date format)
// Date: 10/14/2002 (mm/dd/yyyy)
// Note: Permission given to use this script in ANY kind of applications if
//    header lines are left unchanged.
// Note: Script consists of two files: calendar?.js and calendar.html

// if two digit year input dates after this year considered 20 century.
var NUM_CENTYEAR = 30;
// is time input control required by default
var BUL_TIMECOMPONENT = false;
// are year scrolling buttons required by default
var BUL_YEARSCROLL = true;

var calendars = [];
var RE_NUM = /^\-?\d+$/;
var context;

var tsmp_format;
var date_format;
var time_format;

function calendar1(obj_target) {

	// assigning methods
	this.gen_date = cal_gen_date1;
	this.gen_time = cal_gen_time1;
	this.gen_tsmp = cal_gen_tsmp1;
	this.prs_time = cal_prs_time1;
	this.popup    = cal_popup1;

	// validate input parameters
	if (!obj_target)
		return cal_error("Error calling the calendar: target control not specified or not found");
	if (obj_target.value == null)
		return cal_error("Error calling the calendar: parameter specified is not valid target control");
	this.target = obj_target;
	this.time_comp = BUL_TIMECOMPONENT;
	this.year_scroll = BUL_YEARSCROLL;

	// register in global collections
	this.id = calendars.length;
	calendars[this.id] = this;
}

function trim(str) {
    return str.replace(/^\s+|\s+$/, '');
}

function cal_popup1 (str_datetime) {
	var value = str_datetime ? str_datetime : this.target.value;
	if (value==null || trim(""+value).length==0) {
	   this.dt_current = new Date();
	} else if (RE_NUM.exec(str_datetime)) {
	   this.dt_current = new Date(str_datetime);
	} else {
	   var temp_date =parseDate(trim(""+value), this.time_comp ? tsmp_format : date_format);
	   this.dt_current = temp_date==0 ? null : new Date(temp_date);
	   if (!this.dt_current) return;
	}
	var obj_calwindow = window.open(
//		'calendar.html?datetime=' + this.dt_current.valueOf()+ '&id=' + this.id,
		context+'/empty/calendar.cmd?datetime=' + this.dt_current.valueOf()+ '&id=' + this.id,
		'Calendar', 'width=200,height='+(this.time_comp ? 215 : 190)+
		',status=no,resizable=no,top=200,left=200,dependent=yes,alwaysRaised=yes'
	);
	obj_calwindow.opener = window;
	obj_calwindow.focus();
}

// timestamp generating function
function cal_gen_tsmp1 (dt_datetime) {
	return formatDate(dt_datetime,tsmp_format);
}

// date generating function
function cal_gen_date1 (dt_datetime) {
	return formatDate(dt_datetime,date_format);
}
// time generating function
function cal_gen_time1 (dt_datetime) {
	return formatDate(dt_datetime,time_format);
}

// timestamp parsing function
function cal_prs_tsmp1 (str_datetime) {
	// if no parameter specified return current timestamp
	if (!str_datetime)
		return (new Date());

	// if positive integer treat as milliseconds from epoch
	if (RE_NUM.exec(str_datetime))
		return new Date(str_datetime);
		
	// else treat as date in string format
	var arr_datetime = str_datetime.split(' ');
	return this.prs_time(arr_datetime[1], this.prs_date(arr_datetime[0]));
}


// time parsing function
function cal_prs_time1 (str_time, dt_date) {
	if (!dt_date) return null;
	if (!str_time || str_time.length==0) {
	    dt_date.setHours(0);
	    dt_date.setMinutes(0);
	    dt_date.setSeconds(0);
	    dt_date.setMilliseconds(0);	
	} else {
	    var dateForTime = parseDate(str_time,time_format);
	    if (dateForTime==0) {
		    return null;
	    } else {
	 	    dt_time = new Date(dateForTime);
		    dt_date.setHours(dt_time.getHours());
		    dt_date.setMinutes(dt_time.getMinutes());
		    dt_date.setSeconds(dt_time.getSeconds());
		    dt_date.setMilliseconds(dt_time.getMilliseconds());
	    }
	}
	return dt_date;
}
                        
function cal_error (str_message) {
	alert (str_message);
	return null;
}

function cal_error0(str_message) {
	alert (str_message);
	return 0;
}


// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download. 
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but 
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the 
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) {return(x<0||x>9?"":"0")+x}

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------
function isDate(val,format) {
	var date=parseDate(val,format);
	if (date==0) { return false; }
	return true;
}

// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 of if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------
function compareDates(date1,dateformat1,date2,dateformat2) {
	var d1=parseDate(date1,dateformat1);
	var d2=parseDate(date2,dateformat2);
	if (d1==0 || d2==0) {
		return -1;
	} else if (d1 > d2) {
		return 1;
	}
	return 0;
}

// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in parseDate()
// ------------------------------------------------------------------
function formatDate(date,format) {
	format=format+"";
	var result="";
	var i_format=0;
	var c="";
	var token="";
	var y=date.getYear()+"";
	var M=date.getMonth()+1;
	var d=date.getDate();
	var E=date.getDay();
	var H=date.getHours();
	var m=date.getMinutes();
	var s=date.getSeconds();
	var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
	// Convert real date parts into formatted versions
	var value=new Object();
	if (y.length < 4) {y=""+(y-0+1900);}
	value["y"]=""+y;
	value["yyyy"]=y;
	value["yy"]=y.substring(2,4);
	value["M"]=M;
	value["MM"]=LZ(M);
	value["MMM"]=MONTH_NAMES[M-1];
	value["NNN"]=MONTH_NAMES[M+11];
	value["d"]=d;
	value["dd"]=LZ(d);
	value["E"]=DAY_NAMES[E+7];
	value["EE"]=DAY_NAMES[E];
	value["H"]=H;
	value["HH"]=LZ(H);
	if (H==0){value["h"]=12;}
	else if (H>12){value["h"]=H-12;}
	else {value["h"]=H;}
	value["hh"]=LZ(value["h"]);
	if (H>11){value["K"]=H-12;} else {value["K"]=H;}
	value["k"]=H+1;
	value["KK"]=LZ(value["K"]);
	value["kk"]=LZ(value["k"]);
	if (H > 11) { value["a"]="PM"; }
	else { value["a"]="AM"; }
	value["m"]=m;
	value["mm"]=LZ(m);
	value["s"]=s;
	value["ss"]=LZ(s);
	while (i_format < format.length) {
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
		}
		if (value[token] != null) { result=result + value[token]; }
		else { result=result + token; }
	}
	return result;
}
	
// ------------------------------------------------------------------
// Utility functions for parsing in parseDate()
// ------------------------------------------------------------------
function _isInteger(val) {
	var digits="1234567890";
	for (var i=0; i < val.length; i++) {
		if (digits.indexOf(val.charAt(i))==-1) { return false; }
	}
	return true;
}

function _getInt(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return null; }
 		if (_isInteger(token)) { return token; }
	}
	return null;
}

function _getStr(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return str.substring(i,i+maxlength); }
 		if (_isInteger(token)) { return token; }
	}
	return str.substring(i,i+maxlength);
}
	
// ------------------------------------------------------------------
// parseDate( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function parseDate(val,format) {
	//alert("Value="+val+", Format="+format);
	val=val+"";
	format=format+"";
	var i_val=0;
	var i_format=0;
	var c="";
	var token="";
	var token2="";
	var x,y;
	var now=new Date();
	var year=now.getYear();
	var month=now.getMonth()+1;
	var date=1;
	var hh=now.getHours();
	var mm=now.getMinutes();
	var ss=now.getSeconds();
	var ampm="";
	
	while (i_format < format.length) {
		// Get next token from format string
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
		}
		// Extract contents of value based on format token
		if (token=="yyyy" || token=="yy" || token=="y") {
			if (token=="yyyy") { x=4;y=4; }
			if (token=="yy")   { x=2;y=2; }
			if (token=="y")    { x=2;y=4; }
			year=_getInt(val,i_val,x,y);
			if (year==null) { 
				return cal_error0("Invalid year value:"+_getStr(val,i_val,x,y)); 
			}
			i_val += year.length;
			if (year.length==2) {
				if (year > 70) { 
					year=1900+(year-0); 
				} else { 
					year=2000+(year-0); }
				}
			}
		else if (token=="MMM"||token=="NNN"){
			month=0;
			for (var i=0; i<MONTH_NAMES.length; i++) {
				var month_name=MONTH_NAMES[i];
				if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
					if (token=="MMM"||(token=="NNN"&&i>11)) {
						month=i+1;
						if (month>12) { month -= 12; }
						i_val += month_name.length;
						break;
						}
					}
				}
			if ((month < 1)||(month>12)){ return cal_error0("Invalid month value: '" + month + "'.\nAllowed range is 01-12."); }
			}
		else if (token=="EE"||token=="E"){
			for (var i=0; i<DAY_NAMES.length; i++) {
				var day_name=DAY_NAMES[i];
				if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
					i_val += day_name.length;
					break;
					}
				}
			}
		else if (token=="MM"||token=="M") {
			month=_getInt(val,i_val,token.length,2);
			if(month==null||(month<1)||(month>12)){ 
			  return cal_error0("Invalid month value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 01-12."); 
			}
			i_val+=month.length;}
		else if (token=="dd"||token=="d") {
			date=_getInt(val,i_val,token.length,2);
			if(date==null||(date<1)||(date>31)){
 			  return cal_error0("Invalid day of month value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 01-31."); 
			}
			i_val+=date.length;}
		else if (token=="hh"||token=="h") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>12)){
 			  return cal_error0("Invalid hours value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 01-12."); 
                        }
			i_val+=hh.length;}
		else if (token=="HH"||token=="H") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>23)){
 			  return cal_error0("Invalid hours value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 00-23."); 
                        }
			i_val+=hh.length;}
		else if (token=="KK"||token=="K") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>11)){
 			  return cal_error0("Invalid hours value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 00-11."); 
			}
			i_val+=hh.length;}
		else if (token=="kk"||token=="k") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>24)){
 			  return cal_error0("Invalid hours value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 01-24."); 
			}
			i_val+=hh.length;hh--;}
		else if (token=="mm"||token=="m") {
			mm=_getInt(val,i_val,token.length,2);
			if(mm==null||(mm<0)||(mm>59)){
 			  return cal_error0("Invalid minutes value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 00-59."); 
			}
			i_val+=mm.length;}
		else if (token=="ss"||token=="s") {
			ss=_getInt(val,i_val,token.length,2);
			if(ss==null||(ss<0)||(ss>59)){
 			  return cal_error0("Invalid seconds value: '" + _getStr(val,i_val,token.length,2) + "'.\nAllowed range is 00-59."); 
			}
			i_val+=ss.length;}
		else if (token=="a") {
			if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
			else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
			else {
			    return cal_error0("Expected am/pm, found - '"+val.substring(i_val,i_val+2)+"'."); 
			}
			i_val+=2;
		} else {
			if (val.substring(i_val,i_val+token.length)!=token) {
			    return cal_error0("Expected '"+token+"', found - '"+val.substring(i_val,i_val+token.length)+"'. Position - "+(i_val+1)); 
			} else {
			   i_val+=token.length;
                        }
		}
	} // while loop
	// If there are any trailing characters left in the value, it doesn't match
	if (i_val != val.length) { 
	     return cal_error0("Extra non-expected characters in the value."); 
	}
	// Is date valid for month?
	if (month==2) {
		// Check for leap year
		if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
			if (date > 29){ 
 			  return cal_error0("Invalid day of month value: '" + date + "'.\nAllowed range is 01-29."); 
			}
		} else { 
			if (date > 28) { 
 			  return cal_error0("Invalid day of month value: '" + date + "'.\nAllowed range is 01-28."); 
			} 
		}
	}
	if ((month==4)||(month==6)||(month==9)||(month==11)) {
		if (date > 30) { 
		  return cal_error0("Invalid day of month value: '" + date + "'.\nAllowed range is 01-30."); 
                }
	}
	// Correct hours value
	if (hh<12 && ampm=="PM") { 
		hh=hh-0+12; 
	} else if (hh>11 && ampm=="AM") { 
		hh-=12; 
	}
	var newdate=new Date(year,month-1,date,hh,mm,ss);
	return newdate.getTime();
}

// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------
//function guessDate(val) {
//	var preferEuro=(arguments.length==2)?arguments[1]:false;
//	generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');
//	monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
//	dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
//	var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
//	var d=null;
//	for (var i=0; i<checkList.length; i++) {
//		var l=window[checkList[i]];
//		for (var j=0; j<l.length; j++) {
//			d=parseDate(val,l[j]);
//			if (d!=0) { return new Date(d); }
//			}
//		}
//	return null;
//}