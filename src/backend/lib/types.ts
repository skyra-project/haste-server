import type { IntegerString } from '@skyra/env-utilities';
import type { DocumentStore } from './document_stores/base.js';

export interface Config {
	host: string;
	port: number;
	keyLength: number;
	maxLength: number;
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

export interface DocumentHandlerConfig {
	store: DocumentStore;
	keyLength: number;
}

export interface FastifyRequestGeneric {
	Params: {
		id: string;
	};
}

declare module '@skyra/env-utilities' {
	export interface Env {
		HOST: string;
		PORT: IntegerString;
		STORAGE_TYPE: 'file' | 'redis';
		STORAGE_HOST: string;
		STORAGE_PORT: IntegerString;
		STORAGE_EXPIRE_SECONDS: IntegerString;
		STORAGE_DB: IntegerString;
		STORAGE_PASSWORD: string;
	}
}
