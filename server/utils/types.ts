import type { IntegerString } from '@skyra/env-utilities';

/**
 * Represents the configuration options for the application.
 */
export interface Config {
	/** The host server for Fastify to start on */
	host: string;
	/** The port for Fastify to start on */
	port: number;
	/** The length of the key used for documents */
	keyLength: number;
	/** The maximum length of a document that can be POSTed */
	maxLength: number;
	/** The rate limit configuration */
	rateLimits: RateLimitsConfig;
	/** The expiry of documents, only used if {@link StorageConfig.type type} is `redis` */
	redisExpire: number | null;
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

declare module '@skyra/env-utilities' {
	export interface Env {
		KEY_LENGTH: IntegerString;
		MAX_LENGTH: IntegerString;
		RATE_LIMIT_MAX: IntegerString;
		RATE_LIMIT_INTERVAL_SECONDS: IntegerString;
		REDIS_HOST: string;
		REDIS_PORT: IntegerString;
		REDIS_EXPIRE_SECONDS: IntegerString;
		REDIS_DB: IntegerString;
		REDIS_PASSWORD: string;
	}
}
