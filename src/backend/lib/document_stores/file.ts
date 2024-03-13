import crypto from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import type { Config } from '../types.js';
import { DocumentStore } from './base.js';

export type FileDocumentStoreConfig = Pick<Config['storage'], 'path'>;

export class FileDocumentStore extends DocumentStore {
	#basePath: string;

	public constructor(config: FileDocumentStoreConfig) {
		super();
		this.#basePath = config.path || './data';
	}

	public override async get(key: string): Promise<string | null> {
		try {
			const path = `${this.#basePath}/${this.md5(key)}`;
			return await readFile(path, 'utf-8');
		} catch {
			return null;
		}
	}

	public override async set(key: string, data: string | Buffer): Promise<boolean> {
		try {
			const path = `${this.#basePath}/${this.md5(key)}`;
			await mkdir(this.#basePath, { mode: 0o700, recursive: true });
			await writeFile(path, data, 'utf-8');
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Calculates the MD5 hash of the given text.
	 *
	 * @param data - The text to calculate the MD5 hash for.
	 * @returns The MD5 hash of the given text.
	 */
	private md5(data: string): string {
		return crypto.createHash('md5').update(data).digest('hex');
	}
}
