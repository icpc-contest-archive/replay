function foreach_tpl(arr, func)
{
	var res = '';
	if (typeof arr != 'object') return '';
	for (var i in arr)
	{
		res += func(i, arr[i]);
	}
	return res;
}

function tpl_standings_problem(key, val)
{
	return '<th width="35">' + key + '</th>';
}

function tpl_standings_cell(key, val)
{
	if (key == 'id' || key == 'name' || key == 'score' || key == 'time' || key == 'tc_name') return '';
	if (val['pending'])
	{
		if (val['attempts'] > 1)
		{
			return '<td class="unk">? (-' + (val['attempts'] - 1) + ')';
		}
		return '<td class="unk">?</td>';
	}
	if (val['attempts'] == 0)
	{
		return '<td class="emp">.</td>';
	}
	if (val['success'] == 0)
	{
		return '<td class="re">-' + val['attempts'] + '</td>';
	}
	return '<td class="ac">+'
		+ (val['attempts'] > 1 ? val['attempts'] - 1 : '')
		+ '<dfn>' + format_time(val['time']) + '</dfn>'
		+ '</td>';
}

var bgclass1;
var bgclass2;
function tpl_standings_row(key, val)
{
	var res = '';
	st_rank++;
	if (st_lastscore != val['score'] || st_lasttime != val['time'])
	{
		st_lasttime = val['time'];
		st_lastrank = st_rank;
	}
	if (st_lastscore != val['score'])
	{
		st_lastscore = val['score'];
		bgclass2 = !bgclass2;
	}
	bgclass1 = !bgclass1;
	var bgclass = 'alt' + (bgclass1 ? '1' : '2') + (bgclass2 ? 'a' : '');
	if (val['id'] == '--')
	{
		bgclass = 'altmy';
	}

	
	res += '<tr class="' + bgclass + '">'
//	res += '<td class="emp">' + val['id'] + '</td>';
	res += '<td class="emp">' + st_lastrank + '</td>';
	res += '<td style="padding-left: 10px">';
	res += '<span class="name">' + val['name'] + '</span><span class="tc_name">' + val['tc_name'] + '</span>';
	res += '</td>';
	res += foreach_tpl(val, tpl_standings_cell);
	res += '<td>' + val['score'] + '</td><td>' + val['time'] + '</td>';
	res += '</tr>';
	return res;
}



function tpl_standings(a)
{
	var res = '';
	bgclass1 = true;
	bgclass2 = false;	
	st_lastscore = -1;
	for (var i in a['teams'])
	{
		if (a['teams'][i]['score'] == st_lastscore) continue;
		st_lastscore = a['teams'][i]['score'];
		bgclass2 = !bgclass2;
	}
	st_lastscore = -1;
	st_lasttime = -1;
	st_lastrank = 0;
	st_rank = 0;
	res += '<table id="standings_table" style="width: 100%" cellpadding="1" cellspacing="0" style="border: none">';
	res += '<tr>';
	res += '<th width="32">rank</th>';
//	res += '<th width="50">id</th>';
	res += '<th style="text-align: left">team</th>';
	res += foreach_tpl(a['problems'], tpl_standings_problem);
	res += '<th width="16" style="text-align: left; padding-left:0">=</th><th width="32" style="text-align: left; padding-left:0">time</th>';
	res += '</tr>';
	res += foreach_tpl(a['teams'], tpl_standings_row);
	res += '</table>';
	return res;
}

function tpl_history(a)
{
	if (!a) return '';
	var res = '';
	res += '<table cellspacing="0" style="width: 100%">';
	res += '<tr><th width="60">time</th><th width="400">team</th><th width="60">problem</th><th width="80">old rank</th><th>new rank</th></tr>';
	var rows = '';
	bgclass = false;
	
	var end = Math.max(0, a.length - preferences['history']);
	if (a.length == end) return '';
	for (var i = a.length - 1; i >= end; i--)
	{
		var r = a[i];
		var row = '';
		row += '<tr class="' + (bgclass ? 'alt1' : 'alt2') + '">';
		row += '<td>' + format_time(r['time']) + '</td>';
		row += '<td>' + r['team'] + '</td>';
		row += '<td>' + r['problem'] + '</td>';
		row += '<td>' + r['old_rank'] + '</td>';
		row += '<td>' + r['new_rank'] + '</td>';
		row += '</tr>';
		bgclass = !bgclass;
		res += row;
	}
	res += '</table>';
	return res;
}

function tpl_short_outcome(msg)
{
	var outcomes = {
		'Accepted' : 'AC',
		'Wrong answer' : 'WA',
		'Time limit exceeded' : 'TL',
		'Memory limit exceeded' : 'ML',
		'Presentation error' : 'PE',
		'Runtime error' : 'RE',
		'Compilation error' : 'CE',
		'Security violation' : 'SV'
	};
	if (msg['text'] || !outcomes[msg['result']])
	{
		return '[!]';
	}
	var res = '[';
	res += outcomes[msg['result']];
	res += (msg['test'] > 0) ? msg['test'] : '';
	res += ']';
	return res;
}

function tpl_message_string(msg)
{
	if (msg['text']) return msg['text'];
	return msg['problem'] + ':' + msg['attempt'] + ' &mdash; ' + tpl_message_outcome(msg);
}

function tpl_message_outcome(msg)
{
 	var res = '';
	var msgclass = (msg['result'] == 'Accepted') ? 'ac' : 're';
	res += '<span class="' + msgclass + '">' + msg['result'] + '</span>';
	res += (msg['test'] > 0 ? ' on test <b>' + msg['test'] + '</b>' : '');
	return res;
}

function tpl_message(key, msg)
{
 	var res = '';
	bgclass1 = !bgclass1;
	bgclass2 = (msg['confirmed'] == 0);
	bgclass = 'alt' + (bgclass1 ? '1' : '2') + (bgclass2 ? 'a' : '');
	res += '<tr class="' + bgclass + '">';
	res += '<td>' + formatDate('H:i:s', msg['time']) + '</td>';
	if (msg['message']['text'])
	{
		res += '<td></td><td></td><td><b>' + msg['message']['text'] + '</b></td>';
	}
	else
	{
		res += '<td>' + msg['message']['problem'] + '</td>';
		res += '<td>' + msg['message']['attempt'] + '</td>';
		res += '<td>' + tpl_message_outcome(msg['message']) + '</td>';
	}
	res += '</tr>';

	return res;
}

function tpl_messages(a)
{
	var res = '';
	bgclass1 = true;
	res += '<table class="tmain" cellspacing="0" style="width: 100%">';
	res += '<tr><th width="64">time</th>';
	res += '<th width="16">P</th><th width="16">N</th>';
	res += '<th style="text-align: left">result</th></tr>';
	res += foreach_tpl(a, tpl_message);
	res += '</table>';
	return res;
}

function tpl_option_language(key, val)
{
	var preferred = (preferences['language'] == key);
	var res = '';
	res += '<option value="';
	res += key;
	res += '"';
	res += preferred ? ' selected="selected">' : '>';
	res += val;
	res += '</option>';
	return res;
}

function tpl_option_problem(key, val)
{
	return '<option value="' + key + '">' + key + ': ' + val + '</option>';
}

function tpl_submit_controls(a)
{
	var res = '';
	if (!a['problems'])
	{
		res += 'problem list not available';
		res += '&nbsp;<input type="button" class="button" value="refresh" onclick="refresh_logindata()" />';
		return res;
	}
	if (session_id)
	{
		res += '<input type="hidden" name="sid" value="' + session_id + '" />';
	}
	res += '<select id="submit_problem" name="problem">';
	res += foreach_tpl(a['problems'], tpl_option_problem);
	res += '</select>';
	res += '<select name="language" onchange="set_preference(\'language\', this.value)">';
	res += foreach_tpl(a['languages'], tpl_option_language);
	res += '</select>';
	res += ' <input type="file" name="srcfile" />';
	res += '';
	res += '&nbsp;<input type="submit" id="submit_button" class="button" value="submit" />';

	return res;
}


function tpl_lastsuccess(a)
{
	if (!a)
	{
		return 'no accepted runs';
	}
	var res = '';
	res += a['team'];
	res += ', ';
	res += a['problemid'];
	res += ': ';
	res += a['problem'];
	res += ', ';
	res += format_time(a['time']);
	return res;
}

var standings = false;
var messages = false;
var logindata = false;
var loggedin = false;
var def_title = document.title;

var st_time_started = 0;
var st_timer = null;

var st_refresh_timeout = null;


var msg_timeout = null;
var msg_refresh_period = 120000;
var confirm_pending = false;
var confirm_msg = null;

var preferences = {
	show_times: true,
	refresh_period: 0,
	language: '',
	style: 'topcoder',
	history: 0
};


var submit_abort_timer = null;
var submit_timeout = 15000;

var submit_pending = false;
var submit_msg_problem = '';
var submit_msg_attempt = 0;
var submit_update_attempts = 0;


function format_time(t)
{
	t = Math.floor(t / 1000);
	var res = '';
	res += Math.floor(t / 60);
	res += ':';
	t %= 60;
	res += padZeros(t, 2);
	return res;
}

function update_timer()
{
	var title = '';
	if (confirm_msg)
	{
		title += tpl_short_outcome(confirm_msg['message']) + ' ';
	}

	if (standings['status'] == 2)
	{
		var t = new Date().getTime() - (standings['timestarted'] * 1000 + timestamp_diff);
		if (t < 0) t = 0;
		if (t >= standings['timetotal'])
		{
			t = standings['timetotal'];
			setContent('contest_status', '[over]');
			setClass('contest_status', 'status4');
		}
		setContent('contest_timenow', format_time(t));
		title += '[' + format_time(t) + '] ';
	}
	else
	{
		setContent('contest_timenow', format_time(standings['timenow']));
	}
	title += def_title;
	document.title = title;
}


function build_history()
{
	var res = [];
	var problems = [];
	for (var i in standings['problems'])
	{
		problems[problems.length] = i;
	}
	for (var i in standings['teams'])
	{
		var team = standings['teams'][i];
		for (var j = 0; j < problems.length; j++)
		{
			var p = problems[j];
			var a = team[j];

			if (!a['success']) continue;
			res[res.length] = {team: team['name'], time: a['time'], problem: p, attempts: a['attempts']};
		}
	}
	res.sort(function(a, b)
	{
		if (a['time'] != b['time'])
		{
			return a['time'] - b['time'];
		}
		return a['name'] < b['name'] ? 1 : -1;
	});
	
	var scores = {};
	for (var i in standings['teams'])
	{
		scores[standings['teams'][i]['name']] = 0;
	}
	for (var i = 0; i < res.length; i++)
	{
		var r = res[i];
		res[i]['old_rank'] = scores[r['team']] == 0 ? '--' : calc_history_rank(scores, r['team']);
		scores[res[i]['team']] += 1000000 - Math.round(r['time'] / 60000) - 20 * (r['attempts'] - 1);
		res[i]['new_rank'] = calc_history_rank(scores, r['team']);
	}

	standings['history'] = res;
}


function calc_history_rank(scores, team)
{
	var score = scores[team];
	var res = 1;
	for (var t in scores)
	{
		if (scores[t] > score) res++;
	}
	return res;
}


function display_standings()
{
	build_history();
	update_standings_style();
	setContent('standings', tpl_standings(standings));
	setContent('history', tpl_history(standings['history']));
	setContent('contest_title', standings['title']);
	setContent('contest_lastsuccess', tpl_lastsuccess(standings['lastsuccess']));
	setContent('contest_lastupdate', formatDate('H:i:s', standings['timestamp'] * 1000));
	setClass('contest_lastupdate', standings['outdated'] ? 're' : 'ac');

	var statuses = ['[unknown]', '[before]', '[running]', '[paused]', '[over]'];
	var status = (standings['status'] > 0 && standings['status'] <= 4) ? standings['status'] : 0;
	setContent('contest_status', statuses[status]);
	setClass('contest_status', 'status' + status);
	setContent('contest_frozen', standings['frozen'] ? '&nbsp;[frozen]' : '');

	setContent('contest_timetotal', format_time(standings['timetotal']));

	if (standings['status'] != 2)
	{
		if (st_timer) clearTimeout(st_timer);
	}
	else
	{
		if (!st_timer)
		{
			st_timer = setInterval(update_timer, 1000);
		}
	}
	update_timer();
}

function display_messages()
{
	if (!loggedin)
	{
		hide('messages_table');
		return;
	}
	show('messages_table');
	setContent('messages', tpl_messages(messages));
}

function display_logindata()
{
	if (!loggedin)
	{
		hide('submit_panel');
		hide('loggedin_form');
		show('login_form');
		setContent('login_text', 'login:');
	}
	else
	{
		show('submit_panel');
		show('loggedin_form');
		hide('login_form');	
		setContent('login_text', 'logged in as:');
		setContent('submit_controls', tpl_submit_controls(logindata));
		setContent('loggedin_name', logindata['name']);
	}
}

function process_standings(data)
{
	set_refresh_period(preferences['refresh_period']);
	setContent('refresh_status', '');
	if (!data)
	{
		setClass('contest_lastupdate', 're');
		return;
	}
	standings = data;
	if (standings['status'] != 1 && loggedin && !logindata['problems'])
	{
		refresh_logindata();
	}
	display_standings();
}

function process_messages(data)
{
	if (data)
	{
		messages = data;
	}
	display_messages();
	if (!loggedin) return;

	check_unconfirmed_messages();

	clearTimeout(msg_timeout);

	if (!submit_pending)
	{
		msg_timeout = setTimeout(refresh_messages, msg_refresh_period);
		return;
	}
	
	var ourmsg = null;
	for (var i in messages)
	{
		var msg = messages[i]['message'];
		if (msg['text']) continue;
		if (msg['problem'] != submit_msg_problem || msg['attempt'] < submit_msg_attempt) continue;
		ourmsg = msg;
		break;
	}

	if (ourmsg == null)
	{
		submit_update_attempts++;
		msg_timeout = setTimeout(refresh_messages, 2000 + submit_update_attempts * 1000);
		addContent('submit_status', '.');
	}
	else
	{
		msg_timeout = setTimeout(refresh_messages, msg_refresh_period);
		submit_pending = false;
		setContent('submit_status', tpl_message_outcome(ourmsg));
		window.focus();
	}
}

function process_logindata(data)
{
	if (!data)
	{
		return;
	}
	logindata = data;
	logindata['id'] = logindata['id'].substring(logindata['contestid'].length + 1);
	display_logindata();
}

function check_unconfirmed_messages()
{
	if (confirm_pending) return;
	hide('confirm_panel');
	for (var i in messages)
	{
		if (messages[i]['confirmed']) continue;
		var msg = messages[i]['message'];
		confirm_pending = true;
		confirm_msg = messages[i];
		show('confirm_panel');
		setContent('confirm_message', tpl_message_string(msg));
		update_timer();
		window.focus();
	}
}

function process_confirm(data)
{
	if (!data)
	{
		setClass('confirm_status', 're');
		setContent('confirm_status', 'connection failed, try again');
		return;
	}
	for (var i in messages)
	{
		if (messages[i]['msgid'] != confirm_msg['msgid']) continue;
		messages[i]['confirmed'] = 1;
	}
	confirm_msg = null;
	confirm_pending = false;
	setContent('confirm_status', '');
	update_timer();
	display_messages();
	check_unconfirmed_messages();
}

function exec_confirm()
{
	load_data('query.php?what=confirm', process_confirm, false, {msgid: confirm_msg['msgid']});
	setClass('confirm_status', 'emp');
	setContent('confirm_status', 'confirming...');
}

function refresh_messages()
{
	load_data('query.php?what=messages', process_messages, false);
}

function refresh_logindata()
{
	load_data('query.php?what=logindata', process_logindata, false);
}

function refresh_standings()
{
	if (st_refresh_timeout) clearTimeout(st_refresh_timeout);
	setContent('refresh_status', 'loading...');
	load_data('query.php?what=standings', process_standings, false);
}

function set_refresh_period(val)
{
	if (st_refresh_timeout) clearTimeout(st_refresh_timeout);
	if (val >= 15)
	{
		st_refresh_timeout = setTimeout(refresh_standings, val * 1000);
	}
}

function update_standings_style()
{
	var res = (preferences['show_times'] == '1') ? 'show_times ' : '';
	res += standings['frozen'] ? ' frozen' : '';
//	res += preferences['show_tc'] ? ' tc' : '';
//	setClass('main', preferences['show_tc'] ? 'tc' : '');
	setClass('standings', res);
}

function set_preference(key, val)
{
	setcookie(key, val);
	preferences[key] = val;
	if (key == 'style')
	{
		var css = val == 'topcoder' ? 'topcoder.css?' : 'style.css?';
		el('altstyle').href = css;
	}
	if (key == 'history')
	{
		setContent('history', tpl_history(standings['history']));
	}
	if (key == 'show_times')
	{
		update_standings_style();
	}
	if (key == 'refresh_period')
	{
		set_refresh_period(val);
	}
}

function process_login(data)
{
	if (!data)
	{
		setContent('login_status', 'connection failed');
		setClass('login_status', 're');
		return;
	}
	if (data == -1)
	{
		setContent('login_status', 'authorization failed');
		setClass('login_status', 're');
		return;
	}
	el('login').value = '';
	el('password').value = '';
	setContent('login_status', '');
	loggedin = true;
	session_id = data['session_id'];
	process_logindata(data['logindata']);
	process_standings(data['standings']);
	process_messages(data['messages']);
}

function exec_login()
{
	setContent('login_status', 'connecting...');
	setClass('login_status', 'emp');
	load_data('query.php?what=login', process_login, false, {
		login: el('login').value,
		password: el('password').value
	});
}

function process_logout(data)
{
	if (!data)
	{
		unsetcookie('s');
		window.location = window.location;
		return;
	}
	loggedin = false;
	setContent('logout_status', '');
	setContent('submit_status', '');
	submit_pending = false;
	clearTimeout(msg_timeout);
	clearTimeout(submit_abort_timer);
	display_logindata();
	display_messages();
	process_standings(data);
}

function exec_logout()
{
	setContent('logout_status', 'logging out...');
	load_data('query.php?what=logout', process_logout, false);
}

function process_submit(code)
{
	el('submit_button').disabled = false;
	clearTimeout(submit_abort_timer);
	var error_msgs = ['',
		'connection error, try again',
		'auth failed, please re-login',
		'error: contest is not running',
		'error: wrong problem',
		'error: wrong language',
		'error: no file uploaded'
	];
	if (code > 0)
	{
		setClass('submit_status', 're');
		setContent('submit_status', error_msgs[code] ? error_msgs[code] : 'unknown error');
		return;
	}
	setClass('submit_status', 'emp');
	setContent('submit_status', 'sent successfully...');

	submit_pending = true;
	submit_msg_problem = el('submit_problem').value;
	submit_msg_attempt = 0;
	for (var i in messages)
	{
		var msg = messages[i]['message'];
		if (msg['problem'] != submit_msg_problem) continue;
		if (submit_msg_attempt < msg['attempt']) submit_msg_attempt = msg['attempt'];
	}
	submit_msg_attempt++;
	submit_update_attempts = 0;
	clearTimeout(msg_timeout);
	msg_timeout = setTimeout(refresh_messages, 2000);
}

function abort_submit()
{
	document.body.innerHTML = document.body.innerHTML;
	process_submit(1);
}

function exec_submit()
{
	setContent('submit_status', 'connecting...');
	setClass('submit_status', 'emp');
	submit_pending = false;
	clearTimeout(msg_timeout);
	clearTimeout(submit_abort_timer);
	submit_abort_timer = setTimeout(abort_submit, submit_timeout);
	return true;
}


function initialize()
{
	for (var key in preferences)
	{
		var val = getcookie(key);
		if (val == null) val = preferences[key];
		set_preference(key, val);
	}
	setTimeout(function(){
		el('show_times').checked = (preferences['show_times'] == '1');
		el('refresh').value = preferences['refresh_period'];
		el('styleselect').value = preferences['style'];
		el('historyselect').value = preferences['history'];
	}, 10);

	process_logindata(logindata);
	process_messages(messages);
	if (standings)
	{
		display_standings();
	}
	else
	{
		refresh_standings();
	}
}
