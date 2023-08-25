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
} from '../src/utils/workerSort';

import orderList from '../src/utils/orderConfig.json';

describe('checkEdgeCases', () => {
	it('should return correct priority index for flex width', () => {
		expect(checkEdgeCases('flex')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(flex-width)')),
		);
	});

	it('should return correct priority index for text-decoration', () => {
		expect(checkEdgeCases('decoration')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(text-decoration-thickness)')),
		);
	});

	it('should return correct priority index for font weight', () => {
		expect(checkEdgeCases('font')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(font-weight)')),
		);
	});
	it('should return correct priority index for border width', () => {
		expect(checkEdgeCases('border')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(border-width)')),
		);
	});

	it('should return correct priority index for text size', () => {
		expect(checkEdgeCases('text')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(font-size)')),
		);
	});
});

describe('checkImmediateEdgeCases', () => {
	it('should return correct priority index for "border"', () => {
		expect(checkImmediateEdgeCases('border')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(border-width)')),
		);
	});

	it('should return correct priority index for "outline"', () => {
		expect(checkImmediateEdgeCases('outline')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(outline-style)')),
		);
	});

	it('should return correct priority index for "ring"', () => {
		expect(checkImmediateEdgeCases('ring')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(ring-width)')),
		);
	});

	it('should return correct priority index for "shadow"', () => {
		expect(checkImmediateEdgeCases('shadow')).toEqual(
			orderList.priority.findIndex(elem => elem.includes('(box-shadow)')),
		);
	});

	it('should return null for unknown className', () => {
		expect(checkImmediateEdgeCases('unknown')).toBeNull();
	});
});

describe('cleanArbitraryContent', () => {
	it('should replace arbitrary content in brackets with "[value]"', () => {
		const input = 'bg-[red-500]';
		const output = 'bg-[value]';
		expect(cleanArbitraryContent(input)).toEqual(output);
	});

	it('should leave className unchanged if no arbitrary content present', () => {
		const input = 'text-center';
		expect(cleanArbitraryContent(input)).toEqual(input);
	});

	it('should handle multiple sets of brackets', () => {
		const input = 'border-[2px] bg-[red-500] text-[large]';
		expect(cleanArbitraryContent(input)).toMatchInlineSnapshot('"border-[value]"');
	});
});

describe('findAtomicClass', () => {
	const orderList = ['bg-red-500', 'text-center', 'p-4', 'border-2', 'flex-row', 'font-bold'];

	it('should find index of a class ', () => {
		expect(
			orderList.reduce((prev, current) => {
				return prev + findAtomicClass(current);
			}, 0),
		).toEqual(329);
	});
});

describe('getClassPriority', () => {
	it('should get priority index for a simple class', () => {
		const className = 'p-4';
		expect(getClassPriority(className, 0)).toEqual(46);
	});

	it('should handle arbitrary content and get priority index', () => {
		const className = 'bg-[url(image.jpg)]';
		const expectedIndex = 0;
		expect(getClassPriority(className, 0)).toEqual(expectedIndex);
	});

	it('should get priority index for a prefixed class', () => {
		const className = 'text-center';
		expect(getClassPriority(className, 0)).toEqual(94);
	});

	it('should handle modifier removal and get priority index', () => {
		const className = '-p-4';
		expect(getClassPriority(className, 0)).toEqual(46);
	});

	it('should handle edge cases and get priority index', () => {
		const className = 'border-2';
		expect(getClassPriority(className, 0)).toEqual(125);
	});

	it('should handle iteration and get priority index', () => {
		const className = 'p-4 text-center';
		expect(getClassPriority(className, 0)).toEqual(46);
	});
});

describe('getPrefixClassPriority', () => {
	it('should calculate prefix class priority', () => {
		const className = 'bg-red-500:hover:text-center:focus';
		expect(getPrefixClassPriority(className)).toEqual(0.03204);
	});

	it('should calculate prefix class priority with arbitrary values', () => {
		const className = 'bg-[url(image.jpg)]:hover:text-center';
		expect(getPrefixClassPriority(className)).toEqual(0.02094);
	});

	it('should calculate prefix class priority with multiple prefixes', () => {
		const className = 'hover:text-center:focus:border-2';
		expect(getPrefixClassPriority(className)).toEqual(203.03125);
	});

	it('should handle iteration and calculate prefix class priority', () => {
		const className = 'bg-red-500:hover:text-center:focus';
		expect(getPrefixClassPriority(className)).toEqual(0.03204);
	});
});

describe('removeModifier', () => {
	it('should remove leading hyphen from className', () => {
		const className = '-text-red-500';
		const expected = 'text-red-500';
		expect(removeModifier(className)).toEqual(expected);
	});

	it('should not remove hyphen from className without leading hyphen', () => {
		const className = 'font-bold';
		const expected = 'font-bold';
		expect(removeModifier(className)).toEqual(expected);
	});

	it('should remove negation symbol from className', () => {
		const className = '!hidden';
		const expected = 'hidden';
		expect(removeModifier(className)).toEqual(expected);
	});

	it('should not remove negation symbol from className without negation', () => {
		const className = 'flex';
		const expected = 'flex';
		expect(removeModifier(className)).toEqual(expected);
	});
});

describe('order', () => {
	it('should order class names correctly', () => {
		const classNames = ['font-bold', 'text-red-500', 'bg-gray-200', 'border-1', 'shadow-md'];

		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": true,
			  "orderedClassNames": [
			    "bg-gray-200",
			    "font-bold",
			    "text-red-500",
			    "border-1",
			    "shadow-md",
			  ],
			}
		`);
	});

	it('should handle empty array of class names', () => {
		const classNames = [];

		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": false,
			  "orderedClassNames": [],
			}
		`);
	});

	it('should maintain the order if class names are already sorted', () => {
		const classNames = ['bg-gray-200', 'font-bold', 'text-red-500', 'shadow-md'];

		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": false,
			  "orderedClassNames": [
			    "bg-gray-200",
			    "font-bold",
			    "text-red-500",
			    "shadow-md",
			  ],
			}
		`);
	});
});
