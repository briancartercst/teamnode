//External libraries
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var sqlite3 = require('sqlite3');

//Revealing Module Design Pattern 
//Immediately-Invoked-Function-Expression, it declares a function, which then calls itself immediately 
var TeamServerAPIv1 = (function () {
	var	mimeTypes = {'html': 'text/html', 'png': 'image/png', "jpeg": "image/jpeg", "jpg": "image/jpeg", 'js': 'text/javascript', 'css': 'text/css'};
	var	db = {};
	var	dbSelectSites = {};
	var	dbInsertStmt = {};
	var	dbSelectTeams = {};
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
			// path exists, is a file
		} else if (stats.isDirectory()) {
			// path exists, is a directory
			//console.log('process directory');
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
		
		//cache for 10 minutes local, shared cache 1 hour  -- or use without cache for dev debugging	
		response.writeHead(200, {'Content-Type': mimeType,"Cache-Control": "public, max-age=600, s-maxage=3600"});			
		//response.writeHead(200, {'Content-Type': mimeType});
		
		console.log('serving ' + filename + ' as ' + mimeType);
		//console.log('serving pathname ' + pathname + ' as ' + mimeType);

		fileStream = fs.createReadStream(pathname);
		fileStream.pipe(response);
	}; 
	
	var fetchSites = function(request, response) {
		var jsonData;
		console.log('api v1: doing fetchSites');

		//response.writeHead(200, {'Content-Type': 'application/json',"Cache-Control": "public, max-age=600, s-maxage=3600"});	
		response.writeHead(200, {'Content-Type': 'application/json'});
		
		jsonData = { sites: [] };
		dbSelectSites.each(function (err, row) {
			jsonData.sites.push({ id: row.id, shorthand: row.shorthand, name: row.name, welcome: row.welcome });
		}, function () {
			response.write(JSON.stringify(jsonData));
			response.end();
		});
	};

	var fetchTeams = function(request, response) {
		console.log('api v1: fetchTeams');

		var postText = '';
		request.setEncoding('utf8');
		request.addListener('data', function (postDataChunk) {
			postText += postDataChunk;
		});
		request.addListener('end', function () {
			if( postText == '') {
				response.writeHead(400, {'Content-Type': 'application/json'});
				response.write(msgMissingParms + ' siteid"}');
				response.end(); 
				return;
			}
			
			var postData = JSON.parse(postText);
			if( postData.siteid == null || postData.id == '') {
				response.writeHead(400, {'Content-Type': 'application/json'});
				response.write(msgMissingParms + 'siteid"}');
				response.end(); 
				return;
			}

			//response.writeHead(200, {'Content-Type': 'application/json',"Cache-Control": "public, max-age=600, s-maxage=3600"});
			response.writeHead(200, {'Content-Type': 'application/json'});
			
			jsonData = { teams: [] };
			dbSelectTeams.each([postData.siteid],function (err, row) {
				jsonData.teams.push({ id: row.id, shorthand: row.shorthand, name: row.name, background: row.background, fontcolor: row.fontcolor });
			}, function () {
				response.write(JSON.stringify(jsonData));
				response.end();
			});			
		});
	};

	var addNewSite = function(request, response) {
		var postText = '';
		console.log('api v1: addNewSite');
		request.setEncoding('utf8');
		request.addListener('data', function (postDataChunk) {
			postText += postDataChunk;
		});
		request.addListener('end', function () {
			var postData = JSON.parse(postText);

			dbInsertSite.run(postData.shorthand, postData.name, postData.welcome, function () {
				var message = {"status": "success"};
				response.writeHead(200, {'Content-Type': 'application/json'});				
				response.write(JSON.stringify(message));
				response.end();			
			});
		});
	};

	//Immediately-Invoked-Function-Expression
	var init = function () {
		console.log("TeamServerAPIv1 init");
		
		db = new sqlite3.Database('teamnode.db');
		dbSelectSites = db.prepare('SELECT id, shorthand, name, welcome FROM sites');
		dbSelectTeams = db.prepare('SELECT id, shorthand, name, background, fontcolor FROM teams WHERE siteid = (?)');	
		dbInsertSite = db.prepare('INSERT INTO sites (shorthand, name, welcome) VALUES (?, ?, ?)');
	}(); 	
  
	//Expose methods as public
	return {
		init: init,
		serveFromDisk: serveFromDisk,
		fetchSites: fetchSites,
		fetchTeams: fetchTeams,
		addNewSite: addNewSite,
	};

})();

//Export functions that are exposed for use by other modules
exports.fetchSites = TeamServerAPIv1.fetchSites;
exports.fetchTeams = TeamServerAPIv1.fetchTeams;
exports.addNewSite = TeamServerAPIv1.addNewSite;
exports.serveFromDisk = TeamServerAPIv1.serveFromDisk;
