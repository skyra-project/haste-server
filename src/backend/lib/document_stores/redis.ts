import { Redis } from 'ioredis';
import type { Config } from '../types.js';
import { DocumentStore } from './base.js';

export type RedisDocumentStoreConfig = Omit<Config['storage'], 'path' | 'type'>;

/**
 * Represents a document store that uses Redis as the underlying data storage.
 */
export class RedisDocumentStore extends DocumentStore {
	#client: Redis;
	#expire: number | undefined;

	/**
	 * Creates an instance of `RedisDocumentStore`.
	 * @param config - The configuration options for the Redis client.
	 */
	public constructor(config: RedisDocumentStoreConfig) {
		super();
		this.#expire = config.expire;
		this.#client = new Redis(config);
	}

	/**
	 * Retrieves the value associated with the specified key from the Redis document store.
	 * @param key - The key of the document to retrieve.
	 * @returns A Promise that resolves to the value associated with the key, or `null` if the key does not exist.
	 * @throws An error if the Redis client is not available.
	 */
	public override async get(key: string): Promise<string | null> {
		if (!this.#client) {
			throw new Error('No redis client');
		}

		try {
			return await this.#client.get(key);
		} catch {
			return null;
		}
	}

	/**
	 * Sets the value associated with the specified key in the Redis document store.
	 * @param key - The key of the document to set.
	 * @param data - The data to store.
	 * @param skipExpire - A flag indicating whether to skip setting an expiration time for the document.
	 * @returns A Promise that resolves to `true` if the operation is successful, or `false` otherwise.
	 * @throws An error if the Redis client is not available.
	 */
	public override async set(key: string, data: string | Buffer, skipExpire: boolean): Promise<boolean> {
		if (!this.#client) {
			throw new Error('No redis client');
		}

		try {
			if (skipExpire || !this.#expire) {
				await this.#client.set(key, data);
			} else {
				await this.#client.setex(key, this.#expire, data);
			}

			return true;
		} catch {
			return false;
		}
	}
}
