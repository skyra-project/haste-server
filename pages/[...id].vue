<template>
	<div id="key">
		<div id="box1">
			<nuxt-link to="/about.md" id="logo" class="logo"></nuxt-link>
		</div>
		<div id="box2" class="pb-2 px-2 flex justify-center bg-[var(--dark-black)]">
			<UTooltip text="Save" :shortcuts="['Ctrl | ⌘', 'S']">
				<UButton
					ref="saveButton"
					icon="i-heroicons-archive-box-arrow-down"
					size="lg"
					color="primary"
					square
					variant="ghost"
					@click="handleSave"
					@keydown="handleSaveKeyDown"
					class="save function button-picture"
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
					class="new function button-picture enabled"
				>
				</UButton>
			</UTooltip>
			<UTooltip text="Duplicate & Edit" :shortcuts="['Ctrl | ⌘', 'D']">
				<UButton
					ref="duplicateButton"
					icon="i-heroicons-pencil-square"
					size="lg"
					color="primary"
					square
					variant="ghost"
					@click="handleDuplicate"
					@keydown="handleDuplicateKeyDown"
					class="duplicate function button-picture"
				>
				</UButton>
			</UTooltip>
			<UTooltip text="Just Text" :shortcuts="['Ctrl | ⌘', 'Shift', 'R']">
				<UButton
					ref="rawButton"
					icon="i-heroicons-document-text"
					size="lg"
					color="primary"
					square
					variant="ghost"
					@click="handleRaw"
					@keydown="handleRawKeyDown"
					class="raw function button-picture"
				>
				</UButton>
			</UTooltip>
		</div>
	</div>

	<div id="linenos" ref="lineNumbers"></div>
	<pre ref="inputBox" id="box" style="display: none" class="hljs" tabindex="0"><code></code></pre>
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
const doc = ref<HasteDocument | null>(null);

const route = useRoute();
const router = useRouter();
const toast = useToast();

onMounted(() => {
	if (route.path === '/') {
		newDocument();
	} else {
		// await loadDocument(route.path.substring(1, route.path.length));
	}
});

function newDocument() {
	if (inputBox.value) {
		inputBox.value.style.display = 'none';
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
		// duplicateButton.value?.classList.add('enabled');
		// rawButton.value?.classList.add('enabled');
		// saveButton.value?.classList.add('enabled');
	} else {
		duplicateButton.value?.classList.remove('enabled');
		rawButton.value?.classList.remove('enabled');
		saveButton.value?.classList.remove('enabled');
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
	if (textArea.value && textArea.value.value && textArea.value.value.replace(/^\s+|\s+$/g, '') !== '') {
		// Implement
	}
}

async function handleNew() {
	newDocument();
}

async function handleDuplicate() {
	// Implement
}

async function handleRaw() {
	// Implement
}

function showMessage(message: string) {
	toast.add({
		id: 'error_message',
		color: 'red',
		title: message
	});
}
</script>
