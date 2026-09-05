CAcmvis = function() {
	this.adapter = new CAdapter();
	this.model = new CModel(this.adapter);				
	this.model.init();	
	
	this.simpleRanking = function(domElem) {
		var noOfTeams = this.model.teams.getTeams().length;		
		this.ranking = new CRanking(this.model, domElem);
		this.ranking.settings.visibleTeams = noOfTeams;
		this.ranking.settings.taskColWidth = 60;
		this.adapter.settings.downloadEventsAsync = false;
		this.adapter.getEvents();
		this.model.setTime(100000);
		this.model.getEvents();
		this.ranking.init(); 			
		this.ranking.update();						
	};
	
	// dodaje paczki dla kazdego zadania
	this.simpleDonuts = function(domElem) {		
		var l1;
		var that = this;
		var tasks = this.model.tasks.getTasks();		
		this.adapter.settings.downloadEventsAsync = false;
		this.adapter.getEvents();
		this.model.setTime(100000);
		this.model.getEvents();		
		for (var l1 = 0; l1 < tasks.length; l1++) (function(l1) {				
			var donutDOM = $('<div />')
				.addClass('simpleDonut')
				.attr('id', 'simpleDonutId' + l1)
				.appendTo(domElem);
			var donut = new CDonut(this.model, '#simpleDonutId' + l1);			
			donut.settings.textGenerator = that.tasksDonutTextGenerator;
			donut.init();
			donut.update(tasks[l1].statesDist, tasks[l1].shortName);				
		})(l1);			
	};
	
	this.autoDonuts = function(domElemDonut1, domElemDonut2, refreshDelay) {
		var donut1, donut2, timer, that = this;		
		this.adapter = new CAdapter();
		this.model = new CModel(this.adapter);				
		timer = setInterval(function() {
			that.adapter.getEvents();
			that.model.getEvents();
		}, CAcmvis.settings.maxRefreshRate);		
		this.model.init();	
		this.model.setTime(CAcmvis.settings.contestLength);		
		donut1 = new CDonut(this.model, '#donut1');
		donut2 = new CDonut(this.model, '#donut2');					
		donut1.settings.textGenerator = that.tasksDonutTextGenerator;
		donut2.settings.textGenerator = that.tasksDonutTextGenerator;
		var l1 = 0;
		var step = function() {
			var tasks = that.model.tasks.getTasks();
			var l2;
			l1 = (l1 + 2) % tasks.length;
			l2 = (l1 + 1) % tasks.length;
			donut1.update(tasks[l1].statesDist, tasks[l1].shortName);
			donut2.update(tasks[l2].statesDist, tasks[l2].shortName);
		};
		donut1.init();			
		donut2.init();
		step();
		setInterval(step, (!!refreshDelay) ? 6000 : refreshDelay);
	};
	
	this.addFlash = function(domElem, refreshRate) {
		var that = this;
		this.flash = new CFlash(this.model, domElem);
		this.flash.init();
		setInterval(function() {
			that.flash.update();
		}, refreshRate);
	}
	
	this.tasksDonutTextGenerator = function(statesDist, name) {
		var states = CDonut.prototype.settings.states;
		var res, l1, no;
		res = '<span class = "taskName">' + name + '</span>';
		for (l1 = 0; l1 < states.length; l1++) {
			no = 0;
			if (!!statesDist.distribution[states[l1]]) {
				no = statesDist.distribution[states[l1]];
			}
			res += '<span class = "statusName">' + states[l1] + '</span>';
			res += '<span class = "statusNo">' + no + '</span>';
		};
		return res;
	};	
};

CAcmvis.settings = {
	'bombPenalty' : 20 * 60,
	'freezeTime' : 3600 * 4,
	'contestLength' : 3600 * 5,
	'teamsSenderUrl' : 'adapter/teams.php',
	'tasksSenderUrl' : 'adapter/tasks.php',
	'eventsSenderUrl' : 'adapter/events.php',
	'maxRefreshRate' : 1000 // <- ilość milisekund, serwer nie będzie męczony częściej
};
CAcmvis.settings.statesMap = {
	"100" : "AC",
	"-1" : "AC",
	"104" : "RE",
	"101" : "WA",
	"102" : "TL",
	"2" : "CE",
	"-1000" : "??"	
};
CAcmvis.settings.penalties = {
	"AC" : 0,	
	"WA" : 1,
	"TL" : 1,
	"CE" : 0,
	"RE" : 1,
	"??" : 0	
};
CAcmvis.settings.scores = {
	"AC" : 1,	
	"WA" : 0,
	"TL" : 0,
	"CE" : 0,
	"RE" : 0,
	"??" : 0	
};

CAcmvis.settings.teamsSenderUrl = 'adapter/teams.php';
CAcmvis.settings.tasksSenderUrl = 'adapter/tasks.php';
CAcmvis.settings.eventsSenderUrl = 'adapter/events.php'
