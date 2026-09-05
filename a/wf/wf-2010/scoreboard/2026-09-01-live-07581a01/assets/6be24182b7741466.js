var standings_url = 'standings.js';

var standings = false;
var def_title = document.title;

var st_time_started = 0;
var st_timer = null;
var st_request = null;

var timestamp_diff = 0;

var st_refresh_timeout = null;

var announce1 = '';
var announce2 = '';

var preferences = {
	show_times: true,
	refresh_period: 60,
	style: 'topcoder',
	history: 0,
	chat: 0,
	username: ''
};

var chat_url = 'chat.js';
var new_chat_messages;
var chat_messages = [];
var chat_message_ids = {};
var chat_request = null;
var chat_refresh_timeout = null;

var version = 332;

var bad_ips = [];

var realtime_enabled = false;
var realtime_cooldown = 1;


function el(elm) {return document.getElementById(elm)}
function show(elm) {if (el(elm)) el(elm).style.display = 'block'}
function hide(elm) {if (el(elm)) el(elm).style.display = 'none'}
function toggle(elm) {if (el(elm)) el(elm).style.display = el(elm).style.display == 'block' ? 'none' : 'block'}
function setClass(elm, name)   {if (el(elm)) el(elm).className = name}
function setContent(elm, text) {if (el(elm)) el(elm).innerHTML = text}
function addContent(elm, text) {if (el(elm)) el(elm).innerHTML += text}
function nl2br(text) {return text.replace(/\n/g, "<br />");}

// ########################
// #### ajax functions ####
// ########################

function urlencode(vars)
{
	var res = '';
	for (var i in vars)
	{
		res += encodeURIComponent(i);
		res += '=';
		res += encodeURIComponent(vars[i]);
		res += '&';
	}
	return res;
}

var lastmodified = {};

function ajax(href, callback, postvars, timeout, nocache)
{
	var req;
	var postdata = '';
	var method = "get";
	timeout = (timeout || 35) * 1000;
	if (postvars)
	{
		method = "post";
		postdata = urlencode(postvars);
	}
	if (window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if (!req)
	{
		return false;
	}

	req.onreadystatechange = function(){
		try {		
			if (req.readyState != 4)
			{
				callback(null, 'loading', req);
				return;
			}
			if (req.status == 304)
			{
				callback(null, 'notmodified', req);
				return;
			}
			if ((req.status == 403 || req.status == 404) && realtime_enabled)
			{
				// gracefully degrade if fairy daemon fails
				set_preference('refresh_period', 5);
			}
			if (req.status != 200)
			{
				callback(null, req.status ? 'error' : 'timeout', req);
				return;
			}
			lastmodified[href] = req.getResponseHeader('Last-Modified');
			callback(req.responseText, 'ok', req);
		}
		catch (e) {
			callback(null, 'error', req, e);
		}
	};
	try {
		req.open(method, href, true);
	} catch(e) {
		callback(null, 'error', req, e);
	}
	if (method == "post")
	{
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(postdata);
	}
	else
	{
		if (lastmodified[href])
		{
			req.setRequestHeader('If-Modified-Since', lastmodified[href]);
		}
		else
		{
			req.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
		}
		req.send(null);
	}

	
	setTimeout(function() {
		try {
			if (req.readyState == 4) return;
			req.abort();
		} catch(e) {}
	}, timeout);

	return req;
}

// #################
// #### cookies ####
// #################

function setcookie(name, value, days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
}

function getcookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++)
	{
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

function unsetcookie(name)
{
	setcookie(name, "", -1);
}

// #####################
// #### other stuff ####
// #####################

function padZeros(a, width)
{
	var l = width - a.toString().length;
	for (; l > 0; l--)
	{
		a = '0' + a;
	}
	return a;
}

function formatDate(s, d)
{
	if (typeof(d) == 'undefined')
	{
		d = new Date();
	}
	if (typeof d != 'object')
	{
		d = new Date(d);
	}
	s = s.replace('Y', d.getFullYear());
	s = s.replace('m', padZeros(d.getMonth() + 1, 2));
	s = s.replace('d', padZeros(d.getDate(), 2));
	s = s.replace('H', padZeros(d.getHours(), 2));
	s = s.replace('i', padZeros(d.getMinutes(), 2));
	s = s.replace('s', padZeros(d.getSeconds(), 2));
	return s;
}

function var_dump(v, maxlevel, level)
{
	if (typeof v == 'function') return "function";
	if (typeof v != 'object') return v;
	if (!maxlevel) maxlevel = 1;
	if (!level) level = 0;
	if (level > maxlevel) return "TOOMANY";
	var indent = "";
	for (var i = 0; i < level; i++) indent += "&nbsp;&nbsp;&nbsp;&nbsp;";
	var res = "";
	for (var key in v)
	{
		if (key == 'innerHTML' || key == 'innerText') continue;
		res += indent + "&nbsp;&nbsp;&nbsp;&nbsp;[" + key + "] => ";
		try
		{
			var t = var_dump(v[key], maxlevel, level + 1);
			res += t;
		}
		catch(e)
		{
			res += "error";
		}
		res += "\n";
	}
	return res ? "array {\n" + res + indent + "}" : "array {}";
}

function dbg(s, l)
{
	if (typeof s == 'object')
	{
		s = var_dump(s, l);
	}
	if (!document.getElementById('js_debug'))
	{
		var e = document.createElement('pre');
		e.id = 'js_debug';
		document.body.appendChild(e);
	}
	document.getElementById('js_debug').style.display = 'block';
	document.getElementById('js_debug').innerHTML += nl2br(s + "\n");
}





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
	if (key == 'id' || key == 'name' || key == 'score' || key == 'time' || key == 'tc') return '';
	if (val['p'])
	{
		return '<td class="unk">?' + (val['a'] > 0 ? ' (-' + val['a'] + ')' : '')+  '</td>';
	}
	if (val['a'] == 0)
	{
		return '<td class="emp">.</td>';
	}
	if (val['s'] == 0)
	{
		return '<td class="re">-' + val['a'] + '</td>';
	}
	var age = standings['timenow'] - val['t'];
	var tdclass = 'ac';
	if (age < 300000) tdclass += ' last5';
	else if (age < 600000) tdclass += ' last10';
	else if (age < 900000) tdclass += ' last15';
	return '<td class="' + tdclass + '">+'
		+ (val['a'] > 1 ? val['a'] - 1 : '')
		+ '<dfn>' + format_time(val['t']) + '</dfn>'
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
	res += '<span class="name">' + val['name'] + '</span>';
	if (val['tc']) res += '<span class="tc_name">: ' + val['tc'] + '</span>';
	res += '</td>';
	res += foreach_tpl(val, tpl_standings_cell);
	res += '<td width="25">' + val['score'] + '</td><td>' + val['time'] + '</td>';
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

function tpl_chat(a)
{
	if (!a) return '';
	var res = '';
	res += '<table cellspacing="0" style="width: 100%">';
	var rows = '';
	bgclass = false;
	for (var i = 0; i < a.length; i++)
	{
		var r = a[i];
		var u = r['u'] + '&gt; ';
		if (r['ip']) {
			var ips = r['ip'].split('\.');
			var ip = ips[0] + '.' + ips[1] + '.' + ips[2];
			if (bad_ips.indexOf(ip) != -1) continue;
//			u = '<span title="IP: ' + r['ip'] + '">' + u + '</span>';
		}
		if (r['c']) {
			u = '<span class="coderText' + r['c'] + '">' + u + '</span>';
		}
		var row = '';
		row += '<tr class="alt2">';
		row += '<td width="60">(' + formatDate('H:i:s', r['t'] * 1000 + timestamp_diff) + ')</td>';
		if (r['u'] == '!') {
			row += '<td class="ac" style="text-align:left" colspan="2">' + r['m'] + '</td>';
		} else {
			row += '<td width="60">' + r['ip'] + '</td>';
			row += '<td>' + u + r['m'] + '</td>';
		}
		row += '</tr>';
		bgclass = !bgclass;
		res += row;
	}
	res += '</table>';
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
	if (a['problem'])
	{
		res += ': ';
		res += a['problem'];
	}
	res += ', ';
	res += format_time(a['time']);
	return res;
}

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
	if (standings['status'] == 2)
	{
		var t = new Date().getTime() - st_time_started;
		if (t < 0) t = 0;
		if (t >= standings['timetotal'])
		{
			t = standings['timetotal'];
			setContent('contest_status', '[over]');
			setClass('contest_status', 'status4');
		}
//		standings['timenow'] = t;
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

			if (!a['s']) continue;
			res[res.length] = {team: team['name'], time: a['t'], problem: p, attempts: a['a']};
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

function display_announces()
{
	if (announce1 || announce2)
	{
		setContent('announce1', announce1);
		setContent('announce2', announce2);
		show('announce');
	}
	else
	{
		hide('announce');
	}
}

function display_chat()
{
	setContent('chat_messages', tpl_chat(chat_messages));
	setTimeout(function() {
		el('chat_messages').scrollTop = 100500;
	}, 10);
}

function display_standings()
{
	build_history();
	update_standings_style();
	setContent('standings', tpl_standings(standings));
	setContent('history', tpl_history(standings['history']));
	setContent('contest_title', standings['title']);
	setContent('contest_lastsuccess', tpl_lastsuccess(standings['lastsuccess']));
	setContent('contest_lastupdate', formatDate('H:i:s', standings['timestamp'] * 1000 + timestamp_diff));
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
		st_time_started = standings['timestarted'] + timestamp_diff;
		if (!st_timer)
		{
			st_timer = setInterval(update_timer, 1000);
		}
	}
	update_timer();
	display_announces();
}

function process_standings(data, status)
{
	if (status == 'loading')
	{
		setContent('refresh_status', 'loading...');
		return;
	}
	st_request = null;
	schedule_standings_refresh(preferences['refresh_period']);
	if (status == 'notmodified')
	{
		setContent('refresh_status', '');
		return;
	}
	if (!data)
	{
		setContent('refresh_status', '');
		setClass('contest_lastupdate', 're');
		return;
	}
	setContent('refresh_status', '');
	eval(data);
	display_standings();
}

function refresh_standings()
{
	schedule_standings_refresh(0);
	setContent('refresh_status', 'connecting...');
	st_request = ajax(realtime_enabled ? realtime_standings_url : standings_url, process_standings);
}

function schedule_standings_refresh(val)
{
	if (st_request) st_request.abort();
	if (st_refresh_timeout) clearTimeout(st_refresh_timeout);

	if (val == -1) {
		st_refresh_timeout = setTimeout(refresh_standings, realtime_cooldown * 1000);
	} else if (val >= 5) {
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
		var css = val == 'topcoder' ? 'topcoder.css' : 'style.css';
		if (el('style') && el('style').href != css) el('style').href = css;
	}
	if (key == 'history')
	{
		setContent('history', tpl_history(standings['history']));
	}
	if (key == 'show_times')
	{
		update_standings_style();
	}
	if (key == 'chat')
	{
		update_chat_setting(val);
		refresh_chat();
	}
	if (key == 'refresh_period')
	{
		realtime_enabled = val == -1;
		schedule_standings_refresh(val);
		schedule_chat_refresh(val);
	}
}


function send_chat()
{
	var username = el('chat_username').value;
	var message = el('chat_message').value;
	if (username != preferences['username']) {
		set_preference('username', username);
	}
	schedule_chat_refresh(0);
	ajax('chat.php', function(data, status) {
		process_chat(data, status);
		if (data) {
			el('chat_message').value = '';
		}
	}, {username: username, message: message});
}

function process_chat(data, status)
{
	if (status == 'loading') return;
	chat_request = null;
	schedule_chat_refresh(preferences['refresh_period']);
	if (status != 'ok') {
		return;
	}
	new_chat_messages = [];
	eval(data);
	merge_chat_messages();
	display_chat();
}

function merge_chat_messages()
{
	for (var i in new_chat_messages) {
		var msg = new_chat_messages[i]
		if (chat_message_ids[msg['i']]) continue;
		chat_message_ids[msg['i']] = 1;
		chat_messages[chat_messages.length] = msg;
	}
}

function update_chat_setting(val)
{
	if (val == 2) {
		show('chat');
	} else {
		hide('chat');
	}
}

function refresh_chat()
{
	schedule_chat_refresh(0);
	if (preferences.chat == 0) return;
	chat_request = ajax(realtime_enabled ? realtime_chat_url : chat_url, process_chat);
}

function schedule_chat_refresh(val)
{
	if (chat_request) chat_request.abort();
	if (chat_refresh_timeout) clearTimeout(chat_refresh_timeout);

	if (val == -1) {
		chat_refresh_timeout = setTimeout(refresh_chat, realtime_cooldown * 1000);
	}

	if (val >= 5) {
		chat_refresh_timeout = setTimeout(refresh_chat, val * 1000);
	}	
}

function initialize()
{
	for (var key in preferences)
	{
		var val = getcookie(key);
		if (val == null) val = preferences[key];
		set_preference(key, val);
	}
	if (!preferences['username'])
	{
		set_preference('username', 'guest' + Math.round(Math.random() * 10000));
	}
	setTimeout(function() {
		el('show_times').checked = (preferences['show_times'] == '1');
		el('refresh').value = preferences['refresh_period'];
		el('styleselect').value = preferences['style'];
		el('historyselect').value = preferences['history'];
		el('chatselect').value = preferences['chat'];
		el('chat_username').value = preferences['username'];
	}, 10);

	if (standings)
	{
		display_standings();
	}
	else
	{
		refresh_standings();
	}
	if (new_chat_messages)
	{
		merge_chat_messages();
		display_chat();
	}
}


