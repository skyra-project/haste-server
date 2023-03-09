import { error, Stack } from '@pnotify/core';
import { HasteDocument } from './HasteDocument';
import type { Button } from './types';
import { selectElement } from './utils';

export class Haste {
	private appName = 'hastebin';
	private textArea = selectElement<HTMLTextAreaElement>('textarea')!;
	private box = selectElement('#box')!;
	private code = selectElement('#box code')!;
	private doc: HasteDocument | null = null;
	private buttons: Button[] = [
		{
			where: selectElement('#box2 .save'),
			label: 'Save',
			shortcutDescription: 'Control Or Command + s',
			shortcut: (evt) => (evt.ctrlKey || evt.metaKey) && evt.key === 's',
			action: () => {
				const textAreaValue = this.textArea.value;
				if (textAreaValue && textAreaValue.replace(/^\s+|\s+$/g, '') !== '') {
					this.saveDocument();
				}
			}
		},
		{
			where: selectElement('#box2 .new'),
			label: 'New',
			shortcutDescription: 'Control Or Command + n',
			shortcut: (evt) => (evt.ctrlKey || evt.metaKey) && evt.key === 'n',
			action: () => this.newDocument()
		},
		{
			where: selectElement('#box2 .duplicate'),
			label: 'Duplicate & Edit',
			shortcutDescription: 'Control Or Command + d',
			shortcut: (evt) => Boolean(this.doc?.locked) && (evt.ctrlKey || evt.metaKey) && evt.key === 'd',
			action: () => this.duplicateDocument()
		},
		{
			where: selectElement('#box2 .raw'),
			label: 'Just Text',
			shortcutDescription: 'Control Or Command + Shift + r',
			shortcut: (evt) => (evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.key === 'r',
			action: () =>
				this.doc && this.doc.key
					? window.location.assign(`${window.location.origin}/raw/${this.doc.key}`)
					: window.location.replace(window.location.href)
		}
	];

	/**
	 * pnotify messages stack positioned at the bottom left corner
	 */
	private messageStack = new Stack({
		dir1: 'up',
		dir2: 'right',
		firstpos1: 10,
		firstpos2: 10
	});

	/**
	 * Map of common extensions
	 *
	 * @remark this list does not need to include anything is its own extension
	 * due to the behavior of {@link lookupTypeByExtension} and {@link lookupExtensionByType}.
	 *
	 * @remark Optimized for {@link lookupTypeByExtension}
	 */
	private extensionsMap = new Map([
		['bash', 'bash'],
		['cc', 'cpp'],
		['cpp', 'cpp'],
		['css', 'css'],
		['diff', 'diff'],
		['go', 'go'],
		['htm', 'xml'],
		['html', 'xml'],
		['ini', 'ini'],
		['java', 'java'],
		['json', 'json'],
		['less', 'less'],
		['md', 'markdown'],
		['nginx', 'nginx'],
		['php', 'php'],
		['powershell', 'ps1'],
		['properties', 'properties'],
		['py', 'python'],
		['sh', 'bash'],
		['sql', 'sql'],
		['swift', 'swift'],
		['tex', 'tex'],
		['ts', 'typescript'],
		['txt', ''],
		['xml', 'xml']
	]);

	public constructor(appName: string) {
		this.appName = appName;

		this.configureShortcuts();

		for (const button of this.buttons) {
			this.configureButton(button);
		}
	}

	public newDocument() {
		this.box.style.display = 'none';
		this.doc = new HasteDocument();

		window.history.pushState(null, this.appName, '/');

		this.setTitle();
		this.setButtonsEnabled(true);
		this.textArea.value = '';
		this.textArea.style.display = '';
		this.textArea.focus();
		this.removeLineNumbers();
	}

	/**
	 * Loads a document and shows it
	 * @param url The url of the document to load
	 */
	public loadDocument(url: string) {
		const parts = url.split('.', 2);
		this.doc = new HasteDocument();
		void this.doc.load(
			parts[0],
			(ret) => {
				if (ret) {
					this.code.innerHTML = ret.value;
					this.setTitle(ret.key);
					this.setButtonsEnabled(false);
					this.textArea.value = '';
					this.textArea.style.display = 'none';
					this.box.style.display = '';
					this.box.focus();
					this.addLineNumbers(ret.lineCount);
				} else {
					this.newDocument();
				}
			},
			this.lookupTypeByExtension(parts[1])
		);
	}

	/**
	 * Duplicate the current document - only if locked
	 */
	private duplicateDocument() {
		if (this.doc?.locked && this.doc.data) {
			const currentData = this.doc.data;
			this.newDocument();
			this.textArea.value = currentData;
		}
	}

	/**
	 * Saves the current document to the database
	 */
	private saveDocument() {
		const textAreaValue = this.textArea.value;
		if (this.doc && textAreaValue) {
			void this.doc.save(textAreaValue, (err, ret) => {
				if (err) {
					this.showMessage(err.message);
				} else if (ret) {
					this.code.innerHTML = ret.value;
					this.setTitle(ret.key);
					let file = `/${ret.key}`;
					if (ret.language) {
						file += `.${this.lookupExtensionByType(ret.language)}`;
					}
					if (this.doc) {
						this.doc.key = ret.key;
					}
					window.history.pushState(null, this.appName + '-' + ret.key, file);
					this.setButtonsEnabled(false);
					this.textArea.value = '';
					this.textArea.style.display = 'none';
					this.box.style.display = '';
					this.box.focus();
					this.addLineNumbers(ret.lineCount);
				}
			});
		}
	}

	/**
	 * Sets the page title
	 * @param ext The extension to add to the page title
	 */
	private setTitle(ext?: string) {
		const title = ext ? `${this.appName} - ${ext}` : this.appName;
		document.title = title;
	}

	/**
	 * Enables the buttons when viewing an existing document
	 */
	private setButtonsEnabled(newDocument: boolean) {
		for (const button of ['duplicate', 'raw']) {
			newDocument
				? selectElement(`#box2 .function.${button}`).classList.remove('enabled')
				: selectElement(`#box2 .function.${button}`).classList.add('enabled');
		}

		newDocument
			? selectElement('#box2 .function.save').classList.add('enabled')
			: selectElement('#box2 .function.save').classList.remove('enabled');
	}

	/**
	 * Looks up extension preferred for a given type.
	 * If none is found then the type itself is returned - which we'll use as the extension
	 * @param type The extension type to look up
	 */
	private lookupExtensionByType(type: string) {
		for (const [key, value] of this.extensionsMap.entries()) {
			if (value === type) return key;
		}

		return type;
	}

	/**
	 * Look up the type for a given extension
	 * If none is found then the extension itself is returned - which we'll use as the extension
	 * @param ext The extension to look up
	 */
	private lookupTypeByExtension(ext: string) {
		return this.extensionsMap.get(ext) ?? ext;
	}

	/**
	 * Adds the line numbers to the view
	 */
	private addLineNumbers(lineCount: number) {
		let numbers = '';

		for (let i = 0; i < lineCount; i++) {
			numbers += (i + 1).toString() + '<br/>';
		}

		selectElement('#linenos').innerHTML = numbers;
	}

	/**
	 * Removes the line numbers from view
	 */
	private removeLineNumbers() {
		selectElement('#linenos').innerHTML = '&gt;';
	}

	/**
	 * Configures a button
	 */
	private configureButton(button: Button) {
		button.where.onclick = (event) => {
			event.preventDefault();

			if (!button.clickDisabled && button.where.classList.contains('enabled')) {
				button.action();
			}
		};

		button.where.onmouseenter = () => {
			selectElement('#box3 .label').textContent = button.label;
			selectElement('#box3 .shortcut').textContent = button.shortcutDescription || '';
			selectElement('#box3').style.display = 'block';
		};

		button.where.onmouseleave = () => {
			selectElement('#box3').style.display = 'none';
		};
	}

	/**
	 * Configures keyboard shortcuts for all buttons
	 */
	private configureShortcuts() {
		document.body.onkeydown = (event) => {
			for (const button of this.buttons) {
				if (button.shortcut(event)) {
					event.preventDefault();
					button.action();
					break;
				}
			}
		};
	}

	private showMessage(message: string) {
		error({
			text: message,
			type: 'error',
			styling: 'material',
			icons: 'material',
			mode: 'dark',
			animateSpeed: 'normal',
			delay: 3000,
			stack: this.messageStack
		});
	}
}
