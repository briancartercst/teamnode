//---------------------------------------------------------------------------------------------------
//  db-init.js 
//    This file initializes the team node database and adds test data  
//    Run:  node db-init
//
//---------------------------------------------------------------------------------------------------


//---------------------------------------------------------------------------------------------------
//  database file
//    this section sets up the database
//    if the database exists, it is removed 
//    this allows for a clean db with test data loaded
//---------------------------------------------------------------------------------------------------
console.log("DB file creation started");

//builtin require function is the easiest way to include modules that exist in separate files
//require fs, filesystem js file
var fs = require("fs");

//the file name used for the database
//sqlite is 1 file - everything is stored in that file
var file = "teamnode.db";

//check if file exists
var exists = fs.existsSync(file);

//remove file/db if exist  
if(exists) {
	try {
		fs.unlinkSync(file);
	} catch (error) {
		console.log('Database file maybe locked.\nClose apps that have it open.\n' + error);
		return;
	}
}

//create db file
fs.openSync(file, "w");

//builtin require function is the easiest way to include modules that exist in separate files
//require sqlite3. https://github.com/mapbox/node-sqlite3
var sqlite3 = require("sqlite3").verbose();

//open the database
var db = new sqlite3.Database(file);

//write message to output console - shows users what is happening
console.log("DB file creation finished");

db.serialize(function() {
	//---------------------------------------------------------------------------------------------------
	//  database tables create 
	//---------------------------------------------------------------------------------------------------	
	db.serialize(function() {
		//enable foreign keys for db
		db.run('PRAGMA foreign_keys = ON');

		console.log("create tables started");

		console.log("-- info started");
		db.run('CREATE TABLE info (id INTEGER PRIMARY KEY, category TEXT, key TEXT, value TEXT)');
		
		console.log("-- teams started");
		db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY, shorthand TEXT, name TEXT, background TEXT, fontcolor TEXT, contactname TEXT, contactemail TEXT, listbackground TEXT, listfontcolor TEXT)');
		
		console.log("-- pages started");
		db.run('CREATE TABLE pages (id INTEGER PRIMARY KEY, name TEXT, url TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsPages ON pages(teamid)');	
		
		console.log("-- schedules started");
		db.run('CREATE TABLE schedules (id INTEGER PRIMARY KEY, date TEXT, time TEXT, opponent TEXT, location TEXT, score TEXT, result INTEGER, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsSchedules ON schedules(teamid)');
		
		console.log("-- rosters started");
		db.run('CREATE TABLE rosters (id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, position TEXT, grade TEXT, jersey TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsRosters ON rosters(teamid)');
	});	
	
	//---------------------------------------------------------------------------------------------------
	//  database test data load 
	//---------------------------------------------------------------------------------------------------	
	db.serialize(function() {
		//Insert info
		console.log("Insert info started");
		
		var dataInfo = [
			["db", "version", "0"],
			["ajax", "cache", "false"],
			["site", "name", "Sample School"],
			["site", "welcome", "Welcome to the Sample School Website.  Choose a team below to get team details."]
		];

		var stmt = db.prepare('INSERT INTO info (category, key, value) VALUES (?, ?, ?)');

		for (i = 0; i < dataInfo.length; i += 1) {
			db.get('SELECT ' + i + ' as i', [], function (error, row) {
				var current = dataInfo[row['i']];
				stmt.run(current[0],current[1],current[2], function (err) {
					if(err) {
						console.log('Insert Info error: ' + err);
					} else {
						console.log('Insert Info: ' + current[0] + ', ' + current[1]);
					}
				});
			});		
		};

	});	

	db.serialize(function() {	
		//Insert teams
		console.log("Insert teams started");
		
		var dataTeams = [
			["bv", "Boys Varsity Soccer", "#31824A", "#ffffff","John Doe","john.doe@notreal.ic", "#ffffff", "#000000"],	
			["bjv", "Boys JV Soccer", "#31824A", "#ffffff","John Doe","john.doe@notreal.ic", "#ffffff", "#000000"],
			["gv", "Girls Varsity Soccer", "#FFC426", "#000000","Jane Smith","jane.smith@notreal.ic", "#ffffff", "#000000"],
			["gjv", "Girls JV Soccer", "#FFC426", "#000000","Jane Smith","jane.smith@notreal.ic", "#ffffff", "#000000"]
		];

		var stmt = db.prepare('INSERT INTO teams (shorthand, name, background, fontcolor, contactname, contactemail, listbackground, listfontcolor) VALUES (?,?,?,?,?,?,?,?)');
	 
		for (i = 0; i < dataTeams.length; i += 1) {
			db.get('SELECT ' + i + ' as i', [], function (error, row) {
				var current = dataTeams[row['i']];
				stmt.run(current[0],current[1],current[2],current[3],current[4],current[5],current[6],current[7], function (err) {
					if(err) {
						console.log('Teams add error: ' + err);
					} else {
						console.log('Teams Add: ' + current[0]);
					}
				});
			});			
		};
	});	

	db.serialize(function() {
		//Insert pages
		console.log("Insert pages started");
		
		var dataPages = [
			["bv", "Schedule", "schedule"],	
			["bv", "Roster", "roster"],	
			["bv", "Tournament", "tournament"],	
			["bv", "Photos", "photos"],	
			["bv", "News", "news"],	
			["bv", "Coaches", "coaches"],
			["bjv", "Schedule", "schedule"],	
			["bjv", "Roster", "roster"],	
			["bjv", "News", "news"],	
			["bjv", "Coaches", "coaches"],		
			["gv", "Schedule", "schedule"],	
			["gv", "Roster", "roster"],	
			["gv", "Tournament", "tournament"],	
			["gv", "Photos", "photos"],	
			["gv", "News", "news"],	
			["gv", "Coaches", "coaches"],	
			["gjv", "Schedule", "schedule"],	
			["gjv", "Roster", "roster"],	
			["gjv", "News", "news"],	
			["gjv", "Coaches", "coaches"]
		];

		var stmt = db.prepare('INSERT INTO pages (name, url, teamid) VALUES (?, ?, ?)');
	  
		for (i = 0; i < dataPages.length; i += 1) {
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataPages[i][0]], function (error, row) {
				var current = dataPages[row['i']];
				stmt.run(current[1], current[2], row['teamid'], function (err) {
					if(err) {
						console.log('Team Pages add error: ' + err);
					} else {
						console.log('Team Pages Add: ' + current[0] + '-' + current[1]);
					}
				});
			});		
		};
	});	

	db.serialize(function() {
		//Insert schedules
		console.log("Insert schedules started");
		
		var dataSchedules = [
			["bv", "08/18/14", "5:30p", "Bears", "Seagulls main field", "3-0", 1],	
			["bv", "08/25/14", "5:30p", "Cats", "Cats main field", "3-0", 1],	
			["bv", "09/01/14", "5:30p", "Eagles", "Eagles School main field", "3-0", 1],	
			["bjv", "08/18/14", "5:30p", "Bears", "Seagulls main field", "3-0", 1],	
			["bjv", "08/25/14", "5:30p", "Cats", "Cats main field", "3-0", 1],	
			["bjv", "09/01/14", "5:30p", "Eagles", "Eagles main field", "3-0", 1]	
		];

	  
		var stmt = db.prepare('INSERT INTO schedules (date, time, opponent, location, score, result, teamid) VALUES (?, ?, ?, ?, ?, ?, ?)');
	  
		for (i = 0; i < dataSchedules.length; i += 1) {
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataSchedules[i][0]], function (error, row) {
				var current = dataSchedules[row['i']];
				stmt.run(current[1], current[2], current[3], current[4], current[5], current[6], row['teamid'], function (err) {
					if(err) {
						console.log('Team Schedule add error: ' + err);
					} else {
						console.log('Team Schedule Add: ' + current[0] + '-' + current[1]);
					}
				});
			});		
		};
	});	

	db.serialize(function() {
		//Insert rosters
		console.log("Insert rosters started");
		
		var dataRosters = [
			["bv", "David", "Doe", "GK", "Sr", "0"],
			["bv", "Parker", "Mack", "GK", "Jr", "1"],
			["bv", "Jacob", "Boston", "D", "Jr", "3"],
			["bv", "Sean", "Zany", "D", "Jr", "4"],
			["bv", "Alex", "Temple", "D", "Jr", "6"],
			["bv", "Henok", "Wise", "FORW", "Sr", "7"],
			["bv", "Tyler", "Siny", "MF", "Sr", "10"],
			["bv", "Brody", "Mack", "MF", "So", "12"],
			["bv", "Evan", "Bendoya", "D", "So", "13"],
			["bv", "Matthew", "Moffet", "D", "Sr", "13"],
			["bv", "Ethan", "Taylor", "FORW", "So", "15"],
			["bv", "Landon", "McDonald", "MF", "So", "16"],
			["bv", "Parker", "Vendor", "Sr", "Jr", "17"],
			["bv", "Evan", "Sone", "D", "Jr", "18"],
			["bv", "Logan", "Kone", "MF", "Sr", "19"],
			["bv", "Hunter", "Cane", "D", "Sr", "20"],
			["bv", "Hasaan", "Bane", "D", "Sr", "22"],
			["bv", "Tyler", "Mane", "MF", "Sr", "23"],
			["bv", "Keaton", "Dane", "MF", "So", "25"],
			["bjv", "Tyler ", "Fane", "", "", "1"],
			["bjv", "Max ", "Lane", "", "", "2"],
			["bjv", "Evan ", "Sane", "", "", "3"],
			["bjv", "Evan", "Wane", "", "", "4"],
			["bjv", "Trey", "Kane", "", "", "5"],
			["bjv", "David", "Kain", "", "", "6"],
			["bjv", "John", "Tain", "", "", "7"],
			["bjv", "Will", "Wayne", "", "", "8"],
			["bjv", "Jacob", "Sane", "", "", "9"],
			["bjv", "Nikolas", "Vain", "", "", "10"],
			["bjv", "Brad", "Main", "", "", "11"],
			["bjv", "Braden", "Dane", "", "", "12"],
			["bjv", "Sam", "Pain", "", "", "13"],
			["bjv", "Connor", "Send", "", "", "14"],
			["bjv", "Brandon", "Mei", "", "", "15"],
			["bjv", "Landon", "Toll", "", "", "16"],
			["bjv", "Jordan", "Monsu", "", "", "17"],
			["bjv", "Jordan", "Dinner", "", "", "18"],
			["bjv", "Jacob", "Vain", "", "", "19"],
			["bjv", "Jason", "Wales", "", "", "20"],
			["bjv", "Jacob", "Kail", "", "", "21"],
			["bjv", "Garrison", "Cater", "", "", "22"],
			["bjv", "Jordan", "Bater", "", "", "23"],
			["bjv", "Ethan", "Matter", "", "", "24"],
			["bjv", "Keaton", "Satter", "", "", "25"],
			["bjv", "Landon", "Falter", "", "", "26"]	
		];

	 
		var stmt = db.prepare('INSERT INTO rosters (firstname, lastname, position, grade, jersey, teamid) VALUES (?, ?, ?, ?, ?, ?)');
	  
		for (i = 0; i < dataRosters.length; i += 1) {
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataRosters[i][0]], function (error, row) {
				var current = dataRosters[row['i']];
				stmt.run(current[1], current[2], current[3], current[4], current[5], row['teamid'], function (err) {
					if(err) {
						console.log('Team Roster add error: ' + err);
					} else {
						console.log('Team Roster Add: ' + current[0] + '-' + current[1]);
					}
				});
			});		
		};	
	});		
});	








