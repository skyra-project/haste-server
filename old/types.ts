export interface DocumentData {
	data: string;
	key: string;
}

export interface LoadedHasteDocument {
	value: string;
	key: string;
	language: string;
	lineCount: number;
}

export interface Button {
	where: HTMLElement;
	label: string;
	shortcutDescription: string;
	clickDisabled?: boolean;
	shortcut(event: KeyboardEvent): boolean;
	action(): Promise<void> | void;
}
