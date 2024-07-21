export default function <E extends Element = HTMLElement>(selector: string): E {
	return document.querySelector<E>(selector)!;
}
