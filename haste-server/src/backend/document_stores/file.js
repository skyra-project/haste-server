var fs = require('fs');
var crypto = require('crypto');

// For storing in files
// options[type] = file
// options[path] - Where to store

var FileDocumentStore = function (options) {
	this.basePath = options.path || './data';
	this.expire = options.expire;
};

// Generate md5 of a string
FileDocumentStore.md5 = function (str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	return md5sum.digest('hex');
};

// Save data in a file, key as md5 - since we don't know what we could
// be passed here
FileDocumentStore.prototype.set = function (key, data, callback, skipExpire) {
	try {
		var _this = this;
		fs.mkdir(this.basePath, '700', function () {
			var fn = _this.basePath + '/' + FileDocumentStore.md5(key);
			fs.writeFile(fn, data, 'utf8', function (err) {
				if (err) {
					callback(false);
				} else {
					callback(true);
				}
			});
		});
	} catch (err) {
		callback(false);
	}
};

// Get data from a file from key
FileDocumentStore.prototype.get = function (key, callback, skipExpire) {
	var _this = this;
	var fn = this.basePath + '/' + FileDocumentStore.md5(key);
	fs.readFile(fn, 'utf8', function (err, data) {
		if (err) {
			callback(false);
		} else {
			callback(data);
		}
	});
};

module.exports = FileDocumentStore;
