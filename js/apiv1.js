//External libraries
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var sqlite3 = require('sqlite3');

//Revealing Module Design Pattern 
//Immediately-Invoked-Function-Expression, it declares a function, which then calls itself immediately 
var apiV1 = (function () {
	var	mimeTypes = {'html': 'text/html', 'png': 'image/png', "jpeg": "image/jpeg", "jpg": "image/jpeg", 'js': 'text/javascript', 'css': 'text/css'};
	var	db = new sqlite3.Database('teamnode.db');
	
	var	dbLastInsertId = db.prepare('SELECT last_insert_rowid() as id');	

	var	dbSelectInfo = db.prepare('SELECT id, category, key, value FROM info');
	var	dbSelectTeams = db.prepare('SELECT id, shorthand, name, background, fontcolor FROM teams');	
	
	var	dbSelectTeam = db.prepare('SELECT id, shorthand, name, background, fontcolor FROM teams WHERE id = (?)');
	var	dbSelectPages = db.prepare('SELECT id, name, url FROM pages WHERE teamid = (?)');	
    var	dbSelectSchedules = db.prepare('SELECT id, date, time, opponent, location, score, result FROM schedules WHERE teamid = (?)');
	var	dbSelectRosters = db.prepare('SELECT id, firstname, lastname, position, grade, jersey FROM rosters WHERE teamid = (?)');	
	
	var msgMissingParms = '{"error": "missing parameters: ';
	var msgBadRequest = '{"error": "bad request"}';
	
	var serveFromDisk = function(filename, response) {
		var pathname;
		var stats, extension, mimeType, fileStream;		

		
		try {
			pathname = path.join(process.cwd(), unescape(filename));		
			extension = path.extname(pathname).substr(1);
		
			if(extension == null || extension == '') {
				extension = 'html';
				pathname += '.html';
			}

			mimeType = mimeTypes[extension] || 'application/octet-stream';
			stats = fs.lstatSync(pathname); // throws error if path doesn't exist
		} catch (e) {
			try {
				//remove .html, might be a directory
				pathname = pathname.slice(0,-5)
				stats = fs.lstatSync(pathname); // throws error if path doesn't exist	
			} catch (e) {
				response.writeHead(404, {'Content-Type': 'text/plain'});
				response.write('404 Not Found\n');
				response.end();
				return;
			}
		}

		if (stats.isFile()) {
			//path exists, is a file
		} else if (stats.isDirectory()) {
			//path exists, is a directory
			filename = filename + '/index.html';
			pathname = pathname  + '\\index.html';
		} else {
			// Symbolic link, other?
			response.writeHead(500, {'Content-Type': 'text/plain'});
			response.write('500 Internal server error\n');
			response.end();
		}	 


		console.log('serving ' + filename + ' as ' + mimeType);
		
		//cache for 10 minutes local, shared cache 1 hour  -- or use without cache for dev debugging	
		response.writeHead(200, {'Content-Type': mimeType,"Cache-Control": "public, max-age=600, s-maxage=3600"});			
		//response.writeHead(200, {'Content-Type': mimeType});
		
		fileStream = fs.createReadStream(pathname);
		fileStream.pipe(response);
	}; 
	
	var fetchLastInsertId = function(callback) {
		dbLastInsertId.each(function (err, row) {
			if(err) {
				callback(err);
			} else {
				callback(null,row);
			}
		});	
	};

	var fetchInfo = function(data, callback) {
		console.log('api v1: fetchInfo');
		var jsonData = { info: [] };			
	
		dbSelectInfo.each(function (err, row) {
			if(err) {
				callback(err);
			} else {
				jsonData.info.push({ id: row.id, category: row.category, key: row.key, value: row.value });
			}	
		}, function () {
			callback(null,jsonData);
		});	

	};	

	var fetchTeams = function(data, callback) {
		console.log('api v1: fetchTeams');
		var jsonData = { teams: [] };			
	
		dbSelectTeams.each(function (err, row) {
			if(err) {
				callback(err);
			} else {
				jsonData.teams.push({ id: row.id, shorthand: row.shorthand, name: row.name, background: row.background, fontcolor: row.fontcolor });
			}	
		}, function () {
			callback(null,jsonData);
		});	
	};
	
	var fetchPages = function(data, callback) {
		console.log('api v1: fetchPages');
		var jsonData = { pages: [] };			
	
		if(data) {	
			dbSelectPages.each([data.teamid],function (err, row) {
				if(err) {
					callback(err);
				} else {
					jsonData.pages.push({ id: row.id, name: row.name, url: row.url });
				}
			}, function () {
				callback(null,jsonData);
			});
		} else {
			callback(new Error('Missing teamid'));
		}
	};	

	var fetchSchedules = function(data, callback) {
		console.log('api v1: fetchSchedules');
		var jsonData = { results: [] };			
	
		if(data) {	
			dbSelectSchedules.each([data.teamid],function (err, row) {
				if(err) {
					callback(err);
				} else {
					jsonData.results.push({ id: row.id, date: row.date, time: row.time, opponent: row.opponent, location: row.location, score: row.score, result: row.result});
				}
			}, function () {
				callback(null,jsonData);
			});
		} else {
			callback(new Error('Missing teamid'));
		}
	};	

	var fetchRosters = function(data, callback) {
		console.log('api v1: fetchRosters');
		var jsonData = { results: [] };			
	
		if(data) {	
			dbSelectRosters.each([data.teamid],function (err, row) {
				if(err) {
					callback(err);
				} else {
					jsonData.results.push({ id: row.id, firstname: row.firstname, lastname: row.lastname, position: row.position, grade: row.grade, jersey: row.jersey});
				}
			}, function () {
				callback(null,jsonData);
			});
		} else {
			callback(new Error('Missing teamid'));
		}
	};		
	
 
	//Expose methods as public
	return {
		serveFromDisk: serveFromDisk,
		fetchInfo: fetchInfo,
		fetchTeams: fetchTeams,
		fetchPages: fetchPages,
		fetchSchedules: fetchSchedules,		
		fetchRosters: fetchRosters,		
	};
	
})();

//Export functions that are exposed for use by other modules
exports.fetchInfo = apiV1.fetchInfo;
exports.fetchTeams = apiV1.fetchTeams;
exports.fetchPages = apiV1.fetchPages;
exports.fetchSchedules = apiV1.fetchSchedules;
exports.fetchRosters = apiV1.fetchRosters;
exports.serveFromDisk = apiV1.serveFromDisk;


