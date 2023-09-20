export const CLASS_FIELDS = /test/;
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
	if (!className || !className.includes(at)) {
		return null;
	}
	return className.substr(0, className.lastIndexOf(at));
}
