import { fileURLToPath } from 'node:url';

export const CLASS_FIELDS = ['class', 'classname'];

export const distDir = fileURLToPath(new URL('../dist', import.meta.url));
/**
 * Removes empty-string array slots and possible linebreaks
 * @param classArr raw className array from node
 * @returns {Array<string>} formatted array of classNames
 */
export function sanitizeNode(classArr) {
	classArr = classArr
		.filter(elem => {
			return elem !== '';
		})
		.map(elem => {
			return elem.replace(/\r?\n|\r/g, '');
		});
	return classArr;
}
export function stripString(className, at) {
	if (!className.includes(at)) {
		return null;
	}
	return className.substr(0, className.lastIndexOf(at));
}
