export function selectElement(selector: string): HTMLElement {
	return document.querySelector<HTMLElement>(selector)!;
}

export function selectElementAll(selector: string): NodeListOf<HTMLElement> {
	return document.querySelectorAll<HTMLElement>(selector);
}
