import { describe, expect, it } from 'vitest';

import {
	checkEdgeCases,
	checkImmediateEdgeCases,
	cleanArbitraryContent,
	findAtomicClass,
	getClassPriority,
	getPrefixClassPriority,
	order,
	removeModifier,
} from '../src/utils/workerSort'; // 请确保路径正确

describe('Order Classes Worker', () => {
	it('order should return ordered class names', () => {
		const classNames = ['text-red', 'bg-blue', 'flex', 'max-w-md']; // 示例类名
		const sortedClassNames = order(classNames).orderedClassNames;
		expect(sortedClassNames).toMatchInlineSnapshot(`
			[
			  "bg-blue",
			  "max-w-md",
			  "flex",
			  "text-red",
			]
		`);
	});
});
