function openWindow(teamName,teamId,rank,solved,points) {
                const floatingElement = document.getElementById('floating-element');
                const contentElement = document.getElementById('teamPhoto');
                const nameElement = document.getElementById('teamName');
                const orgElement = document.getElementById('orgName');
                const rankElement = document.getElementById('teamRank');
                const statusElement = document.getElementById('teamStatus');
                if (floatingElement.style.display === 'none' || floatingElement.style.display === '') {
                        floatingElement.style.display = 'block';

                        //Set the image
                        IMGName="images/photos/"+teamId+"/photo.jpg";

                        IMGTitle=teamName;
                        newTitle=teamName.replace("(","#");
                        orgName = newTitle.split('#')[1];
                        orgName = orgName.replace(")","");
                        oldText="("+orgName+")";
                        IMGTitle = IMGTitle.replace(oldText,"");
			PHOTOID="teamPhoto";
                        contentElement.innerHTML = '<img src="'+IMGName+'" width="80%" height="80%" onerror="DisplayAvatar(\'teamPhoto\')"></img>';

                        nameElement.style.fontsize = '80pt';
                        nameElement.innerHTML = '<b><u>Team name: '+IMGTitle+'</u></b>';

                        orgElement.style.fontsize = '80pt';
                        orgElement.innerHTML = '<b><u>University: '+orgName+'</u></b>';

                        rankElement.style.fontsize = '80pt';
                        rankElement.innerHTML = '<b><u>Rank: #'+rank+'</u></b>';

                        statusElement.style.fontsize = '80pt';
                        statusElement.innerHTML = '<b><u>Problems Solved: '+solved+' | Penalties: '+points+'</u></b>';
                } else {
                        floatingElement.style.display = 'none';
                        }
        }


function closeFloatingElement() {
                document.getElementById('floating-element').style.display = 'none';
        }


function DisplayAvatar(ID) {
	document.getElementById(ID).innerHTML='<img src="images/logo.png" width="50%" height="50%"></img>';
}
