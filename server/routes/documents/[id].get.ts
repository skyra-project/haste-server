/**
 * Handle retrieving a document
 */
export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, 'id');

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: 'No document id specified.'
		});
	}

	const result = await useStorage('redis').getItem(id);

	if (!result) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Document not found.'
		});
	}

	return {
		data: result,
		key: id
	};
});
