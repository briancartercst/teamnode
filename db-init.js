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
		["sss", "bv", "Boys Varsity", "#9966FF", "#282828"],	
		["sss", "bjv", "Boys JV", "#9966FF", "#282828"],
		["sss", "gv", "Girls Varsity", "#9966FF", "#282828"],
		["sss", "gjv", "Girls JV", "#9966FF", "#282828"],
		["sss", "m", "Boys & Girls Middle", "#9966FF", "#282828"],		
		["fcs", "bv", "Boys Varsity", "#31824A", "#ffffff"],
		["fcs", "bjv", "Boys JV", "#31824A", "#ffffff"],
		["fcs", "gv", "Girls Varsity", "#FDF21C", "#282828"],
		["fcs", "gjv", "Girls JV", "#FDF21C", "#282828"]
	];

	//create table, include fk, create index on fk to speed up lookups by siteid
	db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY, shorthand TEXT, name TEXT, background TEXT, fontcolor TEXT, siteid INTEGER, FOREIGN KEY(siteid) REFERENCES sites(id))');
	db.run('CREATE INDEX trackteams ON teams(siteid)');
  
	var stmt = db.prepare('INSERT INTO teams (siteid, shorthand, name, background, fontcolor) VALUES (?, ?, ?, ?, ?)');
  
    for (i = 0; i < dataTeams.length; i += 1) {
		//include i since stmt.run is async and i will update faster than stmts complete
		db.get("SELECT rowid as id, " + i + " as i FROM sites WHERE shorthand=? LIMIT 1", [dataTeams[i][0]], function (error, row) {
			var currentTeam = dataTeams[row['i']];
			stmt.run(row['id'], currentTeam[1], currentTeam[2], currentTeam[3], currentTeam[4], function (err) {
				if(err) {
					console.log('Team add error: ' + err);
				} else {
					console.log('Team Add: ' + currentTeam[1]);
				}
			});
		});		
	};

});

