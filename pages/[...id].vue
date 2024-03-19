<template>
	<div id="key">
		<div id="box1">
			<nuxt-link to="/about.md" id="logo" class="logo"></nuxt-link>
		</div>
		<div id="box2" class="pb-2 px-2 flex justify-center bg-[var(--dark-black)]">
			<UTooltip text="Save" :shortcuts="['Ctrl | ⌘', 'S']" :prevent="saveButtonDisabled">
				<UButton
					ref="saveButton"
					icon="i-heroicons-archive-box-arrow-down"
					size="lg"
					color="primary"
					square
					variant="ghost"
					:disabled="saveButtonDisabled"
					@click="handleSave"
					@keydown="handleSaveKeyDown"
				>
				</UButton>
			</UTooltip>
			<UTooltip text="New" :shortcuts="['Ctrl | ⌘', 'N']">
				<UButton
					icon="i-heroicons-document-plus"
					size="lg"
					color="primary"
					square
					variant="ghost"
					@click="handleNew"
					@keydown="handleNewKeyDown"
				>
				</UButton>
			</UTooltip>
			<UTooltip text="Duplicate & Edit" :shortcuts="['Ctrl | ⌘', 'D']" :prevent="duplicateButtonDisabled">
				<UButton
					ref="duplicateButton"
					icon="i-heroicons-pencil-square"
					size="lg"
					color="primary"
					square
					variant="ghost"
					:disabled="duplicateButtonDisabled"
					@click="handleDuplicate"
					@keydown="handleDuplicateKeyDown"
				>
				</UButton>
			</UTooltip>
			<UTooltip text="Just Text" :shortcuts="['Ctrl | ⌘', 'Shift', 'R']" :prevent="rawButtonDisabled">
				<UButton
					ref="rawButton"
					icon="i-heroicons-document-text"
					size="lg"
					color="primary"
					square
					variant="ghost"
					:disabled="rawButtonDisabled"
					@click="handleRaw"
					@keydown="handleRawKeyDown"
				>
				</UButton>
			</UTooltip>
		</div>
	</div>

	<div id="linenos" ref="lineNumbers"></div>
	<pre ref="inputBox" id="box" class="hljs" tabindex="0"><code ref="codeBox"></code></pre>
	<textarea
		ref="textArea"
		spellcheck="false"
		class="hidden bg-transparent border-0 text-white p-0 w-full h-full outline-0 resize-none text-[13px] my-0"
	></textarea>
</template>

<script setup lang="ts">
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import '~/utils/hljsConfig';

import { HasteDocument } from '~/utils/HasteDocument';

const textArea = ref<HTMLTextAreaElement | null>(null);
const inputBox = ref<HTMLPreElement | null>(null);
const lineNumbers = ref<HTMLDivElement | null>(null);
const saveButton = ref<HTMLButtonElement | null>(null);
const rawButton = ref<HTMLButtonElement | null>(null);
const duplicateButton = ref<HTMLButtonElement | null>(null);
const codeBox = ref<HTMLPreElement | null>(null);
const doc = ref<HasteDocument | null>(null);

const saveButtonDisabled = ref(false);
const duplicateButtonDisabled = ref(false);
const rawButtonDisabled = ref(false);

const route = useRoute();
const url = useRequestURL();
const router = useRouter();
const toast = useToast();

onMounted(async () => {
	if (route.path === '/') {
		newDocument();
	} else {
		await loadDocument(route.path.substring(1, route.path.length));
	}
});

function newDocument() {
	if (inputBox.value) {
		inputBox.value.classList.add('hidden');
	}

	doc.value = new HasteDocument();

	router.push('/');

	setTitle();
	setButtonsEnabled(true);

	if (textArea.value) {
		textArea.value.value = '';
		textArea.value.classList.remove('hidden');
		textArea.value.focus();
		removeLineNumbers();
	}
}

/**
 * Sets the page title
 * @param ext The extension to add to the page title
 */
function setTitle(ext?: string) {
	const title = ext ? `Hastebin - ${ext}` : 'Hastebin';
	useHead({
		title
	});
}

/**
 * Enables the buttons when viewing an existing document
 */
function setButtonsEnabled(newDocument: boolean) {
	if (newDocument) {
		saveButtonDisabled.value = false;
		duplicateButtonDisabled.value = true;
		rawButtonDisabled.value = true;
	} else {
		saveButtonDisabled.value = true;
		duplicateButtonDisabled.value = false;
		rawButtonDisabled.value = false;
	}
}

/**
 * Removes the line numbers from view
 */
function removeLineNumbers() {
	if (lineNumbers.value) {
		lineNumbers.value.innerHTML = '&gt;';
	}
}

async function loadDocument(url: string) {
	const parts = url.split('.', 2);
	doc.value = new HasteDocument();
	try {
		const ret = await doc.value.load(parts[0], lookupTypeByExtension(parts[1]));
		codeBox.value!.innerHTML = ret.value;
		setTitle(ret.key);
		setButtonsEnabled(false);
		textArea.value!.value = '';
		textArea.value!.classList.add('hidden');
		inputBox.value!.classList.remove('hidden');
		inputBox.value!.focus();
		addLineNumbers(ret.lineCount);
	} catch (error) {
		newDocument();
		showMessage('Unable to load document');
	}
}

/**
 * Looks up extension preferred for a given type.
 * If none is found then the type itself is returned - which we'll use as the extension
 * @param type The extension type to look up
 */
function lookupExtensionByType(type: string) {
	for (const [key, value] of extensionsMap.entries()) {
		if (value === type) return key;
	}

	return type;
}

/**
 * Look up the type for a given extension
 * If none is found then the extension itself is returned - which we'll use as the extension
 * @param ext The extension to look up
 */
function lookupTypeByExtension(ext: string) {
	return extensionsMap.get(ext) ?? ext;
}

/**
 * Adds the line numbers to the view
 */
function addLineNumbers(lineCount: number) {
	let numbers = '';

	for (let i = 0; i < lineCount; i++) {
		numbers += `${(i + 1).toString()}<br/>`;
	}

	lineNumbers.value!.innerHTML = numbers;
}

function handleSaveKeyDown(event: KeyboardEvent) {
	if ((event.ctrlKey || event.metaKey) && event.key === 's') {
		return handleSave();
	}
}

function handleNewKeyDown(event: KeyboardEvent) {
	if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
		return handleNew();
	}
}

function handleDuplicateKeyDown(event: KeyboardEvent) {
	if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
		return handleDuplicate();
	}
}

function handleRawKeyDown(event: KeyboardEvent) {
	if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'r') {
		return handleRaw();
	}
}

async function handleSave() {
	const textAreaValue = textArea.value?.value;
	if (textAreaValue && textAreaValue.replace(/^\s+|\s+$/g, '') !== '' && doc.value) {
		try {
			const returnedDocument = await doc.value.save(textAreaValue);

			if (returnedDocument) {
				codeBox.value!.innerHTML = returnedDocument.value;
				setTitle(returnedDocument.key);

				let file = `/${returnedDocument.key}`;
				if (returnedDocument.language) {
					file += `.${lookupExtensionByType(returnedDocument.language)}`;
				}

				doc.value.key = returnedDocument.key;
				navigateTo(file);
				setButtonsEnabled(false);
				textArea.value!.value = '';
				textArea.value!.classList.add('hidden');
				inputBox.value!.classList.remove('hidden');
				inputBox.value!.focus();
				addLineNumbers(returnedDocument.lineCount);
			}
		} catch (error) {
			showMessage((error as Error).message);
		}
	}
}

async function handleNew() {
	newDocument();
}

async function handleDuplicate() {
	if (doc.value?.locked && doc.value.data && textArea.value) {
		const currentData = doc.value.data;
		newDocument();
		textArea.value.value = currentData;
	}
}

async function handleRaw() {
	if (doc.value && doc.value.key) {
		window.location.assign(`${url.origin}/raw/${doc.value.key}`)
	}
}

function showMessage(message: string) {
	toast.add({
		id: 'error_message',
		color: 'red',
		title: message
	});
}
</script>
