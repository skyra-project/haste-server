/**
 * Handle creating a new document
 */
export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	if (typeof body !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid body.'
		});
	}

	const config = useRuntimeConfig(event);

	if (body.length > config.maxLength) {
		throw createError({
			statusCode: 413,
			statusMessage: 'Document exceeds maximum length.'
		});
	}

	const key = await chooseKey(config.keyLength);

	try {
		await useStorage('redis').setItem(key, body, {
			ttl: config.redisExpire
		});

		setResponseStatus(event, 201);

		return { key };
	} catch (error) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Error adding document.'
		});
	}
});

async function chooseKey(keyLength: number): Promise<string> {
	const key = createKey(keyLength);
	const result = await useStorage('redis').hasItem(key);

	if (result) {
		return chooseKey(keyLength);
	}

	return key;
}
