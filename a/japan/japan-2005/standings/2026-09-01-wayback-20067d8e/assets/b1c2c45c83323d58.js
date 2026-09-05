// P r e L o a d   I m a g e s
var preloadflag = false;
function PreLoad(){

	var preimgs = new Array();
	for(i = 0 ; i < Imglist.length ; i++){
		preimgs[i] = new Image();
		preimgs[i].src = Imglist[i];
	}
	preloadflag = true;
}


// S w a p   I m a g e s

function SwapImage(ImageName,FileName){

	if(preloadflag == true){
		target = document.images[ImageName];
		target.src = FileName;
	}
}

// O p e n   N e w   W i n d o w
function OpnWin(url,winName,w,h,tbar){
	newWin=window.open(url,winName,"toolbar="+tbar+",location=no,directories=no,status=yes,scrollbars=yes,resizable=yes,width="+w+",height="+h);
	if(navigator.appName.indexOf("Netscape",0) != -1){
		newWin.focus();
	}
}
