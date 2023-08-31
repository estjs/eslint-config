import { describe, expect, it } from 'vitest';

import { order, removeModifier } from '../src/utils/workerSort';

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
			  "isSorted": false,
			  "orderedClassNames": [
			    "font-bold",
			    "text-red-500",
			    "bg-gray-200",
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
			  "isSorted": true,
			  "orderedClassNames": [
			    "font-bold",
			    "text-red-500",
			    "bg-gray-200",
			    "shadow-md",
			  ],
			}
		`);
	});

	it('should work with', () => {
		const classNames = 'relative h-full w-full bg-white';
		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": true,
			  "orderedClassNames": [
			    "relative",
			    "w-full",
			    "h-full",
			    "bg-white",
			  ],
			}
		`);
		const classNames2 = 'relative  w-full h-full bg-white';
		expect(order(classNames2)).toMatchInlineSnapshot(`
			{
			  "isSorted": false,
			  "orderedClassNames": [
			    "relative",
			    "w-full",
			    "h-full",
			    "bg-white",
			  ],
			}
		`);
	});

	it('should work have not atomic class', () => {
		const classNames = 'w-full search-list-wrap border-b-1px';
		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": true,
			  "orderedClassNames": [
			    "search-list-wrap",
			    "w-full",
			    "border-b-1px",
			  ],
			}
		`);
	});
});
