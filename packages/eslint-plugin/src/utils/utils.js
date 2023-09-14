import { fileURLToPath } from 'node:url';

export const CLASS_FIELDS = ['class', 'className'];

export const distDir = fileURLToPath(new URL('../dist', import.meta.url));

/**
 *
 * @param classArr
 */
export function sanitizeNode(classArr) {
	if (!classArr || !classArr.length) {
		return [];
	}

	classArr = Array.from(new Set(Array.isArray(classArr) ? classArr : classArr.split(' ')));
	classArr = classArr.filter(Boolean).map(elem => {
		return elem.replace(/\r?\n|\r/g, '');
	});
	return classArr;
}

/**
 *
 * @param className
 * @param at
 */
export function stripString(className, at) {
	if (!className.includes(at)) {
		return null;
	}
	return className.substr(0, className.lastIndexOf(at));
}
