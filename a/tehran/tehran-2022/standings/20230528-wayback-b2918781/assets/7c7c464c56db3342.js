// Scoreboard
// By: Hamid Zarrabi-Zadeh, Hamed Moghimi
// December 2014


// initialize scoreboard
function init_scoreboard() {
    var tbody = document.getElementsByTagName('tbody')[0];
    var str = '';

    // create rows 
    for (var i = 0; i < rows.length; i++) {
        var item = rows[i];
        var team = html_entities(item[1]).split(':');
        if (team.length > 2)
            team[1] = team.splice(1, team.length).join(':');
        str += '<tr><td>' + item[0] + '</td>' +
            '<td class="team" data="' + item[4] + '">' + team[1] +
            '<span class="muted">' + team[0] + '</span></td>' +
            '<td>' + item[2] + '</td><td>' + item[3] + '</td>';

        // problems cols
        for (var j = 5; j < item.length; j++) {
            var prob = item[j];
            var cls = prob.cls ? ' class="' + prob.cls + '"' : '';
            var dat = "result" in prob ? ' data="' + prob.result + '"' : '';
            var att = (j == item.length - 1) ? prob.att : get_tries_text(prob.att);
            str += '<td' + cls + dat + '>' +
                prob.time + '<span class="muted"> ' + att + '</span></td>';
        }
    }
    tbody.innerHTML = str + tbody.innerHTML;
}

// tries text
function get_tries_text(num_tries) {
    var suffix = (num_tries == 1) ? 'try' : 'tries';
    return (num_tries == 0) ? '--' : num_tries + ' ' + suffix;
}


// safe encode str 
function html_entities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

init_scoreboard();