process.env.NODE_ENV ??= 'development';

import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { type FastifyRequest } from 'fastify';
import { readFile } from 'node:fs/promises';
import { DocumentHandler } from './handlers/DocumentHandler.js';
import { config } from './lib/config.js';
import { rootDir } from './lib/constants.js';
import * as SwaggerTypes from './lib/swaggerTypes.js';
import type { FastifyRequestGeneric } from './lib/types.js';

// Use dynamic imports to ensure only one of the stores gets loaded
const preferredStore =
	config.storage.type === 'file'
		? new (await import('./stores/FileDocumentStore.js')).FileDocumentStore(config.storage)
		: new (await import('./stores/RedisDocumentStore.js')).RedisDocumentStore(config.storage);

// Load all static documents
for (const [name, path] of Object.entries(config.documents)) {
	const data = await readFile(path, 'utf-8');

	// Only if the file has actual content we want to add it to the store
	if (data) {
		await preferredStore.set(name, data, true);
	}
}

// Setup the document handler with the preferred store
const documentHandler = new DocumentHandler({
	store: preferredStore,
	keyLength: config.keyLength
});

// Initialize fastify with a restricted body size
const fastify = Fastify({ bodyLimit: config.maxLength }).withTypeProvider<TypeBoxTypeProvider>();

// Set up the error handling for max length errors
fastify.setErrorHandler((error, _, reply) => {
	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_BODY_TOO_LARGE) {
		error.message = 'Document exceeds maximum length.';
		return reply.status(413).send(error);
	}

	return reply.send(error);
});

// Register the rate limit handler
await fastify.register(import('@fastify/rate-limit'), {
	max: config.rateLimits.max,
	timeWindow: config.rateLimits.timeWindow,
	keyGenerator: (request) => {
		const xRealIp = request.headers['x-real-ip'];
		if (typeof xRealIp === 'string') return xRealIp;
		return request.ip;
	},
	errorResponseBuilder: (_, context) => {
		return {
			statusCode: 429,
			error: 'Too Many Requests',
			message: `Rate limit exceeded. Only ${context.max} requests per ${context.after} to this service are allowed. Retry in ${context.after}ms.`,
			date: Date.now(),
			expiresIn: context.ttl
		};
	},
	allowList: []
});

// Register Fastify Sensible for sending errors
await fastify.register(import('@fastify/sensible'));

// Register and configure Swagger
await fastify.register(import('@fastify/swagger'), {
	swagger: {
		info: {
			title: 'Skyra Hastebin',
			description: 'A Hastebin by developers for developers',
			// Inject the version with esbuild
			version: '[VI]{{inject}}[/VI]'
		},
		host: 'localhost',
		consumes: ['text/plain'],
		produces: ['application/json'],
		tags: [
			{
				name: 'GET',
				description: 'Endpoints that can be approached by a GET call'
			},
			{
				name: 'POST',
				description: 'Endpoints that can be approached by a POST call'
			}
		]
	}
});

// Register and configure Swagger UI
await fastify.register(import('@fastify/swagger-ui'), {
	routePrefix: '/swagger-ui'
});

// First try to match API routes
fastify.get<{ Params: SwaggerTypes.ParamsType; Reply: SwaggerTypes.RawDocumentType }>(
	'/raw/:id',
	{
		schema: {
			description: 'Get the raw version of a document by its id',
			tags: ['GET'],
			params: SwaggerTypes.Params,
			response: {
				200: {
					description: 'The raw document.',
					...SwaggerTypes.RawDocument
				},
				...SwaggerTypes.FastifyError,
				404: {
					description: 'An error indicating that the document could not be found.',
					...SwaggerTypes.Error
				}
			}
		}
	},
	(request: FastifyRequest<FastifyRequestGeneric>, reply) => {
		return documentHandler.handleRawGet(request, reply);
	}
);

fastify.get<{ Params: SwaggerTypes.ParamsType; Reply: SwaggerTypes.DocumentType }>(
	'/documents/:id',
	{
		schema: {
			description: 'Get a document by its id',
			tags: ['GET'],
			params: SwaggerTypes.Params,
			response: {
				200: {
					description: 'The document.',
					...SwaggerTypes.Document
				},
				...SwaggerTypes.FastifyError,
				404: {
					description: 'An error indicating that the document could not be found.',
					...SwaggerTypes.Error
				}
			}
		}
	},
	(request: FastifyRequest<FastifyRequestGeneric>, reply) => {
		return documentHandler.handleGet(request, reply);
	}
);

fastify.post<{ Body: SwaggerTypes.PostBodyType; Reply: SwaggerTypes.CreatedDocumentType }>(
	'/documents',
	{
		schema: {
			description: 'Get a document by its id',
			tags: ['POST'],
			body: SwaggerTypes.PostBody,
			response: {
				201: {
					description: 'The key of the created document.',
					...SwaggerTypes.CreatedDocument
				},
				...SwaggerTypes.FastifyError,
				413: {
					description: `An error indicating that the document exceeds the maximum length of ${config.maxLength} bytes.`,
					...SwaggerTypes.Error
				},
				500: {
					description: 'An error indicating that the document could not be saved.',
					...SwaggerTypes.Error
				}
			}
		}
	},
	(request, reply) => {
		return documentHandler.handlePost(request, reply);
	}
);

// Otherwise, try to match static files
await fastify.register(import('@fastify/static'), {
	root: new URL('dist/frontend/', rootDir),
	prefix: '/',
	cacheControl: true,
	immutable: true,
	maxAge: '3d',
	wildcard: false
});

// Then we can loop back with a wildcard route, everything else should be a token,
// so route it back to sending index.html
fastify.get('*', { schema: { hide: true } }, (_, reply) => {
	return reply.sendFile('index.html');
});

const serverAddress = await fastify.listen({
	port: config.port,
	host: config.host
});

console.log('Server listening on', serverAddress);
