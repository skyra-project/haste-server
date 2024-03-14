import { Type, type Static } from '@sinclair/typebox';

export const Error = Type.Object({
	error: Type.String(),
	code: Type.String(),
	message: Type.String(),
	statusCode: Type.Integer()
});

export const Params = Type.Object({
	id: Type.String()
});

export const RawDocument = Type.String();

export const PostBody = Type.String();

export const Document = Type.Object({
	data: Type.String(),
	key: Type.String()
});

export const CreatedDocument = Type.Object({
	key: Type.String()
});

export type RawDocumentType = Static<typeof RawDocument>;
export type DocumentType = Static<typeof Document>;
export type PostBodyType = Static<typeof PostBody>;
export type CreatedDocumentType = Static<typeof CreatedDocument>;
export type ParamsType = Static<typeof Params>;
