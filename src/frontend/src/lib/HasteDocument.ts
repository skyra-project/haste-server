import { FetchMediaContentTypes, FetchResultTypes, QueryError, fetch } from '@sapphire/fetch';
import hljs, { type AutoHighlightResult, type HighlightResult } from 'highlight.js';
import type { DocumentData, LoadedHasteDocument } from './types.js';

/**
 * Represents a single document
 */
export class HasteDocument {
	public locked = false;
	public key: string | null = null;
	public data: string | null = null;

	/**
	 * Get this document from the backend and lock it here
	 * @param keyToFetch The key to fetch from the backend
	 * @param lang The language of the document to highlight with
	 */
	public async load(keyToFetch: string, lang: string): Promise<LoadedHasteDocument> {
		const { data, key } = await fetch<DocumentData>(
			`/documents/${keyToFetch}`,
			{
				headers: {
					'Content-Type': FetchMediaContentTypes.JSON,
					Accept: FetchMediaContentTypes.JSON
				}
			},
			FetchResultTypes.JSON
		);

		this.locked = true;
		this.key = key;
		this.data = data;

		let highlightResult: AutoHighlightResult | HighlightResult | Pick<HighlightResult, 'value' | 'language'> | null = null;

		try {
			if (lang === 'txt') {
				highlightResult = { value: this.htmlEscape(data), language: 'txt' };
			} else if (lang) {
				highlightResult = hljs.highlight(data, { language: lang });
			} else {
				highlightResult = hljs.highlightAuto(data);
			}
		} catch {
			// Failed to highlight, fallback to auto highlight
			highlightResult = hljs.highlightAuto(data);
		}

		return {
			value: highlightResult.value,
			key,
			language: highlightResult.language || lang,
			lineCount: data.split('\n').length
		};
	}

	/**
	 * Saves the data of the Haste document.
	 *
	 * @param data - The data to be saved.
	 * @returns A promise that resolves to a `LoadedHasteDocument` object if the save is successful, or `undefined` if the document is locked.
	 * @throws An error if there is an issue with the save operation.
	 */
	public async save(data: string): Promise<LoadedHasteDocument | undefined> {
		if (this.locked) {
			return;
		}

		try {
			this.data = data;

			const result = await fetch<DocumentData>(
				'/documents',
				{
					method: 'POST',
					body: data,
					headers: {
						'Content-Type': FetchMediaContentTypes.TextPlain,
						Accept: FetchMediaContentTypes.JSON
					}
				},
				FetchResultTypes.JSON
			);

			this.locked = true;
			const high = hljs.highlightAuto(data);

			return {
				value: high.value,
				key: (result as DocumentData).key,
				language: high.language || 'txt',
				lineCount: data.split('\n').length
			};
		} catch (error) {
			this.data = null;
			const queryError = error as QueryError;

			// Rethrow to be handled in the Haste class
			throw new Error(queryError.toJSON().message);
		}
	}

	/**
	 * Escapes HTML tag characters
	 * @param input The input to html escape
	 * @returns HTML escaped input
	 */
	private htmlEscape(input: string): string {
		return input.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	}
}
