import type { IntegerString } from '@skyra/env-utilities';
import type { BaseDocumentStore } from './DocumentStores/BaseDocumentStore.js';

/**
 * Represents the configuration options for the application.
 */
export interface Config {
	host: string;
	port: number;
	keyLength: number;
	maxLength: number;
	rateLimits: {
		max: number;
		timeWindow: string;
	};
	storage: {
		type: 'file' | 'redis';
		host?: string;
		port?: number;
		expire?: number;
		db?: number;
		password?: string;
		path?: string;
	};
	documents: {
		about: string;
		[key: string]: string;
	};
}

/**
 * Configuration options for the document handler.
 */
export interface DocumentHandlerConfig {
	/**
	 * The document store used by the handler.
	 */
	store: BaseDocumentStore;

	/**
	 * The length of the key used for documents.
	 */
	keyLength: number;
}

/**
 * Represents the generic request object in Fastify.
 */
export interface FastifyRequestGeneric {
	Params: {
		id: string;
	};
}

declare module '@skyra/env-utilities' {
	export interface Env {
		HOST: string;
		PORT: IntegerString;
		KEY_LENGTH: IntegerString;
		MAX_LENGTH: IntegerString;
		RATE_LIMIT_MAX: IntegerString;
		RATE_LIMIT_TIME_WINDOW: string;
		STORAGE_TYPE: 'file' | 'redis';
		STORAGE_HOST: string;
		STORAGE_PORT: IntegerString;
		STORAGE_EXPIRE_SECONDS: IntegerString;
		STORAGE_DB: IntegerString;
		STORAGE_PASSWORD: string;
	}
}
