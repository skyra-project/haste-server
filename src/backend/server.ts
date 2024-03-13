import Fastify, { type FastifyRequest } from 'fastify';
import { readFile } from 'node:fs/promises';
import { config } from './lib/config.js';
import { rootDir } from './lib/constants.js';
import { DocumentHandler } from './lib/documentHandler.js';
import type { FastifyRequestGeneric } from './lib/types.js';

// Use dynamic imports to ensure only one of the stores gets loaded
const preferredStore =
	config.storage.type === 'file'
		? new (await import('./lib/document_stores/file.js')).FileDocumentStore(config.storage)
		: new (await import('./lib/document_stores/redis.js')).RedisDocumentStore(config.storage);

// Load all static documents
for (const [name, path] of Object.entries(config.documents)) {
	const data = await readFile(path, 'utf-8');

	if (data) {
		await preferredStore.set(name, data, true);
	}
}

const documentHandler = new DocumentHandler({
	store: preferredStore,
	keyLength: config.keyLength
});

const fastify = Fastify({ bodyLimit: config.maxLength });

fastify.setErrorHandler((error, _, reply) => {
	if (error instanceof Fastify.errorCodes.FST_ERR_CTP_BODY_TOO_LARGE) {
		return reply.status(413).send({ message: 'Document exceeds maximum length.' });
	}

	return reply.send(error);
});

// Register the rate limit handler
await fastify.register(import('@fastify/rate-limit'), {
	max: 500,
	timeWindow: '1 minute'
});

// First try to match API routes
fastify.route({
	method: ['GET', 'HEAD'],
	url: '/raw/:id',
	handler: (request: FastifyRequest<FastifyRequestGeneric>, reply) => {
		return documentHandler.handleRawGet(request, reply);
	}
});

fastify.route({
	method: ['GET', 'HEAD'],
	url: '/documents/:id',
	handler: (request: FastifyRequest<FastifyRequestGeneric>, reply) => {
		return documentHandler.handleGet(request, reply);
	}
});

fastify.post('/documents', (request, reply) => {
	return documentHandler.handlePost(request, reply);
});

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
fastify.get('*', (_, reply) => {
	return reply.sendFile('index.html');
});

const serverAddress = await fastify.listen({
	port: config.port,
	host: config.host
});

console.log('Server listening on', serverAddress);
