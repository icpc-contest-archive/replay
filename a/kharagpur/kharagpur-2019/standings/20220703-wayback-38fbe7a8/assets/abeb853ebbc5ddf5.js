var pos=0;
var total=0;

function loadHash(hash)
{
$('.menu-item').removeClass('menu-item-active');
$('.menu-item'+hash+'-menu').addClass('menu-item-active');

var page=hash.substring(1)+'.html';
$('#page_content').load(page);

}

$('document').ready(function(){

if(window.location.hash!="" && window.location.hash)
{	
	if (window.location.hash == '#registration')
		loadBottom(window.location.hash);
	else
		loadHash(window.location.hash);
}
pos=0;
total=$('#slider-img').children().length;
showNext();
setInterval(function(){showNext();},5000);
document.getElementById('check').onclick=check;
});

function check()
{
	alert ('hey');
	}
function register(){
	var allow = 1;
	$('form#registration input').each(function(){
		if($(this).val() == ''){
			alert('Please fill in all the fields');
			allow = 0;
			return false;
		}
	});
	if (allow == 0)
		return false;
	var regform = document.registration;
	var tname = regform.tname.value;
	var p1name = regform.p1name.value;
	var p2name = regform.p2name.value;
	var p3name = regform.p3name.value;
	var resname = regform.resname.value;
	var cname = regform.cname.value;
	var cemail = regform.cemail.value;
	var ccontact = regform.ccontact.value;
	var p1contact = regform.p1contact.value;
	var p2contact = regform.p2contact.value;
	var p3contact = regform.p3contact.value;
	var rescontact = regform.rescontact.value;
        var p1gender = regform.p1gender.value;
	var p2gender = regform.p2gender.value;
	var p3gender = regform.p3gender.value;
	var resgender = regform.resgender.value;
	var cinsti = regform.cinstitution.value;
	var tpass = regform.tpass.value;
	var repass = regform.repass.value;
	var atpos=cemail.indexOf("@");
	var dotpos=cemail.lastIndexOf(".");
	if (atpos<1 || dotpos<atpos+2 || dotpos+2>=cemail.length){
	  alert("Not a valid e-mail address");
	  return false;
	}
	if (tpass != repass){
		alert('Passwords did not match');
		return false;
	}

	$.post('registration.php',{ cname: cname, p1name:p1name, p2name:p2name, p3name:p3name, resname:resname, cemail:cemail, ccontact:ccontact, p1contact:p1contact, p2contact:p2contact, p3contact:p3contact, rescontact:rescontact, p1gender:p1gender, p2gender:p2gender, p3gender:p3gender, resgender:resgender, cinstitution:cinsti, tname:tname, tpass:tpass },function(data){ if(data){ if (data == 1) alert('Sorry..Team name already exists'); else{ alert(data); loadBottom('#registration'); } }else alert('Error encountered..Please try again later'); });
	
}

function loadBottom(hash)
{
$('.bottom-menu-item').removeClass('bottom-menu-item-active');
$(hash+'-menu').addClass('bottom-menu-item-active');
if(hash=="#registration"){
var page='registrationform.html';//hash.substring(1)+'.php'
}else
var page=hash.substring(1)+'.html';
$('#bottom-info').load(page);
//window.scrollTo($('#bottom-info').position().top,$('#bottom-info').position().left);
}

function showNext()
{
var nunm=pos;	//alert('hey');
if(pos<total-1)
{
pos++;
}
else
{
pos=0;
}
var img=$('#slider-img').children()[nunm];
$(img).slideUp();
img=$('#slider-img').children()[pos];
//$(img).slideDown(0.5,'ease-in-out',false);
$(img).slideDown();

}

function showPrev()
{
	//alert('heyyy');
if(pos>0)
{
pos--;
}
else
{
pos=total-1;
}

$('.sl-img').slideUp();
var img=$('#slider-img').children()[pos];
//$(img).slideDown(0.5,'ease-in-out',false);
$(img).slideDown();

}
