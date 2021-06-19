import hljs, { AutoHighlightResult, HighlightResult } from 'highlight.js';
import { MimeTypes } from './constants';
import type { DocumentData, LoadCallback, SaveCallback } from './types';

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
	 * @param callback The callback to execute after fetching
	 * @param lang The language of the document to highlight with
	 */
	public async load(keyToFetch: string, callback: LoadCallback, lang: string): Promise<void> {
		try {
			const result = await fetch(`/documents/${keyToFetch}`, {
				headers: {
					'Content-Type': MimeTypes.ApplicationJson,
					Accept: MimeTypes.ApplicationJson
				}
			});
			const { data, key } = (await result.json()) as DocumentData;

			this.locked = true;
			this.key = key;
			this.data = data;

			let high: AutoHighlightResult | HighlightResult | Pick<HighlightResult, 'value' | 'language'> | null = null;

			try {
				if (lang === 'txt') {
					high = { value: this.htmlEscape(data), language: 'txt' };
				} else if (lang) {
					high = hljs.highlight(data, { language: lang });
				} else {
					high = hljs.highlightAuto(data);
				}
			} catch {
				// Failed to highlight, fallback to auto highlight
				high = hljs.highlightAuto(data);
			}

			callback({
				value: high.value,
				key,
				language: high.language || lang,
				lineCount: data.split('\n').length
			});
		} catch {
			callback(false);
		}
	}

	public async save(data: string, callback: SaveCallback): Promise<void> {
		if (this.locked) {
			return;
		}

		this.data = data;

		try {
			const response = await fetch('/documents', {
				method: 'POST',
				body: data,
				headers: {
					'Content-Type': MimeTypes.TextPlain,
					Accept: MimeTypes.ApplicationJson
				}
			});
			const result = (await response.json()) as DocumentData;
			this.locked = true;
			const high = hljs.highlightAuto(data);

			callback(null, {
				value: high.value,
				key: result.key,
				language: high.language || 'txt',
				lineCount: data.split('\n').length
			});
		} catch (error) {
			try {
				callback(JSON.parse(error));
			} catch {
				callback({
					message: 'Something went wrong!'
				});
			}
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
