/*
PC2 Scoreboard using purely javascript
no database or server-side script need what-so-ever

** THIS IS MY FIRST TIME WRITING JS FOR PRODUCTION SO PLS BARE WITH ME!! **
--noly, August 2012

** This is my first time editting someone's messy js.
--Zento J., August 2013

** I HAVE CREATED SHUFFLE COLUMN METHOD CALLED RANCOL() FOR SHUFFLE PROBLEM AND ADDED SOME CSS STYLE FOR TABLE **
--MarRTaN I., September 2013
*/

function loadXMLDoc(dname)
{   if (window.XMLHttpRequest)
      {
      xhttp=new XMLHttpRequest();
      }
    else
      {
      xhttp=new ActiveXObject("Microsoft.XMLHTTP");
      }
    xhttp.open("GET",dname,false);
    xhttp.send();
    return xhttp.responseXML;
}

function getResult(){
  var head=xmlDoc.getElementsByTagName("standingsHeader")[0];
  var created = document.getElementById('created');
  problemCount = head.getAttribute('problemCount');
  created.innerHTML = "Created: " + head.getAttribute('currentDate');
}

function problemHeader(){
    var text = "";
    var head=xmlDoc.getElementsByTagName("standingsHeader")[0];
    problemCount = head.getAttribute('problemCount');
    ranCol(problemCount);
    for(i = 0; i<problemCount; i++){
        //count = randomCol[i]+5;
        //if(count>=problemCount) count = count-problemCount;         
        //text += "<th class ='problemcolheader problem" + String.fromCharCode((randomCol[i]%26)+'A'.charCodeAt(0)) + "'>" + String.fromCharCode((i/26)+'A'.charCodeAt(0)) + String.fromCharCode((i%26)+'A'.charCodeAt(0)) /*title + " - capitalize test" */ + "</br><div class = 'balloon'>�</div></th>";
var probno=(randomCol[i]%26);
/*
if(randomCol.length!=11){
if(probno>=5)
	probno++;
}*/
        text += "<th class ='problemcolheader problem" + String.fromCharCode(probno+'A'.charCodeAt(0)) + "' style='text-shadow: 2px 2px 4px #888;'>" +
         /*title + " - capitalize test" */ String.fromCharCode(probno+'A'.charCodeAt(0))
+"</th>";
    
    }
    return text;
}
function problems(s){
  var text = "";
  var p = s.getElementsByTagName("problemSummaryInfo");
  //alert(s.getAttribute('teamName') +" : "+p.length);
  for(j=0; j<p.length; j++){
    if(p[randomCol[j]].getAttribute('isSolved') === 'true'){
      var slvTime = p[randomCol[j]].getAttribute('solutionTime');
      var points = p[randomCol[j]].getAttribute('points');
      if(slvTime === bestSlvTime[randomCol[j]]){
        text+="<td class='problemcollist solvedfirst'>";
      }else{
        text+="<td class='problemcollist solved'>";
      }
      text+=p[randomCol[j]].getAttribute('attempts') +" (" + slvTime + " + " + (points - slvTime) + ")";

    } else if(p[randomCol[j]].getAttribute('isPending') === 'true'){
      text+="<td class='problemcollist pending'>";
      text+=p[randomCol[j]].getAttribute('attempts') +"<br></td>";
    } else if(p[randomCol[j]].getAttribute('attempts') > 0){
      text+="<td class='problemcollist attempted'>";
      text+=p[randomCol[j]].getAttribute('attempts') +"<br></td>";

    } else {
      text+="<td class='unsolved'><br></td>";
    }
  }
  return text;
}

function standing(){
  var text = "";
  var s=xmlDoc.getElementsByTagName("teamStanding");
  for(i=0; i<s.length; i++){  	
    text+='<tr>';
    text+="<td class='rank'>"+ s[i].getAttribute('rank') +"</td>";
    text+="<td style='text-align:left; padding-left:10px;'>"+ s[i].getAttribute('teamName') +"</td>";
    text+="<td class='solvedcollist' style='text-align:center'>"+ s[i].getAttribute('solved') +"</td>";
    text+="<td class='pointscollist' style='text-align:center'>"+ s[i].getAttribute('points') +"</td>";
    text+= problems(s[i]);
    text+="</tr>";
  }
  return text;
}


function getBestSlvTime(){
  var problems=xmlDoc.getElementsByTagName("problem");
  for(i = 0; i<problems.length; i++){
    var t_slv = problems[i].getAttribute("numberSolved");
    if(t_slv !== null){
      bestSlvTime.push(problems[i].getAttribute("bestSolutionTime"));
      slv.push(t_slv);
      att.push(problems[i].getAttribute("attempts"));
    }
  }
  //alert(bestSlvTime.toString())
}

function totalSolved(){
  var text="";
  for(i = 0; i<slv.length; i++){
      text+="<td>" + slv[randomCol[i]] + "</td>";
    }
	return text;
}

function totalAttempts(){
  var text="";
  for(i = 0; i<att.length; i++){
      text+="<td>" + att[randomCol[i]] + "</td>";
    }
	return text;
}
function totalRatio(){
  var text="";
  for(i = 0; i<slv.length; i++){
      text+="<td>" + (slv[randomCol[i]]/att[randomCol[i]]).toFixed(2) + "</td>";
  }
  return text;
}

var randomCol;
function ranCol(count){

   randomCol = new Array();
   for(i=0;i<count;i++){
   	randomCol[i]=i;
   }
/*
   for(i=0;i<count;i++){
   		tmp=randomCol[((i)*31)%257%count];
   		randomCol[((i)*31)%257%count]=randomCol[((i+1)*97)%257%count];
   		randomCol[((i+1)*97)%257%count]=tmp;
   }*/

}

xmlDoc=loadXMLDoc("results.xml");
	bestSlvTime = new Array();
	slv = new Array();
	att = new Array();
	getBestSlvTime();

function loadXML(){
	xmlDoc=loadXMLDoc("results.xml");
	bestSlvTime = new Array();
	slv = new Array();
	att = new Array();
	getBestSlvTime();
}
loadXML();
