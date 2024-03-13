import type { FastifyReply, FastifyRequest } from 'fastify';
import type { DocumentStore } from './document_stores/base.js';
import { createKey } from './keyGenerator.js';
import type { DocumentHandlerConfig, FastifyRequestGeneric } from './types.js';

export class DocumentHandler {
	#keyLength: number;
	#store: DocumentStore;

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
		const key = request.params.id.split('.')[0];

		const result = await this.#store.get(key);

		if (result) {
			return reply //
				.type('application/json')
				.code(200)
				.send(this.isHeadRequest(request) ? undefined : { data: result, key });
		}

		return reply //
			.code(404)
			.send(this.isHeadRequest(request) ? undefined : { message: 'Document not found.' });
	}

	/**
	 * Handle retrieving the raw version of a document
	 * @param request The incoming request
	 * @param reply The outgoing reply
	 */
	public async handleRawGet(request: FastifyRequest<FastifyRequestGeneric>, reply: FastifyReply) {
		const key = request.params.id.split('.')[0];

		const result = await this.#store.get(key);

		if (result) {
			return reply //
				.type('text/plain; charset=UTF-8')
				.code(200)
				.raw.end(this.isHeadRequest(request) ? undefined : result);
		}

		return reply //
			.code(404)
			.send(this.isHeadRequest(request) ? undefined : { message: 'Document not found.' });
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
			return reply //
				.code(201)
				.send({ key });
		}

		return reply //
			.code(500)
			.send({ message: 'Error adding document.' });
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

	private isHeadRequest(request: FastifyRequest<FastifyRequestGeneric>) {
		return request.method.toUpperCase() === 'HEAD';
	}
}
