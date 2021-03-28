void (await import('node:fs/promises')).copyFile(
	new URL('robots.txt', new URL('../src/frontend/', import.meta.url)),
	new URL('robots.txt', new URL('../dist/', import.meta.url))
);
