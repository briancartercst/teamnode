//This file sets up the database
//If the database exists, it is removed 
//This allows for a clean db with sample data loaded

var fs = require("fs");
var file = "teamnode.db";
var exists = fs.existsSync(file);

//remove db if exist  
if(exists) {
	try {
		fs.unlinkSync(file);
	} catch (error) {
		console.log('Database file maybe locked.\nClose apps that have it open.\n' + error);
		return;
	}
}

console.log("Init DB file.");

fs.openSync(file, "w");

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

//enable foreign keys for db
db.run('PRAGMA foreign_keys = ON');
		
//add sites
db.serialize(function() {
	var dataSites = [
		["sss", "Sample School Soccer", "Welcome to the Sample School Website.  Choose a team below to get team details."],
		["scs", "Sample Central Soccer", "Welcome to the Sample Central School Website.  Choose a team below to get team details."]		
	];

	db.run('CREATE TABLE sites ( id INTEGER PRIMARY KEY, shorthand TEXT, name TEXT, welcome TEXT )');

	var stmt = db.prepare('INSERT INTO sites (shorthand, name, welcome) VALUES (?, ?, ?)');

    for (i = 0; i < dataSites.length; i += 1) {
		//include i since stmt.run is async and i will update faster than stmts complete
		db.get('SELECT ' + i + ' as i', [], function (error, row) {
			var currentSite = dataSites[row['i']];
			stmt.run(currentSite[0],currentSite[1],currentSite[2], function (err) {
				if(err) {
					console.log('Site add error: ' + err);
				} else {
					console.log('Site Add: ' + currentSite[0]);
				}
			});
		});		
	};	
	
});

//add teams
db.serialize(function() {
	var dataTeams = [
		["sss", "bv", "Boys Varsity", "#31824A", "#ffffff","John Doe","not.real@notreal.ic","<a class=\"maxpreps-widget-link\" data-width=\"1200\" data-height=\"900\" data-type=\"tournament\" data-member-id=\"5c84e3b8-99be-42ac-a048-e011fc2d312e\" data-allow-scrollbar=\"true\" href=\"http:\/\/www.maxpreps.com\/tournament\/view.aspx?tournamentid=f7904f71-a13e-e411-b4d2-002655e6c45a&ssid=f9bafe0d-45cb-4693-aa16-f8766dc2f9fb&bracketid=3e8b7250-3e40-e411-b4d2-002655e6c45a\" >2014-15 IHSAA Class 2A Boys Soccer State Tournament Sect. 30: Floyd Central<\/a><script type=\"text\/javascript\" >(function(d){var mp = d.createElement(\'script\'),h=d.getElementsByTagName(\'head\')[0];mp.type=\'text\/javascript\';mp.async=true;mp.src=\'http:\/\/www.maxpreps.com\/includes\/js\/widget\/widget.compressed.js\';h.appendChild(mp);})(document);<\/script>\r\n"],	
		["sss", "bjv", "Boys JV", "#31824A", "#ffffff","John Doe","not.real@notreal.ic", "<a class=\"maxpreps-widget-link\" data-width=\"1200\" data-height=\"900\" data-type=\"tournament\" data-member-id=\"5c84e3b8-99be-42ac-a048-e011fc2d312e\" data-allow-scrollbar=\"true\" href=\"http:\/\/www.maxpreps.com\/tournament\/view.aspx?tournamentid=f7904f71-a13e-e411-b4d2-002655e6c45a&ssid=f9bafe0d-45cb-4693-aa16-f8766dc2f9fb&bracketid=3e8b7250-3e40-e411-b4d2-002655e6c45a\" >2014-15 IHSAA Class 2A Boys Soccer State Tournament Sect. 30: Floyd Central<\/a><script type=\"text\/javascript\" >(function(d){var mp = d.createElement(\'script\'),h=d.getElementsByTagName(\'head\')[0];mp.type=\'text\/javascript\';mp.async=true;mp.src=\'http:\/\/www.maxpreps.com\/includes\/js\/widget\/widget.compressed.js\';h.appendChild(mp);})(document);<\/script>\r\n"],
		["sss", "gv", "Girls Varsity", "#FDF21C", "#282828","John Doe","not.real@notreal.ic","<a class=\"maxpreps-widget-link\" data-width=\"1200\" data-height=\"900\" data-type=\"tournament\" data-member-id=\"5c84e3b8-99be-42ac-a048-e011fc2d312e\" data-allow-scrollbar=\"true\" href=\"http:\/\/www.maxpreps.com\/tournament\/view.aspx?tournamentid=ce329d7b-dc40-e411-b4d2-002655e6c45a&ssid=8a56a490-d455-4969-a16a-0fdfc001e119&bracketid=dcc67f6c-6a42-e411-b4d2-002655e6c45a\" >2014-15 IHSAA Class 2A Girls Soccer State Tournament<\/a><script type=\"text\/javascript\" >(function(d){var mp = d.createElement(\'script\'),h=d.getElementsByTagName(\'head\')[0];mp.type=\'text\/javascript\';mp.async=true;mp.src=\'http:\/\/www.maxpreps.com\/includes\/js\/widget\/widget.compressed.js\';h.appendChild(mp);})(document);<\/script>\r\n"],
		["sss", "gjv", "Girls JV", "#FDF21C", "#282828","John Doe","not.real@notreal.ic","<a class=\"maxpreps-widget-link\" data-width=\"1200\" data-height=\"900\" data-type=\"tournament\" data-member-id=\"5c84e3b8-99be-42ac-a048-e011fc2d312e\" data-allow-scrollbar=\"true\" href=\"http:\/\/www.maxpreps.com\/tournament\/view.aspx?tournamentid=ce329d7b-dc40-e411-b4d2-002655e6c45a&ssid=8a56a490-d455-4969-a16a-0fdfc001e119&bracketid=dcc67f6c-6a42-e411-b4d2-002655e6c45a\" >2014-15 IHSAA Class 2A Girls Soccer State Tournament<\/a><script type=\"text\/javascript\" >(function(d){var mp = d.createElement(\'script\'),h=d.getElementsByTagName(\'head\')[0];mp.type=\'text\/javascript\';mp.async=true;mp.src=\'http:\/\/www.maxpreps.com\/includes\/js\/widget\/widget.compressed.js\';h.appendChild(mp);})(document);<\/script>\r\n"],
		["sss", "m", "Boys & Girls Middle", "#FDF21C", "#282828","John Doe","not.real@notreal.ic",""],		
		["scs", "bv", "Boys Varsity", "#31824A", "#ffffff","John Doe","not.real@notreal.ic",""],
		["scs", "bjv", "Boys JV", "#31824A", "#ffffff","John Doe","not.real@notreal.ic",""],
		["scs", "gv", "Girls Varsity", "#FDF21C", "#282828","John Doe","not.real@notreal.ic",""],
		["scs", "gjv", "Girls JV", "#FDF21C", "#282828","John Doe","not.real@notreal.ic",""]
	];

	//create table, include fk, create index on fk to speed up lookups by siteid
	db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY, shorthand TEXT, name TEXT, background TEXT, fontcolor TEXT, contactname TEXT, contactemail TEXT, tournamentjs TEXT, siteid INTEGER, FOREIGN KEY(siteid) REFERENCES sites(id))');
	db.run('CREATE INDEX UXTeamsSites ON teams(siteid)');
  
	var stmt = db.prepare('INSERT INTO teams (shorthand, name, background, fontcolor, contactname, contactemail, tournamentjs, siteid) VALUES (?,?,?,?,?,?,?,?)');
  
    for (i = 0; i < dataTeams.length; i += 1) {
		//include i since stmt.run is async and i will update faster than stmts complete
		db.get("SELECT id as siteid, " + i + " as i FROM sites WHERE shorthand=? LIMIT 1", [dataTeams[i][0]], function (error, row) {
			var currentTeam = dataTeams[row['i']];
			stmt.run(currentTeam[1], currentTeam[2], currentTeam[3], currentTeam[4], currentTeam[5], currentTeam[6],currentTeam[7], row['siteid'], function (err) {
				if(err) {
					console.log('Team add error: ' + err);
				} else {
					console.log('Team Add: ' + currentTeam[1]);
				}
			});
		});		
	};

});

//add team pages
db.serialize(function() {
	var dataTeamsPages = [
		["sss", "bv", "Schedule", "schedule"],	
		["sss", "bv", "Roster", "roster"],	
		["sss", "bv", "Tournament", "tournament"],	
		["sss", "bv", "Photos", "photos"],	
		["sss", "bv", "News", "news"],	
		["sss", "bv", "Coaches", "coaches"],
		["sss", "bjv", "Schedule", "schedule"],	
		["sss", "bjv", "Roster", "roster"],	
		["sss", "bjv", "News", "news"],	
		["sss", "bjv", "Coaches", "coaches"],		
		["sss", "gv", "Schedule", "schedule"],	
		["sss", "gv", "Roster", "roster"],	
		["sss", "gv", "Tournament", "tournament"],	
		["sss", "gv", "Photos", "photos"],	
		["sss", "gv", "News", "news"],	
		["sss", "gv", "Coaches", "coaches"],	
		["sss", "gjv", "Schedule", "schedule"],	
		["sss", "gjv", "Roster", "roster"],	
		["sss", "gjv", "News", "news"],	
		["sss", "gjv", "Coaches", "coaches"],		
		["sss", "m", "Schedule", "schedule"],	
		["sss", "m", "Roster", "roster"],	
		["sss", "m", "News", "news"],	
		["sss", "m", "Coaches", "coaches"],
		["scs", "bv", "Schedule", "schedule"],	
		["scs", "bv", "Roster", "roster"],	
		["scs", "bv", "Photos", "photos"],	
		["scs", "bv", "News", "news"],	
		["scs", "bv", "Coaches", "coaches"],		
		["scs", "bjv", "Schedule", "schedule"],	
		["scs", "bjv", "Roster", "roster"],
		["scs", "bjv", "Photos", "photos"],	
		["scs", "bjv", "News", "news"],	
		["scs", "bjv", "Coaches", "coaches"],		
		["scs", "gv", "Schedule", "schedule"],	
		["scs", "gv", "Roster", "roster"],	
		["scs", "gv", "Photos", "photos"],	
		["scs", "gv", "News", "news"],	
		["scs", "gv", "Coaches", "coaches"],		
		["scs", "gjv", "Schedule", "schedule"],	
		["scs", "gjv", "Roster", "roster"],	
		["scs", "gjv", "Photos", "photos"],	
		["scs", "gjv", "News", "news"],	
		["scs", "gjv", "Coaches", "coaches"],		

];

	db.run('CREATE TABLE pages (id INTEGER PRIMARY KEY, name TEXT, url TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
	db.run('CREATE INDEX UXPagesTeams ON pages(teamid)');	
  
	var stmt = db.prepare('INSERT INTO pages (name, url, teamid) VALUES (?, ?, ?)');
  
    for (i = 0; i < dataTeamsPages.length; i += 1) {
		db.get("SELECT " + i + " as i, sites.id as siteid, teams.id as teamid FROM sites JOIN teams on sites.id = teams.siteid WHERE sites.shorthand=? AND teams.shorthand=? LIMIT 1", [dataTeamsPages[i][0],dataTeamsPages[i][1]], function (error, row) {
			var current = dataTeamsPages[row['i']];
			stmt.run(current[2], current[3], row['teamid'], function (err) {
				if(err) {
					console.log('Team Pages add error: ' + err);
				} else {
					console.log('Team Pages Add: ' + current[1] + '-' + current[2]);
				}
			});
		});		
	};

});


//add team schedule
db.serialize(function() {
	var dataTeamsSchedule = [
		["sss", "bv", "08/18/14", "5:30p", "Bears", "Seagulls main field", "3-0", 1],	
		["sss", "bv", "08/25/14", "5:30p", "Cats", "Cats main field", "3-0", 1],	
		["sss", "bv", "09/01/14", "5:30p", "Eagles", "Eagles School main field", "3-0", 1],	
		["sss", "bjv", "08/18/14", "5:30p", "Bears", "Seagulls main field", "3-0", 1],	
		["sss", "bjv", "08/25/14", "5:30p", "Cats", "Cats main field", "3-0", 1],	
		["sss", "bjv", "09/01/14", "5:30p", "Eagles", "Eagles main field", "3-0", 1],	
];

	db.run('CREATE TABLE schedules (id INTEGER PRIMARY KEY, date TEXT, time TEXT, opponent TEXT, location TEXT, score TEXT, result INTEGER, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
	db.run('CREATE INDEX UXSchedulesTeams ON schedules(teamid)');	
  
	var stmt = db.prepare('INSERT INTO schedules (date, time, opponent, location, score, result, teamid) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
    for (i = 0; i < dataTeamsSchedule.length; i += 1) {
		db.get("SELECT " + i + " as i, sites.id as siteid, teams.id as teamid FROM sites JOIN teams on sites.id = teams.siteid WHERE sites.shorthand=? AND teams.shorthand=? LIMIT 1", [dataTeamsSchedule[i][0],dataTeamsSchedule[i][1]], function (error, row) {
			var current = dataTeamsSchedule[row['i']];
			stmt.run(current[2], current[3], current[4], current[5], current[6], current[7], row['teamid'], function (err) {
				if(err) {
					console.log('Team Schedule add error: ' + err);
				} else {
					console.log('Team Schedule Add: ' + current[1] + '-' + current[2]);
				}
			});
		});		
	};

});

//add team coaches
db.serialize(function() {
	var dataTeamsCoaches = [
		["sss", "bv", "Henry", "Kersting", "hkersting@appriss.com", "5022762094"],	
		["sss", "gv", "Gene", "Redmond", "hkersting@appriss.com", "5022762094"],
		["sss", "bjv", "Amber", "Wash", "hkersting@appriss.com", "5022762094"],
		["sss", "gjv", "Brian", "Carter", "hkersting@appriss.com", "5022762094"],
];

	db.run('CREATE TABLE coaches (id INTEGER PRIMARY KEY, first TEXT, last TEXT, email TEXT, phone TEXT)');
	//db.run('CREATE INDEX UXCoachesTeams ON coaches(teamid)');	
  
	var stmt = db.prepare('INSERT INTO coaches (first, last, email, phone) VALUES (?, ?, ?, ?)');
  
    for (i = 0; i < dataTeamsCoaches.length; i += 1) {
		db.get("SELECT " + i + " as i, sites.id as siteid, teams.id as teamid FROM sites JOIN teams on sites.id = teams.siteid WHERE sites.shorthand=? AND teams.shorthand=? LIMIT 1", [dataTeamsCoaches[i][0],dataTeamsCoaches[i][1]], function (error, row)
		{
			var current = dataTeamsCoaches[row['i']];
			stmt.run(current[2], current[3], current[4], current[5], function (err) {
				if(err) {
					console.log('Team Coach add error: ' + err);
				} else {
					console.log('Team Coach Add: ' + current[1] + '-' + current[2]);
				}
			});
		});		
	};

});


//add team roster
db.serialize(function() {
	var dataTeamsRoster = [
		["sss", "bv", "David", "Doe", "GK", "Sr", "0"],
		["sss", "bv", "Parker", "Mack", "GK", "Jr", "1"],
		["sss", "bv", "Jacob", "Boston", "D", "Jr", "3"],
		["sss", "bv", "Sean", "Zany", "D", "Jr", "4"],
		["sss", "bv", "Alex", "Temple", "D", "Jr", "6"],
		["sss", "bv", "Henok", "Wise", "FORW", "Sr", "7"],
		["sss", "bv", "Tyler", "Siny", "MF", "Sr", "10"],
		["sss", "bv", "Brody", "Mack", "MF", "So", "12"],
		["sss", "bv", "Evan", "Bendoya", "D", "So", "13"],
		["sss", "bv", "Matthew", "Moffet", "D", "Sr", "13"],
		["sss", "bv", "Ethan", "Taylor", "FORW", "So", "15"],
		["sss", "bv", "Landon", "McDonald", "MF", "So", "16"],
		["sss", "bv", "Parker", "Vendor", "Sr", "Jr", "17"],
		["sss", "bv", "Evan", "Sone", "D", "Jr", "18"],
		["sss", "bv", "Logan", "Kone", "MF", "Sr", "19"],
		["sss", "bv", "Hunter", "Cane", "D", "Sr", "20"],
		["sss", "bv", "Hasaan", "Bane", "D", "Sr", "22"],
		["sss", "bv", "Tyler", "Mane", "MF", "Sr", "23"],
		["sss", "bv", "Keaton", "Dane", "MF", "So", "25"],
		["sss", "bjv", "Tyler ", "Fane", "", "", "1"],
		["sss", "bjv", "Max ", "Lane", "", "", "2"],
		["sss", "bjv", "Evan ", "Sane", "", "", "3"],
		["sss", "bjv", "Evan", "Wane", "", "", "4"],
		["sss", "bjv", "Trey", "Kane", "", "", "5"],
		["sss", "bjv", "David", "Kain", "", "", "6"],
		["sss", "bjv", "John", "Tain", "", "", "7"],
		["sss", "bjv", "Will", "Wayne", "", "", "8"],
		["sss", "bjv", "Jacob", "Sane", "", "", "9"],
		["sss", "bjv", "Nikolas", "Vain", "", "", "10"],
		["sss", "bjv", "Brad", "Main", "", "", "11"],
		["sss", "bjv", "Braden", "Dane", "", "", "12"],
		["sss", "bjv", "Sam", "Pain", "", "", "13"],
		["sss", "bjv", "Connor", "Send", "", "", "14"],
		["sss", "bjv", "Brandon", "Mei", "", "", "15"],
		["sss", "bjv", "Landon", "Toll", "", "", "16"],
		["sss", "bjv", "Jordan", "Monsu", "", "", "17"],
		["sss", "bjv", "Jordan", "Dinner", "", "", "18"],
		["sss", "bjv", "Jacob", "Vain", "", "", "19"],
		["sss", "bjv", "Jason", "Wales", "", "", "20"],
		["sss", "bjv", "Jacob", "Kail", "", "", "21"],
		["sss", "bjv", "Garrison", "Cater", "", "", "22"],
		["sss", "bjv", "Jordan", "Bater", "", "", "23"],
		["sss", "bjv", "Ethan", "Matter", "", "", "24"],
		["sss", "bjv", "Keaton", "Satter", "", "", "25"],
		["sss", "bjv", "Landon", "Falter", "", "", "26"],		
];

	db.run('CREATE TABLE rosters (id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, position TEXT, grade TEXT, jersey TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
	db.run('CREATE INDEX UXRostersTeams ON rosters(teamid)');	
  
	var stmt = db.prepare('INSERT INTO rosters (firstname, lastname, position, grade, jersey, teamid) VALUES (?, ?, ?, ?, ?, ?)');
  
    for (i = 0; i < dataTeamsRoster.length; i += 1) {
		db.get("SELECT " + i + " as i, sites.id as siteid, teams.id as teamid FROM sites JOIN teams on sites.id = teams.siteid WHERE sites.shorthand=? AND teams.shorthand=? LIMIT 1", [dataTeamsRoster[i][0],dataTeamsRoster[i][1]], function (error, row) {
			var current = dataTeamsRoster[row['i']];
			stmt.run(current[2], current[3], current[4], current[5], current[6], row['teamid'], function (err) {
				if(err) {
					console.log('Team Roster add error: ' + err);
				} else {
					console.log('Team Roster Add: ' + current[1] + '-' + current[2]);
				}
			});
		});		
	};

});





//add team news
db.serialize(function() {
	var dataTeamsNews = [
		["sss", "bv", "news title 1", "first new content 1", "2016/04/07", ],
["sss", "bv", "news title 2", "first new content 2", "2014/03/02"],
["sss", "bv", "news title 3", "first new content 3", "2015/11/05"],
["sss", "bv", "news title 4", "first new content 4", "2014/08/04"],
];

	db.run('CREATE TABLE news (id INTEGER PRIMARY KEY, title TEXT, content TEXT, date TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
	db.run('CREATE INDEX IXNewsTeams ON news(teamid)');	
  
	var stmt = db.prepare('INSERT INTO news (title, content, date, teamid) VALUES (?, ?, ?, ?)');
  
    for (i = 0; i < dataTeamsNews.length; i += 1) {
		db.get("SELECT " + i + " as i, sites.id as siteid, teams.id as teamid FROM sites JOIN teams on sites.id = teams.siteid WHERE sites.shorthand=? AND teams.shorthand=? LIMIT 1", [dataTeamsNews[i][0],dataTeamsNews[i][1]], function (error, row) {
			var current = dataTeamsNews[row['i']];
			stmt.run(current[2], current[3], current[4], row['teamid'], function (err) {
				if(err) {
					console.log('Team News add error: ' + err);
				} else {
					console.log('Team News Add: ' + current[1] + '-' + current[2]);
				}
			});
		});		
	};

});






