import { describe, expect, it } from 'vitest';

import { order } from '../src/utils/atomicOrder';

describe('order', () => {
	it('should order class names correctly', () => {
		const classNames = ['font-bold', 'text-red-500', 'bg-gray-200', 'border-1', 'shadow-md'];

		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": true,
			  "orderedClassNames": [
			    "text-red-500",
			    "bg-gray-200",
			    "border-1",
			    "font-bold",
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
			    "bg-gray-200",
			    "text-red-500",
			    "font-bold",
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
			    "h-full",
			    "w-full",
			    "bg-white",
			    "relative",
			  ],
			}
		`);
		const classNames2 = 'relative  w-full h-full bg-white';
		expect(order(classNames2)).toMatchInlineSnapshot(`
			{
			  "isSorted": true,
			  "orderedClassNames": [
			    "w-full",
			    "h-full",
			    "bg-white",
			    "relative",
			  ],
			}
		`);
	});

	it('should work have not atomic class', () => {
		const classNames = 'w-full search-list-wrap border-b-1px';
		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": false,
			  "orderedClassNames": [
			    "w-full",
			    "search-list-wrap",
			    "border-b-1px",
			  ],
			}
		`);
	});
	it('should work sorted with prefix classNames', () => {
		const classNames = 'sm:p-1 md:m-2 lg:text-white xl:font-200 2xl:bg-white dark:bg-dark';
		expect(order(classNames)).toMatchInlineSnapshot(`
			{
			  "isSorted": true,
			  "orderedClassNames": [
			    "sm:p-1",
			    "lg:text-white",
			    "xl:font-200",
			    "2xl:bg-white",
			    "md:m-2",
			    "dark:bg-dark",
			  ],
			}
		`);
	});
});
