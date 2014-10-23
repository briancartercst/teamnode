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
		["fcs", "Floyd Central Soccer", "Welcome to the Highlanders' Website.  Choose a team below to get team details."]		
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
		["sss", "bv", "Boys Varsity", "#9966FF", "#282828","John Doe","not.real@notreal.ic"],	
		["sss", "bjv", "Boys JV", "#9966FF", "#282828","John Doe","not.real@notreal.ic"],
		["sss", "gv", "Girls Varsity", "#9966FF", "#282828","John Doe","not.real@notreal.ic"],
		["sss", "gjv", "Girls JV", "#9966FF", "#282828","John Doe","not.real@notreal.ic"],
		["sss", "m", "Boys & Girls Middle", "#9966FF", "#282828","John Doe","not.real@notreal.ic"],		
		["fcs", "bv", "Boys Varsity", "#31824A", "#ffffff","John Doe","not.real@notreal.ic"],
		["fcs", "bjv", "Boys JV", "#31824A", "#ffffff","John Doe","not.real@notreal.ic"],
		["fcs", "gv", "Girls Varsity", "#FDF21C", "#282828","John Doe","not.real@notreal.ic"],
		["fcs", "gjv", "Girls JV", "#FDF21C", "#282828","John Doe","not.real@notreal.ic"]
	];

	//create table, include fk, create index on fk to speed up lookups by siteid
	db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY, shorthand TEXT, name TEXT, background TEXT, fontcolor TEXT, contactname TEXT, contactemail TEXT, siteid INTEGER, FOREIGN KEY(siteid) REFERENCES sites(id))');
	db.run('CREATE INDEX UXTeamsSites ON teams(siteid)');
  
	var stmt = db.prepare('INSERT INTO teams (shorthand, name, background, fontcolor, contactname, contactemail, siteid) VALUES (?,?,?,?,?,?,?)');
  
    for (i = 0; i < dataTeams.length; i += 1) {
		//include i since stmt.run is async and i will update faster than stmts complete
		db.get("SELECT id as siteid, " + i + " as i FROM sites WHERE shorthand=? LIMIT 1", [dataTeams[i][0]], function (error, row) {
			var currentTeam = dataTeams[row['i']];
			stmt.run(currentTeam[1], currentTeam[2], currentTeam[3], currentTeam[4], currentTeam[5], currentTeam[6], row['siteid'], function (err) {
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
		["sss", "bv", "Schedule", "schedule.html"],	
		["sss", "bv", "Roster", "roster.html"],	
		["sss", "bv", "Tournament", "tournament.html"],	
		["sss", "bv", "Photos", "photos.html"],	
		["sss", "bv", "News", "news.html"],	
		["sss", "bv", "Coaches", "coaches.html"],
		["sss", "bjv", "Schedule", "schedule.html"],	
		["sss", "bjv", "Roster", "roster.html"],	
		["sss", "bjv", "News", "news.html"],	
		["sss", "bjv", "Coaches", "coaches.html"],		
		["sss", "gv", "Schedule", "schedule.html"],	
		["sss", "gv", "Roster", "roster.html"],	
		["sss", "gv", "Tournament", "tournament.html"],	
		["sss", "gv", "Photos", "photos.html"],	
		["sss", "gv", "News", "news.html"],	
		["sss", "gv", "Coaches", "coaches.html"],	
		["sss", "gjv", "Schedule", "schedule.html"],	
		["sss", "gjv", "Roster", "roster.html"],	
		["sss", "gjv", "News", "news.html"],	
		["sss", "gjv", "Coaches", "coaches.html"],		
		["sss", "m", "Schedule", "schedule.html"],	
		["sss", "m", "Roster", "roster.html"],	
		["sss", "m", "News", "news.html"],	
		["sss", "m", "Coaches", "coaches.html"],
		["fcs", "bv", "Schedule", "schedule.html"],	
		["fcs", "bv", "Roster", "roster.html"],	
		["fcs", "bv", "Tournament", "tournament.html"],	
		["fcs", "bv", "Photos", "photos.html"],	
		["fcs", "bv", "News", "news.html"],	
		["fcs", "bv", "Coaches", "coaches.html"],		
		["fcs", "bjv", "Schedule", "schedule.html"],	
		["fcs", "bjv", "Roster", "roster.html"],	
		["fcs", "bjv", "Tournament", "tournament.html"],	
		["fcs", "bjv", "Photos", "photos.html"],	
		["fcs", "bjv", "News", "news.html"],	
		["fcs", "bjv", "Coaches", "coaches.html"],		
		["fcs", "gv", "Schedule", "schedule.html"],	
		["fcs", "gv", "Roster", "roster.html"],	
		["fcs", "gv", "Tournament", "tournament.html"],	
		["fcs", "gv", "Photos", "photos.html"],	
		["fcs", "gv", "News", "news.html"],	
		["fcs", "gv", "Coaches", "coaches.html"],		
		["fcs", "gjv", "Schedule", "schedule.html"],	
		["fcs", "gjv", "Roster", "roster.html"],	
		["fcs", "gjv", "Tournament", "tournament.html"],	
		["fcs", "gjv", "Photos", "photos.html"],	
		["fcs", "gjv", "News", "news.html"],	
		["fcs", "gjv", "Coaches", "coaches.html"],		

];

	db.run('CREATE TABLE pages (id INTEGER PRIMARY KEY, name TEXT, url TEXT, siteid INTEGER, teamid INTEGER, FOREIGN KEY(siteid) REFERENCES sites(id), FOREIGN KEY(teamid) REFERENCES teams(id))');
	db.run('CREATE INDEX UXPagesSites ON pages(siteid)');
	db.run('CREATE INDEX UXPagesTeams ON pages(teamid)');	
  
	var stmt = db.prepare('INSERT INTO pages (name, url, siteid, teamid) VALUES (?, ?, ?, ?)');
  
    for (i = 0; i < dataTeamsPages.length; i += 1) {
		db.get("SELECT " + i + " as i, sites.id as siteid, teams.id as teamid FROM sites JOIN teams on sites.id = teams.siteid WHERE sites.shorthand=? AND teams.shorthand=? LIMIT 1", [dataTeamsPages[i][0],dataTeamsPages[i][1]], function (error, row) {
			var currentTeamPages = dataTeamsPages[row['i']];
			stmt.run(currentTeamPages[2], currentTeamPages[3], row['siteid'], row['teamid'], function (err) {
				if(err) {
					console.log('Team Pages add error: ' + err);
				} else {
					console.log('Team Pages Add: ' + currentTeamPages[1] + '-' + currentTeamPages[2]);
				}
			});
		});		
	};

});




