import { Redis } from 'ioredis';
import type { Config } from '../types.js';
import { DocumentStore } from './base.js';

export type RedisDocumentStoreConfig = Omit<Config['storage'], 'path' | 'type'>;

export class RedisDocumentStore extends DocumentStore {
	#client: Redis;
	#expire: number | undefined;

	public constructor(config: RedisDocumentStoreConfig) {
		super();
		this.#expire = config.expire;
		this.#client = new Redis(config);
	}

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
