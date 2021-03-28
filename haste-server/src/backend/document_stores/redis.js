var redis = require('redis');

// For storing in redis
// options[type] = redis
// options[host] - The host to connect to (default localhost)
// options[port] - The port to connect to (default 5379)
// options[db] - The db to use (default 0)
// options[expire] - The time to live for each key set (default never)

var RedisDocumentStore = function (options, client) {
	this.expire = options.expire;
	if (client) {
		RedisDocumentStore.client = client;
	} else if (!RedisDocumentStore.client) {
		RedisDocumentStore.connect(options);
	}
};

// Create a connection according to config
RedisDocumentStore.connect = function (options) {
	var host = options.host || '127.0.0.1';
	var port = options.port || 6379;
	var index = options.db || 0;
	RedisDocumentStore.client = redis.createClient(port, host);
	// authenticate if password is provided
	if (options.password) {
		RedisDocumentStore.client.auth(options.password);
	}

	RedisDocumentStore.client.select(index, function (err) {
		if (err) {
			process.exit(1);
		}
	});
};

// Save file in a key
RedisDocumentStore.prototype.set = function (key, data, callback, skipExpire) {
	var _this = this;
	RedisDocumentStore.client.set(key, data, function (err) {
		if (err) {
			callback(false);
		} else {
			if (!skipExpire) {
				_this.setExpiration(key);
			}
			callback(true);
		}
	});
};

// Expire a key in expire time if set
RedisDocumentStore.prototype.setExpiration = function (key) {
	if (this.expire) {
		RedisDocumentStore.client.expire(key, this.expire, () => undefined);
	}
};

// Get a file from a key
RedisDocumentStore.prototype.get = function (key, callback, skipExpire) {
	var _this = this;
	RedisDocumentStore.client.get(key, function (err, reply) {
		if (!err && !skipExpire) {
			_this.setExpiration(key);
		}
		callback(err ? false : reply);
	});
};

module.exports = RedisDocumentStore;
