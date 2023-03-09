import type { highlight, highlightAuto } from 'highlight.js';

export interface DocumentData {
	data: string;
	key: string;
}

export interface CallbackData {
	value: string;
	key: string;
	language: string;
	lineCount: number;
}

export interface SaveCallbackError {
	message: string;
}

export interface Button {
	where: HTMLElement;
	label: string;
	shortcutDescription: string;
	clickDisabled?: boolean;
	shortcut(event: KeyboardEvent): boolean;
	action(): void;
}

export type LoadCallback = (options: CallbackData | false) => void;
export type SaveCallback = (error: SaveCallbackError | null, options?: CallbackData) => void;

export type AutoHighlightResult = ReturnType<typeof highlightAuto>;
export type HighlightResult = ReturnType<typeof highlight>;
