export abstract class DocumentStore {
	/**
	 * Gets a file at a specified key
	 * @param key The key to retrieve
	 * @returns The data at the specified key, or `null` if it doesn't exist
	 */
	public abstract get(key: string): Promise<string | null>;
	/**
	 * Saves a file at a specified key
	 * @param key - The key to store
	 * @param data - The file to save
	 * @param callback - The callback to call when the data is saved
	 * @param skipExpire - Whether to skip the expiration
	 * @returns Whether the data was saved successfully
	 */
	public abstract set(key: string, data: string | Buffer, skipExpire?: boolean): Promise<boolean>;
}
