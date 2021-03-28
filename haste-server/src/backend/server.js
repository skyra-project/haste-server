const http = require('http');
const fs = require('fs');
const connect = require('connect');
const route = require('connect-route');
const connect_st = require('st');
const connect_rate_limit = require('connect-ratelimit');
const DocumentHandler = require('./lib/document_handler');
const nodePath = require('path');
const config = require('./lib/config');
const { rootDir } = require('./lib/constants');

// Load the configuration and set some defaults
config.port ??= process.env.PORT || config.port || 8290;
config.host ??= process.env.HOST || config.host || 'localhost';

// build the store from the config on-demand - so that we don't load it
// for statics
if (!config.storage) {
	config.storage = { type: 'file' };
}
if (!config.storage.type) {
	config.storage.type = 'file';
}

const Store = require('./document_stores/' + config.storage.type);
const preferredStore = new Store(config.storage);

// Send the static documents into the preferred store, skipping expirations
var path, data;
for (var name in config.documents) {
	path = config.documents[name];
	data = fs.readFileSync(path, 'utf8');
	if (data) {
		preferredStore.set(name, data, () => undefined, true);
	}
}

// Pick up a key generator
const pwOptions = config.keyGenerator || {};
pwOptions.type = pwOptions.type || 'random';
const gen = require(`./key_generators/${pwOptions.type}`);
const keyGenerator = new gen(pwOptions);

// Configure the document handler
var documentHandler = new DocumentHandler({
	store: preferredStore,
	maxLength: config.maxLength,
	keyLength: config.keyLength,
	keyGenerator: keyGenerator
});

var app = connect();

// Rate limit all requests
if (config.rateLimits) {
	config.rateLimits.end = true;
	app.use(connect_rate_limit(config.rateLimits));
}

// first look at API calls
app.use(
	route(function (router) {
		// get raw documents - support getting with extension

		router.get('/raw/:id', function (request, response) {
			return documentHandler.handleRawGet(request, response, config);
		});

		router.head('/raw/:id', function (request, response) {
			return documentHandler.handleRawGet(request, response, config);
		});

		// add documents

		router.post('/documents', function (request, response) {
			return documentHandler.handlePost(request, response);
		});

		// get documents
		router.get('/documents/:id', function (request, response) {
			return documentHandler.handleGet(request, response, config);
		});

		router.head('/documents/:id', function (request, response) {
			return documentHandler.handleGet(request, response, config);
		});
	})
);

// Otherwise, try to match static files
app.use(
	connect_st({
		path: nodePath.resolve(rootDir, 'dist'),
		passthrough: true,
		index: false
	})
);

// Then we can loop back - and everything else should be a token,
// so route it back to /
app.use(
	route(function (router) {
		router.get('/:id', function (request, response, next) {
			request.sturl = '/';
			next();
		});
	})
);

// And match index
app.use(
	connect_st({
		path: nodePath.resolve(rootDir, 'dist'),
		index: 'index.html'
	})
);

http.createServer(app).listen(config.port, config.host);

console.info(`listening on http://${config.host}:${config.port}`);
