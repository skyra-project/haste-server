import { HasteDocument } from './HasteDocument';
import type { Button } from './types';
import { selectElement, selectElementAll } from './utils';

export class Haste {
	private appName = 'hastebin';
	private textArea = selectElement('textarea')!;
	private box = selectElement('#box')!;
	private code = selectElement('#box code')!;
	private doc: HasteDocument | null = null;
	private buttons: Button[] = [
		{
			where: selectElement('#box2 .save'),
			label: 'Save',
			shortcutDescription: 'control or command + s',
			shortcut: (evt) => (evt.ctrlKey || evt.metaKey) && evt.key === 's',
			action: () => {
				const textAreaValue = this.textArea.getAttribute('value');
				if (textAreaValue && textAreaValue.replace(/^\s+|\s+$/g, '') !== '') {
					this.lockDocument();
				}
			}
		},
		{
			where: selectElement('#box2 .new'),
			label: 'New',
			shortcutDescription: 'Control or Command + n',
			shortcut: (evt) => (evt.ctrlKey || evt.metaKey) && evt.key === 'n',
			action: () => this.newDocument(!this.doc?.key)
		},
		{
			where: selectElement('#box2 .duplicate'),
			label: 'Duplicate & Edit',
			shortcutDescription: 'control or command + d',
			shortcut: (evt) => Boolean(this.doc?.locked) && (evt.ctrlKey || evt.metaKey) && evt.key === 'd',
			action: () => this.duplicateDocument()
		},
		{
			where: selectElement('#box2 .raw'),
			label: 'Just Text',
			shortcutDescription: 'Control or Command + shift + r',
			shortcut: (evt) => (evt.ctrlKey || evt.metaKey) && evt.shiftKey && evt.key === 'r',
			action: () =>
				this.doc ? window.location.assign(`${window.location.href}/raw/${this.doc.key}`) : window.location.replace(window.location.href)
		}
	];

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

	public newDocument(hideHistory: boolean) {
		this.box.style.display = 'none';
		this.doc = new HasteDocument();

		if (!hideHistory) {
			window.history.pushState(null, this.appName, '/');
		}

		this.setTitle();
		this.lightKey();
		this.textArea.setAttribute('value', '');
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
					this.fullKey();
					this.textArea.setAttribute('value', '');
					this.textArea.style.display = 'none';
					this.box.style.display = '';
					this.box.focus();
					this.addLineNumbers(ret.lineCount);
				} else {
					this.newDocument(false);
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
			this.newDocument(false);
			this.textArea.setAttribute('value', currentData);
		}
	}

	/**
	 * Locks the current document
	 */
	private lockDocument() {
		const textAreaValue = this.textArea.getAttribute('value');
		if (this.doc && textAreaValue) {
			void this.doc.save(textAreaValue, (err, ret) => {
				if (err) {
					console.error(err);
				} else if (ret) {
					this.code.innerHTML = ret.value;
					this.setTitle(ret.key);
					let file = `/${ret.key}`;
					if (ret.language) {
						file += `.${this.lookupExtensionByType(ret.language)}`;
					}
					window.history.pushState(null, this.appName + '-' + ret.key, file);
					this.fullKey();
					this.textArea.setAttribute('value', '');
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
	 * Configures the light keys
	 */
	private lightKey() {
		this.configureKey('new', 'save');
	}

	/**
	 * Configures the full keys
	 */
	private fullKey() {
		this.configureKey('new', 'duplicate', 'raw');
	}

	/**
	 * Sets up enabled buttons
	 * @param enabledButtons List of buttons to enable
	 */
	private configureKey(...enabledButtons: string[]) {
		const buttons = Array.from(selectElementAll('#box2 .function'));

		for (const enabledButton of enabledButtons) {
			for (const button of buttons) {
				if (button.classList.contains(enabledButton)) {
					button.classList.add('enabled');
				} else {
					button.classList.remove('enabled');
				}
			}
		}
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
}
