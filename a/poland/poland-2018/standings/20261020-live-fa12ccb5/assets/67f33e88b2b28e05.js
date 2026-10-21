

var bState = false;
function ShowColumns(bShow)
{
    var c = document.getElementsByTagName("td");
     
    for (var i=1;i<c.length;i++)
    {
        if (((i-1)%18)>4)
        {
            c[i].hidden = !bShow;
        }			
    }

    if (bShow) c[0].colSpan = 18;
          else c[0].colSpan = 5;
}

function ShowColumnsCheck()
{
    bState = !bState;
    ShowColumns(bState);
}

