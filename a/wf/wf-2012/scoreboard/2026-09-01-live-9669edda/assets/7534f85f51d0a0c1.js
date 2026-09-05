$ = function(e) {return document.getElementById(e.substr(1))}

$.bind = function(e, event, func) {e['on' + event] = func;}

$.addClass = function(e, name) {if ($(e)) $(e).className += ' ' + name}
$.removeClass = function (e, name)
{
	e = $(e);
	if (!e) return;
	e.className = e.className.replace(new RegExp("(^| )" + name + "( |$)"), '');
}


$.preferences = {};
$.version = '201205171037';

$.preference = function(key, value)
{
	if (typeof value == 'undefined') {
		if (!$.preferences[key]) return '';
		return $.preferences[key].value;
	}
	var pref = $.preferences[key];
	var old_value = pref.value;
	pref.value = value;
	$.cookie(key, value || null);
	if (pref.callback) {
		pref.callback(value, old_value, key);
	}
}

$.preference.setup = function(key, default_value, callback, element)
{
	var value = $.cookie(key);
	if (value === null) value = default_value;
	$.preferences[key] = {
		value: value,
		callback: callback,
		element: element
	};
	if (element) {
		if (element.tagName == 'INPUT' && element.type == 'checkbox') {
			$.bind(element, 'change', function() {$.preference(key, this.checked ? this.value : '')});
			element.checked = value ? 'checked' : '';
		} else {
			$.bind(element, 'change', function() {$.preference(key, this.value)});
			element.value = value;
		}
	}
	if (callback) {
		callback(value, null, key);
	}
}

$.cookie = function(name, value, session)
{
	if (typeof value != 'undefined') {
		var expires = "";
		var days = value === null ? -1 : 180;
		if (!session) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		}
		document.cookie = name + "=" + encodeURIComponent(value) + expires;
	} else {
		var cookies = document.cookie.split('; ');
		for (var i = 0; i < cookies.length; i++) {
			var c = cookies[i].split('=');
			if (c[0] == name) return decodeURIComponent(c[1]);
		}
		return null;
	}
};

$.ajax = function(href, callback, postvars, timeout, lastModified)
{
	var req;
	var postdata = '';
	var method = "get";
	timeout = (timeout || 60) * 1000;
	if (postvars) {
		method = "post";
		for (var i in postvars) {
			postdata += encodeURIComponent(i) + '=' + encodeURIComponent(postvars[i]) + '&';
		}
	}
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	if (!req) {
		return false;
	}

	req.onreadystatechange = function() {
		var done = false;
		try {		
			if (req.readyState != 4) {
				return;
			} else if (req.status == 304) {
				callback(null, 'notmodified', req);
			} else if (req.status != 200) {
				callback(null, req.status ? 'error' : 'timeout', req);
			} else {
				done = true;
			}
		}
		catch (e) {
			callback(null, 'error', req, e);
		}
		if (done) {
			callback(req.responseText, 'ok', req);
		}
	};
	try {
		req.open(method, href, true);
	} catch(e) {
		callback(null, 'error', req, e);
	}

	if (method == "post") {
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		req.send(postdata);
	} else {
		if (lastModified) {
			req.setRequestHeader('If-Modified-Since', lastModified);
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


$.channels = {};

$.channel = function(name, callback, error_callback, reload_callback)
{
	if (!callback) {
		return this.channels[name];
	}
	var channel = {
		name: name,
		callback: callback,
		error_callback: error_callback,
		reload_callback: reload_callback,
		lastModified: "Sat, 1 Jan 2000 00:00:00 GMT",
		interval: null,
		xhr: null,
		aborting: false,
		timer: null,
		_xhr_callback: function(res, status, xhr) {
			if (status == 'notmodified') {
				this.restart();
				return;
			}
			if (status == 'error' || status == 'timeout') {
				if (this.aborting) return;
				this.restart();
				
				if (status == 'error' && this.interval == -1) this.interval = 5;
				if (this.error_callback) {
					this.error_callback(res, status, xhr);
				}
				return;
			}

			if (this.interval == -1) {
				this.lastModified = xhr.getResponseHeader('Last-Modified');
			}
			var data = null;
			eval(res);
			this.callback(data);

			this.restart();
		},
		abort: function() {
			if (this.timer) clearTimeout(this.timer);
			if (!this.xhr || this.xhr.readyState == 4) return;
			this.aborting = true;
			this.xhr.abort();
			var self = this;
			setTimeout(function() {self.aborting = false}, 10);
		},
		restart: function() {
			this.abort();
			if (!this.interval) return;
			var interval = this.interval == -1 ? 1 : this.interval;
			var self = this;
			this.timer = setTimeout(function() {self.refresh()}, interval * 1000);
		},
		refresh: function(force) {
			this.abort();
			var realtime = this.interval == -1;
			if (this.reload_callback) {
				this.reload_callback();
			}
			var self = this;
			this.xhr = $.ajax(
				realtime ? '/fairy/' + name + '.js' : name + '.js',
				function(){self._xhr_callback.apply(self, arguments)},
				null,
				realtime ? 45 : 5,
				realtime ? this.lastModified : null
			);
		},
		setInterval: function(interval) {
			this.interval = interval;
			this.restart();
		}
	};
	$.channels[name] = channel;
	return channel;
}


$.reduce = function(arr, func, sep)
{
	var res = '';
	sep = sep || '';
	var first = true;
	if (typeof arr != 'object') return '';
	for (var i in arr) {
		if (!first) res += sep;
		first = false;
		res += func(arr[i], i);
	}
	return res;
}


$.favorites = {
	selected: {},
	count: 0,
	normalizeName: function(name) {
		return name.replace(/[^a-zA-Z]/g, '').replace(/([A-Z][a-z]{2})[a-z]*/g, '$1');
	},
	toggle: function(elm) {
		var name = this.normalizeName(elm.parentNode.childNodes[0].innerHTML);
		if (this.selected[name]) {
			delete this.selected[name];
			this.count--;
		} else {
			this.selected[name] = true;
			this.count++;
		}
		this.save();
		$.standings.renderTable();
	},
	contains: function(name) {
		return !!this.selected[this.normalizeName(name)];
	},
	save: function() {
		var str = '';
		for (var name in this.selected) {
			str += name + '|';
		}
		$.cookie('favorites', str.substr(0, str.length - 1));
	},
	load: function() {
		var cookie = $.cookie('favorites');
		if (!cookie) return
		var data = cookie.split("|");
		if (!data.length) return;
		for (var i = 0; i < data.length; i++) {
			this.selected[data[i]] = true;
		}
	}
};


$.standings = {
	data : null,
	original_title: document.title,
	timestarted: null,
	timer: null,
	update: function(data) {
		var old_data = this.data;

		this.data = data;

		$('#motd').innerHTML = data.motd || '';
		if (!data.teams) {
			$('#standings').innerHTML = '<h2>standings are not available</h2>';
			if (this.timer) clearInterval(this.timer);
			return;
		}

		if (data.client_version > $.version) {
			setTimeout(function() {
				window.location = window.location;
			}, 10000 * Math.random());
		}
		this.renderTable();
		var was_running = old_data && (old_data.status == 2 || old_data.status == 1);
		var now_running = data.status == 2 || data.status == 1;
		var new_timestarted = (new Date()).getTime() - data.timenow * 1000;
		if (!this.timestarted || !old_data || old_data.status != data.status) {
			this.timestarted = new_timestarted;
		} else {
			this.timestarted = Math.min(this.timestarted, new_timestarted);
		}
		
		if (!old_data || old_data.status != data.status || old_data.timetotal != data.timetotal) {
			if (this.timer) clearInterval(this.timer);
			if (now_running) {
				var self = this;
				this.timer = setInterval(function() {self.renderStatus()}, 250);
			}
			this.renderStatus();
		}	

		$('#contest_lastupdate').className = 'ac';
		$('#contest_lastupdate').innerHTML = (new Date(data.timestamp * 1000)).toTimeString().substr(0, 8);
		if (data.frozen) {
			$.addClass('#standings', 'frozen');
			$.addClass('#contest_status', 'frozen');
		} else {
			$.removeClass('#standings', 'frozen');
			$.removeClass('#contest_status', 'frozen');
		}
	},
	renderStatus: function() {
		var title = this.original_title;
		var data = this.data;
		var timenow = data.timenow * 1000;
		var timetotal = data.timetotal * 1000;
		var status = data.status;
		var timeString = '';
		var timeTotalString = '';
		var statusString = '';
		if (status == 1)
		{
			timenow = this.timestarted - new Date().getTime();
			if (timenow < 0) timenow = 0;
			statusString = 'starts in';
			timeString = this.formatTime(timenow);
		}
		if (status == 2)
		{
			timenow = new Date().getTime() - this.timestarted;
			if (timenow < 0) timenow = 0;
			if (timenow >= timetotal)
			{
				timenow = timetotal;
				status = 4;
			}
			timeString = this.formatTime(timenow);
			timeTotalString = ' of ' + this.formatTime(timetotal);
			title = '[' + timeString + '] ' + title;
			// todo: frozen
		}
		if (status == 4)
		{
			timeString = 'over';
			timeTotalString = '';
		}

//		var statuses = ['[unknown]', '[before]', '[running]', '[paused]', '[over]'];
		$('#contest_status_string').innerHTML = statusString;
		$('#contest_timenow').className = 'status' + status;
		$('#contest_timenow').innerHTML = timeString;
		$('#contest_timetotal').innerHTML = timeTotalString;
		document.title = title;		
	},
	renderTable: function() {
		var data = this.data;
		var lastsuccess = null;
		var problemstats = [];
		for (var i = 0; i < data.problems.length; i++) {
			problemstats[problemstats.length++] = [0, 0];
		}

		for (var i = 0; i < data.teams.length; i++) {
			var team = data.teams[i];
			for (var j = 0; j < team[4].length; j++) {
				var mark = team[4][j];
				if (!mark) continue;
				var t = mark.split(' ');
				var attempts = parseInt(t[1]);
				var time = parseInt(t[2]);
				problemstats[j][1] += attempts;
				if (t[0] == '+') {
					problemstats[j][0] += 1;
					if (!lastsuccess || lastsuccess[2] < time) {
						lastsuccess = [team[0], data.problems[j], time];
					}
				}
			}
		}
//		if (lastsuccess) {
//			$('#contest_lastsuccess').innerHTML = $.reduce(lastsuccess, function(x) {return x}, ', ') + ':00';
//		} else {
//			$('#contest_lastsuccess').innerHTML = 'no accepted runs';
//		}
		var res = '';
		res += '<table id="standings_table" style="width: 100%" cellpadding="1" cellspacing="0" style="border: none">';
		res += '<tbody><tr>';
		res += '<th width="32">rank</th>';
		res += '<th style="text-align: left">team</th>';
		res += $.reduce(data.problems, function(val, i) {
			var ps = problemstats[i];
			return '<th width="35" title="'
			+ ps[0] + ' correct attempt' + (ps[0] == 1 ? '' : 's') + ' out of ' + ps[1]
			+ '">' + val + ' <dfn>'
			+ ps[0] + '/' + ps[1]
			+ '</dfn></th>';
		});
		res += '<th width="16" style="text-align: left; padding-left:0">=</th><th width="32" style="text-align: left; padding-left:0">time</th>';
		res += '</tr></tbody>';
		
		var rank = 0;
		var lastscore = -1;
		var lasttime = 0;
		var lastrank = 0;
		var bgclass1 = 0;
		var bgclass2 = 0;
		var favTeams = [];
		var otherTeams = [];
		for (var i in data.teams) {
			var team = data.teams[i];
			rank++;
			var name = team[0], users = team[1], score = team[2], time = team[3], marks = team[4];
			if (lastscore != score || lasttime != time)
			{
				lasttime = time;
				lastrank = rank;
			}
			if (lastscore != score)
			{
				lastscore = score;
				bgclass2 = !bgclass2;
			}
			team.favorite = $.favorites.contains(name);
			bgclass1 = !bgclass1;
			team.bgclass = 'alt' + (bgclass1 ? '1' : '2') + (bgclass2 ? 'a' : '') + (team.favorite ? ' favorite' : '');
			team.rank = lastrank;
			var list = team.favorite ? favTeams : otherTeams;
			list[list.length++] = team;
		}

		if (favTeams.length) {
			res += '<tbody class="favorites">' + $.reduce(favTeams, this.renderTeam) + '<tr><th colspan="99">&nbsp;</th></tr></tbody>';
		}
		res += '<tbody>' + $.reduce(data.teams, this.renderTeam) + '</tbody>';
		res += '</table>';
		$('#standings').innerHTML = res;
	},
	renderTeam: function(team) {
		var name = team[0], users = team[1], score = team[2], time = team[3], marks = team[4];
		var html = '';
		html += '<tr class="' + team.bgclass + '">'
		html += '<td class="emp">' + team.rank + '</td>';
		html += '<td style="padding-left: 10px">';
		html += '<span class="name">' + name + '</span>';
		if (users.length) {
			html += '<span class="users">: ' + $.reduce(users, function(x){return $.standings.formatUser(x)}, ', ') + '</span>';
		}
		html += ' <span class="mark" onclick="$.favorites.toggle(this)"></span></td>';
		html += $.reduce(marks, function(val) {
			if (!val) {
				return '<td class="emp">.</td>';
			}
			var t = val.split(' ');
			if (t[0] == '+') {
				return '<td class="ac">+' + (t[1] > 1 ? t[1] - 1 : '') + ' <dfn>' + t[2] + ':00</dfn></td>';
			}
			if (t[0] == '?') {
				return '<td class="unk">?' + (t[2] > 1 ? t[2] : '') + (t[1] > 0 ? ' (-' + t[1] + ')' : '')+  '</td>';
			}
			if (t[0] == '-') {
				return '<td class="re">-' + t[1] + '</td>';
			}
		});
		html += '<td width="25">' + score + '</td><td>' + time + '</td>';
		html += '</tr>';
		return html;
	},
	formatUser: function(str, suffix) {
		suffix = suffix || '';
		var t = str.split(" ");
		if (t.length == 1) return str + suffix;
		var r = parseInt(t[2]);
		var color;
		if (r >= 2200) color = 'red';
		else if (r >= 1500) color = 'yellow';
		else if (r >= 1200) color = 'blue';
		else if (r >= 900) color = 'green';
		else if (r > 0) color = 'gray';
		else if (r == -1) color = 'orange';
		else return 'black';
		return '<a class="user ' + color + '" href="http://www.topcoder.com/tc?module=MemberProfile&cr=' + t[1] + '">' + t[0] + suffix + '</a>';
	},
	formatTime: function(t)
	{
		t = Math.floor(t / 1000);
		var res = '';
		res += Math.floor(t / 60);
		res += ':';
		t %= 60;
		if (t < 10) t = '0' + t;
		res += t;
		return res;
	}
}

$.chat = {
	enabled: false,
	messages: [],
	loggedin: false,
	isAdmin: false,
	last_id: 0,
	sid: null,
	uid: null,
	users: {},
	applyPrefs: function () {
		var c = '';
		if (this.loggedin) c += 'loggedin ';
		if (!$.preference('show_guests')) c += 'hide_guests ';
		if (!$.preference('show_system')) c += 'hide_system ';
		if (!$.preference('show_en')) c += 'hide_en ';
		if (!$.preference('show_ru')) c += 'hide_ru ';
		if (!$.preference('show_cn')) c += 'hide_cn ';
		if (!$.preference('show_other')) c += 'hide_other ';
		$('#chat').className = c;
		this.fixScroll();
	},
	insertName: function (name) {
		if (!name) return;
		var el = $('#chat_message');
		el.value = name + ': ' + el.value.replace(/^\w+: /, '');
		el.focus();
	},
	fixScroll: function() {
		$('#chat_messages').scrollTop = 10050000;
	},
	appendMessage: function(msg) {
		var user = msg[3] + '&gt;';
		var username = msg[3];
		var text = msg[4];
		var lang = (/[\u0400-\u04FF]/.test(msg[4]) ? 'ru' :
			(/[\u4E00-\uFA29\uE7C7-\uE7F3]/.test(msg[4]) ? 'cn' : 
			(/[^\x00-\x7f]/.test(msg[4]) ? 'other' : 'en')
		));
		var c = (!msg[2] ? 'guest ' : '') + lang;
		if (msg[2] == 1) {
			user = $.standings.formatUser(msg[3], '&gt;');
			username = msg[3].substr(0, msg[3].indexOf(' '));
		} else if (msg[2] == 2) {
			if (!this.isAdmin) return null;
			user = username = '';
			text = $.standings.formatUser(msg[3]) + ' joined the spectators';
		} else if (msg[2] == 3) {
			user = username = '';
			c = 'system';
		}

		var li = document.createElement('LI');
		li.className = c;
		li.innerHTML = '<div class="time">(' + (new Date(msg[0])).toTimeString().substr(0, 8) + ')</div>'
		+ '<div class="message">'
		+ '<span class="user" onclick="$.chat.insertName(\'' + username + '\'); if (event) event.preventDefault();">' + user + '</span> '
		+ text
		+ (this.isAdmin ? '<span class="uid"> ' + msg[1] + '</span>' : '')
		+ '</div>';
		$('#chat_messages').appendChild(li);
		return li;
	},
	processMessages: function(msgs) {
		var new_messages = false;
		var new_users = false;
		for (var i = 0; i < msgs.length; i++) {
			var msg = msgs[i];
			if (msg[0] <= this.last_id) continue;
			this.last_id = msg[0];
			this.messages[this.messages.length++] = msg;
			
			if (msg[2] == 2) {
				new_users = true;
				this.users[msg[3]] = 1;
				if (msg[1] == this.uid) {
					this.processLogin(msg[3]);
				}
			}
			var li = this.appendMessage(msg);
			if (li) {
				new_messages = true;
			}
		}
		if (new_messages) {
			this.fixScroll();
		}
		if (new_users) {
			this.renderUsers();
		}
	},
	processLogin: function(user) {
		if (!user) return;
		this.loggedin = true;
		$('#login_username').innerHTML = 'logged in as ' + $.standings.formatUser(user);
		this.applyPrefs();
	},
	update: function(data) {
		this.processMessages(data.messages);
	},
	sendMessage: function() {
		var username = $('#chat_username').value;
		var message = $('#chat_message').value;
		$('#chat_error').innerHTML = '';
		var self = this;
		$.ajax('chat', function (res, status, xhr) {
			if (status == 'error' || status == 'timeout') {
				$('#chat_error').innerHTML = 'connection error';
				return;
			}
			var data = {};
			eval(res);

			if (data.ok) {
				if (data.ok == 2) {
					self.appendMessage([
						(new Date()).getTime(),
						this.uid, 0,
						$('#chat_username').value,
						$('#chat_message').value
					]);
					self.fixScroll();
				}
				$('#chat_message').value = '';
			}
			if (data.error) {
				$('#chat_error').innerHTML = data.error;
				return;
			}
			if (!data.ok) {
				$('#chat_error').innerHTML = 'connection error';
				return;
			}
			if (data.messages) {
				self.processMessages(data.messages);
			}
		}, {username: username, message: message});
	},
	renderUsers: function() {
		var count = 0;
		var users = [];
		for (var user in this.users) {
			count += 1;
			users[users.length++] = user;
		}
		users.sort(function(a, b) {
			a = a.toLowerCase();
			b = b.toLowerCase();
			return a < b ? -1 : 1;
		});
		var html = $.reduce(users, function(u) {return '<li>' + $.standings.formatUser(u) + '</li>'});
		$('#users_count').innerHTML = count;
		$('#userlist').innerHTML = html;
	},
	init: function(data) {
		this.enabled = true;
		this.loggedin = false;
		this.uid = data.uid;
		this.sid = data.sid;
		this.isAdmin = data.admin;
		this.processMessages(data.messages);
		$('#sid').innerHTML = data.sid;
		var username = $.cookie('chat_username') || ('guest' + (""+this.uid).substr(0, 4));
		$('#chat_username').value = username;
		if (data.user) {
			this.processLogin(data.user);
		}
		for (var i = 0; i < data.users.length; i++) {
			this.users[data.users[i]] = 1;
		}
		$.channel('chat').setInterval(parseInt($.preference('update')));
		this.applyPrefs();
		this.renderUsers();
	},
	leave: function(data) {
		if (!this.enabled) return;
		this.enabled = false;
		$.channel('chat').setInterval(0);
	}
}


function init()
{
	$.channel('standings', function(data) {
		$.standings.update(data);
		$('#refresh_status').innerHTML = '';
	}, function() {
		$('#contest_lastupdate').className = 're';
		$('#refresh_status').innerHTML = 'error';
	}, function() {
		if (this.interval != -1) {
			$('#refresh_status').innerHTML = 'loading...';
		} else {
			$('#refresh_status').innerHTML = 'waiting...';
		}
	});
	
	$.channel('chat', function(data) {
		$.chat.update(data);
	});
	
	function updateInterval(val) {
		$.channel('standings').setInterval(parseInt(val));
		if ($.chat.enabled) {
			$.channel('chat').setInterval(parseInt(val));
		}
	}
	function forceRefresh() {
		$.channel('standings').refresh();
		if ($.chat.enabled) {
			$.channel('chat').refresh();
		}
	}
	function updateShowTimes(val) {
		if (val) {
			$.addClass('#standings', 'show_times');
		} else {
			$.removeClass('#standings', 'show_times');
		}
	}
	function updateStyle(val) {
		$('#style').href = val + '.css';
	}
	
	function enterChat() {
		$('#chat_controls').className = 'loading';
		$('#chat_enter_status').innerHTML = 'loading...';
		$.ajax('chat', function(res, status, xhr) {
			if (status == 'error' || status == 'timeout') {
				$('#chat_controls').className = '';
				$('#chat_enter_status').innerHTML = 'connection error';
				return;
			}
			var data;
			eval(res);
			if (!data || !data.enabled) {
				$('#chat_controls').className = 'disabled';
				$('#chat_enter_status').innerHTML = 'chat is disabled';
				return;
			}
			$('#chat_enter_status').innerHTML = '';
			$('#chat_controls').className = 'enabled';
			$('#chat').style.display = 'block';
			$.chat.init(data);
		});
	}
	
	function leaveChat() {
		$('#chat_controls').className = '';
		$('#chat').style.display = 'none';
		$.chat.leave();
	}

	$.preference.setup('update', '0', updateInterval, $('#update'));
	$.preference.setup('show_times', '', updateShowTimes, $('#show_times'));
//	$.preference.setup('style', 'topcoder', updateStyle, $('#styleselect'));
	$.bind($('#refresh'), 'click', forceRefresh);

	$.preference.setup('show_guests', '1', function(){$.chat.applyPrefs()}, $('#show_guests'));
	$.preference.setup('show_system', '1', function(){$.chat.applyPrefs()}, $('#show_system'));
	$.preference.setup('show_ru', '1', function(){$.chat.applyPrefs()}, $('#show_ru'));
	$.preference.setup('show_en', '1', function(){$.chat.applyPrefs()}, $('#show_en'));
	$.preference.setup('show_cn', '1', function(){$.chat.applyPrefs()}, $('#show_cn'));
	$.preference.setup('show_other', '1', function(){$.chat.applyPrefs()}, $('#show_other'));
	$.preference.setup('chat', '', function(val){val ? enterChat() : leaveChat()});
	$.bind($('#chat_enter'), 'click', function() {$.preference('chat', '1')});
	$.bind($('#chat_leave'), 'click', function() {$.preference('chat', '')});
	$.bind($('#chat_form'), 'submit', function() {$.chat.sendMessage(); return false;});
	$.favorites.load();
	$.standings.update(data);
}

