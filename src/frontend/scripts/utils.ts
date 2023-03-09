export function selectElement<E extends Element = HTMLElement>(selector: string): E {
	return document.querySelector<E>(selector)!;
}

export function selectElementAll(selector: string): NodeListOf<HTMLElement> {
	return document.querySelectorAll<HTMLElement>(selector);
}
