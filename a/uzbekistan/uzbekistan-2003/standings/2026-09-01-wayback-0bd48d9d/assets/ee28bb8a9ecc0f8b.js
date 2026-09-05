function showvcard(id)
{
    var wndNewWindow =
        window.open(
            "../Information/vcard.jsp?"+id,
            "vcard_window",
            "toolbar=no,menubar=no,scrollbars=yes,width=350,height=250");
}

var wndHelpWindow = null;
function showhelp(topic)
{
    wndHelpWindow =
        window.open(
            "../Personal/help.jsp?"+topic,
            "help_window",
            "toolbar=no,menubar=no,scrollbars=yes,width=500,height=300");
}

function closehelp()
{
    if (wndHelpWindow != null)
    {
        wndHelpWindow.close();
    }
}

function showremindpass()
{
    var wndNewWindow =
        window.open(
            "../Personal/remindpass.jsp",
            "remindpass_window",
            "toolbar=no,menubar=no,scrollbars=yes,width=500,height=300");
}

function cutstring(str, len)
{
    if (str != null && str.length > len)
    {
        return str.substr(0, len);
    }
    else
    {
        return str;
    }
}


