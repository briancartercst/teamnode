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

var fetchLastInsertId = function(callback) {
	dbLastInsertId.each(function (err, row) {
		if(err) {
			callback(err);
		} else {
			callback(null,row);
		}
	});	
};

db.serialize(function() {
	//---------------------------------------------------------------------------------------------------
	//  database tables create 
	//---------------------------------------------------------------------------------------------------	
	db.serialize(function() {
		//enable foreign keys for db
		db.run('PRAGMA foreign_keys = ON');

		console.log("create tables started");

		console.log("-- info");
		db.run('CREATE TABLE info (id INTEGER PRIMARY KEY, category TEXT, key TEXT, value TEXT)');
		
		console.log("-- teams");
		db.run('CREATE TABLE teams (id INTEGER PRIMARY KEY, shorthand TEXT, name TEXT, background TEXT, fontcolor TEXT, contactname TEXT, contactemail TEXT, listbackground TEXT, listfontcolor TEXT)');
		
		console.log("-- pages");
		db.run('CREATE TABLE pages (id INTEGER PRIMARY KEY, name TEXT, url TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsPages ON pages(teamid)');	
		
		console.log("-- schedules");
		db.run('CREATE TABLE schedules (id INTEGER PRIMARY KEY, date TEXT, time TEXT, opponent TEXT, location TEXT, score TEXT, result INTEGER, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsSchedules ON schedules(teamid)');
		
		console.log("-- rosters");
		db.run('CREATE TABLE rosters (id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, position TEXT, grade TEXT, jersey TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsRosters ON rosters(teamid)');
		
		console.log("-- coaches");
		db.run('CREATE TABLE coaches (id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, phone TEXT, email TEXT)');
		db.run('CREATE TABLE teamscoaches (id INTEGER PRIMARY KEY, teamid INTEGER, coachid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id), FOREIGN KEY(coachid) REFERENCES coaches(id))');
		db.run('CREATE INDEX IndexTeamsCoachesTeam ON teamscoaches(teamid)');
		db.run('CREATE INDEX IndexTeamsCoachesCoach ON teamscoaches(coachid)');
		
		console.log("-- news");
		db.run('CREATE TABLE news (id INTEGER PRIMARY KEY, guid TEXT, title TEXT, details TEXT, alert INTEGER)');
		db.run('CREATE TABLE teamsnews (id INTEGER PRIMARY KEY, teamid INTEGER, newsid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id), FOREIGN KEY(newsid) REFERENCES news(id))');
		db.run('CREATE INDEX IndexTeamsNewsTeam ON teamsnews(teamid)');

		console.log("-- photos");
		db.run('CREATE TABLE photos (id INTEGER PRIMARY KEY, title TEXT, description TEXT, filename TEXT)');
		db.run('CREATE TABLE teamsphotos (id INTEGER PRIMARY KEY, teamid INTEGER, photoid INTEGER, gallery TEXT, FOREIGN KEY(teamid) REFERENCES teams(id), FOREIGN KEY(photoid) REFERENCES photos(id))');
		db.run('CREATE INDEX IndexTeamsPhotos ON teamsphotos(teamid)');
	
		console.log("-- tournament");
		db.run('CREATE TABLE tournaments (id INTEGER PRIMARY KEY, widget TEXT, teamid INTEGER, FOREIGN KEY(teamid) REFERENCES teams(id))');
		db.run('CREATE INDEX IndexTeamsTournaments ON pages(teamid)');

		console.log("-- users");
		db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, firstname TEXT, lastname TEXT, email TEXT, hash TEXT, salt TEXT, active INTEGER)');
		db.run('CREATE UNIQUE INDEX IF NOT EXISTS UniqueIndexUsersEmail ON users(email)');
		
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
			["bv", "Boys Varsity Soccer", "#31824A", "#ffffff","John Doe","john.doe@gmail.com", "#ffffff", "#000000"],	
			["bjv", "Boys JV Soccer", "#31824A", "#ffffff","John Doe","john.doe@gmail.com", "#ffffff", "#000000"],
			["gv", "Girls Varsity Soccer", "#FFC426", "#000000","Jane Smith","jane.smith@gmail.com", "#ffffff", "#000000"],
			["gjv", "Girls JV Soccer", "#FFC426", "#000000","Jane Smith","jane.smith@gmail.com", "#ffffff", "#000000"]
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
			["bv", "News", "news"],	
			["bv", "Coaches", "coaches"],
			["bv", "Photos", "photogalleries"],
			["bv", "Tournament", "tournament"],	
			["bjv", "Schedule", "schedule"],	
			["bjv", "Roster", "roster"],	
			["bjv", "News", "news"],	
			["bjv", "Coaches", "coaches"],
			["bjv", "Photos", "photogalleries"],			
			["gv", "Schedule", "schedule"],	
			["gv", "Roster", "roster"],	
			["gv", "News", "news"],	
			["gv", "Coaches", "coaches"],	
			["gv", "Photos", "photogalleries"],	
			["gv", "Tournament", "tournament"],	
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


	
	
	db.serialize(function() {
		//Insert coaches
		console.log("Insert coaches started");
		
		var dataCoaches = [
			["John", "Doe", "johndoe@fake.com", "502-555-1212"],
			["Jane", "Doe", "janedoe@fake.com", "502-555-1212"],
		];
	  
		var stmt = db.prepare('INSERT INTO coaches (firstname, lastname, email, phone) VALUES (?, ?, ?, ?)');
	  
		for (i = 0; i < dataCoaches.length; i += 1) {
			db.get("SELECT " + i + " as i", [], function (error, row) {
				var current = dataCoaches[row['i']];
				stmt.run(current[0], current[1], current[2], current[3], function (err) {
					if(err) {
						console.log('Coaches add error: ' + err);
					} else {
						console.log('Coaches Add: ' + current[0] + '-' + current[1]);
					}
				});
			});		
		};
	});

	
	db.serialize(function() {
		//Insert team coaches
		console.log("Insert team coaches started");
		
		var dataTeamsCoaches = [
			["bv", "johndoe@fake.com"],
			["bjv", "johndoe@fake.com"],
			["gv", "janedoe@fake.com"],
			["gjv", "janedoe@fake.com"],
		];
	  
		var stmt = db.prepare('INSERT INTO teamscoaches (teamid, coachid) VALUES (?, ?)');
	  
		for (i = 0; i < dataTeamsCoaches.length; i += 1) {			
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataTeamsCoaches[i][0]], function (error, row) {
				var current = dataTeamsCoaches[row['i']];
				var currentTeam = row;
				
				db.get("SELECT " + row['i'] + " as i, id as coachid FROM coaches WHERE email=?", [current[1]], function (error, row) {
					var currentCoach = dataTeamsCoaches[row['i']];					
					
					stmt.run(currentTeam['teamid'], row['coachid'], function (err) {
						if(err) {
							console.log('Team Coach add error: ' + err);
						} else {
							console.log('Team Coach Add: ' + current[0] + '-' + current[1]);
						}
					});					
				})
			});		
		};	//for
	});		
	

	
	db.serialize(function() {
		//Insert news
		console.log("Insert news started");
		
		var dataNews = [
			["d7fcf5383dd34168b01c7c1c9d45a982", "Practice Cancelled for Today 9/18!", "Due to weather, the games for today have been cancelled 9/18", 1],						
			["1cb11a5e78294193b7e85d6f120e59cb", "Boys Varsity team wins district", "Congrats to the Boys Varsity team for winning the 2014 district!", 0],
			["27e1f3d561564ebf9b788ea6c26e208e", "Coach Doe receives award", "Coach Doe received the award for coach of the year from the KY Soccer Association", 0],
			["d137a4c04d4a4a33b41d28362fc3a90c", "All Teams lunch Oct 16th at noon BWs", "The celebration lunch will be at Bad Wings on Main and 5th.  Oct 16th at noon.  See you there.", 0],
			["8a54286c10f049e599fed7be7061ce9d", "Girls Varsity Season", "Congrats to the Girls varsity team for a great season!", 0],
			["48bb9aa9d1a14730b5dbc8fe8127ade2", "Boys JV awards @school 10/20", "Boys JV awards will be given out at school assembly 2pm on 10/20.", 0],
		];
	  
		var stmt = db.prepare('INSERT INTO news (guid, title, details, alert) VALUES (?, ?, ?, ?)');
	  
		for (i = 0; i < dataNews.length; i += 1) {
			db.get("SELECT " + i + " as i", [], function (error, row) {
				var current = dataNews[row['i']];
				stmt.run(current[0], current[1], current[2], current[3], function (err) {
					if(err) {
						console.log('Coaches add error: ' + err);
					} else {
						console.log('Coaches Add: ' + current[0] + '-' + current[1]);
					}
				});
			});		
		};
	});

	
	db.serialize(function() {
		//Insert team news
		console.log("Insert team news started");
		
		var dataTeamsNews = [
			["bv", "d7fcf5383dd34168b01c7c1c9d45a982"],
			["bjv", "d7fcf5383dd34168b01c7c1c9d45a982"],	
			["gv", "d7fcf5383dd34168b01c7c1c9d45a982"],	
			["gjv", "d7fcf5383dd34168b01c7c1c9d45a982"],				
			["bv", "1cb11a5e78294193b7e85d6f120e59cb"],
			["bv", "27e1f3d561564ebf9b788ea6c26e208e"],
			["bjv", "27e1f3d561564ebf9b788ea6c26e208e"],			
			["bv", "d137a4c04d4a4a33b41d28362fc3a90c"],
			["bjv", "d137a4c04d4a4a33b41d28362fc3a90c"],
			["gv", "d137a4c04d4a4a33b41d28362fc3a90c"],
			["gjv", "d137a4c04d4a4a33b41d28362fc3a90c"],			
			["gv", "8a54286c10f049e599fed7be7061ce9d"],
			["bjv", "48bb9aa9d1a14730b5dbc8fe8127ade2"]			
		];
	  
		var stmt = db.prepare('INSERT INTO teamsnews (teamid, newsid) VALUES (?, ?)');
	  
		for (i = 0; i < dataTeamsNews.length; i += 1) {			
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataTeamsNews[i][0]], function (error, row) {
				var current = dataTeamsNews[row['i']];
				var currentTeam = row;
				
				db.get("SELECT " + row['i'] + " as i, id as newsid FROM news WHERE guid=?", [current[1]], function (error, row) {
					var currentNews = dataTeamsNews[row['i']];					
					
					stmt.run(currentTeam['teamid'], row['newsid'], function (err) {
						if(err) {
							console.log('Team News add error: ' + err);
						} else {
							console.log('Team News Add: ' + current[0] + '-' + current[1]);
						}
					});					
				})
			});		
		};	//for
	});		
	
	
	
	
	db.serialize(function() {
		//Insert photos
		console.log("Insert photos started");
		
		var dataPhotos = [
			["Soccer1", "This is soccer 1", "s1.png"],
			["Soccer2", "This is soccer 2", "s2.png"],
			["Soccer3", "This is soccer 3", "s3.png"],
			["Soccer4", "This is soccer 4", "s4.png"],
			["Soccer5", "This is soccer 5", "s5.png"],
			["Soccer6", "This is soccer 6", "s6.png"],
			["Soccer7", "This is soccer 7", "s7.png"],
			["Soccer8", "This is soccer 8", "s8.png"],
			["Soccer9", "This is soccer 9", "s9.png"],
			["Soccer10", "This is soccer 10","s10.png"],
			["Soccer11", "This is soccer 11", "s11.png"],	
			["Soccer12", "This is soccer 12", "s12.png"],
			["Soccer13", "This is soccer 13", "s13.png"],
			["Soccer14", "This is soccer 14", "s14.png"],			
		];
	  
		var stmt = db.prepare('INSERT INTO photos (title, description, filename) VALUES (?, ?, ?)');
	  
		for (i = 0; i < dataPhotos.length; i += 1) {
			db.get("SELECT " + i + " as i", [], function (error, row) {
				var current = dataPhotos[row['i']];
				stmt.run(current[0], current[1], current[2], function (err) {
					if(err) {
						console.log('Photos add error: ' + err);
					} else {
						console.log('Photos Add: ' + current[0] + '-' + current[1]);
					}
				});
			});		
		};
	});

	
	db.serialize(function() {
		//Insert team photos
		console.log("Insert team photos started");
		
		var dataTeamsPhotos = [
			["bv", "s1.png", "Demo"],
			["bv", "s2.png", "Demo"],
			["bv", "s3.png", "Demo"],
			["bv", "s4.png", "Demo"],
			["bv", "s5.png", "Demo"],
			["bv", "s6.png", "Demo"],
			["bv", "s7.png", "Demo"],
			["bv", "s8.png", "Demo"],
			["bv", "s9.png", "Demo"],
			["bv", "s10.png", "Demo"],
			["bv", "s11.png", "Demo"],
			["bv", "s1.png", "Demo2"],
			["bv", "s2.png", "Demo2"],
			["bv", "s3.png", "Demo2"],
			["bv", "s4.png", "Demo2"],			
			["bjv", "s1.png", "Demo"],
			["gv", "s12.png", "Demo"],
			["gv", "s13.png", "Demo"],
			["gv", "s14.png", "Demo"],			
			["gjv", "s12.png", "Demo2"],
			["gjv", "s13.png", "Demo2"],
			["gjv", "s14.png", "Demo2"],
		];
	  
		var stmt = db.prepare('INSERT INTO teamsphotos (teamid, photoid, gallery) VALUES (?, ?, ?)');
	  
		for (i = 0; i < dataTeamsPhotos.length; i += 1) {			
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataTeamsPhotos[i][0]], function (error, row) {
				var current = dataTeamsPhotos[row['i']];
				var currentTeam = row;
				
				db.get("SELECT " + row['i'] + " as i, id as photoid FROM photos WHERE filename=?", [current[1]], function (error, row) {
					var currentPhoto = dataTeamsPhotos[row['i']];					
					
					stmt.run(currentTeam['teamid'], row['photoid'], currentPhoto[2], function (err) {
						if(err) {
							console.log('Team Photo add error: ' + err);
						} else {
							console.log('Team Photo Add: ' + current[0] + '-' + current[1]);
						}
					});					
				})
			});		
		};	//for
	});

	db.serialize(function() {
		//Insert tournament
		console.log("Insert tournament started");
		
		var dataTournament = [
			["bv", '<iframe frameborder="0" class="maxpreps-widget" src="http://www.maxpreps.com/widgets/tournament.aspx?tournamentid=f7904f71-a13e-e411-b4d2-002655e6c45a&amp;ssid=f9bafe0d-45cb-4693-aa16-f8766dc2f9fb&amp;bracketid=3e8b7250-3e40-e411-b4d2-002655e6c45a&amp;width=1200&amp;height=900&amp;memeberid=5c84e3b8-99be-42ac-a048-e011fc2d312e&amp;allow-scrollbar=true&amp;ref=http%3A%2F%2Ffloydcentralsoccer.org%2Ftournament.html" style="width: 1200px; height: 900px; overflow: auto;"></iframe><script type="text/javascript">(function(d){var mp = d.createElement(\'script\'),h=d.getElementsByTagName(\'head\')[0];mp.type=\'text/javascript\';mp.async=true;mp.src=\'http://www.maxpreps.com/includes/js/widget/widget.compressed.js\';h.appendChild(mp);})(document);</script>'],	
			["bjv", '<iframe frameborder="0" class="maxpreps-widget" src="http://www.maxpreps.com/widgets/tournament.aspx?tournamentid=f7904f71-a13e-e411-b4d2-002655e6c45a&amp;ssid=f9bafe0d-45cb-4693-aa16-f8766dc2f9fb&amp;bracketid=3e8b7250-3e40-e411-b4d2-002655e6c45a&amp;width=1200&amp;height=900&amp;memeberid=5c84e3b8-99be-42ac-a048-e011fc2d312e&amp;allow-scrollbar=true&amp;ref=http%3A%2F%2Ffloydcentralsoccer.org%2Ftournament.html" style="width: 1200px; height: 900px; overflow: auto;"></iframe><script type="text/javascript">(function(d){var mp = d.createElement(\'script\'),h=d.getElementsByTagName(\'head\')[0];mp.type=\'text/javascript\';mp.async=true;mp.src=\'http://www.maxpreps.com/includes/js/widget/widget.compressed.js\';h.appendChild(mp);})(document);</script>'],	
			["gv", '<iframe frameborder="0" class="maxpreps-widget" src="http://www.maxpreps.com/widgets/tournament.aspx?tournamentid=ce329d7b-dc40-e411-b4d2-002655e6c45a&amp;ssid=8a56a490-d455-4969-a16a-0fdfc001e119&amp;bracketid=dcc67f6c-6a42-e411-b4d2-002655e6c45a&amp;width=1200&amp;height=900&amp;memeberid=5c84e3b8-99be-42ac-a048-e011fc2d312e&amp;allow-scrollbar=true&amp;ref=http%3A%2F%2Ffloydcentralsoccer.org%2Ftournament.html" style="width: 1200px; height: 900px; overflow: auto;"></iframe>'],	
			["gjv", '<iframe frameborder="0" class="maxpreps-widget" src="http://www.maxpreps.com/widgets/tournament.aspx?tournamentid=ce329d7b-dc40-e411-b4d2-002655e6c45a&amp;ssid=8a56a490-d455-4969-a16a-0fdfc001e119&amp;bracketid=dcc67f6c-6a42-e411-b4d2-002655e6c45a&amp;width=1200&amp;height=900&amp;memeberid=5c84e3b8-99be-42ac-a048-e011fc2d312e&amp;allow-scrollbar=true&amp;ref=http%3A%2F%2Ffloydcentralsoccer.org%2Ftournament.html" style="width: 1200px; height: 900px; overflow: auto;"></iframe>']
		];

		var stmt = db.prepare('INSERT INTO tournaments (widget, teamid) VALUES (?, ?)');
	  
		for (i = 0; i < dataTournament.length; i += 1) {
			db.get("SELECT " + i + " as i, id as teamid FROM teams WHERE shorthand=?", [dataTournament[i][0]], function (error, row) {
				var current = dataTournament[row['i']];
				stmt.run(current[1], row['teamid'], function (err) {
					if(err) {
						console.log('Team Tournament add error: ' + err);
					} else {
						console.log('Team Tournament Add: ' + current[0]);
					}
				});
			});		
		};
	});	

	db.serialize(function() {
		//Insert users
		console.log("Insert users started");
		
		var data = [
			["John", "Doe", "john.doe@gmail.com", "af9aa05061211a6d659fb4a08ee36d7694d7b7c7315e8f3b", "ad7ea3e625cd4267b14a7598fa0ff446", 1],
			["Jane", "Smith", "jane.smith@gmail.com", "bcfcad982fff5bfcb72426418a4018f5053181690d45b1f7", "9852f94c4c234d9eb242a0c08e665a8e", 1]			
		];

		var stmt = db.prepare('INSERT INTO users (firstname, lastname, email, hash, salt, active) VALUES (?, ?, ?, ?, ?, ?)');
	  
		for (i = 0; i < data.length; i += 1) {
			var current = data[i];
			stmt.run(current[0], current[1], current[2], current[3], current[4], current[5], function (err) {
				if(err) {
					console.log('User add error: ' + err);
				} else {
					console.log('User Add: ' + current[0] + ' ' + current[1]);
				}
			});
		};
	});		

	
});	//top serialize








