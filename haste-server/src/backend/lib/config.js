const { rootDir } = require('./constants');
const path = require('path');

const config = {
	host: process.env.HOST ?? 'localhost',
	port: process.env.PORT ?? 8290,

	keyLength: 10,

	maxLength: 400000,

	keyGenerator: {
		type: 'phonetic'
	},

	rateLimits: {
		categories: {
			normal: {
				totalRequests: 500,
				every: 60000
			}
		}
	},

	storage: {
		type: process.env.STORAGE_TYPE ?? 'file',
		host: process.env.STORAGE_HOST ?? undefined,
		port: process.env.STORAGE_PORT ?? undefined,
		expire: process.env.STORAGE_EXPIRE_SECONDS ?? undefined,
		db: process.env.STORAGE_DB ?? undefined,
		password: process.env.STORAGE_PASSWORD ?? undefined
	},

	documents: {
		about: path.resolve(rootDir, 'README.md')
	}
};

module.exports = config;
