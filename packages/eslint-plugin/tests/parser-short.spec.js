import { describe, expect, it } from 'vitest';
import parseShort from '../src/utils/parserShorthand';

describe('parse class with shorthand', () => {
	it('should work with margin shorthand', () => {
		const classX = ['m-l-10px', 'm-r-10px'];
		const classY = ['m-t-10px', 'm-b-10px'];
		const classA = ['m-x-10px', 'm-y-10px'];

		const resultMX = parseShort(classX);
		const resultMY = parseShort(classY);
		const resultMA = parseShort(classA);
		expect(resultMX.generated).toMatchInlineSnapshot(`
			[
			  "m-x-10px",
			]
		`);
		expect(resultMY.generated).toMatchInlineSnapshot(`
			[
			  "m-y-10px",
			]
		`);
		expect(resultMA.generated).toMatchInlineSnapshot(`
			[
			  "m-a-10px",
			]
		`);

		expect(resultMX.unused.length).toEqual(0);
		expect(resultMY.unused.length).toEqual(0);
		expect(resultMA.unused.length).toEqual(0);
	});

	it('should work with padding shorthand', () => {
		const classX = ['p-l-10px', 'p-r-10px'];
		const classY = ['p-t-10px', 'p-b-10px'];
		const classA = ['p-x-10px', 'p-y-10px'];

		const resultPX = parseShort(classX);
		const resultPY = parseShort(classY);
		const resultPA = parseShort(classA);

		expect(resultPX.generated).toMatchInlineSnapshot(['p-x-10px']);
		expect(resultPY.generated).toMatchInlineSnapshot(['p-y-10px']);
		expect(resultPA.generated).toMatchInlineSnapshot(['p-a-10px']);
		expect(resultPX.unused.length).toEqual(0);
		expect(resultPY.unused.length).toEqual(0);
		expect(resultPA.unused.length).toEqual(0);
	});

	it('should work with border shorthand', () => {
		const classBX = ['b-l-10px', 'b-r-10px'];
		const classBY = ['b-t-10px', 'b-b-10px'];
		const classBA = ['b-x-10px', 'b-y-10px'];

		const resultBX = parseShort(classBX);
		const resultBY = parseShort(classBY);
		const resultBA = parseShort(classBA);

		expect(resultBX.generated).toMatchInlineSnapshot(`
			[
			  "p-a-10px",
			]
		`);
		expect(resultBY.generated).toMatchInlineSnapshot(`
			[
			  "b-y-10px",
			]
		`);
		expect(resultBA.generated).toMatchInlineSnapshot(`
			[
			  "b-a-10px",
			]
		`);

		expect(resultBX.unused.length).toEqual(0);
		expect(resultBY.unused.length).toEqual(0);
		expect(resultBA.unused.length).toEqual(0);
	});
	it('should work with borderRadio shorthand', () => {
		const classBX = ['rd-l-10px', 'rd-r-10px'];
		const classBY = ['rd-t-10px', 'rd-b-10px'];
		const classBA = ['rd-x-10px', 'rd-y-10px'];

		const resultBX = parseShort(classBX);
		const resultBY = parseShort(classBY);
		const resultBA = parseShort(classBA);

		expect(resultBX.generated).toMatchInlineSnapshot(`
			[
			  "rd-x-10px",
			]
		`);
		expect(resultBY.generated).toMatchInlineSnapshot(`
			[
			  "rd-y-10px",
			]
		`);
		expect(resultBA.generated).toMatchInlineSnapshot(`
			[
			  "rd-a-10px",
			]
		`);

		expect(resultBX.unused.length).toEqual(0);
		expect(resultBY.unused.length).toEqual(0);
		expect(resultBA.unused.length).toEqual(0);
	});
});
