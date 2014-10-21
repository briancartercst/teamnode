// This supports Clusters and Domains
//
var cluster = require('cluster');
var url = require('url');
var http = require('http');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');
var apiv1 = require('./js/apiv1.js');

var PORT = +process.env.PORT || 8080;

//Revealing Module Design Pattern 
var TeamServer = (function () {
	//Public
	var processRequest = function (request, response) {
		var uri;
		uri = url.parse(request.url).pathname;

		if (uri === '/api/v1/sites') {
			apiv1.fetchSites(request, response);
		} else if (uri === '/api/v1/teams') {
			apiv1.fetchTeams(request, response);	
		} else if (uri === '/api/v1/sites/add') {
			apiv1.addNewSite(request, response);	
		} else {
			apiv1.serveFromDisk(uri, response);
		}	
	};

	//Public
	var init = function () {

	}(); 
	
	//Public functions add here; Private otherwise
	return {
		init: init,
		processRequest: processRequest
	};

})();

var TeamCluster = (function () {
	var init = function () {
		if (cluster.isMaster) {
			// Use just 1 workers.  If you have multiple CPUs,
			// increase the number of forks.
			//
			// The important thing is that the master does very little,
			// increasing our resilience to unexpected errors.

			console.log('Application Starting - Master');

			cluster.fork();
			
			//Add more forks, typically 1 per CPU
			//cluster.fork();

			cluster.on('disconnect', function (worker) {
				console.error('Disconnect worker on port ' + PORT + '!');
				cluster.fork();
			}); 
			
		} else {
			// the worker process
			// called once per worker
			// each worker has its own memory
			console.log('Starting worker - listening on port: ' + PORT);
		 
			var domain = require('domain');  
		
			var server = require('http').createServer(function (req, res) {
				var d = domain.create();
				d.on('error', function (er) {
					console.error('error: ', er.stack);

					// Note: uncaught error has occurred!
					// By definition, something unexpected occurred,
					try {
						// make sure we close down within 30 seconds
						var killtimer = setTimeout(function () {
							process.exit(1);
						}, 30000);
						// But don't keep the process open just for that!
						killtimer.unref();

						// stop taking new requests.
						server.close();

						// Let the master know we're dead.  This will trigger a
						// 'disconnect' in the cluster master, and then it will fork
						// a new worker.
						cluster.worker.disconnect();

						// create the error
						var errorMessage = Error.http(500, null, er.stack);                
						console.log(errorMessage.status + ': ' + errorMessage.message + '\n' + errorMessage.data);

						// try to send an error to the request that triggered the problem
						res.writeHead(500, {
							"Context-Type": "text/plain"
						});
						
						res.end();
					} catch (er2) {
						// oh well, not much we can do at this point.
						console.error('Error sending 500!', er2.stack);
					}
				});

				// Because req and res were created before this domain existed,
				// we need to explicitly add them.
				// See the explanation of implicit vs explicit binding below.
				d.add(req);
				d.add(res);

				// Now run the handler function in the domain.
				d.run(function () {
					TeamServer.processRequest(req, res);
				});
			});
			server.listen(PORT);
		}	

	}(); 
	
})();





