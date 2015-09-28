var Hapi            = require('hapi'),
    Inert           = require('inert'),
    Vision          = require('vision');


// Create a server with a host and port
var server = new Hapi.Server();

server.connection({ 
    host: process.env.HOST || 'localhost', 
    port: parseInt(process.env.PORT, 10) || 3009,    
    router: {
        stripTrailingSlash: true
    }
});


// log repsonses data to console
var goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }]
};


// Register plug-in and start
server.register([
  Inert,
  Vision,
  {
    register: require('good'), 
    options: goodOptions
  },{
    register: require('blipp'), 
  }], function (err) {
      if (err) {
          console.error(err);
      }else {
          server.start(function () {
              console.info('server started at ' + server.info.uri);
          });
      }
  });


// setup routes to serve the test directory and file routes into other modules
server.route([{
	method: ['GET'],
	path: '/microformat-shiv.js',
    handler: {
		file: {
			path: './node_modules/microformat-shiv/microformat-shiv.js'
		}
	}
},{
	method: ['GET'],
	path: '/javascript/microformat-shiv.min.js',
    handler: {
		file: {
			path: './node_modules/microformat-shiv/microformat-shiv.min.js'
		}
	}
},{
	method: 'GET',
	path: '/{path*}',
	handler: {
		directory: {
			path: './static',
			index: 'index.html'
		}
	}
}]);
