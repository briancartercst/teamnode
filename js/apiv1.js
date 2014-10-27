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
	
	var	dbSelectSites = db.prepare('SELECT id, shorthand, name, welcome FROM sites');
	var	dbSelectSite = db.prepare('SELECT id, shorthand, name, welcome FROM sites WHERE id = (?)');
	var	dbSelectSiteByShorthand = db.prepare('SELECT id, shorthand, name, welcome FROM sites WHERE shorthand = (?)');
	var	dbSelectTeams = db.prepare('SELECT id, shorthand, name, background, fontcolor FROM teams WHERE siteid = (?)');	
	var	dbSelectTeam = db.prepare('SELECT id, shorthand, name, background, fontcolor FROM teams WHERE id = (?)');
	var	dbSelectPages = db.prepare('SELECT id, name, url FROM pages WHERE teamid = (?)');	
    var	dbSelectSchedules = db.prepare('SELECT id, date, time, opponent, location, score, result FROM schedules WHERE teamid = (?)');	
	
	var	dbInsertSite = db.prepare('INSERT INTO sites (shorthand, name, welcome) VALUES (?, ?, ?)');
	var	dbUpdateSite = db.prepare('UPDATE sites SET shorthand=?, name=?, welcome=? WHERE id = ?');	
		
	var msgMissingParms = '{"error": "missing parameters: ';
	var msgBadRequest = '{"error": "bad request"}';
	
	var serveFromDisk = function(filename, response) {
		var pathname = path.join(process.cwd(), unescape(filename));
		var stats, extension, mimeType, fileStream;		
		
		try {
			stats = fs.lstatSync(pathname); // throws error if path doesn't exist
		} catch (e) {
			response.writeHead(404, {'Content-Type': 'text/plain'});
			response.write('404 Not Found\n');
			response.end();
			return;
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
	 
		extension = path.extname(pathname).substr(1);
		mimeType = mimeTypes[extension] || 'application/octet-stream';

		console.log('serving ' + filename + ' as ' + mimeType);
		
		//cache for 10 minutes local, shared cache 1 hour  -- or use without cache for dev debugging	
		//response.writeHead(200, {'Content-Type': mimeType,"Cache-Control": "public, max-age=600, s-maxage=3600"});			
		response.writeHead(200, {'Content-Type': mimeType});
		
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

	var fetchSites = function(data, callback) {
		console.log('api v1: fetchSites');
		var jsonData = { sites: [] };			
	
		if(data) {	
			if( data.id) {
				dbSelectSite.each([data.id],function (err, row) {
					if(err) {
						callback(err);
					} else {
						jsonData.sites.push({ id: row.id, shorthand: row.shorthand, name: row.name, welcome: row.welcome });
					}
				}, function () {
					callback(null,jsonData);
				});
			} else {
				if(data.shorthand) {
					dbSelectSiteByShorthand.each([data.shorthand],function (err, row) {
						if(err) {
							callback(err);
						} else {
							jsonData.sites.push({ id: row.id, shorthand: row.shorthand, name: row.name, welcome: row.welcome });
						}
					}, function () {
						callback(null,jsonData);
					});			
				} else {
					callback(new Error('Missing id or shorthand'));				
				}
			}
		} else {		
			dbSelectSites.each(function (err, row) {
				if(err) {
					callback(err);
				} else {
					jsonData.sites.push({ id: row.id, shorthand: row.shorthand, name: row.name, welcome: row.welcome });
				}	
			}, function () {
				callback(null,jsonData);
			});	
		}
	};	

	var fetchTeams = function(data, callback) {
		console.log('api v1: fetchTeams');
		var jsonData = { teams: [] };			
	
		if(data) {	
			if(data.siteid) {
				dbSelectTeams.each([data.siteid],function (err, row) {
					if(err) {
						callback(err);
					} else {
						jsonData.teams.push({ id: row.id, shorthand: row.shorthand, name: row.name, background: row.background, fontcolor: row.fontcolor });
					}
				}, function () {
					callback(null,jsonData);
				});	
			} else { 
				if(data.id) {			
					dbSelectTeam.each([data.id],function (err, row) {
						if(err) {
							callback(err);
						} else {
							jsonData.teams.push({ id: row.id, shorthand: row.shorthand, name: row.name, background: row.background, fontcolor: row.fontcolor });
						}
					}, function () {
						callback(null,jsonData);
					});
				} else {
						callback(new Error('Missing siteid'));
				}
			}
		} else {
			callback(new Error('Missing siteid or teamid'));
		}
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
	

	var addSite = function(data, callback) {
		console.log('api v1: addSite');
	
		if(data) {	
			dbInsertSite.run(data.shorthand, data.name, data.welcome, function (err) {
				if(err) {
					callback(err);
				} else {
					fetchLastInsertId(function (err, row) {
						if(err) {
							callback(err);
						} else {
							callback(null,row);
						}
					});
				}
			});
		} else {
			callback(new Error('Missing data'));
		}
	};
	
	var updateSite = function(data, callback) {
		console.log('api v1: updateSite');
		
		console.log('data: ' + JSON.stringify(data));
	
		if(data) {	
			dbUpdateSite.run(data.shorthand, data.name, data.welcome, data.id, function (err) {
				if(err) {
					callback(err);
				} else {
					fetchSites({id: data.id}, function (err, row) {
						if(err) {
							callback(err);
						} else {
							callback(null,row);
						}
					});
				}
			});
		} else {
			callback(new Error('Missing data'));
		}
	};	
 
	//Expose methods as public
	return {
		serveFromDisk: serveFromDisk,
		fetchSites: fetchSites,
		fetchTeams: fetchTeams,
		fetchPages: fetchPages,
		fetchSchedules: fetchSchedules,
		addSite: addSite,
		updateSite: updateSite
	};
	
})();

//Export functions that are exposed for use by other modules
exports.fetchSites = apiV1.fetchSites;
exports.fetchTeams = apiV1.fetchTeams;
exports.fetchPages = apiV1.fetchPages;
exports.fetchSchedules = apiV1.fetchSchedules;
exports.addSite = apiV1.addSite;
exports.serveFromDisk = apiV1.serveFromDisk;
exports.updateSite = apiV1.updateSite;


