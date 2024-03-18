import type { FastifyReply, FastifyRequest } from 'fastify';
import { createKey } from '../lib/keyGenerator.js';
import type { DocumentHandlerConfig, FastifyRequestGeneric } from '../lib/types.js';
import type { BaseDocumentStore } from '../stores/BaseDocumentStore.js';

/**
 * Handles document operations such as retrieving, creating, and handling raw versions of documents.
 */
export class DocumentHandler {
	#keyLength: number;
	#store: BaseDocumentStore;

	/**
	 * Creates an instance of DocumentHandler.
	 * @param config The configuration object for DocumentHandler.
	 */
	public constructor(config: DocumentHandlerConfig) {
		this.#keyLength = config.keyLength;
		this.#store = config.store;
	}

	/**
	 * Handle retrieving a document
	 * @param request The incoming request
	 * @param reply The outgoing reply
	 */
	public async handleGet(request: FastifyRequest<FastifyRequestGeneric>, reply: FastifyReply) {
		const [key] = request.params.id.split('.', 1);

		const result = await this.#store.get(key);

		if (result) {
			return reply.send({ data: result, key });
		}

		return reply.notFound('Document not found.');
	}

	/**
	 * Handle retrieving the raw version of a document
	 * @param request The incoming request
	 * @param reply The outgoing reply
	 */
	public async handleRawGet(request: FastifyRequest<FastifyRequestGeneric>, reply: FastifyReply) {
		const [key] = request.params.id.split('.', 1);

		const result = await this.#store.get(key);

		if (result) {
			return reply.send(result);
		}

		return reply.notFound('Document not found.');
	}

	/**
	 * Handle creating a new document
	 * @param request The incoming request
	 * @param reply The outgoing reply
	 */
	public async handlePost(request: FastifyRequest, reply: FastifyReply) {
		const typedBody = request.body as string;

		const key = await this.chooseKey();
		const storeResult = await this.#store.set(key, typedBody);

		if (storeResult) {
			return reply.code(201).send({ key });
		}

		return reply.internalServerError('Error adding document.');
	}

	private async chooseKey(): Promise<string> {
		const key = this.acceptableKey();
		const result = await this.#store.get(key);

		if (result !== null) {
			return this.chooseKey();
		}

		return key;
	}

	private acceptableKey() {
		return createKey(this.#keyLength);
	}
}
