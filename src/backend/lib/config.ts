import { envParseInteger, envParseString } from '@skyra/env-utilities';
import { fileURLToPath } from 'node:url';
import { rootDir } from './constants.js';
import type { Config } from './types.js';

/**
 * Configuration object for the application.
 */
export const config: Config = {
	host: envParseString('HOST', 'localhost'),
	port: envParseInteger('PORT', 8290),

	keyLength: 10,

	maxLength: 400_000,

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
