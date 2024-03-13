// Draws inspiration from pwgen and http://tools.arantius.com/password

function randOf(collection: string) {
	return () => collection[Math.floor(Math.random() * collection.length)];
}

// Helper methods to get an random vowel or consonant
const randVowel = randOf('aeiou');
const randConsonant = randOf('bcdfghjklmnpqrstvwxyz');

/**
 * Generate a phonetic key of alternating consonant & vowel
 */
export function createKey(keyLength: number) {
	let text = '';
	const start = Math.round(Math.random());

	for (let i = 0; i < keyLength; i++) {
		text += i % 2 === start ? randConsonant() : randVowel();
	}

	return text;
}
