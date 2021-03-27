export function selectElement(selector: string): HTMLElement {
	return document.querySelector<HTMLElement>(selector)!;
}
