import { envParseInteger, envParseString } from '@skyra/env-utilities';
import { fileURLToPath } from 'node:url';
import { rootDir } from './constants.js';
import type { Config } from './types.js';

/**
 * Configuration object for the application.
 */
export const config: Config = {
	host: envParseString('HOST', '::'),
	port: envParseInteger('PORT', 8290),
	cors_host: envParseString('CORS_HOST', 'https://hastebin.skyra.pw'),

	keyLength: envParseInteger('KEY_LENGTH', 10),

	maxLength: envParseInteger('MAX_LENGTH', 400_000),

	rateLimits: {
		max: envParseInteger('RATE_LIMIT_MAX', 500),
		timeWindow: envParseString('RATE_LIMIT_TIME_WINDOW', '1 minute')
	},

	storage: {
		type: envParseString('STORAGE_TYPE', 'file'),
		host: envParseString('STORAGE_HOST', '127.0.0.1'),
		port: envParseInteger('STORAGE_PORT', 6379),
		expire: envParseInteger('STORAGE_EXPIRE_SECONDS', null) ?? undefined,
		db: envParseInteger('STORAGE_DB', 0),
		password: envParseString('STORAGE_PASSWORD', null) ?? undefined
	},

	documents: {
		about: fileURLToPath(new URL('README.md', rootDir))
	}
};
