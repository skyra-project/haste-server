import type { IntegerString } from '@skyra/env-utilities';
import type { BaseDocumentStore } from './DocumentStores/BaseDocumentStore.js';
import type * as SwaggerTypes from './SwaggerTypes.js';

/**
 * Represents the configuration options for the application.
 */
export interface Config {
	/** The host server for Fastify to start on */
	host: string;
	/** If `NODE_ENV` is `'production'`, the host to allow CORS requests from */
	cors_host: string;
	/** The port for Fastify to start on */
	port: number;
	/** The length of the key used for documents */
	keyLength: number;
	/** The maximum length of a document that can be POSTed */
	maxLength: number;
	/** The rate limit configuration */
	rateLimits: RateLimitsConfig;
	/** The storage options */
	storage: StorageConfig;
	/** The list of static documents to load */
	documents: {
		about: string;
		[key: string]: string;
	};
}

/** The rate limit configuration */
interface RateLimitsConfig {
	/** The maximum amount of requests within the timespan {@link RateLimitsConfig.timeWindow timeWindow} */
	max: number;
	/** The time window in which the requests count, in the {@linkplain https://github.com/zeit/ms ms} string format */
	timeWindow: string;
}

/** The storage options */
interface StorageConfig {
	/** The type of storage ot use */
	type: 'file' | 'redis';
	/** The host of the storage, only used if {@link StorageConfig.type type} is `redis` */
	host?: string;
	/** The port of the storage, only used if {@link StorageConfig.type type} is `redis` */
	port?: number;
	/** The expiry of documents, only used if {@link StorageConfig.type type} is `redis` */
	expire?: number;
	/** The redis database where documents are stored, only used if {@link StorageConfig.type type} is `redis` */
	db?: number;
	/** The redis password, only used if {@link StorageConfig.type type} is `redis` */
	password?: string;
	/** The local file path where documents are stored, only used if {@link StorageConfig.type type} is `file` */
	path?: string;
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
	Params: SwaggerTypes.ParamsType;
}

declare module '@skyra/env-utilities' {
	export interface Env {
		HOST: string;
		CORS_HOST: string;
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
