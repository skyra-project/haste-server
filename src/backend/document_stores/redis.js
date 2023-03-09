const Redis = require('ioredis');

/**
 * @class The Redis document store.
 */
module.exports = class RedisDocumentStore {
	/**
	 * @type {{ host?: string; port?: number; db?: number; expire?: number }}
	 */

	config = {};

	/**
	 * @type {import('ioredis').Redis}
	 */
	client;

	/** @type {number} */
	expire;

	/**
	 * Constructs a new {@link RedisDocumentStore}.
	 * @param {{ host: string; port: number; db: number; expire: number; password: string; type: 'file' | 'redis' }} config The custom redis server configuration.
	 * @param {Redis.Redis} [client] The redis client.
	 */
	constructor(config, client) {
		config.host ??= '127.0.0.1';
		config.port ??= 6379;
		config.db ??= 0;

		this.expire = config.expire;
		this.config = config;

		if (client) {
			this.client = client;
		} else if (!this.client) {
			this.client = new Redis(this.config);
		}
	}

	/**
	 * Saves a file at a specified key
	 * @param {string} key The key to store
	 * @param {*} data The file to save
	 * @param {(setSuccessful: boolean) => void} [callback] The callback to call when the data is saved
	 * @param {boolean} [skipExpire] Whether to skip the expiration
	 */
	async set(key, data, callback, skipExpire) {
		if (!this.client) {
			throw new Error('No redis client');
		}

		try {
			if (skipExpire) {
				await this.client.set(key, data);
			} else {
				await this.client.setex(key, this.expire, data);
			}

			if (callback) {
				callback(true);
			}
		} catch {
			if (callback) {
				callback(false);
			}
		}
	}

	/**
	 * Gets a file at a specified key
	 * @param {string} key The key to retrieve
	 * @param {(result: boolean | string) => void} [callback] The callback to call when the data is retrieved
	 * @param {boolean} [skipExpire] Whether to skip the expiration
	 */
	async get(key, callback, skipExpire) {
		if (!this.client) {
			throw new Error('No redis client');
		}

		try {
			const data = await this.client.get(key);

			if (callback) {
				callback(data);
			}
		} catch {
			if (callback) {
				callback(false);
			}
		}
	}
};
