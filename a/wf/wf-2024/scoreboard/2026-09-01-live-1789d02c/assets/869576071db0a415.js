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
$.version = '2024091801';
$.storagePrefix = '2024/';

$.preference = function(key, value)
{
	if (typeof value == 'undefined') {
		if (!$.preferences[key]) return '';
		return $.preferences[key].value;
	}
	var pref = $.preferences[key];
	var old_value = pref.value;
	pref.value = value;
	localStorage.setItem($.storagePrefix + key, value || null);
	if (pref.callback) {
		pref.callback(value, old_value, key);
	}
}

$.preference.setup = function(key, default_value, callback, elements)
{
	var value = localStorage.getItem($.storagePrefix + key);
	if (value === null) value = default_value;
	$.preferences[key] = {
		value: value,
		callback: callback,
		elements: elements
	};
	if (elements) {
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (element.tagName == 'INPUT' && (element.type == 'checkbox' || element.type == 'radio')) {
				$.bind(element, 'change', function() {$.preference(key, this.checked ? this.value : '0')});
				if (element.type == 'checkbox') {
					element.checked = value ? 'checked' : '';
				}
				if (element.type == 'radio') {
					element.checked = value == element.value;
				}
			} else {
				$.bind(element, 'change', function() {$.preference(key, this.value)});
				element.value = value;
			}
		}
	}
	if (callback) {
		callback(value, null, key);
	}
}

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


$.what_if = {
	enabled: false,
	marks: {},
	init: function() {
	},
	render: function() {
		$.standings.updateTable();
	},
	enable: function() {
		this.enabled = true;
		this.render();
	},
	disable: function() {
		this.enabled = false;
		this.render();
	},
	set_mark: function(id, p) {
		if (!(id in this.marks)) {
			this.marks[id] = {};
		}
		this.marks[id][p] = true;
	},
	click: function(id, p) {
		if (id in this.marks && p in this.marks[id]) {
			delete this.marks[id][p]
		} else {
			this.set_mark(id, p);
		}
		this.save();
		this.render();
	},
	list: function() {
		var res = [];
		for (var id in this.marks) {
			if (!this.marks.hasOwnProperty(id)) continue;
			for (var p in this.marks[id]) {
				if (!this.marks[id].hasOwnProperty(p)) continue;
				res[res.length++] = [id, p];
			}
		}
		return res;
	},
	save: function() {
		var str = '';
		var marks = this.list();
		for (var i = 0; i < marks.length; i++) {
			str += marks[i][0] + '-' + marks[i][1] + ',';
		}
		localStorage.setItem($.storagePrefix + 'what_ifs', str.substr(0, str.length - 1));
	},
	load: function() {
		var saved = localStorage.getItem($.storagePrefix + 'what_ifs');
		if (!saved) return;
		var data = saved.split(",");
		if (!data.length) return;
		for (var i = 0; i < data.length; i++) {
			var mark = data[i].split("-");
			this.set_mark(parseInt(mark[0]), parseInt(mark[1]));
		}
	}	
};

$.favorites = {
	selected: {},
	count: 0,
	toggle: function(id) {
		if (this.selected[id]) {
			delete this.selected[id];
			this.count--;
		} else {
			this.selected[id] = true;
			this.count++;
		}
		this.save();
		$.standings.renderTable();
	},
	contains: function(id) {
		return !!this.selected[id];
	},
	save: function() {
		var str = '';
		for (var name in this.selected) {
			str += name + '|';
		}
		localStorage.setItem($.storagePrefix + 'favorites', str.substr(0, str.length - 1));
	},
	load: function() {
		var saved = localStorage.getItem($.storagePrefix + 'favorites');
		if (!saved) return;
		var data = saved.split("|");
		if (!data.length) return;
		for (var i = 0; i < data.length; i++) {
			this.selected[data[i]] = true;
		}
	}
};


$.standings = {
	data: null,
	timestarted: null,
	timer: null,
	events_notified: -1,
	init: function(data) {
		this.update(data);
	},
	update: function(data) {
		var old_data = this.data;

		this.data = data;

//		$('#motd').innerHTML = data.motd || '';
		if (!data.status) {
			$('#standings').innerHTML = '<h2>standings are not available</h2>';
			if (this.timer) clearInterval(this.timer);
			return;
		}
		$('#title').innerHTML = data.title;

		if (data.client_version > $.version) {
			setTimeout(function() {
				window.location = window.location;
			}, 10000 * Math.random());
		}
		if (!data.problems) {
			data.problems = [];
		}
		if (!data.events) {
			data.events = [];
		}
		this.updateTable();
		var was_running = old_data && (old_data.status == 2 || old_data.status == 1);
		var now_running = data.status == 2 || data.status == 1;
		var new_timestarted = (new Date()).getTime() - data.timenow * 1000;
		if (!this.timestarted || !old_data || old_data.status != data.status) {
			this.timestarted = new_timestarted;
		} else {
			this.timestarted = Math.min(this.timestarted, new_timestarted);
		}
		if (!old_data && data.status == 1) {
			this.timestarted = (data.timestamp - data.timenow) * 1000;
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
		if (data.status == 4) {
			$.channel('standings').setInterval(data.frozen ? 300 : 0);
		}
		if (data.frozen) {
			document.body.classList.add('frozen');
		} else {
			document.body.classList.remove('frozen');
		}
	},
	renderStatus: function() {
		var data = this.data;
		var title = data.title;
		var timenow = data.timenow * 1000;
		var timetotal = data.timetotal * 1000;
		var status = data.status;
		var timeString = '';
		var timeTotalString = '';
		var statusString = '';
		var ratio = 0;
		if (status == 1)
		{
			timenow = this.timestarted - new Date().getTime();
			if (timenow < 0) timenow = 0;
			statusString = 'starts in';
			timeString = this.formatTime(timenow);	
		}
		if (status == 2 || (status == 4 && $.timeline.active))
		{
			timenow = new Date().getTime() - this.timestarted;
			if (timenow < 0) timenow = 0;
			if (timenow >= timetotal)
			{
				timenow = timetotal;
				status = 4;
			}
			ratio = timenow / timetotal;
			if ($.timeline.active) {
				timenow = timetotal * $.timeline.shown;
				status = 3;
			}
			timeString = this.formatTime(timenow);
			timeTotalString = ' of ' + this.formatTime(timetotal);
			title = '[' + timeString + '] ' + title;
			if (data.frozen) {
				timeTotalString += ' (frozen)';
			}
		}
		if (status == 4)
		{
			timeString = 'contest is over';
			if (data.frozen) {
				timeString += ' (still frozen)';
			}
			timeTotalString = '';
			ratio = 1;
		}
		$.timeline.setElapsedRatio(ratio);
		$('#contest_status_string').innerHTML = statusString;
		$('#contest_timenow').className = 'status' + status;
		$('#contest_timenow').innerHTML = timeString;
		$('#contest_timetotal').innerHTML = timeTotalString;
		document.title = title;		
	},
	updateTable: function() {
		if (!this.data) return;
		var data = this.data;
		var team_count = team_names.length;
		var problem_count = data.problems.length;

		var teams = [];
		teams.length = team_count;
		for (var i = 0; i < team_count; i++) {
			var marks = [];
			marks.length = problem_count;
			for (var j = 0; j < problem_count; j++) {
				marks[j] = '';
			}
			teams[i] = [team_names[i][0], team_names[i][1], 0, 0, marks, i];
		}
		var problem_by_letter = {};
		for (var j = 0; j < data.problems.length; j++) {
			problem_by_letter[data.problems[j]] = j;
		}
		var cutoff = null;
		if ($.timeline.active) {
			cutoff = data.timetotal * $.timeline.shown;
		}
		for (var i = 0; i < data.events.length; i++) {
			var event = data.events[i].split(" ");
			var id = parseInt(event[0]);
			var p = problem_by_letter[event[1]];
			var time = parseInt(event[4]);
			if (cutoff && cutoff < time) continue;
			teams[id][4][p] = event.slice(2).join(" ");
		}
		if ($.what_if.enabled) {
			var marks = $.what_if.list();
			for (var i = 0; i < marks.length; i++) {
				var id = marks[i][0];
				var p = marks[i][1];
				if (id < 0 || id >= team_count) continue;
				if (p < 0 || p >= problem_count) continue;
				var time = this.data.timenow;
				if ($.timeline.active) {
					time = this.data.timetotal * $.timeline.shown;
				}
				var attempts = 1;
				var old_mark = teams[id][4][p];
				if (old_mark && old_mark[0] == '+') continue;
				if (old_mark && old_mark[0] == '*') continue;
				if (old_mark && old_mark[0] == '?') {
					var m = old_mark.split(" ");
					var at = m[1].split("+");
					if (data.show_fail_times) {
						time = parseInt(m[2]);
					}
					attempts = parseInt(at[0]) + parseInt(at[1]);
				}
				if (old_mark && old_mark[0] == '-') {
					attempts = parseInt(old_mark.split(" ")[1]) + 1;
				}
				teams[id][4][p] = "* " + attempts + " " + time;
			}
		}

		for (var i = 0; i < team_count; i++) {
			var team = teams[i];
			for (var j = 0; j < problem_count; j++) {
				var mark = team[4][j].split(" ");
				if (mark[0] != '+' && mark[0] != '*') continue;
				var time = Math.floor(parseInt(mark[2]) / 60);
				var attempts = parseInt(mark[1]);
				team[2] += 1;
				team[3] += time + 20 * (attempts - 1);
			}
		}
		
		teams.sort(function(a, b) {
			if (a[2] != b[2]) return b[2] - a[2];
			if (a[3] != b[3]) return a[3] - b[3];
			return a[0] < b[0] ? -1 : 1;
		});

		data.teams = teams;
		this.renderTable();
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
		var res = '<tr class="sticky"><th colspan="2" class="br"></th>';
		res += $.reduce(data.problems, function(val, i) {
			var ps = problemstats[i];
			return '<th width="35" title="'
			+ ps[0] + ' correct attempt' + (ps[0] == 1 ? '' : 's') + ' out of ' + ps[1]
			+ '">' + val + ' <p>'
			+ ps[0] + '/' + ps[1]
			+ '</p></th>';
		});
		res += '<th class="score" width="40">=</th>';
		res += '</tr>';
		$('#problems').innerHTML = res;
		
		res = '';
		var rank = 0;
		var lastscore = -1;
		var lasttime = 0;
		var lastrank = 0;
		var bgclass1 = 0;
		var bgclass2 = 0;
		var favTeams = [];
		var filteredTeams = [];
		for (var i in data.teams) {
			var team = data.teams[i];
			var name = team[0], users = team[1], score = team[2], time = team[3], marks = team[4], id = team[5];
			rank++;
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
			team.favorite = $.favorites.contains(id);
			bgclass1 = !bgclass1;
			team.bgclass = 'alt' + (bgclass1 ? '1' : '2') + (bgclass2 ? 'a' : '') + (team.favorite ? ' favorite' : '');
			team.rank = data.status != 1 ? lastrank : '';
			if (team.favorite) {
				favTeams[favTeams.length++] = team;
			}
			filteredTeams[filteredTeams.length++] = team;
		}

		if (favTeams.length) {
			$('#favorites').innerHTML = $.reduce(favTeams, this.renderTeam) + '<tr><th colspan="99">&nbsp;</th></tr>';
		} else {
			$('#favorites').innerHTML = '';
		}
		res += $.reduce(filteredTeams, this.renderTeam);
		$('#standings').innerHTML = res;
	},
	renderTeam: function(team) {
		var name = team[0], users = team[1], score = team[2], time = team[3], marks = team[4], id = team[5];
		var html = '';
		html += '<tr class="' + team.bgclass + '">'
		html += '<td class="rank">' + team.rank + '</td>';
		html += '<td class="br">';
		html += '<span class="name">' + name + '</span>';
		if (users.length) {
			html += '<span class="users">: ' + $.reduce(users, function(x){return $.standings.formatUser(x)}, ', ') + '</span>';
		}
		html += '<span class="mark" onclick="$.favorites.toggle(' + id + ')"></span>';
		html += '</td>';
		html += $.reduce(marks, function(val, p) {
			var onclick = $.what_if.enabled ? ' style="cursor: pointer" onclick="$.what_if.click(' + id + ',' + p + ')"': '';
			if (!val) {
				return '<td class="emp"' + onclick +'></td>';
			}
			var t = val.split(' ');
			var time = parseInt(t[2]) * 1000;
			if (t[0] == '+') {
				return '<td class="ok"><b>+' + (t[1] > 1 ? t[1] - 1 : '') + '</b><p>' + $.standings.formatMarkTime(time) + '</p></td>';
			}
			if (t[0] == '*') {
				return '<td class="if"' + onclick + '><b>+' + (t[1] > 1 ? t[1] - 1 : '') + '</b><p>' + $.standings.formatMarkTime(time) + '</p></td>';
			}
			if (t[0] == '?') {
				var at = t[1].split("+");
				return '<td class="unk"' + onclick + '>'
				+ '?' + (at[1] > 1 ? at[1] : '') + (at[0] > 0 ? '<span class="re sm">-' + at[0] + '</span>' : '')
				+ ($.standings.data.show_fail_times ? '<p>' + $.standings.formatMarkTime(time) + '</p>' : '')
				+ '</td>';
			}
			if (t[0] == '-') {
				return '<td class="re"' + onclick + '><i>'
				+ '-' + t[1] + '</i>'
				+ ($.standings.data.show_fail_times ? '<p>' + $.standings.formatMarkTime(time) + '</p>' : '')
				+ '</td>';
			}
		});
		html += '<td class="score">' + score + '<p>' + time + '</p></td>';
		html += '</tr>';
		return html;
	},
	formatUser: function(str, suffix) {
		suffix = suffix || '';
		var t = str.split(":");
		if (t.length == 1) return str + suffix;
		if (t[0] == 'none') return t[1] + suffix;
		return '<a class="user user-' + t[0] + '" href="https://codeforces.com/profile/' + t[1] + '">' + t[1] + suffix + '</a>';
	},
	formatMarkTime: function(t) {
		return Math.floor(t / 60000);
//		return this.formatTime(t);
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
	},
	formatEvent: function(event) {
		var id = parseInt(event[0]);
		var name = team_names[id][0];
		var p = event[1];
		var res = event[2];
		var attempts  = event[3];
		var time = parseInt(event[4]);
		var rank = -1;
		var team;
		for (var i = 0; i < team_names.length; i++) {
			if (this.data.teams[i][5] == id) {
				team = this.data
				rank = i;
				break;
			}
		}
		if (rank == -1) return '';
		if (res == '+') {
			return name + " has solved " + p + " (+"
			+ (attempts > 1 ? attempts - 1 : '') + '/'
			+ this.formatMarkTime(time * 1000) + ", total "
			+ this.data.teams[i][2] + '/' + this.data.teams[i][3] + ', new rank ' + (rank + 1) + ')'
		}
		if (res == '-') {
			return name + " has failed " + p + " (attempt " + attempts + ")";
		}
		if (res == '?') {
			var a = attempts.split("+");
			attempts = parseInt(a[0]) + parseInt(a[1]);
			return name + " has submitted " + p + " (attempt " + attempts + ")";
		}
		return '';
	}
}

$.timeline = {
	active: false,
	shown: 0,
	elapsed: 0,
	element: null,
	drag: null,
	init: function() {
		var self = this;
		self.element = $('#timeline');
		$.bind(self.element, 'mousedown', function(event){self.onmousedown(event)});
		$.bind($('#contest_timenow'), 'click', function(){self.reset()});
	},
	onmouseup: function(event) {
		if (!this.drag) return;
		this.updateDrag();
		$.bind(document.body, 'mouseup', null);
		$.bind(document.body, 'mousemove', null);
		clearInterval(this.drag.timer);
		this.drag = null;
	},
	onmousedown: function(event) {
		var self = this;
		this.drag = {
			clientX: event.clientX,
			layerX: event.layerX,
			lastX: -1,
			curX: event.layerX,
			timer: setInterval(function(){self.updateDrag()}, 100)
		}
		$.bind(document.body, 'mouseup', function(event){self.onmouseup(event)});
		$.bind(document.body, 'mousemove', function(event){self.onmousemove(event)});
	},
	onmousemove: function(event) {
		if (!this.drag) return;
		var dx = event.clientX - this.drag.clientX;
		var x = this.drag.layerX + dx;
		this.drag.curX = x;
	},
	updateDrag: function() {
		var w = this.element.offsetWidth;
		var x = this.drag.curX;
		if (x < 0) x = 0;
		if (x > w) x = w;
		if (x == this.drag.lastX) return;
		this.setShownRatio(x / w);
		this.drag.lastX = x;
	},
	setElapsedRatio: function(p) {
		if (p < 0 || p > 1) return;
		this.elapsed = p;
		this.render();
	},
	reset: function() {
		this.setShownRatio(0);
	},
	setShownRatio: function(p) {
		if (!this.elapsed) return;
		if (p <= 0 || p > this.elapsed) {
			p = 0;
			this.active = false;
		} else {
			this.active = true;
		}
		this.shown = p;
		this.render();
		$.standings.updateTable();
		$.standings.renderStatus();
	},
	render: function() {
		if (!this.elapsed) return;
		var e = this.elapsed * 100;
		$('#timeline_elapsed').style.width = e + '%';
		$('#timeline_shown').style.width = (this.active ? this.shown * 100 : e) + '%';
	}
}


document.addEventListener('DOMContentLoaded', () => {
	$.channel('standings', function(data) {
		$.standings.update(data);
	}, function() {
		$('#contest_lastupdate').className = 're';
	}, function() {
		$('#contest_lastupdate').className = 'unk';
	});
	$.channel('standings').setInterval(5);
	$.favorites.load();
	$.what_if.enable();
	$.what_if.load();
	$.timeline.init();
	$.standings.init(data);
});
