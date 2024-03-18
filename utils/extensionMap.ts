/**
 * Map of common extensions
 *
 * @remark this list does not need to include anything is its own extension
 * due to the behavior of {@link lookupTypeByExtension} and {@link lookupExtensionByType}.
 *
 * @remark Optimized for {@link lookupTypeByExtension}
 */
export const extensionsMap = new Map([
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
	['powershell', 'ps1'],
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
